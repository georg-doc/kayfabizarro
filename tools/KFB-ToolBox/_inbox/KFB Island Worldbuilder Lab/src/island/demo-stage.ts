// StreakByte "Low Poly Floating Islands" demo scenes as they are (purchased composition, own atlas, no clay; Unity EULA:
// local only). One loader for the read-only viewer (src/demo-scenes.ts) and the game stage (?play=game&stage=07):
// JSON (tools/unity_scene.py: fbx + Unity 4×4 matrix, x-mirrored) → FBX per object.
// Stage scale (Steuerung 10.10. spät, "Insel als Bühne"): per scene, measured in the scene (tools/research/demo-measure.mjs).
// 07 PondLand: bench 2.1 × 1.13 m, lamp 1.93 m, gate 6.1 m, duck 0.5 m ≈ real proportions → a Unity metre is a figure metre
// (1 H = 1.85 m = 3.64 lab): bench 0.6 H, lamp 1.0 H, gate 3.3 H. Other scenes: not measured yet (Port is a miniature,
// Backyard ≈ 2× oversized: see docs/BACKBONE_EDITOR_DONORS_R1.md §2).
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { buildSurfaceField } from '../play/surface';

export const DEMO_SCENES = ['01_Demo_Port', '02_Demo_River', '03_Demo_Backyard', '04_Demo_Beach', '05_Demo_PirateCave', '06_Demo_Iceland', '07_Demo_PondLand', '08_Demo_Forest'];
/** Unity m → lab per scene (measured); only measured scenes are stages */
export const STAGE_SCALE: Record<string, number> = { '07_Demo_PondLand': 3.64 / 1.85 };
/** walkable ground and solid props per scene (object names); everything else (grass, lotus, birds, the gate arch) is walked through */
const STAGE_GROUND: Record<string, { ground: RegExp; solid: RegExp; spawn: [number, number]; look: [number, number] }> = {
  // spawn: on the path by the south-east benches (scene x/z in metres after the loader's x-mirror; the top-view image shows −x right, −z down), looking along the path to the bridge and the gate
  '07_Demo_PondLand': { ground: /^M_(Pond Base|Bridge)/, solid: /^M_(Rock|Bench|Light|Tree|Fountain|Boat)/, spawn: [-6.2, -9.4], look: [-3.2, -3.0] },
};

type Item = { fbx: string; u: number; mesh: string | null; go: string; name: string; m: number[] };
export const demoName = (q: string) => DEMO_SCENES.find((s) => s.startsWith(q)) ?? DEMO_SCENES[0];

