import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { CommonActions } from "@react-navigation/native";

const BG = require("../assets/mbw_luxscreens/subscription_main.png");

export default function Subscription({ navigation, route }) {
  const accessPath = route?.params?.accessPath || "MATCH_RIGHT_MATCH";
  const accessTitle = accessPath === "MASTER_OF_COINS" ? "BECOME MASTER OF COINS" : "MATCH THE RIGHT MATCH";
  const accessDesc = accessPath === "MASTER_OF_COINS"
    ? "ENTERTAINMENT ZONE GAMES TRAVEL ACROSS WORLD WITH LEAST MONEY STRATEGY AND STAY WITH MOST KIND PEOPLE IN THE WORLD WHO PROMOTES HUMANITY"
    : "DATE ON RIGHT DATE WITH RIGHT DATE";

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.wrap}>
        <View style={s.floatCard}>
          <Text style={s.h}>SUBSCRIPTION</Text>
          <Text style={s.route}>{accessTitle}</Text>
          <Text style={s.p}>{accessDesc}</Text>
          <TouchableOpacity
            style={s.btn}
            onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{{ name: "Main_Activity", params: {{ accessPath }} }}] }))}
            activeOpacity={0.9}
          >
            <Text style={s.t}>ENTER MBW HOME</Text>
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
  route: {{ color: "#FAE8B8", fontSize: 15.5, fontWeight: "900", textAlign: "center", marginTop: 8 }},
  p: {{ color: "#F7EBCB", textAlign: "center", marginTop: 8, marginBottom: 14, fontSize: 11.5, lineHeight: 17 }},
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
