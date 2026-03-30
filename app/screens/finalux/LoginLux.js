import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { CommonActions } from "@react-navigation/native";

const BG = require("../../assets/mbw_luxscreens/login_main.png");

export default function LoginLux({ navigation, route }) {
  const accessPath = route?.params?.accessPath || "MATCH_RIGHT_MATCH";
  const accessLabel = accessPath === "MASTER_OF_COINS" ? "MASTER OF COINS" : "MATCH RIGHT MATCH";

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.wrap}>
        <View style={s.card}>
          <Text style={s.h}>LOGIN</Text>
          <Text style={s.p}>Continue through {accessLabel}.</Text>

          <TouchableOpacity
            style={s.btn}
            onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Subscription", params: { accessPath } }] }))}
            activeOpacity={0.9}
          >
            <Text style={s.t}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },
  wrap: { flex: 1, justifyContent: "flex-end", padding: 18, paddingBottom: 28 },
  card: { backgroundColor: "rgba(0,0,0,0.10)", borderRadius: 18, padding: 18, alignItems: "center" },
  h: { color: "#F4D88E", fontSize: 28, fontWeight: "900" },
  p: { color: "#F7EBCB", textAlign: "center", marginTop: 10, marginBottom: 18, fontSize: 13 },
  btn: { borderWidth: 1.2, borderColor: "#D4AF37", borderRadius: 16, paddingVertical: 15, paddingHorizontal: 28, backgroundColor: "rgba(0,0,0,0.08)" },
  t: { color: "#FAE8B8", fontSize: 16, fontWeight: "900" }
});
