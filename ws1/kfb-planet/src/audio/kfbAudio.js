// WS-Audio R1 (V-598) · der EINE Ton-Pfad des Spiels: ein AudioContext, ein Mixer mit Bussen (Musik, SFX, Atmo, UI), Ducking, Entfernungsdämpfung,
// Hörer an der Kamera. Die WSA-Laufzeit-Pakete (Audio Site 0.7.6) hängen unverändert an injiziertem Kontext und Bus und laufen im Host-Takt:
//   Racer/Flug  vendor/audio/racer/engine.mjs   (V-378 Motor-Gitter L1–L5, Gänge, Schubabschaltung; Flug prop/jet/turbine/antigrav, Wind)
//   Kampf       vendor/audio/combat/engine.mjs  (C01–C18, 24 Stimmen, HRTF, Entfernungs-Tiefpass)
//   Atmo        vendor/audio/ambience/kfb-ambience.v1.mjs (V-458, CC0: Teppich je Biom, Tierstimmen, Wasser positional)
//   Schritte    vendor/audio/footsteps/audio.mjs (Audio Site 0.7.6, Foley-/Digital-Bänke)
// Alles Übrige (ElevenLabs-Sätze: Dark Fluffer, Crash, Wurf, UI …) spielt die Tonbank hier (Pool, Varianten im Wechsel, Normalisierung je Clip).
// Musik: Jukebox mit Zufallsfolge und Überblendung, Suno bei Fahrt/Flug, Cozy Tunes zu Fuß (V-129), gestreamt (MediaElement), unter lauten SFX abgesenkt.
// Private Töne kommen NUR vom lokalen Server (/@kfb-audio/, scripts/audio/vitePrivateAudio.mjs); ohne ihn (dist, Vorschau) Modus 'public':
// dann nur die bisherigen öffentlichen Klänge (engineAudio/suckAudio). Start erst nach der ersten Eingabe (Browser-Regel). Hash mute = still.
// Positionen: Hörer im Ursprung, alle Quellen hörerbezogen (Welt − Hörer), Ausrichtung = Kamera – so erwarten es die WSA-Module (Tierstimmen um den Ursprung).
import { createRacer } from '../vendor/audio/racer/engine.mjs'
import { createCombat } from '../vendor/audio/combat/engine.mjs'
import { createAmbience } from '../vendor/audio/ambience/kfb-ambience.v1.mjs'
import { createFootstepAudio } from '../vendor/audio/footsteps/audio.mjs'
import { resolveAmbience, REVERB, reverbEnv, occlusion, occlusionFilter, createPulseTracker, SILENT_PULSE } from './mixer.js'
import { BUSES, SEMANTIC, DUCK, dbToGain, musicDuckDb, sanitizeVolumes, sliderGain, createModeLatch, createWeightedShuffle, musicWeight, uniqueTracks, variantsOf, distanceLowpassHz, pickVictim } from './mixer.js'
import { CUES, FLUFFER_SEQUENCE, LAUNCH, k10Plan, weaponKind, groupPlan, npcStepCue, NPC_STEP_RANGE, FLUFFER_RANGE, STEP_SURFACES, racerAssets, BANK_FIRST, greetCues, chatterFamily } from './cueMap.js'

