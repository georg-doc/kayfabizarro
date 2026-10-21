// WS-NPC Phase B · Weltstand kfb.world-save/1 (Owner: WS1-Lead, WS1_STATUS §118; Brief WS-NPC R2 Frage 4). Rein, Node-geprüft (test/unit/worldSave.mjs).
// Getrennt vom Spielstand kfb.save/1 (WORLD_CONTRACT_R1: „Nie Spielstand in der Welt“). Inhalt: Welt-Schalter und das NPC-Gedächtnis.
// { schema, version, savedAt, flags, npc: { v: 1, receipts: Receipt[] } } · Receipt-Schema von WS-NPC (21.10.):
//   { id, residentId, eventKey, kind, mode: observed|participated|told, with[≤4], from? (nur told), day ≥ 0, t 0..1, salience 0..3 }
//   id = fnv1a(residentId|eventKey|mode) → idempotent. Kein Freitext, keine Profile/Pläne im Save; Beziehungen leitet die Laufzeit aus den Belegen ab.
// Laden prüft und repariert wie save.js: kaputt → frischer Stand (Rohtext unter <key>.bak), neuere Version → frischer Stand im Speicher, Datei bleibt.
import { memoryBackend, localStorageBackend, defaultBackend } from './save.js'
export { memoryBackend, localStorageBackend, defaultBackend }

export const WORLD_SAVE_SCHEMA = 'kfb.world-save/1'
export const WORLD_SAVE_VERSION = 1
export const WORLD_SAVE_KEY = 'kfb.world-save'
export const WORLD_SAVE_LIMITS = Object.freeze({ flags: 256, flagKey: 64, flagText: 256, perResident: 16, receipts: 256, with: 4, eventKey: 128, bytes: 1_000_000 })
export const RECEIPT_KINDS = Object.freeze(['met', 'greeted', 'silent', 'interrupted_by_player', 'player_greeted', 'plague_seen', 'fluffer_cured'])   // erweiterbar nur mit WS0
export const RECEIPT_MODES = Object.freeze(['observed', 'participated', 'told'])
const ID_RE = /^[a-z0-9_-]{1,40}$/
const fnv1a = (t) => { let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 } return h.toString(16).padStart(8, '0') }
export const receiptId = (residentId, eventKey, mode) => fnv1a(`${residentId}|${eventKey}|${mode}`)

const isObj = (o) => !!o && typeof o === 'object' && !Array.isArray(o)
const nowIso = (now) => new Date(now ?? Date.now()).toISOString()

export function freshWorldSave(now) {
  return { schema: WORLD_SAVE_SCHEMA, version: WORLD_SAVE_VERSION, savedAt: nowIso(now), flags: {}, npc: { v: 1, receipts: [] } }
}

// Prüfen und in die Normalform bringen. Ergebnis { state, errors[] } (errors = was repariert wurde; leer = sauber)
export function validateWorldSave(o) {
  const L = WORLD_SAVE_LIMITS, errors = [], s = freshWorldSave(0)
  if (!isObj(o)) return { state: s, errors: ['kein Objekt'] }
  if (o.schema !== WORLD_SAVE_SCHEMA) errors.push('schema')
  if (typeof o.savedAt === 'string' && !Number.isNaN(Date.parse(o.savedAt))) s.savedAt = new Date(o.savedAt).toISOString(); else errors.push('savedAt')
  if (isObj(o.flags)) {
    for (const [k, v] of Object.entries(o.flags).slice(0, L.flags)) {
      if (k.length > L.flagKey) { errors.push('flag-key'); continue }
      if (typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v))) s.flags[k] = v
      else if (typeof v === 'string') s.flags[k] = v.slice(0, L.flagText)
      else errors.push('flag:' + k)
    }
  } else if (o.flags !== undefined) errors.push('flags')
  if (isObj(o.npc) && Array.isArray(o.npc.receipts)) { const r = normalizeReceipts(o.npc.receipts); s.npc.receipts = r.receipts; errors.push(...r.errors) }
  else if (o.npc !== undefined) errors.push('npc')
  return { state: s, errors }
}

// Alte Formen heben. Stand heute gibt es nur Version 1; neuere Version → null (nicht anfassen). Weitere Schritte hier anhängen.
export function migrateWorldSave(o) {
  if (!isObj(o)) return null
  if ((o.version ?? null) === WORLD_SAVE_VERSION && o.schema === WORLD_SAVE_SCHEMA) return o
  return null
}

export function serializeWorldSave(state, { now } = {}) {
  const { state: s } = validateWorldSave({ ...state, schema: WORLD_SAVE_SCHEMA, savedAt: nowIso(now) })
  const text = JSON.stringify(s)
  if (text.length > WORLD_SAVE_LIMITS.bytes) throw new Error('WORLD_SAVE_TOO_LARGE: ' + text.length)
  return text
}

// Ergebnis { state, status: 'ok' | 'repaired' | 'empty' | 'corrupt' | 'future', errors[], version }
export function parseWorldSave(text, { now } = {}) {
  if (text == null || text === '') return { state: freshWorldSave(now), status: 'empty', errors: [], version: null }
  let o; try { o = JSON.parse(text) } catch (e) { return { state: freshWorldSave(now), status: 'corrupt', errors: ['json: ' + e.message], version: null } }
  if (!isObj(o)) return { state: freshWorldSave(now), status: 'corrupt', errors: ['kein Objekt'], version: null }
  const version = o.version ?? null
  if (typeof version === 'number' && version > WORLD_SAVE_VERSION) return { state: freshWorldSave(now), status: 'future', errors: ['version ' + version + ' > ' + WORLD_SAVE_VERSION], version }
  const m = migrateWorldSave(o)
  if (!m) return { state: freshWorldSave(now), status: 'corrupt', errors: ['version ' + version], version }
  const { state, errors } = validateWorldSave(m)
  return { state, status: errors.length ? 'repaired' : 'ok', errors, version }
}

