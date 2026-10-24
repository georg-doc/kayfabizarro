// Slice 1 · Fluff-Ernte am Baum (V-423 Trefferregel, V-368/V-371; Brief WS1 Langlauf R2 Stufe 3). Rein: ohne three, ohne DOM, deterministisch (Seed),
// Node-geprüft (test/unit/harvest.mjs). Inhalt: Trefferregel (im Mittel 3 Schläge / 2 Schüsse / 1 Explosion leeren einen Baum, gestaffelt 1–2 → 3–4 → Rest),
// Abwurf-Welle (Vorschlag B2 lifecycle „loosen/drop“), Obstgarten einer Zone (Bäume aus grammar.fruitFromAnchors, Gelände-Physik fluff.stepBodyTerrain,
// Aufsammeln über fluff.collect) und Ernte-Stand über kfb.save/1 (withHarvest, Schema unverändert). Waffen sind hier nur Namen: 'punch' (Platzhalter Faust
// für den Schlagring), 'shot' (einfaches Projektil), 'explosion'; Treffer-Erkennung und Darstellung liegen beim Aufrufer.
// Annahmen (an WS0):
// H1 Zähigkeit je Baum t ∈ {−1, 0, +1} mit P 0,15 / 0,7 / 0,15 (symmetrisch → Erwartung genau 3 bzw. 2): Schläge L = 3 + t, Schüsse 2 + t (≥ 1, ≤ L),
//    Explosion immer 1. Jeder Treffer schiebt die Staffel um L / need(Waffe) Stufen weiter, so gehen auch gemischte Waffen auf (Schlag, dann Schuss …).
// H2 Staffel: Stufe 1 = 1–2 Kügelchen, jede mittlere Stufe 3–4, die letzte alle übrigen (≥ 1); fehlen Kügelchen, wird die jeweils größte frühe Stufe um 1
//    gekürzt; weniger Kügelchen als Stufen → L = Anzahl. Schuss = 2 Treffer heißt: Stufe 1, dann Stufe 2 + Rest; Explosion = alle Stufen auf einmal.
// H3 Welle je Treffer: Wackeln (loosen) + Abstand je Kügelchen (gap) + Pause zwischen Stufen; Explosion = dieselbe Staffel zusammengedrückt (ohne Wackeln).
// H4 Abwurf-Reihenfolge: ball.drop (grammar: reifste zuerst), sonst Eingabereihenfolge.
import { rngOf, release, collect, isKind, TERRAIN_FALL, stepBodyTerrain } from './fluff.js'
import { freshSave, withHarvest } from './save.js'

export const HIT = Object.freeze({
  need: { punch: 3, shot: 2, explosion: 1 }, tough: 0.15, first: [1, 2], mid: [3, 4],
  wave: { punch: { loosen: 0.5, gap: [0.08, 0.15], pause: 0.2 }, shot: { loosen: 0.25, gap: [0.08, 0.15], pause: 0.15 }, explosion: { loosen: 0, gap: [0.02, 0.0375], pause: 0.05 } },
})
export const WEAPONS = Object.freeze(Object.keys(HIT.need))

