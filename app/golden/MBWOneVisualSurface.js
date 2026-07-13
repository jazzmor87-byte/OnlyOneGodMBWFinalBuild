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
const BLACK = 'rgba(0,0,0,0.68)';

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
        <Text style={iconPhase ? styles.headlineIcon : styles.headlineText}>{iconPhase ? icon : title}</Text>
      </Animated.View>
    </View>
  );
}

function UserSeedBadge({ navigation }) {
  const { state } = useMBWGoldenMaster();
  const seed = state.userSeed;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open User Seed"
      onPress={() => navigation?.navigate('SeedProfile')}
      style={({ pressed }) => [styles.seedBadge, pressed && styles.pressed]}
      hitSlop={8}
    >
      {seed.profilePoster ? <Image source={{ uri: seed.profilePoster }} style={styles.seedAvatar} /> : <Text style={styles.seedIcon}>🌱</Text>}
      <View style={styles.seedTextWrap}>
        <Text numberOfLines={1} style={styles.seedName}>{seed.displayName || 'ACE'}</Text>
        <Text style={styles.seedMeta}>{seed.tier || '111'} · {seed.badge || 'BLACK'}</Text>
      </View>
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

export function MBWActionButton({ icon, label, onPress, disabled = false, selected = false, danger = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.actionButton,
        selected && styles.actionSelected,
        danger && styles.actionDanger,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text numberOfLines={2} style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

export function MBWBackButton({ navigation }) {
  return <MBWActionButton icon="←" label="RETURN" onPress={() => navigation?.canGoBack() ? navigation.goBack() : navigation?.navigate('MainHub')} />;
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
      <Text style={styles.listIcon}>{icon}</Text>
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
  poster: { opacity: 0.92 },
  posterVeil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.30)' },
  safe: { flex: 1, minHeight: 760 },
  scrollContent: { flexGrow: 1 },
  contentZone: { flex: 1, paddingTop: 172, paddingHorizontal: 16, paddingBottom: 116 },
  headlineZone: { position: 'absolute', left: 16, right: 16, top: 34, height: 122, alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  starRing: { position: 'absolute', width: 118, height: 118, alignItems: 'center', justifyContent: 'center' },
  starGlyph: { fontSize: 104, color: 'rgba(228,187,98,0.52)', marginTop: -8, textShadowColor: 'rgba(109,18,40,0.64)', textShadowRadius: 16 },
  headlineText: { color: '#ffe8aa', fontSize: 20, fontWeight: '900', letterSpacing: 3, textAlign: 'center', textShadowColor: '#000', textShadowRadius: 10 },
  headlineIcon: { fontSize: 40, textAlign: 'center' },
  seedBadge: { position: 'absolute', right: 14, bottom: 18, minWidth: 104, maxWidth: 154, height: 42, borderRadius: 21, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: 'rgba(0,0,0,0.66)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, zIndex: 30 },
  seedAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 7 },
  seedIcon: { fontSize: 20, marginRight: 7 },
  seedTextWrap: { flexShrink: 1 },
  seedName: { color: '#ffe8aa', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  seedMeta: { color: 'rgba(255,232,170,0.65)', fontSize: 8, marginTop: 2 },
  actionButton: { width: 82, minHeight: 76, borderRadius: 41, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: BLACK, alignItems: 'center', justifyContent: 'center', padding: 8, margin: 5 },
  actionSelected: { borderColor: GOLD, backgroundColor: 'rgba(109,18,40,0.76)' },
  actionDanger: { borderColor: 'rgba(255,96,96,0.7)' },
  actionIcon: { fontSize: 24 },
  actionLabel: { color: '#ffe8aa', fontSize: 8, lineHeight: 11, fontWeight: '800', letterSpacing: 0.8, textAlign: 'center', marginTop: 4 },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  sectionTitle: { color: '#ffe8aa', fontSize: 15, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginVertical: 12, textShadowColor: '#000', textShadowRadius: 7 },
  status: { color: 'rgba(255,232,170,0.78)', fontSize: 11, lineHeight: 17, textAlign: 'center', marginVertical: 8 },
  statusDanger: { color: '#ff9999' },
  input: { minHeight: 46, borderRadius: 23, borderWidth: 1, borderColor: GOLD_SOFT, backgroundColor: 'rgba(0,0,0,0.58)', color: '#ffe8aa', paddingHorizontal: 16, marginVertical: 6 },
  inputMultiline: { minHeight: 84, paddingTop: 12, textAlignVertical: 'top' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  rowWrap: { flexWrap: 'wrap' },
  listItem: { minHeight: 58, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(228,187,98,0.22)', backgroundColor: 'rgba(0,0,0,0.42)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginVertical: 2 },
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
