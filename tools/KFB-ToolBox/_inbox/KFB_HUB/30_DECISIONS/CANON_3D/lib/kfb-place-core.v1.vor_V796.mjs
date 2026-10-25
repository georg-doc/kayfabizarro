// kfb-place-core v1 · Löser des Kern-Moduls kfb-place (V-748, Regeln V-749, SOP V-753) · WS0 25.10.2026
// Rein und deterministisch über den Seed: kein three.js, kein bpy. Liest kfb_place.r1.json (kfb.place/1), gibt ein Rezept kfb.place-recipe/1 aus.
// Blender-Adapter (WSB) und Laufzeit-Adapter (WS1b, veg=core) instanziieren nur; kfb_env.gate prüft dasselbe Rezept.
// Grenzen (V-708, V-749 Nr. 5): WFC nur lokal für die Slot-Belegung (solveLocal); nie Landmarken, Gelände oder ein globales Natur-Raster.

// ── Zufall: mulberry32 über einen Hash aus Seed + Zelle (gleicher Seed = gleiches Rezept) ──
import { makeWorldContext } from './kfb-world-context.v1.mjs'

const hash32 = (s) => { let h = 2166136261 >>> 0; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0 } return h }
export function rng(seed) {
  let a = hash32(seed)
  const next = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  return { next, range: (lo, hi) => lo + (hi - lo) * next(), int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)), pick: (arr) => arr[Math.floor(next() * arr.length)],
    weighted: (obj) => { const e = Object.entries(obj); const tot = e.reduce((s, [, w]) => s + w, 0); let r = next() * tot; for (const [k, w] of e) { if ((r -= w) <= 0) return k } return e[e.length - 1][0] } }
}

// ── Kacheln: gemessene Teile aus rules.tiles; solange WSB nicht gemessen hat, Platzhalter je Art (als solche markiert) ──
const PLACEHOLDER = { tree: { h: 4.2, r: 1.6 }, bush: { h: 1.1, r: 0.8 }, grass: { h: 0.35, r: 0.25 }, stone_L: { h: 1.0, r: 0.9 }, stone_M: { h: 0.55, r: 0.5 },
  stone_S: { h: 0.22, r: 0.2 }, path_stone: { h: 0.12, r: 0.45 }, prop: { h: 0.8, r: 0.7 }, contact: { h: 0.15, r: 0.15 } }
function tilesFor(cfg, kind, kit) {
  const FX = cfg.rules?.form_dna?.exclude || [], t = (cfg.tiles || []).filter((x) => x.kind === kind && (!kit || !x.kit || kit.startsWith(x.kit)) && !FX.some((q) => x.id.includes(q)))   // V-794: Form-DNA (keine Prismen, Würfel, Platten)
  if (t.length) return t.map((x) => ({ id: x.id, kind, h: x.h_m ?? x.h_H * cfg.units.m_per_H, r: x.gate_r_m ?? x.hull_r_m ?? x.hull_r_H * cfg.units.m_per_H, footR: x.foot_r_m, footOff: x.foot_off_m, anchors: x.anchors || [],   /* V-790: gemessene Gate-Hülle zuerst */ placeholder: false }))
  const p = PLACEHOLDER[kind] || PLACEHOLDER.prop
  return [0, 1, 2].map((i) => ({ id: `placeholder:${kind}:${i}`, kind, h: p.h * (1 - 0.12 * i), r: p.r * (1 - 0.1 * i), anchors: kind === 'tree' ? [{ p: [0, 0.8, 0], n: [0, 1, 0] }] : [], placeholder: true }))
}

// ── Gelände: h(x,z) kommt vom Höhen-Owner (Spiel bzw. Höhenfeld-Export); Hang und Gefälle numerisch ──
const grad = (terrain, x, z, e = 0.5) => [(terrain.h(x + e, z) - terrain.h(x - e, z)) / (2 * e), (terrain.h(x, z + e) - terrain.h(x, z - e)) / (2 * e)]

// ── solveLocal: lokales WFC für die Slots einer Gruppe ──
// Domänen = passende Kacheln je Slot; Constraints: Größenstaffel 1 : 0,62 : 0,38 (± size_tol), keine Klone, Wiederholung ≤ repeat_max.
// Belegt den Slot mit der kleinsten Domäne zuerst (niedrigste Entropie), bei Widerspruch Neuversuch (tries), sonst Autoren-Rückfall.
export function solveLocal(slots, R, rules, tries = 16) {
  const sizes = rules.group.sizes, tol = rules.group.size_tol
  for (let t = 0; t < tries; t++) {
    const used = {}, out = new Array(slots.length)
    const order = slots.map((s, i) => i).sort((a, b) => slots[a].domain.length - slots[b].domain.length || a - b)
    let ok = true
    for (const i of order) {
      const s = slots[i], target = sizes[Math.min(s.tier, sizes.length - 1)]
      const cand = s.domain.filter((d) => (used[d.id] || 0) < rules.group.repeat_max)
      if (!cand.length) { ok = false; break }
      const d = R.pick(cand); used[d.id] = (used[d.id] || 0) + 1
      const scale = Math.max(1 - 0.15, Math.min(1 + 0.15, target * (1 + R.range(-tol, tol)) * (s.baseH / d.h)))   // Kit-Teil nie verformen: nur ±15 % Gleichmaß
      out[i] = { tile: d, s: +scale.toFixed(3) }
    }
    if (ok) { const ht = rules.lean?.height_tol ?? 0.1, H = (f) => f.tile.h * f.s   // Ü3: benachbarte Höhen um ≥ height_tol verschieden (nur Gleichmaß ±15 %)
      const idx = out.map((f, i) => i).filter((i) => slots[i].role === 'support' || slots[i].role === 'accent').sort((a, b) => H(out[a]) - H(out[b]))
      for (let k = 1; k < idx.length; k++) { const lo = out[idx[k - 1]], hi = out[idx[k]], need = H(lo) / (1 - ht) * 1.01; if (H(hi) < need) hi.s = +Math.min(1.15, need / hi.tile.h).toFixed(3) }   /* V-763: Maß wie das Gate */
      // V-768: Radien-Leiter je Rolle (Stützen, Kiesel): Nachbarn im Nest um ≥ 22 % verschieden (Gate sameSizeAdjacent < 20 %); erst Gleichmaß (±15 %),
      // dann eine größere Kachel derselben Domäne, zuletzt die kleinere verkleinern
      for (const role of ['support', 'pebble']) { const ix = out.map((f, i) => i).filter((i) => slots[i].role === role).sort((a, b) => out[a].tile.r * out[a].s - out[b].tile.r * out[b].s)
        for (let k = 1; k < ix.length; k++) { const lo = out[ix[k - 1]], hi = out[ix[k]], need = lo.tile.r * lo.s * 1.22
          if (hi.tile.r * hi.s >= need) continue
          if (hi.tile.r * 1.15 >= need) { hi.s = +Math.max(hi.s, need / hi.tile.r).toFixed(3); continue }
          const big = slots[ix[k]].domain.filter((d) => d.r * 0.85 >= need).sort((x, y) => x.r - y.r)[0]; if (big) { hi.tile = big; hi.s = +Math.max(0.85, need / big.r).toFixed(3); continue }
          lo.s = +Math.max(0.85, (hi.tile.r * hi.s) / 1.22 / lo.tile.r).toFixed(3) } }
      // V-792 · Ü4 wie das Gate: Stämme der Gruppe in Dicken-Reihenfolge, (b − a) / b ≥ 0,22 wie das Gate (foot_r × s); erst Gleichmaß, dann eine dickere Kachel derselben Domäne
      const tr = out.map((f, i) => i).filter((i) => slots[i].kind === 'tree' && out[i].tile.footR).sort((a, b) => out[a].tile.footR * out[a].s - out[b].tile.footR * out[b].s)
      for (let k = 1; k < tr.length; k++) { const lo = out[tr[k - 1]], hi = out[tr[k]], need = lo.tile.footR * lo.s * 1.28   // Gate-Maß (b − a) / b ≥ 0,2, Rand 0,22 → b ≥ a / 0,78
        if (hi.tile.footR * hi.s >= need) continue
        if (hi.tile.footR * 1.15 >= need) { hi.s = +Math.max(hi.s, need / hi.tile.footR).toFixed(3); continue }
        const big = slots[tr[k]].domain.filter((d) => d.footR && d.footR * 0.85 >= need).sort((x, y) => x.footR - y.footR)[0]; if (big) { hi.tile = big; hi.s = +Math.max(0.85, need / big.footR).toFixed(3); continue }
        lo.s = +Math.max(0.85, (hi.tile.footR * hi.s) / 1.28 / lo.tile.footR).toFixed(3) }
      // V-793 · Ü4 und Ü3 der Bäume (und Ü3 der Büsche) gemeinsam (die Leiter allein schob Höhen gleich bzw. stieß an ±15 %): passt die Gruppe nicht, Kachel und Gleichmaß der
      // Baum-Slots neu würfeln, bis Stämme in Dicken-Reihenfolge (b − a) / b ≥ 0,22, Höhen paarweise ≥ 11 % verschieden und der Anker der höchste ist
      for (const pk of ['tree', 'bush']) {   // V-793: Bäume (mit Stamm-Leiter) und Büsche (nur Höhen) je für sich
        const ti = out.map((f, i) => i).filter((i) => slots[i].kind === pk && (pk !== 'tree' || out[i].tile.footR))
        const plantsOk = () => { const hs = ti.map((i) => out[i].tile.h * out[i].s)
          if (pk === 'tree') { const fr = ti.map((i) => out[i].tile.footR * out[i].s).sort((a, b) => a - b); for (let k = 1; k < fr.length; k++) if ((fr[k] - fr[k - 1]) / fr[k] < 0.22) return false }
          for (let a = 0; a < hs.length; a++) for (let b = a + 1; b < hs.length; b++) if (Math.min(hs[a], hs[b]) / Math.max(hs[a], hs[b]) > 0.89) return false
          const ai = ti.find((i) => slots[i].role === 'anchor'); return ai == null || ti.every((i) => i === ai || out[i].tile.h * out[i].s < out[ai].tile.h * out[ai].s) }
        if (ti.length > 1 && !plantsOk()) { const keep = ti.map((i) => out[i]); let found = false
          for (let a = 0; a < 400 && !found; a++) { for (const i of ti) { const dom = slots[i].domain.filter((d) => pk !== 'tree' || d.footR); if (dom.length) out[i] = { tile: R.pick(dom), s: +R.range(0.85, 1.15).toFixed(3) } } found = plantsOk() }
          if (!found) ti.forEach((i, k) => { out[i] = keep[k] }) } }
      return { fill: out, tries: t + 1, fallback: false } }
  }
  return { fill: slots.map((s) => ({ tile: s.domain[0], s: 1 })), tries, fallback: true }
}