// ---------------------------------------------------------------- Trefferregel eines Baums
// balls: Kügelchen (key/id, optional drop) oder Schlüssel. Ergebnis { id, L, tough, sizes, need(w), hit(w) → Schlüssel[], left(), empty(), hits, lastWave [{ key, at }] }
export function createTreeHarvest({ id = 'tree', balls = [], seed = 0, H = HIT } = {}) {
  const rng = rngOf('harvest', id, seed), x = rng(), t = x < H.tough ? -1 : x > 1 - H.tough ? 1 : 0
  const keys = balls.map((b, i) => ({ k: typeof b === 'string' ? b : b.key ?? b.id, o: typeof b === 'object' && b.drop != null ? b.drop : i, i })).sort((a, b) => a.o - b.o || a.i - b.i).map((e) => e.k)
  const n = keys.length, L = Math.max(1, Math.min(n, H.need.punch + t)), pick = ([a, b]) => a + Math.floor(rng() * (b - a + 1))
  const sizes = Array.from({ length: L }, (_, k) => (k === L - 1 ? 0 : k === 0 ? pick(H.first) : pick(H.mid)))
  const head = () => sizes.slice(0, L - 1).reduce((a, v) => a + v, 0)
  while (L > 1 && head() > n - 1) { let j = 0; for (let k = 1; k < L - 1; k++) if (sizes[k] >= sizes[j]) j = k; sizes[j]-- } // H2
  sizes[L - 1] = Math.max(0, n - head()) // n = 0 (alles schon gesammelt): leerer Baum
  const need = (w) => { if (!(w in H.need)) throw new Error('HARVEST_WEAPON_UNKNOWN: ' + w); return w === 'explosion' ? 1 : w === 'shot' ? Math.min(L, Math.max(1, H.need.shot + t)) : L }
  let pos = 0, cur = 0, hits = 0, wave = []
  return {
    id, L, tough: t, sizes: sizes.slice(), need,
    hit(w) {
      const k = need(w); if (cur >= n) { wave = []; return [] }
      hits++
      const from = Math.floor(pos + 1e-9); pos = Math.min(L, pos + L / k); const to = pos >= L - 1e-9 ? L : Math.floor(pos + 1e-9)
      const wr = rngOf('wave', id, seed, hits), W = H.wave[w], out = []
      wave = []; let at = W.loosen
      for (let s = from; s < to; s++) { if (s > from) at += W.pause; for (let j = 0; j < sizes[s]; j++) { const key = keys[cur++]; out.push(key); wave.push({ key, at: +at.toFixed(4) }); at += W.gap[0] + (W.gap[1] - W.gap[0]) * wr() } }
      return out
    },
    left: () => n - cur, empty: () => cur >= n,
    get hits() { return hits }, get lastWave() { return wave.slice() },
  }
}

// ---------------------------------------------------------------- Ernte-Stand (kfb.save/1)
// Gesammelte Schlüssel je Zone (Präfix vor dem ersten „:“) → Sorte; toSave() hängt die neuen Schlüssel per withHarvest an (Zähler je Sorte addiert)
export function createHarvestState(save = freshSave()) {
  const have = new Set(save.collected), fresh = new Map()
  const all = () => [...have, ...fresh.keys()]
  return {
    mark(key, kind) { if (have.has(key) || fresh.has(key)) return false; if (!isKind(kind)) throw new Error('HARVEST_KIND_UNKNOWN: ' + kind); fresh.set(key, kind); return true },
    has: (key) => have.has(key) || fresh.has(key),
    keys: all,
    byZone() { const z = {}; for (const k of all()) { const id = k.split(':')[0]; (z[id] ||= []).push(k) } return z },
    counts() { const c = { ...save.fluff }; for (const kind of fresh.values()) c[kind] = (c[kind] || 0) + 1; return c },
    total: () => (save.fluffTotal ?? Object.values(save.fluff).reduce((a, b) => a + b, 0)) + fresh.size,   // Gesamt-Score (Georg 24.10.): je gesammelt, nie verbraucht
    toSave: () => withHarvest(save, [...fresh.keys()], Object.fromEntries(fresh)),
  }
}

