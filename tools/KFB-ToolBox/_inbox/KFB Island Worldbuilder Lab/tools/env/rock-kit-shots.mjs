// Fels-Bausatz R1 · cut-out views from the bench (rockkit.html): front, right, back, left (+ colour variants front).
// node tools/env/rock-kit-shots.mjs <outDir> [seed] [variants=default,sandy,dark]
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from '../stage1/browser.mjs';
const [outDir, seed = '7', variants = 'default,sandy,dark'] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const report = {};
for (const v of variants.split(',')) {
  const { page, errors, close } = await openLab(`seed=${seed}&variant=${v}${process.env.KIT ? '&kit=' + process.env.KIT : ''}`, { w: 1200, h: 1200, path: 'rockkit.html' });
  const info = await page.evaluate(() => window.__rock);
  if (info?.error) { console.error(info.error); await close(); process.exit(2); }
  for (const view of v === 'default' ? ['front', 'right', 'back', 'left'] : ['front']) {
    await page.evaluate((view) => window.__rock.setView(view), view); await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));
    await page.screenshot({ path: path.join(outDir, `rock_largeA_${v}_${view}.jpg`), type: 'jpeg', quality: 90 });
  }
  report[v] = { ...info.kit, errors: errors.filter((e) => !e.includes('404')).slice(0, 5) };
  console.log(v, JSON.stringify({ tris: info.kit.tris, size: info.kit.size }), 'errors', report[v].errors);
  await close();
}
fs.writeFileSync(path.join(outDir, 'rock-kit.json'), JSON.stringify(report, null, 1));
