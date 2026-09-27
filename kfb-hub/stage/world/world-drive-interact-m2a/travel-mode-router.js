// TRAVEL-MODES-01 · atomic declarative Travel mode router.
//
// This module owns mode selection only. It never writes world position, camera state, support,
// vehicle physics or FX. A READY mode points to the existing owner adapters that do those jobs.
// SOURCE_REQUIRED slots are declarations only and cannot be entered.
export const TRAVEL_MODE_ROUTER_SCHEMA = 'kfb.travel-mode-router/1';
export const TRAVEL_MODE_READY = 'READY';
export const TRAVEL_MODE_SOURCE_REQUIRED = 'SOURCE_REQUIRED';

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

// V2 contract SSOT for the four Travel movement slots. Only Ground + Flight are runnable here.
// Drive and Water intentionally expose no writer until their own source-proven adapters exist.
export const TRAVEL_MODE_DEFINITIONS = deepFreeze([
  {
    id: 'GROUND',
    status: TRAVEL_MODE_READY,
    movementAdapter: { id: 'runtime-mode.js#GROUND', writer: 'wb0-ground-controller' },
    cameraAdapter: { id: 'runtime-mode.js#GROUND', preset: 'WB0_GROUND_ORBIT', writer: 'wb0-ground-controller' },
    supportType: 'RADIAL_SUPPORT_SURFACE',
    presentation: { actor: 'WB0 Ground Player', vehicle: null },
    allowedFx: [],
    enterPayload: {
      schema: 'kfb.travel-mode-enter/1',
      source: 'ground.resetFromFlight(g.carpet)',
      fields: ['worldPosition', 'heading', 'support'],
    },
    exitPayload: {
      schema: 'kfb.travel-mode-exit/1',
      source: 'ground.toFlightPose()',
      fields: ['qPosition', 'heading', 'altitude'],
    },
    persistencePayload: {
      schema: 'kfb.travel-mode-persistence/1',
      fields: ['locomotionMode'],
    },
  },
  {
    id: 'FLIGHT',
    status: TRAVEL_MODE_READY,
    movementAdapter: { id: 'runtime-mode.js#FLIGHT', writer: 'carpet.js' },
    cameraAdapter: { id: 'runtime-mode.js#FLIGHT', preset: 'TRAVEL_FLIGHT_RIG', writer: 'camera-rig.js' },
    supportType: 'FREE_FLIGHT_ALTITUDE',
    presentation: { actor: 'Travel Flight Avatar', vehicle: 'card-carrier.js' },
    allowedFx: ['trail', 'wake', 'rauch', 'leaves', 'shadow', 'speed-lines', 'flight-post'],
    enterPayload: {
      schema: 'kfb.travel-mode-enter/1',
      source: 'g.carpet.teleportTo(qPosition, heading, altitude, 0)',
      fields: ['qPosition', 'heading', 'altitude'],
    },
    exitPayload: {
      schema: 'kfb.travel-mode-exit/1',
      source: 'g.carpet.worldPos() + g.carpet.state',
      fields: ['worldPosition', 'heading', 'altitude'],
    },
    persistencePayload: {
      schema: 'kfb.travel-mode-persistence/1',
      fields: ['locomotionMode'],
    },
  },
  {
    id: 'DRIVE',
    status: TRAVEL_MODE_SOURCE_REQUIRED,
    movementAdapter: { id: 'SOURCE_REQUIRED', writer: null },
    cameraAdapter: { id: 'SOURCE_REQUIRED', preset: null, writer: null },
    supportType: 'SURFACE_CONTACT_REQUIRED',
    presentation: { actor: null, vehicle: 'SOURCE_REQUIRED' },
    allowedFx: [],
    enterPayload: { schema: 'kfb.travel-mode-enter/1', status: TRAVEL_MODE_SOURCE_REQUIRED },
    exitPayload: { schema: 'kfb.travel-mode-exit/1', status: TRAVEL_MODE_SOURCE_REQUIRED },
    persistencePayload: { schema: 'kfb.travel-mode-persistence/1', fields: ['locomotionMode'] },
  },
  {
    id: 'WATER',
    status: TRAVEL_MODE_SOURCE_REQUIRED,
    movementAdapter: { id: 'SOURCE_REQUIRED', writer: null },
    cameraAdapter: { id: 'SOURCE_REQUIRED', preset: null, writer: null },
    supportType: 'WATER_SUPPORT_REQUIRED',
    presentation: { actor: null, vehicle: 'SOURCE_REQUIRED' },
    allowedFx: [],
    enterPayload: { schema: 'kfb.travel-mode-enter/1', status: TRAVEL_MODE_SOURCE_REQUIRED },
    exitPayload: { schema: 'kfb.travel-mode-exit/1', status: TRAVEL_MODE_SOURCE_REQUIRED },
    persistencePayload: { schema: 'kfb.travel-mode-persistence/1', fields: ['locomotionMode'] },
  },
]);

