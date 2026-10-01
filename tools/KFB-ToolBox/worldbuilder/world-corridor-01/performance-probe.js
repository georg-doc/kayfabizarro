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
    mode: info.mode || null,
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


export async function measureWorldCorridorCostSplit({
  warmupMs = 900,
  sampleMs = 4000,
} = {}) {
  const api = await waitForR2C();
  if (document.visibilityState !== 'visible') {
    throw new Error(`WC1 cost split requires a visible document; got ${document.visibilityState}.`);
  }

  const renderer = api.renderer;
  const canvas = renderer.domElement;
  const original = {
    mode: api.info?.mode || 'B',
    clayOn: Number(api.U?.uClayOn?.value ?? 1),
    shadows: Boolean(api.sun?.castShadow),
    pixelRatio: Number(renderer.getPixelRatio?.() || 1),
  };
  const rows = [];

  const resizeAt = (ratio) => {
    renderer.setPixelRatio(ratio);
    renderer.setSize(canvas.clientWidth || 1, canvas.clientHeight || 1, false);
  };
  const measure = async (label) => {
    const row = await measureWorldCorridorBaseline({ warmupMs, sampleMs, label });
    rows.push(row);
    return row;
  };

  try {
    api.set('mode', 'B');
    api.set('clouds', true);
    api.set('shadows', true);
    if (api.U?.uClayOn) api.U.uClayOn.value = 1;
    resizeAt(original.pixelRatio);
    await measure('B_DEFAULT');

    if (api.U?.uClayOn) api.U.uClayOn.value = 0;
    await measure('B_CLAY_OFF');
    if (api.U?.uClayOn) api.U.uClayOn.value = 1;

    api.set('clouds', false);
    await measure('B_CLOUDS_OFF');
    api.set('clouds', true);

    api.set('shadows', false);
    await measure('B_SHADOWS_OFF');
    api.set('shadows', true);

    resizeAt(1);
    await measure('B_PIXEL_RATIO_1');
  } finally {
    resizeAt(original.pixelRatio);
    if (api.U?.uClayOn) api.U.uClayOn.value = original.clayOn;
    api.set('clouds', true);
    api.set('shadows', original.shadows);
    api.set('mode', original.mode);
  }

  const base = rows[0]?.meanFrameMs || 0;
  const result = {
    schema: 'kfb.world-corridor.cost-split/0.1',
    measuredAt: new Date().toISOString(),
    device: rows[0]?.device || null,
    canvas: rows[0]?.canvas || null,
    rows,
    deltasFromDefault: Object.fromEntries(rows.slice(1).map((row) => [
      row.label,
      {
        meanFrameMs: row.meanFrameMs,
        deltaMs: round(row.meanFrameMs - base),
        deltaPct: base ? round((row.meanFrameMs - base) / base * 100, 1) : 0,
        fps: row.fps,
      },
    ])),
  };
  window.__KFB_WC1_BASELINE__.costSplit = result;
  window.dispatchEvent(new CustomEvent('kfb-wc1-cost-split-result', { detail: result }));
  return result;
}


