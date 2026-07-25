#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const file = path.join(
  root,
  'node_modules',
  '@react-native',
  'babel-plugin-codegen',
  'index.js',
);
const packageFile = path.join(
  root,
  'node_modules',
  '@react-native',
  'babel-plugin-codegen',
  'package.json',
);

const marker = 'MBW_CODEGEN_MULTI_PASS_IDEMPOTENCY_GATE_V2';

function fail(message, code = 1) {
  console.error('MBW_CODEGEN_GATE_RESULT=RED');
  console.error(`ACTIVE_BLOCKER=${message}`);
  process.exit(code);
}

function replaceUnique(source, pattern, replacement, authority) {
  const matches = source.match(pattern);

  if (!matches || matches.length !== 1) {
    fail(`PATCH_AUTHORITY_NOT_UNIQUE:${authority}`, 31);
  }

  return source.replace(pattern, replacement);
}

function validate(source) {
  const result = {
    markerCount: source.split(marker).length - 1,
    generatedProgramGuard:
      source.includes('__mbwIsGeneratedViewConfigProgram'),
    sourceNodeCapture:
      source.includes('this.defaultExportNode = path.node'),
    safePathCapture:
      source.includes('const __mbwDefaultExportPath = this.defaultExport'),
    safeNodeCapture:
      source.includes('const __mbwDefaultExportNode ='),
    earlyInsertionLock:
      source.includes('this.codeInserted = true;\n              const viewConfig'),
    safeLocation:
      source.includes('__mbwDefaultExportNode.loc'),
    safeReplacement:
      source.includes('__mbwDefaultExportPath.replaceWithMultiple'),
    unsafeReads:
      (
        source.match(
          /this\.defaultExport\.node\.(loc|start|end)/g,
        ) || []
      ).length,
  };

  for (const [name, value] of Object.entries(result)) {
    console.log(`${name.toUpperCase()}=${value}`);
  }

  const green =
    result.markerCount === 1 &&
    result.generatedProgramGuard &&
    result.sourceNodeCapture &&
    result.safePathCapture &&
    result.safeNodeCapture &&
    result.earlyInsertionLock &&
    result.safeLocation &&
    result.safeReplacement &&
    result.unsafeReads === 0;

  if (!green) {
    fail('CODEGEN_GATE_VALIDATION_FAILED', 32);
  }
}

if (!fs.existsSync(file) || !fs.existsSync(packageFile)) {
  fail('CODEGEN_PACKAGE_FILES_MISSING', 20);
}

const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
let source = fs.readFileSync(file, 'utf8');

console.log(`CODEGEN_VERSION=${pkg.version}`);
console.log(`CODEGEN_FILE=${file}`);

if (source.includes(marker)) {
  validate(source);
  console.log('PATCHED_COUNT=0');
  console.log('MBW_CODEGEN_GATE_RESULT=GREEN');
  process.exit(0);
}

const helper = `
/* ${marker} */
function __mbwIsGeneratedViewConfigProgram(path) {
  let programPath = path;

  while (
    programPath &&
    !(programPath.isProgram && programPath.isProgram())
  ) {
    programPath = programPath.parentPath;
  }

  const body =
    programPath &&
    programPath.node &&
    Array.isArray(programPath.node.body)
      ? programPath.node.body
      : [];

  return body.some(statement => {
    const declaration =
      statement &&
      statement.type === 'ExportNamedDeclaration'
        ? statement.declaration
        : statement;

    if (
      !declaration ||
      declaration.type !== 'VariableDeclaration' ||
      !Array.isArray(declaration.declarations)
    ) {
      return false;
    }

    return declaration.declarations.some(item => {
      return (
        item &&
        item.id &&
        item.id.type === 'Identifier' &&
        item.id.name === '__INTERNAL_VIEW_CONFIG'
      );
    });
  });
}

`;

source = replaceUnique(
  source,
  /module\.exports = function \(\{parse, types: t\}\) \{/,
  `${helper}module.exports = function ({parse, types: t}) {`,
  'MODULE_EXPORT_INSERTION',
);

source = replaceUnique(
  source,
  /this\.defaultExport = null;\s*this\.commandsExport = null;/,
  `this.defaultExport = null;
      this.defaultExportNode = null;
      this.commandsExport = null;`,
  'PRE_STATE_CAPTURE',
);

source = replaceUnique(
  source,
  /ExportNamedDeclaration\(path\) \{\s*if \(this\.codeInserted\) \{/,
  `ExportNamedDeclaration(path) {
          if (__mbwIsGeneratedViewConfigProgram(path)) {
            this.codeInserted = true;
            return;
          }

          if (this.codeInserted) {`,
  'GENERATED_PROGRAM_GUARD',
);

source = replaceUnique(
  source,
  /ExportDefaultDeclaration\(path, state\) \{\s*if \(isCodegenDeclaration\(path\.node\.declaration\)\) \{\s*this\.defaultExport = path;\s*\}/,
  `ExportDefaultDeclaration(path, state) {
          if (isCodegenDeclaration(path.node.declaration)) {
            this.defaultExport = path;
            this.defaultExportNode = path.node;
          }`,
  'DEFAULT_EXPORT_SOURCE_CAPTURE',
);

source = replaceUnique(
  source,
  /Program:\s*\{\s*exit\(path\) \{\s*if \(this\.defaultExport\) \{\s*const viewConfig/,
  `Program: {
          exit(path) {
            const __mbwDefaultExportPath = this.defaultExport;
            const __mbwDefaultExportNode =
              this.defaultExportNode ||
              (__mbwDefaultExportPath &&
                __mbwDefaultExportPath.node);

            if (
              !this.codeInserted &&
              __mbwDefaultExportPath &&
              __mbwDefaultExportPath.node &&
              __mbwDefaultExportNode
            ) {
              this.codeInserted = true;
              const viewConfig`,
  'SAFE_PROGRAM_EXIT',
);

source = replaceUnique(
  source,
  /if \(node\?\.loc\) \{\s*node\.loc = this\.defaultExport\.node\.loc;\s*node\.start = this\.defaultExport\.node\.start;\s*node\.end = this\.defaultExport\.node\.end;\s*\}/,
  `if (node?.loc && __mbwDefaultExportNode.loc) {
                  node.loc = __mbwDefaultExportNode.loc;
                  node.start = __mbwDefaultExportNode.start;
                  node.end = __mbwDefaultExportNode.end;
                }`,
  'SAFE_SOURCE_LOCATION',
);

source = replaceUnique(
  source,
  /this\.defaultExport\.replaceWithMultiple\(ast\.program\.body\);/,
  `__mbwDefaultExportPath.replaceWithMultiple(
                ast.program.body,
              );`,
  'SAFE_DEFAULT_EXPORT_REPLACEMENT',
);

fs.writeFileSync(file, source);
validate(source);

console.log('PATCHED_COUNT=1');
console.log('MBW_CODEGEN_GATE_RESULT=GREEN');
