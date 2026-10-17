// Slice 1 · Terrain-Anschluss der Dioramen (V-341, V-342) aus den Bühnen-Rändern kfb.stage-edges/1 (WS0, Branch data/kfb-stage-edges-r1-2026-10-16
// @d4e24f15, Kopie src/data/stages/kfb-stage-edges.r1.json). Rein: ohne three, ohne DOM, in Node prüfbar (test/unit/terrainStitch.mjs).
// Einheiten: Eingang u wie marks im Slot-JSON, Ausgang Meter der Bühne. Umrechnung wie meshyStage.js: p_m = (x·s, (y − floorY)·s, z·s),
// s = scale_m_per_u (Meshy-Slots rechnen schon in WS0-Metern, V-345: kein WORLD_K-Faktor auf Bühnen-Daten).
// terrainMode (WS0-Regel im Datei-Kopf): ground → Anschluss am footprint · plinth → am footprintBase (Sockel giza_pyramid, portal_ruin) ·
// island → kein Anschluss (schwebende Insel, Felsrand bleibt sichtbar) → null.
// Ring = Schürze aus Innenring (Bühnenrand) und Außenring (um skirt_m nach außen versetzt); dazwischen blendet die Farbe vom Rand (edge) in den
// Zonenboden (ground = fromColors(edgePalette).flat.top, V-342). Höhe innen = Bühnenboden, außen = outerY (Zahl oder height(x, z) des Geländes).
// Konvention WS0: Umriss im Uhrzeigersinn von oben (x rechts, +z zum Betrachter) ⇔ Shoelace-Fläche in (x, z) > 0.
import { fromColors, hexToOklab, oklchToHex } from '../vendor/palette/kfb-cartoon-palette.js'

export const STITCH = Object.freeze({ skirt_m: 4, rings: 3, cell_m: 0.2, maxCells: 480, spacing_m: 0.6, plinthDrop_m: 0 })
export const STITCH_SCHEMA = 'kfb.stage-edges/1'

// ---------------------------------------------------------------- Ring-Geometrie (2D, xz)
export const signedAreaXZ = (pts) => { let a = 0; for (let i = 0, n = pts.length; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; a += p[0] * q[1] - q[0] * p[1] } return a / 2 }
export const isClockwise = (pts) => signedAreaXZ(pts) > 0 // WS0: „clockwise seen from above“
// Ring schließen: doppelten Schlusspunkt und Nachbar-Dubletten entfernen, Umlaufsinn auf Uhrzeigersinn (von oben) bringen
export function normalizeRing(pts, eps = 1e-9) {
  const out = []
  for (const p of pts) { const q = out[out.length - 1]; if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > eps) out.push([p[0], p[1]]) }
  while (out.length > 2 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) <= eps) out.pop()
  if (out.length < 3) throw new Error('RING_DEGENERATE: ' + out.length + ' Punkte')
  return isClockwise(out) ? out : out.reverse()
}
export function pointInRing(pt, pts) {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, zi] = pts[i], [xj, zj] = pts[j]
    if ((zi > pt[1]) !== (zj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - zi)) / (zj - zi) + xi) inside = !inside
  }
  return inside
}
// Kantenschnitt (für die Prüfung „Ring einfach“, ohne Nachbarkanten)
const cross = (ax, az, bx, bz) => ax * bz - az * bx
function segHit(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = cross(r[0], r[1], s[0], s[1]); if (Math.abs(den) < 1e-12) return false
  const t = cross(c[0] - a[0], c[1] - a[1], s[0], s[1]) / den, u = cross(c[0] - a[0], c[1] - a[1], r[0], r[1]) / den
  return t > 1e-9 && t < 1 - 1e-9 && u > 1e-9 && u < 1 - 1e-9
}
export function ringIsSimple(pts) {
  const n = pts.length
  for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) { if (i === 0 && j === n - 1) continue; if (segHit(pts[i], pts[(i + 1) % n], pts[j], pts[(j + 1) % n])) return false }
  return true
}
// Abstand Punkt → Ring (Kanten), vorzeichenbehaftet: innen negativ
export function distToRing(pt, pts) {
  let m = Infinity
  for (let i = 0, n = pts.length; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dz = b[1] - a[1], l2 = dx * dx + dz * dz
    const t = l2 ? Math.max(0, Math.min(1, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dz) / l2)) : 0
    m = Math.min(m, Math.hypot(pt[0] - a[0] - t * dx, pt[1] - a[1] - t * dz))
  }
  return m
}
export const signedDistToRing = (pt, pts) => (pointInRing(pt, pts) ? -1 : 1) * distToRing(pt, pts)
// Nächster Punkt auf dem Ring als Bogenlänge ab Punkt 0 (für die Zuordnung Außen → Innen)
function arcOfNearest(pt, pts, cum) {
  let m = Infinity, best = 0
  for (let i = 0, n = pts.length; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dz = b[1] - a[1], l2 = dx * dx + dz * dz
    const t = l2 ? Math.max(0, Math.min(1, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dz) / l2)) : 0
    const d = Math.hypot(pt[0] - a[0] - t * dx, pt[1] - a[1] - t * dz); if (d < m) { m = d; best = cum[i] + t * Math.sqrt(l2) }
  }
  return best
}
const cumOf = (pts) => { const c = [0]; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; c.push(c[i] + Math.hypot(b[0] - a[0], b[1] - a[1])) } return c }

