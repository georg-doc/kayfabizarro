// HUD 3D R1 (Claude-Design-Board „KFB HUD 3D R1“, WS0 V-694, Georg 24.10.: „integrieren und testen“) · Spike-Paket 1 hinter hud=3d: freier 3D-Zielpfeil
// mit Feder, sechs Fluff-Kugeln, Truhe – Layout A aus h3d-hud geo('A','desk') (Board 960 × 540 = halbe 1080p, hier × 2). Modul nach Host-Vertrag R1.2.
// Eine Implementierung: Render-Ziele, Overlay, Kontur, Federn und Zustände kommen aus hudShell.js (dieselbe Hülle wie das Knet-HUD R1); vom Board
// übernommen sind nur die Werte (SPEC_WERTE.md), nicht seine Technik (eigener Renderer, 2D-Dilatation, DOM-Props).
// Das HUD zeigt nur Zustand (EINBAU_WS1 §0): Zähler, Ziel und Inventar kommen vom Wirt (HudClay.jsx mit der HudR5f-api bzw. dem M1-Ziel-Haken).
//   Pfeil: kenney_arrow-rounded (CC0), Knete in Annäherungsfarbe #f2c230 (≥ 600 m) → #58be4e (≤ 40 m), Kamera ortho 38° von oben, Yaw = −90° − Peilung,
//          Neigung auf Z (Euler YXZ, ±30°), Feder kritisch gedämpft ω 5,5, Totzone 1,5°; neu gezeichnet nur bei > 0,5° Änderung oder Farbstufe. Kein Ziel = kein Pfeil.
//   Kugeln: Primitiv in Spielfarbe (Fluff-Mesh fehlt im Paket), Zahl aus KFB_HUD_FluffDigits (Vorderseite #fff6e0, Flanke #130e16), leer = grau mit grauer 0.
//          Neu gezeichnet nur bei Zählerwechsel. Einflug: eine Feder (ω 5,2, ζ 0,8, Start nach oben) zur aktuellen Kugel, Kontakt bei 18 % Radius, Squash.
//   Truhe: KFB_HUD_Chest (N29, src/private) in otown-Zonen, Deckel auf/zu mit dem Rucksack.
// Kontur #130e16 2 px oben links → 3,5 px unten rechts (Kugeln 1,5 → 2,6), ohne Ton-Abbildung (Farben wie im Board).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { createHudShell, zoneSet, boardClay, clamp, DEG } from './hudShell.js'
import { PROOF_PALETTES } from './hudPalette.js'
import arrowUrl from '../assets/hud3d/kenney_arrow-rounded.glb?url'

const PRIV = import.meta.glob(['../private/50_BLENDER/N29/out/KFB_HUD_Chest.glb', '../private/50_BLENDER/N29/out/KFB_HUD_FluffDigits.glb'], { query: '?url', import: 'default', eager: true })
const privUrl = (name) => Object.entries(PRIV).find(([p]) => p.endsWith('/KFB_HUD_' + name + '.glb'))?.[1] || null
export const hasHud3dAssets = () => !!privUrl('Chest') && !!privUrl('FluffDigits')

export const INK = '#130e16', HALO = '#fff6e0'
export const FLUFF = [ // satt / dunkel (SPEC_WERTE, V-292) in KIND_INDEX-Reihenfolge
  { id: 'tragic', c: '#3e6a83', d: '#34576b' }, { id: 'comic', c: '#7a8d4a', d: '#5e6f33' }, { id: 'absurd', c: '#e9c14a', d: '#b8901c' },
  { id: 'heroic', c: '#d97c3a', d: '#b35e22' }, { id: 'mystical', c: '#6b4e7d', d: '#5b4470' }, { id: 'forbidden', c: '#a64670', d: '#8f3a60' }]

// Entfernung nach V-333/V-335 (unter 8 m keine Zahl) und Annäherungsfarbe (h3d-hud fmtDist, arrowColor)
export function fmtDist(m) {
  if (m == null || m < 8) return null
  if (m < 100) return Math.max(5, Math.round(m / 5) * 5) + ' m'
  if (m < 995) return Math.round(m / 10) * 10 + ' m'
  if (m < 9950) return (m / 1000).toFixed(1) + ' km'
  return Math.round(m / 1000) + ' km'
}
export function arrowColor(d) {
  const t = clamp((600 - (d ?? 0)) / 560, 0, 1), e = t * t * (3 - 2 * t), A = [242, 194, 48], B = [88, 190, 78]
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * e).toString(16).padStart(2, '0')).join('')
}

