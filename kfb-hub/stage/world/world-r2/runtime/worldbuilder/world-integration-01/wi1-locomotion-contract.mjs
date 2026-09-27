/* WORLD-R2-CONTRACT-RESET-01
   Pure contract audit for the locomotion rows exposed by wi1-play.js.
   This module does not own clips, movement, playback or labels. It only checks
   whether the World consumer truthfully separates source roles from variants. */

export const SOURCE_BACKED_STATES = Object.freeze([
  'idle', 'walk', 'run', 'sprint', 'backward',
  'strafe.left', 'strafe.right',
  'jump.start', 'jump.air', 'jump.land',
  'crouch', 'sneak', 'crawl'
]);

export const VARIANT_ROWS = Object.freeze({
  'walk.fast': Object.freeze({ kind: 'toolbox.playback-variant', sourceState: 'walk' }),
  'backward.fast': Object.freeze({ kind: 'world.consumer-tuning', sourceState: 'backward' }),
  'strafe.left (strafe.walk)': Object.freeze({ kind: 'world.consumer-tuning', sourceState: 'strafe.left' }),
  'strafe.right (strafe.walk)': Object.freeze({ kind: 'world.consumer-tuning', sourceState: 'strafe.right' })
});

export function auditLocomotionRows(rows) {
  const errors = [];
  const list = Array.isArray(rows) ? rows : [];
  const byState = new Map();

  for (const row of list) {
    if (!row || typeof row.state !== 'string') {
      errors.push('row without state');
      continue;
    }
    if (byState.has(row.state)) errors.push('duplicate state: ' + row.state);
    byState.set(row.state, row);
    if (!row.sourceClip) errors.push('missing source clip: ' + row.state);
  }

  for (const state of SOURCE_BACKED_STATES) {
    const row = byState.get(state);
    if (!row) errors.push('missing source-backed state: ' + state);
    else if (row.variant != null) errors.push('source-backed state labelled as variant: ' + state);
  }

  for (const [state, spec] of Object.entries(VARIANT_ROWS)) {
    const row = byState.get(state);
    const source = byState.get(spec.sourceState);
    if (!row) {
      errors.push('missing variant state: ' + state);
      continue;
    }
    if (typeof row.variant !== 'string' || !row.variant.trim()) errors.push('variant not explicitly labelled: ' + state);
    if (!source || row.sourceClip !== source.sourceClip) errors.push('variant source mismatch: ' + state + ' → ' + spec.sourceState);
  }

  const expectedVariants = new Set(Object.keys(VARIANT_ROWS));
  for (const row of list) {
    if (row?.variant != null && !expectedVariants.has(row.state)) errors.push('unexpected variant state: ' + row.state);
  }

  return {
    ok: errors.length === 0,
    errors,
    counts: {
      sourceBacked: SOURCE_BACKED_STATES.filter((state) => byState.has(state)).length,
      toolboxPlaybackVariants: byState.has('walk.fast') ? 1 : 0,
      worldConsumerRows: Object.keys(VARIANT_ROWS).filter((state) => state !== 'walk.fast' && byState.has(state)).length
    },
    contract: 'kfb.world-locomotion-consumer/1'
  };
}
