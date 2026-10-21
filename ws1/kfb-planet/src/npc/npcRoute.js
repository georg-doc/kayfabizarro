// WS-NPC A0 · Routen `kfb.npc-route/1` (SPEC_NPC_PATROL_R1 Punkt 1: Polylinie mit Punkten in Welt-xz, J17-Meter). Rein: ohne three, ohne DOM, Node-geprüft.
// Eine Route verbindet zwei POIs (from → to); je Paar gibt es Varianten (Brief Phase A: zwei Routen-Varianten). Die Lage bei Wegstrecke s ist exakt
// (Fahrplan statt Simulation): wer die Route kennt, weiß zu jeder Zeit, wo der Bewohner ist. Ecken werden mit einem Kreisbogen (r) abgerundet, damit
// sich die Blickrichtung nicht sprunghaft dreht; die Länge zählt mit Bögen.

export const ROUTE_SCHEMA = 'kfb.npc-route/1'
export const ROUTE_RULES = Object.freeze({ cornerR: 1.2, arcSteps: 6, minSeg: 0.05 })

// Polylinie mit abgerundeten Ecken (Bogen tangential an beide Schenkel, Radius begrenzt durch die halbe Schenkellänge)
export function smoothPolyline(pts, r = ROUTE_RULES.cornerR, steps = ROUTE_RULES.arcSteps) {
  if (pts.length < 3 || r <= 0) return pts.map((p) => [p[0], p[1]])
  const out = [[pts[0][0], pts[0][1]]]
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, az] = pts[i - 1], [bx, bz] = pts[i], [cx, cz] = pts[i + 1]
    const l1 = Math.hypot(bx - ax, bz - az), l2 = Math.hypot(cx - bx, cz - bz)
    const u1 = [(ax - bx) / l1, (az - bz) / l1], u2 = [(cx - bx) / l2, (cz - bz) / l2]
    const cosT = Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])), theta = Math.acos(cosT) // Innenwinkel an der Ecke
    if (theta > Math.PI - 1e-3) { out.push([bx, bz]); continue } // gerade
    const t = Math.min(r / Math.tan(theta / 2), l1 / 2, l2 / 2) // Abstand Ecke → Tangentenpunkt
    const p1 = [bx + u1[0] * t, bz + u1[1] * t], p2 = [bx + u2[0] * t, bz + u2[1] * t]
    // Bogen als quadratische Bézier-Kurve p1 → Ecke → p2 (für kleine Radien gleichwertig, ohne Kreismittelpunkt-Fälle)
    for (let k = 0; k <= steps; k++) { const s = k / steps, a = (1 - s) * (1 - s), b = 2 * (1 - s) * s, c = s * s; out.push([a * p1[0] + b * bx + c * p2[0], a * p1[1] + b * bz + c * p2[1]]) }
  }
  out.push([pts.at(-1)[0], pts.at(-1)[1]])
  return out.filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-6)
}

export function validateRoute(r) {
  const err = []
  if (!r || typeof r !== 'object') return ['route: kein Objekt']
  if (typeof r.id !== 'string' || !r.id) err.push('id fehlt')
  if (!Array.isArray(r.points) || r.points.length < 2) err.push(`${r.id}: points < 2`)
  else r.points.forEach((p, i) => { if (!Array.isArray(p) || p.length !== 2 || !p.every(Number.isFinite)) err.push(`${r.id}: Punkt ${i} ungültig`) })
  if (typeof r.from !== 'string' || typeof r.to !== 'string') err.push(`${r.id}: from/to fehlen`)
  return err
}

// Route vorbereiten: geglättete Punkte, kumulierte Längen; at(s) → { x, z, yaw, s, u } (yaw: Drehung um +Y, Figur schaut lokal +Z)
export function createRoute(def, { cornerR = ROUTE_RULES.cornerR } = {}) {
  const e = validateRoute(def); if (e.length) throw new Error('ROUTE_INVALID: ' + e.join('; '))
  const pts = smoothPolyline(def.points, def.cornerR ?? cornerR)
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const length = cum.at(-1)
  const yawOf = (i) => { const a = pts[Math.max(0, Math.min(pts.length - 2, i))], b = pts[Math.max(1, Math.min(pts.length - 1, i + 1))]; return Math.atan2(b[0] - a[0], b[1] - a[1]) }
  function at(s) {
    const q = Math.max(0, Math.min(length, s))
    let lo = 0, hi = cum.length - 1
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= q) lo = m; else hi = m }
    const seg = cum[hi] - cum[lo], u = seg > 0 ? (q - cum[lo]) / seg : 0
    return { x: pts[lo][0] + (pts[hi][0] - pts[lo][0]) * u, z: pts[lo][1] + (pts[hi][1] - pts[lo][1]) * u, yaw: yawOf(lo), s: q, u: length > 0 ? q / length : 1 }
  }
  // Abtastung für Prüfungen (Zaun, Bäume, Steigung): alle step Meter ein Punkt
  const sample = (step = 0.5) => { const out = []; for (let s = 0; s < length; s += step) out.push(at(s)); out.push(at(length)); return out }
  return { id: def.id, from: def.from, to: def.to, variant: def.variant ?? null, points: pts, length, at, sample }
}

// Kürzester Abstand Punkt → Strecke (xz)
export function distPointSeg(x, z, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz, t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0
  return Math.hypot(x - ax - dx * t, z - az - dz * t)
}