// Ton-Wurzel: Dev-/Preview-Server '/@kfb-audio/' (scripts/audio/vitePrivateAudio.mjs); private MVP-Site (V-618, passwortgeschützt) '/kfb-audio/' über
// VITE_KFB_AUDIO_ROOT beim SITE-Build (scripts/audio/site-copy.mjs legt die Dateien dort ab). Normaler Build: nichts Privates in dist.
export const AUDIO_ROOT = import.meta.env?.VITE_KFB_AUDIO_ROOT || '/@kfb-audio/'
export const VOICE_CAP = Object.freeze({ bank: 24, music: 2 }) // WSA: Kampf 24, Atmo 24, Racer 16 Einzeltöne (+ Schleifen)
const STEP_VOICES = 8 // NPC-Schritte/Hüpfer gleichzeitig (Teil der 24 der Bank)
const MUTED = typeof location !== 'undefined' && /(^|[#,])mute(,|$)/.test(location.hash)
const VOL_KEY = 'kfb.audio.volumes.v1'
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

// ── der eine AudioContext ─────────────────────────────────────────────────────────────────────────────────────
let CTX = null
export function audioContext() {
  if (!CTX && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) { CTX = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' }); S.contexts++ }
  return CTX
}

const S = {
  contexts: 0, mode: 'idle', // idle → loading → full | public | muted
  unlocked: false, error: null, graph: null, vol: loadVolumes(), index: null,
  racer: null, combat: null, ambience: null, steps: null, loads: {}, errors: [],
  bank: { buffers: new Map(), pending: new Map(), voices: new Set(), last: {}, plays: 0, drops: 0, loudUntil: 0 },
  music: null, listener: { x: 0, y: 0, z: 0 }, duckDb: 0, combatActive: false, dialogue: false, musicAudible: false,
  perf: { frames: 0, sum: 0, max: 0, ring: new Float32Array(600), i: 0 }, telemetry: {}, steps0: { last: null, n: 0, surface: null }, events: [],
  host: {}, racerOn: false, racerIdle: null, water: { at: -1, ids: [] }, farm: [], mode2: 'foot', boost: false, amb: { biome: 'meadow', timeOfDay: 'day', weather: 'clear', wind: 0.22 },
}
function loadVolumes() { try { return sanitizeVolumes(JSON.parse(localStorage.getItem(VOL_KEY) || '{}')) } catch { return sanitizeVolumes({}) } }
function saveVolumes() { try { localStorage.setItem(VOL_KEY, JSON.stringify(S.vol)) } catch {} }
const log = (e) => { S.events.push({ t: +(CTX?.currentTime ?? 0).toFixed(3), ...e }); if (S.events.length > 300) S.events.shift() }

// ── Mixer: Bus → (Duck) → Master → Begrenzer → Ausgang ───────────────────────────────────────────────────────
function graph() {
  if (S.graph) return S.graph
  const ac = audioContext(); if (!ac) return null
  const master = ac.createGain(), limiter = ac.createDynamicsCompressor(), out = ac.createGain()
  limiter.threshold.value = -3; limiter.knee.value = 2; limiter.ratio.value = 12; limiter.attack.value = 0.003; limiter.release.value = 0.15
  master.connect(limiter).connect(out).connect(ac.destination)
  const meter = ac.createAnalyser(); meter.fftSize = 2048; out.connect(meter) // Pegel am Ausgang (nur bei stats() gelesen)
  const buses = {}, ducks = {}
  for (const b of BUSES) { const g = ac.createGain(), d = ac.createGain(); g.connect(d).connect(master); buses[b] = g; ducks[b] = d }
  // Raumklang: je Umgebung ein Faltungshall (rechnerische Raumantwort, kein Ton) als Send von SFX und Atmo; Wechsel über die Send-Pegel (weich)
  const rev = {}
  for (const [env, R] of Object.entries(REVERB)) { const send = ac.createGain(), pre = ac.createDelay(0.5), conv = ac.createConvolver(), tone = ac.createBiquadFilter()
    send.gain.value = 0; pre.delayTime.value = R.predelay; tone.type = 'lowpass'; tone.frequency.value = R.tone; conv.buffer = impulse(ac, R.seconds, env === 'canyon')
    buses.sfx.connect(send); buses.atmo.connect(send); send.connect(pre).connect(conv).connect(tone).connect(master); rev[env] = { send, R } }
  // Musik-Abgriff für den Puls (vor dem Musik-Regler: die Welt pulsiert auch bei leiser Musik)
  const musicTap = ac.createGain(), pulseAn = ac.createAnalyser(); pulseAn.fftSize = 1024; pulseAn.smoothingTimeConstant = 0.2; musicTap.connect(buses.music); musicTap.connect(pulseAn)
  S.graph = { ac, master, limiter, out, buses, ducks, meter, pcm: new Float32Array(2048), rev, musicTap, pulseAn, pulseBytes: new Uint8Array(pulseAn.frequencyBinCount), pulse: createPulseTracker({ sampleRate: ac.sampleRate, fftSize: 1024 }) }
  applyVolumes(); return S.graph
}
// Raumantwort: abklingendes, leicht gefärbtes Rauschen (Stereo, unkorreliert), Canyon mit einem frühen Echo nach 0,18 s – Verarbeitung, kein Klangmaterial
function impulse(ac, seconds, echo = false) {
  const n = Math.max(1, Math.floor(ac.sampleRate * seconds)), b = ac.createBuffer(2, n, ac.sampleRate)
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let lp = 0
    for (let i = 0; i < n; i++) { const t = i / ac.sampleRate, env = Math.pow(1 - i / n, 2.2) * Math.exp(-3 * t / seconds); lp += 0.35 * ((Math.random() * 2 - 1) - lp); d[i] = lp * env }
    if (echo) { const e0 = Math.floor(0.18 * ac.sampleRate); for (let i = 0; i < Math.min(n - e0, ac.sampleRate * 0.25); i++) d[e0 + i] += 0.5 * d[i] } }
  return b
}
let REV_ENV = null
function setReverb(env) { const G = S.graph; if (!G?.rev || env === REV_ENV) return; REV_ENV = env; const t = G.ac.currentTime; for (const [k, r] of Object.entries(G.rev)) r.send.gain.setTargetAtTime(k === env ? r.R.wet : 0, t, 0.8) }
function applyVolumes() {
  const G = S.graph; if (!G) return; const t = G.ac.currentTime
  G.master.gain.setTargetAtTime(S.vol.muted || MUTED ? 0 : sliderGain(S.vol.master), t, 0.05)
  for (const b of BUSES) G.buses[b].gain.setTargetAtTime(sliderGain(S.vol[b]), t, 0.05)
}
export function bus(name) { const G = graph(); return G ? G.buses[SEMANTIC[name] || name] || G.buses.sfx : null }
export function setVolume(name, v) { if (name === 'muted') S.vol.muted = !!v; else if (name in S.vol) S.vol[name] = Math.max(0, Math.min(1, +v || 0)); applyVolumes(); saveVolumes(); return { ...S.vol } }
export const volumes = () => ({ ...S.vol })

// ── Laden und Start ──────────────────────────────────────────────────────────────────────────────────────────────
// preload(): sobald die Welt steht – Index vom lokalen Ton-Server holen (ohne ihn: 'public', kein Kontext), dann Module laden und dekodieren
// (geht im angehaltenen Kontext). unlock(): erste Eingabe – Kontext fortsetzen, ab jetzt klingt es (Browser-Regel), Musik startet.
let booting = null
export function preload(host = {}) { // host: { car: Racer-Modus (#…,car), flyKind } – bestimmt, was zuerst lädt
  if (host && Object.keys(host).length) S.host = { ...S.host, ...host }
  if (MUTED) { S.mode = 'muted'; return Promise.resolve(snapshotLite()) }
  if (!booting) booting = boot().catch((e) => { S.error = String(e?.message || e); S.mode = 'public' })
  return booting
}
export function unlock() {
  if (MUTED) { S.mode = 'muted'; return Promise.resolve(snapshotLite()) }
  S.unlocked = true
  const ac = audioContext(); if (ac) { graph(); if (ac.state === 'suspended') ac.resume().catch(() => {}) }
  return preload()
}
async function getJson(url) { const r = await fetch(url, { cache: 'no-store' }); if (!r.ok) throw new Error(url + ' HTTP ' + r.status); return r.json() }
async function boot() {
  S.mode = 'loading'; const t0 = now()
  try { S.index = await getJson(AUDIO_ROOT + 'index.json') } catch { S.mode = 'public'; S.loads.index = { ms: +(now() - t0).toFixed(1), ok: false }; return snapshotLite() }
  S.loads.index = { ms: +(now() - t0).toFixed(1), ok: true }
  const G = graph(); if (!G) { S.mode = 'public'; return snapshotLite() }
  const ac = G.ac, timed = async (key, fn) => { const a = now(); try { const r = await fn(); S.loads[key] = { ms: +(now() - a).toFixed(0), ok: true }; return r } catch (e) { S.loads[key] = { ms: +(now() - a).toFixed(0), ok: false }; S.errors.push(key + ': ' + (e?.message || e)); return null } }
  S.mode = 'full' // Module kommen einzeln dazu, sobald geladen (der Rest spielt schon)
  startMusic()
  const car = !!S.host.car
  // Stufe 1 – sofort hörbar: Atmo + (zu Fuß) Schritte bzw. (Racer) Motor; Tonbank-Grundstock
  const racer = () => S.index.wsa && timed('racer', async () => { const m = await getJson(AUDIO_ROOT + 'wsa/racer/manifest.json'), want = new Set(racerAssets({ car }))
    const r = await createRacer({ audioContext: ac, destination: G.buses.sfx, manifest: { ...m, assets: m.assets.filter((x) => want.has(x.id)) }, assetBaseUrl: new URL(AUDIO_ROOT + 'wsa/racer/', location.href) })
    await r.prepare(); S.racer = r; S.racerAssets = want.size })
  const steps = () => S.index.site && timed('steps', async () => { const base = new URL(AUDIO_ROOT + 'site/footsteps/', location.href), [s, i] = await Promise.all([getJson(new URL('sources.json', base)), getJson(new URL('imported-sources.json', base))])
    const st = await createFootstepAudio({ audioContext: ac, destination: G.buses.sfx, rows: [...s.rows, ...(s.r2Rows || []), ...i.rows], assetBaseUrl: base, surfaces: STEP_SURFACES }); st.arm(); S.steps = st })
  await Promise.all([
    S.index.site && timed('ambience', async () => { const a = await createAmbience({ audioContext: ac, destinations: { GLOBAL_BED: G.buses.atmo, LOCAL_AMBIENCE: G.buses.atmo }, assetBaseUrl: new URL(AUDIO_ROOT + 'site/ambience/', location.href) })
      await a.setContext({ ...S.amb }); await a.start(); S.ambience = a }),
    car ? racer() : steps(),
    timed('bankFirst', () => preloadBank(true)),
  ].filter(Boolean))
  S.loads.ready = { ms: +(now() - t0).toFixed(0), ok: true } // ab hier klingt das Wichtigste
  // Stufe 2 – im Hintergrund: Kampf, Rest der Tonbank, Motor/Schritte des anderen Modus
  await Promise.all([
    S.index.wsa && timed('combat', async () => { const c = await createCombat({ audioContext: ac, destination: G.buses.sfx, assetBaseUrl: new URL(AUDIO_ROOT + 'wsa/combat/', location.href), onActivity: (on) => { S.combatActive = on } }); await c.start(); S.combat = c }),
    car ? steps() : racer(),
    timed('bank', () => preloadBank(false)),
  ].filter(Boolean))
  S.loads.total = { ms: +(now() - t0).toFixed(0), ok: true }
  return snapshotLite()
}
export { STEP_SURFACES } from './cueMap.js'

// ── Tonbank (ElevenLabs-Sätze) ──────────────────────────────────────────────────────────────────────────────────
function bankFiles(c) { if (c.set?.startsWith('site:')) return S.index?.site ? c.files : []; const s = S.index?.sets?.[c.set]; return !s ? [] : c.files ? c.files.filter((f) => s.files.includes(f)) : variantsOf(c.base, s.files) }
function loadClip(set, id) {
  const key = set + '/' + id, B = S.bank; if (B.buffers.has(key)) return Promise.resolve(B.buffers.get(key)); if (B.pending.has(key)) return B.pending.get(key)
  const url = set.startsWith('site:') ? AUDIO_ROOT + 'site/' + set.slice(5) + '/assets/' + id.split('/').map(encodeURIComponent).join('/') : AUDIO_ROOT + 'el/' + set + '/' + encodeURIComponent(id) + '.mp3'
  const p = fetch(url).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer() })
    .then((b) => graph().ac.decodeAudioData(b)).then((buf) => { B.buffers.set(key, buf); return buf }).finally(() => B.pending.delete(key))
  B.pending.set(key, p); return p
}
async function preloadBank(first = null) { // first: true = nur Grundstock (BANK_FIRST), false = der Rest, null = alles
  const re = BANK_FIRST[S.host.car ? 'car' : 'foot'], jobs = []; for (const [k, c] of Object.entries(CUES)) if (c.owner === 'bank' && (first === null || re.test(k) === first)) for (const id of bankFiles(c)) if (!jobs.some(([a, b]) => a === c.set && b === id)) jobs.push([c.set, id])
  let k = 0; const worker = async () => { while (k < jobs.length) { const [s, id] = jobs[k++]; try { await loadClip(s, id) } catch (e) { S.errors.push('bank ' + s + '/' + id + ': ' + e.message) } } }
  await Promise.all(Array.from({ length: 6 }, worker)); return jobs.length
}
const rel = (p) => (p ? { x: p.x - S.listener.x, y: p.y - S.listener.y, z: p.z - S.listener.z } : null)
// play(cueId, { pos: Weltlage, gain, at: Versatz s, loop }) → Stimme oder null
export function play(cueId, { pos = null, gain = 1, at = 0, loop = false, rate = null, fadeIn = null, silent = false, prio = null } = {}) { // silent: startet stumm, Pegel regelt der Aufrufer (v.vol)
  const c = CUES[cueId]; if (S.mode !== 'full' || !c || c.owner !== 'bank') return null
  const files = bankFiles(c); if (!files.length) { S.bank.drops++; return null }
  const pick = files.filter((f) => f !== S.bank.last[cueId]), id = (pick.length ? pick : files)[Math.floor(Math.random() * (pick.length || files.length))]
  const buf = S.bank.buffers.get(c.set + '/' + id); if (!buf) { if (!S.bank.pending.has(c.set + '/' + id)) { S.bank.drops++; loadClip(c.set, id).catch(() => {}) } return null } // erster Aufruf vor dem Laden: still, ab dann da
  S.bank.last[cueId] = id
  const G = graph(), ac = G.ac, B = S.bank, when = ac.currentTime + Math.max(0, at) + 0.005
  if (B.voices.size >= VOICE_CAP.bank) { const v = pickVictim(B.voices); if (v) stopVoice(v, true) }
  const norm = dbToGain(Math.max(-12, Math.min(14, S.index.sets?.[c.set]?.gainDb?.[id] ?? 0)))
  const src = ac.createBufferSource(), env = ac.createGain(); src.buffer = buf; src.loop = loop; src.playbackRate.value = (rate ?? 0.97 + Math.random() * 0.06) * (c.pitch || 1)
  const occ = pos && S.heightAt ? occlusionFilter(occlusion(S.heightAt, S.listener, pos)) : { hz: null, gainDb: 0 }; if (occ.hz) S.occluded = (S.occluded || 0) + 1 // Hügel dazwischen: dumpfer, leiser
  const vol = gain * (c.gain ?? 1) * norm * 0.5 * dbToGain(occ.gainDb) * 10 ** ((Math.random() * 2 - 1) / 20) // 0,5: ElevenLabs-Pegel unter den WSA-Begrenzern einordnen
  const fin = fadeIn ?? (loop ? 1.5 : 0); env.gain.setValueAtTime(fin > 0 || silent ? 0 : vol, when); if (fin > 0 && !silent) env.gain.linearRampToValueAtTime(vol, when + fin)
  let last = env, pan = null, lp = null
  const r = rel(pos); if (r) { const d = Math.hypot(r.x, r.y, r.z); pan = ac.createPanner(); pan.panningModel = 'equalpower'; pan.distanceModel = 'inverse'; pan.refDistance = 4; pan.maxDistance = 220; pan.rolloffFactor = 1
    pan.positionX.value = r.x; pan.positionY.value = r.y; pan.positionZ.value = r.z; lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.min(distanceLowpassHz(d), occ.hz ?? 20000); last.connect(lp).connect(pan); last = pan }
  src.connect(env); last.connect(G.buses[c.bus || 'sfx'])
  const v = { src, env, pan, lp, vol, cue: cueId, at: when, prio: prio ?? (c.loud ? 2 : loop ? 3 : 1), pos, loop, end: loop ? Infinity : when + buf.duration / src.playbackRate.value }
  B.voices.add(v); src.onended = () => stopVoice(v); src.start(when); if (!loop) src.stop(v.end + 0.02); B.plays++
  if (c.loud) B.loudUntil = Math.max(B.loudUntil, v.end)
  return v
}
function stopVoice(v, fade = false) {
  const B = S.bank; if (!B.voices.has(v)) return; B.voices.delete(v)
  if (fade) { try { v.env.gain.setTargetAtTime(0, CTX.currentTime, 0.02); v.src.stop(CTX.currentTime + 0.1) } catch {} }
  setTimeout(() => { for (const n of [v.src, v.env, v.lp, v.pan]) try { n?.disconnect() } catch {} }, fade ? 150 : 0)
}
export function stopLoop(v, s = 1.2) { if (!v || !CTX) return; try { v.env.gain.setTargetAtTime(0, CTX.currentTime, s / 3); v.src.stop(CTX.currentTime + s + 0.05) } catch {} }

