import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Vibration,
} from 'react-native';

const BLACK = '#000000';
const MAROON = '#6B001F';
const GOLD = '#D4AF37';

const LUDO_PATH_LENGTH = 24;
const LUDO_HOME = 24;
const LUDO_TOKEN_COUNT = 4;
const SEEP_STARTING_COINS = 500;

const PATH_COORDS = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 5], [0, 4], [0, 3], [0, 2], [0, 1],
];

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = [
  { label: 'A', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: 'J', value: 11 },
  { label: 'Q', value: 12 },
  { label: 'K', value: 13 },
];

const SICBO_CHOICES = ['LOW', 'HIGH', 'ODD', 'EVEN', 'TRIPLE'];
const SICBO_STAKES = [10, 25, 50];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function createDeck() {
  const deck = [];
  SUITS.forEach((suit, suitIndex) => {
    RANKS.forEach((rank) => {
      deck.push({
        id: `${suitIndex}-${rank.value}`,
        suit,
        label: rank.label,
        value: rank.value,
      });
    });
  });
  return shuffle(deck);
}

function cardScore(card) {
  if (card.suit === '♦' && card.value === 10) return 6;
  if (card.suit === '♠' && card.value === 2) return 12;
  if (card.value === 1) return 1;
  return 1;
}

function findCaptureIndexes(table, value) {
  const exactIndex = table.findIndex((card) => card.value === value);
  if (exactIndex >= 0) return [exactIndex];

  for (let first = 0; first < table.length; first += 1) {
    for (let second = first + 1; second < table.length; second += 1) {
      if (table[first].value + table[second].value === value) {
        return [first, second];
      }
    }
  }
  return [];
}

function createSeepState() {
  const deck = createDeck();
  return {
    active: false,
    phase: 'READY',
    turn: 'PLAYER',
    deck: deck.slice(12),
    playerHand: deck.slice(0, 4),
    aiHand: deck.slice(4, 8),
    table: deck.slice(8, 12),
    playerCaptured: [],
    aiCaptured: [],
    playerSweeps: 0,
    aiSweeps: 0,
    selectedCardId: null,
    message: 'START THE TABLE',
    winner: null,
  };
}

function seepTotals(state) {
  const player = state.playerCaptured.reduce((sum, card) => sum + cardScore(card), 0)
    + (state.playerSweeps * 10);
  const ai = state.aiCaptured.reduce((sum, card) => sum + cardScore(card), 0)
    + (state.aiSweeps * 10);
  return { player, ai };
}

function applySeepMove(state, actor, cardIndex) {
  const handKey = actor === 'PLAYER' ? 'playerHand' : 'aiHand';
  const capturedKey = actor === 'PLAYER' ? 'playerCaptured' : 'aiCaptured';
  const sweepsKey = actor === 'PLAYER' ? 'playerSweeps' : 'aiSweeps';
  const hand = [...state[handKey]];
  const playedCard = hand[cardIndex];
  if (!playedCard) return state;

  hand.splice(cardIndex, 1);
  const captureIndexes = findCaptureIndexes(state.table, playedCard.value);
  const captured = [];
  const remainingTable = [];

  state.table.forEach((card, index) => {
    if (captureIndexes.includes(index)) captured.push(card);
    else remainingTable.push(card);
  });

  const next = {
    ...state,
    [handKey]: hand,
    selectedCardId: null,
    turn: actor === 'PLAYER' ? 'AI' : 'PLAYER',
  };

  if (captured.length > 0) {
    next[capturedKey] = [...state[capturedKey], playedCard, ...captured];
    next.table = remainingTable;
    next.message = `${actor} CAPTURED ${captured.length + 1}`;
    if (remainingTable.length === 0) {
      next[sweepsKey] = state[sweepsKey] + 1;
      next.message = `${actor} SWEEP`;
    }
  } else {
    next.table = [...state.table, playedCard];
    next.message = `${actor} PLAYED ${playedCard.label}${playedCard.suit}`;
  }

  return next;
}

function redealOrFinishSeep(state) {
  if (state.playerHand.length > 0 || state.aiHand.length > 0) return state;

  if (state.deck.length >= 8) {
    return {
      ...state,
      playerHand: state.deck.slice(0, 4),
      aiHand: state.deck.slice(4, 8),
      deck: state.deck.slice(8),
      turn: 'PLAYER',
      message: 'NEW HAND',
    };
  }

  const totals = seepTotals(state);
  let winner = 'DRAW';
  if (totals.player > totals.ai) winner = 'PLAYER';
  if (totals.ai > totals.player) winner = 'AI';

  return {
    ...state,
    active: false,
    phase: 'FINISHED',
    winner,
    message: winner === 'DRAW' ? 'DRAW TABLE' : `${winner} WINS`,
  };
}

function createLudoState() {
  return {
    turn: 'PLAYER',
    dice: null,
    lastDice: null,
    playerTokens: [-1, -1, -1, -1],
    aiTokens: [-1, -1, -1, -1],
    winner: null,
    message: 'ROLL TO START',
    rolling: false,
  };
}

