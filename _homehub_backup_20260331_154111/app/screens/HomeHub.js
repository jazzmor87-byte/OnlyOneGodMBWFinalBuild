import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useTatvaScreen from "../hooks/useTatvaScreen";
import MBWSectionActionButton from "../components/MBWSectionActionButton";

const BG = require("../assets/mbw_luxscreens/main_hub.png");

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
          <View style={styles.fx} pointerEvents="none">
            <Animated.View style={[styles.tatvaGlow, panelFloatStyle, { backgroundColor: visual.glow }]} />
            <Animated.View style={[styles.tatvaVeil, textFloatStyle, { backgroundColor: visual.veil }]} />
          </View>

          <Animated.View style={[styles.copy, panelFloatStyle, { borderColor: visual.edge }]}>
            <Animated.Text style={[styles.title, { color: visual.text }, textFloatStyle]}>HOME HUB</Animated.Text>
            <Animated.Text style={[styles.subtitle, textFloatStyle]}>
              Enter the living core of MBW and choose your next path with clarity, luxury, and purpose.
            </Animated.Text>
          </Animated.View>

          <View style={styles.actions}>
            <MBWSectionActionButton
              title="MONEY BOYS WORLD"
              subtitle="Enter the inner MBW realm."
              badge="♛"
              onPress={() => go(["MBWHome"])}
              visual={visual}
              floatStyle={buttonFloatStyle}
              textStyle={textFloatStyle}
            />
            <MBWSectionActionButton
              title="REALM HOME"
              subtitle="Open the elevated home route."
              badge="✦"
              onPress={() => go(["RealmHome"])}
              visual={visual}
              floatStyle={buttonFloatStyle}
              textStyle={textFloatStyle}
            />
          </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 24,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  fx: { ...StyleSheet.absoluteFillObject },
  tatvaGlow: {
    position: "absolute",
    right: "-8%",
    top: "14%",
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.18,
  },
  tatvaVeil: {
    position: "absolute",
    left: "6%",
    right: "6%",
    bottom: "14%",
    height: 220,
    borderRadius: 28,
    opacity: 0.14,
  },
  copy: {
    backgroundColor: "rgba(0,0,0,0.26)",
    borderWidth: 1.1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#F7E8BD",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 19,
  },
  actions: { gap: 12 },
});
