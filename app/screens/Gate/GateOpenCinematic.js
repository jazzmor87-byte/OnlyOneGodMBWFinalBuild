import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
const CINE = require("../../assets/cinematic/mbw_cinematic.mp4");

export default function GateOpenCinematic({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace("GateLocked"), 4800);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={s.c}>
      {CINE ? (
        <Video source={CINE} style={s.v} shouldPlay isLooping={false} resizeMode={ResizeMode.COVER} />
      ) : (
        <View style={s.v} />
      )}
      <View style={s.ov} />
      <View style={s.mid}>
        <Text style={s.h}>MEN BEHIND WALL</Text>
        <Text style={s.p}>Two Paths. One Empire.</Text>
      </View>
      <TouchableOpacity style={s.skip} onPress={() => navigation.replace("GateLocked")}>
        <Text style={s.skipText}>SKIP</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#000" },
  v: { flex: 1 },
  ov: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },
  mid: { position: "absolute", left: 20, right: 20, bottom: 110, alignItems: "center" },
  h: { color: "#D4AF37", fontSize: 28, fontWeight: "900", textAlign: "center" },
  p: { color: "#fff", fontSize: 16, textAlign: "center", marginTop: 8 },
  skip: { position: "absolute", top: 52, right: 18, borderWidth: 1, borderColor: "#D4AF37", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.45)" },
  skipText: { color: "#fff", fontWeight: "800" }
});
