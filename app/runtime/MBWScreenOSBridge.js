// MBW_SCREEN_OS_BRIDGE_STYLE_KILLER_HEALED=TRUE
// MBW_USER_SEED_SAFE_FALLBACK_AUDITED=resolveMBWUserSeed
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import MBWScreenGuard from '../components/MBWScreenGuard';
import { getMBWVisualPolicyForScreen } from './MBWVisualAssetRegistry';
import { MBWUserPresenceProvider, useMBWUserPresence } from './MBWUserPresenceBridge';
import { MBWScreenLogicProvider, useMBWScreenLogic } from './MBWScreenLogicBridge';

function MBWInvisibleLogicSeal({ logic }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: -9999, top: -9999, width: 1, height: 1, overflow: 'hidden' }}>
      <Text>
        MBW_LOGIC_DRIVEN_ACTIVE {logic?.screenName} {logic?.section} {logic?.suffix} {logic?.screenState?.phase}
      </Text>
    </View>
  );
}

function MBWScreenOSBridgeInner({ screenName, ScreenComponent, route, navigation, ...props }) {
  const currentUser = useMBWUserPresence();
  const mbwScreenLogic = useMBWScreenLogic();

  const visualPolicy = useMemo(() => (
    getMBWVisualPolicyForScreen(screenName || route?.name || 'MainHubScreen')
  ), [screenName, route]);

  const resolvedScreenName = visualPolicy.screenName || screenName || route?.name || 'MainHubScreen';

  const injectedProps = {
    ...props,
    route,
    navigation,
    currentUser,
    userProfile: currentUser.userProfile,
    profile: currentUser.profile,
    auth: currentUser.auth,
    userId: currentUser.userId,
    uid: currentUser.uid,
    userSeed: currentUser.userSeed,
    membership: currentUser.membership,
    subscription: currentUser.subscription,
    tier: currentUser.tier,
    verified: currentUser.verified,
    phoneVerified: currentUser.phoneVerified,
    mbwUserPresence: currentUser,
    mbwVisualPolicy: visualPolicy,
    mbwScreenLogic,
    logicDriven: true,
    logicReady: true,
    screenState: mbwScreenLogic.screenState,
    setScreenState: mbwScreenLogic.setScreenState,
    performAction: mbwScreenLogic.performAction,
    recordAction: mbwScreenLogic.recordAction,
    navigateTo: mbwScreenLogic.navigateTo,
    returnHome: mbwScreenLogic.returnHome,
    openResult: mbwScreenLogic.openResult,
    openProof: mbwScreenLogic.openProof,
    actionHandlers: mbwScreenLogic.actionHandlers,
    onAction: mbwScreenLogic.actionHandlers?.onAction,
    onEntry: mbwScreenLogic.actionHandlers?.onEntry,
    onButtons: mbwScreenLogic.actionHandlers?.onButtons,
    onReturn: mbwScreenLogic.actionHandlers?.onReturn,
    onState: mbwScreenLogic.actionHandlers?.onState,
    onResult: mbwScreenLogic.actionHandlers?.onResult,
    onProof: mbwScreenLogic.actionHandlers?.onProof,
  };

  return (
    <MBWScreenGuard screenName={resolvedScreenName} posterSource={visualPolicy.posterSource}>
      <ScreenComponent {...injectedProps} />
      <MBWInvisibleLogicSeal logic={mbwScreenLogic} />
    </MBWScreenGuard>
  );
}

export function MBWScreenOSBridge({ screenName, ScreenComponent, route, navigation, ...props }) {
  const resolvedScreenName = screenName || route?.name || 'MainHubScreen';

  return (
    <MBWUserPresenceProvider screenName={resolvedScreenName} route={route}>
      <MBWScreenLogicProvider screenName={resolvedScreenName} route={route} navigation={navigation}>
        <MBWScreenOSBridgeInner
          screenName={resolvedScreenName}
          ScreenComponent={ScreenComponent}
          route={route}
          navigation={navigation}
          {...props}
        />
      </MBWScreenLogicProvider>
    </MBWUserPresenceProvider>
  );
}

export default MBWScreenOSBridge;
