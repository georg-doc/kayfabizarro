/* CQ-S5 · KayKit City Builder Bits · road network
   The road layout is a MAP, not a list of parts. Which part goes in a cell — and at which rotation —
   is solved from the neighbourhood, against a connector table measured off the real geometry.

   '#' road · 'x' road, pedestrian crossing preferred · 'c' road, curved corner preferred
   '@' road, hard (unrounded) corner preferred · '.' empty */

export const MAP = [
  '...........',
  '.c##x####@.',
  '.#...#...#.',
  '.#...#...#.',
  '.##x###x##.',
  '.#...#...#.',
  '.#...#...#.',
  '.@####x##c.',
  '...........'
];

/* the four enclosed blocks: buildings (they bring their own base plate) + bare plates */
const B = [];
const put = (a, m, r = 0, y = 0) => B.push({ a, m, r, y });

const BLOCKS = [
  { i0: 2, i1: 4, j0: 2, j1: 3 },
  { i0: 6, i1: 8, j0: 2, j1: 3 },
  { i0: 2, i1: 4, j0: 5, j1: 6 },
  { i0: 6, i1: 8, j0: 5, j1: 6 }
];
const HOUSES = ['building_A', 'building_B', 'building_C', 'building_D', 'building_E', 'building_F', 'building_G', 'building_H'];
let n = 0;
for (const bl of BLOCKS) {
  for (let i = bl.i0; i <= bl.i1; i++) {
    for (let j = bl.j0; j <= bl.j1; j++) {
      const edge = j === bl.j0 || j === bl.j1;
      if (edge && (i + j) % 2 === 0) put('city_kk:' + HOUSES[n++ % HOUSES.length], [i, j], j === bl.j0 ? 180 : 0);
      else put('city_kk:base', [i, j]);
    }
  }
}

/* Furniture is placed on SLOTS derived from the measured tile geometry (see road-solver:
   kerbSlots), never on typed coordinates. Each entry says how many of that prop to place and how
   to spread them over the available kerb slots; the traffic lights ask for slots near a junction. */
const FURNITURE = [
  { a: 'streetlight', count: 8, stride: 9 },
  { a: 'bench', count: 3, stride: 17, rotate: 0 },
  { a: 'bush', count: 6, stride: 11 },
  { a: 'firehydrant', count: 3, stride: 13 },
  { a: 'trash_A', count: 2, stride: 23 },
  { a: 'trash_B', count: 2, stride: 29 },
  { a: 'box_A', count: 2, stride: 31 },
  { a: 'box_B', count: 2, stride: 37 },
  { a: 'dumpster', count: 2, stride: 41 },
  { a: 'trafficlight_A', count: 1, near: [5, 4] },
  { a: 'trafficlight_B', count: 1, near: [5, 4] },
  { a: 'trafficlight_C', count: 2, near: [5, 1] }
];

export function furniture(slots) {
  const used = new Set();
  const out = [];
  const take = (idx) => { for (let k = 0; k < slots.length; k++) { const i = (idx + k) % slots.length; if (!used.has(i)) { used.add(i); return slots[i]; } } return null; };
  for (const f of FURNITURE) {
    for (let n = 0; n < f.count; n++) {
      let slot;
      if (f.near) {
        const cand = slots
          .map((s, i) => ({ s, i, d: Math.abs(s.cell[0] - f.near[0]) + Math.abs(s.cell[1] - f.near[1]) }))
          .filter((c) => !used.has(c.i))
          .sort((a, b) => a.d - b.d)[0];
        if (!cand) continue;
        used.add(cand.i); slot = cand.s;
      } else {
        slot = take((n * f.stride + f.stride) % slots.length);
      }
      if (!slot) continue;
      out.push({ a: 'city_kk:' + f.a, p: slot.p, r: slot.facing + (f.rotate || 0), slot: `${slot.cell.join(',')}/${slot.side}` });
    }
  }
  return out;
}

/* traffic · cars belong on the asphalt, so they sit on lane centres between kerbs */
export const traffic = [
  { a: 'city_kk:car_taxi', m: [3, 0.78], r: 90 },
  { a: 'city_kk:car_sedan', m: [7, 1.22], r: -90 },
  { a: 'city_kk:car_hatchback', m: [0.78, 5], r: 180 },
  { a: 'city_kk:car_stationwagon', m: [5.22, 6], r: 0 },
  { a: 'city_kk:car_police', m: [6, 4.22], r: -90 }
];

export const blocks = B;
export const dressing = B;

export const scene = {
  id: 'CQ-S5_KAYKIT_CITY_ROAD_NETWORK',
  label: 'KayKit City Builder Bits · Straßennetz (gelöst)',
  reference: 'uploads/Bildschirmfoto 2026-09-16 um 17.45.07.png',
  provenance: {
    repo: 'georg-doc/kayfabizarro',
    packRoot: 'media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf',
    format: 'gltf', license: 'CC0 · Kay Lousberg',
    roadParts: ['road_straight', 'road_straight_crossing', 'road_corner', 'road_corner_curved', 'road_tsplit', 'road_junction']
  }
};
