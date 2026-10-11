// One island in the scene: ground, underside, water, nature, placed KayKit buildings. Rebuilt from its spec.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { IslandField, buildTop, buildUnder, buildWater, buildBand, buildPaths } from './terrain';
import { fetchRoadBed, outlineHash, RoadBedField, buildRoadPreview, type RoadBedSpec } from './roadbed';
import { loadRkitParts } from './rkit-parts';
import { NatureBuilder, mat } from './nature';
import { buildResident, type LiveResident } from '../residents/resident';
import { PALETTES } from '../palettes';
import { claySeed, clayMaterial } from '../clay';
import { BIG_CASTLE_K2, type BuildingSpec, type IslandSpec } from './spec';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { R2DIslandField } from './r2d/field';
import { buildR2DGround, type R2DGround } from './r2d/ground';
import { buildFragments } from './r2d/fragments';
import { buildEnvironment, prepareEnvironment, ISLAND_BIOME, PALETTE_BIOME, BIOMES, type BiomeId, type Environment } from '../environment';

/** Nature source: 'old' = procedural NatureBuilder (default), 'kit' = Environment Kit R1 (?env=kit), 'none' = no nature (?env=none). */
const URLQ = new URLSearchParams(location.search);
// default 'old' until Georg's PASS on the environment concept (2026-10-08); ?env=kit shows the kit environment for comparison
export const NATURE = { mode: (URLQ.get('env') === 'kit' ? 'kit' : URLQ.get('env') === 'none' ? 'none' : 'old') as 'kit' | 'old' | 'none', mix: URLQ.get('envmix') === '1' };
/** terrain source: R2D v0 port (default since Stufe 1), ?terrain=old = the previous Delaunay terrain until Stufe 1 is accepted */
export const TERRAIN = { mode: (URLQ.get('terrain') === 'old' ? 'old' : 'r2d') as 'old' | 'r2d' };
/** ?biome=canyon:snow,otown:park overrides the island → biome table */
const BIOME_OVERRIDE = new Map((URLQ.get('biome') ?? '').split(',').filter((x) => x.includes(':')).map((x) => x.split(':') as [string, BiomeId]));

const loader = new GLTFLoader();
const MODELS = new Map<string, Promise<THREE.Object3D>>();

/** Load a KayKit model once; normalised so its footprint is centred and its base sits at y = 0. Clay applied. */
const fbx = new FBXLoader();
const texLoader = new THREE.TextureLoader();

/** Retro Cartoon Cars (Unity, RCC Design): FBX + one body texture; glass/lights by material name; ≈6 m long (cartoon scale next to 1.9 m figures). */
export function loadCar(asset: string): Promise<THREE.Object3D> {
  const dir = asset.slice(0, asset.lastIndexOf('/') + 1), name = asset.split('/')[1].toUpperCase();
  const tex = texLoader.load('/assets/' + dir + name + '.jpg');
  tex.colorSpace = THREE.SRGBColorSpace;
  return fbx.loadAsync('/assets/' + asset).then((root) => {
    const body = clayMaterial('model', new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.05 }));
    const glass = new THREE.MeshStandardMaterial({ color: '#2a3b4c', roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.55 });
    const head = new THREE.MeshStandardMaterial({ color: '#fff4d0', emissive: '#fff0c0', emissiveIntensity: 0.6 });
    const tail = new THREE.MeshStandardMaterial({ color: '#e0302a', emissive: '#c02018', emissiveIntensity: 0.5 });
    const chrome = new THREE.MeshStandardMaterial({ color: '#d8dde2', roughness: 0.25, metalness: 0.8 });
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const pick = (mm: THREE.Material) => {
        const n = (mm.name || '').toLowerCase();
        return n.includes('glass') ? glass : n.includes('headlight') ? head : n.includes('taillight') ? tail : n.includes('chrome') || n.includes('mirror') ? chrome : body;
      };
      m.material = Array.isArray(m.material) ? m.material.map(pick) : pick(m.material);
      claySeed(m.geometry, 3);
      m.castShadow = m.receiveShadow = true;
    });
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const k = 6.0 / Math.max(size.x, size.z);
    const inner = new THREE.Group();
    root.position.set(-c.x, -box.min.y, -c.z);
    inner.add(root);
    inner.scale.setScalar(k);
    const wrap = new THREE.Group();
    wrap.add(inner);
    return wrap;
  });
}

