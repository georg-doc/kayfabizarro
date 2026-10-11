import { openLab } from './browser.mjs';
const pts = JSON.parse(process.argv[2]);
const { page, close } = await openLab('world=mvp1&shot=1');
console.log(JSON.stringify(await page.evaluate((pts) => pts.map(([id, x, z]) => {
  const isl = window.__kfb.app.islands.get(id), T = isl.r2d.terrain, P = T.geo.attributes.position, c0 = isl.field.plan.c0, NA = T.NA;
  const a = Math.floor(((Math.atan2(z - c0[1], x - c0[0]) / (2 * Math.PI)) % 1 + 1) % 1 * NA) % NA;
  const g = (row) => [P.getX(row * NA + a), P.getY(row * NA + a), P.getZ(row * NA + a)].map((v) => +v.toFixed(2));
  return { id, a, neck: +T.geo.userData.neck[a].toFixed(2), E: g(T.NR + 6), F: g(T.footRow), mid: g(T.footRow + 2), K: g(T.diveRow), form: isl.field.plan.form.cliffW(Math.atan2(z - c0[1], x - c0[0])), wallH: isl.field.plan.form.wallH(Math.atan2(z - c0[1], x - c0[0])) };
}), pts)));
await close();
