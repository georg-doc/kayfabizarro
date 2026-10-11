// C1b+C3 delivery: qcheck.json — V-112 tunnel checks per organ / tier (topology, components = Q1, Q5 sharp edges, boolean ms) + see-through
// rays + track clearance (Q3) + build time. node tools/track/tunnel-qcheck.mjs <out.json> [query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 800, height: 500 } }), logs = []; p.on('pageerror', (e) => logs.push(e.message));
const t0 = Date.now(); await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&organTier=hero&' + q); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 }); await p.waitForTimeout(1500);
const R = await p.evaluate(async () => { const O = window.__kfb.organ(), m = await import('/src/world/tunnel/tunnel-qcheck.ts');
  return { buildMs: O.info.buildMs, levelSetMs: O.meshStats.reduce((a, x) => a + x.ms, 0), joins: O.tunnelReports.map((t) => ({ id: t.id, tier: t.tier, topo: t.topo, components: t.components, compSmall: t.compSmall, crumbsDropped: t.crumbsDropped, floatingParts: t.floatingParts, specksDropped: t.specksDropped, bodyComponents: t.bodyComponents, q5: t.q5, tris: t.tris, booleanMs: t.tunnels.map((x) => x.booleanMs), totalMs: t.totalMs, parts: t.parts, error: t.error })), checks: m.tunnelQChecks(O), bodies: O.checkMeshes() }; });
R.bootMs = Date.now() - t0; R.query = q; R.logs = logs;
R.summary = { V112_topology: R.joins.every((j) => j.topo && !j.topo.open && !j.topo.multi && !j.topo.flipped), Q1_noFloatingParts: R.joins.every((j) => j.floatingParts === 0), floating: R.joins.map((j) => j.floatingParts), specks: R.joins.map((j) => j.specksDropped), crumbs: R.joins.map((j) => j.crumbsDropped), components: R.joins.map((j) => j.components), seeThroughMiss: R.checks.tunnels.reduce((a, t) => a + t.seeThrough.miss, 0), Q3_clearance: R.checks.tunnels.every((t) => t.clearance.pass), minClearance_m: Math.min(...R.checks.tunnels.map((t) => t.clearance.minMargin_m)) };
fs.writeFileSync(out, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R.summary), JSON.stringify(R.checks.tunnels.map((t) => [t.i0, t.seeThrough.miss, t.clearance])));
for (const j of R.joins) console.log(j.id, j.tier, JSON.stringify(j.topo), j.components, j.bodyComponents, JSON.stringify(j.compSmall));
await b.close();
