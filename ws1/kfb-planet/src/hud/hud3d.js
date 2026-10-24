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
import { createHudShell, zoneSet, zoneMaterial, boardClay, clamp, DEG } from './hudShell.js'
import { PROOF_PALETTES } from './hudPalette.js'
import { createTempoColumn, createAltBand, COLUMN, ALT } from './tempoColumn.js'
import arrowUrl from '../assets/hud3d/kenney_arrow-rounded.glb?url'
import cassetteUrl from '../assets/hud3d/poly_cassette.glb?url' // „Cassette tape“ by Poly by Google (Paket HUD 3D R1, auch in kayfabizarro media/3D_Assets/KFB)

// Faust: KFB_HUD_Fist.r2.glb = Original-Monstrosity-Hand (Board KEEP; Georg 24.10.: bleibt als Standardwaffe des unbewaffneten Nahkampfs, Schlagring verworfen, V-668 überholt). Tauschbar hier.
export const FIST_FILE = 'KFB_HUD_Fist.r2'
const PRIV = import.meta.glob(['../private/50_BLENDER/N29/out/KFB_HUD_Chest.glb', '../private/50_BLENDER/N29/out/KFB_HUD_FluffDigits.glb', '../private/50_BLENDER/N29/out/KFB_HUD_Gear.glb',
  '../private/50_BLENDER/N29/out/KFB_HUD_Radio.glb', '../private/50_BLENDER/N29/out/KFB_HUD_CardFanShadow.glb', '../private/50_BLENDER/N32/_privat_kauf_asset/r2/out/KFB_HUD_*.r2.glb'], { query: '?url', import: 'default', eager: true })
// N34-Kassette (Georg 24.10.: „HUD-Teile r2“ lesbarer und kassettiger): verkleinerte Fassung aus scripts/hud/shrink-cassette.mjs (src/private-gen, gitignored, ~40 kB).
// Fehlt sie, bleibt die alte Kassette (die 1,4-MB-Quelle wird bewusst nicht eingebunden, der Einzeldatei-Bau würde sie einbetten).
const GEN = import.meta.glob(['../private-gen/hud/cassette_a.hud.glb'], { query: '?url', import: 'default', eager: true })
const casNewUrl = Object.values(GEN)[0] || null
export const hasNewCassette = () => !!casNewUrl
const privUrl = (name) => Object.entries(PRIV).find(([p]) => p.endsWith('/KFB_HUD_' + name + '.glb') || p.endsWith('/' + name + '.glb'))?.[1] || null
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
function boardRect(x, y, w, h, padK = 0.12, force = null) { // force: Ecke fest vorgeben (Gruppen wie die Aktionsleiste dürfen nicht nach x-Lage zerfallen)
  const p = Math.round(Math.max(w, h) * padK), X = (x - p) * F, Y = (y - p) * F, W = (w + 2 * p) * F, H = (h + 2 * p) * F, cx = x + w / 2
  const auto = (y + h / 2 < BH / 2 ? 't' : 'b') + (cx > BW * 0.62 ? 'r' : cx < BW * 0.38 ? 'l' : 'c')
  const corner = force || auto, R = corner.endsWith('r'), Lf = corner.endsWith('l'), T = corner.startsWith('t')
  const dx = R ? BW * F - (X + W) : Lf ? X : X + W / 2 - BW * F / 2, dy = T ? Y : BH * F - (Y + H)
  return { corner, w: W, h: H, dx, dy, fill: w / (w + 2 * p) }
}
const GEO_A = { arrow: { x: 860, y: 10, s: 64 }, label: { cx: 892, y: 78, fs: 15, fd: 22 }, chest: { x: 18, y: 464, s: 60 }, orbs: { cx: 480, y: 14, s: 34, gap: 9 },
  gear: { x: 875, y: 138, s: 34 }, radio: { x: 790, y: 426, w: 152, h: 98 }, actions: { y: 480, s: 44, gap: 12, cx: 480, n: 6 }, inter: { s: 44 }, almanac: { x: 18, y: 16, cw: 128, step: 12, cap: 17, ar: 1.79 }, keys: 13 }
// Aktionsplätze (Lead 24.10.): echte Spieltasten V/B/N, keine Granate (das Spiel hat keine), 4–6 leer angedeutet. hudYaw 35° + hudView.yaw_deg (N32 r2)
export const ACTIONS = [{ id: 'fist', file: FIST_FILE, yaw: 90, key: 'V', t: 'Faust' }, { id: 'blaster', file: 'KFB_HUD_Blaster.r2', yaw: 270, key: 'B', t: 'Blaster' }, { id: 'bomb', file: 'KFB_HUD_Bomb.r2', yaw: 0, key: 'N', t: 'Clown-Bombe' }]
// cas=new (Standard, Georg 24.10.): Truhe größer als Gegengewicht, Kassette etwas kleiner; Ecken bleiben (Truhe unten links, Kassette unten rechts)
// Größen als Verhältnis zur Interaktions-Blase (Georg 24.10.: die Blase ist der Maßstab; Aktions-Icons ähnliche Größe und ähnliches Volumen,
// Truhe als Gegengewicht zu Leiste und Kassette). Blase: Höhe 44 Board-px (Breite × 1,24).
export const RATIO = { bubble: 44, action: 1.18, actionGap: 0.36, chest: 1.95, cassetteH: 1.91 }
const RB = RATIO.bubble, AS = Math.round(RB * RATIO.action), CS = Math.round(RB * RATIO.chest), BOT = 524 // gemeinsame Unterkante der unteren Reihe (Board-px)
const GEO_NEW = { chest: { x: 18, y: BOT - CS, s: CS }, radio: { x: 812, y: BOT - Math.round(RB * RATIO.cassetteH), w: 130, h: Math.round(RB * RATIO.cassetteH) },
  actions: { y: BOT - AS, s: AS, gap: Math.round(RB * RATIO.actionGap), cx: 480, n: 6 } }
