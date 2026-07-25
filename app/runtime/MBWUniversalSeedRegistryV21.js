/*
 * MBW UNIVERSAL SEED REGISTRY V2.1
 * Exact fixture input: MBWAPKExtractedSeedV21.json
 * No real identity, phone number, or geographic address is stored here.
 */
import extractedSeed from './MBWAPKExtractedSeedV21.json';

const normalizeKey = (value = '') =>
  String(value).trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const mergeValue = (target, key, value) => {
  if (value === undefined || value === null || value === '') return;
  if (key === 'score') {
    target.score = Math.max(Number(target.score || 0), Number(value || 0));
    return;
  }
  if (key === 'fixtureOrigin') {
    target.fixtureOrigin ||= [];
    if (!target.fixtureOrigin.includes(value)) target.fixtureOrigin.push(value);
    return;
  }
  if (target[key] === undefined) {
    target[key] = value;
    return;
  }
  if ((key === 'signal' || key === 'zone') && target[key] !== value) {
    const alternateKey = `${key}Alternates`;
    target[alternateKey] ||= [];
    if (!target[alternateKey].includes(value)) target[alternateKey].push(value);
  }
};

const registryMap = new Map();

const mergeProfile = (name, fields) => {
  const id = normalizeKey(name);
  if (!id) return;
  const current = registryMap.get(id) || {
    id,
    name: String(name).trim(),
    syntheticFixture: true,
    fixtureOrigin: [],
  };
  Object.entries(fields).forEach(([key, value]) => mergeValue(current, key, value));
  registryMap.set(id, current);
};

extractedSeed.MATCH_SEEDS.forEach((item) => {
  mergeProfile(item.name, {
    code: item.code,
    role: item.role,
    aura: item.aura,
    intent: item.intent,
    score: item.score,
    status: item.status,
    style: item.style,
    fixtureOrigin: 'MATCH_SEEDS',
  });
});

extractedSeed.REALM_FEED_LUX_LOCAL_USERS.forEach((item) => {
  mergeProfile(item.name, {
    rank: item.rank,
    signal: item.signal,
    zone: item.zone,
    location: item.zone,
    locationType: 'MBW_ZONE',
    score: item.score,
    fixtureOrigin: 'REALM_FEED_LUX_LOCAL_USERS',
  });
});

extractedSeed.MATCH_FEED_USERS.forEach((item) => {
  mergeProfile(item.name, {
    code: item.code,
    signal: item.signal,
    zone: item.zone,
    location: item.zone,
    locationType: 'MBW_ZONE',
    score: item.score,
    fixtureOrigin: 'MATCH_FEED_USERS',
  });
});

export const MBW_EXACT_APK_SEED_V21 = Object.freeze(extractedSeed);

export const MBW_UNIVERSAL_SEED_USERS_V21 = Object.freeze(
  Array.from(registryMap.values()).sort(
    (left, right) => Number(right.score || 0) - Number(left.score || 0),
  ),
);

export const MBW_UNIVERSAL_SEED_INTENTS_V21 = Object.freeze(
  extractedSeed.MATCH_INTENTS,
);

export const MBW_UNIVERSAL_MATCH_FLOW_V21 = Object.freeze(
  extractedSeed.MATCH_FLOW_STEPS,
);

export const MBW_UNIVERSAL_VISIBLE_RULES_V21 = Object.freeze(
  extractedSeed.MATCH_VISIBLE_RULES,
);

export const getMBWUniversalSeedByIdV21 = (id) =>
  registryMap.get(normalizeKey(id)) || null;

export const getMBWUniversalSeedByNameV21 = (name) =>
  registryMap.get(normalizeKey(name)) || null;

export const getMBWUniversalSeedSnapshotV21 = () => ({
  users: MBW_UNIVERSAL_SEED_USERS_V21,
  intents: MBW_UNIVERSAL_SEED_INTENTS_V21,
  flow: MBW_UNIVERSAL_MATCH_FLOW_V21,
  visibleRules: MBW_UNIVERSAL_VISIBLE_RULES_V21,
  syntheticFixture: true,
  privateData: false,
});

export default Object.freeze({
  exact: MBW_EXACT_APK_SEED_V21,
  users: MBW_UNIVERSAL_SEED_USERS_V21,
  intents: MBW_UNIVERSAL_SEED_INTENTS_V21,
  flow: MBW_UNIVERSAL_MATCH_FLOW_V21,
  visibleRules: MBW_UNIVERSAL_VISIBLE_RULES_V21,
  getById: getMBWUniversalSeedByIdV21,
  getByName: getMBWUniversalSeedByNameV21,
  snapshot: getMBWUniversalSeedSnapshotV21,
});
