import { openLab } from '../stage1/browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&bg=b0c6d8&play=drive&island=rkit_hub&road=1');
await page.waitForFunction(() => window.__kfb?.drive?.(), null, { timeout: 120000 });
const r = await page.evaluate(() => { const out = {}; const sc = window.__kfb.drive().car.parent;
  sc.traverse((o) => { if (!o.isMesh) return; let p = o, path = []; while (p && p !== sc && path.length < 4) { path.unshift(p.name || p.type); p = p.parent; }
    const k = path.join('/') + ' | ' + JSON.stringify(Object.keys(o.userData)).slice(0, 80) + ' | ' + (o.userData.role ?? o.parent?.userData?.role ?? ''); out[k] = (out[k] || 0) + (o.geometry.index ? o.geometry.index.count / 3 : o.geometry.attributes.position.count / 3); });
  return out; });
for (const [k, v] of Object.entries(r).sort()) console.log(Math.round(v), k);
await close();
