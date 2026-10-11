// V-097 proof after the C1a fix (Lichtkreis light invisible until a sky owner enables it): game at night, circle on (60 %) / off.
// node tools/a10/circle-still.mjs <outDir>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0&almanac=0&time=night'); await p.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.skyOwner?.(), null, { timeout: 180000 }); await p.waitForTimeout(4000);
const on = await p.evaluate(() => window.__kfb.lightCircle()); const vis = await p.evaluate(() => { let v = null; window.__kfb.travel().walk.root.parent.traverse((o) => { if (o.name === 'kfb:lichtkreis') v = o.visible; }); return v; });
await p.screenshot({ path: `${out}/lichtkreis_night_on.jpg`, type: 'jpeg', quality: 88 });
await p.evaluate(() => window.__kfb.lightCircle(0)); await p.waitForTimeout(600); await p.screenshot({ path: `${out}/lichtkreis_night_off.jpg`, type: 'jpeg', quality: 88 });
const r = { on, visible: vis }; fs.writeFileSync(`${out}/lichtkreis.json`, JSON.stringify(r)); console.log(JSON.stringify(r));
await b.close();
