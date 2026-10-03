/* KFB · locomotion-ladder-profile.v1
 *
 * Adapter from measured Blender-lane locomotion ladder evidence to the central
 * Animation/Motion presentation profile. This is not an input or movement controller.
 * Technical candidate selection stays distinct from Georg's visual acceptance.
 */

export const SCHEMA = 'kfb.locomotion-ladder-profile/1';

const FORWARD_RUNG_STATE = Object.freeze({
  walk: 'walk',
  jog: 'jog',
  runEasy: 'run.easy',
  run: 'run',
  sprint: 'sprint',
});
const FORWARD_ORDER = Object.freeze(['walk','jog','run.easy','run','sprint']);
const EDGE_MIN_RATE = 0.75;
const EDGE_MAX_RATE = 1.25;
const finite = (v) => Number.isFinite(v);
const clone = (v) => v == null ? v : structuredClone(v);

function ladderData(ladder, ladderId, rigFamily) {
  if (!ladder || !String(ladder.schema || '').startsWith('kfb.locomotion-ladder/')) {
    throw new Error('locomotion-ladder-profile: kfb.locomotion-ladder evidence required');
  }
  const id = ladderId || Object.keys(ladder.ladders || {})[0];
  const family = ladder.ladders?.[id];
  const rig = family?.[rigFamily];
  if (!id || !family || !rig) throw new Error('locomotion-ladder-profile: ladder/rig not found');
  return { id, family, rig };
}

function selectedRungs(rig) {
  return new Map((rig.rungs || []).map((r) => [r.rung, r]));
}

function speedOf(row, rigFamily, speedSpace) {
  const s = row?.naturalSpeedMs;
  if (!s) return null;
  const v = speedSpace === 'world' ? s.world : s[rigFamily];
  return finite(v) ? v : null;
}

function forwardPlaybackRanges(rig) {
  const ranges = Object.fromEntries(FORWARD_ORDER.map((s) => [s, [EDGE_MIN_RATE, EDGE_MAX_RATE]]));
  for (const band of rig.forwardBands || []) {
    const from = FORWARD_RUNG_STATE[band.from];
    const to = FORWARD_RUNG_STATE[band.to];
    if (!from || !to) continue;
    if (finite(band.fromRateAtHandoff)) ranges[from][1] = band.fromRateAtHandoff;
    if (finite(band.toRateAtHandoff)) ranges[to][0] = band.toRateAtHandoff;
  }
  return ranges;
}

function stateFromRung(row, state, rigFamily, speedSpace, playbackRange) {
  if (!row) return { role: state, clip: null, status: 'UNMAPPED' };
  const verdict = String(row.slip?.verdict || 'n/a').toUpperCase();
  const status = verdict === 'HOLD' ? 'TECHNICAL_HOLD'
    : verdict === 'PASS' ? 'MEASURED_TECHNICAL_CANDIDATE'
      : 'TECHNICAL_CANDIDATE';
  return {
    role: state,
    clip: row.clip || null,
    status,
    measurementStatus: status,
    humanAccepted: false,
    referenceSpeed: speedOf(row, rigFamily, speedSpace),
    rigReferenceSpeed: speedOf(row, rigFamily, 'rig'),
    worldReferenceSpeed: speedOf(row, rigFamily, 'world'),
    playbackRange: playbackRange ? [...playbackRange] : null,
    sourceRung: row.rung || null,
    library: row.library || null,
    kind: row.kind || null,
    loop: !!row.loop,
    rootMotion: row.rootMotion || null,
    duration: finite(row.durationSec) ? row.durationSec : null,
    slip: clone(row.slip || null),
    alternatives: clone(row.alternatives || []),
    sourceEvidence: 'LOCOMOTION_LADDER_02',
  };
}

