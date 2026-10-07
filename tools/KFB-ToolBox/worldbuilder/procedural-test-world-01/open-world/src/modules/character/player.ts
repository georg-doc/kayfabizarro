// Player: Rapier kinematic capsule + speed-matched locomotion + jump state machine + character switching.
// Movement runs in physics.onFixedStep (60 Hz); the visual is interpolated in lateUpdate.
import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CoreContext } from '../../core/types';
import { CHAR_SCALE } from '../../core/units';
import { GRAVITY } from '../../core/physics';
import { PLAYER_GROUPS, WORLD_GROUPS, groups, G_WORLD } from '../../core/groups';
import { findLegs, solveLeg, type Leg } from './ik';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Hand items per hero (KayKit Adventurers 2.0 Assets/gltf), carried on the rig's handslot bones. Files live in
 * ./items (module-owned copy until the integrator moves them to public/assets — see CORE_REQUESTS.md).
 */
const ITEMS_ALL: Record<string, { r?: string; l?: string }> = {
  Knight: { r: 'sword_1handed', l: 'shield_badge_color' },
  Barbarian: { r: 'axe_1handed', l: 'shield_round_barbarian' },
  Mage: { r: 'staff', l: 'spellbook_closed' },
  Ranger: { l: 'bow' },
  Rogue: { r: 'dagger', l: 'dagger' },
  Rogue_Hooded: { r: 'crossbow_1handed' },
};
/**
 * Default = only items that don't clip in run/jump (checked on side-view sheets): the long weapons (sword 1.3 m, axe,
 * staff, bow, daggers at chibi scale) cut into the ground in the landing crouch and through crates mid-jump, so they
 * are off unless `?items=all`. `?items=0` disables all items.
 */
const ITEMS_SAFE: Record<string, { r?: string; l?: string }> = {
  Knight: { l: 'shield_badge_color' },
  Barbarian: { l: 'shield_round_barbarian' },
  Mage: { l: 'spellbook_closed' },
};
/** Copied by tools/copy-assets.mjs (pack `item`, manifest id `item/<name>`), so `vite build` ships the .bin/.png too. */
const ITEM_NAMES = new Set(['axe_1handed', 'bow', 'crossbow_1handed', 'dagger', 'shield_badge_color', 'shield_round_barbarian', 'spellbook_closed', 'staff', 'sword_1handed']);
const itemLoader = new GLTFLoader();
const itemCache = new Map<string, Promise<THREE.Object3D | null>>();
function loadItem(name: string): Promise<THREE.Object3D | null> {
  let p = itemCache.get(name);
  if (!p) {
    const url = ITEM_NAMES.has(name) ? `${import.meta.env.BASE_URL}assets/item/${name}.gltf` : null;
    p = url
      ? itemLoader.loadAsync(url).then((g) => g.scene).catch((e) => { console.warn(`[character] item ${name} failed`, e); return null; })
      : Promise.resolve(null);
    itemCache.set(name, p);
  }
  return p;
}
import { PRECOMPUTED } from './measures.gen';
import { packMeasure, unpackMeasure } from './anim';
import { measureClip, lastSamples, boundFraction, PoseApplier, SLOTS, type Slot, type ClipMeasure } from './anim';

export const CHARACTERS = ['Knight', 'Barbarian', 'Mage', 'Ranger', 'Rogue', 'Rogue_Hooded'] as const;

/**
 * Travel-tempo config (one place to flip). Measured at CHAR_SCALE 0.75 (see NOTES.md): Walking_B 0.96 m/s,
 * Running_A 2.49 m/s, Running_B 4.45 m/s. Hex = 15 m, village→bridge ≈ 90 m → walking takes ~94 s, too slow as the
 * default, so W alone RUNS (Running_B) and Shift walks. `?gait=walk` flips it (W walks, Shift runs).
 * `?walkClip=` / `?runClip=` pick other MovementBasic clips; speeds are always re-measured, never stretched.
 */
export const GAIT_CONFIG = {
  default: 'run' as 'run' | 'walk',
  walkClip: 'Walking_B',
  runClip: 'Running_B',
};

/** Clip choice per slot: [anim pack id, clip name]. Walk/run chosen from the measurements (see NOTES.md). */
export const CLIP_CHOICE: Record<Slot, [string, string]> = {
  idle: ['anim/Rig_Medium_General', 'Idle_A'],
  walk: ['anim/Rig_Medium_MovementBasic', GAIT_CONFIG.walkClip],
  run: ['anim/Rig_Medium_MovementBasic', GAIT_CONFIG.runClip],
  jstart: ['anim/Rig_Medium_MovementBasic', 'Jump_Start'],
  jair: ['anim/Rig_Medium_MovementBasic', 'Jump_Idle'],
  jland: ['anim/Rig_Medium_MovementBasic', 'Jump_Land'],
  // ground-controls canon: S backwards, Q/E strafe (natural rates)
  back: ['anim/Rig_Medium_MovementAdvanced', 'Walking_Backwards'],
  strafeL: ['anim/Rig_Medium_MovementAdvanced', 'Running_Strafe_Left'],
  strafeR: ['anim/Rig_Medium_MovementAdvanced', 'Running_Strafe_Right'],
};
/** Loop clips measured at load (logged, used to pick walk/run). */
const MEASURE_LOOPS: [string, string][] = [
  ['anim/Rig_Medium_General', 'Idle_A'],
  ['anim/Rig_Medium_MovementBasic', 'Walking_A'],
  ['anim/Rig_Medium_MovementBasic', 'Walking_B'],
  ['anim/Rig_Medium_MovementBasic', 'Walking_C'],
  ['anim/Rig_Medium_MovementBasic', 'Running_A'],
  ['anim/Rig_Medium_MovementBasic', 'Running_B'],
];

// Capsule (metres). Total height 1.74 m ≈ Knight body without helmet plume.
const RADIUS = 0.3;
const HALF = 0.55;
const SKIN = 0.02; // KCC offset
const CENTER_Y = HALF + RADIUS + SKIN; // feet → capsule centre

const FADE = 0.18; // crossfade seconds idle→walk/run and walk→run (weights move 1/FADE per second)
const FADE_UP = 0.15; // walk→run (plant-matched)
const FADE_STOP = 0.2; // walk→idle, fitted inside one walk stance
const TAP_TURN = 0.25; // s: a press shorter than this from a stand (toward another direction) only turns
const DEBOUNCE = 0.07; // s a gait request must persist before it is acted on
const TURN_MOVE = 9; // rad/s max while moving (pivots on the planted toe)
const TURN_IDLE = 7; // rad/s max while the idle pose dominates (both idle feet pivot about the body centre)
const STEP = 3; // pseudo-gait: small stepping (walk at STEP_W weight over idle) for turns and taps from a stand
/** canon gaits (directional, body faces the control yaw): S backwards, Q/E strafe */
/** canon jog clip (W without Shift), natural rate */
const CANON_JOG = 'Running_A';
/** canon A/D turn rate (rad/s, ≈ 172°/s) and its ease-in time */
const YAW_RATE = 3.0;
const YAW_EASE = 0.12;
const FADE_DIR = 0.2;
const TURN_GO_DIR = 0.03;
const BACK = 4;
const STRAFE_L = 5;
const STRAFE_R = 6;
const LW_N = 6;
/** index into lw[] of gait g (STEP shares the walk entry) */
const lwIdx = (g: number) => (g === STEP ? 1 : g <= 2 ? g : g - 1);
const isDir = (g: number) => g >= BACK;
type LocoSlot = 'walk' | 'run' | 'back' | 'strafeL' | 'strafeR';
const LOCO_SLOTS = ['idle', 'walk', 'run', 'back', 'strafeL', 'strafeR'] as const;
const STEP_W = 0.5;
const LEAP_LOCO = 0.8; // running-jump air pose: held run stride (forward lean) over Jump_Idle
const FALL_MULT = 1.3; // extra gravity while falling (shorter apex hang)
const STOP_SETTLE = 0.5;
const FEET = ['l', 'r'] as const;
const AIR_LEAN = 0.3; // rad forward lean of the upper body in the air at run speed
const LOCK_STEP = 0.055; // m an animated foot may drift from its locked spot before it steps
const LOCK_STEP_T = 0.13;
const LOCK_YAW = 0.45; // rad a locked foot may lag the body's yaw before it steps // s per locked-foot step
const LOCK_LIFT = 0.07; // m step lift
const DIP_T = 0.28; // s landing dip at speed
const STOP_T = 0.1;
/** Run stop: 'via-walk' = decelerate through one walk step (~0.35 s); 'plant' = 0.1 s IK-locked brake. */
/** Run stop: 'walk' = speed-matched blend run → walk (plant-matched, natural rates) → idle; 'plant' = hard plant-stop. */
const RUN_STOP_MODE: 'walk' | 'plant' = 'walk';
const RUN_STOP_BLEND = 0.15;
const RUN_TO_WALK = 0.3; // s phase-matched run→walk blend
const TURN_GO = 1.0; // rad: a standing turn hands over to the gait (pivoting walk) within this // s body deceleration of the run plant-stop // Jump_Land weight of the run plant-stop squat
const REVERSE = 2.3; // rad: a wish this far behind while running = plant-and-stop, step round, go
const JUMP_HOLD = 0.4; // standing jump: share of Jump_Start played before the take-off impulse
const TURN_STEP = 6; // rad/s max during a stepping turn
const TURN_FIRST = 0.6; // rad: larger heading changes from a stand are done as a stepping turn
/**
 * Player gravity = core GRAVITY × 1.6 (−38.4 m/s²): snappy cartoon arc (0.53 s airtime, apex 1.35 m) instead of the
 * floaty 0.75 s at −24. Only the character's kinematic controller uses it; the Rapier world keeps core GRAVITY.
 */
const GRAV_MULT = 1.6;
const JUMP_HEIGHT = 1.35; // m apex: hops onto ~1 m (crates), never onto 3.75 m cliffs
const JUMP_V = Math.sqrt(2 * -GRAVITY * GRAV_MULT * JUMP_HEIGHT);
const AIR_ACCEL = 5; // m/s² air steering
const PRELAND = 0.05; // s before touchdown the air pose starts blending into the gait
const COYOTE = 0.12; // s off-ground (KCC) before the fall pose, fallback to the centre-support test
const COS_CLIMB = Math.cos((35 * Math.PI) / 180);
const STALL_T = 0.2;
const BLOCK_IDLE_T = 0.2; // s with no displacement (after a sidestep try) before standing still // s blocked with a key held before the watchdog sidesteps
const BLOCK_FAST_T = 0.12; // s held still by a steep contact before the gait gives way to idle
const SLIDE_MAX_COS = 0.5; // a wall slide turns at most 60° away from the input direction
const TURN_GO_WALL = 0.35; // rad: gait start threshold while touching a wall
const WALL_SETTLE = 0.3; // m: gap at which a wall stop fades to idle without waiting for a plant
const WALL_LOOK = 0.55; // s of current speed: look-ahead for a head-on flat wall (≈ the run → walk → idle stop distance)
/** Running but held below this share of run speed by an obstacle for THROTTLE_T → walk (natural rate) instead. */
const THROTTLE = 0.75;
const THROTTLE_T = 0.2;
const FLAT_HEADON = Math.sin((10 * Math.PI) / 180); // tangent share below which a big flat wall counts as head-on
const STEP_MAX = 0.45; // m: steps up/down to this need no jump (KayKit props, kerbs); 3.75 m cliffs never
/** Upper-body bones that take the Jump_Land "beat" when landing into a walk/run (legs keep the gait = no slip). */
const UPPER = ['spine', 'chest', 'head', 'upperarml', 'upperarmr', 'lowerarml', 'lowerarmr', 'wristl', 'wristr', 'handl', 'handr'];

type State = 'ground' | 'jstart' | 'air';

const _up = new THREE.Vector3(0, 1, 0);
const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export interface PlayerApi {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  grounded: boolean;
  gait: string;
  heading: number;
  spawn(x: number, y: number, z: number, heading?: number): void;
  setCharacter(name: string): void;
  debugState(): object;
}

export class Player implements PlayerApi {
  // ---- public API (visual, interpolated) ----
  position = new THREE.Vector3();
  velocity = new THREE.Vector3();
  grounded = false;
  gait = 'idle';
  heading = 0;
  /**
   * Control heading (rad, same convention as `heading`: forward = (sin, 0, cos)), owned by the character in the
   * ground-controls canon: A/D turn it, W/S/Q/E move relative to it. The camera follows this. Equals `heading`
   * except during diagonals (W+Q/E: the body faces the movement, ±45°; S+Q/E: the body faces away from it).
   * Render-interpolated. In `?controls=legacy` it simply mirrors `heading`.
   */
  yaw = 0;
  /** 'canon' (default: W/S fwd/back, A/D turn, Q/E strafe, Shift sprint) or 'legacy' (camera-relative WASD) */
  controls: 'canon' | 'legacy' = 'canon';
  private ctlYaw = 0;
  private ctlYawPrev = 0;
  private yawRate = 0;
  private inTurn = 0;
  /** canon: gait requested by the keys (0 none, 1/2 forward jog/sprint, BACK, STRAFE_L, STRAFE_R) */
  private keyGait = 0;
  /** canon: direction the body should face (world, xz) */
  private faceDir = new THREE.Vector3(0, 0, 1);
  character = 'Knight';

  readonly root = new THREE.Group();
  ready = false;
  explicitSpawn = false;
  measures: Record<string, ClipMeasure> = {};
  vWalk = 1;
  vRun = 3;
  private curveWalk: Float32Array | null = null;
  private curveRun: Float32Array | null = null;
  /** URL ?rootCurve=0 disables the per-phase speed curve (constant mean speed instead). */
  private useCurve = true;
  /**
   * Locomotion clip clocks run in the FIXED step (same clock as the body), the render interpolates both with the
   * same alpha → pose and position stay in lock-step whatever the frame timing.
   */
  private locoT = { idle: 0, walk: 0, run: 0, back: 0, strafeL: 0, strafeR: 0 };
  private locoTPrev = { idle: 0, walk: 0, run: 0, back: 0, strafeL: 0, strafeR: 0 };
  private lwPrev = [1, 0, 0, 0, 0, 0];
  private entryWalk = 0;
  private entryRun = 0;
  private stopWait = 0;
  /** Committed gait (0 idle, 1 walk, 2 run) the weights fade toward, and that fade's length. */
  private gTarget = 0;
  private fadeDur = FADE;
  private want = 0;
  private wantRaw = 0;
  private wantT = 0;
  private turnGoal = 0;
  private holdT = 0;
  private reversing = false;
  private landIsStop = false;
  private leap = false;
  private leapFrozen = false;
  private leapFoot = 0;
  private landT = 0;
  private legs: { l: Leg; r: Leg } | null = null;
  private locks = {
    l: { pos: new THREE.Vector3(), from: new THREE.Vector3(), q: new THREE.Quaternion(), qFrom: new THREE.Quaternion(), valid: false, stepping: false, t: 0 },
    r: { pos: new THREE.Vector3(), from: new THREE.Vector3(), q: new THREE.Quaternion(), qFrom: new THREE.Quaternion(), valid: false, stepping: false, t: 0 },
  };
  private lockW = 0;
  private stopLock = false;
  private stopT = -1;
  private quickStop = false;
  /** Run clip playback rate (1 except while decelerating to a stop). */
  /** Debug: fixed steps whose ground speed exceeded the cap (should stay 0). */
  speedSpikes = 0;
  private stopV = 0;
  private jsLift = 0.3;
  private lean = 0;
  private dipT = -1;
  private dipD = 0;
  /** Local (x, z) of the blend's planted toe this step (pivot point for turns), null in flight. */
  private pmToe: [number, number] | null = null;
  /** Body speed cap = 1.05 × natural run speed. */
  vRunMax = 4.5;
  private tapTurn = false;
  private visY = 0;
  private prevVisY = 0;
  private visGround = true;
  /** Upper-body landing beat: time into Jump_Land and peak weight (0 = off). */
  private upperT = 0;
  private upperPeak = 0;
  private upperTracks: { bone: string; interp: THREE.Interpolant }[] = [];
  private groupFade = 0.15;
  /** Gait pre-blended before touchdown (−1 = none). */
  private preLand = -1;

