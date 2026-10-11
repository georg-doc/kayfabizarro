import { openLab } from './browser.mjs';
const { page, close } = await openLab('world=mvp1&shot=1');
console.log(JSON.stringify(await page.evaluate(() => {
  const isl = window.__kfb.app.islands.get('kfb_town'), b = isl.group.getObjectByName('under').geometry, P = b.attributes.position, pin = b.userData.pinned;
  const out = []; for (let i = 0; i < 8; i++) out.push([i, pin[i], +P.getX(i).toFixed(2), +P.getY(i).toFixed(3), +P.getZ(i).toFixed(2)]);
  const T = isl.r2d.terrain, tp = T.geo.attributes.position; out.push(['ground foot a0', +tp.getX(T.footRow * T.NA).toFixed(2), +tp.getY(T.footRow * T.NA).toFixed(3), +tp.getZ(T.footRow * T.NA).toFixed(2)]);
  out.push(['D', isl.r2d.scholle.D, 'n', P.count]);
  return out;
})));
await close();
