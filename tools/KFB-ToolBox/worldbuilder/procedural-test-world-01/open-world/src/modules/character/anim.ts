// Clip loading, foot-contact measurement and a stateless pose applier.
// The measurement samples the real skeleton at CHAR_SCALE: feet bones' world positions over the clip,
// stance = foot low, ground speed = median horizontal speed of the planted foot during stance.
import * as THREE from 'three';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';

/** Logical clip slots used by the locomotion state machine. */
export const SLOTS = ['idle', 'walk', 'run', 'jstart', 'jair', 'jland', 'back', 'strafeL', 'strafeR'] as const;
export type Slot = (typeof SLOTS)[number];

export interface ClipMeasure {
  name: string;
  duration: number;
  /** Ground speed implied by the planted foot, m/s at CHAR_SCALE (median over stance samples of both feet). */
  speed: number;
  /** Cross-check: median instantaneous toe speed over interior stance samples. */
  speedMedian: number;
  /** Max distance (m) a planted toe wanders on the ground during one stance at `speed` (0 = perfectly planted). */
  drift: number;
  /** Per-phase ground speed (N samples over one cycle) recovered from the planted toe; loops only. */
  curve: Float32Array | null;
  /** Mean of `curve` = natural ground speed of the clip (m/s). */
  curveMean: number;
  /** Left/right toe positions (model space xz, metres) per sample, and whether each is planted. */
  toes: { l: [number, number][]; r: [number, number][]; yl: number[]; yr: number[]; stL: boolean[]; stR: boolean[] } | null;
  /** Same, per foot, and with the ankle bone instead of the toes (sanity check). */
  speedL: number;
  speedR: number;
  speedAnkle: number;
  /** Fraction of the cycle a foot is planted. */
  stanceFrac: number;
  /** Normalised phase at which the left foot plants. */
  plantPhaseL: number;
  /** Normalised phase at which the right foot plants. */
  plantPhaseR: number;
  /** Mean direction (xz, model space) the planted foot travels; −forward for a forward gait. */
  axis: [number, number];
  /** Fraction of the clip's tracks that bound to a node of the character (0 → T-pose). */
  bound: number;
  /** Time at which both feet first leave the ground (jump clips), or −1. */
  liftoff: number;
  /** First time at which a foot is back on the ground after being in the air (land clips), or −1. */
  touchdown: number;
  /** Lowest toe height over the clip (m, model space at scale). */
  minFootY: number;
  /** Time of the lowest hips (deepest crouch), non-loop clips. */
  crouchT: number;
  /** Hips height at t=0 / t=end (m). */
  hips0: number;
  hips1: number;
}

const _v = new THREE.Vector3();
/** Raw samples of the last measureClip() call (debug: window.__kfbCharacter.dump()). */
export let lastSamples: { dt: number; P: Record<string, THREE.Vector3[]> } | null = null;

function bone(root: THREE.Object3D, name: string): THREE.Object3D | null {
  return root.getObjectByName(name) ?? root.getObjectByName(name.replace('.', '')) ?? null;
}

export function boundFraction(root: THREE.Object3D, clip: THREE.AnimationClip): number {
  let ok = 0;
  for (const t of clip.tracks) {
    const p = THREE.PropertyBinding.parseTrackName(t.name);
    if (THREE.PropertyBinding.findNode(root, p.nodeName)) ok++;
  }
  return clip.tracks.length ? ok / clip.tracks.length : 0;
}

