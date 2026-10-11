// POV fade diagnosis: figure materials before / after a zoom-in → zoom-out round trip (+ stills)
import { chromium } from 'playwright-core';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&almanac=0&dynres=0'); await p.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 }); await p.waitForTimeout(2500);
const mats = () => p.evaluate(() => { const o = []; window.__kfb.travel().walk.root.traverse((m) => { if (m.isMesh) for (const x of [].concat(m.material)) o.push({ mesh: m.name, mat: x.name, type: x.type, op: x.opacity, hash: !!x.alphaHash, tr: x.transparent, vis: m.visible, col: x.color?.getHexString?.(), map: !!x.map }); }); return o; });
const before = await mats(); await p.mouse.move(800, 500); await p.screenshot({ path: out + '/pov_a_before.jpg', type: 'jpeg', quality: 85 });
for (let k = 0; k < 40; k++) { await p.mouse.wheel(0, -120); await p.waitForTimeout(15); } await p.waitForTimeout(1500);
for (let k = 0; k < 14; k++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(15); } await p.waitForTimeout(1800);
const after = await mats(); await p.screenshot({ path: out + '/pov_b_after.jpg', type: 'jpeg', quality: 85 });
console.log(JSON.stringify({ before: before.filter((x) => /eye|lid|hat|head|iris|scler/i.test(x.mesh + x.mat)), afterDiff: after.filter((x, i) => JSON.stringify(x) !== JSON.stringify(before[i])).slice(0, 12), n: after.length }));
await b.close();
