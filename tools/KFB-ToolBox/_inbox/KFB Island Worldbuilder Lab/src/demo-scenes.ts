// StreakByte "Low Poly Floating Islands" demo scenes 01–08, rebuilt from the Unity scene files (tools/unity_scene.py →
// public/assets/streakbyte/scenes/*.json). Read-only viewer, own atlas, no clay: the purchased composition as it is.
// /demo-scenes.html?scene=01 … 08; presets: unity (the scene's own camera), overview, side, top. Unity EULA: local only.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildDemoScene, DEMO_SCENES } from './island/demo-stage';

const QS = new URLSearchParams(location.search);
const SCENES = DEMO_SCENES;
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

const info: Record<string, unknown> = {};
const cams: Record<string, { pos: THREE.Vector3; target: THREE.Vector3; fov?: number; quat?: THREE.Quaternion }> = {};

async function boot() {
  // one loader for the viewer and the game stage (src/island/demo-stage.ts)
  const { root, data, info: li } = await buildDemoScene(NAME, { k: K, km: QS.has('km') ? KM : null });
  scene.add(root);
  const { missing, missed, big } = li;
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
  /** world size of named objects (scale audit against K2) */
  sizeOf: (re: string) => { const out: Record<string, number[]> = {}; scene.traverse((o) => { if (o.name && new RegExp(re, 'i').test(o.name) && !out[o.name]) { const v = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3()); out[o.name] = v.toArray().map((x) => +x.toFixed(2)); } }); return out; },
};
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
boot().catch((e) => { console.error(e); errors.push(String(e?.stack ?? e)); });
