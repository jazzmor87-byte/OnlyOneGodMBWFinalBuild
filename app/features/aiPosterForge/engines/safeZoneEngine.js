function intersects(a, b) {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

export function createSafeZones(width = 1080, height = 1600) {
  return {
    face: { x: width * 0.34, y: height * 0.10, width: width * 0.32, height: height * 0.24 },
    body: { x: width * 0.23, y: height * 0.20, width: width * 0.54, height: height * 0.66 },
  };
}

export function judgeOverlaySafety({ overlayRect, width = 1080, height = 1600, overlayType = 'DECORATION' }) {
  const zones = createSafeZones(width, height);
  const hitsFace = intersects(overlayRect, zones.face);
  const hitsBody = intersects(overlayRect, zones.body);
  const blocked = hitsFace || (overlayType === 'TEXT' && hitsBody) || (overlayType === 'PENTAGRAM' && hitsBody);
  return { overlayType, hitsFace, hitsBody, verdict: blocked ? 'BLOCKED' : 'PASS' };
}
