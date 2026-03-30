import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PathSelectionScreen({ navigation, route }) {
  const mode = route?.params?.entryMode || "PUBLIC";

  return (
    <View style={s.c}>
      <Text style={s.h}>PATH SELECTION</Text>
      <Text style={s.p}>Choose Login or Signup to continue into the Main Hall.</Text>

      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("LoginLux", { entryMode: mode })}>
        <Text style={s.t}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[s.btn, s.alt]} onPress={() => navigation.navigate("SignupLux", { entryMode: mode })}>
        <Text style={s.t}>SIGNUP</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#000", justifyContent: "center", padding: 24 },
  h: { color: "#D4AF37", fontSize: 28, fontWeight: "900", textAlign: "center" },
  p: { color: "#fff", fontSize: 14, textAlign: "center", marginTop: 10, marginBottom: 26 },
  btn: { backgroundColor: "#111", borderWidth: 1, borderColor: "#D4AF37", borderRadius: 20, paddingVertical: 18, marginVertical: 10, alignItems: "center" },
  alt: { borderColor: "#800000" },
  t: { color: "#fff", fontSize: 18, fontWeight: "900" }
});

/* ACE_LOCKED_POSTER:path_selection.png */
