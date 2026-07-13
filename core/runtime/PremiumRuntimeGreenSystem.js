export const PREMIUM_RUNTIME_GREEN = {
  name: "PremiumRuntimeGreenSystem",
  checks: ["imports", "visual", "journey", "apk", "logcat"],
};

export function PremiumRuntimeGreenSystem(input = {}) {
  return {
    ...PREMIUM_RUNTIME_GREEN,
    sourceGreen: Boolean(input.sourceGreen),
    visualGreen: Boolean(input.visualGreen),
    apkSealGreen: Boolean(input.apkSealGreen),
    runtimeGreen: Boolean(input.runtimeGreen),
    releaseGate: Boolean(input.sourceGreen && input.visualGreen && input.apkSealGreen && input.runtimeGreen),
  };
}

export default PremiumRuntimeGreenSystem;
