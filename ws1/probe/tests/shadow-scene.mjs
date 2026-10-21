// Probe · Schatten-Befund (Georg 21.10.: „mit den Schatten kämpfen wir immer noch?“). Wagen neben einen Baum/Busch, Kamera wie im Spiel;
// drei Bilder: alles an · ohne Boden-AO · ohne Sonnenschatten. Ausgabe: shadow-scene-{all,noao,nosun}.png im Zielordner.
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const OUT = process.argv[2] || '/tmp'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:8751/'); await page.evaluate((i) => { window.__pickI = i }, +(process.argv[3] || 0))
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.name === 'rustwing_cruiser') c = true }); return c }, null, { timeout: 60000 })
await page.getByRole('button', { name: 'Fahren', exact: true }).click(); await page.waitForTimeout(800)
const info = await page.evaluate(async () => {
  const d = __probeDrive(), O = d.OBST, kinds = {}
  const list = [].concat(...Object.values(O).filter(Array.isArray)); for (const o of list) kinds[o.kind || o.type || '?'] = (kinds[o.kind || o.type || '?'] || 0) + 1
  const IDX = +(new URLSearchParams(location.search).get('i') || window.__pickI || 0)
  /* Bäume stehen im Diorama um das Amphitheater (Ursprung): auf einem Kreis darum platzieren, Blick zur Mitte */
  const a = IDX * 0.9 + 0.4, R = 34, t = { x: Math.sin(a) * R, z: Math.cos(a) * R, r: 0, top: 0 }, yaw = a + Math.PI
  d.placeCar(t.x, t.z, yaw); await new Promise((r) => setTimeout(r, 2500))
  return { kinds, keys: Object.keys(O), pick: t && { x: +t.x.toFixed(1), z: +t.z.toFixed(1), r: +t.r.toFixed(2), top: t.top } }
})
console.log(JSON.stringify(info))
const shot = async (n) => { await page.waitForTimeout(900); await page.screenshot({ path: `${OUT}/shadow-scene-${n}.png`, clip: { x: 16, y: 106, width: 724, height: 450 } }) }
const setS = async (k, v) => page.evaluate(({ k, v }) => { const el = [...document.querySelectorAll('input[type=checkbox]')].find((e) => e.id === k || e.dataset.k === k || e.name === k); if (el) { if (el.checked !== v) el.click(); return true } __S[k] = v; return false }, { k, v })
await shot('all')
console.log('ground toggle via UI:', await setS('ground', false)); await shot('noao'); await setS('ground', true)
console.log('shadows toggle via UI:', await setS('shadows', false)); await shot('nosun'); await setS('shadows', true)
console.log('errs', errs.slice(0, 2)); await browser.close()
