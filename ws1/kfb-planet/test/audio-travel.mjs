// WS-Audio · S1 Fortbewegung (travel=1, Lead 25.10.): Auto wird zur Laufzeit ein- und ausgehängt (carLive statt M2_ON). Motorton startet beim
// Einhängen/Fahren und blendet beim Aussteigen weich aus (Motor-Regler ~1 s auf 0, nach 3 s gestoppt). Headless, Vite-Server mit privatem Ton
// (sonst SKIP). Aufruf: PW_GPU=1 node test/audio-travel.mjs
import fs from 'fs'
import os from 'os'
import path from 'path'
import { report } from './_page.mjs'
import { startServer, openAudioPage } from './_audioServer.mjs'

if (!fs.existsSync(path.join(process.env.KFB_PRIVATE_ASSETS || path.join(os.homedir(), 'kfb-ws1/private-assets'), '40_AUDIO/elevenlabs_r1'))) { console.log('PASS audio-travel (skip)'); process.exit(0) }
const srv = await startServer(); let out = {}
try {
  const { browser, page, errs } = await openAudioPage(srv.url, '#m1,harvest,look=terrain3,world=probe,travel=1,debug')
  const poll = async (fn, n = 180) => { for (let i = 0; i < n; i++) { if (await page.evaluate(fn).catch(() => false)) return true; await page.waitForTimeout(1000) } return false }
  await poll(() => { try { return window.__kfbM1.status().ready.player === 'OK' && !!window.__kfbTravel } catch { return false } })
  await page.keyboard.press('KeyM'); await page.keyboard.press('KeyM')
  await poll(() => { try { const s = window.__kfbAudio.stats(); return !!(s.loads.total && s.modules.racer) } catch { return false } })
  const rs = () => page.evaluate(() => { const s = window.__kfbAudio.stats(); return { mode: s.mode2, racer: s.racer && { on: s.racer.on, gain: s.racer.gain, rpm: s.racer.rpm, loops: s.racer.loops }, state: window.__kfbTravel.sm.state } })
  out.foot0 = await rs()
  await page.evaluate(() => window.__kfbTravel.click()); await poll(() => window.__kfbTravel.sm.state === 'drive', 20); await page.waitForTimeout(800)
  await page.keyboard.down('KeyW'); await page.waitForTimeout(2500); out.drive = await rs(); await page.keyboard.up('KeyW')
  await page.evaluate(() => window.__kfbTravel.click()); await poll(() => window.__kfbTravel.sm.state === 'foot', 20); await page.waitForTimeout(1500); out.exit15 = await rs()
  await page.waitForTimeout(2500); out.exit40 = await rs(); out.errs = errs
  await browser.close()
} finally { srv.stop() }
fs.mkdirSync('test/out/audio', { recursive: true }); fs.writeFileSync('test/out/audio/travel.json', JSON.stringify(out, null, 1))
process.exit(report('audio-travel', {
  startOnFootNoEngine: out.foot0.mode === 'foot' && !out.foot0.racer?.on,
  engineOnWhenDriving: out.drive.state === 'drive' && out.drive.mode === 'drive' && out.drive.racer?.on === true && out.drive.racer.gain > 0.9 && out.drive.racer.rpm > 0,
  softFadeOnExit: out.exit15.mode === 'foot' && out.exit15.racer?.gain < 0.1,
  stoppedAfterExit: out.exit40.racer?.on === false,
  noPageErrors: out.errs.length === 0,
}, out))
