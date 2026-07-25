const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const point = (value = {}) => ({
  x: number(value.x),
  y: number(value.y),
});

export function createCloneStampOperation({
  source,
  target,
  radius = 28,
  feather = 10,
  opacity = 1,
} = {}) {
  return {
    id: `CLONE_${Date.now()}_${Math.random()}`,
    type: 'CLONE_STAMP',
    source: point(source),
    target: point(target),
    radius: Math.max(4, number(radius, 28)),
    feather: Math.max(0, number(feather, 10)),
    opacity: Math.max(0, Math.min(1, number(opacity, 1))),
  };
}

export function createPatchOperation({
  source,
  target,
  radius = 42,
  feather = 18,
  opacity = 0.92,
} = {}) {
  return {
    id: `PATCH_${Date.now()}_${Math.random()}`,
    type: 'PATCH',
    source: point(source),
    target: point(target),
    radius: Math.max(8, number(radius, 42)),
    feather: Math.max(0, number(feather, 18)),
    opacity: Math.max(0, Math.min(1, number(opacity, 0.92))),
  };
}

export function createSpotHealOperation({
  target,
  radius = 22,
  blur = 8,
  opacity = 0.82,
} = {}) {
  return {
    id: `HEAL_${Date.now()}_${Math.random()}`,
    type: 'SPOT_HEAL',
    target: point(target),
    radius: Math.max(4, number(radius, 22)),
    blur: Math.max(1, number(blur, 8)),
    opacity: Math.max(0, Math.min(1, number(opacity, 0.82))),
  };
}

export function createHairEdgeOperation({
  path = [],
  width = 24,
  feather = 12,
  opacity = 0.72,
} = {}) {
  return {
    id: `HAIR_${Date.now()}_${Math.random()}`,
    type: 'HAIR_EDGE_REFINE',
    path: path.map(point),
    width: Math.max(2, number(width, 24)),
    feather: Math.max(1, number(feather, 12)),
    opacity: Math.max(0, Math.min(1, number(opacity, 0.72))),
  };
}

export function appendRetouchOperation(
  operations = [],
  operation
) {
  return operation
    ? [...operations, operation]
    : operations;
}

export function removeLastRetouchOperation(
  operations = []
) {
  return operations.slice(0, -1);
}

export function validateRetouchOperation(operation) {
  if (!operation?.type) {
    return {
      valid: false,
      code: 'RETOUCH_TYPE_REQUIRED',
    };
  }

  if (
    operation.type === 'CLONE_STAMP' ||
    operation.type === 'PATCH'
  ) {
    const valid =
      Number.isFinite(operation.source?.x) &&
      Number.isFinite(operation.source?.y) &&
      Number.isFinite(operation.target?.x) &&
      Number.isFinite(operation.target?.y);

    return {
      valid,
      code: valid ? 'PASS' : 'SOURCE_TARGET_REQUIRED',
    };
  }

  if (operation.type === 'SPOT_HEAL') {
    const valid =
      Number.isFinite(operation.target?.x) &&
      Number.isFinite(operation.target?.y);

    return {
      valid,
      code: valid ? 'PASS' : 'TARGET_REQUIRED',
    };
  }

  if (operation.type === 'HAIR_EDGE_REFINE') {
    const valid = Array.isArray(operation.path) &&
      operation.path.length >= 2;

    return {
      valid,
      code: valid ? 'PASS' : 'HAIR_PATH_REQUIRED',
    };
  }

  return {
    valid: false,
    code: 'UNKNOWN_RETOUCH_TYPE',
  };
}
