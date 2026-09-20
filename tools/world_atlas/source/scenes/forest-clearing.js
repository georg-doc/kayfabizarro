/* CQ-S6 · KayKit Forest Nature Pack 1.0 FREE · complete vocabulary + clearing scene
   105 gltf files read out of the repo (not remembered): 22 bushes, 20 grass (incl. single-sided
   variants and 4 shared meshes), 43 rocks, 20 trees. Every part carries the `_Color1` suffix
   except the four `*_Mesh` files, which are the untextured shared meshes. */

const seq = (n, from, to) => {
  const out = [];
  for (let c = from.charCodeAt(0); c <= to.charCodeAt(0); c++) out.push(`${n}_${String.fromCharCode(c)}_Color1`);
  return out;
};

export const FAMILIES = {
  Bush_1: seq('Bush_1', 'A', 'G'),
  Bush_2: seq('Bush_2', 'A', 'F'),
  Bush_3: seq('Bush_3', 'A', 'C'),
  Bush_4: seq('Bush_4', 'A', 'F'),
  Grass_1: ['A', 'B', 'C', 'D'].flatMap((l) => [`Grass_1_${l}_Color1`, `Grass_1_${l}_Singlesided_Color1`]),
  Grass_2: ['A', 'B', 'C', 'D'].flatMap((l) => [`Grass_2_${l}_Color1`, `Grass_2_${l}_Singlesided_Color1`]),
  Grass_Mesh: ['Grass_1_Mesh', 'Grass_1_SingleSided_Mesh', 'Grass_2_Mesh', 'Grass_2_SingleSided_Mesh'],
  Rock_1: seq('Rock_1', 'A', 'Q'),
  Rock_2: seq('Rock_2', 'A', 'H'),
  Rock_3: seq('Rock_3', 'A', 'R'),
  Tree_1: seq('Tree_1', 'A', 'C'),
  Tree_2: seq('Tree_2', 'A', 'E'),
  Tree_3: seq('Tree_3', 'A', 'C'),
  Tree_4: seq('Tree_4', 'A', 'C'),
  Tree_Bare_1: seq('Tree_Bare_1', 'A', 'C'),
  Tree_Bare_2: seq('Tree_Bare_2', 'A', 'C')
};

export const PALETTE = Object.values(FAMILIES).flat();

const F = FAMILIES;
export const TREES = [...F.Tree_1, ...F.Tree_2, ...F.Tree_3, ...F.Tree_4];
export const BARE = [...F.Tree_Bare_1, ...F.Tree_Bare_2];
export const BUSHES = [...F.Bush_1, ...F.Bush_2, ...F.Bush_3, ...F.Bush_4];
export const ROCKS = [...F.Rock_1, ...F.Rock_2, ...F.Rock_3];
export const GRASS = [...F.Grass_1, ...F.Grass_2].filter((n) => !n.includes('Singlesided'));

/* clearing: open middle, dense rim.
   Scale fact from the runtime measurement: these trees are 3.5–10.8 units tall, i.e. the pack is
   built at roughly 1 unit = 1 m. Radii and minimum distances are in the same units — a first pass
   with a 15-unit clearing packed 46 ten-metre trees into a blob. */
export const SPECS = [
  { pack: 'forest', band: 'Baumgürtel', names: TREES, count: 74, inner: 16, radius: 37, scale: [0.85, 1.25], minDist: 3.2 },
  { pack: 'forest', band: 'Kahle Bäume', names: BARE, count: 12, inner: 15, radius: 36, scale: [0.9, 1.2], minDist: 3.4 },
  { pack: 'forest', band: 'Einzelbäume', names: TREES, count: 5, inner: 6, radius: 13, scale: [0.9, 1.1], minDist: 7 },
  { pack: 'forest', band: 'Felsen groß', names: F.Rock_1, count: 16, inner: 5, radius: 34, scale: [0.8, 1.4], minDist: 3 },
  { pack: 'forest', band: 'Felsen mittel', names: F.Rock_2, count: 18, inner: 3.5, radius: 33, scale: [0.7, 1.2], minDist: 2 },
  { pack: 'forest', band: 'Felsen klein', names: F.Rock_3, count: 30, inner: 2, radius: 34, scale: [0.6, 1.1], minDist: 1.3 },
  { pack: 'forest', band: 'Büsche', names: BUSHES, count: 40, inner: 3, radius: 35, scale: [0.8, 1.3], minDist: 1.8 },
  { pack: 'forest', band: 'Gras', names: GRASS, count: 110, inner: 1.5, radius: 35, scale: [0.7, 1.3], minDist: 0.9 }
];

export const scene = {
  id: 'CQ-S6_KAYKIT_FOREST_CLEARING',
  label: 'KayKit Forest Nature Pack · Lichtung',
  reference: 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Samples/Forest_Nature_Pack_sample1.png',
  provenance: {
    repo: 'georg-doc/kayfabizarro',
    packRoot: 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf',
    format: 'gltf', license: 'CC0 · Kay Lousberg', parts: 105
  },
  note: 'Der Boden ist eine Bühnenfläche, kein Pack-Teil — das Pack enthält keine Bodenplatten.'
};
