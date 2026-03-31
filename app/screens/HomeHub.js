import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useTatvaScreen from "../hooks/useTatvaScreen";

const BG = require("../assets/mbw_luxscreens/main_hub.png");

const ITEMS = [
  { key: "match", label: "MATCH", icon: "◈", routes: ["MatchmakingScreen", "MatchmakingHome"], pos: "tl" },
  { key: "realm", label: "REALM", icon: "♛", routes: ["RealmHome", "MBWHome"], pos: "tr" },
  { key: "lounge", label: "LOUNGE", icon: "◉", routes: ["LiveLoungeScreen", "LoungeHome"], pos: "ml" },
  { key: "coins", label: "COINS", icon: "✦", routes: ["MasterOfCoinsMain", "CoinExplorerHall"], pos: "mr" },
  { key: "travel", label: "TRAVEL", icon: "✈", routes: ["TravelScreen", "NomadCircuitMain"], pos: "bl" },
  { key: "merch", label: "MERCH", icon: "⌘", routes: ["MerchandiseScreen", "MerchHome"], pos: "brm" },
  { key: "games", label: "GAMES", icon: "♟", routes: ["GamesScreen", "GamesHubScreen"], pos: "bll" },
  { key: "profile", label: "PROFILE", icon: "◌", routes: ["Profile", "UserProfile"], pos: "brr" },
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

function PentagramChip({ label, icon, onPress, visual, style, floatStyle, textFloatStyle }) {
  return (
    <Animated.View style={[styles.chipWrap, style, floatStyle]}>
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
          <Animated.Text style={[styles.iconText, { color: visual.text }, textFloatStyle]}>{icon}</Animated.Text>
        </View>
        <Animated.Text style={[styles.chipLabel, { color: visual.text }, textFloatStyle]}>{label}</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeHub() {
  const navigation = useNavigation();
  const { visual, panelFloatStyle, textFloatStyle, buttonFloatStyle } = useTatvaScreen("HomeHub");

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.titleWrap, panelFloatStyle]}>
            <Text style={[styles.title, { color: visual.text }]}>MBW HOME</Text>
          </Animated.View>

          <View style={styles.fx} pointerEvents="none">
            <Animated.View style={[styles.centerGlow, panelFloatStyle, { backgroundColor: visual.glow }]} />
            <Animated.View style={[styles.centerVeil, textFloatStyle, { backgroundColor: visual.veil }]} />
          </View>

          {ITEMS.map((item) => (
            <PentagramChip
              key={item.key}
              label={item.label}
              icon={item.icon}
              onPress={() => go(item.routes)}
              visual={visual}
              style={styles[item.pos]}
              floatStyle={buttonFloatStyle}
              textFloatStyle={textFloatStyle}
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  titleWrap: {
    position: "absolute",
    top: 18,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  fx: { ...StyleSheet.absoluteFillObject },
  centerGlow: {
    position: "absolute",
    left: "26%",
    right: "26%",
    top: "22%",
    height: "28%",
    borderRadius: 140,
    opacity: 0.12,
  },
  centerVeil: {
    position: "absolute",
    left: "12%",
    right: "12%",
    top: "20%",
    bottom: "14%",
    borderRadius: 40,
    opacity: 0.07,
  },
  chipWrap: {
    position: "absolute",
    width: 98,
    height: 126,
    zIndex: 4,
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
    paddingBottom: 10,
  },
  chipAura: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  starFrame: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.28,
  },
  starLine: {
    position: "absolute",
    height: 1.1,
    borderRadius: 1,
  },
  starTopLeft: {
    width: 38,
    top: 22,
    left: 16,
    transform: [{ rotate: "-36deg" }],
  },
  starTopRight: {
    width: 38,
    top: 22,
    right: 16,
    transform: [{ rotate: "36deg" }],
  },
  starMidLeft: {
    width: 42,
    top: 56,
    left: 10,
    transform: [{ rotate: "18deg" }],
  },
  starMidRight: {
    width: 42,
    top: 56,
    right: 10,
    transform: [{ rotate: "-18deg" }],
  },
  starBottom: {
    width: 52,
    bottom: 30,
    left: 23,
  },
  iconHalo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconText: {
    fontSize: 22,
    fontWeight: "900",
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  tl: { top: 40, left: 18 },
  tr: { top: 40, right: 18 },
  ml: { top: "35%", left: 18, marginTop: -58 },
  mr: { top: "35%", right: 18, marginTop: -58 },
  bl: { top: "63%", left: 18, marginTop: -58 },
  brm: { top: "63%", right: 18, marginTop: -58 },
  bll: { bottom: 18, left: 18 },
  brr: { bottom: 18, right: 18 },
});