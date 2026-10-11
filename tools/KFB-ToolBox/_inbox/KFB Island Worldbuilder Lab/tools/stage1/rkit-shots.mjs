// RKIT hook 2: shoot RKIT's camera presets (kfb.rkit-cams/1, island-local, lens in mm on a 36 mm wide sensor) in the lab,
// 1600×1000, world light, background b0c6d8. Positions are island-local; the island's own spec.pos is added in the page.
// node tools/stage1/rkit-shots.mjs <outDir> [cams.json …]   (default: rkit_hub.cams.json + rkit_hub.abutment.cams.json)
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from './browser.mjs';
const [outDir, ...files] = process.argv.slice(2);
const list = files.length ? files : ['public/roadbeds/rkit_hub.cams.json', 'public/roadbeds/rkit_hub.abutment.cams.json'];
fs.mkdirSync(outDir, { recursive: true });
const W = 1600, H = 1000, sets = list.map((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
const ids = [...new Set(sets.map((s) => s.islandId))];
const { page, errors, close } = await openLab(`shot=1&hub=1&solo=${ids.join(',')}&bg=b0c6d8`, { w: W, h: H });
await page.evaluate(() => new Promise((r) => setTimeout(r, 2500)));
const log = [];
for (const s of sets) {
  if (s.schema !== 'kfb.rkit-cams/1') { console.log('skip', s.schema); continue; }
  const pos = await page.evaluate((id) => window.__kfb.app.islands.get(id)?.spec.pos ?? null, s.islandId);
  if (!pos) { console.log('no island', s.islandId); continue; }
  for (const [name, c] of Object.entries(s.cams)) {
    // lens mm → horizontal fov on 36 mm → three's vertical fov at the shot aspect
    const hf = 2 * Math.atan(36 / (2 * c.lens)), fov = (2 * Math.atan(Math.tan(hf / 2) / (W / H)) * 180) / Math.PI;
    const add = (p) => (s.frame === 'island-local' ? p.map((v, i) => v + pos[i]) : p);
    await page.evaluate((cam) => window.__kfb.setCamera(cam), { pos: add(c.pos), look: add(c.target), fov });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 400)))));
    const file = `${s.islandId}_${name}.jpg`;
    await page.screenshot({ path: path.join(outDir, file), type: 'jpeg', quality: 90 });
    log.push({ file, lens: c.lens, fovV: +fov.toFixed(2) });
  }
}
fs.writeFileSync(path.join(outDir, 'rkit-shots.json'), JSON.stringify({ size: [W, H], bg: '#b0c6d8', shots: log }, null, 1));
console.log(log.map((l) => l.file + ' ' + l.fovV).join('\n'));
if (errors.filter((e) => !e.includes('404')).length) console.log('ERRORS', errors.slice(0, 5));
await close();
