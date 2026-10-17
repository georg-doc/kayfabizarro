// F1-Naht „Pupille bei Lid zu“ · Vorschlag prüfen ohne Spender zu ändern: Pupillen-Sitz (eyeoval seatPupils, delta nach vorn)
// mit dem Lidschluss ausblenden (delta · (1 − Lidschluss)). Misst dunkle Pupillen-Pixel offen/zu wie test/f1.mjs, vorher/nachher.
import { openPage } from '../../test/_page.mjs'
import fs from 'fs'
const { browser, page } = await openPage('#eyetest,debug', { viewport: { width: 900, height: 900 } })
await page.waitForFunction(() => window.__kfbEyeActor && window.__kfbEyeActor.status().status === 'OK', null, { timeout: 120000 }); await page.waitForTimeout(2000)
const crop = { x: 300, y: 170, width: 300, height: 110 }
const count = async () => { const b = await page.screenshot({ clip: crop }); return [b, await page.evaluate(async (u) => { const i = new Image(); await new Promise((r) => { i.onload = r; i.src = u }); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; let n = 0; for (let k = 0; k < d.length; k += 4) if (Math.max(d[k], d[k + 1], d[k + 2]) < 45) n++; return n }, 'data:image/png;base64,' + b.toString('base64'))] }
const shut = () => page.evaluate(() => { const r = window.__kfbEyeActor.debugRig(); r.__d = r.blink.dur; r.blink.dur = 1e6; r._blinkK = 0.5 })
const open = () => page.evaluate(() => { const r = window.__kfbEyeActor.debugRig(); r.blink.dur = r.__d; r._blinkK = -1 })
const res = {}
const [o0, a0] = await count(); await shut(); await page.waitForTimeout(400); const [z0, b0] = await count(); await open(); await page.waitForTimeout(400)
res.before = { open: a0, shut: b0 }
const info = await page.evaluate(() => { const r = window.__kfbEyeActor.debugRig(), u = r.update
  r.update = function (...a) { const out = u.apply(this, a); const k = this._blinkK >= 0 ? Math.sin(Math.min(this._blinkK, 1) * Math.PI) : 0; for (const e of this.eyes) if (e._pivot) e._pivot.position.multiplyScalar(1 - k); return out }
  return { R: r._R, lidFit: r.lidFit, delta: r.eyes.map((e) => +e._pivot.position.length().toFixed(5)) } })
await page.waitForTimeout(300)
const [o1, a1] = await count(); await shut(); await page.waitForTimeout(400); const [z1, b1] = await count()
res.after = { open: a1, shut: b1 }; res.info = info
fs.mkdirSync('test/out/seam', { recursive: true }); for (const [n, b] of [['open_before', o0], ['shut_before', z0], ['open_after', o1], ['shut_after', z1]]) fs.writeFileSync(`test/out/seam/${n}.png`, b)
console.log(JSON.stringify(res)); await browser.close()
