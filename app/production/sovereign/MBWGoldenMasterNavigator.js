import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { mbwRouteAccess } from './MBWReleaseContracts';
import { useMBWGoldenMaster } from './MBWGoldenMasterStore';
import { AIPosterScreen, AccountControlScreen, CinematicIntroScreen, CommerceReceiptScreen, ConsentScreen, GameRoomScreen, GamesScreen, GateLockedScreen, GateOpenScreen, KamashastraScreen, LiveLoungeScreen, MainHubScreen, MasterOfCoinsScreen, MasterOfGamesScreen, MasterOfLifeScreen, MatchChatScreen, MatchmakingScreen, MensLoungeScreen, MerchandiseScreen, NearbyScreen, PathSelectionScreen, PrivacyScreen, ProfilePosterScreen, SafetyScreen, SeedProfileScreen, SettingsScreen, SubscriptionSignupScreen, TermsScreen, TravelBookingScreen, TravelLocalScreen, TravelOverseasScreen } from './MBWGoldenMasterScreens';
const Stack = createNativeStackNavigator();
function makeGuardedScreen(Component, routeName) {
  function MBWGuardedScreen(props) {
    const {
      state,
      dispatch
    } = useMBWGoldenMaster();
    const access = mbwRouteAccess(state, routeName);
    useEffect(() => {
      if (!access.allowed) {
        dispatch({
          type: 'ERROR',
          message: access.pathAllowed ? `TIER ${access.requiredTier} REQUIRED` : 'PATH ACCESS LOCKED'
        });
        props.navigation.replace('MainHub');
      }
    }, [access.allowed, access.pathAllowed, access.requiredTier, dispatch, props.navigation]);
    if (!access.allowed) return null;
    return <Component {...props} />;
  }
  MBWGuardedScreen.displayName = `MBWGuarded${routeName}`;
  return MBWGuardedScreen;
}
const ROUTES = [['CinematicIntro', CinematicIntroScreen], ['GateLocked', GateLockedScreen], ['GateOpen', GateOpenScreen], ['PathSelection', PathSelectionScreen], ['SubscriptionSignup', SubscriptionSignupScreen], ['MainHub', MainHubScreen], ['MasterOfLife', MasterOfLifeScreen], ['Matchmaking', MatchmakingScreen], ['Games', GamesScreen], ['MasterOfGames', MasterOfGamesScreen], ['MasterOfCoins', MasterOfCoinsScreen], ['TravelLocal', TravelLocalScreen], ['TravelOverseas', TravelOverseasScreen], ['Merchandise', MerchandiseScreen], ['Kamashastra', KamashastraScreen], ['LiveLounge', LiveLoungeScreen], ['MensLounge', MensLoungeScreen], ['Nearby', NearbyScreen], ['AIPoster', AIPosterScreen], ['Settings', SettingsScreen], ['ProfilePoster', ProfilePosterScreen], ['MatchChat', MatchChatScreen], ['GameRoom', GameRoomScreen], ['TravelBooking', TravelBookingScreen], ['CommerceReceipt', CommerceReceiptScreen], ['Privacy', PrivacyScreen], ['Terms', TermsScreen], ['Safety', SafetyScreen], ['AccountControl', AccountControlScreen], ['SeedProfile', SeedProfileScreen], ['Consent', ConsentScreen]];
const GUARDED_ROUTES = ROUTES.map(([name, component]) => [name, makeGuardedScreen(component, name)]);
export default function MBWGoldenMasterNavigator() {
  return <Stack.Navigator initialRouteName="CinematicIntro" screenOptions={{
    headerShown: false,
    animation: 'fade',
    gestureEnabled: true
  }}>
      {GUARDED_ROUTES.map(([name, component]) => <Stack.Screen key={name} name={name} component={component} />)}
    </Stack.Navigator>;
}
export const MBW_GOLDEN_MASTER_NAV_ROUTE_COUNT = ROUTES.length;
