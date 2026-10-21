// MVP-Startseite (V-618): Vorhang mit Bühne vor dem Spiel (#…,start). Prüft: Ebene da, Bühne (WebGPU) oder Ersatz-Vorhang, Ladebalken bis „Bereit“,
// Klick „Vorhang auf“ → Ebene weg und Spiel sichtbar, Qualitätsknöpfe, keine Seitenfehler. Bilder test/out/start/*.png
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
import { report } from './_page.mjs'
fs.mkdirSync('test/out/start', { recursive: true })
const DIST = process.env.KFB_DIST || 'dist'
const b = await chromium.launch(process.env.PW_GPU ? { channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-webgpu'] } : {})
const p = await b.newPage({ viewport: { width: 1280, height: 760 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
await p.goto('file://' + path.resolve(DIST, 'index.html') + '#m1,harvest,look=terrain3,world=probe,start,debug')
await p.waitForFunction(() => !!document.querySelector('.kfb-start') && window.__kfbStart?.state?.().mode !== 'loading', null, { timeout: 60000 }).catch(() => {})
await p.waitForTimeout(2500); const s1 = await p.evaluate(() => window.__kfbStart?.state?.() || null)
await p.screenshot({ path: 'test/out/start/start-curtain.png' })
await p.waitForFunction(() => window.__kfbStart?.state?.().ready, null, { timeout: 300000 }).catch(() => {})
const s2 = await p.evaluate(() => window.__kfbStart?.state?.() || null); await p.screenshot({ path: 'test/out/start/start-ready.png' })
const qBtns = await p.evaluate(() => [...document.querySelectorAll('.kfb-start [data-q]')].map((x) => x.dataset.q))
await p.click('.kfb-start .go'); await p.waitForTimeout(1200); await p.screenshot({ path: 'test/out/start/start-opening.png' })
await p.waitForFunction(() => !document.querySelector('.kfb-start'), null, { timeout: 15000 }).catch(() => {})
const gone = await p.evaluate(() => !document.querySelector('.kfb-start')); await p.waitForTimeout(1500); await p.screenshot({ path: 'test/out/start/start-game.png' })
await b.close()
process.exit(report('start (MVP-Startseite, Vorhang)', {
  overlayShown: !!s1, stageOrFallback: !!s1 && ['webgpu', 'css'].includes(s1.mode), readyReached: !!s2?.ready, qualityButtons: qBtns.join() === 'fast,standard,sharp',
  opensAndRemoves: gone, noPageErrors: errs.length === 0,
}, { mode: s1?.mode, fallbackWhy: s1?.fallbackWhy || null, loaded: s2 ? [s2.loaded, s2.total] : null, errs: errs.slice(0, 3) }))
