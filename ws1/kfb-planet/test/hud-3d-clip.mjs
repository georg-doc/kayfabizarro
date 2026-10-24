// HUD 3D Tempo-Leiste · kurzer Clip (Georg 24.10.): Anfahren, Boost, Loslassen im Racer, 1600 × 900, look=terrain3, echter Spielstand. Nur mit Test-Slot.
// Ausgabe: test/out/hud-3d/clip/tempo.webm
import { chromium } from 'playwright'
import { SITE_HASH } from '../src/siteHash.js' // Live-Stand wie die Site (world=probe), nur Prüf-Schalter dazu
import fs from 'fs'; import path from 'path'
const OUT = 'test/out/hud-3d/clip'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, recordVideo: { dir: OUT, size: { width: 1600, height: 900 } } })
await ctx.addInitScript((s) => { try { localStorage.setItem('kfb.save', JSON.stringify(s)) } catch {} }, { schema: 'kfb.save/1', version: 1, savedAt: new Date().toISOString(), flags: {}, fluff: { tragic: 5, comic: 12, absurd: 2, heroic: 7, mystical: 0, forbidden: 26 }, fluffTotal: 97, collected: [], player: { pos: [0, 0, 0], zone: null } })
const page = await ctx.newPage(); await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH.replace('#m1,', '#m1,car,') + ',debug,clean')
await page.waitForFunction(() => window.__kfbClayHud?.status().status === 'OK', null, { timeout: 120000 }); await page.waitForTimeout(3000)
await page.keyboard.down('KeyW'); await page.waitForTimeout(3500); await page.keyboard.down('ShiftLeft'); await page.waitForTimeout(1800); await page.keyboard.up('ShiftLeft'); await page.waitForTimeout(1500); await page.keyboard.up('KeyW'); await page.waitForTimeout(2500)
const v = page.video(); await ctx.close(); const f = await v.path(); fs.renameSync(f, path.join(OUT, 'tempo.webm')); console.log('clip', path.join(OUT, 'tempo.webm'), fs.statSync(path.join(OUT, 'tempo.webm')).size)
await browser.close()
