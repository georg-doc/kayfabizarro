// KFB Track Core · reference seed · v0.2 · 2026-09-27
// One authoritative core: RouteRecipe (graph) -> pieces -> centre-line samples -> frames -> slot profile + markings -> checks.
// Pure ES module, no dependencies. Consumers (runtime mesh, colliders, Blender oracle, GLB) read the stream; they never re-solve.
//
// Frame convention (TRACK_CORE_CONTRACT_v0.md §1):
//   runtime world: right-handed, metres, +Y up. Heading psi = 0 drives towards +Z.
//   T = unit tangent, U = unit road-up, R = T x U = the DRIVER'S right.  (Legacy donors use n = U x T = driver's left.)
//   psi > 0 / kappa > 0 = turning right. bank > 0 = right edge lower (leaning into a right turn).
//   Lateral offsets: negative = left, positive = right. World point = P + R*lat + U*lift.
// v0.2: horizontal parametrisation of plan pieces; CREST / DIP / KICKER / AIR / LANDING; CONNECT (quintic Hermite
//       connector); SPLIT_HALF / MERGE_HALF with per-side profile scale; route graph (compileGraph) + cross-route checks.

export const CORE_VERSION = 'kfb.track-core/0.12';
export const WIDTHS = Object.freeze({ NARROW: 10.8, STANDARD: 14.4, WIDE: 18.0, HERO: 21.6, HERO_XL: 28.8 });
export const PHYS = Object.freeze({ g: 15, vMax: 27 }); // WSA D1 (PR #204): Rapier g 15 m/s², 27 m/s
// v0.7.1 vehicle envelope (Georg 27.09): every vehicle must pass everywhere, including the big trucks; mechs / walkers /
// transformers are scaled to be no taller than a tall truck. Race scale = Box-Stop BOX1 (lengths normalised: cars 4.1 m,
// van 5.0, heavy 6.5): Kenney firetruck 3.25 m high, garbage truck 3.01, toy truck 3.96, monster truck 4.89 (above the
// cap). height = tallest vehicle, reserve = bounce / squash-stretch / crest allowance. Proposal, Georg decides.
// v0.8 (Georg 27.09): 4 + 1 m leaves too little room for bounce and movement -> reserve 3 m, 7 m clear.
export const VEHICLE_ENVELOPE = Object.freeze({ height: 4.0, reserve: 3.0, width: 4.1 });
export const VEHICLE_HEADROOM = VEHICLE_ENVELOPE.height + VEHICLE_ENVELOPE.reserve;   // clear height over the road
export const LOOP_BODY_HALF = 3.25;
// v0.9 (Georg 27.09: loops bigger, rollercoaster logic, measured in height and ride length, not track width)
export const LOOP_DEFAULT_H = 100, LOOP_MIN_H = 60;
// v0.9 width transitions longer and softer (Georg 27.09): at least WIDTH_TAPER m of transition per metre of width
// change on each side (STANDARD -> WIDE 45 m, -> HERO 90 m). A WIDTH_STEP without length takes this length.
export const WIDTH_TAPER = 25, WIDTH_STEP_MIN = 40; // half the longest race-scale vehicle (heavy 6.5 m), for loop_envelope

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
const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));
function rot(v, k, a) { // Rodrigues
  const c = Math.cos(a), s = Math.sin(a);
  return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c)));
}
// ramp: constant grade in the middle, parabolic blends over the first / last 10 % (C1). For long climbs such as
// parking helices, where a smootherstep would flatten the first and last turn and eat the headroom.
const ramp = (u, e = 0.1) => { u = clamp(u, 0, 1); const k = 1 / (1 - e);
  return u < e ? k * u * u / (2 * e) : u > 1 - e ? 1 - k * (1 - u) * (1 - u) / (2 * e) : k * (u - e / 2); };
// half ramps (v0.4): ease only at one end, constant grade at the other, so one climb can span several pieces.
// rampIn: grade 0 -> k at u = e, then constant. rampOut: mirror. k = 1 / (1 - e / 2) keeps f(1) = 1.
const rampIn = (u, e = 0.1) => { u = clamp(u, 0, 1); const k = 1 / (1 - e / 2); return u < e ? k * u * u / (2 * e) : k * (u - e / 2); };
const rampOut = (u, e = 0.1) => 1 - rampIn(1 - u, e);
const EASES = { step: (u) => (u < 1 ? 0 : 1), linear: (u) => clamp(u, 0, 1), smoothstep, smootherstep, ramp, rampIn, rampOut };
const headingT = (psi, slope = 0) => norm([-Math.sin(psi), slope, Math.cos(psi)]);

// ---------------------------------------------------------------- slot profile
// Donor: RKIT-01 TB fractions at the 18 m reference, RKIT-04 "fixed barrier" rule: shoulder, barrier and
// underside sizes are constant in metres; only the road width changes with the width class.
export const PROFILE_DEFAULTS = Object.freeze({
  width: WIDTHS.STANDARD, offset: 0,
  shoulderW: 1.98, shoulderDrop: 0.28,
  barrierGap: 0.72, barrierT: 1.62, barrierH: 1.35, barrierOuterTop: 1.18,
  deckDepth: 2.25,
  barrierVisL: 1, barrierVisR: 1, // 0 = flush (sunk), 1 = full height; blends are the taper
  sideL: 1, sideR: 1,             // lateral scale of shoulder+barrier on that side (0 = lanes share a deck edge)
  surface: 1,                     // 0 = no driving surface (airborne span); consumers skip road/body there
});
export const SIDE_EXTENT = PROFILE_DEFAULTS.shoulderW + PROFILE_DEFAULTS.barrierGap + PROFILE_DEFAULTS.barrierT; // 4.32 m
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
    const k = side < 0 ? p.sideL : p.sideR;
    const road = half, sh = half + p.shoulderW * k, bi = sh + p.barrierGap * k, bo = bi + p.barrierT * k;
    const hIn = lerp(-SINK, p.barrierH, vis), hOut = lerp(-SINK, p.barrierOuterTop, vis);
    out['road_' + S] = [o + side * road, 0];
    out['shoulder_' + S] = [o + side * sh, -p.shoulderDrop * k];
    out['barrier_in_bot_' + S] = [o + side * bi, -p.shoulderDrop * k];
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
// ---------------------------------------------------------------- skins: colour presets per role (style layer, not geometry)
// Placeholder palettes until the seeded KFB palettes plug in. Changes between skins are blended ACROSS the seam and
// staggered per role (barrier cap first, road last), Georg 27.09: no hard colour edge at a joint.
const hex = (h) => [(h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255];
export const SKINS = Object.freeze({
  street: { road: hex(0x5a646e), shoulder: hex(0xa9a39a), barrier_side: hex(0x707780), barrier_cap: hex(0xe9e3d6), underside: hex(0x8a8580) },
  track: { road: hex(0x279797), shoulder: hex(0xd8956b), barrier_side: hex(0x674b54), barrier_cap: hex(0xfa7a47), underside: hex(0xac7965) },
  mag: { road: hex(0x2b4fa0), shoulder: hex(0x7fd4ff), barrier_side: hex(0x3b2d6e), barrier_cap: hex(0xff5fb8), underside: hex(0x6a5a9e) },
  // v0.6: lifebuoy pads (bounce), placeholder until the clay skins arrive
  toy: { road: hex(0xff7a1a), shoulder: hex(0xffb347), barrier_side: hex(0xff8f2e), barrier_cap: hex(0xfff3e0), underside: hex(0xe8601c) },  // v0.8 toy track (orange plastic)
  buoy: { road: hex(0xf2ede4), shoulder: hex(0xe8452c), barrier_side: hex(0xe8452c), barrier_cap: hex(0xf2ede4), underside: hex(0xd8703a) },
});
export const SKIN_OF_MARKING = Object.freeze({ STREET: 'street', TRACK: 'track', MAG: 'mag', NONE: 'track' });
export const SKIN_BLEND = Object.freeze({ length: 32, zones: { barrier_cap: [0, 0.55], barrier_side: [0.1, 0.7], underside: [0.1, 0.9], shoulder: [0.25, 0.85], road: [0.4, 1.0] } });
function paintSkins(stream, blend = SKIN_BLEND) {
  const n = stream.length, sk = stream.map((q) => q.skin);
  const changes = []; for (let i = 1; i < n; i++) if (sk[i] !== sk[i - 1]) changes.push(i);
  for (let i = 0; i < n; i++) stream[i].paint = Object.fromEntries(Object.entries(SKINS[sk[i]]).map(([k, v]) => [k, [...v]]));
  changes.forEach((ci, c) => {
    const sc = stream[ci].s, A = SKINS[sk[ci - 1]], B = SKINS[sk[ci]];
    const lo = Math.max(sc - blend.length / 2, c > 0 ? (stream[changes[c - 1]].s + sc) / 2 : -Infinity);
    const hi = Math.min(sc + blend.length / 2, c + 1 < changes.length ? (sc + stream[changes[c + 1]].s) / 2 : Infinity);
    for (let i = 0; i < n; i++) {
      const s = stream[i].s; if (s < lo || s > hi) continue;
      const u = (s - (sc - blend.length / 2)) / blend.length;
      for (const [role, [a, b]] of Object.entries(blend.zones)) {
        const w = smoothstep((u - a) / (b - a));
        stream[i].paint[role] = A[role].map((x, k) => +(x + (B[role][k] - x) * w).toFixed(4));
      }
    }
  });
}

// lateral position of a marking band at one sample (consumers call this per sample; bands carry the rule, not a fixed lat)
export function markingLat(band, prm) {
  const half = prm.width / 2;
  return band.at === 'edges' ? prm.offset + band.side * (half - band.inset) : prm.offset;
}

// ---------------------------------------------------------------- piece generators
// Plan pieces are parametrised by HORIZONTAL distance x in [0, L]: kap(x) = plan curvature, y(u) = [dy, dy/dx]
// relative to the entry height (u = x / L). Pieces may also return prm(u, from) overrides and extra tags.
function planCurvatureSchedule(turnDeg, R, ease) {
  const th = Math.abs(turnDeg) * DEG, k = 1 / R, sgn = Math.sign(turnDeg) || 1;
  let Le = ease, La = th / k - Le;
  if (La < 0) { La = 0; Le = th / k; }
  const L = La + 2 * Le;
  return { L, kap: (s) => sgn * k * (s < Le ? s / Le : s > Le + La ? (L - s) / Le : 1) };
}
// quintic Hermite (value, slope; zero second derivative at both ends -> no vertical curvature step at the joints)
const hermite5 = (h0, m0, h1, m1, u) => { const u2 = u * u, u3 = u2 * u, u4 = u3 * u, u5 = u4 * u;
  const H = [1 - 10 * u3 + 15 * u4 - 6 * u5, u - 6 * u3 + 8 * u4 - 3 * u5, -4 * u3 + 7 * u4 - 3 * u5, 10 * u3 - 15 * u4 + 6 * u5];
  const D = [-30 * u2 + 60 * u3 - 30 * u4, 1 - 18 * u2 + 32 * u3 - 15 * u4, -12 * u2 + 28 * u3 - 15 * u4, 30 * u2 - 60 * u3 + 30 * u4];
  return [H[0] * h0 + H[1] * m0 + H[2] * m1 + H[3] * h1, D[0] * h0 + D[1] * m0 + D[2] * m1 + D[3] * h1]; };
// default height schedule: rise with ease + optional bell (crest/dip)
function heightSchedule(q, L) {
  const blended = { ramp, rampIn, rampOut }[q.riseEase];
  let e = blended && q.riseBlend ? (u) => blended(u, q.riseBlend) : EASES[q.riseEase ?? 'smootherstep'];
  // riseSteps n: the rise is split into n equal flights that each level out (car-park floors); C1 at every floor
  if (q.riseSteps > 1) { const n = q.riseSteps, f = e; e = (u) => { const x = clamp(u, 0, 1) * n, k = Math.min(n - 1, Math.floor(x)); return (k + f(x - k)) / n; }; }
  const rise = q.rise ?? 0, bump = q.bump ?? 0;
  return (u) => {
    const d = 1e-4;
    const f = (v) => { const w = clamp(v, 0, 1); return rise * e(w) + bump * 64 * (w * (1 - w)) ** 3; }; // C2 bell: no vertical-curvature step at the ends
    return [f(u), (f(Math.min(1, u + d)) - f(Math.max(0, u - d))) / ((Math.min(1, u + d) - Math.max(0, u - d)) * L)];
  };
}

// open track ends (kicker lip, landing start). v0.9 (Georg 27.09: ends looked squashed and cut off): the end is ROUNDED
// instead of thinned. Over `len` m the barriers only lower to `vis` of their height (thickness and deck stay chunky).
// Over the last `nose` m the section closes like a cartoon bullnose: the shoulder + barrier extent and the deck depth
// follow a quarter ellipse (plan corners round in, the underside curves up to the road). v0.9.1: the driving surface
// and its lines keep their full width to the lip (the v0.9 road-corner cut made the bands fold; Georg 27.09).
export const ROUND_END = Object.freeze({ len: 16, vis: 1, nose: 9 });   // v0.10: vis 1 = barriers keep their height (concept: no sag)
export const END_TAPER = ROUND_END; // v0.5 name kept for consumers
function endTaper(q, dir, extra = {}) {
  const cfg = q.endTaper === false ? null : { ...ROUND_END, ...(q.endTaper ?? {}) };
  return (u, from) => {
    if (!cfg) return { ...extra };
    const L = q.length, d = dir === 'out' ? (1 - u) * L : u * L;       // metres to the open end
    const w = 1 - smootherstep(d / Math.min(cfg.len, L));              // 0 = full barrier, 1 = at the end
    const pn = clamp01(1 - d / Math.min(cfg.nose, L)), circ = Math.sqrt(1 - pn * pn);
    const dd = (cfg.fullDeck ?? PROFILE_DEFAULTS.deckDepth), pd = clamp01(1 - d / Math.min(dd, L)), dcirc = Math.sqrt(1 - pd * pd); // v0.10: taut deck nose, radius = deck depth
    const W = dir === 'out' ? from.width : (from.endW ?? from.width);   // the lip's rounded width must not carry into the landing
    const full = dir === 'out' ? { visL: from.barrierVisL, visR: from.barrierVisR, deck: from.deckDepth, sL: from.sideL, sR: from.sideR }
      : { visL: 1, visR: 1, deck: cfg.fullDeck ?? PROFILE_DEFAULTS.deckDepth, sL: 1, sR: 1 };
    return { ...extra, barrierVisL: lerp(full.visL, cfg.vis, w) * circ, barrierVisR: lerp(full.visR, cfg.vis, w) * circ,
      sideL: full.sL * circ, sideR: full.sR * circ, deckDepth: full.deck * dcirc, width: W, endW: W, noMark: d < 1 ? 1 : 0 };
  };
}
const clamp01 = (x) => Math.max(0, Math.min(1, x));

export const PIECES = {
  STRAIGHT: (q) => ({ L: q.length, kap: () => 0 }),
  TRANSITION: (q) => ({ L: q.length ?? TRANSITION.length, kap: () => 0, tags: ['transition'] }),   // v0.11 carrier: a straight whose only job is the zone
  CURVE_EASE: (q) => planCurvatureSchedule(q.turn, q.radius, q.ease ?? Math.min(q.radius * 0.6, 30)),
  HAIRPIN_180: (q) => planCurvatureSchedule(180 * (q.dir ?? 1), q.radius, q.ease ?? q.radius * 0.8),
  SPIRAL: (q) => planCurvatureSchedule(q.turn, q.radius, q.ease ?? q.radius * 0.5),
  WIDTH_STEP: (q) => ({ L: q.length, kap: () => 0 }),
  OFFSET_S: (q) => {
    // heading psi(s) = A sin^2(pi s/L) along the plan path; lateral shift = integral of sin(psi). Solve A for the shift.
    const L = q.length, a = q.shift;
    const shape = (A) => { let x = 0; const n = 400; for (let i = 0; i < n; i++) { const u = (i + 0.5) / n; x += Math.sin(A * Math.sin(Math.PI * u) ** 2) * L / n; } return x; };
    let lo = -1.2, hi = 1.2; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (shape(m) < a) lo = m; else hi = m; }
    const A = (lo + hi) / 2;
    return { L, kap: (s) => A * Math.PI / L * Math.sin(2 * Math.PI * s / L) };
  },
  CREST: (q) => ({ L: q.length, kap: () => 0, y: heightSchedule({ bump: Math.abs(q.height) }, q.length) }),
  DIP: (q) => ({ L: q.length, kap: () => 0, y: heightSchedule({ bump: -Math.abs(q.height) }, q.length) }),
  // KICKER: cubic Hermite from the entry grade to the lip (height, angle). The lip is a real edge: the car leaves here.
  // v0.5: the barriers thin out towards the lip (Georg: open ends run out thin, not cut hard) -> endTaper.
  KICKER: (q, st) => ({ L: q.length, kap: () => 0, tags: ['kicker'], prm: endTaper(q, 'out'),
    y: (u) => { const [h, dh] = hermite5(0, st.grade * q.length, q.lipHeight, Math.tan(q.lipDeg * DEG) * q.length, u); return [h, dh / q.length]; } }),
  // AIR: designed ballistic span from the lip slope, gap G (horizontal), landing top `drop` below the lip. No surface.
  AIR: (q, st) => {
    const G = q.gap, D = q.drop ?? 0, ta = st.grade, ca2 = 1 / (1 + ta * ta);
    const den = 2 * ca2 * (ta * G + D);
    if (den <= 0) throw new Error(`AIR ${q.id}: lip angle ${Math.atan(ta) / DEG}° cannot reach a landing ${D} m below at ${G} m`);
    const v2 = PHYS.g * G * G / den, v = Math.sqrt(v2);
    const y = (u) => { const x = u * G; return [ta * x - PHYS.g * x * x / (2 * v2 * ca2), ta - PHYS.g * x / (v2 * ca2)]; };
    return { L: G, kap: () => 0, y, tags: ['air'], designSpeed: v, prm: () => ({ surface: 0 }) };
  },
  // LANDING: from the arrival slope down to flat over its length (drop = height lost on the ramp).
  LANDING: (q, st) => ({ L: q.length, kap: () => 0, tags: ['landing'],
    y: (u) => { const [h, dh] = hermite5(0, st.grade * q.length, -(q.drop ?? 0), 0, u); return [h, dh / q.length]; },
    prm: endTaper(q, 'in', { surface: 1 }) }),
  // SPLIT_HALF: width W halves into two lanes W/2; the kept lane is `keep` (+1 right / -1 left). The centre line moves
  // smoothly from the shared axis to the kept lane's centre (so the route re-bases onto its own lane and banks / loops
  // about it later). Lanes separate until each has its own barrier set plus a gore of `gore` m. The inner barrier
  // rises late (Georg's taper rule). Deck-level lanes are flat (roll law `flat`).
  SPLIT_HALF: (q, st) => {
    const W = st.prm.width, k = q.keep ?? 1, sep = SIDE_EXTENT + (q.gore ?? 1.0) / 2, inner = k > 0 ? 'L' : 'R';
    const bf = q.barrierFrom ?? 0.3, c = k * (W / 4 + sep);
    return { L: q.length, kap: () => 0, tags: ['split'], flat: true, breakAtStart: true,
      axis: (u) => -c * smootherstep(u),        // v0.8: the shared axis, lateral, relative to this lane's centre line
      lat: (u) => [c * smootherstep(u), c * 30 * u * u * (u - 1) * (u - 1)],
      prm: (u) => ({ width: W / 2, offset: k * (W / 4) * (1 - smootherstep(u)), ['side' + inner]: smootherstep(u),
        ['barrierVis' + inner]: smoothstep((u - bf) / (1 - bf)) }) };
  },
  // MERGE_HALF: mirror. Starts on the lane centre, ends on the shared axis. The main route (no branchEnd) steps to the
  // full width at u = 1; the branch copy (branchEnd) just ends there.
  MERGE_HALF: (q, st) => {
    const Wh = st.prm.width, k = q.keep ?? 1, sep = SIDE_EXTENT + (q.gore ?? 1.0) / 2, inner = k > 0 ? 'L' : 'R';
    const bt = q.barrierTo ?? 0.7, c = -k * (Wh / 2 + sep);
    return { L: q.length, kap: () => 0, tags: ['merge'], flat: true,
      axis: (u) => c * (1 - smootherstep(u)),
      lat: (u) => [c * smootherstep(u), c * 30 * u * u * (u - 1) * (u - 1)],
      breakAtEnd: q.branchEnd ? null : { width: 2 * Wh, offset: 0, sideL: 1, sideR: 1, barrierVisL: 1, barrierVisR: 1 },
      prm: (u) => ({ width: Wh, offset: k * (Wh / 2) * smootherstep(u), ['side' + inner]: 1 - smootherstep(u), ['barrierVis' + inner]: 1 - smoothstep(u / bt) }) };
  },
};
const IS_3D = { LOOP: true };

