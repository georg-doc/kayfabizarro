// One island in the scene: ground, underside, water, nature, placed KayKit buildings. Rebuilt from its spec.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { IslandField, buildTop, buildUnder, buildWater, buildBand, buildPaths } from './terrain';
import { fetchRoadBed, outlineHash, RoadBedField, buildRoadPreview, type RoadBedSpec } from './roadbed';
import { NatureBuilder, mat } from './nature';
import { buildResident, type LiveResident } from '../residents/resident';
import { PALETTES } from '../palettes';
import { claySeed, clayMaterial } from '../clay';
import type { BuildingSpec, IslandSpec } from './spec';
import { buildEnvironment, prepareEnvironment, ISLAND_BIOME, PALETTE_BIOME, BIOMES, type BiomeId, type Environment } from '../environment';

/** Nature source: 'old' = procedural NatureBuilder (default), 'kit' = Environment Kit R1 (?env=kit), 'none' = no nature (?env=none). */
const URLQ = new URLSearchParams(location.search);
// default 'old' until Georg's PASS on the environment concept (2026-10-08); ?env=kit shows the kit environment for comparison
export const NATURE = { mode: (URLQ.get('env') === 'kit' ? 'kit' : URLQ.get('env') === 'none' ? 'none' : 'old') as 'kit' | 'old' | 'none', mix: URLQ.get('envmix') === '1' };
/** ?biome=canyon:snow,otown:park overrides the island → biome table */
const BIOME_OVERRIDE = new Map((URLQ.get('biome') ?? '').split(',').filter((x) => x.includes(':')).map((x) => x.split(':') as [string, BiomeId]));

const loader = new GLTFLoader();
const MODELS = new Map<string, Promise<THREE.Object3D>>();

/** Load a KayKit model once; normalised so its footprint is centred and its base sits at y = 0. Clay applied. */
const fbx = new FBXLoader();
const texLoader = new THREE.TextureLoader();

/** Retro Cartoon Cars (Unity, RCC Design): FBX + one body texture; glass/lights by material name; ≈6 m long (cartoon scale next to 1.9 m figures). */
function loadCar(asset: string): Promise<THREE.Object3D> {
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
    if (my !== this.stamp) return;
    this.field = new IslandField(this.spec, road);
    for (const m of this.groundMeshes) { this.group.remove(m); m.geometry.dispose(); }
    this.groundMeshes = [];
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
    for (const m of this.groundMeshes) this.group.add(m);
    if (withNature && NATURE.mode === 'old') this.rebuildNature();
    await this.syncBuildings();
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

  /** Create / update / remove building objects to match the spec. */
  async syncBuildings(): Promise<void> {
    const want = new Set(this.spec.buildings.map((b) => b.id));
    for (const [id, o] of this.buildingObjs) if (!want.has(id)) { this.group.remove(o); this.buildingObjs.delete(id); }
    for (const b of this.spec.buildings) {
      let o = this.buildingObjs.get(b.id);
      if (!o || o.userData.asset !== b.asset) {
        if (o) this.group.remove(o);
        o = new THREE.Group();
        if (b.asset === 'proc:pyramid') o.add(NatureBuilder.pyramid(this.palette, 40, this.spec.seed)); // 40 m base: +80 % over the first 22 m, fits the 94 m island
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
    o.position.set(b.x, Math.max(this.field.height(b.x, b.z), this.field.base(b.x, b.z) + 0.07) + b.y, b.z);
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
