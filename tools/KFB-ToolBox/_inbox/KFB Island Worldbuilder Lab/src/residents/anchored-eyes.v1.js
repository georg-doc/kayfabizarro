/* KFB · S16 · Eye-Rig an gemessenen Ankern (EYE-CLEANUP-01, Georg PASS 01.10. für alle vier Figuren).
   Donoren, unverändert:
   · pet-eye-rig.v6.js (ToolBox-Cut 2026-10-01_r1 @ main): Geometrie, Lider, Blinzeln, Blick, Leben
   · facehost.v1.js: unsichtbarer Kopf-Host `body` am Kopfknochen, den der EyeRig zum Bauen braucht
   Neu hier, nur das: Der EyeRig SCHÄTZT seine Augenlage (anchor.dx/dy, Abtastung des Ellipsoids). Die NoEyes-Dateien
   bringen die Lage MIT: zwei Empties `eye_anchorl` / `eye_anchorr` (GLTFLoader streicht den Punkt) als Kinder von
   `head`, lokal +Z = Flächennormale nach außen, Scale = Augenradius. Nach build() wird jedes Auge auf seinen Anker
   gesetzt: Lage, Drehung, Größe. Weil Anker und Host am selben Knochen hängen, ist die Beziehung posenunabhängig.
   Lidfarbe = gemessene Haut aus eye-cleanup-01.json (Mummy_A: das schwarze Band, Georg: „bleibt"). */
import { EyeRig } from './pet-eye-rig.v6.js';
import { buildFaceHost } from './facehost.v1.js';

/* Augenmitte hinter der alten Kappenoberfläche, in Augenradien — wie der EyeRig selbst (R · 0,24 bei inset 0). */
export const SEAT = 0.24;

export function mountAnchoredEyes({ THREE, figure, skin = null, seat = SEAT, log = () => {} }) {
  const T = THREE;
  let aL = null, aR = null;
  figure.traverse((o) => { const n = (o.name || '').toLowerCase(); if (n === 'eye_anchorl') aL = o; else if (n === 'eye_anchorr') aR = o; });
  if (!aL || !aR) return { status: 'UNSUPPORTED', reason: 'keine eye_anchorl/r in der Datei' };
  const host = buildFaceHost({ THREE: T, figure, log });
  if (host.status !== 'OK') return { status: 'UNSUPPORTED', reason: 'faceHost: ' + host.reason };
  const ctx = host.faceCtx();
  const skinC = skin ? new T.Color(skin) : null;
  const rig = new EyeRig(ctx, { pupilStyle: 'matte-cute', inset: 0, lidFit: 0.9, baseColor: skinC ? skinC.getHex() : 0xf2c93c });
  rig.build();
  if (!rig.eyes || !rig.rig) { host.dispose(); return { status: 'UNSUPPORTED', reason: 'EyeRig baute keine Augen' }; }
  const body = ctx._body || host.box;
  figure.updateMatrixWorld(true);
  const inv = new T.Matrix4().copy(body.matrixWorld).invert();
  const rel = (a) => {
    const m = new T.Matrix4().multiplyMatrices(inv, a.matrixWorld), p = new T.Vector3(), q = new T.Quaternion(), s = new T.Vector3();
    m.decompose(p, q, s);
    return { p, q, r: (Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.z)) / 3, n: new T.Vector3(0, 0, 1).applyQuaternion(q) };
  };
  const A = [rel(aL), rel(aR)];
  /* EyeRig: Index 0 = sx −1. Zuordnung über das Vorzeichen in Host-Koordinaten, nicht über den Namen —
     „links" heißt im EyeRig Betrachterseite, im glTF Figurenseite. */
  const R = rig._R, done = [];
  for (const e of rig.eyes) {
    const a = A.slice().sort((u, v) => Math.sign(u.p.x) === Math.sign(e._sx) ? -1 : Math.sign(v.p.x) === Math.sign(e._sx) ? 1 : 0)[0];
    e.position.copy(a.p).addScaledVector(a.n, -a.r * seat);
    e.quaternion.copy(a.q);
    e.scale.setScalar(a.r / R);
    done.push(a);
  }
  rig._max = R * (rig.anchor.track / rig.anchor.ring);   // Blickweg in Einheiten des Augenradius, nicht des Kopfes
  rig.rig.traverse((m) => { if (m.isMesh) { m.userData.noClay = true; m.userData.noCast = true; m.userData.eyeRig = true; } });
  for (const e of rig.eyes) for (const l of [e._up, e._lo]) if (l && skinC) l.material.color.copy(skinC);
  const rep = { status: 'OK', head: host.report.head, radius: +A[0].r.toFixed(4), skin: skinC ? '#' + skinC.getHexString() : null, seat };
  log(`EyeRig an Ankern · r ${rep.radius} · Lid ${rep.skin || 'Standard'}`);
  return { ...rep, rig, host, update: (dt) => rig.update(dt), dispose: () => { rig.dispose(); host.dispose(); } };
}
