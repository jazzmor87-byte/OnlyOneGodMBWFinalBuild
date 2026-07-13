// MBW_SAFE_USER_SEED_RUNTIME=SOURCE_FALLBACK
export const MBW_DEFAULT_USER_SEED = Object.freeze({
  id: 'MBW_SAFE_GUEST',
  role: 'MBW_FINAL_STAGE',
  selectedPath: 'FullMBWApp',
  source: 'MBW_SAFE_USER_SEED_RUNTIME'
});

export function resolveMBWUserSeed(value) {
  if (value && typeof value === 'object') {
    return { ...MBW_DEFAULT_USER_SEED, ...value };
  }
  return MBW_DEFAULT_USER_SEED;
}
