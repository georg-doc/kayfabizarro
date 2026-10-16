// KFB Island Worldbuilder Lab · boot: renderer, Joyride light, sky, clouds, islands from the world JSON, editor.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initClay } from './clay';
import { createPlayCamera } from './play/camera';
import { createDrivePlay } from './play/drive';
import { createTravelPlay } from './play/travel';
import { Island, NATURE } from './island/island';
import { defaultWorld, pyramidIsland, rkitHubIsland, mvp1World, type WorldSpec } from './island/spec';
import { roadCheck, hardRules, contactCheck, sharpEdges, placeholderScan, paletteChroma } from './island/r2d/qa';
import { r2dPal } from './palettes';
import { CATALOG_K2, k2DoorCheck } from './catalog-k2';
import { specToRecipe, recipeToSpec, type IslandRecipe } from './island/recipe';
import { TERRAIN } from './island/island';
import { grassBottom } from './island/terrain';
import { exportOutline, measureRoadBed, setRoadBed, exportRimProfiles, profileRoots, type RoadBedSpec } from './island/roadbed';
import { blob, mat } from './island/nature';
import { rng } from './island/noise';
import { mergeSimple } from './island/terrain';
import { claySeed } from './clay';
import { Editor } from './editor';
import { measure } from './island/measure';
import { buildOriginalsRow } from './island/originals-layer';
import { profileClasses, mountInspector } from './inspect';
import { FIG_SCALE } from './scale';
import { makeWorldLight, type LightProfile } from './world/light';
import { createGameHud, type GameHud } from './hud/game-hud';
import * as HUD_R3 from './hud/vendor/kfb-hud.js';
import { createAudioOwner, type AudioOwner } from './audio/audio-owner';
import { createRaceFX, type RaceFX } from './play/race-fx';
import { RACE_W } from './play/camera';
import { loadThemes } from './theme/island-theme';
import { buildDemoStage } from './island/demo-stage';
import { buildLakeStage, pondWaterFromAtlas } from './water/water';
import { createSky, type Sky, type SkyTime } from './sky/sky';
import { createAlmanac, type Almanac } from './hud/almanac';
import { createOrganWorld, type OrganWorld } from './world/organ/organ-world';
import { createStreamDrive } from './play/drive';
import { createIslandNpcs, type IslandNpcs } from './world/organ/islands-npc';

const q = new URLSearchParams(location.search);
const SHOT = q.get('shot') === '1';
/** Lab overlays (panel, toast) in the game only with ?debug=1 (Steuerung 10.10. spät) */
const DEBUG = q.get('debug') === '1';
// Steuerung 10.10. spät: the RKIT test hub is no longer a default spawn (only ?rkit=1); the game (?play=game, or the old
// ?play=travel without rkit=1) starts on a StreakByte demo island as the stage, on foot (?stage=07 PondLand)
const RKIT = q.get('rkit') === '1';
// C1b+C3 (Steuerung 11.10., V-109): the hub's default world = Organ-Inseln O1 + J17 track (a stage with its own ring drive); the RKIT hub
// only under ?rkit=1 (nothing deleted)
const ORGAN = !RKIT && q.get('hub') === '1' && (q.get('play') === 'travel' || q.get('play') === 'game');
const TRAVEL = RKIT && (q.get('play') === 'travel' || q.get('play') === 'game');
const STAGE = !RKIT && (q.get('play') === 'game' || q.get('play') === 'travel' || q.get('play') === 'walk');   // ?play=walk (retired walk adapter) → the stage
const GAME_UI = (TRAVEL || STAGE) && q.get('hud') !== '0';
// the game hides the Lab panel from the first frame (no flash while the world loads); God-Mode shows it again
if (GAME_UI && !DEBUG) document.body.classList.add('game');
if (SHOT && q.get('ui') !== '1') document.body.classList.add('shot');
/** ?world=mvp1: MVP-1 world (KFB Town + Protopia) in its own store; Georg's world stays in kfb.worldbuilder.v1 */
const WORLD = q.get('world') === 'mvp1' ? 'mvp1' : 'main';
const STORE = WORLD === 'mvp1' ? 'kfb.worldbuilder.mvp1.v1' : 'kfb.worldbuilder.v1';
const STORE_PRE_K2 = 'kfb.worldbuilder.v1.pre-k2';
// Stufe 1: terrain only on the MVP-1 islands (Environment pauses until Stufe 1 stands)
if (WORLD === 'mvp1' && !q.get('env')) NATURE.mode = 'none';

const errors: string[] = [], warnings: string[] = [];
addEventListener('error', (e) => errors.push(String(e.message)));
const cw = console.warn.bind(console);
console.warn = (...a: unknown[]) => { warnings.push(a.map(String).join(' ')); cw(...a); };

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: SHOT });
// performance (Steuerung 10.10., perf-probe: GPU pixel work was the limit): pixel ratio capped at 1.5 (Retina ran at 2 = up to
// 4× the pixels); ?prCap= overrides (2 = the old value, for the before measurement)
const PR_CAP = Math.min(devicePixelRatio, Number(q.get('prCap') ?? 1.5));
renderer.setPixelRatio(PR_CAP);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
// shadow contract (Resident Atlas R4 / shadow-fit.v1): PCF with a small filter radius; PCFSoft is silently removed in r18x
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
const SKY = '#96bede';
scene.background = new THREE.Color(SKY);
scene.fog = new THREE.Fog(SKY, 320, 760);

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.5, 2000);
camera.position.set(0, 95, 190);
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
// inspection camera: zoom towards the cursor, short damping so it does not drift after letting go (Georg: lag made details hard to see)
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.zoomToCursor = true;
controls.maxPolarAngle = Math.PI * 0.62;
controls.minDistance = 2;
controls.maxDistance = 600;

// world light: one rig, one state (src/world/light.ts after wd-light.js); ?light=baseline|whackman for comparisons.
// mvp1: the islands are 2–3 × larger, so the haze starts further out (same light, same profile).
const LIGHT = makeWorldLight(scene, renderer, { profile: (q.get('light') as LightProfile) || 'kfb-day', sky: SKY, ...(WORLD === 'mvp1' ? { fogNear: 700, fogFar: 1900 } : {}), ...(q.get('bg') ? { background: '#' + q.get('bg') } : {}) });

/** Global shadow-seam fix (Resident Atlas R4): single-sided casters render their FRONT faces into the shadow map.
 *  three.js defaults to BackSide when shadowSide is null, which leaves a bright rim at every contact. */
export function applyShadowContract(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.castShadow) return;
    for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
      if (mat.side === THREE.FrontSide && mat.shadowSide !== THREE.FrontSide) { mat.shadowSide = THREE.FrontSide; mat.needsUpdate = true; }
    }
  });
}
function clouds(): THREE.Group {
  const R = rng(4242), parts: THREE.BufferGeometry[] = [];
  for (let n = 0; n < 16; n++) {
    const a = R() * Math.PI * 2, rr = 190 + R() * 170;
    const x = Math.cos(a) * rr, z = Math.sin(a) * rr, y = 55 + R() * 60, s = 3.5 + R() * 4, k = 4 + Math.floor(R() * 3);
    for (let j = 0; j < k; j++) {
      const r = s * (0.6 + R() * 0.55) * (j === 0 ? 1.3 : 1), g = blob(r, 3, 0.07, n * 10 + j);
      g.scale(1, 0.82, 1);
      g.translate(x + (j - k / 2) * s * 0.95, y + (R() - 0.2) * s * 0.4, z + (R() - 0.5) * s * 0.8);
      claySeed(g, 3000 + n * 10 + j);
      parts.push(g.toNonIndexed());
    }
  }
  const m = new THREE.Mesh(mergeSimple(parts), mat('nature', '#fff4e2'));
  const g = new THREE.Group();
  g.add(m);
  g.name = 'clouds';
  return g;
}

export class App {
  world: WorldSpec;
  islands = new Map<string, Island>();
  readonly scene = scene;
  readonly camera = camera;
  readonly controls = controls;
  readonly renderer = renderer;
  editor!: Editor;
  private saveT = 0;

