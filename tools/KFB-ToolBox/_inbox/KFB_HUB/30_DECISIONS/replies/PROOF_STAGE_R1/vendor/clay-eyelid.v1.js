/* clay-eyelid.v1.js — KFB Clay-Lid E1 (Kandidat, PR #159 Spenderlinie). Kein zweiter EyeRig-Owner.
   Bau: EIN gemessener Augapfel (Radius R), EINE gemeinsame Hülle Ri = R·(1+clearance). Ober- und Unterlid sind die
   zwei Hälften dieser Hülle, getrennt durch die Lidöffnung vorn und eine feste Fuge hinten.
   Rahmen: augenlokal, +Z Blick, +Y oben, Scharnierachse X durch beide Lidwinkel.
     Punkt(r, β, α) = r·(sin β, cos β·sin α, cos β·cos α)   β = Breite zur X-Achse, α = Elevation um X
   Jede Lidhälfte = ein geschlossenes Profil (abgerundetes Rechteck, fester Punktsatz), entlang β von Pol zu Pol
   gezogen. Ring j liegt vollständig auf dem Kegel β_j um X; verschiedene Kegel schneiden sich nicht außerhalb des
   Ursprungs, das Profil ist konvex — darum kann sich die Fläche nicht selbst durchdringen, in keinem Zustand.
   Beide Pole (Lidwinkel) sind je EIN Scheitel auf ±X·Ri; Ober- und Unterlid teilen ihn.
   Lidschluss: die Kante wandert über den Augapfel (Elevation nach EyeRig v6), die hintere Fuge bleibt stehen;
   der Körper dazwischen dehnt sich. Gleiche Topologie in jedem Zustand. */
export const CLAY_EYELID_SCHEMA = 'kfb.clay-eyelid/1-candidate';
const D = Math.PI / 180;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* EyeRig v6 gemessen (lab-v2/vendor/petstudio-v9/studio-v12/pet-eye-rig.v6.js, unverändert gelesen):
   Lider = Kugelkappen R·lidScale, 0…0,56π bzw. 0,44π…π; up.rotation.x = −(1,30 − c·1,18); lo.rotation.x = +(1,30 − c·1,18);
   Ruhe _rest {u 0,12 · l 0,06}; Lidwert geklemmt −0,35…1; Pupille = Kappe auf R·1,004, Öffnung 0,12 + Größe·0,62;
   Blick: Pivot ±0,5 rad; Schräge: lids.rotation.z = −sx·slant·0,85. */
export const V6 = {
  restU: 0.12, restL: 0.06, lidMin: -0.35,
  lidScale: 1.006 + (1 - 0.9) * 0.05,
  pupilShell: 1.004,
  capAngle: (size = 0.5) => 0.12 + clamp(size, 0, 1) * 0.62,
  maxGaze: 0.5,
  slantGain: 0.85,
  edgeDeg: (c, upper) => (upper ? 1 : -1) * ((1.30 - 1.18 * c) / D - 0.06 * 180),
  baseColor: 0xf2c93c,
};

export const DEFAULTS = {
  radius: 1, clearance: 0.012, thickness: 0.10, innerRound: 0.016, outerRound: 0.065, backRound: 0.45,
  bulge: 0.22, canthus: 0.6, curve: 0, backDeg: 177, rings: 96,
};
export const SEG = { inner: 22, cornerIn: 5, lip: 3, cornerOut: 9, outer: 24, backOut: 6, back: 2, backIn: 5 };
export const K = Object.values(SEG).reduce((a, b) => a + b, 0);

function profile(W, H, ri, ro, rb, bulge, out) {
  let rbo = rb, rbi = rb;
  const fv = Math.min(1, 0.9 * H / (ri + ro)); ri *= fv; ro *= fv;
  const fb = Math.min(1, 0.9 * H / (rbo + rbi)); rbo *= fb; rbi *= fb;
  const fh = Math.min(1, 0.9 * W / Math.max(ri + rbi, ro + rbo)); ri *= fh; ro *= fh; rbo *= fh; rbi *= fh;
  let n = 0;
  const P = (u, v) => { out[n * 2] = u; out[n * 2 + 1] = v; n++; };
  const line = (u0, v0, u1, v1, c) => { for (let i = 0; i < c; i++) { const t = i / c; P(u0 + (u1 - u0) * t, v0 + (v1 - v0) * t); } };
  const arc = (cu, cv, r, a0, a1, c) => { for (let i = 0; i < c; i++) { const a = (a0 + (a1 - a0) * i / c) * D; P(cu + r * Math.cos(a), cv + r * Math.sin(a)); } };
  line(W - rbi, 0, ri, 0, SEG.inner);
  arc(ri, ri, ri, -90, -180, SEG.cornerIn);
  line(0, ri, 0, H - ro, SEG.lip);
  arc(ro, H - ro, ro, 180, 90, SEG.cornerOut);
  for (let i = 0; i < SEG.outer; i++) { const t = i / SEG.outer, b = Math.sin(Math.PI * t); P(ro + (W - rbo - ro) * t, H + bulge * H * b * b); }
  arc(W - rbo, H - rbo, rbo, 90, 0, SEG.backOut);
  line(W, H - rbo, W, rbi, SEG.back);
  arc(W - rbi, rbi, rbi, 0, -90, SEG.backIn);
  return n;
}