// ── Musik-Jukebox ─────────────────────────────────────────────────────────────────────────────────────────────
const XF = 3.0 // s Überblendung
function startMusic() {
  if (S.music || typeof Audio === 'undefined') return
  const G = graph(), ac = G.ac, lists = { suno: uniqueTracks(S.index?.music?.suno || []), cozy: uniqueTracks(S.index?.music?.cozy || []) }
  const deck = [0, 1].map(() => { const el = new Audio(); el.preload = 'auto'; const g = ac.createGain(); g.gain.value = 0; ac.createMediaElementSource(el).connect(g).connect(G.musicTap); return { el, g, track: null, list: null } })
  S.music = { lists, deck, cur: -1, latch: createModeLatch(2.5), next: { suno: createWeightedShuffle(lists.suno), cozy: createWeightedShuffle(lists.cozy) }, list: null, changes: 0, errors: 0, started: 0 }
  for (const d of deck) { d.el.addEventListener('ended', () => { if (S.music.deck[S.music.cur] === d) nextTrack(S.music.list) }); d.el.addEventListener('error', () => { S.music.errors++; if (S.music.deck[S.music.cur] === d) setTimeout(() => nextTrack(S.music.list), 400) }) }
}
function nextTrack(list) {
  const M = S.music; if (!M || !list) return; const tags = S.index?.music?.tags || {}, ctx = { ...S.amb, mode: S.mode2 } // Biom/Tageszeit/Wetter wie die Atmo (auch von der Biom-Fahrt)
  const file = M.next[list]((f) => musicWeight(tags[list + '/' + f], ctx)); if (!file) return
  const ac = CTX, t = ac.currentTime, old = M.deck[M.cur], d = M.deck[(M.cur + 1) % 2]
  d.el.src = AUDIO_ROOT + 'music/' + list + '/' + encodeURIComponent(file); d.track = file; d.list = list
  const tg = dbToGain(Math.max(-12, Math.min(12, S.index?.music?.gainDb?.[list + '/' + file] ?? 0))) // Titel auf −18 LUFS ausgeglichen (loudness.mjs)
  d.g.gain.cancelScheduledValues(t); d.g.gain.setValueAtTime(0, t); d.g.gain.linearRampToValueAtTime(tg, t + XF); d.gainDb = 20 * Math.log10(tg)
  d.el.play().catch(() => {}); M.started++
  if (old && old !== d) { old.g.gain.cancelScheduledValues(t); old.g.gain.setValueAtTime(old.g.gain.value, t); old.g.gain.linearRampToValueAtTime(0, t + XF); const el = old.el; setTimeout(() => { if (M.deck[M.cur] !== old) el.pause() }, XF * 1000 + 100) }
  M.cur = (M.cur + 1) % 2; M.list = list; log({ type: 'music', list, file, biome: ctx.biome, tod: ctx.timeOfDay })
}
function musicTick(mode) {
  const M = S.music; if (!M || !S.unlocked) return
  if (M.paused) { S.musicAudible = false; return } // Radio-Taste Pause (Knet-HUD V-656): kein Wechsel, kein Weiterschalten
  const want = M.latch.update(mode, CTX.currentTime)
  if (want !== M.list) { if (M.list) M.changes++; nextTrack(want) }
  const d = M.deck[M.cur]; if (d && d.el.duration && isFinite(d.el.duration) && d.el.currentTime > d.el.duration - XF - 0.2 && !d.handoff) { d.handoff = true; nextTrack(M.list); setTimeout(() => { d.handoff = false }, XF * 1000 + 500) }
  S.musicAudible = !!(d && !d.el.paused && S.vol.music > 0.02 && !S.vol.muted)
}
// Radio im Knet-HUD (V-656, WS1e, additiv): vor = nächster Titel derselben Liste (Zufallsfolge wie sonst), zurück = aktuellen Titel von vorn
// (die Zufallsfolge kennt keinen Vorgänger), Pause hält die Jukebox an (kein Weiterschalten, kein Listenwechsel bis zur Fortsetzung).
export function musicSkip(dir = 1) { const M = S.music; if (!M || !S.unlocked || !CTX) return false; if (dir < 0) { const d = M.deck[M.cur]; if (d?.el) { d.el.currentTime = 0; return true } return false } if (M.paused) musicPause(false); nextTrack(M.list || 'cozy'); return true }
export function musicPause(on = true) { const M = S.music; if (!M) return false; M.paused = !!on; const d = M.deck[M.cur]; if (on) { for (const x of M.deck) x.el?.pause() } else if (d?.el) d.el.play().catch(() => {}); /* Pause hält auch eine laufende Überblendung an (WS-Audio 22.10.) */ log({ type: 'music', paused: M.paused }); return M.paused }
export const musicPaused = () => !!S.music?.paused
export const nowPlaying = () => { const M = S.music, d = M?.deck[M.cur]; return d?.track ? { list: d.list, title: d.track.replace(/\.[^.]+$/, ''), time: +(d.el.currentTime || 0).toFixed(1), gainDb: +(d.gainDb || 0).toFixed(1) } : null }

