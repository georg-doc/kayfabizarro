// Offline network stats: node src/modules/roads/tools/harness.mjs [seed] [radiusCells]
// Loads core + terrain + roads through Vite's SSR loader (same module graph as the browser), no rendering.
import { createServer } from 'vite';
const seed = Number(process.argv[2] ?? 1337);
const R = Number(process.argv[3] ?? 40);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule((process.env.ROADS ?? '/src/modules/roads') + '/index.ts')).default;
  const stats = await server.ssrLoadModule((process.env.ROADS ?? '/src/modules/roads') + '/stats.ts');
  const layers = await server.ssrLoadModule((process.env.ROADS ?? '/src/modules/roads') + '/layers.ts');
  const net = await server.ssrLoadModule((process.env.ROADS ?? '/src/modules/roads') + '/net.ts');
  for (const f of (process.env.DBG ?? '').split(',').filter(Boolean)) net.DEBUG[f] = true;
  if (process.env.RFB) net.setRampFallback(Number(process.env.RFB));
  if (process.env.RIVDBG) globalThis.__RIVDBG = true;
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, ...(roads.layers ?? [])]) if (l) world.registerLayer(l);
  if (process.env.PF) {
    const { Prefetcher } = await server.ssrLoadModule((process.env.ROADS ?? '/src/modules/roads') + '/prefetch.ts');
    const rnet = layers.bindRoadNet(seed, (q, r) => world.cellAt(2, q, r));
    const rv = layers.bindRiverNet(seed, (q, r) => world.cellAt(4, q, r));
    const pf = new Prefetcher(world, rnet, rv, R + 5);
    const tp = performance.now(); let steps = 0;
    pf.update(0, 0, 0.0001);
    const cpuSteps = [];
    while (pf.gen) {
      const c0 = process.cpuUsage(); const ph = pf.phase;
      const st0 = { ...rnet.stats };
      rnet.strictCache = pf.strict;
      let r; try { r = pf.gen.next(); } finally { rnet.strictCache = false; }
      const c1 = process.cpuUsage(c0); const ms = (c1.user + c1.system) / 1000;
      const st1 = rnet.stats;
      const dl = (k) => Math.round((st1[k] ?? 0) - (st0[k] ?? 0));
      cpuSteps.push([ms, ph + '→' + pf.phase + ' exp' + dl('expansions') + ' routes' + dl('routes') + ' cellMs' + dl('cellMs') + ' searchMs' + dl('searchMs')]);
      if (r.done) pf.gen = null;
      steps++;
    }
    cpuSteps.sort((a, b) => b[0] - a[0]);
    console.error('cpu-steps', steps, JSON.stringify(cpuSteps.slice(0, 12).map(([m, p]) => p + ' ' + m.toFixed(0))), 'over20', cpuSteps.filter((x) => x[0] > 20).length);
    console.error('prefetch', JSON.stringify({ ms: Math.round(performance.now() - tp), maxStep: +pf.maxStep.toFixed(1), phase: pf.maxPhase, slow: pf.slow, regions: pf.done }));
  }
  let t0 = performance.now();
  const P = Number(process.argv[4] ?? 30);
  for (let q = -R - P; q <= R + P; q++) for (let r = -R - P; r <= R + P; r++) world.cellAt(2, q, r);
  const terrainMs = performance.now() - t0;
  t0 = performance.now();
  const cpu0 = process.cpuUsage();
  const s = stats.networkStats(world, 0, 0, R);
  s.terrainWarmMs = +terrainMs.toFixed(0);
  let hsh = 0;
  for (let q = -R; q <= R; q++) for (let r = -R; r <= R; r++) { const c = world.cell(q, r); hsh = (Math.imul(hsh, 31) + c.roadMask * 64 + c.riverMask + (c.slope ? 1000 + c.slope.dir : 0) + c.level * 7) | 0; }
  s.maskHash = hsh;
  s.layersMs = +(performance.now() - t0).toFixed(0);
  { const c = process.cpuUsage(cpu0); s.layersCpuMs = Math.round((c.user + c.system) / 1000); }
  s.road = layers.roadNetOf(seed)?.stats;
  s.rivers = layers.riverNetOf(seed)?.stats;
  console.log(JSON.stringify(s));
} finally {
  await server.close();
}
