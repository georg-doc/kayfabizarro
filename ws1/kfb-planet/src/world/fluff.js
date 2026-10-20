// Slice 1 · Fluff-Ernte (V-368, V-294, V-371, FLUFF_WORLD_DRESSING_R1 §1–§2). Rein: ohne three, ohne DOM, deterministisch (Seed), Node-geprüft
// (test/unit/fluff.mjs). Einheiten: Meter wie die Spielwelt (J17-Meter nach V-345; Werte unten sind in J17-Metern gedacht, M_PER_RIG = 0,616381042).
// Inhalt: sechs Sorten = sechs Story-Modes (Farben V-292) · Gewichtung je Zone (Hauptsorte ≈ 40 %, jede andere ≥ 8 %) · Verteilung auf Bäume/Büsche
// (Spawn-Punkte kommen vom Aufrufer) · Windfall mit einfachem Bounce-Integrator (fester Schritt, keine Physik-Engine) · Fluff-Böe (V-371) ·
// Aufsammeln durch Drüberlaufen/-fahren (Kapsel gegen Durchtunneln) und im Bogen beim Driften (V-371) · C3: Windfall auf Gelände (stepBodyTerrain,
// simulateTerrain; Prallen an der Geländenormale, Rollen bergab, Schlafen, Einsinken 0; test/unit/harvest.mjs).
import { STORY_MODES, mulberry32 } from '../vendor/palette/kfb-cartoon-palette.js'

// ---------------------------------------------------------------- Sorten (V-292 über kfb-cartoon-palette.js STORY_MODES, gleiche Hex-Werte wie das Register)
export const FLUFF_KINDS = Object.freeze(['tragic', 'comic', 'absurd', 'heroic', 'mystical', 'forbidden'])
export const FLUFF = Object.freeze(Object.fromEntries(FLUFF_KINDS.map((k) => [k, Object.freeze({ id: k, label: STORY_MODES[k].label, color: STORY_MODES[k].satt, dark: STORY_MODES[k].dunkel })])))
export const isKind = (k) => FLUFF_KINDS.includes(k)

// ---------------------------------------------------------------- Gewichtung je Zone (V-368)
export const WEIGHTS = Object.freeze({ main: 0.4, min: 0.08 })
// main: Story-Mode der Zone (bzw. der Karte/Bühne); ohne main gleichverteilt. bias (optional): relative Vorlieben der übrigen Sorten (Biom),
// werden über dem Mindestanteil verteilt. Ergebnis: { kind → Anteil }, Summe 1.
export function zoneWeights(main, { main: wMain = WEIGHTS.main, min = WEIGHTS.min, bias = null } = {}) {
  if (main == null) return Object.fromEntries(FLUFF_KINDS.map((k) => [k, 1 / FLUFF_KINDS.length]))
  if (!isKind(main)) throw new Error('FLUFF_KIND_UNKNOWN: ' + main)
  const others = FLUFF_KINDS.filter((k) => k !== main), rest = 1 - wMain, free = rest - min * others.length
  if (free < -1e-12 || wMain < min) throw new Error('FLUFF_WEIGHTS_INVALID')
  const b = others.map((k) => Math.max(0, bias?.[k] ?? 1)), bs = b.reduce((a, x) => a + x, 0) || 1
  const w = { [main]: wMain }; others.forEach((k, i) => { w[k] = min + free * (b[i] / bs) })
  return Object.fromEntries(FLUFF_KINDS.map((k) => [k, w[k]]))
}
// Stückzahlen für n Kügelchen nach größtem Rest (deterministisch, Gleichstand nach Reihenfolge der Sorten)
export function countsFor(weights, n) {
  const raw = FLUFF_KINDS.map((k, i) => ({ k, i, x: (weights[k] || 0) * n })), c = Object.fromEntries(raw.map((r) => [r.k, Math.floor(r.x)]))
  let left = n - Object.values(c).reduce((a, x) => a + x, 0)
  raw.sort((a, b) => (b.x - Math.floor(b.x)) - (a.x - Math.floor(a.x)) || a.i - b.i).forEach((r) => { if (left > 0) { c[r.k]++; left-- } })
  return c
}

// ---------------------------------------------------------------- Seed
// Text-Seed (z. B. Zonen-Kennung) → 32 bit (FNV-1a), gemischt mit einer Zahl
export function seedOf(...parts) { let h = 0x811c9dc5; for (const ch of parts.join('|')) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) } return h >>> 0 }
export const rngOf = (...parts) => mulberry32(seedOf(...parts))

