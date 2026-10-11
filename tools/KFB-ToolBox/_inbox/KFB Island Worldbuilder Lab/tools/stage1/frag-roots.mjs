// RKIT chain: rim profiles at the two roots of each pier fragment (mvp1 world, Protopia's fragments), root ids
// <island>.frag<k>.root.<west|east>, axis out of the fragment towards the neighbouring field.
// node tools/stage1/frag-roots.mjs [out.json]
import fs from 'node:fs';
import { openLab } from './browser.mjs';
const out = process.argv[2] ?? 'public/roadbeds/protopia.fragments.rim-profiles.r2d.json';
const { page, close } = await openLab('world=mvp1&shot=1');
const r = await page.evaluate(() => window.__kfb.exportFragmentRoots('protopia'));
if (!r.error) fs.writeFileSync(out, JSON.stringify(r));
console.log(r.error ?? r.roots.map((x) => `${x.id} anchor ${x.anchor} centre ${JSON.stringify(x.centre)} axis ${JSON.stringify(x.axis)} rootDepth ${x.rootDepth} top ${x.longitudinal.top.length} [${JSON.stringify(x.longitudinal.top.slice(-3))}] face0 ${JSON.stringify(x.longitudinal.face.slice(0, 3))} faceN ${x.longitudinal.face.length}`).join('\n'));
await close();
