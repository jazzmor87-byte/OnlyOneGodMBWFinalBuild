import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BG = require("../../assets/mbw_luxscreens/path_selection.png");
const TATVAS = [
  { label: "EARTH", icon: "leaf" },
  { label: "WATER", icon: "water-outline" },
  { label: "FIRE", icon: "fire" },
  { label: "AIR", icon: "weather-windy" },
  { label: "SPACE", icon: "star-four-points-outline" }
];

function ActionRow({ onLogin, onSignup }) {
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

function RouteCard({ title, desc, onLogin, onSignup }) {
  return (
    <View style={s.floatRoute}>
      <Text style={s.routeTitle}>{title}</Text>
      <Text style={s.routeDesc}>{desc}</Text>
      <ActionRow onLogin={onLogin} onSignup={onSignup} />
    </View>
  );
}

export default function PathSelectionScreen({ navigation }) {
  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <SafeAreaView style={s.safe}>
        <View style={s.tatvaBand}>
          {TATVAS.map((x) => (
            <View key={x.label} style={s.tatvaChip}>
              <MaterialCommunityIcons name={x.icon} size={16} color="#F3D27D" />
              <Text style={s.tatvaText}>{x.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.bottomArea}>
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  safe: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.08)" },

  tatvaBand: {
    marginTop: 6,
    marginHorizontal: 10,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.56)",
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 15,
    paddingHorizontal: 4,
    paddingVertical: 6
  },
  tatvaChip: {
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(40,18,0,0.82)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.85)",
    borderRadius: 12,
    paddingVertical: 6
  },
  tatvaText: {
    marginTop: 2,
    color: "#F3D27D",
    fontSize: 9.5,
    fontWeight: "900",
    letterSpacing: 0.35
  },

  bottomArea: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  floatRoute: {
    overflow: "hidden",
    borderWidth: 1.15,
    borderColor: "rgba(212,175,55,0.86)",
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.18)",
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  routeTitle: { color: "#FAE8B8", fontSize: 15.5, fontWeight: "900", textAlign: "center" },
  routeDesc: { color: "#F7EBCB", fontSize: 11, textAlign: "center", marginTop: 5, lineHeight: 15 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  smallBtn: {
    flex: 1,
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.82)",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.10)"
  },
  smallBtnText: { color: "#FAE8B8", fontSize: 13.5, fontWeight: "900" }
});
