// KFB Track Core · W0 reference seed · v0.1 · 2026-09-27
// One authoritative core: RouteRecipe -> pieces -> centre-line samples -> frames -> slot profile + markings -> checks.
// Pure ES module, no dependencies. Consumers (runtime mesh, colliders, Blender oracle, GLB) read the stream; they never re-solve.
//
// Frame convention (see TRACK_CORE_CONTRACT_v0.md §1):
//   runtime world: right-handed, metres, +Y up. Heading psi = 0 drives towards +Z.
//   T = unit tangent, U = unit road-up, R = T x U = the DRIVER'S right.  (Legacy donors use n = U x T = driver's left.)
//   psi > 0 / kappa > 0 = turning right. bank > 0 = right edge lower (leaning into a right turn).
//   Lateral offsets: negative = left, positive = right. World point = P + R*lat + U*lift.

export const CORE_VERSION = 'kfb.track-core/0.1';
export const WIDTHS = Object.freeze({ NARROW: 10.8, STANDARD: 14.4, WIDE: 18.0, HERO: 21.6, HERO_XL: 28.8 });

// ---------------------------------------------------------------- small vector helpers
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smoothstep = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
const smootherstep = (u) => { u = clamp(u, 0, 1); return u * u * u * (u * (u * 6 - 15) + 10); };
const lerp = (a, b, t) => a + (b - a) * t;
const DEG = Math.PI / 180;
// rotate v about unit axis k by angle a (Rodrigues)
function rot(v, k, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c)));
}
const EASES = { step: (u) => (u < 1 ? 0 : 1), linear: (u) => clamp(u, 0, 1), smoothstep, smootherstep };

// ---------------------------------------------------------------- default slot profile (metres)
// Donor: RKIT-01 TB fractions at the 18 m reference ("fixed barrier" rule of RKIT-04): shoulder, barrier and
// underside sizes are constant in metres; only the road width changes with the width class.
export const PROFILE_DEFAULTS = Object.freeze({
  width: WIDTHS.STANDARD, offset: 0,
  shoulderW: 1.98, shoulderDrop: 0.28,
  barrierGap: 0.72,           // shoulder edge -> barrier inner face
  barrierT: 1.62,             // barrier thickness (inner face -> outer face)
  barrierH: 1.35,             // barrier inner top above road
  barrierOuterTop: 1.18,
  deckDepth: 2.25,            // underside below road
  barrierVisL: 1, barrierVisR: 1, // 0 = flush (sunk), 1 = full height; blends are the taper
});
// the canonical slot set: fixed names and order, never changes count (TRACK_SLOT_PROFILE, contract §4)
export const SLOTS = Object.freeze([
  'under_L', 'barrier_out_bot_L', 'barrier_out_top_L', 'barrier_in_top_L', 'barrier_in_bot_L', 'shoulder_L', 'road_L',
  'road_R', 'shoulder_R', 'barrier_in_bot_R', 'barrier_in_top_R', 'barrier_out_top_R', 'barrier_out_bot_R', 'under_R',
]);
const SINK = 0.35; // a flush barrier sits this far under the road (hidden), RKIT-11 transition donor

export function profileSlots(p) {
  const half = p.width / 2, o = p.offset;
  const out = {};
  for (const side of [-1, 1]) {
    const S = side < 0 ? 'L' : 'R';
    const vis = side < 0 ? p.barrierVisL : p.barrierVisR;
    const road = half, sh = half + p.shoulderW, bi = sh + p.barrierGap, bo = bi + p.barrierT;
    const hIn = lerp(-SINK, p.barrierH, vis), hOut = lerp(-SINK, p.barrierOuterTop, vis);
    out['road_' + S] = [o + side * road, 0];
    out['shoulder_' + S] = [o + side * sh, -p.shoulderDrop];
    out['barrier_in_bot_' + S] = [o + side * bi, -p.shoulderDrop];
    out['barrier_in_top_' + S] = [o + side * bi, hIn];
    out['barrier_out_top_' + S] = [o + side * bo, hOut];
    out['barrier_out_bot_' + S] = [o + side * bo, -p.deckDepth * 0.5];
    out['under_' + S] = [o + side * bo, -p.deckDepth];
  }
  return SLOTS.map((k) => out[k]);
}

