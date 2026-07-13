// MBW_USER_SEED_SAFE_FALLBACK_AUDITED=resolveMBWUserSeed
import React, { createContext, useContext, useMemo, useState } from 'react';

export const MBW_USER_PRESENCE_SEED = Object.freeze({
  id: 'MBW_LOCAL_SEED_USER',
  uid: 'MBW_LOCAL_SEED_USER',
  userId: 'MBW_LOCAL_SEED_USER',
  userSeed: 'MBW_USER_SEED_ACTIVE',
  auth: {
    status: 'seed-active',
    provider: 'MBW_LOCAL_RUNTIME',
    phoneVerified: false,
    verified: false,
  },
  userProfile: {
    displayName: 'MBW USER',
    handle: 'MBW_LOCAL_USER',
    role: 'USER',
    realm: 'MEN_BEHIND_WALL',
  },
  profile: {
    displayName: 'MBW USER',
    handle: 'MBW_LOCAL_USER',
    role: 'USER',
  },
  member: {
    membership: 'MBW_SEED_MEMBERSHIP',
    tier: 'ACE_SEED',
    subscription: 'FINAL_SEED',
    verified: false,
  },
  membership: 'MBW_SEED_MEMBERSHIP',
  subscription: 'FINAL_SEED',
  tier: 'ACE_SEED',
  verified: false,
  phone: null,
  phoneVerified: false,
});

export const UserContext = createContext(MBW_USER_PRESENCE_SEED);
export const MBWUserPresenceContext = UserContext;

export function MBWUserPresenceProvider({ children, screenName, route }) {
  const [currentUser] = useState(MBW_USER_PRESENCE_SEED);

  const value = useMemo(() => ({
    ...currentUser,
    currentUser,
    userProfile: currentUser.userProfile,
    profile: currentUser.profile,
    auth: currentUser.auth,
    member: currentUser.member,
    membership: currentUser.membership,
    subscription: currentUser.subscription,
    tier: currentUser.tier,
    verified: currentUser.verified,
    phoneVerified: currentUser.phoneVerified,
    userId: currentUser.userId,
    uid: currentUser.uid,
    userSeed: currentUser.userSeed,
    screenName,
    routeName: route?.name || screenName,
    routeParams: route?.params || {},
    presenceActive: true,
  }), [currentUser, screenName, route]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useMBWUserPresence() {
  return useContext(UserContext);
}

export function useUser() {
  return useMBWUserPresence();
}

export function useAuth() {
  return useMBWUserPresence();
}

export default MBWUserPresenceProvider;
