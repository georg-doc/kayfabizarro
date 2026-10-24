// WS-Audio R1 (V-598) · reine Rechenregeln des Mixers (ohne AudioContext, Node-geprüft in test/unit/audioMixer.mjs).
// Busse: Musik, SFX, Atmo, UI → Master → Sicherheitsbegrenzer → Ausgang. Ducking nur auf Musik und Atmo (SFX/UI bleiben vorn).
export const BUSES = Object.freeze(['music', 'sfx', 'atmo', 'ui'])
export const DEFAULT_VOLUMES = Object.freeze({ master: 0.9, music: 0.55, sfx: 0.9, atmo: 0.7, ui: 0.7 })
// Semantische Ziele der WSA-Module (Audio Site 0.7.6) → Bus des Spiels
export const SEMANTIC = Object.freeze({ PLAYER_CRITICAL: 'sfx', WORLD_SFX: 'sfx', GLOBAL_BED: 'atmo', LOCAL_AMBIENCE: 'atmo', SCORE: 'music', UI: 'ui' })
// Ducking (dB, negativ): laute SFX (Kampf, Crash, Explosion) und Dialog senken die Musik; Atmo regelt kfb-ambience.v1 selbst (−5 unter Musik, −6 Kampf)
// Schritte (Georg 25.10., V-734: „stampfen viel zu laut“): eigener Bus unter SFX, Grundpegel −9 dB; beim Sprechen (Silben) −6 dB, unter lautem
// Kampf/Explosion −4 dB weiter – wie die Musik über den einen Mixer geduckt
export const STEP_BUS = Object.freeze({ db: -9, speechDuckDb: -6, loudDuckDb: -4 })
export const stepBusDb = ({ speech = false, loud = false } = {}) => STEP_BUS.db + (speech ? STEP_BUS.speechDuckDb : 0) + (loud ? STEP_BUS.loudDuckDb : 0)
export const DUCK = Object.freeze({ loudSfxDb: -7, dialogueDb: -9, voiceDb: -7, boostDb: -2, attack: 0.12, release: 1.2 })
export const dbToGain = (db) => 10 ** (db / 20)
export function musicDuckDb({ loud = false, dialogue = false, boost = false, voice = false } = {}) {
  return Math.min(0, loud ? DUCK.loudSfxDb : 0, dialogue ? DUCK.dialogueDb : 0, voice ? DUCK.voiceDb : 0, boost ? DUCK.boostDb : 0)
}
export function clampVolume(v) { const x = Number(v); return Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : null }
export function sanitizeVolumes(v = {}) {
  const out = { ...DEFAULT_VOLUMES }
  for (const k of Object.keys(DEFAULT_VOLUMES)) { const c = clampVolume(v[k]); if (c !== null) out[k] = c }
  out.muted = v.muted === true
  return out
}
// Reglerweg → Verstärkung (quadratisch, damit die untere Hälfte nicht „tot“ ist)
export const sliderGain = (v) => v * v

