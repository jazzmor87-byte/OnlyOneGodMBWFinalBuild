#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(process.argv[2] || process.cwd());
const marker = 'MBW_V42_FUNCTION_MAP_NULL_LOC_GUARD';

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function resolveFrom(request, bases) {
  for (const base of bases) {
    try {
      return require.resolve(request, { paths: [base] });
    } catch {}
  }
  return '';
}

function collectGenerateFunctionMapFiles() {
  const found = new Set();
  const direct = [
    path.join(
      root,
      'node_modules',
      'expo',
      'node_modules',
      '@expo',
      'metro',
      'metro-source-map',
      'src',
      'generateFunctionMap.js'
    ),
    path.join(
      root,
      'node_modules',
      '@expo',
      'metro',
      'metro-source-map',
      'src',
      'generateFunctionMap.js'
    ),
    path.join(
      root,
      'node_modules',
      'metro-source-map',
      'src',
      'generateFunctionMap.js'
    ),
  ];

  for (const candidate of direct) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      found.add(path.resolve(candidate));
    }
  }

  const start = path.join(root, 'node_modules');
  const queue = [{ directory: start, depth: 0 }];
  const maxDepth = 9;

  while (queue.length) {
    const current = queue.shift();
    if (!current || current.depth > maxDepth) {
      continue;
    }

    let entries = [];
    try {
      entries = fs.readdirSync(current.directory, {
        withFileTypes: true,
      });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const absolute = path.join(current.directory, entry.name);
      if (
        entry.name === '.bin' ||
        entry.name === '.cache'
      ) {
        continue;
      }

      if (entry.name === 'metro-source-map') {
        const candidate = path.join(
          absolute,
          'src',
          'generateFunctionMap.js'
        );
        if (
          fs.existsSync(candidate) &&
          fs.statSync(candidate).isFile()
        ) {
          found.add(path.resolve(candidate));
        }
      }

      queue.push({
        directory: absolute,
        depth: current.depth + 1,
      });
    }
  }

  return [...found].sort();
}

function patchFile(filename) {
  const original = fs.readFileSync(filename, 'utf8');

  if (original.includes(marker)) {
    return {
      filename,
      state: 'ALREADY_PATCHED',
      before: sha256(original),
      after: sha256(original),
    };
  }

  if (
    !original.includes('functionMapBabelPlugin') ||
    !original.includes('nullthrows(path.node.loc)')
  ) {
    return {
      filename,
      state: 'NOT_OWNER_SHAPE',
      before: sha256(original),
      after: sha256(original),
    };
  }

  const expression =
    /pushFrame\(\s*name\s*,\s*nullthrows\(\s*path\.node\.loc\s*\)\s*\);/;

  if (!expression.test(original)) {
    return {
      filename,
      state: 'OWNER_SHAPE_WITHOUT_PATCH_ANCHOR',
      before: sha256(original),
      after: sha256(original),
    };
  }

  const replacement = [
    `/* ${marker} */`,
    'const mbwFunctionMapLoc =',
    '  path.node.loc ||',
    '  (path.parentPath &&',
    '    path.parentPath.node &&',
    '    path.parentPath.node.loc) ||',
    '  {start: tailPos, end: tailPos};',
    'pushFrame(name, mbwFunctionMapLoc);',
  ].join('\n');

  const patched = original.replace(expression, replacement);
  if (patched === original) {
    throw new Error(
      `PATCH_DID_NOT_CHANGE_OWNER_FILE=${filename}`
    );
  }

  const backup = `${filename}.mbw-v42-original`;
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(filename, backup);
  }

  const temporary = `${filename}.mbw-v42.tmp`;
  fs.writeFileSync(temporary, patched);
  fs.renameSync(temporary, filename);

  const verified = fs.readFileSync(filename, 'utf8');
  if (
    !verified.includes(marker) ||
    verified.includes('pushFrame(name, nullthrows(path.node.loc));')
  ) {
    throw new Error(
      `PATCH_VERIFICATION_FAILED=${filename}`
    );
  }

  return {
    filename,
    backup,
    state: 'PATCHED',
    before: sha256(original),
    after: sha256(verified),
  };
}

