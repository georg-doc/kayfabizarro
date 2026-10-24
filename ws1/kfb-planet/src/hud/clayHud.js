// Diegetisches Knet-HUD R1 (V-656, V-653, V-652; Props WSB N29, Karte 50_BLENDER/N29/data/kfb_hud_props.r1.json) · Modul nach Host-Vertrag R1.2.
// Sechs Props aus einem Knet-Guss: Kompass (zu = Tacho mit Halbkreis und Zahl, auf = Minimap), Radio (4 Tasten, Laufschrift), Truhe (Einflug), Zahnrad
// (Settings), Fluff-Score in 3D-Bangers, Kartenfächer mit Kontaktschatten. Farben: COLOR_0 je Ecke als Maske (R base, G accent, B detail), die drei
// Zonenfarben kommen zur Laufzeit aus der Insel-Palette (hudPalette.js) und blenden beim Wechsel weich über.
// Leistung (Ziel < 1 ms je Bild): jeder Prop lebt in einer eigenen Mini-Szene und wird in ein eigenes Render-Ziel gecacht. Neu gezeichnet wird nur, was
// sich ändert (Zahl, Taste, Aufklappen, Einflug, Palette); sonst zeichnet der Overlay-Pass je Prop nur ein Rechteck mit der gecachten Ansicht.
// Reaktionen auf Kurve, Bremsen und Landung (gefiltert, Feder) bewegen nur diese Rechtecke (2D), nie die 3D-Ansicht.
// Kein DOM, keine Listener: Trefferflächen, Settings-Tafel und Rucksack-Ansicht baut der Wirt (HudClay.jsx). Zeichnen über draw(gl) im Overlay-Pass
// (hudPass.js sichert und stellt den Renderer-Zustand wieder her). Ohne src/private: status MISSING, der Wirt fällt auf das Holz-HUD zurück.
// options: { palette: () => Palette|Zonen, speed: () => km/h, heading: () => rad (0 = +Z), mapPos: () => {x,z}, mapSample: (x,z) => Farbe|null,
//            mapMarks: () => [{x,z,kind}], path: [[x,z]…], nowPlaying: () => {title}|null, audioOn: () => bool, reducedMotion }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clayFrom } from '../modules/clayLook.js'
import { hudZones } from './hudPalette.js'
import { createHudShell, zoneMaterial, textCanvas, clamp, DEG } from './hudShell.js'

const GLB = import.meta.glob(['../private/50_BLENDER/N29/out/KFB_HUD_Compass.glb', '../private/50_BLENDER/N29/out/KFB_HUD_Radio.glb', '../private/50_BLENDER/N29/out/KFB_HUD_Chest.glb',
  '../private/50_BLENDER/N29/out/KFB_HUD_Gear.glb', '../private/50_BLENDER/N29/out/KFB_HUD_FluffDigits.glb', '../private/50_BLENDER/N29/out/KFB_HUD_CardFanShadow.glb'], { query: '?url', import: 'default', eager: true })
const urlOf = (name) => Object.entries(GLB).find(([p]) => p.endsWith('/KFB_HUD_' + name + '.glb'))?.[1] || null
export const HUD_PROPS = ['Compass', 'Radio', 'Chest', 'Gear', 'FluffDigits', 'CardFanShadow']
export const hasClayHudAssets = () => HUD_PROPS.every((n) => !!urlOf(n))