// ── Nest: Stützen und Kiesel eng um den Anker (V-749 Nr. 7): Abstand je Paar entweder überlappt (≤ 0,85 × Radiensumme) oder mit Luft (≥ 1,25 ×),
// nie dazwischen; Stützen im Fächer, Kiesel hangabwärts; Nachbarabstände paarweise ≥ 30 % verschieden. Positionen relativ zum Anker.
function nestPositions(R, radii, rules, slopeDir, pOver = 0.55) {
  const mg = rules.group.band_margin ?? 0, ov = rules.group.overlap_max * (1 - mg), air = rules.group.air_min * (1 + mg), out = [[0, 0]], hosted = new Set()   // V-789: Rand gegen ±8 % Hüllen-Unterschied Löser/Gate
  const okAt = (p, i) => { let nj = -1, nd = Infinity
    for (let j = 0; j < out.length; j++) { const dd = Math.hypot(p[0] - out[j][0], p[1] - out[j][1]), s = radii[j] + radii[i]; if (dd < 0.5 * s || (dd > ov * s && dd < air * s)) return false; if (dd < nd) { nd = dd; nj = j } }
    return nj < 0 || Math.abs(radii[nj] - radii[i]) / Math.max(radii[nj], radii[i]) >= (rules.group.size_tol ?? 0.2) * (1 + 2 * mg) }   /* V-787 (WSB N40 r7 2): nächster Nachbar nie gleich groß */
  const colinear = (p) => { for (let a = 0; a < out.length; a++) for (let b = a + 1; b < out.length; b++) { const [ax, az] = out[a], [bx, bz] = out[b], acx = bx - ax, acz = bz - az, L2 = acx * acx + acz * acz; if (!L2) continue
      for (const [m, c, d] of [[p, out[a], out[b]], [out[a], p, out[b]], [out[b], p, out[a]]]) { const ux = d[0] - c[0], uz = d[1] - c[1], l2 = ux * ux + uz * uz; if (!l2) continue; const vx = m[0] - c[0], vz = m[1] - c[1], tt = (vx * ux + vz * uz) / l2
        if (tt > 0 && tt < 1 && Math.hypot(vx - ux * tt, vz - uz * tt) <= (rules.group.line_tol ?? 0.05) * Math.sqrt(l2) * 1.5) return true } } return false }
  for (let i = 1; i < radii.length; i++) {
    const pebble = radii[i] < radii[0] * 0.3
    // Kiesel (V-768): an einen größeren, noch freien Wirt gelehnt (überlappt ≤ 0,85), hangabwärts – so ist der nächste Nachbar nie ein gleich großer Kiesel
    const hosts = out.map((q, j) => j).filter((j) => radii[j] > radii[i] * 1.6), freeHosts = hosts.filter((j) => !hosted.has(j))
    let best = null
    for (let k = 0; k < 80 && !best; k++) {
      const host = pebble ? R.pick(freeHosts.length ? freeHosts : hosts.length ? hosts : [0]) : (R.next() < 0.7 ? 0 : R.int(0, out.length - 1))
      const rs = radii[host] + radii[i], f = pebble ? R.range(0.62, ov) : (R.next() < pOver ? R.range(0.62, ov) : R.range(air, air + 0.35))
      const a = pebble ? slopeDir + R.range(-1.1, 1.1) : R.range(0, Math.PI * 2), p = [out[host][0] + Math.cos(a) * f * rs, out[host][1] + Math.sin(a) * f * rs]
      if (okAt(p, i) && !colinear(p)) { best = p; if (pebble) hosted.add(host) }
    }
    // Rückfall: spiralförmig nach außen, bis Abstand und Gerade stimmen (nie zwei Glieder auf denselben Punkt)
    for (let k = 0; !best && k < 400; k++) { const a = k * 2.399 + R.next() * 0.3, dist = (radii[0] + radii[i]) * (air + 0.02 * k), p = [Math.cos(a) * dist, Math.sin(a) * dist]; if (okAt(p, i) && !colinear(p)) best = p }
    out.push(best || [(radii[0] + radii[i]) * (air + 2), i])
  }
  return out
}

// ── Gruppen-Prüfer wie das Gate (kfb_env.rule_report r3): odd, sameSizeAdjacent, neighbourSpread (ab n = 3), collinear, nearTouch ──
export function ruleReport(P, r, R) {
  const n = P.length, d = (a, b) => Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1]), nn = [], nnd = []
  for (let i = 0; i < n; i++) { let bj = -1, bd = Infinity; for (let j = 0; j < n; j++) if (j !== i && d(i, j) < bd) { bd = d(i, j); bj = j } nn.push(bj); nnd.push(bd) }
  let same = 0; const seen = new Set()
  for (let i = 0; i < n; i++) { const j = nn[i]; if (j < 0) continue; const k = Math.min(i, j) + ':' + Math.max(i, j); if (seen.has(k)) continue; seen.add(k); if (Math.abs(r[i] - r[j]) / Math.max(r[i], r[j]) < R.size_tol) same++ }
  const fin = nnd.filter(Number.isFinite), mx = fin.length ? Math.max(...fin) : 0, spread = fin.length >= 3 && mx > 0 ? (mx - Math.min(...fin)) / mx : 1
  const near = (a, b) => d(a, b) <= (R.neighbour_r ?? 4.5) * (r[a] + r[b]) / 2; let lines = 0
  for (let m = 0; m < n; m++) for (let a = 0; a < n; a++) { if (a === m || !near(a, m)) continue; for (let c = a + 1; c < n; c++) { if (c === m || !near(c, m)) continue
    const acx = P[c][0] - P[a][0], acy = P[c][1] - P[a][1], L2 = acx * acx + acy * acy; if (L2 <= 0) continue; const amx = P[m][0] - P[a][0], amy = P[m][1] - P[a][1], t = (amx * acx + amy * acy) / L2
    if (t > 0 && t < 1 && Math.hypot(amx - acx * t, amy - acy * t) <= (R.line_tol ?? 0.05) * Math.sqrt(L2)) lines++ } }
  let touch = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const q = d(i, j) / (r[i] + r[j]); if (q > R.overlap_max && q < R.air_min) touch++ }
  const failed = [['odd', n % 2 === 0], ['sameSizeAdjacent', same > 0], ['neighbourSpread', spread < (R.spread_pair_min ?? 0.3)], ['collinear', lines > 0], ['nearTouch', touch > 0]].filter((x) => x[1]).map((x) => x[0])
  return { n, same, spread: +spread.toFixed(3), lines, touch, ok: !failed.length, failed, score: same + lines + touch + (spread < (R.spread_pair_min ?? 0.3) ? 1 : 0) + (n % 2 === 0 ? 5 : 0) }
}

// ── Zone: 2–4 Gruppenkeime auf der Maske, Mindestabstand, Negativraum bleibt frei ──
function zoneSeeds(R, chunk, rules, masks) {
  const [gMin, gMax] = rules.zone.groups, n = masks.groups ?? R.int(gMin, gMax), out = [], minD = chunk.size * (masks.minD ?? 0.28), [s0, s1] = masks.span ?? [0.12, 0.88]   // V-788: Hain = enge Keime
  for (let k = 0; out.length < n && k < 200; k++) {
    const p = [chunk.x0 + R.range(s0, s1) * chunk.size, chunk.z0 + R.range(s0, s1) * chunk.size]
    if (masks?.blocked?.(p[0], p[1])) continue
    if (out.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < minD)) continue
    out.push(p)
  }
  return out
}

const sinkFor = (rules, kind, slope = 0) => { const s = rules.sink[kind] || [0, 0.05]; return Math.min(rules.sink_cap, s[0] + (s[1] - s[0]) * Math.min(1, slope * 2)) }

