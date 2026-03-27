import SeepArena from "./app/screens/SeepArena";
import LudoBoardScreen from "./app/screens/Games/LudoBoardScreen";
import Subscription from "./app/screens/Subscription";
import "react-native-gesture-handler";
import React from "react";
import MatchmakingMainLux from "./app/screens/finalux/MatchmakingMainLux";
import MatchDetailLux from "./app/screens/finalux/MatchDetailLux";
import MatchExtraLux from "./app/screens/finalux/MatchExtraLux";
import RealmMainLux from "./app/screens/finalux/RealmMainLux";
import LoginLux from "./app/screens/finalux/LoginLux";
import PathSelectionLux from "./app/screens/finalux/PathSelectionLux";
import SignupLux from "./app/screens/finalux/SignupLux";
import MatchFoundLux from "./app/screens/finalux/MatchFoundLux";
import LiveLoungeLux from "./app/screens/finalux/LiveLoungeLux";
import TravelOverseasLux from "./app/screens/finalux/TravelOverseasLux";
import PrivateChatLux from "./app/screens/finalux/PrivateChatLux";
import ArtMainLux from "./app/screens/finalux/ArtMainLux";
import MerchMainLux from "./app/screens/finalux/MerchMainLux";
import GamesMainLux from "./app/screens/finalux/GamesMainLux";
import CoinsMainLux from "./app/screens/finalux/CoinsMainLux";
import ProfileMainLux from "./app/screens/finalux/ProfileMainLux";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GateOpenCinematic from "./app/screens/Gate/GateOpenCinematic";
import GateLockedScreen from "./app/screens/Gate/GateLockedScreen";
import GateOpenAfterUnlock from "./app/screens/Gate/GateOpenAfterUnlock";
import PathSelectionScreen from "./app/screens/Gate/PathSelectionScreen";
import HomeHub from "./app/screens/HomeHub";
import UserHome from "./app/screens/home/UserHome";
import MBWHome from "./app/screens/home/MBWHome";
import MatchmakingMain from "./app/screens/main3d/MatchmakingMain";
import RealmMain from "./app/screens/main3d/RealmMain";
import ArtMain from "./app/screens/main3d/ArtMain";
import MerchMain from "./app/screens/main3d/MerchMain";
import LoungeMain from "./app/screens/main3d/LoungeMain";
import GamesMain from "./app/screens/main3d/GamesMain";
import TravelMain from "./app/screens/main3d/TravelMain";
import ProfileMain from "./app/screens/main3d/ProfileMain";
import CoinsMain from "./app/screens/main3d/CoinsMain";
import { secondMamReport } from "./app/core/SecondMAM";
import BorderCrossingsScreen from "./app/screens/__compensation/BorderCrossingsScreen";
import CoinExplorerHall from "./app/screens/__compensation/CoinExplorerHall";
import CoinKeeperHall from "./app/screens/__compensation/CoinKeeperHall";
import CoinSeekerHall from "./app/screens/__compensation/CoinSeekerHall";
import CoinTraderHall from "./app/screens/__compensation/CoinTraderHall";
import DesiredSignalsScreen from "./app/screens/__compensation/DesiredSignalsScreen";
import HostCircleScreen from "./app/screens/__compensation/HostCircleScreen";
import JourneyCompanionScreen from "./app/screens/__compensation/JourneyCompanionScreen";
import LiveChamberScreen from "./app/screens/__compensation/LiveChamberScreen";
import LocalTrailsScreen from "./app/screens/__compensation/LocalTrailsScreen";
import LoungePulseScreen from "./app/screens/__compensation/LoungePulseScreen";
import MasterOfCoinsMain from "./app/screens/__compensation/MasterOfCoinsMain";
import MatchIntelligenceScreen from "./app/screens/__compensation/MatchIntelligenceScreen";
import MintStoriesScreen from "./app/screens/__compensation/MintStoriesScreen";
import NomadCircuitMain from "./app/screens/__compensation/NomadCircuitMain";
import ProfileCrownScreen from "./app/screens/__compensation/ProfileCrownScreen";
import RealmPrivilegesScreen from "./app/screens/__compensation/RealmPrivilegesScreen";
import SafeMeetAtlasScreen from "./app/screens/__compensation/SafeMeetAtlasScreen";
import StayCircleScreen from "./app/screens/__compensation/StayCircleScreen";
import TravelLedgerScreen from "./app/screens/__compensation/TravelLedgerScreen";
import TributeLedgerScreen from "./app/screens/__compensation/TributeLedgerScreen";
import VaultReserveScreen from "./app/screens/__compensation/VaultReserveScreen";
import ChemistryBoardScreen from "./app/_vault_expansion49_backup/ChemistryBoardScreen";
import CoinOracleScreen from "./app/_vault_expansion49_backup/CoinOracleScreen";
import CollectorRankScreen from "./app/_vault_expansion49_backup/CollectorRankScreen";
import ConciergeDeskScreen from "./app/_vault_expansion49_backup/ConciergeDeskScreen";
import CrownArchiveScreen from "./app/_vault_expansion49_backup/CrownArchiveScreen";
import DesireCompassScreen from "./app/_vault_expansion49_backup/DesireCompassScreen";
import HostVerificationScreen from "./app/_vault_expansion49_backup/HostVerificationScreen";
import JourneyMapScreen from "./app/_vault_expansion49_backup/JourneyMapScreen";
import LiveScheduleScreen from "./app/_vault_expansion49_backup/LiveScheduleScreen";
import LocalCircleScreen from "./app/_vault_expansion49_backup/LocalCircleScreen";
import LoungeRankingScreen from "./app/_vault_expansion49_backup/LoungeRankingScreen";
import LoungeStoriesScreen from "./app/_vault_expansion49_backup/LoungeStoriesScreen";
import MatchVaultScreen from "./app/_vault_expansion49_backup/MatchVaultScreen";
import MemberLedgerScreen from "./app/_vault_expansion49_backup/MemberLedgerScreen";
import MerchandiseVaultScreen from "./app/_vault_expansion49_backup/MerchandiseVaultScreen";
import PrivilegeVaultScreen from "./app/_vault_expansion49_backup/PrivilegeVaultScreen";
import RealmCouncilScreen from "./app/_vault_expansion49_backup/RealmCouncilScreen";
import RealmNewsScreen from "./app/_vault_expansion49_backup/RealmNewsScreen";
import StayRequestsScreen from "./app/_vault_expansion49_backup/StayRequestsScreen";
import TradeSignalsScreen from "./app/_vault_expansion49_backup/TradeSignalsScreen";
import TravelSafePassScreen from "./app/_vault_expansion49_backup/TravelSafePassScreen";
import VaultGalleryScreen from "./app/_vault_expansion49_backup/VaultGalleryScreen";
import ChallengesScreen from "./app/screens/ChallengesScreen";
import CoinMarket from "./app/screens/Coins/CoinMarket";
import CoinTrade from "./app/screens/Coins/CoinTrade";
import CoinVault from "./app/screens/Coins/CoinVault";
import GamesHubScreen from "./app/screens/Games/GamesHubScreen";
import GamesScreen from "./app/screens/GamesScreen";
import GateCinematic from "./app/screens/GateCinematic";
import GateScreen from "./app/screens/GateScreen";
import HomeScreen from "./app/screens/HomeScreen";
import KamaHome from "./app/screens/Kamashastra/KamaHome";
import KamaLessons from "./app/screens/Kamashastra/KamaLessons";
import KamaQuiz from "./app/screens/Kamashastra/KamaQuiz";
import KamashastraScreen from "./app/screens/KamashastraScreen";
import LiveLoungeScreen from "./app/screens/LiveLoungeScreen";
import LockedScreen from "./app/screens/Gate/GateLockedScreen";
import LoungeGoLive from "./app/screens/MensLounge/LoungeGoLive";
import LoungeHome from "./app/screens/MensLounge/LoungeHome";
import LudoLobbyScreen from "./app/screens/Games/LudoLobbyScreen";
import LudoResultScreen from "./app/screens/Games/LudoResultScreen";
import MatchmakingFilters from "./app/screens/Matchmaking/MatchmakingFilters";
import MatchmakingHome from "./app/screens/Matchmaking/MatchmakingHome";
import MatchmakingResult from "./app/screens/Matchmaking/MatchmakingResult";
import MatchmakingScreen from "./app/screens/MatchmakingScreen";
import MerchCheckout from "./app/screens/Merchandise/MerchCheckout";
import MerchHome from "./app/screens/Merchandise/MerchHome";
import MerchProduct from "./app/screens/Merchandise/MerchProduct";
import MerchandiseScreen from "./app/screens/MerchandiseScreen";
import ProfileHome from "./app/screens/Profile/ProfileHome";
import ProfileSecurity from "./app/screens/Profile/ProfileSecurity";
import ProfileSettings from "./app/screens/Profile/ProfileSettings";
import RealmHome from "./app/screens/RealmHome";
import SeepLobbyScreen from "./app/screens/Games/SeepLobbyScreen";
import SeepRoundResultScreen from "./app/screens/Games/SeepRoundResultScreen";
import SeepScreen from "./app/screens/SeepScreen";
import SeepTableScreen from "./app/screens/Games/SeepTableScreen";
import TravelInbox from "./app/screens/Travel/TravelInbox";
import TravelLocalAdventure from "./app/screens/Travel/TravelLocalAdventure";
import TravelOverseasHost from "./app/screens/Travel/TravelOverseasHost";
import TravelScreen from "./app/screens/TravelScreen";
import _GateLuxury from "./app/screens/Gate/_GateLuxury";
import _Main3DFactory from "./app/screens/main3d/_Main3DFactory";
import _PosterEngine from "./app/screens/finalux/_PosterEngine";
import Login from "./app/screens/auth/Login";
import Signup from "./app/screens/auth/Signup";

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

