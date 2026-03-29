import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";

export default function SignupLux({ navigation, route }) {
  const mode = route?.params?.entryMode || "PUBLIC";
  return (
    <View style={s.c}>
      <Text style={s.h}>SIGNUP</Text>
      <Text style={s.p}>Create your path and continue to the Main Hall.</Text>
      <TouchableOpacity
        style={s.btn}
        onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "RecoveryHub", params: { tier: mode === "MBW" ? "MBW" : "PUBLIC" } }] }))}
      >
        <Text style={s.t}>ENTER MAIN HALL</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#000", justifyContent: "center", padding: 24, alignItems: "center" },
  h: { color: "#D4AF37", fontSize: 30, fontWeight: "900" },
  p: { color: "#fff", textAlign: "center", marginTop: 10, marginBottom: 24 },
  btn: { backgroundColor: "#111", borderWidth: 1, borderColor: "#800000", borderRadius: 18, paddingVertical: 16, paddingHorizontal: 28 },
  t: { color: "#fff", fontSize: 18, fontWeight: "900" }
});