// Weltstand-Speicher: load() → parseWorldSave-Ergebnis (+ backup), save(state) → { ok, bytes?, reason? }, clear()
export function createWorldSaveStore({ key = WORLD_SAVE_KEY, backend = defaultBackend(), now } = {}) {
  let blocked = false
  return {
    backend: backend.kind, key,
    load() {
      const raw = backend.get(key), r = parseWorldSave(raw, { now })
      blocked = r.status === 'future'
      if ((r.status === 'corrupt' || r.status === 'future') && raw != null && backend.get(key + '.bak') == null) { backend.set(key + '.bak', raw); r.backup = key + '.bak' }
      return r
    },
    save(state, { force = false } = {}) {
      if (blocked && !force) return { ok: false, reason: 'future-version' }
      let text; try { text = serializeWorldSave(state, { now }) } catch (e) { return { ok: false, reason: String(e.message) } }
      const res = backend.set(key, text)
      return res === true ? { ok: true, bytes: text.length } : { ok: false, reason: res }
    },
    clear() { backend.remove(key); blocked = false },
  }
}

// ---------------------------------------------------------------- NPC-Belege (Receipts)
// Ein Beleg prüfen und normalisieren → Beleg oder null (verworfen)
function cleanReceipt(r) {
  const L = WORLD_SAVE_LIMITS
  if (!isObj(r) || typeof r.residentId !== 'string' || !ID_RE.test(r.residentId) || typeof r.eventKey !== 'string' || !r.eventKey || r.eventKey.length > L.eventKey) return null
  if (!RECEIPT_KINDS.includes(r.kind) || !RECEIPT_MODES.includes(r.mode)) return null
  if (!Number.isInteger(r.day) || r.day < 0 || !Number.isFinite(r.t) || r.t < 0 || r.t > 1) return null
  const sal = Number.isFinite(r.salience) ? Math.max(0, Math.min(3, Math.round(r.salience))) : 0
  const w = Array.isArray(r.with) ? r.with.filter((x) => typeof x === 'string' && (x === 'player' || ID_RE.test(x))).slice(0, L.with) : []
  const e = { id: receiptId(r.residentId, r.eventKey, r.mode), residentId: r.residentId, eventKey: r.eventKey, kind: r.kind, mode: r.mode, with: w, day: r.day, t: r.t, salience: sal }
  if (r.mode === 'told') { if (typeof r.from !== 'string' || !(r.from === 'player' || ID_RE.test(r.from))) return null; e.from = r.from }
  return e
}
const older = (a, b) => a.day - b.day || a.t - b.t
// Liste reparieren: verwerfen, zusammenlegen (gleiche id), told ohne Quelle raus, Kappen (zuerst niedrigste salience, dann ältester)
function normalizeReceipts(list) {
  const L = WORLD_SAVE_LIMITS, errors = [], byId = new Map()
  for (const r of list) { const e = cleanReceipt(r); if (!e) { errors.push('receipt'); continue } const p = byId.get(e.id); if (p) { errors.push('receipt-dupe'); if (e.salience > p.salience) p.salience = e.salience } else byId.set(e.id, e) }
  let rs = [...byId.values()]
  const witnessed = new Set(rs.filter((e) => e.mode !== 'told').map((e) => e.residentId + '|' + e.eventKey))
  const n0 = rs.length; rs = rs.filter((e) => e.mode !== 'told' || e.from === 'player' || witnessed.has(e.from + '|' + e.eventKey)); if (rs.length < n0) errors.push('told-ohne-quelle')
  const evict = (arr, n) => arr.slice().sort((a, b) => a.salience - b.salience || older(a, b)).slice(arr.length - n)   // behält die n wichtigsten/jüngsten
  const per = new Map(); for (const e of rs) { if (!per.has(e.residentId)) per.set(e.residentId, []); per.get(e.residentId).push(e) }
  let capped = []; for (const [, arr] of per) { if (arr.length > L.perResident) errors.push('cap-resident'); capped.push(...(arr.length > L.perResident ? evict(arr, L.perResident) : arr)) }
  if (capped.length > L.receipts) { errors.push('cap-total'); capped = evict(capped, L.receipts) }
  capped.sort(older)
  return { receipts: capped, errors }
}
// Beleg hinzufügen (rein): { ws, added } – gleiches Ereignis zweimal = ein Eintrag
export function addReceipt(ws, r) {
  const e = cleanReceipt(r); if (!e) return { ws, added: false }
  const cur = ws.npc?.receipts || []; if (cur.some((x) => x.id === e.id)) return { ws, added: false }
  const { receipts } = normalizeReceipts([...cur, e]); const added = receipts.some((x) => x.id === e.id)
  return { ws: { ...ws, npc: { v: 1, receipts } }, added }
}
export const receiptsOf = (ws, residentId) => (ws.npc?.receipts || []).filter((e) => e.residentId === residentId)
// Weiß der Bewohner davon? → 'participated' | 'observed' | 'told' | null (stärkste Form zuerst)
export function knows(ws, residentId, eventKey) { const m = new Set(receiptsOf(ws, residentId).filter((e) => e.eventKey === eventKey).map((e) => e.mode)); return m.has('participated') ? 'participated' : m.has('observed') ? 'observed' : m.has('told') ? 'told' : null }
