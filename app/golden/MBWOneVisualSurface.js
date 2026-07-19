import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { resolveMBWGoldenRoute } from './MBWGoldenMasterRegistry';
import { useMBWGoldenMaster } from './MBWGoldenMasterStore';

const GOLD = '#e4bb62';
const GOLD_SOFT = 'rgba(228,187,98,0.42)';
const MAROON = '#6d1228';
const BLACK = 'rgba(0,0,0,0.16)';
const DEFAULT_SEED_VISUAL = require('../assets/mbw_all_pad/ACE_MBW_ICON.png');

const MBW_MONO_GLYPHS = Object.freeze({
  '5️⃣': 'Ⅴ', '★': '✦', '☆': '✧', '♠️': '♠', '⚖️': '≋', '⚙️': '⌘', '⚜️': '⚜',
  '⛔': '⊘', '✂️': '✂', '✅': '✓', '✈️': '✦', '✕': '×', '❤️': '♥', '➕': '+',
  '➖': '−', '➤': '›', '🂡': 'A', '🌱': '✦', '🎙️': '●', '🎮': '◆', '🎯': '⊙',
  '🎲': '◆', '🏆': '♛', '🏠': '⌂', '👑': '♛', '💎': '◆', '💘': '♥', '💬': '◇',
  '💾': '□', '📁': '▣', '📍': '⌖', '📡': '⌁', '📨': '✉', '📱': '▯', '📸': '◈',
  '🔐': '◇', '🔑': '⚿', '🔖': '◇', '🔥': '♨', '🔴': '●', '🕹️': '◆', '🖼️': '▣',
  '🗑️': '×', '🚨': '!', '🛍️': '◇', '🛡️': '◇', '🧭': '⌖', '🧳': '▣', '🧾': '≡',
  '🪙': '●', '↺': '↺', '↻': '↻', '⚜': '⚜', '♠': '♠', '←': '←', '✦': '✦',
});

function mbwMonoGlyph(icon) {
  return MBW_MONO_GLYPHS[icon] || icon || '✦';
}

function PanchTatvaLayer() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 7000, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 7000, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.tatvaFire, { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.03, 0.075] }) }]} />
      <Animated.View style={[styles.tatvaWater, { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.06, 0.025] }) }]} />
      <View style={styles.tatvaAir} />
      <View style={styles.tatvaEarth} />
      <View style={styles.tatvaSpace} />
    </View>
  );
}

function LivingHeadline({ title, icon }) {
  const [iconPhase, setIconPhase] = useState(false);
  const word = useRef(new Animated.Value(1)).current;
  const star = useRef(new Animated.Value(0.72)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    const cycle = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(word, { toValue: 0, duration: 650, useNativeDriver: true }),
          Animated.delay(350),
          Animated.timing(word, { toValue: 1, duration: 650, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(star, { toValue: 1.24, duration: 650, useNativeDriver: true }),
          Animated.delay(350),
          Animated.timing(star, { toValue: 0.72, duration: 650, useNativeDriver: true }),
        ]),
      ]).start(() => {
        if (active) setIconPhase((value) => !value);
      });
    };
    const timer = setInterval(cycle, 5000);
    const rotation = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 18000, useNativeDriver: true }),
    );
    rotation.start();
    return () => {
      active = false;
      clearInterval(timer);
      rotation.stop();
    };
  }, [spin, star, word]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const wordScale = word.interpolate({ inputRange: [0, 1], outputRange: [0.12, 1] });
  const starOpacity = star.interpolate({ inputRange: [0.72, 1.24], outputRange: [0.28, 0.92] });

  return (
    <View pointerEvents="none" style={styles.headlineZone}>
      <Animated.View style={[styles.starRing, { opacity: starOpacity, transform: [{ rotate }, { scale: star }] }]}>
        <Text style={styles.starGlyph}>⛤</Text>
      </Animated.View>
      <Animated.View style={{ opacity: word, transform: [{ scale: wordScale }] }}>
        <Text style={iconPhase ? styles.headlineIcon : styles.headlineText}>{iconPhase ? mbwMonoGlyph(icon) : title}</Text>
      </Animated.View>
    </View>
  );
}

