// internal review shots (scratchpad): node tools/stage1/look.mjs <query> <island> <outDir> [names]
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from './browser.mjs';
import { camsInPage } from './cams.mjs';
const [q, id, outDir, names] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const { page, errors, close } = await openLab(q);
const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`);
for (const [n, c] of Object.entries(cams)) {
  if (names && !names.split(',').includes(n)) continue;
  await page.evaluate((c) => window.__kfb.setCamera(c), c);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 300)))));
  await page.screenshot({ path: path.join(outDir, `${id}_${n}.jpg`), type: 'jpeg', quality: 90 });
}
console.log(Object.keys(cams).join(' '), errors.filter((e) => !e.includes('404')));
await close();