// ---------------------------------------------------------------- marking styles (independent layer, contract §6)
export const MARKING_STYLES = Object.freeze({
  TRACK: [{ id: 'edge', at: 'edges', inset: 0.25, w: 0.30 }],
  STREET: [{ id: 'edge', at: 'edges', inset: 0.25, w: 0.24 }, { id: 'centre', at: 'centre', w: 0.24, dash: 3, gap: 3 }],
  MAG: [{ id: 'edge', at: 'edges', inset: 0.25, w: 0.30 }, { id: 'mag', at: 'bars', w: 0.9, pitch: 3, span: 0.7 }],
  NONE: [],
});

// ---------------------------------------------------------------- pieces -> centre-line generators
// A plan piece is described by a curvature schedule kappa(s) and a height schedule h(s) over its length.
// Every piece may carry: width | widthTo, params {name: value | {to, ease, zone:[u0,u1]}}, markings, bank, tags.
function planCurvatureSchedule(turnDeg, R, ease) {
  // clothoid in -> arc -> clothoid out. Turn = kappa * (La + Le). If the turn is too small, pure clothoid pair.
  const th = Math.abs(turnDeg) * DEG, k = 1 / R, sgn = Math.sign(turnDeg) || 1;
  let Le = ease, La = th / k - Le;
  if (La < 0) { La = 0; Le = th / k; }
  const L = La + 2 * Le;
  const kap = (s) => sgn * k * (s < Le ? s / Le : s > Le + La ? (L - s) / Le : 1);
  return { L, kap, Le, La };
}

export const PIECES = {
  STRAIGHT: (q) => ({ L: q.length, kap: () => 0 }),
  CURVE_EASE: (q) => planCurvatureSchedule(q.turn, q.radius, q.ease ?? Math.min(q.radius * 0.6, 30)),
  HAIRPIN_180: (q) => planCurvatureSchedule(180 * (q.dir ?? 1), q.radius, q.ease ?? q.radius * 0.8),
  // S-offset: two mirrored clothoid-arc pairs; lateral shift ~ q.shift over q.length
  OFFSET_S: (q) => {
    const L = q.length, a = q.shift;
    // heading psi(s) = A * sin^2-bump; lateral = integral of sin(psi). Solve A numerically for the shift.
    const shape = (A) => { let x = 0; const n = 400; for (let i = 0; i < n; i++) { const u = (i + 0.5) / n; x += Math.sin(A * Math.sin(Math.PI * u) ** 2) * L / n; } return x; };
    let lo = -1.2, hi = 1.2; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (shape(m) < -a) lo = m; else hi = m; }
    const A = (lo + hi) / 2; // negative A = heading left
    // kappa = d psi / ds
    return { L, kap: (s) => A * Math.PI / L * Math.sin(2 * Math.PI * s / L) };
  },
  WIDTH_STEP: (q) => ({ L: q.length, kap: () => 0 }),
  // SPIRAL = curve ease with a rise; kept as its own id for the recipe vocabulary
  SPIRAL: (q) => planCurvatureSchedule(q.turn, q.radius, q.ease ?? q.radius * 0.5),
};
const IS_3D = { LOOP: true };

// LOOP: 3D generator. Vertical teardrop, kappa_v = kmax sin^2(pi s/L), lateral drift D (donor RKIT-08 stunt_lib).
function loopPoints(H, D, side, ds) {
  // height is linear in L; find c = H/L once
  const integ = (L, n) => { const k = 4 * Math.PI / L; let z = 0, y = 0, th = 0; const pts = [[0, 0, 0]]; const h = L / n;
    for (let i = 0; i < n; i++) { const s = (i + 0.5) * h; const thm = k * (s / 2 - L / (4 * Math.PI) * Math.sin(2 * Math.PI * s / L));
      z += Math.cos(thm) * h; y += Math.sin(thm) * h; pts.push([(i + 1) * h, z, y]); } return pts; };
  const probe = integ(100, 4000); const c = Math.max(...probe.map((p) => p[2])) / 100;
  const L = H / c, n = Math.max(8, Math.round(L / ds));
  const P = integ(L, n);
  return { L, rTop: L / (4 * Math.PI), pts: P.map(([s, z, y]) => ({ s, fwd: z, up: y, lat: side * D * smootherstep(s / L) })) };
}

