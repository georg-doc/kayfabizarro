import test from 'node:test';
import assert from 'node:assert/strict';
import {
  prepareResidentTurn,
  inspectResidentKnowledge,
  validateResidentTurn
} from '../src/resident-chatter-adapter.v0.1.mjs';

const intent = (operation, invariant) => ({ operation, invariant });

function profile(id, refs = [], overrides = {}) {
  return {
    residentId: id,
    signatureTriplets: {
      refs,
      signatureWeight: 4,
      globalWeight: 1,
      relationBias: overrides.relationBias || []
    },
    attitude: {
      baseline: overrides.baseline || {
        warmth: 'NEUTRAL',
        energy: 'MEDIUM',
        pressure: 'MEDIUM',
        play: 'MEDIUM',
        openness: 'MEDIUM',
        reserve: 'MEDIUM'
      }
    },
    knowledgePolicy: {
      publicWorld: true
    },
    chatterBoxAdapter: {
      silenceAllowed: true,
      presentationHints: overrides.presentationHints || []
    }
  };
}

function entry(id, signatureOf, fallback, options = {}) {
  return {
    tripletId: id,
    signatureOf,
    fallback,
    transformIntent: options.transformIntent || intent('OTHER', options.invariant || id),
    semantic: {
      latentConcepts: options.concepts || [],
      relation: options.relation || 'SYNERGY'
    },
    eligibility: options.eligibility || {},
    attitudeAffinity: options.attitudeAffinity || {},
    fluffOlect: options.fluffOlect || { allowed: false },
    socialOperators: options.socialOperators || [],
    borrowedFallbacks: options.borrowedFallbacks || undefined
  };
}

const residents = {
  lorekeeper: profile('lorekeeper', ['lore.prov'], { relationBias: ['CATEGORY_SHIFT'] }),
  'goth-girl': profile('goth-girl', ['goth.performance'], { relationBias: ['MISFIT'] }),
  clown: profile('clown', ['clown.stage'], { relationBias: ['ESCALATION', 'CATEGORY_SHIFT'] }),
  witch: profile('witch', ['witch.variable'], { relationBias: ['SYNERGY', 'CATEGORY_SHIFT'] })
};

const sharedPool = {
  entries: [
    entry('lore.prov', ['lorekeeper'],
      { subject: 'Same story', connector: 'different witness', reframe: 'different fact' },
      { relation: 'CATEGORY_SHIFT', concepts: ['story', 'witness', 'fact'], transformIntent: intent('PROVENANCE', 'claim -> provenance') }),
    entry('goth.performance', ['goth-girl'],
      { subject: 'Perfect performance', connector: 'until you explained it', reframe: 'now it has instructions' },
      { relation: 'MISFIT', concepts: ['performance', 'explanation'], transformIntent: intent('PERFORMANCE', 'statement -> what landed') }),
    entry('clown.stage', ['clown'],
      { subject: 'Big claim', connector: 'one small stage', reframe: 'your turn' },
      { relation: 'CATEGORY_SHIFT', concepts: ['claim', 'stage'], transformIntent: intent('EMBODY', 'abstraction -> embodied public test') }),
    entry('witch.variable', ['witch'],
      { subject: 'Same story', connector: 'one ingredient missing', reframe: 'different creature' },
      { relation: 'SYNERGY', concepts: ['story', 'ingredient', 'variable'], transformIntent: intent('SUBSTITUTE', 'claim -> changed variable') })
  ]
};

const observedEvent = (speaker, extra = {}) => ({
  id: 'event-1',
  witnessIds: [speaker],
  knowledgeTags: ['SCENE_FACT'],
  tags: ['WORLD_EVENT'],
  ...extra
});

const heardEvent = (speaker, extra = {}) => ({
  id: 'event-heard',
  hearingIds: [speaker],
  heardKnowledgeTags: ['REPORTED_FACT'],
  tags: ['REPORT'],
  ...extra
});

const rng = (value) => () => value;

test('T01 Lorekeeper selects from the shared pool', () => {
  const out = prepareResidentTurn({
    speakerId: 'lorekeeper',
    residentProfile: residents.lorekeeper,
    pool: sharedPool,
    event: observedEvent('lorekeeper'),
    rng: rng(0.2)
  });
  assert.equal(out.kind, 'turn');
  assert.equal(out.tripletId, 'lore.prov');
});

