// KFB Environment Kit R1 (docs/SPEC_ENVIRONMENT_KIT_R1.md §11): nature from CC0 kits, instanced, per island.
//   await prepareEnvironment(biome)                      → loads + normalises the biome's species once
//   buildEnvironment({ field, palette, biome, seed, recipe }) → { object, groups, update(t, drive), … }
// E2: one BatchedMesh per island for the shadow casters (anchors, rim rocks) and one for everything else:
// 2 draw calls per island in the main pass, 1 in the shadow pass. E3–E5 (deformer, wind, grass, music) read the
// per-instance data texture (group id, phase, stiffness, palette slot) that is already filled here.
import * as THREE from 'three';
import type { IslandField } from '../island/terrain';
import type { IslandPalette } from '../palettes';
import { BIOMES, biomeSpecies, mixedBiome, type Biome, type BiomeId } from './biomes';
import { H, loadSpecies, ROLE_H, type EnvRole, type EnvSpecies } from './kits';
import { envMaterial, ENV_UNIFORMS } from './material';
import { placeEnvironment, type EnvGroup, type EnvInstance, type EnvOverride } from './place';

export { BIOMES, ISLAND_BIOME, PALETTE_BIOME, type BiomeId } from './biomes';
export { ENV_UNIFORMS } from './material';
export type { EnvGroup, EnvInstance } from './place';

export interface EnvRecipe {
  landmarkH?: number;
  overrides?: Record<number, EnvOverride>;
  /** E1 mixing test: alternate Quaternius / KayKit groups */
  mix?: boolean;
}

export interface EnvDrive { wind?: { dir: [number, number]; strength: number; gust: number }; audio?: { bands: number[] } }

export interface Environment {
  object: THREE.Object3D;
  groups: EnvGroup[];
  instances: EnvInstance[];
  biome: BiomeId;
  update(t: number, drive?: EnvDrive): void;
  /** per species: kit, role, normalised height, instance heights in H, sink range (scale audit) */
  sizes(): Record<string, unknown>[];
  /** grammar checks (§6): floating, sink, path bed, water, open zone, landmark highest, free share */
  check(): Record<string, unknown>;
  dispose(): void;
}

const SPECIES = new Map<string, EnvSpecies>();
const key = (id: string, r: EnvRole) => id + '@' + r;

function resolveBiome(b: BiomeId | Biome, mix?: boolean): Biome {
  const bb = typeof b === 'string' ? BIOMES[b] : b;
  return mix ? mixedBiome(bb) : bb;
}

export async function prepareEnvironment(b: BiomeId | Biome, mix = false): Promise<void> {
  const biome = resolveBiome(b, mix);
  await Promise.all(biomeSpecies(biome).map(async ([id, role]) => SPECIES.set(key(id, role), await loadSpecies(id, role))));
}

