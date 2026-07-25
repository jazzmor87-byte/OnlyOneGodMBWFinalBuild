const lockedLayerContract = Object.freeze({
  background: true,
  foreground: true,
  text: true,
  logo: true,
  decorative: true,
});

const slot = (id, left, top, width, height) => Object.freeze({
  id,
  left,
  top,
  width,
  height,
  zIndex: 20,
  accepts: 'MALE_MODEL_ONLY',
  fit: 'COVER_EXACT_SLOT',
  transform: Object.freeze({
    scale: 1,
    rotation: 0,
    translateX: 0,
    translateY: 0,
    flipX: 1,
    flipY: 1,
  }),
});

const template = (id, title, posterSource, modelSlots) => Object.freeze({
  id,
  title,
  posterSource,
  foregroundSource: null,
  shadowSource: null,
  modelSlots: Object.freeze(modelSlots),
  replacementEnabled: modelSlots.length > 0,
  modelCount: modelSlots.length,
  lockedLayers: lockedLayerContract,
  exportWidth: 1080,
  exportHeight: 1600,
  proofState: 'SUPPLIED_POSTER_REVIEW_REQUIRED_ON_DEVICE',
});

export const MBW_POSTER_MODEL_SLOT_REGISTRY = Object.freeze([
  template(
    'PROFILE_ACTION',
    'PROFILE ACTION',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterActionScreen.jpg'),
    [slot('MODEL_1', 0.14, 0.08, 0.72, 0.86)]
  ),
  template(
    'PROFILE_ASSETS',
    'PROFILE ASSETS',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterAssetsScreen.jpg'),
    [
      slot('MODEL_1', 0.11, 0.05, 0.47, 0.91),
      slot('MODEL_2', 0.47, 0.05, 0.42, 0.91),
    ]
  ),
  template(
    'PROFILE_BUTTONS',
    'PROFILE BUTTONS',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterButtonsScreen.jpg'),
    [slot('MODEL_1', 0.12, 0.05, 0.76, 0.90)]
  ),
  template(
    'PROFILE_ENTRY',
    'PROFILE ENTRY',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterEntryScreen.jpg'),
    [slot('MODEL_1', 0.11, 0.05, 0.78, 0.90)]
  ),
  template(
    'PROFILE_LIVE',
    'PROFILE LIVE',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterLiveScreen.jpg'),
    [
      slot('MODEL_1', 0.10, 0.08, 0.46, 0.82),
      slot('MODEL_2', 0.44, 0.08, 0.46, 0.82),
    ]
  ),
  template(
    'PROFILE_LOGIC',
    'PROFILE LOGIC',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterLogicScreen.jpg'),
    [slot('MODEL_1', 0.14, 0.05, 0.72, 0.90)]
  ),
  template(
    'PROFILE_MOTION',
    'PROFILE MOTION',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterMotionScreen.jpg'),
    [
      slot('MODEL_1', 0.12, 0.08, 0.44, 0.82),
      slot('MODEL_2', 0.44, 0.08, 0.44, 0.82),
    ]
  ),
  template(
    'PROFILE_OVERVIEW',
    'PROFILE OVERVIEW',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterOverviewScreen.jpg'),
    [slot('MODEL_1', 0.10, 0.04, 0.80, 0.92)]
  ),
  template(
    'PROFILE_PANCHTATVA',
    'PROFILE PANCHTATVA',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterPanchTatvaScreen.jpg'),
    [
      slot('MODEL_1', 0.10, 0.04, 0.47, 0.92),
      slot('MODEL_2', 0.43, 0.04, 0.47, 0.92),
    ]
  ),
  template(
    'PROFILE_POSTER',
    'PROFILE POSTER',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterPosterScreen.jpg'),
    [slot('MODEL_1', 0.13, 0.04, 0.74, 0.92)]
  ),
  template(
    'PROFILE_PROOF',
    'PROFILE PROOF',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterProofScreen.jpg'),
    [
      slot('MODEL_1', 0.11, 0.08, 0.45, 0.82),
      slot('MODEL_2', 0.44, 0.08, 0.45, 0.82),
    ]
  ),
  template(
    'PROFILE_RESULT',
    'PROFILE RESULT',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterResultScreen.jpg'),
    [
      slot('MODEL_1', 0.10, 0.04, 0.47, 0.92),
      slot('MODEL_2', 0.43, 0.04, 0.47, 0.92),
    ]
  ),
  template(
    'PROFILE_RETURN',
    'PROFILE RETURN',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterReturnScreen.jpg'),
    [slot('MODEL_1', 0.12, 0.04, 0.76, 0.92)]
  ),
  template(
    'PROFILE_MAIN',
    'PROFILE MAIN',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterScreen.jpg'),
    [slot('MODEL_1', 0.09, 0.03, 0.82, 0.94)]
  ),
  template(
    'PROFILE_SEED',
    'PROFILE SEED',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterSeedScreen.jpg'),
    [slot('MODEL_1', 0.12, 0.04, 0.76, 0.92)]
  ),
  template(
    'PROFILE_STATE',
    'PROFILE STATE',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterStateScreen.jpg'),
    [slot('MODEL_1', 0.12, 0.04, 0.76, 0.92)]
  ),
  template(
    'PROFILE_VAULT',
    'PROFILE VAULT',
    require('../../../assets/mbw_clean_shuffled_visual_body_posters/ProfilePosterVaultScreen.jpg'),
    [
      slot('MODEL_1', 0.10, 0.08, 0.46, 0.82),
      slot('MODEL_2', 0.44, 0.08, 0.46, 0.82),
    ]
  ),
]);