function loadFunctionMapPlugin(ownerFiles) {
  const expoPackage = resolveFrom(
    'expo/package.json',
    [root]
  );
  const expoRoot = expoPackage
    ? path.dirname(expoPackage)
    : root;

  const moduleCandidates = [
    '@expo/metro/metro-source-map',
    '@expo/metro/metro-source-map/src/generateFunctionMap',
    'metro-source-map',
    'metro-source-map/src/generateFunctionMap',
  ];

  for (const request of moduleCandidates) {
    const resolved = resolveFrom(request, [expoRoot, root]);
    if (!resolved) {
      continue;
    }

    try {
      delete require.cache[resolved];
      const loaded = require(resolved);
      if (
        loaded &&
        typeof loaded.functionMapBabelPlugin === 'function'
      ) {
        return {
          plugin: loaded.functionMapBabelPlugin,
          resolved,
        };
      }
    } catch {}
  }

  for (const filename of ownerFiles) {
    try {
      delete require.cache[filename];
      const loaded = require(filename);
      if (
        loaded &&
        typeof loaded.functionMapBabelPlugin === 'function'
      ) {
        return {
          plugin: loaded.functionMapBabelPlugin,
          resolved: filename,
        };
      }
    } catch {}
  }

  throw new Error(
    'FUNCTION_MAP_PLUGIN_COULD_NOT_BE_LOADED'
  );
}

function proveVirtualView(ownerFiles) {
  const babelPath = resolveFrom(
    '@babel/core',
    [
      root,
      path.join(root, 'node_modules', 'expo'),
    ]
  );
  if (!babelPath) {
    throw new Error('BABEL_CORE_NOT_FOUND');
  }

  const babel = require(babelPath);
  const virtualView = path.join(
    root,
    'node_modules',
    'react-native',
    'src',
    'private',
    'components',
    'virtualview',
    'VirtualViewNativeComponent.js'
  );

  if (!fs.existsSync(virtualView)) {
    throw new Error(
      `VIRTUALVIEW_SOURCE_NOT_FOUND=${virtualView}`
    );
  }

  const loaded = loadFunctionMapPlugin(ownerFiles);
  const source = fs.readFileSync(virtualView, 'utf8');

  const result = babel.transformSync(source, {
    filename: virtualView,
    babelrc: false,
    configFile: false,
    ast: true,
    code: false,
    sourceMaps: false,
    parserOpts: {
      sourceType: 'unambiguous',
      plugins: ['flow', 'jsx'],
    },
    plugins: [loaded.plugin],
  });

  if (!result || !result.ast) {
    throw new Error(
      'VIRTUALVIEW_FUNCTION_MAP_PROOF_NO_AST'
    );
  }

  return {
    virtualView,
    pluginModule: loaded.resolved,
    metadataPresent: Boolean(
      result.metadata &&
      result.metadata.metro &&
      result.metadata.metro.functionMap
    ),
  };
}

const candidates = collectGenerateFunctionMapFiles();
if (!candidates.length) {
  throw new Error(
    'METRO_GENERATE_FUNCTION_MAP_OWNER_NOT_FOUND'
  );
}

const results = candidates.map(patchFile);
const ownerFiles = results
  .filter(value =>
    value.state === 'PATCHED' ||
    value.state === 'ALREADY_PATCHED'
  )
  .map(value => value.filename);

if (!ownerFiles.length) {
  throw new Error(
    'NO_METRO_FUNCTION_MAP_OWNER_WAS_PATCHED'
  );
}

const proof = proveVirtualView(ownerFiles);

console.log(`V42_METRO_OWNER_CANDIDATE_COUNT=${candidates.length}`);
console.log(`V42_METRO_OWNER_PATCHED_COUNT=${ownerFiles.length}`);

for (const result of results) {
  console.log(
    [
      'V42_METRO_OWNER_RESULT',
      result.state,
      result.before,
      result.after,
      result.filename,
    ].join('|')
  );
}

console.log(`V42_FUNCTION_MAP_MODULE=${proof.pluginModule}`);
console.log(`V42_VIRTUALVIEW_SOURCE=${proof.virtualView}`);
console.log(
  `V42_VIRTUALVIEW_FUNCTION_MAP_METADATA_PRESENT=${proof.metadataPresent}`
);
console.log('V42_FUNCTION_MAP_NULL_LOC_GUARD_GREEN=True');

