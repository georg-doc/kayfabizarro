import { openLab } from './browser.mjs';
const [q, ids] = [process.argv[2], process.argv[3].split(',')];
const { page, errors, close } = await openLab(q);
const out = await page.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, window.__kfb.qcheck(id)])), ids);
console.log(JSON.stringify({ out, errors: errors.filter((e) => !e.includes('404')) }, null, 1));
await close();
