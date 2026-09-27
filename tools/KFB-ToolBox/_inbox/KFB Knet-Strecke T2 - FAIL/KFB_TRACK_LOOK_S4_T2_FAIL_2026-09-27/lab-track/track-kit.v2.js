/* KFB track-kit v2 (27.09.) — Bausteine für den Knet-Look auf dem Track-Core-Stream. Bühne: track-look.v2.js.
 * Neu gegenüber track-look.v1:
 *   · Fugen als deterministische Knetflecken (Shader über s, u); kein Alpha, kein Farbverlauf. Wechselt das Ereignis
 *     zwischen zwei Samples, wird die Reihe doppelt angelegt, damit keine Farbe über ein Viereck verwischt.
 *   · Zustände je Rolle und Seite: Skin (Stream), Tunnel (Servicestreifen), Zone (Kies/Sand/Gras auf der Schulter)
 *   · Kerb je Skin (Form und Höhe), im Tunnel als Servicestreifen
 *   · Tunnel mountain: Innenwand aus stream.tunnelRings, Kragen nach Ring, Stirnwand, Berg, Einschnitt
 *   · Kanten-Atlas: Profil aus prm nachgerechnet (Core-Formel), Überschreibungen als Vorschlag
 * Fahrbahn road_L..road_R wird nie verformt. */
import { makeClayMaterial, seedGeometry, PROFILES } from '../lab-clay/clay-material.v8.js';

export const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
export const lump = (s, key) => 0.65 * vnoise(s / 14 + key * 17.31) + 0.35 * vnoise(s / 5.5 + key * 5.13) - 0.5;
const lerp2 = (A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
export const W3 = (q, l, h) => [q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h];

// ---------- Profil aus prm (nachgerechnet, geprüft gegen Stream-Slots; barrierVis < 1 ist NICHT nachgebildet) ----------
export function profileSlots(prm) {
  const h = prm.width / 2, o = prm.offset || 0, sw = prm.shoulderW, gap = prm.barrierGap, T = prm.barrierT, dd = prm.deckDepth;
  const L = s => -1, side = (sg, sc) => {
    const r = h, sh = r + sw * sc, ib = sh + gap * sc, ob = ib + T * sc, dr = prm.shoulderDrop * sc;   // Seitenfaktor wirkt auch auf den Abfall
    return { road: [o + sg * r, 0], sh: [o + sg * sh, -dr], ib: [o + sg * ib, -dr], it: [o + sg * ib, prm.barrierH], ot: [o + sg * ob, prm.barrierOuterTop], obt: [o + sg * ob, -dd / 2], un: [o + sg * ob, -dd] };
  };
  const l = side(-1, prm.sideL ?? 1), r = side(1, prm.sideR ?? 1);
  return [l.un, l.obt, l.ot, l.it, l.ib, l.sh, l.road, r.road, r.sh, r.ib, r.it, r.ot, r.obt, r.un];
}

// ---------- Material mit Knetflecken ----------
const PATCH_V = /* glsl */`
attribute vec3 aA; attribute vec3 aA2; attribute vec3 aB; attribute vec3 aB2; attribute vec4 aS; attribute vec4 aM;
varying vec3 vKA; varying vec3 vKA2; varying vec3 vKB; varying vec3 vKB2; varying vec4 vKS; varying vec4 vKM;
`;
const PATCH_F = /* glsl */`
uniform float uPatchCell, uPatchDebug, uPatchRim;
varying vec3 vKA; varying vec3 vKA2; varying vec3 vKB; varying vec3 vKB2; varying vec4 vKS; varying vec4 vKM;
vec2 kfbH2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
vec3 kfbSurf(vec3 c, vec3 c2, float L, float mode, vec2 su){
  if (mode > 1.5) {
    vec2 x = su / L, b = floor(x); float d1 = 9.0, h = 0.0;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 cc = b + vec2(float(i), float(j)); vec2 p = cc + 0.2 + 0.6 * kfbH2(cc); float d = length(x - p); if (d < d1) { d1 = d; h = kfbH2(cc + 7.0).x; } }
    vec3 col = h > 0.5 ? c2 : c; col *= 0.9 + 0.2 * fract(h * 7.13); col *= 1.0 - 0.22 * smoothstep(0.36, 0.52, d1);
    return col;
  }
  if (mode > 0.5) return mod(floor(su.x / L), 2.0) < 0.5 ? c : c2;
  return c;
}
float kfbPatchV(vec2 su, float cell){
  vec2 x = su / cell, b = floor(x); float best = 9.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 cc = b + vec2(float(i), float(j)); vec2 p = cc + 0.15 + 0.7 * kfbH2(cc);
    float h = kfbH2(cc + 3.0).x; vec2 dv = (x - p) * vec2(1.0, 1.3); float v = h * 0.75 + 0.35 * length(dv); best = min(best, v); }
  return best;
}
`;
const PATCH_APPLY = /* glsl */`
{ vec3 cA = kfbSurf(vKA, vKA2, vKM.x, vKM.y, vKS.xy), cB = kfbSurf(vKB, vKB2, vKM.z, vKM.w, vKS.xy);
  float t = vKS.w > vKS.z ? smoothstep(vKS.z, vKS.w, vKS.x) : 0.0;
  vec3 c = cA; float rim = 0.0, th = t * 1.1, on = 0.0;
  if (t > 0.999) { c = cB; on = 1.0; }
  else if (t > 0.001) { float v = kfbPatchV(vKS.xy, uPatchCell); on = v < th ? 1.0 : 0.0; c = on > 0.5 ? cB : cA; rim = 1.0 - smoothstep(0.0, 0.03, abs(v - th)); }
  c *= 1.0 - uPatchRim * rim;
  if (uPatchDebug > 0.5) { c = on > 0.5 ? vec3(0.8) : vec3(0.2); if (vKS.w > vKS.z && vKS.x > vKS.z && vKS.x < vKS.w) c = mix(c, vec3(0.95, 0.2, 0.25), rim); }
  diffuseColor.rgb = c; }
`;
export function makePatchMaterial(THREE, U, PU, { role = 'world', profile, cell = 1, side = null }) {
  const m = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff' }), role, profile, side });
  const prev = m.onBeforeCompile, C = { value: cell };
  m.onBeforeCompile = (sh, r) => {
    prev(sh, r);
    Object.assign(sh.uniforms, PU, { uPatchCell: C });
    sh.vertexShader = PATCH_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vKA = aA; vKA2 = aA2; vKB = aB; vKB2 = aB2; vKS = aS; vKM = aM;');
    sh.fragmentShader = PATCH_F + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + PATCH_APPLY);
  };
  m.customProgramCacheKey = () => 'kfb-clay-v8-patch2';
  m.userData.patchCell = C;
  return m;
}

