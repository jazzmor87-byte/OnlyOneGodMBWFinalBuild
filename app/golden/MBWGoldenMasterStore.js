import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import * as Location from 'expo-location';
import {
  MBW_LEGAL_VERSION,
  MBW_PREVIEW_SERVICE_STATUS,
  mbwRouteAccess,
} from './MBWReleaseContracts';

export const MBW_USER_SEED_SCHEMA_VERSION = 2;
export const MBW_GOLDEN_MASTER_STORAGE_KEY = 'MBW_GOLDEN_MASTER_STATE_V2';
export const MBW_GOLDEN_MASTER_LEGACY_STORAGE_KEY = 'MBW_GOLDEN_MASTER_STATE_V1';

const MBW_SECURE_KEY_NAME = 'MBW_GOLDEN_MASTER_DEVICE_KEY_V2';
const MBW_GATE_HASHES = new Set([
  '2fa7ce2a8bd43a2982062a34c2e49402681ed93bd141e153525da27fc6ba2a75',
  '861303f737250ee23db9d9aafea93cf041f6341f23f4767279ff7eb91626441c',
]);
const MBW_GATE_MAX_FAILURES = 5;
const MBW_GATE_LOCK_MS = 5 * 60 * 1000;
const MBW_POSTER_FOLDER = `${FileSystem.documentDirectory}mbw-posters/`;

const now = () => new Date().toISOString();
const makeId = (prefix) => `${prefix}_${Date.now()}_${Crypto.randomUUID().slice(0, 8)}`;

const defaultProfiles = [
  { id: 'M1', name: 'ORION', age: 29, tier: '333', compatibility: 91, city: 'Kuala Lumpur', latitude: 3.1390, longitude: 101.6869, matched: true },
  { id: 'M2', name: 'ATLAS', age: 31, tier: '444', compatibility: 88, city: 'Singapore', latitude: 1.3521, longitude: 103.8198, matched: false },
  { id: 'M3', name: 'PHOENIX', age: 27, tier: '222', compatibility: 84, city: 'Bangkok', latitude: 13.7563, longitude: 100.5018, matched: true },
  { id: 'M4', name: 'LEO', age: 34, tier: '555', compatibility: 93, city: 'Dubai', latitude: 25.2048, longitude: 55.2708, matched: false },
];

const localTrips = [
  { id: 'TL1', title: 'PENANG HERITAGE', place: 'Penang', price: 180, host: 'ACE HOST 1' },
  { id: 'TL2', title: 'LANGKAWI SKY', place: 'Langkawi', price: 260, host: 'ACE HOST 2' },
  { id: 'TL3', title: 'CAMERON RETREAT', place: 'Pahang', price: 220, host: 'ACE HOST 3' },
];

const overseasTrips = [
  { id: 'TO1', title: 'BALI TEMPLE', place: 'Indonesia', price: 640, host: 'GLOBAL HOST 1' },
  { id: 'TO2', title: 'TOKYO LIGHTS', place: 'Japan', price: 1260, host: 'GLOBAL HOST 2' },
  { id: 'TO3', title: 'ISTANBUL GOLD', place: 'Türkiye', price: 980, host: 'GLOBAL HOST 3' },
];

const products = [
  { id: 'P1', title: 'ACE HOODIE', price: 129 },
  { id: 'P2', title: 'MBW RING', price: 199 },
  { id: 'P3', title: 'GOLDEN KEY', price: 89 },
  { id: 'P4', title: 'VELVET CAP', price: 59 },
];

const SAFE_LUDO_SQUARES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
const SUITS = ['S', 'H', 'D', 'C'];

