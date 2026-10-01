// RESIDENT-CHAT-ENSEMBLE-01B · pure deterministic dialogue proof
// This is NOT a replacement WHEN scheduler. It supplies a bounded review choreography and
// a player-targeted semantic seam; mob-ai / host behavior remains production timing owner.
import {
  prepareResidentTurn,
  validateResidentTurn
} from '../../RESIDENT_CHAT_POC_01_2026-10-01/src/resident-chatter-adapter.v0.1.mjs';
import {
  RESIDENT_PROFILES,
  RUNTIME_POOL
} from './resident-chat-ensemble-data.mjs';

export const RESIDENT_IDS = Object.freeze(['lorekeeper', 'goth-girl', 'clown', 'witch']);
export const MAX_VISIBLE_BUBBLES = 2;
export const PROOF_TURN_CAP = Object.freeze({ min: 2, max: 4 });

const fixedRng = (value) => () => value;

function witnessedEvent(speakerId, tags) {
  return {
    id: 'resident-chat-ensemble-proof',
    witnessIds: RESIDENT_IDS,
    knowledgeTags: ['VISIBLE_SCENE', 'RESIDENT_ENSEMBLE'],
    tags: Array.from(new Set(['WORLD_EVENT', ...(tags || [])])),
    publicKnowledgeTags: ['KFB_TOWN']
  };
}

export function residentTurn({
  speakerId,
  addresseeId = null,
  affectState = null,
  socialOperator = null,
  priorSemantic = null,
  rng = 0.25,
  tags = [],
  recentTripletIds = []
} = {}) {
  const residentProfile = RESIDENT_PROFILES[speakerId];
  const output = prepareResidentTurn({
    speakerId,
    addresseeId,
    residentProfile,
    pool: RUNTIME_POOL,
    event: witnessedEvent(speakerId, tags),
    affectState,
    socialOperator,
    priorSemantic,
    recentTripletIds,
    provenanceRefs: ['RESIDENT_CHAT_ENSEMBLE_01B', 'OBSERVED'],
    rng: fixedRng(rng)
  });
  if (!validateResidentTurn(output)) throw new Error('Invalid Resident Chatter output for ' + speakerId);
  return output;
}

export function buildProofConversation() {
  const lorekeeper = residentTurn({
    speakerId: 'lorekeeper',
    addresseeId: 'witch',
    affectState: { primary: 'WARY', intensity: 'LOW' },
    rng: 0.45,
    tags: ['memory', 'witness', 'provenance']
  });
  if (lorekeeper.kind !== 'turn') throw new Error('Lorekeeper proof turn unexpectedly silent');

  const witch = residentTurn({
    speakerId: 'witch',
    addresseeId: 'lorekeeper',
    affectState: { primary: 'INTRIGUED', intensity: 'MEDIUM' },
    socialOperator: 'BOGGLE',
    priorSemantic: lorekeeper.semantic,
    rng: 0.2,
    tags: ['story', 'variable', 'condition']
  });
  if (witch.kind !== 'turn') throw new Error('Witch proof reply unexpectedly silent');

  const turns = [lorekeeper, witch];
  if (turns.length < PROOF_TURN_CAP.min || turns.length > PROOF_TURN_CAP.max) {
    throw new Error('Proof conversation outside 2-4 turn cap');
  }
  return turns;
}

export function buildPlayerTurn(residentId = 'clown', options = {}) {
  const affectState = options.affectState || { primary: 'AMUSED', intensity: 'LOW' };
  const out = residentTurn({
    speakerId: residentId,
    addresseeId: options.playerId || 'player',
    affectState,
    socialOperator: 'BINGO',
    rng: Number.isFinite(options.rng) ? options.rng : 0.55,
    tags: ['player', 'interaction', 'performance', 'action']
  });
  if (out.kind !== 'turn') throw new Error('Player interaction unexpectedly silent for ' + residentId);
  return out;
}
