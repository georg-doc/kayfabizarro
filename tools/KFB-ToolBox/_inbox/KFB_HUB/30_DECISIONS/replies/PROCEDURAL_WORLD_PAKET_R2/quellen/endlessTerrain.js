// V-619 · Endloses Gelände um den Wagen (world=endless), Modul nach Host-Vertrag R1.2 §2: create(options) -> { object3d, update, dispose } plus die
// Gelände-Schnittstelle von m1-terrain (height, surfaceAt, info, colliderData) und Streams für Kollider und Bewuchs.
// Form: Höhe der Gelände-Probe (probeHeight.js, erzeugt aus der Probe, Rezept „Sanfte Hügel“, ohne Wasser/Flüsse), Platz-Anker im Ursprung wie
// world=probe (Amphitheater steht unverändert), je Biom ein Höhenfaktor über ein breites Band (biomeField). Kein Randwall: die Welt endet nie.
// Kacheln: Quadtree aus 512-m-Wurzeln, Blätter 64…512 m mit je 32 × 32 Zellen (2…16 m), fein am Wagen, grob in der Ferne. Gebaut wird zeitgeteilt
// (je Bild höchstens budgetMs) im Hintergrund der Bildschleife; ein neuer Kachelsatz erscheint erst, wenn alle seine Kacheln fertig sind (keine Löcher).
// Keine Nähte, keine Höhensprünge: Kanten zu gröberen Nachbarn werden auf deren Kante gelegt (Höhe UND Normale linear wie das grobe Dreieck),
// Normalen aus dem Höhenfeld mit einer Randreihe Überstand (gleiche Nachbarn = gleiche Normale). Kollider (Rapier-Trimesh) = genau die gezeigten
// Dreiecke der 64-m-Kacheln nahe am Wagen.
import * as THREE from 'three'
import { makeClayFamily } from '../vendor/billboard/billboard-clay.js'
import { K } from '../m1/m1Scale.js'
import { applyTerrain3 } from '../look/terrain3.js'
import { applyBiomeTerrain } from '../look/biomeTerrain.js'
import { createProbeHeight } from './probeHeight.js'
import PROBE_RECIPE from '../data/worlds/kfb-world-probe.r1.json' with { type: 'json' }
import { createBiomeField, NB } from './biomeField.js'
import { GROUND_Y, TERRAIN, terrainActive } from '../modules/m1-terrain.js'
import { CARD_HM, CARD_HM_META } from '../assets/cards/card_r3.hm.js'

export const ENDLESS = Object.freeze({ root: 512, leaf: 64, seg: 32, split: 0.85, view: 820, collR: 70, budgetMs: 2.5, replanM: 6 })
export const endlessLog = { create: 0, update: 0, dispose: 0, built: 0, swaps: 0, stitched: 0, buildMs: 0, maxSliceMs: 0 }
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

