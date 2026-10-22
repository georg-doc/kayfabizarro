// Scale audit (read-only): every catalogue asset at its current catalogue scale, next to the reference figure
// (Mummy B, Medium rig, FIG_SCALE), orthographic front view, height lines in figure heights H.
// Changes nothing in the world. Open /lineup.html; presets row0..rowN (front) and rowN-back.
import * as THREE from 'three';
import { ASSETS } from './editor';
import { loadModel } from './island/island';
import { buildResident } from './residents/resident';
import { initClay, clayMaterial, claySeed } from './clay';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FIG_SCALE } from './scale';
import { loadSpecies, type EnvRole } from './environment/kits';
import { envMaterial, ENV_UNIFORMS } from './environment/material';
import { PALETTES } from './palettes';

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#eef3f8');
scene.add(new THREE.HemisphereLight('#dfeeff', '#c7a790', 1.4));
const sun = new THREE.DirectionalLight('#fff1dc', 2.0);
sun.position.set(-40, 80, 120);
scene.add(sun);

const errors: string[] = [];
// shadow contract (same as main.ts, copied: importing main.ts would boot the worldbuilder)
function applyShadowContract(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.castShadow) return;
    for (const mat of Array.isArray(m.material) ? m.material : [m.material]) if (mat.side === THREE.FrontSide) { mat.shadowSide = THREE.FrontSide; mat.needsUpdate = true; }
  });
}
// row 0 = reference: KayKit Dungeon doorway at the figure factor (the dungeon kit is authored for these characters)
const REF: Item[] = [
  { label: 'Dungeon-Tür (Referenz, Faktor 1,6)', asset: 'dungeon/wall_doorway.gltf', scale: FIG_SCALE, inDoor: true },
  { label: 'Farmer A · Medium', asset: 'figures/Farmer_A_NoEyes.glb', scale: FIG_SCALE, figure: true },
  { label: 'Demon Lord · Large', asset: 'figures/DemonLord_NoEyes.glb', scale: FIG_SCALE, figure: true },
];
// Tiny Treats at native scale 1: measured here, its kit factor follows from the doorway (target 1,2 H)
const TT = (): Item[] => ['door_modular', 'wall_modular_panelled_bakery_doorway', 'chair', 'table_round_A', 'counter_table', 'display_case_short', 'bread_oven', 'house', 'bench_A', 'mailbox', 'fence_straight', 'gate_single', 'tree', 'bush']
  .map((k) => ({ label: `TT · ${k.replace('wall_modular_panelled_bakery_', 'wall_')}`, asset: `tinytreats/${k}.gltf`, scale: TT_SCALE }));
