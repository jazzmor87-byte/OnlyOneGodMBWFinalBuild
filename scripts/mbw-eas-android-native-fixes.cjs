#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');

const root = process.cwd();
const normalizeOnly = process.argv.includes('--normalize-only');
const reportDir = process.env.MBW_NATIVE_FIX_REPORT_DIR || path.join(root, '.mbw-v15-native-fix');
const reportPath = path.join(reportDir, 'MBW_V15_NATIVE_FIX_REPORT.json');
const markerBegin = '/* MBW_V15_LIBREACTNATIVE_PICK_FIRST_BEGIN */';
const markerEnd = '/* MBW_V15_LIBREACTNATIVE_PICK_FIRST_END */';

const assetRelatives = [
  "assets/mbw/exact-visual-os/MBW_REF_01_ORBITAL_WORLD.png",
  "assets/mbw/exact-visual-os/MBW_REF_02_PATH_GATE.png",
  "assets/mbw/exact-visual-os/MBW_REF_03_MASTER_OF_COINS.png",
];

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function pixelHash(width, height, data) {
  const header = Buffer.from(`${width}x${height}:rgba8:`, 'utf8');
  return sha256(Buffer.concat([header, Buffer.from(data)]));
}

function detectFormat(buffer) {
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) return 'PNG';

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'JPEG';
  }

  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) return 'WEBP';

  return 'UNKNOWN';
}

function decodePng(buffer) {
  const decoded = PNG.sync.read(buffer, {
    skipRescale: false,
  });
  return {
    width: decoded.width,
    height: decoded.height,
    data: Buffer.from(decoded.data),
  };
}

function decodeJpeg(buffer) {
  const decoded = jpeg.decode(buffer, {
    useTArray: true,
    formatAsRGBA: true,
    tolerantDecoding: true,
  });
  if (!decoded || !decoded.width || !decoded.height || !decoded.data) {
    throw new Error('JPEG_DECODE_FAILED');
  }
  return {
    width: decoded.width,
    height: decoded.height,
    data: Buffer.from(decoded.data),
  };
}

function decodeWebpWithSystemTool(sourcePath, tempPng) {
  const tools = [
    ['ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', sourcePath, tempPng]],
    ['magick', [sourcePath, tempPng]],
    ['convert', [sourcePath, tempPng]],
    ['dwebp', [sourcePath, '-o', tempPng]],
  ];

  for (const [command, args] of tools) {
    const exists = childProcess.spawnSync(
      process.platform === 'win32' ? 'where' : 'sh',
      process.platform === 'win32' ? [command] : ['-lc', `command -v ${command}`],
      { stdio: 'ignore' }
    ).status === 0;

    if (!exists) continue;

    const result = childProcess.spawnSync(command, args, {
      stdio: 'inherit',
    });
    if (result.status === 0 && fs.existsSync(tempPng)) {
      return decodePng(fs.readFileSync(tempPng));
    }
  }

  throw new Error('WEBP_DECODER_NOT_AVAILABLE');
}

function encodeCanonicalPng(decoded) {
  const encoded = PNG.sync.write(
    {
      width: decoded.width,
      height: decoded.height,
      data: Buffer.from(decoded.data),
    },
    {
      bitDepth: 8,
      colorType: 6,
      inputColorType: 6,
      inputHasAlpha: true,
      deflateLevel: 9,
      deflateStrategy: 3,
      filterType: -1,
    }
  );

  const verified = decodePng(encoded);
  if (
    verified.width !== decoded.width ||
    verified.height !== decoded.height ||
    pixelHash(verified.width, verified.height, verified.data) !==
      pixelHash(decoded.width, decoded.height, decoded.data)
  ) {
    throw new Error('PIXEL_HASH_CHANGED_DURING_PNG_NORMALIZATION');
  }

  return encoded;
}

function normalizeAsset(relativePath) {
  const sourcePath = path.join(root, relativePath);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`ASSET_NOT_FOUND=${relativePath}`);
  }

  const before = fs.readFileSync(sourcePath);
  const format = detectFormat(before);
  let decoded;
  const tempDecode = `${sourcePath}.mbw-v15-decoded.png`;

  try {
    if (format === 'PNG') {
      decoded = decodePng(before);
    } else if (format === 'JPEG') {
      decoded = decodeJpeg(before);
    } else if (format === 'WEBP') {
      decoded = decodeWebpWithSystemTool(sourcePath, tempDecode);
    } else {
      throw new Error(`UNSUPPORTED_IMAGE_FORMAT=${format}`);
    }
  } finally {
    if (fs.existsSync(tempDecode)) fs.unlinkSync(tempDecode);
  }

  const pixelsBefore = pixelHash(decoded.width, decoded.height, decoded.data);
  const canonical = encodeCanonicalPng(decoded);
  const tempOutput = `${sourcePath}.mbw-v15-normalized.tmp`;

  fs.writeFileSync(tempOutput, canonical, { mode: 0o600 });
  const reread = fs.readFileSync(tempOutput);
  const finalDecoded = decodePng(reread);
  const pixelsAfter = pixelHash(finalDecoded.width, finalDecoded.height, finalDecoded.data);

  if (pixelsBefore !== pixelsAfter) {
    fs.unlinkSync(tempOutput);
    throw new Error(`PIXEL_HASH_MISMATCH=${relativePath}`);
  }

  fs.renameSync(tempOutput, sourcePath);

  return {
    path: relativePath,
    sourceFormat: format,
    width: decoded.width,
    height: decoded.height,
    sourceSha256: sha256(before),
    normalizedSha256: sha256(canonical),
    rgbaPixelSha256: pixelsAfter,
    pixelPreserved: true,
    outputFormat: 'PNG_RGBA8_NON_INTERLACED',
  };
}

