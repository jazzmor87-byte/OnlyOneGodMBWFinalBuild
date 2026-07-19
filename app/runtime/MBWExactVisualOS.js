// MBW_EXACT_VISUAL_OS_V1
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  mbwVisualDriverMount,
  mbwVisualDriverUnmount,
} from './MBWVisualDriverRegistry';

const REFERENCES = {
  orbital: require('../../assets/mbw/exact-visual-os/MBW_REF_01_ORBITAL_WORLD.png'),
  path: require('../../assets/mbw/exact-visual-os/MBW_REF_02_PATH_GATE.png'),
  coins: require('../../assets/mbw/exact-visual-os/MBW_REF_03_MASTER_OF_COINS.png'),
};

const HEADLINES = [
  ['cinematicintro', 'WELCOME TO'],
  ['mainhub', 'MEN BEHIND WALL'],
  ['pathselection', 'CHOOSE YOUR PATH'],
  ['masteroflife', 'MASTER OF LIFE'],
  ['masterofcoins', 'MASTER OF COINS'],
  ['coins', 'MASTER OF COINS'],
  ['matchmaking', 'MATCHMAKING'],
  ['masterofgames', 'MASTER OF GAMES'],
  ['games', 'MASTER OF GAMES'],
  ['travellocal', 'TRAVEL LOCAL'],
  ['traveloverseas', 'TRAVEL OVERSEAS'],
  ['merchandise', 'MERCHANDISE'],
  ['kamashastra', 'KAMASHASTRA'],
  ['livelounge', 'LIVE LOUNGE'],
  ['menslounge', "MEN'S LOUNGE"],
  ['nearby', 'NEARBY'],
  ['aiposter', 'AI POSTER'],
  ['settings', 'SETTINGS'],
  ['profile', 'PROFILE'],
  ['subscription', 'ASCEND'],
];

function normalize(value) {
  return String(value || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
}
function headlineFor(screenId) {
  const key = normalize(screenId);
  const match = HEADLINES.find(([token]) => key.includes(token));
  if (match) return match[1];
  return String(screenId || 'MEN BEHIND WALL')
    .replace(/Screen$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .toUpperCase();
}
function referenceFor(screenId) {
  const key = normalize(screenId);
  if (key.includes('coin')) return REFERENCES.coins;
  if (key.includes('path') || key.includes('gate') || key.includes('entry') || key.includes('mainhub')) {
    return REFERENCES.path;
  }
  return REFERENCES.orbital;
}
function isCinematicIntro(screenId) {
  return normalize(screenId).includes('cinematicintro');
}

function MBWExactHeadline({ screenId, reduceMotion }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const intro = isCinematicIntro(screenId);
  const [introText, setIntroText] = useState('WELCOME TO');

  useEffect(() => {
    if (reduceMotion) return undefined;
    if (intro) {
      const introTimer = setTimeout(() => setIntroText('MBW'), 5000);
      return () => clearTimeout(introTimer);
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(5000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(620),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [intro, opacity, reduceMotion]);

  return (
    <Animated.View pointerEvents="none" style={[styles.headlineDock, { opacity }]}
      accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.ornamentLine} />
      <Text style={styles.headline}>{intro ? introText : headlineFor(screenId)}</Text>
      <View style={styles.ornamentLine} />
    </Animated.View>
  );
}

function MBWOrbitalDriver({ reduceMotion }) {
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduceMotion) return undefined;
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 28000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [reduceMotion, rotation]);
  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View pointerEvents="none" style={[styles.orbitField, { transform: [{ rotate: spin }] }]}
      accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.orbitOuter} />
      <View style={styles.orbitMiddle} />
      <View style={styles.orbitInner} />
      <View style={[styles.orbitNode, styles.nodeNorth]} />
      <View style={[styles.orbitNode, styles.nodeEast]} />
      <View style={[styles.orbitNode, styles.nodeSouth]} />
      <View style={[styles.orbitNode, styles.nodeWest]} />
    </Animated.View>
  );
}

