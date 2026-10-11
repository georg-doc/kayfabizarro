// honest closedness check of every island body AS DRAWN: all meshes of one organ tier (body part + TC1 parts, split by material for drawing)
// welded by exact position (1e-5 local) → open edges, edges with > 2 triangles; water sheets / ureters listed separately (open by design)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, q = ''] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 400 } });
await p.goto('http://127.0.0.1:5192/?hub=1&play=game&sound=0&almanac=0&dynres=0&hud=0&' + q); await p.waitForFunction(() => window.__kfb?.organ?.(), null, { timeout: 600000 });
const R = await p.evaluate(() => { const O = window.__kfb.organ(), out = [];
  for (const B of O.W.built) for (const [tk, T] of Object.entries(B.tiers)) { const solid = [], open = []; T.g.children.forEach((m) => { if (!m.isMesh) return; (m.geometry.attributes.color && m.material?.color?.getHexString?.() !== '5983ac' && m.name !== 'harnleiter' || /^tc1-/.test(m.name) ? solid : open).push(m); });
    const key = new Map(), E = new Map(); let V = 0;
    const vid = (x, y, z) => { const k = Math.round(x * 1e5) + ',' + Math.round(y * 1e5) + ',' + Math.round(z * 1e5); let i = key.get(k); if (i === undefined) { i = V++; key.set(k, i); PX.push([x, y, z]); } return i; }, PX = [], EM = new Map();
    let tris = 0; for (const m of solid) { const g = m.geometry, pos = g.attributes.position, idx = g.index ? g.index.array : null, n = idx ? idx.length : pos.count;
      for (let t = 0; t < n; t += 3) { const v = [0, 1, 2].map((e) => { const i = idx ? idx[t + e] : t + e; return vid(pos.getX(i), pos.getY(i), pos.getZ(i)); }); if (v[0] === v[1] || v[1] === v[2] || v[0] === v[2]) continue; tris++;
        for (let e = 0; e < 3; e++) { const a = v[e], c = v[(e + 1) % 3], k = a < c ? a + ',' + c : c + ',' + a; E.set(k, (E.get(k) ?? 0) + 1); let s = EM.get(k); if (!s) EM.set(k, (s = new Set())); s.add(m.name || 'body'); } } }
    let op = 0, mu = 0; const muAt = []; for (const [k, c] of E) { if (c === 1) op++; else if (c > 2) { mu++; if (muAt.length < 12) { const [a, b] = k.split(',').map(Number); muAt.push({ n: c, at: PX[a].map((v, j) => +((v + PX[b][j]) / 2).toFixed(2)), len: +Math.hypot(...PX[a].map((v, j) => v - PX[b][j])).toFixed(3), meshes: [...EM.get(k)] }); } } }
    out.push({ id: B.id, tier: tk, meshes: solid.map((m) => m.name || 'body'), tris, openEdges: op, multiEdges: mu, multiAt: muAt, openSheets: open.map((m) => ({ name: m.name || (m.material?.color?.getHexString?.() === '5983ac' ? 'water' : 'sheet'), tris: (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3 })) }); }
  return out; });
fs.writeFileSync(out, JSON.stringify(R, null, 1)); for (const r of R) console.log(r.id, r.tier, 'tris', r.tris, 'open', r.openEdges, 'multi', r.multiEdges, 'sheets', JSON.stringify(r.openSheets)); await b.close();