// ---------------------------------------------------------------- Verteilung auf Spawn-Punkte
export const SPAWN = Object.freeze({ tree: { crown: 2.6, r: 1.1, cap: 6 }, bush: { crown: 0.8, r: 0.55, cap: 3 } })
// spawns: [{ id, pos: [x, y, z] (Stammfuß in Weltmetern), type: 'tree' | 'bush', crown?, r?, cap? }]
// Ergebnis: Kügelchen [{ id, key, kind, spawn, anchor: [x, y, z], state: 'hanging', gen: 0 }], Reihenfolge fest für (zone, seed, n, spawns)
export function distribute({ zone = 'zone', seed = 0, n = 24, spawns = [], main = null, weights = null } = {}) {
  if (!spawns.length || n <= 0) return []
  const w = weights || zoneWeights(main), rng = rngOf('fluff', zone, seed), counts = countsFor(w, n)
  const kinds = FLUFF_KINDS.flatMap((k) => Array(counts[k]).fill(k))
  for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]] }
  // Plätze: je Spawn cap-mal, gemischt; reicht die Kapazität nicht, werden die Spawns reihum weiter belegt
  const sp = spawns.map((s) => ({ ...SPAWN[s.type] || SPAWN.tree, ...s }))
  const slots = sp.flatMap((s, si) => Array(Math.max(1, s.cap | 0)).fill(si))
  for (let i = slots.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [slots[i], slots[j]] = [slots[j], slots[i]] }
  return kinds.map((kind, i) => {
    const s = sp[i < slots.length ? slots[i] : i % sp.length], a = rng() * Math.PI * 2, rr = s.r * (0.55 + 0.4 * rng()), hh = s.crown * (0.75 + 0.25 * rng())
    const id = `${zone}:f${i}`
    return { id, key: id, kind, spawn: s.id, anchor: [s.pos[0] + Math.cos(a) * rr, s.pos[1] + hh, s.pos[2] + Math.sin(a) * rr], center: s.pos.slice(), state: 'hanging', gen: 0 }
  })
}

// ---------------------------------------------------------------- Windfall: Bounce-Integrator (fester Schritt, keine Physik-Engine)
// Flug exakt ballistisch (p + v·τ + ½·a·τ²), Bodenkontakt per Halbierung im Schritt, Stoß mit Restitution e und Reibung mu (tangential),
// darunter vSettle Übergang ins Rollen (Hangabtrieb, Rollreibung roll), Ruhe nach tRest unter vRest. Boden: Zahl oder height(x, z).
export const FALL = Object.freeze({ dt: 1 / 120, g: 9.81, e: 0.45, mu: 0.3, roll: 2.2, vSettle: 0.7, vRest: 0.06, tRest: 0.2, tMax: 10, radius: 0.12 })
const heightFn = (ground) => (typeof ground === 'function' ? ground : () => (ground ?? 0))
function normalAt(h, x, z, e = 0.05) { const gx = (h(x + e, z) - h(x - e, z)) / (2 * e), gz = (h(x, z + e) - h(x, z - e)) / (2 * e), l = Math.hypot(gx, 1, gz); return [-gx / l, 1 / l, -gz / l] }
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
// Energie je Masse (für Prüfungen): ½v² + g·y
export const energyOf = (b, P = FALL) => 0.5 * dot(b.v, b.v) + P.g * b.p[1]

export function makeBody(p, v = [0, 0, 0]) { return { p: p.slice(), v: v.slice(), mode: 'air', still: 0, t: 0, bounces: 0 } }

