// List adjacent-but-unlinked road cells (parallels): node src/modules/roads/tools/par.mjs [seed] [R]
import { createServer } from 'vite';
const seed = Number(process.argv[2] ?? 1337), R = Number(process.argv[3] ?? 40);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const { DIRS, hexDistance } = await server.ssrLoadModule('/src/core/hex.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const layers = await server.ssrLoadModule('/src/modules/roads/layers.ts');
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, roads.layers[0]]) world.registerLayer(l);
  const net = layers.bindRoadNet(seed, (q, r) => world.cellAt(2, q, r));
  const nodes = net.nodesNear(0, 0, R + 15).map((x) => x.node);
  const out = [];
  for (let q = -R; q <= R; q++) for (let r = -R; r <= R; r++) {
    if (hexDistance(q, r, 0, 0) > R) continue;
    const c = net.cell(q, r); if (!c) continue;
    for (let d = 0; d < 3; d++) {
      const n = net.cell(q + DIRS[d][0], r + DIRS[d][1]);
      if (n && !(c.mask >> d & 1)) {
        const nd = Math.min(...nodes.map((o) => hexDistance(q, r, o.q, o.r)));
        out.push(`${q},${r}|d${d} nodeDist=${nd}`);
      }
    }
  }
  console.log(out.length, out.join('  '));
} finally { await server.close(); }
