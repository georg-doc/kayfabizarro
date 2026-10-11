import { openLab } from './browser.mjs';
const { page, close } = await openLab('shot=1');
console.log(JSON.stringify(await page.evaluate(() => ({ doors: window.__kfb.k2Doors(), sizes: window.__kfb.sizes(), added: window.__kfb.app.world.added,
  builds: window.__kfb.app.world.islands.flatMap((i) => i.buildings.map((b) => [i.id, b.asset, b.scale, b.pad, b.k2From])) })), null, 0));
await close();
