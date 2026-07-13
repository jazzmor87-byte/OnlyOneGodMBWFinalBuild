import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  AccessibilityInfo,
  Animated,
  Easing,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as MBWVisualAssetRegistry from './MBWVisualAssetRegistry';

import {
  getMBWVisualLogicDriverRoute,
} from './MBWVisualLogicDriverRegistry';

import {
  getMBWActionTarget,
  getMBWLogicPresentation,
  isMBWLogicPresentationReady,
} from './MBWLogicPresentationDriver';

import {
  resolveMBWPosterSource,
  isMBWPosterBindingReady,
} from './MBWAssetPosterBindingDriver';

import {
  getMBWInheritedVisualParent,
  isMBWResultInternalRouteReady,
  isMBWGeneratedInternalInheritanceReady,
} from './MBWResultInternalInheritanceDriver';

import {
  getMBWMainHubSectionTargets,
  isMBWAuthorityChainReady,
} from './MBWAuthorityChainDriver';
import { isMBWAllowedNavigationRoute } from './MBWAuthorityChainDriver';


import { readMBWLiveUserSeed, recordMBWUserRoute } from './MBWLiveUserSeed';
function normalizeMBWSource(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return { uri: value };
  }

  if (value?.uri) {
    return value;
  }

  if (value?.source) {
    return normalizeMBWSource(value.source);
  }

  if (value?.default) {
    return normalizeMBWSource(value.default);
  }

  return null;
}


function getMBWRegistryCandidates() {
  return [
    MBWVisualAssetRegistry,
    MBWVisualAssetRegistry?.default,
    MBWVisualAssetRegistry?.MBW_VISUAL_ASSET_REGISTRY,
    MBWVisualAssetRegistry?.MBW_FINAL_VISUAL_ROUTES,
    MBWVisualAssetRegistry?.MBW_POSTER_REGISTRY,
  ].filter(Boolean);
}


function resolvePosterOpacity(law) {
  const values = String(law || '')
    .match(/0\.\d+/g)
    ?.map(Number)
    ?.filter((value) => Number.isFinite(value));

  if (values?.length) {
    const average =
      values.reduce((total, value) => total + value, 0)
      / values.length;

    return Math.max(0.05, Math.min(1, average));
  }

  return 0.84;
}


function resolvePosterResizeMode(law) {
  const normalized = String(law || '').toUpperCase();

  if (normalized.includes('CONTAIN')) {
    return 'contain';
  }

  if (normalized.includes('CENTER')) {
    return 'cover';
  }

  if (normalized.includes('STRETCH')) {
    return 'stretch';
  }

  return 'cover';
}


function resolvePanchOpacity(value) {
  const numeric = Number(value);

  if (Number.isFinite(numeric)) {
    return Math.max(0.03, Math.min(0.08, numeric));
  }

  const match = String(value || '').match(/0\.\d+/);

  if (match) {
    return Math.max(0.03, Math.min(0.08, Number(match[0])));
  }

  return 0.05;
}


function resolveHeadlineZone(zone) {
  const normalized = String(zone || '').toUpperCase();

  if (normalized.includes('CENTER')) {
    return styles.headlineCenter;
  }

  if (normalized.includes('BOTTOM')) {
    return styles.headlineBottom;
  }

  return styles.headlineTop;
}


function resolveIconPosition(position, isMainHub) {
  if (isMainHub) {
    return styles.mainHubIconRail;
  }

  const normalized = String(position || '').toUpperCase();

  if (normalized.includes('LEFT')) {
    return styles.iconRailLeft;
  }

  if (normalized.includes('CENTER')) {
    return styles.iconRailCenter;
  }

  if (normalized.includes('TOP')) {
    return styles.iconRailTop;
  }

  return styles.iconRailRight;
}


function resolveStarColors(law, cycle) {
  const normalized = String(law || '').toUpperCase();
  const gold = '#D6AA46';
  const maroon = '#6C142F';

  if (
    normalized.includes('GOLD_MAROON')
    || normalized.includes('50/50')
    || normalized.includes('50_50')
  ) {
    return cycle % 2 === 0 ? gold : maroon;
  }

  if (
    normalized.includes('MAROON')
    && !normalized.includes('GOLD')
  ) {
    return maroon;
  }

  if (
    normalized.includes('CYCLE')
    || normalized.includes('123')
    || normalized.includes('231')
    || normalized.includes('312')
  ) {
    return cycle % 3 === 0
      ? gold
      : cycle % 3 === 1
        ? maroon
        : '#B18435';
  }

  return gold;
}


