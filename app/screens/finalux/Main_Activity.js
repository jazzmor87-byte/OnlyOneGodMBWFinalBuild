import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
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

function EdgeButton({ icon, label, onPress, align="left" }) {
  return (
    <TouchableOpacity style={[s.edgeBtn, align === "right" ? s.edgeBtnRight : s.edgeBtnLeft]} onPress={onPress} activeOpacity={0.88}>
      <View style={s.iconWrap}>
        <MaterialCommunityIcons name={icon} size={22} color="#E8C56A" />
      </View>
      <Text style={s.edgeLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Main_Activity() {
  const navigation = useNavigation();

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  const left = [
    { icon: "cards-playing-outline", label: "MATCH", routes: ["MatchmakingMainLux","MatchmakingMain","MatchmakingHome","MatchmakingResult","MatchmakingScreen"] },
    { icon: "glass-cocktail", label: "LOUNGE", routes: ["LiveLoungeLux","LoungeMain","LoungeHome","LiveLoungeScreen","LoungeStories"] },
    { icon: "airplane", label: "TRAVEL", routes: ["TravelOverseasLux","TravelMain","TravelScreen","TravelOverseasHost","TravelLocalAdventure"] },
    { icon: "chess-king", label: "GAMES", routes: ["GamesMainLux","GamesMain","GamesHubScreen","GamesScreen","LudoArena"] },
  ];

  const right = [
    { icon: "crown-outline", label: "REALM", routes: ["RealmMainLux","RealmMain","MBWHome","RealmHome","home_MBWHome"] },
    { icon: "coin", label: "COINS", routes: ["CoinsMainLux","CoinsMain","MasterOfCoinsMain","CoinExplorerHall","CoinMarket"] },
    { icon: "shopping-outline", label: "MERCH", routes: ["MerchMainLux","MerchMain","MerchHome","MerchandiseScreen","MerchCheckout"] },
    { icon: "account-outline", label: "PROFILE", routes: ["ProfileMainLux","ProfileMain","ProfileHome","Profile","ProfileSettings"] },
  ];

  return (
    <ImageBackground source={require("../../assets/mbw_luxscreens/main_hub.png")} style={s.bg} resizeMode="cover">
      <SafeAreaView style={s.safe}>
        <View style={s.scrim} />
        <View style={s.shell}>
          <View style={s.colLeft}>
            {left.map((item) => (
              <EdgeButton key={item.label} icon={item.icon} label={item.label} align="left" onPress={() => go(item.routes)} />
            ))}
          </View>

          <View style={s.centerSpace}>
            <Text style={s.title}>MBW HOME</Text>
          </View>

          <View style={s.colRight}>
            {right.map((item) => (
              <EdgeButton key={item.label} icon={item.icon} label={item.label} align="right" onPress={() => go(item.routes)} />
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
  edgeBtn: {
    width: 74,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.10)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.72)",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 4
  },
  edgeBtnLeft: { marginLeft: 2 },
  edgeBtnRight: { marginRight: 2 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.22)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.55)"
  },
  edgeLabel: {
    marginTop: 6,
    color: "#F7E7BB",
    fontSize: 10.5,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5
  }
});