// Tempo-Säule (R2/R3 Georg 25.10.): Höhe als Verhältnis zur Blase, Breite aus dem Seitenverhältnis der Röhre; Mitte = Spalte von Pfeil und Zahnrad (x 892).
// Zahl darunter wie die Entfernung unter dem Pfeil (Schrift fd 22 / Einheit fs 15). R3: Spalte gleichmäßig verteilt – Entfernung → Zahnrad, Zahnrad →
// Lichthof der Säule und Lichthof → Zahl haben denselben Abstand GAP (= Entfernung → Zahnrad); der Lichthof (HALO, haloR 20 Bezugs-px) zählt mit,
// damit auch im Boost nichts tangiert. Rand der Säule PAD ≥ HALO, sonst schneidet die Hülle den Lichthof ab. Kopfraum über der Kappe für den Boost-Effekt.
// Flughöhe links daneben: Mitte 56 Bezugs-px links der Säulenmitte, damit die Zahlen (bis „281“ und „118“) mit Luft nebeneinander stehen; gleiche Ober-/Unterkante.
export const TEMPO = { cx: 892, h: 2.4, halo: 10, pad: 14, alt: { dx: 56 } }
export function layoutA(casNew = true) {
  const G = casNew ? { ...GEO_A, ...GEO_NEW } : GEO_A, L = {}
  L.arrow = { ...boardRect(G.arrow.x, G.arrow.y, G.arrow.s, G.arrow.s, 0.3), el: 38 }
  L.chest = { ...boardRect(G.chest.x, G.chest.y, G.chest.s, G.chest.s, 0.3), el: 22, yaw: 35 }
  L.gear = { ...boardRect(G.gear.x, G.gear.y, G.gear.s, G.gear.s, 0.3), el: 22, yaw: -112 + 35 }
  { const T = TEMPO, C = COLUMN, U = C.FULL + 2 * C.R, labBot = G.label.y + G.label.fs + 4 + G.label.fd, GAP = G.gear.y - labBot
    const tubeH = Math.round(RB * T.h), head = Math.round(tubeH * C.HEAD / U), ty = G.gear.y + G.gear.s + GAP + T.halo, h = tubeH + head, w = Math.ceil(h * 2 * C.R / (U + C.HEAD)), x = T.cx - w / 2
    L.speed = { ...boardRect(x, ty - head, w, h, T.pad / h, 'tr'), el: 8, hidden: true, fill: h / (h + 2 * T.pad) } // höhenbegrenzt: Füllgrad aus der Höhe
    L.speedText = { right: (BW - T.cx) * F, top: (ty + tubeH + T.halo + GAP) * F, fs: G.label.fs * F, fd: G.label.fd * F }
    L.speedCol = { tubeTop: ty * F, tubeBottom: (ty + tubeH) * F, halo: T.halo * F, gap: GAP * F } // für Prüfungen
    const ax = T.cx - T.alt.dx, aw = Math.ceil(tubeH * 2 * ALT.R * 1.12 / (ALT.FULL + 2 * ALT.R))
    L.alt = { ...boardRect(ax - aw / 2, ty, aw, tubeH, 4 / tubeH, 'tr'), el: 8, hidden: true, fill: tubeH / (tubeH + 8) } // Flughöhe: gleiche Höhe wie die Röhre
    L.altText = { right: (BW - ax) * F, top: (ty + tubeH + T.halo + GAP) * F, fs: G.label.fs * F, fd: G.label.fd * F } }
  L.cassette = { ...boardRect(G.radio.x, G.radio.y, G.radio.w, G.radio.h, 0.2), el: 16, yaw: -14 }
  // Aktionen: sechs Plätze + Interaktion in einer Reihe (h3d-hud buildFrame); Interaktion ist DOM (Blase) beim Wirt
  const A = G.actions, iw = Math.round(G.inter.s * 1.24), igap = A.gap + 8, rowW = A.n * A.s + (A.n - 1) * A.gap + igap + iw, ax0 = Math.round(A.cx - rowW / 2)
  L.slots = []; for (let i = 0; i < A.n; i++) L.slots.push({ x: (ax0 + i * (A.s + A.gap)) * F, y: A.y * F, s: A.s * F })
  ACTIONS.forEach((a, i) => { L['act' + i] = { ...boardRect(ax0 + i * (A.s + A.gap), A.y, A.s, A.s, 0.3, 'bc'), el: 22, yaw: 35 + a.yaw } })
  L.inter = { x: (ax0 + A.n * (A.s + A.gap) - A.gap + igap) * F, y: (A.y + (A.s - G.inter.s) / 2) * F, w: iw * F, h: G.inter.s * F } // Blase auf der Mittellinie der Aktionen
  L.keys = G.keys * F
  L.almanac = { x: G.almanac.x * F, y: G.almanac.y * F, cw: G.almanac.cw * F, step: G.almanac.step * F, cap: G.almanac.cap * F, ch: Math.round(G.almanac.cw / G.almanac.ar) * F }
  L.fanShadow = fanShadowRect(7)
  const O = G.orbs, W = 6 * O.s + 5 * O.gap
  for (let i = 0; i < 6; i++) { L['orb' + i] = { ...boardRect(O.cx - W / 2 + i * (O.s + O.gap), O.y, O.s, O.s, 0.1, 'tc'), el: 10 }; L['orb' + i].dx0 = L['orb' + i].dx }
  // Name und Entfernung mittig unter dem Pfeil (DOM beim Wirt): Mitte von rechts, Oberkante, Schriftgrößen in Bezugs-px
  L.label = { right: (BW - G.label.cx) * F, top: G.label.y * F, fs: G.label.fs * F, fd: G.label.fd * F }
  return L
}

