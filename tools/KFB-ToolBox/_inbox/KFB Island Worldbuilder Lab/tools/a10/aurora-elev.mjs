// A10 · aurora elevation sweep in the game camera (night): stills for a list of elevations. node tools/a10/aurora-elev.mjs <outDir> 5,10,15,20
import { chromium } from 'playwright-core';
const [out, list] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0&time=night&circle=0'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.skyOwner?.(), null, { timeout: 180000 }); await p.waitForTimeout(3500);
for (const e of list.split(',')) { await p.evaluate((e) => window.__kfb.skyOwner().setAuroraElevation(e === 'source' ? null : Number(e)), e); await p.waitForTimeout(1500); await p.screenshot({ path: `${out}/aurora_elev_${e}.jpg`, type: 'jpeg', quality: 85 }); }
await b.close();