// ---------- Zustände je Rolle/Seite über s ----------
const colState = (THREE, def, O) => {                  // → {a, a2, L, mode}
  const lin = h => new THREE.Color(h);
  if (!def) return { a: lin('#ff00ff'), a2: lin('#ff00ff'), L: 1, mode: 0 };
  if (def.mode === 'grain') return { a: lin(def.c), a2: lin(def.c2), L: def.cell, mode: 2 };
  const c = def.c ?? def;
  if (Array.isArray(c)) return { a: lin(c[0]), a2: lin(c[1]), L: def.L ?? O.stripeLen ?? 3, mode: 1 };
  return { a: lin(c), a2: lin(c), L: 1, mode: 0 };
};
export function makeStates(THREE, route, O, SK, zones = []) {
  const S = route.samples, ds = route.ds;
  const idx = s => Math.max(0, Math.min(S.length - 1, Math.round(s / ds)));
  const tun = (route.tunnels || []).filter(t => t.kind === 'tube').map(t => ({ s0: S[t.i0].s, s1: S[t.i1].s, host: t.host }));
  const inTun = s => tun.some(t => s >= t.s0 && s <= t.s1);
  const zoneAt = (role, side, s) => zones.find(z => (z.role || 'shoulder') === role && (z.side === side || z.side === 'both') && s >= z.s0 && s <= z.s1);
  const cache = new Map();
  const cs = (key, def, L) => { const k = key + (L ?? ''); if (!cache.has(k)) cache.set(k, colState(THREE, L ? { c: def.c ?? def, L } : def, O)); return cache.get(k); };
  const settled = (role, side, s) => {
    const q = S[idx(s)];
    const z = zoneAt(role, side, s);
    if (z) { const id = 'z:' + role + ':' + (z.surface || z.key); return { key: id, st: cs(id, z.surface ? SK.surfaces[z.surface] : z.def, z.L) }; }
    if ((role === 'kerb' || role === 'shoulder') && O.tunnelEdge && inTun(s)) return { key: 't:' + role, st: cs('t:' + role, { c: O.tunnelEdge[role] }) };
    const def = O.skins[q.skin]?.[role] ?? O.skins.track[role];
    const L = role === 'barrier_side' && Array.isArray(def.c) ? (O.blocks?.len ?? 4) : undefined;
    return { key: q.skin + ':' + role, st: cs(q.skin + ':' + role, def, L) };
  };
  // Ereignisse: Skin-Fugen (alle Rollen), Tunnel (Kerb/Schulter), Zonen (Schulter, seitenweise)
  const ev = [];
  for (let i = 1; i < S.length; i++) if (S[i].skin !== S[i - 1].skin) ev.push({ s: S[i].s, kind: 'skin', id: 'k' + i });
  for (const t of tun) { ev.push({ s: t.s0, kind: 'tunnel', id: 'ti' + t.s0 }); ev.push({ s: t.s1, kind: 'tunnel', id: 'to' + t.s1 }); }
  zones.forEach((z, n) => { const role = z.role || 'shoulder'; ev.push({ s: z.s0, kind: 'zone', side: z.side, role, id: 'zi' + n }); ev.push({ s: z.s1, kind: 'zone', side: z.side, role, id: 'zo' + n }); });
  const winOf = (e, role) => e.kind === 'skin' ? (SK.stagger[role] ?? SK.stagger.road) : e.kind === 'tunnel' ? SK.stagger.tunnel : (e.role === 'kerb' && SK.stagger.kerbZone) ? SK.stagger.kerbZone : SK.stagger.zone;   // gemalter Kerb beginnt sauber auf einer Streifengrenze
  const applies = (e, role, side) => e.kind === 'skin' || (e.kind === 'tunnel' && (role === 'kerb' || role === 'shoulder')) || (e.kind === 'zone' && role === e.role && (e.side === side || e.side === 'both'));
  const lists = new Map();
  const listFor = (role, side) => { const k = role + side; if (!lists.has(k)) lists.set(k, ev.filter(e => applies(e, role, side)).map(e => { const w = winOf(e, role); return { ...e, w0: e.s + w[0], w1: e.s + w[1] }; }).sort((a, b) => a.w0 - b.w0)); return lists.get(k); };
  // Zustand an s: letztes Ereignis, dessen Fenster begonnen hat
  const at = (role, side, s) => {
    const L = listFor(role, side); let e = null;
    for (const x of L) { if (x.w0 <= s) e = x; else break; }
    if (!e) { const z = settled(role, side, s); return { key: 'n:' + z.key, A: z.st, B: z.st, w0: 0, w1: 0 }; }
    const a = settled(role, side, e.w0 - 0.01), b = settled(role, side, e.w1 + 0.01);
    if (a.key === b.key) return { key: 'n:' + a.key + e.id, A: a.st, B: a.st, w0: 0, w1: 0 };
    return { key: e.id, A: a.st, B: b.st, w0: e.w0, w1: e.w1 };
  };
  const skinWeights = s => {                            // Gewicht je Skin (Kerb-Geometrie), gestaffelt wie `kerb`
    const z = SK.stagger.kerb; let w = { [S[0].skin]: 1 };
    for (const e of ev) if (e.kind === 'skin') { const t = sstep(e.s + z[0], e.s + z[1], s); if (t <= 0) continue; const to = S[idx(e.s + 0.6)].skin;
      for (const k in w) w[k] *= 1 - t; w[to] = (w[to] || 0) + t; }
    return w;
  };
  const tunnelW = s => { let w = 0; const z = SK.stagger.tunnel; for (const t of tun) w = Math.max(w, sstep(t.s0 + z[0], t.s0 + z[1], s) * (1 - sstep(t.s1 - z[1], t.s1 - z[0], s))); return w; };
  const kz = zones.filter(z => z.role === 'kerb');
  const kerbZoneW = (side, s) => { let w = 0; for (const z of kz) if (z.side === side || z.side === 'both') w = Math.max(w, sstep(z.s0, z.s0 + 6, s) * (1 - sstep(z.s1 - 6, z.s1, s))); return w; };
  return { at, skinWeights, tunnelW, kerbZoneW, events: ev, tun };
}

