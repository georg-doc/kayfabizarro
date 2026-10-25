// V-782 · kfb-place im Spiel: Rezept je 64-m-Zelle im Worker (Löser kostet 10–80 ms, das Bild nicht). Höhen kommen als Raster vom Hauptfaden
// (Gelände bleibt eine Wahrheit, V-563), hier nur bilinear abgefragt. Löser und Regeln byte-gleich aus CANON_3D/lib (vendor/place).
import { placeChunk, grovePlan } from '../vendor/place/kfb-place-core.v1.mjs'
import CFG from '../vendor/place/kfb_place.r1.slim.json'
import { ZONE, zoneN, speciesN } from './zoneField.js'

// V-797 · Stilbild nach KayKit (Georg q213): Bewuchs als Massen statt Mikro-Gruppen. Waldzone (Zonenfeld) wird dicht gefüllt, Krone an Krone,
// eine Baumfamilie je Masse; am Saum lichter mit runden Büschen; Wiese fast leer (seltene Solitäre); Fels nur als große Formation am steilen Hang.
// Kein Kies, keine Kontakt-/Fußsteinchen, kein Streugras (Boden ist Material).
const KK = CFG.tiles.filter((t) => t.kit === 'KayKit Forest'), byFam = (re) => KK.filter((t) => re.test(t.id))
const FAMS = [byFam(/:Tree_1_/), byFam(/:Tree_2_/), byFam(/:Tree_3_/)], BUSH = byFam(/:Bush_(1|3)_/), SOLO = byFam(/:Tree_(1|2)_/)
const STL = CFG.tiles.filter((t) => t.kind === 'stone_L' && t.kit === 'Steinkit v4'), STM = CFG.tiles.filter((t) => t.kind === 'stone_M' && t.kit === 'Steinkit v4')
// V-799 · Stilbild 2 nach Modell R3 (Georg q217: Herriman/Noble/Lozzi + Ortsbiografie; Tipps: Stufen statt Verläufe, Poisson-Abstände, Haupt-Asset mit Ablegern).
// Quellen statt Rauschfeld: (1) Grate tragen Baumreihen als Silhouette, (2) Hangbrüche tragen wenige große Fels-Formationen, Bruchstücke nur am Fuß hangab,
// darum Bewuchs nach außen (Büschel am Fuß → Büsche 2–6 m → Bäume ab 6 m), (3) Wiese ruhig mit seltenen Solitären samt Ablegern. Alles mit Mindestabstand.
function cartoonChunk({ x0, z0, size, h, seed }) {
  let a = 2166136261 >>> 0; for (const c of `${seed}|cartoon|${x0}|${z0}`) { a ^= c.charCodeAt(0); a = Math.imul(a, 16777619) >>> 0 }
  const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)], out = [], taken = []
  const free = (x, z, r) => taken.every((q) => (q[0] - x) ** 2 + (q[1] - z) ** 2 >= ((q[2] + r) * 1.25) ** 2)   // Poisson-Abstand mit Luft ≥ 25 % (Etherington: keine Tangenten)
  const put = (t, x, z, s, role, r, child = false) => { if (!t || (!child && !free(x, z, r))) return false;   // Begleiter einer Gruppe (child) überlappen bewusst, Fremde halten Luft
    taken.push([x, z, r]); out.push({ t: t.id, k: t.kind, r: role, p: [x, h(x, z), z], ry: rnd() * 6.283, rx: 0, rz: 0, s, sk: t.kind === 'tree' ? 0.05 : t.kind === 'bush' ? 0.08 : t.kind === 'grass' ? 0.1 : 0.3, cr: 0, cc: 0 }); return true }
  const slope = (x, z) => Math.hypot(h(x + 1, z) - h(x - 1, z), h(x, z + 1) - h(x, z - 1)) / 2
  const fam = (x, z) => FAMS[Math.min(2, Math.floor(speciesN(x, z) * 3))], GRASS = KK.filter((t) => t.kind === 'grass' && /Singlesided$/i.test(t.id))
  const inCell = (x, z) => x >= x0 && z >= z0 && x < x0 + size && z < z0 + size
  // (2) Formationen an Hangbrüchen: 1 groß + 1–2 mittel, Bruchstücke 1–3 hangab am Fuß, Bewuchs nach außen
  for (let k = 0; k < 10; k++) { const x = x0 + 6 + rnd() * (size - 12), z = z0 + 6 + rnd() * (size - 12), sl = slope(x, z); if (sl < 0.4 || rnd() > 0.5) continue
    const L = pick(STL), sL = 4 + rnd() * 2, rL = ((L.gate_r_m || L.hull_r_m || 0.4)) * sL; if (!put(L, x, z, sL, 'formation', rL * 0.9)) continue
    const gx = h(x + 1, z) - h(x - 1, z), gz = h(x, z + 1) - h(x, z - 1), dn = Math.atan2(-gz, -gx)
    for (let m = 0; m < 2; m++) { const M = pick(STM), sM = sL * (m ? 0.35 : 0.6), an = dn + Math.PI + (m ? 1.1 : -0.7) + (rnd() - 0.5) * 0.4, d = rL * (0.8 + m * 0.25); put(M, x + Math.cos(an) * d, z + Math.sin(an) * d, sM, 'formation', (M.gate_r_m || 0.2) * sM * 0.8, true) }   // 1 : 0,6 : 0,35, drei Teile
    for (let m = 0, n = rnd() < 0.5 ? 1 : 3; m < n; m++) { const S = pick(STM), sS = sL * (0.15 - m * 0.03), an = dn + (rnd() - 0.5) * 0.9, d = rL * (1.15 + m * (0.4 + rnd() * 0.3)); put(S, x + Math.cos(an) * d, z + Math.sin(an) * d, sS, 'rubble', (S.gate_r_m || 0.2) * sS, true) }   // Schwerkraft: hangab, nach außen kleiner, Abstände ungleich
    for (let m = 0, n = rnd() < 0.5 ? 3 : 5; m < n; m++) { const an = dn + Math.PI + (m / (n - 1) - 0.5) * 1.6 + (rnd() - 0.5) * 0.25, d = rL * (1.02 + rnd() * 0.15); put(pick(GRASS), x + Math.cos(an) * d, z + Math.sin(an) * d, [1.2, 0.75, 0.45, 0.9, 0.6][m], 'foot', 0.15, true) }   // Büschel 3–5 gestaffelt in der Kehle bergauf
    const sunA = 2.5, ba = sunA + (rnd() - 0.5) * 1.2, bd = rL + 2 + rnd() * 2.5; let bOk = false; [1, 0.62, 0.38].forEach((f, m) => { const an = ba + [0, 0.45, -0.38][m], d = bd + [0, 0.7, 1.15][m]; const ok = put(pick(BUSH), x + Math.cos(an) * d, z + Math.sin(an) * d, 0.8 + f * 0.6, 'seam', 0.6 * f + 0.3, m > 0 && bOk); if (m === 0) bOk = ok })   // Busch-Dreier 1 : 0,62 : 0,38, nicht auf einer Linie
    for (let m = 0, n = rnd() < 0.6 ? 1 : 3; m < n; m++) { const an = dn + Math.PI + (rnd() - 0.5) * 2.4, d = rL + 6 + rnd() * 4; put(pick(fam(x, z)), x + Math.cos(an) * d, z + Math.sin(an) * d, [1.15, 0.9, 0.7][m], 'frame', 1.6) } }   // rahmende Bäume ab 6 m, 1 oder 3
  // (1) Grate: Baumreihen als Silhouette (Lozzi), Abstand nach Kronen
  for (let gz = z0 + 1.5; gz < z0 + size; gz += 3) for (let gx = x0 + 1.5; gx < x0 + size; gx += 3) {
    const c = h(gx, gz), cv = (d) => Math.max(c - (h(gx - d, gz) + h(gx + d, gz)) / 2, c - (h(gx, gz - d) + h(gx, gz + d)) / 2), conv = cv(7), conv2 = cv(16)
    if (conv > 0.8 && conv2 > 1.6 && slope(gx, gz) < 0.4 && rnd() < 0.7) { const x = gx + (rnd() - 0.5) * 2.8, z = gz + (rnd() - 0.5) * 2.8; put(pick(fam(x, z)), x, z, 0.95 + rnd() * 0.3, 'ridge', 1.45) } }   // Silhouettenreihe, aber Abstände ungleich und nie drei auf einer Linie im Raster   // nur echte Grate (zwei Maßstäbe), nicht jede Kuppe
  // (3) Wiese: seltene Solitäre mit Ablegern (Haupt-Asset erhöht die Wahrscheinlichkeit kleiner Nachbarn)
  for (let k = 0; k < 6; k++) { const x = x0 + rnd() * size, z = z0 + rnd() * size; if (slope(x, z) > 0.3 || rnd() > 0.35) continue
    if (!put(pick(SOLO), x, z, 1.15 + rnd() * 0.3, 'solitaire', 3.5)) continue
    const an0 = rnd() * 6.283; for (let m = 0, n = rnd() < 0.6 ? 2 : 4; m < n; m++) { const an = an0 + m * 2.4, d = 2.0 + m * (0.7 + rnd() * 0.5); put(pick(BUSH), x + Math.cos(an) * d, z + Math.sin(an) * d, [0.95, 0.6, 0.45, 0.35][m], 'offspring', 0.5, true) }   // Haupt-Asset + Ableger: Gruppe 3 oder 5, Größen gestaffelt
    for (let m = 0; m < 3; m++) { const an = an0 + Math.PI + (m - 1) * 0.5 + (rnd() - 0.5) * 0.3, d = 1.2 + rnd() * 0.4; put(pick(GRASS), x + Math.cos(an) * d, z + Math.sin(an) * d, [1.1, 0.7, 0.45][m], 'foot', 0.15, true) } }   // Büschel unter der Tropfkante, Schattenseite
  return out.filter((o) => inCell(o.p[0], o.p[2]))
}
function massChunk({ x0, z0, size, h, seed }) {
  let a = 2166136261 >>> 0; for (const c of `${seed}|mass|${x0}|${z0}`) { a ^= c.charCodeAt(0); a = Math.imul(a, 16777619) >>> 0 }
  const rnd = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)], out = [], G = 2.35   // Kronen schließen sich (KayKit-Masse)
  const put = (t, x, z, s, role) => out.push({ t: t.id, k: t.kind, r: role, p: [x, h(x, z), z], ry: rnd() * 6.283, rx: 0, rz: 0, s, sk: t.kind === 'tree' ? 0.05 : t.kind === 'bush' ? 0.08 : 0.35, cr: 0, cc: 0 })
  for (let gz = z0 + G / 2; gz < z0 + size; gz += G) for (let gx = x0 + G / 2; gx < x0 + size; gx += G) {
    const x = gx + (rnd() - 0.5) * G * 0.8, z = gz + (rnd() - 0.5) * G * 0.8, zn = zoneN(x, z), f = ZONE.forest, e = ZONE.edge
    const sl = Math.hypot(h(x + 1, z) - h(x - 1, z), h(x, z + 1) - h(x, z - 1)) / 2
    if (sl > 0.5 && rnd() < 0.025 && STL.length) { const L = pick(STL); put(L, x, z, 0.9 + rnd() * 0.5, 'formation'); const n = Math.floor(rnd() * 3)
      for (let k = 0; k < n; k++) { const an = rnd() * 6.283, d = 0.9 + rnd() * 0.5; put(pick(STM), x + Math.cos(an) * d, z + Math.sin(an) * d, 0.9 + rnd() * 0.4, 'formation') } continue }
    if (zn >= f) { const dens = Math.min(1, (zn - f) / 0.04 * 0.9 + 0.1); if (rnd() < dens) { const fam = FAMS[Math.min(2, Math.floor(speciesN(x, z) * 3))]; put(pick(fam), x, z, 0.95 + rnd() * 0.4, 'mass') } }
    else if (zn >= f - e) { const t = (zn - (f - e)) / e; if (rnd() < 0.35 * t) put(pick(BUSH), x, z, 0.9 + rnd() * 0.4, 'seam'); else if (rnd() < 0.12 * t) put(pick(FAMS[Math.min(2, Math.floor(speciesN(x, z) * 3))]), x, z, 0.8 + rnd() * 0.3, 'outlier') }
    else if (rnd() < 0.0025) put(pick(SOLO), x, z, 1.0 + rnd() * 0.3, 'solitaire')
  }
  return out
}