// Kontaktschatten unter dem Fächer (Board fanEl): Breite cw × 1,05, Höhe cw × 0,24, unter der untersten Karte
function fanShadowRect(n) { const A = GEO_A.almanac, ch = Math.round(A.cw / A.ar), x = A.x - Math.round(A.cw * 0.04), y = A.y + ch + (Math.max(1, n) - 1) * A.step - Math.round(A.cw * 0.12)
  return { ...boardRect(x, y, Math.round(A.cw * 1.05), Math.round(A.cw * 0.24), 0.04), el: 70, yaw: 0 } }

// Tastensymbole der Kassette als Knet-Relief (h3d-core iconShapes): Play, Pause, Weiter, Lautsprecher an/aus – XY, Höhe 1, zentriert
function iconShapes(kind) {
  const S = [], tri = (x0, x1, hh) => { const s = new THREE.Shape(); s.moveTo(x0, -hh); s.lineTo(x1, 0); s.lineTo(x0, hh); s.closePath(); return s }
  const rect = (x0, y0, x1, y1, r = 0.06) => { const s = new THREE.Shape(); s.moveTo(x0 + r, y0); s.lineTo(x1 - r, y0); s.quadraticCurveTo(x1, y0, x1, y0 + r); s.lineTo(x1, y1 - r); s.quadraticCurveTo(x1, y1, x1 - r, y1); s.lineTo(x0 + r, y1); s.quadraticCurveTo(x0, y1, x0, y1 - r); s.lineTo(x0, y0 + r); s.quadraticCurveTo(x0, y0, x0 + r, y0); return s }
  if (kind === 'play') S.push(tri(-0.36, 0.5, 0.5))
  if (kind === 'pause') S.push(rect(-0.4, -0.5, -0.1, 0.5), rect(0.1, -0.5, 0.4, 0.5))
  if (kind === 'next') S.push(tri(-0.56, 0.02, 0.4), tri(-0.02, 0.56, 0.4))
  if (kind === 'sound' || kind === 'mute') {
    const sp = new THREE.Shape(); sp.moveTo(-0.6, -0.17); sp.lineTo(-0.38, -0.17); sp.lineTo(-0.08, -0.44); sp.lineTo(-0.08, 0.44); sp.lineTo(-0.38, 0.17); sp.lineTo(-0.6, 0.17); sp.closePath(); S.push(sp)
    if (kind === 'sound') for (const r of [0.2, 0.4]) { const w = new THREE.Shape(), t = 0.09; w.absarc(0, 0, r + t, -0.85, 0.85, false); w.absarc(0, 0, r, 0.85, -0.85, true); w.closePath(); S.push(w) } }
  return S
}
function iconMesh(kind, mat) {
  const grp = new THREE.Group()
  for (const s of iconShapes(kind)) grp.add(new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.035, bevelSegments: 2, curveSegments: 18 }), mat))
  if (kind === 'mute') for (const ang of [Math.PI / 4, -Math.PI / 4]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.17), mat); m.rotation.z = ang; m.position.set(0.3, 0, 0.06); grp.add(m) }
  return grp
}

