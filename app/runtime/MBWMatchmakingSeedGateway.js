import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMBWUserSeed } from './MBWUserSeedProvider';

export const withMBWSeedGateway = (BaseComponent) => {
  function MBWMatchmakingSeedGateway(props) {
    const {
      userSeed,
      seedReady,
      refreshAuthLink,
    } = useMBWUserSeed();
    const navigation = props.navigation;
    const pathMark = String(userSeed?.path || 'A')
      .slice(0, 1)
      .toUpperCase();
    const tierMark = userSeed?.tier
      ? String(userSeed.tier).slice(0, 1)
      : '•';

    const openSeed = () => {
      refreshAuthLink().catch(() => {});
      navigation?.navigate?.('UserSeed');
    };

    return (
      <View style={styles.root}>
        <BaseComponent {...props} />
        {seedReady ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open identity"
            hitSlop={12}
            onPress={openSeed}
            style={({ pressed }) => [
              styles.gateway,
              pressed && styles.gatewayPressed,
            ]}
          >
            <Text style={styles.mark}>
              {pathMark}
              {tierMark}
            </Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  MBWMatchmakingSeedGateway.displayName =
    `withMBWSeedGateway(${
      BaseComponent.displayName ||
      BaseComponent.name ||
      'Component'
    })`;

  return MBWMatchmakingSeedGateway;
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  gateway: {
    position: 'absolute',
    right: 16,
    bottom: 28,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8,6,8,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.88)',
    shadowColor: '#000',
    shadowOpacity: 0.38,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 9,
    zIndex: 90,
  },
  gatewayPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.86,
  },
  mark: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
