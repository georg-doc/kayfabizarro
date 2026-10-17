// Slice 1 · Spielstand kfb.save/1: Rundreise, kaputte Eingaben → frischer Stand, unbekannte Version, Migration, Speicher mit Rückfall. Ohne Browser.
import { report } from './_report.mjs'
import { SAVE_SCHEMA, freshSave, serializeSave, parseSave, migrateSave, validateSave, createSaveStore, memoryBackend, localStorageBackend, defaultBackend, withHarvest } from '../../src/world/save.js'
import { FLUFF_KINDS } from '../../src/world/fluff.js'

const NOW = Date.parse('2026-10-17T12:00:00Z')
const s0 = freshSave(NOW)
const s1 = { ...s0, flags: { metUfo: true, deckSeen: 3, lastCard: 'goblin_01' }, fluff: { ...s0.fluff, heroic: 7, absurd: 2 }, collected: ['goblin:f1', 'goblin:f7#1'], player: { pos: [12.5, 0.3, -4], zone: 'goblin' } }
const text = serializeSave(s1, { now: NOW }), back = parseSave(text)
const roundTrip = back.status === 'ok' && JSON.stringify(back.state) === JSON.stringify({ ...s1, savedAt: new Date(NOW).toISOString() })

// kaputte Eingaben → frischer Stand (nie Ausnahme nach außen)
const bad = ['{', 'null', '42', '"text"', '[1,2]', 'undefined', '{"schema":"kfb.save/1","version":"zwei"}'].map((t) => parseSave(t))
const empty = parseSave(null), emptyStr = parseSave('')
// halb kaputt: falsche Felder werden repariert, der Rest bleibt
const half = parseSave(JSON.stringify({ schema: SAVE_SCHEMA, version: 1, savedAt: 'gestern', flags: { ok: true, obj: { x: 1 } }, fluff: { heroic: -3, comic: 2.7, pink: 9 }, collected: ['a', 'a', 5, 'b'], player: { pos: [1, 'x', 3], zone: 7 } }))
// unbekannte (neuere) Version
const future = parseSave(JSON.stringify({ schema: 'kfb.save/2', version: 2, fluff: {} }))
// Migration: Vor-Schema-Objekt (Version 0) → 1
const legacy = parseSave(JSON.stringify({ fluff: { tragic: 4 }, collected: ['z:f1'], pos: [1, 2, 3] }))
const noVersion = parseSave(JSON.stringify({ schema: SAVE_SCHEMA, savedAt: s0.savedAt, flags: {}, fluff: s0.fluff, collected: [], player: s0.player }))

// Speicher: Speicher-Ersatz in Node; localStorage-Backend mit Attrappe (wirft) → null; Rückfall
const mem = memoryBackend(), store = createSaveStore({ backend: mem, now: NOW })
const l0 = store.load(), w1 = store.save(s1), l1 = store.load()
const memBad = memoryBackend({ 'kfb.save': '{kaputt' }), storeBad = createSaveStore({ backend: memBad, now: NOW }), lb = storeBad.load(), wb = storeBad.save(s1)
const memFut = memoryBackend({ 'kfb.save': JSON.stringify({ schema: 'kfb.save/2', version: 2 }) }), storeFut = createSaveStore({ backend: memFut, now: NOW })
const lf = storeFut.load(), wf = storeFut.save(s1), keptFuture = JSON.parse(memFut.get('kfb.save')).version === 2, wfForce = storeFut.save(s1, { force: true })
const throwing = { setItem() { throw new Error('SecurityError') }, getItem() { throw new Error('x') }, removeItem() {} }
const quota = (() => { const m = new Map(); let full = false; return { setItem(k, v) { if (full && k === 'kfb.save') { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e } m.set(k, v) }, getItem: (k) => (m.has(k) ? m.get(k) : null), removeItem: (k) => m.delete(k), fill() { full = true } } })()
const lsQuota = localStorageBackend(quota); quota.fill(); const sq = createSaveStore({ backend: lsQuota, now: NOW }).save(s1)
// Ernte übernehmen
const h = withHarvest(s0, ['k1', 'k2', 'k1'], { k1: 'comic', k2: 'mystical' })

process.exit(report('unit-save', {
  freshShape: s0.schema === SAVE_SCHEMA && s0.version === 1 && FLUFF_KINDS.every((k) => s0.fluff[k] === 0) && s0.collected.length === 0 && s0.player.pos.join() === '0,0,0',
  roundTrip,
  timestampSet: back.state.savedAt === '2026-10-17T12:00:00.000Z',
  corruptToFresh: bad.every((r) => (r.status === 'corrupt') && JSON.stringify(r.state.fluff) === JSON.stringify(s0.fluff) && r.state.collected.length === 0),
  emptyToFresh: empty.status === 'empty' && emptyStr.status === 'empty',
  repairKeepsGood: half.status === 'repaired' && half.state.flags.ok === true && !('obj' in half.state.flags) && half.state.fluff.heroic === 0 && half.state.fluff.comic === 2 && !('pink' in half.state.fluff)
    && half.state.collected.join() === 'a,b' && half.state.player.pos.join() === '0,0,0' && half.state.player.zone === null && half.errors.length >= 5,
  unknownVersionHandled: future.status === 'future' && future.version === 2 && future.state.version === 1,
  migrateV0: legacy.status === 'migrated' && legacy.state.fluff.tragic === 4 && legacy.state.player.pos.join() === '1,2,3' && legacy.state.collected[0] === 'z:f1',
  migrateStubRefusesNewer: migrateSave({ version: 3, schema: 'kfb.save/3' }) === null && migrateSave(null) === null,
  schemaWithoutVersionOk: noVersion.status === 'ok',
  validateNeverThrows: validateSave(undefined).errors.length === 1,
  storeRoundTrip: l0.status === 'empty' && w1.ok && l1.status === 'ok' && l1.state.fluff.heroic === 7,
  storeCorruptBackup: lb.status === 'corrupt' && lb.backup === 'kfb.save.bak' && memBad.get('kfb.save.bak') === '{kaputt' && wb.ok,
  storeFutureNotOverwritten: lf.status === 'future' && !wf.ok && wf.reason === 'future-version' && keptFuture && wfForce.ok && memFut.get('kfb.save.bak') !== null,
  localStorageGuarded: localStorageBackend(throwing) === null && localStorageBackend(null) === null && !sq.ok && sq.reason === 'QuotaExceededError',
  nodeFallsBackToMemory: defaultBackend().kind === (typeof globalThis.localStorage?.setItem === 'function' ? 'localStorage' : 'memory'),
  harvestMerge: h.fluff.comic === 1 && h.fluff.mystical === 1 && h.collected.join() === 'k1,k2' && s0.collected.length === 0,
}, { half: half.errors, bytes: text.length }))
