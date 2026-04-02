import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from "react-native";

const BG = require("../../assets/mbw_luxscreens/path_selection.png");

function Card({ title, desc, onLogin, onSignup }) {
  return (
    <View style={s.card}>
      <Text style={s.h}>{title}</Text>
      <Text style={s.p}>{desc}</Text>
      <View style={s.row}>
        <TouchableOpacity style={s.btn} onPress={onLogin} activeOpacity={0.9}><Text style={s.t}>LOGIN</Text></TouchableOpacity>
        <TouchableOpacity style={s.btn} onPress={onSignup} activeOpacity={0.9}><Text style={s.t}>SIGN UP</Text></TouchableOpacity>
      </View>
    </View>
  );
}

export default function PathSelectionScreen({ navigation }) {
  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.wrap}>
          <Card
            title="ENTER AS USER"
            desc="MATCHMAKING • TRAVEL • GAMES • LOUNGE • COMMUNITY"
            onLogin={() => navigation.navigate("LoginLux", { role: "USER", accessPath: "MATCH_RIGHT_MATCH" })}
            onSignup={() => navigation.navigate("SignupLux", { role: "USER", accessPath: "MATCH_RIGHT_MATCH" })}
          />
          <Card
            title="ENTER AS MBW"
            desc="REALM • HOSTING • PRIVILEGES • CREATOR ACCESS"
            onLogin={() => navigation.navigate("LoginLux", { role: "MBW", accessPath: "MBW_REALM" })}
            onSignup={() => navigation.navigate("SignupLux", { role: "MBW", accessPath: "MBW_REALM" })}
          />
          <Card
            title="MASTER OF COINS"
            desc="COIN EXPLORER • SEEKER • KEEPER • TRADER"
            onLogin={() => navigation.navigate("LoginLux", { role: "USER", accessPath: "MASTER_OF_COINS" })}
            onSignup={() => navigation.navigate("SignupLux", { role: "USER", accessPath: "MASTER_OF_COINS" })}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  safe: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.14)" },
  wrap: { flexGrow: 1, justifyContent: "flex-end", padding: 14, paddingBottom: 16, gap: 10 },
  card: {
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.88)",
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.20)",
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  h: { color: "#FAE8B8", fontSize: 18, fontWeight: "900", textAlign: "center" },
  p: { color: "#F7EBCB", textAlign: "center", marginTop: 8, marginBottom: 12, fontSize: 12.2, lineHeight: 18 },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.84)",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.14)"
  },
  t: { color: "#FAE8B8", fontSize: 13.5, fontWeight: "900" }
});
