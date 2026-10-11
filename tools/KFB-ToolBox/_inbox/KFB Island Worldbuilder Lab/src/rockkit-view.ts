// Fels-Bausatz R1 · cut-out bench (rockkit.html): one formation from the recipe on a small clay ground pad, game light,
// four views (front, right, back, left) for the comparison with Georg's sheet. ?seed=&variant=default|sandy|dark&count=
// The pad is only for this bench; on an island the formation sits in the terrain (sunk part clipped here).
import * as THREE from 'three';
import { initClay, clayMaterial, claySeed } from './clay';
import { makeWorldLight } from './world/light';
import { buildRockKit, buildRockFormation, type RockVariant } from './environment/rock-kit';
import { ENV_ROLES } from './palettes';
import { H } from './environment/kits';

const q = new URLSearchParams(location.search);
const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.localClippingEnabled = true;
const scene = new THREE.Scene();
const WL = makeWorldLight(scene, renderer, { profile: 'kfb-day', fogFar: 0, background: q.get('bg') ? '#' + q.get('bg') : '#f3efe6' });
const camera = new THREE.PerspectiveCamera(28, innerWidth / innerHeight, 0.5, 400);

(async () => {
  await initClay();
  const variant = (q.get('variant') as RockVariant) || 'default', pal = q.get('pal') || 'protopia';
  if (q.get('lineup')) {   // plant candidates in a row (leaf role), to pick the tuft that matches the sheet
    const { loadSpecies } = await import('./environment/kits'), ids = q.get('lineup')!.split(','), leaf = new THREE.Color((ENV_ROLES[pal] as any)[q.get('col') ?? 'leaf'][q.get('col') ? 0 : 1]);
    for (let i = 0; i < ids.length; i++) { const sp = await loadSpecies(ids[i], 'bush'), g = sp.geo.clone(), c = new Float32Array(g.attributes.position.count * 3), sh = g.attributes.envShade;
      for (let k = 0; k < g.attributes.position.count; k++) { const f = sh ? Math.max(0.7, Math.min(1.25, sh.getX(k))) : 1; c.set([leaf.r * f, leaf.g * f, leaf.b * f], k * 3); }
      g.setAttribute('color', new THREE.BufferAttribute(c, 3)); const m = new THREE.Mesh(g, clayMaterial('nature', new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true }))); m.position.x = (i - (ids.length - 1) / 2) * 1.1 * H; scene.add(m);
      console.log('plant', ids[i], sp.tris); }
    camera.position.set(0, 1.4 * H, ids.length * 1.25 * H); camera.lookAt(0, 0.3 * H, 0); WL.keyTo(new THREE.Box3(new THREE.Vector3(-ids.length * H, 0, -H), new THREE.Vector3(ids.length * H, H, H)));
    renderer.render(scene, camera); (window as any).__rock = { ready: true, kit: {}, setView: () => renderer.render(scene, camera) }; (window as any).__kfb = { ready: true }; return;
  }
  // round 3 (KayKit stepped pyramid) by default; ?kit=r1 = the Kenney build of round 1
  const kit: Awaited<ReturnType<typeof buildRockKit>> & { blocks?: number; mossLoops?: number } = q.get('kit') === 'r1' ? await buildRockKit({ seed: Number(q.get('seed') ?? 7), variant, ...(q.get('count') ? { count: Number(q.get('count')) } : {}), palette: pal, ...(q.get('plants') ? { plantIds: q.get('plants')!.split(',') } : {}) })
    : await buildRockFormation({ seed: Number(q.get('seed') ?? 11), variant, palette: pal });
  const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.02);
  kit.group.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { (m.material as THREE.Material).clippingPlanes = [clip]; } });
  scene.add(kit.group);
  // bench pad: an organic clay disc (ground role on top, earth on the rounded rim; per-face colours, no gradient)
  const R0 = 1.75 * H, prof: THREE.Vector2[] = [];
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; prof.push(new THREE.Vector2(R0 - 0.18 * H + Math.sin(a) * 0.18 * H, -0.18 * H + Math.cos(a) * 0.18 * H)); }
  prof.unshift(new THREE.Vector2(0, 0)); prof.push(new THREE.Vector2(R0 - 0.1 * H, -0.32 * H), new THREE.Vector2(0, -0.32 * H));
  let pad: THREE.BufferGeometry = new THREE.LatheGeometry(prof.reverse(), 72); pad = pad.toNonIndexed();
  const pp = pad.attributes.position; for (let i = 0; i < pp.count; i++) { const x = pp.getX(i), z = pp.getZ(i), a = Math.atan2(z, x), k = 1 + 0.07 * Math.sin(a * 3 + 1) + 0.05 * Math.sin(a * 5 + 2.3); pp.setX(i, x * k); pp.setZ(i, z * k); }
  pad.computeVertexNormals();
  const R = ENV_ROLES[pal] as any, top = new THREE.Color(R.ground[1]), side = new THREE.Color(R.earth[1]), cols = new Float32Array(pp.count * 3), n = new THREE.Vector3();
  for (let f = 0; f < pp.count / 3; f++) { n.fromBufferAttribute(pad.attributes.normal, f * 3); const c = n.y > 0.75 ? top : side; for (let k = 0; k < 3; k++) cols.set([c.r, c.g, c.b], (f * 3 + k) * 3); }
  pad.setAttribute('color', new THREE.BufferAttribute(cols, 3)); claySeed(pad, 3);
  const padM = new THREE.Mesh(pad, clayMaterial('terrain', new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.95 }))); padM.receiveShadow = true; padM.position.y = -0.01; scene.add(padM);
  const box = new THREE.Box3().setFromObject(padM).union(new THREE.Box3(new THREE.Vector3(-1, 0, -1).multiplyScalar(H), new THREE.Vector3(1, kit.size.heightH, 1).multiplyScalar(H)));
  WL.keyTo(box);
  const views: Record<string, number> = { front: 0, right: Math.PI / 2, back: Math.PI, left: -Math.PI / 2 };
  const setView = (v: string, elevDeg = 16, dist = 7.6 * H) => { const a = views[v] ?? 0, e = (elevDeg * Math.PI) / 180, c = new THREE.Vector3(0, 1.15 * H, 0);
    camera.position.set(Math.sin(a) * Math.cos(e) * dist, c.y + Math.sin(e) * dist, Math.cos(a) * Math.cos(e) * dist); camera.lookAt(c); render(); };
  const render = () => { WL.update?.(0); renderer.render(scene, camera); };
  setView('front');
  (window as any).__rock = { ready: true, kit: { tris: kit.tris, size: kit.size, recipe: kit.recipe, foot: kit.foot, blocks: kit.blocks, mossLoops: kit.mossLoops }, setView }; (window as any).__kfb = { ready: true };
})().catch((e) => { (window as any).__rock = { error: String(e && e.stack || e) }; (window as any).__kfb = { ready: true }; console.error(e); });
