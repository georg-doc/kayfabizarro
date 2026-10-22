// WS-Audio · Ton für die PRIVATE MVP-Site (V-618: eigenes privates Projekt unter KFB-Stunt-Car-Race, Passwort): kopiert nach prepare() genau die Dateien,
// die die Laufzeit braucht, nach <out> (Standard dist/kfb-audio/), in derselben Ordnung wie der Dev-Server (/@kfb-audio/…), mit eigener index.json.
// Die Site baut mit VITE_KFB_AUDIO_ROOT=/kfb-audio/ (kfbAudio.js liest das). Läuft NUR mit SITE=1 – der normale Build bleibt ohne private Töne.
//   Quellen: KFB_PRIVATE_ASSETS (Cloudflare: ./.private-assets), Zwischenspeicher KFB_AUDIO_CACHE; Audio Site (öffentlich) aus ~/kfb-ws1/kayfabizarro oder,
//   wenn der Klon fehlt, zur Bauzeit von GitHub (raw, gepinnter Commit, scripts/audio/site-files.json, kein Token).
// Aufruf: SITE=1 node scripts/audio/site-copy.mjs [out] [--dry]   (--dry: nur Liste und Größe)
import fs from 'fs'
import path from 'path'
import { prepare, fetchSite, PRIVATE, CACHE } from './prepare.mjs'
import { CUES, STEP_SURFACES } from '../../src/audio/cueMap.js'
import { SURFACES } from '../../src/vendor/audio/footsteps/audio.mjs'
import { uniqueTracks, variantsOf } from '../../src/audio/mixer.js'

if (process.env.SITE !== '1') { console.error('[audio:site] abgebrochen: nur mit SITE=1 (private MVP-Site). Der normale Build bleibt ohne private Töne.'); process.exit(2) }
const args = process.argv.slice(2), DRY = args.includes('--dry'), OUT = path.resolve(args.find((a) => !a.startsWith('--')) || 'dist/kfb-audio')
const EL = path.join(PRIVATE, '40_AUDIO/elevenlabs_r1')

