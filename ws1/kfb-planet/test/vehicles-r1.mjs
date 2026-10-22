// V-631 Fahrzeuge R1: alle 14 Dieselpunk-Racer im Spiel (look=terrain3, world=probe), Heldenfarbe, Front-Scheinwerfer über kfb-groundfx.
// Aufruf: node test/vehicles-r1.mjs <teil>   (PW_GPU=1; sheet, clip und fps nur mit Test-Slot ~/kfb-ws1/bin/kfb-slot)
//   data   Einzeltest: 14 Racer nacheinander per Wechsel (V-Taste-Weg setRacer) – Modell, Scheinwerfer, Räder, Heldenfarbe, Verformungsprofil,
//          Ruckler beim Wechsel (längste Bildzeit, Long Tasks, neu übersetzte Shader), Scheinwerfer-Kosten je Bild.
//   sheet  Kontaktbogen 14 × (Tag | Nacht) schräg von vorn, Scheinwerfer an → test/out/vehicles/sheet.png; dazu hang-night.png (Scheinwerfer nachts
//          am Hang), far-near.png / far-out.png (Ferne-Aufhellung am echten Spielabstand) und sheet.json.
//   clip   30-s-Fahrclip je neuer Klasse (Rad-Racer, Laster), nachts, aus der Folgekamera → test/out/vehicles/clip-<klasse>.webm
//   start  Einzeltest Startseite: Fahrzeug-Wahl (15 Einträge), Racer-Wechsel hinter dem Vorhang, „zu Fuß“ nimmt car aus der Adresse
//   vclay  A/B für Georg (V-654 C5): 3 Racer × Tag/Gold × Original/Knete aus der Spielkamera bei Gas → test/out/vehicles/vclay-ab.png (nur mit Slot)
//   fps    fps-Tabelle: je Racer nachts fahrend, Scheinwerfer an/aus im Wechsel → test/out/vehicles/fps.md
import fs from 'fs'
import path from 'path'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
const OUT = 'test/out/vehicles/'; fs.mkdirSync(OUT + 'shots', { recursive: true })
const RIG = JSON.parse(fs.readFileSync('src/data/vehicles/kfb-vehicle-rig.r1.json', 'utf8')).vehicles
const PART = process.argv[2] || 'data', BASE = '#m1,car,debug,look=terrain3,world=probe'
const IDS = Object.keys(RIG).sort((a, b) => RIG[a].name_de.localeCompare(RIG[b].name_de, 'de', { numeric: true }))
const CLASS = (id) => (RIG[id].class === 'hauler' ? 'Laster' : RIG[id].wheels ? 'Rad-Racer' : 'Schwebe-Racer')

