// RKIT hook 4: the abutment niche in the lab island against RKIT's cut (kfb.rkit-abutment-cut/1): where the top ends
// along the niche axis and across, the wall foot height, the bench, Q5 / road / star on the island, abutment parts vs rock.
// node tools/stage1/niche-check.mjs [out.json]
import fs from 'node:fs';
import { openLab } from './browser.mjs';
const { page, errors, close } = await openLab('shot=1&hub=1&solo=rkit_hub&bg=b0c6d8');
await page.evaluate(() => new Promise((r) => setTimeout(r, 2500)));
const r = await page.evaluate(async () => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const isl = window.__kfb.app.islands.get('rkit_hub'), f = isl.field, cut = await (await fetch('/roadbeds/rkit_hub.abutment-cut.json')).json();
  const q = window.__kfb.qcheck('rkit_hub'); isl.group.updateMatrixWorld(true);
  const top = isl.group.getObjectByName('ground'), under = isl.group.getObjectByName('under'), M = isl.group.matrixWorld, inv = M.clone().invert();
  const ray = new THREE.Raycaster();
  const downY = (x, z) => { const o = new THREE.Vector3(x, 100, z).applyMatrix4(M); ray.set(o, new THREE.Vector3(0, -1, 0)); const h = ray.intersectObjects([top, under], false)[0]; return h ? h.point.applyMatrix4(inv).y : null; };
  // along the niche axis (x = 0) from inside out: last z where the top surface (y > soleY + 0.5) is hit
  const zs = []; for (let z = -40; z >= -75; z -= 0.25) zs.push([z, downY(0, z)]);
  const topEnd = zs.filter(([, y]) => y != null && y > cut.soleY + 0.5).map(([z]) => z).reduce((a, b) => Math.min(a, b), 0);
  const bench = zs.filter(([z, y]) => y != null && z < topEnd - 0.5 && y <= cut.soleY + 0.5).map(([z, y]) => [z, +y.toFixed(2)]).slice(0, 4);
  // across at the middle of the cut side walls (z between plan back edge and rim)
  const across = {}; for (const z of [-55, -58, -61]) { let xr = null, xl = null; for (let x = 0; x <= 25; x += 0.25) { const y = downY(x, z); if (y != null && y > cut.soleY + 0.5) { xr = x; break; } } for (let x = 0; x >= -25; x -= 0.25) { const y = downY(x, z); if (y != null && y > cut.soleY + 0.5) { xl = x; break; } } across[z] = [xl, xr]; }
  // abutment parts vs rock: vertices inside the island body above the sole (penetration) and their depth
  const parts = isl.rkitParts.find((g) => g.name.includes('abutment')); let inRock = 0, n = 0, deep = 0;
  if (parts) parts.traverse((o) => { if (!o.isMesh) return; const p = o.geometry.attributes.position; for (let i = 0; i < p.count; i += 7) { n++; const x = p.getX(i), y = p.getY(i), z = p.getZ(i), yt = downY(x, z); if (yt != null && y < yt - 0.05 && y > cut.soleY + 0.05 && f.plan.sdf(x, z) < -0.05) { inRock++; deep = Math.max(deep, -f.plan.sdf(x, z)); } } });
  return { cut: { planBackZ: cut.plan[0][1], halfWidth: cut.plan[1][0], soleY: cut.soleY, wallFrontZ: cut.wallFront[0][1] }, lab: { topEndZ: topEnd, bench, acrossX: across },
    abutmentParts: parts ? { name: parts.name, verts: n, inRockAboveSole: inRock, maxDepth: +deep.toFixed(2) } : null,
    star: f.plan.star, q5: Object.fromEntries(Object.entries(q.q5).map(([k, v]) => [k, [v.transitionOver45, v.designedMaxDeg, v.folds]])), road: { T1: q.road.T1.pass, T2: q.road.T2.pass, gap: q.road.T2.seamFootGapMax }, edge: q.hard.edge.pass, scholle: q.hard.scholle.pass, stats: window.__kfb.stats() }; });
console.log(JSON.stringify(r, null, 1)); console.log('errors', errors.filter((e) => !e.includes('404')).slice(0, 5));
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(r, null, 1));
await close();
