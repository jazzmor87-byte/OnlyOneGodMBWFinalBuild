export function normalizeTemplate(template = {}) {
  return {
    id: template.id || 'MBW_BLACK_GOLD_01',
    backgroundAsset: template.backgroundAsset || null,
    foregroundAsset: template.foregroundAsset || null,
    shadowAsset: template.shadowAsset || null,
    oldModelMaskAsset: template.oldModelMaskAsset || null,
    slot: {
      x: Number(template?.slot?.x ?? 0.5), y: Number(template?.slot?.y ?? 0.68),
      width: Number(template?.slot?.width ?? 0.42), height: Number(template?.slot?.height ?? 0.70),
    },
    faceTarget: { x: Number(template?.faceTarget?.x ?? 0.5), y: Number(template?.faceTarget?.y ?? 0.28) },
    shadowAnchor: { x: Number(template?.shadowAnchor?.x ?? 0.5), y: Number(template?.shadowAnchor?.y ?? 0.92) },
    posterWorldLocked: template.posterWorldLocked !== false,
    starSafePath: template.starSafePath || 'OUTER_ORBIT',
    textSafeZone: template.textSafeZone || 'TOP_AND_BOTTOM_ONLY',
  };
}

export function calculateModelPlacement(canvas, rawTemplate) {
  const template = normalizeTemplate(rawTemplate);
  const width = Number(canvas?.width || 1080);
  const height = Number(canvas?.height || 1600);
  return {
    templateId: template.id,
    x: Math.round(width * (template.slot.x - template.slot.width / 2)),
    y: Math.round(height * (template.slot.y - template.slot.height / 2)),
    width: Math.round(width * template.slot.width),
    height: Math.round(height * template.slot.height),
    faceTargetX: Math.round(width * template.faceTarget.x),
    faceTargetY: Math.round(height * template.faceTarget.y),
    shadowAnchorX: Math.round(width * template.shadowAnchor.x),
    shadowAnchorY: Math.round(height * template.shadowAnchor.y),
    posterWorldLocked: template.posterWorldLocked,
  };
}
