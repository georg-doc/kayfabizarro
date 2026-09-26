/* KFB · RESIDENT-BAND-MODULE-01 · Laufzeit
   Ein Orc-Band-Modul OHNE Grundplatte. Es lädt jeden Darsteller aus seiner eigenen Quelldatei,
   hängt die Requisiten an die Knochen, die ORB-P1 dafür gewählt hat, und liest die
   abgenommenen Aktionen (bounce, strum, drum) aus den ORB-Exporten — nur die Clips, nie deren
   Geometrie. Wo es steht, entscheidet der Host: er gibt einen Ankerpunkt auf SEINER Fläche,
   das Modul setzt seinen Stützpunkt (lokal y = 0) genau dorthin.

   Uhr: das Modul hat keine. `update(beatPos)` bekommt die Schlagposition vom Host. Ein Modul
   mit eigener Uhr läuft in der Taverne neben der Musik her statt mit ihr.

   Was hier NICHT passiert: kein Lösen von Armen zur Trommel. Der Trommler-Patch kommt von
   Georgs Hand (Puppe/Bone/Requisite im Studio) und wird hier nur aufgetragen und gemessen. */
import * as THREE from 'three';
import { PropertyBinding } from 'three';
import { loadAsset, instance, findBone, skinnedWorld, reachChain } from './atlas.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { lowestPosedY } from './rigwork.js';

export const SCHEMA = 'kfb.resident-band-module/1';
const REPO = 'georg-doc/kayfabizarro';
const raw = (c, p) => `https://raw.githubusercontent.com/${REPO}/${c}/${p.split('/').map(encodeURIComponent).join('/')}`;
const D2R = Math.PI / 180;
const mod = (a, n) => ((a % n) + n) % n;
const FPB = 24; // frames per beat, as authored
const _v = new THREE.Vector3(), _q = new THREE.Quaternion();

export async function loadBandModuleDef(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`band module HTTP ${r.status}: ${url}`);
  return r.json();
}

const texLoader = new THREE.TextureLoader();
async function repairTexture(node, ref) {
  const tex = await texLoader.loadAsync(raw(ref.commit, ref.path));
  tex.flipY = false;                       // glTF UV convention
  tex.colorSpace = THREE.SRGBColorSpace;
  let n = 0;
  node.traverse((o) => {
    if (!o.isMesh) return;
    o.material = [].concat(o.material).map((m) => { const c = m.clone(); if (!c.map) { c.map = tex; c.needsUpdate = true; n++; } return c; });
    if (o.material.length === 1) o.material = o.material[0];
  });
  return n;
}

function setLocal(o, t) {
  if (!t) return;
  if (t.p) o.position.fromArray(t.p);
  if (t.q) o.quaternion.fromArray(t.q);
  else if (t.r) o.rotation.set(t.r[0] * D2R, t.r[1] * D2R, t.r[2] * D2R);
  if (t.s != null) o.scale.setScalar(typeof t.s === 'number' ? t.s : t.s[0]);
}