// LOOP: 3D generator. Vertical teardrop, kappa_v = kmax sin^2(pi s/L), lateral drift D (donor RKIT-08 stunt_lib).
function loopPoints(H, D, side, ds) {
  const th = (L, s) => 4 * Math.PI / L * (s / 2 - L / (4 * Math.PI) * Math.sin(2 * Math.PI * s / L));
  const integ = (L, n) => { let z = 0, y = 0; const pts = [[0, 0, 0, 0]]; const h = L / n;
    for (let i = 0; i < n; i++) { const thm = th(L, (i + 0.5) * h);
      z += Math.cos(thm) * h; y += Math.sin(thm) * h; pts.push([(i + 1) * h, z, y, th(L, (i + 1) * h)]); } return pts; };
  const probe = integ(100, 4000); const c = Math.max(...probe.map((p) => p[2])) / 100;
  const L = H / c, n = Math.max(8, Math.round(L / ds));
  return { L, pts: integ(L, n).map(([s, z, y, a]) => ({ s, fwd: z, up: y, theta: a, lat: side * D * smootherstep(s / L) })) };
}

// CONNECT: quintic Hermite from the current frame to a target frame (position, heading, grade), zero curvature at both
// ends, so it joins straights without a curvature step. This is the flexible "Anschlussstück" between authored routes.
function connectPoints(p0, psi0, g0, p1, psi1, g1, ds, stretch = 1.0) {
  const chord = len(sub(p1, p0)) * stretch;
  const v0 = mul(headingT(psi0, g0), chord), v1 = mul(headingT(psi1, g1), chord);
  const H = (u) => { const u3 = u * u * u, u4 = u3 * u, u5 = u4 * u;
    return [1 - 10 * u3 + 15 * u4 - 6 * u5, u - 6 * u3 + 8 * u4 - 3 * u5, -4 * u3 + 7 * u4 - 3 * u5, 10 * u3 - 15 * u4 + 6 * u5]; };
  const at = (u) => { const [h0, h1, h4, h5] = H(u); return add(add(add(mul(p0, h0), mul(v0, h1)), mul(v1, h4)), mul(p1, h5)); };
  // arc-length reparametrisation
  const dense = []; const N = 2000; let acc = 0; let prev = at(0); dense.push([0, 0]);
  for (let i = 1; i <= N; i++) { const q = at(i / N); acc += len(sub(q, prev)); dense.push([i / N, acc]); prev = q; }
  const n = Math.max(2, Math.round(acc / ds)); const out = []; let j = 0;
  for (let i = 0; i <= n; i++) { const target = acc * i / n; while (j < N && dense[j + 1][1] < target) j++;
    const [ua, sa] = dense[j], [ub, sb] = dense[Math.min(N, j + 1)]; const u = sb > sa ? ua + (ub - ua) * (target - sa) / (sb - sa) : ua; out.push({ u, p: at(u) }); }
  out[out.length - 1].p = [...p1];
  return { length: acc, pts: out };
}

// ---------------------------------------------------------------- compile one route
export function compileRecipe(recipe, opts = {}) {
  recipe = { ...recipe, pieces: expandMacros(recipe.pieces) };
  const ds = opts.ds ?? recipe.ds ?? 0.5;
  const st0 = opts.startState;
  const start = recipe.start ?? {};
  let P = st0 ? [...st0.p] : (start.p ? [...start.p] : [0, 0, 0]);
  let psi = st0 ? st0.psi : (start.headingDeg ?? 0) * DEG;
  let grade = st0 ? st0.grade : 0;
  const cur = st0 ? { ...st0.prm } : { ...PROFILE_DEFAULTS, ...(recipe.defaults?.profile ?? {}) };
  if (!st0 && recipe.defaults?.widthClass) cur.width = WIDTHS[recipe.defaults.widthClass];
  let marking = st0?.marking ?? recipe.defaults?.markings ?? 'TRACK';
  let skin = st0?.skin ?? recipe.defaults?.skin ?? SKIN_OF_MARKING[marking];
  let tun = st0?.tun ?? null;   // v0.7 current tunnel spec (sticky like the marking), null = open air
  let tubeNo = st0?.tubeNo ?? 0; // v0.8 tube serial: a new tube (portal) starts a new number
  const autoBank = recipe.defaults?.autoBank ?? { gain: 26, limitDeg: 24 };
  const samples = []; const joints = [];
  const pushSample = (p, T, kapPlan, kapV, bankExplicit, prm, tags, law, extra = {}) =>
    samples.push({ p, T, kapPlan, kapV, bankExplicit, prm, tags, law, marking: prm.__marking, skin: prm.__skin, drive: prm.__drive, tun: prm.__tun, ...extra });

  recipe.pieces.forEach((pc, idx) => {
    const type = pc.type;
    if (type === 'WIDTH_STEP' && pc.length == null) {
      const to = WIDTHS[pc.widthTo ?? pc.width] ?? pc.widthTo ?? pc.width ?? cur.width;
      pc = { ...pc, length: Math.max(WIDTH_STEP_MIN, Math.ceil(WIDTH_TAPER * Math.abs(to - cur.width) / 2)) };
    }
    joints.push({ index: samples.length, piece: pc.id ?? `${type}_${idx}`, type, psi, grade, p: [...P], prm: { ...cur }, marking, skin, tun, tubeNo });
    const from = { ...cur };
    const targets = {};
    if (pc.width) targets.width = { to: WIDTHS[pc.width] ?? pc.width, ease: 'smootherstep', zone: [0, 1] };
    if (pc.widthTo) targets.width = { to: WIDTHS[pc.widthTo] ?? pc.widthTo, ease: 'smootherstep', zone: pc.widthZone ?? [0, 1] };
    for (const [k, v] of Object.entries(pc.params ?? {})) targets[k] = typeof v === 'object' ? { ease: 'smoothstep', zone: [0, 1], ...v } : { to: v, ease: 'step', zone: [0, 0] };
    let pieceOverride = null;
    // v0.7 tunnel: pc.tunnel undefined = keep, null / false = leave (portal at the piece start), {shape, ...} = enter here
    // (portal) or, when already inside, morph from the current section to the new one over morphZone (default the piece)
    let tunA = tun, tunB = tun; const tunZone = pc.tunnel?.morphZone ?? [0, 1];
    if (pc.tunnel === null || pc.tunnel === false) { tunA = tunB = null; }
    else if (pc.tunnel) { const spec = tunnelSpec(pc.tunnel); tunA = tun && !pc.tunnel.new ? tun : spec; tunB = spec; }
    // v0.8: entering from open air, or `new: true` (tube ends at the wall of the next one, e.g. bunker -> hangar)
    if (tunB && (!tun || pc.tunnel?.new)) tubeNo++;
    const myTube = tubeNo;
    const prmAt = (u) => {
      const o = { ...from };
      for (const [k, t] of Object.entries(targets)) {
        const [a, b] = t.zone; const w = b > a ? EASES[t.ease]((u - a) / (b - a)) : (u >= a ? 1 : 0);
        o[k] = lerp(from[k], t.to, w);
      }
      if (pieceOverride) Object.assign(o, pieceOverride(u, from));
      o.__marking = pc.markings ?? marking;
      o.__skin = pc.skin ?? (pc.markings ? SKIN_OF_MARKING[pc.markings] : skin);
      // v0.8: the branch copy of a split / merge has no tube of its own; the main route's junction hall covers it
      const inHall = (type === 'SPLIT_HALF' || type === 'MERGE_HALF') && (pc.tags ?? []).includes('branch');
      o.__tun = tunB && !inHall ? { tube: myTube, A: tunA, B: tunB, t: tunA === tunB ? 1 : smootherstep((u - tunZone[0]) / Math.max(tunZone[1] - tunZone[0], 1e-9)) } : null;
      o.__drive = pc.drive ?? null;  // v0.6: per-section drive mode {mode: free|assist|locked, fx: [bounce|magnet_catch|zero_g|...]}
      return o;
    };
    const tags = [type, ...(pc.tags ?? [])];
    const first = idx === 0;

    if (IS_3D[type]) {
      // default drift: full section width (road + both side extents at the current side scale) + 3 m, so the legs pass clear
      const fullW = cur.width + SIDE_EXTENT * (cur.sideL + cur.sideR);
      const lp = loopPoints(pc.height ?? LOOP_DEFAULT_H, pc.drift ?? (fullW + 3) * 1.35, pc.side ?? 1, ds); // legs pass each other at ~78 % of the drift
      const T0 = headingT(psi, 0), U0 = [0, 1, 0], R0 = cross(T0, U0), base = [...P];
      for (let i = first ? 0 : 1; i < lp.pts.length; i++) {
        const q = lp.pts[i];
        const p = add(add(add(base, mul(T0, q.fwd)), mul(U0, q.up)), mul(R0, q.lat));
        // loop law (donor RKIT-08): road-up = world up pitched by the in-plane angle theta about the loop axis R0,
        // re-orthogonalised against the 3D tangent. Exact world up again at theta = 2 pi, no twist to distribute.
        const guide = sub(mul(U0, Math.cos(q.theta)), mul(T0, Math.sin(q.theta)));
        pushSample(p, null, 0, 4 * Math.PI / lp.L * Math.sin(Math.PI * q.s / lp.L) ** 2, 0, prmAt(q.s / lp.L), tags, 'loop', { guide });
      }
      P = samples[samples.length - 1].p; grade = 0;
    } else if (type === 'CONNECT') {
      const tgt = typeof pc.to === 'object' ? { p: pc.to.p, psi: (pc.to.headingDeg ?? 0) * DEG, grade: pc.to.grade ?? 0 } : opts.targets?.[pc.to];
      if (!tgt) throw new Error(`CONNECT ${pc.id}: unknown target ${pc.to}`);
      if (len(sub(tgt.p, P)) < 1e-6 && Math.abs(wrapPi(tgt.psi - psi)) < 1e-9 && Math.abs(tgt.grade - grade) < 1e-9) return; // v0.7: already there, no zero-length connector
      const cp = connectPoints(P, psi, grade, tgt.p, tgt.psi, tgt.grade, ds, pc.stretch ?? 1.0);
      let prevPsi = psi;
      for (let i = first ? 0 : 1; i < cp.pts.length; i++) {
        const a = cp.pts[Math.max(0, i - 1)].p, b = cp.pts[Math.min(cp.pts.length - 1, i + 1)].p;
        const T = i === 0 ? headingT(psi, grade) : i === cp.pts.length - 1 ? headingT(tgt.psi, tgt.grade) : norm(sub(b, a));
        const ps = Math.atan2(-T[0], T[2]), hz = Math.hypot(cp.pts[i].p[0] - cp.pts[Math.max(0, i - 1)].p[0], cp.pts[i].p[2] - cp.pts[Math.max(0, i - 1)].p[2]);
        const kap = i > 0 && hz > 1e-9 ? wrapPi(ps - prevPsi) / hz : 0; prevPsi = ps;
        pushSample(cp.pts[i].p, T, kap, 0, pc.bankDeg != null ? pc.bankDeg * DEG : null, prmAt(cp.pts[i].u), tags, 'guide');
      }
      P = [...tgt.p]; psi = tgt.psi; grade = tgt.grade;
    } else {
      const gen = PIECES[type];
      if (!gen) throw new Error(`unknown piece type ${type}`);
      const g = gen(pc, { grade, prm: { ...cur }, psi });
      if (g.prm) pieceOverride = g.prm;
      if (g.tags) tags.push(...g.tags);
      const yFn = g.y ?? heightSchedule(pc, g.L);
      const n = Math.max(1, Math.round(g.L / ds)), h = g.L / n, y0 = P[1];
      const flatR = (a) => [-Math.cos(a), 0, -Math.sin(a)];       // driver's right of a heading, unbanked
      let Pax = [...P]; const lat0 = g.lat ? g.lat(0)[0] : 0;
      let prevPsiEff = null, prevXZ = null;
      const brkStart = g.breakAtStart || (pc.brk && !first);
      for (let i = first || brkStart ? 0 : 1; i <= n; i++) {
        if (i > 0) {
          const xm = (i - 0.5) * h, psiM = psi + g.kap(xm) * h / 2;
          Pax = [Pax[0] - Math.sin(psiM) * h, y0 + yFn(i / n)[0], Pax[2] + Math.cos(psiM) * h];
          psi = psiM + g.kap(xm) * h / 2;
        }
        const u = i / n, slope = yFn(u)[1];
        let p = Pax, T = headingT(psi, slope), kap = g.kap(u * g.L);
        if (g.lat) {
          const [lv, dl] = g.lat(u); const R0 = flatR(psi);
          p = add(Pax, mul(R0, lv - lat0));
          const hz = add([-Math.sin(psi), 0, Math.cos(psi)], mul(R0, dl / g.L));
          const hl = Math.hypot(hz[0], hz[2]); T = norm([hz[0] / hl, slope, hz[2] / hl]);
          const psiEff = Math.atan2(-T[0], T[2]);
          kap = prevPsiEff === null ? 0 : wrapPi(psiEff - prevPsiEff) / Math.max(Math.hypot(p[0] - prevXZ[0], p[2] - prevXZ[1]), 1e-9);
          prevPsiEff = psiEff; prevXZ = [p[0], p[2]];
        }
        const extra = { ...(g.designSpeed ? { designSpeed: g.designSpeed } : {}), ...(i === 0 && brkStart && !first ? { brk: true } : {}),
          ...(g.axis && !tags.includes('branch') ? { axisLat: g.axis(u) } : {}) };
        pushSample([...p], T, kap, 0, pc.bankDeg != null ? pc.bankDeg * DEG : (tags.includes('air') || g.flat ? 0 : null),
          prmAt(u), tags, 'guide', extra);
        grade = slope; P = p;
      }
      if (g.breakAtEnd) {
        const last = samples[samples.length - 1];
        const full = { ...prmAt(1), ...g.breakAtEnd };
        pushSample([...last.p], last.T, last.kapPlan, 0, last.bankExplicit, full, tags, 'guide', { brk: true });
        pieceOverride = () => g.breakAtEnd; // carry the full profile into the next piece
      }
    }
    { const e = prmAt(1); skin = e.__skin; Object.assign(cur, e); delete cur.__marking; delete cur.__skin; delete cur.__tun; delete cur.__drive; delete cur.noMark; }
    tun = tunB;
    if (pc.markings) marking = pc.markings;
  });

  // s along the final polyline; tangents for rmf samples
  samples[0].s = st0?.s ?? 0;
  for (let i = 1; i < samples.length; i++) samples[i].s = samples[i - 1].s + len(sub(samples[i].p, samples[i - 1].p));
  for (let i = 0; i < samples.length; i++) if (!samples[i].T) {
    const a = samples[Math.max(0, i - 1)].p, b = samples[Math.min(samples.length - 1, i + 1)].p; samples[i].T = norm(sub(b, a));
  }
  for (const j of joints) j.s = samples[Math.min(j.index, samples.length - 1)]?.s ?? 0;

  // bank: explicit > auto from plan curvature, smoothed, guide samples only
  const rawBank = samples.map((q) => q.law !== 'guide' ? 0 : q.bankExplicit ?? clamp(autoBank.gain * q.kapPlan, -autoBank.limitDeg * DEG, autoBank.limitDeg * DEG));
  const win = Math.round((opts.bankSmoothM ?? 24) / ds);
  const bank = rawBank.map((_, i) => {
    if (samples[i].law !== 'guide') return 0;
    let acc = 0, w = 0;
    for (let j = i - win; j <= i + win; j++) {
      if (j < 0 || j >= samples.length || samples[j].law !== 'guide') continue;
      const k = 1 - Math.abs(j - i) / (win + 1); acc += rawBank[j] * k; w += k;
    }
    return acc / w;
  });

  // frames: guide law or rotation-minimising (double reflection) with twist closure over each rmf run
  const guideUp = (T, b) => { const U = norm(sub([0, 1, 0], mul(T, T[1]))); return rot(U, T, b); };
  const frames = new Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const q = samples[i];
    if (q.law === 'guide') { const U = guideUp(q.T, bank[i]); frames[i] = { T: q.T, U, R: cross(q.T, U) }; continue; }
    if (q.law === 'loop') { const U = norm(sub(q.guide, mul(q.T, dot(q.T, q.guide)))); frames[i] = { T: q.T, U, R: cross(q.T, U) }; continue; }
    let j = i; while (j < samples.length && samples[j].law === 'rmf') j++;
    const prev = frames[i - 1] ?? { T: q.T, U: guideUp(q.T, 0) };
    let r = prev.U, x0 = samples[i - 1]?.p ?? q.p, t0 = prev.T;
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
    i = j - 1;
  }

  const stream = samples.map((q, i) => ({
    s: q.s, p: q.p, T: frames[i].T, U: frames[i].U, R: frames[i].R,
    kappa: q.law !== 'guide' ? q.kapV : q.kapPlan, bank: bank[i], grade: q.T[1] / (Math.hypot(q.T[0], q.T[2]) || 1e-9),
    law: q.law, tags: q.tags, prm: stripPrm(q.prm), marking: q.marking, skin: q.skin, slots: profileSlots(q.prm),
    ...(q.designSpeed ? { designSpeed: q.designSpeed } : {}), ...(q.brk ? { brk: true } : {}), ...(q.drive ? { drive: q.drive } : {}), ...(q.prm.noMark ? { noMark: true } : {}),
    ...(q.tun ? { tunnel: tunnelSection(q.tun, profileSlots(q.prm), q.axisLat != null ? profileSlots(q.prm).filter(([, y]) => y >= -0.4).map(([x, y]) => [2 * q.axisLat - x, y]) : []) } : {}),
  }));
  if (stream.some((q) => q.tunnel?.hall)) buildHalls(stream, samples);
  paintSkins(stream, opts.skinBlend ?? SKIN_BLEND);
  const out = { schema: 'kfb.track-core.stream/0.3', core: CORE_VERSION, id: recipe.id, ds, slots: SLOTS,
    joints: joints.map(({ index, piece, type, s }) => ({ index, piece, type, s })), samples: stream, markings: null };
  biomeMarkings(recipe, joints, stream);   // v0.11: after a zone the target biome's marking rhythm applies (piece markings still win)
  out.markings = paintMarkings(stream);
  { const tz = applyTransitions(recipe, joints, stream, out.markings); if (tz.transitions.length) { out.transitions = tz.transitions; out.markings = tz.markings; } }
  if (recipe.closed) out.closed = true;
  if (stream.some((q) => q.tunnel)) { out.tunnels = tunnelSegments(stream, joints); out.tunnelRings = ringPalette(stream); }
  if (recipe.hosts?.length) out.hosts = recipe.hosts;
  if (recipe.ground != null) out.ground = recipe.ground;  // circuit: the last sample is meant to coincide with the first (checked by `closure`)
  if (recipe.pads?.length) out.pads = recipe.pads.map(compilePad);
  // v0.9 pit boxes: pieces with `boxes: {count, side, depth, width}` emit box anchors beside the lane (garage scenery,
  // vehicle rigging lab later). Anchor frame = sample frame at the box centre; lat measured from the route centre line.
  const anchors = [];
  recipe.pieces.forEach((pc, idx) => {
    if (!pc.boxes) return; const j0 = joints[idx].index, j1 = idx + 1 < joints.length ? joints[idx + 1].index - 1 : stream.length - 1;
    const b = { count: 4, side: -1, depth: 14, width: 9, ...pc.boxes }, s0 = stream[j0].s, s1 = stream[j1].s;
    for (let k = 0; k < b.count; k++) { const sk = s0 + (s1 - s0) * (k + 0.5) / b.count; let q = stream[j0]; for (let i = j0; i <= j1; i++) if (Math.abs(stream[i].s - sk) < Math.abs(q.s - sk)) q = stream[i];
      const lat = q.prm.offset + b.side * (q.prm.width / 2 + 1.5 + b.depth / 2);
      anchors.push({ kind: 'pit_box', id: `${pc.id}_box${k + 1}`, piece: pc.id, s: +q.s.toFixed(3), side: b.side, lat: +lat.toFixed(3), size: [b.width, b.depth],
        p: add(q.p, mul(q.R, lat)).map((v) => +v.toFixed(4)), T: q.T, R: q.R, U: q.U }); }
  });
  if (anchors.length) out.anchors = anchors;
  out._joints = joints; // internal (graph compile); not part of the stream
  out.fingerprint = fingerprint(out);
  return out;
}
function stripPrm(p) { const o = {}; for (const k of Object.keys(PROFILE_DEFAULTS)) o[k] = +p[k].toFixed(4); return o; }