// Board-Geometrie Layout A (desk, 960 × 540) → Bezugsfläche 1920 × 1080. pad = Rand im Rechteck für die Kontur (Anteil der Prop-Größe).
const F = 2, BW = 960, BH = 540
function boardRect(x, y, w, h, padK = 0.12) {
  const p = Math.round(Math.max(w, h) * padK), X = (x - p) * F, Y = (y - p) * F, W = (w + 2 * p) * F, H = (h + 2 * p) * F, cx = x + w / 2
  const right = cx > BW * 0.62, left = cx < BW * 0.38, top = y + h / 2 < BH / 2
  const corner = (top ? 't' : 'b') + (right ? 'r' : left ? 'l' : 'c')
  const dx = right ? BW * F - (X + W) : left ? X : X + W / 2 - BW * F / 2, dy = top ? Y : BH * F - (Y + H)
  return { corner, w: W, h: H, dx, dy, fill: w / (w + 2 * p) }
}
const GEO_A = { arrow: { x: 860, y: 10, s: 64 }, label: { cx: 892, y: 78, fs: 15, fd: 22 }, chest: { x: 18, y: 464, s: 60 }, orbs: { cx: 480, y: 14, s: 34, gap: 9 } }
export function layoutA() {
  const G = GEO_A, L = {}
  L.arrow = { ...boardRect(G.arrow.x, G.arrow.y, G.arrow.s, G.arrow.s), el: 38 }
  L.chest = { ...boardRect(G.chest.x, G.chest.y, G.chest.s, G.chest.s), el: 22, yaw: 35 }
  const O = G.orbs, W = 6 * O.s + 5 * O.gap
  for (let i = 0; i < 6; i++) L['orb' + i] = { ...boardRect(O.cx - W / 2 + i * (O.s + O.gap), O.y, O.s, O.s, 0.1), el: 10 }
  // Name und Entfernung mittig unter dem Pfeil (DOM beim Wirt): Mitte von rechts, Oberkante, Schriftgrößen in Bezugs-px
  L.label = { right: (BW - G.label.cx) * F, top: G.label.y * F, fs: G.label.fs * F, fd: G.label.fd * F }
  return L
}

