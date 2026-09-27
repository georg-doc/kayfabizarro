// Track Builder worker: compiles a recipe with the Track Core and runs its checks off the main thread.
import { compileRecipe, runChecks, CORE_VERSION } from './track-core.mjs';

self.onmessage = (ev) => {
  const { id, recipe } = ev.data;
  const t0 = performance.now();
  let stream;
  try {
    stream = compileRecipe(recipe);
  } catch (e) {
    self.postMessage({ id, kind: 'error', message: String(e && e.message || e) });
    return;
  }
  const t1 = performance.now();
  // slim sample copy: only what the viewer draws
  const samples = stream.samples.map((q) => ({ s: q.s, p: q.p, T: q.T, U: q.U, R: q.R, slots: q.slots, prm: q.prm, paint: q.paint, tunnel: q.tunnel, brk: q.brk, law: q.law }));
  self.postMessage({ id, kind: 'stream', core: CORE_VERSION, ms: t1 - t0,
    stream: { samples, markings: stream.markings, joints: stream.joints, tunnels: stream.tunnels, tunnelRings: stream.tunnelRings, fingerprint: stream.fingerprint } });
  let results = [];
  try { results = runChecks(stream).results; } catch (e) { results = [{ id: 'checks', pass: false, value: null, note: String(e && e.message || e), severity: 'error' }]; }
  self.postMessage({ id, kind: 'checks', ms: performance.now() - t1, results });
};
