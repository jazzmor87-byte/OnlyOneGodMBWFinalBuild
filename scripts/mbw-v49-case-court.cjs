#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3]);
const parser = require(require.resolve('@babel/parser',{paths:[root]}));

const sourceExts = ['.js','.jsx','.ts','.tsx','.mjs','.cjs'];
const skip = new Set(['node_modules','.git','.expo','.metro','dist','build','.gradle']);
const files = [];

function walk(dir) {
  let entries=[];
  try { entries=fs.readdirSync(dir,{withFileTypes:true}); } catch { return; }
  for (const entry of entries) {
    if (skip.has(entry.name)) continue;
    const abs=path.join(dir,entry.name);
    if (entry.isDirectory()) walk(abs);
    else if (entry.isFile() && sourceExts.includes(path.extname(entry.name).toLowerCase())) files.push(abs);
  }
}
function exactCandidate(base) {
  const candidates=[base];
  for (const ext of [...sourceExts,'.json']) candidates.push(base+ext);
  for (const ext of [...sourceExts,'.json']) candidates.push(path.join(base,'index'+ext));
  return candidates.find(file=>{try{return fs.statSync(file).isFile();}catch{return false;}}) || '';
}
function caseInsensitiveChild(dir,name) {
  let entries=[];
  try { entries=fs.readdirSync(dir); } catch { return ''; }
  const exact=entries.find(value=>value===name);
  if (exact) return exact;
  return entries.find(value=>value.toLowerCase()===name.toLowerCase()) || '';
}
function resolveCaseAware(importer,spec) {
  const raw=spec.split(/[?#]/)[0];
  const parts=raw.split('/').filter(Boolean);
  let current=path.dirname(importer);
  const corrections=[];
  for (const piece of parts) {
    if (piece === '.') continue;
    if (piece === '..') { current=path.dirname(current); continue; }
    const chosen=caseInsensitiveChild(current,piece);
    if (!chosen) {
      const base=path.join(current,piece);
      const direct=exactCandidate(base);
      if (direct) return {resolved:direct,corrections};
      // extension may be attached to a differently-cased basename
      let entries=[];
      try { entries=fs.readdirSync(current); } catch { return {resolved:'',corrections}; }
      const targets=[];
      for (const ext of [...sourceExts,'.json']) targets.push(piece+ext);
      for (const candidate of targets) {
        const folded=entries.find(value=>value.toLowerCase()===candidate.toLowerCase());
        if (folded) {
          if (folded !== candidate) corrections.push({expected:candidate,actual:folded});
          return {resolved:path.join(current,folded),corrections};
        }
      }
      return {resolved:'',corrections};
    }
    if (chosen !== piece) corrections.push({expected:piece,actual:chosen});
    current=path.join(current,chosen);
  }
  const resolved=exactCandidate(current) || (fs.existsSync(current) && fs.statSync(current).isFile() ? current : '');
  return {resolved,corrections};
}
walk(root);

const importRegexes=[
  /\bimport\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\bexport\s+[^'"]*?\s+from\s+['"]([^'"]+)['"]/g,
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
];
const result={files:files.length,relativeImports:0,unresolved:[],caseMismatches:[]};
for (const file of files) {
  let source='';
  try { source=fs.readFileSync(file,'utf8'); } catch { continue; }
  for (const regex of importRegexes) {
    regex.lastIndex=0;
    let m;
    while ((m=regex.exec(source))) {
      const spec=m[1];
      if (!spec.startsWith('.')) continue;
      result.relativeImports += 1;
      const found=resolveCaseAware(file,spec);
      const rel=path.relative(root,file).split(path.sep).join('/');
      if (!found.resolved) result.unresolved.push({file:rel,spec});
      else if (found.corrections.length) {
        result.caseMismatches.push({
          file:rel,spec,
          resolved:path.relative(root,found.resolved).split(path.sep).join('/'),
          corrections:found.corrections
        });
      }
    }
  }
}
result.unresolvedCount=result.unresolved.length;
result.caseMismatchCount=result.caseMismatches.length;
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(`V49_CASE_SOURCE_FILE_COUNT=${result.files}`);
console.log(`V49_CASE_RELATIVE_IMPORT_COUNT=${result.relativeImports}`);
console.log(`V49_CASE_UNRESOLVED_COUNT=${result.unresolvedCount}`);
console.log(`V49_CASE_MISMATCH_COUNT=${result.caseMismatchCount}`);
console.log(`V49_V47_CASE_INFLATION_RECLASSIFIED=${result.caseMismatchCount===0}`);

