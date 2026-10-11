// World light (one rig, one state) after WorldDesign Lab v1 `wd-light.js` (KFB World Design Setup (1)/…/deliverables):
// ambient, world (key), fog, torch / torchRange / flicker (bounded pool of 6, dungeon only), local, exposure, and ONE
// shadow-casting key light. No light per figure: residents and kits only receive this rig (KayKit tutorial research
// 2026-10-10: "keep global atmosphere/light as one environment-state/profile seam").
// Profiles: 'kfb-day' = game light (today's lab light: warm sun from upper left, sky fill, warm bounce from below; Neutral
// tone mapping), 'baseline' = wd-light BASELINE (neutral KayKit bench: kit-lab.js makeViewer values, no tone mapping),
// 'whackman' = wd-light WHACKMAN (dark world light, mood from the torches; interiors / dungeons later).
import * as THREE from 'three';

export type LightProfile = 'kfb-day' | 'baseline' | 'whackman';
export interface LightState {
  profile: LightProfile;
  ambient: number; world: number;
  /** FogExp2 density (wd-light); 0 = linear fog fogNear … fogFar (0 = none) */
  fog: number; fogNear: number; fogFar: number;
  torch: number; torchRange: number; flicker: number; local: number; exposure: number;
  sky: string;
  /** fixed background (benches such as the lineup), overrides the profile's sky */
  background?: string;
}

export const PROFILES: Record<LightProfile, Partial<LightState>> = {
  'kfb-day': { ambient: 1.25, world: 2.4, fog: 0, fogNear: 320, fogFar: 760, exposure: 1, torch: 0, local: 0 },
  baseline: { ambient: 0.5, world: 0.7, fog: 0, fogNear: 0, fogFar: 0, exposure: 1, torch: 0, local: 0 },
  whackman: { ambient: 0.48, world: 0.68, fog: 0.019, exposure: 0.98, torch: 30, local: 0 },
};
export const DEF: LightState = { profile: 'kfb-day', ambient: 1.25, world: 2.4, fog: 0, fogNear: 320, fogFar: 760, torch: 0, torchRange: 18, flicker: 1, local: 0, exposure: 1, sky: '#96bede' };

const POOL = 6;
/** key direction of the game light (sun from upper left), unit vector towards the sun */
const KEY_DIR = new THREE.Vector3(-120, 180, 90).normalize();

export interface WorldLight {
  state: LightState;
  key: THREE.DirectionalLight;
  group: THREE.Group;
  setProfile(p: LightProfile, over?: Partial<LightState>): void;
  refresh(): void;
  /** fit the key light and its shadow camera to a world box (whole world or one island) */
  keyTo(box: THREE.Box3): void;
  update(t: number): void;
  /** Himmel (8+9): the SKY3 EnvironmentHost drives THIS rig through an adapter (no second rig); from then on day-night.js is
   *  the only writer of fog / background and of the rig's colours and intensities */
  skyRig(): Record<string, any>;
  /** torch pool (wd-light placeWorld + WhackMan folge): points of lamps / torches; the nearest 6 to `near` are lit */
  torchesAt(points: THREE.Vector3[]): void;
  /** night weight 0…1 (day-night `nachtGewicht`): torches + glow sprites + registered glow materials (emissive) */
  night(w: number, t: number, near?: THREE.Vector3): void;
  /** glow materials (e.g. KayKit `holiday_glow`): emissive follows the night weight */
  glow(mats: THREE.Material[]): void;
  /** A10 Lichtkreis (WhackMan Fog of War): slider 0…1 (God-Mode LICHTKREIS, default 0.6); effective = slider × night weight */
  setCircle(v: number): void;
  circle: THREE.PointLight;
  /** C1b+C3 (V-109): O1 v5 tunnel lights as points (lab units); a pool of 4 lights follows the nearest to the player (LAB adaptation) */
  tunnelsAt?(pts: { p: THREE.Vector3; color: string; intensity: number; distance: number }[]): void;
  setTunnel?(w: number): void;
  setGroundTint?(color: string, k: number): void;
  readonly tunnelWeight?: number;
}