export const CARD_STAMP = Object.freeze({ halfW: 18, amp: 6, skirt: 7, ring: [70, 260], avoid: 48 })
function cardSites(h) {
  const S = CARD_STAMP.halfW, W = 2 * S, D = W * CARD_HM_META.aspect
  const stats = (cx, cz) => { let lo = 1e9, hi = -1e9; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { const v = h(cx - S + (i / 4) * W, cz - D / 2 + (j / 4) * D); lo = Math.min(lo, v); hi = Math.max(hi, v) } return { lo, hi } }
  let best = null
  for (let r = CARD_STAMP.ring[0]; r <= CARD_STAMP.ring[1]; r += 19) for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2 + r * 0.013, x = Math.cos(t) * r, z = Math.sin(t) * r
    if (Math.hypot(x, z) < CARD_STAMP.avoid + S) continue; const st = stats(x, z), sc = st.hi - st.lo + r * 0.004; if (!best || sc < best.sc) best = { x, z, sc, top: st.hi } }
  return best ? [{ kind: 'card', id: 'card_r3', x: best.x, z: best.z, hw: S, hd: D / 2, base: best.top, amp: CARD_STAMP.amp, skirt: CARD_STAMP.skirt }] : []
}
function stampHeight(stamps, x, z, h) {
  for (const st of stamps) {
    const dx = Math.abs(x - st.x) - st.hw, dz = Math.abs(z - st.z) - st.hd, out = Math.max(dx, dz, 0)
    if (out >= st.skirt) continue
    const hw = CARD_HM_META.hw, hh = CARD_HM_META.hh, u = Math.min(1, Math.max(0, (x - st.x + st.hw) / (2 * st.hw))), v = Math.min(1, Math.max(0, (z - st.z + st.hd) / (2 * st.hd)))
    const fx = u * (hw - 1), fz = v * (hh - 1), i0 = Math.floor(fx), j0 = Math.floor(fz), i1 = Math.min(hw - 1, i0 + 1), j1 = Math.min(hh - 1, j0 + 1), tx = fx - i0, tz = fz - j0
    const r = (CARD_HM[j0 * hw + i0] * (1 - tx) + CARD_HM[j0 * hw + i1] * tx) * (1 - tz) + (CARD_HM[j1 * hw + i0] * (1 - tx) + CARD_HM[j1 * hw + i1] * tx) * tz
    const top = st.base + (r - CARD_HM_META.edge) * st.amp, k = 1 - sstep(0, st.skirt, out)
    h = Math.max(h, h + (top - h) * k)   // nur auftragen
  }
  return h
}

// Höhe der endlosen Welt (ohne three; Node-Tests rechnen dieselbe Zahl)
export function createEndlessHeight(opts = {}) {
  const T = TERRAIN, field = opts.field || createBiomeField(opts.biome || {})
  const P = createProbeHeight({ ...PROBE_RECIPE, stylize: { ...PROBE_RECIPE.stylize, waterLevel: 0 } })
  const plaza = { kind: 'plaza', x: 0, z: 0, R: T.flatR, y: 0, on: false, bh: 0, bw: 0.1, open: 0, hx: 0, hz: 0, rot: 0, blend: T.blendR - T.flatR }
  plaza.y = P.ringY(plaza); plaza.on = true; P.anchors.push(plaza)
  const dy = GROUND_Y - plaza.y
  const base = (x, z) => P.height(x, z) + dy
  // Platz bleibt auf GROUND_Y: der Biom-Faktor streckt nur den Abstand zur Platzhöhe
  const h0 = (x, z, w = null) => { const m = field.sample(x, z, w); return GROUND_Y + (base(x, z) - GROUND_Y) * m }
  // Karten-Gelände (Georg q226: „aus der Karte ein Terrain geformt“, wie Probe R3): das Relief der Karte wird als Plateau aufgetragen (nur auftragen, V-716),
  // Rand fällt über einen Saum aufs Gelände. Ort: ruhigste Fläche im Ring um den Start. Bewuchs, Kollider und Kugeln lesen dieselbe Höhe.
  const stamps = opts.cards === false ? [] : cardSites(h0)
  const height = stamps.length ? (x, z, w = null) => stampHeight(stamps, x, z, h0(x, z, w)) : h0
  return { height, base, field, plazaY: plaza.y, shift: dy, stamps }
}

// Index für ein 32 × 32-Blatt (einmal für alle); Teilung wie three PlaneGeometry (a-b-d / b-c-d)
function leafIndex(seg) {
  const n = seg + 1, idx = new Uint32Array(seg * seg * 6); let k = 0
  for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) { const a = j * n + i, b = (j + 1) * n + i, c = (j + 1) * n + i + 1, d = j * n + i + 1; idx[k++] = a; idx[k++] = b; idx[k++] = d; idx[k++] = b; idx[k++] = c; idx[k++] = d }
  return idx
}

