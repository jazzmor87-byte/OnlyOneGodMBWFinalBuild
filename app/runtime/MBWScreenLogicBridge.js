import { safeNavigate } from './MBWSafeNavigation';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const MBW_LOGIC_SUFFIXES = ['Action','Assets','Buttons','Entry','Live','Logic','Motion','Overview','PanchTatva','Poster','Proof','Result','Return','Seed','State','Vault'];

function cleanScreenName(screenName) {
  return String(screenName || 'MainHubScreen').replace(/^ScreenModule_\d+_/, '').replace(/Screen$/, '');
}

export function getMBWLogicSuffix(screenName) {
  const clean = cleanScreenName(screenName);
  for (const suffix of MBW_LOGIC_SUFFIXES) {
    if (clean.endsWith(suffix)) return suffix;
  }
  return 'Main';
}

export function getMBWLogicSection(screenName) {
  const clean = cleanScreenName(screenName);

  const sectionMap = {
    ArcadeHub: 'Games',
    PentagramArcade: 'Games',
    CinematicIntro: 'GateLocked',
    Dashboard: 'MainHub',
    MBWOSRuntimeCarry: 'MainHub',
    MBWRouteProof: 'MainHub',
    MatchFinalReincarnation: 'Matchmaking',
    CoinMain: 'MasterOfCoins',
    DesiredFiveReveal: 'MasterOfLife',
    MerchMain: 'Merchandise',
    MerchClaimStatus: 'Merchandise',
    PosterIdentityVault: 'ProfilePoster',
    SafetyCheckpoint: 'Settings',
    StayRequest: 'TravelLocal',
  };

  for (const key of Object.keys(sectionMap)) {
    if (clean.includes(key)) return sectionMap[key];
  }

  const sections = [
    'Games','GateLocked','GateOpen','Kamashastra','LiveLounge','MainHub',
    'MasterOfCoins','MasterOfLife','Matchmaking','MensLounge','Merchandise',
    'Nearby','PathSelection','ProfilePoster','Settings','SubscriptionSignup',
    'TravelLocal','TravelOverseas'
  ];

  for (const section of sections) {
    if (clean.includes(section)) return section;
  }

  return 'MainHub';
}

const MBWScreenLogicContext = createContext(null);

export function MBWScreenLogicProvider({ children, screenName, route, navigation, currentUser }) {
  const resolvedScreenName = screenName || route?.name || 'MainHubScreen';
  const suffix = getMBWLogicSuffix(resolvedScreenName);
  const section = getMBWLogicSection(resolvedScreenName);

  const [screenState, setScreenState] = useState({
    phase: 'ENTRY',
    ready: true,
    screenName: resolvedScreenName,
    section,
    suffix,
    actionCount: 0,
    lastAction: 'BOOT',
    result: null,
  });

  const recordAction = useCallback((actionName = 'ACTION') => {
    setScreenState(previous => ({
      ...previous,
      phase: actionName,
      ready: true,
      actionCount: (previous.actionCount || 0) + 1,
      lastAction: actionName,
      result: `${resolvedScreenName}:${actionName}:READY`,
    }));
  }, [resolvedScreenName]);

  const navigateTo = useCallback((targetName = 'MainHubScreen', params = {}) => {
    recordAction(`NAVIGATE_${targetName}`);
    if (navigation && typeof navigation.navigate === 'function') {
      safeNavigate(navigation, targetName, params);
    }
  }, [navigation, recordAction]);

  const returnHome = useCallback(() => {
    navigateTo('MainHubScreen', { from: resolvedScreenName, section, suffix });
  }, [navigateTo, resolvedScreenName, section, suffix]);

  const openResult = useCallback(() => {
    recordAction('RESULT');
  }, [recordAction]);

  const openProof = useCallback(() => {
    recordAction('PROOF');
  }, [recordAction]);

  const value = useMemo(() => ({
    logicDriven: true,
    logicReady: true,
    screenName: resolvedScreenName,
    section,
    suffix,
    screenState,
    setScreenState,
    recordAction,
    performAction: recordAction,
    navigateTo,
    returnHome,
    openResult,
    openProof,
    currentUser,
    routeParams: route?.params || {},
    actionHandlers: {
      onAction: () => recordAction('ACTION'),
      onEntry: () => recordAction('ENTRY'),
      onButtons: () => recordAction('BUTTONS'),
      onReturn: returnHome,
      onState: () => recordAction('STATE'),
      onResult: openResult,
      onProof: openProof,
    },
  }), [
    resolvedScreenName,
    section,
    suffix,
    screenState,
    setScreenState,
    recordAction,
    navigateTo,
    returnHome,
    openResult,
    openProof,
    currentUser,
    route,
  ]);

  return (
    <MBWScreenLogicContext.Provider value={value}>
      {children}
    </MBWScreenLogicContext.Provider>
  );
}

export function useMBWScreenLogic() {
  const value = useContext(MBWScreenLogicContext);
  if (value) return value;
  return {
    logicDriven: true,
    logicReady: true,
    screenName: 'MainHubScreen',
    section: 'MainHub',
    suffix: 'Main',
    screenState: { phase: 'SAFE', ready: true },
    performAction: () => {},
    recordAction: () => {},
    navigateTo: () => {},
    returnHome: () => {},
    openResult: () => {},
    openProof: () => {},
    actionHandlers: {},
  };
}

export default MBWScreenLogicProvider;

// MBW_24E26B_BRIDGE_VISUAL_OWNER_CONTRACT
export const MBW_SCREEN_LOGIC_BRIDGE_VISUAL_OWNER = 'MBWSingleAppVisualBody';
