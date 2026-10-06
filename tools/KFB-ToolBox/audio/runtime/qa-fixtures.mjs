import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createKfbAudioRuntime } from './kfb-audio-runtime.mjs';
import { CONTEXT_FIXTURES, runContextFixture } from './context-fixtures.v1.mjs';

class FakeParam {
  constructor(value = 0) { this.value = value; this.events = []; }
  cancelScheduledValues(time) { this.events.push(['cancel', time]); }
  setValueAtTime(value, time) { this.value = value; this.events.push(['set', value, time]); }
  setTargetAtTime(value, time, constant) { this.value = value; this.events.push(['target', value, time, constant]); }
  linearRampToValueAtTime(value, time) { this.value = value; this.events.push(['ramp', value, time]); }
}

class FakeNode {
  constructor() { this.connections = []; }
  connect(node) { this.connections.push(node); return node; }
  disconnect() { this.connections = []; }
}

class FakeGain extends FakeNode { constructor() { super(); this.gain = new FakeParam(1); } }
class FakeFilter extends FakeNode {
  constructor() {
    super(); this.type = 'peaking'; this.frequency = new FakeParam(); this.Q = new FakeParam(); this.gain = new FakeParam();
  }
}
class FakeSource extends FakeNode {
  constructor() { super(); this.buffer = null; this.loop = false; this.loopStart = 0; this.loopEnd = 0; this.onended = null; }
  start(time) { this.startTime = time; }
  stop(time) { this.stopTime = time; queueMicrotask(() => this.onended?.()); }
}
class FakeAudioContext {
  constructor() { this.currentTime = 10; this.state = 'running'; this.destination = new FakeNode(); this.createdSources = []; }
  createGain() { return new FakeGain(); }
  createBiquadFilter() { return new FakeFilter(); }
  createBufferSource() { const source = new FakeSource(); this.createdSources.push(source); return source; }
  async decodeAudioData() { return { duration: 180, sampleRate: 48000, numberOfChannels: 2 }; }
  async suspend() { this.state = 'suspended'; }
  async resume() { this.state = 'running'; }
}

const registry = JSON.parse(await readFile(new URL('./runtime-registry.v1.json', import.meta.url), 'utf8'));
for (const key of ['C', 'M', 'N', 'O']) registry.families[key].status = 'RUNTIME_VERIFIED';
registry.profiles['fixture.missing-family'] = { functionMappings: { STAYING: 'DOES_NOT_EXIST' }, unavailablePolicy: 'KEEP_CURRENT_OR_SILENCE' };

const expectations = {
  DAY_ROAM: { familyId: 'G', function: 'MOVEMENT', speechFocus: false },
  DAY_STAY: { familyId: 'M', function: 'STAYING', speechFocus: false },
  DUSK_TO_NIGHT: { familyId: 'N', function: 'STAYING', speechFocus: false },
  POI_DISCOVERY: { familyId: 'O', function: 'POI_DISCOVERY', speechFocus: false },
  RESIDENT_DIALOGUE: { familyId: 'D', function: 'TALKING', speechFocus: true },
  BILLBOARD_DIALOGUE: { familyId: 'D', function: 'TALKING', speechFocus: true },
  DRIVE_TO_STAY: { familyId: 'M', function: 'STAYING', speechFocus: false },
  MISSING_FAMILY_FALLBACK: { familyId: null, function: 'STAYING', speechFocus: false }
};

const forbiddenFixtureKeys = new Set(['trackId', 'trackIds', 'bpm', 'stem', 'stems', 'gain', 'gains']);
const inspectKeys = value => {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assert(!forbiddenFixtureKeys.has(key), `fixture contains forbidden key ${key}`);
    inspectKeys(child);
  }
};

const results = [];
for (const fixture of CONTEXT_FIXTURES) {
  inspectKeys(fixture);
  const audioContext = new FakeAudioContext();
  const runtime = createKfbAudioRuntime({
    audioContext,
    destination: audioContext.destination,
    registry,
    assetBaseUrl: path => path,
    fetchImpl: async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(16) })
  });
  const evidence = await runContextFixture(runtime, fixture);
  const expected = expectations[fixture.name];
  assert(expected, `missing expectation for ${fixture.name}`);
  assert.equal(evidence.familyId, expected.familyId, `${fixture.name} family`);
  assert.equal(evidence.resolvedFunction, expected.function, `${fixture.name} function`);
  assert.equal(evidence.speechFocus, expected.speechFocus, `${fixture.name} speech focus`);
  assert.equal(evidence.moduleCreatedAudioContexts, 0, `${fixture.name} AudioContext ownership`);
  assert.equal(evidence.errors.length, 0, `${fixture.name} errors`);
  results.push({
    name: fixture.name,
    familyId: evidence.familyId,
    resolvedFunction: evidence.resolvedFunction,
    speechFocus: evidence.speechFocus,
    moduleCreatedAudioContexts: evidence.moduleCreatedAudioContexts,
    playbackMode: evidence.playbackMode,
    transitions: evidence.log.filter(item => item.type === 'FAMILY_START').map(item => item.id)
  });
  await runtime.dispose();
}

console.log(JSON.stringify({ pass: results.length, total: CONTEXT_FIXTURES.length, results }, null, 2));
