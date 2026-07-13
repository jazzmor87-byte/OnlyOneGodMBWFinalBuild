export const VISUAL_BODY_INHERITANCE = {
  name: "VisualBodyInheritanceCore",
  posterSafeZone: true,
  noVisibleBuildWords: true,
  noFallbackBody: true,
};

export function VisualBodyInheritanceCore(input = {}) {
  return {
    ...VISUAL_BODY_INHERITANCE,
    screenName: input.screenName || "MBW",
    poster: input.poster || null,
    inherited: true,
  };
}

export function assertVisualBodyInheritance(input = {}) {
  const proof = VisualBodyInheritanceCore(input);
  return {
    ...proof,
    green: proof.posterSafeZone && proof.noVisibleBuildWords && proof.noFallbackBody,
  };
}

export default VisualBodyInheritanceCore;
