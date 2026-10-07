// in-page: move the camera focus along +X at `speed` m/s for `secs`, record frame times (run via peval)
(async (speed, secs) => {
  const k = window.__kfb; const dts = []; let last = performance.now(); const t0 = last;
  await new Promise((res) => {
    const f = () => {
      const now = performance.now(); dts.push(now - last); last = now;
      const t = (now - t0) / 1000; const x = t * speed;
      k.setCamera({ target: [x, 0, x * 0.3], yaw: 30, pitch: 40, dist: 60 });
      if (t < secs) requestAnimationFrame(f); else res();
    };
    requestAnimationFrame(f);
  });
  dts.sort((a, b) => b - a);
  return { frames: dts.length, worst: dts.slice(0, 8).map((x) => x | 0), over50: dts.filter((x) => x > 50).length, p95: dts[Math.floor(dts.length * 0.05)] | 0, perf: window.__roads?.perf(), terrain: k.engine.ctx.services.get('terrain')?.stats?.() };
})