// Karten-Kontext (V-770): Vektor aus kfb-world-context; Story-Mode aus der stärksten Achse, falls nicht gesetzt; Fluff auf grünem Laub nie Comic/Tragic
function cardContext(C, cardTriplet, storyMode, seed) {
  const pre = makeWorldContext({ cardTriplet, seeds: [seed] }), v = pre.vector
  const MR = C.mode_rank, tri = [cardTriplet.current, cardTriplet.next || cardTriplet.current, cardTriplet.nextNext || cardTriplet.next || cardTriplet.current]
  const gp = tri.reduce((s, c, k) => s + MR.triplet_w[k] * (1 - (Math.max(1, Math.min(3, +(c?.grade) || 2)) - 1) / 2), 0)
  const share = (d) => (d === 'power' ? (v.power - MR.power.base - MR.power.grade * gp) / MR.power.coef : (v[d] - MR.lex[d][0]) / MR.lex[d][1])   // Wort-Anteil je Achse
  const ranked = Object.entries(C.mode_from_dim).map(([dim, m]) => [m, share(dim)]).sort((a, b) => b[1] - a[1])
  const mode = storyMode || ranked[0][0], wc = makeWorldContext({ cardTriplet, storyMode: mode, seeds: [seed] })
  const fluffMode = C.fluff_modes_on_green.includes(mode) ? mode : ranked.find(([m]) => C.fluff_modes_on_green.includes(m))[0]
  const gd = C.grass_density, grassDensity = Math.min(gd.clamp[1], Math.max(gd.clamp[0], gd.base + Object.entries(gd).filter(([k]) => k in v).reduce((s, [k, c]) => s + c * v[k], 0)))
  const bias = (rid) => 0.5 + Object.entries(C.recipe_bias[rid] || {}).reduce((s, [k, c]) => s + c * (v[k] ?? 0), 0)
  return { wc, mode, fluffMode, grassDensity, bias }
}

// ── Hauptfunktion: eine Zelle ──
// ── V-788 Hain-Ebene über den Zonen (Critic R1 Welt: „Konfetti statt Haine“): ein Wert-Rauschen im Maßstab rules.grove.mask_m entscheidet je Zone
// Hain (über der Schwelle: nur Baumgruppen und Busch-Nest, enge Keime, eine Lichtung dazwischen) oder Wiese (meist leer, selten ein Nest). Rein aus Seed und Ort.
export function grovePlan(cfg, seed, x, z) {
  const G = cfg.rules.grove; if (!G) return null
  const s = G.mask_m, sm = (t) => t * t * (3 - 2 * t), v = (a, b) => (hash32(`${seed}|grove|${a}|${b}`) % 10007) / 10007
  const oct = (m) => { const ix = Math.floor(x / m), iz = Math.floor(z / m), fx = sm(x / m - ix), fz = sm(z / m - iz), a = v(ix, iz), b = v(ix + 1, iz), c = v(ix, iz + 1), e = v(ix + 1, iz + 1); return a + (b - a) * fx + (c - a) * fz + (a - b - c + e) * fx * fz }
  const g = 0.7 * oct(s) + 0.3 * oct(s * 0.43), R = rng(`${seed}|zone|${Math.round(x)}|${Math.round(z)}`)
  if (g > G.threshold) return { kind: 'grove', masks: { groups: G.grove.groups, span: G.grove.span, minD: G.grove.minD }, recipeList: G.grove.recipes.map((l) => R.pick(l)) }
  if (R.next() < G.meadow.group_p) return { kind: 'meadow', masks: { groups: 1 }, recipeList: [R.pick(G.meadow.recipes)] }
  return { kind: 'meadow', masks: { groups: 0 }, recipeList: [] }
}

