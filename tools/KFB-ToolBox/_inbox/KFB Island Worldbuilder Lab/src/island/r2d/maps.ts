// Colour map + mask map in top-down UV over the island (R2D v0 island.js `paintMaps`, Z. 259–285, 1:1).
// The colour map carries only the grass patches (fbm 0.07: > 0.14 grass2, < −0.32 hill, else grass); sand, paving and
// rock come as speckle layers in the shader. The mask map draws the plan (road, paths, plazas, pads, water) and gives
// the area per mask.
import * as THREE from 'three';
import { fbm, vnoise, sstep, type P2 } from './math';
import type { R2DPlan } from './fields';
import type { R2DPal } from '../../palettes';

export const MASK: Record<string, [string, string]> = {
  road: ['Fahrbahn + Sicherheitsrand', '#e2522a'], walk: ['Gehwege', '#f29a2e'], interact: ['Bewohner-/Interaktionsplatz', '#f2d24a'],
  building: ['Gebäude/Landmarke', '#4f7bd9'], veg: ['Vegetation/Props', '#5aa84a'], water: ['Wasser + Ufer', '#3f8fd6'],
  edge: ['Inselrand, Absturzsicherheit', '#8a4fc4'], under: ['Unterseite', '#6b6f78'],
};
const hexRGB = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

export interface IslandMaps { world: THREE.CanvasTexture; mask: THREE.CanvasTexture; areas: Record<string, number>; worldData: Uint8ClampedArray; N: number }

export function paintMaps(P: R2DPlan, pal: R2DPal, box: { minX: number; minZ: number; W: number }, N = 1024, roadPolys: P2[][] = [], rimBand = 3): IslandMaps {
  const seed = P.seed, px = (wx: number, wz: number) => [((wx - box.minX) / box.W) * N, ((wz - box.minZ) / box.W) * N], m2px = (m: number) => (m / box.W) * N;
  const mkc = () => { const c = document.createElement('canvas'); c.width = c.height = N; return c; };
  const cw = mkc(), cm = mkc(), xw = cw.getContext('2d')!, xm = cm.getContext('2d')!;
  const iw = xw.createImageData(N, N), im = xm.createImageData(N, N);
  const G = hexRGB(pal.grass), G2 = hexRGB(pal.grass2), HL = hexRGB(pal.hill), MV = hexRGB(MASK.veg[1]), ME = hexRGB(MASK.edge[1]), MU = hexRGB(MASK.under[1]);
  // patch size: R2D 0.07 (≈ 14 units); on small bodies (fragments) finer, or one boundary crosses the whole piece like a cut
  const pf = 0.07 * Math.max(1, 70 / box.W);
  for (let j = 0; j < N; j++) {
    const wz = box.minZ + ((j + 0.5) / N) * box.W;
    for (let i = 0; i < N; i++) {
      const wx = box.minX + ((i + 0.5) / N) * box.W, e = -P.sdf(wx, wz), o = (j * N + i) * 4;
      let c: number[], m: number[];
      // Lab change: the patches shrink and end before the rim (hard patch edges curve away inside the band), so the roll
      // and the Scholle top are plain base grass. Top-down patches on the steep roll stretched into vertical colour
      // blocks (Lauf 02 N6); plain grass outside without the band drew a colour line along the rim (Lauf 01).
      const n = (fbm(wx * pf, wz * pf, seed + 21, 3) + 0.05 * vnoise(wx * 1.4, wz * 1.4, seed + 99)) * sstep(0, rimBand, e);
      c = n > 0.14 ? G2 : n < -0.32 ? HL : G;
      m = e < 0 ? MU : e < 2.2 ? ME : MV;
      iw.data[o] = c[0]; iw.data[o + 1] = c[1]; iw.data[o + 2] = c[2]; iw.data[o + 3] = 255;
      im.data[o] = m[0]; im.data[o + 1] = m[1]; im.data[o + 2] = m[2]; im.data[o + 3] = 255;
    }
  }
  xw.putImageData(iw, 0, 0); xm.putImageData(im, 0, 0);
  const ragged = (x: CanvasRenderingContext2D, cx: number, cz: number, r: number, s: number) => {
    x.beginPath();
    for (let k = 0; k <= 64; k++) { const a = (k / 64) * Math.PI * 2, rr = r * (1 + 0.07 * vnoise(Math.cos(a) * 2 + s, Math.sin(a) * 2, seed + 61)), [u, v] = px(cx + Math.cos(a) * rr, cz + Math.sin(a) * rr); if (k) x.lineTo(u, v); else x.moveTo(u, v); }
    x.closePath(); x.fill();
  };
  const stroke = (x: CanvasRenderingContext2D, pts: P2[], wM: number, col: string) => {
    x.strokeStyle = col; x.lineWidth = m2px(wM); x.lineCap = x.lineJoin = 'round'; x.beginPath();
    pts.forEach((p, k) => { const [u, v] = px(p[0], p[1]); if (k) x.lineTo(u, v); else x.moveTo(u, v); }); x.stroke();
  };
  // mask map: road mask polygons (kfb.road-bed/1), paths, plazas, pads, pond
  xm.fillStyle = MASK.road[1];
  for (const poly of roadPolys) { xm.beginPath(); poly.forEach((p, k) => { const [u, v] = px(p[0], p[1]); if (k) xm.lineTo(u, v); else xm.moveTo(u, v); }); xm.closePath(); xm.fill(); }
  for (const s of P.paths) stroke(xm, s.pts, s.w, MASK.walk[1]);
  xm.fillStyle = MASK.interact[1]; P.plazas.forEach((p, k) => ragged(xm, p.x, p.z, p.r, k * 3.1));
  xm.fillStyle = MASK.building[1]; P.pads.forEach((p, k) => ragged(xm, p.x, p.z, p.r, 7 + k * 3.1));
  if (P.pond) { xm.fillStyle = MASK.water[1]; ragged(xm, P.pond.x, P.pond.z, P.pond.r + 1.5, 13); }
  const areas: Record<string, number> = {}, d = xm.getImageData(0, 0, N, N).data, pal7 = Object.entries(MASK).map(([k, v]) => [k, hexRGB(v[1])] as const), a1 = (box.W / N) ** 2;
  for (let o = 0; o < d.length; o += 16) {
    let bk = '', bd = 1e9;
    for (const [k, c] of pal7) { const dd = Math.abs(d[o] - c[0]) + Math.abs(d[o + 1] - c[1]) + Math.abs(d[o + 2] - c[2]); if (dd < bd) { bd = dd; bk = k; } }
    areas[bk] = (areas[bk] || 0) + 4 * a1;
  }
  for (const k of Object.keys(areas)) areas[k] = Math.round(areas[k]);
  // flipY false: canvas row j is z = minZ + j·step and the UV is v = (z − minZ) / W. R2D v0 kept three's default
  // flipY = true, which mirrored the map in z (patches of the far side on the roll, rim band in the wrong place).
  const tex = (c: HTMLCanvasElement) => { const t = new THREE.CanvasTexture(c); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t; };
  return { world: tex(cw), mask: tex(cm), areas, worldData: iw.data, N };
}
