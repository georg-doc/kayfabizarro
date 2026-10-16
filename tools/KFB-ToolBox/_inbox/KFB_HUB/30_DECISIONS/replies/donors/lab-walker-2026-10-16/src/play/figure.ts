// Figur + Laeufer (B0, Steuerung 11.10.): ONE gait scheme only. This module builds the player figure (Resident Atlas build, clay +
// eyes), the walker (template walk controller, vendored) and the locomotion profile set measured on the figure's own rig, plus
// the ground (island field or a stage surface). It has NO gait / jump / key logic any more: every path (stage ?play=game and
// hub ?play=travel) runs the J17 travel core (src/play/travel.ts → vendor/travel-core.j17.js), which owns gaits, jumps and clips.
// The old Stufe-2 walk adapter (W = Walking_A, its own jump roles) is retired: docs/retired/walk.ts.retired (not importable).
// Units: figures stay K2 (1 H = 3.64 lab, never rescaled); the template's metres convert by the figure (1.85 m ≙ 1 H).
import * as THREE from 'three';
// @ts-ignore – vendored template, plain JS
import { createWalkController } from './vendor/walk-controller.js';
// @ts-ignore – vendored template, plain JS
import { measureClip, buildProfileSet } from './vendor/locomotion-profiles.v1.js';
import { FIG_SCALE } from '../residents/resident';
import { buildPlayable, loadFigureCatalog, type PlayableFigure, type FigureEntry } from '../residents/figure-b2';
import type { App } from '../main';
import type { SurfaceHit } from './surface';

/** template metres → lab units for the walker (figure scale: ActionFigure 1.85 m = 1 H = 3.64 lab) */
export const M2LAB_FIG = 3.64 / 1.85;
const SLOPE_MAX = Math.tan((35 * Math.PI) / 180);   // walkable slope (J14 walkability: 35°)

export interface FigureWalker {
  root: THREE.Group;
  walker: any;
  profiles: any;
  heightAt(x: number, z: number): number;
  /** for the travel core (src/play/travel.ts): the resident, its clips by name, the foot bones */
  res: PlayableFigure;
  clipMap: Map<string, THREE.AnimationClip>;
  feet: { l: THREE.Object3D; r: THREE.Object3D };
}

export interface WalkOpts {
  /** built walk surface (island ground + RKIT road parts); without it the island field is the ground */
  surface?: { at(x: number, z: number): SurfaceHit | null };
  /** spawn x, z (world) and heading */
  spawn?: [number, number, number];
  /** B2: catalogue id of the player figure (default farmer_a) */
  figure?: string;
  /** world origin of the walk (C1b+C3: the O1 hub floor height); the wall sentinel sits above it */
  base?: number[];
}

let REF: any = null;   // Farmer_A's measured Medium set: the tempo reference for figures without foot bones (Legacy)
/** B2: locomotion profile set measured on this figure's own rig (template measureClip / buildProfileSet, unchanged). Figures
 *  without foot bones (Legacy Animated Character, unrigged orcs) cannot be measured: they take the Medium reference tempo
 *  and only the roles their own clips cover (marked `tempo: 'Medium-Referenz'`). */
export function measureProfiles(F: PlayableFigure, root: THREE.Object3D) {
  const e = F.entry, mixer = F.mixer; mixer.stopAllAction();
  const list = F.clips.map((c) => ({ name: c.name, clip: c, pack: 'KayKit 1.1 Rig_' + e.rig }));
  let set: any;
  if (F.feet && F.hips && e.rig !== 'Legacy') {
    set = buildProfileSet(THREE, {
      clips: list, rigFamily: 'Rig_' + e.rig, actor: e.label, actorScale: FIG_SCALE,
      measure: (clip: THREE.AnimationClip) => measureClip(THREE, { mixer, clip, space: root, feet: F.feet!, hips: F.hips!, fwd: new THREE.Vector3(0, 0, 1), side: new THREE.Vector3(1, 0, 0) }),
    });
    if (e.id === 'farmer_a') REF = set;
  } else {
    const have = new Set(F.clips.map((c) => c.name)), prof: Record<string, any> = {};
    for (const [k, p] of Object.entries<any>(REF?.profiles ?? {})) prof[k] = p.clip && have.has(p.clip) ? { ...p, tempo: 'Medium-Referenz' } : { role: k, clip: null, status: 'UNMAPPED · no source clip' };
    set = { ...(REF ?? {}), rigFamily: e.rig, actor: e.label, profiles: prof, unmapped: Object.keys(prof).filter((k) => !prof[k].clip), tempo: 'Medium-Referenz (keine Fußknochen)' };
  }
  mixer.stopAllAction();
  const idle = F.clips.find((c) => c.name === (set.profiles.idle?.clip ?? 'Idle_A')); if (idle) mixer.clipAction(idle).play();
  return set;
}