export function makeWorldLight(scene: THREE.Scene, renderer: THREE.WebGLRenderer, init: Partial<LightState> = {}): WorldLight {
  const state: LightState = { ...DEF, ...PROFILES[init.profile ?? 'kfb-day'], ...init };
  const g = new THREE.Group(); g.name = 'kfb:light'; scene.add(g);
  const hemi = new THREE.HemisphereLight('#ffffff', '#333333', 1);
  const key = new THREE.DirectionalLight('#ffffff', 1);
  key.castShadow = true;
  // 2048 (Steuerung 10.10., performance: the 4096 shadow pass cost a third of the frame); ?shadow= overrides (4096 = before)
  const SM = Number(new URLSearchParams(location.search).get('shadow') ?? 2048); key.shadow.mapSize.set(SM, SM);
  key.shadow.radius = 2; key.shadow.blurSamples = 12;
  const fill = new THREE.DirectionalLight('#ffffff', 0.4);   // no shadows
  const local = new THREE.PointLight('#ffd9a0', 0, 26, 2);
  g.add(hemi, key, key.target, fill, local);
  const torches: THREE.PointLight[] = [];
  for (let i = 0; i < POOL; i++) { const L = new THREE.PointLight('#ff8c3a', 30, 18, 2); L.userData.ph = i * 1.7; L.visible = false; g.add(L); torches.push(L); }
  const centre = new THREE.Vector3();
  let radius = 150;

  let skyOwned = false;
  const base = { hc: new THREE.Color('#ffffff'), hg: new THREE.Color('#333333'), hi: 1, ki: 1, fi: 1 };
  const TUN = { hc: new THREE.Color('#fff1dc'), hg: new THREE.Color('#e6c49c'), hi: 1.6, key: 0.12, fill: 0.35, pool: 2.0 };
  let tunW = 0, groundK = 0; const groundTint = new THREE.Color('#bfae96');
  function refresh() {
    const p = state.profile;
    if (skyOwned) { renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = state.exposure; return; }   // day-night.js owns colours, fog, background
    if (p === 'whackman') {
      hemi.color.set('#3f4a66'); hemi.groundColor.set('#1f1917'); hemi.intensity = state.ambient;
      key.color.set('#9db4e8'); key.intensity = state.world; fill.color.set('#6478a8'); fill.intensity = state.world * 0.18;
    } else if (p === 'baseline') {
      hemi.color.set('#dcd6ff'); hemi.groundColor.set('#2a2140'); hemi.intensity = state.ambient * 3.8;
      key.color.set('#fff3e0'); key.intensity = state.world * 3; fill.color.set('#9f8cff'); fill.intensity = state.world * 0.86;
    } else {
      hemi.color.set('#dfeeff'); hemi.groundColor.set('#c7a790'); hemi.intensity = state.ambient;
      key.color.set('#fff1dc'); key.intensity = state.world; fill.color.set('#ffe2c4'); fill.intensity = state.world * 0.375;
    }
    const bg = state.background ?? (p === 'whackman' ? '#151322' : p === 'baseline' ? '#eef3f8' : state.sky);
    scene.background = new THREE.Color(bg);
    scene.fog = state.fog > 0.0005 ? new THREE.FogExp2(bg, state.fog) : state.fogFar > 0 ? new THREE.Fog(bg, state.fogNear, state.fogFar) : null;
    renderer.toneMapping = p === 'whackman' ? THREE.ACESFilmicToneMapping : p === 'baseline' ? THREE.NoToneMapping : THREE.NeutralToneMapping;
    renderer.toneMappingExposure = state.exposure;
    torches.forEach((L, i) => { L.visible = p === 'whackman' && state.torch > 0.5 && i < 2; L.distance = state.torchRange; L.intensity = state.torch; });
    local.intensity = state.local * 14; local.distance = Math.max(8, radius * 0.2);
    base.hc.copy(hemi.color); base.hg.copy(hemi.groundColor); base.hi = hemi.intensity; base.ki = key.intensity; base.fi = fill.intensity; compose();
  }
  // ---- C1b+C3 (Steuerung 11.10.) tunnel light: by the camera's tunnel share (0 outside … 1 deep inside) the rig blends softly to a tunnel
  // preset — warm neutral hemisphere instead of the island preset's green bounce, sun and fill dimmed, the TC1 lamp pool dominant. The sky
  // (day-night.js) writes its values into `base` (skyRig proxies); compose() mixes base and preset after every sky step (setTunnel).
  function compose() {
    hemi.color.copy(base.hc).lerp(TUN.hc, tunW); hemi.groundColor.copy(base.hg).lerp(groundTint, groundK).lerp(TUN.hg, tunW);
    hemi.intensity = base.hi + (TUN.hi * state.ambient - base.hi) * tunW;
    key.intensity = base.ki * (1 - (1 - TUN.key) * tunW); fill.intensity = base.fi * (1 - (1 - TUN.fill) * tunW);
  }

  function keyTo(box: THREE.Box3) {
    box.getCenter(centre);
    const s = box.getSize(new THREE.Vector3());
    radius = Math.max(4, Math.max(s.x, s.y, s.z) * 0.5);
    const d = radius * 2.2, r = radius * 1.1;
    // LESSONS_SHADOWS: snap the light-space centre to the shadow-map texel grid (no shimmering when the box moves)
    const texel = (2 * r) / key.shadow.mapSize.x, zAx = KEY_DIR.clone().negate(), xAx = new THREE.Vector3(0, 1, 0).cross(zAx).normalize(), yAx = zAx.clone().cross(xAx);
    const cx = Math.round(centre.dot(xAx) / texel) * texel, cy = Math.round(centre.dot(yAx) / texel) * texel, cz = centre.dot(zAx);
    centre.copy(xAx).multiplyScalar(cx).addScaledVector(yAx, cy).addScaledVector(zAx, cz);
    key.position.copy(centre).addScaledVector(KEY_DIR, d);
    key.target.position.copy(centre);
    const sc = key.shadow.camera;
    Object.assign(sc, { left: -r, right: r, top: r, bottom: -r, near: Math.max(1, d - radius * 1.6), far: d + radius * 1.8 });
    sc.updateProjectionMatrix();
    // shadow-fit.v1 world scale: normalBias = 1.2 × shadow-map texel, tiny negative bias (Resident Atlas R4)
    key.shadow.bias = -0.00003; key.shadow.normalBias = 4.5 * ((2 * r) / key.shadow.mapSize.x);   // Lauf 03: 1.2 texels left acne bands on the gently sloped R2D tops and a hard self-shadow band on the lower rounding
    fill.position.copy(centre).add(new THREE.Vector3(160, -60, 60).normalize().multiplyScalar(d));
    fill.target.position.copy(centre);
    local.position.set(centre.x, centre.y + radius * 1.1, centre.z + radius * 1.4);
  }

  function update(t: number) {
    if (state.profile !== 'whackman') return;
    const f = state.flicker;
    torches.forEach((L) => { if (L.visible) L.intensity = state.torch * (1 - f * 0.16 + f * (0.1 * Math.sin(t * 11.3 + L.userData.ph) + 0.06 * Math.sin(t * 6.7 + L.userData.ph * 2.3))); });
  }

  // ---- sky adapter: day-night.js writes {sun, sun2, fill, fill2, back, hemi, amb}. This rig has key / fill / hemi; the TinySkies
  // preset values are scaled so that its DAY preset reproduces today's Lab day (sun 5.0 → world, hemi 1.75 → ambient,
  // fill 1.75 → world × 0.375); sun2 / fill2 / back / amb have no light here (sinks: the Lab rig keeps one key light)
  const proxy = (L: { color: THREE.Color; intensity: number } | null, k: number, extra: Record<string, unknown> = {}, set?: (v: number) => void, color?: THREE.Color) => {
    const o: any = { color: color ?? (L ? L.color : new THREE.Color()), _i: 0, ...extra };
    Object.defineProperty(o, 'intensity', { get: () => o._i, set: (v: number) => { o._i = v; if (set) { set(v * k); compose(); } else if (L) L.intensity = v * k; } });
    return o;
  };
  function skyRig() {
    skyOwned = true; refresh();
    const sun = proxy(key, state.world / 5.0, {}, (v) => { base.ki = v; }); Object.defineProperty(sun, 'position', { get: () => key.position }); Object.defineProperty(sun, 'target', { get: () => key.target });
    const hemiP = proxy(hemi, state.ambient / 1.75, { groundColor: base.hg }, (v) => { base.hi = v; }, base.hc);   // the sky writes its colours into base
    return { sun, sun2: proxy(null, 0), fill: proxy(fill, (state.world * 0.375) / 1.75, {}, (v) => { base.fi = v; }), fill2: proxy(null, 0), back: proxy(null, 0), hemi: hemiP, amb: proxy(null, 0) };
  }
  // ---- torches (all 6 stay visible; off = intensity 0, so lighting never recompiles) + additive glow sprites
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d')!, gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,214,150,1)'); gr.addColorStop(0.35, 'rgba(255,170,80,.55)'); gr.addColorStop(1, 'rgba(255,140,60,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  let points: THREE.Vector3[] = [], sprites: THREE.Sprite[] = [], glowMats: { m: any; base: number }[] = [], nightW = 0;
  function torchesAt(ps: THREE.Vector3[]) {
    points = ps; sprites.forEach((sp) => sp.removeFromParent());
    sprites = ps.map((p) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: '#ffd29a', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0 })); sp.position.copy(p); sp.scale.setScalar(Math.max(1.2, radius * 0.06)); g.add(sp); return sp; });
    torches.forEach((L) => { L.visible = true; L.intensity = 0; L.distance = Math.max(state.torchRange, radius * 0.45); });
  }
  const near0 = new THREE.Vector3();
  function night(w: number, t: number, near?: THREE.Vector3) {
    nightW = w;
    if (near) { circleAt(near); tunAt(near); }
    for (const x of glowMats) x.m.emissiveIntensity = x.base * w;
    sprites.forEach((sp, i) => { (sp.material as THREE.SpriteMaterial).opacity = Math.min(1, w * 1.3) * (0.85 + 0.15 * Math.sin(t * 9 + i * 1.7)); });
    if (!points.length) return;
    // WhackMan lampen.folge: the 6 lights go to the points nearest the player
    const c = near ?? near0, order = points.map((p, i) => [p.distanceToSquared(c), i]).sort((a, b) => a[0] - b[0]).slice(0, POOL);
    torches.forEach((L, k) => { const o = order[k]; if (!o) { L.intensity = 0; return; } L.position.copy(points[o[1]]); const f = state.flicker;
      L.intensity = 30 * w * (1 - f * 0.16 + f * (0.1 * Math.sin(t * 11.3 + L.userData.ph) + 0.06 * Math.sin(t * 6.7 + L.userData.ph * 2.3))); });
  }
  // ---- A10 (V-092) Lichtkreis = TinySkies „Fog of War“ (Georg 11.10.) = WhackMan v1.1 nightLight, 1:1 (georg-doc/kayfabizarro
  // @e5dc13cc tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/wm-gate-c.js:70–78, 497, 846): ONE PointLight
  // 0xffe9c8 that follows the player at 0.7 × figure height, distance MOD × 6.5, decay 1.6, intensity v × 46; it only brightens the
  // player's surroundings (hemisphere / fog untouched, nothing painted under the feet). Units by figure height: WhackMan figure
  // = 0.6 MOD = 2.4 k ≙ 1 H = 3.64 lab, s = 3.64 / 2.4 → distance 26 k × s = 39.4 lab, intensity 46 × s^1.6 ≈ 89.6 (decay kept).
  // LAB addition (Steuerung 11.10.): effective = slider × night weight (WhackMan: slider only, default off) → off by day, fades in
  // with dusk; God-Mode slider LICHTKREIS, default 60 %.
  const WM_S = 3.64 / 2.4, CIRCLE_I = 46 * Math.pow(WM_S, 1.6);
  const circle = new THREE.PointLight('#ffe9c8', 0, 4 * 6.5 * WM_S, 1.6); circle.name = 'kfb:lichtkreis'; g.add(circle);
  // off the shader until a sky owner enables it (setCircle, once at start): an invisible light is not shaded at all, so worlds
  // without the cycle (RKIT hub) pay nothing; never toggled at runtime (a light-count change recompiles every material = a hitch)
  circle.visible = false;
  let circleK = 0.6;
  const circleAt = (p: THREE.Vector3) => { circle.position.set(p.x, p.y + 0.7 * 3.64, p.z); circle.intensity = CIRCLE_I * circleK * nightW; };
  // ---- C1b+C3 (V-109) tunnel light pool: O1 v5 puts one warm PointLight per tunnel step into the scene; here the points only, and a
  // pool of TUN_POOL lights (created once → fixed light count, no recompile) goes to the nearest ones each frame (LAB adaptation)
  const TUN_POOL = 4, tunL: THREE.PointLight[] = []; let tunPts: { p: THREE.Vector3; color: string; intensity: number; distance: number }[] = [];
  function tunnelsAt(pts: typeof tunPts) {
    tunPts = pts; if (!pts.length || tunL.length) return;
    for (let i = 0; i < TUN_POOL; i++) { const L = new THREE.PointLight('#ffc27a', 0, 30, 2); L.name = 'kfb:tunnel-pool'; g.add(L); tunL.push(L); }
  }
  const tunAt = (c: THREE.Vector3) => { if (!tunL.length) return; const order = tunPts.map((x, i) => [x.p.distanceToSquared(c), i]).sort((a, b) => a[0] - b[0]).slice(0, TUN_POOL);
    tunL.forEach((L, k) => { const o = order[k]; if (!o) { L.intensity = 0; return; } const x = tunPts[o[1]]; L.position.copy(x.p); L.color.set(x.color); L.intensity = x.intensity * (1 + TUN.pool * tunW); L.distance = x.distance; }); };
  function glow(mats: THREE.Material[]) { for (const m of mats as any[]) if (m && 'emissiveIntensity' in m) { glowMats.push({ m, base: m.emissiveIntensity || 1 }); if (m.emissive && m.emissive.getHex() === 0) m.emissive.copy(m.color); m.emissiveIntensity = (m.emissiveIntensity || 1) * nightW; } }

  g.add(fill.target);
  keyTo(new THREE.Box3(new THREE.Vector3(-150, -60, -150), new THREE.Vector3(150, 40, 150)));
  refresh();
  return {
    state, key, group: g, refresh, keyTo, update, skyRig, torchesAt, night, glow, circle, tunnelsAt,
    /** tunnel share of the camera (0..1), after every sky step; blends the rig to the tunnel preset (see compose) */
    setTunnel(w: number) { tunW = Math.min(1, Math.max(0, w)); compose(); },
    get tunnelWeight() { return tunW; },
    /** worlds without ground under the sky (the ring in space): the hemisphere's bounce colour → a neutral warm tint (k 0..1) instead of the
     *  island preset's grass green */
    setGroundTint(color: string, k: number) { groundTint.set(color); groundK = Math.min(1, Math.max(0, k)); compose(); },
    setCircle(v: number) { circleK = Math.min(1, Math.max(0, v)); circle.visible = true; circle.intensity = CIRCLE_I * circleK * nightW; },
    setProfile(p, over = {}) { Object.assign(state, PROFILES[p], { profile: p }, over); refresh(); },
  };
}
