// V-619 · Endlose Biom-Fahrt im Spiel (dist, Hash #m1,debug,car,look=terrain3,world=endless,mute,drivepanel=0; PW_GPU=1 empfohlen).
//   sheet  : Kontaktbogen 6 Biome × 4 Tageszeiten (Morgen 7:00, Mittag 12:30, Abend 17:12, Nacht 0:30) aus der Spielkamera (Folgekamera hinter dem Wagen),
//            je Biom eine Stelle tief im Biom (Gewicht ≥ 0,98, Hang ≤ 12°); Bild test/out/biome-drive/sheet.png + Einzelbilder
//   light  : Rig folgt der Uhr (Hauptlicht Sonne/Mond, Höhe, Stärke), Himmel (Sterne nachts, Mond), keine Extra-Lichter (Szene: genau 1 Richtungs-, 1 Hemisphären-, 1 Spot-Licht)
//   weather: Wechsel klar → Regen weich über die eingestellte Dauer (keine Sprünge > 8 % je Sekunde), Regen sichtbar, Tropfen auf dem Bildschirm, Nebelweite sinkt
//   presets: 6 je Biom, jedes setzt Uhr/Wetter; Ereignis „mib“ verdunkelt das Rig (Sonne < 45 %)
//   fps    : Fahrt 25 s geradeaus (Mittag klar) und 15 s im Regen, Bildzeiten aus requestAnimationFrame (p50/p95/max), Kacheltausch, längste Bau-Scheibe
//   ground : während der Fahrt bleibt der Wagen über dem Boden (Abstand zur gezeigten Fläche), Kollider unter dem Wagen vorhanden
import fs from 'fs'
import sharp from 'sharp'
import { openPage, report } from './_page.mjs'

const OUT = 'test/out/biome-drive'; fs.mkdirSync(OUT, { recursive: true })
const HASH = '#m1,debug,car,look=terrain3,world=endless,mute,drivepanel=0,hour=12.5'
const HOURS = [['Morgen', 7.0], ['Mittag', 12.5], ['Abend', 17.2], ['Nacht', 0.5]]
const { browser, page, errs } = await openPage(HASH, { viewport: { width: 1280, height: 800 } })
page.on('console', (m) => { if (/Shader Error|WebGLProgram|VALIDATE_STATUS/.test(m.text())) errs.push('shader: ' + m.text().slice(0, 200)) })   // Shader-Fehler zählen (Gelände ohne Boden wäre sonst still)
const t0 = Date.now()
await page.waitForFunction(() => window.__kfbDrive && window.__kfbM2?.car?.() && window.__kfbDrive.veg()?.info().ready, null, { timeout: 180000 })
const readyS = (Date.now() - t0) / 1000
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const frames = (n) => page.evaluate((n) => new Promise((res) => { let k = 0; const f = () => (++k >= n ? res() : requestAnimationFrame(f)); requestAnimationFrame(f) }), n)

// Wagen an eine Stelle setzen (Gelände vorher dort fertig bauen, Kollider im nächsten Bild)
const place = (x, z, yaw) => page.evaluate(async ({ x, z, yaw }) => { const D = window.__kfbDrive, T = D.terrain(), M2 = window.__kfbM2
  T.setFocus(x, z); T.flush(); const y = T.surfaceAt(x, z) + 0.9
  M2.setKind('k2b', { p: [x, y, z], yaw }); await new Promise((r) => setTimeout(r, 300)); for (let i = 0; i < 400 && !M2.car(); i++) await new Promise((r) => setTimeout(r, 20)) }, { x, z, yaw })

// Biom-Stellen: Spirale um den Ursprung, je Biom die erste Stelle mit Gewicht ≥ 0,98 im Umkreis von 40 m und flachem Boden
const spots = await page.evaluate(() => { const D = window.__kfbDrive, T = D.terrain(), F = T.field, B = D.biomes, out = {}, w = new Float32Array(6)
  const flat = (x, z) => { const e = 2, H = (a, b) => T.height(a, b); return Math.atan(Math.hypot(H(x + e, z) - H(x - e, z), H(x, z + e) - H(x, z - e)) / (2 * e)) * 180 / Math.PI }
  for (let k = 0; k < 40000 && Object.keys(out).length < 6; k++) { const a = k * 2.399963, r = 300 + 6000 * Math.sqrt(k / 40000), x = Math.cos(a) * r, z = Math.sin(a) * r, d = F.dominant(x, z)
    if (out[d.key] || d.w < 0.98) continue; let ok = true; for (let j = 0; j < 8 && ok; j++) { F.weights(x + Math.cos(j) * 40, z + Math.sin(j) * 40, w); ok = w[d.index] > 0.98 }
    if (ok && flat(x, z) < 12) out[d.key] = [+x.toFixed(1), +z.toFixed(1)] }
  return out })

