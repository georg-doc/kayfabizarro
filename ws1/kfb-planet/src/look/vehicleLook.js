// Fahrzeug-Look A „Lack“ (Georg 21.10.) · Werte 1:1 aus der Gelände-Probe (carLookPrep / carLookApply / carDistLift, probe @ws1/preview 677a844).
// Warum: Meshy legt Metall je Racer zwischen 45 und 98 % der Fläche an, die Grundhelligkeit reicht von 0,22 bis 0,46. Ohne Spiegelumgebung wird
// Metall fast schwarz – je mehr Metall, desto dunkler und fremder wirkt das Modell, aus der Ferne nur noch ein schwarzer Fleck.
// A: Metall × 0,35 (helle Blechflächen behalten bis + 0,65 → Dächer gedimmt statt weiß), Rauheit ≥ 0,5, Spiegelung eines Himmel/Boden-Verlaufs,
// Grundhelligkeit auf 0,33 angeglichen (× 0,85 … 1,5); Umgebungslicht wächst mit dem Kameraabstand (0,8 ab 20 m → 1,6 ab 120 m Probe-Maß, × K im Spiel) in der Lackfarbe.
// prepVehicleLook(root, tick) einmal auf das geladene Modell (vor dem Klonen: Klone teilen die Materialien), hookVehicleLook(klon) je Klon. Ohne DOM passiert nichts.
import * as THREE from 'three'
import { K } from '../m1/m1Scale.js'

export const VEHICLE_LOOK = { metal: 0.35, keep: 0.65, keepFrom: 0.42, keepSpan: 0.3, rough: 0.5, lum: 0.33, gainMin: 0.85, gainMax: 1.5, env: 0.8, envFar: 1.6, near: 8, far: 40,   /* Spielabstand (WS1d-Messung 22.10.: Folgekamera 6,8–18,9 m): ab 8 m aufhellen, voll bei 40 m (vorher Probe-Maß 20–120 × K, griff am Spielabstand kaum) */ sky: '#cfe6ef', ground: '#8a7a62' }
const L = VEHICLE_LOOK
let ENV = null

// Himmel/Boden-Verlauf als Spiegelumgebung (wie die Hemisphäre der Probe): oben Himmel, Horizont aufgehellt, unten Boden
function envFor(renderer) {
  if (ENV) return ENV
  const W = 64, H = 32, d = new Uint8Array(W * H * 4), top = new THREE.Color(L.sky), hor = top.clone().lerp(new THREE.Color('#ffffff'), 0.35), bot = new THREE.Color(L.ground)
  for (let y = 0; y < H; y++) {
    const v = 1 - (y + 0.5) / H, c = v > 0.5 ? hor.clone().lerp(top, (v - 0.5) * 2) : bot.clone().lerp(hor, Math.pow(v * 2, 3))
    for (let x = 0; x < W; x++) { const k = (y * W + x) * 4; d[k] = c.r * 255; d[k + 1] = c.g * 255; d[k + 2] = c.b * 255; d[k + 3] = 255 }
  }
  const t = new THREE.DataTexture(d, W, H); t.mapping = THREE.EquirectangularReflectionMapping; t.flipY = true; t.needsUpdate = true
  const pm = new THREE.PMREMGenerator(renderer); ENV = pm.fromEquirectangular(t).texture; t.dispose(); pm.dispose(); return ENV
}

function pixels(img, W, H) { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, W, H); return { c, x, id: x.getImageData(0, 0, W, H) } }
// V-631 Racer-Wechsel ohne Ruckler: die Pixel-Schleifen geben nach `budget` ms die Hand ab (nächster Task), sync = alles am Stück (tick = null)
export function slicer(budget = 6) { let t = performance.now(); return async () => { if (performance.now() - t < budget) return; await new Promise((r) => setTimeout(r, 0)); t = performance.now() } }
const NOTICK = async () => {}

