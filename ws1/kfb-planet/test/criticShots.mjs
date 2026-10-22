// MVP-Kritiker (Lead 22.10.): feste Bilder aus der Spielkamera für den blinden Kritiker (CRITIC_3D_R1). Nur im Test-Slot.
// Ausgabe: OUT/*.png (1440×900 CSS, dpr 1) + Pflicht-Pässe (Graustufen, Thumbnail) für die Spielkamera-Bilder.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = process.env.OUT || path.resolve(process.env.HOME, 'kfb-ws1/research/audits/mvp-r1-critic/bilder'); fs.mkdirSync(OUT, { recursive: true })
const BASE = 'file://' + path.resolve('dist/index.html') + '#m1,debug,harvest,look=terrain3,world=probe'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ready = (p) => p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK', null, { timeout: 300000 }).catch(() => {})
async function open(extra) { const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(BASE + extra); await ready(p); await p.waitForTimeout(4000); return p }
const cam = (p, az, polar, d) => p.evaluate(([az, polar, d]) => { const c = window.__kfbM1.player().camera(); c.rotateTo?.(az, polar, false); if (d) c.dollyTo?.(d, false) }, [az, polar, d])
const shot = async (p, n) => { const f = `${OUT}/${n}.png`; await p.screenshot({ path: f }); return f }
const log = []
// 1 Spawn bei Tag (Spielkamera), 2 Übersicht schräg ~35°, 3 Nacht
{ const p = await open(''); log.push(await shot(p, '01-spawn-tag-spielkamera'))
  await cam(p, Math.PI * 0.85, Math.PI * 0.31, 38); await p.waitForTimeout(1500); log.push(await shot(p, '02-uebersicht-35grad')); await p.close() }
{ const p = await open(',tod=gold'); log.push(await shot(p, '03-spawn-gold')); await p.close() }
{ const p = await open(',tod=night'); log.push(await shot(p, '04-spawn-nacht')); await p.close() }
// 5 Bewohner/Band/Patrouille: Spieler an die Band
{ const p = await open(',npc,patrol,band'); const at = await p.evaluate(() => window.__kfbM1.band?.()?.debug?.at || null)
  if (at) { await p.evaluate((a) => { const M = window.__kfbM1, x = a[0] + 6, z = a[1] + 6; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], Math.atan2(a[0] - x, a[1] - z)) }, at); await p.waitForTimeout(4000)
    await p.evaluate((a) => { const M = window.__kfbM1, f = M.feet(); M.player().camera().rotateAzimuthTo(Math.atan2(a[0] - f[0], a[1] - f[2]) + Math.PI, false) }, at); await p.waitForTimeout(2000) }
  log.push(await shot(p, '05-band-bewohner')); await p.close() }
// 6 Disco nachts
{ const p = await open(',disco,tod=night'); const at = await p.evaluate(() => window.__kfbM1.disco?.()?.debug?.at || null)
  if (at) { await p.evaluate((a) => { const M = window.__kfbM1, x = a[0] + 9, z = a[1] + 9; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], 0) }, at); await p.waitForTimeout(4000)
    await p.evaluate((a) => { const M = window.__kfbM1, f = M.feet(); M.player().camera().rotateAzimuthTo(Math.atan2(a[0] - f[0], a[1] - f[2]) + Math.PI, false) }, at); await p.waitForTimeout(2500) }
  log.push(await shot(p, '06-disco-nacht')); await p.close() }
// 7 Fahrt im Racer (Spieltempo)
{ const p = await open(',car'); await p.evaluate(() => window.__kfbM1.input?.({ forward: true })); await p.waitForTimeout(3500); log.push(await shot(p, '07-fahrt')); await p.waitForTimeout(1500); log.push(await shot(p, '08-fahrt-2')); await p.close() }
await b.close()
// Pflicht-Pässe zur Spielkamera (01): Graustufen + Thumbnail (klein, leicht unscharf)
await sharp(`${OUT}/01-spawn-tag-spielkamera.png`).grayscale().toFile(`${OUT}/01b-pass-graustufen.png`)
await sharp(`${OUT}/01-spawn-tag-spielkamera.png`).resize(240).blur(1.2).toFile(`${OUT}/01c-pass-thumbnail.png`)
await sharp(`${OUT}/07-fahrt.png`).grayscale().toFile(`${OUT}/07b-pass-graustufen.png`)
console.log(JSON.stringify({ out: OUT, files: fs.readdirSync(OUT) }))