export function createHud3d(opts = {}) {
  const O = { reducedMotion: false, ...opts }
  const root = new THREE.Group(); root.name = 'hud-3d'
  const S = { status: hasHud3dAssets() ? 'LOADING' : 'MISSING', error: null, loaded: 0, updMs: 0, updates: 0, counts: [0, 0, 0, 0, 0, 0], shown: [-1, -1, -1, -1, -1, -1], flights: 0, landed: 0, chestOpen: false, target: null, arrowRenders: 0 }
  const L = layoutA()
  const _ink = new THREE.Color(INK)
  const RM = () => (typeof O.reducedMotion === 'function' ? O.reducedMotion() : !!O.reducedMotion)
  const SH = createHudShell({ ref: { W: 1920, H: 1080 }, pad: 0, gain: { '*': 0.7, chest: 1.0, arrow: 0.5 }, reducedMotion: RM, ink: () => _ink, ol: [2, 3.5], sqX: 1, sqMax: 0.25 })
  const ORB = (i) => 'orb' + i
  SH.addSlot('chest', L.chest, { lights: 'board', ortho: true, toneMapped: false, rim: 1 })
  for (let i = 0; i < 6; i++) SH.addSlot(ORB(i), L[ORB(i)], { lights: 'board', ortho: true, toneMapped: false, rim: 1, ol: [1.5, 2.6] })
  SH.addSlot('arrow', L.arrow, { lights: 'board', ortho: true, toneMapped: false, rim: 1 })
  const { slots } = SH
  const ZCHEST = zoneSet(PROOF_PALETTES.otown), ZDIG = zoneSet({ base: HALO, accent: HALO, detail: INK }), ZDIG0 = zoneSet({ base: '#f3efe6', accent: '#f3efe6', detail: '#77726b' })
  const MAT = { chest: boardClay(null, { zones: ZCHEST }), dig: boardClay(null, { zones: ZDIG }), dig0: boardClay(null, { zones: ZDIG0 }), arrow: boardClay('#f2c230'),
    orbs: FLUFF.map((f) => boardClay(f.c, { emissive: f.c })), orb0: boardClay('#a7a29a', { emissive: '#6a665f' }) }
  const sphereGeo = new THREE.SphereGeometry(0.5, 48, 32)
  const parts = { digits: null }
  const balls = []
  let alive = true

  // Prop wie im Board (wrap): Mitte des Kastens in den Ursprung, auf Kugelradius 1 skaliert, Drehung am äußeren Knoten (Euler YXZ)
  function wrap(obj) { const rootW = new THREE.Group(), inner = new THREE.Group(); rootW.add(inner); inner.add(obj); rootW.rotation.order = 'YXZ'; obj.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(obj), c = box.getCenter(new THREE.Vector3()), r = box.getBoundingSphere(new THREE.Sphere()).radius || 1
    inner.scale.setScalar(1 / r); inner.position.copy(c).multiplyScalar(-1 / r); return rootW }
  const fit = (s, el, yaw, mode = 'box') => { s.fitMode = mode; s.root.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(s.root); SH.fitCamera(s, el, yaw, 1 / s.L.fill / 0.94, new THREE.Vector3(), 1, b) }

  // ── Laden ───────────────────────────────────────────────────────────────────────────────────────────────────────────
  const loader = new GLTFLoader()
  async function load() {
    if (S.status === 'MISSING') return
    try {
      const [chest, digits, arrow] = await Promise.all([loader.loadAsync(privUrl('Chest')), loader.loadAsync(privUrl('FluffDigits')), loader.loadAsync(arrowUrl)])
      if (!alive) return
      // Truhe
      { const s = slots.chest, o = chest.scene; o.traverse((n) => { if (n.isMesh) { n.material = MAT.chest; n.frustumCulled = false } }); SH.countTris(o)
        const w = wrap(o); s.scene.add(w); s.root = w; Object.assign(s, SH.clipsOf(chest, o)); w.rotation.y = s.L.yaw * DEG; fit(s, s.L.el, 0) } // Board: Objekt um 35° gedreht, Licht und Kamera fest
      // Ziffern (Board numberGroup): Geometrie mit Knoten-Drehung, mittig, Höhe 1
      { digits.scene.updateMatrixWorld(true); const D = {}
        for (let i = 0; i < 10; i++) { let m = digits.scene.getObjectByName('KFB_Digit_' + i); if (m && !m.isMesh) m.traverse((x) => { if (x.isMesh) m = x }); if (!m) continue
          const g = m.geometry.clone(); g.applyMatrix4(m.matrixWorld); g.computeBoundingBox(); const b = g.boundingBox, c = b.getCenter(new THREE.Vector3()); g.translate(-c.x, -c.y, -c.z)
          D[i] = { geo: g, w: b.max.x - b.min.x, h: b.max.y - b.min.y } }
        parts.digits = D }
      // Pfeil
      { const s = slots.arrow, o = arrow.scene; o.traverse((n) => { if (n.isMesh) { n.material = MAT.arrow; n.frustumCulled = false } }); SH.countTris(o)
        const w = wrap(o); s.scene.add(w); s.root = w; s.fitMode = 'sphere'; SH.fitCamera(s, s.L.el, 0, 1 / s.L.fill / 0.94, new THREE.Vector3(), 1, null); s.L.hidden = true }
      for (let i = 0; i < 6; i++) buildOrb(i, S.counts[i])
      S.loaded = 3; S.status = 'OK'
    } catch (e) { S.status = 'ERROR'; S.error = String(e?.message || e) }
  }
  load()

  // ── Kugeln ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  function numberGroup(str, mat) {
    const D = parts.digits, grp = new THREE.Group(), H = D[0].h, gap = 0.08 * H; let x = 0; const ps = []
    for (const ch of String(str)) { const d = D[+ch]; if (!d) continue; ps.push([d, x + d.w / 2]); x += d.w + gap }
    const total = x - gap; for (const [d, px] of ps) { const m = new THREE.Mesh(d.geo, mat); m.position.set((px - total / 2) / H, 0, 0); m.scale.setScalar(1 / H); grp.add(m) }
    grp.userData.w = total / H; return grp
  }
  function buildOrb(i, n) {
    const s = slots[ORB(i)]; if (!parts.digits) return; if (S.shown[i] === n && s.root) return
    if (s.root) { s.scene.remove(s.root); s.root.traverse((o) => { if (o.isMesh && o.geometry !== sphereGeo && !Object.values(parts.digits).some((d) => d.geo === o.geometry)) o.geometry.dispose() }) }
    const g = new THREE.Group(), grey = n === 0
    g.add(new THREE.Mesh(sphereGeo, grey ? MAT.orb0 : MAT.orbs[i]))
    const num = numberGroup(String(n), grey ? MAT.dig0 : MAT.dig), sc = Math.min(0.52, 0.78 / Math.max(0.6, num.userData.w))
    num.scale.setScalar(sc); num.position.set(0, 0.075, 0.44); num.rotation.x = -0.17; g.add(num)
    const w = wrap(g); s.scene.add(w); s.root = w; s.fitMode = 'box'; fit(s, s.L.el, 0); s.dirty = true; S.shown[i] = n
  }

  // ── Einflug: Feder zur aktuellen Kugel (Bildschirm-px), Kontakt → Squash + Zahl ───────────────────────────────────────
  const ballGeo = new THREE.SphereGeometry(1, 20, 14), ballMats = FLUFF.map((f) => boardClay(f.c, { emissive: f.c }))
  function launch(kind = 0, n = 1, from = null) {
    const i = clamp(kind | 0, 0, 5)
    if (RM()) { S.shown[i] = -1; buildOrb(i, S.counts[i]); return }
    const cnt = Math.min(6, Math.max(1, n)), v = SH.view
    for (let j = 0; j < cnt; j++) {
      const m = new THREE.Mesh(ballGeo, ballMats[i]); m.renderOrder = 50; m.visible = false; SH.overlay.add(m)
      const f = from || { x: v.W * (0.5 + (Math.random() - 0.5) * 0.08), y: v.H * 0.58 }
      balls.push({ m, i, x: f.x, y: f.y, vx: (Math.random() - 0.5) * 300 * v.k, vy: -900 * v.k, t: -j * 0.08, last: j === cnt - 1 }); S.flights++
    }
  }
  function flyBalls(dt) {
    const v = SH.view
    for (let k = balls.length - 1; k >= 0; k--) { const b = balls[k]; b.t += dt; if (b.t < 0) continue; b.m.visible = true
      const r = slots[ORB(b.i)].rect, tx = r.x + r.w / 2, ty = r.y + r.h / 2, w = 5.2, z = 0.8
      b.vx += (w * w * (tx - b.x) - 2 * z * w * b.vx) * dt; b.vy += (w * w * (ty - b.y) - 2 * z * w * b.vy) * dt; b.x += b.vx * dt; b.y += b.vy * dt
      const rad = r.w * 0.5 * slots[ORB(b.i)].L.fill, d = Math.hypot(tx - b.x, ty - b.y), sz = clamp(d / (v.H * 0.4), 0.35, 1) * 16 * v.k
      b.m.position.set(b.x, v.H - b.y, 100); b.m.scale.setScalar(sz)
      if (d < rad * 0.18 || b.t > 2.5) { SH.overlay.remove(b.m); balls.splice(k, 1); S.landed++; SH.squash(ORB(b.i), 9); if (b.last) buildOrb(b.i, S.counts[b.i]) } }
  }

  // ── Zielpfeil ───────────────────────────────────────────────────────────────────────────────────────────────────────
  const AR = { b: 0, vb: 0, p: 0, vp: 0, drawnB: 1e9, drawnP: 1e9, col: '' }
  const wrap180 = (a) => ((a + 180) % 360 + 360) % 360 - 180
  function stepArrow(dt) {
    const s = slots.arrow, T = S.target; if (!s.root) return
    const show = !!T; if (s.L.hidden === show) { s.L.hidden = !show; s.dirty = true }
    if (!show) return
    const w = 5.5, tb = T.b || 0, tp = clamp(T.p || 0, -30, 30)
    if (RM()) { AR.b = tb; AR.p = tp; AR.vb = AR.vp = 0 }
    else { let db = wrap180(tb - AR.b); if (Math.abs(db) < 1.5) db = 0; AR.vb += (w * w * db - 2 * w * AR.vb) * dt; AR.b = wrap180(AR.b + AR.vb * dt)
      const dp = tp - AR.p; AR.vp += (w * w * dp - 2 * w * AR.vp) * dt; AR.p += AR.vp * dt }
    const col = arrowColor(T.d)
    if (Math.abs(wrap180(AR.b - AR.drawnB)) > 0.5 || Math.abs(AR.p - AR.drawnP) > 0.5 || col !== AR.col) {
      s.root.rotation.set(0, (-90 - AR.b) * DEG, -AR.p * DEG); if (col !== AR.col) MAT.arrow.color.set(col)
      AR.drawnB = AR.b; AR.drawnP = AR.p; AR.col = col; s.dirty = true; S.arrowRenders++ }
  }

  return {
    object3d: root,
    update(dt = 1 / 60, sig = null) {
      if (!alive) return
      const u0 = performance.now(); SH.signal(sig)
      if (S.status !== 'OK') return
      stepArrow(dt); flyBalls(dt)
      for (let i = 0; i < 6; i++) if (!balls.some((b) => b.i === i) && S.shown[i] !== S.counts[i]) buildOrb(i, S.counts[i])
      SH.step(dt)
      S.updMs += performance.now() - u0; S.updates++
    },
    draw(gl) { if (alive && S.status === 'OK') SH.draw(gl) },
    // Wirt-API (Zustand von den Ownern)
    setCounts: (c) => { for (let i = 0; i < 6; i++) S.counts[i] = Math.max(0, (c?.[i] ?? 0) | 0) },
    land: (kind, n = 1, from = null) => { const i = clamp(kind | 0, 0, 5); S.counts[i] += Math.max(1, n | 0); launch(i, n, from) },
    setTarget: (t) => { S.target = t ? { name: t.name || '', b: +t.b || 0, p: +t.p || 0, d: t.d ?? null, dv: t.dv ?? 0 } : null },
    label: () => (S.target ? { name: S.target.name, dist: fmtDist(S.target.d), dv: Math.abs(S.target.dv) >= 8 ? (S.target.dv > 0 ? '↑ ' : '↓ ') + Math.round(Math.abs(S.target.dv)) + ' m' : null, color: arrowColor(S.target.d) } : null),
    labelLayout: () => L.label,
    setChestOpen: (v) => { const s = slots.chest; if (!!v === S.chestOpen || !s.root) return; S.chestOpen = !!v; SH.playOnce(s, v ? 'chest_open' : 'chest_close'); SH.squash('chest', 5) },
    event: (e) => SH.kick(e.type, e),
    phase: () => S.status, opened: () => ({ compass: false, chest: S.chestOpen }),
    uiStates: SH.uiStates, setUiFlag: SH.setUiFlag, uiState: SH.uiState, onUiState: SH.onUiState, setAnimator: SH.setAnimator,
    rects: SH.rects, view: () => ({ ...SH.view }),
    status: () => ({ status: S.status, error: S.error, loaded: S.loaded, ...SH.perf(), updMsAvg: S.updates ? +(S.updMs / S.updates).toFixed(4) : 0, counts: S.counts.slice(), shown: S.shown.slice(),
      flights: S.flights, landed: S.landed, chestOpen: S.chestOpen, target: S.target, arrow: { b: +AR.b.toFixed(2), p: +AR.p.toFixed(2), color: AR.col, renders: S.arrowRenders, visible: !slots.arrow.L.hidden },
      ui: SH.uiAll(), live: SH.live(), motion: SH.motion() }),
    resetStats: () => { SH.resetStats(); S.updMs = 0; S.updates = 0; S.arrowRenders = 0 },
    dispose() {
      alive = false; for (const b of balls) SH.overlay.remove(b.m); balls.length = 0
      SH.dispose(new Set(Object.values(MAT).flat())); Object.values(MAT).flat().forEach((m) => m.dispose()); ballMats.forEach((m) => m.dispose()); ballGeo.dispose(); sphereGeo.dispose()
      if (parts.digits) Object.values(parts.digits).forEach((d) => d.geo.dispose()); root.clear()
    },
  }
}
