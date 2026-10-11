// Speckle comparison (2026-10-09): current kfbBlend/kfbLayer (R2D v0, Joyride J14) against candidate S1 kfbSpeckleLayer,
// same weights, same cell (1.1 × RACE_W 1.46), same sand bank (hw + 0.6 … hw + 3.4, × 1.46) along a curved road.
// Grid: top row = current, bottom row = S1; columns = overview, drive height, walk height (0.9 H).
// /speckle.html?solo=old|new&cam=overview|drive|walk → one view with orbit controls.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { KFB_BLEND_GLSL } from './clay/kfb-blend';
import { KFB_SPECKLE_GLSL, speckleThresholds } from './clay/kfb-speckle';
import { H } from './environment/kits';

const QS = new URLSearchParams(location.search);
const RACE_W = 1.46, CELL = 1.1 * RACE_W, HW = 5.4 * RACE_W, B0 = HW + 0.6 * RACE_W, B1 = HW + 3.4 * RACE_W;
const GRASS = '#8cc76a', SAND = '#ecdcb0', ROAD = '#5e6a86';

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setScissorTest(true);
renderer.toneMapping = THREE.NeutralToneMapping;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#96bede');
scene.add(new THREE.HemisphereLight('#dfeeff', '#c7a790', 1.3));
const sun = new THREE.DirectionalLight('#fff1dc', 2.2);
sun.position.set(30, 60, 20);
scene.add(sun);

const ROAD_GLSL = /* glsl */ `
float roadZ(float x){ return 10.0 * sin(x / 30.0); }
float roadDist(vec2 p){ float s = (10.0 / 30.0) * cos(p.x / 30.0); return abs(p.y - roadZ(p.x)) / sqrt(1.0 + s * s); }
`;
const K = speckleThresholds();

function groundMaterial(kind: 'old' | 'new') {
  const m = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uSpeckleK = { value: K };
    sh.vertexShader = 'varying vec2 vTS;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vTS = (modelMatrix * vec4(position, 1.0)).xz;');
    const lib = kind === 'old' ? KFB_BLEND_GLSL + /* glsl */ `
float kfbLayer(vec2 p, float cell, float w, out float rim){ float r1, r2, r3, r4;
  float a = kfbBlend(p, cell, w, r1);
  float m = kfbBlend(p + 13.1, cell * 0.42, smoothstep(0.0, 0.95, w) * 0.5, r2);
  float s = kfbBlend(p + 27.7, cell * 0.2, smoothstep(0.0, 0.7, w) * 0.32, r3);
  float b = kfbBlend(p + 41.3, cell * 0.36, smoothstep(0.0, 0.95, 1.0 - w) * 0.42, r4);
  float sel = max(a, max(m, s)) * (1.0 - b); rim = max(max(r1 * a, r2 * m), max(r3 * s, r4 * b)); return sel; }
` : KFB_SPECKLE_GLSL;
    const call = kind === 'old' ? 'kfbLayer' : 'kfbSpeckleLayer';
    sh.fragmentShader = 'varying vec2 vTS;\n' + ROAD_GLSL + lib + sh.fragmentShader.replace('#include <color_fragment>', /* glsl */ `#include <color_fragment>
{ float d = roadDist(vTS); float w = 1.0 - smoothstep(${B0.toFixed(3)}, ${B1.toFixed(3)}, d); float rim;
  float sel = ${call}(vTS, ${CELL.toFixed(3)}, w, rim);
  vec3 c = mix(vec3(${new THREE.Color(GRASS).toArray().map((v) => v.toFixed(4)).join(',')}), vec3(${new THREE.Color(SAND).toArray().map((v) => v.toFixed(4)).join(',')}), sel) * (1.0 - 0.10 * rim);
  if (d < ${HW.toFixed(3)}) c = vec3(${new THREE.Color(ROAD).toArray().map((v) => v.toFixed(4)).join(',')});
  diffuseColor.rgb = c; }`);
  };
  m.customProgramCacheKey = () => 'speckle-' + kind;
  return m;
}

const geo = new THREE.PlaneGeometry(400, 400, 1, 1).rotateX(-Math.PI / 2);
const grounds = { old: new THREE.Mesh(geo, groundMaterial('old')), new: new THREE.Mesh(geo, groundMaterial('new')) };
scene.add(grounds.old, grounds.new);

