let tier = "FREE";

export const upgradeTier = (t) => {
  tier = t;
  return tier;
};

export const getTier = () => tier;
