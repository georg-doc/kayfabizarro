/* Run at repository root:
 * node skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/tools/test_deterministic_triplet_pilot_r1.cjs
 * No network, LLM, hidden corpora or Site/audio dependencies.
 */
'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
const pilot = require('./deterministic_triplet_pilot_r1.cjs');
const ROOT = process.cwd();
const D = 'skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/';
const file = name => fs.readFileSync(path.join(ROOT, name), 'utf8');
const gitBlob = text => crypto.createHash('sha1').update('blob ' +
  Buffer.byteLength(text, 'utf8') + '\0').update(text, 'utf8').digest('hex');
const fixture = JSON.parse(file(D +
  'data/KFB_TRIPLETS_SPAN_OPERATOR_PILOT_R1_FIXTURES_2026-10-13.json'));
const decks = Object.fromEntries(fixture.decks.map(d => {
  const raw = file(d.path);
  assert.equal(gitBlob(raw), d.blob, 'unpinned source deck: ' + d.deckId);
  return [d.deckId, { ...d, data: JSON.parse(raw) }];
}));
const checks = [];
const check = (name, f) => { f(); checks.push(name); };
const getMeta = (id, cardNumber) => ({ deckId: id, cardNumber,
  revision: decks[id].blob });
const original = (id, cardNumber) =>
  decks[id].data.cards.find(c => Number(c.cardNumber) === cardNumber);
const expected = [
  "The war didn't start over land or ideology, but over a snickerdoodle.",
  "They are 'safe' now because the doors are locked from the outside.",
  "The fear tracks the coverage, not the actual events.",
  "The fear is the renewable product, not the forecast.",
  "She doesn't want the Vizier's son; she wants the guy with the blue giant in his corner."
];
const generated = [];
fixture.triplets.forEach((recipe, i) => {
  const meta = getMeta(recipe.deckId, recipe.cardNumber);
  let candidate;
  check('Triplet text '+i, () => {
    candidate = pilot.compileTriplet(decks[meta.deckId].data, meta, recipe);
    assert.equal(candidate.text, expected[i]);
    assert.equal(candidate.kind, 'TRIPLET_CANDIDATE');
  });
  check('Source span coordinates '+i, () => {
    for(const part of candidate.pieces.filter(p => p.type === 'SOURCE')){
      const fieldText = original(meta.deckId, meta.cardNumber)[part.source.field];
      assert.equal(fieldText.slice(part.source.start, part.source.end), part.value);
    }
  });
  check('No creative promotion '+i, () => {
    assert.equal(candidate.admitted, false);
    assert.equal(candidate.reviewStatus, 'EDITORIAL_CANDIDATE');
  });
  generated.push(candidate);
});
check('All three exact source corpora', () =>
  assert.deepEqual(fixture.decks.map(d => decks[d.deckId].data.cards.length),
    [48, 60, 56]));
const bridge = fixture.bridges[0];
const from = getMeta(bridge.from.deckId, bridge.from.cardNumber);
const to = getMeta(bridge.to.deckId, bridge.to.cardNumber);
check('Bridge effect/cost and exact source', () => {
  const compiled = pilot.compileBridge(decks[from.deckId].data,
    decks[to.deckId].data, from, to, bridge);
  assert.equal(compiled.kind, 'BRIDGE_CANDIDATE');
  assert.equal(compiled.admitted, false);
  assert.equal(compiled.text,
    'It never arrived, so issue the next at full volume.');
  assert.ok(compiled.proof.changedStake);
  for(const piece of compiled.pieces.filter(p => p.type === 'SOURCE')){
    const c = original(piece.source.deckId, piece.source.cardNumber);
    assert.equal(c[piece.source.field].slice(piece.source.start,
      piece.source.end), piece.value);
  }
});
check('Explicit no-triplet on missing recipe', () =>
  assert.equal(pilot.compileTriplet(decks['1001_kayfabe_nights'].data,
    getMeta('1001_kayfabe_nights',11), null).kind,'NO_TRIPLET'));
check('Explicit no-edge on incompatible Card pair', () =>
  assert.equal(pilot.compileBridge(decks.wrinkle_rumble.data,
    decks['1001_kayfabe_nights'].data,
    getMeta('wrinkle_rumble',31),getMeta('1001_kayfabe_nights',12),
    null).kind, 'NO_EDGE'));
