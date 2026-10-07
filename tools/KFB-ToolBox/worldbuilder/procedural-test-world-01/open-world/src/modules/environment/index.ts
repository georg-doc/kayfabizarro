// environment: sky, sun/moon + hemisphere fill, soft stable shadows, focus-centred edge fog, tone mapping,
// time of day, distant clouds, optional GTAO post. See NOTES.md for the chosen settings and why.
import * as THREE from 'three';
import type { CoreContext, GameModule } from '../../core/types';
import { orbitToView } from '../../core/debug';
import { patchFogChunks, kfbFogA, kfbFogB } from './fog';
import { lookAt, type Look } from './timeOfDay';
import { Sky } from './sky';
import { kfbSkyZ, kfbSkyH, kfbSkyF, kfbSkyG, kfbSkyS, kfbSkyC } from './skyfn';
import { ShadowFitter } from './shadows';
import { Clouds, CLOUD_IDS } from './clouds';
import { Post } from './post';
import { buildDiorama, type Diorama } from './diorama';
import { installKayKitToneMapping, installSmoothPCF } from './tonemap';

// Must run before any material compiles (module import happens before any module init / first render).
patchFogChunks();
installKayKitToneMapping();
if (new URLSearchParams(location.search).get('pcf') !== '5') installSmoothPCF();

const DEFAULT_HOURS = 14;

export interface EnvironmentApi {
  setTime(hours: number): void;
  readonly hours: number;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  /** Current interpolated look (read-only use). */
  look: Look;
  /** Enable / disable the GTAO post pipeline at runtime. */
  setPost(on: boolean): void;
  readonly post: boolean;
  /** Debug access to the post pipeline (null until first enabled). */
  readonly postPipeline: Post | null;
  /** 0 = full day, 1 = full night (for window/forge glow in other modules). */
  readonly nightFactor: number;
  /** Load radius the current view needs (metres); streaming may use it. */
  readonly requiredLoadRadius: number;
  /** Advance time automatically (hours per real second; 0 = frozen). */
  daySpeed: number;
}

interface State {
  ctx: CoreContext;
  hours: number;
  daySpeed: number;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  sky: Sky;
  fog: THREE.Fog;
  shadows: ShadowFitter;
  clouds: Clouds | null;
  look: Look;
  post: Post | null;
  postOn: boolean;
  diorama: Diorama | null;
  dirty: boolean;
  baseLoadRadius: number;
  maxLoadRadius: number;
  neededRadius: number;
  ownRadius: boolean;
}

let S: State | null = null;

function toneMappingFromParam(p: string | null): THREE.ToneMapping {
  switch (p) {
    case 'aces': return THREE.ACESFilmicToneMapping;
    case 'agx': return THREE.AgXToneMapping;
    case 'none': return THREE.NoToneMapping;
    case 'linear': return THREE.LinearToneMapping;
    case 'neutral': return THREE.NeutralToneMapping;
    default: return THREE.CustomToneMapping; // tonemap.ts: Neutral shoulder, no toe
  }
}

const GRASS_HAZE = new THREE.Color('#d2dc8c');
const _g = new THREE.Color();

/** Offered time range (dawn to dusk). Night is not part of the spec and did not reach the bar; see NOTES.md. */
export const MIN_HOURS = 8.5;
export const MAX_HOURS = 16.5;
const clampHours = (h: number) => THREE.MathUtils.clamp(((h % 24) + 24) % 24, MIN_HOURS, MAX_HOURS);

function applyLook(s: State): void {
  const L = lookAt(s.hours, s.look);
  s.sun.color.copy(L.sun);
  s.sun.intensity = L.sunI;
  s.hemi.color.copy(L.sky);
  s.hemi.groundColor.copy(L.ground);
  s.hemi.intensity = L.hemiI;
  s.fog.color.copy(L.fog);
  const bg = s.ctx.scene.background;
  if (bg instanceof THREE.Color) bg.copy(L.fog);
  const put = (a: Float32Array, c: THREE.Color) => { a[0] = c.r; a[1] = c.g; a[2] = c.b; };
  put(kfbSkyZ, L.zenith);
  kfbSkyZ[3] = L.day;
  put(kfbSkyH, L.horizon);
  kfbSkyH[3] = 0.3; // reach the zenith blue sooner above the horizon band
  put(kfbSkyF, L.fog);
  kfbSkyF[3] = 0.05;
  _g.copy(L.fog).lerp(GRASS_HAZE, 0.6);
  put(kfbSkyG, _g);
  kfbSkyS[0] = L.sunDir.x; kfbSkyS[1] = L.sunDir.y; kfbSkyS[2] = L.sunDir.z;
  kfbSkyS[3] = THREE.MathUtils.smoothstep(L.sunDir.y, -0.15, 0.05);
  put(kfbSkyC, L.sun);
  s.ctx.renderer.toneMappingExposure = L.exposure * Number(s.ctx.params.get('exposure') ?? 1);
  s.clouds?.setTint(L.horizon, L.zenith, L.sun, L.sunDir, L.day);
  if (s.post) s.post.night = 1 - L.day;
  s.dirty = false;
}

