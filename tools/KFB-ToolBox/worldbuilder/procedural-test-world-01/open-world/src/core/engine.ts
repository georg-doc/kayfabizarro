// Renderer, loop and module host with failure isolation. See ARCHITECTURE.md §6, §10.
import * as THREE from 'three';
import { updateFadeUniforms } from './fade';
import RAPIER from '@dimforge/rapier3d-compat';
import { Events } from './events';
import { WorldModel } from './world';
import { ChunkManager } from './chunks';
import { Physics } from './physics';
import { Input } from './input';
import type { CameraView, CoreContext, GameModule } from './types';
import { AssetLibrary } from '../modules/assets/library';

export interface ModuleState {
  id: string;
  status: 'ok' | 'disabled' | 'degraded';
  errors: number;
  lastError?: string;
}

export class Engine {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.3, 2000);
  events = new Events();
  world: WorldModel;
  chunks = new ChunkManager();
  physics!: Physics;
  input: Input;
  assets: AssetLibrary;
  modules: GameModule[] = [];
  states = new Map<string, ModuleState>();
  ctx!: CoreContext;
  private services = new Map<string, unknown>();
  private lastTime = performance.now();
  private frameTimes: number[] = [];
  private updateFails = new Map<string, number>();
  /** When set, overrides the camera after all modules ran (verification presets). */
  cameraOverride: CameraView | null = null;
  /** Explicit chunk focus (else: player position, else camera target). */
  focusOverride: THREE.Vector3 | null = null;
  frame = 0;
  readyFlag = false;
  /** Environment may route rendering through a composer. Must render scene+camera to the canvas. */
  renderOverride: ((dt: number) => void) | null = null;
  private lastRender = { calls: 0, triangles: 0 };

  constructor(readonly params: URLSearchParams, readonly mode: 'game' | 'showcase') {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: params.has('shot') });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, Number(params.get('dpr') ?? 2)));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.info.autoReset = false;
    document.body.appendChild(this.renderer.domElement);
    this.input = new Input(this.renderer.domElement);
    this.world = new WorldModel(Number(params.get('seed') ?? 97) | 0); // default seed chosen by demo scorer (tools/scan.mjs)
    this.assets = new AssetLibrary();
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async boot(): Promise<void> {
    this.physics = await Physics.create();
    await this.assets.init();
    this.scene.add(this.camera);
    const services = this.services;
    this.ctx = {
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      world: this.world,
      physics: this.physics,
      rapier: RAPIER,
      chunks: this.chunks,
      events: this.events,
      input: this.input,
      assets: this.assets,
      services: {
        get: <T,>(n: string) => services.get(n) as T | undefined,
        set: (n: string, api: unknown) => void services.set(n, api),
      },
      params: this.params,
      time: 0,
      mode: this.mode,
      setRenderOverride: (fn) => void (this.renderOverride = fn),
      getCameraOverride: () => this.cameraOverride,
    };
    this.services.set('assets', this.assets);
  }

  /** Register modules (already imported). Layers are wired immediately. */
  addModules(mods: GameModule[]): void {
    for (const m of mods) {
      this.modules.push(m);
      this.states.set(m.id, { id: m.id, status: 'ok', errors: 0 });
      for (const l of [...(m.layer ? [m.layer] : []), ...(m.layers ?? [])]) this.world.registerLayer(l);
    }
    this.chunks.attach(this.ctx, this.modules);
  }

  fail(id: string, e: unknown, disable: boolean): void {
    const s = this.states.get(id);
    if (s) {
      s.errors++;
      s.status = disable ? 'disabled' : 'degraded';
      s.lastError = String((e as Error)?.message ?? e);
    }
    console.warn(`[module:${id}] ${disable ? 'disabled' : 'error'}:`, e);
    this.events.emit('module:error', { id, error: e });
  }

  /** Boot timeline (ms since navigation start) for diagnosis: per-module init durations. */
  bootTimes: Record<string, number> = {};

  async initModules(): Promise<void> {
    this.bootTimes.initModulesStart = Math.round(performance.now());
    for (const m of this.modules) {
      if (!m.init) continue;
      const t0 = performance.now();
      try {
        await m.init(this.ctx);
      } catch (e) {
        this.fail(m.id, e, true);
      }
      this.bootTimes['init:' + m.id] = Math.round(performance.now() - t0);
    }
    this.bootTimes.initModulesEnd = Math.round(performance.now());
  }

  active(m: GameModule): boolean {
    return this.states.get(m.id)?.status !== 'disabled';
  }

  start(): void {
    this.renderer.setAnimationLoop(() => this.tick());
  }

  private tick(): void {
    const tNow = performance.now();
    const dt = Math.min((tNow - this.lastTime) / 1000, 0.25);
    this.lastTime = tNow;
    this.ctx.time += dt;
    this.frame++;
    const now = performance.now();
    this.frameTimes.push(now);
    while (this.frameTimes.length && this.frameTimes[0] < now - 1000) this.frameTimes.shift();

    // chunk focus
    const player = this.services.get('player') as { position?: THREE.Vector3 } | undefined;
    if (this.focusOverride) this.chunks.focus.copy(this.focusOverride);
    else if (this.cameraOverride) this.chunks.focus.set(this.cameraOverride.target[0], 0, this.cameraOverride.target[2]);
    else if (player?.position) this.chunks.focus.copy(player.position);
    this.chunks.update();

    for (const m of this.modules) this.runUpdate(m, 'update', dt);
    this.physics.step(dt);
    for (const m of this.modules) this.runUpdate(m, 'lateUpdate', dt);

    if (this.cameraOverride) {
      const v = this.cameraOverride;
      this.camera.position.set(...v.position);
      this.camera.lookAt(new THREE.Vector3(...v.target));
      if (v.fov && this.camera.fov !== v.fov) {
        this.camera.fov = v.fov;
        this.camera.updateProjectionMatrix();
      }
    }

    // shared occluder fade (core/fade.ts): camera is final for this frame; player line only in follow mode
    updateFadeUniforms(this.camera, player?.position, !this.cameraOverride);

    this.renderer.info.reset();
    if (this.renderOverride) {
      try {
        this.renderOverride(dt);
      } catch (e) {
        console.warn('[core] renderOverride threw; falling back to plain render', e);
        this.renderOverride = null;
        this.renderer.render(this.scene, this.camera);
      }
    } else this.renderer.render(this.scene, this.camera);
    this.lastRender = { calls: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles };
    this.input.endFrame();
  }

  private runUpdate(m: GameModule, fn: 'update' | 'lateUpdate', dt: number): void {
    const f = m[fn];
    if (!f || !this.active(m)) return;
    try {
      f.call(m, dt, this.ctx);
      this.updateFails.set(m.id, 0);
    } catch (e) {
      const n = (this.updateFails.get(m.id) ?? 0) + 1;
      this.updateFails.set(m.id, n);
      this.fail(m.id, e, n >= 3);
    }
  }

  /** Render one frame synchronously (used before declaring ready). */
  renderNow(): void {
    this.tick();
  }

  stats() {
    return {
      fps: this.frameTimes.length,
      drawCalls: this.lastRender.calls,
      triangles: this.lastRender.triangles,
      chunks: this.chunks.loaded.size,
      chunksPending: this.chunks.pending,
      chunkBuildMs: +this.chunks.lastBuildMs.toFixed(2),
      geometries: this.renderer.info.memory.geometries,
      textures: this.renderer.info.memory.textures,
      frame: this.frame,
      modules: [...this.states.values()],
      failedLayers: [...this.world.failedLayers],
      missingAssets: [...this.assets.missing],
      gpu: gpuName(this.renderer),
      boot: this.bootTimes,
      layerMs: Object.fromEntries(Object.entries(this.world.layerMs).map(([k, v]) => [k, Math.round(v)])),
      streaming: (this.services.get('streaming') as { stats?: () => unknown } | undefined)?.stats?.() ?? null,
    };
  }
}

function gpuName(r: THREE.WebGLRenderer): string {
  const gl = r.getContext();
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  return ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : 'unknown';
}
