import { openLab } from './browser.mjs';
const { page, close } = await openLab('world=mvp1&shot=1&phong=0');
console.log(JSON.stringify(await page.evaluate(() => {
  const fr = window.__kfb.app.islands.get('protopia').fragments, k = 0, sub = fr.subs[k], c0 = fr.fields[k].plan.c0, T = fr.grounds[k].terrain;
  let body = null; sub.traverse((o) => { if (o.name === 'fragment-under') body = o; });
  const g = body.geometry, P = g.attributes.position, st = g.userData.seamStart, pin = g.userData.pinned, sIn = new Set(g.userData.seamStandIn);
  const out = [];
  for (let i = 0; i < P.count; i++) { const x = P.getX(i) - c0[0], z = P.getZ(i) - c0[1], th = Math.atan2(z, x); if (Math.abs(th) < 0.02 && P.getY(i) > -5) out.push([i, +Math.hypot(x, z).toFixed(3), +P.getY(i).toFixed(3), pin[i] ? 'P' : '', sIn.has(i) ? 'S' : '', i >= st && i < st + T.NA ? 'R0' : '']); }
  const tp = T.geo.attributes.position, gr = []; for (const row of [T.NR, T.NR + 6, T.footRow, T.diveRow]) gr.push([row, +Math.hypot(tp.getX(row * T.NA) - c0[0], tp.getZ(row * T.NA) - c0[1]).toFixed(3), +tp.getY(row * T.NA).toFixed(3)]);
  return { st, NA: T.NA, nw: T.geo.userData.neckW?.[0], ground: gr, body: out.sort((a, b) => b[2] - a[2]) };
})));
await close();
