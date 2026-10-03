/* KFB · S16 · Batch-EyeRig im Atlas (EYE-RIG-BATCH, ToolBox-Stage eye-rig-batch @ cloudflare-live).
   Quelle der Werte, unverändert kopiert nach data/eye-rig/:
   · rig-large-reviewed.v1.json   — Georg 2026-09-20, vier Large-Profile ADJUSTED_APPROVED
   · eye-rig-medium.batch-1.json  — tools/KFB-ToolBox/_inbox/eye-rig-medium.batch (1).json @ main, 33 Medium-Profile
   Laufzeit wie kaykit-eye-adapter.v1.js + medium-source-eye-cleanup.v1.js der Stage, mit drei Atlas-Regeln:
   1. Kopf-Geometrie wird VOR dem Ausblenden geklont. instance() teilt Geometrie zwischen Klonen; ein zweites
      Ausblenden auf derselben Geometrie fände das nächstvordere Paar (Mund, Nase) und nähme es weg.
   2. Identitätsprüfung statt Vertrauen: das gefundene Augenpaar muss dieselbe Dreieckszahl und Tiefe haben wie
      das, auf dem Georg das Profil abgenommen hat (sourceFace.genericDetector.report). Sonst: nichts ausblenden,
      kein Auge setzen, Grund melden. Vier Augen sind schlimmer als zwei originale.
   3. Lidfarbe = Profilwert, sonst sourceFace.faceColor, sonst zur Laufzeit am Kopf gemessen (face-color-sampler).
      Der Rückfall #b58f83 wird nur benutzt, wenn alle drei fehlen, und dann gemeldet. */
import { EyeRig } from './pet-eye-rig.v6.js';
import { buildFaceHost } from './facehost.v1.js';
import { findDonorEyes, stripDonorEyes } from './donoreyes.v1.js';
import { attach as attachOval, DEFAULTS as OVAL0 } from './eyeoval.v1.js';
import { sampleActorFaceColor } from './face-color-sampler.v1.js';

export const SCHEMA = 'kfb.atlas-batch-eyes/0.1';
export const SOURCES = {
  large: { file: 'data/eye-rig/rig-large-reviewed.v1.json', from: 'kfb-hub/stage/toolbox/eye-rig-batch/data/rig-large-reviewed.v1.json @ cloudflare-live' },
  medium: { file: 'data/eye-rig/eye-rig-medium.batch-1.json', from: 'tools/KFB-ToolBox/_inbox/eye-rig-medium.batch (1).json @ main 71394636' }
};
/* Welche Review-Stände montiert werden. ADJUSTED = von Georg im Batch eingestellt, aber nicht als approved
   exportiert (31 von 33 Medium). Standard: beide, sichtbar unterschieden im Bericht. */
export const BATCH = { accept: new Set(['ADJUSTED_APPROVED', 'ADJUSTED']), byPath: new Map(), ready: null, counts: null };

export function loadBatchProfiles() {
  if (BATCH.ready) return BATCH.ready;
  const url = (f) => new URL('../../' + f, import.meta.url).href;
  BATCH.ready = Promise.all([SOURCES.large, SOURCES.medium].map((s) => fetch(url(s.file)).then((r) => r.ok ? r.json() : null).catch(() => null)))
    .then((sets) => {
      const counts = {};
      for (const set of sets) for (const p of (set && set.profiles) || []) {
        if (!p.source || !p.source.path) continue;
        BATCH.byPath.set(p.source.path, p);
        counts[p.reviewState] = (counts[p.reviewState] || 0) + 1;
      }
      BATCH.counts = counts;
      return BATCH;
    });
  return BATCH.ready;
}
export function batchProfileFor(path) {
  const p = BATCH.byPath.get(path);
  return p && BATCH.accept.has(p.reviewState) ? p : null;
}

function headMeshes(figure, preferred) {
  const out = [];
  figure.traverse((n) => { if (n.isSkinnedMesh && n.geometry && n.geometry.index && /head|face|skull/i.test(n.name || '')) out.push(n); });
  out.sort((a, b) => (b.name === preferred) - (a.name === preferred));
  return out;
}

