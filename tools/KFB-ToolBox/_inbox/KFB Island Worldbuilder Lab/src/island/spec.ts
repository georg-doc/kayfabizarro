// World document (JSON). Everything a world needs to be rebuilt exactly: islands, outlines, seeds, placed buildings.
import { blobOutline, type P2 } from './shape';
import { FIG_SCALE } from '../scale';

export interface BuildingSpec {
  id: string;
  /** path under /assets/kaykit/ */
  asset: string;
  x: number;
  z: number;
  /** extra height offset above the ground (m) */
  y: number;
  rot: number;
  scale: number;
  /** flattened ground radius around it (m) */
  pad: number;
  /** move named child nodes (Atlas `parts`): offset in model units, rotation in degrees */
  parts?: Record<string, { off: [number, number, number]; rot?: [number, number, number] }>;
}

export type TreeKind = 'ball' | 'kelp' | 'fir' | 'palm';

export interface ResidentSpec {
  id: string;
  /** path under /assets/kaykit/ (rigged KayKit Rig_Medium character) */
  asset: string;
  /** clip from the Rig_Medium library (General / Simulation / MovementBasic) */
  anim: string;
  /** freeze the clip at this fraction (Atlas `poseFreeze` / `poseTime`) */
  freeze?: number;
  /** KFB Eye-Rig v6 lid colour (measured skin, Atlas `eyes.skin`); needs a NoEyes model with eye anchors */
  eyes?: string;
  /** prop in a hand slot (Atlas `hand`) */
  hand?: { asset: string; bone: string };
  /** sit on a building: offset in metres in the building's frame, hips land there (Atlas `sitOn`) */
  /** seat point in the host building's local units (scaled with it) */
  seat?: { building: string; off: [number, number, number] };
  x: number;
  z: number;
  rot: number;
}

export interface IslandSpec {
  id: string;
  name: string;
  palette: string;
  seed: number;
  /** island origin in the world (top surface sits at pos.y) */
  pos: [number, number, number];
  outline: P2[];
  terrain: {
    /** hill amplitude (m) and feature size (1 / m) */
    hills: number;
    hillScale: number;
    /** underside depth factor (1 = reference proportions, total ≈ 0.3–0.35 × diameter) */
    depth: number;
    /** beach width (m), 0 = none */
    beach: number;
    /** underside ending: single off-centre tip (refs A/E) or 2–3 blunt lobes (refs C/G) */
    under?: 'cone' | 'lobes';
    pond: null | { x: number; z: number; r: number };
    mount: null | { x: number; z: number; r: number; h: number };
  };
  nature: { trees: number; bushes: number; rocks: number; towers: number; treeKind: TreeKind };
  buildings: BuildingSpec[];
  residents?: ResidentSpec[];
}

export interface WorldSpec {
  version: 1;
  islands: IslandSpec[];
  /** default islands already added once (so a deleted one is not re-added) */
  added?: string[];
}

let uid = 0;
export const newId = (p: string) => `${p}-${Date.now().toString(36)}-${(uid++).toString(36)}`;

/**
 * RKIT test island (runtime only via ?hub=1, never stored in Georg's world): K2-sized, 20 × 20 MacroCells (≈ 128 wide),
 * gentle terrain, no buildings, no nature, for the road-bed seam (kfb.road-bed/1).
 */
export function rkitHubIsland(): IslandSpec {
  return {
    id: 'rkit_hub', name: 'RKIT Hub (Test, nicht gespeichert)', palette: 'otown', seed: 77, pos: [330, 3, 40],
    outline: blobOutline(64, 16, 7.7, 0.1),
    terrain: { hills: 0.6, hillScale: 0.035, depth: 1.0, beach: 0, pond: null, mount: null },
    nature: { trees: 0, bushes: 0, rocks: 0, towers: 0, treeKind: 'ball' },
    buildings: [],
    residents: [],
  };
}

