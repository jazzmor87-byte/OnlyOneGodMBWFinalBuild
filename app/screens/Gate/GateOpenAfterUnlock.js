import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing
} from "react-native";

const BG = require("../../assets/gate/open.png");

const GOLD_DUST = [
  { left: "10%", top: "26%", size: 4 },
  { left: "18%", top: "18%", size: 3 },
  { left: "22%", top: "34%", size: 5 },
  { left: "28%", top: "24%", size: 2 },
  { left: "35%", top: "30%", size: 4 },
  { left: "42%", top: "22%", size: 3 },
  { left: "50%", top: "28%", size: 5 },
  { left: "58%", top: "18%", size: 2 },
  { left: "66%", top: "26%", size: 4 },
  { left: "74%", top: "20%", size: 3 },
  { left: "82%", top: "30%", size: 5 },
  { left: "88%", top: "22%", size: 2 }
];

const STARS = [
  { left: "12%", top: "20%", size: 2 },
  { left: "24%", top: "12%", size: 2 },
  { left: "38%", top: "16%", size: 1.5 },
  { left: "48%", top: "10%", size: 2.5 },
  { left: "61%", top: "18%", size: 1.5 },
  { left: "73%", top: "11%", size: 2 },
  { left: "86%", top: "17%", size: 1.5 }
];

