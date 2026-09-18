// kfb-region-field.js — Schicht `world`: deterministisches Regionen-Feld ueber dem Voxel-Terrain.
//
// Eine Region = regionChunks x regionChunks Terrain-Chunks (Default 4 x 4 x 48 u = 192 u Kante).
// Jede Region leitet aus (worldSeed, rx, rz) ihren Story-Modus, Vektor und Weltkontext ab —
// derselbe Seed liefert dieselbe Welt, egal aus welcher Richtung man kommt (Abnahme Phase 1).
//
// Was die Region in Slice 0 traegt: Stimmung (Modus/Palette/Nebel), Anker, Namen.
// Was sie NICHT traegt (bewusst, bis Terrain v11): die Hoehenform. Das Relief kommt weiter aus
// EINEM globalen Weltkontext, sonst springt der Boden an der Regionsgrenze unter dem Mech.
//
// Vertrag: reine Daten, kein THREE, kein DOM. Der Wirt zeichnet.

export const DEFAULT_REGION_CHUNKS = 4;
const DIMS = ['power', 'lore', 'name', 'chaos', 'wonder', 'threat', 'humor', 'melancholy'];
const BIOMES = ['meadow', 'plateau', 'fractured', 'scorched', 'luminous', 'tidal'];

// Namensbausteine — ein Ort braucht einen Namen, sonst ist er eine Koordinate.
const NAME_A = { tragic: ['Grauer', 'Stiller', 'Verlorener', 'Kalter'], comic: ['Kicheriger', 'Hüpfender', 'Bunter', 'Schiefer'],
  absurd: ['Verkehrter', 'Wirrer', 'Schräger', 'Purzelnder'], heroic: ['Goldener', 'Hoher', 'Stolzer', 'Weiter'],
  mystical: ['Flüsternder', 'Nebliger', 'Leuchtender', 'Alter'], forbidden: ['Roter', 'Gesperrter', 'Dunkler', 'Stachliger'] };
const NAME_B = { meadow: 'Anger', plateau: 'Tisch', fractured: 'Bruch', scorched: 'Brand', luminous: 'Schein', tidal: 'Schwemm' };

export function createRegionField({ WC, worldSeed = 'kfb-world', chunk = 48, regionChunks = DEFAULT_REGION_CHUNKS, storyMode = 'random', seam = 22 } = {}) {
  if (!WC) throw new Error('kfb-region-field: WC (world-context.js) fehlt');
  const size = chunk * regionChunks;
  const wseed = WC.normalizeSeed(worldSeed);
  const cache = new Map();

  function coordOf(x, z) { return { rx: Math.floor((x + size / 2) / size), rz: Math.floor((z + size / 2) / size) }; }

  function region(rx, rz) {
    const key = rx + ',' + rz;
    let r = cache.get(key);
    if (r) return r;
    const seed = WC.joinSeeds(wseed, 'region', rx, rz);
    const rng = WC.mulberry32(seed);
    const vec = {}; DIMS.forEach((k) => { vec[k] = rng(); });
    const mode = storyMode && storyMode !== 'random' ? storyMode : WC.STORY_MODES[Math.floor(rng() * 6)];
    const wc = WC.makeWorldContext({ cardTriplet: { current: vec }, storyMode: mode, seeds: ['mech-voxel-world', wseed, rx, rz] });
    wc.seed = seed;
    // Biome aus dem Vektor, nicht aus makeWorldContext — damit bleibt es hier lesbar und stabil.
    const biome = BIOMES[Math.floor(rng() * BIOMES.length)];
    const a = NAME_A[mode] || NAME_A.heroic;
    const name = a[Math.floor(rng() * a.length)] + ' ' + (NAME_B[biome] || 'Ort');
    // Anker: Regionsmitte plus ein gewuerfelter Versatz von bis zu 30 % — nie am Rand.
    const cx = rx * size, cz = rz * size;
    const anchor = { x: cx + (rng() - 0.5) * size * 0.6, z: cz + (rng() - 0.5) * size * 0.6 };
    r = { rx, rz, id: 'R' + (rx >= 0 ? '+' : '') + rx + (rz >= 0 ? '+' : '') + rz, key, seed, storyMode: mode, storyModeName: wc.storyModeName || mode.toUpperCase(),
      biome, vector: vec, wc, palette: wc.palette.map((c) => c.slice()), center: { x: cx, z: cz }, anchor, name,
      fogDensity: 0.0025 + vec.melancholy * 0.004 + vec.threat * 0.0025 };
    cache.set(key, r);
    return r;
  }

  function regionAt(x, z) { const c = coordOf(x, z); return region(c.rx, c.rz); }

  function neighbors(rx, rz, ring = 1) {
    const out = [];
    for (let dz = -ring; dz <= ring; dz++) for (let dx = -ring; dx <= ring; dx++) out.push(region(rx + dx, rz + dz));
    return out;
  }

  /* Weiche Naht: Anteil der Nachbarregion jenseits der naechsten Kante (0 = ganz hier, 0.5 = auf der Kante).
     Ecken werden ueber zwei Achsen gemischt; das reicht fuer Farbe/Nebel — die Hoehe mischt erst v11. */
  function blendAt(x, z) {
    const c = coordOf(x, z), here = region(c.rx, c.rz);
    const lx = x - c.rx * size, lz = z - c.rz * size;   // -size/2 .. size/2
    const half = size / 2;
    const ex = half - Math.abs(lx), ez = half - Math.abs(lz);   // Abstand zur Kante je Achse
    const wx = ex < seam ? 0.5 * (1 - ex / seam) : 0, wz = ez < seam ? 0.5 * (1 - ez / seam) : 0;
    const parts = [{ r: here, w: 1 - wx - wz + wx * wz }];
    if (wx > 0) parts.push({ r: region(c.rx + Math.sign(lx), c.rz), w: wx * (1 - wz) });
    if (wz > 0) parts.push({ r: region(c.rx, c.rz + Math.sign(lz)), w: wz * (1 - wx) });
    if (wx > 0 && wz > 0) parts.push({ r: region(c.rx + Math.sign(lx), c.rz + Math.sign(lz)), w: wx * wz });
    return { here, parts };
  }

  /* Gemischte Palette (3 Stops RGB 0..1) und Nebeldichte an einem Ort. */
  function moodAt(x, z) {
    const b = blendAt(x, z);
    const pal = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; let fog = 0;
    for (const p of b.parts) {
      for (let s = 0; s < 3; s++) for (let k = 0; k < 3; k++) pal[s][k] += p.r.palette[s][k] * p.w;
      fog += p.r.fogDensity * p.w;
    }
    return { here: b.here, palette: pal, fogDensity: fog, parts: b.parts };
  }

  return { size, chunk, regionChunks, worldSeed: wseed, seam, coordOf, region, regionAt, neighbors, blendAt, moodAt, get count() { return cache.size; } };
}
