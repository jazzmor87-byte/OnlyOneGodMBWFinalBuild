import { getMBWScene } from '../registry/SceneRegistry';
import { assertVisualContract } from '../visual/VisualContract';

export const MBW_CINEMATIC_ORCHESTRATOR_VERSION = '17D_FRESH_GOD_CORE';

export class CinematicOrchestrator {
  constructor(initialScene = 'dashboard') {
    this.sceneId = initialScene;
    this.scene = getMBWScene(initialScene);
    this.contract = assertVisualContract(this.scene);
  }

  boot() {
    this.scene = getMBWScene(this.sceneId);
    this.contract = assertVisualContract(this.scene);
    return this.snapshot();
  }

  setScene(sceneId) {
    this.sceneId = sceneId;
    this.scene = getMBWScene(sceneId);
    this.contract = assertVisualContract(this.scene);
    return this.snapshot();
  }

  getScene() {
    return this.scene;
  }

  snapshot() {
    return Object.freeze({
      sceneId: this.sceneId,
      scene: this.scene,
      contract: this.contract,
      navigationControl: false,
      visibleText: false,
      touchCapture: false,
      oldVisualBody: false,
    });
  }
}

export default CinematicOrchestrator;
