import React, {
  useEffect,
  useMemo,
} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMBWUserSeed } from '../../runtime/MBWUserSeedProvider';

const RINGS = [0, 1, 2, 3, 4];

export default function UserSeedScreen({ navigation }) {
  const {
    userSeed,
    seedReady,
    updateUserSeed,
    refreshAuthLink,
  } = useMBWUserSeed();

  useEffect(() => {
    refreshAuthLink().catch(() => {});
  }, [refreshAuthLink]);

  const identityMark = useMemo(() => {
    const name = String(userSeed?.displayName || 'ACE')
      .trim()
      .split(/\s+/)
      .map((part) => part.slice(0, 1))
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return name || 'A';
  }, [userSeed?.displayName]);

  const begin = async () => {
    await updateUserSeed({ firstRunComplete: true });
    navigation.navigate('Matchmaking');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.field}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return"
          hitSlop={14}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.back,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backMark}>‹</Text>
        </Pressable>

        <View pointerEvents="none" style={styles.orbit}>
          {RINGS.map((ring) => (
            <View
              key={ring}
              style={[
                styles.ring,
                {
                  width: 124 + ring * 20,
                  height: 124 + ring * 20,
                  borderRadius: 62 + ring * 10,
                  opacity: 0.44 - ring * 0.06,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Begin matching"
          disabled={!seedReady}
          onPress={begin}
          style={({ pressed }) => [
            styles.core,
            !seedReady && styles.coreWaiting,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.identity}>
            {identityMark}
          </Text>
          <View style={styles.five}>
            {RINGS.map((item) => (
              <View key={item} style={styles.dot} />
            ))}
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050305',
  },
  field: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  back: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.66)',
    backgroundColor: 'rgba(0,0,0,0.46)',
    zIndex: 10,
  },
  backMark: {
    color: '#D4AF37',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
  },
  orbit: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(111,12,36,0.86)',
  },
  core: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(14,7,10,0.94)',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.32,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  coreWaiting: { opacity: 0.52 },
  identity: {
    color: '#D4AF37',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  five: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 9,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6F0C24',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.82,
  },
});
