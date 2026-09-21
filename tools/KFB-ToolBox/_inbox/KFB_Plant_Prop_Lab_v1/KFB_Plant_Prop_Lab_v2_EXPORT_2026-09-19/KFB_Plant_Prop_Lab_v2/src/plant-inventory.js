/* KFB Plant Prop Lab · gemessenes Inventar der zwei Quellpacks
   Quelle der Zahlen: tools/measure-plant-parts.html, 2026-09-18, 72 von 72 Teilen geladen,
   0 Fehlschläge. Keine Kandidatenliste — jede Zeile ist ein geladenes, vermessenes Teil.
   Spalten: sx,sy,sz (Maße) · minY,maxY · tris · u0,u1,v0,v1 (UV-Spanne im Atlas)

   Die Dateiwahrheit kommt aus der GitHub-Contents-API (tools/probe-plant-packs.html); die
   Tree-API listet .gltf in diesem Repo nicht — dieselbe Falle wie bei den Bits-Packs (S14). */

const ROWS = [
  // Tiny Treats · Töpfe
  ['pot_A_small', 0.5, 0.4, 0.5, 0, 0.4, 216, 0.669, 0.964, 0.112, 0.394],
  ['pot_A_medium', 1, 0.7, 1, 0.001, 0.701, 216, 0.669, 0.964, 0.112, 0.394],
  ['pot_A_large', 1.498, 1, 1.498, 0, 1, 288, 0.653, 0.978, 0.061, 0.368],
  ['pot_B_small', 0.494, 0.4, 0.494, 0, 0.4, 168, 0.29, 0.96, 0.114, 0.378],
  ['pot_B_medium', 0.99, 0.75, 0.99, 0, 0.75, 168, 0.285, 0.96, 0.098, 0.378],
  ['pot_B_large', 1.489, 1, 1.489, 0, 1, 224, 0.272, 0.963, 0.086, 0.372],
  ['pot_C_small', 0.5, 0.4, 0.487, 0, 0.4, 288, 0.901, 0.974, 0.077, 0.332],
  ['pot_C_medium', 1, 0.75, 0.974, 0.001, 0.751, 288, 0.901, 0.974, 0.077, 0.332],
  ['pot_C_large', 1.5, 1, 1.462, 0, 1, 368, 0.901, 0.978, 0.043, 0.368],
  ['pot_D_small', 0.5, 0.4, 0.487, 0, 0.4, 288, 0.526, 0.948, 0.077, 0.332],
  ['pot_D_medium', 1, 0.75, 0.974, 0.001, 0.751, 288, 0.526, 0.948, 0.077, 0.332],
  ['Pot_D_large', 1.5, 1, 1.462, 0, 1, 368, 0.526, 0.978, 0.043, 0.368],
  // Tiny Treats · Untersetzer
  ['saucer_A_small', 0.6, 0.2, 0.6, 0, 0.2, 192, 0.663, 0.701, 0.114, 0.189],
  ['saucer_A_medium', 1, 0.3, 1, 0, 0.3, 192, 0.65, 0.714, 0.107, 0.189],
  ['saucer_A_large', 1.5, 0.299, 1.5, 0.001, 0.3, 256, 0.641, 0.737, 0.107, 0.189],
  ['saucer_B_small', 0.6, 0.2, 0.6, 0, 0.2, 192, 0.288, 0.326, 0.114, 0.189],
  ['saucer_B_medium', 1, 0.3, 1, 0, 0.3, 192, 0.275, 0.339, 0.107, 0.189],
  ['saucer_B_large', 1.5, 0.299, 1.5, 0.001, 0.3, 256, 0.266, 0.362, 0.107, 0.189],
  // Tiny Treats · Zubehör
  ['pots_stacked', 0.528, 0.784, 0.5, 0, 0.784, 588, 0.669, 0.723, 0.082, 0.203],
  ['watering_can_A', 0.9, 0.75, 0.6, 0.001, 0.751, 630, 0.28, 0.36, 0.101, 0.213],
  ['shovel', 0.341, 0.831, 0.195, -0.154, 0.678, 296, 0.266, 0.359, 0.022, 0.707],
  // Tiny Treats · Pflanzen (blank, ohne Topf)
  ['monstera_plant_small', 1.26, 1.025, 1.074, -0.044, 0.981, 940, 0.155, 0.22, 0.334, 0.446],
  ['monstera_plant_medium', 2.024, 1.557, 2.224, -0.048, 1.509, 2892, 0.154, 0.22, 0.334, 0.446],
  ['monstera_plant_large', 2.592, 2.96, 2.79, -0.079, 2.88, 5612, 0.154, 0.221, 0.334, 0.446],
  ['pothos_plant_small', 0.675, 1.012, 0.672, -0.448, 0.564, 1624, 0.025, 0.11, 0.278, 0.394],
  ['pothos_plant_medium', 1.623, 2.054, 1.37, -1.047, 1.007, 3512, 0.016, 0.11, 0.278, 0.394],
  ['pothos_plant_large', 2.53, 2.397, 2.406, -1.047, 1.35, 6576, 0.014, 0.111, 0.278, 0.401],
  ['sansevieria_plant_small', 0.716, 0.823, 0.51, -0.064, 0.759, 276, 0.178, 0.82, 0.316, 0.676],
  ['sansevieria_plant_medium', 1.207, 1.698, 0.869, -0.054, 1.644, 648, 0.175, 0.82, 0.316, 0.676],
  ['sansevieria_plant_large', 1.302, 2.624, 1.712, -0.06, 2.564, 1096, 0.175, 0.82, 0.316, 0.676],
  ['yucca_plant_small', 0.942, 1.507, 0.917, -0.05, 1.457, 1576, 0.166, 0.719, 0.006, 0.415],
  ['yucca_plant_medium', 1.422, 1.878, 1.334, -0.05, 1.828, 2692, 0.161, 0.719, 0.006, 0.415],
  ['yucca_plant_large', 2.03, 2.257, 1.71, -0.06, 2.197, 5040, 0.151, 0.719, 0.006, 0.415],
  ['zzplant_plant_small', 0.479, 1.083, 0.555, -0.061, 1.022, 1080, 0.159, 0.208, 0.336, 0.446],
  ['zzplant_plant_medium', 1.099, 1.542, 0.992, -0.057, 1.485, 2704, 0.159, 0.22, 0.336, 0.446],
  ['zzplant_plant_large', 1.575, 2.639, 1.549, -0.115, 2.524, 7488, 0.159, 0.226, 0.336, 0.446],
  ['cactus_A', 0.464, 0.641, 0.332, -0.05, 0.59, 224, 0.16, 0.208, 0.346, 0.486],
  ['cactus_B', 0.348, 0.381, 0.331, -0.051, 0.33, 130, 0.022, 0.096, 0.261, 0.462],
  ['cactus_C', 0.331, 0.396, 0.283, -0.05, 0.346, 270, 0.79, 0.828, 0.617, 0.727],
  ['cactus_D', 0.517, 0.529, 0.163, -0.046, 0.483, 504, 0.026, 0.099, 0.273, 0.477],
  ['succulent_A', 0.626, 0.217, 0.626, 0.04, 0.258, 924, 0.041, 0.084, 0.287, 0.491],
  ['succulent_B', 0.595, 0.264, 0.594, 0.03, 0.294, 1202, 0.414, 0.492, 0.517, 0.733],
  ['succulent_C', 0.64, 0.216, 0.64, 0.036, 0.251, 1148, 0.77, 0.855, 0.521, 0.715],
  ['succulent_D', 0.553, 0.331, 0.553, 0.01, 0.341, 1092, 0.191, 0.22, 0.317, 0.416],
  // Tiny Treats · fertig getopfte Zwillinge (Referenz für die Einsetztiefe, NICHT zum Komponieren)
  ['monstera_plant_large_potted', 2.592, 3.68, 2.79, 0, 3.68, 5900, 0.154, 0.978, 0.061, 0.446],
  ['cacti_plant_pot_large', 1.489, 1.035, 1.489, 0, 1.035, 2256, 0.022, 0.963, 0.086, 0.727],
  // Quaternius · Sci-Fi-Botanik (Spender)
  ['Plant_1', 1.804, 2.18, 0.642, -0.038, 2.142, 540, 0.076, 0.11, 0.105, 0.106],
  ['Plant_2', 1.057, 1.974, 1.01, -0.002, 1.972, 196, 0.139, 0.173, 0.109, 0.111],
  ['Plant_3', 2.12, 2.978, 1.444, -0.012, 2.966, 1608, 0.015, 0.016, 0.104, 0.105],
  ['Bush_1', 3.255, 2.477, 0.979, -0.389, 2.088, 2304, 0.045, 0.046, 0.297, 0.297],
  ['Bush_2', 1.822, 1.598, 0.621, -0.176, 1.422, 1504, 0.049, 0.049, 0.296, 0.297],
  ['Bush_3', 1.862, 1.585, 0.627, -0.083, 1.502, 640, 0.422, 0.423, 0.298, 0.299],
  ['Tree_Blob_1', 3.863, 5.876, 3.863, -0.005, 5.87, 6112, 0.265, 0.299, 0.296, 0.299],
  ['Tree_Blob_2', 3.687, 4.609, 3.863, -0.004, 4.605, 5776, 0.265, 0.297, 0.297, 0.298],
  ['Tree_Blob_3', 2.804, 3.421, 2.772, -0.004, 3.417, 1892, 0.266, 0.298, 0.296, 0.297],
  ['Tree_Floating_1', 2.089, 4.611, 0.826, -0.016, 4.596, 2440, 0.015, 0.048, 0.296, 0.297],
  ['Tree_Floating_2', 2.627, 5.866, 0.843, -0.001, 5.865, 4048, 0.013, 0.047, 0.295, 0.297],
  ['Tree_Floating_3', 3.872, 5.211, 0.843, -0.002, 5.209, 4080, 0.014, 0.046, 0.295, 0.296],
  ['Tree_Lava_1', 1.199, 3.242, 1.196, -0.001, 3.241, 1282, 0.077, 0.11, 0.295, 0.297],
  ['Tree_Lava_2', 1.226, 3.083, 1.151, -0.001, 3.082, 1174, 0.078, 0.11, 0.295, 0.299],
  ['Tree_Lava_3', 1.116, 2.086, 1.125, -0.002, 2.084, 1088, 0.078, 0.11, 0.295, 0.298],
  ['Tree_Light_1', 2.634, 3.764, 1.956, -0.007, 3.757, 2280, 0.139, 0.172, 0.296, 0.297],
  ['Tree_Light_2', 1.445, 2.51, 1.51, -0.001, 2.509, 1080, 0.141, 0.173, 0.296, 0.297],
  ['Tree_Spikes_1', 4.05, 5.153, 4.05, -0.01, 5.142, 2548, 0.328, 0.359, 0.297, 0.298],
  ['Tree_Spikes_2', 2.421, 4.492, 2.115, -0.014, 4.479, 1698, 0.327, 0.36, 0.297, 0.298],
  ['Tree_Spiral_1', 2.364, 4.491, 2.228, -0.005, 4.486, 748, 0.202, 0.234, 0.297, 0.298],
  ['Tree_Spiral_2', 3.802, 6.187, 2.204, -0.005, 6.182, 1490, 0.203, 0.236, 0.296, 0.298],
  ['Tree_Spiral_3', 4.22, 4.054, 2.543, -0.005, 4.048, 1280, 0.203, 0.233, 0.296, 0.298],
  ['Tree_Swirl_1', 4.606, 7.349, 1.679, 0, 7.349, 2010, 0.391, 0.424, 0.296, 0.298],
  ['Tree_Swirl_2', 3.073, 5.152, 1.148, -0.003, 5.149, 1112, 0.393, 0.422, 0.298, 0.298],
  ['Grass_1', 1.27, 0.991, 0.91, -0.009, 0.981, 246, 0.205, 0.206, 0.107, 0.108],
  ['Rock_1', 3.095, 3.609, 2.83, -0.368, 3.241, 224, 0.013, 0.014, 0.044, 0.045]
];

