import { openLab } from './browser.mjs';
const { page, close } = await openLab('world=mvp1&shot=1');
console.log(JSON.stringify(await page.evaluate(() => {
  const fr = window.__kfb.app.islands.get('protopia').fragments, sub = fr.subs[0];
  let body = null; sub.traverse((o) => { if (o.name === 'fragment-under') body = o; });
  const g = body.geometry, P = g.attributes.position, ix = g.index, st = g.userData.seamStart, NA = fr.grounds[0].terrain.NA;
  const out = { st, NA, n: P.count, faces: [] };
  const v = (i) => [P.getX(i), P.getY(i), P.getZ(i)].map((x) => +x.toFixed(3));
  for (let t = 0; t < ix.count; t += 3) { const a = ix.getX(t), b = ix.getX(t + 1), c = ix.getX(t + 2); if ([a, b, c].includes(4167)) out.faces.push([a, b, c].map((i) => [i, ...v(i)])); }
  return out;
})));
await close();
