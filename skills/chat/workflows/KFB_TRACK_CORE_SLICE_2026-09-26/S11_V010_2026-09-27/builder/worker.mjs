// Track Builder worker: compiles a recipe with the Track Core and runs its checks off the main thread.
// A recipe that uses graph macros (PIT_LANE, WEICHE) is compiled as a one-route graph; branches come back as extra routes,
// the junction modules' deck layer (gore, apron, walls, garages, caps) comes back as stream.deck.
// v0.10 comparison: `core: 'old'` compiles the same recipe with the frozen v0.9.1 core (a WEICHE becomes the old FORK).
import * as NEW from './track-core.mjs';
import * as OLD from './track-core-v091.mjs';

const slim = (st) => ({
  samples: st.samples.map((q) => ({ s: q.s, p: q.p, T: q.T, U: q.U, R: q.R, slots: q.slots, prm: q.prm, paint: q.paint, tunnel: q.tunnel, brk: q.brk, law: q.law, tags: q.tags })),
  markings: st.markings, joints: st.joints, tunnels: st.tunnels, tunnelRings: st.tunnelRings, anchors: st.anchors, fingerprint: st.fingerprint,
});

// the old core has no WEICHE: widen-and-halve FORK with the branch continuing on its own
function toOld(recipe) {
  const branches = [];
  const pieces = recipe.pieces.map((pc) => {
    if (pc.type !== 'WEICHE') return pc;
    const side = pc.side ?? -1;
    branches.push({ id: pc.id, from: { route: 'M', piece: pc.id }, pieces: pc.then ?? [{ id: `${pc.id}_lane`, type: 'STRAIGHT', length: pc.branchLength ?? 150 }] });
    return { id: pc.id, type: 'FORK', keep: -side, fullWidth: 'HERO_XL', length: pc.taper ?? 60 };
  });
  return { pieces, branches };
}

self.onmessage = (ev) => {
  const { id, recipe } = ev.data, old = ev.data.core === 'old', C = old ? OLD : NEW;
  const GRAPH_TYPES = new Set(old ? ['PIT_LANE', 'FORK', 'WEICHE'] : ['PIT_LANE', 'WEICHE']);
  const t0 = performance.now();
  const isGraph = recipe.pieces.some((p) => GRAPH_TYPES.has(p.type));
  let out;
  try {
    if (isGraph) {
      const { pieces, start, defaults, id: rid, ...rest } = recipe;
      const o = old ? toOld(recipe) : { pieces, branches: [] };
      out = C.compileGraph({ ...rest, id: rid ?? 'BUILDER', defaults, routes: [{ id: 'M', start, pieces: o.pieces }, ...o.branches] });
    } else out = C.compileRecipe(recipe);
  } catch (e) {
    self.postMessage({ id, kind: 'error', message: String(e && e.message || e) });
    return;
  }
  const t1 = performance.now();
  const stream = isGraph ? { routes: Object.fromEntries(Object.entries(out.routes).map(([k, r]) => [k, slim(r)])), deck: out.deck } : slim(out);
  self.postMessage({ id, kind: 'stream', core: C.CORE_VERSION, ms: t1 - t0, graph: isGraph, stream });
  let results = [];
  try {
    if (isGraph) {
      const rc = C.runGraphChecks(out);
      for (const [k, r] of Object.entries(rc.routes)) for (const c of r.results) results.push(k === 'M' ? c : { ...c, route: k, note: `[${k}] ${c.note ?? ''}` });
      results.push(...rc.results.map((c) => ({ ...c, note: `[Graph] ${c.note ?? ''}` })));
    } else results = C.runChecks(out).results;
  } catch (e) { results = [{ id: 'checks', pass: false, value: null, note: String(e && e.message || e), severity: 'error' }]; }
  self.postMessage({ id, kind: 'checks', ms: performance.now() - t1, results });
};
