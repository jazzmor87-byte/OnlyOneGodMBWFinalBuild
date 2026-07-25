export const TOOL_EXECUTION_REGISTRY = Object.freeze({
  'Choose Image': 'ACTIVE',
  'Camera Capture': 'ACTIVE',

  'Rotate Left': 'ACTIVE_TRANSFORM',
  'Rotate Right': 'ACTIVE_TRANSFORM',
  'Flip Horizontal': 'ACTIVE_TRANSFORM',
  'Flip Vertical': 'ACTIVE_TRANSFORM',
  'Resize': 'ACTIVE_TRANSFORM',
  'Square Crop': 'ACTIVE_TRANSFORM',
  'Poster Crop': 'ACTIVE_TRANSFORM',

  'Brightness': 'ACTIVE_SKIA_FILTER',
  'Contrast': 'ACTIVE_SKIA_FILTER',
  'Saturation': 'ACTIVE_SKIA_FILTER',
  'Warmth': 'ACTIVE_SKIA_FILTER',
  'Background Blur': 'ACTIVE_SKIA_FILTER',

  'Black Gold Forge': 'ACTIVE_PRESET',
  'Deep Maroon Chamber': 'ACTIVE_PRESET',
  'Royal Amber Glow': 'ACTIVE_PRESET',
  'Dark Velvet Tone': 'ACTIVE_PRESET',

  'Brush Mask': 'ACTIVE_MANUAL_MASK',
  'Erase Mask': 'ACTIVE_MANUAL_MASK',
  'Mask Preview': 'ACTIVE_MANUAL_MASK',

  'Spot Heal': 'ACTIVE_LOCAL_BLUR_HEAL',
  'Patch Tool': 'ACTIVE_LOCAL_SOURCE_PATCH',
  'Clone Stamp': 'ACTIVE_LOCAL_CLONE',
  'Hair Edge Refine': 'ACTIVE_MANUAL_FEATHER_REFINE',

  'Subject Position': 'ACTIVE_TRANSFORM',
  'Subject Scale': 'ACTIVE_TRANSFORM',
  'Subject Rotation': 'ACTIVE_TRANSFORM',

  'Undo': 'ACTIVE_HISTORY',
  'Redo': 'ACTIVE_HISTORY',
  'Save Version': 'ACTIVE_VAULT',
  'Restore Version': 'ACTIVE_VAULT',
  'Compare Versions': 'ACTIVE_COURT',

  'Profile Export': 'ACTIVE_EXPORT',
  'Poster Export': 'ACTIVE_EXPORT',
  'Story Export': 'ACTIVE_EXPORT',
  'Wallpaper Export': 'ACTIVE_EXPORT',
  'Game Avatar Export': 'ACTIVE_EXPORT',
  'Merch Preview Export': 'ACTIVE_EXPORT',
  'PNG Export': 'ACTIVE_EXPORT',
  'Vault Save': 'ACTIVE_VAULT',

  'Automatic Subject Cutout': 'LOCAL_MODEL_NOT_BUNDLED',
  'Old Model Mask': 'TEMPLATE_ASSET_REQUIRED',
  'Foreground Seal': 'TEMPLATE_ASSET_REQUIRED',
  'Shadow Seat Blend': 'TEMPLATE_ASSET_REQUIRED',
});