export async function planSite() {
  let st = prepare({ quiet: true })
  if (!st.site) { await fetchSite(st.siteDir); st = prepare({ quiet: true }) }
  if (!st.private || !st.wsa || !st.site) throw new Error(`Quellen fehlen: privat=${st.private} wsa=${st.wsa} atmo=${st.site} (KFB_PRIVATE_ASSETS=${PRIVATE})`)
  const idx = JSON.parse(fs.readFileSync(path.join(CACHE, 'index.json'), 'utf8')), files = [] // [Ziel relativ zu OUT, Quelle]
  // WSA-Pakete: Manifeste + private-assets (nur was im Manifest steht)
  for (const k of ['racer', 'combat']) { const m = JSON.parse(fs.readFileSync(path.join(CACHE, 'wsa/dist', k, 'manifest.json'), 'utf8'))
    files.push([`wsa/${k}/manifest.json`, path.join(CACHE, 'wsa/dist', k, 'manifest.json')]); for (const a of m.assets) files.push([`wsa/${k}/${a.file}`, path.join(CACHE, 'wsa/dist', k, a.file)]) }
  // Audio Site: Atmo-Register + alle Atmo-Dateien; Schritte: Quellen-Listen + die Bänke der Laufzeit (STEP_SURFACES) + NPC-Schritte (site:footsteps)
  const amb = JSON.parse(fs.readFileSync(path.join(st.siteDir, 'ambience/licence-register.json'), 'utf8'))
  files.push(['site/ambience/licence-register.json', path.join(st.siteDir, 'ambience/licence-register.json')], ['site/ambience/LICENCES.md', path.join(st.siteDir, 'ambience/LICENCES.md')])
  for (const a of amb.assets) files.push([`site/ambience/${a.file}`, path.join(st.siteDir, 'ambience', a.file)])
  for (const j of ['sources.json', 'imported-sources.json', 'LICENCES.md']) files.push([`site/footsteps/${j}`, path.join(st.siteDir, 'footsteps', j)])
  const src = JSON.parse(fs.readFileSync(path.join(st.siteDir, 'footsteps/sources.json'), 'utf8')), imp = JSON.parse(fs.readFileSync(path.join(st.siteDir, 'footsteps/imported-sources.json'), 'utf8')), rows = [...src.rows, ...(src.r2Rows || []), ...imp.rows]
  for (const id of STEP_SURFACES) { const c = SURFACES[id]; for (const r of rows.filter((r) => r.file.startsWith(c.prefix))) { const rel = (c.imported ? 'imported/' : '') + r.file; files.push([`site/footsteps/assets/${rel}`, path.join(st.siteDir, 'footsteps/assets', rel)]) } }
  for (const c of Object.values(CUES)) if (c.owner === 'bank' && c.set.startsWith('site:')) for (const f of c.files) files.push([`site/${c.set.slice(5)}/assets/${f}`, path.join(st.siteDir, c.set.slice(5), 'assets', f)])
  // ElevenLabs: nur die Dateien der Bank-Zuordnung + der ganze Saug-Satz (suckAudio)
  const sets = {}
  const add = (set, id) => { (sets[set] ||= new Set()).add(id) }
  for (const c of Object.values(CUES)) if (c.owner === 'bank' && !c.set.startsWith('site:')) { const all = idx.sets[c.set]?.files || []; for (const f of c.files ? c.files.filter((x) => all.includes(x)) : variantsOf(c.base, all)) add(c.set, f) }
  for (const f of idx.sets.fluff_suction_r1?.files || []) add('fluff_suction_r1', f)
  const outSets = {}
  for (const [set, ids] of Object.entries(sets)) { outSets[set] = { files: [...ids].sort(), gainDb: Object.fromEntries([...ids].filter((i) => i in (idx.sets[set].gainDb || {})).map((i) => [i, idx.sets[set].gainDb[i]])), norm: idx.sets[set].norm }
    for (const id of ids) files.push([`el/${set}/${id}.mp3`, path.join(EL, set, id + '.mp3')]) }
  // Musik: Suno (Fahrt/Flug) und Cozy Tunes (zu Fuß), wie die Laufzeit sie auswählt (ein Format je Titel)
  const suno = uniqueTracks(idx.music.suno), cozy = uniqueTracks(idx.music.cozy)
  for (const f of suno) files.push([`music/suno/${f}`, path.join(PRIVATE, 'music/suno-roadtrip-jukebox-v2', f)])
  for (const f of cozy) files.push([`music/cozy/${f}`, path.join(PRIVATE, 'music/cozy-tunes-classics/Audio/ogg/Tracks', f)])
  const index = { schema: 'kfb.audio-private-index/1', builtAt: new Date().toISOString(), site: true, wsa: true, music: { suno, cozy, gainDb: idx.music.gainDb || {}, tags: idx.music.tags || {} }, sets: outSets }
  return { files, index }
}

const { files, index } = await planSite()
const missing = files.filter(([, s]) => !fs.existsSync(s)).map(([d]) => d)
const bytes = files.reduce((n, [, s]) => n + (fs.existsSync(s) ? fs.statSync(s).size : 0), 0), big = files.filter(([, s]) => fs.existsSync(s) && fs.statSync(s).size > 25 * 1024 * 1024).map(([d]) => d)
if (missing.length) { console.error('[audio:site] fehlt:', missing.slice(0, 10)); process.exit(1) }
if (big.length) { console.error('[audio:site] über 25 MiB (Cloudflare-Grenze):', big); process.exit(1) }
if (!DRY) { fs.mkdirSync(OUT, { recursive: true }); for (const [d, s] of files) { const dst = path.join(OUT, d); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(s, dst) } fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index)) }
console.log(JSON.stringify({ out: OUT, dry: DRY, files: files.length + 1, mb: +(bytes / 1048576).toFixed(1), sets: Object.keys(index.sets).length, music: { suno: index.music.suno.length, cozy: index.music.cozy.length } }))
