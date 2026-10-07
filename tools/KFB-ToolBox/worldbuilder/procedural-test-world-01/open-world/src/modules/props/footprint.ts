// Ground footprints of village buildings (asset-local metres), used so props hug walls without ever intersecting them.
//
// Every triangle of the model below CAP is sampled into a GRID column heightmap; columns with geometry above FLOOR
// are solid, then the outside is flood-filled over empty columns, so anything enclosed by walls (the interior) counts
// as solid too. Eaves / roofs above CAP do not shape the footprint (a crate may stand under an eave).
import * as THREE from 'three';
import type { StaticAsset } from '../../core/types';

export const GRID = 0.15; // m
const CAP = 2.0; // m: geometry above this never blocks a prop
const FLOOR = 0.04; // m: thinner plates (ground decals) do not block

export interface Footprint {
  minX: number;
  minZ: number;
  nx: number;
  nz: number;
  /** 1 = solid column */
  solid: Uint8Array;
  /** solid extents (m) */
  box: { x0: number; x1: number; z0: number; z1: number };
}

export function buildFootprint(a: StaticAsset): Footprint {
  const b = a.bounds;
  const pad = 2;
  const minX = b.min.x - pad * GRID, minZ = b.min.z - pad * GRID;
  const nx = Math.ceil((b.max.x - b.min.x) / GRID) + pad * 2 + 1;
  const nz = Math.ceil((b.max.z - b.min.z) / GRID) + pad * 2 + 1;
  const H = new Float32Array(nx * nz).fill(-1);
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), p = new THREE.Vector3();
  for (const part of a.parts) {
    const pos = part.geometry.attributes.position;
    const idx = part.geometry.index;
    const tri = idx ? idx.count / 3 : pos.count / 3;
    for (let t = 0; t < tri; t++) {
      const i0 = idx ? idx.getX(t * 3) : t * 3, i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
      v0.fromBufferAttribute(pos, i0).applyMatrix4(part.matrix);
      v1.fromBufferAttribute(pos, i1).applyMatrix4(part.matrix);
      v2.fromBufferAttribute(pos, i2).applyMatrix4(part.matrix);
      if (Math.min(v0.y, v1.y, v2.y) > CAP) continue;
      const e = Math.max(v0.distanceTo(v1), v1.distanceTo(v2), v2.distanceTo(v0));
      const n = Math.min(80, Math.max(1, Math.ceil(e / (GRID * 0.5))));
      for (let i = 0; i <= n; i++)
        for (let j = 0; j <= n - i; j++) {
          const u = i / n, w = j / n;
          p.copy(v0).multiplyScalar(1 - u - w).addScaledVector(v1, u).addScaledVector(v2, w);
          if (p.y > CAP) continue;
          const gx = Math.floor((p.x - minX) / GRID), gz = Math.floor((p.z - minZ) / GRID);
          if (gx < 0 || gz < 0 || gx >= nx || gz >= nz) continue;
          const k = gz * nx + gx;
          if (p.y > H[k]) H[k] = p.y;
        }
    }
  }
  const outside = new Uint8Array(nx * nz);
  const stack: number[] = [];
  for (let x = 0; x < nx; x++) stack.push(x, (nz - 1) * nx + x);
  for (let z = 0; z < nz; z++) stack.push(z * nx, z * nx + nx - 1);
  while (stack.length) {
    const k = stack.pop()!;
    if (outside[k] || H[k] > FLOOR) continue;
    outside[k] = 1;
    const x = k % nx, z = (k / nx) | 0;
    if (x > 0) stack.push(k - 1);
    if (x < nx - 1) stack.push(k + 1);
    if (z > 0) stack.push(k - nx);
    if (z < nz - 1) stack.push(k + nx);
  }
  const solid = new Uint8Array(nx * nz);
  const box = { x0: Infinity, x1: -Infinity, z0: Infinity, z1: -Infinity };
  for (let k = 0; k < nx * nz; k++) {
    if (outside[k]) continue;
    solid[k] = 1;
    const x = minX + ((k % nx) + 0.5) * GRID, z = minZ + (((k / nx) | 0) + 0.5) * GRID;
    box.x0 = Math.min(box.x0, x); box.x1 = Math.max(box.x1, x);
    box.z0 = Math.min(box.z0, z); box.z1 = Math.max(box.z1, z);
  }
  return { minX, minZ, nx, nz, solid, box };
}

/** Is the local point (m) inside the footprint, dilated by `r` metres? */
export function fpHit(f: Footprint, x: number, z: number, r: number): boolean {
  const k = Math.ceil(r / GRID);
  const gx = Math.floor((x - f.minX) / GRID), gz = Math.floor((z - f.minZ) / GRID);
  for (let dz = -k; dz <= k; dz++) {
    const zz = gz + dz;
    if (zz < 0 || zz >= f.nz) continue;
    for (let dx = -k; dx <= k; dx++) {
      const xx = gx + dx;
      if (xx < 0 || xx >= f.nx) continue;
      if (!f.solid[zz * f.nx + xx]) continue;
      // distance from the point to the cell square
      const cx = f.minX + (xx + 0.5) * GRID, cz = f.minZ + (zz + 0.5) * GRID;
      const ddx = Math.max(0, Math.abs(x - cx) - GRID / 2), ddz = Math.max(0, Math.abs(z - cz) - GRID / 2);
      if (ddx * ddx + ddz * ddz <= r * r) return true;
    }
  }
  return false;
}
