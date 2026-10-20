/* clay-eyelid.v2.js — KFB Clay-Lid E2 · EINE geschlossene Lidhaut um den ganzen Augapfel, Lidspalt als einzige Öffnung.
   Georg 14.10.: keine Schnittkante hinten oder seitlich (Stielauge muss gehen); Lider = eine geschlossene Form mit
   Lidspalt; weit offen (Ruhe) wandern die Lidwinkel nach hinten; Ränder rund, innen bündige Kante zum Augapfel.
   Rahmen augenlokal: +Z Blick, +Y oben, +X rechts. Lidspalt in mittelabstandstreuer Karte um +Z (ρ = Winkel zur
   Blickachse, φ = Richtung): obere Halbkurve y = U·|sin ψ|^(2γ), untere y = −L·|sin ψ|^(2γ), x = A·cos ψ.
   U/L = Lidkante in der Mitte nach EyeRig v6, A = Lage der Lidwinkel (offen hinter der Silhouette, zu seitlich).
   Netz: Spalten vom Lidrand nach hinten (erst entlang der Normalen, dann radial), je Spalte ein offenes Profil
   innen → Rundung → Lippe → Rundung → außen; zwei Pole hinten (innen, außen). Kugeltopologie, ein Körper.
   Die Spalten kreuzen sich nicht (konvexer Rand, monoton drehende Normalen), das Profil ist konvex: keine
   Selbstdurchdringung, gleiche Topologie in jedem Zustand. */
import { V6 } from './clay-eyelid.v1.js';
export { V6 };
export const CLAY_SKIN_SCHEMA = 'kfb.clay-eyelid-skin/2-candidate';
const D = Math.PI / 180, TAU = Math.PI * 2;

export const DEFAULTS2 = {
  radius: 1, clearance: 0.012, thickness: 0.10, innerRound: 0.012, outerRound: 0.075,
  bulge: 0.12, bulgeLen: 0.35, cornerOpen: 105, cornerClosed: 80, gamma: 0.5,
  seamDeg: 0.06, normalSoft: 0.25, offsetZone: 0.5, columns: 160, nInner: 40, nOuter: 40,
};
const PS = { cornerIn: 5, lip: 3, cornerOut: 9 };

/* EyeRig-v6-Lidwerte (cu, cl) → Lidspalt. Grad. */
export function apertureV6(cu, cl, o = DEFAULTS2) {
  const U = Math.max(o.seamDeg, V6.edgeDeg(cu, true)), L = Math.max(o.seamDeg, -V6.edgeDeg(cl, false));
  const rest = V6.edgeDeg(V6.restU, true) - V6.edgeDeg(V6.restL, false) - 2 * o.seamDeg;
  const open = Math.max(0, U + L - 2 * o.seamDeg) / rest;
  const A = Math.min(140, o.cornerClosed + (o.cornerOpen - o.cornerClosed) * open);
  return { U, L, A };
}

function curve(psi, A, Bu, Bl, g, out) {
  const c = Math.cos(psi), s = Math.sin(psi);
  out[0] = A * c; out[1] = (s >= 0 ? Bu : -Bl) * Math.pow(Math.abs(s), 2 * g);
  return out;
}
function rimSamples(U, L, A, g, soft, Nc, NF = 2048) {
  const Us = Math.max(U, soft), Ls = Math.max(L, soft), q = [0, 0], a = [0, 0], b = [0, 0];
  const normal = (psi) => {
    curve(psi + 1e-4, A, Us, Ls, g, a); curve(psi - 1e-4, A, Us, Ls, g, b);
    const tx = a[0] - b[0], ty = a[1] - b[1], l = Math.hypot(tx, ty) || 1;
    return [ty / l, -tx / l];
  };
  const P = new Float64Array((NF + 1) * 2), NA = new Float64Array(NF + 1);
  for (let i = 0; i <= NF; i++) {
    const psi = TAU * i / NF; curve(psi, A, U, L, g, q); P[i * 2] = q[0]; P[i * 2 + 1] = q[1];
    const n = normal(psi); NA[i] = Math.atan2(n[1], n[0]);
  }
  let Lt = 0; const seg = new Float64Array(NF), dn = new Float64Array(NF);
  for (let i = 0; i < NF; i++) {
    seg[i] = Math.hypot(P[i * 2 + 2] - P[i * 2], P[i * 2 + 3] - P[i * 2 + 1]); Lt += seg[i];
    let d = NA[i + 1] - NA[i]; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; dn[i] = Math.abs(d);
  }
  const cum = new Float64Array(NF + 1);
  for (let i = 0; i < NF; i++) cum[i + 1] = cum[i] + 0.55 * seg[i] / Lt + 0.4 * dn[i] / TAU + 0.05 / NF;
  const out = []; let i = 0;
  for (let j = 0; j < Nc; j++) {
    const t = cum[NF] * j / Nc;
    while (i < NF - 1 && cum[i + 1] < t) i++;
    const f = (t - cum[i]) / Math.max(1e-15, cum[i + 1] - cum[i]), psi = TAU * (i + f) / NF;
    curve(psi, A, U, L, g, q);
    out.push({ psi, x: q[0], y: q[1], n: normal(psi) });
  }
  return out;
}