// ── Ereignisse ─────────────────────────────────────────────────────────────────────────────────────────────────
const LAND_HARD = 0.55, IMPACT_HARD = 0.5
// Fahrzeug (M2EVENTS: k2t + racerFlight; vehicleRig: shift/backfire/boost über engineAudio)
export function vehicleEvent(e, pos = null) {
  if (S.mode !== 'full' || !e) return; const R = S.racer
  switch (e.type) {
    case 'boost': case 'driftBoost': R?.emit({ type: 'boost' }); S.boostUntil = (CTX?.currentTime ?? 0) + 1.2; break
    case 'takeoff': case 'launch': case 'fly': R?.emit({ type: 'takeoff' }); break
    case 'land': play('vehicle.land', { pos }); break
    case 'landing': play((e.strength ?? 0.5) > LAND_HARD ? 'vehicle.landing.hard' : 'vehicle.landing.soft', { pos, gain: 0.6 + 0.6 * Math.min(1, e.strength ?? 0.5) }); break
    case 'railImpact': { const s = e.strength ?? e.speed ?? 0.6; play(s > IMPACT_HARD ? 'vehicle.railImpact.hard' : 'vehicle.railImpact.soft', { pos, gain: 0.7 + 0.5 * Math.min(1, s) }); break }
    case 'nudge': play('vehicle.nudge', { pos }); break
    case 'driftCharge': play('vehicle.driftCharge', { pos, gain: 0.7 + 0.15 * (e.stage || 1) }); break
    case 'twoWheel': play('vehicle.twoWheel', { pos }); break
    case 'trick': play('vehicle.trick', { pos }); break
    case 'respawn': play('vehicle.respawn', { pos }); break
    default: return
  }
  log({ type: 'vehicle', e: e.type })
}
// Obstgarten-Aktionen (V Faust, B Schuss, N Explosion) über die Kampf-Tabelle (Combat-AV R1) – Ergebnis aus dem Besitzer (HARVEST_STATE.last):
// Faust = Schwung (M01) → Schlagring-Treffer + Baumschütteln + Laub (K08); Schuss = Blaster-Abgang in Ebenen → Bolzen-Einschlag nach Flugzeit;
// Explosion = C08 + Holzsplitter + Laub, Trümmer-Ausklang (K06); ins Leere nur Schwung / Abgang / Cartoon-Knall
export function combatAction(kind, { hit = false, pos = null, target = null } = {}) {
  if (S.mode !== 'full') return; const C = S.combat, p = rel(target || pos) || { x: 0, y: 0, z: -1 }, id = kind + ':' + (S.bank.plays + Math.random()).toFixed(4)
  const layers = (L, o = {}) => { for (const [c, at, g, r] of L) play(c, { pos: o.pos ?? null, at: at + (o.at || 0), gain: g * (o.gain ?? 1), rate: r * jitter(0.05) }) }
  if (kind === 'punch') { layers(LAUNCH.melee)
    if (hit) { const t = setTimeout(() => { C?.emit({ type: 'knuckles', id, position: p, intensity: 0.85 }); C?.emit({ type: 'treeShake', id: id + 's', position: p, intensity: 0.6 }) }, 60); void t; play('tree.leaves', { pos: target, at: 0.1 }); play('tree.fruit', { pos: target, at: 0.45 }) } }
  else if (kind === 'shoot') { layers(LAUNCH.blaster); if (hit && target && pos) { const fl = Math.hypot(target.x - pos.x, target.y - pos.y, target.z - pos.z) / 34; play('combat.boltImpact', { pos: target, at: fl }); play('tree.leaves', { pos: target, at: fl + 0.03, gain: 0.5 }) } }
  else if (kind === 'blast') { if (hit) { C?.emit({ type: 'explosionSmall', id, position: p, material: 'wood', intensity: 0.8 }); play('tree.leaves', { pos: target, at: 0.08 }); play('debris.tail', { pos: target, at: 0.35 }); play('tree.fruit', { pos: target, at: 0.5, gain: 0.8 }) } else { play('k10.bomb', { pos }); play('debris.tail', { pos, at: 0.4 }) } }
  log({ type: 'combat', kind, hit })
}
// K10-Adapter für die Arena-Module (fire, cast, raise, release, contact, weaponDrop, jump, land, kill) mit der Cue-Tabelle aus Combat-AV R1:
// Abgang je Waffe in Ebenen (Anschlag/Körper/Ausklang), Gegner leiser und als Whoosh, Klinge Schwung vor Treffer, Gatling als Schleife (loopKeep),
// confirm.hit nur bei eigenen Treffern. Zeit/Hit-Stop bleiben beim einen Besitzer (V-567), hier nur Ton.
const K10 = { meleeAt: { player: -9, enemy: -9 }, gatling: null, gatlingUntil: 0, gatlingShotAt: -9 }
export function k10(e) {
  if (S.mode !== 'full') return null; const plan = k10Plan(e); if (!plan) return null
  const t = CTX.currentTime, side = e.side === 'enemy' ? 'enemy' : 'player', pos = e.position ? { x: e.position.x ?? e.position[0], y: e.position.y ?? e.position[1], z: e.position.z ?? e.position[2] } : null, id = e.id ? String(e.id) : undefined
  const kind = weaponKind(e.weapon)
  if ((e.type === 'fire' || e.type === 'raise') && kind === 'melee') K10.meleeAt[side] = t
  let layers = plan.layers
  if (plan.loop === 'gatling') { // Feuerstoß: Schleife hält, solange Schüsse kommen; Einzelanschlag höchstens ~9/s
    K10.gatlingUntil = t + 0.18; if (!K10.gatling) { play('k10.gatlingUp', {}); K10.gatling = play('av.gatlingLoop', { loop: true, gain: 0.5, fadeIn: 0.04 }); K10.gatlingSpin = play('k10.gatlingSpin', { loop: true, fadeIn: 0.15 }) } // L11 Anlauf + Drehen
    if (t - K10.gatlingShotAt < 0.11) layers = []; else K10.gatlingShotAt = t }
  let delay = 0
  if (plan.swingFirst && t - K10.meleeAt[side] > 0.3) { for (const [c, at, g, r] of LAUNCH.melee) play(c, { pos, at, gain: g, rate: r * jitter(0.06) }); K10.meleeAt[side] = t; delay = 0.06 } // Klinge: Schwung vor dem Treffer
  for (const [c, at, g, r] of layers) play(c, { pos, at: at + delay, gain: g, rate: r * jitter(0.05) })
  const fire = () => { if (plan.combat) S.combat?.emit({ type: plan.combat, id, position: rel(pos) || { x: 0, y: 0, z: -1 }, material: plan.material, intensity: (plan.gain ?? 1) * (Number.isFinite(e.energy) ? e.energy : 0.7) })
    if (plan.confirm) S.combat?.emit({ type: 'hitConfirm', id: id ? id + ':c' : undefined }) }
  if (delay > 0) setTimeout(fire, delay * 1000); else fire()
  log({ type: 'k10', e: e.type, w: kind, side }); return plan
}
function gatlingTick(t) { if (K10.gatling && t > K10.gatlingUntil) { stopLoop(K10.gatling, 0.12); stopLoop(K10.gatlingSpin, 0.2); K10.gatling = K10.gatlingSpin = null; play('k10.gatlingDown', {}) } } // L11 Auslauf
const jitter = (p) => 1 + (Math.random() * 2 - 1) * p
// Dark Fluffer (WS-NPC flufferSim.events): { type, at:[x,z] | pos } → Folge aus dark_fluffer_r1
// Zustand je Fluffer (K15: bis zu 3 zugleich, Ereignisse mit id); ohne id (alter Weg debug().events) gilt der gemeinsame Zustand
const FLUFF = new Map()
const fluffHealed = (id) => (id != null && FLUFF.has(id) ? FLUFF.get(id) : !!S.flufferHealed)
export function fluffer(e, pos = null) {
  const id = e?.id ?? null, set = (v) => { if (id != null) FLUFF.set(id, v); else S.flufferHealed = v }
  if (e?.type === 'fluffer_spawn') { set(false); return 0 } if (e?.type === 'fluffer_gone' || (e?.type === 'gone' && id != null)) { if (id != null) FLUFF.delete(id); if (e.type === 'fluffer_gone') return 0 } // gone = heimgegangen (Welt), fluffer_gone = Instanz ersetzt; Spawn-Ton gibt es keinen (Auftritt erst bei t0)
  if (e?.type === 'healed') set(true); if (e?.type === 'windup' || e?.type === 'spit') set(false) // neuer feindlicher Auftritt
  const seq = FLUFFER_SEQUENCE[e?.type]; if (!seq || S.mode !== 'full') return 0
  if (pos && Math.hypot(pos.x - S.listener.x, pos.z - S.listener.z) > FLUFFER_RANGE) return 0 // ferne Obstgarten-Zone: still (spart Stimmen)
  for (const [cue, dt] of seq) play(cue, { pos, at: dt }); log({ type: 'fluffer', e: e.type, id }); return seq.length
}
// Atmo-Vorgaben von außen (WS1b Biom-Fahrt): { biome, weather, wind, timeOfDay } – null/undefined nimmt den Wert wieder zurück; wirkt ab dem nächsten Takt
const CTXO = {}
export function ambienceContext(update = {}) { for (const k of ['biome', 'weather', 'wind', 'timeOfDay']) if (k in update) { if (update[k] == null) delete CTXO[k]; else CTXO[k] = update[k] } return resolveAmbience({ biome: S.biome, timeOfDay: S.tod }, CTXO) }
// Blitz → Donner über kfb-ambience: Verzögerung nach Entfernung (343 m/s), Lage hörerbezogen (azimuth rad, 0 = −Z, positiv Richtung +X), at = Kontextzeit des Blitzes
let LIGHTNING_N = 0
export function ambienceLightning({ distanceM = 800, azimuth = 0, at = null, id = null } = {}) {
  if (S.mode !== 'full' || !S.ambience || !CTX) return null
  try { return S.ambience.emit({ type: 'lightning', id: id || 'flash-' + ++LIGHTNING_N, at: at ?? CTX.currentTime, distanceM: Math.max(0, +distanceM || 0), azimuth: +azimuth || 0 }) } catch (e) { S.errors.push('lightning: ' + e.message); return null }
}
// Gelände für die Verdeckung (Höhe der aktiven Welt); vom AudioHost gesetzt
export function setTerrain(heightAt) { S.heightAt = typeof heightAt === 'function' ? heightAt : null }
// Musik-Puls für die Welt (kfb.audio.presentation-pulse.v1; WS1d Boombox-Ringe, musikgesteuertes Gras): einmal je Takt berechnet, musicPulse() liest nur ab
let PULSE = SILENT_PULSE
function pulseTick(t) {
  const G = S.graph, M = S.music, d = M?.deck[M.cur]; if (!G?.pulseAn || !M) { PULSE = SILENT_PULSE; return }
  const playing = !!(d && !d.el.paused && !S.vol.muted && !MUTED); G.pulseAn.getByteFrequencyData(G.pulseBytes)
  PULSE = { ...G.pulse(t, G.pulseBytes, playing ? 1 : 0), activeSources: playing ? [{ sourceId: 'JUKEBOX', sourceType: 'music', audibleGain01: +sliderGain(S.vol.music).toFixed(3) }] : [] }
}
export const musicPulse = () => PULSE
// Musik-Katalog der Suno-Ernte (WS0 V-688): nur lesen. harvestPhrases(song, family) lädt das Manifest und liefert die eigenständigen Phrasen (ohne dup_of)
// mit url, Grundton, Kontur, Länge, LUFS und Einsatz in Schlägen – Abspielen folgt erst mit der Register-Zuordnung (chatter.motif/grains)
export const musicCatalog = () => S.index?.catalog ?? null
export async function harvestPhrases(song, family) {
  const h = S.index?.catalog?.songs?.find((s) => s.id === song)?.harvest?.find((x) => x.family === family); if (!h?.manifest) return null
  const m = await getJson(AUDIO_ROOT + 'chatter/' + h.manifest).catch(() => null); if (!m) return null; const dir = h.manifest.replace(/[^/]+$/, '')
  return (m.items || []).filter((x) => !x.dup_of).map((x) => ({ ...x, url: AUDIO_ROOT + 'chatter/' + dir + x.file }))
}
// Begrüßung eines Bewohners (WS-NPC 'greet'): Stimm-Laut am Kopf der Figur, Musik kurz −4 dB; eigene Stimme, sonst Platzhalter
export function greet(e, pos = null, chatter = null) { // chatter: Register-Block der Figur (V-682), sonst null
  if (S.mode !== 'full') return null
  // sichtbarer Rückfall (Lead 22.10.): je Figur im Status, ob das Register-Instrument klingt ('set:<Familie>') oder der bisherige Platzhalter ('fallback')
  //   Rückfall: 'fallback:resident' (Bewohner-Stimme resident_voices_r1) bzw. 'fallback:placeholder'
  const fam = chatterFamily(chatter)
  for (const cue of greetCues(e, chatter)) { const c = CUES[cue]; if (!bankFiles(c).length) continue; const v = play(cue, { pos, rate: c.rate ?? null }); if (v) { S.voiceUntil = Math.max(S.voiceUntil || 0, v.end)
    const chat = cue.startsWith('chatter.') ? 'set:' + fam : cue.startsWith('greet.fallback.') ? 'fallback:placeholder' : 'fallback:resident'; S.greetChatter ||= {}; if (e?.id != null) S.greetChatter[e.id] = chat
    log({ type: 'greet', e: e.reason, id: e.id ?? null, cue, chatter: chat }); return cue } }
  return null
}
export function ui(name) { return play('ui.' + name) }
// Präsenz-Schleifen: laufen, solange Ereignisse kommen (hold s), folgen der letzten Lage, blenden danach aus
const PRES = new Map()
export function presence(key, cue, pos, hold = 1, gain = 1) {
  if (S.mode !== 'full' || !CTX) return; const t = CTX.currentTime; let p = PRES.get(key)
  if (!p) { const v = play(cue, { pos, loop: true, fadeIn: 0.25, gain }); if (!v) return; p = { v }; PRES.set(key, p) }
  p.until = t + hold; p.pos = pos; const r = rel(pos); if (p.v.pan && r) { p.v.pan.positionX.setTargetAtTime(r.x, t, 0.08); p.v.pan.positionY.setTargetAtTime(r.y, t, 0.08); p.v.pan.positionZ.setTargetAtTime(r.z, t, 0.08) }
}
function presenceTick(t) { for (const [k, p] of PRES) { if (t > p.until) { stopLoop(p.v, 0.5); PRES.delete(k); continue } const r = rel(p.pos); if (p.v.pan && r) { p.v.pan.positionX.setTargetAtTime(r.x, t, 0.1); p.v.pan.positionY.setTargetAtTime(r.y, t, 0.1); p.v.pan.positionZ.setTargetAtTime(r.z, t, 0.1) } } }
// NPC-Schritt (groups.steps / npc.steps) bzw. Fluffer-Hüpfer (fluffer.hops) am Ort; außerhalb NPC_STEP_RANGE still
export function npcStep(e, pos, surface) {
  if (S.mode !== 'full' || !pos) return null; const d = Math.hypot(pos.x - S.listener.x, pos.z - S.listener.z); if (d > NPC_STEP_RANGE) return null
  const healed = e.type === 'hop' && fluffHealed(e.id), cue = e.type === 'hop' ? (healed ? 'fluffer.hopHealed' : 'fluffer.hop') : npcStepCue(e, surface); if (!cue) return null
  if (e.type === 'hop' && !healed) presence(e.id ? 'fluffGlide:' + e.id : 'fluffGlide', 'npc.fluffGlide', pos, 0.9) // N08 Goo zwischen den Hüpfern
  if (e.group === 'toy_squad') presence('toyTick', 'npc.toyTick', pos, 0.8) // N06 Aufziehschlüssel, solange der Trupp geht
  let live = 0; for (const v of S.bank.voices) if (v.prio === 0) live++; if (live >= STEP_VOICES) { S.npcStepDrops = (S.npcStepDrops || 0) + 1; return null } // höchstens 8 Schritte zugleich
  const sp = Number.isFinite(e.speed) ? Math.min(1.3, 0.8 + 0.25 * e.speed) : 1; S.npcSteps = (S.npcSteps || 0) + 1
  return play(cue, { pos, gain: sp, rate: 0.96 + Math.random() * 0.08, prio: 0 }) // niedrigster Rang: werden zuerst verdrängt, nie Kampf/Fluffer
}
// NPC-Gruppen (WS-NPC mods.groups.events(): { type, id, n?, at:[x,z], tag?, t, group }) → Ton am Ort des Mitglieds; Kampf-Familien (C13/C14) über den WSA-Kampf
export function groupEvent(e, pos = null) {
  const plan = groupPlan(e); if (!plan || S.mode !== 'full') return 0
  for (const [c, at, g] of plan) { if (c.startsWith('combat:')) { const fam = c.slice(7), go = () => S.combat?.emit({ type: fam, position: rel(pos) || { x: 0, y: 0, z: -1 }, intensity: g }); if (at > 0) setTimeout(go, at * 1000); else go() } else play(c, { pos, at, gain: g }) }
  log({ type: 'group', e: e.type, g: e.group }); return plan.length
}

