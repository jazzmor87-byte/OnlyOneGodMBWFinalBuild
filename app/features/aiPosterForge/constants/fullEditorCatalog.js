export const EDITOR_MODES = Object.freeze([
  {
    id: 'IMPORT',
    icon: '📥',
    label: 'IMPORT',
  },
  {
    id: 'AI',
    icon: '🧠',
    label: 'AI CUTOUT',
  },
  {
    id: 'TRANSFORM',
    icon: '↔️',
    label: 'TRANSFORM',
  },
  {
    id: 'TONE',
    icon: '🎨',
    label: 'TONE',
  },
  {
    id: 'RETOUCH',
    icon: '🖌️',
    label: 'RETOUCH',
  },
  {
    id: 'MASK',
    icon: '🛡️',
    label: 'MASK',
  },
  {
    id: 'LAYERS',
    icon: '🧱',
    label: 'LAYERS',
  },
  {
    id: 'HISTORY',
    icon: '↩️',
    label: 'HISTORY',
  },
  {
    id: 'VAULT',
    icon: '🗝️',
    label: 'VAULT',
  },
  {
    id: 'EXPORT',
    icon: '📤',
    label: 'EXPORT',
  },
]);

export const MODE_ACTIONS = Object.freeze({
  IMPORT: [
    'Choose Image',
    'Camera Capture',
  ],
  AI: [
    'AI Portrait Cutout',
    'Clear AI Cutout',
    'Refine Edge +',
    'Refine Edge -',
  ],
  TRANSFORM: [
    'Rotate Left',
    'Rotate Right',
    'Flip Horizontal',
    'Flip Vertical',
    'Scale +',
    'Scale -',
    'Move Up',
    'Move Down',
    'Move Left',
    'Move Right',
    'Reset Transform',
  ],
  TONE: [
    'Brightness +',
    'Brightness -',
    'Contrast +',
    'Contrast -',
    'Saturation +',
    'Saturation -',
    'Warmth +',
    'Warmth -',
    'Blur +',
    'Blur -',
    'Black Gold',
    'Deep Maroon',
    'Royal Amber',
    'Dark Velvet',
    'Original Tone',
  ],
  RETOUCH: [
    'Spot Heal',
    'Patch Tool',
    'Clone Stamp',
    'Hair Edge Refine',
    'Retouch Off',
  ],
  MASK: [
    'Manual Mask On',
    'Manual Mask Off',
    'AI Mask On',
    'AI Mask Off',
  ],
  LAYERS: [
    'Subject Layer',
    'Background Layer',
    'Effects Layer',
    'Shadow Layer',
  ],
  HISTORY: [
    'Undo',
    'Redo',
    'Reset Edit',
  ],
  VAULT: [
    'Save Version',
    'Restore Latest',
  ],
  EXPORT: [
    'Save Gallery',
    'Save MBW Vault',
  ],
});

export const BACKGROUNDS = Object.freeze({
  BLACK: '#050303',
  MAROON: '#300811',
  GOLD: '#4A3210',
  TRANSPARENT: 'transparent',
});

export const PRESETS = Object.freeze({
  ORIGINAL: {
    brightness: 0,
    contrast: 1,
    saturation: 1,
    warmth: 0,
    blur: 0,
  },
  BLACK_GOLD: {
    brightness: -0.03,
    contrast: 1.14,
    saturation: 0.92,
    warmth: 0.12,
    blur: 0,
  },
  DEEP_MAROON: {
    brightness: -0.06,
    contrast: 1.1,
    saturation: 1.04,
    warmth: 0.08,
    blur: 0,
  },
  ROYAL_AMBER: {
    brightness: 0.04,
    contrast: 1.08,
    saturation: 1.08,
    warmth: 0.18,
    blur: 0,
  },
  DARK_VELVET: {
    brightness: -0.1,
    contrast: 1.18,
    saturation: 0.88,
    warmth: 0.04,
    blur: 0,
  },
});
