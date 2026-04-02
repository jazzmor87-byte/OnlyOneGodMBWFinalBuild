import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";

const BG = require("../../assets/mbw_luxscreens/path_selection.png");
const EMBERS = [
  { left: "16%", size: 8, delay: 0, drift: -8 },
  { left: "28%", size: 6, delay: 300, drift: 6 },
  { left: "44%", size: 10, delay: 800, drift: -4 },
  { left: "58%", size: 7, delay: 1200, drift: 9 },
  { left: "76%", size: 9, delay: 1700, drift: -6 },
];

function FireOverlay({ phase }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <View style={s.fireWash} />
      {EMBERS.map((e, i) => {
        const rise = phase.interpolate({ inputRange: [0, 1], outputRange: [18 + i * 3, -18 - i * 4] });
        const drift = phase.interpolate({ inputRange: [0, 1], outputRange: [e.drift, -e.drift] });
        const op = phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.18, 0.40, 0.18] });
        return (
          <Animated.View
            key={i}
            style={[
              s.ember,
              { left: e.left, width: e.size, height: e.size + 10, opacity: op, transform: [{ translateY: rise }, { translateX: drift }] }
            ]}
          />
        );
      })}
      <View style={s.fireRibbonLeft} />
      <View style={s.fireRibbonRight} />
    </View>
  );
}

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
  const phase = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(phase, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(phase, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase]);

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <FireOverlay phase={phase} />
      <SafeAreaView style={s.safe}>
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

  fireWash: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "8%",
    height: "54%",
    backgroundColor: "rgba(153,58,20,0.05)"
  },
  ember: {
    position: "absolute",
    top: "34%",
    borderRadius: 10,
    backgroundColor: "rgba(230,134,54,0.22)"
  },
  fireRibbonLeft: {
    position: "absolute",
    left: "10%",
    top: "24%",
    width: 72,
    height: 180,
    borderRadius: 40,
    backgroundColor: "rgba(186,72,20,0.08)",
    transform: [{ rotate: "-18deg" }]
  },
  fireRibbonRight: {
    position: "absolute",
    right: "12%",
    top: "20%",
    width: 64,
    height: 160,
    borderRadius: 40,
    backgroundColor: "rgba(230,138,44,0.06)",
    transform: [{ rotate: "16deg" }]
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