// Tafel in Bezugs-Pixeln (1920 × 1080, auf das Fenster skaliert wie R5f): Ecke, Größe, Kamera (Höhenwinkel°, Gier°, Rand)
export const LAYOUT = {
  pad: 22,
  radio: { corner: 'tl', w: 236, h: 196, el: 16, yaw: -14, fit: 1.04 },
  score: { corner: 'bl', w: 260, h: 128, dx: 200, dy: 14, el: 8, yaw: 0, fit: 1.0, align: 'left' }, // R2 (Lead/Kritiker C11): nicht über Plakat/Bühne, sondern neben der Truhe, in die der Fluff fliegt
  gear: { corner: 'tr', w: 92, h: 92, el: 24, yaw: 0, fit: 1.08 },
  compass: { corner: 'tr', w: 206, h: 186, dx: 100, el: 58, yaw: 0, fit: 1.0, open: { w: 340, h: 340, el: 74 } },
  chest: { corner: 'bl', w: 196, h: 176, el: 20, yaw: 16, fit: 1.04 },
  fan: { corner: 'br', w: 262, h: 172, dx: 56, el: 14, yaw: 0, fit: 1.0 },
}
const REF = { W: 1920, H: 1080 }

export function createClayHud(opts = {}) {
  const O = { palette: () => null, speed: () => 0, heading: () => 0, mapPos: () => null, mapSample: null, mapMarks: () => [], path: [], nowPlaying: () => null, audioOn: () => true, reducedMotion: false, ...opts }
  const root = new THREE.Group(); root.name = 'clay-hud' // HUD lebt im Overlay-Pass, nicht in der Welt
  const S = { status: hasClayHudAssets() ? 'LOADING' : 'MISSING', error: null, loaded: 0, rtRenders: 0, draws: 0, drawMs: 0, drawMsMax: 0, ring: new Float32Array(240), ri: 0, updMs: 0, updates: 0, tris: 0, palette: null, compassOpen: false, chestOpen: false, score: 0, flights: 0, landed: 0, speedShown: -1, ticker: '' }
  const Z = { base: { value: new THREE.Color() }, accent: { value: new THREE.Color() }, detail: { value: new THREE.Color() } }
  const Zt = { base: new THREE.Color(), accent: new THREE.Color(), detail: new THREE.Color() }, Z0 = { base: new THREE.Color(), accent: new THREE.Color(), detail: new THREE.Color() }
  let blend = 1, zKey = ''
  const MAT = zoneMaterial(Z), MAT_A = zoneMaterial(Z, { alpha: true })
  const GAIN = { radio: 1.0, score: 0.6, gear: 0.4, compass: 0.8, chest: 1.1, fan: 0.9 }
  const _ink = new THREE.Color()
  const SH = createHudShell({ ref: REF, pad: LAYOUT.pad, gain: GAIN, reducedMotion: () => (typeof O.reducedMotion === 'function' ? O.reducedMotion() : !!O.reducedMotion), ink: () => _ink.copy(Z.detail.value).multiplyScalar(0.35), ol: [2, 2] })
  for (const k of ['fan', 'chest', 'radio', 'score', 'compass', 'gear']) SH.addSlot(k, LAYOUT[k])
  const { slots, ORDER, overlay, view, fitCamera, sphereOf, clipsOf, playOnce } = SH
  const parts = {} // Knoten je Prop (Anker, Tasten …)
  const balls = [] // Einflug (Overlay, Bildschirm-Pixel)
  const ballGeo = new THREE.SphereGeometry(1, 20, 14), ballMats = new Map()
  const tmpV = new THREE.Vector3(), tmpB = new THREE.Box3()
  let alive = true

  // ── Laden ───────────────────────────────────────────────────────────────────────────────────────────────────────────
  const loader = new GLTFLoader()
  const zoneAll = (o, mat = MAT) => { o.traverse((n) => { if (n.isMesh) { n.material = mat; n.frustumCulled = false } }); SH.countTris(o) }

  const loaders = {
    Compass(g) { const s = slots.compass, o = g.scene; zoneAll(o); s.scene.add(o); s.root = o; Object.assign(s, clipsOf(g, o))
      const lid = o.getObjectByName('compass_lid'), st = o.getObjectByName('KFB_SpeedText'), mp = o.getObjectByName('KFB_MapPlane')
      // Tempo-Zahl: flach auf dem Deckel (Anker zeigt nach oben), Schrift oben = hinten
      const sp = textCanvas(256, 128), spm = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.145), /* R2: größer als das Anker-Maß 0,16 × 0,08 (lesbar bei Fahrt), passt noch in den Halbkreis */ new THREE.MeshBasicMaterial({ map: sp.t, transparent: true, depthWrite: false, toneMapped: true }))
      spm.rotation.x = -Math.PI / 2; spm.position.y = 0.004; st?.add(spm)
      // Minimap: Kreisscheibe auf der Kit-Scheibe (r 0,205), darunter liegt sie im geschlossenen Zustand verdeckt
      const mc = textCanvas(256, 256), mm = new THREE.Mesh(new THREE.CircleGeometry(0.192, 48), new THREE.MeshBasicMaterial({ map: mc.t, toneMapped: true }))
      mm.rotation.x = -Math.PI / 2; mm.position.y = 0.006; mp?.add(mm); mm.visible = false
      parts.compass = { lid, sp, spm, mc, mm }
      const B = sphereOf(o); s.fitClosed = B; const bo = B.box.clone(); bo.max.z += 0.42; bo.min.y = 0; s.fitOpen = { c: new THREE.Vector3(B.c.x, 0.1, B.c.z + 0.12), r: B.r * 1.18, box: bo } // offen: Deckel liegt vorn
      setCompassPose(false, true) },
    Radio(g) { const s = slots.radio, o = g.scene; zoneAll(o); s.scene.add(o); s.root = o; Object.assign(s, clipsOf(g, o))
      const tk = o.getObjectByName('KFB_Ticker'), sz = tk?.userData?.kfb?.size_u || [0.744, 0.096]
      const tc = textCanvas(1024, 128); tc.t.wrapS = THREE.RepeatWrapping
      const tm = new THREE.Mesh(new THREE.PlaneGeometry(sz[0] * 0.96, sz[1] * 0.86), new THREE.MeshBasicMaterial({ map: tc.t, transparent: true, depthWrite: false, toneMapped: true }))
      tm.position.z = 0.006; tk?.add(tm); parts.radio = { tc, tm, btn: Object.fromEntries(['prev', 'play', 'next', 'mute'].map((n) => [n, o.getObjectByName('KFB_Btn_' + n)])), icons: { play: o.getObjectByName('KFB_BtnIcon_play'), pause: o.getObjectByName('KFB_BtnIcon_pause') } }
      const B = sphereOf(o); fitCamera(s, s.L.el, s.L.yaw, s.L.fit, B.c, B.r, B.box); drawTicker(true) },
    Chest(g) { const s = slots.chest, o = g.scene; zoneAll(o); s.scene.add(o); s.root = o; Object.assign(s, clipsOf(g, o))
      parts.chest = { mouth: o.getObjectByName('KFB_Mouth') }
      const B = sphereOf(o); B.box.max.y += 0.25; fitCamera(s, s.L.el, s.L.yaw, s.L.fit, B.c, B.r * 1.05, B.box) }, // Platz über der Truhe für den offenen Deckel
    Gear(g) { const s = slots.gear, o = g.scene; zoneAll(o); s.scene.add(o); s.root = o; Object.assign(s, clipsOf(g, o))
      const B = sphereOf(o); fitCamera(s, s.L.el, s.L.yaw, s.L.fit, B.c, B.r, B.box) },
    FluffDigits(g) { const s = slots.score, o = g.scene; o.updateMatrixWorld(true)
      const adv = o.getObjectByName('KFB_HUD_FluffDigits')?.userData?.kfb?.advance_u || {}
      const dig = {}; for (let i = 0; i < 10; i++) { const n = o.getObjectByName('KFB_Digit_' + i); if (n) { n.material = MAT; dig[i] = { geo: n.geometry, q: n.quaternion.clone(), adv: adv[i] ?? 0.34 } } }
      const row = new THREE.Group(); s.scene.add(row); s.root = row; parts.score = { dig, row, adv }
      setScore(S.score, true) },
    CardFanShadow(g) { const s = slots.fan, o = g.scene; zoneAll(o, MAT_A); s.scene.add(o); s.root = new THREE.Group(); s.scene.add(s.root)
      parts.fan = { shadow: o, cards: [] }; layoutFan() },
  }
  async function load() {
    if (S.status === 'MISSING') return
    try {
      const all = await Promise.all(HUD_PROPS.map((n) => loader.loadAsync(urlOf(n)).then((g) => [n, g])))
      if (!alive) return
      for (const [n, g] of all) { loaders[n](g); S.loaded++ }
      for (const k of ORDER) slots[k].dirty = true
      S.status = 'OK'
    } catch (e) { S.status = 'ERROR'; S.error = String(e?.message || e) }
  }
  load()

  // ── Zustände ─────────────────────────────────────────────────────────────────────────────────────────────────────────
  function setCompassPose(open, instant = false) {
    const s = slots.compass; if (!s.root) return; S.compassOpen = open
    playOnce(s, open ? 'compass_open' : 'compass_close', { at: instant ? 'end' : null })
    parts.compass.mm.visible = true // unter dem Deckel: verdeckt, beim Aufklappen sofort lesbar
    s.openT = open ? 1 : 0; if (instant) { s.openK = s.openT; const F = open ? s.fitOpen : s.fitClosed; fitCamera(s, open ? s.L.open.el : s.L.el, 0, s.L.fit, F.c, F.r, F.box) }
    s.live = Math.max(s.live, 0.45); if (open) drawMap(true)
  }
  function setScore(n, force = false) {
    n = Math.max(0, Math.floor(n)); if (!force && n === S.score && parts.score?.row.children.length) return; S.score = n
    const P = parts.score; if (!P) return; const s = slots.score
    P.row.clear(); const str = String(n); let x = 0; const items = []
    for (const ch of str) { const d = P.dig[ch]; if (!d) continue; const m = new THREE.Mesh(d.geo, MAT); m.quaternion.copy(d.q); m.position.x = x; items.push(m); P.row.add(m); x += d.adv }
    const w = x; if (s.L.align !== 'left') for (const m of items) m.position.x -= w / 2
    const B = sphereOf(P.row); const r = Math.max(B.r, 0.3); const bx = B.box.clone(); const half = Math.max(s.L.align === 'left' ? 0.62 : 0.9, (bx.max.x - bx.min.x) / 2); if (s.L.align === 'left') bx.max.x = Math.max(bx.max.x, bx.min.x + 2 * half); else { bx.min.x = Math.min(bx.min.x, B.c.x - half); bx.max.x = Math.max(bx.max.x, B.c.x + half) } fitCamera(s, s.L.el, s.L.yaw, s.L.fit, B.c, r, bx) // Mindestbreite: eine Ziffer wird nicht riesig
    s.dirty = true; s.sp.vs -= 2.2 // kleiner Hüpfer bei jeder Änderung
  }
  function drawTicker(force = false) {
    const P = parts.radio; if (!P) return
    const np = O.nowPlaying?.(), on = O.audioOn?.() !== false, text = !on ? 'Ton aus' : np?.title ? '♪ ' + np.title.replace(/[_-]+/g, ' ') + '   ' : 'Radio KFB   '
    if (!force && text === S.ticker) return; S.ticker = text
    const { c, g, t } = P.tc; g.clearRect(0, 0, c.width, c.height)
    g.font = '600 76px Fredoka, "Shantell Sans", system-ui, sans-serif'; g.textBaseline = 'middle'; g.fillStyle = '#fff6df'
    const tw = Math.max(1, g.measureText(text).width); P.scroll = tw > c.width * 0.9 && on && !!np
    if (P.scroll) { const reps = Math.ceil(c.width / tw) + 1; for (let i = 0; i < reps; i++) g.fillText(text, i * tw, c.height / 2 + 4); P.period = tw / c.width } else { g.textAlign = 'center'; g.fillText(text.trim(), c.width / 2, c.height / 2 + 4); g.textAlign = 'left'; t.offset.x = 0 }
    t.needsUpdate = true; slots.radio.dirty = true
    if (P.icons.play && P.icons.pause) { /* ▶‖ bleibt als Doppelzeichen (Kit), nichts zu tun */ }
  }
  function drawSpeed(v) {
    const P = parts.compass; if (!P) return; const n = Math.round(clamp(v, 0, 999)); if (n === S.speedShown) return; S.speedShown = n
    const { c, g, t } = P.sp; g.clearRect(0, 0, c.width, c.height)
    g.font = '104px Bangers, "Shantell Sans", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'
    g.lineWidth = 10; g.strokeStyle = 'rgba(31,26,20,.85)'; g.strokeText(String(n), c.width / 2, c.height / 2 + 6)
    g.fillStyle = '#fff6df'; g.fillText(String(n), c.width / 2, c.height / 2 + 6); t.needsUpdate = true; slots.compass.dirty = true
  }
  // Minimap: Norden oben, Gelände aus mapSample (64 × 64 je Kachel, neu bei > ¼ Radius Versatz), Weg, Marken, Pfeil in Fahrtrichtung
  const MAPR = 140, MAP = { cx: NaN, cz: NaN, base: null }
  function drawMap(force = false) {
    const P = parts.compass; if (!P) return; const p = O.mapPos?.(); if (!p) return
    const { c, g, t } = P.mc, N = c.width
    if (force || !MAP.base || Math.hypot(p.x - MAP.cx, p.z - MAP.cz) > MAPR / 4) {
      MAP.cx = p.x; MAP.cz = p.z; const n = 64, b = MAP.base || (MAP.base = document.createElement('canvas')); b.width = b.height = n; const bg = b.getContext('2d'), img = bg.createImageData(n, n)
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const x = p.x + ((i + 0.5) / n * 2 - 1) * MAPR, z = p.z + ((j + 0.5) / n * 2 - 1) * MAPR, col = O.mapSample?.(x, z) || '#cdbb92'; const k = (j * n + i) * 4; const cc = tmpCol.set(col); img.data[k] = cc.r * 255; img.data[k + 1] = cc.g * 255; img.data[k + 2] = cc.b * 255; img.data[k + 3] = 255 }
      bg.putImageData(img, 0, 0)
    }
    const toPx = (x, z) => [((x - MAP.cx) / MAPR * 0.5 + 0.5) * N, ((z - MAP.cz) / MAPR * 0.5 + 0.5) * N]
    g.save(); g.imageSmoothingEnabled = true; g.drawImage(MAP.base, 0, 0, N, N)
    if (O.path?.length > 1) { g.lineWidth = 7; g.lineCap = g.lineJoin = 'round'; g.strokeStyle = 'rgba(70,46,30,.55)'; g.beginPath(); O.path.forEach(([x, z], i) => { const [u, v] = toPx(x, z); i ? g.lineTo(u, v) : g.moveTo(u, v) }); g.stroke(); g.lineWidth = 3.5; g.strokeStyle = '#f6e3b8'; g.stroke() }
    for (const m of O.mapMarks?.() || []) { const [u, v] = toPx(m.x, m.z); if (u < -8 || v < -8 || u > N + 8 || v > N + 8) continue; g.fillStyle = m.color || '#c9508f'; g.strokeStyle = '#1f1a14'; g.lineWidth = 2.5; g.beginPath(); g.arc(u, v, m.r || 7, 0, Math.PI * 2); g.fill(); g.stroke() }
    const [u, v] = toPx(p.x, p.z), h = O.heading?.() || 0; g.translate(u, v); g.rotate(-h + Math.PI); g.fillStyle = '#fff6df'; g.strokeStyle = '#1f1a14'; g.lineWidth = 3
    g.beginPath(); g.moveTo(0, -15); g.lineTo(10, 11); g.lineTo(0, 5); g.lineTo(-10, 11); g.closePath(); g.fill(); g.stroke(); g.restore()
    // Rand weich abdunkeln (Knet-Rand liegt darüber)
    const gr = g.createRadialGradient(N / 2, N / 2, N * 0.36, N / 2, N / 2, N * 0.5); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(40,24,12,.35)'); g.fillStyle = gr; g.fillRect(0, 0, N, N)
    t.needsUpdate = true; slots.compass.dirty = true
  }
  const tmpCol = new THREE.Color()
  function layoutFan() {
    const P = parts.fan; if (!P) return; const s = slots.fan; s.root.clear()
    const cards = P.cards.length ? P.cards : [null, null, null], n = cards.length, AR = 1.79
    cards.forEach((cv, i) => {
      const t = (i - (n - 1) / 2), w = 1.25, h = w / AR // Karte quer (Viertelseite 1,79 : 1)
      let mat
      if (cv) { const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: true }) } else mat = new THREE.MeshBasicMaterial({ color: '#fbf3e2', toneMapped: true })
      const card = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), [MAT, MAT, MAT, MAT, mat, MAT]) // Rand = Knete (dünne Pappe), Vorderseite = Karte as-is (nie umgefärbt)
      card.geometry.translate(0, h * 0.5 - 0.06, 0); card.rotation.z = -t * 0.2; card.position.set(t * 0.5, 0.05 - Math.abs(t) * 0.05, 0.08 + i * 0.025); card.rotation.x = -0.1
      s.root.add(card)
    })
    s.root.position.set(0, 0.0, -0.05); s.root.rotation.x = -0.05 // Fächer steht aufrecht in der Hand-Haltung, der Schatten liegt darunter am Boden
    const B = sphereOf(s.scene); fitCamera(s, s.L.el, s.L.yaw, s.L.fit, B.c, B.r, B.box); s.dirty = true
  }

  // ── Einflug in die Truhe (Overlay) ───────────────────────────────────────────────────────────────────────────────────
  const FLUFF_COL = ['#3e6a83', '#7a8d4a', '#e9c14a', '#d97c3a', '#6b4e7d', '#a64670'] // satte Story-Mode-Farben (V-292, V-305 High-Fluff) in KIND_INDEX-Reihenfolge: tragic comic absurd heroic mystical forbidden
  function ballMat(col) { if (!ballMats.has(col)) ballMats.set(col, clayFrom(new THREE.MeshStandardMaterial({ color: col }), 'house')); return ballMats.get(col) }
  function launch(kind = 0, n = 1, from = null) {
    const s = slots.chest; if (!s.root) return
    if (!S.chestOpen && !S.chestFly) { playOnce(s, 'chest_open'); S.chestFly = true }
    s.closeAt = null
    const cnt = Math.min(6, Math.max(1, n))
    for (let i = 0; i < cnt; i++) {
      const m = new THREE.Mesh(ballGeo, ballMat(typeof kind === 'string' ? kind : FLUFF_COL[kind % 6])); m.renderOrder = 50; overlay.add(m)
      const f = from || { x: view.W * (0.5 + (Math.random() - 0.5) * 0.06), y: view.H * 0.56 }
      balls.push({ m, t: -i * 0.07, T: 0.62 + Math.random() * 0.1, from: { ...f }, add: i === cnt - 1 ? n : 0 }); S.flights++
    }
  }
  function flyBalls(dt) {
    if (!balls.length) return
    const r = slots.chest.rect, to = { x: r.x + r.w * 0.5, y: r.y + r.h * 0.34 }
    for (let i = balls.length - 1; i >= 0; i--) { const b = balls[i]; b.t += dt; const u = clamp(b.t / b.T, 0, 1), e = u * u * (3 - 2 * u)
      const x = b.from.x + (to.x - b.from.x) * e, yTop = b.from.y + (to.y - b.from.y) * e - Math.sin(Math.PI * e) * view.H * 0.16
      const rr = (14 - 6 * e) * view.k; b.m.visible = b.t > 0; b.m.position.set(x, view.H - yTop, 100); b.m.scale.setScalar(rr)
      if (u >= 1) { overlay.remove(b.m); balls.splice(i, 1); S.landed++; slots.chest.sp.vs += 4; slots.chest.sp.vy -= 40
        if (slots.chest.clips?.chest_bounce && !S.chestOpen) playOnce(slots.chest, 'chest_bounce')
        if (b.add) setScore(S.pending ?? S.score) } }
    if (!balls.length && S.chestFly && !S.chestOpen && slots.chest.closeAt == null) slots.chest.closeAt = 0.35
  }

  // ── Palette ──────────────────────────────────────────────────────────────────────────────────────────────────────────
  function syncPalette(dt) {
    const z = hudZones(O.palette?.()), key = z.base + z.accent + z.detail
    if (key !== zKey) { const first = !zKey; zKey = key; S.palette = z
      for (const n of ['base', 'accent', 'detail']) { Z0[n].copy(Z[n].value); Zt[n].set(z[n]) }
      blend = first ? 1 : 0; if (first) for (const n of ['base', 'accent', 'detail']) Z[n].value.copy(Zt[n]) }
    if (blend < 1) { blend = Math.min(1, blend + dt / 1.2); const e = blend * blend * (3 - 2 * blend); for (const n of ['base', 'accent', 'detail']) Z[n].value.copy(Z0[n]).lerp(Zt[n], e); for (const k of ORDER) slots[k].dirty = true }
  }

  return {
    object3d: root,
    update(dt = 1 / 60, sig = null) {
      if (!alive) return
      const u0 = performance.now()
      SH.signal(sig)
      syncPalette(dt)
      if (S.status !== 'OK') return
      // Kompass: Rechteck wächst mit, Kamera schwenkt in die Draufsicht
      const c = slots.compass; if (c.root && c.openK !== c.openT) { c.openK = clamp((c.openK ?? 0) + Math.sign(c.openT - c.openK) * dt / 0.3, 0, 1); const o = c.openK * c.openK * (3 - 2 * c.openK)
        const A = c.fitClosed, B = c.fitOpen; tmpB.min.lerpVectors(A.box.min, B.box.min, o); tmpB.max.lerpVectors(A.box.max, B.box.max, o); fitCamera(c, c.L.el + (c.L.open.el - c.L.el) * o, 0, c.L.fit, tmpV.copy(A.c).lerp(B.c, o), A.r + (B.r - A.r) * o, tmpB); c.live = Math.max(c.live, 0.05) }
      if (!S.compassOpen) { S.spdT = (S.spdT || 0) + dt; if (S.spdT > 0.1) { S.spdT = 0; drawSpeed(O.speed?.() || 0) } }
      else { S.mapT = (S.mapT || 0) + dt; if (S.mapT > 1 / 12) { S.mapT = 0; drawMap() } }
      // Laufschrift: Titel prüfen (2 Hz), rollen mit 15 Hz (nur solange Musik läuft und der Text länger ist als das Fenster)
      S.tkT = (S.tkT || 0) + dt; if (S.tkT > 0.5) { S.tkT = 0; drawTicker() }
      const R = parts.radio; if (R?.scroll) { S.scT = (S.scT || 0) + dt; if (S.scT > 1 / 15) { R.tc.t.offset.x = (R.tc.t.offset.x + S.scT * 0.09) % (R.period || 1); S.scT = 0; slots.radio.dirty = true } }
      const ch = slots.chest; if (ch.closeAt != null) { ch.closeAt -= dt; if (ch.closeAt <= 0) { ch.closeAt = null; S.chestFly = false; if (!S.chestOpen) playOnce(ch, 'chest_close') } }
      flyBalls(dt)
      SH.step(dt, (key) => (key.startsWith('radio.') ? parts.radio?.btn?.[key.split('.')[1]] || null : null))
      S.updMs += performance.now() - u0; S.updates++
    },
    // Overlay-Pass (hudPass.js): gecachte Ansichten nachziehen, dann die Rechtecke über das fertige Bild legen
    draw(gl) { if (alive && S.status === 'OK') SH.draw(gl) },
    // Wirt-API
    setScore: (n) => { S.pending = n; if (!balls.length) setScore(n) },
    land: (kind, n = 1, from = null) => launch(kind, n, from),
    toggleCompass: (v = !S.compassOpen) => { setCompassPose(!!v); return S.compassOpen },
    setChestOpen: (v) => { const s = slots.chest; if (!!v === S.chestOpen) return; S.chestOpen = !!v; playOnce(s, v ? 'chest_open' : 'chest_close') },
    press: (name) => { const s = slots.radio; playOnce(s, 'radio_btn_' + name + '_press'); setTimeout(() => drawTicker(true), 60) },
    tapGear: () => playOnce(slots.gear, 'gear_tap_spin'),
    setCards: (canvases) => { if (!parts.fan) return; parts.fan.cards = (canvases || []).filter(Boolean).slice(0, 5); layoutFan() },
    event: (e) => SH.kick(e.type, e),
    phase: () => S.status, opened: () => ({ compass: S.compassOpen, chest: S.chestOpen }), // billig je Bild (status() rechnet p95)
    uiStates: SH.uiStates,
    setUiFlag: SH.setUiFlag, // (ziel, 'hover'|'pressed'|'focus'|'on', bool) → Zustand
    uiState: SH.uiState, onUiState: SH.onUiState, setAnimator: SH.setAnimator,
    rects: SH.rects, // Trefferflächen (CSS-Pixel, ohne Federweg)
    // Radio-Tasten als Bildschirm-Kreise (Mitte der Knet-Taste durch die Radio-Kamera projiziert), für die Trefferflächen des Wirts
    radioButtons: () => { const P = parts.radio, s = slots.radio, r = s.rect; if (!P) return {}; s.root.updateMatrixWorld(true); const out = {}
      for (const [n, b] of Object.entries(P.btn)) { if (!b) continue; b.getWorldPosition(tmpV); const c = tmpV.clone().project(s.cam), e = tmpV.add(new THREE.Vector3(0.075, 0, 0)).project(s.cam)
        out[n] = { x: r.x + (c.x + 1) / 2 * r.w, y: r.y + (1 - c.y) / 2 * r.h, r: Math.max(10, Math.abs(e.x - c.x) / 2 * r.w * 1.25) } }
      return out },
    view: () => ({ ...view }),
    refreshTicker: () => drawTicker(true),
    status: () => ({ status: S.status, error: S.error, loaded: S.loaded, ...SH.perf(), updMsAvg: S.updates ? +(S.updMs / S.updates).toFixed(4) : 0,
      palette: S.palette, compassOpen: S.compassOpen, chestOpen: S.chestOpen, score: S.score, flights: S.flights, landed: S.landed, speedShown: S.speedShown, ticker: S.ticker,
      ui: SH.uiAll(), live: SH.live(), motion: SH.motion(), zones: { base: '#' + Z.base.value.getHexString(), accent: '#' + Z.accent.value.getHexString(), detail: '#' + Z.detail.value.getHexString() } }),
    resetStats: () => { SH.resetStats(); S.updMs = 0; S.updates = 0 },
    dispose() {
      alive = false
      SH.dispose(new Set([MAT, MAT_A]))
      for (const b of balls) overlay.remove(b.m); balls.length = 0; ballGeo.dispose(); ballMats.forEach((m) => m.dispose()); MAT.dispose(); MAT_A.dispose(); root.clear()
    },
  }
}
