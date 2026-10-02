// BILLBOARD-CONTEXT-WORLDLOOK-01
// Bridges already-proven Consumer-01 WorldContext into the new K2 physical-body seam.
// No palette derivation occurs here: accent is consumed verbatim from Travel WorldContext.

const params = new URLSearchParams(location.search);
const auto = params.get('worldLook') !== 'off';
const report = {
  slice: 'BILLBOARD_CONTEXT_WORLDLOOK_01_2026-10-02',
  auto,
  ready: false,
  applied: false,
  accent: null,
  seed: null,
  result: null,
  errors: []
};
window.__WORLDLOOK01_REPORT__ = report;

async function waitForReady(timeoutMs = 150000) {
  const started = performance.now();
  while (performance.now() - started < timeoutMs) {
    const c = window.__consumer01?.snapshot?.();
    if (c?.ready && window.__r11?.snapshot?.()?.ready && typeof window.__r11?.setWorldLook === 'function') return c;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('Consumer/R11 worldlook prerequisites not ready');
}

async function applyFromConsumer() {
  const c = await waitForReady();
  const accent = c.worldContext?.accent;
  const seed = c.worldContext?.seed;
  if (!accent || !Number.isInteger(seed)) throw new Error('WorldContext accent/seed missing');
  const result = await window.__r11.setWorldLook({ accent, seed });
  report.applied = true;
  report.accent = accent;
  report.seed = seed;
  report.result = result;
  report.ready = true;
  document.documentElement.dataset.worldlook01Ready = '1';
  return structuredClone(report);
}

async function boot() {
  try {
    const c = await waitForReady();
    report.accent = c.worldContext?.accent || null;
    report.seed = c.worldContext?.seed ?? null;
    if (auto) await applyFromConsumer();
    else {
      report.ready = true;
      document.documentElement.dataset.worldlook01Ready = '1';
    }
  } catch (e) {
    report.errors.push(String(e && e.stack || e));
    document.documentElement.dataset.worldlook01Ready = '0';
    console.error('[worldlook01]', e);
  }
}

window.__worldlook01 = {
  report,
  apply: applyFromConsumer,
  snapshot() { return structuredClone(report); }
};

boot();
