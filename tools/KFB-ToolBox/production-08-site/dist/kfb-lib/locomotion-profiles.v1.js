/* KFB · locomotion-profiles.v1 — canonical KayKit locomotion as semantic profiles (ToolBox Production-01).
 *
 * Owner: Animation Lab / ToolBox Motion. Consumers (WorldBuilder, Residents, Travel, Race) read the
 * exported profile set — role ids, clip refs, speed/cadence, contact and transition facts. This file is
 * NOT a movement controller: it maps source clips to roles and measures them on the actor's own rig.
 *
 * Source: KayKit Character Animations 1.1 · Rig_Medium (General · MovementBasic · MovementAdvanced)
 * @ b97b5ac55df2724fae623992433685583eece51e. Clip names below are the real names in those GLBs
 * (inventoried 2026-09-25). A role without a matching source clip stays UNMAPPED — no fake clip.
 * Mixamo / KFB Motion Library clips are the variant/action layer and never overwrite these roles.
 */
export const SCHEMA = 'kfb.locomotion-profile-set/0.1';
export const SOURCE = { pack: 'KayKit Character Animations 1.1', repo: 'georg-doc/kayfabizarro', commit: 'b97b5ac55df2724fae623992433685583eece51e',
  path: 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/', sets: ['General', 'MovementBasic', 'MovementAdvanced'] };

/* kind: stand = no travel expected · cycle = looping gait · oneshot = plays once · hold = loop while airborne.
   faster: pick a DIFFERENT source clip only if it measures ≥ 10 % faster than the base role; otherwise the tier
   is an explicit playback-rate variant of the base (`variant: 'playback-rate'`, sourceBacked: false). */
export const ROLES = [
  { role: 'idle',         clip: 'Idle_A', kind: 'stand', loop: true },
  { role: 'walk',         clip: 'Walking_A', kind: 'cycle', loop: true },
  { role: 'walk.fast',    faster: 'walk', among: ['Walking_B', 'Walking_C'], rate: 1.3, kind: 'cycle', loop: true },
  { role: 'run',          clip: 'Running_A', kind: 'cycle', loop: true },
  { role: 'sprint',       match: /sprint/i, faster: 'run', among: ['Running_B'], rate: 1.3, kind: 'cycle', loop: true },
  { role: 'backward',     clip: 'Walking_Backwards', kind: 'cycle', loop: true },
  { role: 'strafe.left',  clip: 'Running_Strafe_Left', kind: 'cycle', loop: true },
  { role: 'strafe.right', clip: 'Running_Strafe_Right', kind: 'cycle', loop: true },
  { role: 'jump.start',   clip: 'Jump_Start', kind: 'oneshot', loop: false },
  { role: 'jump.air',     clip: 'Jump_Idle', kind: 'hold', loop: true },
  { role: 'jump.land',    clip: 'Jump_Land', kind: 'oneshot', loop: false },
  { role: 'crouch',       clip: 'Crouching', kind: 'cycle', loop: true },
  { role: 'sneak',        clip: 'Sneaking', kind: 'cycle', loop: true },
  { role: 'crawl',        clip: 'Crawling', kind: 'cycle', loop: true },
];

/* Hints only — the consumer's controller owns timing. */
export const TRANSITIONS = {
  'idle→walk': { fade: 0.25 }, 'walk→idle': { fade: 0.3 }, 'walk→walk.fast': { fade: 0.2, syncPhase: true }, 'walk.fast→run': { fade: 0.2, syncPhase: true },
  'run→sprint': { fade: 0.15, syncPhase: true }, 'sprint→run': { fade: 0.2, syncPhase: true }, 'run→walk': { fade: 0.25, syncPhase: true },
  'any→jump.start': { fade: 0.08 }, 'jump.start→jump.air': { at: 'clip end', fade: 0.1 }, 'jump.air→jump.land': { at: 'host ground contact', fade: 0.05 },
  'jump.land→idle': { at: 'clip end', fade: 0.15 }, 'jump.land→walk': { at: 'clip end', fade: 0.15 },
  'idle→crouch': { fade: 0.25 }, 'crouch→sneak': { fade: 0.2 }, 'sneak→crawl': { fade: 0.35 },
};

const med = (a) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

/* Measure one clip on the actor's own rig. Samples the clip through the ONE mixer (the caller stops other
   actions first and restores afterwards). Measurement space = `space` (the actor root, world metres).
   feet: { l, r } bones · hips bone · fwd/side unit vectors in `space`. */
export function measureClip(THREE, { mixer, clip, space, feet, hips, fwd, side, fps = 60 }) {
  const a = mixer.clipAction(clip); a.reset(); a.setLoop(THREE.LoopRepeat, Infinity); a.enabled = true; a.setEffectiveWeight(1); a.play();
  const n = Math.max(2, Math.round(clip.duration * fps) + 1), dt = clip.duration / (n - 1);
  const P = { l: [], r: [] }, H = [], v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    a.time = Math.min(clip.duration - 1e-4, i * dt); mixer.update(0); space.updateMatrixWorld(true);
    for (const s of ['l', 'r']) P[s].push(space.worldToLocal(feet[s].getWorldPosition(v.clone())));
    H.push(space.worldToLocal(hips.getWorldPosition(v.clone())));
  }
  a.stop();
  const leg = Math.max(0.05, H[0].y - Math.min(P.l[0].y, P.r[0].y));
  const res = { frames: n, fps, legLen: +leg.toFixed(4), contacts: {}, events: {} };
  const stanceV = [];
  for (const s of ['l', 'r']) {
    const ys = P[s].map((p) => p.y), lo = Math.min(...ys), hi = Math.max(...ys), thr = lo + Math.max(0.012, (hi - lo) * 0.18);
    const on = ys.map((y) => y <= thr), iv = [];
    let st = null; for (let i = 0; i < n; i++) { if (on[i] && st == null) st = i; if ((!on[i] || i === n - 1) && st != null) { iv.push([st + 1, (on[i] ? i : i - 1) + 1]); st = null; } }
    res.contacts['foot.' + s] = { planted: iv, lift: +(hi - lo).toFixed(4), minY: +lo.toFixed(4) };
    for (let i = 1; i < n; i++) if (on[i] && on[i - 1]) stanceV.push(P[s][i].clone().sub(P[s][i - 1]).setY(0).divideScalar(dt));
  }
  /* In-place gait: the planted foot slides opposite to travel. Its median stance velocity is the world
     speed at which feet would not skate. */
  const sv = stanceV.length ? stanceV.reduce((acc, x) => acc.add(x), new THREE.Vector3()).divideScalar(stanceV.length) : new THREE.Vector3();
  const travel = sv.clone().negate(), sp = med(stanceV.map((x) => x.length()));
  const dirF = travel.lengthSq() > 1e-8 ? travel.clone().normalize() : null;
  const along = dirF ? { fwd: +dirF.dot(fwd).toFixed(3), side: +dirF.dot(side).toFixed(3) } : null;
  const hipTravel = H[n - 1].clone().sub(H[0]).setY(0).length();
  res.rootMotion = hipTravel > leg * 0.08 ? { policy: 'baked', metresPerCycle: +hipTravel.toFixed(4) } : { policy: 'in-place', hipDrift: +hipTravel.toFixed(4) };
  /* a contact that wraps the loop end (starts at frame 1 and ends at the last frame) is ONE contact */
  let steps = 0; for (const s of ['l', 'r']) { const p = res.contacts['foot.' + s].planted; steps += p.length - (p.length > 1 && p[0][0] === 1 && p[p.length - 1][1] === n ? 1 : 0); }
  const bothAlways = ['l', 'r'].every((s) => { const p = res.contacts['foot.' + s].planted; return p.length === 1 && p[0][0] === 1 && p[0][1] === n; });
  res.stepsPerCycle = bothAlways ? 0 : steps;
  res.cadenceSpm = res.stepsPerCycle ? +(res.stepsPerCycle / clip.duration * 60).toFixed(1) : 0;
  res.stanceSpeed = sp != null && !bothAlways ? +sp.toFixed(4) : 0;
  res.travelDir = along;
  res.strideLength = res.stanceSpeed ? +(res.stanceSpeed * clip.duration / Math.max(1, res.stepsPerCycle / 2)).toFixed(4) : 0;
  /* one-shot events: take-off = first frame both feet are off; touchdown = first frame after airborne a foot plants */
  const off = (i) => ['l', 'r'].every((s) => P[s][i].y > res.contacts['foot.' + s].minY + Math.max(0.012, res.contacts['foot.' + s].lift * 0.18));
  let air = -1; for (let i = 0; i < n; i++) if (off(i)) { air = i; break; }
  if (air >= 0) res.events.takeoff = air + 1;
  if (air >= 0) for (let i = air; i < n; i++) if (!off(i)) { res.events.touchdown = i + 1; break; }
  for (let i = 0; i < n; i++) if (['l', 'r'].some((s) => !off(i) && P[s][i].y <= res.contacts['foot.' + s].minY + Math.max(0.012, res.contacts['foot.' + s].lift * 0.18))) { res.events.firstPlant = i + 1; break; }
  if (air < 0) { const hy = H.map((h) => h.y), lowI = hy.indexOf(Math.min(...hy)); res.events.hipLow = lowI + 1; }
  res.hipRange = +(Math.max(...H.map((h) => h.y)) - Math.min(...H.map((h) => h.y))).toFixed(4);
  return res;
}

