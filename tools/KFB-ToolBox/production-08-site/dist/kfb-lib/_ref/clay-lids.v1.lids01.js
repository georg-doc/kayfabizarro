/* clay-lids.v1.js — Lider auf dem EyeRig v6, mit Auto-Fit und zwei Schließ-Mechaniken (2026-09-26, Stand abends).
 * DONOR: PR #159 Eye Actor Studio v1 · branch chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21
 *   tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs (kfb.upper-lid-volume/0.3-candidate) — 1:1 als »pad«.
 *   Vertrag: skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/EYELID_GEOMETRY_CONTRACT.v1.md
 *
 * AUTO-FIT (Georg 26.09.: »die clay eyelids sollten einen auto-fit haben, so dass sie perfekt auf den eyeballs aufliegen«).
 *   Gemessen wird der Augapfel selbst: das größte Mesh des Auges (ohne Lider, ohne Wimpern) = Sklera. Seine Box gibt Mitte
 *   und Halbachsen im Raum des Lid-Elterns; die Lider werden als EINHEITSKUGEL gebaut und von einem Fit-Knoten auf genau
 *   diese Kugel/dieses Oval gesetzt. Innenfläche = Augapfel × (1 + Spalt); der Spalt ist gemessen (Iris/Pupille, die über
 *   die Sklera ragen) + »fit«. Ändert sich Anker, Größe oder Oval, zieht der Fit im nächsten Bild nach. Blickdrehung zählt
 *   nicht (nur Mitte + Achsenlängen), sonst rollten die Lider mit der Pupille.
 *
 * ZWEI SCHLIESS-MECHANIKEN (Georg 26.09.), für »Thin shell« und »Clay volume« gleich wählbar:
 *   · glide · Kontakt — die Lidkanten GLEITEN über den Augapfel und treffen sich an einer Kontaktlinie (seam). Die Fläche
 *     bleibt am Ball, nur die Kante wandert; hinten bleibt das Lid liegen (deckt den Ball bis weit über den Pol).
 *   · fold · Deckel — zwei halbe Schalen klappen um die Scharnierachse durch die Augenmitte starr zu (Muschel/Deckel).
 *   Beide Mechaniken lesen dieselben Signale des Rig (Blinzeln, Emotes, Lid-Regler, Asymmetrie, Slant) und haben dieselben
 *   Ziele: geschlossen liegt die Oberkante bei seam − Überlapp, die Unterkante bei seam + Überlapp. Ein geschlossenes Auge
 *   ist damit überall zu — vorn, oben, unten, an den Winkeln (vorher: Augapfel stach oben/unten durch).
 *   Die Original-Schalen des EyeRig bleiben daneben wählbar (die klappen immer, sie sind starr).
 * Status: Kandidat, Georgs Sichtabnahme steht aus. */
export const SCHEMA = 'kfb.clay-lids/0.2';
export const DONOR = { pr: 159, branch: 'chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21', file: 'tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs', schema: 'kfb.upper-lid-volume/0.3-candidate' };
export const DEFAULTS = Object.freeze({ on: false, shape: 'cap', look: 'clay', mech: 'glide', seam: -0.08, fit: 0.02, cover: 0.16, coverLo: 0.12, thickness: 0.2, roundness: 0.72, bulge: 0.42,
  curve: 0, curveLo: 0, corner: 0.5, reach: 0.85, wrap: 1.45, open: 0.38, sweep: 0.85, color: null,
  /* hinge (FB-EYE-SOCKET-CLAY-LIDS-01 §2.3–2.4) · start values from START_HERE, angles in degrees, lengths in eyeball radii */
  hOpenU: 74, hOpenL: 66, hSeam: -5, hOverlap: 2.5, hCurve: 0.10, hCurveLo: 0.06, hThick: 0.14, hBead: 0.07, hSpan: 150, hTaper: 0.7 });
