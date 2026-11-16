// What the scenes share. lattice, tank, fitRadius, scaledSubsteps, particleView and liquidVisual are from the library's
// demo (demo/presets/shared.ts and liquids.ts, MIT, Daniel Greenheck); the rest is the block's own.
import { Vector3, type Box3, type InstancedMesh, type Object3D, type PerspectiveCamera, type Scene, type Vector2 } from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import {
  FluidSurfaceRenderer,
  PrimitiveSet,
  createParticleMesh,
  type FluidSurfaceRendererOptions,
  type FluidSystem,
  type ParticleInit,
  type ParticleMeshOptions,
  type ParticleSystem,
  type SimLoop,
} from 'threejs-particle-fluids';
import type { Assets } from '../assets.ts';

/** The controls a scene reads while it runs. */
export interface Values {
  /** Gravity as a share of the scene's own: 1 is normal, 0 is none. */
  gravity: number;
  /** 0 to 1, where 0.25 is the scene's usual material: water to syrup, rubber to loose jelly, silk to canvas, thin to thick smoke. */
  thickness: number;
  /** How hard a click or a drag pushes, as a share of the scene's own. */
  push: number;
  /** How strongly a liquid holds together into drops, as a share of the scene's own. */
  tension: number;
  /** Draw the raw particles instead of the finished surfaces. */
  showParticles: boolean;
  /** Screen-space reflections on liquid. */
  reflections: boolean;
}

export interface BuildContext {
  renderer: WebGPURenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  /** How many particles to aim for. */
  particles: number;
  values: Values;
  assets: Assets;
  /** Lets the page draw if it's been working a while: long CPU work is split up with this. */
  breathe(): Promise<void>;
}

/** A scene, built and running. */
export interface World {
  particles: ParticleSystem;
  loop: SimLoop;
  objects: Object3D[];
  particleCount: number;
  /** Where a press acts on the simulation. A press outside it orbits the view instead. */
  focus: Box3;
  /** How far a push reaches, and how hard it is, in metres and m/s. */
  reach: number;
  strength: number;
  /** How firmly a press holds what it grabs, 0 to 1. With one, what's held can be lifted and thrown, and a press finds the particle under it. */
  grip?: number;
  /** A press has to land on something: one that misses orbits instead. */
  exact?: boolean;
  /** A press has taken hold of it, or let go. */
  grabbed?(held: boolean): void;
  /** Still going by itself, however slowly things are moving: it never rests. */
  restless?(): boolean;
  update?(dt: number, time: number): void | Promise<void>;
  prepareRender?(): void | Promise<void>;
  /** The first point of the simulation under a point on screen, when it can tell. */
  pick?(uv: Vector2): Promise<Vector3 | null>;
  /** Takes over what a press does, as the honey's nozzle does: return false to let it push instead. */
  press?(point: Vector3 | null): boolean;
  /** The pressed point has moved. */
  moved?(point: Vector3): void;
  released?(): void;
  /** Kernels the frame loop doesn't run every frame, for compiling them with the rest. */
  occasional?: unknown[];
  /** Undoes what the compile's dry run changed. */
  rearm?(): void;
  /** Reads the values again. */
  apply(values: Values): void;
  /** Back to the first moment, on the same buffers: nothing is rebuilt or compiled. */
  restart(): void;
  dispose(): void;
}

/** Scene-level value at a thickness: `usual` at the default of 0.25, moving evenly on a log scale to `thin` and `thick` at the ends. */
export function byThickness(t: number, thin: number, usual: number, thick: number): number {
  return t < 0.25 ? thin * (usual / thin) ** (t / 0.25) : usual * (thick / usual) ** ((t - 0.25) / 0.75);
}

/**
 * Puts the particles back where they were uploaded. The CPU's copies of these buffers are never written after the
 * upload (the simulation only changes them on the GPU), so sending them again is the whole restart.
 */
