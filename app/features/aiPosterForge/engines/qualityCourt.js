export function buildQualityCourt(input = {}) {
  const checks = {
    POSTER_WORLD_LOCKED: input.posterWorldLocked === true,
    BACKGROUND_UNCHANGED: input.backgroundUnchanged === true,
    USER_MODEL_INSERTED: input.userModelInserted === true,
    FACE_LOCK_PASS: input.faceLockPass === true,
    BODY_PROPORTION_LOCK_PASS: input.bodyLockPass === true,
    MODEL_SLOT_FIT_PASS: input.modelSlotFitPass === true,
    CUTOUT_EDGE_PASS: Number(input.cutoutEdgeScore || 0) >= 8,
    LIGHT_MATCH_PASS: Number(input.lightMatchScore || 0) >= 8,
    SHADOW_BLEND_PASS: Number(input.shadowBlendScore || 0) >= 8,
    FOREGROUND_LAYER_PASS: input.foregroundLayerPass === true,
    STAR_SAFE_ZONE_PASS: input.starSafeZonePass === true,
    TEXT_SAFE_ZONE_PASS: input.textSafeZonePass === true,
    VERSION_SAVED: input.versionSaved === true,
    EXPORT_READY: input.exportReady === true,
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  return { checks, passed, total, score: `${passed}/${total}`, verdict: passed === total ? 'FINAL_SEAL_PASS' : 'PROOF_INCOMPLETE' };
}
