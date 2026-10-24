// WS-Audio · Videos MIT Sprechblasen (Chatter-Silben A/B/C): Bild aus dem CDP-Screencast der ganzen Seite (DOM: Blasen, HUD) statt nur des
// Spiel-Canvas (scripts/audio/record.mjs zeigt keine Blasen – Hinweis WS-NPC 24.10.). Weg übernommen aus scripts/npc/record-talk.mjs (WS-NPC):
// Ton = kfbAudio.captureStream per MediaRecorder, beide mit Zeitstempeln derselben Uhr, danach in einem Tab zu EINEM MP4 gesetzt.
// Headless. Aufruf (mit Test-Slot): PW_GPU=1 node scripts/audio/record-dom.mjs → test/out/audio/dom/kfb-audio-silben.mp4 (privat, nur lokal)
import fs from 'fs'
import path from 'path'
import { startServer, openAudioPage } from '../../test/_audioServer.mjs'
import { SITE_HASH } from '../../src/siteHash.js'

const PROFILE = process.argv[2] || 'abc', OUT = 'test/out/audio/dom' + (PROFILE === 'abc' ? '' : '-' + PROFILE), W = 960, H = 540
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true })
const srv = await startServer(), wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function recordSegment(name, hash, seconds, script, opts = {}) {
  const dir = path.join(OUT, name); fs.mkdirSync(dir, { recursive: true })
  const { browser, page, errs } = await openAudioPage(srv.url, hash + ',debug', { viewport: { width: W, height: H } })
  if (opts.stage) {
    await page.waitForFunction(() => window.__kfbStageCtl?.deck, null, { timeout: 180000 }).catch(() => {})
    await wait(1500); await page.mouse.click(8, 8)
    await page.evaluate(async () => { window.__kfbA = await import('/src/audio/kfbAudio.js') })
    if (/chat=syl/.test(hash)) await page.waitForFunction(() => window.__kfbA.stats().loads?.total, null, { timeout: 120000 }).catch(() => {})
  } else {
    await page.waitForFunction((need) => window.__kfbM1?.status?.().amphTris > 0 && window.__kfbM1?.status?.().ready?.player === 'OK' && window.__kfbM1?.npc?.()?.status?.status === 'OK' && need.every((m) => window.__kfbM1.mods[m]?.status?.().status), opts.need || [], { timeout: 180000 }).catch(() => {})
    await wait(2500); if (opts.pre) { await opts.pre(page); await wait(2500) } // Figur VOR der Aufnahme hinstellen (Lande-Ton fällt nicht ins Video)
    await page.keyboard.press('KeyM'); await page.keyboard.press('KeyM')
    await page.waitForFunction(() => window.__kfbAudio?.stats?.().loads?.total, null, { timeout: 180000 }).catch(() => {})
    await page.evaluate(async () => { window.__kfbA = await import('/src/audio/kfbAudio.js') })
  }
  if (opts.hideBubbles) await page.addStyleTag({ content: '#ui-bubbles{visibility:hidden!important}' })
  await wait(1000)
  const afd = fs.openSync(path.join(dir, 'audio.webm'), 'w')
  await page.exposeFunction('__kfbDomChunk', (b64) => { fs.writeSync(afd, Buffer.from(b64, 'base64')) })
  const aStart = await page.evaluate(() => { const a = window.__kfbA.captureStream?.() || new AudioContext().createMediaStreamDestination().stream // Bühne ohne Ton (A): stille Spur
    const r = new MediaRecorder(a, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 160_000 }); let chain = Promise.resolve()
    r.ondataavailable = (e) => { if (!e.data.size) return; chain = chain.then(() => new Promise((res) => { const fr = new FileReader(); fr.onload = () => { window.__kfbDomChunk(fr.result.slice(fr.result.indexOf('base64,') + 7)).then(res) }; fr.readAsDataURL(e.data) })) }
    window.__kfbDomRec = { stop: () => new Promise((res) => { r.onstop = () => chain.then(res); r.stop() }) }; r.start(1000); return performance.timeOrigin + performance.now() })
  const cdp = await page.context().newCDPSession(page), frames = []
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => { const f = `f_${String(frames.length).padStart(5, '0')}.jpg`; fs.writeFileSync(path.join(dir, f), Buffer.from(data, 'base64')); frames.push({ f, t: +(metadata.timestamp * 1000 - aStart).toFixed(1) }); cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {}) })
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: W, maxHeight: H, everyNthFrame: 1 })
  const t0 = aStart, at = (s) => wait(Math.max(0, t0 + s * 1000 - Date.now())), marks = [], mark = (text) => marks.push({ t: +((Date.now() - t0) / 1000).toFixed(2), text })
  await script(page, at, mark); await at(seconds)
  await cdp.send('Page.stopScreencast'); await page.evaluate(() => window.__kfbDomRec.stop()); fs.closeSync(afd)
  const st = await page.evaluate(() => { const s = window.__kfbA.stats(); return { perf: s.perf, speak: s.speak, errors: s.errors } })
  await browser.close(); fs.writeFileSync(path.join(dir, 'frames.json'), JSON.stringify(frames))
  return { name, dir, frames: frames.length, fps: +(frames.length / seconds).toFixed(1), marks, errs, st }
}