/** Race-Semantik aus der Krümmung: Kerb-Streifen innen (Radius < kerbR), Warnblöcke außen (Radius < hazardR), nur auf Skin track. */
export function raceZones(route, O) {
  const R = O.race; if (!R) return [];
  const S = route.samples, n = S.length, out = [];
  const curv = i => { const a = S[Math.max(0, i - 4)], b = S[Math.min(n - 1, i + 4)], q = S[i], ds = (b.s - a.s) || 1;
    return ((b.T[0] - a.T[0]) * q.R[0] + (b.T[1] - a.T[1]) * q.R[1] + (b.T[2] - a.T[2]) * q.R[2]) / ds; };   // > 0: Kurve nach rechts
  for (const [kind, rMax, role, def, L] of [['kerb', R.kerbR, 'kerb', { c: R.kerbStripes }, O.stripeLen || 3], ['hazard', R.hazardR, 'barrier_side', { c: R.hazard }, O.blocks?.len || 4]]) {
    let run = null;
    const flush = () => { if (run && run.s1 - run.s0 >= R.minLen) { const side = kind === 'kerb' ? (run.sg > 0 ? 'R' : 'L') : (run.sg > 0 ? 'L' : 'R');
      const P2 = 2 * L, a0 = Math.floor((run.s0 - R.pad) / P2) * P2, a1 = Math.ceil((run.s1 + R.pad) / P2) * P2;
      out.push({ s0: kind === 'kerb' ? a0 : run.s0 - R.pad, s1: kind === 'kerb' ? a1 : run.s1 + R.pad, side, role, def, L, key: kind + out.length, kind }); } run = null; };
    for (let i = 0; i < n; i += 2) {
      const c = curv(i), sg = Math.sign(c), q = S[i], on = Math.abs(c) > 1 / rMax && q.skin === 'track' && !q.tags.includes('LOOP') && q.prm.surface >= 0.5;
      if (on && run && run.sg === sg && q.s - run.s1 < 3) run.s1 = q.s; else { flush(); if (on) run = { s0: q.s, s1: q.s, sg }; }
    }
    flush();
  }
  return out;
}

// ---------- Querschnitt ----------
const kerbProf = (shape, u) => shape === 'flat' ? sstep(0, 0.18, u) * sstep(1, 0.82, u)
  : shape === 'sausage' ? Math.sqrt(Math.max(0, Math.sin(Math.PI * u)))
  : (shape === 'step' || shape === 'ledge') ? sstep(0, 0.05, u) * (1 - sstep(0.94, 1, u))
  : Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.8);
