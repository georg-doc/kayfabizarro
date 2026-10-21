// QA R1 · Regression „heller Streifen oben“ (offen bis Stand 02:27, ab 02:43 behoben: step(rd.y,0.0) im Himmels-/Kulissen-Code zog auf Augenhöhe eine
// harte waagrechte Linie, darüber Dunst). Sucht im Fahrbild eine Zeile, an der fast alle Spalten von hell nach dunkel kippen.
// Aufruf: node qa-top-band.mjs [std|georg]      Ausgang 1 = FAIL
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const GEORG = process.argv[2] === 'georg', URL = process.env.PROBE_URL || 'http://localhost:8751/'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } })
await page.goto(URL)
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c }, null, { timeout: 90000 })
const set = (id, v) => page.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await page.evaluate(() => [...document.querySelectorAll('#presets button')].find((b) => b.textContent === 'Tafelberge').click())
if (GEORG) { await set('sunel', '12'); await set('water', '0'); await set('fluid', '3') }   // Wasser 0: der Wasserhorizont ist eine echte waagrechte Kante (Fehlalarm bei 0,06, geprüft 21.10.)
await page.getByRole('button', { name: 'Fahren', exact: true }).click()
const clip = await page.evaluate(() => { const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height } })
// Kantenmaß: nur ±4 px um die Horizontzeile (der alte Fehler lag genau dort: 47–71 % der Breite mit Standardwerten, 93 % mit Georgs Werten);
// je Zeile Anteil Spalten mit Helligkeitsabfall > 6 zwischen y−2 und y+1. Stand 02:43+ bleibt dort ≤ 25 % → Grenze 40 %.
// Gegenprobe 21.10.: v65 (02:11) FAIL, Stand 02:55 PASS.
const horizon = () => page.evaluate(() => { const c = __probeDrive().camera, f = new THREE.Vector3(); c.getWorldDirection(f); f.y = 0; f.normalize(); const p = c.position.clone().addScaledVector(f, 2000).project(c), cv = document.getElementById('cv'); return Math.round((1 - p.y) / 2 * cv.clientHeight) })
const edge = (b64, hy) => page.evaluate(async ({ b64, hy }) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = new OffscreenCanvas(i.width, i.height), x = c.getContext('2d'); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, i.width, i.height).data, W = i.width
  const L = (p) => d[p * 4] * 0.3 + d[p * 4 + 1] * 0.59 + d[p * 4 + 2] * 0.11; let best = { y: -1, f: 0, horizon: hy }
  for (let y = Math.max(50, hy - 4); y <= Math.min(i.height - 2, hy + 4); y++) { let k = 0, n = 0; for (let xx = 0; xx < W; xx += 2) { n++; if (L((y - 2) * W + xx) - L((y + 1) * W + xx) > 6) k++ } if (k / n > best.f) best = { y, f: +(k / n).toFixed(2), horizon: hy } } return best }, { b64, hy })
const fails = []
const cases = [['Tag', 'tag', [36.7, -60.2, 1.92]], ['Tag gedreht', 'tag', [-132.4, -52.8, 2.49]], ['Gold', 'gold', [-150, -43.1, 0.5]], ['Nacht', 'nacht', [-150, -43.1, 0.5]]]
for (const [name, tod, sp] of cases) {
  await set('tod', tod); await page.evaluate((sp) => __probeDrive().placeCar(sp[0], sp[1], sp[2]), sp); await page.waitForTimeout(2500)
  const r = await edge((await page.screenshot({ clip })).toString('base64'), await horizon())
  console.log(name, `placeCar(${sp.join(',')})`, JSON.stringify(r))
  if (r.f > 0.4) fails.push(`${name}: waagrechte Kante in Zeile ${r.y} über ${Math.round(r.f * 100)} % der Breite`)
}
console.log(fails.length ? 'FAIL\n  ' + fails.join('\n  ') : 'PASS')
await browser.close(); process.exit(fails.length ? 1 : 0)