// ---------------------------------------------------------------- v0.11 transition zones (T3 transition grammar v1)
// A zone changes the biome of the track surroundings (track / city / nature / canyon / coast) over u = 0..1 along the
// driving direction. Every visual layer has its own window, so nothing switches at one cross line. The zone is DATA
// ONLY: drive surface, width, grade, frames, slots and checks stay exactly as without the zone (tested). Carriers:
// piece type TRANSITION (a straight, default 80 m) or `transition: {to, ...}` on any piece (the zone spans the piece).
// Per sample: q.zone = { id, from, to, u, w: {layer: 0..1} } (0 = still `from`, 1 = fully `to`); stream.transitions
// lists each zone with windows, seeds and the socket frames of the transition contract.
export const TRANSITION = Object.freeze({ length: 80, minLength: 60, maxLength: 100 });
export const BIOMES = Object.freeze(['track', 'city', 'nature', 'canyon', 'coast']);
export const TRANSITION_LAYERS = Object.freeze(['surface', 'markings', 'barrier', 'pit', 'curb', 'nature', 'props', 'light', 'vfx']);
// windows [a, b] on u. Leaving the track: the barrier goes first, props last. Returning to the track (grammar family C)
// is not the mirror: props and edges clear first, the Knetstrang gathers the edge masses, markings come last.
export const TRANSITION_WINDOWS = Object.freeze({
  leave:  { surface: [0.05, 0.72], markings: [0.10, 0.82], barrier: [0.00, 0.55], pit: [0.15, 0.88], curb: [0.28, 1.00], nature: [0.35, 1.00], props: [0.45, 1.00], light: [0.15, 0.90], vfx: [0.42, 0.58] },
  enter:  { props: [0.00, 0.40], nature: [0.05, 0.55], curb: [0.10, 0.62], pit: [0.12, 0.85], surface: [0.25, 0.85], barrier: [0.30, 0.95], light: [0.10, 0.85], vfx: [0.42, 0.58], markings: [0.45, 1.00] },
  across: { surface: [0.10, 0.80], markings: [0.15, 0.85], barrier: [0.05, 0.60], pit: [0.05, 0.70], curb: [0.28, 0.98], nature: [0.25, 1.00], props: [0.40, 1.00], light: [0.15, 0.90], vfx: [0.42, 0.58] },
});
// target marking rhythm per biome (the marking layer rebuilds these as segments; the drive surface is untouched)
export const BIOME_MARKINGS = Object.freeze({ track: 'TRACK', city: 'STREET', nature: 'NONE', canyon: 'NONE', coast: 'NONE' });
const hash32 = (str) => { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
export function zoneSeeds(seed) {   // one zone seed -> separate reproducible role seeds (grammar: biome / seed contract)
  const roles = ['trackPalette', 'terrainPalette', 'k2Profile', 'light', 'vfx', 'wfc'];
  return Object.fromEntries(roles.map((k) => [k, hash32(`${seed}:${k}`)]));
}
function zoneList(recipe, joints, stream) {
  const zones = []; let biome = recipe.defaults?.biome ?? 'track';
  recipe.pieces.forEach((pc, idx) => {
    const spec = pc.type === 'TRANSITION' ? { to: pc.to, ...(pc.transition ?? {}) } : pc.transition;
    if (!spec || !spec.to) return;
    const i0 = Math.max(0, joints[idx].index - 1), i1 = idx + 1 < joints.length ? joints[idx + 1].index - 1 : stream.length - 1;
    zones.push({ idx, i0, i1, from: biome, to: spec.to }); biome = spec.to;
  });
  return zones;
}
function biomeMarkings(recipe, joints, stream) {
  const zs = zoneList(recipe, joints, stream); if (!zs.length) return;
  const explicit = new Set(); recipe.pieces.forEach((pc, idx) => { if (pc.markings) { const i1 = idx + 1 < joints.length ? joints[idx + 1].index : stream.length; for (let i = joints[idx].index; i < i1; i++) explicit.add(i); } });
  let k = 0, cur = null;
  for (let i = 0; i < stream.length; i++) {
    while (k < zs.length && i > zs[k].i1) { cur = zs[k].to; k++; }
    if (cur && cur !== 'track' && !(k < zs.length && i >= zs[k].i0) && !explicit.has(i)) stream[i].marking = BIOME_MARKINGS[cur];
  }
}
function applyTransitions(recipe, joints, stream, bands) {
  const zones = [];
  let biome = recipe.defaults?.biome ?? 'track';
  recipe.pieces.forEach((pc, idx) => {
    const spec = pc.type === 'TRANSITION' ? { to: pc.to, ...(pc.transition ?? {}) } : pc.transition;
    if (!spec || !spec.to) return;
    const to = spec.to; if (!BIOMES.includes(to)) throw new Error(`transition ${pc.id}: unknown biome ${to}`);
    const i0 = Math.max(0, joints[idx].index - 1), i1 = idx + 1 < joints.length ? joints[idx + 1].index - 1 : stream.length - 1;   // i0: the joint point itself
    const from = biome, kind = from === 'track' ? 'leave' : to === 'track' ? 'enter' : 'across';
    const windows = { ...TRANSITION_WINDOWS[kind], ...(spec.windows ?? {}) };
    const seed = spec.seed ?? `${recipe.id ?? 'route'}:${pc.id ?? idx}`;
    zones.push({ id: pc.id ?? `transition_${idx}`, from, to, kind, i0, i1, s0: stream[i0].s, s1: stream[i1].s, windows, seed, seeds: zoneSeeds(seed) });
    biome = to;
  });
  if (!zones.length) { if (recipe.defaults?.biome && recipe.defaults.biome !== 'track') for (const q of stream) q.biome = recipe.defaults.biome; return { transitions: [], markings: bands }; }
  // per-sample zone state; biome outside zones
  let cur = recipe.defaults?.biome ?? 'track', zi = 0;
  for (let i = 0; i < stream.length; i++) {
    const q = stream[i];
    while (zi < zones.length && i > zones[zi].i1) { cur = zones[zi].to; zi++; }
    const z = zones[zi];
    if (z && i >= z.i0 && i <= z.i1) {
      const u = (q.s - z.s0) / Math.max(z.s1 - z.s0, 1e-9);
      const w = {}; for (const k of TRANSITION_LAYERS) { const [a, b] = z.windows[k]; w[k] = +smootherstep((u - a) / Math.max(b - a, 1e-9)).toFixed(4); }
      q.zone = { id: z.id, from: z.from, to: z.to, u: +u.toFixed(4), w };
    } else q.biome = cur;
  }
  // markings: outside zones unchanged; inside, the old rhythm breaks into staggered clay segments that shrink away and
  // the target rhythm assembles from short segments (no alpha fade, no single switch line)
  const out = [];
  for (const b of bands) {   // cut every band at the zone borders
    let pieces = [[b.s0, b.s1]];
    for (const z of zones) pieces = pieces.flatMap(([a, c]) => (c <= z.s0 || a >= z.s1 ? [[a, c]] : [a < z.s0 ? [a, z.s0] : null, c > z.s1 ? [z.s1, c] : null].filter(Boolean)));
    for (const [a, c] of pieces) { const nearZone = zones.some((z) => Math.abs(a - z.s1) < 1.01 || Math.abs(c - z.s0) < 1.01);
      if (c - a > 1e-6 && !(nearZone && c - a < 0.6)) out.push({ ...b, s0: a, s1: c }); }   // no slivers next to a zone border
  }
  const wAt = (z, s) => { const u = (s - z.s0) / Math.max(z.s1 - z.s0, 1e-9), [a, b] = z.windows.markings; return smootherstep((u - a) / Math.max(b - a, 1e-9)); };
  for (const z of zones) {
    const src = MARKING_STYLES[BIOME_MARKINGS[z.from]] ?? [], dst = MARKING_STYLES[BIOME_MARKINGS[z.to]] ?? [];
    const lines = [...src.map((m) => ({ m, dir: -1, style: BIOME_MARKINGS[z.from] })), ...dst.map((m) => ({ m, dir: 1, style: BIOME_MARKINGS[z.to] }))];
    for (const { m, dir, style } of lines) {
      if (m.at === 'bars') continue;
      for (const side of m.at === 'edges' ? [-1, 1] : [0]) {
        const P = m.dash ? m.dash + m.gap : 6.0, phase = (side === 1 ? 0.5 : side === -1 ? 0 : 0.25) * P + (dir > 0 ? 0.33 * P : 0);
        for (let s = z.s0 - phase; s < z.s1; s += P) {
          const sm = Math.max(s, z.s0), w = wAt(z, sm + P / 2);
          // leaving rhythm: full until its part of the window, then segments shorten; target: grows from short segments
          const k = dir < 0 ? clamp01(1 - w / 0.65) : clamp01((w - 0.35) / 0.65);
          if (k <= 0) continue;
          const duty = m.dash ? m.dash / P : 1, len = P * duty * k, a = Math.max(s + (P * duty - len) / 2, z.s0), c = Math.min(a + len, z.s1);
          if (c - a < 0.6) continue;   // no slivers: a segment is a real clay piece
          out.push({ style, id: m.id, at: m.at, inset: m.inset ?? 0, side, s0: +a.toFixed(3), s1: +c.toFixed(3), w: m.w, span: null, barLen: null, zone: z.id, seg: dir < 0 ? 'out' : 'in' });
        }
      }
    }
  }
  out.sort((x, y) => x.s0 - y.s0);
  // sockets of the transition contract: frames at the zone start and end, lateral positions from the (unchanged) profile
  const lat = (q, name) => q.slots[SLOTS.indexOf(name)][0];
  const P3 = (q, l, h = 0) => add(add(q.p, mul(q.R, l)), mul(q.U, h)).map((v) => +v.toFixed(4));
  const frame = (q) => ({ forward: q.T.map((v) => +v.toFixed(5)), up: q.U.map((v) => +v.toFixed(5)), right: q.R.map((v) => +v.toFixed(5)) });
  const socketsAt = (q, tag) => {
    const o = {}; o[`centerline_${tag}`] = { p: P3(q, q.prm.offset), ...frame(q) };
    for (const [S, side] of [['left', 'L'], ['right', 'R']]) {
      const sg = side === 'L' ? -1 : 1, edge = lat(q, 'road_' + side), bo = lat(q, 'barrier_out_top_' + side), bi = lat(q, 'barrier_in_bot_' + side);
      o[`surface_${S}_${tag}`] = { p: P3(q, edge) };
      o[`barrier_${S}_${tag}`] = { p: P3(q, (bi + bo) / 2, q.slots[SLOTS.indexOf('barrier_in_bot_' + side)][1]) };   // base of the barrier, centre
      o[`curb_${S}_${tag}`] = { p: P3(q, edge + sg * 0.5) };
      o[`sidewalk_${S}_${tag}`] = { p: P3(q, edge + sg * (SIDE_EXTENT / 2 + 0.5)) };
      o[`nature_${S}_${tag}`] = { p: P3(q, bo + sg * 2.0) };
    }
    return o;
  };
  const transitions = zones.map((z) => {
    const qa = stream[z.i0], qb = stream[z.i1], pit = stream.slice(z.i0, z.i1 + 1).some((q) => q.tags.includes('pit'));
    return { id: z.id, from: z.from, to: z.to, kind: z.kind, s0: +z.s0.toFixed(3), s1: +z.s1.toFixed(3), length: +(z.s1 - z.s0).toFixed(3), windows: z.windows,
      seed: z.seed, seeds: z.seeds, markings: { from: BIOME_MARKINGS[z.from], to: BIOME_MARKINGS[z.to] },
      sockets: { ...socketsAt(qa, 'in'), ...socketsAt(qb, 'out'), pit_in: pit ? 'see pit module' : null, pit_out: pit ? 'see pit module' : null },
      contact: 'unchanged: drive surface, width, grade, frames and barrier slots are the route profile (Track Core owner)' };
  });
  return { transitions, markings: out };
}

// ---------------------------------------------------------------- v0.6 pads: free practice areas beside / around a route
// pad = { id, center: [x, z] (runtime), y, size: [length along heading, width], headingDeg, radius (corner), kind,
//         stations: [{type: 'cones', pts: [[u, v]...]} | {type: 'parking_box', at: [u, v], size: [l, w], headingDeg}
//                    | {type: 'brake_line', from: [u, v], to: [u, v]} | {type: 'sign', at: [u, v], text}] }
// u along the pad heading, v to its right, both in metres from the centre. The route may run through the pad (guide line);
// inside the pad the player drives free. Output: world outline (rounded rectangle) + stations in world coordinates.
export function padFrame(pad) {
  const psi = (pad.headingDeg ?? 0) * DEG, T = [-Math.sin(psi), 0, Math.cos(psi)], R = [-Math.cos(psi), 0, -Math.sin(psi)];
  const c = [pad.center[0], pad.y, pad.center[1]];
  return { T, R, at: ([u, v]) => add(add(c, mul(T, u)), mul(R, v)) };
}
function compilePad(pad) {
  const F = padFrame(pad), [L, W] = pad.size, r = Math.min(pad.radius ?? 8, L / 2, W / 2), n = 8, outline = [];
  const corners = [[L / 2 - r, W / 2 - r, 0], [-L / 2 + r, W / 2 - r, 90], [-L / 2 + r, -W / 2 + r, 180], [L / 2 - r, -W / 2 + r, 270]];
  for (const [cu, cv, a0] of corners) for (let k = 0; k <= n; k++) { const a = (a0 + 90 * k / n) * DEG; outline.push(F.at([cu + r * Math.cos(a), cv + r * Math.sin(a)])); }
  const st = (pad.stations ?? []).map((x) => {
    if (x.type === 'cones') return { type: 'cones', pts: x.pts.map((q) => F.at(q)) };
    if (x.type === 'parking_box') { const h = ((x.headingDeg ?? 0) + (pad.headingDeg ?? 0)) * DEG, [l, w] = x.size, T = [-Math.sin(h), 0, Math.cos(h)], Rr = [-Math.cos(h), 0, -Math.sin(h)], c = F.at(x.at);
      return { type: 'parking_box', corners: [[l / 2, w / 2], [-l / 2, w / 2], [-l / 2, -w / 2], [l / 2, -w / 2]].map(([a, b]) => add(add(c, mul(T, a)), mul(Rr, b))) }; }
    if (x.type === 'brake_line') return { type: 'brake_line', from: F.at(x.from), to: F.at(x.to) };
    return { ...x, at: x.at ? F.at(x.at) : undefined };
  });
  return { id: pad.id, kind: pad.kind ?? 'practice', y: pad.y, outline, stations: st, drive: pad.drive ?? { mode: 'free' } };
}
const inPoly = (x, z, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
  const [xi, , zi] = poly[i], [xj, , zj] = poly[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };

// v0.6 switch (Weiche) macros: FORK = WIDTH_STEP to the full width + SPLIT_HALF (branch leaves with its own full lane);
// JOIN = MERGE_HALF + WIDTH_STEP back. Built only from tested pieces; branches name the FORK / JOIN id as usual.
export function expandMacros(pieces) {
  return pieces.flatMap((pc) => {
    if (pc.type === 'FORK') return [
      { id: `${pc.id}_widen`, type: 'WIDTH_STEP', length: pc.widen ?? 30, widthTo: pc.fullWidth, tags: [...(pc.tags ?? []), 'switch'] },
      { ...pc, type: 'SPLIT_HALF', length: pc.length ?? 60, tags: [...(pc.tags ?? []), 'switch'] }];
    if (pc.type === 'JOIN') return [
      { ...pc, type: 'MERGE_HALF', length: pc.length ?? 60, tags: [...(pc.tags ?? []), 'switch'] },
      { id: `${pc.id}_narrow`, type: 'WIDTH_STEP', length: pc.narrow ?? 30, widthTo: pc.narrowTo, tags: [...(pc.tags ?? []), 'switch'] }];
    return [pc];
  });
}

// ---------------------------------------------------------------- compile a route graph (main + branches)
// graph = { schema, id, ds, defaults, routes: [ {id, start?, pieces, from?: {route, piece}, to?: {route, piece}} ] }
// A branch `from` a SPLIT_HALF piece starts on the same axis with the mirrored lane; a branch `to` a MERGE_HALF piece
// gets a CONNECT onto that piece's start frame plus the mirrored MERGE_HALF. Routes must be listed parent-first.
// v0.10 junction modules, after the Track Architecture Concept (27.09): one shared deck, the main line is sacred, every
// barrier run has designed ends, paint and gore tell the story. PIT_LANE and WEICHE are graph macros. The main route keeps
// width and line; on the junction side its kerb + barrier step off (hard break, no sinking) exactly where the branch starts
// 0.05 m wide at the main edge, so the branch's outer kerb + barrier continue the main ones without a seam. Between the
// lanes the deck is filled (gore, hatched). compileGraph emits the module geometry in g.deck = { zones, furniture }.
export const PIT = Object.freeze({ taper: 80, gore: 5.0, lane: 7.2, run: 12, wall: 1.0, wallH: 1.2, cushionR: 1.0, apron: 7.2, garageD: 12, garageH: 5 });
export const WEICHE = Object.freeze({ taper: 80, sep: 10.2, cushionR: 1.2 });
const W0 = 0.05; // start / end width of a branch lane at the main edge
export function expandPitLanes(graph) {
  const routes = [], modules = [...(graph.modules ?? [])];
  for (const r of graph.routes) {
    const pieces = [], branches = [];
    for (const pc of r.pieces) {
      if (pc.type !== 'PIT_LANE' && pc.type !== 'WEICHE') { pieces.push(pc); continue; }
      const id = pc.id ?? (pc.type === 'PIT_LANE' ? 'pit' : 'weiche'), side = pc.side ?? -1;
      const P = side < 0 ? 'L' : 'R', I = side < 0 ? 'R' : 'L';            // P: junction side of the main road; I: inner side of the branch
      const bare = (X) => ({ ['side' + X]: 0, ['barrierVis' + X]: 0 }), full = (X) => ({ ['side' + X]: 1, ['barrierVis' + X]: 1 });
      if (pc.type === 'PIT_LANE') {
        const lane = WIDTHS[pc.laneWidth] ?? pc.laneWidth ?? PIT.lane, n = pc.boxes ?? 4, L = pc.length ?? 120, gore = pc.gap ?? PIT.gore, Lt = pc.taper ?? PIT.taper, Lr = PIT.run;
        const J = ['pit', 'pit_junction', 'deck_shared'], drive = { mode: 'assist', fx: ['pit_limiter'] }, tags = ['pit', 'deck_shared', ...(pc.tags ?? [])];
        pieces.push({ id: `${id}_div`, type: 'STRAIGHT', length: Lt, brk: true, tags: [...J, 'pit_diverge'], pit: { side, lane }, params: bare(P) });
        pieces.push({ id: `${id}_main`, type: 'STRAIGHT', length: 2 * Lr + L, tags: ['pit', 'deck_shared'] });
        pieces.push({ id: `${id}_conv`, type: 'STRAIGHT', length: Lt, tags: J });
        pieces.push({ id: `${id}_close`, type: 'STRAIGHT', length: 2, brk: true, tags: ['pit'], params: full(P) });
        const off = side * (lane / 2 + W0 / 2 + gore);
        branches.push({ id, from: { route: r.id, piece: `${id}_div` }, defaults: pc.markings ? { markings: pc.markings } : {}, pieces: [
          { id: `${id}_in`, type: 'STRAIGHT', length: Lt, drive, tags: [...tags, 'pit_junction'], params: {
            width: { to: lane, ease: 'smootherstep' }, offset: { to: off, ease: 'smootherstep' } } },
          { id: `${id}_run1`, type: 'STRAIGHT', length: Lr, drive, tags },
          { id: `${id}_boxes`, type: 'STRAIGHT', length: L, brk: true, params: bare(P), boxes: { count: n, side, width: L / n, depth: PIT.apron }, drive, tags: [...tags, 'pit_boxes'] },
          { id: `${id}_run2`, type: 'STRAIGHT', length: Lr, brk: true, params: full(P), drive, tags },
          { id: `${id}_out`, type: 'STRAIGHT', length: Lt, drive, tags: [...tags, 'pit_junction'], params: {
            width: { to: W0, ease: 'smootherstep' }, offset: { to: 0, ease: 'smootherstep' } } }] });
        modules.push({ kind: 'pit', id, side, main: r.id, branch: id, gore, lane, boxes: n, boxLen: L });
      } else {
        const Lt = pc.taper ?? pc.length ?? WEICHE.taper, sep = pc.sep ?? WEICHE.sep;
        const W = WIDTHS[pc.branchWidth] ?? pc.branchWidth ?? null;   // null = same width as the main lane at the fork
        const then = pc.then ?? [{ id: `${id}_lane`, type: 'STRAIGHT', length: pc.branchLength ?? 150 }];
        pieces.push({ id: `${id}_div`, type: 'STRAIGHT', length: Lt, brk: true, tags: ['switch', 'weiche', 'deck_shared', 'pit_junction'], pit: { side, lane: W, weiche: true }, params: bare(P) });
        pieces.push({ id: `${id}_nose`, type: 'STRAIGHT', length: 2, brk: true, tags: ['switch', 'weiche'], params: full(P) });
        branches.push({ id, from: { route: r.id, piece: `${id}_div` }, defaults: pc.markings ? { markings: pc.markings } : {}, pieces: [
          { id: `${id}_in`, type: 'STRAIGHT', length: Lt, tags: ['switch', 'weiche', 'deck_shared', 'pit_junction', ...(pc.tags ?? [])], params: {
            width: { to: W ?? '__main', ease: 'smootherstep' }, offset: { to: `__off:${sep}`, ease: 'smootherstep' } } },
          { id: `${id}_nose`, type: 'STRAIGHT', length: 2, brk: true, tags: ['switch', 'weiche'], params: full(I) },
          ...then] });
        modules.push({ kind: 'weiche', id, side, main: r.id, branch: id, sep });
      }
    }
    routes.push({ ...r, pieces }, ...branches);
  }
  return { ...graph, routes, modules };
}

// v0.10 deck layer for the junction modules: gore fill between the lanes, pit wall with cushions, box apron, garages,
// box marks, barrier caps at the pit building, U barrier + cushion at a Weiche nose. Pure data in world coordinates.
function moduleDeck(g, graph) {
  const zones = [], furniture = [];
  const edge = (q, sd) => add(q.p, mul(q.R, q.prm.offset + sd * q.prm.width / 2));
  const lat = (q, l, h = 0) => add(add(q.p, mul(q.R, l)), mul(q.U, h));
  const r3 = (v) => v.map((x) => +x.toFixed(4));
  for (const m of graph.modules ?? []) {
    const M = g.routes[m.main]?.samples, B = g.routes[m.branch]?.samples; if (!M || !B) continue;
    const sd = m.side, inB = -sd;              // branch inner side = towards the main road
    const Bm = B.filter((q) => q.tags.includes('pit_junction') || q.tags.includes('pit') || q.tags.includes('weiche'));
    // gore rows: branch inner edge -> nearest main edge (local search, both are near-parallel by design)
    let j = 0; const rows = [];
    const nearest = (p) => { let best = Infinity, bi = j; for (let k = Math.max(0, j - 20); k < Math.min(M.length, j + 400); k++) { const d = len(sub(M[k].p, p)); if (d < best) { best = d; bi = k; } } j = bi; return M[bi]; };
    const upto = m.kind === 'weiche' ? Bm.filter((q) => q.tags.includes('weiche') && !q.brk && q.tags.includes('pit_junction')) : Bm;
    for (const q of upto) { const b = edge(q, inB), qm = nearest(b), a = edge(qm, sd); rows.push({ s: q.s, a, b, gap: len(sub(b, a)), qm, q }); }
    if (rows.length > 1) zones.push({ kind: 'gore', module: m.id, depth: PROFILE_DEFAULTS.deckDepth, rows: rows.map((w) => [r3(w.a), r3(w.b)]), U: r3(rows[0].q.U) });
    if (m.kind === 'pit') {
      // pit wall on the gore centre where the gore is (nearly) full width, a cushion in front of each end
      const wr = rows.filter((w) => w.gap >= 0.92 * m.gore);
      if (wr.length > 1) {
        const pts = wr.map((w) => r3(mul(add(w.a, w.b), 0.5)));
        furniture.push({ kind: 'wall', module: m.id, pts, w: PIT.wall, h: PIT.wallH, U: r3(wr[0].q.U) });
        for (const [k, dir] of [[0, -1], [wr.length - 1, 1]]) { const w = wr[k]; const c = mul(add(w.a, w.b), 0.5);
          furniture.push({ kind: 'cushion', module: m.id, p: r3(add(c, mul(w.q.T, dir * (PIT.cushionR + 0.2)))), r: PIT.cushionR, h: 1.0 }); }
      }
      // box apron + garage plinth on the outer side of the boxes run; garages; box marks; barrier caps at the building
      const BX = B.filter((q) => q.tags.includes('pit_boxes') && !q.brk);
      if (BX.length > 1) {
        const depth = PIT.apron + PIT.garageD + 1.0;
        zones.push({ kind: 'apron', module: m.id, depth: PROFILE_DEFAULTS.deckDepth, rows: BX.map((q) => [r3(edge(q, sd)), r3(lat(q, q.prm.offset + sd * (q.prm.width / 2 + depth)))]), U: r3(BX[0].U) });
        // deck plinth: the building's deck rounds out of the barrier line over the run before and after the boxes
        const ext = SIDE_EXTENT, ss = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
        for (const [lo, hi, rev] of [[BX[0].s - PIT.run, BX[0].s, false], [BX[BX.length - 1].s, BX[BX.length - 1].s + PIT.run, true]]) {
          const Q = B.filter((q) => q.s >= lo - 1e-6 && q.s <= hi + 1e-6 && !q.brk && !q.tags.includes('pit_boxes'));
          const QQ = rev ? Q : Q; if (QQ.length < 2) continue;
          zones.push({ kind: 'plinth', module: m.id, depth: PROFILE_DEFAULTS.deckDepth, rows: QQ.map((q) => { const t = rev ? (hi - q.s) / PIT.run : (q.s - lo) / PIT.run;
            const w = ext + 0.02 + (depth - ext) * ss(Math.sqrt(t));
            return [r3(edge(q, sd).map((v, i) => v + q.R[i] * sd * (ext - 0.02))), r3(edge(q, sd).map((v, i) => v + q.R[i] * sd * w))]; }), U: r3(QQ[0].U) });
        }
        const q0 = BX[0], q1 = BX[BX.length - 1], n = m.boxes, s0 = q0.s, s1 = q1.s;
        const at = (s) => BX.reduce((a, q) => (Math.abs(q.s - s) < Math.abs(a.s - s) ? q : a), q0);
        const e0 = q0.prm.width / 2;
        for (let k = 0; k < n; k++) {
          const sa = s0 + (s1 - s0) * k / n, sb = s0 + (s1 - s0) * (k + 1) / n, qa = at(sa), qb = at(sb), o = q0.prm.offset;
          const c = (q, l) => r3(lat(q, o + sd * l));
          furniture.push({ kind: 'boxmark', module: m.id, quad: [c(qa, e0 + 0.6), c(qb, e0 + 0.6), c(qb, e0 + PIT.apron - 0.6), c(qa, e0 + PIT.apron - 0.6)].map((p, i) => i < 2 || i > 3 ? p : p), inset: 0.6 });
          furniture.push({ kind: 'garage', module: m.id, base: [c(qa, e0 + PIT.apron), c(qb, e0 + PIT.apron), c(qb, e0 + PIT.apron + PIT.garageD), c(qa, e0 + PIT.apron + PIT.garageD)], h: PIT.garageH, door: sd, U: r3(q0.U) });
        }
        // the outer barrier stops at the building corners: round caps (half cylinders) facing along the lane
        const pbi = PROFILE_DEFAULTS.shoulderW + PROFILE_DEFAULTS.barrierGap, pbo = pbi + PROFILE_DEFAULTS.barrierT;
        const capAt = (q, dir) => furniture.push({ kind: 'cap', module: m.id, p: r3(lat(q, q.prm.offset + sd * (q.prm.width / 2 + (pbi + pbo) / 2), -PROFILE_DEFAULTS.shoulderDrop)),
          T: r3(mul(q.T, dir)), R: r3(q.R), U: r3(q.U), r: PROFILE_DEFAULTS.barrierT / 2, h: PROFILE_DEFAULTS.barrierH + PROFILE_DEFAULTS.shoulderDrop, hOut: PROFILE_DEFAULTS.barrierOuterTop + PROFILE_DEFAULTS.shoulderDrop, sd });
        const iB = B.indexOf(BX[0]); capAt(B[iB - 2] ?? BX[0], 1);
        const iE = B.indexOf(BX[BX.length - 1]); const qE = B.find((q, i) => i > iE && q.brk) ?? BX[BX.length - 1]; capAt(qE, -1);
      }
    } else {
      // Weiche nose: one barrier wraps the split as a U; a cushion in front
      const nb = B.find((q) => q.brk && q.tags.includes('weiche')), nm = M.find((q) => q.brk && q.tags.includes('weiche') && q.s > (rows[0]?.qm.s ?? 0));
      if (nb && nm) {
        const mid = (PROFILE_DEFAULTS.shoulderW + PROFILE_DEFAULTS.barrierGap + PROFILE_DEFAULTS.barrierT / 2);
        const pa = lat(nm, nm.prm.offset + sd * (nm.prm.width / 2 + mid)), pb = lat(nb, nb.prm.offset + inB * (nb.prm.width / 2 + mid));
        const c = mul(add(pa, pb), 0.5), rad = len(sub(pb, pa)) / 2;
        furniture.push({ kind: 'uturn', module: m.id, c: r3(c), from: r3(sub(pa, c)), T: r3(mul(nm.T, -1)), U: r3(nm.U), r: +rad.toFixed(4), t: PROFILE_DEFAULTS.barrierT,
          base: -PROFILE_DEFAULTS.shoulderDrop, hIn: PROFILE_DEFAULTS.barrierH, hOut: PROFILE_DEFAULTS.barrierOuterTop });
        furniture.push({ kind: 'cushion', module: m.id, p: r3(add(c, mul(nm.T, -(rad + PROFILE_DEFAULTS.barrierT / 2 + WEICHE.cushionR + 0.3)))), r: WEICHE.cushionR, h: 1.1 });
      }
    }
  }
  return { zones, furniture };
}

export function compileGraph(graph, opts = {}) {
  graph = expandNodes(graph);
  graph = expandPitLanes(graph);
  graph = { ...graph, routes: graph.routes.map((r) => ({ ...r, pieces: expandMacros(r.pieces) })) };
  const out = {}; const order = [];
  // v0.12 junction nodes: free-standing ones now, anchored ones right after their route has compiled
  const built = new Map(), targets = { ...(opts.targets ?? {}) }, chains = {};
  const place = (nd, C, psi, arriving, biome) => {
    const sol = solveRoundabout({ ...nd.spec, biome: nd.spec.biome ?? biome }, arriving), nb = placeRoundabout(sol, C, psi);
    nb.enter = sol.arms.find((a) => a.k === sol.enter)?.id ?? null; nb.exit = sol.arms.find((a) => a.k === sol.exit)?.id ?? null;
    built.set(nd.id, nb);
    for (const a of nb.arms) targets[`${nd.id}/${a.id}`] = { p: a.socket.p, psi: a.psi + Math.PI, grade: 0 };
    return nb;
  };
  for (const nd of graph.nodes ?? []) if (!nd.anchor) place(nd, nd.center ?? [0, 0, 0], (nd.headingDeg ?? 0) * DEG, WIDTHS[graph.defaults?.widthClass] ?? null, nd.biome ?? graph.defaults?.biome);
  const socketOf = (sk) => {
    const ref = typeof sk === 'string' ? { node: sk.split('/')[0], arm: sk.split('/')[1], at: 'socket' } : sk;
    const nb = built.get(ref.node); if (!nb) throw new Error(`socket ${JSON.stringify(sk)}: node ${ref.node} is not placed yet (list its route first)`);
    const a = nb.arms.find((x) => x.k === ref.arm || x.id === ref.arm); if (!a) throw new Error(`socket ${JSON.stringify(sk)}: node ${ref.node} has no arm ${ref.arm}`);
    return { nb, a, fr: ref.at === 'mouth' ? a.mouth : a.socket };
  };
  for (const r of graph.routes) {
    const rec = { id: `${graph.id}/${r.id}`, ds: graph.ds, defaults: { ...(graph.defaults ?? {}), ...(r.defaults ?? {}) }, start: r.start, pieces: [...r.pieces], closed: r.closed, hosts: graph.hosts, ground: graph.ground };
    const o = { ...opts, targets };
    if (r.start?.socket) {
      const { nb, a, fr } = socketOf(r.start.socket);
      rec.defaults = { ...rec.defaults, biome: r.defaults?.biome ?? nb.biome, markings: r.defaults?.markings ?? BIOME_MARKINGS[nb.biome] ?? 'TRACK' };
      const prev = r.after ? out[nb.anchorRoute] : null, s0 = prev && nb.main ? prev.samples[prev.samples.length - 1].s + nb.main.length : 0;
      if (r.after) { const ch = chains[r.chainOf] ?? (chains[r.chainOf] = [{ route: r.chainOf }]); ch.push({ node: nb.id, path: 'main', s0: s0 - nb.main.length, s1: s0 }, { route: r.id }); }
      o.startState = { p: fr.p, psi: a.psi, grade: 0, prm: { ...PROFILE_DEFAULTS, ...(graph.defaults?.profile ?? {}), width: a.width }, marking: rec.defaults.markings, s: s0 };
      out[r.id] = compileRecipe(rec, o); order.push(r.id); placeAnchored(r); continue;
    }
    if (r.from) {
      const parent = out[r.from.route]; const j = parent?._joints.find((x) => x.piece === r.from.piece);
      const spl = graph.routes.find((x) => x.id === r.from.route)?.pieces.find((x) => x.id === r.from.piece);
      if (j && spl?.pit) {   // v0.10 pit lane / Weiche branch: starts W0 wide right at the main road's edge on that side
        const { side } = spl.pit, Rf = [-Math.cos(j.psi), 0, -Math.sin(j.psi)], I = side < 0 ? 'R' : 'L';
        const lat = j.prm.offset + side * (j.prm.width / 2 - W0 / 2);   // outer edge flush with the main edge: the outer barrier continues
        for (const pc of rec.pieces) for (const t of Object.values(pc.params ?? {})) {   // resolve width tokens against the main lane
          if (t && t.to === '__main') t.to = j.prm.width;
          if (t && typeof t.to === 'string' && t.to.startsWith('__off:')) { const sep = +t.to.slice(6), Wb = rec.pieces[0].params.width.to; t.to = side * (Wb / 2 + W0 / 2 + sep); }
        }
        o.startState = { p: add(j.p, mul(Rf, lat)), psi: j.psi, grade: j.grade, marking: r.defaults?.markings ?? j.marking, skin: r.defaults?.markings ? undefined : j.skin, tun: j.tun, tubeNo: (j.tubeNo ?? 0) + 1000,
          prm: { ...PROFILE_DEFAULTS, width: W0, offset: 0, ['side' + I]: 0, ['barrierVis' + I]: 0 }, s: parent.samples[j.index]?.s ?? 0 };
        out[r.id] = compileRecipe(rec, o); order.push(r.id); continue;
      }
      if (!j || j.type !== 'SPLIT_HALF') throw new Error(`route ${r.id}: from must name a SPLIT_HALF piece of an earlier route`);
      o.startState = { p: j.p, psi: j.psi, grade: j.grade, prm: j.prm, marking: j.marking, skin: j.skin, tun: j.tun, tubeNo: (j.tubeNo ?? 0) + 1000, s: parent.samples[j.index - 1]?.s ?? 0 };
      rec.pieces.unshift({ ...spl, id: `${r.id}_split`, keep: -(spl.keep ?? 1), tags: [...(spl.tags ?? []), 'branch'] });
    }
    if (r.to) {
      const parent = out[r.to.route]; const j = parent?._joints.find((x) => x.piece === r.to.piece);
      if (!j || j.type !== 'MERGE_HALF') throw new Error(`route ${r.id}: to must name a MERGE_HALF piece of an earlier route`);
      const mg = graph.routes.find((x) => x.id === r.to.route).pieces.find((x) => x.id === r.to.piece);
      const kk = mg.keep ?? 1, sepm = SIDE_EXTENT + (mg.gore ?? 1.0) / 2, Wh = j.prm.width;
      const Rf = [-Math.cos(j.psi), 0, -Math.sin(j.psi)];
      o.targets = { ...(o.targets ?? {}), [`${r.id}__merge`]: { p: add(j.p, mul(Rf, -kk * (Wh + 2 * sepm))), psi: j.psi, grade: j.grade } };
      rec.pieces.push({ type: 'CONNECT', id: `${r.id}_connect`, to: `${r.id}__merge`, stretch: r.to.stretch });
      rec.pieces.push({ ...mg, id: `${r.id}_merge`, keep: -(mg.keep ?? 1), branchEnd: true, tags: [...(mg.tags ?? []), 'branch'] });
    }
    out[r.id] = compileRecipe(rec, o); order.push(r.id); placeAnchored(r);
  }
  function placeAnchored(r) {
    for (const nd of graph.nodes ?? []) { if (nd.anchor?.route !== r.id) continue;
      const S = out[r.id].samples, q = S[S.length - 1], psi = Math.atan2(-q.T[0], q.T[2]);
      const probe = solveRoundabout(nd.spec, q.prm.width), A0 = probe.arms.find((a) => a.k === probe.enter);
      const C = [q.p[0] - Math.sin(psi) * A0.xm, q.p[1], q.p[2] + Math.cos(psi) * A0.xm];
      place(nd, C, psi, q.prm.width, q.zone?.to ?? q.biome ?? (r.defaults ?? graph.defaults ?? {}).biome ?? 'track').anchorRoute = r.id;
    }
  }
  for (const k of order) delete out[k]._joints;
  const g = { schema: 'kfb.track-core.graph/0.3', core: CORE_VERSION, id: graph.id, routes: out };
  if (built.size) {
    g.nodes = [...built.values()].map(({ _outer, _kerbs, _splitters, ...n }) => n);
    Object.defineProperty(g, '_nodes', { value: [...built.values()], enumerable: false });
    g.sockets = Object.fromEntries([...built.values()].flatMap((nb) => nb.arms.map((a) => [`${nb.id}/${a.id}`, { ...a.socket, width: a.width, node: nb.id, arm: a.id }])));
    g.anchors = [...built.values()].map((nb) => nb.anchor);
    if (Object.keys(chains).length) g.chains = chains;
  }
  if (graph.modules?.length) g.deck = moduleDeck(g, graph);
  if (graph.closed) g.closed = true;
  if (graph.pads?.length) g.pads = graph.pads.map(compilePad);
  if (graph.hosts?.length) g.hosts = graph.hosts;
  if (graph.ground != null) g.ground = graph.ground;
  return g;
}

// ---------------------------------------------------------------- v0.12 junction node: ROUNDABOUT (Kreisverkehr)
// A roundabout is a flat junction NODE for the world's roads, not a route. It carries one drive plate (ring + arm
// mouths), kerb runs with the kit's side section along every outline, a centre island with a scenery anchor, painted
// splitter islands, yield lines, NPC drive paths for every entry -> exit pair and one socket per arm. Arms are ordinary
// routes (kit profile, node biome) that start at the arm mouth, where the plate outline hands over to the arm's own
// kerbs without a seam (same section, same tangent, same point). Per arm, in the arm frame (x outward from the centre
// along the arm axis a, y lateral along n = the right of the outward heading):
//   road edge  y = ±(W/2 + f(x)); f = splitter half width: ws/2 up to xe, smootherstep down to 0 at the mouth xm (flare)
//   fillet     circle of radius rf tangent to the edge line (at xf) and to the ring's outer circle Ro (outside it)
//   splitter   ±g(x): round cap towards the ring (radius ws/2), f(x) along the flare, round nose (radius `nose`) at the tip
// Between neighbouring arms the outer kerb runs fillet -> ring arc -> fillet. Fillets shrink (down to rfMin) when arms
// stand close; below that the node refuses and names the angle it needs. Arm angles `at` (deg) are measured like a turn:
// 0 = the arm the main route arrives on, 90 = first right, 180 = straight on, 270 = left. `hand` = the side traffic keeps
// (right: anticlockwise seen from above). Everything is level at the node height.
export const ROUNDABOUT = Object.freeze({ island: 16, ring: 'STANDARD', arm: 'STANDARD', armLength: 30, fillet: 14, rfMin: +(SIDE_EXTENT + 1.5).toFixed(2),
  splitter: 4.8, flare: 18, setback: 1.2, straight: 2, nose: 0.5, islandTop: 0.3, bollardR: 0.55, yieldGap: 0.45, yieldW: 0.4, step: 0.5 });
export const SCENERY_KINDS = Object.freeze(['park', 'statue', 'pond', 'resident']);
// the kit's side section, outward from the road edge [out, up]; closes under the road edge at deck depth
export const KERB_SECTION = Object.freeze((() => { const s = profileSlots(PROFILE_DEFAULTS), x0 = s[7][0];
  return [...s.slice(7).map(([x, y]) => [+(x - x0).toFixed(4), +y.toFixed(4)]), [0, -PROFILE_DEFAULTS.deckDepth]]; })());

function normRoundabout(pc) {
  const D = ROUNDABOUT, raw = pc.arms ?? [0, 90, 180, 270];
  const arms = raw.map((a, k) => { const o = typeof a === 'number' ? { at: a } : { ...a };
    return { k, id: o.id ?? `arm${k}`, at: ((o.at ?? 0) % 360 + 360) % 360, width: o.width ?? pc.armWidth ?? null, ws: o.splitter ?? pc.splitter ?? D.splitter,
      rf: o.fillet ?? pc.fillet ?? D.fillet, flare: o.flare ?? pc.flare ?? D.flare, La: o.length ?? pc.armLength ?? D.armLength }; });
  if (!arms.length) throw new Error(`ROUNDABOUT ${pc.id}: needs at least one arm`);
  const enter = arms.findIndex((a) => a.at === 0);
  const dist = (a) => Math.abs(((a.at - 180) % 360 + 540) % 360 - 180);
  const others = arms.filter((a) => a.k !== enter);
  const exit = pc.exit != null ? (typeof pc.exit === 'number' ? pc.exit : arms.findIndex((a) => a.id === pc.exit)) : (others.length ? others.reduce((b, a) => (dist(a) < dist(b) ? a : b)).k : enter);
  return { id: pc.id, Ri: pc.island ?? D.island, Wr: WIDTHS[pc.ringWidth] ?? pc.ringWidth ?? WIDTHS[D.ring], hand: pc.hand === 'left' ? 'left' : 'right',
    biome: pc.biome ?? null, scenery: pc.scenery ?? {}, arms, enter, exit };
}
// position independent solve: fillets, flare, mouth per arm (widths resolved with the arriving width)
function solveRoundabout(spec, arriving) {
  const D = ROUNDABOUT, Ri = spec.Ri, Ro = Ri + spec.Wr;
  if (Ri < SIDE_EXTENT + 2) throw new Error(`ROUNDABOUT ${spec.id}: island radius ${Ri} m is too small (min ${(SIDE_EXTENT + 2).toFixed(2)} m: kerb section + 2 m of island)`);
  const arms = spec.arms.map((a) => ({ ...a, W: WIDTHS[a.width] ?? a.width ?? arriving ?? WIDTHS[D.arm], rf0: a.rf }));
  const solve = (a) => { const h = a.W / 2 + a.ws / 2;
    if (Ro < h + 1) throw new Error(`ROUNDABOUT ${spec.id}: arm ${a.id} (${(2 * h).toFixed(1)} m with splitter) is too wide for a ring of ${Ro.toFixed(1)} m outer radius`);
    const xf = Math.sqrt((Ro + a.rf) ** 2 - (h + a.rf) ** 2), beta = Math.atan2(h + a.rf, xf);
    const xnear = a.ws > 0 ? Ro + D.setback + a.ws / 2 : 0, xe = Math.max(xf, xnear) + D.straight, xm = xe + (a.ws > 0 ? a.flare : 0);
    Object.assign(a, { h, xf, beta, xnear, xe, xm }); };
  arms.forEach(solve);
  const n = arms.length, order = [...arms].sort((p, q) => p.at - q.at);
  const gap = (i) => (n === 1 ? 2 * Math.PI : ((((order[(i + 1) % n].at - order[i].at) % 360) + 360) % 360) * DEG);
  for (let it = 0; it < 400 && n > 1; it++) { let ok = true;
    for (let i = 0; i < n; i++) { const A = order[i], B = order[(i + 1) % n]; if (gap(i) - A.beta - B.beta >= 0) continue; ok = false;
      for (const X of [A, B]) if (X.rf > D.rfMin) { X.rf = Math.max(D.rfMin, X.rf * 0.97); solve(X); } }
    if (ok) break; }
  for (let i = 0; i < n && n > 1; i++) { const A = order[i], B = order[(i + 1) % n];
    if (gap(i) - A.beta - B.beta < -1e-9) throw new Error(`ROUNDABOUT ${spec.id}: arms ${A.id} and ${B.id} stand ${(gap(i) / DEG).toFixed(1)}° apart and need ${((A.beta + B.beta) / DEG).toFixed(1)}° (narrower arms, a smaller splitter or a larger island)`); }
  return { ...spec, Ro, Rc: Ri + spec.Wr / 2, arms, order, ringArcs: order.map((A, i) => +((gap(i) - A.beta - order[(i + 1) % n].beta) * Ro).toFixed(3)) };
}
const lin = (x0, x1, step) => { const n = Math.max(1, Math.ceil(Math.abs(x1 - x0) / step)); return Array.from({ length: n + 1 }, (_, i) => x0 + (x1 - x0) * i / n); };

// world geometry: C = centre [x, y, z], psiIn = heading of the traffic arriving on the 0° arm
function placeRoundabout(sol, C, psiIn, opts = {}) {
  const D = ROUNDABOUT, y0 = C[1], { Ri, Ro, Rc } = sol, dir = sol.hand === 'left' ? 1 : -1, se = dir, sx = -dir, step = D.step;
  const r3 = (v) => v.map((x) => +x.toFixed(4)), P3 = (q) => [q[0], y0, q[1]], C2 = [C[0], C[2]];
  const ang = (v) => Math.atan2(v[1], v[0]), hd = (d) => Math.atan2(-d[0], d[1]);
  const arms = sol.arms.map((a) => { const psi = psiIn + Math.PI - a.at * DEG, ax = [-Math.sin(psi), Math.cos(psi)], nx = [-Math.cos(psi), -Math.sin(psi)];
    return { ...a, psi, ax, nx, th: ang(ax) }; });
  const byK = (k) => arms.find((a) => a.k === k), order = [...arms].sort((p, q) => p.th - q.th);   // increasing polar angle (the +n side of an arm faces the next one)
  const L2 = (a, x, y) => [C2[0] + a.ax[0] * x + a.nx[0] * y, C2[1] + a.ax[1] * x + a.nx[1] * y];
  const f = (a, x) => (a.ws <= 0 ? 0 : x <= a.xe ? a.ws / 2 : x >= a.xm ? 0 : a.ws / 2 * (1 - smootherstep((x - a.xe) / (a.xm - a.xe))));
  const fp = (a, x) => { if (a.ws <= 0 || x <= a.xe || x >= a.xm) return 0; const u = (x - a.xe) / (a.xm - a.xe); return -a.ws / 2 * 30 * u * u * (1 - u) * (1 - u) / (a.xm - a.xe); };
  const unit = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
  const onRing = (R, th) => [C2[0] + R * Math.cos(th), C2[1] + R * Math.sin(th)];
  const fillet = (a, s) => { const cf = L2(a, a.xf, s * (a.h + a.rf)), t1 = L2(a, a.xf, s * a.h), k = Ro / (Ro + a.rf);
    return { cf, t1, t2: [C2[0] + (cf[0] - C2[0]) * k, C2[1] + (cf[1] - C2[1]) * k] }; };

  // ---- outer kerb runs: one open run per gap, arm A (+n side, mouth inwards) -> fillet -> ring -> fillet -> arm B (-n side, outwards)
  const kerbs = [], outerPoly = [];
  order.forEach((A, i) => {
    const B = order[(i + 1) % order.length], pts = [], N = [];
    const push = (p, nn) => { const l = pts[pts.length - 1]; if (l && Math.hypot(p[0] - l[0], p[1] - l[1]) < 1e-6) return; pts.push(p); N.push(unit(nn)); };
    for (const x of lin(A.xm, A.xf, step)) { const t = [-(A.ax[0] + A.nx[0] * fp(A, x)), -(A.ax[1] + A.nx[1] * fp(A, x))]; push(L2(A, x, A.W / 2 + f(A, x)), [t[1], -t[0]]); }
    const arc = (cf, p0, p1) => { const a0 = ang([p0[0] - cf[0], p0[1] - cf[1]]), sw = wrapPi(ang([p1[0] - cf[0], p1[1] - cf[1]]) - a0), r = Math.hypot(p0[0] - cf[0], p0[1] - cf[1]);
      for (const t of lin(0, 1, step / Math.max(Math.abs(sw) * r, 1e-9))) { const q = [cf[0] + r * Math.cos(a0 + sw * t), cf[1] + r * Math.sin(a0 + sw * t)]; push(q, [cf[0] - q[0], cf[1] - q[1]]); } };
    const fa = fillet(A, 1), fb = fillet(B, -1);
    arc(fa.cf, fa.t1, fa.t2);
    const t0 = A.th + A.beta, sw = order.length === 1 ? 2 * Math.PI - 2 * A.beta : ((B.th - B.beta - t0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    for (const t of lin(0, 1, step / Math.max(sw * Ro, 1e-9))) { const th = t0 + sw * t; push(onRing(Ro, th), [Math.cos(th), Math.sin(th)]); }
    arc(fb.cf, fb.t2, fb.t1);
    for (const x of lin(B.xf, B.xm, step)) { const t = [B.ax[0] - B.nx[0] * fp(B, x), B.ax[1] - B.nx[1] * fp(B, x)]; push(L2(B, x, -(B.W / 2 + f(B, x))), [t[1], -t[0]]); }
    kerbs.push({ id: `${sol.id}_kerb_${A.id}_${B.id}`, kind: 'outer', from: A.id, to: B.id, pts: pts.map((p) => r3(P3(p))), N: N.map((n) => r3([n[0], 0, n[1]])), closed: false, _p: pts, _n: N });
    outerPoly.push(...pts);
  });
  const nI = Math.max(48, Math.ceil(2 * Math.PI * Ri / step)), isl = [], islN = [];
  for (let i = 0; i < nI; i++) { const th = 2 * Math.PI * i / nI; isl.push(onRing(Ri, th)); islN.push([-Math.cos(th), -Math.sin(th)]); }
  kerbs.push({ id: `${sol.id}_kerb_island`, kind: 'island', pts: isl.map((p) => r3(P3(p))), N: islN.map((n) => r3([n[0], 0, n[1]])), closed: true, _p: isl, _n: islN });

  // ---- drive plate: ring annulus + per arm two side strips (ring circle -> fillet) and the mouth strip
  const zones = [], furniture = [], markings = [];
  const nR = Math.max(96, Math.ceil(2 * Math.PI * Ro / (2 * step)));
  zones.push({ kind: 'plate', part: 'ring', depth: PROFILE_DEFAULTS.deckDepth, U: [0, 1, 0], rows: Array.from({ length: nR + 1 }, (_, i) => { const th = 2 * Math.PI * i / nR; return [r3(P3(onRing(Ri, th))), r3(P3(onRing(Ro, th)))]; }) });
  for (const A of arms) {
    const xT2 = A.xf * Ro / (Ro + A.rf);
    const yout = (x) => (x < A.xf ? (A.h + A.rf) - Math.sqrt(Math.max(0, A.rf ** 2 - (x - A.xf) ** 2)) : A.W / 2 + f(A, x));
    const yin = (x) => Math.sqrt(Math.max(0, Ro * Ro - x * x));
    for (const s of [-1, 1]) zones.push({ kind: 'plate', part: `${A.id}_${s < 0 ? 'L' : 'R'}`, depth: PROFILE_DEFAULTS.deckDepth, U: [0, 1, 0],
      rows: lin(xT2, Ro, step / 2).map((x) => [r3(P3(L2(A, x, s * yin(x)))), r3(P3(L2(A, x, s * yout(x))))]) });
    zones.push({ kind: 'plate', part: `${A.id}_mouth`, depth: PROFILE_DEFAULTS.deckDepth, U: [0, 1, 0], rows: lin(Ro, A.xm, step).map((x) => [r3(P3(L2(A, x, -yout(x)))), r3(P3(L2(A, x, yout(x))))]) });
  }

  // ---- markings in the node biome's style; splitter islands (hatched, outlined, bollard); yield lines
  const biome = sol.biome ?? 'track', style = MARKING_STYLES[BIOME_MARKINGS[biome] ?? 'TRACK'] ?? [], edgeB = style.find((b) => b.id === 'edge'), centreB = style.find((b) => b.id === 'centre');
  if (edgeB) {
    markings.push({ kind: 'edge', closed: true, w: edgeB.w, pts: lin(0, 2 * Math.PI, step / Ri).slice(0, -1).map((th) => r3(P3(onRing(Ri + edgeB.inset, th)))) });
    for (const k of kerbs.filter((k) => k.kind === 'outer')) markings.push({ kind: 'edge', closed: false, w: edgeB.w, pts: k._p.map((p, i) => r3(P3([p[0] - k._n[i][0] * edgeB.inset, p[1] - k._n[i][1] * edgeB.inset]))) });
  }
  const splitters = [];
  for (const A of arms) {
    const rhoY = Ro + D.yieldGap, cf = Ro + A.rf, gam = Math.acos(clamp((rhoY * rhoY + cf * cf - A.rf * A.rf) / (2 * rhoY * cf), -1, 1));
    const ph1 = Math.asin(Math.min(0.99, (A.ws > 0 ? A.ws / 2 : 0.15) / rhoY)), ph2 = A.beta - gam - (edgeB ? edgeB.inset + edgeB.w : 0.3) / rhoY;
    if (ph2 > ph1) markings.push({ kind: 'yield', arm: A.id, closed: false, w: D.yieldW, dash: 0.9, gap: 0.55, pts: lin(ph1, ph2, 0.3 / rhoY).map((ph) => r3(P3(onRing(rhoY, A.th + se * ph)))) });
    if (A.ws <= 0) continue;
    const rho = D.nose; let lo = A.xe, hi = A.xm;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(A, m) * Math.sqrt(1 + fp(A, m) ** 2) > rho) lo = m; else hi = m; }
    const xt = (lo + hi) / 2, ft = fp(A, xt), nt = Math.sqrt(1 + ft * ft), xc = xt + rho * ft / nt, rc = A.ws / 2, phT = Math.atan2(f(A, xt), xt - xc);
    const outline = [];   // cap (ring side) -> lower edge -> nose -> upper edge
    for (const t of lin(Math.PI / 2, 1.5 * Math.PI, step / rc)) outline.push([A.xnear + rc * Math.cos(t), rc * Math.sin(t)]);
    for (const x of lin(A.xnear, xt, step)) outline.push([x, -f(A, x)]);
    for (const t of lin(-phT, phT, 0.25 / rho)) outline.push([xc + rho * Math.cos(t), rho * Math.sin(t)]);
    for (const x of lin(xt, A.xnear, step)) outline.push([x, f(A, x)]);
    const rows = [];
    for (const t of lin(Math.PI, Math.PI / 2, step / rc)) rows.push([A.xnear + rc * Math.cos(t), rc * Math.sin(t)]);
    for (const x of lin(A.xnear, xt, step)) rows.push([x, f(A, x)]);
    for (const t of lin(phT, 0, 0.25 / rho)) rows.push([xc + rho * Math.cos(t), rho * Math.sin(t)]);
    zones.push({ kind: 'hatch', part: `${A.id}_splitter`, depth: 0.01, U: [0, 1, 0], rows: rows.map(([x, g]) => [r3(P3(L2(A, x, -g))), r3(P3(L2(A, x, g)))]) });
    markings.push({ kind: 'splitter', arm: A.id, closed: true, w: 0.24, pts: outline.map(([x, y]) => r3(P3(L2(A, x, y)))) });
    if (centreB) markings.push({ kind: 'centre', arm: A.id, closed: false, w: centreB.w, pts: lin(xc + rho, A.xm, step).map((x) => r3(P3(L2(A, x, 0)))) });
    const br = Math.min(D.bollardR, A.ws / 2 - 0.4);
    if (br > 0.2) furniture.push({ kind: 'cushion', role: 'bollard', p: r3(P3(L2(A, A.xnear, 0))), r: +br.toFixed(3), h: 1.0 });
    splitters.push({ arm: A.id, poly: outline.map(([x, y]) => L2(A, x, y)) });
  }

  // ---- centre island (fill inside the kerb section) + scenery anchor
  const rIn = Ri - SIDE_EXTENT, top = D.islandTop, yT = y0 + top;
  zones.push({ kind: 'island', depth: top + PROFILE_DEFAULTS.deckDepth, U: [0, 1, 0], rows: lin(0, 2 * Math.PI, step / rIn).map((th) => [r3([C2[0], yT, C2[1]]), r3([C2[0] + rIn * Math.cos(th), yT, C2[1] + rIn * Math.sin(th)])]) });
  const A0 = byK(sol.enter) ?? arms[0], T0 = [A0.ax[0], 0, A0.ax[1]];
  const sc = sol.scenery ?? {};
  const anchor = { kind: 'roundabout_centre', id: `${sol.id}_centre`, node: sol.id, p: r3([C2[0], yT, C2[1]]), T: r3(T0), U: [0, 1, 0], R: r3(cross(T0, [0, 1, 0])), r: +(rIn - 0.3).toFixed(3),
    scenery: { kind: SCENERY_KINDS.includes(sc.kind) ? sc.kind : 'park', set: sc.set ?? null, seed: sc.seed ?? `${sol.id}:centre` } };

  // ---- NPC drive paths (lane centres): entry lane -> Hermite onto the ring lane -> ring arc -> Hermite -> exit lane
  const lane = (a, x, s) => s * (f(a, x) + a.W / 4);
  const pathOf = (A, B, join) => {
    const pts = [], add2 = (p) => { const l = pts[pts.length - 1]; if (!l || Math.hypot(p[0] - l[0], p[2] - l[2]) > 1e-6) pts.push(p); };
    const blend = (a, x) => (join ? smootherstep((a.xm - x) / Math.max(a.xm - a.xe, 1e-9)) : 1);
    for (const x of lin(A.xm, A.xe, step)) add2(P3(L2(A, x, lane(A, x, se) * (A.ws > 0 ? blend(A, x) : 1))));
    const th1 = A.th + se * A.beta, th2 = B.th - dir * B.beta, q1 = onRing(Rc, th1), q2 = onRing(Rc, th2);
    const tg = (th) => [-dir * Math.sin(th), dir * Math.cos(th)];
    const p0 = L2(A, A.xe, lane(A, A.xe, se)), p1 = L2(B, B.xe, lane(B, B.xe, sx));
    for (const q of connectPoints(P3(p0), hd([-A.ax[0], -A.ax[1]]), 0, P3(q1), hd(tg(th1)), 0, step).pts) add2(q.p);
    let sw = (((th2 - th1) * dir) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); if (A === B && sw < 1e-6) sw = 2 * Math.PI;
    for (const t of lin(0, 1, step / Math.max(sw * Rc, 1e-9))) add2(P3(onRing(Rc, th1 + dir * sw * t)));
    for (const q of connectPoints(P3(q2), hd(tg(th2)), 0, P3(p1), hd(B.ax), 0, step).pts) add2(q.p);
    for (const x of lin(B.xe, B.xm, step)) add2(P3(L2(B, x, lane(B, x, sx) * (B.ws > 0 ? blend(B, x) : 1))));
    let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][2] - pts[i - 1][2]);
    let rMin = Infinity; for (let i = 2; i + 2 < pts.length; i += 2) { const a = pts[i - 2], b = pts[i], c = pts[i + 2];
      const ab = Math.hypot(b[0] - a[0], b[2] - a[2]), bc = Math.hypot(c[0] - b[0], c[2] - b[2]), ca = Math.hypot(a[0] - c[0], a[2] - c[2]);
      const ar = Math.abs((b[0] - a[0]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[0] - a[0])) / 2; if (ar > 1e-9) rMin = Math.min(rMin, ab * bc * ca / (4 * ar)); }
    return { id: `${A.id}>${B.id}`, from: A.id, to: B.id, length: +L.toFixed(3), minRadius: Number.isFinite(rMin) ? +rMin.toFixed(2) : null, pts: pts.map(r3) };
  };
  const paths = []; for (const A of arms) for (const B of arms) paths.push(pathOf(A, B, false));
  const main = sol.enter >= 0 && sol.exit >= 0 ? { ...pathOf(byK(sol.enter), byK(sol.exit), true), id: 'main' } : null;

  const armsOut = arms.map((a) => { const T = [a.ax[0], 0, a.ax[1]], R = cross(T, [0, 1, 0]), r9 = (v) => v.map((x) => +x.toFixed(9)), frame = (x) => ({ p: r3(P3(L2(a, x, 0))), headingDeg: +(a.psi / DEG).toFixed(6), T: r9(T), R: r9(R), U: [0, 1, 0] });
    return { id: a.id, k: a.k, at: a.at, width: a.W, splitter: a.ws, fillet: +a.rf.toFixed(3), filletAsked: a.rf0, flare: a.ws > 0 ? a.flare : 0, xf: +a.xf.toFixed(3), xe: +a.xe.toFixed(3), xm: +a.xm.toFixed(3),
      beta: +(a.beta / DEG).toFixed(3), length: a.La, psi: a.psi, role: a.k === sol.enter ? 'enter' : a.k === sol.exit ? 'exit' : 'stub', mouth: frame(a.xm), socket: frame(a.xm + a.La),
      corners: [r3(P3(L2(a, a.xm, -a.W / 2))), r3(P3(L2(a, a.xm, a.W / 2)))] }; });
  const node = { kind: 'roundabout', id: sol.id, center: r3(C), y: y0, hand: sol.hand, biome, island: Ri, ringWidth: sol.Wr, Ro, ringArcs: sol.ringArcs,
    arms: armsOut, deck: { zones, furniture }, kerbs: kerbs.map(({ _p, _n, ...k }) => k), section: KERB_SECTION, markings, paths, main, anchor,
    _outer: outerPoly, _kerbs: kerbs, _splitters: splitters };
  return node;
}