/** Pyramid island: desert palette, procedural stepped pyramid, oasis, palms, the two KayKit mummies. */
export function pyramidIsland(): IslandSpec {
  return {
    id: 'pyramide', name: 'Pyramiden-Insel', palette: 'wueste', seed: 51, pos: [-6, 3, 112],
    outline: blobOutline(47, 12, 2.6, 0.18),
    terrain: { hills: 1.3, hillScale: 0.05, depth: 1.0, beach: 0, pond: { x: -27, z: 14, r: 6.5 }, mount: null },
    nature: { trees: 11, bushes: 16, rocks: 9, towers: 0, treeKind: 'palm' },
    buildings: [
      { id: 'b-pyr', asset: 'proc:pyramid', x: 4, z: -14, y: 0, rot: 0.3, scale: 1, pad: 31 },
      { id: 'b-sarc', asset: 'mummy/sarcophagus.gltf', x: 18, z: 24, y: 0, rot: 0.3, scale: FIG_SCALE, pad: 2, parts: { sarcophagus_lid: { off: [-0.75, 0.02, 0.05], rot: [0, 4, 0] } } },
      { id: 'b-pot1', asset: 'mummy/pot_A_gold.gltf', x: 22.5, z: 23, y: 0, rot: 1, scale: FIG_SCALE, pad: 1 },
      { id: 'b-pot2', asset: 'mummy/pot_B.gltf', x: 14.5, z: 25.5, y: 0, rot: 2, scale: FIG_SCALE, pad: 1 },
      { id: 'b-car1', asset: 'cars/Cicada/CICADA_LOW.fbx', x: -6, z: 30, y: 0, rot: 2.2, scale: 1, pad: 3 },
    ],
    residents: [
      // Resident Atlas S17 · MUMMY-01: Mummy_A (black face band) sits on the sarcophagus, Mummy_B carries the ankh
      { id: 'r-mummyA', asset: 'mummy/Mummy_A_NoEyes.glb', anim: 'Sit_Chair_Idle', eyes: '#111618', seat: { building: 'b-sarc', off: [0.41, 0.85, 0.18] }, x: 20, z: 25, rot: 0.3 },
      { id: 'r-mummyB', asset: 'mummy/Mummy_B_NoEyes.glb', anim: 'Idle_A', eyes: '#f6bd99', hand: { asset: 'mummy/ankh.gltf', bone: 'handslotl' }, x: 15.5, z: 27.5, rot: 1.1 },
    ],
  };
}

/** The first three islands: one per Joyride palette, plus the pyramid island. */
export function defaultWorld(): WorldSpec {
  return {
    version: 1,
    added: ['pyramide', 'pyramide-v2'],
    islands: [
      pyramidIsland(),
      {
        id: 'canyon', name: 'Canyon', palette: 'canyon', seed: 11, pos: [-58, 0, 6],
        outline: blobOutline(30, 10, 1.3, 0.24),
        terrain: { hills: 2.2, hillScale: 0.055, depth: 1.0, beach: 0, under: 'cone', pond: { x: 4, z: -6, r: 6 }, mount: { x: -14, z: -4, r: 9, h: 6 } },
        nature: { trees: 13, bushes: 30, rocks: 9, towers: 2, treeKind: 'ball' },
        buildings: [{ id: 'b-canyon', asset: 'hex/yellow/building_watermill_yellow.gltf', x: 12, z: -11, y: 0, rot: -1.5, scale: 5.5, pad: 5 }],
      },
      {
        id: 'bucht', name: 'Bikini-Bucht', palette: 'bucht', seed: 23, pos: [8, 6, -46],
        outline: blobOutline(28, 9, 4.1, 0.28),
        terrain: { hills: 1.4, hillScale: 0.07, depth: 1.0, beach: 6, under: 'lobes', pond: { x: -6, z: 4, r: 8 }, mount: null },
        nature: { trees: 11, bushes: 22, rocks: 8, towers: 2, treeKind: 'kelp' },
        buildings: [{ id: 'b-bucht', asset: 'hex/blue/building_tavern_blue.gltf', x: 10, z: -6, y: 0, rot: -0.8, scale: 6, pad: 6 }],
      },
      {
        id: 'otown', name: 'O-Town', palette: 'otown', seed: 37, pos: [52, -4, 18],
        outline: blobOutline(32, 11, 7.7, 0.2),
        terrain: { hills: 1.2, hillScale: 0.06, depth: 1.0, beach: 0, under: 'cone', pond: null, mount: null },
        nature: { trees: 12, bushes: 26, rocks: 8, towers: 2, treeKind: 'ball' },
        buildings: [
          { id: 'b-otown', asset: 'city/building_E.gltf', x: -4, z: -11, y: 0, rot: 0.5, scale: 5.5, pad: 7 },
          { id: 'b-car2', asset: 'cars/Cruiser/CRUISER_LOW.fbx', x: 4, z: -4, y: 0, rot: 1.2, scale: 1, pad: 3 },
          { id: 'b-car3', asset: 'cars/Carrier/CARRIER_LOW.fbx', x: -12, z: -3, y: 0, rot: -0.6, scale: 1, pad: 3 },
        ],
      },
    ],
  };
}