export function sendParticlesAgain(particles: ParticleSystem): void {
  for (const buffer of [particles.positions, particles.predictedPositions, particles.velocities, particles.invMass, particles.rotation, particles.predictedRotation, particles.angularVelocity]) {
    buffer.value.needsUpdate = true;
  }
}

/** Particles on a cubic lattice filling a box, optionally clipped by `accept`. */
export function lattice(min: readonly number[], max: readonly number[], spacing: number, accept?: (x: number, y: number, z: number) => boolean): ParticleInit[] {
  const points: ParticleInit[] = [];
  for (let y = min[1]! + spacing / 2; y < max[1]!; y += spacing)
    for (let z = min[2]! + spacing / 2; z < max[2]!; z += spacing)
      for (let x = min[0]! + spacing / 2; x < max[0]!; x += spacing) if (!accept || accept(x, y, z)) points.push({ position: [x, y, z] });
  return points;
}

/** A floor and four walls around the origin. */
export function tank(particles: ParticleSystem, halfX: number, halfZ: number, friction = { muS: 0.08, muK: 0.04 }): PrimitiveSet {
  const walls = new PrimitiveSet(particles);
  walls.addPlane(new Vector3(0, 1, 0), new Vector3(), friction);
  walls.addPlane(new Vector3(1, 0, 0), new Vector3(-halfX, 0, 0), friction);
  walls.addPlane(new Vector3(-1, 0, 0), new Vector3(halfX, 0, 0), friction);
  walls.addPlane(new Vector3(0, 0, 1), new Vector3(0, 0, -halfZ), friction);
  walls.addPlane(new Vector3(0, 0, -1), new Vector3(0, 0, halfZ), friction);
  return walls;
}

/** Particle radius for which `fill(radius)` gives about `target` particles. Lattice counts go with 1/r³, so a few cube-root corrections converge. */
export function fitRadius(fill: (radius: number) => readonly unknown[], target: number, guess: number): number {
  let radius = guess;
  for (let i = 0; i < 5; i++) radius *= Math.cbrt(Math.max(1, fill(radius).length) / target);
  return radius;
}

/** Substeps for a particle budget: spacing shrinks as the count grows and speeds don't, so substeps go with 1/spacing. `base` is the setting at 10,000. */
export function scaledSubsteps(base: number, particles: number, dimensions: 2 | 3 = 3): number {
  const scale = (particles / 10000) ** (1 / dimensions);
  // Coarser particles need fewer too, for the same stability: the library's demo keeps `base` as a floor, which costs a lot here.
  return particles < 10000 ? Math.max(2, Math.round(base * scale)) : Math.ceil(base * scale - 0.1);
}

/** Spheres showing the raw particles, hidden until they're switched on. */
export function particleView(particles: ParticleSystem, options: ParticleMeshOptions = {}): InstancedMesh {
  const mesh = createParticleMesh(particles, options);
  mesh.visible = false;
  return mesh;
}

export interface LiquidVisual {
  readonly surface: FluidSurfaceRenderer;
  readonly dots: InstancedMesh;
  update(): Promise<void>;
  setParticleView(enabled: boolean): void;
}

/** A fluid's rendered surface, and the particles it can switch to. */
export function liquidVisual(ctx: BuildContext, fluid: FluidSystem, options: Omit<FluidSurfaceRendererOptions, 'renderer' | 'scene' | 'camera'> & { readonly dotColor?: number }): LiquidVisual {
  const surface = new FluidSurfaceRenderer(fluid, { renderer: ctx.renderer, scene: ctx.scene, camera: ctx.camera, ...options });
  const dots = particleView(fluid.particles, { range: fluid.range, color: options.dotColor ?? options.appearance?.color ?? 0x5fb9ff });
  let shown = false;
  return {
    surface,
    dots,
    // The surface is skipped while the particles are shown.
    update: () => (shown ? Promise.resolve() : surface.update()),
    setParticleView(enabled) {
      shown = enabled;
      dots.visible = enabled;
      surface.mesh.visible = !enabled;
    },
  };
}
