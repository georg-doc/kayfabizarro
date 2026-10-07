// camera module: third-person orbit follow camera with Rapier collision, cameraRig service, presets, showcase.
// See NOTES.md for parameters and conventions.
import * as THREE from 'three';
import type { CameraView, CoreContext, GameModule } from '../../core/types';
import { CameraRig, CAM, wrapAngle } from './rig';
import { buildStage, STAGE_ASSETS, stageCanopyBaseAt, stageUniforms, type Stage } from './stage';
import { StandIn } from './standin';
import { DIRS, hexToWorld, worldToHex } from '../../core/hex';

interface PlayerLike {
  position: THREE.Vector3;
  velocity?: THREE.Vector3;
  heading?: number;
  /** canon steering heading (A/D turn it); the chase camera follows this, not the body facing `heading` */
  yaw?: number;
  controls?: 'canon' | 'legacy';
  grounded?: boolean;
  object?: THREE.Object3D | null;
  root?: THREE.Object3D | null;
  spawn?(x: number, y: number, z: number, heading?: number): void;
}

const D2R = Math.PI / 180;
/** desired distance used by the camera.wall preset scan (m) */
const WALL_SCAN = 10;
let rig: CameraRig | null = null;
let standIn: StandIn | null = null;
let stage: Stage | null = null;
let baseFov = 50;
let wasOverridden = false;
let blend: { t: number; pos: THREE.Vector3; quat: THREE.Quaternion; fov: number } | null = null;
let fadeOpacity = 1;
const _zero = new THREE.Vector3();
const _headP = new THREE.Vector3();
const _q = new THREE.Quaternion();

let ctxRef: CoreContext | null = null;
function engineOverride(): unknown {
  return ctxRef?.getCameraOverride?.() ?? null;
}

function player(ctx: CoreContext): PlayerLike | undefined {
  const p = ctx.services.get<PlayerLike>('player');
  return p?.position ? p : undefined;
}

/** Fade the character when the camera is very close (only possible if the player service exposes `object`). */
function applyFade(obj: THREE.Object3D | null | undefined, opacity: number): void {
  if (!obj) return;
  if (Math.abs(opacity - fadeOpacity) < 0.01 && opacity !== 1) return;
  fadeOpacity = opacity;
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    if (opacity >= 0.999) {
      if (m.userData.camOrigMat) {
        m.material = m.userData.camOrigMat;
        delete m.userData.camOrigMat;
      }
      m.visible = true;
      return;
    }
    if (!m.userData.camOrigMat) {
      m.userData.camOrigMat = m.material;
      m.material = (Array.isArray(m.material) ? m.material.map((x) => x.clone()) : (m.material as THREE.Material).clone()) as THREE.Material;
    }
    m.visible = opacity > 0.05;
    for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
      mat.transparent = true;
      mat.opacity = opacity;
      mat.depthWrite = true; // one solid translucent figure, no see-through shells
    }
  });
}

function camInfo(): string {
  if (!rig) return '';
  return `d${rig.distance.toFixed(1)}/${rig.zoom.toFixed(1)} p${Math.round(rig.pitchNow / D2R)}${rig.lastArm.blocked ? ' blocked' : ''}`;
}

/** &camtrace=1 (verification only): per-frame camera samples in window.__camTrace, dumped by a script `until` step. */
let traceOn = false;
const trace: number[][] = [];
const _pt = new THREE.Vector3();
function recordTrace(ctx: CoreContext, r: CameraRig): void {
  const cam = ctx.camera;
  cam.updateMatrixWorld();
  const ndc = (y: number) => _pt.set(r.feet.x, y, r.feet.z).project(cam);
  const top = ndc(r.feet.y + CAM.headTop);
  const topY = top.y, topZ = top.z;
  const bot = ndc(r.feet.y).y;
  const f = (v: number, n = 2) => +v.toFixed(n);
  trace.push([f(ctx.time, 3), f(cam.position.x, 3), f(cam.position.y, 3), f(cam.position.z, 3), f(r.distance), f(r.zoom), f(r.pitchNow / D2R, 1),
    f(r.liftEff / D2R, 1), f(r.dip / D2R, 1), f(cam.near), f(cam.fov, 1), f(topY, 3), f(bot, 3), topZ > 1 ? 1 : 0, f(r.feet.x), f(r.feet.y), f(r.feet.z), f(r.yawOff / D2R, 1), f(r.yawEff / D2R, 1)]);
  if (trace.length > 20000) trace.splice(0, 5000);
}

