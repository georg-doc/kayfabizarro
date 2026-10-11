// Himmel, Licht, Insel-Farben (8+9) · Steuerung 10.10.: the SKY3 cut (Claude Design, KFB Skydome Gates SKY3, three r184) is
// vendored 1:1 in src/sky/vendor (VENDOR.md); this file is only the Lab wiring:
//   · ONE EnvironmentHost (lab-sky/env-host.v3.js): clock, time of day, weather, exactly one sky shell (tiny = TinySkies
//     gradient · travel = Travel Combat v25 skydome shader · spindle = card spindle); day-night.js is the only fog /
//     background writer
//   · NO second light rig: the host drives the Lab rig (src/world/light.ts skyRig adapter); the night weight switches the
//     torch pool (lamp heads, nearest 6) + glow sprites + glow materials
//   · clouds: the clay cloud family v3 (Jarlan Perez donor, CC BY 3.0, vendored locally, git-blob pinned)
//   · island colours: the theme's palette (Joyride WORLDS 6-combo) tones the sky (day-night setHimmelTon, tones only)
// Sizes follow the stage: host radius = 20 × stage radius, fog scale = stage radius / 5 (TinySkies fog is in globe units, r 5).
import * as THREE from 'three';
import * as EH from './vendor/lab-sky/env-host.v3.js';
import * as CF from './vendor/lab-sky/cloud-family.v3.js';
import type { WorldLight } from '../world/light';
const { createEnvironmentHost } = EH as any;
const CFa = CF as any;

export type SkyTime = 'day' | 'evening' | 'night' | 'auto';
export interface SkyOpts { renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera; light: WorldLight; box: THREE.Box3;
  palette?: { skyHueShift?: number; sky?: string } | null; shell?: 'tiny' | 'travel' | 'spindle'; travelVariant?: string; clouds?: number; time?: SkyTime; torches?: THREE.Vector3[];
  /** travel shell: skydome variant per time of day (static Kenney skyboxes, vendored), e.g. { day: 'day', evening: 'morning', night: 'night' } */
  variantByTime?: Partial<Record<SkyTime, string>>;
  /** A10 aurora curtain elevation in degrees seen from the camera (theme `sky.aurora.elevationDeg`); null = TinySkies source (≈ 52°) */
  auroraElevationDeg?: number | null;
  /** LAB (C1b+C3, Steuerung 11.10.): the fog's far distance in lab units — sets day-night's own fogScale so its preset far lands there (huge worlds:
   *  fog complete just before the camera's far plane, no hard cut at the far clip, V-011); day-night stays the only fog writer */
  fogFar?: number; /** false = no horizon sampling (perf A/B, ?fogSample=0): fog keeps day-night's own colour */ fogSample?: boolean }

