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
