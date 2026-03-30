import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { resolveGateTier } from "./gateCodes";
import { unlockGate, setTier, lockGate } from "../../storage/gateState";

const BG = require("../../assets/mbw_luxscreens/realm_main_alt.png");

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
      <View style={s.wrap}>
        <View style={s.card}>
          <Text style={s.helper}>Only one word is the password of this app to go further.</Text>
          <Text style={s.tatva}>PANCH TATVA • EARTH • WATER • FIRE • AIR • SPACE</Text>

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
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.32)" },
  wrap: { flex: 1, justifyContent: "flex-end", padding: 18, paddingBottom: 26 },
  card: { backgroundColor: "transparent" },
  helper: {
    color: "#F7EBCB",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowRadius: 6
  },
  tatva: {
    color: "#D4AF37",
    fontSize: 11.5,
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: 0.6,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowRadius: 6
  },
  i: {
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    borderRadius: 18,
    color: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.10)"
  },
  btn: {
    marginTop: 12,
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)"
  },
  t: { color: "#FAE8B8", fontSize: 16, fontWeight: "900" },
  e: { color: "#ffb0b0", textAlign: "center", marginTop: 10, fontWeight: "700" }
});