export async function createSky(o: SkyOpts) {
  const size = o.box.getSize(new THREE.Vector3()), c = o.box.getCenter(new THREE.Vector3()), R = Math.max(size.x, size.z) / 2;
  const radius = Math.min(1800, Math.max(300, R * 20));
  const host = await createEnvironmentHost({ THREE, renderer: o.renderer, scene: o.scene, camera: o.camera, lights: o.light.skyRig(), radius, fogScale: R / 5, minutes: 6, travelVariant: o.travelVariant ?? 'S' });
  if (o.fogFar && (o.scene.fog as any)?.far > 0) { const f = o.scene.fog as any; host.dn.setFogScale(host.dn.fogScale * o.fogFar / f.far); }
  const errors: string[] = [];
  // LAB PATCH (A10, Steuerung 11.10.) · aurora elevation: TinySkies hangs the 10 curtains on a ring around the viewer, RING_RADIUS 7 /
  // RING_HEIGHT 9 globe units (sky-atmosphere.js:25–26) → ≈ 52° up; made for a camera orbiting a globe. The Lab's game camera looks
  // −9° with fov 38 (top of frame ≈ +10°), so the aurora was never in the game image. Not a rescale: the ring keeps its size; its
  // centre is lowered so the curtains' centre sits at `elevationDeg`. Default 5°, measured (tools/a10/aurora-diff.mjs, night PondLand,
  // added brightness in the top third of the game image): source 52° +0.04 · 20° +9.1 · 10° +20.2 · 5° +23.1 (73 % of the pixels) · 0° +19.0. The vendored files are unchanged (the host's aurora.update is wrapped at runtime); null = the source elevation.
  const AUR = host.aurora, aurUpd = AUR.update.bind(AUR), aurC = new THREE.Vector3();
  let auroraElev: number | null = o.auroraElevationDeg === undefined ? 5 : o.auroraElevationDeg;
  AUR.update = (dt: number, cam: THREE.Camera, c?: THREE.Vector3, up?: THREE.Vector3) => {
    if (auroraElev == null || !c || !up) return aurUpd(dt, cam, c, up);
    return aurUpd(dt, cam, aurC.copy(c).addScaledVector(up, -(9 - 7 * Math.tan((auroraElev * Math.PI) / 180))), up);
  };
  await host.setShell(o.shell ?? 'tiny').catch((e: Error) => { errors.push('shell: ' + e.message); return host.setShell('tiny'); });
  // palette tone: 0.7 of the hue offset (the full Joyride offset rotated every gradient stop into neon, first matrix 10.10.)
  // + the palette sky colour tints the static dome (Lab wiring, the shader stays 1:1): strong by day, weaker evening / night
  const TONE_K = 0.7, TINT: Record<string, number> = { day: 0.8, evening: 0.45, night: 0.3, auto: 0.55 };
  let pal = o.palette ?? null, curT: SkyTime = o.time ?? 'day';
  const tint = () => { const g = host.shell?.dome?.group as THREE.Object3D | undefined; if (!g) return; const col = new THREE.Color('#ffffff').lerp(new THREE.Color(pal?.sky ?? '#ffffff'), pal?.sky ? TINT[curT] ?? 0.4 : 0);
    g.traverse((m: any) => { if (m.material?.map && m.material.color) m.material.color.copy(col); }); };
  const tone = (p?: { skyHueShift?: number; sky?: string } | null) => { pal = p ?? null; host.dn.setHimmelTon(p?.skyHueShift != null ? p.skyHueShift * TONE_K : null); tint(); };
  tone(o.palette);
  // ---- LAB addition (A10, Steuerung 11.10., V-011 no hard cuts): AUTO crossfades the static skydome. The travel shell's
  // setVariant swaps the Kenney map outright (skydome-shader.js applyVariant), so the dome could not follow the cycle without a
  // cut. Smallest intervention, vendor unchanged: a second sphere (same geometry, cloned MeshBasicMaterial, transparent) over the
  // static dome. The pair follows day-night's own keys (day-night.js:37–43 KEYS, linear `paar`): base = the segment's start
  // variant, top = its end variant at opacity t — at every key both layers show the same variant, so the base swap is hidden.
  const KEYS: [number, string][] = [[0, 'day'], [0.34, 'day'], [0.42, 'evening'], [0.5, 'evening'], [0.6, 'night'], [0.8, 'night'], [0.88, 'evening'], [0.94, 'evening'], [1, 'day']];
  let fade: { base: THREE.MeshBasicMaterial; top: THREE.Mesh; maps: Record<string, THREE.Texture> } | null = null;
  const vbt = o.variantByTime ?? {};
  if (host.shell?.dome && vbt.day && vbt.night) {
    let st: THREE.Mesh | null = null;
    host.shell.dome.group.traverse((m: any) => { if (m.isMesh && m.material?.isMeshBasicMaterial && m.geometry?.parameters?.radius === 700) st = m; });
    if (st) {
      const sm = st as THREE.Mesh, base = sm.material as THREE.MeshBasicMaterial, maps: Record<string, THREE.Texture> = {};
      for (const v of new Set(Object.values(vbt) as string[])) { host.shell.variant(v); if (base.map) maps[v] = base.map; }   // the vendor's own texture cache
      const topMat = base.clone(); topMat.transparent = true; topMat.opacity = 0;
      const top = new THREE.Mesh(sm.geometry, topMat); top.position.copy(sm.position); top.rotation.copy(sm.rotation); top.renderOrder = -1.5; top.frustumCulled = false; top.visible = false; top.name = 'kfb:dome-fade';
      sm.parent!.add(top); fade = { base, top, maps };
    }
  }
  const domeFade = () => {
    if (!fade) return;
    if (curT !== 'auto') { fade.top.visible = false; return; }
    const p = host.dn.phase; let i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
    const [pA, nA] = KEYS[i], [pB, nB] = KEYS[i + 1], t = Math.min(1, Math.max(0, (p - pA) / Math.max(1e-6, pB - pA)));
    const mA = fade.maps[(vbt as any)[nA]], mB = fade.maps[(vbt as any)[nB]];
    if (mA && fade.base.map !== mA) fade.base.map = mA;
    const tm = fade.top.material as THREE.MeshBasicMaterial;
    if (mB && tm.map !== mB) { tm.map = mB; tm.needsUpdate = true; }
    tm.opacity = mA === mB ? 0 : t; fade.top.visible = tm.opacity > 0.002;
    fade.top.userData.pair = [nA, nB, +t.toFixed(3)];
  };
  // LAB (C1b+C3, Steuerung 11.10.): with the static Travel dome the fog takes the colour seen at the horizon — the mean of the dome texture's
  // band from the horizon to 12 % below it (the dome sits 40 above the camera → horizon row ≈ 0.518 of the image), mixed like the AUTO fade.
  // Only for worlds that ask for it (fogFar); day-night writes it through its hook (LAB PATCH N1).
  const horizonCache = new Map<string, THREE.Color>(); let fogDbg = o.fogFar ? (host.shell?.dome ? 'pending' : 'no travel dome') : 'off';
  const horizonOf = (t: THREE.Texture | null | undefined) => { if (!t) return null; const hit = horizonCache.get(t.uuid); if (hit) return hit; const img: any = t.image; if (!img || !(img.complete ?? true) || !img.width) return null;
    const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64; const g = cv.getContext('2d')!; g.drawImage(img, 0, 0, 64, 64); const d = g.getImageData(0, 33, 64, 8).data; let r = 0, gg = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; } const c = new THREE.Color().setRGB(r / n / 255, gg / n / 255, b / n / 255, THREE.SRGBColorSpace); horizonCache.set(t.uuid, c); return c; };
  // what the camera sees at the horizon, on the CPU (no GPU readback): twice a second the dome's textured meshes in draw order (base, then the
  // AUTO fade on top with its opacity), each = its texture's horizon band (horizonOf, cached per image) × the material colour (tint), linear.
  // The former GPU probe (dome into a 32 × 16 target + readPixels) stalled the frame 105–250 ms per sample even with readRenderTargetPixelsAsync
  // (ANGLE / Metal; parity check 4 found it as camera jitter, 11.10.). The band is a ring average, so the fog no longer changes with the heading.
  const fogOn = !!o.fogFar && o.fogSample !== false, fogCol = new THREE.Color(), fogAcc = new THREE.Color(), fogTmp = new THREE.Color(); let fogT = 0, fogHave = false;
  const fogMs: number[] = [], sampleHorizon = () => { const dome = host.shell?.dome?.group; if (!fogOn || !dome) return; const t0 = performance.now(), ms: any[] = [];
    dome.traverse((m: any) => { if (m.isMesh && m.visible && m.material?.map) ms.push(m); }); ms.sort((a, b) => a.renderOrder - b.renderOrder);
    let any = false; for (const m of ms) { const h = horizonOf(m.material.map); if (!h) continue; fogTmp.copy(h).multiply(m.material.color); const op = m.material.transparent ? m.material.opacity : 1; if (!any) { fogAcc.copy(fogTmp); any = true; } else fogAcc.lerp(fogTmp, op); }
    if (!any) return; const prevHex = fogHave ? fogCol.getHex() : -1; fogCol.copy(fogAcc); fogHave = true; fogDbg = 'dome texture #' + fogCol.getHexString();
    if (fogCol.getHex() !== prevHex) host.dn.repaint(); fogMs.push(performance.now() - t0); if (fogMs.length > 120) fogMs.shift(); };   // cost per sample incl. a repaint
  if (fogOn) host.dn.setFogColorHook(() => (fogHave ? fogCol : null));
  const setTime = (tm: SkyTime) => { curT = tm; host.setTime(tm); const v = o.variantByTime?.[tm]; if (v && host.shell?.variant) host.shell.variant(v); domeFade(); tint(); };
  setTime(o.time ?? 'day');
  if (o.torches?.length) o.light.torchesAt(o.torches);
  // clay clouds around the stage (pattern of sky-gates.v3 applySkyClouds; centred on the stage, not the camera)
  let field: any = null, mat: any = null;
  if (o.clouds) {
    try {
      const clayU = await CFa.makeClayBase(THREE, o.renderer), donor = await CFa.loadDonor(THREE), fam = CFa.buildFamily(THREE, donor.lobes, { seed: 1, ao: 1 });
      mat = CFa.makeCloudMaterial(THREE, clayU); mat.fog = false; mat.name = 'kfb-cloud-clay-sky';
      field = CFa.createCloudField({ THREE, family: fam, material: mat, parent: o.scene, lodAt: [5, 14] });
      // islands among the clouds: a ring 1.8–3.2 R around the stage, from below the island top to a little above it
      field.set(CFa.scatterClouds({ n: o.clouds, center: [c.x, c.y, c.z], radius: R * 3.2, rMin: 0.56, yRange: [-R * 0.45, R * 0.35], scale: [R * 0.3, R * 0.55], seed: 7, spacing: 0.5 }));
    } catch (e) { errors.push('clouds: ' + (e as Error).message); }
  }
  let t = 0;
  return {
    host, errors,
    setTime,
    setShell(s: 'tiny' | 'travel' | 'spindle') { return host.setShell(s); },
    setPalette: tone,
    /** A10 (V-092): weather KLAR / REGEN → the host (rain fades in ≈ 0.9/s; rain overlay + glass drops, damps aurora / rays / flare) */
    setWeather(w: 'clear' | 'rain') { host.setWeather(w); },
    /** A10 aurora elevation (degrees; null = TinySkies source ≈ 52°) */
    setAuroraElevation(d: number | null) { auroraElev = d; },
    update(dt: number, near?: THREE.Vector3) {
      t += dt; if (fogOn && (fogT -= dt) <= 0) { fogT = 0.5; sampleHorizon(); } host.update(dt); domeFade();
      if (field) { field.update(o.camera); mat.color.copy(host.cloudColor); }
      o.light.night(host.dn.nachtGewicht, t, near);
    },
    /** after the main render (lens flare / rain overlays, no clear) */
    after() { host.after(); },
    probe() { const p = host.probe(); return { fogHook: fogDbg, fogSampleMs: fogMs.length ? (() => { const a = [...fogMs].sort((x, y) => x - y); return { n: a.length, med: +a[a.length >> 1].toFixed(2), p90: +a[Math.floor(a.length * 0.9)].toFixed(2), max: +a[a.length - 1].toFixed(2) }; })() : null, time: p.time, phase: p.phase, night: p.night, day: p.day, shell: p.shell, fog: p.fog, sun: p.sun, himmelTon: p.himmelTon, clouds: field ? { ...field.last, count: o.clouds } : 'off', variant: host.shell?.probe?.().variant ?? null, radius, errors: errors.slice(),
      // A10 effects: weights as the host drives them (aurora = night, god rays = day, flare = day × (1 − rain), rain overlay)
      fx: { domeFade: fade ? { on: fade.top.visible, opacity: +((fade.top.material as THREE.MeshBasicMaterial).opacity).toFixed(3), pair: fade.top.userData.pair ?? null } : null, auroraElevationDeg: auroraElev, lichtkreis: { intensity: +o.light.circle.intensity.toFixed(2), distance: +o.light.circle.distance.toFixed(1), decay: o.light.circle.decay, pos: o.light.circle.position.toArray().map((v) => +v.toFixed(2)) }, weather: p.weather, rain: p.rain, rainStreaks: p.rainStreaks, aurora: p.aurora, godrays: p.godrays, godraysPeak: p.godraysPeak, flare: p.flare, stars: p.starsOpacity, preset: p.preset } }; },
  };
}
export type Sky = Awaited<ReturnType<typeof createSky>>;
