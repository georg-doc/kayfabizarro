// Debug river gates around a cell: node src/modules/roads/tools/gatedbg.mjs seed q r
import { createServer } from 'vite';
const [seed, q, r] = process.argv.slice(2).map(Number);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const layers = await server.ssrLoadModule('/src/modules/roads/layers.ts');
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, ...(roads.layers ?? [])]) if (l) world.registerLayer(l);
  layers.bindRoadNet(seed, (q, r) => world.cellAt(2, q, r));
  const rv = layers.bindRiverNet(seed, (q, r) => world.cellAt(4, q, r));
  const ci = rv.corr(q, r); const k = ci.id;
  const GATE = rv.vOf(q, r);
  console.log('corr', ci, 'v', GATE.toFixed(2));
  for (let n = -400; n < 400; n++) {
    const g = rv.gate(k, n); if (!g) { const cs = rv.gateCells(k, n); if (cs.some(([a, b]) => Math.abs(a - q) + Math.abs(b - r) < 16)) { console.log('NULL gate', n, cs.map(([a, b]) => { const c = world.cellAt(3, a, b); return `${a},${b} L${c.level}${c.slope ? ' slope' : ''}${c.roadMask ? ' road' : ''}${c.water ? ' water' : ''}${c.coastMask ? ' coast' : ''}${c.village ? ' vil' : ''}${c.building ? ' bld' : ''}${c.tags.includes('rock') ? ' rock' : ''} ${c.biome} d${rv.corr(a, b).dist.toFixed(2)}`; }).join(' | ')); } continue; }
    if (Math.abs(g.q - q) + Math.abs(g.r - r) < 16) { const l = rv.link(k, n); console.log('gate', n, g, 'link', l ? l.length : null); }
  }
} finally { await server.close(); }
