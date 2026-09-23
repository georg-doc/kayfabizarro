/* KFB WorldDesign Lab v1 · Voxel-Gelände über den Voxel-Zone-S2-Owner
   Der Voxel-Look (Referenz „VOXEL LOOK 01") wird NICHT nachgebaut: Material, Varianz, Palette
   und Tusche kommen wörtlich aus `tools/KFB-ToolBox/_inbox/KFB Voxel Zone S2/
   voxel-zone-s2-full_2026-09-22/`:
     kfb-box-material.js   makeBoxGeometry · makeVariedBoxMaterial · writeVariation · tintFor · rnd
     terrain/world-context.js   STORY_PALETTES · MODES (Tinte je Story-Modus)
     kfb-ink-outline.js    createInkOutline (Sobel über Tiefe + Normalen)
   Übernommen aus `KFB Voxel Zone S2.dc.html` build()/applyPalette(): Säulen als skalierte
   Einheitsboxen, Material-Zuordnung nach Feld+Höhe (matOf), Tint über die Höhenrampe hoch 1.7,
   Stärke 0.85, Fuge 0.26/0.07, Streifen 0.26, Schraffur 0.3, Bänder 4/0.4.
   NICHT übernommen: edge3-Kachel und Korn-Map — `loadKfbTextures()` liest relative Manifeste
   (`./kfb-textures.json`), die im Export fehlen. Die prozedurale Seite des Owners braucht sie nicht.
   Neu hier (MISSING_DELTA): die Säulenhöhen kommen aus dem Laborgelände, damit die Spender auf
   Säulenkronen stehen. */

import * as THREE from 'three';
import { ownerImport } from './wd-donors.js';

export const VZ = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/_inbox/KFB%20Voxel%20Zone%20S2/voxel-zone-s2-full_2026-09-22/';
export const MODE_LABELS = ['TRAGIC', 'COMIC', 'ABSURD', 'HEROIC', 'MYSTICAL', 'FORBIDDEN'];

let ownerP = null;
export function owner() {
  if (!ownerP) {
    ownerP = Promise.all([
      ownerImport(VZ + 'kfb-box-material.js'),
      ownerImport(VZ + 'terrain/world-context.js'),
      ownerImport(VZ + 'kfb-ink-outline.js')
    ]).then(([M, WC, INK]) => ({ M, WC, INK })).catch((e) => { ownerP = null; throw e; });
  }
  return ownerP;
}

function noise2(x, z, s) {
  const h = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
  const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = h(xi, zi), b = h(xi + 1, zi), c = h(xi, zi + 1), d = h(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/* heightAt kommt aus wd-terrain (natürliches Höhenfeld mit Standflächen) */
export async function makeVoxel(heightAt, area, opts = {}) {
  const { M, WC } = await owner();
  const mode = opts.mode ?? 2;
  const seed = opts.seed ?? 11;
  const { cx, cz, W, D } = area;
  const nx = Math.round(W), nz = Math.round(D);
  const x0 = Math.round(cx - nx / 2), z0 = Math.round(cz - nz / 2);
  const BASE = -3;
  const cols = [];
  let minH = 1e9, maxH = -1e9;
  for (let ix = 0; ix < nx; ix++) for (let iz = 0; iz < nz; iz++) {
    const x = x0 + ix + 0.5, z = z0 + iz + 0.5;
    const h = Math.round(heightAt(x, z));
    const f = noise2(x * 0.085, z * 0.085, 3) * 0.66 + noise2(x * 0.21, z * 0.21, 7) * 0.34;
    cols.push({ x, z, h, f });
    minH = Math.min(minH, h); maxH = Math.max(maxH, h);
  }
  const span = Math.max(1, maxH - minH);
  /* matOf() aus KFB Voxel Zone S2.dc.html, wörtlich: Feld 65 % + Höhe 35 % */
  const matOf = (c) => {
    const t = c.f * 0.65 + ((c.h - minH) / span) * 0.35;
    if (t < 0.22) return 3;
    if (t < 0.42) return 2;
    if (t < 0.62) return 1;
    if (t < 0.84) return 0;
    return 4;
  };
  const geo = M.makeBoxGeometry(THREE, cols.length, 1);
  const mat = M.makeVariedBoxMaterial(THREE, {
    edgeMap: null, edgeStrength: 0, grainMap: null, grain: 0,
    roughness: 0.9, bands: 4, bandAmount: opts.bandAmount ?? 0.4,
    seam: opts.seam ?? 0.26, seamWidth: 0.07, stripe: 0.26, hatch: opts.hatch ?? 0.3, wobble: 0
  });
  const mesh = new THREE.InstancedMesh(geo, mat, cols.length);
  mesh.name = 'terrain:voxel';
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.kfbSkip = true;
  const m4 = new THREE.Matrix4();
  const stops = WC.STORY_PALETTES[mode].c;
  cols.forEach((c, i) => {
    const hc = c.h - BASE;
    m4.makeScale(1, hc, 1);
    m4.setPosition(c.x, BASE, c.z);
    mesh.setMatrixAt(i, m4);
    M.writeVariation(geo, i, seed + ':wd', { variation: 1, brightRange: opts.brightRange ?? 0.4, heightCells: hc, field: c.f, mat: matOf(c) });
    const t = Math.pow(Math.min(1, (c.h - minH) / span), 1.7);
    mesh.setColorAt(i, M.tintFor(THREE, stops, t, seed, i, { variation: 1, strength: 0.85 }));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  const ink = new THREE.Color(WC.MODES[mode].ink).lerp(new THREE.Color(0x1a1412), 0.65);
  return {
    mesh, cols: cols.length, ink, stops,
    top: (x, z) => Math.round(heightAt(x, z)),
    label: 'Voxel Zone S2 · ' + MODE_LABELS[mode] + ' · ' + cols.length + ' Säulen'
  };
}
