"use strict";

const SUITS = ["S", "H", "D", "C"];
const LUDO_SAFE = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
const LUDO_SEATS = { 2: [0, 2], 4: [0, 1, 2, 3] };
const LUDO_STARTS = [0, 13, 26, 39];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertPlayers(playerCount) {
  if (![2, 4].includes(playerCount)) {
    throw new Error("PLAYER_COUNT_MUST_BE_2_OR_4");
  }
}

function nextPlayer(state) {
  return (state.currentPlayer + 1) % state.playerCount;
}

function createLudo(playerCount = 2) {
  assertPlayers(playerCount);
  return {
    kind: "LUDO",
    playerCount,
    seats: LUDO_SEATS[playerCount],
    players: Array.from({ length: playerCount }, (_, index) => ({
      id: index,
      tokens: [-1, -1, -1, -1],
    })),
    currentPlayer: 0,
    dice: null,
    consecutiveSixes: 0,
    message: "ROLL THE DICE",
    winner: null,
  };
}

function ludoGlobalTrack(state, playerIndex, progress) {
  if (progress < 0 || progress > 51) return null;
  const seat = state.seats[playerIndex];
  return (LUDO_STARTS[seat] + progress) % 52;
}

function ludoValidMoves(state, dice = state.dice) {
  if (!dice || state.winner !== null) return [];
  const tokens = state.players[state.currentPlayer].tokens;
  const valid = [];

  tokens.forEach((progress, tokenIndex) => {
    if (progress === 57) return;
    if (progress === -1 && dice === 6) {
      valid.push(tokenIndex);
      return;
    }
    if (progress >= 0 && progress + dice <= 57) {
      valid.push(tokenIndex);
    }
  });

  return valid;
}

function ludoRoll(state, forcedDice = null) {
  const next = clone(state);
  if (next.dice !== null || next.winner !== null) return next;

  const dice = forcedDice || (1 + Math.floor(Math.random() * 6));
  next.dice = dice;
  next.consecutiveSixes = dice === 6 ? next.consecutiveSixes + 1 : 0;

  if (next.consecutiveSixes >= 3) {
    next.message = "THREE SIXES — TURN FORFEITED";
    next.dice = null;
    next.consecutiveSixes = 0;
    next.currentPlayer = nextPlayer(next);
    return next;
  }

  const valid = ludoValidMoves(next, dice);
  next.message = valid.length
    ? `DICE ${dice} — CHOOSE A TOKEN`
    : `DICE ${dice} — NO VALID MOVE`;

  if (!valid.length) {
    next.dice = null;
    if (dice !== 6) next.currentPlayer = nextPlayer(next);
  }

  return next;
}

function ludoMove(state, tokenIndex) {
  const next = clone(state);
  const dice = next.dice;
  const valid = ludoValidMoves(next, dice);

  if (!valid.includes(tokenIndex)) {
    throw new Error("INVALID_LUDO_MOVE");
  }

  let progress = next.players[next.currentPlayer].tokens[tokenIndex];
  progress = progress === -1 ? 0 : progress + dice;
  next.players[next.currentPlayer].tokens[tokenIndex] = progress;

  let captured = false;
  const global = ludoGlobalTrack(next, next.currentPlayer, progress);

  if (global !== null && !LUDO_SAFE.has(global)) {
    next.players.forEach((player, playerIndex) => {
      if (playerIndex === next.currentPlayer) return;
      player.tokens = player.tokens.map(opponentProgress => {
        const opponentGlobal = ludoGlobalTrack(
          next,
          playerIndex,
          opponentProgress
        );
        if (opponentGlobal === global) {
          captured = true;
          return -1;
        }
        return opponentProgress;
      });
    });
  }

  const won = next.players[next.currentPlayer].tokens.every(
    value => value === 57
  );

  if (won) {
    next.winner = next.currentPlayer;
    next.message = `PLAYER ${next.currentPlayer + 1} WINS`;
    next.dice = null;
    return next;
  }

  const extraTurn = dice === 6 || captured;
  next.message = captured ? "CAPTURE — EXTRA TURN" : "MOVE COMPLETE";
  next.dice = null;

  if (!extraTurn) {
    next.currentPlayer = nextPlayer(next);
    next.consecutiveSixes = 0;
  }

  return next;
}

function createDeck() {
  let id = 0;
  return SUITS.flatMap(suit =>
    Array.from({ length: 13 }, (_, index) => ({
      id: `${suit}-${index + 1}-${id++}`,
      suit,
      rank: index + 1,
    }))
  );
}

