/* KFB · face-mount.v1 — EIN LESER FÜR DAS GESICHT auf Figuren, die KEIN Graft sind.
 *
 * Georg 26.09.: »beim neuen FrizzleBob-Rig gibt es keine Möglichkeit, Augenrig, Brauen, Mund und Nase
 * zu platzieren wie bei den anderen Rigs.« Der Driver bekommt sein Gesicht über `graft-mount.v1`
 * (Schritte 3–4). FrizzleBob Ear Rig v5 ist kein Graft — ein eigener KayKit-Rig_Medium-Körper mit
 * gemalten Gesichtsteilen als eigene Knoten unter `head`. Dieses Modul ist Schritt 3–4 von
 * `graft-mount.v1.js` WÖRTLICH, nur mit `facehost.v1` als Kopf statt GraftBiped:
 *   facehost → EyeRig → Oval → Kopfzonen → Braue → Nase → Bart → Mund
 * Dazu die Originalteile der Figur über `partrig.v1` (sichtbar schalten, um die eigene Mitte
 * skalieren/verschieben/kippen) — die Regel aus Studio v18 »Original parts · KayKit vs. our overlay«.
 *
 * VERTRAG: der Eintrag ist ein `kfb.pets/1`-Eintrag mit DENSELBEN Feldnamen, die `mountGraft` liest
 * (eye.anchor/pupilStyle/pupilSize/gloss/lidFit/lashes/oval/sclera/pupil · brow.* · nose.* ·
 * moustache.* · mouth.* · color). Neu und nur hier: `parts` (Quelle je Gesichtsteil) und
 * `original.{brows,nose,mouth}` (PartRig-Felder). Kein Feld wird umbenannt.
 *
 * EIGENTUM: dieses Modul besitzt nur die Reihenfolge und die Feldzuordnung. Jede Form gehört ihrem
 * Modul — hier wird nichts gezeichnet. Die Module bringt der Aufrufer mit (`M`), damit es keinen
 * zweiten Import derselben Datei gibt.
 */
export const SCHEMA = 'kfb.face-mount/1';
export const ORIGINAL_NAMES = { eyes: /^FB_Eye_[LR]$/, brows: /^Carl_Brow_[LR]$/, nose: /^Carl_Nose$/, mouth: /^FB_Mouth/ };
export const PARTS = ['eyes', 'brows', 'nose', 'mouth', 'moustache'];
/* Vorgaben — aus den Modulen bzw. graft-mount übernommen, nicht erfunden. */
export const EYE_DEF = { anchor: { dx: 0.345, dy: -0.10, ring: 0.30, track: 0.10 }, pupilStyle: 'matte-cute', pupilSize: 0.4, gloss: 0.85, lidFit: 0.9, inset: 0, converge: 0, splay: 0,
  lashes: { length: 0, density: 6, width: 1 }, oval: { w: 1, h: 1, d: 1, tilt: 0 }, sclera: null, pupil: null };
const MOUTH_DEF = { size: 0.44, dy: -0.52, sx: 1, dx: 0, tilt: 0, rot: 0, bend: 0, set: 'male', lift: 0.03, wrap: 1, onTop: false };
const hexInt = (h) => (typeof h === 'number' ? h : parseInt(String(h).replace('#', ''), 16));
const clone = (v) => JSON.parse(JSON.stringify(v));
const getP = (o, path) => path.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o);
const setP = (o, path, v) => { const ks = path.split('.'); let a = o; for (let i = 0; i < ks.length - 1; i++) { if (a[ks[i]] == null || typeof a[ks[i]] !== 'object') a[ks[i]] = {}; a = a[ks[i]]; } a[ks[ks.length - 1]] = v; };

/** Originalteile nach NAMEN (sie sind eigene Knoten im Export) — oberstes Objekt je Treffer. */
export function findOriginalParts(figure) {
  const out = { eyes: [], brows: [], nose: [], mouth: [] };
  figure.traverse((n) => {
    for (const k of Object.keys(out)) {
      if (!ORIGINAL_NAMES[k].test(n.name || '')) continue;
      let up = n.parent, dup = false; while (up) { if (ORIGINAL_NAMES[k].test(up.name || '')) dup = true; up = up.parent; }
      if (!dup && !out[k].includes(n)) out[k].push(n);
    }
  });
  return out;
}

