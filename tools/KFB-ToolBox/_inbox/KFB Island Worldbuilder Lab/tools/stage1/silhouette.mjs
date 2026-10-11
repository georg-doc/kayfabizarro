// Silhouette set S1–S3 (black on white, no landmark): node tools/stage1/silhouette.mjs <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from './browser.mjs';
import { camsInPage, camS3InPage } from './cams.mjs';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const { page, errors, close } = await openLab('world=mvp1&shot=1');
await page.evaluate(() => window.__kfb.silhouette(true));
const snap = async (c, file) => { await page.evaluate((c) => window.__kfb.setCamera(c), c); await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 300))))); await page.screenshot({ path: path.join(out, file), type: 'jpeg', quality: 92 }); };
for (const id of ['kfb_town', 'protopia']) {
  await page.evaluate((id) => { for (const [k, isl] of window.__kfb.app.islands) isl.group.visible = k === id; }, id);
  const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`);
  for (const n of ['S1_flug', 'S2_racetrack']) await snap(cams[n], `${id}_${n}.jpg`);
}
await page.evaluate(() => { for (const isl of window.__kfb.app.islands.values()) isl.group.visible = true; });
await snap(await page.evaluate(`(${camS3InPage.toString()})()`), 'S3_beide.jpg');
console.log('errors', errors.filter((e) => !e.includes('404')).slice(0, 3));
await close();