function feet(ctx: CoreContext): THREE.Vector3 {
  const p = player(ctx)?.position;
  if (p) return p.clone();
  const f = ctx.chunks.focus;
  return new THREE.Vector3(f.x, ctx.world.heightAt(f.x, f.z), f.z);
}

/** Preset helper: collision-safe view for an orbit pose around the player (no side effects on the follow rig). */
function presetView(ctx: CoreContext, yaw: number, pitch: number, dist: number): CameraView {
  const r = rig ?? new CameraRig(ctx);
  return r.view(feet(ctx), yaw, pitch, dist);
}

const mod: GameModule = {
  id: 'camera',
  showcaseUses: ['terrain', 'character'],

  init(ctx) {
    ctxRef = ctx;
    rig = new CameraRig(ctx);
    baseFov = ctx.camera.fov;
    rig.baseFov = baseFov;
    // KFB ground-controls canon: chase camera behind the player's heading; ?controls=legacy keeps the old orbit-yaw mode
    rig.chase = ctx.params.get('controls') !== 'legacy';
    traceOn = ctx.params.get('camtrace') === '1';
    if (traceOn) (window as any).__camTrace = trace;
    ctx.camera.near = CAM.near; // spring arm may sit close to walls; tiny near plane avoids cutting through them
    ctx.camera.updateProjectionMatrix();
    const r = rig;
    ctx.services.set('cameraRig', {
      get yaw() { return r.yaw; },
      get pitch() { return r.pitch; },
      get distance() { return r.distance; },
      object: ctx.camera,
      /** camera forward projected on the ground (unit) */
      forward(out = new THREE.Vector3()) { return out.set(-Math.sin(r.yaw), 0, -Math.cos(r.yaw)); },
      setOrbit(o: { yaw?: number; pitch?: number; distance?: number }) {
        if (o.yaw !== undefined) r.setYaw(o.yaw);
        if (o.pitch !== undefined) r.pitch = THREE.MathUtils.clamp(o.pitch, CAM.minPitch, CAM.maxPitch);
        if (o.distance !== undefined) r.zoomGoal = THREE.MathUtils.clamp(o.distance, CAM.minDist, CAM.maxDist);
      },
      debugState() {
        return {
          yawDeg: +(r.yaw / D2R).toFixed(1), pitchDeg: +(r.pitch / D2R).toFixed(1), pitchNowDeg: +(r.pitchNow / D2R).toFixed(1),
          liftDeg: +(r.lift / D2R).toFixed(1), slideDeg: +(r.yawOff / D2R).toFixed(1), dipDeg: +(r.dip / D2R).toFixed(1), fovAdd: +r.fovAdd.toFixed(2), near: +r.near.toFixed(2),
          zoom: +r.zoom.toFixed(2), zoomGoal: +r.zoomGoal.toFixed(2), distance: +r.distance.toFixed(2),
          blocker: r.lastArm.blocked ? 'solid' : 'none', hitDist: +r.lastArm.len.toFixed(2),
          pivot: r.pivot.toArray().map((v) => +v.toFixed(2)), cam: ctx.camera.position.toArray().map((v) => +v.toFixed(2)),
          overridden: !!engineOverride(), fade: +fadeOpacity.toFixed(2),
        };
      },
    });
  },

  update(dt) {
    standIn?.animate(dt);
  },

  lateUpdate(dt, ctx) {
    if (!rig) return;
    const cam = ctx.camera;
    const ov = !!engineOverride();
    const p = player(ctx);
    const target = p
      ? { position: p.position, velocity: p.velocity ?? _zero, heading: typeof p.yaw === 'number' && Number.isFinite(p.yaw) ? p.yaw : p.heading, grounded: p.grounded }
      : { position: feet(ctx), velocity: _zero };
    if (standIn) standIn.paused = ov;

    if (p?.controls) rig.chase = p.controls === 'canon';
    const touched = ov ? false : rig.applyInput(ctx.input.mouseDX, ctx.input.mouseDY, ctx.input.wheel);
    // forest canopy provider: nature service (game) or the showcase stage's own grove
    const nat = ctx.services.get<{ canopyBaseAt?: (x: number, z: number, r?: number) => number | null }>('nature');
    rig.canopyAt = nat?.canopyBaseAt ? (x, z, r) => nat.canopyBaseAt!(x, z, r) : stage ? stageCanopyBaseAt : null;
    rig.update(dt, target, touched);

    // release from a verification override → blend from where the override left the camera
    if (wasOverridden && !ov) blend = { t: 0, pos: cam.position.clone(), quat: cam.quaternion.clone(), fov: cam.fov };
    wasOverridden = ov;
    if (ov) {
      if (cam.near !== CAM.near) {
        cam.near = CAM.near;
        cam.updateProjectionMatrix();
      }
      return; // engine places the camera after lateUpdate
    }

    cam.position.copy(rig.position);
    if (rig.position.distanceToSquared(rig.lookAt) > 0.01) cam.lookAt(rig.lookAt);
    let fov = baseFov + rig.fovAdd;
    if (blend) {
      blend.t += dt / CAM.releaseBlend;
      const k = THREE.MathUtils.smoothstep(Math.min(blend.t, 1), 0, 1);
      _q.copy(cam.quaternion);
      cam.position.lerpVectors(blend.pos, rig.position, k);
      cam.quaternion.slerpQuaternions(blend.quat, _q, k);
      fov = THREE.MathUtils.lerp(blend.fov, baseFov + rig.fovAdd, k);
      if (blend.t >= 1) blend = null;
    }
    const near = blend ? CAM.near : rig.near;
    if (Math.abs(cam.fov - fov) > 1e-3 || Math.abs(cam.near - near) > 1e-3) {
      cam.fov = fov;
      cam.near = near;
      cam.updateProjectionMatrix();
    }

    if (stage) {
      stageUniforms.uStCam.value.copy(cam.position);
      stageUniforms.uStPlayer.value.copy(target.position);
    }

    // character readability: fade when the camera is pushed very close
    // distance to the head (feet + 1.55): from 1.6 m down to 1.1 m the knight fades to 45 % (the chibi helmet no
    // longer blocks the close view); closer than that (pinned, no room behind) it fades out completely by 0.7 m
    const d = cam.position.distanceTo(_headP.set(rig.feet.x, rig.feet.y + CAM.headHeight, rig.feet.z));
    const op = d >= CAM.fadeStart ? 1 : d >= CAM.fadeEnd
      ? THREE.MathUtils.lerp(CAM.fadeMin, 1, (d - CAM.fadeEnd) / (CAM.fadeStart - CAM.fadeEnd))
      : THREE.MathUtils.lerp(0, CAM.fadeMin, THREE.MathUtils.clamp((d - 0.7) / (CAM.fadeEnd - 0.7), 0, 1));
    applyFade(p?.object ?? p?.root, op);
    if (traceOn) recordTrace(ctx, rig);
  },

  async showcase(ctx) {
    await ctx.assets.preload(STAGE_ASSETS);
    stage = buildStage(ctx);
    const s = stage;
    // &pose=wall: start 3.5 m east of the tavern facing away from it (camera between wall and character) — the
    // "back into the wall" test; &pose=stairs: start south-east of the tavern so a run north passes along the stairs
    const pose = ctx.params.get('pose');
    if (pose === 'wall') {
      const x = s.wall.centre.x + s.wall.half.x + 3.5, z = s.wall.centre.z;
      s.spawn.set(x, ctx.world.heightAt(x, z), z);
      s.spawnHeading = Math.PI / 2;
    } else if (pose === 'stairs') {
      const x = s.wall.centre.x + s.wall.half.x + 1.6, z = s.wall.centre.z + s.wall.half.z + 6;
      s.spawn.set(x, ctx.world.heightAt(x, z), z);
    }
    if (pose === 'step') {
      // nearest one-level terrain step: stand 4 m in front of it, facing away (camera looks over/into the step)
      const h0 = worldToHex(s.centre.x, s.centre.z);
      search: for (let rad = 1; rad <= 8; rad++)
        for (let dq = -rad; dq <= rad; dq++)
          for (let dr = -rad; dr <= rad; dr++) {
            if (Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr)) !== rad) continue;
            const c = ctx.world.cell(h0.q + dq, h0.r + dr);
            if (c.water || c.slope) continue;
            for (let d = 0; d < 6; d++) {
              const nq = c.q + DIRS[d][0], nr = c.r + DIRS[d][1];
              const n = ctx.world.cell(nq, nr);
              if (n.water || n.level !== c.level + 1) continue;
              const pc = hexToWorld(c.q, c.r), pn = hexToWorld(nq, nr);
              const ux = (pc.x - pn.x) / 15, uz = (pc.z - pn.z) / 15; // unit-ish, step → cell
              const x = (pc.x + pn.x) / 2 + ux * 4, z = (pc.z + pn.z) / 2 + uz * 4;
              s.spawn.set(x, ctx.world.heightAt(x, z), z);
              s.spawnHeading = Math.atan2(ux, uz);
              break search;
            }
          }
    }
    let real = player(ctx);
    // &standin=force: test the camera with the scripted stand-in even when the character module is present
    // (the real character is parked out of sight; its capsule is in the PLAYER group, which the camera ignores)
    if (real && ctx.params.get('standin') === 'force') {
      real.spawn?.(s.spawn.x + 400, s.spawn.y, s.spawn.z + 400, 0);
      const vis = real.object ?? real.root;
      if (vis) vis.visible = false;
      real = undefined;
    }
    if (real?.spawn) {
      real.spawn(s.spawn.x, s.spawn.y, s.spawn.z, s.spawnHeading);
    } else if (!real) {
      standIn = new StandIn(ctx, s.path, s.spawn, s.spawnHeading);
      await standIn.load();
      standIn.yawOf = () => rig?.yaw ?? 0;
      const si = standIn;
      ctx.physics.onFixedStep((fdt) => si.fixed(fdt));
      ctx.services.set('player', si.service(camInfo));
      if (ctx.params.get('still') === '1' || ctx.params.get('standin') === 'still') si.still = true;
    }
    if (rig) {
      rig.pitch = CAM.defaultPitch;
      rig.snap({ position: s.spawn, velocity: _zero, heading: s.spawnHeading });
    }
    // keep the stage chunks loaded around it
    ctx.chunks.focus.copy(s.centre);
  },

  cameraPresets: {
    /** default follow pose behind the character's facing */
    behind: (ctx) => {
      const h = player(ctx)?.heading ?? Math.PI;
      return presetView(ctx, h + Math.PI, CAM.defaultPitch, CAM.defaultDist);
    },
    /** high, far overview of the character's surroundings */
    high: (ctx) => presetView(ctx, rig?.yaw ?? 0, 50 * D2R, 12),
    /** orbit pose whose desired camera position lies behind the nearest solid (building) — the result is the pulled-in camera */
    wall: (ctx) => {
      const r = rig ?? new CameraRig(ctx);
      const pivot = feet(ctx);
      pivot.y += CAM.pivotHeight;
      const sp = r.probe.safe(pivot, new THREE.Vector3());
      let best: { yaw: number; d: number } | null = null;
      for (let i = 0; i < 72; i++) {
        const yaw = (i / 72) * Math.PI * 2;
        const dir = new THREE.Vector3(Math.cos(15 * D2R) * Math.sin(yaw), Math.sin(15 * D2R), Math.cos(15 * D2R) * Math.cos(yaw));
        const a = r.probe.arm(sp, dir, WALL_SCAN);
        if (!a.hit || a.len < 2.2) continue;
        if (!best || a.len < best.d) best = { yaw, d: a.len };
      }
      return presetView(ctx, (best ?? { yaw: r.yaw }).yaw, 15 * D2R, WALL_SCAN);
    },
  },
};

export default mod;