// ein fester Schritt; ändert b und gibt es zurück
export function stepBody(b, ground = 0, P = FALL) {
  if (b.mode === 'rest') return b
  const h = heightFn(ground), dt = P.dt, r = P.radius
  b.t += dt
  if (b.mode === 'air') {
    let left = dt
    for (let k = 0; k < 4 && left > 1e-9; k++) {
      const at = (tau) => [b.p[0] + b.v[0] * tau, b.p[1] + b.v[1] * tau - 0.5 * P.g * tau * tau, b.p[2] + b.v[2] * tau]
      const f = (tau) => { const q = at(tau); return q[1] - (h(q[0], q[2]) + r) }
      if (f(0) < 0) { b.p[1] = h(b.p[0], b.p[2]) + r } // eingedrungen (z. B. Start im Boden): aufsetzen
      if (f(left) >= 0) { b.p = at(left); b.v[1] -= P.g * left; left = 0; break }
      let lo = 0, hi = left; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (f(m) >= 0) lo = m; else hi = m }
      b.p = at(lo); b.v[1] -= P.g * lo; left -= lo
      const n = normalAt(h, b.p[0], b.p[2]), vn = dot(b.v, n)
      if (vn < 0) {
        const vt = [b.v[0] - vn * n[0], b.v[1] - vn * n[1], b.v[2] - vn * n[2]], vn2 = -P.e * vn, k2 = 1 - P.mu
        b.v = [vt[0] * k2 + vn2 * n[0], vt[1] * k2 + vn2 * n[1], vt[2] * k2 + vn2 * n[2]]; b.bounces++
        if (vn2 < P.vSettle) { b.mode = 'roll'; const t = [vt[0] * k2, vt[1] * k2, vt[2] * k2]; b.v = t; break }
      }
    }
    if (b.mode === 'air') return settle(b, P)
  }
  // Rollen auf der Fläche: Hangabtrieb minus Rollreibung, Höhe auf die Fläche gelegt
  const n = normalAt(h, b.p[0], b.p[2]), gn = -P.g * n[1], gt = [-gn * n[0], -P.g - gn * n[1], -gn * n[2]] // g·(0,−1,0) minus Normalanteil
  b.v = [b.v[0] + gt[0] * dt, b.v[1] + gt[1] * dt, b.v[2] + gt[2] * dt]
  const sp = Math.hypot(b.v[0], b.v[1], b.v[2]), dec = P.roll * dt
  if (sp <= dec) b.v = [0, 0, 0]; else { const k = (sp - dec) / sp; b.v = [b.v[0] * k, b.v[1] * k, b.v[2] * k] }
  b.p[0] += b.v[0] * dt; b.p[2] += b.v[2] * dt; b.p[1] = h(b.p[0], b.p[2]) + r
  const n2 = normalAt(h, b.p[0], b.p[2]), vn = dot(b.v, n2); b.v = [b.v[0] - vn * n2[0], b.v[1] - vn * n2[1], b.v[2] - vn * n2[2]] // tangential halten
  return settle(b, P)
}
function settle(b, P) {
  const sp = Math.hypot(b.v[0], b.v[1], b.v[2])
  b.still = b.mode === 'roll' && sp < P.vRest ? b.still + P.dt : 0
  if (b.still >= P.tRest || b.t >= P.tMax) { b.mode = 'rest'; b.v = [0, 0, 0] }
  return b
}
// so lange schrittweise rechnen, bis Ruhe (für Tests und Vorab-Rechnung); Ergebnis { body, seconds, steps, energies? }
export function simulate(b, ground = 0, P = FALL, { trace = false } = {}) {
  const E = trace ? [energyOf(b, P)] : null; let steps = 0
  while (b.mode !== 'rest' && steps < Math.ceil(P.tMax / P.dt) + 1) { stepBody(b, ground, P); steps++; if (E) E.push(energyOf(b, P)) }
  return { body: b, seconds: steps * P.dt, steps, energies: E }
}

// ---------------------------------------------------------------- Windfall auf Gelände (C3, V-423; Brief WS1 Langlauf R2 Stufe 3: „bounce, roll and come to rest … no sinking in, sleep after settling“)
// terrain = { heightAt(x, z), normalAt(x, z) → Einheitsnormale [nx, ny, nz], ny > 0 }. Radius je Körper b.r (sonst P.radius). Flug exakt ballistisch wie stepBody,
// Kontakt per Abtasten in probes Teilstücken (gegen Durchtunneln an Buckeln) + Halbierung, Stoß an der Geländenormale (e, mu). Rollen: Hangabtrieb minus
// Rollreibung nach Coulomb (rollMu·g·ny): bis zum Grenzwinkel atan(rollMu) ≈ 34° bleibt ein Kügelchen liegen, steiler rollt es weiter, bis der Hang flacher
// wird oder tMax (dann timedOut). Schlafen erst unter vRest für tRest UND auf haltbarem Hang. Wächter je Schritt: Einsinken 0 (p.y ≥ h + r) und Energie
// nimmt nie zu (ein Rollschritt, der mehr Energie bräuchte, wird gekürzt bzw. verworfen). stepBody/FALL bleiben unverändert (flacher Boden, alte Tests).
export const TERRAIN_FALL = Object.freeze({ ...FALL, rollMu: 0.6745, vMax: 14, probes: 4 })
// Zahl oder height(x, z) → terrain (Normale numerisch wie stepBody)
export function terrainFrom(ground = 0) { const h = heightFn(ground); return { heightAt: h, normalAt: (x, z) => normalAt(h, x, z) } }
const vlen = (v) => Math.hypot(v[0], v[1], v[2])

