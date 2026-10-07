// Inspect one edge's terrain: node src/modules/roads/tools/edge.mjs seed i j k
import { createServer } from 'vite';
const [seed, i, j, k] = process.argv.slice(2).map(Number);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const { DIRS } = await server.ssrLoadModule('/src/core/hex.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const layers = await server.ssrLoadModule('/src/modules/roads/layers.ts');
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, roads.layers[0]]) world.registerLayer(l);
  const net = layers.bindRoadNet(seed, (q, r) => world.cellAt(2, q, r));
  const a = net.node(i, j), b = net.node(i + DIRS[k][0], j + DIRS[k][1]);
  console.log(a, b, "feasible", net.feasible(i, j, k), "kept", net.keptDirs(i, j));
  const NET = await server.ssrLoadModule('/src/modules/roads/net.ts');
  for (const f of [[], ['noStraight'], ['noSector'], ['wide'], ['noStraight', 'noSector', 'wide'], ['oldRamp', 'noStraight', 'noSector', 'wide'], ['noLoop'], ['noLoop', 'wide', 'oldRamp'], ['noLevels']]) {
    for (const x of Object.keys(NET.DEBUG)) NET.DEBUG[x] = false; for (const x of f) NET.DEBUG[x] = true;
    const p = net.route(i, j, k, 'fallback', new Set());
    console.log(f.join(','), !!p, p && p.steps.map((s) => s.mode).join(''));
  }
  for (const x of Object.keys(NET.DEBUG)) NET.DEBUG[x] = false;
  NET.DEBUG.trace = []; NET.DEBUG.wide = true; net.route(i, j, k, 'fallback', new Set()); console.log('ramp pushes', JSON.stringify(NET.DEBUG.trace)); NET.DEBUG.trace = null; NET.DEBUG.wide = false;
  // ramp sites: for each cell and dir, foot / notch cost finite
  const sites = new Set();
  for (let q = Math.min(a.q, b.q) - 4; q <= Math.max(a.q, b.q) + 4; q++) for (let r = Math.min(a.r, b.r) - 4; r <= Math.max(a.r, b.r) + 4; r++) for (let d = 0; d < 6; d++) {
    const c = world.cellAt(2, q, r);
    if (net.footCost(q, r, d, c.level) < Infinity) sites.add(q + ',' + r);
    if (net.notchCost(q, r, d, c.level) < Infinity) sites.add(q + ',' + r);
  }
  const q0 = Math.min(a.q, b.q) - 4, q1 = Math.max(a.q, b.q) + 4, r0 = Math.min(a.r, b.r) - 4, r1 = Math.max(a.r, b.r) + 4;
  for (let r = r0; r <= r1; r++) {
    let line = ' '.repeat((r - r0));
    for (let q = q0; q <= q1; q++) {
      const c = world.cellAt(2, q, r);
      let ch = c.water ? '~' : c.biome === 'mountain' ? 'M' : c.tags.includes('rock') ? 'R' : c.slope ? '/' : String(c.level);
      if (sites.has(q + ',' + r)) ch = ch + '*'; else ch = ch + ' ';
      if (q === a.q && r === a.r) ch = 'A '; if (q === b.q && r === b.r) ch = 'B ';
      if (net.corr(q, r).corridor && ch.match(/\d/)) ch = 'c';
      line += ch;
    }
    console.log(line);
  }
} finally { await server.close(); }
