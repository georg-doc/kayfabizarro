/* Track chain generator · the Race-Track-Builder mechanic in the browser.

   A track is authored as a SEQUENCE of tokens, not as coordinates. Every transform is derived
   from the part's own measured bounding box, so nothing is guessed and a piece swap cannot
   silently break the chain.

   Measured facts about the Kenney racing kit (runtime probe, see the Maße table in the page):
   - lane width = 1 module; straights run along local −Z; `roadStraightLong` is 1 × 2
   - part origins are NOT centred: roadStraight spans x −0.35…0.65, z −1.65…−0.65
   - the DRIVING SURFACE is not the tile box: `roadStart` keeps its gantry in the same 1×2 tile
     and its asphalt sits **0.13 off-centre**. Deriving the lane from the tile box put the start
     tile 0.13 sideways off the track (the step at the gate in the S3 screenshot, 2026-09-16),
     and an AABB joint audit cannot see it — touching boxes report a gap of 0 either way.
     Therefore every connector comes from `measureSurface()`: the asphalt mesh per tile edge.
   - a corner occupies an n × n footprint; its openings are measured, not assumed at n/2
   - a LEFT turn is the same part traversed in reverse (enter at the exit) — no mirroring, so
     normals and kerbs stay correct
*/

export const TOKENS = {
  G:  { a: 'racing:roadStart',            kind: 'straight', label: 'Start/Ziel' },
  S:  { a: 'racing:roadStraight',         kind: 'straight', label: 'Gerade' },
  SL: { a: 'racing:roadStraightLong',     kind: 'straight', label: 'Gerade lang' },
  A:  { a: 'racing:roadStraightArrow',    kind: 'straight', label: 'Gerade mit Pfeil' },
  B:  { a: 'racing:roadStraightLongBump', kind: 'straight', label: 'Bodenwelle' },
  R:  { a: 'racing:roadRamp',             kind: 'straight', label: 'Rampe' },
  X:  { a: 'racing:roadCrossing',         kind: 'straight', label: 'Kreuzung' },
  P:  { a: 'racing:roadPitStraight',      kind: 'straight', label: 'Boxengasse' },
  CR: { a: 'racing:roadCornerSmall',  kind: 'corner', turn: 'R', label: 'Kurve eng rechts' },
  CL: { a: 'racing:roadCornerSmall',  kind: 'corner', turn: 'L', label: 'Kurve eng links' },
  MR: { a: 'racing:roadCornerLarge',  kind: 'corner', turn: 'R', label: 'Kurve mittel rechts' },
  ML: { a: 'racing:roadCornerLarge',  kind: 'corner', turn: 'L', label: 'Kurve mittel links' },
  XR: { a: 'racing:roadCornerLarger', kind: 'corner', turn: 'R', label: 'Kurve weit rechts' },
  XL: { a: 'racing:roadCornerLarger', kind: 'corner', turn: 'L', label: 'Kurve weit links' },
  RU:  { a: 'racing:roadRamp',     kind: 'ramp', turn: 'U', rise: 0.26, label: 'Rampe hoch (kurz)' },
  RD:  { a: 'racing:roadRamp',     kind: 'ramp', turn: 'D', rise: 0.26, label: 'Rampe runter (kurz)' },
  RLU: { a: 'racing:roadRampLong', kind: 'ramp', turn: 'U', rise: 0.51, label: 'Rampe hoch (lang)' },
  RLD: { a: 'racing:roadRampLong', kind: 'ramp', turn: 'D', rise: 0.51, label: 'Rampe runter (lang)' }
};

/* heading convention: 0 = travel along −Z, +90 = along +X (clockwise) */
const DIR = { '-Z': 0, '+X': 90, '+Z': 180, '-X': 270 };
const rad = (d) => (d * Math.PI) / 180;
const f = (h) => [Math.sin(rad(h)), -Math.cos(rad(h))];              // world forward (x,z)
const rot = (p, deg) => {                                            // local point -> world offset
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return [p[0] * c + p[1] * s, -p[0] * s + p[1] * c];
};

/* connector frame of one part, measured from its asphalt (lib/kit-lab.js · measureSurface).
   `surf.edges.<edge>.mid` is the centre of the opening in that edge — that IS the lane. */