function patchAppBuildGradle() {
  const gradlePath = path.join(root, 'android', 'app', 'build.gradle');
  if (!fs.existsSync(gradlePath)) {
    throw new Error(`ANDROID_APP_BUILD_GRADLE_NOT_FOUND=${gradlePath}`);
  }

  let text = fs.readFileSync(gradlePath, 'utf8');
  if (text.includes(markerBegin) && text.includes(markerEnd)) {
    return {
      buildGradle: path.relative(root, gradlePath),
      changed: false,
      pickFirstPattern: '**/libreactnative.so',
      markerPresent: true,
    };
  }

  const androidMatch = /(^|\n)android\s*\{/.exec(text);
  if (!androidMatch) {
    throw new Error('ANDROID_BLOCK_NOT_FOUND_IN_APP_BUILD_GRADLE');
  }

  const insertionPoint = androidMatch.index + androidMatch[0].length;
  const block = `
  ${markerBegin}
  packagingOptions {
    jniLibs {
      pickFirsts += ["**/libreactnative.so"]
    }
  }
  ${markerEnd}
`;

  text = text.slice(0, insertionPoint) + block + text.slice(insertionPoint);
  fs.writeFileSync(gradlePath, text, 'utf8');

  const finalText = fs.readFileSync(gradlePath, 'utf8');
  const proved =
    finalText.includes(markerBegin) &&
    finalText.includes('pickFirsts += ["**/libreactnative.so"]');

  if (!proved) {
    throw new Error('LIBREACTNATIVE_PICK_FIRST_PATCH_NOT_PROVED');
  }

  return {
    buildGradle: path.relative(root, gradlePath),
    changed: true,
    pickFirstPattern: '**/libreactnative.so',
    markerPresent: true,
  };
}

function packageVersion(packageName) {
  try {
    const pkgPath = require.resolve(`${packageName}/package.json`, { paths: [root] });
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version || 'UNSPECIFIED';
  } catch {
    return 'NOT_FOUND';
  }
}

fs.mkdirSync(reportDir, { recursive: true });

const assets = assetRelatives.map(normalizeAsset);
let nativePatch = {
  skipped: true,
  reason: 'NORMALIZE_ONLY',
};

if (!normalizeOnly) {
  if (process.env.EAS_BUILD_PLATFORM && process.env.EAS_BUILD_PLATFORM !== 'android') {
    nativePatch = {
      skipped: true,
      reason: `NON_ANDROID_PLATFORM=${process.env.EAS_BUILD_PLATFORM}`,
    };
  } else {
    nativePatch = patchAppBuildGradle();
  }
}

const result = {
  root,
  platform: process.env.EAS_BUILD_PLATFORM || 'LOCAL',
  normalizeOnly,
  assets,
  nativePatch,
  packageVersions: {
    reactNative: packageVersion('react-native'),
    onnxruntimeReactNative: packageVersion('onnxruntime-react-native'),
    reactNativeSvg: packageVersion('react-native-svg'),
    pngjs: packageVersion('pngjs'),
    jpegJs: packageVersion('jpeg-js'),
  },
  imageResizeExecuted: false,
  imageCropExecuted: false,
  pixelPreservationProved: assets.every((item) => item.pixelPreserved),
  success: true,
};

fs.writeFileSync(reportPath, JSON.stringify(result, null, 2), 'utf8');

console.log(`MBW_V15_NATIVE_FIX_REPORT=${reportPath}`);
console.log(`ASSETS_NORMALIZED=${assets.length}`);
for (const item of assets) {
  console.log(`ASSET_NORMALIZED=${item.path}`);
  console.log(`ASSET_SOURCE_FORMAT=${item.sourceFormat}`);
  console.log(`ASSET_DIMENSIONS=${item.width}x${item.height}`);
  console.log(`ASSET_PIXEL_SHA256=${item.rgbaPixelSha256}`);
  console.log(`ASSET_PIXEL_PRESERVED=${item.pixelPreserved}`);
}
console.log(`LIBREACTNATIVE_PICK_FIRST_PATCHED=${Boolean(nativePatch.markerPresent)}`);
console.log(`IMAGE_RESIZE_EXECUTED=false`);
console.log(`IMAGE_CROP_EXECUTED=false`);
console.log(`MBW_V15_NATIVE_FIX_GREEN=true`);
