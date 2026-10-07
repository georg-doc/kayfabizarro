// Inspect the nearest crossing: node src/modules/roads/tools/node.mjs [seed]
import { createServer } from 'vite';
const seed = Number(process.argv[2] ?? 1337);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const layers = await server.ssrLoadModule('/src/modules/roads/layers.ts');
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, roads.layers[0]]) world.registerLayer(l);
  const net = layers.bindRoadNet(seed, (q, r) => world.cellAt(2, q, r));
  for (const { node, degree } of net.nodesNear(0, 0, 40).slice(0, 6)) {
    const c = net.cell(node.q, node.r);
    console.log(node.i, node.j, node.q, node.r, 'deg', degree, 'kept', net.keptDirs(node.i, node.j), 'hsel', [0,1,2,3,4,5].filter((k) => net.hsel(node.i, node.j, k)), 'mask', c?.mask.toString(2), 'ports', [...net.ports(node.i, node.j)]);
  }
} finally { await server.close(); }
