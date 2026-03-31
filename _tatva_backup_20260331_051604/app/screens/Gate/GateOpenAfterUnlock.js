import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

const BG = require("../../assets/gate/open.png");

export default function GateOpenAfterUnlock({ navigation }) {
  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.wrap}>
        <View style={s.floatTop}>
          <Text style={s.top}>THE GATE IS OPEN</Text>
        </View>

        <View style={s.floatBottom}>
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
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.10)" },
  wrap: { flex: 1, justifyContent: "space-between", padding: 14, paddingBottom: 16, paddingTop: 16 },
  floatTop: {
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.16)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.60)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  top: { color: "#E2C26E", fontSize: 13, fontWeight: "800", letterSpacing: 1.1, textAlign: "center" },
  floatBottom: {
    backgroundColor: "rgba(0,0,0,0.10)",
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  h: { color: "#FAE8B8", fontSize: 20, fontWeight: "900", textAlign: "center", lineHeight: 26 },
  p: { color: "#F7EBCB", fontSize: 12.5, textAlign: "center", marginTop: 10, marginBottom: 14, lineHeight: 18 },
  btn: {
    borderWidth: 1.1,
    borderColor: "#D4AF37",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" }
});