function median(a: number[]): number {
  if (!a.length) return 0;
  const s = a.slice().sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length & 1 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * Sample a clip on a private clone of the character at `scale`.
 * Model space: the character faces +Z (KayKit convention, verified by `axis`).
 */
export function measureClip(template: THREE.Object3D, clip: THREE.AnimationClip, scale: number, loop: boolean, N = 128): ClipMeasure {
  const wrap = new THREE.Group();
  wrap.scale.setScalar(scale);
  const model = skClone(template);
  wrap.add(model);
  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(clip);
  action.play();
  const names = { tl: 'toesl', tr: 'toesr', fl: 'footl', fr: 'footr', hips: 'hips' };
  const b = Object.fromEntries(Object.entries(names).map(([k, n]) => [k, bone(model, n)])) as Record<keyof typeof names, THREE.Object3D | null>;
  const res: ClipMeasure = {
    name: clip.name, duration: clip.duration, speed: 0, speedMedian: 0, drift: 0, curve: null, curveMean: 0, toes: null, speedL: 0, speedR: 0, speedAnkle: 0, stanceFrac: 0, plantPhaseL: 0, plantPhaseR: 0,
    axis: [0, 0], bound: boundFraction(model, clip), crouchT: 0, liftoff: -1, touchdown: -1, minFootY: 0, hips0: 0, hips1: 0,
  };
  if (!b.tl || !b.tr || !b.fl || !b.fr || !b.hips) return res;
  const dt = clip.duration / N;
  const P: Record<string, THREE.Vector3[]> = { tl: [], tr: [], fl: [], fr: [], hips: [] };
  for (let i = 0; i <= N; i++) {
    // last sample of a loop == first; avoid wrapping to 0 by sampling just before the end
    const t = Math.min(i * dt, clip.duration - 1e-4);
    mixer.setTime(t);
    wrap.updateMatrixWorld(true);
    for (const k of Object.keys(P)) P[k].push(b[k as keyof typeof b]!.getWorldPosition(new THREE.Vector3()));
  }
  mixer.stopAllAction();
  mixer.uncacheRoot(model);
  lastSamples = { dt, P };
  res.hips0 = P.hips[0].y;
  res.hips1 = P.hips[N].y;

  const minY = (arr: THREE.Vector3[]) => Math.min(...arr.map((p) => p.y));
  const maxY = (arr: THREE.Vector3[]) => Math.max(...arr.map((p) => p.y));
  res.minFootY = Math.min(minY(P.tl), minY(P.tr));

  const stanceOf = (arr: THREE.Vector3[]) => {
    const lo = minY(arr), hi = maxY(arr);
    const thr = lo + THREE.MathUtils.clamp(0.25 * (hi - lo), 0.008, 0.035);
    const st = arr.map((p) => p.y <= thr);
    if (!loop) return st;
    // drop brief dips (a low swing grazing the threshold for 1–2 samples is not a foot plant)
    const n = N;
    const out = st.slice();
    for (let i = 0; i < n; i++) {
      if (!st[i] || st[(i - 1 + n) % n]) continue; // run start
      let len = 0;
      while (len < n && st[(i + len) % n]) len++;
      if (len < 4) for (let k = 0; k < len; k++) out[(i + k) % n] = false;
    }
    out[n] = out[0];
    return out;
  };
  const velAt = (arr: THREE.Vector3[], i: number) => {
    // central difference; loops wrap (index N == index 0)
    const n = N;
    const a = loop ? arr[(i - 1 + n) % n] : arr[Math.max(0, i - 1)];
    const c = loop ? arr[(i + 1) % n] : arr[Math.min(n, i + 1)];
    const span = loop ? 2 * dt : (Math.min(n, i + 1) - Math.max(0, i - 1)) * dt;
    return _v.set((c.x - a.x) / span, 0, (c.z - a.z) / span).clone();
  };

  if (loop) {
    const speeds: number[] = [];
    const per: Record<string, number[]> = { tl: [], tr: [], fl: [], fr: [] };
    let ax = 0, az = 0, stanceN = 0;
    for (const k of ['tl', 'tr', 'fl', 'fr']) {
      const st = stanceOf(P[k]);
      for (let i = 0; i < N; i++) {
        if (!st[i]) continue;
        // only interior stance samples (neighbours planted too) → no heel-strike/toe-off transients
        if (!st[(i - 1 + N) % N] || !st[(i + 1) % N]) continue;
        const v = velAt(P[k], i);
        const s = v.length();
        per[k].push(s);
        if (k === 'tl' || k === 'tr') {
          speeds.push(s);
          if (s > 1e-4) { ax += v.x / s; az += v.z / s; }
          stanceN++;
        }
      }
    }
    // primary: distance the planted toe travels while planted / time planted (both feet, all stance windows)
    let dist = 0, time = 0;
    for (const k of ['tl', 'tr']) {
      const st = stanceOf(P[k]);
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        if (!st[i] || !st[j]) continue;
        dist += Math.hypot(P[k][j].x - P[k][i].x, P[k][j].z - P[k][i].z);
        time += dt;
      }
    }
    res.speed = time > 0 ? dist / time : 0;
    // residual: how far a planted toe wanders on the ground (world) when the body moves at exactly res.speed
    let drift = 0;
    for (const k of ['tl', 'tr']) {
      const st = stanceOf(P[k]);
      let i0 = 0;
      while (i0 < N && st[i0]) i0++; // start scanning at a swing sample so windows don't wrap mid-way
      let lo = Infinity, hi = -Infinity, run = 0;
      for (let n = 1; n <= N; n++) {
        const i = (i0 + n) % N;
        if (st[i]) {
          // world position along the travel axis = local projection + body travel
          const w = P[k][i].z + res.speed * n * dt; // model forward = +Z (verified: axis ≈ [0, −1])
          lo = Math.min(lo, w); hi = Math.max(hi, w); run++;
        } else if (run) {
          if (run >= 3) drift = Math.max(drift, hi - lo);
          lo = Infinity; hi = -Infinity; run = 0;
        }
      }
      if (run >= 3) drift = Math.max(drift, hi - lo);
    }
    res.drift = drift;

    // root-motion curve recovered from foot contact: ground speed per phase = backward speed of the planted toe
    // (lower toe if both are down). Flight gaps use the stride speed. Moving the body along this
    // curve keeps a planted toe exactly still; its mean is the clip's natural speed.
    const stl = stanceOf(P.tl), str = stanceOf(P.tr);
    const curve = new Array<number>(N).fill(NaN);
    for (let i = 0; i < N; i++) {
      let k: 'tl' | 'tr' | null = null;
      if (stl[i] && str[i]) k = P.tl[i].y <= P.tr[i].y ? 'tl' : 'tr';
      else if (stl[i]) k = 'tl';
      else if (str[i]) k = 'tr';
      if (k) curve[i] = Math.max(0, -velAt(P[k], i).z);
    }
    // flight (no toe down, running): the body is ballistic and the clip does not define the distance; keep the
    // stance (stride) speed so take-off and touch-down speeds match
    for (let i = 0; i < N; i++) if (Number.isNaN(curve[i])) curve[i] = res.speed;
    res.curve = Float32Array.from(curve);
    res.toes = {
      l: P.tl.slice(0, N).map((v) => [v.x, v.z] as [number, number]),
      r: P.tr.slice(0, N).map((v) => [v.x, v.z] as [number, number]),
      yl: P.tl.slice(0, N).map((v) => v.y),
      yr: P.tr.slice(0, N).map((v) => v.y),
      stL: stl.slice(0, N),
      stR: str.slice(0, N),
    };
    res.curveMean = curve.reduce((x, y) => x + y, 0) / N;
    res.speedMedian = median(speeds);
    res.speedL = median(per.tl);
    res.speedR = median(per.tr);
    res.speedAnkle = median([...per.fl, ...per.fr]);
    const an = Math.hypot(ax, az) || 1;
    res.axis = [ax / an, az / an];
    res.stanceFrac = stanceN / (2 * N);
    const stL = stanceOf(P.tl);
    const stR = stanceOf(P.tr);
    for (let i = 0; i < N; i++) if (stL[i] && !stL[(i - 1 + N) % N]) { res.plantPhaseL = i / N; break; }
    for (let i = 0; i < N; i++) if (stR[i] && !stR[(i - 1 + N) % N]) { res.plantPhaseR = i / N; break; }
  } else {
    let hmin = Infinity;
    for (let i = 0; i <= N; i++) if (P.hips[i].y < hmin) { hmin = P.hips[i].y; res.crouchT = i * dt; }
    // jump clips: liftoff = first sample where both toes are > 6 cm above the clip's ground (its first frame's lowest toe)
    const ground = Math.min(P.tl[0].y, P.tr[0].y);
    for (let i = 0; i <= N; i++) {
      const low = Math.min(P.tl[i].y, P.tr[i].y);
      if (res.liftoff < 0 && low > ground + 0.06) res.liftoff = i * dt;
    }
    // touchdown relative to the clip's final standing pose
    const endGround = Math.min(P.tl[N].y, P.tr[N].y);
    let wasAir = false;
    for (let i = 0; i <= N; i++) {
      const low = Math.min(P.tl[i].y, P.tr[i].y);
      if (low > endGround + 0.04) wasAir = true;
      else if (wasAir) {
        res.touchdown = i * dt;
        break;
      }
    }
    if (res.touchdown < 0) res.touchdown = 0;
  }
  return res;
}

