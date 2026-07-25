import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  MBWCinematicProductionStage,
  MBWCinematicSovereignMotionOS,
  useMBWCinematicAccessibility,
} from './MBWCinematicSovereignMotionOS';

const GOLD = '#D4AF37';
const MAROON = '#5A0B1B';

let activeRouteName = 'CinematicIntro';
const routeListeners = new Set();

export function getMBWActiveRouteName(state) {
  let current = state;
  let name = activeRouteName;

  while (
    current &&
    Array.isArray(current.routes) &&
    current.routes.length
  ) {
    const index = Number.isInteger(current.index)
      ? current.index
      : current.routes.length - 1;
    const route =
      current.routes[index] ||
      current.routes[current.routes.length - 1];

    if (!route) break;
    if (route.name) name = route.name;
    current = route.state;
  }

  return name;
}

export function publishMBWActiveRoute(routeOrState) {
  const next =
    typeof routeOrState === 'string'
      ? routeOrState
      : getMBWActiveRouteName(routeOrState);

  if (!next || next === activeRouteName) return;

  activeRouteName = next;

  for (const listener of routeListeners) {
    listener(activeRouteName);
  }
}

function useMBWActiveRoute() {
  const [routeName, setRouteName] = useState(activeRouteName);

  useEffect(() => {
    routeListeners.add(setRouteName);
    return () => routeListeners.delete(setRouteName);
  }, []);

  return routeName;
}


export function MBWDarkMatterProductionStage({
  children,
}) {
  const routeName = useMBWActiveRoute();

  return (
    <MBWCinematicProductionStage
      routeName={routeName}
    >
      {children}
    </MBWCinematicProductionStage>
  );
}

export function MBWDarkMatterProductionVisualOS() {
  const routeName = useMBWActiveRoute();

  return (
    <MBWCinematicSovereignMotionOS
      routeName={routeName}
    />
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MBWDarkMatterPressable = forwardRef(
  function MBWDarkMatterPressable(
    {
      children,
      disabled,
      onPressIn,
      onPressOut,
      style,
      ...props
    },
    ref,
  ) {
    const {
      reducedMotion,
      appActive,
      performanceTier,
    } = useMBWCinematicAccessibility();

    const scale = useRef(new Animated.Value(1)).current;
    const lift = useRef(new Animated.Value(0)).current;
    const aura = useRef(new Animated.Value(0.26)).current;
    const ring = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (
        reducedMotion ||
        disabled ||
        !appActive
      ) {
        aura.setValue(disabled ? 0.08 : 0.26);
        ring.setValue(0);
        return undefined;
      }

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(aura, {
              toValue: 0.54,
              duration:
                performanceTier === 'LOW'
                  ? 2100
                  : 1600,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(ring, {
              toValue: 1,
              duration:
                performanceTier === 'HIGH'
                  ? 3200
                  : 4200,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(aura, {
            toValue: 0.24,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );

      pulse.start();
      return () => pulse.stop();
    }, [
      appActive,
      aura,
      disabled,
      performanceTier,
      reducedMotion,
      ring,
    ]);

    const animatePress = (pressed) => {
      if (
        reducedMotion ||
        disabled ||
        !appActive
      ) {
        return;
      }

      Animated.parallel([
        Animated.spring(scale, {
          toValue: pressed ? 0.91 : 1,
          damping: 15,
          stiffness: 240,
          mass: 0.52,
          useNativeDriver: true,
        }),
        Animated.spring(lift, {
          toValue: pressed ? 1 : 0,
          damping: 16,
          stiffness: 210,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const ringRotation = ring.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <AnimatedPressable
        {...props}
        ref={ref}
        disabled={disabled}
        onPressIn={(event) => {
          animatePress(true);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          animatePress(false);
          onPressOut?.(event);
        }}
        style={(state) => [
          styles.productionIconButton,
          typeof style === 'function'
            ? style(state)
            : style,
          {
            opacity: disabled ? 0.45 : 1,
            transform: [
              { scale },
              {
                translateY: lift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -2],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.buttonRing,
            {
              opacity:
                performanceTier === 'LOW'
                  ? 0
                  : aura,
              transform: [
                { scale },
                { rotate: ringRotation },
              ],
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.buttonAura,
            {
              opacity: aura,
              transform: [{ scale }],
            },
          ]}
        />

        <View
          pointerEvents="none"
          style={styles.buttonCore}
        >
          {children}
        </View>
      </AnimatedPressable>
    );
  },
);

const styles = StyleSheet.create({
  productionIconButton: {
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  buttonRing: {
    position: 'absolute',
    top: -11,
    right: -11,
    bottom: -11,
    left: -11,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GOLD,
    borderTopColor: 'transparent',
    borderBottomColor: MAROON,
  },
  buttonAura: {
    position: 'absolute',
    top: -7,
    right: -7,
    bottom: -7,
    left: -7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GOLD,
    backgroundColor: 'rgba(90,11,27,0.16)',
  },
  buttonCore: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
