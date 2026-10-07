// Origin node diagnostics: node src/modules/roads/tools/origin.mjs seed
import { createServer } from 'vite';
const seed = Number(process.argv[2] ?? 1337);
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
  const n = net.node(0, 0);
  console.log('node', n, 'kept', net.keptDirs(0, 0), 'deg', net.degree(0, 0));
  for (let k = 0; k < 6; k++) console.log(k, 'nb', !!net.node(DIRS[k][0], DIRS[k][1]), 'feas', net.node(DIRS[k][0], DIRS[k][1]) && net.feasible(0, 0, k), 'kept', net.keptDirs(0, 0).includes(k), 'path', net.keptDirs(0, 0).includes(k) && !!net.path(0, 0, k), 'alive', net.alive(0, 0, k));
  if (process.argv[3]) {
    const R = 22;
    for (let r = -R; r <= R; r += 1) {
      let line = ' '.repeat(r + R);
      for (let q = -R; q <= R; q++) {
        const c = world.cellAt(2, q, r);
        let ch = c.water ? '~' : c.biome === 'mountain' ? 'M' : c.tags.includes('rock') ? 'R' : c.slope ? '/' : String(c.level);
        if (net.corr(q, r).corridor) ch = 'c';
        for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { const b = net.basePoint(i, j); }
        line += ch + ' ';
      }
      console.log(line);
    }
  }
} finally { await server.close(); }
