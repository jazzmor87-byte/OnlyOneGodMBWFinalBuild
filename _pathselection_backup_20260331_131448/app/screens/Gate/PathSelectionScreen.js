import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";

const BG = require("../../assets/mbw_luxscreens/path_selection.png");

function SmallActionRow({ onLogin, onSignup }) {
  return (
    <View style={s.row}>
      <TouchableOpacity style={s.smallBtn} onPress={onLogin} activeOpacity={0.9}>
        <Text style={s.smallBtnText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.smallBtn} onPress={onSignup} activeOpacity={0.9}>
        <Text style={s.smallBtnText}>SIGNUP</Text>
      </TouchableOpacity>
    </View>
  );
}

function FloatRoute({ title, desc, onLogin, onSignup }) {
  return (
    <View style={s.floatRoute}>
      <Text style={s.routeTitle}>{title}</Text>
      <Text style={s.routeDesc}>{desc}</Text>
      <SmallActionRow onLogin={onLogin} onSignup={onSignup} />
    </View>
  );
}

export default function PathSelectionScreen({ navigation }) {
  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.bottomArea}>
        <FloatRoute
          title="MATCH THE RIGHT MATCH"
          desc="DATE ON RIGHT DATE WITH RIGHT DATE"
          onLogin={() => navigation.navigate("LoginLux", { accessPath: "MATCH_RIGHT_MATCH" })}
          onSignup={() => navigation.navigate("SignupLux", { accessPath: "MATCH_RIGHT_MATCH" })}
        />

        <FloatRoute
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
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.06)" },
  bottomArea: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  floatRoute: {
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.08)",
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  routeTitle: { color: "#FAE8B8", fontSize: 15.5, fontWeight: "900", textAlign: "center" },
  routeDesc: { color: "#F7EBCB", fontSize: 11, textAlign: "center", marginTop: 5, lineHeight: 15 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  smallBtn: {
    flex: 1,
    borderWidth: 1.1,
    borderColor: "#D4AF37",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)"
  },
  smallBtnText: { color: "#FAE8B8", fontSize: 13.5, fontWeight: "900" }
});