function bytesToHex(bytes) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqualHex(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

function deepMerge(base, incoming) {
  if (Array.isArray(base)) return Array.isArray(incoming) ? incoming : base;
  if (!base || typeof base !== 'object') return incoming === undefined ? base : incoming;
  const result = { ...base };
  if (!incoming || typeof incoming !== 'object') return result;
  for (const [key, value] of Object.entries(incoming)) {
    result[key] = key in base ? deepMerge(base[key], value) : value;
  }
  return result;
}

function migrateState(raw) {
  const initial = createInitialMBWState();
  const merged = deepMerge(initial, raw || {});
  merged.schemaVersion = MBW_USER_SEED_SCHEMA_VERSION;
  merged.hydrated = false;
  merged.lifecycle.gateUnlocked = false;
  merged.lifecycle.lastError = null;
  merged.auth.verificationCode = null;
  merged.auth.verificationExpiresAt = null;
  merged.security.gateFailures = 0;
  merged.security.gateLockedUntil = 0;
  merged.safety.legalVersion = merged.safety.legalVersion || MBW_LEGAL_VERSION;
  return merged;
}

async function getOrCreateDeviceKey() {
  let key = await SecureStore.getItemAsync(MBW_SECURE_KEY_NAME);
  if (!key) {
    key = bytesToHex(await Crypto.getRandomBytesAsync(32));
    await SecureStore.setItemAsync(MBW_SECURE_KEY_NAME, key, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }
  return key;
}

function deriveKeys(rootHex) {
  return {
    encryptionKey: CryptoJS.SHA256(`${rootHex}:ENC`),
    integrityKey: CryptoJS.SHA256(`${rootHex}:MAC`),
  };
}

async function encryptState(state) {
  const rootKey = await getOrCreateDeviceKey();
  const { encryptionKey, integrityKey } = deriveKeys(rootKey);
  const ivHex = bytesToHex(await Crypto.getRandomBytesAsync(16));
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const safeState = {
    ...state,
    hydrated: false,
    lifecycle: { ...state.lifecycle, gateUnlocked: false, lastError: null },
    auth: { ...state.auth, verificationCode: null, verificationExpiresAt: null },
    security: { ...state.security, gateFailures: 0, gateLockedUntil: 0 },
  };
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(safeState), encryptionKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).ciphertext.toString(CryptoJS.enc.Base64);
  const mac = CryptoJS.HmacSHA256(`${ivHex}.${encrypted}`, integrityKey).toString(CryptoJS.enc.Hex);
  return JSON.stringify({ version: 2, iv: ivHex, ciphertext: encrypted, mac });
}

async function decryptState(envelopeText) {
  const envelope = JSON.parse(envelopeText);
  if (envelope?.version !== 2 || !envelope.iv || !envelope.ciphertext || !envelope.mac) {
    throw new Error('INVALID_ENVELOPE');
  }
  const rootKey = await getOrCreateDeviceKey();
  const { encryptionKey, integrityKey } = deriveKeys(rootKey);
  const expectedMac = CryptoJS.HmacSHA256(
    `${envelope.iv}.${envelope.ciphertext}`,
    integrityKey,
  ).toString(CryptoJS.enc.Hex);
  if (!timingSafeEqualHex(expectedMac, String(envelope.mac))) throw new Error('STATE_INTEGRITY_FAILED');
  const plaintext = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(envelope.ciphertext) },
    encryptionKey,
    {
      iv: CryptoJS.enc.Hex.parse(envelope.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).toString(CryptoJS.enc.Utf8);
  if (!plaintext) throw new Error('STATE_DECRYPT_FAILED');
  return JSON.parse(plaintext);
}

function haversineKm(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function makeDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank += 1) {
      const points = (suit === 'S' ? 1 : 0) + (suit === 'D' && rank === 10 ? 6 : 0) + (rank === 1 ? 1 : 0);
      deck.push({ id: `${suit}${rank}`, suit, rank, points });
    }
  }
  return deck;
}

