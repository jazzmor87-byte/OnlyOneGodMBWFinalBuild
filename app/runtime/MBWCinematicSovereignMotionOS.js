import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  AppState,
  Dimensions,
  Easing,
  PixelRatio,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const INTRO_TOTAL_MS = 11000;
export const INTRO_SWITCH_MS = 5000;
export const ROUTE_ENTER_MS = 760;
export const HEADLINE_HOLD_MS = 4240;
export const WORD_EATING_MS = 520;
export const ICON_NAME_MS = 2300;
export const RETURN_MS = 380;
export const CYCLE_REST_MS = 900;

const BLACK = '#050505';
const GOLD = '#D4AF37';
const MAROON = '#5A0B1B';
const PALE_GOLD = '#F4D77A';

const ROUTE_ORDER = Object.freeze([
  'CinematicIntro',
  'GateLocked',
  'GateOpen',
  'PathSelection',
  'Subscription',
  'Signup',
  'MainHub',
  'MasterOfLife',
  'Matchmaking',
  'MasterOfGames',
  'MasterOfCoins',
  'TravelLocal',
  'TravelOverseas',
  'Merchandise',
  'Kamashastra',
  'LiveLounge',
  'MensLounge',
  'Nearby',
  'AIPoster',
  'Settings',
  'CommerceReceipt',
  'MatchChat',
  'SeedProfile',
  'TravelBooking',
]);

export const ROUTE_CONTRAST_ROTATION = Object.freeze([
  Object.freeze({
    background: BLACK,
    primary: GOLD,
    secondary: MAROON,
  }),
  Object.freeze({
    background: MAROON,
    primary: GOLD,
    secondary: BLACK,
  }),
  Object.freeze({
    background: BLACK,
    primary: MAROON,
    secondary: GOLD,
  }),
]);

const ROUTE_CINEMA = Object.freeze({
  CinematicIntro: {
    headline: 'WELCOME TO',
    icon: '',
    name: 'MBW',
    zone: 'INTRO_CENTER',
    mode: 'INTRO_ONLY',
    emotion: 'ARRIVAL',
  },
  GateLocked: {
    headline: 'ONLYONEGOD',
    icon: '🔒',
    name: 'ENTER',
    zone: 'GATE_CENTER',
    emotion: 'LOCKED_GRAVITY',
  },
  GateOpen: {
    headline: 'THE GATE IS OPEN',
    icon: '★',
    name: 'MBW',
    zone: 'GATE_CENTER',
    emotion: 'RELEASE',
  },
  PathSelection: {
    headline: 'TWO PATHS · ONE EMPIRE',
    icon: '♠️',
    name: 'CHOOSE',
    zone: 'GATE_CENTER',
    emotion: 'SOVEREIGN_CHOICE',
  },
  Subscription: {
    headline: 'ASCEND',
    icon: '👑',
    name: 'SUBSCRIPTION',
    zone: 'POSTER_TOP',
    emotion: 'ASCENSION',
  },
  Signup: {
    headline: 'ENTER THE EMPIRE',
    icon: '✦',
    name: 'SIGNUP',
    zone: 'POSTER_TOP',
    emotion: 'IDENTITY',
  },
  MainHub: {
    headline: 'MEN BEHIND WALL',
    icon: '👑',
    name: 'EMPIRE',
    zone: 'POSTER_TOP',
    emotion: 'SOVEREIGNTY',
  },
  MasterOfLife: {
    headline: 'MASTER OF LIFE',
    icon: '♠️',
    name: 'LIFE',
    zone: 'POSTER_TOP',
    emotion: 'COMMAND',
  },
  Matchmaking: {
    headline: 'MATCHMAKING',
    icon: '💘',
    name: 'MATCH',
    zone: 'POSTER_TOP',
    emotion: 'DESIRE',
  },
  Games: {
    headline: 'MASTER OF GAMES',
    icon: '🎲',
    name: 'GAMES',
    zone: 'POSTER_TOP',
    emotion: 'PLAY',
  },
  MasterOfGames: {
    headline: 'MASTER OF GAMES',
    icon: '🎲',
    name: 'GAMES',
    zone: 'POSTER_TOP',
    emotion: 'PLAY',
  },
  MasterOfCoins: {
    headline: 'MASTER OF COINS',
    icon: '🪙',
    name: 'COINS',
    zone: 'POSTER_TOP',
    emotion: 'POWER',
  },
  TravelLocal: {
    headline: 'TRAVEL LOCAL',
    icon: '🧭',
    name: 'LOCAL',
    zone: 'POSTER_TOP',
    emotion: 'JOURNEY',
  },
  TravelOverseas: {
    headline: 'TRAVEL OVERSEAS',
    icon: '✈️',
    name: 'OVERSEAS',
    zone: 'POSTER_TOP',
    emotion: 'EXPANSION',
  },
  Merchandise: {
    headline: 'MERCHANDISE',
    icon: '💎',
    name: 'MERCH',
    zone: 'POSTER_TOP',
    emotion: 'POSSESSION',
  },
  Kamashastra: {
    headline: 'KAMASHASTRA',
    icon: '🔥',
    name: 'ART',
    zone: 'POSTER_TOP',
    emotion: 'HEAT',
  },
  LiveLounge: {
    headline: 'LIVE LOUNGE',
    icon: '🎙️',
    name: 'LIVE',
    zone: 'POSTER_TOP',
    emotion: 'PRESENCE',
  },
  MensLounge: {
    headline: "MEN'S LOUNGE",
    icon: '♠️',
    name: 'LOUNGE',
    zone: 'POSTER_TOP',
    emotion: 'BROTHERHOOD',
  },
  Nearby: {
    headline: 'NEARBY',
    icon: '📍',
    name: 'NEARBY',
    zone: 'POSTER_TOP',
    emotion: 'PROXIMITY',
  },
  AIPoster: {
    headline: 'AI POSTER',
    icon: '📸',
    name: 'POSTER',
    zone: 'POSTER_TOP',
    emotion: 'CREATION',
  },
  Settings: {
    headline: 'SETTINGS',
    icon: '⚙️',
    name: 'SETTINGS',
    zone: 'POSTER_TOP',
    emotion: 'CONTROL',
  },
  CommerceReceipt: {
    headline: 'ORDER SEALED',
    icon: '🧾',
    name: 'RECEIPT',
    zone: 'POSTER_TOP',
    emotion: 'COMPLETION',
  },
  MatchChat: {
    headline: 'MATCH CONNECTED',
    icon: '💬',
    name: 'CHAT',
    zone: 'POSTER_TOP',
    emotion: 'CONNECTION',
  },
  SeedProfile: {
    headline: 'USER SEED',
    icon: '♦️',
    name: 'PROFILE',
    zone: 'POSTER_TOP',
    emotion: 'IDENTITY',
  },
  TravelBooking: {
    headline: 'JOURNEY LOCKED',
    icon: '🧭',
    name: 'BOOKING',
    zone: 'POSTER_TOP',
    emotion: 'COMMITMENT',
  },
});