// ---------------------------------------------------------------- compile
export function compileRecipe(recipe, opts = {}) {
  const ds = opts.ds ?? recipe.ds ?? 0.5;
  const start = recipe.start ?? {};
  let P = start.p ? [...start.p] : [0, 0, 0];
  let psi = (start.headingDeg ?? 0) * DEG;
  const cur = { ...PROFILE_DEFAULTS, ...(recipe.defaults?.profile ?? {}) };
  if (recipe.defaults?.widthClass) cur.width = WIDTHS[recipe.defaults.widthClass];
  let marking = recipe.defaults?.markings ?? 'TRACK';
  const autoBank = recipe.defaults?.autoBank ?? { gain: 26, limitDeg: 24 }; // bank = gain * kappa (rad), clamp
  const samples = []; const joints = [];
  let s = 0;

  const pushSample = (p, T, kapPlan, kapV, bankExplicit, prm, tags, law, extra = {}) => {
    samples.push({ s, p, T, kapPlan, kapV, bankExplicit, prm, tags, law, marking: prm.__marking, ...extra });
  };

  recipe.pieces.forEach((pc, idx) => {
    const type = pc.type;
    joints.push({ index: samples.length, s, piece: pc.id ?? `${type}_${idx}` });
    const from = { ...cur };
    const targets = {};
    if (pc.width) targets.width = { to: WIDTHS[pc.width] ?? pc.width, ease: 'smootherstep', zone: [0, 1] };
    if (pc.widthTo) targets.width = { to: WIDTHS[pc.widthTo] ?? pc.widthTo, ease: 'smootherstep', zone: pc.widthZone ?? [0, 1] };
    for (const [k, v] of Object.entries(pc.params ?? {})) targets[k] = typeof v === 'object' ? { ease: 'smoothstep', zone: [0, 1], ...v } : { to: v, ease: 'step', zone: [0, 0] };
    const prmAt = (u) => {
      const o = { ...from };
      for (const [k, t] of Object.entries(targets)) {
        const [a, b] = t.zone; const w = b > a ? EASES[t.ease]((u - a) / (b - a)) : (u >= a ? 1 : 0);
        o[k] = lerp(from[k], t.to, w);
      }
      o.__marking = pc.markings ?? marking;
      return o;
    };
    const tags = [type, ...(pc.tags ?? [])];

    if (IS_3D[type]) {
      const H = pc.height, D = pc.drift ?? (cur.width + 3), side = pc.side ?? 1;
      const lp = loopPoints(H, D, side, ds);
      const T0 = [-Math.sin(psi), 0, Math.cos(psi)], U0 = [0, 1, 0], R0 = cross(T0, U0);
      const base = [...P];
      const n = lp.pts.length;
      for (let i = (idx === 0 ? 0 : 1); i < n; i++) {
        const q = lp.pts[i];
        const p = add(add(add(base, mul(T0, q.fwd)), mul(U0, q.up)), mul(R0, q.lat));
        s = joints[joints.length - 1].s + q.s; // loop arc is in-plane length; lateral drift adds ~D^2/L, re-measured below
        pushSample(p, null, 0, 4 * Math.PI / lp.L * Math.sin(Math.PI * q.s / lp.L) ** 2, 0, prmAt(q.s / lp.L), tags, 'rmf', { loop: true });
      }
      P = samples[samples.length - 1].p; // heading unchanged after a loop
      Object.assign(cur, prmAt(1)); delete cur.__marking;
      if (pc.markings) marking = pc.markings;
      return;
    }

    const gen = PIECES[type];
    if (!gen) throw new Error(`unknown piece type ${type}`);
    const g = gen(pc);
    const rise = pc.rise ?? 0;
    const hEase = EASES[pc.riseEase ?? 'smootherstep'];
    const n = Math.max(1, Math.round(g.L / ds)), h = g.L / n;
    const y0 = P[1];
    // integrate heading + position with midpoint rule in plan; height from the rise schedule
    for (let i = (idx === 0 ? 0 : 1); i <= n; i++) {
      if (i > 0) {
        const sm = (i - 0.5) * h;
        const psiM = psi + g.kap(sm) * h / 2;
        const hy0 = y0 + rise * hEase((i - 1) / n), hy1 = y0 + rise * hEase(i / n);
        const dy = hy1 - hy0, dh = Math.sqrt(Math.max(h * h - dy * dy, 1e-12));
        P = [P[0] - Math.sin(psiM) * dh, hy1, P[2] + Math.cos(psiM) * dh];
        psi = psiM + g.kap(sm) * h / 2;
        s += h;
      }
      const u = i / n;
      const grade = rise ? (rise * (hEase(Math.min(1, u + 1e-4)) - hEase(Math.max(0, u - 1e-4))) / (2e-4 * g.L)) : 0;
      const phi = Math.atan(grade);
      const T = [-Math.sin(psi) * Math.cos(phi), Math.sin(phi), Math.cos(psi) * Math.cos(phi)];
      pushSample([...P], T, g.kap(u * g.L), 0, pc.bankDeg != null ? pc.bankDeg * DEG : null, prmAt(u), tags, 'guide');
    }
    Object.assign(cur, prmAt(1)); delete cur.__marking;
    if (pc.markings) marking = pc.markings;
  });

  // re-measure s along the polyline (loops drift laterally) and tangents for rmf samples
  for (let i = 1; i < samples.length; i++) samples[i].s = samples[i - 1].s + len(sub(samples[i].p, samples[i - 1].p));
  for (let i = 0; i < samples.length; i++) if (!samples[i].T) {
    const a = samples[Math.max(0, i - 1)].p, b = samples[Math.min(samples.length - 1, i + 1)].p; samples[i].T = norm(sub(b, a));
  }

  // bank: explicit > auto from plan curvature, smoothed over a window, only on guide samples
  const rawBank = samples.map((q) => q.law === 'rmf' ? 0 : q.bankExplicit ?? clamp(autoBank.gain * q.kapPlan, -autoBank.limitDeg * DEG, autoBank.limitDeg * DEG));
  const win = Math.round((opts.bankSmoothM ?? 24) / ds);
  const bank = rawBank.map((_, i) => {
    if (samples[i].law === 'rmf') return 0;
    let acc = 0, w = 0;
    for (let j = i - win; j <= i + win; j++) {
      if (j < 0 || j >= samples.length || samples[j].law === 'rmf') continue;
      const k = 1 - Math.abs(j - i) / (win + 1); acc += rawBank[j] * k; w += k;
    }
    return acc / w;
  });

  // frames: guide law (world up, pitch-aware, then bank) or rotation-minimising (double reflection) on loops,
  // with the residual twist at loop exit distributed linearly over the loop (closure rule, donor track-lab A0).
  const guideUp = (T, b) => { let U = norm(sub([0, 1, 0], mul(T, T[1]))); return rot(U, T, b); };
  const frames = new Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const q = samples[i];
    if (q.law === 'guide') { const U = guideUp(q.T, bank[i]); frames[i] = { T: q.T, U, R: cross(q.T, U) }; continue; }
    // start of an rmf run
    let j = i; while (j < samples.length && samples[j].law === 'rmf') j++;
    const prev = frames[i - 1] ?? { T: q.T, U: guideUp(q.T, 0) };
    let r = prev.U; let x0 = samples[i - 1]?.p ?? q.p; let t0 = prev.T;
    for (let k = i; k < j; k++) {
      const x1 = samples[k].p, t1 = samples[k].T, v1 = sub(x1, x0), c1 = dot(v1, v1) || 1e-12;
      const rL = sub(r, mul(v1, 2 / c1 * dot(v1, r))), tL = sub(t0, mul(v1, 2 / c1 * dot(v1, t0)));
      const v2 = sub(t1, tL), c2 = dot(v2, v2) || 1e-12;
      r = norm(sub(rL, mul(v2, 2 / c2 * dot(v2, rL))));
      frames[k] = { T: t1, U: r, R: cross(t1, r) }; x0 = x1; t0 = t1;
    }
    const exitT = samples[j - 1].T, want = guideUp(exitT, 0), got = frames[j - 1].U;
    const twist = Math.atan2(dot(cross(got, want), exitT), dot(got, want));
    const s0 = samples[i].s, s1 = samples[j - 1].s;
    for (let k = i; k < j; k++) { const a = twist * (samples[k].s - s0) / Math.max(s1 - s0, 1e-9); const U = norm(rot(frames[k].U, frames[k].T, a)); frames[k] = { T: frames[k].T, U, R: cross(frames[k].T, U) }; }
    samples[i].twistFixDeg = twist / DEG;
    i = j - 1;
  }

  // emit stream
  const stream = samples.map((q, i) => ({
    s: q.s, p: q.p, T: frames[i].T, U: frames[i].U, R: frames[i].R,
    kappa: q.law === 'rmf' ? q.kapV : q.kapPlan, bank: bank[i], grade: q.T[1] / Math.hypot(q.T[0], q.T[2]) || 0,
    law: q.law, tags: q.tags, prm: stripPrm(q.prm), marking: q.marking, slots: profileSlots(q.prm),
  }));
  const markings = paintMarkings(stream);
  const out = { schema: 'kfb.track-core.stream/0.1', core: CORE_VERSION, id: recipe.id, ds, slots: SLOTS, joints, samples: stream, markings };
  out.fingerprint = fingerprint(out);
  return out;
}
function stripPrm(p) { const o = {}; for (const k of Object.keys(PROFILE_DEFAULTS)) o[k] = +p[k].toFixed(4); return o; }

