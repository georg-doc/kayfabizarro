import * as THREE from 'three';
import { createKFBCartoonStoneArchBridgeModel } from './createKfbCartoonStoneArchBridgeModel';

const q = new URLSearchParams(location.search);
const view = q.get('view') ?? 'ref';
const size = Number(q.get('size') ?? 720);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(size, size);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(q.get('bg') ?? '#ffffff');
const t0 = performance.now();
const model = createKFBCartoonStoneArchBridgeModel({ castShadow: true, receiveShadow: true } as any);
const buildMs = performance.now() - t0;
scene.add(model);
let tris = 0, meshes = 0;
model.traverse((o: any) => { if (o.isMesh) { meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } });

// ground: shadow catcher only (reference shows a soft shadow on white)
const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.18 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.visible = view !== 'below';
scene.add(ground);

scene.add(new THREE.HemisphereLight('#dfe8ff', '#8a7a5f', 1.1));
const key = new THREE.DirectionalLight('#fff4e0', 2.4);
key.position.set(30, 60, 25); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 200 });
key.shadow.bias = -0.0005; key.shadow.normalBias = 0.05;
scene.add(key);
const rim = new THREE.DirectionalLight('#ffffff', 0.5); rim.position.set(-40, 20, -30); scene.add(rim);

const box = new THREE.Box3().setFromObject(model);
const c = box.getCenter(new THREE.Vector3());
const ext = box.getSize(new THREE.Vector3()).length() * 0.5;
const dirs: Record<string, [number, number, number]> = {
  ref: [0.8, 0.85, 1.0], '34': [-0.9, 0.55, 1.0], below: [0.25, -0.35, 1.0],
  front: [0, 0.05, 1], right: [1, 0.05, 0], rear: [0, 0.05, -1], left: [-1, 0.05, 0], top: [0, 1, 0.001],
};
const d = new THREE.Vector3(...(dirs[view] ?? dirs.ref)).normalize();
let camera: THREE.Camera;
if (view === 'ref' || view === 'front' || view === 'right' || view === 'rear' || view === 'left' || view === 'top') {
  const s = ext * 1.02;
  const oc = new THREE.OrthographicCamera(-s, s, s, -s, 0.1, 1000);
  oc.position.copy(c).addScaledVector(d, 300); oc.lookAt(c); camera = oc;
} else {
  const pc = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
  const target = view === 'below' ? new THREE.Vector3(0, 6, 0) : c;
  pc.position.copy(target).addScaledVector(d, view === 'below' ? 62 : ext * 2.9); pc.lookAt(target); camera = pc;
}
renderer.render(scene, camera);
(window as any).__stats = { view, buildMs: Math.round(buildMs), tris: Math.round(tris), meshes, bbox: box.min.toArray().concat(box.max.toArray()).map((v) => +v.toFixed(2)) };
(window as any).__save = async (name: string) => {
  renderer.render(scene, camera);
  const blob: Blob = await new Promise((r) => renderer.domElement.toBlob((b) => r(b!), 'image/png'));
  const res = await fetch('http://127.0.0.1:5199/' + name, { method: 'POST', body: blob });
  return res.status;
};
(window as any).__ready = true;
document.title = 'bridge01 ' + view;
