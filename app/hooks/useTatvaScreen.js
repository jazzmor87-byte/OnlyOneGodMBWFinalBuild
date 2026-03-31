import { useEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";
import { assignTatva } from "../storage/tatvaFlowSystem";
import { getTatvaVisual } from "../theme/mbwTatvaVisualSystem";
import {
  FLOATING_PRESETS,
  startSoftLoop,
  buildFloatingStyle,
  buildTextStyle,
  buildButtonStyle
} from "../theme/mbwFloatingSystem";

export default function useTatvaScreen(screenKey) {
  const tatva = useMemo(() => assignTatva(screenKey), [screenKey]);
  const visual = useMemo(() => getTatvaVisual(tatva), [tatva]);

  const panelValue = useRef(new Animated.Value(0)).current;
  const textValue = useRef(new Animated.Value(0)).current;
  const buttonValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = [
      startSoftLoop(panelValue, FLOATING_PRESETS.contentPanel),
      startSoftLoop(textValue, FLOATING_PRESETS.words),
      startSoftLoop(buttonValue, FLOATING_PRESETS.button)
    ];
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop && loop.stop());
  }, [panelValue, textValue, buttonValue]);

  return {
    tatva,
    visual,
    panelFloatStyle: buildFloatingStyle(panelValue, FLOATING_PRESETS.contentPanel),
    textFloatStyle: buildTextStyle(textValue, FLOATING_PRESETS.words),
    buttonFloatStyle: buildButtonStyle(buttonValue, FLOATING_PRESETS.button)
  };
}
