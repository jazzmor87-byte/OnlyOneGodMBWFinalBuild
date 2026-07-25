'use strict';
/* MBW_V70_SINGLE_CODEGEN_OWNER */
const Module = require('module');
const path = require('path');
const originalSource = Buffer.from('Ly8gTUJXX1YyNl9FWFBPX0JBQkVMX1dJVEhfQ09OVFJPTExFRF9SRUFOSU1BVEVEX1NDT1BFCmNvbnN0IG9yaWdpbmFsUHJlc2V0ID0gJ2JhYmVsLXByZXNldC1leHBvJzsKbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXBpKSB7CiAgYXBpLmNhY2hlKHRydWUpOwogIHJldHVybiB7CiAgICBwcmVzZXRzOiBbW29yaWdpbmFsUHJlc2V0LCB7IHJlYW5pbWF0ZWQ6IGZhbHNlLCB3b3JrbGV0czogZmFsc2UgfV1dLAogICAgb3ZlcnJpZGVzOiBbCiAgICAgIHsKICAgICAgICBleGNsdWRlOiAvW1xcL11ub2RlX21vZHVsZXNbXFwvXS8sCiAgICAgICAgcGx1Z2luczogWydyZWFjdC1uYXRpdmUtcmVhbmltYXRlZC9wbHVnaW4nXSwKICAgICAgfSwKICAgIF0sCiAgfTsKfTsK', 'base64').toString('utf8');
const originalFilename = path.join(__dirname, 'babel.config.mbw-v70-embedded-original.cjs');
const originalModule = new Module(originalFilename, module);
originalModule.filename = originalFilename;
originalModule.paths = Module._nodeModulePaths(__dirname);
originalModule._compile(originalSource, originalFilename);
const originalExport = originalModule.exports;

function safeRequire(request) {
  try { return require(request); } catch { return null; }
}
const expoPresetModule = safeRequire('babel-preset-expo');
const rnPresetModule = safeRequire('@react-native/babel-preset');
const metroPresetModule = safeRequire('metro-react-native-babel-preset');
const codegenPluginModule = safeRequire('@react-native/babel-plugin-codegen');

function baseOf(item) {
  return Array.isArray(item) ? item[0] : item;
}
function textOf(item) {
  const base = baseOf(item);
  return typeof base === 'string' ? base : '';
}
function sameModule(base, mod) {
  return !!mod && (base === mod || (mod.default && base === mod.default));
}
function isExpoPreset(item) {
  const base = baseOf(item);
  const text = textOf(item);
  return sameModule(base, expoPresetModule) ||
    /(^|\/|:)babel-preset-expo($|\/)/.test(text);
}
function isReactNativePreset(item) {
  const base = baseOf(item);
  const text = textOf(item);
  return sameModule(base, rnPresetModule) ||
    sameModule(base, metroPresetModule) ||
    /(^|\/|:)(@react-native\/babel-preset|metro-react-native-babel-preset)($|\/)/.test(text);
}
function isExplicitCodegen(item) {
  const base = baseOf(item);
  const text = textOf(item);
  return sameModule(base, codegenPluginModule) ||
    /(@react-native\/babel-plugin-codegen|react-native-codegen)/.test(text);
}
function dedupe(items) {
  const seenPrimitive = new Set();
  const seenReference = new Set();
  return items.filter(item => {
    const base = baseOf(item);
    if ((typeof base === 'object' && base !== null) || typeof base === 'function') {
      if (seenReference.has(base)) return false;
      seenReference.add(base);
      return true;
    }
    const key = `${typeof base}:${String(base)}`;
    if (seenPrimitive.has(key)) return false;
    seenPrimitive.add(key);
    return true;
  });
}

module.exports = function mbwV70BabelConfig(api) {
  const raw = typeof originalExport === 'function'
    ? originalExport(api)
    : (originalExport && originalExport.default && typeof originalExport.default === 'function'
      ? originalExport.default(api)
      : (originalExport && originalExport.default) || originalExport);

  const config = {...(raw || {})};
  let presets = Array.isArray(config.presets) ? [...config.presets] : [];
  let plugins = Array.isArray(config.plugins) ? [...config.plugins] : [];

  presets = dedupe(presets);
  plugins = dedupe(plugins);

  const expoPresent = presets.some(isExpoPreset);
  if (expoPresent) {
    presets = presets.filter(item => !isReactNativePreset(item));
    plugins = plugins.filter(item => !isExplicitCodegen(item));
  } else {
    let codegenKept = false;
    plugins = plugins.filter(item => {
      if (!isExplicitCodegen(item)) return true;
      if (codegenKept) return false;
      codegenKept = true;
      return true;
    });
  }

  config.presets = presets;
  config.plugins = plugins;
  return config;
};
