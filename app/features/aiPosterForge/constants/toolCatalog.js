export const MBW_FORGE_IDENTITY = Object.freeze({
  section: 'AI POSTER',
  chamber: 'MBW POSTER SOUL FORGE AI',
  commandLine: 'EDIT YOUR PICTURE · BECOME THE MODEL · FORGE YOUR MBW IDENTITY',
  colors: {
    black: '#050303', nearBlack: '#0B0607', maroon: '#571018',
    deepMaroon: '#2B090D', gold: '#D6A73A', lightGold: '#F0D47F', white: '#F8F4EA',
  },
});

export const FORGE_MODES = Object.freeze([
  { id: 'PERSONAL_EDITOR', label: '🖼️ PERSONAL EDITOR ✨' },
  { id: 'BECOME_THE_MODEL', label: '👑 BECOME THE MODEL 🔥' },
  { id: 'POSTER_FORGE', label: '♠️ POSTER FORGE 🖼️' },
  { id: 'EDIT_COURT', label: '⚖️ EDIT COURT 🛡️' },
]);

export const EDIT_TOOL_GROUPS = Object.freeze([
  { id: 'IMPORT', label: '📥 IMAGE INTAKE 🖼️', tools: [
    'Choose Image','Camera Capture','Recent Images','Duplicate Image','Original Lock','Image Information','Orientation Repair','Reset Original'
  ]},
  { id: 'FRAME', label: '✂️ FRAME & GEOMETRY 📐', tools: [
    'Free Crop','Square Crop','Portrait Crop','Poster Crop','Story Crop','Wallpaper Crop','Rotate Left','Rotate Right','Free Rotate','Flip Horizontal','Flip Vertical','Straighten','Perspective','Skew','Resize','Canvas Expand','Canvas Position','Aspect Ratio Lock'
  ]},
  { id: 'LIGHT', label: '☀️ LIGHT FORGE 🌑', tools: [
    'Brightness','Exposure','Contrast','Highlights','Shadows','Whites','Blacks','Black Point','White Point','Gamma','Tone Curve','Local Light','Face Light','Back Light'
  ]},
  { id: 'COLOR', label: '🎨 COLOR BLOOD 🔥', tools: [
    'Saturation','Vibrance','Warmth','Temperature','Tint','Hue','Color Balance','Selective Color','Color Replace','Monochrome','Duotone','Gradient Map','Skin Tone Protect','MBW Black Gold','Deep Maroon','Royal Amber','Dark Velvet'
  ]},
  { id: 'DETAIL', label: '🗡️ DETAIL BLADE 🔍', tools: [
    'Sharpen','Clarity','Texture','Structure','Dehaze','Noise Reduction','Color Noise Reduction','Edge Detail','Upscale Preparation','Compression Repair','Grain Control'
  ]},
  { id: 'RETOUCH', label: '🧼 CLEANUP COURT 🛡️', tools: [
    'Spot Heal','Patch Tool','Clone Stamp','Dust Removal','Scratch Removal','Red-Eye Repair','Skin Safe Smooth','Blemish Repair','Teeth Light','Eye Light','Background Smooth','Wall Cover','Texture Repair'
  ]},
  { id: 'SUBJECT', label: '🧍 SUBJECT & IDENTITY LOCK 👑', tools: [
    'Royal Face Lock','Eye Lock','Nose Lock','Mouth Lock','Hair Lock','Body Proportion Lock','Subject Lock','No Face Alteration Seal','No Body Distortion Seal','Subject Position','Subject Scale','Subject Rotation'
  ]},
  { id: 'MASK', label: '✂️ SOUL CUTOUT 🎭', tools: [
    'Manual Cutout','Background Eraser','Restore Brush','Brush Mask','Erase Mask','Subject Mask','Background Mask','Object Mask','Circle Mask','Linear Gradient Mask','Radial Mask','Mask Invert','Mask Feather','Mask Expand','Mask Contract','Edge Smoothing','Hair Edge Refine','Mask Preview'
  ]},
  { id: 'BACKGROUND', label: '🌌 BACKGROUND CHAMBER 🖼️', tools: [
    'Background Blur','Background Darken','Background Light','Background Color','Background Texture','Background Replace','MBW Poster Background','Depth Blur','Radial Focus','Shadow Wall','Velvet Wall','Smoke Wall'
  ]},
  { id: 'OBJECT', label: '🧩 OBJECT CONTROL 🪄', tools: [
    'Move Object','Scale Object','Rotate Object','Duplicate Object','Hide Object','Cover Object','Patch Object','Object Shadow','Object Glow','Object Opacity','Object Layer Order'
  ]},
  { id: 'EFFECTS', label: '🔥 EFFECT CHAMBER 🌫️', tools: [
    'Outer Glow','Inner Glow','Gold Glow','Maroon Aura','Drop Shadow','Long Shadow','Smoke','Fog','Fire Glow','Candle Glow','Gold Spark','Diamond Spark','Lens Glow','Vignette','Film Grain','Rain','Dust','Motion Blur','Radial Blur','Zoom Blur','Depth Blur'
  ]},
  { id: 'LAYERS', label: '🧱 LAYER KINGDOM 👑', tools: [
    'Add Layer','Delete Layer','Duplicate Layer','Rename Layer','Lock Layer','Hide Layer','Move Layer','Scale Layer','Rotate Layer','Layer Opacity','Bring Forward','Send Backward','Group Layers','Ungroup Layers','Merge Layers','Flatten Copy','Normal Blend','Multiply Blend','Screen Blend','Overlay Blend','Soft Light Blend','Hard Light Blend'
  ]},
  { id: 'TEXT', label: '✍️ TEXT & RHYME ENGRAVER 🔤', tools: [
    'Add Text','Edit Text','Name Engraver','Rhyme Text','Gold Text','Maroon Text','Glow Text','Shadow Text','Outline Text','Curve Text','Vertical Text','Letter Spacing','Line Spacing','Text Warp','Text Safe Zone','Emoji Labels','Free Draw','Brush','Eraser','Shape Tool','Arrow Tool'
  ]},
  { id: 'MBW', label: '♠️ MBW SIGNATURE VAULT 👑', tools: [
    'ACE Crown','Pentagram Aura','Pentagram Outer Orbit','Golden Halo','Maroon Wings','Gold Wings','Wall Shadow','Diamond Seal','ACE Badge','Candle Light','Smoke Crown','Black Gold Forge','Deep Maroon Chamber','Royal Amber Glow','Dark Velvet Tone','Cinematic Grain'
  ]},
  { id: 'TRANSPLANT', label: '👑 BECOME THE MODEL 🧍', tools: [
    'Poster World Lock','Old Model Mask','User Model Intake','Soul Cutout','Royal Face Lock','Body Proportion Lock','Model Slot Fit','Face Target Align','Body Target Align','MBW Light Match','Color Match','Shadow Seat Blend','Foreground Seal','Crown Auto Fit','Star Safe Path','Text Safe Zone','Poster Background Integrity'
  ]},
  { id: 'HISTORY', label: '⚖️ HISTORY & EDIT COURT 💾', tools: [
    'Undo','Redo','Snapshot','Save Version','Rename Version','Restore Version','Compare Versions','Original View','Before After Slider','Three-Way Court','Favorite Version','Delete Version','Final Seal'
  ]},
  { id: 'EXPORT', label: '📤 EXPORT FORGE 🛡️', tools: [
    'Profile Export','Poster Export','Story Export','Wallpaper Export','Game Avatar Export','Merch Preview Export','JPEG Export','PNG Export','Transparent PNG Export','High Quality Export','Compressed Export','Vault Save','Metadata Strip','Watermark Control'
  ]},
]);

export const ALL_EDIT_TOOLS = Object.freeze(
  EDIT_TOOL_GROUPS.flatMap((group) => group.tools.map((tool) => ({
    id: `${group.id}_${tool.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`,
    groupId: group.id,
    groupLabel: group.label,
    label: tool,
  })))
);

export const TRANSPLANT_ACCEPTANCE = Object.freeze([
  'POSTER_WORLD_LOCKED','BACKGROUND_UNCHANGED','OLD_MODEL_REMOVED_OR_HIDDEN','USER_MODEL_INSERTED',
  'FACE_LOCK_PASS','BODY_PROPORTION_LOCK_PASS','MODEL_SLOT_FIT_PASS','CUTOUT_EDGE_PASS',
  'LIGHT_MATCH_PASS','SHADOW_BLEND_PASS','FOREGROUND_LAYER_PASS','STAR_SAFE_ZONE_PASS',
  'TEXT_SAFE_ZONE_PASS','VERSION_SAVED','EXPORT_READY'
]);
