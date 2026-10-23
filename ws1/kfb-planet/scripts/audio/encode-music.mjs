// WS-Audio · Musik kleiner kodieren (Georg 23.10., Konzept Status 16): alle Jukebox-Titel (Suno + Cozy, je Titel ein Format wie die Laufzeit)
// als AAC-LC in .m4a mit 128 kbit/s (macOS afconvert, Apple-AAC, höchste Encoder-Qualität). Suno-MP3 liest afconvert direkt; Cozy-Ogg wird headless
// im Browser in der Quell-Abtastrate zu WAV dekodiert (afconvert liest kein Ogg). Lautheit je Titel vorher/nachher (BS.1770) im Bericht.
// Ergebnis: <KFB_AUDIO_CACHE>/music-aac128/{suno,cozy}/*.m4a + music-aac128.json. Aufruf: PW_GPU=1 node scripts/audio/encode-music.mjs [--kbps 128]
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { execFileSync } from 'child_process'
import { startServer, openAudioPage } from '../../test/_audioServer.mjs'
import { CACHE, PRIVATE, prepare } from './prepare.mjs'
import { uniqueTracks } from '../../src/audio/mixer.js'

const KBPS = +(process.argv[process.argv.indexOf('--kbps') + 1] || 128) || 128
const OUT = path.join(CACHE, `music-aac${KBPS}`), SRC = { suno: path.join(PRIVATE, 'music/suno-roadtrip-jukebox-v2'), cozy: path.join(PRIVATE, 'music/cozy-tunes-classics/Audio/ogg/Tracks') }
prepare({ quiet: true })
const idx = JSON.parse(fs.readFileSync(path.join(CACHE, 'index.json'), 'utf8'))
// BS.1770 (wie loudness.mjs): K-Filter, 400-ms-Blöcke, Tor −70 absolut / −10 relativ
const LUFS = `(buf) => { const kf = (x, fs) => { const out = new Float64Array(x.length)
  const f0 = 1681.974450955533, G = 3.999843853973347, Q = 0.7071752369554196, K = Math.tan(Math.PI * f0 / fs), Vh = 10 ** (G / 20), Vb = Vh ** 0.4996667741545416, a0 = 1 + K / Q + K * K
  const b = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0], a = [2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
  const f1 = 38.13547087602444, Q1 = 0.5003270373238773, K1 = Math.tan(Math.PI * f1 / fs), a01 = 1 + K1 / Q1 + K1 * K1, a1 = [2 * (K1 * K1 - 1) / a01, (1 - K1 / Q1 + K1 * K1) / a01]
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, u1 = 0, u2 = 0, z1 = 0, z2 = 0
  for (let n = 0; n < x.length; n++) { const y = b[0] * x[n] + b[1] * x1 + b[2] * x2 - a[0] * y1 - a[1] * y2; x2 = x1; x1 = x[n]; y2 = y1; y1 = y; const z = y - 2 * u1 + u2 - a1[0] * z1 - a1[1] * z2; u2 = u1; u1 = y; z2 = z1; z1 = z; out[n] = z } return out }
  const fs = buf.sampleRate, ch = []; let peak = 0; for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (const v of d) if (Math.abs(v) > peak) peak = Math.abs(v); ch.push(kf(d, fs)) }
  const N = ch[0].length, blk = Math.round(0.4 * fs), hop = Math.round(0.1 * fs), ms = []; for (let s0 = 0; s0 + blk <= N; s0 += hop) { let q = 0; for (const c of ch) for (let n = s0; n < s0 + blk; n++) q += c[n] * c[n]; ms.push(q / blk) }
  const L = (m) => -0.691 + 10 * Math.log10(m + 1e-12), abs = ms.filter((m) => L(m) > -70), rel = L(abs.reduce((a, b) => a + b, 0) / abs.length) - 10, g = abs.filter((m) => L(m) > rel)
  return { lufs: +L(g.reduce((a, b) => a + b, 0) / g.length).toFixed(2), peakDb: +(20 * Math.log10(peak)).toFixed(2), sec: +buf.duration.toFixed(2), rate: buf.sampleRate } }`
const wav = (file, pcm, rate, chs) => { const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(chs, 22); h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * chs * 2, 28); h.writeUInt16LE(chs * 2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); fs.writeFileSync(file, Buffer.concat([h, pcm])) }
const oggRate = (p) => { const b = fs.readFileSync(p), v = b.indexOf('vorbis'); return b.readUInt32LE(v + 11) }
const aac = (src, dst) => execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', String(KBPS * 1000), '-q', '127', src, dst])

