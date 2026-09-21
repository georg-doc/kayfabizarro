/* KFB Kit Lab · scene builder for KayKit/Kenney packs
   Loads real assets from the kayfabizarro asset repo (read-only consumer of the Asset Registry
   source paths). Every placement is grid-anchored; every module size is measured at runtime. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

THREE.Cache.enabled = true;

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
export const PACKS = {
  dungeon:   { base: RAW + 'KayKit_Dungeon_Pack_1.1_FREE%202/Assets/gltf/', ext: '.gltf' },
  boardgame: { base: RAW + 'KayKit_BoardGameBits_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  city_kk:   { base: RAW + 'KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/', ext: '.gltf' },
  roads:     { base: RAW + 'kenney_city-kit-roads/Models/GLB%20format/', ext: '.glb' },
  city_com:  { base: RAW + 'kenney_city-kit-commercial_2.1/Models/GLB%20format/', ext: '.glb' },
  city_sub:  { base: RAW + 'kenney_city-kit-suburban_20/Models/GLB%20format/', ext: '.glb' },
  nature:    { base: RAW + 'kenney_nature-kit/Models/GLTF%20format/', ext: '.glb' },
  racing:    { base: RAW + 'kenney_racing-kit/Models/GLTF%20format/', ext: '.glb' }
};

const loader = new GLTFLoader();
const cache = new Map();
export const measured = new Map(); // name -> {size:[x,y,z], min:[..], max:[..]}

export async function loadAsset(pack, name) {
  const key = pack + '/' + name;
  const cfg = PACKS[pack];
  if (!cfg) throw new Error('unknown pack ' + pack);
  if (!cache.has(key)) {
    cache.set(key, loader.loadAsync(cfg.base + encodeURIComponent(name) + cfg.ext).then((g) => {
      const box = new THREE.Box3().setFromObject(g.scene);
      const s = box.getSize(new THREE.Vector3());
      measured.set(key, {
        pack, name,
        size: [s.x, s.y, s.z],
        min: box.min.toArray(), max: box.max.toArray()
      });
      g.scene.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      return g.scene;
    }));
  }
  return cache.get(key);
}

export async function instance(pack, name) {
  const src = await loadAsset(pack, name);
  return src.clone(true);
}

/* measure a single part without placing it */
export async function measure(pack, name) {
  await loadAsset(pack, name);
  return measured.get(pack + '/' + name);
}

/* A placement: { a:'pack:name', p:[x,y,z] world  OR  m:[i,j] module, y, r:deg-Y, s:scale }
   opts.module scales m[] into world units. */
export async function buildScene(placements, onProgress, opts = {}) {
  const M = opts.module || 1;
  const root = new THREE.Group();
  root.name = 'kfb-scene';
  let done = 0;
  for (const it of placements) {
    const [pack, name] = it.a.split(':');
    try {
      const node = await instance(pack, name);
      const p = it.p || [it.m[0] * M, it.y || 0, it.m[1] * M];
      node.position.set(p[0], it.p ? (p[1] || 0) : (it.y || 0), p[2]);
      if (it.r) node.rotation.y = THREE.MathUtils.degToRad(it.r);
      if (it.s) node.scale.setScalar(it.s);
      node.userData.recipe = it;
      root.add(node);
    } catch (e) {
      console.warn('missing asset', it.a, e.message);
    }
    onProgress?.(++done, placements.length);
  }
  return root;
}

/* Placement audit — the automatic version of "das hätte im Screenshot auffallen müssen".
   Flags parts that do not sit on the module raster and parts whose footprints overlap. */
export function audit(placements, module, opts = {}) {
  const tol = opts.tolerance ?? 0.02;
  const step = module / 2;                       // half-module snapping is legal
  const isStructural = opts.structural || (() => true);
  const offGrid = [];
  const free = [];
  const seen = new Map();
  const overlaps = [];
  for (const it of placements) {
    const p = it.p || [it.m[0] * module, it.y || 0, it.m[1] * module];
    const dx = Math.abs(p[0] / step - Math.round(p[0] / step)) * step;
    const dz = Math.abs(p[2] / step - Math.round(p[2] / step)) * step;
    const off = dx > tol || dz > tol;
    if (off && isStructural(it.a)) offGrid.push({ a: it.a, p, offX: +dx.toFixed(3), offZ: +dz.toFixed(3) });
    else if (off) free.push({ a: it.a, p });
    if (opts.checkOverlap && isStructural(it.a)) {
      const layer = opts.layer ? opts.layer(it.a) : 'all';
      const key = `${layer}|${Math.round(p[0] / step)}|${Math.round(p[2] / step)}`;
      if (seen.has(key)) overlaps.push({ a: it.a, with: seen.get(key), p, layer });
      else seen.set(key, it.a);
    }
  }
  return { total: placements.length, free, offGrid, overlaps, clean: offGrid.length === 0 && overlaps.length === 0 };
}

export function makeViewer(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.background || 0x1b1030);

  const camera = new THREE.PerspectiveCamera(opts.fov || 26, 1, 0.1, 4000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const day = opts.mood === 'day';
  scene.add(new THREE.HemisphereLight(day ? 0xffffff : 0xdcd6ff, day ? 0x93a2b0 : 0x2a2140, day ? 2.3 : 1.9));
  const key = new THREE.DirectionalLight(day ? 0xfff6e8 : 0xfff3e0, day ? 2.4 : 2.1);
  key.position.set(day ? -26 : -18, day ? 40 : 30, day ? 22 : 16);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const d = 40;
  Object.assign(key.shadow.camera, { left: -d, right: d, top: d, bottom: -d, near: 1, far: 140 });
  scene.add(key);
  const fill = new THREE.DirectionalLight(day ? 0xc8dcff : 0x9f8cff, day ? 0.5 : 0.6);
  fill.position.set(22, 14, -18);
  scene.add(fill);

  const grid = new THREE.GridHelper(80, 20, 0x7b6cc4, 0x3b3060);
  grid.position.y = -0.02;
  grid.visible = false;
  scene.add(grid);

  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width | 0), Math.max(1, r.height | 0), false);
    camera.aspect = Math.max(1, r.width) / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function frame(object, dir = [1, 0.78, 1], pad = 1.12) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const radius = size.length() / 2;
    const dist = (radius * pad) / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
    const v = new THREE.Vector3(...dir).normalize().multiplyScalar(dist);
    camera.position.copy(center).add(v);
    controls.target.copy(center);
    camera.near = Math.max(0.1, dist / 100);
    camera.far = dist * 10;
    camera.updateProjectionMatrix();
    controls.update();
    return { box, size, center };
  }

  function draw() {
    controls.update();
    renderer.render(scene, camera);
  }
  (function loop() {
    requestAnimationFrame(loop);
    draw();
  })();
  // safety net: some embedded/background frames never fire requestAnimationFrame
  setInterval(draw, 200);

  return { renderer, scene, camera, controls, grid, frame, resize, draw };
}
