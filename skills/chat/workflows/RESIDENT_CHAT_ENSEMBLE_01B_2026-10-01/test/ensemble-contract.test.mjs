import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SOURCE_ARTIFACTS,
  RESIDENT_PROFILE_SOURCE,
  TRIPLET_POOL_SOURCE,
  RESIDENT_PROFILES,
  RUNTIME_POOL
} from '../src/resident-chat-ensemble-data.mjs';
import {
  RESIDENT_IDS,
  MAX_VISIBLE_BUBBLES,
  PROOF_TURN_CAP,
  buildProofConversation,
  buildPlayerTurn
} from '../src/resident-chat-ensemble-dialogue.mjs';

const METHOD = {
  lorekeeper: 'PROVENANCE',
  'goth-girl': 'PERFORMANCE_TRUTH',
  clown: 'EMBODIED_STRESS_TEST',
  witch: 'ONE_VARIABLE_TRANSFORMATION'
};

const ACTOR = {
  lorekeeper: 'Lorekeeper.glb',
  'goth-girl': 'GothGirl.glb',
  clown: 'Clown.glb',
  witch: 'Witch.glb'
};

test('E01 exact four source-backed Residents are the ensemble contract', () => {
  assert.deepEqual(RESIDENT_IDS, ['lorekeeper', 'goth-girl', 'clown', 'witch']);
  assert.equal(Object.keys(RESIDENT_PROFILES).length, 4);
});

test('E02 Site-authored source artifacts remain checksum-pinned', () => {
  assert.deepEqual(SOURCE_ARTIFACTS, {
    residentProfiles: {
      fileId: 'dcbbde71-c62c-4331-9fd6-cab7178b6187',
      sha256: '96d201b766bf84b7b3a725f4ae8d55b376fb3e0fe0e456e75ad7241773daa16f'
    },
    semanticTripletPool: {
      fileId: '0d7d3aea-b1a6-43f0-a65f-c327145c5191',
      sha256: 'cac0333d9ea973d2dd727d57bd67314c60789dfc70d04d8e91d5ff9783f81136'
    },
    semanticTripletContract: {
      fileId: '1469e6ad-3316-46ff-a74f-4c77937e4404',
      sha256: 'bb749c32fbc7850957f9b2e15496da4d7abba6bd5fe025dd27609f48b9abc674'
    }
  });
});

test('E03 all four profiles still use one shared language owner', () => {
  assert.equal(RESIDENT_PROFILE_SOURCE.sharedLanguage.tripletPool,
    'RESIDENT-CHAT-POC-01_SEMANTIC_TRIPLET_POOL_v0.1.candidate.json');
  assert.deepEqual(RESIDENT_PROFILE_SOURCE.sharedLanguage.chatterBoxOwns,
    ['speakerChoice', 'timing', 'speechBudget', 'presentation']);
  for (const id of RESIDENT_IDS) {
    assert.equal(RESIDENT_PROFILES[id].signatureTriplets.refs.length, 4);
  }
});

test('E04 profile methods and baseline Attitude remain the persisted candidate authoring', () => {
  for (const id of RESIDENT_IDS) {
    assert.equal(RESIDENT_PROFILES[id].authoring.method, METHOD[id]);
    assert.ok(RESIDENT_PROFILES[id].attitude.baseline);
    assert.ok(RESIDENT_PROFILES[id].attitude.colour);
  }
  assert.equal(RESIDENT_PROFILES.lorekeeper.attitude.colour, 'calm curiosity with dry precision');
  assert.equal(RESIDENT_PROFILES['goth-girl'].attitude.colour, 'attentive restraint; reaction must be earned');
  assert.equal(RESIDENT_PROFILES.clown.attitude.colour, 'provocative curiosity; delight when claims acquire stakes');
  assert.equal(RESIDENT_PROFILES.witch.attitude.colour, 'practical fascination; warmer when something becomes testable');
});

test('E05 source actor truth stays Atlas-backed and Rig_Medium', () => {
  for (const id of RESIDENT_IDS) {
    assert.equal(RESIDENT_PROFILES[id].source.rigFamily, 'Rig_Medium');
    assert.equal(RESIDENT_PROFILES[id].source.actorAsset, ACTOR[id]);
  }
});

test('E06 one shared 20-entry pool is normalized to the tested kernel contract', () => {
  assert.equal(TRIPLET_POOL_SOURCE.rules.sharedPool, true);
  assert.equal(TRIPLET_POOL_SOURCE.rules.privateResidentPools, false);
  assert.equal(TRIPLET_POOL_SOURCE.entries.length, 20);
  assert.equal(RUNTIME_POOL.entries.length, 20);
  for (const entry of RUNTIME_POOL.entries) {
    assert.ok(entry.fallback.subject);
    assert.ok(entry.fallback.connector);
    assert.ok(entry.fallback.reframe);
    assert.ok(entry.transformIntent.invariant);
    assert.ok(entry.semantic.relation);
  }
});

test('E07 Lorekeeper opens the proof through provenance, not a private phrase bank', () => {
  const [turn] = buildProofConversation();
  assert.equal(turn.kind, 'turn');
  assert.equal(turn.speakerId, 'lorekeeper');
  assert.equal(turn.addresseeId, 'witch');
  assert.equal(turn.tripletId, 'lorekeeper.provenance.02');
  assert.equal(turn.semantic.transformIntent.operation, 'PROVENANCE');
  assert.equal(turn.affect.primary, 'WARY');
});

test('E08 Witch replies by reframing one variable from established material', () => {
  const [, turn] = buildProofConversation();
  assert.equal(turn.kind, 'turn');
  assert.equal(turn.speakerId, 'witch');
  assert.equal(turn.addresseeId, 'lorekeeper');
  assert.equal(turn.tripletId, 'witch.variable.01');
  assert.equal(turn.socialOperator, 'BOGGLE');
  assert.equal(turn.semantic.transformIntent.operation, 'SUBSTITUTE');
  assert.equal(turn.presentationHints.reframe, true);
});

test('E09 autonomous proof stays inside the existing 2-4 utterance cap', () => {
  const turns = buildProofConversation();
  assert.equal(turns.length, 2);
  assert.ok(turns.length >= PROOF_TURN_CAP.min);
  assert.ok(turns.length <= PROOF_TURN_CAP.max);
  assert.deepEqual(turns.map((turn) => turn.speakerId), ['lorekeeper', 'witch']);
});

test('E10 player-targeted seam hands closure back without creating a scheduler', () => {
  const turn = buildPlayerTurn('clown', { playerId: 'player', rng: 0.55 });
  assert.equal(turn.kind, 'turn');
  assert.equal(turn.speakerId, 'clown');
  assert.equal(turn.addresseeId, 'player');
  assert.equal(turn.socialOperator, 'BINGO');
  assert.equal(turn.presentationHints.handClosureToPlayer, true);
  assert.match(turn.tripletId, /^clown\./);
});

test('E11 visible bubble budget remains a soft maximum of two', () => {
  assert.equal(MAX_VISIBLE_BUBBLES, 2);
});

test('E12 deterministic outputs contain no reward, animation, bone, clip or persistent-memory mutation owner', () => {
  const outputs = [...buildProofConversation(), buildPlayerTurn('clown')];
  const serialized = JSON.stringify(outputs).toLowerCase();
  for (const forbidden of ['"reward"', '"pop"', '"bone"', '"clip"', '"animation"', '"statemutation"']) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
  for (const output of outputs) assert.deepEqual(output.memoryCandidates, []);
});