export const DONOR_LOOK = Object.freeze({ shape: 'pad', reach: 0, wrap: 1.04 });   // PR #159 kompakter Pad, 1:1
export const THIN_LOOK = Object.freeze({ thickness: 0.07, roundness: 0.3, bulge: 0 });
export const MECHS = [['glide', 'Glide · contact'], ['fold', 'Fold · clamshell'], ['hinge', 'Hinge · shared corners']];
export const META = [
  ['seam', 'Contact line · where the lids meet (− lower · + higher)', -0.6, 0.6, 0.01, 'cap'],
  ['fit', 'Fit · extra gap to the eyeball (auto-measured + this)', 0, 0.15, 0.005],
  ['cover', 'Upper · cover at rest', 0, 1, 0.01], ['coverLo', 'Lower · cover at rest', 0, 1, 0.01],
  ['thickness', 'Thickness · lid body', 0.04, 0.5, 0.01], ['roundness', 'Roundness', 0, 1, 0.01], ['bulge', 'Bulge · central fullness', 0, 1, 0.01],
  ['curve', 'Upper edge · − concave · + convex', -1, 1, 0.01], ['curveLo', 'Lower edge · − concave · + convex', -1, 1, 0.01],
  ['corner', 'Corners · glide · how far the opening reaches round the sides', 0, 1, 0.01, 'cap'],
  ['reach', 'Reach · pad only · 0 compact (PR #159) → 1 over the crown', 0, 1, 0.01, 'pad'], ['wrap', 'Wrap · pad only · around the sides (rad)', 0.8, 1.6, 0.01, 'pad'],
  ['open', 'Open · pad only · rest opening (rad)', -0.3, 0.9, 0.01, 'pad'], ['sweep', 'Sweep · pad only · how far blink swings the pad', 0, 1.5, 0.01, 'pad'],
  ['hOpenU', 'Upper · open angle (°)', 30, 110, 0.5, 'hinge'], ['hOpenL', 'Lower · open angle (°)', 20, 100, 0.5, 'hinge'],
  ['hSeam', 'Seam · where closed lids meet (°, − lower)', -30, 30, 0.5, 'hinge'], ['hOverlap', 'Overlap at the seam (°)', 0, 8, 0.1, 'hinge'],
  ['hCurve', 'Upper edge · convex when open', -0.3, 0.4, 0.005, 'hinge'], ['hCurveLo', 'Lower edge · convex when open', -0.3, 0.4, 0.005, 'hinge'],
  ['hThick', 'Thickness · × eyeball radius', 0.03, 0.4, 0.005, 'hinge'], ['hBead', 'Bead · rounded rim', 0, 0.2, 0.005, 'hinge'],
  ['hSpan', 'Coverage · how far back the shell runs (°)', 90, 175, 1, 'hinge'], ['hTaper', 'Corner melt · cos(ψ)^taper', 0.2, 1.5, 0.01, 'hinge'],
];
/* ── HINGE · one hinge, two shells, shared corners (FB-EYE-SOCKET-CLAY-LIDS-01 §2.3). Unit sphere in the eye's socket frame:
   ψ along the hinge (−90°…+90°, corner to corner), φ around it from n (+z) toward v (+y). Point (sin ψ, cos ψ sin φ, cos ψ cos φ)·r.
   Upper φ ∈ [θ(ψ), θ(ψ)+span], lower mirrored. At ψ = ±90° every φ is the same point → the corners are shared by construction.
   Gap and thickness × cos(ψ)^taper: the lid melts into the ball at the corners. Ring per ψ: outer (back → margin, bead near the
   margin) · half-round lip · inner (margin → back) · closed back seam. Topology fixed; hingePositions() rewrites it. ── */
