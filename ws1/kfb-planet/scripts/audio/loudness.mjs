// WS-Audio · Lautheit messen (ITU-R BS.1770-4 / EBU R128: K-Filter, 400-ms-Blöcke mit 75 % Überlappung, Tor −70 LUFS absolut und −10 LU relativ),
// headless im Browser (dekodiert wie das Spiel), über den lokalen Ton-Server. Kein Ton wird verändert – nur Ausgleichs-Pegel werden berechnet:
//   Einzeltöne der älteren ElevenLabs-Sätze (ohne WS0-_lufs-Bericht) → Ziel −16 LUFS wie WS0, Spitze nach Ausgleich ≤ −1 dBFS, Kappe ±12 dB
//   Musiktitel (Suno + Cozy) → alle auf −18 LUFS, damit Fahrt- und Fuß-Musik gleich laut sind (Spitze ≤ −1 dBFS)
// Ergebnis: <KFB_AUDIO_CACHE>/lufs-local.json; prepare.mjs übernimmt es in den Index (WS0-Bericht geht weiter vor). Aufruf: PW_GPU=1 node scripts/audio/loudness.mjs
import fs from 'fs'
import path from 'path'
import { startServer, openAudioPage } from '../../test/_audioServer.mjs'
import { CACHE, prepare } from './prepare.mjs'
import { uniqueTracks } from '../../src/audio/mixer.js'

