// Probe · CPU-Profil 4 s beim Fahren (Chrome DevTools-Protokoll): welche JS-Funktionen fressen die Bildzeit
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:8751/'); await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(2500)
const cdp = await p.context().newCDPSession(p); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await cdp.send('Profiler.start')
await p.keyboard.down('KeyW'); await p.waitForTimeout(4000); await p.keyboard.up('KeyW')
const { profile } = await cdp.send('Profiler.stop')
const self = new Map(), byId = new Map(profile.nodes.map((n) => [n.id, n])), dt = profile.timeDeltas, total = dt.reduce((a, b) => a + b, 0)
const cnt = new Map(); profile.samples.forEach((id, i) => cnt.set(id, (cnt.get(id) || 0) + (dt[i] || 0)))
for (const [id, t] of cnt) { const n = byId.get(id), k = (n.callFrame.functionName || '(anon)') + ':' + n.callFrame.lineNumber; self.set(k, (self.get(k) || 0) + t) }
const top = [...self].sort((a, b) => b[1] - a[1]).slice(0, 18).map(([k, t]) => `${(100 * t / total).toFixed(1).padStart(5)} %  ${k}`)
console.log(top.join('\n')); await b.close()
