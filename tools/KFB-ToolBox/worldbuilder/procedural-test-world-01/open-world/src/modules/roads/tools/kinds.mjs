// List flat road cells by kind near a point: node src/modules/roads/tools/kinds.mjs seed q0 r0 radius
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
  const out = { straight: [], bend: [], crossing: [], ramp: [] };
  for (let q = q0 - R; q <= q0 + R; q++) for (let r = r0 - R; r <= r0 + R; r++) {
    const c = world.cell(q, r);
    if (c.roadMask && c.slope && !c.bridge && out.ramp.length < 8) out.ramp.push([q, r, c.level, c.slope.dir, [0, 1, 2, 3, 4, 5].filter((d) => (c.roadMask >> d) & 1).join(''), Math.max(Math.abs(q - q0), Math.abs(r - r0), Math.abs(q + r - q0 - r0))]);
    if (!c.roadMask || c.slope || c.bridge || c.riverMask) continue;
    // whole ring at the same level, no slopes (clean flat context)
    let ok = true;
    for (const [dq, dr] of DIRS) { const n = world.cell(q + dq, r + dr); if (n.level !== c.level || n.water) ok = false; }
    if (!ok) continue;
    const bits = [0, 1, 2, 3, 4, 5].filter((d) => (c.roadMask >> d) & 1);
    const kind = bits.length >= 3 ? 'crossing' : bits.length === 2 ? ((bits[1] - bits[0]) === 3 ? 'straight' : 'bend') : null;
    if (kind && out[kind].length < 4) out[kind].push([q, r, c.level, bits.join(''), c.village ? 'v' : '']);
  }
  console.log(JSON.stringify(out));
} finally { await server.close(); }
