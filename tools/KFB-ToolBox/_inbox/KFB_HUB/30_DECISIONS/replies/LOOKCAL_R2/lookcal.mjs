// Look Calibration R2 (WS0, 08.11.): drei Ansichten × eine Stimmung je Lauf (HOUR), freie Kamera über yieldCamera, Spieler unsichtbar. Nur Aufnahme, keine Spieländerung.
import fs from 'fs'
import { openPage } from './_page.mjs'
import { TESTFAHRT_HASH } from '../src/siteHash.js'
const HOUR = process.env.HOUR || '12', TAG = process.env.TAG || 'tag', OUT = 'test/out/lookcal'; fs.mkdirSync(OUT, { recursive: true })
const { browser, page, errs } = await openPage(TESTFAHRT_HASH + `,debug,mute,clean,drivepanel=0,hour=${HOUR},tlapse=0`, { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => window.__kfbM1?.clock?.steps > 200 && !window.__kfbM1.player()?.frozen?.() && window.__kfbViertel, null, { timeout: 300000 })
await page.evaluate(() => { setInterval(() => { if (window.__kfbCardHero?.state?.().phase === 'shown') document.querySelector('[data-ui=card-hero-ok]')?.click() }, 300) })
const tp = (x, z) => page.evaluate(([x, z]) => { const M = window.__kfbM1; M.spielerTeleport([x, M.terrainH(x, z) + 1.5 * M.k, z], Math.PI) }, [x, z])
const site = await page.evaluate(() => { const M = window.__kfbM1, p = M.feet(), T = window.__kfbDrive.terrain(); const s = (T.cardsAround(p[0], p[2], 4000) || []).filter((q) => q.kind === 'viertel').sort((a, b) => Math.hypot(a.x - p[0], a.z - p[2]) - Math.hypot(b.x - p[0], b.z - p[2]))[0]; return s ? { x: s.x, z: s.z } : null })
// freie Kamera: Spieler gibt die Kamera ab und wird ausgeblendet; je Bild Position/Blick setzen
await page.evaluate(() => { const M = window.__kfbM1, P = M.player(); P.yieldCamera(true); window.__lc = { pos: null, at: null }
  const hide = () => { const s = M.scene?.() || M.scene; const f = P.handle?.()?.object3d || null; if (f) f.visible = false }
  try { hide() } catch {}
  const loop = () => { const c = M.camera3(); const L = window.__lc; if (L.pos) { c.position.set(...L.pos); c.lookAt(...L.at); c.updateMatrixWorld() } requestAnimationFrame(loop) }; loop() })
const shot = async (name, pos, at, wait = 6000) => {
  await page.evaluate(() => { const cv = document.querySelector('canvas'); for (const el of document.body.querySelectorAll('*')) { if (el.tagName !== 'CANVAS' && !el.contains(cv) && el.style) el.style.visibility = 'hidden' } })
  await page.evaluate(([pos, at]) => { window.__lc.pos = pos; window.__lc.at = at }, [pos, at]); await page.waitForTimeout(wait)
  fs.writeFileSync(`${OUT}/${TAG}_${name}.png`, await page.screenshot({ type: 'png' }))
}
const H = (x, z) => page.evaluate(([x, z]) => window.__kfbM1.terrainH(x, z), [x, z]), K = await page.evaluate(() => window.__kfbM1.k)
// 1 Amphitheater (Diorama im Ursprung), von vorn-seitlich
await tp(0, 40 * K); await page.waitForTimeout(4000)
let h0 = await H(0, 0); await shot('1_amphitheater', [22 * K, h0 + 9 * K, 48 * K], [0, h0 + 3 * K, 0], 9000)
// 2 Kartenhaus seitlich
let haus = null
if (site) { await tp(site.x, site.z + 40); await page.waitForFunction(() => window.__kfbViertel.mod?.()?.state?.engine?.ready, null, { timeout: 120000 }).catch(() => null)
  await page.waitForFunction(() => (window.__kfbViertel.mod?.()?.state?.engine?.bilder ?? 0) > 3, null, { timeout: 90000 }).catch(() => null); await page.waitForTimeout(8000)
  haus = await page.evaluate(() => { const b = window.__kfbViertel.mod()?.vaultBoxes?.()[0]; return b ? { x: (b.min[0] + b.max[0]) / 2, z: (b.min[2] + b.max[2]) / 2, top: b.max[1], front: b.max[2] } : null }) }
if (haus) { const hh = await H(haus.x, haus.z); await shot('2_kartenhaus', [haus.x + 14 * K, hh + 4 * K, haus.front + 14 * K], [haus.x, hh + 3 * K, haus.z], 9000)
  // 3 Ferne über das Viertel
  await shot('3_ferne', [haus.x - 30 * K, hh + 22 * K, haus.front + 75 * K], [haus.x + 10 * K, hh + 4 * K, haus.z - 30 * K], 9000) }
const eng = await page.evaluate(() => { const e = window.__kfbViertel.mod?.()?.state?.engine; return e ? { ready: e.ready, bilder: e.bilder, modus: e.modus, pool: e.pool } : null })
console.log(JSON.stringify({ HOUR, TAG, K, site, haus, eng, errs: errs.slice(0, 3) }))
await browser.close()