function resolveTransitionDuration(mode, reducedMotion) {
  if (reducedMotion) {
    return 0;
  }

  const normalized = String(mode || '').toUpperCase();

  if (normalized.includes('SLOW')) {
    return 720;
  }

  if (normalized.includes('FAST')) {
    return 220;
  }

  return 420;
}


function useMBWReducedMotion(enabled) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo
      .isReduceMotionEnabled()
      .then((value) => {
        if (mounted) {
          setReducedMotion(Boolean(value));
        }
      })
      .catch(() => {});

    const subscription = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      (value) => setReducedMotion(Boolean(value))
    );

    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  return enabled === false ? false : reducedMotion;
}


function MBWPosterLayer({
  meta,
  activeRoute,
}) {
  if (
    activeRoute === 'CinematicIntro'
    || meta?.visualDriverBypassPoster === true
  ) {
    return null;
  }

  const posterSource = resolveMBWPosterSource(
    meta,
    getMBWRegistryCandidates(),
    normalizeMBWSource
  );

  if (!posterSource) {
    return null;
  }

  const opacity = resolvePosterOpacity(
    meta?.posterOpacityLaw
  );

  const resizeMode = resolvePosterResizeMode(
    meta?.posterSafeCropMode
  );

  return (
    <ImageBackground
      pointerEvents="none"
      source={posterSource}
      resizeMode={resizeMode}
      style={styles.posterLayer}
      imageStyle={{ opacity }}
    />
  );
}


function MBWPanchTatvaLayer({
  meta,
  reducedMotion,
}) {
  const visible =
    meta?.panchTatvaTapBlocking === false
    && Boolean(
      meta?.fireLayer
      || meta?.waterLayer
      || meta?.airLayer
      || meta?.earthLayer
      || meta?.spaceLayer
    );

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pulse.stopAnimation();

    if (!visible || reducedMotion) {
      pulse.setValue(0);
      return undefined;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [pulse, reducedMotion, visible]);

  if (!visible) {
    return null;
  }

  const baseOpacity = resolvePanchOpacity(
    meta?.panchTatvaOpacity
  );

  const translateX = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 5],
  });

  const translateY = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -4],
  });

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.03],
  });

  const elementStyle = {
    opacity: baseOpacity,
    transform: [
      { translateX },
      { translateY },
      { scale },
    ],
  };

  return (
    <View pointerEvents="none" style={styles.panchRoot}>
      {meta?.fireLayer ? (
        <Animated.View
          style={[
            styles.elementLayer,
            styles.fireLayer,
            elementStyle,
          ]}
        />
      ) : null}

      {meta?.waterLayer ? (
        <Animated.View
          style={[
            styles.elementLayer,
            styles.waterLayer,
            elementStyle,
          ]}
        />
      ) : null}

      {meta?.airLayer ? (
        <Animated.View
          style={[
            styles.elementLayer,
            styles.airLayer,
            elementStyle,
          ]}
        />
      ) : null}

      {meta?.earthLayer ? (
        <Animated.View
          style={[
            styles.elementLayer,
            styles.earthLayer,
            elementStyle,
          ]}
        />
      ) : null}

      {meta?.spaceLayer ? (
        <Animated.View
          style={[
            styles.elementLayer,
            styles.spaceLayer,
            elementStyle,
          ]}
        />
      ) : null}
    </View>
  );
}


