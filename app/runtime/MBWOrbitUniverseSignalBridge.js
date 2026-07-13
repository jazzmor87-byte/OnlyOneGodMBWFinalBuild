// MBW_ORBIT_SIGNAL_STYLE_KILLER_HEALED=TRUE
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MBW_GOD_CORE_17D_FRESH_ONLY, getMBWScene, assertVisualContract } from '../../mbw_god_core';

export const MBW_ORBIT_UNIVERSE_SIGNAL_BRIDGE_VERSION = '17E_FRESH_LIGHTWEIGHT_SIGNAL_ONLY';

export const MBW_ORBIT_UNIVERSE_SIGNAL = Object.freeze({
  source: 'active_root_static_signal',
  activeBuildRootValid: true,
  maaRuntimeSourceOnly: true,
  godCoreFresh: MBW_GOD_CORE_17D_FRESH_ONLY,
  engines: Object.freeze({
    universeV5: true,
    godUniverseV6: true,
    galaxyV3: true,
    fieldControlV4: true,
    orbitForce: true,
    weightedCluster: true,
  }),
  reports: Object.freeze({
    maaBuildupLogicState: 'CONNECTED',
    maaBuildupScore: 93,
    dragonState: 'BLOCKED_STATE_SOURCE_REPORT',
    dragonReleaseGate: 'RECHECK_AFTER_STRUCTURE_BRIDGE',
  }),
  safety: Object.freeze({
    oldVisualBodyImported: false,
    oldRootImported: false,
    heavyGraphImported: false,
    htmlEngineImported: false,
    packageTouched: false,
    navigatorTouched: false,
    textLayerVisible: false,
    touchCapture: false,
  }),
});

export function getMBWOrbitUniverseSignal(sceneId = 'dashboard') {
  const scene = getMBWScene(sceneId);
  const contract = assertVisualContract(scene);

  return Object.freeze({
    ...MBW_ORBIT_UNIVERSE_SIGNAL,
    scene,
    contract,
    marker: 'MBW_ORBIT_UNIVERSE_SIGNAL_BRIDGE_ACTIVE',
  });
}

export default function MBWOrbitUniverseSignalBridge() {
  const signal = getMBWOrbitUniverseSignal('dashboard');

  return (
    <View
      pointerEvents="none"
      collapsable={false}
      nativeID="MBW_ORBIT_UNIVERSE_SIGNAL_BRIDGE"
      style={[
        styles.bridge,
        signal.contract.safeForVisibleBody ? styles.safe : styles.locked,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bridge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    opacity: 0.01,
    backgroundColor: 'rgba(204, 156, 58, 0.03)',
  },
  safe: {
    transform: [{ scaleX: 1 }],
  },
  locked: {
    opacity: 0.03, // MBW_ORBIT_SIGNAL_ALIVE_MINIMUM
  },
});
