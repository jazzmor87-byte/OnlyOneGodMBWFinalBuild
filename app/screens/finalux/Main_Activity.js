import React, { useEffect, useRef } from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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
  return candidates.length ? candidates[0] : null;
}

const BUTTONS = [
  { key: "MATCH", icon: "cards-playing-outline", routes: ["MatchmakingMainLux","MatchmakingMain","MatchmakingHome","MatchmakingResult","MatchmakingScreen"], pos: "ct", dx: 0, dy: -9 },
  { key: "LOUNGE", icon: "glass-cocktail", routes: ["LiveLoungeLux","LoungeMain","LoungeHome","LiveLoungeScreen","LoungeStories"], pos: "ul", dx: -8, dy: -5 },
  { key: "REALM", icon: "crown-outline", routes: ["RealmMainLux","RealmMain","MBWHome","RealmHome","home_MBWHome"], pos: "ur", dx: 8, dy: -5 },
  { key: "TRAVEL", icon: "airplane", routes: ["TravelOverseasLux","TravelMain","TravelScreen","TravelOverseasHost","TravelLocalAdventure"], pos: "ml", dx: -9, dy: 0 },
  { key: "COINS", icon: "help-circle-outline", routes: ["CoinsMainLux","CoinsMain","MasterOfCoinsMain","CoinExplorerHall","CoinMarket"], pos: "mr", dx: 9, dy: 0 },
  { key: "GAMES", icon: "chess-king", routes: ["GamesMainLux","GamesMain","GamesHubScreen","GamesScreen","LudoArena"], pos: "ll", dx: -8, dy: 5 },
  { key: "MERCH", icon: "shopping-outline", routes: ["MerchMainLux","MerchMain","MerchHome","MerchandiseScreen","MerchCheckout"], pos: "lr", dx: 8, dy: 5 },
  { key: "PROFILE", icon: "account-outline", routes: ["ProfileMainLux","ProfileMain","ProfileHome","Profile","ProfileSettings"], pos: "cb", dx: 0, dy: 9 }
];

const STARS = [
  { left: "20%", top: "16%", size: 3, dx: -5, dy: 2 },
  { left: "34%", top: "22%", size: 2, dx: 4, dy: -3 },
  { left: "60%", top: "18%", size: 3, dx: -4, dy: 3 },
  { left: "74%", top: "28%", size: 2, dx: 5, dy: -4 },
  { left: "26%", top: "48%", size: 2, dx: -4, dy: 4 },
  { left: "68%", top: "54%", size: 3, dx: 4, dy: -2 },
  { left: "44%", top: "72%", size: 2, dx: -2, dy: 4 },
  { left: "56%", top: "76%", size: 3, dx: 2, dy: -4 }
];

function SpaceOverlay({ phase }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <View style={s.spaceGlowA} />
      <View style={s.spaceGlowB} />
      <View style={s.spaceRibbon} />
      {STARS.map((x, i) => {
        const tx = phase.interpolate({ inputRange: [0, 1], outputRange: [x.dx, -x.dx] });
        const ty = phase.interpolate({ inputRange: [0, 1], outputRange: [x.dy, -x.dy] });
        const op = phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.18, 0.50, 0.18] });
        return (
          <Animated.View
            key={i}
            style={[
              s.star,
              { left: x.left, top: x.top, width: x.size, height: x.size, opacity: op, transform: [{ translateX: tx }, { translateY: ty }] }
            ]}
          />
        );
      })}
    </View>
  );
}

function OrbitButton({ item, phase, onPress }) {
  const tx = phase.interpolate({ inputRange: [0, 1], outputRange: [item.dx, -item.dx] });
  const ty = phase.interpolate({ inputRange: [0, 1], outputRange: [item.dy, -item.dy] });

  return (
    <Animated.View style={[s.slot, s[item.pos], { transform: [{ translateX: tx }, { translateY: ty }] }]}>
      <TouchableOpacity style={s.touch} onPress={onPress} activeOpacity={0.9}>
        <View style={s.halo}>
          <MaterialCommunityIcons name="pentagon-outline" size={54} color="rgba(232,197,106,0.94)" />
          <View style={s.iconCore}>
            <MaterialCommunityIcons name={item.icon} size={18} color="#E8C56A" />
          </View>
        </View>
        <Text style={s.label}>{item.key}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Main_Activity() {
  const navigation = useNavigation();
  const phase = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(phase, { toValue: 1, duration: 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(phase, { toValue: 0, duration: 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase]);

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  return (
    <ImageBackground source={require("../../assets/mbw_luxscreens/main_hub.png")} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <SpaceOverlay phase={phase} />
      <SafeAreaView style={s.safe}>
        <View style={s.titleWrap}>
          <Text style={s.title}>MBW HOME</Text>
        </View>

        {BUTTONS.map((item) => (
          <OrbitButton key={item.key} item={item} phase={phase} onPress={() => go(item.routes)} />
        ))}
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.12)" },

  titleWrap: {
    position: "absolute",
    top: 14,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5
  },
  title: {
    color: "#E8C56A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.15,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6
  },

  spaceGlowA: {
    position: "absolute",
    left: "20%",
    top: "20%",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(108,62,88,0.08)"
  },
  spaceGlowB: {
    position: "absolute",
    right: "20%",
    bottom: "24%",
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "rgba(182,146,222,0.06)"
  },
  spaceRibbon: {
    position: "absolute",
    left: "34%",
    top: "12%",
    width: 120,
    height: 520,
    borderRadius: 60,
    backgroundColor: "rgba(126,82,118,0.05)"
  },
  star: {
    position: "absolute",
    borderRadius: 3,
    backgroundColor: "rgba(248,232,188,0.58)"
  },

  slot: {
    position: "absolute",
    width: 72,
    alignItems: "center",
    zIndex: 4
  },
  ct: { top: "14%", left: "50%", marginLeft: -36 },
  ul: { top: "28%", left: "22%" },
  ur: { top: "28%", right: "22%" },
  ml: { top: "46%", left: "16%" },
  mr: { top: "46%", right: "16%" },
  ll: { top: "64%", left: "24%" },
  lr: { top: "64%", right: "24%" },
  cb: { bottom: "8%", left: "50%", marginLeft: -36 },

  touch: { alignItems: "center" },
  halo: { width: 58, height: 58, alignItems: "center", justifyContent: "center" },
  iconCore: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.20)"
  },
  label: {
    marginTop: 2,
    color: "#F7E7BB",
    fontSize: 9.4,
    fontWeight: "900",
    letterSpacing: 0.35,
    textAlign: "center"
  }
});