function resolvePerformanceTier() {
  const { width, height } = Dimensions.get('window');
  const density = PixelRatio.get();
  const physicalPixels = width * height * density * density;

  if (physicalPixels >= 2400000) return 'HIGH';
  if (physicalPixels >= 1100000) return 'MEDIUM';
  return 'LOW';
}

export const CINEMATIC_PERFORMANCE_TIER = resolvePerformanceTier();

export function useMBWCinematicAccessibility() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [appActive, setAppActive] = useState(
    AppState.currentState === 'active',
  );

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReducedMotion(Boolean(value));
      })
      .catch(() => {});

    const motionSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (value) => setReducedMotion(Boolean(value)),
    );

    const appSubscription = AppState.addEventListener(
      'change',
      (nextState) => setAppActive(nextState === 'active'),
    );

    return () => {
      mounted = false;
      motionSubscription?.remove?.();
      appSubscription?.remove?.();
    };
  }, []);

  return {
    reducedMotion,
    appActive,
    performanceTier: CINEMATIC_PERFORMANCE_TIER,
  };
}

function fallbackMeta(routeName) {
  const normalized = String(routeName || '')
    .replace(/Screen$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .toUpperCase();

  return {
    headline: normalized || 'MEN BEHIND WALL',
    icon: '★',
    name: normalized || 'MBW',
    zone: 'POSTER_TOP',
    emotion: 'SOVEREIGN',
  };
}

function routeMeta(routeName) {
  return ROUTE_CINEMA[routeName] || fallbackMeta(routeName);
}

function routePalette(routeName) {
  const index = ROUTE_ORDER.indexOf(routeName);
  const resolvedIndex = index >= 0 ? index : ROUTE_ORDER.length;
  return ROUTE_CONTRAST_ROTATION[
    resolvedIndex % ROUTE_CONTRAST_ROTATION.length
  ];
}

function zoneStyle(zone) {
  if (zone === 'INTRO_CENTER') return styles.introCenter;
  if (zone === 'GATE_CENTER') return styles.gateCenter;
  return styles.posterTop;
}


export function MBWCinematicProductionStage({
  routeName,
  children,
}) {
  const {
    reducedMotion,
    appActive,
  } = useMBWCinematicAccessibility();

  const stageOpacity = useRef(new Animated.Value(1)).current;
  const stageScale = useRef(new Animated.Value(1)).current;
  const stageTranslateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    stageOpacity.stopAnimation();
    stageScale.stopAnimation();
    stageTranslateX.stopAnimation();

    if (
      reducedMotion ||
      !appActive ||
      routeName === 'CinematicIntro'
    ) {
      stageOpacity.setValue(1);
      stageScale.setValue(1);
      stageTranslateX.setValue(0);
      return undefined;
    }

    const routeIndex = Math.max(
      0,
      ROUTE_ORDER.indexOf(routeName),
    );
    const direction = routeIndex % 2 === 0 ? 1 : -1;

    stageOpacity.setValue(0.74);
    stageScale.setValue(1.018);
    stageTranslateX.setValue(8 * direction);

    const entrance = Animated.parallel([
      Animated.timing(stageOpacity, {
        toValue: 1,
        duration: 560,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(stageScale, {
        toValue: 1,
        damping: 18,
        stiffness: 125,
        mass: 0.75,
        useNativeDriver: true,
      }),
      Animated.spring(stageTranslateX, {
        toValue: 0,
        damping: 18,
        stiffness: 130,
        mass: 0.72,
        useNativeDriver: true,
      }),
    ]);

    entrance.start();
    return () => entrance.stop();
  }, [
    appActive,
    reducedMotion,
    routeName,
    stageOpacity,
    stageScale,
    stageTranslateX,
  ]);

  return (
    <Animated.View
      style={[
        styles.productionStage,
        {
          opacity: stageOpacity,
          transform: [
            { translateX: stageTranslateX },
            { scale: stageScale },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function MBWCinematicSovereignMotionOS({ routeName }) {
  const meta = useMemo(() => routeMeta(routeName), [routeName]);
  const palette = useMemo(() => routePalette(routeName), [routeName]);
  const {
    reducedMotion,
    appActive,
    performanceTier,
  } = useMBWCinematicAccessibility();

  const introOnly = meta.mode === 'INTRO_ONLY';
  const [introWord, setIntroWord] = useState(meta.headline);

  const routeVeilOpacity = useRef(new Animated.Value(0.72)).current;
  const routeDepthScale = useRef(new Animated.Value(1.035)).current;
  const headlineOpacity = useRef(new Animated.Value(1)).current;
  const headlineScaleX = useRef(new Animated.Value(1)).current;
  const starScale = useRef(new Animated.Value(0.74)).current;
  const starRotation = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const auraOpacity = useRef(new Animated.Value(0.18)).current;
  const orbitRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const values = [
      routeVeilOpacity,
      routeDepthScale,
      headlineOpacity,
      headlineScaleX,
      starScale,
      starRotation,
      iconOpacity,
      auraOpacity,
      orbitRotation,
    ];

    values.forEach((value) => value.stopAnimation());
    setIntroWord(meta.headline);

    routeVeilOpacity.setValue(introOnly ? 0.42 : 0.72);
    routeDepthScale.setValue(introOnly ? 1 : 1.035);
    headlineOpacity.setValue(1);
    headlineScaleX.setValue(1);
    starScale.setValue(0.74);
    starRotation.setValue(0);
    iconOpacity.setValue(0);
    auraOpacity.setValue(introOnly ? 0 : 0.18);
    orbitRotation.setValue(0);

    if (!appActive) return undefined;

    if (introOnly) {
      if (reducedMotion) {
        routeVeilOpacity.setValue(0);

        const reducedSwitchTimer = setTimeout(() => {
          setIntroWord(meta.name);
        }, INTRO_SWITCH_MS);

        return () => clearTimeout(reducedSwitchTimer);
      }

      const introEntrance = Animated.timing(routeVeilOpacity, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      introEntrance.start();

      const switchTimer = setTimeout(() => {
        setIntroWord(meta.name);
      }, INTRO_SWITCH_MS);

      return () => {
        introEntrance.stop();
        clearTimeout(switchTimer);
      };
    }

    if (reducedMotion) {
      routeVeilOpacity.setValue(0);
      routeDepthScale.setValue(1);
      starScale.setValue(1);
      iconOpacity.setValue(1);
      auraOpacity.setValue(0.22);
      return undefined;
    }

    const routeEntrance = Animated.parallel([
      Animated.timing(routeVeilOpacity, {
        toValue: 0,
        duration: ROUTE_ENTER_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(routeDepthScale, {
        toValue: 1,
        damping: 17,
        stiffness: 120,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(auraOpacity, {
        toValue: performanceTier === 'LOW' ? 0.2 : 0.38,
        duration: ROUTE_ENTER_MS,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const orbit =
      performanceTier === 'HIGH'
        ? Animated.loop(
            Animated.timing(orbitRotation, {
              toValue: 1,
              duration: 14000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          )
        : null;

    const headlineCycle = Animated.loop(
      Animated.sequence([
        routeEntrance,
        Animated.delay(HEADLINE_HOLD_MS),
        Animated.parallel([
          Animated.timing(headlineScaleX, {
            toValue: 0.035,
            duration: WORD_EATING_MS,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(headlineOpacity, {
            toValue: 0,
            duration: WORD_EATING_MS,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(starScale, {
            toValue: 1.14,
            damping: 11,
            stiffness: 135,
            mass: 0.72,
            useNativeDriver: true,
          }),
          Animated.timing(starRotation, {
            toValue: 0.19,
            duration: WORD_EATING_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(ICON_NAME_MS),
        Animated.parallel([
          Animated.timing(iconOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(starScale, {
            toValue: 0.74,
            duration: 420,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(auraOpacity, {
            toValue: 0.18,
            duration: 420,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(headlineScaleX, {
            toValue: 1,
            duration: RETURN_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(headlineOpacity, {
            toValue: 1,
            duration: RETURN_MS,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(CYCLE_REST_MS),
      ]),
    );

    orbit?.start();
    headlineCycle.start();

    return () => {
      orbit?.stop();
      headlineCycle.stop();
    };
  }, [
    appActive,
    auraOpacity,
    headlineOpacity,
    headlineScaleX,
    iconOpacity,
    introOnly,
    meta.headline,
    meta.name,
    orbitRotation,
    performanceTier,
    reducedMotion,
    routeDepthScale,
    routeName,
    routeVeilOpacity,
    starRotation,
    starScale,
  ]);

  const starRotate = starRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const orbitRotate = orbitRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.productionCinema,
        zoneStyle(meta.zone),
        {
          transform: [{ scale: routeDepthScale }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.routeVeil,
          {
            backgroundColor: palette.background,
            opacity: routeVeilOpacity,
          },
        ]}
      />

      {!introOnly && performanceTier !== 'LOW' ? (
        <Animated.View
          style={[
            styles.orbit,
            {
              borderColor: palette.secondary,
              opacity: auraOpacity,
              transform: [{ rotate: orbitRotate }],
            },
          ]}
        />
      ) : null}

      {!introOnly ? (
        <Animated.View
          style={[
            styles.aura,
            {
              borderColor: palette.secondary,
              opacity: auraOpacity,
              transform: [{ scale: starScale }],
            },
          ]}
        />
      ) : null}

      <Animated.Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.62}
        style={[
          styles.headline,
          {
            color: palette.primary,
            opacity: headlineOpacity,
            transform: [{ scaleX: headlineScaleX }],
          },
        ]}
      >
        {introOnly ? introWord : meta.headline}
      </Animated.Text>

      {!introOnly ? (
        <>
          <Animated.Text
            style={[
              styles.star,
              {
                color: palette.primary,
                transform: [
                  { scale: starScale },
                  { rotate: starRotate },
                ],
              },
            ]}
          >
            ★
          </Animated.Text>

          <Animated.View
            style={[
              styles.iconNamePhase,
              {
                opacity: iconOpacity,
                transform: [{ scale: starScale }],
              },
            ]}
          >
            <Text style={styles.icon}>{meta.icon}</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.iconName,
                { color: palette.primary },
              ]}
            >
              {meta.name}
            </Text>
          </Animated.View>
        </>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  productionStage: {
    flex: 1,
  },
  productionCinema: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 118,
    zIndex: 9998,
    elevation: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  introCenter: {
    top: '42%',
  },
  gateCenter: {
    top: '27%',
  },
  posterTop: {
    top: 18,
  },
  routeVeil: {
    position: 'absolute',
    top: -18,
    right: -16,
    bottom: -18,
    left: -16,
    borderRadius: 28,
  },
  orbit: {
    position: 'absolute',
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 1,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  aura: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    backgroundColor: 'rgba(212,175,55,0.035)',
  },
  headline: {
    position: 'absolute',
    left: 8,
    right: 8,
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 2.4,
    textShadowColor: BLACK,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 3 },
  },
  star: {
    fontSize: 54,
    lineHeight: 62,
    textAlign: 'center',
    textShadowColor: MAROON,
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  iconNamePhase: {
    position: 'absolute',
    top: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 28,
    lineHeight: 34,
  },
  iconName: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: BLACK,
    textShadowRadius: 7,
  },
});
