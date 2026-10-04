/* CQ-S4 · KayKit City Builder Bits 1.0 FREE · sample-scene rebuild
   Reference: the pack's own key art — media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/sample.png
   Placements are MODULE coordinates [i,j]; the module is measured at runtime from `road_straight`.
   Vocabulary is the complete FREE pack (41 parts, enumerated from the repo, not from memory). */

const P = [];
const put = (a, m, r = 0, y = 0) => P.push({ a, m, r, y });
const rowX = (a, is, j, r = 0) => is.forEach((i) => put(a, [i, j], r));
const rowZ = (a, i, js, r = 0) => js.forEach((j) => put(a, [i, j], r));

/* ---------- plaza / ground plates ---------- */
for (let i = 0; i <= 3; i++) for (let j = 0; j <= 3; j++) put('city_kk:base', [i, j]);
for (let i = 4; i <= 6; i++) for (let j = 0; j <= 3; j++) put('city_kk:base', [i, j]);

/* ---------- street ring: front street (j=4), left arm (i=-1), right exit ---------- */
rowX('city_kk:road_straight', [0, 1, 3, 5, 6], 4, 90);
put('city_kk:road_straight_crossing', [2, 4], 90);
put('city_kk:road_straight_crossing', [4, 4], 90);
put('city_kk:road_corner', [-1, 4], 90);
rowZ('city_kk:road_straight', -1, [0, 1, 2, 3]);
put('city_kk:road_corner', [-1, -1], 180);
put('city_kk:road_tsplit', [7, 4], 90);
rowZ('city_kk:road_straight', 7, [5, 6]);
put('city_kk:road_corner_curved', [7, 3], 270);
rowX('city_kk:road_straight', [0, 1, 2, 3, 4, 5, 6], -1, 90);

/* ---------- buildings · Kit-Regel: auf einer Basisplatte gehört die *_withoutBase-Variante,
   die Vollvariante bringt ihre eigene Platte mit (freistehend). ---------- */
put('city_kk:building_A_withoutBase', [0, 1], 0);
put('city_kk:building_B_withoutBase', [1, 1], 0);
put('city_kk:building_C_withoutBase', [2, 1], 0);
put('city_kk:building_D_withoutBase', [4, 1], 0);
put('city_kk:building_E_withoutBase', [5, 1], 0);
put('city_kk:building_F_withoutBase', [1, 3], 0);
put('city_kk:building_G_withoutBase', [2, 3], 0);
put('city_kk:building_H_withoutBase', [5, 3], 0);
put('city_kk:building_A_withoutBase', [6, 1], 0);
put('city_kk:building_C_withoutBase', [6, 3], 0);

/* ---------- roof + street furniture ---------- */
put('city_kk:watertower', [2, 1], 0, 3.2);
put('city_kk:watertower', [5, 1], 0, 3.2);
put('city_kk:streetlight', [0.5, 3.6], 0);
put('city_kk:streetlight', [3.5, 3.6], 0);
put('city_kk:streetlight', [6.5, 3.6], 0);
put('city_kk:trafficlight_A', [2.6, 3.7], 0);
put('city_kk:trafficlight_B', [4.6, 3.7], 180);
put('city_kk:trafficlight_C', [-0.6, 3.7], 90);
put('city_kk:firehydrant', [1.2, 3.6]);
put('city_kk:firehydrant', [5.2, 3.6]);
put('city_kk:bench', [0.8, 3.5], 0);
put('city_kk:bench', [4.8, 3.5], 0);
put('city_kk:bush', [1.6, 3.5]);
put('city_kk:bush', [3.2, 3.5]);
put('city_kk:bush', [6.2, 3.5]);
put('city_kk:dumpster', [3.7, 3.5], 90);
put('city_kk:trash_A', [0.2, 3.5]);
put('city_kk:trash_B', [6.7, 3.5]);
put('city_kk:box_A', [3.4, 3.4]);
put('city_kk:box_B', [3.6, 3.6]);

/* ---------- traffic ---------- */
put('city_kk:car_taxi', [0.4, 4.2], 90);
put('city_kk:car_sedan', [2.6, 4.2], 90);
put('city_kk:car_hatchback', [4.4, 3.8], -90);
put('city_kk:car_stationwagon', [6.2, 3.8], -90);
put('city_kk:car_police', [-1, 2.4], 0);

export const scene = {
  id: 'CQ-S4_KAYKIT_CITY_BUILDER_SAMPLE',
  label: 'KayKit City Builder Bits · Sample-Szene',
  moduleRef: { a: 'city_kk:road_straight', note: 'Modulmaß wird aus diesem Teil gemessen' },
  reference: 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/sample.png',
  provenance: {
    repo: 'georg-doc/kayfabizarro',
    packRoot: 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf',
    format: 'gltf',
    license: 'CC0 · Kay Lousberg',
    note: 'Teilenamen aus dem Repo ausgelesen (41 Dateien), nicht aus dem Gedächtnis.'
  },
  placements: P
};

/* complete FREE vocabulary, as it lies in the repo */
export const PALETTE = [
  'base', 'road_straight', 'road_straight_crossing', 'road_corner', 'road_corner_curved', 'road_junction', 'road_tsplit',
  'building_A', 'building_B', 'building_C', 'building_D', 'building_E', 'building_F', 'building_G', 'building_H',
  'building_A_withoutBase', 'building_B_withoutBase', 'building_C_withoutBase', 'building_D_withoutBase',
  'building_E_withoutBase', 'building_F_withoutBase', 'building_G_withoutBase', 'building_H_withoutBase',
  'watertower', 'streetlight', 'trafficlight_A', 'trafficlight_B', 'trafficlight_C',
  'bench', 'bush', 'box_A', 'box_B', 'dumpster', 'firehydrant', 'trash_A', 'trash_B',
  'car_hatchback', 'car_police', 'car_sedan', 'car_stationwagon', 'car_taxi'
];
