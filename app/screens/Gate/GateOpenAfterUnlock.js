import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";

const BG = require("../../assets/gate/open.png");
const TATVAS = ["EARTH","WATER","FIRE","AIR","SPACE"];

export default function GateOpenAfterUnlock({ navigation }) {
  const ui = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ui, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(ui, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [ui]);

  const chipY = ui.interpolate({ inputRange: [0, 1], outputRange: [12, -12] });

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />

      <View style={s.tatvaRow} pointerEvents="none">
        {TATVAS.map((x) => (
          <View key={x} style={s.tatvaChip}>
            <Text style={s.tatvaText}>{x}</Text>
          </View>
        ))}
      </View>

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
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },

  tatvaRow: {
    position: "absolute",
    top: 14,
    left: 10,
    right: 10,
    zIndex: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  tatvaChip: {
    minWidth: 58,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "rgba(0,0,0,0.22)"
  },
  tatvaText: {
    color: "#E8C56A",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.6
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
    backgroundColor: "rgba(0,0,0,0.26)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.80)",
    borderRadius: 14,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6
  },

  floatBottom: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 16,
    backgroundColor: "rgba(10,5,5,0.28)",
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
