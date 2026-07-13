export const TRIPLE_CORE_SENTINEL = {
  name: "TripleCoreSentinel",
  source: "fresh-active-root",
  layers: ["source", "visual", "runtime"],
  buildWordsAllowed: false,
  oldRootImportAllowed: false,
};

export function TripleCoreSentinel(snapshot = {}) {
  const sourceGreen = Boolean(snapshot.sourceGreen ?? true);
  const visualGreen = Boolean(snapshot.visualGreen ?? true);
  const runtimeGreen = Boolean(snapshot.runtimeGreen ?? false);
  return {
    ...TRIPLE_CORE_SENTINEL,
    sourceGreen,
    visualGreen,
    runtimeGreen,
    releaseReady: sourceGreen && visualGreen && runtimeGreen,
  };
}

export default TripleCoreSentinel;
