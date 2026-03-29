import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { seedUsers } from "./SeedUsers.generated";

const HUB_ROUTES = ["AllScreensHub", "ArtMain", "ArtMainLux", "BorderCrossingsScreen", "ChallengesScreen", "CoinExplorerHall", "CoinKeeperHall", "CoinMarket", "CoinSeekerHall", "CoinTrade", "CoinTraderHall", "CoinVault", "CoinsMain", "CoinsMainLux", "DesiredSignalsScreen", "GamesHubScreen", "GamesMain", "GamesMainLux", "GamesScreen", "GateCinematic", "GateLockedScreen", "GateOpenAfterUnlock", "GateOpenCinematic", "GateScreen", "HomeHub", "HomeScreen", "HostCircleScreen", "JourneyCompanionScreen", "KamaHome", "KamaLessons", "KamaQuiz", "KamashastraScreen", "LiveChamberScreen", "LiveLoungeLux", "LiveLoungeScreen", "Live_lounge", "LocalTrailsScreen", "LockedScreen", "Login", "LoginLux", "LoungeGoLive", "LoungeHome", "LoungeMain", "LoungePulseScreen", "LoungeStories", "LudoArena", "LudoBoardScreen", "LudoLobbyScreen", "LudoResultScreen", "MBWHome", "MBW_CoinOracleScreen_Poster_02", "Main_Activity", "MasterOfCoinsMain", "MatchDetailLux", "MatchExtraLux", "MatchFoundLux", "MatchIntelligenceScreen", "MatchmakingFilters", "MatchmakingHome", "MatchmakingMain", "MatchmakingMainLux", "MatchmakingResult", "MatchmakingScreen", "MerchCheckout", "MerchHome", "MerchMain", "MerchMainLux", "MerchProduct", "MerchandiseScreen", "MintStoriesScreen", "NomadCircuitMain", "PathSelectionLux", "PathSelectionScreen", "PrivateChatLux", "Profile", "ProfileCrownScreen", "ProfileHome", "ProfileMain", "ProfileMainLux", "ProfileSecurity", "ProfileSettings", "RealmHome", "RealmMain", "RealmMainLux", "RealmPrivilegesScreen", "SafeMeetAtlasScreen", "Safe_meet_atlas", "SeepArena", "SeepLobbyScreen", "SeepRoundResultScreen", "SeepScreen", "SeepTableScreen", "Signup", "SignupLux", "StayCircleScreen", "Subscription", "TravelInbox", "TravelLedgerScreen", "TravelLocalAdventure", "TravelMain", "TravelOverseasHost", "TravelOverseasLux", "TravelScreen", "TributeLedgerScreen", "UserHome", "VaultReserveScreen", "_EntryStaticScreen", "_GateLuxury", "_Main3DFactory", "_PosterEngine", "_TruthPosterScreen", "account_suspended", "art_main", "auth_Login", "border_crossing", "coin_main", "gateCodes", "home_MBWHome", "host_circle", "login_main", "main_hub", "match_details", "match_extra", "match_found", "matchmaking_main", "mb's_world_entry", "members_near_you", "merch_main", "path_selection", "private_chat", "profile_main", "realm_main_alt", "signup_main", "subscription_main", "travel", "travel_overseas", "wallet_main"];

export default function RecoveryHub({ navigation, route }) {
  const tier = route?.params?.tier || "PUBLIC";
  const preview = (seedUsers || []).slice(0, 8).map((x) => x.name).join(" • ");

  return (
    <View style={s.c}>
      <Text style={s.h}>MAIN HALL</Text>
      <Text style={s.sub}>{tier} ACCESS ACTIVE</Text>
      <Text style={s.seed} numberOfLines={2}>{preview || "Seed users loaded"}</Text>

      <FlatList
        data={HUB_ROUTES}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => navigation.navigate(item, { tier })}>
            <Text style={s.cardText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#000", paddingTop: 58 },
  h: { color: "#D4AF37", fontSize: 28, fontWeight: "900", textAlign: "center" },
  sub: { color: "#fff", textAlign: "center", marginTop: 6, fontWeight: "700" },
  seed: { color: "#c9b37b", textAlign: "center", marginTop: 10, marginHorizontal: 16 },
  list: { padding: 12 },
  card: { flex: 1, margin: 6, backgroundColor: "#141414", borderWidth: 1, borderColor: "#800000", borderRadius: 18, padding: 16, minHeight: 86, justifyContent: "center" },
  cardText: { color: "#fff", fontWeight: "800", textAlign: "center" }
});
