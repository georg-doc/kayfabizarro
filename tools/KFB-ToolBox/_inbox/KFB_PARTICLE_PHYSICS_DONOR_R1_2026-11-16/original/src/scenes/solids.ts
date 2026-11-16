// Jelly bunnies and the velvet drape. From the library's demo presets (demo/presets/softbodies.ts and silk.ts, MIT,
// Daniel Greenheck), with the block's bunny for the Stanford one and restarts on the same buffers.
import { Box3, Color, DoubleSide, MeshStandardMaterial, PlaneGeometry, Quaternion, Vector3, type BufferGeometry } from 'three';
import { MeshPhysicalNodeMaterial } from 'three/webgpu';
import { ClothSystem, ParticleSystem, PrimitiveSet, SDFCollider, SimLoop, SoftbodyMesh, SoftbodySystem, createClothGraph, createClothSurface, type ParticleInit, type SoftbodyDef } from 'threejs-particle-fluids';
import { fillField } from '../fill.ts';
import { basin, platform } from '../stage.ts';
import { bunnyMesh } from './liquids.ts';
import { byThickness, particleView, scaledSubsteps, sendParticlesAgain, type BuildContext, type World } from './shared.ts';

const UP = new Vector3(0, 1, 0);
const LINEUP = 5;
// Faces the camera, which looks down -z at the row.
const LINEUP_YAW = -Math.PI / 2;
const FIRM = new Color(0x9fb3c8);
const JELLY = new Color(0xe8607e);
/** How high they fall from. */
const DROP = 0.3;
/** The radius of what the cloth meets at the ears, m: theirs is 0.03 at most. */
const EAR_COVER = 0.043;

export async function buildJelly(ctx: BuildContext): Promise<World> {
  const { shape, radius } = await fillField(ctx.assets.bunny.sdf, Math.round(ctx.particles / LINEUP));
  await ctx.breathe();
  const yaw = new Quaternion().setFromAxisAngle(UP, LINEUP_YAW);
  const initial: ParticleInit[] = [];
  const bodies: SoftbodyDef[] = [];
  const geometries: BufferGeometry[] = [];
  // Left to right, firm rubber to loose jelly: each twice as soft as the last.
  const softest = (n: number) => 1.2e-5 * 2 ** (n - (LINEUP - 1));
  for (let n = 0; n < LINEUP; n++) {
    await ctx.breathe();
    const offset = new Vector3((n - (LINEUP - 1) / 2) * 0.56, DROP, 0);
    const start = initial.length;
    for (let i = 0; i < shape.count; i++) {
      const p = new Vector3().fromArray(shape.positions, i * 3).applyQuaternion(yaw).add(offset);
      initial.push({ position: [p.x, p.y, p.z], invMass: shape.count / 1000 });
    }
    bodies.push({ range: { start, count: shape.count }, surfaceCount: shape.surfaceCount, compliance: softest(n), edges: shape.edges });
    geometries.push(ctx.assets.bunny.geometry.clone().applyQuaternion(yaw).translate(offset.x, offset.y, offset.z));
  }
  await ctx.breathe();
  const particles = new ParticleSystem(ctx.renderer, initial.length, radius);
  particles.uploadParticles(initial);
  // Local shape matching keeps the thin ears from shearing off.
  await ctx.breathe();
  const bunnies = new SoftbodySystem(particles, { bodies, shapeMatching: 'local' });
  await ctx.breathe();
  const floor = new PrimitiveSet(particles);
  floor.addPlane(UP, new Vector3(), { muS: 0.6, muK: 0.5 });
  // Unseen edges at the rim: a thrown bunny stays in play.
  for (const [nx, nz, at] of [[1, 0, -1.45], [-1, 0, 1.45], [0, 1, -0.45], [0, -1, 0.45]] as const) floor.addPlane(new Vector3(nx, 0, nz), new Vector3(nx ? at : 0, 0, nz ? at : 0), { muS: 0.2, muK: 0.1 });
  const substeps = scaledSubsteps(6, ctx.particles);
  const loop = new SimLoop(particles, { substeps, iterations: 2, gravity: new Vector3(0, -9.81, 0), materials: [bunnies], colliders: [floor] });
  const materials = geometries.map((_, n) => new MeshStandardMaterial({ color: FIRM.clone().lerp(JELLY, n / (LINEUP - 1)), roughness: 0.35 - (0.2 * n) / (LINEUP - 1), metalness: 0 }));
  // (Binding a detailed mesh to its particles takes a little while: one a frame)
  const meshes: SoftbodyMesh[] = [];
  for (const [n, geometry] of geometries.entries()) {
    await ctx.breathe();
    meshes.push(new SoftbodyMesh(bunnies, n, geometry, materials[n]!));
  }
  const dots = particleView(particles, { color: 0xd8bdd2 });
  let last = -1;
  return {
    particles,
    loop,
    objects: [basin(2.9, 0.9), ...meshes, dots],
    particleCount: initial.length,
    focus: new Box3(new Vector3(-1.45, 0, -0.45), new Vector3(1.45, 1.1, 0.45)),
    reach: 0.2,
    strength: 4,
    grip: 0.5,
    exact: true,
    apply(v) {
      loop.gravity.y = -9.81 * v.gravity;
      if (v.thickness !== last) {
        last = v.thickness;
        // More thickness is firmer here: a stiff body is a thick one. The usual setting at 0.25 is the library demo's.
        const soft = byThickness(v.thickness, 4, 1, 0.05);
        for (let n = 0; n < LINEUP; n++) bunnies.setCompliance(n, softest(n) * soft);
      }
      for (const mesh of meshes) mesh.visible = !v.showParticles;
      dots.visible = v.showParticles;
    },
    restart: () => sendParticlesAgain(particles),
    dispose() {
      for (const material of materials) material.dispose();
      for (const geometry of geometries) geometry.dispose();
      particles.dispose();
      loop.dispose();
    },
  };
}