export default function AppNavigator() {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => secondMamReport("nav_ready", { route: navigationRef.getCurrentRoute()?.name || "UNKNOWN" })}
      onStateChange={() => secondMamReport("nav_state", { route: navigationRef.getCurrentRoute()?.name || "UNKNOWN" })}
    >
      <Stack.Navigator initialRouteName="GateCinematic" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GateOpenCinematic" component={GateOpenCinematic} />
        <Stack.Screen name="GateLockedScreen" component={GateLockedScreen} />
        <Stack.Screen name="GateOpenAfterUnlock" component={GateOpenAfterUnlock} />
        <Stack.Screen name="PathSelection" component={PathSelectionScreen} />
        <Stack.Screen name="Subscription" component={Subscription} />
        <Stack.Screen name="HomeHub" component={HomeHub} />
        <Stack.Screen name="UserHome" component={UserHome} />
        <Stack.Screen name="MBWHome" component={MBWHome} />
                                <Stack.Screen name="MBWorld" component={RealmMainLux} />
                <Stack.Screen name="ArtChamber" component={ArtMainLux} />
        <Stack.Screen name="Merchandise" component={MerchMainLux} />
        <Stack.Screen name="Travel" component={TravelOverseasLux} />
        <Stack.Screen name="Coins" component={CoinsMainLux} />
        <Stack.Screen name="GamesHub" component={GamesMainLux} />
                        <Stack.Screen name="Matchmaking" component={MatchmakingMainLux} />
                <Stack.Screen name="LiveLounge" component={LiveLoungeLux} />
        <Stack.Screen name="MerchMain" component={MerchMain} />
        <Stack.Screen name="FunMain" component={GamesMain} />
        <Stack.Screen name="TravelMain" component={TravelMain} />
        <Stack.Screen name="Profile" component={ProfileMainLux} />
        <Stack.Screen name="SeepArena" component={SeepArena} />
        <Stack.Screen name="LudoArena" component={LudoBoardScreen} />
                <Stack.Screen name="Login" component={LoginLux} />
        <Stack.Screen name="Signup" component={SignupLux} />
        <Stack.Screen name="MatchDetailLux" component={MatchDetailLux} />
        <Stack.Screen name="MatchExtraLux" component={MatchExtraLux} />
        <Stack.Screen name="MatchFoundLux" component={MatchFoundLux} />
        <Stack.Screen name="PrivateChatLux" component={PrivateChatLux} />

        <Stack.Screen name="BorderCrossingsScreen" component={BorderCrossingsScreen} />
        <Stack.Screen name="CoinExplorerHall" component={CoinExplorerHall} />
        <Stack.Screen name="CoinKeeperHall" component={CoinKeeperHall} />
        <Stack.Screen name="CoinSeekerHall" component={CoinSeekerHall} />
        <Stack.Screen name="CoinTraderHall" component={CoinTraderHall} />
        <Stack.Screen name="DesiredSignalsScreen" component={DesiredSignalsScreen} />
        <Stack.Screen name="HostCircleScreen" component={HostCircleScreen} />
        <Stack.Screen name="JourneyCompanionScreen" component={JourneyCompanionScreen} />
        <Stack.Screen name="LiveChamberScreen" component={LiveChamberScreen} />
        <Stack.Screen name="LocalTrailsScreen" component={LocalTrailsScreen} />
        <Stack.Screen name="LoungePulseScreen" component={LoungePulseScreen} />
        <Stack.Screen name="MasterOfCoinsMain" component={MasterOfCoinsMain} />
        <Stack.Screen name="MatchIntelligenceScreen" component={MatchIntelligenceScreen} />
        <Stack.Screen name="MintStoriesScreen" component={MintStoriesScreen} />
        <Stack.Screen name="NomadCircuitMain" component={NomadCircuitMain} />
        <Stack.Screen name="ProfileCrownScreen" component={ProfileCrownScreen} />
        <Stack.Screen name="RealmPrivilegesScreen" component={RealmPrivilegesScreen} />
        <Stack.Screen name="SafeMeetAtlasScreen" component={SafeMeetAtlasScreen} />
        <Stack.Screen name="StayCircleScreen" component={StayCircleScreen} />
        <Stack.Screen name="TravelLedgerScreen" component={TravelLedgerScreen} />
        <Stack.Screen name="TributeLedgerScreen" component={TributeLedgerScreen} />
        <Stack.Screen name="VaultReserveScreen" component={VaultReserveScreen} />
        <Stack.Screen name="ChemistryBoardScreen" component={ChemistryBoardScreen} />
        <Stack.Screen name="CoinOracleScreen" component={CoinOracleScreen} />
        <Stack.Screen name="CollectorRankScreen" component={CollectorRankScreen} />
        <Stack.Screen name="ConciergeDeskScreen" component={ConciergeDeskScreen} />
        <Stack.Screen name="CrownArchiveScreen" component={CrownArchiveScreen} />
        <Stack.Screen name="DesireCompassScreen" component={DesireCompassScreen} />
        <Stack.Screen name="HostVerificationScreen" component={HostVerificationScreen} />
        <Stack.Screen name="JourneyMapScreen" component={JourneyMapScreen} />
        <Stack.Screen name="LiveScheduleScreen" component={LiveScheduleScreen} />
        <Stack.Screen name="LocalCircleScreen" component={LocalCircleScreen} />
        <Stack.Screen name="LoungeRankingScreen" component={LoungeRankingScreen} />
        <Stack.Screen name="LoungeStoriesScreen" component={LoungeStoriesScreen} />
        <Stack.Screen name="MatchVaultScreen" component={MatchVaultScreen} />
        <Stack.Screen name="MemberLedgerScreen" component={MemberLedgerScreen} />
        <Stack.Screen name="MerchandiseVaultScreen" component={MerchandiseVaultScreen} />
        <Stack.Screen name="PrivilegeVaultScreen" component={PrivilegeVaultScreen} />
        <Stack.Screen name="RealmCouncilScreen" component={RealmCouncilScreen} />
        <Stack.Screen name="RealmNewsScreen" component={RealmNewsScreen} />
        <Stack.Screen name="StayRequestsScreen" component={StayRequestsScreen} />
        <Stack.Screen name="TradeSignalsScreen" component={TradeSignalsScreen} />
        <Stack.Screen name="TravelSafePassScreen" component={TravelSafePassScreen} />
        <Stack.Screen name="VaultGalleryScreen" component={VaultGalleryScreen} />
      <Stack.Screen name="MatchmakingHome" component={MatchmakingHome} />
