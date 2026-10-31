// kfb-place-field v1 · Verteiler über Gruppen hinweg (V-1076, V-1007): Belegungs-Raster mit Nachbarschaften als Daten, dieselbe Saat ergibt dieselbe Welt.
// Rein: kein three.js, kein DOM, kein Höhen-Owner (V-708). Gruppen-Inneres bleibt beim Kern (solveLocal, nestPositions, ruleReport aus kfb-place-core).
// Ebenen: Welt-Saat → Thema (biomeAt) → Deck (Aufschlag) → Zone (32 m) → Bodenplatz (4 m) → Formation → Element. Je Rasterebene eine Tabelle, ein Löser.
// Endlos und unabhängig von der Lade-Reihenfolge: Modifying in Blocks nach Merrell, unendliche Form nach Boris the Brave. Blöcke tragen vier Farben (Parität von
// bi, bj), gleichfarbige berühren sich nie; ein Block liest nur die fertigen Nachbarn niedrigerer Farbe. Das Ergebnis ist damit eine reine Funktion von Saat und Ort.
// „leer“ ist immer erlaubt, also gibt es keinen Widerspruch und kein Zurückspringen.
import { solveLocal, nestPositions, ruleReport, rng } from './kfb-place-core.v1.mjs'
import { collapse } from './kfb-place-collapse.v1.mjs'
export { collapse }

const fnv = (s) => { let h = 2166136261 >>> 0; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0 } return h }
const u01 = (seed, i, j, salt) => { let h = seed ^ Math.imul(i | 0, 0x27d4eb2d) ^ Math.imul(j | 0, 0x165667b1) ^ Math.imul(salt | 0, 0x9e3779b1); h ^= h >>> 15; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return (h >>> 0) / 4294967296 }
const smooth = (t) => t * t * (3 - 2 * t)
const vnoise = (seed, x, z, salt) => { const i = Math.floor(x), j = Math.floor(z), fx = smooth(x - i), fz = smooth(z - j), a = u01(seed, i, j, salt), b = u01(seed, i + 1, j, salt), c = u01(seed, i, j + 1, salt), d = u01(seed, i + 1, j + 1, salt); return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz }
const pickW = (obj, u) => { const e = Object.entries(obj); let t = e.reduce((s, [, w]) => s + w, 0) * u; for (const [k, w] of e) if ((t -= w) <= 0) return k; return e[e.length - 1][0] }

const matrix = (states, T) => { const S = states.length, M = new Float64Array(S * S).fill(1); for (const [a, row] of Object.entries(T || {})) for (const [b, v] of Object.entries(row)) { const i = states.indexOf(a), j = states.indexOf(b); if (i < 0 || j < 0) throw new Error('kfb-place-field: Zustand fehlt ' + a + '/' + b); M[i * S + j] = v; M[j * S + i] = v } return M }
const blockLinks = (n) => { const links = []; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const l = []; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue; l.push([ny * n + nx, Math.max(Math.abs(dx), Math.abs(dy)) > 1 ? 1 : 0]) } links.push(l) } return links }
const colour = (bi, bj) => (bi & 1) + 2 * (bj & 1)

