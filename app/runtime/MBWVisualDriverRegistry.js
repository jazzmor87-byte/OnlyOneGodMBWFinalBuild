// MBW_VISUAL_DRIVER_REGISTRY_V1
const activeScreens = new Map();
export function mbwVisualDriverMount(screenId, proof) {
  activeScreens.set(String(screenId), { ...proof, mountedAt: Date.now() });
  if (__DEV__) console.log('MBW_VISUAL_DRIVER_MOUNT', String(screenId), JSON.stringify(proof));
}
export function mbwVisualDriverUnmount(screenId) {
  activeScreens.delete(String(screenId));
  if (__DEV__) console.log('MBW_VISUAL_DRIVER_UNMOUNT', String(screenId));
}
export function mbwVisualDriverSnapshot() {
  return Array.from(activeScreens.entries()).map(([screenId, proof]) => ({ screenId, ...proof }));
}
