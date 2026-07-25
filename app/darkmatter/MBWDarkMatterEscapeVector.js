export function mbwCreateEscapeVector({
  reason,
  route = null,
  restoreRoute = 'MainHub',
  checkpoint = null,
  rollback = null,
}) {
  return Object.freeze({
    id: `ESCAPE_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    reason: String(reason || 'UNSPECIFIED'),
    route,
    restoreRoute,
    checkpoint,
    rollback,
    createdAt: new Date().toISOString(),
    status: 'READY',
  });
}

export function mbwEscapeVectorReady(vector) {
  return Boolean(
    vector?.reason && vector?.restoreRoute && vector?.status === 'READY',
  );
}
