import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import {
  buildDonorSharedPool,
  createDonorSemanticLineProvider,
} from '../donor-semantic-provider.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const donorRoot = path.join(
  root,
  'tools/KFB-ToolBox/_inbox/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24'
);
const recipePath = path.join(donorRoot, 'npc-card-spec-01/resident-card-speculation.recipe.json');
const runnerPath = path.join(donorRoot, 'npc-card-spec-01/resident-scene.mjs');
const hostPath = path.join(donorRoot, 'NPC Card Speculation Scene.dc.html');
const providerPath = path.resolve(here, '../donor-semantic-provider.mjs');
const kernelPath = path.join(
  root,
  'skills/chat/workflows/RESIDENT_CHAT_POC_01_2026-10-01/src/resident-chatter-adapter.v0.1.mjs'
);

const recipeText = fs.readFileSync(recipePath, 'utf8');
const recipe = JSON.parse(recipeText);
const runnerText = fs.readFileSync(runnerPath, 'utf8');
const hostText = fs.readFileSync(hostPath, 'utf8');
const providerText = fs.readFileSync(providerPath, 'utf8');
const kernelText = fs.readFileSync(kernelPath, 'utf8');
const provider = createDonorSemanticLineProvider({ recipe });

function gitBlobSha(text) {
  const bytes = Buffer.from(text);
  return crypto
    .createHash('sha1')
    .update(Buffer.from('blob ' + bytes.length + '\0'))
    .update(bytes)
    .digest('hex');
}

function expectedLine(slot, variant, key) {
  return recipe.triplets[slot][variant][key];
}

test('P01 exact NPC-CARD-SPEC-01 recipe donor blob is unchanged', () => {
  assert.equal(gitBlobSha(recipeText), 'e9b2aea0abc1bcb151fbc8cf5a08f7a6ae36689b');
});

test('P02 exact deterministic kernel blob is inherited unchanged from PR #305', () => {
  assert.equal(gitBlobSha(kernelText), 'bc3cf5194747bcb71b2b93bcfdec349c9db710f2');
});

test('P03 donor recipe becomes one shared four-entry semantic pool', () => {
  const pool = buildDonorSharedPool(recipe);
  assert.equal(pool.schema, 'kfb.semantic-triplet-pool/0.1-donor-fixture');
  assert.equal(pool.entries.length, 4);
  assert.deepEqual(pool.entries.map((entry) => entry.signatureOf[0]), [
    'frizzlebob',
    'frizzlebob',
    'goth-girl',
    'goth-girl',
  ]);
});

test('P04 actor A variant 0 survives adapter selection byte-for-text parity', () => {
  const turn = provider.turn('A', 0);
  assert.equal(turn.tripletId, 'npc-card-spec-01.a.0');
  assert.equal(turn.semantic.subject, expectedLine('A', 0, 'observation'));
  assert.equal(turn.semantic.connector, expectedLine('A', 0, 'interpretation'));
  assert.equal(turn.semantic.reframe, expectedLine('A', 0, 'counter'));
});

test('P05 actor A variant 1 survives adapter selection byte-for-text parity', () => {
  const turn = provider.turn('A', 1);
  assert.equal(turn.tripletId, 'npc-card-spec-01.a.1');
  assert.equal(turn.semantic.subject, expectedLine('A', 1, 'observation'));
  assert.equal(turn.semantic.connector, expectedLine('A', 1, 'interpretation'));
  assert.equal(turn.semantic.reframe, expectedLine('A', 1, 'counter'));
});

test('P06 actor B variants survive adapter selection byte-for-text parity', () => {
  for (const variant of [0, 1]) {
    const turn = provider.turn('B', variant);
    assert.equal(turn.tripletId, 'npc-card-spec-01.b.' + variant);
    assert.equal(turn.semantic.subject, expectedLine('B', variant, 'observation'));
    assert.equal(turn.semantic.connector, expectedLine('B', variant, 'interpretation'));
    assert.equal(turn.semantic.reframe, expectedLine('B', variant, 'implication'));
  }
});

