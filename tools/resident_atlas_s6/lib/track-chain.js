/* Track chain generator · the Race-Track-Builder mechanic in the browser.

   A track is authored as a SEQUENCE of tokens, not as coordinates. Every transform is derived
   from the part's own measured bounding box, so nothing is guessed and a piece swap cannot
   silently break the chain.

   Measured facts about the Kenney racing kit (runtime bbox, see the Maße table in the page):
   - lane width = 1 module; straights run along local −Z; `roadStraightLong` is 1 × 2
   - part origins are NOT centred: roadStraight spans x −0.35…0.65, z −1.65…−0.65
   - a corner occupies an n × n footprint, enters at the middle of its +Z edge and leaves at the
     middle of its +X edge → the default corner is a RIGHT turn
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
  XL: { a: 'racing:roadCornerLarger', kind: 'corner', turn: 'L', label: 'Kurve weit links' }
};

/* heading convention: 0 = travel along −Z, +90 = along +X (clockwise) */
const DIR = { '-Z': 0, '+X': 90, '+Z': 180, '-X': 270 };
const rad = (d) => (d * Math.PI) / 180;
const f = (h) => [Math.sin(rad(h)), -Math.cos(rad(h))];              // world forward (x,z)
const rot = (p, deg) => {                                            // local point -> world offset
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return [p[0] * c + p[1] * s, -p[0] * s + p[1] * c];
};

/* connector frame of one part, straight from its bbox */
export function connectors(entry, kind, turn, module) {
  const [minX, , minZ] = entry.min, [maxX, , maxZ] = entry.max;
  const lane = minX + module / 2;                                    // lane centre in x
  if (kind === 'straight') {
    return { pE: [lane, maxZ], dE: DIR['-Z'], pX: [lane, minZ], dX: DIR['-Z'], delta: 0,
             len: maxZ - minZ };
  }
  const fwdIn = { pE: [lane, maxZ], dE: DIR['-Z'] };                 // enters at +Z edge
  const fwdOut = { pX: [maxX, minZ + module / 2], dX: DIR['+X'] };   // leaves at +X edge
  if (turn === 'R') return { ...fwdIn, ...fwdOut, delta: 90, footprint: Math.round((maxX - minX) / module) };
  /* left turn = same arc driven backwards */
  return {
    pE: fwdOut.pX, dE: DIR['-X'],
    pX: fwdIn.pE, dX: DIR['+Z'],
    delta: -90, footprint: Math.round((maxX - minX) / module)
  };
}

/* tokens: token keys · entryOf(assetRef) -> measured record · module: lane width */
export function chain(tokens, entryOf, module) {
  const placements = [];
  const log = [];
  let x = 0, z = 0, h = 0;
  const start = { x, z, h };

  for (const key of tokens) {
    const def = TOKENS[key];
    if (!def) { log.push({ key, error: 'unbekanntes Token' }); continue; }
    const rec = entryOf(def.a);
    if (!rec) { log.push({ key, error: 'Teil nicht geladen' }); continue; }

    const c = connectors(rec, def.kind, def.turn, module);
    const theta = c.dE - h;                                          // local frame -> heading
    const off = rot(c.pE, theta);
    placements.push({ a: def.a, p: [x - off[0], 0, z - off[1]], r: theta, token: key, hdg: h });

    const step = rot([c.pX[0] - c.pE[0], c.pX[1] - c.pE[1]], theta);
    x += step[0]; z += step[1];
    h = ((h + c.delta) % 360 + 360) % 360;
    log.push({ key, heading: h, len: c.len, footprint: c.footprint });
  }

  const gap = Math.hypot(x - start.x, z - start.z);
  const headingError = ((h - start.h) % 360 + 360) % 360;
  return { placements, log, closure: { gap, headingError }, end: { x, z, h } };
}

export const PRESETS = {
  'Oval': 'G S MR S S MR S SL S MR S S MR S',
  'Oval weit': 'G SL XR SL XR SL XR SL XR',
  'Stadtkurs': 'G S CR S S CL S CR S S CR S CL S CR S',
  'Slalom': 'G S CR CL S CR CL S CR CL S',
  'Haarnadel': 'G SL CR CR SL CL CL SL',
  'Rampenkurs': 'G S R B S MR S MR S R B S MR S MR'
};
