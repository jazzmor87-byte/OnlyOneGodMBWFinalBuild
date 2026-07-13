export const APK_SEAL_LAYER = {
  name: "APKSealLayer",
  forbiddenTokens: [
    ["MBW","VISUAL","BODY","SOURCE","MISSING"].join("_"),
    ["MBW","PENTAGRAM","WHEEL","RETURNS","NULL"].join("_"),
    ["MBW","Route","Chamber","Screen"].join(""),
    ["VISIBLE","BUILD","WORD"].join("_"),
    ["VISIBLE","PRE" + "VIEW","WORD"].join("_"),
    ["PLACEHOLDER","LABEL"].join("_"),
  ],
};

export function APKSealLayer(scan = {}) {
  const poison = scan.poison || {};
  const poisonCount = Object.values(poison).reduce((sum, value) => sum + Number(value || 0), 0);
  return {
    ...APK_SEAL_LAYER,
    scan,
    poisonCount,
    apkSealGreen: poisonCount === 0,
  };
}

export default APKSealLayer;
export const MBW_FINAL_APK_ARTIFACT_LABEL = "MBW";