<Stack.Screen name="MatchmakingFilters" component={MatchmakingFilters} />
<Stack.Screen name="MatchmakingResult" component={MatchmakingResult} />
<Stack.Screen name="LoungeHome" component={LoungeHome} />
<Stack.Screen name="LoungeGoLive" component={LoungeGoLive} />
<Stack.Screen name="LoungeStories" component={LiveLoungeLux} />

<Stack.Screen name="GateCinematic" component={GateCinematic} />

<Stack.Screen name="RealmHome" component={RealmHome} />

<Stack.Screen name="HomeScreen" component={HomeScreen} />

<Stack.Screen name="KamashastraScreen" component={KamashastraScreen} />

<Stack.Screen name="GamesScreen" component={GamesScreen} />

<Stack.Screen name="LiveLoungeScreen" component={LiveLoungeScreen} />

<Stack.Screen name="MatchmakingScreen" component={MatchmakingScreen} />

<Stack.Screen name="TravelScreen" component={TravelScreen} />

<Stack.Screen name="SeepScreen" component={SeepScreen} />

<Stack.Screen name="GateScreen" component={GateScreen} />

<Stack.Screen name="LockedScreen" component={LockedScreen} />

<Stack.Screen name="MerchandiseScreen" component={MerchandiseScreen} />