  // ---- physics ----
  private R!: typeof RAPIER;
  private body!: RAPIER.RigidBody;
  private collider!: RAPIER.Collider;
  private kcc!: RAPIER.KinematicCharacterController;
  private feet = new THREE.Vector3(); // current physics feet position
  private prevFeet = new THREE.Vector3();
  private prevHeading = 0;
  private physHeading = 0;
  private vy = 0;
  private hVel = new THREE.Vector3(); // horizontal velocity (m/s) actually achieved
  private airVel = new THREE.Vector3();
  private physGrounded = false;
  private offGround = 0;
  private settle = true;
  private yOffset = 0; // visual smoothing of autostep / snap
  private wallN = new THREE.Vector3();
  private wallT = 99;
  private wallRound = false;
  private wallSide = 0;
  private flatStand = false;
  private forceSlide = 0;
  private sideSign = 1;
  private stallT = 0;
  private blockT = 0;
  private blockTried = false;
  private blockedIdle = false;
  private blockedDir = 0;
  /** Debug: times the character stood still because it was blocked. */
  blockedIdles = 0;
  wallStops = 0;
  /** starts suppressed because the first 8 cm were blocked (debug) */
  startBlocks = 0;
  private throttled = false;
  private throttleT = 0;
  throttles = 0;
  private wallCol: RAPIER.Collider | null = null;
  private wallNy = 0;
  /** debug: requested and achieved horizontal velocity of the last step [dx, dz, mx, mz] (m/s) */
  dbgMove = [0, 0, 0, 0];
  private netHist: number[] = [];
  private stuck = false;
  private centers = new Map<number, THREE.Vector3>();
  /** largest slide deflection from the input (rad) since load — debug */
  slideDev = 0;
  private wallStop = false;
  private wallGap = Infinity;
  /** Debug: stall-watchdog sidesteps taken. */
  stallCount = 0;
  private wallWish = new THREE.Vector3();

  // ---- locomotion ----
  private state: State = 'ground';
  /** Locomotion weights [idle, walk, run]; body speed = Σ w·v (speed-matched crossfade). */
  /** locomotion weights [idle, walk, run, back, strafeL, strafeR] (canon: walk slot = jog Running_A, run = sprint) */
  private lw = [1, 0, 0, 0, 0, 0];
  private wish = new THREE.Vector3();
  private runHeld = false;
  private jumpQueued = 0; // seconds left the request stays valid
  private jsTime = 0;
  /** jsTime at the start of the last fixed step: Jump_Start's clock is interpolated with the body (no 60 Hz judder). */
  private jsTimePrev = 0;
  /** mixer value of each bone edited procedurally this frame (restored before the next pose update) */
  private procBase = new Map<THREE.Object3D, THREE.Quaternion>();
  private jsMoving = false;
  private landTime = -1;
  private landPeak = 0;
  private airTime = 0;

  // ---- animation (owned here, applied to whichever model is active) ----
  private clips = new Map<Slot, THREE.AnimationClip>();
  private findClip: ((pack: string, name: string) => THREE.AnimationClip | null) | null = null;
  private times: Record<Slot, number> = { idle: 0, walk: 0, run: 0, jstart: 0, jair: 0, jland: 0, back: 0, strafeL: 0, strafeR: 0 };
  private weights: Record<Slot, number> = { idle: 1, walk: 0, run: 0, jstart: 0, jair: 0, jland: 0, back: 0, strafeL: 0, strafeR: 0 };
  private group = { loco: 1, jstart: 0, jair: 0 };
  private applier: PoseApplier | null = null;
  private model: THREE.Object3D | null = null;
  private templates = new Map<string, Promise<THREE.Object3D | null>>();
  private switchToken = 0;

  // ---- foot slip probe ----
  private toes: THREE.Object3D[] = [];
  private lastFoot = -1;
  private lastFootPos = new THREE.Vector3();
  private lastBodyPos = new THREE.Vector3();
  private slipWin: { d: number; dt: number; t: number }[] = [];
  private lastPlanted = false;
  /** Debug: set to [] from the console to record planted-toe speed samples. */
  slipTrace: number[][] | null = null;
  /** debug: steep KCC contacts [t, feet xyz, normal xyz, contact y, collider, small] when set to [] */
  contactTrace: unknown[][] | null = null;
  /** Per-gait session totals of planted-toe slip (m, s, max of the 0.2 s average). */
  slipStats: Record<string, { d: number; t: number; max: number }> = {};
  footSlip = 0;
  private footY = 0;

  constructor(private ctx: CoreContext) {
    this.root.name = 'player';
  }

  // ------------------------------------------------------------------ init
  /** Boot profile of init() (ms per phase), exposed in debugState().initMs. */
  initMs: Record<string, number> = {};

