import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useTatvaScreen from "../hooks/useTatvaScreen";

const BG = require("../assets/mbw_luxscreens/main_hub.png");

const ITEMS = [
  { key: "match", label: "MATCH", icon: "◈", routes: ["MatchmakingScreen", "MatchmakingHome"], pos: "tl", mx: 6, my: -8 },
  { key: "realm", label: "REALM", icon: "♛", routes: ["RealmHome", "MBWHome"], pos: "tr", mx: -6, my: -8 },
  { key: "lounge", label: "LOUNGE", icon: "◉", routes: ["LiveLoungeScreen", "LoungeHome"], pos: "ml", mx: 7, my: -5 },
  { key: "coins", label: "COINS", icon: "✦", routes: ["MasterOfCoinsMain", "CoinExplorerHall"], pos: "mr", mx: -7, my: -5 },
  { key: "travel", label: "TRAVEL", icon: "✈", routes: ["TravelScreen", "NomadCircuitMain"], pos: "bl", mx: 6, my: 6 },
  { key: "merch", label: "MERCH", icon: "⌘", routes: ["MerchandiseScreen", "MerchHome"], pos: "brm", mx: -6, my: 6 },
  { key: "games", label: "GAMES", icon: "♟", routes: ["GamesScreen", "GamesHubScreen"], pos: "bll", mx: 5, my: 7 },
  { key: "profile", label: "PROFILE", icon: "◌", routes: ["Profile", "UserProfile"], pos: "brr", mx: -5, my: 7 }
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

function PentagramChip({ item, onPress, visual, style, drift }) {
  const dx = drift.interpolate({ inputRange: [0, 1], outputRange: [item.mx, -item.mx] });
  const dy = drift.interpolate({ inputRange: [0, 1], outputRange: [item.my, -item.my] });

  return (
    <Animated.View style={[styles.chipWrap, style, { transform: [{ translateX: dx }, { translateY: dy }] }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.touchArea}>
        <View style={[styles.badgeAura, { backgroundColor: visual.buttonAura }]} />
        <View style={styles.badgeCore}>
          <View style={styles.badgeStar}>
            <View style={[styles.starLine, styles.star1, { backgroundColor: visual.edge }]} />
            <View style={[styles.starLine, styles.star2, { backgroundColor: visual.edge }]} />
            <View style={[styles.starLine, styles.star3, { backgroundColor: visual.edge }]} />
            <View style={[styles.starLine, styles.star4, { backgroundColor: visual.edge }]} />
            <View style={[styles.starLine, styles.star5, { backgroundColor: visual.edge }]} />
          </View>
          <Text style={[styles.iconText, { color: visual.text }]}>{item.icon}</Text>
        </View>
        <Text style={[styles.chipLabel, { color: visual.text }]}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeHub() {
  const navigation = useNavigation();
  const { visual } = useTatvaScreen("HomeHub");
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

  const starFloat = drift.interpolate({ inputRange: [0, 1], outputRange: [8, -8] });

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.overlay}>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: visual.text }]}>MBW HOME</Text>
          </View>

          <View style={styles.fx} pointerEvents="none">
            <View style={[styles.centerGlow, { backgroundColor: visual.glow }]} />
            <Animated.View style={[styles.corePentagram, { transform: [{ translateY: starFloat }] }]}>
              <View style={[styles.bigLine, styles.bp1, { backgroundColor: visual.edge }]} />
              <View style={[styles.bigLine, styles.bp2, { backgroundColor: visual.edge }]} />
              <View style={[styles.bigLine, styles.bp3, { backgroundColor: visual.edge }]} />
              <View style={[styles.bigLine, styles.bp4, { backgroundColor: visual.edge }]} />
              <View style={[styles.bigLine, styles.bp5, { backgroundColor: visual.edge }]} />
            </Animated.View>
          </View>

          {ITEMS.map((item) => (
            <PentagramChip
              key={item.key}
              item={item}
              onPress={() => go(item.routes)}
              visual={visual}
              style={styles[item.pos]}
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
    left: "22%",
    right: "22%",
    top: "20%",
    height: "30%",
    borderRadius: 160,
    opacity: 0.22
  },
  corePentagram: {
    position: "absolute",
    left: "18%",
    right: "18%",
    top: "25%",
    height: "36%",
    opacity: 0.44
  },
  bigLine: {
    position: "absolute",
    height: 1.8,
    borderRadius: 2
  },
  bp1: { width: "58%", top: "9%", left: "21%", transform: [{ rotate: "-35deg" }] },
  bp2: { width: "58%", top: "9%", right: "21%", transform: [{ rotate: "35deg" }] },
  bp3: { width: "74%", top: "39%", left: "10%", transform: [{ rotate: "18deg" }] },
  bp4: { width: "74%", top: "39%", right: "10%", transform: [{ rotate: "-18deg" }] },
  bp5: { width: "44%", bottom: "15%", left: "28%" },

  chipWrap: {
    position: "absolute",
    width: 98,
    height: 126,
    zIndex: 4
  },
  touchArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "transparent"
  },
  badgeAura: {
    position: "absolute",
    top: 6,
    width: 78,
    height: 78,
    borderRadius: 39,
    opacity: 0.18
  },
  badgeCore: {
    width: 78,
    height: 82,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeStar: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95
  },
  starLine: {
    position: "absolute",
    height: 1.5,
    borderRadius: 2
  },
  star1: { width: 42, top: 12, left: 18, transform: [{ rotate: "-36deg" }] },
  star2: { width: 42, top: 12, right: 18, transform: [{ rotate: "36deg" }] },
  star3: { width: 46, top: 40, left: 13, transform: [{ rotate: "18deg" }] },
  star4: { width: 46, top: 40, right: 13, transform: [{ rotate: "-18deg" }] },
  star5: { width: 58, top: 58, left: 10 },
  iconText: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center"
  },
  chipLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
    textAlign: "center"
  },

  tl: { top: 40, left: 18 },
  tr: { top: 40, right: 18 },
  ml: { top: "35%", left: 18, marginTop: -58 },
  mr: { top: "35%", right: 18, marginTop: -58 },
  bl: { top: "63%", left: 18, marginTop: -58 },
  brm: { top: "63%", right: 18, marginTop: -58 },
  bll: { bottom: 18, left: 18 },
  brr: { bottom: 18, right: 18 }
});