const CARS = [
  { label: 'Retro · Cicada', asset: 'cars/Cicada/CICADA_LOW.fbx', scale: 1 },
  { label: 'Retro · Cruiser', asset: 'cars/Cruiser/CRUISER_LOW.fbx', scale: 1 },
  { label: 'Retro · Carrier', asset: 'cars/Carrier/CARRIER_LOW.fbx', scale: 1 },
  ...['hatchback', 'sedan', 'stationwagon', 'taxi', 'police'].map((k) => ({ label: `KayKit · ${k}`, asset: `city/car_${k}.gltf`, scale: 4.5 })),
];
// nature kits (public/assets/env/…): Quaternius FBX at ?q= (default 1, native), KayKit Forest at the KayKit factor
const Q_SCALE = Number(new URLSearchParams(location.search).get('q') ?? 1);
const NATURE = (): Item[] => [
  ...['CommonTree_1', 'CommonTree_Autumn_1', 'PineTree_1', 'PineTree_Snow_1', 'BirchTree_1', 'Willow_1', 'PalmTree_1', 'Cactus_1', 'BushBerries_1', 'Rock_Moss_1', 'Plant_1', 'Flowers', 'Grass', 'TreeStump_Moss']
    .map((k) => ({ label: `Q · ${k}`, asset: `env/quaternius/${k}.fbx`, scale: Q_SCALE, env: true })),
  ...['Tree_1_A_Color1', 'Tree_2_C_Color1', 'Tree_4_A_Color1', 'Bush_1_A_Color1', 'Rock_2_H_Color1', 'Grass_2_B_Singlesided_Color1']
    .map((k) => ({ label: `KK · ${k.replace('_Color1', '')}`, asset: `env/kaykit-forest/${k}.gltf`, scale: FIG_SCALE, env: true })),
  { label: 'TT · tree', asset: 'tinytreats/tree.gltf', scale: FIG_SCALE },
];
const ENV = new Map<string, Promise<THREE.Object3D>>();
/** env assets: own loader (FBX or glTF), base on y = 0, clay 'nature' on every mesh */
function loadEnv(asset: string): Promise<THREE.Object3D> {
  let p = ENV.get(asset);
  if (!p) {
    const url = '/assets/' + asset;
    p = (asset.endsWith('.fbx') ? new FBXLoader().loadAsync(url) : new GLTFLoader().loadAsync(url).then((g) => g.scene)).then((root) => {
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root), c = box.getCenter(new THREE.Vector3());
      root.position.set(-c.x, -box.min.y, -c.z);
      const wrap = new THREE.Group();
      wrap.add(root);
      let seed = 1;
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        claySeed(m.geometry, seed++);
        // ?clay=1 puts K2 'nature' on top; default shows the kit colours unchanged (style comparison)
        const mats = (Array.isArray(m.material) ? m.material : [m.material]).map((mm: any) => {
          // Quaternius FBX stores Blender's linear diffuse; FBXLoader reads it as sRGB and darkens it a second time → undo once
          const col = mm.color ? mm.color.clone() : new THREE.Color('#ffffff');
          if (asset.endsWith('.fbx')) col.convertLinearToSRGB();
          const std = mm.isMeshStandardMaterial ? mm : new THREE.MeshStandardMaterial({ color: col, map: mm.map ?? null, vertexColors: !!mm.vertexColors, roughness: 0.85 });
          return new URLSearchParams(location.search).get('clay') === '1' ? clayMaterial('nature', std) : std;
        });
        m.material = Array.isArray(m.material) ? mats : mats[0];
        m.castShadow = m.receiveShadow = true;
      });
      return wrap;
    });
    ENV.set(asset, p);
  }
  return p;
}
type Item = { label: string; asset: string; scale: number; inDoor?: boolean; figure?: boolean; env?: boolean; kit?: [string, EnvRole] };
// Environment Kit R1 · biome sheets: ?envrow=q:PalmTree_1@anchor,…&pal=wueste shows kit species normalised to their role
// height (spec §2), recoloured to the island palette with clay K2 'nature'. ?rows=8 builds only that row (fast).
const QS = new URLSearchParams(location.search);
const ENVROW = (QS.get('envrow') ?? '').split(',').filter((x) => x.includes('@'));
const ONLY = QS.get('rows')?.split(',').map(Number) ?? null;
if (QS.get('recolor') === '0') ENV_UNIFORMS.uEnvRecolor.value = 0; // raw kit colours (inventory view)
async function loadKitSpecies(id: string, role: EnvRole): Promise<THREE.Object3D> {
  const sp = await loadSpecies(id, role);
  const pal = PALETTES[QS.get('pal') ?? 'canyon'] ?? PALETTES.canyon;
  const m = new THREE.Mesh(sp.geo, envMaterial(pal, 1).material);
  m.castShadow = m.receiveShadow = true;
  const g = new THREE.Group();
  g.add(m);
  return g;
}
const TT_SCALE = Number(new URLSearchParams(location.search).get('tt') ?? 1);
const ROWS: { label: string; filter: (a: string) => boolean }[] = [
  { label: 'Referenz: KayKit Dungeon-Tür im Figur-Faktor', filter: () => false },
  { label: 'Autos: Retro Cartoon Cars (6 m) + KayKit City Cars (Faktor 4,5 wie Stadthaus E)', filter: () => false },
  { label: `Tiny Treats (Faktor ${new URLSearchParams(location.search).get('tt') ?? 1})`, filter: () => false },
  { label: `Natur: Quaternius Ultimate Nature (Faktor ${new URLSearchParams(location.search).get('q') ?? 1}) · KayKit Forest (1,6) · Tiny Treats (1,6)`, filter: () => false },
  { label: 'Autos + Requisiten (Katalog)', filter: (a) => a.startsWith('cars/') || a.startsWith('mummy/') },
  { label: 'Hex-Gebäude (KayKit Medieval Hexagon)', filter: (a) => a.startsWith('hex/') },
  { label: 'Stadt + Park (KayKit City Builder)', filter: (a) => a.startsWith('city/') || a.startsWith('park/') },
  { label: 'Schnee (KayKit Medieval Snow Biome)', filter: (a) => a.startsWith('snow/') },
  ...(ENVROW.length ? [{ label: `Environment Kit R1 · Kandidaten (Palette ${QS.get('pal') ?? 'canyon'}, normiert auf Rollenhöhe)`, filter: () => false }] : []),
];
const GAP = 3, ROW_Z = 200;
const rows: { label: string; z: number; x0: number; x1: number; top: number; g: THREE.Group }[] = [];
const table: Record<string, unknown>[] = [];
const labels: { el: HTMLDivElement; p: THREE.Vector3; row: number }[] = [];
let curRow = 0;
let H = 3.6;