// graph macro: a ROUNDABOUT piece in a route ends that route at the enter arm's mouth (the arm is the route's last
// piece), places the node there and continues the rest of the route as `<route>+<node>` from the exit arm's mouth. The
// other arms become stub routes `<node>.<arm>` ending in a socket. graph.nodes may also hold free-standing roundabouts
// ({type: 'ROUNDABOUT', id, center: [x, y, z], headingDeg}); routes attach with start: {socket: 'node/arm'} or a CONNECT
// to: 'node/arm'. Sockets sit at the outer end of every arm.
export function expandNodes(graph) {
  const nodes = (graph.nodes ?? []).map((n) => ({ ...n, spec: normRoundabout(n) })), routes = [], queue = graph.routes.map((r) => ({ ...r }));
  for (const nd of nodes) for (const a of nd.spec.arms)   // a free-standing node gets a stub route on every arm; its sockets sit at the stub ends
    routes.push({ id: `${nd.id}.${a.id}`, node: nd.id, start: { socket: { node: nd.id, arm: a.k, at: 'mouth' } }, pieces: [{ id: `${nd.id}_${a.id}`, type: 'STRAIGHT', length: a.La, tags: ['roundabout', 'node_arm', `node:${nd.id}`, `arm:${a.id}`] }] });
  let serial = 0;
  while (queue.length) {
    const r = queue.shift(), i = r.pieces.findIndex((pc) => pc.type === 'ROUNDABOUT');
    if (i < 0) { routes.push(r); continue; }
    const pc = { ...r.pieces[i], id: r.pieces[i].id ?? `rb${++serial}` }, spec = normRoundabout(pc), id = pc.id;
    if (spec.enter < 0) throw new Error(`ROUNDABOUT ${id}: one arm must stand at 0° (the arm the route arrives on)`);
    const tags = (a) => ['roundabout', 'node_arm', `node:${id}`, `arm:${a.id}`], A0 = spec.arms[spec.enter];
    routes.push({ ...r, pieces: [...r.pieces.slice(0, i), { id: `${id}_in`, type: 'STRAIGHT', length: A0.La, tags: tags(A0), ...(A0.width ? { width: A0.width } : {}) }] });
    nodes.push({ ...pc, spec, anchor: { route: r.id } });
    for (const a of spec.arms) if (a.k !== spec.enter && a.k !== spec.exit)
      routes.push({ id: `${id}.${a.id}`, node: id, start: { socket: { node: id, arm: a.k, at: 'mouth' } }, pieces: [{ id: `${id}_${a.id}`, type: 'STRAIGHT', length: a.La, tags: tags(a) }] });
    if (spec.exit !== spec.enter) { const X = spec.arms[spec.exit];
      queue.unshift({ id: `${r.id}+${id}`, defaults: r.defaults, chainOf: r.chainOf ?? r.id, after: id, start: { socket: { node: id, arm: X.k, at: 'mouth' } },
        pieces: [{ id: `${id}_out`, type: 'STRAIGHT', length: X.La, tags: tags(X) }, ...r.pieces.slice(i + 1)] }); }
  }
  return { ...graph, routes, nodes };
}