// Materialien umstellen (einmal je Modell, vor dem Klonen); tick = slicer() verteilt die Arbeit über mehrere Tasks
export async function prepVehicleLook(root, tick = NOTICK) {
  if (typeof document === 'undefined' || !root) return { applied: 0 }
  const info = { applied: 0, gain: {} }, mats = new Set()
  root.traverse((m) => { if (m.isMesh) for (const mt of [].concat(m.material)) mats.add(mt) })
  for (const mt of mats) {
    const mp = mt.map, mr = mt.metalnessMap || mt.roughnessMap
    if (!mp?.image || !mr?.image || mt.userData.vehicleLook) continue
    try {
      const sm = pixels(mp.image, 64, 64).id.data; let s = 0, n = 0
      for (let i = 0; i < sm.length; i += 4) { if (sm[i + 3] < 10) continue; s += (sm[i] + sm[i + 1] + sm[i + 2]) / 765; n++ }
      const gain = Math.min(L.gainMax, Math.max(L.gainMin, L.lum / Math.max(0.05, n ? s / n : L.lum)))
      const img = mr.image, W = Math.min(1024, img.width), H = Math.round(img.height * W / img.width); await tick()
      const al = pixels(mp.image, W, H).id.data; await tick()
      const { c, x, id } = pixels(img, W, H), d = id.data; await tick()
      for (let y = 0; y < H; y++) { for (let i = y * W * 4, e = i + W * 4; i < e; i += 4) {
        const lu = (al[i] + al[i + 1] + al[i + 2]) / 765, t = Math.min(1, Math.max(0, (lu - L.keepFrom) / L.keepSpan))
        d[i + 1] = Math.max(d[i + 1], L.rough * 255); d[i + 2] = d[i + 2] * (L.metal + L.keep * t * t * (3 - 2 * t)) } if ((y & 31) === 31) await tick() }
      x.putImageData(id, 0, 0)
      const tex = new THREE.CanvasTexture(c); tex.flipY = mr.flipY; tex.wrapS = mr.wrapS; tex.wrapT = mr.wrapT; tex.channel = mr.channel
      mt.metalnessMap = mt.roughnessMap = tex; mt.color.setScalar(gain); mt.envMapIntensity = L.env; mt.userData.vehicleLook = { gain: +gain.toFixed(3), tex }
      mt.needsUpdate = true; info.gain[mt.name || 'mat' + info.applied] = +gain.toFixed(3); info.applied++
    } catch (e) { console.warn('vehicleLook', e) }
  }
  return info
}
// Spiegelumgebung braucht den Renderer, Abstandslicht die Kamera: beides beim Zeichnen (je Klon, onBeforeRender wird beim Klonen nicht übernommen)
export function hookVehicleLook(root) {
  if (typeof document === 'undefined' || !root) return
  const pos = new THREE.Vector3()
  root.traverse((m) => {
    if (!m.isMesh) return
    const prev = m.onBeforeRender
    m.onBeforeRender = function (renderer, scene, camera, geo, mat, group) {
      for (const mt of [].concat(m.material)) {
        if (!mt.userData.vehicleLook) continue
        if (mt.envMap !== ENV || !ENV) { mt.envMap = envFor(renderer); mt.needsUpdate = true }
        const k = Math.min(1, Math.max(0, (m.getWorldPosition(pos).distanceTo(camera.position) - L.near) / (L.far - L.near)))
        mt.envMapIntensity = L.env + (L.envFar - L.env) * k * k * (3 - 2 * k)
      }
      if (prev) prev.call(this, renderer, scene, camera, geo, mat, group)
    }
  })
}
// wie bisher: einmal am Stück (Materialien + Haken); liefert ein Versprechen, falls jemand wartet
export function applyVehicleLook(root) { const p = prepVehicleLook(root); hookVehicleLook(root); return p }
// Umgebung vorab bauen (sonst baut der erste Zeichenaufruf des Wagens die PMREM-Karte mitten in der Fahrt)
export const warmVehicleEnv = (renderer) => envFor(renderer)

