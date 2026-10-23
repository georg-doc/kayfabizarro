// WS-Audio R1 (V-598) · Vite-Erweiterung: private Töne und Musik NUR über den lokalen Dev-/Preview-Server unter /@kfb-audio/ (localhost).
// Nie im Build: dist (Einzeldatei, alles eingebettet) enthält keinen privaten Ton; ohne diesen Server bleibt das Spiel still bzw. bei den öffentlichen Klängen.
// Abschalten: KFB_AUDIO=off. Quellen und Zwischenspeicher: scripts/audio/prepare.mjs.
import fs from 'fs'
import path from 'path'
import { prepare, PRIVATE, CACHE } from './prepare.mjs'

const TYPES = { '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.json': 'application/json', '.md': 'text/plain; charset=utf-8' }
function roots(siteDir) {
  return {
    'index.json': path.join(CACHE, 'index.json'),
    wsa: path.join(CACHE, 'wsa/dist'),
    site: siteDir,
    el: path.join(PRIVATE, '40_AUDIO/elevenlabs_r1'),
    chatter: path.join(PRIVATE, '40_AUDIO/chatterbox_r1'), // Suno-Ernte (Musik-Katalog), nur lokal
    'music/suno': path.join(PRIVATE, 'music/suno-roadtrip-jukebox-v2'),
    'music/cozy': path.join(PRIVATE, 'music/cozy-tunes-classics/Audio/ogg/Tracks'),
  }
}
// Pfad sicher auflösen (kein ../ aus der Wurzel heraus)
export function resolveAudioPath(url, R) {
  let rel; try { rel = decodeURIComponent(url.split('?')[0]) } catch { return null }
  if (rel === 'index.json') return R['index.json']
  for (const key of ['music/suno', 'music/cozy', 'wsa', 'site', 'el', 'chatter']) {
    if (!rel.startsWith(key + '/')) continue
    const base = path.resolve(R[key]), p = path.resolve(base, rel.slice(key.length + 1))
    return p.startsWith(base + path.sep) ? p : null
  }
  return null
}
function serve(R) {
  return (req, res, next) => {
    if (!req.url.startsWith('/@kfb-audio/')) return next()
    const p = resolveAudioPath(req.url.slice('/@kfb-audio/'.length), R)
    if (!p || !fs.existsSync(p) || !fs.statSync(p).isFile()) { res.statusCode = 404; return res.end('not found') }
    const size = fs.statSync(p).size, type = TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream'
    res.setHeader('Content-Type', type); res.setHeader('Accept-Ranges', 'bytes'); res.setHeader('Cache-Control', 'no-store')
    const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '')
    if (m) { const a = m[1] ? +m[1] : size - +m[2], b = m[1] && m[2] ? Math.min(size - 1, +m[2]) : size - 1
      if (!(a >= 0 && a <= b)) { res.statusCode = 416; res.setHeader('Content-Range', `bytes */${size}`); return res.end() }
      res.statusCode = 206; res.setHeader('Content-Range', `bytes ${a}-${b}/${size}`); res.setHeader('Content-Length', b - a + 1); return fs.createReadStream(p, { start: a, end: b }).pipe(res) }
    res.setHeader('Content-Length', size); fs.createReadStream(p).pipe(res)
  }
}
export function kfbPrivateAudio() {
  const off = process.env.KFB_AUDIO === 'off'
  let mw = null
  const mount = (server) => { if (off) return; if (!mw) { const st = prepare({ quiet: true }); mw = serve(roots(st.siteDir)); console.log(`[kfb-audio] lokal: privat=${st.private} wsa=${st.wsa} atmo=${st.site} suno=${st.music.suno} cozy=${st.music.cozy}`) } server.middlewares.use(mw) }
  return { name: 'kfb-private-audio', apply: 'serve', configureServer: mount, configurePreviewServer: mount }
}