function makeApi(s: State): EnvironmentApi {
  return {
    setTime(h: number) {
      if (!Number.isFinite(h)) return;
      s.hours = s.ctx.params.get('night') === '1' ? ((h % 24) + 24) % 24 : clampHours(h);
      applyLook(s);
      s.ctx.events.emit('time:changed', { hours: s.hours });
    },
    get hours() { return s.hours; },
    sun: s.sun,
    hemi: s.hemi,
    get look() { return s.look; },
    setPost(on: boolean) { setPost(s, on); },
    get post() { return s.postOn; },
    get postPipeline() { return s.post; },
    get nightFactor() { return 1 - s.look.day; },
    get requiredLoadRadius() { return s.neededRadius; },
    get daySpeed() { return s.daySpeed; },
    set daySpeed(v: number) { s.daySpeed = v; },
  };
}

function setPost(s: State, on: boolean): void {
  s.postOn = on;
  if (on) {
    if (!s.post) {
      try {
        const P = s.ctx.params;
        s.post = new Post(s.ctx.renderer, s.ctx.scene, s.ctx.camera, {
          aoScale: Number(P.get('aoscale') ?? 0.5),
          aoIntensity: Number(P.get('ao') ?? 1.0),
          aoRadius: Number(P.get('aoradius') ?? 0.6),
          aoPower: Number(P.get('aopow') ?? 3),
          aoThickness: Number(P.get('aothick') ?? 0.8),
          aoSamples: Number(P.get('aosamples') ?? 12),
          pdSamples: Number(P.get('pdsamples') ?? 16),
          pdRadius: Number(P.get('pdradius') ?? 12),
          pdRings: Number(P.get('pdrings') ?? 3),
        });
        s.post.debug = P.get('aodebug') === '1';
        s.post.aoEnabled = P.get('aooff') !== '1';
        s.post.aoWhite = Number(P.get('aowhite') ?? 0.85);
        s.post.blur = Number(P.get('aoblur') ?? 6);
        s.post.aoGamma = Number(P.get('aogamma') ?? 1.6);
      } catch (e) {
        console.warn('[environment] post pipeline unavailable', e);
        s.postOn = false;
        return;
      }
    }
    const post = s.post;
    s.ctx.setRenderOverride(() => post.render());
  } else {
    s.ctx.setRenderOverride(null);
  }
}

let matScan = 0;
/** Optional shadow-side policy for the canonical (DoubleSide) KayKit materials, see NOTES.md. */
function applyShadowSide(s: State): void {
  const mode = s.ctx.params.get('shadowside') ?? 'back';
  if (mode === 'double') return;
  const lib = s.ctx.assets as unknown as { allMaterials?: () => THREE.Material[] };
  for (const m of lib.allMaterials?.() ?? []) {
    if (m.userData.kfbEnvShadowSide || m.side !== THREE.DoubleSide) continue;
    m.userData.kfbEnvShadowSide = true;
    m.shadowSide = mode === 'front' ? THREE.FrontSide : THREE.BackSide;
  }
}

const _fwd = new THREE.Vector3();

/**
 * Load radius the current view needs so that what the camera sees (up to the top edge of the frame, and the near
 * field around the camera) is inside the guaranteed-loaded disc. Low/follow cameras need only the base radius;
 * high orbit/overview cameras need more. Returns metres, quantised to 10 m.
 */
