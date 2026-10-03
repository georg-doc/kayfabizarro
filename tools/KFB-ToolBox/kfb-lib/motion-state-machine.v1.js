/* KFB · motion-state-machine.v1
 *
 * Central 3D animation-state owner for KayKit/KFB actors.
 * Owner: KFB ToolBox / Animation-Motion authoring.
 *
 * This module does NOT move an actor, own physics, camera, gameplay, damage or input.
 * Consumers supply measured motion facts (actual velocity, direction, grounded state, intent).
 * This module resolves semantic presentation state, playback rate and transition metadata from
 * source-backed MotionProfile data.
 *
 * No clip name or speed threshold is invented here. Missing profile evidence stays unresolved.
 */

export const SCHEMA = 'kfb.motion-state-machine/1';

export const SEMANTIC_STATES = Object.freeze([
  'idle',
  'start',
  'walk',
  'walk.fast',
  'run',
  'sprint',
  'stop',
  'backward',
  'strafe.left',
  'strafe.right',
  'turn',
  'jump.start',
  'jump.air',
  'jump.land',
]);

const GAIT_STATES = new Set(['walk','walk.fast','run','sprint','backward','strafe.left','strafe.right']);

const finitePositive = (v) => Number.isFinite(v) && v > 0;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function speedWindow(profile) {
  if (!profile || !finitePositive(profile.referenceSpeed)) return null;
  const range = Array.isArray(profile.playbackRange) ? profile.playbackRange : null;
  if (!range || !finitePositive(range[0]) || !finitePositive(range[1]) || range[1] < range[0]) return null;
  return [profile.referenceSpeed * range[0], profile.referenceSpeed * range[1]];
}

/* A hysteresis band is derived ONLY from overlap in two measured/approved speed windows.
 * If there is no overlap, we expose a single midpoint and flag the gap for visual/product review.
 */
export function deriveHandoff(lowerProfile, upperProfile) {
  const a = speedWindow(lowerProfile), b = speedWindow(upperProfile);
  if (!a || !b) return {
    status: 'PENDING_MEASUREMENT',
    lowerWindow: a,
    upperWindow: b,
    downExit: null,
    upEnter: null,
    gap: null,
  };

  const overlapLo = Math.max(a[0], b[0]);
  const overlapHi = Math.min(a[1], b[1]);
  if (overlapLo <= overlapHi) {
    return {
      status: 'MEASURED_OVERLAP_HYSTERESIS',
      lowerWindow: a,
      upperWindow: b,
      downExit: overlapLo,
      upEnter: overlapHi,
      gap: 0,
    };
  }

  const gap = b[0] > a[1] ? b[0] - a[1] : a[0] - b[1];
  const midpoint = b[0] > a[1] ? (a[1] + b[0]) / 2 : (b[1] + a[0]) / 2;
  return {
    status: 'MEASURED_GAP_NO_SAFE_OVERLAP',
    lowerWindow: a,
    upperWindow: b,
    downExit: midpoint,
    upEnter: midpoint,
    gap,
  };
}

export function compileForwardBands(profile) {
  const order = (profile?.forwardOrder || ['walk','walk.fast','run','sprint'])
    .filter((id) => profile?.states?.[id]?.status !== 'UNMAPPED');
  const transitions = {};
  for (let i = 0; i < order.length - 1; i++) {
    const a = order[i], b = order[i + 1];
    transitions[a + '→' + b] = deriveHandoff(profile.states[a], profile.states[b]);
  }
  return { order, transitions };
}

function available(profile, state) {
  const p = profile?.states?.[state];
  return !!p && p.status !== 'UNMAPPED' && p.status !== 'MISSING' && p.status !== 'PENDING_SOURCE';
}

function profileFor(profile, state) {
  return available(profile, state) ? profile.states[state] : null;
}

function directionState(profile, facts) {
  const f = Number(facts.localForwardSpeed || 0);
  const s = Number(facts.localSideSpeed || 0);
  if (f < 0 && Math.abs(f) >= Math.abs(s) && available(profile, 'backward')) return 'backward';
  if (Math.abs(s) > Math.abs(f)) {
    if (s > 0 && available(profile, 'strafe.right')) return 'strafe.right';
    if (s < 0 && available(profile, 'strafe.left')) return 'strafe.left';
  }
  return null;
}

function highestAllowedForward(profile, sprintIntent) {
  const base = (profile.forwardOrder || ['walk','walk.fast','run','sprint'])
    .filter((s) => available(profile, s));
  if (!sprintIntent) return base.filter((s) => s !== 'sprint');
  return base;
}

function selectForward(profile, facts, previous) {
  const speed = Math.max(0, Number(facts.actualSpeed || 0));
  if (speed <= 1e-8) return previous && previous !== 'idle' ? 'stop' : 'idle';

  const candidates = highestAllowedForward(profile, !!facts.sprintIntent);
  if (!candidates.length) return 'start';

  const first = profileFor(profile, candidates[0]);
  const firstWindow = speedWindow(first);
  if (firstWindow && speed < firstWindow[0]) return 'start';

  const bands = compileForwardBands(profile);
  let current = candidates.includes(previous) ? previous : candidates[0];

  // Walk up through valid measured handoffs.
  for (let i = 0; i < candidates.length - 1; i++) {
    const low = candidates[i], high = candidates[i + 1];
    const h = bands.transitions[low + '→' + high];
    if (!h || !finitePositive(h.upEnter)) continue;
    if ((current === low || candidates.indexOf(current) <= i) && speed >= h.upEnter) current = high;
  }

  // Walk down using the lower edge of the measured overlap when available.
  for (let i = candidates.length - 2; i >= 0; i--) {
    const low = candidates[i], high = candidates[i + 1];
    const h = bands.transitions[low + '→' + high];
    if (!h || !finitePositive(h.downExit)) continue;
    if (current === high && speed <= h.downExit) current = low;
  }

  return current;
}

