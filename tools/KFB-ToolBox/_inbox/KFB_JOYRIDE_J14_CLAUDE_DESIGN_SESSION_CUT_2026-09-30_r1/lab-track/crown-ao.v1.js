/* KFB crown-ao.v1 (30.09.) · Kronen-Verdeckung als Geometrie, nicht als Schatten.
 * Befund J13: die Kronen werfen Schatten (Probe cast an/aus), aber eine Shadow-Map (7 cm Texel, PCF, normalBias 9 cm)
 * kann die Kehle zwischen zwei Kronenstufen und den Stammkopf unter der Krone nicht auflösen → helle Naht.
 * Deshalb wird die Verdeckung je Vertex gebacken und über vertexColors multipliziert:
 *   voxelAO  · Tiny-Treats-Baum (tree_large): einmal an der Quelle, alle Klone erben es
 *   sphereAO · T4-Kugelbaum: die Kugeln sind bekannt, also analytisch (Kugel-Verdeckung r²/d² · cos) */

const setAO = (THREE, g, ao) => { const n = ao.length, old = g.attributes.color, c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) c[i * 3 + j] = ao[i] * (old ? old.getComponent(i, j) : 1);
  g.setAttribute('color', new THREE.BufferAttribute(c, 3)); };

export function voxelAO(THREE, g, { res = 44, rays = 28, reach = 0.35, strength = 1.0, min = 0.32 } = {}) {
  if (!g.attributes.normal) g.computeVertexNormals();
  g.computeBoundingBox(); const b = g.boundingBox, sz = b.getSize(new THREE.Vector3()), vs = Math.max(sz.x, sz.y, sz.z) / res;
  const nx = Math.ceil(sz.x / vs) + 4, ny = Math.ceil(sz.y / vs) + 4, nz = Math.ceil(sz.z / vs) + 4, o = b.min.clone().subScalar(2 * vs);
  const V = new Uint8Array(nx * ny * nz), id = (x, y, z) => x + nx * (y + ny * z);
  const p = g.attributes.position, idx = g.index ? g.index.array : null, nT = (idx ? idx.length : p.count) / 3, A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), q = new THREE.Vector3();
  for (let t = 0; t < nT; t++) { A.fromBufferAttribute(p, idx ? idx[3 * t] : 3 * t); B.fromBufferAttribute(p, idx ? idx[3 * t + 1] : 3 * t + 1); C.fromBufferAttribute(p, idx ? idx[3 * t + 2] : 3 * t + 2);
    const L = Math.max(A.distanceTo(B), B.distanceTo(C), C.distanceTo(A)), m = Math.max(1, Math.ceil(L / (vs * 0.5)));
    for (let i = 0; i <= m; i++) for (let j = 0; j <= m - i; j++) { const u = i / m, w = j / m; q.copy(A).multiplyScalar(1 - u - w).addScaledVector(B, u).addScaledVector(C, w);
      V[id(Math.floor((q.x - o.x) / vs), Math.floor((q.y - o.y) / vs), Math.floor((q.z - o.z) / vs))] = 1; } }
  { const st = [0]; V[0] = 2; while (st.length) { const k = st.pop(), x = k % nx, y = ((k / nx) | 0) % ny, z = (k / (nx * ny)) | 0;   // Außenraum fluten, Rest = Masse
      for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) { const X = x + dx, Y = y + dy, Z = z + dz; if (X < 0 || Y < 0 || Z < 0 || X >= nx || Y >= ny || Z >= nz) continue; const kk = id(X, Y, Z); if (V[kk] === 0) { V[kk] = 2; st.push(kk); } } } }
  const solid = (x, y, z) => { const X = Math.floor((x - o.x) / vs), Y = Math.floor((y - o.y) / vs), Z = Math.floor((z - o.z) / vs); if (X < 0 || Y < 0 || Z < 0 || X >= nx || Y >= ny || Z >= nz) return false; return V[id(X, Y, Z)] !== 2; };
  const D = []; for (let k = 0; k < rays; k++) { const y = 1 - (k + 0.5) / rays, r = Math.sqrt(1 - y * y), a = k * 2.399963; D.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)); }   // Fibonacci-Halbkugel um +Y
  const n = g.attributes.normal, N = new THREE.Vector3(), Q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3(), P = new THREE.Vector3(), steps = Math.ceil(reach * Math.max(sz.x, sz.y, sz.z) / vs), ao = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) { N.fromBufferAttribute(n, i).normalize(); Q.setFromUnitVectors(up, N); P.fromBufferAttribute(p, i).addScaledVector(N, vs * 1.6); let occ = 0, wsum = 0;
    for (const r of D) { d.copy(r).applyQuaternion(Q); const cw = d.dot(N); wsum += cw;
      for (let s = 1; s <= steps; s++) { const f = s * vs; if (solid(P.x + d.x * f, P.y + d.y * f, P.z + d.z * f)) { occ += cw * (1 - 0.5 * s / steps); break; } } }
    ao[i] = Math.max(min, 1 - strength * occ / Math.max(1e-6, wsum)); }
  setAO(THREE, g, ao); return { vs: +vs.toFixed(3), steps, verts: p.count };
}

/* spheres: [{ c: Vector3, r, self }] · selfIdx: diese Kugel zählt für g nicht (eigene Krone) */
export function sphereAO(THREE, g, spheres, selfIdx = -1, { k = 0.95, min = 0.34 } = {}) {
  if (!g.attributes.normal) g.computeVertexNormals();
  const p = g.attributes.position, n = g.attributes.normal, P = new THREE.Vector3(), N = new THREE.Vector3(), v = new THREE.Vector3(), ao = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) { P.fromBufferAttribute(p, i); N.fromBufferAttribute(n, i).normalize(); let occ = 0;
    spheres.forEach((S, j) => { if (j === selfIdx) return; v.copy(S.c).sub(P); const d = v.length(); if (d < S.r * 0.98) { occ += 1; return; } occ += (S.r * S.r) / (d * d) * Math.max(0, N.dot(v) / d); });
    ao[i] = Math.max(min, 1 - k * Math.min(1, occ)); }
  setAO(THREE, g, ao);
}

/* mergeGeometries braucht gleiche Attribute: fehlende Farbe = weiß */
export function ensureColor(THREE, list) { if (!list.some(g => g.attributes.color)) return;
  for (const g of list) if (!g.attributes.color) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(1), 3)); }
