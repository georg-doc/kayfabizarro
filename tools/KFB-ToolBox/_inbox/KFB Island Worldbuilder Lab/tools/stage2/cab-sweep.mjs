// Stufe 2 · Cabrio-Sitz: static sweep in the seated pose (leg fix weight × seat shift × wheel angle) → gates per setting.
import fs from 'node:fs';
import { openLab } from '../stage1/browser.mjs';
const out = process.argv[2], wb = process.argv[3] ?? '0';
const { page, close } = await openLab('shot=1&hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=0&car=cabrio&wheelBack=' + wb);
await page.waitForFunction(() => window.__kfb?.travel?.()?.cabSeat, null, { timeout: 180000 });
const res = await page.evaluate(() => { const cs = window.__kfb.travel().cabSeat, angles = [-120, -90, -60, -45, -30, -15, 0, 15, 30, 45, 60, 90, 120], rows = [];
  for (const reachCap of [0]) for (const dz of [0]) rows.push({ reachCap, ...cs.evalStatic({ legW: 0, shift: [0, 0, dz], angles, reachCap }) });
  return rows; });
for (const r of res) { const ok = r.grips.filter(([a, g]) => g <= 0.03).map(([a]) => a); console.log(JSON.stringify({ wheelBack: wb, reachCap: r.reachCap, legW: r.legW, dz: r.shift[2], feet: r.feetAboveFloorH, pelvis: r.pelvisAboveSeatH, legHits: r.legHits, gripOkAngles: ok.join(','), grip0: r.grips.find(([a]) => a === 0)[1], gripMax: Math.max(...r.grips.map((g) => g[1])) })); }
if (out) fs.writeFileSync(out, JSON.stringify(res, null, 1));
await close();