/* edgeDeg: Elevation der Lidkante in der Mitte (Grad). Oberlid positiv, Unterlid negativ. */
export function clayEyelidData(opt = {}) {
  const o = Object.assign({}, DEFAULTS, opt);
  const upper = o.upper !== false, s = upper ? 1 : -1;
  const R = o.radius, Ri = R * (1 + o.clearance), T0 = R * o.thickness;
  const edge = (o.edgeDeg != null ? o.edgeDeg : V6.edgeDeg(upper ? V6.restU : V6.restL, upper)) * D;
  const back = o.backDeg * D;
  const nR = o.rings, prof = new Float64Array(K * 2);
  const pos = new Float32Array((nR * K + 2) * 3);
  let minW = Infinity;
  for (let j = 0; j < nR; j++) {
    const t = -1 + 2 * (j + 1) / (nR + 1);
    const beta = (Math.PI / 2) * (0.45 * t + 0.55 * Math.sin(t * Math.PI / 2));
    const cb = Math.cos(beta), sb = Math.sin(beta), tau = Math.pow(cb, o.canthus);
    const am = s * edge + o.curve * D * cb * cb;          // Kante, Abstand von der Öffnung nach außen
    const span = Math.max(4 * D, back - am);
    const rref = Ri * cb, W = span * rref, H = T0 * tau;
    minW = Math.min(minW, span / D);
    profile(W, H, o.innerRound * R * tau, o.outerRound * R * tau, o.backRound * H, o.bulge, prof);
    for (let k = 0; k < K; k++) {
      const u = prof[k * 2], v = prof[k * 2 + 1];
      const a = s * (am + u / rref), r = Ri + v, q = (j * K + k) * 3;
      pos[q] = r * sb; pos[q + 1] = r * cb * Math.sin(a); pos[q + 2] = r * cb * Math.cos(a);
    }
  }
  const iS = nR * K, iE = iS + 1;
  pos[iS * 3] = -Ri; pos[iE * 3] = Ri;
  const idx = new Uint32Array(((nR - 1) * K * 2 + K * 2) * 3);
  let n = 0;
  const T = (a, b, c) => { idx[n++] = a; idx[n++] = b; idx[n++] = c; };
  for (let j = 0; j < nR - 1; j++) for (let k = 0; k < K; k++) {
    const k1 = (k + 1) % K, a = j * K + k, b = (j + 1) * K + k, c = (j + 1) * K + k1, d = j * K + k1;
    T(a, b, c); T(a, c, d);
  }
  for (let k = 0; k < K; k++) { const k1 = (k + 1) % K; T(iS, k, k1); T((nR - 1) * K + k, iE, (nR - 1) * K + k1); }
  // Orientierung über das Volumen festlegen: nach außen = positives Volumen
  let vol = 0;
  for (let f = 0; f < idx.length; f += 3) {
    const a = idx[f] * 3, b = idx[f + 1] * 3, c = idx[f + 2] * 3;
    vol += pos[a] * (pos[b + 1] * pos[c + 2] - pos[b + 2] * pos[c + 1])
         - pos[a + 1] * (pos[b] * pos[c + 2] - pos[b + 2] * pos[c])
         + pos[a + 2] * (pos[b] * pos[c + 1] - pos[b + 1] * pos[c]);
  }
  if (vol < 0) for (let f = 0; f < idx.length; f += 3) { const t = idx[f + 1]; idx[f + 1] = idx[f + 2]; idx[f + 2] = t; }
  return {
    positions: pos, indices: idx, schema: CLAY_EYELID_SCHEMA,
    meta: { upper, Ri, T0, edgeDeg: edge / D, backDeg: o.backDeg, rings: nR, K, poles: [iS, iE], minSpanDeg: minW, flipped: vol < 0, lipK: SEG.inner + SEG.cornerIn + 1 },
  };
}

export function clayEyelidGeometry(THREE, opt = {}) {
  const d = clayEyelidData(opt), g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(d.positions, 3));
  g.setIndex(new THREE.BufferAttribute(d.indices, 1));
  g.computeVertexNormals();
  const nrm = g.attributes.normal;
  nrm.setXYZ(d.meta.poles[0], -1, 0, 0); nrm.setXYZ(d.meta.poles[1], 1, 0, 0);
  g.computeBoundingSphere();
  g.userData = { schema: d.schema, closedVolume: true, ...d.meta };
  return g;
}

/* Gleiche Topologie, neue Lage: für die Lidbewegung ohne neue Geometrie. */
export function updateClayEyelid(g, opt = {}) {
  const d = clayEyelidData(opt);
  g.attributes.position.array.set(d.positions);
  g.attributes.position.needsUpdate = true;
  g.computeVertexNormals();
  const nrm = g.attributes.normal;
  nrm.setXYZ(d.meta.poles[0], -1, 0, 0); nrm.setXYZ(d.meta.poles[1], 1, 0, 0);
  g.computeBoundingSphere();
  Object.assign(g.userData, d.meta);
  return g;
}
