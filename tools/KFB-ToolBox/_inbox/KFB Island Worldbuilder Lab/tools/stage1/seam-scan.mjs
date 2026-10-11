// Fugen-Test (Steuerung 10.10., hard rule): pixel scan across the seam top net ↔ body (the top net's last row) from N1, N2
// and a side camera (I3) on each island. Per visible seam point: luminance a few pixels to the top side and to the body
// side; `step` = jump across the seam beyond the local gradient, `line` = a thin line on the seam against its neighbours.
// Exported as a page function for qcheck; node tools/stage1/seam-scan.mjs [query] prints the result.
export const seamScanInPage = async (id, cam, opts = {}) => {
  const THREE = await import('/node_modules/.vite/deps/three.js');
  const k = window.__kfb, isl = k.app.islands.get(id), T = isl.r2d.terrain, g = isl.group, top = g.getObjectByName('ground'), body = g.getObjectByName('under');
  k.setCamera(cam);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 300))));
  const canvas = document.querySelector('canvas'), gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl'), W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
  const px = await new Promise((r) => requestAnimationFrame(() => { const b = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, b); r(b); }));
  const C = new THREE.PerspectiveCamera(cam.fov ?? 38, W / H, 0.1, 5000); C.position.fromArray(cam.pos); C.lookAt(new THREE.Vector3().fromArray(cam.look)); C.updateMatrixWorld(); C.updateProjectionMatrix();
  g.updateMatrixWorld(true);
  const P = T.geo.attributes.position, NA = T.NA, ft = T.footRow ?? T.rollRow, rc = new THREE.Raycaster();
  const scr = (v) => { const q = v.clone().project(C); return [(q.x * 0.5 + 0.5) * W, (q.y * 0.5 + 0.5) * H, q.z]; };   // y up (GL rows)
  const L = (x, y) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return null; const o = (y * W + x) * 4; return (0.2126 * px[o] + 0.7152 * px[o + 1] + 0.0722 * px[o + 2]) / 255; };
  const bg = new THREE.Color(opts.bg ?? '#b0c6d8'), bgL = 0.2126 * bg.r + 0.7152 * bg.g + 0.0722 * bg.b;
  const out = [], N = T.geo.attributes.normal, nW = new THREE.Vector3();
  // the joint rows: end of the roll (where the old ghost line ran), foot of the wall, the shared seam ring (top net's last row)
  for (const row of [T.NR + 6, ft === T.diveRow ? (T.footRow ?? ft) : ft, T.diveRow]) for (let a = 0; a < NA; a += 2) {
    const s = new THREE.Vector3().fromBufferAttribute(P, row * NA + a).applyMatrix4(g.matrixWorld), u = new THREE.Vector3().fromBufferAttribute(P, Math.max(0, row - 2) * NA + a).applyMatrix4(g.matrixWorld);
    const [sx, sy, sz] = scr(s), [ux, uy] = scr(u);
    if (sz > 1 || sx < 20 || sy < 20 || sx > W - 20 || sy > H - 20) continue;
    // visible: the first hit along the view ray is the seam itself; not at a grazing angle (silhouette)
    const dir = s.clone().sub(C.position), dist = dir.length(); rc.set(C.position, dir.normalize());
    const h = rc.intersectObjects([top, body], false)[0]; if (!h || Math.abs(h.distance - dist) > 0.08 * Math.max(1, dist / 30)) continue;
    nW.fromBufferAttribute(N, row * NA + a).transformDirection(g.matrixWorld); if (Math.abs(nW.dot(dir)) < 0.3) continue;
    let dx = ux - sx, dy = uy - sy; const l = Math.hypot(dx, dy); if (l < 3) continue; dx /= l; dy /= l;   // towards the top side
    const at = (k2) => L(sx + dx * k2, sy + dy * k2);
    // every sample pixel must show this island (not sky / another body behind a silhouette): ray through the pixel
    const onIsland = (k2) => { rc.setFromCamera(new THREE.Vector2(((sx + dx * k2) / W) * 2 - 1, ((sy + dy * k2) / H) * 2 - 1), C); return rc.intersectObjects([top, body], false).length > 0; };
    if (![6, 3, -3, -6].every(onIsland)) continue;
    const t2 = at(3), t5 = at(6), b2 = at(-3), b5 = at(-6), c = at(0);
    if ([t2, t5, b2, b5, c].some((v) => v == null || Math.abs(v - bgL) < 0.02)) continue;   // off screen / sky
    const step = Math.max(0, Math.abs(t2 - b2) - (Math.abs(t5 - t2) + Math.abs(b5 - b2)) / 2);
    const line = Math.max(0, Math.abs(c - (t2 + b2) / 2) - Math.abs(t2 - b2) / 2);
    out.push([row, a, +step.toFixed(4), +line.toFixed(4)]);
  }
  const q = (arr, p) => { const s2 = arr.slice().sort((x, y) => x - y); return s2.length ? s2[Math.min(s2.length - 1, Math.floor(p * s2.length))] : 0; };
  const st = out.map((o) => o[2]), ln = out.map((o) => o[3]), worst = out.slice().sort((p, q2) => Math.max(q2[2], q2[3]) - Math.max(p[2], p[3])).slice(0, 3);
  return { samples: out.length, stepP50: +q(st, 0.5).toFixed(4), stepP95: +q(st, 0.95).toFixed(4), lineP50: +q(ln, 0.5).toFixed(4), lineP95: +q(ln, 0.95).toFixed(4), worst };
};

if (process.argv[1] && import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1]).href) {
  const { openLab } = await import('./browser.mjs');
  const { camsInPage } = await import('./cams.mjs');
  const { page, close } = await openLab(process.argv[2] ?? 'world=mvp1&shot=1&bg=b0c6d8');
  const res = {};
  for (const id of ['kfb_town', 'protopia']) {
    const cams = await page.evaluate(`(${camsInPage.toString()})(${JSON.stringify(id)})`);
    for (const c of ['N1_kante_lauf', 'N2_kante_unten', 'I3']) res[id + ' ' + c] = await page.evaluate(`(${seamScanInPage.toString()})(${JSON.stringify(id)}, ${JSON.stringify(cams[c])})`);
  }
  console.log(JSON.stringify(res, null, 1));
  await close();
}