// ── Host-Takt (einmal je Bild) ──────────────────────────────────────────────────────────────────────────────────
// st: { listener:{x,y,z,fx,fy,fz,ux,uy,uz}, mode:'foot'|'drive'|'fly', speed m/s, throttle, brake, rpm01, gear, gears, vertical, bank, flyKind,
//       foot:{ phase, moving, grounded, surface }, dialogue, tod, water:[{id,kind,x,y,z}] , farm:[{x,y,z}] }
export function frame(st) {
  const ac = CTX; if (!ac || S.mode !== 'full') { if (S.mode === 'public') musicTick(st?.mode || 'foot'); return }
  const t0 = now(), L = st.listener, AL = ac.listener
  if (L) { S.listener = { x: L.x, y: L.y, z: L.z }
    if (AL.forwardX) { AL.forwardX.value = L.fx; AL.forwardY.value = L.fy; AL.forwardZ.value = L.fz; AL.upX.value = L.ux; AL.upY.value = L.uy; AL.upZ.value = L.uz }
    else AL.setOrientation?.(L.fx, L.fy, L.fz, L.ux, L.uy, L.uz) }
  const mode = st.mode || 'foot'; S.mode2 = mode; S.dialogue = !!st.dialogue
  const mix = { musicActive: S.musicAudible, dialogueActive: S.dialogue, combatActive: S.combatActive }
  // Motor / Flug: Racer läuft nur bei Fahrt/Flug; zu Fuß nach 3 s angehalten (keine stummen Schleifen im Audio-Faden)
  const R = S.racer, need = mode === 'drive' || mode === 'fly'
  if (R && need && !S.racerOn) { S.racerOn = true; S.racerIdle = null; R.start().then(() => { if (!S.racerOn) R.stop() }) }
  if (R && !need && S.racerOn) { S.racerIdle ??= ac.currentTime; if (ac.currentTime - S.racerIdle > 3) { S.racerOn = false; R.stop() } } else if (need) S.racerIdle = null
  if (R && S.racerOn) {
    const kmh = Math.max(0, Math.min(240, (st.speed || 0) * 3.6)), thr = clamp01(st.throttle), T = S.telemetry
    if (mode === 'drive') Object.assign(T, { mode: 'drive', speedKmh: kmh, throttle: thr, brake: clamp01(st.brake), engineOn: true, ...gearRpm(st) })
    else if (mode === 'fly') { delete T.gear; delete T.rpm; Object.assign(T, { mode: st.flyKind || 'antigrav', speedKmh: kmh, throttle: thr, brake: 0, bank: clampS(st.bank), vertical: clampS(st.vertical), airbrake: clamp01(st.airbrake), engineOn: true, geared: false }) }
    else { delete T.gear; delete T.rpm; Object.assign(T, { mode: 'drive', speedKmh: 0, throttle: 0, brake: 0, engineOn: false }) }
    try { R.setTelemetry(T) } catch (e) { S.errors.push('racer: ' + e.message) }
    R.setMix(mix); R.tick()
  }
  if (S.combat) { S.combat.setMix(mix); S.combat.tick() }
  const A = S.ambience
  if (A) {
    A.setMix(mix)
    // Atmo-Kontext: Vorgaben von außen (ambienceContext, z. B. Biom-Fahrt) vor AudioHost; Wassernähe legt pond/beach drüber; nur Änderungen weitergeben
    const want = resolveAmbience({ biome: st.biome, timeOfDay: st.tod }, CTXO), diff = {}
    for (const k of ['biome', 'timeOfDay', 'weather', 'wind']) if (want[k] !== S.amb[k]) diff[k] = want[k]
    if (Object.keys(diff).length) { Object.assign(S.amb, diff); S.biome = want.biome; S.tod = want.timeOfDay; A.setContext(diff).catch((e) => S.errors.push('ambience: ' + e.message)) }
    if (st.water) waterTick(st.water)
    A.tick()
  }
  if (st.farm) farmTick(st.farm)
  setReverb(reverbEnv({ biome: S.amb.biome, rise: st.rise ?? 0 })); S.rise = st.rise ?? 0
  driveTick(st, mode, ac.currentTime); coastTick(ac.currentTime)
  if (S.steps && mode === 'foot' && st.foot) stepTick(st.foot)
  musicTick(mode); gatlingTick(ac.currentTime); presenceTick(ac.currentTime)
  pulseTick(ac.currentTime)
  // Ducking der Musik: laute SFX (Kampf, Crash), Dialog, Boost
  const db = musicDuckDb({ loud: S.combatActive || ac.currentTime < S.bank.loudUntil, dialogue: S.dialogue, voice: ac.currentTime < (S.voiceUntil || 0), boost: ac.currentTime < (S.boostUntil || 0) })
  if (db !== S.duckDb) { const up = db > S.duckDb; S.duckDb = db; S.graph.ducks.music.gain.setTargetAtTime(dbToGain(db), ac.currentTime, up ? DUCK.release / 3 : DUCK.attack / 3) }
  // Bank-Schleifen (Farm) und positionale Einzeltöne folgen dem Hörer nicht (kurz); Messung
  const ms = now() - t0, P = S.perf; P.frames++; P.sum += ms; P.max = Math.max(P.max, ms); P.ring[P.i++ % P.ring.length] = ms
}
const clamp01 = (x) => Math.max(0, Math.min(1, Number(x) || 0)), clampS = (x) => Math.max(-1, Math.min(1, Number(x) || 0))
// Drehzahl 0..1 (vehicleRig, Leerlauf 0,18) → 900..6400 U/min; 5 Spielgänge → 4 Racer-Gänge
export function gearRpm(st) {
  const o = {}; if (Number.isFinite(st.rpm01)) o.rpm = 900 + Math.max(0, Math.min(1, (st.rpm01 - 0.18) / 0.82)) * 5500
  if (Number.isFinite(st.gear)) { const n = st.gears || 5; o.gear = Math.max(1, Math.min(4, Math.ceil((st.gear / n) * 4))) }
  return o
}
// Racer am Boden: Untergrund-Schleife (Gras/Sand/Fels/Wasser, WS0 R01–R04) nach Tempo überblendet, Drift-Schleife (R05) nach Rutschwinkel,
// Bremszischen (R07) beim Bremsbeginn ab 6 m/s. Schleifen laufen nur in der Fahrt; beim Verlassen ausblenden.
const DRV = { loops: null, braking: false, drift: 0 }
const SURF = ['grass', 'sand', 'rock', 'water']
function driveTick(st, mode, t) {
  const on = mode === 'drive'
  if (on && !DRV.loops) { DRV.loops = {}; for (const k of SURF) DRV.loops[k] = play('drive.surface.' + k, { loop: true, silent: true }); DRV.loops.drift = play('drive.drift', { loop: true, silent: true }) }
  if (!on && DRV.loops) { for (const v of Object.values(DRV.loops)) stopLoop(v, 0.6); DRV.loops = null; DRV.braking = false; return }
  if (!on) return
  const sp = Math.max(0, st.speed || 0), k = Math.min(1, sp / 22), air = !!st.air; DRV.surface = st.surface || 'grass'; DRV.brakes = (DRV.brakes || 0)
  for (const s of SURF) if (!DRV.loops[s]) DRV.loops[s] = play('drive.surface.' + s, { loop: true, silent: true }) // noch nicht geladen: nächster Takt
  if (!DRV.loops.drift) DRV.loops.drift = play('drive.drift', { loop: true, silent: true })
  for (const s of SURF) { const v = DRV.loops[s]; if (!v) continue; const want = air ? 0 : (s === (st.surface || 'grass') ? 0.25 + 0.75 * k : 0); v.env.gain.setTargetAtTime(v.vol * want, Math.max(t, v.at), 0.12); v.src.playbackRate.setTargetAtTime(0.9 + 0.25 * k, t, 0.2) }
  DRV.drift += ((air || sp < 6 ? 0 : Math.min(1, Math.max(0, ((st.slip || 0) - 0.12) / 0.35))) - DRV.drift) * 0.25
  DRV.maxDrift = Math.max(DRV.maxDrift || 0, DRV.drift); const dv = DRV.loops.drift; if (dv) dv.env.gain.setTargetAtTime(dv.vol * DRV.drift, Math.max(t, dv.at), 0.06)
  const br = (st.brake || 0) > 0.5 && sp > 6 && !air; if (br && !DRV.braking) { play('vehicle.brake', { gain: 0.6 + 0.4 * k }); DRV.brakes++ }; DRV.braking = br
}
// Küsten-Vögel (WS0 A02) als ruhige Schleife, solange das Biom „beach“ ist (am Meer)
let COAST = null
function coastTick() { const want = S.biome === 'beach' && S.tod !== 'night'; if (want && !COAST) COAST = play('atmo.coast', { loop: true, fadeIn: 3 }); else if (!want && COAST) { stopLoop(COAST, 3); COAST = null } }
// Wasser: bis zu drei hörerbezogene Quellen (nächster Fluss-, Fall-, Meerpunkt); gleiche id → gleitet, neue id → neu
function waterTick(list) {
  const A = S.ambience, ids = list.map((w) => w.id + ':' + w.kind).join('|'), pos = (w) => ({ x: w.x - S.listener.x, y: w.y - S.listener.y, z: w.z - S.listener.z })
  if (ids !== S.water.ids) { S.water.ids = ids; A.setWaterEmitters(list.map((w) => ({ id: w.id, kind: w.kind, position: pos(w) }))) }
  else A.moveWaterEmitters(list.map((w) => ({ id: w.id, position: pos(w) })))
}
// Farm-Teppich an den Obstgärten (Schleife, positional, Morgen/Tag), Lage folgt dem Hörer
function farmTick(list) {
  if (!S.farm.length && list.length) S.farm = list.map((p) => ({ p, v: null }))
  for (const f of S.farm) {
    const r = rel(f.p), d = Math.hypot(r.x, r.z), on = d < 90 && S.tod !== 'night'
    if (on && !f.v) f.v = play('atmo.farm', { pos: f.p, loop: true }); else if (!on && f.v) { stopLoop(f.v); f.v = null }
    if (f.v?.pan) { const t = CTX.currentTime; f.v.pan.positionX.setTargetAtTime(r.x, t, 0.1); f.v.pan.positionY.setTargetAtTime(r.y, t, 0.1); f.v.pan.positionZ.setTargetAtTime(r.z, t, 0.1); f.v.lp?.frequency.setTargetAtTime(distanceLowpassHz(d), t, 0.2) }
  }
}
// Schritte: Gangphase (0..1) aus dem Loco-Modul; Kontakt beim Durchgang durch 0 (links) und 0,5 (rechts), nur am Boden und in Bewegung
function stepTick(f) {
  const P = S.steps0, ph = f.phase; if (!Number.isFinite(ph)) { P.last = null; return }
  if (P.last !== null && f.moving && f.grounded) {
    const foot = ph < P.last - 0.3 ? 'l' : P.last < 0.5 && ph >= 0.5 ? 'r' : null // Durchgang durch 0 (Umbruch) bzw. 0,5
    if (foot && f.surface === 'water') { P.n++; play('foot.wade', { gain: 0.8 + 0.2 * Math.random() }) }
    else if (foot) { P.n++; try { S.steps.play({ kind: 'footstep', time: CTX.currentTime + 0.01, foot, surface: f.surface || 'digital-grass', key: 'step-' + P.n }) } catch (e) { S.errors.push('steps: ' + e.message) } }
  }
  P.last = ph; P.surface = f.surface
}

