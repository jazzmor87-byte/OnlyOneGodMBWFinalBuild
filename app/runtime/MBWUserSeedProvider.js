// MBW_USER_SEED_PROVIDER_V14
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  USER_SEED,
  isMBWRealUserSeed,
  loadMBWUserSeed,
  saveMBWUserSeed,
} from './MBWUserSeedRuntime';

const MBWUserSeedContext = createContext({
  userSeed: USER_SEED,
  userSeedReady: false,
  realUserSeed: isMBWRealUserSeed(USER_SEED),
  setUserSeed: async () => USER_SEED,
  reloadUserSeed: async () => USER_SEED,
});

export function MBWUserSeedProvider({ children }) {
  const [userSeed, setUserSeedState] = useState(USER_SEED);
  const [userSeedReady, setUserSeedReady] = useState(false);

  const reloadUserSeed = useCallback(async () => {
    const loaded = await loadMBWUserSeed();
    setUserSeedState(loaded);
    setUserSeedReady(true);
    return loaded;
  }, []);

  const setUserSeed = useCallback(async (nextSeed) => {
    const saved = await saveMBWUserSeed(nextSeed);
    setUserSeedState(saved);
    setUserSeedReady(true);
    return saved;
  }, []);

  useEffect(() => {
    let active = true;

    loadMBWUserSeed()
      .then((loaded) => {
        if (active) {
          setUserSeedState(loaded);
          setUserSeedReady(true);
        }
      })
      .catch(() => {
        if (active) {
          setUserSeedState(USER_SEED);
          setUserSeedReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      userSeed,
      userSeedReady,
      realUserSeed: isMBWRealUserSeed(userSeed),
      setUserSeed,
      reloadUserSeed,
    }),
    [reloadUserSeed, setUserSeed, userSeed, userSeedReady]
  );

  return (
    <MBWUserSeedContext.Provider value={value}>
      {children}
    </MBWUserSeedContext.Provider>
  );
}

export function useMBWUserSeed() {
  return useContext(MBWUserSeedContext);
}

export { MBWUserSeedContext };
