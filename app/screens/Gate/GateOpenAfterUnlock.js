import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";

const BG = require("../../assets/gate/open.png");
const LAYERS = [
  { key: "earth", top: "12%", tint: "rgba(118,74,28,0.16)", glow: "rgba(176,116,46,0.20)", dx: -18, dy: 4 },
  { key: "water", top: "24%", tint: "rgba(152,118,62,0.12)", glow: "rgba(224,188,118,0.17)", dx: 18, dy: -5 },
  { key: "fire",  top: "36%", tint: "rgba(170,78,26,0.18)", glow: "rgba(242,150,48,0.24)", dx: -15, dy: -7 },
  { key: "air",   top: "48%", tint: "rgba(236,214,164,0.10)", glow: "rgba(255,244,214,0.14)", dx: 15, dy: 0 },
  { key: "space", top: "60%", tint: "rgba(108,62,88,0.14)", glow: "rgba(184,132,170,0.18)", dx: -10, dy: 7 }
];

function TatvaOverlay({ phase }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {LAYERS.map((f, i) => {
        const tx = phase.interpolate({ inputRange: [0, 1], outputRange: [f.dx, -f.dx] });
        const ty = phase.interpolate({ inputRange: [0, 1], outputRange: [f.dy, -f.dy] });
        const op = phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.32, 0.58, 0.32] });
        return (
          <Animated.View
            key={f.key}
            style={[
              s.lane,
              {
                top: f.top,
                backgroundColor: f.tint,
                opacity: op,
                transform: [{ translateX: tx }, { translateY: ty }]
              }
            ]}
          >
            <View style={[s.glowBlob, { left: "6%", backgroundColor: f.glow }]} />
            <View style={[s.glowBlob, { left: "36%", backgroundColor: f.glow }]} />
            <View style={[s.glowBlob, { left: "66%", backgroundColor: f.glow }]} />
            <View style={[s.spark, { left: "18%" }]} />
            <View style={[s.spark, { left: "48%" }]} />
            <View style={[s.spark, { left: "78%" }]} />
            {i === 4 && (
              <>
                <View style={[s.star, { left: "22%", top: 7 }]} />
                <View style={[s.star, { left: "52%", top: 17 }]} />
                <View style={[s.star, { left: "74%", top: 10 }]} />
              </>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

export default function GateOpenAfterUnlock({ navigation }) {
  const phase = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(phase, { toValue: 1, duration: 3800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(phase, { toValue: 0, duration: 3800, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase]);

  const chipY = phase.interpolate({ inputRange: [0, 1], outputRange: [16, -16] });

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <TatvaOverlay phase={phase} />
      <SafeAreaView style={s.safe}>
        <Animated.View style={[s.floatTop, { transform: [{ translateY: chipY }] }]}>
          <Text style={s.top}>THE GATE IS OPEN</Text>
        </Animated.View>

        <View style={s.floatBottom}>
          <Text style={s.h}>GOD LET YOU PASS THROUGH THE GATE LOCK</Text>
          <Text style={s.p}>to be a free man where you can do things which you like in your way, but you are watched by God.</Text>
          <TouchableOpacity style={s.btn} onPress={() => navigation.replace("PathSelection")} activeOpacity={0.9}>
            <Text style={s.t}>ENTER FURTHER</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  safe: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.16)" },

  lane: {
    position: "absolute",
    left: 10,
    right: 10,
    height: 42,
    borderRadius: 24,
    overflow: "hidden"
  },
  glowBlob: {
    position: "absolute",
    top: 7,
    width: 110,
    height: 28,
    borderRadius: 18
  },
  spark: {
    position: "absolute",
    top: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,232,180,0.30)"
  },
  star: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,247,222,0.46)"
  },

  floatTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "46%",
    alignItems: "center",
    zIndex: 5
  },
  top: {
    color: "#E6C977",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.1,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.34)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.82)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6
  },

  floatBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 16,
    backgroundColor: "rgba(8,4,4,0.50)",
    borderWidth: 1.15,
    borderColor: "rgba(212,175,55,0.90)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  h: { color: "#FAE8B8", fontSize: 20, fontWeight: "900", textAlign: "center", lineHeight: 26 },
  p: { color: "#F7EBCB", fontSize: 12.5, textAlign: "center", marginTop: 10, marginBottom: 14, lineHeight: 18 },
  btn: {
    borderWidth: 1.15,
    borderColor: "#D9B05A",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "rgba(12,5,5,0.34)"
  },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" }
});