// Außenring = Höhenlinie d des Abstandsfelds um den Umriss (Marching Squares auf einem Raster): immer einfach, liegt ganz außerhalb, Ecken rund
// wie eine ausgewaschene Düne (V-341); einspringende Kerben schmaler als 2·d werden überbrückt (Treppen, Säulen). Danach gleichmäßig nachgetastet.
export function offsetRing(pts, d, { cell_m = STITCH.cell_m, maxCells = STITCH.maxCells, spacing_m = STITCH.spacing_m } = {}) {
  if (!(d > 0)) return pts.map((p) => [p[0], p[1]])
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity
  for (const [x, z] of pts) { x0 = Math.min(x0, x); z0 = Math.min(z0, z); x1 = Math.max(x1, x); z1 = Math.max(z1, z) }
  const pad = d * 1.25 + 1; x0 -= pad; z0 -= pad; x1 += pad; z1 += pad
  const c = Math.max(cell_m, Math.max(x1 - x0, z1 - z0) / maxCells), nx = Math.ceil((x1 - x0) / c) + 1, nz = Math.ceil((z1 - z0) / c) + 1
  const f = new Float64Array(nx * nz)
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) f[j * nx + i] = signedDistToRing([x0 + i * c, z0 + j * c], pts) - d
  // Schnittpunkte je Rasterkante, Schlüssel = Kante; Segmente je Zelle verbinden zwei Kanten
  const P = new Map(), adj = new Map()
  const at = (i, j) => f[j * nx + i]
  const key = (h, i, j) => (h ? 'h' : 'v') + i + ',' + j
  const pt = (h, i, j) => { const k = key(h, i, j); if (!P.has(k)) { const a = at(i, j), b = h ? at(i + 1, j) : at(i, j + 1), t = a / (a - b); P.set(k, h ? [x0 + (i + t) * c, z0 + j * c] : [x0 + i * c, z0 + (j + t) * c]) } return k }
  const link = (a, b) => { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a) }
  for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const v0 = at(i, j) < 0, v1 = at(i + 1, j) < 0, v2 = at(i + 1, j + 1) < 0, v3 = at(i, j + 1) < 0
    const e = [] // Kanten mit Vorzeichenwechsel: unten, rechts, oben, links
    if (v0 !== v1) e.push(pt(true, i, j)); if (v1 !== v2) e.push(pt(false, i + 1, j)); if (v3 !== v2) e.push(pt(true, i, j + 1)); if (v0 !== v3) e.push(pt(false, i, j))
    if (e.length === 2) link(e[0], e[1])
    else if (e.length === 4) { const mid = (at(i, j) + at(i + 1, j) + at(i + 1, j + 1) + at(i, j + 1)) / 4 < 0; if (mid === v0) { link(e[0], e[1]); link(e[2], e[3]) } else { link(e[0], e[3]); link(e[1], e[2]) } }
  }
  // Schleifen ablaufen, größte behalten
  const seen = new Set(); let best = null
  for (const k0 of adj.keys()) {
    if (seen.has(k0)) continue
    const loop = []; let prev = null, k = k0
    while (k && !seen.has(k)) { seen.add(k); loop.push(P.get(k)); const nb = adj.get(k).filter((x) => x !== prev && !seen.has(x)); prev = k; k = nb[0] }
    if (loop.length > 2 && (!best || Math.abs(signedAreaXZ(loop)) > Math.abs(signedAreaXZ(best)))) best = loop
  }
  if (!best) throw new Error('OFFSET_NO_CONTOUR')
  const ring = normalizeRing(best), cum = cumOf(ring), L = cum[cum.length - 1]
  const m = Math.max(pts.length, Math.min(512, Math.round(L / spacing_m))), out = []
  for (let s = 0, i = 0; s < m; s++) { const u = (s / m) * L; while (cum[i + 1] < u) i++; const a = ring[i], b = ring[(i + 1) % ring.length], t = (u - cum[i]) / ((cum[i + 1] - cum[i]) || 1); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  return out
}

