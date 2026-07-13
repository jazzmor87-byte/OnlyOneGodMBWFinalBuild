export const MBW_EXACT_VISUAL_STANDARD = {
  name: "MBWExactVisualStandard",
  brand: "MEN BEHIND WALL",
  colors: ["black", "gold", "maroon"],
  publicRealm: "MEN BEHIND WALL",
  internalRealm: "MONEY BOY'S WORLD",
  posterSafeZone: true,
  panchTatva: true,
  pentagram: true,
  headlineCycle: true,
  noVisibleBuildWords: true,
  noVisibleStageWords: true,
  noPlaceholderLabels: true,
  noFallbackBody: true,
};

export function readMBWExactVisualStandard() {
  return { ...MBW_EXACT_VISUAL_STANDARD };
}

export function assertMBWExactVisualStandard(snapshot = {}) {
  const standard = readMBWExactVisualStandard();
  const green =
    standard.posterSafeZone &&
    standard.panchTatva &&
    standard.pentagram &&
    standard.colors.includes("black") &&
    standard.colors.includes("gold") &&
    standard.colors.includes("maroon");
  return { ...standard, snapshot, green };
}

export default MBW_EXACT_VISUAL_STANDARD;