  async init(): Promise<void> {
    const ctx = this.ctx;
    let tm = performance.now();
    const mark = (k: string) => { const n = performance.now(); this.initMs[k] = Math.round(n - tm); tm = n; };
    this.R = ctx.rapier;
    const assets = ctx.assets as CoreContext['assets'] & { url(id: string): string | null };
    const url = (id: string) => (assets.url ? assets.url(id) : null);

    // physics body first (cheap), so spawn() works even while assets load
    const R = this.R;
    const w = ctx.physics.world;
    this.body = w.createRigidBody(R.RigidBodyDesc.kinematicPositionBased().setTranslation(0, CENTER_Y, 0));
    this.collider = w.createCollider(R.ColliderDesc.capsule(HALF, RADIUS).setCollisionGroups(PLAYER_GROUPS), this.body);
    const k = w.createCharacterController(SKIN);
    k.setUp({ x: 0, y: 1, z: 0 });
    k.setSlideEnabled(true);
    k.setMaxSlopeClimbAngle((35 * Math.PI) / 180);
    k.setMinSlopeSlideAngle((45 * Math.PI) / 180);
    k.enableAutostep(0.45, 0.12, false);
    k.enableSnapToGround(0.35);
    k.setApplyImpulsesToDynamicBodies(false);
    k.setCharacterMass(null);
    this.kcc = k;
    ctx.physics.onFixedStep((dt) => this.fixedStep(dt));
    ctx.events.on('chunk:unloaded', () => this.obstacleCache.clear()); // collider handles get reused

    // clips
    const packs = new Set(Object.values(CLIP_CHOICE).map((c) => c[0]));
    const gl = new Map<string, THREE.AnimationClip[]>();
    await Promise.all(
      [...packs].map(async (id) => {
        const u = url(id);
        const g = u ? await assets.loadGltf(u) : null;
        if (g) gl.set(id, g.animations);
        else console.warn(`[character] animation pack ${id} missing`);
      }),
    );
    mark('animPacks');
    const find = (pack: string, name: string) => gl.get(pack)?.find((c) => c.name === name) ?? null;
    this.findClip = find;
    // URL overrides for experiments: ?walkClip=Walking_B&runClip=Running_B
    const p = ctx.params;
    this.controls = p.get('controls') === 'legacy' ? 'legacy' : 'canon';
    // canon: W = jog (Running_A in the walk slot), Shift+W = sprint (Running_B); legacy keeps Walking_B
    if (this.controls === 'canon') CLIP_CHOICE.walk = ['anim/Rig_Medium_MovementBasic', CANON_JOG];
    if (p.get('walkClip')) CLIP_CHOICE.walk = ['anim/Rig_Medium_MovementBasic', p.get('walkClip')!];
    if (p.get('runClip')) CLIP_CHOICE.run = ['anim/Rig_Medium_MovementBasic', p.get('runClip')!];
    this.useCurve = p.get('rootCurve') !== '0';
    const g = p.get('gait');
    if (g === 'walk' || g === 'run') GAIT_CONFIG.default = g;
    for (const s of SLOTS) {
      const [pack, name] = CLIP_CHOICE[s];
      const c = find(pack, name);
      if (c) this.clips.set(s, stripRootMotion(c));
      else console.warn(`[character] clip ${name} missing`);
    }

    const knight = await this.template('Knight');
    if (!knight) throw new Error('Knight model missing');
    mark('knight');

    // natural ground speeds / toe tracks: precomputed offline (boot speed); validated against the loaded clips and
    // re-measured at runtime only when stale (or for every clip in ?charMeasure=1, which also dumps the constants)
    const measureAll = p.get('charMeasure') === '1';
    const needed: [THREE.AnimationClip, boolean][] = [];
    const add = (c: THREE.AnimationClip | null | undefined, loop: boolean) => { if (c && !needed.some(([x]) => x.name === c.name)) needed.push([c, loop]); };
    for (const s of ['idle', 'walk', 'run', 'back', 'strafeL', 'strafeR'] as Slot[]) add(this.clips.get(s), true);
    add(this.clips.get('jair'), true);
    add(this.clips.get('jstart'), false);
    add(this.clips.get('jland'), false);
    if (measureAll) for (const [pack, name] of MEASURE_LOOPS) { const c = find(pack, name); add(c ? stripRootMotion(c) : null, true); }
    let stale = 0;
    for (const [c, loop] of needed) {
      const pre = PRECOMPUTED.clips[c.name];
      const ok = !measureAll && pre && PRECOMPUTED.scale === CHAR_SCALE && Math.abs((pre.duration as number) - c.duration) < 1e-3;
      if (ok) this.measures[c.name] = unpackMeasure(pre);
      else {
        if (!measureAll) stale++;
        this.measures[c.name] = measureClip(knight, c, CHAR_SCALE, loop);
      }
    }
    mark('measures');
    if (stale) console.warn(`[character] ${stale} precomputed clip measurement(s) missing/stale — measured at runtime (regenerate measures.gen.ts with ?charMeasure=1)`);
    // bone-name validation (cheap): every used clip must bind to the Knight skeleton
    for (const c of this.clips.values()) {
      const f = boundFraction(knight, c);
      if (f < 0.95) console.warn(`[character] clip ${c.name} binds only ${(f * 100).toFixed(0)} % of tracks to the Knight`);
    }
    if (measureAll) {
      (window as any).__kfbCharacterMeasureDump = JSON.stringify({ scale: CHAR_SCALE, clips: Object.fromEntries(Object.entries(this.measures).map(([k, m]) => [k, packMeasure(m)])) });
    }
    const mw = this.measures[CLIP_CHOICE.walk[1]];
    const mr = this.measures[CLIP_CHOICE.run[1]];
    if (mw?.curveMean > 0.1) this.vWalk = mw.curveMean;
    if (mr?.curveMean > 0.1) this.vRun = mr.curveMean;
    // start phase from a stand: the planted toe should be where the idle pose already has it (mid-stance), so the
    // fade from idle doesn't drag a planted foot across the ground
    const mi = this.measures[CLIP_CHOICE.idle[1]];
    const entry = (m: ClipMeasure | undefined) => {
      if (!m?.toes || !mi?.toes) return m?.plantPhaseL ?? 0;
      const refL = mi.toes.l[0], refR = mi.toes.r[0];
      let best = Infinity, bi = 0;
      const n = m.toes.l.length;
      for (let i = 0; i < n; i++) {
        if (m.toes.stL[i]) { const d = Math.hypot(m.toes.l[i][0] - refL[0], m.toes.l[i][1] - refL[1]); if (d < best) { best = d; bi = i; } }
        if (m.toes.stR[i]) { const d = Math.hypot(m.toes.r[i][0] - refR[0], m.toes.r[i][1] - refR[1]); if (d < best) { best = d; bi = i; } }
      }
      return bi / n;
    };
    this.entryWalk = entry(mw);
    this.entryRun = entry(mr);
    this.curveWalk = mw?.curve ?? null;
    this.curveRun = mr?.curve ?? null;
    this.vRunMax = this.vRun * 1.05; // body speed cap (stance surges of the clip are clipped; flight carries the mean)
    const table = Object.values(this.measures).map((m) => ({
      clip: m.name, dur: +m.duration.toFixed(3), speed: +m.curveMean.toFixed(3), strideSpeed: +m.speed.toFixed(3), median: +m.speedMedian.toFixed(3), drift: +m.drift.toFixed(3), speedL: +m.speedL.toFixed(3), speedR: +m.speedR.toFixed(3),
      ankle: +m.speedAnkle.toFixed(3), stance: +m.stanceFrac.toFixed(2), plantL: +m.plantPhaseL.toFixed(3), axis: m.axis.map((x) => +x.toFixed(2)),
      bound: +m.bound.toFixed(2), liftoff: +m.liftoff.toFixed(3), touchdown: +m.touchdown.toFixed(3), minFootY: +m.minFootY.toFixed(3),
      hips0: +m.hips0.toFixed(3), hips1: +m.hips1.toFixed(3),
    }));
    (window as any).__kfbCharacterMeasures = table;
    console.info('[character] measured clip ground speeds (m/s @ CHAR_SCALE):', table.map((t) => `${t.clip}=${t.speed}`).join(' '),
      `→ walk ${CLIP_CHOICE.walk[1]} ${this.vWalk.toFixed(3)} m/s, run ${CLIP_CHOICE.run[1]} ${this.vRun.toFixed(3)} m/s`);

    // canon strafe: Q must move left. Model +X is world-left of the heading (local +X = (cos h, 0, −sin h)), so the
    // left strafe is the clip whose measured travel has x > 0 (swap if the pack names them the other way)
    if (this.travelOf(STRAFE_L)[0] < 0 && this.travelOf(STRAFE_R)[0] > 0) { this.strafeLeftGait = STRAFE_R; this.strafeRightGait = STRAFE_L; }
    console.info('[character] canon gaits (m/s):', `jog ${CLIP_CHOICE.walk[1]} ${this.vWalk.toFixed(3)}`, `sprint ${this.vRun.toFixed(3)}`,
      `back ${this.vDir(BACK).toFixed(3)} dir ${this.travelOf(BACK).map((v) => v.toFixed(2))}`,
      `strafeL ${this.vDir(STRAFE_L).toFixed(3)} dir ${this.travelOf(STRAFE_L).map((v) => v.toFixed(2))}`,
      `strafeR ${this.vDir(STRAFE_R).toFixed(3)} dir ${this.travelOf(STRAFE_R).map((v) => v.toFixed(2))}`);

    // start in idle, walk/run phases aligned to a left-foot plant
    this.locoT.walk = this.locoTPrev.walk = (mw?.plantPhaseL ?? 0) * (this.clips.get('walk')?.duration ?? 1);
    this.locoT.run = this.locoTPrev.run = (mr?.plantPhaseL ?? 0) * (this.clips.get('run')?.duration ?? 1);

    (window as any).__kfbCharacter = {
      /** Debug: toe/ankle trajectories (model space, metres) of a MovementBasic/General clip. */
      dump: (name: string) => {
        const c = [...gl.values()].flat().find((x) => x.name === name);
        if (!c) return null;
        measureClip(knight, stripRootMotion(c), CHAR_SCALE, true, 64);
        const S = lastSamples!;
        const f = (v: THREE.Vector3) => [+v.y.toFixed(3), +v.z.toFixed(3)];
        return { dt: S.dt, tl: S.P.tl.map(f), fl: S.P.fl.map(f), tr: S.P.tr.map(f), hips: S.P.hips.map(f) };
      },
    };
    this.useModel('Knight', knight);
    ctx.scene.add(this.root);
    mark('model');
    this.ready = true;
    // the other characters load in the background right away (not awaited: init stays fast). Their GLTF parse
    // (50–120 ms each) then falls into the boot/loading phase instead of gameplay; each is warmed (skinned + shadow
    // programs via compileAsync, textures uploaded with initTexture) so the first switch costs ~2 ms. A key pressed
    // before that loads on demand (setCharacter).
    void (async () => {
      for (const n of CHARACTERS) {
        if (n === 'Knight') continue;
        const tl = performance.now();
        const t = await this.template(n);
        this.loadLog.push(['load', n, +(performance.now() - tl).toFixed(1), +performance.now().toFixed(0)]);
        if (!t) continue;
        try {
          const tw = performance.now();
          const warm = skClone(t);
          warm.position.set(0, -500, 0);
          const r = this.ctx.renderer;
          warm.traverse((o) => {
            const m = o as THREE.Mesh;
            if (!m.isMesh) return;
            m.castShadow = true;
            for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
              const map = (mat as THREE.MeshStandardMaterial).map;
              if (map) r.initTexture(map);
            }
          });
          this.ctx.scene.add(warm);
          await (r as THREE.WebGLRenderer & { compileAsync?: Function }).compileAsync?.(warm, this.ctx.camera, this.ctx.scene);
          this.ctx.scene.remove(warm);
          this.loadLog.push(['warm', n, +(performance.now() - tw).toFixed(1), +performance.now().toFixed(0)]);
        } catch { /* warm-up is best effort */ }
        await new Promise((res) => setTimeout(res, 30));
      }
    })();
  }

  /**
   * Debug: sample a pack clip on a clone of the Knight at CHAR_SCALE (root motion kept): per sample t, root y, hips y,
   * left/right toe y (world, m above the clone's origin) and hips z (forward travel). `__kfb.engine.ctx.services.get('player')
   * .clipCurve('Jump_Full_Short')`.
   */
  async clipCurve(name: string, n = 60, pack = 'anim/Rig_Medium_MovementBasic'): Promise<{ name: string; duration: number; s: number[][] } | null> {
    const c = this.findClip?.(pack, name);
    const knight = await this.template('Knight');
    if (!c || !knight) return null;
    const wrap = new THREE.Group();
    wrap.scale.setScalar(CHAR_SCALE);
    const model = skClone(knight);
    wrap.add(model);
    const mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(c).play();
    const get = (n2: string) => { let o: THREE.Object3D | null = null; model.traverse((x) => { if (!o && x.name.toLowerCase() === n2) o = x; }); return o as THREE.Object3D | null; };
    const root = get('root'), hips = get('hips'), tl = get('toesl'), tr = get('toesr');
    const v = new THREE.Vector3(), out: number[][] = [];
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * c.duration;
      mixer.setTime(t);
      wrap.updateMatrixWorld(true);
      const y = (o: THREE.Object3D | null) => (o ? +o.getWorldPosition(v).y.toFixed(3) : NaN);
      out.push([+t.toFixed(3), y(root), y(hips), y(tl), y(tr), hips ? +hips.getWorldPosition(v).z.toFixed(3) : NaN]);
    }
    return { name, duration: c.duration, s: out };
  }

  /** Record a bone's mixer rotation before its first procedural edit this frame (see procBase). */
  private touch(b: THREE.Object3D): void {
    if (!this.procBase.has(b)) this.procBase.set(b, b.quaternion.clone());
  }

  private template(name: string): Promise<THREE.Object3D | null> {
    let p = this.templates.get(name);
    if (!p) {
      const assets = this.ctx.assets as CoreContext['assets'] & { url(id: string): string | null };
      const u = assets.url?.(`char/${name}`);
      p = u ? assets.loadGltf(u).then((g) => (g ? g.scene : null)) : Promise.resolve(null);
      this.templates.set(name, p);
    }
    return p;
  }

  /** Hero hand items on the handslot bones (async; skipped silently if an item is missing). */
  private async attachItems(name: string, model: THREE.Object3D): Promise<void> {
    const mode = this.ctx.params.get('items');
    if (mode === '0') return;
    const spec = (mode === 'all' ? ITEMS_ALL : ITEMS_SAFE)[name];
    if (!spec) return;
    for (const [side, item] of [['r', spec.r], ['l', spec.l]] as const) {
      if (!item) continue;
      const src = await loadItem(item);
      const slot = model.getObjectByName(side === 'r' ? 'handslotr' : 'handslotl');
      if (!src || !slot || this.model !== model) continue;
      const obj = src.clone(true);
      obj.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; }
      });
      obj.name = `item:${item}`;
      if (item === 'staff') obj.rotation.x = Math.PI; // orb up (the pack's handslot frame holds it head-down)
      slot.add(obj);
    }
  }

  /** Debug: timings of background loads and switches (ms). */
  loadLog: (string | number)[][] = [];
  private useModel(name: string, template: THREE.Object3D): void {
    const t0 = performance.now();
    const model = skClone(template);
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        if ((m as THREE.SkinnedMesh).isSkinnedMesh) m.frustumCulled = false;
      }
    });
    const applier = new PoseApplier(model, this.clips);
    for (const c of this.clips.values()) {
      const f = boundFraction(model, c);
      if (f < 0.95) console.warn(`[character] ${name}: clip ${c.name} binds ${(f * 100).toFixed(0)} %`);
    }
    applier.apply(this.times, this.weights); // same pose as the old model → seamless switch
    if (this.model) this.root.remove(this.model);
    this.applier?.dispose();
    this.model = model;
    this.applier = applier;
    this.root.add(model);
    this.root.scale.setScalar(CHAR_SCALE);
    this.toes = ['toesl', 'toesr'].map((n) => model.getObjectByName(n)!).filter(Boolean);
    this.legs = findLegs(model);
    void this.attachItems(name, model);
    this.lastFoot = -1;
    const prev = this.character;
    this.character = name;
    this.loadLog.push(['switch', name, +(performance.now() - t0).toFixed(1)]);
    if (prev !== name || !this.ready) this.ctx.events.emit('player:switched', { name });
  }

  setCharacter(name: string): void {
    const n = CHARACTERS.find((c) => c.toLowerCase() === String(name).toLowerCase());
    if (!n || n === this.character) return;
    const token = ++this.switchToken;
    void this.template(n).then((t) => {
      if (!t || token !== this.switchToken) return;
      this.useModel(n, t);
    });
  }

  // ------------------------------------------------------------------ spawn
  spawn(x: number, y: number, z: number, heading?: number): void {
    this.explicitSpawn = true;
    this.place(x, y, z, heading);
  }

  place(x: number, y: number, z: number, heading?: number): void {
    this.feet.set(x, y + 0.05, z);
    this.prevFeet.copy(this.feet);
    this.position.copy(this.feet);
    if (heading !== undefined) this.heading = this.physHeading = this.prevHeading = this.ctlYaw = this.ctlYawPrev = this.yaw = heading;
    this.vy = 0;
    this.hVel.set(0, 0, 0);
    this.airVel.set(0, 0, 0);
    this.lw = [1, 0, 0, 0, 0, 0];
    this.lwPrev = [1, 0, 0, 0, 0, 0];
    this.gTarget = this.want = this.wantRaw = 0;
    this.visY = this.prevVisY = this.feet.y;
    this.turnGoal = this.physHeading;
    this.state = 'ground';
    this.settle = true;
    this.yOffset = 0;
    this.body?.setTranslation({ x, y: this.feet.y + CENTER_Y, z }, true);
    this.body?.setNextKinematicTranslation({ x, y: this.feet.y + CENTER_Y, z });
    this.trySettle();
  }

  /** If ground exists below: push the capsule up out of any overlapping solid. Returns false when no ground yet. */
  private trySettle(): boolean {
    if (!this.body) return false;
    const R = this.R;
    const w = this.ctx.physics.world;
    const q = groups(0xffff, G_WORLD);
    const ray = new R.Ray({ x: this.feet.x, y: this.feet.y + 0.5, z: this.feet.z }, { x: 0, y: -1, z: 0 });
    const ground = w.castRay(ray, 400, true, R.QueryFilterFlags.EXCLUDE_SENSORS, q);
    if (!ground) return false;
    const shape = new R.Capsule(HALF, RADIUS);
    for (let i = 0; i < 60; i++) {
      let hit = false;
      w.intersectionsWithShape({ x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z }, { x: 0, y: 0, z: 0, w: 1 }, shape, () => {
        hit = true;
        return false;
      }, R.QueryFilterFlags.EXCLUDE_SENSORS, q, this.collider);
      if (!hit) break;
      this.feet.y += 0.25;
    }
    this.prevFeet.copy(this.feet);
    this.body.setTranslation({ x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z }, true);
    this.body.setNextKinematicTranslation({ x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z });
    this.settle = false;
    return true;
  }

  // ------------------------------------------------------------------ per frame input
  readInput(): void {
    const inp = this.ctx.input;
    if (this.controls === 'canon') { this.readCanon(); return; }
    const ax = (inp.isDown('KeyD') || inp.isDown('ArrowRight') ? 1 : 0) - (inp.isDown('KeyA') || inp.isDown('ArrowLeft') ? 1 : 0);
    const az = (inp.isDown('KeyW') || inp.isDown('ArrowUp') ? 1 : 0) - (inp.isDown('KeyS') || inp.isDown('ArrowDown') ? 1 : 0);
    const f = new THREE.Vector3();
    // camera-relative: the verification override (static presets) wins over whatever the camera module did this frame
    const ov = (this.ctx as CoreContext & { getCameraOverride?: () => { position: number[]; target: number[] } | null }).getCameraOverride?.();
    // otherwise the user's orbit yaw from the camera rig (unaffected by its emergency slides; ground forward =
    // (−sin yaw, 0, −cos yaw)), falling back to the actual camera direction when there is no rig
    const rig = this.ctx.services.get<{ yaw?: number }>('cameraRig');
    if (ov) f.set(ov.target[0] - ov.position[0], 0, ov.target[2] - ov.position[2]);
    else if (rig && typeof rig.yaw === 'number' && Number.isFinite(rig.yaw)) f.set(-Math.sin(rig.yaw), 0, -Math.cos(rig.yaw));
    else this.ctx.camera.getWorldDirection(f);
    f.y = 0;
    if (f.lengthSq() < 1e-6) f.set(0, 0, -1);
    f.normalize();
    const right = new THREE.Vector3(-f.z, 0, f.x);
    this.wish.copy(f).multiplyScalar(az).addScaledVector(right, ax);
    if (this.wish.lengthSq() > 1e-6) this.wish.normalize();
    const shift = inp.isDown('ShiftLeft') || inp.isDown('ShiftRight');
    this.runHeld = GAIT_CONFIG.default === 'run' ? !shift : shift;
    if (inp.pressed('Space')) this.jumpQueued = 0.15;
    for (let i = 0; i < CHARACTERS.length; i++) if (inp.pressed(`Digit${i + 1}`)) this.setCharacter(CHARACTERS[i]);
  }

  /**
   * KFB ground-controls canon: W/S forward/back · A/D turn · Q/E strafe · Shift run · Space jump (the camera — RMB orbit,
   * wheel zoom — is the camera module's). The character owns the heading (`yaw`); input is relative to it.
   */
  private readCanon(fromStep = false): void {
    const inp = this.ctx.input;
    const k = (...c: string[]) => (c.some((x) => inp.isDown(x)) ? 1 : 0);
    const fz = k('KeyW', 'ArrowUp') - k('KeyS', 'ArrowDown');
    const sx = k('KeyE') - k('KeyQ'); // + = right
    this.inTurn = k('KeyD', 'ArrowRight') - k('KeyA', 'ArrowLeft');
    const shift = k('ShiftLeft', 'ShiftRight') === 1;
    const f = new THREE.Vector3(Math.sin(this.ctlYaw), 0, Math.cos(this.ctlYaw));
    const right = new THREE.Vector3(-f.z, 0, f.x);
    this.wish.set(0, 0, 0);
    this.faceDir.copy(f);
    this.keyGait = 0;
    if (fz > 0) {
      // forward (and forward diagonals): forward gaits
      this.wish.copy(f).addScaledVector(right, sx).normalize();
      this.keyGait = shift ? 2 : 1;
    } else if (fz < 0) {
      this.wish.copy(f).multiplyScalar(-1).addScaledVector(right, sx).normalize();
      this.keyGait = BACK;
    } else if (sx !== 0) {
      // strafe: the clip whose measured travel goes that way
      this.wish.copy(right).multiplyScalar(sx);
      this.keyGait = sx > 0 ? this.strafeRightGait : this.strafeLeftGait;
    }
    if (this.keyGait) {
      // the body turns so that the clip's MEASURED travel direction points exactly along the movement: forward gaits
      // face the movement, backwards faces away from it, the strafe runs (whose feet travel ±60° off model forward)
      // face 30° into the strafe — the feet then move exactly sideways relative to the heading, nothing slides
      const [tx, tz] = this.travelOf(this.keyGait);
      const a = Math.atan2(this.wish.x, this.wish.z) - Math.atan2(tx, tz); // model travel (tx, tz) points at world angle h + atan2(tx, tz)
      this.faceDir.set(Math.sin(a), 0, Math.cos(a));
    }
    this.runHeld = shift;
    if (fromStep) return;
    if (inp.pressed('Space')) this.jumpQueued = 0.15;
    for (let i = 0; i < CHARACTERS.length; i++) if (inp.pressed(`Digit${i + 1}`)) this.setCharacter(CHARACTERS[i]);
  }
  private strafeLeftGait = STRAFE_L;
  private strafeRightGait = STRAFE_R;

  // ------------------------------------------------------------------ fixed step (60 Hz)
  /** Mean (natural) locomotion speed of the current blend. */
  private locoSpeed(): number {
    return this.lw[1] * this.vWalk + this.lw[2] * this.vRun;
  }

  /** Instantaneous speed of the current blend: each gait's foot-contact root-motion curve at its current phase. */
  private phaseSpeed(): number {
    const at = (curve: Float32Array | null, slot: Slot, mean: number) => {
      const c = this.clips.get(slot);
      if (!curve || !c) return mean;
      // sample at the middle of this fixed step (the clock advances by dt after the move)
      const t = this.locoT[slot as LocoSlot] + this.ctx.physics.fixedDt / 2;
      const f = (((t / c.duration) % 1) + 1) % 1 * curve.length;
      const i = Math.floor(f) % curve.length;
      const j = (i + 1) % curve.length;
      return curve[i] + (curve[j] - curve[i]) * (f - Math.floor(f));
    };
    return this.lw[1] * at(this.curveWalk, 'walk', this.vWalk) + this.lw[2] * at(this.curveRun, 'run', this.vRun);
  }

  // ------------------------------------------------------------------ gait helpers (measured foot contact)
  private slotOf(g: number): LocoSlot {
    return g === 2 ? 'run' : g === BACK ? 'back' : g === STRAFE_L ? 'strafeL' : g === STRAFE_R ? 'strafeR' : 'walk';
  }
  private mOf(g: number): ClipMeasure | undefined {
    return this.measures[this.clips.get(this.slotOf(g))?.name ?? ''];
  }
  private phaseOf(g: number): number {
    const c = this.clips.get(this.slotOf(g));
    return c ? (((this.locoT[this.slotOf(g)] / c.duration) % 1) + 1) % 1 : 0;
  }
  private sampleIdx(m: ClipMeasure, ph: number): number {
    const n = m.toes!.l.length;
    return Math.floor(ph * n) % n;
  }
  /** Planted foot of gait g at its current phase (leading foot if both are down), null in flight. */
  private stanceFoot(g: number): 'l' | 'r' | null {
    const m = this.mOf(g);
    if (!m?.toes) return null;
    const i = this.sampleIdx(m, this.phaseOf(g));
    const L = m.toes.stL[i], Rt = m.toes.stR[i];
    if (L && Rt) return m.toes.l[i][1] >= m.toes.r[i][1] ? 'l' : 'r';
    return L ? 'l' : Rt ? 'r' : null;
  }
  /** Model-space toe (x, z) of foot f of gait g at its current phase. */
  private toeAt(g: number, f: 'l' | 'r'): [number, number] {
    const m = this.mOf(g)!;
    const i = this.sampleIdx(m, this.phaseOf(g));
    return (f === 'l' ? m.toes!.l : m.toes!.r)[i];
  }
  /** Phase of gait dst whose planted foot f sits where gait src's planted foot f is now (plant-matched switch). */
  private matchPhase(src: number, f: 'l' | 'r', dst: number): number {
    const md = this.mOf(dst);
    if (!md?.toes || !this.mOf(src)?.toes) return md?.plantPhaseL ?? 0;
    const p = this.toeAt(src, f);
    const arr = f === 'l' ? md.toes.l : md.toes.r;
    const st = f === 'l' ? md.toes.stL : md.toes.stR;
    let best = Infinity, bi = 0;
    for (let i = 0; i < arr.length; i++) {
      if (!st[i]) continue;
      const d = Math.hypot(arr[i][0] - p[0], arr[i][1] - p[1]);
      if (d < best) { best = d; bi = i; }
    }
    return bi / arr.length;
  }
  /** Seconds foot f of gait g stays planted from now on. */
  private stanceLeft(g: number, f: 'l' | 'r'): number {
    const m = this.mOf(g);
    const c = this.clips.get(this.slotOf(g));
    if (!m?.toes || !c) return 0;
    const st = f === 'l' ? m.toes.stL : m.toes.stR;
    const n = st.length;
    let i = this.sampleIdx(m, this.phaseOf(g)), k = 0;
    while (k < n && st[(i + k) % n]) k++;
    return (k / n) * c.duration;
  }
  /** Model-space toe (x, z) of foot f of gait g at clip time t (linear between measured samples). */
  private toeAtTime(g: number, f: 'l' | 'r', t: number): [number, number] {
    const m = this.mOf(g)!;
    const c = this.clips.get(this.slotOf(g))!;
    const arr = f === 'l' ? m.toes!.l : m.toes!.r;
    const n = arr.length;
    const x = ((((t / c.duration) % 1) + 1) % 1) * n;
    const i = Math.floor(x) % n, j = (i + 1) % n, k = x - Math.floor(x);
    return [arr[i][0] + (arr[j][0] - arr[i][0]) * k, arr[i][1] + (arr[j][1] - arr[i][1]) * k];
  }

  /**
   * Planted-foot root motion: the body moves exactly so that the planted toe of the CURRENT BLEND stays fixed in the
   * world — over this step, from (weights, clocks) at its start to (weights, clocks) at its end. This covers steady
   * gaits and every crossfade (the term weight-rate × toe-offset is absorbed by the body instead of the foot).
   * Returns the local (x, z) body displacement, or null in a flight phase (no foot down: use the contact curve).
   */
  private plantedMotion(dt: number): [number, number] | null {
    const mi = this.measures[CLIP_CHOICE.idle[1]];
    if (!mi?.toes || !this.mOf(1)?.toes || !this.mOf(2)?.toes) return null;
    const lw0 = this.lwPrev, lw1 = this.lw;
    // the planted foot of the BLEND: the foot whose blended toe height is lowest, if it is on the ground
    // (idle feet are always down, so a half-weight idle/walk step keeps a foot planted through walk's swing)
    const mw = this.mOf(1)!, mr = this.mOf(2)!;
    const iw = this.sampleIdx(mw, this.phaseOf(1)), ir = this.sampleIdx(mr, this.phaseOf(2));
    const yIdle = mi.toes.yl[0];
    const yOf = (ft: 'l' | 'r') =>
      lw1[0] * yIdle + lw1[1] * (ft === 'l' ? mw.toes!.yl[iw] : mw.toes!.yr[iw]) + lw1[2] * (ft === 'l' ? mr.toes!.yl[ir] : mr.toes!.yr[ir]);
    const yl = yOf('l'), yr = yOf('r');
    let f: 'l' | 'r' | null = yl <= yr ? 'l' : 'r';
    // while two gaits blend, a low blended toe already carries the body (it reads as planted on screen)
    const mixing = Math.max(...lw1) < 0.98;
    if (Math.min(yl, yr) > yIdle + (mixing ? 0.045 : 0.02)) f = null;
    this.pmToe = null;
    if (!f) return null; // no foot down: contact curve (flight)
    const idle = f === 'l' ? mi.toes.l[0] : mi.toes.r[0];
    const tW = this.locoT.walk, tR = this.locoT.run;
    const at = (w: number[], dtx: number) => {
      const a = this.toeAtTime(1, f!, tW + dtx), b = this.toeAtTime(2, f!, tR + dtx);
      return [w[0] * idle[0] + w[1] * a[0] + w[2] * b[0], w[0] * idle[1] + w[1] * a[1] + w[2] * b[1]];
    };
    const p0 = at(lw0, 0), p1 = at(lw1, dt);
    this.pmToe = [p1[0], p1[1]];
    const blending = Math.max(...lw1) < 0.999 || Math.max(...lw0) < 0.999;
    // a low toe that moves FORWARD in the body frame is swinging (just lifted / about to land), not planted
    if (p1[1] - p0[1] > 1e-4 && Math.max(...lw1) > 0.999) { this.pmToe = null; return null; }
    return [blending ? -(p1[0] - p0[0]) : 0, Math.max(0, -(p1[1] - p0[1]))];
  }

  private setPhase(g: number, ph: number): void {
    const s = this.slotOf(g);
    const c = this.clips.get(s);
    if (!c) return;
    this.locoT[s] = this.locoTPrev[s] = ((((ph % 1) + 1) % 1) * c.duration);
  }
  private commit(g: number, fade: number): void {
    this.gTarget = g;
    this.fadeDur = fade;
    this.stopWait = 0;
  }

  /**
   * Gait transitions. Every change happens at a moment where the outgoing and incoming clips have the same foot
   * planted at the same spot (measured toe tracks), so the planted foot stays put through the crossfade:
   *  idle→gait: the gait starts where its planted toe matches the idle stance;
   *  walk→run: run starts plant-matched to walk's planted toe;
   *  run→walk / run→stop: waits for a run foot plant, switches into walk plant-matched (fade fits the run contact);
   *  walk→idle: waits until the planted walk toe passes under the idle toe position, fades during that stance.
   */
  private gaitStep(want: number, dt: number): void {
    const g = this.gTarget;
    if (want === g) { this.stopWait = 0; return; }
    if (isDir(want) || isDir(g)) { this.dirStep(want, g, dt); return; }
    if (want > 0) this.quickStop = false;
    // stopping for a wall ahead and almost there: settle now (foot locks hold the feet) rather than wait for a plant
    if (want === 0 && g !== 0 && this.wallStop && this.wallGap < WALL_SETTLE) { this.commit(0, FADE_STOP); return; }
    // stopping while an obstacle (lip, wall, rock) already holds us: settle now instead of walking in place against it
    if (want === 0 && g !== 0 && (this.stuck || (this.wallT < 0.1 && this.hVel.length() < 0.3)) && this.lw[0] < 0.5) { this.commit(0, FADE_STOP); this.quickStop = false; return; }
    const lv = (x: number) => (x === STEP ? 0.5 : x);
    if (lv(want) > lv(g)) {
      if (want === 2 && this.lw[2] > 0.7) { this.stopT = -1; this.commit(2, FADE); return; } // resume a stop that just began
      if (g === 0) {
        // from a stand: step-turn (half-weight walk) or walk — never straight into a run (acceleration goes via walk)
        const tgt = want === STEP ? STEP : 1;
        if (this.lw[1] < 0.05) this.setPhase(1, this.entryWalk);
        this.commit(tgt, FADE);
      } else if (g === STEP) {
        this.commit(1, FADE);
      } else {
        // accelerate into the run only from an established walk (no idle→run cross-blend: that skates)
        if (this.lw[1] < 0.8) return;
        const f = this.stanceFoot(1);
        if (this.lw[2] < 0.05) this.setPhase(2, f ? this.matchPhase(1, f, 2) : (this.mOf(1)?.plantPhaseL ?? 0) - (this.mOf(1)?.plantPhaseL ?? 0) + (this.mOf(2)?.plantPhaseL ?? 0));
        this.commit(2, FADE_UP);
      }
      return;
    }
    this.stopWait += dt;
    if (g === 2) {
      if (want === 0) {
        // run stop = plant-and-stop on the next foot plant: the planted toe stays fixed while the body comes to rest
        // over it (planted-foot root motion), and a Jump_Land squat (feet planted) absorbs the momentum
        const f = this.stanceFoot(2);
        const mi = this.measures[CLIP_CHOICE.idle[1]];
        // the body can only travel as far as the planted toe is ahead of its idle spot (foot stays fixed), so the
        // fade length follows from that distance at run speed (linear brake): typically ≈ 0.05 s — a hard plant
        const ahead = f && mi?.toes ? this.toeAt(2, f)[1] - (f === 'l' ? mi.toes.l[0] : mi.toes.r[0])[1] : -1;
        if (RUN_STOP_MODE === 'walk') {
          // speed-matched stop through the walk: on a run foot plant switch into the walk phase whose planted toe is at
          // the same spot and blend RUN_TO_WALK (body speed follows the blended planted toe 4.4 → ~1 m/s, both clips
          // at their natural rate), then the walk → idle stop below (quickStop) settles on the next suitable plant
          if (!f && this.stopWait < 0.45) return;
          if (this.lw[1] < 0.05) this.setPhase(1, f ? this.matchPhase(2, f, 1) : (this.mOf(1)?.plantPhaseL ?? 0));
          this.commit(1, RUN_TO_WALK);
          this.quickStop = true;
          return;
        }
        if (f && ahead > 0.03) {
          // brake over STOP_T with the planted foot IK-locked where it touched down (it re-steps afterwards)
          this.commit(0, STOP_T);
          this.stopT = 0;
          this.stopV = this.hVel.length();
          this.stopLock = true;
          const jl = this.measures[this.clips.get('jland')?.name ?? ''];
          this.landTime = jl ? jl.touchdown + 0.05 : 0.2;
          this.landPeak = STOP_SETTLE;
          this.landIsStop = true;
          this.landT = 0;
          return;
        }
        if (this.stopWait > 0.6) this.commit(0, 0.15);
        return;
      }
      // run → walk (modifier): blend through the matched phase (same foot plant) without stopping
      // (switch on a run foot plant into the walk phase whose planted toe is at the same spot, then a long blend)
      const f = this.stanceFoot(2);
      if (!f && this.stopWait < 0.45) return;
      if (this.lw[1] < 0.05) this.setPhase(1, f ? this.matchPhase(2, f, 1) : (this.mOf(1)?.plantPhaseL ?? 0));
      this.commit(1, RUN_TO_WALK);
      return;
    }
    if (want === STEP && g === 1) { this.commit(STEP, FADE); return; }
    // walk / step-turn → idle
    if (this.lw[2] > 0.01) return;
    const f = this.stanceFoot(1);
    const mi = this.measures[CLIP_CHOICE.idle[1]];
    if (f && mi?.toes) {
      const toe = this.toeAt(1, f);
      const it = f === 'l' ? mi.toes.l[0] : mi.toes.r[0];
      // the foot must still be at/ahead of the idle stance spot: the body then glides forward onto it while the
      // weights fade (planted-foot root motion), never backwards. The other foot must be in the air (it lands on
      // its idle spot instead of sliding there).
      const other = f === 'l' ? 'r' : 'l';
      const m = this.mOf(1)!;
      const oi = this.sampleIdx(m, this.phaseOf(1));
      const otherDown = (other === 'l' ? m.toes!.stL : m.toes!.stR)[oi];
      const d = toe[1] - it[1];
      if (this.quickStop) {
        // stopping out of a run: fade as soon as the run→walk blend is done and the planted toe is not behind its
        // idle spot (the body glides onto it), whatever the other foot does
        if (this.lw[2] < 0.02 && d >= -0.01) { this.commit(0, FADE_STOP); this.quickStop = false; return; }
      } else if (d <= 0.08 && d >= 0 && !otherDown) { this.commit(0, FADE_STOP); return; }
    }
    if (this.stopWait > 0.8) this.commit(0, FADE_STOP);
  }

  /**
   * Canon directional gaits (backwards, strafe): crossfades with the incoming clip phase-matched to the planted foot
   * (2D planted-foot root motion keeps that foot still through the blend). A sprint goes down to the jog first.
   */
  private dirStep(want: number, g: number, dt: number): void {
    if (want > 0) this.quickStop = false;
    if (want === 0) { this.commit(0, FADE_STOP); return; }
    if (isDir(want) && g === 2) { this.stopWait += dt; this.gaitStep(1, dt); return; } // sprint → jog → directional
    const tgt = want === 2 || want === STEP ? 1 : want; // from a directional gait forward goes via the jog
    if (tgt === g) return;
    if (this.lw[lwIdx(tgt)] < 0.05) {
      const f = g !== 0 ? this.stanceFoot(g === STEP ? 1 : g) : null;
      const m = this.mOf(tgt);
      this.setPhase(tgt, f ? this.matchPhase(g === STEP ? 1 : g, f, tgt) : (m?.plantPhaseL ?? 0));
    }
    this.commit(tgt, FADE_DIR);
  }
  /** Natural speed of a directional gait (measured). */
  private vDir(g: number): number {
    return this.mOf(g)?.speed ?? this.vWalk;
  }
  /** Measured travel direction of gait g in model space (x, z), unit (planted toes move the opposite way). */
  private travelOf(g: number): [number, number] {
    if (g === 1 || g === 2 || g === STEP) return [0, 1];
    const m = this.mOf(g);
    const ax = m?.axis ?? [0, -1];
    const l = Math.hypot(ax[0], ax[1]) || 1;
    return [-ax[0] / l, -ax[1] / l];
  }

  /**
   * Planted-foot root motion for blends that include a directional gait (backwards / strafe): like plantedMotion, but
   * in both model axes (the planted toe of the blend stays fixed in the world, the body moves the opposite way). In a
   * flight phase (strafe run) the body moves at the blend's measured natural velocity.
   */
  private plantedMotion2D(dt: number): [number, number] | null {
    const mi = this.measures[CLIP_CHOICE.idle[1]];
    if (!mi?.toes) return null;
    const G = [0, 1, 2, BACK, STRAFE_L, STRAFE_R];
    const lw0 = this.lwPrev, lw1 = this.lw;
    for (let i = 1; i < LW_N; i++) if ((lw0[i] > 0 || lw1[i] > 0) && !this.mOf(G[i])?.toes) return null;
    const yIdle = mi.toes.yl[0];
    const yOf = (ft: 'l' | 'r') => {
      let y = lw1[0] * yIdle;
      for (let i = 1; i < LW_N; i++) {
        if (lw1[i] <= 0) continue;
        const m = this.mOf(G[i])!;
        const k = this.sampleIdx(m, this.phaseOf(G[i]));
        y += lw1[i] * (ft === 'l' ? m.toes!.yl[k] : m.toes!.yr[k]);
      }
      return y;
    };
    const yl = yOf('l'), yr = yOf('r');
    let f: 'l' | 'r' = yl <= yr ? 'l' : 'r';
    const mixing = Math.max(...lw1) < 0.98;
    // a dominant directional clip: its own measured stance flags decide the planted foot (the strafe runs' toes never
    // come down to the idle toe height, so a height threshold would call every frame a flight phase)
    const dom = lw1.indexOf(Math.max(...lw1));
    let domStance: 'l' | 'r' | null | undefined;
    if (dom >= 4 && lw1[dom] > 0.6) { domStance = this.stanceFoot(G[dom]); if (domStance) f = domStance; } // strafe runs only
    // natural velocity of the blend (model space) — flight fallback and swing test
    let vx = 0, vz = 0;
    for (let i = 1; i < LW_N; i++) {
      if (lw1[i] <= 0) continue;
      const [tx, tz] = this.travelOf(G[i]);
      const sp = i === 1 ? this.vWalk : i === 2 ? this.vRun : this.vDir(G[i]);
      vx += lw1[i] * tx * sp; vz += lw1[i] * tz * sp;
    }
    if (domStance === null || (domStance === undefined && Math.min(yl, yr) > yIdle + (mixing ? 0.045 : 0.02))) { this.pmToe = null; return [vx * dt, vz * dt]; }
    const idle = f === 'l' ? mi.toes.l[0] : mi.toes.r[0];
    const at = (w: number[], dtx: number) => {
      let x = w[0] * idle[0], z = w[0] * idle[1];
      for (let i = 1; i < LW_N; i++) {
        if (w[i] <= 0) continue;
        const sl = this.slotOf(G[i]);
        const p = this.toeAtTime(G[i], f, this.locoT[sl] + dtx);
        x += w[i] * p[0]; z += w[i] * p[1];
      }
      return [x, z];
    };
    const p0 = at(lw0, 0), p1 = at(lw1, dt);
    this.pmToe = [p1[0], p1[1]];
    // a low toe moving WITH the travel direction is swinging (just lifted / about to land), not planted
    const dx = p1[0] - p0[0], dz = p1[1] - p0[1];
    // (a toe already at ground height counts as planted even while it still moves — touchdown of the back walk)
    if (dx * vx + dz * vz > 1e-6 && Math.max(...lw1) > 0.999 && Math.min(yl, yr) > yIdle + 0.008) { this.pmToe = null; return [vx * dt, vz * dt]; }
    // never against the travel direction (a crossfade's weight-rate term can ask for a step the wrong way — e.g. idle →
    // backwards first pushes forward; wedged against a wall that read as "stuck" and nothing moved): drop that part
    let mx = -dx, mz = -dz;
    const vl = Math.hypot(vx, vz);
    // (only against an obstacle: in the open that step keeps the planted foot still and is barely visible)
    if (vl > 1e-6 && this.wallT < 0.3) { const along = (mx * vx + mz * vz) / vl; if (along < 0) { mx -= (along * vx) / vl; mz -= (along * vz) / vl; } }
    return [mx, mz];
  }

  /** Seconds until the next foot of gait g touches down (from a flight phase). */
  private timeToTouchdown(g: number): number {
    const m = this.mOf(g);
    const c = this.clips.get(this.slotOf(g));
    if (!m?.toes || !c) return 0;
    const n = m.toes.stL.length;
    const i0 = this.sampleIdx(m, this.phaseOf(g));
    for (let k = 1; k <= n; k++) {
      const i = (i0 + k) % n;
      if (m.toes.stL[i] || m.toes.stR[i]) return (k / n) * c.duration - (this.phaseOf(g) * n - i0) * (c.duration / n);
    }
    return 0;
  }

  private fixedStep(dt: number): void {
    if (!this.ready || !this.body) return;
    this.prevFeet.copy(this.feet);
    this.prevVisY = this.visY;
    this.prevHeading = this.physHeading;
    if (this.settle && !this.trySettle()) return; // no ground under us yet (chunk not built): hold still
    this.lwPrev = this.lw.slice();
    Object.assign(this.locoTPrev, this.locoT);
    this.jsTimePrev = this.jsTime;
    if (this.controls === 'canon') {
      // A/D: eased constant-rate turn of the control heading (D = clockwise seen from above)
      const target = -this.inTurn * YAW_RATE;
      this.yawRate += THREE.MathUtils.clamp(target - this.yawRate, -(YAW_RATE / YAW_EASE) * dt, (YAW_RATE / YAW_EASE) * dt);
      this.ctlYawPrev = this.ctlYaw;
      this.ctlYaw = wrapPi(this.ctlYaw + this.yawRate * dt);
      this.readCanon(true); // re-derive wish / faceDir from the new yaw for this step
    }
    const R = this.R;
    const G = GRAVITY * GRAV_MULT;

    // wall sliding: project the wish onto the wall we are touching, so the character turns and runs ALONG the wall
    // (feet keep matching the body) instead of skating sideways while facing into it
    const wish = this.wish.clone();
    this.wallT += dt;
    // (also long after the last contact when STANDING and the wish points into the stored wall: pressing toward it
    // diagonally must slide along it from the first frame, not start toward the wall and pivot when it hits)
    if (this.wallT >= 0.2 && this.wallN.lengthSq() > 0) {
      const standing = this.hVel.lengthSq() < 0.01;
      if (this.wallT < 1 || (standing && wish.dot(this.wallN) < -0.05)) {
        const c = { x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z };
        const hit = this.ctx.physics.world.castRayAndGetNormal(new R.Ray(c, { x: -this.wallN.x, y: 0, z: -this.wallN.z }), RADIUS + 0.15, true,
          R.QueryFilterFlags.EXCLUDE_SENSORS, groups(0xffff, G_WORLD), this.collider);
        if (hit && !standing) this.wallT = 0;
        else if (hit && Math.abs(hit.normal.y) <= COS_CLIMB) {
          // standing at it: refresh what we touch (the stored normal may be from an older contact)
          this.wallT = 0;
          this.wallN.set(hit.normal.x, 0, hit.normal.z).normalize();
          this.wallNy = hit.normal.y;
          this.wallRound = this.isSmallOrRound(hit.collider);
          this.wallCol = hit.collider;
        }
      }
    }
    // sticky slide side (rotational sense round the obstacle): no flip-flop at convex corners / round trunks
    if (this.wallT > 0.3 || (this.wallSide && wish.dot(this.wallWish) < 0.9)) this.wallSide = 0;
    if (this.wallT < 0.2 && wish.dot(this.wallN) < 0 && !isDir(this.keyGait)) {
      const tlen = Math.sqrt(Math.max(0, 1 - wish.dot(this.wallN) ** 2)) * wish.length();
      if (!this.wallSide) {
        const cy = this.wallN.x * wish.z - this.wallN.z * wish.x;
        this.wallSide = Math.abs(cy) > 0.05 ? Math.sign(cy) : 1;
        // near head-on: go round the short way — toward the side we are already offset to from the obstacle's centre
        // (an arbitrary default sent the knight round the far side of a post at the foot of a bridge ramp)
        if (Math.abs(cy) < 0.35 && this.wallCol) {
          const ctr = this.colliderCenter(this.wallCol);
          const off = (this.feet.x - ctr.x) * -this.wallN.z + (this.feet.z - ctr.z) * this.wallN.x;
          if (Math.abs(off) > 0.03) this.wallSide = Math.sign(off);
        }
        this.wallWish.copy(wish);
      }
      const round = this.wallRound || this.forceSlide > 0;
      this.flatStand = !round && tlen < FLAT_HEADON;
      if (this.flatStand) {
        // big flat wall within ~10° of head-on: stand facing it (stepping turn toward the wall if we came in sideways)
        wish.set(0, 0, 0);
        // (not for overhangs / head bumps, and not while still running along it: stop first, then face it)
        if (Math.abs(this.wallNy) < 0.3 && this.hVel.length() < 1) this.turnGoal = Math.atan2(-this.wallN.x, -this.wallN.z);
      }
      else {
        // slide along it (round/small: always) — but always WITH the input: the sticky rotational side may come from an
        // earlier contact (another rock, the other side of a bank); if its tangent points backward, flip it
        let tx = -this.wallN.z * this.wallSide, tz = this.wallN.x * this.wallSide;
        const wl = Math.hypot(wish.x, wish.z) || 1;
        if ((tx * wish.x + tz * wish.z) / wl < -0.05) { this.wallSide = -this.wallSide; tx = -tx; tz = -tz; this.wallWish.copy(wish); }
        const w = new THREE.Vector3(wish.x / wl, 0, wish.z / wl);
        const t = new THREE.Vector3(tx, 0, tz).normalize();
        const c = t.dot(w);
        if (c < SLIDE_MAX_COS) {
          // more than 60° off the input (near head-on): turn only 60° toward the slide; the KCC slides the rest
          const perp = t.addScaledVector(w, -c).normalize();
          wish.copy(w).multiplyScalar(SLIDE_MAX_COS).addScaledVector(perp, Math.sqrt(1 - SLIDE_MAX_COS ** 2));
        } else wish.copy(t);
        this.slideDev = Math.max(this.slideDev, Math.acos(Math.max(-1, Math.min(1, wish.dot(w)))));
      }
    } else this.flatStand = false;
    // stall watchdog sidestep (blocked with no usable wall normal, e.g. a lip the step-up refuses)
    if (this.forceSlide > 0) {
      this.forceSlide -= dt;
      if (this.wallT >= 0.2 && wish.lengthSq() > 0.01) wish.applyAxisAngle(_up, this.sideSign * 1.0);
    }
    const hasWish = wish.lengthSq() > 0.01;
    if (this.jumpQueued > 0) this.jumpQueued -= dt;
    if (hasWish) this.turnGoal = Math.atan2(wish.x, wish.z);

    // heading: standing turns are slower (both idle feet pivot), moving turns pivot on the planted toe (below)
    const standing = this.state !== 'air' && this.lw[0] >= 0.5 && this.gTarget !== STEP;
    let targetHeading = this.state === 'air'
      ? (hasWish ? Math.atan2(wish.x, wish.z) : this.airVel.lengthSq() > 0.09 ? Math.atan2(this.airVel.x, this.airVel.z) : this.physHeading)
      : hasWish ? Math.atan2(wish.x, wish.z) : this.turnGoal;
    if (this.controls === 'canon' && !this.flatStand) {
      // canon: the body faces faceDir (heading / movement / away from it), in the air too
      this.turnGoal = Math.atan2(this.faceDir.x, this.faceDir.z);
      targetHeading = this.turnGoal;
      // a backwards / strafe gait fading out: keep the facing until it has (turning back to the heading then is a
      // stepping turn on the spot, not a pivot against the planted foot of the fading clip)
      if (this.state === 'ground' && this.gTarget === 0 && this.lw[3] + this.lw[4] + this.lw[5] > 0.05) targetHeading = this.physHeading;
    }
    // reversal at speed: plant-and-stop facing forward, then step round (no 1 m skating arc)
    if (this.state === 'ground' && this.lw[2] > 0.3 && Math.abs(wrapPi(targetHeading - this.physHeading)) > REVERSE) this.reversing = true;
    if (this.reversing && this.lw[0] > 0.6) this.reversing = false;
    if (this.reversing) targetHeading = this.physHeading;
    const dh = wrapPi(targetHeading - this.physHeading);
    // stepping turn: speed up with the step weight (idle-heavy frames still have both feet down)
    const stepK = this.gTarget === STEP ? THREE.MathUtils.clamp(this.lw[1] / STEP_W, 0, 1) : 1;
    const maxTurn = (standing ? TURN_IDLE : this.gTarget === STEP ? TURN_IDLE + (TURN_STEP - TURN_IDLE) * stepK : TURN_MOVE) * dt;
    const step = THREE.MathUtils.clamp(dh * (1 - Math.exp(-14 * dt)), -maxTurn, maxTurn);
    const h0 = this.physHeading;
    this.physHeading = wrapPi(this.physHeading + step);
    const fwd = new THREE.Vector3(Math.sin(this.physHeading), 0, Math.cos(this.physHeading));

    const desired = new THREE.Vector3();
    let s = 0;
    if (this.state === 'ground' || this.state === 'jstart') {
      // requested gait, debounced (a modifier pressed/released a frame apart must not flash the other gait)
      const raw = this.controls === 'canon' ? (hasWish || this.flatStand ? this.keyGait : 0) : hasWish ? (this.runHeld ? 2 : 1) : 0;
      if (raw > 0 && this.wantRaw === 0) {
        this.holdT = 0;
        // pressed from a stand toward a different direction: a short press only turns
        this.tapTurn = this.lw[0] > 0.5 && Math.abs(dh) > TURN_FIRST;
      }
      if (raw > 0) this.holdT += dt;
      if (raw !== this.wantRaw) { this.wantRaw = raw; this.wantT = 0; } else this.wantT += dt;
      if (this.wantT >= DEBOUNCE) this.want = this.wantRaw;
      let want = this.want;
      const fromStand = this.lw[0] > 0.5 || this.gTarget === STEP;
      // never start moving on a key that is already released again (a tap turns, it doesn't run)
      if (this.wantRaw === 0 && fromStand) want = 0;
      if (this.tapTurn && (this.wantRaw === 0 || this.holdT < TAP_TURN)) want = 0;
      // from a stand a short press is one small step; only a held key accelerates (via walk) into the run
      if (want > 0 && !isDir(want) && fromStand && this.holdT < TAP_TURN) want = STEP;
      if (this.reversing) want = 0;
      // a big flat wall straight ahead within stopping distance: start the normal (decelerating) stop now, so the
      // character comes to rest at the wall instead of hitting it at speed (no pose snap, no run in place)
      if (!this.blockedIdle && this.wish.lengthSq() > 0.01 && this.gTarget !== 0 && !isDir(this.gTarget) && (this.flatStand || this.wallAhead())) {
        // already against it: settle at once only if actually moving INTO it (running along it: the normal stop)
        if (this.flatStand) this.wallGap = -(this.hVel.x * this.wallN.x + this.hVel.z * this.wallN.z) > 0.5 || this.hVel.length() < 1 ? 0 : Infinity;
        this.blockedIdle = true;
        this.blockedDir = Math.atan2(this.wish.x, this.wish.z);
        this.blockedIdles++;
        this.wallStops++;
        this.wallStop = true;
      }
      if (this.wallStop && this.blockedIdle && this.gTarget !== 0) this.wallAhead(); // keeps wallGap current
      if (!this.blockedIdle) { this.wallStop = false; this.wallGap = Infinity; }
      if (this.blockedIdle) want = 0; // blocked: stand (feet stay planted) rather than run in place
      // starting from a stand straight into an obstacle (a concave corner, a wall): don't start a step that can only
      // skate — sweep the capsule 8 cm along the (wall-projected) direction first; a free direction starts at once
      // (forward gaits only: backwards / strafe start slowly and the KCC slides them along an obstacle)
      if (want > 0 && !isDir(want) && this.gTarget === 0 && this.state === 'ground' && hasWish && this.sweepBlocked(wish, 0.08)) { want = 0; this.startBlocks++; }
      // gait from the ACTUAL speed: a run held well below run speed by an obstacle (scraping along a wall, berm, rock)
      // becomes a walk at its natural rate; back to the run once the obstacle contact has been gone for 0.4 s
      const vAct = this.hVel.length();
      if (this.state === 'ground' && want === 2 && this.gTarget === 2 && this.lw[2] > 0.9 && vAct < THROTTLE * this.vRun && this.wallT < 0.3) this.throttleT += dt;
      else if (!this.throttled) this.throttleT = 0;
      if (!this.throttled && this.throttleT > THROTTLE_T) { this.throttled = true; this.throttles++; }
      if (this.throttled && (this.wallT > 0.4 || this.wantRaw === 0)) { this.throttled = false; this.throttleT = 0; }
      if (this.throttled && want === 2) want = 1;
      if (this.state === 'jstart' && !this.jsMoving) want = 0;
      if (this.landTime >= 0 && this.landPeak > 0.7 && !hasWish) want = 0;
      // turning from a stand = small stepping turn (half-weight walk steps pivoting on the planted toe), then the
      // requested gait. A short tap only turns (the step-turn finishes, then stops facing the new way).
      const goal = this.controls === 'canon' ? this.turnGoal : hasWish ? Math.atan2(wish.x, wish.z) : this.turnGoal;
      // against a wall the walking pivot would push the body into it (blocked → planted foot slips): finish the turn on the spot
      // (directional gaits: turn on the spot first to within TURN_GO_DIR — they would pivot against a planted foot)
      const turnGo = this.controls === 'canon' && isDir(this.keyGait) ? TURN_GO_DIR : this.gTarget === 0 && hasWish && Math.abs(wrapPi(goal - this.physHeading)) > TURN_GO_WALL && this.touchingWall() ? TURN_GO_WALL : TURN_GO;
      if (this.state === 'ground' && this.gTarget === 0 && Math.abs(wrapPi(goal - this.physHeading)) > turnGo) want = 0; // turn on the spot (stepping feet) first
      this.gaitStep(want, dt);
      const rate = dt / this.fadeDur;
      const tv = this.gTarget === STEP ? [1 - STEP_W, STEP_W, 0, 0, 0, 0] : [0, 1, 2, 3, 4, 5].map((i) => (i === lwIdx(this.gTarget) ? 1 : 0));
      let sum = 0;
      for (let i = 0; i < LW_N; i++) {
        this.lw[i] += THREE.MathUtils.clamp(tv[i] - this.lw[i], -rate, rate);
        sum += this.lw[i];
      }
      for (let i = 0; i < LW_N; i++) this.lw[i] /= sum;
      const dirW = this.lw[3] + this.lw[4] + this.lw[5] + this.lwPrev[3] + this.lwPrev[4] + this.lwPrev[5];
      const pm = !this.useCurve ? null : dirW > 1e-4 ? this.plantedMotion2D(dt) : this.plantedMotion(dt);
      if (pm) {
        s = pm[1] / dt;
        // local +X of the model in world = (cos h, 0, −sin h)
        desired.copy(fwd).multiplyScalar(pm[1]);
        desired.x += Math.cos(this.physHeading) * pm[0];
        desired.z -= Math.sin(this.physHeading) * pm[0];
      } else {
        s = this.useCurve ? this.phaseSpeed() : this.locoSpeed();
        desired.copy(fwd).multiplyScalar(s * dt);
      }
      if (this.stopT >= 0) {
        // run plant-stop: linear brake (the planted foot is held by the visual foot lock)
        s = this.stopV * Math.max(0, 1 - this.stopT / STOP_T);
        desired.copy(fwd).multiplyScalar(s * dt);
        this.stopT += dt;
        if (this.stopT > STOP_T || this.gTarget !== 0) this.stopT = -1;
      }
      if (this.stopLock && (this.lw[0] > 0.99 || this.gTarget !== 0)) this.stopLock = false;
      // turning while moving: rotate about the planted toe, not the body centre (the planted foot stays put)
      if (step !== 0 && (this.lw[0] < 0.5 || this.gTarget === STEP)) {
        if (this.pmToe) {
          const [x, z] = this.pmToe;
          const rot = (h: number) => [x * Math.cos(h) + z * Math.sin(h), -x * Math.sin(h) + z * Math.cos(h)];
          const a = rot(h0), b = rot(this.physHeading);
          desired.x += a[0] - b[0];
          desired.z += a[1] - b[1];
        }
      }
      // never faster than the run's own top contact speed (pivot + root motion must not spike)
      const hs = Math.hypot(desired.x, desired.z) / dt;
      if (hs > this.vRunMax) { desired.x *= this.vRunMax / hs; desired.z *= this.vRunMax / hs; }
      // grounded: purely horizontal request, snap-to-ground keeps contact (a downward component makes Rapier's KCC
      // stop dead on flat ground: the cast hits the floor at toi≈0 and the remainder is dropped — measured)
      if (this.physGrounded) this.vy = 0;
      else this.vy += G * dt;
      desired.y = this.vy * dt;

      if (this.state === 'ground' && this.jumpQueued > 0 && this.physGrounded) {
        this.jumpQueued = 0;
        const js = this.measures[this.clips.get('jstart')?.name ?? ''];
        const lift = js && js.liftoff > 0 ? js.liftoff : 0.25;
        this.jsMoving = this.lw[0] < 0.7;
        // moving: start right at lift-off (no planted crouch while the body moves); standing: short anticipation
        // standing: Jump_Start from its start (a readable crouch), the push-off once ≥ JUMP_HOLD of the clip has played
        // and just past its deepest crouch (Jump_Start 0.6 s: crouch 0.267 s → take-off ≈ 0.3 s)
        const crouch = js && js.crouchT > 0.05 ? js.crouchT : lift;
        const jsDur = this.clips.get('jstart')?.duration ?? 0.6;
        this.jsLift = this.jsMoving ? lift : Math.max(JUMP_HOLD * jsDur, crouch + 0.03);
        this.jsTime = this.jsMoving ? lift : 0;
        this.state = 'jstart';
        this.landTime = -1;
        if (this.lw[2] > 0.5) {
          // running jump = a leap: no upright Jump_Start; the run keeps striding into a forward-leaning leap pose
          this.vy = JUMP_V;
          desired.y = this.vy * dt;
          this.airVel.copy(fwd).multiplyScalar(Math.max(s, this.lw[2] * this.vRun + this.lw[1] * this.vWalk));
          // take-off beat: the push-off part of Jump_Start (from its deepest crouch on) while already airborne
          // (no planted foot → no slide, no lift-off delay), then Jump_Idle
          this.goAir(false);
          this.jsTime = js && js.crouchT > 0.05 ? js.crouchT + 0.02 : 0.3;
          this.leap = true;
          this.leapFrozen = false;
        }
      }
      if (this.state === 'jstart') {
        this.jsTime += dt;
        if (this.jsTime >= this.jsLift) {
          this.vy = JUMP_V;
          desired.y = this.vy * dt;
          if (this.lw[3] + this.lw[4] + this.lw[5] > 0.3) this.airVel.copy(this.hVel); // backwards / strafe jump
          else this.airVel.copy(fwd).multiplyScalar(s);
          this.goAir(false);
        }
      }
    } else {
      // air: momentum + light steering
      this.airTime += dt;
      this.jsTime += dt;
      const target = hasWish ? wish.clone().multiplyScalar(isDir(this.keyGait) ? this.vDir(this.keyGait) : this.runHeld ? this.vRun : this.vWalk) : this.airVel.clone();
      const dv = target.sub(this.airVel);
      const maxDv = AIR_ACCEL * dt;
      if (dv.length() > maxDv) dv.setLength(maxDv);
      this.airVel.add(dv);
      this.vy += (this.vy < 0 ? G * FALL_MULT : G) * dt; // heavier on the way down: short apex hang
      this.vy = Math.max(this.vy, -40);
      desired.copy(this.airVel).multiplyScalar(dt);
      desired.y = this.vy * dt;
    }

    // collide & slide
    this.kcc.computeColliderMovement(this.collider, desired, R.QueryFilterFlags.EXCLUDE_SENSORS, PLAYER_GROUPS);
    const mr = this.kcc.computedMovement();
    const m = { x: mr.x, y: mr.y, z: mr.z };
    let stepped = false;
    this.physGrounded = this.kcc.computedGrounded();
    this.feet.x += m.x;
    this.feet.y += m.y;
    this.feet.z += m.z;
    // small steps (≤ STEP_MAX): our own step-up when the horizontal move was blocked (Rapier's autostep proved
    // unreliable against hull edges here — measured: capsule creeps up the riser instead of stepping)
    if (this.physGrounded && this.state === 'ground') {
      const rem = new THREE.Vector3(desired.x - m.x, 0, desired.z - m.z);
      let steep = false; // only against non-walkable contacts (riser / lip); walkable ramps are the KCC's job
      for (let i = 0; i < this.kcc.numComputedCollisions(); i++) {
        const c = this.kcc.computedCollision(i);
        if (c && c.normal1.y < COS_CLIMB) steep = true;
      }
      if (steep && rem.lengthSq() > 1e-8 && Math.hypot(m.x, m.z) < 0.92 * Math.hypot(desired.x, desired.z)) {
        const fx = this.feet.x, fz = this.feet.z;
        if (this.tryStep(rem) > 0) {
          stepped = true;
          m.x += this.feet.x - fx;
          m.z += this.feet.z - fz;
        }
      }
    }
    this.body.setNextKinematicTranslation({ x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z });
    this.hVel.set(m.x / dt, 0, m.z / dt);
    this.dbgMove = [+(desired.x / dt).toFixed(2), +(desired.z / dt).toFixed(2), +(m.x / dt).toFixed(2), +(m.z / dt).toFixed(2)];
    // stuck = motion requested but < 5 cm net progress over the last 0.15 s (catches a step-up that keeps failing and
    // jittering back and forth at a lip, which per-frame speed does not)
    this.netHist.push(this.feet.x, this.feet.z);
    if (this.netHist.length > 18) this.netHist.splice(0, 2);
    const netD = this.netHist.length >= 18 ? Math.hypot(this.feet.x - this.netHist[0], this.feet.z - this.netHist[1]) : 1;
    this.stuck = this.state === 'ground' && Math.hypot(desired.x, desired.z) / dt > 0.3 && netD < 0.05;
    if (this.hVel.length() > this.vRunMax * 1.02 && this.state !== 'air') this.speedSpikes++;
    // never stand still for long with a movement key held (unless facing a big flat wall head-on)
    if (this.state === 'ground' && this.wish.lengthSq() > 0.01 && !this.flatStand && this.gTarget !== 0 && this.hVel.length() < 0.15) {
      this.stallT += dt;
      if (this.stallT > STALL_T && this.forceSlide <= 0) {
        this.forceSlide = 0.45;
        this.sideSign = this.wallSide || (((Math.floor(this.feet.x * 7) ^ Math.floor(this.feet.z * 7)) & 1) ? 1 : -1);
        this.stallT = 0;
        this.stallCount++;
        this.blockTried = true;
      }
    } else this.stallT = 0;
    // blocked for real (sidestep tried, still no displacement): stop and stand (idle) instead of running in place;
    // stays so until the keys are released or the wish turns ≥ 20° away from the blocked direction
    const held = this.wish.lengthSq() > 0.01;
    const wishH = Math.atan2(this.wish.x, this.wish.z);
    // blocked = the KCC refuses a real requested move (< 40 % of ≥ 0.2 m/s), not merely a slow gait start (the back walk
    // starts at ~0.1 m/s: wedged at a wall that read as blocked and an escape backwards was cancelled)
    const reqV = Math.hypot(desired.x, desired.z) / dt;
    if (this.state === 'ground' && held && this.gTarget !== 0 && this.hVel.length() < 0.15 && reqV > 0.2 && this.hVel.length() < 0.4 * reqV) this.blockT += dt;
    else if (!held || this.hVel.length() > 0.3) { this.blockT = 0; this.blockTried = false; }
    // (held at < 0.15 m/s by a steep contact — the slide along it is blocked too: idle after 0.12 s, a gait would only skate)
    if (!this.blockedIdle && ((this.blockT > BLOCK_IDLE_T && (this.blockTried || this.flatStand)) || (this.blockT > BLOCK_FAST_T && this.wallT < 0.2))) { this.blockedIdle = true; this.blockedDir = wishH; this.blockedIdles++; }
    if (this.blockedIdle && (!held || Math.abs(wrapPi(wishH - this.blockedDir)) > 0.35)) { this.blockedIdle = false; this.blockT = 0; this.blockTried = false; }
    // remember the most opposing wall normal (normal1 points from the obstacle toward the character)
    const dH = new THREE.Vector3(desired.x, 0, desired.z);
    if (!stepped && dH.lengthSq() > 1e-8 && Math.hypot(m.x, m.z) < 0.92 * Math.sqrt(dH.lengthSq())) {
      dH.normalize();
      let best = -0.05;
      for (let i = 0; i < this.kcc.numComputedCollisions(); i++) {
        const c = this.kcc.computedCollision(i);
        if (!c || Math.abs(c.normal1.y) > COS_CLIMB) continue; // too steep to climb = obstacle side (rocks, rims, edges)
        if (this.contactTrace) this.contactTrace.push([+this.ctx.time.toFixed(2), +this.feet.x.toFixed(2), +this.feet.y.toFixed(2), +this.feet.z.toFixed(2), +c.normal1.x.toFixed(2), +c.normal1.y.toFixed(2), +c.normal1.z.toFixed(2), +c.witness1.y.toFixed(2), c.collider ? c.collider.handle : -1, c.collider ? this.isSmallOrRound(c.collider) : null]);
        const n = new THREE.Vector3(c.normal1.x, 0, c.normal1.z).normalize();
        const d = n.dot(dH);
        if (d < best) {
          best = d;
          this.wallN.copy(n);
          this.wallT = 0;
          // slide round anything small (rocks, anvils, crates, posts) and anything round; only big flat walls may stop us
          this.wallRound = c.collider ? this.isSmallOrRound(c.collider) : false;
          this.wallCol = c.collider ?? null;
          this.wallNy = c.normal1.y;
        }
      }
    }

    // support under the capsule CENTRE decides ground vs. fall (the KCC alone keeps "grounded" while the rounded
    // capsule bottom hangs on a ledge corner → feet floating beside the block)
    let support: number | null = null;
    if (this.state !== 'air') {
      const c = { x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z };
      const hit = this.ctx.physics.world.castRay(new R.Ray(c, { x: 0, y: -1, z: 0 }), CENTER_Y + STEP_MAX + 0.05, true,
        R.QueryFilterFlags.EXCLUDE_SENSORS, PLAYER_GROUPS, this.collider);
      if (hit) support = c.y - hit.timeOfImpact;
      if (support === null && this.state === 'ground') {
        // walked off a ledge → fall pose immediately, keep the momentum
        this.airVel.copy(this.hVel);
        this.vy = Math.min(this.vy, 0);
        this.goAir(true);
      }
    }

    if (this.state === 'ground' || this.state === 'jstart') {
      // blocked by a wall: pull the gait down to the speed we actually achieve (feet stay matched)
      const sReq = Math.hypot(desired.x, desired.z) / dt;
      const sAct = this.hVel.length();
      if (sReq > 0.3 && sAct < 0.4 * sReq) {
        // rate-limited (≥ 0.1 s to idle): an instant scale popped the whole pose from run to idle in one frame
        const k = Math.max(sAct / sReq, 1 - dt / 0.1);
        let moving = 0;
        for (let i = 1; i < LW_N; i++) { this.lw[i] *= k; moving += this.lw[i]; }
        this.lw[0] = 1 - moving;
      }
      if (this.physGrounded) {
        this.offGround = 0;
      } else {
        this.offGround += dt;
        if (this.offGround > COYOTE && this.vy < -1 && this.state === 'ground') {
          this.airVel.copy(this.hVel);
          this.goAir(true);
        }
      }
      if (this.physGrounded && this.vy < 0) this.vy = 0;
    } else {
      if (this.vy > 0 && m.y < desired.y * 0.5) {
        // bumped head? only a solid right above the capsule stops the rise (sliding along walls must not)
        const top = { x: this.feet.x, y: this.feet.y + CENTER_Y + HALF + RADIUS - 0.05, z: this.feet.z };
        const hit = this.ctx.physics.world.castRay(new R.Ray(top, { x: 0, y: 1, z: 0 }), 0.2, true, R.QueryFilterFlags.EXCLUDE_SENSORS, groups(0xffff, G_WORLD), this.collider);
        if (hit) this.vy = 0;
      }
      if (this.physGrounded && this.vy <= 0 && this.airTime > 0.05) this.land();
      else if (this.vy < 0 && this.preLand < 0) this.anticipateLanding(G);
    }
    this.setSnap(this.state !== 'air');

    // visual feet height: the ground under the capsule centre while grounded (a step down shows at once instead of
    // the capsule rolling over the corner); one-step jumps (step up/down, snap) are eased by a decaying offset
    const vis = this.state !== 'air' && support !== null ? Math.min(this.feet.y + 0.02, support) : this.feet.y;
    const jump = vis - this.prevVisY;
    if (this.state !== 'air' && this.visGround && Math.abs(jump) > 0.06) {
      this.yOffset -= jump;
      this.prevVisY = vis;
    }
    this.visY = vis;
    this.visGround = this.state !== 'air';

    // advance the locomotion clocks (timeScale 1.0: speed is matched by the controller, never by stretching playback)
    if (this.state === 'air' && this.leap && this.preLand < 0 && !this.leapFrozen) {
      // hold the leap at the pose just before a foot reaches for the ground; it resumes into that touchdown
      const mr = this.mOf(2), cr = this.clips.get('run');
      if (mr && cr) {
        const ph = this.phaseOf(2), lead = PRELAND / cr.duration;
        for (const pp of [mr.plantPhaseL, mr.plantPhaseR]) {
          const fz = (((pp - lead) % 1) + 1) % 1;
          const d = (((ph - fz) % 1) + 1) % 1;
          if (d < 0.04) { this.leapFrozen = true; this.leapFoot = pp; this.setPhase(2, fz); }
        }
      }
    }
    for (const k of LOCO_SLOTS) {
      const c = this.clips.get(k);
      if (k === 'run' && this.state === 'air' && this.leapFrozen && this.preLand < 0) continue;
      if (c) this.locoT[k] = (this.locoT[k] + dt) % c.duration;
    }

    // fell out of the world → back to the surface
    const ground = this.ctx.world.heightAt(this.feet.x, this.feet.z);
    if (this.feet.y < ground - 25) this.place(this.feet.x, ground + 1, this.feet.z);
  }

  /**
   * Falling with a direction held: ~0.1 s before touchdown, start blending from the air pose into the gait so that
   * the gait's left-foot plant coincides with ground contact (the foot reaches for the ground while still airborne —
   * no planted foot, no slip — and the run simply continues on contact).
   */
  private anticipateLanding(G: number): void {
    const moving = this.wish.lengthSq() > 0.01 || this.airVel.length() > 1;
    if (!moving) return;
    const R = this.R;
    // sweep the capsule along the mean velocity of the next PRELAND seconds (catches ledges/crates ahead too)
    const c = { x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z };
    const vyM = this.vy + (G * PRELAND) / 2;
    const hit = this.ctx.physics.world.castShape(c, { x: 0, y: 0, z: 0, w: 1 }, { x: this.airVel.x, y: vyM, z: this.airVel.z },
      new R.Capsule(HALF, RADIUS), 0, PRELAND, false, R.QueryFilterFlags.EXCLUDE_SENSORS, PLAYER_GROUPS, this.collider);
    if (!hit) return;
    if (!(hit.normal1.y > 0.5 || hit.normal2.y > 0.5)) return; // a wall, not something to land on
    const t = hit.time_of_impact;
    if (t < 0.01) return; // still touching the ledge we left
    if (t > PRELAND) return;
    const sp = this.airVel.length();
    const g = this.leap ? 2 : this.wish.lengthSq() > 0.01 ? (isDir(this.keyGait) ? this.keyGait : this.runHeld ? 2 : 1) : sp > (this.vWalk + this.vRun) / 2 ? 2 : 1;
    const m = this.mOf(g), clip = this.clips.get(this.slotOf(g));
    if (!m || !clip) return;
    this.preLand = g;
    this.lw = [0, 0, 0, 0, 0, 0];
    this.lw[lwIdx(g)] = 1;
    this.lwPrev = this.lw.slice();
    const plant = this.leap && this.leapFrozen ? this.leapFoot : m.plantPhaseL;
    this.setPhase(g, plant - t / clip.duration);
    this.groupFade = Math.max(0.04, t);
  }

  private goAir(fall: boolean): void {
    this.preLand = -1;
    this.leap = false;
    this.state = 'air';
    this.airTime = 0;
    if (fall) this.jsTime = 999; // skip Jump_Start, straight to Jump_Idle
    this.landTime = -1;
    this.setSnap(false);
  }

  private snapOn = true;
  private setSnap(on: boolean): void {
    if (on === this.snapOn) return;
    this.snapOn = on;
    if (on) this.kcc.enableSnapToGround(0.35);
    else this.kcc.disableSnapToGround();
  }

  private obstacleCache = new Map<number, boolean>();
  /** Round shapes and obstacles whose horizontal footprint is < ~3 m (cached per collider handle). */
  private isSmallOrRound(col: RAPIER.Collider): boolean {
    const h = col.handle;
    const hit = this.obstacleCache.get(h);
    if (hit !== undefined) return hit;
    let small = false;
    // shapeType() is cheap; `.shape` copies the geometry out of wasm, so only read it for boxes and hulls
    const t = (col as unknown as { shapeType(): number }).shapeType();
    const needShape = t === 1 || t === 12 || t === 9 || t === 16;
    const sh = (needShape ? col.shape : {}) as unknown as { halfExtents?: { x: number; z: number }; vertices?: Float32Array };
    if (t === 0 || t === 2 || t === 10 || t === 11 || t === 14 || t === 15) small = true; // ball/capsule/cylinder/cone
    else if ((t === 1 || t === 12) && sh.halfExtents) small = Math.max(sh.halfExtents.x, sh.halfExtents.z) < 1.5;
    else if ((t === 9 || t === 16) && sh.vertices) {
      const v = sh.vertices;
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (let i = 0; i < v.length; i += 3) { x0 = Math.min(x0, v[i]); x1 = Math.max(x1, v[i]); z0 = Math.min(z0, v[i + 2]); z1 = Math.max(z1, v[i + 2]); }
      small = Math.max(x1 - x0, z1 - z0) < 3;
    }
    if (this.obstacleCache.size > 4000) this.obstacleCache.clear();
    this.obstacleCache.set(h, small);
    return small;
  }

  /** Horizontal centre of a collider (hull vertex mean, else its translation); cached per collider. */
  private colliderCenter(col: RAPIER.Collider): THREE.Vector3 {
    const hit = this.centers.get(col.handle);
    if (hit) return hit;
    const t = col.translation(), q = col.rotation();
    const out = new THREE.Vector3(0, 0, 0);
    const v = (col.shape as unknown as { vertices?: Float32Array }).vertices;
    if (v && v.length >= 3) {
      const n = v.length / 3;
      for (let i = 0; i < n; i++) { out.x += v[3 * i]; out.y += v[3 * i + 1]; out.z += v[3 * i + 2]; }
      out.multiplyScalar(1 / n).applyQuaternion(new THREE.Quaternion(q.x, q.y, q.z, q.w));
    }
    out.add(new THREE.Vector3(t.x, t.y, t.z));
    if (this.centers.size > 512) this.centers.clear();
    this.centers.set(col.handle, out);
    return out;
  }

  /** The capsule cannot move `dist` m along horizontal `dir` from here (steep contact within 2 cm; walkable rises don't count). */
  private sweepBlocked(dir: THREE.Vector3, dist: number): boolean {
    const l = Math.hypot(dir.x, dir.z);
    if (l < 1e-4) return false;
    const R = this.R;
    // lifted by the step-up height so low lips / steps (climbable) are not "blocked"
    const c = { x: this.feet.x, y: this.feet.y + CENTER_Y + STEP_MAX, z: this.feet.z };
    const hit = this.ctx.physics.world.castShape(c, { x: 0, y: 0, z: 0, w: 1 }, { x: dir.x / l, y: 0, z: dir.z / l }, new R.Capsule(HALF, RADIUS), 0, dist, true,
      R.QueryFilterFlags.EXCLUDE_SENSORS, PLAYER_GROUPS, this.collider);
    return !!hit && hit.time_of_impact < dist - 0.02;
  }

  /** Still touching the last wall we were blocked by (ray from the capsule centre against its normal). */
  private touchingWall(): boolean {
    if (this.wallN.lengthSq() === 0) return false;
    const R = this.R;
    const c = { x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z };
    return !!this.ctx.physics.world.castRay(new R.Ray(c, { x: -this.wallN.x, y: 0, z: -this.wallN.z }), RADIUS + 0.15, true,
      R.QueryFilterFlags.EXCLUDE_SENSORS, groups(0xffff, G_WORLD), this.collider);
  }

  /** A big flat wall (same rule as `flatStand`: not small/round, too steep, within 10° of head-on) is ahead within the
   *  current stopping distance, above step-up height. Two horizontal rays (knee and chest height). */
  private wallAhead(): boolean {
    const R = this.R;
    const dir = this.wish.clone().setY(0);
    if (dir.lengthSq() < 1e-6) return false;
    dir.normalize();
    const look = RADIUS + 0.1 + this.hVel.length() * WALL_LOOK;
    let col: RAPIER.Collider | null = null;
    this.wallGap = Infinity;
    for (const hgt of [STEP_MAX + 0.1, 1.2]) {
      const ray = new R.Ray({ x: this.feet.x, y: this.feet.y + hgt, z: this.feet.z }, { x: dir.x, y: 0, z: dir.z });
      const hit = this.ctx.physics.world.castRayAndGetNormal(ray, look, true, R.QueryFilterFlags.EXCLUDE_SENSORS, groups(0xffff, G_WORLD), this.collider);
      if (!hit || Math.abs(hit.normal.y) > COS_CLIMB) return false;
      const n = new THREE.Vector3(hit.normal.x, 0, hit.normal.z).normalize();
      if (Math.sqrt(Math.max(0, 1 - n.dot(dir) ** 2)) >= FLAT_HEADON) return false; // angled: slide along it instead
      if (col && hit.collider !== col) return false;
      col = hit.collider;
      this.wallGap = Math.min(this.wallGap, hit.timeOfImpact - RADIUS);
    }
    return !!col && !this.isSmallOrRound(col);
  }

  /** Try to climb a ledge ≤ STEP_MAX while moving by `rem`. Moves `feet` and returns the rise (0 = no step). */
  private tryStep(rem: THREE.Vector3): number {
    const R = this.R;
    const w = this.ctx.physics.world;
    const shape = new R.Capsule(HALF, RADIUS);
    const rot = { x: 0, y: 0, z: 0, w: 1 };
    const flags = R.QueryFilterFlags.EXCLUDE_SENSORS;
    const c = { x: this.feet.x, y: this.feet.y + CENTER_Y, z: this.feet.z };
    // 1. room above
    const hu = w.castShape(c, rot, { x: 0, y: 1, z: 0 }, shape, 0, STEP_MAX, true, flags, PLAYER_GROUPS, this.collider);
    const h = Math.min(STEP_MAX, hu ? hu.time_of_impact - SKIN : STEP_MAX);
    if (h < 0.08) return 0;
    // 2. room ahead at the raised height (move + a little look-ahead so we don't hang on the lip)
    // advance at least 8 cm so the capsule's rounded bottom gets over the lip (the KCC leaves us SKIN short of it)
    // …but never beyond this step's speed budget (no speed spike when a step is taken at full run)
    const budget = Math.max(0, this.vRunMax * this.ctx.physics.fixedDt - Math.hypot(this.feet.x - this.prevFeet.x, this.feet.z - this.prevFeet.z));
    // (at most 1 cm beyond the requested move: a slow walk rolls up over the lip in a few small steps instead of an 8 cm
    // one-frame burst that skated the planted foot)
    const len = Math.max(rem.length(), Math.min(0.08, budget, rem.length() + 0.01));
    if (len < 0.01) return 0;
    const dir = rem.clone().normalize();
    const ahead = len + 0.05;
    const raised = { x: c.x, y: c.y + h, z: c.z };
    const hf = w.castShape(raised, rot, { x: dir.x, y: 0, z: dir.z }, shape, 0, ahead, true, flags, PLAYER_GROUPS, this.collider);
    if (hf && hf.time_of_impact < ahead) return 0; // still blocked up there → too high (cliff / wall)
    // 3. down onto the step
    const p = { x: raised.x + dir.x * len, y: raised.y, z: raised.z + dir.z * len };
    const hd = w.castShape(p, rot, { x: 0, y: -1, z: 0 }, shape, 0, h + 0.02, true, flags, PLAYER_GROUPS, this.collider);
    if (!hd) return 0;
    const ny = p.y - Math.max(0, hd.time_of_impact - SKIN);
    const rise = ny - c.y;
    if (rise < -0.01) return 0; // tiny rises are fine: that's the capsule rolling over a lip the KCC refused
    // 4. what we land on must be walkable (no stair-stepping up steep rock)
    const ray = new R.Ray({ x: p.x + dir.x * RADIUS, y: ny, z: p.z + dir.z * RADIUS }, { x: 0, y: -1, z: 0 });
    const g = w.castRayAndGetNormal(ray, CENTER_Y + STEP_MAX, true, flags, PLAYER_GROUPS, this.collider);
    if (!g || g.normal.y < COS_CLIMB) return 0;
    this.feet.set(p.x, ny - CENTER_Y, p.z);
    return Math.max(rise, 1e-4);
  }

  private land(): void {
    // keys released in the air: keep the momentum through the landing (land into the gait, then the normal stop)
    const hasWish = this.wish.lengthSq() > 0.01 || this.airVel.length() > 1;
    this.state = 'ground';
    this.vy = 0;
    this.setSnap(true);
    if (this.preLand < 0) this.groupFade = 0.08; // out of the air pose quickly: the gait's planted foot takes over
    const jl = this.measures[this.clips.get('jland')?.name ?? ''];
    const pre = this.preLand;
    this.preLand = -1;
    if (hasWish) {
      // land straight into the gait at a foot touchdown (left toe plant; usually pre-blended in the air already),
      // the landing beat is upper-body only, so the planted foot does not slide
      const g = pre >= 1 ? pre : this.wish.lengthSq() > 0.01 ? (isDir(this.keyGait) ? this.keyGait : this.runHeld ? 2 : 1) : this.airVel.length() > (this.vWalk + this.vRun) / 2 ? 2 : 1;
      if (pre < 1) {
        this.lw = [0, 0, 0, 0, 0, 0];
        this.lw[lwIdx(g)] = 1;
        this.lwPrev = this.lw.slice();
        this.setPhase(g, this.mOf(g)?.plantPhaseL ?? 0);
      } else this.groupFade = Math.min(this.groupFade, 0.04);
      this.gTarget = this.want = g;
      this.wantRaw = this.wish.lengthSq() > 0.01 ? g : 0;
      this.holdT = TAP_TURN; // already moving: no tap/step logic on landing
      this.leap = false;
      this.landTime = -1;
      this.landPeak = 0;
      this.upperT = jl ? Math.max(0, jl.touchdown - 0.03) : 0;
      this.upperPeak = this.airTime < 0.2 ? 0.4 : 0.8;
      // landing dip at speed: pelvis drops, feet held by IK
      this.dipT = 0;
      this.dipD = (this.airTime < 0.2 ? 0.04 : 0.1) * Math.min(1, 0.3 + this.airVel.length() / this.vRun);
    } else {
      // standing landing: full Jump_Land, body stops at touchdown (feet planted, no slide)
      this.lw = [1, 0, 0, 0, 0, 0];
      this.lwPrev = [1, 0, 0, 0, 0, 0];
      this.gTarget = this.want = this.wantRaw = 0;
      this.airVel.set(0, 0, 0);
      this.landTime = jl ? Math.max(0, jl.touchdown - 0.03) : 0;
      this.landPeak = this.airTime < 0.2 ? 0.5 : 1;
    }
  }

  // ------------------------------------------------------------------ render frame
  lateUpdate(dt: number): void {
    if (!this.ready) return;
    const a = this.ctx.physics.alpha;
    this.position.lerpVectors(this.prevFeet, this.feet, a);
    this.yOffset *= Math.exp(-dt * 16);
    if (Math.abs(this.yOffset) < 1e-3) this.yOffset = 0;
    this.position.y = this.prevVisY + (this.visY - this.prevVisY) * a + this.yOffset;
    this.heading = this.prevHeading + wrapPi(this.physHeading - this.prevHeading) * a;
    this.yaw = this.controls === 'canon' ? this.ctlYawPrev + wrapPi(this.ctlYaw - this.ctlYawPrev) * a : this.heading;
    this.velocity.set(this.hVel.x, this.state === 'air' ? this.vy : 0, this.hVel.z);
    this.grounded = this.state !== 'air';

    this.root.position.set(this.position.x, this.position.y - SKIN * 0, this.position.z);
    this.root.rotation.set(0, this.heading, 0);

    this.animate(dt);
    this.feetIK(dt);

    const gait = this.state === 'air' ? (this.vy > 0 ? 'jump' : 'fall') : this.state === 'jstart' ? 'jump'
      : this.landTime >= 0 && this.landPeak > 0.7 ? 'land' : this.gTarget === STEP && this.lw[1] > 0.2 ? 'step' : ['idle', 'walk', 'run', 'back', 'strafeL', 'strafeR'][this.lw.indexOf(Math.max(...this.lw))];
    if (gait !== this.gait) {
      this.gait = gait;
      this.ctx.events.emit('player:gait', { gait });
    }
    this.ctx.events.emit('player:moved', { pos: this.position, vel: this.velocity, grounded: this.grounded });
    this.probeFeet(dt);
  }

  private animate(dt: number): void {
    const clip = (s: Slot) => this.clips.get(s);
    // group targets
    let tLoco = 1, tStart = 0, tAir = 0;
    const js = clip('jstart');
    if (this.state === 'jstart') { tLoco = 0; tStart = 1; }
    else if (this.state === 'air') {
      const startLeft = js ? js.duration - this.jsTime : 0;
      if (this.preLand >= 0) { tLoco = 1; }
      else if (startLeft > 0.1) { tLoco = 0; tStart = 1; } else { tLoco = 0; tAir = 1; }
    }
    const g = this.group;
    const rate = dt / (this.state === 'jstart' || (this.leap && this.state === 'air' && this.airTime < 0.1) ? 0.05 : this.state === 'ground' || this.preLand >= 0 ? this.groupFade : 0.12);
    if (this.state === 'ground' && g.loco > 0.999) this.groupFade = 0.15;
    g.loco += THREE.MathUtils.clamp(tLoco - g.loco, -rate, rate);
    g.jstart += THREE.MathUtils.clamp(tStart - g.jstart, -rate, rate);
    g.jair += THREE.MathUtils.clamp(tAir - g.jair, -rate, rate);

    // landing overlay
    let land = 0;
    const jl = clip('jland');
    if (this.landTime >= 0 && jl) {
      // run plant-stop: the squat starts once the body has come to rest over the planted foot
      const hold = this.landIsStop && this.lw[0] < 0.97;
      if (!hold) { this.landT += dt; this.landTime += dt; }
      const remain = jl.duration - this.landTime;
      const fadeIn = this.landIsStop ? Math.min(1, this.landT / 0.08) : Math.min(1, this.landTime / 0.06 + 0.5);
      const fadeOut = this.landPeak > 0.7 ? Math.min(1, remain / 0.2) : Math.max(0, 1 - this.landTime / 0.3);
      land = this.landPeak * Math.max(0, Math.min(fadeIn, fadeOut));
      if (remain <= 0 || (land <= 0.001 && !hold && this.landT > 0.05)) { this.landTime = -1; land = 0; this.landIsStop = false; }
      if (this.state !== 'ground' || (this.landIsStop && this.wish.lengthSq() > 0.01 && this.gTarget !== 0)) { this.landTime = -1; land = 0; this.landIsStop = false; }
    }

    // locomotion clocks: interpolate the fixed-step clocks with the same alpha as the body position
    const a = this.ctx.physics.alpha;
    for (const k of LOCO_SLOTS) {
      const c = clip(k);
      if (!c) continue;
      let t1 = this.locoT[k];
      const t0 = this.locoTPrev[k];
      if (t1 < t0) t1 += c.duration;
      this.times[k] = (t0 + (t1 - t0) * a) % c.duration;
    }
    const jair = clip('jair');
    if (jair) this.times.jair = (this.times.jair + dt) % jair.duration;
    const W = this.weights;
    const wi = this.lwPrev[0] + (this.lw[0] - this.lwPrev[0]) * a;
    const ww = this.lwPrev[1] + (this.lw[1] - this.lwPrev[1]) * a;
    const wr = this.lwPrev[2] + (this.lw[2] - this.lwPrev[2]) * a;
    const wd = [3, 4, 5].map((i) => this.lwPrev[i] + (this.lw[i] - this.lwPrev[i]) * a);
    if (js) {
      // Jump_Start's clock advances in the fixed step like the body: interpolate it with the same alpha, otherwise at
      // 60 fps the take-off extension/tuck holds a frame and then jumps two steps out of sync with the rising body
      // (a jump into a new phase — reset to 0 / lift-off / skip — is taken as is)
      const j0 = this.jsTimePrev, j1 = this.jsTime;
      const jt = j1 >= j0 && j1 - j0 < 0.05 ? j0 + (j1 - j0) * a : j1;
      this.times.jstart = Math.min(Math.max(0, jt), js.duration - 1e-3);
    }
    if (jl) this.times.jland = this.landTime >= 0 ? Math.min(this.landTime, jl.duration - 1e-3) : 0;
    if (this.state === 'jstart' || (this.state === 'air' && g.jair < 0.01)) this.times.jair = 0;

    const loco = g.loco * (1 - land);
    W.idle = loco * wi;
    W.walk = loco * ww;
    W.run = loco * wr;
    W.back = loco * wd[0];
    W.strafeL = loco * wd[1];
    W.strafeR = loco * wd[2];
    W.jstart = g.jstart * (1 - land);
    W.jair = g.jair * (1 - land);
    W.jland = land;
    let sum = 0;
    for (const s of SLOTS) sum += W[s];
    if (sum < 1e-4) { W.idle = 1; sum = 1; }
    for (const s of SLOTS) W[s] /= sum;
    // procedural bone edits of the last frame (air lean, landing beat, leg IK) are relative to the bone's current
    // rotation; three's mixer only rewrites a bone whose mixed value CHANGED, so with a held clip pose (Jump_Start's
    // end during a running jump) the edits stacked frame after frame (the spine pitched further and further forward,
    // then snapped upright when the apex crossfade changed the values — the "double motion" at the apex).
    // Restore every edited bone to its mixer value first, so each frame's edits start from the clip pose.
    for (const [b, q] of this.procBase) b.quaternion.copy(q);
    this.procBase.clear();
    this.applier?.apply(this.times, W);
    this.upperBeat(dt);
  }

  /**
   * Visual foot placement (after the mixer pose): two-bone leg IK for
   *  - foot locks while standing / stopping: each ankle stays where it was put down; when the animated foot (which
   *    turns/moves with the body) drifts > LOCK_STEP away, the foot takes a quick lifted step to it — turning on the
   *    spot is stepping, not a turntable, and the run plant-stop keeps the planted foot fixed while the body brakes;
   *  - landing dip at speed (pelvis drops, feet stay on their animated targets);
   *  - slopes: planted feet follow the ground under them, the pelvis drops for the lower foot.
   */
  private feetIK(dt: number): void {
    const legs = this.legs;
    const model = this.model;
    if (!legs || !model) return;
    // air lean (forward when moving fast), about the hips
    const hs = Math.hypot(this.velocity.x, this.velocity.z);
    const leanT = this.state === 'air' && hs > 1 ? AIR_LEAN * Math.min(1, hs / this.vRun) : 0;
    this.lean += (leanT - this.lean) * (1 - Math.exp(-dt * 10));
    if (Math.abs(this.lean) > 1e-3) {
      // upper body only (spine), so the legs/feet are untouched when it eases out after touchdown
      const spine = model.getObjectByName('spine');
      if (spine) {
        this.touch(spine);
        const axis = new THREE.Vector3(Math.cos(this.heading), 0, -Math.sin(this.heading));
        const pq = spine.parent!.getWorldQuaternion(new THREE.Quaternion());
        const q = new THREE.Quaternion().setFromAxisAngle(axis, this.lean);
        spine.quaternion.premultiply(pq).premultiply(q).premultiply(pq.clone().invert());
        spine.updateMatrixWorld(true);
      }
    }
    if (this.state === 'air') {
      this.lockW = 0;
      for (const k of FEET) this.locks[k].valid = false;
      return;
    }
    this.root.updateMatrixWorld(true);
    const A = { l: legs.l.foot.getWorldPosition(new THREE.Vector3()), r: legs.r.foot.getWorldPosition(new THREE.Vector3()) };
    const AQ = { l: legs.l.foot.getWorldQuaternion(new THREE.Quaternion()), r: legs.r.foot.getWorldQuaternion(new THREE.Quaternion()) };
    const TQ = { l: AQ.l.clone(), r: AQ.r.clone() };
    const lockMode = (this.gTarget === 0 && this.lw[0] > 0.5) || this.stopLock;
    if (this.stopLock && this.lockW < 1) this.lockW = 1; // the plant-stop locks the planted foot at once
    this.lockW += THREE.MathUtils.clamp((lockMode ? 1 : 0) - this.lockW, -dt * 6, dt * 15);
    const T = { l: A.l.clone(), r: A.r.clone() };
    for (const k of FEET) {
      const L = this.locks[k], o = this.locks[k === 'l' ? 'r' : 'l'];
      if (this.lockW < 0.01) { L.valid = false; L.stepping = false; continue; }
      if (!L.valid) { L.pos.copy(A[k]); L.q.copy(AQ[k]); L.valid = true; L.stepping = false; }
      const d = Math.hypot(A[k].x - L.pos.x, A[k].z - L.pos.z);
      const otherBusy = o.stepping && o.t < LOCK_STEP_T * 0.6;
      // a locked foot keeps its yaw too (no toe swinging round the ankle while the body turns)
      const dq = L.q.angleTo(AQ[k]);
      if (!L.stepping && (d > LOCK_STEP || dq > LOCK_YAW) && !otherBusy) { L.stepping = true; L.t = 0; L.from.copy(L.pos); L.qFrom.copy(L.q); }
      let lift = 0;
      if (L.stepping) {
        L.t += dt;
        const u = Math.min(1, L.t / LOCK_STEP_T);
        const e = u * u * (3 - 2 * u);
        L.pos.set(L.from.x + (A[k].x - L.from.x) * e, 0, L.from.z + (A[k].z - L.from.z) * e);
        lift = Math.sin(Math.PI * u) * LOCK_LIFT;
        L.q.slerpQuaternions(L.qFrom, AQ[k], e);
        if (u >= 1) { L.stepping = false; L.pos.copy(A[k]); L.q.copy(AQ[k]); }
      }
      T[k].set(A[k].x + (L.pos.x - A[k].x) * this.lockW, A[k].y + lift * this.lockW, A[k].z + (L.pos.z - A[k].z) * this.lockW);
      TQ[k].slerpQuaternions(AQ[k], L.q, this.lockW);
    }
    // ground under each foot (slopes) and pelvis drop
    let drop = 0;
    if (this.physGrounded && this.state === 'ground') {
      const R = this.R;
      const w = this.ctx.physics.world;
      const base = this.position.y;
      for (const k of FEET) {
        const hit = w.castRay(new R.Ray({ x: T[k].x, y: base + 0.6, z: T[k].z }, { x: 0, y: -1, z: 0 }), 1.2, true,
          R.QueryFilterFlags.EXCLUDE_SENSORS, PLAYER_GROUPS, this.collider);
        if (!hit) continue;
        const off = THREE.MathUtils.clamp(base + 0.6 - hit.timeOfImpact - base, -0.2, 0.2);
        if (Math.abs(off) < 0.01) continue;
        T[k].y += off;
        drop = Math.min(drop, off);
      }
    }
    // landing dip at speed
    if (this.dipT >= 0) {
      this.dipT += dt;
      const u = this.dipT / DIP_T;
      if (u >= 1) this.dipT = -1;
      else drop -= this.dipD * Math.sin(Math.PI * Math.min(1, u)) ;
    }
    const need = this.lockW > 0.01 || drop < -0.005 || T.l.distanceToSquared(A.l) > 1e-6 || T.r.distanceToSquared(A.r) > 1e-6;
    if (!need) return;
    if (drop < 0) {
      this.root.position.y += drop;
      this.root.updateMatrixWorld(true);
    }
    for (const lg of [legs.l, legs.r]) for (const b of [lg.upper, lg.lower, lg.foot]) this.touch(b);
    solveLeg(legs.l, T.l, TQ.l);
    solveLeg(legs.r, T.r, TQ.r);
  }

  /** Landing into a gait: blend the upper body toward Jump_Land for a short beat (legs untouched → no slip). */
  private upperBeat(dt: number): void {
    if (this.upperPeak <= 0 || !this.model) return;
    const jl = this.clips.get('jland');
    if (!jl || this.state !== 'ground') { this.upperPeak = 0; return; }
    this.upperT += dt;
    const w = this.upperPeak * Math.max(0, 1 - this.upperT / 0.3);
    if (w <= 0.001) { this.upperPeak = 0; return; }
    if (!this.upperTracks.length) {
      for (const t of jl.tracks) {
        const p = THREE.PropertyBinding.parseTrackName(t.name);
        if (p.propertyName === 'quaternion' && UPPER.includes(p.nodeName)) this.upperTracks.push({ bone: p.nodeName, interp: (t as THREE.KeyframeTrack & { createInterpolant(): THREE.Interpolant }).createInterpolant() });
      }
    }
    const t = Math.min(this.upperT, jl.duration - 1e-3);
    const q = new THREE.Quaternion();
    for (const u of this.upperTracks) {
      const b = this.model.getObjectByName(u.bone);
      if (!b) continue;
      const v = u.interp.evaluate(t);
      q.set(v[0], v[1], v[2], v[3]);
      this.touch(b);
      b.quaternion.slerp(q, w);
    }
  }

  /**
   * footSlip: horizontal world speed of the planted toe (lowest toe, < 3.5 cm above the ground and vertically still, same foot on
   * consecutive frames), averaged over the last ~0.2 s. Feet in the air (run flight phase, jumps) are not counted.
   */
  private probeFeet(dt: number): void {
    if (this.toes.length < 2 || dt <= 0) return;
    this.root.updateMatrixWorld(true);
    const p0 = this.toes[0].getWorldPosition(new THREE.Vector3());
    const p1 = this.toes[1].getWorldPosition(new THREE.Vector3());
    const i = p0.y <= p1.y ? 0 : 1;
    const p = i === 0 ? p0 : p1;
    this.footY = p.y - this.position.y;
    // planted = low AND not moving vertically (a swing toe skimming the ground at a low frame rate is not planted)
    const vyToe = i === this.lastFoot && dt > 0 ? Math.abs(p.y - this.lastFootPos.y) / dt : 0;
    // …and not moving forward relative to the body: that is a swing toe passing low (Running_B's swing toe dips to
    // 3.2 cm at phase 0.27-0.28 while the stance toe has just lifted; same rule as plantedMotion)
    let swing = false;
    if (i === this.lastFoot && dt > 0) {
      // travel direction of the body (backwards / strafe: not the heading); standing: heading
      const bx = this.position.x - this.lastBodyPos.x, bz = this.position.z - this.lastBodyPos.z, bl = Math.hypot(bx, bz);
      const moving = bl / dt > 0.3;
      const fx = moving ? bx / bl : Math.sin(this.heading), fz = moving ? bz / bl : Math.cos(this.heading);
      const rel = ((p.x - this.lastFootPos.x) - (this.position.x - this.lastBodyPos.x)) * fx + ((p.z - this.lastFootPos.z) - (this.position.z - this.lastBodyPos.z)) * fz;
      swing = rel / dt > 0.3;
    }
    const planted = this.state !== 'air' && this.footY < 0.035 && vyToe < 0.3 && !swing;
    if (i === this.lastFoot && planted && this.lastPlanted) {
      const d = Math.hypot(p.x - this.lastFootPos.x, p.z - this.lastFootPos.z);
      this.slipWin.push({ d, dt, t: this.ctx.time });
      if (this.slipTrace) this.slipTrace.push([+this.ctx.time.toFixed(3), +(d / dt).toFixed(3), i, +this.footY.toFixed(3), ...this.lw.map((x) => +x.toFixed(2)), +(this.times.run / (this.clips.get('run')?.duration ?? 1)).toFixed(3), this.gTarget, +this.heading.toFixed(2)]);
      const st = (this.slipStats[this.slipKey()] ??= { d: 0, t: 0, max: 0 });
      st.d += d;
      st.t += dt;
    }
    this.lastPlanted = planted;
    this.lastFoot = i;
    this.lastFootPos.copy(p);
    this.lastBodyPos.copy(this.position);
    while (this.slipWin.length && this.slipWin[0].t < this.ctx.time - 0.2) this.slipWin.shift();
    let T = 0, D = 0;
    for (const w of this.slipWin) { T += w.dt; D += w.d; }
    this.footSlip = T > 0.03 ? D / T : 0;
    const st = this.slipStats[this.slipKey()];
    if (st && T > 0.03) st.max = Math.max(st.max, this.footSlip);
  }

  /** Slip bucket: steady gait ('walk', 'run', 'idle') or a transition ('walk~', …: blending / landing / turning). */
  private slipKey(): string {
    const steady = this.state === 'ground' && this.landTime < 0 && Math.max(...this.lw) > 0.999 && Math.abs(wrapPi(this.physHeading - this.prevHeading)) < 1e-3;
    return this.gait + (steady ? '' : '~');
  }

  debugState(): object {
    const r = (x: number, n = 3) => +x.toFixed(n);
    const dom = (Object.entries(this.weights) as [Slot, number][]).sort((a, b) => b[1] - a[1])[0];
    return {
      pos: [r(this.position.x), r(this.position.y), r(this.position.z)],
      vel: [r(this.velocity.x), r(this.velocity.y), r(this.velocity.z)],
      speed: r(Math.hypot(this.hVel.x, this.hVel.z)),
      grounded: this.grounded,
      gait: this.gait,
      clip: this.clips.get(dom[0])?.name ?? dom[0],
      timeScale: 1, // loop clips always play at their natural rate (gait chosen from speed instead)
      character: this.character,
      footSlip: r(this.footSlip),
      footY: r(this.footY),
      slip: Object.fromEntries(Object.entries(this.slipStats).map(([k, v]) => [k, [r(v.t > 0 ? v.d / v.t : 0), r(v.max)]])),
      state: this.state,
      lw: this.lw.map((x) => r(x, 2)),
      heading: r(this.heading, 2),
      yaw: r(this.yaw, 2),
      controls: this.controls,
      keyGait: this.keyGait,
      w: Object.fromEntries(Object.entries(this.weights).filter(([, v]) => v > 0.01).map(([k, v]) => [k, r(v, 2)])),
      gaitSpeeds: { walk: r(this.vWalk), run: r(this.vRun) },
      entry: [r(this.entryWalk), r(this.entryRun)],
      spikes: this.speedSpikes,
      stallFix: this.stallCount,
      blockedIdle: this.blockedIdle,
      wallStops: this.wallStops,
      startBlocks: this.startBlocks,
      throttled: this.throttled,
      throttles: this.throttles,
      slideDevDeg: Math.round((this.slideDev * 180) / Math.PI),
      initMs: this.initMs,
      gaitReq: [this.wantRaw, this.want, this.gTarget, r(this.turnGoal, 2), r(this.wish.x, 2), r(this.wish.z, 2)],
    };
  }
}

/** KayKit clips are in place; drop any root translation anyway so the capsule alone moves the character. */
function stripRootMotion(c: THREE.AnimationClip): THREE.AnimationClip {
  const tracks = c.tracks.filter((t) => !/^root\.position$/.test(t.name));
  return tracks.length === c.tracks.length ? c : new THREE.AnimationClip(c.name, c.duration, tracks);
}

export { WORLD_GROUPS };