/* PartRig dreht und skaliert um die Mitte der GEOMETRIE im Elternraum. Die v5-Teile tragen einen
   eigenen Knotenversatz (−1,23 in y unter `head`) — ohne Einrechnen läge der Drehpunkt 1,2 Einheiten
   neben dem Teil. Also: Knotentransform in eine GEOMETRIE-KOPIE backen, Knoten auf Identität. Das Bild
   bleibt gleich, die Quelldatei unberührt. */
function bake(mesh) {
  if (!mesh.isMesh || mesh.userData._kfbBaked) return;
  mesh.updateMatrix();
  const g = mesh.geometry.clone(); g.applyMatrix4(mesh.matrix); g.computeBoundingBox();
  mesh.geometry = g; mesh.position.set(0, 0, 0); mesh.quaternion.identity(); mesh.scale.set(1, 1, 1); mesh.updateMatrix();
  mesh.userData._kfbBaked = true;
}

/** Augen um die Hochachse drehen und auf die Host-Fläche setzen (Spanne außerhalb 0…1, siehe makeFaceApi). */
export function yawEyes(THREE, rig, s) {
  const body = rig.rig && rig.rig.parent; if (!body || !body.geometry || !rig.eyes) return;
  const g = body.geometry; if (!g.boundingBox) g.computeBoundingBox();
  const lc = g.boundingBox.getCenter(new THREE.Vector3()), U = g.boundingBox.getSize(new THREE.Vector3()).y / 2, A = rig.anchor, R = rig._R;
  const ray = new THREE.Raycaster(); ray.layers.enableAll(); body.updateMatrixWorld(true);
  for (const e of rig.eyes) {
    const sx = e._sx || 1, ang = sx * Math.max(-1, Math.min(2, s)) * Math.PI / 4;
    const ex = lc.x + sx * U * A.dx, ey = lc.y + U * A.dy, dir = new THREE.Vector3(Math.sin(ang), 0, Math.cos(ang));
    e.rotation.y = ang;
    ray.set(body.localToWorld(new THREE.Vector3(ex, ey, lc.z).addScaledVector(dir, U * 3.5)), dir.clone().negate().transformDirection(body.matrixWorld).normalize());
    const hit = ray.intersectObject(body, false)[0];
    if (hit) e.position.copy(body.worldToLocal(hit.point.clone())).addScaledVector(dir, -R * (0.24 + (rig.inset || 0) * 1.15));
  }
}

