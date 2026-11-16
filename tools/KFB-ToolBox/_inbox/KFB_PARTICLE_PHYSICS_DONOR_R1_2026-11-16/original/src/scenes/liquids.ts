// The liquid scenes: a dam break, floating ducks and a honey pour. From the library's demo presets (demo/presets/
// dambreak.ts, buoyancy.ts and honey.ts, MIT, Daniel Greenheck), with the block's bunny for the Stanford one, restarts
// on the same buffers, and honey you can pour where you point.
import { Box3, CanvasTexture, CylinderGeometry, Mesh, MeshStandardMaterial, Quaternion, RepeatWrapping, SRGBColorSpace, TorusGeometry, Vector3 } from 'three';
import { Fn, If, instanceIndex, instancedArray, int, uniform, vec3, vec4 } from 'three/tsl';
import { FluidSystem, ParticleSystem, SDFCollider, SimLoop, SoftbodyMesh, SoftbodySystem, ViscositySolver, type ParticleInit, type SoftbodyDef } from 'threejs-particle-fluids';
import { fillMesh } from '../fill.ts';
import { basin, material } from '../stage.ts';
import { byThickness, fitRadius, lattice, liquidVisual, particleView, scaledSubsteps, sendParticlesAgain, tank, type BuildContext, type World } from './shared.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const UP = new Vector3(0, 1, 0);

export function bunnyMesh(ctx: BuildContext, yaw: number, scale: number): Mesh {
  const mesh = new Mesh(ctx.assets.bunny.geometry, new MeshStandardMaterial({ color: 0xf4f0ea, roughness: 0.32, metalness: 0 }));
  mesh.rotation.y = yaw;
  mesh.scale.setScalar(scale);
  mesh.castShadow = mesh.receiveShadow = true;
  // (The geometry is shared and stays: the scene frees only its material)
  mesh.userData.shared = true;
  return mesh;
}

export async function buildDamBreak(ctx: BuildContext): Promise<World> {
  const HALF_X = 1, HALF_Z = 0.45, COLUMN = 0.6, LIFT = 0.2, HEIGHT = 0.8, BUNNY = 1.6;
  const fill = (r: number) => lattice([-HALF_X, LIFT + r, -HALF_Z], [-HALF_X + COLUMN, LIFT + HEIGHT, HALF_Z], r * 2);
  const radius = fitRadius(fill, ctx.particles, 0.015);
  const initial = fill(radius);
  const particles = new ParticleSystem(ctx.renderer, initial.length, radius);
  particles.uploadParticles(initial);
  const fluid = new FluidSystem(particles, { viscosity: 0.01, surfaceTension: 0.08, vorticity: 0.02 });
  const walls = tank(particles, HALF_X, HALF_Z);
  // It faces the oncoming water.
  const yaw = Math.PI;
  const bunny = bunnyMesh(ctx, yaw, BUNNY);
  bunny.position.x = 0.25;
  const obstacle = new SDFCollider(particles, ctx.assets.bunny.sdf, {
    position: bunny.position.clone(),
    rotation: new Quaternion().setFromAxisAngle(UP, yaw),
    scale: BUNNY,
    muS: 0.3,
    muK: 0.2,
  });
  const substeps = scaledSubsteps(4, ctx.particles);
  const loop = new SimLoop(particles, { substeps, iterations: 2, gravity: new Vector3(0, -9.81, 0), materials: [fluid], colliders: [walls, obstacle] });
  const visual = liquidVisual(ctx, fluid, {
    bounds: new Box3(new Vector3(-HALF_X - 0.03, -0.02, -HALF_Z - 0.03), new Vector3(HALF_X + 0.03, LIFT + 1.1, HALF_Z + 0.03)),
    colliders: [walls, obstacle],
    motionStretch: 0.02,
    appearance: { color: 0x2a93b8, attenuationDistance: 0.3, scattering: 0.12, roughness: 0.06 },
  });
  return {
    particles,
    loop,
    objects: [basin(HALF_X * 2, HALF_Z * 2, 1.05, undefined, 0.015), bunny, visual.surface.mesh, visual.dots],
    particleCount: initial.length,
    focus: new Box3(new Vector3(-HALF_X, 0, -HALF_Z), new Vector3(HALF_X, 1.05, HALF_Z)),
    reach: 0.32,
    strength: 5.5,
    exact: true,
    prepareRender: () => visual.update(),
    pick: (uv) => visual.surface.pick(uv),
    occasional: [(visual.surface as Any).pickKernel],
    rearm: () => ((visual.surface as Any).wallVersions = undefined),
    apply(v) {
      loop.gravity.y = -9.81 * v.gravity;
      fluid.viscosity = byThickness(v.thickness, 0.004, 0.01, 0.3);
      fluid.surfaceTension = 0.08 * v.tension;
      visual.setParticleView(v.showParticles);
      visual.surface.reflections = v.reflections;
    },
    restart: () => sendParticlesAgain(particles),
    dispose() {
      (bunny.material as MeshStandardMaterial).dispose();
      visual.surface.dispose();
      obstacle.dispose();
      particles.dispose();
      loop.dispose();
    },
  };
}

