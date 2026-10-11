import { openLab } from './browser.mjs';
const [id, a] = process.argv.slice(2);
const { page, close } = await openLab('world=mvp1&shot=1&bg=b0c6d8');
const r = await page.evaluate(({ id, a }) => {
  const isl = window.__kfb.app.islands.get(id), T = isl.r2d.terrain, g = isl.group.getObjectByName('ground').geometry, P = g.attributes.position, N = g.attributes.normal, NA = T.NA, out = [];
  for (let row = T.rollRow - 20; row <= T.diveRow; row++) { const i = row * NA + Number(a); out.push([row, [P.getX(i), P.getY(i), P.getZ(i)].map((v) => +v.toFixed(3)), [N.getX(i), N.getY(i), N.getZ(i)].map((v) => +v.toFixed(2)), +g.attributes.aShK.getX(i).toFixed(2), +g.attributes.aAO.getX(i).toFixed(2)]); }
  return { rollRow: T.rollRow, diveRow: T.diveRow, keys: Object.keys(T), out };
}, { id, a });
console.log(JSON.stringify(r.keys), r.rollRow, r.diveRow); for (const l of r.out) console.log(JSON.stringify(l));
await close();
