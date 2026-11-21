import fs from 'node:fs';
import assert from 'node:assert/strict';
import { resolveEventFamily, resolveFamily, resolveFunction, validateContext, validateEvent } from './music-resolver.mjs';

const registry = JSON.parse(fs.readFileSync(new URL('./runtime-registry.v1.json', import.meta.url), 'utf8'));
const runtimeSource = fs.readFileSync(new URL('./kfb-audio-runtime.mjs', import.meta.url), 'utf8');
const resolverSource = fs.readFileSync(new URL('./music-resolver.mjs', import.meta.url), 'utf8');
const fixtureSource = fs.readFileSync(new URL('./context-fixtures.v1.mjs', import.meta.url), 'utf8');
const checks = [];
const check = (name, test) => {
  try { test(); checks.push([name, true]); }
  catch (error) { checks.push([name, false, error.message]); }
};
const base = {
  schema: 'kfb.audio.context.v1', seq: 1, timestampMs: 1,
  world: { worldId: 'GLOBAL_BASE' },
  environment: { timeOfDay01: 0.45, dayPhase: 'day' },
  movement: { mode: 'IDLE', speed01: 0, drive: false, airborne: false },
  social: { dialogueActive: false, sourceType: 'NONE', intensity01: 0 },
  activity: { action01: 0, race01: 0, threat01: 0, work01: 0, crowd01: 0 }
};
const event = { schema: 'kfb.audio.event.v1', seq: 1, type: 'POI_DISCOVERED', timestampMs: 1 };

check('registry schema', () => assert.equal(registry.schema, 'kfb.audio.runtime-registry.v1'));
check('asset source pin', () => assert.equal(registry.assetSource.pin, '276728f3f82f729cd1656b61e81d278856d736bb'));
check('G remains Site verified', () => assert.equal(registry.families.G.status, 'SITE_RUNTIME_VERIFIED'));
check('D remains Site verified', () => assert.equal(registry.families.D.status, 'SITE_RUNTIME_VERIFIED'));
for (const id of ['C', 'M', 'N', 'O']) check(id + ' runtime verified', () => assert.equal(registry.families[id].status, 'RUNTIME_VERIFIED'));
check('C actual BPM', () => assert.equal(registry.families.C.bpm, 81));
check('M actual BPM', () => assert.equal(registry.families.M.bpm, 112));
check('N actual BPM', () => assert.equal(registry.families.N.bpm, 70));
check('O actual BPM', () => assert.equal(registry.families.O.bpm, 82));
check('C stem count', () => assert.equal(registry.families.C.stems.length, 10));
check('M stem count', () => assert.equal(registry.families.M.stems.length, 10));
check('N stem count', () => assert.equal(registry.families.N.stems.length, 11));
check('O stem count', () => assert.equal(registry.families.O.stems.length, 9));
for (const id of ['C', 'M', 'N']) check(id + ' ambiguous layers muted', () => {
  assert(registry.families[id].stems.filter(stem => String(stem.role).startsWith('UNCLASSIFIED')).every(stem => stem.default === 0));
});
for (const id of ['C', 'M', 'N', 'O']) check(id + ' has master fallback', () => assert.match(registry.families[id].master, /\.mp3$/));
for (const id of ['C', 'M', 'N', 'O']) check(id + ' uses shared bar loop', () => assert.equal(registry.families[id].loopPolicy, 'SHARED_BAR_FLOOR'));
check('promotion is not human acceptance', () => assert.equal(registry.runtimePromotion.humanAccepted, false));
check('no DOM document', () => assert(!/\bdocument\b/.test(runtimeSource + resolverSource)));
check('no DOM window', () => assert(!/\bwindow\b/.test(runtimeSource + resolverSource)));
check('no AudioContext constructor', () => assert(!/new\s+(?:AudioContext|webkitAudioContext)/.test(runtimeSource + resolverSource)));
check('no WB2 import', () => assert(!/from\s+['"][^'"]*(?:wb2|worldbuilder)/i.test(runtimeSource + resolverSource)));
check('no Site UI import', () => assert(!/from\s+['"][^'"]*(?:audio-site|site-ui)/i.test(runtimeSource + resolverSource)));
check('context validation', () => assert.equal(validateContext(base), base));
check('event validation', () => assert.equal(validateEvent(event), event));
check('staying function', () => assert.equal(resolveFunction(base), 'STAYING'));
check('movement maps G', () => assert.equal(resolveFamily({ context: { ...base, movement: { ...base.movement, speed01: 0.5 } }, registry }).familyId, 'G'));
check('day staying maps M', () => assert.equal(resolveFamily({ context: base, registry }).familyId, 'M'));
check('day staying falls back to C when M unavailable', () => {
  const fallbackRegistry = structuredClone(registry);
  fallbackRegistry.families.M.status = 'SOURCE_PRESENT_RUNTIME_UNVERIFIED';
  assert.equal(resolveFamily({ context: base, registry: fallbackRegistry }).familyId, 'C');
});
check('night maps N', () => assert.equal(resolveFamily({ context: { ...base, environment: { timeOfDay01: 0.84, dayPhase: 'night' } }, registry }).familyId, 'N'));
check('talking maps D', () => assert.equal(resolveFamily({ context: { ...base, social: { ...base.social, dialogueActive: true } }, registry }).familyId, 'D'));
check('POI event maps O', () => assert.equal(resolveEventFamily({ type: 'POI_DISCOVERED', context: base, registry }).familyId, 'O'));
check('fixture input has no track IDs', () => assert(!/trackIds?/i.test(fixtureSource)));
check('fixture input has no BPM', () => assert(!/\bbpm\b/i.test(fixtureSource)));
check('fixture input has no stem gains', () => assert(!/\bstems?\b|\bgains?\b/i.test(fixtureSource)));
check('fixtures call only public context/event methods', () => {
  const calls = [...fixtureSource.matchAll(/runtime\.([A-Za-z0-9_]+)\(/g)].map(match => match[1]);
  assert.deepEqual([...new Set(calls)].sort(), ['emit', 'setContext']);
});

const failed = checks.filter(check => !check[1]);
console.log(JSON.stringify({ pass: checks.length - failed.length, total: checks.length, checks }, null, 2));
if (failed.length) process.exit(1);
