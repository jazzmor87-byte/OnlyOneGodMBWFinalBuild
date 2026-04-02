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
  { key: "MATCH", icon: "cards-playing-outline", routes: ["MatchmakingMainLux","MatchmakingMain","MatchmakingHome","MatchmakingResult","MatchmakingScreen"], pos: "top", dx: 0, dy: -8 },
  { key: "REALM", icon: "crown-outline", routes: ["RealmMainLux","RealmMain","MBWHome","RealmHome","home_MBWHome"], pos: "ur", dx: 7, dy: -6 },
  { key: "LOUNGE", icon: "glass-cocktail", routes: ["LiveLoungeLux","LoungeMain","LoungeHome","LiveLoungeScreen","LoungeStories"], pos: "ul", dx: -7, dy: -6 },
  { key: "COINS", icon: "help-circle-outline", routes: ["CoinsMainLux","CoinsMain","MasterOfCoinsMain","CoinExplorerHall","CoinMarket"], pos: "mr", dx: 8, dy: 0 },
  { key: "TRAVEL", icon: "airplane", routes: ["TravelOverseasLux","TravelMain","TravelScreen","TravelOverseasHost","TravelLocalAdventure"], pos: "ml", dx: -8, dy: 0 },
  { key: "MERCH", icon: "shopping-outline", routes: ["MerchMainLux","MerchMain","MerchHome","MerchandiseScreen","MerchCheckout"], pos: "lr", dx: 7, dy: 6 },
  { key: "GAMES", icon: "chess-king", routes: ["GamesMainLux","GamesMain","GamesHubScreen","GamesScreen","LudoArena"], pos: "ll", dx: -7, dy: 6 },
  { key: "PROFILE", icon: "account-outline", routes: ["ProfileMainLux","ProfileMain","ProfileHome","Profile","ProfileSettings"], pos: "bottom", dx: 0, dy: 8 }
];

const STARS = [
  { left: "18%", top: "12%", size: 3, dx: -4, dy: 2 },
  { left: "36%", top: "20%", size: 2, dx: 5, dy: -2 },
  { left: "62%", top: "18%", size: 3, dx: -3, dy: 3 },
  { left: "78%", top: "26%", size: 2, dx: 4, dy: -3 },
  { left: "24%", top: "48%", size: 2, dx: -4, dy: 3 },
  { left: "70%", top: "54%", size: 3, dx: 4, dy: -2 },
  { left: "42%", top: "66%", size: 2, dx: -2, dy: 4 },
  { left: "58%", top: "72%", size: 3, dx: 2, dy: -4 }
];

function SpaceOverlay({ phase }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <View style={s.spaceGlowA} />
      <View style={s.spaceGlowB} />
      {STARS.map((x, i) => {
        const tx = phase.interpolate({ inputRange: [0, 1], outputRange: [x.dx, -x.dx] });
        const ty = phase.interpolate({ inputRange: [0, 1], outputRange: [x.dy, -x.dy] });
        const op = phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.16, 0.42, 0.16] });
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
          <MaterialCommunityIcons name="pentagon-outline" size={68} color="rgba(232,197,106,0.96)" />
          <View style={s.iconCore}>
            <MaterialCommunityIcons name={item.icon} size={22} color="#E8C56A" />
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
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.14)" },

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
    left: "12%",
    top: "18%",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(98,72,142,0.06)"
  },
  spaceGlowB: {
    position: "absolute",
    right: "16%",
    bottom: "22%",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(182,146,222,0.05)"
  },
  star: {
    position: "absolute",
    borderRadius: 3,
    backgroundColor: "rgba(248,232,188,0.55)"
  },

  slot: {
    position: "absolute",
    width: 88,
    alignItems: "center",
    zIndex: 4
  },
  top: { top: 60, left: "50%", marginLeft: -44 },
  ul: { top: "19%", left: "12%" },
  ur: { top: "19%", right: "12%" },
  ml: { top: "38%", left: "6%" },
  mr: { top: "38%", right: "6%" },
  ll: { top: "60%", left: "12%" },
  lr: { top: "60%", right: "12%" },
  bottom: { bottom: 20, left: "50%", marginLeft: -44 },

  touch: { alignItems: "center" },
  halo: { width: 70, height: 70, alignItems: "center", justifyContent: "center" },
  iconCore: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.22)"
  },
  label: {
    marginTop: 3,
    color: "#F7E7BB",
    fontSize: 10.5,
    fontWeight: "900",
    letterSpacing: 0.45,
    textAlign: "center"
  }
});