export function buildForwardProfileFromLadder(ladder, {
  ladderId = null,
  rigFamily = 'Rig_Medium',
  speedSpace = 'world',
} = {}) {
  const { id, rig } = ladderData(ladder, ladderId, rigFamily);
  const rows = selectedRungs(rig);
  const ranges = forwardPlaybackRanges(rig);
  const states = {
    idle: stateFromRung(rows.get('idle'), 'idle', rigFamily, speedSpace, null),
    start: stateFromRung(rows.get('walkStart'), 'start', rigFamily, speedSpace, null),
    stop: stateFromRung(rows.get('walkStop'), 'stop', rigFamily, speedSpace, null),
  };

  for (const [rung, state] of Object.entries(FORWARD_RUNG_STATE)) {
    states[state] = stateFromRung(rows.get(rung), state, rigFamily, speedSpace, ranges[state]);
  }

  for (const [rung, state] of [['jumpStart','jump.start'],['jumpAir','jump.air'],['jumpLand','jump.land']]) {
    if (rows.has(rung)) states[state] = stateFromRung(rows.get(rung), state, rigFamily, speedSpace, null);
  }

  const transitions = {};
  for (const band of rig.forwardBands || []) {
    const from = FORWARD_RUNG_STATE[band.from];
    const to = FORWARD_RUNG_STATE[band.to];
    if (!from || !to) continue;
    transitions[from + '→' + to] = {
      syncPhase: band.sameFootAlignable !== false,
      sameFootAlignable: band.sameFootAlignable !== false,
      phaseOffset: finite(band.phaseOffset) ? band.phaseOffset : null,
      handoffSpeed: speedSpace === 'world'
        ? (finite(band.handoffSpeedMs?.world) ? band.handoffSpeedMs.world : null)
        : (finite(band.handoffSpeedMs?.[rigFamily]) ? band.handoffSpeedMs[rigFamily] : null),
      stretchFlag: !!band.stretchFlag,
      evidence: 'LOCOMOTION_LADDER_02_FORWARD_BAND',
    };
  }

  const forwardRows = Object.entries(FORWARD_RUNG_STATE).map(([rung, state]) => ({ rung, state, row: rows.get(rung) }));
  const missingForward = forwardRows.filter((x) => !x.row?.clip).map((x) => x.rung);
  const holdForward = forwardRows.filter((x) => String(x.row?.slip?.verdict || '').toUpperCase() === 'HOLD').map((x) => x.rung);
  const stretchedForward = (rig.forwardBands || []).filter((b) => b.stretchFlag).map((b) => b.from + '→' + b.to);
  const lookChoices = Object.fromEntries(
    forwardRows.filter((x) => (x.row?.alternatives || []).length)
      .map((x) => [x.state, {
        selected: x.row.clip,
        alternatives: clone(x.row.alternatives),
        humanAccepted: false,
      }])
  );

  return {
    schema: SCHEMA,
    status: 'TECHNICAL_FORWARD_CANDIDATE_HUMAN_LOOK_OPEN',
    humanAccepted: false,
    source: {
      schema: ladder.schema,
      id: ladder.id || null,
      ladderId: id,
      date: ladder.date || null,
      method: clone(ladder.method || null),
    },
    rigFamily,
    speedSpace,
    forwardOrder: [...FORWARD_ORDER],
    states,
    transitions,
    preferredPhaseFoot: 'left',
    warpDuringGaitCrossfade: true,
    technicalForwardReady: missingForward.length === 0 && holdForward.length === 0 && stretchedForward.length === 0,
    missingForward,
    holdForward,
    stretchedForward,
    lookChoices,
    unresolvedProductGaps: clone(ladder.gaps || []),
    rule: 'Technical ladder selection is evidence, not Georg visual acceptance. Consumers may not fork this mapping.',
  };
}

export function ladderCrossCheckMeasurement(ladder, rigFamily = 'Rig_Medium') {
  if (!ladder || !String(ladder.schema || '').startsWith('kfb.locomotion-ladder/')) {
    throw new Error('locomotion-ladder-profile: ladder cross-check evidence required');
  }
  const rows = ladder.motionLabV1Comparison?.[rigFamily] || {};
  return {
    schema: 'kfb.motion-blender-measurements/1#ladder-crosscheck',
    source: {
      ladderId: ladder.id || null,
      ladderSchema: ladder.schema || null,
      method: 'LOCOMOTION_LADDER strictHere same-clip cross-check',
    },
    rigFamily,
    actor: null,
    clips: Object.entries(rows).map(([clip, facts]) => ({
      clip,
      status: 'MEASURED_CROSSCHECK',
      referenceSpeed: finite(facts?.strictHere) ? facts.strictHere : null,
      ladderStrictHere: finite(facts?.strictHere) ? facts.strictHere : null,
      ladderLabMethodHere: finite(facts?.labMethodHere) ? facts.labMethodHere : null,
      priorMotionLabReported: finite(facts?.motionLab) ? facts.motionLab : null,
    })),
  };
}