function retarget(clip, rt) {
  const c = clip.clone();
  if (rt && rt.stripSuffix) {
    const re = new RegExp(rt.stripSuffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
    for (const t of c.tracks) { const i = t.name.indexOf('.'); t.name = t.name.slice(0, i).replace(re, '') + t.name.slice(i); }
  }
  return c;
}

export async function mountBandModule(def, { parent, anchor = {}, onProgress } = {}) {
  if (!def || def.schema !== SCHEMA) throw new Error('band module schema mismatch: ' + (def && def.schema));
  const steps = Object.keys(def.actions).length + Object.values(def.actors).reduce((a, x) => a + 1 + (x.attachments || []).length, 0) + (def.scenery || []).length;
  let done = 0;
  const tick = (label) => onProgress && onProgress(++done, steps, label);

  const root = new THREE.Group();
  root.name = 'resident-module:' + def.id;
  root.userData.entry = { id: 'module-root', scope: 'modul', kind: 'root', role: 'Band-Modul · ein Root, keine Grundplatte', a: def.id };
  const content = new THREE.Group();
  content.name = 'module-content';
  content.position.set(...(def.anchors.support.p || [0, 0, 0])).multiplyScalar(-1);
  content.position.y = 0;
  root.add(content);

  /* ---- Aktionen: Clips aus den ORB-Exporten, sonst nichts ---- */
  const actions = {};
  for (const [id, a] of Object.entries(def.actions)) {
    /* Drei Quellen: gepinnte Repo-Datei · lokale Projektdatei (Motion Library, noch nicht im Repo)
       · erzeugt (reine Pose ohne Clip, als solche ausgewiesen) */
    let src;
    if (a.gen) src = new THREE.AnimationClip(id, a.beats, []);
    else {
      const g = a.src.local ? await localGLB(a.src.local) : await loadAsset(a.src.path, a.src.commit);
      src = g.animations.find((c) => c.name === a.clip);
      if (!src) throw new Error(`action ${id}: clip "${a.clip}" not in ${a.src.local || a.src.path}`);
    }
    actions[id] = { id, def: a, clip: retarget(src, a.retarget), secPerBeat: src.duration / a.beats };
    tick(id);
  }

  /* ---- Darsteller aus ihren eigenen Dateien ---- */
  const perf = {};
  const props = new Map();
  for (const [pid, a] of Object.entries(def.actors)) {
    const group = new THREE.Group();
    group.name = 'anchor.' + pid;
    setLocal(group, { p: a.anchor.p });
    group.rotation.y = (a.anchor.ry || 0) * D2R;
    const actor = await instance(a.asset.path, a.asset.commit);
    actor.name = 'actor.' + pid;
    let repaired = 0;
    if (a.repair && a.repair.texture) repaired = await repairTexture(actor, a.repair.texture);
    group.add(actor);
    content.add(group);
    tick(pid);
    const bones = new Map();
    actor.traverse((o) => { if (o.isBone) bones.set(o.name, o); });
    const P = { id: pid, def: a, group, actor, bones, mixer: null, action: null, actionId: null, t: 0, repaired, attachments: {} };
    perf[pid] = P;
    props.set('anchor.' + pid, { obj: group, base: { p: a.anchor.p, r: [0, a.anchor.ry || 0, 0] } });
    /* Der Aktor selbst als eigener Knoten: die Puppen-Hüfte hebt/verschiebt NUR die Figur, die
       Trommel am Anker bleibt auf der Fläche. */
    props.set('actor.' + pid, { obj: actor, base: { p: [0, 0, 0] } });
    for (const at of a.attachments || []) {
      const obj = await instance(at.asset.path, at.asset.commit);
      obj.name = at.id;
      obj.userData.entry = { id: at.id, scope: 'requisite', kind: 'prop', performer: pid, path: at.asset.path, a: at.asset.path, role: `Requisite · ${a.label}` };
      let host = group, via = 'anchor';
      if (at.node) {
        const f = findBone(actor, at.node);
        host = f ? f.bone : (actor.getObjectByName(at.node) || null);
        via = f ? f.matched : at.node;
        if (!host) throw new Error(`attachment ${at.id}: node ${at.node} not found on ${pid}`);
        obj.userData.attachedTo = via;
      }
      host.add(obj);
      setLocal(obj, at);
      P.attachments[at.id] = { obj, def: at, via };
      props.set(at.id, { obj, base: at });
      tick(at.id);
    }
  }
  for (const s of def.scenery || []) {
    const obj = await instance(s.asset.path, s.asset.commit);
    obj.name = s.id;
    obj.userData.entry = { id: s.id, scope: 'requisite', kind: 'scenery', path: s.asset.path, a: s.asset.path, role: 'Szenerie · optional' };
    setLocal(obj, { p: s.p });
    obj.rotation.y = (s.ry || 0) * D2R;
    content.add(obj);
    props.set(s.id, { obj, base: s });
    tick(s.id);
  }

  const M = {
    def, root, content, perf, props, actions,
    patches: Object.assign({}, def.posePatches || {}),
    holds: {},            // pid → clipTime (a held frame)
    patchOn: true,
    beatPos: 0,

    /* Eine Aktion wechseln heißt: neuer Mixer. `stopAllAction()` stellt in three.js die
       gecachten Ausgangswerte wieder her (S28) — der alte Mixer wird fallengelassen. */
    setAction(pid, id) {
      const P = perf[pid], A = actions[id];
      if (!P || !A) throw new Error(`setAction ${pid} ${id}`);
      if (P.mixer) P.mixer.uncacheRoot(P.actor);
      P.mixer = new THREE.AnimationMixer(P.actor);
      P.clipQ = null;
      P.action = P.mixer.clipAction(A.clip);
      P.action.play();
      P.actionId = id;
      let bound = 0;
      for (const t of A.clip.tracks) if (PropertyBinding.findNode(P.actor, PropertyBinding.parseTrackName(t.name).nodeName)) bound++;
      P.bind = { bound, of: A.clip.tracks.length };
      /* Starre Legacy-Teile sind keine Bones, aber Gelenke: alles, was der Clip dreht, ist patchbar */
      P.joints = new Set();
      for (const t of A.clip.tracks) {
        const nn = PropertyBinding.parseTrackName(t.name).nodeName;
        const node = PropertyBinding.findNode(P.actor, nn);
        if (node && node !== P.actor) { P.bones.set(node.name, node); P.joints.add(node.name); }
      }
      /* Gelenke, die eine Passung (fit) setzt, aber kein Clip treibt: Ruhelage merken, vor jedem
         Bild darauf zurück — sonst liest der nächste Durchlauf seinen eigenen Patch als Ausgang. */
      P.fitRest = new Map();
      for (const n of (A.def.fit && A.def.fit.joints) || []) {
        const node = P.actor.getObjectByName(n);
        if (node) { P.bones.set(n, node); P.joints.add(n); P.fitRest.set(node, node.quaternion.clone()); }
      }
      P.fit = A.def.fit ? FITS[A.def.fit.kind].prep(M, P, A) : null;
      M.stage(pid);
      return P.bind;
    },
    /* Requisiten, deren Lage an der Aktion hängt (Trommel, Schlägel), kommen aus deren staging */
    stage(pid) {
      const P = perf[pid];
      const st = (actions[P.actionId].def.staging) || {};
      for (const [id, at] of Object.entries(P.attachments)) {
        const t = st[id] || at.def;
        const want = t.node || at.def.node;
        if (want && at.obj.parent && at.obj.parent.name !== (findBone(P.actor, want) || {}).matched) {
          const f = findBone(P.actor, want);
          const host = f ? f.bone : P.actor.getObjectByName(want);
          if (host) { host.add(at.obj); at.via = f ? f.matched : want; at.obj.userData.attachedTo = at.via; }
        }
        if (t.m) { at.obj.matrix.set(...t.m.flat()); at.obj.matrix.decompose(at.obj.position, at.obj.quaternion, at.obj.scale); }
        else setLocal(at.obj, t);
      }
    },
    clipTime(pid, beatPos) {
      const P = perf[pid], A = actions[P.actionId];
      return mod(beatPos, A.def.beats) * A.secPerBeat;
    },
    /* Ein Darsteller zu einer Clipzeit, danach der Patch — additiv auf die lokale Rotation des
       Clips (q = q_clip · Δ), damit eine an EINEM Bild gesetzte Korrektur über die ganze
       Schleife mitläuft statt die Bewegung einzufrieren. */
    pose(pid, t, patch) {
      const P = perf[pid];
      /* three.js schreibt eine Spur nur, wenn sich ihr Wert gegenüber dem ZULETZT geschriebenen
         ändert (PropertyMixer.apply). Steht der Clip zwei Bilder lang still, bliebe ein
         aufgetragener Patch stehen und würde im nächsten Bild ein zweites Mal multipliziert —
         gemessen: Bild 0 und 1 identisch im Clip, mit Patch 0,41 gegen 0,77. Deshalb vor jedem
         Auswerten die zuletzt geschriebenen Clip-Werte zurück in die Bones. */
      if (P.clipQ) for (const [b, q] of P.clipQ) b.quaternion.copy(q);
      P.mixer.setTime(t);
      if (!P.clipQ) P.clipQ = new Map([...P.bones.values()].map((b) => [b, new THREE.Quaternion()]));
      for (const [b, q] of P.clipQ) q.copy(b.quaternion);
      P.t = t;
      P.actor.position.set(0, 0, 0); P.actor.rotation.set(0, 0, 0);
      P.group.position.fromArray(P.def.anchor.p); P.group.rotation.set(0, (P.def.anchor.ry || 0) * D2R, 0);
      M.stage(pid);
      if (P.fitRest) for (const [n, q] of P.fitRest) n.quaternion.copy(q);
      if (P.fit) FITS[actions[P.actionId].def.fit.kind].apply(M, P, t);
      if (actions[P.actionId].def.groove) GROOVES[actions[P.actionId].def.groove.kind](M, P, t, actions[P.actionId].def.groove);
      if (patch) M.applyPatch(pid, patch);
    },
    applyPatch(pid, patch) {
      const P = perf[pid];
      for (const [name, b] of Object.entries(patch.bones || {})) {
        const bone = P.bones.get(name);
        if (bone) bone.quaternion.multiply(_q.fromArray(b.dq));
      }
      for (const [id, t] of Object.entries(patch.props || {})) {
        const pr = props.get(id);
        if (pr) setLocal(pr.obj, t);
      }
    },
    update(beatPos) {
      M.beatPos = beatPos;
      for (const pid of Object.keys(perf)) {
        const t = pid in M.holds ? M.holds[pid] : M.clipTime(pid, beatPos);
        M.pose(pid, t, M.patchOn ? M.patches[pid] : null);
      }
    },
    dispose() {
      for (const P of Object.values(perf)) if (P.mixer) P.mixer.uncacheRoot(P.actor);
      if (root.parent) root.parent.remove(root);
    },
    /* ---- Befestigung am Host: Stützpunkt auf Host-Punkt ---- */
    place({ position = [0, 0, 0], rotationYDeg = 0, scale = 1 } = {}) {
      root.position.fromArray(position);
      root.rotation.set(0, rotationYDeg * D2R, 0);
      root.scale.setScalar(scale);
      root.updateMatrixWorld(true);
    }
  };

  for (const [pid, a] of Object.entries(def.actors)) M.setAction(pid, a.action);
  M.place({ position: anchor.position, rotationYDeg: anchor.rotationYDeg, scale: anchor.scale });
  if (parent) parent.add(root);
  M.update(0);
  M.drum = prepDrum(M);
  return M;
}

/* ================= Messung · Trommelkontakt ================= */
function firstMesh(o) { let m = null; o.traverse((x) => { if (!m && x.isMesh) m = x; }); return m; }

function prepDrum(M) {
  const d = M.props.get('drum'), sl = M.props.get('stick.l'), sr = M.props.get('stick.r');
  if (!d || !sl || !sr) return null;
  const dm = firstMesh(d.obj);
  const g = dm.geometry; g.computeBoundingBox();
  const bb = g.boundingBox, pa = g.attributes.position;
  const cx = (bb.min.x + bb.max.x) / 2, cz = (bb.min.z + bb.max.z) / 2;
  const R = Math.min(bb.max.x - bb.min.x, bb.max.z - bb.min.z) / 2;
  /* Fellhöhe = höchster Punkt innerhalb von 30 % des Radius um die Mitte. Der höchste Punkt
     der Box ist der Rand, nicht das Fell. */
  let skin = -Infinity;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i) - cx, z = pa.getZ(i) - cz;
    if (x * x + z * z < (0.3 * R) ** 2) skin = Math.max(skin, pa.getY(i));
  }
  const heads = {};
  for (const [k, s] of [['l', sl], ['r', sr]]) {
    const sm = firstMesh(s.obj);
    const sg = sm.geometry; sg.computeBoundingBox();
    const sb = sg.boundingBox, sp = sg.attributes.position;
    const cut = sb.max.y - 0.3 * (sb.max.y - sb.min.y);
    const idx = [];
    for (let i = 0; i < sp.count; i++) if (sp.getY(i) >= cut) idx.push(i);
    heads[k] = { mesh: sm, idx };
  }
  return { mesh: dm, cx, cz, R, skinY: skin, rimY: bb.max.y, heads };
}

