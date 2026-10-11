// boot feedback check: screenshots while the organ world builds (after the 1st, 4th and 8th build note). node tools/track/boot-stills.mjs <outDir>
import { chromium } from 'playwright-core';
const out = process.argv[2], t0 = Date.now(), notes = [];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
p.on('console', (m) => { if (/\[organ\]/.test(m.text())) notes.push([Date.now() - t0, m.text().slice(0, 80)]); });
p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0');
for (const n of [1, 4, 8]) { while (notes.length < n && Date.now() - t0 < 120000) await p.waitForTimeout(100); await p.screenshot({ path: `${out}/boot_note${n}.jpg`, type: 'jpeg', quality: 70 }); }
console.log(JSON.stringify(notes.slice(0, 12))); await b.close();
