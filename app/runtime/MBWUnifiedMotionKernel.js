import { Animated, Easing } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';

export function useMBWUnifiedMotion() {
  const value = useRef(new Animated.Value(0)).current;
  const [wordPhase, setWordPhase] = useState('HEADLINE');

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    const timer = setInterval(() => {
      setWordPhase((phase) => (
        phase === 'HEADLINE' ? 'EATING' :
        phase === 'EATING' ? 'ICON_NAME' :
        'HEADLINE'
      ));
    }, 5000);

    return () => {
      clearInterval(timer);
      loop.stop();
    };
  }, [value]);

  return useMemo(() => ({
    starTranslateY: value.interpolate({
      inputRange: [0, 1],
      outputRange: [-18, 18],
    }),
    iconTranslateY: value.interpolate({
      inputRange: [0, 1],
      outputRange: [8, -8],
    }),
    iconRotate: value.interpolate({
      inputRange: [0, 1],
      outputRange: ['-4deg', '4deg'],
    }),
    eatingScale: value.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.06],
    }),
    eatingOpacity: value.interpolate({
      inputRange: [0, 0.82, 1],
      outputRange: [1, 1, 0],
    }),
    wordPhase,
  }), [value, wordPhase]);
}

export default useMBWUnifiedMotion;
