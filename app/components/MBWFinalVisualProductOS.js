import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  Pressable as RNPressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { MBW_FINAL_VISUAL_CINEMATIC } from "../data/MBWFinalVisualAssetRegistry";
import { resolveMBWFinalVisualRoute } from "../runtime/MBWCanonicalPosterRegistry";
import { isMBWAllowedNavigationRoute } from '../runtime/MBWAuthorityChainDriver';

import { useMBWUnifiedMotion } from '../runtime/MBWUnifiedMotionKernel';
export const MBW_FINAL_VISUAL_PRODUCT_ENGINE_READY = true;
export const MBW_35C_DEEP_RESEARCH_MICRO_ISSUES_CLOSED = true;
export const MBW_BIG_PILL_MENU_REPLACED = true;
export const MBW_NO_BIG_CARD_SURFACE_READY = true;
export const MBW_NO_SECTION_CHAMBER_BOX_READY = true;
export const MBW_NO_CINEMATIC_BOTTOM_BOX_READY = true;
export const MBW_FLOATING_ICON_ACTIONS_READY = true;
export const MBW_LIVING_STAR_ENGINE_READY = true;
export const MBW_POSTER_AWARE_DEPTH_READY = true;
export const MBW_HEADLINE_PHASE_READY = true;
export const MBW_PANCHTATVA_PARTICLES_READY = true;
export const MBW_CINEMATIC_GATE_READY = true;
export const MBW_PATH_SELECTION_REBUILT_READY = true;
export const MBW_MAINHUB_EMPIRE_CHAMBER_READY = true;
export const MBW_ACCESSIBILITY_ACTIONS_READY = true;
export const MBW_35E_ACCESSIBILITY_HITSLOP_REPAIR_READY = true;
export const MBW_ROUTE_IDENTITY_SPLIT_READY = true;

const GOLD = 'rgba(247,202,112,0.92)';
const GOLD_SOFT = 'rgba(247,202,112,0.28)';
const MAROON = 'rgba(104,0,28,0.48)';
const BLACK_GLASS = 'rgba(0,0,0,0.38)';


function Pressable({
  accessibilityRole = 'button',
  accessibilityLabel = 'MBW visual action',
  accessibilityHint = 'Opens an MBW chamber',
  hitSlop = 12,
  ...props
}) {
  return (
    <RNPressable
      {...props}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={hitSlop}
    />
  );
}



const MAIN_ACTIONS = [
  ['MasterOfLife', '👑', 'LIFE'],
  ['Matchmaking', '❤️', 'MATCH'],
  ['MasterOfGames', '🎲', 'GAMES'],
  ['MasterOfCoins', '🪙', 'COINS'],
  ['TravelLocal', '🧭', 'LOCAL'],
  ['TravelOverseas', '✈️', 'WORLD'],
  ['Merchandise', '💎', 'MERCH'],
  ['Kamashastra', '🔥', 'FIRE'],
  ['LiveLounge', '🎙️', 'LIVE'],
  ['MensLounge', '♠️', 'LOUNGE'],
  ['Nearby', '📍', 'NEAR'],
  ['AIPoster', '📸', 'POSTER'],
  ['Settings', '⚙️', 'SET'],
];

const MASTER_LIFE_ACTIONS = [
  ['MasterOfGames', '🎲', 'GAMES'],
  ['MasterOfCoins', '🪙', 'COINS'],
  ['TravelLocal', '🧭', 'LOCAL'],
  ['TravelOverseas', '✈️', 'WORLD'],
  ['Merchandise', '💎', 'MERCH'],
];

function useLoop(duration = 9000) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(value, { toValue: 1, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration]);
  return value;
}

function navTo(navigation, route) {
  if (!isMBWAllowedNavigationRoute(route)) {
    return false;
  }

  if (
    navigation
    && typeof navigation.navigate === 'function'
  ) {
    navigation.navigate(route);
    return true;
  }

  return false;
}

function PosterDepth({ routeName, intense = false, children }) {
  const spec = resolveMBWFinalVisualRoute(routeName);
  const drift = useLoop(12000);
  const veil = useLoop(8000);
  const scale = drift.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1.02, 1.07, 1.02] });
  const y = drift.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-8, 10, -8] });
  const opacity = veil.interpolate({ inputRange: [0, 0.5, 1], outputRange: intense ? [0.16, 0.30, 0.16] : [0.32, 0.46, 0.32] });

  return (
    <ImageBackground source={spec.poster} resizeMode="cover" style={styles.root}>
<View pointerEvents="none" style={styles.edgeGlow} />
      <ParticleDust />
      {children}
    </ImageBackground>
  );
}

