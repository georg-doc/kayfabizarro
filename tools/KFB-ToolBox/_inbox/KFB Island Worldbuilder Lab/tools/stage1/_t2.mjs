import { openLab } from './browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&solo=rkit_hub');
await page.evaluate(() => new Promise((r) => setTimeout(r, 2000)));
console.log(JSON.stringify(await page.evaluate(() => window.__kfb.qcheck('rkit_hub').road)));
await close();
