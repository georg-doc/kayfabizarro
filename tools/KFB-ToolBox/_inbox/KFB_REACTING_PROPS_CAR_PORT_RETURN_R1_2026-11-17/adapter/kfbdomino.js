// KFB domino chain: where the tiles stand, and how far each one has fallen for a given position of the falling front.
// The pose is a pure function of the front u (in tiles, may be fractional): driving u forward topples the run, driving it back stands it up again.
// That makes the same run usable on a scroll bar (website) and in the game. Real collisions take over through kfbtoys.js the moment something hits a tile.
// Own code. Geometry of a leaning run: tile i rests on tile i+1 when the gap seen along its face equals the thickness, so cos(rest) = thick / gap.

export const DOMINO = { height: 2.4, thick: 0.3, gap: 1.5, pace: 1.5, lift: 1.7, settle: 1.6, bounce: 0.05 }   // pace: front speed = pace * sqrt(g * height); lift: how late and sharply a tile accelerates; bounce: small rebound on landing (radians)

// angle from upright (radians, 0 = standing) of tile i out of n, for the front at u
export function chainAngle(i, u, { height = DOMINO.height, thick = DOMINO.thick, gap = DOMINO.gap, n = Infinity, lift = DOMINO.lift, settle = DOMINO.settle, bounce = DOMINO.bounce } = {}) {
  const tau = u - i; if (!(tau > 0)) return 0
  const reach = Math.min(1, Math.max(0, (gap - thick) / height)), strike = Math.asin(reach)             // angle at which the top edge meets the next tile
  const rest = i >= n - 1 ? Math.PI / 2 : gap > thick ? Math.acos(Math.min(1, thick / gap)) : strike    // the last one lies flat, the others lean on their neighbour
  if (tau <= 1) return strike * Math.pow(tau, lift)
  const k = tau - 1; return strike + (rest - strike) * (1 - Math.exp(-settle * k)) - bounce * Math.exp(-2.2 * k) * Math.sin(7 * k)
}

// tiles per second of the falling front
export const chainPace = ({ height = DOMINO.height, gap = DOMINO.gap, pace = DOMINO.pace, gravity = 9.81 } = {}) => pace * Math.sqrt(gravity * height) / gap

// spots along a path: at(s) → { x, y, z, yaw } for the distance s along it; returns what kfbfield's add() takes, each with its place in the chain
export function layChain(at, { n = 40, gap = DOMINO.gap, start = 0, group = 'run', fall = -1, extra = {} } = {}) {
  const out = []; for (let i = 0; i < n; i++) out.push({ ...at(start + i * gap), group, chain: { i, n, gap, fall }, ...extra }); return out
}

// A leaning tile pivots on its lower edge instead of sinking into the ground. For the signed tilt (fall * angle, about the tile's local x axis)
// this returns how far the foot moves, in the tile's own frame before the yaw: add it to the spot.
export const hingeOffset = (tilt, thick = DOMINO.thick, fall = -1) => { const e = fall * thick / 2; return { y: Math.sin(tilt) * e, z: e * (1 - Math.cos(tilt)) } }
