// Showcase-only staging: a tiny KayKit village on real terrain so lighting/shadows can be judged on real content.
// Not used in game mode.
import * as THREE from 'three';
import type { CoreContext } from '../../core/types';
import { hexToWorld, neighbor, hexDistance } from '../../core/hex';
import { HEX_SIZE } from '../../core/units';

const B = 'hex/buildings/blue/';
const N = 'hex/decoration/nature/';
export const DIORAMA_IDS = [
  B + 'building_well_blue', B + 'building_home_A_blue', B + 'building_home_B_blue', B + 'building_tavern_blue',
  B + 'building_blacksmith_blue', B + 'building_windmill_blue', B + 'building_church_blue',
  'hex/buildings/neutral/building_grain',
  N + 'trees_A_large', N + 'trees_B_medium', N + 'tree_single_A', N + 'rock_single_B',
  'hex/decoration/props/barrel',
  'forest/Tree_1_A_Color1', 'forest/Tree_2_B_Color1', 'forest/Tree_3_A_Color1', 'forest/Bush_1_A_Color1', 'forest/Bush_2_C_Color1',
  'forest/Rock_3_B_Color1', 'forest/Grass_1_A_Color1',
];

export interface DioramaSite { q: number; r: number; x: number; y: number; z: number }

/** Deterministic spiral search for a flat, dry patch (radius 2) near the origin. */
export function findSite(ctx: CoreContext): DioramaSite {
  const ok = (q: number, r: number) => {
    const c0 = ctx.world.cell(q, r);
    if (c0.water || c0.slope) return false;
    for (let dq = -2; dq <= 2; dq++)
      for (let dr = -2; dr <= 2; dr++) {
        if (hexDistance(0, 0, dq, dr) > 2) continue;
        const c = ctx.world.cell(q + dq, r + dr);
        if (c.water || c.slope || c.level !== c0.level || c.coastMask) return false;
      }
    return true;
  };
  for (let rad = 0; rad <= 14; rad++)
    for (let dq = -rad; dq <= rad; dq++)
      for (let dr = -rad; dr <= rad; dr++) {
        if (hexDistance(0, 0, dq, dr) !== rad) continue;
        try {
          if (ok(dq, dr)) {
            const p = hexToWorld(dq, dr);
            return { q: dq, r: dr, x: p.x, y: ctx.world.heightAt(p.x, p.z), z: p.z };
          }
        } catch {
          /* layer failure → keep searching */
        }
      }
  return { q: 0, r: 0, x: 0, y: ctx.world.heightAt(0, 0), z: 0 };
}

function place(ctx: CoreContext, group: THREE.Group, id: string, x: number, z: number, rotY: number, scale = 1, yOff = 0): void {
  const a = ctx.assets.get(id);
  if (!a) return;
  const y = ctx.world.heightAt(x, z) + yOff;
  const root = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY), new THREE.Vector3(scale, scale, scale));
  for (const p of a.parts) {
    const m = new THREE.Mesh(p.geometry, p.material);
    m.matrixAutoUpdate = false;
    m.matrix.multiplyMatrices(root, p.matrix);
    m.castShadow = true;
    m.receiveShadow = true;
    m.name = id;
    group.add(m);
  }
}

export interface Diorama { group: THREE.Group; site: DioramaSite; mixer: THREE.AnimationMixer | null; knightPos: THREE.Vector3 }