async function open(hash, vp = { width: 1280, height: 720 }) {
  const o = await openPage(BASE + hash + (process.env.VEH_HASH || ''), { viewport: vp })   // VEH_HASH=',vclay=1': Knet-Stufe der Racer prüfen
  // VEH_CPU=4: nur diese Seite per CDP bremsen (stellt Volllast nach, ohne die geteilte Maschine zu belasten)
  if (+process.env.VEH_CPU > 1) { const cdp = await o.page.context().newCDPSession(o.page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: +process.env.VEH_CPU }) }
  await o.page.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK' && window.__kfbM2?.stats?.modelId, null, { timeout: 240000 })
  await o.page.evaluate(() => { window.__lt = []; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(+e.duration.toFixed(0)) }).observe({ type: 'longtask' }) } catch (e) {} })
  await o.page.waitForTimeout(1500); return o
}
// Wechsel wie Taste V (setRacer), wartet bis das neue Modell steht; misst Bildzeiten, Long Tasks und neu übersetzte Shader
const swap = (page, id) => page.evaluate(async (id) => {
  const M = window.__kfbM2; if (M.racer() === id && M.stats.modelId === id) return { id, same: true }
  // Grundbildzeit vor dem Wechsel (geteilte Maschine: unter fremder GPU-Last ist jedes Bild langsam – der Wechsel wird dagegen gemessen)
  const base = []; { let l = performance.now(); for (let i = 0; i < 30; i++) { await new Promise((r) => requestAnimationFrame(r)); const n = performance.now(); base.push(n - l); l = n } }
  const cached = !!M.modelInfo(id)?.warm
  const P0 = new Set(M.renderer().info.programs.map((p) => p.cacheKey)); window.__lt.length = 0; const fr = []; let last = performance.now(), run = true
  ;(function f() { const n = performance.now(); fr.push(n - last); last = n; if (run) requestAnimationFrame(f) })()
  const t0 = performance.now(); M.setRacer(id)
  await new Promise((res, rej) => { const w = () => (M.stats.model === 'OK' && M.stats.modelId === id && M.headlights.inst ? res() : performance.now() - t0 > 120000 ? rej(new Error('timeout ' + id)) : setTimeout(w, 50)); w() })
  await new Promise((r) => setTimeout(r, 600)); run = false
  return { id, cached, baseMax: +Math.max(...base.slice(2)).toFixed(0), loadMs: +(performance.now() - t0).toFixed(0), maxFrame: +Math.max(...fr.slice(2)).toFixed(0), longMax: Math.max(0, ...window.__lt), newPrograms: M.renderer().info.programs.filter((p) => !P0.has(p.cacheKey)).length, prep: M.stats.prepMs }
}, id)
const state = (page) => page.evaluate(() => { const M = window.__kfbM2, h = M.headlights, R = M.stats.rig
  return { id: M.racer(), model: M.stats.model, lamps: h.inst?.lamps.length ?? 0, sides: h.inst?.sides.length ?? 0, pools: h.inst?.getPools().length ?? 0, hlMs: h.n ? +(h.ms / h.n).toFixed(3) : null,
    rigY: R ? +R.object3d.position.y.toFixed(3) : null, hero: M.stats.hero, look: M.stats.look?.applied ?? 0, deform: M.deform.profile.id, spec: { wheels: M.spec.wheels, cls: M.spec.cls } } })
// Kamera schräg von vorn (Folgekamera: Gierung um die Wagenmitte), etwas näher
const frontView = (page) => page.evaluate(() => { const f = window.__kfbM2.stats.follow; f.orbit(Math.PI - 0.62, 0.05); f.zoomBy(-200) })
// Nacht: seitlich vorn, höher und weiter weg – Gläser, Kegel und Lichtfleck vor dem Wagen in einem Bild
const nightView = (page) => page.evaluate(() => { const f = window.__kfbM2.stats.follow; f.orbit(Math.PI * 0.6, 0.35); f.zoomBy(700) })
const res = { part: PART, date: new Date().toISOString() }
let code = 0