// scale reference: a figure-sized post (1 H) on the bank and a car-sized block (6 long) on the road
const roadZ = (x: number) => 10 * Math.sin(x / 30);
const fig = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, H - 0.9, 4, 12), new THREE.MeshStandardMaterial({ color: '#e7834a', roughness: 0.8 }));
fig.position.set(30, H / 2, roadZ(30) + HW + 1.2);
const car = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, 2.8), new THREE.MeshStandardMaterial({ color: '#d84a3a', roughness: 0.7 }));
car.position.set(-6, 0.8, roadZ(-6) - 2.5);
car.rotation.y = -Math.atan((10 / 30) * Math.cos(-6 / 30));
scene.add(fig, car);

const CAMS: Record<string, { pos: [number, number, number]; target: [number, number, number]; label: string }> = {
  overview: { pos: [0, 70, 62], target: [0, 0, 0], label: 'Übersicht' },
  drive: { pos: [-26, 3.6, roadZ(-26) - 1.5], target: [2, 0.5, roadZ(2) + 2], label: 'Fahrhöhe' },
  walk: { pos: [8, 0.9 * H, roadZ(8) + HW + 6.5], target: [20, 0, roadZ(20) + HW + 1], label: 'Laufhöhe (0,9 H)' },
};
const ROWS: { kind: 'old' | 'new'; label: string }[] = [{ kind: 'old', label: 'Jetzt: kfbLayer (R2D v0)' }, { kind: 'new', label: 'Neu: Scheiben-Sprenkel S1' }];

const solo = QS.get('solo') as 'old' | 'new' | null;
const cams = Object.fromEntries(Object.entries(CAMS).map(([k, c]) => {
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  cam.position.set(...c.pos); cam.lookAt(...c.target);
  return [k, cam];
})) as Record<string, THREE.PerspectiveCamera>;

let controls: OrbitControls | null = null;
if (solo) {
  const cam = cams[QS.get('cam') ?? 'walk'] ?? cams.walk;
  controls = new OrbitControls(cam, canvas);
  controls.target.set(...(CAMS[QS.get('cam') ?? 'walk'] ?? CAMS.walk).target);
  controls.enableDamping = true; controls.dampingFactor = 0.25; controls.zoomToCursor = true; controls.minDistance = 2;
  controls.update();
}

const labels = document.getElementById('labels')!;
function layout() {
  labels.innerHTML = '';
  const W = innerWidth, Hh = innerHeight;
  if (solo) {
    labels.innerHTML = `<div class="lab" style="left:10px;top:10px">${ROWS.find((r) => r.kind === solo)!.label} · ${CAMS[QS.get('cam') ?? 'walk']?.label ?? ''} · Maus: drehen, zoomen</div>`;
    return;
  }
  ROWS.forEach((r, ri) => Object.values(CAMS).forEach((c, ci) => {
    labels.insertAdjacentHTML('beforeend', `<div class="lab" style="left:${(ci * W) / 3 + 8}px;top:${(ri * Hh) / 2 + 8}px">${r.label} · ${c.label}</div>`);
  }));
}
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); layout(); });
layout();

function frame() {
  const W = innerWidth, Hh = innerHeight;
  if (solo && controls) {
    controls.update();
    const cam = controls.object as THREE.PerspectiveCamera;
    cam.aspect = W / Hh; cam.updateProjectionMatrix();
    grounds.old.visible = solo === 'old'; grounds.new.visible = solo === 'new';
    renderer.setViewport(0, 0, W, Hh); renderer.setScissor(0, 0, W, Hh);
    renderer.render(scene, cam);
  } else {
    ROWS.forEach((r, ri) => Object.keys(CAMS).forEach((k, ci) => {
      const x = (ci * W) / 3, y = ((1 - ri) * Hh) / 2, w = W / 3 - 2, h = Hh / 2 - 2;
      const cam = cams[k]; cam.aspect = w / h; cam.updateProjectionMatrix();
      grounds.old.visible = r.kind === 'old'; grounds.new.visible = r.kind === 'new';
      renderer.setViewport(x, y, w, h); renderer.setScissor(x, y, w, h);
      renderer.render(scene, cam);
    }));
  }
  requestAnimationFrame(frame);
}
frame();
(window as unknown as { __speckle: unknown }).__speckle = { K, CELL, HW, B0, B1 };