// markings: bands over s with their placement rule; consumers evaluate lat per sample (markingLat)
function paintMarkings(stream) {
  const bands = []; const open = new Map();
  const close = (key, s) => { const b = open.get(key); if (b) { b.s1 = s; if (b.s1 - b.s0 > 1e-6) bands.push(b); open.delete(key); } };
  for (const q of stream) {
    const live = new Set();
    if (q.prm.surface >= 0.5 && !q.noMark && q.prm.width >= 2) for (const m of MARKING_STYLES[q.marking] ?? []) {   // v0.9: no lines on a rounded end
      const sides = m.at === 'edges' ? [-1, 1] : [0];
      for (const side of sides) {
        let on = true;
        if (m.dash) on = (q.s % (m.dash + m.gap)) < m.dash;
        if (m.pitch) on = (q.s % m.pitch) < m.w;
        const key = `${q.marking}:${m.id}:${side}`;
        if (on) { live.add(key); if (!open.has(key)) open.set(key, { style: q.marking, id: m.id, at: m.at, inset: m.inset ?? 0, side, s0: q.s, w: m.at === 'bars' ? null : m.w, span: m.span ?? null, barLen: m.at === 'bars' ? m.w : null }); }
      }
    }
    for (const k of [...open.keys()]) if (!live.has(k)) close(k, q.s);
  }
  const sEnd = stream[stream.length - 1].s; for (const k of [...open.keys()]) close(k, sEnd);
  // magnet bars: the first and last bars of a run grow / shrink over BAR_TAPER bars, so a run starts as an arrow tip
  // (narrow bar first, full width after a few steps) instead of one sudden full-width bar. Georg 27.09.
  const bars = bands.filter((b) => b.at === 'bars').sort((a, b) => a.s0 - b.s0);
  let run = [];
  const flush = () => { run.forEach((b, k) => { const j = run.length - 1 - k;
      const f = Math.min(smoothstep((k + 1) / (BAR_TAPER + 1)), smoothstep((j + 1) / (BAR_TAPER + 1)));
      b.spanFull = b.span; b.span = +(BAR_SPAN_MIN + (b.span - BAR_SPAN_MIN) * f).toFixed(4); b.taper = +f.toFixed(4); }); run = []; };
  for (const b of bars) { if (run.length && b.s0 - run[run.length - 1].s0 > 1.5 * (MARKING_STYLES.MAG[1].pitch)) flush(); run.push(b); }
  flush();
  return bands;
}
export const BAR_TAPER = 5, BAR_SPAN_MIN = 0.08;

