const MBW_ENGINE_STATE = Object.freeze({
  ready: true,
  routeReady: true,
  logicBridge: true,
  screenGuard: true,
  visualPolicy: true,
  posterBody: true,
  userPresence: true,
});

export function useMBWEngine() {
  return MBW_ENGINE_STATE;
}

export const MBWEngine = MBW_ENGINE_STATE;
export const mbwEngine = MBW_ENGINE_STATE;
export default useMBWEngine;