// Spielmodus → Musikliste (V-129): Fahrt und Flug = Suno-Jukebox, zu Fuß = Cozy Tunes. Wechsel erst nach holdS im neuen Modus (kein Flattern).
export const PLAYLIST_FOR_MODE = Object.freeze({ drive: 'suno', fly: 'suno', foot: 'cozy' })
export function createModeLatch(holdS = 2.5) {
  let current = null, pending = null, since = 0
  return {
    update(mode, t) { const want = PLAYLIST_FOR_MODE[mode] || 'cozy'
      if (current === null) { current = want; return current }
      if (want === current) { pending = null; return current }
      if (pending !== want) { pending = want; since = t }
      if (t - since >= holdS) { current = want; pending = null }
      return current },
    get current() { return current },
  }
}
// Zufallsfolge ohne direkte Wiederholung; jede Liste einmal komplett, dann neu gemischt (erster Titel ≠ letzter der Vorrunde)
export function createShuffle(items, random = Math.random) {
  let bag = [], last = null
  return () => {
    if (!items.length) return null
    if (!bag.length) { bag = items.slice(); for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]] }
      if (bag.length > 1 && bag[bag.length - 1] === last) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]] }
    last = bag.pop(); return last
  }
}
// Gleiche Titel in mehreren Formaten (… B.mp3 und … B.m4a): nur einer, mp3/ogg vor m4a
export function uniqueTracks(files) {
  const by = new Map(), rank = (f) => (/\.(mp3|ogg)$/i.test(f) ? 0 : 1)
  for (const f of files) { const stem = f.replace(/\.[^.]+$/, ''); const o = by.get(stem); if (!o || rank(f) < rank(o)) by.set(stem, f) }
  return [...by.values()].sort()
}
// Varianten eines Ereignisses in einem ElevenLabs-Satz: Basis, Basis_a/_b/_c, ersetzte _r gehen vor (C01_punch_light_c_r ersetzt …_c)
export function variantsOf(base, files) {
  const re = new RegExp('^' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(_[a-z])?(_r)?$'), hit = files.filter((f) => re.test(f))
  return hit.filter((f) => !(hit.includes(f + '_r')))
}
// Entfernungsdämpfung für die eigene Tonbank (wie PannerNode 'inverse'): g = ref / (ref + roll · (max(d, ref) − ref)); Tiefpass ab 25 m
export function distanceGain(d, { ref = 4, roll = 1, max = 220 } = {}) { const x = Math.min(Math.max(d, ref), max); return ref / (ref + roll * (x - ref)) }
export function distanceLowpassHz(d) { return Math.max(900, 16000 / (1 + Math.max(0, d - 25) / 22)) }
// Stimmen-Pool: höchstens n gleichzeitig, beim Überlauf die älteste (bzw. leiseste Priorität) abbrechen
export function pickVictim(voices) { let v = null; for (const x of voices) if (!v || x.prio < v.prio || (x.prio === v.prio && x.at < v.at)) v = x; return v }

// Atmo-Kontext (kfb-ambience.v1): Vorgaben von außen (Biom-Fahrt WS1b: biome, weather, wind, timeOfDay) haben Vorrang vor den Werten des AudioHost;
// die Wassernähe (pond am Bergsee, beach am Meer) legt sich nur drüber, wenn wirklich Wasser nah ist. Ungültige Werte fallen auf den Standard zurück.
export const AMBIENCE_PRESETS = Object.freeze(['meadow', 'jungle', 'beach', 'forest', 'pond'])
export const AMBIENCE_TIMES = Object.freeze(['morning', 'day', 'evening', 'night'])
export const AMBIENCE_WEATHER = Object.freeze(['clear', 'rain-light', 'rain-heavy', 'thunderstorm', 'snow', 'storm'])
export function resolveAmbience(host = {}, over = {}) {
  const water = host.biome === 'pond' || host.biome === 'beach' ? host.biome : null
  const pick = (v, list, d) => (list.includes(v) ? v : d)
  return {
    biome: water || pick(over.biome, AMBIENCE_PRESETS, null) || pick(host.biome, AMBIENCE_PRESETS, 'meadow'),
    timeOfDay: pick(over.timeOfDay, AMBIENCE_TIMES, null) || pick(host.timeOfDay, AMBIENCE_TIMES, 'day'),
    weather: pick(over.weather, AMBIENCE_WEATHER, 'clear'),
    wind: Number.isFinite(over.wind) ? Math.round(Math.max(0, Math.min(1, over.wind)) * 20) / 20 : 0.22, // 0,05-Stufen: setContext nicht in jedem Bild
  }
}

// Jukebox nach Biom und Tageszeit: Gewicht je Titel aus seinen Stichworten (scripts/audio/music-tags.json) und dem Atmo-Kontext
// biome +3, Tageszeit +2 (morning zählt als day), Schnee +3, im Flug +1; Grundgewicht 1 – jeder Titel bleibt möglich
export function musicWeight(tags = [], ctx = {}) {
  const tod = ctx.timeOfDay === 'morning' ? 'day' : ctx.timeOfDay
  return 1 + (tags.includes(ctx.biome) ? 3 : 0) + (tod && tags.includes(tod) ? 2 : 0) + (ctx.weather === 'snow' && tags.includes('snow') ? 3 : 0) + (ctx.mode === 'fly' && tags.includes('fly') ? 1 : 0)
}
// S2 Endlose Welt (Lead/Georg V-746): Musik folgt dem Biom weich. Ist das Klang-Biom ≥ dwell s stabil, passt der laufende Titel nicht (kein Biom-
// Stichwort), bleiben noch > minLeft s und gibt es in der Liste einen passenden Titel, wird mit xf s übergeblendet (statt erst am Titelende).
export const BIOME_MUSIC = Object.freeze({ dwell: 12, xf: 6, minLeft: 25 })
export function biomeMusicSwitch({ biome, tags = [], stableS = 0, leftS = 0, candidates = [] }) {
  return !!biome && stableS >= BIOME_MUSIC.dwell && !tags.includes(biome) && Number.isFinite(leftS) && leftS > BIOME_MUSIC.minLeft && candidates.some((t) => (t || []).includes(biome))
}
// gewichtete Zufallswahl ohne die letzten `avoid` Titel (sofern genug übrig)
export function createWeightedShuffle(items, random = Math.random, avoid = 3) {
  const recent = []
  return (weight = () => 1) => {
    if (!items.length) return null
    const pool = items.length > avoid ? items.filter((x) => !recent.includes(x)) : items.filter((x) => x !== recent[recent.length - 1]) || items
    const w = pool.map((x) => Math.max(0, weight(x))), sum = w.reduce((a, b) => a + b, 0)
    let r = random() * sum, pick = pool[pool.length - 1]; for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r < 0) { pick = pool[i]; break } }
    recent.push(pick); if (recent.length > avoid) recent.shift(); return pick
  }
}