test('T02 Goth Girl selects from the same shared pool', () => {
  const out = prepareResidentTurn({
    speakerId: 'goth-girl',
    residentProfile: residents['goth-girl'],
    pool: sharedPool,
    event: observedEvent('goth-girl'),
    rng: rng(0.2)
  });
  assert.equal(out.kind, 'turn');
  assert.equal(out.tripletId, 'goth.performance');
});

test('T03 Clown selects from the same shared pool', () => {
  const out = prepareResidentTurn({
    speakerId: 'clown',
    residentProfile: residents.clown,
    pool: sharedPool,
    event: observedEvent('clown'),
    rng: rng(0.2)
  });
  assert.equal(out.kind, 'turn');
  assert.equal(out.tripletId, 'clown.stage');
});

test('T04 Witch selects from the same shared pool', () => {
  const out = prepareResidentTurn({
    speakerId: 'witch',
    residentProfile: residents.witch,
    pool: sharedPool,
    event: observedEvent('witch'),
    rng: rng(0.2)
  });
  assert.equal(out.kind, 'turn');
  assert.equal(out.tripletId, 'witch.variable');
});

test('T05 no private resident pool is required', () => {
  const outputs = Object.entries(residents).map(([speakerId, residentProfile]) =>
    prepareResidentTurn({
      speakerId,
      residentProfile,
      pool: sharedPool,
      event: observedEvent(speakerId),
      rng: rng(0.2)
    })
  );
  assert.deepEqual(outputs.map((out) => out.kind), ['turn', 'turn', 'turn', 'turn']);
  assert.equal(new Set(outputs.map((out) => out.tripletId)).size, 4);
});