/** Feldzuordnung Pfad → Besitzer. Für Driver (Graft-Handle) und v5 dieselbe. */
export function makeFaceApi({ THREE, M, rig, brow = null, nose = null, moust = null, mouth = null, orig = {}, entry, fctx = null, kind = 'facehost', log = () => {} }) {
  const p = clone(entry || {});
  p.eye = { ...clone(EYE_DEF), ...(p.eye || {}) };
  p.eye.anchor = { ...EYE_DEF.anchor, ...((entry && entry.eye && entry.eye.anchor) || {}) };
  p.eye.lashes = { ...EYE_DEF.lashes, ...((entry && entry.eye && entry.eye.lashes) || {}) };
  p.eye.oval = { ...EYE_DEF.oval, ...((entry && entry.eye && entry.eye.oval) || {}) };
  p.brow = { ...((M.Brow && M.Brow.DEFAULTS) || {}), ...(p.brow || {}) };
  p.nose = { ...((M.Nose && M.Nose.DEFAULTS) || {}), enabled: true, ...(p.nose || {}) };
  p.moustache = { ...((M.Moust && M.Moust.DEFAULTS) || {}), ...(p.moustache || {}) };
  p.mouth = { ...MOUTH_DEF, ...(mouth && mouth.p ? { size: mouth.p.size, dy: mouth.p.dy, sx: mouth.p.sx, dx: mouth.p.dx, tilt: mouth.p.tilt, rot: mouth.p.rot, lift: mouth.p.lift, wrap: mouth.p.wrap, set: mouth.setId || mouth.p.set } : {}), ...(p.mouth || {}) };
  const PR = (M.PartRig && M.PartRig.DEFAULTS) || { scale: 1, spread: 0, lift: 0, depth: 0, tilt: 0 };
  p.original = p.original || {};
  for (const k of ['brows', 'nose', 'mouth']) { const d = { ...PR }; delete d.enabled; p.original[k] = { ...d, ...(p.original[k] || {}) }; }
  const hasOrig = { eyes: !!(orig.eyes && orig.eyes.length), brows: !!orig.brows, nose: !!orig.nose, mouth: !!orig.mouth };
  const defMode = (k) => (hasOrig[k] ? 'original' : 'rig');
  p.parts = { eyes: defMode('eyes'), brows: brow ? defMode('brows') : 'original', nose: defMode('nose'), mouth: defMode('mouth'), ...(p.parts || {}) };
  p.moustache.enabled = !!p.moustache.enabled;

  /* YAW (Georg 26.09.: »Augen … nach außen bzw. nach innen drehen … an der Seite des Kopfes wie ein Frosch,
     korrekt in der Kopfform drin«). Feld bleibt `eye.splay` (v6, Winkel = splay × 45°). Das Modul klemmt auf
     0…1; hier wächst nur die SPANNE auf −1…2 (−45° innen … 90° seitlich). 0…1 läuft unverändert durch den
     Eigentümer. Außerhalb davon dieselbe v6a-Formel — Strahl entlang der gedrehten Blickachse auf die
     Host-Fläche, Treffer minus R·(0,24 + inset·1,15) —, also sitzt das Auge auch seitlich IN der Kopfform. */
  if (!rig.__kfbYaw && typeof rig.build === 'function') {
    rig.__kfbYaw = true; const b0 = rig.build.bind(rig);
    rig.build = function () {
      const s = +this.splay || 0, ext = s < 0 || s > 1; if (ext) this.splay = 0;
      const r = b0(); if (ext) { this.splay = s; try { yawEyes(THREE, this, s); } catch (e) { log('eye yaw: ' + e.message); } } return r;
    };
    if ((+rig.splay || 0) < 0 || (+rig.splay || 0) > 1) rig.build();
  }
  const api = { schema: SCHEMA, kind, THREE, M, rig, brow, nose, moust, mouth, orig, entry: p, hasOrig, rejected: [], applied: [] };
  const eyeFrame = () => rig.eyeFrame();
  api.ensureMoust = () => {
    if (api.moust || !M.Moust) return api.moust;
    try {
      const D = M.Moust.DEFAULTS, base = M.Moust.paramsForStyle(p.moustache.style || 'walrus') || { ...D }, params = { ...D, ...base };
      for (const k of Object.keys(D)) if (p.moustache[k] !== undefined) params[k] = p.moustache[k];
      api.moust = new M.Moust.MoustacheRig({ THREE, getEyeFrame: eyeFrame, getNose: () => (api.nose && api.nose.mesh.visible ? api.nose.frame : null), baseColor: hexInt(p.color || '#f2c93c'), seed: 2002, params });
    } catch (e) { log('moustache: ' + e.message); }
    return api.moust;
  };

  /* Sichtbarkeit je Quelle. Die Augen werden NIE abgebaut: Braue, Nase und Bart hängen an eyeFrame(). */
  api.applyModes = () => {
    const P = p.parts, t = (f) => { try { f(); } catch (e) { log('modes: ' + e.message); } };
    if (rig.rig) rig.rig.visible = P.eyes === 'rig';
    (orig.eyes || []).forEach((o) => { o.visible = P.eyes === 'original'; });
    if (brow) t(() => brow.set({ enabled: P.brows === 'rig' }));
    if (orig.brows) t(() => orig.brows.set({ enabled: P.brows === 'original' }));
    if (nose) t(() => nose.set({ enabled: P.nose === 'rig' }));
    if (orig.nose) t(() => orig.nose.set({ enabled: P.nose === 'original' }));
    if (mouth && mouth.mesh) mouth.mesh.visible = P.mouth === 'rig';
    if (orig.mouth) t(() => orig.mouth.set({ enabled: P.mouth === 'original' }));
    if (p.moustache.enabled) api.ensureMoust();
    if (api.moust) t(() => api.moust.set({ enabled: !!p.moustache.enabled }));
  };

  /** Ein Feld setzen → Eintrag + Besitzer. Rückgabe {status} wie bei den Modulen. */
  api.set = (path, v) => {
    const [head, ...rest] = path.split('.'), k = rest.join('.');
    try {
      if (path === 'color') { p.color = v; rig.setBaseColor(hexInt(v)); if (brow && brow.setBaseColor) brow.setBaseColor(hexInt(v)); if (api.moust && api.moust.setBaseColor) api.moust.setBaseColor(hexInt(v)); api.applyModes(); return { status: 'OK' }; }
      if (head === 'parts') {
        p.parts[k] = v;
        /* Graft: dieselbe Entscheidung auch in den Feldern, die mountGraft liest (brow/nose.mod · enabled). */
        if (kind === 'graft' && (k === 'brows' || k === 'nose')) { const q = k === 'brows' ? p.brow : p.nose; q.enabled = v !== 'off'; if (v === 'rig') q.mod = 'drawn'; else if (v === 'original') q.mod = 'carl-original'; }
        api.applyModes(); return { status: 'OK' };
      }
      if (head === 'eye') {
        setP(p, path, v);
        if (rest[0] === 'anchor') rig.setAnchor({ [rest[1]]: v });
        else if (rest[0] === 'lashes') rig.setLashes({ [rest[1]]: v });
        else if (rest[0] === 'oval') { if (M.Oval) M.Oval.applyOval(rig, p.eye.oval); }
        else if (k === 'pupilStyle') rig.setPupilStyle(v);
        else if (k === 'sclera' || k === 'pupil') { if (M.Head) M.Head.paintEyes(rig, { sclera: p.eye.sclera, pupil: p.eye.pupil }); }
        else rig.setEye({ [k]: v });
        api.applyModes(); return { status: 'OK' };
      }
      if (head === 'brow') {
        if (!brow) return { status: 'UNSUPPORTED', reason: 'no brow owner' };
        if (k === 'expr') { p.brow.expr = v; if (brow.expression) brow.expression(v); return { status: 'OK' }; }
        if (k === 'form') { p.brow.solid = v !== 'strich'; p.brow.even = v === 'balken'; return brow.set({ solid: p.brow.solid, even: p.brow.even }) || { status: 'OK' }; }
        p.brow[k] = v; return brow.set({ [k]: v }) || { status: 'OK' };
      }
      if (head === 'nose') { if (!nose) return { status: 'UNSUPPORTED', reason: 'no nose owner' }; p.nose[k] = v; return nose.set({ [k]: v }) || { status: 'OK' }; }
      if (head === 'moustache') {
        p.moustache[k] = v; const m = api.ensureMoust(); if (!m) return { status: 'UNSUPPORTED', reason: 'moustache module missing' };
        if (k === 'style') { if (m.style) m.style(v); return { status: 'OK' }; }
        return m.set({ [k]: v }) || { status: 'OK' };
      }
      if (head === 'mouth') {
        if (!mouth) return { status: 'UNSUPPORTED', reason: 'no mouth owner' };
        if (v && typeof v === 'object') v = clone(v);
        p.mouth[k] = v; if (k === 'set') mouth.setSet(v); else mouth.setParams({ [k]: v && typeof v === 'object' ? clone(v) : v });
        api.applyModes(); return { status: 'OK' };
      }
      if (head === 'original') {
        const part = rest[0], f = rest[1], r = orig[part];
        if (!r) return { status: 'UNSUPPORTED', reason: 'no original ' + part };
        p.original[part][f] = v; return r.set({ [f]: v });
      }
      return { status: 'UNSUPPORTED', reason: 'unknown field ' + path };
    } catch (e) { return { status: 'UNSUPPORTED', reason: e.message }; }
  };
  api.get = (path) => getP(p, path);

  /** Ganzen Eintrag laden (Import / Zurücksetzen). Jedes Feld geht über set() — gemeldet wie bei mountCarl. */
  api.load = (e) => {
    const applied = [], rejected = [];
    const walk = (o, pre) => { for (const key of Object.keys(o || {})) { const v = o[key], path = pre ? pre + '.' + key : key;
      if (v && typeof v === 'object' && !Array.isArray(v) && !/^(visemeMap|restMap|points)$/.test(key)) walk(v, path);
      else if (/^(eye|brow|nose|moustache|mouth|original|parts)\./.test(path) || path === 'color') { const r = api.set(path, v); (r && r.status === 'OK' ? applied : rejected).push(r && r.status === 'OK' ? path : path + ' · ' + ((r && r.reason) || 'rejected')); } } };
    const src = clone(e || {}); const parts = src.parts; delete src.parts;
    walk(src, ''); if (parts) walk({ parts }, '');
    api.applied = applied; api.rejected = rejected; api.applyModes();
    return { applied, rejected };
  };
  api.export = () => clone(p);
  /** Rig-Anker auf das gemalte Teil messen (Raum des Face-Hosts: Mitte der Kopfbox = 0, Einheit U = halbe Boxhöhe — wie EyeRig/PetMouth rechnen). */
  api.fitToOriginal = (part) => {
    const host = fctx && fctx.__host; if (!host || !host.box) return { status: 'UNSUPPORTED', reason: 'no facehost' };
    const T = THREE, inner = host.inner, g = host.box.geometry; if (!g.boundingBox) g.computeBoundingBox();
    const U = g.boundingBox.getSize(new T.Vector3()).y / 2, v = new T.Vector3();
    const boxIn = (objs) => { const b = new T.Box3(); b.makeEmpty(); objs.forEach((o) => { if (!o) return; o.updateWorldMatrix(true, true); o.traverse((n) => { if (!n.isMesh || !n.geometry) return; const gg = n.geometry; if (!gg.boundingBox) gg.computeBoundingBox(); const bb = gg.boundingBox;
      for (let i = 0; i < 8; i++) { v.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(n.matrixWorld); b.expandByPoint(inner.worldToLocal(v.clone())); } }); }); return b; };
    if (part === 'eyes') {
      if (!orig.eyes || orig.eyes.length < 2) return { status: 'UNSUPPORTED', reason: 'no painted eyes' };
      const bl = boxIn([orig.eyes[0]]), br = boxIn([orig.eyes[1]]), cl = bl.getCenter(new T.Vector3()), cr = br.getCenter(new T.Vector3()), s = bl.getSize(new T.Vector3());
      const dx = +(Math.abs(cl.x - cr.x) / 2 / U).toFixed(3), dy = +(((cl.y + cr.y) / 2) / U).toFixed(3), ring = +((Math.max(s.x, s.y) / 2) / U).toFixed(3);
      api.set('eye.anchor.dx', dx); api.set('eye.anchor.dy', dy); api.set('eye.anchor.ring', ring);
      return { status: 'OK', dx, dy, ring };
    }
    if (part === 'mouth') {
      const m = orig.mouth && orig.mouth.items[0] && orig.mouth.items[0].mesh; if (!m) return { status: 'UNSUPPORTED', reason: 'no painted mouth' };
      const c = boxIn([m]).getCenter(new T.Vector3()), dx = +(c.x / U).toFixed(3), dy = +(c.y / U).toFixed(3);
      api.set('mouth.dx', dx); api.set('mouth.dy', dy); return { status: 'OK', dx, dy };
    }
    return { status: 'UNSUPPORTED', reason: 'fit only for eyes and mouth' };
  };

  /** Weltpunkt je Gesichtsteil — für Anfasser und Kamera. */
  api.anchorOf = (part) => {
    const T = THREE, P = p.parts, c = new T.Vector3(), box = new T.Box3();
    const centreOf = (objs) => { box.makeEmpty(); objs.forEach((o) => { if (o) { o.updateWorldMatrix(true, true); box.expandByObject(o); } }); return box.isEmpty() ? null : box.getCenter(c.clone()); };
    if (part === 'eyes') { if (P.eyes === 'original' && orig.eyes && orig.eyes.length) return centreOf([orig.eyes[0]]); return rig.eyes && rig.eyes[0] ? rig.eyes[0].getWorldPosition(new T.Vector3()) : null; }
    if (part === 'brows') { if (P.brows === 'original' && orig.brows) return centreOf([orig.brows.items[0] && orig.brows.items[0].mesh]); return brow && brow.mesh && brow.mesh.visible ? centreOf([brow.mesh]) : null; }
    if (part === 'nose') { if (P.nose === 'original' && orig.nose) return centreOf([orig.nose.items[0] && orig.nose.items[0].mesh]); return nose && nose.mesh && nose.mesh.visible ? centreOf([nose.mesh]) : null; }
    if (part === 'mouth') { if (P.mouth === 'original' && orig.mouth) return centreOf([orig.mouth.items[0] && orig.mouth.items[0].mesh]); return mouth && mouth.mesh && mouth.mesh.visible ? centreOf([mouth.mesh]) : null; }
    if (part === 'moustache') return api.moust && api.moust.mesh && api.moust.mesh.visible ? centreOf([api.moust.mesh]) : null;
    return null;
  };
  /** Welche zwei Felder ein Anfasser bewegt — je Quelle. */
  api.dragFields = (part) => {
    const P = p.parts;
    if (part === 'eyes') return P.eyes === 'rig' ? ['eye.anchor.dx', 'eye.anchor.dy'] : null;
    if (part === 'brows') return P.brows === 'rig' ? ['brow.x', 'brow.y'] : P.brows === 'original' ? ['original.brows.spread', 'original.brows.lift'] : null;
    if (part === 'nose') return P.nose === 'rig' ? ['nose.x', 'nose.height'] : P.nose === 'original' ? ['original.nose.spread', 'original.nose.lift'] : null;
    if (part === 'mouth') return P.mouth === 'rig' ? ['mouth.dx', 'mouth.dy'] : P.mouth === 'original' ? ['original.mouth.spread', 'original.mouth.lift'] : null;
    if (part === 'moustache') return p.moustache.enabled ? ['moustache.x', 'moustache.y'] : null;
    return null;
  };
  api.sync = (dt = 0, cam = null) => {
    if (brow) brow.sync(); if (nose) nose.sync(); if (api.moust) api.moust.sync();
    if (rig.rig && rig.rig.visible !== (p.parts.eyes === 'rig')) rig.rig.visible = p.parts.eyes === 'rig';   // build() legt die Gruppe neu an
  };
  api.update = (dt, cam) => {
    if (kind === 'facehost') { rig.update(dt); if (mouth) mouth.update(dt, cam); }
    api.sync(dt, cam);
    if (mouth && mouth.mesh && mouth.mesh.visible !== (p.parts.mouth === 'rig')) mouth.mesh.visible = p.parts.mouth === 'rig';
  };
  api.dispose = () => {
    const t = (f) => { try { f(); } catch (e) {} };
    if (kind === 'facehost') {
      if (mouth) t(() => mouth.dispose()); if (api.moust) t(() => api.moust.dispose()); if (nose) t(() => nose.dispose()); if (brow) t(() => brow.dispose());
      t(() => rig.dispose()); if (fctx && fctx.__host) t(() => fctx.__host.dispose());
    } else if (api.moust && api.moust !== moust) t(() => api.moust.dispose());
    ['brows', 'nose', 'mouth'].forEach((k) => { if (orig[k]) t(() => orig[k].set({ enabled: true, scale: 1, spread: 0, lift: 0, depth: 0, tilt: 0 })); });
    (orig.eyes || []).forEach((o) => { o.visible = true; });
  };
  return api;
}