// ---------------------------------------------------------------- v0.7 tunnels (Georg 27.09): round, oval, rect, poly
// A tunnel is a layer on the same stream, like markings: every sample inside a tunnel carries a closed section ring in
// its road frame ([lat, lift] points, anticlockwise, bottom first), so consumers sweep it like the 14 slots. All shapes
// are sampled with the same TUNNEL_N radial angles, so one shape morphs into another point by point without a seam.
// The ring height is fitted per sample: the lowest fill under the road that still keeps every barrier / shoulder point
// and the car envelope (road width x headroom) inside the ring with `margin`. Portals take the ring of the tube end,
// so a portal always has the tube's own shape (Georg: no square portal on a round tube).
export const TUNNEL_N = 48;   // divisible by 3, 4, 6, 8, 12, 16: polygon corners land on samples
// v0.8 responsive sections (Georg 27.09): a tube is sized from the track it carries, not from fixed numbers. `w` / `h`
// left out = 'auto': the smallest section of the shape's proportion (`aspect`, h / w) that keeps barriers, shoulders and
// the vehicle envelope `clear` m inside. Width steps, forks and wide profiles make the tube grow and shrink with them.
// Numbers still win (a hangar with h 70, a tight toy tube). `aspect: 'fit'` = width and height each as small as possible.
export const TUNNEL_SHAPES = Object.freeze({
  round: { e: 2, aspect: 1 },
  oval: { e: 2, aspect: 0.6 },
  rect: { e: 10, aspect: 'fit' },    // superellipse e 10 = rectangle with rounded corners (clay look, no hard corner)
  poly: { n: 6, aspect: 0.78 },      // regular n-gon with a flat floor edge
  arch: { arch: true, aspect: 0.62 },// horseshoe: flat floor, straight walls, round vault (classic road / rail tunnel)
});
// presets = spec bundles for recognisable tunnel families; any field can still be overridden on the piece
export const TUNNEL_PRESETS = Object.freeze({
  gotthard: { shape: 'arch', host: 'mountain', clear: 1.2 },
  dumb: { shape: 'rect', e: 6, host: 'bunker', wall: 2.5, clear: 1.5 },          // deep underground military base
  alien: { shape: 'poly', n: 8, aspect: 0.8, host: 'alien', clear: 2.0 },
  hangar: { shape: 'rect', e: 14, h: 70, host: 'hangar', wall: 3, clear: 32 },   // room for a big ship beside the track
  toy: { shape: 'round', host: 'toy', wall: 0.6, clear: 0.6 },                    // toy track tube (skin 'toy')
});
export const TUNNEL_DEFAULTS = Object.freeze({ wall: 1.2, host: 'earth', headroom: VEHICLE_HEADROOM, margin: 0.3, clear: 1.0, portalZone: 10 });
export function tunnelSpec(t) {
  const pre = t.preset ? TUNNEL_PRESETS[t.preset] : {};
  if (t.preset && !pre) throw new Error(`tunnel: unknown preset ${t.preset}`);
  const shape = t.shape ?? pre.shape ?? 'round';
  if (!TUNNEL_SHAPES[shape]) throw new Error(`tunnel: unknown shape ${shape}`);
  const o = { ...TUNNEL_DEFAULTS, ...TUNNEL_SHAPES[shape], ...pre, ...t, shape }; delete o.morphZone;
  if (shape === 'poly') delete o.e; else delete o.n;
  if (shape !== 'arch') delete o.arch;
  return Object.freeze(o);
}
const _unit = new Map();
function unitRing(spec) {
  const key = spec.arch ? 'arch' : spec.n ? `n${spec.n}` : `e${spec.e}`;
  if (_unit.has(key)) return _unit.get(key);
  const N = TUNNEL_N, pts = [];
  for (let k = 0; k < N; k++) {
    const phi = 2 * Math.PI * k / N, th = phi - Math.PI / 2;  // phi from the floor centre towards the right wall
    let r;
    if (spec.arch) r = th < 0 ? (Math.abs(Math.cos(th)) ** 10 + Math.abs(Math.sin(th)) ** 10) ** (-1 / 10) : 1;
    else if (spec.n) { const a = 2 * Math.PI / spec.n, d = ((phi + a / 2) % a + a) % a - a / 2; r = Math.cos(Math.PI / spec.n) / Math.cos(d); }
    else { const e = spec.e; r = (Math.abs(Math.cos(th)) ** e + Math.abs(Math.sin(th)) ** e) ** (-1 / e); }
    pts.push([r * Math.cos(th), r * Math.sin(th)]);
  }
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cyy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const sx = (Math.max(...xs) - Math.min(...xs)) / 2, sy = (Math.max(...ys) - Math.min(...ys)) / 2;
  const out = pts.map(([x, y]) => [(x - cx) / sx, (y - cyy) / sy]);
  _unit.set(key, out); return out;
}
const scaled = (spec) => unitRing(spec).map(([x, y]) => [x * spec.w / 2, y * spec.h / 2]);
// signed distance of a 2D point to a closed ring: > 0 inside
function ringSD(pt, ring) {
  let inside = false, d = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) inside = !inside;
    const ex = xj - xi, ey = yj - yi, l2 = ex * ex + ey * ey || 1e-12;
    const t = clamp(((pt[0] - xi) * ex + (pt[1] - yi) * ey) / l2, 0, 1);
    d = Math.min(d, Math.hypot(pt[0] - xi - t * ex, pt[1] - yi - t * ey));
  }
  return inside ? d : -d;
}
export { ringSD };
const _fit = new Map();
function fitLift(ring0, need, margin, h) {
  const f = (cy) => Math.min(...need.map(([x, y]) => ringSD([x, y - cy], ring0)));
  let lo = -h, hi = h;                                   // f is concave in cy (convex ring): ternary search for the best
  for (let i = 0; i < 60; i++) { const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3; if (f(a) < f(b)) lo = a; else hi = b; }
  const best = (lo + hi) / 2, fb = f(best);
  if (fb < margin) return { cy: best, margin: fb };
  let a = best, b = h;                                   // highest centre that still fits = least fill under the road
  if (f(b) >= margin) return { cy: b, margin: f(b) };
  for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (f(m) >= margin) a = m; else b = m; }
  return { cy: a, margin: f(a) };
}
// required inside: every slot at or above the shoulder line (barriers, shoulders, road) + the vehicle envelope
function needOf(slots, head) {
  const need = slots.filter(([, y]) => y >= -0.4);
  const rl = slots[SLOTS.indexOf('road_L')][0], rr = slots[SLOTS.indexOf('road_R')][0];
  need.push([rl, head], [rr, head], [(rl + rr) / 2, head]);
  return need;
}
// a convex ring holds a point set iff it holds its convex hull: fit against the hull (few points, fast)
function hull(pts) {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
// clearance around the carried profile: sideways and upwards only (the floor sits under the road, not `clear` below it)
const inflate = (pts, c) => c > 0 ? pts.flatMap(([x, y]) => [[x - c, y], [x + c, y], [x - c, y + c], [x + c, y + c]]) : pts;
const bestMargin = (ring0, need, h) => { const f = (cy) => Math.min(...need.map(([x, y]) => ringSD([x, y - cy], ring0)));
  let lo = -h, hi = h; for (let i = 0; i < 36; i++) { const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3; if (f(a) < f(b)) lo = a; else hi = b; }
  return f((lo + hi) / 2); };
const _size = new Map();
// resolve 'auto' w / h: the smallest section of the shape's proportion that keeps `need` spec.clear inside
function sized(spec, need) {
  if (typeof spec.w === 'number' && typeof spec.h === 'number') return spec;
  need = hull(inflate(need, spec.clear));
  const key = JSON.stringify([spec.shape, spec.e, spec.n, spec.arch, spec.w, spec.h, spec.aspect, spec.clear, need.map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)])]);
  if (_size.has(key)) return _size.get(key);
  const ok = (w, h) => bestMargin(scaled({ ...spec, w, h }), need, h) >= spec.margin - 1e-6;
  const least = (f, lo = 0.5, hi = 600) => { if (!f(hi)) return hi; for (let i = 0; i < 26; i++) { const m = (lo + hi) / 2; if (f(m)) hi = m; else lo = m; } return hi; };
  let w = spec.w, h = spec.h;
  if (typeof w === 'number') h = least((x) => ok(w, x));
  else if (typeof h === 'number') {     // fixed height (hangar): widen a little until the floor sits under the road
    const w0 = least((x) => ok(x, h)); w = w0;
    for (let k = 0; k <= 15; k++) { const ww = w0 * (1 + 0.03 * k), f = fitLift(scaled({ ...spec, w: ww, h }), need, spec.margin, h);
      w = ww; if (h / 2 - f.cy < 2) break; } }
  else if (spec.aspect === 'fit') {   // smallest cross-section area: rounded corners need a little extra width, not height
    const w0 = least((x) => ok(x, x)); let best = null;
    for (let k = 0; k <= 12; k++) { const ww = w0 * (1 + 0.04 * k), hh = least((x) => ok(ww, x)); if (!best || ww * hh < best[0] * best[1] - 1e-9) best = [ww, hh]; }
    [w, h] = best; }
  else { const k = spec.aspect; w = least((x) => ok(x, x * k)); h = w * k; }
  // + 5 cm: the size cache rounds the carried profile to 1 cm, the rounded neighbours must still clear
  const out = Object.freeze({ ...spec, w: +(w + (typeof spec.w === 'number' ? 0 : 0.05)).toFixed(3), h: +(h + (typeof spec.h === 'number' ? 0 : 0.05)).toFixed(3) });
  _size.set(key, out); return out;
}
function fitRing(spec, need) {
  need = hull(inflate(need, spec.clear));
  const ring0 = scaled(spec), fit = fitLift(ring0, need, spec.margin, spec.h);
  return { ring: ring0.map(([x, y]) => [+x.toFixed(4), +(y + fit.cy).toFixed(4)]), cy: fit.cy, margin: fit.margin };
}
// extra: more points to keep inside (the partner lane of a fork / join -> the tube becomes a junction hall)
export function tunnelSection(tn, slots, extra = []) {
  const { t } = tn, head = lerp(tn.A.headroom, tn.B.headroom, t), raw = [...needOf(slots, head), ...extra];
  const A = sized(tn.A, raw), B = sized(tn.B, raw), need = hull(inflate(raw, lerp(tn.A.clear, tn.B.clear, t)));
  const rA = scaled(A), rB = scaled(B);
  const ring0 = rA.map((p, k) => [lerp(p[0], rB[k][0], t), lerp(p[1], rB[k][1], t)]);
  const h = lerp(A.h, B.h, t), w = lerp(A.w, B.w, t), margin = B.margin;
  const key = JSON.stringify([ring0[0], ring0[12], ring0[6], w, h, need]).slice(0, 4000);
  let fit = _fit.get(key); if (!fit) { fit = fitLift(ring0, need, margin, h); _fit.set(key, fit); }
  const ring = ring0.map(([x, y]) => [+x.toFixed(4), +(y + fit.cy).toFixed(4)]);
  return { shape: t < 0.5 ? A.shape : B.shape, morph: tn.A === tn.B ? null : { from: tn.A.shape, to: tn.B.shape, t: +t.toFixed(4) },
    host: B.host, wall: B.wall, w: +w.toFixed(3), h: +h.toFixed(3), cy: +fit.cy.toFixed(4), fill: +(h / 2 - fit.cy).toFixed(3),
    margin: +fit.margin.toFixed(4), tube: tn.tube, ...(extra.length ? { hall: true } : {}), ring };
}
// junction halls: over a fork / join inside a tunnel the main route carries ONE hall for both lanes. Its section is fitted
// once to both lanes over the whole zone (in the frame of the shared axis), so the hall is a straight constant cavern;
// the branch lane has no tube of its own there and starts its tube at the hall's end wall.
function buildHalls(stream, raw) {
  let i = 0;
  while (i < stream.length) {
    if (!stream[i].tunnel?.hall) { i++; continue; }
    let j = i; while (j < stream.length && stream[j].tunnel?.hall) j++;
    const tn = raw[i].tun, union = [];
    for (let k = i; k < j; k++) { const ax = raw[k].axisLat, head = lerp(tn.A.headroom, tn.B.headroom, raw[k].tun.t);
      for (const [x, y] of needOf(stream[k].slots, head)) union.push([x - ax, y], [ax - x, y]); }
    const spec = sized(raw[j - 1].tun.B, union), f = fitRing(spec, union);
    for (let k = i; k < j; k++) { const ax = raw[k].axisLat;
      Object.assign(stream[k].tunnel, { shape: spec.shape, morph: null, w: spec.w, h: spec.h, cy: +f.cy.toFixed(4), fill: +(spec.h / 2 - f.cy).toFixed(3),
        margin: +f.margin.toFixed(4), ring: f.ring.map(([x, y]) => [+(x + ax).toFixed(4), y]) }); }
    i = j;
  }
}
// outer shell ring (wall thickness along the vertex normals)
export function tunnelOuter(tunnel, extra = 0) {
  const r = tunnel.ring, n = r.length, w = tunnel.wall + extra;
  return r.map((p, k) => { const a = r[(k - 1 + n) % n], b = r[(k + 1) % n], tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    return [p[0] + ty / l * w, p[1] - tx / l * w]; });
}
// v0.7 ring palette: identical rings are stored once (stream.tunnelRings); samples carry ringId. The ring stays on the
// sample as a non-enumerable property for in-memory checks; after JSON load, attachRings(stream) restores it.
function ringPalette(stream) {
  const pal = [], ids = new Map();
  for (const q of stream) { if (!q.tunnel) continue; const r = q.tunnel.ring, k = r.map((p) => p.join(',')).join(';');
    let id = ids.get(k); if (id === undefined) { id = pal.length; pal.push(r); ids.set(k, id); }
    delete q.tunnel.ring; q.tunnel.ringId = id; Object.defineProperty(q.tunnel, 'ring', { value: pal[id], enumerable: false, configurable: true }); }
  return pal;
}
export function attachRings(stream) {
  for (const q of stream.samples) if (q.tunnel && !q.tunnel.ring) Object.defineProperty(q.tunnel, 'ring', { value: stream.tunnelRings[q.tunnel.ringId], enumerable: false, configurable: true });
  return stream;
}
function tunnelSegments(stream, joints) {
  const segs = []; let cur = null;
  const pieceAt = (i) => { let pc = null; for (const j of joints) if (j.index <= i) pc = j.piece; return pc; };
  const close = (e) => { segs.push({ id: `T${segs.length + 1}_${cur.piece}`, host: cur.host, kind: cur.hall ? 'hall' : 'tube', i0: cur.i0, i1: e,
    s0: +cur.s0.toFixed(3), s1: +stream[e].s.toFixed(3), length: +(stream[e].s - cur.s0).toFixed(3),
    shapeIn: stream[cur.i0].tunnel.shape, shapeOut: stream[e].tunnel.shape, shapes: [...cur.shapes] }); cur = null; };
  stream.forEach((q, i) => {
    if (cur && (!q.tunnel || !!q.tunnel.hall !== cur.hall || q.tunnel.tube !== cur.tube)) close(i - 1);  // v0.8: halls and new tubes are own segments
    if (q.tunnel && !cur) cur = { i0: i, s0: q.s, host: q.tunnel.host, hall: !!q.tunnel.hall, tube: q.tunnel.tube, piece: pieceAt(i), shapes: new Set() };
    if (q.tunnel) cur.shapes.add(q.tunnel.shape);
    if (cur && i === stream.length - 1) close(i);
  });
  return segs;
}
const worldOf = (q, [l, h]) => add(add(q.p, mul(q.R, l)), mul(q.U, h));
// shell check: no point of another pass (tube shell or open deck) may come within `rock` of a tube's outer shell.
// tubes: [{q, key}] tunnel samples (every ~1 m); pts: [{x, key, s}] candidate points; far(keyA, sA, keyB, sB) filters pairs
function shellClearance(tubes, pts, far, rock) {
  const C = 8, grid = new Map(), cell = (v) => v.map((c) => Math.floor(c / C)).join(',');
  for (const p of pts) { const k = cell(p.x); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(p); }
  let minD = Infinity, at = null, hits = 0;
  for (const tb of tubes) {
    const q = tb.q, outer = tunnelOuter(q.tunnel);
    const ext = Math.max(...outer.map(([l, h]) => Math.hypot(l, h))) + rock + 1;
    const c0 = q.p.map((v) => Math.floor((v - ext) / C)), c1 = q.p.map((v) => Math.floor((v + ext) / C));
    for (let x = c0[0]; x <= c1[0]; x++) for (let y = c0[1]; y <= c1[1]; y++) for (let z = c0[2]; z <= c1[2]; z++) {
      const list = grid.get(`${x},${y},${z}`); if (!list) continue;
      for (const p of list) {
        if (!far(tb.key, q.s, p.key, p.s)) continue;
        const d = sub(p.x, q.p), a = dot(d, q.T); if (Math.abs(a) > 0.55) continue;
        const sd = ringSD([dot(d, q.R), dot(d, q.U)], outer);   // > 0 inside the shell
        const gap = -sd; if (gap < minD) { minD = gap; at = [+q.s.toFixed(1), tb.key, +p.s.toFixed(1), p.key]; }
        if (gap < rock) hits++;
      }
    }
  }
  return { minD, at, hits };
}
const passPoints = (S, key, every) => {
  const out = [];
  for (let i = 0; i < S.length; i += every) {
    const q = S[i];
    if (q.tunnel) { for (const pt of tunnelOuter(q.tunnel)) out.push({ x: worldOf(q, pt), key, s: q.s }); }
    else if (q.prm.surface >= 0.5 || q.law === 'loop') for (const sl of q.slots) out.push({ x: worldOf(q, sl), key, s: q.s });
  }
  return out;
};
const inCavern = (p, h) => { const [cx, cy, cz] = h.center, [rx, ry, rz] = h.radii;
  return ((p[0] - cx) / rx) ** 2 + ((p[1] - cy) / ry) ** 2 + ((p[2] - cz) / rz) ** 2 <= 1 && p[1] >= (h.floorY ?? -Infinity) - 0.01; };