export function kerbSpec(O) {
  if (O.kerb.per) return O.kerb;
  const per = {}; for (const sk of ['street', 'track', 'mag', 'buoy', 'toy']) per[sk] = { h: O.kerb.h * (O.kerb.on[sk] ?? 0), shape: O.kerb.shape };
  per.tunnel = { h: 0.3, shape: 'ledge' }; return { w: O.kerb.w, per };
}
export function section(q, O, G, ctx, over = {}) {
  if (O.edge?.mode === 'mould' && !over.classic) return mouldSection(q, O, G);
  const sl = over.slots || q.slots, s = q.s, cy = -q.prm.deckDepth / 2;
  const nrm = (A, B) => { let n = [-(B[1] - A[1]), B[0] - A[0]]; const l = Math.hypot(n[0], n[1]) || 1; n = [n[0] / l, n[1] / l];
    const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; if (n[0] * m[0] + n[1] * (m[1] - cy) < 0) n = [-n[0], -n[1]]; return n; };
  const strips = []; const push = (role, side, pts) => strips.push({ role, side, pts });
  const blocks = O.blocks && O.blocks.skins.includes(q.skin);
  const wall = (side, chain, n, amp, key) => {
    const pts = [];
    for (let c = 0; c < chain.length - 1; c++) {
      const A = sl[chain[c]], B = sl[chain[c + 1]], N = nrm(A, B);
      for (let j = 0; j <= n; j++) {
        if (c > 0 && j === 0) continue;
        const t = j / n, P = lerp2(A, B, t);
        const g = chain.length === 2 ? Math.sin(Math.PI * t) : (c === 0 ? Math.sin(Math.PI * t * 0.5) : Math.cos(Math.PI * t * 0.5));
        let d = amp * G * lump(s, key + c * 3.7 + t * 1.3) * (0.35 + 0.65 * g);
        if (blocks) { const u = (s % O.blocks.len) / O.blocks.len; d -= O.blocks.groove * (1 - sstep(0, 0.04, Math.min(u, 1 - u))); }
        pts.push([P[0] + N[0] * d, P[1] + N[1] * d]);
      }
    }
    push('barrier_side', side, pts);
  };
  const cap = (side, a, b, key) => {
    const A = sl[a], B = sl[b], N = nrm(A, B), W = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const cell = Math.floor(s / 7), dc = hash(cell * 3.1 + key) > 0.5 ? cell * 7 + hash(cell * 7.7 + key) * 7 : -1e9;
    const dent = 0.08 * G * Math.exp(-((s - dc) ** 2) / 0.25 ** 2 / 4);
    const h = (over.capH ?? Math.min(0.3, 0.3 * W) * O.capRound) * (1 - 0.35 * G * (0.5 + lump(s, key + 9)));
    const pts = [];
    for (let j = 0; j <= 8; j++) { const t = j / 8, P = lerp2(A, B, t), e = Math.pow(Math.sin(Math.PI * t), 0.6), bump = h * e - dent * Math.sin(Math.PI * t); pts.push([P[0] + N[0] * bump, P[1] + N[1] * bump]); }
    push('barrier_cap', side, pts);
  };
  // Kerb: Höhe je Skin gemischt, im Tunnel Servicestreifen
  const K = ctx.kerb, wS = ctx.states ? ctx.states.skinWeights(s) : { [q.skin]: 1 }, wT = ctx.states ? ctx.states.tunnelW(s) : 0;
  const kerbH = (u, side) => { if (over.kerb) return over.kerb.h * kerbProf(over.kerb.shape, u); let h = 0;
    for (const sk in wS) { const p = K.per[sk]; if (p) h += wS[sk] * p.h * kerbProf(p.shape, u) * (p.zoneOnly ? (ctx.states ? ctx.states.kerbZoneW(side, s) : 0) : 1); }
    return (1 - wT) * h + wT * K.per.tunnel.h * kerbProf(K.per.tunnel.shape, u); };
  const kerbW = over.kerb?.w ?? ((1 - wT) * K.w + wT * (K.per.tunnel.w ?? K.w));
  const shoulder = (foot, edge, left) => {
    const F = sl[foot], E = sl[edge], L = Math.hypot(E[0] - F[0], E[1] - F[1]), kw = Math.min(kerbW, (over.kerb?.w ? 1 : 0.8) * L), tk = 1 - kw / L;
    const N = nrm(F, E), Kp = lerp2(F, E, tk), side = left ? 'L' : 'R';
    const kp = []; for (let j = 0; j <= 7; j++) { const u = j / 7, P = lerp2(Kp, E, u), hh = kerbH(u, side); kp.push([P[0] + N[0] * hh, P[1] + N[1] * hh]); }
    const rp = []; for (let j = 0; j <= 4; j++) { const u = j / 4, P = lerp2(F, Kp, u), dd = over.ditch ? -over.ditch * Math.sin(Math.PI * u) : 0; rp.push([P[0] + N[0] * dd, P[1] + N[1] * dd]); }
    if (left) { if (tk > 0.001) push('shoulder', side, rp); push('kerb', side, kp); }
    else { kp.reverse(); rp.reverse(); push('kerb', side, kp); if (tk > 0.001) push('shoulder', side, rp); }
  };
  wall('L', [0, 1, 2], 3, 0.35, 1); cap('L', 2, 3, 2); wall('L', [3, 4], 2, 0.12, 3);
  push('shoulder', 'L', [sl[4], sl[5]]); shoulder(5, 6, true);
  push('road', 'C', [sl[6], sl[7]]);
  shoulder(8, 7, false); push('shoulder', 'R', [sl[8], sl[9]]);
  wall('R', [9, 10], 2, 0.12, 9); cap('R', 10, 11, 10); wall('R', [11, 12, 13], 3, 0.35, 11);
  { const A = sl[13], B = sl[0], N = nrm(A, B), pts = [];
    for (let j = 0; j <= 6; j++) { const t = j / 6, P = lerp2(A, B, t), d = 0.3 * G * lump(s, 13 + t * 2.1) * Math.sin(Math.PI * t); pts.push([P[0] + N[0] * d, P[1] + N[1] * d]); }
    push('underside', 'C', pts); }
  return strips;
}