const TARGET = { clip: -16, music: -18 }, CAP = 12, PEAK = -1
prepare({ quiet: true })
const idx = JSON.parse(fs.readFileSync(path.join(CACHE, 'index.json'), 'utf8'))
const jobs = []
for (const [set, s] of Object.entries(idx.sets)) if (s.norm !== 'lufs') for (const f of s.files) jobs.push({ kind: 'clip', key: set + '/' + f, url: `/@kfb-audio/el/${set}/${encodeURIComponent(f)}.mp3` })
// Gegenprobe: 6 Clips eines WS0-Satzes mit Bericht (lufs_in) mitmessen – Abweichung zeigt, ob die Messung zu WS0 passt
const CHECK = 'ws_audio_gaps_r1', rep = path.join(process.env.KFB_PRIVATE_ASSETS || path.join(process.env.HOME, 'kfb-ws1/private-assets'), '40_AUDIO/elevenlabs_r1', CHECK + '_lufs/lufs_report.json')
const ref = fs.existsSync(rep) ? Object.fromEntries(JSON.parse(fs.readFileSync(rep, 'utf8')).clips.map((c) => [c.id, c.lufs_in])) : {}
for (const f of Object.keys(ref).slice(0, 6)) jobs.push({ kind: 'check', key: CHECK + '/' + f, url: `/@kfb-audio/el/${CHECK}/${encodeURIComponent(f)}.mp3` })
for (const f of uniqueTracks(idx.music.suno)) jobs.push({ kind: 'music', key: 'suno/' + f, url: `/@kfb-audio/music/suno/${encodeURIComponent(f)}` })
for (const f of uniqueTracks(idx.music.cozy)) jobs.push({ kind: 'music', key: 'cozy/' + f, url: `/@kfb-audio/music/cozy/${encodeURIComponent(f)}` })
fs.mkdirSync('test/out/audio', { recursive: true }); fs.writeFileSync('test/out/audio/lufs.html', '<!doctype html><meta charset=utf-8><title>lufs</title><body></body>')
const srv = await startServer(), { browser, page } = await openAudioPage(srv.url, 'test/out/audio/lufs.html')
const out = { schema: 'kfb.audio-lufs-local/1', at: new Date().toISOString(), target: TARGET, clips: {}, music: {} }
try {
  for (let i = 0, step = 8; i < jobs.length; i += step) {
    step = jobs[i].kind === 'music' ? 1 : 8
    const res = await page.evaluate(async (batch) => {
      const ac = new OfflineAudioContext(2, 48000, 48000)
      // K-Filter (BS.1770): Hochregal +4 dB ab ~1,5 kHz, dann Hochpass ~38 Hz; Koeffizienten für die Abtastrate
      const kfilter = (x, fs) => { const out = new Float64Array(x.length)
        const f0 = 1681.974450955533, G = 3.999843853973347, Q = 0.7071752369554196, K = Math.tan(Math.PI * f0 / fs), Vh = 10 ** (G / 20), Vb = Vh ** 0.4996667741545416, a0 = 1 + K / Q + K * K
        const b = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0], a = [2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
        const f1 = 38.13547087602444, Q1 = 0.5003270373238773, K1 = Math.tan(Math.PI * f1 / fs), a01 = 1 + K1 / Q1 + K1 * K1, a1 = [2 * (K1 * K1 - 1) / a01, (1 - K1 / Q1 + K1 * K1) / a01]
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0, u1 = 0, u2 = 0, z1 = 0, z2 = 0
        for (let n = 0; n < x.length; n++) { const y = b[0] * x[n] + b[1] * x1 + b[2] * x2 - a[0] * y1 - a[1] * y2; x2 = x1; x1 = x[n]; y2 = y1; y1 = y
          const z = y - 2 * u1 + u2 - a1[0] * z1 - a1[1] * z2; u2 = u1; u1 = y; z2 = z1; z1 = z; out[n] = z }
        return out }
      const r = []
      for (const j of batch) { try {
        const buf = await ac.decodeAudioData(await (await fetch(j.url)).arrayBuffer()), fs = buf.sampleRate, ch = []
        let peak = 0; for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let n = 0; n < d.length; n++) { const v = Math.abs(d[n]); if (v > peak) peak = v } ch.push(kfilter(d, fs)) }
        const N = ch[0].length, blk = Math.round(0.4 * fs), hop = Math.round(0.1 * fs), ms = []
        if (N < blk) { let q = 0; for (const c of ch) for (let n = 0; n < N; n++) q += c[n] * c[n]; ms.push(q / N) } // kürzer als 400 ms: ganzer Clip, ungegatet
        else for (let s0 = 0; s0 + blk <= N; s0 += hop) { let q = 0; for (const c of ch) for (let n = s0; n < s0 + blk; n++) q += c[n] * c[n]; ms.push(q / blk) }
        const L = (m) => -0.691 + 10 * Math.log10(m + 1e-12), abs = ms.filter((m) => L(m) > -70)
        let lufs = -120; if (abs.length) { const rel = L(abs.reduce((a, b) => a + b, 0) / abs.length) - 10, g = abs.filter((m) => L(m) > rel); lufs = L((g.length ? g : abs).reduce((a, b) => a + b, 0) / (g.length || abs.length)) }
        r.push({ ...j, lufs: +lufs.toFixed(2), peakDb: +(20 * Math.log10(peak + 1e-12)).toFixed(2), seconds: +buf.duration.toFixed(2) })
      } catch (e) { r.push({ ...j, error: String(e.message || e) }) } }
      return r }, jobs.slice(i, i + step).filter((j, k) => k === 0 || j.kind === jobs[i].kind))
    if (res.length < step) step = res.length
    for (const x of res) { if (x.error) { console.log('[lufs] Fehler', x.key, x.error); continue }
      if (x.kind === 'check') { (out.check ||= {})[x.key] = { ours: x.lufs, ws0: ref[x.key.split('/')[1]], diff: +(x.lufs - ref[x.key.split('/')[1]]).toFixed(2) }; continue }
      const t = TARGET[x.kind], gain = Math.max(-CAP, Math.min(CAP, t - x.lufs, PEAK - x.peakDb)) // nicht über −1 dBFS Spitze
      ;(x.kind === 'clip' ? out.clips : out.music)[x.key] = { lufs: x.lufs, peakDb: x.peakDb, seconds: x.seconds, gainDb: +gain.toFixed(2) } }
    process.stdout.write(`\r[lufs] ${Math.min(i + step, jobs.length)}/${jobs.length}`)
  }
} finally { await browser.close(); srv.stop() }
fs.writeFileSync(path.join(CACHE, 'lufs-local.json'), JSON.stringify(out, null, 1))
const m = Object.values(out.music).map((x) => x.lufs), c = Object.values(out.clips).map((x) => x.lufs)
console.log('\n[lufs] Gegenprobe gegen WS0:', JSON.stringify(out.check || {}))
console.log(`[lufs] ${Object.keys(out.clips).length} Einzeltöne (LUFS ${Math.min(...c).toFixed(1)}…${Math.max(...c).toFixed(1)}), ${Object.keys(out.music).length} Titel (LUFS ${Math.min(...m).toFixed(1)}…${Math.max(...m).toFixed(1)}) → ${path.join(CACHE, 'lufs-local.json')}`)