function legalLudoIndexes(tokens, dice) {
  return tokens
    .map((position, index) => ({ position, index }))
    .filter(({ position }) => {
      if (position === LUDO_HOME) return false;
      if (position === -1) return dice === 6;
      return position + dice <= LUDO_HOME;
    })
    .map(({ index }) => index);
}

function moveLudoToken(tokens, tokenIndex, dice) {
  return tokens.map((position, index) => {
    if (index !== tokenIndex) return position;
    if (position === -1) return 0;
    return Math.min(LUDO_HOME, position + dice);
  });
}

function allTokensHome(tokens) {
  return tokens.every((position) => position === LUDO_HOME);
}

function captureLudoTokens(opponentTokens, movedPosition, actor) {
  if (movedPosition < 0 || movedPosition >= LUDO_PATH_LENGTH) return opponentTokens;
  const movedDisplay = ludoDisplayPosition(movedPosition, actor);
  const opponentActor = actor === 'PLAYER' ? 'AI' : 'PLAYER';
  return opponentTokens.map((position) => {
    if (position < 0 || position >= LUDO_PATH_LENGTH) return position;
    return ludoDisplayPosition(position, opponentActor) === movedDisplay ? -1 : position;
  });
}

function ludoDisplayPosition(position, actor) {
  if (position < 0 || position >= LUDO_PATH_LENGTH) return null;
  if (actor === 'AI') return (position + 12) % LUDO_PATH_LENGTH;
  return position;
}

function createSicboState() {
  return {
    coins: SEEP_STARTING_COINS,
    choice: 'LOW',
    stake: 25,
    dice: [1, 1, 1],
    total: 3,
    result: 'SELECT A BET',
    payout: 0,
    rolling: false,
  };
}

function settleSicbo(choice, dice, stake) {
  const total = dice.reduce((sum, value) => sum + value, 0);
  const triple = dice[0] === dice[1] && dice[1] === dice[2];
  let win = false;
  let multiplier = 2;

  if (choice === 'LOW') win = total >= 4 && total <= 10 && !triple;
  if (choice === 'HIGH') win = total >= 11 && total <= 17 && !triple;
  if (choice === 'ODD') win = total % 2 === 1 && !triple;
  if (choice === 'EVEN') win = total % 2 === 0 && !triple;
  if (choice === 'TRIPLE') {
    win = triple;
    multiplier = 5;
  }

  return {
    total,
    win,
    payout: win ? stake * multiplier : -stake,
    triple,
  };
}

function GoldButton({ label, onPress, disabled = false, active = false, compact = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.goldButton,
        compact && styles.goldButtonCompact,
        active && styles.goldButtonActive,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.goldButtonText, active && styles.goldButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function StatusBar({ children, danger = false }) {
  return (
    <View style={[styles.statusBar, danger && styles.statusDanger]}>
      <Text style={styles.statusText}>{children}</Text>
    </View>
  );
}

function LudoToken({ actor, index, position, legal, onPress }) {
  const displayPosition = ludoDisplayPosition(position, actor);
  if (displayPosition === null) return null;
  const [x, y] = PATH_COORDS[displayPosition];
  const offsetX = (index % 2) * 3;
  const offsetY = Math.floor(index / 2) * 3;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${actor} TOKEN ${index + 1}`}
      disabled={!legal}
      onPress={onPress}
      style={[
        styles.ludoToken,
        actor === 'AI' ? styles.aiToken : styles.playerToken,
        legal && styles.legalToken,
        {
          left: `${(x * 14.2857) + 2 + offsetX}%`,
          top: `${(y * 14.2857) + 2 + offsetY}%`,
        },
      ]}
    >
      <Text style={styles.tokenText}>{index + 1}</Text>
    </Pressable>
  );
}

function YardToken({ actor, index, position, legal, onPress }) {
  if (position !== -1) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${actor} YARD TOKEN ${index + 1}`}
      disabled={!legal}
      onPress={onPress}
      style={[
        styles.yardToken,
        actor === 'AI' ? styles.aiToken : styles.playerToken,
        legal && styles.legalToken,
      ]}
    >
      <Text style={styles.tokenText}>{index + 1}</Text>
    </Pressable>
  );
}

function HomeTokens({ actor, tokens }) {
  const count = tokens.filter((position) => position === LUDO_HOME).length;
  if (count === 0) return null;
  return (
    <View style={[styles.homeCounter, actor === 'AI' ? styles.homeCounterAI : styles.homeCounterPlayer]}>
      <Text style={styles.homeCounterText}>{actor} {count}/4</Text>
    </View>
  );
}

