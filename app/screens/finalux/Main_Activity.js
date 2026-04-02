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
  { key: "MATCH", icon: "cards-playing-outline", routes: ["MatchmakingMainLux","MatchmakingMain","MatchmakingHome","MatchmakingResult","MatchmakingScreen"], pos: "tl", dx: -6, dy: -8 },
  { key: "REALM", icon: "crown-outline", routes: ["RealmMainLux","RealmMain","MBWHome","RealmHome","home_MBWHome"], pos: "tr", dx: 6, dy: -8 },
  { key: "LOUNGE", icon: "glass-cocktail", routes: ["LiveLoungeLux","LoungeMain","LoungeHome","LiveLoungeScreen","LoungeStories"], pos: "ml", dx: -8, dy: -2 },
  { key: "COINS", icon: "help-circle-outline", routes: ["CoinsMainLux","CoinsMain","MasterOfCoinsMain","CoinExplorerHall","CoinMarket"], pos: "mr", dx: 8, dy: -2 },
  { key: "TRAVEL", icon: "airplane", routes: ["TravelOverseasLux","TravelMain","TravelScreen","TravelOverseasHost","TravelLocalAdventure"], pos: "bl", dx: -7, dy: 5 },
  { key: "MERCH", icon: "shopping-outline", routes: ["MerchMainLux","MerchMain","MerchHome","MerchandiseScreen","MerchCheckout"], pos: "br", dx: 7, dy: 5 },
  { key: "GAMES", icon: "chess-king", routes: ["GamesMainLux","GamesMain","GamesHubScreen","GamesScreen","LudoArena"], pos: "bll", dx: -5, dy: 8 },
  { key: "PROFILE", icon: "account-outline", routes: ["ProfileMainLux","ProfileMain","ProfileHome","Profile","ProfileSettings"], pos: "brr", dx: 5, dy: 8 }
];

function OrbitButton({ item, drift, onPress }) {
  const tx = drift.interpolate({ inputRange: [0, 1], outputRange: [item.dx, -item.dx] });
  const ty = drift.interpolate({ inputRange: [0, 1], outputRange: [item.dy, -item.dy] });

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
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 3400, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  return (
    <ImageBackground source={require("../../assets/mbw_luxscreens/main_hub.png")} style={s.bg} resizeMode="cover">
      <SafeAreaView style={s.safe}>
        <View style={s.scrim} />
        <View style={s.titleWrap}>
          <Text style={s.title}>MBW HOME</Text>
        </View>

        {BUTTONS.map((item) => (
          <OrbitButton key={item.key} item={item} drift={drift} onPress={() => go(item.routes)} />
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

  slot: {
    position: "absolute",
    width: 88,
    alignItems: "center",
    zIndex: 4
  },
  tl: { top: 58, left: 8 },
  tr: { top: 58, right: 8 },
  ml: { top: "34%", left: 8, marginTop: -54 },
  mr: { top: "34%", right: 8, marginTop: -54 },
  bl: { top: "60%", left: 8, marginTop: -54 },
  br: { top: "60%", right: 8, marginTop: -54 },
  bll: { bottom: 18, left: 8 },
  brr: { bottom: 18, right: 8 },

  touch: { alignItems: "center" },
  halo: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center"
  },
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
