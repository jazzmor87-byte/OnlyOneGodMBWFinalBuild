import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useMBWEngine } from "../core/hooks/useMBWEngine";
import { PentagramWheel } from "../core/visual/PentagramWheel";
import { CoinSystem } from "../core/wallet/CoinSystem";
import MBWSingleAppVisualBody from '../app/components/MBWSingleAppVisualBody';

function DashboardScreenContent() {
  const engine = useMBWEngine();

  useEffect(() => {
    engine.start?.();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000000", padding: 20 }}>

      <Text style={{ color: "#00ff88", fontSize: 22 }}>
        MBW ARCADE VISUAL CORE
      </Text>

      <Text style={{ color: "#fff" }}>
        COINS: {CoinSystem.getBalance?.() ?? 0}
      </Text>

      <Text style={{ color: engine.color }}>
        STATUS: {engine.status}
      </Text>

      <Text style={{ color: "#aaa" }}>
        STABILITY: {engine.stability}
      </Text>

      <PentagramWheel engine={engine} />

    </View>
  );
}

// MBW VISUAL PRESENCE LOCK ACTIVE

// MBW_24E26B_VISUAL_OWNER_REPAIR
export default function DashboardScreenMBWVisualOwned(props) {
  return (
    <MBWSingleAppVisualBody screenName="DashboardScreen">
      <DashboardScreenContent {...props} />
    </MBWSingleAppVisualBody>
  );
}

