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
      return { fill: out, tries: t + 1, fallback: false } }
  }
  return { fill: slots.map((s) => ({ tile: s.domain[0], s: 1 })), tries, fallback: true }
}

// ── Nest: Stützen und Kiesel eng um den Anker (V-749 Nr. 7): Abstand je Paar entweder überlappt (≤ 0,85 × Radiensumme) oder mit Luft (≥ 1,25 ×),
// nie dazwischen; Stützen im Fächer, Kiesel hangabwärts; Nachbarabstände paarweise ≥ 30 % verschieden. Positionen relativ zum Anker.
function nestPositions(R, radii, rules, slopeDir) {
  const { overlap_max: ov, air_min: air } = rules.group, out = [[0, 0]], hosted = new Set()
  const okAt = (p, i) => { for (let j = 0; j < out.length; j++) { const dd = Math.hypot(p[0] - out[j][0], p[1] - out[j][1]), s = radii[j] + radii[i]; if (dd < 0.5 * s || (dd > ov * s && dd < air * s)) return false } return true }
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
      const rs = radii[host] + radii[i], f = pebble ? R.range(0.62, ov) : (R.next() < 0.55 ? R.range(0.62, ov) : R.range(air, air + 0.35))
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
  const [gMin, gMax] = rules.zone.groups, n = masks.groups ?? R.int(gMin, gMax), out = [], minD = chunk.size * 0.28
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
export function placeChunk({ cfg, seed, chunk, terrain, biome = 'moos', masks = {}, stamps = [], recipeList = null }) {   // recipeList: feste Gruppenfolge (P0), sonst nach Biom-Gewicht
  const rules = cfg.rules, B = cfg.biomes[biome], R = rng(`${seed}|${chunk.x0}|${chunk.z0}|${biome}`)
  const recipes = Object.fromEntries(cfg.recipes.map((r) => [r.id, r])), inst = [], report = [], layers = new Set()
  const push = (o) => { inst.push(o); if (o.layer) layers.add(o.layer); return o }
  const put = (tile, x, z, extra) => { const [gx, gz] = grad(terrain, x, z); const slope = Math.hypot(gx, gz)
    return push({ tile: tile.id, kind: tile.kind, placeholder: tile.placeholder, p: [+x.toFixed(3), +terrain.h(x, z).toFixed(3), +z.toFixed(3)], rotY: +R.range(0, Math.PI * 2).toFixed(3), sink: +sinkFor(rules, tile.kind, slope).toFixed(3), ...extra }) }

  // 1 · feste Stamps (Landmarken, Dioramen, Stumpf): nicht umordnen, nur einbetten (V-716, embed.sop)
  const stampOut = stamps.map((s, i) => {
    const rec = recipes[s.recipe] || {}, tile = tilesFor(cfg, rec.slots?.[0]?.kinds?.[0] || 'prop', B.kit?.[s.recipe])[0]
    const o = put(tile, s.x, s.z, { group: `stamp${i}`, role: rec.slots?.[0]?.role || 'landmark', layer: rec.layer, fixed: true, story: rec.story_template })
    for (const sl of (rec.slots || []).slice(1)) { const cnt = sl.count ?? 1, tl = tilesFor(cfg, sl.kinds[0], B.kit?.[s.recipe])
      for (let k = 0; k < cnt; k++) { const a = R.range(0, Math.PI * 2), d = tile.r * R.range(1.8, 3.2); put(tl[k % tl.length], s.x + Math.cos(a) * d, s.z + Math.sin(a) * d, { group: `stamp${i}`, role: sl.role, layer: rec.layer, story: 'Holzstück desselben Stamms' }) } }
    if (rec.finds && cfg.finds) push({ tile: 'find:catalog', kind: 'find', p: [o.p[0] + 0.6, o.p[1] + 1.0, o.p[2]], rotY: 0, sink: 0, group: o.group, role: 'find', layer: 2, story: 'Fundstück am Stumpf (V-437)' })
    return { id: s.id || `stamp${i}`, footprint_r: tile.r * 1.4, fixed: true, embed: { only_add: true, sop: 'embed.sop' } }
  })

  // 2 · Gruppen: Rezept je Keim, Slots über solveLocal, Nest-Positionen, Einsinken nach Art und Hang
  for (const [gi, c] of zoneSeeds(R, chunk, rules, recipeList ? { ...masks, groups: recipeList.length } : masks).entries()) {
    let contactCov = 0
    const rid = recipeList?.[gi] ?? R.weighted(Object.fromEntries(Object.entries(B.recipes).filter(([k]) => recipes[k] && !recipes[k].fixed && k !== 'path_trace')))
    const rec = recipes[rid], kit = B.kit?.[rid], slots = []
    rec.slots.forEach((sl, si) => { const cnt = Array.isArray(sl.count) ? R.pick(sl.count) : sl.count ?? 1
      for (let k = 0; k < cnt; k++) { const kind = R.pick(sl.kinds); let dom = tilesFor(cfg, kind, kit); if (sl.role === 'pebble' && dom[0]?.placeholder) dom = tilesFor(cfg, kind, 'Steinkit v4');   /* V-763: Kiesel sind Mikro-Ebene, Steinkit erlaubt */ slots.push({ role: sl.role, kind, tier: Math.min(si, 2), domain: dom, baseH: dom[0].h, layer: sl.layer ?? rec.layer }) } })
    if (rec.odd_total && slots.length % 2 === 0) slots.pop()
    const sol = solveLocal(slots, R, rules, cfg.wfc?.tries ?? 16)
    const [gx, gz] = grad(terrain, c[0], c[1]), down = Math.atan2(-gz, -gx)
    const anchorR = (sol.fill[0].tile.r * sol.fill[0].s) || 1
    const radii = sol.fill.map((f) => f.tile.r * f.s); let pos = null, rep = null
    for (let tries = 0; tries < 160; tries++) { const cand = nestPositions(R, radii, rules, down), rr = ruleReport(cand, radii, rules.group)   /* V-763/V-768: Abnahme mit dem Gate-Maß */
      if (!rep || rr.score < rep.score) { pos = cand; rep = rr } if (rr.ok) break }
    const tiltShare = (rules.lean?.pebble_tilt ?? [15, 0.2])[1], tiltDeg = 18   /* V-763: > 15° auch nach rotZ */, pebIdx = slots.map((s, i) => (s.role === 'pebble' ? i : -1)).filter((i) => i >= 0), nTilt = Math.ceil(pebIdx.length * tiltShare)
    const tilted = new Set(pebIdx.slice(0, nTilt))
    slots.forEach((s, i) => { const f = sol.fill[i]; const tilt = tilted.has(i) ? { rotX: +((tiltDeg * Math.PI) / 180 * (R.next() < 0.5 ? 1 : -1)).toFixed(3), rotZ: +R.range(-0.08, 0.08).toFixed(3) } : {}
      const o = put(f.tile, c[0] + pos[i][0], c[1] + pos[i][1], { s: f.s, group: `g${gi}`, role: s.role, layer: s.layer, story: rec.story_template, ...tilt })
      // Fluff-Nester an Bäumen und Büschen (B2-R2 Variante A, V-750 Farbe aus der Harmonie)
      if (rec.fluff && (s.kind === 'tree' || s.kind === 'bush')) {
        const nests = s.kind === 'tree' ? 1 + R.int(0, 2) : R.int(1, 2), sun = cfg.light?.sun_az ?? -0.6
        for (let n = 0; n < nests; n++) { const balls = 1 + 3 + R.int(1, 3), a = sun + R.range(-0.5, 0.5) + n * 1.1
          push({ tile: 'fluff:nest', kind: 'fluff', p: [o.p[0] + Math.cos(a) * f.tile.r * f.s * 0.8, o.p[1] + f.tile.h * f.s * (s.kind === 'tree' ? R.range(0.55, 0.8) : 0.5), o.p[2] + Math.sin(a) * f.tile.r * f.s * 0.8],
            rotY: 0, sink: 0, group: o.group, role: n === 0 ? 'fluff_hero' : 'fluff_side', balls, color_role: 'fluff', harvest: true, layer: 4 }) }
      }
    })
    // Kontakt-Geometrie mit Ursache am Anker (V-749 Nr. 3): Bögen auf 40–50 % des Umfangs, Lücke ≥ 25 %, Stücke so gesetzt, dass ihre Winkelbreiten
    // zusammen genau die gewählte Abdeckung ergeben (das Gate misst die Abdeckung über die Winkelbreiten); keine Zählregel, kein Kranz.
    { const [p0, p1] = rules.contact.perimeter, cov = R.range(p0 + 0.01, p1 - 0.01), anc = inst.find((x) => x.group === `g${gi}` && x.role === 'anchor')
      const Rr = anchorR * 1.02, arcs = 2,   /* zwei Bögen: größte Lücke (1 − Abdeckung)/2 ≥ 25 % (V-763) */ w = Math.min(2 * Math.asin(Math.min(0.99, Math.min(0.18, Rr * 0.18) / Rr)), (0.04 * Math.PI * 2) / arcs)   // Stückbreite fein genug fürs Fenster
      const rc = Rr * Math.sin(w / 2), per = Math.max(1, Math.round((cov * Math.PI * 2) / arcs / w))
      let n = per; const covOf = (k) => (arcs * k * w) / (Math.PI * 2); while (covOf(n) < p0 && n < 999) n++; while (covOf(n) > p1 && n > 1) n--   // in das Fenster einrasten
      const span = (Math.PI * 2) / arcs
      for (let a = 0; a < arcs; a++) { const start = down + a * span + R.range(-0.2, 0.2)
        for (let t = 0; t < n; t++) { const ang = start + (t + 0.5) * w
          push({ tile: 'contact:moss_pebble', kind: 'contact', r: +rc.toFixed(3), p: [anc.p[0] + Math.cos(ang) * Rr, anc.p[1], anc.p[2] + Math.sin(ang) * Rr], rotY: R.range(0, 6.28), sink: rules.sink.contact[0], group: `g${gi}`, role: 'contact', cause: 'hangabwärts gespült', layer: 4 }) } }
      contactCov = Math.min(1, covOf(n)) }
    report.push({ group: `g${gi}`, recipe: rid, slots: slots.length, odd: slots.length % 2 === 1, wfc_tries: sol.tries, fallback: sol.fallback, contact_cov: +contactCov.toFixed(3), g1: rep.ok ? 'ok' : rep.failed.join(',') })
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
