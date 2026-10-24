// kfb-place-core v1 · Löser des Kern-Moduls kfb-place (V-748, Regeln V-749, SOP V-753) · WS0 25.10.2026
// Rein und deterministisch über den Seed: kein three.js, kein bpy. Liest kfb_place.r1.json (kfb.place/1), gibt ein Rezept kfb.place-recipe/1 aus.
// Blender-Adapter (WSB) und Laufzeit-Adapter (WS1b, veg=core) instanziieren nur; kfb_env.gate prüft dasselbe Rezept.
// Grenzen (V-708, V-749 Nr. 5): WFC nur lokal für die Slot-Belegung (solveLocal); nie Landmarken, Gelände oder ein globales Natur-Raster.

// ── Zufall: mulberry32 über einen Hash aus Seed + Zelle (gleicher Seed = gleiches Rezept) ──
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
  const t = (cfg.tiles || []).filter((x) => x.kind === kind && (!kit || !x.kit || kit.startsWith(x.kit)))
  if (t.length) return t.map((x) => ({ id: x.id, kind, h: x.h_m ?? x.h_H * cfg.units.m_per_H, r: x.hull_r_m ?? x.hull_r_H * cfg.units.m_per_H, anchors: x.anchors || [], placeholder: false }))
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
    if (ok) return { fill: out, tries: t + 1, fallback: false }
  }
  return { fill: slots.map((s) => ({ tile: s.domain[0], s: 1 })), tries, fallback: true }
}

// ── Nest: Stützen und Kiesel eng um den Anker (V-749 Nr. 7): Abstand je Paar entweder überlappt (≤ 0,85 × Radiensumme) oder mit Luft (≥ 1,25 ×),
// nie dazwischen; Stützen im Fächer, Kiesel hangabwärts; Nachbarabstände paarweise ≥ 30 % verschieden. Positionen relativ zum Anker.
function nestPositions(R, radii, rules, slopeDir) {
  const { overlap_max: ov, air_min: air } = rules.group, out = [[0, 0]]
  for (let i = 1; i < radii.length; i++) {
    let best = null, bestScore = -1
    for (let k = 0; k < 40; k++) {
      const host = R.next() < 0.7 ? 0 : R.int(0, out.length - 1), rs = radii[host] + radii[i]
      const f = R.next() < 0.55 ? R.range(0.62, ov) : R.range(air, air + 0.35)
      const fan = radii[i] < radii[0] * 0.3 ? slopeDir + R.range(-0.9, 0.9) : R.range(0, Math.PI * 2)   // Kiesel hangabwärts
      const p = [out[host][0] + Math.cos(fan) * f * rs, out[host][1] + Math.sin(fan) * f * rs]
      let ok = true
      for (let j = 0; j < out.length; j++) { const dd = Math.hypot(p[0] - out[j][0], p[1] - out[j][1]), s = radii[j] + radii[i]; if (dd > ov * s && dd < air * s) { ok = false; break } if (dd < 0.5 * s) { ok = false; break } }
      const dists = out.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])).sort((a, b) => a - b), score = dists.length > 1 ? (dists[1] - dists[0]) / dists[1] : 1
      if (ok && score >= rules.group.spread_pair_min) { best = p; break }
      if (ok && score > bestScore) { best = p; bestScore = score }
    }
    out.push(best || [radii[0] * 1.5, 0])
  }
  return out
}

// ── Zone: 2–4 Gruppenkeime auf der Maske, Mindestabstand, Negativraum bleibt frei ──
function zoneSeeds(R, chunk, rules, masks) {
  const [gMin, gMax] = rules.zone.groups, n = R.int(gMin, gMax), out = [], minD = chunk.size * 0.28
  for (let k = 0; out.length < n && k < 200; k++) {
    const p = [chunk.x0 + R.range(0.12, 0.88) * chunk.size, chunk.z0 + R.range(0.12, 0.88) * chunk.size]
    if (masks?.blocked?.(p[0], p[1])) continue
    if (out.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < minD)) continue
    out.push(p)
  }
  return out
}

const sinkFor = (rules, kind, slope = 0) => { const s = rules.sink[kind] || [0, 0.05]; return Math.min(rules.sink_cap, s[0] + (s[1] - s[0]) * Math.min(1, slope * 2)) }

