// node tools/stage1/shots.mjs <page> <query> <outDir> <name:preset;name:preset…>   (page: '' = index, 'lineup.html')
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from './browser.mjs';
const [pg, q, outDir, list] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const { page, errors, close } = await openLab(q, { path: pg });
for (const item of list.split(';')) {
  const [name, ...rest] = item.split(':'), preset = rest.join(':');
  await page.evaluate((p) => { let v = p; try { v = JSON.parse(p); } catch {} window.__kfb.setCamera(v); }, preset);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 400)))));
  await page.screenshot({ path: path.join(outDir, name + '.jpg'), type: 'jpeg', quality: 90 });
  console.log('shot', name);
}
if (errors.filter((e) => !e.includes('404')).length) console.log('ERRORS', errors);
await close();
