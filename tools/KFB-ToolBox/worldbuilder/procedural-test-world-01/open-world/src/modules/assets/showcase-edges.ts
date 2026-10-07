// /?showcase=assets&view=edges — proves the tile edge atlas (tile-edges.ts) visually.
//
// Tables (top-down): for EVERY 6-bit mask 1..63, matchTile() picks tile + rotation, and coloured pillars are placed on the
// edges the REQUESTED mask names (independent of the atlas). If the atlas or the rotation convention were wrong, the
// pillars would sit on grass instead of on road ends / river mouths / sea edges.
//   red = road · magenta = river · cyan = sea (coast) · yellow = sand flank (atlas) · white tall = ramp high edge
// Networks: random road graph, river graph and a lake on a real hex lattice, every cell resolved via matchTile();
// continuity across tile borders proves edge order + rotation sign end to end.
import * as THREE from 'three';
import type { CameraView, CoreContext } from '../../core/types';
import { hexToWorld, worldToHex, neighbor, hexDistance, edgeVector } from '../../core/hex';
import { rand01, hash } from '../../core/rng';
import { HEX_SCALE } from '../../core/units';
import { EDGE_TILE_IDS, TILE_EDGES, describe, matchCrossing, matchSlope, matchTile, coastAdvice, settleWater, type EdgeKind, type TileMatch } from './tile-edges';
import { groundLabel, makeBatch, makeMarkers, trs } from './showcase-util';

const SP = 22; // table spacing x (m)
const SPZ = 25; // table spacing z (m)
const IN = HEX_SCALE; // inradius (m) = 1 asset unit
const COL = { road: '#ff2020', river: '#ff2bd6', coast: '#00f0ff', sand: '#ffe14a', high: '#ffffff', none: '#555555' };

export const EDGE_TABLES = {
  road: { ox: 0, oz: 0 },
  river: { ox: 200, oz: 0 },
  coast: { ox: 400, oz: 0 },
  special: { ox: 0, oz: 230 },
  waterless: { ox: 200, oz: 230 },
  netRoad: { x: 77, z: 560 },
  roadsReal: { x: 1300, z: 100 },
  coastRaw: { x: 680, z: 560 },
  endings: { x: 0, z: 760 },
  netRiver: { x: 1300, z: 400 },
  netLake: { x: 477, z: 560 },
};

const bitsStr = (m: number) => [0, 1, 2, 3, 4, 5].filter((d) => m & (1 << d)).join('') || '-';
const short = (id: string) => id.split('/').pop()!.replace('hex_', '').replace('_waterless', '·wl');

export let coastStress: { rawNone: number; settledNone: number; flips: number; fields: number } | null = null;

const RAMP_X = 900, RAMP_Z = 0;
function rampCentre(d: number, road: boolean): { x: number; z: number } {
  // group d at x = d·70; grass in front, road 30 m behind as seen from the side camera of direction d
  const v = edgeVector(d), px = -v.z, pz = v.x; // perpendicular (rotated +90°)
  const sgn = pz >= 0 || (pz === 0 && px > 0) ? 1 : -1;
  const back = road ? -45 : 0;
  return { x: RAMP_X + (d % 3) * 120 + px * sgn * back, z: RAMP_Z + Math.floor(d / 3) * 120 + pz * sgn * back };
}

