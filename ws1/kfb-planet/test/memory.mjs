// WS-NPC Phase B (V-585) · Lean Memory im Spiel (#m1,debug,harvest,npc,fluffer), Weltstand kfb.world-save/1 im echten localStorage, mit Neuladen der Seite:
//   Sitzung 1  der Lorekeeper-Platzhalter kommt am Fluffer vorbei (plague_seen, gesehen), der Fluffer wird geheilt, er steht nah dabei (fluffer_cured,
//              gesehen); Farmer B ist weit weg und hat keinen Beleg davon. Danach trifft der Spieler den Lorekeeper → er jubelt (Cheering, Grund cure).
//   Neu laden  (ohne npcfresh): Gedächtnis geladen, gleiche Belege; der Spieler trifft den Lorekeeper → Begrüßung wieder Cheering; Belege ohne Doppel;
//              Weltstand unter eigenem Schlüssel, der Spielstand kfb.save/1 enthält kein NPC-Gedächtnis.
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
import { report } from './_page.mjs'
const CHROMIUM = process.env.PW_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)
const browser = process.env.PW_GPU ? await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }) : await chromium.launch({ executablePath: CHROMIUM, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
const ctx = await browser.newContext({ viewport: { width: 1000, height: 640 } }), page = await ctx.newPage(), errs = []
page.on('pageerror', (e) => errs.push(e.message))
const url = (h) => 'file://' + path.resolve('dist/index.html') + h
const ready = () => page.waitForFunction(() => window.__kfbM1?.fluffer?.()?.status.status === 'OK' && window.__kfbM1.npc?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK', null, { timeout: 300000 })
const now = () => page.evaluate(() => window.__kfbM1.clock.t)
const waitT = async (t) => { for (let i = 0; i < 3000; i++) { if ((await now()) >= t) return; await page.waitForTimeout(150) } }
const mem = () => page.evaluate(() => window.__kfbM1.npc().memory)
// Spieler neben den Lorekeeper stellen und Begrüßung lesen (Grund + gespielter Clip)
const greetLk = async () => { await page.evaluate(() => { const M = window.__kfbM1, d = M.npc().debug.find((x) => x.id === 'lore_ph'); M.player().teleport([d.x + 1.5, M.terrainH(d.x + 1.5, d.z + 1) + 1.2, d.z + 1], Math.PI) })
  for (let i = 0; i < 40; i++) { await page.waitForTimeout(150); const d = await page.evaluate(() => window.__kfbM1.npc().debug.find((x) => x.id === 'lore_ph')); if (d.mode === 'player') { await page.waitForTimeout(400); const pl = await page.evaluate(() => window.__kfbM1.npc().played.filter(([id]) => id === 'lore_ph').map(([, c]) => c)); return { why: d.greetWhy, last: pl.at(-1) } } }
  return { why: null } }
// Sitzung 1
await page.goto(url('#m1,debug,harvest,npc,fluffer,fluffert=2,npct=509,npcfresh')); await ready()
await page.evaluate(() => { const M = window.__kfbM1; M.player().teleport([-4, M.terrainH(-4, 54) + 1.2, 54], Math.PI) }) // in der Spielerblase (Reaktionen nur dort), abseits der Wege
let healedAt = null
for (let i = 0; i < 1200 && healedAt === null; i++) { await page.waitForTimeout(120)
  const s = await page.evaluate(() => { const M = window.__kfbM1, d = M.npc().debug.find((x) => x.id === 'lore_ph'), f = M.fluffer().debug; return { alerts: d.stats.alerts, mode: d.mode, x: d.x, z: d.z, fx: f.x, fz: f.z, target: !f.healed && f.phase !== 'gone' } })
  if (s.alerts > 0 && s.mode !== 'threat' && s.target) { // der Spieler heilt den Fluffer von hinten, der Lorekeeper steht in der Nähe
    healedAt = await page.evaluate(async () => { const M = window.__kfbM1, f = M.fluffer().debug; M.player().teleport([f.x + 4, M.terrainH(f.x + 4, f.z + 4) + 1.2, f.z + 4], Math.PI); await new Promise((r) => setTimeout(r, 500))
      const p = M.feet(), dx = f.x - p[0], dz = f.z - p[2], l = Math.hypot(dx, dz); M.mods.orchard.shoot(p, [dx / l, 0, dz / l]); await new Promise((r) => setTimeout(r, 1500)); return M.fluffer().debug.healed ? M.clock.t : null }) } }
const m1 = await mem()
const g1 = await greetLk()
const ls1 = await page.evaluate(() => ({ ws: localStorage.getItem('kfb.world-save'), save: localStorage.getItem('kfb.save') }))
// Neu laden ohne npcfresh
await page.goto(url('#m1,debug,harvest,npc,npct=509')); await page.reload(); await page.waitForFunction(() => window.__kfbM1?.npc?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK', null, { timeout: 300000 })
const m2 = await mem()
const g2 = await greetLk()
const m3 = await mem()
await browser.close()
const R = (m) => m.receipts.map((e) => `${e.residentId}:${e.kind}:${e.mode}`)
const ids = (m) => m.receipts.map((e) => e.id)
process.exit(report('memory (WS-NPC Phase B im Spiel, Weltstand + Neuladen)', {
  s1_witnessSawPlagueAndCure: healedAt !== null && R(m1).includes('lore_ph:plague_seen:observed') && R(m1).includes('lore_ph:fluffer_cured:observed'),
  s1_farAwayNoReceipt: !R(m1).some((x) => x.startsWith('farmer_b:fluffer_cured') || x.startsWith('farmer_b:plague_seen')),
  s1_greetingChanged: g1.why === 'cure' && g1.last === 'Cheering',
  reload_memoryLoaded: m2.status === 'loaded' && JSON.stringify(ids(m1).filter((i) => ids(m2).includes(i))) === JSON.stringify(ids(m1).filter(Boolean)) ,
  reload_greetingKept: g2.why === 'cure' && g2.last === 'Cheering',
  reload_noDuplicates: new Set(ids(m3)).size === ids(m3).length,
  worldSaveSeparate: !!ls1.ws && JSON.parse(ls1.ws).schema === 'kfb.world-save/1' && !(ls1.save || '').includes('receipts'),
  noPageErrors: errs.length === 0,
}, { healedAt, m1: R(m1), m2: R(m2).length, g1, g2, errs: errs.slice(0, 3) }))
