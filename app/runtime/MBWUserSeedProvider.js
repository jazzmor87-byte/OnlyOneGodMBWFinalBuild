import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MBW_USER_SEED_SCHEMA_VERSION = 1;
export const MBW_USER_SEED_STORAGE_KEY = '@mbw/user-seed/v1';

const MBWUserSeedContext = createContext(null);
const now = () => new Date().toISOString();
const makeId = () =>
  `mbw-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

export const createMBWUserSeed = () => {
  const timestamp = now();
  return {
    schemaVersion: MBW_USER_SEED_SCHEMA_VERSION,
    id: makeId(),
    displayName: 'ACE',
    path: null,
    tier: null,
    badge: 'BLACK',
    orientation: null,
    profilePoster: null,
    subscriptionState: 'UNSUBSCRIBED',
    firstRunComplete: false,
    accountId: null,
    authLinked: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const normalizeSeed = (value) => {
  const base = createMBWUserSeed();
  const candidate =
    value && typeof value === 'object' ? value : {};
  return {
    ...base,
    ...candidate,
    schemaVersion: MBW_USER_SEED_SCHEMA_VERSION,
    createdAt: candidate.createdAt || base.createdAt,
    updatedAt: candidate.updatedAt || base.updatedAt,
  };
};

const extractAccount = (value, depth = 0) => {
  if (!value || typeof value !== 'object' || depth > 8) {
    return null;
  }
  const direct =
    value.user ||
    value.currentUser ||
    value.session?.user ||
    value.data?.user ||
    value.data?.session?.user;
  if (direct?.id) {
    return direct;
  }
  if (
    value.id &&
    (
      value.email ||
      value.phone ||
      value.user_metadata ||
      value.app_metadata
    )
  ) {
    return value;
  }
  for (const child of Object.values(value)) {
    const found = extractAccount(child, depth + 1);
    if (found?.id) {
      return found;
    }
  }
  return null;
};

const discoverPersistedAccount = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const candidates = keys.filter((key) =>
    /auth|account|session|supabase|user/i.test(key)
  );
  if (!candidates.length) {
    return null;
  }
  const pairs = await AsyncStorage.multiGet(candidates);
  for (const [, raw] of pairs) {
    if (!raw) {
      continue;
    }
    try {
      const account = extractAccount(JSON.parse(raw));
      if (account?.id) {
        return account;
      }
    } catch (_) {}
  }
  return null;
};

const accountDisplayName = (account, fallback) =>
  account?.user_metadata?.displayName ||
  account?.user_metadata?.display_name ||
  account?.user_metadata?.name ||
  account?.email?.split('@')?.[0] ||
  account?.phone ||
  fallback ||
  'ACE';

export function MBWUserSeedProvider({ children }) {
  const [userSeed, setUserSeed] = useState(null);
  const [seedReady, setSeedReady] = useState(false);
  const seedRef = useRef(null);

  const persist = useCallback(async (next) => {
    const normalized = normalizeSeed({
      ...next,
      updatedAt: now(),
    });
    seedRef.current = normalized;
    await AsyncStorage.setItem(
      MBW_USER_SEED_STORAGE_KEY,
      JSON.stringify(normalized),
    );
    setUserSeed(normalized);
    return normalized;
  }, []);

  const updateUserSeed = useCallback(
    (patch) =>
      persist({
        ...(seedRef.current || createMBWUserSeed()),
        ...(patch || {}),
      }),
    [persist],
  );

  const claimUserSeed = useCallback(
    async (account) => {
      if (!account?.id) {
        return seedRef.current;
      }
      const current =
        seedRef.current || createMBWUserSeed();
      return persist({
        ...current,
        accountId: account.id,
        displayName: accountDisplayName(
          account,
          current.displayName,
        ),
        authLinked: true,
      });
    },
    [persist],
  );

  const refreshAuthLink = useCallback(async () => {
    const account = await discoverPersistedAccount();
    if (!account?.id) {
      return seedRef.current;
    }
    return claimUserSeed(account);
  }, [claimUserSeed]);

  const resetUserSeed = useCallback(
    () => persist(createMBWUserSeed()),
    [persist],
  );

  useEffect(() => {
    let alive = true;
    const boot = async () => {
      const raw = await AsyncStorage.getItem(
        MBW_USER_SEED_STORAGE_KEY,
      );
      let initial;
      try {
        initial = raw
          ? normalizeSeed(JSON.parse(raw))
          : createMBWUserSeed();
      } catch (_) {
        initial = createMBWUserSeed();
      }
      seedRef.current = initial;
      if (!raw) {
        await AsyncStorage.setItem(
          MBW_USER_SEED_STORAGE_KEY,
          JSON.stringify(initial),
        );
      }
      const account = await discoverPersistedAccount();
      if (account?.id) {
        initial = {
          ...initial,
          accountId: account.id,
          displayName: accountDisplayName(
            account,
            initial.displayName,
          ),
          authLinked: true,
          updatedAt: now(),
        };
        await AsyncStorage.setItem(
          MBW_USER_SEED_STORAGE_KEY,
          JSON.stringify(initial),
        );
      }
      seedRef.current = initial;
      if (alive) {
        setUserSeed(initial);
        setSeedReady(true);
      }
    };

    boot().catch(() => {
      const fallback = createMBWUserSeed();
      seedRef.current = fallback;
      if (alive) {
        setUserSeed(fallback);
        setSeedReady(true);
      }
    });

    const appStateSubscription =
      AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          refreshAuthLink().catch(() => {});
        }
      });

    const authLinkTimer = setInterval(() => {
      if (!seedRef.current?.authLinked) {
        refreshAuthLink().catch(() => {});
      }
    }, 5000);

    return () => {
      alive = false;
      clearInterval(authLinkTimer);
      appStateSubscription.remove();
    };
  }, [refreshAuthLink]);

  const value = useMemo(
    () => ({
      userSeed,
      seedReady,
      updateUserSeed,
      claimUserSeed,
      refreshAuthLink,
      resetUserSeed,
    }),
    [
      claimUserSeed,
      refreshAuthLink,
      resetUserSeed,
      seedReady,
      updateUserSeed,
      userSeed,
    ],
  );

  return (
    <MBWUserSeedContext.Provider value={value}>
      <View style={styles.root}>
        {children}
        {seedReady && userSeed ? (
          <MBWUserSeedBadge seed={userSeed} />
        ) : null}
      </View>
    </MBWUserSeedContext.Provider>
  );
}

export const useMBWUserSeed = () => {
  const value = useContext(MBWUserSeedContext);
  if (!value) {
    throw new Error(
      'useMBWUserSeed must be used inside MBWUserSeedProvider',
    );
  }
  return value;
};

function MBWUserSeedBadge({ seed }) {
  const pathMark = String(seed.path || 'A')
    .slice(0, 1)
    .toUpperCase();
  const tierMark = seed.tier
    ? String(seed.tier).slice(0, 1)
    : '•';
  return (
    <View
      pointerEvents="none"
      style={styles.badgeSafeZone}
      accessibilityLabel="MBW identity active"
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {pathMark}
          {tierMark}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  badgeSafeZone: {
    position: 'absolute',
    top: 54,
    right: 10,
    zIndex: 50,
    opacity: 0.78,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,8,8,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.72)',
  },
  badgeText: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