/* Kontakt eines Schlägels im AKTUELLEN Posenzustand. gap > 0: schwebt, < 0: steckt im Fell.
   Nur Punkte ÜBER dem Fell zählen als Kontakt; ein Kopf neben der Trommel ist kein Treffer. */
export function drumContact(M, side) {
  const D = M.drum;
  if (!D) return null;
  M.root.updateMatrixWorld(true);
  const dm = D.mesh.matrixWorld;
  const c = new THREE.Vector3(D.cx, D.skinY, D.cz).applyMatrix4(dm);
  const e = new THREE.Vector3(D.cx + D.R, D.skinY, D.cz).applyMatrix4(dm);
  const Rw = e.distanceTo(c) * 0.86;   // Spielfläche innerhalb des Rands
  const H = D.heads[side];
  const pa = H.mesh.geometry.attributes.position;
  let over = Infinity, rAt = null, low = Infinity, rLow = null;
  for (const i of H.idx) {
    _v.fromBufferAttribute(pa, i).applyMatrix4(H.mesh.matrixWorld);
    const r = Math.hypot(_v.x - c.x, _v.z - c.z);
    const dy = _v.y - c.y;
    if (dy < low) { low = dy; rLow = r / Rw; }
    if (r <= Rw && dy < over) { over = dy; rAt = r / Rw; }
  }
  return { gap: Number.isFinite(over) ? +over.toFixed(4) : null, r: rAt != null ? +rAt.toFixed(3) : null,
           lowest: +low.toFixed(4), rLowest: rLow != null ? +rLow.toFixed(3) : null, skinY: +c.y.toFixed(4) };
}

