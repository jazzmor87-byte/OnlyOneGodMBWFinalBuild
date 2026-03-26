import { Audio } from 'expo-av';

let ambient;

export const startAmbient = async () => {
  ambient = new Audio.Sound();
  await ambient.loadAsync(require('../assets/sounds/ambient.wav'));

  await ambient.setIsLoopingAsync(true);
  await ambient.setVolumeAsync(0.15); // very subtle
  await ambient.playAsync();
};

export const stopAmbient = async () => {
  if(ambient){
    await ambient.stopAsync();
  }
};


export const setAmbientMode = async (mode) => {
  if(!ambient) return;

  // Smooth transition helper
  const setVol = async (v) => {
    await ambient.setVolumeAsync(v);
  };

  if(!ambient) return;

  if(mode === "lounge"){
    await setVol(0.22); // warm
  }
  else if(mode === "game"){
    await setVol(0.08); // quiet
  }
  else if(mode === "match"){
    await setVol(0.14); // balanced
  }
};