function LudoBoard({ onExit }) {
  const [ludo, setLudo] = useState(createLudoState);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const legalPlayerTokens = useMemo(() => {
    if (ludo.turn !== 'PLAYER' || !ludo.dice || ludo.winner) return [];
    return legalLudoIndexes(ludo.playerTokens, ludo.dice);
  }, [ludo]);

  useEffect(() => {
    if (ludo.turn !== 'AI' || ludo.winner || ludo.rolling) return undefined;
    clearTimer();
    timerRef.current = setTimeout(() => {
      const dice = randomInt(1, 6);
      setLudo((current) => {
        if (current.turn !== 'AI' || current.winner) return current;
        const legal = legalLudoIndexes(current.aiTokens, dice);
        if (legal.length === 0) {
          return {
            ...current,
            dice: null,
            lastDice: dice,
            turn: 'PLAYER',
            message: `AI ROLLED ${dice} · NO MOVE`,
          };
        }
        const tokenIndex = legal[randomInt(0, legal.length - 1)];
        const aiTokens = moveLudoToken(current.aiTokens, tokenIndex, dice);
        const movedPosition = aiTokens[tokenIndex];
        const playerTokens = captureLudoTokens(current.playerTokens, movedPosition, 'AI');
        const captured = playerTokens.some((position, index) => position !== current.playerTokens[index]);
        const winner = allTokensHome(aiTokens) ? 'AI' : null;
        return {
          ...current,
          aiTokens,
          playerTokens,
          dice: null,
          lastDice: dice,
          winner,
          turn: dice === 6 && !winner ? 'AI' : 'PLAYER',
          message: winner ? 'AI WINS' : captured ? 'AI CAPTURED A TOKEN' : `AI MOVED TOKEN ${tokenIndex + 1}`,
        };
      });
    }, 700);
    return clearTimer;
  }, [ludo.turn, ludo.winner, ludo.rolling, clearTimer]);

  const roll = useCallback(() => {
    if (ludo.turn !== 'PLAYER' || ludo.dice || ludo.winner) return;
    Vibration.vibrate(35);
    const dice = randomInt(1, 6);
    const legal = legalLudoIndexes(ludo.playerTokens, dice);
    setLudo((current) => ({
      ...current,
      dice,
      lastDice: dice,
      message: legal.length > 0 ? `SELECT A TOKEN · ${dice}` : `ROLLED ${dice} · NO MOVE`,
    }));
    if (legal.length === 0) {
      clearTimer();
      timerRef.current = setTimeout(() => {
        setLudo((current) => ({
          ...current,
          dice: null,
          turn: 'AI',
          message: 'AI TURN',
        }));
      }, 650);
    }
  }, [ludo, clearTimer]);

  const movePlayer = useCallback((tokenIndex) => {
    if (!legalPlayerTokens.includes(tokenIndex) || !ludo.dice) return;
    Vibration.vibrate(25);
    const playerTokens = moveLudoToken(ludo.playerTokens, tokenIndex, ludo.dice);
    const movedPosition = playerTokens[tokenIndex];
    const aiTokens = captureLudoTokens(ludo.aiTokens, movedPosition, 'PLAYER');
    const captured = aiTokens.some((position, index) => position !== ludo.aiTokens[index]);
    const winner = allTokensHome(playerTokens) ? 'PLAYER' : null;
    const keepTurn = ludo.dice === 6 && !winner;
    setLudo((current) => ({
      ...current,
      playerTokens,
      aiTokens,
      dice: null,
      winner,
      turn: keepTurn ? 'PLAYER' : 'AI',
      message: winner ? 'PLAYER WINS' : captured ? 'TOKEN CAPTURED' : keepTurn ? 'ROLL AGAIN' : 'AI TURN',
    }));
  }, [legalPlayerTokens, ludo]);

  return (
    <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
      <View style={styles.gameHeaderRow}>
        <GoldButton label="BACK" onPress={onExit} compact />
        <SectionTitle>LUDO</SectionTitle>
        <GoldButton label="RESET" onPress={() => setLudo(createLudoState())} compact />
      </View>

      <StatusBar danger={Boolean(ludo.winner)}>{ludo.message}</StatusBar>

      <View style={styles.ludoBoard}>
        {PATH_COORDS.map(([x, y], index) => (
          <View
            key={`path-${index}`}
            style={[
              styles.pathCell,
              index % 3 === 0 && styles.pathCellGold,
              {
                left: `${x * 14.2857}%`,
                top: `${y * 14.2857}%`,
              },
            ]}
          >
            <Text style={styles.pathCellText}>{index + 1}</Text>
          </View>
        ))}

        <View style={styles.ludoCenter}>
          <Text style={styles.ludoCenterText}>MBW</Text>
          <Text style={styles.ludoCenterSub}>ACE</Text>
        </View>

        <View style={styles.aiYard}>
          {ludo.aiTokens.map((position, index) => (
            <YardToken key={`ai-yard-${index}`} actor="AI" index={index} position={position} legal={false} />
          ))}
        </View>

        <View style={styles.playerYard}>
          {ludo.playerTokens.map((position, index) => (
            <YardToken
              key={`player-yard-${index}`}
              actor="PLAYER"
              index={index}
              position={position}
              legal={legalPlayerTokens.includes(index)}
              onPress={() => movePlayer(index)}
            />
          ))}
        </View>

        {ludo.aiTokens.map((position, index) => (
          <LudoToken key={`ai-${index}`} actor="AI" index={index} position={position} legal={false} />
        ))}

        {ludo.playerTokens.map((position, index) => (
          <LudoToken
            key={`player-${index}`}
            actor="PLAYER"
            index={index}
            position={position}
            legal={legalPlayerTokens.includes(index)}
            onPress={() => movePlayer(index)}
          />
        ))}

        <HomeTokens actor="AI" tokens={ludo.aiTokens} />
        <HomeTokens actor="PLAYER" tokens={ludo.playerTokens} />
      </View>

      <View style={styles.diceRow}>
        <View style={[styles.die, styles.maroonDie]}>
          <Text style={styles.dieGoldText}>{ludo.lastDice || '—'}</Text>
        </View>
        <View style={styles.turnPanel}>
          <Text style={styles.turnLabel}>TURN</Text>
          <Text style={styles.turnValue}>{ludo.turn}</Text>
        </View>
        <GoldButton label="ROLL" onPress={roll} disabled={ludo.turn !== 'PLAYER' || Boolean(ludo.dice) || Boolean(ludo.winner)} />
      </View>
    </ScrollView>
  );
}

