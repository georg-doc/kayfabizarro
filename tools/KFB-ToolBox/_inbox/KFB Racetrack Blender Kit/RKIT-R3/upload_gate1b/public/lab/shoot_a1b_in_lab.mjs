// RKIT R3 · gate 1b visual proof in the Island Worldbuilder Lab (no lab source change; nothing saved into the lab world):
//  1. add the runtime-only RKIT test island (hub_spec.json, app.addIsland(spec, false));
//  2. load the A1b GLB (roads as Track Core streams, junctions, exit / entry modules, end caps);
//  3. TERRAIN PREVIEW from out/a1b.terrain_request.json: the island ground under the road footprint is set just below the
//     road / kerb surface, with a 4-unit blend band (cut / fill preview of the Surface-Truth request), and vegetation
//     triangles fully inside the corridor are dropped (the real clearing belongs to the island / environment owner);
//  4. write 1600x900 views + a JSON log (socket positions vs lab connectors, deformation stats, page errors).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const LAB = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Island Worldbuilder Lab';
const require = createRequire(path.join(LAB, 'package.json'));
const { chromium } = require('playwright-core');
const OUT = new URL('../evidence/lab_a1b/', import.meta.url); fs.mkdirSync(OUT, { recursive: true });
const GLB = '/@fs' + encodeURI(path.join(LAB, 'public/assets/_rkit_r3_preview/rkit_r3_a1b_assembly.glb'));
const HUB = JSON.parse(fs.readFileSync(new URL('./hub_spec.json', import.meta.url)));
const REQ = JSON.parse(fs.readFileSync(new URL('../trackcore/out/a1b.terrain_request.json', import.meta.url)));
const VIEWS = JSON.parse(process.env.VIEWS ?? 'null') ?? {
  a1b_overview: [150, -2, 95, 0.55, 0.95, 430],
  a1b_hub_interchange: [205, -1, 140, 0.15, 0.75, 150],
  a1b_hub_exit_close: [175, -1, 118, -0.5, 0.35, 60],
  a1b_hub_rest_on_rim: [215, -2, 101, 2.9, 0.2, 70],
  a1b_hub_entry_merge: [265, -1, 112, 0.6, 0.35, 60],
  a1b_otown_crossing: [75, -4, 18, 0.9, 0.6, 80],
  a1b_otown_south_landing: [76, -5, -6, 2.6, 0.22, 50],
  a1b_otown_north_rim: [76, -4, 44, 0.5, 0.3, 55],
};
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://127.0.0.1:5192/?shot=1', { waitUntil: 'load' });
await page.waitForFunction(() => window.__kfb?.ready, null, { timeout: 120000 });
await page.waitForTimeout(2000);
const info = await page.evaluate(async ({ glb, hub, req }) => {
  const T = await import('/node_modules/three/build/three.module.js');
  const { GLTFLoader } = await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');
  const app = window.__kfb.app; await app.addIsland(hub, false);
  const scene = app.scene;
  const g = await new GLTFLoader().loadAsync(glb); g.scene.name = 'RKIT_R3_A1B_PREVIEW';
  g.scene.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); scene.add(g.scene);
  // ---- terrain preview: rasterise the road surface (sections + junction plates) into a 0.5 grid of target heights
  const CELL = 0.5, grid = new Map(), key = (i, k) => i * 100003 + k;
  const tri = (a, b, c) => { const minX = Math.floor(Math.min(a[0], b[0], c[0]) / CELL), maxX = Math.ceil(Math.max(a[0], b[0], c[0]) / CELL), minZ = Math.floor(Math.min(a[2], b[2], c[2]) / CELL), maxZ = Math.ceil(Math.max(a[2], b[2], c[2]) / CELL);
    const d = (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2]); if (Math.abs(d) < 1e-9) return;
    for (let i = minX; i <= maxX; i++) for (let k = minZ; k <= maxZ; k++) { const x = i * CELL, z = k * CELL;
      const l1 = ((b[2] - c[2]) * (x - c[0]) + (c[0] - b[0]) * (z - c[2])) / d, l2 = ((c[2] - a[2]) * (x - c[0]) + (a[0] - c[0]) * (z - c[2])) / d, l3 = 1 - l1 - l2;
      if (l1 < -1e-6 || l2 < -1e-6 || l3 < -1e-6) continue; const y = l1 * a[1] + l2 * b[1] + l3 * c[1], kk = key(i, k), o = grid.get(kk); if (o === undefined || y < o) grid.set(kk, y); } };
  const stats = {};
  for (const [name, I] of Object.entries(req.islands)) {
    const secs = I.sections.filter((s) => s.pts), byR = {};   // road sections (plates and gore rows below)
    for (const s of secs) (byR[s.rid] ??= []).push(s);
    for (const arr of Object.values(byR)) { arr.sort((a, b) => a.s - b.s); for (let i = 1; i < arr.length; i++) { const A = arr[i - 1].pts, B = arr[i].pts; if (arr[i].s - arr[i - 1].s > 2.5) continue;
      for (let k = 0; k + 1 < A.length; k++) { tri(A[k], A[k + 1], B[k + 1]); tri(A[k], B[k + 1], B[k]); } } }
    for (const s of I.sections.filter((s) => s.rows)) for (let i = 0; i + 1 < s.rows.length; i++) { const [a, b] = s.rows[i], [c, d] = s.rows[i + 1]; tri(a, b, d); tri(a, d, c); }   // module gore slabs
    for (const s of I.sections.filter((s) => s.plate)) { const c = s.plate.reduce((m, p) => [m[0] + p[0] / s.plate.length, 0, m[2] + p[2] / s.plate.length], [0, 0, 0]); c[1] = s.y;
      for (let i = 0; i + 1 < s.plate.length; i++) tri(c, s.plate[i], s.plate[i + 1]);
      for (const kb of s.kerbs) for (let i = 0; i + 1 < kb.pts.length; i++) { const top = (p, n) => [p[0] + n[0] * s.ext, s.y + s.section[3][1], p[2] + n[2] * s.ext]; tri(kb.pts[i], kb.pts[i + 1], top(kb.pts[i + 1], kb.N[i + 1])); tri(kb.pts[i], top(kb.pts[i + 1], kb.N[i + 1]), top(kb.pts[i], kb.N[i])); } }
    stats[name] = { cells: grid.size };
  }
  const BLEND = req.blend ?? 4, R = Math.ceil((BLEND + 1.2) / CELL);
  const near = (x, z) => { const i0 = Math.round(x / CELL), k0 = Math.round(z / CELL), hit = grid.get(key(i0, k0)); if (hit !== undefined) return { d: 0, y: hit };
    let best = null; for (let di = -R; di <= R; di++) for (let dk = -R; dk <= R; dk++) { const y = grid.get(key(i0 + di, k0 + dk)); if (y === undefined) continue; const d = Math.hypot(di, dk) * CELL; if (!best || d < best.d) best = { d, y }; } return best; };
  const ss = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  for (const [name] of Object.entries(req.islands)) {
    const isl = app.islands.get(name); if (!isl) continue; isl.group.updateMatrixWorld(true);
    let moved = 0, maxCut = 0, maxFill = 0, dropped = 0;
    for (const m of isl.groundMeshes) { if (!['ground', 'paths', 'band'].includes(m.name)) continue;   // the rim band (grass lip) too: it poked through decks running along a rim
      const pos = m.geometry.attributes.position, M = m.matrixWorld, Mi = M.clone().invert(), v = new T.Vector3();
      for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(M); const n = near(v.x, v.z); if (!n) continue;
        // the deck covers the ground: sink the ground well under the road surface across the footprint plus a 1.2 margin
        // (coarse island triangles must not poke through), then blend back to the natural ground over BLEND
        const MARGIN = 1.2, target = n.y - (m.name === 'paths' ? 0.45 : 0.35), w = 1 - ss((n.d - MARGIN) / BLEND), blended = v.y + (target - v.y) * Math.min(1, w), ny = m.name === 'band' ? Math.min(v.y, blended) : blended;   // the rim band hangs down the cliff: cut only
        if (Math.abs(ny - v.y) > 1e-4) { moved++; if (ny < v.y) maxCut = Math.max(maxCut, v.y - ny); else maxFill = Math.max(maxFill, ny - v.y); }
        v.y = ny; v.applyMatrix4(Mi); pos.setXYZ(i, v.x, v.y, v.z); }
      pos.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere(); }
    if (isl.nature) isl.nature.traverse((o) => { if (!o.isMesh) return; const g2 = o.geometry, pos = g2.attributes.position, M = o.matrixWorld, v = new T.Vector3(); if (!g2.index) return;
      const idx = g2.index.array, keep = [];
      const inC = (vi) => { v.fromBufferAttribute(pos, vi).applyMatrix4(M); const n = near(v.x, v.z); return n && n.d <= 2; };
      for (let t = 0; t < idx.length; t += 3) { if (inC(idx[t]) && inC(idx[t + 1]) && inC(idx[t + 2])) { dropped++; continue; } keep.push(idx[t], idx[t + 1], idx[t + 2]); }
      g2.setIndex(keep); });
    stats[name] = { ...stats[name], movedVertices: moved, maxCut: +maxCut.toFixed(3), maxFill: +maxFill.toFixed(3), vegetationTrianglesDropped: dropped };
  }
  // sockets vs lab connectors / island rims
  const s0 = g.scene.getObjectByName('SOCKET_H_start');
  return { meshes: (() => { let n = 0; g.scene.traverse((o) => { if (o.isMesh) n++; }); return n; })(), terrain: stats, hubAdded: app.islands.has('rkit_hub'), worldIslandsSaved: app.world.islands.map((i) => i.id) };
}, { glb: GLB, hub: HUB, req: REQ });
await page.waitForTimeout(800);
const shots = [];
for (const [name, cam] of Object.entries(VIEWS)) {
  await page.evaluate((c) => window.__kfb.setCamera(c), cam); await page.waitForTimeout(1100);
  const file = new URL(`${name}.png`, OUT); await page.screenshot({ path: file.pathname }); shots.push(file.pathname);
}
fs.writeFileSync(new URL('lab_proof_a1b.json', OUT), JSON.stringify({ glb: GLB, info, errors, shots, at: new Date().toISOString() }, null, 1));
console.log(JSON.stringify({ info, errors }));
await browser.close();