export function getPosterTemplateById(id) {
  return MBW_POSTER_MODEL_SLOT_REGISTRY.find((item) => item.id === id)
    || MBW_POSTER_MODEL_SLOT_REGISTRY[0];
}

export function posterSupportsReplacement(templateValue) {
  return Boolean(templateValue?.replacementEnabled && templateValue?.modelSlots?.length);
}

export function validatePosterTemplateRegistry() {
  const errors = [];
  const ids = new Set();

  MBW_POSTER_MODEL_SLOT_REGISTRY.forEach((item) => {
    if (ids.has(item.id)) {
      errors.push(`DUPLICATE_TEMPLATE_ID:${item.id}`);
    }
    ids.add(item.id);

    if (![0, 1, 2].includes(item.modelSlots.length)) {
      errors.push(`UNSUPPORTED_MODEL_SLOT_COUNT:${item.id}:${item.modelSlots.length}`);
    }

    item.modelSlots.forEach((modelSlot) => {
      ['left', 'top', 'width', 'height'].forEach((key) => {
        const value = Number(modelSlot[key]);
        if (!Number.isFinite(value) || value < 0 || value > 1) {
          errors.push(`INVALID_SLOT_GEOMETRY:${item.id}:${modelSlot.id}:${key}`);
        }
      });

      if (modelSlot.left + modelSlot.width > 1.001) {
        errors.push(`SLOT_OVERFLOW_X:${item.id}:${modelSlot.id}`);
      }
      if (modelSlot.top + modelSlot.height > 1.001) {
        errors.push(`SLOT_OVERFLOW_Y:${item.id}:${modelSlot.id}`);
      }
    });
  });

  return Object.freeze({
    ok: errors.length === 0,
    templateCount: MBW_POSTER_MODEL_SLOT_REGISTRY.length,
    replacementTemplateCount: MBW_POSTER_MODEL_SLOT_REGISTRY.filter(posterSupportsReplacement).length,
    singleModelTemplateCount: MBW_POSTER_MODEL_SLOT_REGISTRY.filter((item) => item.modelSlots.length === 1).length,
    dualModelTemplateCount: MBW_POSTER_MODEL_SLOT_REGISTRY.filter((item) => item.modelSlots.length === 2).length,
    errors,
  });
}

export default MBW_POSTER_MODEL_SLOT_REGISTRY;