/** Gesicht auf eine Figur mit Kopfknochen (kein Graft). */
export function mountFace({ THREE, M, figure, entry = {}, log = () => {} }) {
  if (!M || !M.FaceHost || !M.Rig) return { status: 'UNSUPPORTED', reason: 'facehost / EyeRig nicht geladen' };
  const host = M.FaceHost.buildFaceHost({ THREE, figure, log });
  if (host.status !== 'OK') return { status: 'UNSUPPORTED', reason: host.reason || host.status };
  const fctx = host.faceCtx(); fctx.__host = host;
  const e = entry || {}, eye = { ...clone(EYE_DEF), ...(e.eye || {}) };
  eye.anchor = { ...EYE_DEF.anchor, ...((e.eye && e.eye.anchor) || {}) };
  const color = e.color || '#f2c93c';
  const rig = new M.Rig.EyeRig(fctx, { anchor: eye.anchor, pupilStyle: eye.pupilStyle || 'matte-cute', pupilSize: eye.pupilSize, inset: eye.inset, lidFit: eye.lidFit,
    gloss: eye.gloss, converge: eye.converge, splay: eye.splay, lidSampler: null, baseColor: hexInt(color), lashes: { ...EYE_DEF.lashes, ...(eye.lashes || {}) } });
  rig.build();
  const liveEye = () => (api && api.entry ? api.entry.eye : eye);
  if (M.Oval) { try { M.Oval.attach(rig, () => liveEye().oval || M.Oval.DEFAULTS); } catch (err) { log('eyeoval: ' + err.message); } }
  if (M.Head) { try { M.Head.attach(rig, () => ({ sclera: liveEye().sclera != null ? liveEye().sclera : null, pupil: liveEye().pupil != null ? liveEye().pupil : null })); } catch (err) { log('headzones: ' + err.message); } }
  rig.setLife({ on: true, wander: 0.09, tremor: 0.045 });
  const eyeFrame = () => rig.eyeFrame();
  let brow = null, nose = null, mouth = null;
  const bp = e.brow || {};
  if (M.Brow) {
    const D = M.Brow.DEFAULTS, points = Array.isArray(bp.points) ? bp.points : M.Brow.pointsFor(bp.expr || 'neutral'), params = { ...D, points };
    for (const k of Object.keys(D)) if (bp[k] !== undefined) params[k] = bp[k];
    try { brow = new M.Brow.BrowRig({ THREE, getEyeFrame: eyeFrame, baseColor: hexInt(color), seed: 1001, params }); } catch (err) { log('brow: ' + err.message); }
  }
  const np = e.nose || {};
  if (M.Nose) {
    const D = M.Nose.DEFAULTS, params = { ...D, enabled: true };
    for (const k of Object.keys(D)) if (np[k] !== undefined) params[k] = np[k];
    try { nose = new M.Nose.NoseRig({ THREE, getEyeFrame: eyeFrame, params }); } catch (err) { log('nose: ' + err.message); }
  }
  if (M.Mouth) {
    try { mouth = new M.Mouth.PetMouth(fctx, { params: { ...MOUTH_DEF, ...(e.mouth || {}) } }); const set = (e.mouth && e.mouth.set) || 'male'; if (mouth.setId !== set) mouth.setSet(set); mouth.build(); mouth.rest = 'neutral'; mouth.setTex('neutral'); }
    catch (err) { log('mouth: ' + err.message); mouth = null; }
  }
  /* Originalteile */
  const found = findOriginalParts(figure), orig = { eyes: found.eyes };
  if (M.PartRig) {
    for (const k of ['brows', 'nose', 'mouth']) {
      const meshes = found[k].filter((o) => o.isMesh); if (!meshes.length) continue;
      meshes.forEach(bake);
      try { const r = new M.PartRig.PartRig({ THREE, parts: meshes.map((m) => ({ mesh: m })), islands: meshes.map((_, i) => i), label: k }); r.set({ enabled: true }); orig[k] = r; } catch (err) { log('partrig ' + k + ': ' + err.message); }
    }
  }
  var api = makeFaceApi({ THREE, M, rig, brow, nose, moust: null, mouth, orig, entry: e, fctx, kind: 'facehost', log });
  api.host = host; api.report = { head: host.report, originals: { eyes: found.eyes.length, brows: found.brows.length, nose: found.nose.length, mouth: found.mouth.length } };
  api.load(e); api.applyModes();
  /* Frischer Eintrag: Anker der Rig-Augen und des Rig-Munds auf die GEMALTEN Teile gemessen, nicht die Driver-Vorgabe geraten. */
  if (!(e.eye && e.eye.anchor) && found.eyes.length >= 2) api.fitToOriginal('eyes');
  if (!(e.mouth && e.mouth.dy != null) && orig.mouth) api.fitToOriginal('mouth');
  api.status = 'OK';
  return api;
}
export default mountFace;
