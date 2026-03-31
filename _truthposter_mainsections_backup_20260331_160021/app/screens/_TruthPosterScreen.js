import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPosterPoolForScreen, pickPosterForIndex } from "../../core/posterResolver.generated";
import useTatvaScreen from "../hooks/useTatvaScreen";

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

export default function TruthPosterScreen({
  title,
  screenPath,
  screenStem,
  primaryRoutes = [],
  secondaryRoutes = [],
  primaryLabel = "Continue",
  secondaryLabel = "Home",
  fallbackAsset,
}) {
  const navigation = useNavigation();
  const { visual, panelFloatStyle, textFloatStyle, buttonFloatStyle } = useTatvaScreen(screenStem || screenPath || title || "TruthPosterScreen");
  const __mbwPosterPool = getPosterPoolForScreen(screenPath, screenStem);
  const __mbwPickedPoster = pickPosterForIndex(__mbwPosterPool, 0) || fallbackAsset;

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  return (
    <ImageBackground source={__mbwPickedPoster} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.overlay}>
          <View style={styles.fx} pointerEvents="none">
            <Animated.View style={[styles.tatvaGlow, panelFloatStyle, { backgroundColor: visual.glow }]} />
            <Animated.View style={[styles.tatvaVeil, textFloatStyle, { backgroundColor: visual.veil }]} />
          </View>

          <Animated.View style={[styles.copy, panelFloatStyle, { borderColor: visual.edge }]}>
            <Animated.Text style={[styles.title, { color: visual.text }, textFloatStyle]}>{title}</Animated.Text>
          </Animated.View>

          <View style={styles.actions}>
            <Animated.View style={buttonFloatStyle}>
              <TouchableOpacity style={[styles.primaryBtn, { borderColor: visual.edge }]} onPress={() => go(primaryRoutes)} activeOpacity={0.9}>
                <View style={[styles.btnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
                <Animated.Text style={[styles.primaryText, { color: visual.text }, textFloatStyle]}>{primaryLabel}</Animated.Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={buttonFloatStyle}>
              <TouchableOpacity style={[styles.secondaryBtn, { borderColor: visual.edge }]} onPress={() => go(secondaryRoutes)} activeOpacity={0.9}>
                <View style={[styles.btnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
                <Animated.Text style={[styles.secondaryText, { color: visual.text }, textFloatStyle]}>{secondaryLabel}</Animated.Text>
              </TouchableOpacity>
            </Animated.View>
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
    bottom: "18%",
    height: 180,
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
  actions: { gap: 10 },
  primaryBtn: {
    overflow: "hidden",
    backgroundColor: "rgba(92,10,42,0.72)",
    borderWidth: 1.2,
    paddingVertical: 11,
    borderRadius: 14,
  },
  primaryText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryBtn: {
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.38)",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 14,
  },
  secondaryText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
  },
  btnAura: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
});