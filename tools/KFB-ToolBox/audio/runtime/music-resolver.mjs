const clamp01 = value => Math.max(0, Math.min(1, Number(value) || 0));
const VERIFIED_STATUSES = new Set(['SITE_RUNTIME_VERIFIED', 'RUNTIME_VERIFIED']);

export function isRuntimeVerified(family) {
  return Boolean(family && VERIFIED_STATUSES.has(family.status));
}

export function validateContext(snapshot) {
  if (!snapshot || snapshot.schema !== 'kfb.audio.context.v1') throw new Error('Expected kfb.audio.context.v1');
  if (!Number.isInteger(snapshot.seq) || snapshot.seq < 0) throw new Error('Invalid context seq');
  if (!(Number(snapshot.timestampMs) >= 0)) throw new Error('Invalid context timestampMs');
  if (!snapshot.world?.worldId) throw new Error('world.worldId required');
  if (!snapshot.movement?.mode) throw new Error('movement.mode required');
  if (typeof snapshot.social?.dialogueActive !== 'boolean') throw new Error('social.dialogueActive required');
  return snapshot;
}

export function validateEvent(event) {
  if (!event || event.schema !== 'kfb.audio.event.v1') throw new Error('Expected kfb.audio.event.v1');
  if (!Number.isInteger(event.seq) || event.seq < 0) throw new Error('Invalid event seq');
  if (!(Number(event.timestampMs) >= 0)) throw new Error('Invalid event timestampMs');
  if (!event.type) throw new Error('event.type required');
  return event;
}

export function resolveFunction(snapshot, previous = 'STAYING') {
  validateContext(snapshot);
  const social = Boolean(snapshot.social?.dialogueActive) || clamp01(snapshot.social?.intensity01) > 0.55;
  const race = clamp01(snapshot.activity?.race01);
  const action = clamp01(snapshot.activity?.action01);
  const work = clamp01(snapshot.activity?.work01);
  const speed = clamp01(snapshot.movement?.speed01);
  if (social) return 'TALKING';
  if (work > 0.62) return 'WORK';
  if (race > 0.64) return 'RACE';
  if (action > 0.70) return 'ACTION';
  if (speed > 0.24 || snapshot.movement?.drive) return 'MOVEMENT';
  if (previous === 'MOVEMENT' && speed > 0.12) return 'MOVEMENT';
  return 'STAYING';
}

function profileFor(context, registry) {
  return registry.profiles?.[context?.world?.worldId] || registry.profiles?.GLOBAL_BASE || {};
}

function firstVerified(ids, registry) {
  for (const id of ids.filter(Boolean)) {
    if (isRuntimeVerified(registry.families?.[id])) return id;
  }
  return null;
}

function isNightContext(context) {
  const phase = String(context.environment?.dayPhase || '').toLowerCase();
  const time = clamp01(context.environment?.timeOfDay01);
  return ['dusk', 'evening', 'night'].includes(phase) || time >= 0.72 || time <= 0.12;
}

export function resolveFamily({ context, registry, previousFunction = 'STAYING', previousFamily = null }) {
  const fn = resolveFunction(context, previousFunction);
  const profile = profileFor(context, registry);
  const nightId = fn === 'STAYING' && isNightContext(context) ? profile.dayPhaseMappings?.NIGHT : null;
  const mappedId = nightId || profile.functionMappings?.[fn] || null;
  const fallbackIds = profile.fallbackMappings?.[fn] || [];
  const familyId = firstVerified([mappedId, ...fallbackIds], registry);
  if (familyId) {
    const reason = familyId === mappedId ? (nightId ? 'DAY_PHASE_MAPPING' : 'PROFILE_MAPPING') : 'PROFILE_FALLBACK';
    return { function: fn, familyId, reason };
  }
  const retained = isRuntimeVerified(registry.families?.[previousFamily]) ? previousFamily : null;
  return { function: fn, familyId: retained, reason: mappedId ? 'FAMILY_NOT_RUNTIME_VERIFIED' : 'NO_MAPPING' };
}

export function resolveEventFamily({ type, context, registry, previousFamily = null }) {
  const profile = profileFor(context || { world: { worldId: 'GLOBAL_BASE' } }, registry);
  const mappedId = profile.eventMappings?.[type] || (type === 'DIALOGUE_START' ? profile.functionMappings?.TALKING : null);
  const familyId = firstVerified([mappedId], registry);
  if (familyId) return { familyId, reason: 'EVENT_MAPPING' };
  const retained = isRuntimeVerified(registry.families?.[previousFamily]) ? previousFamily : null;
  return { familyId: retained, reason: mappedId ? 'EVENT_FAMILY_NOT_RUNTIME_VERIFIED' : 'NO_EVENT_MAPPING' };
}