function MBWPentagramLayer({
  meta,
  reducedMotion,
  wordEatingActive,
}) {
  const rotation = useRef(new Animated.Value(0)).current;
  const [colorCycle, setColorCycle] = useState(0);

  useEffect(() => {
    rotation.stopAnimation();

    if (
      meta?.pentagramVisible === false
      || reducedMotion
    ) {
      rotation.setValue(0);
      return undefined;
    }

    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 16000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [
    meta?.pentagramVisible,
    reducedMotion,
    rotation,
  ]);

  useEffect(() => {
    if (reducedMotion) {
      setColorCycle(0);
      return undefined;
    }

    const timer = setInterval(
      () => setColorCycle((value) => value + 1),
      2400
    );

    return () => clearInterval(timer);
  }, [reducedMotion]);

  if (meta?.pentagramVisible === false) {
    return null;
  }

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const eatingWords =
    meta?.pentagramEatingWords !== false
    && wordEatingActive;

  const color = resolveStarColors(
    meta?.pentagramColorLaw,
    colorCycle
  );

  return (
    <View
      pointerEvents="none"
      style={styles.starRoot}
    >
      <Animated.Text
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.starText,
          {
            color,
            opacity: eatingWords ? 0.96 : 0.78,
            transform: [
              { rotate },
              { scale: eatingWords ? 1.24 : 1 },
            ],
          },
        ]}
      >
        ★
      </Animated.Text>
    </View>
  );
}


function MBWHeadlineLayer({
  meta,
  reducedMotion,
  onPhaseChange,
}) {
  const [phase, setPhase] = useState('HEADLINE');

  useEffect(() => {
    if (meta?.showHeadline === false) {
      onPhaseChange?.('HIDDEN');
      return undefined;
    }

    let timer = null;
    let cancelled = false;

    const headlineDuration = Math.max(
      1000,
      Number(meta?.headlineDuration || 5000)
    );

    const iconDuration = reducedMotion ? 900 : 1800;

    const runHeadline = () => {
      if (cancelled) {
        return;
      }

      setPhase('HEADLINE');
      onPhaseChange?.('HEADLINE');

      timer = setTimeout(() => {
        if (cancelled) {
          return;
        }

        setPhase('ICON_NAME');
        onPhaseChange?.('ICON_NAME');

        timer = setTimeout(
          runHeadline,
          iconDuration
        );
      }, reducedMotion ? 1200 : headlineDuration);
    };

    runHeadline();

    return () => {
      cancelled = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    meta?.headlineDuration,
    meta?.routeName,
    meta?.showHeadline,
    onPhaseChange,
    reducedMotion,
  ]);

  if (meta?.showHeadline === false) {
    return null;
  }

  const headline =
    meta?.headlineText
    || meta?.headline
    || meta?.routePublicName
    || '';

  const iconName =
    meta?.iconName
    || meta?.routePublicName
    || '';

  const visibleText =
    phase === 'ICON_NAME'
      ? iconName
      : headline;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.headlineRoot,
        resolveHeadlineZone(meta?.headlineSafeZone),
      ]}
    >
      <Text
        numberOfLines={2}
        style={[
          styles.headlineText,
          phase === 'ICON_NAME'
            ? styles.iconNameText
            : null,
        ]}
      >
        {visibleText}
      </Text>
    </View>
  );
}


function MBWIconRailLayer({
  meta,
  navigationRef,
  accessAllowed,
}) {
  const logic = getMBWLogicPresentation(
    meta,
    meta?.originalActiveRoute || meta?.routeName
  );

  const actionTarget =
    getMBWActionTarget(meta, 'primary')
    || logic?.primaryActionTarget
    || 'MainHub';

  const mbwLiveUserSeed = readMBWLiveUserSeed();
  recordMBWUserRoute(meta?.routeName || mbwLiveUserSeed.currentRoute);

  const isMainHub =
    meta?.routeName === 'MainHub';

  const sectionTargets = isMainHub
    ? getMBWMainHubSectionTargets()
    : [];

  if (
    meta?.showIcon === false
    || accessAllowed === false
  ) {
    return null;
  }

  const navigateTo = (target) => {
    const targetRoute =
      target?.routeName
      || target?.route
      || actionTarget;

    const ready =
      navigationRef
      && typeof navigationRef.isReady === 'function'
      && navigationRef.isReady();

    if (
      ready
      && targetRoute
      && typeof navigationRef.navigate === 'function'
    ) {
      if (isMBWAllowedNavigationRoute(targetRoute)) {
        navigationRef.navigate(targetRoute);
      }
    }
  };

  const railTargets = isMainHub
    ? sectionTargets
    : [{
        routeName: actionTarget,
        iconEmoji:
          meta?.iconEmoji
          || meta?.icon
          || '♠️',
        iconName:
          meta?.iconName
          || meta?.routePublicName
          || actionTarget,
      }];

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={[
        styles.iconRail,
        resolveIconPosition(
          meta?.iconPosition,
          isMainHub
        ),
      ]}
    >
      <View
        pointerEvents="box-none"
        style={
          isMainHub
            ? styles.mainHubIconWrap
            : styles.singleIconWrap
        }
      >
        {railTargets.map((target, index) => (
          <Pressable
            key={
              String(
                target.routeName
                || target.route
                || actionTarget
              )
              + '-'
              + String(index)
            }
            accessibilityRole="button"
            accessibilityLabel={
              'MBW '
              + String(
                target.iconName
                || target.routeName
                || 'section'
              )
              + ' action'
            }
            onPress={() => navigateTo(target)}
            style={({ pressed }) => [
              styles.iconButton,
              isMainHub
                ? styles.mainHubIconButton
                : null,
              pressed
                ? styles.iconButtonPressed
                : null,
            ]}
          >
            <Text style={styles.iconText}>
              {target.iconEmoji
                || target.icon
                || '♠️'}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}


function MBWResultPresentationLayer({
  logic,
}) {
  const result =
    logic?.resultPresentation
    || {};

  const state = String(
    result?.errorState
    || result?.lockedState
    || result?.successState
    || result?.resultState
    || ''
  ).toUpperCase();

  const stateOpacity =
    state.includes('ERROR')
      ? 0.025
      : state.includes('LOCKED')
        ? 0.02
        : state
          ? 0.015
          : 0;

  if (!state) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.resultStateAura,
        { opacity: stateOpacity },
      ]}
    />
  );
}