fs.mkdirSync(path.join(OUT, 'suno'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'cozy'), { recursive: true }); fs.mkdirSync('test/out/audio', { recursive: true })
fs.writeFileSync('test/out/audio/stitch.html', '<!doctype html><meta charset=utf-8><title>enc</title><body></body>')
const srv = await startServer(), { browser, page } = await openAudioPage(srv.url, 'test/out/audio/stitch.html')
await page.route('**/enc/**', (r) => r.fulfill({ path: path.join(OUT, decodeURIComponent(new URL(r.request().url()).pathname.split('/enc/')[1])) }))
let chunks = []; await page.exposeFunction('__encChunk', (b) => { chunks.push(Buffer.from(b, 'base64')) })
const measure = (url, rate, pcm) => page.evaluate(async ({ url, rate, LUFS, pcm }) => { const ac = new OfflineAudioContext(2, rate, rate), buf = await ac.decodeAudioData(await (await fetch(url)).arrayBuffer()), m = eval(LUFS)(buf)
  if (pcm) { const n = buf.length, chs = buf.numberOfChannels, out = new Int16Array(n * chs), d = [...Array(chs)].map((_, c) => buf.getChannelData(c)); for (let i = 0; i < n; i++) for (let c = 0; c < chs; c++) out[i * chs + c] = Math.max(-32768, Math.min(32767, Math.round(d[c][i] * 32767)))
    const u8 = new Uint8Array(out.buffer); for (let i = 0; i < u8.length; i += 3 << 20) { let s = ''; const part = u8.subarray(i, i + (3 << 20)); for (let j = 0; j < part.length; j += 0x8000) s += String.fromCharCode.apply(null, part.subarray(j, j + 0x8000)); await window.__encChunk(btoa(s)) } m.chs = chs }
  return m }, { url, rate, LUFS, pcm })
const report = { schema: 'kfb.audio-music-aac/1', codec: 'aac-lc', container: 'm4a', kbps: KBPS, at: new Date().toISOString(), tracks: {} }
try {
  for (const list of ['suno', 'cozy']) for (const file of uniqueTracks(idx.music[list])) {
    const src = path.join(SRC[list], file), name = file.replace(/\.[^.]+$/, '') + '.m4a', dst = path.join(OUT, list, name)
    const rate = list === 'cozy' ? oggRate(src) : 48000; chunks = []
    const before = await measure(`/@kfb-audio/music/${list}/${encodeURIComponent(file)}`, rate, list === 'cozy')
    if (list === 'cozy') { const tmp = path.join(OUT, '_tmp.wav'); wav(tmp, Buffer.concat(chunks), before.rate, before.chs); aac(tmp, dst); fs.rmSync(tmp) } else aac(src, dst)
    const after = await measure(srv.url + 'enc/' + encodeURIComponent(list) + '/' + encodeURIComponent(name), rate, false), buf = fs.readFileSync(dst)
    report.tracks[list + '/' + name] = { src: list + '/' + file, sec: after.sec, bytes: buf.length, kbps: Math.round(buf.length * 8 / after.sec / 1000), sha256: crypto.createHash('sha256').update(buf).digest('hex'),
      lufsSrc: before.lufs, lufs: after.lufs, dLU: +(after.lufs - before.lufs).toFixed(2), peakDb: after.peakDb, srcBytes: fs.statSync(src).size }
    process.stdout.write(`\r[encode] ${Object.keys(report.tracks).length} ${list}/${name}`.padEnd(90))
  }
} finally { await browser.close(); srv.stop() }
const T = Object.values(report.tracks), sum = (k) => T.reduce((s, t) => s + t[k], 0)
report.total = { tracks: T.length, mb: +(sum('bytes') / 1048576).toFixed(1), srcMb: +(sum('srcBytes') / 1048576).toFixed(1), maxMb: +(Math.max(...T.map((t) => t.bytes)) / 1048576).toFixed(2), maxDLU: Math.max(...T.map((t) => Math.abs(t.dLU))) }
fs.writeFileSync(path.join(OUT, `music-aac${KBPS}.json`), JSON.stringify(report, null, 1))
console.log('\n' + JSON.stringify(report.total))
