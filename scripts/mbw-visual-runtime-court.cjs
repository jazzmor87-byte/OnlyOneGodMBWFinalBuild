#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const screens = read('app/golden/MBWGoldenMasterScreens.js');
const surface = read('app/golden/MBWOneVisualSurface.js');
const store = read('app/golden/MBWGoldenMasterStore.js');
const registry = read('app/golden/MBWGoldenMasterRegistry.js');

const results = [];
function gate(name, ok, detail) {
  results.push({ name, ok: Boolean(ok), detail });
  console.log(`${name}=${ok ? 'PASS' : 'FAIL'}|${detail}`);
}

function styleBlock(text, key) {
  const match = text.match(new RegExp(`\\b${key}\\s*:\\s*\\{([^}]*)\\}`));
  return match ? match[1] : '';
}
function numberValue(text, key) {
  const match = text.match(new RegExp(`\\b${key}\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`));
  return match ? Number(match[1]) : null;
}
function alphaValue(text) {
  const match = text.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/);
  return match ? Number(match[1]) : null;
}

const action = styleBlock(surface, 'actionButton');
const input = styleBlock(surface, 'input');
const veil = styleBlock(surface, 'posterVeil');
const poster = styleBlock(surface, 'poster');
const seedBadge = styleBlock(surface, 'seedBadge');
const actionWidth = numberValue(action, 'width');
const actionHeight = numberValue(action, 'minHeight');
const actionAlpha = alphaValue(action);
const inputAlpha = alphaValue(input);
const veilAlpha = alphaValue(veil);
const posterOpacity = numberValue(poster, 'opacity');

const gateMotion = screens.includes('function GateStarMotion')
  && screens.includes('Animated.loop')
  && screens.includes('Animated.sequence')
  && screens.includes('translateY')
  && screens.includes('<GateStarMotion amplitude={84}>')
  && screens.includes('<GateStarMotion amplitude={112} duration={2600}>');

const signupFlow = screens.includes('const generated = await sendVerification()')
  && screens.includes('if (generated) setCode(generated)')
  && !screens.includes('disabled={!ready}')
  && screens.includes("navigation.reset({ index: 0, routes: [{ name: 'MainHub' }] })")
  && screens.includes("message: missing");

const seedVisual = surface.includes("DEFAULT_SEED_VISUAL = require('../assets/mbw_all_pad/ACE_MBW_ICON.png')")
  && surface.includes('const source = seed.profilePoster ? { uri: seed.profilePoster } : DEFAULT_SEED_VISUAL')
  && surface.includes('<Image source={source} style={styles.seedAvatar}')
  && !surface.includes('<Text numberOfLines={1} style={styles.seedName}>')
  && screens.includes('pickSeedPoster')
  && store.includes('const pickSeedPoster = useCallback')
  && !registry.includes("title: 'USER SEED'");

const hubOrbit = screens.includes('HUB_ORBIT_POSITIONS')
  && screens.includes('<View style={styles.hubOrbit}>')
  && screens.includes('HUB_ORBIT_POSITIONS[index % HUB_ORBIT_POSITIONS.length]')
  && screens.includes('<Shell routeName="MainHub" navigation={navigation} scroll={false}>');

const pathFloating = screens.includes('styles.pathChoiceLeft')
  && screens.includes('styles.pathChoiceRight')
  && screens.includes('<Shell routeName="PathSelection" navigation={navigation} scroll={false}>');

const palette = surface.includes('MBW_MONO_GLYPHS')
  && surface.includes('mbwMonoGlyph(icon)')
  && surface.includes('color: GOLD')
  && surface.includes("backgroundColor: 'rgba(0,0,0,0.16)'");

gate('V4_GATE_LOCK_OPEN_VERTICAL_STAR', gateMotion, 'ANIMATED_LOOP_TRANSLATE_Y');
gate('V4_SIGNUP_EXIT_RECOVERY', signupFlow, 'AUTO_FILLED_PREVIEW_CODE_AND_ACTIVE_ENTER');
gate('V4_ACTUAL_USER_SEED_VISUAL', seedVisual, 'IMAGE_ONLY_WITH_DEFAULT_AND_PICKER');
gate('V4_MAIN_HUB_FLOATING_ORBIT', hubOrbit, '13_FLOATING_POSITIONS');
gate('V4_PATH_FLOATING_CHOICES', pathFloating, 'NO_RECTANGULAR_PANEL');
gate('V4_MONOCHROME_MBW_GLYPHS', palette, 'BLACK_GOLD_MAROON_RENDERING');
gate('V4_ACTION_SIZE', actionWidth !== null && actionWidth <= 64 && actionHeight !== null && actionHeight <= 64, `WIDTH=${actionWidth}|HEIGHT=${actionHeight}`);
gate('V4_ACTION_TRANSPARENCY', actionAlpha !== null && actionAlpha <= 0.20, `ALPHA=${actionAlpha}`);
gate('V4_INPUT_TRANSPARENCY', inputAlpha !== null && inputAlpha <= 0.25, `ALPHA=${inputAlpha}`);
gate('V4_POSTER_BRIGHTNESS', posterOpacity === 1 && veilAlpha !== null && veilAlpha <= 0.12, `POSTER=${posterOpacity}|VEIL=${veilAlpha}`);
gate('V4_SEED_BADGE_IMAGE_ONLY', seedBadge.includes('width: 56') && seedBadge.includes("backgroundColor: 'rgba(0,0,0,0.12)'"), '56PX_IMAGE_BADGE');
gate('V4_NO_VISIBLE_USER_SEED_WORDS', !registry.includes('USER SEED') && !screens.includes('>USER SEED<'), 'VISIBLE_LITERAL_ABSENT');
gate('V4_PREVIEW_CODE_NOT_ALERTED', !store.includes('SANDBOX CODE') && !store.includes('PREVIEW VERIFICATION'), 'NO_ALERT_BLOCKER');

const failed = results.filter((item) => !item.ok);
const output = process.env.MBW_VISUAL_COURT_JSON || path.join(ROOT, 'MBW_VISUAL_RUNTIME_V4_COURT.json');
fs.writeFileSync(output, JSON.stringify({ root: ROOT, results, failed, green: failed.length === 0 }, null, 2));
console.log(`V4_FAILED_GATE_COUNT=${failed.length}`);
console.log(`V4_COURT_JSON=${output}`);
console.log(`FINAL=${failed.length === 0 ? 'MBW_VISUAL_RUNTIME_V4_SOURCE_GREEN' : 'MBW_VISUAL_RUNTIME_V4_SOURCE_BLOCKED'}`);
process.exit(failed.length === 0 ? 0 : 44);
