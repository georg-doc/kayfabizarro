// #439 world=probe · Parität der Höhenfunktion: createProbeHeight (src/world/probeHeight.js, erzeugt von probe/port/gen_height.py) gegen window.__hgt der
// Gelände-Probe an 500 festen Punkten, Grenze max |Δ| ≤ 1e-6 m.
//   golden : immer – Bezugswerte aus test/fixtures/probe-height.golden.json (vom Generator aus der laufenden Probe geholt), mit und ohne Anker der Probe
//   live   : wenn http://localhost:8751/ antwortet – Probe in frischem Chromium, Rezept über „Rezept übernehmen“, Flüsse aus, Wasser 0, dieselben Punkte;
//            zusätzlich „Tafelberge“ (Tafelkante + Terrassen, GZERO aus) und „Sanfte Hügel“ mit Wasser 0,06 (Uferböschung). Ohne Server: übersprungen, gemeldet.
//   mapping: Schieberegler-Rundung und Startwerte einer frischen Probe; Flusshaken; Standardwelt bitgleich zum Stand vor world=probe (a701da4)
import fs from 'fs'
import { createHash } from 'crypto'
import { report, readJson } from './_report.mjs'
import { createProbeHeight } from '../../src/world/probeHeight.js'
import { createTerrain, terrainHeight } from '../../src/modules/m1-terrain.js'

const TOL = 1e-6, URL = process.env.KFB_PROBE_URL || 'http://localhost:8751/'
const recipe = readJson('src/data/worlds/kfb-world-probe.r1.json'), G = readJson('test/fixtures/probe-height.golden.json')
const maxD = (H, ref) => G.points.reduce((m, [x, z], i) => Math.max(m, Math.abs(H(x, z) - ref[i])), 0)

// golden
const gNo = maxD(createProbeHeight(recipe).height, G.noAnchors), gAn = maxD(createProbeHeight(recipe, { anchors: G.anchors }).height, G.withAnchors)

// live (nur mit laufender Probe)
let live = 'skip: ' + URL + ' nicht erreichbar'
const up = await fetch(URL, { signal: AbortSignal.timeout(3000) }).then((r) => r.ok).catch(() => false)
if (up) {
  const { chromium } = await import('playwright')
  const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
  try {
    const p = await b.newPage({ viewport: { width: 900, height: 600 } }), errs = []; p.on('pageerror', (e) => errs.push(e.message))
    await p.goto(URL); await p.waitForFunction(() => window.__hgt && window.__S && window.__OT && document.getElementById('recipe')?.value?.length > 0, null, { timeout: 90000 })
    const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
    const sample = () => p.evaluate((pts) => { const anchors = __OT.DIOS.filter((a) => a.on).map((a) => JSON.parse(JSON.stringify(a))), withA = pts.map(([x, z]) => __hgt(x, z))
      const was = __OT.DIOS.map((a) => a.on); __OT.DIOS.forEach((a) => { a.on = false }); const noA = pts.map(([x, z]) => __hgt(x, z)); __OT.DIOS.forEach((a, i) => { a.on = was[i] })
      return { anchors, withA, noA, S: { rivers: __S.rivers, water: __S.water, amp: __S.amp, steps: __S.steps, plateau: __S.plateau } } }, G.points)
    const cmp = (r, rc, o = {}) => ({ noAnchors: maxD(createProbeHeight(rc, o).height, r.noA), withAnchors: maxD(createProbeHeight(rc, { ...o, anchors: r.anchors }).height, r.withA), anchors: r.anchors.length, S: r.S })
    // 1 · Spiel-Rezept über die Oberfläche der Probe
    await p.evaluate((txt) => { const t = document.getElementById('recipe'); t.value = txt; t.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('rcApply').click() }, JSON.stringify(recipe, null, 2))
    await set('rivers', false); await set('water', '0'); await p.waitForTimeout(600)
    const r1 = await sample(), game = cmp(r1, recipe)
    // 2 · Tafelberge (Vorlage, Wasser 0): Tafelkante und Terrassen brauchen gG → GZERO aus
    await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Tafelberge').click()); await set('rivers', false); await set('water', '0'); await p.waitForTimeout(600)
    const rcT = JSON.parse(await p.evaluate(() => document.getElementById('recipe').value)), tafel = cmp(await sample(), rcT)
    // 3 · Sanfte Hügel mit Wasser 0,06 (Uferböschung, Fluid Island Kit = Grundwert)
    await p.evaluate(() => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === 'Sanfte Hügel').click()); await set('rivers', false); await set('water', '0.06'); await p.waitForTimeout(600)
    const rcW = JSON.parse(await p.evaluate(() => document.getElementById('recipe').value)), wet = cmp(await sample(), rcW, { fluid: await p.evaluate(() => __S.fluid) })
    live = { game, tafel, wet, errs: errs.slice(0, 3) }
  } finally { await b.close() }
}