export async function buildDrape(ctx: BuildContext): Promise<World> {
  const SIZE = 1.1, DROP_CLOTH = 0.7;
  const segments = Math.max(12, Math.round(Math.sqrt(ctx.particles)) - 1);
  const geometry = new PlaneGeometry(SIZE, SIZE, segments, segments);
  // Lying flat and slightly turned, with a faint ripple so the first contact isn't perfectly symmetric.
  geometry.rotateX(-Math.PI / 2).rotateY(0.35).translate(0, DROP_CLOTH, 0);
  const vertices = geometry.getAttribute('position');
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), z = vertices.getZ(i);
    vertices.setY(i, vertices.getY(i) + Math.sin(x * 9 + 0.6) * Math.cos(z * 7) * 0.012);
  }
  await ctx.breathe();
  const graph = createClothGraph(geometry, { surfaceDensity: 0.08, pinnedIndices: [] });
  await ctx.breathe();
  geometry.dispose();
  const spacing = SIZE / segments;
  // Under half the grid spacing, so neighbouring particles never touch and cloth-on-cloth contacts only fire between separate folds.
  const particles = new ParticleSystem(ctx.renderer, graph.positions.length, 0.45 * spacing);
  await ctx.breathe();
  // Bending gradients grow as the grid refines and particle masses shrink with area, so the compliance is scaled to keep the drape the same at every level.
  const bendCompliance = (softness: number) => 10 ** (-1 + softness * 5) * (segments / 30) ** 4 * (0.35 / 0.08);
  const cloth = new ClothSystem(particles, {
    graph,
    stretchTolerance: 0.06,
    bendCompliance: bendCompliance(0.8),
    // Falling flat, the full drag turns the cloth into a parachute.
    drag: 0.04,
    lift: 0.005,
    // Bleeds off the jitter where stretched cloth fights the bunny, without slowing its fall or slide as a whole.
    damping: 0.2,
  });
  const velvet = new MeshPhysicalNodeMaterial({ color: 0x870b21, side: DoubleSide, roughness: 0.9, metalness: 0, sheen: 1, sheenColor: 0xd54b5c, sheenRoughness: 0.7 });
  await ctx.breathe();
  const surface = createClothSurface(cloth, { columns: segments + 1, rows: segments + 1, material: velvet });
  await ctx.breathe();
  const dots = particleView(particles, { radius: 0.0108, color: 0xd54b5c });
  const floor = new PrimitiveSet(particles);
  floor.addPlane(UP, new Vector3(0, 0.005, 0), { muS: 0.35, muK: 0.3 });
  // Unseen edges at the plinth's rim: thrown cloth stays on the stage.
  for (const [nx, nz, at] of [[1, 0, -0.85], [-1, 0, 0.85], [0, 1, -0.85], [0, -1, 0.85]] as const) floor.addPlane(new Vector3(nx, 0, nz), new Vector3(nx ? at : 0, 0, nz ? at : 0), { muS: 0.2, muK: 0.1 });
  const yaw = -Math.PI / 4;
  const bunny = bunnyMesh(ctx, yaw, 1);
  const turned = new Quaternion().setFromAxisAngle(UP, yaw);
  // An ear's narrow tip parts the cloth's particles and comes through. So what the cloth meets up there is a little blunter than
  // the ears: one rounded shape over each and one closing the gap between them. Ears stay under the cloth, and it tents over them.
  const earAt = (x: number, y: number, z: number) => new Vector3(x, y, z).applyQuaternion(turned);
  for (const side of [-1, 0, 1]) floor.addCapsule(earAt(0.05, 0.27, side * 0.032), earAt(0.006, 0.385, side * 0.052), EAR_COVER, { muS: 1, muK: 0.85 });
  const obstacle = new SDFCollider(particles, ctx.assets.bunny.sdf, {
    rotation: turned,
    // Keeps the gap between neighbouring particles clear of the bunny, so its thin ears can't slip between them.
    thickness: 1.3 * spacing - particles.particleRadius,
    muS: 1,
    muK: 0.85,
  });
  // Ears need short steps and frequent collision solves to stay covered.
  let holding = false;
  let flying = 0;
  const substeps = scaledSubsteps(7, ctx.particles, 2);
  const loop = new SimLoop(particles, { substeps, iterations: 2, gravity: new Vector3(0, -6, 0), materials: [cloth], colliders: [floor, obstacle], contact: { muS: 0.3, muK: 0.2 } });
  return {
    particles,
    loop,
    objects: [surface, bunny, dots, platform(1.7, 1.7)],
    particleCount: particles.capacity,
    focus: new Box3(new Vector3(-0.85, 0, -0.85), new Vector3(0.85, 0.9, 0.85)),
    reach: 0.34,
    strength: 7,
    grip: 0.7,
    exact: true,
    // The smoothing that settles the folds would also soak up a throw: it's eased off from a press until a moment after it flies.
    grabbed(held) {
      holding = held;
      flying = 1.2;
    },
    update(dt) {
      if (!holding) flying = Math.max(0, flying - dt);
      cloth.damping = holding || flying > 0 ? 0.02 : 0.2;
    },
    apply(v) {
      loop.gravity.y = -6 * v.gravity;
      // Silk at 0, the library demo's velvet at 0.25, stiff canvas at 1.
      cloth.bendCompliance = bendCompliance(v.thickness < 0.25 ? 0.8 + (0.25 - v.thickness) * 0.8 : 0.8 - ((v.thickness - 0.25) / 0.75) * 0.8);
      surface.visible = !v.showParticles;
      dots.visible = v.showParticles;
    },
    restart: () => sendParticlesAgain(particles),
    dispose() {
      velvet.dispose();
      (bunny.material as MeshStandardMaterial).dispose();
      obstacle.dispose();
      particles.dispose();
      loop.dispose();
    },
  };
}
