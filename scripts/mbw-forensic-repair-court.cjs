const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(process.cwd());
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const bytes = (rel) => fs.readFileSync(path.join(ROOT, rel));
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const json = (rel) => JSON.parse(read(rel));
const gates = [];
const gate = (name, passed, detail) => {
  const row = { name, passed: Boolean(passed), detail };
  gates.push(row);
  console.log(`${name}=${row.passed ? 'PASS' : 'FAIL'}|${detail}`);
};

function imports(text) {
  const out = [];
  for (const pattern of [
    /import\s+(?:.|\n)*?\s+from\s+["']([^"']+)["']/g,
    /import\s*["']([^"']+)["']/g,
    /require\(\s*["']([^"']+)["']\s*\)/g,
  ]) {
    let match;
    while ((match = pattern.exec(text))) out.push(match[1]);
  }
  return out;
}

function resolveRelative(fromRel, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(ROOT, path.dirname(fromRel), specifier);
  for (const candidate of [
    base, `${base}.js`, `${base}.jsx`, `${base}.ts`, `${base}.tsx`,
    path.join(base, 'index.js'), path.join(base, 'index.tsx'),
  ]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return path.relative(ROOT, candidate).replace(/\\/g, '/');
    }
  }
  return null;
}

function reachable() {
  const queue = ['index.js'];
  const seen = new Set();
  while (queue.length) {
    const rel = queue.shift();
    if (seen.has(rel) || !exists(rel)) continue;
    seen.add(rel);
    for (const specifier of imports(read(rel))) {
      const target = resolveRelative(rel, specifier);
      if (target && !seen.has(target)) queue.push(target);
    }
  }
  return [...seen].sort();
}

const app = json('app.json').expo;
const pkg = json('package.json');
const manifest = read('android/app/src/main/AndroidManifest.xml');
const store = read('app/golden/MBWGoldenMasterStore.js');
const screens = read('app/golden/MBWGoldenMasterScreens.js');
const surface = read('app/golden/MBWOneVisualSurface.js');
const nav = read('app/golden/MBWGoldenMasterNavigator.js');
const registry = read('app/golden/MBWGoldenMasterRegistry.js');
const contracts = read('app/golden/MBWReleaseContracts.js');
const graph = reachable();
const graphText = graph.map(read).join('\n');
const video = bytes('app/assets/cinematic/mbw_cinematic.mp4');
const videoSha = crypto.createHash('sha256').update(video).digest('hex');

function functionBody(text, functionName) {
  const marker = new RegExp(
    `(?:export\\s+)?function\\s+${functionName}\\s*\\([^)]*\\)\\s*\\{`,
  );
  const match = marker.exec(text);
  if (!match) return '';

  const next = /\n(?:export\s+)?function\s+\w+\s*\(/g;
  next.lastIndex = match.index + match[0].length;
  const nextMatch = next.exec(text);

  return text.slice(
    match.index,
    nextMatch ? nextMatch.index : text.length,
  );
}

function resolveScreenShellBinding(text, componentName, expectedRoute) {
  const body = functionBody(text, componentName);

  const directMatch = body.match(
    /<Shell\s+routeName="([^"]+)"/,
  );

  if (directMatch) {
    return {
      bindingKind: 'DIRECT_SHELL',
      shellRoute: directMatch[1],
      delegatedComponent: null,
      delegatedRoute: null,
      helperUsesRouteParameter: false,
      valid: directMatch[1] === expectedRoute,
    };
  }

  const delegatedMatch = body.match(
    /<(\w+)\s+[^>]*routeName="([^"]+)"[^>]*\/>/,
  );

  if (!delegatedMatch) {
    return {
      bindingKind: 'UNRESOLVED',
      shellRoute: null,
      delegatedComponent: null,
      delegatedRoute: null,
      helperUsesRouteParameter: false,
      valid: false,
    };
  }

  const delegatedComponent = delegatedMatch[1];
  const delegatedRoute = delegatedMatch[2];
  const helperBody = functionBody(text, delegatedComponent);
  const helperUsesRouteParameter = (
    /<Shell\s+routeName=\{routeName\}/.test(helperBody)
  );

  return {
    bindingKind: 'DELEGATED_SHELL',
    shellRoute: delegatedRoute,
    delegatedComponent,
    delegatedRoute,
    helperUsesRouteParameter,
    valid: (
      delegatedRoute === expectedRoute
      && helperUsesRouteParameter
    ),
  };
}

