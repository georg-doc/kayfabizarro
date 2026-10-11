import { openLab } from './browser.mjs';
const { page, close } = await openLab('shot=1&hub=1&solo=rkit_hub&bg=b0c6d8');
await page.evaluate(() => new Promise((r) => setTimeout(r, 2500)));
const r = await page.evaluate(async () => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const isl = window.__kfb.app.islands.get('rkit_hub'), g = isl.r2d ?? isl.field.r2d;
  const q = window.__kfb.qcheck('rkit_hub');
  const out = {};
  for (const nm of ['ground', 'under']) out[nm] = { trans: q.q5[nm].transitionOver45, at: q.q5[nm].transAt, folds: q.q5[nm].foldAt, max: q.q5[nm].maxDeg };
  const geo = isl.group.getObjectByName('ground').geometry, P = geo.attributes.position, ix = geo.index, NA = isl.r2d?.terrain?.NA;
  // all >45 edges on ground, by row
  const fn = [], A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), E = new Map();
  for (let t = 0; t < ix.count / 3; t++) { const a = ix.getX(t*3), b = ix.getX(t*3+1), c = ix.getX(t*3+2); A.fromBufferAttribute(P,a); B.fromBufferAttribute(P,b); C.fromBufferAttribute(P,c); fn.push(B.clone().sub(A).cross(C.clone().sub(A)).normalize()); for (const [u,v] of [[a,b],[b,c],[c,a]]) { const k = u<v?u+'_'+v:v+'_'+u; (E.get(k) ?? E.set(k,[]).get(k)).push(t); } }
  const rows = {}, pts = [];
  const NAx = window.__kfb.app.islands.get('rkit_hub').r2d?.terrain?.NA ?? 0;
  for (const [k, ts] of E) { if (ts.length !== 2) continue; const deg = fn[ts[0]].angleTo(fn[ts[1]]) * 57.3; if (deg < 45) continue; const [u, v] = k.split('_').map(Number); A.fromBufferAttribute(P,u); const row = NAx ? Math.floor(u / NAx) + '/' + Math.floor(v / NAx) : '?'; rows[row] = (rows[row] ?? 0) + 1; if (pts.length < 80) pts.push([row, NAx ? u % NAx : u, +A.x.toFixed(1), +A.y.toFixed(1), +A.z.toFixed(1), +deg.toFixed(0)]); }
  out.rows = rows; out.pts = pts; out.NA = NAx; out.keys = Object.keys(isl).slice(0, 40);
  return out;
});
console.log(JSON.stringify(r));
await close();
