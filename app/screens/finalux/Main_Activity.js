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
  { key: "MATCH", icon: "cards-playing-outline", routes: ["MatchmakingMainLux","MatchmakingMain","MatchmakingHome","MatchmakingResult","MatchmakingScreen"], pos: "tl", dx: -3, dy: -3 },
  { key: "REALM", icon: "crown-outline", routes: ["RealmMainLux","RealmMain","MBWHome","RealmHome","home_MBWHome"], pos: "tr", dx: 3, dy: -3 },
  { key: "LOUNGE", icon: "glass-cocktail", routes: ["LiveLoungeLux","LoungeMain","LoungeHome","LiveLoungeScreen","LoungeStories"], pos: "ml", dx: -3, dy: 0 },
  { key: "COINS", icon: "help-circle-outline", routes: ["MasterOfCoinsMain","CoinsMainLux","CoinsMain","CoinExplorerHall","CoinMarket"], pos: "mr", dx: 3, dy: 0 },
  { key: "TRAVEL", icon: "airplane", routes: ["TravelOverseasLux","TravelMain","TravelScreen","TravelOverseasHost","TravelLocalAdventure"], pos: "bl", dx: -3, dy: 2 },
  { key: "MERCH", icon: "shopping-outline", routes: ["MerchMainLux","MerchMain","MerchHome","MerchandiseScreen","MerchCheckout"], pos: "br", dx: 3, dy: 2 },
  { key: "GAMES", icon: "chess-king", routes: ["GamesMainLux","GamesMain","GamesHubScreen","GamesScreen","LudoArena"], pos: "bll", dx: -2, dy: 3 },
  { key: "PROFILE", icon: "account-outline", routes: ["ProfileMainLux","ProfileMain","ProfileHome","Profile","ProfileSettings"], pos: "brr", dx: 2, dy: 3 }
];

const STARS = [
  { left: "18%", top: "18%", size: 3, dx: -3, dy: 2 },
  { left: "34%", top: "22%", size: 2, dx: 3, dy: -2 },
  { left: "60%", top: "20%", size: 3, dx: -3, dy: 2 },
  { left: "74%", top: "26%", size: 2, dx: 3, dy: -2 },
  { left: "22%", top: "46%", size: 2, dx: -3, dy: 3 },
  { left: "70%", top: "50%", size: 3, dx: 3, dy: -2 },
  { left: "42%", top: "70%", size: 2, dx: -2, dy: 3 },
  { left: "58%", top: "74%", size: 3, dx: 2, dy: -3 }
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
          <MaterialCommunityIcons name="pentagon-outline" size={40} color="rgba(232,197,106,0.94)" />
          <View style={s.iconCore}>
            <MaterialCommunityIcons name={item.icon} size={14} color="#E8C56A" />
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
        Animated.timing(phase, { toValue: 1, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(phase, { toValue: 0, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
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
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.10)" },

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
    left: "24%",
    top: "22%",
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(108,48,58,0.08)"
  },
  spaceGlowB: {
    position: "absolute",
    right: "24%",
    bottom: "24%",
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(166,118,88,0.05)"
  },
  spaceRibbon: {
    position: "absolute",
    left: "38%",
    top: "18%",
    width: 88,
    height: 420,
    borderRadius: 44,
    backgroundColor: "rgba(120,62,70,0.05)"
  },
  star: {
    position: "absolute",
    borderRadius: 3,
    backgroundColor: "rgba(248,232,188,0.62)"
  },

  slot: {
    position: "absolute",
    width: 54,
    alignItems: "center",
    zIndex: 4
  },
  tl: { top: 66, left: 10 },
  tr: { top: 66, right: 10 },
  ml: { top: "34%", left: 10, marginTop: -40 },
  mr: { top: "34%", right: 10, marginTop: -40 },
  bl: { top: "58%", left: 10, marginTop: -40 },
  br: { top: "58%", right: 10, marginTop: -40 },
  bll: { bottom: 22, left: 10 },
  brr: { bottom: 22, right: 10 },

  touch: { alignItems: "center" },
  halo: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  iconCore: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.20)"
  },
  label: {
    marginTop: 2,
    color: "#F7E7BB",
    fontSize: 8.2,
    fontWeight: "900",
    letterSpacing: 0.25,
    textAlign: "center"
  }
});