function parseNavigatorRows(text) {
  const blockMatch = text.match(/const ROUTES = \[([\s\S]*?)\n\];/);
  if (!blockMatch) return [];
  const rows = [];
  const rowPattern = /\['([^']+)',\s*(\w+Screen)\]/g;
  let match;
  while ((match = rowPattern.exec(blockMatch[1]))) {
    rows.push({ route: match[1], component: match[2] });
  }
  return rows;
}

function parseRegistryRows(text) {
  const rows = new Map();
  const blockMatch = text.match(/MBW_GOLDEN_MASTER_ROUTES = Object\.freeze\(\{([\s\S]*?)\n\}\);/);
  if (!blockMatch) return rows;
  const linePattern = /^\s{2}(\w+):\s*\{([^\n]+)\},$/gm;
  let match;
  while ((match = linePattern.exec(blockMatch[1]))) {
    const route = match[1];
    const body = match[2];
    const mediaMatch = body.match(/media:\s*'([^']+)'/);
    const posterMatch = body.match(/poster:\s*require\('([^']+)'\)/);
    rows.set(route, {
      route,
      media: mediaMatch ? mediaMatch[1] : null,
      posterSpecifier: posterMatch ? posterMatch[1] : null,
    });
  }
  return rows;
}

function posterCustodyReport() {
  const navigatorRows = parseNavigatorRows(nav);
  const registryRows = parseRegistryRows(registry);
  const mapping = [];
  const errors = [];
  const posterHashes = new Map();

  for (const row of navigatorRows) {
    const registration = registryRows.get(row.route);
    const body = functionBody(screens, row.component);
    const binding = resolveScreenShellBinding(
      screens,
      row.component,
      row.route,
    );
    const shellRoute = binding.shellRoute;

    if (!registration) {
      errors.push(`REGISTRY_MISSING:${row.route}`);
      mapping.push({ ...row, medium: null, source: null, shellRoute });
      continue;
    }

    if (row.route === 'CinematicIntro') {
      const videoSource = 'app/assets/cinematic/mbw_cinematic.mp4';
      const cinematicValid = registration.media === 'VIDEO_ONLY'
        && !registration.posterSpecifier
        && body.includes('source={CINEMATIC}')
        && !shellRoute
        && exists(videoSource);
      if (!cinematicValid) errors.push('CINEMATIC_VIDEO_ONLY_CONTRACT_FAILED');
      const file = exists(videoSource) ? bytes(videoSource) : Buffer.alloc(0);
      mapping.push({
        ...row,
        medium: 'VIDEO_ONLY',
        source: videoSource,
        sourceBytes: file.length,
        sourceSha256: file.length
          ? crypto.createHash('sha256').update(file).digest('hex')
          : null,
        shellRoute,
        bindingKind: 'VIDEO_DIRECT',
        delegatedComponent: null,
        helperUsesRouteParameter: false,
      });
      continue;
    }

    if (registration.media !== 'POSTER') {
      errors.push(`POSTER_MEDIA_INVALID:${row.route}:${registration.media}`);
    }
    if (!registration.posterSpecifier) {
      errors.push(`POSTER_SPECIFIER_MISSING:${row.route}`);
    }
    if (!binding.valid) {
      errors.push(
        [
          'SCREEN_ROUTE_BINDING_MISMATCH',
          row.route,
          binding.bindingKind,
          binding.shellRoute,
          binding.delegatedComponent,
          binding.helperUsesRouteParameter,
        ].join(':'),
      );
    }

    let source = null;
    let sourceBytes = 0;
    let sourceSha256 = null;
    if (registration.posterSpecifier) {
      source = path.relative(
        ROOT,
        path.resolve(ROOT, 'app/golden', registration.posterSpecifier),
      ).replace(/\\/g, '/');
      if (!exists(source)) {
        errors.push(`POSTER_FILE_MISSING:${row.route}:${source}`);
      } else {
        const file = bytes(source);
        sourceBytes = file.length;
        sourceSha256 = crypto.createHash('sha256').update(file).digest('hex');
        if (posterHashes.has(sourceSha256)) {
          errors.push(
            `POSTER_HASH_DUPLICATE:${row.route}:${posterHashes.get(sourceSha256)}`,
          );
        } else {
          posterHashes.set(sourceSha256, row.route);
        }
      }
    }

    mapping.push({
      ...row,
      medium: registration.media,
      source,
      sourceBytes,
      sourceSha256,
      shellRoute,
      bindingKind: binding.bindingKind,
      delegatedComponent: binding.delegatedComponent,
      delegatedRoute: binding.delegatedRoute,
      helperUsesRouteParameter: binding.helperUsesRouteParameter,
    });
  }

  const navigatorRouteCount = navigatorRows.length;
  const posterRows = mapping.filter((item) => item.medium === 'POSTER');
  const videoRows = mapping.filter((item) => item.medium === 'VIDEO_ONLY');
  const registryExtraRoutes = [...registryRows.keys()].filter(
    (route) => !navigatorRows.some((row) => row.route === route),
  );

  if (navigatorRouteCount !== 31) {
    errors.push(`NAVIGATOR_ROUTE_COUNT:${navigatorRouteCount}`);
  }
  if (posterRows.length !== 30) {
    errors.push(`POSTER_ROUTE_COUNT:${posterRows.length}`);
  }
  if (videoRows.length !== 1) {
    errors.push(`VIDEO_ROUTE_COUNT:${videoRows.length}`);
  }
  if (registryRows.size !== navigatorRouteCount) {
    errors.push(`REGISTRY_ROUTE_COUNT:${registryRows.size}`);
  }
  if (registryExtraRoutes.length) {
    errors.push(`REGISTRY_EXTRA_ROUTES:${registryExtraRoutes.join(',')}`);
  }
  if (registry.includes('|| MBW_GOLDEN_MASTER_ROUTES.MainHub')) {
    errors.push('SILENT_MAINHUB_POSTER_FALLBACK_PRESENT');
  }
  if (!registry.includes('MBW_ROUTE_NOT_REGISTERED')) {
    errors.push('STRICT_ROUTE_RESOLVER_MISSING');
  }
  if (!surface.includes('MBW_POSTER_NOT_ASSIGNED')) {
    errors.push('STRICT_POSTER_SURFACE_MISSING');
  }

  const report = {
    root: ROOT,
    navigatorRouteCount,
    registryRouteCount: registryRows.size,
    posterRouteCount: posterRows.length,
    videoRouteCount: videoRows.length,
    uniquePosterSha256Count: posterHashes.size,
    mapping,
    errors,
    green: errors.length === 0,
  };

  const output = process.env.MBW_POSTER_CUSTODY_JSON
    || path.join(ROOT, 'MBW_SCREEN_POSTER_CUSTODY.json');
  fs.writeFileSync(output, JSON.stringify(report, null, 2));
  return { report, output };
}