function shuffleDeck(deck, randomBytes) {
  const copy = [...deck];
  let cursor = 0;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const value = randomBytes[cursor % randomBytes.length];
    cursor += 1;
    const target = value % (index + 1);
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function dealSeep(deck) {
  const remaining = [...deck];
  return {
    deck: remaining.slice(12),
    hand: remaining.slice(0, 4),
    aiHand: remaining.slice(4, 8),
    table: remaining.slice(8, 12),
    playerCaptured: [],
    aiCaptured: [],
    playerSweeps: 0,
    aiSweeps: 0,
    score: 0,
    opponentScore: 0,
    round: 1,
    finished: false,
    winner: null,
  };
}

function scoreCaptured(cards, sweeps) {
  return cards.reduce((sum, card) => sum + card.points, 0) + sweeps * 5;
}

function captureWithCard(table, card) {
  const exact = table.filter((item) => item.rank === card.rank);
  if (exact.length > 0) return exact;
  for (let left = 0; left < table.length; left += 1) {
    for (let right = left + 1; right < table.length; right += 1) {
      if (table[left].rank + table[right].rank === card.rank) return [table[left], table[right]];
    }
  }
  return [];
}

function playSeepTurn(seep, cardId, ai = false) {
  const handKey = ai ? 'aiHand' : 'hand';
  const captureKey = ai ? 'aiCaptured' : 'playerCaptured';
  const sweepKey = ai ? 'aiSweeps' : 'playerSweeps';
  const hand = seep[handKey];
  const card = hand.find((item) => item.id === cardId);
  if (!card) return seep;
  const captured = captureWithCard(seep.table, card);
  const capturedIds = new Set(captured.map((item) => item.id));
  const table = captured.length
    ? seep.table.filter((item) => !capturedIds.has(item.id))
    : [...seep.table, card];
  const next = {
    ...seep,
    [handKey]: hand.filter((item) => item.id !== card.id),
    table,
  };
  if (captured.length) {
    next[captureKey] = [...seep[captureKey], card, ...captured];
    if (table.length === 0) next[sweepKey] = seep[sweepKey] + 1;
  }
  return next;
}

function refillSeep(seep) {
  if (seep.hand.length || seep.aiHand.length || seep.deck.length === 0) return seep;
  const hand = seep.deck.slice(0, 4);
  const aiHand = seep.deck.slice(4, 8);
  return {
    ...seep,
    deck: seep.deck.slice(8),
    hand,
    aiHand,
    round: seep.round + 1,
  };
}

function finalizeSeep(seep) {
  if (seep.deck.length || seep.hand.length || seep.aiHand.length) return seep;
  const score = scoreCaptured(seep.playerCaptured, seep.playerSweeps);
  const opponentScore = scoreCaptured(seep.aiCaptured, seep.aiSweeps);
  return {
    ...seep,
    score,
    opponentScore,
    finished: true,
    winner: score === opponentScore ? 'DRAW' : score > opponentScore ? 'PLAYER' : 'AI',
  };
}

function legalLudoToken(token, dice) {
  if (token === -1) return dice === 6;
  if (token >= 57) return false;
  return token + dice <= 57;
}

function advanceLudo(tokens, dice) {
  const candidates = tokens
    .map((token, index) => ({ token, index }))
    .filter((item) => legalLudoToken(item.token, dice))
    .sort((left, right) => right.token - left.token);
  if (!candidates.length) return { tokens, movedIndex: null };
  const chosen = candidates[0];
  const next = [...tokens];
  next[chosen.index] = chosen.token === -1 ? 0 : chosen.token + dice;
  return { tokens: next, movedIndex: chosen.index };
}

function applyLudoCapture(moverTokens, opponentTokens, movedIndex) {
  if (movedIndex === null) return opponentTokens;
  const position = moverTokens[movedIndex];
  if (position < 0 || position >= 52 || SAFE_LUDO_SQUARES.has(position)) return opponentTokens;
  return opponentTokens.map((token) => token === position ? -1 : token);
}

function sicboSettlement(choice, dice, stake = 25) {
  const total = dice.reduce((sum, value) => sum + value, 0);
  const triple = dice[0] === dice[1] && dice[1] === dice[2];
  let win = false;
  let multiplier = 0;
  if (choice === 'LOW') { win = !triple && total >= 4 && total <= 10; multiplier = 1; }
  else if (choice === 'HIGH') { win = !triple && total >= 11 && total <= 17; multiplier = 1; }
  else if (choice === 'ANY_TRIPLE') { win = triple; multiplier = 30; }
  else if (choice.startsWith('TOTAL_')) {
    const target = Number(choice.replace('TOTAL_', ''));
    win = total === target;
    multiplier = target === 4 || target === 17 ? 50 : target === 5 || target === 16 ? 18 : target === 6 || target === 15 ? 14 : 6;
  }
  return { total, triple, win, payout: win ? stake * multiplier : -stake };
}

export function createInitialMBWState() {
  const createdAt = now();
  return {
    schemaVersion: MBW_USER_SEED_SCHEMA_VERSION,
    hydrated: false,
    lifecycle: {
      gateUnlocked: false,
      firstRunComplete: false,
      lastRoute: 'CinematicIntro',
      lastError: null,
      bootCount: 0,
      createdAt,
      updatedAt: createdAt,
    },
    security: {
      gateFailures: 0,
      gateLockedUntil: 0,
      storageEncrypted: true,
      integrityProtected: true,
    },
    userSeed: {
      id: makeId('MBW_SEED'),
      displayName: 'ACE',
      path: null,
      tier: '111',
      badge: 'BLACK',
      orientation: 'TOP',
      profilePoster: null,
      subscriptionState: 'NONE',
      firstRunComplete: false,
      createdAt,
      updatedAt: createdAt,
    },
    auth: {
      signedUp: false,
      phone: '',
      phoneVerified: false,
      verificationCode: null,
      verificationExpiresAt: null,
      verificationMode: 'PREVIEW_LOCAL',
    },
    subscription: {
      tier: null,
      status: 'NONE',
      receipt: null,
    },
    matchmaking: {
      profiles: defaultProfiles,
      cursor: 0,
      liked: [],
      passed: [],
      matches: [],
      chats: {},
      selectedMatchId: null,
    },
    games: {
      selectedGame: 'LUDO',
      ludo: {
        playerTokens: [-1, -1, -1, -1],
        aiTokens: [-1, -1, -1, -1],
        lastDice: null,
        aiLastDice: null,
        winner: null,
        message: 'ROLL TO START',
      },
      seep: dealSeep(makeDeck()),
      sicbo: { choice: 'LOW', stake: 25, lastDice: [], lastTotal: null, lastResult: null, lastPayout: 0 },
      history: [],
    },
    coins: {
      balance: 1000,
      ledger: [{ id: makeId('COIN'), type: 'CREDIT', amount: 1000, reason: 'WELCOME', at: createdAt }],
      lastDailyClaim: null,
    },
    travel: {
      local: localTrips,
      overseas: overseasTrips,
      saved: [],
      bookings: [],
      hosting: [],
      selectedTripId: null,
    },
    nearby: {
      permission: 'UNDETERMINED',
      position: null,
      results: [],
      lastScanAt: null,
    },
    aiPoster: {
      currentUri: null,
      currentWidth: null,
      currentHeight: null,
      rotation: 0,
      history: [],
      lastError: null,
    },
    social: {
      posts: [],
      stories: [],
      livePreview: false,
      reports: [],
      blocked: [],
    },
    commerce: {
      products,
      cart: [],
      orders: [],
      lastReceiptId: null,
    },
    kamashastra: {
      values: { trust: 5, adventure: 5, communication: 5, intimacy: 5 },
      result: null,
      history: [],
    },
    safety: {
      privacyAccepted: false,
      termsAccepted: false,
      consentAccepted: false,
      legalVersion: MBW_LEGAL_VERSION,
      privacyAcceptedAt: null,
      termsAcceptedAt: null,
      consentAcceptedAt: null,
      reports: [],
      blocked: [],
      deletedAt: null,
    },
    productionServices: { ...MBW_PREVIEW_SERVICE_STATUS },
  };
}

function withUpdated(state, patch) {
  return {
    ...state,
    ...patch,
    lifecycle: {
      ...state.lifecycle,
      ...(patch.lifecycle || {}),
      updatedAt: now(),
    },
  };
}

function coinEntry(state, amount, reason) {
  return {
    balance: Math.max(0, state.coins.balance + amount),
    ledger: [
      { id: makeId('COIN'), type: amount >= 0 ? 'CREDIT' : 'DEBIT', amount: Math.abs(amount), reason, at: now() },
      ...state.coins.ledger,
    ].slice(0, 200),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return withUpdated(migrateState(action.payload), {
        hydrated: true,
        lifecycle: {
          ...migrateState(action.payload).lifecycle,
          bootCount: (action.payload?.lifecycle?.bootCount || 0) + 1,
        },
      });
    case 'ROUTE':
      return withUpdated(state, { lifecycle: { ...state.lifecycle, lastRoute: action.route } });
    case 'GATE_UNLOCK':
      return withUpdated(state, {
        lifecycle: { ...state.lifecycle, gateUnlocked: true, lastError: null },
        security: { ...state.security, gateFailures: 0, gateLockedUntil: 0 },
      });
    case 'GATE_FAILURE': {
      const failures = state.security.gateFailures + 1;
      const lockedUntil = failures >= MBW_GATE_MAX_FAILURES ? Date.now() + MBW_GATE_LOCK_MS : 0;
      return withUpdated(state, {
        lifecycle: { ...state.lifecycle, lastError: lockedUntil ? 'ACCESS TEMPORARILY LOCKED' : 'ACCESS DENIED' },
        security: { ...state.security, gateFailures: lockedUntil ? 0 : failures, gateLockedUntil: lockedUntil },
      });
    }
    case 'ERROR':
      return withUpdated(state, { lifecycle: { ...state.lifecycle, lastError: action.message } });
    case 'CLEAR_ERROR':
      return withUpdated(state, { lifecycle: { ...state.lifecycle, lastError: null } });
    case 'PATH':
      return withUpdated(state, { userSeed: { ...state.userSeed, path: action.path, updatedAt: now() } });
    case 'SIGNUP':
      return withUpdated(state, {
        auth: { ...state.auth, signedUp: true, phone: action.phone },
        userSeed: { ...state.userSeed, displayName: action.displayName, updatedAt: now() },
      });
    case 'VERIFICATION_SENT':
      return withUpdated(state, { auth: { ...state.auth, verificationCode: action.code, verificationExpiresAt: action.expiresAt } });
    case 'PHONE_VERIFIED':
      return withUpdated(state, { auth: { ...state.auth, phoneVerified: true, verificationCode: null, verificationExpiresAt: null } });
    case 'TIER': {
      const receipt = { id: makeId('SUB'), tier: action.tier, amount: action.amount, currency: action.currency, at: now(), mode: 'PREVIEW_NO_SETTLEMENT' };
      return withUpdated(state, {
        subscription: { tier: action.tier, status: 'ACTIVE_PREVIEW', receipt },
        userSeed: { ...state.userSeed, tier: action.tier, badge: action.badge, subscriptionState: 'ACTIVE_PREVIEW', updatedAt: now() },
      });
    }
    case 'CONSENT': {
      const acceptedAtKey = action.key === 'privacyAccepted'
        ? 'privacyAcceptedAt'
        : action.key === 'termsAccepted'
          ? 'termsAcceptedAt'
          : 'consentAcceptedAt';
      return withUpdated(state, {
        safety: {
          ...state.safety,
          [action.key]: action.value,
          [acceptedAtKey]: action.value ? now() : null,
          legalVersion: MBW_LEGAL_VERSION,
        },
      });
    }
    case 'FIRST_RUN_COMPLETE':
      return withUpdated(state, {
        lifecycle: { ...state.lifecycle, firstRunComplete: true },
        userSeed: { ...state.userSeed, firstRunComplete: true, updatedAt: now() },
      });
    case 'SEED_UPDATE':
      return withUpdated(state, { userSeed: { ...state.userSeed, ...action.patch, updatedAt: now() } });
    case 'MATCH_SWIPE': {
      const profile = state.matchmaking.profiles[state.matchmaking.cursor % state.matchmaking.profiles.length];
      const cursor = (state.matchmaking.cursor + 1) % state.matchmaking.profiles.length;
      const liked = action.direction === 'LIKE' ? [...new Set([...state.matchmaking.liked, profile.id])] : state.matchmaking.liked;
      const passed = action.direction === 'PASS' ? [...new Set([...state.matchmaking.passed, profile.id])] : state.matchmaking.passed;
      const isMatch = action.direction === 'LIKE' && profile.matched;
      const matches = isMatch && !state.matchmaking.matches.some((item) => item.id === profile.id)
        ? [...state.matchmaking.matches, profile]
        : state.matchmaking.matches;
      return withUpdated(state, { matchmaking: { ...state.matchmaking, cursor, liked, passed, matches, selectedMatchId: isMatch ? profile.id : state.matchmaking.selectedMatchId } });
    }
    case 'SELECT_MATCH':
      return withUpdated(state, { matchmaking: { ...state.matchmaking, selectedMatchId: action.id } });
    case 'CHAT': {
      const id = action.id;
      const previous = state.matchmaking.chats[id] || [];
      const message = { id: makeId('MSG'), sender: 'ME', text: action.text.trim(), at: now(), delivery: 'LOCAL_PREVIEW' };
      return withUpdated(state, { matchmaking: { ...state.matchmaking, chats: { ...state.matchmaking.chats, [id]: [...previous, message] } } });
    }
    case 'SELECT_GAME':
      return withUpdated(state, { games: { ...state.games, selectedGame: action.game } });
    case 'LUDO_NEW':
      return withUpdated(state, {
        games: {
          ...state.games,
          ludo: { playerTokens: [-1, -1, -1, -1], aiTokens: [-1, -1, -1, -1], lastDice: null, aiLastDice: null, winner: null, message: 'ROLL TO START' },
        },
      });
    case 'LUDO_ROLL': {
      if (state.games.ludo.winner) return state;
      const playerMove = advanceLudo(state.games.ludo.playerTokens, action.dice);
      let aiTokens = applyLudoCapture(playerMove.tokens, state.games.ludo.aiTokens, playerMove.movedIndex);
      const aiMove = advanceLudo(aiTokens, action.aiDice);
      let playerTokens = applyLudoCapture(aiMove.tokens, playerMove.tokens, aiMove.movedIndex);
      aiTokens = aiMove.tokens;
      const playerWon = playerTokens.every((token) => token >= 57);
      const aiWon = aiTokens.every((token) => token >= 57);
      const winner = playerWon ? 'PLAYER' : aiWon ? 'AI' : null;
      const history = winner ? [{ id: makeId('GAME'), game: 'LUDO', detail: winner, won: winner === 'PLAYER', at: now() }, ...state.games.history].slice(0, 100) : state.games.history;
      const coins = winner === 'PLAYER' ? coinEntry(state, 100, 'LUDO WIN') : state.coins;
      return withUpdated(state, {
        games: {
          ...state.games,
          ludo: {
            playerTokens,
            aiTokens,
            lastDice: action.dice,
            aiLastDice: action.aiDice,
            winner,
            message: winner ? `${winner} WON` : `YOU ${action.dice} · AI ${action.aiDice}`,
          },
          history,
        },
        coins,
      });
    }
    case 'SEEP_START':
      return withUpdated(state, { games: { ...state.games, seep: dealSeep(action.deck) } });
    case 'SEEP_PLAY': {
      if (state.games.seep.finished) return state;
      let seep = playSeepTurn(state.games.seep, action.cardId, false);
      const aiCard = seep.aiHand[0];
      if (aiCard) seep = playSeepTurn(seep, aiCard.id, true);
      seep = refillSeep(seep);
      seep = finalizeSeep(seep);
      const newlyFinished = seep.finished && !state.games.seep.finished;
      const history = newlyFinished
        ? [{ id: makeId('GAME'), game: 'SEEP', detail: `${seep.score}-${seep.opponentScore}`, won: seep.winner === 'PLAYER', at: now() }, ...state.games.history].slice(0, 100)
        : state.games.history;
      const coins = newlyFinished && seep.winner === 'PLAYER' ? coinEntry(state, 80, 'SEEP WIN') : state.coins;
      return withUpdated(state, { games: { ...state.games, seep, history }, coins });
    }
    case 'SICBO_CHOICE':
      return withUpdated(state, { games: { ...state.games, sicbo: { ...state.games.sicbo, choice: action.choice } } });
    case 'SICBO_PLAY': {
      const settlement = sicboSettlement(action.choice, action.dice, state.games.sicbo.stake);
      const history = [{ id: makeId('GAME'), game: 'SICBO', detail: `${action.dice.join('-')} · ${action.choice}`, won: settlement.win, at: now() }, ...state.games.history].slice(0, 100);
      return withUpdated(state, {
        games: {
          ...state.games,
          sicbo: {
            ...state.games.sicbo,
            choice: action.choice,
            lastDice: action.dice,
            lastTotal: settlement.total,
            lastResult: settlement.win ? 'WIN' : 'LOSS',
            lastPayout: settlement.payout,
          },
          history,
        },
        coins: coinEntry(state, settlement.payout, settlement.win ? 'SICBO WIN' : 'SICBO BET'),
      });
    }
    case 'DAILY_COINS': {
      const last = state.coins.lastDailyClaim ? new Date(state.coins.lastDailyClaim).toDateString() : null;
      if (last === new Date().toDateString()) return withUpdated(state, { lifecycle: { ...state.lifecycle, lastError: 'DAILY COINS ALREADY CLAIMED' } });
      return withUpdated(state, { coins: { ...coinEntry(state, 55, 'DAILY 5FIVE5'), lastDailyClaim: now() } });
    }
    case 'TRAVEL_SAVE':
      return withUpdated(state, { travel: { ...state.travel, saved: [...new Set([...state.travel.saved, action.id])] } });
    case 'TRAVEL_SELECT':
      return withUpdated(state, { travel: { ...state.travel, selectedTripId: action.id } });
    case 'TRAVEL_BOOK': {
      if (state.travel.bookings.some((item) => item.tripId === action.trip.id && item.status !== 'CANCELLED')) {
        return withUpdated(state, { lifecycle: { ...state.lifecycle, lastError: 'BOOKING ALREADY EXISTS' } });
      }
      const booking = { id: makeId('BOOK'), tripId: action.trip.id, title: action.trip.title, place: action.trip.place, price: action.trip.price, status: 'RESERVED_PREVIEW', at: now() };
      return withUpdated(state, { travel: { ...state.travel, bookings: [booking, ...state.travel.bookings] } });
    }
    case 'TRAVEL_CANCEL':
      return withUpdated(state, { travel: { ...state.travel, bookings: state.travel.bookings.map((item) => item.id === action.id ? { ...item, status: 'CANCELLED', cancelledAt: now() } : item) } });
    case 'TRAVEL_HOST': {
      const host = { id: makeId('HOST'), title: action.title, place: action.place, capacity: action.capacity, status: 'ACTIVE_PREVIEW', at: now() };
      return withUpdated(state, { travel: { ...state.travel, hosting: [host, ...state.travel.hosting] } });
    }
    case 'NEARBY_RESULT':
      return withUpdated(state, { nearby: { permission: action.permission, position: action.position, results: action.results, lastScanAt: now() } });
    case 'NEARBY_DENIED':
      return withUpdated(state, { nearby: { ...state.nearby, permission: 'DENIED', results: [] } });
    case 'POSTER_CURRENT':
      return withUpdated(state, { aiPoster: { ...state.aiPoster, currentUri: action.uri, currentWidth: action.width ?? state.aiPoster.currentWidth, currentHeight: action.height ?? state.aiPoster.currentHeight, rotation: action.rotation ?? state.aiPoster.rotation, lastError: null } });
    case 'POSTER_SAVE': {
      const item = { id: makeId('POSTER'), uri: action.uri, rotation: state.aiPoster.rotation, at: now() };
      return withUpdated(state, { aiPoster: { ...state.aiPoster, currentUri: action.uri, history: [item, ...state.aiPoster.history.filter((old) => old.uri !== action.uri)].slice(0, 20) }, userSeed: { ...state.userSeed, profilePoster: action.uri, updatedAt: now() } });
    }
    case 'POSTER_ERROR':
      return withUpdated(state, { aiPoster: { ...state.aiPoster, lastError: action.message } });
    case 'POST_ADD': {
      const post = { id: makeId('POST'), text: action.text.trim(), at: now(), author: state.userSeed.displayName };
      return withUpdated(state, { social: { ...state.social, posts: [post, ...state.social.posts].slice(0, 200) } });
    }
    case 'STORY_ADD': {
      const story = { id: makeId('STORY'), text: action.text.trim(), at: now(), expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
      return withUpdated(state, { social: { ...state.social, stories: [story, ...state.social.stories.filter((item) => item.expiresAt > Date.now())].slice(0, 100) } });
    }
    case 'LIVE_TOGGLE':
      if (state.userSeed.tier !== '444') return withUpdated(state, { lifecycle: { ...state.lifecycle, lastError: 'ACE 444 REQUIRED' } });
      return withUpdated(state, { social: { ...state.social, livePreview: !state.social.livePreview } });
    case 'REPORT': {
      const report = { id: makeId('REPORT'), target: action.target, reason: action.reason, at: now(), status: 'LOCAL_RECORDED' };
      return withUpdated(state, { social: { ...state.social, reports: [report, ...state.social.reports] }, safety: { ...state.safety, reports: [report, ...state.safety.reports] } });
    }
    case 'BLOCK':
      return withUpdated(state, { social: { ...state.social, blocked: [...new Set([...state.social.blocked, action.target])] }, safety: { ...state.safety, blocked: [...new Set([...state.safety.blocked, action.target])] } });
    case 'CART_ADD': {
      const existing = state.commerce.cart.find((item) => item.id === action.product.id);
      const cart = existing
        ? state.commerce.cart.map((item) => item.id === action.product.id ? { ...item, qty: Math.min(10, item.qty + 1) } : item)
        : [...state.commerce.cart, { ...action.product, qty: 1 }];
      return withUpdated(state, { commerce: { ...state.commerce, cart } });
    }
    case 'CART_REMOVE':
      return withUpdated(state, { commerce: { ...state.commerce, cart: state.commerce.cart.filter((item) => item.id !== action.id) } });
    case 'CHECKOUT': {
      const total = state.commerce.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const order = { id: makeId('ORDER'), items: state.commerce.cart, total, status: 'ORDERED_PREVIEW_NO_SETTLEMENT', at: now() };
      return withUpdated(state, { commerce: { ...state.commerce, cart: [], orders: [order, ...state.commerce.orders], lastReceiptId: order.id } });
    }
    case 'KAMA_VALUE':
      return withUpdated(state, { kamashastra: { ...state.kamashastra, values: { ...state.kamashastra.values, [action.key]: action.value } } });
    case 'KAMA_RESULT': {
      const values = Object.values(state.kamashastra.values);
      const score = Math.round((values.reduce((sum, value) => sum + value, 0) / (values.length * 10)) * 100);
      const result = { id: makeId('KAMA'), score, label: score >= 80 ? 'GOLDEN ALIGNMENT' : score >= 60 ? 'STRONG ALIGNMENT' : 'GROWING ALIGNMENT', at: now() };
      return withUpdated(state, { kamashastra: { ...state.kamashastra, result, history: [result, ...state.kamashastra.history].slice(0, 100) } });
    }
    case 'RESET':
      return { ...createInitialMBWState(), hydrated: true };
    default:
      return state;
  }
}

const MBWGoldenMasterContext = createContext(null);

export function MBWGoldenMasterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialMBWState);
  const persistTimerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const encrypted = await AsyncStorage.getItem(MBW_GOLDEN_MASTER_STORAGE_KEY);
        if (encrypted) {
          const decoded = await decryptState(encrypted);
          if (mounted) dispatch({ type: 'HYDRATE', payload: decoded });
          return;
        }
        const legacy = await AsyncStorage.getItem(MBW_GOLDEN_MASTER_LEGACY_STORAGE_KEY);
        const decodedLegacy = legacy ? JSON.parse(legacy) : createInitialMBWState();
        if (mounted) dispatch({ type: 'HYDRATE', payload: decodedLegacy });
      } catch (error) {
        if (mounted) dispatch({ type: 'HYDRATE', payload: createInitialMBWState() });
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return undefined;
    clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      encryptState(state)
        .then((envelope) => AsyncStorage.setItem(MBW_GOLDEN_MASTER_STORAGE_KEY, envelope))
        .then(() => AsyncStorage.removeItem(MBW_GOLDEN_MASTER_LEGACY_STORAGE_KEY))
        .catch(() => dispatch({ type: 'ERROR', message: 'SECURE SAVE FAILED' }));
    }, 150);
    return () => clearTimeout(persistTimerRef.current);
  }, [state]);

  const verifyGate = useCallback(async (value) => {
    if (Number(state.security.gateLockedUntil) > Date.now()) {
      dispatch({ type: 'ERROR', message: 'ACCESS TEMPORARILY LOCKED' });
      return false;
    }
    const normalized = String(value || '').trim();
    const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, normalized);
    const accepted = [...MBW_GATE_HASHES].some((hash) => timingSafeEqualHex(hash, digest));
    dispatch(accepted ? { type: 'GATE_UNLOCK' } : { type: 'GATE_FAILURE' });
    return accepted;
  }, [state.security.gateLockedUntil]);

  const sendVerification = useCallback(async () => {
    const bytes = await Crypto.getRandomBytesAsync(4);
    const numeric = ((bytes[0] << 24) >>> 0) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    const code = String(100000 + (numeric % 900000));
    dispatch({ type: 'VERIFICATION_SENT', code, expiresAt: Date.now() + 5 * 60 * 1000 });
    Alert.alert('PREVIEW VERIFICATION', `SANDBOX CODE: ${code}`);
    return code;
  }, []);

  const verifyPhone = useCallback((input) => {
    const accepted = Boolean(state.auth.verificationCode)
      && String(input).trim() === state.auth.verificationCode
      && Number(state.auth.verificationExpiresAt) > Date.now();
    if (accepted) dispatch({ type: 'PHONE_VERIFIED' });
    else dispatch({ type: 'ERROR', message: 'INVALID OR EXPIRED CODE' });
    return accepted;
  }, [state.auth.verificationCode, state.auth.verificationExpiresAt]);

  const requestNearby = useCallback(async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        dispatch({ type: 'NEARBY_DENIED' });
        return false;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const origin = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      const results = defaultProfiles
        .map((profile) => ({ ...profile, distanceKm: Number(haversineKm(origin, profile).toFixed(1)) }))
        .sort((left, right) => left.distanceKm - right.distanceKm);
      dispatch({ type: 'NEARBY_RESULT', permission: 'GRANTED', position: origin, results });
      return true;
    } catch (error) {
      dispatch({ type: 'ERROR', message: 'LOCATION UNAVAILABLE' });
      return false;
    }
  }, []);

  const persistImage = useCallback(async (uri, suffix = 'jpg') => {
    await FileSystem.makeDirectoryAsync(MBW_POSTER_FOLDER, { intermediates: true });
    const destination = `${MBW_POSTER_FOLDER}${makeId('poster')}.${suffix}`;
    await FileSystem.copyAsync({ from: uri, to: destination });
    return destination;
  }, []);

  const safeDeletePoster = useCallback(async (uri) => {
    if (!uri || !uri.startsWith(MBW_POSTER_FOLDER)) return;
    try { await FileSystem.deleteAsync(uri, { idempotent: true }); } catch (error) { /* no-op */ }
  }, []);

  const pickPoster = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.92,
      });
      const asset = result.assets?.[0];
      if (result.canceled || !asset?.uri) return false;
      const previous = state.aiPoster.currentUri;
      const uri = await persistImage(asset.uri, 'jpg');
      if (previous && !state.aiPoster.history.some((item) => item.uri === previous)) await safeDeletePoster(previous);
      dispatch({ type: 'POSTER_CURRENT', uri, width: asset.width, height: asset.height, rotation: 0 });
      return true;
    } catch (error) {
      dispatch({ type: 'POSTER_ERROR', message: 'IMAGE IMPORT FAILED' });
      return false;
    }
  }, [persistImage, safeDeletePoster, state.aiPoster.currentUri, state.aiPoster.history]);

  const transformPoster = useCallback(async (mode) => {
    const current = state.aiPoster.currentUri;
    if (!current) return false;
    try {
      let actions;
      let width = state.aiPoster.currentWidth || 1024;
      let height = state.aiPoster.currentHeight || 1280;
      if (mode === 'ROTATE') {
        actions = [{ rotate: 90 }];
        [width, height] = [height, width];
      } else {
        const ratio = 4 / 5;
        let cropWidth = width;
        let cropHeight = height;
        if (width / height > ratio) cropWidth = Math.floor(height * ratio);
        else cropHeight = Math.floor(width / ratio);
        actions = [{
          crop: {
            originX: Math.max(0, Math.floor((width - cropWidth) / 2)),
            originY: Math.max(0, Math.floor((height - cropHeight) / 2)),
            width: cropWidth,
            height: cropHeight,
          },
        }, { resize: { width: 1024, height: 1280 } }];
        width = 1024;
        height = 1280;
      }
      const result = await ImageManipulator.manipulateAsync(current, actions, {
        compress: 0.92,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const uri = await persistImage(result.uri, 'jpg');
      if (!state.aiPoster.history.some((item) => item.uri === current)) await safeDeletePoster(current);
      dispatch({
        type: 'POSTER_CURRENT',
        uri,
        width,
        height,
        rotation: mode === 'ROTATE' ? (state.aiPoster.rotation + 90) % 360 : state.aiPoster.rotation,
      });
      return true;
    } catch (error) {
      dispatch({ type: 'POSTER_ERROR', message: 'IMAGE EDIT FAILED' });
      return false;
    }
  }, [
    persistImage,
    safeDeletePoster,
    state.aiPoster.currentHeight,
    state.aiPoster.currentUri,
    state.aiPoster.currentWidth,
    state.aiPoster.history,
    state.aiPoster.rotation,
  ]);

  const savePoster = useCallback(() => {
    if (!state.aiPoster.currentUri) return false;
    dispatch({ type: 'POSTER_SAVE', uri: state.aiPoster.currentUri });
    return true;
  }, [state.aiPoster.currentUri]);

  const startSeep = useCallback(async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(128);
    dispatch({ type: 'SEEP_START', deck: shuffleDeck(makeDeck(), randomBytes) });
  }, []);

  const playSicbo = useCallback(async (choice) => {
    const bytes = await Crypto.getRandomBytesAsync(3);
    const dice = Array.from(bytes, (value) => (value % 6) + 1);
    dispatch({ type: 'SICBO_PLAY', choice, dice });
  }, []);

  const rollLudo = useCallback(async () => {
    const bytes = await Crypto.getRandomBytesAsync(2);
    dispatch({ type: 'LUDO_ROLL', dice: (bytes[0] % 6) + 1, aiDice: (bytes[1] % 6) + 1 });
  }, []);

  const navigateChecked = useCallback((navigation, routeName, params) => {
    const access = mbwRouteAccess(state, routeName);
    if (!access.allowed) {
      dispatch({ type: 'ERROR', message: access.pathAllowed ? `TIER ${access.requiredTier} REQUIRED` : 'PATH ACCESS LOCKED' });
      return false;
    }
    navigation.navigate(routeName, params);
    return true;
  }, [state]);

  const resetAccount = useCallback(async () => {
    clearTimeout(persistTimerRef.current);
    await Promise.allSettled([
      AsyncStorage.removeItem(MBW_GOLDEN_MASTER_STORAGE_KEY),
      AsyncStorage.removeItem(MBW_GOLDEN_MASTER_LEGACY_STORAGE_KEY),
      SecureStore.deleteItemAsync(MBW_SECURE_KEY_NAME),
      FileSystem.deleteAsync(MBW_POSTER_FOLDER, { idempotent: true }),
    ]);
    dispatch({ type: 'RESET' });
  }, []);

  const api = useMemo(() => ({
    state,
    dispatch,
    verifyGate,
    sendVerification,
    verifyPhone,
    requestNearby,
    pickPoster,
    rotatePoster: () => transformPoster('ROTATE'),
    cropPoster: () => transformPoster('CROP'),
    savePoster,
    startSeep,
    playSicbo,
    rollLudo,
    navigateChecked,
    resetAccount,
  }), [
    state,
    verifyGate,
    sendVerification,
    verifyPhone,
    requestNearby,
    pickPoster,
    transformPoster,
    savePoster,
    startSeep,
    playSicbo,
    rollLudo,
    navigateChecked,
    resetAccount,
  ]);

  return <MBWGoldenMasterContext.Provider value={api}>{children}</MBWGoldenMasterContext.Provider>;
}

export function useMBWGoldenMaster() {
  const value = useContext(MBWGoldenMasterContext);
  if (!value) throw new Error('MBWGoldenMasterProvider missing');
  return value;
}