let tiles: CanvasTexture | undefined;
/** Pool tiles make the water's clearness and bending readable. One for the whole visit. */
function poolTiles(): CanvasTexture {
  if (tiles) return tiles;
  const tile = document.createElement('canvas');
  tile.width = tile.height = 128;
  const paint = tile.getContext('2d') as CanvasRenderingContext2D;
  paint.fillStyle = '#b8d3df';
  paint.fillRect(0, 0, 128, 128);
  paint.strokeStyle = '#87acbf';
  paint.lineWidth = 2;
  paint.strokeRect(0, 0, 128, 128);
  tiles = new CanvasTexture(tile);
  tiles.colorSpace = SRGBColorSpace;
  tiles.wrapS = tiles.wrapT = RepeatWrapping;
  tiles.repeat.set(7, 7);
  return tiles;
}

/** How many times heavier a duck's base is than the rest of it, like a weighted toy: it floats upright. */
const BASE_WEIGHT = 4;

export async function buildDucks(ctx: BuildContext): Promise<World> {
  const fill = (r: number) => lattice([-0.76, r, -0.5], [0.76, 0.42, 0.5], r * 2);
  const radius = fitRadius(fill, ctx.particles, 0.021);
  const spacing = radius * 2;
  const initial: ParticleInit[] = fill(radius);
  const waterCount = initial.length;
  const duck = ctx.assets.duck;
  const geometries = [0.92, 1, 0.86].map((size, i) =>
    duck.geometry.clone().scale(size, size, size).rotateY([-0.5, 0.65, -0.8][i]!).translate((i - 1) * 0.45, 0.47, [0.08, -0.12, 0.06][i]!),
  );
  // Light enough to bob, and to come back up when pushed under: 0.4 of the water's density, as in the library's demo.
  const meanInvMass = 1 / (1000 * spacing ** 3 * 0.4);
  const bodies: SoftbodyDef[] = [];
  for (const geometry of geometries) {
    const shape = await fillMesh(geometry, { particleRadius: radius });
    const start = initial.length;
    const heights = Array.from({ length: shape.count }, (_, i) => shape.positions[i * 3 + 1]!);
    const bottom = heights.reduce((a, b) => Math.min(a, b));
    const top = heights.reduce((a, b) => Math.max(a, b));
    const inBase = heights.map((y) => y < bottom + (top - bottom) / 3);
    const baseCount = inBase.filter(Boolean).length;
    const invMass = (meanInvMass * (baseCount * BASE_WEIGHT + shape.count - baseCount)) / shape.count;
    for (let i = 0; i < shape.count; i++) {
      const [x, y, z] = shape.positions.subarray(i * 3, i * 3 + 3);
      initial.push({ position: [x!, y!, z!], invMass: inBase[i] ? invMass / BASE_WEIGHT : invMass });
    }
    bodies.push({ range: { start, count: shape.count }, surfaceCount: shape.surfaceCount, compliance: 1e-6 });
  }
  await ctx.breathe();
  const particles = new ParticleSystem(ctx.renderer, initial.length, radius);
  particles.uploadParticles(initial);
  await ctx.breathe();
  const ducks = new SoftbodySystem(particles, { bodies });
  await ctx.breathe();
  const water = new FluidSystem(particles, { range: { start: 0, count: waterCount }, viscosity: 0.025, surfaceTension: 0.055 });
  for (let i = 0; i < bodies.length; i++) water.addBoundary(ducks.surfaceRange(i));
  const walls = tank(particles, 0.8, 0.55);
  const substeps = scaledSubsteps(5, ctx.particles);
  const loop = new SimLoop(particles, { substeps, iterations: 2, gravity: new Vector3(0, -5, 0), materials: [water, ducks], colliders: [walls], contact: { muS: 0.35, muK: 0.2 } });
  const meshes: SoftbodyMesh[] = [];
  for (const [i, geometry] of geometries.entries()) {
    await ctx.breathe();
    meshes.push(new SoftbodyMesh(ducks, i, geometry, duck.material));
  }
  // (Their material is shared and stays: the scene frees only its geometries)
  for (const mesh of meshes) mesh.userData.shared = true;
  await ctx.breathe();
  const visual = liquidVisual(ctx, water, {
    bounds: new Box3(new Vector3(-0.83, -0.02, -0.58), new Vector3(0.83, 0.85, 0.58)),
    colliders: [walls],
    solids: { start: waterCount, count: initial.length - waterCount },
    appearance: { color: 0x74c8e6, attenuationDistance: 0.8, scattering: 0.04, roughness: 0.055 },
  });
  const tray = basin(1.65, 1.15, 0.39, poolTiles());
  const dots = particleView(particles, { color: 0xdabec8 });
  return {
    particles,
    loop,
    objects: [tray, ...meshes, visual.surface.mesh, dots],
    particleCount: initial.length,
    focus: new Box3(new Vector3(-0.8, 0, -0.55), new Vector3(0.8, 0.8, 0.55)),
    reach: 0.2,
    strength: 4,
    grip: 0.45,
    exact: true,
    prepareRender: () => visual.update(),
    occasional: [],
    rearm: () => ((visual.surface as Any).wallVersions = undefined),
    apply(v) {
      loop.gravity.y = -5 * v.gravity;
      water.viscosity = byThickness(v.thickness, 0.008, 0.025, 0.3);
      water.surfaceTension = 0.055 * v.tension;
      visual.setParticleView(v.showParticles);
      visual.dots.visible = false;
      dots.visible = v.showParticles;
      for (const mesh of meshes) mesh.visible = !v.showParticles;
      visual.surface.reflections = v.reflections;
    },
    restart: () => sendParticlesAgain(particles),
    dispose() {
      for (const geometry of geometries) geometry.dispose();
      visual.surface.dispose();
      particles.dispose();
      loop.dispose();
    },
  };
}