gate('V3_APP_IDENTITY', app.name === 'MBW' && app.version === '1.0.42' && app.android.package === 'com.mbw.app' && app.android.versionCode === 44, `${app.name}|${app.version}|${app.android.package}|${app.android.versionCode}`);
gate('V3_HERMES_NEW_ARCH', app.jsEngine === 'hermes' && app.newArchEnabled === false, `${app.jsEngine}|${app.newArchEnabled}`);
gate('V3_REACHABLE_GRAPH', graph.length > 0, `COUNT=${graph.length}`);
gate('V3_ONE_IMAGE_BACKGROUND', (surface.match(/<ImageBackground\b/g) || []).length === 1 && (graphText.match(/<ImageBackground\b/g) || []).length === 1, `GRAPH_RENDERED=${(graphText.match(/<ImageBackground\b/g) || []).length}|SURFACE_RENDERED=${(surface.match(/<ImageBackground\b/g) || []).length}`);
gate('V3_OLD_RUNTIME_UNREACHABLE', !['MBWRuntimeRoot','MBWRuntimeOS','MBWVisualBoundary','MBWFullVisualOS','MBWGlobalVisualLogicDriver','MBWFullVisualBody'].some((token) => graphText.includes(token)), 'OLD_OWNER_HIT=0');
gate('V3_SCHEMA_MIGRATION', store.includes('MBW_USER_SEED_SCHEMA_VERSION = 2') && store.includes('migrateState') && store.includes('MBW_GOLDEN_MASTER_LEGACY_STORAGE_KEY'), 'SCHEMA=2');
gate('V3_ENCRYPTED_STORAGE', ['expo-secure-store','expo-crypto','crypto-js'].every((token) => store.includes(token)) && store.includes('CryptoJS.AES.encrypt') && store.includes('HmacSHA256') && store.includes('STATE_INTEGRITY_FAILED'), 'AES_CBC_HMAC_AND_KEYSTORE');
gate('V3_GATE_RAW_SECRET_ABSENT', !graphText.includes('ONLYONEGOD') && !graphText.includes('$ONLY1GOD$'), 'PLAINTEXT_SECRET_HIT=0');
gate('V3_GATE_HASH_RATE_LIMIT', store.includes('MBW_GATE_HASHES') && store.includes('MBW_GATE_MAX_FAILURES = 5') && store.includes('MBW_GATE_LOCK_MS') && store.includes('timingSafeEqualHex'), 'HASHES_AND_LOCKOUT');
gate('V3_FULL_DELETE', store.includes('SecureStore.deleteItemAsync') && store.includes('FileSystem.deleteAsync(MBW_POSTER_FOLDER') && store.includes('AsyncStorage.removeItem(MBW_GOLDEN_MASTER_STORAGE_KEY)'), 'STATE_KEY_AND_POSTER_VAULT');
gate('V3_PATH_TIER_GUARD', nav.includes('makeGuardedScreen') && contracts.includes('MBW_MASTER_OF_LIFE_ROUTES') && contracts.includes("LiveLounge: '444'") && store.includes('ACE 444 REQUIRED'), 'NAV_AND_REDUCER_GUARD');
gate('V3_EXACT_VISIBLE_NAMES', ['MASTER OF GAMES','AI POSTER','MEN’S LOUNGE'].every((token) => contracts.includes(token)) && screens.includes('MBW_ROUTE_LABELS'), 'VISIBLE_NAMES_LOCKED');
gate('V3_GAME_DEPTH', store.includes('playerTokens: [-1, -1, -1, -1]') && store.includes('captureWithCard') && store.includes('ANY_TRIPLE') && screens.includes('playerSweeps'), 'LUDO4_SEEP_CAPTURE_SICBO_BETS');
gate('V3_NEARBY_DISTANCE', store.includes('haversineKm') && !store.includes('0.8 + index * 1.7'), 'HAVERSINE');
gate('V3_ORDER_NOT_FAKE_PAID', !graphText.includes('PAID_PREVIEW') && store.includes('ORDERED_PREVIEW_NO_SETTLEMENT'), 'NO_FAKE_PAID_STATUS');
gate('V3_LEGAL_VERSIONING', contracts.includes('MBW_PRIVACY_SECTIONS') && contracts.includes('MBW_TERMS_SECTIONS') && contracts.includes('MBW_CONSENT_SECTIONS') && store.includes('privacyAcceptedAt') && screens.includes('state.safety.legalVersion'), 'VERSIONED_ACCEPTANCE');
gate('V3_PENTAGRAM_EATING_WORDS', surface.includes('⛤') && surface.includes('wordScale') && surface.includes('setInterval(cycle, 5000)'), 'PENTAGRAM_5S_TRANSFORM');
gate('V3_SEED_SAFE_ZONE', surface.includes("bottom: 18") && surface.includes('paddingBottom: 116'), 'BOTTOM_SAFE_ZONE');
gate('V3_CINEMATIC_EXACT_BINARY', videoSha === 'e08160ee0cd29d6c283cf54fd3100d1af17851ce8599bac1efca844990c92122' && video.length === 9684970, `BYTES=${video.length}|SHA=${videoSha}`);
gate('V3_MANIFEST_PERMISSION_REMOVAL', ['CAMERA','READ_EXTERNAL_STORAGE','WRITE_EXTERNAL_STORAGE','READ_MEDIA_IMAGES','READ_MEDIA_VIDEO','READ_MEDIA_VISUAL_USER_SELECTED','RECORD_AUDIO'].every((name) => new RegExp(`android\\.permission\\.${name}"\\s+tools:node="remove"`).test(manifest)), 'MERGER_REMOVAL_STUBS');
gate('V3_CROPPER_NOT_EXPORTED', /com\.canhub\.cropper\.CropImageActivity[\s\S]*?android:exported="false"[\s\S]*?tools:replace="android:exported"/.test(manifest), 'CROPPER_EXPORTED_FALSE');
gate('V3_NATIVE_HARDENING', manifest.includes('android:allowBackup="false"') && manifest.includes('android:usesCleartextTraffic="false"'), 'BACKUP_FALSE_CLEAR_TEXT_FALSE');
gate('V3_DEPENDENCIES', pkg.dependencies['expo-secure-store'] === '15.0.8' && pkg.dependencies['expo-crypto'] === '15.0.9' && pkg.dependencies['crypto-js'] === '4.2.0', 'SDK54_SECURE_DEPS');
gate('V3_PRODUCTION_TRUTH', contracts.includes('MBW_PRODUCTION_SERVICE_REQUIREMENTS') && contracts.includes('MBW_PREVIEW_SERVICE_STATUS') && contracts.includes('AUTH: false') && contracts.includes('BILLING: false') && contracts.includes('LIVE: false'), 'NO_FALSE_GLOBAL_RELEASE_CLAIM');

