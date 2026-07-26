import fs from 'node:fs';
import crypto from 'node:crypto';

for (const file of ['package.json', 'package-lock.json', 'eas.json']) {
  if (!fs.existsSync(file)) throw new Error(`MISSING_${file}`);
}

const configFiles = ['app.json', 'app.config.js', 'app.config.ts'];
if (!configFiles.some(file => fs.existsSync(file))) {
  throw new Error('MISSING_EXPO_APP_CONFIG');
}

const digest = crypto
  .createHash('sha256')
  .update(fs.readFileSync('package-lock.json'))
  .digest('hex');

console.log(`PACKAGE_LOCK_SHA256=${digest}`);
console.log('CLOUD_PREFLIGHT_GREEN=True');
