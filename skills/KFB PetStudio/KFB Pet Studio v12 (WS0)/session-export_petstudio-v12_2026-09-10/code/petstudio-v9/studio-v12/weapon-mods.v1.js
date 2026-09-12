/* weapon-mods.v1.js — Pet Studio v12-S9 (10.09.2026). Georgs Bestellung vom 10.09.:
   »kenney_blaster-kit_2.1 als weapon-mods für arena-FB statt der default gun (power-ups, skins etc)
   aufbereiten und als dropdown kontextuell anbieten«.

   WAS DAS MODUL TUT: es hängt ein Kenney-Blaster-Modell an DENSELBEN Handknochen, an dem das
   Platformer-Gewehr hängt, blendet das Standardgewehr aus und nimmt seine LAGE UND GRÖSSE als Maß.
   Es baut keine Waffe, es tauscht eine. Ein Eigentümer der Zahlen: das Standardgewehr.

   MESSEN → VERSTEHEN → BAUEN, in dieser Reihenfolge:
   • Das Standardgewehr ist laut Quelle (`frizzlebob.v4a.js` Z. 397 ff., GEMESSEN 06.09.) **vier PLAIN
     Meshes `Cube003*`** (Black · Gun_Grey · White · Main) am Handknochen — nicht ein Mesh, und nicht
     geskinnt. Der Materialname allein (`Gun_Grey`) fing nur eins von vier; darum ist das Kriterium hier
     **plain Mesh unter einem Knochen, dessen Name auf Hand/Faust/Handgelenk passt** — dieselbe Familie,
     die auch der Bodenmesser des Moduls ausschließt.
   • Gemessen wird in der KNOCHEN-Koordinate, nicht in der Welt: die Figur wird skaliert, gedreht und
     animiert; eine Weltkiste wäre eine Momentaufnahme. Aus den vier Kisten wird EINE Referenzkiste,
     ihre längste Achse ist der Lauf.
   • Der Mod wird auf diese Länge gebracht (ein Faktor, keine drei) und mit seiner längsten Achse auf die
     Laufachse der Referenz gedreht. Was danach noch schief steht, ist Handhaltung und kein Rechenfehler —
     dafür gibt es `yaw`/`roll`/`along`/`up` als HANDGRIFFE, keine stillen Konstanten.
   • Der Face-Host (Ellipsoid am Kopfknochen, Deckkraft 0) und alle Pet-Overlays tragen `petOverlay` und
     sind ausgeschlossen; ohne diesen Filter würde das Gesicht als »Gewehr« gemessen.

   FEHLER SIND ZUSTÄNDE, kein Absturz: ohne Standardgewehr (Variante `plain`) gibt es kein Maß und keinen
   Mod — `{status:'UNSUPPORTED', reason:'no default gun to replace'}`. Die Oberfläche zeigt das grau an,
   sie versteckt es nicht.

   SKINS sind ein Farbanstrich auf den Materialien des Mods (Kopien, nie das geladene Original), damit
   Power-up-Stufen unterscheidbar sind, ohne eine zweite Datei zu laden. `stock` = wie geliefert. */

export const BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_blaster-kit_2.1/';
const GLB = 'Models/GLB%20format/';   // der Ordnername trägt ein Leerzeichen — kodiert, sonst 404

/* Der Katalog ist der GEMESSENE Bestand des Repos (40 Vorschaubilder, 10.09. gelesen), nicht geraten.
   `slot` sagt, was das Ding IST — nur `hand` gehört in die Faust; Zubehör und Ziele stehen hier, weil sie
   für Power-ups und die Arena gebraucht werden, aber sie werden nicht als Waffe angeboten. */
export const CATALOG = Object.freeze([
  ...'abcdefghijklmnopqr'.split('').map((c) => ({ id: 'blaster-' + c, label: 'Blaster ' + c.toUpperCase(), slot: 'hand', tier: 'abcdef'.includes(c) ? 1 : ('ghijkl'.includes(c) ? 2 : 3) })),
  { id: 'clip-small', label: 'Clip small', slot: 'mod' },
  { id: 'clip-large', label: 'Clip large', slot: 'mod' },
  { id: 'scope-small', label: 'Scope small', slot: 'mod' },
  { id: 'scope-large-a', label: 'Scope large A', slot: 'mod' },
  { id: 'scope-large-b', label: 'Scope large B', slot: 'mod' },
  { id: 'silencer-small', label: 'Silencer small', slot: 'mod' },
  { id: 'silencer-larger', label: 'Silencer larger', slot: 'mod' },
  { id: 'grenade-a', label: 'Grenade A', slot: 'hand' },
  { id: 'grenade-b', label: 'Grenade B', slot: 'hand' },
  { id: 'bullet-foam', label: 'Foam bullet', slot: 'ammo' },
  { id: 'bullet-foam-thick', label: 'Foam bullet thick', slot: 'ammo' },
  { id: 'bullet-foam-tip', label: 'Foam tip', slot: 'ammo' },
  { id: 'bullet-foam-tip-thick', label: 'Foam tip thick', slot: 'ammo' },
  { id: 'crate-small', label: 'Crate small', slot: 'prop' },
  { id: 'crate-medium', label: 'Crate medium', slot: 'prop' },
  { id: 'crate-wide', label: 'Crate wide', slot: 'prop' },
  { id: 'target-small', label: 'Target small', slot: 'prop' },
  { id: 'target-large', label: 'Target large', slot: 'prop' },
  { id: 'target-detail', label: 'Target detail', slot: 'prop' },
  { id: 'target-fragment-small', label: 'Fragment small', slot: 'prop' },
  { id: 'target-fragment-large', label: 'Fragment large', slot: 'prop' },
  { id: 'smoke', label: 'Smoke', slot: 'fx' },
]);
export const HAND_IDS = CATALOG.filter((e) => e.slot === 'hand').map((e) => e.id);
export const urlFor = (id) => BASE + GLB + id + '.glb';
export const previewFor = (id) => BASE + 'Previews/' + id + '.png';

