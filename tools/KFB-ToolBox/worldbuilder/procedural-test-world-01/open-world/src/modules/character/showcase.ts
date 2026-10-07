// Showcase for the character module: a small KayKit test course next to the spawn (0.4 m step plateau, 1 m plateau
// to hop onto, 3.75 m cliff that must NOT be climbable, ramp, a wall to slide along) + a straight lane with
// ground markers for foot-slip checks. Colliders are added here (showcase only).
// Contains a minimal follow camera that runs ONLY in this showcase and ONLY if no `cameraRig` service exists.
import * as THREE from 'three';
import type { CameraView, CoreContext } from '../../core/types';
import { hexToWorld, hexDistance } from '../../core/hex';
import { LEVEL_H, HEX_SIZE, TILE_THICKNESS } from '../../core/units';
import { WORLD_GROUPS } from '../../core/groups';
import type { Player } from './player';

const TILE = 'hex/tiles/base/hex_grass';
const RAMP = 'hex/tiles/base/hex_grass_sloped_low';
const FENCE = 'hex/buildings/neutral/fence_stone_straight';
const CRATE = 'hex/decoration/props/crate_A_big'; // ≈0.95 m cube at HEX_PROP_SCALE
const CRATE_B = 'hex/decoration/props/crate_B_big';
const MARK = 'forest/Rock_3_A_Color1';
const TUFT = 'forest/Grass_2_A_Color1';

/** Course origin (lane start cell centre), set by stageShowcase. */
const O = new THREE.Vector3();

function placeAsset(ctx: CoreContext, group: THREE.Group, id: string, m: THREE.Matrix4, collider: boolean, body: import('@dimforge/rapier3d-compat').RigidBody | null): THREE.Box3 | null {
  const a = ctx.assets.get(id);
  if (!a) return null;
  const pts: number[] = [];
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  for (const p of a.parts) {
    const mesh = new THREE.Mesh(p.geometry, p.material);
    const mm = new THREE.Matrix4().multiplyMatrices(m, p.matrix);
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(mm);
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
    const P = p.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(mm);
      box.expandByPoint(v);
      if (collider) pts.push(v.x, v.y, v.z);
    }
  }
  if (collider && body && pts.length) {
    const R = ctx.rapier;
    const d = R.ColliderDesc.convexHull(new Float32Array(pts));
    if (d) ctx.physics.world.createCollider(d.setCollisionGroups(WORLD_GROUPS), body);
  }
  return box;
}