// mapping: Regler-Rundung (0,333 → 0,33; 7,4 → 7), fehlende Angaben = Startvorlage einer frischen Probe (Tafelberge), Flusshaken
const odd = createProbeHeight({ ...recipe, form: { ...recipe.form, ridge: 0.333, octaves: 7.4, height: undefined } }).settings
const mapOk = odd.ridge === 0.33 && odd.oct === 7 && odd.amp === 62 && odd.water === 0 && odd.ether === true
const N = 512, data = new Float32Array(N * N * 4); for (let j = 250; j < 262; j++) for (let i = 250; i < 262; i++) { const k = (j * N + i) * 4; data[k] = 0; data[k + 1] = 1; data[k + 2] = 1 }
const plain = createProbeHeight(recipe), riv = createProbeHeight(recipe, { riverField: { N, size: 1024, ox: -512, oz: -512, data } })
const rivOk = Math.abs(riv.height(0, 0)) < 1e-9 && plain.height(0, 0) > 1 && riv.height(200, 200) === plain.height(200, 200)
// Standardwelt: Netz, Kollider, height/surfaceAt und info bitgleich zum Stand a701da4 (vor world=probe); terrain3/terrain2 ebenso
const dig = (T) => { const d = T.colliderData(), h = createHash('sha256'); h.update(Buffer.from(d.vertices.buffer)); h.update(Buffer.from(d.indices.buffer))
  const s = []; for (let k = 0; k < 2000; k++) { const x = Math.sin(k * 1.7) * 170, z = Math.cos(k * 2.3) * 170; s.push(T.height(x, z), T.surfaceAt(x, z)) } h.update(Buffer.from(new Float64Array(s).buffer)); const { ink, ...inf } = T.info(); h.update(JSON.stringify(inf)); T.dispose()   /* ink (WS-NPC Tusche-Flecken, Merge ws1/mvp-r1) ist ein Statusfeld, kein Weltwert */; return h.digest('hex').slice(0, 24) }
const th = createHash('sha256'); for (let k = 0; k < 5000; k++) th.update(String(terrainHeight(Math.sin(k) * 200, Math.cos(k * 1.1) * 200)))
const digs = [dig(createTerrain({})), dig(createTerrain({ look: 'terrain3' })), dig(createTerrain({ look: 'terrain2', world: 'canyon' })), th.digest('hex').slice(0, 12)]
const DIG_A701 = ['dfd5c6cbe967c2e6db83a87b', 'dfd5c6cbe967c2e6db83a87b', 'f8d9a72f5d43b32bffdf0bd5', '100bbf064f60']

const L = typeof live === 'object' ? live : null, liveOk = (c) => c.noAnchors <= TOL && c.withAnchors <= TOL
process.exit(report('probeHeight', {
  goldenNoAnchors: gNo <= TOL,
  goldenWithAnchors: gAn <= TOL && G.anchors.length > 0,
  goldenPoints500: G.points.length === 500,
  liveGameRecipe: !L || (liveOk(L.game) && L.game.S.rivers === false && L.game.S.water === 0),
  liveTafelberge: !L || (liveOk(L.tafel) && L.tafel.S.steps >= 1 && L.tafel.S.plateau < 1),
  liveWaterBank: !L || liveOk(L.wet),
  liveNoPageErrors: !L || L.errs.length === 0,
  recipeMapping: mapOk,
  riverHook: rivOk,
  defaultWorldUnchanged: digs.every((d, i) => d === DIG_A701[i]),
}, { golden: { noAnchors: gNo, withAnchors: gAn, anchors: G.anchors.map((a) => a.kind || 'amph') }, live, digs }))