const INST = { F01_trombone: 'Posaune', F10_oboe: 'Oboe', F03_accordion: 'Akkordeon', F02_clarinet: 'Klarinette', F08_talkbox: 'Talkbox', F11_tuba: 'Tuba', F04_ocarina: 'Okarina', F13_melodica: 'Melodica', F06_theremin: 'Theremin', F09_saw: 'Säge' }, NAME = { frizzlebob: 'FrizzleBob', gothgirl: 'gothgirl', farmer_b: 'Bäuerin', lorekeeper: 'Lorekeeper' }
const watch = (page, mark) => { let seen = 0; const iv = setInterval(async () => { try { const L = await page.evaluate(() => window.__kfbA.stats().speak?.log || []); for (const l of L.slice(seen)) if (l.fam) mark(`${NAME[l.who] || l.who} · ${INST[l.fam] || l.fam} · ${l.n} Silben`); seen = L.length } catch {} }, 250); return () => clearInterval(iv) }
const stage = (sec) => async (page, at, mark) => { const stop = watch(page, mark); await at(sec - 0.5); stop() }
const S = '#stage,actors=fb,dialog=6'
const ABC = [
  ['a', S, 22, 'A · heute: Bühnen-Dialog ohne Laut', stage(22), { stage: true }],
  ['b', S + ',chat=syl', 22, 'B · chat=syl: Silben ohne Blase', stage(22), { stage: true, hideBubbles: true }],
  ['c', S + ',chat=syl', 22, 'C · chat=syl: Silben mit Blase', stage(22), { stage: true }],
  ['tratsch', '#m1,harvest,look=terrain3,world=probe,npc,chat=syl', 22, 'C · Bewohner-Tratsch (tr1-Zeilen + Rufe, per Prüfskript)', async (page, at, mark) => {
    const stop = watch(page, mark), say = (id, t) => page.evaluate(({ id, t }) => window.__kfbSayTest('npc-' + id, [t]), { id, t })
    for (const [t, id, text] of [[1, 'lorekeeper', 'Run or Die, so go that way and don’t stop.'], [5, 'farmer_b', 'Boggle...?'], [8, 'lorekeeper', 'Escape Sequence runs you away from danger until you reach safety, and safety is a cutscene.'], [14, 'farmer_b', 'Bingo!'], [17, 'lorekeeper', 'Humbug?!']]) { await at(t); await say(id, text) }
    await at(21.5); stop() }, { pre: (page) => page.evaluate(() => { const M = window.__kfbM1, D = M.npc().debug, a = D.find((b) => b.id === 'farmer_b'), b = D.find((x) => x.id === 'lorekeeper'); if (!a || !b) return
      const cx = (a.x + b.x) / 2, cz = (a.z + b.z) / 2, x = cx - 7, z = cz - 7, w = Math.atan2(cx - x, cz - z); M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI, false) }) }],
]
// Abnahme V-734 (Georg 25.10.): sofort mit Ton, ≤ 60 s, ein Ort mit zwei Figuren, dann ein zweiter; je Sprecher die Familie im Bild; Live-Welt mit Site-Hash
// (+ npc/band/disco und chat=syl als Prüf-Schalter). Kein Teleport im Bild: Figur VOR der Aufnahme 11 m vor die Gruppe stellen, dann echt hingehen (Bemerken)
const LIVE = SITE_HASH + ',npc,band,disco,npct=200,chat=syl'
const place = (fn, d) => (page) => page.evaluate(({ fn, d }) => { const M = window.__kfbM1, q = new Function('M', fn)(M); if (!q) return; const p = M.feet(), dx = q[0] - p[0], dz = q[1] - p[2], l = Math.hypot(dx, dz) || 1, x = q[0] - dx / l * d, z = q[1] - dz / l * d, w = Math.atan2(q[0] - x, q[1] - z)
  M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI, false) }, { fn, d })
