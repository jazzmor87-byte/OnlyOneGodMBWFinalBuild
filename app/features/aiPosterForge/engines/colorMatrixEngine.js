const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, Number(value || 0)));

export function buildColorMatrix({
  brightness = 0,
  contrast = 1,
  saturation = 1,
  warmth = 0,
} = {}) {
  const b = clamp(brightness, -1, 1) * 255;
  const c = clamp(contrast, 0, 2);
  const s = clamp(saturation, 0, 2);
  const w = clamp(warmth, -1, 1) * 24;

  const ir = 0.213;
  const ig = 0.715;
  const ib = 0.072;

  const sr = (1 - s) * ir;
  const sg = (1 - s) * ig;
  const sb = (1 - s) * ib;

  return [
    c * (sr + s), c * sg,       c * sb,       0, b + w,
    c * sr,       c * (sg + s), c * sb,       0, b,
    c * sr,       c * sg,       c * (sb + s), 0, b - w,
    0,            0,            0,            1, 0,
  ];
}

export const MBW_FILTER_PRESETS = Object.freeze({
  ORIGINAL: {
    brightness: 0,
    contrast: 1,
    saturation: 1,
    warmth: 0,
    blur: 0,
  },
  BLACK_GOLD_FORGE: {
    brightness: -0.02,
    contrast: 1.22,
    saturation: 0.86,
    warmth: 0.28,
    blur: 0,
  },
  DEEP_MAROON: {
    brightness: -0.06,
    contrast: 1.18,
    saturation: 0.78,
    warmth: 0.12,
    blur: 0,
  },
  ROYAL_AMBER: {
    brightness: 0.04,
    contrast: 1.12,
    saturation: 0.96,
    warmth: 0.38,
    blur: 0,
  },
  DARK_VELVET: {
    brightness: -0.12,
    contrast: 1.28,
    saturation: 0.72,
    warmth: 0.08,
    blur: 0,
  },
});
