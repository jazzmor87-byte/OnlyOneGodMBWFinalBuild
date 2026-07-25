#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const path = require('path');

const original = "";
const root = process.cwd();

function run(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: process.env,
    ...options,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

if (original && !original.includes('mbw-eas-post-install.cjs')) {
  const result = childProcess.spawnSync(original, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

run(process.execPath, [
  path.join(root, 'scripts', 'mbw-eas-android-native-fixes.cjs'),
]);
