// Bildrate der ganzen Bühne (#stage, Two-Shot, Amphitheater + Billboard + 2 Figuren) auf echter GPU (Apple M4, ANGLE Metal), 1280 × 720:
// rAF-Abstände über 5 s nach dem Laden (Median, p95, fps).
import { chromium } from 'playwright'
import path from 'path'
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto('file://' + path.resolve('dist/index.html') + '#stage,debug,cam=two,actors=rogue')
await p.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().status === 'OK' }, null, { timeout: 240000 })
await p.waitForTimeout(2000)
const r = await p.evaluate(() => new Promise((ok) => { const t = []; let last = performance.now(); const end = last + 5000; const f = (now) => { t.push(now - last); last = now; if (now < end) requestAnimationFrame(f); else { t.sort((a, b) => a - b); ok({ frames: t.length, median: +t[t.length >> 1].toFixed(2), p95: +t[Math.floor(t.length * 0.95)].toFixed(2), fps: +(1000 / t[t.length >> 1]).toFixed(1), dpr: devicePixelRatio }) } }; requestAnimationFrame(f) }))
console.log(JSON.stringify(r)); await b.close()