/**
 * Applies a pose (per-slot times + weights) to one character model. Times are owned by the caller, so switching
 * characters just means applying the same state to a new Applier (exact pose continuity).
 */
export class PoseApplier {
  readonly mixer: THREE.AnimationMixer;
  readonly actions = new Map<Slot, THREE.AnimationAction>();

  constructor(readonly model: THREE.Object3D, clips: Map<Slot, THREE.AnimationClip>) {
    this.mixer = new THREE.AnimationMixer(model);
    for (const [slot, clip] of clips) {
      const a = this.mixer.clipAction(clip);
      a.setLoop(THREE.LoopRepeat, Infinity);
      a.enabled = true;
      a.setEffectiveWeight(0);
      a.play();
      this.actions.set(slot, a);
    }
  }

  apply(times: Record<Slot, number>, weights: Record<Slot, number>): void {
    for (const [slot, a] of this.actions) {
      a.time = times[slot];
      a.setEffectiveWeight(weights[slot]);
    }
    this.mixer.update(0);
  }

  dispose(): void {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.model);
  }
}

// ---------------------------------------------------------------- precomputed measurements (boot speed)
/** JSON-able form of a ClipMeasure (numbers rounded to 0.1 mm / 1e-4). */
export type PackedMeasure = Record<string, unknown>;

