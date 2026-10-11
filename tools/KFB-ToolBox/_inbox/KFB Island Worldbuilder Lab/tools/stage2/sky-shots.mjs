// Himmel, Licht, Insel-Farben (8+9) · acceptance stills on the PondLand stage: one fixed camera, day / evening / night ×
// palettes (live switch on one page). node tools/stage2/sky-shots.mjs <outDir> [palettes=otown,canyon] [extra url params]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, palArg, extra] = process.argv.slice(2), PALS = (palArg ?? 'otown,canyon').split(',');
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const logs = [], external = new Set();
p.on('pageerror', (e) => logs.push('pageerror ' + e.message));
p.on('request', (r) => { const u = new URL(r.url()); if (!/^(127\.0\.0\.1|localhost)$/.test(u.hostname) && /^https?:$/.test(u.protocol)) external.add(u.hostname + u.pathname.slice(0, 50)); });
await p.goto('http://127.0.0.1:5192/?play=game&sound=0&dynres=0' + (extra ? '&' + extra : ''));
await p.waitForFunction(() => window.__kfb?.sky?.() && window.__kfb.play?.(), null, { timeout: 180000 });
await p.waitForTimeout(3000);
// fixed camera: behind and above the spawn, looking over the pond to the gate (sky in the upper third)
await p.evaluate(() => { const s = window.__kfb.play().walker.state.position, H = 3.64; window.__kfb.camOverride([s.x + 2.2 * H, s.y + 2.6 * H, s.z - 4.2 * H], [s.x - 1.5 * H, s.y + 1.2 * H, s.z + 6 * H]); });
const report = { shots: {}, logs };
const themes = await p.evaluate(() => fetch('/themes/island-themes.json').then((r) => r.json()));
for (const pal of PALS) for (const t of ['day', 'evening', 'night']) {
  await p.evaluate(({ pal, t }) => { const S = window.__kfb.skyOwner(); S.setPalette(pal); S.setTime(t); }, { pal: themes.palettes[pal], t });
  await p.waitForTimeout(1800);
  const name = `${pal}_${t}`;
  await p.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 90 });
  report.shots[name] = await p.evaluate(() => window.__kfb.sky());
  console.log(name, JSON.stringify({ night: report.shots[name].night, fog: report.shots[name].fog, sun: report.shots[name].sun.intensity }));
}
report.external = [...external]; report.errors = await p.evaluate(() => window.__kfb.errors);
fs.writeFileSync(`${out}/sky-shots.json`, JSON.stringify(report, null, 1));
console.log('external', report.external, 'errors', report.errors, 'logs', logs);
await b.close();
