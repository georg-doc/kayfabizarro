// QA R1 · Start ohne Eingabe: Wagen muss am Startpunkt stehen bleiben (kein Abrutschen, kein Pendeln).
// Bis Stand 02:15 rollte er mit Standardwerten (Tafelberge, Start auf 35,3°-Hang) 11,5 m ab und pendelte ~8 s; ab 02:43 nur noch mit „Grat-Gebirge“ (69°, 17 m).
// Ablauf je Vorlage: wählen (localStorage merkt sie), neu laden, 10 s ab Seitenstart aufzeichnen. Aufruf: node qa-spawn-rest.mjs [std|georg]   Ausgang 1 = FAIL
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const GEORG = process.argv[2] === 'georg', URL = process.env.PROBE_URL || 'http://localhost:8751/'
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const fails = []
for (const pr of ['Tafelberge', 'Sanfte Hügel', 'Terrassen-Insel', 'Grat-Gebirge', 'Wirbel-Dünen', 'Biom-Reise']) {
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 700 } }), page = await ctx.newPage()   // frischer Kontext: kalter Cache wie beim ersten Besuch
  await page.goto(URL); await page.waitForFunction(() => document.querySelectorAll('#presets button').length > 0)
  await page.evaluate(({ pr, G }) => { [...document.querySelectorAll('#presets button')].find((b) => b.textContent === pr).click()
    if (G) for (const [id, v] of [['sunel', '12'], ['water', '0.06'], ['fluid', '3']]) { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) } }, { pr, G: GEORG })
  await page.waitForTimeout(500); await page.goto(URL, { waitUntil: 'commit' })
  const r = await page.evaluate(async () => { const t0 = performance.now(); let vmax = 0
    while (performance.now() - t0 < 10000) { await new Promise((res) => setTimeout(res, 100)); if (!window.__probeDrive) continue; vmax = Math.max(vmax, Math.abs(__probeDrive().P.vf)) }
    const P = __probeDrive().P, sl = Math.atan(Math.hypot((__hgt(1, 0) - __hgt(-1, 0)) / 2, (__hgt(0, 1) - __hgt(0, -1)) / 2)) * 57.3
    return { slope0: +sl.toFixed(1), drift: +Math.hypot(P.x, P.z).toFixed(2), vmaxKmh: Math.round(vmax * 3.6) } })
  console.log(pr, JSON.stringify(r))
  if (r.drift > 1 || r.vmaxKmh > 3) fails.push(`${pr}: Start auf ${r.slope0}° – rutscht ${r.drift} m, bis ${r.vmaxKmh} km/h ohne Eingabe`)
  await ctx.close()
}
console.log(fails.length ? 'FAIL\n  ' + fails.join('\n  ') : 'PASS')
await browser.close(); process.exit(fails.length ? 1 : 0)