const r4 = (x: number) => Math.round(x * 1e4) / 1e4;

export function packMeasure(m: ClipMeasure): PackedMeasure {
  const o: PackedMeasure = {};
  for (const [k, v] of Object.entries(m)) {
    if (k === 'curve') o.curve = v ? Array.from(v as Float32Array, r4) : null;
    else if (k === 'toes') {
      const t = v as ClipMeasure['toes'];
      o.toes = t
        ? {
            l: t.l.map((p) => p.map(r4)), r: t.r.map((p) => p.map(r4)), yl: t.yl.map(r4), yr: t.yr.map(r4),
            stL: t.stL.map((b) => (b ? 1 : 0)).join(''), stR: t.stR.map((b) => (b ? 1 : 0)).join(''),
          }
        : null;
    } else if (typeof v === 'number') o[k] = r4(v);
    else o[k] = v;
  }
  return o;
}

export function unpackMeasure(o: PackedMeasure): ClipMeasure {
  const m = { ...o } as unknown as ClipMeasure;
  m.curve = o.curve ? Float32Array.from(o.curve as number[]) : null;
  const t = o.toes as { l: [number, number][]; r: [number, number][]; yl: number[]; yr: number[]; stL: string; stR: string } | null;
  m.toes = t
    ? { l: t.l, r: t.r, yl: t.yl, yr: t.yr, stL: [...t.stL].map((c) => c === '1'), stR: [...t.stR].map((c) => c === '1') }
    : null;
  return m;
}
