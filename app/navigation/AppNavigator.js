import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MBWRealCinematicIntro from '../screens/Entry/CinematicIntroScreen';
import MBWRealGateLocked from '../screens/Entry/GateLockedScreen';
import MBWRealGateOpen from '../screens/Entry/GateOpenScreen';
import MBWRealPathSelection from '../screens/Entry/PathSelectionScreen';
import MBWRealSubscriptionSignup from '../screens/Entry/SubscriptionSignupScreen';
import MBWRealMainHub from '../screens/MainHubScreen';
import MBWRealMasterOfLife from '../screens/Sections/MasterOfLifeScreen';
import MBWRealMatchmaking from '../screens/Sections/MatchmakingScreen';
import MBWRealGames from '../screens/Sections/GamesScreen';
import MBWRealMasterOfGames from '../screens/Sections/MasterOfGamesScreen';
import MBWRealMasterOfCoins from '../screens/Sections/MasterOfCoinsScreen';
import MBWRealTravelLocal from '../screens/Sections/TravelLocalScreen';
import MBWRealTravelOverseas from '../screens/Sections/TravelOverseasScreen';
import MBWRealMerchandise from '../screens/Sections/MerchandiseScreen';
import MBWRealKamashastra from '../screens/Sections/KamashastraScreen';
import MBWRealLiveLounge from '../screens/Sections/LiveLoungeScreen';
import MBWRealMensLounge from '../screens/Sections/MensLoungeScreen';
import MBWRealNearby from '../screens/Sections/NearbyScreen';
import MBWRealAIPoster from '../screens/Sections/AIPosterScreen';
import MBWRealSettings from '../screens/Sections/SettingsScreen';
import MBWRealMatchFinalReincarnation from '../screens/Sections/MatchFinalReincarnationScreen';
import MBWRealKamashastraResult from '../screens/Sections/KamashastraResultScreen';
import ProfilePosterScreen from '../screens/Sections/ProfilePosterVisualScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="CinematicIntro" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="CinematicIntro" component={MBWRealCinematicIntro} options={{ headerShown: false }} />
      <Stack.Screen name="GateLocked" component={MBWRealGateLocked} options={{ headerShown: false }} />
      <Stack.Screen name="GateOpen" component={MBWRealGateOpen} options={{ headerShown: false }} />
      <Stack.Screen name="PathSelection" component={MBWRealPathSelection} options={{ headerShown: false }} />
      <Stack.Screen name="SubscriptionSignup" component={MBWRealSubscriptionSignup} options={{ headerShown: false }} />
      <Stack.Screen name="MainHub" component={MBWRealMainHub} options={{ headerShown: false }} />
      <Stack.Screen name="MasterOfLife" component={MBWRealMasterOfLife} options={{ headerShown: false }} />
      <Stack.Screen name="Matchmaking" component={MBWRealMatchmaking} options={{ headerShown: false }} />
      <Stack.Screen name="Games" component={MBWRealGames} options={{ headerShown: false }} />
      <Stack.Screen name="MasterOfGames" component={MBWRealMasterOfGames} options={{ headerShown: false }} />
      <Stack.Screen name="MasterOfCoins" component={MBWRealMasterOfCoins} options={{ headerShown: false }} />
      <Stack.Screen name="TravelLocal" component={MBWRealTravelLocal} options={{ headerShown: false }} />
      <Stack.Screen name="TravelOverseas" component={MBWRealTravelOverseas} options={{ headerShown: false }} />
      <Stack.Screen name="Merchandise" component={MBWRealMerchandise} options={{ headerShown: false }} />
      <Stack.Screen name="Kamashastra" component={MBWRealKamashastra} options={{ headerShown: false }} />
      <Stack.Screen name="LiveLounge" component={MBWRealLiveLounge} options={{ headerShown: false }} />
      <Stack.Screen name="MensLounge" component={MBWRealMensLounge} options={{ headerShown: false }} />
      <Stack.Screen name="Nearby" component={MBWRealNearby} options={{ headerShown: false }} />
      <Stack.Screen name="AIPoster" component={MBWRealAIPoster} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={MBWRealSettings} options={{ headerShown: false }} />
<Stack.Screen name="ProfilePoster" component={ProfilePosterScreen} />
      </Stack.Navigator>
  );
}