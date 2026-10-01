// KFB World Corridor 01 · additive performance probe.
// No renderer/timer ownership: observes requestAnimationFrame and the existing R2C API only.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const percentile = (sorted, p) => {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * p) - 1));
  return sorted[i];
};
const round = (n, d = 2) => Number(Number(n || 0).toFixed(d));
const count = (value) => Array.isArray(value) ? value.length : 0;

async function waitForR2C(timeoutMs = 60000) {
  const end = performance.now() + timeoutMs;
  while (performance.now() < end) {
    if (window.__r2c?.renderer && window.__r2c?.info) return window.__r2c;
    await wait(50);
  }
  throw new Error('WC1 probe: window.__r2c did not become ready.');
}

async function collectFrameDeltas(sampleMs) {
  const deltas = [];
  let last = null;
  const start = performance.now();
  return await new Promise((resolve) => {
    const tick = (now) => {
      if (last != null) deltas.push(now - last);
      last = now;
      if (now - start >= sampleMs) resolve(deltas);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

export async function measureWorldCorridorBaseline({
  warmupMs = 1800,
  sampleMs = 5000,
  label = 'R2C-baseline',
} = {}) {
  const api = await waitForR2C();
  if (document.visibilityState !== 'visible') {
    throw new Error(`WC1 probe requires a visible document; got ${document.visibilityState}.`);
  }

  await wait(warmupMs);
  const deltas = await collectFrameDeltas(sampleMs);
  const sorted = deltas.filter(Number.isFinite).sort((a, b) => a - b);
  const meanMs = sorted.length ? sorted.reduce((a, b) => a + b, 0) / sorted.length : 0;
  const info = api.info || {};
  const world = api.world || {};
  const renderer = api.renderer;
  const gl = renderer?.getContext?.();

  const result = {
    schema: 'kfb.world-corridor.performance/0.1',
    label,
    measuredAt: new Date().toISOString(),
    visibility: document.visibilityState,
    frames: sorted.length,
    sampleMs: round(sampleMs, 0),
    fps: meanMs > 0 ? round(1000 / meanMs, 1) : 0,
    meanFrameMs: round(meanMs),
    p95FrameMs: round(percentile(sorted, 0.95)),
    p99FrameMs: round(percentile(sorted, 0.99)),
    maxFrameMs: round(sorted.at(-1) || 0),
    drawCalls: Number(info.calls || 0),
    triangles: Number(info.tris || 0),
    geometries: Number(info.geoms || 0),
    textures: Number(info.tex || 0),
    programs: Number(info.progs || 0),
    batches: count(api.batches),
    worldItems: count(world.items),
    worldCells: count(world.cellsAll),
    clouds: count(world.clouds),
    billboards: count(world.boards),
    trackLengthM: Number(info.trackLen || 0),
    trackCrossings: Number(info.trackCross || 0),
    trackRelax: info.trackRelax || null,
    buildMs: Number(info.buildMs || 0),
    loadMs: Number(info.loadMs || 0),
    canvas: {
      cssW: Number(renderer?.domElement?.clientWidth || 0),
      cssH: Number(renderer?.domElement?.clientHeight || 0),
      pixelRatio: Number(renderer?.getPixelRatio?.() || 0),
    },
    renderer: {
      webglVersion: gl ? String(gl.getParameter(gl.VERSION) || '') : null,
      renderer: gl ? String(gl.getParameter(gl.RENDERER) || '') : null,
      vendor: gl ? String(gl.getParameter(gl.VENDOR) || '') : null,
    },
    source: {
      owner: 'KFB WorldBuilder',
      gate: 'WC1-BASELINE',
      visualSource: 'World Core R2C exact rehome',
    },
  };

  window.__KFB_WC1_BASELINE__.last = result;
  window.dispatchEvent(new CustomEvent('kfb-wc1-baseline-result', { detail: result }));
  return result;
}

window.__KFB_WC1_BASELINE__ = {
  schema: 'kfb.world-corridor.performance-probe/0.1',
  measure: measureWorldCorridorBaseline,
  last: null,
};
