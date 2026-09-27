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
const isFacePart = (o) => { for (let q = o; q; q = q.parent) { const nm = q.name || ''; for (const k in ORIGINAL_NAMES) if (ORIGINAL_NAMES[k].test(nm)) return true; } return false; };
/* Georg 27.09. »Mund verschwindet beim Talk«: PetMouth schmiegt sich an die facehost-Box — eine unsichtbare Hülle, die
   am Mund ~0,05 HINTER der echten Kopfhaut liegt. Der Rig-Mund lag im Kopf, die Tiefenprüfung schluckte ihn. Nach jedem
   refit()/setParams() wird jede Mund-Ecke entlang der Mund-Normalen auf die ECHTE Haut der Figur gesetzt (+ EPS).
   Haut = die Meshes der Figur VOR dem Mount, ohne die gemalten Originalteile (Augen · Brauen · Nase · Mund). */
function wrapMouthToSkin(THREE, mouth, figure, skin, api) {
  const T = THREE, EPS = 0.006, ray = new T.Raycaster(), o = new T.Vector3(), d = new T.Vector3(), v = new T.Vector3(), inv = new T.Matrix4(), q = new T.Quaternion();
  let busy = false, proxy = null;
  /* Skinned-Raycast kostet ~300 ms für 52 Ecken — die getroffene Haut wird EINMAL in den Raum des Mund-Trägers gebacken
     (Kopfknochen folgt, Kopfhaut ist starr) und danach als statisches Mesh abgetastet: wenige ms je refit. */
  const bake = (sm, par) => {
    const g = sm.geometry, P = g.attributes.position, out = new Float32Array(P.count * 3), w = new T.Vector3(), pinv = new T.Matrix4().copy(par.matrixWorld).invert();
    const bt = sm.isSkinnedMesh ? (sm.applyBoneTransform || sm.boneTransform) : null;
    for (let i = 0; i < P.count; i++) { w.fromBufferAttribute(P, i); if (bt) bt.call(sm, i, w); w.applyMatrix4(sm.matrixWorld).applyMatrix4(pinv); out[i * 3] = w.x; out[i * 3 + 1] = w.y; out[i * 3 + 2] = w.z; }
    const G = new T.BufferGeometry(); G.setAttribute('position', new T.BufferAttribute(out, 3)); if (g.index) G.setIndex(g.index); G.computeBoundingBox(); G.computeBoundingSphere();
    const pm = new T.Mesh(G, new T.MeshBasicMaterial({ side: T.DoubleSide })); pm.name = sm.name + '·skin-proxy'; pm.matrixAutoUpdate = false; pm.__par = par; return pm;
  };
  const wrap = () => {
    const m = mouth.mesh; if (busy || !m || !m.geometry || !skin.length) return; busy = true;
    try {
      figure.updateMatrixWorld(true);
      const pos = m.geometry.attributes.position, n0 = new T.Vector3(0, 0, 1).applyQuaternion(m.getWorldQuaternion(q)).normalize();
      inv.copy(m.matrixWorld).invert(); ray.far = 0.8;
      o.set(0, 0, 0).applyMatrix4(m.matrixWorld).addScaledVector(n0, 0.4); ray.set(o, d.copy(n0).negate());
      if (!proxy || proxy.__par !== m.parent) { const c = ray.intersectObjects(skin, false)[0]; proxy = c && m.parent ? bake(c.object, m.parent) : null; }
      if (proxy) proxy.matrixWorld.copy(m.parent.matrixWorld);
      const tgt = proxy ? [proxy] : skin;
      let hit = 0;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
        ray.set(o.copy(v).addScaledVector(n0, 0.4), d);
        const h = ray.intersectObjects(tgt, false)[0];
        if (h) { v.copy(h.point).addScaledVector(n0, EPS).applyMatrix4(inv); pos.setXYZ(i, v.x, v.y, v.z); hit++; }
      }
      pos.needsUpdate = true; m.geometry.computeBoundingBox(); m.geometry.computeBoundingSphere();
      api.mouthWrap = { n: pos.count, hit, on: proxy ? proxy.name : 'skin', calls: ((api.mouthWrap && api.mouthWrap.calls) || 0) + 1 };
    } finally { busy = false; }
  };
  const r0 = mouth.refit ? mouth.refit.bind(mouth) : null, s0 = mouth.setParams ? mouth.setParams.bind(mouth) : null;
  let lastT = 0, tm = null;
  const soon = () => { const now = performance.now(); if (now - lastT > 120) { lastT = now; wrap(); return; } clearTimeout(tm); tm = setTimeout(() => { lastT = performance.now(); wrap(); }, 120); };
  if (r0) mouth.refit = function () { const r = r0(); soon(); return r; };
  if (s0) mouth.setParams = function (x) { const r = s0(x); soon(); return r; };
  api.wrapMouth = wrap; wrap();
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

