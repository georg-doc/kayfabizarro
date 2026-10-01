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
    renderer: (() => {
      if (!gl) return { webglVersion: null, renderer: null, vendor: null, unmaskedRenderer: null, unmaskedVendor: null };
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        webglVersion: String(gl.getParameter(gl.VERSION) || ''),
        renderer: String(gl.getParameter(gl.RENDERER) || ''),
        vendor: String(gl.getParameter(gl.VENDOR) || ''),
        unmaskedRenderer: dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : null,
        unmaskedVendor: dbg ? String(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '') : null,
      };
    })(),
    device: {
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      deviceMemoryGB: navigator.deviceMemory || null,
      devicePixelRatio: window.devicePixelRatio || 1,
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


function formatResult(r) {
  if (!r) return 'No measurement yet.';
  const tris = Number(r.triangles || 0);
  return [
    `${r.fps} fps · mean ${r.meanFrameMs} ms · p95 ${r.p95FrameMs} ms · p99 ${r.p99FrameMs} ms`,
    `${r.drawCalls} calls · ${Math.round(tris / 1000)}k triangles · ${r.geometries} geoms · ${r.textures} textures · ${r.batches} batches`,
    `${r.worldCells} cells · ${r.worldItems} items · ${r.clouds} clouds · ${r.billboards} billboards · track ${r.trackLengthM} m · crossings ${r.trackCrossings}`,
    `canvas ${r.canvas.cssW}×${r.canvas.cssH} @${r.canvas.pixelRatio}x`,
    r.renderer.unmaskedRenderer || r.renderer.renderer || 'GPU renderer unavailable',
  ].join('\n');
}

function downloadJson(result) {
  const blob = new Blob([JSON.stringify(result, null, 2) + '\n'], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `kfb-wc1-gpu-baseline-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function mountBaselinePanel() {
  if (document.getElementById('kfb-wc1-gpu-panel')) return;
  const panel = document.createElement('section');
  panel.id = 'kfb-wc1-gpu-panel';
  panel.style.cssText = [
    'position:fixed','right:12px','bottom:12px','z-index:2147483000','width:min(430px,calc(100vw - 24px))',
    'background:rgba(20,19,15,.94)','color:#f0ece2','border:1px solid #4d4736','border-radius:9px',
    'box-shadow:0 10px 30px rgba(0,0,0,.35)','padding:10px','font:11px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace',
    'backdrop-filter:blur(7px)'
  ].join(';');
  panel.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
      <strong style="font:700 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase">WC1 · GPU Baseline</strong>
      <span data-role="state" style="margin-left:auto;color:#a99f80">ready</span>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
      <button data-role="measure" type="button">Measure 10s</button>
      <button data-role="copy" type="button" disabled>Copy JSON</button>
      <button data-role="download" type="button" disabled>Download JSON</button>
      <button data-role="hide" type="button">Hide</button>
    </div>
    <pre data-role="result" style="white-space:pre-wrap;margin:0;max-height:210px;overflow:auto;color:#d9d2bd">Keep this tab visible during measurement.</pre>
  `;
  for (const b of panel.querySelectorAll('button')) {
    b.style.cssText='background:#29261d;color:#f0ece2;border:1px solid #514b39;border-radius:5px;padding:5px 8px;font:600 10px/1 ui-sans-serif,system-ui,sans-serif;cursor:pointer';
  }
  const state = panel.querySelector('[data-role="state"]');
  const result = panel.querySelector('[data-role="result"]');
  const measure = panel.querySelector('[data-role="measure"]');
  const copy = panel.querySelector('[data-role="copy"]');
  const download = panel.querySelector('[data-role="download"]');

  measure.onclick = async () => {
    measure.disabled = true; copy.disabled = true; download.disabled = true;
    state.textContent = 'measuring…';
    result.textContent = 'Warm-up 2 s, then 10 s visible-frame sample. Keep this tab in front.';
    try {
      const r = await measureWorldCorridorBaseline({ warmupMs: 2000, sampleMs: 10000, label: 'GEORG_GPU_BASELINE' });
      result.textContent = formatResult(r);
      const gpu = r.renderer.unmaskedRenderer || r.renderer.renderer || '';
      state.textContent = /swiftshader|llvmpipe|software/i.test(gpu) ? 'software renderer' : 'measured';
      copy.disabled = false; download.disabled = false;
    } catch (err) {
      state.textContent = 'failed';
      result.textContent = String(err?.message || err);
    } finally {
      measure.disabled = false;
    }
  };
  copy.onclick = async () => {
    if (!window.__KFB_WC1_BASELINE__.last) return;
    await navigator.clipboard.writeText(JSON.stringify(window.__KFB_WC1_BASELINE__.last, null, 2));
    state.textContent = 'copied';
  };
  download.onclick = () => window.__KFB_WC1_BASELINE__.last && downloadJson(window.__KFB_WC1_BASELINE__.last);
  panel.querySelector('[data-role="hide"]').onclick = () => { panel.style.display = 'none'; };
  document.body.appendChild(panel);
  window.__KFB_WC1_BASELINE__.showPanel = () => { panel.style.display = ''; };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountBaselinePanel, { once: true });
} else {
  mountBaselinePanel();
}
