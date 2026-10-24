// WS-NPC · Abnahme-Video der Wechselrede (Lead 24.10., chat=syl): A heute · B Silben ohne Blase · C Silben + Blase (Disco, Orc-Band, gothgirl).
// Headless, kein sichtbares Fenster. Unterschied zu scripts/audio/record.mjs (WS-Audio): das Bild kommt aus dem CDP-Screencast der ganzen Seite
// (mit DOM, also mit Sprechblasen und HUD), nicht nur aus dem Spiel-Canvas. Ton = Ausgang des Mixers (kfbAudio.captureStream) per MediaRecorder.
// Beide tragen Zeitstempel derselben Uhr (Epoche) und werden danach in einem Tab zu EINEM Video gesetzt (MP4, Einblendung je Abschnitt und Zeile).
// Aufruf (mit Test-Slot, Vite-Server wie WS-Audio): PW_GPU=1 node scripts/npc/record-talk.mjs → test/out/npc/talkrec/kfb-npc-wechselrede.mp4 (privat: Musik, gekaufte Töne)
import fs from 'fs'
import path from 'path'
import { startServer, openAudioPage } from '../../test/_audioServer.mjs'

const OUT = 'test/out/npc/talkrec', W = 960, H = 540
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true })
const srv = await startServer()
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const face = (page, fn, d, side = 1) => page.evaluate(({ fn, d, side }) => { const M = window.__kfbM1, q = new Function('M', fn)(M); if (!q) return; const x = q[0] + side * d * 0.7071, z = q[1] + side * d * 0.7071, w = Math.atan2(q[0] - x, q[1] - z)
  M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI, false) }, { fn, d, side })

async function recordSegment(name, hash, seconds, script, opts = {}) {
  const dir = path.join(OUT, name); fs.mkdirSync(dir, { recursive: true })
  const { browser, page, errs } = await openAudioPage(srv.url, hash + ',debug', { viewport: { width: W, height: H } })
  await page.waitForFunction(() => window.__kfbM1?.status?.().amphTris > 0 && window.__kfbM1?.status?.().ready?.player === 'OK' && window.__kfbM1.mods.disco?.status?.().status && window.__kfbM1.mods.band?.status?.().status, null, { timeout: 180000 }).catch(() => {})
  await wait(2500)
  if (opts.pre) { await opts.pre(page); await wait(2500) }
  await page.keyboard.press('KeyM'); await page.keyboard.press('KeyM') // erste Eingabe (Ton frei), zu Fuß ohne Wirkung
  await page.waitForFunction(() => { const s = window.__kfbAudio?.stats?.(), m = s?.modules; return m && m.ambience && m.steps && m.music && s.loads.bank }, null, { timeout: 180000 }).catch(() => {})
  await page.evaluate(async () => { window.__kfbA = await import('/src/audio/kfbAudio.js') })
  if (opts.hideBubbles) await page.addStyleTag({ content: '#ui-bubbles{visibility:hidden!important}' })
  await wait(1200)
  // Ton
  const afd = fs.openSync(path.join(dir, 'audio.webm'), 'w')
  await page.exposeFunction('__kfbTalkChunk', (b64) => { fs.writeSync(afd, Buffer.from(b64, 'base64')) })
  const aStart = await page.evaluate(() => { const a = window.__kfbA.captureStream(), r = new MediaRecorder(a, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 160_000 }); let chain = Promise.resolve()
    r.ondataavailable = (e) => { if (!e.data.size) return; chain = chain.then(() => new Promise((res) => { const fr = new FileReader(); fr.onload = () => { window.__kfbTalkChunk(fr.result.slice(fr.result.indexOf('base64,') + 7)).then(res) }; fr.readAsDataURL(e.data) })) }
    window.__kfbTalkRec = { stop: () => new Promise((res) => { r.onstop = () => chain.then(res); r.stop() }) }; r.start(1000); return performance.timeOrigin + performance.now() })
  // Bild (CDP-Screencast, mit DOM)
  const cdp = await page.context().newCDPSession(page), frames = []
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => { const f = `f_${String(frames.length).padStart(5, '0')}.jpg`; fs.writeFileSync(path.join(dir, f), Buffer.from(data, 'base64')); frames.push({ f, t: +(metadata.timestamp * 1000 - aStart).toFixed(1) }); cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {}) })
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: W, maxHeight: H, everyNthFrame: 1 })
  const t0 = aStart, at = (s) => wait(Math.max(0, t0 + s * 1000 - Date.now())), marks = []
  const mark = (text) => marks.push({ t: +((Date.now() - t0) / 1000).toFixed(2), text })
  await script(page, at, mark)
  await at(seconds)
  await cdp.send('Page.stopScreencast'); await page.evaluate(() => window.__kfbTalkRec.stop()); fs.closeSync(afd)
  const talk = await page.evaluate(() => ({ log: window.__kfbM1.mods.talk?.log() || [], stats: window.__kfbM1.mods.talk?.stats() || null, speak: window.__kfbA.stats().speak || null }))
  await browser.close()
  fs.writeFileSync(path.join(dir, 'frames.json'), JSON.stringify(frames))
  return { name, dir, frames: frames.length, fps: +(frames.length / seconds).toFixed(1), marks, errs, talk }
}

