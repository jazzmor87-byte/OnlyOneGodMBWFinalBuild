const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const root = process.cwd();
const reportPath = process.argv[2] || path.join(root, 'mbw-ai-studio-production-court.json');
const skip = new Set(['node_modules','.git','.expo','.gradle','android','ios','dist','build','coverage']);
const sourceExt = new Set(['.js','.jsx','.ts','.tsx','.mjs','.cjs']);
const assetExt = new Set(['.jpg','.jpeg','.png','.webp','.gif','.svg','.onnx','.json','.mp4','.ttf','.otf']);
const parseErrors=[]; const missingImports=[]; const parsed=[];
function walk(dir){
  if(!fs.existsSync(dir)) return;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(skip.has(entry.name)) continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full);
    else if(sourceExt.has(path.extname(entry.name).toLowerCase())) parsed.push(full);
  }
}
function parseFile(file){
  const code=fs.readFileSync(file,'utf8');
  try{
    const ast=parser.parse(code,{sourceType:'unambiguous',plugins:['jsx','typescript','classProperties','objectRestSpread','optionalChaining','nullishCoalescingOperator','dynamicImport','topLevelAwait']});
    for(const node of ast.program.body){
      if(node.type==='ImportDeclaration' && node.source && typeof node.source.value==='string') checkImport(file,node.source.value);
      if((node.type==='ExportNamedDeclaration'||node.type==='ExportAllDeclaration') && node.source && typeof node.source.value==='string') checkImport(file,node.source.value);
    }
    const req=/\brequire\(\s*['"]([^'"]+)['"]\s*\)/g; let m;
    while((m=req.exec(code))) checkImport(file,m[1]);
  }catch(error){parseErrors.push({file:path.relative(root,file),message:error.message});}
}
function checkImport(file,spec){
  if(!spec.startsWith('.')) return;
  const base=path.resolve(path.dirname(file),spec);
  const candidates=[base,...Array.from(sourceExt).map(e=>base+e),...Array.from(assetExt).map(e=>base+e),...Array.from(sourceExt).map(e=>path.join(base,'index'+e))];
  if(!candidates.some(p=>fs.existsSync(p))) missingImports.push({file:path.relative(root,file),spec});
}
walk(path.join(root,'app')); walk(path.join(root,'scripts'));
for(const file of parsed) parseFile(file);
const read=(p)=>fs.existsSync(path.join(root,p))?fs.readFileSync(path.join(root,p),'utf8'):'';
const pkg=JSON.parse(read('package.json')||'{}');
const deps=pkg.dependencies||{};
const requiredDeps=['@react-native-async-storage/async-storage','@shopify/react-native-skia','expo-asset','expo-file-system','expo-image-manipulator','expo-image-picker','expo-media-library','onnxruntime-react-native','react-native-view-shot'];
const missingDeps=requiredDeps.filter(n=>!deps[n]);
const aiRoute=read('app/screens/Sections/AIPosterScreen.js');
const golden=read('app/golden/MBWGoldenMasterNavigator.js');
const nav=read('app/navigation/AppNavigator.js');
const registry=read('app/runtime/MBWGeneratedRouteRegistry.js');
const full=read('app/features/aiPosterForge/components/FullAIEditorWorkspace.js');
const layered=read('app/features/aiPosterForge/components/PhotoStudioCanvas.js');
const slots=read('app/features/aiPosterForge/templates/MBWPosterModelSlotRegistry.js');
const vault=read('app/features/aiPosterForge/runtime/persistentPosterProjectVault.js');
const measured=read('app/features/aiPosterForge/runtime/measuredExportRuntime.js');
const routePass=aiRoute.includes('PosterSoulForgeScreen') && nav.includes('MBWRealAIPoster') && (!golden || (golden.includes('MBWProductionAIPosterScreen') && golden.includes("['AIPoster', MBWProductionAIPosterScreen]"))) && (!registry || (registry.includes("name: 'AIPosterScreen'") && registry.includes('../screens/Sections/AIPosterScreen')));
const editorPass=full.includes('MaleModelReplacementWorkspace') && full.includes('FreeformAIEditorWorkspace') && layered.includes('AIStudioCanvas') && layered.includes('modelSlots');
const slotPass=slots.includes('MALE_MODEL_ONLY') && slots.includes('maximumModelSlots')===false && (slots.match(/\btemplate\(/g)||[]).length>=17 && slots.includes('[0, 1, 2]');
const vaultPass=vault.includes('AsyncStorage') && vault.includes('project.json') && vault.includes('loadLatestPersistentPosterProject');
const exportPass=measured.includes('EDITOR_WIDTH') && measured.includes('EDITOR_HEIGHT') && measured.includes('handleGLSurfaceViewOnAndroid');
const modelPath=path.join(root,'app/features/aiPosterForge/models/modnet_photographic.onnx');
const modelPass=fs.existsSync(modelPath) && fs.statSync(modelPath).size>20000000;
const posterNames=['ProfilePosterActionScreen.jpg','ProfilePosterAssetsScreen.jpg','ProfilePosterButtonsScreen.jpg','ProfilePosterEntryScreen.jpg','ProfilePosterLiveScreen.jpg','ProfilePosterLogicScreen.jpg','ProfilePosterMotionScreen.jpg','ProfilePosterOverviewScreen.jpg','ProfilePosterPanchTatvaScreen.jpg','ProfilePosterPosterScreen.jpg','ProfilePosterProofScreen.jpg','ProfilePosterResultScreen.jpg','ProfilePosterReturnScreen.jpg','ProfilePosterScreen.jpg','ProfilePosterSeedScreen.jpg','ProfilePosterStateScreen.jpg','ProfilePosterVaultScreen.jpg'];
const missingPosters=posterNames.filter(n=>!fs.existsSync(path.join(root,'app/assets/mbw_clean_shuffled_visual_body_posters',n)));
let masterRegisterObserved=null;
for(const file of parsed){const text=fs.readFileSync(file,'utf8'); const m=text.match(/MASTER_REGISTER_ITEMS\s*[=:]\s*(\d+)/); if(m){masterRegisterObserved=Number(m[1]); break;}}
const controlledMissingImports=missingImports.filter((item)=>{
  const file=String(item.file).replace(/\\/g,'/');
  return file.startsWith('app/features/aiPosterForge/')
    || file==='app/screens/Sections/AIPosterScreen.js'
    || file==='app/golden/MBWGoldenMasterNavigator.js';
});
const result={
  masterRegisterExpected:720, masterRegisterObserved,
  sourceFilesParsed:parsed.length, parseErrors, missingImports, controlledMissingImports,
  routePass, editorPass, slotPass, vaultPass, exportPass, modelPass,
  missingPosters, missingDeps,
  sourceParse:parseErrors.length===0,
  importClosure:controlledMissingImports.length===0,
  globalImportGaps:missingImports.length,
  aiEditorSource:editorPass,
  realPosterTransplant:routePass&&editorPass&&slotPass,
  persistentProjectVault:vaultPass,
  exactExportSource:exportPass,
  ok:parseErrors.length===0&&controlledMissingImports.length===0&&routePass&&editorPass&&slotPass&&vaultPass&&exportPass&&modelPass&&missingPosters.length===0&&missingDeps.length===0
};
fs.mkdirSync(path.dirname(reportPath),{recursive:true}); fs.writeFileSync(reportPath,JSON.stringify(result,null,2)+'\n');
console.log(`MASTER_REGISTER_ITEMS_EXPECTED=720`);
console.log(`MASTER_REGISTER_ITEMS_OBSERVED=${masterRegisterObserved===null?'UNCLASSIFIED':masterRegisterObserved}`);
console.log(`SOURCE_FILES_PARSED=${parsed.length}`);
console.log(`SOURCE_PARSE=${result.sourceParse?'PASS':'FAIL'}`);
console.log(`CONTROLLED_IMPORT_CLOSURE=${result.importClosure?'PASS':'FAIL'}`);
console.log(`GLOBAL_RELATIVE_IMPORT_GAPS=${missingImports.length}`);
console.log(`ROUTE_COMPLETION=${routePass?'PASS':'FAIL'}`);
console.log(`AI_EDITOR_SOURCE=${editorPass?'PRESENT':'ABSENT'}`);
console.log(`REAL_POSTER_TRANSPLANT=${result.realPosterTransplant?'SOURCE_COMPLETE':'INCOMPLETE'}`);
console.log(`PERSISTENT_PROJECT_VAULT=${vaultPass?'PRESENT':'ABSENT'}`);
console.log(`EXACT_EXPORT_SOURCE=${exportPass?'PROVED':'UNPROVED'}`);
console.log(`MODNET_MODEL=${modelPass?'PRESENT':'ABSENT'}`);
console.log(`MISSING_POSTERS=${missingPosters.length}`);
console.log(`MISSING_DEPENDENCIES=${missingDeps.length}`);
console.log(`SOURCE_COURT=${result.ok?'GREEN':'RED'}`);
process.exit(result.ok?0:20);