if (PART === 'data') {
  const { browser, page, errs } = await open(',tod=night')
  res.cars = {}
  for (const id of IDS) { const s = await swap(page, id); await page.waitForTimeout(800); res.cars[id] = { ...s, ...(await state(page)), class: CLASS(id) }; console.log(JSON.stringify(res.cars[id])) }
  // zurück auf die zuletzt gefahrenen Racer (im Speicher, höchstens 5): ohne Neuladen, ohne neue Shader
  res.back = []; for (const id of [IDS[12], IDS[11]]) res.back.push(await swap(page, id))
  // Vorwärmen: Panzer-Gleiter fahren, bis der Leerlauf den nächsten Racer (Abschlepp-Koloss: 8 Shader-Varianten) vorgeladen hat, dann wechseln wie mit V
  await swap(page, 'ironclad_skycruiser')
  res.prefetched = await page.waitForFunction(() => window.__kfbM2.modelInfo('ironclad_wrecker')?.warm, null, { timeout: 120000 }).then(() => true, () => false)
  await page.waitForTimeout(1500); res.warmSwap = await swap(page, 'ironclad_wrecker')
  // Heldenfarbe (Georg 22.10.: Standard Original, Einstellung): im Spiel an- und wieder ausschalten, am Flammen-Dragster (Lack wird umgefärbt)
  await swap(page, 'crimson_flame_dragster')
  // Heldenfarbe je Material: normal = umgerechnete Textur (hero.tex) bzw. Original; Knet-Stufe (vclay) = umgetönte Textur mit Lack in KFB-Rot (vclay.hero) bzw. ohne (vclay.base)
  const heroMaps = () => page.evaluate(() => { let tex = 0, orig = 0, all = 0; window.__kfbM2.stats.rig?.stretch?.traverse((o) => { if (o.isMesh) for (const mt of [].concat(o.material)) {
    const v = mt.userData.kfbClay?.src?.userData.vclay, h = mt.userData.hero, on = v ? v.hero : h?.tex, off = v ? v.base : h?.orig; if (!on) continue; all++; if (mt.map === on) tex++; if (mt.map === off) orig++ } }); return { all, tex, orig, state: window.__kfbM2.stats.hero } })
  res.heroDefault = await heroMaps()
  await page.evaluate(() => window.__kfbM2.setHero(true)); await page.waitForFunction(() => window.__kfbM2.stats.hero?.on && (window.__kfbM2.stats.hero.applied >= 1 || window.__kfbM2.stats.hero.clay), null, { timeout: 60000 }).catch(() => {}); await page.waitForTimeout(1500)
  res.heroOn = await heroMaps(); await page.waitForTimeout(500); await page.screenshot({ path: OUT + 'hero-on.png' })
  await page.evaluate(() => window.__kfbM2.setHero(false)); await page.waitForTimeout(800)
  res.heroOff = await heroMaps(); await page.screenshot({ path: OUT + 'hero-off.png' })
  await browser.close(); res.errs = errs.slice(0, 5)
  fs.writeFileSync(OUT + 'data.json', JSON.stringify(res, null, 1))
  const C = Object.values(res.cars)
  code = report('vehicles-r1 data (V-631: 14 Racer, Scheinwerfer, Räder, Heldenfarbe)', {
    all14Load: C.length === 14 && C.every((c) => c.model === 'OK'),
    headlightsOnAll: C.every((c) => c.lamps === RIG[c.id].headlights.lamps.length && c.pools >= 1 && c.sides >= 1),
    headlightsUnder02ms: C.every((c) => c.hlMs != null && c.hlMs < 0.2),
    wheelsOnGround: C.every((c) => (RIG[c.id].wheels ? c.rigY < -0.1 : c.rigY === 0)),
    heroOffByDefault: C.every((c) => c.hero?.off && c.hero.on === false) && res.heroDefault.tex === 0,
    heroToggleOn: res.heroOn.state?.on === true && res.heroOn.all >= 1 && res.heroOn.tex === res.heroOn.all,
    heroToggleOff: res.heroOff.state?.on === false && res.heroOff.all >= 1 && res.heroOff.orig === res.heroOff.all,
    deformPerClass: C.every((c) => c.deform === (RIG[c.id].class === 'hauler' ? 'SPACE_HAULER' : 'CAR_CHILL_LIGHT')),
    noShaderRecompileOnCachedSwap: res.back.every((b) => !b.newPrograms),   // Erstladen darf neue Varianten übersetzen (z. B. Leucht-Textur des Ödland-Käfers)
    // Zurückwechseln/Vorgewärmt: Cache getroffen, keine neuen Shader, kein Hänger über der Grundbildzeit (< 100 ms bzw. < 1,5 × langsamstes Bild davor)
    cachedSwapSmooth: res.back.every((b) => b.cached && !b.newPrograms && b.maxFrame < Math.max(100, b.baseMax * 1.5)),
    prefetchWarmsNext: res.prefetched && res.warmSwap.cached && res.warmSwap.maxFrame < Math.max(100, res.warmSwap.baseMax * 1.5),
    noPageErrors: !errs.length,
  }, { maxFrameNew: Math.max(...C.map((c) => c.maxFrame || 0)), longMaxNew: Math.max(...C.map((c) => c.longMax || 0)), back: res.back, warmSwap: res.warmSwap })
}

