import { openLab } from './browser.mjs';
const [id, px, py, pz] = process.argv.slice(2).map((v, i) => (i ? Number(v) : v));
const { page, close } = await openLab('world=mvp1&shot=1&bg=b0c6d8');
const r = await page.evaluate(({ id, px, py, pz }) => {
  const isl = window.__kfb.app.islands.get(id), out = {};
  for (const nm of ['ground', 'band', 'under']) {
    const m = isl.group.getObjectByName(nm); if (!m) continue;
    const g = m.geometry, P = g.attributes.position, N = g.attributes.normal, near = [];
    for (let i = 0; i < P.count; i++) { const d = Math.hypot(P.getX(i) - px, P.getY(i) - py, P.getZ(i) - pz); if (d < 1.6) near.push([d, i]); }
    near.sort((a, b) => a[0] - b[0]);
    out[nm] = { attrs: Object.keys(g.attributes), mat: m.material.type, verts: near.slice(0, 6).map(([d, i]) => ({ i, row: nm === 'ground' ? Math.floor(i / isl.r2d.terrain.NA) : undefined, p: [P.getX(i), P.getY(i), P.getZ(i)].map((v) => +v.toFixed(2)), n: [N.getX(i), N.getY(i), N.getZ(i)].map((v) => +v.toFixed(2)), ao: g.attributes.aAO ? +g.attributes.aAO.getX(i).toFixed(2) : null, col: g.attributes.color ? [g.attributes.color.getX(i), g.attributes.color.getY(i), g.attributes.color.getZ(i)].map((v) => +v.toFixed(2)) : null, sh: g.attributes.aShK ? +g.attributes.aShK.getX(i).toFixed(2) : null })) };
  }
  out.T = { rollRow: isl.r2d.terrain.rollRow, diveRow: isl.r2d.terrain.diveRow, NA: isl.r2d.terrain.NA };
  return out;
}, { id, px, py, pz });
console.log(JSON.stringify(r, null, 0).replace(/\{"i"/g, '\n {"i"'));
await close();
