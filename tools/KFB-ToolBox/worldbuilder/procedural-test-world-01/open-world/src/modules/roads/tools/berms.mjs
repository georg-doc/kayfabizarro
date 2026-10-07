// List road cells that get a berm (flat road cell beside a same-level ramp's side): node .../berms.mjs seed q0 r0 R
import { createServer } from 'vite';
const [seed, q0, r0, R] = process.argv.slice(2).map(Number);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, ...(roads.layers ?? [])]) if (l) world.registerLayer(l);
  const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  const out = [];
  for (let q = q0 - R; q <= q0 + R; q++) for (let r = r0 - R; r <= r0 + R; r++) {
    const c = world.cell(q, r);
    if (!c.roadMask || c.slope || c.bridge || c.riverMask) continue;
    for (let d = 0; d < 6; d++) {
      const n = world.cell(q + DIRS[d][0], r + DIRS[d][1]);
      if (!n.slope || n.riverMask || n.water || n.level !== c.level) continue;
      const rel = ((d + 3) % 6 - n.slope.dir + 6) % 6;
      if (rel === 1 || rel === 2 || rel === 4 || rel === 5) out.push([q, r, d, n.roadMask ? 'roadramp' : 'tongue', Math.max(Math.abs(q - q0), Math.abs(r - r0), Math.abs(q + r - q0 - r0))]);
    }
  }
  console.log(JSON.stringify(out.sort((a, b) => a[4] - b[4]).slice(0, 20)));
} finally { await server.close(); }
