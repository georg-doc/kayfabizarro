/* KFB · Editor-Schicht
   Zweiter Einbau des Mini-Editors aus `KayKit_Room_Study_S21.html`. Genau dafür sieht
   docs/EDITOR_LAYER.md vor, dass aus dem Block eine Bibliothek wird — „nicht vorher: eine
   Bibliothek aus einem einzigen Anwendungsfall ist geraten, nicht abgeleitet."

   Übernommen und nicht neu erfunden:
   · Auswahl auf `pointerup` mit 4-px-Schwelle. Auf `pointerdown` klaut der Raycast die ersten
     Frames jedes Orbit-Drags — und, hier teurer: ein Anfasser-Pfeil steht neben dem Objekt in
     der LUFT, der Strahl trifft dort nichts, und „nichts getroffen" löste die Auswahl. Der
     Anfasser verschwand im Moment des Zugreifens.
   · Picking nur auf SICHTBARES. three.js raycastet auch unsichtbare Objekte.
   · Ein Werkzeugmenü AM OBJEKT, höchstens sechs Felder, jedes eine Geste.
   · Raster beim Verschieben und Drehen.
   · Zwei Reichweiten, nie mehr: Einzelteil und Bedeutungsgruppe.

   Bewusst abweichend vom Raum-Standard: Rasterschritt 0,05 statt 0,1. Dort ist die Bezugsgröße
   ein Raummodul von 4 Einheiten, hier eine Figur von rund 2,3 — 0,1 wären 4 % der Figurenhöhe
   und damit für ein Mikrofon in der Hand zu grob. Die Winkelrasterung bleibt bei 15°.

   EIN Anfasser für alles. Wer ihn braucht (Puppe, Bone-Posing), LEIHT ihn sich über `borrow`.
   Zwei TransformControls auf demselben Canvas erzeugen genau die Klasse von Fehlern, die diese
   Datei beseitigen soll. */
import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const _b = new THREE.Box3();
const _v = new THREE.Vector3();

