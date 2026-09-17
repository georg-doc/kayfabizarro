/* CQ-S2 · Kenney City Kit (roads + commercial + suburban) · street-grid rebuild
   Reference: KayKit "CITY BUILDER BITS" key art (uploads/w3uWIH.png) read for STRUCTURE only —
   KayKit City Builder Bits is ZIP-only in the source repo (not extracted, not indexed), so the
   rebuild uses the indexed Kenney city kits. Structure + grid first, dressing later.

   All placements are in MODULE coordinates [i,j]; the page multiplies them by the module size
   measured at runtime from `roads:road-straight`. No guessed world units. */

const P = [];
const put = (a, m, r = 0, y = 0) => P.push({ a, m, r, y });
const line = (a, cells, r = 0) => cells.forEach((c) => put(a, c, r));

const GRID = { w: 10, h: 10 };

/* ---------- ground: every cell that is not street ---------- */
const street = new Set();
for (let j = 0; j < GRID.h; j++) street.add(`4,${j}`);      // north–south street
for (let i = 0; i < GRID.w; i++) street.add(`${i},5`);      // east–west street
for (let i = 0; i < GRID.w; i++) for (let j = 0; j < GRID.h; j++) {
  if (!street.has(`${i},${j}`)) put('roads:tile-low', [i, j]);
}

/* ---------- streets ----------
   Measured orientation fact: Kenney `road-straight` runs along the X axis by default,
   so the north–south street needs r = 90. */
for (let j = 0; j < GRID.h; j++) if (j !== 5) put('roads:road-straight', [4, j], 90);
for (let i = 0; i < GRID.w; i++) if (i !== 4) put('roads:road-straight', [i, 5], 0);
put('roads:road-crossroad', [4, 5]);
put('roads:road-crossing', [4, 2], 90);
put('roads:road-crossing', [7, 5], 0);

/* ---------- commercial block · north of the east–west street ---------- */
put('city_com:building-a', [1, 4]);
put('city_com:building-c', [2, 4]);
put('city_com:building-skyscraper-a', [6, 4]);
put('city_com:building-e', [7, 4]);
put('city_com:building-g', [8, 4]);
put('city_com:building-b', [1, 3], 180);
put('city_com:building-skyscraper-c', [7, 3], 180);
put('city_com:detail-awning', [2, 4]);

/* ---------- suburban block · south of the street ---------- */
put('city_sub:building-type-a', [1, 6], 180);
put('city_sub:building-type-c', [2, 6], 180);
put('city_sub:building-type-f', [6, 6], 180);
put('city_sub:building-type-j', [7, 6], 180);
put('city_sub:driveway-short', [2, 7]);
put('city_sub:path-long', [6, 7]);
line('city_sub:fence-1x3', [[1, 7], [3, 7], [8, 6]]);
line('city_sub:tree-large', [[3, 6], [8, 7], [1, 8]]);
line('city_sub:tree-small', [[2, 8], [6, 8], [7, 7]]);

/* ---------- street furniture ---------- */
line('roads:light-square', [[3, 4], [5, 6], [3, 6], [5, 4]]);
put('roads:traffic-light', [3, 5]);
put('roads:traffic-light', [5, 5], 180);
put('roads:road-sign-street', [5, 3]);
put('roads:construction-cone', [4, 8]);
put('roads:construction-barrier', [4, 9], 90);

export const scene = {
  id: 'CQ-S2_KENNEY_CITY_STREET_GRID',
  label: 'Kenney City Kit · Straßenraster + Blockbebauung',
  moduleRef: { a: 'roads:road-straight', note: 'Modulmaß wird aus diesem Teil gemessen' },
  grid: GRID,
  reference: 'uploads/w3uWIH.png',
  provenance: {
    repo: 'georg-doc/kayfabizarro',
    packRoots: [
      'media/3D_Assets/kenney_city-kit-roads/Models/GLB format',
      'media/3D_Assets/kenney_city-kit-commercial_2.1/Models/GLB format',
      'media/3D_Assets/kenney_city-kit-suburban_20/Models/GLB format'
    ],
    format: 'glb',
    license: 'CC0 · Kenney'
  },
  gap: 'KayKit City Builder Bits liegt nur als ZIP im Repo (nicht entpackt, nicht indexiert) → kein 1:1 mit KayKit-Teilen möglich, bis das Pack entpackt ist.',
  placements: P
};

/* ---------- palette: full part vocabulary per pack ---------- */
export const PALETTES = {
  roads: ['road-straight', 'road-straight-half', 'road-straight-barrier', 'road-straight-barrier-half', 'road-straight-barrier-end',
    'road-bend', 'road-bend-sidewalk', 'road-bend-barrier', 'road-bend-square', 'road-bend-square-barrier',
    'road-curve', 'road-curve-barrier', 'road-curve-pavement', 'road-curve-intersection', 'road-curve-intersection-barrier',
    'road-crossroad', 'road-crossroad-line', 'road-crossroad-path', 'road-crossroad-barrier',
    'road-intersection', 'road-intersection-line', 'road-intersection-path', 'road-intersection-barrier',
    'road-split', 'road-split-barrier', 'road-square', 'road-square-barrier',
    'road-side', 'road-side-barrier', 'road-side-entry', 'road-side-exit',
    'road-end', 'road-end-barrier', 'road-end-round', 'road-end-round-barrier',
    'road-roundabout', 'road-roundabout-barrier', 'road-crossing', 'road-bridge',
    'road-driveway-single', 'road-driveway-double',
    'road-slant', 'road-slant-high', 'road-slant-flat', 'road-slant-flat-high', 'road-slant-curve', 'road-slant-flat-curve',
    'tile-low', 'tile-high', 'tile-slant', 'tile-slantHigh',
    'traffic-light', 'traffic-light-hanging', 'light-square', 'light-curved', 'light-square-double', 'light-curved-double',
    'road-sign-street', 'road-sign-stop', 'road-sign-warning', 'sign-highway', 'sign-highway-wide',
    'construction-barrier', 'construction-cone', 'construction-fence', 'construction-light',
    'electricity-pole', 'electricity-wires', 'bridge-pillar', 'bridge-pillar-wide', 'dumpster'],
  city_com: ['building-a', 'building-b', 'building-c', 'building-d', 'building-e', 'building-f', 'building-g', 'building-h',
    'building-i', 'building-j', 'building-k', 'building-l', 'building-m', 'building-n',
    'building-skyscraper-a', 'building-skyscraper-b', 'building-skyscraper-c', 'building-skyscraper-d', 'building-skyscraper-e',
    'detail-awning', 'detail-awning-wide', 'detail-overhang', 'detail-overhang-wide', 'detail-parasol-a', 'detail-parasol-b'],
  city_sub: ['building-type-a', 'building-type-b', 'building-type-c', 'building-type-d', 'building-type-e', 'building-type-f',
    'building-type-g', 'building-type-h', 'building-type-i', 'building-type-j', 'building-type-k', 'building-type-l',
    'building-type-m', 'building-type-n', 'building-type-o', 'building-type-p', 'building-type-q', 'building-type-r',
    'building-type-s', 'building-type-t', 'building-type-u',
    'driveway-long', 'driveway-short', 'path-long', 'path-short', 'path-stones-long', 'path-stones-short', 'path-stones-messy',
    'fence', 'fence-low', 'fence-1x2', 'fence-1x3', 'fence-1x4', 'fence-2x2', 'fence-2x3', 'fence-3x2', 'fence-3x3',
    'planter', 'tree-large', 'tree-small']
};
