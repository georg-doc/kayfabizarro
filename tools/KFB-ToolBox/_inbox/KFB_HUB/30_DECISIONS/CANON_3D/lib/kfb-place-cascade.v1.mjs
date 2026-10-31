// kfb-place-cascade v1 · WFC über alle Maßstäbe (V-1117): Zone → Bodenplatz → Stück → Korn, je Ebene createLevel und eine Tabelle. Rein: kein three.js, kein DOM, kein Höhen-Owner (V-708).
// Die Wahrscheinlichkeit einer feineren Ebene hängt von den wirklichen gröberen Objekten in Reichweite ab (Sorte, Abstand zum Rand, Seite, Lücke zwischen zweien) und vom Gelände (Hang, Senke, Kuppe, Wasser, Straße, Sperre).
// Gelände kommt aus weltfesten Kacheln (sampleTile), also ist alles eine reine Funktion von Saat und Ort und unabhängig von der Lade-Reihenfolge. Gruppen, Größenstufen und Abfall sind Ergebnis der Tabelle.
import { createLevel, fieldTiles, MUSHROOM } from './kfb-place-field.v1.mjs'
import { rng } from './kfb-place-core.v1.mjs'

export const TILE_M = 128, TILE_STEP = 4, TILE_N = TILE_M / TILE_STEP + 1, TILE_CH = 8   // Kanäle: h, Hang, Senke, Abwärts x, Abwärts z, Wasserabstand, Straßenabstand, Sperre
const fnv = (s) => { let h = 2166136261 >>> 0; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0 } return h }
const u01 = (seed, i, j, salt) => { let h = seed ^ Math.imul(i | 0, 0x27d4eb2d) ^ Math.imul(j | 0, 0x165667b1) ^ Math.imul(salt | 0, 0x9e3779b1); h ^= h >>> 15; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967296 }
const smooth = (t) => t * t * (3 - 2 * t)
const vnoise = (seed, x, z, salt) => { const i = Math.floor(x), j = Math.floor(z), fx = smooth(x - i), fz = smooth(z - j), a = u01(seed, i, j, salt), b = u01(seed, i + 1, j, salt), c = u01(seed, i, j + 1, salt), d = u01(seed, i + 1, j + 1, salt); return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz }
const fbm = (seed, x, z, salt) => (vnoise(seed, x, z, salt) * 0.6 + vnoise(seed, x * 2.3 + 7, z * 2.3 + 3, salt + 1) * 0.4)
const curve = (K, e) => { if (e <= K[0][0]) return K[0][1]; for (let k = 1; k < K.length; k++) if (e < K[k][0]) { const t = (e - K[k - 1][0]) / (K[k][0] - K[k - 1][0]); return K[k - 1][1] + (K[k][1] - K[k - 1][1]) * t } return K[K.length - 1][1] }
const bessel0 = (k) => { const t = (k / 3.75) ** 2; return k < 3.75 ? 1 + t * (3.5156229 + t * (3.0899424 + t * (1.2067492 + t * 0.2659732))) : Math.exp(k) / Math.sqrt(k) * (0.39894228 + 0.01328592 / (k / 3.75)) }

