// Probe · Grundlast: Bildzeit mit Gelände (Nahgitter + Ringe) sichtbar vs. ausgeblendet, Fahrkamera, Pixeldichte 1,25
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(3000)
const med = () => p.evaluate(async () => { const a = []; let t0 = performance.now(); for (let i = 0; i < 150; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return +a[75].toFixed(1) })
const out = { all: await med() }
await p.evaluate(() => { __terrain.visible = false }); out.noTerrain = await med(); await p.evaluate(() => { __terrain.visible = true })
out.all2 = await med()
const info = await p.evaluate(() => ({ verts: __terrain.geometry.attributes.position.count, gl: (() => { const g = __renderer.getContext(); const e = g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : '?' })(), calls: __renderer.info.render.calls, tris: __renderer.info.render.triangles }))
console.log(JSON.stringify({ ...out, ...info })); await b.close()
