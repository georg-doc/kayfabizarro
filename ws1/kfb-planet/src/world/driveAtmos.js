// V-619 · Atmosphäre der endlosen Fahrt: Tageszeit (0–24 h, Zeitraffer), Wetter (klar, Wolken, Regen, Nebel, Wind; weiche Wechsel 20–60 s),
// Lichtstimmungen (6 benannte Presets je Biom) und Ereignisse (z. B. MIB-Einsatz verdunkelt). ALLES sind Einstellungen des EINEN Licht-Rigs (V-385:
// kfb-stage-light.v1.1, Sonne bzw. Mond, Hemisphäre, Figurenlicht) plus Himmel (sky-drive) und Nebel des Hosts – keine Extra-Lichter, kein Trick.
// Das Rig liest seine Stimmung je Bild aus einem lebenden Stimmungs-Satz (moods-Option des Rigs); dieses Modul schreibt ihn.
// Kurve je Biom: Grundkurve (Morgen, Mittag, Abend, Nacht) mit Farbzug des Bioms (kfb-drive-moods.r1.json); am Wagen werden die Kurven der Biome nach
// ihren Gewichten gemischt (Fahrt durch ein Übergangsband = weicher Lichtwechsel). Sonnen- und Mondbahn aus der Uhr; beim Wechsel Sonne → Mond
// taucht das Hauptlicht kurz ab (Dämmerung), damit Schatten nicht springen. Ohne three-Szene testbar (scene optional).
import * as THREE from 'three'
import CFG from '../data/looks/kfb-drive-moods.r1.json' with { type: 'json' }
import { BIOMES, NB } from './biomeField.js'
import { BIOME_PALETTES } from '../look/biomeTerrain.js'
import { setWind, WIND } from './kfbWind.js'

export const MOODS_CFG = CFG
const COLS = ['sun', 'hemiSky', 'figColor', 'zenith', 'horizon', 'lit', 'shade', 'sunCol']
const NUMS = ['sunI', 'hemiI', 'bounce', 'figI', 'skyL', 'glow', 'stars', 'fogNear', 'fogFar']
const WKEYS = ['cover', 'overcast', 'rain', 'fog', 'wind', 'gust', 'sunK', 'fogK']
const ease = (u) => u * u * (3 - 2 * u)
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const wrap24 = (h) => ((h % 24) + 24) % 24
const rad = Math.PI / 180

// Setting = { Farben als THREE.Color (linear), Zahlen }
const mkSetting = (src) => { const s = {}; for (const k of COLS) s[k] = new THREE.Color(src[k]); for (const k of NUMS) s[k] = src[k] ?? 0; return s }
const zero = () => { const s = {}; for (const k of COLS) s[k] = new THREE.Color(0, 0, 0); for (const k of NUMS) s[k] = 0; return s }
const addW = (o, s, w) => { for (const k of COLS) { o[k].r += s[k].r * w; o[k].g += s[k].g * w; o[k].b += s[k].b * w } for (const k of NUMS) o[k] += s[k] * w }
const lerpS = (o, a, b, t) => { for (const k of COLS) o[k].copy(a[k]).lerp(b[k], t); for (const k of NUMS) o[k] = a[k] + (b[k] - a[k]) * t; return o }

// Kurven je Biom: Grundwerte mit Farbzug
export const CURVES = BIOMES.map((b) => { const B = CFG.biomes[b] || {}, out = {}
  for (const [name, src] of Object.entries(CFG.base)) { const s = mkSetting(src)
    for (const [k, [hex, amt]] of Object.entries(B.tint || {})) if (s[k]?.isColor) s[k].lerp(new THREE.Color(hex), amt)
    if (B.fog) { s.fogNear *= B.fog; s.fogFar *= B.fog }
    out[name] = s }
  return out })

