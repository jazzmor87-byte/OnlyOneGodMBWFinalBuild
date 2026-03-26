import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { getAuraLevel } from './auraSystem';

let typingSound, winSound, clickSound;

export const loadSounds = async () => {
  typingSound = new Audio.Sound();
  winSound = new Audio.Sound();
  clickSound = new Audio.Sound();

  await typingSound.loadAsync(require('../assets/sounds/typing.wav'));
  await winSound.loadAsync(require('../assets/sounds/win.wav'));
  await clickSound.loadAsync(require('../assets/sounds/click.wav'));
};

export const playTyping = async () => {
  const aura = getAuraLevel();
  await typingSound.setVolumeAsync(0.2 + aura*0.1);
  const pan = Math.random() > 0.5 ? -1 : 1;
await typingSound.setPanAsync(pan);
await typingSound.replayAsync();

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const playWin = async () => {
  const aura = getAuraLevel();
  await winSound.setVolumeAsync(0.4 + aura*0.2);
  await winSound.replayAsync();

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const playClick = async () => {
  await clickSound.setVolumeAsync(0.2);
  await clickSound.replayAsync();

  Haptics.selectionAsync();
};
