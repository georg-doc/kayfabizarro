// Probe · Kamera im Stand (Georg 21.10.: Kamera springt hoch/runter ohne Fahrt) und Boden-AO unter Bäumen (Georg: Kontaktschatten weg?).
// Misst Kamerahöhe, LIFT und Wagen-y über 120 Bilder Stand an sechs Stellen; liest die AO-Karte aus (Anteil belegter Bildpunkte, Maximum).
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 960, height: 600 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8751/')
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await page.getByRole('button', { name: 'Fahren', exact: true }).click(); await page.waitForTimeout(800)
const out = await page.evaluate(async () => { const res = []; const rnd = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(3)
  for (let run = 0; run < 6; run++) { const x = (rnd() - 0.5) * 220, z = (rnd() - 0.5) * 220; __probeTP(x, z); await new Promise((r) => setTimeout(r, 1500))
    const d = __probeDrive(), cy = [], ly = [], py = [], ry = [], px = [], pz = [], vf = [], air = []
    for (let k = 0; k < 120; k++) { await new Promise((r) => requestAnimationFrame(r)); cy.push(d.camera.position.y); ly.push(__LIFT.y); py.push(__probeDrive().P.y); ry.push(d.carRoot.position.y); const P = __probeDrive().P; px.push(P.x); pz.push(P.z); vf.push(P.vf); air.push(P.air ? 1 : 0) }
    const span = (a) => +(Math.max(...a) - Math.min(...a)).toFixed(3), jump = (a) => +Math.max(...a.slice(1).map((v, i) => Math.abs(v - a[i]))).toFixed(3)
    res.push({ cam: span(cy), camJump: jump(cy), lift: span(ly), liftMax: +Math.max(...ly).toFixed(2), Py: span(py), root: span(ry), xz: +Math.hypot(span(px), span(pz)).toFixed(2), vf: [+Math.min(...vf).toFixed(2), +Math.max(...vf).toFixed(2)], airFrames: air.reduce((a, b) => a + b, 0), yTrace: run === 2 || run === 4 ? py.filter((_, i) => i % 10 === 0).map((v) => +v.toFixed(2)) : undefined }) }
  const ao = window.__AO ? (() => { const r = window.__renderer, rt = __AO.rtA, n = rt.width, buf = new Uint8Array(n * n * 4); r.readRenderTargetPixels(rt, 0, 0, n, n, buf); let on = 0, mx = 0; for (let i = 0; i < n * n; i++) { const v = buf[i * 4]; if (v > 8) on++; mx = Math.max(mx, v) } return { n, covered: +(on / (n * n)).toFixed(4), max: mx } })() : 'no __AO'
  return { res, ao } })
console.log(JSON.stringify(out)); console.log('errs', errs.slice(0, 2)); await browser.close()