// Weltfeste Gelände-Kachel: world = { height(x, z), water(x, z) → bool, blocked(x, z) → bool, road(x, z) → Abstand in m oder undefined }. Als Generator, damit der Hauptfaden zeitteilen kann.
const WD_R = 16, WD_S = 2, WD_K = Math.round(WD_R / WD_S)   // Wasserabstand mit Vorzeichen (im Wasser negativ) auf 2-m-Raster: bilinear gelesen trifft die Null die wirkliche Uferlinie
export function* sampleTile(world, ti, tj, memo = { h: new Map(), w: new Map() }) { const out = new Float32Array(TILE_N * TILE_N * TILE_CH), S = TILE_STEP, a0 = Math.round(ti * TILE_M / S), b0 = Math.round(tj * TILE_M / S)
  if (memo.h.size > 600000) memo.h.clear(); if (memo.w.size > 600000) memo.w.clear()
  const key = (a, b) => (a + 2097152) * 4194304 + (b + 2097152), H = (a, b) => { const k = key(a, b); let v = memo.h.get(k); if (v === undefined) { v = world.height(a * S, b * S); memo.h.set(k, v) } return v }, wet = (a, b) => { const k = key(a, b); let v = memo.w.get(k); if (v === undefined) { v = world.water(a * WD_S, b * WD_S) ? 1 : 0; memo.w.set(k, v) } return v }
  for (let j = 0; j < TILE_N; j++) { for (let i = 0; i < TILE_N; i++) { const a = a0 + i, b = b0 + j, x = a * S, z = b * S, o = (j * TILE_N + i) * TILE_CH, h = H(a, b), hE = H(a + 1, b), hW = H(a - 1, b), hS = H(a, b + 1), hN = H(a, b - 1), gx = (hE - hW) / (2 * S), gz = (hS - hN) / (2 * S), sl = Math.hypot(gx, gz)
      out[o] = h; out[o + 1] = sl; out[o + 2] = (hE + hW + hS + hN) / 4 - h + ((H(a + 3, b) + H(a - 3, b) + H(a, b + 3) + H(a, b - 3)) / 4 - h) * 0.5; out[o + 3] = sl > 1e-3 ? -gx / sl : 0; out[o + 4] = sl > 1e-3 ? -gz / sl : 0
      const ca = Math.round(x / WD_S), cb = Math.round(z / WD_S), self = wet(ca, cb); let wd2 = (WD_R + WD_S) ** 2; for (let r = 1; r <= WD_K && (r - 1) * WD_S * (r - 1) * WD_S < wd2; r++) for (let v = -r; v <= r; v++) for (let u = -r; u <= r; u++) { if (Math.max(Math.abs(u), Math.abs(v)) !== r) continue; const d2 = (u * u + v * v) * WD_S * WD_S; if (d2 < wd2 && wet(ca + u, cb + v) !== self) wd2 = d2 }
      out[o + 5] = (self ? -1 : 1) * (Math.sqrt(wd2) - WD_S / 2); const rd = world.road?.(x, z); out[o + 6] = rd ?? 1000; out[o + 7] = world.blocked(x, z) ? 1 : 0 } yield }
  return out }

