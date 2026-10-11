import { openLab } from './browser.mjs';
const [id, a0, a1] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4])];
const { page, close } = await openLab('world=mvp1&shot=1');
console.log(JSON.stringify(await page.evaluate(({ id, a0, a1 }) => {
  const isl = window.__kfb.app.islands.get(id), T = isl.r2d.terrain, P = T.geo.attributes.position, NA = T.NA, c0 = isl.field.plan.c0, out = [];
  for (let a = a0; a <= a1; a++) { const g = (row) => { const i = row * NA + a; return [+Math.hypot(P.getX(i) - c0[0], P.getZ(i) - c0[1]).toFixed(2), +P.getY(i).toFixed(2)]; }; out.push([a, +T.geo.userData.neck[a].toFixed(2), 'E', ...g(T.NR + 6), 'F', ...g(T.footRow), 'K', ...g(T.diveRow)]); }
  return out;
}, { id, a0, a1 })).replace(/\],\[/g, ']\n['));
await close();
