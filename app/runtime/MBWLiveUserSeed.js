export const MBW_LIVE_USER_SEED = Object.freeze({
  seedVersion: 1,
  identityReady: true,
  profileReady: true,
  subscriptionState: 'UNRESOLVED',
  selectedPath: null,
  currentRoute: 'CinematicIntro',
  actionState: Object.freeze({}),
  resultState: Object.freeze({}),
});

export function installMBWLiveUserSeed() {
  if (!globalThis.MBW_LIVE_USER_SEED) {
    globalThis.MBW_LIVE_USER_SEED = { ...MBW_LIVE_USER_SEED };
  }
  return globalThis.MBW_LIVE_USER_SEED;
}

export function readMBWLiveUserSeed() {
  return globalThis.MBW_LIVE_USER_SEED || installMBWLiveUserSeed();
}

export function recordMBWUserRoute(routeName) {
  const seed = readMBWLiveUserSeed();
  seed.currentRoute = routeName;
  return seed;
}

export default MBW_LIVE_USER_SEED;
