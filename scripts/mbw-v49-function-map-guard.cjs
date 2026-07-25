#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(process.argv[2] || process.cwd());
const marker = 'MBW_V49_FUNCTION_MAP_SAFE_LOC_GUARD';

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
function resolveFrom(request, bases) {
  for (const base of bases) {
    try {
      return require.resolve(request, {paths:[base]});
    } catch {}
  }
  return '';
}

const expoPackage = resolveFrom('expo/package.json', [root]);
const expoRoot = expoPackage ? path.dirname(expoPackage) : root;
const parserPath = resolveFrom('@babel/parser', [root, expoRoot]);
const traversePath = resolveFrom('@babel/traverse', [root, expoRoot]);
const generatorPath = resolveFrom('@babel/generator', [root, expoRoot]);
const typesPath = resolveFrom('@babel/types', [root, expoRoot]);

if (!parserPath || !traversePath || !generatorPath || !typesPath) {
  throw new Error('BABEL_AST_TOOLCHAIN_NOT_FOUND');
}
const parser = require(parserPath);
const traverseModule = require(traversePath);
const generatorModule = require(generatorPath);
const t = require(typesPath);
const traverse = traverseModule.default || traverseModule;
const generate = generatorModule.default || generatorModule;

function parse(source, filename) {
  return parser.parse(source, {
    sourceType:'unambiguous',
    sourceFilename:filename,
    allowReturnOutsideFunction:true,
    allowAwaitOutsideFunction:true,
    plugins:[
      'flow','jsx','classProperties','classPrivateProperties',
      'classPrivateMethods','dynamicImport','optionalChaining',
      'nullishCoalescingOperator','topLevelAwait','objectRestSpread'
    ],
  });
}
function compact(node) {
  try { return generate(node, {compact:true}).code; } catch { return ''; }
}
function isPathNodeLoc(node) {
  return t.isMemberExpression(node) &&
    !node.computed &&
    t.isMemberExpression(node.object) &&
    !node.object.computed &&
    t.isIdentifier(node.object.object, {name:'path'}) &&
    t.isIdentifier(node.object.property, {name:'node'}) &&
    t.isIdentifier(node.property, {name:'loc'});
}
function isUnsafeNullthrows(node) {
  if (!t.isCallExpression(node) || node.arguments.length < 1) return false;
  if (!isPathNodeLoc(node.arguments[0])) return false;
  return compact(node.callee).toLowerCase().includes('nullthrows');
}
function isPushFrame(node) {
  if (!t.isCallExpression(node) || node.arguments.length < 2) return false;
  const direct = t.isIdentifier(node.callee, {name:'pushFrame'});
  const member = t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.property, {name:'pushFrame'});
  return (direct || member) && isUnsafeNullthrows(node.arguments[1]);
}
function safeFallback() {
  return t.logicalExpression(
    '||',
    t.memberExpression(
      t.memberExpression(t.identifier('path'), t.identifier('node')),
      t.identifier('loc')
    ),
    t.logicalExpression(
      '||',
      t.logicalExpression(
        '&&',
        t.logicalExpression(
          '&&',
          t.memberExpression(t.identifier('path'), t.identifier('parentPath')),
          t.memberExpression(
            t.memberExpression(t.identifier('path'), t.identifier('parentPath')),
            t.identifier('node')
          )
        ),
        t.memberExpression(
          t.memberExpression(
            t.memberExpression(t.identifier('path'), t.identifier('parentPath')),
            t.identifier('node')
          ),
          t.identifier('loc')
        )
      ),
      t.objectExpression([
        t.objectProperty(t.identifier('start'), t.identifier('tailPos')),
        t.objectProperty(t.identifier('end'), t.identifier('tailPos')),
      ])
    )
  );
}
function candidates() {
  const found = new Set();
  const direct = [
    path.join(root,'node_modules','metro-source-map','src','generateFunctionMap.js'),
    path.join(root,'node_modules','@expo','metro','metro-source-map','generateFunctionMap.js'),
    path.join(root,'node_modules','expo','node_modules','@expo','metro','metro-source-map','generateFunctionMap.js'),
  ];
  for (const file of direct) {
    try { if (fs.statSync(file).isFile()) found.add(path.resolve(file)); } catch {}
  }
  const start = path.join(root,'node_modules');
  const queue = [{dir:start, depth:0}];
  while (queue.length) {
    const item = queue.shift();
    if (!item || item.depth > 11) continue;
    let entries = [];
    try { entries = fs.readdirSync(item.dir,{withFileTypes:true}); } catch { continue; }
    for (const entry of entries) {
      const abs = path.join(item.dir,entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.bin' || entry.name === '.cache') continue;
        queue.push({dir:abs, depth:item.depth+1});
      } else if (
        entry.isFile() &&
        entry.name === 'generateFunctionMap.js' &&
        abs.split(path.sep).join('/').includes('/metro-source-map/')
      ) {
        found.add(path.resolve(abs));
      }
    }
  }
  return [...found].sort();
}
function inspectAndRepair(filename) {
  const original = fs.readFileSync(filename,'utf8');
  const before = sha256(original);
  let ast;
  try { ast = parse(original, filename); }
  catch (error) {
    const unsafeTextSignal =
      /nullthrows[^\n;]*path\.node\.loc/s.test(original);
    return {
      filename,
      state:unsafeTextSignal
        ? 'PARSE_RED_UNSAFE_TEXT_SIGNAL'
        : 'PARSE_RED_NO_UNSAFE_TEXT_SIGNAL',
      before,
      after:before,
      unsafe:unsafeTextSignal ? 1 : 0,
      patched:0,
      guarded:!unsafeTextSignal,
      detail:String(error.message||error)
    };
  }

  let unsafe = 0;
  let patched = 0;
  let functionMapSignals = 0;
  traverse(ast,{
    Identifier(p) {
      if (p.node.name === 'functionMapBabelPlugin' || p.node.name === 'pushFrame') {
        functionMapSignals += 1;
      }
    },
    CallExpression(p) {
      if (isPushFrame(p.node)) {
        unsafe += 1;
        p.node.arguments[1] = safeFallback();
        p.node.leadingComments = [{type:'CommentBlock',value:` ${marker} `}];
        patched += 1;
      }
    }
  });

  if (patched > 0) {
    const output = generate(ast,{comments:true,retainLines:true,compact:false},original).code;
    const backup = `${filename}.mbw-v49-original`;
    if (!fs.existsSync(backup)) fs.copyFileSync(filename, backup);
    const temp = `${filename}.mbw-v49.tmp`;
    fs.writeFileSync(temp, output);
    fs.renameSync(temp, filename);
    const final = fs.readFileSync(filename,'utf8');
    return {
      filename,state:'PATCHED_UNSAFE_OWNER',before,after:sha256(final),
      unsafe,patched,guarded:true,backup
    };
  }

  const textSafe = original.includes(marker) ||
    (
      original.includes('functionMapBabelPlugin') &&
      original.includes('pushFrame') &&
      !/nullthrows[^\n;]*path\.node\.loc/s.test(original)
    );
  const wrapperOnly = functionMapSignals === 0;

  return {
    filename,
    state:textSafe ? 'ALREADY_SAFE_OWNER' : (wrapperOnly ? 'NON_OWNER_WRAPPER' : 'OWNER_WITHOUT_UNSAFE_LOC'),
    before,
    after:before,
    unsafe,
    patched,
    guarded:textSafe || (!wrapperOnly && unsafe === 0),
  };
}