function requiredLoadRadius(s: State, cam: THREE.Camera): number {
  const ctx = s.ctx;
  const base = s.baseLoadRadius;
  const f = ctx.chunks.focus;
  const c = Math.hypot(cam.position.x - f.x, cam.position.z - f.z);
  let need = c + 120; // the near field around the camera (bottom corners of the frame) stays loaded
  const h = cam.position.y - ctx.world.heightAt(f.x, f.z);
  cam.getWorldDirection(_fwd);
  const pitchDown = Math.asin(THREE.MathUtils.clamp(-_fwd.y, -1, 1));
  const halfV = THREE.MathUtils.degToRad(((cam as THREE.PerspectiveCamera).fov ?? 50) / 2);
  const top = pitchDown - halfV; // down-angle of the top frame edge
  if (top > THREE.MathUtils.degToRad(3) && h > 0) need = Math.max(need, h / Math.tan(top) - c + 50);
  return THREE.MathUtils.clamp(Math.ceil(need / 10) * 10, base, s.maxLoadRadius);
}

function perRender(s: State, cam: THREE.Camera): void {
  const ctx = s.ctx;
  if (matScan++ % 30 === 0) applyShadowSide(s);
  const focus = ctx.chunks.focus;
  s.shadows.shadowReach = Math.max(160, ctx.chunks.config.loadRadius);
  s.shadows.update(focus, cam, s.look.lightDir);

  // View-dependent load radius (until the streaming module owns radius tuning; see NOTES.md / CORE_REQUESTS.md).
  s.neededRadius = requiredLoadRadius(s, cam);
  if (s.ownRadius && !ctx.services.get('streaming') && ctx.chunks.config.loadRadius !== s.neededRadius) {
    ctx.chunks.configure({ loadRadius: s.neededRadius });
  }

  // Edge fog: guard band right at the load edge. A chunk is loaded when its centre is within loadRadius + 72 m;
  // its far corner can be 104 m from its centre → every point within loadRadius − 32 m is guaranteed loaded.
  const R = ctx.chunks.config.loadRadius;
  const end = Math.max(90, R - 40);
  kfbFogA[0] = focus.x;
  kfbFogA[1] = focus.z;
  kfbFogA[2] = end - 60; // guard band: last 60 m before the guaranteed-loaded edge
  kfbFogA[3] = end;
  // Aerial perspective by camera distance: starts 75 m beyond what the camera looks at (so the subject and the
  // near field stay clean at every zoom), reaches full opacity where the load edge is at play height.
  const d = cam.position.distanceTo(focus);
  kfbFogB[0] = 1;
  kfbFogB[1] = d + 75;
  kfbFogB[2] = d + Math.max(160, end);
  // fallback for unpatched materials (plain linear fog): roughly the same envelope
  s.fog.near = d + 75;
  s.fog.far = d + Math.max(120, end - Math.hypot(cam.position.x - focus.x, cam.position.z - focus.z) * 0.3);
}

