// "Void visible" check: node src/modules/roads/tools/voidcheck.mjs seed q0 r0 radius [query]
// For every road / river cell within the radius: 6 follow-like cameras (7 m out toward each neighbour, 4 m above the
// ground there, looking at the cell centre). Renders the scene with the sky dome hidden, no fog and a magenta clear
// colour into a 320×180 target; counts magenta pixels in the lower 75 % of the frame (= ground that has a hole in it).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [seed, q0, r0, RAD = 4] = process.argv.slice(2, 6).map(Number);
const exe = [process.env.CHROME, '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((c) => fs.existsSync(c));
const b = await chromium.launch({ executablePath: exe, headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage({ viewport: { width: 640, height: 360 } });
const errs = [];
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
await p.goto(`http://127.0.0.1:5180/?seed=${seed}${process.argv[6] ?? ''}`);
await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000 });
const X0 = 15 * (q0 + r0 / 2), Z0 = 12.990381 * r0;
// Vite full-reloads the page whenever another builder saves a file: mark the page, re-check the mark right before
// measuring, and start over (up to 6 times) if it reloaded underneath us
let o = null;
for (let attempt = 0; attempt < 6 && !o; attempt++) {
  await p.waitForFunction(() => window.__kfb && window.__kfb.ready, null, { timeout: 300000 });
  await p.evaluate(([x, z]) => { window.__vcMark = 1; const P = window.__kfb.engine.ctx.services.get('player'); P.spawn(x, window.__kfb.engine.ctx.world.heightAt(x, z) + 0.5, z, 0); }, [X0, Z0]).catch(() => {});
  await p.evaluate(() => window.__kfb.waitIdle(60000)).catch(() => {});
  await p.waitForTimeout(1500);
  const r = await measure().catch((err) => ({ err: String(err) }));
  console.error("attempt", attempt, JSON.stringify(r).slice(0, 400));
  // (an HMR module swap can leave an empty scene behind without a page reload: nothing rendered → retry)
  if (r && !r.err && r.reloaded !== true && r.nViews > 0) o = r;
  else await p.reload().catch(() => {});
}
async function measure() { return p.evaluate(([q0, r0, RAD]) => {
  if (window.__vcMark !== 1) return { reloaded: true };
  const e = window.__kfb.engine, ctx = e.ctx, scene = ctx.scene, R = e.renderer, gl = R.getContext();
  const Cam = e.camera.constructor, Col = scene.background.constructor;
  const hidden = [];
  scene.traverse((o) => {
    if (!o.isMesh || !o.visible) return;
    const g = o.geometry; if (!g.boundingSphere) g.computeBoundingSphere();
    // the sky dome (unit sphere drawn at infinity by a ShaderMaterial) and other huge backdrops
    const sky = o.material && o.material.isShaderMaterial && o.material.uniforms && 'kfbSkyZ' in o.material.uniforms;
    if (sky || (g.boundingSphere && g.boundingSphere.radius * Math.max(o.scale.x, o.scale.y, o.scale.z) > 400)) { o.visible = false; hidden.push(o); }
  });
  const fog = scene.fog, bg = scene.background;
  scene.fog = null; scene.background = new Col(1, 0, 1);
  // single-sided override: a hole shows what is BELOW the surface; tile bottoms / column insides are back faces from
  // above and get culled, so any hole reaches the magenta clear colour (dark undersides no longer hide it)
  let stdMat = null;
  scene.traverse((o) => { if (!stdMat && o.isMesh && o.material && o.material.isMeshStandardMaterial) stdMat = o.material; });
  const ovr = stdMat ? new stdMat.constructor({ color: 0x88aa66 }) : null;
  if (ovr) { ovr.side = 0; scene.overrideMaterial = ovr; }
  const hiddenInst = [];
  scene.traverse((o) => { if (o.isInstancedMesh && o.visible) { o.visible = false; hiddenInst.push(o); } }); // grass / props
  const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
  const cam = new Cam(50, w / h, 0.3, 2000);
  const buf = new Uint8Array(w * h * 4);
  // sanity: a camera looking up at the sky must see the magenta clear colour
  let sanity = 0;
  { const x = 15 * (q0 + r0 / 2), z = 12.990381 * r0, y = ctx.world.heightAt(x, z) + 3;
    cam.position.set(x, y, z); cam.lookAt(x + 10, y + 6, z); cam.updateMatrixWorld();
    R.setRenderTarget(null); R.render(scene, cam); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    for (let i = 0; i < buf.length; i += 16) if (buf[i] > 235 && buf[i + 1] < 25 && buf[i + 2] > 235) sanity++; }
  const DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  const views = []; let nViews = 0, skyPx = 0; // skyPx: magenta in the top quarter (sanity: the clear colour shows)
  for (let q = q0 - RAD; q <= q0 + RAD; q++) for (let r = r0 - RAD; r <= r0 + RAD; r++) {
    const c = window.__kfb.cell(q, r);
    if (!c.roadMask && !c.riverMask) continue;
    const cx = 15 * (q + r / 2), cz = 12.990381 * r, cy = ctx.world.heightAt(cx, cz);
    for (const [dq, dr] of DIRS) {
      const nx = 15 * (q + dq + (r + dr) / 2), nz = 12.990381 * (r + dr);
      const vx = (nx - cx) / 15, vz = (nz - cz) / 15;
      // two cameras per edge: from outside looking at the cell centre (7 m out, 4 m up), and a close one from 2 m
      // inside the cell looking down at the edge midpoint (3 m up) — the user's knee-high follow view
      for (const k of [0, 1]) {
      const px = k ? cx + vx * 2 : cx + vx * 7, pz = k ? cz + vz * 2 : cz + vz * 7;
      const py = Math.max(ctx.world.heightAt(px, pz), cy) + (k ? 3 : 4);
      const tx = k ? cx + vx * 7.5 : cx, tz = k ? cz + vz * 7.5 : cz, ty = k ? ctx.world.heightAt(cx + vx * 7.3, cz + vz * 7.3) : cy;
      cam.position.set(px, py, pz); cam.lookAt(tx, ty, tz); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
      R.setRenderTarget(null);
      R.render(scene, cam);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      let n = 0, sx = 0, sy = 0;
      const pix = [];
      for (let y = 0; y < Math.floor(h * 0.75); y++) for (let x = 0; x < w; x++) { // rows from the bottom
        const i = (y * w + x) * 4;
        if (buf[i] > 235 && buf[i + 1] < 25 && buf[i + 2] > 235) { n++; sx += x; sy += y; if (pix.length < 4 || n % 7 === 0 && pix.length < 8) pix.push([x, y]); }
      }
      // owner: march each void pixel's ray until it meets heightAt (where the ground should be) → that cell / edge
      const owners = [];
      for (const [x, y] of pix) {
        const ndc = cam.position.clone().set((x + 0.5) / w * 2 - 1, (y + 0.5) / h * 2 - 1, 0.5).unproject(cam);
        const dir = ndc.sub(cam.position).normalize();
        let hit = null;
        for (let t = 0.5; t < 60; t += 0.02) {
          const px2 = cam.position.x + dir.x * t, py2 = cam.position.y + dir.y * t, pz2 = cam.position.z + dir.z * t;
          if (py2 <= ctx.world.heightAt(px2, pz2)) { hit = [px2, py2, pz2]; break; }
        }
        if (!hit) { owners.push({ px: [x, y], hit: null }); continue; }
        const qf = hit[0] / 15 - (hit[2] / 12.990381) / 2, rf = hit[2] / 12.990381;
        let qi = Math.round(qf), ri = Math.round(rf); const si = Math.round(-qf - rf);
        const dq = Math.abs(qi - qf), dr = Math.abs(ri - rf), ds = Math.abs(si + qf + rf);
        if (dq > dr && dq > ds) qi = -ri - si; else if (dr > ds) ri = -qi - si;
        const cc = window.__kfb.cell(qi, ri), ccx = 15 * (qi + ri / 2), ccz = 12.990381 * ri;
        const lx = hit[0] - ccx, lz = hit[2] - ccz;
        let edge = -1, ed = -1;
        for (let d = 0; d < 6; d++) { const v = lx * Math.cos(d * Math.PI / 3) - lz * Math.sin(d * Math.PI / 3); if (v > ed) { ed = v; edge = d; } }
        owners.push({ px: [x, y], hit: hit.map((v) => +v.toFixed(2)), cell: [qi, ri], level: cc.level, road: cc.roadMask, river: cc.riverMask, slope: cc.slope ? cc.slope.dir : null, tags: (cc.tags || []).join('+'), edge, toEdge: +(7.5 - ed).toFixed(2), toCentre: +Math.hypot(lx, lz).toFixed(2) });
      }
      for (let y = Math.floor(h * 0.75); y < h; y++) for (let x = 0; x < w; x += 4) { const i = (y * w + x) * 4; if (buf[i] > 235 && buf[i + 1] < 25 && buf[i + 2] > 235) skyPx++; }
      nViews++;
      if (n) views.push({ q, r, d: DIRS.findIndex((dd) => dd[0] === dq && dd[1] === dr), close: k, cam: [+px.toFixed(2), +py.toFixed(2), +pz.toFixed(2)], look: [+tx.toFixed(2), +ty.toFixed(2), +tz.toFixed(2)], px: n, at: [Math.round(sx / n / w * 100), 100 - Math.round(sy / n / h * 100)], owners });
      }
    }
  }
  scene.fog = fog; scene.background = bg; scene.overrideMaterial = null; for (const o of hidden) o.visible = true; for (const o of hiddenInst) o.visible = true;
  views.sort((a2, b2) => b2.px - a2.px);
  if (window.__vcMark !== 1) return { reloaded: true };
  const c0 = window.__kfb.cell(q0, r0);
  return { dbg: { q0, r0, RAD, lvl: c0.level, road: c0.roadMask, h: ctx.world.heightAt(15 * (q0 + r0 / 2), 12.990381 * r0), meshes: (() => { let m = 0; scene.traverse((o) => { if (o.isMesh && o.visible) m++; }); return m; })() }, sanity, skyPx, nViews, withVoid: views.length, totalPx: views.reduce((s2, v) => s2 + v.px, 0), buffer: [w, h], worst: views.slice(0, 12) };
}, [q0, r0, RAD]); }
console.log(JSON.stringify({ o, errs }));
await b.close();
