import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function makeFallback(title) {
  return function RecoveryFallback({ navigation }) {
    return (
      <View style={s.c}>
        <Text style={s.h}>{title}</Text>
        <Text style={s.p}>This route is alive in recovery mode.</Text>
        <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("RecoveryHub")}>
          <Text style={s.t}>BACK TO MAIN HALL</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

export default makeFallback("RECOVERY");
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#000", justifyContent: "center", padding: 24, alignItems: "center" },
  h: { color: "#D4AF37", fontSize: 28, fontWeight: "900", textAlign: "center" },
  p: { color: "#fff", textAlign: "center", marginTop: 10, marginBottom: 24 },
  btn: { backgroundColor: "#111", borderWidth: 1, borderColor: "#D4AF37", borderRadius: 18, paddingVertical: 16, paddingHorizontal: 28 },
  t: { color: "#fff", fontSize: 16, fontWeight: "900" }
});
