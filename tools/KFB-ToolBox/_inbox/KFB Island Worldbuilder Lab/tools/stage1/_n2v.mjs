// N2 variants: node _n2v.mjs <island> <outDir> name=js …   (js gets isl, THREE)
import { openLab } from './browser.mjs';
import { camsInPage } from './cams.mjs';
const [id, outDir, ...vs] = process.argv.slice(2);
const { page, close } = await openLab('world=mvp1&shot=1&bg=b0c6d8');
const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`);
for (const v of ['base=void 0', ...vs]) {
  const [name, ...js] = v.split('=');
  await page.evaluate(async ({ id, js, c }) => { const THREE = await import('/node_modules/.vite/deps/three.js'); const isl = window.__kfb.app.islands.get(id); await new Function('isl', 'THREE', js)(isl, THREE); window.__kfb.setCamera(c); }, { id, js: js.join("="), c: cams[process.env.CAM ?? "N2_kante_unten"] });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 400)))));
  await page.screenshot({ path: `${outDir}/${id}_${process.env.CAM ?? "N2"}_${name}.jpg`, type: 'jpeg', quality: 88 });
}
await close();