export function connectors(surf, kind, turn, module, rise) {
  const b = surf.bbox;
  const laneIn = surf.edges.zmax ? surf.edges.zmax.mid : (b.minx + b.maxx) / 2;
  if (kind === 'straight') {
    const laneOut = surf.edges.zmin ? surf.edges.zmin.mid : laneIn;
    return { pE: [laneIn, b.maxz], dE: DIR['-Z'], pX: [laneOut, b.minz], dX: DIR['-Z'], delta: 0,
             len: b.maxz - b.minz, lane: laneIn };
  }
  if (kind === 'ramp') {
    /* same 1-module footprint as a straight — the mesh itself carries the slope. Local zmax
       (entry, low end) sits at y 0, local zmin (exit) sits at y +rise. A DOWN ramp is the same
       part traversed backwards (enter at the high end), same trick as an L corner — the surface
       geometry stays correct, only the accumulated world height moves the other way. */
    const laneOut = surf.edges.zmin ? surf.edges.zmin.mid : laneIn;
    const len = b.maxz - b.minz;
    if (turn !== 'D') return { pE: [laneIn, b.maxz], dE: DIR['-Z'], pX: [laneOut, b.minz], dX: DIR['-Z'],
             delta: 0, len, lane: laneIn, dy: rise, yshift: 0 };
    return { pE: [laneOut, b.minz], dE: DIR['+Z'], pX: [laneIn, b.maxz], dX: DIR['+Z'],
             delta: 0, len, lane: laneOut, dy: -rise, yshift: -rise };
  }
  const footprint = Math.round((b.maxx - b.minx) / module);
  const exitZ = surf.edges.xmax ? surf.edges.xmax.mid : (b.minz + b.maxz) / 2;
  const fwdIn = { pE: [laneIn, b.maxz], dE: DIR['-Z'] };                // enters at the +Z edge
  const fwdOut = { pX: [b.maxx, exitZ], dX: DIR['+X'] };                // leaves at the +X edge
  if (turn === 'R') return { ...fwdIn, ...fwdOut, delta: 90, footprint, lane: laneIn };
  /* left turn = same arc driven backwards */
  return {
    pE: fwdOut.pX, dE: DIR['-X'],
    pX: fwdIn.pE, dX: DIR['+Z'],
    delta: -90, footprint, lane: laneIn
  };
}

/* tokens: token keys · surfaceOf(assetRef) -> measured SURFACE record · module: lane width */
export function chain(tokens, surfaceOf, module) {
  const placements = [];
  const log = [];
  let x = 0, z = 0, h = 0, y = 0;
  const start = { x, z, h, y };

  for (const key of tokens) {
    const def = TOKENS[key];
    if (!def) { log.push({ key, error: 'unbekanntes Token' }); continue; }
    const surf = surfaceOf(def.a);
    if (!surf) { log.push({ key, error: 'Fahrbahn nicht gemessen' }); continue; }

    const c = connectors(surf, def.kind, def.turn, module, def.rise);
    const theta = c.dE - h;                                          // local frame -> heading
    const off = rot(c.pE, theta);
    const step = rot([c.pX[0] - c.pE[0], c.pX[1] - c.pE[1]], theta);
    const placeY = y + (c.yshift || 0);
    placements.push({
      a: def.a, p: [x - off[0], placeY, z - off[1]], r: theta, token: key, hdg: h,
      entryW: [+x.toFixed(4), +z.toFixed(4)], exitW: [+(x + step[0]).toFixed(4), +(z + step[1]).toFixed(4)],
      hdgOut: ((h + c.delta) % 360 + 360) % 360, y: +placeY.toFixed(3), yIn: +y.toFixed(3), yOut: +(y + (c.dy || 0)).toFixed(3)
    });

    x += step[0]; z += step[1];
    h = ((h + c.delta) % 360 + 360) % 360;
    y += (c.dy || 0);
    log.push({ key, heading: h, len: c.len, footprint: c.footprint, lane: +c.lane.toFixed(3) });
  }

  const gap = Math.hypot(x - start.x, z - start.z);
  const headingError = ((h - start.h) % 360 + 360) % 360;
  const heightError = +(y - start.y).toFixed(3);
  return { placements, log, closure: { gap, headingError, heightError }, end: { x, z, h, y } };
}

/* Joint audit on the CONNECTOR POINTS, not on bounding boxes. Two tiles whose boxes touch can
   still be half a lane apart sideways; that is the error class the box audit called clean. */
export function auditLanes(placements, opts = {}) {
  const tol = opts.tolerance ?? 0.01;
  const joints = [];
  for (let i = 0; i < placements.length; i++) {
    const a = placements[i], b = placements[(i + 1) % placements.length];
    if (!a.exitW || !b.entryW) continue;
    const d = Math.hypot(a.exitW[0] - b.entryW[0], a.exitW[1] - b.entryW[1]);
    const dh = Math.abs(((b.hdg - a.hdgOut) % 360 + 360) % 360);
    const dy = +Math.abs((a.yOut ?? 0) - (b.yIn ?? b.y ?? 0)).toFixed(4);
    joints.push({ i, a: a.token, b: b.token, off: +d.toFixed(4), turn: dh === 0 || dh === 360 ? 0 : dh, dy, wrap: i === placements.length - 1 });
  }
  const bad = joints.filter((j) => j.off > tol || j.turn !== 0 || j.dy > tol);
  return { joints, bad, worst: +joints.reduce((m, j) => Math.max(m, j.off), 0).toFixed(4), clean: bad.length === 0 };
}

export const PRESETS = {
  'Bruecke (S3b)': 'G S XR RLU S S S S RLD MR S S S S S CR S S S S S S S S S S MR',
  'Oval': 'G S MR S S MR S SL S MR S S MR S',
  'Oval weit': 'G SL XR SL XR SL SL XR SL XR',
  'Stadtkurs': 'G S CR S S CR S SL S CR S S CR S',
  'Slalom': 'G S MR S CR CL CL CR S MR S SL S MR S CR CL CL CR S MR S',
  'Haarnadel': 'G MR MR S S MR MR',
  'Rampenkurs': 'G S MR S R S MR S SL S MR S R S MR S'
};