// Raumklang (rein, Node-geprüft) ── Umgebung aus Biom und Geländeform: canyon (eingeschlossen, Echo), forest (weicher kurzer Hall), open (fast trocken)
export const REVERB = Object.freeze({ open: { seconds: 0.35, wet: 0.03, predelay: 0.01, tone: 6000 }, forest: { seconds: 0.9, wet: 0.11, predelay: 0.015, tone: 3500 }, canyon: { seconds: 1.6, wet: 0.14, predelay: 0.12, tone: 4500 } })
// rise = mittlerer Anstieg des Geländes (m) in 8 Richtungen in 25 m Abstand gegenüber dem Hörer
export function reverbEnv({ biome = 'meadow', rise = 0 } = {}) { return rise > 6 ? 'canyon' : biome === 'forest' || biome === 'jungle' ? 'forest' : 'open' }
// Verdeckung: Gelände zwischen Hörer a und Quelle b höher als die Sichtlinie (+0,5 m)? → { occluded, depth (m) }; 8 Proben, Enden ausgenommen
export function occlusion(heightAt, a, b, samples = 8) {
  if (!heightAt || !a || !b) return { occluded: false, depth: 0 }
  let depth = 0
  for (let i = 1; i < samples; i++) { const u = i / samples, x = a.x + (b.x - a.x) * u, z = a.z + (b.z - a.z) * u, line = a.y + (b.y - a.y) * u, h = heightAt(x, z); if (Number.isFinite(h)) depth = Math.max(depth, h - line - 0.5) }
  return { occluded: depth > 0, depth: +Math.max(0, depth).toFixed(2) }
}
// Wirkung der Verdeckung: Tiefpass und Dämpfung nach Tiefe (bis 5 m voll)
export function occlusionFilter(o) { if (!o?.occluded) return { hz: null, gainDb: 0 }; const k = Math.min(1, o.depth / 5); return { hz: Math.round(2200 - 1300 * k), gainDb: +(-3 - 4 * k).toFixed(1) } }

