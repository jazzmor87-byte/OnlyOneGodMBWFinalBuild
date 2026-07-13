import { safeNavigate } from '../runtime/MBWSafeNavigation';
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

export default function MBWVisibleScreenCore({ navigation, poster, title, actions = [] }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.06],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.46],
  });

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <ImageBackground source={poster} style={styles.poster} imageStyle={styles.posterImage}>
        <View pointerEvents="none" style={styles.veil} />
        <Animated.View pointerEvents="none" style={[styles.auraOuter, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
        <Animated.View pointerEvents="none" style={[styles.auraInner, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />

        <ScrollView style={styles.frontScroll} contentContainerStyle={styles.frontContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.titleBox}>
            <Text style={styles.ace}>♠️</Text>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.actionZone}>
            {actions.map((item, index) => (
              <Pressable
                key={`${item.label}-${index}`}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => safeNavigate(navigation, item.route, item.params || undefined)}
                style={({ pressed }) => [styles.actionPill, index % 2 === 1 && styles.actionPillMaroon, pressed && styles.actionPillPressed]}
              >
                <Text style={styles.actionText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#030000' },
  poster: { flex: 1, backgroundColor: '#030000' },
  posterImage: { resizeMode: 'cover', opacity: 0.82 },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.20)' },
  auraOuter: {
    position: 'absolute',
    top: '8%',
    alignSelf: 'center',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(128,0,18,0.28)',
    shadowColor: '#d6a441',
    shadowOpacity: 0.88,
    shadowRadius: 38,
    elevation: 22,
  },
  auraInner: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: 'rgba(214,164,65,0.22)',
    shadowColor: '#8b0018',
    shadowOpacity: 0.72,
    shadowRadius: 28,
    elevation: 18,
  },
  frontScroll: { flex: 1, zIndex: 70, elevation: 70 },
  frontContent: { flexGrow: 1, minHeight: '100%', justifyContent: 'flex-end', paddingHorizontal: 22, paddingTop: 70, paddingBottom: 44 },
  titleBox: {
    alignSelf: 'stretch',
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(214,164,65,0.98)',
    backgroundColor: 'rgba(3,0,0,0.82)',
    shadowColor: '#d6a441',
    shadowOpacity: 0.88,
    shadowRadius: 25,
    elevation: 55,
  },
  ace: { textAlign: 'center', fontSize: 32, lineHeight: 39, color: '#f3d28a' },
  title: {
    marginTop: 4,
    textAlign: 'center',
    color: '#f3d28a',
    fontSize: 22,
    lineHeight: 29,
    letterSpacing: 1.8,
    fontWeight: '900',
    textShadowColor: '#8b0018',
    textShadowRadius: 14,
  },
  actionZone: { gap: 12, zIndex: 80, elevation: 80 },
  actionPill: {
    minHeight: 62,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(214,164,65,0.98)',
    backgroundColor: 'rgba(3,0,0,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowColor: '#d6a441',
    shadowOpacity: 0.95,
    shadowRadius: 23,
    elevation: 60,
  },
  actionPillMaroon: { borderColor: 'rgba(128,0,18,0.98)', backgroundColor: 'rgba(48,0,12,0.88)' },
  actionPillPressed: { transform: [{ scale: 0.98 }], backgroundColor: 'rgba(90,0,18,0.94)' },
  actionText: { color: '#f3d28a', fontSize: 14, letterSpacing: 1.35, fontWeight: '900', textAlign: 'center' },
});
