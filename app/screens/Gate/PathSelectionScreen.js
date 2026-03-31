import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated } from "react-native";
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

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />

      <View style={s.fx} pointerEvents="none">
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
    backgroundColor: "rgba(0,0,0,0.12)",
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
    backgroundColor: "rgba(0,0,0,0.08)"
  },
  smallBtnAura: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1
  },
  smallBtnText: { fontSize: 13.5, fontWeight: "900" }
});
