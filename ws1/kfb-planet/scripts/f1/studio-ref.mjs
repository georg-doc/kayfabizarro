// Studio-Referenz aufnehmen (Messwerte + Frontbild). Vorher: zsh scripts/f1/serve-studio.sh (läuft weiter), dann npm run build.
// Referenz: Georgs Studio aus dem Quellcode (Branch cloudflare-live, lokal ausgeliefert; die öffentliche Route liefert derzeit die Startseite), Batch-Import wie per Hand, Figur wählen, Frontansicht, Bindepose.
import fs from 'fs'
import { chromium } from 'playwright'
const BATCH = 'test/out/eye-rig-medium.batch-1.json' // von scripts/f1/serve-studio.sh bereitgelegt
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []
p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://127.0.0.1:8744/kfb-hub/stage/toolbox/eye-rig-batch/', { waitUntil: 'networkidle', timeout: 90000 })
await p.waitForFunction(() => window.__EYE_RIG_BATCH?.state?.eyes, null, { timeout: 90000 })
await p.setInputFiles('#importInput', BATCH)
await p.waitForSelector('#importPreview:not([hidden])', { timeout: 15000 })
await p.evaluate(() => document.querySelector('#acceptImportBtn').click()) // Georgs zweiter Klick: „Annehmen“
await p.waitForTimeout(1500)
await p.evaluate(() => document.querySelector('[data-actor-id="adventurer-rogue-hooded"]')?.click())
await p.waitForFunction(() => window.__EYE_RIG_BATCH.state.currentActorId === 'adventurer-rogue-hooded' && window.__EYE_RIG_BATCH.state.eyes && !window.__EYE_RIG_BATCH.state.switching, null, { timeout: 90000 })
await p.waitForTimeout(2500)
const res = await p.evaluate(() => {
  const B = window.__EYE_RIG_BATCH, s = B.state
  const rep = s.eyes.report()
  // gleiches Bildformat wie die R3F-Prüfszene (900 × 900), Kamera = setView('front')
  B.renderer.setPixelRatio(1); B.renderer.setSize(900, 900, false); B.camera.aspect = 1; B.camera.updateProjectionMatrix()
  B.camera.position.set(0, 1.48, 5.25); B.controls.target.set(0, 1.42, 0); B.controls.update()
  B.renderer.render(B.scene, B.camera)
  return { actor: s.currentActorId, review: s.profile?.reviewState, stageLook: s.stageLook, motion: s.currentMotion, rep: { eyeFrame: rep.eyeFrame, controls: rep.controls && { anchor: rep.controls.anchor, pupilSize: rep.controls.pupilSize, converge: rep.controls.converge, inset: rep.controls.inset, base: rep.controls.baseColor, gloss: rep.controls.gloss, lidFit: rep.controls.lidFit, splay: rep.controls.splay, oval: rep.controls.oval } }, png: B.renderer.domElement.toDataURL('image/png') }
})
fs.writeFileSync('test/out/f1_studio_front.png', Buffer.from(res.png.split(',')[1], 'base64'))
delete res.png
const full = await p.evaluate(() => window.__EYE_RIG_BATCH.state.eyes.report())
fs.writeFileSync('test/ref/f1_studio_rogue_hooded.report.json', JSON.stringify({ captured: new Date().toISOString(), source: 'eye-rig-batch app.js @ cloudflare-live (lokal ausgeliefert, scripts/f1/serve-studio.sh), Batch-Import eye-rig-medium.batch-1.json, Figur adventurer-rogue-hooded, Bindepose', eyeFrame: full.eyeFrame, controls: full.controls, faceHost: full.faceHost }, null, 1))
console.log(JSON.stringify({ ...res, errs: errs.slice(0, 5) }, null, 1))
await b.close()