export function createEndlessTerrain(options = {}) {
  endlessLog.create++
  const E = { ...ENDLESS, ...(options.endless || {}) }, SEG = E.seg, N = SEG + 1, NP = N + 2
  const W = createEndlessHeight(options), H = W.height, field = W.field
  const root = new THREE.Group(); root.name = 'endless-terrain'
  // Material wie m1-terrain (Knete) + terrain3-Fließfarben + Biom-Paletten mit Sprenkel-Übergang (biomeTerrain)
  const fam = makeClayFamily('G', { uClayNear: { value: 30 * K }, uClayFar: { value: 90 * K }, uClayScale: { value: 1.4 * K }, uClayAmt: { value: 0.25 } }, { oct: 2, near: true, stick: false })
  const mat = fam.std(options.biome?.top || '#9aab62', 0.95)
  const t3 = applyTerrain3(mat, { palette: 'mesa', hMin: GROUND_Y - 12, hMax: GROUND_Y + 34 })
  const bio = applyBiomeTerrain(mat, options.look || {})
  const INDEX = new THREE.BufferAttribute(leafIndex(SEG), 1)
  const leaves = new Map()        // key → Blatt (gebaut, ggf. versteckt; LRU-Cache)
  let shown = new Map()           // key → Blatt (aktueller Satz)
  let plan = null, job = null, focus = { x: 0, z: 0 }, lastPlanAt = null, frame = 0, extFocus = false, spd = 0
  const keyOf = (L, i, j) => L + ':' + i + ':' + j
  const sizeOf = (L) => E.leaf * 2 ** L, LROOT = Math.round(Math.log2(E.root / E.leaf))

  // gewünschter Blatt-Satz: Wurzeln im Sichtradius, teilen solange Kachel näher als split × Größe
  function desired(fx, fz) {
    const out = [], R = E.view, r0 = E.root
    const boxD = (x0, z0, s) => Math.hypot(Math.max(x0 - fx, 0, fx - (x0 + s)), Math.max(z0 - fz, 0, fz - (z0 + s)))
    const rec = (L, i, j) => { const s = sizeOf(L), x0 = i * s, z0 = j * s
      if (L > 0 && boxD(x0, z0, s) < s * E.split) { for (let b = 0; b < 2; b++) for (let a = 0; a < 2; a++) rec(L - 1, i * 2 + a, j * 2 + b) } else out.push({ L, i, j, key: keyOf(L, i, j) }) }
    for (let j = Math.floor((fz - R) / r0); j <= Math.floor((fz + R) / r0); j++) for (let i = Math.floor((fx - R) / r0); i <= Math.floor((fx + R) / r0); i++)
      if (boxD(i * r0, j * r0, r0) < R) rec(LROOT, i, j)
    return out
  }

  // Blatt bauen (Generator: gibt nach jeder Zeile ab, damit die Zeitscheibe hält). Rohhöhen mit Randreihe → Normalen; Biom-Gewichte je Eckpunkt
  function* buildLeaf(d) {
    const s = sizeOf(d.L), c = s / SEG, x0 = d.i * s, z0 = d.j * s, hp = new Float32Array(NP * NP), w6 = new Float32Array(NB), bw = new Float32Array(N * N * NB)
    for (let j = 0; j < NP; j++) { for (let i = 0; i < NP; i++) { const inner = i > 0 && j > 0 && i < NP - 1 && j < NP - 1
        hp[j * NP + i] = H(x0 + (i - 1) * c, z0 + (j - 1) * c, inner ? w6 : null)
        if (inner) bw.set(w6, ((j - 1) * N + (i - 1)) * NB) }
      yield }
    const h = new Float32Array(N * N), nrm = new Float32Array(N * N * 3)
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const p = (j + 1) * NP + i + 1; h[j * N + i] = hp[p]
      const gx = (hp[p + 1] - hp[p - 1]) / (2 * c), gz = (hp[p + NP] - hp[p - NP]) / (2 * c), l = Math.hypot(gx, 1, gz), k = (j * N + i) * 3
      nrm[k] = -gx / l; nrm[k + 1] = 1 / l; nrm[k + 2] = -gz / l }
    const pos = new Float32Array(N * N * 3), A = new Float32Array(N * N * 3), B = new Float32Array(N * N * 3)
    let lo = Infinity, hi = -Infinity
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const v = j * N + i; pos[v * 3] = x0 + i * c; pos[v * 3 + 1] = h[v]; pos[v * 3 + 2] = z0 + j * c; lo = Math.min(lo, h[v]); hi = Math.max(hi, h[v])
      for (let b = 0; b < 3; b++) { A[v * 3 + b] = bw[v * NB + b]; B[v * 3 + b] = bw[v * NB + 3 + b] } }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nrm.slice(), 3))
    geo.setAttribute('aBioA', new THREE.BufferAttribute(A, 3)); geo.setAttribute('aBioB', new THREE.BufferAttribute(B, 3)); geo.setIndex(INDEX)
    geo.boundingBox = new THREE.Box3(new THREE.Vector3(x0, lo - 2, z0), new THREE.Vector3(x0 + s, hi + 2, z0 + s)); geo.boundingSphere = geo.boundingBox.getBoundingSphere(new THREE.Sphere())
    const mesh = new THREE.Mesh(geo, mat); mesh.name = 'endless:' + d.key; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false; mesh.visible = false
    root.add(mesh); endlessLog.built++
    return { ...d, s, c, x0, z0, h, nrm, bw, mesh, geo, sig: '', used: frame, coll: null }
  }

  // Blatt, das den Punkt (x, z) im aktuellen Satz enthält (fein → grob)
  const leafAt = (x, z, set = shown) => { for (let L = 0; L <= LROOT; L++) { const s = sizeOf(L), b = set.get(keyOf(L, Math.floor(x / s), Math.floor(z / s))); if (b) return b } return null }
  // Höhe/Normale eines Blatts auf seiner Kante bei (x, z) (linear zwischen den Kanten-Eckpunkten = das gezeigte Dreieck auf dieser Kante)
  function edgeSample(b, x, z, out) {
    const u = (x - b.x0) / b.c, v = (z - b.z0) / b.c, i = Math.min(SEG, Math.max(0, u)), j = Math.min(SEG, Math.max(0, v))
    const onX = Math.abs(j - Math.round(j)) < 1e-4 // Kante entlang x (j fest)
    const t = onX ? i : j, a = Math.min(SEG - 1, Math.floor(t)), f = t - a
    const ia = onX ? Math.round(j) * N + a : a * N + Math.round(i), ib = onX ? ia + 1 : ia + N
    out[0] = b.h[ia] + (b.h[ib] - b.h[ia]) * f
    for (let k = 0; k < 3; k++) out[1 + k] = b.nrm[ia * 3 + k] + (b.nrm[ib * 3 + k] - b.nrm[ia * 3 + k]) * f
  }
  // Kanten an gröbere Nachbarn anlegen; Signatur = Größen der Nachbarn je Kante (nur bei Änderung neu schreiben)
  const _e = new Float32Array(4)
  function stitch(b, set) {
    const eps = b.c * 0.25, sides = [[0, -1], [1, 0], [0, 1], [-1, 0]], nb = sides.map(([dx, dz]) => { const q = leafAt(b.x0 + b.s / 2 + dx * (b.s / 2 + eps), b.z0 + b.s / 2 + dz * (b.s / 2 + eps), set); return q && q.L > b.L ? q : null })
    // Ecken: trifft dort eine gröbere Kachel (auch nur über Eck), gilt deren Normale (sonst sähen drei feine und eine grobe Kachel am selben Punkt verschieden aus)
    const corners = [[0, 0], [SEG, 0], [SEG, SEG], [0, SEG]].map(([i, j]) => { const x = b.x0 + i * b.c, z = b.z0 + j * b.c; let best = null
      for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const q = leafAt(x + dx * eps, z + dz * eps, set); if (q && q.L > b.L && (!best || q.L > best.L)) best = q }
      return best && { q: best, i, j, x, z } })
    const sig = nb.map((q) => (q ? q.key : '-')).join('|') + '#' + corners.map((c) => (c ? c.q.key : '-')).join('|'); if (sig === b.sig) return false
    b.sig = sig; const pos = b.geo.attributes.position.array, nr = b.geo.attributes.normal.array
    for (let v = 0; v < N * N; v++) pos[v * 3 + 1] = b.h[v]; nr.set(b.nrm)
    const put = (v) => { pos[v * 3 + 1] = _e[0]; const l = Math.hypot(_e[1], _e[2], _e[3]) || 1; nr[v * 3] = _e[1] / l; nr[v * 3 + 1] = _e[2] / l; nr[v * 3 + 2] = _e[3] / l }
    nb.forEach((q, s) => { if (!q) return
      for (let t = 0; t < N; t++) { const i = s === 0 ? t : s === 1 ? SEG : s === 2 ? t : 0, j = s === 0 ? 0 : s === 1 ? t : s === 2 ? SEG : t
        edgeSample(q, b.x0 + i * b.c, b.z0 + j * b.c, _e); put(j * N + i) } })   // Punkt auf der gemeinsamen Kante: Höhe und Normale wie das grobe Dreieck
    for (const c of corners) if (c) { edgeSample(c.q, c.x, c.z, _e); put(c.j * N + c.i) }
    b.geo.attributes.position.needsUpdate = true; b.geo.attributes.normal.needsUpdate = true; endlessLog.stitched++
    return true
  }

  // Zeitscheibe: Plan → fehlende Blätter bauen → Satz tauschen
  function replan(fx, fz) {
    const want = desired(fx, fz), missing = want.filter((d) => !leaves.has(d.key))
    plan = { want, missing, at: { x: fx, z: fz } }; job = null
  }
  function work(budget) {
    if (!plan) return
    const t0 = performance.now()
    while (performance.now() - t0 < budget) {
      if (!job) { const d = plan.missing.shift(); if (!d) break; if (leaves.has(d.key)) continue; job = { d, it: buildLeaf(d) } }
      const r = job.it.next(); if (r.done) { leaves.set(job.d.key, r.value); job = null }
    }
    if (!job && !plan.missing.length) { const ts = performance.now(); swap(); endlessLog.maxSwapMs = Math.max(endlessLog.maxSwapMs || 0, performance.now() - ts) }
    const ms = performance.now() - t0; endlessLog.buildMs += ms; endlessLog.maxSliceMs = Math.max(endlessLog.maxSliceMs, ms)
  }
  function swap() {
    const next = new Map(); for (const d of plan.want) { const b = leaves.get(d.key); if (b) { b.used = frame; next.set(d.key, b) } }
    for (const [k, b] of shown) if (!next.has(k)) b.mesh.visible = false
    for (const b of next.values()) { b.mesh.visible = true }
    for (const b of next.values()) stitch(b, next)
    shown = next; plan = null; endlessLog.swaps++
    // Cache begrenzen (älteste unsichtbare Blätter freigeben)
    if (leaves.size > 420) { const old = [...leaves.values()].filter((b) => !shown.has(b.key)).sort((a, b) => a.used - b.used); for (const b of old.slice(0, leaves.size - 360)) { root.remove(b.mesh); b.geo.dispose(); leaves.delete(b.key) } }
    for (const fn of listeners) fn(shown)
  }
  const listeners = new Set()

  // Start: ersten Satz um den Ursprung (bzw. options.focus) sofort ganz bauen
  { const f = options.focus || { x: 0, z: 0 }; focus = { ...f }; replan(f.x, f.z); lastPlanAt = { ...f }; work(1e9) }

  // Oberfläche der gezeigten Dreiecke (wie m1-terrain.surfaceAt): Teilung a-b-d / b-c-d
  function surfaceAt(x, z, b = leafAt(x, z)) {
    if (!b) return H(x, z)
    const pos = b.geo.attributes.position.array, u0 = (x - b.x0) / b.c, v0 = (z - b.z0) / b.c, i = Math.min(SEG - 1, Math.max(0, Math.floor(u0))), j = Math.min(SEG - 1, Math.max(0, Math.floor(v0))), u = u0 - i, v = v0 - j
    const Y = (ii, jj) => pos[((jj * N) + ii) * 3 + 1], ha = Y(i, j), hb = Y(i, j + 1), hc = Y(i + 1, j + 1), hd = Y(i + 1, j)
    return u + v <= 1 ? ha + (hd - ha) * u + (hb - ha) * v : hc + (hb - hc) * (1 - u) + (hd - hc) * (1 - v)
  }
  const height = (x, z) => H(x, z)
  terrainActive.height = height; terrainActive.minY = GROUND_Y - 40

  // Kollider: 64-m-Blätter im Umkreis collR um den Fokus (Daten = gezeigte Dreiecke). collider(world) liefert Diff { add: [{ key, vertices, indices }], remove: [key] }
  const collOn = new Map()
  function colliderDiff() {
    const add = [], remove = [], want = new Set()
    for (const b of shown.values()) { if (b.L !== 0) continue; const dx = Math.max(b.x0 - focus.x, 0, focus.x - (b.x0 + b.s)), dz = Math.max(b.z0 - focus.z, 0, focus.z - (b.z0 + b.s)); if (Math.hypot(dx, dz) > E.collR) continue
      want.add(b.key); if (collOn.get(b.key) === b.sig) continue
      if (collOn.has(b.key)) remove.push(b.key)   // Kante neu angelegt: Kollider ersetzen
      collOn.set(b.key, b.sig); add.push({ key: b.key, vertices: new Float32Array(b.geo.attributes.position.array), indices: INDEX.array }) }
    for (const k of [...collOn.keys()]) if (!want.has(k)) { remove.push(k); collOn.delete(k) }
    return { add, remove }
  }

  const info = () => ({ world: 'endless', leaves: shown.size, cached: leaves.size, tris: shown.size * SEG * SEG * 2, built: endlessLog.built, swaps: endlessLog.swaps, stitched: endlessLog.stitched, maxSliceMs: +endlessLog.maxSliceMs.toFixed(2), maxSwapMs: +(endlessLog.maxSwapMs || 0).toFixed(2), pending: plan ? plan.missing.length + (job ? 1 : 0) : 0, focus: [+focus.x.toFixed(1), +focus.z.toFixed(1)], flatR: TERRAIN.flatR, groundY: GROUND_Y, cell: E.leaf / SEG })
  return {
    object3d: root,
    height, surfaceAt, info, field, stamps: W.stamps,
    resetStats() { endlessLog.maxSliceMs = 0; endlessLog.maxSwapMs = 0 },
    leaves: () => shown, leafAt: (x, z) => leafAt(x, z), onSwap: (fn) => { listeners.add(fn); fn(shown); return () => listeners.delete(fn) }, colliderDiff,
    biomeAt: (x, z, out) => field.weights(x, z, out),
    colliderData: () => null,   // Kollider streamt der Host (EndlessDrive) über colliderDiff
    // Fokus (Wagen bzw. Figur) setzt der Host je Bild; ohne Fokus folgt das Gelände der Kamera
    setFocus(x, z, speed = 0) { focus.x = x; focus.z = z; extFocus = true; spd = speed },
    flush() { if (!plan) replan(focus.x, focus.z); work(1e9) },
    material: mat, biomeLook: bio,
    update(dt = 1 / 60, ctx) { endlessLog.update++; frame++
      if (!extFocus && ctx?.camera) { focus.x = ctx.camera.position.x; focus.z = ctx.camera.position.z }
      if (!plan && Math.hypot(focus.x - lastPlanAt.x, focus.z - lastPlanAt.z) > E.replanM) { replan(focus.x, focus.z); lastPlanAt = { ...focus } }
      work(E.budgetMs); t3.update(dt, spd); bio.update?.(dt) },
    dispose() { endlessLog.dispose++; if (terrainActive.height === height) { terrainActive.height = null; terrainActive.minY = null } for (const b of leaves.values()) b.geo.dispose(); mat.dispose(); root.clear(); listeners.clear() },
  }
}
