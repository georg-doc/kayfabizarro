// Environment Kit R1 · placement after docs/SPEC_PLACEMENT_GRAMMAR_R1.md:
// zones (§1) → 2–4 Rule-of-Three groups in the core (anchor 1.2–1.4 · 2–3 supports 0.7–0.9 · one accent, §3),
// a few small transition clusters, 2–4 rim stones breaking the silhouette; terrain-following anchors (palms at the
// pond, pines on the mountain, §2); grounding: foot on the lowest ground under it, sunk 5–15 % (§4.1);
// nothing in path beds, water, the open zone or on building pads; trees stay below the landmark (§3).
import { rng } from '../island/noise';
import type { IslandField } from '../island/terrain';
import type { Biome, RoleLists, W } from './biomes';
import type { EnvKit, EnvRole, EnvSpecies } from './kits';

export interface EnvInstance {
  species: string;
  role: EnvRole;
  kit: EnvKit;
  x: number; y: number; z: number;
  rotY: number; tiltX: number; tiltZ: number;
  scale: number;
  /** sink depth as a share of the instance height (Etherington: 5–15 %) */
  sink: number;
  /** per-instance attributes kept for E3–E5 (deformer, wind groups, visualizer) */
  group: number; phase: number; stiffness: number; leaf: number;
  cast: boolean;
}

export interface EnvGroup {
  id: number;
  kind: 'rot' | 'mini' | 'path' | 'rim';
  kit: EnvKit;
  center: [number, number];
  members: number[];
}

export interface EnvOverride { move?: [number, number]; remove?: boolean; seed?: number }

export interface PlaceOptions {
  seed: number;
  /** landmark height (lab units): no tree in its view higher than 60 %, none anywhere higher than 95 % */
  landmarkH?: number;
  /** Georg's per-group overrides (grammar §7): survive a regeneration */
  overrides?: Record<number, EnvOverride>;
}

const STIFF: Record<EnvRole, number> = { anchor: 0.55, smallTree: 0.65, bush: 0.85, flower: 0.3, grass: 0.12, stone: 1, rimRock: 1 };