export const MEASURED = Object.fromEntries(ROWS.map(([n, sx, sy, sz, minY, maxY, tris, u0, u1, v0, v1]) =>
  [n, { name: n, size: [sx, sy, sz], minY, maxY, tris, uv: [u0, u1, v0, v1], uSpan: +(u1 - u0).toFixed(3), vSpan: +(v1 - v0).toFixed(3) }]));

export const PACK = {
  tt: { pack: 'tt_plants', repo: 'georg-doc/kayfabizarro', path: 'media/3D_Assets/Tiny_Treats_House_Plants_1.0_FREE 2/Assets/gltf/', licence: 'Tiny Treats FREE (License.txt im Pack)' },
  qu: { pack: 'qu_env', repo: 'georg-doc/kayfabizarro', path: 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/', licence: 'Quaternius CC0 (License.txt im Pack)' }
};

/* Namensfalle, gemessen: die grosse D-Variante heisst `Pot_D_large` mit grossem P — alle
   anderen elf Töpfe klein. Wer die Reihe generiert, produziert einen 404. */
export const POT_FAMILIES = ['A', 'B', 'C', 'D'];
export const POT_SIZES = ['small', 'medium', 'large'];
export const potName = (fam, size) => (fam === 'D' && size === 'large') ? 'Pot_D_large' : `pot_${fam}_${size}`;
export const saucerName = (fam, size) => `saucer_${fam === 'B' || fam === 'D' ? 'B' : 'A'}_${size}`;

export const PLANT_FAMILIES = {
  monstera: { sizes: ['small', 'medium', 'large'], name: (s) => `monstera_plant_${s}`, look: 'breite Blätter' },
  pothos: { sizes: ['small', 'medium', 'large'], name: (s) => `pothos_plant_${s}`, look: 'hängende Ranken' },
  sansevieria: { sizes: ['small', 'medium', 'large'], name: (s) => `sansevieria_plant_${s}`, look: 'steife Schwerter' },
  yucca: { sizes: ['small', 'medium', 'large'], name: (s) => `yucca_plant_${s}`, look: 'Stamm + Schopf' },
  zzplant: { sizes: ['small', 'medium', 'large'], name: (s) => `zzplant_plant_${s}`, look: 'aufrechte Fiedern' },
  cactus: { sizes: ['A', 'B', 'C', 'D'], name: (s) => `cactus_${s}`, look: 'Kaktus, klein' },
  succulent: { sizes: ['A', 'B', 'C', 'D'], name: (s) => `succulent_${s}`, look: 'Rosette, flach' }
};

export const ALIEN_FAMILIES = {
  Plant: { variants: [1, 2, 3] }, Bush: { variants: [1, 2, 3] },
  Tree_Blob: { variants: [1, 2, 3] }, Tree_Floating: { variants: [1, 2, 3] },
  Tree_Lava: { variants: [1, 2, 3] }, Tree_Light: { variants: [1, 2] },
  Tree_Spikes: { variants: [1, 2] }, Tree_Spiral: { variants: [1, 2, 3] },
  Tree_Swirl: { variants: [1, 2] }
};
export const alienName = (fam, v) => `${fam}_${v}`;

/* Einsetztiefe NICHT geschätzt, sondern aus dem getopften Zwilling des Packs gerechnet:
   monstera_plant_large_potted ist 3,680 hoch, monstera_plant_large 2,880 (max y).
   3,680 − 2,880 = 0,800 Ursprungshöhe in einem 1,00 hohen grossen Topf → die Pflanze sitzt
   0,200 UNTER der Topfkante. Als Anteil der Topfhöhe: 0,20. Das ist der Standardwert. */
export const INSERT_REFERENCE = {
  potted: 'monstera_plant_large_potted', bare: 'monstera_plant_large',
  pottedHeight: 3.68, bareTop: 2.88, origin: 0.8, potHeight: 1.0, depthFraction: 0.2
};

/* UV-Befund, der den Musterweg entscheidet (Briefing: „zwei Wege probieren und berichten").
   Töpfe tragen ein kleines Atlasfenster (0,07–0,67 in u), die Quaternius-Spender ein
   ENTARTETES: Plant_1 v 0,105…0,106, Bush_1 u 0,045…0,046 — ein einziger Texel. Ein
   UV-Muster kann darauf nicht liegen, ein analytisches Zylindermuster schon. */
export const UV_VERDICT = {
  potMin: Math.min(...POT_FAMILIES.flatMap((f) => POT_SIZES.map((s) => MEASURED[potName(f, s)].uSpan))),
  potMax: Math.max(...POT_FAMILIES.flatMap((f) => POT_SIZES.map((s) => MEASURED[potName(f, s)].uSpan))),
  alienWorst: 0.001,
  verdict: 'analytisch-zylindrisch'
};

export const SCALE_CLASSES = {
  TABLETOP: { s: 1, note: 'normale Requisite' },
  ROOM: { s: 2.2, note: 'grosse Zimmerpflanze' },
  GARDEN: { s: 4.5, note: 'Garten, überdimensioniert' },
  LANDMARK: { s: 12, note: 'Crazy-Cat-Landmarke' },
  PROJECT_ISLAND: { s: 7, note: 'Plattformer-Insel' }
};

export const stats = () => ({
  parts: ROWS.length, pots: 12, saucers: 6, plants: 23, aliens: 26,
  trisMin: Math.min(...ROWS.map((r) => r[6])), trisMax: Math.max(...ROWS.map((r) => r[6]))
});