function CardView({ card, selected = false, onPress, disabled = false, small = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${card.label}${card.suit}`}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.card,
        small && styles.cardSmall,
        selected && styles.cardSelected,
        disabled && styles.cardDisabled,
      ]}
    >
      <Text style={[styles.cardRank, small && styles.cardRankSmall]}>{card.label}</Text>
      <Text style={[styles.cardSuit, small && styles.cardSuitSmall]}>{card.suit}</Text>
    </Pressable>
  );
}

function SeepBoard({ onExit }) {
  const [seep, setSeep] = useState(createSeepState);
  const timerRef = useRef(null);
  const totals = useMemo(() => seepTotals(seep), [seep]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    if (!seep.active || seep.turn !== 'AI' || seep.winner) return undefined;
    clearTimer();
    timerRef.current = setTimeout(() => {
      setSeep((current) => {
        if (!current.active || current.turn !== 'AI' || current.aiHand.length === 0) return current;
        let selectedIndex = current.aiHand.findIndex((card) => findCaptureIndexes(current.table, card.value).length > 0);
        if (selectedIndex < 0) {
          selectedIndex = current.aiHand.reduce((lowestIndex, card, index, hand) => (
            card.value < hand[lowestIndex].value ? index : lowestIndex
          ), 0);
        }
        return applySeepMove(current, 'AI', selectedIndex);
      });
    }, 650);
    return clearTimer;
  }, [seep.active, seep.turn, seep.winner, clearTimer]);

  useEffect(() => {
    if (!seep.active) return;
    if (seep.playerHand.length === 0 && seep.aiHand.length === 0) {
      setSeep((current) => redealOrFinishSeep(current));
    }
  }, [seep.active, seep.playerHand.length, seep.aiHand.length]);

  const start = useCallback(() => {
    Vibration.vibrate(35);
    const next = createSeepState();
    setSeep({ ...next, active: true, phase: 'PLAY', message: 'YOUR TURN' });
  }, []);

  const playSelected = useCallback(() => {
    if (!seep.active || seep.turn !== 'PLAYER' || !seep.selectedCardId) return;
    const cardIndex = seep.playerHand.findIndex((card) => card.id === seep.selectedCardId);
    if (cardIndex < 0) return;
    Vibration.vibrate(25);
    setSeep((current) => applySeepMove(current, 'PLAYER', cardIndex));
  }, [seep]);

  return (
    <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
      <View style={styles.gameHeaderRow}>
        <GoldButton label="BACK" onPress={onExit} compact />
        <SectionTitle>SEEP</SectionTitle>
        <GoldButton label="NEW" onPress={start} compact />
      </View>

      <StatusBar danger={Boolean(seep.winner)}>{seep.message}</StatusBar>

      <View style={styles.scoreRow}>
        <View style={styles.scorePanel}>
          <Text style={styles.scoreLabel}>PLAYER</Text>
          <Text style={styles.scoreValue}>{totals.player}</Text>
          <Text style={styles.scoreMeta}>SWEEPS {seep.playerSweeps}</Text>
        </View>
        <View style={styles.scorePanelDark}>
          <Text style={styles.scoreLabel}>DECK</Text>
          <Text style={styles.scoreValue}>{seep.deck.length}</Text>
          <Text style={styles.scoreMeta}>{seep.turn}</Text>
        </View>
        <View style={styles.scorePanel}>
          <Text style={styles.scoreLabel}>AI</Text>
          <Text style={styles.scoreValue}>{totals.ai}</Text>
          <Text style={styles.scoreMeta}>SWEEPS {seep.aiSweeps}</Text>
        </View>
      </View>

      <View style={styles.aiHandRow}>
        {seep.aiHand.map((card) => (
          <View key={card.id} style={styles.aiCardBack} />
        ))}
      </View>

      <View style={styles.seepTable}>
        <Text style={styles.tableLabel}>TABLE</Text>
        <View style={styles.tableCards}>
          {seep.table.length === 0 ? (
            <Text style={styles.emptyTableText}>SWEEP</Text>
          ) : seep.table.map((card) => (
            <CardView key={card.id} card={card} small disabled />
          ))}
        </View>
      </View>

      <View style={styles.playerHandRow}>
        {seep.playerHand.map((card) => (
          <CardView
            key={card.id}
            card={card}
            selected={seep.selectedCardId === card.id}
            disabled={!seep.active || seep.turn !== 'PLAYER'}
            onPress={() => setSeep((current) => ({ ...current, selectedCardId: card.id }))}
          />
        ))}
      </View>

      <View style={styles.actionRow}>
        <GoldButton label="START" onPress={start} disabled={seep.active && !seep.winner} />
        <GoldButton
          label="PLAY CARD"
          onPress={playSelected}
          disabled={!seep.active || seep.turn !== 'PLAYER' || !seep.selectedCardId}
          active={Boolean(seep.selectedCardId)}
        />
      </View>
    </ScrollView>
  );
}

function DiceFace({ value, tone }) {
  const dieStyle = tone === 'MAROON' ? styles.maroonDie : tone === 'GOLD' ? styles.goldDie : styles.blackDie;
  const textStyle = tone === 'GOLD' ? styles.dieBlackText : styles.dieGoldText;
  return (
    <View style={[styles.die, dieStyle]}>
      <Text style={textStyle}>{value}</Text>
    </View>
  );
}

function SicboBoard({ onExit }) {
  const [sicbo, setSicbo] = useState(createSicboState);
  const pulse = useRef(new Animated.Value(1)).current;

  const roll = useCallback(() => {
    if (sicbo.rolling || sicbo.coins < sicbo.stake) return;
    Vibration.vibrate(40);
    setSicbo((current) => ({ ...current, rolling: true, result: 'ROLLING' }));
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 130, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 130, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      const dice = [randomInt(1, 6), randomInt(1, 6), randomInt(1, 6)];
      const settlement = settleSicbo(sicbo.choice, dice, sicbo.stake);
      setSicbo((current) => ({
        ...current,
        dice,
        total: settlement.total,
        payout: settlement.payout,
        coins: Math.max(0, current.coins + settlement.payout),
        rolling: false,
        result: settlement.win ? `WIN ${settlement.payout}` : `LOSS ${current.stake}`,
      }));
    }, 420);
  }, [sicbo, pulse]);

  return (
    <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
      <View style={styles.gameHeaderRow}>
        <GoldButton label="BACK" onPress={onExit} compact />
        <SectionTitle>SICBO</SectionTitle>
        <GoldButton label="RESET" onPress={() => setSicbo(createSicboState())} compact />
      </View>

      <StatusBar danger={sicbo.coins === 0}>{sicbo.result}</StatusBar>

      <View style={styles.coinPanel}>
        <Text style={styles.coinLabel}>COINS</Text>
        <Text style={styles.coinValue}>{sicbo.coins}</Text>
      </View>

      <View style={styles.choiceGrid}>
        {SICBO_CHOICES.map((choice) => (
          <GoldButton
            key={choice}
            label={choice}
            compact
            active={sicbo.choice === choice}
            onPress={() => setSicbo((current) => ({ ...current, choice }))}
          />
        ))}
      </View>

      <View style={styles.stakeRow}>
        {SICBO_STAKES.map((stake) => (
          <GoldButton
            key={stake}
            label={`${stake}`}
            compact
            active={sicbo.stake === stake}
            onPress={() => setSicbo((current) => ({ ...current, stake }))}
          />
        ))}
      </View>

      <Animated.View style={[styles.sicboTable, { transform: [{ scale: pulse }] }]}>
        <View style={styles.sicboSeal}>
          <Text style={styles.sicboSealText}>MBW</Text>
          <Text style={styles.sicboSealSub}>SOVEREIGN TABLE</Text>
        </View>
        <View style={styles.diceRowWide}>
          <DiceFace value={sicbo.dice[0]} tone="MAROON" />
          <DiceFace value={sicbo.dice[1]} tone="GOLD" />
          <DiceFace value={sicbo.dice[2]} tone="BLACK" />
        </View>
        <Text style={styles.totalText}>TOTAL {sicbo.total}</Text>
      </Animated.View>

      <GoldButton
        label={`ROLL · ${sicbo.choice} · ${sicbo.stake}`}
        onPress={roll}
        disabled={sicbo.rolling || sicbo.coins < sicbo.stake}
        active
      />
    </ScrollView>
  );
}

function GameMenu({ onOpen, onBack }) {
  return (
    <ScrollView contentContainerStyle={styles.menuContent} showsVerticalScrollIndicator={false}>
      <View style={styles.menuTopRow}>
        <GoldButton label="RETURN" onPress={onBack} compact />
        <Text style={styles.brandMark}>MBW</Text>
        <View style={styles.topSpacer} />
      </View>

      <Text style={styles.mainTitle}>MASTER OF GAMES</Text>
      <Text style={styles.mainSubtitle}>DEEP MAROON · GOLD · BLACK</Text>

      <View style={styles.realmSeal}>
        <Text style={styles.realmSealMain}>ACE</Text>
        <Text style={styles.realmSealSub}>SOVEREIGN GAME CHAMBER</Text>
      </View>

      <View style={styles.gameSelector}>
        <Pressable onPress={() => onOpen('LUDO')} style={({ pressed }) => [styles.gameEntry, pressed && styles.pressed]}>
          <Text style={styles.gameEntryIndex}>01</Text>
          <View style={styles.gameEntryBody}>
            <Text style={styles.gameEntryTitle}>LUDO</Text>
            <Text style={styles.gameEntryMeta}>LIVE DICE · TOKEN MOVEMENT · AI TURN · WIN STATE</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => onOpen('SEEP')} style={({ pressed }) => [styles.gameEntry, pressed && styles.pressed]}>
          <Text style={styles.gameEntryIndex}>02</Text>
          <View style={styles.gameEntryBody}>
            <Text style={styles.gameEntryTitle}>SEEP</Text>
            <Text style={styles.gameEntryMeta}>CARD SELECT · CAPTURE · SWEEP · SCORE · AI TURN</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => onOpen('SICBO')} style={({ pressed }) => [styles.gameEntry, pressed && styles.pressed]}>
          <Text style={styles.gameEntryIndex}>03</Text>
          <View style={styles.gameEntryBody}>
            <Text style={styles.gameEntryTitle}>SICBO</Text>
            <Text style={styles.gameEntryMeta}>MAROON DIE · GOLD DIE · BLACK DIE · BET · PAYOUT</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.paletteLock}>
        <View style={styles.paletteBlack} />
        <View style={styles.paletteMaroon} />
        <View style={styles.paletteGold} />
      </View>
      <Text style={styles.paletteText}>THREE-COLOUR LAW ACTIVE</Text>
    </ScrollView>
  );
}

export const ULTRA_GAME_ZONE = "MBWLiveGameZone";

export default function MBWLiveGameZone({ navigation }) {
  const [activeGame, setActiveGame] = useState('MENU');
  const goBack = useCallback(() => {
    if (activeGame !== 'MENU') {
      setActiveGame('MENU');
      return;
    }
    if (navigation && typeof navigation.goBack === 'function') navigation.goBack();
  }, [activeGame, navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.ambientTop} />
      <View style={styles.ambientBottom} />
      {activeGame === 'MENU' && <GameMenu onOpen={setActiveGame} onBack={goBack} />}
      {activeGame === 'LUDO' && <LudoBoard onExit={goBack} />}
      {activeGame === 'SEEP' && <SeepBoard onExit={goBack} />}
      {activeGame === 'SICBO' && <SicboBoard onExit={goBack} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BLACK },
  ambientTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 180, backgroundColor: MAROON, opacity: 0.35 },
  ambientBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, backgroundColor: MAROON, opacity: 0.2 },
  menuContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 48, gap: 16 },
  gameContent: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 44, gap: 14 },
  menuTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topSpacer: { width: 84 },
  brandMark: { color: GOLD, fontSize: 23, fontWeight: '900', letterSpacing: 8 },
  mainTitle: { color: GOLD, fontSize: 30, fontWeight: '900', letterSpacing: 4, textAlign: 'center', marginTop: 8 },
  mainSubtitle: { color: GOLD, fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textAlign: 'center', opacity: 0.78 },
  realmSeal: { alignSelf: 'center', width: 210, height: 210, borderRadius: 105, borderWidth: 3, borderColor: GOLD, backgroundColor: MAROON, alignItems: 'center', justifyContent: 'center', shadowColor: GOLD, shadowOpacity: 0.55, shadowRadius: 26, elevation: 14 },
  realmSealMain: { color: GOLD, fontSize: 62, fontWeight: '900', letterSpacing: 10 },
  realmSealSub: { color: GOLD, fontSize: 10, fontWeight: '900', letterSpacing: 2, textAlign: 'center', paddingHorizontal: 22 },
  gameSelector: { gap: 12 },
  gameEntry: { minHeight: 96, borderWidth: 2, borderColor: GOLD, borderRadius: 24, backgroundColor: BLACK, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, shadowColor: MAROON, shadowOpacity: 0.7, shadowRadius: 14, elevation: 7 },
  gameEntryIndex: { color: GOLD, fontSize: 27, fontWeight: '900', width: 52 },
  gameEntryBody: { flex: 1, borderLeftWidth: 2, borderLeftColor: MAROON, paddingLeft: 14 },
  gameEntryTitle: { color: GOLD, fontSize: 21, fontWeight: '900', letterSpacing: 4 },
  gameEntryMeta: { color: GOLD, fontSize: 10, lineHeight: 16, fontWeight: '700', letterSpacing: 1, opacity: 0.8, marginTop: 5 },
  paletteLock: { flexDirection: 'row', alignSelf: 'center', borderWidth: 2, borderColor: GOLD, borderRadius: 20, overflow: 'hidden', marginTop: 4 },
  paletteBlack: { width: 58, height: 26, backgroundColor: BLACK },
  paletteMaroon: { width: 58, height: 26, backgroundColor: MAROON },
  paletteGold: { width: 58, height: 26, backgroundColor: GOLD },
  paletteText: { color: GOLD, textAlign: 'center', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  gameHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: GOLD, fontSize: 25, fontWeight: '900', letterSpacing: 5, textAlign: 'center' },
  goldButton: { minHeight: 48, minWidth: 112, borderWidth: 2, borderColor: GOLD, borderRadius: 18, backgroundColor: BLACK, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, shadowColor: GOLD, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  goldButtonCompact: { minWidth: 78, minHeight: 40, paddingHorizontal: 10, borderRadius: 14 },
  goldButtonActive: { backgroundColor: GOLD, borderColor: GOLD },
  goldButtonText: { color: GOLD, fontSize: 12, fontWeight: '900', letterSpacing: 1.4 },
  goldButtonTextActive: { color: BLACK },
  disabled: { opacity: 0.32 },
  pressed: { opacity: 0.68, transform: [{ scale: 0.985 }] },
  statusBar: { minHeight: 44, borderWidth: 2, borderColor: GOLD, borderRadius: 16, backgroundColor: MAROON, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  statusDanger: { backgroundColor: BLACK, borderColor: MAROON },
  statusText: { color: GOLD, fontSize: 12, fontWeight: '900', letterSpacing: 1.3, textAlign: 'center' },
  ludoBoard: { alignSelf: 'center', width: '100%', aspectRatio: 1, borderWidth: 4, borderColor: GOLD, borderRadius: 28, backgroundColor: MAROON, overflow: 'hidden', shadowColor: GOLD, shadowOpacity: 0.4, shadowRadius: 22, elevation: 12 },
  pathCell: { position: 'absolute', width: '14.2857%', height: '14.2857%', borderWidth: 1, borderColor: GOLD, backgroundColor: BLACK, alignItems: 'center', justifyContent: 'center' },
  pathCellGold: { backgroundColor: GOLD },
  pathCellText: { color: MAROON, fontSize: 8, fontWeight: '900' },
  ludoCenter: { position: 'absolute', left: '28.57%', top: '28.57%', width: '42.86%', height: '42.86%', borderWidth: 3, borderColor: GOLD, backgroundColor: BLACK, transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center' },
  ludoCenterText: { color: GOLD, fontSize: 31, fontWeight: '900', letterSpacing: 5, transform: [{ rotate: '-45deg' }] },
  ludoCenterSub: { color: MAROON, fontSize: 12, fontWeight: '900', letterSpacing: 4, transform: [{ rotate: '-45deg' }] },
  aiYard: { position: 'absolute', right: '15%', top: '15%', width: '22%', height: '22%', borderWidth: 2, borderColor: GOLD, borderRadius: 18, backgroundColor: BLACK, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 5 },
  playerYard: { position: 'absolute', left: '15%', bottom: '15%', width: '22%', height: '22%', borderWidth: 2, borderColor: GOLD, borderRadius: 18, backgroundColor: MAROON, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 5 },
  yardToken: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: GOLD, alignItems: 'center', justifyContent: 'center' },
  ludoToken: { position: 'absolute', width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: GOLD, alignItems: 'center', justifyContent: 'center', zIndex: 20, shadowColor: BLACK, shadowOpacity: 0.9, shadowRadius: 4, elevation: 8 },
  playerToken: { backgroundColor: MAROON },
  aiToken: { backgroundColor: BLACK },
  legalToken: { borderWidth: 4, shadowColor: GOLD, shadowOpacity: 1, shadowRadius: 10, elevation: 15 },
  tokenText: { color: GOLD, fontSize: 11, fontWeight: '900' },
  homeCounter: { position: 'absolute', left: '40%', top: '44%', width: '20%', borderWidth: 2, borderColor: GOLD, borderRadius: 12, paddingVertical: 4, alignItems: 'center' },
  homeCounterAI: { backgroundColor: BLACK },
  homeCounterPlayer: { backgroundColor: MAROON, top: '53%' },
  homeCounterText: { color: GOLD, fontSize: 9, fontWeight: '900' },
  diceRow: { flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between' },
  diceRowWide: { flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center' },
  die: { width: 72, height: 72, borderRadius: 18, borderWidth: 3, borderColor: GOLD, alignItems: 'center', justifyContent: 'center', shadowColor: GOLD, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8 },
  maroonDie: { backgroundColor: MAROON },
  goldDie: { backgroundColor: GOLD },
  blackDie: { backgroundColor: BLACK },
  dieGoldText: { color: GOLD, fontSize: 32, fontWeight: '900' },
  dieBlackText: { color: BLACK, fontSize: 32, fontWeight: '900' },
  turnPanel: { flex: 1, minHeight: 72, borderWidth: 2, borderColor: GOLD, borderRadius: 18, backgroundColor: BLACK, alignItems: 'center', justifyContent: 'center' },
  turnLabel: { color: MAROON, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  turnValue: { color: GOLD, fontSize: 17, fontWeight: '900', letterSpacing: 3, marginTop: 3 },
  scoreRow: { flexDirection: 'row', gap: 8 },
  scorePanel: { flex: 1, borderWidth: 2, borderColor: GOLD, borderRadius: 16, backgroundColor: MAROON, alignItems: 'center', paddingVertical: 10 },
  scorePanelDark: { flex: 1, borderWidth: 2, borderColor: GOLD, borderRadius: 16, backgroundColor: BLACK, alignItems: 'center', paddingVertical: 10 },
  scoreLabel: { color: GOLD, fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  scoreValue: { color: GOLD, fontSize: 24, fontWeight: '900', marginVertical: 2 },
  scoreMeta: { color: GOLD, fontSize: 8, fontWeight: '800', opacity: 0.72 },
  aiHandRow: { minHeight: 74, flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 4 },
  aiCardBack: { width: 44, height: 66, borderWidth: 2, borderColor: GOLD, borderRadius: 8, backgroundColor: BLACK, transform: [{ rotate: '4deg' }] },
  seepTable: { minHeight: 240, borderWidth: 3, borderColor: GOLD, borderRadius: 26, backgroundColor: MAROON, padding: 12, alignItems: 'center', justifyContent: 'center', shadowColor: GOLD, shadowOpacity: 0.35, shadowRadius: 18, elevation: 10 },
  tableLabel: { color: GOLD, fontSize: 11, fontWeight: '900', letterSpacing: 3, marginBottom: 10 },
  tableCards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7 },
  emptyTableText: { color: GOLD, fontSize: 28, fontWeight: '900', letterSpacing: 7 },
  playerHandRow: { minHeight: 112, flexDirection: 'row', justifyContent: 'center', gap: 7, flexWrap: 'wrap' },
  card: { width: 64, height: 96, borderWidth: 2, borderColor: GOLD, borderRadius: 11, backgroundColor: BLACK, alignItems: 'center', justifyContent: 'center', shadowColor: MAROON, shadowOpacity: 0.75, shadowRadius: 8, elevation: 6 },
  cardSmall: { width: 48, height: 72, borderRadius: 8 },
  cardSelected: { backgroundColor: GOLD, transform: [{ translateY: -8 }], shadowColor: GOLD, shadowOpacity: 1, shadowRadius: 14, elevation: 12 },
  cardDisabled: { opacity: 0.7 },
  cardRank: { color: GOLD, fontSize: 21, fontWeight: '900' },
  cardSuit: { color: MAROON, fontSize: 24, fontWeight: '900' },
  cardRankSmall: { fontSize: 15 },
  cardSuitSmall: { fontSize: 18 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
  coinPanel: { alignSelf: 'center', minWidth: 190, borderWidth: 3, borderColor: GOLD, borderRadius: 24, backgroundColor: MAROON, alignItems: 'center', paddingVertical: 12, shadowColor: GOLD, shadowOpacity: 0.45, shadowRadius: 16, elevation: 9 },
  coinLabel: { color: GOLD, fontSize: 10, fontWeight: '900', letterSpacing: 4 },
  coinValue: { color: GOLD, fontSize: 36, fontWeight: '900', letterSpacing: 3 },
  choiceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  stakeRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  sicboTable: { minHeight: 300, borderWidth: 4, borderColor: GOLD, borderRadius: 30, backgroundColor: MAROON, alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: 26, shadowColor: GOLD, shadowOpacity: 0.5, shadowRadius: 24, elevation: 13 },
  sicboSeal: { width: 150, height: 96, borderWidth: 3, borderColor: GOLD, backgroundColor: BLACK, transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center' },
  sicboSealText: { color: GOLD, fontSize: 29, fontWeight: '900', letterSpacing: 5, transform: [{ rotate: '-45deg' }] },
  sicboSealSub: { color: MAROON, fontSize: 8, fontWeight: '900', letterSpacing: 1.2, transform: [{ rotate: '-45deg' }] },
  totalText: { color: GOLD, fontSize: 22, fontWeight: '900', letterSpacing: 4 },
});
