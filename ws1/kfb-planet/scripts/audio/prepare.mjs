// WS-Audio R1 (V-598) · Ton-Zwischenspeicher für die volle Fassung, nur lokal. Nichts davon gehört in ein Repo oder in dist.
//   Quelle 1: ~/kfb-ws1/private-assets (privates Repo georg-doc/KFB-Stunt-Car-Race, Branch assets/private): ElevenLabs-Sätze, Suno-Jukebox, Cozy Tunes,
//             WSA-Laufzeit-Pakete als ZIP (Racer/Flug L1–L5 + P01–P06, Kampf C01–C18) → hier entpackt
//   Quelle 2: ~/kfb-ws1/kayfabizarro (öffentlich), Audio Site 0.7.6 auf audio/flight-crash-r1-2026-10-18 @945518d3: Atmo (CC0, V-458) und Schritte
//             (Kenney CC0 + Chequered Ink, Quittung in LICENCES.md) → per git archive in den Zwischenspeicher (kein Netz)
// Ziel: KFB_AUDIO_CACHE (Standard ~/kfb-ws1/.kfb-audio-cache), außerhalb jedes Repos. Aufruf: node scripts/audio/prepare.mjs (idempotent, schnell beim 2. Mal)
import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'
import zlib from 'zlib'

export const AUDIO_SITE_PIN = '945518d382ea0aacf62260325adc9a55a3eda241'
const HOME = os.homedir()
export const PRIVATE = process.env.KFB_PRIVATE_ASSETS || path.join(HOME, 'kfb-ws1/private-assets')
export const PUBLIC_REPO = process.env.KFB_PUBLIC_REPO || path.join(HOME, 'kfb-ws1/kayfabizarro')
export const CACHE = process.env.KFB_AUDIO_CACHE || path.join(HOME, 'kfb-ws1/.kfb-audio-cache')
const EL = '40_AUDIO/elevenlabs_r1'
const WSA_ZIP = 'WSA_AUDIO_FLIGHT_CRASH_R1_2026-10-18.zip' // Obermenge: Racer-Gitter + Flug P01–P06 + Kampf (gleiche SHA wie RUNTIME_RACER_COMBAT)

