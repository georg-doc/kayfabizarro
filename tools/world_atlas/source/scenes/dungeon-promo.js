/* CQ-S1 · KayKit Dungeon Asset Pack · promo-scene rebuild
   Reference: uploads/Nz_zk7.png (KayKit "DUNGEON ASSET PACK" key art)
   Footprint read from the reference: two 4x2-module blocks, offset by one module
   (upper block shifted +1 in x, lower block shifted forward in z) -> the Z-shaped cutaway.
   Grid: 1 module = 4 units (floor_tile_large / floor_wood_large measured 4 x 4 x 0.15).
   Walls: 4 x 4 x 1, pivot centered -> the wall centre sits ON the module edge line. */

const U = 4;
const t = (i, j) => [i * U, 0, j * U];
const edge = (k) => k * U - U / 2;      // shared module edge line

const P = [];
const put = (a, p, r = 0) => P.push({ a, p, r });
const floor = (asset, is, js) => { for (const i of is) for (const j of js) put(asset, t(i, j)); };

/* ---------- floors · 4 rooms, each 2 x 2 modules ---------- */
floor('dungeon:floor_wood_large', [1, 2], [0, 1]);     // A library / alchemy
floor('dungeon:floor_wood_large', [3, 4], [0, 1]);     // B bedroom / storage
floor('dungeon:floor_tile_large', [0, 1], [2, 3]);     // C dining hall
floor('dungeon:floor_dirt_large', [2, 3], [2, 3]);     // D cell

/* ---------- walls ---------- */
// upper block north face
put('dungeon:wall', [4, 0, edge(0) + 0.5]);
put('dungeon:wall_shelves', [8, 0, edge(0) + 0.5]);
put('dungeon:wall_scaffold', [12, 0, edge(0) + 0.5]);
put('dungeon:wall_window_closed', [16, 0, edge(0) + 0.5]);
// upper block west + east face
put('dungeon:wall', [edge(1) + 0.5, 0, 0], 90);
put('dungeon:wall_cracked', [edge(1) + 0.5, 0, 4], 90);
put('dungeon:wall', [edge(5) - 0.5, 0, 0], 90);
put('dungeon:wall_broken', [edge(5) - 0.5, 0, 4], 90);
// A|B divider with doorway
put('dungeon:wall', [edge(3), 0, 0], 90);
put('dungeon:wall_doorway', [edge(3), 0, 4], 90);
// middle band: south face of the upper block = north face of the lower block
put('dungeon:wall', [0, 0, edge(2) - 0.5]);
put('dungeon:wall', [4, 0, edge(2) - 0.5]);
put('dungeon:wall_gated', [8, 0, edge(2) - 0.5]);
put('dungeon:wall_gated', [12, 0, edge(2) - 0.5]);
put('dungeon:wall', [16, 0, edge(2) - 0.5]);
// lower block west + east face
put('dungeon:wall', [edge(0) + 0.5, 0, 8], 90);
put('dungeon:wall', [edge(0) + 0.5, 0, 12], 90);
put('dungeon:wall', [edge(4) - 0.5, 0, 8], 90);
put('dungeon:wall_cracked', [edge(4) - 0.5, 0, 12], 90);
// C|D divider with doorway
put('dungeon:wall_doorway', [edge(2), 0, 8], 90);
put('dungeon:wall', [edge(2), 0, 12], 90);

/* ---------- A · library / alchemy (x 2…10, z −2…6) ---------- */
put('dungeon:shelves', [3.1, 0, 1.4], 90);
put('dungeon:table_medium_decorated_A', [6.6, 0, 2.6], 12);
put('dungeon:stool', [4.6, 0, 1.5]);
put('dungeon:chair', [8.3, 0, 3.7], -120);
put('dungeon:candle_triple', [6.8, 1.0, 2.0]);
put('dungeon:bottle_A_labeled_green', [5.9, 1.0, 3.0]);
put('dungeon:plate_small', [7.5, 1.0, 3.1]);
put('dungeon:crates_stacked', [4.2, 0, -0.5], 18);
put('dungeon:barrel_small_stack', [9.3, 0, -0.7]);

/* ---------- B · bedroom / storage (x 10…18, z −2…6) ---------- */
put('dungeon:bed_decorated', [15.4, 0, 1.4], 0);
put('dungeon:table_small_decorated_B', [17.0, 0, 3.8], -12);
put('dungeon:candle_thin_lit', [17.0, 1.0, 3.4]);
put('dungeon:bottle_B_brown', [16.5, 1.0, 4.2]);
put('dungeon:keg_decorated', [11.6, 0, 3.9]);
put('dungeon:box_stacked', [12.1, 0, -0.5], 24);
put('dungeon:trunk_medium_B', [13.7, 0, -0.8], -8);
put('dungeon:torch_mounted', [14.0, 2.4, -1.1]);

/* ---------- C · dining hall (x −2…6, z 6…14) ---------- */
put('dungeon:table_long_tablecloth_decorated_A', [1.6, 0, 10.6], 0);
put('dungeon:chair', [-0.8, 0, 10.4], 90);
put('dungeon:stool', [4.2, 0, 10.9]);
put('dungeon:plate_food_A', [0.5, 1.0, 10.2]);
put('dungeon:plate_food_B', [2.7, 1.0, 11.0]);
put('dungeon:candle_triple', [1.6, 1.0, 9.9]);
put('dungeon:banner_shield_white', [-1.1, 2.6, 8.6], 90);
put('dungeon:trunk_large_A', [4.6, 0, 12.8], -14);
put('dungeon:barrel_large', [4.4, 0, 7.7]);

/* ---------- D · cell (x 6…14, z 6…14) ---------- */
put('dungeon:bed_frame', [11.0, 0, 11.2], 0);
put('dungeon:rubble_large', [12.8, 0, 12.9]);
put('dungeon:rubble_half', [7.7, 0, 13.0]);
put('dungeon:plate_stack', [8.6, 0, 10.4]);
put('dungeon:bottle_C_green', [9.4, 0, 11.5]);
put('dungeon:keyring_hanging', [13.2, 2.4, 9.0], 90);

export const scene = {
  id: 'CQ-S1_KAYKIT_DUNGEON_PROMO',
  label: 'KayKit · Dungeon Asset Pack · key-art rebuild',
  grid: { module: U, wall: { w: 4, h: 4, thickness: 1, pivot: 'centered' } },
  rooms: [
    { id: 'A', name: 'library / alchemy', modules: [[1, 0], [2, 0], [1, 1], [2, 1]], floor: 'floor_wood_large' },
    { id: 'B', name: 'bedroom / storage', modules: [[3, 0], [4, 0], [3, 1], [4, 1]], floor: 'floor_wood_large' },
    { id: 'C', name: 'dining hall', modules: [[0, 2], [1, 2], [0, 3], [1, 3]], floor: 'floor_tile_large' },
    { id: 'D', name: 'cell', modules: [[2, 2], [3, 2], [2, 3], [3, 3]], floor: 'floor_dirt_large' }
  ],
  reference: 'uploads/Nz_zk7.png',
  provenance: {
    repo: 'georg-doc/kayfabizarro',
    packRoot: 'media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2',
    format: 'gltf',
    license: 'CC0 · Kay Lousberg'
  },
  placements: P
};
