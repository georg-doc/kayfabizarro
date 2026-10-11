import { openLab } from './browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&solo=rkit_hub');
await page.evaluate(() => new Promise((r) => setTimeout(r, 2000)));
const r = await page.evaluate(() => window.__kfb.measureRoadBed('rkit_hub'));
console.log(JSON.stringify(r, (k, v) => (typeof v === 'number' ? +v.toFixed(3) : v)).slice(0, 2500));
await close();
