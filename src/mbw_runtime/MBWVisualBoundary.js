import { assertVisualBodyInheritance } from "../../core/visual/VisualBodyInheritanceCore";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");
const sealSize = Math.min(width, height) * 0.42;

function PanchTatvaField() {
  const fire = useRef(new Animated.Value(0)).current;
  const water = useRef(new Animated.Value(0)).current;
  const air = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loops = [
      Animated.loop(Animated.sequence([
        Animated.timing(fire, { toValue: 1, duration: 7000, useNativeDriver: true }),
        Animated.timing(fire, { toValue: 0, duration: 7000, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(water, { toValue: 1, duration: 9000, useNativeDriver: true }),
        Animated.timing(water, { toValue: 0, duration: 9000, useNativeDriver: true }),
      ])),
      Animated.loop(Animated.sequence([
        Animated.timing(air, { toValue: 1, duration: 11000, useNativeDriver: true }),
        Animated.timing(air, { toValue: 0, duration: 11000, useNativeDriver: true }),
      ])),
    ];
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [fire, water, air]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.tatva, styles.fire, { opacity: fire.interpolate({ inputRange: [0, 1], outputRange: [0.03, 0.075] }) }]} />
      <Animated.View style={[styles.tatva, styles.water, { opacity: water.interpolate({ inputRange: [0, 1], outputRange: [0.025, 0.06] }) }]} />
      <Animated.View style={[styles.tatva, styles.air, { opacity: air.interpolate({ inputRange: [0, 1], outputRange: [0.02, 0.055] }) }]} />
    </View>
  );
}

function PentagramMotionSeal() {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 18000, useNativeDriver: true }));
    const pulseLoop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 3200, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 3200, useNativeDriver: true }),
    ]));
    spinLoop.start();
    pulseLoop.start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spin, pulse]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.08] });

  return (
    <Animated.View pointerEvents="none" style={[styles.starSeal, { transform: [{ rotate }, { scale }] }]}>
      <View style={styles.starRing} />
      <View style={[styles.starRay, styles.rayOne]} />
      <View style={[styles.starRay, styles.rayTwo]} />
      <View style={[styles.starRay, styles.rayThree]} />
      <View style={[styles.starRay, styles.rayFour]} />
      <View style={[styles.starRay, styles.rayFive]} />
    </Animated.View>
  );
}

export default function MBWVisualBoundary({ children }) {
  assertVisualBodyInheritance({ screenName: "MBWVisualBoundary" });
  return (
    <View style={styles.root}>
      <PanchTatvaField />
      <PentagramMotionSeal />
      <View pointerEvents="box-none" style={styles.posterSafeZone}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050303", overflow: "hidden" },
  posterSafeZone: { flex: 1 },
  tatva: { position: "absolute", borderRadius: 999 },
  fire: { width: width * 0.9, height: width * 0.9, right: -width * 0.35, top: height * 0.08, backgroundColor: "#7A1116" },
  water: { width: width * 0.78, height: width * 0.78, left: -width * 0.25, bottom: height * 0.1, backgroundColor: "#D1A034" },
  air: { width: width * 1.2, height: width * 1.2, left: -width * 0.1, top: height * 0.28, borderWidth: 1, borderColor: "rgba(212, 172, 72, 0.33)" },
  starSeal: { position: "absolute", width: sealSize, height: sealSize, left: (width - sealSize) / 2, top: height * 0.18, opacity: 0.12, alignItems: "center", justifyContent: "center" },
  starRing: { position: "absolute", width: sealSize, height: sealSize, borderRadius: sealSize / 2, borderWidth: 1, borderColor: "rgba(224, 181, 68, 0.6)" },
  starRay: { position: "absolute", width: sealSize * 0.78, height: 1, backgroundColor: "rgba(224, 181, 68, 0.58)" },
  rayOne: { transform: [{ rotate: "0deg" }] },
  rayTwo: { transform: [{ rotate: "36deg" }] },
  rayThree: { transform: [{ rotate: "72deg" }] },
  rayFour: { transform: [{ rotate: "108deg" }] },
  rayFive: { transform: [{ rotate: "144deg" }] },
});