export async function showcaseEdges(ctx: CoreContext): Promise<void> {
  const seed = ctx.world.seed;
  await ctx.assets.preload([...EDGE_TILE_IDS]);
  const batch = makeBatch(ctx);
  const markers = makeMarkers();
  const labels = new THREE.Group();
  const summary: string[] = [];

  const edgeMarkers = (x: number, z: number, y: number, mask: number, color: string, h = 2.5, r = 1, dist = 0.72) => {
    for (let d = 0; d < 6; d++) {
      if (!(mask & (1 << d))) continue;
      const v = edgeVector(d);
      markers.add(color, x + v.x * IN * dist, y, z + v.z * IN * dist, h, r);
    }
  };
  const place = (m: TileMatch, x: number, z: number) => batch.add(m.asset, trs(x, 0, z, m.rotY));
  // edge index ruler: tiny numbers around one reference hex so a viewer can read the convention off the image
  const ruler = (x: number, z: number) => {
    for (let d = 0; d < 6; d++) {
      const v = edgeVector(d);
      labels.add(groundLabel(String(d), x + v.x * IN * 1.25, 0.4, z + v.z * IN * 1.25, 3.2, '#fff', 'rgba(0,0,0,0.85)'));
    }
  };

  // ---- 1. all masks per kind ----
  for (const kind of ['road', 'river', 'coast'] as EdgeKind[]) {
    const { ox, oz } = EDGE_TABLES[kind];
    let ok = 0;
    for (let mask = 1; mask < 64; mask++) {
      const x = ox + (mask % 8) * SP, z = oz + Math.floor(mask / 8) * SPZ;
      const m = matchTile(kind, mask);
      if (m) {
        ok++;
        place(m, x, z);
        const s = describe(m.asset, m.rot)!;
        edgeMarkers(x, z, 0.2, s.sand, COL.sand, 1.2, 0.6, 0.86);
      }
      let alt = '';
      if (!m && kind === 'river') {
        // single edge: rivers never end in the world (ARCHITECTURE §4) → no tile needed; plain grass placeholder
        batch.add('hex/tiles/base/hex_grass', trs(x, 0, z));
        alt = 'n/a: rivers are endless';
      } else if (!m && kind === 'coast') {
        // no tile: coastAdvice → this cell becomes water (settleWater)
        batch.add('hex/tiles/base/hex_water', trs(x, 0, z));
        alt = 'water (coastAdvice)';
      } else if (!m) batch.add('hex/tiles/base/hex_grass', trs(x, 0, z));
      edgeMarkers(x, z, 0.2, mask, COL[kind], 2.5, 1);
      labels.add(groundLabel(`${bitsStr(mask)} ${m ? short(m.asset) + ' r' + m.rot : alt || 'none'}`, x, 0.5, z + 10.6, 15, m ? '#fff' : '#9ff'));
    }
    summary.push(`${kind} ${ok}/63`);
    labels.add(groundLabel(`${kind.toUpperCase()}: all masks 1..63 (${ok} tiles${kind === 'river' ? '; 6 single-edge masks n/a' : kind === 'coast' ? ' + 39 → water' : ''}) — pillars = requested edges`, ox + 77, 0.5, oz - 14, 120, '#fff', 'rgba(10,40,80,0.9)'));
    ruler(ox, oz);
  }

  // ---- 2. ramps + crossings, every rotation ----
  {
    const { ox, oz } = EDGE_TABLES.special;
    const rows: { name: string; get: (k: number) => (TileMatch & { road?: number; river?: number; high?: number }) | null }[] = [
      { name: 'road ramp 1', get: (k) => ({ ...matchTile('road', (1 << k) | (1 << ((k + 3) % 6)), { slope: { dir: k, steps: 1 } })!, road: (1 << k) | (1 << ((k + 3) % 6)), high: k }) },
      { name: 'road ramp 2', get: (k) => ({ ...matchTile('road', (1 << k) | (1 << ((k + 3) % 6)), { slope: { dir: k, steps: 2 } })!, road: (1 << k) | (1 << ((k + 3) % 6)), high: k }) },
      { name: 'grass ramp 1', get: (k) => ({ ...matchSlope(k, 1), high: k }) },
      { name: 'grass ramp 2', get: (k) => ({ ...matchSlope(k, 2), high: k }) },
      // crossing: river straight k..k+3, road at k+2..k+5 (A) / k+1..k+4 (B)
      { name: 'crossing A', get: (k) => { const rv = (1 << k) | (1 << ((k + 3) % 6)), rd = (1 << ((k + 2) % 6)) | (1 << ((k + 5) % 6)); const m = matchCrossing(rv, rd); return m && { ...m, road: rd, river: rv }; } },
      { name: 'crossing B', get: (k) => { const rv = (1 << k) | (1 << ((k + 3) % 6)), rd = (1 << ((k + 1) % 6)) | (1 << ((k + 4) % 6)); const m = matchCrossing(rv, rd); return m && { ...m, road: rd, river: rv }; } },
    ];
    rows.forEach((row, ri) => {
      for (let k = 0; k < 6; k++) {
        const x = ox + k * SP * 1.2, z = oz + ri * SPZ;
        const m = row.get(k);
        if (!m?.asset) continue;
        place(m, x, z);
        const top = TILE_EDGES[m.asset]?.slope ? TILE_EDGES[m.asset].slope!.rise * HEX_SCALE : 0;
        if (m.road) edgeMarkers(x, z, 0.2, m.road, COL.road, top + 3, 1);
        if (m.river) edgeMarkers(x, z, 0.2, m.river, COL.river, 3, 1);
        if (m.high != null) edgeMarkers(x, z, 0, 1 << m.high, COL.high, top + 4, 0.6, 0.8);
        labels.add(groundLabel(`${row.name}→${k} r${m.rot}`, x, 0.5, z + 10.6, 15));
      }
    });
    labels.add(groundLabel('RAMPS (white = high edge = slope.dir) + RIVER×ROAD CROSSINGS, rot 0..5', ox + 70, 0.5, oz - 14, 130, '#fff', 'rgba(10,40,80,0.9)'));
  }

  // ---- 3b. ramp staircases, one group per rise direction d: low flat ← ramp → high flat (grass ramp ×2 in front,
  //      road ramp ×1 behind). If highEdge / rotation were wrong the ramp would end in a cliff. Side-view presets
  //      assets.edges_ramp0..5 look perpendicular to each direction.
  for (let d = 0; d < 6; d++) {
    for (const [steps, road] of [[2, false], [1, true]] as [1 | 2, boolean][]) {
      const c = rampCentre(d, road);
      const { q, r } = worldToHex(c.x, c.z);
      const p = hexToWorld(q, r);
      const rise = (steps === 2 ? 1 : 0.5) * HEX_SCALE;
      const straight = (1 << d) | (1 << ((d + 3) % 6));
      const m = road ? matchTile('road', straight, { slope: { dir: d, steps } })! : matchSlope(d, steps);
      place(m, p.x, p.z);
      const hi = neighbor(q, r, d), lo = neighbor(q, r, d + 3);
      const ph = hexToWorld(hi.q, hi.r), pl = hexToWorld(lo.q, lo.r);
      const flat = road ? matchTile('road', straight)! : { asset: 'hex/tiles/base/hex_grass', rotY: 0, rot: 0 };
      batch.add(flat.asset, trs(ph.x, rise, ph.z, flat.rotY));
      batch.add('hex/tiles/base/hex_grass_bottom', trs(ph.x, rise - HEX_SCALE, ph.z));
      batch.add(flat.asset, trs(pl.x, 0, pl.z, flat.rotY));
      // side neighbours as a real terrain would have them (RAMP_SIDE_LEVELS): d±1 touch the plateau half → high,
      // d±2 touch the ramp half → low. Closes the corner slivers where three tiles meet at the top of the ramp.
      for (const [off, high] of [[1, true], [5, true], [2, false], [4, false]] as [number, boolean][]) {
        const n = neighbor(q, r, d + off), pn = hexToWorld(n.q, n.r);
        if (high) {
          batch.add('hex/tiles/base/hex_grass', trs(pn.x, rise, pn.z));
          batch.add('hex/tiles/base/hex_grass_bottom', trs(pn.x, rise - HEX_SCALE, pn.z));
        } else batch.add('hex/tiles/base/hex_grass', trs(pn.x, 0, pn.z));
      }
      edgeMarkers(ph.x, ph.z, rise, 0, COL.high);
      markers.add(COL.high, ph.x, rise, ph.z, 3, 0.6); // white pole on the HIGH tile
      if (!road) labels.add(groundLabel(`ramp dir ${d}: white pole = high side`, p.x, 0.3, p.z + 11.5, 20));
    }
  }

  // ---- 4. networks on a real hex lattice (seed-dependent: &seed=N) ----
  const patch = (cx: number, cz: number, R: number) => {
    const c = worldToHex(cx, cz);
    const cells: { q: number; r: number }[] = [];
    for (let q = c.q - R; q <= c.q + R; q++) for (let r = c.r - R; r <= c.r + R; r++) if (hexDistance(q, r, c.q, c.r) <= R) cells.push({ q, r });
    const inside = (q: number, r: number) => hexDistance(q, r, c.q, c.r) <= R;
    return { c, cells, inside };
  };
  const K = (q: number, r: number) => q + ',' + r;
  // 4a. road network: random graph
  {
    const at = EDGE_TABLES.netRoad;
    const P = patch(at.x, at.z, 4);
    const mask = new Map<string, number>();
    for (const { q, r } of P.cells) for (const d of [0, 1, 2]) {
      const n = neighbor(q, r, d);
      if (!P.inside(n.q, n.r) || rand01(seed, 101, q, r, d) >= 0.42) continue;
      mask.set(K(q, r), (mask.get(K(q, r)) ?? 0) | (1 << d));
      mask.set(K(n.q, n.r), (mask.get(K(n.q, n.r)) ?? 0) | (1 << ((d + 3) % 6)));
    }
    let ok = 0, n = 0;
    for (const { q, r } of P.cells) {
      const p = hexToWorld(q, r);
      const m0 = mask.get(K(q, r)) ?? 0;
      if (!m0) { batch.add('hex/tiles/base/hex_grass', trs(p.x, 0, p.z)); continue; }
      n++;
      const m = matchTile('road', m0);
      if (m) { ok++; place(m, p.x, p.z); }
    }
    labels.add(groundLabel(`road network (seed ${seed}): ${ok}/${n} cells resolved`, at.x, 0.5, at.z - 64, 100, '#fff', 'rgba(10,40,80,0.9)'));
  }
  // Line walker shared by the road and river demos. Grows from (q,r) with heading `heading` until it is `len` cells
  // out; ≤ 60° turn per cell, never more than 60° off `heading`, never enters or touches an occupied cell (except
  // the cells in `touchOk`, i.e. its own junction), so lines never run side by side, never form tiny loops and never
  // leave grass islands. Returns null if it got stuck (caller retries with another salt).
  const walk = (q0: number, r0: number, heading: number, len: number, occupied: Set<string>, salt: number, touchOk: Set<string>, straight: [number, number] = [-1, -1]) => {
    const steps: { q: number; r: number; d: number }[] = [];
    let q = q0, r = r0, dir = heading;
    const mine = new Set<string>([K(q0, r0)]);
    for (let i = 0; i < len; i++) {
      const cand = [dir, (dir + 1) % 6, (dir + 5) % 6].filter((d) => {
        if (i >= straight[0] && i <= straight[1] && d !== dir) return false; // forced straight run (crossing site)
        const off = Math.min((d - heading + 6) % 6, (heading - d + 6) % 6);
        if (off > 1) return false;
        const n = neighbor(q, r, d);
        if (occupied.has(K(n.q, n.r)) || mine.has(K(n.q, n.r))) return false;
        for (let e = 0; e < 6; e++) {
          const m = neighbor(n.q, n.r, e), km = K(m.q, m.r);
          if (m.q === q && m.r === r) continue;
          if (mine.has(km)) return false; // would touch its own earlier cells (tight kink)
          if (occupied.has(km) && !touchOk.has(km)) return false;
        }
        return true;
      });
      if (!cand.length) return null;
      const w = cand.map((d) => (d === dir ? 5 : 1));
      let pick = rand01(seed, salt, i) * w.reduce((x, y) => x + y, 0);
      let d = cand[0];
      for (let j = 0; j < cand.length; j++) { pick -= w[j]; if (pick <= 0) { d = cand[j]; break; } }
      const n = neighbor(q, r, d);
      steps.push({ q: n.q, r: n.r, d });
      mine.add(K(n.q, n.r));
      q = n.q; r = n.r; dir = d;
      if (i === 0) touchOk = new Set(); // only the first step may touch the junction's neighbourhood
    }
    return steps;
  };
  const addLinks = (links: Map<string, number>, q0: number, r0: number, steps: { q: number; r: number; d: number }[]) => {
    let q = q0, r = r0;
    for (const st of steps) {
      links.set(K(q, r), (links.get(K(q, r)) ?? 0) | (1 << st.d));
      links.set(K(st.q, st.r), (links.get(K(st.q, st.r)) ?? 0) | (1 << ((st.d + 3) % 6)));
      q = st.q; r = st.r;
    }
  };
  const ringOf = (q: number, r: number, R: number) => {
    const c = worldToHex(0, 0); void c;
    const out: { q: number; r: number }[] = [];
    for (let dq = -R; dq <= R; dq++) for (let dr = -R; dr <= R; dr++) if (hexDistance(dq, dr, 0, 0) <= R) out.push({ q: q + dq, r: r + dr });
    return out;
  };
  const SHOW_R = 9, GEN_LEN = 14; // generated lines run far past the shown patch, so no line ends inside it

  // 4a'. realistic roads: a Y junction (arms 120° apart → no adjacent arm cells) with three long, gently winding
  //      arms that leave the patch on three sides. Seed-dependent.
  {
    const C = worldToHex(EDGE_TABLES.roadsReal.x, EDGE_TABLES.roadsReal.z);
    let links = new Map<string, number>();
    for (let attempt = 0; attempt < 40; attempt++) {
      links = new Map();
      const occ = new Set<string>([K(C.q, C.r)]);
      const d0 = hash(seed, 620, attempt) % 2; // Y = arms d0, d0+2, d0+4
      let ok = true;
      for (const a of [0, 2, 4]) {
        const st = walk(C.q, C.r, (d0 + a) % 6, GEN_LEN, occ, 621 + attempt * 7 + a, new Set([K(C.q, C.r)]));
        if (!st) { ok = false; break; }
        addLinks(links, C.q, C.r, st);
        for (const x of st) occ.add(K(x.q, x.r));
      }
      if (ok) break;
    }
    let n = 0, res = 0;
    for (const { q, r } of ringOf(C.q, C.r, SHOW_R)) {
      const p = hexToWorld(q, r);
      const m0 = links.get(K(q, r)) ?? 0;
      if (!m0) { batch.add('hex/tiles/base/hex_grass', trs(p.x, 0, p.z)); continue; }
      n++;
      const m = matchTile('road', m0);
      if (m) { res++; place(m, p.x, p.z); }
    }
    labels.add(groundLabel(`roads (seed ${seed}): Y junction + 3 winding arms, ${res}/${n} cells resolved`, EDGE_TABLES.roadsReal.x, 0.5, EDGE_TABLES.roadsReal.z - 125, 140, '#fff', 'rgba(10,40,80,0.9)'));
  }

  // 4b. endless rivers (ARCHITECTURE §4: rivers never start or end inside the world): a confluence (river_D, arms
  //     120° apart) with three long meandering arms that run off the patch, and a road crossing one arm on a
  //     river_crossing tile (bridge site). No springs, no mouths.
  {
    const C = worldToHex(EDGE_TABLES.netRiver.x, EDGE_TABLES.netRiver.z);
    let rl = new Map<string, number>(), dl = new Map<string, number>();
    let crossing: { q: number; r: number } | null = null;
    for (let attempt = 0; attempt < 60 && !crossing; attempt++) {
      rl = new Map(); dl = new Map();
      const occ = new Set<string>([K(C.q, C.r)]);
      const d0 = hash(seed, 630, attempt) % 2;
      let ok = true, arm0: { q: number; r: number; d: number }[] = [];
      for (const a of [0, 2, 4]) {
        const st = walk(C.q, C.r, (d0 + a) % 6, GEN_LEN, occ, 631 + attempt * 7 + a, new Set([K(C.q, C.r)]), a === 0 ? [1, 3] : [-1, -1]);
        if (!st) { ok = false; break; }
        if (a === 0) arm0 = st;
        addLinks(rl, C.q, C.r, st);
        for (const x of st) occ.add(K(x.q, x.r));
      }
      if (!ok) continue;
      // crossing at arm-0 step 3 (straight run 1..3 → in/out opposite): road at +120° (crossing A pattern)
      const X = arm0[2], a = arm0[2].d; // river through X along a / a+3
      const roadDirs = [(a + 2) % 6, (a + 5) % 6];
      const near = new Set<string>([K(X.q, X.r)]);
      for (let e = 0; e < 6; e++) { const m = neighbor(X.q, X.r, e); near.add(K(m.q, m.r)); }
      const roadOcc = new Set<string>(occ);
      roadOcc.delete(K(X.q, X.r));
      const legs = roadDirs.map((h, i) => walk(X.q, X.r, h, GEN_LEN, roadOcc, 640 + attempt * 5 + i, near, [0, 1]));
      if (legs.some((l) => !l)) continue;
      for (const l of legs) addLinks(dl, X.q, X.r, l!);
      crossing = X;
    }
    let rivers = 0;
    for (const { q, r } of ringOf(C.q, C.r, SHOW_R)) {
      const p = hexToWorld(q, r);
      const rm = rl.get(K(q, r)) ?? 0, dm = dl.get(K(q, r)) ?? 0;
      if (rm && dm) {
        const m = matchCrossing(rm, dm);
        if (m) place(m, p.x, p.z); else batch.add('hex/tiles/base/hex_grass', trs(p.x, 0, p.z));
      } else if (rm) {
        const m = matchTile('river', rm);
        if (m) { rivers++; place(m, p.x, p.z); }
      } else if (dm) {
        const m = matchTile('road', dm);
        if (m) place(m, p.x, p.z);
      } else batch.add('hex/tiles/base/hex_grass', trs(p.x, 0, p.z));
    }
    labels.add(groundLabel(`endless rivers (seed ${seed}): confluence + 3 arms, road crossing on ${crossing ? 'river_crossing tile' : '— (no site found)'}`, EDGE_TABLES.netRiver.x, 0.5, EDGE_TABLES.netRiver.z - 125, 150, '#fff', 'rgba(10,40,80,0.9)'));
    void rivers;
  }
  // 4c. coasts: random noise lakes. Left = raw (grey pillars = land cell with no coast tile), right = after
  //     settleWater(). Plus an in-page stress test over 300 random fields.
  {
    const R = 5;
    const field = (fs: number) => (q: number, r: number) => {
      if (hexDistance(q, r, 0, 0) > 3) return false; // keep lakes off the patch rim
      // blobby lakes from a few random centres
      for (let i = 0; i < 3; i++) {
        const cq = (hash(fs, i, 1) % 5) - 2, cr = (hash(fs, i, 2) % 5) - 2, rad = 1 + (hash(fs, i, 3) % 2);
        if (hexDistance(q, r, cq, cr) <= rad && rand01(fs, i, q, r) < 0.85) return true;
      }
      return false;
    };
    const P0 = patch(0, 0, R);
    const rel = P0.cells.map(({ q, r }) => ({ q: q - P0.c.q, r: r - P0.c.r }));
    const countNone = (wet: (q: number, r: number) => boolean) => {
      let none = 0;
      for (const { q, r } of rel) {
        if (wet(q, r)) continue;
        let m = 0;
        for (let d = 0; d < 6; d++) { const n = neighbor(q, r, d); if (wet(n.q, n.r)) m |= 1 << d; }
        if (m && !matchTile('coast', m)) none++;
      }
      return none;
    };
    let rawNone = 0, settledNone = 0, flips = 0;
    for (let t = 0; t < 300; t++) {
      const w = field(hash(seed, 900, t));
      rawNone += countNone(w);
      const f = settleWater(rel, w);
      flips += f.size;
      settledNone += countNone((q, r) => f.has(K(q, r)) || w(q, r));
    }
    // show a field that actually needs fixing (first one with raw `none` cells)
    let w = field(hash(seed, 901));
    for (let t = 0; t < 50 && countNone(w) === 0; t++) w = field(hash(seed, 902, t));
    const fl = settleWater(rel, w);
    for (const [side, at] of [['raw', EDGE_TABLES.coastRaw], ['settled', EDGE_TABLES.netLake]] as const) {
      const wet = side === 'raw' ? w : (q: number, r: number) => fl.has(K(q, r)) || w(q, r);
      const C = worldToHex(at.x, at.z);
      for (const { q, r } of rel) {
        const p = hexToWorld(C.q + q, C.r + r);
        if (wet(q, r)) { batch.add('hex/tiles/base/hex_water', trs(p.x, 0, p.z)); continue; }
        let m = 0;
        for (let d = 0; d < 6; d++) { const n = neighbor(q, r, d); if (wet(n.q, n.r)) m |= 1 << d; }
        const adv = coastAdvice(m);
        if ('tile' in adv) place(adv.tile, p.x, p.z);
        else {
          batch.add('hex/tiles/base/hex_grass', trs(p.x, 0, p.z));
          if (adv.action === 'water') edgeMarkers(p.x, p.z, 0.2, m, COL.none, 2.5, 1);
        }
      }
    }
    labels.add(groundLabel(`BEFORE settleWater: ${countNone(w)} land cells whose water mask has no coast tile (grey pillars) — coastAdvice() answers 'make it water' for them`, EDGE_TABLES.coastRaw.x, 0.5, EDGE_TABLES.coastRaw.z - 80, 150, '#fff', 'rgba(120,20,20,0.9)'));
    labels.add(groundLabel(`after settleWater(): ${countNone((q, r) => fl.has(K(q, r)) || w(q, r))} without tile · 300 fields: raw ${rawNone} → settled ${settledNone} (${flips} flips)`, EDGE_TABLES.netLake.x, 0.5, EDGE_TABLES.netLake.z - 80, 140, '#fff', 'rgba(10,80,40,0.9)'));
    coastStress = { rawNone, settledNone, flips, fields: 300 };
  }

  labels.add(groundLabel(`ATLAS: ${summary.join(' · ')} · crossings 12/12 · ramps 24/24`, 280, 0.5, -40, 260, '#fff', 'rgba(120,20,20,0.9)'));

  const g = batch.finish();
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).receiveShadow = true; });
  ctx.scene.add(g, markers.finish(), labels);
}