function MBWAccessStateBridge({
  logic,
  activeRoute,
}) {
  const accessState =
    logic?.accessGateState
    || {};

  const accessReady = Boolean(
    activeRoute
    && (
      accessState?.firstRunState
      || accessState?.returnUserState
      || accessState?.subscriptionState
      || accessState?.gateOpenState
      || accessState?.gateLockedState
    )
  );

  return {
    accessReady,
    layer: (
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.accessStateBridge,
          {
            opacity: accessReady
              ? 0.001
              : 0,
          },
        ]}
      />
    ),
  };
}


function MBWSafeActionBridge({
  meta,
  activeRoute,
  logic,
}) {
  const posterBindingReady =
    isMBWPosterBindingReady(meta);

  const logicReady =
    isMBWLogicPresentationReady(
      meta,
      activeRoute
    );

  const resultInternalReady =
    isMBWResultInternalRouteReady(
      activeRoute
    );

  const generatedInternalReady =
    isMBWGeneratedInternalInheritanceReady();

  const authorityChainReady =
    isMBWAuthorityChainReady();

  const safe = Boolean(
    meta?.tapPassThrough
    && meta?.noCoverageOfMainAction
    && logicReady
    && logic?.logicalPresentationReady
    && posterBindingReady
    && resultInternalReady
    && generatedInternalReady
    && authorityChainReady
  );

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.safeActionBridge,
        { opacity: safe ? 0.001 : 0 },
      ]}
    />
  );
}


export default function MBWGlobalVisualLogicDriver({
  activeRoute = 'MainHub',
  navigationRef,
}) {
  const inheritedRoute =
    getMBWInheritedVisualParent(activeRoute);

  const meta = useMemo(() => {
    const routeMeta =
      getMBWVisualLogicDriverRoute(
        inheritedRoute
      );

    return {
      ...routeMeta,
      originalActiveRoute: activeRoute,
    };
  }, [activeRoute, inheritedRoute]);

  const logic = useMemo(
    () => getMBWLogicPresentation(
      meta,
      activeRoute
    ),
    [activeRoute, meta]
  );

  const reducedMotion = useMBWReducedMotion(
    meta?.reducedMotionSupport
  );

  const transition = useRef(
    new Animated.Value(1)
  ).current;

  const [headlinePhase, setHeadlinePhase] =
    useState('HEADLINE');

  const onHeadlinePhaseChange = useCallback(
    (phase) => setHeadlinePhase(phase),
    []
  );

  useEffect(() => {
    transition.stopAnimation();

    const duration = resolveTransitionDuration(
      meta?.routeTransitionMode,
      reducedMotion
    );

    if (duration === 0) {
      transition.setValue(1);
      return undefined;
    }

    transition.setValue(0);

    const animation = Animated.timing(
      transition,
      {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }
    );

    animation.start();

    return () => animation.stop();
  }, [
    activeRoute,
    meta?.routeTransitionMode,
    reducedMotion,
    transition,
  ]);

  const translateY = transition.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  const accessBridge = MBWAccessStateBridge({
    logic,
    activeRoute,
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.root,
        {
          opacity: transition,
          transform: [{ translateY }],
        },
      ]}
    >
      <MBWPosterLayer
        meta={meta}
        activeRoute={activeRoute}
      />

      <MBWPanchTatvaLayer
        meta={meta}
        reducedMotion={reducedMotion}
      />
      {/* MBW_LOCAL_LIVING_STAR_SOLE_OWNER */}
<MBWHeadlineLayer
        meta={meta}
        reducedMotion={reducedMotion}
        onPhaseChange={onHeadlinePhaseChange}
      />

      <MBWIconRailLayer
        meta={meta}
        navigationRef={navigationRef}
        accessAllowed={accessBridge.accessReady}
      />

      <MBWResultPresentationLayer
        logic={logic}
      />

      {accessBridge.layer}

      <MBWSafeActionBridge
        meta={meta}
        activeRoute={activeRoute}
        logic={logic}
      />
    </Animated.View>
  );
}


