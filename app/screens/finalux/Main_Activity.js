import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

export default function Main_Activity() {
  const navigation = useNavigation();

  const sections = [
    { label: 'MATCHMAKING', routes: ['MatchmakingMainLux','MatchmakingMain','MatchmakingHome','MatchmakingResult','MatchmakingScreen'] },
    { label: "MONEY BOY'S WORLD", routes: ['RealmMainLux','RealmMain','MBWHome','RealmHome','home_MBWHome'] },
    { label: "MEN'S LOUNGE", routes: ['LiveLoungeLux','LoungeMain','LoungeHome','LiveLoungeScreen','LoungeStories'] },
    { label: 'TRAVEL', routes: ['TravelOverseasLux','TravelMain','TravelScreen','TravelOverseasHost','TravelLocalAdventure'] },
    { label: 'COINS', routes: ['CoinsMainLux','CoinsMain','MasterOfCoinsMain','CoinExplorerHall','CoinMarket'] },
    { label: 'MERCHANDISE', routes: ['MerchMainLux','MerchMain','MerchHome','MerchandiseScreen','MerchCheckout'] },
    { label: 'GAMES', routes: ['GamesMainLux','GamesMain','GamesHubScreen','GamesScreen','LudoArena'] },
    { label: 'PROFILE', routes: ['ProfileMainLux','ProfileMain','ProfileHome','Profile','ProfileSettings'] },
  ];

  const go = (routes) => {
    const target = resolveRoute(navigation, routes);
    if (target) navigation.navigate(target);
  };

  return (
    <ImageBackground source={require('../../assets/mbw_luxscreens/main_hub.png')} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <View style={styles.scrim} />
        <View style={styles.shell}>
          <View style={styles.header}>
            <Text style={styles.title}>MBW HOME</Text>
            <Text style={styles.subtitle}>Choose your next chamber.</Text>
          </View>

          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {sections.map((item) => (
              <TouchableOpacity key={item.label} style={styles.card} onPress={() => go(item.routes)} activeOpacity={0.9}>
                <Text style={styles.cardText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#050505' },
  safe: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.32)' },
  shell: { flex: 1, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 24, justifyContent: 'space-between' },
  header: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.45)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  title: { color: '#F4D88E', fontSize: 26, fontWeight: '900', textAlign: 'center', letterSpacing: 0.6 },
  subtitle: { color: '#F6E7C0', fontSize: 13, textAlign: 'center', marginTop: 6, opacity: 0.95 },
  list: { paddingTop: 22, paddingBottom: 8, gap: 12 },
  card: {
    backgroundColor: 'rgba(18,18,18,0.68)',
    borderWidth: 1.2,
    borderColor: '#D4AF37',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  cardText: { color: '#FAE8B8', textAlign: 'center', fontSize: 15, fontWeight: '800', letterSpacing: 0.4 },
});
