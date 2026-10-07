// Showcase staging for the camera module: a KayKit building (solid box collider) and a small tree grove
// (trunk cylinders = solid; crowns/bushes are visual only) near a flat land spot.
import * as THREE from 'three';
import type { CoreContext } from '../../core/types';
import { hexToWorld } from '../../core/hex';
import { WORLD_GROUPS } from '../../core/groups';

export const STAGE_ASSETS = [
  'hex/buildings/blue/building_tavern_blue',
  'forest/Tree_1_A_Color1',
  'forest/Tree_2_A_Color1',
  'forest/Tree_3_A_Color1',
  'forest/Tree_1_B_Color1',
  'forest/Tree_2_C_Color1',
  'forest/Bush_1_A_Color1',
  'forest/Bush_2_A_Color1',
];

export interface Stage {
  /** stage centre on the ground */
  centre: THREE.Vector3;
  spawn: THREE.Vector3;
  spawnHeading: number;
  /** building centre (ground) and half extents */
  wall: { centre: THREE.Vector3; half: THREE.Vector3 };
  /** loop path for the stand-in (ground points) */
  path: THREE.Vector3[];
}

/** Find a flat, dry land spot near the origin (all cells within radius 2 at the same level, no slopes). */
function findSpot(ctx: CoreContext): { q: number; r: number } {
  const ok = (q: number, r: number) => {
    const c = ctx.world.cell(q, r);
    if (c.water || c.slope || c.roadMask || c.riverMask || c.building) return false;
    for (let dq = -2; dq <= 2; dq++)
      for (let dr = -2; dr <= 2; dr++) {
        if (Math.abs(dq + dr) > 2) continue;
        const n = ctx.world.cell(q + dq, r + dr);
        if (n.water || n.slope || n.level !== c.level || n.building) return false;
      }
    return true;
  };
  for (let rad = 0; rad <= 10; rad++)
    for (let q = -rad; q <= rad; q++)
      for (let r = -rad; r <= rad; r++) {
        if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) !== rad) continue;
        if (ok(q, r)) return { q, r };
      }
  return { q: 0, r: 0 };
}

/** Shared uniforms of the showcase foliage material (updated by the camera module each frame). */
export const stageUniforms = {
  uStCam: { value: new THREE.Vector3() },
  uStPlayer: { value: new THREE.Vector3() },
};
const ditherMats = new Map<THREE.Material, THREE.Material>();
/**
 * Showcase trees/bushes (and the tavern) use the nature module's convention (ARCHITECTURE §5): fragments are
 * screen-door dithered near the camera and inside the camera → player band (CORE_REQUESTS: same for buildings/terrain).
 */