/** »Ein Guss«: Hohlkehle, Randwulst, glatte Außenwand, gerundete Unterkante. Gleiche Streifenzahl für jedes Sample. */
function mouldSection(q, O, G) {
  const sl = q.slots, s = q.s, strips = [], push = (role, side, pts) => strips.push({ role, side, pts });
  const side = sg => {
    const L = sg < 0, road = sl[L ? 6 : 7], inT = sl[L ? 3 : 10], outT = sl[L ? 2 : 11], und = sl[L ? 0 : 13];
    const xr = road[0], xi = inT[0], xo = outT[0], W = Math.abs(xo - xi), yt0 = Math.max(inT[1], outT[1], 0.05);
    const cell = Math.floor(s / 9), dc = hash(cell * 3.1 + sg) > 0.55 ? cell * 9 + hash(cell * 7.7 + sg) * 9 : -1e9;
    const yt = yt0 + G * 0.06 * lump(s, 5 + sg);   // nur sanfte Welle, keine Dellen (Georg: wirken wie Bugs)
    const r = Math.max(0.02, Math.min(W / 2, yt * 0.7)), yf = Math.max(0.02, yt - r), d = Math.abs(xi - xr), yb = und[1], rb = Math.min(0.35, Math.abs(yb) * 0.3, W / 2);
    const fil = [], rim = [], out = [];
    for (let j = 0; j <= 9; j++) { const th = (j / 9) * Math.PI / 2; fil.push([xr + sg * d * Math.sin(th), yf - yf * Math.cos(th)]); }       // Hohlkehle
    const cx = xi + sg * r, ry = Math.min(r, yt - yf + r);
    for (let j = 0; j <= 10; j++) { const th = Math.PI * j / 10; rim.push([cx - sg * r * Math.cos(th), yf + ry * Math.sin(th)]); }        // Wulst innen → außen
    rim[rim.length - 1] = [xi + sg * 2 * r, yf];
    const xo2 = xi + sg * Math.max(2 * r, W);
    out.push([xi + sg * 2 * r, yf]); out.push([xo2, yf]);
    out.push([xo2, yb + rb]);
    for (let j = 1; j <= 4; j++) { const th = (j / 4) * Math.PI / 2; out.push([xo2 - sg * rb * (1 - Math.cos(th)), yb + rb - rb * Math.sin(th)]); }
    return { fil, rim, out, xo2, yb };
  };
  const Ls = side(-1), Rs = side(1);
  push('underside', 'C', [Rs.out[Rs.out.length - 1], [0, Rs.yb], Ls.out[Ls.out.length - 1]]);
  push('barrier_side', 'L', [...Ls.out].reverse());
  push('barrier_cap', 'L', [...Ls.rim].reverse());
  push('kerb', 'L', [...Ls.fil.slice(3)].reverse());   // oberer Teil der Hohlkehle: Kerb-Farbe (Kurve innen)
  push('shoulder', 'L', [...Ls.fil.slice(0, 4)].reverse());   // unterer, flacher Teil: Schulter (Kies/Sand-Zonen)
  push('road', 'C', [sl[6], sl[7]]);
  push('shoulder', 'R', Rs.fil.slice(0, 4));
  push('kerb', 'R', Rs.fil.slice(3));
  push('barrier_cap', 'R', Rs.rim);
  push('barrier_side', 'R', Rs.out);
  return strips;
}

// ---------- Strecke bauen ----------
export const ROLES = ['road', 'shoulder', 'kerb', 'barrier_side', 'barrier_cap', 'underside', 'marks'];
const ROLE_PROFILE = { road: 'road', shoulder: 'prop', kerb: 'prop', barrier_side: 'house', barrier_cap: 'prop', underside: 'terrainFg', marks: 'water', tube_inner: 'house', rock: 'terrainFg' };
export function profileFor(role, scale, k, detail = null) {
  const p = { ...PROFILES[ROLE_PROFILE[role] ?? 'prop'], ...(detail?.[role] || {}) };
  p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p;
}
function Acc() { return { pos: [], A: [], A2: [], B: [], B2: [], S: [], M: [], idx: [] }; }
function pushV(acc, P, st, s, u) { acc.pos.push(...P); acc.A.push(st.A.a.r, st.A.a.g, st.A.a.b); acc.A2.push(st.A.a2.r, st.A.a2.g, st.A.a2.b);
  acc.B.push(st.B.a.r, st.B.a.g, st.B.a.b); acc.B2.push(st.B.a2.r, st.B.a2.g, st.B.a2.b); acc.S.push(s, u, st.w0, st.w1); acc.M.push(st.A.L, st.A.mode, st.B.L, st.B.mode); }