function shuffle(deck, random = Math.random) {
  const result = [...deck];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function dealSeepHands(state) {
  for (let round = 0; round < 4; round += 1) {
    for (let player = 0; player < state.playerCount; player += 1) {
      if (state.deck.length) state.hands[player].push(state.deck.shift());
    }
  }
  return state;
}

function createSeep(playerCount = 2, random = Math.random) {
  assertPlayers(playerCount);
  const deck = shuffle(createDeck(), random);
  const state = {
    kind: "SEEP",
    playerCount,
    deck,
    hands: Array.from({ length: playerCount }, () => []),
    table: [],
    captured: Array.from({ length: playerCount }, () => []),
    sweeps: Array.from({ length: playerCount }, () => 0),
    currentPlayer: 0,
    lastCapturer: 0,
    finished: false,
    message: "SELECT A HAND CARD",
  };

  state.table = state.deck.splice(0, 4).map(card => ({
    type: "CARD",
    id: card.id,
    value: card.rank,
    cards: [card],
  }));

  return dealSeepHands(state);
}

function seepSelectedItems(state, tableIds) {
  const wanted = new Set(tableIds);
  return state.table.filter(item => wanted.has(item.id));
}

function seepBuildValues(state, handIndex, tableIds) {
  const hand = state.hands[state.currentPlayer];
  const played = hand[handIndex];
  if (!played) return [];

  const selected = seepSelectedItems(state, tableIds);
  if (selected.some(item => item.type === "HOUSE")) return [];

  const base = played.rank + selected.reduce(
    (total, item) => total + item.value,
    0
  );

  return [...new Set(
    hand
      .filter((_, index) => index !== handIndex)
      .map(card => card.rank)
      .filter(rank => rank === base && rank <= 13)
  )];
}

function seepCanCapture(state, handIndex, tableIds) {
  const hand = state.hands[state.currentPlayer];
  const played = hand[handIndex];
  if (!played || !tableIds.length) return false;

  const selected = seepSelectedItems(state, tableIds);
  if (selected.length !== tableIds.length) return false;

  return selected.reduce((total, item) => total + item.value, 0) === played.rank;
}

function seepScoreCards(cards) {
  return cards.reduce((score, card) => {
    if (card.suit === "S" && card.rank === 2) return score + 12;
    if (card.suit === "D" && card.rank === 10) return score + 6;
    if (card.rank === 1) return score + 1;
    if (card.suit === "S") return score + 1;
    return score;
  }, 0);
}

function seepScores(state) {
  if (state.playerCount === 2) {
    return state.captured.map((cards, player) => (
      seepScoreCards(cards) + state.sweeps[player] * 50
    ));
  }

  return [0, 1].map(team => {
    const members = [team, team + 2];
    return members.reduce(
      (score, player) => (
        score
        + seepScoreCards(state.captured[player])
        + state.sweeps[player] * 50
      ),
      0
    );
  });
}

function seepAdvance(state) {
  state.currentPlayer = nextPlayer(state);
  const handsEmpty = state.hands.every(hand => hand.length === 0);

  if (handsEmpty && state.deck.length) {
    dealSeepHands(state);
    state.message = "NEW FOUR-CARD HAND DEALT";
  } else if (handsEmpty && !state.deck.length) {
    if (state.table.length) {
      const remaining = state.table.flatMap(item => item.cards);
      state.captured[state.lastCapturer].push(...remaining);
      state.table = [];
    }
    state.finished = true;
    state.message = "ROUND COMPLETE";
  }

  return state;
}

function seepPlay(state, action) {
  const next = clone(state);
  if (next.finished) return next;

  const hand = next.hands[next.currentPlayer];
  const played = hand[action.handIndex];
  if (!played) throw new Error("SEEP_HAND_CARD_REQUIRED");

  const selected = seepSelectedItems(next, action.tableIds || []);

  if (action.type === "CAPTURE") {
    if (!seepCanCapture(next, action.handIndex, action.tableIds || [])) {
      throw new Error("INVALID_SEEP_CAPTURE");
    }

    const selectedIds = new Set(action.tableIds || []);
    const capturedCards = selected.flatMap(item => item.cards);
    next.table = next.table.filter(item => !selectedIds.has(item.id));
    hand.splice(action.handIndex, 1);
    next.captured[next.currentPlayer].push(played, ...capturedCards);
    next.lastCapturer = next.currentPlayer;

    if (next.table.length === 0) {
      next.sweeps[next.currentPlayer] += 1;
      next.message = "SWEEP";
    } else {
      next.message = "CAPTURE COMPLETE";
    }
  } else if (action.type === "BUILD") {
    const legalValues = seepBuildValues(
      next,
      action.handIndex,
      action.tableIds || []
    );

    if (!legalValues.includes(action.houseValue)) {
      throw new Error("INVALID_SEEP_HOUSE");
    }

    const selectedIds = new Set(action.tableIds || []);
    const cards = selected.flatMap(item => item.cards);
    next.table = next.table.filter(item => !selectedIds.has(item.id));
    hand.splice(action.handIndex, 1);
    next.table.push({
      type: "HOUSE",
      id: `HOUSE-${Date.now()}-${Math.random()}`,
      value: action.houseValue,
      owner: next.currentPlayer,
      cards: [played, ...cards],
    });
    next.message = `HOUSE ${action.houseValue} BUILT`;
  } else if (action.type === "DROP") {
    hand.splice(action.handIndex, 1);
    next.table.push({
      type: "CARD",
      id: played.id,
      value: played.rank,
      cards: [played],
    });
    next.message = "CARD DROPPED";
  } else {
    throw new Error("UNKNOWN_SEEP_ACTION");
  }

  return seepAdvance(next);
}

const SICBO_TOTAL_MULTIPLIERS = {
  4: 50, 5: 18, 6: 14, 7: 12, 8: 8, 9: 6,
  10: 6, 11: 6, 12: 6, 13: 8, 14: 12,
  15: 14, 16: 18, 17: 50,
};

function createSicBo(playerCount = 2) {
  assertPlayers(playerCount);
  return {
    kind: "SICBO",
    playerCount,
    players: Array.from({ length: playerCount }, (_, index) => ({
      id: index,
      chips: 1000,
    })),
    currentPlayer: 0,
    lastDice: [1, 1, 1],
    message: "VIRTUAL CHIPS ONLY",
    history: [],
  };
}

function sicBoResolve(dice, bet) {
  const [a, b, c] = dice;
  const total = a + b + c;
  const triple = a === b && b === c;
  const count = value => dice.filter(item => item === value).length;

  if (bet.type === "SMALL") {
    return { win: !triple && total >= 4 && total <= 10, multiplier: 1 };
  }
  if (bet.type === "BIG") {
    return { win: !triple && total >= 11 && total <= 17, multiplier: 1 };
  }
  if (bet.type === "ODD") {
    return { win: !triple && total % 2 === 1, multiplier: 1 };
  }
  if (bet.type === "EVEN") {
    return { win: !triple && total % 2 === 0, multiplier: 1 };
  }
  if (bet.type === "ANY_TRIPLE") {
    return { win: triple, multiplier: 30 };
  }
  if (bet.type === "SPECIFIC_TRIPLE") {
    return { win: triple && a === Number(bet.value), multiplier: 180 };
  }
  if (bet.type === "DOUBLE") {
    return { win: count(Number(bet.value)) >= 2, multiplier: 10 };
  }
  if (bet.type === "TOTAL") {
    return {
      win: total === Number(bet.value),
      multiplier: SICBO_TOTAL_MULTIPLIERS[Number(bet.value)] || 0,
    };
  }

  throw new Error("UNKNOWN_SICBO_BET");
}

function sicBoPlay(state, bet, stake, forcedDice = null) {
  const next = clone(state);
  const player = next.players[next.currentPlayer];
  const numericStake = Number(stake);

  if (
    !Number.isFinite(numericStake)
    || numericStake <= 0
    || numericStake > player.chips
  ) {
    throw new Error("INVALID_SICBO_STAKE");
  }

  const dice = forcedDice || Array.from(
    { length: 3 },
    () => 1 + Math.floor(Math.random() * 6)
  );

  player.chips -= numericStake;
  const resolution = sicBoResolve(dice, bet);

  if (resolution.win) {
    player.chips += numericStake * (resolution.multiplier + 1);
  }

  next.lastDice = dice;
  next.history.unshift({
    player: next.currentPlayer,
    dice,
    bet,
    stake: numericStake,
    win: resolution.win,
    multiplier: resolution.multiplier,
  });
  next.history = next.history.slice(0, 20);
  next.message = resolution.win
    ? `WIN ×${resolution.multiplier}`
    : "BET LOST";
  next.currentPlayer = nextPlayer(next);

  return next;
}

module.exports = {
  createLudo,
  ludoRoll,
  ludoMove,
  ludoValidMoves,
  ludoGlobalTrack,
  createSeep,
  seepCanCapture,
  seepBuildValues,
  seepPlay,
  seepScores,
  createSicBo,
  sicBoResolve,
  sicBoPlay,
};
