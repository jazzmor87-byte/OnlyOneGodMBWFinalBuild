export const TATVA_VISUALS = {
  fire: {
    key: "fire",
    title: "Fire",
    glow: "rgba(156,52,18,0.26)",
    veil: "rgba(255,141,74,0.12)",
    edge: "rgba(214,117,58,0.55)",
    text: "#F6D1A8",
    buttonAura: "rgba(122,58,20,0.16)",
    particle: "ember"
  },
  air: {
    key: "air",
    title: "Air",
    glow: "rgba(136,150,162,0.18)",
    veil: "rgba(222,232,238,0.10)",
    edge: "rgba(198,210,218,0.42)",
    text: "#E6E2D4",
    buttonAura: "rgba(160,175,186,0.12)",
    particle: "mist"
  },
  water: {
    key: "water",
    title: "Water",
    glow: "rgba(48,96,132,0.20)",
    veil: "rgba(122,177,214,0.10)",
    edge: "rgba(100,158,196,0.44)",
    text: "#DCE9F2",
    buttonAura: "rgba(52,92,126,0.14)",
    particle: "rain"
  },
  gold: {
    key: "gold",
    title: "Gold Realm",
    glow: "rgba(120,86,22,0.22)",
    veil: "rgba(236,192,84,0.10)",
    edge: "rgba(220,173,73,0.58)",
    text: "#F7E7B6",
    buttonAura: "rgba(112,74,22,0.18)",
    particle: "dust"
  },
  space: {
    key: "space",
    title: "Space",
    glow: "rgba(58,44,88,0.22)",
    veil: "rgba(118,98,160,0.08)",
    edge: "rgba(132,112,176,0.42)",
    text: "#E7DCF7",
    buttonAura: "rgba(64,48,98,0.14)",
    particle: "stars"
  }
};

export const TATVA_ORDER = ["fire", "air", "water", "gold", "space"];

export function getTatvaVisual(tatva) {
  return TATVA_VISUALS[tatva] || TATVA_VISUALS.gold;
}

export function getTatvaOrder() {
  return [...TATVA_ORDER];
}

export function hasTatvaVisual(tatva) {
  return Boolean(TATVA_VISUALS[tatva]);
}
