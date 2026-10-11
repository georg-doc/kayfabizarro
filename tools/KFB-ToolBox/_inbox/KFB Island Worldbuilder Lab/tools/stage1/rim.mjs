import fs from 'node:fs';
import { openLab } from './browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&solo=rkit_hub');
const r = await page.evaluate(() => window.__kfb.exportRimProfiles('rkit_hub'));
fs.writeFileSync('public/roadbeds/rkit_hub.rim-profiles.r2d.json', JSON.stringify(r));
console.log(r.error ?? ('roots ' + r.roots.length + ' grassUnderside ' + r.grassUnderside.length + ' hash ' + r.outlineHash + ' face0 ' + JSON.stringify(r.roots[0].longitudinal.face.slice(0, 4)) + ' under ' + JSON.stringify(r.roots[0].longitudinal.underside.slice(0, 3))));
await close();
