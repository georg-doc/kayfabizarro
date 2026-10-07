// /?showcase=assets (view=scale, default) — scale QA: Knight (Idle_A) vs house door, props, trees.
// Every item carries an upright label with its height in metres (from StaticAsset.bounds, pack scale included),
// and red/white ruler poles (0.5 m bands) stand next to the door and in the prop line-up.
import * as THREE from 'three';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CameraView, CoreContext } from '../../core/types';
import { hexToWorld } from '../../core/hex';
import { makeBatch, trs } from './showcase-util';

const PROPS: [string, number][] = [
  ['hex/decoration/props/barrel', 2.2],
  ['hex/decoration/props/crate_A_big', 4.4],
  ['hex/decoration/props/crate_A_small', 6.4],
  ['hex/decoration/props/sack', 8.0],
  ['hex/decoration/props/bucket_water', 9.6],
  ['hex/decoration/props/wheelbarrow', 11.6],
  ['hex/decoration/props/weaponrack', 14.0],
  ['hex/decoration/props/target', 16.0],
  ['hex/decoration/props/ladder', 18.2],
  ['hex/decoration/props/flag_blue', 20.4],
];
const TREES: [string, number][] = [
  ['hex/decoration/nature/tree_single_A', 48],
  ['hex/decoration/nature/trees_A_small', 56],
  ['hex/decoration/nature/trees_A_large', 69],
  ['forest/Tree_1_A_Color1', 82],
  ['forest/Tree_2_A_Color1', 90],
  ['forest/Tree_3_A_Color1', 98],
  ['forest/Tree_4_A_Color1', 106],
  ['forest/Tree_Bare_1_A_Color1', 113],
  ['forest/Bush_1_A_Color1', 118],
  ['forest/Bush_2_A_Color1', 121],
  ['forest/Bush_3_A_Color1', 124],
  ['forest/Bush_4_A_Color1', 127],
  ['forest/Rock_3_A_Color1', 130.5],
  ['hex/buildings/blue/building_home_B_blue', 144],
  ['hex/buildings/blue/building_tavern_blue', 160],
];
const HOUSE = 'hex/buildings/blue/building_home_A_blue';
const HOUSE_X = -24;

const mixers: THREE.AnimationMixer[] = [];
export function tickScale(dt: number): void {
  for (const m of mixers) m.update(dt);
}

/** Upright text label (faces +Z). */
function label(text: string, x: number, y: number, z: number, h = 0.45, color = '#fff'): THREE.Mesh {
  const c = document.createElement('canvas');
  const g = c.getContext('2d')!;
  g.font = 'bold 44px system-ui, sans-serif';
  const w = Math.ceil(g.measureText(text).width) + 20;
  c.width = w;
  c.height = 64;
  g.fillStyle = 'rgba(15,20,30,0.82)';
  g.fillRect(0, 0, w, 64);
  g.font = 'bold 44px system-ui, sans-serif';
  g.fillStyle = color;
  g.textBaseline = 'middle';
  g.fillText(text, 10, 34);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry((h * w) / 64, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true }));
  m.position.set(x, y, z);
  return m;
}

/** Ruler pole: 0.5 m bands (red/white), a thicker black tick every metre, total `h` metres. */
function ruler(x: number, z: number, h = 4): THREE.Group {
  const g = new THREE.Group();
  const red = new THREE.MeshBasicMaterial({ color: '#e02020', toneMapped: false });
  const white = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
  const black = new THREE.MeshBasicMaterial({ color: '#000000', toneMapped: false });
  const band = new THREE.BoxGeometry(0.12, 0.5, 0.12);
  for (let i = 0; i < h * 2; i++) {
    const b = new THREE.Mesh(band, i % 2 ? white : red);
    b.position.set(x, 0.25 + i * 0.5, z);
    g.add(b);
  }
  const tick = new THREE.BoxGeometry(0.3, 0.025, 0.14);
  for (let m = 1; m <= h; m++) {
    const t = new THREE.Mesh(tick, black);
    t.position.set(x, m, z);
    g.add(t);
    g.add(label(`${m} m`, x - 0.45, m, z, 0.18));
  }
  return g;
}