export function loadModel(asset: string, normalise = true): Promise<THREE.Object3D> {
  let p = MODELS.get(asset);
  if (!p && asset.startsWith('cars/')) { p = loadCar(asset); MODELS.set(asset, p); }
  if (!p) {
    p = loader.loadAsync('/assets/kaykit/' + asset).then((gltf) => {
      const root = gltf.scene;
      if (!normalise) {
        root.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = m.receiveShadow = true; } });
        return root;
      }
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root);
      const c = box.getCenter(new THREE.Vector3());
      const wrap = new THREE.Group();
      root.position.set(-c.x, -box.min.y, -c.z);
      wrap.add(root);
      let seed = 1;
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        claySeed(m.geometry, seed++);
        const src = m.material as THREE.MeshStandardMaterial;
        m.material = clayMaterial('model', src);
        m.castShadow = m.receiveShadow = true;
      });
      return wrap;
    });
    MODELS.set(asset, p);
  }
  return p;
}

/** Labelled grey placeholder in footprint and height of the Big Castle × 2.2 (Steuerung F6, Q7: labelled = allowed). */
function placeholderCastle(): THREE.Object3D {
  const { w, d, h } = BIG_CASTLE_K2, g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, 3), new THREE.MeshStandardMaterial({ color: '#9a9ca2', roughness: 0.9 }));
  body.position.y = h / 2 - 0.15; body.castShadow   // set 0.15 into the pad (foundation), no floating rounded base = body.receiveShadow = true; body.name = 'placeholder';
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d')!; x.fillStyle = '#9a9ca2'; x.fillRect(0, 0, 1024, 512); x.fillStyle = '#ffffff';
  x.font = 'bold 96px sans-serif'; x.textAlign = 'center'; x.fillText('PLATZHALTER', 512, 190);
  x.font = '60px sans-serif'; x.fillText('Big Castle × 2,2', 512, 300); x.fillText(`${w} × ${d} × ${h} LE (Stufe 2)`, 512, 390);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  for (const z of [d / 2 + 0.05, -d / 2 - 0.05]) {
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.8, w * 0.4), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    lab.position.set(0, h * 0.55, z); if (z < 0) lab.rotation.y = Math.PI; lab.name = 'placeholder-label'; g.add(lab);
  }
  g.add(body); g.userData.placeholder = 'Big Castle × 2,2';
  return g;
}

/** labelled bridge head at a road anchor (Stufe 2 builds the bridge): the path visibly ends at something */
function placeholderBridgeHead(id: string): THREE.Object3D {
  const g = new THREE.Group(), W = 9, L = 7, H = 1.6;
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, L, 3, 0.5), new THREE.MeshStandardMaterial({ color: '#9a9ca2', roughness: 0.9 }));
  body.name = 'placeholder'; body.castShadow = body.receiveShadow = true;
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
  const x = c.getContext('2d')!; x.fillStyle = '#9a9ca2'; x.fillRect(0, 0, 1024, 256); x.fillStyle = '#ffffff'; x.textAlign = 'center';
  x.font = 'bold 84px sans-serif'; x.fillText('BRÜCKENKOPF', 512, 110); x.font = '46px sans-serif'; x.fillText(id + ' · Stufe 2', 512, 200);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.9, W * 0.225), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  lab.rotation.x = -Math.PI / 2; lab.position.y = H / 2 + 0.03; lab.name = 'placeholder-label';
  g.add(body, lab); g.userData.placeholder = 'Brückenkopf ' + id; g.userData.anchorMark = id;
  return g;
}

