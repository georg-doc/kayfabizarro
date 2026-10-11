import { openLab } from './browser.mjs';
const [id, a] = [process.argv[2], Number(process.argv[3])];
const { page, close } = await openLab('world=mvp1&shot=1');
console.log(JSON.stringify(await page.evaluate(({ id, a }) => {
  const isl = window.__kfb.app.islands.get(id), T = isl.r2d.terrain, P = T.geo.attributes.position, NA = T.NA, out = { neck: T.geo.userData.neck[a], rows: [] };
  for (let row = T.NR + 4; row <= T.diveRow; row++) for (const aa of [a - 1, a, a + 1]) if (aa === a) out.rows.push([row, ...[P.getX(row * NA + aa), P.getY(row * NA + aa), P.getZ(row * NA + aa)].map((v) => +v.toFixed(2))]);
  out.nb = [a - 1, a + 1].map((aa) => T.geo.userData.neck[aa]);
  return out;
}, { id, a })));
await close();
