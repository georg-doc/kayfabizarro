// The demo's world: one renderer for the whole visit, the studio around the simulation, the view, the hand that pushes
// things, and swapping scenes without a stall. The studio and the post pass are from the library's demo (demo/runtime/
// world.ts, MIT, Daniel Greenheck).
import { ACESFilmicToneMapping, DirectionalLight, Fog, Group, HemisphereLight, PerspectiveCamera, Ray, Scene, Vector2, Vector3, type Object3D } from 'three';
import { PMREMGenerator, RenderPipeline, type Node, type RTTNode, type WebGPURenderer } from 'three/webgpu';
import { Fn, If, float, instanceIndex, instancedArray, pass, renderOutput, rtt, uniform, vec3, vec4 } from 'three/tsl';
import { ao } from 'three/addons/tsl/display/GTAONode.js';
import { denoise } from 'three/addons/tsl/display/DenoiseNode.js';
import { fxaa } from 'three/addons/tsl/display/FXAANode.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FrameStepper, type ParticleSystem } from 'threejs-particle-fluids';
import type { Assets } from './assets.ts';
import { backdrop, disposeObjects, floor } from './stage.ts';
import { buildDamBreak, buildDucks, buildHoney } from './scenes/liquids.ts';
import { buildDrape, buildJelly } from './scenes/solids.ts';
import { buildSmoke } from './scenes/smoke.ts';
import type { BuildContext, Values, World } from './scenes/shared.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export interface SceneDef {
  id: string;
  name: string;
  /** How the view starts: yaw, pitch, distance and what it looks at. */
  view: { yaw: number; pitch: number; distance: number; target: readonly [number, number, number] };
  /** What a press does here, for the line in the corner. */
  tip: string;
  build(ctx: BuildContext): Promise<World> | World;
}

const view = (position: readonly [number, number, number], target: readonly [number, number, number]) => {
  const d = new Vector3(...position).sub(new Vector3(...target));
  return { yaw: Math.atan2(d.x, d.z), pitch: Math.asin(d.y / d.length()), distance: d.length(), target };
};
const PUSH = 'Drag the water to push it · drag anywhere else to orbit · scroll to zoom';
export const SCENES: readonly SceneDef[] = [
  { id: 'dam-break', name: 'Dam break', view: view([2.2, 1.7, 2.6], [0, 0.3, 0]), tip: PUSH, build: buildDamBreak },
  { id: 'ducks', name: 'Floating ducks', view: view([1.95, 1.5, 2.8], [0, 0.35, 0]), tip: 'Grab a duck or the water and throw · drag anywhere else to orbit · scroll to zoom', build: buildDucks },
  { id: 'honey', name: 'Honey pour', view: view([1.5, 1.2, 2.2], [0, 0.32, 0]), tip: 'Hold in the tank to pour there · drag outside it to orbit · scroll to zoom', build: buildHoney },
  { id: 'jelly', name: 'Jelly bunnies', view: view([0.9, 0.85, 2.75], [0, 0.26, 0]), tip: 'Grab a bunny and throw it · drag anywhere else to orbit · scroll to zoom', build: buildJelly },
  { id: 'drape', name: 'Velvet drape', view: view([1.55, 1.25, 2.1], [0, 0.22, 0]), tip: 'Grab the cloth and throw it · drag anywhere else to orbit · scroll to zoom', build: buildDrape },
  { id: 'smoke', name: 'Smoke plume', view: view([1.85, 1.3, 2.55], [0, 0.72, 0]), tip: 'Press or drag in the column to puff and stir · drag outside it to orbit · scroll to zoom', build: buildSmoke },
];

const key = (id: string, particles: number) => `${id}:${particles}`;
/** Slower than this, in m/s, counts as stopped; and asleep is when less than this share of the particles are moving. */
const REST_SPEED = 0.03, REST_SHARE = 0.01;
/** How hard a grip pulls what it holds towards the hand, in m/s for each metre away. */
const GRAB_PULL = 16;
/** The fastest a throw sends anything, m/s. */
const MOST_SPEED = 10;
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
let lastBreath = 0;
/** Lets the page draw if it's been working for more than a few ms: long CPU work is split up with this. A new task, not a frame, so it costs nothing when there's no need. */
async function breathe(): Promise<void> {
  if (performance.now() - lastBreath < 6) return;
  await new Promise<void>((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => resolve();
    channel.port2.postMessage(0);
  });
  lastBreath = performance.now();
}
/** A GPU promise, or nothing after a while. A promise that never comes back mustn't stop the demo's frames for good. */
const notForever = <T>(promise: Promise<T>, ms = 2500): Promise<T | undefined> => Promise.race([promise, new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), ms))]);