const watchTalk = (page, mark) => { let seen = 0; const iv = setInterval(async () => { try { const L = await page.evaluate(() => window.__kfbM1.mods.talk?.log() || []); for (const l of L.slice(seen)) mark(`${l.anchor.replace(/^(disco|band)-/, '')} · ${l.text}`); seen = L.length } catch {} }, 250); return () => clearInterval(iv) }
const watchEv = (page, mark) => { let seen = 0; const iv = setInterval(async () => { try { const ev = await page.evaluate(() => window.__kfbA.stats().events.filter((e) => e.type === 'chatter' || e.type === 'greet').map((e) => e.cue)); for (const c of ev.slice(seen)) mark('Ereignislaut ' + c); seen = ev.length } catch {} }, 400); return () => clearInterval(iv) }
const HASH = '#m1,harvest,look=terrain3,npc,band,disco,npct=200', DISCO = 'return M.mods.disco.debug().at', BAND = 'return M.mods.band.debug().at'
const GOTH = 'const o = M.mods.partner.object3d, p = o.getWorldPosition(new (o.position.constructor)()); return [p.x, p.z]'
// Figur vor der Aufnahme knapp außerhalb des Bemerken-Radius auf derselben Blickachse (die Kamera folgt weich; nur Sprecher im Bild sprechen), bei 1 s heran
const scene = (fn, near, syl, secs, side = -1) => async (page, at, mark) => { const stop = syl ? watchTalk(page, mark) : watchEv(page, mark); await at(1); await face(page, fn, near, side); await at(secs - 0.5); stop() }
const SEGMENTS = [
  ['a-disco', HASH, 45, 'A · heute · Disco: Ereignislaut, keine Blase', scene(DISCO, 5.5, false, 45), { pre: (p) => face(p, DISCO, 10, -1) }],
  ['b-disco', HASH + ',chat=syl', 45, 'B · chat=syl · Disco: Silben ohne Blase', scene(DISCO, 5.5, true, 45), { pre: (p) => face(p, DISCO, 10, -1), hideBubbles: true }],
  ['c-disco', HASH + ',chat=syl', 45, 'C · chat=syl · Disco: Silben + Blase', scene(DISCO, 5.5, true, 45), { pre: (p) => face(p, DISCO, 10, -1) }],
  ['c-band', HASH + ',chat=syl', 45, 'C · chat=syl · Orc-Band: Silben + Blase', scene(BAND, 7, true, 45, 1), { pre: (p) => face(p, BAND, 11, 1) }],   // Seite +1: auf −1 steht ein Baum vor der Kamera
  ['c-goth', HASH + ',chat=syl', 14, 'C · chat=syl · gothgirl: Silben + Blase', scene(GOTH, 2.8, true, 14, 1), { pre: (p) => face(p, GOTH, 6, 1) }],
]
const only = process.argv[2] ? new Set(process.argv[2].split(',')) : null
const segs = []
for (const [name, hash, seconds, label, script, opts] of SEGMENTS) if (!only || only.has(name)) { const s = await recordSegment(name, hash, seconds, script, opts); segs.push({ ...s, seconds, label }); console.log(JSON.stringify({ name, frames: s.frames, fps: s.fps, errs: s.errs.length, lines: s.talk.log.length })) }