  constructor() {
    let w: WorldSpec | null = null;
    if (!SHOT && q.get('reset') !== '1') {
      try { const s = localStorage.getItem(STORE); if (s) w = JSON.parse(s); } catch { /* ignore */ }
    }
    if (WORLD === 'mvp1') {
      this.world = w && w.version === 1 ? w : mvp1World();
      // Lauf 03 (once): recipe fields of the two islands follow the current recipe (form, layout, anchors, terrain,
      // outline, position: Protopia moved onto the bridge axis); buildings, residents and decks stay as edited
      this.world.added ??= [];
      if (!this.world.added.includes('lauf03')) {
        const fresh = mvp1World();
        for (const isl of this.world.islands) { const f = fresh.islands.find((x) => x.id === isl.id); if (f) Object.assign(isl, { form: f.form, layout: f.layout, anchors: f.anchors, terrain: f.terrain, outline: f.outline, pos: f.pos }); }
        this.world.added.push('lauf03');
      }
      return;
    }
    this.world = w && w.version === 1 ? w : defaultWorld();
    // islands added to the default set later are added once to stored worlds
    this.world.added ??= [];
    if (!this.world.added.includes('pyramide')) { this.world.islands.push(pyramidIsland()); this.world.added.push('pyramide'); }
    // v2 (2026-10-08): bigger pyramid island → replace the first version once
    if (!this.world.added.includes('pyramide-v2')) {
      this.world.islands = this.world.islands.filter((i) => i.id !== 'pyramide');
      this.world.islands.push(pyramidIsland());
      this.world.added.push('pyramide-v2');
    }
    // scale contract K1 (2026-10-08): KayKit kit props share the figure factor; seat offsets become host-local units
    // (only stored worlds need it: the default world is already authored in K1)
    if (!(w && w.version === 1)) this.world.added.includes('scale-k1') || this.world.added.push('scale-k1');
    if (!this.world.added.includes('scale-k1')) {
      for (const isl of this.world.islands) {
        const old = new Map(isl.buildings.map((b) => [b.id, b.scale]));
        for (const b of isl.buildings) if (b.asset.startsWith('mummy/')) b.scale = FIG_SCALE;
        const defs = isl.id === 'pyramide' ? pyramidIsland().residents ?? [] : [];
        for (const r of isl.residents ?? []) if (r.seat) {
          const d = defs.find((x) => x.id === r.id && x.seat?.building === r.seat!.building);
          const s = old.get(r.seat.building) ?? 1;
          r.seat.off = d?.seat ? d.seat.off : (r.seat.off.map((v) => +(v / s).toFixed(3)) as [number, number, number]);
        }
      }
      this.world.added.push('scale-k1');
    }
    // scale contract K2 (Stufe 1, 2026-10-10): door buildings to the door rule (catalog-k2.ts). Reversible: the world
    // before the migration is kept under STORE_PRE_K2 (and can be downloaded / restored via __kfb.preK2 / undoScaleK2).
    if (!this.world.added.includes('scale-k2') && !this.world.added.includes('scale-k2-undone')) {
      if (w && !SHOT) { try { if (!localStorage.getItem(STORE_PRE_K2)) localStorage.setItem(STORE_PRE_K2, JSON.stringify(w)); } catch { /* storage full: migration still reversible by factor */ } }
      for (const isl of this.world.islands) for (const b of isl.buildings) {
        const e = CATALOG_K2[b.asset];
        if (!e) continue;
        const k = e.k2 / e.k1;
        (b as any).k2From = { scale: b.scale, pad: b.pad };
        b.scale = +(b.scale * k).toFixed(3); b.pad = +(b.pad * k).toFixed(2);
      }
      this.world.added.push('scale-k2');
    }
  }

  async load(world: WorldSpec) {
    for (const isl of this.islands.values()) { scene.remove(isl.group); isl.dispose(); }
    this.islands.clear();
    this.world = world;
    for (const s of world.islands) await this.addIsland(s, false);
    this.save();
  }

  async addIsland(spec: WorldSpec['islands'][number], push = true) {
    if (push) this.world.islands.push(spec);
    const isl = new Island(spec);
    this.islands.set(spec.id, isl);
    scene.add(isl.group);
    await isl.build();
    return isl;
  }

  removeIsland(id: string) {
    const isl = this.islands.get(id);
    if (!isl) return;
    scene.remove(isl.group);
    isl.dispose();
    this.islands.delete(id);
    this.world.islands = this.world.islands.filter((s) => s.id !== id);
    this.save();
  }

  save() {
    if (SHOT) return;
    clearTimeout(this.saveT);
    this.saveT = window.setTimeout(() => {
      try { localStorage.setItem(STORE, JSON.stringify(this.world)); } catch { /* ignore */ }
    }, 300);
  }

  private originals: THREE.Group | null = null;
  async toggleOriginals(on?: boolean): Promise<boolean> {
    if (!this.originals) { this.originals = await buildOriginalsRow(); this.originals.visible = false; scene.add(this.originals); }
    this.originals.visible = on ?? !this.originals.visible;
    return this.originals.visible;
  }

  setCamera(p: string | number[] | { target: number[]; yaw: number; pitch: number; dist: number } | { pos: number[]; look: number[]; fov?: number }) {
    if (p && typeof p === 'object' && !Array.isArray(p) && 'pos' in p) {
      // fixed camera (critic sets): world position + look-at point
      camera.fov = p.fov ?? 38; camera.updateProjectionMatrix();
      camera.position.set(p.pos[0], p.pos[1], p.pos[2]); controls.target.set(p.look[0], p.look[1], p.look[2]); controls.update();
      return;
    }
    if (p && typeof p === 'object' && !Array.isArray(p)) p = [...p.target, p.yaw, p.pitch, p.dist];
    const isl = typeof p === 'string' ? this.islands.get(p) : null;
    const ref = typeof p === 'string' && p.endsWith('-ref') ? this.islands.get(p.slice(0, -4)) : null;
    if (ref) {
      // reference-like view (DioramaScenes): ~20° above the horizon, whole island + underside in frame
      const [x, y, z] = ref.spec.pos, r = ref.field.radius;
      controls.target.set(x, y - r * 0.36, z);
      camera.position.set(x + r * 0.6, y + r * 0.62, z + r * 3.3);
    } else if (isl) {
      const [x, y, z] = isl.spec.pos, r = isl.field.radius;
      controls.target.set(x, y + 2, z);
      camera.position.set(x + r * 1.5, y + r * 1.05, z + r * 2.0);
    } else if (p === 'compare') {
      controls.target.set(0, -16, 150);
      camera.position.set(30, 150, 520);
    } else if (p === 'overview') {
      controls.target.set(0, -4, -6);
      camera.position.set(10, 110, 200);
    } else if (p === 'under') {
      controls.target.set(0, -12, -6);
      camera.position.set(-30, -28, 175);
    } else if (Array.isArray(p)) {
      const [x, y, z, yaw, pitch, dist] = p;
      controls.target.set(x, y, z);
      camera.position.set(x + Math.sin(yaw) * Math.cos(pitch) * dist, y + Math.sin(pitch) * dist, z + Math.cos(yaw) * Math.cos(pitch) * dist);
    }
    controls.update();
  }
}