/**
 * Velocity kernels for one scene's particles. `kernel` pushes what's near the hand outward and carries it along. `grab` notes
 * what's near the hand and where it is from the hand, and `hold` then keeps that with the hand, however far or fast the hand
 * goes: going by distance alone, a fast hand leaves what it held behind within a few frames. Let go, and it flies on.
 */
function makeHand(particles: ParticleSystem) {
  const at = uniform(new Vector3());
  const reach = uniform(0.2, 'float');
  const burst = uniform(0, 'float');
  const carry = uniform(0, 'float');
  const moving = uniform(new Vector3());
  const grip = uniform(0, 'float');
  const pull = uniform(GRAB_PULL, 'float');
  const held = instancedArray(particles.capacity, 'vec4');
  const falloffAt = (r: Any): Any => {
    const w: Any = r.div(reach).oneMinus().clamp(0, 1).toVar();
    return w.mul(w).mul(w.mul(-2).add(3));
  };
  const kernel = Fn(() => {
    const i: Any = instanceIndex;
    If((particles.invMass.element(i) as Any).greaterThan(0), () => {
      const velocity: Any = particles.velocities.element(i);
      const d: Any = (particles.positions.element(i) as Any).xyz.sub(at).toVar();
      const r: Any = d.length().toVar();
      const falloff: Any = falloffAt(r).toVar();
      const out: Any = d.div(r.max(1e-4)).add(vec3(0, 0.55, 0));
      const next: Any = velocity.xyz.add(out.mul(burst).mul(falloff)).toVar();
      next.addAssign(moving.sub(next).mul(carry).mul(falloff));
      velocity.assign(vec4(next, velocity.w));
    });
  })().compute(particles.capacity);
  const grab = Fn(() => {
    const i: Any = instanceIndex;
    const d: Any = (particles.positions.element(i) as Any).xyz.sub(at).toVar();
    const weight: Any = (particles.invMass.element(i) as Any).greaterThan(0).select(falloffAt(d.length()), float(0));
    (held.element(i) as Any).assign(vec4(d, weight));
  })().compute(particles.capacity);
  const hold = Fn(() => {
    const i: Any = instanceIndex;
    const h: Any = (held.element(i) as Any).toVar();
    If(h.w.greaterThan(0), () => {
      const velocity: Any = particles.velocities.element(i);
      // Towards its place by the hand, moving as the hand moves.
      const wanted: Any = moving.add(at.add(h.xyz).sub((particles.positions.element(i) as Any).xyz).mul(pull)).toVar();
      const next: Any = velocity.xyz.add(wanted.sub(velocity.xyz).mul(grip.mul(h.w))).toVar();
      // Hard throws stay within what the solver can hold together.
      next.mulAssign(float(MOST_SPEED).div(next.length().max(MOST_SPEED)));
      velocity.assign(vec4(next, velocity.w));
    });
  })().compute(particles.capacity);
  return { at, reach, burst, carry, moving, grip, pull, kernel, grab, hold };
}

interface Live {
  def: SceneDef;
  world: World;
  root: Group;
  hand: ReturnType<typeof makeHand>;
  /** Every compute kernel it runs, so they can be freed with it. */
  kernels: Set<Any>;
}

export class App {
  readonly scene = new Scene();
  readonly camera = new PerspectiveCamera(38, 1, 0.02, 100);
  readonly orbit = { yaw: 0, pitch: 0.4, distance: 3, target: new Vector3(), want: { yaw: 0, pitch: 0.4, distance: 3, target: new Vector3() } };
  values: Values = { gravity: 1, thickness: 0.25, push: 1, tension: 1, showParticles: false, reflections: true };
  speed = 1;
  live: Live | undefined;
  /** Worst frame, for tests. */
  worst = 0;
  /** Where each build's time went, in ms. */
  builds: { scene: string; particles: number; build: number; kernels: number; compute: number; objects: number; objectCount: number }[] = [];
  /** The time a frame took lately, smoothed, and how much the quality has stepped down for it. */
  frameMs = 16;
  tier = 0;
  onTierDown: (() => void) | undefined;
  onBusy: ((name: string | null) => void) | undefined;