const approach = (fn, near) => async (page, at, mark) => { const stop = watch(page, mark); await at(0.4)
  const dist = () => page.evaluate((fn) => { const M = window.__kfbM1, q = new Function('M', fn)(M), p = M.feet(); return q ? Math.hypot(q[0] - p[0], q[1] - p[2]) : 0 }, fn)
  await page.keyboard.down('KeyW'); for (let i = 0; i < 60 && (await dist()) > near; i++) await wait(80); await page.keyboard.up('KeyW') // echt hingehen, Kamera folgt
  return stop }
const scene = (fn, near, secs) => async (page, at, mark) => { const stop = await approach(fn, near)(page, at, mark); await at(secs - 0.4); stop() }
const DISCO = 'return M.mods.disco.debug().at', BAND = 'return M.mods.band.debug().at'
const ABNAHME = [
  ['ort1-disco', LIVE, 30, 'Ort 1 · Disco K12 · FrizzleBob (MC) + Tänzer · Familie Talkbox', scene(DISCO, 5, 30), { pre: place(DISCO, 11), need: ['disco', 'band'] }],
  ['ort2-band', LIVE, 28, 'Ort 2 · Orc-Band · zwei Musiker · Familie Tuba', scene(BAND, 4.5, 28), { pre: place(BAND, 11), need: ['disco', 'band'] }],
]
const SEGMENTS = PROFILE === 'abnahme' ? ABNAHME : ABC
const segs = []
for (const [name, hash, seconds, label, script, opts] of SEGMENTS) { const s = await recordSegment(name, hash, seconds, script, opts); segs.push({ ...s, seconds, label }); console.log(JSON.stringify({ name, frames: s.frames, fps: s.fps, errs: s.errs.length, lines: s.marks.length })) }

fs.writeFileSync(path.join(OUT, 'stitch.html'), '<!doctype html><meta charset=utf-8><title>stitch</title><body style="margin:0;background:#000"></body>')
const { browser, page, errs } = await openAudioPage(srv.url, OUT + '/stitch.html', { viewport: { width: W, height: H } })
const outFile = path.join(OUT, PROFILE === 'abnahme' ? 'kfb-audio-silben-abnahme.mp4' : 'kfb-audio-silben.mp4'), fd = fs.openSync(outFile, 'w')
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
    const a = new Audio(s.base + '/audio.webm'); await new Promise((res) => { a.oncanplay = res; a.onerror = res; a.load(); setTimeout(res, 4000) })
    const src = ac.createMediaElementSource(a); src.connect(dest); src.connect(an); let sum = 0, n = 0, loud = 0, i = 0, last = null
    for (let k = 0; k < 12 && k < frames.length; k++) bmp(k)
    const t0 = performance.now(); a.play().catch(() => {})
    await new Promise((res) => { const draw = async () => { const k = (performance.now() - t0) / 1000
        while (i + 1 < frames.length && frames[i + 1].t / 1000 <= k) { cache.delete(i - 2); i++ }
        for (let j = i; j < i + 12 && j < frames.length; j++) bmp(j)
        const im = frames.length ? await bmp(i) : null; if (im) last = im; if (last) g.drawImage(last, 0, 0, W, H)
        if (k < 4.5) box(s.label, 52, 22)
        const m = [...s.marks].reverse().find((x) => k >= x.t && k < x.t + 2.4); if (m) box(m.text, H - 34, 24)
        an.getFloatTimeDomainData(pcm); let q = 0; for (const x of pcm) q += x * x; const rms = Math.sqrt(q / pcm.length); sum += rms; n++; if (rms > 0.003) loud++
        if (k >= s.seconds) return res(); requestAnimationFrame(draw) }; draw() })
    a.pause(); src.disconnect(); out.push({ label: s.label, meanRms: +(sum / Math.max(1, n)).toFixed(4), audibleShare: +(loud / Math.max(1, n)).toFixed(3) })
  }
  await new Promise((res) => { r.onstop = () => chain.then(res); r.stop() }); return out
}, { segs: segs.map((s) => ({ base: '/' + s.dir, label: s.label, marks: s.marks, seconds: s.seconds })), W, H })
fs.closeSync(fd); await browser.close(); srv.stop()
const report = { at: new Date().toISOString(), out: outFile, bytes: fs.statSync(outFile).size, levels, stitchErrs: errs, segments: segs.map(({ dir, ...x }) => x) }
fs.writeFileSync(path.join(OUT, 'record-report.json'), JSON.stringify(report, null, 1))
console.log(JSON.stringify({ out: outFile, mb: +(report.bytes / 1048576).toFixed(1), levels, segs: segs.map((s) => ({ name: s.name, frames: s.frames, fps: s.fps, marks: s.marks.map((m) => m.t + ' ' + m.text), errs: s.errs.slice(0, 2), perf: s.st.perf })) }))