function playbackFor(profile, state, speed) {
  const p = profileFor(profile, state);
  if (!p || !finitePositive(p.referenceSpeed)) return { rate: 1, status: 'NO_REFERENCE_SPEED' };
  const range = Array.isArray(p.playbackRange) ? p.playbackRange : null;
  const raw = speed / p.referenceSpeed;
  if (!range) return { rate: raw, status: 'UNCLAMPED_PENDING_APPROVED_RANGE' };
  return {
    rate: clamp(raw, range[0], range[1]),
    rawRate: raw,
    status: raw < range[0] || raw > range[1] ? 'CLAMPED_OUTSIDE_APPROVED_RANGE' : 'WITHIN_APPROVED_RANGE',
  };
}

function transitionMeta(profile, from, to) {
  if (!from || from === to) return null;
  const key = from + '→' + to;
  const explicit = profile?.transitions?.[key] || profile?.transitions?.['any→' + to] || null;
  const gait = GAIT_STATES.has(from) && GAIT_STATES.has(to);
  return {
    from,
    to,
    phaseSync: gait ? explicit?.syncPhase !== false : !!explicit?.syncPhase,
    preferredFoot: profile?.preferredPhaseFoot || 'left',
    crossfadeSeconds: Number.isFinite(explicit?.fade) ? explicit.fade : null,
    warp: gait ? profile?.warpDuringGaitCrossfade !== false : false,
    evidence: explicit ? 'PROFILE' : (gait ? 'GAIT_DEFAULT_PHASE_SYNC' : 'NO_EXPLICIT_TRANSITION_PROFILE'),
  };
}

export function createMotionStateMachine(profile) {
  if (!profile || !profile.states) throw new Error('motion-state-machine: profile.states required');
  let current = 'idle';
  let previousGrounded = true;

  function update(facts = {}) {
    const grounded = facts.grounded !== false;
    const justLanded = previousGrounded === false && grounded;
    let next;

    if (justLanded && available(profile, 'jump.land')) {
      next = 'jump.land';
    } else if (!grounded) {
      const phase = facts.jumpPhase || (Number(facts.verticalVelocity || 0) > 0 ? 'start' : 'air');
      next = phase === 'start' && available(profile, 'jump.start') ? 'jump.start'
        : available(profile, 'jump.air') ? 'jump.air'
        : current;
    } else {
      const directed = directionState(profile, facts);
      next = directed || selectForward(profile, facts, current);
      if (next === 'stop' && !available(profile, 'stop')) {
        // Stop is a semantic transition even when there is no dedicated stop clip.
        next = 'stop';
      }
      if (next === 'start' && !available(profile, 'start')) {
        // Start is a semantic transition even when there is no dedicated start clip.
        next = 'start';
      }
    }

    const speed = Math.max(0, Number(facts.actualSpeed || 0));
    const presentationState = (next === 'start')
      ? (available(profile, 'walk') ? 'walk' : current)
      : (next === 'stop')
        ? (available(profile, 'walk') ? 'walk' : 'idle')
        : next;
    const p = profileFor(profile, presentationState);
    const playback = GAIT_STATES.has(presentationState) ? playbackFor(profile, presentationState, speed) : { rate: 1, status: 'NON_GAIT' };
    const transition = transitionMeta(profile, current, next);

    const result = {
      schema: SCHEMA,
      semanticState: next,
      presentationState,
      role: p?.role || presentationState,
      clip: p?.clip || null,
      clipStatus: p?.status || (next === 'start' || next === 'stop' ? 'TRANSITION_ONLY' : 'UNMAPPED'),
      playback,
      transition,
      facts: {
        actualSpeed: speed,
        localForwardSpeed: Number(facts.localForwardSpeed || 0),
        localSideSpeed: Number(facts.localSideSpeed || 0),
        grounded,
        sprintIntent: !!facts.sprintIntent,
      },
    };

    current = next;
    previousGrounded = grounded;
    return result;
  }

  return {
    schema: SCHEMA,
    update,
    get state() { return current; },
    reset(state = 'idle') { current = state; previousGrounded = true; },
    profile,
  };
}

export function profileHealth(profile) {
  const missing = SEMANTIC_STATES.filter((s) => !available(profile, s) && !['start','stop','turn'].includes(s));
  const pendingMeasurements = Object.entries(profile.states || {})
    .filter(([,p]) => p && /PENDING|UNMEASURED|HUMAN_OPEN/.test(String(p.measurementStatus || p.status || '')))
    .map(([s]) => s);
  const bands = compileForwardBands(profile);
  return {
    schema: SCHEMA + '#health',
    missing,
    pendingMeasurements,
    forwardBands: bands,
    readyForPrototype: missing.length === 0 && pendingMeasurements.length === 0,
  };
}