export function makeEditLayer(viewer, canvas, opts = {}) {
  const getRoot = opts.getRoot || (() => null);
  const recordOf = opts.recordOf || ((n) => n.userData.entry);
  const groupOf = opts.groupOf || (() => null);
  const menu = opts.menu || null;

  const gizmo = new TransformControls(viewer.camera, canvas);
  const helper = gizmo.getHelper ? gizmo.getHelper() : gizmo;
  helper.visible = false;
  viewer.scene.add(helper);
  const pivot = new THREE.Object3D();
  pivot.name = 'edit-pivot';
  viewer.scene.add(pivot);
  gizmo.addEventListener('dragging-changed', (e) => { viewer.controls.enabled = !e.value; });

  const listeners = new Set();
  const claims = [];
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let on = false, snap = true, scope = 'teil', mode = 'translate';
  let sel = [], borrowed = null, lastM = new THREE.Matrix4(), downAt = null;

  const notify = () => listeners.forEach((f) => f());
  const applySnap = () => {
    gizmo.setTranslationSnap(snap ? (opts.gridStep ?? 0.05) : null);
    gizmo.setRotationSnap(snap ? THREE.MathUtils.degToRad(opts.angleStep ?? 15) : null);
  };
  applySnap();

  function collectVisible(o, out) {
    if (!o.visible) return out;
    if (o.isMesh || o.isSkinnedMesh) out.push(o);
    for (const c of o.children) collectVisible(c, out);
    return out;
  }
  function nodeOf(obj) {
    let o = obj;
    while (o && !recordOf(o)) o = o.parent;
    return o || null;
  }

  const E = {
    gizmo, helper,
    get on() { return on; },
    get mode() { return mode; },
    get scope() { return scope; },
    get snap() { return snap; },
    get selection() { return sel.slice(); },
    get node() { return sel.length === 1 ? sel[0] : null; },
    onChange(f) { listeners.add(f); },
    /* Ein Mitbewerber um denselben Klick meldet sich hier an statt einen eigenen Listener in der
       Capture-Phase aufzumachen. Erste Funktion, die `true` liefert, hat den Klick. */
    addClaim(f) { claims.push(f); },
    busy() { return !!(gizmo.dragging || gizmo.axis); },

    setOn(v) {
      on = v;
      if (!on) E.clear();
      helper.visible = on && (sel.length > 0 || !!borrowed);
      notify();
    },
    setMode(m) {
      mode = m;
      gizmo.setMode(m);
      notify();
    },
    setScope(s) { scope = s; E.clear(); notify(); },
    setSnap(v) { snap = v; applySnap(); notify(); },

    /* ---- Leihgabe: Puppe und Bone-Posing hängen an DEMSELBEN Anfasser ---- */
    borrow(obj, m, onDrag, label) {
      E.clear(true);
      borrowed = { obj, onDrag, label: label || obj.name };
      mode = m;
      gizmo.setMode(m);
      gizmo.attach(obj);
      helper.visible = true;
      notify();
      return borrowed;
    },
    release() {
      borrowed = null;
      gizmo.detach();
      helper.visible = false;
      notify();
    },
    get borrowed() { return borrowed; },

    select(node) {
      borrowed = null;
      const rec = node && recordOf(node);
      const root = getRoot();
      sel = !rec ? []
        : (scope === 'gruppe' && groupOf(rec) && root)
          ? root.children.filter((x) => x.visible && recordOf(x) && groupOf(recordOf(x)) === groupOf(rec))
          : [node];
      if (!sel.length) { gizmo.detach(); helper.visible = false; notify(); return null; }
      if (sel.length === 1) gizmo.attach(sel[0]);
      else {
        _b.makeEmpty();
        for (const x of sel) _b.expandByObject(x);
        pivot.position.copy(_b.getCenter(_v));
        pivot.rotation.set(0, 0, 0);
        pivot.updateMatrixWorld(true);
        lastM.copy(pivot.matrixWorld).invert();
        gizmo.attach(pivot);
      }
      gizmo.setMode(mode);
      helper.visible = true;
      E.follow();
      notify();
      return sel[0];
    },
    clear(keepMenu) {
      sel = [];
      borrowed = null;
      gizmo.detach();
      helper.visible = false;
      if (menu && !keepMenu) menu.hidden = true;
      notify();
    },

    /* Absetzen: senkrecht nach unten gegen alles Sichtbare, das NICHT zur Auswahl gehört. Ohne
       Treffer ist der Boden die Fläche — das ist eine Aussage, keine Notlösung. */
    drop() {
      const root = getRoot();
      const out = [];
      for (const x of sel) {
        if (x.userData.attachedTo) { out.push({ id: recordOf(x)?.id, refused: `hängt an ${x.userData.attachedTo}` }); continue; }
        _b.setFromObject(x);
        const c = _b.getCenter(new THREE.Vector3());
        let y = 0, onWhat = 'Boden y=0';
        if (root) {
          const targets = collectVisible(root, []).filter((m) => { let p = m; while (p) { if (p === x) return false; p = p.parent; } return true; });
          const r = new THREE.Raycaster(new THREE.Vector3(c.x, _b.min.y - 0.001, c.z), new THREE.Vector3(0, -1, 0), 0, 400);
          const hit = r.intersectObjects(targets, false)[0];
          if (hit) { y = hit.point.y; onWhat = hit.object.name || 'unbenannte Fläche'; }
        }
        const moved = y - _b.min.y;
        x.position.y += moved;
        x.updateMatrixWorld(true);
        out.push({ id: recordOf(x)?.id, moved: +moved.toFixed(4), to: +y.toFixed(4), on: onWhat });
      }
      if (sel.length) { opts.onChange?.(sel); E.follow(); notify(); }
      return out;
    },

    /* Das Menü folgt der Auswahl beim Drehen der Kamera — deshalb pro Frame, nicht pro Klick. */
    follow() {
      if (!menu) return;
      const target = borrowed ? [borrowed.obj] : sel;
      if (!on || !target.length) { menu.hidden = true; return; }
      _b.makeEmpty();
      for (const x of target) _b.expandByObject(x);
      /* Ein Bone hat keine Geometrie: dann hängt das Menü an seinem Ursprung (S8, Glieder-Auswahl) */
      let c, top;
      if (_b.isEmpty()) { c = target[0].getWorldPosition(new THREE.Vector3()); top = c.y; }
      else { c = _b.getCenter(_v).clone(); top = _b.max.y; }
      const p = new THREE.Vector3(c.x, top, c.z).project(viewer.camera);
      const r = canvas.getBoundingClientRect();
      const host = menu.offsetParent ? menu.offsetParent.getBoundingClientRect() : r;
      menu.hidden = false;
      menu.style.left = (r.left - host.left + (p.x * 0.5 + 0.5) * r.width) + 'px';
      menu.style.top = Math.max(4, r.top - host.top + (-p.y * 0.5 + 0.5) * r.height - 42) + 'px';
    }
  };

  gizmo.addEventListener('objectChange', () => {
    if (borrowed) { borrowed.onDrag?.(); E.follow(); notify(); return; }
    if (sel.length > 1) {
      pivot.updateMatrixWorld(true);
      const delta = new THREE.Matrix4().multiplyMatrices(pivot.matrixWorld, lastM);
      for (const x of sel) { x.applyMatrix4(delta); x.updateMatrixWorld(true); }
      lastM.copy(pivot.matrixWorld).invert();
    }
    opts.onChange?.(sel);
    E.follow();
    notify();
  });

  canvas.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    const d = downAt;
    downAt = null;
    if (!d) return;
    if (Math.hypot(e.clientX - d[0], e.clientY - d[1]) > 4) return; // Orbit-Drag ist keine Auswahl
    if (gizmo.dragging || gizmo.axis) return;                       // Griff an der eigenen Achse auch nicht
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, viewer.camera);
    for (const c of claims) if (c(ray, e)) return;
    const root = getRoot();
    const hit = root ? ray.intersectObjects(collectVisible(root, []), false)[0] : null;
    const node = hit ? nodeOf(hit.object) : null;
    /* Auch bei AUSGESCHALTETEM Editor wird gemeldet, was getroffen wurde — die Auskunftskarte
       (Pfad, Rolle, Maße) ist kein Editierwerkzeug und darf nicht am Editor hängen. */
    if (!on) { opts.onPick?.(node, node ? recordOf(node) : null); return; }
    if (!node) { E.clear(); opts.onPick?.(null, null); return; }
    E.select(node);
    opts.onPick?.(node, recordOf(node));
  });

  if (menu) menu.addEventListener('click', (e) => {
    const m = e.target.closest('button')?.dataset.m;
    if (!m) return;
    if (m === 'translate' || m === 'rotate' || m === 'scale') E.setMode(m);
    else if (m === 'floor') opts.onMenu?.('floor');
    else if (m === 'scope') E.setScope(scope === 'teil' ? 'gruppe' : 'teil');
    else if (m === 'close') E.clear();
    else opts.onMenu?.(m);
  });

  return E;
}