export function stepBodyTerrain(b, terrain, P = TERRAIN_FALL) {
  if (b.mode === 'rest') return b
  const H = terrain.heightAt, N = terrain.normalAt, dt = P.dt, r = b.r ?? P.radius, g = P.g
  b.t += dt
  if (b.mode === 'air') {
    if (b.p[1] < H(b.p[0], b.p[2]) + r) { b.p[1] = H(b.p[0], b.p[2]) + r; b.lifts = (b.lifts || 0) + 1 } // Start im Boden: aufsetzen (nur Fehlaufruf)
    let left = dt
    for (let k = 0; k < 4 && left > 1e-12; k++) {
      const at = (tau) => [b.p[0] + b.v[0] * tau, b.p[1] + b.v[1] * tau - 0.5 * g * tau * tau, b.p[2] + b.v[2] * tau]
      const f = (tau) => { const q = at(tau); return q[1] - (H(q[0], q[2]) + r) }
      let lo = -1, hi = -1
      for (let j = 1; j <= P.probes; j++) { const tj = (left * j) / P.probes; if (f(tj) < 0) { lo = (left * (j - 1)) / P.probes; hi = tj; break } }
      if (hi < 0) { b.p = at(left); b.v[1] -= g * left; left = 0; break }
      for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (f(m) >= 0) lo = m; else hi = m }
      b.p = at(lo); b.v[1] -= g * lo; left -= lo
      const n = N(b.p[0], b.p[2]), vn = dot(b.v, n), vt = [b.v[0] - vn * n[0], b.v[1] - vn * n[1], b.v[2] - vn * n[2]]
      if (vn >= 0) { b.mode = 'roll'; b.v = vt; break } // streifend (Gelände steigt schneller als die Bahn): auf die Fläche legen
      const vn2 = -P.e * vn, k2 = 1 - P.mu
      b.v = [vt[0] * k2 + vn2 * n[0], vt[1] * k2 + vn2 * n[1], vt[2] * k2 + vn2 * n[2]]; b.bounces++
      if (vn2 < P.vSettle) { b.mode = 'roll'; b.v = [vt[0] * k2, vt[1] * k2, vt[2] * k2]; break }
    }
    if (b.mode === 'air') return settleTerrain(b, N(b.p[0], b.p[2]), P)
  }
  // Rollen: Hangabtrieb g·(0,−1,0) minus Normalanteil, dann Coulomb-Rollreibung, Tempo-Deckel vMax, Höhe auf die Fläche, Geschwindigkeit tangential
  const E0 = 0.5 * dot(b.v, b.v) + g * b.p[1], n = N(b.p[0], b.p[2])
  let v = [b.v[0] + g * n[1] * n[0] * dt, b.v[1] + (g * n[1] * n[1] - g) * dt, b.v[2] + g * n[1] * n[2] * dt]
  const sp = vlen(v), dec = P.rollMu * g * n[1] * dt
  v = sp <= dec ? [0, 0, 0] : [v[0] * (sp - dec) / sp, v[1] * (sp - dec) / sp, v[2] * (sp - dec) / sp]
  const s2 = vlen(v); if (s2 > P.vMax) v = [v[0] * P.vMax / s2, v[1] * P.vMax / s2, v[2] * P.vMax / s2]
  const x = b.p[0] + v[0] * dt, z = b.p[2] + v[2] * dt, y = H(x, z) + r, n2 = N(x, z), vn = dot(v, n2)
  v = [v[0] - vn * n2[0], v[1] - vn * n2[1], v[2] - vn * n2[2]]
  const E1 = 0.5 * dot(v, v) + g * y
  if (E1 <= E0) { b.p = [x, y, z]; b.v = v }
  else { const ke = E0 - g * y, vv = dot(v, v); if (ke > 0 && vv > 0) { const k = Math.sqrt((2 * ke) / vv); b.p = [x, y, z]; b.v = [v[0] * k, v[1] * k, v[2] * k] } else b.v = [0, 0, 0] } // Energie-Wächter
  const yMin = H(b.p[0], b.p[2]) + r
  if (b.p[1] < yMin) { b.p[1] = yMin; b.lifts = (b.lifts || 0) + 1 } // Einsinken-Wächter (nur Rundung beim Übergang Flug → Rollen)
  return settleTerrain(b, N(b.p[0], b.p[2]), P)
}
function settleTerrain(b, n, P) {
  const hold = Math.hypot(n[0], n[2]) <= P.rollMu * n[1] + 1e-12 // tan(Hang) ≤ rollMu: Reibung hält
  b.still = b.mode === 'roll' && vlen(b.v) < P.vRest && hold ? b.still + P.dt : 0
  if (b.still >= P.tRest) { b.mode = 'rest'; b.v = [0, 0, 0] } else if (b.t >= P.tMax) { b.mode = 'rest'; b.v = [0, 0, 0]; b.timedOut = true }
  return b
}
// bis zur Ruhe rechnen; Ergebnis { body, seconds (Ruhezeit), steps, bounces, path (Weglänge), maxSink (≤ 0 = nie eingesunken), timedOut, energies? }
export function simulateTerrain(b, terrain, P = TERRAIN_FALL, { trace = false } = {}) {
  const H = terrain.heightAt, r = b.r ?? P.radius, E = trace ? [energyOf(b, P)] : null, lim = Math.ceil(P.tMax / P.dt) + 1
  let steps = 0, path = 0, maxSink = 0
  while (b.mode !== 'rest' && steps < lim) {
    const q = b.p.slice(); stepBodyTerrain(b, terrain, P); steps++
    path += Math.hypot(b.p[0] - q[0], b.p[1] - q[1], b.p[2] - q[2]); maxSink = Math.max(maxSink, H(b.p[0], b.p[2]) + r - b.p[1]); if (E) E.push(energyOf(b, P))
  }
  return { body: b, seconds: steps * P.dt, steps, bounces: b.bounces, path, maxSink, timedOut: !!b.timedOut, energies: E }
}

