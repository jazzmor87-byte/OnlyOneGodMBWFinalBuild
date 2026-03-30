import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

const BG = require("../../assets/mbw_luxscreens/main_hub.png");

export default function GateOpenAfterUnlock({ navigation }) {
  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.wrap}>
        <View style={s.card}>
          <Text style={s.top}>THE GATE IS OPEN</Text>
          <Text style={s.h}>GOD LET YOU PASS THROUGH THE GATE LOCK</Text>
          <Text style={s.p}>to be a free man where you can do things which you like in your way, but you are watched by God.</Text>

          <TouchableOpacity style={s.btn} onPress={() => navigation.replace("PathSelection")} activeOpacity={0.9}>
            <Text style={s.t}>ENTER FURTHER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)" },
  wrap: { flex: 1, justifyContent: "flex-end", padding: 18, paddingBottom: 26 },
  card: { backgroundColor: "transparent", alignItems: "center" },
  top: { color: "#E2C26E", fontSize: 14, fontWeight: "700", marginBottom: 10, letterSpacing: 1.1 },
  h: { color: "#FAE8B8", fontSize: 22, fontWeight: "900", textAlign: "center", lineHeight: 28 },
  p: { color: "#F7EBCB", fontSize: 13, textAlign: "center", marginTop: 12, marginBottom: 22, lineHeight: 19, paddingHorizontal: 6 },
  btn: {
    alignSelf: "stretch",
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)"
  },
  t: { color: "#FAE8B8", fontSize: 16, fontWeight: "900" }
});
