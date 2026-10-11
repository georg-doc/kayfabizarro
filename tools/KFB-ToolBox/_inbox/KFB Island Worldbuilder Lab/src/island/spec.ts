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

/** Form modifiers (SPEC_WORLDBUILDER_GODMODE_VISION_R1 §2b): every island a broken-off clod with its own shape.
 *  Directions in degrees around the island centre (0 = +x / east, 90 = +z / south, −90 = north). */
export interface IslandForm {
  /** rim not flat: waves (lobes) and a rise towards one direction, only in the outer belt */
  rimProfile?: { amp: number; lobes: number; phase?: number; rise?: number; riseDir?: number };
  /** rim sections where the rounding becomes a rock wall (height in lab units) */
  cliffs?: { dir: number; width: number; height: number; /** outline cut factor (default 1; 0 = the outline stays exact, fragments) */ jag?: number }[];
  /** soft steps (R2D terrace logic) on the mount, step in lab units */
  terraces?: { step: number };
  /** rounded rock peaks breaking out of the top (island-local x, z) */
  crags?: { x: number; z: number; r: number; h: number;
    /** Lauf 03: ridge direction (deg), length factor along it, steepness of the break side (+v), ribs/gullies down the
     *  flanks, top broken off (fraction of h, rounded) */
    dir?: number; elong?: number; steep?: number; ribs?: number; cut?: number }[];
  /** broken island (two parts along a jagged line), recipe field only in Stufe 1 */
  split?: { dir: number; offset: number; gap: number; jag: number } | null;
  /** broken-off clods: pieces of the first cliff's break (puzzle fit), floating `out` in front of it, `dy` up/down */
  fragments?: { out: number; dy: number; seed: number;
    /** Lauf 03 (Steuerung: arch chain Town–Protopia): pier position island-local (centre, top height) and the bridge
     *  axis (x, z) the piece is turned to (its break depth along the axis); piers stand almost level */
    at?: [number, number, number]; axis?: [number, number]; /** break depth of the piece (radial; piers: their length along the axis) */ depth?: number }[];
  overhang?: null;
  undersideStyle?: 'cone' | 'lobes' | 'broken' | 'roots';
  /** Scholle preset override (fragments: 'K' Klumpen, piers: 'P') */
  scholle?: string;
  /** own random seed for the Scholle (body corners, runners) when the island seed must stay */
  scholleSeed?: number;
  /** abutment niches (resolved from anchors with `cut` at build): rock removed inside `plan` above `soleY`, open to the gap */
  niches?: { root: string; plan: [number, number][]; soleY: number }[];
  /** bridge abutments (RKIT, Steuerung 10.10.): the rim is a straight break face across the anchor's direction over
   *  ± half (default 12), blended into the outline; the anchor sits on that face */
  abutments?: { anchor: string; half?: number }[];
  /** cross-section through the earth, top → bottom, as ENV_ROLES role names (e.g. 'earth.2', 'stone.1') */
  strata?: string[];
  /** how old the break is: old = weathered, soft; fresh = jagged (still clay-rounded) */
  breakAge?: 'old' | 'fresh';
  /** hints of what the clod carried (Stufe 1: 1–2 suggestions) */
  relics?: ('vault' | 'pipe' | 'roots' | 'crystal')[];
}

/** composition as recipe data (Lauf 03, Steuerung HIGH 4: paths end at anchors, never in nothing): places and routes;
 *  a route end is an anchor id, a place id or a building id (its forecourt) */
export interface IslandLayout {
  places: { id: string; kind: 'plaza' | 'clearing' | 'lookout'; x: number; z: number; r: number }[];
  routes: { from: string; to: string; w?: number; bend?: number }[];
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
    /** flat > 0: plateau (flat-topped, share of the radius that stays on top; R2D terrain only) */
    mount: null | { x: number; z: number; r: number; h: number; flat?: number };
  };
  nature: { trees: number; bushes: number; rocks: number; towers: number; treeKind: TreeKind };
  buildings: BuildingSpec[];
  residents?: ResidentSpec[];
  // ---- island recipe fields (kfb.island-config/1, SPEC_WORLDBUILDER_GODMODE_VISION_R1 §6); never player state ----
  /** fixed slug, never regenerated (a copy gets a new one) */
  worldId?: string;
  archetype?: 'plateau' | 'mountain' | 'free';
  size?: 'hub' | 'satellite';
  /** 0…n card decks (registry ids from media/kfb/index.json), at most one primary */
  decks?: { deckId: string; role: 'primary' | 'linked' }[];
  /** residents as cards: instance id, character card (kfb.character-card/1), world variant */
  cast?: { id: string; card: string; variant: string }[];
  /** stable docking points at the rim / on the island (track editor, portals, stairs later) */
  anchors?: { id: string; kind: 'road' | 'dock' | 'portal' | 'threshold' | 'stair' | 'bridge'; p?: [number, number]; dir?: [number, number]; /** deck height island-local (bridge anchors on piers) */ y?: number; /** RKIT abutment cut (kfb.rkit-abutment-cut/1) in public/roadbeds/ */ cut?: string }[];
  form?: IslandForm;
  layout?: IslandLayout;
  /** use the outline as given (fragments: the break must fit exactly), no polygonize / clay wobble */
  outlineExact?: boolean;
  /** no composition (paths, plazas): fragments */
  noComposition?: boolean;
}