export const HINGE_N = 48, HINGE_P = 26, HINGE_L = 7, HINGE_Q = 2 * (HINGE_P + 1) + HINGE_L - 1;
const RAD = Math.PI / 180;
export function hingePositions(o, theta, lower, out) {
  const arr = out || new Float32Array((HINGE_N + 1) * HINGE_Q * 3); let w = 0;
  for (let i = 0; i <= HINGE_N; i++) {
    const psi = (-1 + 2 * i / HINGE_N) * Math.PI / 2, c = (i === 0 || i === HINGE_N) ? 0 : Math.cos(psi), sp = i === 0 ? -1 : i === HINGE_N ? 1 : Math.sin(psi);
    const prof = Math.pow(c, o.taper), th = theta - o.curve * c * c * (1 - clamp(o.closure || 0, 0, 1)), ri = 1 + o.gap * prof;
    const put = (r, phi) => { const ph = lower ? -phi : phi; arr[w++] = sp * r; arr[w++] = c * Math.sin(ph) * r; arr[w++] = c * Math.cos(ph) * r; };
    for (let j = 0; j <= HINGE_P; j++) { const u = j / HINGE_P, b = o.bead * Math.exp(-Math.pow((1 - u) * o.span / 0.22, 2)); put(ri + (o.t + b) * prof, th + o.span * (1 - u)); }
    const ro = ri + (o.t + o.bead) * prof, mid = (ro + ri) / 2, hr = (ro - ri) / 2;
    for (let k = 1; k < HINGE_L; k++) { const a = Math.PI * k / HINGE_L; put(mid + hr * Math.cos(a), th - hr * Math.sin(a)); }
    for (let j = HINGE_P; j >= 0; j--) put(ri, th + o.span * (1 - j / HINGE_P));
  }
  return arr;
}
export function buildHingeGeometry(THREE, o, theta, lower) {
  const pos = hingePositions(o, theta, lower), idx = [], Q = HINGE_Q;
  for (let i = 0; i < HINGE_N; i++) { const A = i * Q, B = (i + 1) * Q; for (let q = 0; q < Q; q++) { const q1 = (q + 1) % Q; idx.push(A + q, B + q, B + q1, A + q, B + q1, A + q1); } }
  const P3 = (id) => new THREE.Vector3(pos[id * 3], pos[id * 3 + 1], pos[id * 3 + 2]), m = HINGE_N / 2, qa = Math.floor(HINGE_P / 2);
  const a0 = P3(m * Q + qa), b0 = P3((m + 1) * Q + qa), c0 = P3((m + 1) * Q + qa + 1);
  if (b0.clone().sub(a0).cross(c0.clone().sub(a0)).dot(a0) < 0) for (let t = 0; t < idx.length; t += 3) { const b = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = b; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx);
  g.computeVertexNormals(); g.computeBoundingSphere(); g.userData = { schema: 'kfb.lid-hinge/0.1', closedVolume: true, sharedCorners: true };
  return g;
}
/** hinge options for the two shells (lower: gap + 0.006, thickness × 0.93, bead × 0.8 — no z-fight at the seam) */
export function hingeOpts(p, gap) {
  const base = { span: (+p.hSpan || 150) * RAD, taper: +p.hTaper || 0.7 };
  return { u: { ...base, gap, t: +p.hThick, bead: +p.hBead, curve: +p.hCurve }, l: { ...base, gap: gap + 0.006, t: +p.hThick * 0.93, bead: +p.hBead * 0.8, curve: +p.hCurveLo } };
}
/** §2.4 · closure 0…1 (EyeRig cu/cl) → hinge angles (rad). Negative closure (wide open) extrapolates a little. */
export function hingeAngles(p, cu, cl) {
  const s = (+p.hSeam || 0) * RAD, ov = (+p.hOverlap || 0) * RAD, u = cu > 0.97 ? 1 : clamp(cu, -0.3, 1), l = cl > 0.97 ? 1 : clamp(cl, -0.3, 1);
  return { u: lerp((+p.hOpenU) * RAD, s - ov, u), l: lerp((+p.hOpenL) * RAD, -s - ov, l), cu: u, cl: l };
}
const REST_U = -(1.30 - 0.12 * 1.18), REST_L = 1.30 - 0.06 * 1.18;   // EyeRig v6 Ruhewinkel (_rest u 0.12 / l 0.06)
const OV = 0.035;   // Überlapp der geschlossenen Kanten (rad)

const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t, sm = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
function spherePoint(R, lat, lon) { const cl = Math.cos(lat); return [R * Math.sin(lon) * cl, R * Math.sin(lat), R * Math.cos(lon) * cl]; }
/* ── aus upper-lid-volume.v1.mjs (PR #159) — 1:1 bei reach 0 und lonMax 1.04. Einzige Zugabe: `reach`,
   weil die FB-Augen aus dem Kopf ragen und der kompakte Pad sonst die obere Augapfel-Hälfte freilässt
   (am Bild 26.09.: las sich als Visier, Vertrag §15.9 FAIL). ─────────────────────────────────────── */
