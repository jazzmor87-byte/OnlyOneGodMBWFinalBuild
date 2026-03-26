import { posterShuffleByPath, posterShuffleByStem } from "./posterShuffleAssets";

export function getPosterPoolForScreen(screenPath = "", screenStem = "") {
  const byPath = posterShuffleByPath[screenPath] || [];
  const byStem = posterShuffleByStem[screenStem] || [];
  return byPath.length ? byPath : byStem;
}

export function pickPosterForIndex(pool = [], index = 0) {
  if (!pool || !pool.length) return null;
  return pool[Math.abs(index) % pool.length];
}
