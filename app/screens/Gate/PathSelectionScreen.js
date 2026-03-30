import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

const BG = require("../../assets/mbw_luxscreens/path_selection.png");

function RouteCard({ title, desc, onLogin, onSignup }) {
  return (
    <View style={s.routeCard}>
      <Text style={s.routeTitle}>{title}</Text>
      <Text style={s.routeDesc}>{desc}</Text>

      <TouchableOpacity style={s.primaryBtn} onPress={onLogin} activeOpacity={0.9}>
        <Text style={s.primaryText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.secondaryBtn} onPress={onSignup} activeOpacity={0.9}>
        <Text style={s.secondaryText}>SIGNUP</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PathSelectionScreen({ navigation }) {
  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.wrap}>
        <View style={s.topCard}>
          <Text style={s.h}>CHOOSE YOUR PATH</Text>
          <Text style={s.p}>Select the entry that will define your access.</Text>
        </View>

        <RouteCard
          title="MATCH THE RIGHT MATCH"
          desc="DATE ON RIGHT DATE WITH RIGHT DATE"
          onLogin={() => navigation.navigate("LoginLux", { accessPath: "MATCH_RIGHT_MATCH" })}
          onSignup={() => navigation.navigate("SignupLux", { accessPath: "MATCH_RIGHT_MATCH" })}
        />

        <RouteCard
          title="BECOME MASTER OF COINS"
          desc="ENTERTAINMENT ZONE GAMES TRAVEL ACROSS WORLD WITH LEAST MONEY STRATEGY AND STAY WITH MOST KIND PEOPLE IN THE WORLD WHO PROMOTES HUMANITY"
          onLogin={() => navigation.navigate("LoginLux", { accessPath: "MASTER_OF_COINS" })}
          onSignup={() => navigation.navigate("SignupLux", { accessPath: "MASTER_OF_COINS" })}
        />
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.24)" },
  wrap: { flex: 1, justifyContent: "flex-end", padding: 18, paddingBottom: 22, gap: 14 },
  topCard: { backgroundColor: "rgba(0,0,0,0.12)", borderRadius: 18, padding: 14 },
  h: { color: "#F4D88E", fontSize: 24, fontWeight: "900", textAlign: "center" },
  p: { color: "#F7EBCB", fontSize: 13, textAlign: "center", marginTop: 7 },
  routeCard: {
    backgroundColor: "rgba(0,0,0,0.10)",
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    borderRadius: 20,
    padding: 16
  },
  routeTitle: { color: "#FAE8B8", fontSize: 19, fontWeight: "900", textAlign: "center" },
  routeDesc: { color: "#F7EBCB", fontSize: 12.5, textAlign: "center", marginTop: 7, marginBottom: 14, lineHeight: 18 },
  primaryBtn: {
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.10)"
  },
  primaryText: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" },
  secondaryBtn: {
    marginTop: 10,
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.06)"
  },
  secondaryText: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" }
});