export function placeChunk({ cfg, seed, chunk, terrain, biome = 'moos', masks = {}, stamps = [], recipeList = null, cardTriplet = null, storyMode = null }) {   // recipeList: feste Gruppenfolge (P0), sonst nach Biom-Gewicht
  // Karten-Seed (V-770): Dreier → Vektor → Biom, Story-Mode, Dichte, Regelbruch (kfb-world-context 1:1 aus dem Card Zone Lab)
  const C = cfg.cards, card = cardTriplet && C ? cardContext(C, cardTriplet, storyMode, seed) : null
  if (card) biome = C.biome_map[card.wc.biome] || biome
  const rules = cfg.rules, B = cfg.biomes[biome], R = rng(`${seed}|${chunk.x0}|${chunk.z0}|${biome}${card ? '|' + card.wc.seed : ''}`)
  const recipes = Object.fromEntries(cfg.recipes.map((r) => [r.id, r])), inst = [], report = [], layers = new Set()
  const push = (o) => { inst.push(o); if (o.layer) layers.add(o.layer); return o }
  let fallen = false
  const put = (tile, x, z, extra) => { const [gx, gz] = grad(terrain, x, z); const slope = Math.hypot(gx, gz)
    return push({ tile: tile.id, kind: tile.kind, placeholder: tile.placeholder, p: [+x.toFixed(3), +terrain.h(x, z).toFixed(3), +z.toFixed(3)], rotY: +R.range(0, Math.PI * 2).toFixed(3), sink: +sinkFor(rules, tile.kind, slope).toFixed(3), ...extra }) }

  // Kontakt-Bögen mit Ursache an einem Objekt (V-749 Nr. 3, V-763): zwei Bögen auf 40–50 % des Umfangs, Lücke ≥ 25 %; gilt für Anker und frei stehende Objekte (auch Stamps, V-777)
  const contactArcs = (anc, objR, grp, down, cause) => { if (!anc) return 0
    // V-791 (WSB N40 r11): längliche Kacheln (kind log oder Kachel long_axis) bekommen den Kontakt als zwei kleine Häufchen L/M/S an den Stirnenden, hangab versetzt –
    // ein Bogen um die runde Hülle läge entlang der Längskante als Perlenschnur. Längsachse aus Kachel long_axis (Standard x), gedreht wie die Instanz.
    { const tt = (cfg.tiles || []).find((t) => t.id === anc.tile), hh = tt?.h_m ?? 0, ST = rules.contact.staffel ?? [1, 0.62, 0.38]
      if (anc.kind === 'log' || tt?.long_axis) {   /* V-792: flache Steine (h < r) sind kein Holz */ const ry = anc.rotY || 0, ax = tt?.long_axis === 'z' ? [Math.sin(ry), Math.cos(ry)] : [Math.cos(ry), -Math.sin(ry)],   /* Kachel-Feld long_axis 'x' | 'z' (Quaternius-Holz: z) */ hl = objR * 0.85, rL = Math.min(rules.contact.piece_max_m ?? 0.22, Math.max(0.06, (hh || 0.4) * 0.3)), dv = [Math.cos(down), Math.sin(down)]
        for (const e of [1, -1]) { const ex = anc.p[0] + ax[0] * hl * e, ez = anc.p[2] + ax[1] * hl * e
          ST.forEach((f, k) => { const a = down + (k - 1) * 0.9 + R.range(-0.2, 0.2), d = (hh || 0.4) * 0.45 + rL * f
            push({ tile: 'contact:moss_pebble', kind: 'contact', r: +(rL * f * R.range(0.9, 1.1)).toFixed(3), p: [ex + Math.cos(a) * d + dv[0] * 0.05, anc.p[1], ez + Math.sin(a) * d + dv[1] * 0.05], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: grp, role: 'contact', cause, layer: 4 }) }) }
        return 0 } }
    let cx = anc.p[0], cz = anc.p[2]
    if (anc.kind === 'tree') { const ft = (cfg.tiles || []).find((t) => t.id === anc.tile), sc = anc.s ?? 1
      if (ft?.foot_r_m) { objR = ft.foot_r_m * sc; const [ox, oz] = ft.foot_off_m || [0, 0], ry = anc.rotY || 0; cx += (ox * Math.cos(ry) + oz * Math.sin(ry)) * sc; cz += (-ox * Math.sin(ry) + oz * Math.cos(ry)) * sc }   /* V-790: gemessener Stammfuß (WSB-Tabelle), Bogen um dessen Mitte */
      else objR = Math.max(rules.contact.tree_foot_min ?? 0.22, objR * (rules.contact.tree_foot_ratio ?? 0.12)) }   /* V-784: ohne Messung Formel am Stammfuß */
    // V-787 (WSB N40 r7 B): Staffel L/M/S statt Perlen, Häufung hangab (≈ 65 %) plus kleiner Nebenbogen seitlich (≈ 35 %); je Bogen das große Stück
    // in der Mitte, zu den Enden kleiner. Abdeckung = Summe der Winkelbreiten (Gate-Maß) in rules.contact.perimeter, größte Lücke ≥ gap_min.
    const [p0, p1] = rules.contact.perimeter, cov = R.range(p0 + 0.045, p1 - 0.02), Rr = objR * 1.02, ST = rules.contact.staffel ?? [1, 0.62, 0.38]   // V-792: Rand zur Gate-Grenze
    const rL = Math.max(rules.contact.piece_min_m ?? 0.06, Math.min(rules.contact.piece_max_m ?? 0.22, Rr * (rules.contact.piece_ratio ?? 0.32))),   /* V-795: am dünnen Stamm sichtbar */ wOf = (r) => 2 * Math.asin(Math.min(0.99, r / Rr))
    const side = down + (R.next() < 0.5 ? 1 : -1) * R.range(1.9, 2.4), bows = [[0.65, down + R.range(-0.2, 0.2), []], [0.35, side, []]]
    for (const [share, , list] of bows) { const target = cov * Math.PI * 2 * share; let acc = 0
      for (let k = 0; acc < target * 0.97; k++) { const r = rL * ST[k === 0 ? 0 : k < 3 ? 1 : 2] * R.range(0.9, 1.1); if (list.length && acc + wOf(r) > target * 1.06) break; list.push(r); acc += wOf(r) } }
    const covNow = () => bows.reduce((t, b) => t + b[2].reduce((u, r) => u + wOf(r), 0), 0) / (Math.PI * 2)
    while (covNow() > p1 && bows[1][2].length > 1) bows[1][2].pop()
    while (covNow() < p0) bows[0][2].push(rL * ST[2] * R.range(0.9, 1.1))
    for (const [, centre, list] of bows) { const ws = list.map(wOf), total = ws.reduce((a, b) => a + b, 0), order = []
      list.forEach((r, k) => (k % 2 ? order.push(k) : order.unshift(k)))   // groß in der Mitte, abwechselnd links/rechts kleiner
      let ang = centre - total / 2
      for (const k of order) { const a = ang + ws[k] / 2; ang += ws[k]; const rj = Rr;   /* V-792: auf dem Messkreis, sonst deckt ein weiter außen liegendes Stück im Gate weniger Winkel */
        push({ tile: 'contact:moss_pebble', kind: 'contact', r: +list[k].toFixed(3), p: [cx + Math.cos(a) * rj, anc.p[1], cz + Math.sin(a) * rj], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: grp, role: 'contact', cause, layer: 4 }) } }
    return Math.min(1, covNow()) }

  // 1 · feste Stamps (Landmarken, Dioramen, Stumpf): nicht umordnen, nur einbetten (V-716, embed.sop)
  const stampOut = stamps.map((s, i) => {
    const rec = recipes[s.recipe] || {}, tile = tilesFor(cfg, rec.slots?.[0]?.kinds?.[0] || 'prop', B.kit?.[s.recipe])[0]
    const o = put(tile, s.x, s.z, { group: `stamp${i}`, role: rec.slots?.[0]?.role || 'landmark', layer: rec.layer, fixed: true, story: rec.story_template })
    const [sgx, sgz] = grad(terrain, s.x, s.z), sdown = Math.atan2(-sgz, -sgx)
    const sdown0 = (() => { const [gx0, gz0] = grad(terrain, s.x, s.z); return Math.atan2(-gz0, -gx0) })()   // V-786: Moos am Schnittrand hangab, der Schnitt bleibt hell
    if (rec.wear_marks) o.wear = rec.wear_marks   /* Gebrauchsspuren mit Ursache (rules.biography.wear_marks_min) */
    if (rec.cut_moss) push({ tile: 'contact:moss_cut', kind: 'contact', r: +(tile.r * 0.16).toFixed(3), p: [o.p[0] + Math.cos(sdown0) * tile.r * 0.18, +(o.p[1] + tile.h * (1 - (o.sink || 0))).toFixed(3), o.p[2] + Math.sin(sdown0) * tile.r * 0.18], rotY: R.range(0, 6.28), sink: 0, group: `stamp${i}`, role: 'wear', cause: 'Moos auf der Schnittfläche', layer: 4 })
    contactArcs(o, tile.r, `stamp${i}`, sdown, 'Erde und Moos am Fuß, hangabwärts')
    let la0 = R.range(0, Math.PI * 2), lj = 0; const logs = []   /* V-787 (WSB N40 r7 A): ein Goldwinkel-Zähler über alle Slots, Mitten ≥ Summe der Halblängen → nie ein X */
    for (const sl of (rec.slots || []).slice(1)) { const cnt = sl.count ?? 1, tl = tilesFor(cfg, sl.kinds[0], B.kit?.[s.recipe])
      for (let k = 0; k < cnt; k++) { const lr = tl[k % tl.length].r; let a = 0, d = 0
        for (let t = 0; t < 24; t++) { a = la0 + (lj++) * 2.39996; d = tile.r + lr * R.range(1.05, 1.4); const lx = s.x + Math.cos(a) * d, lz = s.z + Math.sin(a) * d; const bushA = cfg.p0 ? (cfg.light?.sun_az ?? -0.6) + (cfg.p0.triangle_turn ?? 0) : null, dA = bushA == null ? 9 : Math.abs(Math.atan2(Math.sin(a - bushA), Math.cos(a - bushA)))   /* V-795: Holz nie auf der Busch-Seite (Busch-Nest steht 1,8 m am Stumpf) */
          if (dA > 1.5 && !logs.some((q) => Math.hypot(q[0] - lx, q[1] - lz) < q[2] + lr)) break }
        logs.push([s.x + Math.cos(a) * d, s.z + Math.sin(a) * d, lr]);   /* V-778: Abstand Stumpf-Radius + halbe Holzlänge, keine Durchdringung bei jeder Drehung */ put(tl[k % tl.length], s.x + Math.cos(a) * d, s.z + Math.sin(a) * d, { group: `stamp${i}`, role: sl.role, layer: rec.layer, story: 'Holzstück desselben Stamms' }); contactArcs(inst[inst.length - 1], tl[k % tl.length].r, `stamp${i}`, sdown, 'liegt im Laub, hangabwärts angespült') } }
    if (rec.finds && cfg.finds) push({ tile: 'find:catalog', kind: 'find', p: [o.p[0] + 0.6, o.p[1] + 1.0, o.p[2]], rotY: 0, sink: 0, group: o.group, role: 'find', layer: 2, story: 'Fundstück am Stumpf (V-437)' })
    return { id: s.id || `stamp${i}`, footprint_r: tile.r * 1.4, fixed: true, embed: { only_add: true, sop: 'embed.sop' } }
  })

  // 2 · Gruppen: Rezept je Keim, Slots über solveLocal, Nest-Positionen, Einsinken nach Art und Hang
  const seeds = zoneSeeds(R, chunk, rules, recipeList ? { ...masks, groups: recipeList.length } : masks); let p0PathFrom = null, stoneStory = null
  if (recipeList && stamps[0] && cfg.p0?.bush_next_to_stamp) { const bi = recipeList.indexOf('bush_nest'), sun = cfg.light?.sun_az ?? -0.6, d = cfg.p0.bush_next_to_stamp   /* P0-Konzept: Stumpf und Busch-Nest in der Mitte, Fokus-Fluff im Busch direkt am Stumpf */
    const turn = cfg.p0.triangle_turn ?? 0, ba = sun + turn   /* V-789: Busch seitlich zur Sonne gedreht, Baumgruppe gegengedreht → Dreieck statt Diagonale (WSB r8 f1) */
    if (bi >= 0) seeds[bi] = [stamps[0].x + Math.cos(ba) * d, stamps[0].z + Math.sin(ba) * d]
    const ti = recipeList.indexOf('tree_group'), tu = cfg.p0.tree_uphill   /* P0-Konzept: Baumgruppe mit dem alten Baum hinten, hangaufwärts vom Stumpf (V-778) */
    if (ti >= 0 && tu) { const [ux, uz] = grad(terrain, stamps[0].x, stamps[0].z), ua = Math.atan2(uz, ux) - turn * 0.6, cx = Math.cos(ua), cz = Math.sin(ua); seeds[ti] = [Math.min(chunk.x0 + chunk.size - 6, Math.max(chunk.x0 + 6, stamps[0].x + cx * tu)), Math.min(chunk.z0 + chunk.size - 6, Math.max(chunk.z0 + 6, stamps[0].z + cz * tu))] }
    // V-794: Weg-Start am Hangfuß schon hier wählen (größter Abstand der Spur zu Busch- und Baum-Keim), das Steinnest liegt als Lesesteine neben der Spur
    // (vom Weg geräumt, Ursache sichtbar), auf der vom Busch abgewandten Seite
    { const zL = terrain.h(chunk.x0 + chunk.size / 2, chunk.z0 + 1) <= terrain.h(chunk.x0 + chunk.size / 2, chunk.z0 + chunk.size - 1) ? chunk.z0 + 1 : chunk.z0 + chunk.size - 1, st0 = stamps[0], keep = [bi, ti].filter((k) => k >= 0).map((k) => seeds[k])
      const segD = (fx, q) => { const ax = st0.x - fx, az = st0.z - zL, L2 = ax * ax + az * az, t = Math.max(0, Math.min(1, ((q[0] - fx) * ax + (q[1] - zL) * az) / L2)); return Math.hypot(q[0] - fx - ax * t, q[1] - zL - az * t) }
      let best = null; for (let k = 0; k < 9; k++) { const fx = chunk.x0 + (0.1 + 0.1 * k) * chunk.size, m = keep.length ? Math.min(...keep.map((q) => segD(fx, q))) : 99; if (!best || m > best[1]) best = [fx, m] }
      p0PathFrom = [best[0], zL]
      const sp = cfg.p0.stone_nest_path, si = recipeList.indexOf('stone_nest_slope')
      if (si >= 0 && sp) { const dx = st0.x - best[0], dz = st0.z - zL, L = Math.hypot(dx, dz) || 1, nx = -dz / L, nz = dx / L, bs = seeds[bi] || [st0.x, st0.z], cl = (v, a0) => Math.min(a0 + chunk.size - 6, Math.max(a0 + 6, v))
        let pick = null; for (const tt of [0.3, 0.4, 0.5, 0.6, 0.7]) for (const sg of [1, -1]) { const px = st0.x - dx * tt, pz = st0.z - dz * tt, cx = cl(px + nx * sp.side_m * sg, chunk.x0), cz = cl(pz + nz * sp.side_m * sg, chunk.z0)
          if (Math.hypot(cx - bs[0], cz - bs[1]) < 6) continue; const [gx, gz] = grad(terrain, cx, cz), sl = Math.hypot(gx, gz); if (!pick || sl > pick[2]) pick = [cx, cz, sl] }   /* V-795: Lesesteine am steilsten Spurrand (Kritiker R2 Nr. 12: Sockel am Hang) */
        seeds[si] = pick ? [pick[0], pick[1]] : seeds[si]; stoneStory = 'Lesesteine, vom Weg geräumt und am Rand gestapelt' } } }
  for (const [gi, c] of seeds.entries()) {
    let contactCov = 0
    const rid = recipeList?.[gi] ?? R.weighted(Object.fromEntries(Object.entries(B.recipes).filter(([k]) => recipes[k] && !recipes[k].fixed && k !== 'path_trace').map(([k, w]) => [k, card ? w * card.bias(k) : w])))
    const rec = recipes[rid], kit = B.kit?.[rid], slots = [], fluffOn = stamps.length > 0 || rng(`${seed}|fluff|${gi}|${chunk.x0}|${chunk.z0}`).next() < (cfg.fluff?.group_share ?? 1)   // V-791: Fluff als Akzent, nicht an jeder Gruppe (Critic R2: ≤ 1 von 3); P0 behält es
    rec.slots.forEach((sl, si) => { const cnt = Array.isArray(sl.count) ? R.pick(sl.count) : sl.count ?? 1
      for (let k = 0; k < cnt; k++) { const kind = R.pick(sl.kinds); let dom = tilesFor(cfg, kind, kit); if (sl.role === 'pebble' && dom[0]?.placeholder) dom = tilesFor(cfg, kind, 'Steinkit v4');   /* V-763: Kiesel sind Mikro-Ebene, Steinkit erlaubt */ if (sl.role === 'anchor' && kind === 'tree') { const wa = dom.filter((d) => d.anchors?.length); if (wa.length) dom = wa } if (sl.role === 'anchor' && kind === 'bush') { const wb = dom.filter((d) => d.h >= (cfg.fluff?.levels?.plant?.min_crown_h ?? 0.4)); if (wb.length) dom = wb }   /* Anker-Busch groß genug fürs Nest */   /* V-793: Anker-Baum trägt das Hero-Nest und das Fallobst, nie ein kahler Baum ohne gemessene Anker (WSB N40 r14 Frame 3) */ slots.push({ role: sl.role, kind, tier: Math.min(si, 2), domain: dom, baseH: dom[0].h, layer: sl.layer ?? rec.layer }) } })
    if (rec.odd_total && slots.length % 2 === 0) slots.pop()
    const [gx, gz] = grad(terrain, c[0], c[1]), down = Math.atan2(-gz, -gx)
    let sol = null, radii = null, pos = null, rep = null
    for (let roll = 0; roll < 8 && !rep?.ok; roll++) {   /* V-770: findet das Layout keine Lösung, neu würfeln statt den Rest-Befund durchzureichen */
      const s2 = solveLocal(slots, R, rules, cfg.wfc?.tries ?? 16), r2 = s2.fill.map((f) => f.tile.r * f.s)
      for (let tries = 0; tries < 160; tries++) { const cand = nestPositions(R, r2, rules, down, rid === 'tree_group' ? (rules.group.tree_overlap_p ?? 0.85) : 0.55), rr = ruleReport(cand, r2, rules.group)   /* V-763/V-768: Abnahme mit dem Gate-Maß */
        if (!rep || rr.score < rep.score) { sol = s2; radii = r2; pos = cand; rep = rr } if (rr.ok) break } }
    const anchorR = (sol.fill[0].tile.r * sol.fill[0].s) || 1
    const tiltShare = (rules.lean?.pebble_tilt ?? [15, 0.2])[1], tiltDeg = 18   /* V-763: > 15° auch nach rotZ */, pebIdx = slots.map((s, i) => (s.role === 'pebble' ? i : -1)).filter((i) => i >= 0), nTilt = Math.ceil(pebIdx.length * tiltShare)
    const tilted = new Set(pebIdx.slice(0, nTilt))
    slots.forEach((s, i) => { const f = sol.fill[i]; const tilt = tilted.has(i) ? { rotX: +((tiltDeg * Math.PI) / 180 * (R.next() < 0.5 ? 1 : -1)).toFixed(3), rotZ: +R.range(-0.08, 0.08).toFixed(3) } : {}
      const o = put(f.tile, c[0] + pos[i][0], c[1] + pos[i][1], { s: f.s, group: `g${gi}`, role: s.role, layer: s.layer, story: rid === 'stone_nest_slope' && stoneStory ? stoneStory : rec.story_template, ...tilt })
      // Fluff-Nester an Bäumen und Büschen (B2-R2 Variante A, V-750 Farbe aus der Harmonie)
      if (rec.fluff && fluffOn && (s.kind === 'tree' || s.kind === 'bush')) {
        let nests = s.kind === 'tree' ? 1 + R.int(0, 2) : R.int(1, 2); const sun = cfg.light?.sun_az ?? -0.6
        if (stamps.length && s.role !== 'anchor') nests = 0   // V-795 (WSB-Kritiker R2 Nr. 1–3): in P0 tragen nur die Anker Fluff, ein Fokus, ein Echo
        // V-786: Nest-Mitte auf der Trägerhaut. Bäume mit gemessenen B2-Ankern (Kachel-anchors, glTF-Lokal in m): die zur Sonne zeigenden Anker, gedreht und skaliert wie die
        // Instanz; Büsche ohne Anker: Punkt auf der Kuppel-Hülle (d = 0,7 r → y = 0,71 h). So sitzen die Kugeln 5–60 % im Träger (Gate r4 ENV-FLUFF-HALT).
        const ry = o.rotY || 0, cy = Math.cos(ry), sy = Math.sin(ry), rot = (v) => [v[0] * cy + v[2] * sy, v[1], -v[0] * sy + v[2] * cy]
        const sunV = [Math.cos(sun), Math.sin(sun)], anc = (f.tile.anchors || []).filter((q) => q.p && q.n).map((q) => { const n = rot(q.n); return { q, n, sc: n[0] * sunV[0] + n[2] * sunV[1] + 0.3 * n[1] } }).filter((q) => q.sc > 0).sort((a, b) => b.sc - a.sc)   // V-794: nur Lichtseite (Konzeptblatt §2b)
        // V-787 (WSB N40 r7 1a/1b/C): kahle Bäume ohne Anker tragen kein Nest (der Kuppelpunkt läge in der Luft); Bäume höchstens so viele Nester wie Anker;
        // Büsche erst ab fluff.levels.plant.min_crown_h; Ring höchstens 0,5 × Trägerradius (ring_r_max, Adapter nimmt min(Busch-Regel, ring_r_max))
        if (s.kind === 'tree') nests = Math.min(nests, anc.length); else if (f.tile.h * f.s < (cfg.fluff?.levels?.plant?.min_crown_h ?? 0.4)) nests = 0
        for (let n = 0; n < nests; n++) { const balls = 1 + 3 + R.int(1, 3), a = sun + R.range(-0.5, 0.5) + n * 1.1
          let np, nn = null
          if (s.kind === 'tree' && anc[n]) { const pp = rot(anc[n].q.p); np = [o.p[0] + pp[0] * f.s, o.p[1] + pp[1] * f.s, o.p[2] + pp[2] * f.s]; nn = anc[n].n.map((v) => +v.toFixed(3)) }
          else { const d = 0.7 * f.tile.r * f.s; np = [o.p[0] + Math.cos(a) * d, o.p[1] + f.tile.h * f.s * 0.71, o.p[2] + Math.sin(a) * d]; nn = [+(Math.cos(a) * 0.7).toFixed(3), 0.71, +(Math.sin(a) * 0.7).toFixed(3)] }
          push({ tile: 'fluff:nest', kind: 'fluff', p: np.map((v) => +v.toFixed(3)), n: nn, support: o.tile,
            rotY: 0, sink: 0, group: o.group, role: n === 0 ? 'fluff_hero' : 'fluff_side', balls, accent: stamps.length && rid === 'bush_nest' && s.role === 'anchor' && n === 0 ? 'focus' : 'echo', cr: +(f.tile.r * f.s).toFixed(3), ring_r_max: +((s.kind === 'tree' ? (cfg.fluff?.ring_tree ?? 0.5) : 0.5) * f.tile.r * f.s).toFixed(3), color_role: 'fluff', fluff_mode: card ? card.fluffMode : (cfg.fluff?.default_mode || 'heroic'), harvest: true, layer: 4 })
          if (n === 0 && s.role === 'anchor' && (stamps.length ? rid === 'bush_nest' : s.kind === 'tree') && !fallen) {   /* V-795: in P0 aus dem Fokus-Nest am Stumpf (Konzeptblatt life_anchor) */ fallen = true; const nest = inst[inst.length - 1]
            for (let fb = 0; fb < (cfg.fluff?.fallobst?.balls ?? 2); fb++) { let x = nest.p[0] + R.range(-0.4, 0.4), z = nest.p[2] + R.range(-0.4, 0.4)   /* rollToRest: hangabwärts bis Mulde oder Hindernis (B2-R2) */
              for (let st = 0; st < (cfg.fluff?.fallobst?.roll_steps ?? 8); st++) { const [fx, fz] = grad(terrain, x, z), sl = Math.hypot(fx, fz); if (sl < 0.015) break   /* V-794: höchstens 2,4 m, liegt am nächsten Hindernis */
                const nx = x - (fx / sl) * 0.3, nz = z - (fz / sl) * 0.3; if (nx < chunk.x0 + 1 || nz < chunk.z0 + 1 || nx > chunk.x0 + chunk.size - 1 || nz > chunk.z0 + chunk.size - 1) break; if (inst.some((q) => ['anchor', 'support', 'pebble', 'focus', 'landmark'].includes(q.role) && q.kind !== 'tree' && Math.hypot(q.p[0] - nx, q.p[2] - nz) < 0.45 + (q.r || 0.3))) break; x = nx; z = nz }
              push({ tile: 'fluff:fallen', kind: 'fluff', p: [+x.toFixed(3), +terrain.h(x, z).toFixed(3), +z.toFixed(3)], rotY: 0, sink: 0.15, group: o.group, role: 'fallobst', balls: 1, color_role: 'fluff', fluff_mode: nest.fluff_mode, harvest: true, layer: 4, story: 'Fallobst aus dem Hero-Nest, hangab gerollt' }) } } }
      }
    })
    // Kontakt-Geometrie mit Ursache am Anker (V-749 Nr. 3): Bögen auf 40–50 % des Umfangs, Lücke ≥ 25 %, Stücke so gesetzt, dass ihre Winkelbreiten
    // zusammen genau die gewählte Abdeckung ergeben (das Gate misst die Abdeckung über die Winkelbreiten); keine Zählregel, kein Kranz.
    contactCov = contactArcs(inst.find((x) => x.group === `g${gi}` && x.role === 'anchor'), anchorR, `g${gi}`, down, 'hangabwärts gespült')
    report.push({ group: `g${gi}`, recipe: rid, slots: slots.length, odd: slots.length % 2 === 1, wfc_tries: sol.tries, fallback: sol.fallback, contact_cov: +contactCov.toFixed(3), g1: rep.ok ? 'ok' : rep.failed.join(',') })
  }

  // 3 · Steinspur (path_trace, V-752/V-578): Band 1,6 m breit vom Zellrand zum ersten Stamp. Heiler Kern bis zu einer geschwungenen Isolinie, dann
  // verwittert gerundete Fragmente dicht → locker (≈ 1,0 → 0,4 u), Fugen wachsen, einzelne fehlen (Erde), keine Reihe.
  if (B.recipes.path_trace && stamps[0]) {
    const s = stamps[0], zLow = terrain.h(chunk.x0 + chunk.size / 2, chunk.z0 + 1) <= terrain.h(chunk.x0 + chunk.size / 2, chunk.z0 + chunk.size - 1) ? chunk.z0 + 1 : chunk.z0 + chunk.size - 1, from = p0PathFrom || (() => { const sol = inst.filter((q) => ['anchor', 'support'].includes(q.role)), segD = (fx, q) => { const ax = s.x - fx, az = s.z - zLow, L2 = ax * ax + az * az, t = Math.max(0, Math.min(1, ((q.p[0] - fx) * ax + (q.p[2] - zLow) * az) / L2)); return Math.hypot(q.p[0] - fx - ax * t, q.p[2] - zLow - az * t) }
      let best = null; for (let k = 0; k < 9; k++) { const fx = chunk.x0 + (0.1 + 0.1 * k) * chunk.size, m = sol.length ? Math.min(...sol.map((q) => segD(fx, q))) : 99; if (!best || m > best[1]) best = [fx, m] } return [best[0], zLow] })(),   /* Steinspur kommt vom Hangfuß (V-778) */ tile = tilesFor(cfg, 'path_stone', B.kit?.path_trace), u = cfg.units.m_per_kaykit_u
    const L = Math.hypot(s.x - from[0], s.z - from[1]), dir = [(s.x - from[0]) / L, (s.z - from[1]) / L], nrm = [-dir[1], dir[0]], iso = R.range(0.55, 0.7), bend = R.range(2.5, 4)
    let along = 0
    while (along < L - 1.2) {
      const t = along / L, wob = Math.sin(t * Math.PI * 2 + 0.4) * bend * (1 - 0.8 * t), decay = Math.max(0, ((1 - t) - iso - 0.06 * Math.sin(along * 0.9)) / (1 - iso))   /* V-794: heiler Kern am Stumpf (Ziel), zum Hangfuß locker; S-Schwung, der am Stumpf ausläuft */
      const size = (1.0 - 0.6 * decay) * u * 0.5, gap = 0.03 + 0.28 * decay, step = 2 * size + gap
      for (let w = -0.8; w <= 0.8; w += step) {
        if (decay > 0 && R.next() < decay * 0.3) continue   /* V-795: Spur liest sich als Weg, nicht als Inseln */
        const jitter = (0.15 + decay * 0.6), off = w + R.range(-jitter, jitter) * size, adv = R.range(-0.4, 0.4) * step
        const x = from[0] + dir[0] * (along + adv) + nrm[0] * (off + wob), z = from[1] + dir[1] * (along + adv) + nrm[1] * (off + wob)
        if (inst.some((q) => ['anchor', 'support', 'pebble', 'focus', 'echo', 'landmark'].includes(q.role) && Math.hypot(q.p[0] - x, q.p[2] - z) < (tilesFor(cfg, q.kind)[0]?.r || 0.5) * (q.s || 1) + size)) continue   /* V-789 */
        const tl = R.pick(tile); put(tl, x, z, { s: +((size * 2) / (tl.r * 2)).toFixed(3), group: 'path', role: 'path', layer: 2, decay: +decay.toFixed(2), story: recipes.path_trace.story_template })
      }
      along += step * R.range(0.85, 1.15)
    }
  }

  // 4 · Gras-Büschel (SPEC_ENVIRONMENT_KIT_R1 §8, V-769): nie Einzelhalme. a) Fuß-Büschel 3/5/7 an Ankern und Stützen auf einem Bogen der Licht- bzw.
  // Hangfußseite, Größen 1 : 0,62 : 0,38; b) Felder nach Rauschen und Ursache (Sonne → Gras), dichter in Senken, Wege frei, Freifläche nur kurz.
  const G = rules.grass, grass = { foot: 0, field: 0, clusters: 0 }
  if (G) {
    const gt = cfg.tiles.filter((t) => t.kind === 'grass' && /Singlesided$/i.test(t.id)).map((t) => ({ id: t.id, kind: 'grass', h: t.h_m, r: t.hull_r_m }))
    const tuftTiles = gt.length ? gt : [{ id: 'placeholder:grass', kind: 'grass', placeholder: true, ...PLACEHOLDER.grass }]
    const vn = (x, z) => { const s = G.field.noise_m, ix = Math.floor(x / s), iz = Math.floor(z / s), fx = x / s - ix, fz = z / s - iz, sm = (t) => t * t * (3 - 2 * t)
      const v = (a, b) => (hash32(`${seed}|gn|${a}|${b}`) % 1000) / 1000, a = v(ix, iz), b = v(ix + 1, iz), c = v(ix, iz + 1), e = v(ix + 1, iz + 1)
      return a + (b - a) * sm(fx) + (c - a) * sm(fz) + (a - b - c + e) * sm(fx) * sm(fz) }
    const hollow = (x, z) => (terrain.h(x + 2, z) + terrain.h(x - 2, z) + terrain.h(x, z + 2) + terrain.h(x, z - 2)) / 4 - terrain.h(x, z)
    const pathPts = inst.filter((x) => x.role === 'path').map((x) => x.p), solid = inst.filter((x) => ['anchor', 'support', 'landmark', 'focus'].includes(x.role))
    const nearPath = (x, z) => pathPts.some((p) => (p[0] - x) ** 2 + (p[2] - z) ** 2 < G.field.path_clear_m ** 2)
    const inSolid = (x, z) => solid.some((o) => (o.p[0] - x) ** 2 + (o.p[2] - z) ** 2 < (0.6 * (o.s || 1) + 0.3) ** 2)
    const TBF = new Map(cfg.tiles.map((t) => [t.id, t])), footR = (o) => ((TBF.get(o.tile)?.gate_r_m ?? TBF.get(o.tile)?.hull_r_m) || tilesFor(cfg, o.kind)[0]?.r || 0.6) * (o.s || 1) * 1.3 + 0.2 * (cfg.units?.m_per_H || 2.24)   // V-792: Ü5-Kreis der echten Kachel   // Ü5-Messkreis des Gates
    const inFoot = (x, z) => solid.some((o) => /stone|rock|tree/.test(o.kind) && (o.p[0] - x) ** 2 + (o.p[2] - z) ** 2 < footR(o) ** 2)   // V-786: Feldgras lässt den Fuß von Steinen und Bäumen frei, dort nur Fuß-Büschel (≤ 50 % Umfang)
    // Bauweise-Tafel Regel 3 (Lab biome-sheets/Bauweise_Erdung.jpg): Büschel lehnen vom Objekt weg und hangabwärts, lang in der Kehle bzw. Senke, kurz auf der Kuppe
    const crowns = inst.filter((o) => o.kind === 'tree').map((o) => [o.p[0], o.p[2], (o.s || 1) * (tilesFor(cfg, 'tree')[0]?.r || 1.6)])
    const tuft = (x, z, sc, grp, src, step, from = null) => { if (masks?.blocked?.(x, z)) return
      const [gx, gz] = grad(terrain, x, z), hv = hollow(x, z), len = Math.max(0.7, Math.min(1.3, 1 + hv * 3))
      let lx = -gx * 4, lz = -gz * 4; if (from) { const dx = x - from[0], dz = z - from[1], l = Math.hypot(dx, dz) || 1; lx += dx / l; lz += dz / l }
      const ll = Math.hypot(lx, lz), lean = ll > 0.05 ? Math.min(G.lean_max_deg ?? 14, 6 + ll * 6) : 0, la = Math.atan2(lz, lx)
      put(R.pick(tuftTiles), x, z, { s: +(sc * len).toFixed(3), group: grp, role: 'grass', layer: 4, src, tint_step: Math.max(0, Math.min(G.color.steps - 1, step + R.int(-1, 1))), color_role: G.color.role,
        ...(lean ? { rotX: +((Math.sin(la) * lean * Math.PI) / 180).toFixed(3), rotZ: +((-Math.cos(la) * lean * Math.PI) / 180).toFixed(3) } : {}) }); grass[src]++ }
    // a) Fuß-Büschel
    for (const o of solid) { const n = typeof G.foot.count === 'object' && !Array.isArray(G.foot.count) ? (G.foot.count[o.role] ?? 3) : R.pick(G.foot.count),   /* V-770: 5 am Anker, 3 an der Stütze */ ro = (o.s || 1) * (tilesFor(cfg, o.kind)[0]?.r || 0.6), [gx, gz] = grad(terrain, o.p[0], o.p[2])
      const downA = Math.hypot(gx, gz) > 0.02 ? Math.atan2(-gz, -gx) : (cfg.light?.sun_az ?? -0.6), sun = cfg.light?.sun_az ?? -0.6
      /* Bauweise: Fels → Grasnest in der Kehle bergauf; Strauch → Sonnenseite unter der Kante; Baum → an der Tropfkante; sonst hangabwärts */
      const isStone = /stone|rock|boulder/.test(o.kind), side = isStone ? downA + Math.PI : o.kind === 'bush' ? sun : downA, arc = Math.PI * (isStone ? R.range(0.2, 0.32) : R.range(0.4, 0.6))   /* Ü5: ≤ 50 % des Fußes inkl. Büschelbreite */, step = R.int(0, G.color.steps - 1)
      const ring = o.kind === 'tree' ? [1.6, 2.2] : G.foot.ring_r
      for (let k = 0; k < n; k++) { const a = side - arc / 2 + arc * ((k + R.range(0.2, 0.8)) / n), d = ro * R.range(...ring), tx = o.p[0] + Math.cos(a) * d, tz = o.p[2] + Math.sin(a) * d
        if (solid.some((q) => q !== o && /stone|rock|tree/.test(q.kind) && (q.p[0] - tx) ** 2 + (q.p[2] - tz) ** 2 < footR(q) ** 2)) continue   /* V-789 (WSB r8 Ü5 94 %): Stützen-Büschel nicht in den Fuß des Ankers */
        tuft(o.p[0] + Math.cos(a) * d, o.p[2] + Math.sin(a) * d, G.foot.ratio[Math.min(2, k === 0 ? 0 : k < 4 ? 1 : 2)] * R.range(0.9, 1.1), o.group, 'foot', step, [o.p[0], o.p[2]]) } }
    // b) Felder als Flecken (V-770): Fleck-Keime im 8-m-Raster nach Rauschen und Senke; je Fleck 3 oder 5 Büschel-Gruppen auf einer Vogel-Spirale
    //    (5+5+3 = 13 bzw. 5+5+5+3+3 = 21, Fibonacci), je Gruppe 5 Kern- bzw. 3 Rand-Büschel wieder als Vogel-Spirale; Randgruppen lockerer und kürzer (Sprenkel).
    const F = G.field, gs = F.field_grid_m, negC = [chunk.x0 + chunk.size / 2, chunk.z0 + chunk.size / 2], dens = card ? card.grassDensity : 1, GA = 2.39996
    grass.patches = []; grass.fields = 0
    for (let gx0 = chunk.x0 + gs / 2; gx0 < chunk.x0 + chunk.size; gx0 += gs) for (let gz0 = chunk.z0 + gs / 2; gz0 < chunk.z0 + chunk.size; gz0 += gs) {
      // Feld-Ebene: je 16-m-Feld ein Keim; über der Schwelle 3 oder 5 Flecken auf einer Vogel-Spirale um den Keim
      const fx = gx0 + R.range(-0.3, 0.3) * gs, fz = gz0 + R.range(-0.3, 0.3) * gs, fscore = vn(fx, fz) + Math.max(0, Math.min(F.hollow_bonus, hollow(fx, fz) * 2))
      if (fscore < F.thresh || R.next() > Math.min(1, dens * (fscore - F.thresh) / (F.edge_soft || 0.1))) continue
      const np = R.pick(F.field_patches), frot = R.range(0, Math.PI * 2); grass.fields++
      for (let pi = 0; pi < np; pi++) {
      const pd = F.patch_spacing_m * Math.sqrt(pi + (pi ? 0.5 : 0)) * R.range(0.85, 1.15), x = fx + Math.cos(frot + pi * GA) * pd, z = fz + Math.sin(frot + pi * GA) * pd
      const underCrown = crowns.some((c) => (c[0] - x) ** 2 + (c[1] - z) ** 2 < (c[2] * 1.3) ** 2); if (underCrown && R.next() < 0.75) continue
      if (nearPath(x, z) || inSolid(x, z) || x < chunk.x0 || z < chunk.z0 || x > chunk.x0 + chunk.size || z > chunk.z0 + chunk.size) continue
      const nc = R.pick(F.patch_clusters), nCore = Math.ceil(nc / 2), short = Math.hypot(x - negC[0], z - negC[1]) < chunk.size * 0.18 ? F.neg_space_short : 1
      const grp = `gp${grass.patches.length}`, rot = R.range(0, Math.PI * 2), plan = []; let placed = 0
      for (let c = 0; c < nc; c++) { const edge = c >= nCore, nt = edge ? F.cluster_tufts.edge : F.cluster_tufts.core, step = R.int(0, G.color.steps - 1); plan.push(nt)
        const ca = rot + c * GA, cd = F.cluster_spacing_m * Math.sqrt(c + (c ? 0.5 : 0)) * R.range(0.9, 1.1), cx = x + Math.cos(ca) * cd, cz = z + Math.sin(ca) * cd
        for (let k = 0; k < nt; k++) { const ta = R.range(0, 6.28) + k * GA, td = F.tuft_spacing_m * Math.sqrt(k) * (edge ? F.edge_spread : 1), tx = cx + Math.cos(ta) * td, tz = cz + Math.sin(ta) * td
          if (nearPath(tx, tz) || inSolid(tx, tz) || inFoot(tx, tz)) continue
          const before = grass.field; tuft(tx, tz, G.foot.ratio[k === 0 ? 0 : k < 4 ? 1 : 2] * short * (edge ? F.edge_short : 1) * R.range(0.9, 1.1), grp, 'field', step); placed += grass.field - before } }
      grass.clusters += nc; grass.patches.push({ id: grp, clusters: nc, planned: plan.reduce((a, b) => a + b, 0), placed }) } }
    // c) Die eine Bedeutung je Zelle (V-770, Etherington 70/20/10): höchstens ein bewusster Regelbruch, Wahrscheinlichkeit = surrealism des Karten-Dreiers
    if (card && rules.oddity && R.next() < card.wc.params.surrealism) {
      const cen = solid.length ? solid.reduce((m, o) => [m[0] + o.p[0] / solid.length, m[1] + o.p[2] / solid.length], [0, 0]) : negC, away = Math.atan2(negC[1] - cen[1], negC[0] - cen[0]) + R.range(-0.6, 0.6)
      let ox = 0, oz = 0, ok = false
      for (let t = 0; t < 24 && !ok; t++) { const d = chunk.size * R.range(0.2, 0.3), a2 = away + t * GA; ox = negC[0] + Math.cos(a2) * d; oz = negC[1] + Math.sin(a2) * d
        ok = !pathPts.some((p) => (p[0] - ox) ** 2 + (p[2] - oz) ** 2 < (rules.oddity.path_clear_m ?? 3) ** 2) && !solid.some((o) => (o.p[0] - ox) ** 2 + (o.p[2] - oz) ** 2 < 9) && !masks?.blocked?.(ox, oz) }
      if (ok) { const kind = R.pick(Object.keys(rules.oddity.kinds)), story = rules.oddity.kinds[kind], st = tilesFor(cfg, 'stone_M', 'Steinkit v4'), od = { group: 'oddity', layer: 3, oddity: kind, story }
        if (kind === 'stone_on_tip') { put(R.pick(st), ox, oz, { ...od, role: 'oddity', s: 1, rotX: 1.1, rotZ: +R.range(-0.2, 0.2).toFixed(3), sink: 0.05 })
          for (let k = 0; k < 3; k++) { const a3 = k * GA; put(R.pick(tilesFor(cfg, 'stone_S', 'Steinkit v4')), ox + Math.cos(a3) * 0.7, oz + Math.sin(a3) * 0.7, { ...od, role: 'pebble' }) } }
        else if (kind === 'cairn') { let top = 0; [1, 0.62, 0.38].forEach((sc, k) => { const t0 = R.pick(st), h = (t0.h || 0.5) * sc, o2 = put(t0, ox, oz, { ...od, role: 'oddity', s: sc, sink: k ? 0 : 0.15 })   /* Fuß 15 % im Boden, jeder Stein sitzt 10 % in der Mulde des unteren: nichts schwebt */
          const y = k ? top - 0.1 * h : -0.15 * h; o2.p[1] = +(o2.p[1] + y + (k ? 0 : 0.15 * h)).toFixed(3); top = (k ? top - 0.1 * h : 0) + h * (k ? 1 : 0.85) }) }
        else { for (let k = 0; k < 13; k++) { const a3 = (k / 13) * Math.PI * 2; tuft(ox + Math.cos(a3) * 1.6, oz + Math.sin(a3) * 1.6, G.foot.ratio[1], 'oddity', 'foot', 1) }
          inst.filter((o) => o.group === 'oddity').forEach((o) => Object.assign(o, od, { role: 'oddity' })) }
        grass.oddity = kind }
    }
    // Wind-Gruppen (§6): eine Gruppe teilt Grundphase; Gruppen-ID nach Position des Gruppen-Mittels im 8-m-Raster (≤ 64 je Zelle), Biegung je Art
    const W = G.wind, cen = {}
    for (const o of inst) { const c = (cen[o.group] ||= [0, 0, 0]); c[0] += o.p[0]; c[1] += o.p[2]; c[2]++ }
    const nW = Math.max(1, Math.round(chunk.size / W.grid_m))
    for (const o of inst) { const c = cen[o.group], wx = Math.min(nW - 1, Math.max(0, Math.floor((c[0] / c[2] - chunk.x0) / W.grid_m))), wz = Math.min(nW - 1, Math.max(0, Math.floor((c[1] / c[2] - chunk.z0) / W.grid_m)))
      o.wind_group = Math.min(W.max_groups - 1, wz * nW + wx); o.wind_bend = W.bend[o.kind] ?? 0; o.wind_phase = +((hash32(`${seed}|wp|${o.group}`) % 628) / 100 + R.range(-W.phase_jitter, W.phase_jitter)).toFixed(3) }
  }

  // 5 · Regel-Bericht für das Gate (Zone und Biografie)
  const occ = inst.filter((x) => x.role === 'anchor' || x.role === 'support').reduce((s, x) => s + Math.PI * 2.2 ** 2, 0)
  const zoneReport = { groups: report.length, neg_space_est: +(1 - Math.min(1, occ / chunk.size ** 2)).toFixed(3), layers: [...layers].sort(), layers_ok: (rules.biography?.layers_required || []).every((l) => layers.has(l)),
    placeholders: inst.some((x) => x.placeholder), grass: { ...grass, fib_ok: (grass.patches || []).every((p) => [13, 21].includes(p.planned)), on_path: inst.filter((g) => g.src === 'field' && inst.some((p) => p.role === 'path' && (p.p[0] - g.p[0]) ** 2 + (p.p[2] - g.p[2]) ** 2 < (rules.grass?.field.path_clear_m ?? 1) ** 2)).length, wind_groups: new Set(inst.map((x) => x.wind_group)).size } }
  // V-787/V-791 · Nachlauf je Gruppe im Gate-Maß: Ü3 benachbarte gleichartige Höhen ≥ height_tol (Ü4 steht in solveLocal, hier nur als Wache)
  // verschieden. Jede Änderung gilt nur, wenn G1 (Überlappung/Luft mit band_margin, gate_r_m × s) zu allen Gruppen-Gliedern hält, sonst die andere Richtung,
  // sonst bleibt es (WSB N40 r11: Gras-Kürzung schob ein Paar ins nearTouch-Band). Gras frei, Kit-Teile gleichmäßig ±15 % vom Ausgangsmaß (V-574).
  { const TB = new Map(cfg.tiles.map((t) => [t.id, t])), ht = rules.lean?.height_tol ?? 0.1, nr = rules.group.neighbour_r ?? 4.5, mg = rules.group.band_margin ?? 0
    const ov = rules.group.overlap_max * (1 - mg), air = rules.group.air_min * (1 + mg), S0 = new Map(inst.map((o) => [o, o.s ?? 1]))
    const hOf = (o) => (TB.get(o.tile)?.h_m ?? TB.get(o.tile)?.h ?? 0) * (o.s ?? 1), rOf = (o) => { const t = TB.get(o.tile); return ((t?.gate_r_m ?? t?.hull_r_m) || 0) * (o.s ?? 1) }, fOf = (o) => (TB.get(o.tile)?.foot_r_m ?? 0) * (o.s ?? 1)
    const G1R = ['anchor', 'support', 'accent', 'pebble'], members = new Map()
    for (const o of inst) if (o.group && G1R.includes(o.role) && TB.get(o.tile)) { if (!members.has(o.group)) members.set(o.group, []); members.get(o.group).push(o) }
    const okG1 = (o) => !G1R.includes(o.role) || (members.get(o.group) || []).every((q) => { if (q === o) return true; const v = Math.hypot(o.p[0] - q.p[0], o.p[2] - q.p[2]) / (rOf(o) + rOf(q) || 1); return !(v > ov && v < air) })
    const lim = (o, sc) => (o.kind === 'grass' ? sc : Math.min(S0.get(o) * 1.15, Math.max(S0.get(o) * 0.85, sc)))
    const u4Bad = (g) => { const t = inst.filter((q) => q.group === g && q.kind === 'tree' && fOf(q)).map(fOf).sort((a, b) => a - b); let n = 0; for (let k = 1; k < t.length; k++) if ((t[k] - t[k - 1]) / t[k] < 0.2) n++; return n }   // Ü4 wie das Gate: Dicken-Reihenfolge
    const trySet = (o, sc) => { const old = o.s, u0 = o.kind === 'tree' ? u4Bad(o.group) : 0; o.s = +lim(o, sc).toFixed(3); if (okG1(o) && (o.kind !== 'tree' || u4Bad(o.group) <= u0)) return true; o.s = old; return false }
    const tryAny = (lo, hi, h0, h1) => [0.97, 0.88, 0.76, 0.64].some((f) => trySet(lo, (lo.s ?? 1) * h1 * (1 - ht) * f / h0)) || [1.03, 1.12, 1.25].some((f) => trySet(hi, (hi.s ?? 1) * h0 / (1 - ht) * f / h1))   // V-792: mehrere Stufen, bevor die G1-Wache aufgibt
    const near = (A, Bq) => Math.hypot(A.p[0] - Bq.p[0], A.p[2] - Bq.p[2]) <= nr * ((rOf(A) + rOf(Bq)) / 2 || 1)
    const cls = (o) => (o.kind === 'grass' ? 'grass' : /stone|rock/.test(o.kind) ? 'stone' : o.kind === 'tree' || o.kind === 'bush' ? 'plant' : null)
    const byG = new Map(); for (const o of inst) { if (!o.group || !cls(o) || !hOf(o)) continue; const k = o.group + '|' + cls(o); if (!byG.has(k)) byG.set(k, []); byG.get(k).push(o) }
    for (const list of byG.values()) for (let pass = 0; pass < 4; pass++) { let fixed = 0
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) { const A = list[i], Bq = list[j]; if (A.kind === 'grass' && Bq.kind === 'grass' && !G1R.includes(A.role) && !near(A, Bq)) continue   // V-792: Slot-Glieder paarweise in der ganzen Gruppe, Feld-/Fuß-Gras nur Nachbarn
        const lo = hOf(A) <= hOf(Bq) ? A : Bq, hi = lo === A ? Bq : A   // Ü3 Höhen
        if (hOf(lo) >= hOf(hi) * (1 - ht)) { fixed++; tryAny(lo, hi, hOf(lo), hOf(hi)) } }
      if (!fixed) break } }
  // V-795 · Kontaktstücke und Kiesel nie unter einem Holzstück (Kritiker R2 Nr. 13: Holz lag auf der Kieselreihe)
  { const TL = new Map(cfg.tiles.map((t) => [t.id, t])), logs = inst.filter((o) => o.kind === 'log' || TL.get(o.tile)?.long_axis)
    if (logs.length) { const under = (q) => logs.some((L) => { const t = TL.get(L.tile), hl = ((t?.gate_r_m ?? t?.hull_r_m) || 1.3) * (L.s ?? 1), w = ((t?.h_m) || 0.5) * 0.6 * (L.s ?? 1), ry = L.rotY || 0, ax = t?.long_axis === 'z' ? [Math.sin(ry), Math.cos(ry)] : [Math.cos(ry), -Math.sin(ry)]
        const vx = q.p[0] - L.p[0], vz = q.p[2] - L.p[2], al = vx * ax[0] + vz * ax[1], pr = Math.abs(vx * -ax[1] + vz * ax[0]); return Math.abs(al) < hl && pr < w + (q.r || 0) })
      for (let k = inst.length - 1; k >= 0; k--) { const q = inst[k]; if ((q.role === 'contact' && !logs.includes(q)) || q.role === 'path') { if (under(q)) inst.splice(k, 1) } } } }
  // V-794 · Moos in den Fugen (material_codes): wo zwei Steine bzw. Stein/Holz einer Gruppe überlappen, ein Moos-Lappen in der Fuge, hangab versetzt
  { const TJ = new Map(cfg.tiles.map((t) => [t.id, t])), rJ = (o) => (((TJ.get(o.tile)?.gate_r_m ?? TJ.get(o.tile)?.hull_r_m) || 0) * (o.s ?? 1)), hard = inst.filter((o) => o.group && /stone|log|stump/.test(o.kind) && ['anchor', 'support', 'pebble', 'focus', 'echo'].includes(o.role) && rJ(o))
    for (let i = 0; i < hard.length; i++) for (let j = i + 1; j < hard.length; j++) { const A = hard[i], Bq = hard[j]; if (A.group !== Bq.group) continue; const d = Math.hypot(A.p[0] - Bq.p[0], A.p[2] - Bq.p[2]), ra = rJ(A), rb = rJ(Bq)
      if (d > (ra + rb) * (rules.group.overlap_max ?? 0.85) || d < 1e-3) continue; const f = ra / (ra + rb), mx = A.p[0] + (Bq.p[0] - A.p[0]) * f, mz = A.p[2] + (Bq.p[2] - A.p[2]) * f, [gx, gz] = grad(terrain, mx, mz), gl = Math.hypot(gx, gz) || 1
      push({ tile: 'moss:joint', kind: 'moss', r: +(Math.min(ra, rb) * 0.35).toFixed(3), p: [+(mx - gx / gl * 0.05).toFixed(3), +terrain.h(mx, mz).toFixed(3), +(mz - gz / gl * 0.05).toFixed(3)], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: A.group, role: 'joint', cause: 'Moos in der Fuge', layer: 4 }) } }   // Moos-Fuge: Materialcode Moos, zählt nicht zum Kontaktfenster
  return { schema: 'kfb.place-recipe/1', seed, biome, chunk, instances: inst, stamps: stampOut, deltas: stampOut.map((s) => ({ stamp: s.id, schema: 'kfb.terrain-delta/1', only_add: true })), report: { groups: report, zone: zoneReport, ...(card ? { card: { biome_card: card.wc.biome, biome, story_mode: card.mode, fluff_mode: card.fluffMode, surrealism: +card.wc.params.surrealism.toFixed(3), grass_density: +card.grassDensity.toFixed(3) } } : {}) } }
}

// Rezept-Hash für den Golden-Test (gleicher Seed = gleicher Hash)
export const recipeHash = (recipe) => hash32(JSON.stringify(recipe.instances)).toString(16)