export async function buildDemoScene(name: string, o: { k?: number; km?: number | null } = {}) {
  const K = o.k ?? 1;   // mesh prefabs: FBXLoader geometry already matches Unity metres (measured)
  const tex = new THREE.TextureLoader().load('/assets/streakbyte/Textures/Lowpoly_Flaoting_Islands_PortTexture.png');
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = true;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; // some meshes carry UVs outside 0…1 (Unity's import repeats)
  const MAT = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 });
  const fbx = new FBXLoader();
  const CACHE = new Map<string, Promise<THREE.Group>>();
  // Vite's dev server answers paths with '&' with the SPA page: those few files have an 'and' copy next to them
  const load = (p: string) => { let q = CACHE.get(p); if (!q) { q = fbx.loadAsync('/assets/streakbyte/Models/' + p.replace(/ & /g, ' and ').split('/').map(encodeURIComponent).join('/')); CACHE.set(p, q); } return q; };
  const data = await (await fetch(`/assets/streakbyte/scenes/${name}.json`)).json() as { items: Item[]; cameras: { m: number[]; fov: number }[] };
  const root = new THREE.Group(); root.name = 'demo:' + name;
  let missing = 0; const missed: string[] = [], big: string[] = [];
  for (const it of data.items) {
    let src: THREE.Group;
    try { src = await load(it.fbx); } catch (err) { missing++; missed.push(it.fbx + ': ' + String(err).slice(0, 120)); continue; }
    const M = new THREE.Matrix4().fromArray(it.m);
    // file units as Unity imports them: UnitScaleFactor / 100, read from the FBX header by tools/unity_scene.py
    const unit = it.u ?? 1, raw = new THREE.Box3().setFromObject(src).getSize(new THREE.Vector3());
    if (it.mesh === null) {
      // model prefab: the whole FBX hierarchy, file units → metres (the exported root carries ×100, Unity's file scale undoes it)
      const oo = src.clone(true);
      oo.traverse((c) => { const m = c as THREE.Mesh; if (m.isMesh) { m.material = MAT; m.castShadow = m.receiveShadow = true; } });
      const inner = new THREE.Group(); inner.add(oo); inner.scale.setScalar(o.km != null ? o.km : unit);
      const w = new THREE.Group(); w.add(inner); w.name = it.name || it.go; w.matrixAutoUpdate = false; w.matrix.copy(M);
      root.add(w);
      w.updateMatrixWorld(true);
      const ws = new THREE.Box3().setFromObject(w).getSize(new THREE.Vector3());
      if (Math.max(ws.x, ws.y, ws.z) > 40) big.push(`${it.fbx} ${ws.toArray().map((v) => v.toFixed(0)).join('×')} raw ${raw.toArray().map((v) => v.toFixed(0)).join('×')}`);
    } else {
      // prefab with a MeshFilter: Unity uses the mesh in its node space (node transform not applied), scaled to metres
      let mesh: THREE.Mesh | null = null;
      src.traverse((c) => { const m = c as THREE.Mesh; if (m.isMesh && (!mesh || (m.name === it.go))) mesh = m; });
      if (!mesh) { missing++; continue; }
      const gu = unit * K;
      const m = new THREE.Mesh((mesh as THREE.Mesh).geometry, MAT);
      m.castShadow = m.receiveShadow = true;
      m.name = it.name || it.go;
      m.matrixAutoUpdate = false;
      m.matrix.copy(M).multiply(new THREE.Matrix4().makeScale(gu, gu, gu));
      root.add(m);
    }
  }
  root.updateMatrixWorld(true);
  return { root, data, info: { scene: name, items: data.items.length, missing, missed, big } };
}

/** the scene as a game stage: scaled to lab units, walk surface (ground + solid props as walls), spawn */
export async function buildDemoStage(q: string) {
  const name = demoName(q), k = STAGE_SCALE[name];
  if (!k) throw new Error(`stage ${name}: no measured scale (only ${Object.keys(STAGE_SCALE).join(', ')})`);
  const { root, info } = await buildDemoScene(name);
  const stage = new THREE.Group(); stage.name = 'stage:' + name; stage.add(root); stage.scale.setScalar(k); stage.updateMatrixWorld(true);
  const G = STAGE_GROUND[name], meshes: THREE.Mesh[] = [];
  const top = (o: THREE.Object3D) => { let p: THREE.Object3D = o; while (p.parent && p.parent !== root) p = p.parent; return p.name; };
  root.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const n = top(m); if (G.ground.test(n) || G.solid.test(n)) { m.userData.stageRole = G.ground.test(n) ? 'ground' : 'solid:' + n; meshes.push(m); } });
  for (const m of meshes) m.userData.rkitRole = m.userData.stageRole;   // surface roles: solid props are walls
  const surface = buildSurfaceField(meshes, 2, (r) => r.startsWith('solid'));
  const box = new THREE.Box3().setFromObject(stage);
  const sx = G.spawn[0] * k, sz = G.spawn[1] * k, lx = G.look[0] * k, lz = G.look[1] * k;
  return { name, scale: k, group: stage, surface, box, spawn: [sx, sz, Math.atan2(lx - sx, lz - sz)] as [number, number, number], info: { ...info, groundMeshes: meshes.filter((m) => m.userData.stageRole === 'ground').length, solids: meshes.length, surfaceTris: surface.tris } };
}
