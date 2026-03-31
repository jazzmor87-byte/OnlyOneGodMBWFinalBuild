import { Animated, Easing } from "react-native";

export const FLOATING_PRESETS = {
  topPanel: { inMs: 4200, outMs: 3800, travel: 3, minOpacity: 0.94, maxOpacity: 1 },
  contentPanel: { inMs: 4700, outMs: 4300, travel: 4, minOpacity: 0.95, maxOpacity: 1 },
  button: { inMs: 3600, outMs: 3400, travel: 3, minOpacity: 0.95, maxOpacity: 1 },
  words: { inMs: 5200, outMs: 5000, travel: 1, minOpacity: 0.92, maxOpacity: 1 }
};

export function startSoftLoop(value, preset = FLOATING_PRESETS.contentPanel) {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: preset.inMs,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: preset.outMs,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true
      })
    ])
  );
}

export function floatY(value, travel = 4) {
  return value.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -Math.abs(travel)]
  });
}

export function pulseOpacity(value, minOpacity = 0.94, maxOpacity = 1) {
  return value.interpolate({
    inputRange: [0, 1],
    outputRange: [minOpacity, maxOpacity]
  });
}

export function buildFloatingStyle(value, preset = FLOATING_PRESETS.contentPanel) {
  return {
    transform: [{ translateY: floatY(value, preset.travel) }],
    opacity: pulseOpacity(value, preset.minOpacity, preset.maxOpacity)
  };
}

export function buildTextStyle(value, preset = FLOATING_PRESETS.words) {
  return {
    transform: [{ translateY: floatY(value, preset.travel) }],
    opacity: pulseOpacity(value, preset.minOpacity, preset.maxOpacity)
  };
}

export function buildButtonStyle(value, preset = FLOATING_PRESETS.button) {
  return {
    transform: [{ translateY: floatY(value, preset.travel) }],
    opacity: pulseOpacity(value, preset.minOpacity, preset.maxOpacity)
  };
}
