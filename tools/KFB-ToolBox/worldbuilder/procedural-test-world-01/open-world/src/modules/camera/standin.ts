// Showcase-only stand-in target used when the `character` module (player service) is absent.
// A KayKit Knight with in-place clips, moved by a Rapier kinematic character controller:
// follows a scripted loop path; any WASD press switches it to camera-relative manual control.
import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CoreContext } from '../../core/types';
import { PLAYER_GROUPS } from '../../core/groups';

const RUN_SPEED = 3.177 * 0.75; // Running_A natural speed (LESSONS) × CHAR_SCALE
const SPRINT_SPEED = 3.88 * 0.75; // Running_B
const RADIUS = 0.35;
const HALF = 0.55;

export class StandIn {
  readonly position = new THREE.Vector3();
  readonly velocity = new THREE.Vector3();
  heading = Math.PI;
  grounded = true;
  gait = 'idle';
  object: THREE.Object3D | null = null;
  mode: 'path' | 'manual' = 'path';
  paused = false;
  /** hold still (showcase &still=1) */
  still = false;
  private mixer: THREE.AnimationMixer | null = null;
  private actions = new Map<string, THREE.AnimationAction>();
  private current: THREE.AnimationAction | null = null;
  private body!: RAPIER.RigidBody;
  private collider!: RAPIER.Collider;
  private kcc!: RAPIER.KinematicCharacterController;
  private vy = 0;
  private wp = 0;
  private stuck = 0;
  /** camera yaw provider for manual mode */
  yawOf: () => number = () => 0;

  constructor(private ctx: CoreContext, private path: THREE.Vector3[], spawn: THREE.Vector3, heading: number) {
    const R = ctx.rapier;
    this.position.copy(spawn);
    this.heading = heading;
    this.body = ctx.physics.world.createRigidBody(R.RigidBodyDesc.kinematicPositionBased().setTranslation(spawn.x, spawn.y + HALF + RADIUS, spawn.z));
    this.collider = ctx.physics.world.createCollider(R.ColliderDesc.capsule(HALF, RADIUS).setCollisionGroups(PLAYER_GROUPS), this.body);
    this.kcc = ctx.physics.world.createCharacterController(0.02);
    this.kcc.enableAutostep(0.45, 0.2, false);
    this.kcc.enableSnapToGround(0.6);
    this.kcc.setMaxSlopeClimbAngle((50 * Math.PI) / 180);
  }

