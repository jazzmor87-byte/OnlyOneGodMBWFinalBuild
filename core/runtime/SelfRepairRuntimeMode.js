export const SELF_REPAIR_RUNTIME = {
  name: "SelfRepairRuntimeMode",
  allowedScope: "runtime-state-only",
  patchRootAutomatically: false,
};

export function SelfRepairRuntimeMode(event = {}) {
  return {
    ...SELF_REPAIR_RUNTIME,
    event,
    recommendation: event.level === "P0" ? "BLOCK_AND_REPORT" : "CONTINUE_WITH_PROOF",
  };
}

export default SelfRepairRuntimeMode;
