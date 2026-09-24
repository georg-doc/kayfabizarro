/* KFB Resident Atlas · NPC-LIFE-01 semantic encounter bus
   Host owns encounter legality, movement progress, busy state and relationship context.
   Presentation/content/reward consumers only react to semantic beats. */

export const ENCOUNTER_BEATS = Object.freeze([
  'approach', 'greet', 'offer', 'react', 'accept', 'decline', 'leave'
]);

const EMITTED = new Set(ENCOUNTER_BEATS);
const LINEAR = Object.freeze(['approach', 'greet', 'offer', 'react']);

export class EncounterBeatBus {
  #listeners = new Set();

  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function');
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  emit(event) {
    if (!event || !EMITTED.has(event.beat)) throw new Error('invalid encounter beat');
    const frozen = Object.freeze({ ...event });
    for (const listener of [...this.#listeners]) listener(frozen);
    return frozen;
  }
}

export function defaultEncounterLegality({ actorId, targetId, combatLocked = false, disabled = false } = {}) {
  return Boolean(actorId && targetId && actorId !== targetId && !combatLocked && !disabled);
}

export function createEncounterHost({
  bus,
  legality = defaultEncounterLegality,
  offerProvider = () => null,
  movement = () => {},
  durations = {}
} = {}) {
  if (!(bus instanceof EncounterBeatBus)) throw new TypeError('EncounterBeatBus required');

  const seconds = Object.freeze({
    approach: 1.35,
    greet: 0.85,
    offer: 0.95,
    react: 0.9,
    accept: 0.65,
    decline: 0.65,
    leave: 1.35,
    ...durations
  });

  const busy = new Set();
  let current = null;
  let serial = 0;

  const snapshot = () => current ? {
    encounterId: current.id,
    beat: current.beat,
    actorId: current.actorId,
    targetId: current.targetId,
    targetKind: current.targetKind,
    relationship: current.relationship,
    offer: current.offer,
    decision: current.decision,
    elapsed: current.elapsed,
    done: false
  } : null;

  function eventFor(beat) {
    let speakerId = current.actorId;
    if (beat === 'react') speakerId = current.targetKind === 'resident' ? current.targetId : current.actorId;
    if (beat === 'accept' || beat === 'decline') speakerId = current.targetKind === 'resident' ? current.targetId : null;
    return {
      type: 'kfb.encounter.beat',
      version: 1,
      encounterId: current.id,
      beat,
      actorId: current.actorId,
      targetId: current.targetId,
      targetKind: current.targetKind,
      speakerId,
      relationship: current.relationship,
      offer: current.offer,
      decision: current.decision,
      context: current.context
    };
  }

  function enter(beat) {
    current.beat = beat;
    current.elapsed = 0;
    if (beat === 'offer') current.offer = offerProvider({ ...snapshot(), context: current.context });
    bus.emit(eventFor(beat));
  }

  function finish() {
    const done = { ...snapshot(), beat: 'leave', done: true };
    busy.delete(current.actorId);
    if (current.targetKind === 'resident') busy.delete(current.targetId);
    current = null;
    return done;
  }

  function start({ actorId, targetId, targetKind = 'resident', relationship = 'neutral', context = {}, decision = null } = {}) {
    if (current) return { ok: false, reason: 'host-busy' };
    const legal = legality({ actorId, targetId, targetKind, relationship, context, combatLocked: !!context.combatLocked, disabled: !!context.disabled });
    if (!legal) return { ok: false, reason: 'illegal' };
    if (busy.has(actorId) || (targetKind === 'resident' && busy.has(targetId))) return { ok: false, reason: 'participant-busy' };
    if (decision != null && decision !== 'accept' && decision !== 'decline') return { ok: false, reason: 'bad-decision' };

    const id = `enc-${++serial}`;
    current = { id, actorId, targetId, targetKind, relationship, context, decision, offer: null, beat: 'approach', elapsed: 0 };
    busy.add(actorId);
    if (targetKind === 'resident') busy.add(targetId);
    enter('approach');
    return { ok: true, encounterId: id };
  }

  function choose(decision) {
    if (!current) return false;
    if (decision !== 'accept' && decision !== 'decline') return false;
    current.decision = decision;
    return true;
  }

  function update(dt) {
    if (!current) return null;
    const step = Math.max(0, Number(dt) || 0);
    current.elapsed += step;
    const span = Math.max(0.0001, seconds[current.beat] || 0.5);
    movement({ ...snapshot(), progress: Math.min(1, current.elapsed / span), context: current.context });
    if (current.elapsed < span) return snapshot();

    if (LINEAR.includes(current.beat)) {
      const idx = LINEAR.indexOf(current.beat);
      if (idx < LINEAR.length - 1) enter(LINEAR[idx + 1]);
      else enter(current.decision || 'decline');
      return snapshot();
    }
    if (current.beat === 'accept' || current.beat === 'decline') {
      enter('leave');
      return snapshot();
    }
    if (current.beat === 'leave') return finish();
    throw new Error(`unknown encounter host state: ${current.beat}`);
  }

  return {
    start,
    update,
    choose,
    get current() { return snapshot(); },
    get busyIds() { return [...busy]; },
    get isActive() { return !!current; }
  };
}
