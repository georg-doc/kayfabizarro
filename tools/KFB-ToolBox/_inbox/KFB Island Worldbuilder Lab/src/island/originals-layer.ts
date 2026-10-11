// Comparison row: the purchased StreakByte base meshes, unchanged (own atlas texture, flat shading), each scaled to 60 m.
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PALETTES, type IslandPalette } from '../palettes';
import { mat } from './nature';
import { claySeed } from '../clay';
import { vnoise } from './noise';

/** Recolour an original base mesh with an island palette (top, rim, earth bands by depth) → no texture seams. */
function recolour(o: THREE.Object3D, pal: IslandPalette) {
  o.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(o), H = box.max.y - box.min.y, top = box.max.y;
  const cTop = new THREE.Color(pal.top), cTop2 = new THREE.Color(pal.top2), cRim = new THREE.Color(pal.rim);
  const bands = pal.under.map((c) => new THREE.Color(c));
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3(), tmp = new THREE.Color();
  o.traverse((m) => {
    const mm = m as THREE.Mesh;
    if (!mm.isMesh) return;
    const g = (mm.geometry.index ? mm.geometry.toNonIndexed() : mm.geometry.clone()) as THREE.BufferGeometry;
    g.deleteAttribute('uv');
    const P = g.attributes.position, cols = new Float32Array(P.count * 3);
    for (let i = 0; i < P.count; i += 3) {
      a.fromBufferAttribute(P, i).applyMatrix4(mm.matrixWorld); b.fromBufferAttribute(P, i + 1).applyMatrix4(mm.matrixWorld); c.fromBufferAttribute(P, i + 2).applyMatrix4(mm.matrixWorld);
      n.subVectors(b, a).cross(c.clone().sub(a)).normalize();
      const y = (a.y + b.y + c.y) / 3, d = (top - y) / H, cx = (a.x + b.x + c.x) / 3, cz = (a.z + b.z + c.z) / 3;
      if (n.y > 0.5 && d < 0.12) tmp.copy(cTop).lerp(cTop2, vnoise(cx * 0.08, cz * 0.08, 3) > 0.5 ? 1 : 0);
      else if (d < 0.07) tmp.copy(cRim);
      else tmp.copy(bands[d < 0.35 ? 1 : d < 0.65 ? 2 : 3]).multiplyScalar(0.82 + ((i * 7919) % 97) / 97 * 0.28);
      for (let k = 0; k < 3; k++) { cols[(i + k) * 3] = tmp.r; cols[(i + k) * 3 + 1] = tmp.g; cols[(i + k) * 3 + 2] = tmp.b; }
    }
    g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    g.computeVertexNormals();
    claySeed(g, 13);
    mm.geometry = g;
    mm.material = mat('rock', '#ffffff', { vertexColors: true });
  });
}

export const ORIGINALS: [string, string][] = [
  ['Hafen', 'LPFI_PortLand/Floting Base.fbx'],
  ['Fluss', 'LPFL_RiverLand/Floting Base_1.fbx'],
  ['Garten', 'LPFL_BackyardLand/Backyard Base.fbx'],
  ['Strand', 'LPFL_BeachLand/Beatch Base.fbx'],
  ['Höhle', 'LPFL_PirateCave/Cave Land base.fbx'],
  ['Eis', 'LPFL_Iceland/Snow Base.fbx'],
  ['Teich', 'LPFL_PondLand/Pond Base.fbx'],
  ['Wald', 'LPFL_ForestLand/Base.fbx'],
];

/** Two rows of four behind the generated islands (z = rowZ and rowZ + 85), 85 m apart. */
export async function buildOriginalsRow(rowZ = 230): Promise<THREE.Group> {
  const pals = Object.values(PALETTES);
  const loader = new FBXLoader();
  const row = new THREE.Group();
  row.name = 'originals';
  const objs = await Promise.all(ORIGINALS.map(([, p]) => loader.loadAsync('/assets/streakbyte/Models/' + encodeURI(p))));
  objs.forEach((o, i) => {
    recolour(o, pals[i % pals.length]);
    o.traverse((m) => { const mm = m as THREE.Mesh; if (mm.isMesh) mm.castShadow = mm.receiveShadow = true; });
    const box = new THREE.Box3().setFromObject(o), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const k = 60 / Math.max(size.x, size.z);
    const wrap = new THREE.Group();
    o.position.set(-c.x, -box.max.y, -c.z); // top surface at y = 0 like the generated islands
    wrap.add(o);
    wrap.scale.setScalar(k);
    wrap.position.set(((i % 4) - 1.5) * 85, 0, rowZ + Math.floor(i / 4) * 85);
    wrap.name = 'original:' + ORIGINALS[i][0];
    row.add(wrap);
  });
  return row;
}
