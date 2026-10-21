// Draufsicht-Umfrage für nach oben offene Kamine (rustfire_interceptor): Becher im Höhenbild h = y
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { detectNozzles, scoreCandidates } from '/Users/georgvonwestphalen/kfb-ws1/thrust-survey/lib/detect.mjs'
import { VIEWS } from '/Users/georgvonwestphalen/kfb-ws1/thrust-survey/lib/raster.mjs'
const id = process.argv[2] || 'rustfire_interceptor'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage(); await page.goto('http://127.0.0.1:8794/probe/tests/rig-extra/survey.html'); await page.waitForFunction(() => window.ready === true)
const r = await page.evaluate(([id]) => window.raster(id, 'top', 0.005), [id])
const unb64 = (s, T) => { const b = Buffer.from(s, 'base64'); return new T(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)) }
const H = unb64(r.H, Float32Array), RGB = unb64(r.RGB, Uint8Array), COV = unb64(r.COV, Uint8Array)
const hb = new Float32Array(H.length), fb = new Int32Array(H.length)
for (let k = 0; k < H.length; k++) { hb[k] = COV[k] ? H[k] : -Infinity; fb[k] = COV[k] ? 0 : -1 }
const R = { view: 'top', V: VIEWS.top, px: r.px, nx: r.nx, ny: r.ny, umin: r.umin, wmax: r.wmax, hb, fb, rgb: RGB, pxToU: (i) => r.umin + (i + 0.5) * r.px, pyToW: (j) => r.wmax - (j + 0.5) * r.px }
const mn = r.bbox.min, mx = r.bbox.max, W = mx[0] - mn[0], L = mx[2] - mn[2]
const { cands } = detectNozzles(R, { width: W, label: 'top', minR: 0.03 }); scoreCandidates(cands, { W, L, zmin: mn[2], view: 'top' })
for (const c of cands.filter((c) => c.pos[1] > 2.2).sort((a, b) => b.confidence - a.confidence)) console.log(c.confidence, c.pos.map((v) => v.toFixed(3)).join(','), 'r', c.radius.toFixed(3), 'dir', c.dir.map((v) => v.toFixed(2)).join(','), 'cup', c.metrics.cupDepth.toFixed(3), 'cov', c.metrics.coverage.toFixed(2))
await browser.close()
