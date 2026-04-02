import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";

const BG = require("../../assets/gate/open.png");
const LAYERS = [
  { key: "earth", top: "10%", tint: "rgba(82,42,14,0.22)", glow: "rgba(170,120,54,0.18)", dx: -16, dy: 4 },
  { key: "water", top: "24%", tint: "rgba(255,224,162,0.10)", glow: "rgba(255,238,198,0.16)", dx: 16, dy: -5 },
  { key: "fire",  top: "38%", tint: "rgba(176,72,16,0.24)", glow: "rgba(255,156,52,0.26)", dx: -14, dy: -6 },
  { key: "air",   top: "52%", tint: "rgba(255,244,214,0.08)", glow: "rgba(255,250,236,0.14)", dx: 14, dy: 0 },
  { key: "space", top: "66%", tint: "rgba(86,24,30,0.20)", glow: "rgba(168,86,96,0.18)", dx: -10, dy: 6 }
];

function TatvaOverlay({ phase }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {LAYERS.map((f, i) => {
        const tx = phase.interpolate({ inputRange: [0, 1], outputRange: [f.dx, -f.dx] });
        const ty = phase.interpolate({ inputRange: [0, 1], outputRange: [f.dy, -f.dy] });
        const op = phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.34, 0.62, 0.34] });
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
            <View style={[s.glowBlob, { left: "4%", backgroundColor: f.glow }]} />
            <View style={[s.glowBlob, { left: "33%", backgroundColor: f.glow }]} />
            <View style={[s.glowBlob, { left: "62%", backgroundColor: f.glow }]} />
            <View style={[s.spark, { left: "18%" }]} />
            <View style={[s.spark, { left: "48%" }]} />
            <View style={[s.spark, { left: "78%" }]} />
            {i === 4 && (
              <>
                <View style={[s.star, { left: "22%", top: 8 }]} />
                <View style={[s.star, { left: "52%", top: 18 }]} />
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

  const chipY = phase.interpolate({ inputRange: [0, 1], outputRange: [12, -12] });

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
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.14)" },

  lane: {
    position: "absolute",
    left: 10,
    right: 10,
    height: 56,
    borderRadius: 28,
    overflow: "hidden"
  },
  glowBlob: {
    position: "absolute",
    top: 10,
    width: 118,
    height: 34,
    borderRadius: 20
  },
  spark: {
    position: "absolute",
    top: 22,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,236,194,0.34)"
  },
  star: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,247,222,0.48)"
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
    backgroundColor: "rgba(0,0,0,0.36)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.84)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6
  },

  floatBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 16,
    backgroundColor: "rgba(8,4,4,0.62)",
    borderWidth: 1.2,
    borderColor: "rgba(212,175,55,0.92)",
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
    backgroundColor: "rgba(12,5,5,0.40)"
  },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" }
});