async function knight(ctx: CoreContext): Promise<THREE.Object3D | null> {
  const a = ctx.assets as unknown as { url(id: string): string | null; scaleOf(id: string): number };
  const url = a.url('char/Knight');
  const g = url ? await ctx.assets.loadGltf(url) : null;
  if (!g) return null;
  const k = skClone(g.scene);
  k.scale.setScalar(a.scaleOf('char/Knight'));
  k.traverse((o) => ((o as THREE.Mesh).castShadow = true));
  const au = a.url('anim/Rig_Medium_General');
  const ag = au ? await ctx.assets.loadGltf(au) : null;
  const clip = ag?.animations.find((c) => c.name === 'Idle_A');
  if (clip) {
    const mixer = new THREE.AnimationMixer(k);
    mixer.clipAction(clip).play();
    mixer.update(0.5);
    mixers.push(mixer);
  }
  return k;
}

export interface ScaleReport { knight: number; items: Record<string, number> }
export const scaleReport: ScaleReport = { knight: 0, items: {} };

export async function showcaseScale(ctx: CoreContext): Promise<void> {
  const ids = [HOUSE, ...PROPS.map((p) => p[0]), ...TREES.map((t) => t[0]), 'hex/tiles/base/hex_grass'];
  await ctx.assets.preload(ids);
  const batch = makeBatch(ctx);
  const root = new THREE.Group();

  // ground: hex_grass field
  for (let q = -6; q <= 14; q++) for (let r = -3; r <= 3; r++) {
    const p = hexToWorld(q, r);
    if (p.x < -50 || p.x > 185) continue;
    batch.add('hex/tiles/base/hex_grass', trs(p.x, 0, p.z));
  }
  const place = (id: string, x: number, z = 0, rot = 0) => {
    const a = ctx.assets.get(id);
    if (!a) return;
    batch.add(id, trs(x, 0, z, rot));
    const h = a.bounds.max.y - Math.max(0, a.bounds.min.y);
    scaleReport.items[id.split('/').pop()!] = +h.toFixed(2);
    const w = Math.max(a.bounds.max.x - a.bounds.min.x, a.bounds.max.z - a.bounds.min.z);
    // hex 'trees_*_small/large' name the clump footprint/number of trees, not the tree height → show both
    const clump = /trees_[AB]_/.test(id) ? ` (clump ${w.toFixed(1)} m wide)` : '';
    root.add(label(`${id.split('/').pop()!.replace('_Color1', '').replace('building_', '')} ${h.toFixed(2)} m${clump}`, x, a.bounds.max.y + 0.6, z + 0.3, x > 40 && x < 135 ? (h > 3 ? 0.75 : 0.45) : h > 4 ? 0.9 : 0.32));
  };

  // house + door test (house rotated so its door faces +Z, toward the camera)
  place(HOUSE, HOUSE_X, 0, 0);
  for (const [id, x] of PROPS) place(id, x);
  for (const [id, x] of TREES) place(id, x);


  // rulers
  root.add(ruler(HOUSE_X + 2.2, 4.2, 4));
  root.add(ruler(-0.4, 0.6, 3));
  root.add(ruler(77.3, 4, 12));

  // knights: at the door, in the prop line, among the trees
  const kp: [number, number, number][] = [[HOUSE_X + 1.1, 0, 3.6], [0.6, 0, 0.3], [78.3, 0, 5], [140, 0, 6]];
  for (const [x, y, z] of kp) {
    const k = await knight(ctx);
    if (!k) break;
    k.position.set(x, y, z);
    root.add(k);
    if (!scaleReport.knight) {
      k.updateMatrixWorld(true);
      const kb = new THREE.Box3().setFromObject(k, true); // precise: skinned vertices in the Idle_A pose
      scaleReport.knight = +(kb.max.y - kb.min.y).toFixed(2);
      root.add(label(`Knight ${scaleReport.knight.toFixed(2)} m`, x, kb.max.y + 0.35, z + 0.3, 0.28, '#ffe14a'));
    }
  }

  const g = batch.finish();
  ctx.scene.add(g, root);
  (window as any).__kfbScale = scaleReport;
}

export const scalePresets: Record<string, (ctx: CoreContext) => CameraView> = {
  lineup: () => ({ position: [10.5, 1.6, 18], target: [10.5, 1.0, 0], fov: 45 }),
  door: () => ({ position: [HOUSE_X + 1.5, 2.0, 13], target: [HOUSE_X + 1.0, 2.0, 0], fov: 45 }),
  trees: () => ({ position: [92, 2, 30], target: [92, 9, 0], fov: 60 }),
  houses: () => ({ position: [148, 5, 40], target: [148, 4, 0], fov: 50 }),
  scale_overview: () => ({ position: [60, 40, 110], target: [60, 0, 0], fov: 50 }),
};