export const MBW_GLOBAL_VISUAL_LOGIC_DRIVER_CONTRACT = {
  posterLayer: true,
  cinematicPosterBypass: true,
  posterFallbackForbidden: true,
  panchTatvaLayer: true,
  panchTatvaMotion: true,
  panchTatvaOpacityConsumed: true,
  pentagramLayer: true,
  pentagramEatingWordsConsumed: true,
  pentagramColorLawConsumed: true,
  headlineLayer: true,
  headlineIconHeadlineCycle: true,
  headlineSafeZoneConsumed: true,
  iconRailLayer: true,
  iconPositionConsumed: true,
  mainHubExactPublicRail: true,
  safeAreaConsumed: true,
  reducedMotionConsumed: true,
  routeTransitionModeConsumed: true,
  posterOpacityLawConsumed: true,
  posterSafeCropModeConsumed: true,
  resultPresentationConsumed: true,
  accessGateStateConsumed: true,
  originalInternalRoutePreserved: true,
  safeActionBridge: true,
  buildExecuted: false,
};


const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  },

  posterLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  panchRoot: {
    ...StyleSheet.absoluteFillObject,
  },

  elementLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },

  fireLayer: {
    backgroundColor: '#6D2716',
  },

  waterLayer: {
    backgroundColor: '#16395A',
  },

  airLayer: {
    backgroundColor: '#B7C0C7',
  },

  earthLayer: {
    backgroundColor: '#4A3728',
  },

  spaceLayer: {
    backgroundColor: '#241932',
  },

  starRoot: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  starText: {
    fontSize: 92,
    fontWeight: '300',
  },

  headlineRoot: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignItems: 'center',
  },

  headlineTop: {
    top: 54,
  },

  headlineCenter: {
    top: '43%',
  },

  headlineBottom: {
    bottom: 116,
  },

  headlineText: {
    color: '#D6AA46',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.88)',
    textShadowRadius: 8,
  },

  iconNameText: {
    color: '#8F203D',
    fontSize: 14,
  },

  iconRail: {
    position: 'absolute',
  },

  iconRailRight: {
    right: 18,
    bottom: 20,
  },

  iconRailLeft: {
    left: 18,
    bottom: 20,
  },

  iconRailCenter: {
    left: 18,
    right: 18,
    bottom: 20,
    alignItems: 'center',
  },

  iconRailTop: {
    right: 18,
    top: 20,
  },

  mainHubIconRail: {
    left: 12,
    right: 12,
    bottom: 12,
  },

  mainHubIconWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  singleIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(214, 170, 70, 0.62)',
    backgroundColor: 'rgba(8, 3, 7, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainHubIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
  },

  iconButtonPressed: {
    opacity: 0.62,
    transform: [{ scale: 0.95 }],
  },

  iconText: {
    fontSize: 19,
  },

  resultStateAura: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D6AA46',
  },

  accessStateBridge: {
    position: 'absolute',
    width: 1,
    height: 1,
    left: 0,
    top: 0,
  },

  safeActionBridge: {
    position: 'absolute',
    width: 1,
    height: 1,
    right: 0,
    bottom: 0,
  },
});
