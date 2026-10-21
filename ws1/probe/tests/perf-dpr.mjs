// Probe · Bildzeit je Pixeldichte (Retina-Faktor) und mit/ohne Amphitheater-Erdung – wo die Bildrate hängt (Georg: 9–15 fps)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(3000)
const med = () => p.evaluate(async () => { const a = []; let t0 = performance.now(); for (let i = 0; i < 180; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return +a[90].toFixed(1) })
const out = {}
for (const r of [2, 1.5, 1.25, 1, 0.75]) { await p.evaluate((r) => { __renderer.setPixelRatio(r); window.dispatchEvent(new Event('resize')) }, r); await p.waitForTimeout(1200); out['dpr' + r] = await med() }
await p.evaluate(() => { __renderer.setPixelRatio(1); window.dispatchEvent(new Event('resize')) })
const tri = await p.evaluate(() => { let sc = __probeDrive().carRoot; while (sc.parent) sc = sc.parent; const list = []; sc.traverse((o) => { if (o.isMesh && o.visible && o.geometry) { const n = (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3 * (o.isInstancedMesh ? o.count : 1); if (n > 20000) list.push([o.name || o.type, Math.round(n), o.material?.type, o.castShadow]) } }); return list.sort((a, b) => b[1] - a[1]).slice(0, 8) })
out.bigMeshes = tri
// Amphitheater (größtes Netz unter worldRoot) testweise aus
out.amphOff = await p.evaluate(async () => { let sc = __probeDrive().carRoot; while (sc.parent) sc = sc.parent; let big = null, n = 0; sc.traverse((o) => { if (o.isMesh && o.visible && o.geometry?.index && o.geometry.index.count > n && o.geometry.index.count > 600000) { big = o; n = o.geometry.index.count } }); if (!big) return 'none'; big.visible = false; const a = []; let t0 = performance.now(); for (let i = 0; i < 180; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); big.visible = true; return { name: big.name, tris: n / 3, ms: +a[90].toFixed(1) } })
console.log(JSON.stringify(out)); await b.close()