/* BRAUEN DREHEN (Georg 26.09.: »die augenbrauen sollten analog zu den augen rotiert werden können, um der
   kopfform zu folgen«). Zwei Felder, nur hier gelesen — brow-rig.v2 validiert sie nicht, deshalb laufen sie
   nicht durch brow.set(): `brow.turn` (−1…2, dieselbe Skala wie eye.splay: ×45° je Seite, + = außen) und
   `brow.pitch` (° · + = Oberkante nach hinten auf die Stirn). Nach jedem rebuild() des Eigentümers:
   1) Neigen um die Brauenmitte (X-Achse). 2) Jeden Querschnitt-Ring als Ganzes um die Hochachse durch die
   Kopfmitte drehen, Winkel wächst von der Mitte (0) zum Auge (voll) — die Monobraue reißt nicht. 3) Ring
   entlang der gedrehten Blickachse wieder auf die Kopffläche setzen, mit dem Abstand, den er vorn hatte. */
export function turnBrow(THREE, brow, q) {
  const turn = +(q && q.turn) || 0, pitch = (+(q && q.pitch) || 0) * Math.PI / 180;
  const sx = q && q.sx != null ? +q.sx : 1, sy = q && q.sy != null ? +q.sy : 1, sz = q && q.sz != null ? +q.sz : 1, scaled = sx !== 1 || sy !== 1 || sz !== 1;
  if (!turn && !pitch && !scaled) return;
  const mesh = brow.mesh, geo = mesh && mesh.geometry, pos = geo && geo.attributes && geo.attributes.position;
  if (!pos || !pos.count || !mesh.visible) return;
  const f = brow.getEyeFrame && brow.getEyeFrame(); if (!f || !f.left || !f.right) return;
  const body = mesh.parent, g = body && body.geometry, a = pos.array, n = pos.count;
  let hc, U;
  if (g) { if (!g.boundingBox) g.computeBoundingBox(); hc = g.boundingBox.getCenter(new THREE.Vector3()); U = g.boundingBox.getSize(new THREE.Vector3()).y / 2; }
  else { U = f.unit || f.radius * 3; hc = new THREE.Vector3((f.left.x + f.right.x) / 2, (f.left.y + f.right.y) / 2, (f.left.z + f.right.z) / 2 - U); }
  /* Georg 26.09.: »eyebrows sollten x, y, z getrennt skaliert werden können« — um die Brauenmitte, VOR Neigen und Drehen. */
  if (scaled) {
    let bx = 0, by = 0, bz = 0; for (let i = 0; i < n; i++) { bx += a[i * 3]; by += a[i * 3 + 1]; bz += a[i * 3 + 2]; } bx /= n; by /= n; bz /= n;
    for (let i = 0; i < n; i++) { a[i * 3] = bx + (a[i * 3] - bx) * sx; a[i * 3 + 1] = by + (a[i * 3 + 1] - by) * sy; a[i * 3 + 2] = bz + (a[i * 3 + 2] - bz) * sz; }
  }
  if (pitch) {
    let by = 0, bz = 0; for (let i = 0; i < n; i++) { by += a[i * 3 + 1]; bz += a[i * 3 + 2]; } by /= n; bz /= n;
    const c = Math.cos(-pitch), s = Math.sin(-pitch);
    for (let i = 0; i < n; i++) { const y = a[i * 3 + 1] - by, z = a[i * 3 + 2] - bz; a[i * 3 + 1] = by + y * c - z * s; a[i * 3 + 2] = bz + y * s + z * c; }
  }
  if (turn) {
    const cx = (f.left.x + f.right.x) / 2, half = Math.max(1e-6, Math.abs(f.right.x - f.left.x) / 2);
    const gsz = n % 129 === 0 ? n / 129 : 1, rings = n / gsz;
    const ray = g ? new THREE.Raycaster() : null; if (ray) { ray.layers.enableAll(); body.updateMatrixWorld(true); }
    const far = U * 3.5, v = new THREE.Vector3(), d = new THREE.Vector3();
    const hitZ = (o, dir) => { ray.set(body.localToWorld(o.clone()), dir.clone().transformDirection(body.matrixWorld).normalize()); const h = ray.intersectObject(body, false)[0]; return h ? body.worldToLocal(h.point.clone()) : null; };
    for (let r = 0; r < rings; r++) {
      const o = r * gsz; let px = 0, py = 0, pz = 0;
      for (let k = 0; k < gsz; k++) { px += a[(o + k) * 3]; py += a[(o + k) * 3 + 1]; pz += a[(o + k) * 3 + 2]; }
      px /= gsz; py /= gsz; pz /= gsz;
      const w = Math.max(-1, Math.min(1, (px - cx) / half)), ang = w * Math.max(-1, Math.min(2, turn)) * Math.PI / 4, c = Math.cos(ang), s = Math.sin(ang);
      let shift = null;
      if (ray && Math.abs(ang) > 1e-4) {
        const front = hitZ(new THREE.Vector3(px, py, hc.z + far), new THREE.Vector3(0, 0, -1));
        const nx = hc.x + (px - hc.x) * c + (pz - hc.z) * s, nz = hc.z - (px - hc.x) * s + (pz - hc.z) * c;
        const dir = d.set(Math.sin(ang), 0, Math.cos(ang));
        const side = front ? hitZ(v.set(nx, py, nz).addScaledVector(dir, far), dir.clone().negate()) : null;
        if (front && side) { const d0 = pz - front.z; shift = side.addScaledVector(dir, d0).sub(new THREE.Vector3(nx, py, nz)); }
      }
      for (let k = 0; k < gsz; k++) {
        const i = (o + k) * 3, x = a[i] - hc.x, z = a[i + 2] - hc.z;
        a[i] = hc.x + x * c + z * s; a[i + 2] = hc.z - x * s + z * c;
        if (shift) { a[i] += shift.x; a[i + 1] += shift.y; a[i + 2] += shift.z; }
      }
    }
  }
  pos.needsUpdate = true; geo.computeBoundingSphere(); if (geo.boundingBox) geo.computeBoundingBox();
}