self.onmessage = (e) => {
  const { id, x0, z0, size, step, n, grid, seed, biome, mode } = e.data
  const h = (x, z) => {   // bilinear im Raster (n × n Punkte, Abstand step, Ursprung x0/z0), außen geklemmt
    const fx = Math.min(n - 1.001, Math.max(0, (x - x0) / step)), fz = Math.min(n - 1.001, Math.max(0, (z - z0) / step)), i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j
    const a = grid[j * n + i], b = grid[j * n + i + 1], c = grid[(j + 1) * n + i], d = grid[(j + 1) * n + i + 1]
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v }
  let out
  if (mode === 'cartoon') { try { out = { id, ok: true, instances: cartoonChunk({ x0, z0, size, h, seed }), report: { groups: [], grass: [] } } } catch (err) { out = { id, ok: false, error: String(err?.message || err) } } self.postMessage(out); return }
  if (mode === 'mass') { try { out = { id, ok: true, instances: massChunk({ x0, z0, size, h, seed }), report: { groups: [], grass: [] } } } catch (err) { out = { id, ok: false, error: String(err?.message || err) } } self.postMessage(out); return }
  try {
    // Zonengröße je Biom (V-784): eine Zone = 2–4 Gruppen (rules.zone); am Waldrand 32 m, also vier Zonen je 64-m-Zelle
    const zm = CFG.biomes[biome]?.zone_m || size, parts = []
    for (let zz = z0; zz < z0 + size; zz += zm) for (let xx = x0; xx < x0 + size; xx += zm) { const gp = grovePlan(CFG, seed, xx + zm / 2, zz + zm / 2)   // V-788 Hain-Ebene: Hain (enge Baumgruppen) oder Wiese je Zone
      parts.push(placeChunk({ cfg: CFG, seed, chunk: { x0: xx, z0: zz, size: zm }, terrain: { h }, biome, ...(gp ? { masks: gp.masks, recipeList: gp.recipeList } : {}) })) }
    const r = { instances: parts.flatMap((q, qi) => q.instances.map((o) => (o.group ? { ...o, group: qi + ':' + o.group } : o))), report: { groups: parts.flatMap((q) => q.report.groups), zone: { grass: parts.map((q) => q.report.zone.grass) } } }
    out = { id, ok: true, instances: r.instances.map((o) => ({ t: o.tile, k: o.kind, r: o.role, p: o.p, ry: o.rotY || 0, rx: o.rotX || 0, rz: o.rotZ || 0, s: o.s ?? 1, sk: o.sink || 0, cr: o.r, cc: o.cr, b: o.balls, fm: o.fluff_mode, ts: o.tint_step, wg: o.wind_group, wb: o.wind_bend, wp: o.wind_phase, ac: o.accent })),
      report: { groups: r.report.groups.map((g) => ({ recipe: g.recipe, g1: g.g1 })), grass: r.report.zone.grass } }
  } catch (err) { out = { id, ok: false, error: String(err?.message || err) } }
  self.postMessage(out)
}
