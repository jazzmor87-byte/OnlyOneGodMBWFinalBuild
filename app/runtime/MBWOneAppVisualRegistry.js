export const MBW_ONE_APP_VISUAL_CONTRACT = Object.freeze({
  version: 'MBW_18AR_SINGLE_APP_VISUAL_BODY_ENGINE_RECOVERY',
  brand: 'MEN BEHIND WALL',
  appMode: 'ONE_SINGLE_MBW_APP',
  colors: ['black', 'gold', 'maroon'],
  gates: {
    cinematicIntro: true,
    liveVisualBody: true,
    pentagramStar: true,
    headlineCycle: true,
    safePosterZone: true,
    allScreensInheritBody: true,
    finalApk: true,
    hermes: true,
    fingerprintSkipped: true,
  },
  forbidden: {
    storageBuildSource: true,
    productionBuild: true,
    nodeModulesPatch: true,
    gitPatch: true,
    oldRootImport: true,
  },
});

export const MBW_SCREEN_VISUAL_DEFAULTS = Object.freeze({
  headline: 'MEN BEHIND WALL',
  safeHeadline: 'TWO PATHS. ONE EMPIRE.',
});