/** Feldzuordnung Pfad → Besitzer. Für Driver (Graft-Handle) und v5 dieselbe. */
/* »Eyes & eyebrows as actors« (Georg 26.09., north star): die Brauen leben mit den Augen. Pro Seite ein Hub
   (in Augenradien) und eine Neigung (+ = Innenende hoch), zusammengesetzt aus: Schweben (langsame, je Seite
   versetzte Sinus-Lagen) · Blick (hoch schauen = Brauen hoch, Sakkade = kurzer Zucker) · Blinzeln (kleines
   Mitsinken) · Reaktionen (zufällig: eine Braue hoch, beide hoch, Stirnrunzeln, skeptisch). Alles × Stärke,
   Tempo als Zeitfaktor. Geschrieben wird NUR y je Eckpunkt, gewichtet nach Seite — die Monobraue reißt nicht.
   Basis = Stand nach rebuild()+turnBrow (brow.__base), also bleiben alle Formregler gültig. */
export const BROW_LIFE_DEF = Object.freeze({ on: true, strength: 1, tempo: 1, float: 0.5, gaze: 0.6, react: 0.35, blink: 0.5, asym: 0.4 });
const BROW_XFORM_DEF = { turn: 0, pitch: 0, sx: 1, sy: 1, sz: 1 };
const sm01 = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
export function makeFaceApi({ THREE, M, rig, brow = null, nose = null, moust = null, mouth = null, orig = {}, entry, fctx = null, kind = 'facehost', log = () => {} }) {
  const p = clone(entry || {});
  p.eye = { ...clone(EYE_DEF), ...(p.eye || {}) };
  p.eye.anchor = { ...EYE_DEF.anchor, ...((entry && entry.eye && entry.eye.anchor) || {}) };
  p.eye.lashes = { ...EYE_DEF.lashes, ...((entry && entry.eye && entry.eye.lashes) || {}) };
  p.eye.oval = { ...EYE_DEF.oval, ...((entry && entry.eye && entry.eye.oval) || {}) };
  p.brow = { ...((M.Brow && M.Brow.DEFAULTS) || {}), ...BROW_XFORM_DEF, ...(p.brow || {}) };
  p.brow.life = { ...BROW_LIFE_DEF, ...((p.brow && p.brow.life) || {}) };
  p.nose = { ...((M.Nose && M.Nose.DEFAULTS) || {}), enabled: true, ...(p.nose || {}) };
  p.moustache = { ...((M.Moust && M.Moust.DEFAULTS) || {}), ...(p.moustache || {}) };
  p.mouth = { ...MOUTH_DEF, ...(mouth && mouth.p ? { size: mouth.p.size, dy: mouth.p.dy, sx: mouth.p.sx, dx: mouth.p.dx, tilt: mouth.p.tilt, rot: mouth.p.rot, lift: mouth.p.lift, wrap: mouth.p.wrap, set: mouth.setId || mouth.p.set } : {}), ...(p.mouth || {}) };
  const PR = (M.PartRig && M.PartRig.DEFAULTS) || { scale: 1, spread: 0, lift: 0, depth: 0, tilt: 0 };
  p.original = p.original || {};
  for (const k of ['brows', 'nose', 'mouth']) { const d = { ...PR, pitch: 0, yaw: 0, sx: 1, sy: 1, sz: 1 }; delete d.enabled; p.original[k] = { ...d, ...(p.original[k] || {}) }; }
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
  if (brow && !brow.__kfbTurn && typeof brow.rebuild === 'function') {
    brow.__kfbTurn = true; const r0 = brow.rebuild.bind(brow);
    brow.rebuild = function () { const r = r0(); try { turnBrow(THREE, this, p.brow); } catch (e) { log('brow turn: ' + e.message); }
      const pa = this.mesh && this.mesh.geometry && this.mesh.geometry.attributes.position; if (pa) this.__base = Float32Array.from(pa.array); return r; };
  }
  /* Gemalte Teile: partrig.v1 dreht nur in der Gesichtsebene (tilt). Neigung (pitch °) und Drehung (yaw °,
     je Seite gespiegelt) liegen hier OBEN DRAUF, nach apply() des Eigentümers — `original.<teil>.pitch|yaw`. */
  const D2R = Math.PI / 180;
  for (const k of ['brows', 'nose', 'mouth']) {
    const r = orig[k]; if (!r || r.__kfbRot || typeof r.apply !== 'function' || !Array.isArray(r.items)) continue;
    r.__kfbRot = true; const a0 = r.apply.bind(r);
    r.apply = function () {
      const out = a0(), q = (p.original && p.original[k]) || {}, one = this.items.length === 1, sc = q.scale != null ? +q.scale : 1, sx = q.sx != null ? +q.sx : 1, sy = q.sy != null ? +q.sy : 1, sz = q.sz != null ? +q.sz : 1;
      if (sx !== 1 || sy !== 1 || sz !== 1) for (const it of this.items) if (it.host) it.host.scale.set(sc * sx, sc * sy, sc * sz);   // Georg 26.09.: X Y Z getrennt, auch für gemalte Teile
      for (const it of this.items) { if (!it.host || !it.base) continue; it.host.rotation.x = it.base.rot.x + (+q.pitch || 0) * D2R; it.host.rotation.y = it.base.rot.y + (+q.yaw || 0) * D2R * (one ? 1 : (it.sign || 1)); }
      return out;
    };
  }
  /* Rig-Mund: `mouth.yaw` (°) dreht die Fläche VOR dem Anschmiegen — refit() setzt nur rotation.x, das
     Shrinkwrap tastet entlang der gedrehten Achse ab, also schmiegt sich der gedrehte Mund an die Seite. */
  if (mouth && !mouth.__kfbYaw && typeof mouth.refit === 'function') {
    mouth.__kfbYaw = true; const f0 = mouth.refit.bind(mouth);
    mouth.refit = function () { if (this.mesh) this.mesh.rotation.y = (+(p.mouth && p.mouth.yaw) || 0) * D2R; return f0(); };
  }
  const api = { schema: SCHEMA, kind, THREE, M, rig, brow, nose, moust, mouth, orig, entry: p, hasOrig, rejected: [], applied: [] };
  const eyeFrame = () => rig.eyeFrame();
  /* Georg 27.09. »runder Schatten, den es im Raum nicht gibt«: die Nase warf bei streifendem Licht einen langen Streifen quer
     übers Gesicht (unter dem gemalten Mund verborgen, sichtbar sobald der Talk-Mund ihn ersetzt). Gesichtsteile — Nase, Mund,
     Brauen, Bart, gemalt wie gezeichnet — werfen keinen Schatten (LESSONS_SHADOWS: Overlays werfen nicht). Augen bleiben. */
  api.shadowOff = () => {
    const L = [], add = (o) => { if (o && o.traverse) o.traverse((n) => { if (n.isMesh) { n.castShadow = false; L.push(n.name || n.type); } }); };
    ['brows', 'nose', 'mouth'].forEach((k) => { if (orig[k] && orig[k].items) orig[k].items.forEach((it) => add(it.mesh)); });
    add(brow && brow.mesh); add(nose && nose.mesh); add(mouth && mouth.mesh); add(api.moust && api.moust.mesh);
    return L;
  };
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
        else if (rest[0] === 'blink') { if (rig.setBlink) rig.setBlink({ [rest[1]]: v }); }
        else if (rest[0] === 'life') { if (rig.setLife) rig.setLife({ [rest[1]]: v }); }
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
        if (k === 'turn' || k === 'pitch' || k === 'sx' || k === 'sy' || k === 'sz') { p.brow[k] = +v || 0; if (brow.rebuild) brow.rebuild(); return { status: 'OK' }; }
        if (k.startsWith('life.')) { setP(p, path, v); if (brow.__base && brow.mesh) { brow.mesh.geometry.attributes.position.array.set(brow.__base); brow.mesh.geometry.attributes.position.needsUpdate = true; } return { status: 'OK' }; }
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
        if ((k === 'yaw' || k === 'slope') && mouth.refit) mouth.refit();
        api.applyModes(); return { status: 'OK' };
      }
      if (head === 'original') {
        const part = rest[0], f = rest[1], r = orig[part];
        if (!r) return { status: 'UNSUPPORTED', reason: 'no original ' + part };
        p.original[part][f] = v;
        if (f === 'pitch' || f === 'yaw' || f === 'sx' || f === 'sy' || f === 'sz') { r.apply(); return { status: 'OK' }; }
        return r.set({ [f]: v });
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
  /* Brauen-Leben (siehe BROW_LIFE_DEF). */
  const BL = { t: Math.random() * 50, react: null, next: 2 + Math.random() * 4, pg: null, flick: 0, dirty: false };
  api.browReact = (kind) => { BL.react = { kind, t: 0, dur: 1.2 }; };
  api.browLife = (dt) => {
    /* Zwei Ziele, EIN Leben: gezeichnete Braue (Eckpunkte) oder gemalte Braue (partrig-Knoten: Hub + Neigung je Seite,
       jedes Bild aus it.base neu, nichts summiert sich auf). */
    const q = p.brow.life || {}, S = q.strength != null ? +q.strength : 1, b = brow;
    const PB = p.parts.brows === 'original' && orig.brows && Array.isArray(orig.brows.items) ? orig.brows : null;
    const pos = !PB && b && b.mesh && b.__base && b.mesh.visible ? b.mesh.geometry.attributes.position : null;
    if (!PB && (!pos || pos.array.length !== b.__base.length)) return;
    if (q.on === false || !(S > 0)) { if (BL.dirty) { if (pos) { pos.array.set(b.__base); pos.needsUpdate = true; } else if (PB) PB.apply(); BL.dirty = false; } return; }
    const f = rig.eyeFrame && rig.eyeFrame(); if (!f || !f.left || !f.right) return;
    const R = f.radius, asym = Math.max(0, Math.min(1, q.asym != null ? +q.asym : 0.4)), FL = +q.float || 0, G = +q.gaze || 0;
    BL.t += dt * Math.max(0.05, q.tempo != null ? +q.tempo : 1); const t = BL.t;
    let lL = FL * 0.07 * R * (Math.sin(t * 0.63 + 0.4) + 0.5 * Math.sin(t * 1.71 + 2.1)), lR = FL * 0.07 * R * (Math.sin(t * 0.63 + 0.4 + asym * 1.9) + 0.5 * Math.sin(t * 1.71 + 2.1 + asym * 2.7));
    let tL = FL * 0.06 * Math.sin(t * 0.47 + 1.3), tR = FL * 0.06 * Math.sin(t * 0.47 + 1.3 + asym * 2.2);
    let gx = 0, gy = 0, ne = 0; if (rig.eyes && rig._max) for (const e of rig.eyes) if (e && isFinite(e._px) && isFinite(e._py)) { gx += e._px / rig._max; gy += e._py / rig._max; ne++; }
    if (ne) { gx /= ne; gy /= ne; }
    lL += G * R * 0.22 * gy + G * R * 0.06 * gx; lR += G * R * 0.22 * gy - G * R * 0.06 * gx;
    if (BL.pg && dt > 0) { const sp = Math.hypot(gx - BL.pg[0], gy - BL.pg[1]) / dt; if (sp > 2.2) BL.flick = Math.min(1, BL.flick + 0.6); } BL.pg = [gx, gy];
    BL.flick = Math.max(0, BL.flick - dt * 2.5); lL += G * R * 0.09 * BL.flick; lR += G * R * 0.09 * BL.flick * (1 - asym * 0.5);
    if (rig._blinkK != null && rig._blinkK >= 0) { const dip = (q.blink != null ? +q.blink : 0.5) * R * 0.1 * Math.sin(Math.PI * Math.min(1, rig._blinkK)); lL -= dip; lR -= dip; }
    const RT = +q.react || 0; BL.next -= dt;
    if (RT > 0 && !BL.react && BL.next <= 0) { const K = ['raiseL', 'raiseR', 'both', 'furrow', 'skeptic', 'both']; BL.react = { kind: K[Math.floor(Math.random() * K.length)], t: 0, dur: 0.9 + Math.random() * 0.6 }; BL.next = (3 + Math.random() * 7) / Math.max(0.1, RT); }
    if (BL.react) {
      const r = BL.react; r.t += dt; const u = r.t / r.dur;
      if (u >= 1) BL.react = null;
      else { const env = u < 0.2 ? sm01(u / 0.2) : u > 0.7 ? sm01((1 - u) / 0.3) : 1, A = R * 0.22 * env;
        if (r.kind === 'raiseL') { lL += A; tL += 0.12 * env; } else if (r.kind === 'raiseR') { lR += A; tR += 0.12 * env; } else if (r.kind === 'both') { lL += A; lR += A; tL += 0.06 * env; tR += 0.06 * env; }
        else if (r.kind === 'furrow') { lL -= A * 0.45; lR -= A * 0.45; tL -= 0.2 * env; tR -= 0.2 * env; } else if (r.kind === 'skeptic') { lL += A; lR -= A * 0.35; tR -= 0.12 * env; } }
    }
    lL *= S; lR *= S; tL *= S; tR *= S;
    const cx = (f.left.x + f.right.x) / 2, dl = f.left.x - cx, half = Math.max(1e-6, Math.abs(dl)), sg = dl >= 0 ? 1 : -1;
    if (PB) {
      const Q = (p.original && p.original.brows) || {}, one = PB.items.length === 1, v3 = new THREE.Vector3(), wsE = f.parent ? f.parent.getWorldScale(v3).x : 1;
      for (const it of PB.items) {
        if (!it.host || !it.base) continue;
        const hp = it.host.parent, k = hp ? wsE / (hp.getWorldScale(v3).x || 1) : 1, sn = it.sign || 1, isL = sn === sg;
        const l = one ? (lL + lR) / 2 : isL ? lL : lR, tt = one ? 0 : isL ? tL : tR;
        it.host.position.y = it.base.pos.y + (+Q.lift || 0) + l * k;
        it.host.rotation.z = it.base.rot.z + (+Q.tilt || 0) * D2R * sn - sn * tt * 1.2;   // + tt = inner end up
      }
      BL.dirty = true; return;
    }
    const a = pos.array, base = b.__base;
    for (let i = 0; i < a.length; i += 3) {
      const x = base[i], s = Math.max(-1, Math.min(1, (x - cx) * sg / half)), wL = (1 + s) / 2, wR = 1 - wL;
      const uL = (f.left.x - x) * sg / half, uR = (x - f.right.x) * sg / half;   // + = towards the face centre (inner end)
      a[i + 1] = base[i + 1] + wL * (lL + tL * uL * R) + wR * (lR + tR * uR * R);
    }
    pos.needsUpdate = true; BL.dirty = true;
  };
  api.update = (dt, cam) => {
    if (kind === 'facehost') { rig.update(dt); if (mouth) mouth.update(dt, cam); }
    api.sync(dt, cam);
    try { api.browLife(dt || 0); } catch (e) { log('brow life: ' + e.message); }
    /* Georg 26.09. »talk funktioniert nicht«: on FB Ear Rig v5 the mouth source defaults to the PAINTED mouth — one static mesh,
       so Talk / visemes / lip-sync changed an invisible rig mouth. While the mouth speaks, the rig mouth (fitted onto the painted
       one at mount) stands in and the painted mouth hides; afterwards the painted one comes back. Source »Off« stays silent. */
    const spk = !!(mouth && (mouth.talking || mouth.viseme != null || (api.isSpeaking && api.isSpeaking())));
    const swap = spk && p.parts.mouth === 'original' && !!orig.mouth, want = p.parts.mouth === 'rig' || swap;
    if (mouth && mouth.mesh && mouth.mesh.visible !== want) mouth.mesh.visible = want;
    if (orig.mouth && api._mouthSwap !== swap) { api._mouthSwap = swap; try { orig.mouth.set({ enabled: !swap && p.parts.mouth === 'original' }); } catch (e) {} }
  };
  api.dispose = () => {
    const t = (f) => { try { f(); } catch (e) {} };
    if (kind === 'facehost') {
      if (mouth) t(() => mouth.dispose()); if (api.moust) t(() => api.moust.dispose()); if (nose) t(() => nose.dispose()); if (brow) t(() => brow.dispose());
      t(() => rig.dispose()); if (fctx && fctx.__host) t(() => fctx.__host.dispose());
    } else if (api.moust && api.moust !== moust) t(() => api.moust.dispose());
    ['brows', 'nose', 'mouth'].forEach((k) => { if (orig[k]) { if (p.original[k]) { p.original[k].pitch = 0; p.original[k].yaw = 0; } t(() => orig[k].set({ enabled: true, scale: 1, spread: 0, lift: 0, depth: 0, tilt: 0 })); } });
    (orig.eyes || []).forEach((o) => { o.visible = true; });
  };
  return api;
}