/* Die ganze Schleife abtasten, 24 Bilder pro Schlag, mit oder ohne Patch. Liefert pro Bild
   beide Schlägel und pro Seite das Bild mit dem kleinsten Abstand über dem Fell — das
   „nützliche Schlagbild" ist damit GEMESSEN, nicht aus dem Dateinamen gelesen. */
export function scanDrummer(M, patch) {
  const P = M.perf.drummer, A = M.actions[P.actionId];
  const n = A.def.beats * FPB;
  const rows = [];
  const keepT = P.t;
  for (let f = 0; f < n; f++) {
    const t = (f / FPB) * A.secPerBeat;
    M.pose('drummer', t, patch);
    rows.push({ f, t: +t.toFixed(4), l: drumContact(M, 'l'), r: drumContact(M, 'r') });
  }
  M.pose('drummer', keepT, M.patchOn ? M.patches.drummer : null);
  const best = (k) => {
    let b = null;
    for (const r of rows) { const g = r[k]; if (g && g.gap != null && (!b || Math.abs(g.gap) < Math.abs(b.gap))) b = { f: r.f, t: r.t, gap: g.gap, r: g.r }; }
    return b;
  };
  return { action: P.actionId, frames: n, rows, strike: { L: best('l'), R: best('r') } };
}

/* Bodenkontakt je Darsteller über die Schleife: posierte Unterkante in Modul-Koordinaten */
export function groundReport(M, samples = 8) {
  const out = {};
  const keep = { ...M.holds };
  for (const [pid, P] of Object.entries(M.perf)) {
    const A = M.actions[P.actionId];
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < samples; i++) {
      M.pose(pid, (i / samples) * A.clip.duration, M.patchOn ? M.patches[pid] : null);
      M.root.updateMatrixWorld(true);
      const y = lowestPosedY(P.actor, 4) - M.root.position.y;
      lo = Math.min(lo, y); hi = Math.max(hi, y);
    }
    out[pid] = { min: +lo.toFixed(4), max: +hi.toFixed(4) };
  }
  M.holds = keep;
  M.update(M.beatPos);
  return out;
}

/* Grundriss in Modul-Koordinaten, über eine volle Periode des längsten Clips */
export function measureFootprint(M, samples = 16) {
  const keepBeat = M.beatPos;
  const keepP = M.root.position.clone(), keepR = M.root.rotation.clone(), keepS = M.root.scale.clone();
  M.root.position.set(0, 0, 0); M.root.rotation.set(0, 0, 0); M.root.scale.setScalar(1);
  const beats = Math.max(...Object.values(M.perf).map((P) => M.actions[P.actionId].def.beats));
  const box = new THREE.Box3();
  for (let i = 0; i < samples; i++) {
    M.update((i / samples) * beats);
    M.root.updateMatrixWorld(true);
    /* SkinnedMesh.boundingBox wird sonst EINMAL gerechnet und nie wieder (S9-Falle) */
    M.content.traverse((o) => { if (o.isMesh && o.visible) { if (o.isSkinnedMesh) o.boundingBox = null; box.expandByObject(o); } });
  }
  M.root.position.copy(keepP); M.root.rotation.copy(keepR); M.root.scale.copy(keepS);
  M.root.updateMatrixWorld(true);
  M.update(keepBeat);
  const r = (x) => +x.toFixed(2);
  const s = M.def.anchors.support.p;
  /* rootFrame: relativ zum Stützpunkt (was ein Host prüft). moduleFrame: im ORB-Bandrahmen (was im JSON steht). */
  return { rootFrame: { min: [r(box.min.x), r(box.min.z)], max: [r(box.max.x), r(box.max.z)] },
           moduleFrame: { min: [r(box.min.x + s[0]), r(box.min.z + s[2])], max: [r(box.max.x + s[0]), r(box.max.z + s[2])],
                          center: [r((box.min.x + box.max.x) / 2 + s[0]), r((box.min.z + box.max.z) / 2 + s[2])] },
           height: r(box.max.y), lowest: +box.min.y.toFixed(3) };
}