// markings: bands over s, never cut into the road mesh; consumers draw them as surface splits / decals
function paintMarkings(stream) {
  const bands = [];
  const open = new Map();
  const close = (key, s) => { const b = open.get(key); if (b) { b.s1 = s; if (b.s1 - b.s0 > 1e-6) bands.push(b); open.delete(key); } };
  for (const q of stream) {
    const st = MARKING_STYLES[q.marking] ?? [];
    const live = new Set();
    for (const m of st) {
      const half = q.prm.width / 2, o = q.prm.offset;
      const lanes = m.at === 'edges' ? [[o - half + m.inset, -1], [o + half - m.inset, 1]] : [[o, 0]];
      for (const [lat, side] of lanes) {
        let on = true;
        if (m.dash) on = (q.s % (m.dash + m.gap)) < m.dash;
        if (m.pitch) on = (q.s % m.pitch) < m.w;
        const key = `${q.marking}:${m.id}:${side}`;
        if (on) { live.add(key); if (!open.has(key)) open.set(key, { style: q.marking, id: m.id, side, s0: q.s, lat, w: m.at === 'bars' ? q.prm.width * m.span : m.w }); }
      }
    }
    for (const k of [...open.keys()]) if (!live.has(k)) close(k, q.s);
  }
  const sEnd = stream[stream.length - 1].s; for (const k of [...open.keys()]) close(k, sEnd);
  return bands;
}

