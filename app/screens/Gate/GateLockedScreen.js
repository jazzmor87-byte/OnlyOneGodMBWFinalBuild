import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { resolveGateTier } from "./gateCodes";
import { unlockGate, setTier, lockGate } from "../../storage/gateState";

const BG = require("../../assets/gate/locked.png");
const TATVAS = ["EARTH","WATER","FIRE","AIR","SPACE"];

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
    if (tier == "MBW") await unlockGate();
    else await lockGate();
    navigation.replace("GateOpenAfterUnlock", { entryMode: tier });
  };

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
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.12)" },

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

  wrap: { flex: 1, justifyContent: "flex-end", padding: 14, paddingBottom: 16 },
  floatCard: {
    backgroundColor: "rgba(0,0,0,0.10)",
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.72)",
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
    backgroundColor: "rgba(0,0,0,0.06)"
  },
  btn: {
    marginTop: 10,
    borderWidth: 1.1,
    borderColor: "#D4AF37",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" },
  e: { color: "#ffb0b0", textAlign: "center", marginTop: 8, fontWeight: "700" }
});
