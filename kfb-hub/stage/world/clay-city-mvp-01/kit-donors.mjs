/* KFB CLAY-CITY-MVP-01 · verified building donors (gate 0)
   Every donor is a real file in georg-doc/kayfabizarro, loaded from ONE pinned commit. A loaded URL is not
   proof: measureDonor() renders nothing by itself, but records bounds, pivot, materials and triangles of the
   exact scene that the district instances; donors.html renders each one in isolation from the same code. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const ASSET_PIN = '7cc4a4f3fc40fcad56e75ddf587b77cd856e202c';
const ROOT = `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${ASSET_PIN}/media/3D_Assets/`;
const KK = 'KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/';
const KS = 'kenney_city-kit-suburban_20/Models/GLB format/';
const TT = 'Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/';

/* family: kaykit-city | kenney-suburban | tinytreats-house · floors: visual storeys at source scale */
export const DONORS = [
  { id: 'kk-A', family: 'kaykit-city', path: KK + 'building_A_withoutBase.gltf' },
  { id: 'kk-B', family: 'kaykit-city', path: KK + 'building_B_withoutBase.gltf' },
  { id: 'kk-C', family: 'kaykit-city', path: KK + 'building_C_withoutBase.gltf' },
  { id: 'kk-D', family: 'kaykit-city', path: KK + 'building_D_withoutBase.gltf' },
  { id: 'kk-E', family: 'kaykit-city', path: KK + 'building_E_withoutBase.gltf' },
  { id: 'kk-F', family: 'kaykit-city', path: KK + 'building_F_withoutBase.gltf' },
  { id: 'kk-G', family: 'kaykit-city', path: KK + 'building_G_withoutBase.gltf' },
  { id: 'kk-H', family: 'kaykit-city', path: KK + 'building_H_withoutBase.gltf' },
  { id: 'ks-a', family: 'kenney-suburban', path: KS + 'building-type-a.glb' },
  { id: 'ks-c', family: 'kenney-suburban', path: KS + 'building-type-c.glb' },
  { id: 'ks-h', family: 'kenney-suburban', path: KS + 'building-type-h.glb' },
  { id: 'ks-m', family: 'kenney-suburban', path: KS + 'building-type-m.glb' },
  { id: 'tt-house', family: 'tinytreats-house', path: TT + 'house.gltf' }
];
export const donorUrl = (d) => ROOT + d.path.split('/').map(encodeURIComponent).join('/');

const loader = new GLTFLoader();
export async function loadDonor(d) {
  const t0 = performance.now();
  const gltf = await loader.loadAsync(donorUrl(d));
  return { donor: d, scene: gltf.scene, ms: performance.now() - t0 };
}

export function measureDonor({ donor, scene, ms }) {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  let tris = 0, meshes = 0; const mats = new Map();
  scene.traverse((o) => {
    if (!o.isMesh) return; meshes++;
    const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
    for (const m of [].concat(o.material)) mats.set(m.name || m.uuid.slice(0, 6), { type: m.type, map: !!m.map, color: '#' + m.color?.getHexString() });
  });
  const r3 = (v) => +v.toFixed(3);
  return {
    id: donor.id, family: donor.family, path: donor.path, pin: ASSET_PIN, loadMs: Math.round(ms),
    sizeM: [r3(size.x), r3(size.y), r3(size.z)],
    pivot: { minY: r3(box.min.y), centreXZ: [r3(c.x), r3(c.z)], note: box.min.y > -0.01 && box.min.y < 0.05 ? 'base at origin' : 'base offset' },
    meshes, triangles: Math.round(tris), materials: Object.fromEntries(mats)
  };
}

/* one merged, re-pivoted geometry per donor: base at y=0, footprint centred; keeps vertex colours / uv / map */
export function flattenDonor(scene) {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene), c = box.getCenter(new THREE.Vector3());
  const byMat = new Map();
  scene.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); g.translate(-c.x, -box.min.y, -c.z);
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k);
    const m = [].concat(o.material)[0];
    if (!byMat.has(m)) byMat.set(m, []); byMat.get(m).push(g.index ? g.toNonIndexed() : g);
  });
  return { parts: [...byMat.entries()].map(([material, geos]) => ({ material, geos })), size: box.getSize(new THREE.Vector3()) };
}
