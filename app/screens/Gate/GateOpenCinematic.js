import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
const CINE = require("../../assets/cinematic/mbw_cinematic.mp4");

export default function GateOpenCinematic({ navigation }) {
  return (
    <View style={s.c}>
      <Video
        source={CINE}
        style={s.v}
        shouldPlay
        isLooping={false}
        resizeMode={ResizeMode.COVER}
        onPlaybackStatusUpdate={(st) => {
          if (st?.didJustFinish) navigation.replace("GateLocked");
        }}
      />
      <View style={s.ov} />
      <View style={s.mid}>
        <Text style={s.h}>MEN BEHIND WALL</Text>
        <Text style={s.p}>Two Paths. One Empire.</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#000" },
  v: { flex: 1 },
  ov: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.12)" },
  mid: { position: "absolute", left: 20, right: 20, bottom: 110, alignItems: "center" },
  h: { color: "#D4AF37", fontSize: 28, fontWeight: "900", textAlign: "center" },
  p: { color: "#fff", fontSize: 16, textAlign: "center", marginTop: 8 }
});