if (PART === 'sheet') {
  const TW = 480, TH = 270, tiles = {}
  res.sheet = {}
  for (const [tod, hash] of [['Tag', ''], ['Nacht', ',tod=night']]) {
    const { browser, page, errs } = await open(hash)
    for (const id of IDS) { await swap(page, id); await page.waitForTimeout(1200); await (tod === 'Nacht' ? nightView : frontView)(page); await page.waitForTimeout(1800)
      const f = `${OUT}shots/${id}-${tod}.png`; await page.screenshot({ path: f }); (tiles[id] ||= {})[tod] = f; (res.sheet[id] ||= {})[tod] = await state(page) }
    if (tod === 'Nacht') {
      // Scheinwerfer nachts am Hang: Stelle mit Steigung 0,25–0,6 in Fahrtrichtung suchen, Wagen bergauf stellen, Folgekamera von hinten
      await swap(page, 'jetbound_roadster')
      const spot = await page.evaluate(() => { const g = window.__kfbM2.ground, c = window.__kfbM2.car().pos(); let best = null
        for (let k = 0; k < 3000; k++) { const a = k * 2.399963, r = 6 + 120 * Math.sqrt(k / 3000), x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r
          for (let j = 0; j < 8; j++) { const h = j * Math.PI / 4, s = (g(x + Math.sin(h) * 10, z + Math.cos(h) * 10) - g(x, z)) / 10, side = Math.abs(g(x + Math.cos(h) * 3, z - Math.sin(h) * 3) - g(x - Math.cos(h) * 3, z + Math.sin(h) * 3)) / 6
            if (s > 0.25 && s < 0.6 && side < 0.12 && (!best || Math.abs(s - 0.4) < Math.abs(best.s - 0.4))) best = { x, z, yaw: h, s } } }
        return best })
      res.hang = spot
      if (spot) { await page.evaluate((s) => window.__kfbM2.setKind('k2b', { p: [s.x, window.__kfbM2.ground(s.x, s.z) + 1.5, s.z], yaw: s.yaw }), spot); await page.waitForTimeout(3500)
        await page.evaluate(() => { const f = window.__kfbM2.stats.follow; f.orbit(0, 0.12) }); await page.waitForTimeout(1500); await page.screenshot({ path: OUT + 'hang-night.png' })
        await page.evaluate(() => { const f = window.__kfbM2.stats.follow; f.orbit(-1.2, 0.1) }); await page.waitForTimeout(1500); await page.screenshot({ path: OUT + 'hang-night-side.png' }) }
    } else {
      // Ferne-Aufhellung am echten Spielabstand: Standard-Abstand und ganz herausgezoomt (Folgekamera), Abstand und Umgebungslicht des Lacks
      await swap(page, 'graffiti_jet_cruiser'); await page.waitForTimeout(1000)
      res.far = {}
      for (const [tag, z] of [['near', 0], ['out', 4000]]) {
        if (z) { await page.mouse.move(640, 360); for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, z / 12); await page.waitForTimeout(80) } }
        await page.waitForTimeout(2000); await page.screenshot({ path: OUT + `far-${tag}.png` })
        res.far[tag] = await page.evaluate(() => { const M = window.__kfbM2; let ei = null; M.stats.rig?.stretch?.traverse((o) => { if (ei == null && o.isMesh && o.material?.userData?.vehicleLook) ei = +o.material.envMapIntensity.toFixed(3) }); return { ei, arm: +M.stats.follow.state.arm.toFixed(2), zoom: +M.stats.follow.state.zoom.toFixed(2) } })
      }
    }
    res.errs = (res.errs || []).concat(errs.slice(0, 3)); await browser.close()
  }
  // Kontaktbogen: je Racer ein Paar Tag | Nacht, zwei Paare je Zeile
  const HD = 24, comp = [], rows = Math.ceil(IDS.length / 2)
  for (let i = 0; i < IDS.length; i++) { const id = IDS[i], r = Math.floor(i / 2), c0 = (i % 2) * 2, a = RIG[id].headlights
    for (const [k, tod] of [[0, 'Tag'], [1, 'Nacht']]) { comp.push({ input: await sharp(tiles[id][tod]).extract({ left: 0, top: 60, width: 1280, height: 660 }).resize(TW, TH).png().toBuffer(), left: (c0 + k) * TW, top: r * (TH + HD) + HD })
      comp.push({ input: Buffer.from(`<svg width="${tod === 'Tag' ? 40 : 58}" height="22" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" rx="4" fill="rgba(0,0,0,.55)"/><text x="8" y="16" font-size="14" font-family="sans-serif" fill="#ffd400">${tod}</text></svg>`), left: (c0 + k) * TW + 6, top: r * (TH + HD) + HD + 6 }) }
    const lab = `${RIG[id].name_de} · ${CLASS(id)} · Scheinwerfer-Anker ${a.check ? 'im Rig-Studio prüfen' : 'ok'}`
    comp.push({ input: Buffer.from(`<svg width="${2 * TW}" height="${HD}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#15151b"/><text x="8" y="17" font-size="15" font-family="sans-serif" fill="#fff">${lab.replace(/&/g, '&amp;')}</text></svg>`), left: c0 * TW, top: r * (TH + HD) })
  }
  await sharp({ create: { width: 4 * TW, height: rows * (TH + HD), channels: 3, background: '#15151b' } }).composite(comp).png().toFile(OUT + 'sheet.png')
  fs.writeFileSync(OUT + 'sheet.json', JSON.stringify(res, null, 1))
  code = report('vehicles-r1 sheet (Kontaktbogen 14 × Tag/Nacht)', { allTiles: IDS.every((id) => tiles[id]?.Tag && tiles[id]?.Nacht), hangFound: !!res.hang, noPageErrors: !res.errs.length }, { sheet: OUT + 'sheet.png', far: res.far, hang: res.hang })
}

