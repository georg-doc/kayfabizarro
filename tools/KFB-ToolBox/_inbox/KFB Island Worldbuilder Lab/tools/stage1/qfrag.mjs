import { openLab } from './browser.mjs';
const { page, close } = await openLab('world=mvp1&shot=1');
console.log(JSON.stringify(await page.evaluate(() => ['kfb_town', 'protopia'].flatMap((id) => window.__kfb.qcheckFragments(id))), null, 0));
await close();