export function placeEnvironment(f: IslandField, biome: Biome, sp: (id: string, role: EnvRole) => EnvSpecies, opt: PlaceOptions) {
  const R = rng(opt.seed * 31 + 101);
  const inst: EnvInstance[] = [], groups: EnvGroup[] = [];
  // an island that asks for no nature (all counts 0, e.g. the RKIT test hub) gets none
  const N = f.spec.nature;
  if (!N || (N.trees | 0) + (N.bushes | 0) + (N.rocks | 0) <= 0 || !f.poly?.length) return { inst, groups };
  const placed: { x: number; z: number; r: number }[] = [];
  const T = f.spec.terrain, rad = f.radius;
  const residents = (f.spec.residents ?? []).filter((r) => !r.seat).map((r) => [r.x, r.z] as [number, number]);
  const [lx, lz] = f.landmark;
  let fx = f.openC[0] - lx, fz = f.openC[1] - lz;
  { const L = Math.hypot(fx, fz) || 1; fx /= L; fz /= L; }
  const pick = (list: W[] | undefined): string | null => {
    if (!list?.length) return null;
    let s = 0;
    for (const [, w] of list) s += w;
    let t = R() * s;
    for (const [id, w] of list) if ((t -= w) <= 0) return id;
    return list[list.length - 1][0];
  };
  const lists = (k: EnvKit): RoleLists => biome.lists[k] ?? biome.lists[biome.kits[0]]!;

  /** zones: inside, off the lip, dry, off pads, out of the open zone, off the path bed (+1,5), away from residents */
  // road bed (RKIT kfb.road-bed/1, provided by the lab as field.isClear): true = road, embankment or keep-clear zone.
  // No vegetation there, also no grass overlaps later (E4). No-op until the field offers it.
  const isClear = (f as IslandField & { isClear?: (x: number, z: number) => boolean }).isClear?.bind(f);
  const blocked = (x: number, z: number, foot: number) => {
    if (!isClear) return false;
    if (isClear(x, z)) return true;
    for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; if (isClear(x + Math.cos(a) * foot, z + Math.sin(a) * foot)) return true; }
    return false;
  };
  const ok = (x: number, z: number, foot: number, rim = false) => {
    if (blocked(x, z, Math.max(0.3, foot))) return false;
    if (rim) { const sd = f.sd(x, z); if (sd < 0.25 || sd > 2.5) return false; }
    else if (!f.free(x, z, Math.max(1.2, foot + 0.6))) return false;
    if (rim && T.pond && Math.hypot(x - T.pond.x, z - T.pond.z) < T.pond.r * 1.25 + 1) return false;
    if (rim) for (const b of f.spec.buildings) if (Math.hypot(x - b.x, z - b.z) < b.pad * 1.1) return false;
    if (f.inOpen(x, z)) return false;
    if (f.bed(x, z) < 1.5 + foot) return false;
    for (const [rx, rz] of residents) if (Math.hypot(x - rx, z - rz) < 2.5 + foot) return false;
    return true;
  };
  const clear = (x: number, z: number, r: number) => placed.every((p) => Math.hypot(p.x - x, p.z - z) >= (p.r + r) * 0.9);
  const collR = (s: EnvSpecies, sc: number) => s.crownR * sc * (s.role === 'anchor' || s.role === 'smallTree' ? 0.42 : 0.75);

  /** final scale with the landmark rule */
  const capScale = (s: EnvSpecies, sc: number, x: number, z: number) => {
    if (!opt.landmarkH || (s.role !== 'anchor' && s.role !== 'smallTree')) return sc;
    const dx = x - lx, dz = z - lz, d = Math.hypot(dx, dz) || 1;
    const inView = (dx * fx + dz * fz) / d > 0.64 && d < rad * 1.1; // in front of it: ±50° cone
    const maxH = opt.landmarkH * (inView ? 0.6 : 0.95);
    return Math.min(sc, maxH / s.height);
  };

  const put = (id: string, role: EnvRole, kit: EnvKit, x: number, z: number, sc: number, g: number, phase: number, leaf: number): number => {
    const s = sp(id, role);
    sc = capScale(s, sc, x, z);
    const h = s.height * sc, fr = s.footR * sc;
    // grounding: lowest ground under the foot (centre + ring), then sink 5–15 % of the height
    let gy = f.height(x, z);
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; gy = Math.min(gy, f.height(x + Math.cos(a) * fr * 0.8, z + Math.sin(a) * fr * 0.8)); }
    const sink = 0.05 + R() * 0.1;
    const rocky = role === 'stone' || role === 'rimRock';
    inst.push({
      species: id, role, kit, x, y: gy - sink * h, z, rotY: R() * Math.PI * 2,
      tiltX: (R() - 0.5) * (rocky ? 0.3 : 0.06), tiltZ: (R() - 0.5) * (rocky ? 0.3 : 0.06),
      scale: sc, sink, group: g, phase: phase + (R() - 0.5) * 0.8, stiffness: STIFF[role] * (id.includes('Cactus') ? 1.5 : id.includes('Palm') ? 0.6 : 1),
      leaf, cast: role === 'anchor' || role === 'rimRock',
    });
    placed.push({ x, z, r: collR(s, sc) });
    return inst.length - 1;
  };

  /** nearest usable spot around (x,z) within r */
  const near = (x: number, z: number, r: number, foot: number, cr: number, rim = false): [number, number] | null => {
    if (ok(x, z, foot, rim) && clear(x, z, cr)) return [x, z];
    for (let t = 0; t < 50; t++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r;
      const px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d;
      if (ok(px, pz, foot, rim) && clear(px, pz, cr)) return [px, pz];
    }
    return null;
  };

  const leafOf = () => biome.leafVariants[Math.floor(R() * biome.leafVariants.length)];

  // ---------- 1 · Rule-of-Three groups ----------
  const nG = rad > 40 ? 4 : 3;
  const centres: [number, number][] = [];
  const [cx, cz] = f.c;
  const oa = Math.atan2(f.openC[1] - cz, f.openC[0] - cx);
  const tries: { x: number; z: number; slope?: boolean; shore?: boolean }[] = [];
  if (biome.shoreAnchors && T.pond) {
    const a0 = R() * Math.PI * 2;
    for (let k = 0; k < 16; k++) { const a = a0 + (k / 16) * Math.PI * 2, d = T.pond.r * 1.25 + 3.2; tries.push({ x: T.pond.x + Math.cos(a) * d, z: T.pond.z + Math.sin(a) * d, shore: true }); }
  }
  if (T.mount && biome.lists[biome.kits[0]]?.slope) {
    const a0 = R() * Math.PI * 2; // pines on the mountain flank, wherever the path leaves room
    for (let k = 0; k < 10; k++) { const a = a0 + (k / 10) * Math.PI * 2, d = T.mount.r * (0.45 + (k % 2) * 0.25); tries.push({ x: T.mount.x + Math.cos(a) * d, z: T.mount.z + Math.sin(a) * d, slope: true }); }
  }
  for (const k of [0.55, -0.55, 0.85, -0.85, 1, 0.3, -0.3, 0.7, -0.7, 0.42, -0.42]) {
    for (const dk of [0.5, 0.65, 0.38]) {
      const a = oa + Math.PI * k + (R() - 0.5) * 0.3, d = rad * (dk + R() * 0.08);
      tries.push({ x: cx + Math.cos(a) * d, z: cz + Math.sin(a) * d });
    }
  }
  let usedShore = false, usedSlope = false;
  for (const t of tries) {
    if (groups.filter((g) => g.kind === 'rot').length >= nG) break;
    if ((t.shore && usedShore) || (t.slope && usedSlope)) continue;
    const gi = groups.length, ov = opt.overrides?.[gi];
    if (ov?.remove) { groups.push({ id: gi, kind: 'rot', kit: biome.kits[0], center: [t.x, t.z], members: [] }); continue; }
    const kit = biome.kits[groups.filter((g) => g.kind === 'rot').length % biome.kits.length];
    const L = lists(kit);
    const anchorList = t.slope ? L.slope : L.anchor;
    const aRole: EnvRole = t.slope ? 'smallTree' : 'anchor';
    const aId = pick(anchorList);
    if (!aId) continue;
    const aS = sp(aId, aRole);
    const sA = t.slope ? 1.25 + R() * 0.1 : 1.2 + R() * 0.2;
    const tx = t.x + (ov?.move?.[0] ?? 0), tz = t.z + (ov?.move?.[1] ?? 0);
    const c = near(tx, tz, t.shore || t.slope ? 2.5 : rad * 0.2, aS.footR * sA, collR(aS, sA));
    if (!c) continue;
    if (centres.some(([qx, qz]) => Math.hypot(qx - c[0], qz - c[1]) < Math.max(12, rad * 0.5))) continue;
    if (t.shore) usedShore = true;
    if (t.slope) usedSlope = true;
    centres.push(c);
    const g: EnvGroup = { id: gi, kind: 'rot', kit, center: c, members: [] };
    groups.push(g);
    const phase = R() * Math.PI * 2, leafA = leafOf();
    const ai = put(aId, aRole, kit, c[0], c[1], sA, gi, phase, leafA);
    if (t.slope) inst[ai].cast = true; // a pine as anchor casts like an anchor
    const aReach = aS.crownR * inst[ai].scale;
    // supports: one small tree, then bush or small tree, sometimes a third (bush)
    const nSup = 3, ga = R() * Math.PI * 2;
    for (let k = 0; k < nSup; k++) {
      const role: EnvRole = k === 0 ? 'smallTree' : k === 1 && R() < 0.4 ? 'smallTree' : 'bush';
      const id = pick(t.slope && role === 'smallTree' ? L.slope : L[role]);
      if (!id) continue;
      const s = sp(id, role), sc = 0.7 + R() * 0.2;
      const d = (aReach + s.crownR * sc) * (role === 'bush' ? 0.62 : 0.55) * (0.9 + R() * 0.25);
      const a = ga + k * 2.1 + (R() - 0.5) * 0.5;
      const p = near(c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, 2, s.footR * sc, collR(s, sc));
      if (p) g.members.push(put(id, role, kit, p[0], p[1], sc, gi, phase, R() < 0.7 ? leafA : leafOf()));
    }
    g.members.unshift(ai);
    // small fillers at the group's rim (size staircase: many small) and one accent (stone or flower)
    const nSmall = 2 + Math.floor(R() * 2);
    for (let k = 0; k <= nSmall; k++) {
      const accent = k === nSmall;
      const role: EnvRole = accent ? ((R() < 0.6 && L.stone) || !L.flower ? 'stone' : 'flower') : R() < 0.6 || (!L.flower && !L.stone) ? 'bush' : (L.flower ? 'flower' : 'stone');
      const id = pick(L[role]);
      if (!id) continue;
      const s = sp(id, role), sc = accent ? 0.9 + R() * 0.3 : 0.7 + R() * 0.3;
      const a = ga + 1.05 + k * 2.3 + (R() - 0.5) * 0.6, d = aReach * (0.75 + R() * 0.35) + s.crownR * sc;
      const p = near(c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, 2, s.footR * sc, collR(s, sc));
      if (p) g.members.push(put(id, role, kit, p[0], p[1], sc, gi, phase, leafOf()));
    }
  }

  // ---------- 2 · transition clusters: bush + stone/flower (+ bush), never single, one kit per cluster ----------
  const k0 = biome.kits[0], L0 = lists(k0);
  /** single elements (path companions, rim) may come from any kit of the biome: first kit that has the role */
  const kitWith = (role: EnvRole): [EnvKit, RoleLists] => { for (const k of biome.kits) { const L = lists(k); if (L[role]?.length) return [k, L]; } return [k0, L0]; };
  const nMini = rad > 40 ? 5 : 4;
  for (let n = 0, made = 0; made < nMini && n < 60; n++) {
    const kM = biome.kits[made % biome.kits.length], LM = lists(kM);
    const a = R() * Math.PI * 2, d = rad * (0.55 + R() * 0.3);
    const bx = cx + Math.cos(a) * d, bz = cz + Math.sin(a) * d;
    const sd = f.sd(bx, bz);
    if (sd < 0.12 * rad || sd > 0.38 * rad) continue;
    if (centres.some(([qx, qz]) => Math.hypot(qx - bx, qz - bz) < 10)) continue;
    const bId = pick(LM.bush);
    if (!bId) break;
    const bS = sp(bId, 'bush'), bsc = 0.8 + R() * 0.3;
    const c = near(bx, bz, 2, bS.footR * bsc, collR(bS, bsc));
    if (!c) continue;
    const gi = groups.length, g: EnvGroup = { id: gi, kind: 'mini', kit: kM, center: c, members: [] };
    groups.push(g);
    centres.push(c);
    const phase = R() * Math.PI * 2;
    g.members.push(put(bId, 'bush', kM, c[0], c[1], bsc, gi, phase, leafOf()));
    for (const role of ['bush', LM.stone ? 'stone' : 'flower', LM.flower ? 'flower' : 'bush'] as EnvRole[]) {
      const id = pick(LM[role]);
      if (!id) continue;
      const s = sp(id, role), sc = 0.7 + R() * 0.4, aa = R() * Math.PI * 2, dd = bS.crownR * bsc * 0.8 + s.crownR * sc;
      const p = near(c[0] + Math.cos(aa) * dd, c[1] + Math.sin(aa) * dd, 1.5, s.footR * sc, collR(s, sc));
      if (p) g.members.push(put(id, role, kM, p[0], p[1], sc, gi, phase, leafOf()));
    }
    if (g.members.length < 2) { // no loners: roll the cluster back
      inst.length = g.members[0]; placed.length = inst.length; groups.pop(); centres.pop();
      continue;
    }
    made++;
  }

  // ---------- 3 · path companions: single small stones / flowers just outside the path zone ----------
  const nPath = 3 + Math.floor(R() * 3);
  for (let k = 0, made = 0; made < nPath && k < 60; k++) {
    const line = f.paths[Math.floor(R() * f.paths.length)];
    if (!line || line.length < 3) continue;
    const i = 1 + Math.floor(R() * (line.length - 2));
    const [ax, az] = line[i - 1], [bx, bz] = line[i + 1];
    let nx = -(bz - az), nz = bx - ax;
    const L = Math.hypot(nx, nz) || 1, side = R() < 0.5 ? -1 : 1;
    nx = (nx / L) * side; nz = (nz / L) * side;
    const [kP, LP] = kitWith(R() < 0.65 ? 'stone' : 'flower');
    const role: EnvRole = LP.stone && (R() < 0.65 || !LP.flower) ? 'stone' : 'flower';
    const id = pick(LP[role]);
    if (!id) break;
    const s = sp(id, role), sc = 0.7 + R() * 0.3, hw = f.pathW[f.paths.indexOf(line)] / 2;
    const x = line[i][0] + nx * (hw + 1.6 + s.footR * sc + R()), z = line[i][1] + nz * (hw + 1.6 + s.footR * sc + R());
    if (!ok(x, z, s.footR * sc) || !clear(x, z, collR(s, sc))) continue;
    const gi = groups.length;
    groups.push({ id: gi, kind: 'path', kit: kP, center: [x, z], members: [put(id, role, kP, x, z, sc, gi, R() * 6.28, leafOf())] });
    made++;
  }

  // ---------- 4 · rim: 2–4 rocks on the edge, breaking the silhouette ----------
  const nRim = 2 + Math.floor(R() * 3);
  for (let k = 0, made = 0; made < nRim && k < 80; k++) {
    const i = Math.floor(R() * f.poly.length), [ex, ez] = f.poly[i];
    const dx = cx - ex, dz = cz - ez, L = Math.hypot(dx, dz) || 1;
    const x = ex + (dx / L) * (0.6 + R() * 0.8), z = ez + (dz / L) * (0.6 + R() * 0.8);
    if (Math.hypot(x - f.connector.x, z - f.connector.z) < 10) continue; // keep the track / bridge arrival free
    const [kR, LR] = kitWith('rimRock');
    const id = pick(LR.rimRock);
    if (!id) break;
    const s = sp(id, 'rimRock'), sc = 0.7 + R() * 0.5;
    if (!ok(x, z, s.footR * sc * 0.5, true) || !clear(x, z, Math.max(collR(s, sc), 5))) continue;
    const gi = groups.length;
    groups.push({ id: gi, kind: 'rim', kit: kR, center: [x, z], members: [put(id, 'rimRock', kR, x, z, sc, gi, R() * 6.28, 0)] });
    made++;
  }
  return { inst, groups };
}
