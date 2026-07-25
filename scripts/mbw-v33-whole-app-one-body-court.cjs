const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2]);
const output = process.argv[3];
const parser = require(require.resolve('@babel/parser', { paths: [root] }));

const excludedDirs = new Set([
  '.git','node_modules','.expo','.metro','.gradle','build','dist','coverage',
  'MBW_FILE_SUITES','android/.gradle','android/build','android/app/build'
]);
const sourceExts = new Set(['.js','.jsx','.ts','.tsx','.cjs','.mjs']);
const textExts = new Set([...sourceExts,'.json','.gradle','.properties','.xml','.md','.txt']);
const assetExts = new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg','.mp4','.webm','.mov','.avi','.wav','.mp3','.m4a','.ttf','.otf','.woff','.woff2','.pdf','.onnx','.ort','.tflite','.pb','.bin']);
const resolveExts = [...sourceExts,'.json',...assetExts];

function relative(file) { return path.relative(root, file).replace(/\\/g, '/'); }
function excluded(file) {
  const rel = relative(file);
  if (!rel || rel === '.') return false;
  const parts = rel.split('/');
  if (parts.some(part => excludedDirs.has(part))) return true;
  if (rel.startsWith('android/.gradle/') || rel.startsWith('android/build/') || rel.startsWith('android/app/build/')) return true;
  if (/^scripts\/mbw-v(?:2[0-9]|3[0-3])-/.test(rel)) return true;
  if (/^(babel|metro)\.config\.mbw-v/.test(rel)) return true;
  return false;
}

const files=[];
function walk(directory) {
  let entries=[];
  try { entries=fs.readdirSync(directory,{withFileTypes:true}); } catch { return; }
  for (const entry of entries) {
    const full=path.join(directory,entry.name);
    if (excluded(full)) continue;
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) files.push(full);
  }
}
walk(root);

const sourceFiles=files.filter(file=>sourceExts.has(path.extname(file).toLowerCase()));
const parseErrors=[];
const unresolvedImports=[];
const caseMismatches=[];
const conflictMarkers=[];
const invalidAssets=[];
const actionableWarnings=[];
const imports=[];

function parseSource(file, code) {
  const ext=path.extname(file).toLowerCase();
  const common=['jsx','decorators-legacy','classProperties','classPrivateProperties','classPrivateMethods','dynamicImport','optionalChaining','nullishCoalescingOperator','topLevelAwait','importMeta','objectRestSpread'];
  const attempts=[];
  if (ext==='.ts' || ext==='.tsx') attempts.push([...common,'typescript']);
  else attempts.push(common,[...common,'flow','flowComments']);
  let lastError;
  for (const plugins of attempts) {
    try { return parser.parse(code,{sourceType:'unambiguous',allowReturnOutsideFunction:true,errorRecovery:false,plugins}); }
    catch (error) { lastError=error; }
  }
  throw lastError;
}

function visit(node, callback) {
  if (!node || typeof node!=='object') return;
  callback(node);
  for (const [key,value] of Object.entries(node)) {
    if (key==='loc' || key==='start' || key==='end' || key==='extra') continue;
    if (Array.isArray(value)) for (const item of value) visit(item,callback);
    else if (value && typeof value==='object' && value.type) visit(value,callback);
  }
}

function exactCaseExists(candidate) {
  const absolute=path.resolve(candidate);
  const parsed=path.parse(absolute);
  let cursor=parsed.root;
  const segments=absolute.slice(parsed.root.length).split(path.sep).filter(Boolean);
  for (const segment of segments) {
    let entries;
    try { entries=fs.readdirSync(cursor); } catch { return false; }
    if (!entries.includes(segment)) return false;
    cursor=path.join(cursor,segment);
  }
  return true;
}

function resolveImport(fromFile, specifier) {
  let base;
  if (specifier.startsWith('@/')) base=path.resolve(root,specifier.slice(2));
  else if (specifier.startsWith('~/')) base=path.resolve(root,specifier.slice(2));
  else if (specifier.startsWith('.')) base=path.resolve(path.dirname(fromFile),specifier);
  else return { external:true };
  const candidates=[];
  candidates.push(base);
  for (const ext of resolveExts) candidates.push(base+ext);
  for (const ext of resolveExts) candidates.push(path.join(base,'index'+ext));
  const packageFile=path.join(base,'package.json');
  if (fs.existsSync(packageFile)) {
    try {
      const data=JSON.parse(fs.readFileSync(packageFile,'utf8'));
      if (data.main) candidates.unshift(path.resolve(base,data.main));
    } catch {}
  }
  for (const candidate of candidates) {
    try {
      if (fs.statSync(candidate).isFile()) return { path:candidate, caseGreen:exactCaseExists(candidate) };
    } catch {}
  }
  return { path:'', caseGreen:false };
}

function assetMagicGreen(file) {
  const ext=path.extname(file).toLowerCase();
  let data;
  try { data=fs.readFileSync(file); } catch { return false; }
  if (!data.length) return false;
  if (ext==='.png') return data.length>=8 && data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (ext==='.jpg' || ext==='.jpeg') return data[0]===0xff && data[1]===0xd8;
  if (ext==='.webp') return data.length>=12 && data.toString('ascii',0,4)==='RIFF' && data.toString('ascii',8,12)==='WEBP';
  if (ext==='.gif') return data.toString('ascii',0,6)==='GIF87a' || data.toString('ascii',0,6)==='GIF89a';
  if (ext==='.mp4') return data.length>=12 && data.toString('ascii',4,8)==='ftyp';
  return data.length>0;
}

