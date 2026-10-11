import { openLab } from '../stage1/browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&bg=b0c6d8&play=travel&island=rkit_hub&road=0&car=cabrio');
await page.waitForFunction(() => window.__kfb?.travel?.(), null, { timeout: 180000 });
const r = await page.evaluate(() => { const car = window.__kfb.travel().drive.car, q = car.quaternion.clone(), p = car.position.clone(); car.quaternion.set(0, 0, 0, 1); car.position.set(0, 0, 0); car.updateMatrixWorld(true);
  const out = {}; car.traverse((o) => { if (!o.isMesh || !o.visible) return; let vis = true, x = o; while (x) { if (!x.visible) vis = false; x = x.parent; } if (!vis) return; const b = new o.geometry.boundingBox.constructor().setFromObject(o); out[o.name] = [b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z].map((v) => +v.toFixed(2)); });
  car.quaternion.copy(q); car.position.copy(p); car.updateMatrixWorld(true); return out; });
for (const [k, v] of Object.entries(r)) console.log(k.padEnd(18), JSON.stringify(v));
await close();