// Uhr → Sonne, Mond, Hauptlicht
export function celestial(hour, C = CFG.clock) {
  const h = wrap24(hour), day = C.sunset - C.sunrise, night = 24 - day
  const sunE = C.sunMaxElev * Math.sin(Math.PI * (h - C.sunrise) / day), sunA = C.azRise + (C.azSet - C.azRise) * (h - C.sunrise) / day
  const mt = wrap24(h - C.sunset), moonE = C.moonMaxElev * Math.sin(Math.PI * mt / night), moonA = C.azRise + (C.azSet - C.azRise) * mt / night
  const useSun = h >= C.sunrise && h <= C.sunset
  const dSwitch = Math.min(Math.abs(h - C.sunrise), Math.abs(h - C.sunset), Math.abs(h + 24 - C.sunset), Math.abs(h - 24 - C.sunrise))
  const dip = ease(clamp01(dSwitch / C.switchDip))
  const elev = Math.max(C.minLightElev, useSun ? sunE : moonE), az = useSun ? sunA : moonA
  const dir = (e, a) => [Math.cos(e * rad) * Math.sin(a * rad), Math.sin(e * rad), Math.cos(e * rad) * Math.cos(a * rad)]
  return { hour: h, sunElev: sunE, sunAz: sunA, moonElev: moonE, moonAz: moonA, light: useSun ? 'sun' : 'moon', elev, az, dip, sunDir: dir(sunE, sunA), moonDir: dir(Math.max(moonE, 3), moonA) }
}
// Kurve eines Bioms zur Stunde
export function curveAt(bi, hour, out = zero()) {
  const h = wrap24(hour), K = CFG.keys; let i = 0; while (i < K.length - 2 && h >= K[i + 1][0]) i++
  const [h0, a] = K[i], [h1, b] = K[i + 1], t = h1 > h0 ? ease(clamp01((h - h0) / (h1 - h0))) : 0
  return lerpS(out, CURVES[bi][a], CURVES[bi][b], t)
}
const TOD_AUDIO = (h) => { const C = celestial(h); return C.sunElev > 12 ? 1 : C.sunElev > -6 ? 0.4 : 0.05 }   // für AudioHost (night < 0,18 < evening < 0,55 < day)

