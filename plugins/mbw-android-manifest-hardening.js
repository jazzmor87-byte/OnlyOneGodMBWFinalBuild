const { withAndroidManifest } = require('expo/config-plugins');

const ALLOWED = new Set([
  'android.permission.INTERNET',
  'android.permission.VIBRATE',
  'android.permission.MODIFY_AUDIO_SETTINGS',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
]);

const BLOCKED = [
  'android.permission.ACCESS_BACKGROUND_LOCATION',
  'android.permission.ACCESS_MEDIA_LOCATION',
  'android.permission.CAMERA',
  'android.permission.MANAGE_EXTERNAL_STORAGE',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.READ_MEDIA_AUDIO',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
  'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
  'android.permission.RECORD_AUDIO',
  'android.permission.READ_SMS',
  'android.permission.RECEIVE_SMS',
  'android.permission.SEND_SMS',
  'android.permission.READ_CALL_LOG',
  'android.permission.WRITE_CALL_LOG',
  'android.permission.READ_CONTACTS',
  'android.permission.WRITE_CONTACTS',
];

function permissionName(item) {
  return typeof item === 'string' ? item : item?.$?.['android:name'];
}

function removalNode(name) {
  return { $: { 'android:name': name, 'tools:node': 'remove' } };
}

module.exports = function mbwAndroidManifestHardening(config) {
  return withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults.manifest;
    manifest.$ = manifest.$ || {};
    manifest.$['xmlns:tools'] = manifest.$['xmlns:tools'] || 'http://schemas.android.com/tools';

    const current = Array.isArray(manifest['uses-permission']) ? manifest['uses-permission'] : [];
    const kept = current.filter((item) => ALLOWED.has(permissionName(item)));
    manifest['uses-permission'] = [
      ...kept,
      ...BLOCKED.map(removalNode),
    ];

    manifest.application = manifest.application || [];
    for (const app of manifest.application) {
      app.$ = app.$ || {};
      app.$['android:allowBackup'] = 'false';
      app.$['android:usesCleartextTraffic'] = 'false';
      app.activity = Array.isArray(app.activity) ? app.activity : [];
      const cropper = app.activity.find(
        (item) => item?.$?.['android:name'] === 'com.canhub.cropper.CropImageActivity'
      );
      if (cropper) {
        cropper.$['android:exported'] = 'false';
        cropper.$['tools:replace'] = 'android:exported';
      } else {
        app.activity.push({
          $: {
            'android:name': 'com.canhub.cropper.CropImageActivity',
            'android:exported': 'false',
            'tools:replace': 'android:exported',
          },
        });
      }
    }
    return modConfig;
  });
};