const posterCustody = posterCustodyReport();
gate('V35_NAVIGATOR_REGISTRY_PARITY', posterCustody.report.navigatorRouteCount === 31 && posterCustody.report.registryRouteCount === 31, `NAV=${posterCustody.report.navigatorRouteCount}|REGISTRY=${posterCustody.report.registryRouteCount}`);
gate('V35_POSTER_VIDEO_ROUTE_COUNT', posterCustody.report.posterRouteCount === 30 && posterCustody.report.videoRouteCount === 1, `POSTER=${posterCustody.report.posterRouteCount}|VIDEO=${posterCustody.report.videoRouteCount}`);
gate('V35_EXACT_SCREEN_POSTER_BINDING', posterCustody.report.green, `ERRORS=${posterCustody.report.errors.length}`);
gate('V35_UNIQUE_POSTER_SHA256', posterCustody.report.uniquePosterSha256Count === 30, `UNIQUE_SHA=${posterCustody.report.uniquePosterSha256Count}`);
gate('V35_STRICT_NO_FALLBACK_POSTER', !registry.includes('|| MBW_GOLDEN_MASTER_ROUTES.MainHub') && registry.includes('MBW_ROUTE_NOT_REGISTERED') && surface.includes('MBW_POSTER_NOT_ASSIGNED'), 'FAIL_CLOSED');
console.log(`V35_POSTER_CUSTODY_JSON=${posterCustody.output}`);

const failed = gates.filter((item) => !item.passed);
const report = {
  root: ROOT,
  reachable: graph,
  video: { bytes: video.length, sha256: videoSha },
  posterCustody: posterCustody.report,
  gates,
  failed,
  green: failed.length === 0,
  productionServicesReady: false,
  productionExternalRequirements: ['AUTH','SMS','BILLING','MATCH_CHAT','LIVE','MODERATION','ACCOUNT_DELETE','LEGAL'],
};
const output = process.env.MBW_V3_COURT_JSON || path.join(ROOT, 'MBW_FORENSIC_REPAIR_V3_COURT.json');
fs.writeFileSync(output, JSON.stringify(report, null, 2));
console.log(`V3_FAILED_GATE_COUNT=${failed.length}`);
console.log(`V3_COURT_JSON=${output}`);
console.log(failed.length ? 'FINAL=MBW_FORENSIC_REPAIR_V3_SOURCE_BLOCKED' : 'FINAL=MBW_FORENSIC_REPAIR_V3_SOURCE_GREEN');
process.exit(failed.length ? 92 : 0);
