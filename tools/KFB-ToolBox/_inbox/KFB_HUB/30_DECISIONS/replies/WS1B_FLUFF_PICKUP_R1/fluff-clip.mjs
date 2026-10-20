// WS1b · Clip Fluff-Flug (V-340): GPU-Chromium unsichtbar, Spielkamera, FB läuft mit W über liegende Kügelchen; Video + Einzelbilder im Flug
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
const OUT = process.argv[2]
const b = await chromium.launch({ channel: 'chromium', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: OUT, size: { width: 1280, height: 720 } } })
const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('file://' + path.resolve('dist/index.html') + '#m1,debug,harvest')
await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.orchard?.stats().status === 'OK' && window.__kfbM1.harvest().hud && !document.getElementById('kfb-boot'), null, { timeout: 180000 })
await page.waitForTimeout(1500)
// zwei Bäume leer schlagen (Fluff fällt, springt, rollt, kommt zur Ruhe: V-437)
await page.evaluate(async () => { const O = window.__kfbM1.mods.orchard
  for (const id of ['t0', 't1', 't2', 't3', 't4']) { let n = 0; while (O.trees().find((x) => x.zone === 'goblin' && x.id === id).left > 0 && n < 12) { O.hitTree('goblin', id, 'punch'); n++; await new Promise((r) => setTimeout(r, 60)) } } })
await page.waitForFunction(() => window.__kfbM1.mods.orchard.balls().filter((b) => /^goblin:/.test(b.key)).every((b) => b.state === 'resting'), null, { timeout: 60000 }).catch(() => {})
// Spieler 4 m vor die dichteste Stelle, Blick dorthin
const plan = await page.evaluate(() => { const M = window.__kfbM1, O = M.mods.orchard, k = M.k, T = M.three(), cam = M.camera3()
  const d = cam.getWorldDirection(new T.Vector3()); d.y = 0; d.normalize()
  const trees = O.trees(), segDist = (p, a, b) => { const abx = b[0] - a[0], abz = b[2] - a[2], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * abx + (p[2] - a[2]) * abz) / (abx * abx + abz * abz || 1))); return Math.hypot(a[0] + abx * t - p[0], a[2] + abz * t - p[2]) }
  const cand = ['t0', 't1', 't2', 't3', 't4'].map((id) => { const R = O.balls().filter((b) => b.state === 'resting' && b.key.startsWith('goblin:' + id + ':')); if (!R.length) return null
    const c = R.reduce((a, b) => [a[0] + b.p[0] / R.length, a[1] + b.p[1] / R.length, a[2] + b.p[2] / R.length], [0, 0, 0])
    const fb = [c[0] - d.x * 4.5 * k, 0, c[2] - d.z * 4.5 * k], camP = [fb[0] - d.x * 7 * k, 0, fb[2] - d.z * 7 * k], end = [c[0] + d.x * 1.5 * k, 0, c[2] + d.z * 1.5 * k]
    const clear = Math.min(...trees.map((t) => segDist(t.pos, camP, end))) // kleinster Abstand einer Baumachse zur Sichtlinie
    return { id, n: R.length, c, fb, clear } }).filter(Boolean).sort((a, b) => b.clear - a.clear)
  const best = cand[0]; M.player().teleport([best.fb[0], best.c[1] + 1 * k, best.fb[2]], Math.atan2(d.x, d.z)); return { best, cand: cand.map((x) => [x.id, x.n, +x.clear.toFixed(2)]) } })
await page.waitForTimeout(2500)
const t0 = Date.now(), frames = []
await page.keyboard.down('KeyW')
for (let i = 0; i < 40; i++) { await page.waitForTimeout(90); const live = await page.evaluate(() => document.querySelectorAll('[data-kfb-fluff-flight]').length); if (live && frames.length < 6) { const f = `${OUT}/flug_${frames.length}.png`; await page.screenshot({ path: f }); frames.push({ f, t: Date.now() - t0, live }) } }
await page.keyboard.up('KeyW')
await page.waitForTimeout(2500)
const end = await page.evaluate(() => { const M = window.__kfbM1, hud = M.harvest().hud; return { hud: hud.counts(), state: M.mods.orchard.counts(), flight: hud.flight() } })
await page.screenshot({ path: `${OUT}/ende.png` })
const v = page.video(); await ctx.close(); const vp = await v.path(); fs.renameSync(vp, `${OUT}/fluff-flug.webm`)
fs.writeFileSync(`${OUT}/clip.json`, JSON.stringify({ plan, frames, end, errs }, null, 1)); console.log(JSON.stringify({ frames: frames.length, end, errs }))
await b.close()