export async function measureClayParts({
  warmupMs = 700,
  sampleMs = 3000,
} = {}) {
  const api = await waitForR2C();
  const U = api.U || {};
  const required = ['uClayPerfRelief','uClayPerfMarks','uClayPerfPrint','uClayPerfFacet','uClayPerfMottle'];
  const missing = required.filter((k) => !U[k]);
  if (missing.length) throw new Error('Clay-Bausteine-Test braucht die Diagnose-Version des Shaders: ' + missing.join(', '));
  if (document.visibilityState !== 'visible') throw new Error('Bitte den Chrome-Tab während der Messung sichtbar lassen.');

  const renderer = api.renderer;
  const canvas = renderer.domElement;
  const original = {
    mode: api.info?.mode || 'B',
    clayOn: Number(U.uClayOn?.value ?? 1),
    pixelRatio: Number(renderer.getPixelRatio?.() || 1),
    flags: Object.fromEntries(required.map((k) => [k, Number(U[k].value ?? 1)])),
  };
  const rows = [];
  const resizeAt = (ratio) => {
    renderer.setPixelRatio(ratio);
    renderer.setSize(canvas.clientWidth || 1, canvas.clientHeight || 1, false);
  };
  const flags = (state = {}) => {
    for (const k of required) U[k].value = state[k] ?? 1;
  };
  const measure = async (label, extra = {}) => {
    const row = await measureWorldCorridorBaseline({ warmupMs, sampleMs, label });
    row.clayParts = Object.fromEntries(required.map((k) => [k, Number(U[k].value)]));
    row.testPixelRatio = Number(renderer.getPixelRatio?.() || 0);
    Object.assign(row, extra);
    rows.push(row);
    return row;
  };

  try {
    api.set('mode', 'B');
    if (U.uClayOn) U.uClayOn.value = 1;
    resizeAt(original.pixelRatio);
    flags();

    await measure('CLAY_DEFAULT');

    flags({uClayPerfRelief:0});
    await measure('BASE_RELIEF_OFF');

    flags({uClayPerfMarks:0});
    await measure('DENTS_GOUGES_CRACKS_OFF');

    flags({uClayPerfPrint:0});
    await measure('FINGERPRINTS_OFF');

    flags({uClayPerfFacet:0});
    await measure('FACETS_CREASES_OFF');

    flags({uClayPerfMottle:0});
    await measure('MOTTLE_OFF');

    flags({uClayPerfMarks:0,uClayPerfPrint:0,uClayPerfFacet:0,uClayPerfMottle:0});
    await measure('BASE_RELIEF_ONLY');

    flags();
    if (U.uClayOn) U.uClayOn.value = 0;
    await measure('CLAY_OFF_PR_ORIGINAL');

    if (U.uClayOn) U.uClayOn.value = 1;
    resizeAt(1.0);
    await measure('CLAY_ON_PR_1_0');
    if (U.uClayOn) U.uClayOn.value = 0;
    await measure('CLAY_OFF_PR_1_0');

    if (U.uClayOn) U.uClayOn.value = 1;
    resizeAt(0.5);
    await measure('CLAY_ON_PR_0_5');
    if (U.uClayOn) U.uClayOn.value = 0;
    await measure('CLAY_OFF_PR_0_5');
  } finally {
    resizeAt(original.pixelRatio);
    if (U.uClayOn) U.uClayOn.value = original.clayOn;
    for (const [k,v] of Object.entries(original.flags)) U[k].value = v;
    api.set('mode', original.mode);
  }

  const byLabel = Object.fromEntries(rows.map((r) => [r.label, r]));
  const base = byLabel.CLAY_DEFAULT?.meanFrameMs || 0;
  const clayOff = byLabel.CLAY_OFF_PR_ORIGINAL?.meanFrameMs || 0;
  const result = {
    schema: 'kfb.world-corridor.clay-parts/0.1',
    measuredAt: new Date().toISOString(),
    hardware: rows[0]?.renderer || null,
    device: rows[0]?.device || null,
    originalPixelRatio: original.pixelRatio,
    rows,
    savingsFromDefault: Object.fromEntries(rows.slice(1,8).map((r) => [
      r.label,
      {
        fps: r.fps,
        meanFrameMs: r.meanFrameMs,
        savedMs: round(base - r.meanFrameMs),
        savedPct: base ? round((base - r.meanFrameMs) / base * 100, 1) : 0,
      }
    ])),
    clayCostAtOriginalPixelRatioMs: round(base - clayOff),
    pixelRatioPairs: {
      original: {
        ratio: original.pixelRatio,
        onMs: byLabel.CLAY_DEFAULT?.meanFrameMs || null,
        offMs: byLabel.CLAY_OFF_PR_ORIGINAL?.meanFrameMs || null,
      },
      ratio1: {
        ratio: 1,
        onMs: byLabel.CLAY_ON_PR_1_0?.meanFrameMs || null,
        offMs: byLabel.CLAY_OFF_PR_1_0?.meanFrameMs || null,
      },
      ratio05: {
        ratio: 0.5,
        onMs: byLabel.CLAY_ON_PR_0_5?.meanFrameMs || null,
        offMs: byLabel.CLAY_OFF_PR_0_5?.meanFrameMs || null,
      },
    },
  };
  window.__KFB_WC1_BASELINE__.clayParts = result;
  window.__KFB_WC1_BASELINE__.last = result;
  window.dispatchEvent(new CustomEvent('kfb-wc1-clay-parts-result', { detail: result }));
  return result;
}