/* Skins: EIN Farbanstrich, vier Stufen plus »wie geliefert«. Kein zweites Modell, keine zweite Datei. */
export const SKINS = Object.freeze({ stock: null, kfb: '#e96049', teal: '#286d70', ink: '#2b3440', gold: '#e6b671' });
export const SKIN_NAMES = Object.keys(SKINS);

export const DEFAULTS = Object.freeze({ model: 'none', skin: 'stock', scale: 1, yaw: 0, roll: 0, along: 0, up: 0 });

export function validate(patch) {
  const limits = { scale: [0.3, 3], yaw: [-180, 180], roll: [-180, 180], along: [-1, 1], up: [-1, 1] };
  for (const [k, v] of Object.entries(patch)) {
    if (!(k in DEFAULTS)) return { status: 'UNSUPPORTED', field: k, reason: 'Unknown weapon-mod field' };
    if (limits[k] && (!Number.isFinite(v) || v < limits[k][0] || v > limits[k][1])) return { status: 'UNSUPPORTED', field: k, reason: 'Out of range' };
    if (k === 'model' && v !== 'none' && !CATALOG.some((e) => e.id === v)) return { status: 'UNSUPPORTED', field: k, reason: 'Unknown model id' };
    if (k === 'skin' && !(v in SKINS)) return { status: 'UNSUPPORTED', field: k, reason: 'Unknown skin' };
  }
  return { status: 'OK' };
}

const HAND_RE = /fist|hand|wrist/i;

export class WeaponMods {
  constructor({ THREE, loader }) { this.T = THREE; this.loader = loader; this.cache = new Map(); this.report = null; this._mounted = null; this._hidden = []; }

