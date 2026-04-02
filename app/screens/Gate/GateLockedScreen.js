import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { resolveGateTier } from "./gateCodes";
import { unlockGate, setTier, lockGate } from "../../storage/gateState";

const BG = require("../../assets/gate/locked.png");
const TATVAS = [
  { label: "EARTH", icon: "leaf" },
  { label: "WATER", icon: "water-outline" },
  { label: "FIRE", icon: "fire" },
  { label: "AIR", icon: "weather-windy" },
  { label: "SPACE", icon: "star-four-points-outline" }
];

export default function GateLockedScreen({ navigation }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const onEnter = async () => {
    const tier = resolveGateTier(pw);
    if (!tier) {
      setErr("Wrong password");
      return;
    }
    await setTier(tier);
    if (tier === "MBW") await unlockGate();
    else await lockGate();
    navigation.replace("GateOpenAfterUnlock", { entryMode: tier });
  };

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

        <View style={s.wrap}>
          <View style={s.floatCard}>
            <Text style={s.helper}>Only one word is the password of this app to go further.</Text>

            <TextInput
              value={pw}
              onChangeText={(t) => { setPw(t); setErr(""); }}
              placeholder="WRITE THE PASSWORD"
              placeholderTextColor="#D7B86A"
              style={s.i}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <TouchableOpacity style={s.btn} onPress={onEnter} activeOpacity={0.9}>
              <Text style={s.t}>UNLOCK GATE</Text>
            </TouchableOpacity>

            {!!err && <Text style={s.e}>{err}</Text>}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  safe: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.12)" },

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

  wrap: { flex: 1, justifyContent: "flex-end", padding: 14, paddingBottom: 16 },
  floatCard: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1.15,
    borderColor: "rgba(212,175,55,0.86)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  helper: { color: "#F7EBCB", fontSize: 12.5, textAlign: "center", marginBottom: 10 },
  i: {
    borderWidth: 1.1,
    borderColor: "#D4AF37",
    borderRadius: 16,
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 15.5,
    backgroundColor: "rgba(0,0,0,0.10)"
  },
  btn: {
    marginTop: 10,
    borderWidth: 1.1,
    borderColor: "#D4AF37",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.10)"
  },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" },
  e: { color: "#ffb0b0", textAlign: "center", marginTop: 8, fontWeight: "700" }
});