/** Height of the nozzle above the floor, and the speed of the stream leaving it. */
const NOZZLE_HEIGHT = 0.75, POUR_SPEED = 1.6, TANK_X = 0.8, TANK_Z = 0.55;
/** Where the first pour circles, over the bunny's head and back. */
const AIM = new Vector3(0.0, 0, 0.0);

export async function buildHoney(ctx: BuildContext): Promise<World> {
  // A fixed 34 L of honey, split into the particles asked for. It's a thin stream, so it gets more of them than other scenes.
  const count = Math.round(ctx.particles * 1.6);
  const spacing = Math.cbrt(0.0343 / count);
  const radius = spacing / 2;
  const particles = new ParticleSystem(ctx.renderer, count, radius);
  // Every particle waits pinned in a sparse grid far below the floor until the nozzle releases it.
  particles.uploadParticles(Array.from({ length: count }, (_, k) => ({ position: [(k % 150) * 0.25 - 18.75, -30, Math.floor(k / 150) * 0.25 - 12.5] as const })));
  const fluid = new FluidSystem(particles, { viscosity: 0.03, surfaceTension: 0.015 });
  particles.setInvMass(fluid.range, 0);
  const viscosity = new ViscositySolver(fluid, { viscosity: 20, iterations: Math.round(16 * Math.cbrt(count / 10000)) });
  // Honey sticks to what it touches: high friction everywhere.
  const walls = tank(particles, TANK_X, TANK_Z, { muS: 1.2, muK: 1 });
  const yaw = -Math.PI / 4;
  const bunny = bunnyMesh(ctx, yaw, 1);
  const obstacle = new SDFCollider(particles, ctx.assets.bunny.sdf, { rotation: new Quaternion().setFromAxisAngle(UP, yaw), muS: 1.2, muK: 1 });
  // (Thick honey piled on a bunny wants its substeps: the library demo's three is the floor here)
  const substeps = Math.max(3, scaledSubsteps(3, ctx.particles));
  const loop = new SimLoop(particles, { substeps, iterations: 2, gravity: new Vector3(0, -9.81, 0), colliders: [walls, obstacle], materials: [fluid, viscosity] });

  const nozzle = new Mesh(new CylinderGeometry(0.03, 0.03, 0.14, 48, 1, true), material(0xb2a896, 0.23, 0.8));
  const lip = new Mesh(new TorusGeometry(0.03, 0.006, 12, 64), nozzle.material);
  lip.rotation.x = Math.PI / 2;
  lip.position.y = -0.07;
  nozzle.add(lip);
  const visual = liquidVisual(ctx, fluid, {
    bounds: new Box3(new Vector3(-0.83, -0.02, -0.58), new Vector3(0.83, 1.15, 0.58)),
    colliders: [walls, obstacle],
    motionStretch: 0.025,
    appearance: { color: 0xf07a0c, attenuationDistance: 0.06, scattering: 0.4, ior: 1.49, roughness: 0.12 },
  });

  // Whole layers of a square lattice clipped to the nozzle's disc, one spacing apart, so new particles never overlap the stream.
  const disc: number[] = [];
  const reach = Math.floor(0.02 / spacing);
  for (let i = -reach; i <= reach; i++) for (let j = -reach; j <= reach; j++) if ((i * i + j * j) * spacing * spacing <= 0.02 ** 2) disc.push(i * spacing, 0, j * spacing, 0);
  const discOffsets = instancedArray(new Float32Array(disc), 'vec4');
  const perLayer = disc.length / 4;
  const source = uniform(new Vector3());
  const sweep = uniform(new Vector3());
  const emitStart = uniform(0, 'float');
  const emitLayers = uniform(0, 'float');
  const newestDrop = uniform(0, 'float');
  const speed = uniform(POUR_SPEED, 'float');
  const emit = Fn(() => {
    const i: Any = instanceIndex;
    const slot: Any = int(i).sub(emitStart.toInt()).toVar();
    const layers: Any = emitLayers.toInt();
    If(slot.greaterThanEqual(0).and(slot.lessThan(layers.mul(perLayer))), () => {
      const layer: Any = slot.div(perLayer);
      const offset: Any = discOffsets.element(slot.mod(perLayer)).xyz;
      const drop: Any = newestDrop.add(layers.sub(1).sub(layer).toFloat().mul(spacing));
      const position: Any = vec4(source.add(offset).sub(vec3(0, drop, 0)), 0);
      particles.positions.element(i).assign(position);
      particles.predictedPositions.element(i).assign(position);
      particles.velocities.element(i).assign(vec4(sweep.x, speed.negate(), sweep.z, 0));
      particles.invMass.element(i).assign(1 / fluid.mass);
      // Waiting particles have no neighbours, so their density is stale.
      fluid.density.element(i).assign(fluid.restDensity);
    });
  })().compute(count);

  let released = 0;
  let total = 0;
  let travelled = 0;
  /** Where the nozzle is. Pressing moves it; while it's pressed it pours for as long as you hold. */
  const nozzleAt = new Vector3();
  const wanted = new Vector3();
  let held = false;
  let handled = false;
  /** How much longer it pours after being let go, so a tap pours a little. */
  let tapped = 0;
  const follow = (p: Vector3) => wanted.set(Math.max(-TANK_X + 0.06, Math.min(TANK_X - 0.06, p.x)), 0, Math.max(-TANK_Z + 0.06, Math.min(TANK_Z - 0.06, p.z)));
  let circling = 0;
  return {
    particles,
    loop,
    objects: [basin(1.6, 1.1), bunny, nozzle, visual.surface.mesh, visual.dots],
    particleCount: count,
    focus: new Box3(new Vector3(-TANK_X, 0, -TANK_Z), new Vector3(TANK_X, 1.05, TANK_Z)),
    reach: 0.18,
    strength: 2,
    restless: () => held || tapped > 0 || (!handled && total < count),
    occasional: [emit, (visual.surface as Any).pickKernel],
    rearm: () => ((visual.surface as Any).wallVersions = undefined),
    pick: (uv) => visual.surface.pick(uv),
    press(point) {
      held = true;
      handled = true;
      if (point) follow(point);
      return true;
    },
    moved: follow,
    released() {
      held = false;
      tapped = 0.35;
    },
    async update(dt) {
      // The first pour circles over the bunny until all the honey has been out once, or you take over.
      const auto = !handled && total < count;
      if (auto) {
        circling += dt * 0.9;
        wanted.set(AIM.x + Math.cos(circling) * 0.08, 0, AIM.z + Math.sin(circling) * 0.08);
      }
      const before = nozzleAt.clone();
      nozzleAt.lerp(wanted, Math.min(1, dt * 7));
      nozzle.position.set(nozzleAt.x, NOZZLE_HEIGHT + 0.07, nozzleAt.z);
      tapped = Math.max(0, tapped - dt);
      if (!held && !auto && tapped <= 0) return;
      // Release 11 cm up inside the 14 cm nozzle, so the start of the flow is hidden.
      source.value.set(nozzleAt.x, NOZZLE_HEIGHT + 0.11, nozzleAt.z);
      sweep.value.copy(nozzleAt).sub(before).divideScalar(dt);
      travelled += POUR_SPEED * dt;
      // The oldest honey is the one on the bottom of the pile: taking it back to the nozzle isn't seen, so you can pour for ever.
      if (count - released < perLayer) released = 0;
      const layers = Math.min(Math.floor(travelled / spacing), Math.floor((count - released) / perLayer));
      travelled -= Math.floor(travelled / spacing) * spacing;
      if (layers <= 0) return;
      emitStart.value = released;
      emitLayers.value = layers;
      newestDrop.value = travelled;
      released += layers * perLayer;
      total += layers * perLayer;
      await ctx.renderer.computeAsync(emit);
    },
    prepareRender: () => visual.update(),
    apply(v) {
      loop.gravity.y = -9.81 * v.gravity;
      viscosity.viscosity = byThickness(v.thickness, 3, 20, 30);
      fluid.surfaceTension = 0.015 * v.tension;
      visual.setParticleView(v.showParticles);
      visual.surface.reflections = v.reflections;
    },
    restart() {
      sendParticlesAgain(particles);
      released = total = travelled = circling = tapped = 0;
      handled = held = false;
    },
    dispose() {
      (bunny.material as MeshStandardMaterial).dispose();
      visual.surface.dispose();
      obstacle.dispose();
      particles.dispose();
      loop.dispose();
      emit.dispose();
    },
  };
}

