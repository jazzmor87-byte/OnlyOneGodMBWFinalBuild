import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "MBW_GATE_TIER_V1";
let unlocked = false;
export const hydrateGateState = async () => { unlocked = ((await AsyncStorage.getItem(KEY)) || "PUBLIC") === "MBW"; return unlocked; };
export const unlockGate = async () => { unlocked = true; await AsyncStorage.setItem(KEY, "MBW"); return true; };
export const lockGate = async () => { unlocked = false; await AsyncStorage.removeItem(KEY); return true; };
export const isGateUnlocked = () => unlocked;
export const getTier = async () => ((await AsyncStorage.getItem(KEY)) || (unlocked ? "MBW" : "PUBLIC"));
export const setTier = async (tier) => { unlocked = tier === "MBW"; await AsyncStorage.setItem(KEY, unlocked ? "MBW" : "PUBLIC"); return tier; };
