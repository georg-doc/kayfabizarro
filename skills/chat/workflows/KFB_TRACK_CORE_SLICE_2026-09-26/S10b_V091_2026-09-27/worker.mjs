// Track Builder worker: compiles a recipe with the Track Core and runs its checks off the main thread.
// A recipe that uses graph macros (PIT_LANE) is compiled as a one-route graph; branches come back as extra routes.
import { compileRecipe, runChecks, compileGraph, runGraphChecks, CORE_VERSION } from './track-core.mjs';

const GRAPH_TYPES = new Set(['PIT_LANE']);
const slim = (st) => ({
  samples: st.samples.map((q) => ({ s: q.s, p: q.p, T: q.T, U: q.U, R: q.R, slots: q.slots, prm: q.prm, paint: q.paint, tunnel: q.tunnel, brk: q.brk, law: q.law, tags: q.tags })),
  markings: st.markings, joints: st.joints, tunnels: st.tunnels, tunnelRings: st.tunnelRings, anchors: st.anchors, fingerprint: st.fingerprint,
});

self.onmessage = (ev) => {
  const { id, recipe } = ev.data;
  const t0 = performance.now();
  const isGraph = recipe.pieces.some((p) => GRAPH_TYPES.has(p.type));
  let out;
  try {
    if (isGraph) {
      const { pieces, start, defaults, id: rid, ...rest } = recipe;
      out = compileGraph({ ...rest, id: rid ?? 'BUILDER', defaults, routes: [{ id: 'M', start, pieces }] });
    } else out = compileRecipe(recipe);
  } catch (e) {
    self.postMessage({ id, kind: 'error', message: String(e && e.message || e) });
    return;
  }
  const t1 = performance.now();
  const stream = isGraph ? { routes: Object.fromEntries(Object.entries(out.routes).map(([k, r]) => [k, slim(r)])) } : slim(out);
  self.postMessage({ id, kind: 'stream', core: CORE_VERSION, ms: t1 - t0, graph: isGraph, stream });
  let results = [];
  try {
    if (isGraph) {
      const rc = runGraphChecks(out);
      for (const [k, r] of Object.entries(rc.routes)) for (const c of r.results) results.push(k === 'M' ? c : { ...c, route: k, note: `[${k}] ${c.note ?? ''}` });
      results.push(...rc.results.map((c) => ({ ...c, note: `[Graph] ${c.note ?? ''}` })));
    } else results = runChecks(out).results;
  } catch (e) { results = [{ id: 'checks', pass: false, value: null, note: String(e && e.message || e), severity: 'error' }]; }
  self.postMessage({ id, kind: 'checks', ms: performance.now() - t1, results });
};