export class Island {
  readonly group = new THREE.Group();
  field!: IslandField;
  private groundMeshes: THREE.Mesh[] = [];
  readonly buildingObjs = new Map<string, THREE.Object3D>();
  private nature: THREE.Object3D | null = null;
  env: Environment | null = null;
  private stamp = 0;
  /** applied road bed (null = none) and whether a stored one no longer matches the outline */
  roadSpec: RoadBedSpec | null = null;
  roadStale = false;
  private envT = 0;
  /** R2D ground (top + Scholle + water), null on the old terrain */
  r2d: R2DGround | null = null;
  /** form fragments (broken-off clods), own top + Scholle each */
  fragments: ReturnType<typeof buildFragments> | null = null;

  constructor(public spec: IslandSpec) {
    this.group.name = 'island:' + spec.id;
    this.group.userData.islandId = spec.id;
  }

  get palette() {
    return PALETTES[this.spec.palette] ?? PALETTES.canyon;
  }

  /** Full rebuild (outline, terrain or palette changed). Buildings are kept and re-grounded. */
  async build(withNature = true): Promise<void> {
    const my = ++this.stamp;
    this.group.position.set(...this.spec.pos);
    // road bed from RKIT (kfb.road-bed/1), only if it was computed against this exact outline
    const rb = await fetchRoadBed(this.spec.id);
    let road: RoadBedField | null = null;
    this.roadSpec = null; this.roadStale = false;
    if (rb) {
      const h = outlineHash(new IslandField(this.spec));
      if (h === rb.outlineHash) { road = new RoadBedField(rb); this.roadSpec = rb; }
      else { this.roadStale = true; console.warn(`[roadbed] ${this.spec.id}: Straßenbett veraltet (outline ${h} ≠ ${rb.outlineHash}), nicht angewendet`); }
    }
    // RKIT abutment cuts (anchors with `cut`): resolved into form.niches before the field is built
    const cutAnchors = (this.spec.anchors ?? []).filter((a) => a.cut);
    if (cutAnchors.length) {
      const niches: NonNullable<NonNullable<IslandSpec['form']>['niches']> = [];
      for (const a of cutAnchors) {
        // a missing cut file (retired) is skipped silently (Vite answers a missing file with index.html, not 404)
        try { const r = await fetch('/roadbeds/' + a.cut); if (!r.ok || !/json/.test(r.headers.get('content-type') ?? '')) continue; const c = await r.json(); niches.push({ root: c.root ?? a.id, plan: c.plan, soleY: c.soleY }); }
        catch (e) { console.warn('[niche]', this.spec.id, a.cut, e); }
      }
      this.spec.form = { ...(this.spec.form ?? {}), niches };
    }
    if (my !== this.stamp) return;
    this.field = TERRAIN.mode === 'r2d' ? new R2DIslandField(this.spec, road) : new IslandField(this.spec, road);
    for (const m of this.groundMeshes) { this.group.remove(m); m.geometry.dispose(); }
    this.groundMeshes = [];
    this.r2d?.dispose(); this.r2d = null;
    if (this.field instanceof R2DIslandField) {
      this.r2d = buildR2DGround(this.field, this.spec);
      this.groundMeshes.push(...this.r2d.meshes);
      if (this.fragments) { this.group.remove(this.fragments.group); this.fragments.grounds.forEach((g) => g.dispose()); }
      this.fragments = buildFragments(this.field, this.spec);
      this.group.add(this.fragments.group);
    } else {
      const pal = this.palette;
      const top = new THREE.Mesh(claySeed(buildTop(this.field, pal), 7), mat('terrain', '#ffffff', { vertexColors: true }));
      top.name = 'ground';
      top.receiveShadow = true; top.castShadow = true;
      top.userData.islandId = this.spec.id;
      const under = new THREE.Mesh(claySeed(buildUnder(this.field, pal), 8), mat('terrain', '#ffffff', { vertexColors: true }));
      under.name = 'under';
      under.castShadow = true; under.receiveShadow = true;
      under.userData.islandId = this.spec.id;
      const band = new THREE.Mesh(claySeed(buildBand(this.field, pal), 11), mat('terrain', '#ffffff', { vertexColors: true }));
      band.name = 'band';
      band.castShadow = true; band.receiveShadow = true;
      const paths = new THREE.Mesh(claySeed(buildPaths(this.field), 12), mat('terrain', pal.path));
      paths.name = 'paths';
      paths.receiveShadow = true;
      this.groundMeshes.push(top, under, band, paths);
      if (this.roadSpec) {
        // preview of the road body from RKIT's stations until the GLB arrives
        const rp = new THREE.Mesh(buildRoadPreview(this.roadSpec), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide }));
        rp.name = 'road-preview';
        rp.receiveShadow = true; rp.castShadow = true;
        this.groundMeshes.push(rp);
      }
      const wg = buildWater(this.field);
      if (wg) {
        const water = new THREE.Mesh(claySeed(wg, 10), mat('water', pal.water, { roughness: 0.35, transparent: true, opacity: 0.92 }));
        water.receiveShadow = true;
        water.name = 'water';
        this.groundMeshes.push(water);
      }
    }
    for (const m of this.groundMeshes) this.group.add(m);
    if (withNature && NATURE.mode === 'old') this.rebuildNature();
    await this.syncBuildings();
    this.syncAnchorMarks();
    await this.syncRkitParts(my);
    // the kit environment needs the landmark's height (no tree above it), so it follows the buildings
    if (withNature && NATURE.mode === 'kit' && my === this.stamp) await this.rebuildEnvironment(my);
    await this.syncResidents();
    if (my !== this.stamp) return;
  }

  private dropNature() {
    if (this.env) { this.env.dispose(); this.env = null; }
    if (this.nature) {
      this.group.remove(this.nature);
      this.nature.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
      this.nature = null;
    }
  }

  rebuildNature() {
    this.dropNature();
    this.nature = new NatureBuilder(this.field, this.palette).build();
    this.group.add(this.nature);
  }

  get biome(): BiomeId {
    const b = BIOME_OVERRIDE.get(this.spec.id) ?? ISLAND_BIOME[this.spec.id] ?? PALETTE_BIOME[this.spec.palette] ?? 'forest';
    return BIOMES[b] ? b : 'forest';
  }

  /** Environment Kit R1: kit species, Rule-of-Three placement, two BatchedMeshes (casters / rest). */
  async rebuildEnvironment(my = this.stamp) {
    const biome = this.biome;
    await prepareEnvironment(biome, NATURE.mix);
    if (my !== this.stamp) return;
    const lm = this.spec.buildings[0] ? this.buildingObjs.get(this.spec.buildings[0].id) : null;
    let landmarkH: number | undefined;
    if (lm) { lm.updateMatrixWorld(true); landmarkH = new THREE.Box3().setFromObject(lm, true).getSize(new THREE.Vector3()).y; }
    this.dropNature();
    try {
      this.env = buildEnvironment({ field: this.field, palette: this.palette, biome, seed: this.spec.seed, recipe: { landmarkH, mix: NATURE.mix } });
    } catch (e) {
      console.warn('[env] no nature on', this.spec.id, e); // a broken recipe must never take the island down
      return;
    }
    this.nature = this.env.object;
    this.group.add(this.nature);
  }

  /** switch nature source in place (before/after comparisons in one session) */
  async setNatureMode(mode: 'kit' | 'old') {
    if (mode === 'old') this.rebuildNature();
    else await this.rebuildEnvironment();
  }

  /** RKIT built parts (kfb.rkit-parts/1) for roads that name them in the road bed (`builtParts`) */
  rkitParts: THREE.Object3D[] = [];
  rkitColours: Record<string, string> = {};
  async syncRkitParts(my = this.stamp) {
    for (const o of this.rkitParts) this.group.remove(o);
    this.rkitParts = [];
    const files = [...new Set((this.roadSpec?.roads ?? []).map((r) => r.builtParts?.split(' ')[0]).filter(Boolean) as string[])].map((g) => g.replace(/\.glb$/, '.json'));
    // abutment parts stand in the niche: only where the island carries the cut (rkit_hub.abutment-cut.json → .abutment.parts.json)
    if (this.spec.form?.niches?.length) for (const a of this.spec.anchors ?? []) if (a.cut) files.push(a.cut.replace(/-cut\.json$/, '.parts.json'));
    for (const json of files) {
      const glb = json;
      try {
        const { group, colours } = await loadRkitParts('/roadbeds/' + json, this.spec.palette);
        if (my !== this.stamp) return;
        this.group.add(group); this.rkitParts.push(group); Object.assign(this.rkitColours, colours);
      } catch (e) { console.warn('[rkit-parts]', this.spec.id, glb, e); }
    }
  }

  readonly anchorObjs = new Map<string, THREE.Object3D>();
  /** road anchors get a labelled bridge-head placeholder, sunk so its lowest corner touches the ground */
  syncAnchorMarks() {
    for (const o of this.anchorObjs.values()) this.group.remove(o);
    this.anchorObjs.clear();
    for (const a of this.spec.anchors ?? []) {
      if ((a.kind !== 'road' && a.kind !== 'bridge') || !a.p || a.y !== undefined) continue;   // pier anchors (with deck height) hang over the gap: no placeholder on the ground
      const o = placeholderBridgeHead(a.id), d = a.dir ?? [1, 0], yaw = Math.atan2(d[0], d[1]);
      let hMin = Infinity, hMax = -Infinity;
      for (const [u, v] of [[-4.5, -3.5], [4.5, -3.5], [-4.5, 3.5], [4.5, 3.5], [0, 0]]) {
        const x = a.p[0] - d[0] * 5 + Math.cos(yaw) * u + Math.sin(yaw) * v, z = a.p[1] - d[1] * 5 - Math.sin(yaw) * u + Math.cos(yaw) * v, h = this.field.height(x, z);
        hMin = Math.min(hMin, h); hMax = Math.max(hMax, h);
      }
      o.position.set(a.p[0] - d[0] * 5, hMin + 0.8 - 0.25, a.p[1] - d[1] * 5); o.rotation.y = yaw;   // fully on land, behind the rim / abutment face
      o.userData.sink = +(hMax - hMin + 0.25).toFixed(2);
      this.group.add(o); this.anchorObjs.set(a.id, o);
    }
  }

  /** Create / update / remove building objects to match the spec. */
  async syncBuildings(): Promise<void> {
    const want = new Set(this.spec.buildings.map((b) => b.id));
    for (const [id, o] of this.buildingObjs) if (!want.has(id)) { this.group.remove(o); this.buildingObjs.delete(id); }
    for (const b of this.spec.buildings) {
      let o = this.buildingObjs.get(b.id);
      if (!o || o.userData.asset !== b.asset) {
        if (o) this.group.remove(o);
        o = new THREE.Group();
        if (b.asset === 'proc:placeholder-castle') o.add(placeholderCastle());
        else if (b.asset === 'proc:pyramid') o.add(NatureBuilder.pyramid(this.palette, 40, this.spec.seed)); // 40 m base: +80 % over the first 22 m, fits the 94 m island
        else o.add((await loadModel(b.asset)).clone());
        o.userData = { buildingId: b.id, islandId: this.spec.id, asset: b.asset };
        for (const [node, t] of Object.entries(b.parts ?? {})) {
          const n = o.getObjectByName(node);
          if (!n) continue;
          n.position.add(new THREE.Vector3(...t.off));
          if (t.rot) n.rotation.set(n.rotation.x + THREE.MathUtils.degToRad(t.rot[0]), n.rotation.y + THREE.MathUtils.degToRad(t.rot[1]), n.rotation.z + THREE.MathUtils.degToRad(t.rot[2]));
        }
        o.name = 'building:' + b.id;
        this.group.add(o);
        this.buildingObjs.set(b.id, o);
      }
      this.placeBuilding(b, o);
    }
  }

  private residents = new Map<string, LiveResident>();

  /** Residents after the Resident Atlas: NoEyes figure + KFB Eye-Rig v6, clay, clip, hand prop, seat. */
  async syncResidents(): Promise<void> {
    const list = this.spec.residents ?? [];
    for (const [id, lr] of this.residents) if (!list.some((r) => r.id === id)) { this.group.remove(lr.obj); this.residents.delete(id); }
    for (const r of list) {
      let lr = this.residents.get(r.id);
      if (!lr) {
        lr = await buildResident(r);
        lr.obj.userData.islandId = this.spec.id;
        this.group.add(lr.obj);
        this.residents.set(r.id, lr);
      }
      lr.obj.rotation.set(0, r.rot, 0);
      const host = r.seat ? this.buildingObjs.get(r.seat.building) : null;
      if (host && r.seat) {
        // hips onto the seat point, given in the host's local units (follows the host's scale)
        const seatW = new THREE.Vector3(...r.seat.off).multiplyScalar(host.scale.x).applyAxisAngle(new THREE.Vector3(0, 1, 0), host.rotation.y).add(host.position);
        lr.obj.position.set(0, 0, 0);
        lr.obj.updateMatrixWorld(true);
        const hips = lr.obj.getObjectByName('hips') ?? lr.obj;
        const hw = hips.getWorldPosition(new THREE.Vector3()).sub(this.group.getWorldPosition(new THREE.Vector3()));
        lr.obj.position.copy(seatW).sub(hw);
        lr.obj.rotation.y = host.rotation.y + r.rot;
      } else lr.obj.position.set(r.x, this.field.height(r.x, r.z), r.z);
    }
  }

  /** Rebuild only the top surface (after terrain embeds changed); buildings and nature stay. */
  rebuildGround() {
    if (this.field instanceof R2DIslandField) {
      for (const m of this.groundMeshes) { this.group.remove(m); m.geometry.dispose(); }
      this.r2d?.dispose();
      this.r2d = buildR2DGround(this.field, this.spec);
      this.groundMeshes = [...this.r2d.meshes];
      for (const m of this.groundMeshes) this.group.add(m);
      return;
    }
    const old = this.group.getObjectByName('ground') as THREE.Mesh | undefined;
    if (!old) return;
    const g = claySeed(buildTop(this.field, this.palette), 7);
    old.geometry.dispose();
    old.geometry = g;
    // rim rocks change the grass band too
    const band = this.group.getObjectByName('band') as THREE.Mesh | undefined;
    if (band) { band.geometry.dispose(); band.geometry = claySeed(buildBand(this.field, this.palette), 11); }
  }

  update(dt: number) {
    this.envT += dt;
    this.env?.update(this.envT);
    for (const lr of this.residents.values()) lr.update(dt);
  }

  placeBuilding(b: BuildingSpec, o = this.buildingObjs.get(b.id)) {
    if (!o) return;
    // old terrain: paths are pressed in, so a building stands on the unpressed ground + 0.07; R2D: one height
    const gy = this.field instanceof R2DIslandField ? this.field.height(b.x, b.z) : Math.max(this.field.height(b.x, b.z), this.field.base(b.x, b.z) + 0.07);
    o.position.set(b.x, gy + b.y, b.z);
    o.rotation.set(0, b.rot, 0);
    o.scale.setScalar(b.scale);
  }

  /** World-space ground height at world (x, z), or null if outside. */
  groundAtWorld(wx: number, wz: number): number | null {
    const x = wx - this.spec.pos[0], z = wz - this.spec.pos[2];
    if (this.field.sd(x, z) <= 0) return null;
    return this.field.height(x, z) + this.spec.pos[1];
  }

  get groundObjects(): THREE.Object3D[] {
    return this.groundMeshes.filter((m) => m.name === 'ground' || m.name === 'under');
  }

  dispose() {
    this.group.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
  }
}
