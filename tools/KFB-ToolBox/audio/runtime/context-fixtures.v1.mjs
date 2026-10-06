const context = ({
  seq,
  worldId = 'GLOBAL_BASE',
  timeOfDay01 = 0.45,
  dayPhase = 'day',
  mode = 'IDLE',
  speed01 = 0,
  drive = false,
  dialogueActive = false,
  sourceType = 'NONE',
  sourceId = null,
  poi = null
}) => ({
  schema: 'kfb.audio.context.v1',
  seq,
  timestampMs: seq * 1000,
  world: { worldId, clusterId: 'fixture', biomeId: 'fixture', zoneId: 'fixture', deckId: null },
  environment: { timeOfDay01, dayPhase, weatherId: 'clear', weatherIntensity01: 0 },
  movement: { mode, speed01, drive, airborne: false, verticality01: 0 },
  social: { dialogueActive, sourceType, sourceId, intensity01: dialogueActive ? 0.8 : 0 },
  activity: { action01: 0, race01: 0, threat01: 0, work01: 0, crowd01: 0 },
  poi,
  tags: ['synthetic-audio-fixture']
});

const event = ({ seq, type, sourceId = null, intensity01 = 0.5 }) => ({
  schema: 'kfb.audio.event.v1',
  seq,
  type,
  sourceId,
  intensity01,
  timestampMs: seq * 1000,
  meta: { fixture: true }
});

export const CONTEXT_FIXTURES = Object.freeze([
  {
    name: 'DAY_ROAM',
    steps: [{ method: 'setContext', value: context({ seq: 1, mode: 'RUN', speed01: 0.58 }) }]
  },
  {
    name: 'DAY_STAY',
    steps: [{ method: 'setContext', value: context({ seq: 1, mode: 'IDLE', speed01: 0 }) }]
  },
  {
    name: 'DUSK_TO_NIGHT',
    steps: [
      { method: 'setContext', value: context({ seq: 1, timeOfDay01: 0.66, dayPhase: 'day' }) },
      { method: 'setContext', value: context({ seq: 2, timeOfDay01: 0.82, dayPhase: 'night' }) }
    ]
  },
  {
    name: 'POI_DISCOVERY',
    steps: [
      { method: 'setContext', value: context({ seq: 1, poi: { id: 'poi.fixture', type: 'SIGNATURE', proximity01: 0.92 } }) },
      { method: 'emit', value: event({ seq: 1, type: 'POI_DISCOVERED', sourceId: 'poi.fixture', intensity01: 0.85 }) }
    ]
  },
  {
    name: 'RESIDENT_DIALOGUE',
    steps: [
      { method: 'setContext', value: context({ seq: 1, dialogueActive: true, sourceType: 'RESIDENT', sourceId: 'resident.fixture' }) },
      { method: 'emit', value: event({ seq: 1, type: 'DIALOGUE_START', sourceId: 'resident.fixture', intensity01: 0.72 }) }
    ]
  },
  {
    name: 'BILLBOARD_DIALOGUE',
    steps: [
      { method: 'setContext', value: context({ seq: 1, dialogueActive: true, sourceType: 'BILLBOARD', sourceId: 'billboard.fixture' }) },
      { method: 'emit', value: event({ seq: 1, type: 'DIALOGUE_START', sourceId: 'billboard.fixture', intensity01: 0.72 }) }
    ]
  },
  {
    name: 'DRIVE_TO_STAY',
    steps: [
      { method: 'setContext', value: context({ seq: 1, mode: 'DRIVE', speed01: 0.78, drive: true }) },
      { method: 'setContext', value: context({ seq: 2, mode: 'IDLE', speed01: 0, drive: false }) }
    ]
  },
  {
    name: 'MISSING_FAMILY_FALLBACK',
    steps: [{ method: 'setContext', value: context({ seq: 1, worldId: 'fixture.missing-family' }) }]
  }
]);

export async function runContextFixture(runtime, fixture) {
  let evidence = null;
  for (const step of fixture.steps) {
    if (step.method === 'setContext') evidence = await runtime.setContext(step.value);
    else if (step.method === 'emit') evidence = await runtime.emit(step.value);
    else throw new Error('Unsupported fixture method: ' + step.method);
  }
  return evidence;
}