function ditherMaterial(base: THREE.Material): THREE.Material {
  let m = ditherMats.get(base);
  if (m) return m;
  const c = (base as THREE.MeshStandardMaterial).clone();
  c.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, stageUniforms);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vStW;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvStW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uStCam; uniform vec3 uStPlayer; varying vec3 vStW;
        float stIGN(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
        {
          float a = smoothstep(0.8, 3.0, distance(vStW, uStCam));
          vec3 P = uStPlayer + vec3(0.0, 1.0, 0.0);
          vec3 d = P - uStCam; float L = max(length(d), 0.001); vec3 dir = d / L;
          float t = dot(vStW - uStCam, dir);
          if (t > 0.0 && t < L + 0.5) {
            float r = length(vStW - (uStCam + dir * t));
            a = min(a, mix(1.0, smoothstep(0.8, 2.6, r), 1.0 - smoothstep(L + 0.1, L + 0.5, t)));
          }
          if (a < 0.999 && a <= stIGN(gl_FragCoord.xy)) discard;
        }`);
  };
  c.customProgramCacheKey = () => 'camera-stage-dither-v2';
  ditherMats.set(base, c);
  return c;
}

function placeAsset(ctx: CoreContext, group: THREE.Group, id: string, m: THREE.Matrix4, dither = false): THREE.Box3 | null {
  const a = ctx.assets.get(id);
  if (!a) return null;
  for (const p of a.parts) {
    const mesh = new THREE.Mesh(p.geometry, dither ? ditherMaterial(p.material) : p.material);
    mesh.matrixAutoUpdate = false;
    mesh.matrix.multiplyMatrices(m, p.matrix);
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
  }
  return a.bounds.clone().applyMatrix4(m);
}

/** Measure a tree mesh: trunk (vertices below 1.2 m) and crown (vertices spread > 1.6 m from the trunk axis). */
function fitTree(ctx: CoreContext, id: string, m: THREE.Matrix4, base: THREE.Vector3) {
  const a = ctx.assets.get(id)!;
  const v = new THREE.Vector3();
  const mm = new THREE.Matrix4();
  const trunk = new THREE.Box3();
  const all: THREE.Vector3[] = [];
  for (const p of a.parts) {
    mm.multiplyMatrices(m, p.matrix);
    const pos = p.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(mm);
      all.push(v.clone());
      if (v.y < base.y + 1.2) trunk.expandByPoint(v);
    }
  }
  const tc = trunk.isEmpty() ? base.clone() : trunk.getCenter(new THREE.Vector3());
  const tsz = trunk.isEmpty() ? new THREE.Vector3(0.6, 0, 0.6) : trunk.getSize(new THREE.Vector3());
  const trunkR = THREE.MathUtils.clamp(Math.max(tsz.x, tsz.z) / 2 * 0.85, 0.25, 0.95);
  const crown = new THREE.Box3();
  let top = 0;
  for (const p of all) {
    top = Math.max(top, p.y - base.y);
    if (Math.hypot(p.x - tc.x, p.z - tc.z) > trunkR + 1.6) crown.expandByPoint(p);
  }
  const cc = crown.isEmpty() ? tc : crown.getCenter(new THREE.Vector3());
  const csz = crown.isEmpty() ? new THREE.Vector3(4, 0, 4) : crown.getSize(new THREE.Vector3());
  const crownBottom = Math.max(2.2, crown.isEmpty() ? top * 0.4 : crown.min.y - base.y);
  return {
    tx: tc.x, tz: tc.z, trunkR, trunkTop: Math.max(crownBottom, 2.5),
    cx: cc.x, cz: cc.z, crownR: Math.min(csz.x, csz.z) * 0.45, crownBottom, top,
  };
}

const crowns: { x: number; z: number; r: number; base: number }[] = [];
/** Showcase stand-in for the nature service's canopyBaseAt: lowest crown base over the disk (x, z, r), or null. */
export function stageCanopyBaseAt(x: number, z: number, r = 0): number | null {
  let best: number | null = null;
  for (const c of crowns) if (Math.hypot(c.x - x, c.z - z) < c.r + r && (best === null || c.base < best)) best = c.base;
  return best;
}

export function buildStage(ctx: CoreContext): Stage {
  const R = ctx.rapier;
  const spot = findSpot(ctx);
  const c2 = hexToWorld(spot.q, spot.r);
  const centre = new THREE.Vector3(c2.x, ctx.world.heightAt(c2.x, c2.z), c2.z);
  const group = new THREE.Group();
  group.name = 'camera-showcase-stage';
  const body = ctx.physics.world.createRigidBody(R.RigidBodyDesc.fixed());
  const at = (dx: number, dz: number) => new THREE.Vector3(centre.x + dx, 0, centre.z + dz).setY(ctx.world.heightAt(centre.x + dx, centre.z + dz));

  // --- the wall: a tavern west-north-west of the spawn, box collider from its real bounds
  const bPos = at(-10, -8);
  const bm = new THREE.Matrix4().compose(bPos, new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2), new THREE.Vector3(1, 1, 1));
  const bb = placeAsset(ctx, group, 'hex/buildings/blue/building_tavern_blue', bm); // buildings never dither (only foliage)
  const wall = { centre: bPos.clone(), half: new THREE.Vector3(4, 4, 4) };
  if (bb) {
    // fit the collision to the visible building in height bands (stone base + stairs, walls, eaves, roof) so the camera
    // never bumps into invisible box corners above the stairs or beside the walls
    const bands = [0, 1.7, 4.5, 7.5, 99];
    const boxes = bands.slice(1).map(() => new THREE.Box3());
    const v = new THREE.Vector3();
    const a = ctx.assets.get('hex/buildings/blue/building_tavern_blue')!;
    const mm = new THREE.Matrix4();
    for (const p of a.parts) {
      mm.multiplyMatrices(bm, p.matrix);
      const pos = p.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mm);
        const h = v.y - bPos.y;
        for (let k = 0; k < boxes.length; k++) if (h >= bands[k] - 0.05 && h <= bands[k + 1] + 0.05) boxes[k].expandByPoint(v);
      }
    }
    const all = new THREE.Box3();
    boxes.forEach((b, k) => {
      if (b.isEmpty()) return;
      b.min.y = Math.max(b.min.y, bPos.y + bands[k] - 0.05);
      if (k === 0) b.min.y = bPos.y - 0.2;
      all.union(b);
      const half = b.getSize(new THREE.Vector3()).multiplyScalar(0.5);
      const mid = b.getCenter(new THREE.Vector3());
      ctx.physics.world.createCollider(
        R.ColliderDesc.cuboid(half.x, half.y, half.z).setTranslation(mid.x, mid.y, mid.z).setCollisionGroups(WORLD_GROUPS),
        body,
      );
    });
    if (!all.isEmpty()) {
      wall.centre.copy(all.getCenter(new THREE.Vector3()));
      wall.half.copy(all.getSize(new THREE.Vector3()).multiplyScalar(0.5));
    }
  }

  // --- tree grove north-east of the spawn: trunk = solid, canopy = camera-only sensor
  const trees: [string, number, number, number][] = [
    ['forest/Tree_1_A_Color1', 9, -6, 0.3],
    ['forest/Tree_2_A_Color1', 14, -10, 1.7],
    ['forest/Tree_3_A_Color1', 8, -14, 2.9],
    ['forest/Tree_1_B_Color1', 15, -3, 4.1],
    ['forest/Tree_2_C_Color1', 12, -18, 5.0],
    ['forest/Tree_1_A_Color1', 19, -14, 0.9],
    ['forest/Tree_3_A_Color1', 4, -9, 2.2],
  ];
  for (const [id, dx, dz, rot] of trees) {
    const p = at(dx, dz);
    const m = new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rot), new THREE.Vector3(1, 1, 1));
    const b = placeAsset(ctx, group, id, m, true);
    if (!b) continue;
    const fit = fitTree(ctx, id, m, p);
    ctx.physics.world.createCollider(
      R.ColliderDesc.cylinder(fit.trunkTop / 2, fit.trunkR).setTranslation(fit.tx, p.y + fit.trunkTop / 2, fit.tz).setCollisionGroups(WORLD_GROUPS),
      body,
    );
    crowns.push({ x: fit.cx, z: fit.cz, r: fit.crownR * 1.15, base: p.y + fit.crownBottom });
  }
  // bushes: visual only (foliage never blocks the camera, ARCHITECTURE §5)
  for (const [id, dx, dz] of [['forest/Bush_1_A_Color1', 6, -4], ['forest/Bush_2_A_Color1', 11, -12], ['forest/Bush_1_A_Color1', -3, -16]] as const) {
    const p = at(dx, dz);
    placeAsset(ctx, group, id, new THREE.Matrix4().makeTranslation(p.x, p.y, p.z), true);
  }
  ctx.scene.add(group);

  // loop: up past the tavern's east side, behind (north of) it, round its west side, then through the grove
  const path = [
    at(0, 4), at(0, -4), at(-4, -17), at(-14, -19), at(-20, -9), at(-15, 2), at(-5, 5),
    at(4, -2), at(6.5, -10.5), at(11, -12), at(10, -16), at(9.5, -20), at(15, -22), at(17, -17), at(17, -8), at(18, -1), at(12, 2), at(6, 3),
  ];
  return { centre, spawn: at(0, 6), spawnHeading: Math.PI, wall, path };
}