function ParticleDust() {
  const t = useLoop(9000);
  const y = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [12, -14, 12] });
  const o = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.12, 0.30, 0.12] });
  return (
    <Animated.View pointerEvents="none" style={[styles.dust, { opacity: o, transform: [{ translateY: y }] }]}>
      <View style={[styles.speck, styles.s1]} />
      <View style={[styles.speck, styles.s2]} />
      <View style={[styles.speck, styles.s3]} />
      <View style={[styles.speck, styles.s4]} />
      <View style={[styles.speck, styles.s5]} />
      <View style={[styles.speck, styles.s6]} />
    </Animated.View>
  );
}

function LivingStar({ top = 90, size = 132, soft = false }) {
  const spin = useLoop(soft ? 15000 : 9000);
  const pulse = useLoop(soft ? 11000 : 6200);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const mbwMotion = useMBWUnifiedMotion();
  const mbwStarTranslateY = mbwMotion.starTranslateY;
  const scale = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.92, 1.08, 0.92] });
  const opacity = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: soft ? [0.30, 0.46, 0.30] : [0.50, 0.86, 0.50] });
  return (
    <Animated.View pointerEvents="none" style={[styles.star, { top, width: size, height: size, borderRadius: size, opacity, transform: [{ rotate }, { scale }] }]}>
      <Text style={[styles.starText, { fontSize: size * 0.43 }]}>★</Text>
    </Animated.View>
  );
}

function Headline({ title, subtitle, top = 192 }) {
  const phase = useLoop(7600);
  const opacity = phase.interpolate({ inputRange: [0, 0.45, 0.72, 1], outputRange: [0.14, 0.96, 0, 0.14] });
  const scale = phase.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0.96, 1.025, 0.96] });
  return (
    <Animated.View pointerEvents="none" style={[styles.wordmark, { top, opacity, transform: [{ scale }] }]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Animated.View>
  );
}

function ReturnRune({ navigation }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Return to previous MBW chamber" style={styles.returnRune} onPress={() => navigation && navigation.canGoBack && navigation.canGoBack() ? navigation.goBack() : navTo(navigation, 'MainHub')}>
      <Text style={styles.returnText}>♠</Text>
    </Pressable>
  );
}

