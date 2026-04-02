import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput, ScrollView } from "react-native";
import { CommonActions } from "@react-navigation/native";

const BG = require("../../assets/mbw_luxscreens/signup_main.png");

export default function SignupLux({ navigation, route }) {
  const role = route?.params?.role || "USER";
  const accessPath = route?.params?.accessPath || "MATCH_RIGHT_MATCH";
  const accessLabel = accessPath === "MASTER_OF_COINS" ? "MASTER OF COINS" : role === "MBW" ? "MBW REALM ACCESS" : "MATCH THE RIGHT MATCH";
  const goNext = () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Subscription", params: { role, accessPath } }] }));

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
        <View style={s.card}>
          <Text style={s.h}>SIGN UP</Text>
          <Text style={s.p}>Create your {role} account through {accessLabel}.</Text>
          <View style={s.form}>
            <TextInput style={s.input} placeholder="FULL NAME" placeholderTextColor="#E9D7A6" />
            <TextInput style={s.input} placeholder="EMAIL" placeholderTextColor="#E9D7A6" keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={s.input} placeholder="PASSWORD" placeholderTextColor="#E9D7A6" secureTextEntry />
          </View>
          <View style={s.row}>
            <TouchableOpacity style={s.btnHalf} onPress={goNext} activeOpacity={0.9}><Text style={s.tSmall}>GOOGLE</Text></TouchableOpacity>
            <TouchableOpacity style={s.btnHalf} onPress={goNext} activeOpacity={0.9}><Text style={s.tSmall}>FACEBOOK</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={s.btn} onPress={goNext} activeOpacity={0.9}><Text style={s.t}>CREATE ACCOUNT</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("LoginLux", { role, accessPath })} activeOpacity={0.9}>
            <Text style={s.switchText}>ALREADY HAVE AN ACCOUNT? LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.14)" },
  wrap: { flexGrow: 1, justifyContent: "flex-end", padding: 14, paddingBottom: 16 },
  card: { borderWidth: 1.1, borderColor: "rgba(212,175,55,0.88)", borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "rgba(0,0,0,0.18)" },
  h: { color: "#FAE8B8", fontSize: 24, fontWeight: "900", textAlign: "center" },
  p: { color: "#F7EBCB", textAlign: "center", marginTop: 8, marginBottom: 14, fontSize: 12.5, lineHeight: 18 },
  form: { gap: 10, marginBottom: 12 },
  input: { borderWidth: 1.1, borderColor: "rgba(212,175,55,0.84)", borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "rgba(0,0,0,0.14)", fontSize: 13, fontWeight: "700", color: "#FAE8B8" },
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  btnHalf: { flex: 1, borderWidth: 1.1, borderColor: "rgba(212,175,55,0.84)", borderRadius: 16, paddingVertical: 12, alignItems: "center", backgroundColor: "rgba(0,0,0,0.12)" },
  btn: { borderWidth: 1.1, borderColor: "rgba(212,175,55,0.84)", borderRadius: 16, paddingVertical: 13, alignItems: "center", backgroundColor: "rgba(0,0,0,0.10)" },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" },
  tSmall: { color: "#FAE8B8", fontSize: 12.5, fontWeight: "900" },
  switchText: { color: "#FAE8B8", fontSize: 12.5, fontWeight: "900", textAlign: "center", marginTop: 10 }
});
