import { View } from 'react-native';
/**
 * MBW SCENE REGISTRY BRAIN
 * Single truth source for MBW UI scenes.
 * This file is a lightweight contract only.
 * No navigation ownership.
 * No heavy graph import.
 */

export const SceneRegistry = {
  dashboard: {
    screen: "MainHub",
    theme: "black-gold-maroon",
    motion: "float-in",
    layer: "main-dashboard"
  },
  arcade: {
    screen: "Games",
    theme: "black-gold-maroon",
    motion: "zoom-flow",
    layer: "arcade-pentagram"
  }
};

export default SceneRegistry;
// MBW_24E20_EXPORT_REPAIR
export function getMBWScene(sceneName) {
  try {
    return MBW_SCENE_REGISTRY?.[sceneName] || MBW_SCENE_REGISTRY?.[String(sceneName || '').trim()] || null;
  } catch (e) {
    return null;
  }
}
