import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Easing } from "react-native";
import useTatvaScreen from "../../hooks/useTatvaScreen";

const BG = require("../../assets/mbw_luxscreens/path_selection.png");

function SmallActionRow({ onLogin, onSignup, buttonStyle, textStyle, visual }) {
  return (
    <View style={s.row}>
      <Animated.View style={[s.smallBtnWrap, buttonStyle]}>
        <TouchableOpacity style={[s.smallBtn, { borderColor: visual.edge }]} onPress={onLogin} activeOpacity={0.9}>
          <View style={[s.smallBtnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
          <Animated.Text style={[s.smallBtnText, { color: visual.text }, textStyle]}>LOGIN</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[s.smallBtnWrap, buttonStyle]}>
        <TouchableOpacity style={[s.smallBtn, { borderColor: visual.edge }]} onPress={onSignup} activeOpacity={0.9}>
          <View style={[s.smallBtnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
          <Animated.Text style={[s.smallBtnText, { color: visual.text }, textStyle]}>SIGNUP</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function FloatRoute({ title, desc, onLogin, onSignup, panelStyle, textStyle, buttonStyle, visual }) {
  return (
    <Animated.View style={[s.floatRoute, panelStyle, { borderColor: visual.edge }]}>
      <View style={[s.routeVeil, { backgroundColor: visual.veil }]} pointerEvents="none" />
      <Animated.Text style={[s.routeTitle, { color: visual.text }, textStyle]}>{title}</Animated.Text>
      <Animated.Text style={[s.routeDesc, textStyle]}>{desc}</Animated.Text>
      <SmallActionRow onLogin={onLogin} onSignup={onSignup} buttonStyle={buttonStyle} textStyle={textStyle} visual={visual} />
    </Animated.View>
  );
}

export default function PathSelectionScreen({ navigation }) {
  const { visual, panelFloatStyle, textFloatStyle, buttonFloatStyle } = useTatvaScreen("PathSelectionScreen");
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

  const fireY = drift.interpolate({ inputRange: [0, 1], outputRange: [6, -8] });
  const airX = drift.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] });
  const waterY = drift.interpolate({ inputRange: [0, 1], outputRange: [8, -6] });
  const earthY = drift.interpolate({ inputRange: [0, 1], outputRange: [4, -4] });
  const spaceScale = drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />

      <View style={s.fx} pointerEvents="none">
        <Animated.View style={[s.fireGlow, { transform: [{ translateY: fireY }] }]} />
        <Animated.View style={[s.airMist, { transform: [{ translateX: airX }] }]} />
        <Animated.View style={[s.waterGlow, { transform: [{ translateY: waterY }] }]} />
        <Animated.View style={[s.earthVeil, { transform: [{ translateY: earthY }] }]} />
        <Animated.View style={[s.spaceGlow, { transform: [{ scale: spaceScale }] }]} />
        <Animated.View style={[s.tatvaGlow, panelFloatStyle, { backgroundColor: visual.glow }]} />
        <Animated.View style={[s.tatvaVeil, textFloatStyle, { backgroundColor: visual.veil }]} />
      </View>

      <View style={s.bottomArea}>
        <FloatRoute
          title="MATCH THE RIGHT MATCH"
          desc="DATE ON RIGHT DATE WITH RIGHT DATE"
          onLogin={() => navigation.navigate("LoginLux", { accessPath: "MATCH_RIGHT_MATCH" })}
          onSignup={() => navigation.navigate("SignupLux", { accessPath: "MATCH_RIGHT_MATCH" })}
          panelStyle={panelFloatStyle}
          textStyle={textFloatStyle}
          buttonStyle={buttonFloatStyle}
          visual={visual}
        />

        <FloatRoute
          title="BECOME MASTER OF COINS"
          desc="ENTERTAINMENT ZONE GAMES TRAVEL ACROSS WORLD WITH LEAST MONEY STRATEGY AND STAY WITH MOST KIND PEOPLE IN THE WORLD WHO PROMOTES HUMANITY"
          onLogin={() => navigation.navigate("LoginLux", { accessPath: "MASTER_OF_COINS" })}
          onSignup={() => navigation.navigate("SignupLux", { accessPath: "MASTER_OF_COINS" })}
          panelStyle={panelFloatStyle}
          textStyle={textFloatStyle}
          buttonStyle={buttonFloatStyle}
          visual={visual}
        />
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.08)" },

  fx: { ...StyleSheet.absoluteFillObject },
  fireGlow: {
    position: "absolute",
    left: "2%",
    top: "10%",
    width: 110,
    height: 110,
    borderRadius: 55,
    opacity: 0.12,
    backgroundColor: "rgba(255,108,44,0.95)"
  },
  airMist: {
    position: "absolute",
    left: "16%",
    right: "16%",
    top: "17%",
    height: 58,
    borderRadius: 29,
    opacity: 0.10,
    backgroundColor: "rgba(245,237,215,0.95)"
  },
  waterGlow: {
    position: "absolute",
    right: "4%",
    top: "22%",
    width: 124,
    height: 96,
    borderRadius: 48,
    opacity: 0.11,
    backgroundColor: "rgba(77,137,198,0.92)"
  },
  earthVeil: {
    position: "absolute",
    left: "10%",
    right: "10%",
    bottom: "24%",
    height: 150,
    borderRadius: 28,
    opacity: 0.09,
    backgroundColor: "rgba(133,95,48,0.92)"
  },
  spaceGlow: {
    position: "absolute",
    right: "-10%",
    top: "6%",
    width: 210,
    height: 210,
    borderRadius: 105,
    opacity: 0.10,
    backgroundColor: "rgba(84,54,128,0.96)"
  },
  tatvaGlow: {
    position: "absolute",
    right: "-8%",
    top: "18%",
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.2
  },
  tatvaVeil: {
    position: "absolute",
    left: "6%",
    right: "6%",
    bottom: "16%",
    height: 170,
    borderRadius: 28,
    opacity: 0.14
  },

  bottomArea: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  floatRoute: {
    overflow: "hidden",
    borderWidth: 1.1,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.14)",
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  routeVeil: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.14
  },
  routeTitle: { fontSize: 15.5, fontWeight: "900", textAlign: "center" },
  routeDesc: { color: "#F7EBCB", fontSize: 11, textAlign: "center", marginTop: 5, lineHeight: 15 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  smallBtnWrap: { flex: 1 },
  smallBtn: {
    overflow: "hidden",
    borderWidth: 1.1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.10)"
  },
  smallBtnAura: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1
  },
  smallBtnText: { fontSize: 13.5, fontWeight: "900" }
});
