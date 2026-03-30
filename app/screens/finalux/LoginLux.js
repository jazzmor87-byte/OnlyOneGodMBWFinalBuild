import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { CommonActions } from "@react-navigation/native";

const BG = require("../../assets/mbw_luxscreens/login_main.png");

export default function LoginLux({ navigation, route }) {
  const accessPath = route?.params?.accessPath || "MATCH_RIGHT_MATCH";
  const accessLabel = accessPath === "MASTER_OF_COINS" ? "BECOME MASTER OF COINS" : "MATCH THE RIGHT MATCH";

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.wrap}>
        <View style={s.floatCard}>
          <Text style={s.h}>LOGIN</Text>
          <Text style={s.p}>Continue through {accessLabel}.</Text>
          <TouchableOpacity
            style={s.btn}
            onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{{ name: "Subscription", params: {{ accessPath }} }}] }))}
            activeOpacity={0.9}
          >
            <Text style={s.t}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}}

const s = StyleSheet.create({{
  bg: {{ flex: 1, backgroundColor: "#000" }},
  scrim: {{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.12)" }},
  wrap: {{ flex: 1, justifyContent: "flex-end", padding: 14, paddingBottom: 16 }},
  floatCard: {{
    backgroundColor: "rgba(0,0,0,0.08)",
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center"
  }},
  h: {{ color: "#F4D88E", fontSize: 24, fontWeight: "900" }},
  p: {{ color: "#F7EBCB", textAlign: "center", marginTop: 8, marginBottom: 14, fontSize: 12.5, lineHeight: 18 }},
  btn: {{
    alignSelf: "stretch",
    borderWidth: 1.1,
    borderColor: "#D4AF37",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)"
  }},
  t: {{ color: "#FAE8B8", fontSize: 15, fontWeight: "900" }}
}});
