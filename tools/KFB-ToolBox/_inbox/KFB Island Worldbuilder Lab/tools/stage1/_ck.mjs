import { openLab } from './browser.mjs';
const { page, close } = await openLab('world=mvp1&shot=1');
console.log(await page.evaluate(() => { const m = window.__kfb.app.islands.get('protopia').group.getObjectByName('ground').material; return [m.customProgramCacheKey(), m.type, JSON.stringify(m.userData.clay.Ly.value), m.userData.clay.K.value]; }));
await close();