function createLevel(name, L, seedInt, salt, priorAt, maxBlocks) {
  const n = L.block, S = L.states.length, A = matrix(L.states, L.adj), D = matrix(L.states, L.far), links = blockLinks(n), cache = new Map(), stat = { solved: 0, fallback: 0 }
  const key = (bi, bj) => (bi + 1048576) * 2097152 + (bj + 1048576)
  function solve(bi, bj) { const k0 = key(bi, bj); let b = cache.get(k0); if (b) { cache.delete(k0); cache.set(k0, b); return b }
    const c = colour(bi, bj), near = []; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) if ((di || dj) && colour(bi + di, bj + dj) < c) near.push([bi + di, bj + dj, solve(bi + di, bj + dj)])
    const N = n * n, w = new Float64Array(N * S), i0 = bi * n, j0 = bj * n
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const k = y * n + x; priorAt(i0 + x, j0 + y, w, k * S)
      if (x < 2 || y < 2 || x >= n - 2 || y >= n - 2) for (const [nbi, nbj, sol] of near) { const ox = nbi * n, oz = nbj * n
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const gi = i0 + x + dx, gj = j0 + y + dy, lx = gi - ox, ly = gj - oz; if (lx < 0 || ly < 0 || lx >= n || ly >= n) continue
          const st = sol[ly * n + lx], M = Math.max(Math.abs(dx), Math.abs(dy)) > 1 ? D : A; for (let s = 0; s < S; s++) w[k * S + s] *= M[st * S + s] } } }
    const r = collapse({ N, S, w, links, A, D, noise: (k) => u01(seedInt, i0 + k % n, j0 + Math.floor(k / n), salt + 1), pick: (k) => u01(seedInt, i0 + k % n, j0 + Math.floor(k / n), salt + 2) })
    stat.solved++; stat.fallback += r.fallback; cache.set(k0, r.out); if (cache.size > maxBlocks) cache.delete(cache.keys().next().value); return r.out }
  return { name, states: L.states, n, S, stat, at: (i, j) => { const bi = Math.floor(i / n), bj = Math.floor(j / n); return solve(bi, bj)[(j - bj * n) * n + (i - bi * n)] } }
}

// Kachel-Listen aus kfb_place (Steinkit v4, nur runde Brocken, Form-DNA V-794), Bewuchs je Biom aus biomes.<b>.cartoon (V-889)
export function fieldTiles(cfg, table) {
  const dom = (t) => ({ id: t.id, kind: t.kind, h: t.h_m, r: t.gate_r_m ?? t.hull_r_m, tile: t }), X = [...(cfg.rules?.form_dna?.exclude || []), ...(table?.formation?.tile_exclude || [])], TBY = new Map(cfg.tiles.map((t) => [t.id, t]))
  const stone = (kind) => cfg.tiles.filter((t) => t.kit === 'Steinkit v4' && t.kind === kind && t.shape === 'chunk' && !X.some((q) => t.id.includes(q))).map(dom)
  const list = (a) => (a || []).map((id) => TBY.get(id)).filter(Boolean).map(dom)
  const veg = Object.fromEntries(Object.entries(cfg.biomes).filter(([, B]) => B.cartoon).map(([b, { cartoon: C }]) => [b, { bush: list(C.bush), grass: list(C.grass) }]))
  const pebble = cfg.tiles.filter((t) => t.kit === 'KayKit Forest' && t.kind === 'rock' && /Rock_3_/.test(t.id) && (t.tris || 999) <= 200).map(dom)   // Kiesel: wenige Dreiecke, Steinkit-S hat 800 je Stein
  return { L: stone('stone_L'), M: stone('stone_M'), S: stone('stone_S'), pebble: pebble.length ? pebble : stone('stone_S'), veg }
}
export const MUSHROOM = 'flora:mushroom_red', MUSHROOM_GROUP = 'flora:mushroom_redGroup'

