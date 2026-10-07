// Failure diagnostics for road edges: node src/modules/roads/tools/diag.mjs [seed]
import { createServer } from 'vite';
const seed = Number(process.argv[2] ?? 1337);
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
try {
  const { WorldModel } = await server.ssrLoadModule('/src/core/world.ts');
  const { DIRS, hexDistance } = await server.ssrLoadModule('/src/core/hex.ts');
  const terrain = (await server.ssrLoadModule('/src/modules/terrain/index.ts')).default;
  const roads = (await server.ssrLoadModule('/src/modules/roads/index.ts')).default;
  const layers = await server.ssrLoadModule('/src/modules/roads/layers.ts');
  const world = new WorldModel(seed);
  for (const l of [terrain.layer, ...(roads.layers ?? [])]) if (l) world.registerLayer(l);
  const net = layers.bindRoadNet(seed, (q, r) => world.cellAt(2, q, r));
  const get = (q, r) => world.cellAt(2, q, r);
  const pass = (c) => !c.water && !c.coastMask && c.biome !== 'mountain' && !c.tags.includes('rock');
  let fails = 0, reach1 = 0, levelDiff = {};
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
    for (const k of net.keptDirs(i, j)) {
      if (k > 2) continue;
      const p = net.path(i, j, k);
      if (p) continue;
      fails++;
      const a = net.node(i, j), b = net.node(i + DIRS[k][0], j + DIRS[k][1]);
      const dl = Math.abs(a.level - b.level);
      levelDiff[dl] = (levelDiff[dl] ?? 0) + 1;
      // BFS allowing |Δlevel| ≤ 1 within distance 8 of both
      const seen = new Set([a.q + ',' + a.r]); const Q = [[a.q, a.r]]; let ok = false;
      while (Q.length) { const [q, r] = Q.shift(); if (q === b.q && r === b.r) { ok = true; break; }
        const c = get(q, r);
        for (const [dq, dr] of DIRS) { const nq = q + dq, nr = r + dr; const kk = nq + ',' + nr; if (seen.has(kk)) continue;
          if (hexDistance(nq, nr, a.q, a.r) + hexDistance(nq, nr, b.q, b.r) > hexDistance(a.q, a.r, b.q, b.r) + 10) continue;
          const n = get(nq, nr); if (!pass(n) || Math.abs(n.level - c.level) > 1) continue; seen.add(kk); Q.push([nq, nr]); } }
      if (ok) reach1++;
      console.log(`fail ${i},${j}->${k} a(${a.q},${a.r},L${a.level}) b(${b.q},${b.r},L${b.level}) reachable±1=${ok}`);
    }
  }
  console.log({ fails, reach1, levelDiff });
} finally { await server.close(); }
