// StreakByte "Low Poly Floating Islands" demo scenes 01–08, rebuilt from the Unity scene files (tools/unity_scene.py →
// public/assets/streakbyte/scenes/*.json). Read-only viewer, own atlas, no clay: the purchased composition as it is.
// /demo-scenes.html?scene=01 … 08; presets: unity (the scene's own camera), overview, side, top. Unity EULA: local only.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const QS = new URLSearchParams(location.search);
const SCENES = ['01_Demo_Port', '02_Demo_River', '03_Demo_Backyard', '04_Demo_Beach', '05_Demo_PirateCave', '06_Demo_Iceland', '07_Demo_PondLand', '08_Demo_Forest'];
const NAME = SCENES.find((s) => s.startsWith(QS.get('scene') ?? '01')) ?? SCENES[0];
/** FBX file units → Unity metres */
const K = Number(QS.get('k') ?? 1); // mesh prefabs: FBXLoader geometry already matches Unity metres (measured)
/** model prefabs (whole FBX hierarchy, scene 02): the exported root carries ×100, Unity's file scale undoes it */
const KM = Number(QS.get('km') ?? 0.01);
const errors: string[] = [];
addEventListener('error', (e) => errors.push(String(e.message)));

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#2f3340');
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.05, 2000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.25; // no drift after letting go
controls.zoomToCursor = true;  // zoom into the detail under the cursor
scene.add(new THREE.HemisphereLight('#e8f0ff', '#6a5a50', 1.3));
const sun = new THREE.DirectionalLight('#fff3e0', 2.6);
sun.position.set(-30, 50, 25);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 200 });
sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);

const tex = new THREE.TextureLoader().load('/assets/streakbyte/Textures/Lowpoly_Flaoting_Islands_PortTexture.png');
tex.colorSpace = THREE.SRGBColorSpace;
tex.flipY = true;
tex.wrapS = tex.wrapT = THREE.RepeatWrapping; // some meshes carry UVs outside 0…1 (Unity's import repeats)
const MAT = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 });
const fbx = new FBXLoader();
const CACHE = new Map<string, Promise<THREE.Group>>();
// Vite's dev server answers paths with '&' with the SPA page: those few files have an 'and' copy next to them
const load = (p: string) => { let q = CACHE.get(p); if (!q) { q = fbx.loadAsync('/assets/streakbyte/Models/' + p.replace(/ & /g, ' and ').split('/').map(encodeURIComponent).join('/')); CACHE.set(p, q); } return q; };

type Item = { fbx: string; u: number; mesh: string | null; go: string; name: string; m: number[] };
const info: Record<string, unknown> = {};
const cams: Record<string, { pos: THREE.Vector3; target: THREE.Vector3; fov?: number; quat?: THREE.Quaternion }> = {};

async function boot() {
  const data = await (await fetch(`/assets/streakbyte/scenes/${NAME}.json`)).json() as { items: Item[]; cameras: { m: number[]; fov: number }[] };
  const root = new THREE.Group();
  scene.add(root);
  let missing = 0; const missed: string[] = [], big: string[] = [];
  for (const it of data.items) {
    let src: THREE.Group;
    try { src = await load(it.fbx); } catch (err) { missing++; missed.push(it.fbx + ': ' + String(err).slice(0, 120)); continue; }
    const M = new THREE.Matrix4().fromArray(it.m);
    // file units as Unity imports them: UnitScaleFactor / 100, read from the FBX header by tools/unity_scene.py
    const unit = it.u ?? 1, raw = new THREE.Box3().setFromObject(src).getSize(new THREE.Vector3());
    if (it.mesh === null) {
      // model prefab: the whole FBX hierarchy, file units → metres
      const o = src.clone(true);
      o.traverse((c) => { const m = c as THREE.Mesh; if (m.isMesh) { m.material = MAT; m.castShadow = m.receiveShadow = true; } });
      const inner = new THREE.Group(); inner.add(o); inner.scale.setScalar(QS.has('km') ? KM : unit);
      const w = new THREE.Group(); w.add(inner); w.matrixAutoUpdate = false; w.matrix.copy(M);
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
      m.matrixAutoUpdate = false;
      m.matrix.copy(M).multiply(new THREE.Matrix4().makeScale(gu, gu, gu));
      root.add(m);
    }
  }
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root), c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  Object.assign(info, { scene: NAME, items: data.items.length, missing, missed, big, size: s.toArray().map((v) => +v.toFixed(2)), centre: c.toArray().map((v) => +v.toFixed(2)) });
  const R = Math.max(s.x, s.z) * 0.5;
  sun.target.position.copy(c);
  sun.position.copy(c).add(new THREE.Vector3(-R * 1.5, R * 2.5, R * 1.2));
  Object.assign(sun.shadow.camera, { left: -R * 1.6, right: R * 1.6, top: R * 1.6, bottom: -R * 1.6, far: R * 8 });
  sun.shadow.camera.updateProjectionMatrix();
  cams.overview = { target: c.clone(), pos: c.clone().add(new THREE.Vector3(R * 1.6, R * 1.25, R * 2.1)) };
  cams.side = { target: c.clone().add(new THREE.Vector3(0, -s.y * 0.15, 0)), pos: c.clone().add(new THREE.Vector3(0, s.y * 0.1, R * 3.2)) };
  cams.top = { target: c.clone(), pos: c.clone().add(new THREE.Vector3(0.01, R * 3.4, 0)) };
  if (data.cameras[0]) {
    // Unity camera looks along +z; after the x-mirror a three.js camera needs a half turn about its own y
    const M = new THREE.Matrix4().fromArray(data.cameras[0].m).multiply(new THREE.Matrix4().makeRotationY(Math.PI));
    const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), sc = new THREE.Vector3();
    M.decompose(pos, quat, sc);
    cams.unity = { pos, target: pos.clone().add(new THREE.Vector3(0, 0, -1).applyQuaternion(quat).multiplyScalar(R * 2)), fov: data.cameras[0].fov, quat };
  }
  setCamera(cams.unity ? 'unity' : 'overview');
  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
  document.getElementById('title')!.textContent = `${NAME} · ${data.items.length} Objekte · Original-Komposition (StreakByte, nur lokal) · Maus: drehen, zoomen`;
  (window as any).__kfb.ready = true;
}

function setCamera(p: string) {
  const c = cams[p];
  if (!c) return;
  camera.fov = c.fov ?? 40;
  camera.updateProjectionMatrix();
  camera.position.copy(c.pos);
  controls.target.copy(c.target);
  controls.update();
}

(window as any).__kfb = {
  ready: false, errors, warnings: [], presets: () => Object.keys(cams), setCamera, setTime: () => null, player: () => null,
  waitIdle: async () => { await new Promise((r) => setTimeout(r, 400)); },
  stats: () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles }),
  info: () => info,
};
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
boot().catch((e) => { console.error(e); errors.push(String(e?.stack ?? e)); });
