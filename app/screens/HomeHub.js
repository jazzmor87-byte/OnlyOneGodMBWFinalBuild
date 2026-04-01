import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useTatvaScreen from "../hooks/useTatvaScreen";

const BG = require("../assets/mbw_luxscreens/main_hub.png");

const ITEMS = [
  { key: "match", label: "MATCH", icon: "◈", routes: ["MatchmakingScreen", "MatchmakingHome"], pos: "tl", mx: 4, my: -6 },
  { key: "realm", label: "REALM", icon: "♛", routes: ["RealmHome", "MBWHome"], pos: "tr", mx: -4, my: -6 },
  { key: "lounge", label: "LOUNGE", icon: "◉", routes: ["LiveLoungeScreen", "LoungeHome"], pos: "ml", mx: 5, my: -4 },
  { key: "coins", label: "COINS", icon: "✦", routes: ["MasterOfCoinsMain", "CoinExplorerHall"], pos: "mr", mx: -5, my: -4 },
  { key: "travel", label: "TRAVEL", icon: "✈", routes: ["TravelScreen", "NomadCircuitMain"], pos: "bl", mx: 4, my: 4 },
  { key: "merch", label: "MERCH", icon: "⌘", routes: ["MerchandiseScreen", "MerchHome"], pos: "brm", mx: -4, my: 4 },
  { key: "games", label: "GAMES", icon: "♟", routes: ["GamesScreen", "GamesHubScreen"], pos: "bll", mx: 3, my: 5 },
  { key: "profile", label: "PROFILE", icon: "◌", routes: ["Profile", "UserProfile"], pos: "brr", mx: -3, my: 5 },
];

function collectRouteNames(state, out = new Set()) {
  if (!state) return out;
  if (Array.isArray(state.routeNames)) state.routeNames.forEach((x) => out.add(x));
  if (Array.isArray(state.routes)) {
    state.routes.forEach((r) => {
      if (r?.name) out.add(r.name);
      if (r?.state) collectRouteNames(r.state, out);
    });
  }
  return out;
}

function resolveRoute(navigation, candidates = []) {
  const names = collectRouteNames(navigation?.getState?.());
  for (const c of candidates) {
    if (names.has(c)) return c;
  }
  return candidates[0] || null;
}

