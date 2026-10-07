// River diagnostics: node src/modules/roads/tools/rdiag.mjs [seed]
import { createServer } from 'vite';
const seed = Number(process.argv[2] ?? 1337);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const layers = await server.ssrLoadModule('/src/modules/roads/layers.ts');
  const corr = await server.ssrLoadModule('/src/modules/roads/corridor.ts');
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, ...(roads.layers ?? [])]) if (l) world.registerLayer(l);
  const rn = layers.bindRiverNet(seed, (q, r) => world.cellAt(4, q, r));
  console.log('axis', corr.riverAxis(seed), 'spacing', corr.riverSpacing(), 'id@0', rn.corr(0, 0));
  const id0 = rn.corr(0, 0).id, n0 = Math.floor(rn.vOf(0, 0) / 7);
  for (let k = id0 - 1; k <= id0 + 1; k++) {
    let line = `k=${k}: `;
    for (let n = n0 - 8; n <= n0 + 8; n++) {
      const g = rn.gate(k, n);
      const l = rn.link(k, n);
      line += g ? (l ? 'o-' : 'oX') : '..';
    }
    console.log(line);
  }
  for (let k = id0 - 1; k <= id0 + 1; k++) for (let n = n0 - 8; n <= n0 + 8; n++) if (rn.gate(k, n) && !rn.link(k, n)) {
    const g0 = rn.gate(k, n), g1 = rn.gate(k, n + 1);
    console.log('link fail', k, n, g0, g1);
    if (g0 && g1) for (let r = Math.min(g0.r, g1.r) - 3; r <= Math.max(g0.r, g1.r) + 3; r++) {
      let line = ' '.repeat(r - Math.min(g0.r, g1.r) + 3);
      for (let q = Math.min(g0.q, g1.q) - 4; q <= Math.max(g0.q, g1.q) + 4; q++) {
        const c = world.cellAt(4, q, r); const ci = rn.corr(q, r);
        let ch = !ci.corridor ? '.' : ci.id !== k ? 'x' : c.roadMask ? 'R' : c.village ? 'V' : c.slope ? '/' : String(c.level);
        if (g0.q === q && g0.r === r) ch = 'A'; if (g1.q === q && g1.r === r) ch = 'B';
        line += ch + ' ';
      }
      console.log(line);
    }
  }
  if (process.env.GATES) for (let n = n0 - 6; n <= n0 + 6; n++) { const g = rn.gate(id0, n); console.log('gate', id0, n, g, g && rn.corr(g.q, g.r).dist.toFixed(2)); }
  // detail of a missing gate
  const { hexRound, worldToAxial } = await server.ssrLoadModule('/src/core/hex.ts');
  const A = corr.riverAxis(seed);
  const dump = (k, n) => {
    const v = n * 7; const seen = new Set();
    for (let t = k * 37 - 20; t <= k * 37 + 20; t += 0.5) {
      const fa = worldToAxial((v * -A.az + t * A.ax) * 15, (v * A.ax + t * A.az) * 15); const h = hexRound(fa.q, fa.r);
      const kk = h.q + ',' + h.r; if (seen.has(kk)) continue; seen.add(kk);
      const ci = rn.corr(h.q, h.r); if (!ci.corridor) continue;
      const c = world.cellAt(4, h.q, h.r);
      console.log(`  t=${t} ${kk} id=${ci.id} d=${ci.dist.toFixed(2)} on=${ci.onCentre} water=${c.water} coast=${c.coastMask} biome=${c.biome} slope=${!!c.slope} road=${c.roadMask} tags=${c.tags}`);
    }
  };
  for (let k = id0 - 1; k <= id0 + 1; k++) for (let n = n0 - 8; n <= n0 + 8; n++) if (!rn.gate(k, n)) { console.log('missing gate', k, n); dump(k, n); break; }
} finally { await server.close(); }