<Stack.Screen name="ChallengesScreen" component={ChallengesScreen} />

<Stack.Screen name="PathSelectionScreen" component={PathSelectionScreen} />

<Stack.Screen name="_GateLuxury" component={_GateLuxury} />

<Stack.Screen name="KamaHome" component={KamaHome} />

<Stack.Screen name="KamaLessons" component={KamaLessons} />

<Stack.Screen name="KamaQuiz" component={KamaQuiz} />

<Stack.Screen name="MerchHome" component={MerchHome} />

<Stack.Screen name="MerchProduct" component={MerchProduct} />

<Stack.Screen name="MerchCheckout" component={MerchCheckout} />

<Stack.Screen name="TravelLocalAdventure" component={TravelLocalAdventure} />

<Stack.Screen name="TravelOverseasHost" component={TravelOverseasHost} />

<Stack.Screen name="TravelInbox" component={TravelInbox} />

<Stack.Screen name="CoinVault" component={CoinVault} />

<Stack.Screen name="CoinTrade" component={CoinTrade} />

<Stack.Screen name="CoinMarket" component={CoinMarket} />

<Stack.Screen name="ProfileHome" component={ProfileHome} />

<Stack.Screen name="ProfileSettings" component={ProfileSettings} />

<Stack.Screen name="ProfileSecurity" component={ProfileSecurity} />

