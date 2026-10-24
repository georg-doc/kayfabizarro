// Slice 1 · Spielstand kfb.save/1 (F1-Kern, V-370; WS1_STATUS §62.1 F1a, §62.3 Punkt 1). Rein: ohne three, ohne DOM-Pflicht, Node-geprüft
// (test/unit/save.mjs). Nur der Spieler: Welt-Änderungen bleiben in kfb.world-save/1 (WORLD_CONTRACT_R1: „Nie Spielstand in der Welt“).
// Ein Objekt: { schema, version, savedAt, flags, fluff (Zähler je Sorte), fluffTotal (je gesammelt, wird nie verbraucht – Gesamt-Score, Georg 24.10.), collected (Schlüssel gesammelter Kügelchen), player { pos, zone } }.
// Laden prüft und repariert: kaputt → frischer Stand (Rohtext bleibt unter <key>.bak), unbekannte neuere Version → frischer Stand im Speicher,
// die Datei wird NICHT überschrieben (ein älterer Client zerstört keinen neueren Stand). Speicher: localStorage (alles in try/catch), sonst Speicher-Ersatz.
import { FLUFF_KINDS } from './fluff.js'

export const SAVE_SCHEMA = 'kfb.save/1'
export const SAVE_VERSION = 1
export const SAVE_KEY = 'kfb.save'
export const SAVE_LIMITS = Object.freeze({ collected: 20000, flags: 256, flagKey: 64, flagText: 256, bytes: 1_000_000 })

const isObj = (o) => !!o && typeof o === 'object' && !Array.isArray(o)
const nowIso = (now) => new Date(now ?? Date.now()).toISOString()

export function freshSave(now) {
  return { schema: SAVE_SCHEMA, version: SAVE_VERSION, savedAt: nowIso(now), flags: {}, fluff: Object.fromEntries(FLUFF_KINDS.map((k) => [k, 0])), fluffTotal: 0, collected: [], player: { pos: [0, 0, 0], zone: null } }
}

// Prüfen und in die Normalform bringen. Ergebnis { state, errors[] } (errors = was repariert wurde; leer = sauber)
export function validateSave(o) {
  const errors = [], s = freshSave(0)
  if (!isObj(o)) return { state: s, errors: ['kein Objekt'] }
  if (o.schema !== SAVE_SCHEMA) errors.push('schema')
  if (typeof o.savedAt === 'string' && !Number.isNaN(Date.parse(o.savedAt))) s.savedAt = new Date(o.savedAt).toISOString(); else errors.push('savedAt')
  if (isObj(o.flags)) {
    for (const [k, v] of Object.entries(o.flags).slice(0, SAVE_LIMITS.flags)) {
      if (k.length > SAVE_LIMITS.flagKey) { errors.push('flag-key'); continue }
      if (typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v))) s.flags[k] = v
      else if (typeof v === 'string') s.flags[k] = v.slice(0, SAVE_LIMITS.flagText)
      else errors.push('flag:' + k)
    }
  } else if (o.flags !== undefined) errors.push('flags')
  if (isObj(o.fluff)) for (const k of FLUFF_KINDS) { const v = o.fluff[k]; if (v === undefined) continue; if (Number.isFinite(v) && v >= 0) s.fluff[k] = Math.floor(v); else errors.push('fluff:' + k) }
  else errors.push('fluff')
  // Gesamt-Score: fehlt er (ältere Stände), gilt die Summe der Zähler (bisher wurde nichts verbraucht)
  { const sum = Object.values(s.fluff).reduce((a, b) => a + b, 0)   // Gesamt ist nie kleiner als die Kugeln (verbraucht wird nur aus den Kugeln)
    if (Number.isFinite(o.fluffTotal) && o.fluffTotal >= 0) s.fluffTotal = Math.max(Math.floor(o.fluffTotal), sum); else { s.fluffTotal = sum; if (o.fluffTotal !== undefined) errors.push('fluffTotal') } }
  if (Array.isArray(o.collected)) { const set = new Set(o.collected.filter((x) => typeof x === 'string' && x.length <= 128)); if (set.size !== o.collected.length) errors.push('collected-dedupe'); s.collected = [...set].slice(-SAVE_LIMITS.collected) }
  else if (o.collected !== undefined) errors.push('collected')
  const p = o.player
  if (isObj(p)) {
    if (Array.isArray(p.pos) && p.pos.length === 3 && p.pos.every(Number.isFinite)) s.player.pos = p.pos.slice(); else errors.push('player.pos')
    if (typeof p.zone === 'string') s.player.zone = p.zone.slice(0, 64); else if (p.zone != null) errors.push('player.zone')
  } else errors.push('player')
  return { state: s, errors }
}

