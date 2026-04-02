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
  return candidates[0] || null;
}

const LEFT = [
  { icon: "cards-playing-outline", label: "MATCH", routes: ["MatchmakingMainLux","MatchmakingMain","MatchmakingHome","MatchmakingResult","MatchmakingScreen"], ax: -5, ay: -8 },
  { icon: "glass-cocktail", label: "LOUNGE", routes: ["LiveLoungeLux","LoungeMain","LoungeHome","LiveLoungeScreen","LoungeStories"], ax: -7, ay: -2 },
  { icon: "airplane", label: "TRAVEL", routes: ["TravelOverseasLux","TravelMain","TravelScreen","TravelOverseasHost","TravelLocalAdventure"], ax: -6, ay: 5 },
  { icon: "chess-king", label: "GAMES", routes: ["GamesMainLux","GamesMain","GamesHubScreen","GamesScreen","LudoArena"], ax: -4, ay: 8 },
];

const RIGHT = [
  { icon: "crown-outline", label: "REALM", routes: ["RealmMainLux","RealmMain","MBWHome","RealmHome","home_MBWHome"], ax: 5, ay: -8 },
  { icon: "help-circle-outline", label: "COINS", routes: ["CoinsMainLux","CoinsMain","MasterOfCoinsMain","CoinExplorerHall","CoinMarket"], ax: 7, ay: -2 },
  { icon: "shopping-outline", label: "MERCH", routes: ["MerchMainLux","MerchMain","MerchHome","MerchandiseScreen","MerchCheckout"], ax: 6, ay: 5 },
  { icon: "account-outline", label: "PROFILE", routes: ["ProfileMainLux","ProfileMain","ProfileHome","Profile","ProfileSettings"], ax: 4, ay: 8 },
];

function MovingBadge({ icon, label, onPress, align="left", drift, ax=0, ay=0 }) {
  const dx = drift.interpolate({ inputRange: [0, 1], outputRange: [ax, -ax] });
  const dy = drift.interpolate({ inputRange: [0, 1], outputRange: [ay, -ay] });

  return (
    <Animated.View style={{ transform: [{ translateX: dx }, { translateY: dy }] }}>
      <TouchableOpacity style={[s.edgeBtn, align === "right" ? s.edgeBtnRight : s.edgeBtnLeft]} onPress={onPress} activeOpacity={0.88}>
        <View style={s.badgeWrap}>
          <View style={[s.starLine, s.star1]} />
          <View style={[s.starLine, s.star2]} />
          <View style={[s.starLine, s.star3]} />
          <View style={[s.starLine, s.star4]} />
          <View style={[s.starLine, s.star5]} />
          <View style={s.iconWrap}>
            <MaterialCommunityIcons name={icon} size={22} color="#E8C56A" />
          </View>
        </View>
        <Text style={s.edgeLabel}>{label}</Text>
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
    <ImageBackground source={require("../../assets/mbw_luxscreens/main_hub.png")} style={s.bg} resizeMode="cover">
      <SafeAreaView style={s.safe}>
        <View style={s.scrim} />
        <View style={s.shell}>
          <View style={s.colLeft}>
            {LEFT.map((item) => (
              <MovingBadge key={item.label} icon={item.icon} label={item.label} align="left" drift={drift} ax={item.ax} ay={item.ay} onPress={() => go(item.routes)} />
            ))}
          </View>

          <View style={s.centerSpace}>
            <Text style={s.title}>MBW HOME</Text>
            <Animated.View style={[s.corePentagram, { transform: [{ translateY: starFloat }] }]} pointerEvents="none">
              <View style={[s.bigLine, s.bp1]} />
              <View style={[s.bigLine, s.bp2]} />
              <View style={[s.bigLine, s.bp3]} />
              <View style={[s.bigLine, s.bp4]} />
              <View style={[s.bigLine, s.bp5]} />
            </Animated.View>
          </View>

          <View style={s.colRight}>
            {RIGHT.map((item) => (
              <MovingBadge key={item.label} icon={item.icon} label={item.label} align="right" drift={drift} ax={item.ax} ay={item.ay} onPress={() => go(item.routes)} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.16)" },
  shell: { flex: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 14 },
  colLeft: { width: 88, justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 18 },
  colRight: { width: 88, justifyContent: "space-between", alignItems: "flex-end", paddingVertical: 18 },
  centerSpace: { flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: 10 },
  title: {
    color: "#E8C56A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.2,
    backgroundColor: "rgba(0,0,0,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  corePentagram: {
    position: "absolute",
    left: "6%",
    right: "6%",
    top: "22%",
    height: "42%",
    opacity: 0.48
  },
  bigLine: { position: "absolute", height: 1.8, borderRadius: 2, backgroundColor: "#D4AF37" },
  bp1: { width: "58%", top: "10%", left: "21%", transform: [{ rotate: "-35deg" }] },
  bp2: { width: "58%", top: "10%", right: "21%", transform: [{ rotate: "35deg" }] },
  bp3: { width: "74%", top: "40%", left: "10%", transform: [{ rotate: "18deg" }] },
  bp4: { width: "74%", top: "40%", right: "10%", transform: [{ rotate: "-18deg" }] },
  bp5: { width: "44%", bottom: "15%", left: "28%" },

  edgeBtn: { width: 74, alignItems: "center", justifyContent: "center", paddingVertical: 8, paddingHorizontal: 4 },
  edgeBtnLeft: { marginLeft: 2 },
  edgeBtnRight: { marginRight: 2 },
  badgeWrap: { width: 58, height: 58, alignItems: "center", justifyContent: "center" },
  starLine: { position: "absolute", height: 1.3, borderRadius: 2, backgroundColor: "rgba(212,175,55,0.86)" },
  star1: { width: 32, top: 9, left: 13, transform: [{ rotate: "-36deg" }] },
  star2: { width: 32, top: 9, right: 13, transform: [{ rotate: "36deg" }] },
  star3: { width: 36, top: 29, left: 8, transform: [{ rotate: "18deg" }] },
  star4: { width: 36, top: 29, right: 8, transform: [{ rotate: "-18deg" }] },
  star5: { width: 44, top: 42, left: 7 },
  iconWrap: {
    width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.22)", borderWidth: 1, borderColor: "rgba(212,175,55,0.55)"
  },
  edgeLabel: { marginTop: 4, color: "#F7E7BB", fontSize: 10.5, fontWeight: "900", textAlign: "center", letterSpacing: 0.5 }
});
