import { Audio } from 'expo-av';

let intro;

export const loadIntro = async () => {
  intro = new Audio.Sound();
  await intro.loadAsync(require('../assets/sounds/intro.wav'));
};

export const playIntro = async () => {
  if(intro){
    await intro.setVolumeAsync(0.5);
    await intro.playAsync();
  }
};