export interface WorldSpec {
  /** Optional scene-research authoring; survives existing save/import without moving source objects. */
  sceneStudy?: import('../scene-study').SceneStudy;
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
    // RKIT hook (Steuerung 10.10.) — abutment niche removed 11.10. (V-120 a: masonry bridge between islands FAIL; RKIT moved the bridge
    // files to retired/rkit-bridge_2026-10-11/); the anchor stays without `cut`.
    // own Scholle seed: with road bed v2 the island-seed body creased one saddle over 75° (Q5)
    anchors: [{ id: 'rkit_hub.root.s46', kind: 'bridge' }],
    form: { scholleSeed: 78 },
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

/** Outline from angle bumps (degrees, relative radius, half width): designed bulges and bays instead of a plate. */
export function shapedOutline(R: number, n: number, bumps: [number, number, number][]): P2[] {
  const out: P2[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, deg = (a * 180) / Math.PI;
    let k = 1;
    for (const [c, amp, w] of bumps) { const d = Math.abs(((deg - c + 540) % 360) - 180); k += amp * Math.exp(-(d * d) / (2 * w * w)); }
    out.push([Math.cos(a) * R * k, Math.sin(a) * R * k]);
  }
  return out;
}

/** Big Castle (Hyper Casual Cartoon Castles, CS_Big_Castle_Stage01) × 2.2 by the door rule: 9.6 × 8.5 × 9.0 Unity m
 *  × 2.2 × 2.08 LE/m (Unity-Pakete-Intake 2026-10-09). Shown as a labelled grey placeholder until Stufe 2. */
export const BIG_CASTLE_K2 = { w: 44, d: 39, h: 41 };

/**
 * MVP-1 world (?world=mvp1): KFB Town (hub, plateau, ≈ 40 × 40 MC) and Protopia (satellite, mountain, ≈ 24 MC).
 * Stufe 1: terrain only. The castle is a labelled placeholder (Steuerung F6), no nature, no residents in the scene;
 * the cast is recipe data for Stufe 2+.
 */
export function mvp1World(): WorldSpec {
  const M = 4 * FIG_SCALE;
  return {
    version: 1,
    added: ['mvp1', 'lauf03'],
    islands: [
      {
        id: 'kfb_town', worldId: 'kfb_town', name: 'KFB Town', palette: 'kfb_town', seed: 1701, pos: [0, 0, 0],
        archetype: 'plateau', size: 'hub',
        // calmest clod, but no plate: a bay in the east under the future bridge, bulges to the south-east and west, the
        // north (castle rock) pressed flat by the old break
        outline: shapedOutline(20 * M - 6, 28, [[0, -0.13, 19], [55, 0.1, 22], [125, 0.06, 18], [180, 0.11, 24], [-140, 0.05, 20], [-90, -0.06, 30]]),
        // the town sits on a hill: castle on the plateau at the back, market below in front (+z), ring road at the rim (Stufe 2)
        // the castle rock fills the north and breaks off at the north rim (cliff); two terraces step down to the market (south)
        terrain: { hills: 1.0, hillScale: 0.03, depth: 1.0, beach: 0, pond: null, mount: { x: -6, z: -78, r: 112, h: 12.8, flat: 0.42 } },
        form: {
          rimProfile: { amp: 1.5, lobes: 3, phase: 0.7, rise: 1.5, riseDir: -90 },
          cliffs: [{ dir: -90, width: 74, height: 20 }],
          terraces: { step: 6.4 },
          undersideStyle: 'cone', strata: ['earth.1', 'stone.2', 'earth.2'], breakAge: 'old', relics: ['vault', 'pipe'], split: null, fragments: [],
          abutments: [{ anchor: 'kfb_town.rim.protopia' }],
        },
        nature: { trees: 0, bushes: 0, rocks: 0, towers: 0, treeKind: 'ball' },
        buildings: [{ id: 'b-castle', asset: 'proc:placeholder-castle', x: -6, z: -70, y: 0, rot: 0, scale: 1, pad: 31 }],
        residents: [],
        decks: [{ deckId: 'frizzlebob_s_mission_control', role: 'primary' }],
        cast: [
          { id: 'r-king-kayfabian-1', card: 'king_kayfabian', variant: 'kfb_town' },
          { id: 'r-dark-knight-1', card: 'dark_knight', variant: 'kfb_town' },
          { id: 'r-clown-1', card: 'clown', variant: 'kfb_town' },
          { id: 'r-farmers-wife-1', card: 'farmers_wife', variant: 'kfb_town' },
          { id: 'r-caveman-1', card: 'caveman', variant: 'kfb_town' },
        ],
        anchors: [
          { id: 'kfb_town.stair.main', kind: 'stair', p: [-6, -14], dir: [0, 1] },
          { id: 'kfb_town.rim.protopia', kind: 'bridge', p: [104, 0], dir: [0.962, -0.273] },
        ],
        // castle forecourt → main stair (through the terraces) → market → bridge head to Protopia
        layout: {
          places: [{ id: 'kfb_town.market', kind: 'plaza', x: -2, z: 50, r: 13 }],
          routes: [
            { from: 'b-castle', to: 'kfb_town.stair.main', w: 3.4, bend: 0 },
            { from: 'kfb_town.stair.main', to: 'kfb_town.market', w: 3.4, bend: 0.08 },
            { from: 'kfb_town.market', to: 'kfb_town.rim.protopia', w: 3.2, bend: -0.12 },
          ],
        },
      },
      {
        id: 'protopia', worldId: 'protopia', name: 'Protopia', palette: 'protopia', seed: 4242, pos: [257.7, 4.2, -28.0],   // Lauf 03 (Steuerung, Option a): on the bridge axis, gap rim to rim 100, grade ≈ 6 %
        archetype: 'mountain', size: 'satellite',
        outline: blobOutline(12 * M, 14, 5.3, 0.14),
        // one big mountain off-centre; gorge, clearing and hermit hill come in Stufe 3a
        terrain: { hills: 1.5, hillScale: 0.021, depth: 1.0, beach: 0, pond: { x: -8, z: 40, r: 7 }, mount: { x: 14, z: -12, r: 50, h: 14 } },
        // a younger, jagged clod from the mountains: three rounded rock peaks, a fresh break to the west with two clods beside it
        form: {
          rimProfile: { amp: 2.0, lobes: 4, phase: 2.1 },
          // three peaks of different kind: a long main ridge (fresh break face to the north), a stump whose top broke
          // off, a low rock knob; all with gullies down the flanks
          crags: [{ x: 18, z: -26, r: 19, h: 22, dir: 25, elong: 1.7, steep: 0.6, ribs: 6 },
                  { x: -2, z: -16, r: 15, h: 12, dir: -40, elong: 1.2, steep: 0.3, ribs: 4, cut: 0.3 },
                  { x: 26, z: 4, r: 10, h: 7, dir: 80, elong: 1.4, steep: 0.3, ribs: 4 }],
          cliffs: [{ dir: 180, width: 58, height: 16 }],
          // the two clods are the piers of the arch chain to Town (Steuerung 10.10., RKIT chain): on the bridge axis Town
          // (104, 0) → protopia.rim.town, gap rim to rim 100, piers ≈ 17.5 long, fields ≈ 21.7, tops ≈ 0.45 under the 6 % line
          fragments: [{ out: 16, dy: 2.5, seed: 11, at: [-87.52, -0.67, 9.22], axis: [0.962, -0.273], depth: 17 }, { out: 26, dy: -11, seed: 12, at: [-123.86, -3.02, 19.54], axis: [0.962, -0.273], depth: 17 }],
          undersideStyle: 'broken', strata: ['earth.1', 'stone.1', 'stone.2'], breakAge: 'fresh', relics: ['roots', 'crystal'], split: null,
          abutments: [{ anchor: 'protopia.rim.town' }],
        },
        nature: { trees: 0, bushes: 0, rocks: 0, towers: 0, treeKind: 'ball' },
        buildings: [],
        residents: [],
        decks: [{ deckId: 'embrace_protopia', role: 'primary' }],
        cast: [
          { id: 'r-lorekeeper-1', card: 'lorekeeper', variant: 'protopia' },
          { id: 'r-farmer-1', card: 'farmer', variant: 'protopia' },
        ],
        // rim anchor on the bridge axis at the real (broken) rim; (-76, 6) lay ≈ 19 outside after the fresh break's cut
        anchors: [{ id: 'protopia.rim.town', kind: 'bridge', p: [-57.5, 0.7], dir: [-0.962, 0.273] },
          // pier anchors (bridge roots, two per clod, 12 from the pier centre along the axis), island-local, y = deck height
          { id: 'protopia.frag0.bridge.protopia', kind: 'bridge', p: [-78.33, 6.61], dir: [0.962, -0.273], y: -0.62 },
          { id: 'protopia.frag0.bridge.town', kind: 'bridge', p: [-95.17, 11.39], dir: [-0.962, 0.273], y: -0.62 },
          { id: 'protopia.frag1.bridge.protopia', kind: 'bridge', p: [-116.02, 17.31], dir: [0.962, -0.273], y: -2.97 },
          { id: 'protopia.frag1.bridge.town', kind: 'bridge', p: [-132.86, 22.09], dir: [-0.962, 0.273], y: -2.97 }],
        // bridge head → clearing at the foot of the peaks → pond shore
        layout: {
          places: [{ id: 'protopia.clearing', kind: 'clearing', x: -26, z: 18, r: 10 }],
          routes: [
            { from: 'protopia.rim.town', to: 'protopia.clearing', w: 3.0, bend: 0.1 },
            { from: 'protopia.clearing', to: 'protopia.pond', w: 2.4, bend: -0.15 },
          ],
        },
      },
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
