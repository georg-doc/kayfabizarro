// node src/modules/roads/tools/dead.mjs seed q r
import { createServer } from 'vite';
const [seed, q, r] = process.argv.slice(2).map(Number);
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
  const n = net.nodeAtCell(q, r);
  console.log(n, 'cell', net.cell(q, r));
  const show = (i, j) => console.log(i, j, 'kept', net.keptDirs(i, j), 'alive r0..2', [0, 1, 2].map((rd) => net.keptDirs(i, j).filter((k) => net.alive(i, j, k, rd))));
  show(n.i, n.j);
  for (const k of net.keptDirs(n.i, n.j)) show(n.i + DIRS[k][0], n.j + DIRS[k][1]);
} finally { await server.close(); }