test('P07 line provider maps Subject/Connector/Reframe onto existing beat keys', () => {
  for (const variant of [0, 1]) {
    assert.equal(provider.line({ slot: 'A', key: 'observation', variant }), expectedLine('A', variant, 'observation'));
    assert.equal(provider.line({ slot: 'A', key: 'interpretation', variant }), expectedLine('A', variant, 'interpretation'));
    assert.equal(provider.line({ slot: 'A', key: 'counter', variant }), expectedLine('A', variant, 'counter'));
    assert.equal(provider.line({ slot: 'B', key: 'observation', variant }), expectedLine('B', variant, 'observation'));
    assert.equal(provider.line({ slot: 'B', key: 'interpretation', variant }), expectedLine('B', variant, 'interpretation'));
    assert.equal(provider.line({ slot: 'B', key: 'implication', variant }), expectedLine('B', variant, 'implication'));
  }
});

test('P08 provider report exposes deterministic selected triplets without mutating recipe', () => {
  const before = JSON.stringify(recipe);
  const report = provider.report();
  assert.equal(report.poolEntries, 4);
  assert.deepEqual(report.selected.A.map((x) => x.tripletId), ['npc-card-spec-01.a.0', 'npc-card-spec-01.a.1']);
  assert.deepEqual(report.selected.B.map((x) => x.tripletId), ['npc-card-spec-01.b.0', 'npc-card-spec-01.b.1']);
  assert.equal(JSON.stringify(recipe), before);
});

test('P09 runner has optional lineProvider seam and exact recipe.triplets fallback', () => {
  assert.match(runnerText, /const lineProvider = typeof o\.lineProvider === 'function'/);
  assert.match(runnerText, /if \(lineProvider\)/);
  assert.match(runnerText, /const pool = recipe\.triplets\[slot\]/);
  assert.match(runnerText, /semanticSource/);
});

test('P10 existing source-isolation review lanes remain intact', () => {
  assert.match(runnerText, /const REVIEW = \['scene', 'actor-a', 'actor-b', 'mouths'\]/);
  assert.match(runnerText, /mode === 'actor-a'/);
  assert.match(runnerText, /mode === 'actor-b'/);
  assert.match(runnerText, /mode === 'mouths'/);
});

test('P11 host wires provider optionally and retains fallback', () => {
  assert.match(hostText, /createDonorSemanticLineProvider/);
  assert.match(hostText, /lineProvider: semanticProvider && semanticProvider\.line/);
  assert.match(hostText, /semanticSource: semanticProvider \? semanticProvider\.source : 'recipe\.triplets'/);
  assert.match(hostText, /semanticReport:/);
  assert.match(hostText, /recipe\.triplets fallback/);
});

test('P12 provider URL resolves from exact donor host back to the shared workflow source', () => {
  const base =
    'https://example.test/tools/KFB-ToolBox/_inbox/KFB%20Resident%20Card%20Speculation%20Scene/' +
    'npc-card-spec-01_2026-09-24/NPC%20Card%20Speculation%20Scene.dc.html';
  const resolved = new URL(
    '../../../../../skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/donor-semantic-provider.mjs',
    base
  );
  assert.equal(
    resolved.pathname,
    '/skills/chat/workflows/RESIDENT_CHAT_PRESENTATION_01_2026-10-01/donor-semantic-provider.mjs'
  );
});

test('P13 actor, face and Card source ownership in the donor recipe is untouched', () => {
  const A = recipe.actors.find((actor) => actor.slot === 'A');
  const B = recipe.actors.find((actor) => actor.slot === 'B');
  assert.equal(A.actorId, 'graft-driver');
  assert.equal(A.owners.mouth, 'graft.mouth · PetMouth v1 (set male)');
  assert.match(A.owners.eyes, /EyeRig v6/);
  assert.equal(B.actorId, 'gothgirl');
  assert.equal(B.owners.mouth, 'PetMouth v1 (set female)');
  assert.match(B.owners.eyes, /EyeRig v6/);
  assert.equal(recipe.card.name, 'The Doomsday Clock');
  assert.match(recipe.card.owner, /KayfabizarroViewer\.loadDeck\(\)\.getCardCanvas/);
});

test('P14 presentation provider adds no LLM, fetch, reward or persistence path', () => {
  assert.doesNotMatch(providerText, /\bfetch\s*\(/);
  assert.doesNotMatch(providerText, /https?:\/\//);
  assert.doesNotMatch(providerText, /\breward\b/i);
  assert.doesNotMatch(providerText, /\bPOP\b/);
  assert.doesNotMatch(providerText, /persist|localStorage|indexedDB/i);
});