const top = (x: number, z: number, h: number): CameraView => ({ position: [x, h, z + 0.5], target: [x, 0, z], fov: 45 });
export const edgePresets: Record<string, (ctx: CoreContext) => CameraView> = {
  edges_roads: () => top(EDGE_TABLES.road.ox + 77, EDGE_TABLES.road.oz + 84, 290),
  edges_rivers: () => top(EDGE_TABLES.river.ox + 77, EDGE_TABLES.river.oz + 84, 290),
  edges_coast: () => top(EDGE_TABLES.coast.ox + 77, EDGE_TABLES.coast.oz + 84, 290),
  edges_special: () => top(EDGE_TABLES.special.ox + 66, EDGE_TABLES.special.oz + 60, 210),
  edges_netroad: () => top(EDGE_TABLES.netRoad.x, EDGE_TABLES.netRoad.z, 150),
  edges_netriver: () => top(EDGE_TABLES.netRiver.x, EDGE_TABLES.netRiver.z, 150),
  edges_netlake: () => top(EDGE_TABLES.netLake.x, EDGE_TABLES.netLake.z - 6, 190),
  edges_ramps: () => ({ position: [RAMP_X + 120, 230, RAMP_Z + 330], target: [RAMP_X + 120, 0, RAMP_Z + 55], fov: 45 }),
  ...Object.fromEntries([0, 1, 2, 3, 4, 5].map((d) => [`edges_ramp${d}`, () => {
    const g = rampCentre(d, false), b = rampCentre(d, true);
    const mx = (g.x + b.x) / 2, mz = (g.z + b.z) / 2;
    const dx = g.x - b.x, dz = g.z - b.z, l = Math.hypot(dx, dz);
    return { position: [g.x + (dx / l) * 66, 24, g.z + (dz / l) * 66], target: [mx, 1, mz], fov: 42 } as CameraView;
  }])),
  edges_netriver_low: () => ({ position: [EDGE_TABLES.netRiver.x, 55, EDGE_TABLES.netRiver.z + 40], target: [EDGE_TABLES.netRiver.x, 0, EDGE_TABLES.netRiver.z - 25], fov: 50 }),
  edges_netriver_close: () => ({ position: [EDGE_TABLES.netRiver.x + 8, 30, EDGE_TABLES.netRiver.z + 30], target: [EDGE_TABLES.netRiver.x, 0, EDGE_TABLES.netRiver.z], fov: 45 }),
  edges_coastraw: () => top(EDGE_TABLES.coastRaw.x, EDGE_TABLES.coastRaw.z - 6, 190),
  edges_roadclose: () => ({ position: [EDGE_TABLES.netRoad.x - 20, 22, EDGE_TABLES.netRoad.z + 42], target: [EDGE_TABLES.netRoad.x, 0, EDGE_TABLES.netRoad.z + 5], fov: 45 }),
  edges_roads_real: () => top(EDGE_TABLES.roadsReal.x, EDGE_TABLES.roadsReal.z, 150),
  edges_roads_real_low: () => ({ position: [EDGE_TABLES.roadsReal.x, 55, EDGE_TABLES.roadsReal.z + 40], target: [EDGE_TABLES.roadsReal.x, 0, EDGE_TABLES.roadsReal.z - 25], fov: 50 }),
  edges_zoom: () => top(EDGE_TABLES.road.ox + 33, EDGE_TABLES.road.oz + 12, 70),
};