function UserSeedBadge({ navigation }) {
  const { state } = useMBWGoldenMaster();
  const seed = state.userSeed;
  const source = seed.profilePoster ? { uri: seed.profilePoster } : DEFAULT_SEED_VISUAL;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open User Seed"
      onPress={() => navigation?.navigate('SeedProfile')}
      style={({ pressed }) => [styles.seedBadge, pressed && styles.pressed]}
      hitSlop={10}
    >
      <Image source={source} style={styles.seedAvatar} resizeMode="cover" />
    </Pressable>
  );
}

export function MBWOneVisualSurface({ routeName, navigation, children, scroll = true, showSeed = true }) {
  const spec = resolveMBWGoldenRoute(routeName);
  if (spec.media !== 'POSTER' || !spec.poster) {
    throw new Error(`MBW_POSTER_NOT_ASSIGNED:${routeName}`);
  }
  const { dispatch } = useMBWGoldenMaster();
  useEffect(() => {
    dispatch({ type: 'ROUTE', route: routeName });
  }, [dispatch, routeName]);

  return (
    <ImageBackground source={spec.poster} resizeMode="cover" style={styles.root} imageStyle={styles.poster}>
      <View pointerEvents="none" style={styles.posterVeil} />
      <PanchTatvaLayer />
      <SafeAreaView style={styles.safe}>
        <LivingHeadline title={spec.title} icon={spec.icon} />
        {showSeed ? <UserSeedBadge navigation={navigation} /> : null}
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.contentZone}>{children}</View>
          </ScrollView>
        ) : (
          <View style={styles.contentZone}>{children}</View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

export function MBWActionButton({ icon, label, onPress, disabled = false, selected = false, danger = false, compact = false, iconOnly = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label || 'MBW action'}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.actionButton,
        compact && styles.actionCompact,
        iconOnly && styles.actionIconOnly,
        selected && styles.actionSelected,
        danger && styles.actionDanger,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.actionIcon}>{mbwMonoGlyph(icon)}</Text>
      {!iconOnly && label ? <Text numberOfLines={2} style={styles.actionLabel}>{label}</Text> : null}
    </Pressable>
  );
}

export function MBWBackButton({ navigation }) {
  return <MBWActionButton icon="←" label="RETURN" compact iconOnly onPress={() => navigation?.canGoBack() ? navigation.goBack() : navigation?.navigate('MainHub')} />;
}

export function MBWSectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function MBWStatus({ children, danger = false }) {
  return <Text style={[styles.status, danger && styles.statusDanger]}>{children}</Text>;
}

export function MBWInput({ value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default', multiline = false }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,230,167,0.45)"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
      style={[styles.input, multiline && styles.inputMultiline]}
    />
  );
}

export function MBWRow({ children, wrap = true }) {
  return <View style={[styles.row, wrap && styles.rowWrap]}>{children}</View>;
}