async function boot() {
  await initClay();
  const app = new App();
  // V-171 (3) / audit 2a #2: in the organ world the Lab islands and the default clouds are hidden anyway → not built at all (≈ 8 s of the load);
  // ?labIslands=1 builds them as before
  const LAB_ISL = !ORGAN || q.get('labIslands') === '1';
  if (WORLD !== 'mvp1' && LAB_ISL) scene.add(clouds());   // the default clouds sit inside the 250-wide Town; new clouds come with the sky (later)
  if (LAB_ISL) await app.load(app.world);
  {
    // key light + shadow camera fitted to the whole world once it is built
    const box = new THREE.Box3();
    for (const isl of app.islands.values()) box.expandByObject(isl.group);
    if (!box.isEmpty()) LIGHT.keyTo(box);
  }
  // RKIT test island: runtime only (not pushed into app.world, so never saved)
  if ((q.get('hub') === '1' && !ORGAN) || RKIT) await app.addIsland(rkitHubIsland(), false);
  const solo = q.get('solo');
  if (solo) { for (const [id, isl] of app.islands) isl.group.visible = id === solo; const cl = scene.getObjectByName('clouds'); if (cl) cl.visible = false; const si = app.islands.get(solo); if (si) LIGHT.keyTo(new THREE.Box3().setFromObject(si.group)); }
  app.editor = new Editor(app);
  if (q.get('originals') === '1') await app.toggleOriginals(true);
  app.setCamera(q.get('cam') ?? 'overview');
  // Stufe 2 · play mode (?play=walk&island=protopia): the walker owns the camera (provisional follow until the camera module)
  let drive: Awaited<ReturnType<typeof createDrivePlay>> | null = null;
  let travel: Awaited<ReturnType<typeof createTravelPlay>> | null = null;
  let camOverride: { p: THREE.Vector3; t: THREE.Vector3 } | null = null;
  let rockInfo: any = null;   // probe stills (e.g. hands at the wheel): a fixed camera
  // WoW mouse (B0, Georg): raw key state + mouse buttons; RMB steers the figure (A/D strafe), LMB orbits only, both = forward
  const rawKeys: Record<string, boolean> = {}, mouseB = { l: false, r: false }; let wowWas = false;
  let gameHud: GameHud | null = null, god = false, plateName = '', plateShown = '';   // Spiel-Oberfläche (5): HUD R3 in travel, Spiel ↔ God-Mode
  let raceFX: RaceFX | null = null;   // V-128 racer VFX (organ world, FAHREN)
  let audio: AudioOwner | null = null, soundT = 0, sky: Sky | null = null, almanac: Almanac | null = null;   // Klang (6): one AudioContext, island bed + HUD radio
  // a stage: a StreakByte demo island (07 PondLand …) or the water test stage ?stage=lake (B+ Wasser, the Island Kit F2 chain)
  let islandNpcs: IslandNpcs | null = null, islandSong: string | null = null;   // V-202 (?islands=1): residents + island songs
  let organ: OrganWorld | null = null, organDrive: Awaited<ReturnType<typeof createStreamDrive>> | null = null;
  let stage: (Omit<Awaited<ReturnType<typeof buildDemoStage>>, 'info'> & { info: any; update?: () => void }) | null = null, stageSpawn: [number, number, number] | null = null, pondWater: Awaited<ReturnType<typeof pondWaterFromAtlas>> = null;
  if (STAGE) {
    // the demo island as it is (own atlas, no clay), scaled by its measured stage factor; the Lab islands step aside
    if (ORGAN) {
      // C1b+C3: the Organ-Inseln world presented as a stage (group / box / walk surface / spawn); its ring drive and hub floor go to travel
      // V-115 / Steuerung: the build takes ≈ 15 s — the HUD R3 island plate (existing component, kfb-hud.js createHud → setIsland) shows
      // its progress notes while the page would otherwise stay blank; removed when the game HUD mounts
      let loadHud: any = null; if (q.get('hud') !== '0') { const lh = document.createElement('div'); lh.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5'; document.body.appendChild(lh);
        loadHud = (HUD_R3 as any).createHud({ mode: 'walk', host: lh, island: 'Strecke wird gebaut …', fonts: false }); loadHud.host = lh; }
      organ = await createOrganWorld({ scene, renderer, light: LIGHT, onNote: (n) => { if (n) { console.info('[organ]', n); loadHud?.setIsland(n.replace(/ …$/, '')); } } });
      if (loadHud) { loadHud.dispose(); loadHud.host.remove(); }
      organDrive = await createStreamDrive(scene, organ.td, organ.sCar, q.get('car') ?? undefined, { park: q.get('park') !== '0' });   // V-183: parked in the bay
      stage = { name: 'Organ-Inseln', group: organ.W.world, box: organ.box, surface: organ.surface, spawn: organ.spawn, scale: 1.46, info: organ.info } as any;
      camera.far = 9000; camera.updateProjectionMatrix();   // the ring spans ≈ 5 km lab; fog closes it
      LIGHT.setGroundTint?.('#bfae96', 1);   // Steuerung 11.10.: the ring floats in space — no grass bounce under it (TC1 interiors read as J17)
    } else stage = q.get('stage') === 'lake' ? (await buildLakeStage() as any) : await buildDemoStage(q.get('stage') ?? '07');
    // PondLand: the pond is a flat face without a basin → a still-water fluid sheet over it (B+, honest: surface only)
    if (q.get('water') !== '0' && !organ && stage!.name !== 'lake') pondWater = await pondWaterFromAtlas(stage!.group).catch((e) => { warnings.push('pond water: ' + e); return null; });
    for (const isl of app.islands.values()) isl.group.visible = false;
    const cl = scene.getObjectByName('clouds'); if (cl) cl.visible = false;
    scene.add(stage!.group); LIGHT.keyTo(organ ? new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(stage!.spawn[0], organ.hubCentre.y, stage!.spawn[1]), new THREE.Vector3(500, 200, 500)) : stage!.box);
    // spawn: the measured spawn point, else the nearest walkable ground around it
    const S0 = stage!.surface, [sx, sz, sh] = stage!.spawn; let sp: [number, number, number] = [sx, sz, sh];
    // walkable as the walker sees it: ground, and ground ±0.5 around it below 35° (else it spawns on a wall and drops in)
    const okAt = (x: number, z: number) => { const h = S0.at(x, z); if (!h || h.wall) return false; return [[0.5, 0], [-0.5, 0], [0, 0.5], [0, -0.5]].every(([dx, dz]) => { const n = S0.at(x + dx, z + dz); return !!n && !n.wall && Math.abs(n.y - h.y) < 0.35; }); };
    if (!okAt(sx, sz)) outer: for (let r = 1; r < 40; r += 1) for (let a = 0; a < 16; a++) { const x = sx + Math.cos(a / 16 * Math.PI * 2) * r, z = sz + Math.sin(a / 16 * Math.PI * 2) * r; if (okAt(x, z)) { sp = [x, z, sh]; break outer; } }
    stageSpawn = sp;
  }
  // B0 (Steuerung 11.10.): ONE gait scheme — stage and hub both run the J17 travel core (the old walk adapter is retired)
  if (TRAVEL || STAGE) {
    // Stufe 2 · Ein- und Aussteigen (J17 travel core): walk to the car, Space beside it (standing, ≤ R_ENTER) = enter, Space at
    // < 0.5 m/s = exit; on foot W walks, Shift+W runs; in the car the drive keys (Shift = boost)
    // B2: player figure from ?fig= (catalogue id), else the last pick in this browser, else Farmer_A
    let figPick = q.get('fig'); if (!figPick) try { figPick = localStorage.getItem('kfb-figure'); } catch { /* storage blocked */ }
    travel = stage ? await createTravelPlay(app, scene, '', 0, 0, 'none', undefined, { surface: stage.surface, spawn: stageSpawn!, drive: organDrive ?? undefined, baseY: organ ? organ.hubCentre.y - 20 : undefined }, figPick ?? undefined)
      : await createTravelPlay(app, scene, q.get('island') ?? 'rkit_hub', Number(q.get('road') ?? 1), Number(q.get('spawnOff') ?? 4), (q.get('seat') as any) ?? 'none', q.get('car') ?? undefined, undefined, figPick ?? undefined);
    renderer.localClippingEnabled = true;   // open-roof seat cuts the car at the window line
    // V-202 (?islands=1): two residents per play-scene island (original GLBs), ChatterBox triplets when the player arrives
    if (organ?.v202) islandNpcs = await createIslandNpcs({ scene, camera, islands: organ.v202.islands, surfaceAt: travel.surfaceAt, seed: q.get('chatSeed') != null ? Number(q.get('chatSeed')) : (Date.now() & 0xffff) });   // ?chatSeed= pins the lines (tests)
    const K: Record<string, keyof typeof travel.keys> = { KeyW: 'fwd', ArrowUp: 'fwd', KeyS: 'back', ArrowDown: 'back', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', KeyQ: 'strafeL', KeyE: 'strafeR', ShiftLeft: 'shift', ShiftRight: 'shift', ControlLeft: 'ctrl', ControlRight: 'ctrl', Space: 'jump' };
    addEventListener('keydown', (e) => { const k = K[e.code]; if (k && !gameHud?.blocking && !almanac?.open) { (rawKeys as any)[k] = true; (travel!.keys as any)[k] = true; e.preventDefault(); } });
    // a Space tap shorter than a frame must still jump: the release waits for the next frame (B0, parity test)
    addEventListener('keyup', (e) => { const k = K[e.code]; if (!k) return; (rawKeys as any)[k] = false; if (k === 'jump') requestAnimationFrame(() => requestAnimationFrame(() => { travel!.keys.jump = false; })); else (travel!.keys as any)[k] = false; });
    addEventListener('blur', () => { for (const k of Object.keys(travel!.keys)) (travel!.keys as any)[k] = false; });
    // V-199 (Georg 13.10. pressed I): I = enter / exit as in his J17 fallback scheme georgI; Space stays (J17 wsa6); E stays strafing (V-022)
    addEventListener('keydown', (e) => { if (e.code === 'KeyI' && !e.repeat && !gameHud?.blocking && !almanac?.open) { (travel!.core as any).interact(); e.preventDefault(); } });
    // Fels-Bausatz R1 (?rock=default|sandy|dark&rockSeed=): one formation on a grass spot near the spawn, the figure beside
    // it, facing it; the rock's ground line sits at or below the terrain at every footprint sample (nothing floats)
    if (q.get('rock') && !stage) {
      const { buildRockKit, buildRockFormation } = await import('./environment/rock-kit'), rv = (q.get('rock') === '1' ? 'default' : q.get('rock')) as any;
      const kit = q.get('rockKit') === 'r1' ? await buildRockKit({ seed: Number(q.get('rockSeed') ?? 7), variant: rv }) : await buildRockFormation({ seed: Number(q.get('rockSeed') ?? 11), variant: rv });
      scene.add(kit.group);
      const W = travel.walk, HH = 3.64, isl = app.islands.get(q.get('island') ?? 'rkit_hub')!, C0 = isl.spec.pos;
      const ok = (x: number, z: number) => { const h = travel!.surfaceAt(x, z); return !!h && !h.wall && h.role === 'ground' && W.heightAt(x, z) < C0[1] + 50; };
      const Rr = Math.max(...kit.foot.map((f) => Math.hypot(f.x, f.z) + f.r)), p0 = W.walker.state.position.clone();
      const samples = (cx: number, cz: number, rot: number) => kit.foot.flatMap((f) => [0, 1, 2, 3, 4, 5, 6].map((k) => { const a = (k / 7) * Math.PI * 2, lx = f.x + (k ? Math.cos(a) * f.r : 0), lz = f.z + (k ? Math.sin(a) * f.r : 0), c = Math.cos(rot), s2 = Math.sin(rot); return [cx + lx * c + lz * s2, cz - lx * s2 + lz * c]; }));
      let best: any = null;
      for (let d = 0; d < 70 && !best; d += 2) for (let k = 0; k < 16 && !best; k++) {
        // the figure stands ≈ 3 H in front of the rock, a little to its left, facing it: the game camera behind the figure sees
        // the whole formation with the figure for scale, the rock's front (+z) towards the camera
        const a = (k / 16) * Math.PI * 2, fx = p0.x + Math.cos(a) * d, fz = p0.z + Math.sin(a) * d;
        for (const h of [Math.atan2(C0[0] - fx, C0[2] - fz), Math.atan2(C0[0] - fx, C0[2] - fz) + Math.PI / 2, Math.atan2(C0[0] - fx, C0[2] - fz) - Math.PI / 2]) { if (best) break;
        const rx = -Math.cos(h), rz = Math.sin(h), dF = Number(q.get('rockDist') ?? 3.2) * HH, dS = Number(q.get('rockSide') ?? 0.9) * HH, cx = fx + Math.sin(h) * (Rr + dF) + rx * dS, cz = fz + Math.cos(h) * (Rr + dF) + rz * dS, rot = h + Math.PI;   // ?rockDist / rockSide in H
        // open ground from the camera (≈ 3 H behind the figure) to the figure and 1 H around it: no barrier in the shot
        if (![0, 0.5, 1, 1.5, 2, 2.5, 3].every((b) => ok(fx - Math.sin(h) * b * HH, fz - Math.cos(h) * b * HH)) || ![0, 1, 2, 3, 4, 5, 6, 7].every((k2) => ok(fx + Math.cos(k2 * 0.785) * HH, fz + Math.sin(k2 * 0.785) * HH))) continue;
        const S = samples(cx, cz, rot); if (!S.every(([x, z]) => ok(x, z))) continue;
        const gy = S.map(([x, z]) => W.heightAt(x, z)); if (Math.max(...gy) - Math.min(...gy) > 1.6) continue;
        best = { fx, fz, h, cx, cz, rot, gyMin: Math.min(...gy), gyMax: Math.max(...gy) };
      } }
      if (best) { kit.group.position.set(best.cx, best.gyMin - 0.02, best.cz); kit.group.rotation.y = best.rot; W.walker.reset(best.fx, best.fz, W.heightAt(best.fx, best.fz), best.h); }
      rockInfo = { placed: !!best, tris: kit.tris, size: kit.size, recipe: kit.recipe, ...(best ? { groundRangeLab: +(best.gyMax - best.gyMin).toFixed(2), sinkExtraH: +((best.gyMax - best.gyMin) / HH).toFixed(3), floatMaxLab: 0 } : {}) };
    }
  }
  // `play` (the retired walk adapter) stays null: every walking path is the J17 travel core (B0)
  let play: any = null, playCam: ReturnType<typeof createPlayCamera> | null = null;
  if (q.get('play') === 'drive') {
    // Stufe 2 · Fahren: k2b on the road bed (hub roads); keys as Joyride j06 (W/S gas/brake, A/D steer, Q/E drift, Shift boost, Space jump)
    drive = await createDrivePlay(app, scene, q.get('island') ?? 'rkit_hub', Number(q.get('road') ?? 1));
    const K: Record<string, keyof typeof drive.keys> = { KeyW: 'gas', ArrowUp: 'gas', KeyS: 'brake', ArrowDown: 'brake', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', KeyQ: 'driftL', KeyE: 'driftR', ShiftLeft: 'boost', ShiftRight: 'boost', Space: 'jump' };
    addEventListener('keydown', (e) => { const k = K[e.code]; if (k) { drive!.keys[k] = true; e.preventDefault(); } });
    addEventListener('keyup', (e) => { const k = K[e.code]; if (k) drive!.keys[k] = false; });
    addEventListener('blur', () => { for (const k of Object.keys(drive!.keys)) (drive!.keys as any)[k] = false; });
  }
  if (play || drive || travel) {
    controls.enabled = false;
    // game camera (Seed World spring arm + Joyride hand-over, all in H): occlusion against the island bodies and buildings
    const rc = new THREE.Raycaster(), occl: THREE.Object3D[] = [];
    for (const isl of app.islands.values()) isl.group.traverse((o) => { if ((o as THREE.Mesh).isMesh && (/^(ground|under|band|relics)$/.test(o.name) || o.userData.buildingId || o.userData.building)) occl.push(o); });
    if (stage) stage.group.traverse((o) => { if ((o as THREE.Mesh).isMesh && /^solid/.test(o.userData.stageRole ?? '')) occl.push(o); });   // stage: solid props only (the ground is the camera's ground lift, B0)
    playCam = createPlayCamera(camera, {
      // the player's car is a SOFT arm obstacle on foot (Messung 07: the 30/s shortening on a car hit read as a 1.3-lab camera
      // jump when the camera swung behind the parked car): the arm eases in at 5/s; meanwhile the car dithers when it stands
      // between camera and figure, and `avoid` keeps the camera point out of its body
      raycast: (o, d, far) => { rc.set(o, d); rc.far = far; const h = rc.intersectObjects(occl, false)[0]; return h ? h.distance : null; },
      softRaycast: (o, d, far, mode) => { if (mode !== 'walk' || !travel?.carHop) return null; rc.set(o, d); rc.far = far; const h = rc.intersectObjects(travel.carHop.carMeshes, false)[0]; return h ? h.distance : null; },
      avoid: (p, mode) => (mode === 'walk' && travel?.carHop ? travel.carHop.avoid(p) : null),
      // C1 (V-103): FAHREN rides J17's rail chase camera (drive.ts chase); the stage's stand-in car has none → spring camera
      rail: (dt, cam) => !!(travel?.drive as any)?.chase?.(dt, cam),
      // stage: canopies / props are not ground (B0); Lab islands: the island field
      ground: (x, z) => { if (stage) { const h = stage.surface.at(x, z); return h && !h.wall ? h.y : -Infinity; } let y = -Infinity; for (const isl of app.islands.values()) { const P = isl.spec.pos, f: any = isl.field; if (f.sd(x - P[0], z - P[2]) > 0) y = Math.max(y, P[1] + f.height(x - P[0], z - P[2])); } return y; },
    });
    let drag = false, lx = 0, ly = 0;
    // ground controls canon (07.10.): RMB drag = free camera orbit, wheel = smooth zoom
    canvas.addEventListener('contextmenu', (e) => { if (!god) e.preventDefault(); });
    canvas.addEventListener('wheel', (e) => { if (god) return; e.preventDefault(); playCam!.zoomBy(e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1)); }, { passive: false });
    // buttons from the e.buttons mask (sw-mech): a second button pressed while one is held fires no pointerdown, only a pointermove
    const btns = (e: PointerEvent) => { mouseB.l = !!(e.buttons & 1); mouseB.r = !!(e.buttons & 2); drag = mouseB.l || mouseB.r; };
    canvas.addEventListener('pointerdown', (e) => { if (god) return; btns(e); lx = e.clientX; ly = e.clientY; });
    addEventListener('pointerup', (e) => btns(e));
    addEventListener('blur', () => { mouseB.l = mouseB.r = false; drag = false; });
    addEventListener('pointermove', (e) => { const was = drag; btns(e); if (!drag || god) { lx = e.clientX; ly = e.clientY; return; } if (was) playCam!.orbit(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY; });
  }
  // Spiel-Oberfläche (5, Steuerung 10.10. spät): the game shows only the HUD R3; the Lab panel and overlays only with ?debug=1
  // or in God-Mode (G / the MODUS plaque): God-Mode = orbit camera + editor panel, the game stands still
  if (GAME_UI && (travel || play)) {
    app.editor.enabled = false; app.editor.setMode('view');
    if (!DEBUG) document.body.classList.add('game');
    const hudHost = document.createElement('div'); hudHost.id = 'hud'; hudHost.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5'; document.body.appendChild(hudHost);
    const isl = travel && !stage ? app.islands.get(q.get('island') ?? 'rkit_hub')! : null;
    // sound / theme id: Lab island id, or the stage's demo scene (sb.07_pondland)
    const themeId = isl ? isl.spec.id : 'sb.' + stage!.name.replace(/_Demo_/, '_').toLowerCase();
    const themes = q.get('sound') !== '0' || stage ? await loadThemes() : null;
    const keysOf = () => (travel ? travel.keys : play!.keys) as Record<string, boolean>;
    plateName = q.get('islandName') ?? (isl ? (isl.spec.id === 'rkit_hub' ? 'Hub' : isl.spec.name.replace(/\s*\(.*\)\s*$/, '')) : stage!.name.replace(/^\d+_Demo_/, ''));
    gameHud = createGameHud({ host: hudHost, island: plateName, palette: isl?.spec.palette ?? '', biome: themes?.islands[themeId]?.biome,
      onGod: (on) => {
        god = on; for (const k of Object.keys(keysOf())) keysOf()[k] = false;
        app.editor.enabled = on; if (!on) app.editor.setMode('view');
        document.body.classList.toggle('game', !on && !DEBUG);
        controls.enabled = on;
        // V-026 God-Mode: zoom to the cursor, gentle (touchpad + wheel: OrbitControls normalises deltaMode), damped orbit
        if (on) Object.assign(controls, { zoomToCursor: true, zoomSpeed: 0.55, enableDamping: true, dampingFactor: 0.12 });
        // God-Mode opens on the player (figure or car), pulled back to an island view along the current view direction
        if (on) { const f = (travel ? travel.walk : play!).walker.state.position; controls.target.copy(travel?.core.S.mode === 'AUTO' ? travel.drive.car.position : f);
          const d = camera.position.clone().sub(controls.target), L = d.length(); if (L < 60) camera.position.copy(controls.target).addScaledVector(d.normalize(), 60).setY(Math.max(camera.position.y, controls.target.y + 28)); controls.update(); }
      } });
    // default camera (V-025, RollerCoaster v11 „Pet-Position“ slider): God-Mode slider, stored, applied at the start
    if (playCam) gameHud.camControl((v) => playCam!.setDefault(v), 0.2);
    // B2 figure picker (C / FIGUR in the plaque) → swap in the travel core; the pick is remembered in this browser
    gameHud.figureControl(async (id, v) => { const r = await travel!.setFigure(id, v); try { localStorage.setItem('kfb-figure', id); } catch { /* storage blocked */ } return r; }, travel!.figureInfo().id);
    // Klang (6): the island theme file carries biome + sound per island (kfb.island-theme/1); ?soundIsland= tests a mapping
    // (e.g. sb.05_piratecave) on the hub; ?sound=0 = silent
    if (q.get('sound') !== '0') {
      try { audio = createAudioOwner({ theme: themes!, radio: gameHud.hud.radio, bag: gameHud.bag, islandId: q.get('soundIsland') ?? themeId }); }
      catch (e) { warnings.push('audio: ' + e); }
    }
  }
  // Himmel, Licht, Insel-Farben (8+9): on the stage the island theme carries palette, light and sky (?palette= ?time= ?shell= ?clouds=
  // override; ?sky=0 = the old Lab sky); one EnvironmentHost drives the one Lab light rig
  if (stage && q.get('sky') !== '0') {
    const th: any = await loadThemes(), te = th.islands['sb.' + stage.name.replace(/_Demo_/, '_').toLowerCase()] ?? th.islands[th.default];
    const pal = th.palettes?.[q.get('palette') ?? te.palette] ?? null;
    const lamps: THREE.Vector3[] = [];
    stage.group.traverse((o) => { if (/^M_Light/.test(o.name) && o.parent?.parent === stage!.group) { const b = new THREE.Box3().setFromObject(o); lamps.push(new THREE.Vector3((b.min.x + b.max.x) / 2, b.max.y - (b.max.y - b.min.y) * 0.14, (b.min.z + b.max.z) / 2)); } });
    try {
      sky = await createSky({ renderer, scene, camera, light: LIGHT, box: stage.box, palette: pal, shell: (q.get('shell') as any) ?? te.sky?.shell ?? 'tiny', travelVariant: te.sky?.travelVariant,
        auroraElevationDeg: q.get('auroraElev') === 'source' ? null : q.get('auroraElev') != null ? Number(q.get('auroraElev')) : te.sky?.aurora?.elevationDeg,
        variantByTime: te.sky?.variantByTime, clouds: organ ? 0 : Number(q.get('clouds') ?? te.sky?.clouds ?? 10), time: (q.get('time') as SkyTime) ?? te.light?.time ?? 'day', torches: lamps, fogFar: organ ? camera.far * 0.95 : undefined, fogSample: q.get('fogSample') !== '0' });
      gameHud?.timeControl((tm) => sky!.setTime(tm), (q.get('time') as SkyTime) ?? 'day');
      // A10 (V-092): weather KLAR / REGEN (God-Mode chips; ?weather=rain starts in rain)
      const wx = q.get('weather') === 'rain' ? 'rain' : 'clear'; sky.setWeather(wx); gameHud?.weatherControl((w) => sky!.setWeather(w), wx);
      // A10 Lichtkreis (WhackMan Fog of War, light.ts): God-Mode slider, default 60 %, × night weight; ?circle= overrides
      const lk = Number(q.get('circle') ?? 0.6); if (gameHud) gameHud.circleControl((v) => LIGHT.setCircle(v), lk); else LIGHT.setCircle(lk);
    } catch (e) { warnings.push('sky: ' + e); }
  }
  // Fraktaler Almanach (7): collected cards = a list in the game state (gameHud.state.almanac, never in the recipe); until
  // collecting exists a dev seed of 5 cards (?almanac=3,12,27 or ?almanac=0 for none); the fan lives in the HUD element
  if (gameHud && q.get('almanac') !== '0') {
    const ns = (q.get('almanac') ?? '3,12,27,41,56').split(',').map(Number).filter((n) => n > 0);
    gameHud.state.almanac = ns.map((n, i) => ({ deck: 'forget_utopia', n, at: i + 1 }));
    try { almanac = await createAlmanac({ host: gameHud.hud.el, palette: gameHud.hud.palette, list: gameHud.state.almanac }); }
    catch (e) { warnings.push('almanac: ' + e); }
  }
  if (q.get('inspect') === '1') mountInspector(scene, camera, renderer).catch((e) => { console.warn('[inspect]', e); errors.push('inspect: ' + e); });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  let frames = 0, t0 = performance.now(), fps = 0;
  // dynamic resolution (Steuerung 10.10.): down quickly, up slowly (hysteresis, no flicker).
  //  · down: judged every 0.5 s; more than half the frames over 20 ms → straight to the estimated ratio
  //    pr · √(16.7 ms / median frame), quantized to 0.125 steps (at least one step), never below 1.0
  //  · up: three calm 1 s windows in a row (< 5 % of the frames over 18 ms) → one 0.125 step, up to the cap
  //  · after any change a 1 s cooldown. Off for stills (shot=1) unless ?dynres=1; ?dynres=0 = off
  //  · anti-pendulum (Georg live 11.10. „Flackern, auch im Stand“): a ratio that was too slow is not stepped up to again for 60 s, and after a
  //    down-step the way up needs six calm windows instead of three — every change re-sizes the canvas and shifts the whole image's sharpness
  const DYN = q.get('dynres') ? q.get('dynres') === '1' : !SHOT;
  // V-171 (2) flicker package (audit 2b), accepted V-198 (default; ?flk=0 = before): at most ONE down-step per session and never up again — every
  // step re-creates the drawing buffer and moves the clay's fwidth thresholds (the whole image changes sharpness); the shadow contract only
  // when the geometry count changed (not a scene traverse every second); near 1.0 in the organ world outside POV (twice the depth precision)
  // V-198 (Georg 12.10.: flicker PASS): default on; ?flk=0 = before
  const FLK = q.get('flk') !== '0'; let downOnce = false, geoSeen = -1;
  let pr = PR_CAP, lastF = performance.now(), winT = lastF, upT = lastF, calm = 0, cool = 0, upN = 0, upSlow = 0, tooSlow = Infinity, tooSlowT = 0, needCalm = 3;
  const win: number[] = [];
  const setPr = (v: number, now: number) => { pr = v; cool = now + 1000; calm = 0; win.length = 0; upN = upSlow = 0; winT = upT = now; renderer.setPixelRatio(pr); renderer.setSize(innerWidth, innerHeight); };
  const dynRes = (now: number) => {
    const ft = now - lastF; lastF = now; if (!DYN || ft > 250 || now < cool) return;   // a long stall (tab hidden, load) is no measure
    win.push(ft); upN++; if (ft > 18) upSlow++;
    if (now - winT >= 500) {
      const slow = win.filter((x) => x > 20).length / win.length, med = [...win].sort((a, b) => a - b)[win.length >> 1]; win.length = 0; winT = now;
      if (slow > 0.5 && pr > 1.0 && !(FLK && downOnce)) { downOnce = true; const est = Math.floor((pr * Math.sqrt(16.7 / med)) * 8) / 8; tooSlow = pr; tooSlowT = now; needCalm = 6; setPr(Math.max(1.0, Math.min(pr - 0.125, est)), now); return; } }
    if (now - upT >= 1000) { calm = upSlow / upN < 0.05 ? calm + 1 : 0; upN = upSlow = 0; upT = now;
      const next = Math.min(PR_CAP, pr + 0.125); if (!FLK && calm >= needCalm && pr < PR_CAP && !(next >= tooSlow && now - tooSlowT < 60000)) setPr(next, now); } };
  const frameHooks = new Set<(dt: number) => void>();
  // C1b+C3: in the huge organ world the shadow camera follows the player (500 × 200 × 500 lab box, refit twice a second, texel snap in keyTo)
  let organShadowT = 0; const organShadowBox = new THREE.Box3(), organShadowSize = new THREE.Vector3(500, 200, 500);
  const clock = new THREE.Timer();   // THREE.Clock is deprecated in r186 (console warning)
  let contractT = 0;
  renderer.setAnimationLoop(() => {
    clock.update(); const dt = Math.min(0.05, clock.getDelta());
    contractT -= dt;
    if (contractT <= 0) { if (!FLK || renderer.info.memory.geometries !== geoSeen) { applyShadowContract(scene); geoSeen = renderer.info.memory.geometries; } contractT = 1; } // catches meshes added by rebuilds / loads
    for (const isl of app.islands.values()) isl.update(dt);
    if (travel && god) controls.update();
    else if (travel) {
      // WoW mouse scheme: only while a button is held the keys are remapped (scripted probes without buttons stay untouched)
      const TK = travel.keys as any, walking = travel.core.S.mode === 'WALK';
      if (mouseB.r && walking) { TK.left = TK.right = false; TK.strafeL = !!(rawKeys.left || rawKeys.strafeL); TK.strafeR = !!(rawKeys.right || rawKeys.strafeR); TK.turnA = playCam!.absorbYaw() / (2.0 * Math.max(dt, 1e-3)); }
      else { TK.turnA = 0; if (wowWas) { TK.left = !!rawKeys.left; TK.right = !!rawKeys.right; TK.strafeL = !!rawKeys.strafeL; TK.strafeR = !!rawKeys.strafeR; } }
      if (mouseB.l && mouseB.r) TK.fwd = true; else if (wowWas) TK.fwd = !!rawKeys.fwd;
      wowWas = mouseB.l || mouseB.r;
      travel.update(dt);
      const t = travel.camTarget(dt);
      if (playCam!.mode !== t.mode) playCam!.setMode(t.mode);
      if (t.moving || t.mode === 'drive') playCam!.recenter(dt);   // WoW logic (Georg): back behind the actor only while moving
      if (camOverride) { camera.position.copy(camOverride.p); camera.lookAt(camOverride.t); } else playCam!.update(dt, t);
      travel.occlude(dt, camera.position);
      // WoW zoom POV (Steuerung 11.10.): the figure fades softly out when the camera reaches head height and back in when zooming out
      { const pv = playCam!.pov, R = travel.walk.root as any; if (pv > 0.01 && !R.userData.hashed) { R.traverse((o: any) => { if (o.isMesh) for (const m of [].concat(o.material)) { (m as any).userData.op0 ??= (m as any).opacity; if (!(m as any).transparent) { (m as any).alphaHash = true; (m as any).needsUpdate = true; } } }); R.userData.hashed = true; }
        if (R.userData.hashed) { const op0 = Math.max(0, 1 - pv * 1.25), op = op0 > 0.98 ? 1 : op0; if (Math.abs((R.userData.op ?? 1) - op) > 0.01 || (op === 1 && R.userData.op !== 1)) { R.userData.op = op; R.traverse((o: any) => { if (o.isMesh) for (const m of [].concat(o.material)) (m as any).opacity = ((m as any).userData.op0 ?? 1) * op; }); } if (travel.core.S.mode === 'WALK' && !travel.core.S.cut) R.visible = op > 0.02; } }
      if (audio) {
        audio.update(dt);
        // nearest island under the player (twice a second); the bed crossfades when it changes
        if ((soundT -= dt) <= 0 && !q.get('soundIsland') && !stage) { soundT = 0.5; const p = travel.core.S.mode === 'AUTO' ? travel.drive.car.position : travel.walk.walker.state.position;
          for (const [id, il] of app.islands) { const P = il.spec.pos, f: any = il.field; if (f.sd(p.x - P[0], p.z - P[2]) > 0) { audio.setIsland(id); break; } } }
      }
      // V-128 / V-129 (organ track world): racer VFX + sound, radio hand-over walk ↔ drive; ?fx=0 / ?racesfx=0 switch them off (cost A/B)
      if (organ) { const on = travel.core.S.mode === 'AUTO', dv: any = travel.drive, d = dv.driver;
        if (q.get('fx') !== '0') { raceFX ??= createRaceFX(organ.track, camera, { accent: () => '#' + ((organ.mats.pad as any)?.color?.getHexString?.() ?? 'f2b632'), wobble: [organ.mats.strang, organ.mats.strangT].filter(Boolean), trackScale: RACE_W });
          raceFX.update(dt, d, on ? dv.pose() : null, on ? dv.frame.at(d.s) : null, dv.car, on); }
        if (audio) { audio.setDriving(on); if (q.get('racesfx') !== '0') audio.racer(dt, d, travel.carInput(), organ.tunnelWeight(camera.position), on, { joints: organ.td.joints, ds: organ.td.ds, length: dv.frame.L }); } }
      // V-202: residents (trigger, gaze, bubbles) and the island song (zone = island radius, leave 6 lab later)
      if (islandNpcs && organ?.v202) { const S = travel.core.S, pp = S.mode === 'AUTO' ? travel.drive.car.position : travel.walk.walker.state.position; islandNpcs.update(dt, { mode: S.mode, player: pp, playerHead: 2.1 });
        let song: string | null = null; for (const I of organ.v202.islands) { const d = Math.hypot(pp.x - I.centre.x, pp.z - I.centre.z); if (d < I.zoneR || (I.music === islandSong && d < I.zoneR + 6)) song = I.music; }
        islandSong = song; audio?.setIslandSong(song); }
      if (gameHud) { const S = travel.core.S, d = camera.getWorldDirection(new THREE.Vector3()); gameHud.update(dt, { mode: S.mode === 'AUTO' ? 'drive' : 'walk', speedKmh: Math.abs(travel.drive.driver.speed) * 3.6, heading: Math.atan2(d.x, -d.z) }); }
    } else if (drive) {
      drive.update(dt);
      if (playCam!.mode !== 'drive') playCam!.setMode('drive');
      playCam!.update(dt, { position: drive.car.position, heading: drive.heading(), speedK: Math.min(1, Math.abs(drive.driver.speed) / 41) });
    } else if (play && god) controls.update();
    else if (play) {
      play.update(dt);
      const s = play.walker.state;
      if (!s.moving) playCam!.recenter(dt * 0.3);
      if (camOverride) { camera.position.copy(camOverride.p); camera.lookAt(camOverride.t); } else playCam!.update(dt, { position: s.position, heading: s.heading });
      if (gameHud) { const d = camera.getWorldDirection(new THREE.Vector3()); gameHud.update(dt, { mode: 'walk', speedKmh: 0, heading: Math.atan2(d.x, -d.z) }); }
    } else controls.update();
    if (play && audio) audio.update(dt);
    stage?.update?.(); pondWater?.update();
    if (organ) { organ.update(dt, camera); organShadowT -= dt; if (organShadowT <= 0) { organShadowT = 0.5; const f = (travel?.core.S.mode === 'AUTO' ? travel.drive.car.position : travel?.walk.root.position) ?? organ.hubCentre; LIGHT.keyTo(organShadowBox.setFromCenterAndSize(f, organShadowSize)); } }
    if (sky) sky.update(dt, (travel ? travel.walk : play)?.walker.state.position);
    // V-199 (Steuerung: Vorschlag a): the HUD R3 island plate shows the enter / exit key while it applies, else the island name
    if (gameHud && travel) { const S: any = travel.core.S, txt = S.mode === 'WALK' && S.nearCar ? '␣ / I  Einsteigen' : S.mode === 'AUTO' && S.space === 'Aussteigen' && S.spaceOk ? '␣ / I  Aussteigen' : plateName;
      if (txt !== plateShown) { plateShown = txt; gameHud.hud.setIsland(txt); } }
    if (organ) LIGHT.setTunnel?.(organ.tunnelWeight(camera.position));   // C1b+C3: tunnel light preset by the camera's tunnel share (after the sky step)
    if (FLK && organ) { const nr = (playCam?.pov ?? 0) > 0.01 ? 0.5 : 1.0; if (camera.near !== nr) { camera.near = nr; camera.updateProjectionMatrix(); } }
    renderer.render(scene, camera);
    if (sky) sky.after();
    for (const f of frameHooks) f(dt);   // probes (parity): sample in-loop, after render
    frames++;
    const t = performance.now();
    dynRes(t);
    if (t - t0 > 1000) { fps = (frames * 1000) / (t - t0); frames = 0; t0 = t; }
  });

  (window as any).__kfb = {
    ready: true,
    app,
    errors,
    warnings,
    presets: () => ['overview', 'under', 'compare', ...app.islands.keys(), ...[...app.islands.keys()].map((k) => k + '-ref')],
    setCamera: (p: any) => app.setCamera(p),
    setTime: () => null,
    waitIdle: async () => { await new Promise((r) => setTimeout(r, 300)); },
    player: () => null,
    play: () => play,
    playCam: () => playCam,
    drive: () => drive,
    travel: () => travel,
    stage: () => (stage ? { name: stage.name, scale: stage.scale, spawn: stage.spawn, info: stage.info } : null),
    organ: () => organ,
    npcs: () => islandNpcs,
    renderer: () => renderer,   // probes (C1b+C3 frame-cost measurement)
    stageOwner: () => stage,
    water: () => ({ pond: pondWater?.info ?? null, lake: stage?.name === 'lake' ? stage.info : null }),
    three: () => THREE,
    /** debug: the stage surface under x/z (height, role, wall) */
    stageAt: (x: number, z: number) => (stage ? stage.surface.at(x, z) : null),
    sky: () => (sky ? sky.probe() : null),
    almanac: () => (almanac ? almanac.probe() : null),
    almanacOwner: () => almanac,
    skyOwner: () => sky,
    /** probes: a callback after every rendered frame; returns the unsubscribe */
    onFrame: (f: (dt: number) => void) => { frameHooks.add(f); return () => frameHooks.delete(f); },
    hud: () => (gameHud ? { mode: gameHud.hud.getMode(), god, bagOpen: gameHud.bag.isOpen, inventory: gameHud.state.inventory, propContext: gameHud.propContext() } : null),
    gameHud: () => gameHud,
    figure: () => travel?.figureInfo() ?? null,
    setFigure: (id: string, v = 0) => travel?.setFigure(id, v),
    lightCircle: (v?: number) => { if (v != null) LIGHT.setCircle(v); return { intensity: LIGHT.circle.intensity, pos: LIGHT.circle.position.toArray() }; },
    audio: () => (audio ? audio.state() : null),
    race: () => ({ fx: raceFX?.state() ?? null, sfx: audio?.racerState() ?? null }),
    audioOwner: () => audio,
    camPos: () => camera.position.toArray(),
    rock: () => rockInfo,
    camYaw: () => { const d = camera.getWorldDirection(new THREE.Vector3()); return Math.atan2(d.x, d.z); },   // probes: camera turn rate
    camOverride: (p: number[] | null, t?: number[]) => { camOverride = p && t ? { p: new THREE.Vector3(...p), t: new THREE.Vector3(...t) } : null; },
    /** debug: which surfaces lie under a screen pixel (nearest first) */
    pick: (x: number, y: number) => { const rc = new THREE.Raycaster(); rc.setFromCamera(new THREE.Vector2((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1), camera);
      return rc.intersectObjects(scene.children, true).slice(0, 4).map((h) => { const path: string[] = []; let o: THREE.Object3D | null = h.object; while (o && path.length < 5) { path.unshift(o.name || o.type); o = o.parent; } return { d: +h.distance.toFixed(2), path: path.join('/'), role: h.object.userData.rkitRole ?? null, y: +h.point.y.toFixed(2) }; }); },
    measure: (id: string) => {
      const isl = app.islands.get(id)!;
      const g = new THREE.Group();
      for (const name of ['ground', 'under']) { const m = isl.group.getObjectByName(name) as THREE.Mesh; g.add(new THREE.Mesh(m.geometry)); }
      return measure(g, id);
    },
    profile: () => profileClasses(scene, camera, renderer),
    /** kfb.island-outline/1 for RKIT (island-local, lab units, uncarved ground heights) */
    exportOutline: (id: string, step = 1) => exportOutline(app.islands.get(id)!.field, step),
    /** kfb.road-bed/1: apply a road bed (or null to remove) and rebuild the island */
    applyRoadBed: async (id: string, spec: RoadBedSpec | null) => { setRoadBed(id, spec); await app.islands.get(id)!.build(); return { applied: !!app.islands.get(id)!.roadSpec, stale: app.islands.get(id)!.roadStale }; },
    /** RKIT abutments: rock profiles at each bridge root + grass underside line (kfb.island-rim-profiles/1) */
    exportRimProfiles: (id: string) => {
      const isl = app.islands.get(id)!;
      if (!isl.roadSpec) return { error: 'no road bed' };
      const o = exportOutline(isl.field, 4);
      return { schema: 'kfb.island-rim-profiles/1', islandId: id, outlineHash: o.outlineHash, frame: 'island-local', units: 'lab',
        poly: o.poly, terrain: isl.r2d ? 'r2d-v0 (Viertelkreis-Kante + Scholle v7)' : 'old',
        grassUnderside: isl.r2d
          // R2D: the grass ends at the last roll ring (edge − cap, overhang ov); the Scholle starts exactly there
          ? (() => { const T = isl.r2d!.terrain, P = T.geo.attributes.position, row = T.rollRow * T.NA, out: number[][] = []; for (let a = 0; a < T.NA; a += 2) out.push([+P.getX(row + a).toFixed(3), +P.getY(row + a).toFixed(3), +P.getZ(row + a).toFixed(3)]); return out; })()
          : (() => { const gb = grassBottom(isl.field); return isl.field.poly.map((p, i) => [+p[0].toFixed(3), +gb[i].toFixed(3), +p[1].toFixed(3)]); })(),
        roots: exportRimProfiles(isl.group, isl.roadSpec, isl.field.c as [number, number], id) };
    },
    /** RKIT chain: two roots per pier fragment (towards Town / towards Protopia) from the island's `bridge` anchors with a
     *  deck height (id <island>.frag<k>.bridge.<neighbour>); profiles against that fragment's own body only */
    exportFragmentRoots: (id: string) => {
      const isl = app.islands.get(id)!, fr = isl.fragments;
      if (!fr?.subs.length) return { error: 'no fragments' };
      const roots = (isl.spec.anchors ?? []).filter((a) => a.kind === 'bridge' && a.y !== undefined && a.p && a.dir && /\.frag\d+\./.test(a.id)).map((a) => {
        const k = Number(/\.frag(\d+)\./.exec(a.id)![1]), l = Math.hypot(a.dir![0], a.dir![1]) || 1, ax = new THREE.Vector3(a.dir![0] / l, 0, a.dir![1] / l);
        const body: THREE.Object3D[] = []; fr.subs[k]?.traverse((o) => { if ((o as THREE.Mesh).isMesh && /^fragment-(ground|band|under)$/.test(o.name)) body.push(o); });
        const side = ax.x > 0 ? 'east' : 'west';
        return { k, body, root: { meta: { id: `${id}.frag${k}.root.${side}`, anchor: a.id, fragment: `${id}.frag${k}`, side, deckY: a.y }, c: new THREE.Vector3(a.p![0], a.y!, a.p![1]), ax } };
      });
      return { schema: 'kfb.island-rim-profiles/1', islandId: id, frame: 'island-local', units: 'lab', terrain: 'r2d-v0 (Scholle v7, preset P)',
        note: 'pier fragments of the arch chain: two roots each; axis points out of the fragment towards the neighbouring field (gap)',
        rootDepthNote: 'rootDepth = rock under the deck at the root: deckY − lowest underside over u −2…0 (1 m step)',
        roots: roots.flatMap((r) => profileRoots(isl.group, r.body, [r.root])).map((p: any) => {
          const und = (p.longitudinal.underside as number[][]).filter(([u]) => u >= -2 && u <= 0).map(([, y]) => y);
          return { ...p, rootDepth: und.length ? +(p.deckY - Math.min(...und)).toFixed(3) : null };
        }) };
    },
    /** island body (ground, band, under) as GLB, island-local, base64 */
    exportIslandGLB: async (id: string) => {
      const isl = app.islands.get(id)!;
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
      const g = new THREE.Group();
      for (const n of ['ground', 'band', 'under']) { const m = isl.group.getObjectByName(n) as THREE.Mesh; if (m) { const c = new THREE.Mesh(m.geometry, new THREE.MeshStandardMaterial({ vertexColors: true })); c.name = n; g.add(c); } }
      const buf = (await new GLTFExporter().parseAsync(g, { binary: true })) as ArrayBuffer;
      let bin = ''; const u8 = new Uint8Array(buf); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode(...u8.subarray(i, i + 0x8000));
      return btoa(bin);
    },
    /** terrain embedding (Environment kit): register, rebuild the ground, return { ref, down } */
    addEmbed: (id: string, e: any) => { const isl = app.islands.get(id)!; const r = isl.field.addEmbed(e); isl.rebuildGround(); return r; },
    clearEmbeds: (id: string) => { const isl = app.islands.get(id)!; isl.field.clearEmbeds(); isl.rebuildGround(); },
    /** acceptance T1/T2 on the finished island mesh */
    measureRoadBed: (id: string) => {
      const isl = app.islands.get(id)!;
      if (!isl.roadSpec) return { error: isl.roadStale ? 'road bed stale (outline changed)' : 'no road bed' };
      const top = isl.group.getObjectByName('ground') as THREE.Mesh;
      return measureRoadBed(isl.roadSpec, top.geometry, isl.field.road!.seams);
    },
    /** world-space sizes (m) of residents and buildings: scale audit */
    sizes: () => {
      const out: Record<string, number[]> = {};
      const seen = new Set<THREE.Object3D>();
      scene.traverse((o) => {
        const id = o.userData?.residentId ?? o.userData?.buildingId;
        if (!id || seen.has(o) || (o.parent && (o.parent.userData?.residentId ?? o.parent.userData?.buildingId))) return;
        seen.add(o);
        const v = new THREE.Box3().setFromObject(o, true).getSize(new THREE.Vector3());
        out[id] = [+v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2)];
      });
      // Environment Kit R1: largest instance per island and species (lab units)
      for (const [id, isl] of app.islands) for (const s of (isl.env?.sizes() ?? []) as { species: string; role: string; dims: number[] }[]) out[`env:${id}:${s.species}`] = s.dims;
      return out;
    },
    /** kfb.island-config/1: export one island as recipe, import (replace / add) one recipe */
    exportRecipe: (id: string) => specToRecipe(app.islands.get(id)!.spec),
    importRecipe: async (r: IslandRecipe) => {
      const spec = recipeToSpec(r);
      if (app.islands.has(spec.id)) app.removeIsland(spec.id);
      await app.addIsland(spec);
      app.save();
      return spec.id;
    },
    terrainMode: () => TERRAIN.mode,
    /** QA Silhouette set: everything black on white, no fog, landmarks / placeholders hidden ("ohne Landmarke erkennbar") */
    silhouette: (on: boolean) => {
      const black = new THREE.MeshBasicMaterial({ color: '#000000', side: THREE.DoubleSide });
      scene.overrideMaterial = on ? black : null;
      for (const isl of app.islands.values()) for (const o of [...isl.buildingObjs.values(), ...isl.anchorObjs.values()]) o.visible = !on;
      const cl = scene.getObjectByName('clouds'); if (cl) cl.visible = !on;
      if (on) { scene.background = new THREE.Color('#ffffff'); scene.fog = null; } else LIGHT.refresh();
      return on;
    },
    /** K2: catalogue doors (≥ 1.15 H), the stored world before the K2 migration, and the way back */
    k2Doors: () => k2DoorCheck(),
    preK2: () => { try { return localStorage.getItem(STORE_PRE_K2); } catch { return null; } },
    undoScaleK2: async () => {
      for (const isl of app.world.islands) for (const b of isl.buildings) { const f = (b as any).k2From; if (f) { b.scale = f.scale; b.pad = f.pad; delete (b as any).k2From; } }
      app.world.added = (app.world.added ?? []).filter((a) => a !== 'scale-k2').concat('scale-k2-undone');
      await app.load(app.world); return 'K2-Migration zurückgenommen (scale-k2-undone gesetzt, wird nicht erneut migriert)';
    },
    /** Stufe 1 measurements per island: hard rules, road bed T1/T2, contacts (Q1/Q3) */
    qcheck: (id: string) => { const isl = app.islands.get(id)!; return { hard: hardRules(isl), road: roadCheck(isl), contacts: contactCheck(isl), q5: sharpEdges(isl) }; },
    /** the same geometry checks per form fragment (rim, Scholle, Q5) */
    qcheckFragments: (id: string) => {
      const fr = app.islands.get(id)!.fragments;
      if (!fr) return [];
      return fr.specs.map((s, k) => { const q = { group: fr.subs[k], field: fr.fields[k], r2d: fr.grounds[k] };
        return { id: s.id, star: fr.fields[k].plan.star, hard: hardRules(q), q5: sharpEdges(q) }; });
    },
    placeholders: () => placeholderScan(scene),
    /** render now and test a screen region [x0,y0,x1,y1] (0..1) against the island's terrain roles */
    chroma: (id: string, region: [number, number, number, number]) => {
      renderer.render(scene, camera);
      const p = r2dPal(app.islands.get(id)!.spec.palette);
      return paletteChroma(renderer.domElement, [p.grass, p.grass2, p.hill, p.lip, p.sand, p.paved, p.rock, p.earth], region, scene.background instanceof THREE.Color ? '#' + scene.background.getHexString() : undefined);   // sky = the current background (shot background ?bg)
    },
    /** Diagnose Lauf 03 Schritt 0: donor R2D plan through the lab pipeline (no form), other islands hidden; k = scale */
    diagDonor: async (biome: string, k = 1, at: [number, number, number] = [0, 0, 700]) => {
      const { donorGround } = await import('./island/r2d/donor-diag');
      const D = (await (await fetch('/donor-plans.r2d.json')).json())[biome];
      scene.getObjectByName('donor-diag')?.removeFromParent();
      for (const isl of app.islands.values()) isl.group.visible = false;
      const r = donorGround(D, k); r.group.position.set(...at); scene.add(r.group);
      LIGHT.keyTo(new THREE.Box3().setFromObject(r.group));
      return { c0: [r.plan.c0[0] + at[0], at[1], r.plan.c0[1] + at[2]], scholle: r.ground.scholle, NR: r.ground.terrain.NR, NA: r.ground.terrain.NA };
    },
    /** Lauf 03 (G5): labelled scale reference on an island (island-local x/z, yaw): a Medium figure (Resident Atlas base,
     *  Farmer_A, scaled to exactly 1 H = 3.64) beside a K2 door frame (clear height 1.15 H); null removes it */
    scaleRef: async (id: string | null, x = 0, z = 0, yaw = 0) => {
      for (const isl of app.islands.values()) isl.group.getObjectByName('scale-ref')?.removeFromParent();
      if (!id) return null;
      const isl = app.islands.get(id)!, H = 3.64, g = new THREE.Group(); g.name = 'scale-ref';
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const fig = (await new GLTFLoader().loadAsync('/assets/kaykit/figures/Farmer_A_NoEyes.glb')).scene;
      const bb = new THREE.Box3().setFromObject(fig), s = H / (bb.max.y - bb.min.y); fig.scale.setScalar(s); fig.position.set(-1.6, -bb.min.y * s, 0);
      fig.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; } });
      const mat = new THREE.MeshStandardMaterial({ color: '#7b5a3c', roughness: 0.85 }), dh = 1.15 * H, dw = 0.62 * H, t = 0.28;
      const post = (px: number) => { const b = new THREE.Mesh(new THREE.BoxGeometry(t, dh + t, t), mat); b.position.set(px, (dh + t) / 2, 0); b.castShadow = true; return b; };
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(dw + 2 * t, t, t), mat); lintel.position.set(1.6, dh + t / 2, 0);
      const door = new THREE.Group(); door.add(post(1.6 - dw / 2 - t / 2), post(1.6 + dw / 2 + t / 2), lintel);
      const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const cx = c.getContext('2d')!;
      cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, 1024, 256); cx.fillStyle = '#222'; cx.textAlign = 'center'; cx.font = 'bold 64px sans-serif'; cx.fillText('MASSSTAB', 512, 92);
      cx.font = '48px sans-serif'; cx.fillText('Figur 1 H = 3,64 · Tür K2 = 1,15 H', 512, 176);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const lab = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.1), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, side: THREE.DoubleSide })); lab.position.set(0, dh + 1.2, 0); lab.name = 'placeholder-label';
      g.add(fig, door, lab); g.userData.placeholder = 'Maßstab-Referenz (nur Shots)';
      // each part stands on its own ground (on a slope one common base sank the figure into the uphill side)
      const at = (u: number) => [x + Math.cos(yaw) * u, z - Math.sin(yaw) * u] as const;
      const base = (u: number, half: number) => { let m = Infinity; for (const du of [-half, 0, half]) for (const dv of [-0.4, 0.4]) { const [px, pz] = at(u + du); m = Math.min(m, isl.field.height(px + Math.sin(yaw) * dv, pz + Math.cos(yaw) * dv)); } return m; };
      const y = base(0, 2.5), yf = base(-1.6, 0.5), yd = base(1.6, 1.3);
      fig.position.y += yf - y; door.position.y = yd - y;
      g.position.set(x, y, z); g.rotation.y = yaw; isl.group.add(g);
      return { y: +y.toFixed(2), figH: +((bb.max.y - bb.min.y) * s).toFixed(2), doorClear: +dh.toFixed(2) };
    },
    world: () => WORLD,
    /** R2D ground info per island (build times, Scholle, polar net, star shape, mask areas) */
    r2d: (id: string) => {
      const isl = app.islands.get(id)!, g = isl.r2d, f = isl.field as any;
      if (!g) return null;
      return { ms: g.ms, scholle: g.scholle, NR: g.terrain.NR, NA: g.terrain.NA, verts: g.terrain.geo.attributes.position.count, tris: g.terrain.geo.index!.count / 3,
        star: f.plan.star, areas: g.maps.areas, mapN: g.maps.world.image.width, biome: f.biomeRow };
    },
    /** world light: state, profile switch (kfb-day | baseline | whackman) */
    light: (p?: LightProfile) => { if (p) LIGHT.setProfile(p); return { ...LIGHT.state }; },
    stats: () => ({ fps: Math.round(fps), calls: renderer.info.render.calls, tris: renderer.info.render.triangles, islands: app.islands.size, pixelRatio: renderer.getPixelRatio(), shadowMap: (scene.getObjectByName('kfb:light')?.children.find((c) => (c as THREE.DirectionalLight).castShadow) as THREE.DirectionalLight | undefined)?.shadow.mapSize.x ?? null }),
    /** Environment Kit R1: switch nature source ('kit' | 'old') on all islands */
    env: async (mode: 'kit' | 'old') => { NATURE.mode = mode; for (const isl of app.islands.values()) await isl.setNatureMode(mode); return mode; },
    /** per island and species: kit, role, band, normalised height, instance heights in H, sink, triangles */
    envSizes: () => Object.fromEntries([...app.islands].map(([id, isl]) => [id, { biome: isl.env?.biome, species: isl.env?.sizes() ?? [] }])),
    /** grammar checks per island (floating, sink 5–15 %, path bed, water, open zone, landmark highest, free share) */
    envCheck: () => Object.fromEntries([...app.islands].map(([id, isl]) => [id, isl.env?.check() ?? null])),
    /** nature draw calls / triangles split into main pass and shadow pass (renderer.info counts both in one frame) */
    passes: () => {
      const only = (want: (o: THREE.Object3D) => boolean) => {
        const vis: [THREE.Object3D, boolean][] = [];
        scene.traverse((o) => { if ((o as THREE.Mesh).isMesh) { vis.push([o, o.visible]); let p: THREE.Object3D | null = o, hit = false; while (p) { if (want(p)) { hit = true; break; } p = p.parent; } o.visible = o.visible && hit; } });
        const ai = renderer.info.autoReset; renderer.info.autoReset = false;
        const run = (shadow: boolean) => { renderer.shadowMap.autoUpdate = shadow; renderer.shadowMap.needsUpdate = shadow; renderer.info.reset(); renderer.render(scene, camera); return { calls: renderer.info.render.calls, tris: renderer.info.render.triangles }; };
        const frame = run(true), main = run(false);
        renderer.shadowMap.autoUpdate = true; renderer.info.autoReset = ai;
        for (const [o, v] of vis) o.visible = v;
        return { frame, main, shadow: { calls: frame.calls - main.calls, tris: frame.tris - main.tris } };
      };
      return { nature: only((o) => o.name === 'nature'), all: only(() => true) };
    },
  };
}

boot().catch((e) => {
  console.error(e);
  errors.push(String(e?.stack ?? e));
});
