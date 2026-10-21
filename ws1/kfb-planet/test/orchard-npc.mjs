// WS-NPC Phase C P1 (V-583, Lead-OK 21.10. b–d) · Obstgarten-Erweiterungen im Spiel (#m1,debug,harvest):
//   b  taint(goblin, t4): hängende Kügelchen dunkel (Instanzfarbe Richtung #1f1a14), Abwurf über hitTree, Ruhe, dann Einsinken → 'sunk'; nie aufsammelbar;
//      Nachbarbaum unverändert
//   c  burst(pos, 6, seed, tag): sechs Sorten fallen, kommen zur Ruhe, sind aufsammelbar (Ernte-Stand +6); gleicher tag erneut → nichts Neues
//   d  addTarget + shoot: Projektil trifft ein bewegtes Ziel, onHit einmal; ohne Ziel trifft der Schuss weiter Bäume
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#m1,debug,harvest', { viewport: { width: 960, height: 600 } })
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK', null, { timeout: 300000 })
const wait = (ms) => page.waitForTimeout(ms)
// b
const b0 = await page.evaluate(() => { const O = window.__kfbM1.mods.orchard, mesh = O.object3d.getObjectByName('orchard-fluff'), c = new (window.__kfbM1.three().Color)()
  const all = O.balls(), lum = (k) => { const i = all.findIndex((b) => b.key === k); mesh.getColorAt(i, c); return c.r + c.g + c.b }
  const mine = all.filter((b) => b.state === 'hanging' && /:t4:/.test(b.key) && b.key.startsWith('goblin')).map((b) => b.key), other = all.filter((b) => b.state === 'hanging' && !/:t4:/.test(b.key)).map((b) => b.key)
  const before = Object.fromEntries([...mine, ...other].map((k) => [k, lum(k)]))
  const keys = O.taint('goblin', 't4', true)
  return { keys, mine, ratio: keys.map((k) => lum(k) / before[k]), otherSame: other.every((k) => lum(k) === before[k]), nOther: other.length, hit: O.hitTree('goblin', 't4', 'explosion')?.length ?? 0 } })
await wait(6500)
const b1 = await page.evaluate((keys) => { const O = window.__kfbM1.mods.orchard, st = Object.fromEntries(O.balls().map((b) => [b.key, b])); const resting = keys.filter((k) => st[k].state === 'resting')
  const got = resting.flatMap((k) => O.collectAt(st[k].p, 'walk')); return { states: keys.map((k) => st[k].state), got: got.length } }, b0.keys)
await wait(4500)
const b2 = await page.evaluate((keys) => { const O = window.__kfbM1.mods.orchard, st = Object.fromEntries(O.balls().map((b) => [b.key, b])); return { states: keys.map((k) => st[k].state) } }, b0.keys)
// c
const c0 = await page.evaluate(() => { const M = window.__kfbM1, O = M.mods.orchard, y = M.terrainH(4, 36) + 1.1; const before = Object.values(O.counts()).reduce((s, v) => s + v, 0)
  const keys = O.burst([4, y, 36], 6, 9, 'heal:test:d0'), again = O.burst([4, y, 36], 6, 9, 'heal:test:d0'); return { keys, again: again.length, before } })
await wait(6000)
const c1 = await page.evaluate((keys) => { const O = window.__kfbM1.mods.orchard, st = Object.fromEntries(O.balls().map((b) => [b.key, b])); const kinds = keys.map((k) => st[k].kind)
  const resting = keys.filter((k) => st[k].state === 'resting').length; let got = 0; for (const k of keys) if (st[k].state === 'resting') got += O.collectAt(st[k].p, 'walk').length
  return { kinds, resting, got, after: Object.values(O.counts()).reduce((s, v) => s + v, 0) } }, c0.keys)
// d
const d0 = await page.evaluate(async () => { const M = window.__kfbM1, O = M.mods.orchard, hits = []; let x = -2; const z = 10, y = M.terrainH(-2, 10) + 0.8
  const off = O.addTarget({ id: 'ghost-test', r: 0.6, pos: () => [x, y, z], onHit: (id) => hits.push(id) })
  const t0 = performance.now(), mover = setInterval(() => { x = -2 + Math.sin((performance.now() - t0) / 400) * 1.5 }, 16)
  const r = O.shoot([-2, M.terrainH(-2, 18), 18], [0, 0, -1])
  await new Promise((res) => setTimeout(res, 2500)); clearInterval(mover); off()
  const after = O.shoot([-2, M.terrainH(-2, 18), 18], [0, 0, -1]) // ohne Ziel: Baum oder nichts im Kegel, nie das abgemeldete Ziel
  return { r, hits, after, stats: O.stats().targetHits } })
await browser.close()
const rMax = Math.max(...b0.ratio)
process.exit(report('orchard-npc (taint, burst, Ziele – WS-NPC Phase C)', {
  b_taintDarkensOnlyThisTree: b0.keys.length > 0 && b0.keys.length === b0.mine.length && rMax < 0.45 && b0.otherSame && b0.nOther > 20,
  b_dropsOverHitTree: b0.hit === b0.keys.length,
  b_restingNotCollectable: b1.got === 0 && b1.states.some((s) => s === 'resting' || s === 'sunk'),
  b_sinksAfterRest: b2.states.every((s) => s === 'sunk'),
  c_burstSixKinds: c0.keys.length === 6 && new Set(c1.kinds).size === 6,
  c_burstOnceOnly: c0.again === 0,
  c_restsAndCollectable: c1.resting === 6 && c1.got === 6 && c1.after === c0.before + 6,
  d_targetHitOnce: d0.r?.target === 'ghost-test' && d0.hits.length === 1 && d0.stats === 1,
  d_unregisteredNotHit: !d0.after || d0.after.target == null,
  noPageErrors: errs.length === 0,
}, { b0: { n: b0.keys.length, rMax: +rMax.toFixed(3), otherSame: b0.otherSame, nOther: b0.nOther, hit: b0.hit }, b1, b2, c0, c1, d0, errs: errs.slice(0, 3) }))
