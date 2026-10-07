// Door-direction rig (?showcase=villages&view=doors): every building type × 6 rotations (k·60°), floating high above
// the world on hex_grass tiles, so the door side of each model can be read off screenshots taken from +Z.
// Verification-only; never used in the game build.
import * as THREE from 'three';
import type { CoreContext } from '../../core/types';
import { ChunkBuilder } from '../../core/chunks';
import { HEX_WIDTH } from '../../core/units';

export const RIG_Y = 400;
export const RIG_TYPES = [
  'home_A', 'home_B', 'tavern', 'blacksmith', 'market', 'church', 'well', 'windmill', 'watermill',
  'lumbermill', 'mine', 'barracks', 'archeryrange', 'tower_A', 'tower_B', 'tower_base', 'tower_catapult', 'castle',
];
export const RIG_DX = 18;
export const RIG_DZ = 30;

export function buildDoorRig(ctx: CoreContext, color = 'blue'): void {
  const b = new ChunkBuilder({ cx: 0, cz: 0, cells: [] }, ctx.assets);
  const up = new THREE.Vector3(0, 1, 0);
  RIG_TYPES.forEach((t, row) => {
    for (let k = 0; k < 6; k++) {
      const x = (k - 2.5) * RIG_DX, z = -row * RIG_DZ;
      const m = new THREE.Matrix4().compose(new THREE.Vector3(x, RIG_Y, z), new THREE.Quaternion().setFromAxisAngle(up, (k * Math.PI) / 3), new THREE.Vector3(1, 1, 1));
      b.add('hex/tiles/base/hex_grass', new THREE.Matrix4().makeTranslation(x, RIG_Y, z));
      b.add(`hex/buildings/${color}/building_${t}_${color}`, m);
    }
  });
  // neutral construction pieces (row 18)
  ['building_stage_A', 'building_stage_B', 'building_stage_C', 'building_scaffolding', 'building_destroyed', 'fence_stone_straight_gate'].forEach((t, k) => {
    const x = (k - 2.5) * RIG_DX, z = -18 * RIG_DZ;
    b.add('hex/tiles/base/hex_grass', new THREE.Matrix4().makeTranslation(x, RIG_Y, z));
    b.add('hex/buildings/neutral/' + t, new THREE.Matrix4().makeTranslation(x, RIG_Y, z));
  });
  const g = b.finish();
  g.name = 'villages door rig';
  ctx.scene.add(g);
  // +X arrows (local front reference) under the first column
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-2.5 * RIG_DX - 9, RIG_Y + 0.5, 6), 6, 0xff2020, 2, 1.5);
  ctx.scene.add(arrow);
  void HEX_WIDTH;
}

export function rigTypeIds(color = 'blue'): string[] {
  return ['hex/tiles/base/hex_grass', ...RIG_TYPES.map((t) => `hex/buildings/${color}/building_${t}_${color}`),
    ...['building_stage_A', 'building_stage_B', 'building_stage_C', 'building_scaffolding', 'building_destroyed', 'fence_stone_straight_gate'].map((t) => 'hex/buildings/neutral/' + t)];
}