  async load(): Promise<void> {
    const a = this.ctx.assets as unknown as { url(id: string): string | null; scaleOf(id: string): number };
    const url = a.url('char/Knight');
    const g = url ? await this.ctx.assets.loadGltf(url) : null;
    if (!g) return;
    const obj = skeletonClone(g.scene);
    obj.scale.setScalar(a.scaleOf('char/Knight'));
    obj.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false;
      }
    });
    this.object = obj;
    this.ctx.scene.add(obj);
    this.mixer = new THREE.AnimationMixer(obj);
    for (const id of ['anim/Rig_Medium_General', 'anim/Rig_Medium_MovementBasic']) {
      const u = a.url(id);
      const ag = u ? await this.ctx.assets.loadGltf(u) : null;
      for (const clip of ag?.animations ?? []) {
        if (['Idle_A', 'Running_A', 'Running_B'].includes(clip.name)) this.actions.set(clip.name, this.mixer.clipAction(clip));
      }
    }
    this.play('Idle_A');
    this.sync();
  }

  private play(name: string): void {
    const next = this.actions.get(name);
    if (!next || next === this.current) return;
    next.reset().play();
    if (this.current) next.crossFadeFrom(this.current, 0.2, true);
    this.current = next;
  }

  private sync(): void {
    if (!this.object) return;
    this.object.position.copy(this.position);
    this.object.rotation.y = this.heading;
  }

  /** Movement, run inside the fixed physics step (before world.step). */
  fixed(dt: number): void {
    const inp = this.ctx.input;
    const keys = { f: inp.isDown('KeyW'), b: inp.isDown('KeyS'), l: inp.isDown('KeyA'), r: inp.isDown('KeyD') };
    if (keys.f || keys.b || keys.l || keys.r) this.mode = 'manual';
    let dir = new THREE.Vector2();
    let speed = 0;
    if (this.mode === 'manual') {
      const yaw = this.yawOf();
      const fx = -Math.sin(yaw), fz = -Math.cos(yaw); // camera forward on ground
      const rx = -fz, rz = fx; // camera right
      const ix = (keys.r ? 1 : 0) - (keys.l ? 1 : 0);
      const iz = (keys.f ? 1 : 0) - (keys.b ? 1 : 0);
      dir.set(fx * iz + rx * ix, fz * iz + rz * ix);
      if (dir.lengthSq() > 0) {
        dir.normalize();
        speed = inp.isDown('ShiftLeft') ? SPRINT_SPEED : RUN_SPEED;
      }
    } else if (!this.paused && !this.still && this.path.length) {
      const t = this.path[this.wp];
      dir.set(t.x - this.position.x, t.z - this.position.z);
      const d = dir.length();
      if (d < 0.8) this.wp = (this.wp + 1) % this.path.length;
      else {
        dir.divideScalar(d);
        speed = RUN_SPEED;
      }
    }

    // heading turns toward travel direction (smooth)
    if (speed > 0) {
      const want = Math.atan2(dir.x, dir.y);
      let diff = want - this.heading;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.heading += diff * (1 - Math.exp(-12 * dt));
      // move along the facing-blended direction so path turns are arcs, not kinks
    }
    this.vy = this.grounded ? -1 : this.vy - 24 * dt;
    const desired = { x: dir.x * speed * dt, y: this.vy * dt, z: dir.y * speed * dt };
    this.kcc.computeColliderMovement(this.collider, desired, this.ctx.rapier.QueryFilterFlags.EXCLUDE_SENSORS, PLAYER_GROUPS);
    const mv = this.kcc.computedMovement();
    this.grounded = this.kcc.computedGrounded();
    const t = this.body.translation();
    const nt = { x: t.x + mv.x, y: t.y + mv.y, z: t.z + mv.z };
    // safety: never sink below the terrain surface
    const gy = this.ctx.world.heightAt(nt.x, nt.z);
    if (nt.y - HALF - RADIUS < gy - 0.05) {
      nt.y = gy + HALF + RADIUS;
      this.grounded = true;
    }
    this.body.setNextKinematicTranslation(nt);
    const prev = this.position.clone();
    this.position.set(nt.x, nt.y - HALF - RADIUS, nt.z);
    this.velocity.copy(this.position).sub(prev).divideScalar(dt);
    const hs = Math.hypot(this.velocity.x, this.velocity.z);
    if (this.mode === 'path' && speed > 0 && hs < speed * 0.3) {
      this.stuck += dt;
      if (this.stuck > 0.8) {
        this.wp = (this.wp + 1) % this.path.length;
        this.stuck = 0;
      }
    } else this.stuck = 0;
    this.gait = speed === 0 ? 'idle' : speed > RUN_SPEED ? 'sprint' : 'run';
  }

  /** Per render frame: animation + mesh sync. */
  animate(dt: number): void {
    this.play(this.gait === 'idle' ? 'Idle_A' : this.gait === 'sprint' ? 'Running_B' : 'Running_A');
    this.mixer?.update(dt);
    this.sync();
  }

  /** Player-service shaped API (published only when no real player exists). */
  service(camInfo: () => string) {
    const self = this;
    return {
      get position() { return self.position; },
      get velocity() { return self.velocity; },
      get grounded() { return self.grounded; },
      get heading() { return self.heading; },
      get gait() { return 'standin-' + self.gait; },
      get object() { return self.object; },
      spawn(x: number, y: number, z: number, heading?: number) {
        self.body.setTranslation({ x, y: y + HALF + RADIUS, z }, true);
        self.position.set(x, y, z);
        if (heading !== undefined) self.heading = heading;
      },
      setCharacter() {},
      debugState() {
        return {
          pos: self.position.toArray().map((v) => +v.toFixed(2)),
          vel: self.velocity.toArray().map((v) => +v.toFixed(2)),
          speed: +Math.hypot(self.velocity.x, self.velocity.z).toFixed(2),
          grounded: self.grounded,
          gait: `${self.mode === 'path' ? 'path' : 'wasd'} ${camInfo()}`,
          clip: self.current?.getClip().name ?? null,
          timeScale: 1,
          character: 'Knight (camera stand-in)',
          standIn: true,
        };
      },
    };
  }
}
