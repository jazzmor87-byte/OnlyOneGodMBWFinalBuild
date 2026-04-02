import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { CommonActions } from "@react-navigation/native";

const BG = require("../assets/mbw_luxscreens/subscription_main.png");

export default function Subscription({ navigation, route }) {
  const role = route?.params?.role || "USER";
  const accessPath = route?.params?.accessPath || "MATCH_RIGHT_MATCH";

  const accessTitle =
    accessPath === "MASTER_OF_COINS" ? "MASTER OF COINS" :
    role === "MBW" ? "MBW REALM ACCESS" :
    "MATCH THE RIGHT MATCH";

  const accessDesc =
    accessPath === "MASTER_OF_COINS"
      ? "COIN EXPLORER • SEEKER • KEEPER • TRADER"
      : role === "MBW"
      ? "ENTER AS MBW AND CONTINUE TO THE REALM"
      : "DATE ON RIGHT DATE WITH RIGHT DATE";

  const nextName =
    accessPath === "MASTER_OF_COINS" ? "MasterOfCoinsMain" :
    role === "MBW" ? "RealmMainLux" :
    "Main_Activity";

  const nextLabel =
    accessPath === "MASTER_OF_COINS" ? "ENTER MASTER OF COINS" :
    role === "MBW" ? "ENTER MBW REALM" :
    "ENTER MBW HOME";

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.wrap}>
        <View style={s.card}>
          <Text style={s.h}>{role} ACCESS</Text>
          <Text style={s.route}>{accessTitle}</Text>
          <Text style={s.p}>{accessDesc}</Text>
          <TouchableOpacity
            style={s.btn}
            onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: nextName, params: { role, accessPath } }] }))}
            activeOpacity={0.9}
          >
            <Text style={s.t}>{nextLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.10)" },
  wrap: { flex: 1, justifyContent: "flex-end", padding: 14, paddingBottom: 16 },
  card: { borderWidth: 1.1, borderColor: "rgba(212,175,55,0.88)", borderRadius: 18, paddingVertical: 12, paddingHorizontal: 14, alignItems: "center", backgroundColor: "rgba(0,0,0,0.18)" },
  h: { color: "#FAE8B8", fontSize: 24, fontWeight: "900" },
  route: { color: "#FAE8B8", fontSize: 15.5, fontWeight: "900", textAlign: "center", marginTop: 8 },
  p: { color: "#F7EBCB", textAlign: "center", marginTop: 8, marginBottom: 14, fontSize: 11.8, lineHeight: 18 },
  btn: { alignSelf: "stretch", borderWidth: 1.1, borderColor: "rgba(212,175,55,0.84)", borderRadius: 16, paddingVertical: 13, alignItems: "center", backgroundColor: "rgba(0,0,0,0.10)" },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" }
});
