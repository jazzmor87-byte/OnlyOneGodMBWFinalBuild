import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";

const BG = require("../../assets/mbw_luxscreens/path_selection.png");
const EMBERS = [
  { left: "12%", size: 10, drift: -10, riseA: 22, riseB: -26 },
  { left: "22%", size: 8, drift: 8, riseA: 10, riseB: -18 },
  { left: "34%", size: 12, drift: -7, riseA: 18, riseB: -28 },
  { left: "46%", size: 9, drift: 10, riseA: 14, riseB: -22 },
  { left: "58%", size: 11, drift: -9, riseA: 24, riseB: -30 },
  { left: "70%", size: 8, drift: 7, riseA: 12, riseB: -20 },
  { left: "82%", size: 10, drift: -8, riseA: 20, riseB: -26 }
];

function FireOverlay({ phase }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <View style={s.fireWashTop} />
      <View style={s.fireWashMid} />
      <View style={s.fireRibbonLeft} />
      <View style={s.fireRibbonRight} />
      <View style={s.fireRibbonCenter} />
      {EMBERS.map((e, i) => {
        const rise = phase.interpolate({ inputRange: [0, 1], outputRange: [e.riseA, e.riseB] });
        const drift = phase.interpolate({ inputRange: [0, 1], outputRange: [e.drift, -e.drift] });
        const op = phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.18, 0.48, 0.18] });
        return (
          <Animated.View
            key={i}
            style={[
              s.ember,
              {
                left: e.left,
                width: e.size,
                height: e.size + 12,
                opacity: op,
                transform: [{ translateY: rise }, { translateX: drift }]
              }
            ]}
          />
        );
      })}
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
        Animated.timing(phase, { toValue: 1, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(phase, { toValue: 0, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
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
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.06)" },

  fireWashTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "6%",
    height: "24%",
    backgroundColor: "rgba(160,58,18,0.08)"
  },
  fireWashMid: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "28%",
    height: "30%",
    backgroundColor: "rgba(196,88,24,0.07)"
  },
  fireRibbonLeft: {
    position: "absolute",
    left: "8%",
    top: "20%",
    width: 92,
    height: 250,
    borderRadius: 50,
    backgroundColor: "rgba(196,80,18,0.10)",
    transform: [{ rotate: "-20deg" }]
  },
  fireRibbonRight: {
    position: "absolute",
    right: "10%",
    top: "18%",
    width: 82,
    height: 230,
    borderRadius: 50,
    backgroundColor: "rgba(236,126,30,0.10)",
    transform: [{ rotate: "18deg" }]
  },
  fireRibbonCenter: {
    position: "absolute",
    left: "42%",
    top: "12%",
    width: 64,
    height: 320,
    borderRadius: 40,
    backgroundColor: "rgba(242,164,44,0.08)"
  },
  ember: {
    position: "absolute",
    top: "34%",
    borderRadius: 12,
    backgroundColor: "rgba(248,168,56,0.26)"
  },

  bottomArea: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  floatRoute: {
    overflow: "hidden",
    borderWidth: 1.15,
    borderColor: "rgba(212,175,55,0.86)",
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.22)",
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
    backgroundColor: "rgba(0,0,0,0.12)"
  },
  smallBtnText: { color: "#FAE8B8", fontSize: 13.5, fontWeight: "900" }
});
