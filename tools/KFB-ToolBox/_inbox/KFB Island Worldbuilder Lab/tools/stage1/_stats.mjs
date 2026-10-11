import { openLab } from './browser.mjs';
const { page, close } = await openLab(process.argv[2]);
await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));
console.log(JSON.stringify(await page.evaluate(() => ({ s: window.__kfb.stats(), t: ['kfb_town', 'protopia'].map((id) => window.__kfb.app.islands.get(id).r2d.scholle.tris) }))));
await close();
