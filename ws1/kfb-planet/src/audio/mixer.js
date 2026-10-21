// WS-Audio R1 (V-598) · reine Rechenregeln des Mixers (ohne AudioContext, Node-geprüft in test/unit/audioMixer.mjs).
// Busse: Musik, SFX, Atmo, UI → Master → Sicherheitsbegrenzer → Ausgang. Ducking nur auf Musik und Atmo (SFX/UI bleiben vorn).
export const BUSES = Object.freeze(['music', 'sfx', 'atmo', 'ui'])
export const DEFAULT_VOLUMES = Object.freeze({ master: 0.9, music: 0.55, sfx: 0.9, atmo: 0.7, ui: 0.7 })
// Semantische Ziele der WSA-Module (Audio Site 0.7.6) → Bus des Spiels
export const SEMANTIC = Object.freeze({ PLAYER_CRITICAL: 'sfx', WORLD_SFX: 'sfx', GLOBAL_BED: 'atmo', LOCAL_AMBIENCE: 'atmo', SCORE: 'music', UI: 'ui' })
// Ducking (dB, negativ): laute SFX (Kampf, Crash, Explosion) und Dialog senken die Musik; Atmo regelt kfb-ambience.v1 selbst (−5 unter Musik, −6 Kampf)
export const DUCK = Object.freeze({ loudSfxDb: -7, dialogueDb: -9, boostDb: -2, attack: 0.12, release: 1.2 })
export const dbToGain = (db) => 10 ** (db / 20)
export function musicDuckDb({ loud = false, dialogue = false, boost = false } = {}) {
  return Math.min(0, loud ? DUCK.loudSfxDb : 0, dialogue ? DUCK.dialogueDb : 0, boost ? DUCK.boostDb : 0)
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
