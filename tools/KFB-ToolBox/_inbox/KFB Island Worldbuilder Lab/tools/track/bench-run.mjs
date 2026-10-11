// V-130 Prüfbank A: per look load bench.html?look=…, wait for the build, write the checks (closedness, join report, Q-checks, field, times)
// and the four TC1 sheet views (portal_in, inside, portal_out, overview) at 1600×900. node tools/track/bench-run.mjs <outDir> [looks] [extra query]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, looksArg = 'stone_arch,stone_rect,race_tube,mine', extra = ''] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const R = {};
for (const look of looksArg.split(',')) {
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } }), logs = []; p.on('pageerror', (e) => logs.push(e.message)); p.on('response', (rs) => { if (rs.status() >= 400) logs.push('HTTP ' + rs.status() + ' ' + rs.url()); }); p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 300)); });
  await p.goto(`http://127.0.0.1:5192/bench.html?look=${look}${extra ? '&' + extra : ''}`); await p.waitForFunction(() => window.__bench?.ready, null, { timeout: 900000 });
  const r = await p.evaluate(() => { const B = window.__bench; if (B.error) return { error: B.error }; const rep = B.report; return { look: B.look, profile: B.profile, host: B.host, buildMs: B.buildMs, levelSetMs: B.levelSetMs, field: B.field, ft: B.ft, tc1: B.tc1, closed: B.closed,
    join: { topo: rep.topo, components: rep.components, bodyComponents: rep.bodyComponents, floating: rep.floatingParts, specks: rep.specksDropped, crumbs: rep.crumbsDropped, compSmall: rep.compSmall, q5: rep.q5, parts: rep.parts, tris: rep.tris },
    qcheck: B.qcheck, errors: B.errors }; });
  r.logs = logs; R[look] = r; console.log(look, JSON.stringify({ err: r.error?.slice(0, 300), buildMs: r.buildMs, closed: r.closed && { open: r.closed.open, multi: r.closed.multi, tris: r.closed.tris }, comp: r.join?.components, floating: r.join?.floating, q5: r.join && { n: r.join.q5.sharpEdges, chains: r.join.q5.chainsOver0_2H, longest: r.join.q5.longestChain_m }, see: r.qcheck?.tunnels?.[0]?.seeThrough?.miss, clr: r.qcheck?.tunnels?.[0]?.clearance?.minMargin_m, logs: logs.slice(0, 3) }));
  if (!r.error) for (const v of await p.evaluate(() => window.__bench.viewNames ?? ['portal_in', 'inside', 'portal_out', 'overview'])) { await p.evaluate((v) => window.__bench.view(v), v); await p.waitForTimeout(900); await p.screenshot({ path: `${out}/${look}_${v}.jpg`, type: 'jpeg', quality: 90 }); }
  await p.close();
}
fs.writeFileSync(`${out}/bench_checks.json`, JSON.stringify(R, null, 1)); await b.close();