export function accToGeom(THREE, acc, seed) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(acc.pos, 3));
  for (const [n, a, k] of [['aA', acc.A, 3], ['aA2', acc.A2, 3], ['aB', acc.B, 3], ['aB2', acc.B2, 3], ['aS', acc.S, 4], ['aM', acc.M, 4]]) g.setAttribute(n, new THREE.Float32BufferAttribute(a, k));
  g.setIndex(acc.idx); g.computeVertexNormals(); seedGeometry(THREE, g, seed); return g;
}
export const flatState = (THREE, c, c2 = null, L = 1, mode = 0) => { const a = new THREE.Color(c), b = new THREE.Color(c2 ?? c); const st = { a, a2: b, L, mode }; return { key: 'f', A: st, B: st, w0: 0, w1: 0 }; };

/** Baut eine Route (oder ein Fenster i0..i1) als Meshes je Rolle. `over(q)` liefert optionale Profil-Überschreibungen (Atlas). */
export function buildRoute(THREE, route, O, { G, states, kerb, i0 = 0, i1 = route.samples.length - 1, over = null, marks = true, edges = true }) {
  const S = route.samples;
  const drawn = a => !(S[a].prm.surface < 0.5 || S[a + 1].prm.surface < 0.5 || S[a + 1].brk);
  const acc = Object.fromEntries(ROLES.map(r => [r, Acc()]));
  const seg = [], need = [];
  for (let k = i0; k <= i1; k++) { seg[k] = k < i1 && drawn(k); }
  for (let k = i0; k <= i1; k++) need[k] = seg[k] || (k > i0 && seg[k - 1]);
  const ctx = { states, kerb };
  const secs = []; for (let k = i0; k <= i1; k++) secs[k] = need[k] ? section(S[k], O, G, ctx, over ? over(S[k]) : {}) : null;
  const first = secs.find(Boolean); if (!first) return acc;
  const nStrips = first.length;
  for (let j = 0; j < nStrips; j++) {
    const role = first[j].role, side = first[j].side, A = acc[role];
    let prevBase = -1, prevKey = null, prevK = -1;
    for (let k = i0; k <= i1; k++) {
      if (!need[k]) { prevBase = -1; continue; }
      const q = S[k], sp = secs[k][j], st = states.at(role, side, q.s), n = sp.pts.length;
      const emit = stt => { const b = A.pos.length / 3; for (const [l, h] of sp.pts) pushV(A, W3(q, l, h), stt, q.s, l + h); return b; };
      let base;
      if (prevBase >= 0 && seg[k - 1] && prevKey !== st.key) {           // Ereigniswechsel: Reihe doppelt, alte Zustände für das Viereck davor
        const dup = emit(states.at(role, side, S[prevK].s));
        for (let i = 0; i < n - 1; i++) A.idx.push(prevBase + i, prevBase + i + 1, dup + i + 1, prevBase + i, dup + i + 1, dup + i);
        base = emit(st);
      } else {
        base = emit(st);
        if (prevBase >= 0 && seg[k - 1]) for (let i = 0; i < n - 1; i++) A.idx.push(prevBase + i, prevBase + i + 1, base + i + 1, prevBase + i, base + i + 1, base + i);
      }
      prevBase = base; prevKey = st.key; prevK = k;
    }
  }
  // Stirnflächen an offenen Enden
  for (let k = i0; k <= i1; k++) {
    if (!need[k] || (seg[k] && k > i0 && seg[k - 1])) continue;
    const q = S[k], raw = secs[k].flatMap(sp => sp.pts), A = acc.underside, st = states.at('underside', 'C', q.s);
    const ring = raw.filter((p, i) => i === 0 || Math.hypot(p[0] - raw[i - 1][0], p[1] - raw[i - 1][1]) > 1e-4);
    const tri = THREE.ShapeUtils.triangulateShape(ring.map(p => new THREE.Vector2(p[0], p[1])), []);   // U-Querschnitt ist konkav: kein Fächer
    const b = A.pos.length / 3;
    for (const [l, h] of ring) pushV(A, W3(q, l, h), st, q.s, l + h);
    for (const [a, c, d] of tri) A.idx.push(b + a, b + c, b + d);
  }
  if (marks && route.markings) {
    const A = acc.marks, sArr = S.map(q => q.s);
    const lo = x => { let a = 0, b = sArr.length; while (a < b) { const m = (a + b) >> 1; if (sArr[m] < x) a = m + 1; else b = m; } return a; };
    for (const bd of route.markings) {
      if (bd.s1 < S[i0].s || bd.s0 > S[i1].s || (!edges && bd.at === 'edges')) continue;
      const ids = []; for (let i = Math.max(i0, lo(bd.s0) - 1); i <= i1 && S[i].s <= bd.s1 + 1e-6; i++) if (S[i].s >= bd.s0 - 1e-6 && S[i].prm.surface >= 0.5) ids.push(i);
      if (ids.length < 2) continue;
      const st = flatState(THREE, (O.marks[bd.style] ?? O.marks.TRACK)[bd.at] ?? '#ffffff'), b0 = A.pos.length / 3;
      for (const i of ids) {
        const q = S[i], halfW = q.prm.width / 2, lat = bd.at === 'edges' ? q.prm.offset + bd.side * (halfW - bd.inset) : q.prm.offset;
        const w = bd.at === 'bars' ? q.prm.width * bd.span : bd.w;
        for (const [d, h] of [[-w / 2, 0.02], [0, 0.02 + Math.min(0.03, w * 0.12)], [w / 2, 0.02]]) pushV(A, W3(q, lat + d, h), st, q.s, lat + d);
      }
      for (let k = 0; k < ids.length - 1; k++) { if (ids[k + 1] !== ids[k] + 1) continue; const a = b0 + 3 * k, b = a + 3;
        for (let i = 0; i < 2; i++) A.idx.push(a + i, a + i + 1, b + i + 1, a + i, b + i + 1, b + i); }
    }
  }
  return acc;
}