function label(html: string, p: THREE.Vector3, row: number) {
  const el = document.createElement('div');
  el.innerHTML = html;
  document.getElementById('labels')!.appendChild(el);
  labels.push({ el, p, row });
}

/** horizontal reference lines at multiples of H across a row, slightly in front of the objects */
function hLines(x0: number, x1: number, z: number, g: THREE.Group) {
  const MC = 4 * FIG_SCALE; // MacroCell: 4 KayKit units (Dungeon module)
  const marks: [number, string][] = [[1, '#d1495b'], [1.2, '#f08a24'], [MC / H, '#2a9d8f'], [2, '#8a8a8a'], [3, '#b0b0b0'], [4, '#c8c8c8']];
  for (let x = Math.ceil(x0 / MC) * MC; x <= x1; x += MC) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 6), new THREE.MeshBasicMaterial({ color: '#2a9d8f' }));
    tick.position.set(x, 0.03, z - 3);
    g.add(tick);
  }
  for (const [k, col] of marks) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x0, k * H, z), new THREE.Vector3(x1, k * H, z)]);
    const ln = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: col, depthTest: false, transparent: true, opacity: 0.85 }));
    ln.renderOrder = 10;
    g.add(ln);
  }
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 + 10, 40), new THREE.MeshStandardMaterial({ color: '#d9cdb8' }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set((x0 + x1) / 2, 0, z - 10);
  ground.receiveShadow = true;
  g.add(ground);
}

async function figure(x: number, z: number, parent: THREE.Object3D = scene) {
  const r = await buildResident({ id: 'ref', asset: 'mummy/Mummy_B_NoEyes.glb', anim: 'Idle_A', eyes: '#f6bd99', x, z, rot: 0 } as any);
  r.obj.position.set(x, 0, z);
  parent.add(r.obj);
  return r;
}

async function boot() {
  await initClay();
  // reference height from the figure itself
  const ref = await figure(-1000, 0);
  ref.obj.updateMatrixWorld(true);
  H = +new THREE.Box3().setFromObject(ref.obj, true).getSize(new THREE.Vector3()).y.toFixed(2);
  scene.remove(ref.obj);
  document.getElementById('title')!.textContent = `Maßstab-Aufreihung · H = Figurhöhe Medium = ${H} Einheiten (Mummy B, Faktor 1,6) · Stand: Katalogwerte heute`;
  document.getElementById('legend')!.innerHTML =
    '<span style="color:#d1495b">━ 1 H</span> &nbsp; <span style="color:#f08a24">━ 1,2 H (Tür)</span> &nbsp; <span style="color:#2a9d8f">━ 1 MacroCell = 4 KayKit = 6,4 (Stockwerk) · Bodenmarken alle 6,4</span> &nbsp; <span style="color:#8a8a8a">━ 2 / 3 / 4 H</span>';
  const live: { update(dt: number): void }[] = [];
  for (let ri = 0; ri < ROWS.length; ri++) {
    const z = -ri * ROW_Z;
    let x = 0, top = 0;
    const rg = new THREE.Group();
    scene.add(rg);
    if (ONLY && !ONLY.includes(ri)) { rows.push({ label: ROWS[ri].label, z, x0: 0, x1: 1, top: 0, g: rg }); continue; }
    const items: Item[] = ri === 0 ? REF : ri === 1 ? CARS : ri === 2 ? TT() : ri === 3 ? NATURE() : ri === 8 ? ENVROW.map((e) => { const [id, role] = e.split('@'); return { label: `${id} · ${role}`, asset: id, scale: 1, kit: [id, role as EnvRole] }; }) : ASSETS.filter((e) => ROWS[ri].filter(e.asset));
    for (const a of items) {
      try {
        const o = new THREE.Group();
        if (a.figure) {
          const r = await buildResident({ id: a.label, asset: a.asset, anim: 'Idle_A', eyes: '#c99a7a', x: 0, z: 0, rot: 0 } as any);
          live.push(r);
          o.add(r.obj);
        } else {
          o.add(a.kit ? await loadKitSpecies(a.kit[0], a.kit[1]) : (await (a.env ? loadEnv(a.asset) : loadModel(a.asset))).clone());
          o.scale.setScalar(a.scale);
        }
        o.updateMatrixWorld(true);
        const s = new THREE.Box3().setFromObject(o, true).getSize(new THREE.Vector3());
        // figure on the left of each object, both standing on y = 0
        const fx = x + 1.2;
        const ox = a.inDoor ? fx + 1.6 + s.x / 2 : fx + 1.6 + s.x / 2;
        live.push(await figure(fx, z + 1, rg));
        if (a.inDoor) live.push(await figure(ox, z + s.z / 2 + 0.6, rg)); // second figure right in the doorway
        o.position.set(ox, 0, z);
        rg.add(o);
        top = Math.max(top, s.y);
        label(`<b>${a.label}</b>Faktor ${a.scale} · ${s.x.toFixed(1)} × ${s.y.toFixed(1)} · ${(s.y / H).toFixed(2)} H`, new THREE.Vector3(ox, 0, z + 4), ri);
        table.push({ row: ri, x0: fx - 1, x1: ox + s.x / 2 + 0.5, top: s.y, label: a.label, asset: a.asset, scale: a.scale, w: +s.x.toFixed(2), h: +s.y.toFixed(2), d: +s.z.toFixed(2), hInH: +(s.y / H).toFixed(2) });
        x = ox + s.x / 2 + GAP;
      } catch (e) {
        errors.push(`${a.asset}: ${e}`);
      }
    }
    hLines(-2, x, z + 3, rg);
    rows.push({ label: ROWS[ri].label, z, x0: -2, x1: x, top, g: rg });
  }
  applyShadowContract(scene);
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    for (const l of live) l.update(dt);
    renderer.render(scene, camera);
    for (const l of labels) {
      const v = l.p.clone().project(camera);
      l.el.style.left = `${(v.x * 0.5 + 0.5) * innerWidth}px`;
      l.el.style.top = `${(-v.y * 0.5 + 0.5) * innerHeight + 6}px`;
      l.el.style.display = l.row === curRow && Math.abs(v.x) < 1.2 ? '' : 'none';
    }
  });
  setCamera('row0');
  (window as any).__kfb.ready = true;
}

let camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
function setCamera(p: string) {
  if (p.startsWith('item')) {
    // close-up of one catalogue entry with its figure (front), for reading the door height against the H lines
    const it = table[Number(p.slice(4))] as any;
    if (!it) return;
    const r0 = rows[it.row];
    curRow = it.row;
    for (const x of rows) x.g.visible = x === r0;
    const w = it.x1 - it.x0 + 2, h = Math.max(it.top, 1.6 * H) * 1.1 + 2;
    const aspect = innerWidth / innerHeight;
    const halfW = Math.max(w / 2, (h / 2) * aspect), halfH = halfW / aspect;
    camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 2000);
    const cx = (it.x0 + it.x1) / 2, cy = halfH - 2;
    camera.position.set(cx, cy, r0.z + 300);
    camera.lookAt(cx, cy, r0.z);
    camera.updateMatrixWorld();
    for (const l of labels) l.el.style.visibility = 'visible';
    document.getElementById('title')!.textContent = `${it.label} · Faktor ${it.scale} · ${it.hInH} H hoch · H = ${H}`;
    return;
  }
  const back = p.endsWith('-back');
  const ri = Number(p.replace('row', '').replace('-back', '')) || 0;
  const r = rows[ri];
  if (!r) return;
  curRow = ri;
  for (const x of rows) x.g.visible = x === r;
  const w = r.x1 - r.x0 + 6, h = Math.max(r.top, 2.2 * H) * 1.15 + 6; // +6: room for the labels below ground
  const aspect = innerWidth / innerHeight;
  const halfW = Math.max(w / 2, (h / 2) * aspect), halfH = halfW / aspect;
  camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 2000);
  const cx = (r.x0 + r.x1) / 2, cy = halfH - 6;
  camera.position.set(cx, cy, r.z + (back ? -300 : 300));
  camera.lookAt(cx, cy, r.z);
  camera.updateMatrixWorld();
  for (const l of labels) l.el.style.visibility = back ? 'hidden' : 'visible';
  document.getElementById('title')!.dataset.row = r.label;
  (document.getElementById('legend')!.firstElementChild as HTMLElement | null)?.setAttribute('data-row', r.label);
  const t = document.getElementById('title')!; t.textContent = `${r.label} · H = Figurhöhe Medium = ${H} Einheiten (Mummy B, Faktor 1,6) · Katalogwerte heute${back ? ' · Rückseite' : ''}`;
}

(window as any).__kfb = {
  ready: false,
  errors,
  warnings: [],
  presets: () => rows.flatMap((_, i) => [`row${i}`, `row${i}-back`]),
  setCamera,
  setTime: () => null,
  waitIdle: async () => { await new Promise((r) => setTimeout(r, 400)); },
  player: () => null,
  stats: () => ({ H, rows: rows.length }),
  table: () => ({ H, table }),
};
boot().catch((e) => { console.error(e); errors.push(String(e?.stack ?? e)); });