function PentagramChip({ item, onPress, visual, style, textFloatStyle, drift }) {
  const dx = drift.interpolate({ inputRange: [0, 1], outputRange: [item.mx, -item.mx] });
  const dy = drift.interpolate({ inputRange: [0, 1], outputRange: [item.my, -item.my] });

  return (
    <Animated.View style={[styles.chipWrap, style, { transform: [{ translateX: dx }, { translateY: dy }] }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.chipBox, { borderColor: visual.edge }]}>
        <View style={[styles.chipAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
        <View style={styles.starFrame}>
          <View style={[styles.starLine, styles.starTopLeft, { backgroundColor: visual.edge }]} />
          <View style={[styles.starLine, styles.starTopRight, { backgroundColor: visual.edge }]} />
          <View style={[styles.starLine, styles.starMidLeft, { backgroundColor: visual.edge }]} />
          <View style={[styles.starLine, styles.starMidRight, { backgroundColor: visual.edge }]} />
          <View style={[styles.starLine, styles.starBottom, { backgroundColor: visual.edge }]} />
        </View>
        <View style={[styles.iconHalo, { borderColor: visual.edge, backgroundColor: "rgba(0,0,0,0.18)" }]}>
          <Animated.Text style={[styles.iconText, { color: visual.text }, textFloatStyle]}>{item.icon}</Animated.Text>
        </View>
        <Animated.Text style={[styles.chipLabel, { color: visual.text }, textFloatStyle]}>{item.label}</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeHub() {
  const navigation = useNavigation();
  const { visual, panelFloatStyle, textFloatStyle } = useTatvaScreen("HomeHub");
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

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  const starFloat = drift.interpolate({ inputRange: [0, 1], outputRange: [5, -5] });
  const glowPulse = drift.interpolate({ inputRange: [0, 1], outputRange: [0.10, 0.18] });

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.titleWrap, panelFloatStyle]}>
            <Text style={[styles.title, { color: visual.text }]}>MBW HOME</Text>
          </Animated.View>

          <View style={styles.fx} pointerEvents="none">
            <Animated.View style={[styles.centerGlow, { backgroundColor: visual.glow, opacity: glowPulse }]} />
            <Animated.View style={[styles.centerVeil, { backgroundColor: visual.veil }]} />
            <Animated.View style={[styles.corePentagram, { transform: [{ translateY: starFloat }] }]}>
              <View style={[styles.pentLine, styles.p1, { backgroundColor: visual.edge }]} />
              <View style={[styles.pentLine, styles.p2, { backgroundColor: visual.edge }]} />
              <View style={[styles.pentLine, styles.p3, { backgroundColor: visual.edge }]} />
              <View style={[styles.pentLine, styles.p4, { backgroundColor: visual.edge }]} />
              <View style={[styles.pentLine, styles.p5, { backgroundColor: visual.edge }]} />
            </Animated.View>
          </View>

          {ITEMS.map((item) => (
            <PentagramChip
              key={item.key}
              item={item}
              onPress={() => go(item.routes)}
              visual={visual}
              style={styles[item.pos]}
              textFloatStyle={textFloatStyle}
              drift={drift}
            />
          ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.08)" },
  titleWrap: {
    position: "absolute",
    top: 18,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 3
  },
  title: { fontSize: 24, fontWeight: "900", letterSpacing: 0.8 },
  fx: { ...StyleSheet.absoluteFillObject },
  centerGlow: {
    position: "absolute",
    left: "24%",
    right: "24%",
    top: "22%",
    height: "28%",
    borderRadius: 140
  },
  centerVeil: {
    position: "absolute",
    left: "12%",
    right: "12%",
    top: "19%",
    bottom: "14%",
    borderRadius: 40,
    opacity: 0.08
  },
  corePentagram: {
    position: "absolute",
    left: "14%",
    right: "14%",
    top: "17%",
    bottom: "14%",
    opacity: 0.22
  },
  pentLine: {
    position: "absolute",
    height: 1.15,
    borderRadius: 1.2
  },
  p1: { width: "56%", top: "16%", left: "22%", transform: [{ rotate: "-37deg" }] },
  p2: { width: "56%", top: "16%", right: "22%", transform: [{ rotate: "37deg" }] },
  p3: { width: "74%", top: "44%", left: "12%", transform: [{ rotate: "18deg" }] },
  p4: { width: "74%", top: "44%", right: "12%", transform: [{ rotate: "-18deg" }] },
  p5: { width: "44%", bottom: "20%", left: "28%" },

  chipWrap: {
    position: "absolute",
    width: 98,
    height: 126,
    zIndex: 4
  },
  chipBox: {
    flex: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.12)",
    paddingTop: 10,
    paddingBottom: 10
  },
  chipAura: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  starFrame: { ...StyleSheet.absoluteFillObject, opacity: 0.28 },
  starLine: { position: "absolute", height: 1.1, borderRadius: 1 },
  starTopLeft: { width: 38, top: 22, left: 16, transform: [{ rotate: "-36deg" }] },
  starTopRight: { width: 38, top: 22, right: 16, transform: [{ rotate: "36deg" }] },
  starMidLeft: { width: 42, top: 56, left: 10, transform: [{ rotate: "18deg" }] },
  starMidRight: { width: 42, top: 56, right: 10, transform: [{ rotate: "-18deg" }] },
  starBottom: { width: 52, bottom: 30, left: 23 },
  iconHalo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  iconText: { fontSize: 22, fontWeight: "900" },
  chipLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 0.6 },

  tl: { top: 40, left: 18 },
  tr: { top: 40, right: 18 },
  ml: { top: "35%", left: 18, marginTop: -58 },
  mr: { top: "35%", right: 18, marginTop: -58 },
  bl: { top: "63%", left: 18, marginTop: -58 },
  brm: { top: "63%", right: 18, marginTop: -58 },
  bll: { bottom: 18, left: 18 },
  brr: { bottom: 18, right: 18 }
});
