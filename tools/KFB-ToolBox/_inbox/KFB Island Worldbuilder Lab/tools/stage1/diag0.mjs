// Lauf 03 Schritt 0 (Diagnose): donor R2D plan through the lab pipeline from the donor's own orbit cameras
// (mittel / seite / unten, fov 42), at donor size (k 1) and at mvp1 size (hills in world units), plus the mvp1 island
// with `form` from the same relative camera. node tools/stage1/diag0.mjs <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from './browser.mjs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const VIEWS = { mittel: [105, 32, 35, -4], seite: [125, 10, 35, -16], unten: [95, -14, 140, -10] };
const orbit = (c, [d, elv, azm, ty], s) => { const e = elv * Math.PI / 180, a = azm * Math.PI / 180;
  return { pos: [c[0] + Math.sin(a) * Math.cos(e) * d * s, c[1] + ty * s + Math.sin(e) * d * s, c[2] + Math.cos(a) * Math.cos(e) * d * s], look: [c[0], c[1] + ty * s, c[2]], fov: 42 }; };
const { page, errors, close } = await openLab('world=mvp1&shot=1&reset=1&bg=b0c6d8' + (process.env.Q ?? ''), { w: 1600, h: 910, maxMs: 600000 });
const shot = async (name, cam) => { await page.evaluate((c) => window.__kfb.setCamera(c), cam);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 500)))));
  await page.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 90 }); console.log('shot', name); };
const meanR = (id) => page.evaluate((id) => { const p = window.__kfb.app.islands.get(id).field.plan; let s = 0; for (const r of p.edgeR) s += r; return s / p.edgeR.length; }, id);
const D = JSON.parse(fs.readFileSync('public/donor-plans.r2d.json', 'utf8'));
const info = {};
for (const [biome, isl] of [['burg', 'kfb_town'], ['protopia', 'protopia']]) {
  const rD = D[biome].edgeR.reduce((a, b) => a + b, 0) / D[biome].edgeR.length, rM = await meanR(isl), k = +(rM / rD).toFixed(2);
  // mvp1 island with form, same relative framing (c0 world, distances × k)
  const cM = await page.evaluate((id) => { const i = window.__kfb.app.islands.get(id), c = i.field.plan.c0, P = i.spec.pos; return [c[0] + P[0], P[1], c[1] + P[2]]; }, isl);
  for (const [v, o] of Object.entries(VIEWS)) await shot(`${biome}_${v}_mvp1-form`, orbit(cM, o, k));
  for (const kk of [1, k]) {
    const r = await page.evaluate(([b, kk]) => window.__kfb.diagDonor(b, kk), [biome, kk]);
    info[`${biome}_k${kk}`] = { meanR: kk === 1 ? +rD.toFixed(1) : +(rD * kk).toFixed(1), scholle: { D: r.scholle.D, Dprofile: r.scholle.Dprofile, spikes: r.scholle.spikesDown, style: r.scholle.style }, NR: r.NR, NA: r.NA };
    for (const [v, o] of Object.entries(VIEWS)) await shot(`${biome}_${v}_lab-k${kk === 1 ? 1 : 'mvp1'}`, orbit(r.c0, o, kk));
  }
  await page.evaluate(() => { window.__kfb.app.scene?.getObjectByName?.('donor-diag')?.removeFromParent?.(); for (const i of window.__kfb.app.islands.values()) i.group.visible = true; });
}
fs.writeFileSync(path.join(OUT, 'diag0.json'), JSON.stringify(info, null, 1));
console.log(JSON.stringify(info));
if (errors.filter((e) => !e.includes('404')).length) console.log('ERRORS', errors.slice(0, 6));
await close();