export function MBWExactVisualBody({ screenId, children }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const intro = isCinematicIntro(screenId);
  const source = useMemo(() => referenceFor(screenId), [screenId]);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => { if (active) setReduceMotion(Boolean(value)); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    mbwVisualDriverMount(screenId, {
      visualBody: true,
      headline: true,
      orbit: !intro,
      foregroundOnly: true,
      backgroundService: false,
    });
    return () => mbwVisualDriverUnmount(screenId);
  }, [intro, screenId]);

  return (
    <View style={styles.root}>
      <ImageBackground source={source} resizeMode="cover" style={styles.image} imageStyle={styles.imageTexture}>
        <View pointerEvents="none" style={styles.blackVeil} />
        <View pointerEvents="none" style={styles.maroonVeil} />
        <View pointerEvents="none" style={styles.goldAtmosphere} />
        {!intro ? <MBWOrbitalDriver reduceMotion={reduceMotion} /> : null}
        <View style={styles.productionContent}>{children}</View>
        <MBWExactHeadline screenId={screenId} reduceMotion={reduceMotion} />
      </ImageBackground>
    </View>
  );
}

export function withMBWExactVisualOS(ScreenComponent, metadata = {}) {
  const screenId = metadata.screenId || ScreenComponent.displayName || ScreenComponent.name || 'MBWScreen';
  function MBWExactVisualScreen(props) {
    return (
      <MBWExactVisualBody screenId={screenId}>
        <ScreenComponent {...props} />
      </MBWExactVisualBody>
    );
  }
  MBWExactVisualScreen.displayName = `MBWExactVisualOS(${screenId})`;
  return MBWExactVisualScreen;
}

export function withMBWExactFloatingButton(ButtonComponent) {
  function MBWExactFloatingButton(props) {
    return (
      <View style={styles.floatingButtonHalo}>
        <View style={styles.floatingButtonCore}>
          <ButtonComponent {...props} />
        </View>
      </View>
    );
  }
  MBWExactFloatingButton.displayName =
    `MBWExactFloatingButton(${ButtonComponent.displayName || ButtonComponent.name || 'Button'})`;
  return MBWExactFloatingButton;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050202' },
  image: { flex: 1, backgroundColor: '#050202' },
  imageTexture: { opacity: 0.42 },
  blackVeil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.63)' },
  maroonVeil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(58,0,18,0.20)' },
  goldAtmosphere: {
    position: 'absolute', left: '18%', right: '18%', top: '16%', height: '42%', borderRadius: 999,
    backgroundColor: 'rgba(211,160,53,0.065)', transform: [{ scaleX: 1.6 }],
  },
  productionContent: { flex: 1, zIndex: 10, backgroundColor: 'transparent' },
  headlineDock: {
    position: 'absolute', top: 22, left: 24, right: 24, zIndex: 80,
    alignItems: 'center', justifyContent: 'center',
  },
  headline: {
    color: '#D9AB57', fontFamily: 'serif', fontSize: 21, fontWeight: '600', letterSpacing: 5.2,
    textAlign: 'center', textShadowColor: 'rgba(218,164,64,0.55)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 10,
  },
  ornamentLine: { width: 94, height: StyleSheet.hairlineWidth, marginVertical: 7, backgroundColor: 'rgba(217,171,87,0.64)' },
  orbitField: { position: 'absolute', width: 330, height: 330, alignSelf: 'center', top: '25%', zIndex: 2, opacity: 0.52 },
  orbitOuter: { ...StyleSheet.absoluteFillObject, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(217,171,87,0.34)' },
  orbitMiddle: { position: 'absolute', left: 34, right: 34, top: 34, bottom: 34, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(111,40,119,0.36)' },
  orbitInner: { position: 'absolute', left: 79, right: 79, top: 79, bottom: 79, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(217,171,87,0.40)' },
  orbitNode: { position: 'absolute', width: 8, height: 8, borderRadius: 999, backgroundColor: '#D9AB57', shadowColor: '#D9AB57', shadowOpacity: 0.8, shadowRadius: 7, elevation: 4 },
  nodeNorth: { top: -4, left: 161 }, nodeEast: { right: -4, top: 161 },
  nodeSouth: { bottom: -4, left: 161 }, nodeWest: { left: -4, top: 161 },
  floatingButtonHalo: { borderRadius: 999, padding: 3, borderWidth: 1, borderColor: 'rgba(217,171,87,0.62)', backgroundColor: 'rgba(6,2,3,0.76)', shadowColor: '#D9AB57', shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  floatingButtonCore: { overflow: 'hidden', borderRadius: 999, backgroundColor: 'rgba(21,5,10,0.76)' },
});