<Stack.Screen name="GamesHubScreen" component={GamesHubScreen} />

<Stack.Screen name="SeepLobbyScreen" component={SeepLobbyScreen} />

<Stack.Screen name="LudoLobbyScreen" component={LudoLobbyScreen} />

<Stack.Screen name="SeepTableScreen" component={SeepTableScreen} />

<Stack.Screen name="SeepRoundResultScreen" component={SeepRoundResultScreen} />

<Stack.Screen name="LudoBoardScreen" component={LudoBoardScreen} />

<Stack.Screen name="LudoResultScreen" component={LudoResultScreen} />

<Stack.Screen name="_Main3DFactory" component={_Main3DFactory} />

<Stack.Screen name="MatchmakingMain" component={MatchmakingMain} />

<Stack.Screen name="RealmMain" component={RealmMain} />

<Stack.Screen name="ArtMain" component={ArtMain} />

<Stack.Screen name="LoungeMain" component={LoungeMain} />

<Stack.Screen name="GamesMain" component={GamesMain} />

<Stack.Screen name="ProfileMain" component={ProfileMain} />

<Stack.Screen name="CoinsMain" component={CoinsMain} />

<Stack.Screen name="_PosterEngine" component={_PosterEngine} />

<Stack.Screen name="MatchmakingMainLux" component={MatchmakingMainLux} />

<Stack.Screen name="RealmMainLux" component={RealmMainLux} />

<Stack.Screen name="LoginLux" component={LoginLux} />

<Stack.Screen name="PathSelectionLux" component={PathSelectionLux} />

<Stack.Screen name="LiveLoungeLux" component={LiveLoungeLux} />

<Stack.Screen name="TravelOverseasLux" component={TravelOverseasLux} />

<Stack.Screen name="ArtMainLux" component={ArtMainLux} />

<Stack.Screen name="MerchMainLux" component={MerchMainLux} />

<Stack.Screen name="GamesMainLux" component={GamesMainLux} />

<Stack.Screen name="CoinsMainLux" component={CoinsMainLux} />

<Stack.Screen name="ProfileMainLux" component={ProfileMainLux} />

<Stack.Screen name="SignupLux" component={SignupLux} />
</Stack.Navigator>
    </NavigationContainer>
  );
}