export async function stageShowcase(ctx: CoreContext, _params: URLSearchParams): Promise<void> {
  await ctx.assets.preload([TILE, RAMP, FENCE, MARK, TUFT, CRATE, CRATE_B]);
  // flat site near the origin: every cell within hex distance 2 shares the level (no water, ramp, road, building).
  // Works on the stub and on the real terrain; the course tiles then sit on known flat ground.
  const flat = (q: number, r: number, lvl: number) => {
    const c = ctx.world.cell(q, r);
    return !c.water && !c.slope && !c.roadMask && !c.building && c.level === lvl;
  };
  let best = { q: 0, r: 0 };
  let bestD = Infinity;
  for (let q = -12; q <= 12; q++)
    for (let r = -12; r <= 12; r++) {
      const d0 = hexDistance(0, 0, q, r);
      if (d0 > 12 || d0 >= bestD) continue;
      const lvl = ctx.world.cell(q, r).level;
      let ok = true;
      for (let dq = -2; dq <= 2 && ok; dq++)
        for (let dr = -2; dr <= 2 && ok; dr++) {
          if (hexDistance(0, 0, dq, dr) > 2) continue;
          if (!flat(q + dq, r + dr, lvl)) ok = false;
        }
      if (ok) { best = { q, r }; bestD = d0; }
    }
  const c0 = hexToWorld(best.q, best.r);
  const y0 = ctx.world.cell(best.q, best.r).level * LEVEL_H;
  O.set(c0.x, y0, c0.z);

  const group = new THREE.Group();
  group.name = 'character-course';
  const body = ctx.physics.world.createRigidBody(ctx.rapier.RigidBodyDesc.fixed());
  // Everything lines up with the lane (±X) so real-input scripts can drive straight through it:
  //   E  (+15 m): 0.4 m step plateau (autostep up, snap down on the far side)
  //   crates (−10 m): 0.95 m block of 3×2 big crates on the lane (hop on, run off the far edge = ledge fall)
  //   WW (−30 m): 3.75 m cliff = one terrain level (must NOT be climbable or jumpable)
  //   ramp on the cell SE of the cliff, rising toward it (KayKit hex_grass_sloped_low, 3.75 m over one hex)
  //   stone fence 5 m north of the lane, parallel to it (wall slide)
  const cellAt = (dq: number, dr: number) => {
    const p = hexToWorld(best.q + dq, best.r + dr);
    return new THREE.Vector3(p.x, y0, p.z);
  };
  const E = cellAt(1, 0), W = cellAt(-1, 0), WW = cellAt(-2, 0), RAMPC = cellAt(-2, 1);
  // raised tiles: visual = KayKit tile, collider = clean hex prism like the terrain's (the asset hull has a 45° bevel
  // on its top edge that the capsule would treat as a too-steep slope instead of a step)
  void W;
  // hop target: a 3 × 2 block of big KayKit crates on the lane, 10 m west of the start (≈ 2.8 × 1.9 m top, 0.95 m
  // high). Hop on from either side, run off the far edge (ledge → fall pose). One box collider over the whole block.
  const crate = ctx.assets.get(CRATE);
  if (crate) {
    const b = crate.bounds;
    const sx = b.max.x - b.min.x, sz = b.max.z - b.min.z, ch = b.max.y;
    const cx0 = O.x - 10, cz0 = O.z;
    for (let i = 0; i < 3; i++)
      for (let k = 0; k < 2; k++) {
        const id = (i + k) % 2 ? CRATE_B : CRATE;
        placeAsset(ctx, group, id, new THREE.Matrix4().makeTranslation(cx0 + (i - 1) * sx, O.y, cz0 + (k - 0.5) * sz), false, null);
      }
    const d = ctx.rapier.ColliderDesc.cuboid((3 * sx) / 2, ch / 2, sz).setTranslation(cx0, O.y + ch / 2, cz0).setCollisionGroups(WORLD_GROUPS);
    ctx.physics.world.createCollider(d, body);
  }
  for (const [c, h] of [[E, 0.4], [WW, LEVEL_H]] as [THREE.Vector3, number][]) {
    placeAsset(ctx, group, TILE, new THREE.Matrix4().makeTranslation(c.x, c.y + h, c.z), false, null);
    prism(ctx, body, c.x, c.z, c.y + h - TILE_THICKNESS, c.y + h);
  }
  const rampRot = new THREE.Matrix4().makeRotationY(rampYaw(ctx));
  placeAsset(ctx, group, RAMP, new THREE.Matrix4().makeTranslation(RAMPC.x, RAMPC.y, RAMPC.z).multiply(rampRot), true, body);
  // fence_stone_straight sits on a hex edge (local x≈−7.5, runs along local z); rotate 90° so it runs along X
  const fenceM = new THREE.Matrix4().makeTranslation(O.x + 2, O.y, O.z - 5 - 7.5).multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2));
  placeAsset(ctx, group, FENCE, fenceM, true, body);
  // lane markers: small rocks / grass tufts 1.6 m behind the lane, one per metre (no colliders)
  for (let i = -4; i <= 6; i++) {
    placeAsset(ctx, group, i % 2 ? TUFT : MARK, new THREE.Matrix4().makeTranslation(O.x + i, O.y, O.z - 1.6).multiply(new THREE.Matrix4().makeScale(0.35, 0.35, 0.35)), false, null);
  }
  group.updateMatrixWorld(true);
  ctx.scene.add(group);

  const player = ctx.services.get<Player>('player');
  player?.spawn(O.x - 4, O.y, O.z, Math.PI / 2); // facing +X down the lane
  // real camera module present: start it behind the character (its yaw convention = core orbitToView)
  const rig = ctx.services.get<{ setOrbit?(o: { yaw?: number }): void }>('cameraRig');
  rig?.setOrbit?.({ yaw: Math.PI / 2 + Math.PI });
}

function prism(ctx: CoreContext, body: import('@dimforge/rapier3d-compat').RigidBody, x: number, z: number, yb: number, yt: number): void {
  const pts: number[] = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    const cx = x + HEX_SIZE * Math.cos(a), cz = z + HEX_SIZE * Math.sin(a);
    pts.push(cx, yt, cz, cx, yb, cz);
  }
  const d = ctx.rapier.ColliderDesc.convexHull(new Float32Array(pts));
  if (d) ctx.physics.world.createCollider(d.setCollisionGroups(WORLD_GROUPS), body);
}

