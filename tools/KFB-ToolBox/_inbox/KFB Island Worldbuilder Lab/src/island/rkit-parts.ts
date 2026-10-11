// RKIT built parts (kfb.rkit-parts/1, Steuerung 10.10.): RKIT delivers only built parts (GLB, island-local, lab units,
// y up, one node per part run) plus a role table; the lab places them on the island and colours every material by its
// role name from ENV_ROLES, so colour has one source. Terrain join, road surface and bed stay the lab's (kfb.road-bed/1).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { roleColor } from '../palettes';
import { clayMaterial, claySeed } from '../clay';

export interface RkitPartsSpec { schema: string; islandId: string; glb: string; sha256?: string; roles: Record<string, string>; nodes: { node: string; role: string; parts: number }[] }

/** role table value → colour: 'stone[1]' / 'stone.1' → ENV_ROLES; 'fixed #rrggbb …' → that colour; road_j17 → asphalt */
/** RKIT material keys on island-independent lab roles (Steuerung 10.10.): family A masonry and the J17 bande are their
 *  own materials, never the island's rock / accent roles; tones from RKIT's Blender values (MASONRY_DEFAULT) */
const LAB_ROLE: Record<string, string> = {
  stone_t0: 'masonry.0', stone_t1: 'masonry.2', stone_t2: 'masonry.3',
  paved_t0: 'masonry.1', paved_t1: 'masonry.2', paved_t2: 'masonry.0', paved_t3: 'masonry.1',
  bande_rot: 'bande_rot', bande_weiss: 'bande_weiss',
};

export function resolveRole(palette: string, key: string, value: string | undefined): { hex: string; source: string } {
  if (LAB_ROLE[key]) return { hex: roleColor(palette, LAB_ROLE[key]), source: LAB_ROLE[key] };
  if (key === 'road_j17' || /^asphalt/.test(value ?? '')) { const m = /asphalt[[.](\d)/.exec(value ?? ''); return { hex: roleColor(palette, 'asphalt.' + (m ? m[1] : '1')), source: 'asphalt.' + (m ? m[1] : '1') }; }
  const m = /^([a-z]+)[[.](\d)/.exec(value ?? '');
  if (m) return { hex: roleColor(palette, m[1] + '.' + m[2]), source: m[1] + '.' + m[2] };
  const f = /#[0-9a-fA-F]{6}/.exec(value ?? '');
  if (f) return { hex: f[0], source: 'fixed' };
  return { hex: roleColor(palette, 'stone.1'), source: 'fallback stone.1' };
}

// asphalt (Steuerung 10.10.: the knead relief read as craters / bubbles — diorama asphalt, not a moon surface): KFB's road
// tool mix (clay-toolmix v2 `road`: long roller + spatula strokes) without its dents and thumbs, finer, little fingerprint
const ROAD_CLAY = { tools: { roll: { k: 0.4, s: 1.8, c: 0.6 }, smear: { k: 0.25, s: 1.2, c: 0.35 } }, dent: 0, gouge: 0, crack: 0, print: 0.12 };

export async function loadRkitParts(jsonUrl: string, palette: string): Promise<{ group: THREE.Group; spec: RkitPartsSpec; colours: Record<string, string> }> {
  const spec: RkitPartsSpec = await (await fetch(jsonUrl)).json();
  const base = jsonUrl.slice(0, jsonUrl.lastIndexOf('/') + 1);
  const gltf = await new GLTFLoader().loadAsync(base + spec.glb);
  const group = new THREE.Group(); group.name = 'rkit-parts:' + spec.glb; group.userData.rkitParts = spec.glb;
  // one mesh per role material (draw calls): node transforms baked, only position + normal kept
  const byKey = new Map<string, THREE.BufferGeometry[]>(), colours: Record<string, string> = {};
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const src = (Array.isArray(m.material) ? m.material[0] : m.material) as THREE.MeshStandardMaterial;
    const key = src?.name || 'stone_t1', g0 = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(), g = new THREE.BufferGeometry();
    g.setAttribute('position', g0.getAttribute('position'));
    if (g0.getAttribute('normal')) g.setAttribute('normal', g0.getAttribute('normal')); else g.computeVertexNormals();
    g.applyMatrix4(m.matrixWorld);
    (byKey.get(key) ?? byKey.set(key, []).get(key)!).push(g);
  });
  let seed = 31;
  for (const [key, geos] of byKey) {
    const r = resolveRole(palette, key, spec.roles[key]);
    colours[key] = r.hex + ' (' + r.source + ')';
    const cls = key === 'road_j17' || key === 'iron' || key === 'slot' ? 'model' : 'rock';
    const mat = clayMaterial(cls, new THREE.MeshStandardMaterial({ color: r.hex, roughness: key === 'iron' ? 0.6 : 0.9 }), key === 'road_j17' ? ROAD_CLAY : {});
    const mesh = new THREE.Mesh(claySeed(mergeGeometries(geos)!, seed++), mat);
    mesh.name = 'rkit:' + key; mesh.castShadow = mesh.receiveShadow = true; mesh.userData.rkitRole = key;
    group.add(mesh);
  }
  return { group, spec, colours };
}
