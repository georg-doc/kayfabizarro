import fs from 'node:fs';
import { openLab } from './browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&solo=rkit_hub');
const b64 = await page.evaluate(() => window.__kfb.exportIslandGLB('rkit_hub'));
fs.writeFileSync('public/roadbeds/rkit_hub.island.r2d.glb', Buffer.from(b64, 'base64'));
console.log('glb bytes', Buffer.from(b64, 'base64').length);
await close();