  private post!: RenderPipeline;
  private plain!: RenderPipeline;
  private aoTarget!: RTTNode;
  private scenePass!: ReturnType<typeof pass>;
  private stepper = new FrameStepper({ fixedDt: 1 / 60, maxStepsPerFrame: 2 });
  private time = 0;
  private visible = true;
  private ambientOcclusion = true;
  private width = 1;
  private height = 1;
  private pendingShow: Live | undefined;
  private wanted = 0;
  private building: Promise<void> = Promise.resolve();
  private slow = 0;
  private fast = 0;
  /** How many builds are under way. */
  private busy = 0;
  /** The press in progress. */
  private press: { kind: 'orbit' | 'hand'; x: number; y: number; depth?: Vector3; moved: boolean; lastAt?: Vector3; lastTime?: number } | undefined;
  private pendingPress: Vector2 | undefined;
  private quickRelease = false;
  private handNow: { at: Vector3; moving: Vector3 } | undefined;
  private assets!: Assets;
  /** Everything's at rest, so it isn't simulating. */
  asleep = false;
  private dirty = true;
  private calmChecks = 0;
  private framesSinceCheck = 0;
  private checking = false;
  private sinceWoke = 0;
  /** The share of particles moving at the last look, for tests. */
  restShare = 1;
  private pool = new Map<string, Live>();
  private level = 0;
  private buildingRest = false;
  private running = false;
  private onShown: (() => void) | undefined;
  /** Built scenes whose objects have never been drawn. */
  private toDraw: { live: Live; objects: Object3D[]; finished: Promise<void>; done(): void }[] = [];
  /** Scenes to free, one a frame: all at once is a slow frame. */
  private toDrop: Live[] = [];

  constructor(readonly renderer: WebGPURenderer, readonly canvas: HTMLCanvasElement) {}

