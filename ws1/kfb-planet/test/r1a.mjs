// R1a (V-481) · Antriebe an Georgs Racern im Spiel (#m1,car,racer=<id>): Dragster (Düsenbündel), Panzer-Gleiter (Lüfter), Thunderjet (8 Düsen + 2 Lüfter).
// Prüft je Racer: Antriebs-Modul hängt am Modell (Anker-Zahl = Daten, jeder Anker innerhalb der Modell-Hülle + 15 %), Leerlauf schwach, Gas → Schub > 0,8 und
// Hochschalten, Boost → längere Fahne + Stauchen/Strecken (surge), Bildrate des Moduls (update-Kosten). Bilder: Heck unter Vollgas → test/out/r1a/r1a-sheet.png.
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/r1a', { recursive: true })
const RIG = JSON.parse(fs.readFileSync('src/data/vehicles/kfb-vehicle-rig.r1.json', 'utf8'))
const RACERS = (process.argv[2] || 'crimson_flame_dragster,ironclad_skycruiser,crimson_thunderjet').split(',')
const res = {}, shots = []
for (const id of RACERS) {
  const { browser, page, errs } = await openPage(`#m1,car,debug,racer=${id}`, { viewport: { width: 960, height: 540 } })
  await page.waitForFunction(() => window.__kfbM2?.stats?.rig && window.__kfbM1?.status().amphTris > 0, null, { timeout: 300000 }).catch(() => {})
  await page.waitForTimeout(1500)
  const r = await page.evaluate(async () => {
    const M = window.__kfbM1, M2 = window.__kfbM2, R = M2.stats.rig; if (!R) return { err: 'kein Rig' }
    const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms)), info0 = R.info()
    let model = null; R.stretch.traverse((o) => { if (!model && o.isMesh) model = o }); const V = window.__kfbStageCamera ? window.__kfbStageCamera.position.constructor : null
    const box = (() => { const b = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] }; R.stretch.traverse((o) => { if (!o.isMesh || /anchor:|vehicle-rig/.test(o.parent?.name || '')) return; o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld); for (let k = 0; k < 3; k++) { b.min[k] = Math.min(b.min[k], ['x', 'y', 'z'].map((a) => bb.min[a])[k]); b.max[k] = Math.max(b.max[k], ['x', 'y', 'z'].map((a) => bb.max[a])[k]) } }); return b })()
    const inside = []; for (let i = 0; i < info0.anchors; i++) { const p = R.anchorWorld(i); const pad = (box.max[0] - box.min[0]) * 0.15; inside.push([p.x, p.y, p.z].every((v, k) => v >= box.min[k] - pad && v <= box.max[k] + pad)) }
    const idle = R.info().thrust
    M.input({ forward: true }); await sleep(3500); const full = R.info()
    M.input({ forward: true, run: true }); await sleep(250); const sz = R.info().stretch; await sleep(1200); const boost = R.info()
    M.input(null); await sleep(600)
    const t = performance.now(); for (let i = 0; i < 300; i++) R.update(1 / 60, { throttle: 1, speed01: 0.6 }); const ms = (performance.now() - t) / 300
    return { anchors: info0.anchors, drawCalls: info0.drawCalls, inside, idle, full: { thrust: full.thrust, gear: full.gear, rpm: full.rpm }, boost: { boost: boost.boost, surge: boost.events.surge, stretch: sz }, updateMs: +ms.toFixed(4), speed: M2.car()?.speed?.() ?? null }
  }).catch((e) => ({ err: String(e.message || e) }))
  // Heckbild unter Vollgas (Folgekamera hinter dem Wagen)
  await page.evaluate(() => window.__kfbM1.input({ forward: true })); await page.waitForTimeout(1600); shots.push({ id, png: await page.screenshot() }); await page.evaluate(() => window.__kfbM1.input(null))
  res[id] = { ...r, errs: errs.length }; console.log(id, JSON.stringify(res[id]).slice(0, 400)); await browser.close()
}
const tiles = await Promise.all(shots.map((s) => sharp(s.png).resize(640, 360).png().toBuffer()))
if (tiles.length) await sharp({ create: { width: 640 * tiles.length, height: 360, channels: 3, background: '#222' } }).composite(tiles.map((b, i) => ({ input: b, left: i * 640, top: 0 }))).png().toFile('test/out/r1a/r1a-sheet.png')
fs.writeFileSync('test/out/r1a/r1a.json', JSON.stringify(res, null, 1))
const all = (f) => RACERS.every((id) => !res[id].err && f(res[id], id))
process.exit(report('r1a racer engines (V-481)', {
  rigOnEachRacer: all((r, id) => r.anchors === RIG.vehicles[id].anchors.length),
  anchorsSitOnModel: all((r) => r.inside.every(Boolean)),
  idleLow: all((r) => r.idle <= 0.2),
  throttleFull: all((r) => r.full.thrust > 0.8),
  shiftsUp: all((r) => r.full.gear >= 2),
  boostAndSurge: all((r) => r.boost.boost > 0.5 && r.boost.surge >= 1),
  moduleCheap: all((r) => r.updateMs < 0.5),
  sheetWritten: fs.existsSync('test/out/r1a/r1a-sheet.png'),
  noPageErrors: all((r) => r.errs === 0),
}, { res }))