export function buildUpperLidVolumeGeometry(THREE, { radius = 1, cover = .16, slant = 0, curve = 0, thickness = .20, roundness = .72, bulge = .42, clearance = .016, lonMax = 1.04, lonSegments = 56, latSegments = 18, reach = 0 } = {}) {
  const R = radius, innerR = R * (1 + clearance), cover01 = clamp(cover, 0, 1), thick = Math.max(.04, thickness), round = clamp(roundness, 0, 1), bul = clamp(bulge, 0, 1);
  const baseMargin = lerp(.24, -.58, cover01);
  const marginLat = (lon) => { const side = clamp(lon / lonMax, -1, 1), centre = 1 - side * side, endLift = .08 * Math.pow(Math.abs(side), 4); return baseMargin + slant * .28 * side + curve * .24 * centre + endLift; };
  const pos = [], idx = [], cols = lonSegments + 1;
  const outerIds = Array.from({ length: cols }, () => []), innerIds = Array.from({ length: cols }, () => []);
  const push = (v) => { const id = pos.length / 3; pos.push(v[0], v[1], v[2]); return id; };
  for (let j = 0; j <= lonSegments; j++) {
    const lon = lerp(-lonMax, lonMax, j / lonSegments), side = Math.abs(lon / lonMax), sideSoft = Math.max(0, 1 - side * side), low = marginLat(lon);
    const sideEnvelope = .26 + .74 * Math.pow(sideSoft, .62), span = (.44 + round * .09) * sideEnvelope, high0 = clamp(low + span, -.03, 1.03), high = reach > 0 ? clamp(high0 + reach * (1.5 - high0) * Math.pow(sideSoft, .35), -.03, 1.5) : high0;   // ToolBox: reach > 0 zieht den Pad bis über den Scheitel (Augen, die aus dem Kopf ragen); 0 = Donor 1:1
    for (let i = 0; i <= latSegments; i++) {
      const v = i / latSegments, smooth = v * v * (3 - 2 * v), lat = lerp(low, high, smooth);
      const ip = spherePoint(innerR, lat, lon); innerIds[j][i] = push(ip);
      const L = Math.hypot(ip[0], ip[1], ip[2]) || 1, nx = ip[0] / L, ny = ip[1] / L, nz = ip[2] / L;
      const crown = Math.sin(Math.PI * v), sideThickness = .30 + .70 * Math.pow(sideSoft, .52), t = R * thick * sideThickness * (.90 + .16 * crown);
      let ox = ip[0] + nx * t, oy = ip[1] + ny * t, oz = ip[2] + nz * t;
      const localFullness = sideThickness * crown; oy += R * round * .018 * localFullness; oz += R * bul * .045 * (.30 + .70 * crown) * sideThickness;
      outerIds[j][i] = push([ox, oy, oz]);
    }
  }
  for (let j = 0; j < lonSegments; j++) for (let i = 0; i < latSegments; i++) { const a = outerIds[j][i], b = outerIds[j + 1][i], c = outerIds[j + 1][i + 1], d = outerIds[j][i + 1]; idx.push(a, b, d, b, c, d); }
  for (let j = 0; j < lonSegments; j++) for (let i = 0; i < latSegments; i++) { const a = innerIds[j][i], b = innerIds[j][i + 1], c = innerIds[j + 1][i + 1], d = innerIds[j + 1][i]; idx.push(a, b, d, b, c, d); }
  const seal = (oA, oB, iA, iB) => idx.push(oA, iA, oB, oB, iA, iB);
  for (let j = 0; j < lonSegments; j++) seal(outerIds[j][0], outerIds[j + 1][0], innerIds[j][0], innerIds[j + 1][0]);
  for (let j = 0; j < lonSegments; j++) seal(outerIds[j + 1][latSegments], outerIds[j][latSegments], innerIds[j + 1][latSegments], innerIds[j][latSegments]);
  for (let i = 0; i < latSegments; i++) { seal(outerIds[0][i + 1], outerIds[0][i], innerIds[0][i + 1], innerIds[0][i]); seal(outerIds[lonSegments][i], outerIds[lonSegments][i + 1], innerIds[lonSegments][i], innerIds[lonSegments][i + 1]); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  g.computeVertexNormals(); g.computeBoundingBox(); g.computeBoundingSphere();
  g.userData = { schema: DONOR.schema, closedVolume: true, realOcclusionMargin: true, cover: cover01, curve, thickness: thick, roundness: round, bulge: bul };
  return g;
}
/* ── Einbindung ────────────────────────────────────────────────────────────────────────────── */
/* ── KAPPE auf der Einheitskugel. rimFn(lon) = Breite der Lidkante je Länge (−π…π); das Lid deckt Kante → Pol.
   Profil je Länge: Außen (Pol → Kante) → gerundete Lippe → Innen (Kante → Pol). Topologie fest, Lage per capPositions(). ── */
const CAP_N = 72, CAP_M = 20, CAP_P = 7;
export function capPositions(o, rimFn, out) {
  const iR = 1 + (o.clearance || 0.02), thick = Math.max(.03, o.thickness), round = clamp(o.roundness, 0, 1), bul = clamp(o.bulge, 0, 1);
  const Q = 2 * (CAP_M + 1) + CAP_P - 1, arr = out || new Float32Array(CAP_N * Q * 3); let w = 0;
  const put = (x, y, z) => { arr[w++] = x; arr[w++] = y; arr[w++] = z; };
  const inner = [], outer = [];
  for (let j = 0; j < CAP_N; j++) {
    const lon = -Math.PI + (j / CAP_N) * Math.PI * 2, front = Math.max(0, Math.cos(lon)), low = clamp(rimFn(lon), -1.45, 1.5);
    inner.length = 0; outer.length = 0;
    for (let i = 0; i <= CAP_M; i++) {
      const v = i / CAP_M, s = v * v * (3 - 2 * v), lat = lerp(low, Math.PI / 2, s), ip = spherePoint(iR, lat, lon), nx = ip[0] / iR, ny = ip[1] / iR, nz = ip[2] / iR;
      const t = thick * (1 + .14 * Math.sin(Math.PI * Math.min(1, v * 2)));
      outer.push([ip[0] + nx * t, ip[1] + ny * t + round * .018 * front * Math.sin(Math.PI * v), ip[2] + nz * t + bul * .045 * front * (.3 + .7 * Math.sin(Math.PI * Math.min(1, v * 1.5)))]);
      inner.push(ip);
    }
    const o0 = outer[0], i0 = inner[0], dn = [Math.sin(low) * Math.sin(lon), -Math.cos(low), Math.sin(low) * Math.cos(lon)];
    const mid = [0, 1, 2].map((k) => (o0[k] + i0[k]) / 2), hv = [0, 1, 2].map((k) => (o0[k] - i0[k]) / 2), hl = Math.hypot(hv[0], hv[1], hv[2]);
    for (let i = CAP_M; i >= 0; i--) put(outer[i][0], outer[i][1], outer[i][2]);
    for (let k = 1; k < CAP_P; k++) { const a = Math.PI * k / CAP_P, c = Math.cos(a), sn = Math.sin(a) * hl * (.25 + .75 * round); put(mid[0] + hv[0] * c + dn[0] * sn, mid[1] + hv[1] * c + dn[1] * sn, mid[2] + hv[2] * c + dn[2] * sn); }
    for (let i = 0; i <= CAP_M; i++) put(inner[i][0], inner[i][1], inner[i][2]);
  }
  return arr;
}
export function buildCapGeometry(THREE, o, rimFn) {
  const Q = 2 * (CAP_M + 1) + CAP_P - 1, pos = capPositions(o, rimFn), idx = [];
  for (let j = 0; j < CAP_N; j++) { const A = j * Q, B = ((j + 1) % CAP_N) * Q; for (let q = 0; q < Q - 1; q++) idx.push(A + q, B + q, B + q + 1, A + q, B + q + 1, A + q + 1); }
  const P3 = (id) => new THREE.Vector3(pos[id * 3], pos[id * 3 + 1], pos[id * 3 + 2]), jf = CAP_N / 2, qf = Math.floor(CAP_M / 2);
  const a0 = P3(jf * Q + qf), b0 = P3(((jf + 1) % CAP_N) * Q + qf), c0 = P3(((jf + 1) % CAP_N) * Q + qf + 1);
  if (b0.clone().sub(a0).cross(c0.clone().sub(a0)).dot(a0) < 0) for (let t = 0; t < idx.length; t += 3) { const b = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = b; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx);
  g.computeVertexNormals(); g.computeBoundingSphere(); g.userData = { schema: 'kfb.lid-cap/0.2', closedVolume: true, fullCap: true };
  return g;
}
function mirrorY(g) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, -p.getY(i)); const ix = g.index.array; for (let t = 0; t < ix.length; t += 3) { const b = ix[t + 1]; ix[t + 1] = ix[t + 2]; ix[t + 2] = b; } g.index.needsUpdate = true; p.needsUpdate = true; g.computeVertexNormals(); return g; }
function lowerFrom(THREE, o) { const g = buildUpperLidVolumeGeometry(THREE, o); return mirrorY(g); }