const list = candidates();
console.log(`V49_FUNCTION_MAP_CANDIDATE_COUNT=${list.length}`);
for (const file of list) console.log(`V49_FUNCTION_MAP_CANDIDATE=${file}`);
if (!list.length) throw new Error('FUNCTION_MAP_CANDIDATES_NOT_FOUND');

const rows = list.map(inspectAndRepair);
let guardedOwners = 0;
let unsafeRemaining = 0;
let patchCount = 0;
for (const row of rows) {
  if (row.guarded) guardedOwners += 1;
  unsafeRemaining += row.unsafe - row.patched;
  patchCount += row.patched;
  console.log([
    'V49_FUNCTION_MAP_OWNER',
    row.state,
    row.unsafe,
    row.patched,
    row.before,
    row.after,
    row.filename,
    row.detail || ''
  ].join('|'));
}
const parseGreenCandidateCount = rows.filter(
  row => !row.state.startsWith('PARSE_RED_UNSAFE')
).length;
const zeroUnsafeCandidateCount = rows.filter(
  row => !row.state.startsWith('PARSE_RED_UNSAFE') && (row.unsafe - row.patched) === 0
).length;

console.log(`V49_FUNCTION_MAP_PATCH_COUNT=${patchCount}`);
console.log(`V49_FUNCTION_MAP_GUARDED_OWNER_COUNT=${guardedOwners}`);
console.log(`V49_FUNCTION_MAP_PARSE_GREEN_CANDIDATE_COUNT=${parseGreenCandidateCount}`);
console.log(`V49_FUNCTION_MAP_ZERO_UNSAFE_CANDIDATE_COUNT=${zeroUnsafeCandidateCount}`);
console.log(`V49_FUNCTION_MAP_UNSAFE_REMAINING_COUNT=${unsafeRemaining}`);

if (
  unsafeRemaining !== 0 ||
  parseGreenCandidateCount < 1 ||
  zeroUnsafeCandidateCount < 1
) {
  throw new Error('FUNCTION_MAP_ZERO_UNSAFE_STATE_NOT_ESTABLISHED');
}
console.log('V49_FUNCTION_MAP_ZERO_UNSAFE_OWNER_SHAPES_GREEN=True');
console.log('V49_FUNCTION_MAP_GUARD_GREEN=True');