// ---------------------------------------------------------------- Obstgarten einer Zone
// trees: [{ id, balls }] (z. B. fruitFromAnchors(...).balls), terrain { heightAt, normalAt }, state: createHarvestState-Ergebnis (gesammelte Schlüssel fehlen
// beim Start). Fester Schritt P.dt, advance(dt) aus dem Bild (deterministisch, bildratenunabhängig). Messwerte je Kügelchen: Ruhezeit, Hüpfer, Weg, Einsinken.
export function createOrchard({ zone = 'zone', seed = 0, trees = [], terrain, fall = null, state = createHarvestState() } = {}) {
  if (!terrain) throw new Error('HARVEST_NO_TERRAIN')
  const P = { ...TERRAIN_FALL, ...(fall || {}) }, balls = trees.flatMap((t) => t.balls), byKey = new Map(balls.map((b) => [b.key, b]))
  for (const b of balls) if (state.has(b.key)) b.state = 'collected'
  const harvest = new Map(trees.map((t) => [t.id, createTreeHarvest({ id: `${zone}:${t.id}`, balls: t.balls.filter((b) => b.state === 'hanging'), seed })]))
  const pending = [], m = { rest: [], bounces: [], path: [], maxSink: 0, timedOut: 0 }
  let acc = 0, time = 0
  const stepAll = () => {
    time += P.dt
    while (pending.length && pending[0].at <= time + 1e-9) { const b = byKey.get(pending.shift().key); if (b && b.state === 'hanging') { release(b, seed); b.body.r = b.r ?? P.radius; b.path = 0 } }
    for (const b of balls) {
      if (b.state !== 'falling') continue
      const q = b.body.p.slice(); stepBodyTerrain(b.body, terrain, P); const p = b.body.p
      b.path += Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); m.maxSink = Math.max(m.maxSink, terrain.heightAt(p[0], p[2]) + b.body.r - p[1])
      if (b.body.mode === 'rest') { b.state = 'resting'; m.rest.push(b.body.t); m.bounces.push(b.body.bounces); m.path.push(b.path); if (b.body.timedOut) m.timedOut++ }
    }
  }
  const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0)
  return {
    zone, balls, harvest, P, state,
    // Treffer auf einen Baum: Schlüssel der fallenden Kügelchen; sie lösen sich gestaffelt (lastWave) und fallen dann mit Gelände-Physik
    hit(treeId, weapon) { const h = harvest.get(treeId); if (!h) throw new Error('HARVEST_TREE_UNKNOWN: ' + treeId); const keys = h.hit(weapon); for (const e of h.lastWave) pending.push({ key: e.key, at: time + e.at }); pending.sort((a, b) => a.at - b.at); return keys },
    // WS-NPC Phase C (Lead-OK c): bereits fallende Kügelchen aufnehmen (fluff.releaseAt), gleiche Schritte, Ruhe und Aufsammeln wie Baum-Kügelchen
    addFalling(list) { for (const b of list) { if (byKey.has(b.key)) continue; balls.push(b); byKey.set(b.key, b) } return list.length },
    advance(dt) { acc += Math.min(dt, 0.25); let n = 0; while (acc >= P.dt - 1e-12) { acc -= P.dt; stepAll(); n++ } return n },
    // Aufsammeln bei Kontakt (fluff.collect: zu Fuß, Fahrzeug, Kapsel, Driften); markiert im Ernte-Stand
    // WS-NPC Phase C (V-583): tainted-Kügelchen (Tusche) sind nicht aufsammelbar, sie sinken nach der Ruhezeit ein (orchard3d)
    collect(collector) { const r = collect(balls.filter((b) => !b.tainted), collector); for (const k of r.keys) { const b = byKey.get(k); b.state = 'collected'; state.mark(k, b.kind) } return r },
    counts: () => state.counts(),
    stats: () => ({
      hanging: balls.filter((b) => b.state === 'hanging').length, falling: balls.filter((b) => b.state === 'falling').length, resting: balls.filter((b) => b.state === 'resting').length,
      collected: balls.filter((b) => b.state === 'collected').length, time: +time.toFixed(4), restMean: mean(m.rest), restMax: m.rest.length ? Math.max(...m.rest) : 0,
      bouncesMean: mean(m.bounces), pathMean: mean(m.path), maxSink: m.maxSink, timedOut: m.timedOut, settled: m.rest.length,
    }),
  }
}
