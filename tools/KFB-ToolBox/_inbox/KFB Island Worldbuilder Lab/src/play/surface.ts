// Stufe 2 · walk surface from the built meshes (island ground + RKIT road parts): the walker asks heights by x/z many times per
// frame, so the triangles go once into an x/z grid and a query only tests its cell (no raycaster, no BVH). The highest
// surface counts; a barrier (RKIT `bande_*`) on top is a wall for the walker, not ground — except triangles whose three vertices carry
// aWalk = 1 (C4a: the B7 bay's gutter / kerb / platform / foot live inside the J17 strand mesh).
import * as THREE from 'three';

export interface SurfaceHit { y: number; role: string; wall: boolean }

export function buildSurfaceField(meshes: THREE.Mesh[], cell = 4, isWall: (role: string) => boolean = (r) => /^bande/.test(r)) {
  const grid = new Map<number, number[]>(), P: number[] = [], roles: string[] = [], triRole: number[] = [], triWalk: number[] = [];
  const key = (i: number, j: number) => (i + 32768) * 65536 + (j + 32768);
  const v = new THREE.Vector3();
  for (const m of meshes) {
    m.updateWorldMatrix(true, false);
    const g = m.geometry, pos = g.attributes.position, idx = g.index, n = idx ? idx.count : pos.count;
    const role = m.userData.rkitRole ?? m.name, ri = roles.push(role) - 1, base = P.length / 3;
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld); P.push(v.x, v.y, v.z); }
    for (let t = 0; t < n; t += 3) {
      const a = base + (idx ? idx.getX(t) : t), b = base + (idx ? idx.getX(t + 1) : t + 1), c = base + (idx ? idx.getX(t + 2) : t + 2);
      const tri = triRole.push(ri) - 1, wk = g.attributes.aWalk; triWalk.push(wk && wk.getX(a - base) > 0.5 && wk.getX(b - base) > 0.5 && wk.getX(c - base) > 0.5 ? 1 : 0);
      const x0 = Math.min(P[a * 3], P[b * 3], P[c * 3]), x1 = Math.max(P[a * 3], P[b * 3], P[c * 3]), z0 = Math.min(P[a * 3 + 2], P[b * 3 + 2], P[c * 3 + 2]), z1 = Math.max(P[a * 3 + 2], P[b * 3 + 2], P[c * 3 + 2]);
      for (let i = Math.floor(x0 / cell); i <= Math.floor(x1 / cell); i++) for (let j = Math.floor(z0 / cell); j <= Math.floor(z1 / cell); j++) {
        const k = key(i, j); let L = grid.get(k); if (!L) grid.set(k, (L = [])); L.push(a, b, c, tri);
      }
    }
  }
  const at = (x: number, z: number): SurfaceHit | null => {
    const L = grid.get(key(Math.floor(x / cell), Math.floor(z / cell))); if (!L) return null;
    let best = -Infinity, br = -1, bw = 0;
    for (let q = 0; q < L.length; q += 4) {
      const a = L[q] * 3, b = L[q + 1] * 3, c = L[q + 2] * 3;
      const ax = P[a], az = P[a + 2], bx = P[b], bz = P[b + 2], cx = P[c], cz = P[c + 2];
      const d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz); if (Math.abs(d) < 1e-12) continue;   // vertical triangle: no top
      const w0 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d, w1 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d, w2 = 1 - w0 - w1;
      if (w0 < -1e-6 || w1 < -1e-6 || w2 < -1e-6) continue;
      const y = w0 * P[a + 1] + w1 * P[b + 1] + w2 * P[c + 1];
      if (y > best) { best = y; br = triRole[L[q + 3]]; bw = triWalk[L[q + 3]]; }
    }
    if (br < 0) return null;
    const role = roles[br]; return { y: best, role: bw ? role + ':walk' : role, wall: isWall(role) && !bw };
  };
  return { at, cells: grid.size, tris: triRole.length };
}
