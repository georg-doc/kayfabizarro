---
kind: system
engine: three
---

# Particle physics

Liquid, jelly, cloth and smoke for three.js on the GPU, all from one library, and liquid, jelly and cloth all push on each other with nothing to set up.

The physics is [Three.js Particle Fluids](https://github.com/dgreenheck/threejs-particle-fluids) by Daniel Greenheck (MIT), which runs everything as particles in WebGPU compute shaders. In the live demo, choose a scene and grab things: throw the cloth off the bunny, fling a jelly bunny, push the water around, or hold to pour the honey where you point. Drag anywhere else to orbit and scroll to zoom.

Physics: Three.js Particle Fluids by Daniel Greenheck (MIT). Code here is MIT, and the art is CC0.

## What this owns

- **Renderer:** WebGPU, with no WebGL path: on `WebGLRenderer` the first `sim.step()` throws `computeAsync is not a function`. `new Simulation({ renderer, scene, camera, ... })` takes the renderer you pass, and `createParticleRenderer` in `vendor/threejs-particle-fluids/src/core/renderer.ts` makes one.
- **Frame loop:** It doesn't draw the frame. `await sim.step()` before your own `renderer.render(scene, camera)`. The simulation adds its meshes to your scene. Liquid reads the screen through three's viewport textures (`vendor/threejs-particle-fluids/src/render/viewport.ts`), and it has no render targets of its own.
- **three:** `package.json` pins 0.186.1, and the vendored copy runs on it. No other library has to match. Copied into a game it typechecks with no errors on `@types/three` 0.186.0 and `@webgpu/types` 0.1.74, with `allowImportingTsExtensions` on. On `@types/three` 0.180 it gave 233 lines of errors.
- **Copy:** `vendor/threejs-particle-fluids/`, importing from its `src/index.ts`.
- **WebGPU limits:** `createParticleRenderer` asks for `maxComputeInvocationsPerWorkgroup: 1024`, `maxComputeWorkgroupSizeX: 1024` and `maxStorageBuffersPerShaderStage: 10`, merged with any `requiredLimits` you pass it.
- **Elsewhere:** On clouds' and forests' renderers, which draw with several targets, the liquid didn't draw even with all limits merged, while a crate did (`copyFramebufferToTexture: Source and destination formats do not match`). It ran with no errors beside stylised-sky.

## Use it in your game

Copy `vendor/threejs-particle-fluids/` into your project and import from its `src/index.ts`. Don't install the npm package: it's pinned to three r184, and this copy runs on r186 (see below).

Make the renderer with `createParticleRenderer`, make a `Simulation`, add what you want, and call `sim.step()` before each draw. The simulation adds its own meshes to your scene.

```js
import { Box3, BoxGeometry, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, Vector3 } from 'three';
import { PMREMGenerator } from 'three/webgpu';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Simulation, createParticleRenderer } from './vendor/threejs-particle-fluids/src/index.ts';

const renderer = await createParticleRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.append(renderer.domElement);

const scene = new Scene();
// Liquid reflects the environment and takes its highlight from a directional light: without them it looks flat.
scene.environment = new PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
const sun = new DirectionalLight(0xffffff, 2);
sun.position.set(1, 3, 2);
scene.add(sun);
const camera = new PerspectiveCamera(40, innerWidth / innerHeight, 0.01, 50);
camera.position.set(1.6, 1.3, 2.1);
camera.lookAt(0, 0.3, 0);

const crate = new Mesh(new BoxGeometry(0.16, 0.16, 0.16), new MeshStandardMaterial({ color: 0xd9534f }));
crate.position.set(0, 0.6, 0);
scene.add(crate);

const sim = new Simulation({
  renderer,
  scene,
  camera,
  container: new Box3(new Vector3(-0.5, 0, -0.3), new Vector3(0.5, 0.9, 0.3)),
  particles: 5000, // shared by everything in it: sets the cost of each step
});
sim.addFluid({ box: new Box3(new Vector3(-0.5, 0, -0.3), new Vector3(0.5, 0.3, 0.3)) });
sim.addSoftbody({ mesh: crate, density: 400, softness: 0.4 }); // lighter than the water: it floats

async function frame() {
  await sim.step();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

Other things to add: `addCloth({ width, height, pin })`, `addSmoke()`, `addFloor()`, and obstacles with `addSphere`, `addBox`, `addCapsule` and `addMesh`. Give an obstacle `follow: someObject` and it moves with that object. The library's own docs are at [its repository](https://github.com/dgreenheck/threejs-particle-fluids/tree/main/docs#readme): the guide and an API reference for every class.

The demo's scenes use the lower-level API (`ParticleSystem`, `SimLoop`, `FluidSystem`), which `Simulation` is built on. Read `src/scenes/` for working examples of each material, and `src/app.ts` for these two:

- **Grabbing and throwing with the pointer:** `makeHand` is three small compute kernels that work on every material. `grab` notes which particles are near the press and where they are from it, and `hold` keeps those with the hand from then on. Going by distance alone doesn't work: a fast hand leaves what it held behind within a few frames. `pickParticles` finds the particle under the pointer.
- **Costing nothing at rest:** `checkRest` looks at the particles' speeds now and then. Once nearly all have stopped, the demo stops simulating and drawing until something changes.
- **Switching scenes without a stall:** `make` compiles a whole scene with three's `compileComputeAsync` and `compileAsync` while the old one keeps playing, and scenes that have been built are kept, so going back is instant. A `restart` sends the particles' first positions again, so it compiles nothing.

Start at 5,000 particles or fewer, and use the lowest count that looks good. Below 10,000, you can use fewer substeps too, since coarser particles move less of their width in each: `scaledSubsteps` in `src/scenes/shared.ts`.

## What it's bad at

- **It lives in its own world. It can't push a Rapier car.** Obstacles you give it can push the particles, so a car with a `follow` box makes a wave, but nothing comes back: the water can't lift or slow the car. Reading particles back to the CPU to work that out stalls the GPU, so keep it out of the frame loop. Solids from your physics engine and these particles don't feel each other both ways.
- **WebGPU only.** There's no WebGL fallback, so on a browser without WebGPU there's nothing to show. The demo says so in the frame.
- **It's a small tank, not an ocean.** Scenes here are a metre or two across. All particles share one size, so a big volume means coarse particles or a very high count.
- **It needs a machine with room to spare to stay smooth.** With every CPU core but two kept busy, a first visit to this demo took 10 s to load and stalled for up to 4.2 s.
- **Laptops struggle at 10,000 particles**, an Apple M1 Pro included, by the library's own account. Liquid and smoke are also drawn per pixel, so high-resolution screens cost more. **This demo has only been run on an RTX 4090.** It starts at 5,000 and steps down by itself when frames stay slow (sharpness, then ambient occlusion, then particles), but that hasn't been tried on a real laptop GPU.
- **Rebuilding on one renderer leaks unless you free it all.** `Simulation.dispose()` leaves the buffers of the fluid, soft-body, cloth and viscosity systems behind, because they have no `dispose`. The library's demo never notices: it makes a new renderer for each preset. If your game rebuilds simulations, copy `drop` from `src/app.ts`, which frees everything a scene's kernels are bound to.
- **Fixed after the start:** you can't add or remove anything once a simulation has started, the container can't move, cloth can only be a rectangle, and smoke needs its own `Simulation`, with one source each.
- **Real-time looks, not engineering.** Fast or thin obstacles can let particles through, and stiff bodies that hit each other fast can stick together. More substeps help both, at a cost.
- **Very soft bodies don't keep their shape.** The softest jelly bunny at the default setting really does flop over. Thin parts, such as a neck under a big head, bend first.
- **Clear water can look dark at a low angle.** It reflects a dark backdrop there, as behind the ducks. Light your scene, or turn off `surface.reflections`.

## Three r186

The library says it works with r184 only. It's vendored here and runs on r186.1: it typechecks with `@types/three` 0.186.0, and 161 of its 163 GPU tests pass on an RTX 4090 (1 is skipped), both with and without Patch's first two fixes. The one failure is a tolerance, `1.157e-3` against a limit of `1e-3` in a soft-body test, and it's the same number on r184, so r186 didn't cause it. r186 also adds `compileComputeAsync`, which is how this demo switches scenes without stalling. Details are in `vendor/threejs-particle-fluids/VENDOR.md`.

The fixes matter if you keep one renderer, as a game does, and when loading. The library's demo makes a new renderer for each preset, which hid a leak of full-screen textures every time a liquid or smoke was rebuilt. Skinning or filling a detailed mesh also took seconds. Use the copy here, not the npm package.

## Controls

For people: **Scene**, **Particles**, **Thickness**, **Gravity** and **Speed**, with **Play again** and **Reset**. For agents, in `recipe.json` with their ranges: **Push**, **Surface tension**, **Show the particles** and **Reflections**.

Thickness is one control that means the same thing in every scene: water to syrup, loose jelly to rubber, silk to canvas, thin smoke to thick. Gravity at none stops the smoke rising too, because hot air only rises when gravity pulls the cool air down.

## The bunny

The library's demo uses the Stanford bunny, which isn't under an open licence, so it isn't here, in the demo or in this repo's history. The bunny here is made from nothing by `make-bunny.mjs`: rounded shapes blended into one body, turned into a closed mesh. It's CC0.

## Building it

```bash
npm install
npm run build
```

`dist/` is the demo, with `index.html` at the top. `node make-bunny.mjs` rebuilds the bunny, and `make-thumbs.mjs` and `make-cover.mjs` retake the pictures. Where every file came from is in `LICENCE-NOTES.md`.
