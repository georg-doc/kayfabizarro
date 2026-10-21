// V-619 · 60-s-Fahrclip MIT TON durch mindestens 3 Biome und einen Wetterwechsel (klar → Regen über 22 s), aus der Spielkamera.
// Braucht den lokalen Vite-Server (private Töne nur über /@kfb-audio/, nie im Build): KFB_URL (Standard http://localhost:5199/). Aufnahme im Browser
// (MediaRecorder: Leinwand + Mix-Ausgang von kfbAudio), Ausgabe test/out/biome-drive/clip.webm (privat, bleibt lokal) + Standbilder + clip.json.
// Autopilot: Kurs halten (Lenken nach Gierfehler), Gas; Route = Startpunkt und Richtung, auf der in 1,1 km mindestens 3 Biome dominieren.
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const OUT = 'test/out/biome-drive'; fs.mkdirSync(OUT, { recursive: true })
const URL0 = (process.env.KFB_URL || 'http://localhost:5199/') + '#m1,debug,car,look=terrain3,world=endless,drivepanel=0,hour=16.2'
const SEC = +(process.env.CLIP_SEC || 60)
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message))
const file = path.join(OUT, 'clip.webm'); fs.writeFileSync(file, Buffer.alloc(0))
await page.exposeFunction('__saveClip', (b64) => { fs.appendFileSync(file, Buffer.from(b64, 'base64')) })
await page.goto(URL0)
await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbDrive?.veg()?.info().ready, null, { timeout: 240000 })
await page.mouse.click(640, 360); await page.keyboard.press('Shift')
await page.waitForFunction(() => (() => { const s = window.__kfbAudio?.stats?.(); return s && (s.mode === 'full' || (s.unlocked && s.modules?.ambience)) })(), null, { timeout: 60000 }).catch(() => {})
// Route suchen
const route = await page.evaluate(() => { const T = window.__kfbDrive.terrain(), F = T.field
  for (let k = 0; k < 4000; k++) { const a = k * 2.399963, r = 200 + 3000 * Math.sqrt(k / 4000), x = Math.cos(a) * r, z = Math.sin(a) * r, h = (k * 0.73) % (Math.PI * 2)
    const seq = []; let steep = 0; for (let d = 0; d <= 1100; d += 10) { const px = x + Math.sin(h) * d, pz = z + Math.cos(h) * d, b = F.dominant(px, pz).key; if (seq.at(-1) !== b) seq.push(b)
      const e = 2, s = Math.hypot(T.height(px + e, pz) - T.height(px - e, pz), T.height(px, pz + e) - T.height(px, pz - e)) / (2 * e); if (s > 0.45) steep++ }
    if (new Set(seq).size >= 3 && seq.length <= 5 && steep < 6 && F.dominant(x, z).w > 0.95) return { x, z, h, seq } }
  return null })
console.log('route', JSON.stringify(route))
await page.evaluate(async ({ x, z, h }) => { const D = window.__kfbDrive, T = D.terrain(), A = D.atmos; T.setFocus(x, z); T.flush()
  window.__kfbM2.setKind('k2b', { p: [x, T.surfaceAt(x, z) + 0.9, z], yaw: h }); A.setWeather('klar', { dur: 0.001 }); A.hour = 16.2; A.timeScale = 1 / 60
  await new Promise((r) => setTimeout(r, 2500)) }, route)
// Aufnahme + Fahrt
const res = await page.evaluate(async ({ SEC, h }) => {
  const M = window.__kfbM1, M2 = window.__kfbM2, D = window.__kfbDrive, A = D.atmos, cv = document.querySelector('canvas')
  const vs = cv.captureStream(30), as = window.__kfbAudio?.capture?.(), tracks = [...vs.getVideoTracks(), ...(as ? as.getAudioTracks() : [])]
  const rec = new MediaRecorder(new MediaStream(tracks), { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 8e6 })
  const pend = []; rec.ondataavailable = (e) => { if (e.data.size) pend.push(e.data.arrayBuffer().then((b) => { let s = ''; const u = new Uint8Array(b); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return window.__saveClip(btoa(s)) })) }
  rec.start(1000)
  const log = [], biomes = [], t0 = performance.now(); let wxAt = null, dts = [], last = t0
  await new Promise((res) => { const f = (now) => { const t = (now - t0) / 1000; dts.push(now - last); last = now
    const c = M2.car(); if (c) { let e = h - c.yaw(); e = Math.atan2(Math.sin(e), Math.cos(e)); M.input({ forward: true, leftward: e > 0.04, rightward: e < -0.04 }) }
    if (t > 16 && !wxAt) { A.setWeather('regen', { dur: 22 }); wxAt = t }
    if (log.length < t * 2) { const s = A.state(), p = c?.pos?.(); log.push({ t: +t.toFixed(1), biome: s.biome, w: s.W.rain, cover: s.W.cover, hour: +s.hour.toFixed(2), p: p && [+p.x.toFixed(0), +p.z.toFixed(0)] }); if (biomes.at(-1) !== s.biome) biomes.push(s.biome) }
    if (t < SEC) requestAnimationFrame(f); else res() }; requestAnimationFrame(f) })
  M.input(null); rec.stop(); await new Promise((r) => (rec.onstop = r)); await Promise.all(pend)
  const a = dts.slice(10).sort((x, y) => x - y)
  return { biomes, wxAt, log, audio: window.__kfbAudio?.stats?.(), driveAudio: D.audio(), fps: +(1000 / (a.reduce((s, v) => s + v, 0) / a.length)).toFixed(1), p95: a[Math.floor(a.length * 0.95)], hasAudio: !!as }
}, { SEC, h: route.h })
const size = fs.statSync(file).size
fs.writeFileSync(path.join(OUT, 'clip.json'), JSON.stringify({ route, ...res, size, errs }, null, 1))
console.log(JSON.stringify({ biomes: res.biomes, wxAt: res.wxAt, fps: res.fps, p95: res.p95, hasAudio: res.hasAudio, audioMode: res.audio?.mode, driveAudio: res.driveAudio, size, errs: errs.slice(0, 3) }))
await browser.close()
