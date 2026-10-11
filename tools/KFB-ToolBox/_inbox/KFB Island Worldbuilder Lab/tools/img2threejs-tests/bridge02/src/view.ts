// bridge02 viewer: fixed review cameras for the KFB stone bridge field.
import * as THREE from 'three';
import { createKfbStoneBridgeField } from './createKfbStoneBridgeField';

const q = new URLSearchParams(location.search);
const view = q.get('view') ?? 'f34';
const W = Number(q.get('w') ?? 1600), H = Number(q.get('h') ?? 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(q.get('bg') ?? '#efeeea');
const t0 = performance.now();
const model = createKfbStoneBridgeField();
const buildMs = performance.now() - t0;
scene.add(model);
let tris = 0, meshes = 0;
model.traverse((o: any) => { if (o.isMesh) { meshes++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; } });

const box = new THREE.Box3().setFromObject(model);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.16 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = box.min.y; ground.receiveShadow = true; ground.visible = view !== 'under';
scene.add(ground);
scene.add(new THREE.HemisphereLight('#ffffff', '#b9ad96', 1.35));
const key = new THREE.DirectionalLight('#fff3e2', 2.1);
key.position.set(28, 55, 40); key.castShadow = true;
key.shadow.mapSize.set(4096, 4096);
Object.assign(key.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 200 });
key.shadow.bias = -0.0004; key.shadow.normalBias = 0.04;
scene.add(key);
const fill = new THREE.DirectionalLight('#eef3ff', 0.55); fill.position.set(-35, 15, -25); scene.add(fill);
const under = new THREE.DirectionalLight('#fff8ee', 0.6); under.position.set(5, -40, 30); scene.add(under);

const c = box.getCenter(new THREE.Vector3());
const dirs: Record<string, [number, number, number]> = {
  f34: [1.0, 0.48, 0.66], front: [0, 0.04, 1], under: [0, -0.62, 1], side: [1, 0.04, 0], top: [0, 1, 0], rear: [0, 0.04, -1], left: [-1, 0.04, 0],
};
const d = new THREE.Vector3(...(dirs[view] ?? dirs.f34)).normalize();
const corners: THREE.Vector3[] = [];
for (let i = 0; i < 8; i++) corners.push(new THREE.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z));
let camera: THREE.Camera;
const aspect = W / H;
if (['front', 'side', 'top', 'rear', 'left'].includes(view)) {
  const oc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
  if (view === 'top') oc.up.set(0, 0, -1);
  oc.position.copy(c).addScaledVector(d, 300); oc.lookAt(c); oc.updateMatrixWorld();
  const inv = oc.matrixWorldInverse; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const p of corners) { const v = p.clone().applyMatrix4(inv); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); }
  let w = (x1 - x0) * 1.08, h = (y1 - y0) * 1.08; if (w / h < aspect) w = h * aspect; else h = w / aspect;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  Object.assign(oc, { left: cx - w / 2, right: cx + w / 2, top: cy + h / 2, bottom: cy - h / 2 }); oc.updateProjectionMatrix();
  camera = oc;
} else {
  const pc = new THREE.PerspectiveCamera(view === 'under' ? 40 : 30, aspect, 0.1, 2000);
  const target = view === 'under' ? new THREE.Vector3(0, -7, 0) : c.clone();
  let dist = 100;
  for (let it = 0; it < 30; it++) {
    pc.position.copy(target).addScaledVector(d, dist); pc.lookAt(target); pc.updateMatrixWorld(); pc.updateProjectionMatrix();
    let m = 0; for (const p of corners) { const v = p.clone().project(pc); m = Math.max(m, Math.abs(v.x), Math.abs(v.y)); }
    dist *= 1 + (m - (view === 'under' ? 0.98 : 0.9)) * 0.5;
  }
  camera = pc;
}
renderer.render(scene, camera);
(window as any).__stats = { view, buildMs: Math.round(buildMs), tris: Math.round(tris), meshes, drawCalls: renderer.info.render.calls, bbox: box.min.toArray().concat(box.max.toArray()).map((v) => +v.toFixed(2)), meta: model.userData.kfbBridgeField };
(window as any).__save = async (name: string) => {
  renderer.render(scene, camera);
  const blob: Blob = await new Promise((r) => renderer.domElement.toBlob((b) => r(b!), 'image/png'));
  const res = await fetch('http://127.0.0.1:5199/' + name, { method: 'POST', body: blob });
  return res.status;
};
(window as any).__ready = true;
document.title = 'bridge02 ' + view;
