// C3/C3b · Knet-Beweisvideo Fluff-Ernte + Fundsachen-Demo (Gate Langlauf R2 Stufe 3, Brief Fundsachen-Demo: 20–30 s, ein Aufheben, ein Wegwerfen): Laufwelt #m1,harvest, Spieler am goblin-Garten, drei Fausthiebe gegen einen Baum
// (gestaffelt 1–2 → 3–4 → Rest), Kügelchen springen, rollen und liegen, Einsammeln durch Drüberlaufen; vorher Wiese mit Fundsachen, Aufheben (I), Rucksack,
// Wegwerfen. Ausgabe test/out/c3/clip.webm (Playwright-Aufnahme, 1280×720).
// node scripts/c3/clip.mjs
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
fs.mkdirSync('test/out/c3/video', { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: 'test/out/c3/video', size: { width: 1280, height: 720 } } })
// Vorlauf: eine erste Seite wärmt den Cache (Assets von raw), ihr Video wird verworfen; die zweite Seite startet dann zügig
const URL0 = 'file://' + path.resolve('dist/index.html') + '#m1,debug,harvest,cards=1', ready = (p) => p.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK' && window.__kfbM1.mods.found?.stats().status === 'OK', null, { timeout: 300000 })
const warm = await ctx.newPage(); await warm.goto(URL0); await ready(warm); const wv = warm.video(); await warm.close(); try { fs.rmSync(await wv.path()) } catch {}
const page = await ctx.newPage()
await page.goto(URL0); await ready(page); await page.waitForTimeout(800)
const go = (zone, id, dx, dz, yaw) => page.evaluate(({ zone, id, dx, dz, yaw }) => { const M = window.__kfbM1, t = M.mods.orchard.trees().find((x) => x.zone === zone && x.id === id); M.player().teleport([t.pos[0] + dx, t.pos[1] + 1.2, t.pos[2] + dz], yaw); return t }, { zone, id, dx, dz, yaw })
const hit = (zone, w) => page.evaluate(({ zone, w }) => { const M = window.__kfbM1, t = M.mods.orchard.trees().find((x) => x.zone === zone && x.id === 't0'), p = M.feet()
  const d = [t.pos[0] - p[0], 0, t.pos[2] - p[2]], l = Math.hypot(d[0], d[2]) || 1; return M.mods.orchard[w](p, [d[0] / l, 0, d[2] / l]) }, { zone, w })
// 1) Wiese: an den Fundsachen vorbei (Spieler läuft per Eingabe), 2) Aufheben mit I, 3) Rucksack öffnen, Wegwerfen, 4) Baum schlagen, Fluff fällt, einsammeln
const it0 = await page.evaluate(() => { const M = window.__kfbM1, it = M.mods.found.items().find((i) => i.here && /^wiese/.test(i.key)); M.player().teleport([it.x - 3.5, it.ground + 1.2, it.z + 3.5]); return it })
await page.waitForTimeout(1500)
await page.evaluate(() => window.__kfbM1.input({ forward: 1 })); await page.waitForTimeout(1800); await page.evaluate(() => window.__kfbM1.input(null))
await page.evaluate((it) => window.__kfbM1.player().teleport([it.x + 0.5, it.ground + 1.2, it.z + 0.5]), it0); await page.waitForTimeout(1200)
await page.keyboard.press('KeyI'); await page.waitForTimeout(1500)
await page.evaluate(() => window.__kfbM1.harvest().hud.openBag()); await page.waitForTimeout(2200)
await page.evaluate(() => window.__kfbM1.harvest().hud.throwItem(0)); await page.waitForTimeout(2000)
await go('goblin', 't0', 0, 2.2, 0); await page.waitForTimeout(1500)
for (let i = 0; i < 3; i++) { await hit('goblin', 'punch'); await page.waitForTimeout(1500) }
await page.waitForTimeout(2500)
// Einsammeln: Spieler über die liegenden Kügelchen (Sammler im Bildtakt, Fluff springt in die R5f-Leiste)
const spots = await page.evaluate(() => window.__kfbM1.mods.orchard.balls().filter((b) => b.state === 'resting' && /^goblin/.test(b.key)).map((b) => b.p))
for (const p of spots.slice(0, 24)) { await page.evaluate((p) => window.__kfbM1.player().teleport([p[0], p[1] + 0.6, p[2]]), p); await page.waitForTimeout(140) }
await page.waitForTimeout(1500)
const counts = await page.evaluate(() => window.__kfbM1.mods.orchard.counts())
const v = page.video(); await ctx.close(); const src = await v.path(); fs.copyFileSync(src, 'test/out/c3/clip.webm'); await browser.close()
console.log(JSON.stringify({ clip: 'test/out/c3/clip.webm', counts }))