function tunnelChecks(stream, tol, add_) {
  if (stream.tunnelRings) attachRings(stream);
  const S = stream.samples, T = S.filter((q) => q.tunnel);
  if (T.length) {
    let worst = Infinity, at = null, head = Infinity;
    for (const q of T) { if (q.tunnel.margin < worst) { worst = q.tunnel.margin; at = q.s; }
      const top = Math.max(...q.tunnel.ring.filter(([l]) => Math.abs(l) < q.prm.width / 2).map(([, h]) => h)); head = Math.min(head, top); }
    add_('tunnel_clearance', worst >= TUNNEL_DEFAULTS.margin - 1e-3, +worst.toFixed(3),
      `min distance of barriers / shoulders / car envelope (${TUNNEL_DEFAULTS.headroom} m) to the ring (m), at s ${at?.toFixed(1)}; min roof over the road ${head.toFixed(2)} m`);
    let rate = 0, atR = null;
    for (let i = 1; i < S.length; i++) { const a = S[i - 1].tunnel, b = S[i].tunnel; if (!a || !b || a.hall || b.hall || a.tube !== b.tube) continue;
      const ds = Math.max(S[i].s - S[i - 1].s, 1e-9); let m = 0;
      for (let k = 0; k < TUNNEL_N; k++) m = Math.max(m, Math.hypot(a.ring[k][0] - b.ring[k][0], a.ring[k][1] - b.ring[k][1]));
      if (m / ds > rate) { rate = m / ds; atR = S[i].s; } }
    add_('tunnel_morph', rate <= tol.tunnelMorph, +rate.toFixed(4), `max ring point shift per metre (m/m), at s ${atR?.toFixed(1)}; limit ${tol.tunnelMorph}`);
    // portals: the ring is constant over the first / last portalZone m of every tube (the collar has the tube's shape),
    // and a portal never sits on an air span or a loop
    let dev = 0, bad = [];
    const segs = stream.tunnels ?? [];
    for (const seg of segs) {
      if (seg.kind === 'hall') continue;   // a junction hall ends in a flat end wall, not in a collar
      const z = TUNNEL_DEFAULTS.portalZone;
      const hallAt = (i) => segs.some((o) => o.kind === 'hall' && (Math.abs(o.i1 - i) <= 1 || Math.abs(o.i0 - i) <= 1));
      for (const [i0, dir] of [[seg.i0, 1], [seg.i1, -1]]) {
        if (hallAt(i0)) continue;          // a tube end in a hall wall may flare (the fork's widening), no collar there
        const ref = S[i0].tunnel.ring;
        for (let i = i0; i >= seg.i0 && i <= seg.i1 && Math.abs(S[i].s - S[i0].s) <= z; i += dir)
          for (let k = 0; k < TUNNEL_N; k++) dev = Math.max(dev, Math.hypot(S[i].tunnel.ring[k][0] - ref[k][0], S[i].tunnel.ring[k][1] - ref[k][1]));
        if (S[i0].law !== 'guide' || S[i0].tags.includes('air')) bad.push(seg.id);
      }
    }
    add_('portal_match', dev < 1e-3 && !bad.length, +dev.toFixed(5), bad.length ? `portal on air / loop: ${bad.join(', ')}` : `${(stream.tunnels ?? []).length} tubes; ring deviation within ${TUNNEL_DEFAULTS.portalZone} m of each portal (m)`);
    const total = S[S.length - 1].s, apart = (a, b) => { const d = Math.abs(a - b); return stream.closed ? Math.min(d, total - d) : d; };
    const tubes = S.filter((q, i) => q.tunnel && i % 2 === 0).map((q) => ({ q, key: 'self' }));
    const r = shellClearance(tubes, passPoints(S, 'self', 2), (ka, sa, kb, sb) => apart(sa, sb) >= tol.clearanceFarM, tol.tunnelRock);
    add_('tunnel_shell', r.hits === 0, Number.isFinite(r.minD) ? +r.minD.toFixed(3) : null,
      r.at ? `min rock between a tube shell and any other pass (m), at tube s ${r.at[0]} vs s ${r.at[2]}; ${r.hits} points closer than ${tol.tunnelRock} m` : 'no other pass near a tube');
  }
  // open road deep under ground must be inside a cavern (or a tube): catches a forgotten tunnel spec
  if (stream.ground != null) {
    let worst = 0, at = null;
    for (const q of S) { if (q.tunnel || q.prm.surface < 0.5) continue; if (q.p[1] >= stream.ground - 0.5) continue;
      if ((stream.hosts ?? []).some((h) => h.kind === 'cavern' && inCavern(q.p, h))) continue;
      const d = stream.ground - q.p[1]; if (d > worst) { worst = d; at = q.s; } }
    add_('buried_open', worst === 0, +worst.toFixed(3), at != null ? `open road ${worst.toFixed(2)} m under ground outside any cavern at s ${at.toFixed(1)}` : 'open road under ground only inside caverns');
  }
}

// ---------------------------------------------------------------- checks (contract §8). Tolerances are proposals.
export const TOL = Object.freeze({ kinkDegPerM: 0.5, kappaJump: 0.01, bankStepDeg: 1.5, orth: 1e-6,
  foldMargin: 0.5, clearance: 2.5, clearanceFarM: 40, headroom: 2.2, frameFlipDot: 0.0, crossClearance: 0.9, splitEdge: 1e-6,
  tunnelMorph: 0.3, tunnelRock: 1.0 });

const sectionCorners = (q) => {
  const xs = q.slots.map((v) => v[0]), ys = q.slots.map((v) => v[1]);
  const lo = Math.min(...xs), hi = Math.max(...xs), top = Math.max(...ys), bot = Math.min(...ys);
  return [[lo, top], [hi, top], [lo, bot], [hi, bot], [(lo + hi) / 2, 0]].map(([l, h]) => add(add(q.p, mul(q.R, l)), mul(q.U, h)));
};