export function buildEnvironment(o: { field: IslandField; palette: IslandPalette; biome: BiomeId | Biome; seed: number; recipe?: EnvRecipe }): Environment {
  const { field: f, palette } = o;
  const biome = resolveBiome(o.biome, o.recipe?.mix);
  const sp = (id: string, role: EnvRole) => {
    const s = SPECIES.get(key(id, role));
    if (!s) throw new Error(`env: ${id} as ${role} not prepared (await prepareEnvironment first)`);
    return s;
  };
  const { inst, groups } = placeEnvironment(f, biome, sp, { seed: o.seed, landmarkH: o.recipe?.landmarkH, overrides: o.recipe?.overrides });
  const root = new THREE.Group();
  root.name = 'nature'; // inspect.ts classifies by this name
  root.userData.env = true;
  const mats: THREE.Material[] = [], texs: THREE.Texture[] = [];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3();
  for (const cast of [true, false]) {
    const list = inst.map((x, i) => [x, i] as const).filter(([x]) => x.cast === cast);
    if (!list.length) continue;
    const uniq = [...new Set(list.map(([x]) => key(x.species, x.role)))];
    let verts = 0;
    for (const k of uniq) verts += SPECIES.get(k)!.geo.attributes.position.count;
    const em = envMaterial(palette, list.length);
    const bm = new THREE.BatchedMesh(list.length, verts, 0, em.material);
    bm.name = cast ? 'env-cast' : 'env-rest';
    const gid = new Map<string, number>();
    for (const k of uniq) gid.set(k, bm.addGeometry(SPECIES.get(k)!.geo));
    for (const [x] of list) {
      const id = bm.addInstance(gid.get(key(x.species, x.role))!);
      e.set(x.tiltX, x.rotY, x.tiltZ, 'YXZ');
      m4.compose(v.set(x.x, x.y, x.z), q.setFromEuler(e), s3.setScalar(x.scale));
      bm.setMatrixAt(id, m4);
      em.data.set([x.group, x.phase, x.stiffness, x.leaf], id * 4);
    }
    em.tex.needsUpdate = true;
    bm.castShadow = cast;
    bm.receiveShadow = true;
    bm.computeBoundingBox();
    bm.computeBoundingSphere();
    root.add(bm);
    mats.push(em.material);
    texs.push(em.tex);
  }

  return {
    object: root, groups, instances: inst, biome: biome.id,
    update(t: number) { ENV_UNIFORMS.uEnvTime.value = t; },
    sizes() {
      const by = new Map<string, EnvInstance[]>();
      for (const x of inst) { const k = key(x.species, x.role); by.set(k, [...(by.get(k) ?? []), x]); }
      return [...by.entries()].map(([k, xs]) => {
        const s = SPECIES.get(k)!, hs = xs.map((x) => (s.height * x.scale) / H);
        return {
          species: s.id, kit: s.kit, role: s.role, band: ROLE_H[s.role].join('–') + ' H', normH: +(s.height / H).toFixed(2),
          factor: s.factor, n: xs.length, minH: +Math.min(...hs).toFixed(2), maxH: +Math.max(...hs).toFixed(2),
          sinkPct: `${Math.round(Math.min(...xs.map((x) => x.sink)) * 100)}–${Math.round(Math.max(...xs.map((x) => x.sink)) * 100)}`,
          tris: s.tris, cast: xs[0].cast,
          dims: (() => { const b = s.geo.boundingBox!.getSize(new THREE.Vector3()).multiplyScalar(Math.max(...xs.map((x) => x.scale))); return [+b.x.toFixed(2), +b.y.toFixed(2), +b.z.toFixed(2)]; })(),
        };
      });
    },
    check() {
      const T = f.spec.terrain;
      let floating = 0, inRoadBed = 0, inPath = 0, inWater = 0, inOpen = 0, maxTop = -Infinity, maxH = 0, sinkOut = 0;
      for (const x of inst) {
        const s = SPECIES.get(key(x.species, x.role))!, h = s.height * x.scale;
        if (x.y > f.height(x.x, x.z) + 1e-3) floating++;
        if (x.sink < 0.05 - 1e-6 || x.sink > 0.15 + 1e-6) sinkOut++;
        if (f.bed(x.x, x.z) < 0) inPath++;
        if (T.pond && Math.hypot(x.x - T.pond.x, x.z - T.pond.z) < T.pond.r * 1.2) inWater++;
        if (f.inOpen(x.x, x.z)) inOpen++;
        if ((f as IslandField & { isClear?: (x: number, z: number) => boolean }).isClear?.(x.x, x.z)) inRoadBed++;
        maxTop = Math.max(maxTop, x.y + h);
        maxH = Math.max(maxH, h);
      }
      // free share: island grid points not under any crown
      let tot = 0, free = 0;
      const crowns = inst.map((x) => [x.x, x.z, SPECIES.get(key(x.species, x.role))!.crownR * x.scale] as const);
      for (let z = -f.radius * 1.3; z <= f.radius * 1.3; z += 1.5) for (let x = -f.radius * 1.3; x <= f.radius * 1.3; x += 1.5) {
        if (f.sd(x, z) <= 0) continue;
        tot++;
        if (!crowns.some(([cx, cz, r]) => Math.hypot(cx - x, cz - z) < r)) free++;
      }
      return {
        instances: inst.length, groups: groups.map((g) => `${g.kind}:${g.kit}:${g.members.length}`).join(' '),
        rotGroups: groups.filter((g) => g.kind === 'rot').length,
        groupsWithTwoKits: groups.filter((g) => new Set(g.members.map((i) => inst[i].kit)).size > 1).length,
        casters: inst.filter((x) => x.cast).map((x) => x.role).filter((r, i, a) => a.indexOf(r) === i).join('+'), floating, sinkOutside5to15: sinkOut, inPathBed: inPath, inRoadBed: (f as IslandField & { isClear?: unknown }).isClear ? inRoadBed : 'no isClear yet', inWater, inOpenZone: inOpen,
        tallestNatureH: +(maxH / H).toFixed(2), landmarkH: o.recipe?.landmarkH ? +(o.recipe.landmarkH / H).toFixed(2) : null,
        // absolute tops in island space: the landmark stands on its pad
        landmarkHighest: o.recipe?.landmarkH ? maxTop < f.base(f.landmark[0], f.landmark[1]) + o.recipe.landmarkH : null, freeShare: +(free / Math.max(1, tot)).toFixed(2),
      };
    },
    dispose() {
      root.traverse((x) => (x as THREE.BatchedMesh).isBatchedMesh && (x as THREE.BatchedMesh).dispose());
      for (const m of mats) m.dispose();
      for (const t of texs) t.dispose();
    },
  };
}