  /* Das Standardgewehr FINDEN, nicht annehmen: plain Meshes unter einem Hand-Knochen, ohne Pet-Overlays.
     Rückgabe: {bone, meshes, box (Knochen-Koordinate), len, axis} oder null. */
  measureDefaultGun(figure) {
    const T = this.T, hits = [];
    figure.updateMatrixWorld(true);
    /* Erst nach dem NAMEN fragen, den das Modul selbst benutzt (`figure.getObjectByName('Gun')` steht so im
       Wirt) — der Eigentümer weiß besser, was sein Gewehr ist als eine Regel über Netznamen. Nur wenn es den
       Knoten nicht gibt, wird gesucht. */
    const named = figure.getObjectByName('Gun');
    if (named) {
      let bone = named.parent;
      while (bone && !bone.isBone) bone = bone.parent;
      named.traverse((n) => { if (n.isMesh) hits.push([n, bone]); });
    }
    if (!hits.length) figure.traverse((n) => {
      if (!n.isMesh || n.isSkinnedMesh) return;
      if (n.userData && (n.userData.petOverlay || n.userData.faceHost)) return;
      let a = n.parent, bone = null;
      while (a) { if (a.isBone && HAND_RE.test(a.name)) { bone = a; break; } a = a.parent; }
      if (bone) hits.push([n, bone]);
    });
    if (!hits.length) return null;
    const bone = hits[0][1];
    if (!bone) return null;
    bone.updateMatrixWorld(true);
    const inv = new T.Matrix4().copy(bone.matrixWorld).invert();
    const box = new T.Box3();
    for (const [m] of hits) {
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
      const b = m.geometry.boundingBox.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inv, m.matrixWorld));
      box.union(b);
    }
    const size = box.getSize(new T.Vector3());
    const axis = size.x >= size.y && size.x >= size.z ? 'x' : (size.y >= size.z ? 'y' : 'z');
    return { bone, meshes: hits.map(([m]) => m), box, size, len: size[axis], axis, center: box.getCenter(new T.Vector3()) };
  }

  async _load(id) {
    if (this.cache.has(id)) return this.cache.get(id).clone(true);
    const gltf = await this.loader.loadAsync(urlFor(id));
    const src = gltf.scene || gltf.scenes[0];
    src.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; } });
    this.cache.set(id, src);
    return src.clone(true);
  }

  clear() {
    if (this._mounted) { this._mounted.removeFromParent(); this._mounted.traverse((n) => { if (n.isMesh) { n.geometry === null; if (n.material && n.material.__modClone) n.material.dispose(); } }); this._mounted = null; }
    for (const m of this._hidden) m.visible = true;
    this._hidden = [];
  }

  /* `p` = {model, skin, scale, yaw, roll, along, up}. Immer erst messen, dann setzen. */
  async apply(figure, p) {
    const T = this.T, par = { ...DEFAULTS, ...p };
    const check = validate(par); if (check.status !== 'OK') { this.report = check; return check; }
    this.clear();
    if (par.model === 'none') { this.report = { status: 'OK', model: 'none' }; return this.report; }
    const ref = this.measureDefaultGun(figure);
    if (!ref) { this.report = { status: 'UNSUPPORTED', field: 'model', reason: 'no default gun to replace (variant plain?)' }; return this.report; }
    let obj;
    try { obj = await this._load(par.model); }
    catch (e) { this.report = { status: 'UNSUPPORTED', field: 'model', reason: 'GLB not reachable: ' + (e && e.message) }; return this.report; }

    /* Eigene Materialkopien — der Skin darf das gecachte Original nicht anfassen (sonst trägt der nächste
       Mod die Farbe des vorigen). Textur bleibt, es wird nur multipliziert. */
    const tint = SKINS[par.skin];
    let textured = 0, mats = 0;
    obj.traverse((n) => {
      if (!n.isMesh) return;
      n.material = n.material.clone(); n.material.__modClone = true; mats++;
      if (n.material.map) textured++;
      if (tint) n.material.color = new T.Color(tint);
      n.userData.weaponMod = true;
    });

    /* Größe: EIN Faktor auf die Lauflänge der Referenz. Eigene Kiste vorher messen (das Modell kommt in
       Kenney-Maß, nicht in Figuren-Maß). */
    const raw = new T.Box3().setFromObject(obj);
    const rs = raw.getSize(new T.Vector3());
    const mAxis = rs.x >= rs.y && rs.x >= rs.z ? 'x' : (rs.y >= rs.z ? 'y' : 'z');
    const k = (ref.len / Math.max(1e-6, rs[mAxis])) * par.scale;

    /* Drehung: längste Achse des Mods auf die Laufachse der Referenz. Dann Georgs zwei Handgriffe. */
    const from = new T.Vector3(mAxis === 'x' ? 1 : 0, mAxis === 'y' ? 1 : 0, mAxis === 'z' ? 1 : 0);
    const to = new T.Vector3(ref.axis === 'x' ? 1 : 0, ref.axis === 'y' ? 1 : 0, ref.axis === 'z' ? 1 : 0);
    const holder = new T.Group(); holder.name = 'KFB weapon mod · ' + par.model;
    const align = new T.Quaternion().setFromUnitVectors(from, to);
    const yaw = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), par.yaw * Math.PI / 180);
    const roll = new T.Quaternion().setFromAxisAngle(to, par.roll * Math.PI / 180);
    holder.quaternion.copy(roll.multiply(yaw).multiply(align));
    holder.scale.setScalar(k);

    /* Lage: der Mod sitzt dort, wo das Standardgewehr saß — Mittelpunkt auf Mittelpunkt, in
       KNOCHEN-Koordinate. Die eigene Kistenmitte wird vorher weggerechnet, sonst hängt das Modell an
       seinem Ursprung und nicht an seiner Masse. */
    const own = raw.getCenter(new T.Vector3()).multiplyScalar(-1);
    obj.position.copy(own);
    holder.add(obj);
    const pos = ref.center.clone();
    const alongV = to.clone().multiplyScalar(par.along * ref.len);
    pos.add(alongV); pos.y += par.up * ref.len * 0.5;
    holder.position.copy(pos);
    ref.bone.add(holder);
    this._mounted = holder;

    for (const m of ref.meshes) { if (m.visible) { m.visible = false; this._hidden.push(m); } }

    this.report = { status: 'OK', model: par.model, skin: par.skin, bone: ref.bone.name,
      refLen: +ref.len.toFixed(4), refAxis: ref.axis, refMeshes: ref.meshes.length, hidden: this._hidden.length,
      modLen: +rs[mAxis].toFixed(4), modAxis: mAxis, factor: +k.toFixed(4), materials: mats, textured,
      center: ref.center.toArray().map((v) => +v.toFixed(4)) };
    return this.report;
  }
}
