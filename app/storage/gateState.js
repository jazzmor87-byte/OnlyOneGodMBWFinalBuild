
let unlocked = false;

export const unlockGate = () => {
  unlocked = true;
};

export const isGateUnlocked = () => unlocked;
