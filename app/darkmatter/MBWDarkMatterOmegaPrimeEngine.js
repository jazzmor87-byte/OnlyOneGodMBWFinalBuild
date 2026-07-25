import {
  mbwCreateProofEvent,
  mbwVerifyProofChain,
} from './MBWDarkMatterProofCarrier';
import {
  mbwCreateEscapeVector,
  mbwEscapeVectorReady,
} from './MBWDarkMatterEscapeVector';
import {
  MBW_DARK_MATTER_OMEGA_PRIME_ID,
  getMBWDarkMatterConstitution,
  getMBWOSRegistry,
  mbwAllOSGoverned,
} from './MBWDarkMatterOmegaPrimeRegistry';

const MAX_EVENTS = 555;
const state = {
  id: MBW_DARK_MATTER_OMEGA_PRIME_ID,
  project: 'MEN_BEHIND_WALL',
  initialized: false,
  phase: 'GROUP_1',
  events: [],
  lastRoute: null,
  lastProofHash: 'GENESIS',
  escapeVectors: [],
  containedDeadEnds: [],
  authorityDenials: [],
};

function push(type, payload = {}) {
  const event = mbwCreateProofEvent(state.lastProofHash, type, payload);
  state.events = [...state.events.slice(-(MAX_EVENTS - 1)), event];
  state.lastProofHash = event.hash;
  return event;
}

export function mbwDarkMatterInitialize() {
  if (state.initialized) return mbwDarkMatterSnapshot();
  const constitution = getMBWDarkMatterConstitution();
  const registry = getMBWOSRegistry();
  state.initialized = true;
  push('OMEGA_INITIALIZED', {
    constitutionVersion: constitution.version,
    osCount: registry.canonicalOS.length,
    allOSGoverned: mbwAllOSGoverned(),
  });
  globalThis.__MBW_DARK_MATTER_OMEGA_PRIME__ = {
    observe: mbwDarkMatterObserve,
    authorize: mbwDarkMatterAuthorize,
    contain: mbwDarkMatterContain,
    escape: mbwDarkMatterEscape,
    prove: mbwDarkMatterProve,
    snapshot: mbwDarkMatterSnapshot,
  };
  return mbwDarkMatterSnapshot();
}

export function mbwDarkMatterObserve(type, payload = {}) {
  if (!state.initialized) mbwDarkMatterInitialize();
  return push(`OBSERVE_${String(type).toUpperCase()}`, payload);
}

export function mbwDarkMatterAuthorize(action, context = {}) {
  if (!state.initialized) mbwDarkMatterInitialize();
  const name = String(action || '').toUpperCase();
  let allowed = true;
  let reason = 'AUTHORIZED';

  if (name.includes('BUILD') && context.releaseGate !== true) {
    allowed = false;
    reason = 'RELEASE_GATE_REQUIRED';
  }
  if (
    name.includes('DELETE') &&
    !(
      context.ownershipProof &&
      context.referenceProof &&
      context.rollbackProof
    )
  ) {
    allowed = false;
    reason = 'DELETE_PROOF_TRINITY_REQUIRED';
  }
  if (name.includes('MUTATE') && !context.backupProof) {
    allowed = false;
    reason = 'BACKUP_PROOF_REQUIRED';
  }
  if (context.project && context.project !== 'MEN_BEHIND_WALL') {
    allowed = false;
    reason = 'PROJECT_IDENTITY_ISOLATION';
  }

  push(allowed ? 'AUTHORITY_GRANTED' : 'AUTHORITY_DENIED', {
    action: name,
    reason,
    context,
  });
  if (!allowed) {
    state.authorityDenials = [
      ...state.authorityDenials.slice(-54),
      { action: name, reason, at: Date.now() },
    ];
  }
  return Object.freeze({ allowed, reason });
}

export function mbwDarkMatterRecordRoute(route) {
  if (!state.initialized) mbwDarkMatterInitialize();
  const previous = state.lastRoute;
  state.lastRoute = route || null;
  return push('ROUTE_TRANSITION', { from: previous, to: state.lastRoute });
}

export function mbwDarkMatterContain(reason, evidence = {}) {
  if (!state.initialized) mbwDarkMatterInitialize();
  const vector = mbwCreateEscapeVector({
    reason,
    route: state.lastRoute,
    restoreRoute: evidence.restoreRoute || 'MainHub',
    checkpoint: evidence.checkpoint || null,
    rollback: evidence.rollback || null,
  });
  const record = Object.freeze({
    id: `BH_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    reason: String(reason || 'UNKNOWN'),
    evidence,
    escapeVector: vector,
    status: mbwEscapeVectorReady(vector)
      ? 'CONTAINED_WITH_ESCAPE'
      : 'CONTAINMENT_INCOMPLETE',
    at: new Date().toISOString(),
  });
  state.containedDeadEnds = [
    ...state.containedDeadEnds.slice(-54),
    record,
  ];
  push('BLACK_HOLE_CONTAINMENT', record);
  return record;
}

export function mbwDarkMatterEscape(reason, options = {}) {
  const vector = mbwCreateEscapeVector({
    reason,
    route: state.lastRoute,
    ...options,
  });
  state.escapeVectors = [...state.escapeVectors.slice(-54), vector];
  push('ESCAPE_VECTOR_CREATED', vector);
  return vector;
}

export function mbwDarkMatterProve(label, proof = {}) {
  if (!state.initialized) mbwDarkMatterInitialize();
  const event = push('OMEGA_PROOF', { label, proof });
  return Object.freeze({
    label,
    eventHash: event.hash,
    chainGreen: mbwVerifyProofChain(state.events),
    allOSGoverned: mbwAllOSGoverned(),
    p0DeadEnds: state.containedDeadEnds.filter(
      (item) => item.status !== 'CONTAINED_WITH_ESCAPE',
    ).length,
  });
}

export function mbwDarkMatterSnapshot() {
  return Object.freeze({
    id: state.id,
    project: state.project,
    initialized: state.initialized,
    phase: state.phase,
    eventCount: state.events.length,
    lastRoute: state.lastRoute,
    lastProofHash: state.lastProofHash,
    allOSGoverned: mbwAllOSGoverned(),
    escapeVectorCount: state.escapeVectors.length,
    containedDeadEndCount: state.containedDeadEnds.length,
    unresolvedDeadEndCount: state.containedDeadEnds.filter(
      (item) => item.status !== 'CONTAINED_WITH_ESCAPE',
    ).length,
    authorityDenialCount: state.authorityDenials.length,
    proofChainGreen: mbwVerifyProofChain(state.events),
  });
}