// options: { live: { night, gold, day } (Stimmungs-Satz des Rigs), sky (sky-drive-Modul), hour = 13, timeScale = 0 (Spielstunden je Sekunde),
//            weather = 'klar', auto = false (Wetter wechselt selbst), seed }
export function createDriveAtmos(options = {}) {
  const live = options.live || { night: null, gold: null, day: null }, sky = options.sky
  const st = { hour: options.hour ?? 13, timeScale: options.timeScale ?? 0, biomeW: new Float32Array(NB), biome: 0, glide: null, flashT: 0, nextFlash: 6, t: 0 }
  st.biomeW[BIOMES.indexOf('mesa')] = 1
  const W = {}; for (const k of WKEYS) W[k] = CFG.weather.klar[k]
  const wx = { name: options.weather || 'klar', from: { ...W }, to: { ...CFG.weather[options.weather || 'klar'] }, t: 1, dur: 1, auto: !!options.auto, nextAuto: 120, log: [] }
  Object.assign(W, wx.to)
  let rs = (options.seed ?? 20261021) >>> 0; const rnd = () => { rs = (rs + 0x6d2b79f5) | 0; let t = Math.imul(rs ^ (rs >>> 15), 1 | rs); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const overlay = { tint: null, tintAmt: 0, fogAmt: 0, windAmt: 0, aurora: 0, flash: false, k: 0, target: 0, id: null }
  const events = {}                                  // name → { k, target, cfg }
  const S = zero(), tmp = zero(), cur = { settings: S, cel: null, fog: { color: new THREE.Color(), near: 0, far: 0 }, rain: 0, snow: 0 }
  const grey = new THREE.Color(CFG.weatherCol), fogGrey = new THREE.Color(CFG.fogCol), c1 = new THREE.Color(), c2 = new THREE.Color()
  const liveMood = { sun: '#ffffff', sunI: 1, elev: 40, az: 0, hemiSky: '#ffffff', hemiI: 1, bounce: 1, figI: 0.3, figColor: '#ffcf9c', skyL: 1, glow: 0, src: 'V-619 drive' }
  live.night = live.gold = live.day = liveMood

  function setWeather(name, { dur } = {}) {
    if (!CFG.weather[name]) return false
    wx.from = { ...W }; wx.to = { ...CFG.weather[name] }; wx.name = name; wx.t = 0; wx.dur = dur ?? 20 + 40 * rnd(); wx.log.push({ at: +st.t.toFixed(1), name, dur: +wx.dur.toFixed(1) }); if (wx.log.length > 40) wx.log.shift()
    return true
  }
  function presetsHere() { const b = BIOMES[st.biome]; return [...CFG.presetsCommon, ...(CFG.presetsBiome[b] || [])].map((p) => ({ ...p, biome: b })) }
  function applyPreset(id, { instant = false } = {}) {
    const p = presetsHere().find((q) => q.id === id || q.name === id); if (!p) return null
    if (instant) st.hour = p.hour; else st.glide = { from: st.hour, to: p.hour, t: 0, dur: 4 }
    setWeather(p.weather, { dur: instant ? 0.001 : 20 })
    Object.assign(overlay, { tint: p.tint ? new THREE.Color(p.tint[0]) : null, tintAmt: p.tint ? p.tint[1] : 0, fogAmt: p.fogAmt || 0, windAmt: p.windAmt || 0, aurora: p.aurora || 0, flash: !!p.flash, target: 1, id: p.id, k: instant ? 1 : overlay.k })
    return p
  }
  function clearPreset() { overlay.target = 0; overlay.id = null }
  function event(name, on = true) { const cfg = CFG.events[name]; if (!cfg) return false; const e = events[name] ||= { k: 0, target: 0, cfg }; e.target = on ? 1 : 0; return true }

  function update(dt, ctx = {}) {
    st.t += dt
    // Uhr: Zeitraffer bzw. Gleiten zu einem Preset
    if (st.glide) { const g = st.glide; g.t = Math.min(g.dur, g.t + dt); let d = g.to - g.from; if (d > 12) d -= 24; if (d < -12) d += 24; st.hour = wrap24(g.from + d * ease(g.t / g.dur)); if (g.t >= g.dur) st.glide = null }
    else st.hour = wrap24(st.hour + dt * st.timeScale)
    // Wetter: weicher Wechsel (smoothstep über dur), Auto-Wechsel nach Verweilzeit
    if (wx.t < 1) { wx.t = Math.min(1, wx.t + dt / Math.max(1e-3, wx.dur)); const k = ease(wx.t); for (const q of WKEYS) W[q] = wx.from[q] + (wx.to[q] - wx.from[q]) * k }
    if (wx.auto && wx.t >= 1 && (wx.nextAuto -= dt) <= 0) { const names = ['klar', 'klar', 'wolken', 'wolken', 'regen', 'nebel', 'wind'].filter((n) => n !== wx.name); setWeather(names[Math.floor(rnd() * names.length)]); wx.nextAuto = 90 + 110 * rnd() }
    // Preset-Schicht und Ereignisse blenden
    overlay.k += Math.sign(overlay.target - overlay.k) * Math.min(Math.abs(overlay.target - overlay.k), dt / 6)
    let darken = 0, evTint = null, evAmt = 0
    for (const e of Object.values(events)) { const sp = e.target > e.k ? 1 / e.cfg.fadeIn : 1 / e.cfg.fadeOut; e.k += Math.sign(e.target - e.k) * Math.min(Math.abs(e.target - e.k), dt * sp)
      const k = ease(e.k); darken = Math.max(darken, e.cfg.darken * k); if (e.cfg.tint && k > evAmt) { evTint = e.cfg.tint[0]; evAmt = e.cfg.tint[1] * k } }
    // Biom-Gewichte am Fokus (vom Host), gemischte Kurve
    if (ctx.biomeW) st.biomeW.set(ctx.biomeW)
    let bi = 0; for (let b = 1; b < NB; b++) if (st.biomeW[b] > st.biomeW[bi]) bi = b; st.biome = bi
    for (const k of COLS) S[k].setRGB(0, 0, 0); for (const k of NUMS) S[k] = 0
    for (let b = 0; b < NB; b++) if (st.biomeW[b] > 1e-4) addW(S, curveAt(b, st.hour, tmp), st.biomeW[b])
    const cel = celestial(st.hour); cur.cel = cel
    const oK = ease(overlay.k), ov = W.overcast, fogW = clamp01(W.fog + overlay.fogAmt * oK)
    if (overlay.tint && oK > 0) for (const k of COLS) S[k].lerp(overlay.tint, overlay.tintAmt * oK * (k === 'sun' || k === 'figColor' ? 0.5 : 1))
    if (evTint) { c1.set(evTint); for (const k of COLS) S[k].lerp(c1, evAmt) }
    // Gewitter: Blitz (nur Himmel + kurzer Hemisphären-Stoß des Rigs), Donner meldet der Ton
    st.flashT = Math.max(0, st.flashT - dt * 3.2); let flash = 0
    if (W.rain > 0.8 && (overlay.flash && oK > 0.5 || wx.name === 'regen' && options.storm)) { if ((st.nextFlash -= dt) <= 0) { st.flashT = 1; st.nextFlash = 7 + 16 * rnd(); st.thunder = { at: st.t, dist: 300 + 1500 * rnd(), az: rnd() * Math.PI * 2 }; st.flashes = (st.flashes || 0) + 1 } }
    flash = st.flashT > 0 ? st.flashT * st.flashT * (0.6 + 0.4 * Math.sin(st.t * 60)) : 0
    // Rig: Hauptlicht (Sonne bzw. Mond), Hemisphäre, Figurenlicht – Wetter dämpft die Sonne, graut die Füllung ein; Ereignis verdunkelt
    c1.copy(S.sun).lerp(grey, ov * 0.35); liveMood.sun = '#' + c1.getHexString()
    liveMood.sunI = S.sunI * W.sunK * cel.dip * (1 - 0.7 * darken)
    liveMood.elev = cel.elev; liveMood.az = cel.az
    c1.copy(S.hemiSky).lerp(grey, ov * 0.45); liveMood.hemiSky = '#' + c1.getHexString()
    liveMood.hemiI = S.hemiI * (1 - 0.18 * ov) * (1 - 0.5 * darken) * (1 + 0.9 * flash) + (1 - cel.dip) * 0.12
    liveMood.bounce = S.bounce; liveMood.figI = S.figI; liveMood.figColor = '#' + S.figColor.getHexString(); liveMood.skyL = S.skyL; liveMood.glow = Math.max(S.glow, 0.5 * ov * (S.glow > 0.1 ? 1 : 0))
    // Nebel des Hosts: Horizontfarbe → Nebelgrau nach Nebel/Bedeckung, Weite nach Wetter
    const F = cur.fog; F.color.copy(S.horizon).lerp(c2.copy(fogGrey).multiplyScalar(0.25 + 0.75 * S.skyL), clamp01(Math.max(fogW, ov * 0.65)))
    if (evTint) F.color.lerp(c1.set(evTint), evAmt * 0.6); F.color.multiplyScalar(1 - 0.45 * darken)
    const fk = W.fogK * (1 - 0.85 * overlay.fogAmt * oK)
    F.near = S.fogNear * fk * (fogW > 0.6 ? 0.15 : 1); F.far = Math.max(60, S.fogFar * fk)
    // Himmel (Kuppel der Probe): Farben aus der Kurve, Wolkenmenge/-töne aus dem Wetter, Sterne/Mond/Polarlicht aus Uhr und Biom
    if (sky?.uniforms) { const U = sky.uniforms
      U.uHorizon.value.copy(S.horizon).lerp(F.color, clamp01(fogW * 0.9 + ov * 0.3)); U.uZenith.value.copy(S.zenith).lerp(c1.copy(grey).multiplyScalar(0.3 + 0.7 * S.skyL), ov * 0.55)
      U.uSkyMid.value.copy(U.uHorizon.value).lerp(U.uZenith.value, 0.45); U.uAirTint.value.copy(U.uSkyMid.value)
      U.uSkyGround.value.copy(U.uHorizon.value).multiplyScalar(0.9).lerp(c1.set(BIOME_PALETTES[bi].low), 0.15)
      U.uSunDir.value.set(...cel.sunDir); U.uSunCol.value.copy(S.sunCol).lerp(grey, ov * 0.6)
      U.uLit.value.copy(S.lit).lerp(c1.copy(grey).multiplyScalar(0.4 + 0.6 * S.skyL), ov * 0.7); U.uShade.value.copy(S.shade).lerp(c1.copy(grey).multiplyScalar(0.3 + 0.45 * S.skyL), ov * 0.8)
      U.uCover.value = W.cover; U.uStars.value = clamp01(S.stars * (1 - ov * 1.2) * (1 - fogW))
      U.uMoon.value = cel.moonElev > -4 ? 1 : 0; U.uMoonDir.value.set(...cel.moonDir)
      const aur = Math.max(CFG.biomes[BIOMES[bi]]?.aurora ?? 0, overlay.aurora * oK); U.uAurora.value = aur * clamp01(S.stars) * (1 - ov) * (1 - fogW)
      U.uOvercast.value = ov; U.uWeatherCol.value.copy(grey).multiplyScalar(0.25 + 0.75 * S.skyL).lerp(F.color, 0.25); U.uFogSky.value = clamp01(fogW * 0.85); U.uFogCol.value.copy(F.color); U.uFlash.value = flash * 0.5 }
    // Wind (geteilt) und Niederschlag
    setWind({ strength: clamp01(W.wind + overlay.windAmt * oK * 0.6), gust: W.gust })
    cur.weather = wx.name; cur.biome = BIOMES[bi]; cur.rain = W.rain; cur.snow = CFG.biomes[BIOMES[bi]]?.snow ? 1 : 0; cur.darken = darken; cur.flash = flash
    // Host-Nebel
    const sc = ctx.scene; if (sc?.fog) { sc.fog.color.copy(F.color); sc.fog.near = F.near; sc.fog.far = F.far; if (sc.background?.isColor) sc.background.copy(F.color) }
    return cur
  }
  return {
    update, setWeather, applyPreset, clearPreset, event, presetsHere,
    get hour() { return st.hour }, set hour(h) { st.hour = wrap24(h); st.glide = null },
    get timeScale() { return st.timeScale }, set timeScale(v) { st.timeScale = v },
    setAuto(on) { wx.auto = !!on; wx.nextAuto = 30 },
    tod: () => TOD_AUDIO(st.hour),
    state: () => ({ hour: +st.hour.toFixed(3), timeScale: st.timeScale, biome: BIOMES[st.biome], biomeW: [...st.biomeW].map((v) => +v.toFixed(3)), weather: wx.name, weatherT: +wx.t.toFixed(3), weatherDur: +wx.dur.toFixed(1), auto: wx.auto,
      W: Object.fromEntries(WKEYS.map((k) => [k, +W[k].toFixed(3)])), preset: overlay.id, presetK: +overlay.k.toFixed(2), events: Object.fromEntries(Object.entries(events).map(([k, e]) => [k, +e.k.toFixed(2)])),
      light: cur.cel && { kind: cur.cel.light, elev: +cur.cel.elev.toFixed(1), az: +cur.cel.az.toFixed(1), sunElev: +cur.cel.sunElev.toFixed(1), moonElev: +cur.cel.moonElev.toFixed(1), dip: +cur.cel.dip.toFixed(2) },
      rig: { sun: liveMood.sun, sunI: +liveMood.sunI.toFixed(3), hemiSky: liveMood.hemiSky, hemiI: +liveMood.hemiI.toFixed(3) }, fog: { color: '#' + cur.fog.color.getHexString(), near: +cur.fog.near.toFixed(0), far: +cur.fog.far.toFixed(0) },
      rain: +cur.rain.toFixed(2), snow: cur.snow, wind: +WIND.strength.toFixed(2), flashes: st.flashes || 0, weatherLog: wx.log.slice(-8) }),
    thunder: () => { const t = st.thunder; st.thunder = null; return t },
    live, liveMood,
  }
}
