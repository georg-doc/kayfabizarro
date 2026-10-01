// RESIDENT-CHAT-PRESENTATION-01 · donor-derived shared-pool provider
// Presentation proof only. The donor recipe remains the text/source owner for this parity slice.
// The deterministic adapter selects one shared-pool Triplet per speaker; no LLM/network use.

import {
  prepareResidentTurn,
  validateResidentTurn,
} from '../RESIDENT_CHAT_POC_01_2026-10-01/src/resident-chatter-adapter.v0.1.mjs';

const SLOT_ID = Object.freeze({ A: 'frizzlebob', B: 'goth-girl' });
const SLOT_OPERATION = Object.freeze({ A: 'EMBODY', B: 'PERFORMANCE' });

function sourceRows(recipe, slot) {
  const rows = recipe && recipe.triplets && recipe.triplets[slot];
  return Array.isArray(rows) ? rows : [];
}

function fallbackFromRow(row = {}) {
  return {
    subject: String(row.observation || ''),
    connector: String(row.interpretation || ''),
    reframe: String(row.counter || row.implication || ''),
  };
}

export function buildDonorSharedPool(recipe) {
  const entries = [];
  for (const slot of ['A', 'B']) {
    const residentId = SLOT_ID[slot];
    sourceRows(recipe, slot).forEach((row, index) => {
      const fallback = fallbackFromRow(row);
      entries.push({
        tripletId: `npc-card-spec-01.${slot.toLowerCase()}.${index}`,
        status: 'SOURCE_DONOR_FIXTURE',
        signatureOf: [residentId],
        fallback,
        transformIntent: {
          operation: SLOT_OPERATION[slot],
          invariant: 'preserve exact NPC-CARD-SPEC-01 donor wording and subject/connector/reframe order',
        },
        semantic: {
          latentConcepts: ['doomsday-clock', slot === 'A' ? 'mechanism' : 'performance'],
          relation: slot === 'A' ? 'CATEGORY_SHIFT' : 'MISFIT',
        },
        eligibility: {},
        attitudeAffinity: {},
        fluffOlect: { allowed: false },
        social: {
          unlockableReply: false,
          quotable: true,
          borrowable: false,
          provenanceRequired: true,
        },
      });
    });
  }
  return { schema: 'kfb.semantic-triplet-pool/0.1-donor-fixture', entries };
}

function profileFor(recipe, slot) {
  const residentId = SLOT_ID[slot];
  const actor = (recipe.actors || []).find((item) => item.slot === slot) || {};
  const refs = sourceRows(recipe, slot).map((_, index) => `npc-card-spec-01.${slot.toLowerCase()}.${index}`);
  return {
    residentId,
    displayName: actor.displayName || residentId,
    signatureTriplets: {
      refs,
      signatureWeight: 4,
      globalWeight: 1,
      relationBias: [],
    },
    attitude: {
      baseline: {
        warmth: 'NEUTRAL',
        energy: 'MEDIUM',
        pressure: 'MEDIUM',
        play: 'MEDIUM',
        openness: 'MEDIUM',
        reserve: 'MEDIUM',
      },
    },
    knowledgePolicy: { publicWorld: true },
    chatterBoxAdapter: {
      silenceAllowed: true,
      presentationHints: ['npc-card-spec-01-donor-parity'],
    },
  };
}

function rngForVariant(variant, count) {
  if (count <= 1) return () => 0;
  const index = ((Number(variant) || 0) % count + count) % count;
  return () => (index + 0.001) / count;
}

export function createDonorSemanticLineProvider({ recipe }) {
  if (!recipe || !recipe.triplets) throw new Error('NPC-CARD-SPEC-01 recipe with triplets is required');

  const pool = buildDonorSharedPool(recipe);
  const profiles = {
    A: profileFor(recipe, 'A'),
    B: profileFor(recipe, 'B'),
  };
  const cache = new Map();

  function turn(slot, variant = 0) {
    if (!profiles[slot]) return null;
    const rows = sourceRows(recipe, slot);
    if (!rows.length) return null;
    const normalized = ((Number(variant) || 0) % rows.length + rows.length) % rows.length;
    const key = slot + ':' + normalized;
    if (cache.has(key)) return cache.get(key);

    const residentProfile = profiles[slot];
    const output = prepareResidentTurn({
      speakerId: residentProfile.residentId,
      residentProfile,
      pool,
      event: {
        id: 'npc-card-spec-01.doomsday-clock',
        witnessIds: [residentProfile.residentId],
        cardRef: 'ignore_dystopia#1',
        knowledgeTags: ['CARD_PRESENT', 'DOOMSDAY_CLOCK'],
        cardTags: ['PUBLIC_TIMER', 'JUDGMENT'],
        tags: ['CARD_PRESENT', 'PRESENTATION_FIXTURE'],
      },
      provenanceRefs: ['NPC-CARD-SPEC-01', recipe.id, 'variant:' + normalized],
      rng: rngForVariant(normalized, rows.length),
    });
    if (!validateResidentTurn(output) || output.kind !== 'turn') {
      throw new Error('deterministic donor Triplet selection failed for ' + key);
    }
    cache.set(key, output);
    return output;
  }

  function line({ slot, key, variant = 0 }) {
    const output = turn(slot, variant);
    if (!output) return null;
    if (key === 'observation') return output.semantic.subject;
    if (key === 'interpretation') return output.semantic.connector;
    if (key === 'counter' || key === 'implication') return output.semantic.reframe;
    return null;
  }

  function report() {
    const selected = {};
    for (const slot of ['A', 'B']) {
      selected[slot] = sourceRows(recipe, slot).map((_, variant) => {
        const output = turn(slot, variant);
        return {
          variant,
          tripletId: output.tripletId,
          utterance: output.utterance,
          provenanceRefs: output.provenanceRefs,
        };
      });
    }
    return {
      schema: 'kfb.resident-chat-presentation/0.1',
      source: 'RESIDENT-CHAT-POC-01 deterministic adapter ← NPC-CARD-SPEC-01 donor triplets',
      poolEntries: pool.entries.length,
      selected,
    };
  }

  return Object.freeze({
    source: 'shared-pool deterministic adapter · donor parity',
    pool,
    profiles,
    turn,
    line,
    report,
  });
}

export default createDonorSemanticLineProvider;