// ---------- Tunnel · Familie mountain (Gotthard) ----------
/** Innenwand, Lichtbänder, Kragen, Stirnwand, Berg, Einschnitt. Liefert Akkus je Teil und den Hüllen-Befund. */
export function buildMountainTunnel(THREE, route, seg, T, { G, iEnd }) {
  const S = route.samples, rings = route.tunnelRings, i0 = seg.i0, i1 = Math.min(seg.i1, iEnd);
  const s0 = S[i0].s, s1 = S[seg.i1].s, out = { inner: Acc(), lights: Acc(), collar: Acc(), rock: Acc(), env: { minClear: Infinity, worst: null, maxBulge: 0 } };
  const stI = flatState(THREE, T.inner), stL = flatState(THREE, T.lights), stC = flatState(THREE, T.collar), stR = flatState(THREE, T.rock), stG = flatState(THREE, T.grass);
  const ringAt = k => rings[S[k].tunnel.ringId];
  const ctrOf = r => { let y0 = Infinity, y1 = -Infinity; for (const p of r) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); } return [0, (y0 + y1) / 2]; };
  const GROUND = -0.6;
  // Innenwand mit Knet-Beule nach innen (≤ bulgeMax), Portale ausgeblendet
  const N = rings[S[i0].tunnel.ringId].length;
  let prev = -1;
  for (let k = i0; k <= i1; k += 2) {
    const q = S[k], r = ringAt(k), C = ctrOf(r), half = q.prm.width / 2, off = q.prm.offset || 0;
    const fade = sstep(0, T.fade, q.s - s0) * sstep(0, T.fade, s1 - q.s), b = out.inner.pos.length / 3;
    for (let j = 0; j < N; j++) {
      const [l, h] = r[j]; let d = 0;
      if (h > 1.6) d = Math.max(0, Math.min(T.bulgeMax, T.bulgeMax * G * (0.55 + 0.9 * lump(q.s, 40 + j * 0.37)))) * fade;
      const dx = C[0] - l, dy = C[1] - h, dl = Math.hypot(dx, dy) || 1, L = l + dx / dl * d, H = h + dy / dl * d;
      out.env.maxBulge = Math.max(out.env.maxBulge, d);
      if (Math.abs(L - off) <= half) { const c = H - 7; if (H > 0 && c < out.env.minClear) { out.env.minClear = c; out.env.worst = { s: q.s, lat: L, lift: H }; } }
      else if (H > 0 && H < 7) { const c = Math.abs(L - off) - half; if (c < out.env.minClear) { out.env.minClear = c; out.env.worst = { s: q.s, lat: L, lift: H }; } }
      pushV(out.inner, W3(q, L, H), stI, q.s, L + H);
    }
    if (prev >= 0) for (let j = 0; j < N; j++) { const j1 = (j + 1) % N; out.inner.idx.push(prev + j, b + j, b + j1, prev + j, b + j1, prev + j1); }
    prev = b;
  }
  // Lichtbänder im Takt des Spielzeugrasters (18 m), oben seitlich
  for (let s = s0 + 9; s < S[i1].s - 4; s += 18) {
    const k = Math.round(s / route.ds), q = S[k], r = ringAt(k); if (!r) continue;
    for (const sg of [-1, 1]) {
      let best = null; for (const p of r) if (p[1] > 6 && p[1] < 9 && Math.sign(p[0]) === sg) { if (!best || Math.abs(p[1] - 7.5) < Math.abs(best[1] - 7.5)) best = p; }
      if (!best) continue;
      const C = ctrOf(r), dx = C[0] - best[0], dy = C[1] - best[1], dl = Math.hypot(dx, dy), nx = dx / dl, ny = dy / dl, tx = -ny, ty = nx;
      const b = out.lights.pos.length / 3;
      for (const [ds, du] of [[-1.6, -0.35], [1.6, -0.35], [1.6, 0.35], [-1.6, 0.35]]) { const qq = S[Math.round((s + ds) / route.ds)];
        pushV(out.lights, W3(qq, best[0] + nx * 0.12 + tx * du, best[1] + ny * 0.12 + ty * du), stL, s + ds, 0); }
      out.lights.idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
  }
  // Kragen: folgt dem Ring über Grund, 1,8 m breit, steht 1,2 m aus der Stirnwand
  const r0 = ringAt(i0), q0 = S[i0], C0 = ctrOf(r0), wall = q0.tunnel.wall ?? 1.2;
  const above = []; for (let j = 0; j < N; j++) if (r0[j][1] >= GROUND) above.push(j);
  const push2 = (acc, q, l, h, st) => pushV(acc, W3(q, l, h), st, q.s, l + h);   // u in Metern, nie als Index
  const radial = (p, w) => { const dx = p[0] - C0[0], dy = p[1] - C0[1], dl = Math.hypot(dx, dy) || 1; return [p[0] + dx / dl * w, Math.max(GROUND, p[1] + dy / dl * w)]; };
  const qF = { ...q0, p: W3(q0, 0, 0).map((v, i) => v - q0.T[i] * 1.2) }, qB = { ...q0, p: W3(q0, 0, 0).map((v, i) => v + q0.T[i] * 0.6) };
  const inR = above.map(j => r0[j]), outR = above.map(j => radial(r0[j], wall + 1.8));
  const strip = (acc, qa, Ra, qb, Rb, st) => { const a = acc.pos.length / 3; Ra.forEach((p, i) => push2(acc, qa, p[0], p[1], st, i)); const b = acc.pos.length / 3; Rb.forEach((p, i) => push2(acc, qb, p[0], p[1], st, i));
    for (let i = 0; i < Ra.length - 1; i++) acc.idx.push(a + i, a + i + 1, b + i + 1, a + i, b + i + 1, b + i); };
  strip(out.collar, qF, inR, qF, outR, stC);            // Stirnseite
  strip(out.collar, qF, outR, qB, outR, stC);           // Außenseite
  strip(out.collar, qF, inR, qB, inR, stC);             // Laibung
  // Stirnwand + Berg: Ellipse um das Portal (Rx 48, Ry 24), Knetbeulen 2,5 m × Stärke
  const Rx = 48, Ry = 24;
  const hillP = (q, j, f) => { const p = r0[j], dx = p[0] - C0[0], dy = p[1] - C0[1], dl = Math.hypot(dx, dy) || 1, ux = dx / dl, uy = dy / dl;
    const e = [ux * Rx, GROUND - 0.4 + Math.max(0, uy) * Ry], o = radial(p, wall + 1.8);
    const L = 2.5 * (0.4 + G) * lump(q.s, 60 + j * 0.53) * Math.max(0, uy);
    return [o[0] + (e[0] - o[0]) * f + ux * L, o[1] + (e[1] - o[1]) * f + Math.max(0, uy) * L]; };
  strip(out.rock, qB, outR, qB, above.map(j => hillP(q0, j, 1)), stR);           // Stirnwand
  let pb = -1;
  for (let k = i0; k <= Math.min(i1 + 40, S.length - 1); k += 4) {
    const q = S[k], b = out.rock.pos.length / 3;
    above.forEach(j => { const P = hillP(q, j, 1); push2(out.rock, q, P[0], P[1], stG); });   // Berg grün wie das Gelände, Fels nur an Stirnwand und Schnittflächen
    if (pb >= 0) for (let i = 0; i < above.length - 1; i++) out.rock.idx.push(pb + i, pb + i + 1, b + i + 1, pb + i, b + i + 1, b + i);
    pb = b;
  }
  // Einschnitt vor dem Portal: äußerer Teil des Bergprofils, Höhe wächst über 45 m bis zur Stirnwand, innen senkrechte Schnittfläche
  const hill0 = above.map(j => hillP(q0, j, 1));
  for (const sg of [-1, 1]) {
    const lo = Math.abs(q0.slots[sg < 0 ? 0 : 13][0]) + 0.6;
    const part = hill0.filter(p => Math.sign(p[0]) === sg && Math.abs(p[0]) >= lo).sort((a, b) => Math.abs(a[0]) - Math.abs(b[0]));
    if (part.length < 2) continue;
    const hLo = part[0][1], prof0 = [[sg * lo, GROUND - 0.4], [sg * lo, hLo], ...part];
    let pc = -1;
    for (let k2 = Math.max(0, i0 - 90); k2 <= i0; k2 += 2) {
      const q = S[k2], hc = sstep(s0 - 45, s0, q.s), b = out.rock.pos.length / 3;
      prof0.forEach((p, i) => push2(out.rock, q, p[0], GROUND - 0.4 + (p[1] - GROUND + 0.4) * hc, i < 2 ? stR : stG));
      if (pc >= 0) for (let i = 0; i < prof0.length - 1; i++) out.rock.idx.push(pc + i, pc + i + 1, b + i + 1, pc + i, b + i + 1, b + i);
      pc = b;
    }
  }
  return out;
}
