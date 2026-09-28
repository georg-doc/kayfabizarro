/* KFB CLAY-CITY-MVP-01 · deterministic render bench (works on the R6 host and on Clay City alike)
   Why: the Coworker environment has no local server and its browser surfaces are often hidden or throttled,
   so requestAnimationFrame cadence is not a valid measure there. This bench renders fixed camera poses
   synchronously (render + 1-pixel readPixels = GPU drained) N times and reports p50/p95 cost, draw calls
   and triangles at fixed canvas sizes. Real-time p95 on Georg's machine comes from ?probe=1 / ?measure=1. */
import * as THREE from 'three';

export async function runBench({ app, mobility, sizes = [[1600, 900, 0.95], [390, 844, 0.82]], n = 60 } = {}) {
  const r = app.renderer, gl = r.getContext(), cam = app.camera, px = new Uint8Array(4);
  const keep = { pr: r.getPixelRatio(), size: r.getSize(new THREE.Vector2()), pos: cam.position.clone(), quat: cam.quaternion.clone(), aspect: cam.aspect };
  const t = app.world.tile, sp = app.world.spawn, car = mobility?.drive?.position;
  const poses = {
    ground: { pos: [sp.x - Math.sin(sp.heading) * 5, 2.2, sp.z - Math.cos(sp.heading) * 5], at: [sp.x + Math.sin(sp.heading) * 20, 1.2, sp.z + Math.cos(sp.heading) * 20] },
    drive: car ? { pos: [car.x - 7, 4.2, car.z - 7], at: [car.x + 10, 1, car.z + 10] } : null,
    flight: { pos: [t.cx + 70, 95, t.cz + 110], at: [t.cx, 0, t.cz] }
  };
  const out = { schema: 'kfb.clay-city-render-bench/1', n, gpu: (() => { const d = gl.getExtension('WEBGL_debug_renderer_info'); return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?'; })(), views: {} };
  for (const [w, h, pr] of sizes) {
    r.setPixelRatio(pr); r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    for (const [id, P] of Object.entries(poses)) {
      if (!P) continue;
      cam.position.set(...P.pos); cam.lookAt(...P.at); cam.updateMatrixWorld();
      for (let i = 0; i < 4; i++) r.render(app.scene, cam);
      const d = [];
      for (let i = 0; i < n; i++) { const t0 = performance.now(); r.render(app.scene, cam); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); d.push(performance.now() - t0); }
      d.sort((a, b) => a - b);
      out.views[id + '@' + w + 'x' + h] = { p50Ms: +d[Math.floor(n * 0.5)].toFixed(2), p95Ms: +d[Math.floor(n * 0.95)].toFixed(2), calls: r.info.render.calls, triangles: r.info.render.triangles, pixelRatio: pr };
    }
  }
  r.setPixelRatio(keep.pr); r.setSize(keep.size.x, keep.size.y, false); cam.aspect = keep.aspect; cam.updateProjectionMatrix(); cam.position.copy(keep.pos); cam.quaternion.copy(keep.quat);
  /* walker: the owner's own fixed-step driver (same as the R5 proof) */
  if (app.play?.drive) {
    const p0 = app.play.position.clone(); try { app.play.drive({ iy: 1 }, 2, 1 / 60); } catch (e) { out.walkerError = e.message; }
    const p1 = app.play.position; out.walkerFixedStep = { seconds: 2, metres: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(2) };
  }
  return out;
}
