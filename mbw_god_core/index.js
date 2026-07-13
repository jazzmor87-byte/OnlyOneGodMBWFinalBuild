export {
  getMBWScene
} from './registry/SceneRegistry';
export {
  validateVisualContract,
  assertVisualContract
} from './visual/VisualContract';
export { MBW_CINEMATIC_ORCHESTRATOR_VERSION, CinematicOrchestrator } from './engine/CinematicOrchestrator';

export const MBW_GOD_CORE_17D_FRESH_ONLY = Object.freeze({
  source: 'active_root_fresh_created',
  oldVisualBodyImported: false,
  oldRootImported: false,
  heavyGraphImported: false,
  htmlEngineImported: false,
  navigatorTouched: false,
  packageTouched: false,
});