/* Rim-Ziele aus den Rig-Signalen. pu/pl = Deckung 0 offen … 1 zu (EyeRig: Winkel der Schalen zurückgerechnet). */
function rims(p, pu, pl) {
  const openU = lerp(1.05, 0.2, clamp(p.cover, 0, 1)), openL = -lerp(1.05, 0.2, clamp(p.coverLo, 0, 1)), s = +p.seam || 0;
  const cu = pu > 0.97 ? 1 : clamp(pu, -0.6, 1), cl = pl > 0.97 ? 1 : clamp(pl, -0.6, 1);
  return { u: lerp(openU, s - OV, cu), l: lerp(openL, s + OV, cl) };
}
function glideRim(front, curve, back, corner, sign) {
  const a = lerp(0.3, 1.25, clamp(corner, 0, 1));
  return (lon) => { const L = Math.abs(lon), c = Math.cos(lon), f = front + sign * curve * .24 * (c > 0 ? c * c : 0), w = sm((L - a) / Math.max(0.2, Math.PI * 0.8 - a)); return lerp(f, back, w); };
}
/* ── Einbindung ──────────────────────────────────────────────────────────────────────────────────────────── */
export class ClayLids {
  constructor(THREE) { this.T = THREE; this._key = ''; this.eyes = new Set(); }
  _isLid(e, m) { for (let a = m; a && a !== e; a = a.parent) if (a === e._lids || a === e._up || a === e._lo || (a.userData && a.userData.kfbClay)) return true; return false; }
  /** Sklera = größtes Mesh des Auges ohne Lider; Mitte + Halbachsen im Raum von P (= Elternknoten des Lid-Gelenks). */
  _measure(e) {
    const T = this.T, P = e._lids.parent || e; P.updateWorldMatrix(true, true);
    const Pinv = new T.Matrix4().copy(P.matrixWorld).invert(), sp = new T.Sphere(); let best = null, bestR = 0;
    e.traverse((m) => { if (!m.isMesh || !m.geometry || this._isLid(e, m)) return; const g = m.geometry; if (!g.boundingSphere) g.computeBoundingSphere(); if (!g.boundingSphere) return;
      sp.copy(g.boundingSphere).applyMatrix4(m.matrixWorld); if (sp.radius > bestR) { bestR = sp.radius; best = m; } });
    if (!best) return null;
    const g = best.geometry; if (!g.boundingBox) g.computeBoundingBox();
    const M = new T.Matrix4().multiplyMatrices(Pinv, best.matrixWorld), c = g.boundingBox.getCenter(new T.Vector3()), h = g.boundingBox.getSize(new T.Vector3()).multiplyScalar(0.5);
    const col = [new T.Vector3(), new T.Vector3(), new T.Vector3()]; M.extractBasis(col[0], col[1], col[2]);
    const centre = c.clone().applyMatrix4(M), half = new T.Vector3(h.x * col[0].length(), h.y * col[1].length(), h.z * col[2].length());
    /* Was ragt über die Sklera? Iris, Pupille, Glanz — im Einheitsraum gemessen. */
    /* Vertices, not bounding spheres: a flat pupil disc has a big sphere but lies ON the ball. Radius from the centre is gaze-invariant. */
    let ext = 1; const v = new T.Vector3(), MM = new T.Matrix4();
    e.traverse((m) => { if (!m.isMesh || m === best || !m.geometry || this._isLid(e, m)) return; const pa = m.geometry.attributes.position; if (!pa) return;
      MM.multiplyMatrices(Pinv, m.matrixWorld); const step = Math.max(1, Math.floor(pa.count / 1500));
      for (let i = 0; i < pa.count; i += step) { v.fromBufferAttribute(pa, i).applyMatrix4(MM).sub(centre); ext = Math.max(ext, Math.hypot(v.x / half.x, v.y / half.y, v.z / half.z)); } });
    return { centre, half, ext: Math.min(ext, 1.25), sig: [centre.x, centre.y, centre.z, half.x, half.y, half.z].map((v) => Math.round(v * 1e4)).join(',') };
  }
  _params(p) { return p.look === 'thin' ? { ...p, ...THIN_LOOK } : p; }
  _build(e, R, p0, fit) {
    const T = this.T, p = this._params(p0), old = e._kfbClay;
    if (old) { old.up.geometry.dispose(); old.lo.geometry.dispose(); old.fitNode.removeFromParent(); old.mat.dispose(); }
    const mat = (e._up.material && e._up.material.clone) ? e._up.material.clone() : new T.MeshStandardMaterial({ color: 0xf2c93c });
    mat.side = T.FrontSide; mat.transparent = false; mat.opacity = 1; mat.depthWrite = true; if ('roughness' in mat) mat.roughness = 0.84; if ('metalness' in mat) mat.metalness = 0; mat.name = 'KFB_ClayLid'; mat.needsUpdate = true;
    const fitNode = new T.Group(), tilt = new T.Group(); fitNode.name = 'kfb-lid-fit'; tilt.name = 'kfb-lid-tilt'; fitNode.userData.kfbClay = true; fitNode.add(tilt); (e._lids.parent || e).add(fitNode);
    const clearance = Math.max(0.015, (fit ? fit.ext - 1 : 0) + 0.012) + (+p.fit || 0), geo = { clearance, thickness: p.thickness, roundness: p.roundness, bulge: p.bulge };
    let upG, loG, mode = p.shape === 'pad' ? 'pad' : (p.mech === 'fold' ? 'fold' : p.mech === 'hinge' ? 'hinge' : 'glide');
    if (mode === 'hinge') { const H = hingeOpts(p, clearance), a = hingeAngles(p, 0.12, 0.06); upG = buildHingeGeometry(T, { ...H.u, closure: a.cu }, a.u, false); loG = buildHingeGeometry(T, { ...H.l, closure: a.cl }, a.l, true); }
    else
    if (mode === 'pad') { const base = { radius: 1, thickness: p.thickness, roundness: p.roundness, bulge: p.bulge, reach: p.reach, lonMax: p.wrap, clearance };
      upG = buildUpperLidVolumeGeometry(T, { ...base, cover: p.cover, curve: p.curve }); loG = lowerFrom(T, { ...base, cover: p.coverLo, curve: -p.curveLo }); }
    else if (mode === 'fold') {
      /* Halbe Schale, Kante minimal unter dem Äquator: zwei gleich gedrehte Hälften überlappen lückenlos. */
      upG = buildCapGeometry(T, geo, glideRim(-0.03, p.curve, -0.03, 1, 1)); loG = mirrorY(buildCapGeometry(T, { ...geo, clearance: clearance + 0.006, thickness: p.thickness * 0.93 }, glideRim(-0.03, p.curveLo, -0.03, 1, 1)));
    } else {
      const r = rims(p, 0.12, 0.06);
      upG = buildCapGeometry(T, geo, glideRim(r.u, p.curve, -0.35, p.corner, 1)); loG = mirrorY(buildCapGeometry(T, { ...geo, clearance: clearance + 0.006, thickness: p.thickness * 0.93 }, glideRim(-r.l, p.curveLo, -0.35, p.corner, 1)));
    }
    const up = new T.Mesh(upG, mat), lo = new T.Mesh(loG, mat);
    /* Schatten: Lider EMPFANGEN, werfen nicht (dünne Volumen dicht am Augapfel = Akne + helle Naht; handover/LESSONS_SHADOWS.md). */
    for (const m of [up, lo]) { m.castShadow = false; m.receiveShadow = true; m.userData.noMeasure = true; m.userData.petOverlay = true; m.userData.kfbClay = true; m.raycast = () => {}; m.frustumCulled = false; tilt.add(m); }
    up.name = 'kfb-clay-lid · upper'; lo.name = 'kfb-clay-lid · lower';
    e._kfbClay = { up, lo, mat, fitNode, tilt, key: this._key, R, mode, geo, fit, ru: null, rl: null }; this.eyes.add(e);
  }
  _place(K, fit) { if (!fit) return; K.fitNode.position.copy(fit.centre); K.fitNode.scale.copy(fit.half); K.fitNode.quaternion.identity(); K.fitSig = fit.sig; }
  _reglide(K, p, ru, rl) {
    if (K.ru != null && Math.abs(K.ru - ru) < 0.002 && Math.abs(K.rl - rl) < 0.002) return;
    const a = K.up.geometry.attributes.position, b = K.lo.geometry.attributes.position;
    capPositions(K.geo, glideRim(ru, p.curve, -0.35, p.corner, 1), a.array);
    capPositions({ ...K.geo, clearance: K.geo.clearance + 0.006, thickness: K.geo.thickness * 0.93 }, glideRim(-rl, p.curveLo, -0.35, p.corner, 1), b.array);
    for (let i = 0; i < b.count; i++) b.array[i * 3 + 1] = -b.array[i * 3 + 1];
    a.needsUpdate = b.needsUpdate = true; K.up.geometry.computeVertexNormals(); K.lo.geometry.computeVertexNormals(); K.ru = ru; K.rl = rl;
  }
  _rehinge(K, p, pu, pl) {
    const a = hingeAngles(p, pu, pl), sig = [a.u, a.l, a.cu, a.cl, p.hCurve, p.hCurveLo, p.hThick, p.hBead, p.hSpan, p.hTaper, K.geo.clearance].map((v) => (+v).toFixed(4)).join('|');
    if (K.hsig === sig) return a; K.hsig = sig;
    const H = hingeOpts(p, K.geo.clearance), A = K.up.geometry.attributes.position, B = K.lo.geometry.attributes.position;
    hingePositions({ ...H.u, closure: a.cu }, a.u, false, A.array); hingePositions({ ...H.l, closure: a.cl }, a.l, true, B.array);
    A.needsUpdate = B.needsUpdate = true; K.up.geometry.computeVertexNormals(); K.lo.geometry.computeVertexNormals(); K.up.geometry.computeBoundingSphere(); K.lo.geometry.computeBoundingSphere();
    K.theta = a; return a;
  }
  /** Acceptance probe (hinge only): force a lid state now (closure 0…1, slant as EyeRig slant units). The next sync() takes over again. */
  poseHinge(e, params, cu, cl, slant = 0) {
    const K = e && e._kfbClay; if (!K || K.mode !== 'hinge') return null;
    const p = this._params({ ...DEFAULTS, ...(params || {}) }); K.hsig = null; const a = this._rehinge(K, p, cu, cl);
    K.tilt.rotation.z = -(e._sx || 1) * slant * 0.85; K.fitNode.updateMatrixWorld(true); return a;
  }
  /** Jedes Bild nach rig.update(): misst/baut bei Bedarf, blendet die alten Schalen aus, setzt Lider aus den Rig-Signalen. */
  sync(rig, params) {
    if (!rig || !rig.eyes) return;
    const p = this._params({ ...DEFAULTS, ...(params || {}) });
    this._key = [p.shape, p.mech, p.look, p.fit, p.cover, p.coverLo, p.thickness, p.roundness, p.bulge, p.curve, p.curveLo, p.corner, p.reach, p.wrap].join('|');
    for (const e of rig.eyes) {
      if (!e || !e._up || !e._lids) continue;
      const C = e._kfbClay;
      if (!p.on) { if (C) { C.fitNode.visible = false; e._up.visible = e._lo.visible = true; } continue; }
      const fit = this._measure(e);
      if (!C || C.key !== this._key || C.R !== rig._R || (fit && C.fit && Math.abs(fit.ext - C.fit.ext) > 0.01)) { this._build(e, rig._R, p, fit); this._place(e._kfbClay, fit); }
      const K = e._kfbClay; if (fit && K.fitSig !== fit.sig) { this._place(K, fit); K.fit = fit; }
      e._up.visible = false; e._lo.visible = false; K.fitNode.visible = true;
      K.tilt.rotation.z = e._lids.rotation.z;   // Slant + Asymmetrie aus dem Rig
      const pu = (1.30 + e._up.rotation.x) / 1.18, pl = (1.30 - e._lo.rotation.x) / 1.18;
      if (K.mode === 'pad') { K.up.rotation.x = (e._up.rotation.x - REST_U) * p.sweep - p.open; K.lo.rotation.x = (e._lo.rotation.x - REST_L) * p.sweep + p.open; }
      else if (K.mode === 'hinge') this._rehinge(K, p, pu, pl);
      else { const r = rims(p, pu, pl);
        if (K.mode === 'fold') { K.up.rotation.x = -(r.u + 0.03); K.lo.rotation.x = 0.03 - r.l; }   // +x rotation LOWERS the front rim
        else this._reglide(K, p, r.u, r.l); }
      if (p.color) K.mat.color.set(p.color); else if (e._up.material && e._up.material.color) K.mat.color.copy(e._up.material.color);
    }
  }
  report(rig) { const e = rig && rig.eyes && rig.eyes[0], K = e && e._kfbClay; return K ? { schema: SCHEMA, donor: DONOR, mode: K.mode, eyes: rig.eyes.filter((x) => x && x._kfbClay).length, upTris: K.up.geometry.index.count / 3, loTris: K.lo.geometry.index.count / 3,
    fit: K.fit ? { half: K.fit.half.toArray().map((v) => +v.toFixed(4)), ext: +K.fit.ext.toFixed(3) } : null, clearance: +K.geo.clearance.toFixed(3) } : null; }
  dispose() { for (const e of this.eyes) { const K = e._kfbClay; if (!K) continue; K.up.geometry.dispose(); K.lo.geometry.dispose(); K.fitNode.removeFromParent(); K.mat.dispose(); delete e._kfbClay; if (e._up) e._up.visible = true; if (e._lo) e._lo.visible = true; } this.eyes.clear(); }
}