export function createPlaceField({ table, cfg, seed, biomeAt, order = null, deck = null, maxBlocks = 512 }) {
  const SEED = fnv(seed), T = table, Z = T.levels.zone, P = T.levels.patch, rules = cfg.rules, sunAz = cfg.light?.sun_az ?? -0.6, tiles = fieldTiles(cfg, table), deckM = deck ? T.deck?.[deck] : null
  const biomes = Object.keys(Z.prior), jit = (L, i, j, salt) => (L.jitter * 2) * (u01(SEED, i, j, salt) - 0.5)
  const sitePosL = (L, i, j, salt) => [(i + 0.5 + jit(L, i, j, salt)) * L.site_m, (j + 0.5 + jit(L, i, j, salt + 1)) * L.site_m]
  const zone = createLevel('zone', Z, SEED, 100, (i, j, w, o) => { const [x, z] = sitePosL(Z, i, j, 110), pr = Z.prior[biomeAt(x, z)] || Z.prior.moos; Z.states.forEach((s, k) => { w[o + k] = pr[s] ?? 0 }) }, maxBlocks)
  const warp = P.zone_warp, zoneOf = (x, z) => { const wx = x + warp.amp_m * 2 * (vnoise(SEED, x / warp.scale_m, z / warp.scale_m, 120) - 0.5), wz = z + warp.amp_m * 2 * (vnoise(SEED, x / warp.scale_m, z / warp.scale_m, 121) - 0.5); return Z.states[zone.at(Math.floor(wx / Z.site_m), Math.floor(wz / Z.site_m))] }
  const sitePos = (i, j) => sitePosL(P, i, j, 210), PS = P.states
  const patch = createLevel('patch', P, SEED, 200, (i, j, w, o) => { const [x, z] = sitePos(i, j), pr = P.prior[zoneOf(x, z)], bm = P.biome[biomeAt(x, z)], D = P.density, dn = D ? D.range[0] + (D.range[1] - D.range[0]) * vnoise(SEED, x / D.scale_m, z / D.scale_m, 125) : 1; PS.forEach((s, k) => { w[o + k] = (pr[s] ?? 0) * (bm?.[s] ?? 1) * (deckM?.[s] ?? 1) * (s === T.ground_state ? 1 : dn) }) }, maxBlocks * 2)
  const stateAt = (i, j) => PS[patch.at(i, j)]
  // Ausreißer als ganze Zone (V-1006): dort tragen die Gruppen Arten und Farben eines anderen Themas
  const biomeFor = (x, z) => { const b = biomeAt(x, z), zi = Math.floor(x / Z.site_m), zj = Math.floor(z / Z.site_m); if (u01(SEED, zi, zj, 130) >= (T.outlier?.zone ?? 0)) return b; const others = biomes.filter((q) => q !== b); return others[Math.floor(u01(SEED, zi, zj, 131) * others.length)] }
  const anchorR = (st, i, j) => { const F = T.formation[st], u = u01(SEED, i, j, 310); if (F.big_p && u01(SEED, i, j, 311) < F.big_p) return F.big_r_m[0] + (F.big_r_m[1] - F.big_r_m[0]) * u; return F.anchor_r_m[0] + (F.anchor_r_m[1] - F.anchor_r_m[0]) * u * u }

  // Rasterzustand → Formation → Elemente. Gehört der Zelle des Rasterplatzes und wird ganz ausgegeben (V-830). h, blocked kommen vom Adapter.
  function place({ x0, z0, size, h, blocked = () => false, stamps = [] }) {
    const s = P.site_m, i0 = Math.floor(x0 / s), j0 = Math.floor(z0 / s), n = Math.round(size / s), out = [], stat = { groups: {}, vetoed: 0, core: 0, coreOk: 0, stampChildren: 0 }, aliveMemo = new Map()
    const slope = (x, z) => Math.hypot(h(x + 1, z) - h(x - 1, z), h(x, z + 1) - h(x, z - 1)) / 2
    const hollow = (x, z) => (h(x - 8, z) + h(x + 8, z) + h(x, z - 8) + h(x, z + 8)) / 4 - h(x, z)
    const downAt = (x, z) => { const gx = h(x + 1, z) - h(x - 1, z), gz = h(x, z + 1) - h(x, z - 1); return Math.hypot(gx, gz) > 0.04 ? Math.atan2(-gz, -gx) : vnoise(SEED, x / 43, z / 43, 320) * 12.566 }
    const alive = (i, j) => { const k = i + ':' + j; let v = aliveMemo.get(k); if (v !== undefined) return v; const st = stateAt(i, j); v = false
      if (st !== T.ground_state) { const [x, z] = sitePos(i, j), R = T.terrain[st] || {}, sl = slope(x, z); if (sl <= (R.slope_max ?? 1)) { const acc = (R.accept ?? 1) + (R.slope_gain ?? 0) * sl + (R.hollow_gain ?? 0) * Math.max(-1, Math.min(1, hollow(x, z))); v = u01(SEED, i, j, 330) < acc && !blocked(x, z, T.formation[st]?.keep_r ?? 0.2) } }
      aliveMemo.set(k, v); return v }
    const sinkOf = (R, kind) => { const q = rules.sink[kind] || [0, 0.05], lim = kind === 'grass' ? 0.04 : kind === 'bush' ? q[1] : rules.sink_cap; return Math.min(lim, q[0] + (q[1] - q[0]) * R.next()) }
    const put = (R, id, kind, x, z, sc, ga, gr, bm, st, kindSink = kind) => { if (slope(x, z) > (T.terrain[st]?.slope_max ?? 0.8)) return {}; const o = { t: id, k: kind, r: 'field', st, p: [x, h(x, z), z], ry: R.next() * 6.283, rx: 0, rz: 0, s: sc, sk: sinkOf(R, kindSink), cr: 0, cc: 0, ga, gr, bm }; out.push(o); return o }
    const biomeIx = (b) => (order ? order.indexOf(b) : -1)
    const nearest = (i, j, want, ring = 1) => { let best = null, bd = Infinity; const [x, z] = sitePos(i, j); for (let dj = -ring; dj <= ring; dj++) for (let di = -ring; di <= ring; di++) { if (!di && !dj) continue; const a = i + di, b = j + dj; if (!want.includes(stateAt(a, b)) || !alive(a, b)) continue; const [px, pz] = sitePos(a, b), d = Math.hypot(px - x, pz - z); if (d < bd) { bd = d; best = { x: px, z: pz, st: stateAt(a, b), i: a, j: b, d } } } return best }
    const F_SMALL = T.formation.small_r_m, shade = sunAz + Math.PI, openOf = (q) => downAt(q.x, q.z) * 0.5 + (sunAz + (u01(SEED, q.i, q.j, 350) - 0.5) * 2.2) * 0.5   // Auslaufseite je Fels fest, also Seite statt Kranz

    // Fels und Stein: Anker, Stützen, Reste nach der Dreier-Regel (Kern), Kiesel laufen auf der offenen Seite aus
    function rockGroup(st, i, j, R, b, ax, az) { const F = T.formation[st], cnt = +pickW(F.counts, R.next()), r0 = anchorR(st, i, j), big = st === 'fels', dom = [big ? tiles.L : tiles.M, big ? tiles.M : tiles.S, tiles.S]
      const slots = Array.from({ length: cnt }, (_, k) => { const d = dom[Math.min(k, 2)]; return { role: k ? 'support' : 'anchor', kind: d[0].kind, tier: Math.min(k, 2), domain: d, baseH: d[0].h } })
      const fill = solveLocal(slots, R, rules, cfg.wfc?.tries ?? 16).fill, radii = fill.map((_, k) => r0 * F.tiers[k] * (1 + (R.next() - 0.5) * 0.12)), down = downAt(ax, az); let pos = null, rep = null
      for (let t = 0; t < 60 && !rep?.ok; t++) { const c = nestPositions(R, radii, rules, down, 0.55), rr = ruleReport(c, radii, rules.group); if (!rep || rr.score < rep.score) { pos = c; rep = rr } }
      stat.core++; if (rep.ok) stat.coreOk++; const gr = r0 * 2.6 + 1
      fill.forEach((f, k) => { if (radii[k] < F_SMALL) { const t = R.pick(tiles.pebble); put(R, t.id, 'kiesel', ax + pos[k][0], az + pos[k][1], radii[k] / t.r, [ax, az], gr, biomeIx(b), st, 'stone_S') } else put(R, f.tile.id, f.tile.kind, ax + pos[k][0], az + pos[k][1], radii[k] / f.tile.r, [ax, az], gr, biomeIx(b), st) })
      const open = openOf({ x: ax, z: az, i, j }), nT = F.trail[0] + Math.floor(R.next() * (F.trail[1] - F.trail[0] + 1)), placed = []; for (let k = 0; k < nT; k++) for (let tr = 0; tr < 6; tr++) { const an = open + (R.next() + R.next() - 1) * 1.05, d = r0 * 1.05 - Math.log(1 - R.next() * 0.95) * (0.35 + r0 * 0.5), px = ax + Math.cos(an) * d, pz = az + Math.sin(an) * d, rp = (F.trail_r_m[0] + (F.trail_r_m[1] - F.trail_r_m[0]) * R.next() ** 1.5) * Math.max(0.45, 1 - (d - r0) / (2.6 + r0 * 2)), t = R.pick(tiles.pebble); if (placed.some((q) => Math.hypot(q[0] - px, q[1] - pz) < (q[2] + rp) * 1.25)) continue; placed.push([px, pz, rp]); put(R, t.id, 'kiesel', px, pz, rp / t.r, [ax, az], gr, biomeIx(b), 'kiesel', 'stone_S'); break } }

    // Kiesel: Fleck, dicht an einem Herz, dünnt zu einer Seite aus, Bezug zum nächsten Fels (V-1000, V-798: Gruppen, kein Saum, keine Streuung)
    function pebbleDrift(i, j, R, b, ax, az) { const F = T.formation.kiesel, rock = nearest(i, j, ['fels', 'stein'], 2), [nA, nB] = rock ? F.n_near_rock : F.n, n = nA + Math.floor(R.next() * (nB - nA + 1)); let hx = ax, hz = az, dir = downAt(ax, az) + (R.next() - 0.5) * 0.9
      if (rock) { const rr = anchorR(rock.st, rock.i, rock.j), od = openOf(rock); dir = od + (R.next() - 0.5) * 0.8; const off = rr + 0.2 + R.next() * rr * 1.1; hx = rock.x + Math.cos(dir) * off; hz = rock.z + Math.sin(dir) * off }
      const run = F.run_m[0] + (F.run_m[1] - F.run_m[0]) * R.next(), fan = F.fan[0] + (F.fan[1] - F.fan[0]) * R.next(), placed = [], gr = run * 4 + 1
      for (let k = 0; k < n; k++) { const t = R.pick(tiles.pebble); for (let tr = 0; tr < 7; tr++) { const d = -Math.log(1 - R.next() * 0.97) * run, an = dir + (R.next() + R.next() - 1) * fan, px = hx + Math.cos(an) * d, pz = hz + Math.sin(an) * d, coarse = R.next() < F.coarse_p * (1 - Math.min(1, d / (run * 2.2))) * 2, rp = coarse ? F.coarse_r_m[0] + (F.coarse_r_m[1] - F.coarse_r_m[0]) * R.next() : (F.r_m[0] + (F.r_m[1] - F.r_m[0]) * R.next() ** 2) * (1 - 0.4 * Math.min(1, d / (run * 3)))
          if (placed.some((q) => Math.hypot(q[0] - px, q[1] - pz) < (q[2] + rp) * 1.25)) continue; placed.push([px, pz, rp]); put(R, t.id, 'kiesel', px, pz, rp / t.r, [ax, az], gr, biomeIx(b), 'kiesel', 'stone_S'); break } }
      if (R.next() < F.kugel_p) { const r0 = F.kugel_r_m[0] + (F.kugel_r_m[1] - F.kugel_r_m[0]) * R.next(), a0 = R.next() * 6.283; [1, 0.62, 0.38].forEach((f, m) => { const an = a0 + m * 2.3 + (R.next() - 0.5) * 0.5, d = m ? r0 * (1.6 + 0.9 * m) : 0, px = hx + Math.cos(dir) * run + Math.cos(an) * d, pz = hz + Math.sin(dir) * run + Math.sin(an) * d; out.push({ t: null, k: 'pebble', r: 'pebble', st: 'kiesel', p: [px, h(px, pz), pz], ry: 0, rx: 0, rz: 0, s: r0 * f, sk: 0, cr: 0, cc: 0, ga: [ax, az], gr, bm: biomeIx(b) }) }) } }   // seltene Knete-Kügelchen in Palettenfarbe (V-1004)

    // Gras sammelt sich am Fels und am Busch auf der Schattenseite; sonst Büschel um eine dichte Mitte
    function grassGroup(i, j, R, b, ax, az) { const F = T.formation.gras, pool = tiles.veg[b]?.grass; if (!pool?.length) return; const at = nearest(i, j, ['fels', 'stein', 'busch', 'strunk']), n = +pickW(F.counts, R.next()), sig = F.sigma_m[0] + (F.sigma_m[1] - F.sigma_m[0]) * R.next(); let cx = ax, cz = az
      if (at) { const rr = at.st === 'busch' ? 0.8 : at.st === 'strunk' ? 0.3 : anchorR(at.st, at.i, at.j), an = shade + (R.next() - 0.5) * 1.5; cx = at.x + Math.cos(an) * (rr + sig * 0.8); cz = at.z + Math.sin(an) * (rr + sig * 0.8) }
      const placed = []; for (let k = 0; k < n; k++) for (let tr = 0; tr < 6; tr++) { const a = R.next() * 6.283, d = sig * Math.sqrt(-2 * Math.log(1 - R.next() * 0.96)) * (0.45 + 0.13 * k), px = cx + Math.cos(a) * d, pz = cz + Math.sin(a) * d; if (placed.some((q) => Math.hypot(q[0] - px, q[1] - pz) < 0.32)) continue; placed.push([px, pz]); const t = R.pick(pool), sc = (F.h_m[Math.min(k, 2)] / t.h) * (0.92 + 0.16 * R.next()) * (k > 2 ? 0.8 : 1); put(R, t.id, 'grass', px, pz, sc, [ax, az], sig * 3 + 1, biomeIx(b), 'gras'); break } }

    // Blumen: Beet-Dreier, zwei einer Farbe und ein Akzent, Farbe über benachbarte Plätze gleich (Beet-Charakter, V-1005)
    function flowerBed(i, j, R, b, ax, az) { const F = T.formation.blume, bi = Math.floor(i / 4), bj = Math.floor(j / 4), model = F.models[Math.floor(u01(SEED, bi, bj, 340) * F.models.length)], q = Math.floor(u01(SEED, bi, bj, 341) * 3), A = R.next() * 6.283, pool = tiles.veg[b]?.grass, nG = pool?.length ? F.grass[0] + Math.floor(R.next() * (F.grass[1] - F.grass[0] + 1)) : 0, rock = nearest(i, j, ['fels'], 2)
      if (rock) { const rr = anchorR('fels', rock.i, rock.j), an = shade + (R.next() - 0.5) * 2, d = rr + F.out_m[0] + (F.out_m[1] - F.out_m[0]) * R.next(), cx = rock.x + Math.cos(an) * d, cz = rock.z + Math.sin(an) * d; if (!blocked(cx, cz, 0.3) && slope(cx, cz) <= (T.terrain.blume?.slope_max ?? 0.32)) { ax = cx; az = cz } }
      ;[0, 1, 2].forEach((m) => { const an = A + m * 2.25 + (R.next() - 0.5) * 0.6, d = m ? F.step_m[0] + (F.step_m[1] - F.step_m[0]) * R.next() * m * 0.8 : 0; put(R, model, 'flower', ax + Math.cos(an) * d, az + Math.sin(an) * d, (F.h_m[m] / F.model_h[model]) * (0.9 + 0.2 * R.next()), [ax, az], 2.2, biomeIx(b), 'blume', 'prop').ts = m === 2 ? (q + 1) % 3 : q })
      for (let k = 0; k < nG; k++) { const an = A + 1 + k * 2.6, d = 0.6 + R.next() * 0.7, t = R.pick(pool); put(R, t.id, 'grass', ax + Math.cos(an) * d, az + Math.sin(an) * d, (T.formation.gras.h_m[1 + Math.min(k, 1)]) / t.h, [ax, az], 2.2, biomeIx(b), 'gras') } }

    // Pilz mit zwei Begleitern im Schatten seines Trägers (V-1036)
    function mushroomGroup(i, j, R, b, ax, az) { const F = T.formation.pilz, at = nearest(i, j, ['strunk', 'fels', 'stein', 'busch']), model = R.pick(F.models); let cx = ax, cz = az; if (at) { const rr = at.st === 'busch' ? 0.75 : at.st === 'strunk' ? 0.3 : anchorR(at.st, at.i, at.j), an = shade + (R.next() - 0.5) * 1.1; cx = at.x + Math.cos(an) * (rr + 0.15); cz = at.z + Math.sin(an) * (rr + 0.15) }
      if (R.next() < F.group_p) { put(R, MUSHROOM_GROUP, 'mushroom', cx, cz, F.group_scale, [ax, az], 1.5, biomeIx(b), 'pilz', 'prop'); return } const A = R.next() * 6.283; [1, 0.62, 0.38].forEach((f, m) => { const an = A + m * 2.4, d = m ? 0.22 + 0.16 * m : 0; put(R, model, 'mushroom', cx + Math.cos(an) * d, cz + Math.sin(an) * d, F.scale * f, [ax, az], 1.5, biomeIx(b), 'pilz', 'prop') }) }

    // Strunk: ein Träger, Gras und Pilz sammeln sich über die Nachbarschaft an ihm
    function stumpGroup(i, j, R, b, ax, az) { const F = T.formation.strunk; put(R, R.pick(F.models), 'stump', ax, az, F.scale[0] + (F.scale[1] - F.scale[0]) * R.next(), [ax, az], 1, biomeIx(b), 'strunk', 'stump') }

    function bushGroup(i, j, R, b, ax, az) { const F = T.formation.busch, pool = tiles.veg[b]?.bush; if (!pool?.length) return; const n = +pickW(F.counts, R.next()), A = R.next() * 6.283; let last = -1
      for (let m = 0; m < n; m++) { const an = A + m * 2.3 + (R.next() - 0.5) * 0.5, d = m ? 0.9 + 0.55 * m + R.next() * 0.4 : 0; let ti = Math.floor(R.next() * pool.length); if (ti === last) ti = (ti + 1) % pool.length; last = ti; put(R, pool[ti].id, 'bush', ax + Math.cos(an) * d, az + Math.sin(an) * d, F.scale[m] * (0.92 + 0.16 * R.next()), [ax, az], 4, biomeIx(b), 'busch') } }

    const GROUP = { fels: (i, j, R, b, x, z) => rockGroup('fels', i, j, R, b, x, z), stein: (i, j, R, b, x, z) => rockGroup('stein', i, j, R, b, x, z), kiesel: pebbleDrift, gras: grassGroup, blume: flowerBed, pilz: mushroomGroup, busch: bushGroup, strunk: stumpGroup }
    for (let dj = 0; dj < n; dj++) for (let di = 0; di < n; di++) { const i = i0 + di, j = j0 + dj, st = stateAt(i, j); if (st === T.ground_state) continue; if (!alive(i, j)) { stat.vetoed++; continue }
      const [x, z] = sitePos(i, j), R = rng(`${seed}|field|${i}|${j}`); GROUP[st](i, j, R, biomeFor(x, z), x, z); stat.groups[st] = (stat.groups[st] || 0) + 1 }
    // Feste Träger aus dem Bewuchs-Pass (Bäume, große Formationen): kleine Kind-Gruppen an ihrem Fuß, ebenfalls über die Tabelle (Gras nur im Bewuchs-Biom, Pilz im Schatten)
    for (const q of stamps) { if (q[0] < x0 || q[1] < z0 || q[0] >= x0 + size || q[1] >= z0 + size) continue; const R = rng(`${seed}|stamp|${q[0].toFixed(2)}|${q[1].toFixed(2)}`), b = biomeFor(q[0], q[1]), sh = shade + (R.next() - 0.5) * 1.2, rr = q[2], cx = q[0] + Math.cos(sh) * (rr + 0.6), cz = q[1] + Math.sin(sh) * (rr + 0.6), pool = tiles.veg[b]?.grass
      if (pool?.length && R.next() < 0.45 && slope(cx, cz) < 0.5 && !blocked(cx, cz, 0.15)) { for (let k = 0, m = R.next() < 0.6 ? 3 : 5; k < m; k++) { const a = R.next() * 6.283, d = 0.3 + 0.35 * k * R.next(), t = R.pick(pool); put(R, t.id, 'grass', cx + Math.cos(a) * d, cz + Math.sin(a) * d, T.formation.gras.h_m[Math.min(k, 2)] / t.h, [cx, cz], 3, biomeIx(b), 'gras') } stat.stampChildren++ }
      else if ((P.biome[b]?.pilz ?? 1) > 0 && R.next() < 0.12 && !blocked(cx, cz, 0.1)) { const A = R.next() * 6.283; [1, 0.62, 0.38].forEach((f, m) => { const an = A + m * 2.4, d = m ? 0.22 + 0.16 * m : 0; put(R, MUSHROOM, 'mushroom', cx + Math.cos(an) * d, cz + Math.sin(an) * d, T.formation.pilz.scale * f, [cx, cz], 1.5, biomeIx(b), 'pilz', 'prop') }); stat.stampChildren++ } }
    return { items: out, stat }
  }
  return { place, stateAt, sitePos, zoneOf, biomeFor, patch, zone, states: PS, zones: Z.states }
}
