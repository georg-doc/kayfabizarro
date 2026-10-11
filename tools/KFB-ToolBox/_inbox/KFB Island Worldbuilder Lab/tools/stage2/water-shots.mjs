// Wasser (B+) · acceptance stills: PondLand pond (fluid sheet, no basin) from the bank + close; ?stage=lake overview (lake + river) and
// shore close-up at the river bend (no edge artefacts). node tools/stage2/water-shots.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const report = { shots: {} };
async function page(params) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } }); const logs = [], external = new Set();
  p.on('pageerror', (e) => logs.push('pageerror ' + e.message)); p.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); });
  p.on('request', (r) => { const u = new URL(r.url()); if (!/^(127\.0\.0\.1|localhost)$/.test(u.hostname) && /^https?:$/.test(u.protocol)) external.add(u.hostname + u.pathname.slice(0, 50)); });
  await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0' + params); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.water?.(), null, { timeout: 180000 }); await p.waitForTimeout(3500);
  return { p, logs, external };
}
const shot = async (P, name, pos, tgt) => { await P.p.evaluate(({ pos, tgt }) => window.__kfb.camOverride(pos, tgt), { pos, tgt }); await P.p.waitForTimeout(1800); await P.p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 90 }); };
// PondLand
{ const P = await page('');
  const bb = await P.p.evaluate(() => { const m = window.__kfb.stageOwner().group.getObjectByName('pond-fluid'); if (!m) return null; const T = window.__kfb.three(), B = new T.Box3().setFromObject(m), c = B.getCenter(new T.Vector3()), s = B.getSize(new T.Vector3()); return { c: c.toArray(), s: s.toArray() }; });
  report.pond = { info: await P.p.evaluate(() => window.__kfb.water().pond), bbox: bb };
  if (bb) { const [cx, cy, cz] = bb.c, R = Math.max(bb.s[0], bb.s[2]);
    await shot(P, '01_pondland_pond', [cx + R * 0.55, cy + R * 0.38, cz + R * 0.75], [cx, cy, cz]);
    await shot(P, '02_pondland_pond_close', [cx + R * 0.22, cy + R * 0.12, cz + R * 0.3], [cx - R * 0.05, cy, cz]); }
  report.pondLogs = P.logs; report.pondExternal = [...P.external]; report.pondErrors = await P.p.evaluate(() => window.__kfb.errors); await P.p.close(); }
// lake stage (kit metres × k)
{ const P = await page('&stage=lake'); const k = 3.64 / 1.85;
  report.lake = await P.p.evaluate(() => window.__kfb.water().lake);
  const m = (x, y, z) => [x * k, y * k, z * k];
  await shot(P, '03_lake_river_overview', m(-2, 34, -46), m(-1, -1, 1));
  await shot(P, '04_lake_shore_close', m(16, 3.2, -14), m(10, -0.6, -6));
  await shot(P, '05_lake_outflow_close', m(-4, 3.0, -9), m(-6, -0.5, 0));
  report.lakeLogs = P.logs; report.lakeExternal = [...P.external]; report.lakeErrors = await P.p.evaluate(() => window.__kfb.errors); await P.p.close(); }
fs.writeFileSync(`${out}/water-shots.json`, JSON.stringify(report, null, 1)); console.log(JSON.stringify(report));
await b.close();