// ---------------------------------------------------------------- checks (contract §8). Tolerances are proposals.
export const TOL = Object.freeze({ posGap: 1e-6, kinkDegPerM: 0.5, kappaJump: 0.01, bankStepDeg: 1.5, orth: 1e-6,
  foldMargin: 0.5, clearance: 2.5, clearanceFarM: 40, frameFlipDot: 0.0 });

export function runChecks(stream, tol = TOL) {
  const S = stream.samples, res = [];
  const add_ = (id, pass, value, note) => res.push({ id, pass, value, note });
  // s monotonic, sample spacing
  let mono = 0, maxGap = 0; for (let i = 1; i < S.length; i++) { const d = S[i].s - S[i - 1].s; if (d <= 0) mono++; maxGap = Math.max(maxGap, Math.abs(len(sub(S[i].p, S[i - 1].p)) - d)); }
  add_('s_monotonic', mono === 0, mono, 'count of non-increasing s');
  add_('s_matches_arc', maxGap < 1e-6, maxGap, 'max |chord - ds|');
  // orthonormal frames
  let orth = 0; for (const q of S) orth = Math.max(orth, Math.abs(dot(q.T, q.U)), Math.abs(dot(q.T, q.R)), Math.abs(dot(q.U, q.R)), Math.abs(len(q.T) - 1), Math.abs(len(q.U) - 1));
  add_('frame_orthonormal', orth < tol.orth, orth);
  // flips: consecutive right vectors must not reverse
  let flips = 0, minDotR = 1; for (let i = 1; i < S.length; i++) { const d = dot(S[i].R, S[i - 1].R); minDotR = Math.min(minDotR, d); if (d < tol.frameFlipDot) flips++; }
  add_('frame_flips', flips === 0, flips, `min dot(R_i, R_i-1) = ${minDotR.toFixed(4)}`);
  // joints: tangent, curvature, bank, width continuity at every piece joint (and everywhere, per metre)
  // tangent kink: measured turning rate (deg/m from the actual tangents) must not jump between neighbours
  let tMax = 0, kMax = 0, bMax = 0, prevRate = null, kinkAt = null;
  for (let i = 1; i < S.length; i++) {
    const dsi = Math.max(S[i].s - S[i - 1].s, 1e-9);
    const rate = Math.acos(clamp(dot(S[i].T, S[i - 1].T), -1, 1)) / DEG / dsi;
    if (prevRate !== null && Math.abs(rate - prevRate) > tMax) { tMax = Math.abs(rate - prevRate); kinkAt = S[i].s; }
    prevRate = rate;
    if (S[i].law === S[i - 1].law) kMax = Math.max(kMax, Math.abs(S[i].kappa - S[i - 1].kappa));
    bMax = Math.max(bMax, Math.abs(S[i].bank - S[i - 1].bank) / DEG / dsi);
  }
  add_('tangent_kink', tMax < tol.kinkDegPerM, +tMax.toFixed(4), `max jump of the turning rate (deg/m) between neighbours, at s ${kinkAt?.toFixed(1)}`);
  add_('curvature_step', kMax < tol.kappaJump, +kMax.toFixed(5), 'max |dkappa| between samples of the same law (clothoid = continuous)');
  add_('bank_rate', bMax < tol.bankStepDeg, +bMax.toFixed(4), 'max deg per metre');
  // slot parity: every sample has the full slot set
  const bad = S.filter((q) => q.slots.length !== SLOTS.length || q.slots.some((v) => !Number.isFinite(v[0]) || !Number.isFinite(v[1]))).length;
  add_('slot_parity', bad === 0, bad);
  // inner-edge fold: the outermost slot must stay inside the plan radius on the inside of a curve
  let folds = 0, worst = Infinity; for (const q of S) { if (q.law !== 'guide' || Math.abs(q.kappa) < 1e-6) continue; const R = 1 / Math.abs(q.kappa);
    const inner = q.kappa > 0 ? Math.max(...q.slots.map((v) => v[0])) : -Math.min(...q.slots.map((v) => v[0]));
    const m = R - inner; worst = Math.min(worst, m); if (m < tol.foldMargin) folds++; }
  add_('inner_edge_fold', folds === 0, folds, `min radius margin ${Number.isFinite(worst) ? worst.toFixed(2) : 'n/a'} m`);
  // self clearance between parts of the route that are far apart along s (loops, spirals, crossings)
  const step = Math.max(1, Math.round(2 / stream.ds)); let minC = Infinity, at = null;
  const ext = (q) => { const xs = q.slots.map((v) => v[0]); return { lo: Math.min(...xs), hi: Math.max(...xs), top: Math.max(...q.slots.map((v) => v[1])), bot: Math.min(...q.slots.map((v) => v[1])) }; };
  const corners = S.map((q) => { const e = ext(q); return [[e.lo, e.top], [e.hi, e.top], [e.lo, e.bot], [e.hi, e.bot], [0, 0]].map(([l, h]) => add(add(q.p, mul(q.R, l)), mul(q.U, h))); });
  for (let i = 0; i < S.length; i += step) for (let j = i + step; j < S.length; j += step) {
    if (S[j].s - S[i].s < tol.clearanceFarM) continue;
    if (S[i].tags.includes('crossing_ok') && S[j].tags.includes('crossing_ok')) continue;
    for (const a of corners[i]) for (const b of corners[j]) { const d = len(sub(a, b)); if (d < minC) { minC = d; at = [+S[i].s.toFixed(1), +S[j].s.toFixed(1)]; } }
  }
  add_('self_clearance', minC >= tol.clearance, Number.isFinite(minC) ? +minC.toFixed(3) : null, at ? `closest at s ${at[0]} / ${at[1]}` : 'no far pairs');
  // determinism
  add_('fingerprint', typeof stream.fingerprint === 'string' && stream.fingerprint.length === 8, stream.fingerprint);
  return { pass: res.every((r) => r.pass), results: res };
}

// ---------------------------------------------------------------- fingerprint (FNV-1a over a rounded stream)
export function fingerprint(stream) {
  let h = 0x811c9dc5;
  const feed = (str) => { for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } };
  for (const q of stream.samples) feed([q.s, ...q.p, ...q.U, q.bank].map((v) => v.toFixed(4)).join(','));
  return (h >>> 0).toString(16).padStart(8, '0');
}

// ---------------------------------------------------------------- consumer helper: world points of a slot at sample i
export function slotWorld(sample, slotIndex) {
  const [lat, lift] = sample.slots[slotIndex];
  return add(add(sample.p, mul(sample.R, lat)), mul(sample.U, lift));
}