const mod: GameModule = {
  id: 'environment',

  async init(ctx) {
    const r = ctx.renderer;
    // PCFSoftShadowMap was removed in three r18x (it warns and falls back); PCF + radius is the soft path now.
    r.shadowMap.enabled = true;
    const vsm = ctx.params.get('shadow') === 'vsm';
    r.shadowMap.type = vsm ? THREE.VSMShadowMap : THREE.PCFShadowMap;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = toneMappingFromParam(ctx.params.get('tm'));

    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.name = 'environment:sun';
    sun.castShadow = ctx.params.get('shadows') !== '0';
    const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1.5);
    hemi.name = 'environment:hemi';
    hemi.position.set(0, 1, 0);
    ctx.scene.add(sun, sun.target, hemi);

    const sky = new Sky();
    ctx.scene.add(sky.mesh);
    ctx.scene.background = new THREE.Color(0xcdeaf5); // fallback clear colour behind the dome

    const fog = new THREE.Fog(0xcdeaf5, 90, 520);
    ctx.scene.fog = fog;

    const shadows = new ShadowFitter(sun, { mapSize: Number(ctx.params.get('shadowmap') ?? 4096), softness: Number(ctx.params.get('soft') ?? 0.4), minR: 72, maxR: 150, maxHighR: Number(ctx.params.get("highr") ?? 220), vsm });

    shadows.normalBiasTexels = Number(ctx.params.get('nbias') ?? 1.0);
    shadows.snap = ctx.params.get('nosnap') !== '1';
    shadows.fitHigh = ctx.params.get('highshadow') !== '0';
    shadows.maxRadiusTexels = Number(ctx.params.get('pcfmax') ?? 3);
    const look = lookAt(DEFAULT_HOURS);
    const s: State = {
      ctx, hours: DEFAULT_HOURS, daySpeed: 0, sun, hemi, sky, fog, shadows, clouds: null, look,
      post: null, postOn: false, diorama: null, dirty: true,
      baseLoadRadius: Math.max(ctx.chunks.config.loadRadius, Number(ctx.params.get('baseradius') ?? 270)), maxLoadRadius: 330,
      neededRadius: ctx.chunks.config.loadRadius, ownRadius: ctx.params.get('envradius') !== '0',
    };
    S = s;
    const t = ctx.params.get('time');
    if (t !== null && Number.isFinite(Number(t))) s.hours = clampHours(Number(t));
    if (ctx.params.get('daycycle') === '1') s.daySpeed = Number(ctx.params.get('dayspeed') ?? 24 / 600); // 10 min/day
    applyLook(s);

    // clouds (optional; missing assets → none)
    if (ctx.params.get('clouds') !== '0') {
      try {
        await ctx.assets.preload(CLOUD_IDS);
        const clouds = new Clouds(ctx.assets, ctx.world.seed);
        ctx.scene.add(clouds.group);
        s.clouds = clouds;
        applyLook(s);
      } catch (e) {
        console.warn('[environment] clouds skipped', e);
      }
    }

    // Post: on unless ?post=0 (decided by side-by-side screenshots + fps, see NOTES.md)
    setPost(s, ctx.params.get('post') !== '0');

    ctx.services.set('environment', makeApi(s));

    // Fit shadows + fog to the final camera of this frame: scene.onBeforeRender runs inside renderer.render()
    // after all modules and the preset override moved the camera, and before the shadow map is drawn.
    const prev = ctx.scene.onBeforeRender;
    ctx.scene.onBeforeRender = function (renderer, scene, camera, target, ...rest) {
      try {
        perRender(s, camera as THREE.Camera);
      } catch (e) {
        console.warn('[environment] perRender failed', e);
      }
      return (prev as (...a: unknown[]) => void).call(this, renderer, scene, camera, target, ...rest);
    };
  },

  update(dt, ctx) {
    const s = S;
    if (!s) return;
    if (s.daySpeed) {
      // loops within dawn..dusk
      const span = MAX_HOURS - MIN_HOURS;
      s.hours = MIN_HOURS + ((((s.hours - MIN_HOURS + s.daySpeed * dt) % span) + span) % span);
      s.dirty = true;
    }
    if (s.dirty) applyLook(s);
    s.diorama?.mixer?.update(dt);
    s.clouds?.update(ctx.time, ctx.chunks.focus);
  },

  showcaseUses: ['terrain'],

  async showcase(ctx) {
    const s = S;
    const d = await buildDiorama(ctx);
    if (s) s.diorama = d;
    ctx.chunks.focus.set(d.site.x, d.site.y, d.site.z);
    const v = orbitToView({ target: [d.site.x, d.site.y + 2, d.site.z], yaw: 30, pitch: 34, dist: 62 });
    ctx.camera.position.set(...v.position);
    ctx.camera.lookAt(new THREE.Vector3(...v.target));
  },

  cameraPresets: {
    diorama: () => {
      const st = S?.diorama?.site ?? { x: 0, y: 0, z: 0 };
      return orbitToView({ target: [st.x, st.y + 2, st.z], yaw: 30, pitch: 34, dist: 62 });
    },
    close: () => {
      const k = S?.diorama?.knightPos ?? new THREE.Vector3();
      return orbitToView({ target: [k.x - 1.5, k.y + 2.2, k.z - 3], yaw: 38, pitch: 13, dist: 15 });
    },
    far: () => {
      const st = S?.diorama?.site ?? { x: 0, y: 0, z: 0 };
      return orbitToView({ target: [st.x, st.y + 5, st.z], yaw: 30, pitch: 7, dist: 34, fov: 55 });
    },
    sky: () => {
      const st = S?.diorama?.site ?? { x: 0, y: 0, z: 0 };
      return orbitToView({ target: [st.x, st.y + 30, st.z], yaw: 160, pitch: -8, dist: 20 });
    },
  },
};

export default mod;