export async function measureGlobalClayLite({
  warmupMs = 900,
  sampleMs = 4000,
} = {}) {
  const api = await waitForR2C();
  if (!api.setGlobalClayLite || !api.setProceduralClay || !api.setClayOff) {
    throw new Error('Global-Clay-Test braucht die neue WorldBuilder-Diagnoseversion.');
  }
  if (document.visibilityState !== 'visible') throw new Error('Bitte den Chrome-Tab während der Messung sichtbar lassen.');
  const rows = [];
  const measure = async (label, extra = {}) => {
    const row = await measureWorldCorridorBaseline({ warmupMs, sampleMs, label });
    Object.assign(row, extra);
    rows.push(row);
    return row;
  };
  try {
    api.set('mode', 'B');
    api.setProceduralClay();
    await measure('PROCEDURAL_CLAY_REFERENCE', { look: 'procedural' });

    const a = await api.setGlobalClayLite('Clay002', 512);
    await measure('GLOBAL_CLAY_Clay002_512', { look: 'global-clay-lite', globalClay: a });

    const b = await api.setGlobalClayLite('clay_floor_001', 512);
    await measure('GLOBAL_CLAY_clay_floor_001_512', { look: 'global-clay-lite', globalClay: b });

    api.setClayOff();
    await measure('CLAY_OFF_REFERENCE', { look: 'clay-off' });
  } finally {
    api.setProceduralClay();
  }

  const base = rows[0]?.meanFrameMs || 0;
  const result = {
    schema: 'kfb.world-corridor.global-clay-lite/0.1',
    measuredAt: new Date().toISOString(),
    rows,
    deltasFromProcedural: Object.fromEntries(rows.slice(1).map((r) => [
      r.label,
      {
        fps: r.fps,
        meanFrameMs: r.meanFrameMs,
        savedMs: round(base - r.meanFrameMs),
        savedPct: base ? round((base - r.meanFrameMs) / base * 100, 1) : 0,
      }
    ])),
    note: 'Global Clay Lite uses one 512² packed shared RGBA texture at a time; source asset colour remains authoritative.'
  };
  window.__KFB_WC1_BASELINE__.globalClayLite = result;
  window.__KFB_WC1_BASELINE__.last = result;
  window.dispatchEvent(new CustomEvent('kfb-wc1-global-clay-result', { detail: result }));
  return result;
}


export async function measureDerekComparison({
  warmupMs = 900,
  sampleMs = 4000,
} = {}) {
  const api = await waitForR2C();
  if (!api.setGlobalClayLite || !api.setDerekRgb || !api.setProceduralClay || !api.setClayOff) {
    throw new Error('Materialvergleich braucht die aktuelle WorldBuilder-Diagnoseversion.');
  }
  if (document.visibilityState !== 'visible') throw new Error('Bitte den Chrome-Tab während der Messung sichtbar lassen.');
  const rows = [];
  const measure = async (label, extra = {}) => {
    const row = await measureWorldCorridorBaseline({ warmupMs, sampleMs, label });
    Object.assign(row, extra);
    rows.push(row);
    return row;
  };
  try {
    api.set('mode', 'B');

    api.setProceduralClay();
    await measure('PROCEDURAL_CLAY_REFERENCE', { look: 'procedural' });

    const clay = await api.setGlobalClayLite('Clay002', 512);
    await measure('GLOBAL_CLAY_Clay002_512', { look: 'global-clay-lite', globalClay: clay });

    const derek = await api.setDerekRgb(512);
    await measure('DEREK_RGB_512', { look: 'derek-rgb', derek });

    api.setClayOff();
    await measure('CLAY_OFF_REFERENCE', { look: 'clay-off' });
  } finally {
    api.setProceduralClay();
  }

  const base = rows[0]?.meanFrameMs || 0;
  const result = {
    schema: 'kfb.world-corridor.derek-comparison/0.1',
    measuredAt: new Date().toISOString(),
    rows,
    deltasFromProcedural: Object.fromEntries(rows.slice(1).map((r) => [
      r.label,
      {
        fps: r.fps,
        meanFrameMs: r.meanFrameMs,
        savedMs: round(base - r.meanFrameMs),
        savedPct: base ? round((base - r.meanFrameMs) / base * 100, 1) : 0,
      }
    ])),
    note: 'One-texture comparison: Clay002 packed RGBA vs pinned WorldDesign Lab Derek RGB tile, both at 512².'
  };
  window.__KFB_WC1_BASELINE__.derekComparison = result;
  window.__KFB_WC1_BASELINE__.last = result;
  window.dispatchEvent(new CustomEvent('kfb-wc1-derek-comparison-result', { detail: result }));
  return result;
}