export function mountBatchEyes({ THREE, figure, profile, log = () => {} }) {
  const T = THREE, sf = profile.sourceFace || {}, want = (sf.genericDetector && sf.genericDetector.report) || null;
  const heads = headMeshes(figure, sf.headMesh);
  if (!heads.length) return { status: 'UNSUPPORTED', reason: 'kein Kopf-Mesh mit Index' };
  /* 1 · Identität: dasselbe Paar wie bei der Abnahme */
  let mesh = null, found = null;
  for (const m of heads) {
    const f = findDonorEyes({ THREE: T, mesh: m });
    if (f.status !== 'OK') continue;
    if (want && (f.report.tris !== want.tris || Math.abs(f.report.z - want.z) > 0.02)) {
      return { status: 'MISMATCH', reason: `Augenpaar ${f.report.tris} Dreiecke / z ${f.report.z} ≠ abgenommen ${want.tris} / z ${want.z}` };
    }
    mesh = m; found = f; break;
  }
  if (!mesh && want) return { status: 'UNSUPPORTED', reason: 'kein gespiegeltes Augenpaar am Kopf-Mesh (bei der Abnahme gab es eins)' };
  /* Kein Paar jetzt UND keins bei der Abnahme (Skelette, Mannequin: Augenhöhlen statt Augeninseln) — Georg hat die Augen
     dort über dem unveränderten Kopf eingestellt. Gleiche Lage wie bei der Abnahme: nichts ausblenden, Augen setzen. */
  let strip = { removedTris: 0 }, restore = () => {};
  if (mesh) {
    const shared = mesh.geometry;
    mesh.geometry = shared.clone();
    const g = mesh.geometry, hadGroups = g.groups.length > 0;
    if (!hadGroups) g.addGroup(0, g.index.count, 0);
    strip = stripDonorEyes({ THREE: T, headRoot: mesh, log });
    if (strip.status !== 'OK') { mesh.geometry.dispose(); mesh.geometry = shared; return { status: 'UNSUPPORTED', reason: 'Ausblenden fehlgeschlagen: ' + strip.status }; }
    restore = () => { if (mesh.geometry !== shared) { mesh.geometry.dispose(); mesh.geometry = shared; } };
  } else mesh = heads[0];
  /* 3 · FaceHost + EyeRig mit den Profilwerten */
  figure.updateMatrixWorld(true);
  const host = buildFaceHost({ THREE: T, figure, shape: 'ellipsoid', log });
  if (!host || host.status !== 'OK') { restore(); return { status: 'UNSUPPORTED', reason: 'FaceHost: ' + ((host && host.reason) || '?') }; }
  const eye = profile.eye || {};
  let base = eye.baseColor || sf.faceColor || null, colorSource = eye.baseColor ? 'profil' : sf.faceColor ? 'sourceFace' : null;
  if (!base) {
    const s = sampleActorFaceColor({ THREE: T, figure, faceHost: host, anchor: eye.anchor, preferredHeadMesh: sf.headMesh, log });
    if (s.status === 'OK') { base = s.color; colorSource = 'gemessen · ' + s.sampleCount + ' Proben'; }
  }
  if (!base) { base = '#b58f83'; colorSource = 'RÜCKFALL (nicht gemessen)'; }
  const rig = new EyeRig(host.faceCtx(), {
    anchor: JSON.parse(JSON.stringify(eye.anchor || {})),
    pupilStyle: eye.pupilStyle || 'matte-cute', pupilSize: eye.pupilSize ?? 0.34, gloss: eye.gloss ?? 0.1,
    inset: eye.inset ?? 0, lidFit: eye.lidFit ?? 0.9, converge: eye.converge ?? 0, splay: eye.splay ?? 0,
    baseColor: new T.Color(base).getHex(),
    blink: { ...(profile.blink || {}) }, life: { ...(profile.life || {}) }, kinetics: { ...(profile.kinetics || {}) },
    lashes: { length: 0, density: 0, width: 1 }
  });
  rig.build();
  const oval = { ...OVAL0, ...(eye.oval || {}) };
  attachOval(rig, () => oval);
  rig.applyEmote({});
  rig.setGazeFollow(false);
  for (let i = 0; i < 16; i++) rig.update(1 / 60);
  if (!rig.eyes || !rig.rig) { rig.dispose(); host.dispose(); restore(); return { status: 'UNSUPPORTED', reason: 'EyeRig baute keine Augen' }; }
  rig.rig.traverse((m) => { if (m.isMesh) { m.userData.noClay = true; m.userData.noCast = true; m.userData.eyeRig = true; } });
  const rep = {
    status: 'OK', schema: SCHEMA, actorId: profile.actorId, rigClass: profile.rigClass, reviewState: profile.reviewState,
    head: mesh.name, removed: strip.removedTris, lid: '#' + new T.Color(base).getHexString(), lidSource: colorSource,
    anchor: eye.anchor, inset: +(+eye.inset || 0).toFixed(3)
  };
  log(`Batch-EyeRig · ${profile.actorId} · ${profile.reviewState} · ${strip.removedTris} Augen-Dreiecke ausgeblendet · Lid ${rep.lid} (${colorSource})`);
  return { ...rep, rig, host, update: (dt) => rig.update(dt), dispose: () => { rig.dispose(); host.dispose(); restore(); } };
}
