// WS-NPC · S3 Szenen-Raster, PLATZHALTER (Lead 25.10.: austauschbar gegen das Raster von WS1b, Konzept Prozedurale Welt R1.5 §4, §5.1, §8 S1.1).
// Je Zelle höchstens ein Bühnenplatz, deterministisch je Seed und Zelle (P1). Gesucht wird die sanfteste Stelle unter `tries` Kandidaten (kleinste
// Neigung im Radius R); zu steil, im Wasser oder außerhalb der Welt → kein Platz. Nur lesen: das Raster trägt nichts auf (Auftrags-Hügel nach V-716 ist
// Sache des echten Rasters bei WS1b).
// Schnittstelle (die WS1b-Fassung muss sie erfüllen): spotOf(cx, cz) → Platz | null · spotsAround(x, z, r) → [Platz + d] · cellOf(x, z) → [cx, cz]
//   Platz = { cell: [cx, cz], x, z, y, R, slope }
export const GRID = Object.freeze({ cell: 192, tries: 9, margin: 0.2, R: 8, maxSlope: 0.12 })   // 192 m und R nach Konzept §4/§5.1; tries, margin, maxSlope: Platzhalter

const h32 = (a, b, c) => { let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

// options: { seed, cell, tries, margin, R, maxSlope, groundAt(x, z) → y, isWater?(x, z), inWorld?(x, z) }
export function createSceneGrid(options) {
  const o = { ...GRID, ...options }, { seed = 1, groundAt, isWater = () => false, inWorld = () => true } = o
  const memo = new Map()
  const slopeAt = (x, z) => { const y = groundAt(x, z); let m = 0; for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; m = Math.max(m, Math.abs(groundAt(x + Math.cos(a) * o.R, z + Math.sin(a) * o.R) - y) / o.R) } return m }
  function spotOf(cx, cz) {
    const key = cx + ',' + cz
    if (memo.has(key)) return memo.get(key)
    let best = null
    for (let i = 0; i < o.tries; i++) {
      const x = (cx + o.margin + (1 - 2 * o.margin) * h32(seed, cx * 7 + i, cz * 13 + 1)) * o.cell, z = (cz + o.margin + (1 - 2 * o.margin) * h32(seed + 1, cx * 11 + i, cz * 5 + 3)) * o.cell
      if (!inWorld(x, z) || isWater(x, z)) continue
      const s = slopeAt(x, z); if (!best || s < best.slope) best = { cell: [cx, cz], x: +x.toFixed(2), z: +z.toFixed(2), y: +groundAt(x, z).toFixed(3), R: o.R, slope: +s.toFixed(4) }
    }
    const out = best && best.slope <= o.maxSlope ? Object.freeze(best) : null
    memo.set(key, out)
    return out
  }
  const cellOf = (x, z) => [Math.floor(x / o.cell), Math.floor(z / o.cell)]
  function spotsAround(x, z, r) {
    const [c0, d0] = cellOf(x - r, z - r), [c1, d1] = cellOf(x + r, z + r), out = []
    for (let cx = c0; cx <= c1; cx++) for (let cz = d0; cz <= d1; cz++) { const s = spotOf(cx, cz); if (!s) continue; const d = Math.hypot(s.x - x, s.z - z); if (d <= r) out.push({ ...s, d: +d.toFixed(2) }) }
    return out.sort((a, b) => a.d - b.d)
  }
  return { spotOf, spotsAround, cellOf, options: () => ({ ...o, groundAt: undefined, isWater: undefined, inWorld: undefined }), kind: 'platzhalter-ws-npc' }
}
