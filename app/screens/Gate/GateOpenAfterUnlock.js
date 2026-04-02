import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BG = require("../../assets/gate/open.png");
const TATVAS = [
  { label: "EARTH", icon: "leaf" },
  { label: "WATER", icon: "water-outline" },
  { label: "FIRE", icon: "fire" },
  { label: "AIR", icon: "weather-windy" },
  { label: "SPACE", icon: "star-four-points-outline" }
];

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
      <SafeAreaView style={s.safe}>
        <View style={s.tatvaBand}>
          {TATVAS.map((x) => (
            <View key={x.label} style={s.tatvaChip}>
              <MaterialCommunityIcons name={x.icon} size={16} color="#F3D27D" />
              <Text style={s.tatvaText}>{x.label}</Text>
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  safe: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },

  tatvaBand: {
    marginTop: 6,
    marginHorizontal: 10,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.56)",
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 15,
    paddingHorizontal: 4,
    paddingVertical: 6
  },
  tatvaChip: {
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(40,18,0,0.82)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.85)",
    borderRadius: 12,
    paddingVertical: 6
  },
  tatvaText: {
    marginTop: 2,
    color: "#F3D27D",
    fontSize: 9.5,
    fontWeight: "900",
    letterSpacing: 0.35
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
