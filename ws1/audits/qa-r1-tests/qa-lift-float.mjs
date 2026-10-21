// QA R1 · P1 „Wagen schwebt“ (v2, nachgeschärft nach Umbau 03:54): gemessen wird echtes Schweben, nicht LIFT.
// Schweben = tiefster Karosseriepunkt liegt mehr als (Schwebehöhe + 0,3 m) über dem gezeichneten Boden, obwohl P.air = false.
// Schwebehöhe wird zur Laufzeit bestimmt: Wagen steht 2 s auf ebener Stelle, Median der Bodenfreiheit = h0.
// Boden = gezeichnetes Dreiecksgitter (__meshH), über Wasser die Wasserfläche. Steine/Bäume zählen nicht (kann über Steinen Fehlalarm geben → Stelle im Log).
// Aufruf: node qa-lift-float.mjs [std|georg]      PROBE_URL=… überschreibt Port 8751      Ausgang 1 = FAIL
// A  feste Stelle (alter Befund): Tafelberge, placeCar(36.7, -68.2, 1.92), W 3 s → kein Bild mit Schweben
// B  Stichprobe: 6 Startpunkte (fester Zufall), je 6 s W+⇧ → Schweben in ≤ 2 % der Bodenbilder, sichtbarer Höhensprung (carRoot − P.y) ≤ 0,4 m je Bild (LIFT steigt gewollt mit 6 m/s = 0,3 m je Bild bei 20 fps)
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const GEORG = process.argv[2] === 'georg', URL = process.env.PROBE_URL || 'http://localhost:8751/'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
await page.goto(URL)
await page.waitForFunction(() => { if (!window.__probeDrive || !window.__LIFT || !window.__meshH) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
const set = (id, v) => page.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await page.evaluate(() => [...document.querySelectorAll('#presets button')].find((b) => b.textContent === 'Tafelberge').click())
if (GEORG) { await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true) }
await page.getByRole('button', { name: 'Fahren', exact: true }).click(); await page.waitForTimeout(800)
// Messhilfe im Seitenkontext: Bodenfreiheit des tiefsten Karosseriepunkts (größtes Standard-Mesh des Wagens = Karosserie)
await page.evaluate(() => {
  window.__QF = () => { const d = __probeDrive(); let body = null, n = 0; d.carRoot.traverse((o) => { if (o.isMesh && o.visible && o.material?.isMeshStandardMaterial && o.geometry.attributes.position.count > n) { body = o; n = o.geometry.attributes.position.count } })
    const pos = body.geometry.attributes.position, v = new THREE.Vector3(), P = d.P, S = __S, wl = S.water > 0.005 ? S.water * S.amp + 0.1 : -1e9, st = Math.max(1, Math.floor(pos.count / 1500)); body.updateWorldMatrix(true, false); let c = 1e9
    for (let i = 0; i < pos.count; i += st) { v.fromBufferAttribute(pos, i).applyMatrix4(body.matrixWorld); c = Math.min(c, v.y - Math.max(__meshH(v.x + P.x, v.z + P.z), wl)) }
    return { clr: c, air: !!(P.air || P.fly), vis: d.carRoot.position.y - P.y, x: P.x, z: P.z, yaw: P.yaw, lift: __LIFT.y, hud: document.getElementById('hudMode').textContent } }
  window.__QREC = (on) => { if (on) { window.__QL = []; window.__QLON = true; const f = () => { if (!__QLON) return; __QL.push(__QF()); requestAnimationFrame(f) }; requestAnimationFrame(f); return null } window.__QLON = false; return __QL } })
// Schwebehöhe h0 auf ebener Stelle
const flat = await page.evaluate(() => { const rnd = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(8), S = __S, wl = S.water > 0.005 ? S.water * S.amp + 0.6 : -1e9
  const sl = (x, z) => Math.atan(Math.hypot((__hgt(x + 1, z) - __hgt(x - 1, z)) / 2, (__hgt(x, z + 1) - __hgt(x, z - 1)) / 2)) * 57.3
  for (const [lim, rs] of [[3, [0, 4, 8]], [5, [0, 4]], [8, [0, 3]]]) for (let i = 0; i < 30000; i++) { const x = (rnd() - 0.5) * 600, z = (rnd() - 0.5) * 600; if (Math.hypot(x, z - 70) < 60) continue; let ok = __hgt(x, z) > wl; for (let a = 0; a < 6.28 && ok; a += 0.6) for (const r of rs) if (sl(x + Math.cos(a) * r, z + Math.sin(a) * r) > lim) ok = false; if (ok) return [x, z] } return null })
if (!flat) { console.log('FAIL\n  keine ebene Stelle für die Schwebehöhe gefunden'); await browser.close(); process.exit(1) }
await page.evaluate((f) => __probeDrive().placeCar(f[0], f[1], 0.6), flat); await page.waitForTimeout(2000)
await page.evaluate(() => __QREC(true)); await page.waitForTimeout(1500); const R0 = await page.evaluate(() => __QREC(false))
const cl0 = R0.map((r) => r.clr).sort((a, b) => a - b), h0 = cl0[cl0.length >> 1], TH = h0 + 0.3
console.log(`Schwebehöhe h0 = ${(h0 * 100).toFixed(0)} cm an placeCar(${flat.map((v) => v.toFixed(1)).join(',')}) → Schwebe-Grenze ${(TH * 100).toFixed(0)} cm`)
const K = page.keyboard, fails = []
const judge = (R) => { const g = R.filter((r) => !r.air), fl = g.filter((r) => r.clr > TH); let pop = 0, at = null; R.forEach((r, k) => { const d = k ? r.vis - R[k - 1].vis : 0; if (d > pop) { pop = d; at = r } }); const worst = fl.sort((a, b) => b.clr - a.clr)[0]; return { g: g.length, fl: fl.length, pop, at, worst } }
const fmt = (r) => r ? `placeCar(${r.x.toFixed(1)},${r.z.toFixed(1)},${r.yaw.toFixed(2)}) Freiheit ${(r.clr * 100).toFixed(0)} cm, LIFT ${r.lift.toFixed(2)}, HUD „${r.hud}“` : '–'
// A
if (!GEORG) {
  await page.evaluate(() => __probeDrive().placeCar(36.7, -68.2, 1.92)); await page.waitForTimeout(1500)
  await page.evaluate(() => __QREC(true)); await K.down('KeyW'); await page.waitForTimeout(3000); await K.up('KeyW'); const j = judge(await page.evaluate(() => __QREC(false)))
  console.log(`A placeCar(36.7,-68.2,1.92): Schweben in ${j.fl}/${j.g} Bodenbildern; schlimmstes: ${fmt(j.worst)}`)
  if (j.fl) fails.push(`A: Wagen schwebt an der alten Stelle (${j.fl} Bilder), ${fmt(j.worst)}`)
}
// B
const rnd = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(GEORG ? 99 : 77)
let G = 0, FL = 0, POP = 0, POPAT = null, WORST = null
for (let i = 0; i < 6; i++) {
  const sp = [(rnd() - 0.5) * 300, (rnd() - 0.5) * 300, rnd() * 6.28]
  await page.evaluate((sp) => __probeDrive().placeCar(sp[0], sp[1], sp[2]), sp); await page.waitForTimeout(1200)
  await page.evaluate(() => __QREC(true)); await K.down('KeyW'); await K.down('ShiftLeft'); await page.waitForTimeout(6000); await K.up('ShiftLeft'); await K.up('KeyW')
  const j = judge(await page.evaluate(() => __QREC(false))); G += j.g; FL += j.fl; if (j.pop > POP) { POP = j.pop; POPAT = j.at } if (j.worst && (!WORST || j.worst.clr > WORST.clr)) WORST = j.worst
}
const pct = 100 * FL / Math.max(1, G)
console.log(`B ${GEORG ? 'Georg' : 'Standard'}: Schweben in ${pct.toFixed(1)} % der Bodenbilder (${FL}/${G}); schlimmstes: ${fmt(WORST)}`)
console.log(`  größter sichtbarer Höhensprung ${POP.toFixed(2)} m/Bild bei ${fmt(POPAT)}`)
if (pct > 2) fails.push(`B: Schweben in ${pct.toFixed(1)} % der Bodenbilder (Grenze 2 %)`)
if (POP > 0.4) fails.push(`B: sichtbarer Höhensprung ${POP.toFixed(2)} m in einem Bild (Grenze 0,4 m) bei ${fmt(POPAT)}`)
if (errs.length) fails.push('Seitenfehler: ' + errs[0])
console.log(fails.length ? 'FAIL\n  ' + fails.join('\n  ') : 'PASS')
await browser.close(); process.exit(fails.length ? 1 : 0)
