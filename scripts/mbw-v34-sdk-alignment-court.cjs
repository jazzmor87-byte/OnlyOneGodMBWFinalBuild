const fs = require('fs');
const path = require('path');

const root = process.argv[2];
const output = process.argv[3];
const requiredReanimated = process.argv[4];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function resolvePackageJson(name) {
  const direct = path.join(root, 'node_modules', ...name.split('/'), 'package.json');
  if (fs.existsSync(direct)) return direct;
  try {
    const entry = require.resolve(name, { paths: [root] });
    let cursor = path.dirname(entry);
    while (cursor !== path.dirname(cursor)) {
      const candidate = path.join(cursor, 'package.json');
      if (fs.existsSync(candidate)) {
        try {
          const data = loadJson(candidate);
          if (data.name === name) return candidate;
        } catch {}
      }
      cursor = path.dirname(cursor);
    }
  } catch {}
  return '';
}

let semver;
try {
  semver = require(require.resolve('semver', { paths: [root] }));
} catch (error) {
  console.error(`SEMVER_RESOLUTION_FAILED=${error.message}`);
  process.exit(50);
}

const packageJson = loadJson(path.join(root, 'package.json'));
const expoPackage = loadJson(path.join(root, 'node_modules', 'expo', 'package.json'));
const bundled = loadJson(path.join(root, 'node_modules', 'expo', 'bundledNativeModules.json'));
const gradlePath = path.join(root, 'android', 'gradle.properties');
const gradle = fs.existsSync(gradlePath) ? fs.readFileSync(gradlePath, 'utf8') : '';
const legacyPaper = /^\s*newArchEnabled\s*=\s*false\s*$/m.test(gradle);

const declarations = {};
for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
  for (const [name, range] of Object.entries(packageJson[section] || {})) {
    declarations[name] = { section, range: String(range) };
  }
}

const rows = [];
const unexpectedMismatches = [];
const missingPackages = [];
const controlledExceptions = [];

for (const [name, declaration] of Object.entries(declarations).sort()) {
  if (!(name in bundled)) continue;
  const expectedRange = String(bundled[name]);
  const packagePath = resolvePackageJson(name);
  let installedVersion = '';
  if (packagePath) {
    try { installedVersion = String(loadJson(packagePath).version || ''); } catch {}
  }

  const validRange = semver.validRange(expectedRange);
  const compatible = Boolean(
    installedVersion && (
      validRange
        ? semver.satisfies(installedVersion, expectedRange, { includePrerelease: true })
        : installedVersion === expectedRange
    )
  );

  let classification = compatible ? 'COMPATIBLE' : 'MISMATCH';
  if (
    name === 'react-native-reanimated' &&
    installedVersion === requiredReanimated &&
    legacyPaper &&
    !('react-native-worklets' in declarations)
  ) {
    classification = 'CONTROLLED_LEGACY_PAPER_EXCEPTION';
    controlledExceptions.push({ name, installedVersion, expectedRange });
  } else if (!packagePath) {
    classification = 'MISSING';
    missingPackages.push({ name, declaredRange: declaration.range, expectedRange });
  } else if (!compatible) {
    unexpectedMismatches.push({ name, installedVersion, declaredRange: declaration.range, expectedRange });
  }

  rows.push({
    name,
    section: declaration.section,
    declaredRange: declaration.range,
    expectedRange,
    installedVersion,
    packagePath,
    classification,
  });
}

const workletsDeclared = 'react-native-worklets' in declarations;
const workletsPackagePath = resolvePackageJson('react-native-worklets');
const workletsInstalled = Boolean(workletsPackagePath);
if (workletsDeclared || workletsInstalled) {
  unexpectedMismatches.push({
    name: 'react-native-worklets',
    installedVersion: workletsInstalled ? String(loadJson(workletsPackagePath).version || '') : '',
    declaredRange: declarations['react-native-worklets']?.range || '',
    expectedRange: 'ABSENT_FOR_REANIMATED_3_LEGACY_PAPER',
  });
}

const expoMajor = Number(String(expoPackage.version || '').split('.')[0] || 0);
let classification = 'GREEN';
if (unexpectedMismatches.length || missingPackages.length || expoMajor !== 54) {
  classification = 'REPAIR_REQUIRED';
} else if (controlledExceptions.length) {
  classification = 'CONTROLLED_LEGACY_PAPER_EXCEPTION';
}

const result = {
  expoVersion: expoPackage.version,
  expoSdkMajor: expoMajor,
  legacyPaper,
  requiredReanimated,
  workletsDeclared,
  workletsInstalled,
  rows,
  controlledExceptions,
  unexpectedMismatches,
  missingPackages,
  classification,
  green: classification !== 'REPAIR_REQUIRED',
};
fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(`SDK_ALIGNMENT_EXPO_VERSION=${result.expoVersion}`);
console.log(`SDK_ALIGNMENT_CLASS=${classification}`);
console.log(`SDK_ALIGNMENT_UNEXPECTED_MISMATCH_COUNT=${unexpectedMismatches.length}`);
console.log(`SDK_ALIGNMENT_MISSING_PACKAGE_COUNT=${missingPackages.length}`);
console.log(`SDK_ALIGNMENT_LEGACY_EXCEPTION_COUNT=${controlledExceptions.length}`);
for (const row of unexpectedMismatches) {
  console.log(`SDK_ALIGNMENT_MISMATCH=${row.name}|INSTALLED=${row.installedVersion}|EXPECTED=${row.expectedRange}`);
}
for (const row of missingPackages) {
  console.log(`SDK_ALIGNMENT_MISSING=${row.name}|EXPECTED=${row.expectedRange}`);
}
process.exit(result.green ? 0 : 30);
