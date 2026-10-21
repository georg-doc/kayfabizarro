// Helfer für gen_height.py und den Paritätstest: öffnet die gebaute Probe (http://localhost:8751/) in frischem Browser (leerer localStorage),
// liest Rezepte über die Probe selbst (recipe() → Textfeld #recipe) und tastet window.__hgt ab. Nur lesen, die Probe bleibt unverändert.
//   node probe_height_ref.mjs recipe "Sanfte Hügel"   → Rezept der Vorlage, Wasserstand 0 (über die Regler), als JSON auf stdout
//   node probe_height_ref.mjs sample <rezept.json> <punkte.json>   → { anchors, withAnchors[], noAnchors[] } auf stdout
import { readFileSync } from 'node:fs'
const PW = process.env.KFB_PW || '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
const URL = process.env.KFB_PROBE_URL || 'http://localhost:8751/'
const { chromium } = await import(PW)

export async function openProbe() {
  const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
  const p = await b.newPage({ viewport: { width: 900, height: 600 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message))
  await p.goto(URL); await p.waitForFunction(() => window.__hgt && window.__S && window.__OT && document.getElementById('recipe')?.value?.length > 0, null, { timeout: 90000 })
  const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
  return { b, p, errs, set }
}
// Rezept über die Probe-Oberfläche anwenden (Textfeld + „Rezept übernehmen“), Flüsse aus, Wasser 0, zwei Bilder warten (Flussmodul schaltet im Bildtakt ab)
export async function applyRecipe(P, recipe) {
  await P.p.evaluate((txt) => { const t = document.getElementById('recipe'); t.value = txt; t.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('rcApply').click() }, JSON.stringify(recipe, null, 2))
  await P.set('rivers', false); await P.set('water', '0'); await P.p.waitForTimeout(600)
  return P.p.evaluate(() => ({ rivOff: !__S.rivers, water: __S.water, msg: document.getElementById('copyMsg').textContent }))
}
// Abtasten: einmal mit den Ankern der Probe (Kopie zurück), einmal mit allen Ankern aus (danach wiederhergestellt)
export async function sample(P, pts) {
  return P.p.evaluate((pts) => {
    const anchors = __OT.DIOS.filter((a) => a.on).map((a) => JSON.parse(JSON.stringify(a)))
    const withAnchors = pts.map(([x, z]) => __hgt(x, z))
    const was = __OT.DIOS.map((a) => a.on); __OT.DIOS.forEach((a) => { a.on = false })
    const noAnchors = pts.map(([x, z]) => __hgt(x, z)); __OT.DIOS.forEach((a, i) => { a.on = was[i] })
    return { anchors, withAnchors, noAnchors }
  }, pts)
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const [cmd, a1, a2] = process.argv.slice(2)
  const P = await openProbe()
  try {
    if (cmd === 'recipe') {
      await P.p.evaluate((n) => [...document.querySelectorAll('#presets button')].find((x) => x.textContent === n).click(), a1)
      await P.set('water', '0'); await P.p.waitForTimeout(300)
      const txt = await P.p.evaluate(() => document.getElementById('recipe').value)
      process.stdout.write(txt)
    } else if (cmd === 'sample') {
      const recipe = JSON.parse(readFileSync(a1, 'utf8')), pts = JSON.parse(readFileSync(a2, 'utf8'))
      const st = await applyRecipe(P, recipe), r = await sample(P, pts)
      process.stdout.write(JSON.stringify({ state: st, ...r }))
    } else throw new Error('unbekannter Befehl ' + cmd)
    if (P.errs.length) process.stderr.write('Seitenfehler: ' + P.errs.slice(0, 3).join(' | ') + '\n')
  } finally { await P.b.close() }
}
