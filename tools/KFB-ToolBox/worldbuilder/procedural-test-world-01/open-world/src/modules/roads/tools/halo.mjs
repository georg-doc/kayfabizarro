// How many terrain cells does the road layer pull in for a block? node src/modules/roads/tools/halo.mjs [seed]
import { createServer } from 'vite';
const seed = Number(process.argv[2] ?? 42);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const layers = await server.ssrLoadModule('/src/modules/roads/layers.ts');
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, ...(roads.layers ?? [])]) if (l) world.registerLayer(l);
  const Q = 600, R = 0, N = 16;
  let t = performance.now();
  for (let q = Q; q < Q + N; q++) for (let r = R; r < R + N; r++) world.cellAt(3, q, r);
  const ms = performance.now() - t;
  const net = layers.roadNetOf(seed);
  let minq = 1e9, maxq = -1e9, minr = 1e9, maxr = -1e9;
  for (const k of world.memo[0].keys()) { const [q, r] = k.split(',').map(Number); minq = Math.min(minq, q); maxq = Math.max(maxq, q); minr = Math.min(minr, r); maxr = Math.max(maxr, r); }
  console.log({ block: N * N, terrainCells: world.memo[0].size, bbox: [minq, maxq, minr, maxr], ms: ms | 0, net: net.stats, nodes: net.nodeMemo.size, feas: net.feasMemo.size, kept: net.keptMemo.size, paths: net.pathMemo.size });
} finally { await server.close(); }
