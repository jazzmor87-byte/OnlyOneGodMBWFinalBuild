import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function GateOpenAfterUnlock({ navigation, route }) {
  const mode = route?.params?.entryMode || "PUBLIC";

  return (
    <View style={s.c}>
      <Text style={s.h}>THE GATE IS OPEN</Text>
      <Text style={s.p}>{mode === "MBW" ? "Private MBW path unlocked." : "Public path ready."}</Text>

      <TouchableOpacity style={s.btn} onPress={() => navigation.replace("PathSelection", { entryMode: mode })}>
        <Text style={s.t}>ENTER FURTHER</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#000", justifyContent: "center", padding: 24, alignItems: "center" },
  h: { color: "#D4AF37", fontSize: 30, fontWeight: "900", textAlign: "center" },
  p: { color: "#fff", fontSize: 15, textAlign: "center", marginTop: 12, marginBottom: 24 },
  btn: { backgroundColor: "rgba(15,15,15,0.86)", borderWidth: 1, borderColor: "#D4AF37", borderRadius: 18, paddingVertical: 16, paddingHorizontal: 28 },
  t: { color: "#fff", fontSize: 18, fontWeight: "900" }
});