check('No deck-scope collapse 60→3', () => {
  const s = pilot.deckScope(decks['1001_kayfabe_nights'].data,
    '1001_kayfabe_nights', decks['1001_kayfabe_nights'].blob,'deck');
  assert.equal(s.selected.length, 60);
  assert.equal(s.omitted.length, 0);
});
check('Stable seeded selection', () =>
  assert.equal(pilot.seededPick(generated,'kfb-1001').text,
    pilot.seededPick(generated,'kfb-1001').text));
check('Reject summary as a typed Triplet operator', () =>
  assert.throws(() => pilot.compileTriplet(decks.wrinkle_rumble.data,
    getMeta('wrinkle_rumble',10),
    { ...fixture.triplets[0], operatorId:'TITLE_POWER_LORE_SUMMARY' }),
    /NO_SEMANTIC_OPERATOR/));
check('Reject invented source quote', () =>
  assert.throws(() => pilot.extractSpan(decks.wrinkle_rumble.data,31,
    'lore','invisible circus in space','wrinkle_rumble',
    decks.wrinkle_rumble.blob),/SOURCE_QUOTE_MISSING/));
check('Reject invented surface glue', () =>
  assert.throws(() => pilot.compileTriplet(decks.wrinkle_rumble.data,
    getMeta('wrinkle_rumble',31), {
      ...fixture.triplets[1], surface:[
        {glue:' Suddenly a wizard appeared '},
        ...fixture.triplets[1].surface] }), /UNAPPROVED_GLUE/));
check('Reject invented Bridge operator', () =>
  assert.throws(() => pilot.compileBridge(decks[from.deckId].data,
    decks[to.deckId].data, from, to,
    {...bridge,operatorId:'RANDOM_THEREFORE'}), /UNKNOWN_BRIDGE_OPERATOR/));
check('Reject unproven Bridge state transition', () =>
  assert.throws(() => pilot.compileBridge(decks[from.deckId].data,
    decks[to.deckId].data, from, to, {
      ...bridge, proof:{...bridge.proof,changedStake:''} }),
    /MISSING_BRIDGE_PROOF/));
check('Frozen negative-Golden unchanged', () => {
  const gold = file(fixture.frozenNegative.path);
  assert.equal(gitBlob(gold),fixture.frozenNegative.blob);
  assert.equal(fixture.frozenNegative.status,'HUMAN_FAIL_QUARANTINED');
  assert.equal(fixture.frozenNegative.semanticTripletsAccepted,0);
  assert.equal(fixture.frozenNegative.bridgesAccepted,0);
});
check('Bad original 1001 output cannot be compiled by inserting as glue', () => {
  const gold = file(fixture.frozenNegative.path);
  const old = gold.match(/SHAHRYĀR, THE DESTROYER issues a Pink Slip[^\n]+/);
  assert.ok(old);
  assert.throws(() => pilot.compileTriplet(decks['1001_kayfabe_nights'].data,
    getMeta('1001_kayfabe_nights',5),
    {...fixture.triplets[0],deckId:'1001_kayfabe_nights',
      cardNumber:5,surface:[{glue:old[0]}]}),/UNAPPROVED_GLUE/);
});
check('No accidental Audio multi-deck approval', () =>
  assert.equal(fixture.audioSite.otherDecksSupported,false));
const sourceWordSum = generated.reduce((n,x)=>n+x.sourceWords,0);
const glueWordSum = generated.reduce((n,x)=>n+x.glueWords,0);
console.log(JSON.stringify({
  status:'TECHNICAL_PASS_NOT_HUMAN_CREATIVE_PASS',
  checks:checks.length,
  deckCounts:fixture.decks.map(d=>({deck:d.deckId,cards:decks[d.deckId].data.cards.length})),
  generated:generated.map(x=>({card:x.deckId+':'+x.cardNumber,text:x.text,
    sourceWords:x.sourceWords,glueWords:x.glueWords})),
  sourceWordSum,glueWordSum,
  note:'Lexical source-span ratio is not independently validated semantic comedy.',
  acceptedTriplets:0,acceptedBridges:0,pluginUpdated:false,
  next:'Independent creative critique; existing negative Golden stays human FAIL.'
},null,2));
