// Dump cells: node src/modules/roads/tools/row.mjs seed q0 q1 r0 r1
import { createServer } from 'vite';
const [seed, q0, q1, r0, r1] = process.argv.slice(2).map(Number);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, ...(roads.layers ?? [])]) if (l) world.registerLayer(l);
  for (let r = r0; r <= r1; r++) {
    let line = String(r).padStart(4) + ' ';
    for (let q = q0; q <= q1; q++) {
      const c = world.cell(q, r);
      line += (c.water ? '~' : c.coast ? ',' : String(c.level)) + (c.riverMask ? 'R' + c.riverMask.toString(16).padStart(2, '0') : c.slope ? 's' + c.slope.dir + '  ' : c.roadMask ? 'r   ' : '    ') + ' ';
    }
    console.log(line);
  }
} finally { await server.close(); }