// ---------------------------------------------------------------- Abwurf, Böe, Rütteln
export const WIND = Object.freeze({ out: [0.6, 1.6], up: [0.4, 1.4], gustSpread: 1.6 })
// ein hängendes Kügelchen fällt: Startgeschwindigkeit nach außen (vom Stamm weg) und leicht nach oben, Zufall aus (seed, key)
export function release(ball, seed = 0, W = WIND) {
  if (ball.state !== 'hanging') return ball
  const rng = rngOf('drop', seed, ball.key), dx = ball.anchor[0] - ball.center[0], dz = ball.anchor[2] - ball.center[2], l = Math.hypot(dx, dz) || 1
  const o = W.out[0] + (W.out[1] - W.out[0]) * rng(), u = W.up[0] + (W.up[1] - W.up[0]) * rng()
  ball.body = makeBody(ball.anchor, [(dx / l) * o, u, (dz / l) * o]); ball.state = 'falling'
  return ball
}
// Fluff-Böe (V-371): alle hängenden Kügelchen einer Zone fallen gestaffelt; Ergebnis [{ key, at }] in Sekunden ab jetzt
export function gustSchedule(balls, seed = 0, W = WIND) {
  const rng = rngOf('gust', seed)
  return balls.filter((b) => b.state === 'hanging').map((b) => ({ key: b.key, at: +(rng() * W.gustSpread).toFixed(4) })).sort((a, b) => a.at - b.at || (a.key < b.key ? -1 : 1))
}

