/* clay-lids.v1.js — volumetrische Clay-Lider auf dem EyeRig v6 (2026-09-26).
 * DONOR: PR #159 Eye Actor Studio v1 · branch chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21
 *   tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs (kfb.upper-lid-volume/0.3-candidate)
 *   Vertrag: skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/EYELID_GEOMETRY_CONTRACT.v1.md
 * `buildUpperLidVolumeGeometry` ist 1:1 übernommen (geschlossenes Volumen: Außen-Clay · Innenfläche am
 * Augapfel · harte Öffnungskante · geschlossene Seiten). Neu hier nur die Einbindung:
 *  · Unterlid = dieselbe Konstruktion, an y gespiegelt (Vertrag §15 »zwei Hälften einer Schale«).
 *  · Bewegung = SWEEP (§16.1): die Lider hängen im Lid-Gelenk `e._lids` des EyeRig und drehen um die
 *    lokale X-Achse mit genau dem Winkel, den der Rig seinen alten Schalen gibt (Blinzeln, Emotes,
 *    Lid-Regler, Slant laufen ohne neuen Code mit). Die alten Schalen `_up/_lo` werden nur verborgen.
 *  · Material: Farbe des alten Lids (Kopf-Ton), überschreibbar.
 * Status: Kandidat. Georgs Sichtabnahme (Vertrag §13/§15.10) steht aus. */
export const SCHEMA = 'kfb.clay-lids/0.1';
export const DONOR = { pr: 159, branch: 'chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21', file: 'tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs', schema: 'kfb.upper-lid-volume/0.3-candidate' };
export const DEFAULTS = Object.freeze({ on: false, cover: 0.16, coverLo: 0.12, thickness: 0.24, roundness: 0.72, bulge: 0.42, curve: 0, curveLo: 0, reach: 0.85, wrap: 1.45, open: 0.38, sweep: 0.85, color: null });
export const DONOR_LOOK = Object.freeze({ reach: 0, wrap: 1.04 });   // PR #159 kompakter Pad, 1:1
export const META = [
  ['cover', 'Upper · cover at rest', 0, 1, 0.01], ['coverLo', 'Lower · cover at rest', 0, 1, 0.01],
  ['thickness', 'Thickness · clay body', 0.08, 0.5, 0.01], ['roundness', 'Roundness', 0, 1, 0.01], ['bulge', 'Bulge · central fullness', 0, 1, 0.01],
  ['curve', 'Upper edge · − concave · + convex', -1, 1, 0.01], ['curveLo', 'Lower edge · − concave · + convex', -1, 1, 0.01],
  ['reach', 'Reach · 0 compact pad (PR #159) → 1 over the crown', 0, 1, 0.01], ['wrap', 'Wrap · around the sides (rad)', 0.8, 1.6, 0.01],
  ['open', 'Open · rest opening (rad, both lids swing back)', -0.3, 0.9, 0.01],
  ['sweep', 'Sweep · how far blink/lid sliders swing the lids', 0, 1.5, 0.01],
];
const REST_U = -(1.30 - 0.12 * 1.18), REST_L = 1.30 - 0.06 * 1.18;   // EyeRig v6 Ruhewinkel (_rest u 0.12 / l 0.06)

const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
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
function lowerFrom(THREE, o) {   // dieselbe Konstruktion, an y gespiegelt, Wicklung umgedreht
  const g = buildUpperLidVolumeGeometry(THREE, o); g.scale(1, -1, 1);
  const ix = g.index.array; for (let t = 0; t < ix.length; t += 3) { const b = ix[t + 1]; ix[t + 1] = ix[t + 2]; ix[t + 2] = b; }
  g.index.needsUpdate = true; g.computeVertexNormals(); g.userData.lower = true; return g;
}
export class ClayLids {
  constructor(THREE) { this.T = THREE; this.ver = 0; this._key = ''; this.eyes = new Set(); }
  _build(e, R, p) {
    const T = this.T, old = e._kfbClay; if (old) { old.up.geometry.dispose(); old.lo.geometry.dispose(); old.up.removeFromParent(); old.lo.removeFromParent(); old.mat.dispose(); }
    const base = { radius: R, thickness: p.thickness, roundness: p.roundness, bulge: p.bulge, reach: p.reach, lonMax: p.wrap };
    const mat = (e._up.material && e._up.material.clone) ? e._up.material.clone() : new T.MeshStandardMaterial({ color: 0xf2c93c });
    mat.side = T.FrontSide; mat.transparent = false; mat.opacity = 1; mat.depthWrite = true; if ('roughness' in mat) mat.roughness = 0.84; if ('metalness' in mat) mat.metalness = 0; mat.name = 'KFB_ClayLid'; mat.needsUpdate = true;
    const up = new T.Mesh(buildUpperLidVolumeGeometry(T, { ...base, cover: p.cover, curve: p.curve }), mat);
    const lo = new T.Mesh(lowerFrom(T, { ...base, cover: p.coverLo, curve: -p.curveLo }), mat);
    for (const m of [up, lo]) { m.castShadow = true; m.userData.noMeasure = true; m.userData.petOverlay = true; m.raycast = () => {}; e._lids.add(m); }
    up.name = 'kfb-clay-lid · upper'; lo.name = 'kfb-clay-lid · lower';
    e._kfbClay = { up, lo, mat, key: this._key, R }; this.eyes.add(e);
  }
  /** Jedes Bild nach rig.update(): baut bei Bedarf, blendet die alten Schalen aus, überträgt den Sweep. */
  sync(rig, params) {
    if (!rig || !rig.eyes) return;
    const p = { ...DEFAULTS, ...(params || {}) };
    this._key = [p.cover, p.coverLo, p.thickness, p.roundness, p.bulge, p.curve, p.curveLo, p.reach, p.wrap].join('|');
    for (const e of rig.eyes) {
      if (!e || !e._up || !e._lids) continue;
      const C = e._kfbClay;
      if (!p.on) { if (C) { C.up.visible = C.lo.visible = false; e._up.visible = e._lo.visible = true; } continue; }
      if (!C || C.key !== this._key || C.R !== rig._R || C.up.parent !== e._lids) this._build(e, rig._R, p);
      const K = e._kfbClay;
      e._up.visible = false; e._lo.visible = false; K.up.visible = K.lo.visible = true;
      K.up.rotation.x = (e._up.rotation.x - REST_U) * p.sweep - p.open;
      K.lo.rotation.x = (e._lo.rotation.x - REST_L) * p.sweep + p.open;
      if (p.color) K.mat.color.set(p.color); else if (e._up.material && e._up.material.color) K.mat.color.copy(e._up.material.color);
    }
  }
  report(rig) { const e = rig && rig.eyes && rig.eyes[0], K = e && e._kfbClay; return K ? { schema: SCHEMA, donor: DONOR, eyes: rig.eyes.filter((x) => x && x._kfbClay).length, upTris: K.up.geometry.index.count / 3, loTris: K.lo.geometry.index.count / 3, closedVolume: !!K.up.geometry.userData.closedVolume } : null; }
  dispose() { for (const e of this.eyes) { const K = e._kfbClay; if (!K) continue; K.up.geometry.dispose(); K.lo.geometry.dispose(); K.up.removeFromParent(); K.lo.removeFromParent(); K.mat.dispose(); delete e._kfbClay; if (e._up) e._up.visible = true; if (e._lo) e._lo.visible = true; } this.eyes.clear(); }
}
