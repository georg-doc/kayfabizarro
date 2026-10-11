// node _variant.mjs <camsjson> <camName> <out.jpg> <js applied to (g, THREE)>
import fs from 'node:fs';
import { openLab } from './browser.mjs';
const [file, name, out, js] = process.argv.slice(2);
const s = JSON.parse(fs.readFileSync(file, 'utf8')), c = s.cams[name];
const { page, close } = await openLab(`shot=1&hub=1&solo=${s.islandId}&bg=b0c6d8`);
await page.evaluate(() => new Promise((r) => setTimeout(r, 2000)));
await page.evaluate(async ({ id, c, js }) => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const isl = window.__kfb.app.islands.get(id), P = isl.spec.pos, g = isl.group;
  await new Function('g', 'THREE', js)(g, THREE);
  const hf = 2 * Math.atan(36 / (2 * c.lens)), fov = (2 * Math.atan(Math.tan(hf / 2) / 1.6) * 180) / Math.PI;
  window.__kfb.setCamera({ pos: c.pos.map((v, i) => v + P[i]), look: c.target.map((v, i) => v + P[i]), fov });
}, { id: s.islandId, c, js });
await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 400)))));
await page.screenshot({ path: out, type: 'jpeg', quality: 85 });
await close();
