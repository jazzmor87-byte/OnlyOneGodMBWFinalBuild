import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useTatvaScreen from "../../hooks/useTatvaScreen";

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
  const state = navigation?.getState?.();
  const names = collectRouteNames(state);
  for (const c of candidates) {
    if (names.has(c)) return c;
  }
  return candidates[0] || null;
}

export default function EntryStaticScreen({
  title,
  subtitle,
  asset,
  primaryLabel,
  primaryRoutes = [],
  secondaryLabel,
  secondaryRoutes = [],
}) {
  const navigation = useNavigation();
  const { visual, panelFloatStyle, textFloatStyle, buttonFloatStyle } = useTatvaScreen(title || "EntryStaticScreen");

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  return (
    <ImageBackground source={asset} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.overlay}>
          <View style={styles.fx} pointerEvents="none">
            <Animated.View style={[styles.tatvaGlow, panelFloatStyle, { backgroundColor: visual.glow }]} />
            <Animated.View style={[styles.tatvaVeil, textFloatStyle, { backgroundColor: visual.veil }]} />
          </View>

          <Animated.View style={[styles.copy, panelFloatStyle, { borderColor: visual.edge }]}>
            <Animated.Text style={[styles.title, { color: visual.text }, textFloatStyle]}>{title}</Animated.Text>
            {!!subtitle && <Animated.Text style={[styles.subtitle, textFloatStyle]}>{subtitle}</Animated.Text>}
          </Animated.View>

          <View style={styles.actions}>
            {!!primaryLabel && (
              <Animated.View style={buttonFloatStyle}>
                <TouchableOpacity style={[styles.primaryBtn, { borderColor: visual.edge }]} onPress={() => go(primaryRoutes)} activeOpacity={0.9}>
                  <View style={[styles.btnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
                  <Animated.Text style={[styles.primaryText, { color: visual.text }, textFloatStyle]}>{primaryLabel}</Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            {!!secondaryLabel && (
              <Animated.View style={buttonFloatStyle}>
                <TouchableOpacity style={[styles.secondaryBtn, { borderColor: visual.edge }]} onPress={() => go(secondaryRoutes)} activeOpacity={0.9}>
                  <View style={[styles.btnAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
                  <Animated.Text style={[styles.secondaryText, { color: visual.text }, textFloatStyle]}>{secondaryLabel}</Animated.Text>
                </TouchableOpacity>
              </Animated.View>
            )}
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    backgroundColor: "rgba(0,0,0,0.20)",
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
    height: 190,
    borderRadius: 28,
    opacity: 0.14,
  },
  copy: {
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.30)",
    borderWidth: 1.1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.4,
    textAlign: "center",
  },
  subtitle: {
    color: "#F7E8BD",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  actions: { gap: 12 },
  primaryBtn: {
    overflow: "hidden",
    backgroundColor: "rgba(120,0,38,0.82)",
    borderWidth: 1.4,
    paddingVertical: 12,
    borderRadius: 16,
  },
  primaryText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryBtn: {
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.42)",
    borderWidth: 1.1,
    paddingVertical: 11,
    borderRadius: 16,
  },
  secondaryText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
  },
  btnAura: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
});