// C3 (V-423, Langlauf R2 Stufe 3) · Fluff-Ernte in der Laufwelt (#m1,harvest): drei Zonen (goblin Faust, atlantis Schuss, utopia Explosion), Bäume aus dem
// KayKit Forest Pack mit Fluff nach Grammatik R2. Prüft im Browser: Bäume geladen, Kügelchen je Zone, Treffer je Baum nach Waffe (3/2/1 ± Zähigkeit),
// Schuss über echtes Projektil (shoot), alle Kügelchen kommen zur Ruhe, Einsinken 0 gegen die gerenderte Geländefläche, Ruhezeit, Aufsammeln + kfb.save/1
// (Zähler je Sorte = gesammelte Kügelchen, Speichern ok), Kosten des Moduls je Bild und Draw Calls. Bildreihe test/out/c3/c3-sheet.png (vorher / Treffer / Ruhe).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/c3', { recursive: true })
const { browser, page, errs } = await openPage('#m1,debug,harvest,cards=1', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK', null, { timeout: 300000 })
await page.waitForTimeout(1500)
await page.waitForTimeout(1500) // Texturen nachladen lassen
const t0 = await page.evaluate(() => { const O = window.__kfbM1.mods.orchard; let tm = 0, tx = 0; O.object3d.traverse((m) => { if (m.isMesh && /^tree:/.test(m.parent?.name || m.name || '') || (m.isMesh && m.name !== 'orchard-fluff' && m.material?.map !== undefined)) { tm++; if (m.material?.map?.image?.width > 0) tx++ } })
  return { stats: O.stats(), trees: O.trees(), balls: O.balls().length, treeTex: { meshes: tm, textured: tx } } })
// Vorher-Bild aus Spielerkamera (Spieler an den goblin-Garten gesetzt)
await page.evaluate(() => { const M = window.__kfbM1, t = M.mods.orchard.trees().find((x) => x.zone === 'goblin' && x.id === 't0')
  M.player().teleport([t.pos[0] + 2.4, t.pos[1] + 1.2, t.pos[2] + 4.2], Math.PI) })
await page.waitForTimeout(2500); const shotA = await page.screenshot()
// Treffer: goblin = Faust je Baum bis leer, atlantis = erster Baum über echtes Projektil (shoot), Rest per Schuss-Treffer, utopia = Explosion
const hits = await page.evaluate(async () => {
  const O = window.__kfbM1.mods.orchard, out = { goblin: [], atlantis: [], utopia: [], projectile: null }, W = { goblin: 'punch', atlantis: 'shot', utopia: 'explosion' }
  const at = (z, id) => O.trees().find((t) => t.zone === z && t.id === id)
  { const t = at('atlantis', 't0'), p = [t.pos[0] - 12, t.pos[1], t.pos[2]]; const r = O.shoot(p, [1, 0, 0]); await new Promise((res) => setTimeout(res, 1500)); out.projectile = { aimed: r?.tree, hitsAfter: r ? at('atlantis', r.tree).hits : 0 } }
  for (const z of ['goblin', 'atlantis', 'utopia']) for (const t of O.trees().filter((x) => x.zone === z)) {
    let n = at(z, t.id).hits; while (at(z, t.id).left > 0 && n < 12) { O.hitTree(z, t.id, W[z]); n++; await new Promise((res) => setTimeout(res, 60)) }
    out[z].push({ id: t.id, model: t.model, hits: at(z, t.id).hits, L: at(z, t.id).L })
  }
  return out
})
await page.waitForTimeout(400); const shotB = await page.screenshot()
// Ruhe abwarten (echte Zeit, Modul läuft im Bildtakt)
const settled = await page.waitForFunction(() => window.__kfbM1.mods.orchard.stats().zones.every((z) => z.falling === 0 && z.hanging === 0), null, { timeout: 120000 }).then(() => true).catch(() => false)
const rest = await page.evaluate(() => {
  const M = window.__kfbM1, O = M.mods.orchard, H = (x, z) => M.mods.terrain.surfaceAt(x, z)
  const sink = O.balls().filter((b) => b.state === 'resting').map((b) => H(b.p[0], b.p[2]) + b.r - b.p[1])
  return { stats: O.stats(), maxSinkMesh: Math.max(...sink), restingN: sink.length }
})
const shotC = await page.screenshot()
// Aufsammeln: Sammler an jedes liegende Kügelchen (wie Drüberlaufen), Zähler je Sorte und Spielstand
const col = await page.evaluate(() => {
  const M = window.__kfbM1, O = M.mods.orchard, before = O.balls().filter((b) => b.state === 'resting')
  const byKind = {}; for (const b of before) byKind[b.kind] = (byKind[b.kind] || 0) + 1
  let got = 0; for (const b of before) got += O.collectAt([b.p[0], b.p[1] - b.r, b.p[2]]).length
  const raw = (() => { try { return JSON.parse(localStorage.getItem('kfb.save')) } catch { return null } })()
  return { resting: before.length, got, byKind, counts: O.counts(), left: O.balls().filter((b) => b.state !== 'collected').length, saved: !!raw, savedCollected: raw?.state?.collected?.length ?? raw?.collected?.length ?? null }
})
// Kosten je Bild: Modul-update gemessen (200 Aufrufe), Draw Calls der Szene
const perf = await page.evaluate(() => { const O = window.__kfbM1.mods.orchard, t = performance.now(); for (let i = 0; i < 200; i++) O.update(1 / 60); return { updateMs: (performance.now() - t) / 200 } })
await browser.close()
const W = 640, H = 360
const tiles = await Promise.all([shotA, shotB, shotC].map((b) => sharp(b).resize(W, H).png().toBuffer()))
await sharp({ create: { width: W * 3, height: H, channels: 3, background: '#222' } }).composite(tiles.map((b, i) => ({ input: b, left: i * W, top: 0 }))).png().toFile('test/out/c3/c3-sheet.png')
const zoneN = Object.fromEntries(t0.stats.zones.map((z) => [z.zone, z.hanging + z.resting]))
const mean = (a) => a.reduce((s, x) => s + x.hits, 0) / a.length
const summary = { treeTex: t0.treeTex, trees: t0.stats.trees, balls: t0.balls, zoneN, hitsMean: { goblin: mean(hits.goblin), atlantis: mean(hits.atlantis), utopia: mean(hits.utopia) }, projectile: hits.projectile,
  restMean: rest.stats.zones.map((z) => +z.restMean.toFixed(2)), restMax: rest.stats.zones.map((z) => +z.restMax.toFixed(2)), maxSinkMesh: +rest.maxSinkMesh.toFixed(4), collected: col, updateMs: +perf.updateMs.toFixed(3) }
fs.writeFileSync('test/out/c3/c3.json', JSON.stringify({ summary, hits, rest, col }, null, 1))
process.exit(report('c3 fluff harvest (V-423)', {
  treesLoaded: t0.stats.status === 'OK' && t0.stats.loaded === t0.stats.trees && t0.stats.trees === 15,
  treesTextured: t0.treeTex.meshes > 0 && t0.treeTex.textured === t0.treeTex.meshes, // forest_texture.png geladen (sonst weiße Bäume)
  ballsPerZone: Object.values(zoneN).every((n) => n >= 20),
  punchAbout3: hits.goblin.every((t) => t.hits >= 2 && t.hits <= 4),
  shotAbout2: hits.atlantis.every((t) => t.hits >= 1 && t.hits <= 3),
  explosionOne: hits.utopia.every((t) => t.hits === 1),
  projectileHits: !!hits.projectile?.aimed && hits.projectile.hitsAfter >= 1, // Projektil fliegt zum nächsten Baum im Blickkegel und trifft bei Ankunft
  allSettled: settled && rest.stats.zones.every((z) => z.timedOut === 0),
  restWithin5s: rest.stats.zones.every((z) => z.restMax <= 5),
  sinkZero: rest.maxSinkMesh <= 1e-3 && rest.stats.zones.every((z) => z.maxSink <= 1e-6),
  collectedAll: col.left === 0 && col.got === col.resting,
  countsMatch: Object.entries(col.byKind).every(([k, n]) => (col.counts[k] || 0) >= n),
  savedToKfbSave: col.saved,
  moduleCheap: perf.updateMs < 2,
  noPageErrors: errs.length === 0,
}, { summary, errs: errs.slice(0, 3) }))
