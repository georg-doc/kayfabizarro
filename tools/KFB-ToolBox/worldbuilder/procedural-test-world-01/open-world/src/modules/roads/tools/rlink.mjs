// Debug one river link: node src/modules/roads/tools/rlink.mjs seed k n
import { createServer } from 'vite';
const [seed, k, n] = process.argv.slice(2).map(Number);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const layers = await server.ssrLoadModule('/src/modules/roads/layers.ts');
  const net = await server.ssrLoadModule('/src/modules/roads/net.ts');
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, ...(roads.layers ?? [])]) if (l) world.registerLayer(l);
  layers.bindRoadNet(seed, (q, r) => world.cellAt(2, q, r));
  const rv = layers.bindRiverNet(seed, (q, r) => world.cellAt(4, q, r));
  const g0 = rv.gate(k, n), g1 = rv.gate(k, n + 1);
  const gd = rv.gateDir(k, n), d1 = rv.gateDir(k, n + 1), jog0 = rv.jogAt(k, n), jog1 = rv.jogAt(k, n + 1);
  console.log({ g0, g1, gd, d1, jog0, jog1 });
  for (const [relax, jog] of [[0, jog0], [0, 0], [1, 0], [2, 0], [4, 0], [5, 0]]) {
    const r = net.drain(rv.routeIter(k, g0, g1, (gd + jog + 6) % 6, d1, relax, jog, jog1, n));
    console.log(relax, jog, r ? r.map((s) => s.dir).join('') : null);
  }
} finally { await server.close(); }
