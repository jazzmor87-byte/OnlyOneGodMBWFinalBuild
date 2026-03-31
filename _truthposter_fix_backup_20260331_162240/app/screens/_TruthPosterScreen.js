import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPosterPoolForScreen, pickPosterForIndex } from "../../core/posterResolver.generated";
import useTatvaScreen from "../hooks/useTatvaScreen";

const MAIN_SECTION_STEMS = new Set([
  "MBWHome",
  "RealmHome",
  "LiveLoungeScreen",
  "MatchmakingScreen",
  "GamesScreen",
  "MerchandiseScreen",
  "TravelScreen",
  "Profile",
]);

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

function MainSectionChip({ label, icon, onPress, visual, floatStyle, textStyle, side }) {
  return (
    <Animated.View style={[styles.chipWrap, side === "right" ? styles.chipRight : styles.chipLeft, floatStyle]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.chipBox, { borderColor: visual.edge }]}>
        <View style={[styles.chipAura, { backgroundColor: visual.buttonAura }]} pointerEvents="none" />
        <View style={styles.starFrame}>
          <View style={[styles.starLine, styles.starTopLeft, { backgroundColor: visual.edge }]} />
          <View style={[styles.starLine, styles.starTopRight, { backgroundColor: visual.edge }]} />
          <View style={[styles.starLine, styles.starMidLeft, { backgroundColor: visual.edge }]} />
          <View style={[styles.starLine, styles.starMidRight, { backgroundColor: visual.edge }]} />
          <View style={[styles.starLine, styles.starBottom, { backgroundColor: visual.edge }]} />
        </View>
        <View style={[styles.iconHalo, { borderColor: visual.edge }]}>
          <Animated.Text style={[styles.iconText, { color: visual.text }, textStyle]}>{icon}</Animated.Text>
        </View>
        <Animated.Text style={[styles.chipLabel, { color: visual.text }, textStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
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
  const isMainSection = MAIN_SECTION_STEMS.has(screenStem);

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  if (isMainSection) {
    return (
      <ImageBackground source={__mbwPickedPoster} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <View style={styles.overlay}>
            <View style={styles.fx} pointerEvents="none">
              <Animated.View style={[styles.centerGlow, panelFloatStyle, { backgroundColor: visual.glow }]} />
              <Animated.View style={[styles.centerVeil, textFloatStyle, { backgroundColor: visual.veil }]} />
            </View>

            <Animated.View style={[styles.titleWrap, panelFloatStyle]}>
              <Text style={[styles.title, { color: visual.text }]}>{title}</Text>
            </Animated.View>

            <MainSectionChip
              label={primaryLabel}
              icon="✆"
              onPress={() => go(primaryRoutes)}
              visual={visual}
              floatStyle={buttonFloatStyle}
              textStyle={textFloatStyle}
              side="left"
            />
            <MainSectionChip
              label={secondaryLabel}
              icon="◄"
              onPress={() => go(secondaryRoutes)}
              visual={visual}
              floatStyle={buttonFloatStyle}
              textStyle={textFloatStyle}
              side="right"
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

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
    backgroundColor: "rgba(0,0,0,0.16)",
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
  titleWrap: {
    position: "absolute",
    top: 18,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 3,
  },

  chipWrap: {
    position: "absolute",
    width: 98,
    height: 126,
    bottom: 24,
    zIndex: 4,
  },
  chipLeft: { left: 18 },
  chipRight: { right: 18 },
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
    backgroundColor: "rgba(0,0,0,0.18)",
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
  secondaryText: {\n    textAlign: "center",\n    fontSize: 13,\n    fontWeight: "700",\n  },\n  btnAura: {\n    ...StyleSheet.absoluteFillObject,\n    opacity: 1,\n  },\n});