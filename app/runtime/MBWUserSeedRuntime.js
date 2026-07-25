// MBW_USER_SEED_RUNTIME_V14
import AsyncStorage from '@react-native-async-storage/async-storage';
import REAL_USER_SEED_DATA from './MBWRealUserSeedDataR328.json';

export const MBW_USER_SEED_STORAGE_KEY = '@mbw/user-seed/v1';

const asObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : {};

const normalizeText = (value) =>
  typeof value === 'string' ? value.trim() : '';

export function normalizeMBWUserSeed(input = {}) {
  const source = asObject(input);
  return Object.freeze({
    ...source,
    displayName: normalizeText(
      source.displayName ||
      source.fullName ||
      source.profileName ||
      source.userName ||
      source.username ||
      source.name
    ),
    phoneNumber: normalizeText(
      source.phoneNumber ||
      source.phone ||
      source.mobile
    ),
    profilePoster:
      source.profilePoster ||
      source.poster ||
      source.profileImage ||
      source.photo ||
      source.image ||
      null,
    avatar: source.avatar || null,
    seedContract: 'MBW_REAL_USER_SEED_V14',
  });
}

export const USER_SEED = normalizeMBWUserSeed(REAL_USER_SEED_DATA);

export function isMBWRealUserSeed(seed = USER_SEED) {
  const value = normalizeMBWUserSeed(seed);
  return Boolean(
    value.displayName &&
    value.phoneNumber &&
    (value.profilePoster || value.avatar)
  );
}

export async function loadMBWUserSeed() {
  const stored = await AsyncStorage.getItem(MBW_USER_SEED_STORAGE_KEY);
  if (!stored) return USER_SEED;

  try {
    return normalizeMBWUserSeed(JSON.parse(stored));
  } catch (_error) {
    return USER_SEED;
  }
}

export async function saveMBWUserSeed(seed) {
  const normalized = normalizeMBWUserSeed(seed);
  await AsyncStorage.setItem(
    MBW_USER_SEED_STORAGE_KEY,
    JSON.stringify(normalized)
  );
  return normalized;
}

export async function clearMBWUserSeed() {
  await AsyncStorage.removeItem(MBW_USER_SEED_STORAGE_KEY);
}
