import { safeNavigate } from '../runtime/MBWSafeNavigation';
// MBW_SAFE_AREA_AUDITED=HONOR_PAD_SAFE_ZONE
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function MBWPremiumOracleVisualCore({ navigation, poster, headline, iconActions = [] }) {
  const cycle = useRef(new Animated.Value(0)).current;
  const star = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const headlineLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cycle, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cycle, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const starLoop = Animated.loop(
      Animated.timing(star, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    headlineLoop.start();
    starLoop.start();

    return () => {
      headlineLoop.stop();
      starLoop.stop();
    };
  }, [cycle, star]);

  const headlineOpacity = cycle.interpolate({
    inputRange: [0, 0.42, 0.55, 1],
    outputRange: [1, 1, 0, 0],
  });

  const iconActionOpacity = cycle.interpolate({
    inputRange: [0, 0.42, 0.55, 1],
    outputRange: [0, 0, 1, 1],
  });

  const iconActionRise = cycle.interpolate({
    inputRange: [0, 0.42, 0.55, 1],
    outputRange: [18, 18, 0, 0],
  });

  const rotate = star.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const starTravel = star.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-30, 30, -30],
  });

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <ImageBackground source={poster} style={styles.poster} imageStyle={styles.posterImage}>
        <View pointerEvents="none" style={styles.veil} />

        <Animated.View pointerEvents="none" style={[styles.premiumStarAura, { transform: [{ translateY: starTravel }, { rotate }] }]}>
          <Text style={styles.premiumStar}>★</Text>
        </Animated.View>

        <ScrollView style={styles.frontScroll} contentContainerStyle={styles.frontContent} showsVerticalScrollIndicator={false}>
          <Animated.View pointerEvents="none" style={[styles.headlineBox, { opacity: headlineOpacity }]}>
            <Text style={styles.aceMark}>♠️</Text>
            <Text style={styles.headline}>{headline}</Text>
          </Animated.View>

          <Animated.View style={[styles.iconActionZone, { opacity: iconActionOpacity, transform: [{ translateY: iconActionRise }] }]}>
            {iconActions.map((item, index) => (
              <Pressable
                key={`${item.label}-${index}`}
                accessible
                accessibilityLabel={item.label}
                onPress={() => safeNavigate(navigation, item.route, item.params || undefined)}
                style={({ pressed }) => [
                  styles.iconAction,
                  index % 2 === 1 && styles.iconActionMaroon,
                  pressed && styles.iconActionPressed,
                ]}
              >
                <Text style={styles.iconGlyph}>{item.icon}</Text>
                <Text style={styles.iconLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 24,
    paddingBottom: 24, flex: 1, backgroundColor: '#030000' },
  poster: { flex: 1, backgroundColor: '#030000' },
  posterImage: { resizeMode: 'cover', opacity: 0.84 },
  // MBW_OVERLAY_POINTER_EVENTS_PROOF=pointerEvents="none"

  veil: { ...StyleSheet.absoluteFillObject, pointerEvents: 'none', pointerEvents: 'none', backgroundColor: 'rgba(0,0,0,0.18)' },
  premiumStarAura: {
    position: 'absolute',
    top: '11%',
    alignSelf: 'center',
    width: 158,
    height: 158,
    borderRadius: 79,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(48,0,12,0.46)',
    borderWidth: 1.5,
    borderColor: 'rgba(214,164,65,0.98)',
    shadowColor: '#d6a441',
    shadowOpacity: 0.98,
    shadowRadius: 28,
    elevation: 80,
  },
  premiumStar: {
    color: '#f3d28a',
    fontSize: 92,
    lineHeight: 106,
    textShadowColor: '#8b0018',
    textShadowRadius: 20,
  },
  frontScroll: { flex: 1, zIndex: 90, elevation: 90 },
  frontContent: { flexGrow: 1, minHeight: '100%', justifyContent: 'flex-end', paddingHorizontal: 22, paddingTop: 72, paddingBottom: 46 },
  headlineBox: {
    alignSelf: 'stretch',
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingVertical: 19,
    borderRadius: 32,
    borderWidth: 1.6,
    borderColor: 'rgba(214,164,65,0.98)',
    backgroundColor: 'rgba(3,0,0,0.86)',
    shadowColor: '#d6a441',
    shadowOpacity: 0.95,
    shadowRadius: 28,
    elevation: 75,
  },
  aceMark: { textAlign: 'center', fontSize: 32, lineHeight: 39, color: '#f3d28a' },
  headline: {
    marginTop: 4,
    textAlign: 'center',
    color: '#f3d28a',
    fontSize: 23,
    lineHeight: 30,
    letterSpacing: 2.0,
    fontWeight: '900',
    textShadowColor: '#8b0018',
    textShadowRadius: 16,
  },
  iconActionZone: { gap: 12, zIndex: 100, elevation: 100 },
  iconAction: {
    minHeight: 66,
    borderRadius: 999,
    borderWidth: 1.6,
    borderColor: 'rgba(214,164,65,0.98)',
    backgroundColor: 'rgba(3,0,0,0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowColor: '#d6a441',
    shadowOpacity: 0.98,
    shadowRadius: 25,
    elevation: 85,
  },
  iconActionMaroon: { borderColor: 'rgba(128,0,18,0.98)', backgroundColor: 'rgba(48,0,12,0.90)' },
  iconActionPressed: { transform: [{ scale: 0.98 }], backgroundColor: 'rgba(90,0,18,0.96)' },
  iconGlyph: { color: '#f3d28a', fontSize: 24, lineHeight: 28, textAlign: 'center' },
  iconLabel: { color: '#f3d28a', fontSize: 14, letterSpacing: 1.4, fontWeight: '900', textAlign: 'center' },
});
