// Calibration rig (?showcase=props&view=rig): every building type at rotation 0 (door on local +Z) on a floating
// tile, with its ground footprint (green squares) and the door corridor used by the planner (red bar in front).
// Presets props.rig_<type> look at each from the front. Verification only; never part of the game build.
import * as THREE from 'three';
import type { CameraView, CoreContext } from '../../core/types';
import { ChunkBuilder } from '../../core/chunks';
import { orbitToView } from '../../core/debug';
import { buildFootprint, GRID } from './footprint';
import { DOOR_X, UNIT } from './plan';

const Y = 400;
const DX = 22;
const TYPES = ['home_A', 'home_B', 'tavern', 'blacksmith', 'market', 'church', 'windmill', 'lumbermill', 'stage_B', 'stage_C', 'well'];
const idOf = (t: string) => (t.startsWith('stage_') ? `hex/buildings/neutral/building_${t}` : `hex/buildings/blue/building_${t}_blue`);

export function rigIds(): string[] {
  return ['hex/tiles/base/hex_grass', ...TYPES.map(idOf)];
}

export function buildRig(ctx: CoreContext): void {
  const b = new ChunkBuilder({ cx: 0, cz: 0, cells: [] }, ctx.assets);
  const g = new THREE.Group();
  TYPES.forEach((t, i) => {
    const x = i * DX;
    b.add('hex/tiles/base/hex_grass', new THREE.Matrix4().makeTranslation(x, Y, 0));
    b.add(idOf(t), new THREE.Matrix4().makeTranslation(x, Y, 0));
    const a = ctx.assets.get(idOf(t));
    let front = 7.0;
    if (a) {
      const f = buildFootprint(a);
      front = f.box.z1 + 0.6;
      const pts: number[] = [];
      for (let k = 0; k < f.nx * f.nz; k++) {
        if (!f.solid[k]) continue;
        const px = f.minX + ((k % f.nx) + 0.5) * GRID, pz = f.minZ + (((k / f.nx) | 0) + 0.5) * GRID;
        pts.push(x + px, Y + 0.05, pz);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x00ff40, size: 0.12, depthTest: false })));
    }
    const d = DOOR_X[t];
    if (d) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry((d[1] - d[0]) * UNIT, 0.1, 1.2), new THREE.MeshBasicMaterial({ color: 0xff2020, transparent: true, opacity: 0.6 }));
      bar.position.set(x + ((d[0] + d[1]) / 2) * UNIT, Y + 0.05, front);
      g.add(bar);
    }
    // 1 m ticks along x in front of the tile
    for (let k = -6; k <= 6; k++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, k === 0 ? 1.2 : 0.6), new THREE.MeshBasicMaterial({ color: k === 0 ? 0x0040ff : 0x202020 }));
      tick.position.set(x + k, Y + 0.05, 7.6);
      g.add(tick);
    }
  });
  const m = b.finish();
  ctx.scene.add(m, g);
}

export const rigPresets: Record<string, (ctx: CoreContext) => CameraView> = Object.fromEntries([
  ...TYPES.map((t, i) => [`rig_${t}`, () => orbitToView({ target: [i * DX, Y + 2.5, 1], yaw: 0, pitch: 18, dist: 24, fov: 40 })]),
  ...TYPES.map((t, i) => [`rigtop_${t}`, () => orbitToView({ target: [i * DX, Y, 0.5], yaw: 0, pitch: 89, dist: 26, fov: 40 })]),
]);
