import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";

const BG = require("../../assets/mbw_luxscreens/path_selection.png");
const TATVAS = ["EARTH","WATER","FIRE","AIR","SPACE"];

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
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const glowY = drift.interpolate({ inputRange: [0, 1], outputRange: [8, -8] });

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <Animated.View style={[s.glow, { transform: [{ translateY: glowY }] }]} />

      <View style={s.tatvaRow}>
        {TATVAS.map((x) => (
          <View key={x} style={s.tatvaChip}>
            <Text style={s.tatvaText}>{x}</Text>
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
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.08)" },
  glow: {
    position: "absolute",
    left: "10%",
    right: "10%",
    top: "14%",
    height: 130,
    borderRadius: 30,
    backgroundColor: "rgba(212,175,55,0.12)"
  },

  tatvaRow: {
    position: "absolute",
    top: 14,
    left: 10,
    right: 10,
    zIndex: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  tatvaChip: {
    minWidth: 58,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "rgba(0,0,0,0.22)"
  },
  tatvaText: {
    color: "#E8C56A",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.6
  },

  bottomArea: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  floatRoute: {
    overflow: "hidden",
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.14)",
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  routeTitle: { color: "#FAE8B8", fontSize: 15.5, fontWeight: "900", textAlign: "center" },
  routeDesc: { color: "#F7EBCB", fontSize: 11, textAlign: "center", marginTop: 5, lineHeight: 15 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  smallBtn: {
    flex: 1,
    borderWidth: 1.1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.10)"
  },
  smallBtnText: { color: "#FAE8B8", fontSize: 13.5, fontWeight: "900" }
});