// ── Hauptfunktion: eine Zelle ──
export function placeChunk({ cfg, seed, chunk, terrain, biome = 'moos', masks = {}, stamps = [] }) {
  const rules = cfg.rules, B = cfg.biomes[biome], R = rng(`${seed}|${chunk.x0}|${chunk.z0}|${biome}`)
  const recipes = Object.fromEntries(cfg.recipes.map((r) => [r.id, r])), inst = [], report = [], layers = new Set()
  const push = (o) => { inst.push(o); if (o.layer) layers.add(o.layer); return o }
  const put = (tile, x, z, extra) => { const [gx, gz] = grad(terrain, x, z); const slope = Math.hypot(gx, gz)
    return push({ tile: tile.id, kind: tile.kind, placeholder: tile.placeholder, p: [+x.toFixed(3), +terrain.h(x, z).toFixed(3), +z.toFixed(3)], rotY: +R.range(0, Math.PI * 2).toFixed(3), sink: +sinkFor(rules, tile.kind, slope).toFixed(3), ...extra }) }

  // 1 · feste Stamps (Landmarken, Dioramen, Stumpf): nicht umordnen, nur einbetten (V-716, embed.sop)
  const stampOut = stamps.map((s, i) => {
    const rec = recipes[s.recipe] || {}, tile = tilesFor(cfg, rec.slots?.[0]?.kinds?.[0] || 'prop', B.kit?.[s.recipe])[0]
    const o = put(tile, s.x, s.z, { group: `stamp${i}`, role: 'landmark', layer: rec.layer, fixed: true, story: rec.story_template })
    if (rec.finds && cfg.finds) push({ tile: 'find:catalog', kind: 'find', p: [o.p[0] + 0.6, o.p[1] + 1.0, o.p[2]], rotY: 0, sink: 0, group: o.group, role: 'find', layer: 2, story: 'Fundstück am Stumpf (V-437)' })
    return { id: s.id || `stamp${i}`, footprint_r: tile.r * 1.4, fixed: true, embed: { only_add: true, sop: 'embed.sop' } }
  })

  // 2 · Gruppen: Rezept je Keim, Slots über solveLocal, Nest-Positionen, Einsinken nach Art und Hang
  for (const [gi, c] of zoneSeeds(R, chunk, rules, masks).entries()) {
    const rid = R.weighted(Object.fromEntries(Object.entries(B.recipes).filter(([k]) => recipes[k] && !recipes[k].fixed && k !== 'path_trace')))
    const rec = recipes[rid], kit = B.kit?.[rid], slots = []
    rec.slots.forEach((sl, si) => { const cnt = Array.isArray(sl.count) ? R.pick(sl.count) : sl.count ?? 1
      for (let k = 0; k < cnt; k++) { const kind = R.pick(sl.kinds); const dom = tilesFor(cfg, kind, kit); slots.push({ role: sl.role, kind, tier: Math.min(si, 2), domain: dom, baseH: dom[0].h, layer: sl.layer ?? rec.layer }) } })
    if (rec.odd_total && slots.length % 2 === 0) slots.pop()
    const sol = solveLocal(slots, R, rules, cfg.wfc?.tries ?? 16)
    const [gx, gz] = grad(terrain, c[0], c[1]), down = Math.atan2(-gz, -gx)
    const anchorR = (sol.fill[0].tile.r * sol.fill[0].s) || 1
    const pos = nestPositions(R, sol.fill.map((f) => f.tile.r * f.s), rules, down)
    slots.forEach((s, i) => { const f = sol.fill[i]; const o = put(f.tile, c[0] + pos[i][0], c[1] + pos[i][1], { s: f.s, group: `g${gi}`, role: s.role, layer: s.layer, story: rec.story_template })
      // Fluff-Nester an Bäumen und Büschen (B2-R2 Variante A, V-750 Farbe aus der Harmonie)
      if (rec.fluff && (s.kind === 'tree' || s.kind === 'bush')) {
        const nests = s.kind === 'tree' ? 1 + R.int(0, 2) : R.int(1, 2), sun = cfg.light?.sun_az ?? -0.6
        for (let n = 0; n < nests; n++) { const balls = 1 + 3 + R.int(1, 3), a = sun + R.range(-0.5, 0.5) + n * 1.1
          push({ tile: 'fluff:nest', kind: 'fluff', p: [o.p[0] + Math.cos(a) * f.tile.r * f.s * 0.8, o.p[1] + f.tile.h * f.s * (s.kind === 'tree' ? R.range(0.55, 0.8) : 0.5), o.p[2] + Math.sin(a) * f.tile.r * f.s * 0.8],
            rotY: 0, sink: 0, group: o.group, role: n === 0 ? 'fluff_hero' : 'fluff_side', balls, color_role: 'fluff', harvest: true, layer: 4 }) }
      }
    })
    // Kontakt-Geometrie mit Ursache am Anker: 40–50 % des Umfangs, Lücke ≥ 25 %, keine Zählregel (V-749 Nr. 3)
    const [p0, p1] = rules.contact.perimeter, cov = R.range(p0, p1), arcs = R.int(2, 3), anc = inst.find((x) => x.group === `g${gi}` && x.role === 'anchor')
    for (let a = 0; a < arcs; a++) { const start = down + a * (Math.PI * 2 / arcs), len = (cov * Math.PI * 2) / arcs
      for (let t = 0; t < 3; t++) { const ang = start + len * (t / 2); const rr = anchorR * R.range(0.9, 1.15)
        push({ tile: 'contact:moss_pebble', kind: 'contact', p: [anc.p[0] + Math.cos(ang) * rr, anc.p[1], anc.p[2] + Math.sin(ang) * rr], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: `g${gi}`, role: 'contact', cause: 'hangabwärts gespült', layer: 4 }) } }
    report.push({ group: `g${gi}`, recipe: rid, slots: slots.length, odd: slots.length % 2 === 1, wfc_tries: sol.tries, fallback: sol.fallback })
  }

  // 3 · Steinspur (path_trace, V-752/V-578): Band 1,6 m breit vom Zellrand zum ersten Stamp. Heiler Kern bis zu einer geschwungenen Isolinie, dann
  // verwittert gerundete Fragmente dicht → locker (≈ 1,0 → 0,4 u), Fugen wachsen, einzelne fehlen (Erde), keine Reihe.
  if (B.recipes.path_trace && stamps[0]) {
    const s = stamps[0], from = [chunk.x0 + R.range(0.15, 0.35) * chunk.size, chunk.z0 + 1], tile = tilesFor(cfg, 'path_stone', B.kit?.path_trace), u = cfg.units.m_per_kaykit_u
    const L = Math.hypot(s.x - from[0], s.z - from[1]), dir = [(s.x - from[0]) / L, (s.z - from[1]) / L], nrm = [-dir[1], dir[0]], iso = R.range(0.4, 0.55), bend = R.range(1.5, 3)
    let along = 0
    while (along < L - 1.2) {
      const t = along / L, wob = Math.sin(t * Math.PI * 1.3 + 0.7) * bend, decay = Math.max(0, (t - iso - 0.06 * Math.sin(along * 0.9)) / (1 - iso))
      const size = (1.0 - 0.6 * decay) * u * 0.5, gap = 0.03 + 0.28 * decay, step = 2 * size + gap
      for (let w = -0.8; w <= 0.8; w += step) {
        if (decay > 0 && R.next() < decay * 0.5) continue
        const jitter = (0.15 + decay * 0.6), off = w + R.range(-jitter, jitter) * size, adv = R.range(-0.4, 0.4) * step
        const x = from[0] + dir[0] * (along + adv) + nrm[0] * (off + wob), z = from[1] + dir[1] * (along + adv) + nrm[1] * (off + wob)
        const tl = R.pick(tile); put(tl, x, z, { s: +((size * 2) / (tl.r * 2)).toFixed(3), group: 'path', role: 'path', layer: 2, decay: +decay.toFixed(2), story: recipes.path_trace.story_template })
      }
      along += step * R.range(0.85, 1.15)
    }
  }

  // 4 · Regel-Bericht für das Gate (Zone und Biografie)
  const occ = inst.filter((x) => x.role === 'anchor' || x.role === 'support').reduce((s, x) => s + Math.PI * 2.2 ** 2, 0)
  const zoneReport = { groups: report.length, neg_space_est: +(1 - Math.min(1, occ / chunk.size ** 2)).toFixed(3), layers: [...layers].sort(), layers_ok: (rules.biography?.layers_required || []).every((l) => layers.has(l)),
    placeholders: inst.some((x) => x.placeholder) }
  return { schema: 'kfb.place-recipe/1', seed, biome, chunk, instances: inst, stamps: stampOut, deltas: stampOut.map((s) => ({ stamp: s.id, schema: 'kfb.terrain-delta/1', only_add: true })), report: { groups: report, zone: zoneReport } }
}

// Rezept-Hash für den Golden-Test (gleicher Seed = gleicher Hash)
export const recipeHash = (recipe) => hash32(JSON.stringify(recipe.instances)).toString(16)