// Heldenfarbe (Georg 21.10., Audit D 8; V-631) · 1:1 aus der Gelände-Probe (heroColor): Der Racer war das unbunteste Objekt im Bild. Der dominante Lackton
// der Textur wird einmal je Modell in KFB-Rot umgefärbt (Helligkeit bleibt, Sättigung mindestens 0,55) – nur auf der Textur, kein Shader-Aufwand.
// Fläche statt Pixel (Georg 21.10.: rote Flecken auf dem Dach des Flossen-Kreuzers): erst die Lackmaske (Farbton nah am Lackton, Sättigung relativ zum
// Lack), dann weichzeichnen – zusammenhängende Lackflächen bleiben voll, einzelne Splitter fallen unter die Schwelle. Lack aus blankem Rost-/Bronzemetall
// (Farbton 15–50°, Sättigung < 0,3, z. B. Panzer-Gleiter) bleibt unverändert. Vor applyVehicleLook und vor dem Klonen aufrufen (Klone teilen die Textur).
export const HERO = { hex: '#d8262e' }
// Georg 22.10.: Standard = Originalfarbe für alle Racer, Heldenfarbe nur als Einstellung (Startseite, gemerkt je Browser). Hash hero=1 / hero=0 überschreibt (Tests).
const HERO_KEY = 'kfb.heroColor'
export function heroEnabled() {
  const h = typeof location !== 'undefined' ? location.hash : ''
  if (/(^|[#,])hero=1(,|$)/.test(h)) return true
  if (/(^|[#,])hero=0(,|$)/.test(h)) return false
  try { return localStorage.getItem(HERO_KEY) === '1' } catch (e) { return false }
}
export function setHeroEnabled(on) {
  try { localStorage.setItem(HERO_KEY, on ? '1' : '0') } catch (e) { /* ohne Speicher gilt die Wahl nur jetzt */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('kfb:hero', { detail: { on: !!on } }))
}
// umgerechnete Heldenfarben-Texturen an- bzw. abschalten (Materialien geteilt: gilt für alle Klone des Modells); liefert die Zahl umgeschalteter Materialien
export function setHeroMaps(root, on) {
  const mats = new Set(); let n = 0
  root?.traverse((m) => { if (m.isMesh) for (const mt of [].concat(m.material)) mats.add(mt) })
  for (const mt of mats) { const h = mt.userData.hero; if (!h?.tex) continue; const want = on ? h.tex : h.orig; if (mt.map !== want) { mt.map = want; n++ } }
  return n
}
const hsv = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), c = mx - mn; let h = 0; if (c > 1e-6) h = mx === r ? ((g - b) / c) % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4; return [(h * 60 + 360) % 360, mx > 0 ? c / mx : 0, mx] }
export async function applyHeroColor(root, { hex = HERO.hex, tick = NOTICK, apply = true } = {}) {
  if (typeof document === 'undefined' || !root) return { applied: 0 }
  const info = { applied: 0, skipped: 0, mats: [] }, mats = new Set(), hh = {}; new THREE.Color(hex).getHSL(hh, THREE.SRGBColorSpace)   // Farbton der Hex-Farbe wie in der Probe (sRGB-Zahlen)
  root.traverse((m) => { if (m.isMesh) for (const mt of [].concat(m.material)) mats.add(mt) })
  for (const mt of mats) {
    const mp = mt.map, img = mp?.image; if (!img?.width || mt.userData.hero) continue
    try {
      const W = Math.min(1024, img.width), H = Math.round(img.height * W / img.width); await tick(); const { c: cv, x: cx, id } = pixels(img, W, H), d = id.data, hist = new Float32Array(36); await tick()
      for (let i = 0; i < d.length; i += 16) { const [h, sa, v] = hsv(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255); if (sa > 0.12 && v > 0.25) hist[Math.floor(h / 10) % 36] += sa }
      let pk = 0; for (let i = 1; i < 36; i++) if (hist[i] > hist[pk]) pk = i; const hc = pk * 10 + 5
      let sp = 0, sn = 0; for (let i = 0; i < d.length; i += 16) { const [h, sa, v] = hsv(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255); if (Math.abs(((h - hc + 540) % 360) - 180) < 20 && v > 0.2) { sp += sa; sn++ } } sp = sn ? sp / sn : 0.4
      if (hc >= 15 && hc <= 50 && sp < 0.3) { mt.userData.hero = { hue: hc, sat: +sp.toFixed(3), skipped: 'metal' }; info.skipped++; info.mats.push(mt.userData.hero); continue }
      const M = new Float32Array(W * H), M2 = new Float32Array(W * H), sMin = Math.max(0.1, sp * 0.45)
      await tick()
      for (let y = 0, q = 0, i = 0; y < H; y++) { for (let e = q + W; q < e; i += 4, q++) { const [h, sa, v] = hsv(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255), dh = Math.abs(((h - hc + 540) % 360) - 180); if (sa < sMin || v < 0.12 || dh > 32) continue; M[q] = 1 - Math.max(0, (dh - 22) / 10) } if ((y & 31) === 31) await tick() }
      const R = Math.max(2, Math.round(W / 256)); for (let y = 0; y < H; y++) { let acc = 0; for (let x = -R; x < W; x++) { if (x + R < W) acc += M[y * W + x + R]; if (x - R - 1 >= 0) acc -= M[y * W + x - R - 1]; if (x >= 0) M2[y * W + x] = acc / (2 * R + 1) } if ((y & 63) === 63) await tick() }
      for (let x = 0; x < W; x++) { let acc = 0; for (let y = -R; y < H; y++) { if (y + R < H) acc += M2[(y + R) * W + x]; if (y - R - 1 >= 0) acc -= M2[(y - R - 1) * W + x]; if (y >= 0) { const b = acc / (2 * R + 1), t = Math.min(1, Math.max(0, (b - 0.35) / 0.35)); M[y * W + x] *= t * t * (3 - 2 * t) } } if ((x & 63) === 63) await tick() }
      const c = new THREE.Color(); let share = 0
      for (let y = 0, q = 0, i = 0; y < H; y++) { for (let e = q + W; q < e; i += 4, q++) { const k = M[q]; if (k <= 0.001) continue; share += k; const [, sa, v] = hsv(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255)
        c.setHSL(hh.h, Math.max(0.55, sa * 1.3), Math.min(0.62, v * 0.62), THREE.SRGBColorSpace); c.convertLinearToSRGB(); d[i] += (c.r * 255 - d[i]) * k; d[i + 1] += (c.g * 255 - d[i + 1]) * k; d[i + 2] += (c.b * 255 - d[i + 2]) * k } if ((y & 31) === 31) await tick() }
      cx.putImageData(id, 0, 0); const t = new THREE.CanvasTexture(cv); t.flipY = mp.flipY; t.colorSpace = mp.colorSpace; t.wrapS = mp.wrapS; t.wrapT = mp.wrapT; t.anisotropy = mp.anisotropy; t.channel = mp.channel
      mt.userData.hero = { hue: hc, sat: +sp.toFixed(3), share: +(share / (W * H)).toFixed(3), orig: mp, tex: t }; if (apply) mt.map = t; info.applied++; info.mats.push({ hue: hc, sat: mt.userData.hero.sat, share: mt.userData.hero.share })
    } catch (e) { console.warn('heroColor', e) }
  }
  return info
}

// ── Knet-Stufe für Racer (V-654 C5 „eine Machart“, CANON_3D Gebiet 8/15) ────────────────────────────────────────────────────────────────────────────
// Foto-Rost und Kit-Farben auf die Rollen der Biom-Palette umtönen: Textur auf höchstens 1024 px (ohne Weichzeichnen: UV-Inseln),
// 5 Farbgruppen (k-means), jede Gruppe auf die nächste Rolle (OKLab, Buntheit leicht betont; Grau nach Helligkeit), Helligkeitsverlauf je Pixel
// gedämpft erhalten (^0,6), 85 % Rolle / 15 % geglättetes Original. Heldenfarbe an: die größte bunte Gruppe wird KFB-Rot. Danach applyClay (M2Car).
export const VCLAY = { roles: ['sand', 'low', 'mid', 'high', 'peak', 'cliff', 'water'], size: 1024, blur: 0, k: 5, mix: 0.85, greySat: 0.35, lShift: 0.15, hueShift: 0.5, bunt: 0.06 }   // blur 0: Meshy-Atlanten bestehen aus winzigen UV-Inseln, Weichzeichnen vermischt Nachbarstücke zu Matsch (Ödland-Käfer 22.10.)
const srgb2lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4), lin2srgb = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055)
function oklab(r, g, b) { r = srgb2lin(r); g = srgb2lin(g); b = srgb2lin(b)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s] }
function oklabToRgb(L, a, b) { const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map((v) => lin2srgb(Math.min(1, Math.max(0, v)))) }
const hexRgb = (h) => { const c = new THREE.Color(h); c.convertLinearToSRGB(); return [c.r, c.g, c.b] }   // THREE.Color ist linear → sRGB-Zahlen wie in der Textur
export async function prepVehicleClay(root, { palette, hero = false, tick = NOTICK } = {}) {
  if (typeof document === 'undefined' || !root || !palette) return { applied: 0 }
  const roles = VCLAY.roles.filter((k) => palette[k]).map((k) => ({ k, rgb: hexRgb(palette[k]) })).map((r) => ({ ...r, lab: oklab(...r.rgb) }))
  const info = { applied: 0, mats: [] }, mats = new Set()
  root.traverse((m) => { if (m.isMesh) for (const mt of [].concat(m.material)) mats.add(mt) })
  for (const mt of mats) {
    const bm = mt.userData.kfbClay?.src || mt   // nach applyClay: Daten am Quell-Material, Textur an beiden
    const src = bm.userData.vclay?.orig || bm.map, img = src?.image; if (!img?.width) continue
    const key = hero ? 'hero' : 'base'; if (bm.userData.vclay?.[key]) { mt.map = bm.map = bm.userData.vclay[key]; info.applied++; continue }
    try {
      const W = Math.min(VCLAY.size, img.width), H = Math.round(img.height * W / img.width), cv = document.createElement('canvas'); cv.width = W; cv.height = H
      const cx = cv.getContext('2d', { willReadFrequently: true }); if (VCLAY.blur) cx.filter = `blur(${VCLAY.blur}px)`; cx.drawImage(img, 0, 0, W, H); cx.filter = 'none'; await tick()
      const id = cx.getImageData(0, 0, W, H), d = id.data, N = W * H
      // k-means auf einer Stichprobe (jedes 23. Pixel), Start über die Helligkeits-Quantile
      const smp = []; for (let q = 0; q < N; q += 23) { const i = q * 4; if (d[i + 3] > 10) smp.push(oklab(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255)) }
      smp.sort((a, b) => a[0] - b[0]); const K = VCLAY.k, C = Array.from({ length: K }, (_, j) => smp[Math.floor((j + 0.5) / K * smp.length)].slice()), cnt = new Float32Array(K)
      for (let it = 0; it < 8; it++) { const acc = C.map(() => [0, 0, 0]); cnt.fill(0)
        for (const p of smp) { let bj = 0, bd = 1e9; for (let j = 0; j < K; j++) { const e = (p[0] - C[j][0]) ** 2 + (p[1] - C[j][1]) ** 2 + (p[2] - C[j][2]) ** 2; if (e < bd) { bd = e; bj = j } } acc[bj][0] += p[0]; acc[bj][1] += p[1]; acc[bj][2] += p[2]; cnt[bj]++ }
        for (let j = 0; j < K; j++) if (cnt[j]) C[j] = acc[j].map((v) => v / cnt[j]) ; await tick() }
      // Gruppe → Rolle (OKLab): bunte Gruppen nach Farbton/Buntheit (a, b), graue nach normierter Helligkeit; jede weitere Belegung derselben Rolle
      // kostet etwas. Umtönen statt Ersetzen: Farbton und Buntheit von der Rolle (grau: Rest greySat), Helligkeit bleibt beim Pixel, die Gruppe rückt
      // um lShift zur Helligkeit der Rolle – die Hell-Dunkel-Struktur des Wagens bleibt, er hebt sich vom Gelände ab. Heldenfarbe: größte bunte Gruppe → KFB-Rot.
      const chroma = (c) => Math.hypot(c[1], c[2]); let paint = -1, pc = 0; for (let j = 0; j < K; j++) if (chroma(C[j]) > VCLAY.bunt && cnt[j] > pc) { pc = cnt[j]; paint = j }
      const span = (arr) => { const lo = Math.min(...arr), hi = Math.max(...arr); return (v) => (hi - lo < 1e-3 ? 0.5 : (v - lo) / (hi - lo)) }
      const nC = span(C.map((c) => c[0])), nR = span(roles.map((r) => r.lab[0])), used = new Map(), heroLab = oklab(...hexRgb(HERO.hex)), T = new Array(K)
      for (const j of [...C.keys()].sort((x, y) => cnt[y] - cnt[x])) { const c = C[j], bunt = chroma(c) > VCLAY.bunt
        let best = roles[0], bd = 1e9; for (const r of roles) { const e = bunt ? (c[1] - r.lab[1]) ** 2 + (c[2] - r.lab[2]) ** 2 + 0.6 * (c[0] - r.lab[0]) ** 2 : (nC(c[0]) - nR(r.lab[0])) ** 2; const ee = e + 0.004 * (used.get(r.k) || 0); if (ee < bd) { bd = ee; best = r } }
        used.set(best.k, (used.get(best.k) || 0) + 1)
        const isHero = hero && j === paint, R = isHero ? heroLab : best.lab, k = isHero || bunt ? 1 : VCLAY.greySat, h = isHero ? 1 : VCLAY.hueShift   // leicht tönen (Gebiet 6): nur ein Teil des Wegs zur Rolle
        T[j] = { dL: (R[0] - c[0]) * VCLAY.lShift, a: c[1] + (R[1] * k - c[1]) * h, b: c[2] + (R[2] * k - c[2]) * h, role: isHero ? 'hero' : best.k } }
      for (let y = 0, q = 0; y < H; y++) { for (let e = q + W; q < e; q++) { const i = q * 4; if (d[i + 3] <= 10) continue
          const p = oklab(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255); let bj = 0, bd = 1e9; for (let j = 0; j < K; j++) { const ee = (p[0] - C[j][0]) ** 2 + (p[1] - C[j][1]) ** 2 + (p[2] - C[j][2]) ** 2; if (ee < bd) { bd = ee; bj = j } }
          const t = T[bj], o = oklabToRgb(p[0] + t.dL, t.a + (p[1] - C[bj][1]) * 0.3, t.b + (p[2] - C[bj][2]) * 0.3)
          for (let c = 0; c < 3; c++) d[i + c] = Math.round(255 * ((d[i + c] / 255) * (1 - VCLAY.mix) + o[c] * VCLAY.mix)) }
        if ((y & 15) === 15) await tick() }
      const target = T
      cx.putImageData(id, 0, 0); const tex = new THREE.CanvasTexture(cv); tex.flipY = src.flipY; tex.colorSpace = src.colorSpace; tex.wrapS = src.wrapS; tex.wrapT = src.wrapT; tex.channel = src.channel; tex.anisotropy = 4
      bm.userData.vclay = { ...(bm.userData.vclay || {}), orig: src, [key]: tex, paint, roles: target.map((t) => t.role) }
      mt.map = bm.map = tex; info.applied++; info.mats.push({ roles: bm.userData.vclay.roles, paint })
    } catch (e) { console.warn('vehicleClay', e) }
  }
  return info
}
