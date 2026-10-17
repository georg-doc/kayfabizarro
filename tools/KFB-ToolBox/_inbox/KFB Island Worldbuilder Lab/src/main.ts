// KFB Island Worldbuilder Lab · boot: renderer, Joyride light, sky, clouds, islands from the world JSON, editor.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initClay } from './clay';
import { Island, NATURE } from './island/island';
import { defaultWorld, pyramidIsland, rkitHubIsland, type WorldSpec } from './island/spec';
import { grassBottom } from './island/terrain';
import { exportOutline, measureRoadBed, setRoadBed, exportRimProfiles, type RoadBedSpec } from './island/roadbed';
import { blob, mat } from './island/nature';
import { rng } from './island/noise';
import { mergeSimple } from './island/terrain';
import { claySeed } from './clay';
import { Editor } from './editor';
import { measure } from './island/measure';
import { buildOriginalsRow } from './island/originals-layer';
import { profileClasses, mountInspector } from './inspect';
import { FIG_SCALE } from './scale';

const q = new URLSearchParams(location.search);
const SHOT = q.get('shot') === '1';
if (SHOT && q.get('ui') !== '1') document.body.classList.add('shot');
const STORE = 'kfb.worldbuilder.v1';

const errors: string[] = [], warnings: string[] = [];
addEventListener('error', (e) => errors.push(String(e.message)));
const cw = console.warn.bind(console);
console.warn = (...a: unknown[]) => { warnings.push(a.map(String).join(' ')); cw(...a); };

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: SHOT });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
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

// Joyride light: warm sun from upper left, soft sky fill, warm bounce
const hemi = new THREE.HemisphereLight('#dfeeff', '#c7a790', 1.25);
scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1dc', 2.4);
sun.position.set(-120, 180, 90);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
const sc = sun.shadow.camera;
sc.left = -150; sc.right = 150; sc.top = 150; sc.bottom = -150; sc.near = 10; sc.far = 600;
// shadow-fit.v1 world scale: normalBias = 1.2 × shadow-map texel, bias −0.00003 (the old 0.6 normalBias opened bright seams at contacts)
const texel = (sc.right - sc.left) / sun.shadow.mapSize.x;
sun.shadow.bias = -0.00003;
sun.shadow.normalBias = 1.2 * texel;
sun.shadow.radius = 2;
sun.shadow.blurSamples = 12;

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
scene.add(sun, sun.target);
// soft fill from below-front so the torn-earth undersides read (no shadows)
const fill = new THREE.DirectionalLight('#ffe2c4', 0.9);
fill.position.set(160, -60, 60);
scene.add(fill);

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

  setCamera(p: string | number[] | { target: number[]; yaw: number; pitch: number; dist: number }) {
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
  scene.add(clouds());
  await app.load(app.world);
  // RKIT test island: runtime only (not pushed into app.world, so never saved)
  if (q.get('hub') === '1') await app.addIsland(rkitHubIsland(), false);
  const solo = q.get('solo');
  if (solo) { for (const [id, isl] of app.islands) isl.group.visible = id === solo; scene.getObjectByName('clouds')!.visible = false; }
  app.editor = new Editor(app);
  if (q.get('originals') === '1') await app.toggleOriginals(true);
  app.setCamera(q.get('cam') ?? 'overview');
  if (q.get('inspect') === '1') mountInspector(scene, camera, renderer).catch((e) => { console.warn('[inspect]', e); errors.push('inspect: ' + e); });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  let frames = 0, t0 = performance.now(), fps = 0;
  const clock = new THREE.Clock();
  let contractT = 0;
  renderer.setAnimationLoop(() => {
    const dt = Math.min(0.05, clock.getDelta());
    contractT -= dt;
    if (contractT <= 0) { applyShadowContract(scene); contractT = 1; } // catches meshes added by rebuilds / loads
    for (const isl of app.islands.values()) isl.update(dt);
    controls.update();
    renderer.render(scene, camera);
    frames++;
    const t = performance.now();
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
        poly: o.poly, grassUnderside: (() => { const gb = grassBottom(isl.field); return isl.field.poly.map((p, i) => [+p[0].toFixed(3), +gb[i].toFixed(3), +p[1].toFixed(3)]); })(),
        roots: exportRimProfiles(isl.group, isl.roadSpec, isl.field.c as [number, number]) };
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
    stats: () => ({ fps: Math.round(fps), calls: renderer.info.render.calls, tris: renderer.info.render.triangles, islands: app.islands.size }),
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
