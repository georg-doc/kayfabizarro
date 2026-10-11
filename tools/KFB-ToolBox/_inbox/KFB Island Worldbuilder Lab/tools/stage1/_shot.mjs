import { openLab } from './browser.mjs';
const [out, cam] = [process.argv[2], JSON.parse(process.argv[3])];
const { page, close } = await openLab('world=mvp1&shot=1&bg=b0c6d8');
await page.evaluate((c) => window.__kfb.setCamera(c), cam);
await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 400)))));
await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
await close();
