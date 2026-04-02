import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";

const BG = require("../../assets/gate/open.png");
const FLOWS = [
  { key: "earth", top: "16%", tint: "rgba(122,78,34,0.10)", glow: "rgba(156,103,44,0.16)", dx: -18, dy: 4 },
  { key: "water", top: "26%", tint: "rgba(92,136,188,0.10)", glow: "rgba(116,173,233,0.14)", dx: 18, dy: -4 },
  { key: "fire", top: "36%", tint: "rgba(164,66,28,0.12)", glow: "rgba(230,142,44,0.18)", dx: -14, dy: -6 },
  { key: "air", top: "46%", tint: "rgba(214,214,214,0.08)", glow: "rgba(255,255,255,0.12)", dx: 14, dy: 0 },
  { key: "space", top: "56%", tint: "rgba(108,76,146,0.10)", glow: "rgba(182,146,222,0.16)", dx: -10, dy: 6 },
];

function TatvaFlow({ phase }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {FLOWS.map((f, i) => {
        const tx = phase.interpolate({ inputRange: [0, 1], outputRange: [f.dx, -f.dx] });
        const ty = phase.interpolate({ inputRange: [0, 1], outputRange: [f.dy, -f.dy] });
        const op = phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.32, 0.52, 0.32] });
        return (
          <Animated.View
            key={f.key}
            style={[
              s.flowBand,
              { top: f.top, backgroundColor: f.tint, opacity: op, transform: [{ translateX: tx }, { translateY: ty }] }
            ]}
          >
            <View style={[s.glowBlob, { left: "8%", backgroundColor: f.glow }]} />
            <View style={[s.glowBlob, { left: "42%", backgroundColor: f.glow }]} />
            <View style={[s.glowBlob, { right: "8%", backgroundColor: f.glow }]} />
            {i === 4 && (
              <>
                <View style={[s.star, { left: "18%", top: 8 }]} />
                <View style={[s.star, { left: "52%", top: 18 }]} />
                <View style={[s.star, { right: "16%", top: 10 }]} />
              </>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

export default function GateOpenAfterUnlock({ navigation }) {
  const ui = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ui, { toValue: 1, duration: 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(ui, { toValue: 0, duration: 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [ui]);

  const chipY = ui.interpolate({ inputRange: [0, 1], outputRange: [12, -12] });

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <TatvaFlow phase={ui} />
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
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },

  flowBand: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 34,
    borderRadius: 20,
    overflow: "hidden"
  },
  glowBlob: {
    position: "absolute",
    top: 6,
    width: 84,
    height: 22,
    borderRadius: 14
  },
  star: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,245,210,0.45)"
  },

  floatTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "46%",
    alignItems: "center",
    zIndex: 4
  },
  top: {
    color: "#E6C977",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.1,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.30)",
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
    backgroundColor: "rgba(10,5,5,0.34)",
    borderWidth: 1.15,
    borderColor: "rgba(212,175,55,0.86)",
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
    backgroundColor: "rgba(12,5,5,0.26)"
  },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" }
});