window.__KFB_WC1_BASELINE__ = {
  schema: 'kfb.world-corridor.performance-probe/0.1',
  measure: measureWorldCorridorBaseline,
  measureCostSplit: measureWorldCorridorCostSplit,
  measureClayParts,
  measureGlobalClayLite,
  measureDerekComparison,
  last: null,
  costSplit: null,
  clayParts: null,
  globalClayLite: null,
  derekComparison: null,
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
  const stem = result?.schema?.includes('derek-comparison') ? 'kfb-clay002-vs-derek' : result?.schema?.includes('global-clay-lite') ? 'kfb-global-clay-lite' : result?.schema?.includes('clay-parts') ? 'kfb-clay-bausteine' : result?.schema?.includes('cost-split') ? 'kfb-wc1-cost-split' : 'kfb-wc1-gpu-baseline';
  a.download = `${stem}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
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
      <button data-role="measure" type="button">Measure 10s</button>\n      <button data-role="costsplit" type="button">Measure cost split</button>\n      <button data-role="clayparts" type="button">Clay-Bausteine messen</button>
      <button data-role="globalclay" type="button">Globale Textur messen</button>
      <button data-role="derekcompare" type="button">Clay002 vs Derek messen</button>
      <button data-role="copy" type="button" disabled>Copy JSON</button>
      <button data-role="download" type="button" disabled>Download JSON</button>
      <button data-role="showproc" type="button">Zeige aktuelles Clay</button>
      <button data-role="showa" type="button">Zeige Clay002</button>
      <button data-role="showb" type="button">Zeige clay_floor</button>
      <button data-role="showderek" type="button">Zeige Derek RGB</button>
      <button data-role="showoff" type="button">Zeige Clay aus</button>
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
  const costSplit = panel.querySelector('[data-role="costsplit"]');
  const clayParts = panel.querySelector('[data-role="clayparts"]');
  const globalClay = panel.querySelector('[data-role="globalclay"]');
  const derekCompare = panel.querySelector('[data-role="derekcompare"]');
  const showProc = panel.querySelector('[data-role="showproc"]');
  const showA = panel.querySelector('[data-role="showa"]');
  const showB = panel.querySelector('[data-role="showb"]');
  const showDerek = panel.querySelector('[data-role="showderek"]');
  const showOff = panel.querySelector('[data-role="showoff"]');
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

  costSplit.onclick = async () => {
    measure.disabled = true; costSplit.disabled = true; copy.disabled = true; download.disabled = true;
    state.textContent = 'cost split…';
    result.textContent = 'Five automatic passes: default · clay off · clouds off · shadows off · pixel ratio 1. Keep this tab visible.';
    try {
      const suite = await measureWorldCorridorCostSplit({ warmupMs: 900, sampleMs: 4000 });
      const lines = suite.rows.map((r) => `${r.label}: ${r.fps} fps · ${r.meanFrameMs} ms · ${r.drawCalls} calls · ${Math.round(r.triangles/1000)}k tris`);
      result.textContent = lines.join('\n');
      state.textContent = 'cost split measured';
      window.__KFB_WC1_BASELINE__.last = suite;
      copy.disabled = false; download.disabled = false;
    } catch (err) {
      state.textContent = 'failed';
      result.textContent = String(err?.message || err);
    } finally {
      measure.disabled = false; costSplit.disabled = false;
    }
  };

  clayParts.onclick = async () => {
    measure.disabled = true; costSplit.disabled = true; clayParts.disabled = true; copy.disabled = true; download.disabled = true;
    state.textContent = 'Clay-Bausteine…';
    result.textContent = 'Automatische Messung: Grundrelief · Dellen/Kerben/Risse · Fingerabdrücke · Facetten/Falten · Farbunruhe · Auflösung. Bitte Tab sichtbar lassen.';
    try {
      const suite = await measureClayParts({ warmupMs: 700, sampleMs: 3000 });
      const lines = suite.rows.map((r) => `${r.label}: ${r.fps} fps · ${r.meanFrameMs} ms`);
      result.textContent = lines.join('\n');
      state.textContent = 'Clay-Bausteine gemessen';
      copy.disabled = false; download.disabled = false;
    } catch (err) {
      state.textContent = 'fehlgeschlagen';
      result.textContent = String(err?.message || err);
    } finally {
      measure.disabled = false; costSplit.disabled = false; clayParts.disabled = false;
    }
  };

  globalClay.onclick = async () => {
    measure.disabled = true; costSplit.disabled = true; clayParts.disabled = true; globalClay.disabled = true; copy.disabled = true; download.disabled = true;
    state.textContent = 'Globale Textur…';
    result.textContent = 'Vier Durchläufe: aktuelles Clay · Clay002 512² · clay_floor_001 512² · Clay aus. Bitte Tab sichtbar lassen.';
    try {
      const suite = await measureGlobalClayLite({ warmupMs: 900, sampleMs: 4000 });
      result.textContent = suite.rows.map((r) => `${r.label}: ${r.fps} fps · ${r.meanFrameMs} ms · ${r.textures} textures`).join('\n');
      state.textContent = 'Globale Textur gemessen';
      copy.disabled = false; download.disabled = false;
    } catch (err) {
      state.textContent = 'fehlgeschlagen';
      result.textContent = String(err?.message || err);
    } finally {
      measure.disabled = false; costSplit.disabled = false; clayParts.disabled = false; globalClay.disabled = false;
    }
  };

  derekCompare.onclick = async () => {
    measure.disabled = true; costSplit.disabled = true; clayParts.disabled = true; globalClay.disabled = true; derekCompare.disabled = true; copy.disabled = true; download.disabled = true;
    state.textContent = 'Clay002 vs Derek…';
    result.textContent = 'Vier Durchläufe: aktuelles Clay · Clay002 512² · Derek RGB 512² · Clay aus. Bitte Tab sichtbar lassen.';
    try {
      const suite = await measureDerekComparison({ warmupMs: 900, sampleMs: 4000 });
      result.textContent = suite.rows.map((r) => `${r.label}: ${r.fps} fps · ${r.meanFrameMs} ms · ${r.textures} textures`).join('\n');
      state.textContent = 'Clay002 vs Derek gemessen';
      copy.disabled = false; download.disabled = false;
    } catch (err) {
      state.textContent = 'fehlgeschlagen';
      result.textContent = String(err?.message || err);
    } finally {
      measure.disabled = false; costSplit.disabled = false; clayParts.disabled = false; globalClay.disabled = false; derekCompare.disabled = false;
    }
  };

  const showLook = async (fn, label) => {
    state.textContent = label + '…';
    try { await fn(); state.textContent = label; }
    catch (err) { state.textContent = 'fehlgeschlagen'; result.textContent = String(err?.message || err); }
  };
  showProc.onclick = () => showLook(async () => { const a = await waitForR2C(); a.setProceduralClay(); }, 'aktuelles Clay');
  showA.onclick = () => showLook(async () => { const a = await waitForR2C(); await a.setGlobalClayLite('Clay002', 512); }, 'Clay002 512²');
  showB.onclick = () => showLook(async () => { const a = await waitForR2C(); await a.setGlobalClayLite('clay_floor_001', 512); }, 'clay_floor 512²');
  showDerek.onclick = () => showLook(async () => { const a = await waitForR2C(); await a.setDerekRgb(512); }, 'Derek RGB 512²');
  showOff.onclick = () => showLook(async () => { const a = await waitForR2C(); a.setClayOff(); }, 'Clay aus');

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