// Alte Formen auf die aktuelle Version heben. Stand heute: Version 0 = Vor-Schema-Objekt ohne schema/version (z. B. aus einer Vorschau:
// { fluff, collected, pos }). Neuere Version → null (nicht anfassen). Weitere Schritte hier anhängen: 1 → 2 usw.
export function migrateSave(o) {
  if (!isObj(o)) return null
  const v = o.version ?? (o.schema === SAVE_SCHEMA ? SAVE_VERSION : o.schema ? NaN : 0)
  if (v === SAVE_VERSION && o.schema === SAVE_SCHEMA) return o
  if (v === 0) return { schema: SAVE_SCHEMA, version: 1, savedAt: o.savedAt || nowIso(0), flags: o.flags || {}, fluff: o.fluff || {}, collected: o.collected || [], player: { pos: o.player?.pos || o.pos || [0, 0, 0], zone: o.player?.zone ?? o.zone ?? null } }
  return null
}

export function serializeSave(state, { now } = {}) {
  const { state: s } = validateSave({ ...state, schema: SAVE_SCHEMA, savedAt: nowIso(now) })
  const text = JSON.stringify(s)
  if (text.length > SAVE_LIMITS.bytes) throw new Error('SAVE_TOO_LARGE: ' + text.length)
  return text
}

// Ergebnis { state, status: 'ok' | 'repaired' | 'migrated' | 'empty' | 'corrupt' | 'future', errors[], version }
export function parseSave(text, { now } = {}) {
  if (text == null || text === '') return { state: freshSave(now), status: 'empty', errors: [], version: null }
  let o; try { o = JSON.parse(text) } catch (e) { return { state: freshSave(now), status: 'corrupt', errors: ['json: ' + e.message], version: null } }
  if (!isObj(o)) return { state: freshSave(now), status: 'corrupt', errors: ['kein Objekt'], version: null }
  const version = o.version ?? null
  if (typeof version === 'number' && version > SAVE_VERSION) return { state: freshSave(now), status: 'future', errors: ['version ' + version + ' > ' + SAVE_VERSION], version }
  const m = migrateSave(o)
  if (!m) return { state: freshSave(now), status: 'corrupt', errors: ['version ' + version], version }
  const { state, errors } = validateSave(m)
  return { state, status: m !== o ? 'migrated' : errors.length ? 'repaired' : 'ok', errors, version }
}

// ---------------------------------------------------------------- Speicher
// Backend = { kind, get(key) → string | null, set(key, text) → true | Fehlertext, remove(key) }
export function memoryBackend(seed = {}) {
  const m = new Map(Object.entries(seed))
  return { kind: 'memory', get: (k) => (m.has(k) ? m.get(k) : null), set: (k, v) => { m.set(k, String(v)); return true }, remove: (k) => { m.delete(k) }, dump: () => Object.fromEntries(m) }
}
// localStorage, wenn vorhanden und beschreibbar (Safari privat, Quota, file://-Sperren → null); jeder Zugriff einzeln in try/catch
export function localStorageBackend(ls = (() => { try { return globalThis.localStorage } catch { return null } })()) {
  try { if (!ls) return null; const k = '__kfb_save_probe'; ls.setItem(k, '1'); ls.removeItem(k) } catch { return null }
  return {
    kind: 'localStorage',
    get: (k) => { try { return ls.getItem(k) } catch { return null } },
    set: (k, v) => { try { ls.setItem(k, v); return true } catch (e) { return String(e?.name || e) } },
    remove: (k) => { try { ls.removeItem(k) } catch { /* nichts */ } },
  }
}
export const defaultBackend = () => localStorageBackend() || memoryBackend()

// Spielstand-Speicher: load() → parseSave-Ergebnis (+ backup), save(state) → { ok, bytes?, reason? }, clear()
export function createSaveStore({ key = SAVE_KEY, backend = defaultBackend(), now } = {}) {
  let blocked = false // neuere Version gefunden: nicht überschreiben
  return {
    backend: backend.kind, key,
    load() {
      const raw = backend.get(key), r = parseSave(raw, { now })
      blocked = r.status === 'future'
      if ((r.status === 'corrupt' || r.status === 'future') && raw != null && backend.get(key + '.bak') == null) { backend.set(key + '.bak', raw); r.backup = key + '.bak' }
      return r
    },
    save(state, { force = false } = {}) {
      if (blocked && !force) return { ok: false, reason: 'future-version' }
      let text; try { text = serializeSave(state, { now }) } catch (e) { return { ok: false, reason: String(e.message) } }
      const res = backend.set(key, text)
      return res === true ? { ok: true, bytes: text.length } : { ok: false, reason: res }
    },
    clear() { backend.remove(key); blocked = false },
  }
}

// Ernte in den Stand übernehmen (Zähler addieren, Schlüssel anhängen) – rein, gibt einen neuen Stand zurück
export function withHarvest(state, keys = [], kindsOfKeys = {}) {
  const s = { ...state, fluff: { ...state.fluff }, fluffTotal: state.fluffTotal ?? Object.values(state.fluff || {}).reduce((a, b) => a + b, 0), collected: state.collected.slice() }, have = new Set(s.collected)
  for (const k of keys) { if (have.has(k)) continue; have.add(k); s.collected.push(k); const kind = kindsOfKeys[k]; if (kind && kind in s.fluff) { s.fluff[kind]++; s.fluffTotal++ } }
  return s
}
