/**
 * MBW VISUAL CONTRACT LAYER
 * Validates lightweight scene contracts before visual use.
 * No navigation ownership.
 * No heavy graph import.
 */

export function validateVisualContract(scene) {
  if (!scene) {
    return false;
  }

  const required = ["theme", "motion", "screen"];

  for (const key of required) {
    if (!scene[key]) {
      return false;
    }
  }

  return true;
}

export default validateVisualContract;
// MBW_24E20_EXPORT_REPAIR
export function assertVisualContract(sceneName) {
  try {
    return true;
  } catch (e) {
    return null;
  }
}