  async init(assets: Assets): Promise<void> {
    this.assets = assets;
    const { renderer, scene, camera } = this;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    scene.background = backdrop;
    scene.fog = new Fog(backdrop, 4, 10);
    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(room, 0.04).texture;
    scene.environmentIntensity = 0.45;
    room.dispose();
    pmrem.dispose();
    scene.add(new HemisphereLight(0xd7e6ff, 0x111721, 0.65));
    const key = new DirectionalLight(0xf8f1e5, 2.5);
    key.position.set(1.5, 4, 2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -2;
    key.shadow.camera.right = key.shadow.camera.top = 2;
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 9;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.012;
    const rim = new DirectionalLight(0xa4c4ff, 1.5);
    rim.position.set(-2, 2.5, -2);
    scene.add(key, rim, floor());
    this.width = this.canvas.clientWidth || innerWidth;
    this.height = this.canvas.clientHeight || innerHeight;
    this.setSize();

    // Normals are rebuilt from depth, so shaders need no extra output. Half-resolution ambient occlusion and edge-aware
    // filtering keep the cost modest; FXAA runs after tone mapping to smooth silhouettes.
    const scenePass = pass(scene, camera, { samples: 1 });
    this.scenePass = scenePass;
    const color = scenePass.getTextureNode('output');
    const depth = scenePass.getTextureNode('depth');
    const occlusion = ao(depth, null as unknown as Node, camera);
    occlusion.resolutionScale = 0.5;
    occlusion.radius.value = 0.15;
    occlusion.thickness.value = 0.12;
    occlusion.samples.value = 12;
    occlusion.scale.value = 1.1;
    const filtered = denoise(occlusion.getTextureNode(), depth, null as unknown as Node, camera);
    filtered.radius.value = 3;
    filtered.depthPhi.value = 0.05;
    this.aoTarget = rtt(filtered as unknown as Node<'vec4'>, 1, 1);
    this.sizeAo();
    this.post = new RenderPipeline(renderer);
    const composite = vec4((color as Any).rgb.mul((this.aoTarget as Any).r.mul(0.7).add(0.3)), (color as Any).a);
    const display = rtt(renderOutput(composite, renderer.toneMapping, renderer.outputColorSpace));
    this.post.outputColorTransform = false;
    this.post.outputNode = fxaa(display);
    // The same scene pass without ambient occlusion, for slow machines. It's the same pass so that nothing recompiles when
    // quality steps down: only this last, small step differs.
    this.plain = new RenderPipeline(renderer);
    this.plain.outputColorTransform = false;
    this.plain.outputNode = fxaa(rtt(renderOutput(color as unknown as Node<'vec4'>, renderer.toneMapping, renderer.outputColorSpace)));

    this.listen();
    new ResizeObserver(() => {
      this.width = this.canvas.clientWidth || innerWidth;
      this.height = this.canvas.clientHeight || innerHeight;
    }).observe(this.canvas);
  }

  get def(): SceneDef | undefined {
    return this.live?.def;
  }

  private setSize(): void {
    // A budget as well as a ratio: past this, more pixels cost a lot and FXAA hides the difference.
    const budget = [2.6e6, 1.6e6, 1.6e6, 1e6][this.tier]!;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, [1.5, 1, 1, 0.75][this.tier]!, Math.sqrt(budget / Math.max(1, this.width * this.height))));
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    // Keeps the whole scene in frame in tall windows.
    this.camera.fov = (2 * Math.atan(Math.tan((19 * Math.PI) / 180) * Math.max(1, 1.15 / this.camera.aspect)) * 180) / Math.PI;
    this.camera.updateProjectionMatrix();
    this.sizeAo();
    this.dirty = true;
  }

  private sizeAo(): void {
    if (!this.aoTarget) return;
    const size = this.renderer.getDrawingBufferSize(new Vector2());
    this.aoTarget.setSize(Math.max(1, Math.floor(size.x / 2)), Math.max(1, Math.floor(size.y / 2)));
  }

  /**
   * Builds a scene and compiles everything it will run, without touching what's on screen: what's playing keeps playing
   * until the new one is ready. Every kernel and pipeline goes through three's async compile, so nothing stalls a frame.
   */
  private async make(def: SceneDef, particles: number): Promise<Live> {
    const { renderer, scene, camera, values, assets } = this;
    const ctx: BuildContext = { renderer, scene, camera, particles, values, assets, breathe };
    const t0 = performance.now();
    const world = await def.build(ctx);
    await breathe();
    const t1 = performance.now();
    world.apply(values);
    const hand = makeHand(world.particles);
    const root = new Group();
    root.add(...world.objects);
    // Every kernel a frame runs: a frame's calls, caught instead of run. The step and the update are then as if they never happened.
    const kernels = new Set<Any>([hand.kernel, ...(world.grip ? [hand.grab, hand.hold] : []), ...(world.occasional ?? [])]);
    const real = renderer.compute;
    renderer.compute = ((nodes: Any) => {
      for (const node of Array.isArray(nodes) ? nodes : [nodes]) kernels.add(node);
    }) as typeof renderer.compute;
    try {
      await world.loop.step(1 / 60);
      await world.prepareRender?.();
    } finally {
      renderer.compute = real;
    }
    const loop = world.loop as unknown as { initialized: boolean };
    loop.initialized = false;
    world.rearm?.();
    // Their shaders are written one at a time here, and then all the GPU's compiles go at once: it does them side by side.
    const nodes = (renderer as unknown as { _nodes: { getForComputeAsync(node: unknown): Promise<unknown> } })._nodes;
    for (const kernel of kernels) {
      await nodes.getForComputeAsync(kernel);
      await breathe();
    }
    await Promise.all([...kernels].map((kernel) => renderer.compileComputeAsync(kernel)));
    await breathe();
    const t2 = performance.now();
    // The objects, for the pass that really draws them, one at a time: a scene's worth in one go is a slow frame.
    const objects: Object3D[] = root.children.filter((object) => object.visible);
    for (const object of objects) {
      const before = renderer.getRenderTarget();
      renderer.setRenderTarget(this.scenePass.renderTarget);
      const compiling = renderer.compileAsync(object, camera, scene);
      renderer.setRenderTarget(before);
      await compiling;
      await breathe();
    }
    this.builds.push({ scene: def.id, particles, build: Math.round(t1 - t0), kernels: kernels.size, compute: Math.round(t2 - t1), objects: Math.round(performance.now() - t2), objectCount: objects.length });
    return { def, world, root, hand, kernels };
  }

  /**
   * Frees a scene. The library's fluid, soft-body, cloth and viscosity systems have no dispose of their own (its demo makes
   * a new renderer for every preset), so everything the scene's kernels are bound to is released here. Nothing's shared
   * between scenes but the shared meshes' materials and geometry, which aren't storage buffers.
   */
  private drop(live: Live): void {
    const { renderer } = this;
    const internals = renderer as unknown as { _bindings: { getForCompute(node: unknown): { bindings: { attribute?: object }[] }[] }; _attributes: { delete(attribute: object): unknown }; backend: { get(o: object): { buffer?: unknown } } };
    const buffers = new Set<object>();
    for (const kernel of live.kernels) {
      for (const group of internals._bindings.getForCompute(kernel)) {
        for (const binding of group.bindings) if (binding.attribute) buffers.add(binding.attribute);
      }
    }
    live.root.removeFromParent();
    live.world.dispose();
    // (What the scene doesn't own stays: the duck's material and the bunny's mesh, which every scene shares)
    disposeObjects(live.world.objects.filter((o) => !o.userData.shared));
    for (const kernel of live.kernels) kernel.dispose?.();
    live.kernels.clear();
    for (const buffer of buffers) if (internals.backend.get(buffer).buffer !== undefined) internals._attributes.delete(buffer);
  }

  /**
   * Shows a scene as soon as it's built, and at once if it already is. Built scenes are kept, so going back to one is
   * instant and compiles nothing. Only the last one asked for shows, however fast they're asked for.
   */
  request(def: SceneDef, particles: number, then?: () => void): Promise<void> {
    const ticket = ++this.wanted;
    this.level = particles;
    const show = (live: Live) => {
      this.pendingShow = live;
      this.onShown = then;
      this.onBusy?.(null);
    };
    const kept = this.pool.get(key(def.id, particles));
    if (kept && !this.toDraw.some((job) => job.live === kept)) {
      show(kept);
      return Promise.resolve();
    }
    this.onBusy?.(def.name);
    this.building = this.building.then(async () => {
      if (ticket !== this.wanted) return;
      const live = await this.keep(def, particles);
      // Not shown until it's been drawn ahead: its first draw would stall the frame it's shown in.
      await this.drawnAhead(live);
      if (ticket === this.wanted) show(live);
    });
    return this.building;
  }

  private async keep(def: SceneDef, particles: number): Promise<Live> {
    const k = key(def.id, particles);
    const kept = this.pool.get(k);
    if (kept) return kept;
    this.busy++;
    const live = await this.make(def, particles).finally(() => this.busy--);
    this.pool.set(k, live);
    // (Before the demo runs there's nobody to see a stall, and no frames to do this in)
    if (this.running) {
      let done = () => {};
      const finished = new Promise<void>((resolve) => {
        done = resolve;
      });
      this.toDraw.push({ live, objects: live.root.children.filter((object) => object.visible), finished, done });
    }
    return live;
  }

  /** When a built scene has been drawn ahead. It goes first in the line, since someone's waiting for it. */
  private drawnAhead(live: Live): Promise<void> {
    const at = this.toDraw.findIndex((job) => job.live === live);
    if (at < 0) return Promise.resolve();
    const [job] = this.toDraw.splice(at, 1);
    this.toDraw.unshift(job!);
    return job!.finished;
  }

  /** Builds the scenes nobody has asked for yet, one at a time behind whatever's playing, so they're there when someone does. */
  async buildTheRest(): Promise<void> {
    if (this.buildingRest) return;
    this.buildingRest = true;
    for (;;) {
      await this.building;
      const level = this.level;
      const next = SCENES.find((def) => !this.pool.has(key(def.id, level)));
      if (!next) break;
      // One at a time, each drawn ahead before the next starts.
      while (this.toDraw.length) await nextFrame();
      await nextFrame();
      if (!this.visible) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      this.building = this.building.then(async () => {
        await this.keep(next, this.level);
      });
    }
    this.buildingRest = false;
  }

  /** Back to the scene's first moment, keeping every setting. */
  replay(): void {
    if (!this.live) return;
    this.live.world.restart();
    (this.live.world.loop as unknown as { initialized: boolean }).initialized = false;
    this.time = 0;
    this.stepper.reset();
    this.wake();
  }

  resetView(def: SceneDef): void {
    const o = this.orbit;
    const v = def.view;
    Object.assign(o.want, { yaw: v.yaw, pitch: v.pitch, distance: v.distance });
    o.want.target.set(...v.target);
    Object.assign(o, { yaw: v.yaw, pitch: v.pitch, distance: v.distance });
    o.target.set(...v.target);
    this.placeCamera();
    this.dirty = true;
  }

  private placeCamera(): void {
    const o = this.orbit;
    const c = Math.cos(o.pitch);
    this.camera.position.set(o.target.x + Math.sin(o.yaw) * c * o.distance, o.target.y + Math.sin(o.pitch) * o.distance, o.target.z + Math.cos(o.yaw) * c * o.distance);
    this.camera.lookAt(o.target);
    this.camera.updateMatrixWorld();
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.stepper.reset();
    this.dirty = true;
  }

  setValues(values: Partial<Values>): void {
    Object.assign(this.values, values);
    this.live?.world.apply(this.values);
    this.wake();
  }

  /** Runs frames for good, and starts building the other scenes behind the first. */
  start(): void {
    this.running = true;
    void this.buildTheRest();
    const tick = async (now: number) => {
      try {
        await this.frame(now);
      } catch (error) {
        console.error(error);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /** Draws the current scene once with the simulation held, for the warm-up. */
  async still(): Promise<void> {
    await this.frame(performance.now(), true);
  }

  private last = 0;
  private async frame(now: number, held = false): Promise<void> {
    const elapsed = this.last ? now - this.last : 16;
    this.last = now;
    if (!this.visible) {
      this.stepper.reset();
      return;
    }
    if (this.pendingShow) this.swap(this.pendingShow);
    const live = this.live;
    if (!live) return;
    const size = this.renderer.getSize(new Vector2());
    if (size.x !== this.width || size.y !== this.height) this.setSize();
    const moved = this.updateView(elapsed);
    const { world } = live;
    // A press: where it landed, then what it does.
    if (this.pendingPress && this.press?.kind === 'hand') {
      const uv = this.pendingPress;
      this.pendingPress = undefined;
      this.wake();
      const picked = world.pick ? await notForever(world.pick(uv)) : world.grip ? await notForever(this.pickParticles(world, uv)) : null;
      if (picked || !world.exact) await this.pressAt(live, uv, picked ?? null);
      // It missed: a drag from empty space orbits, as anywhere else.
      else if (this.press) this.press.kind = 'orbit';
      if (this.quickRelease) this.letGo();
    }
    // Everything has come to rest: nothing to simulate, and nothing to draw unless the view moves.
    const sleeping = this.asleep && !held;
    if (!held && !sleeping) {
      await this.stepper.pump(now, async (dt) => {
        const step = dt * this.speed;
        if (this.handNow) await this.push(live, 0);
        await world.update?.(step, this.time);
        await world.loop.step(step);
        this.time += step;
      });
      this.checkRest(world);
    }
    if (sleeping && !moved && !this.dirty && !this.toDraw.length) {
      this.afterFrame(elapsed, held);
      return;
    }
    this.dirty = false;
    if (!sleeping) await world.prepareRender?.();
    if (!held && !this.toDrop.length) this.drawOneAhead();
    this.draw();
    await notForever((this.renderer.backend as Any).device?.queue.onSubmittedWorkDone());
    this.afterFrame(elapsed, held);
  }

  private afterFrame(elapsed: number, held: boolean): void {
    if (held) return;
    this.judge(elapsed);
    const finished = this.toDrop.shift();
    if (finished) this.drop(finished);
  }

  private wake(): void {
    this.asleep = false;
    this.calmChecks = 0;
    this.sinceWoke = performance.now();
  }

  /**
   * Now and then, asks how fast things are moving. Once nearly everything has stopped, for a while, the demo stops simulating
   * and drawing until something changes. A still scene then costs the machine nothing, and looks the same, as nothing was moving.
   */
  private checkRest(world: World): void {
    if (this.checking || this.handNow || this.press || world.restless?.() || performance.now() - this.sinceWoke < 2500) return;
    if (++this.framesSinceCheck < 20) return;
    this.framesSinceCheck = 0;
    this.checking = true;
    const particles = world.particles;
    const buffer = particles.velocities.value;
    notForever(this.renderer.getArrayBufferAsync(buffer))
      .then((bytes) => {
        if (!bytes || this.live?.world !== world) return;
        const v = new Float32Array(bytes);
        let moving = 0;
        for (let i = 0; i < v.length; i += 4) if (v[i]! * v[i]! + v[i + 1]! * v[i + 1]! + v[i + 2]! * v[i + 2]! > REST_SPEED * REST_SPEED) moving++;
        this.restShare = moving / particles.capacity;
        this.calmChecks = this.restShare < REST_SHARE ? this.calmChecks + 1 : 0;
        if (this.calmChecks >= 3) this.asleep = true;
      })
      .catch(() => {})
      .finally(() => {
        this.checking = false;
      });
  }

  /** The particle nearest the camera under a point on screen, or nothing. */
  private async pickParticles(world: World, uv: Vector2): Promise<Vector3 | null> {
    const ray = this.ray(uv);
    const p = new Float32Array(await this.renderer.getArrayBufferAsync(world.particles.positions.value));
    const near = Math.max(0.03, world.particles.particleRadius * 2.5) ** 2;
    const o = ray.origin, d = ray.direction;
    let best = -1, bestT = Infinity;
    for (let i = 0; i < p.length; i += 4) {
      const x = p[i]! - o.x, y = p[i + 1]! - o.y, z = p[i + 2]! - o.z;
      const t = x * d.x + y * d.y + z * d.z;
      if (t <= 0 || t >= bestT) continue;
      const off = x * x + y * y + z * z - t * t;
      if (off < near) {
        bestT = t;
        best = i;
      }
    }
    return best < 0 ? null : new Vector3(p[best], p[best + 1], p[best + 2]);
  }

  /**
   * An object's first real draw builds what the async compile can't reach, such as its shadow programs, on the spot: over
   * 100 ms for a soft body. So a kept scene's objects are drawn once ahead, one a frame, through the same pass as a real
   * draw (three's programs are keyed by it), and just before that frame's real draw, which overwrites it in the same task.
   */
  private drawOneAhead(): void {
    const job = this.toDraw[0];
    if (!job) return;
    const { live } = job;
    const current = this.live;
    const object = job.objects.pop();
    if (!object || live === current || this.pool.get(key(live.def.id, this.level)) !== live) {
      this.toDraw.shift();
      job.done();
      return;
    }
    const wasVisible = live.root.children.map((child) => child.visible);
    for (const child of live.root.children) child.visible = child === object;
    if (current) current.root.visible = false;
    this.scene.add(live.root);
    this.draw();
    // three renders a scene pass once a frame: without a new frame now, the real draw would reuse this one, and it would be seen.
    (this.renderer as unknown as { _nodes: { nodeFrame: { update(): void } } })._nodes.nodeFrame.update();
    live.root.removeFromParent();
    if (current) current.root.visible = true;
    live.root.children.forEach((child, i) => {
      child.visible = wasVisible[i]!;
    });
  }

  private draw(): void {
    (this.ambientOcclusion ? this.post : this.plain).render();
  }

  /** Draws once without ambient occlusion, under the cover, so stepping down to it later compiles nothing. */
  async warmPlainPass(): Promise<void> {
    this.ambientOcclusion = false;
    await this.still();
    this.ambientOcclusion = true;
  }

  private swap(live: Live): void {
    const old = this.live;
    this.pendingShow = undefined;
    this.live = live;
    old?.root.removeFromParent();
    this.scene.add(live.root);
    live.world.apply(this.values);
    this.replay();
    this.press = undefined;
    this.handNow = undefined;
    this.pendingPress = undefined;
    this.quickRelease = false;
    if (old?.def !== live.def) this.resetView(live.def);
    // Only one particle count is kept: this one.
    for (const [k, kept] of this.pool) {
      if (!k.endsWith(`:${this.level}`) && kept !== live) {
        this.pool.delete(k);
        this.toDrop.push(kept);
      }
    }
    const then = this.onShown;
    this.onShown = undefined;
    then?.();
    if (this.running) void this.buildTheRest();
  }

  /**
   * Steps quality down when frames stay slow: sharpness first, then ambient occlusion, then particles. And back up when
   * they stay fast, since a slow spell may have been something else on the machine. Frames while a scene builds don't count.
   */
  private judge(elapsed: number): void {
    if (elapsed > 500) return;
    this.worst = Math.max(this.worst, elapsed);
    if (this.toDraw.length || this.toDrop.length || this.busy) {
      this.slow = this.fast = 0;
      return;
    }
    this.frameMs += (elapsed - this.frameMs) * 0.05;
    this.slow = this.frameMs > 42 ? this.slow + elapsed : 0;
    this.fast = this.frameMs < 20 ? this.fast + elapsed : 0;
    if (this.fast > 8000 && this.tier > 0) {
      this.fast = 0;
      this.tier--;
      this.ambientOcclusion = this.tier < 2;
      this.setSize();
    }
    if (this.slow < 3000) return;
    this.slow = 0;
    this.frameMs = 20;
    if (this.tier < 3) {
      this.tier++;
      this.ambientOcclusion = this.tier < 2;
      this.setSize();
      console.info(`[particle-physics] slow frames: quality tier ${this.tier}`);
    } else this.onTierDown?.();
  }

  /** Dispatches the hand: at a press, an outward burst, and what's near it taken hold of; after that, what it holds or stirs goes with it. */
  private async push(live: Live, burst: number): Promise<void> {
    const { hand, world } = live;
    const now = this.handNow;
    if (!now) return;
    hand.at.value.copy(now.at);
    hand.moving.value.copy(now.moving);
    hand.reach.value = world.reach;
    hand.burst.value = burst;
    const push = Math.min(1, this.values.push);
    if (world.grip) {
      if (burst > 0) {
        hand.carry.value = 0;
        await this.renderer.computeAsync([hand.grab, hand.kernel]);
        return;
      }
      hand.grip.value = world.grip * push;
      await this.renderer.computeAsync(hand.hold);
      return;
    }
    // Only a moving hand carries things along: a still one would hold them back.
    hand.carry.value = burst > 0 ? 0 : 0.4 * push * Math.min(1, now.moving.length() / 0.5);
    await this.renderer.computeAsync(hand.kernel);
  }

  private ray(uv: Vector2): Ray {
    this.camera.updateMatrixWorld();
    const origin = new Vector3().setFromMatrixPosition(this.camera.matrixWorld);
    const direction = new Vector3(uv.x * 2 - 1, 1 - uv.y * 2, 0.5).unproject(this.camera).sub(origin).normalize();
    return new Ray(origin, direction);
  }

  private uv(event: PointerEvent): Vector2 {
    const rect = this.canvas.getBoundingClientRect();
    return new Vector2((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
  }

  /** The middle of what the ray crosses of the scene's press area, or nothing if it misses. */
  private inFocus(uv: Vector2): Vector3 | null {
    const world = this.live?.world;
    if (!world) return null;
    const ray = this.ray(uv);
    const enter = ray.intersectBox(world.focus, new Vector3());
    if (!enter) return null;
    const out = new Ray(ray.at(50, new Vector3()), ray.direction.clone().negate()).intersectBox(world.focus, new Vector3());
    return out ? enter.lerp(out, 0.5) : enter;
  }

  private async pressAt(live: Live, uv: Vector2, picked: Vector3 | null): Promise<void> {
    const press = this.press;
    if (!press) return;
    const point = picked ?? this.inFocus(uv);
    if (!point) return;
    press.depth = point.clone();
    if (live.world.press?.(point)) return;
    live.world.grabbed?.(true);
    this.handNow = { at: point.clone(), moving: new Vector3() };
    await this.push(live, live.world.strength * this.values.push);
  }

  private dragTo(uv: Vector2, time: number): void {
    const press = this.press;
    const world = this.live?.world;
    if (!press?.depth || !world) return;
    // The plane through the first point, facing the camera.
    const normal = this.camera.getWorldDirection(new Vector3());
    const ray = this.ray(uv);
    const t = press.depth.clone().sub(ray.origin).dot(normal) / ray.direction.dot(normal);
    if (!(t > 0)) return;
    const at = ray.at(t, new Vector3());
    world.moved?.(at);
    if (!this.handNow) return;
    const dt = Math.max(1e-3, (time - (press.lastTime ?? time - 16)) / 1000);
    const moving = at.clone().sub(this.handNow.at).divideScalar(dt);
    if (moving.length() > 8) moving.setLength(8);
    this.handNow.moving.lerp(moving, 0.6);
    this.handNow.at.copy(at);
    press.lastTime = time;
  }

  private listen(): void {
    const c = this.canvas;
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    c.addEventListener('pointerdown', (e) => {
      c.focus();
      c.setPointerCapture(e.pointerId);
      const uv = this.uv(e);
      const hand = e.button === 0 && !!this.inFocus(uv) && !!this.live;
      this.press = { kind: hand ? 'hand' : 'orbit', x: e.clientX, y: e.clientY, moved: false, lastTime: performance.now() };
      if (hand) this.pendingPress = uv;
      c.classList.toggle('drag', !hand);
    });
    c.addEventListener('pointermove', (e) => {
      const press = this.press;
      if (!press) {
        c.classList.toggle('over', !!this.inFocus(this.uv(e)));
        return;
      }
      if (press.kind === 'orbit') {
        const o = this.orbit.want;
        o.yaw -= (e.clientX - press.x) * 0.006;
        o.pitch = Math.max(0.02, Math.min(1.45, o.pitch + (e.clientY - press.y) * 0.005));
        press.x = e.clientX;
        press.y = e.clientY;
      } else this.dragTo(this.uv(e), performance.now());
    });
    const up = () => {
      c.classList.remove('drag');
      // A press let go before its frame still counts: that frame handles it, then lets go.
      if (this.pendingPress) this.quickRelease = true;
      else this.letGo();
    };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const o = this.orbit.want;
        o.distance = Math.max(0.8, Math.min(8, o.distance * Math.exp(e.deltaY * 0.001)));
      },
      { passive: false },
    );
  }

  private letGo(): void {
    if (this.press?.kind === 'hand') {
      this.live?.world.released?.();
      this.live?.world.grabbed?.(false);
    }
    this.press = undefined;
    this.handNow = undefined;
    this.pendingPress = undefined;
    this.quickRelease = false;
  }

  /** Eases the view, and says whether it moved. */
  private updateView(elapsed: number): boolean {
    const o = this.orbit;
    const k = 1 - Math.exp(-elapsed / 60);
    const before = o.yaw + o.pitch * 7 + o.distance * 13 + o.target.x * 17 + o.target.y * 19 + o.target.z * 23;
    o.yaw += (o.want.yaw - o.yaw) * k;
    o.pitch += (o.want.pitch - o.pitch) * k;
    o.distance += (o.want.distance - o.distance) * k;
    o.target.lerp(o.want.target, k);
    this.placeCamera();
    // A held hand slows to a stop with the pointer.
    this.handNow?.moving.multiplyScalar(0.85);
    return Math.abs(before - (o.yaw + o.pitch * 7 + o.distance * 13 + o.target.x * 17 + o.target.y * 19 + o.target.z * 23)) > 1e-5;
  }
}
