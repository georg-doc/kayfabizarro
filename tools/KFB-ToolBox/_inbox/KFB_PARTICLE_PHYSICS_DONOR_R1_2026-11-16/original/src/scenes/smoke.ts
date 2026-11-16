// The smoke plume. From the library's demo preset (demo/presets/vortex.ts, MIT, Daniel Greenheck), with restarts on the
// same buffers and a puff of smoke where you press.
import { Box3, BoxGeometry, CylinderGeometry, Group, Mesh, Vector3 } from 'three';
import { Fn, color, instanceIndex, mix, uniform, vec2, vec3, vec4 } from 'three/tsl';
import { FluidSystem, GasSystem, GasVolumeRenderer, ParticleSystem, SimLoop, type Material } from 'threejs-particle-fluids';
import { material, pedestal } from '../stage.ts';
import { byThickness, fitRadius, lattice, particleView, scaledSubsteps, sendParticlesAgain, tank, type BuildContext, type World } from './shared.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const HALF = 0.5, TOP = 1.9, VENT = 0.17, SMOKE_TOP = 1.7;
/** The vent's heat, as a rising acceleration at normal gravity, m/s². */
const HEAT = 3;
/** Tracers let go at the vent a second. */
const EMISSION = 4500;

export async function buildSmoke(ctx: BuildContext): Promise<World> {
  // Still air fills the column. The vent heats it, and the hot air rises and carries the smoke.
  const fill = (r: number) => lattice([-HALF, r, -HALF], [HALF, TOP, HALF], r * 2);
  const radius = fitRadius(fill, ctx.particles, 0.035);
  const initial = fill(radius);
  const count = initial.length;
  await ctx.breathe();
  const particles = new ParticleSystem(ctx.renderer, count, radius);
  particles.uploadParticles(initial);
  const air = new FluidSystem(particles, { viscosity: 0.02, vorticity: 0.06 });
  const smoke = new GasSystem(air, {
    capacity: 30000,
    lifetime: 6,
    // Smoke vents out near the top instead of pooling there.
    bounds: new Box3(new Vector3(-1, -1, -1), new Vector3(1, SMOKE_TOP, 1)),
    heatSources: [{ position: new Vector3(), radius: VENT }],
    buoyancy: HEAT,
    cooling: 0.6,
  });
  // Vanes along the walls turn the air the plume draws in, so the column spins.
  const swirl = uniform(0.35);
  const vanes: Material = {
    build: ({ dt }) => ({
      postSolve: [
        Fn(() => {
          const p: Any = particles.positions.element(instanceIndex).xyz;
          const velocity: Any = particles.velocities.element(instanceIndex);
          const v: Any = velocity.xyz.toVar();
          const r: Any = vec2(p.x, p.z).length().toVar();
          const tangent: Any = vec3(p.z.negate(), 0, p.x).div(r.max(1e-4));
          const turn: Any = swirl.sub(v.dot(tangent)).mul(r.smoothstep(0.3, 0.45)).mul(dt.mul(4));
          velocity.assign(vec4(v.add(tangent.mul(turn)), velocity.w));
        })().compute(count),
      ],
    }),
  };
  // A lid keeps hot air from leaving through the top.
  const walls = tank(particles, HALF + 0.02, HALF + 0.02);
  walls.addPlane(new Vector3(0, -1, 0), new Vector3(0, TOP + 0.02, 0));
  const substeps = scaledSubsteps(2, ctx.particles);
  const loop = new SimLoop(particles, {
    substeps,
    iterations: 2,
    // Light gravity keeps the air settled, so gaps the plume leaves refill.
    gravity: new Vector3(0, -1, 0),
    colliders: [walls],
    materials: [smoke, air, vanes],
  });
  const volume = new GasVolumeRenderer(smoke, {
    renderer: ctx.renderer,
    min: new Vector3(-HALF, 0, -HALF),
    max: new Vector3(HALF, SMOKE_TOP, HALF),
    resolution: [80, 128, 80],
    steps: 80,
    density: 0.9,
  });
  // Air particles glow with their temperature.
  const temperature = smoke.temperature!;
  const dots = particleView(particles, {
    radius: radius * 0.22,
    colorNode: () => mix(color(0x6d8a9c), color(0xff8a3d), temperature.element(instanceIndex).clamp(0, 1).pow(0.4)),
  });
  const vent = new Group();
  const recess = new Mesh(new CylinderGeometry(VENT, VENT, 0.006, 64), material(0x0b141d, 0.8, 0));
  recess.position.y = 0.005;
  vent.add(recess);
  const grille = material(0x738894, 0.35, 0.7);
  for (let i = -5; i <= 5; i++) {
    const x = i * 0.028;
    const slat = new Mesh(new BoxGeometry(0.008, 0.008, Math.sqrt((VENT - 0.01) ** 2 - x ** 2) * 2), grille);
    slat.position.set(x, 0.012, 0);
    vent.add(slat);
  }

  let carry = 0;
  let showing = false;
  const puff = (p: Vector3) => {
    for (let i = 0; i < 500; i++) {
      const u = Math.random() * Math.PI * 2, w = Math.random() * 2 - 1, r = 0.09 * Math.cbrt(Math.random());
      const s = Math.sqrt(1 - w * w);
      smoke.emit([p.x + r * s * Math.cos(u), p.y + r * w, p.z + r * s * Math.sin(u)]);
    }
  };
  return {
    particles,
    loop,
    objects: [pedestal(0.58), vent, volume.object, dots],
    get particleCount() {
      return count;
    },
    focus: new Box3(new Vector3(-HALF, 0, -HALF), new Vector3(HALF, SMOKE_TOP, HALF)),
    reach: 0.28,
    strength: 2.4,
    restless: () => true,
    prepareRender: () => (showing ? undefined : volume.update()),
    press(point) {
      if (point) puff(point);
      return false;
    },
    update(dt) {
      carry += EMISSION * dt;
      const n = Math.floor(carry);
      carry -= n;
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = (VENT - 0.02) * Math.sqrt(Math.random());
        smoke.emit([Math.cos(angle) * r, 0.03 + Math.random() * 0.05, Math.sin(angle) * r]);
      }
    },
    apply(v) {
      // Hot air only rises because gravity pulls the cool air down: no gravity, no plume.
      loop.gravity.y = -1 * v.gravity;
      smoke.buoyancy = HEAT * v.gravity;
      volume.density = byThickness(v.thickness, 0.25, 0.9, 3.5);
      showing = v.showParticles;
      dots.visible = v.showParticles;
      volume.object.visible = !v.showParticles;
    },
    restart() {
      sendParticlesAgain(particles);
      // The tracers' and temperatures' CPU copies are all still zero, which is no smoke and cool air.
      smoke.smokeAlive.value.needsUpdate = true;
      smoke.smokeAge.value.needsUpdate = true;
      temperature.value.needsUpdate = true;
      const own = smoke as unknown as { bornAt: Float64Array; pending: number[] };
      own.bornAt.fill(-Infinity);
      own.pending.length = 0;
      carry = 0;
    },
    dispose() {
      volume.dispose();
      smoke.dispose();
      particles.dispose();
      loop.dispose();
    },
  };
}