export function MBWListItem({ title, subtitle, right, onPress, icon = '♠️' }) {
  const content = (
    <View style={styles.listItem}>
      <Text style={styles.listIcon}>{mbwMonoGlyph(icon)}</Text>
      <View style={styles.listTextWrap}>
        <Text style={styles.listTitle}>{title}</Text>
        {subtitle ? <Text style={styles.listSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <Text style={styles.listRight}>{right}</Text> : null}
    </View>
  );
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable> : content;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#030101' },
  poster: { opacity: 1 },
  posterVeil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.10)' },
  safe: { flex: 1, minHeight: 760 },
  scrollContent: { flexGrow: 1 },
  contentZone: { flex: 1, paddingTop: 160, paddingHorizontal: 10, paddingBottom: 116 },
  headlineZone: { position: 'absolute', left: 16, right: 16, top: 34, height: 122, alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  starRing: { position: 'absolute', width: 118, height: 118, alignItems: 'center', justifyContent: 'center' },
  starGlyph: { fontSize: 104, color: 'rgba(228,187,98,0.52)', marginTop: -8, textShadowColor: 'rgba(109,18,40,0.64)', textShadowRadius: 16 },
  headlineText: { color: '#ffe8aa', fontSize: 20, fontWeight: '900', letterSpacing: 3, textAlign: 'center', textShadowColor: '#000', textShadowRadius: 10 },
  headlineIcon: { fontSize: 40, textAlign: 'center' },
  seedBadge: { position: 'absolute', right: 14, bottom: 18, width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: GOLD, backgroundColor: 'rgba(0,0,0,0.12)', alignItems: 'center', justifyContent: 'center', zIndex: 30, overflow: 'hidden' },
  seedAvatar: { width: 50, height: 50, borderRadius: 25 },
  seedIcon: { display: 'none' },
  seedTextWrap: { display: 'none' },
  seedName: { display: 'none' },
  seedMeta: { display: 'none' },
  actionButton: { width: 64, minHeight: 62, borderRadius: 32, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: 'rgba(0,0,0,0.16)', alignItems: 'center', justifyContent: 'center', padding: 5, margin: 4 },
  actionCompact: { width: 56, minHeight: 54, borderRadius: 28, padding: 4, margin: 3 },
  actionIconOnly: { width: 54, minHeight: 54, borderRadius: 27, padding: 0 },
  actionSelected: { borderColor: GOLD, backgroundColor: 'rgba(109,18,40,0.58)' },
  actionDanger: { borderColor: 'rgba(255,96,96,0.7)' },
  actionIcon: { fontSize: 23, color: GOLD, textShadowColor: 'rgba(109,18,40,0.85)', textShadowRadius: 8 },
  actionLabel: { color: '#ffe8aa', fontSize: 7, lineHeight: 9, fontWeight: '900', letterSpacing: 0.5, textAlign: 'center', marginTop: 2 },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  sectionTitle: { color: '#ffe8aa', fontSize: 15, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginVertical: 12, textShadowColor: '#000', textShadowRadius: 7 },
  status: { color: 'rgba(255,232,170,0.78)', fontSize: 11, lineHeight: 17, textAlign: 'center', marginVertical: 8 },
  statusDanger: { color: '#ff9999' },
  input: { minHeight: 44, borderRadius: 22, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: 'rgba(0,0,0,0.22)', color: '#ffe8aa', paddingHorizontal: 16, marginVertical: 5 },
  inputMultiline: { minHeight: 84, paddingTop: 12, textAlignVertical: 'top' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  rowWrap: { flexWrap: 'wrap' },
  listItem: { minHeight: 56, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(228,187,98,0.22)', backgroundColor: 'rgba(0,0,0,0.16)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginVertical: 2 },
  listIcon: { fontSize: 19, width: 34 },
  listTextWrap: { flex: 1 },
  listTitle: { color: '#ffe8aa', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  listSubtitle: { color: 'rgba(255,232,170,0.62)', fontSize: 9, marginTop: 3 },
  listRight: { color: GOLD, fontSize: 10, fontWeight: '800', marginLeft: 8 },
  tatvaFire: { position: 'absolute', width: 520, height: 520, borderRadius: 260, right: -250, top: 80, backgroundColor: MAROON },
  tatvaWater: { position: 'absolute', width: 420, height: 420, borderRadius: 210, left: -200, bottom: 40, backgroundColor: '#a77a20' },
  tatvaAir: { position: 'absolute', width: 700, height: 700, borderRadius: 350, left: -180, top: 230, borderWidth: 1, borderColor: 'rgba(228,187,98,0.04)' },
  tatvaEarth: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, backgroundColor: 'rgba(74,42,20,0.03)' },
  tatvaSpace: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(40,8,52,0.025)' },
});

// MBW_USER_SEED_GOLDEN_BRIDGE_V14
export * as MBWUserSeedRuntimeV14 from '../runtime/MBWUserSeedRuntime';
export * as MBWUserSeedProviderV14 from '../runtime/MBWUserSeedProvider';

/* MBW_APK_EXTRACTED_SEED_UNIVERSAL_V21 */
export * as MBWUniversalSeedRegistryV21 from '../runtime/MBWUniversalSeedRegistryV21';