// ---- Kontaktbogen ----
const shots = []
for (const b of Object.keys(spots).sort()) { const [x, z] = spots[b]
  await place(x, z, Math.atan2(-x, -z)); await wait(1800)
  for (const [lab, h] of HOURS) { await page.evaluate((h) => { const A = window.__kfbDrive.atmos; A.setWeather('klar', { dur: 0.001 }); A.clearPreset(); A.hour = h; A.timeScale = 0 }, h); await frames(30); await wait(250)
    const f = `${OUT}/${b}-${lab}.png`; await page.screenshot({ path: f }); shots.push({ b, lab, f, st: await page.evaluate(() => window.__kfbDrive.atmos.state()) }) } }
const W = 400, Hh = 250, cols = HOURS.length, rows = Object.keys(spots).length
const tiles = await Promise.all(shots.map(async (s, i) => ({ input: await sharp(s.f).resize(W, Hh).toBuffer(), left: 150 + (i % cols) * (W + 6), top: 40 + Math.floor(i / cols) * (Hh + 6) })))
const NAMES = { moos: 'Moos-Insel', mesa: 'Mesa', wueste: 'Wüste', schnee: 'Schnee', pastell: 'Pastell', canyon: 'Claybound-Canyon' }
const svg = `<svg width="${150 + cols * (W + 6)}" height="${40 + rows * (Hh + 6)}" xmlns="http://www.w3.org/2000/svg"><style>text{font:600 20px sans-serif;fill:#2b2333}</style>
${HOURS.map(([l, h], i) => `<text x="${150 + i * (W + 6) + 10}" y="28">${l} ${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}</text>`).join('')}
${Object.keys(spots).sort().map((b, j) => `<text x="10" y="${40 + j * (Hh + 6) + Hh / 2}">${NAMES[b] || b}</text>`).join('')}</svg>`
await sharp({ create: { width: 150 + cols * (W + 6), height: 40 + rows * (Hh + 6), channels: 3, background: '#f4efe8' } }).composite([{ input: Buffer.from(svg), left: 0, top: 0 }, ...tiles]).png().toFile(`${OUT}/sheet.png`)

// ---- Licht: ein Rig, folgt der Uhr ----
const light = await page.evaluate(async () => { const D = window.__kfbDrive, A = D.atmos, M = window.__kfbM1, sc = M.scene(), out = {}
  const lights = { dir: 0, hemi: 0, spot: 0, point: 0, amb: 0 }; sc.traverse((o) => { if (o.isDirectionalLight) lights.dir++; else if (o.isHemisphereLight) lights.hemi++; else if (o.isSpotLight) lights.spot++; else if (o.isPointLight) lights.point++; else if (o.isAmbientLight) lights.amb++ })
  out.lights = lights
  const at = async (h) => { A.hour = h; await new Promise((r) => setTimeout(r, 300)); const L = M.mods.light.lights.sun, s = A.state(); return { h, kind: s.light.kind, elev: s.light.elev, sunI: +L.intensity.toFixed(3), sunCol: '#' + L.color.getHexString(), stars: +D.sky().uniforms.uStars.value.toFixed(2), moon: D.sky().uniforms.uMoon.value } }
  out.curve = []; for (const h of [0.5, 5.5, 6.0, 7, 9, 12.5, 15, 17.6, 18, 19, 21, 23]) out.curve.push(await at(h))
  return out })

// ---- Wetter: weicher Wechsel klar → Regen, Tropfen, Nebel ----
const wx = await page.evaluate(async () => { const D = window.__kfbDrive, A = D.atmos; A.hour = 13; A.setWeather('klar', { dur: 0.001 }); await new Promise((r) => setTimeout(r, 300))
  const far0 = A.state().fog.far, series = []; A.setWeather('regen', { dur: 24 })
  for (let i = 0; i <= 26; i++) { const s = A.state(); series.push({ t: i, cover: s.W.cover, rain: s.W.rain, sunI: s.rig.sunI, far: s.fog.far }); await new Promise((r) => setTimeout(r, 1000)) }
  let maxStep = 0; for (let i = 1; i < series.length; i++) for (const k of ['cover', 'rain']) maxStep = Math.max(maxStep, Math.abs(series[i][k] - series[i - 1][k]))
  return { far0, series, maxStep, weather: D.weather().info(), dur: A.state().weatherDur } })
await page.screenshot({ path: `${OUT}/weather-rain.png` })

// ---- Presets je Biom und Ereignis ----
const pre = await page.evaluate(async () => { const A = window.__kfbDrive.atmos, list = A.presetsHere(), res = []
  for (const p of list) { A.applyPreset(p.id, { instant: true }); await new Promise((r) => setTimeout(r, 120)); const s = A.state(); res.push({ id: p.id, name: p.name, hour: s.hour, weather: s.weather }) }
  A.clearPreset(); A.setWeather('klar', { dur: 0.001 }); A.hour = 13; await new Promise((r) => setTimeout(r, 200)); const s0 = A.state().rig.sunI
  A.event('mib', true); await new Promise((r) => setTimeout(r, 3500)); const s1 = A.state().rig.sunI; A.event('mib', false); await new Promise((r) => setTimeout(r, 300))
  return { biome: A.state().biome, n: list.length, res, mib: { before: s0, during: s1 } } })

