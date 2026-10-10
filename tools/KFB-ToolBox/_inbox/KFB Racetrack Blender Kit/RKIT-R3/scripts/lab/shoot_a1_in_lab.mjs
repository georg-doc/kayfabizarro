// RKIT R3 · visual proof in the KFB Island Worldbuilder Lab: load the A1 GLB into the running lab scene at runtime (no lab
// source change), check the sockets against the lab's own IslandField.connector data, and write 1600x900 PNG views.
// Run: node shoot_a1_in_lab.mjs  (lab dev server on 127.0.0.1:5192; uses the lab's playwright-core + Chrome)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const LAB = '/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Island Worldbuilder Lab';
const require = createRequire(path.join(LAB, 'package.json'));
const { chromium } = require('playwright-core');
const OUT = new URL('../evidence/lab/', import.meta.url); fs.mkdirSync(OUT, { recursive: true });
const GLB = '/@fs' + encodeURI(path.join(LAB, 'public/assets/_rkit_r3_preview/rkit_r3_a1_assembly.glb'));
const VIEWS = {
  lab_a1_overview: [35, -4, 150, 0.45, 0.85, 340],
  lab_a1_otown_bridgehead: [80, -6, 46, 2.2, 0.32, 48],
  lab_a1_pyramide_arrival: [-3, 1, 160, 0.9, 0.35, 52],
  lab_a1_junction: [40, -2, 233, 0.75, 0.6, 75],
  lab_a1_under_bridge: [104, -5, 98, 1.25, -0.22, 42],
};
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', headless: true, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://127.0.0.1:5192/?shot=1', { waitUntil: 'load' });
await page.waitForFunction(() => window.__kfb?.ready, null, { timeout: 120000 });
await page.waitForTimeout(2500);
const info = await page.evaluate(async (glb) => {
  const T = await import('/node_modules/three/build/three.module.js');
  const { GLTFLoader } = await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');
  const app = window.__kfb.app; let sc = null; for (const isl of app.islands.values()) { let o = isl.group; while (o.parent) o = o.parent; sc = o; break; }
  const g = await new GLTFLoader().loadAsync(glb); g.scene.name = 'RKIT_R3_A1_PREVIEW';
  g.scene.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; }); sc.add(g.scene);
  // sockets vs the lab's own connector data (world x/z from IslandField.connector, outward dir)
  const conn = {}; for (const [k, isl] of app.islands) { const c = isl.field.connector; isl.group.updateMatrixWorld(true); const w = new T.Vector3(c.x, 0, c.z).applyMatrix4(isl.group.matrixWorld); conn[k] = { x: w.x, z: w.z, dx: c.dx, dz: c.dz }; }
  const s0 = g.scene.getObjectByName('SOCKET_M_start'), s1 = g.scene.getObjectByName('SOCKET_M+J_end');
  const fwd = (o) => new T.Vector3(0, 0, -1).applyQuaternion(o.getWorldQuaternion(new T.Quaternion()));   // glTF node: Blender +Y (T) -> -Z? measured below
  const d = (o, c) => Math.hypot(o.getWorldPosition(new T.Vector3()).x - c.x, o.getWorldPosition(new T.Vector3()).z - c.z);
  return { meshes: (() => { let n = 0; g.scene.traverse((o) => { if (o.isMesh) n++; }); return n; })(), otownErr: d(s0, conn.otown), pyramideErr: d(s1, conn.pyramide),
    s0extras: s0.userData, conn: { otown: conn.otown, pyramide: conn.pyramide } };
}, GLB);
const shots = [];
for (const [name, cam] of Object.entries(VIEWS)) {
  await page.evaluate((c) => window.__kfb.setCamera(c), cam);
  await page.waitForTimeout(1200);
  const file = new URL(`${name}.png`, OUT); await page.screenshot({ path: file.pathname }); shots.push(file.pathname);
}
const stats = await page.evaluate(() => window.__kfb.stats());
fs.writeFileSync(new URL('lab_proof.json', OUT), JSON.stringify({ glb: GLB, info, stats, errors, shots, at: new Date().toISOString() }, null, 1));
console.log(JSON.stringify({ meshes: info.meshes, otownErr: info.otownErr, pyramideErr: info.pyramideErr, errors, stats }));
await browser.close();