export function clayEyelidSkinData(opt = {}) {
  const o = Object.assign({}, DEFAULTS2, opt);
  const ap = opt.aperture || apertureV6(V6.restU, V6.restL, o);
  const U = ap.U * D, L = ap.L * D, A = ap.A * D;
  const R = o.radius, Ri = R * (1 + o.clearance), H = R * o.thickness;
  let ri = o.innerRound * R, ro = o.outerRound * R;
  const fv = Math.min(1, 0.9 * H / (ri + ro)); ri *= fv; ro *= fv;
  const d0 = o.offsetZone, Lb = Math.min(o.bulgeLen, d0 - ro - 0.02);
  const Nc = o.columns, n1 = o.nInner, n2 = o.nOuter;
  const g = (t) => Math.pow(t, 1.7);
  const prof = [];   // [u (Anteil oder absolut), v, Art]
  for (let k = n1; k >= 0; k--) prof.push(['in', k / (n1 + 1)]);
  for (let i = 1; i <= PS.cornerIn; i++) { const a = (-90 - 90 * i / PS.cornerIn) * D; prof.push(['abs', ri + ri * Math.cos(a), ri + ri * Math.sin(a)]); }
  for (let i = 1; i <= PS.lip; i++) prof.push(['abs', 0, ri + (H - ro - ri) * i / PS.lip]);
  for (let i = 1; i <= PS.cornerOut; i++) { const a = (180 - 90 * i / PS.cornerOut) * D; prof.push(['abs', ro + ro * Math.cos(a), H - ro + ro * Math.sin(a)]); }
  for (let k = 1; k <= n2; k++) prof.push(['out', k / (n2 + 1)]);
  const M = prof.length;
  const rimS = rimSamples(U, L, A, o.gamma, o.normalSoft, Nc);
  const pos = new Float32Array((Nc * M + 2) * 3);
  const bump = (u) => (u <= ro || u >= ro + Lb) ? 0 : Math.pow(Math.sin(Math.PI * (u - ro) / Lb), 2);
  for (let j = 0; j < Nc; j++) {
    const s = rimS[j], p1x = s.x + d0 * s.n[0], p1y = s.y + d0 * s.n[1];
    const rho1 = Math.min(Math.PI - 0.02, Math.hypot(p1x, p1y)), phi1 = Math.atan2(p1y, p1x);
    const Ue = d0 + (Math.PI - rho1);
    for (let k = 0; k < M; k++) {
      const e = prof[k];
      let u, v;
      if (e[0] === 'in') { u = ri + (Ue - ri) * g(e[1]); v = 0; }
      else if (e[0] === 'out') { u = ro + (Ue - ro) * g(e[1]); v = H * (1 + o.bulge * bump(u)); }
      else { u = e[1]; v = e[2]; }
      let rho, phi;
      if (u <= d0) { const x = s.x + u * s.n[0], y = s.y + u * s.n[1]; rho = Math.hypot(x, y); phi = Math.atan2(y, x); }
      else { rho = rho1 + (u - d0); phi = phi1; }
      const r = Ri + v, sr = Math.sin(rho), q = (j * M + k) * 3;
      pos[q] = r * sr * Math.cos(phi); pos[q + 1] = r * sr * Math.sin(phi); pos[q + 2] = r * Math.cos(rho);
    }
  }
  const iI = Nc * M, iO = iI + 1;
  pos[iI * 3 + 2] = -Ri; pos[iO * 3 + 2] = -(Ri + H);
  const idx = new Uint32Array(((M - 1) * Nc * 2 + Nc * 2) * 3);
  let n = 0; const T = (a, b, c) => { idx[n++] = a; idx[n++] = b; idx[n++] = c; };
  for (let j = 0; j < Nc; j++) {
    const j1 = (j + 1) % Nc;
    for (let k = 0; k < M - 1; k++) { const a = j * M + k, b = j1 * M + k, c = j1 * M + k + 1, d = j * M + k + 1; T(a, b, c); T(a, c, d); }
    T(iI, j1 * M, j * M);
    T(j * M + M - 1, j1 * M + M - 1, iO);
  }
  let vol = 0;
  for (let f = 0; f < idx.length; f += 3) {
    const a = idx[f] * 3, b = idx[f + 1] * 3, c = idx[f + 2] * 3;
    vol += pos[a] * (pos[b + 1] * pos[c + 2] - pos[b + 2] * pos[c + 1]) - pos[a + 1] * (pos[b] * pos[c + 2] - pos[b + 2] * pos[c]) + pos[a + 2] * (pos[b] * pos[c + 1] - pos[b + 1] * pos[c]);
  }
  if (vol < 0) for (let f = 0; f < idx.length; f += 3) { const t = idx[f + 1]; idx[f + 1] = idx[f + 2]; idx[f + 2] = t; }
  return { positions: pos, indices: idx, schema: CLAY_SKIN_SCHEMA, meta: { Ri, H, aperture: ap, columns: Nc, profile: M, poles: [iI, iO] } };
}

function finish(g, d) {
  g.computeVertexNormals();
  const nr = g.attributes.normal; nr.setXYZ(d.meta.poles[0], 0, 0, 1); nr.setXYZ(d.meta.poles[1], 0, 0, -1);
  g.computeBoundingSphere(); g.userData = Object.assign(g.userData || {}, { schema: d.schema, closedVolume: true }, d.meta);
  return g;
}
export function clayEyelidSkinGeometry(THREE, opt = {}) {
  const d = clayEyelidSkinData(opt), g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(d.positions, 3));
  g.setIndex(new THREE.BufferAttribute(d.indices, 1));
  return finish(g, d);
}
export function updateClayEyelidSkin(g, opt = {}) {
  const d = clayEyelidSkinData(opt);
  g.attributes.position.array.set(d.positions); g.attributes.position.needsUpdate = true;
  return finish(g, d);
}