function ActionOrb({ item, index, total, navigation, radius = 148, centerY = 380, label = true }) {
  const [route, icon, text] = item;
  const { width } = Dimensions.get('window');
  const pulse = useLoop(8600 + index * 160);
  const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / total;
  const x = width / 2 + Math.cos(angle) * radius - 32;
  const y = centerY + Math.sin(angle) * radius * 1.08 - 32;
  const scale = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.94, 1.08, 0.94] });
  const opacity = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.55, 0.95, 0.55] });
  return (
    <Animated.View style={[styles.orbWrap, { left: x, top: y, opacity, transform: [{ scale }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={'Open ' + text} style={styles.orb} onPress={() => navTo(navigation, route)}>
        <Text style={styles.orbIcon}>{icon}</Text>
        {label ? <Text style={styles.orbLabel}>{text}</Text> : null}
      </Pressable>
    </Animated.View>
  );
}

function LowerOrbit({ actions, navigation }) {
  return (
    <View pointerEvents="box-none" style={styles.lowerOrbit}>
      {actions.map((item) => (
        <Pressable key={item[0]} accessibilityRole="button" accessibilityLabel={'Open ' + item[2]} style={styles.microOrb} onPress={() => navTo(navigation, item[0])}>
          <Text style={styles.microIcon}>{item[1]}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Crest({ icon, title, subtitle }) {
  return (
    <View pointerEvents="none" style={styles.crest}>
      <Text style={styles.crestIcon}>{icon}</Text>
      <Text style={styles.crestTitle}>{title}</Text>
      {subtitle ? <Text style={styles.crestSub}>{subtitle}</Text> : null}
    </View>
  );
}

export function MBWFinalMainHubScreen({ navigation }) {
  const h = Dimensions.get('window').height;
  return (
    <PosterDepth routeName="MainHub">
      <SafeAreaView style={styles.safe}>
        <LivingStar top={70} size={140} />
        <Headline title="MEN BEHIND WALL" subtitle="TWO PATHS  •  ONE EMPIRE" top={186} />
        <View pointerEvents="none" style={styles.empireRing} />
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          {MAIN_ACTIONS.map((item, i) => (
            <ActionOrb key={item[0]} item={item} index={i} total={MAIN_ACTIONS.length} navigation={navigation} radius={Math.min(Dimensions.get('window').width * 0.34, 168)} centerY={h * 0.50} />
          ))}
        </View>
        <Text pointerEvents="none" style={styles.whisper}>ASCEND  •  REIGN</Text>
      </SafeAreaView>
    </PosterDepth>
  );
}

export function MBWFinalPathSelectionScreen({ navigation }) {
  return (
    <PosterDepth routeName="PathSelection" intense>
      <SafeAreaView style={styles.safe}>
        <LivingStar top={78} size={144} />
        <Headline title="TWO PATHS" subtitle="ONE EMPIRE" top={210} />
        <View pointerEvents="box-none" style={styles.pathRunes}>
          <Pressable accessibilityRole="button" accessibilityLabel="Enter full MBW app" style={styles.pathRune} onPress={() => navTo(navigation, 'SubscriptionSignup')}>
            <Text style={styles.pathRuneIcon}>👑</Text>
            <Text style={styles.pathRuneText}>FULL MBW</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Enter Master of Life" style={styles.pathRuneAlt} onPress={() => navTo(navigation, 'MasterOfLife')}>
            <Text style={styles.pathRuneIcon}>♠</Text>
            <Text style={styles.pathRuneText}>LIFE</Text>
          </Pressable>
        </View>
        <LowerOrbit actions={MASTER_LIFE_ACTIONS} navigation={navigation} />
      </SafeAreaView>
    </PosterDepth>
  );
}

export function MBWFinalGateLockedScreen({ navigation }) {
  return (
    <PosterDepth routeName="GateLocked" intense>
      <SafeAreaView style={styles.safe}>
        <LivingStar top={94} size={154} />
        <Headline title="ONLYONEGOD" subtitle="ACCESS SEAL" top={260} />
        <Pressable accessibilityRole="button" accessibilityLabel="Open MBW gate" style={styles.smallAccessRune} onPress={() => navTo(navigation, 'GateOpen')}>
          <Text style={styles.smallAccessText}>★</Text>
        </Pressable>
      </SafeAreaView>
    </PosterDepth>
  );
}

export function MBWFinalGateOpenScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navTo(navigation, 'PathSelection'), 5000);
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <PosterDepth routeName="GateOpen" intense>
      <SafeAreaView style={styles.safe}>
        <LivingStar top={Dimensions.get('window').height * 0.31} size={214} />
      </SafeAreaView>
    </PosterDepth>
  );
}

export function MBWFinalCinematicIntroScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navTo(navigation, 'GateLocked'), 11000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.root}>
      {MBW_FINAL_VISUAL_CINEMATIC ? (
        <Video source={MBW_FINAL_VISUAL_CINEMATIC} style={StyleSheet.absoluteFill} resizeMode={ResizeMode.COVER} shouldPlay isLooping={false} isMuted={false} />
      ) : (
        <PosterDepth routeName="CinematicIntro" intense />
      )}
      <View pointerEvents="none" style={styles.cinematicVeil} />
<View pointerEvents="none" style={styles.cinematicWords}>
        <Text style={styles.cinematicWelcome}>WELCOME TO</Text>
        <Text style={styles.cinematicMBW}>MBW</Text>
      </View>
    </View>
  );
}

export function MBWFinalSubscriptionScreen({ navigation }) {
  return (
    <PosterDepth routeName="SubscriptionSignup">
      <SafeAreaView style={styles.safe}>
        <ReturnRune navigation={navigation} />
        <LivingStar top={82} size={132} />
        <Headline title="ACCESS" subtitle="ACE GATE" />
        <View pointerEvents="box-none" style={styles.singleCrest}>
          <Pressable accessibilityRole="button" accessibilityLabel="Enter MBW Main Hub" style={styles.enterRune} onPress={() => navTo(navigation, 'MainHub')}>
            <Text style={styles.enterRuneIcon}>🔐</Text>
            <Text style={styles.enterRuneText}>ENTER</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </PosterDepth>
  );
}

export function MBWFinalRouteScreen({ routeName, navigation }) {
  const spec = resolveMBWFinalVisualRoute(routeName);
  const actions = routeName === 'MasterOfLife' ? MASTER_LIFE_ACTIONS : MAIN_ACTIONS.slice(0, 7);
  return (
    <PosterDepth routeName={routeName}>
      <SafeAreaView style={styles.safe}>
        <ReturnRune navigation={navigation} />
        <LivingStar top={74} size={132} />
        <Headline title={spec.title} subtitle="LIVING CHAMBER" />
        <Crest icon={spec.icon} title={spec.title} subtitle="POSTER  •  STAR  •  ORBIT" />
        <LowerOrbit actions={actions} navigation={navigation} />
      </SafeAreaView>
    </PosterDepth>
  );
}

export default MBWFinalRouteScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  safe: { flex: 1 },
  posterEcho: { ...StyleSheet.absoluteFillObject },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  edgeGlow: { ...StyleSheet.absoluteFillObject, borderWidth: 1, borderColor: 'rgba(247,202,112,0.10)' },
  dust: { ...StyleSheet.absoluteFillObject },
  speck: { position: 'absolute', width: 4, height: 4, borderRadius: 4, backgroundColor: GOLD },
  s1: { left: '12%', top: '20%' },
  s2: { left: '84%', top: '30%' },
  s3: { left: '28%', top: '72%' },
  s4: { left: '64%', top: '66%' },
  s5: { left: '51%', top: '17%' },
  s6: { left: '46%', top: '83%' },
  star: { position: 'absolute', alignSelf: 'center', borderWidth: 1, borderColor: GOLD, backgroundColor: 'rgba(72,0,24,0.38)', alignItems: 'center', justifyContent: 'center' },
  starText: { color: '#ffe6a7', textShadowColor: '#f7ca70', textShadowRadius: 16 },
  wordmark: { position: 'absolute', left: 20, right: 20, minHeight: 62, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#ffe6a7', fontSize: 22, letterSpacing: 4, fontWeight: '800', textAlign: 'center', textShadowColor: '#000', textShadowRadius: 8 },
  subtitle: { color: 'rgba(255,230,167,0.70)', fontSize: 9, letterSpacing: 3, marginTop: 6, textAlign: 'center' },
  empireRing: { position: 'absolute', alignSelf: 'center', top: '32%', width: '78%', aspectRatio: 1, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(247,202,112,0.12)' },
  orbWrap: { position: 'absolute', width: 64, height: 64 },
  orb: { width: 64, height: 64, borderRadius: 64, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: BLACK_GLASS, alignItems: 'center', justifyContent: 'center' },
  orbIcon: { fontSize: 22 },
  orbLabel: { color: '#ffe6a7', fontSize: 7, letterSpacing: 1.1, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  whisper: { position: 'absolute', bottom: 34, alignSelf: 'center', color: 'rgba(255,230,167,0.56)', fontSize: 10, letterSpacing: 5, fontWeight: '800' },
  lowerOrbit: { position: 'absolute', left: 18, right: 18, bottom: 28, minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  microOrb: { width: 44, height: 44, borderRadius: 44, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: 'rgba(0,0,0,0.50)', alignItems: 'center', justifyContent: 'center' },
  microIcon: { fontSize: 20 },
  pathRunes: { position: 'absolute', left: 28, right: 28, top: '53%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  pathRune: { width: 118, height: 118, borderRadius: 118, borderWidth: 1, borderColor: GOLD, backgroundColor: 'rgba(0,0,0,0.34)', alignItems: 'center', justifyContent: 'center' },
  pathRuneAlt: { width: 108, height: 108, borderRadius: 108, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: MAROON, alignItems: 'center', justifyContent: 'center' },
  pathRuneIcon: { fontSize: 28 },
  pathRuneText: { color: '#ffe6a7', fontSize: 10, letterSpacing: 2.4, fontWeight: '900', marginTop: 6 },
  smallAccessRune: { position: 'absolute', alignSelf: 'center', bottom: 48, width: 88, height: 88, borderRadius: 88, borderWidth: 1, borderColor: GOLD, backgroundColor: 'rgba(0,0,0,0.30)', alignItems: 'center', justifyContent: 'center' },
  smallAccessText: { color: '#ffe6a7', fontSize: 28 },
  cinematicVeil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.10)' },
  cinematicWords: { position: 'absolute', left: 20, right: 20, bottom: 90, alignItems: 'center', justifyContent: 'center' },
  cinematicWelcome: { color: '#ffe6a7', fontSize: 13, letterSpacing: 5, fontWeight: '800', textShadowColor: '#000', textShadowRadius: 8 },
  cinematicMBW: { color: '#ffe6a7', fontSize: 44, letterSpacing: 8, fontWeight: '900', marginTop: 10, textShadowColor: '#000', textShadowRadius: 12 },
  returnRune: { position: 'absolute', top: 44, left: 20, width: 44, height: 44, borderRadius: 44, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: BLACK_GLASS, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
  returnText: { color: '#ffe6a7', fontSize: 22 },
  singleCrest: { position: 'absolute', top: '46%', left: 0, right: 0, alignItems: 'center' },
  enterRune: { width: 126, height: 126, borderRadius: 126, borderWidth: 1, borderColor: GOLD, backgroundColor: 'rgba(0,0,0,0.34)', alignItems: 'center', justifyContent: 'center' },
  enterRuneIcon: { fontSize: 32 },
  enterRuneText: { color: '#ffe6a7', fontSize: 12, letterSpacing: 3, fontWeight: '900', marginTop: 8 },
  crest: { position: 'absolute', top: '45%', left: 20, right: 20, alignItems: 'center', justifyContent: 'center' },
  crestIcon: { fontSize: 54, marginBottom: 14 },
  crestTitle: { color: '#ffe6a7', fontSize: 24, letterSpacing: 4, textAlign: 'center', fontWeight: '900', textShadowColor: '#000', textShadowRadius: 9 },
  crestSub: { color: 'rgba(255,230,167,0.62)', fontSize: 9, letterSpacing: 2, marginTop: 10, textAlign: 'center' },
});