// Zusammensetzen: je Abschnitt Ton abspielen und die Bilder nach Zeitstempel dazu zeichnen; Einblendung Abschnitt (4,5 s) und Zeile (2,1 s)
fs.writeFileSync(path.join(OUT, 'stitch.html'), '<!doctype html><meta charset=utf-8><title>stitch</title><body style="margin:0;background:#000"></body>')
const { browser, page, errs } = await openAudioPage(srv.url, OUT + '/stitch.html', { viewport: { width: W, height: H } })
const outFile = path.join(OUT, 'kfb-npc-wechselrede.mp4'), fd = fs.openSync(outFile, 'w')
await page.exposeFunction('__kfbRecChunk', (b64) => { fs.writeSync(fd, Buffer.from(b64, 'base64')) })
const levels = await page.evaluate(async ({ segs, W, H }) => {
  document.body.innerHTML = ''; const c = document.createElement('canvas'); c.width = W; c.height = H; document.body.append(c); const g = c.getContext('2d')
  const ac = new AudioContext(), dest = ac.createMediaStreamDestination(), an = ac.createAnalyser(); an.fftSize = 2048; const pcm = new Float32Array(2048)
  const r = new MediaRecorder(new MediaStream([...c.captureStream(30).getVideoTracks(), ...dest.stream.getAudioTracks()]), { mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', videoBitsPerSecond: 1_600_000, audioBitsPerSecond: 160_000 })
  let chain = Promise.resolve()
  r.ondataavailable = (e) => { if (!e.data.size) return; chain = chain.then(() => new Promise((res) => { const fr = new FileReader(); fr.onload = () => { window.__kfbRecChunk(fr.result.slice(fr.result.indexOf('base64,') + 7)).then(res) }; fr.readAsDataURL(e.data) })) }
  const box = (text, y, size) => { g.font = `600 ${size}px system-ui`; const w = Math.min(W - 48, g.measureText(text).width); g.fillStyle = 'rgba(30,22,14,.74)'; g.fillRect(24, y - size * 1.25, w + 32, size * 1.75); g.fillStyle = '#f4e7cf'; g.fillText(text, 40, y, W - 80) }
  r.start(1000); const out = []
  for (const s of segs) {
    const frames = await (await fetch(s.base + '/frames.json')).json(), cache = new Map()
    const bmp = (i) => { if (!cache.has(i)) cache.set(i, fetch(s.base + '/' + frames[i].f).then((x) => x.blob()).then((b) => createImageBitmap(b)).catch(() => null)); return cache.get(i) }
    const a = new Audio(s.base + '/audio.webm'); await new Promise((res, rej) => { a.oncanplay = res; a.onerror = () => rej(new Error('Ton nicht lesbar: ' + s.base)); a.load() })
    const src = ac.createMediaElementSource(a); src.connect(dest); src.connect(an); let sum = 0, n = 0, loud = 0, i = 0, last = null
    for (let k = 0; k < 12 && k < frames.length; k++) bmp(k)
    const t0 = performance.now(); a.play()
    await new Promise((res) => { const draw = async () => { const k = (performance.now() - t0) / 1000
        while (i + 1 < frames.length && frames[i + 1].t / 1000 <= k) { cache.delete(i - 2); i++ }
        for (let j = i; j < i + 12 && j < frames.length; j++) bmp(j)
        const im = await bmp(i); if (im) last = im; if (last) g.drawImage(last, 0, 0, W, H)
        if (k < 4.5) box(s.label, 52, 22)
        const m = [...s.marks].reverse().find((x) => k >= x.t && k < x.t + 2.4); if (m) box(m.text, H - 34, 24)
        an.getFloatTimeDomainData(pcm); let q = 0; for (const x of pcm) q += x * x; const rms = Math.sqrt(q / pcm.length); sum += rms; n++; if (rms > 0.003) loud++
        if (k >= s.seconds || a.ended) return res(); requestAnimationFrame(draw) }; draw() })
    a.pause(); src.disconnect(); out.push({ label: s.label, meanRms: +(sum / Math.max(1, n)).toFixed(4), audibleShare: +(loud / Math.max(1, n)).toFixed(3) })
  }
  await new Promise((res) => { r.onstop = () => chain.then(res); r.stop() }); return out
}, { segs: segs.map((s) => ({ base: '/' + s.dir, label: s.label, marks: s.marks, seconds: s.seconds })), W, H })
fs.closeSync(fd); await browser.close(); srv.stop()
const report = { at: new Date().toISOString(), out: outFile, bytes: fs.statSync(outFile).size, levels, stitchErrs: errs, segments: segs.map(({ dir, ...x }) => x) }
fs.writeFileSync(path.join(OUT, 'record-report.json'), JSON.stringify(report, null, 1))
console.log(JSON.stringify({ out: outFile, mb: +(report.bytes / 1048576).toFixed(1), levels, segs: segs.map((s) => ({ name: s.name, frames: s.frames, fps: s.fps, lines: s.talk.log.length, errs: s.errs.slice(0, 2) })) }))
