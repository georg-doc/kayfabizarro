// Viewer for the purchased StreakByte "Low Poly Floating Islands" base meshes (unchanged), to study the underside anatomy.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { measure } from './island/measure';

const BASES: [string, string][] = [
  ['port', 'LPFI_PortLand/Floting Base.fbx'],
  ['river1', 'LPFL_RiverLand/Floting Base_1.fbx'],
  ['river2', 'LPFL_RiverLand/Floting Base_2.fbx'],
  ['backyard', 'LPFL_BackyardLand/Backyard Base.fbx'],
  ['beach', 'LPFL_BeachLand/Beatch Base.fbx'],
  ['cave', 'LPFL_PirateCave/Cave Land base.fbx'],
  ['ice', 'LPFL_Iceland/Snow Base.fbx'],
  ['pond', 'LPFL_PondLand/Pond Base.fbx'],
  ['forest', 'LPFL_ForestLand/Base.fbx'],
];
const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.NeutralToneMapping;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#2b2f3a');
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.5, 4000);
const controls = new OrbitControls(camera, canvas);
scene.add(new THREE.HemisphereLight('#ffffff', '#6a5a50', 1.4));
const sun = new THREE.DirectionalLight('#fff4e0', 2.2);
sun.position.set(-100, 200, 120);
scene.add(sun);
const tex = new THREE.TextureLoader().load('/assets/streakbyte/Textures/Lowpoly_Flaoting_Islands_PortTexture.png');
tex.colorSpace = THREE.SRGBColorSpace;
const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, flatShading: true });
const loader = new FBXLoader();
const objs = new Map<string, THREE.Object3D>();
const info: Record<string, unknown> = {};
async function boot() {
  let i = 0;
  for (const [id, path] of BASES) {
    const o = await loader.loadAsync('/assets/streakbyte/Models/' + encodeURI(path));
    o.traverse((m) => { const mm = m as THREE.Mesh; if (mm.isMesh) mm.material = mat; });
    const box = new THREE.Box3().setFromObject(o), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const k = 60 / Math.max(size.x, size.z);
    const wrap = new THREE.Group();
    o.position.sub(c);
    wrap.add(o);
    wrap.scale.setScalar(k);
    const col = i % 3, row = Math.floor(i / 3);
    wrap.position.set((col - 1) * 90, 0, (row - 1) * 90);
    scene.add(wrap);
    objs.set(id, wrap);
    info[id] = { size: size.toArray().map((v) => +v.toFixed(2)), meshes: o.children.length };
    i++;
  }
  setCamera('all');
  (window as any).__kfb = { analyze, ready: true, errors: [], warnings: [], info, presets: () => ['all', ...objs.keys()], setCamera, setTime: () => null, waitIdle: async () => {}, stats: () => ({}), player: () => null };
  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
}
function analyze(id: string) {
  return measure(objs.get(id)!, id);
}
function setCamera(p: any) {
  if (p === 'all') { controls.target.set(0, -10, 0); camera.position.set(60, 140, 330); }
  else if (typeof p === 'string' && p.endsWith('-below')) { const o = objs.get(p.slice(0, -6)); if (o) { controls.target.copy(o.position).add(new THREE.Vector3(0, -15, 0)); camera.position.copy(o.position).add(new THREE.Vector3(10, -95, 30)); } }
  else if (typeof p === 'string' && p.endsWith('-side')) { const o = objs.get(p.slice(0, -5)); if (o) { controls.target.copy(o.position).add(new THREE.Vector3(0, -12, 0)); camera.position.copy(o.position).add(new THREE.Vector3(0, -8, 105)); } }
  else { const o = objs.get(p); if (o) { controls.target.copy(o.position).add(new THREE.Vector3(0, -12, 0)); camera.position.copy(o.position).add(new THREE.Vector3(18, 22, 95)); } }
  controls.update();
}
boot();