export { skinnedWorld };

/* Weltpunkt des Schlägelkopfs (Mittel der oberen 30 % der Keule) — IK-Effektor für den Trommler */
export function stickHead(M, side, out = new THREE.Vector3()) {
  const H = M.drum && M.drum.heads[side];
  if (!H) return out.set(0, 0, 0);
  if (!H.local) {
    const pa = H.mesh.geometry.attributes.position, c = new THREE.Vector3();
    for (const i of H.idx) c.add(_v.fromBufferAttribute(pa, i));
    H.local = c.multiplyScalar(1 / H.idx.length);
  }
  H.mesh.updateWorldMatrix(true, false);
  return out.copy(H.local).applyMatrix4(H.mesh.matrixWorld);
}

const _gl = new GLTFLoader();
const _local = new Map();
function localGLB(url) { if (!_local.has(url)) _local.set(url, _gl.loadAsync(url)); return _local.get(url); }

/* ================= Passungen: Pose aus einem Rezept statt aus einem Clip =================
   guitar-fit-v1 · Nachbau von ORB `gtr_apply.apply_fit2` (Georg OK „passt so“) im Browser:
   Mixamo-Körper aus der Motion Library, Gitarre an `spine` mit der gemessenen Mloc, rechte Hand
   auf Anschlagpunkt + Mocap-Anschlagbewegung, linke Hand außen am Hals + Gleiten. Die Arme laufen
   über CCD (atlas.reachChain) statt Blender-IK mit Pol — daher: Nachbau, Restfehler je Bild
   gemessen, nicht dieselben Keys.
   trumpet-hold-v0 · Trompete am MUND (Kopf), Glocke nach vorn-außen; der starre Legacy-Arm zielt
   auf den Griff. Was der Arm nicht erreicht, bleibt als Rest stehen und wird gemeldet. */
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _m = new THREE.Matrix4();
const D2 = Math.PI / 180;
/* Blender-Gitarrenachsen → glTF: Blender lokal (x, y, z) = glTF (x, −z, y). guitar_rot baut in
   Blender die Spalten (x, y, d) mit d = Halsrichtung = glTF +Y und y = −Deckennormale. */
