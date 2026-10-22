// WS-NPC K15 (Lead 22.10.: mehrere Dark Fluffer) · Plan der Erscheinen je Obstgarten-Zone, rein, Node-geprüft (test/unit/flufferKinds.mjs).
// Bis der Welt-Ereignis-Host die Spawns übernimmt (spawnAt/events wie E3), gelten feste Spawns: Erscheinen n einer Zone beginnt bei
// T0 + def.offsetS + n·dayS. Sorte je Erscheinen per Tages-Seed aus den 15 Boden-Cubes (fluffer.kinds.k15.json); def.kind hält eine Sorte fest
// (goblin: ghost), def.firstKind gilt nur für das erste Erscheinen (atlantis: mushroom). Am selben Welttag tragen die Zonen verschiedene Sorten;
// die Reihenfolge der Daten entscheidet, wer zuerst zieht (unabhängig davon, wann ein Fluffer erscheint).
import { rngOf } from '../world/fluff.js'

// Erscheinen zur Zeit t: das jüngste mit Start ≤ t, vor dem ersten das erste ({ n: 0, t0 })
export function appearanceAt(def, T0, dayS, t) {
  const s = T0 + (def.offsetS ?? 0), n = t < s ? 0 : Math.floor((t - s) / dayS)
  return { n, t0: s + n * dayS }
}

// Sorten aller Zonen für einen Welttag; nOf(def) = Nummer des Erscheinens dieser Zone an dem Tag (für firstKind)
export function kindsForDay(defs, kinds, day, nOf = () => 0) {
  const fixed = (d) => d.kind || (nOf(d) === 0 && d.firstKind) || null
  const out = {}, taken = new Set(defs.map(fixed).filter(Boolean))
  for (const d of defs) {
    let k = fixed(d)
    if (!k) { const pool = kinds.filter((x) => !taken.has(x)), rng = rngOf('fluffer-kind', d.zone, day); k = pool[Math.floor(rng() * pool.length)] }
    taken.add(k); out[d.id] = k
  }
  return out
}
