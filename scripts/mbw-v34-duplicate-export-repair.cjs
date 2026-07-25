const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2]);
const backup = path.resolve(process.argv[3]);
const output = process.argv[4];
const parser = require(require.resolve('@babel/parser', { paths: [root] }));
const manifestPath = path.join(backup, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestTargets = new Set(manifest.items.map(item => item.target));

const sourceExts = new Set(['.js','.jsx','.ts','.tsx','.cjs','.mjs']);
const excluded = new Set(['.git','node_modules','.expo','.metro','.gradle','build','dist','coverage','MBW_FILE_SUITES']);
const files = [];

function walk(directory) {
  let entries = [];
  try { entries = fs.readdirSync(directory, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    if (excluded.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && sourceExts.has(path.extname(full).toLowerCase())) {
      const rel = path.relative(root, full).replace(/\\/g, '/');
      if (/^scripts\/mbw-v(?:2[0-9]|3[0-4])-/.test(rel)) continue;
      files.push(full);
    }
  }
}
walk(root);

function pluginsFor(file) {
  const ext = path.extname(file).toLowerCase();
  const common = ['jsx','decorators-legacy','classProperties','classPrivateProperties','classPrivateMethods','dynamicImport','optionalChaining','nullishCoalescingOperator','topLevelAwait','importMeta','objectRestSpread'];
  if (ext === '.ts' || ext === '.tsx') return [...common, 'typescript'];
  return [...common, 'flow', 'flowComments'];
}

function parse(file, code, errorRecovery) {
  const ext = path.extname(file).toLowerCase();
  const attempts = [];
  if (ext === '.ts' || ext === '.tsx') attempts.push(pluginsFor(file));
  else attempts.push(pluginsFor(file), pluginsFor(file).filter(value => !['flow','flowComments'].includes(value)));
  let last;
  for (const plugins of attempts) {
    try {
      return parser.parse(code, {
        sourceType: 'unambiguous',
        allowReturnOutsideFunction: true,
        errorRecovery,
        plugins,
      });
    } catch (error) { last = error; }
  }
  throw last;
}

function ensureBackup(file) {
  const target = path.resolve(file);
  if (manifestTargets.has(target)) return;
  const rel = path.relative(root, target);
  const saved = path.join(backup, 'files', rel);
  fs.mkdirSync(path.dirname(saved), { recursive: true });
  fs.copyFileSync(target, saved);
  manifest.items.push({ target, backup: saved, existed: true });
  manifestTargets.add(target);
}

function declaredNames(declaration) {
  const names = [];
  function pattern(node) {
    if (!node) return;
    if (node.type === 'Identifier') names.push(node.name);
    else if (node.type === 'ObjectPattern') {
      for (const property of node.properties || []) {
        if (property.type === 'RestElement') pattern(property.argument);
        else pattern(property.value || property.argument);
      }
    } else if (node.type === 'ArrayPattern') {
      for (const element of node.elements || []) pattern(element);
    } else if (node.type === 'AssignmentPattern') pattern(node.left);
    else if (node.type === 'RestElement') pattern(node.argument);
  }
  if (!declaration) return names;
  if (declaration.id) pattern(declaration.id);
  if (declaration.type === 'VariableDeclaration') {
    for (const item of declaration.declarations || []) pattern(item.id);
  }
  return names;
}

function exportedName(specifier) {
  const value = specifier.exported || specifier.id;
  if (!value) return '';
  return value.name || value.value || '';
}

const changedFiles = [];
const repairedExports = [];
const unresolved = [];

for (const file of files) {
  let code;
  try { code = fs.readFileSync(file, 'utf8'); } catch { continue; }
  let ast;
  try { ast = parse(file, code, true); } catch { continue; }

  const seen = new Map();
  const edits = [];
  const localRepairs = [];
  const localUnresolved = [];

  for (const node of ast.program.body || []) {
    if (node.type === 'ExportDefaultDeclaration') {
      if (seen.has('default')) {
        localUnresolved.push({ name: 'default', reason: 'DUPLICATE_DEFAULT_EXPORT', line: node.loc?.start?.line || 0 });
      } else seen.set('default', node);
      continue;
    }

    if (node.type === 'ExportAllDeclaration') {
      if (node.exported) {
        const name = node.exported.name || node.exported.value || '';
        if (name) {
          if (seen.has(name)) localUnresolved.push({ name, reason: 'DUPLICATE_NAMESPACE_EXPORT', line: node.loc?.start?.line || 0 });
          else seen.set(name, node);
        }
      }
      continue;
    }

    if (node.type !== 'ExportNamedDeclaration') continue;

    if (node.declaration) {
      const names = declaredNames(node.declaration);
      const duplicate = names.filter(name => seen.has(name));
      const fresh = names.filter(name => !seen.has(name));
      if (duplicate.length && fresh.length === 0) {
        edits.push({ start: node.start, end: node.declaration.start, text: '' });
        for (const name of duplicate) localRepairs.push({ name, mode: 'REMOVE_REDUNDANT_EXPORT_KEYWORD', line: node.loc?.start?.line || 0 });
      } else if (duplicate.length) {
        for (const name of duplicate) localUnresolved.push({ name, reason: 'MIXED_DECLARATION_EXPORT_REQUIRES_MANUAL_SEMANTIC_CHOICE', line: node.loc?.start?.line || 0 });
      }
      for (const name of fresh) seen.set(name, node);
      continue;
    }

    const specifiers = node.specifiers || [];
    if (!specifiers.length) continue;
    const duplicateIndexes = [];
    const kept = [];
    for (let index = 0; index < specifiers.length; index += 1) {
      const specifier = specifiers[index];
      const name = exportedName(specifier);
      if (!name) { kept.push(specifier); continue; }
      if (seen.has(name)) {
        duplicateIndexes.push(index);
        localRepairs.push({ name, mode: 'REMOVE_LATER_DUPLICATE_EXPORT_SPECIFIER', line: specifier.loc?.start?.line || node.loc?.start?.line || 0 });
      } else {
        seen.set(name, node);
        kept.push(specifier);
      }
    }

    if (!duplicateIndexes.length) continue;
    if (!kept.length) {
      edits.push({ start: node.start, end: node.end, text: '' });
    } else {
      const prefix = code.slice(node.start, specifiers[0].start);
      const suffix = code.slice(specifiers[specifiers.length - 1].end, node.end);
      const middle = kept.map(specifier => code.slice(specifier.start, specifier.end)).join(', ');
      edits.push({ start: node.start, end: node.end, text: `${prefix}${middle}${suffix}` });
    }
  }

  if (localUnresolved.length) {
    unresolved.push({ file: path.relative(root, file).replace(/\\/g, '/'), issues: localUnresolved });
    continue;
  }
  if (!edits.length) continue;

  edits.sort((a, b) => b.start - a.start);
  let patched = code;
  for (const edit of edits) patched = patched.slice(0, edit.start) + edit.text + patched.slice(edit.end);

  try { parse(file, patched, false); }
  catch (error) {
    unresolved.push({
      file: path.relative(root, file).replace(/\\/g, '/'),
      issues: [{ reason: 'POST_REPAIR_PARSE_RED', message: String(error.message || error), line: error.loc?.line || 0 }],
    });
    continue;
  }

  ensureBackup(file);
  const temp = `${file}.mbw-v34.tmp`;
  fs.writeFileSync(temp, patched);
  fs.renameSync(temp, file);
  const rel = path.relative(root, file).replace(/\\/g, '/');
  changedFiles.push(rel);
  for (const repair of localRepairs) repairedExports.push({ file: rel, ...repair });
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
const result = {
  changedFileCount: changedFiles.length,
  changedFiles,
  duplicateExportRepairCount: repairedExports.length,
  repairedExports,
  unresolved,
  green: unresolved.length === 0,
};
fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(`WHOLE_APP_DUPLICATE_EXPORT_CHANGED_FILE_COUNT=${changedFiles.length}`);
console.log(`WHOLE_APP_DUPLICATE_EXPORT_REPAIR_COUNT=${repairedExports.length}`);
console.log(`WHOLE_APP_DUPLICATE_EXPORT_UNRESOLVED_COUNT=${unresolved.length}`);
for (const row of repairedExports.slice(0, 50)) console.log(`WHOLE_APP_DUPLICATE_EXPORT_REPAIR=${row.file}:${row.line}:${row.name}:${row.mode}`);
for (const row of unresolved.slice(0, 20)) console.log(`WHOLE_APP_DUPLICATE_EXPORT_UNRESOLVED=${row.file}:${JSON.stringify(row.issues)}`);
process.exit(result.green ? 0 : 40);
