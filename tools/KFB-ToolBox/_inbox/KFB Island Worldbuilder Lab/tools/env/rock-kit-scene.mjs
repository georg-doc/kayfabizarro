// Fels-Bausatz R1 · the formation on the hub island with the figure beside it, from the game camera (travel mode).
// node tools/env/rock-kit-scene.mjs <outDir> [variant] [seed]
import fs from 'node:fs';
import path from 'node:path';
import { openLab } from '../stage1/browser.mjs';
const [outDir, variant = 'default', seed = '11', dist = '3.2', side = '0.9', tag = ''] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const { page, errors, close } = await openLab(`shot=1&hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=1&rock=${variant}&rockSeed=${seed}&rockDist=${dist}&rockSide=${side}`);
await page.waitForFunction(() => window.__kfb?.travel?.() && window.__kfb.rock?.(), null, { timeout: 180000 });
const wait = (ms) => page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), ms);
await wait(2500);
const info = await page.evaluate(() => ({ rock: window.__kfb.rock(), fig: window.__kfb.travel().state().fig, stats: window.__kfb.stats?.() }));
await page.screenshot({ path: path.join(outDir, `scene_hub_game_cam_${variant}${tag}.jpg`), type: 'jpeg', quality: 90 });
// the game camera turned a little toward the rock (player orbit, as a player would look at it)
await page.evaluate(() => window.__kfb.playCam().orbit(-120, 10)); await wait(900);
await page.screenshot({ path: path.join(outDir, `scene_hub_game_cam_${variant}${tag}_orbit.jpg`), type: 'jpeg', quality: 90 });
fs.writeFileSync(path.join(outDir, `scene${tag}.json`), JSON.stringify({ ...info, errors: errors.filter((e) => !e.includes('404')).slice(0, 5) }, null, 1));
console.log(JSON.stringify(info), errors.filter((e) => !e.includes('404')).slice(0, 5));
await close();
