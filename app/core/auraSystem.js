let auraLevel = 0;
let lastUpdate = Date.now();

export const updateAura = (action) => {
  const now = Date.now();
  const diff = (now - lastUpdate) / 1000;

  // decay every 60s
  if(diff > 60) auraLevel = Math.max(0, auraLevel - 1);

  if(action === "lounge") auraLevel += 1;
  if(action === "message") auraLevel += 2;
  if(action === "match") auraLevel += 3;

  auraLevel = Math.min(auraLevel, 4);
  lastUpdate = now;

  return auraLevel;
};

export const getAuraLevel = () => auraLevel;

export const getAuraName = (level) => {
  const states = ["Dormant","Rising","Aligned","Ignited","Ascended"];
  return states[level] || "Dormant";
};
