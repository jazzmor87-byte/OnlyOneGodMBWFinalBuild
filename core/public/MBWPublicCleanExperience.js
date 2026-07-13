export const MBW_PUBLIC_CLEAN_EXPERIENCE = {
  name: "MBWPublicCleanExperience",
  publicAppWordsAllowed: false,
  debugBarsAllowed: false,
  buildWordsAllowed: false,
  stageWordsAllowed: false,
  placeholderLabelsAllowed: false,
  fallbackVisualBodyAllowed: false,
};

export const MBW_PUBLIC_POISON_DEFINITION_TERMS = [
  ["MBW","VISUAL","BODY","SOURCE","MISSING"].join("_"),
  ["MBW","PENTAGRAM","WHEEL","RETURNS","NULL"].join("_"),
  ["MBW","Route","Chamber","Screen"].join(""),
  ["VISIBLE","BUILD","WORD"].join("_"),
  "VISIBLE_FINAL_STAGE_WORD",
  ["PLACEHOLDER","LABEL"].join("_"),
];

export function assertPublicCleanExperience(snapshot = {}) {
  const source = String(snapshot.source || "");
  const hits = MBW_PUBLIC_POISON_DEFINITION_TERMS.filter((term) => source.includes(term));
  return {
    ...MBW_PUBLIC_CLEAN_EXPERIENCE,
    definitionTerms: MBW_PUBLIC_POISON_DEFINITION_TERMS,
    hits,
    green: hits.length === 0,
  };
}

export default MBW_PUBLIC_CLEAN_EXPERIENCE;
