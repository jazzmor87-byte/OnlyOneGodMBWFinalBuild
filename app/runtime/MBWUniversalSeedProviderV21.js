/*
 * MBW UNIVERSAL SEED PROVIDER V2.1
 * Makes the recovered synthetic fixture available from the true app root.
 */
import React, { createContext, useContext, useMemo } from 'react';
import {
  MBW_EXACT_APK_SEED_V21,
  MBW_UNIVERSAL_SEED_USERS_V21,
  MBW_UNIVERSAL_SEED_INTENTS_V21,
  MBW_UNIVERSAL_MATCH_FLOW_V21,
  MBW_UNIVERSAL_VISIBLE_RULES_V21,
  getMBWUniversalSeedByIdV21,
  getMBWUniversalSeedByNameV21,
  getMBWUniversalSeedSnapshotV21,
} from './MBWUniversalSeedRegistryV21';

const MBWUniversalSeedContextV21 = createContext(null);

export function MBWUniversalSeedProviderV21({ children }) {
  const value = useMemo(
    () => ({
      exact: MBW_EXACT_APK_SEED_V21,
      users: MBW_UNIVERSAL_SEED_USERS_V21,
      intents: MBW_UNIVERSAL_SEED_INTENTS_V21,
      flow: MBW_UNIVERSAL_MATCH_FLOW_V21,
      visibleRules: MBW_UNIVERSAL_VISIBLE_RULES_V21,
      getById: getMBWUniversalSeedByIdV21,
      getByName: getMBWUniversalSeedByNameV21,
      snapshot: getMBWUniversalSeedSnapshotV21,
      syntheticFixture: true,
      privateData: false,
    }),
    [],
  );

  return React.createElement(
    MBWUniversalSeedContextV21.Provider,
    { value },
    children,
  );
}

export function useMBWUniversalSeedsV21() {
  const context = useContext(MBWUniversalSeedContextV21);
  if (!context) {
    throw new Error(
      'useMBWUniversalSeedsV21 must run inside MBWUniversalSeedProviderV21',
    );
  }
  return context;
}

export { MBWUniversalSeedContextV21 };