function guitarBasis(left, up, fwd, th, psi, phi) {
  th *= D2; psi *= D2; phi *= D2;
  const d = left.clone().multiplyScalar(Math.cos(th) * Math.cos(psi)).add(up.clone().multiplyScalar(Math.sin(th))).add(fwd.clone().multiplyScalar(Math.cos(th) * Math.sin(psi))).normalize();
  let n = fwd.clone().sub(d.clone().multiplyScalar(fwd.dot(d))).normalize();
  n.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(d, -phi)).normalize();
  let y = n.clone().negate();
  const x = y.clone().cross(d).normalize();
  y = d.clone().cross(x).normalize();
  return { x, yB: y, d, n };
}
const bl2gl = (v) => new THREE.Vector3(v[0], v[2], -v[1]); // Blender-Gitarrenlokal → glTF-Gitarrenlokal
const FITS = {
  /* Nachbau von ORB gtr_apply.apply_fit2 aus den REZEPT-Parametern, nicht aus der Blender-Mloc:
     die Blender-Mloc steht im Blender-Bone-Rahmen von spine, und der glTF-Import in Blender dreht
     Bone-Achsen um. Die Körperachsen (links/oben/vorn) werden deshalb hier im three-spine-Raum
     gemessen, genau wie gtr_fit.gather/frame_axes sie in Blender gemessen hat. */
  'guitar-fit-v1': {
    prep(M, P, A) {
      const f = A.def.fit, p = f.prm;
      const spine = findBone(P.actor, f.parent).bone;
      const B = (n) => findBone(P.actor, n).bone;
      const hs = { l: B('handslot.l'), r: B('handslot.r') };
      const feet = [[B('foot.l'), B('toes.l')], [B('foot.r'), B('toes.r')]];
      const n30 = Math.round(A.clip.duration * 30);
      const U = new THREE.Vector3(), Fw = new THREE.Vector3(), Rm = new THREE.Vector3(), Lm = new THREE.Vector3();
      let k = 0;
      P.actor.updateWorldMatrix(true, true);
      for (let i = 0; i < n30; i++) {
        P.mixer.setTime(i / 30);
        P.actor.updateMatrixWorld(true);
        const inv = _m.copy(spine.matrixWorld).invert(), i3 = new THREE.Matrix3().setFromMatrix4(inv);
        Rm.add(hs.r.getWorldPosition(_a).applyMatrix4(inv));
        Lm.add(hs.l.getWorldPosition(_a).applyMatrix4(inv));
        if (i % 4 === 0) {
          const fw = new THREE.Vector3();
          for (const [ft, to] of feet) fw.add(to.getWorldPosition(_a).clone().sub(ft.getWorldPosition(_b)));
          fw.y = 0;
          Fw.add(fw.normalize().applyMatrix3(i3));
          U.add(new THREE.Vector3(0, 1, 0).applyMatrix3(i3));
          k++;
        }
      }
      Rm.multiplyScalar(1 / n30); Lm.multiplyScalar(1 / n30);
      const up = U.multiplyScalar(1 / k).normalize();
      let fwd = Fw.multiplyScalar(1 / k); fwd = fwd.sub(up.clone().multiplyScalar(fwd.dot(up))).normalize();
      const left = up.clone().cross(fwd).normalize();
      const g = guitarBasis(left, up, fwd, p.th, p.psi, p.phi);
      const s = p.s;
      const S = left.clone().multiplyScalar(p.lx).add(up.clone().multiplyScalar(p.uy)).add(fwd.clone().multiplyScalar(p.fz));
      const pos = S.clone().sub(g.d.clone().multiplyScalar(f.strum[2] * s));
      const R3 = new THREE.Matrix4().makeBasis(g.x, g.d, g.yB.clone().negate());
      const Mloc = new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromRotationMatrix(R3), new THREE.Vector3(s, s, s));
      return { spine, Mloc, Minv: Mloc.clone().invert(), s, d: g.d, hs, Rm, Lm,
               TRloc: bl2gl(f.strum).applyMatrix4(Mloc), axes: { left, up, fwd }, res: { l: 0, r: 0 } };
    },
    apply(M, P) {
      const F = P.fit, f = M.actions[P.actionId].def.fit;
      const gtr = P.attachments[f.prop || 'guitar'].obj;
      if (gtr.parent !== F.spine) F.spine.add(gtr);
      F.Mloc.decompose(gtr.position, gtr.quaternion, gtr.scale);
      P.actor.updateMatrixWorld(true);
      const inv = _m.copy(F.spine.matrixWorld).invert();
      const Rs = F.hs.r.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
      const Ls = F.hs.l.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
      const slide = Math.max(-f.slideMax, Math.min(0, Ls.clone().sub(F.Lm).dot(F.d) / F.s));
      const TL = bl2gl([0, -0.03, f.zt + slide]).applyMatrix4(F.Mloc);
      const ql = F.TRloc.clone().add(Rs.sub(F.Rm)).applyMatrix4(F.Minv);
      if (Math.abs(ql.x) < 0.45 && ql.y < -0.45 && ql.z < 0.083 + 0.06) ql.z = 0.083 + 0.06;
      const TR = ql.applyMatrix4(F.Mloc);
      const W = F.spine.matrixWorld;
      const rl = reachChain(P.actor, ['upperarm.l', 'lowerarm.l'], 'handslot.l', TL.applyMatrix4(W), 24);
      const rr = reachChain(P.actor, ['upperarm.r', 'lowerarm.r'], 'handslot.r', TR.applyMatrix4(W), 24);
      F.res = { l: rl ? +rl.after.toFixed(4) : null, r: rr ? +rr.after.toFixed(4) : null };
    }
  },
  'trumpet-hold-v0': {
    prep(M, P, A) {
      const f = A.def.fit;
      P.actor.updateWorldMatrix(true, true);          // Eltern mit: sonst stimmt toActor nicht (gemessen: 4,1 statt 0,45)
      const toActor = new THREE.Matrix4().copy(P.actor.matrixWorld).invert();
      const verts = (node, out = []) => { if (node.userData.entry) return out; if (node.isMesh) { const pa = node.geometry.attributes.position; for (let i = 0; i < pa.count; i++) out.push(_a.fromBufferAttribute(pa, i).applyMatrix4(node.matrixWorld).applyMatrix4(toActor).clone()); } for (const c of node.children) verts(c, out); return out; };
      const head = P.actor.getObjectByName(f.head), arm = P.actor.getObjectByName(f.arm);
      const hv = verts(head);
      const hb = new THREE.Box3().setFromPoints(hv);
      const yM = hb.min.y + f.mouth.heightFrac * (hb.max.y - hb.min.y), cx = (hb.min.x + hb.max.x) / 2;
      let fz = -Infinity;
      for (const v of hv) if (Math.abs(v.y - yM) < 0.06 && Math.abs(v.x - cx) < 0.2) fz = Math.max(fz, v.z);
      const mouth = new THREE.Vector3(cx, yM, fz + f.mouth.inset);
      const pr = M.props.get(f.prop).obj;
      let mesh = null; pr.traverse((o) => { if (!mesh && o.isMesh) mesh = o; });
      const g = mesh.geometry; g.computeBoundingBox();
      const bb = g.boundingBox, pa = g.attributes.position, L = bb.max.z - bb.min.z;
      const spread = (lo, hi) => { let r = 0, k = 0; const c = new THREE.Vector3(); for (let i = 0; i < pa.count; i++) { const z = pa.getZ(i); if (z < lo || z > hi) continue; _b.fromBufferAttribute(pa, i); c.add(_b); k++; r = Math.max(r, Math.hypot(_b.x, _b.y)); } return { r, c: c.multiplyScalar(1 / Math.max(1, k)) }; };
      const lo = spread(bb.min.z, bb.min.z + 0.12 * L), hi = spread(bb.max.z - 0.12 * L, bb.max.z);
      const bellAtMax = hi.r > lo.r;
      const mp = (bellAtMax ? lo : hi).c, bell = (bellAtMax ? hi : lo).c;
      const s = f.scale;
      const D = new THREE.Vector3(...f.bell.dir).normalize();
      const zAxis = D.clone().multiplyScalar(bellAtMax ? 1 : -1);
      const xAxis = new THREE.Vector3(0, 1, 0).cross(zAxis).normalize();
      const R = new THREE.Matrix4().makeBasis(xAxis, zAxis.clone().cross(xAxis), zAxis);
      const q = new THREE.Quaternion().setFromRotationMatrix(R);
      const T = mouth.clone().sub(mp.clone().multiplyScalar(s).applyQuaternion(q));
      const mouthWorldActor = new THREE.Matrix4().compose(T, q, new THREE.Vector3(s, s, s));
      /* Arm: Pfote auf den nächsten Punkt der Trompete (Mundstück → Glocke) */
      const S = arm.getWorldPosition(new THREE.Vector3()).applyMatrix4(toActor);
      const av = verts(arm);
      let far = 0; for (const v of av) far = Math.max(far, v.distanceTo(S));
      const tipPts = av.filter((v) => v.distanceTo(S) > 0.82 * far);
      const tip = tipPts.reduce((c, v) => c.add(v), new THREE.Vector3()).multiplyScalar(1 / tipPts.length);
      const A0 = mouth.clone(), A1 = bell.clone().multiplyScalar(s).applyQuaternion(q).add(T);
      const nearOn = (P0) => { const sg = A1.clone().sub(A0), tt = Math.max(0, Math.min(1, P0.clone().sub(A0).dot(sg) / sg.lengthSq())); return A0.clone().add(sg.multiplyScalar(tt)); };
      /* Ziel der Pfote: unter dem Kinn, vor der Brust. Gemessen: der Mund liegt 0,76 von der
         Schulter, der starre Arm reicht 0,46 — eine Pfote, die auf den Mund zielt, verschwindet
         im Kopf (der Kopf reicht bis z 0,62). Unter dem Kinn bleibt sie sichtbar. */
      const chin = new THREE.Vector3(S.x * 0.7, hb.min.y - 0.05, Math.max(0.2, fz * 0.72));
      const parentQ = arm.parent.getWorldQuaternion(new THREE.Quaternion()).premultiply(new THREE.Quaternion().setFromRotationMatrix(toActor)).invert();
      const from = tip.clone().sub(S).normalize().applyQuaternion(parentQ);
      const to = chin.clone().sub(S).normalize().applyQuaternion(parentQ);
      const armQ = new THREE.Quaternion().setFromUnitVectors(from, to).multiply(arm.quaternion);
      const reach = tip.distanceTo(S);
      const pawTip = S.clone().add(chin.clone().sub(S).normalize().multiplyScalar(Math.min(reach, chin.distanceTo(S))));
      const near = nearOn(pawTip), need = nearOn(S).distanceTo(S);
      /* Pfoten-Variante: Trompete mit ihrem Griff (Pivot) auf der Pfotenspitze, gleiche Achse */
      const pawActor = new THREE.Matrix4().compose(pawTip, q, new THREE.Vector3(s, s, s));
      const mpPaw = mp.clone().multiplyScalar(s).applyQuaternion(q).add(pawTip);
      const tipLocal = arm.worldToLocal(tip.clone().applyMatrix4(P.actor.matrixWorld));
      return { head, arm, armQ, tipLocal, mouthActor: mouthWorldActor, pawActor, mode: f.anchor || 'mouth', mouth, near, pawTip,
               reach: +reach.toFixed(3), need: +need.toFixed(3), gap: +Math.max(0, need - reach).toFixed(3), pawToTrumpet: +pawTip.distanceTo(near).toFixed(3), mouthToMouthpiecePaw: +mpPaw.distanceTo(mouth).toFixed(3), bellAtMax, len: +(L * s).toFixed(3), pr };
    },
    apply(M, P) {
      const F = P.fit;
      F.arm.quaternion.copy(F.armQ);
      const host = F.mode === 'paw' ? F.arm : F.head;   // Mund = Invariante am Kopf · Pfote = am Arm
      if (F.pr.parent !== host) host.add(F.pr);
      P.actor.updateMatrixWorld(true);
      const hostActor = new THREE.Matrix4().copy(P.actor.matrixWorld).invert().multiply(host.matrixWorld);
      _m.copy(hostActor).invert().multiply(F.mode === 'paw' ? F.pawActor : F.mouthActor);
      _m.decompose(F.pr.position, F.pr.quaternion, F.pr.scale);
    }
  }
};
/* ================= Grooves: Bewegung aus Takt, Lautstärke und dem ANDEREN Musiker =================
   counterpoint-v1 · Der Trompeter kopiert den Leader nicht, er antwortet ihm:
   · Wippe statt Kopie: der Leader steht auf dem „und“ im Scheitel seines Sprungs (gemessen:
     Höhe 0,70 bei Schlag 0,5, 0 auf der Eins). Der Trompeter ist dann UNTEN und gestaucht und
     kommt hoch, wenn der Leader landet — zusammen ein Puls, zwei Körper gegenphasig.
   · Gegen-Stauchen: steht der Leader in der Luft, drückt sich der Trompeter zusammen (liest die
     LIVE-Höhe des Leaders, kein zweites Timing).
   · Stöße auf 2 und 4: Trompete kurz hoch, schneller Anstieg, Abklingen — die Backbeat-Akzente.
   · Fanfare am Phrasenende (Schlag 7–8, wenn der Leader sich dreht): Glocke hoch, Oberkörper
     zurück, kleiner Sprung, der mit dem Leader zusammen auf der nächsten Eins landet.
   · Blick: Körper und Glocke drehen sich zum Leader, wo immer er gerade tanzt (geglättet).
   · Wiegen gegenläufig zur Laufrichtung des Leaders (A→B in Takt 1, B→A in Takt 2).
   · Alles skaliert mit der Lautstärke des Songs (M.level, vom Host gemessen, 0…1). */
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const pulse = (e, att, dec) => (e < 0 ? 0 : (1 - Math.exp(-e / att)) * Math.exp(-e / dec));
const _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _X = new THREE.Vector3(1, 0, 0), _Y = new THREE.Vector3(0, 1, 0), _Z = new THREE.Vector3(0, 0, 1);
const GROOVES = {
  'counterpoint-v1'(M, P, t, g) {
    const f = M.actions[P.actionId].def.fit;
    const body = P.actor.getObjectByName(f.body), head = P.actor.getObjectByName(f.head);
    const arm = P.actor.getObjectByName(f.arm), free = P.actor.getObjectByName(f.freeArm);
    const S = P.groove || (P.groove = { yaw: 0, t: t, sign: null });
    const b = t;                                   // Schlag im 8er-Zyklus des Leaders
    const beat = Math.floor(b), fr = b - beat;
    const lv = clamp(0.45 + 0.9 * (M.level ?? 0.6), 0.45, 1.4);
    /* Leader live lesen */
    const L = M.perf[g.partner];
    let hL = 0, lookYaw = 0;
    if (L) {
      const lb = L.actor.getObjectByName(g.partnerBody);
      if (lb) {
        hL = Math.max(0, lb.position.y);
        lb.updateWorldMatrix(true, false);
        const pw = lb.getWorldPosition(_a);
        P.group.updateWorldMatrix(true, false);
        const loc = P.group.worldToLocal(pw.clone());
        lookYaw = clamp(Math.atan2(loc.x, loc.z) * 180 / Math.PI, -g.lookMax, g.lookMax);
      }
    }
    const dt = ((t - S.t) + 8) % 8; S.t = t;
    S.yaw += (lookYaw - S.yaw) * (1 - Math.exp(-(dt > 1 ? 1 : dt) * 3));
    const off = Math.max(0, Math.sin(Math.PI * ((b + 0.5) % 1)));            // oben auf dem Schlag, unten auf dem „und“ (gegen den Leader)
    const stab = beat % 2 === 1 ? pulse(fr, 0.03, 0.2) / 0.78 : 0;           // Schläge 2 und 4
    const fan = smooth((b - 6) / 1.2) * (1 - smooth((b - 7.7) / 0.3));       // Phrasenende
    const hopT = (b - 7.35) / 0.65;
    const hop = hopT > 0 && hopT < 1 ? Math.sin(Math.PI * hopT) : 0;        // landet mit dem Leader auf der Eins
    const squash = clamp(hL * g.squashK, 0, 0.16) + 0.05 * pulse(fr, 0.02, 0.12) * (beat % 2 === 0 ? 1 : 0);
    const sway = -Math.sin(Math.PI * b / 4) * g.sway;
    /* Körper */
    body.position.set(0, lv * (g.bob * off) + g.hop * hop, 0);
    body.scale.set(1 + squash * 0.5, 1 - squash, 1 + squash * 0.5);
    body.quaternion.setFromEuler(new THREE.Euler((-fan * g.lean - stab * 2) * D2R, S.yaw * D2R, sway * D2R, 'YXZ'));
    /* Kopf: Nicken auf dem „und“, hoch mit der Fanfare */
    head.quaternion.multiply(_q1.setFromAxisAngle(_X, (-fan * g.headUp + off * g.nod) * D2R));
    /* Trompeten-Arm: Stöße und Fanfare, Vorzeichen einmal gemessen (hebt die Pfote) */
    if (S.sign == null) {
      const tip = P.fit.tipLocal;
      const y = (sgn) => { const q0 = arm.quaternion.clone(); arm.quaternion.premultiply(_q2.setFromAxisAngle(_X, sgn * 10 * D2R)); arm.updateMatrixWorld(true); const v = arm.localToWorld(tip.clone()).y; arm.quaternion.copy(q0); arm.updateMatrixWorld(true); return v; };
      S.sign = y(1) > y(-1) ? 1 : -1;
    }
    arm.quaternion.premultiply(_q2.setFromAxisAngle(_X, S.sign * lv * (stab * g.stab + fan * g.fanfare) * D2R));
    /* freier Arm: pumpt gegen die Stöße */
    if (free) free.quaternion.premultiply(_q2.setFromAxisAngle(_Z, (off * g.pump - stab * g.pump) * D2R * (f.freeArm.includes('Right') ? 1 : -1)));
    P.grooveState = { level: +lv.toFixed(2), leaderHeight: +hL.toFixed(3), lookYaw: +S.yaw.toFixed(1), fanfare: +fan.toFixed(2), stab: +stab.toFixed(2) };
  }
};
export { FITS, GROOVES };