export function createHud3d(opts = {}) {
  const O = { reducedMotion: false, ...opts }
  const root = new THREE.Group(); root.name = 'hud-3d'
  const S = { status: hasHud3dAssets() ? 'LOADING' : 'MISSING', error: null, loaded: 0, updMs: 0, updates: 0, counts: [0, 0, 0, 0, 0, 0], shown: [-1, -1, -1, -1, -1, -1], flights: 0, landed: 0, chestOpen: false, target: null, arrowRenders: 0, music: { playing: true, muted: false }, weapon: 'fist', almanacN: 0 }
  const CASNEW = opts.cassette !== 'old' && hasNewCassette()
  const L = layoutA(CASNEW)
  const _ink = new THREE.Color(INK)
  const RM = () => (typeof O.reducedMotion === 'function' ? O.reducedMotion() : !!O.reducedMotion)
  const SH = createHudShell({ ref: { W: 1920, H: 1080 }, pad: 0, gain: { '*': 0.7, chest: 1.0, arrow: 0.5, fanShadow: 0 }, reducedMotion: RM, ink: () => _ink, ol: [2, 3.5], sqX: 1, sqMax: 0.25, fx: true, haloR: 20 })
  const ORB = (i) => 'orb' + i
  SH.addSlot('chest', L.chest, { lights: 'board', ortho: true, toneMapped: false, rim: 1 })
  for (let i = 0; i < 6; i++) SH.addSlot(ORB(i), L[ORB(i)], { lights: 'board', ortho: true, toneMapped: false, rim: 1, ol: [1.5, 2.6] })
  SH.addSlot('arrow', L.arrow, { lights: 'board', ortho: true, toneMapped: false, rim: 1 })
  // Paket 2: Fächer-Schatten (ohne Kontur, Deckkraft 0,55), Aktionen 1–3, Zahnrad, Kassette
  SH.addSlot('fanShadow', L.fanShadow, { lights: 'board', ortho: true, toneMapped: false, rim: 0 })
  ACTIONS.forEach((a, i) => SH.addSlot('act' + i, L['act' + i], { lights: 'board', ortho: true, toneMapped: false, rim: 1 }))
  SH.addSlot('gear', L.gear, { lights: 'board', ortho: true, toneMapped: false, rim: 1 })
  SH.addSlot('cassette', L.cassette, { lights: 'board', ortho: true, toneMapped: false, rim: 1 })
  SH.addSlot('speed', L.speed, { lights: 'board', ortho: true, toneMapped: false, rim: 1 }) // Kontur wie Pfeil/Zahnrad
  SH.addSlot('alt', L.alt, { lights: 'board', ortho: true, toneMapped: false, rim: 1 })
  SH.slots.fanShadow.mat.uniforms.opacity.value = 0.55
  const { slots } = SH
  const ZCHEST = zoneSet(PROOF_PALETTES.otown), ZDIG = zoneSet({ base: HALO, accent: HALO, detail: INK }), ZDIG0 = zoneSet({ base: '#f3efe6', accent: '#f3efe6', detail: '#77726b' })
  const MAT = { chest: boardClay(null, { zones: ZCHEST }), dig: boardClay(null, { zones: ZDIG }), dig0: boardClay(null, { zones: ZDIG0 }), arrow: boardClay('#f2c230'),
    orbs: FLUFF.map((f) => boardClay(f.c, { emissive: f.c })), orb0: boardClay('#a7a29a', { emissive: '#6a665f' }) }
  MAT.gear = boardClay(null, { zones: ZCHEST }); MAT.shadow = zoneMaterial(ZCHEST, { alpha: true }); MAT.icon = new THREE.MeshStandardMaterial({ color: HALO, roughness: 0.8 }); MAT.iconMute = new THREE.MeshStandardMaterial({ color: '#3a3242', roughness: 0.8 })
  MAT.btn = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, flatShading: true })
  const sphereGeo = new THREE.SphereGeometry(0.5, 48, 32)
  const parts = { digits: null, cassette: null }
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
      S.loaded = 3
      await loadPack2().catch((e) => { S.pack2Error = String(e?.message || e) })
      S.status = 'OK'
    } catch (e) { S.status = 'ERROR'; S.error = String(e?.message || e) }
  }
  load()

  // ── Tempo-Leiste (Georg 24.10.; h3d-core barProp): Knet-Röhre in Creme, Füllung über die volle Skala #4fb648 → #9cc83a → #f2c230 → #ec8a2c → #d9453a.
  // Füllung federt nach (ω 9, ζ 0,45). Boost = Effekt über dem Roten (A Überkochen / B Hitze, Schalter boost=a|b), Lichthof Orange, Wackeln gedämpft (3°),
  // Squash beim Zünden und am Anschlag. Stall im Flug: Säule blinkt kühl, Lichthof Blaugrau ohne Wackeln. Nur Fahren und Fliegen.
  const SPD = { shown: 0, v: 0, target: 0, boost: false, visible: false, maxHit: false, t: 0, kmh: 0, glow: 0, zones: null, fly: false }
  const ALTS = { visible: false, m: 0, shown: 0, v: 0, target: 0 }
  function buildAlt() { const s = slots.alt, B = createAltBand(boardClay); parts.alt = B; s.scene.add(B.group); s.root = B.group; s.fitMode = 'box'; B.setFrac(0)
    SH.fitCamera(s, s.L.el, 0, 1 / s.L.fill / 0.97, new THREE.Vector3(), 1, B.box()) }
  function stepAlt(dt) { const s = slots.alt, B = parts.alt; if (!B) return
    if (s.L.hidden === ALTS.visible) { s.L.hidden = !ALTS.visible; s.dirty = true }
    if (!ALTS.visible) return
    const w = 7, z = 0.7; if (RM()) { ALTS.shown = ALTS.target; ALTS.v = 0 } else { ALTS.v += (w * w * (ALTS.target - ALTS.shown) - 2 * z * w * ALTS.v) * dt; ALTS.shown += ALTS.v * dt }
    if (B.setFrac(ALTS.shown)) s.dirty = true }
  function buildColumn() { const s = slots.speed, C = createTempoColumn(boardClay); parts.column = C
    s.scene.add(C.group); s.root = C.group; s.fitMode = 'box'; C.setZones([['norm', 0.5], ['fast', 0.85], ['red', 1]]); C.setFrac(0) // Fahrzonen als Vorgabe bis zur ersten Telemetrie
    SH.fitCamera(s, s.L.el, 0, 1 / s.L.fill / 0.97, new THREE.Vector3(), 1, C.box()) }
  // Truhe auf/zu (Paket 5, Georg 25.10. „cartoonig“): Deckel chest_lid an einer unterdämpften Feder (ω 15, ζ 0,42 → ~20 % Überschwingen beim Öffnen),
  // beim Zuklappen prallt er am Rand ab (Rückprall 0,3) und die Truhe federt (chest_bounce + Squash). Statt der starren Clips chest_open/close (0,33 s).
  // Reduzierte Bewegung: Deckel springt in die Endlage. Offen = −100° um X wie KFB_HUD_Chest.otown.auf.glb.
  const LID = { node: null, a: 0, v: 0, target: 0, OPEN: -100 * DEG, moving: false, bounced: false, q0: null }
  function stepChest(dt) {
    const s = slots.chest; if (!s.root) return
    if (!LID.node) { LID.node = s.root.getObjectByName('chest_lid'); if (!LID.node) return; s.clips?.chest_open?.stop(); s.clips?.chest_close?.stop(); LID.q0 = LID.node.quaternion.clone() } /* Clips für den Deckel aus, sonst überschreibt der Mixer die Feder */
    if (RM()) { if (LID.a !== LID.target) { LID.a = LID.target; LID.v = 0 } } else {
      const w = 15, z = 0.42, n = Math.max(1, Math.ceil(dt / (1 / 120))), h = dt / n
      for (let i = 0; i < n; i++) { LID.v += (w * w * (LID.target - LID.a) - 2 * z * w * LID.v) * h; LID.a += LID.v * h
        if (LID.target === 0 && LID.a > 0) { LID.a = 0; LID.v = -LID.v * 0.3; if (!LID.bounced) { LID.bounced = true; SH.playOnce(s, 'chest_bounce'); SH.squash('chest', 5) } } } }
    const moving = Math.abs(LID.target - LID.a) > 0.002 || Math.abs(LID.v) > 0.01
    if (moving || LID.moving) { LID.node.quaternion.copy(LID.q0).multiply(_qx.setFromAxisAngle(_X, LID.a)); s.dirty = true }
    LID.moving = moving
  }
  const _qx = new THREE.Quaternion(), _X = new THREE.Vector3(1, 0, 0)
  function stepSpeed(dt) {
    const s = slots.speed, C = parts.column; if (!C) return
    if (s.L.hidden === SPD.visible) { s.L.hidden = !SPD.visible; s.dirty = true }
    if (!SPD.visible) return
    if (SPD.zones && C.setZones(SPD.zones)) s.dirty = true
    const w = 9, z = 0.45; if (RM()) { SPD.shown = SPD.target; SPD.v = 0 } else { SPD.v += (w * w * (SPD.target - SPD.shown) - 2 * z * w * SPD.v) * dt; SPD.shown += SPD.v * dt }
    SPD.t += dt; if (C.stepBoost(dt, SPD.boost, RM())) s.dirty = true
    if (C.setStall(SPD.stall, SPD.t, RM())) s.dirty = true
    if (C.setFrac(SPD.shown)) s.dirty = true
    SPD.glow = C.fx()
    SH.setHint('speed', (SPD.boost || SPD.stall) && !RM(), SPD.stall && !SPD.boost ? '#9fb8d8' : '#ff7a2a', { wob: SPD.stall ? 0 : 3 })
    if (SPD.boost && !SPD.boostWas) SH.pressFx('speed'); SPD.boostWas = SPD.boost // Squash beim Zünden
    if (SPD.target >= 0.98 && !SPD.maxHit) { SPD.maxHit = true; SH.pressFx('speed') } else if (SPD.target < 0.9) SPD.maxHit = false
  }



  // ── Paket 2 laden: Aktionen (N32 r2, Originalmaterial), Zahnrad (N29, otown-Zonen), Kassette (Poly + Tasten aus N29 Radio), Fächer-Schatten ───────
  async function loadPack2() {
    const ld = (u) => (u ? loader.loadAsync(u) : Promise.resolve(null))
    const [gear, radio, cas, shadow, ...acts] = await Promise.all([ld(privUrl('Gear')), ld(privUrl('Radio')), ld(CASNEW ? casNewUrl : cassetteUrl), ld(privUrl('CardFanShadow')), ...ACTIONS.map((a) => ld(privUrl(a.file)))])
    acts.forEach((g, i) => { if (!g) return; const s = slots['act' + i], o = g.scene; o.traverse((n) => { if (n.isMesh) n.frustumCulled = false }); SH.countTris(o)
      const w = wrap(o); s.scene.add(w); s.root = w; Object.assign(s, SH.clipsOf(g, o)); w.rotation.y = s.L.yaw * DEG; fit(s, s.L.el, 0); S.loaded++ })
    if (gear) { const s = slots.gear, o = gear.scene; o.traverse((n) => { if (n.isMesh) { n.material = MAT.gear; n.frustumCulled = false } }); SH.countTris(o)
      const w = wrap(o); s.scene.add(w); s.root = w; Object.assign(s, SH.clipsOf(gear, o)); w.rotation.y = s.L.yaw * DEG; fit(s, s.L.el, 0); S.loaded++ }
    if (shadow) { const s = slots.fanShadow, o = shadow.scene; o.traverse((n) => { if (n.isMesh) { n.material = MAT.shadow; n.frustumCulled = false } })
      const w = wrap(o); s.scene.add(w); s.root = w; fit(s, s.L.el, 0); s.L.hidden = true; S.loaded++ }
    if (cas && CASNEW) { buildCassetteNew(cas); S.loaded++ } else if (cas && radio) { parts.cassette = { cas, radio }; buildCassette(); S.loaded++ }
    buildColumn(); buildAlt()
  }
  // Weiße Kassette (h3d-core cassetteProp): Körper poly_cassette mit Creme-Shader, drei Tasten aus KFB_HUD_Radio (Oberseite #4b3f63, Flanke #1f1829;
  // Ton aus #c9c2cc / #8d8492), Symbole als Relief in Creme, 25 % der Kassettenbreite, Abstand 29 %. Neu gebaut nur bei Zustandswechsel (Play/Pause, Ton).
  const btnGeo = new Map()
  function buildCassette() {
    const P = parts.cassette; if (!P) return; const s = slots.cassette, key = (S.music.playing ? 'p' : 's') + (S.music.muted ? 'm' : 'o')
    if (P.key === key && s.root) return; P.key = key
    if (s.root) { s.scene.remove(s.root); s.root.traverse((o) => { if (o.isMesh && o.userData.own) o.geometry.dispose() }) }
    const g = new THREE.Group(), body = new THREE.Group(); P.cas.scene.updateMatrixWorld(true)
    P.cas.scene.traverse((m) => { if (!m.isMesh) return; P.bodyMat ||= boardClay('#ffffff', { map: m.material.map, cream: '#f6efe0', amp: 0.22 }); const mm = new THREE.Mesh(m.geometry, P.bodyMat); mm.applyMatrix4(m.matrixWorld); body.add(mm) })
    g.add(body); body.updateMatrixWorld(true)
    const bb = new THREE.Box3().setFromObject(body), size = bb.getSize(new THREE.Vector3()), ctr = bb.getCenter(new THREE.Vector3())
    P.radio.scene.updateMatrixWorld(true)
    const btn = (name, muted) => {
      const n = P.radio.scene.getObjectByName(name); const grp = new THREE.Group(); if (!n) return grp
      const top = new THREE.Color(muted ? '#c9c2cc' : '#4b3f63'), side = new THREE.Color(muted ? '#8d8492' : '#1f1829')
      if (!btnGeo.has(name)) { const inv = new THREE.Matrix4().copy(n.matrixWorld).invert(), g0 = (n.geometry.index ? n.geometry.toNonIndexed() : n.geometry.clone()); g0.computeVertexNormals(); btnGeo.set(name, g0) }
      const geo = btnGeo.get(name).clone(), nrm = geo.getAttribute('normal'), col = new Float32Array(nrm.count * 3), nv = new THREE.Vector3()
      for (let i = 0; i < nrm.count; i += 3) { nv.set(0, 0, 0); for (let k = 0; k < 3; k++) nv.add(new THREE.Vector3().fromBufferAttribute(nrm, i + k)); nv.normalize(); const cc = nv.y > 0.55 ? top : side; for (let k = 0; k < 3; k++) cc.toArray(col, (i + k) * 3) }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); const m = new THREE.Mesh(geo, MAT.btn); m.userData.own = true; grp.add(m)
      const b = new THREE.Box3().setFromObject(grp), cc = b.getCenter(new THREE.Vector3()); m.position.sub(cc); grp.userData.size = b.getSize(new THREE.Vector3()); return grp
    }
    const B = [btn('KFB_Btn_play'), btn('KFB_Btn_next'), btn('KFB_Btn_mute', S.music.muted)]
    const front = bb.max.z + 0.002 * size.x, ref = B[0].userData.size || new THREE.Vector3(1, 1, 1), k = (size.x * 0.25) / Math.max(ref.x, ref.z)
    B.forEach((h, i) => { h.rotation.x = Math.PI / 2; h.scale.setScalar(k); h.position.set(ctr.x + [-0.29, 0, 0.29][i] * size.x, ctr.y, front + 0.02 * size.x); g.add(h) })
    const kinds = [S.music.playing ? 'pause' : 'play', 'next', S.music.muted ? 'mute' : 'sound']; g.updateMatrixWorld(true); P.btns = B
    B.forEach((hh, i) => { const bx = new THREE.Box3().setFromObject(hh), cc = bx.getCenter(new THREE.Vector3()), sz = bx.getSize(new THREE.Vector3()), d = Math.min(sz.x, sz.y)
      const ic = iconMesh(kinds[i], S.music.muted && i === 2 ? MAT.iconMute : MAT.icon); ic.traverse((o) => { if (o.isMesh) o.userData.own = true }); ic.scale.setScalar(d * 0.4); ic.position.set(cc.x + (kinds[i] === 'play' ? d * 0.03 : 0), cc.y, bx.max.z - d * 0.01); g.add(ic) })
    const w = wrap(g); w.rotation.y = s.L.yaw * DEG; s.scene.add(w); s.root = w; fit(s, s.L.el, 0); s.dirty = true
  }
  // N34-Kassette (n34_special MODE cassette): fast frontal, 12° Gieren, 8° Neigen; Originaltextur in Knete. Knöpfe sind Bildschirm-Anzeigen (Wirt, DOM)
  // auf den Spulen (links Play/Pause, rechts Weiter) und klein mittig darunter (Ton) – Lage als Anteil der Silhouette, gemessen im N34-Render (SPOOLS).
  const SPOT = { play: [0.276, 0.46, 1], next: [0.706, 0.468, 1], mute: [0.49, 0.75, 0.72] } // Ton höher: klar innerhalb der Kassette, keine Tangente am Rand (Georg 24.10.)
  function buildCassetteNew(g) {
    const s = slots.cassette, o = g.scene; o.traverse((n) => { if (n.isMesh) { n.material = boardClay('#ffffff', { map: n.material.map, amp: 0.18 }); n.frustumCulled = false } }); SH.countTris(o)
    const w = wrap(o); w.rotation.set(0, -12 * DEG, 0); /* Neigen 8° über die Kamera (Höhenwinkel) */ s.scene.add(w); s.root = w; fit(s, 8, 0); parts.casNew = { verts: [] }
    w.updateMatrixWorld(true); o.traverse((n) => { if (!n.isMesh) return; const pa = n.geometry.getAttribute('position'); for (let i = 0; i < pa.count; i++) parts.casNew.verts.push(new THREE.Vector3().fromBufferAttribute(pa, i).applyMatrix4(n.matrixWorld)) })
  }
  // Tasten der Kassette als Bildschirm-Kreise (für die Trefferflächen des Wirts)
  const _p = new THREE.Vector3()
  function cassetteButtons() {
    if (parts.casNew) { const s = slots.cassette, r = s.rect; if (!s.root) return {}; let x0 = 1, x1 = -1, y0 = 1, y1 = -1
      for (const v of parts.casNew.verts) { _p.copy(v).project(s.cam); x0 = Math.min(x0, _p.x); x1 = Math.max(x1, _p.x); y0 = Math.min(y0, _p.y); y1 = Math.max(y1, _p.y) }
      const X0 = r.x + (x0 + 1) / 2 * r.w, X1 = r.x + (x1 + 1) / 2 * r.w, Y0 = r.y + (1 - y1) / 2 * r.h, Y1 = r.y + (1 - y0) / 2 * r.h, rad = (Y1 - Y0) * 0.2
      return { ...Object.fromEntries(Object.entries(SPOT).map(([k, [u, v, f]]) => [k, { x: X0 + u * (X1 - X0), y: Y0 + v * (Y1 - Y0), r: rad * f, j17: true }])), box: { x0: X0, x1: X1, y0: Y0, y1: Y1 } } } const P = parts.cassette, s = slots.cassette, r = s.rect; if (!P?.btns || !s.root) return {}; s.root.updateMatrixWorld(true); const out = {}
    P.btns.forEach((b, i) => { b.getWorldPosition(_p); const c = _p.clone().project(s.cam), e = new THREE.Box3().setFromObject(b), ex = e.max.clone().project(s.cam), en = e.min.clone().project(s.cam)
      out[['play', 'next', 'mute'][i]] = { x: r.x + (c.x + 1) / 2 * r.w, y: r.y + (1 - c.y) / 2 * r.h, r: Math.max(12, Math.abs(ex.x - en.x) / 4 * r.w) } })
    return out }

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
      if (d < rad * 0.18 || b.t > 2.5) { SH.overlay.remove(b.m); balls.splice(k, 1); S.landed++; SH.squash(ORB(b.i), 9); SH.pressFx(ORB(b.i)); /* Kontakt: Kugel kurz groß und gestaucht (Georg 24.10.) */ if (b.last) buildOrb(b.i, S.counts[b.i]) } }
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
      stepArrow(dt); flyBalls(dt); stepSpeed(dt); stepAlt(dt); stepChest(dt)
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
    // Paket 2
    // Gesamt-Fluff-Zähler (Georg 24.10.) steht links vor den Kugeln; beide zusammen mittig: Kugeln um die halbe Zählerbreite (Bezugs-px) nach rechts
    setOrbShift: (dxRef) => { for (let i = 0; i < 6; i++) { const l = slots[ORB(i)].L; l.dx = l.dx0 + dxRef } },
    inFlight: () => balls.length,
    setMusic: (m) => { const pl = m.playing !== false, mu = !!m.muted; if (pl !== S.music.playing || mu !== S.music.muted) { S.music = { playing: pl, muted: mu }; if (!CASNEW) buildCassette() } },
    cassetteKind: () => (CASNEW ? 'new' : 'old'),
    // setSpeed({ visible, kmh, speed (m/s), zones [[Zone, Obergrenze m/s]], boost, fly }) – ohne Zonen: frac (0…1) auf die Fahrzonen-Vorgabe
    // setAlt({ visible, m }) – Höhe über Grund in J17-Metern (Telemetrie), nur im Flug sichtbar
    setAlt: (o) => { ALTS.visible = !!o?.visible && o?.m != null; ALTS.m = o?.m ?? 0; if (parts.alt) ALTS.target = parts.alt.fracOf(ALTS.m) },
    altState: () => ({ visible: ALTS.visible, m: Math.round(ALTS.m), shown: +ALTS.shown.toFixed(3), target: +ALTS.target.toFixed(3) }),
    setSpeed: (o) => { SPD.visible = !!o?.visible; SPD.boost = !!o?.boost; SPD.kmh = o?.kmh ?? 0; SPD.fly = !!o?.fly; SPD.stall = !!o?.stall
      if (o?.zones?.length) { SPD.zones = o.zones; SPD.target = Math.max(0, Math.min(1, (o.speed ?? 0) / o.zones[o.zones.length - 1][1])) } else SPD.target = Math.max(0, Math.min(1, o?.frac ?? 0)) },
    speedState: () => ({ visible: SPD.visible, shown: +SPD.shown.toFixed(3), target: +SPD.target.toFixed(3), boost: SPD.boost, glow: +SPD.glow.toFixed(2), kmh: Math.round(SPD.kmh), fly: SPD.fly, stall: !!SPD.stall, over: +(parts.column?.over() || 0).toFixed(3), zone: parts.column?.zoneAt(SPD.shown) || null, zones: parts.column?.zones().map((z) => [z.z, +z.t1.toFixed(3)]) || null }),
    setWeapon: (fam) => { S.weapon = fam; for (let i = 0; i < ACTIONS.length; i++) SH.setUiFlag('act' + i, 'on', ACTIONS[i].id === fam) },
    pulse: (key) => { SH.setUiFlag(key, 'pressed', true); setTimeout(() => SH.setUiFlag(key, 'pressed', false), 120) },
    tapGear: () => { const s = slots.gear; if (s.root) SH.playOnce(s, 'gear_tap_spin') },
    setAlmanacCount: (n) => { n = Math.max(0, Math.min(7, n | 0)); if (n === S.almanacN) return; S.almanacN = n; const s = slots.fanShadow; Object.assign(s.L, fanShadowRect(n || 1)); s.L.hidden = n === 0; s.dirty = true },
    cassetteButtons, layout: () => L, setHint: SH.setHint, fxState: SH.fxState,
    setChestOpen: (v) => { const s = slots.chest; if (!!v === S.chestOpen || !s.root) return; S.chestOpen = !!v; LID.target = v ? LID.OPEN : 0; LID.bounced = false; SH.squash('chest', v ? 6 : 4) },
    lidState: () => ({ angle: +(LID.a / DEG).toFixed(1), target: +(LID.target / DEG).toFixed(1), moving: LID.moving }),
    event: (e) => SH.kick(e.type, e),
    phase: () => S.status, opened: () => ({ compass: false, chest: S.chestOpen }),
    uiStates: SH.uiStates, setUiFlag: SH.setUiFlag, uiState: SH.uiState, onUiState: SH.onUiState, setAnimator: SH.setAnimator,
    rects: SH.rects, view: () => ({ ...SH.view }),
    status: () => ({ status: S.status, error: S.error, loaded: S.loaded, ...SH.perf(), updMsAvg: S.updates ? +(S.updMs / S.updates).toFixed(4) : 0, counts: S.counts.slice(), shown: S.shown.slice(),
      flights: S.flights, landed: S.landed, chestOpen: S.chestOpen, target: S.target, arrow: { b: +AR.b.toFixed(2), p: +AR.p.toFixed(2), color: AR.col, renders: S.arrowRenders, visible: !slots.arrow.L.hidden },
      ui: SH.uiAll(), live: SH.live(), motion: SH.motion() }),
    resetStats: () => { SH.resetStats(); S.updMs = 0; S.updates = 0; S.arrowRenders = 0 },
    dispose() {
      parts.column?.dispose(); parts.alt?.dispose()
      alive = false; for (const b of balls) SH.overlay.remove(b.m); balls.length = 0
      SH.dispose(new Set(Object.values(MAT).flat())); Object.values(MAT).flat().forEach((m) => m.dispose()); ballMats.forEach((m) => m.dispose()); ballGeo.dispose(); sphereGeo.dispose()
      if (parts.digits) Object.values(parts.digits).forEach((d) => d.geo.dispose()); root.clear()
    },
  }
}