if (PART === 'clip') {
  const SEC = +(process.env.CLIP_SEC || 30)
  res.clips = {}
  for (const [cls, id] of [['rad-racer', 'jetbound_roadster'], ['laster', 'rustwing_hauler']]) {
    const { browser, page, errs } = await open(`,tod=night,racer=${id},mute`)
    const file = path.resolve(OUT + `clip-${cls}.webm`); fs.writeFileSync(file, Buffer.alloc(0))
    await page.exposeFunction('__saveClip', (b64) => fs.appendFileSync(file, Buffer.from(b64, 'base64')))
    await page.mouse.click(640, 400)
    await page.evaluate((SEC) => { const cv = document.querySelector('canvas'), rec = new MediaRecorder(cv.captureStream(30), { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 6e6 })
      rec.ondataavailable = async (e) => { const b = new Uint8Array(await e.data.arrayBuffer()); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); await window.__saveClip(btoa(s)) }
      window.__rec = rec; rec.start(1000); window.__fr = []; let last = performance.now(); (function f() { const n = performance.now(); window.__fr.push(n - last); last = n; if (rec.state === 'recording') requestAnimationFrame(f) })() }, SEC)
    // Fahrt: Gas, weite Kurven und ein Slalom, einmal Boost
    const t0 = Date.now(); await page.keyboard.down('KeyW'); let k = 0
    while (Date.now() - t0 < SEC * 1000) { const t = (Date.now() - t0) / 1000, key = Math.sin(t * 0.55) > 0.35 ? 'KeyA' : Math.sin(t * 0.55) < -0.35 ? 'KeyD' : null
      for (const x of ['KeyA', 'KeyD']) if (x !== key) await page.keyboard.up(x); if (key) await page.keyboard.down(key)
      if (t > 8 && t < 10) await page.keyboard.down('ShiftLeft'); else await page.keyboard.up('ShiftLeft'); await page.waitForTimeout(200); k++ }
    await page.keyboard.up('KeyW'); await page.keyboard.up('KeyA'); await page.keyboard.up('KeyD')
    const st = await page.evaluate(async () => { window.__rec.stop(); await new Promise((r) => setTimeout(r, 1500)); const f = window.__fr.slice(5).sort((a, b) => a - b); return { frames: f.length, medMs: +f[f.length >> 1].toFixed(1), p95Ms: +f[Math.floor(f.length * 0.95)].toFixed(1), car: window.__kfbM2.car().state(), hl: window.__kfbM2.headlights.n ? +(window.__kfbM2.headlights.ms / window.__kfbM2.headlights.n).toFixed(3) : null } })
    await page.screenshot({ path: OUT + `clip-${cls}-end.png` }); await browser.close()
    res.clips[cls] = { id, file: OUT + `clip-${cls}.webm`, bytes: fs.statSync(file).size, ...st, errs: errs.slice(0, 3) }; console.log(cls, JSON.stringify(res.clips[cls]))
  }
  fs.writeFileSync(OUT + 'clip.json', JSON.stringify(res, null, 1))
  code = report('vehicles-r1 clip (30 s je neuer Klasse)', { clipsWritten: Object.values(res.clips).every((c) => c.bytes > 200000), noPageErrors: Object.values(res.clips).every((c) => !c.errs.length) }, res.clips)
}