// ---------------------------------------------------------------- Farbe (V-342)
const byShare = (pal) => (pal || []).slice().sort((a, b) => (b.share || 0) - (a.share || 0))
// Bodenfarbe an der Naht (V-396, WS0 17.10.): der größte Flächenanteil der edgePalette, in OKLCH höchstens +10 % L aufgehellt, damit er als Knet-Boden liest;
// gesampelt wurde der Ring, wo die Bühne den Boden trifft – dort darf keine Farbkante entstehen. (Vorher: fromColors nach Rollen-Passung.)
export function groundColorOf(edgePalette) {
  const top = byShare(edgePalette); if (!top.length) return null
  const [L, a, b] = hexToOklab(top[0].hex), C = Math.hypot(a, b), h = (Math.atan2(b, a) * 180) / Math.PI
  return { ground: oklchToHex(Math.min(1, L * 1.1), C, (h + 360) % 360), from: top[0].hex, share: top[0].share, rule: 'V-396' }
}
// Randfarbe: anteilsgewichtetes Mittel in OKLab (weicher Übergang statt der einen größten Farbe)
export function edgeMeanOf(edgePalette) {
  const pal = byShare(edgePalette); if (!pal.length) return null
  let L = 0, a = 0, b = 0, w = 0
  for (const c of pal) { const k = c.share || 1, o = hexToOklab(c.hex); L += o[0] * k; a += o[1] * k; b += o[2] * k; w += k }
  L /= w; a /= w; b /= w
  return oklchToHex(L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360)
}

// ---------------------------------------------------------------- Anschluss je Bühne
// entry: ein Eintrag aus stages{} von kfb.stage-edges/1. options: { scale (m/u, sonst entry.scale_m_per_u), floorY_u (Figurenboden der Slot-Datei,
// sonst groundY_u; marble_terraces: Slot sagt −0,042, Rand liegt auf −0,305), skirt_m, rings (≥ 2: innen, Zwischenringe, außen),
// outerY (Zahl in Metern oder (x, z) → y des Geländes), plinthDrop_m (Sockel: Innenring so weit unter den Bühnenboden, wenn der Sockel sichtbar
// bleiben soll; 0 = WS0-Hinweis „hidden if terrain sits at y=0“), Raster-Optionen von offsetRing }
// Ergebnis null bei island; sonst { stage, mode, ring, scale, y0, footprint (m, xz), inner/outer ([x, y, z] m), rings [{ t, d, pts [[x, y, z]] }],
// ground, edge, palette, area_m2 }
export function stitchFor(entry, options = {}) {
  if (!entry || !entry.footprint) throw new Error('STITCH_NO_ENTRY')
  const mode = entry.terrainMode || 'ground'
  if (mode === 'island') return null
  const o = { ...STITCH, ...options }
  const ringKey = mode === 'plinth' ? 'footprintBase' : 'footprint'
  const src = entry[ringKey] || entry.footprint
  const s = o.scale || entry.scale_m_per_u
  if (!(s > 0)) throw new Error('STITCH_NO_SCALE: ' + entry.stage)
  const floorY_u = o.floorY_u ?? entry.groundY_u ?? 0
  const y0 = ((entry.groundY_u ?? floorY_u) - floorY_u) * s - (mode === 'plinth' ? o.plinthDrop_m : 0)
  const fp = normalizeRing(src.points.map(([x, z]) => [x * s, z * s]))
  const yOut = typeof o.outerY === 'function' ? o.outerY : () => (typeof o.outerY === 'number' ? o.outerY : y0)
  const R = Math.max(2, o.rings | 0)
  const rings = Array.from({ length: R }, (_, k) => {
    const t = k / (R - 1), d = o.skirt_m * t, ty = t * t * (3 - 2 * t), r2 = k ? offsetRing(fp, d, o) : fp
    return { t, d, pts: r2.map(([x, z]) => [x, y0 + (yOut(x, z) - y0) * ty, z]) }
  })
  const pal = (ringKey === 'footprintBase' && src.edgePalette) || entry.edgePalette // Sockel: Farbe an der Sockel-Kante gemessen
  const g = groundColorOf(pal)
  return {
    stage: entry.stage, mode, ring: src === entry.footprint ? 'footprint' : ringKey, scale: s, y0, skirt_m: o.skirt_m,
    footprint: fp, inner: rings[0].pts, outer: rings[R - 1].pts, rings,
    ground: g?.ground ?? null, edge: edgeMeanOf(pal), palette: g, area_m2: signedAreaXZ(fp),
  }
}
// Alle Bühnen einer stage-edges-Datei: { id → stitch | null }; options je Bühne unter ihrer id, sonst unter '*'
export function stitchAll(doc, options = {}) {
  if (doc?.schema !== STITCH_SCHEMA) throw new Error('STITCH_SCHEMA: ' + doc?.schema)
  return Object.fromEntries(Object.entries(doc.stages).map(([id, e]) => [id, stitchFor(e, options[id] || options['*'] || {})]))
}
// Für ein Höhenfeld-Gelände (z. B. m1-terrain): Anteil der Bühne an einem Punkt. inside = auf dem Umriss; t = 0 am Rand … 1 am Außenring.
// So kann das Gelände selbst (statt der Schürze) Höhe und Farbe weich anschließen: y = mix(y0, gelände, smoothstep(t)), Farbe = mix(edge, ground, t).
export function blendAt(st, x, z) {
  const d = signedDistToRing([x, z], st.footprint)
  return { d, inside: d < 0, t: d <= 0 ? 0 : Math.min(1, d / st.skirt_m) }
}

