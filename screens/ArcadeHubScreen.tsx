import { CoinSystem } from '../core/wallet/CoinSystem';
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useMBWEngine } from "../core/hooks/useMBWEngine";
import { PentagramWheel } from "../core/visual/PentagramWheel";
import MBWSingleAppVisualBody from '../app/components/MBWSingleAppVisualBody';

function ArcadeHubScreenContent() {
  const engine = useMBWEngine();
  const [coins, setCoins] = useState(CoinSystem.getBalance());

  useEffect(() => {
    engine.start();
    const unsub = CoinSystem.subscribe(setCoins);
    return unsub;
  }, []);

  return (
    <View style={{
      flex: 1,
      backgroundColor: "#000000",
      justifyContent: "center",
      alignItems: "center",
      padding: 20
    }}>

      <Text style={{ color: "#00ff88", fontSize: 20, marginBottom: 10 }}>
        MBW PENTAGRAM ARCADE WHEEL
      </Text>

      <Text style={{ color: "#fff", marginBottom: 10 }}>
        COINS: {coins}
      </Text>

      <Text style={{ color: "#00ff88", marginBottom: 20 }}>
        LEVEL: {engine.status}
      </Text>

      <PentagramWheel
        onSelect={(g) => {
          if (g === "COIN") CoinSystem.earn(10);
          if (g === "BOSS") CoinSystem.spend(5);
}}
      />

    </View>
  );
}

// MBW VISUAL PRESENCE LOCK ACTIVE

// MBW_24E26B_VISUAL_OWNER_REPAIR
export default function ArcadeHubScreenMBWVisualOwned(props) {
  return (
    <MBWSingleAppVisualBody screenName="ArcadeHubScreen">
      <ArcadeHubScreenContent {...props} />
    </MBWSingleAppVisualBody>
  );
}

