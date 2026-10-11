// relief components on/off for one island cam: node _relief.mjs <island> <cam> <outDir>
import { openLab } from './browser.mjs';
import { camsInPage } from './cams.mjs';
const [id, cam, outDir] = process.argv.slice(2);
const { page, close } = await openLab('world=mvp1&shot=1&bg=b0c6d8');
const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`);
const V = { base: {}, noprint: { mk: [3, 0] }, nograin: { ly: [1, 0] }, nostroke: { ly: [0, 0] }, norelief: { k: 0 } };
for (const [name, v] of Object.entries(V)) {
  await page.evaluate(({ id, v, c }) => {
    const isl = window.__kfb.app.islands.get(id);
    for (const nm of ['ground', 'under']) {
      const cl = isl.group.getObjectByName(nm).material.userData.clay;
      cl.__o ??= { K: cl.K.value, Ly: cl.Ly.value.toArray(), Mk: cl.Mk.value.toArray() };
      cl.K.value = cl.__o.K; cl.Ly.value.fromArray(cl.__o.Ly); cl.Mk.value.fromArray(cl.__o.Mk);
      if (v.k !== undefined) cl.K.value = v.k;
      if (v.ly) cl.Ly.value.setComponent(v.ly[0], v.ly[1]);
      if (v.mk) cl.Mk.value.setComponent(v.mk[0], v.mk[1]);
    }
    window.__kfb.setCamera(c);
  }, { id, v, c: cams[cam] });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 400)))));
  await page.screenshot({ path: `${outDir}/${id}_${cam}_${name}.jpg`, type: 'jpeg', quality: 88 });
}
await close();
