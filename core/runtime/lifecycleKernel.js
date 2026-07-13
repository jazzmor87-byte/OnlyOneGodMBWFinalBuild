import { registerMBWRoute, registerMBWScreen, recordMBWGraphEvent } from "../graph/mbwGraphStore";

const lifecycleState = { mounts: {}, navigation: [], validations: [] };
const now = () => new Date().toISOString();

export function onScreenMount(screenName, meta = {}) {
  if (!screenName) return lifecycleState;
  lifecycleState.mounts[screenName] = { screenName, meta, at: now() };
  registerMBWScreen(screenName, meta);
  recordMBWGraphEvent("SCREEN_MOUNT", { screenName, meta });
  return lifecycleState;
}

export function onNavigation(from, to, meta = {}) {
  const event = { from, to, meta, at: now() };
  lifecycleState.navigation.push(event);
  registerMBWRoute(to, to, meta);
  recordMBWGraphEvent("NAVIGATION", event);
  return event;
}

export function validateRoute(routeName, registry = {}) {
  const exists = Boolean(routeName && registry && registry[routeName]);
  const result = { routeName, exists, level: exists ? "GREEN" : "REVIEW", at: now() };
  lifecycleState.validations.push(result);
  recordMBWGraphEvent("ROUTE_VALIDATION", result);
  return result;
}

export function readLifecycleState() {
  return {
    mounts: { ...lifecycleState.mounts },
    navigation: [...lifecycleState.navigation],
    validations: [...lifecycleState.validations],
  };
}

export const lifecycleKernel = { onScreenMount, onNavigation, validateRoute, readLifecycleState };
export default lifecycleKernel;
