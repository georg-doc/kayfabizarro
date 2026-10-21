// Fahrzeug-Look A im Spiel (Georg 21.10.): Racer nah (Folgekamera) und fern (herausgezoomt), mit und ohne Look → test/out/vlook/vlook-sheet.png
// Prüft: Look greift (1 Material, Faktor 0,85–1,5), Spiegelumgebung gesetzt, Umgebungslicht fern > nah, keine Seitenfehler.
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/vlook', { recursive: true })
const RACERS = (process.argv[2] || 'graffiti_jet_cruiser,crimson_flame_dragster').split(','), res = {}, shots = []
for (const id of RACERS) for (const on of [false, true]) {
  const { browser, page, errs } = await openPage(`#m1,car,debug,look=terrain3,world=probe,racer=${id}${on ? '' : ',vlook=0'}`, { viewport: { width: 960, height: 540 } })
  await page.waitForFunction(() => window.__kfbM2?.stats?.rig && window.__kfbM2?.stats?.model === 'OK', null, { timeout: 300000 }).catch(() => {})
  await page.waitForTimeout(2500)
  const near = await page.screenshot()
  const ei = async () => page.evaluate(() => { let v = null; window.__kfbM2.stats.rig?.stretch?.traverse((o) => { if (v == null && o.isMesh && o.material?.userData?.vehicleLook) { const p = new o.position.constructor(); o.getWorldPosition(p); const cam = window.__kfbStageCamera; v = { ei: +o.material.envMapIntensity.toFixed(3), env: !!o.material.envMap, d: cam ? +p.distanceTo(cam.position).toFixed(1) : null } } }); return v })
  const eNear = await ei()
  await page.mouse.move(480, 270); for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 600); await page.waitForTimeout(120) }
  await page.waitForTimeout(2200); const far = await page.screenshot(); const eFar = await ei()
  const look = await page.evaluate(() => window.__kfbM2.stats.look)
  res[`${id}:${on ? 'A' : 'orig'}`] = { look, eNear, eFar, errs: errs.slice(0, 3) }; shots.push({ id, on, near, far }); await browser.close()
}
const T = (b) => sharp(b).resize(480, 270).png().toBuffer(), rows = []
for (const s of shots) rows.push(await T(s.near), await T(s.far))
await sharp({ create: { width: 480 * 4, height: 270 * RACERS.length, channels: 3, background: '#222' } }).composite(rows.map((b, i) => ({ input: b, left: (i % 4) * 480, top: Math.floor(i / 4) * 270 }))).png().toFile('test/out/vlook/vlook-sheet.png')
console.log(JSON.stringify(res))
const A = RACERS.map((id) => res[`${id}:A`]), O = RACERS.map((id) => res[`${id}:orig`])
process.exit(report('vlook vehicle look A (Georg 21.10.)', {
  lookApplied: A.every((r) => r.look?.applied >= 1 && Object.values(r.look.gain).every((g) => g >= 0.85 && g <= 1.5)),
  envSet: A.every((r) => r.eNear?.env),
  farBrighterThanNear: A.every((r) => r.eFar?.ei > r.eNear?.ei),
  offSwitch: O.every((r) => r.look?.off),
  noPageErrors: [...A, ...O].every((r) => !r.errs.length),
}, { sheet: 'test/out/vlook/vlook-sheet.png' }))
