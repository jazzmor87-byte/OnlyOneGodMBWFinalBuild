import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput, ScrollView, Animated } from "react-native";
import { CommonActions } from "@react-navigation/native";
import useTatvaScreen from "../../hooks/useTatvaScreen";

const BG = require("../../assets/mbw_luxscreens/login_main.png");

export default function LoginLux({ navigation, route }) {
  const accessPath = route?.params?.accessPath || "MATCH_RIGHT_MATCH";
  const accessLabel = accessPath === "MASTER_OF_COINS" ? "BECOME MASTER OF COINS" : "MATCH THE RIGHT MATCH";
  const { visual, panelFloatStyle, textFloatStyle, buttonFloatStyle } = useTatvaScreen("LoginLux");

  const goNext = () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Subscription", params: { accessPath } }] }));

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <Animated.View style={[s.floatCard, panelFloatStyle, { borderColor: visual.edge }]}>
          <View style={[s.cardAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
          <Animated.Text style={[s.h, { color: visual.text }, textFloatStyle]}>LOGIN</Animated.Text>
          <Animated.Text style={[s.p, textFloatStyle]}>Enter through {accessLabel}.</Animated.Text>

          <View style={s.form}>
            <TextInput style={[s.input, { borderColor: visual.edge, color: visual.text }]} placeholder="EMAIL" placeholderTextColor="#E9D7A6" keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={[s.input, { borderColor: visual.edge, color: visual.text }]} placeholder="PASSWORD" placeholderTextColor="#E9D7A6" secureTextEntry />
          </View>

          <View style={s.socialRow}>
            <Animated.View style={[s.socialWrap, buttonFloatStyle]}>
              <TouchableOpacity style={[s.socialBtn, { borderColor: visual.edge }]} onPress={goNext} activeOpacity={0.9}>
                <View style={[s.btnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
                <Animated.Text style={[s.socialText, { color: visual.text }, textFloatStyle]}>GOOGLE</Animated.Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[s.socialWrap, buttonFloatStyle]}>
              <TouchableOpacity style={[s.socialBtn, { borderColor: visual.edge }]} onPress={goNext} activeOpacity={0.9}>
                <View style={[s.btnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
                <Animated.Text style={[s.socialText, { color: visual.text }, textFloatStyle]}>FACEBOOK</Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Animated.View style={[s.fullWrap, buttonFloatStyle]}>
            <TouchableOpacity style={[s.btn, { borderColor: visual.edge }]} onPress={goNext} activeOpacity={0.9}>
              <View style={[s.btnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
              <Animated.Text style={[s.t, { color: visual.text }, textFloatStyle]}>CONTINUE</Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={() => navigation.navigate("SignupLux", { accessPath })} activeOpacity={0.9}>
            <Animated.Text style={[s.switchText, { color: visual.text }, textFloatStyle]}>NEW HERE? SIGN UP</Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.14)" },
  wrap: { flexGrow: 1, justifyContent: "flex-end", padding: 14, paddingBottom: 16 },
  floatCard: {
    overflow: "hidden",
    borderWidth: 1.1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(0,0,0,0.16)"
  },
  cardAura: { ...StyleSheet.absoluteFillObject, opacity: 0.18 },
  h: { fontSize: 24, fontWeight: "900", textAlign: "center" },
  p: { color: "#F7EBCB", textAlign: "center", marginTop: 8, marginBottom: 14, fontSize: 12.5, lineHeight: 18 },
  form: { gap: 10, marginBottom: 12 },
  input: {
    borderWidth: 1.1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(0,0,0,0.14)",
    fontSize: 13,
    fontWeight: "700"
  },
  socialRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  socialWrap: { flex: 1 },
  socialBtn: {
    overflow: "hidden",
    borderWidth: 1.1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.12)"
  },
  socialText: { fontSize: 12.5, fontWeight: "900" },
  fullWrap: { marginBottom: 10 },
  btn: {
    overflow: "hidden",
    borderWidth: 1.1,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)"
  },
  btnAura: { ...StyleSheet.absoluteFillObject, opacity: 0.22 },
  t: { fontSize: 15, fontWeight: "900" },
  switchText: { fontSize: 12.5, fontWeight: "900", textAlign: "center", marginTop: 2 }
});
