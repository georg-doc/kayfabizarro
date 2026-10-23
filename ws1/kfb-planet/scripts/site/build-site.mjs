// MVP-Site (V-618, Georg 22.10.: eigenes privates Projekt unter KFB-Stunt-Car-Race, Login per Passwort) · Bau-Befehl des Cloudflare-Pages-Projekts.
//   1 · private Dateien: liegt src/private nicht vor, klont der Build georg-doc/KFB-Stunt-Car-Race (Branch assets/private, flach) mit ASSETS_TOKEN
//       (Lese-Token, Pages-Secret) nach .private-assets und verweist src/private dorthin. Ohne Token: Platzhalter-Build (Warnung, kein Abbruch).
//   2 · KFB_SITE=1 vite build: Dateien einzeln (Pages-Grenze 25 MiB je Datei), /raw-Umleitung und Site-Ton-Pfad an.
//   3 · Ton: scripts/audio/site-copy.mjs (WS-Audio), falls vorhanden → dist/kfb-audio/.
//   4 · Prüfung: keine Datei > 25 MiB, sonst Abbruch mit Liste (dann nach R2). Bericht dist/site-build.json.
// Aufruf lokal zum Proben: node scripts/site/build-site.mjs  (nutzt ~/kfb-ws1/private-assets über src/private, falls vorhanden)
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'

const ROOT = process.cwd(), DIST = path.resolve(ROOT, process.env.KFB_SITE_OUT || 'dist')   /* resolve: absolute Ausgabepfade bleiben absolut (Befund WS-Audio) */, LIMIT = 25 * 1024 * 1024
const log = (...a) => console.log('[site]', ...a)
const run = (cmd, args, env = {}) => execFileSync(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } })

// 1 · private Dateien
const priv = path.join(ROOT, 'src/private'), clone = path.join(ROOT, '.private-assets')
let privateMode = fs.existsSync(priv) ? 'local' : 'none'
if (privateMode === 'none' && process.env.ASSETS_TOKEN) {
  if (!fs.existsSync(clone)) {
    log('klone assets/private (flach) …')
    execFileSync('git', ['clone', '-q', '--depth', '1', '--branch', 'assets/private', '--single-branch',
      `https://x-access-token:${process.env.ASSETS_TOKEN}@github.com/georg-doc/KFB-Stunt-Car-Race.git`, clone], { stdio: ['ignore', 'ignore', 'inherit'] })
    fs.rmSync(path.join(clone, '.git'), { recursive: true, force: true }) // Token-URL nicht im Baum behalten
  }
  fs.symlinkSync(clone, priv, 'dir'); privateMode = 'cloned'
}
if (privateMode === 'none') log('WARNUNG: keine privaten Dateien (ASSETS_TOKEN fehlt) – Platzhalter-Build')
const privateDir = fs.existsSync(priv) ? fs.realpathSync(priv) : null

// 2 · Bauen
fs.rmSync(DIST, { recursive: true, force: true })
// Ton von GitHub (WS-Audio, Status 16): mit gepinntem Commit in scripts/audio/remote.json lädt die Site Musik und Effekte von jsDelivr (Rückfall raw) und enthält keinen Ton
const remoteCfg = (() => { try { const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/audio/remote.json'), 'utf8')); if (!r.commit) return null; const fill = (u) => u.replace('{repo}', r.repo).replace('{commit}', r.commit).replace('{path}', r.path); return { root: fill(r.primary), fallback: fill(r.fallback), commit: r.commit } } catch { return null } })()
run('npx', ['vite', 'build', '--outDir', DIST], { KFB_SITE: '1', VITE_KFB_AUDIO_ROOT: remoteCfg ? remoteCfg.root : '/kfb-audio/', ...(remoteCfg ? { VITE_KFB_AUDIO_FALLBACK: remoteCfg.fallback } : {}) }) // Ton-Pfad der Site (WS-Audio: AUDIO_ROOT aus VITE_KFB_AUDIO_ROOT)

// 3 · Ton der Site (WS-Audio liefert scripts/audio/site-copy.mjs)
const audioCopy = path.join(ROOT, 'scripts/audio/site-copy.mjs')
let audio = 'missing-script'
if (remoteCfg) { audio = 'github@' + remoteCfg.commit.slice(0, 9); log('Ton von GitHub: ' + remoteCfg.root) }
else if (fs.existsSync(audioCopy) && privateDir && process.env.KFB_SITE_AUDIO !== '0') { run('node', [audioCopy, path.join(DIST, 'kfb-audio')], { SITE: '1', KFB_PRIVATE_ASSETS: privateDir, KFB_AUDIO_CACHE: process.env.KFB_AUDIO_CACHE || path.join(ROOT, '.kfb-audio-cache') }); audio = 'copied' }   /* KFB_SITE_AUDIO=0: ohne Ton bauen */
else if (fs.existsSync(audioCopy)) audio = privateDir ? 'off' : 'no-private'
else log('Hinweis: scripts/audio/site-copy.mjs fehlt noch – Site ohne private Töne')

// 4 · Prüfen und Bericht
const files = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f), st = fs.statSync(p); st.isDirectory() ? walk(p) : files.push({ f: path.relative(DIST, p), b: st.size }) } })(DIST)
const big = files.filter((x) => x.b > LIMIT)
const total = files.reduce((s, x) => s + x.b, 0)
const report = { schema: 'kfb.site-build/1', date: new Date().toISOString(), commit: (() => { try { return execFileSync('git', ['rev-parse', 'HEAD']).toString().trim() } catch (e) { return process.env.CF_PAGES_COMMIT_SHA || null } })(),
  private: privateMode, audio, files: files.length, totalMB: +(total / 1048576).toFixed(1), largest: files.sort((a, b) => b.b - a.b).slice(0, 8).map((x) => ({ file: x.f, MB: +(x.b / 1048576).toFixed(2) })), tooBig: big.map((x) => x.f) }
fs.writeFileSync(path.join(DIST, 'site-build.json'), JSON.stringify(report, null, 1))
fs.writeFileSync(path.join(DIST, '_headers'), '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/kfb-audio/*\n  Cache-Control: public, max-age=86400\n')
log(JSON.stringify(report))
if (big.length) { console.error('[site] FEHLER: Dateien über 25 MiB (nach R2 auslagern):', big.map((x) => x.f).join(', ')); process.exit(1) }