/* Build the profile set: map roles → clips (from the actor's clip list), measure, decide tiers. */
export function buildProfileSet(THREE, { clips, measure, rigFamily, actor, actorScale = 1 }) {
  const byName = new Map(clips.map((c) => [c.name, c]));
  const cache = new Map(), m = (name) => { if (!cache.has(name)) cache.set(name, measure(byName.get(name).clip)); return cache.get(name); };
  const out = { schema: SCHEMA, rigFamily, actor, source: SOURCE, actorScale: +actorScale.toFixed(4), measuredAt: new Date().toISOString(), profiles: {}, transitions: TRANSITIONS, unmapped: [] };
  for (const R of ROLES) {
    let name = R.clip && byName.has(R.clip) ? R.clip : null, variant = null, evidence = null;
    if (!name && R.match) { const hit = clips.find((c) => R.match.test(c.name)); if (hit) name = hit.name; }
    if (!name && R.faster) {
      const base = out.profiles[R.faster];
      if (base && base.clip) {
        const bs = base.measured.stanceSpeed || 0;
        const cand = (R.among || []).filter((x) => byName.has(x)).map((x) => ({ x, s: m(x).stanceSpeed || 0 })).sort((p, q) => q.s - p.s)[0];
        if (cand && bs > 0 && cand.s >= bs * 1.1) { name = cand.x; evidence = 'source clip ' + cand.x + ' measures +' + ((cand.s / bs - 1) * 100).toFixed(1) + ' % vs ' + base.clip; }
        else { name = base.clip; variant = { of: R.faster, rate: R.rate, why: cand ? cand.x + ' measures ' + (bs ? ((cand.s / bs - 1) * 100).toFixed(1) : '0') + ' % vs ' + base.clip + ' (< +10 %)' : 'no candidate clip in source' }; }
      }
    }
    if (!name) { out.unmapped.push(R.role); out.profiles[R.role] = { role: R.role, clip: null, status: 'UNMAPPED · no source clip' }; continue; }
    const c = byName.get(name), me = m(name), rate = variant ? variant.rate : 1, cyc = R.kind === 'cycle';
    /* speed and cadence are gait facts: only cycles carry them; stand/one-shot/hold keep their raw measurement in `measured` */
    const world = cyc && me.stanceSpeed ? +(me.stanceSpeed * rate).toFixed(3) : 0;
    out.profiles[R.role] = {
      role: R.role, kind: R.kind, clip: name, pack: c.pack || null, ref: { src: 'stock', id: name },
      sourceBacked: !variant, variant: variant ? { type: 'playback-rate', of: variant.of, why: variant.why } : null, semanticEvidence: evidence,
      duration: +c.clip.duration.toFixed(4), loop: R.loop, playbackRate: rate,
      measured: me, cadenceSpm: cyc ? +(me.cadenceSpm * rate).toFixed(1) : 0, worldSpeed: world, nativeSpeed: actorScale ? +(world / actorScale).toFixed(4) : null,
      strideRelation: cyc && me.stanceSpeed ? 'worldSpeed = stanceSpeed × rate (in-place clip; feet do not skate at this speed)' : (R.kind === 'cycle' ? 'no stance slide measured' : 'n/a'),
      rootMotion: me.rootMotion.policy === 'in-place' ? 'in-place · consumer moves the root at worldSpeed' : 'baked · ' + me.rootMotion.metresPerCycle + ' m/cycle',
      status: variant ? 'VARIANT · playback-rate' : 'SOURCE',
    };
  }
  return out;
}

/* What WorldBuilder reads: roles → clip ref + speed/cadence + contacts + transitions. No controller. */
export function consumerView(set) {
  const roles = {};
  for (const [k, p] of Object.entries(set.profiles)) {
    if (!p.clip) { roles[k] = { unmapped: true }; continue; }
    roles[k] = { clip: p.clip, ref: p.ref, loop: p.loop, rate: p.playbackRate, worldSpeed: p.worldSpeed, nativeSpeed: p.nativeSpeed, cadenceSpm: p.cadenceSpm,
      sourceBacked: p.sourceBacked, variant: p.variant, root: p.measured.rootMotion.policy, contacts: p.measured.contacts, events: p.measured.events };
  }
  return { schema: SCHEMA + '#consumer', rigFamily: set.rigFamily, source: set.source, actorScale: set.actorScale, roles, transitions: set.transitions, variantLayer: 'kfb-motion-library (Mixamo) · request by semantic role' };
}
