// Stufe 2 · road-end closures for test drives (Steuerung 10.10.: no open road cut in frame; a built closure from RKIT's parts).
// RKIT ships its barrier runs merged per material (BANDE_* nodes: bande_rot / bande_weiss); single rolls are split out by
// connected geometry, their long axis found in x/z, and laid end to end across the full road width (outer profile points),
// alternating red / white, standing on the road profile. Materials are the island's own RKIT clay materials.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

interface Roll { geo: THREE.BufferGeometry; len: number }

/** the largest connected piece of a merged run, in its own frame: long axis → x, centred in x/z, base at y = 0 */
function splitRoll(src: THREE.BufferGeometry): Roll | null {
  const g = mergeVertices(src.clone().deleteAttribute('normal').deleteAttribute('uv'), 1e-4), idx = g.index!, pos = g.attributes.position;
  const par = new Int32Array(pos.count).map((_, i) => i), find = (i: number): number => { while (par[i] !== i) i = par[i] = par[par[i]]; return i; };
  for (let t = 0; t < idx.count; t += 3) { const a = find(idx.getX(t)), b = find(idx.getX(t + 1)), c = find(idx.getX(t + 2)); par[b] = a; par[c] = a; }
  const tris = new Map<number, number[]>();
  for (let t = 0; t < idx.count; t += 3) { const r = find(idx.getX(t)); (tris.get(r) ?? tris.set(r, []).get(r)!).push(idx.getX(t), idx.getX(t + 1), idx.getX(t + 2)); }
  const pieces = [...tris.values()].sort((p, q) => q.length - p.length);
  const T = pieces[Math.min(pieces.length - 1, Math.floor(pieces.length / 2))];   // a typical roll, not a merged corner piece
  if (!T) return null;
  const vs = [...new Set(T)], P = vs.map((i) => new THREE.Vector3().fromBufferAttribute(pos, i));
  const c = P.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(P.length);
  let xx = 0, zz = 0, xz = 0; for (const p of P) { const dx = p.x - c.x, dz = p.z - c.z; xx += dx * dx; zz += dz * dz; xz += dx * dz; }
  const ang = 0.5 * Math.atan2(2 * xz, xx - zz);   // principal axis in x/z
  const remap = new Map(vs.map((v, k) => [v, k])), arr = new Float32Array(vs.length * 3), ca = Math.cos(-ang), sa = Math.sin(-ang);
  let minY = Infinity, minX = Infinity, maxX = -Infinity;
  P.forEach((p, k) => { const dx = p.x - c.x, dz = p.z - c.z, x = dx * ca - dz * sa, z = dx * sa + dz * ca; arr.set([x, p.y, z], k * 3); minY = Math.min(minY, p.y); minX = Math.min(minX, x); maxX = Math.max(maxX, x); });
  for (let k = 0; k < vs.length; k++) arr[k * 3 + 1] -= minY;
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(arr, 3)); geo.setIndex(T.map((v) => remap.get(v)!)); geo.computeVertexNormals();
  return { geo, len: maxX - minX };
}

/** closures across the road: centre p (lab), tangent T, half the outer road width, road height by lateral offset along (−T.z, 0, T.x) */
export async function placeRoadEndClosures(scene: THREE.Scene, islandGroup: THREE.Object3D, glbUrl: string,
  ends: { p: THREE.Vector3; T: THREE.Vector3; half: number; yAt: (lat: number) => number }[]) {
  const gltf = await new GLTFLoader().loadAsync(glbUrl);
  const src: Record<string, THREE.BufferGeometry> = {};
  gltf.scene.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh || !/^BANDE_L_0/.test(m.parent?.name || m.name)) return; const n = (m.material as THREE.Material).name; if (/bande_(rot|weiss)/.test(n) && !src[n]) src[n] = m.geometry; });
  const mats: Record<string, THREE.Material> = {};
  islandGroup.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && /^rkit:bande_(rot|weiss)$/.test(m.name)) mats[m.name.slice(5)] = m.material as THREE.Material; });
  const rolls = (['bande_rot', 'bande_weiss'] as const).map((k) => ({ k, r: src[k] ? splitRoll(src[k]) : null })).filter((x) => x.r && mats[x.k]);
  const group = new THREE.Group(); group.name = 'road-end-closures'; scene.add(group);
  if (!rolls.length) return { group, rolls: 0, pieces: 0 };
  let pieces = 0;
  for (const e of ends) {
    const R = new THREE.Vector3(-e.T.z, 0, e.T.x).normalize(), yaw = Math.atan2(-R.z, R.x);   // roll axis (local x) along the road's lateral
    // whole rolls only, centred: no roll hangs past the outer road edge
    const step = rolls.reduce((a, x) => a + x.r!.len, 0) / rolls.length + 0.04, n = Math.max(1, Math.floor((2 * e.half) / step));
    let lat = -(n * step) / 2, i = 0;
    while (i < n) {
      const { k, r } = rolls[i++ % rolls.length], L = r!.len, mid = lat + L / 2;
      const m = new THREE.Mesh(r!.geo, mats[k]); m.castShadow = m.receiveShadow = true;
      m.position.copy(e.p).addScaledVector(R, mid); m.position.y = Math.min(e.yAt(mid - L / 2), e.yAt(mid), e.yAt(mid + L / 2)) - 0.08;
      m.rotation.y = yaw; group.add(m); pieces++; lat += L + 0.04;
    }
  }
  return { group, rolls: rolls.map((x) => +x.r!.len.toFixed(2)), pieces };
}
