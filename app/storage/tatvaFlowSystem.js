const TATVAS = ["fire", "air", "water", "gold", "space"];

let deck = [];
let lastTatva = null;
const assigned = new Map();

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function refillDeck() {
  const nextDeck = shuffle(TATVAS);
  if (lastTatva && nextDeck.length > 1 && nextDeck[0] === lastTatva) {
    [nextDeck[0], nextDeck[1]] = [nextDeck[1], nextDeck[0]];
  }
  deck = nextDeck;
}

export function getTatvas() {
  return [...TATVAS];
}

export function getAssignedTatva(screenKey) {
  return assigned.get(screenKey) || null;
}

export function assignTatva(screenKey) {
  if (assigned.has(screenKey)) {
    return assigned.get(screenKey);
  }
  if (!deck.length) {
    refillDeck();
  }
  const nextTatva = deck.shift();
  lastTatva = nextTatva;
  assigned.set(screenKey, nextTatva);
  return nextTatva;
}

export function resetTatvaFlow() {
  deck = [];
  lastTatva = null;
  assigned.clear();
}

export function peekTatvaDeck() {
  if (!deck.length) {
    refillDeck();
  }
  return [...deck];
}
