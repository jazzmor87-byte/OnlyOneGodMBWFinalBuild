import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import { CommonActions } from "@react-navigation/native";
import useTatvaScreen from "../hooks/useTatvaScreen";

const BG = require("../assets/mbw_luxscreens/subscription_main.png");

export default function Subscription({ navigation, route }) {
  const accessPath = route?.params?.accessPath || "MATCH_RIGHT_MATCH";
  const accessTitle = accessPath === "MASTER_OF_COINS" ? "BECOME MASTER OF COINS" : "MATCH THE RIGHT MATCH";
  const accessDesc = accessPath === "MASTER_OF_COINS"
    ? "ENTERTAINMENT ZONE GAMES TRAVEL ACROSS WORLD WITH LEAST MONEY STRATEGY AND STAY WITH MOST KIND PEOPLE IN THE WORLD WHO PROMOTES HUMANITY"
    : "DATE ON RIGHT DATE WITH RIGHT DATE";

  const { visual, panelFloatStyle, textFloatStyle, buttonFloatStyle } = useTatvaScreen("Subscription");
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const goldY = drift.interpolate({ inputRange: [0, 1], outputRange: [6, -7] });
  const spaceScale = drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.fx} pointerEvents="none">
        <Animated.View style={[s.goldField, { transform: [{ translateY: goldY }] }]} />
        <Animated.View style={[s.spaceGlow, { transform: [{ scale: spaceScale }] }]} />
        <Animated.View style={[s.tatvaGlow, panelFloatStyle, { backgroundColor: visual.glow }]} />
        <Animated.View style={[s.tatvaVeil, textFloatStyle, { backgroundColor: visual.veil }]} />
      </View>
      <View style={s.wrap}>
        <Animated.View style={[s.floatCard, panelFloatStyle, { borderColor: visual.edge }]}>
          <View style={[s.cardAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
          <Animated.Text style={[s.h, { color: visual.text }, textFloatStyle]}>SUBSCRIPTION</Animated.Text>
          <Animated.Text style={[s.route, { color: visual.text }, textFloatStyle]}>{accessTitle}</Animated.Text>
          <Animated.Text style={[s.p, textFloatStyle]}>{accessDesc}</Animated.Text>
          <Animated.View style={buttonFloatStyle}>
            <TouchableOpacity
              style={[s.btn, { borderColor: visual.edge }]}
              onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Main_Activity", params: { accessPath } }] }))}
              activeOpacity={0.9}
            >
              <View style={[s.btnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
              <Animated.Text style={[s.t, { color: visual.text }, textFloatStyle]}>ENTER MBW HOME</Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.10)" },
  fx: { ...StyleSheet.absoluteFillObject },
  goldField: {
    position: "absolute",
    left: "8%",
    right: "8%",
    bottom: "20%",
    height: 160,
    borderRadius: 34,
    opacity: 0.10,
    backgroundColor: "rgba(239,190,74,0.92)"
  },
  spaceGlow: {
    position: "absolute",
    right: "-10%",
    top: "8%",
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.09,
    backgroundColor: "rgba(82,56,122,0.96)"
  },
  tatvaGlow: {
    position: "absolute",
    left: "-10%",
    top: "18%",
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.14
  },
  tatvaVeil: {
    position: "absolute",
    left: "6%",
    right: "6%",
    bottom: "14%",
    height: 190,
    borderRadius: 28,
    opacity: 0.12
  },
  wrap: { flex: 1, justifyContent: "flex-end", padding: 14, paddingBottom: 16 },
  floatCard: {
    overflow: "hidden",
    borderWidth: 1.1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.14)"
  },
  cardAura: { ...StyleSheet.absoluteFillObject, opacity: 0.18 },
  h: { fontSize: 24, fontWeight: "900" },
  route: { fontSize: 15.5, fontWeight: "900", textAlign: "center", marginTop: 8 },
  p: { color: "#F7EBCB", textAlign: "center", marginTop: 8, marginBottom: 14, fontSize: 11.5, lineHeight: 17 },
  btn: {
    overflow: "hidden",
    alignSelf: "stretch",
    borderWidth: 1.1,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)"
  },
  btnAura: { ...StyleSheet.absoluteFillObject, opacity: 0.22 },
  t: { fontSize: 15, fontWeight: "900" }
});
