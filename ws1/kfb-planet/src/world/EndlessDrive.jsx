// V-619 · Endlose Biom-Fahrt (Hash world=endless, mit look=terrain3): Anschluss an die Laufwelt M1 an EINER Stelle (Lead-Absprache 21.10.):
// M1World importiert ENDLESS_ON, wählt Gelände und Himmel aus dieser Datei, übergibt sein Rig-Optionsobjekt an adoptRig und hängt <EndlessDrive> in die Physik.
// Hier: Kollider-Strom des Geländes (Rapier-Trimesh je 64-m-Kachel am Wagen), Fokus (Wagen bzw. Figur), Atmosphäre (Uhr, Wetter, Stimmungen → das eine
// Licht-Rig, Himmel, Nebel), Bewuchs, Niederschlag, Ton (nur über kfbAudio, V-598) und eine kleine Tafel für Georg (Taste L).
// Hash: hour=0..24 (Startzeit), tlapse=Faktor (Spielstunden je Sekunde), weather=klar|wolken|regen|nebel|wind|auto, preset=<id>, drivepanel=0, mute.
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import ModuleHost from '../ModuleHost'
import { createEndlessTerrain } from './endlessTerrain.js'
import { createDriveSky } from '../modules/sky-drive.js'
import { createDriveAtmos } from './driveAtmos.js'
import { createEndlessVeg } from './endlessVeg.js'
import { createDriveWeather } from './driveWeather.js'
import { windTick, WIND } from './kfbWind.js'
import { BIOMES, BIOME_CFG, NB } from './biomeField.js'
import { BIOME_PALETTES, PAL_STATE, setBiomePalettes } from '../look/biomeTerrain.js'
import { M2STATE } from '../m2/M2Car'
import { worldPosOf } from '../m1/m1Host'
import { shadowLength, MOODS_MESA } from '../vendor/light/kfb-stage-light.v1.1.js'
import { useHostKeys } from '../hostKeys'
import { expose } from '../debug'
import * as A from '../audio/kfbAudio.js'