// Musik-Puls für die Welt (WS0-Entwurf kfb.audio.presentation-pulse.v1; Boombox-Ringe kfb-groundfx, musikgesteuertes Gras): aus dem Spektrum je Bild
// Bänder (Bass 40–150 Hz, Mitte 150–2000 Hz, Höhe 2–10 kHz, 0..1 mit langsamer Selbst-Normierung), Kick = Bass-Anstieg über adaptiver Schwelle,
// Tempo aus den Kick-Abständen (Median, 80–160 BPM gefaltet), Takt-Phase per Phasenregelung; Takt-Eins geschätzt (jeder 4. Schlag). Rein, Node-geprüft.
export function createPulseTracker({ sampleRate = 48000, fftSize = 1024 } = {}) {
  const hz = sampleRate / fftSize, bin = (f) => Math.max(1, Math.round(f / hz)), B = { bass: [bin(40), bin(150)], mid: [bin(150) + 1, bin(2000)], high: [bin(2000) + 1, bin(10000)] }
  const S = { t: null, sm: { bass: 0, mid: 0, high: 0 }, max: { bass: 0.25, mid: 0.25, high: 0.25 }, prevBass: 0, flux: [], lastKick: -9, iois: [], bpm: 0, phase: 0, beats: 0, rhythm: 0, conf: 0 }
  const avg = (d, [a, b]) => { let q = 0; for (let i = a; i <= b && i < d.length; i++) q += d[i]; return q / Math.max(1, Math.min(b, d.length - 1) - a + 1) / 255 }
  const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0 }
  return function update(t, d, audible = 1) {
    const dt = S.t === null ? 0 : Math.max(0, Math.min(0.1, t - S.t)); S.t = t
    const raw = { bass: avg(d, B.bass), mid: avg(d, B.mid), high: avg(d, B.high) }, out = {}
    for (const k of ['bass', 'mid', 'high']) { S.max[k] = Math.max(raw[k], S.max[k] * (1 - dt * 0.15), 0.12); const v = Math.min(1, raw[k] / S.max[k]); S.sm[k] += (v - S.sm[k]) * Math.min(1, dt * 18); out[k] = +S.sm[k].toFixed(3) }
    // Kick: positiver Bass-Anstieg größer als Mittel + 1,5·Streuung der letzten ≈ 0,7 s, mindestens 0,25 s Abstand
    const flux = Math.max(0, raw.bass - S.prevBass); S.prevBass = raw.bass; S.flux.push(flux); if (S.flux.length > 42) S.flux.shift()
    const m = S.flux.reduce((a, b) => a + b, 0) / S.flux.length, sd = Math.sqrt(S.flux.reduce((a, b) => a + (b - m) ** 2, 0) / S.flux.length)
    const kick = audible > 0.05 && flux > m + 1.5 * sd && flux > 0.02 && t - S.lastKick > 0.25
    if (kick) { let ioi = t - S.lastKick; if (ioi > 0.25 && ioi < 2) { while (60 / ioi < 80) ioi /= 2; while (60 / ioi > 160) ioi *= 2; S.iois.push(ioi); if (S.iois.length > 24) S.iois.shift() } S.lastKick = t; S.rhythm = 1 } // jeder Abstand in 80–160 BPM gefaltet (Zwischenschläge kippen das Tempo nicht)
    S.rhythm = Math.max(0, S.rhythm - dt * 4)
    if (S.iois.length >= 4) { // Tempo = dichteste Häufung der gefalteten Abstände (±4 %), nicht der bloße Median
      let best = S.iois[0], bestN = 0; for (const c of S.iois) { const n = S.iois.filter((x) => Math.abs(x - c) / c < 0.04).length; if (n > bestN) { bestN = n; best = c } }
      const near = S.iois.filter((x) => Math.abs(x - best) / best < 0.04), p = near.reduce((a, b) => a + b, 0) / near.length, bpm = 60 / p
      S.bpm = S.bpm && Math.abs(bpm - S.bpm) / S.bpm < 0.08 ? S.bpm + (bpm - S.bpm) * 0.15 : bestN >= Math.max(4, S.iois.length * 0.4) ? bpm : S.bpm || bpm
      S.conf = Math.max(0, Math.min(1, (bestN / S.iois.length - 0.25) / 0.5)) }
    if (S.bpm) { S.phase += dt * S.bpm / 60; if (S.phase >= 1) { S.phase -= Math.floor(S.phase); S.beats++ }
      if (kick) { const e = S.phase > 0.5 ? S.phase - 1 : S.phase; S.phase -= 0.35 * e; if (S.phase < 0) S.phase += 1 } } // Phasenregelung: beim Kick 35 % zum Schlag ziehen
    const ph = S.bpm ? S.phase : 0, beatPulse = S.bpm ? Math.exp(-ph * 6) : S.rhythm, down = S.bpm && S.beats % 4 === 0 ? beatPulse : 0, au = +Math.max(0, Math.min(1, audible)).toFixed(3)
    return { schema: 'kfb.audio-presentation-pulse/1', t, audible01: au, beat: +ph.toFixed(3), kick, bass: out.bass, mid: out.mid, high: out.high,
      transport: { bpm: +S.bpm.toFixed(1), confidence01: +S.conf.toFixed(2), beatPhase01: +ph.toFixed(3), beatPulse01: +beatPulse.toFixed(3), downbeatPulse01: +down.toFixed(3), barPhase01: +(((S.beats % 4) + ph) / 4).toFixed(3), phrasePhase01: +(((S.beats % 16) + ph) / 16).toFixed(3) },
      energy: { audible01: au, bass01: out.bass, mid01: out.mid, high01: out.high, rhythm01: +S.rhythm.toFixed(3) } }
  }
}
export const SILENT_PULSE = Object.freeze({ schema: 'kfb.audio-presentation-pulse/1', t: 0, audible01: 0, beat: 0, kick: false, bass: 0, mid: 0, high: 0, transport: Object.freeze({ bpm: 0, confidence01: 0, beatPhase01: 0, beatPulse01: 0, downbeatPulse01: 0, barPhase01: 0, phrasePhase01: 0 }), energy: Object.freeze({ audible01: 0, bass01: 0, mid01: 0, high01: 0, rhythm01: 0 }), activeSources: Object.freeze([]) })