/** Gesicht auf eine Figur mit Kopfknochen (kein Graft). */
export function mountFace({ THREE, M, figure, entry = {}, log = () => {} }) {
  if (!M || !M.FaceHost || !M.Rig) return { status: 'UNSUPPORTED', reason: 'facehost / EyeRig nicht geladen' };
  const skin = []; figure.traverse((o) => { if (o.isMesh && !isFacePart(o)) skin.push(o); });
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
  if (mouth) { try { wrapMouthToSkin(THREE, mouth, figure, skin, api); } catch (err) { log('mouth wrap: ' + err.message); } }
  api.shadowOff();
  api.status = 'OK';
  return api;
}
/** Gesicht auf einem Cube Pet (Pet Studio): EyeRig v6 + PetMouth stehen schon auf dem Pet (pet-library-Owner).
    Hier kommen Braue und Nase dazu (dieselben Eigentümer wie auf dem Kopf) — per Vorgabe AUS, damit ein Pet
    ohne gespeicherten Eintrag aussieht wie vorher — und die eine Feld-API. */
export function mountPetFace({ THREE, M, rig, mouth = null, entry = {}, log = () => {} }) {
  if (!rig || !rig.eyeFrame) return { status: 'UNSUPPORTED', reason: 'no EyeRig v6 on this pet' };
  const e = entry || {}, color = e.color || '#f2c93c', eyeFrame = () => rig.eyeFrame();
  const liveEye = () => (api && api.entry ? api.entry.eye : (e.eye || {}));
  if (M.Oval) { try { M.Oval.attach(rig, () => liveEye().oval || M.Oval.DEFAULTS); } catch (err) { log('eyeoval: ' + err.message); } }
  if (M.Head) { try { M.Head.attach(rig, () => ({ sclera: liveEye().sclera != null ? liveEye().sclera : null, pupil: liveEye().pupil != null ? liveEye().pupil : null })); } catch (err) { log('headzones: ' + err.message); } }
  let brow = null, nose = null;
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
  var api = makeFaceApi({ THREE, M, rig, brow, nose, moust: null, mouth, orig: {}, entry: { parts: { brows: 'off', nose: 'off' }, ...e }, kind: 'pet', log });
  api.load(e); api.applyModes();
  const d0 = api.dispose;
  api.dispose = () => { d0(); [api.moust, nose, brow].forEach((x) => { if (x && x.dispose) try { x.dispose(); } catch (err) {} }); };
  api.status = 'OK';
  return api;
}
export default mountFace;
