// Bewegtes Paar Studio | R3F (6 Schritte). Vorher: zsh scripts/f1/serve-studio.sh und npm run build. Ergebnis: test/out/f1_pair_motion.png
// Bewegtes Paar Studio | R3F: gleiche Abfolge über dieselbe EyeRig-API, je Schritt ein Bild aus gleicher Kamera.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const STEPS = [['front', null], ['links', [-0.85, 0]], ['rechts', [0.85, 0]], ['Lid zu (Mitte Lidschlag)', 'blinkhold'], ['hoch', [0, 0.7]], ['zurück (life)', 'life']]
const BATCH = 'test/out/eye-rig-medium.batch-1.json' // von scripts/f1/serve-studio.sh bereitgelegt
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const crop = (page) => page.screenshot({ clip: { x: 250, y: 90, width: 400, height: 260 } })
// R3F
const r = await b.newPage({ viewport: { width: 900, height: 900 } })
await r.goto('file://' + path.resolve('dist/index.html') + '#eyetest,debug')
await r.waitForFunction(() => window.__kfbEyeActor?.status().status === 'OK', null, { timeout: 60000 }); await r.waitForTimeout(800)
// Studio (Quelle, lokal ausgeliefert)
const s = await b.newPage({ viewport: { width: 1400, height: 900 } })
await s.goto('http://127.0.0.1:8744/kfb-hub/stage/toolbox/eye-rig-batch/', { waitUntil: 'networkidle', timeout: 90000 })
await s.waitForFunction(() => window.__EYE_RIG_BATCH?.state?.eyes, null, { timeout: 90000 })
await s.setInputFiles('#importInput', BATCH); await s.waitForSelector('#importPreview:not([hidden])'); await s.evaluate(() => document.querySelector('#acceptImportBtn').click())
await s.waitForTimeout(1000); await s.evaluate(() => document.querySelector('[data-actor-id="adventurer-rogue-hooded"]').click())
await s.waitForFunction(() => window.__EYE_RIG_BATCH.state.currentActorId === 'adventurer-rogue-hooded' && !window.__EYE_RIG_BATCH.state.switching, null, { timeout: 90000 }); await s.waitForTimeout(1500)
const studioShot = () => s.evaluate(() => { const B = window.__EYE_RIG_BATCH; B.renderer.setPixelRatio(1); B.renderer.setSize(900, 900, false); B.camera.aspect = 1; B.camera.updateProjectionMatrix(); B.camera.position.set(0, 1.48, 5.25); B.controls.target.set(0, 1.42, 0); B.controls.update(); B.renderer.render(B.scene, B.camera); return B.renderer.domElement.toDataURL('image/png') })
const frames = []
for (const [label, act] of STEPS) {
  // Lidschlag für die Aufnahme in der Mitte halten (beide Seiten gleich), danach wieder freigeben
  const hold = (rig, on) => { if (on) { rig.__dur = rig.blink.dur; rig.blink.dur = 1e6; rig._blinkK = 0.5 } else { rig.blink.dur = rig.__dur ?? rig.blink.dur; rig._blinkK = -1 } }
  await r.evaluate((a) => { const E = window.__kfbEyeActor; const rig = E.debugRig(); if (a !== 'blinkhold' && rig.__dur) { rig.blink.dur = rig.__dur; rig._blinkK = -1 } if (a === 'blinkhold') { rig.__dur = rig.blink.dur; rig.blink.dur = 1e6; rig._blinkK = 0.5 } else if (a === 'life') E.lookAt(null); else if (a) E.lookAt(a[0], a[1]) }, act)
  await s.evaluate((a) => { const e = window.__EYE_RIG_BATCH.state.eyes, rig = e.rig; if (a !== 'blinkhold' && rig.__dur) { rig.blink.dur = rig.__dur; rig._blinkK = -1 } if (a === 'blinkhold') { rig.__dur = rig.blink.dur; rig.blink.dur = 1e6; rig._blinkK = 0.5 } else if (a === 'life') e.setGazeFollow(false); else if (a) { e.setGazeFollow(true); e.setPointer(a[0], a[1]) } }, act)
  if (act === 'blinkhold') await s.evaluate(() => { const B = window.__EYE_RIG_BATCH; B.state.eyes.update(1 / 60) })
  await r.waitForTimeout(700)
  const rr = await crop(r), ss = await studioShot()
  frames.push({ label, r3f: 'data:image/png;base64,' + rr.toString('base64'), studio: ss })
}
const sheet = await r.evaluate(async (frames) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u })
  const W = 400, H = 260, c = document.createElement('canvas'); c.width = 2 * W + 130; c.height = frames.length * (H + 6) + 30; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height)
  g.fillStyle = '#000'; g.font = '18px sans-serif'; g.fillText('Studio (Quelle)', 130, 20); g.fillText('R3F · WS1 F1', 130 + W + 6, 20)
  for (let i = 0; i < frames.length; i++) { const y = 30 + i * (H + 6); const st = await load(frames[i].studio), rr = await load(frames[i].r3f); g.drawImage(st, 250, 90, 400, 260, 130, y, W, H); g.drawImage(rr, 130 + W + 6, y, W, H); g.fillStyle = '#000'; g.fillText(frames[i].label, 6, y + H / 2) }
  return c.toDataURL('image/png')
}, frames)
fs.writeFileSync('test/out/f1_pair_motion.png', Buffer.from(sheet.split(',')[1], 'base64'))
await b.close(); console.log('ok')