export function createCascade({ table: T, cfg, seed, biomeAt, tile, carriers = null, order = null, deck = null, light = null, maxBlocks = 4096 }) {
  const SI = fnv(seed), tiles = fieldTiles(cfg, { formation: { tile_exclude: T.tile_exclude || [] } }, light), rules = cfg.rules, Z = T.zone, P = T.patch, K1 = T.stueck, K2 = T.korn
  // Gelände: bilinear aus den Kacheln; außerhalb der Reichweite gibt es keine Kachel, das wäre ein Fehler im Aufrufer
  const ctx = (x, z, ch) => { const ti = Math.floor(x / TILE_M), tj = Math.floor(z / TILE_M), g = tile(ti, tj), fx = (x - ti * TILE_M) / TILE_STEP, fz = (z - tj * TILE_M) / TILE_STEP, i = Math.min(TILE_N - 2, Math.floor(fx)), j = Math.min(TILE_N - 2, Math.floor(fz)), u = fx - i, v = fz - j, o = (j * TILE_N + i) * TILE_CH + ch, a = g[o], b = g[o + TILE_CH], c = g[o + TILE_N * TILE_CH], d = g[o + (TILE_N + 1) * TILE_CH]; return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v }
  const band = (B, v) => (B ? 1 + B[2] * Math.exp(-(((v - B[0]) / B[1]) ** 2)) : 1)
  const env = (x, z) => ({ sl: ctx(x, z, 1), ho: Math.max(-1.5, Math.min(1.5, ctx(x, z, 2))), wd: ctx(x, z, 5), rd: ctx(x, z, 6) })
  const terrain = (G, c) => { if (!G) return 1; if (c.sl > (G.hang_max ?? 1)) return 0; return Math.exp((G.senke ?? 0) * c.ho) * (1 + (G.hang ?? 0) * c.sl) * band(G.wasser, c.wd) * band(G.strasse, c.rd) }
  const kein = (x, z) => ctx(x, z, 7) > 0.35 || ctx(x, z, 5) < (T.ufer_m ?? 0.6) || ctx(x, z, 6) < (T.strasse_m ?? 0)
  const stLevel = (L) => { const { states } = L, idx = Object.fromEntries(states.map((s, k) => [s, k])); return { states, idx, hart: states.map((s) => !!L.objekte?.[s]?.hart), rad: (st, i, j, salt) => { const d = L.objekte?.[st]; if (!d) return 0; const u = u01(SI, i, j, salt + 7); return d.r_m[0] + (d.r_m[1] - d.r_m[0]) * u * u } } }

  // Zone und Bodenplatz
  const jit = (L, i, j, salt) => (L.jitter * 2) * (u01(SI, i, j, salt) - 0.5)
  const sitePos = (L, i, j, salt) => [(i + 0.5 + jit(L, i, j, salt)) * L.site_m, (j + 0.5 + jit(L, i, j, salt + 1)) * L.site_m]
  const zone = createLevel('zone', Z, SI, 100, (i, j, w, o) => { const [x, z] = sitePos(Z, i, j, 110), pr = Z.prior[biomeAt(x, z)] || Z.prior.moos; Z.states.forEach((s, k) => { w[o + k] = pr[s] ?? 0 }) }, maxBlocks)
  const wr = P.zone_warp, zoneOf = (x, z) => { const wx = x + wr.amp_m * 2 * (vnoise(SI, x / wr.scale_m, z / wr.scale_m, 120) - 0.5), wz = z + wr.amp_m * 2 * (vnoise(SI, x / wr.scale_m, z / wr.scale_m, 121) - 0.5); return Z.states[zone.at(Math.floor(wx / Z.site_m), Math.floor(wz / Z.site_m))] }
  const PL = stLevel(P), HARD = (st) => !!(P.objekte[st]?.hart || K1.objekte[st]?.hart), touch = (x1, z1, r1, x2, z2, r2, [lo, hi]) => { const q = Math.hypot(x1 - x2, z1 - z2) / (r1 + r2); return q > lo && q < hi }, BAN = T.fast_beruehren
  const pPos = (i, j) => sitePos(P, i, j, 210)
  const patch = createLevel('patch', P, SI, 200, (i, j, w, o) => { const [x, z] = pPos(i, j), pr = P.prior[zoneOf(x, z)] || {}, bm = P.biome?.[biomeAt(x, z)], dk = deck ? P.deck?.[deck] : null, blocked = kein(x, z), c = blocked ? null : env(x, z); PL.states.forEach((s, k) => { if (k === 0) { w[o] = pr[s] ?? 1; return } const v = (pr[s] ?? 0) * (bm?.[s] ?? 1) * (dk?.[s] ?? 1), r = PL.rad(s, i, j, 300); w[o + k] = blocked || !v || c.wd < (T.ufer_m ?? 0.6) + r || c.rd < (T.strasse_m ?? 0) + r ? 0 : v * terrain(P.gelaende?.[s], c) }) }, maxBlocks,
    { hard: PL.hart, forbid: (i, j, s, i2, j2, s2) => { if (!PL.hart[s] || !PL.hart[s2]) return false; const a = pPos(i, j), b = pPos(i2, j2); return touch(a[0], a[1], PL.rad(PL.states[s], i, j, 300), b[0], b[1], PL.rad(PL.states[s2], i2, j2, 300), BAN) } })
  const pState = (i, j) => PL.states[patch.at(i, j)]
  const memoObj = () => { const m = new Map(); return (k, f) => { let v = m.get(k); if (v === undefined) { v = f(); if (m.size > 400000) m.clear(); m.set(k, v) } return v } }
  const mp = memoObj(), side = (x, z, i, j) => { const sl = ctx(x, z, 1), u = u01(SI, i, j, 351); return sl > 0.05 ? Math.atan2(ctx(x, z, 4), ctx(x, z, 3)) + (u - 0.5) * 0.9 : u * 6.283 }
  const carriersIn = carriers || (() => [])
  const pObj = (i, j) => mp(i * 4194304 + j, () => { const st = pState(i, j); if (st === 'leer') return null; const [x, z] = pPos(i, j), r = PL.rad(st, i, j, 300); if (carriersIn(x, z, r + 0.5).some((c) => Math.hypot(c.x - x, c.z - z) < (c.r + r) * (c.hart ? 1.25 : 0.7))) return null; return { x, z, r, st, s: side(x, z, i, j), sg: u01(SI, i, j, 352) < 0.5 ? -1 : 1, sl: ctx(x, z, 1), hart: !!P.objekte[st]?.hart, lv: 0, i, j } })
  const objsNear = (x0, z0, x1, z1, R) => { const a = Math.floor((x0 - R) / P.site_m) - 1, b = Math.floor((z0 - R) / P.site_m) - 1, c = Math.floor((x1 + R) / P.site_m) + 1, d = Math.floor((z1 + R) / P.site_m) + 1, out = []; for (let j = b; j <= d; j++) for (let i = a; i <= c; i++) { const q = pObj(i, j); if (q) out.push(q) } for (const q of carriersIn((x0 + x1) / 2, (z0 + z1) / 2, Math.hypot(x1 - x0, z1 - z0) / 2 + R + 2)) out.push(q); return out }

  // Gemeinsame Rechnung der feinen Ebenen: Vereinigung der Beiträge aller Objekte in Reichweite
  const NORM = new Map(), norm = (k) => { let v = NORM.get(k); if (v === undefined) { v = Math.exp(k) / bessel0(k); NORM.set(k, v) } return v }
  const fine = (L, salt, parentObjs, reach, parentState = null, parentSite = 0) => { const X = stLevel(L), n = L.block, s = L.site_m, S = X.states.length, pos = (i, j) => sitePos(L, i, j, salt + 11), probs = new Float64Array(S), leer = new Float64Array(S), nah = [], B = { key: null, list: [] }, rs = L.rauschen, bz = L.bezug, gap = L.luecke || {}
    const bodies = (bi, bj) => { const k = bi * 1048576 + bj; if (B.key === k) return B.list; const x0 = bi * n * s, z0 = bj * n * s, x1 = x0 + n * s, z1 = z0 + n * s; B.key = k; B.list = parentObjs(x0, z0, x1, z1, reach); return B.list }
    const priorAt = (i, j, w, o) => { const [x, z] = pos(i, j), bi = Math.floor(i / n), bj = Math.floor(j / n), list = bodies(bi, bj); w.fill(0, o, o + S); w[o] = 1; if (!list.length || kein(x, z)) return
      let inside = false; probs.fill(0); leer.fill(1); nah.length = 0
      const wx = x + (L.warp ? L.warp.amp_m * 2 * (vnoise(SI, x / L.warp.scale_m, z / L.warp.scale_m, salt + 3) - 0.5) : 0), wz = z + (L.warp ? L.warp.amp_m * 2 * (vnoise(SI, x / L.warp.scale_m, z / L.warp.scale_m, salt + 4) - 0.5) : 0)
      for (const q of list) { const d = Math.hypot(q.x - x, q.z - z); if (d < q.r) { inside = true; break } const dw = Math.hypot(q.x - wx, q.z - wz), e = Math.max(0, dw - q.r); if (e > reach) continue; if (q.hart) nah.push(e)
        const scale = q.hart ? 0.5 + 0.5 * q.r / (T.bezugsradius_m ?? 0.85) : 1, th = Math.atan2(wz - q.z, wx - q.x)
        for (let k = 1; k < S; k++) { const R = bz[X.states[k]]?.[q.st]; if (!R) continue; let p = curve(R.kurve, e / scale); if (p <= 0) continue
          if (R.seite) { const kap = R.seite.kappa + (R.seite.kappa_hang ?? 0) * (q.sl ?? 0), ang = (q.s ?? 0) + (q.sg ?? 1) * (R.seite.winkel + (R.seite.winkel_hang ?? 0) * Math.min(1, (q.sl ?? 0) * 4)); p *= Math.exp(kap * (Math.cos(th - ang) - 1)) * norm(kap) }
          leer[k] *= 1 - Math.min(0.95, p) } }
      if (inside) return
      if (nah.length >= 2) { nah.sort((a, c) => a - c); for (const [st, G] of Object.entries(gap)) { const k = X.idx[st]; if (k && nah[1] < G.reichweite_m) leer[k] *= 1 - Math.min(0.9, G.p * (1 - nah[1] / G.reichweite_m)) } }
      const dn = rs ? 2 ** (rs.amp * 2 * (fbm(SI, x / rs.scale_m, z / rs.scale_m, salt + 5) - 0.5)) : 1; let sum = 0, any = false; for (let k = 1; k < S; k++) if (leer[k] < 1) any = true; if (!any) return; const c = env(x, z)
      for (let k = 1; k < S; k++) { const v = leer[k] < 1 ? (1 - leer[k]) * dn * terrain(L.gelaende?.[X.states[k]], c) : 0; probs[k] = v; sum += v }
      if (sum <= 0) return; if (sum > 0.95) for (let k = 1; k < S; k++) probs[k] *= 0.95 / sum
      w[o] = Math.max(0.05, 1 - Math.min(0.95, sum)); for (let k = 1; k < S; k++) w[o + k] = probs[k]
      for (let k = 1; k < S; k++) if (X.hart[k]) { const r = X.rad(X.states[k], i, j, salt); for (const q of list) if (q.hart && touch(x, z, r, q.x, q.z, q.r, BAN)) { w[o + k] = 0; break } } }
    const lev = createLevel(L.name, L, SI, salt, priorAt, maxBlocks, { empty: (bi, bj) => bodies(bi, bj).length === 0, hard: X.hart, forbid: X.hart.some(Boolean) ? (i, j, a, i2, j2, b) => { if (!X.hart[a] || !X.hart[b]) return false; const p = pos(i, j), q = pos(i2, j2); return touch(p[0], p[1], X.rad(X.states[a], i, j, salt), q[0], q[1], X.rad(X.states[b], i2, j2, salt), BAN) } : null })
    return { ...X, lev, pos, salt, stateAt: (i, j) => X.states[lev.at(i, j)] } }

  const s1 = fine(K1, 400, objsNear, K1.reichweite_m)
  const m1 = memoObj(), o1 = (i, j) => m1(i * 4194304 + j, () => { const st = s1.stateAt(i, j); if (st === 'leer') return null; const [x, z] = s1.pos(i, j), r = s1.rad(st, i, j, 400) || 0; return { x, z, r, st, s: u01(SI, i, j, 353) * 6.283, hart: !!K1.objekte[st]?.hart, lv: 1, i, j } })
  const near1 = (x0, z0, x1, z1, R) => { const a = Math.floor((x0 - R) / K1.site_m) - 1, b = Math.floor((z0 - R) / K1.site_m) - 1, c = Math.floor((x1 + R) / K1.site_m) + 1, d = Math.floor((z1 + R) / K1.site_m) + 1, out = []; for (let j = b; j <= d; j++) for (let i = a; i <= c; i++) { const q = o1(i, j); if (q) out.push(q) } for (const q of objsNear(x0, z0, x1, z1, R)) if (q.r > 0) out.push(q); return out }
  const s2 = fine(K2, 500, (x0, z0, x1, z1, R) => { const L = near1(x0, z0, x1, z1, R); return L.some((q) => q.lv === 1) ? L : [] }, K2.reichweite_m)
  const objects = (x0, z0, size) => { const out = [], add = (lv, a, b, n, f) => { for (let j = b; j < b + n; j++) for (let i = a; i < a + n; i++) { const q = f(i, j); if (q) out.push(q) } }; add(0, Math.floor(x0 / P.site_m), Math.floor(z0 / P.site_m), Math.ceil(size / P.site_m), pObj); add(1, Math.floor(x0 / K1.site_m), Math.floor(z0 / K1.site_m), Math.ceil(size / K1.site_m), o1)
    const a = Math.floor(x0 / K2.site_m), b = Math.floor(z0 / K2.site_m), n = Math.ceil(size / K2.site_m); for (let j = b; j < b + n; j++) for (let i = a; i < a + n; i++) { const st = s2.stateAt(i, j); if (st === 'leer') continue; const [x, z] = s2.pos(i, j); out.push({ x, z, r: s2.rad(st, i, j, 500), st, lv: 2, i, j }) } return out }

  // Objekte → Spiel-Instanzen, gleiche Form wie kfb-place-field
  const biomeIx = (b) => (order ? order.indexOf(b) : -1)
  const toItems = (ob, h) => { const M = T.modelle, out = []; for (const q of ob) { if (q.r <= 0) continue; const b = biomeAt(q.x, q.z), R = rng(`${seed}|c|${q.lv}|${q.i}|${q.j}`), bm = biomeIx(b), y = h(q.x, q.z), base = { p: [q.x, y, q.z], ry: R.next() * 6.283, rx: 0, rz: 0, cr: 0, cc: 0, bm, ga: [q.x, q.z], gr: 0 }, pool = tiles.veg[b] || {}, sink = (kind, f = 1) => { const a = rules.sink[kind] || [0, 0.05]; return Math.min(kind === 'grass' ? 0.04 : kind === 'bush' ? a[1] : rules.sink_cap, a[0] + (a[1] - a[0]) * R.next()) * f }
      const stone = (list, kind) => { const t = R.pick(list); out.push({ ...base, t: t.id, k: t.kind, r: 'field', st: kind, s: q.r / t.r, sk: sink(t.kind), gr: q.lv === 0 ? q.r : 0 }) }
      if (q.st === 'fels') stone(tiles.L, 'fels'); else if (q.st === 'brocken') stone(tiles.M, 'stein'); else if (q.st === 'stein') stone(tiles.S, 'stein')
      else if (q.st === 'kiesel') { const t = R.pick(tiles.pebble); out.push({ ...base, t: t.id, k: 'kiesel', r: 'field', st: 'kiesel', s: q.r / t.r, sk: sink('stone_S') }) }
      else if (q.st === 'kugel' || q.st === 'krume') { const g = [Math.floor(q.x / 5) * 5, Math.floor(q.z / 5) * 5]; out.push({ t: null, k: 'pebble', r: 'pebble', st: 'kugel', p: base.p, ry: 0, rx: 0, rz: 0, s: q.r, sk: 0, cr: 0, cc: 0, ga: g, gr: 0, bm }) }
      else if (q.st === 'gras' || q.st === 'grasquelle' || q.st === 'halm') { const list = pool.grass; if (!list?.length) continue; const t = R.pick(list), H = q.r * M.gras_hoehe_je_r; out.push({ ...base, t: t.id, k: 'grass', r: 'field', st: 'gras', s: H / t.h, sk: sink('grass') }) }
      else if (q.st === 'blume' || q.st === 'blumenquelle') { const model = M.blume.modelle[Math.floor(u01(SI, Math.floor(q.x / 12), Math.floor(q.z / 12), 340) * M.blume.modelle.length)], ts = Math.floor(u01(SI, Math.floor(q.x / 6), Math.floor(q.z / 6), 341) * 3); out.push({ ...base, t: model, k: 'flower', r: 'field', st: 'blume', s: (q.r * M.blume.hoehe_je_r / M.blume.model_h[model]), sk: sink('prop'), ts }) }
      else if (q.st === 'pilz') { const model = R.pick(M.pilz.modelle); out.push({ ...base, t: model, k: 'mushroom', r: 'field', st: 'pilz', s: q.r * M.pilz.skala_je_r, sk: sink('prop') }) }
      else if (q.st === 'busch') { const list = pool.bush; if (!list?.length) continue; const t = R.pick(list); out.push({ ...base, t: t.id, k: 'bush', r: 'field', st: 'busch', s: q.r * M.busch_skala_je_r, sk: sink('bush'), gr: q.r }) }
      else if (q.st === 'strunk') { out.push({ ...base, t: R.pick(M.strunk.modelle), k: 'stump', r: 'field', st: 'strunk', s: q.r * M.strunk.skala_je_r, sk: sink('stump') }) } } return out }
  return { objects, toItems, ctx, zoneOf, levels: { zone, patch, stueck: s1.lev, korn: s2.lev }, MUSHROOM }
}
