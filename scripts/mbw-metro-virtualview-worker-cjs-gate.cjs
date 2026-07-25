'use strict';
/*
 * MBW_V70_CLEAN_EXPO_TRANSFORMER_BRIDGE
 * Legacy V44–V69 Metro/function-map mutation is deliberately disabled.
 * This module now forwards the exact official Expo Babel transformer contract.
 */
const fs = require('fs');
const path = require('path');

function firstExisting(candidates) {
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  return null;
}
function safeResolve(request) {
  try { return require.resolve(request); } catch { return null; }
}

const root = path.resolve(__dirname, '..');
const expoEntry = safeResolve('expo');
const expoRoot = expoEntry
  ? path.dirname(path.dirname(expoEntry))
  : path.join(root, 'node_modules', 'expo');

const candidates = [
  safeResolve('expo/metro-config/babel-transformer'),
  safeResolve('@expo/metro-config/babel-transformer'),
  path.join(expoRoot, 'node_modules', '@expo', 'metro-config', 'build', 'babel-transformer.js'),
  path.join(root, 'node_modules', '@expo', 'metro-config', 'build', 'babel-transformer.js'),
];

const transformerPath = firstExisting(candidates);
if (!transformerPath) {
  const error = new Error(`MBW_V70_OFFICIAL_EXPO_TRANSFORMER_NOT_FOUND candidates=${JSON.stringify(candidates)}`);
  error.code = 'MBW_V70_OFFICIAL_EXPO_TRANSFORMER_NOT_FOUND';
  throw error;
}

const transformer = require(transformerPath);
if (!transformer || typeof transformer.transform !== 'function') {
  const error = new Error(`MBW_V70_INVALID_EXPO_TRANSFORMER path=${transformerPath}`);
  error.code = 'MBW_V70_INVALID_EXPO_TRANSFORMER';
  throw error;
}

module.exports = transformer;
module.exports.__MBW_V70_TRANSFORMER_PATH = transformerPath;