// ── Zustand / Messwerte ─────────────────────────────────────────────────────────────────────────────────────────
function voices() {
  const r = S.racer?.snapshot?.(), c = S.combat?.snapshot?.(), a = S.ambience?.snapshot?.(), st = S.steps?.state?.()
  const music = S.music ? S.music.deck.filter((d) => !d.el.paused).length : 0
  return { racerLoops: r?.activeLoops ?? 0, racerOneShots: r?.activeOneShots ?? 0, combat: c?.activeSources ?? 0, ambience: a?.activeSources ?? 0, steps: st?.activeSources ?? 0, bank: S.bank.voices.size, music }
}
function perf() { const P = S.perf, n = Math.min(P.frames, P.ring.length), a = Array.from(P.ring.slice(0, n)).sort((x, y) => x - y); return { frames: P.frames, avgMs: P.frames ? +(P.sum / P.frames).toFixed(4) : 0, p95Ms: n ? +a[Math.floor(n * 0.95)].toFixed(4) : 0, maxMs: +P.max.toFixed(3) } }
function snapshotLite() { return { mode: S.mode, contexts: S.contexts, state: CTX?.state ?? null, error: S.error } }
export function stats() {
  const v = voices(), oneShots = v.racerOneShots + v.combat + v.ambience + v.steps + v.bank
  return { ...snapshotLite(), unlocked: S.unlocked, volumes: { ...S.vol }, loads: { ...S.loads }, errors: S.errors.slice(-20), modules: { racer: !!S.racer, combat: !!S.combat, ambience: !!S.ambience, steps: !!S.steps, music: !!S.music },
    voices: { ...v, oneShots, total: oneShots + v.racerLoops + v.music }, perf: perf(), duckDb: S.duckDb, combatActive: S.combatActive, musicAudible: S.musicAudible, nowPlaying: nowPlaying(),
    music: S.music ? { list: S.music.list, changes: S.music.changes, started: S.music.started, errors: S.music.errors, tracks: { suno: S.music.lists.suno.length, cozy: S.music.lists.cozy.length } } : null,
    bank: { loaded: S.bank.buffers.size, plays: S.bank.plays, drops: S.bank.drops }, npcSteps: S.npcSteps || 0, npcStepDrops: S.npcStepDrops || 0, steps: S.steps0.n, surface: S.steps0.surface, mode2: S.mode2, tod: S.tod || null, biome: S.biome || null, ambience: { ...S.amb }, ambienceOverride: { ...CTXO }, water: S.water.ids || '',
    racer: S.racer ? (({ gear, rpm, speedKmh, mode, loaded, loadMs, activeLoops }) => ({ gear, rpm: Math.round(rpm), speedKmh: +speedKmh.toFixed(1), mode, loaded, loadMs: Math.round(loadMs), on: S.racerOn, loops: activeLoops, assets: S.racerAssets }))(S.racer.snapshot()) : null,
    presence: [...PRES.keys()], pulse: { bpm: PULSE.transport.bpm, conf: PULSE.transport.confidence01, audible: PULSE.audible01, bass: PULSE.bass }, reverb: REV_ENV, rise: S.rise ?? null, occluded: S.occluded || 0, flufferHealed: !!S.flufferHealed, fluffers: Object.fromEntries(FLUFF), chatter: { ...(S.greetChatter || {}) }, drive: DRV.loops ? { surface: DRV.surface, drift: +DRV.drift.toFixed(2), loops: Object.values(DRV.loops).filter(Boolean).length, brakes: DRV.brakes || 0, maxDrift: +(DRV.maxDrift || 0).toFixed(2) } : null, coast: !!COAST,
    outDb: outLevelDb(), events: S.events.slice(-40) }
}
function outLevelDb() { const G = S.graph; if (!G) return null; G.meter.getFloatTimeDomainData(G.pcm); let q = 0; for (const v of G.pcm) q += v * v; const r = Math.sqrt(q / G.pcm.length); return r > 0 ? +(20 * Math.log10(r)).toFixed(1) : -120 }
// Aufnahme für das Abnahme-Video: Abgriff am Ausgang (nach dem Begrenzer), gleicher Kontext
export function captureStream() { const G = graph(); if (!G) return null; if (!G.tap) { G.tap = G.ac.createMediaStreamDestination(); G.out.connect(G.tap) } return G.tap.stream }
export const audioMode = () => S.mode
