import { openLab } from './browser.mjs';
const { page, errors, close } = await openLab('world=mvp1&shot=1');
console.log(JSON.stringify(await page.evaluate(async () => {
  const src = await (await fetch('/src/island/r2d/scholle.ts')).text();
  const fr = window.__kfb.app.islands.get('protopia').fragments, sub = fr.subs[0];
  let body = null; sub.traverse((o) => { if (o.name === 'fragment-under') body = o; });
  const g = body.geometry, P = g.attributes.position, st = g.userData.seamStart;
  return { hasResnap: src.includes('stand-in ring\'s chords as they are NOW'), resnapBeforePhong: src.indexOf("stand-in ring's chords as they are NOW") < src.indexOf('geo = phongSplit(geo'), st, ring0: [0, 1, 2].map((a) => [P.getX(st + a), P.getY(st + a), P.getZ(st + a)].map((v) => +v.toFixed(3))), keys: Object.keys(g.userData) };
})));
console.log('errors', errors.slice(0, 5));
await close();
