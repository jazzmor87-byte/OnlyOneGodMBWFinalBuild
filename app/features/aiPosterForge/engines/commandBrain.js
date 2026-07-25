const COMMAND_RULES = [
  { terms: ['make it royal','royal','king'], actions: ['ACE_CROWN','GOLD_GLOW','DEPTH_POWER'] },
  { terms: ['make it darker','dark','night'], actions: ['DARK_WALL','MAROON_SHADOW','VIGNETTE'] },
  { terms: ['more gold','golden'], actions: ['ROYAL_AMBER','GOLD_HIGHLIGHT'] },
  { terms: ['more maroon'], actions: ['MAROON_AURA','VELVET_DEPTH'] },
  { terms: ['keep face same','same face','face lock'], actions: ['ROYAL_FACE_LOCK'] },
  { terms: ['keep body same','body lock'], actions: ['BODY_PROPORTION_LOCK'] },
  { terms: ['remove background','cut me out'], actions: ['SOUL_CUTOUT'] },
  { terms: ['blur background'], actions: ['SUBJECT_LOCK','BACKGROUND_BLUR'] },
  { terms: ['background only'], actions: ['SUBJECT_LOCK','BACKGROUND_EDIT_ONLY'] },
  { terms: ['put me inside poster','become the model','replace model'], actions: ['BECOME_THE_MODEL','MODEL_SLOT_FIT'] },
  { terms: ['make poster'], actions: ['POSTER_FORGE','POSTER_EXPORT'] },
  { terms: ['add crown'], actions: ['ACE_CROWN','CROWN_AUTO_FIT'] },
  { terms: ['add star','pentagram'], actions: ['PENTAGRAM_AURA','STAR_SAFE_PATH'] },
  { terms: ['make sharper','make clear'], actions: ['SHARPEN','CLARITY'] },
  { terms: ['save final'], actions: ['SAVE_VERSION','FINAL_SEAL'] },
];

export function parseForgeCommand(input = '') {
  const normalized = String(input).trim().toLowerCase();
  const actions = [];
  COMMAND_RULES.forEach((rule) => {
    if (rule.terms.some((term) => normalized.includes(term))) actions.push(...rule.actions);
  });
  return {
    input,
    normalized,
    actions: [...new Set(actions)],
    understood: actions.length > 0,
    executionLane: 'LOCAL_MBW_COMMAND_ENGINE',
    paidApiRequired: false,
  };
}