// ---- Fahrt: fps und Bodenkontakt ----
async function drive(sec, label, setup) {
  await page.evaluate(setup)
  return page.evaluate(async ({ sec }) => { const M = window.__kfbM1, M2 = window.__kfbM2, D = window.__kfbDrive, T = D.terrain(), dts = [], gaps = []; T.resetStats?.()
    let last = performance.now(), t = 0, minClear = Infinity, noColl = 0; const s0 = T.info(), prog0 = M.renderer().info.programs.length; D.perf.reset(); const longAt = []
    M.input({ forward: true, run: true })
    await new Promise((res) => { const f = (now) => { const dt = now - last; last = now; dts.push(dt); t += dt; if (dt > 20 && longAt.length < 40) longAt.push(Math.round(t))
      const p = M2.car()?.pos?.(); if (p) { const g = T.surfaceAt(p.x, p.z); minClear = Math.min(minClear, p.y - g); if (dts.length % 30 === 0) { const r = M.player().castDown?.(p.x, p.z); if (r == null) noColl++ } }
      if (t < sec * 1000) requestAnimationFrame(f); else res() }; requestAnimationFrame(f) })
    M.input(null); const s1 = T.info(), p = M2.car()?.pos?.()
    const a = dts.slice(30).sort((x, y) => x - y), q = (k) => +a[Math.floor(k * (a.length - 1))].toFixed(2)
    return { frames: a.length, fps: +(1000 / (a.reduce((s, v) => s + v, 0) / a.length)).toFixed(1), p50: q(0.5), p95: q(0.95), p99: q(0.99), max: q(1), over20ms: a.filter((v) => v > 20).length,
      swaps: s1.swaps - s0.swaps, built: s1.built - s0.built, maxSliceMs: s1.maxSliceMs, leaves: s1.leaves, tris: s1.tris, minClear: +minClear.toFixed(3), noColl, end: p && [+p.x.toFixed(0), +p.z.toFixed(0)], programs: M.renderer().info.programs.length - prog0, mineMax: +D.perf.max.toFixed(2), collMax: +D.perf.coll.toFixed(2), longAt, veg: D.veg().info(), renderer: (() => { const i = M.renderer().info; return { calls: i.render.calls, tris: i.render.triangles } })() } }, { sec })
}
const fps = {}
fps.clear = await drive(25, 'klar', () => { const A = window.__kfbDrive.atmos; A.setWeather('klar', { dur: 0.001 }); A.hour = 12.5 })
await page.screenshot({ path: `${OUT}/drive-clear.png` })
fps.rain = await drive(15, 'regen', () => { const A = window.__kfbDrive.atmos; A.setWeather('regen', { dur: 0.001 }); A.hour = 16 })
await page.screenshot({ path: `${OUT}/drive-rain.png` })
fps.night = await drive(10, 'nacht', () => { const A = window.__kfbDrive.atmos; A.setWeather('klar', { dur: 0.001 }); A.hour = 23 })
await browser.close()

const nb = Object.keys(spots).length, curve = light.curve
const checks = {
  sixBiomes: nb === 6, sheet: shots.length === 24 && fs.existsSync(`${OUT}/sheet.png`),
  oneRig: light.lights.dir === 1 && light.lights.hemi === 1 && light.lights.point === 0 && light.lights.amb === 0 && light.lights.spot <= 1,
  sunByDay: curve.filter((c) => c.h > 7 && c.h < 17).every((c) => c.kind === 'sun' && c.sunI > 1.2), moonByNight: curve.filter((c) => c.h < 5 || c.h > 20).every((c) => c.kind === 'moon' && c.sunI < 1.0 && c.stars > 0.5 && c.moon === 1),
  weatherSoft: wx.maxStep <= 0.08 && wx.dur >= 20 && wx.dur <= 60, rainVisible: wx.weather.rain > 0.9 && wx.weather.drops > 0, fogCloses: wx.series.at(-1).far < wx.far0 * 0.7,
  sixPresets: pre.n === 6 && pre.res.every((r) => r.weather), mibDarkens: pre.mib.during < pre.mib.before * 0.45,
  fps60: fps.clear.fps >= 58 && fps.rain.fps >= 55, onGround: [fps.clear, fps.rain, fps.night].every((f) => f.minClear > -0.3 && f.noColl === 0),
  noErrors: errs.length === 0,
}
const res = { readyS, spots, light, weather: { far0: wx.far0, maxStep: wx.maxStep, dur: wx.dur, end: wx.series.at(-1), info: wx.weather }, presets: pre, fps, errs: errs.slice(0, 5) }
fs.writeFileSync(`${OUT}/result.json`, JSON.stringify(res, null, 1))
process.exit(report('biomeDrive', checks, res))