const hash = typeof location !== 'undefined' ? location.hash : ''
export const ENDLESS_ON = /(^|[#,])world=endless(,|$)/.test(hash)
const num = (re, d) => { const m = re.exec(hash); return m ? parseFloat(m[1]) : d }
const START = { flowwind: num(/[#,]flowwind=([\d.]+)/, 0.35), hour: num(/[#,]hour=([\d.]+)/, 13), tlapse: num(/[#,]tlapse=([\d.]+)/, 0), weather: (/[#,]weather=(\w+)/.exec(hash) || [0, 'klar'])[1], preset: (/[#,]preset=(\w+)/.exec(hash) || [0, null])[1],
  panel: !/(^|[#,])drivepanel=0(,|$)/.test(hash) }
export const PERF = { ring: new Float32Array(600), i: 0, max: 0, coll: 0, reset() { this.ring.fill(0); this.i = 0; this.max = 0; this.coll = 0 } }   // Kosten des Fahrt-Takts je Bild (ms)
const AST = { hour: 0, weather: 'klar', biome: 'mesa', rain: 0, snow: 0 }   // Ton-Zustand je Bild (ohne Objekt-Neubau)
export const DRIVE = { atmos: null, terrain: null, veg: null, weather: null, sky: null, mods: null }

// Gelände und Himmel (M1World: makeTerrain/makeSky wählen diese bei ENDLESS_ON)
export const createEndlessTerrainMod = (o) => (DRIVE.terrain = createEndlessTerrain(o))
export const createDriveSkyMod = (o) => (DRIVE.sky = createDriveSky(o))

// Licht-Rig (kfb-stage-light.v1.1, unverändert): Stimmung je Bild aus dem lebenden Satz der Atmosphäre; tod nur für den Ton (Tag/Abend/Nacht).
// Schattenbereich wie M1World (Wagen bzw. Figur, Länge nach Sonnenhöhe), aber mit der Höhe des aktuellen Hauptlichts.
const LIVE0 = { ...MOODS_MESA.day }, LIVE = { night: LIVE0, gold: LIVE0, day: LIVE0 }   // bis die Atmosphäre steht (Physik lädt asynchron): Mesa-Tag
export function adoptRig(RIG) {
  const fit0 = RIG.fit
  Object.assign(RIG, {
    moods: LIVE, tod: () => DRIVE.atmos?.tod?.() ?? 1,
    groundColor: () => { const b = DRIVE.atmos?.state?.().biome; return b ? BIOME_PALETTES[BIOMES.indexOf(b)].low : '#c0a080' },
    fit: () => { const f = fit0(), el = DRIVE.atmos?.liveMood?.elev; if (!el || !f?.center) return f
      const cp = M2STATE.carPos?.(), half = M2STATE.carSize?.half ?? 1.7, h = M2STATE.carSize?.h ?? 1.2, e = Math.max(8, el) * Math.PI / 180
      return { ...f, radius: Math.max(cp ? half + shadowLength(el) * h + 0.65 : f.radius, 10.4), margin: 9.1 / Math.sin(e) + 2.6 } } })
}

// ── Tafel (DOM, eine Ebene über dem Bild; nur Darstellung, Zustand liegt in der Atmosphäre) ──────────────────────────────
function mountPanel(at) {
  if (typeof document === 'undefined') return null
  const el = document.createElement('div'); el.id = 'kfb-drive-panel'
  el.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:30;font:500 12px/1.3 system-ui,sans-serif;color:#2b2333;background:rgba(255,250,244,.86);border-radius:10px;padding:8px 10px;width:250px;box-shadow:0 2px 10px rgba(0,0,0,.18);user-select:none'
  el.innerHTML = `<div style="display:flex;justify-content:space-between;font-weight:700"><span>Licht & Wetter</span><span id="dpB" style="font-weight:500;opacity:.75"></span></div>
  <div style="display:flex;align-items:center;gap:6px;margin-top:6px"><span id="dpH" style="width:42px;font-variant-numeric:tabular-nums">13:00</span><input id="dpT" type="range" min="0" max="24" step="0.05" style="flex:1"></div>
  <div style="display:flex;gap:4px;margin-top:4px" id="dpL"></div>
  <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px" id="dpW"></div>
  <select id="dpP" style="width:100%;margin-top:6px;font:inherit;background:#fff;color:#2b2333"></select>
  <div style="display:flex;align-items:center;gap:6px;margin-top:6px"><span style="width:110px">Farbfluss mit Wind</span><input id="dpF" type="range" min="0" max="1" step="0.05" style="flex:1"></div>
  <div style="opacity:.6;margin-top:4px">L Tafel ein/aus</div>`
  document.body.appendChild(el)
  const $ = (id) => el.querySelector('#' + id), btn = (txt, on) => { const b = document.createElement('button'); b.textContent = txt; b.style.cssText = 'font:inherit;padding:2px 6px;border-radius:6px;border:1px solid #c9b9c9;background:#fff;color:#2b2333;cursor:pointer'; b.onclick = (e) => { e.stopPropagation(); on(); b.blur() }; return b }
  $('dpT').oninput = (e) => { at.hour = +e.target.value }
  $('dpF').value = DRIVE.flowK ?? START.flowwind; $('dpF').oninput = (e) => { DRIVE.flowK = +e.target.value }
  for (const [t, v] of [['Stopp', 0], ['×1 min/s', 1 / 60], ['×10 min/s', 1 / 6], ['×1 h/s', 1]]) $('dpL').appendChild(btn(t, () => { at.timeScale = v }))
  for (const w of ['klar', 'wolken', 'regen', 'nebel', 'wind']) $('dpW').appendChild(btn(w[0].toUpperCase() + w.slice(1), () => at.setWeather(w)))
  $('dpW').appendChild(btn('Auto', () => at.setAuto(!at.state().auto)))
  $('dpW').appendChild(btn('Neue Farben', () => setBiomePalettes(PAL_STATE.seed + 1)))   // prozedurale Farbplatten (Georg 22.10.), nächster Seed
  let lastBiome = null
  $('dpP').onchange = (e) => { if (e.target.value) at.applyPreset(e.target.value); else at.clearPreset(); e.target.blur() }
  const tick = () => { const s = at.state(); $('dpH').textContent = String(Math.floor(s.hour)).padStart(2, '0') + ':' + String(Math.floor((s.hour % 1) * 60)).padStart(2, '0')
    if (document.activeElement !== $('dpT')) $('dpT').value = s.hour
    $('dpB').textContent = (BIOME_CFG.biomes[s.biome]?.name || s.biome) + ' · ' + s.weather + (s.auto ? ' (auto)' : '') + ' · Farben ' + (PAL_STATE.gen ? '#' + PAL_STATE.seed : 'Hand')
    if (s.biome !== lastBiome) { lastBiome = s.biome; $('dpP').innerHTML = '<option value="">– Lichtstimmung –</option>' + at.presetsHere().map((p) => `<option value="${p.id}">${p.name}</option>`).join('') ; if (s.preset) $('dpP').value = s.preset } }
  const iv = setInterval(tick, 250); tick()
  return { el, toggle: () => { el.style.display = el.style.display === 'none' ? '' : 'none' }, dispose: () => { clearInterval(iv); el.remove() } }
}

// ── Ton: über den EINEN Ton-Pfad (kfbAudio, WS-Audio b863c35): Atmo-Kontext mit Vorrang (Biom, Wetter, Wind, Tageszeit), Blitz-Donner über
// kfb-ambience (gleiche Zeit wie der Blitz am Himmel), leise Tageszeit-Schichten W01–W03, W04 beim Übergang trocken → Regen, W06 nur als Ersatz
// (wenn kfb-ambience fehlt). Biom-Zuordnung nach WS-Audio: moos→meadow, mesa/wueste/canyon→beach, schnee→forest (+ snow), pastell→pond.
const AMB_BIOME = { moos: 'meadow', mesa: 'beach', wueste: 'beach', canyon: 'beach', schnee: 'forest', pastell: 'pond' }
const todOf = (h) => (h >= 5 && h < 9 ? 'morning' : h >= 9 && h < 17 ? 'day' : h >= 17 && h < 20.5 ? 'evening' : 'night')
function createDriveAudio() {
  const loops = { 'weather.rain': null, 'time.dawn': null, 'time.dusk': null, 'time.night': null }, S = { t: 0, lastWeather: 'klar', retry: 0, ctx: null, lightning: 0 }
  const band = (h, a, b, f) => { const x = ((h - a + 24) % 24), L = ((b - a + 24) % 24); return x > L ? 0 : Math.min(1, x / f, (L - x) / f) }
  return { tick(dt, at, st) { S.t += dt; if (A.audioMode() !== 'full') return
    const ac = A.audioContext(); if (!ac) return
    if ((S.retry -= dt) <= 0) { S.retry = 1; for (const k of Object.keys(loops)) if (!loops[k]) loops[k] = A.play(k, { loop: true, silent: true }) }
    const amb = !!A.stats?.().modules?.ambience, h = st.hour, rain = st.rain * (st.snow ? 0 : 1)
    const want = { 'weather.rain': amb ? 0 : rain, 'time.dawn': band(h, 5.2, 8.6, 1) * (1 - rain * 0.7), 'time.dusk': band(h, 17.4, 21, 1) * (1 - rain * 0.7), 'time.night': band(h, 20.6, 5.4, 1.2) * (1 - rain * 0.5) }
    for (const [k, v] of Object.entries(loops)) if (v?.env) v.env.gain.setTargetAtTime(v.vol * want[k], ac.currentTime, 0.9)
    if (st.weather !== S.lastWeather) { if (st.weather === 'regen' && !st.snow) A.play('weather.rainOnset', { gain: 0.8 }); S.lastWeather = st.weather }
    const th = at.thunder(); if (th) { S.lightning++; A.ambienceLightning?.({ distanceM: th.dist, azimuth: th.az }) }
    const weather = st.snow && st.rain > 0.3 ? 'snow' : st.rain > 0.7 ? (st.flash ? 'thunderstorm' : 'rain-heavy') : st.rain > 0.2 ? 'rain-light' : WIND.strength > 0.85 ? 'storm' : 'clear'
    S.ctx = A.ambienceContext?.({ biome: AMB_BIOME[st.biome] || 'meadow', weather, wind: Math.round(Math.min(1, WIND.strength) * 20) / 20, timeOfDay: todOf(h) }) ?? null
  }, info: () => ({ loops: Object.fromEntries(Object.entries(loops).map(([k, v]) => [k, v ? +v.env.gain.value.toFixed(3) : null])), ctx: S.ctx, lightning: S.lightning }) }
}

export function EndlessDrive({ mods }) {
  const { world, rapier } = useRapier(), { scene, camera } = useThree()
  const bodies = useRef(new Map()), wb = useMemo(() => new Float32Array(NB), [])
  const atmos = useMemo(() => { const a = createDriveAtmos({ live: LIVE, sky: DRIVE.sky, hour: START.hour, timeScale: START.tlapse, weather: START.weather === 'auto' ? 'klar' : START.weather, auto: START.weather === 'auto' }); DRIVE.atmos = a; return a }, [])
  const vegOpts = useMemo(() => ({ terrain: mods.terrain }), [mods])
  const makeVeg = useMemo(() => (o) => (DRIVE.veg = createEndlessVeg(o)), []), makeWx = useMemo(() => (o) => (DRIVE.weather = createDriveWeather(o)), []), wxOpts = useMemo(() => ({}), [])
  const audio = useMemo(() => createDriveAudio(), []), last = useRef(null), panel = useRef(null)
  useEffect(() => { DRIVE.mods = mods; if (START.preset) { atmos.update(0, {}); atmos.applyPreset(START.preset, { instant: true }) } if (START.panel) panel.current = mountPanel(atmos); return () => panel.current?.dispose() }, [])
  useHostKeys((e) => { if (e.code === 'KeyL' && !e.repeat) { panel.current?.toggle(); e.preventDefault() } }, 5)
  useEffect(() => () => { for (const rb of bodies.current.values()) world.removeRigidBody(rb); bodies.current.clear() }, [world])
  useFrame((_, dt) => {
    const T = mods.terrain; if (!T?.colliderDiff) return
    dt = Math.min(dt, 0.1); const tP0 = performance.now()
    const cp = M2STATE.carPos?.(), pp = cp || worldPosOf(mods.player), p = pp || camera.position
    let v = 0; if (last.current && dt > 0) v = Math.hypot(p.x - last.current.x, p.z - last.current.z) / dt; last.current = { x: p.x, z: p.z }
    T.setFocus(p.x, p.z, v); DRIVE.veg?.setFocus(p.x, p.z)
    // Kollider-Strom (feste Körper, Trimesh = gezeigte Dreiecke)
    const d = T.colliderDiff()
    for (const k of d.remove) { const rb = bodies.current.get(k); if (rb) { world.removeRigidBody(rb); bodies.current.delete(k) } }
    const tC0 = performance.now()
    for (const a of d.add) { const rb = world.createRigidBody(rapier.RigidBodyDesc.fixed()); world.createCollider(rapier.ColliderDesc.trimesh(a.vertices, a.indices), rb); bodies.current.set(a.key, rb) }
    PERF.coll = Math.max(PERF.coll, performance.now() - tC0)
    // Atmosphäre: Biom am Fokus → Kurve, Wetter, Rig, Himmel, Nebel
    T.biomeAt(p.x, p.z, wb)
    const cur = atmos.update(dt, { biomeW: wb, scene })
    windTick(dt)
    { const L = T.biomeLook; if (L?.windFlow) { L.flow.k = DRIVE.flowK ?? START.flowwind; const t = WIND.time, g = 0.5 + 0.5 * Math.sin(t * 0.9) * Math.sin(t * 0.37 + 1.3); L.windFlow(dt, WIND.dir, WIND.strength, WIND.gust * g, pp || p) } }   // Farbfluss mit Wind
    DRIVE.weather?.setAmount(cur.rain, cur.snow, { color: cur.fog.color, speed: v })
    { const ms = performance.now() - tP0; PERF.ring[PERF.i++ % PERF.ring.length] = ms; PERF.max = Math.max(PERF.max, ms) }
    AST.hour = atmos.hour; AST.weather = cur.weather; AST.biome = cur.biome; AST.rain = cur.rain; AST.snow = cur.snow; AST.flash = cur.flash > 0; audio.tick(dt, atmos, AST)
  })
  useEffect(() => { expose('Drive', { atmos, terrain: () => mods.terrain, veg: () => DRIVE.veg, weather: () => DRIVE.weather, sky: () => DRIVE.sky, audio: () => audio.info(), colliders: () => bodies.current.size, perf: PERF, palettes: () => ({ seed: PAL_STATE.seed, gen: PAL_STATE.gen, list: BIOME_PALETTES }), setPalettes: setBiomePalettes, live: LIVE, biomes: BIOMES }) }, [])
  return (
    <>
      <ModuleHost create={makeVeg} options={vegOpts} />
      <ModuleHost create={makeWx} options={wxOpts} />
    </>
  )
}