for (const file of sourceFiles) {
  let code='';
  try { code=fs.readFileSync(file,'utf8'); } catch (error) { parseErrors.push({file:relative(file),message:error.message}); continue; }
  if (/^(<<<<<<<|=======|>>>>>>>)/m.test(code)) conflictMarkers.push(relative(file));
  let ast;
  try { ast=parseSource(file,code); }
  catch (error) { parseErrors.push({file:relative(file),message:String(error.message||error),line:error.loc?.line||0}); continue; }
  visit(ast,node=>{
    let specifier='';
    if ((node.type==='ImportDeclaration' || node.type==='ExportNamedDeclaration' || node.type==='ExportAllDeclaration') && node.source?.value) specifier=node.source.value;
    else if (node.type==='CallExpression' && node.arguments?.length===1 && node.arguments[0]?.type==='StringLiteral') {
      if (node.callee?.type==='Identifier' && node.callee.name==='require') specifier=node.arguments[0].value;
      if (node.callee?.type==='Import') specifier=node.arguments[0].value;
    } else if (node.type==='ImportExpression' && node.source?.type==='StringLiteral') specifier=node.source.value;
    if (specifier) imports.push({file,specifier});

    if (node.type==='JSXOpeningElement') {
      const name=node.name?.name;
      if (['Pressable','TouchableOpacity','TouchableHighlight','TouchableWithoutFeedback','Button'].includes(name)) {
        const attrs=node.attributes||[];
        const hasHandler=attrs.some(a=>a.type==='JSXAttribute' && ['onPress','onLongPress'].includes(a.name?.name));
        const hasSpread=attrs.some(a=>a.type==='JSXSpreadAttribute');
        const disabled=attrs.some(a=>a.type==='JSXAttribute' && a.name?.name==='disabled');
        if (!hasHandler && !hasSpread && !disabled) actionableWarnings.push({file:relative(file),line:node.loc?.start?.line||0,component:name});
      }
    }
  });
}

for (const item of imports) {
  const result=resolveImport(item.file,item.specifier);
  if (result.external) continue;
  if (!result.path) unresolvedImports.push({file:relative(item.file),specifier:item.specifier});
  else {
    if (!result.caseGreen) caseMismatches.push({file:relative(item.file),specifier:item.specifier,resolved:relative(result.path)});
    if (assetExts.has(path.extname(result.path).toLowerCase()) && !assetMagicGreen(result.path)) invalidAssets.push(relative(result.path));
  }
}

for (const file of files) {
  if (assetExts.has(path.extname(file).toLowerCase()) && !assetMagicGreen(file)) invalidAssets.push(relative(file));
  if (textExts.has(path.extname(file).toLowerCase())) {
    try {
      const value=fs.readFileSync(file,'utf8');
      if (/^(<<<<<<<|=======|>>>>>>>)/m.test(value) && !conflictMarkers.includes(relative(file))) conflictMarkers.push(relative(file));
    } catch {}
  }
}

const lowerMap=new Map();
const duplicateCasePaths=[];
for (const file of files) {
  const rel=relative(file); const key=rel.toLowerCase();
  if (lowerMap.has(key) && lowerMap.get(key)!==rel) duplicateCasePaths.push([lowerMap.get(key),rel]);
  else lowerMap.set(key,rel);
}

const packageJson=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const main=packageJson.main||'index.js';
const mainResult=resolveImport(path.join(root,'__entry__.js'),'./'+main.replace(/^\.\//,''));
const entryGreen=Boolean(mainResult.path) || ['index.js','App.js','app/_layout.js','app/_layout.tsx'].some(value=>fs.existsSync(path.join(root,value)));

const result={
  sourceFileCount:sourceFiles.length,
  importCount:imports.length,
  parseErrors,
  unresolvedImports,
  caseMismatches,
  conflictMarkers:[...new Set(conflictMarkers)],
  invalidAssets:[...new Set(invalidAssets)],
  duplicateCasePaths,
  actionableWarnings,
  entryGreen,
  main,
};
result.green=Boolean(
  result.sourceFileCount>0 && result.entryGreen &&
  !result.parseErrors.length && !result.unresolvedImports.length &&
  !result.caseMismatches.length && !result.conflictMarkers.length &&
  !result.invalidAssets.length && !result.duplicateCasePaths.length
);
fs.writeFileSync(output,JSON.stringify(result,null,2));
console.log(`WHOLE_APP_SOURCE_FILE_COUNT=${result.sourceFileCount}`);
console.log(`WHOLE_APP_IMPORT_COUNT=${result.importCount}`);
console.log(`WHOLE_APP_PARSE_ERROR_COUNT=${result.parseErrors.length}`);
console.log(`WHOLE_APP_UNRESOLVED_IMPORT_COUNT=${result.unresolvedImports.length}`);
console.log(`WHOLE_APP_CASE_MISMATCH_COUNT=${result.caseMismatches.length}`);
console.log(`WHOLE_APP_CONFLICT_MARKER_COUNT=${result.conflictMarkers.length}`);
console.log(`WHOLE_APP_INVALID_ASSET_COUNT=${result.invalidAssets.length}`);
console.log(`WHOLE_APP_DUPLICATE_CASE_PATH_COUNT=${result.duplicateCasePaths.length}`);
console.log(`WHOLE_APP_ACTIONABLE_WARNING_COUNT=${result.actionableWarnings.length}`);
console.log(`WHOLE_APP_ENTRY_GREEN=${result.entryGreen}`);
console.log(`WHOLE_APP_ONE_BODY_GREEN=${result.green}`);
for (const row of result.parseErrors.slice(0,20)) console.log(`WHOLE_APP_PARSE_ERROR=${row.file}:${row.line}:${row.message}`);
for (const row of result.unresolvedImports.slice(0,20)) console.log(`WHOLE_APP_UNRESOLVED_IMPORT=${row.file}:${row.specifier}`);
process.exit(result.green?0:40);