export async function createFigureWalker(app: App, scene: THREE.Scene, islandId: string, opts: WalkOpts = {}): Promise<FigureWalker> {
  // a stage (demo island, src/island/demo-stage.ts) brings its own surface + spawn and has no Lab island field
  const isl = app.islands.get(islandId);
  if (!isl && !(opts.surface && opts.spawn)) throw new Error('walk: no island ' + islandId + ' and no stage surface');
  const f: any = isl?.field ?? null, P0 = isl?.spec.pos ?? opts.base ?? [0, 0, 0];
  // ---- figure (B2 catalogue build: clay `figure`, eyes per entry) in an unscaled root: measurements and movement in lab units
  const cat = await loadFigureCatalog();
  if (!REF && (opts.figure ?? 'farmer_a') !== 'farmer_a') measureProfiles(await buildPlayable(cat.find((x) => x.id === 'farmer_a')!), new THREE.Group());   // tempo reference
  const entry = cat.find((x) => x.id === (opts.figure ?? 'farmer_a')) ?? cat.find((x) => x.id === 'farmer_a')!;
  const res = await buildPlayable(entry);
  const root = new THREE.Group(); root.name = 'player'; root.add(res.obj);
  scene.add(root);
  const profiles: any = measureProfiles(res, root);
  const P: Record<string, any> = profiles.profiles;
  // ---- ground: the island's terrain; slopes over 35° and the island edge are walls (soft stop: the walker slides along)
  const S = opts.surface, surfY = (x: number, z: number) => { const h = S!.at(x, z); return !h || h.wall ? null : h.y; };
  const heightAt = (x: number, z: number) => {
    const lx = x - P0[0], lz = z - P0[2];
    if (f && f.sd(lx, lz) < 0.8) return P0[1] + 60;
    if (S) {   // built surface: barrier tops and steep faces are walls
      const y = surfY(x, z), e = 0.5; if (y == null) return P0[1] + 60;
      const ax = surfY(x + e, z), bx = surfY(x - e, z), az = surfY(x, z + e), bz = surfY(x, z - e);
      if (ax == null || bx == null || az == null || bz == null) return P0[1] + 60;
      // V-199 (3) (Georg 13.10.: walked through the clay drops instead of over them; once walkable, their steep flanks were walls): a face
      // steeper than 35° is a wall only if it is also higher over the probe span than the walker can step (stepMax) — a drop or a kerb is
      // stepped onto, a cliff stays a wall. (Side effect: continuous 35–41° slopes are walkable; there are none on the hub.)
      if (Math.hypot((ax - bx) / (2 * e), (az - bz) / (2 * e)) > SLOPE_MAX && Math.max(ax, bx, az, bz, y) - Math.min(ax, bx, az, bz, y) > 0.45 * M2LAB_FIG) return P0[1] + 60;   /* = the walker's stepMax below */
      return y;
    }
    const h = f.height(lx, lz), e = 0.5, gx = (f.height(lx + e, lz) - f.height(lx - e, lz)) / (2 * e), gz = (f.height(lx, lz + e) - f.height(lx, lz - e)) / (2 * e);
    if (Math.hypot(gx, gz) > SLOPE_MAX) return P0[1] + 60;
    return P0[1] + h;
  };
  // ---- walker (template), parameters from the template's metres × figure factor
  const walker = createWalkController({ THREE, params: {
    speed: P.walk?.worldSpeed || 1, sprintMul: 1, gravity: 19 * M2LAB_FIG, turnRate: 2.0,
    stepMax: 0.45 * M2LAB_FIG, autoJumpMax: 0.6 * M2LAB_FIG, hopClear: 0.15 * M2LAB_FIG, radius: 0.3 * M2LAB_FIG,
    probeStep: 0.12 * M2LAB_FIG, probeMax: 1.6 * M2LAB_FIG, stepUpSpeed: 4 * M2LAB_FIG, bounceMin: 99,
  } });
  // spawn: a few steps along the arrival path (as I2), facing the landmark
  const path = f?.paths[0] ?? [[0, 0]], p0 = path[Math.min(path.length - 1, 4)], L = f?.landmark ?? path[path.length - 1];
  if (opts.spawn) walker.reset(opts.spawn[0], opts.spawn[1], heightAt(opts.spawn[0], opts.spawn[1]), opts.spawn[2]);
  else walker.reset(p0[0] + P0[0], p0[1] + P0[2], heightAt(p0[0] + P0[0], p0[1] + P0[2]), Math.atan2(L[0] - p0[0], L[1] - p0[1]));
  return { root, walker, profiles, heightAt, res, clipMap: new Map(res.clips.map((c) => [c.name, c])), feet: res.feet ?? { l: res.obj, r: res.obj } };
}
