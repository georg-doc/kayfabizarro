import { openLab } from './browser.mjs';
const q = process.argv[2] ?? 'world=mvp1&shot=1';
const { page, errors, close } = await openLab(q);
const out = await page.evaluate(() => {
  const k = window.__kfb, ids = [...k.app.islands.keys()];
  return { world: k.world(), terrain: k.terrainMode(), ids, r2d: Object.fromEntries(ids.map((id) => [id, k.r2d(id)])), errors: k.errors, warnings: k.warnings.slice(0, 10), stats: k.stats() };
});
console.log(JSON.stringify({ ...out, consoleErrors: errors.slice(0, 10) }, null, 1));
if (process.argv[3]) await page.screenshot({ path: process.argv[3], type: 'jpeg', quality: 88 });
await close();