// ---------------------------------------------------------------- Gitter für das 3D-Modul
// xz-Fläche eines Dreiecks aus dem flachen Positions-Feld (negativ = zeigt nach oben)
export const triXZ = (P, a, b, c) => (P[3 * a] * P[3 * b + 2] - P[3 * b] * P[3 * a + 2] + P[3 * b] * P[3 * c + 2] - P[3 * c] * P[3 * b + 2] + P[3 * c] * P[3 * a + 2] - P[3 * a] * P[3 * c + 2]) / 2
// Reißverschluss zwischen je zwei Ringen (verschiedene Punktzahl): jeder Außenpunkt bekommt die Bogenlänge seines nächsten Punkts auf dem inneren
// Ring (monoton gemacht); vorgerückt wird der Ring mit dem kleineren nächsten Parameter. Kerben, die der Außenring überbrückt, füllt so ein Fächer.
// Dreiecke zeigen nach oben (+Y). Ergebnis: { positions: Float32Array, blend: Float32Array (t je Ecke), indices: Uint32Array, ringStart[] }
export function stitchMesh(st) {
  const rings = st.rings, pos = [], blend = [], idx = [], ringStart = []
  for (const r of rings) { ringStart.push(blend.length); for (const p of r.pts) { pos.push(p[0], p[1], p[2]); blend.push(r.t) } }
  for (let k = 0; k < rings.length - 1; k++) {
    const A = rings[k].pts.map((p) => [p[0], p[2]]), B = rings[k + 1].pts.map((p) => [p[0], p[2]]), na = A.length, nb = B.length
    const ca = cumOf(A), La = ca[na]
    // Start des äußeren Rings: der Punkt, der dem Innenpunkt 0 am nächsten liegt
    let j0 = 0, dm = Infinity; B.forEach((p, j) => { const d = Math.hypot(p[0] - A[0][0], p[1] - A[0][1]); if (d < dm) { dm = d; j0 = j } })
    const sb = []; let last = 0
    for (let q = 0; q <= nb; q++) {
      let u = q === nb ? La : arcOfNearest(B[(j0 + q) % nb], A, ca)
      if (q > 0 && u < last - La / 2) u += La // über den Nullpunkt gelaufen
      if (q === 0 && u > La / 2) u -= La
      last = u = Math.max(u, last); sb.push(u)
    }
    const oa = ringStart[k], ob = ringStart[k + 1]
    let i = 0, q = 0
    while (i < na || q < nb) {
      const ia = oa + (i % na), ia1 = oa + ((i + 1) % na), jb = ob + ((j0 + q) % nb), jb1 = ob + ((j0 + q + 1) % nb)
      let advA = q >= nb || (i < na && ca[i + 1] <= sb[q + 1])
      // Falte vermeiden: zeigt das gewählte Dreieck nicht nach oben, das andere aber schon, das andere nehmen
      if (i < na && q < nb) { const up = (a, b, c) => triXZ(pos, a, b, c) < 0, ua = up(ia, ia1, jb), ub = up(ia, jb1, jb); if (advA && !ua && ub) advA = false; else if (!advA && !ub && ua) advA = true }
      if (advA) { idx.push(ia, ia1, jb); i++ } else { idx.push(ia, jb1, jb); q++ }
    }
  }
  return { positions: new Float32Array(pos), blend: new Float32Array(blend), indices: new Uint32Array(idx), ringStart }
}