test('T06 an observed source fact can satisfy eligibility', () => {
  const pool = { entries: [
    entry('observed.only', [],
      { subject: 'Visible fact', connector: 'seen here', reframe: 'eligible' },
      { eligibility: { requiresKnowledgeTags: ['OBSERVED', 'SCENE_FACT'] }, transformIntent: intent('OTHER', 'observed fact stays observed') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'witch',
    residentProfile: residents.witch,
    pool,
    event: observedEvent('witch'),
    rng: rng(0)
  });
  assert.equal(out.tripletId, 'observed.only');
});

test('T07 an unseen source fact is ineligible', () => {
  const pool = { entries: [
    entry('observed.only', [],
      { subject: 'Visible fact', connector: 'seen here', reframe: 'eligible' },
      { eligibility: { requiresKnowledgeTags: ['OBSERVED'] }, transformIntent: intent('OTHER', 'requires witness') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'witch',
    residentProfile: residents.witch,
    pool,
    event: { witnessIds: ['clown'] },
    rng: rng(0)
  });
  assert.equal(out.kind, 'silence');
  assert.equal(out.reason, 'NO_ELIGIBLE_TRIPLET');
});

test('T08 HEARD cannot satisfy OBSERVED', () => {
  const pool = { entries: [
    entry('needs.observed', [],
      { subject: 'I saw it', connector: 'with my eyes', reframe: 'observed' },
      { eligibility: { requiresProvenance: ['OBSERVED'] }, transformIntent: intent('OTHER', 'observation requires witness') }),
    entry('needs.heard', [],
      { subject: 'I heard it', connector: 'from a witness', reframe: 'reported' },
      { eligibility: { requiresProvenance: ['HEARD'] }, transformIntent: intent('OTHER', 'hearsay remains hearsay') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'witch',
    residentProfile: residents.witch,
    pool,
    event: heardEvent('witch'),
    rng: rng(0)
  });
  assert.equal(out.tripletId, 'needs.heard');
  assert.equal(inspectResidentKnowledge({
    speakerId: 'witch',
    residentProfile: residents.witch,
    event: heardEvent('witch')
  }).isWitness, false);
});

test('T09 an absent resident does not inherit Card context', () => {
  const pool = { entries: [
    entry('card.seen', [],
      { subject: 'The card', connector: 'right here', reframe: 'visible' },
      { eligibility: { requiresKnowledgeTags: ['CARD_PRESENT'] }, transformIntent: intent('OTHER', 'card presence requires witness') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'lorekeeper',
    residentProfile: residents.lorekeeper,
    pool,
    event: { cardRef: 'ignore_dystopia#1', witnessIds: ['goth-girl', 'clown'] },
    rng: rng(0)
  });
  assert.equal(out.kind, 'silence');
});

test('T10 same Witch + INTRIGUED vs IRRITATED can select different valid candidates', () => {
  const p = profile('witch', ['witch.intrigued', 'witch.irritated']);
  const pool = { entries: [
    entry('witch.intrigued', ['witch'],
      { subject: 'Foreign prop', connector: 'inside the setup', reframe: 'useful variable' },
      { attitudeAffinity: { affects: ['INTRIGUED'] }, transformIntent: intent('SUBSTITUTE', 'foreign variable -> changed setup') }),
    entry('witch.irritated', ['witch'],
      { subject: 'Foreign prop', connector: 'before the test', reframe: 'invalid setup' },
      { attitudeAffinity: { affects: ['IRRITATED'] }, transformIntent: intent('SUBSTITUTE', 'foreign variable -> invalid setup') })
  ]};
  const common = { speakerId: 'witch', residentProfile: p, pool, event: observedEvent('witch'), rng: rng(0.55) };
  const intrigued = prepareResidentTurn({ ...common, affectState: { primary: 'INTRIGUED', intensity: 'MEDIUM' } });
  const irritated = prepareResidentTurn({ ...common, affectState: { primary: 'IRRITATED', intensity: 'MEDIUM' } });
  assert.equal(intrigued.tripletId, 'witch.intrigued');
  assert.equal(irritated.tripletId, 'witch.irritated');
});

test('T11 same Affect across residents preserves signature differences', () => {
  const affectState = { primary: 'AMUSED', intensity: 'LOW' };
  const lore = prepareResidentTurn({
    speakerId: 'lorekeeper', residentProfile: residents.lorekeeper, pool: sharedPool,
    event: observedEvent('lorekeeper'), affectState, rng: rng(0.2)
  });
  const clown = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool: sharedPool,
    event: observedEvent('clown'), affectState, rng: rng(0.2)
  });
  assert.equal(lore.tripletId, 'lore.prov');
  assert.equal(clown.tripletId, 'clown.stage');
});

test('T12 silence is a valid output', () => {
  const out = prepareResidentTurn({
    speakerId: 'goth-girl',
    residentProfile: residents['goth-girl'],
    pool: { entries: [] },
    event: observedEvent('goth-girl'),
    rng: rng(0)
  });
  assert.equal(out.kind, 'silence');
  assert.equal(validateResidentTurn(out), true);
});

test('T13 BINGO can land and hand closure back to the player', () => {
  const pool = { entries: [
    entry('land', [], { subject: 'That landed', connector: 'right here', reframe: 'your call' },
      { relation: 'SYNERGY', transformIntent: intent('OTHER', 'land then return closure') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'lorekeeper', residentProfile: residents.lorekeeper, pool,
    event: observedEvent('lorekeeper'), socialOperator: 'BINGO', rng: rng(0)
  });
  assert.equal(out.kind, 'turn');
  assert.equal(out.presentationHints.handClosureToPlayer, true);
});

test('T14 BONGO must carry established semantic material', () => {
  const pool = { entries: [
    entry('carry.clock', [], { subject: 'Same clock', connector: 'one more beat', reframe: 'still here' },
      { concepts: ['clock', 'timing'], transformIntent: intent('HOLD', 'carry clock frame one more beat') }),
    entry('unrelated', [], { subject: 'Different tree', connector: 'elsewhere', reframe: 'new topic' },
      { concepts: ['tree'], transformIntent: intent('HOLD', 'unrelated frame') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'goth-girl', residentProfile: residents['goth-girl'], pool,
    event: observedEvent('goth-girl'), socialOperator: 'BONGO',
    priorSemantic: { latentConcepts: ['clock'] }, rng: rng(0.9)
  });
  assert.equal(out.tripletId, 'carry.clock');
  assert.equal(out.presentationHints.holdFrame, true);
});

test('T15 BOGGLE must reframe established material', () => {
  const pool = { entries: [
    entry('reframe.clock', [], { subject: 'Same clock', connector: 'different hand', reframe: 'different midnight' },
      { concepts: ['clock'], relation: 'CATEGORY_SHIFT', transformIntent: intent('REFRAME', 'clock -> changed controller') }),
    entry('hold.clock', [], { subject: 'Same clock', connector: 'same hand', reframe: 'same frame' },
      { concepts: ['clock'], relation: 'SYNERGY', transformIntent: intent('HOLD', 'hold clock frame') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'witch', residentProfile: residents.witch, pool,
    event: observedEvent('witch'), socialOperator: 'BOGGLE',
    priorSemantic: { latentConcepts: ['clock'] }, rng: rng(0.9)
  });
  assert.equal(out.tripletId, 'reframe.clock');
  assert.equal(out.presentationHints.reframe, true);
});

test('T16 BLÖDSINN objects without mutating hostility', () => {
  const pool = { entries: [
    entry('object.frame', [], { subject: 'That frame', connector: 'does not follow', reframe: 'BLÖDSINN' },
      { relation: 'COLLISION', transformIntent: intent('OBJECT', 'object to current frame') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool,
    event: observedEvent('clown'), socialOperator: 'BLOEDSINN', rng: rng(0)
  });
  assert.equal(out.kind, 'turn');
  assert.equal(out.presentationHints.objectFrame, true);
  assert.equal(JSON.stringify(out).includes('hostility'), false);
});

test('T17 authored Fluff-o-lect target passes', () => {
  const pool = { entries: [
    entry('fluff.valid', [], { subject: 'Nothing changed', connector: 'except the frame', reframe: 'everything changed' }, {
      transformIntent: intent('REFRAME', 'frame -> category shift'),
      fluffOlect: {
        allowed: true,
        replaceTarget: 'frame',
        maxReplacements: 1,
        fallbackVariant: { subject: 'Nothing changed', connector: 'except the FLUFF', reframe: 'everything changed' }
      }
    })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool,
    event: observedEvent('clown'), fluffOlect: { enabled: true, target: 'frame' }, rng: rng(0)
  });
  assert.equal(out.kind, 'turn');
  assert.match(out.utterance, /FLUFF/);
});

test('T18 random or unlisted Fluff-o-lect target fails', () => {
  const pool = { entries: [
    entry('fluff.valid', [], { subject: 'Nothing changed', connector: 'except the frame', reframe: 'everything changed' }, {
      transformIntent: intent('REFRAME', 'frame -> category shift'),
      fluffOlect: {
        allowed: true,
        replaceTarget: 'frame',
        maxReplacements: 1,
        fallbackVariant: { subject: 'Nothing changed', connector: 'except the FLUFF', reframe: 'everything changed' }
      }
    })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool,
    event: observedEvent('clown'), fluffOlect: { enabled: true, target: 'random-word' }, rng: rng(0)
  });
  assert.equal(out.kind, 'silence');
});

test('T19 borrowed signature requires unlock and retains provenance', () => {
  const borrowed = entry('lore.borrowable', ['lorekeeper'],
    { subject: 'Same story', connector: 'different witness', reframe: 'different fact' }, {
      concepts: ['story', 'witness'],
      transformIntent: intent('PROVENANCE', 'claim -> provenance'),
      borrowedFallbacks: {
        clown: { subject: 'Same fall', connector: 'different witness', reframe: 'run it again' }
      }
    });
  const pool = { entries: [borrowed] };
  const locked = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool,
    event: observedEvent('clown'), rng: rng(0)
  });
  const unlocked = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool,
    event: observedEvent('clown'), unlockedTripletRefs: ['lore.borrowable'], rng: rng(0)
  });
  assert.equal(locked.kind, 'silence');
  assert.equal(unlocked.kind, 'turn');
  assert.equal(unlocked.borrowedFrom, 'lorekeeper');
});

test('T20 borrowed signature is transformed by the current speaker method', () => {
  const pool = { entries: [
    entry('lore.borrowable', ['lorekeeper'],
      { subject: 'Same story', connector: 'different witness', reframe: 'different fact' }, {
        transformIntent: intent('EMBODY', 'borrow provenance motif -> repeatable test'),
        borrowedFallbacks: {
          clown: { subject: 'Same fall', connector: 'different witness', reframe: 'run it again' }
        }
      })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool,
    event: observedEvent('clown'), unlockedTripletRefs: ['lore.borrowable'], rng: rng(0)
  });
  assert.equal(out.utterance, 'Same fall / different witness / run it again');
  assert.notEqual(out.utterance, 'Same story / different witness / different fact');
  assert.equal(out.semantic.transformIntent.operation, 'EMBODY');
});

test('T21 repetition penalty prevents a signature catchphrase loop', () => {
  const p = profile('clown', ['repeat.me', 'fresh.one']);
  const pool = { entries: [
    entry('repeat.me', ['clown'], { subject: 'Big claim', connector: 'small stage', reframe: 'your turn' },
      { transformIntent: intent('EMBODY', 'repeat candidate') }),
    entry('fresh.one', ['clown'], { subject: 'Easy agreement', connector: 'until action', reframe: 'volunteer' },
      { transformIntent: intent('EMBODY', 'fresh candidate') })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'clown', residentProfile: p, pool, event: observedEvent('clown'),
    recentTripletIds: ['repeat.me'], rng: rng(0.1)
  });
  assert.equal(out.tripletId, 'fresh.one');
});

test('T22 transformIntent survives selection unchanged', () => {
  const invariant = 'abstraction -> embodied public test';
  const pool = { entries: [
    entry('intent.keep', [], { subject: 'Big claim', connector: 'small stage', reframe: 'your turn' },
      { transformIntent: intent('EMBODY', invariant) })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool, event: observedEvent('clown'), rng: rng(0)
  });
  assert.equal(out.semantic.transformIntent.invariant, invariant);
  assert.equal(validateResidentTurn(out), true);
});

test('T23 adapter output cannot write reward or POP state', () => {
  const out = prepareResidentTurn({
    speakerId: 'clown', residentProfile: residents.clown, pool: sharedPool,
    event: observedEvent('clown'), rng: rng(0.2)
  });
  const serialized = JSON.stringify(out).toLowerCase();
  assert.equal(serialized.includes('"reward"'), false);
  assert.equal(serialized.includes('"pop"'), false);
});

test('T24 adapter output cannot write animation or bone state', () => {
  const out = prepareResidentTurn({
    speakerId: 'witch', residentProfile: residents.witch, pool: sharedPool,
    event: observedEvent('witch'), rng: rng(0.2)
  });
  const serialized = JSON.stringify(out).toLowerCase();
  assert.equal(serialized.includes('"animation"'), false);
  assert.equal(serialized.includes('"bone"'), false);
  assert.equal(serialized.includes('"clip"'), false);
});

test('T25 fixed RNG is deterministic', () => {
  const args = {
    speakerId: 'witch',
    residentProfile: residents.witch,
    pool: sharedPool,
    event: observedEvent('witch'),
    rng: rng(0.333)
  };
  const a = prepareResidentTurn(args);
  const b = prepareResidentTurn({ ...args, rng: rng(0.333) });
  assert.deepEqual(a, b);
});

// Existing authoring fixtures encoded as regression checks.

test('R01 Doomsday Clock keeps four distinct methods on one shared Card event', () => {
  const eventFor = (id) => ({
    id: 'doomsday-clock',
    witnessIds: [id],
    cardRef: 'ignore_dystopia#1',
    knowledgeTags: ['CARD_CLAIM'],
    cardTags: ['PUBLIC_TIMER', 'JUDGMENT'],
    tags: ['CARD_PRESENT']
  });
  const outputs = Object.entries(residents).map(([speakerId, residentProfile]) =>
    prepareResidentTurn({ speakerId, residentProfile, pool: sharedPool, event: eventFor(speakerId), rng: rng(0.2) })
  );
  assert.deepEqual(outputs.map((o) => o.tripletId),
    ['lore.prov', 'goth.performance', 'clown.stage', 'witch.variable']);
});

test('R02 M02 world event: Witch Affect changes consequence while Goth Girl may stay silent', () => {
  const p = profile('witch', ['witch.intrigued', 'witch.irritated']);
  const pool = { entries: [
    entry('witch.intrigued', ['witch'],
      { subject: 'Foreign prop', connector: 'inside the setup', reframe: 'useful variable' },
      { attitudeAffinity: { affects: ['INTRIGUED'] }, transformIntent: intent('SUBSTITUTE', 'foreign prop -> useful variable') }),
    entry('witch.irritated', ['witch'],
      { subject: 'Foreign prop', connector: 'before the test', reframe: 'invalid setup' },
      { attitudeAffinity: { affects: ['IRRITATED'] }, transformIntent: intent('SUBSTITUTE', 'foreign prop -> invalid setup') })
  ]};
  const event = observedEvent('witch', { tags: ['WORLD_EVENT', 'WORKBENCH'] });
  const intrigued = prepareResidentTurn({
    speakerId: 'witch', residentProfile: p, pool, event,
    affectState: { primary: 'INTRIGUED', intensity: 'MEDIUM' }, rng: rng(0.55)
  });
  const irritated = prepareResidentTurn({
    speakerId: 'witch', residentProfile: p, pool, event,
    affectState: { primary: 'IRRITATED', intensity: 'MEDIUM' }, rng: rng(0.55)
  });
  const gothSilence = prepareResidentTurn({
    speakerId: 'goth-girl', residentProfile: residents['goth-girl'], pool: { entries: [] },
    event: observedEvent('goth-girl'), affectState: { primary: 'AMUSED', intensity: 'LOW' }, rng: rng(0)
  });
  assert.equal(intrigued.tripletId, 'witch.intrigued');
  assert.equal(irritated.tripletId, 'witch.irritated');
  assert.equal(gothSilence.kind, 'silence');
});

test('R03 M03 heard vs observed preserves asymmetric knowledge', () => {
  const pool = { entries: [
    entry('observed.clock', [], { subject: 'The clock arrived', connector: 'on my stage', reframe: 'not subtle' },
      { eligibility: { requiresProvenance: ['OBSERVED'] }, transformIntent: intent('PERFORMANCE', 'observed stage event') }),
    entry('heard.clock', [], { subject: 'Reported change', connector: 'without my observation', reframe: 'untested condition' },
      { eligibility: { requiresProvenance: ['HEARD'] }, transformIntent: intent('SUBSTITUTE', 'heard report stays reported') })
  ]};
  const goth = prepareResidentTurn({
    speakerId: 'goth-girl', residentProfile: residents['goth-girl'], pool,
    event: { witnessIds: ['goth-girl'], cardRef: 'ignore_dystopia#1' }, rng: rng(0)
  });
  const witch = prepareResidentTurn({
    speakerId: 'witch', residentProfile: residents.witch, pool,
    event: { hearingIds: ['witch'], cardRef: 'ignore_dystopia#1', cardReportedToHearers: true }, rng: rng(0)
  });
  const lore = prepareResidentTurn({
    speakerId: 'lorekeeper', residentProfile: residents.lorekeeper, pool,
    event: { witnessIds: ['goth-girl'], hearingIds: ['witch'], cardRef: 'ignore_dystopia#1' }, rng: rng(0)
  });
  assert.equal(goth.tripletId, 'observed.clock');
  assert.equal(witch.tripletId, 'heard.clock');
  assert.equal(lore.kind, 'silence');
});

test('R04 M04 borrowed Lorekeeper signature becomes a Clown test without knowledge transfer', () => {
  const pool = { entries: [
    entry('lore.borrowable', ['lorekeeper'],
      { subject: 'Same story', connector: 'different witness', reframe: 'different fact' }, {
        concepts: ['fall', 'witness'],
        transformIntent: intent('EMBODY', 'borrow provenance motif -> repeatable test'),
        borrowedFallbacks: {
          clown: { subject: 'Same fall', connector: 'different witness', reframe: 'run it again' }
        }
      })
  ]};
  const out = prepareResidentTurn({
    speakerId: 'clown',
    residentProfile: residents.clown,
    pool,
    event: observedEvent('clown'),
    unlockedTripletRefs: ['lore.borrowable'],
    knowledgeItems: [{ residentId: 'clown', provenance: 'HEARD', tags: ['LOREKEEPER_TRIPLET_HEARD'] }],
    rng: rng(0)
  });
  assert.equal(out.kind, 'turn');
  assert.equal(out.borrowedFrom, 'lorekeeper');
  assert.equal(out.utterance, 'Same fall / different witness / run it again');
  const knowledge = inspectResidentKnowledge({
    speakerId: 'clown',
    residentProfile: residents.clown,
    event: observedEvent('clown'),
    knowledgeItems: [{ residentId: 'clown', provenance: 'HEARD', tags: ['LOREKEEPER_TRIPLET_HEARD'] }]
  });
  assert.ok(knowledge.tags.includes('HEARD'));
  assert.equal(knowledge.tags.includes('LOREKEEPER_PRIVATE_MEMORY'), false);
});