/** Yaw that makes the ramp's high edge face the cliff. Measured from the asset: its top is highest toward local edge `hi`. */
function rampYaw(ctx: CoreContext): number {
  const a = ctx.assets.get(RAMP);
  if (!a) return 0;
  // find direction of the highest top vertices (xz) in asset space
  const v = new THREE.Vector3();
  let maxY = -Infinity;
  const hi = new THREE.Vector3();
  for (const p of a.parts) {
    const P = p.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(p.matrix);
      if (v.y > maxY + 1e-3) { maxY = v.y; hi.set(0, 0, 0); }
      if (Math.abs(v.y - maxY) <= 1e-3) hi.add(new THREE.Vector3(v.x, 0, v.z));
    }
  }
  const cur = Math.atan2(-hi.z, hi.x); // angle from +X toward −Z (core convention)
  const want = (2 * Math.PI) / 3; // edge d=2 (NW): from the ramp cell (−2,+1) toward the cliff cell (−2,0)
  return want - cur;
}

// ---------------------------------------------------------------- fallback follow camera (showcase only)
const cam = { yaw: -90, pitch: 16, dist: 6.5, target: new THREE.Vector3(), init: false };

export function showcaseCamera(ctx: CoreContext, dt: number): void {
  if (ctx.services.get('cameraRig')) return; // real camera module present → it owns the camera
  const p = ctx.services.get<Player>('player');
  if (!p) return;
  const inp = ctx.input;
  cam.yaw -= inp.mouseDX * 0.25;
  cam.pitch = THREE.MathUtils.clamp(cam.pitch + inp.mouseDY * 0.15, -5, 70);
  cam.dist = THREE.MathUtils.clamp(cam.dist * Math.exp(inp.wheel * 0.001), 2.5, 25);
  const want = new THREE.Vector3(p.position.x, p.position.y + 1.1, p.position.z);
  if (!cam.init) { cam.target.copy(want); cam.init = true; }
  cam.target.lerp(want, 1 - Math.exp(-dt * 10));
  const yaw = THREE.MathUtils.degToRad(cam.yaw), pitch = THREE.MathUtils.degToRad(cam.pitch);
  ctx.camera.position.set(
    cam.target.x + cam.dist * Math.cos(pitch) * Math.sin(yaw),
    cam.target.y + cam.dist * Math.sin(pitch),
    cam.target.z + cam.dist * Math.cos(pitch) * Math.cos(yaw),
  );
  ctx.camera.lookAt(cam.target);
}

// ---------------------------------------------------------------- presets
const pl = (ctx: CoreContext) => ctx.services.get<Player>('player');

export const presets: Record<string, (ctx: CoreContext) => CameraView> = {
  /** Side view of the feet, looking −Z: walking with D crosses the screen left → right. */
  side: (ctx) => {
    const p = pl(ctx)?.position ?? O;
    return { position: [p.x + 2.5, p.y + 1.1, p.z + 8.5], target: [p.x + 2.5, p.y + 0.9, p.z], fov: 35 };
  },
  /** Close side view at foot level (≈3 m wide). */
  feet: (ctx) => {
    const p = pl(ctx)?.position ?? O;
    return { position: [p.x + 1.4, p.y + 0.75, p.z + 4.4], target: [p.x + 1.4, p.y + 0.7, p.z], fov: 30 };
  },
  /** In front of the character, looking back at it. */
  front: (ctx) => {
    const P = pl(ctx);
    const p = P?.position ?? O;
    const h = P?.heading ?? 0;
    return { position: [p.x + Math.sin(h) * 4.5, p.y + 1.2, p.z + Math.cos(h) * 4.5], target: [p.x, p.y + 0.85, p.z], fov: 40 };
  },
  /** Static side view of the crate block (hop on / run off): looks −Z, the lane spans ≈ 14 m. */
  crates: () => ({ position: [O.x - 9, O.y + 1.6, O.z + 12], target: [O.x - 9, O.y + 0.8, O.z], fov: 40 }),
  /** Static side view of the 0.4 m step plateau edge (east). */
  step: () => ({ position: [O.x + 7.5, O.y + 1.4, O.z + 9], target: [O.x + 7.5, O.y + 0.6, O.z], fov: 40 }),
  /** Static side view of the cliff face (west of the crates): run into it head-on with A. */
  cliff: () => ({ position: [O.x - 21, O.y + 1.4, O.z + 8], target: [O.x - 21, O.y + 0.9, O.z], fov: 40 }),
  /** Whole test course from the south: cliff + 1 m plateau (left), lane + fence (centre), 0.4 m step (right), ramp (front left). */
  course: () => ({ position: [O.x - 4, O.y + 26, O.z + 40], target: [O.x - 9, O.y, O.z - 2], fov: 50 }),
};