export default function GateOpenAfterUnlock({ navigation }) {
  const fire = useRef(new Animated.Value(0)).current;
  const air = useRef(new Animated.Value(0)).current;
  const water = useRef(new Animated.Value(0)).current;
  const gold = useRef(new Animated.Value(0)).current;
  const space = useRef(new Animated.Value(0)).current;
  const ui = useRef(new Animated.Value(0)).current;
  const button = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (value, a, b) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: a,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: b,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      );

    const loops = [
      pulse(fire, 2300, 2500),
      pulse(air, 4200, 3900),
      pulse(water, 3400, 3300),
      pulse(gold, 3600, 3400),
      pulse(space, 5400, 5100),
      pulse(ui, 3000, 3200),
      pulse(button, 2800, 2900)
    ];

    loops.forEach((anim) => anim.start());
    return () => loops.forEach((anim) => anim.stop());
  }, [air, button, fire, gold, space, ui, water]);

  const fireOpacity = fire.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.18] });
  const fireX = fire.interpolate({ inputRange: [0, 1], outputRange: [-4, 8] });
  const fireY = fire.interpolate({ inputRange: [0, 1], outputRange: [6, -6] });

  const airOpacity = air.interpolate({ inputRange: [0, 1], outputRange: [0.04, 0.10] });
  const airX = air.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] });

  const waterOpacity = water.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.12] });
  const waterY = water.interpolate({ inputRange: [0, 1], outputRange: [10, -8] });

  const goldOpacity = gold.interpolate({ inputRange: [0, 1], outputRange: [0.10, 0.22] });
  const goldY = gold.interpolate({ inputRange: [0, 1], outputRange: [8, -6] });

  const spaceOpacity = space.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.14] });
  const spaceScale = space.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  const topY = ui.interpolate({ inputRange: [0, 1], outputRange: [1.5, -2.5] });
  const bottomY = ui.interpolate({ inputRange: [0, 1], outputRange: [2, -3] });
  const titleGlow = ui.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });
  const bodyGlow = ui.interpolate({ inputRange: [0, 1], outputRange: [0.88, 0.97] });

  const buttonY = button.interpolate({ inputRange: [0, 1], outputRange: [1.5, -3] });
  const buttonGlow = button.interpolate({ inputRange: [0, 1], outputRange: [0.90, 1] });

  return (
    <ImageBackground source={BG} style={s.bg} resizeMode="cover">
      <View style={s.scrim} />
      <View style={s.fx} pointerEvents="none">
        <Animated.View
          style={[
            s.fireGlow,
            {
              opacity: fireOpacity,
              transform: [{ translateX: fireX }, { translateY: fireY }]
            }
          ]}
        />
        <Animated.View
          style={[
            s.airVeil,
            {
              opacity: airOpacity,
              transform: [{ translateX: airX }]
            }
          ]}
        />
        <Animated.View
          style={[
            s.waterGlow,
            {
              opacity: waterOpacity,
              transform: [{ translateY: waterY }]
            }
          ]}
        />
        <Animated.View
          style={[
            s.goldField,
            {
              opacity: goldOpacity,
              transform: [{ translateY: goldY }]
            }
          ]}
        >
          {GOLD_DUST.map((d, i) => (
            <View
              key={"g" + i}
              style={[
                s.goldDot,
                { left: d.left, top: d.top, width: d.size, height: d.size, borderRadius: d.size / 2 }
              ]}
            />
          ))}
        </Animated.View>
        <Animated.View
          style={[
            s.spaceGlow,
            {
              opacity: spaceOpacity,
              transform: [{ scale: spaceScale }]
            }
          ]}
        />
        <Animated.View style={[s.spaceField, { opacity: spaceOpacity }]}>
          {STARS.map((d, i) => (
            <View
              key={"s" + i}
              style={[
                s.starDot,
                { left: d.left, top: d.top, width: d.size, height: d.size, borderRadius: d.size / 2 }
              ]}
            />
          ))}
        </Animated.View>
      </View>

      <View style={s.wrap}>
        <Animated.View style={[s.floatTop, { transform: [{ translateY: topY }], opacity: titleGlow }]}>
          <Animated.Text style={[s.top, { opacity: titleGlow }]}>THE GATE IS OPEN</Animated.Text>
        </Animated.View>

        <Animated.View style={[s.floatBottom, { transform: [{ translateY: bottomY }] }]}>
          <Animated.Text style={[s.h, { opacity: titleGlow }]}>
            GOD LET YOU PASS THROUGH THE GATE LOCK
          </Animated.Text>
          <Animated.Text style={[s.p, { opacity: bodyGlow }]}>
            to be a free man where you can do things which you like in your way, but you are watched by God.
          </Animated.Text>

          <Animated.View style={{ transform: [{ translateY: buttonY }], opacity: buttonGlow }}>
            <TouchableOpacity style={s.btn} onPress={() => navigation.replace("PathSelection")} activeOpacity={0.9}>
              <View style={s.btnAura} pointerEvents="none" />
              <Animated.Text style={[s.t, { opacity: buttonGlow }]}>ENTER FURTHER</Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#000" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },
  fx: { ...StyleSheet.absoluteFillObject },
  wrap: { flex: 1, justifyContent: "space-between", padding: 14, paddingBottom: 16, paddingTop: 16 },

  fireGlow: {
    position: "absolute",
    left: "2%",
    top: "12%",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,110,40,0.90)"
  },
  airVeil: {
    position: "absolute",
    left: "18%",
    top: "28%",
    width: "64%",
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(238,231,210,0.90)"
  },
  waterGlow: {
    position: "absolute",
    right: "5%",
    bottom: "22%",
    width: 150,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(92,144,184,0.90)"
  },
  goldField: {
    position: "absolute",
    left: "4%",
    right: "4%",
    bottom: "10%",
    height: 120
  },
  goldDot: {
    position: "absolute",
    backgroundColor: "rgba(239,199,92,0.95)"
  },
  spaceGlow: {
    position: "absolute",
    right: "-6%",
    top: "8%",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(78,54,112,0.95)"
  },
  spaceField: {
    position: "absolute",
    left: "6%",
    right: "6%",
    top: "6%",
    height: 110
  },
  starDot: {
    position: "absolute",
    backgroundColor: "rgba(245,225,172,0.95)"
  },

  floatTop: {
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.26)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.80)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  top: { color: "#E6C977", fontSize: 13, fontWeight: "800", letterSpacing: 1.1, textAlign: "center" },

  floatBottom: {
    backgroundColor: "rgba(10,5,5,0.28)",
    borderWidth: 1.15,
    borderColor: "rgba(212,175,55,0.86)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  h: { color: "#FAE8B8", fontSize: 20, fontWeight: "900", textAlign: "center", lineHeight: 26 },
  p: { color: "#F7EBCB", fontSize: 12.5, textAlign: "center", marginTop: 10, marginBottom: 14, lineHeight: 18 },

  btn: {
    overflow: "hidden",
    borderWidth: 1.15,
    borderColor: "#D9B05A",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "rgba(12,5,5,0.26)"
  },
  btnAura: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(112,74,22,0.18)"
  },
  t: { color: "#FAE8B8", fontSize: 15, fontWeight: "900" }
});