export async function buildDiorama(ctx: CoreContext): Promise<Diorama> {
  await ctx.assets.preload(DIORAMA_IDS);
  const site = findSite(ctx);
  const g = new THREE.Group();
  g.name = 'environment:diorama';
  const at = (d: number, ring = 1) => {
    let h = { q: site.q, r: site.r };
    for (let i = 0; i < ring; i++) h = neighbor(h.q, h.r, d);
    return hexToWorld(h.q, h.r);
  };
  // which way buildings face: their door is on local +Z (KayKit hex buildings); face the well
  const face = (x: number, z: number) => Math.atan2(site.x - x, site.z - z);

  place(ctx, g, B + 'building_well_blue', site.x, site.z, 0);
  // ring 1: houses around the well; edge 5 (toward the default camera) stays open as the village square
  const houses: [number, string][] = [
    [0, B + 'building_home_A_blue'],
    [1, B + 'building_tavern_blue'],
    [2, B + 'building_home_B_blue'],
    [3, B + 'building_blacksmith_blue'],
    [4, B + 'building_church_blue'],
  ];
  for (const [d, id] of houses) {
    const p = at(d);
    place(ctx, g, id, p.x, p.z, face(p.x, p.z));
  }
  const cellAt = (...dirs: number[]) => {
    let h = { q: site.q, r: site.r };
    for (const d of dirs) h = neighbor(h.q, h.r, d);
    return hexToWorld(h.q, h.r);
  };
  // ring 2: windmill + grain fields to the south-west, hex-pack woods to the north, forest-pack grove east
  { const p = cellAt(4, 4); place(ctx, g, B + 'building_windmill_blue', p.x, p.z, face(p.x, p.z)); }
  for (const dirs of [[4, 3], [4, 5], [3, 4]]) { const p = cellAt(...dirs); place(ctx, g, 'hex/buildings/neutral/building_grain', p.x, p.z, 0); }
  { const p = cellAt(1, 1); place(ctx, g, N + 'trees_A_large', p.x, p.z, 0); }
  { const p = cellAt(2, 2); place(ctx, g, N + 'trees_B_medium', p.x, p.z, 1); }
  { const p = cellAt(1, 2); place(ctx, g, N + 'trees_A_large', p.x, p.z, 2); }
  { const p = cellAt(2, 3); place(ctx, g, N + 'tree_single_A', p.x, p.z, 0.4); place(ctx, g, N + 'rock_single_B', p.x + 4, p.z + 3, 1.1); }
  const s0 = HEX_SIZE;
  const grove = cellAt(0, 0);
  const grove2 = cellAt(0, 5);
  const forest: [string, { x: number; z: number }, number, number, number][] = [
    ['forest/Tree_1_A_Color1', grove, 0.0, -0.2, 0.3],
    ['forest/Tree_2_B_Color1', grove, -0.45, 0.35, 1.2],
    ['forest/Tree_3_A_Color1', grove, 0.5, 0.35, 2.0],
    ['forest/Bush_1_A_Color1', grove, -0.5, -0.4, 0.5],
    ['forest/Rock_3_B_Color1', grove, 0.55, -0.45, 0.9],
    ['forest/Tree_1_A_Color1', grove2, 0.1, 0.0, 2.6],
    ['forest/Bush_2_C_Color1', grove2, -0.45, 0.3, 2.2],
    ['forest/Grass_1_A_Color1', grove2, 0.4, 0.4, 0],
  ];
  for (const [id, c, fx, fz, rot] of forest) place(ctx, g, id, c.x + fx * s0, c.z + fz * s0, rot);
  // square props
  const e5 = hexToWorld(neighbor(site.q, site.r, 5).q, neighbor(site.q, site.r, 5).r);
  place(ctx, g, 'hex/decoration/props/barrel', e5.x - 3.5, e5.z - 1.5, 0.3);
  place(ctx, g, 'forest/Bush_1_A_Color1', e5.x + 4.5, e5.z + 1.0, 1.4, 0.6);
  place(ctx, g, 'forest/Grass_1_A_Color1', e5.x + 1.5, e5.z + 3.5, 0.2);
  place(ctx, g, 'forest/Grass_1_A_Color1', e5.x - 2.0, e5.z + 2.5, 1.7);

  ctx.scene.add(g);

  // Knight with an idle loop, standing in front of the well
  let mixer: THREE.AnimationMixer | null = null;
  const kx = site.x + 0.5 * HEX_SIZE * 0.5 + 1, kz = site.z + 0.866 * HEX_SIZE * 0.75;
  const knightPos = new THREE.Vector3(kx, ctx.world.heightAt(kx, kz), kz);
  try {
    const lib = ctx.assets as unknown as { url(id: string): string | null; scaleOf(id: string): number };
    const url = lib.url('char/Knight');
    const animUrl = lib.url('anim/Rig_Medium_General');
    const knight = url ? await ctx.assets.loadGltf(url) : null;
    const anim = animUrl ? await ctx.assets.loadGltf(animUrl) : null;
    if (knight) {
      const k = knight.scene;
      k.scale.setScalar(lib.scaleOf('char/Knight'));
      k.position.copy(knightPos);
      k.rotation.y = 0.55; // face the default camera (edge 5)
      k.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.castShadow = true;
          m.receiveShadow = true;
        }
      });
      ctx.scene.add(k);
      const clip = anim?.animations.find((c) => /^Idle_A$/i.test(c.name)) ?? anim?.animations.find((c) => /idle/i.test(c.name));
      if (clip) {
        mixer = new THREE.AnimationMixer(k);
        mixer.clipAction(clip).play();
      }
    }
  } catch (e) {
    console.warn('[environment] diorama knight skipped', e);
  }
  return { group: g, site, mixer, knightPos };
}
