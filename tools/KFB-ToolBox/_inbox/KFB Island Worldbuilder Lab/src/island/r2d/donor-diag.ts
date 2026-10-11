// Diagnose Stufe 1 Lauf 03 Schritt 0: the donor's own R2D plan (exported from R2D v0 via __r2d._plan(), public/
// donor-plans.r2d.json) built through the lab pipeline (terrain mesh, maps, Scholle v7, S1 material, world light),
// without `form`. k > 1 scales outline, road and places by k but keeps hills in world units (= R2D at Town size).
import * as THREE from 'three';
import { fbm, smin, distSeg, lerp, type P2 } from './math';
import { makeNatural } from './plan';
import { makeForm } from './form';
import { fields, type R2DPlan } from './fields';
import { buildR2DGround } from './ground';
import { edgeFor } from './terrain-mesh';
import { R2D_BIOMES } from '../../palettes';
import type { IslandSpec } from '../spec';

export interface DonorPlan {
  seed: number; biome: string; terr: { amp: number; fq: number; terrace: number; roll: [number, number] };
  cells: { xz: P2; rad: number }[]; c0: P2; NA: number; edgeR: number[];
  road: { poly: P2[]; hw: number; y: number }; pads: any[]; plazas: any[]; paths: P2[][];
  pond: { x: number; z: number; r: number; h: number } | null;
  creek: { pts: P2[]; w: number; cross: P2 | null } | null;
}

export function donorGround(D: DonorPlan, k = 1) {
  const s = (p: P2): P2 => [p[0] * k, p[1] * k], seed = D.seed;
  const sdf0 = (x: number, z: number) => { let d = 1e9; for (const c of D.cells) d = smin(d, Math.hypot(x - c.xz[0], z - c.xz[1]) - c.rad, 9); return d + 2.2 * fbm(x * 0.04, z * 0.04, seed + 3) - 0.4; };
  const sdf = (x: number, z: number) => k * sdf0(x / k, z / k);
  const c0 = s(D.c0), NA = k === 1 ? D.NA : Math.max(192, Math.round(D.NA * k / 32) * 32), edgeR = new Float32Array(NA);
  for (let a = 0; a < NA; a++) {
    const th = (a / NA) * Math.PI * 2, cx = Math.cos(th), cz = Math.sin(th); let r = 0;
    while (r < 95 * k && sdf(c0[0] + cx * r, c0[1] + cz * r) < 0) r += 0.5;
    let lo = Math.max(0, r - 0.5), hi = r; for (let j = 0; j < 7; j++) { const m = (lo + hi) / 2; if (sdf(c0[0] + cx * m, c0[1] + cz * m) < 0) lo = m; else hi = m; }
    edgeR[a] = lo;
  }
  const rAt = (th: number) => { const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, i = Math.floor(f), t = f - i; return lerp(edgeR[i % NA], edgeR[(i + 1) % NA], t); };
  const natural = makeNatural(D.terr, seed), poly = D.road.poly.map(s);
  const roadDist = (x: number, z: number) => { let b = 1e9; for (let i = 0; i < poly.length - 1; i++) { const d = distSeg(x, z, poly[i], poly[i + 1]); if (d < b) b = d; } return b; };
  const sc = (p: any) => ({ ...p, x: p.x * k, z: p.z * k, r: p.r * k });
  const cp = D.creek ? D.creek.pts.map(s) : null;
  const plan: R2DPlan & { form: ReturnType<typeof makeForm> } = {
    seed, sdf, c0, NA, edgeR, rAt, roll: D.terr.roll, natural,
    pads: D.pads.map(sc), plazas: D.plazas.map(sc), paths: D.paths.map((p) => ({ pts: p.map(s), w: 2.8 })),
    road: (x, z) => ({ d: roadDist(x, z), hw: D.road.hw, y: D.road.y }), slopeW: () => 7,
    pond: D.pond ? sc(D.pond) : null,
    creek: D.creek && cp ? { pts: cp, w: D.creek.w, cross: D.creek.cross ? s(D.creek.cross) : null, dist: (x, z) => { let b = 1e9; for (let i = 0; i < cp.length - 1; i++) { const d = distSeg(x, z, cp[i], cp[i + 1]); if (d < b) b = d; } return b; } } : null,
    form: makeForm(undefined, seed, c0),
  };
  const palette = D.biome === 'protopia' ? 'protopia' : 'kfb_town';
  const spec = { id: 'donor-' + D.biome + (k === 1 ? '' : '-x' + k), palette, seed, buildings: [], terrain: {} } as unknown as IslandSpec;
  const f = { plan, F: fields(plan, () => []), biomeRow: R2D_BIOMES[palette], road: null } as any;
  f.edge = new URLSearchParams(location.search).get('edgeFixed') === '1' ? { ...f.biomeRow.edge, k: 1 } : edgeFor(f.biomeRow.edge, edgeR);
  const g = buildR2DGround(f, spec), group = new THREE.Group();
  group.name = 'donor-diag'; for (const m of g.meshes) group.add(m);
  return { group, ground: g, plan };
}
