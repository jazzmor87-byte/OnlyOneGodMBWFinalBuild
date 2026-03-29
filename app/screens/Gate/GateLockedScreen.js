import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { resolveGateTier } from "./gateCodes";
import { unlockGate, setTier, lockGate } from "../../storage/gateState";

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
    <View style={s.c}>
      <Text style={s.h}>WRITE THE PASSWORD</Text>
      <Text style={s.p}>USER and MBW each have their own exact gate password.</Text>

      <TextInput
        value={pw}
        onChangeText={(t) => {
          setPw(t);
          setErr("");
        }}
        placeholder="Enter exact password"
        placeholderTextColor="#777"
        style={s.i}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      <TouchableOpacity style={s.btn} onPress={onEnter}>
        <Text style={s.t}>UNLOCK GATE</Text>
      </TouchableOpacity>

      {!!err && <Text style={s.e}>{err}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#000", justifyContent: "center", padding: 24 },
  h: { color: "#D4AF37", fontSize: 26, fontWeight: "900", textAlign: "center" },
  p: { color: "#fff", fontSize: 14, textAlign: "center", marginTop: 10, marginBottom: 20 },
  i: {
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 18,
    color: "#fff",
    padding: 16,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#111"
  },
  btn: {
    marginTop: 18,
    backgroundColor: "#800000",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center"
  },
  t: { color: "#fff", fontSize: 17, fontWeight: "900" },
  e: { color: "#ff7a7a", textAlign: "center", marginTop: 14, fontWeight: "700" }
});