// ---------------------------------------------------------------- Aufsammeln
// walk/vehicle: Sammelradius um die Figur bzw. das Fahrzeug (J17-Meter; Fahrzeug 5,18 m lang, halbe Breite + Puffer), dy: Höhenfenster über/unter pos
export const PICKUP = Object.freeze({ walk: 0.8, vehicle: 1.9, dyUp: 2.2, dyDown: 0.6, driftScale: 2.2, driftArcDeg: 140, driftMinSpeed: 7.5 })
// Abstand Punkt → Strecke (xz)
function segDist(p, a, b) { const dx = b[0] - a[0], dz = b[2] - a[2], l2 = dx * dx + dz * dz, t = l2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[2] - a[2]) * dz) / l2)) : 0; return Math.hypot(p[0] - a[0] - t * dx, p[2] - a[2] - t * dz) }
// collector: { pos: [x, y, z], prev?: [x, y, z] (Position im letzten Bild → Kapsel, kein Durchtunneln), radius? | mode: 'walk' | 'vehicle', vel?: [x, y, z], drifting? }
// Ergebnis: { keys: [], drift: [] } (drift = nur im Bogen gesammelt); gesammelt werden fallende und liegende, nie hängende Kügelchen
export function collect(balls, collector, P = PICKUP) {
  const pos = collector.pos, prev = collector.prev || pos, R = collector.radius ?? (collector.mode === 'vehicle' ? P.vehicle : P.walk)
  const v = collector.vel || [0, 0, 0], sp = Math.hypot(v[0], v[2]), drift = !!collector.drifting && sp >= P.driftMinSpeed
  const cosArc = Math.cos(((P.driftArcDeg / 2) * Math.PI) / 180), Rd = R * P.driftScale
  const keys = [], dk = []
  for (const b of balls) {
    if (b.state !== 'falling' && b.state !== 'resting') continue
    const p = b.body.p, dy = p[1] - pos[1]
    if (dy > P.dyUp || dy < -P.dyDown) continue
    if (segDist(p, prev, pos) <= R) { keys.push(b.key); continue }
    if (drift) { const dx = p[0] - pos[0], dz = p[2] - pos[2], d = Math.hypot(dx, dz); if (d <= Rd && (dx * v[0] + dz * v[2]) / ((d || 1) * sp) >= cosArc) { keys.push(b.key); dk.push(b.key) } }
  }
  return { keys, drift: dk }
}

// ---------------------------------------------------------------- Feld einer Zone (Zustand + fester Schritt)
// options: { zone, seed, n, spawns, main, weights, ground, fall (Teilwerte von FALL), regrow_s (null = wächst nicht nach), collected (Schlüssel aus dem
// Spielstand: diese Kügelchen fehlen beim Start) }
export function createFluffField(options = {}) {
  const P = { ...FALL, ...(options.fall || {}) }, ground = options.ground ?? 0, seed = options.seed ?? 0
  const balls = distribute(options), counts = Object.fromEntries(FLUFF_KINDS.map((k) => [k, 0])), skip = new Set(options.collected || [])
  balls.forEach((b) => { if (skip.has(b.key)) { b.state = 'collected'; b.since = 0 } })
  const pending = [] // Böe: { key, at }
  let acc = 0, time = 0
  const byKey = new Map(balls.map((b) => [b.key, b]))
  const stepAll = () => {
    time += P.dt
    while (pending.length && pending[0].at <= time) { const b = byKey.get(pending.shift().key); if (b) release(b, seed) }
    for (const b of balls) {
      if (b.state === 'falling') { stepBody(b.body, ground, P); if (b.body.mode === 'rest') b.state = 'resting' }
      else if (b.state === 'collected' && options.regrow_s != null) { b.since += P.dt; if (b.since >= options.regrow_s) regrow(b) }
    }
  }
  const regrow = (b) => { byKey.delete(b.key); b.gen++; b.key = `${b.id}#${b.gen}`; b.state = 'hanging'; b.body = null; b.since = 0; byKey.set(b.key, b) }
  return {
    balls, P,
    // dt aus dem Bild, gerechnet wird in festen Schritten (deterministisch)
    advance(dt) { acc += Math.min(dt, 0.25); let n = 0; while (acc >= P.dt) { acc -= P.dt; stepAll(); n++ } return n },
    gust() { const s = gustSchedule(balls, seedOf(seed, Math.round(time * 1000))); s.forEach((e) => pending.push({ key: e.key, at: time + e.at })); pending.sort((a, b) => a.at - b.at); return s.length },
    shake(spawnId) { let n = 0; for (const b of balls) if (b.spawn === spawnId && b.state === 'hanging') { release(b, seed); n++ } return n },
    collect(collector) { const r = collect(balls, collector); for (const k of r.keys) { const b = byKey.get(k); b.state = 'collected'; b.since = 0; counts[b.kind]++ } return r },
    counts: () => ({ ...counts }),
    collectedKeys: () => balls.filter((b) => b.state === 'collected').map((b) => b.key),
    stats: () => ({ hanging: balls.filter((b) => b.state === 'hanging').length, falling: balls.filter((b) => b.state === 'falling').length, resting: balls.filter((b) => b.state === 'resting').length, collected: balls.filter((b) => b.state === 'collected').length, time: +time.toFixed(4) }),
  }
}