const REQUIRED_FIELDS = [
  'movementAdapter',
  'cameraAdapter',
  'supportType',
  'presentation',
  'allowedFx',
  'enterPayload',
  'exitPayload',
  'persistencePayload',
];

function normalizeId(value) {
  return String(value || '').trim().toUpperCase();
}

function cloneData(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

function normalizeMode(raw) {
  if (!raw || typeof raw !== 'object') throw new TypeError('Travel mode declaration must be an object');
  const id = normalizeId(raw.id);
  if (!id) throw new Error('Travel mode declaration requires id');
  for (const field of REQUIRED_FIELDS) {
    if (!(field in raw)) throw new Error(`Travel mode ${id} missing ${field}`);
  }
  if (!raw.movementAdapter || typeof raw.movementAdapter !== 'object') {
    throw new Error(`Travel mode ${id} requires movementAdapter`);
  }
  if (!raw.cameraAdapter || typeof raw.cameraAdapter !== 'object') {
    throw new Error(`Travel mode ${id} requires cameraAdapter`);
  }
  if (!Array.isArray(raw.allowedFx)) throw new Error(`Travel mode ${id} allowedFx must be an array`);
  return Object.freeze({
    id,
    status: String(raw.status || TRAVEL_MODE_SOURCE_REQUIRED).toUpperCase(),
    movementAdapter: Object.freeze(cloneData(raw.movementAdapter)),
    cameraAdapter: Object.freeze(cloneData(raw.cameraAdapter)),
    supportType: String(raw.supportType || ''),
    presentation: Object.freeze(cloneData(raw.presentation)),
    allowedFx: Object.freeze([...raw.allowedFx]),
    enterPayload: Object.freeze(cloneData(raw.enterPayload)),
    exitPayload: Object.freeze(cloneData(raw.exitPayload)),
    persistencePayload: Object.freeze(cloneData(raw.persistencePayload)),
  });
}

function publicMode(mode) {
  return {
    id: mode.id,
    status: mode.status,
    movementAdapter: cloneData(mode.movementAdapter),
    cameraAdapter: cloneData(mode.cameraAdapter),
    supportType: mode.supportType,
    presentation: cloneData(mode.presentation),
    allowedFx: [...mode.allowedFx],
    enterPayload: cloneData(mode.enterPayload),
    exitPayload: cloneData(mode.exitPayload),
    persistencePayload: cloneData(mode.persistencePayload),
  };
}

export function createTravelModeRouter({
  modes = TRAVEL_MODE_DEFINITIONS,
  initialMode = 'GROUND',
  applyMode,
  onChange = null,
} = {}) {
  if (typeof applyMode !== 'function') throw new TypeError('Travel mode router requires applyMode');

  const registry = new Map();
  for (const raw of modes) {
    const mode = normalizeMode(raw);
    if (registry.has(mode.id)) throw new Error('Duplicate Travel mode: ' + mode.id);
    registry.set(mode.id, mode);
  }
  if (!registry.size) throw new Error('Travel mode router requires at least one mode');

  let activeMode = normalizeId(initialMode);
  if (!registry.has(activeMode)) throw new Error('Unknown initial Travel mode: ' + activeMode);
  if (registry.get(activeMode).status !== TRAVEL_MODE_READY) {
    throw new Error('Initial Travel mode is not READY: ' + activeMode);
  }

  let transitioning = false;
  let sequence = 0;
  let lastTransition = null;
  let lastAdapterEvidence = null;

  function modeOrThrow(id) {
    const key = normalizeId(id);
    const mode = registry.get(key);
    if (!mode) {
      const error = new Error('Unsupported Travel mode: ' + id);
      error.code = 'TRAVEL_MODE_UNKNOWN';
      throw error;
    }
    return mode;
  }

  function set(nextId, meta = null) {
    const target = modeOrThrow(nextId);
    if (target.status !== TRAVEL_MODE_READY) {
      const error = new Error(`Travel mode ${target.id} is ${target.status}; no movement adapter is active for this slot`);
      error.code = 'TRAVEL_MODE_UNAVAILABLE';
      error.mode = target.id;
      error.status = target.status;
      throw error;
    }
    if (transitioning) {
      const error = new Error('Travel mode transition already in progress');
      error.code = 'TRAVEL_MODE_TRANSITION_IN_PROGRESS';
      throw error;
    }
    if (target.id === activeMode) return activeMode;

    const from = registry.get(activeMode);
    const transaction = {
      schema: 'kfb.travel-mode-transition/1',
      id: ++sequence,
      from: from.id,
      to: target.id,
      exitPayload: cloneData(from.exitPayload),
      enterPayload: cloneData(target.enterPayload),
      persistencePayload: cloneData(target.persistencePayload),
      meta: cloneData(meta),
    };

    transitioning = true;
    try {
      // Exactly one adapter call performs the synchronous owner swap. The router itself has no
      // movement/camera update loop and never touches world position.
      const evidence = applyMode(target.id, transaction);
      activeMode = target.id;
      lastAdapterEvidence = cloneData(evidence);
      lastTransition = { ...transaction, status: 'COMMITTED' };
    } catch (error) {
      lastTransition = {
        ...transaction,
        status: 'FAILED',
        error: String(error && error.message ? error.message : error),
      };
      throw error;
    } finally {
      transitioning = false;
    }

    if (typeof onChange === 'function') {
      try { onChange(activeMode, report()); }
      catch (error) { console.warn('[travel mode router] onChange failed', error); }
    }
    return activeMode;
  }

  function contract() {
    return {
      schema: TRAVEL_MODE_ROUTER_SCHEMA,
      modes: [...registry.values()].map(publicMode),
    };
  }

  function report() {
    const current = registry.get(activeMode);
    return {
      schema: TRAVEL_MODE_ROUTER_SCHEMA,
      mode: activeMode,
      transitioning,
      activeMovementOwner: current.movementAdapter.writer,
      activeCameraOwner: current.cameraAdapter.writer,
      supportType: current.supportType,
      presentation: cloneData(current.presentation),
      allowedFx: [...current.allowedFx],
      lastTransition: cloneData(lastTransition),
      lastAdapterEvidence: cloneData(lastAdapterEvidence),
      modes: [...registry.values()].map((mode) => ({
        id: mode.id,
        status: mode.status,
        movementWriter: mode.movementAdapter.writer,
        cameraWriter: mode.cameraAdapter.writer,
      })),
    };
  }

  return {
    set,
    report,
    contract,
    get mode() { return activeMode; },
    get transitioning() { return transitioning; },
    getMode(id) { return publicMode(modeOrThrow(id)); },
  };
}

