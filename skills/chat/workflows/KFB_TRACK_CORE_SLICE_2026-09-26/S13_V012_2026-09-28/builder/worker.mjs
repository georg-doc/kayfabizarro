// Track Builder worker: compiles a recipe with the Track Core and runs its checks off the main thread.
// A recipe that uses graph macros (PIT_LANE, WEICHE) is compiled as a one-route graph; branches come back as extra routes,
// the junction modules' deck layer (gore, apron, walls, garages, caps) comes back as stream.deck.
// v0.10 comparison: `core: 'old'` compiles the same recipe with the frozen v0.9.1 core (a WEICHE becomes the old FORK).
// v0.12: a ROUNDABOUT piece makes the recipe a graph too. The main route then runs M -> node path -> M+<node> ...; the
// worker joins these into stream.chain (one sample list with continuous s and the joints of all parts) for selection,
// driver view and check markers. The node data itself comes back as stream.nodes.
import * as NEW from './track-core.mjs';
import * as OLD from './track-core-v091.mjs';

const slim = (st) => ({
  samples: st.samples.map((q) => ({ s: q.s, p: q.p, T: q.T, U: q.U, R: q.R, slots: q.slots, prm: q.prm, paint: q.paint, tunnel: q.tunnel, brk: q.brk, law: q.law, tags: q.tags, zone: q.zone, biome: q.biome })),
  markings: st.markings, joints: st.joints, tunnels: st.tunnels, tunnelRings: st.tunnelRings, anchors: st.anchors, transitions: st.transitions, fingerprint: st.fingerprint,
});

// the old core has no WEICHE: widen-and-halve FORK with the branch continuing on its own
function toOld(recipe) {
  const branches = [];
  const pieces = recipe.pieces.map((pc) => {
    if (pc.type === 'TRANSITION') return { id: pc.id, type: 'STRAIGHT', length: pc.length ?? 80 };   // v0.9.1 has no zones
    if (pc.type === 'ROUNDABOUT') return { id: pc.id, type: 'STRAIGHT', length: 60 };                  // v0.9.1 has no nodes
    if (pc.type !== 'WEICHE') return pc;
    const side = pc.side ?? -1;
    branches.push({ id: pc.id, from: { route: 'M', piece: pc.id }, pieces: pc.then ?? [{ id: `${pc.id}_lane`, type: 'STRAIGHT', length: pc.branchLength ?? 150 }] });
    return { id: pc.id, type: 'FORK', keep: -side, fullWidth: 'HERO_XL', length: pc.taper ?? 60 };
  });
  return { pieces, branches };
}

function chainOf(g) {
  const ch = g.chains?.M; if (!ch) return null;
  const samples = [], joints = [];
  for (const seg of ch) {
    if (seg.route) { const r = g.routes[seg.route], off = samples.length; for (const j of r.joints) joints.push({ ...j, index: j.index + off }); samples.push(...slim(r).samples); continue; }
    const nb = g.nodes.find((n) => n.id === seg.node), P = nb.main, W = nb.arms.find((a) => a.id === nb.enter)?.width ?? 14.4;
    joints.push({ index: samples.length, piece: seg.node, type: 'ROUNDABOUT', s: seg.s0 });
    let s = seg.s0;
    P.pts.forEach((p, i) => { if (i) s += Math.hypot(p[0] - P.pts[i - 1][0], p[2] - P.pts[i - 1][2]);
      const a = P.pts[Math.max(0, i - 1)], b = P.pts[Math.min(P.pts.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[2] - a[2]) || 1, T = [(b[0] - a[0]) / l, 0, (b[2] - a[2]) / l];
      samples.push({ s, p, T, U: [0, 1, 0], R: [-T[2], 0, T[0]], prm: { width: W, offset: 0, surface: 1 }, tags: ['ROUNDABOUT', 'node_path'] }); });
  }
  return { samples, joints };
}
self.onmessage = (ev) => {
  const { id, recipe } = ev.data, old = ev.data.core === 'old', C = old ? OLD : NEW;
  const GRAPH_TYPES = new Set(old ? ['PIT_LANE', 'FORK', 'WEICHE'] : ['PIT_LANE', 'WEICHE', 'ROUNDABOUT']);
  const t0 = performance.now();
  const isGraph = recipe.pieces.some((p) => GRAPH_TYPES.has(p.type));
  let out;
  try {
    if (isGraph) {
      const { pieces, start, defaults, id: rid, ...rest } = recipe;
      const o = old ? toOld(recipe) : { pieces, branches: [] };
      out = C.compileGraph({ ...rest, id: rid ?? 'BUILDER', defaults, routes: [{ id: 'M', start, pieces: o.pieces }, ...o.branches] });
    } else out = C.compileRecipe(old ? { ...recipe, pieces: toOld(recipe).pieces } : recipe);
  } catch (e) {
    self.postMessage({ id, kind: 'error', message: String(e && e.message || e) });
    return;
  }
  const t1 = performance.now();
  const stream = isGraph ? { routes: Object.fromEntries(Object.entries(out.routes).map(([k, r]) => [k, slim(r)])), deck: out.deck, nodes: out.nodes, sockets: out.sockets, chain: chainOf(out) } : slim(out);
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