// ZIP ohne externes Werkzeug (Cloudflare-Build hat evtl. kein unzip): Zentralverzeichnis lesen, gespeicherte (0) bzw. deflate (8) Einträge schreiben
export function unzipTo(zip, outDir, want = () => true) {
  const b = fs.readFileSync(zip); let e = b.length - 22; while (e >= 0 && b.readUInt32LE(e) !== 0x06054b50) e--; if (e < 0) throw new Error('kein ZIP: ' + zip)
  let p = b.readUInt32LE(e + 16), n = b.readUInt16LE(e + 10), count = 0
  for (let i = 0; i < n; i++) {
    const method = b.readUInt16LE(p + 10), csize = b.readUInt32LE(p + 20), nl = b.readUInt16LE(p + 28), xl = b.readUInt16LE(p + 30), cl = b.readUInt16LE(p + 32), off = b.readUInt32LE(p + 42)
    const name = b.toString('utf8', p + 46, p + 46 + nl); p += 46 + nl + xl + cl
    if (name.endsWith('/') || !want(name)) continue
    const lo = off + 30 + b.readUInt16LE(off + 26) + b.readUInt16LE(off + 28), raw = b.subarray(lo, lo + csize)
    const data = method === 0 ? raw : method === 8 ? zlib.inflateRawSync(raw) : null; if (!data) throw new Error('ZIP-Verfahren ' + method + ': ' + name)
    const dst = path.resolve(outDir, name); if (!dst.startsWith(path.resolve(outDir) + path.sep)) continue
    fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.writeFileSync(dst, data); count++
  }
  return count
}
// Audio Site (öffentlich, CC0/Chequered Ink) ohne lokalen kayfabizarro-Klon: feste Dateiliste von GitHub (raw, gepinnter Commit) holen – kein Token nötig
export async function fetchSite(siteDir, { quiet = false } = {}) {
  const L = JSON.parse(fs.readFileSync(new URL('./site-files.json', import.meta.url), 'utf8')); let n = 0
  for (const f of L.files) { const dst = path.join(siteDir, f); if (fs.existsSync(dst)) continue
    const r = await fetch(`https://raw.githubusercontent.com/georg-doc/kayfabizarro/${L.pin}/${L.base}/${f.split('/').map(encodeURIComponent).join('/')}`); if (!r.ok) throw new Error('Audio Site ' + f + ': HTTP ' + r.status)
    fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.writeFileSync(dst, Buffer.from(await r.arrayBuffer())); n++ }
  fs.writeFileSync(path.join(siteDir, '.done'), L.pin); if (!quiet) console.log('[audio:prepare] Audio Site von GitHub:', n, 'Dateien'); return n
}
export function prepare({ quiet = false } = {}) {
  const say = (...a) => { if (!quiet) console.log('[audio:prepare]', ...a) }
  const out = { cache: CACHE, private: fs.existsSync(path.join(PRIVATE, EL)), site: false, wsa: false, music: { suno: 0, cozy: 0 }, sets: [] }
  fs.mkdirSync(CACHE, { recursive: true })
  // 1 · WSA-Paket entpacken (dist/racer, dist/combat)
  const zip = path.join(PRIVATE, EL, WSA_ZIP), wsaDir = path.join(CACHE, 'wsa')
  if (fs.existsSync(zip)) {
    const stamp = path.join(wsaDir, '.stamp'), sig = String(fs.statSync(zip).size)
    if (!fs.existsSync(stamp) || fs.readFileSync(stamp, 'utf8') !== sig) {
      fs.rmSync(wsaDir, { recursive: true, force: true }); fs.mkdirSync(wsaDir, { recursive: true })
      unzipTo(zip, wsaDir, (n) => n.startsWith('dist/racer/') || n.startsWith('dist/combat/')); fs.writeFileSync(stamp, sig); say('WSA entpackt', WSA_ZIP)
    }
    out.wsa = fs.existsSync(path.join(wsaDir, 'dist/racer/manifest.json')) && fs.existsSync(path.join(wsaDir, 'dist/combat/manifest.json'))
  } else say('fehlt (privat):', zip)
  // 2 · Audio Site (öffentlich): Atmo + Schritte aus dem Git-Objektspeicher
  const siteDir = path.join(CACHE, 'site-' + AUDIO_SITE_PIN.slice(0, 9))
  if (!fs.existsSync(path.join(siteDir, '.done'))) {
    try {
      execFileSync('git', ['-C', PUBLIC_REPO, 'cat-file', '-e', AUDIO_SITE_PIN + '^{commit}'], { stdio: 'ignore' })
      fs.mkdirSync(siteDir, { recursive: true })
      const tar = execFileSync('git', ['-C', PUBLIC_REPO, 'archive', '--format=tar', AUDIO_SITE_PIN, 'tools/KFB-Audio-Site/dist/ambience', 'tools/KFB-Audio-Site/dist/footsteps'], { maxBuffer: 1 << 30 })
      execFileSync('tar', ['-x', '-C', siteDir, '--strip-components=3'], { input: tar }); fs.writeFileSync(path.join(siteDir, '.done'), AUDIO_SITE_PIN); say('Audio Site @' + AUDIO_SITE_PIN.slice(0, 9), '→', siteDir)
    } catch (e) { say('Audio Site nicht lokal (', PUBLIC_REPO, ') – für die Site: fetchSite()') }
  }
  out.site = fs.existsSync(path.join(siteDir, 'ambience/licence-register.json'))
  out.siteDir = siteDir
  // 3 · Verzeichnis der privaten Musik und ElevenLabs-Sätze (Index für die Laufzeit)
  const list = (d, re) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => re.test(f)).sort() : [])
  const suno = list(path.join(PRIVATE, 'music/suno-roadtrip-jukebox-v2'), /\.mp3$/i)
  const cozy = list(path.join(PRIVATE, 'music/cozy-tunes-classics/Audio/ogg/Tracks'), /\.ogg$/i)
  out.music = { suno: suno.length, cozy: cozy.length }
  const sets = {}
  for (const f of list(path.join(PRIVATE, EL), /^[a-z_0-9]+\.json$/)) {
    const id = f.replace(/\.json$/, ''), dir = path.join(PRIVATE, EL, id); if (!fs.existsSync(dir)) continue
    const files = list(dir, /\.mp3$/i).map((x) => x.replace(/\.mp3$/i, ''))
    let gains = {}, norm = 'peak'; const rep = path.join(PRIVATE, EL, id + '_norm/normalize_report.json'), lufs = path.join(PRIVATE, EL, id + '_lufs/lufs_report.json')
    if (fs.existsSync(rep)) { const j = JSON.parse(fs.readFileSync(rep, 'utf8')); for (const r of Array.isArray(j) ? j : j.clips || []) if (r && r.id && Number.isFinite(r.gain_db)) gains[r.id] = r.gain_db }
    // WS0-Lautheit (−16 LUFS je Einzelklang, Combat-AV-Hinweis) geht vor der Spitzen-Normierung
    if (fs.existsSync(lufs)) { norm = 'lufs'; for (const r of JSON.parse(fs.readFileSync(lufs, 'utf8')).clips || []) if (r && r.id && Number.isFinite(r.gain_db)) gains[r.id] = r.gain_db }
    sets[id] = { files, gainDb: gains, norm }
  }
  out.sets = Object.keys(sets)
  const index = { schema: 'kfb.audio-private-index/1', builtAt: new Date().toISOString(), wsa: out.wsa, site: out.site, music: { suno, cozy }, sets }
  fs.writeFileSync(path.join(CACHE, 'index.json'), JSON.stringify(index))
  say(`privat=${out.private} wsa=${out.wsa} site=${out.site} suno=${suno.length} cozy=${cozy.length} sätze=${out.sets.length} → ${CACHE}`)
  return out
}

if (import.meta.url === 'file://' + process.argv[1]) prepare()
