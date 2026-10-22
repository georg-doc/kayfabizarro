// WS-Audio R1 (V-598) · Wasser des Probe-Geländes für die Atmo (rein, Node-geprüft): einmal ein Index aus terrain.hydro(), dann je Abfrage
// die nächste Stelle je Art (Fluss, Wasserfall, Meer) im Hörbereich und das Biom der Stelle (meadow | pond am Bergsee | beach am Meer).
// Ergebnis = Quellen für kfb-ambience.v1 (setWaterEmitters / moveWaterEmitters, ids stabil: 'river' · 'fall' · 'sea').
export const WATER_RANGE = Object.freeze({ river: 90, fall: 140, sea: 160 })
export const BIOME_RANGE = Object.freeze({ pondIn: 30, pondOut: 45, beachIn: 55, beachOut: 75 })

export const SEA_STEP = 10
// Meer: 10-m-Raster, nur Zellen unter dem Meeresspiegel mit Land daneben (Brandung); je Zeile ≈ 60 Höhen-Abfragen
function seaRow(h, z, out) { const R = h.R || 300, st = SEA_STEP, lo = h.seaY - 0.3
  for (let x = -R; x <= R; x += st) { if (x * x + z * z > R * R || h.height(x, z) >= lo) continue
    if (h.height(x + st, z) >= lo || h.height(x - st, z) >= lo || h.height(x, z + st) >= lo || h.height(x, z - st) >= lo) out.push(x, h.seaY, z) } }
// wie createWaterIndex, aber das Meer zeilenweise über mehrere Takte (kein Ruckler beim Start); onDone(index)
export function createWaterIndexAsync(h, onDone, rowsPerChunk = 6) {
  const W = createWaterIndex({ ...h, seaY: null }); if (!W || h.seaY == null || !h.height) { onDone?.(W); return () => {} }
  const sea = [], R = h.R || 300; let z = -R, stop = false
  const step = () => { if (stop) return; for (let k = 0; k < rowsPerChunk && z <= R; k++, z += SEA_STEP) seaRow(h, z, sea)
    if (z <= R) setTimeout(step, 0); else { W.sea = new Float32Array(sea); W.counts.sea = sea.length / 3; onDone?.(W) } }
  setTimeout(step, 0); return () => { stop = true }
}
export function createWaterIndex(h) {
  if (!h) return null
  const river = [], falls = [], sea = [], lakes = []
  for (const L of h.lines || []) for (const p of L.pts || []) river.push(p.x, p.lv ?? 0, p.z)
  for (const f of h.falls || []) falls.push(f.b.x, f.bot, f.b.z)
  const g = h.grid
  if (g) for (const Lk of h.lakes || []) { let sx = 0, sz = 0, r2 = 0; const n = Lk.cells.length
    for (const c of Lk.cells) { sx += g.o + (c % g.HN) * g.HG; sz += g.o + Math.floor(c / g.HN) * g.HG }
    const cx = sx / n, cz = sz / n; for (const c of Lk.cells) { const x = g.o + (c % g.HN) * g.HG - cx, z = g.o + Math.floor(c / g.HN) * g.HG - cz; r2 = Math.max(r2, x * x + z * z) }
    lakes.push({ x: cx, y: Lk.lv, z: cz, r: Math.sqrt(r2) }) }
  if (h.seaY != null && h.height) for (let z = -(h.R || 300); z <= (h.R || 300); z += SEA_STEP) seaRow(h, z, sea)
  return { river: new Float32Array(river), falls: new Float32Array(falls), sea: new Float32Array(sea), lakes, counts: { river: river.length / 3, falls: falls.length / 3, sea: sea.length / 3, lakes: lakes.length } }
}
function nearest(arr, x, z) { let best = -1, bd = Infinity; for (let i = 0; i < arr.length; i += 3) { const dx = arr[i] - x, dz = arr[i + 2] - z, d = dx * dx + dz * dz; if (d < bd) { bd = d; best = i } } return best < 0 ? null : { x: arr[best], y: arr[best + 1], z: arr[best + 2], d: Math.sqrt(bd) } }
// p: Hörer {x,y,z}; prevBiome für das Nachlaufen (kein Flattern an der Grenze)
export function waterNear(W, p, prevBiome = 'meadow') {
  if (!W || !p) return { emitters: [], biome: 'meadow' }
  const out = [], r = nearest(W.river, p.x, p.z), f = nearest(W.falls, p.x, p.z), s = nearest(W.sea, p.x, p.z)
  if (r && r.d < WATER_RANGE.river) out.push({ id: 'river', kind: 'river', x: r.x, y: r.y, z: r.z, d: r.d })
  if (f && f.d < WATER_RANGE.fall) out.push({ id: 'fall', kind: 'waterfall', x: f.x, y: f.y, z: f.z, d: f.d })
  if (s && s.d < WATER_RANGE.sea) out.push({ id: 'sea', kind: 'beach', x: s.x, y: s.y, z: s.z, d: s.d })
  let lakeD = Infinity; for (const L of W.lakes) lakeD = Math.min(lakeD, Math.hypot(L.x - p.x, L.z - p.z) - L.r)
  const seaD = s ? s.d : Infinity, B = BIOME_RANGE
  let biome = 'meadow'
  if (seaD < (prevBiome === 'beach' ? B.beachOut : B.beachIn)) biome = 'beach'
  else if (lakeD < (prevBiome === 'pond' ? B.pondOut : B.pondIn)) biome = 'pond'
  return { emitters: out, biome, lakeD, seaD }
}
// Untergrund unter dem Racer (wie terrainDustColor: steil = Fels, Hang = Erde → Sand-Klang, oben = Gras, Talboden = Sand), Wasser: Fluss nah / Meer
export function hoverSurface({ slope = 0, y = 0, flatY = 0.8, nearWater = Infinity, seaY = null } = {}) {
  if (nearWater < 7 || (seaY != null && y < seaY + 0.6)) return 'water'
  return slope > 0.7 ? 'rock' : slope > 0.3 ? 'sand' : y > flatY ? 'grass' : 'sand'
}
// Untergrund für Schritte (Audio Site Bänke): Platz/Bühne = Stein, am Wasser = nasser Lehm, Sandufer, sonst Gras
export function stepSurface({ r = 0, flatR = 0, nearWater = Infinity, y = 0, seaY = null, slope = 0 } = {}) {
  if (r < flatR) return 'foley-concrete'
  if (nearWater < 2.5 || (seaY != null && y < seaY + 0.15)) return 'water' // waten (WS0 S01)
  if (seaY != null && y < seaY + 0.8) return 'sand'
  if (nearWater < 6) return 'wet-clay'
  if (slope > 0.7) return 'foley-gravel'
  return 'digital-grass'
}
