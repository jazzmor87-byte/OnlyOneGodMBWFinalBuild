export const V16_LIVING_VISUAL_OS = {
  name: "V16LivingVisualOSMapper",
  colors: ["black", "gold", "maroon"],
  panchTatva: true,
  pentagram: true,
  posterSafeZone: true,
};

export function V16LivingVisualOSMapper(screenName, meta = {}) {
  return {
    ...V16_LIVING_VISUAL_OS,
    screenName: screenName || "MBW",
    meta,
    visualOwner: "MBWVisualBoundary",
  };
}

export default V16LivingVisualOSMapper;