export function runChecks(stream, tol = TOL) {
  const S = stream.samples, res = [];
  const add_ = (id, pass, value, note, severity = 'error') => res.push({ id, pass, value, note, severity });
  let mono = 0, maxGap = 0; for (let i = 1; i < S.length; i++) { const d = S[i].s - S[i - 1].s; if (d < 0 || (d === 0 && !S[i].brk)) mono++; maxGap = Math.max(maxGap, Math.abs(len(sub(S[i].p, S[i - 1].p)) - d)); }
  add_('s_monotonic', mono === 0, mono, 'count of non-increasing s (zero-length only at topology breaks)');
  add_('s_matches_arc', maxGap < 1e-6, maxGap, 'max |chord - ds|');
  let orth = 0; for (const q of S) orth = Math.max(orth, Math.abs(dot(q.T, q.U)), Math.abs(dot(q.T, q.R)), Math.abs(dot(q.U, q.R)), Math.abs(len(q.T) - 1), Math.abs(len(q.U) - 1));
  add_('frame_orthonormal', orth < tol.orth, orth);
  let flips = 0, minDotR = 1; for (let i = 1; i < S.length; i++) { const d = dot(S[i].R, S[i - 1].R); minDotR = Math.min(minDotR, d); if (d < tol.frameFlipDot) flips++; }
  add_('frame_flips', flips === 0, flips, `min dot(R_i, R_i-1) = ${minDotR.toFixed(4)}`);
  // tangent kink (jump of the measured turning rate), curvature step within one law, bank rate.
  // Airborne spans are exempt: the lip and the touchdown are real edges of the driving surface.
  const air = (q) => q.tags.includes('air');
  let tMax = 0, kMax = 0, bMax = 0, prevRate = null, kinkAt = null;
  for (let i = 1; i < S.length; i++) {
    const dsi = Math.max(S[i].s - S[i - 1].s, 1e-9);
    const rate = Math.acos(clamp(dot(S[i].T, S[i - 1].T), -1, 1)) / DEG / dsi;
    const brkNear = S[i].brk || S[i - 1].brk || (i > 1 && S[i - 2].brk) || (i + 1 < S.length && S[i + 1].brk);
    if (S[i].s - S[i - 1].s <= 0) continue;
    const exempt = air(S[i]) || air(S[i - 1]) || (i > 1 && air(S[i - 2])) || brkNear;
    if (prevRate !== null && !exempt && Math.abs(rate - prevRate) > tMax) { tMax = Math.abs(rate - prevRate); kinkAt = S[i].s; }
    prevRate = rate;
    if (S[i].law === S[i - 1].law && !exempt) kMax = Math.max(kMax, Math.abs(S[i].kappa - S[i - 1].kappa));
    bMax = Math.max(bMax, Math.abs(S[i].bank - S[i - 1].bank) / DEG / dsi);
  }
  add_('tangent_kink', tMax < tol.kinkDegPerM, +tMax.toFixed(4), `max jump of the turning rate (deg/m), at s ${kinkAt?.toFixed(1)}; air spans exempt`);
  add_('curvature_step', kMax < tol.kappaJump, +kMax.toFixed(5), 'max |dkappa| between samples of the same law');
  add_('bank_rate', bMax < tol.bankStepDeg, +bMax.toFixed(4), 'max deg per metre');
  const bad = S.filter((q) => q.slots.length !== SLOTS.length || q.slots.some((v) => !Number.isFinite(v[0]) || !Number.isFinite(v[1]))).length;
  add_('slot_parity', bad === 0, bad);
  let folds = 0, worst = Infinity; for (const q of S) { if (q.law !== 'guide' || air(q) || Math.abs(q.kappa) < 1e-6) continue; const R = 1 / Math.abs(q.kappa);
    const inner = q.kappa > 0 ? Math.max(...q.slots.map((v) => v[0])) : -Math.min(...q.slots.map((v) => v[0]));
    const m = R - inner; worst = Math.min(worst, m); if (m < tol.foldMargin) folds++; }
  add_('inner_edge_fold', folds === 0, folds, `min radius margin ${Number.isFinite(worst) ? worst.toFixed(2) : 'n/a'} m`);
  const step = Math.max(1, Math.round(2 / stream.ds)); let minC = Infinity, at = null;
  const total = S[S.length - 1].s, apart = (i, j) => (stream.closed ? Math.min(S[j].s - S[i].s, total - (S[j].s - S[i].s)) : S[j].s - S[i].s);
  const corners = S.map((q, i) => (i % step === 0 ? sectionCorners(q) : null));
  // v0.7: candidate pairs from a 60 m grid over the sample points (was all pairs; long tracks took seconds). Sections
  // reach at most ~18 m from their centre, so any pair outside the grid neighbourhood is > NEAR m apart; the value is
  // exact below NEAR and reported as >= NEAR above it.
  const CELL = 60, NEAR = 24, grid = new Map(), ck = (p) => p.map((c) => Math.floor(c / CELL));
  for (let i = 0; i < S.length; i += step) { const k = ck(S[i].p).join(','); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(i); }
  const near = (i) => { const [a, b, c] = ck(S[i].p), out = []; for (let x = a - 1; x <= a + 1; x++) for (let y = b - 1; y <= b + 1; y++) for (let z = c - 1; z <= c + 1; z++) { const l = grid.get(`${x},${y},${z}`); if (l) for (const j of l) if (j > i) out.push(j); } return out; };
  const pairsNear = []; for (let i = 0; i < S.length; i += step) for (const j of near(i)) if (apart(i, j) >= tol.clearanceFarM) pairsNear.push([i, j]);
  for (const [i, j] of pairsNear) {
    if (S[i].tags.includes('crossing_ok') && S[j].tags.includes('crossing_ok')) continue;
    for (const a of corners[i]) for (const b of corners[j]) { const d = len(sub(a, b)); if (d < minC) { minC = d; at = [+S[i].s.toFixed(1), +S[j].s.toFixed(1)]; } }
  }
  if (minC >= NEAR) { minC = Infinity; at = null; }
  add_('self_clearance', minC >= tol.clearance, Number.isFinite(minC) ? +minC.toFixed(3) : null, at ? `closest at s ${at[0]} / ${at[1]}` : `no far pairs closer than ${NEAR} m`);
  // designed crossings (both parts tagged crossing_ok): where the road surfaces overlap in plan, the lower road needs
  // car headroom under the upper deck. Proposal 2.2 m (cartoon car) + the upper deck depth.
  let minH = Infinity, atH = null, pairs = 0;
  const q14 = [...Array(14).keys()];
  const flat = (q) => { const xs = [q.slots[6][0], q.slots[7][0]]; return [add(q.p, mul(q.R, xs[0])), add(q.p, mul(q.R, xs[1]))]; };
  for (const [i, j] of pairsNear) {
    if (!(S[i].tags.includes('crossing_ok') && S[j].tags.includes('crossing_ok'))) continue;
    const a = S[i], b = S[j]; const [a0, a1] = flat(a), [b0, b1] = flat(b);
    // plan overlap: distance between the two road centre points in plan < sum of half widths
    const d = Math.hypot(a.p[0] - b.p[0], a.p[2] - b.p[2]);
    if (d > (a.prm.width + b.prm.width) / 2) continue;
    pairs++;
    const [lo, hi] = a.p[1] < b.p[1] ? [a, b] : [b, a];
    // v0.5: banked / warped decks: lowest point of the upper section vs highest road point of the lower one (conservative)
    const wy = (q, k) => q.p[1] + q.R[1] * q.slots[k][0] + q.U[1] * q.slots[k][1];
    const upperLow = Math.min(...q14.map((k) => wy(hi, k))), lowerRoad = Math.max(wy(lo, 6), wy(lo, 7));
    const hr = upperLow - lowerRoad;
    if (hr < minH) { minH = hr; atH = [lo.s.toFixed(1), hi.s.toFixed(1)]; }
  }
  if (pairs) add_('crossing_headroom', minH >= tol.headroom, +minH.toFixed(3), `lower road to upper underside (m), ${pairs} overlapping pairs, worst at s ${atH[0]} under ${atH[1]}`);
  // v0.7.1: the same crossings against the full vehicle envelope (tallest truck + reserve). Warning until the layouts
  // are raised: crossing_headroom keeps its cartoon-car threshold so the showcase tracks stay comparable.
  if (pairs) add_('vehicle_headroom', minH >= VEHICLE_HEADROOM, +minH.toFixed(3),
    `crossings vs vehicle envelope ${VEHICLE_ENVELOPE.height} m + ${VEHICLE_ENVELOPE.reserve} m reserve = ${VEHICLE_HEADROOM} m; worst at s ${atH[0]} under ${atH[1]}`, 'warn');
  // v0.6 landing_dip: a landing ramp must not dip more than 0.1 m below the height it runs out at (reads as a hole).
  // Buoy landings (bounce pads, skin 'buoy') are meant to squash and are exempt.
  { let worst = 0, at = null, run = [];
    const flush = () => { if (run.length > 1 && run[0].skin !== 'buoy') { const end = run[run.length - 1].p[1]; for (const q of run) if (end - q.p[1] > worst) { worst = end - q.p[1]; at = q.s; } } run = []; };
    for (const q of S) { if (q.tags.includes('landing')) run.push(q); else flush(); } flush();
    if (S.some((q) => q.tags.includes('landing'))) add_('landing_dip', worst < 0.1, +worst.toFixed(3), at != null ? `deepest dip below the run-out height at s ${at.toFixed(1)} (m)` : 'no dip'); }
  // v0.9 loop_scale (warn): classic big loops, measured in height (Georg 27.09)
  { const L = S.filter((q) => q.law === 'loop'); if (L.length) {
      const runs = []; let cur = null; for (let i = 0; i < S.length; i++) { if (S[i].law === 'loop') { if (!cur) runs.push(cur = [i, i]); cur[1] = i; } else cur = null; }
      const hs = runs.map(([a, b]) => { let m = -Infinity; for (let k = a; k <= b; k++) m = Math.max(m, S[k].p[1]); return [m - S[a].p[1], S[b].s - S[a].s]; });
      const hmin = Math.min(...hs.map((h) => h[0]));
      add_('loop_scale', hmin >= LOOP_MIN_H - 0.5, +hmin.toFixed(1), `smallest loop ${hmin.toFixed(1)} m high (${hs.map((h) => `${h[0].toFixed(0)} m / ${h[1].toFixed(0)} m ride`).join(', ')}); classic size from ${LOOP_MIN_H} m, default ${LOOP_DEFAULT_H} m`, 'warn'); } }
  // v0.11 transition_length (warn): the grammar's first production corridor is 60-100 m per zone
  if (stream.transitions?.length) { const L = stream.transitions.map((t) => t.length), bad = stream.transitions.filter((t) => t.length < TRANSITION.minLength - 0.5 || t.length > TRANSITION.maxLength + 0.5);
    add_('transition_length', !bad.length, +Math.min(...L).toFixed(1), `${stream.transitions.map((t) => `${t.id} ${t.from}→${t.to} ${t.length.toFixed(0)} m`).join(', ')}; corridor ${TRANSITION.minLength}–${TRANSITION.maxLength} m`, 'warn'); }
  // v0.9 width_taper (warn): width changes run at least WIDTH_TAPER m per metre and side (switch / split / open ends exempt)
  { const skip = (q) => q.tags.some((t) => t === 'switch' || t === 'split' || t === 'merge' || t === 'kicker' || t === 'landing' || t === 'SPLIT_HALF' || t === 'MERGE_HALF' || t === 'pit_junction');
    let worst = 0, at = null;
    for (let i = 1; i < S.length; i++) { if (skip(S[i]) || skip(S[i - 1]) || S[i].brk) continue; const ds = S[i].s - S[i - 1].s; if (ds <= 1e-9) continue;
      const sl = Math.abs(S[i].prm.width - S[i - 1].prm.width) / 2 / ds; if (sl > worst) { worst = sl; at = S[i].s; } }
    if (worst > 1e-6) { const eq = 1.875 / worst; add_('width_taper', eq >= WIDTH_TAPER * 0.95, +eq.toFixed(1), `shortest width transition ≈ 1:${eq.toFixed(0)} per side at s ${at.toFixed(1)} (rule 1:${WIDTH_TAPER})`, 'warn'); } }
  // v0.8.1 loop_envelope (Georg 27.09: trucks drive through loops too). Inside every loop, the whole vehicle envelope
  // (VEHICLE_HEADROOM along road-up, over the road width, over a heavy vehicle's length) must be free of any other part
  // of the track. Measured in the local frame of each loop sample against all deck points of the loop and its legs.
  { const Li = S.map((q, i) => (q.law === 'loop' ? i : -1)).filter((i) => i >= 0);
    if (Li.length) { const halfLen = LOOP_BODY_HALF, win = Math.round(60 / stream.ds); let worst = Infinity, at = null;
      const lo = Math.max(0, Li[0] - win), hi = Math.min(S.length - 1, Li[Li.length - 1] + win);
      for (const i of Li) { if (i % 2) continue; const q = S[i]; const r0 = Math.min(q.slots[6][0], q.slots[7][0]) - 0.5, r1 = Math.max(q.slots[6][0], q.slots[7][0]) + 0.5;
        for (let j = lo; j <= hi; j++) { const b = S[j]; if (Math.abs(b.s - q.s) < 2 * halfLen) continue; // own road under the body
          for (const sl of b.slots) { const d = sub(add(add(b.p, mul(b.R, sl[0])), mul(b.U, sl[1])), q.p);
            const t = dot(d, q.T), r = dot(d, q.R), u = dot(d, q.U);
            if (Math.abs(t) <= halfLen && r >= r0 && r <= r1 && u > 0.05 && u < worst) { worst = u; at = [q.s, b.s]; } } } }
      add_('loop_envelope', worst >= VEHICLE_HEADROOM, Number.isFinite(worst) ? +worst.toFixed(3) : null,
        at ? `min free height over the road inside loops ${worst.toFixed(2)} m (need ${VEHICLE_HEADROOM}), at s ${at[0].toFixed(1)} under s ${at[1].toFixed(1)}` : 'loops: nothing over the road within reach'); } }
  // jumps: designed lip speed must be reachable without boost (D1 27 m/s); above that = needs boost (warning)
  const js = S.filter((q) => q.designSpeed).map((q) => q.designSpeed);
  if (js.length) { const v = Math.max(...js); add_('jump_speed', v <= PHYS.vMax, +v.toFixed(2), `designed lip speed m/s vs ${PHYS.vMax} (above = boost needed)`, 'warn'); }
  if (stream.pads?.length) {
    // v0.6: every pad lies flush with the route where the route runs through it, and is reached by the route at all
    let worst = 0, missing = [];
    for (const pad of stream.pads) {
      const inside = S.filter((q) => inPoly(q.p[0], q.p[2], pad.outline));
      if (!inside.length) missing.push(pad.id);
      for (const q of inside) worst = Math.max(worst, Math.abs(q.p[1] - pad.y));
    }
    add_('pad_level', !missing.length && worst < 1e-3, +worst.toFixed(4), missing.length ? `not reached by the route: ${missing.join(', ')}` : 'max |route height - pad height| inside pads (m)');
  }
  if (stream.closed) {
    // circuit: end sample = start sample (position, frame, profile, skin). Joins without a seam.
    const a = S[0], b = S[S.length - 1];
    const gap = len(sub(a.p, b.p)), dT = 1 - dot(a.T, b.T), dU = 1 - dot(a.U, b.U);
    const prmDiff = Math.max(...Object.keys(PROFILE_DEFAULTS).map((k) => Math.abs(a.prm[k] - b.prm[k])));
    add_('closure', gap < 1e-6 && dT < 1e-9 && dU < 1e-9 && prmDiff < 1e-9 && a.skin === b.skin && a.marking === b.marking,
      +gap.toExponential(2), `end-start gap (m); 1-dot T ${dT.toExponential(1)}, U ${dU.toExponential(1)}; profile diff ${prmDiff.toExponential(1)}; skin ${a.skin}/${b.skin}`);
  }
  tunnelChecks(stream, tol, add_);
  add_('fingerprint', typeof stream.fingerprint === 'string' && stream.fingerprint.length === 8, stream.fingerprint);
  return { pass: res.every((r) => r.pass || r.severity === 'warn'), results: res };
}

// graph checks: every route alone + split/merge edge parity + clearance between routes outside split/merge pieces
export function runGraphChecks(g, tol = TOL) {
  const per = Object.fromEntries(Object.entries(g.routes).map(([k, s]) => [k, runChecks(s, tol)]));
  const res = [];
  const add_ = (id, pass, value, note) => res.push({ id, pass, value, note, severity: 'error' });
  const ids = Object.keys(g.routes);
  const sockets = Object.values(g.sockets ?? {}), nearSocket = (q) => sockets.some((k) => len(sub(q.p, k.p)) < k.width / 2 + SIDE_EXTENT + 1);   // v0.12: two routes meet end to end at a node socket
  const joinZone = (q) => q.tags.includes('SPLIT_HALF') || q.tags.includes('MERGE_HALF') || q.tags.includes('CONNECT') || q.tags.includes('pit_junction') || q.tags.includes('deck_shared') || (sockets.length > 0 && nearSocket(q));
  for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
    const A = g.routes[ids[a]].samples, B = g.routes[ids[b]].samples, step = 4;
    let minC = Infinity, at = null;
    const cB = B.map((q, i) => (i % step === 0 && !joinZone(q) ? sectionCorners(q) : null));
    for (let i = 0; i < A.length; i += step) { if (joinZone(A[i])) continue; const ca = sectionCorners(A[i]);
      for (let j = 0; j < B.length; j += step) { if (!cB[j]) continue; for (const x of ca) for (const y of cB[j]) { const d = len(sub(x, y)); if (d < minC) { minC = d; at = [A[i].s.toFixed(1), B[j].s.toFixed(1)]; } } } }
    add_(`cross_clearance ${ids[a]}|${ids[b]}`, minC >= tol.crossClearance, Number.isFinite(minC) ? +minC.toFixed(3) : null, at ? `closest at s ${at[0]} / ${at[1]} (split/merge/connect zones excluded)` : '');
    // split edge parity: at the first split sample both lanes share the inner edge and keep the parent's outer edges
    const sa = A.find((q) => q.tags.includes('SPLIT_HALF') && !q.tags.includes('branch'));
    const sb = B.find((q) => q.tags.includes('SPLIT_HALF') && q.tags.includes('branch'));
    if (sa && sb) {
      const w = (q, k) => add(q.p, mul(q.R, q.slots[SLOTS.indexOf(k)][0]));
      const d = Math.min(len(sub(w(sa, 'road_L'), w(sb, 'road_R'))), len(sub(w(sa, 'road_R'), w(sb, 'road_L'))));
      add_(`split_edge ${ids[a]}|${ids[b]}`, d < 1e-3, +d.toFixed(6), 'inner road edges of both lanes coincide at the split start (m)');
    }
    // v0.7 tube shells between routes (either way), split / merge / connect zones excluded like cross_clearance
      for (const k of [ids[a], ids[b]]) if (g.routes[k].tunnelRings) attachRings(g.routes[k]);
  if (A.some((q) => q.tunnel) || B.some((q) => q.tunnel)) {
      const pick = (X, key) => X.filter((q, i) => q.tunnel && i % 2 === 0 && !joinZone(q)).map((q) => ({ q, key }));
      const pts = (X, key) => passPoints(X.filter((q) => !joinZone(q)), key, 2);
      const r1 = shellClearance(pick(A, ids[a]), pts(B, ids[b]), () => true, tol.tunnelRock);
      const r2 = shellClearance(pick(B, ids[b]), pts(A, ids[a]), () => true, tol.tunnelRock);
      const r = r1.minD <= r2.minD ? r1 : r2;
      add_(`tunnel_shell ${ids[a]}|${ids[b]}`, r1.hits + r2.hits === 0, Number.isFinite(r.minD) ? +r.minD.toFixed(3) : null,
        r.at ? `min rock between the routes' tube shells / decks (m), tube ${r.at[1]} s ${r.at[0]} vs ${r.at[3]} s ${r.at[2]}` : 'no tube near the other route');
    }
    const ma = [...A].reverse().find((q) => q.tags.includes('MERGE_HALF') && !q.tags.includes('branch'));
    const mb = [...B].reverse().find((q) => q.tags.includes('MERGE_HALF') && q.tags.includes('branch'));
    if (ma && mb) add_(`merge_end ${ids[a]}|${ids[b]}`, len(sub(ma.p, mb.p)) < 1e-6 && dot(ma.T, mb.T) > 1 - 1e-9, +len(sub(ma.p, mb.p)).toFixed(6), 'branch ends on the main axis frame');
  }
  if (g.pads?.length) {
    // pads over all routes: flush with every route that runs through them, reached by at least one
    const all = Object.values(g.routes).flatMap((r) => r.samples);
    let worst = 0; const missing = [];
    for (const pad of g.pads) { const inside = all.filter((q) => inPoly(q.p[0], q.p[2], pad.outline)); if (!inside.length) missing.push(pad.id);
      for (const q of inside) worst = Math.max(worst, Math.abs(q.p[1] - pad.y)); }
    add_('pad_level', !missing.length && worst < 1e-3, +worst.toFixed(4), missing.length ? `not reached: ${missing.join(', ')}` : 'max |route height - pad height| inside pads (m)');
  }
  for (const nb of g._nodes ?? []) nodeChecks(g, nb, add_, (id, pass, value, note) => res.push({ id, pass, value, note, severity: 'warn' }));
  return { pass: Object.values(per).every((r) => r.pass) && res.every((r) => r.pass || r.severity === 'warn'), routes: per, results: res };
}
// v0.12 node checks: fit, seamless mouths, NPC paths clear of every kerb, other routes off the plate, level sockets
export const NODE_TOL = Object.freeze({ mouth: 1e-3, pathClear: VEHICLE_ENVELOPE.width / 2, pathRadius: 8 });
function nodeChecks(g, nb, add_, warn_) {
  const id = nb.id, shrunk = nb.arms.filter((a) => a.fillet < a.filletAsked - 1e-6);
  add_(`node_fit ${id}`, nb.ringArcs.every((v) => v >= -1e-6), Math.min(...nb.ringArcs), `shortest ring kerb between two fillets (m); ${shrunk.length ? `fillets shrunk to fit: ${shrunk.map((a) => `${a.id} ${a.fillet} m`).join(', ')}` : 'all fillets as asked'}`);
  // mouths: the arm route's end section sits exactly on the plate outline's mouth corners, heading along the arm
  let worst = 0, headErr = 0, missing = [];
  for (const a of nb.arms) {
    const rid = Object.keys(g.routes).find((k) => g.routes[k].samples.some((q) => q.tags.includes(`node:${id}`) && q.tags.includes(`arm:${a.id}`)));
    if (!rid) { missing.push(a.id); continue; }
    const S = g.routes[rid].samples.filter((q) => q.tags.includes(`node:${id}`) && q.tags.includes(`arm:${a.id}`));
    const q = [S[0], S[S.length - 1]].reduce((b, x) => (len(sub(x.p, a.mouth.p)) < len(sub(b.p, a.mouth.p)) ? x : b));
    const e = (i) => add(q.p, mul(q.R, q.slots[i][0]));
    const d = Math.min(Math.max(len(sub(e(6), a.corners[0])), len(sub(e(7), a.corners[1]))), Math.max(len(sub(e(6), a.corners[1])), len(sub(e(7), a.corners[0]))));
    worst = Math.max(worst, d, len(sub(q.p, a.mouth.p))); headErr = Math.max(headErr, 1 - Math.abs(dot(q.T, a.mouth.T)));
  }
  add_(`node_mouth ${id}`, !missing.length && worst < NODE_TOL.mouth && headErr < 1e-6, +worst.toExponential(2), missing.length ? `arms without a route: ${missing.join(', ')}` : 'max distance arm route end section <-> plate mouth corners (m), headings aligned');
  // NPC paths: every point keeps half a vehicle width from each kerb line, the island kerb and the splitter islands
  const C2 = [nb.center[0], nb.center[2]], kp = nb._kerbs.filter((k) => k.kind === 'outer').flatMap((k) => k._p);
  const inPoly2 = (x, z, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, zi] = P[i], [xj, zj] = P[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
  let minC = Infinity, at = '', rMin = Infinity, rAt = '';
  for (const P of nb.paths) {
    if (P.minRadius != null && P.minRadius < rMin) { rMin = P.minRadius; rAt = P.id; }
    for (let i = 0; i < P.pts.length; i += 2) { const [x, , z] = P.pts[i];
      let d = Math.hypot(x - C2[0], z - C2[1]) - nb.island;
      for (const k of kp) d = Math.min(d, Math.hypot(x - k[0], z - k[1]));
      for (const sp of nb._splitters) { if (inPoly2(x, z, sp.poly)) d = -1; else for (const k of sp.poly) d = Math.min(d, Math.hypot(x - k[0], z - k[1])); }
      if (d < minC) { minC = d; at = P.id; } } }
  add_(`node_paths ${id}`, minC >= NODE_TOL.pathClear, +minC.toFixed(3), `${nb.paths.length} paths; smallest distance of a lane centre to a kerb or island (m), at ${at}; needs ${NODE_TOL.pathClear} m (half a vehicle)`);
  warn_(`node_path_radius ${id}`, rMin >= NODE_TOL.pathRadius, rMin, `tightest turn of the NPC paths (m), ${rAt}`);
  // other routes stay off the plate + kerbs (the node's own arm pieces excepted)
  const outer = nb._outer; let hits = 0, hitAt = '';
  for (const [rid, r] of Object.entries(g.routes)) for (let i = 0; i < r.samples.length; i += 2) { const q = r.samples[i];
    if (q.tags.includes(`node:${id}`)) continue;
    for (const k of [0, 6, 7, 13]) { const p = add(q.p, mul(q.R, q.slots[k][0])); const x = p[0], z = p[2];
      let inside = inPoly2(x, z, outer) && Math.abs(p[1] - nb.y) < VEHICLE_HEADROOM;
      if (!inside && Math.abs(p[1] - nb.y) < VEHICLE_HEADROOM) for (let j = 0; j < outer.length; j += 2) if (Math.hypot(x - outer[j][0], z - outer[j][1]) < SIDE_EXTENT) { inside = true; break; }
      if (inside) { hits++; if (!hitAt) hitAt = `${rid} s ${q.s.toFixed(1)}`; break; } } }
  add_(`node_clear ${id}`, hits === 0, hits, hits ? `route samples on the roundabout plate or its kerbs, first at ${hitAt}` : 'no other route crosses the plate or its kerbs');
  const sk = nb.arms.map((a) => a.socket), lvl = Math.max(...sk.map((s) => Math.abs(s.p[1] - nb.y))), orth = Math.max(...sk.map((s) => Math.abs(dot(s.T, s.U)) + Math.abs(dot(s.T, s.R)) + Math.abs(len(s.T) - 1)));
  add_(`node_sockets ${id}`, sk.length === nb.arms.length && lvl < 1e-9 && orth < 1e-3, sk.length, 'one level socket per arm with an orthonormal frame');
}

// ---------------------------------------------------------------- fingerprint (FNV-1a over a rounded stream)
export function fingerprint(stream) {
  let h = 0x811c9dc5;
  const feed = (str) => { for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } };
  for (const q of stream.samples) feed([q.s, ...q.p, ...q.U, q.bank].map((v) => v.toFixed(4)).join(','));
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function slotWorld(sample, slotIndex) {
  const [lat, lift] = sample.slots[slotIndex];
  return add(add(sample.p, mul(sample.R, lat)), mul(sample.U, lift));
}
