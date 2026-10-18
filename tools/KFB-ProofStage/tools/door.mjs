// KFB door clear-height probe (WS0 PROOF_STAGE_R1 v1.2). Headless, read-only. GLB in KayKit u (x 0.616 m), root extras kfb.entrances[0]
// (pos_u, forward_xz, optional door node). Prints: foot/anchor positions, upward rays at the anchor, a depth map of the facade in front of the
// door (rows = height above the door anchor in m, columns = -2.4..2.4 m across; digit = 0.25 m steps behind the anchor, '#' = see-through,
// letters = in front), and the passage profile (floor / ceiling / clear height every KSTEP m into the door, at -0.3 / 0 / +0.3 m across).
// Clear height = ceiling - floor where the passage is narrowest. Usage:
//   KFB_CHROME=<chrome-headless-shell> PROBE='{"H0":1.5,"KMAX":3,"KSTEP":0.1}' node tools/door.mjs <building.glb> [...]
//   H0 = probe height above the anchor (inside the opening), KMAX/KSTEP = how far/fine into the passage (m). Needs network (three from jsDelivr).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const files = process.argv.slice(2);
const page = `<!doctype html><script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
window.probe = async (url) => { const g = await new GLTFLoader().loadAsync(url); const s = g.scene; s.scale.setScalar(0.616); s.updateMatrixWorld(true);
  let host = null; s.traverse((o) => { if (!host && o.userData?.kfb?.entrances) host = o; }); if (!host) return 'no entrances';
  const en = host.userData.kfb.entrances[0]; const door = en.door ? s.getObjectByName(en.door) : null;
  const meshes = []; s.traverse((o) => { if (o.isMesh) meshes.push(o); });
  const foot = host.parent.localToWorld(new THREE.Vector3(...en.pos_u)); const f = new THREE.Vector3(en.forward_xz[0], 0, en.forward_xz[1]).normalize();
  const a = door ? door.getWorldPosition(new THREE.Vector3()) : foot.clone(); const rc = new THREE.Raycaster(); rc.firstHitOnly = true;
  const hit = (o, d, far = 100) => { rc.set(o, d); rc.far = far; const h = rc.intersectObjects(meshes, false)[0]; return h ? +h.distance.toFixed(3) : null; };
  const out = { foot: foot.toArray().map((v) => +v.toFixed(3)), anchor: a.toArray().map((v) => +v.toFixed(3)), width_m: en.width_m, up: {}, depth: [] , down_at_anchor: hit(a.clone().add(new THREE.Vector3(0, 0.5, 0)), new THREE.Vector3(0, -1, 0)) };
  for (const k of [-0.2, 0, 0.1, 0.2, 0.3, 0.5, 0.8]) { const o = a.clone().addScaledVector(f, -k); o.y += 0.05; out.up[k] = hit(o, new THREE.Vector3(0, 1, 0)); }
  const back = f.clone().negate();
  for (let h = 0.05; h <= 4.01; h += 0.1) { const o = a.clone().addScaledVector(f, 1.5); o.y += h; out.depth.push([+h.toFixed(2), hit(o, back)]); }
  out.map = []; const right = new THREE.Vector3(f.z, 0, -f.x);   // right-hand when looking at the door from outside? (f x up)
  for (let h = 7.0; h >= -1.01; h -= 0.25) { let row = ''; for (let x = -2.4; x <= 2.41; x += 0.2) { const o = a.clone().addScaledVector(f, 3).addScaledVector(right, x); o.y += h; const d = hit(o, back, 40); const behind = d == null ? 99 : d - 3; row += behind > 9.5 ? ' #' : behind < -2.95 ? ' -' : ' ' + (behind < 0 ? String.fromCharCode(97 + Math.min(25, Math.floor(-behind / 0.25))) : Math.min(9, Math.floor(behind / 0.25))); } out.map.push(h.toFixed(2).padStart(6) + row); }
  out.upGrid = []; for (const k of [0.1, 0.3, 0.6, 1.0]) { const r = []; for (let x = -1.2; x <= 1.21; x += 0.2) { const o = a.clone().addScaledVector(f, -k).addScaledVector(right, x); o.y += 0.05; const d = hit(o, new THREE.Vector3(0, 1, 0)); r.push(d == null ? '  -  ' : (d + 0.05).toFixed(2)); } out.upGrid.push('in ' + k + ': ' + r.join(' ')); }
  out.cols = {}; for (const x of (window.XS || [-0.4, -0.2, 0, 0.2, 0.4])) { const r = []; for (let h = -0.3; h <= 7.0; h += 0.05) { const o = a.clone().addScaledVector(f, 3).addScaledVector(right, x); o.y += h; const d = hit(o, back, 40); r.push(h.toFixed(2) + ':' + (d == null ? 'inf' : (d - 3).toFixed(2))); } out.cols[x] = r.join(' '); }
  out.passage = []; const H0 = window.H0 || 1.5; for (let k = 0.0; k <= (window.KMAX || 3); k += (window.KSTEP || 0.1)) { const r = []; for (const x of [-0.3, 0, 0.3]) { const o = a.clone().addScaledVector(f, -k).addScaledVector(right, x); o.y += H0; const dn = hit(o, new THREE.Vector3(0, -1, 0)), upd = hit(o, new THREE.Vector3(0, 1, 0)); r.push('x' + x + ': floor ' + (dn == null ? '-' : (H0 - dn).toFixed(2)) + ' ceil ' + (upd == null ? '-' : (H0 + upd).toFixed(2)) + ' clear ' + (dn != null && upd != null ? (dn + upd).toFixed(2) : '-')); } out.passage.push('in ' + k.toFixed(1) + ' | ' + r.join(' | ')); }
  return out; };
window.READY = true;
</script>`;
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname);
  if (u === '/') { r.writeHead(200, { 'content-type': 'text/html' }); r.end(page); return; }
  const f = files[+u.slice(1)]; if (f && fs.existsSync(f)) { r.writeHead(200, { 'content-type': 'model/gltf-binary' }); fs.createReadStream(f).pipe(r); } else { r.writeHead(404); r.end(); } });
await new Promise((r) => srv.listen(0, '127.0.0.1', r)); const port = srv.address().port;
const { chromium } = createRequire(path.join(process.env.HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab/package.json'))('playwright-core');
const br = await chromium.launch({ headless: true, executablePath: process.env.KFB_CHROME });
try { const p = await br.newPage(); await p.goto(`http://127.0.0.1:${port}/`); await p.waitForFunction(() => window.READY === true); await p.evaluate((e) => Object.assign(window, e), JSON.parse(process.env.PROBE || '{}'));
  for (let i = 0; i < files.length; i++) { const m = await p.evaluate((u) => window.probe(u), '/' + i); console.log('== ' + path.basename(files[i])); const {map, upGrid, cols, passage, ...rest} = m; console.log(JSON.stringify(rest)); console.log('depth map (rows: m above anchor; cols -2.4..2.4 m):\n' + m.map.join('\n')); console.log('passage:\n' + m.passage.join('\n')); }
} finally { await br.close(); srv.close(); }