if (PART === 'fps') {
  const { browser, page, errs } = await open(',tod=night')
  await page.mouse.click(640, 400)
  const frames = (n = 120) => page.evaluate(async (n) => { const a = []; let t0 = performance.now(); for (let i = 0; i < n; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return { med: +a[n >> 1].toFixed(2), p95: +a[Math.floor(n * 0.95)].toFixed(2) } }, n)
  const setHl = (on) => page.evaluate((on) => { window.__kfbM2.headlights.inst?.setOn(on) }, on)
  res.fps = {}
  for (const id of IDS) {
    await swap(page, id); await page.waitForTimeout(1500)
    await page.keyboard.down('KeyW'); const A = { on: [], off: [] }
    for (let i = 0; i < 2; i++) for (const m of ['on', 'off']) { await setHl(m === 'on'); await page.waitForTimeout(300); A[m].push(await frames()) }
    await page.keyboard.up('KeyW'); await setHl(true)
    const med = (l, k) => +(l.map((x) => x[k]).sort((a, b) => a - b)[l.length >> 1]).toFixed(2)
    res.fps[id] = { on: { med: med(A.on, 'med'), p95: med(A.on, 'p95') }, off: { med: med(A.off, 'med'), p95: med(A.off, 'p95') }, hlMs: await page.evaluate(() => { const H = window.__kfbM2.headlights; return H.n ? +(H.ms / H.n).toFixed(3) : null }) }
    console.log(id, JSON.stringify(res.fps[id]))
  }
  await browser.close()
  const L = ['| Racer | Klasse | fps an (Median) | ms/Bild an (p95) | fps aus (Median) | ms/Bild aus (p95) | Scheinwerfer CPU ms |', '|---|---|---|---|---|---|---|']
  for (const id of IDS) { const f = res.fps[id]; L.push(`| ${RIG[id].name_de} | ${CLASS(id)} | ${(1000 / f.on.med).toFixed(0)} | ${f.on.p95} | ${(1000 / f.off.med).toFixed(0)} | ${f.off.p95} | ${f.hlMs} |`) }
  fs.writeFileSync(OUT + 'fps.md', `# fps-Tabelle V-631 (nachts, fahrend, 1280×720, Standard-Qualität, ${new Date().toISOString().slice(0, 16)})\n\nBildzeit über requestAnimationFrame (an die Bildwiederholrate gebunden), Median aus 2 × 120 Bildern, Scheinwerfer an/aus im Wechsel.\n\n${L.join('\n')}\n`)
  fs.writeFileSync(OUT + 'fps.json', JSON.stringify(res, null, 1))
  code = report('vehicles-r1 fps', { all14: Object.keys(res.fps).length === 14, noPageErrors: !errs.length }, { table: OUT + 'fps.md' })
}
if (PART === 'start') {
  const { browser, page, errs } = await openPage('#m1,debug,look=terrain3,world=probe,start,car,racer=brasswing_roadster', { viewport: { width: 1280, height: 720 } })
  await page.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK', null, { timeout: 240000 })
  const v0 = await page.$eval('#kfb-car', (e) => e.value), n = await page.$$eval('#kfb-car option', (o) => o.length)
  await page.selectOption('#kfb-car', 'rustwing_hauler')
  const swapped = await page.waitForFunction(() => window.__kfbM2.stats.modelId === 'rustwing_hauler' && window.__kfbM2.stats.model === 'OK', null, { timeout: 120000 }).then(() => true, () => false)
  const h1 = await page.evaluate(() => location.hash); await page.screenshot({ path: OUT + 'start-select.png' })
  // Fahrzeugfarbe: Standard Original, Klick auf Heldenfarbe merkt die Wahl und färbt den geladenen Racer um, Original wieder zurück
  const hero0 = await page.evaluate(() => ({ pressed: document.querySelector('[data-hero="0"]').getAttribute('aria-pressed'), on: window.__kfbM2.stats.hero?.on }))
  await page.click('[data-hero="1"]'); const heroUi = await page.waitForFunction(() => window.__kfbM2.stats.hero?.on === true && window.__kfbM2.stats.hero.applied + window.__kfbM2.stats.hero.skipped >= 1, null, { timeout: 60000 }).then(() => true, () => false)
  const stored1 = await page.evaluate(() => { try { return localStorage.getItem('kfb.heroColor') } catch (e) { return null } })
  await page.click('[data-hero="0"]'); await page.waitForTimeout(500); const stored0 = await page.evaluate(() => { try { return localStorage.getItem('kfb.heroColor') } catch (e) { return null } }), heroOffAgain = await page.evaluate(() => window.__kfbM2.stats.hero?.on === false)
  await page.selectOption('#kfb-car', ''); await page.waitForTimeout(3000); const h2 = await page.evaluate(() => location.hash)
  await browser.close()
  // Hash hero=1 (Tests): Heldenfarbe von Anfang an
  const H1 = await openPage('#m1,car,debug,look=terrain3,world=probe,hero=1,racer=crimson_flame_dragster', { viewport: { width: 960, height: 540 } })
  await H1.page.waitForFunction(() => window.__kfbM2?.stats?.model === 'OK', null, { timeout: 240000 }); const hashHero = await H1.page.evaluate(() => window.__kfbM2.stats.hero); await H1.browser.close()
  code = report('vehicles-r1 start (Fahrzeug-Wahl an der Startseite)', { listsFootPlus14: n === 15, preselected: v0 === 'brasswing_roadster', swapBehindCurtain: swapped && /racer=rustwing_hauler/.test(h1), footRemovesCar: !/(^|,)car(,|$)/.test(h2.slice(1)) && !/racer=/.test(h2), noPageErrors: !errs.length && !H1.errs.length,
    heroDefaultOriginal: hero0.pressed === 'true' && hero0.on === false, heroButtonOn: heroUi && stored1 === '1', heroButtonOff: heroOffAgain && stored0 === '0', hashHero1: hashHero?.on === true && hashHero.applied >= 1 }, { h1, h2, hero0, hashHero })
}
if (PART === 'vclay') {
  const RAC = ['crimson_flame_dragster', 'ironclad_skycruiser', 'wasteland_beetle'], TODS = [['Tag', ''], ['Gold', ',tod=gold']], shots = {}
  for (const [tod, th] of TODS) for (const [lab, vh] of [['Original', ',vclay=0'], ['Knete', ',vclay=1']]) {
    const { browser, page, errs } = await open(th + vh + ',prefetch=0', { width: 960, height: 540 }); await page.mouse.click(480, 300)
    for (const id of RAC) { await swap(page, id); await page.waitForTimeout(800); await page.evaluate(() => window.__kfbM2.stats.follow.orbit(0.55, 0.06))
      await page.keyboard.down('KeyW'); await page.waitForTimeout(1300); const f = `${OUT}shots/vclay-${id}-${tod}-${lab}.png`; await page.screenshot({ path: f }); await page.keyboard.up('KeyW'); await page.waitForTimeout(600)
      ;(shots[id + tod] ||= {})[lab] = f; await page.evaluate(() => window.__kfbM2.setKind('k2b', null)) }
    res.errs = (res.errs || []).concat(errs.slice(0, 2)); await browser.close() }
  const TW = 640, TH = 360, HD = 26, comp = []; let r = 0
  for (const id of RAC) for (const [tod] of TODS) { for (const [k, lab] of [[0, 'Original'], [1, 'Knete']]) comp.push({ input: await sharp(shots[id + tod][lab]).extract({ left: 0, top: 60, width: 960, height: 480 }).resize(TW, TH).png().toBuffer(), left: k * TW, top: r * (TH + HD) + HD })
    comp.push({ input: Buffer.from(`<svg width="${2 * TW}" height="${HD}" xmlns="http://www.w3.org/2000/svg"><text x="8" y="19" font-size="16" font-family="sans-serif" fill="#fff">${RIG[id].name_de} · ${tod}</text><text x="${TW - 80}" y="19" font-size="15" font-family="sans-serif" fill="#ffd400">Original</text><text x="${2 * TW - 70}" y="19" font-size="15" font-family="sans-serif" fill="#ffd400">Knete</text></svg>`), left: 0, top: r * (TH + HD) }); r++ }
  await sharp({ create: { width: 2 * TW, height: r * (TH + HD), channels: 3, background: '#15151b' } }).composite(comp).png().toFile(OUT + 'vclay-ab.png')
  code = report('vehicles-r1 vclay A/B (V-654 C5)', { allShots: Object.values(shots).every((x) => x.Original && x.Knete), noPageErrors: !res.errs.length }, { sheet: OUT + 'vclay-ab.png' })
}
process.exit(code)
