/* PetLibrary — SPRINT 10: config-getriebene Character-Library (Baukasten).
   Konsolidiert Cube-Pet (SPRINT 07) zu EINEM Code-Pfad: neue Figuren = nur Config + Assets.
   - SETS: ein Character-Set = ein Config-Eintrag { urlPattern, chars, clipMap our->their,
     scale, reskin, eyeAnchor(default), overrides(pro Char), mods }. 'humans'/'graveyard'
     sind damit reine Config-Erweiterung (Ausblick, Spec SPRINT 10).
   - MODS (steckbar, an/aus pro Set): googly (Sclera+Pupille, geteilter Default-Anchor,
     Surface-Fit-Raycast für die Overlay-Tiefe, Pupillen-Tracking geclampt), emotes
     (Comic-Pips über der Figur), recolor (selektiver Colormap-Tint, v4).
   - Trigger-API UNVERÄNDERT aus SPRINT 07: play(idle/enter/hop/kickDie/speak/eat/celebrate/
     react-positive/react-negative/deflate) · lookAt(target) · blink() · gazeIdle() ·
     kickDie(target) · speak() · react(kind) · celebrate() · deflate() · goHome() · update(dt).
   - Bus-Hooks (08) bleiben im Host: turn:roll->kickDie+lookAt(die) · turn:tell->speak+
     lookAt(card) · turn:verdict->react+lookAt(king) · questResolve->celebrate|deflate.
   Prime Directive: alles event-getrieben (Interpunktion einer Rede), settlet in Ruhe —
   kein Idle-Fidget. Back-Compat: export { Character as CubePet }. */

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
export const PET_BASE = RAW + 'media/3D_Assets/GLB_cube-pets/';

// ---------- Character-Sets (erweiterbar per Config, Spec SPRINT 10) ----------
export const SETS = {
  animals: {
    urlPattern: PET_BASE + 'animal-{id}.glb',
    chars: ['bunny', 'cat', 'fox', 'tiger', 'lion', 'penguin', 'panda', 'koala', 'deer', 'monkey',
      'pig', 'hog', 'cow', 'polar', 'beaver', 'giraffe', 'chick', 'fish', 'parrot', 'bee',
      'crab', 'caterpillar', 'elephant', 'dog'],
    // our->their: Kenney-GLBs tragen die Namen schon so; andere Sets mappen hier um.
    clipMap: {
      static: 'static', idle: 'idle', walk: 'walk', run: 'run', eat: 'eat', dance: 'dance',
      'gesture-positive': 'gesture-positive', 'gesture-negative': 'gesture-negative'
    },
    scale: 0.82,
    reskin: 'colormap', // Colormap behalten, Material kommt vom Host (Toon/Standard je Look)
    // EIN geteilter Default-Anchor (Spec 10 §Googly): Werte in U (= halbe Body-Größe, body-lokal).
    // dx: seitl. Augenabstand · dy: Höhe · z: Fallback-Tiefe (wenn der Surface-Raycast nicht trifft)
    // ring/sclera/pupil: Radien · track: max. Pupillen-Auslenkung
    // Postmortem-Item #1: dy tiefer + Radien größer, damit das Overlay die GEMALTE GLB-Augenzelle
    // abdeckt (grauer Halbmond unter der Sclera weg).
    eyeAnchor: { dx: 0.315, dy: -0.125, z: 0.70, ring: 0.275, sclera: 0.228, pupil: 0.105, track: 0.093 },
    // Override NUR für Ausreißer, pro Char — z.B. { giraffe: { eyeAnchor: { dy: 0.12 } } }
    overrides: {},
    mods: ['googly', 'emotes']
  }
  // AUSBLICK (Spec SPRINT 10 — bewusst noch NICHT angelegt, erst wenn Assets im Repo liegen):
  // humans:    { urlPattern: RAW+'media/3D_Assets/GLB_mini-characters/{id}.glb', clipMap:{...}, ... }
  // graveyard: { urlPattern: ..., ... }  -> Skelette/Untote als Crit-Variante. Kein neuer Code.
};

// Archetyp -> (Set, Char) — 06-Roster; Pets jetzt, Human-Chars später nur per set-Feld.
export const ARCHETYPES = {
  frizzlebob: { set: 'animals', char: 'bunny',   recolor: 0xf2c93c, label: 'FrizzleBob' }, // Canon-Hase, selektiv GELB
  ailiza:     { set: 'animals', char: 'cat',     label: 'A.I.Liza' },
  stefain:    { set: 'animals', char: 'tiger',   label: 'Stef.A.I.n' },
  dochainer:  { set: 'animals', char: 'penguin', label: 'Doc H.A.I.ner' },
  kaifabster: { set: 'animals', char: 'fox',     label: 'KA.I.Fabster' },
  nadaia:     { set: 'animals', char: 'koala',   label: 'Nad.A.I.a' }
};

// Trigger -> Clip (kanonische our-Namen; Set-clipMap übersetzt). Stretch/Squash liegt obendrauf.
const TRIGGERS = {
  idle:             { clip: 'idle', loop: true },
  enter:            { clip: 'walk', loop: true },
  hop:              { clip: 'run',  loop: true },
  run:              { clip: 'run',  loop: true },
  kickDie:          { clip: 'run',  loop: true },
  speak:            { clip: 'idle', loop: true },
  eat:              { clip: 'eat',  loop: false },
  celebrate:        { clip: 'dance', loop: true, hold: 2.6 },
  'react-positive': { clip: 'gesture-positive', loop: false },
  'react-negative': { clip: 'gesture-negative', loop: false },
  deflate:          { clip: 'gesture-negative', loop: false }
};

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ---------- FACE-Geometrie-Chirurgie (v5, Brief BRIEF_pet_editor_v5.md) ----------
// Kenneys Gesicht ist GEOMETRIE im body-Mesh, keine Textur (die colormap ist ein reiner
// Palette-Atlas). Augen/Schnauze sitzen als getrennte Schalen (connected components) im Mesh.
// stripEyes/stripSnout LOESCHEN diese Schalen BEIM LADEN, contract-gesteuert (face.stripEyes /
// face.stripSnout.perPet). Geloescht, nicht versteckt; reversibel ueber die gespeicherte
// Original-Geometrie. Findet stripEyes nicht GENAU zwei gespiegelte Schalen: nichts, nur Warnung.
//
// faceShells(geo): getrennte Schalen ueber verschweisste (auf 1e-3 gerundete) Positionen.
// Reihenfolge = Dreieck-Reihenfolge, also deterministisch -> stabile Indizes fuer stripSnout.perPet.
export function faceShells(geo) {
  const pos = geo.attributes.position;
  const idx = geo.index;
  const triCount = idx ? (idx.count / 3) : (pos.count / 3);
  const gi = (t, c) => idx ? idx.getX(t * 3 + c) : (t * 3 + c);
  const Q = 1000;
  const weld = new Map(); const vid = new Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    const k = Math.round(pos.getX(i) * Q) + '_' + Math.round(pos.getY(i) * Q) + '_' + Math.round(pos.getZ(i) * Q);
    let id = weld.get(k); if (id === undefined) { id = weld.size; weld.set(k, id); } vid[i] = id;
  }
  const parent = new Array(weld.size); for (let i = 0; i < parent.length; i++) parent[i] = i;
  const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
  const uni = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[a] = b; };
  for (let t = 0; t < triCount; t++) { uni(vid[gi(t, 0)], vid[gi(t, 1)]); uni(vid[gi(t, 1)], vid[gi(t, 2)]); }
  const groups = new Map();
  for (let t = 0; t < triCount; t++) { const r = find(vid[gi(t, 0)]); let g = groups.get(r); if (!g) { g = []; groups.set(r, g); } g.push(t); }
  const shells = [];
  for (const tris of groups.values()) {
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (const t of tris) for (let c = 0; c < 3; c++) {
      const i = gi(t, c), x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      if (x < xmin) xmin = x; if (x > xmax) xmax = x;
      if (y < ymin) ymin = y; if (y > ymax) ymax = y;
      if (z < zmin) zmin = z; if (z > zmax) zmax = z;
    }
    shells.push({ tris, count: tris.length, xmin, xmax, ymin, ymax, zmin, zmax });
  }
  return shells;
}

// selectEyeShells(shells, face): das Augen-PAAR nach der an 24 Pets vermessenen Regel:
// Z konstant = zPlane (Tol zTolerance) UND >= minTris UND X spannt nicht ueber Null (je eine Seite).
// Genau zwei solche Schalen, auf gegenueberliegenden X-Seiten -> das Paar; sonst null (kein Raten).
// Nasenloecher (Z abweichend, 2 Tris) fallen durch zPlane/minTris; Mund/Nase (mittig, X ueber Null)
// durch die X-Seiten-Bedingung.
export function selectEyeShells(shells, face) {
  const es = (face && face.eyeShell) || {};
  const zP = es.zPlane != null ? es.zPlane : 0.635;
  const zt = es.zTolerance != null ? es.zTolerance : 0.002;
  const minT = es.minTris != null ? es.minTris : 25;
  const cand = [];
  for (let i = 0; i < shells.length; i++) {
    const s = shells[i];
    const flatZ = Math.abs(s.zmin - zP) <= zt && Math.abs(s.zmax - zP) <= zt;
    const xSameSide = (s.xmin > 0 && s.xmax > 0) || (s.xmin < 0 && s.xmax < 0);
    if (s.count >= minT && flatZ && xSameSide) cand.push(i);
  }
  if (cand.length !== 2) return null;
  const opposite = (shells[cand[0]].xmin > 0) !== (shells[cand[1]].xmin > 0);
  return opposite ? cand : null;
}

// buildStripped(geo, stripTris, facet): neue Geometrie ohne die genannten Dreiecke (Index gefiltert).
// v7 Eingriff 2: Normalen werden NICHT mehr eigenmächtig neu gerechnet. Der Index-Filter lässt die
// per-Vertex-Normalen (Kenneys runde) gültig -> runder Look bleibt. Nur wenn facet===true explizit
// gewollt ist (Contract face.facet), facettiert computeVertexNormals() hart. Default: rund.
export function buildStripped(geo, stripTris, facet) {
  const idx = geo.index;
  const triCount = idx ? (idx.count / 3) : (geo.attributes.position.count / 3);
  const gi = (t, c) => idx ? idx.getX(t * 3 + c) : (t * 3 + c);
  const strip = new Set(stripTris);
  const keep = [];
  for (let t = 0; t < triCount; t++) { if (strip.has(t)) continue; keep.push(gi(t, 0), gi(t, 1), gi(t, 2)); }
  const ng = geo.clone();
  ng.setIndex(keep);
  if (facet === true) ng.computeVertexNormals();   // nur auf ausdrücklichen Contract-Wunsch (sonst Kenneys runde Normalen behalten)
  ng.computeBoundingBox(); ng.computeBoundingSphere();
  return ng;
}

// ---------- Mod-Slots (steckbar; ein Mod = attach/update/dispose auf der Character-Instanz) ----------
export const MODS = {
  // GOOGLY-EYES: zwei cel-flache Augen (Ink-Ring + Sclera + Pupille), geteilter Default-Anchor,
  // Overlay-Tiefe per Surface-Fit-Raycast (sitzt AUF dem Kopf, clippt/schwebt nicht),
  // Pupillen-Tracking: lookAt-Richtung body-lokal projiziert, auf Sclera-Radius geclampt.
  googly: {
    attach(ch) {
      const THREE = ch.THREE;
      if (ch._eyeRig && ch._eyeRig.parent) { ch._eyeRig.parent.remove(ch._eyeRig); ch._eyeRig = null; }
      // An das animierte BODY-Mesh hängen — Augen erben jede Node-Anim + den Squash (Spec 12/13).
      const meshes = []; ch.inner.traverse((n) => { if (n.isMesh && !n.userData.petOverlay) meshes.push(n); });
      ch._body = meshes.find((m) => m.name && m.name.toLowerCase() === 'body') || meshes[0];
      if (!ch._body) return;
      const bs = new THREE.Vector3(); ch._body.getWorldScale(bs);
      const bb = new THREE.Box3().setFromObject(ch._body);
      const wsz = bb.getSize(new THREE.Vector3());
      const wc = bb.getCenter(new THREE.Vector3());
      const lc = ch._body.worldToLocal(wc.clone());                 // Geometrie-Zentrum body-lokal
      const U = (Math.max(wsz.x, wsz.y) / 2) / Math.max(bs.x, 1e-4); // lokale Halbgröße
      const a = ch._anchor();                                        // Default-Anchor + Char-Override gemerged
      // Surface-Fit: von vor dem Gesicht nach -Z raycasten -> Auge sitzt AUF der Oberfläche.
      const ray = new THREE.Raycaster(); ray.layers.enableAll();
      const fitZ = (ex, ey) => {
        const oW = ch._body.localToWorld(new THREE.Vector3(ex, ey, U * 2.5));
        const dW = new THREE.Vector3(0, 0, -1).transformDirection(ch._body.matrixWorld).normalize();
        ray.set(oW, dW);
        const hit = ray.intersectObject(ch._body, false)[0];
        return hit ? ch._body.worldToLocal(hit.point.clone()).z + U * 0.006 : lc.z + U * a.z;
      };
      const disc = (r, color, z) => new THREE.Mesh(new THREE.CircleGeometry(r, 40),
        new THREE.MeshBasicMaterial({ color, toneMapped: false }));
      const mkEye = (sx) => {
        const ex = lc.x + sx * U * a.dx, ey = lc.y + U * a.dy;
        const e = new THREE.Group();
        const ring = disc(U * a.ring, 0x1f1a14); e.add(ring);                       // Ink-Ring (Tusche)
        const sc = disc(U * a.sclera, 0xf5f1e6); sc.position.z = U * 0.012; e.add(sc); // Sclera (cel-weiß)
        const pu = disc(U * a.pupil, 0x241d18); pu.position.z = U * 0.024; e.add(pu);  // Pupille (bewegt sich)
        e.position.set(ex, ey, fitZ(ex, ey));
        e._sc = sc; e._pu = pu;
        e._px = 0; e._py = 0; e._pvx = 0; e._pvy = 0; e._tx = 0; e._ty = 0;
        return e;
      };
      const rig = new THREE.Group(); rig.userData.petOverlay = true;
      const L = mkEye(-1), R = mkEye(1);
      rig.add(L); rig.add(R);
      ch._eyeRig = rig; ch._eyes = [L, R];
      ch._body.add(rig);
      if (ch.o.layer != null) rig.traverse((o) => o.layers.set(ch.o.layer));
      ch._eyeMax = U * a.track;      // max Pupillen-Auslenkung (Clamp auf Sclera-Radius)
      ch._blinkT = 1.5 + Math.random() * 3; ch._blinkK = -1;
      ch._gazeT = 2 + Math.random() * 3; ch._gazeHold = 0;
    },
    update(ch, dt) {
      const eyes = ch._eyes; if (!eyes) return;
      // Gegen den nicht-uniformen Squash ankompensieren — Googly bleibt rund, wird nicht oval.
      if (ch._eyeRig) {
        const sy = Math.max(0.5, Math.min(1.5, ch._squash.s));
        const sxz = 1 + (1 - sy) * 0.6;
        ch._eyeRig.scale.set(1, sxz / sy, 1);
      }
      // Idle-Gaze: sanft wandern, wenn kein Ziel gehalten wird (Social Agency, kein Fidget-Zwang)
      if (ch._gazeHold > 0) ch._gazeHold -= dt;
      else {
        ch._gazeT -= dt;
        if (ch._gazeT <= 0) {
          ch._gazeT = 1.6 + Math.random() * 3.2;
          const a = Math.random() * Math.PI * 2, r = ch._eyeMax * (0.3 + Math.random() * 0.6);
          for (const e of eyes) { e._tx = Math.cos(a) * r; e._ty = Math.sin(a) * r; }
        }
      }
      // Pupillen-Feder (googly: leichter Overshoot)
      for (const e of eyes) {
        e._pvx += (e._tx - e._px) * 150 * dt - e._pvx * 13 * dt; e._px += e._pvx * dt;
        e._pvy += (e._ty - e._py) * 150 * dt - e._pvy * 13 * dt; e._py += e._pvy * dt;
        e._pu.position.x = e._px; e._pu.position.y = e._py;
      }
      // Blinzeln (gelegentlich)
      ch._blinkT -= dt;
      if (ch._blinkK < 0 && ch._blinkT <= 0) { ch._blinkK = 0; ch._blinkT = 2.5 + Math.random() * 4; }
      if (ch._blinkK >= 0) {
        ch._blinkK += dt / 0.15;
        const sy = ch._blinkK >= 1 ? 1 : 1 - Math.sin(Math.min(ch._blinkK, 1) * Math.PI) * 0.92;
        for (const e of eyes) { e._sc.scale.y = sy; e._pu.scale.y = sy; }
        if (ch._blinkK >= 1) ch._blinkK = -1;
      }
    },
    dispose(ch) {
      if (ch._eyeRig && ch._eyeRig.parent) ch._eyeRig.parent.remove(ch._eyeRig);
      ch._eyeRig = null; ch._eyes = null;
    }
  },

  // EMOTE-LAYER: Comic-Pips über der Figur bei react/Calls (Interpunktion — poppt, hält kurz,
  // löst sich in Ruhe auf). Prozedural im UI-Kit-Ink-Look (Papier-Disc + Tusche-Ring + Glyphe);
  // sobald kenney_emotes-PNGs im Repo liegen, ist der Swap nur Config (glyphs -> urls).
  emotes: {
    glyphs: {
      positive:  { text: '!',  color: '#1f1a14' },
      negative:  { text: '?!', color: '#b8361f' },
      celebrate: { text: '★',  color: '#8a6a16' },
      deflate:   { text: '…',  color: '#6e685a' },
      question:  { text: '?',  color: '#1f1a14' },
      love:      { text: '♥',  color: '#b8361f' }
    },
    attach(ch) { ch._emoteCache = ch._emoteCache || new Map(); },
    show(ch, kind) {
      const THREE = ch.THREE, def = this.glyphs[kind] || this.glyphs.positive;
      if (ch._emote) { ch.group.remove(ch._emote); ch._emote = null; }
      let tex = ch._emoteCache.get(kind);
      if (!tex) {
        const c = document.createElement('canvas'); c.width = c.height = 128;
        const g = c.getContext('2d');
        g.translate(64, 64); g.rotate(-0.06); // wonky, nie steril gerade
        g.fillStyle = '#1f1a14'; g.beginPath(); g.arc(0, 0, 56, 0, Math.PI * 2); g.fill();   // Tusche-Ring
        g.fillStyle = '#f7f0da'; g.beginPath(); g.arc(0, 0, 48, 0, Math.PI * 2); g.fill();   // Papier
        g.fillStyle = def.color;
        g.font = '700 62px "Irish Grover", "Comic Sans MS", serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText(def.text, 0, 6);
        tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
        ch._emoteCache.set(kind, tex);
      }
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: tex, transparent: true, toneMapped: false, rotation: (Math.random() - 0.5) * 0.16, depthTest: true
      }));
      sp.userData.petOverlay = true;
      const top = (ch._petSize || 0.82) * 1.12;
      sp.position.set(0.12, top, 0);
      sp.scale.setScalar(0.0001);
      if (ch.o.layer != null) sp.layers.set(ch.o.layer);
      ch.group.add(sp);
      ch._emote = sp;
      // Pop -> Hold -> löst sich auf (Interpunktion; danach Ruhe)
      const S = 0.34;
      ch._tw(1.5, (t) => {
        if (!sp.parent) return;
        let s;
        if (t < 0.18) { const k = t / 0.18; s = S * (1.2 * k * (2 - k)); }        // Overshoot rein
        else if (t < 0.75) s = S * (1 + 0.06 * Math.exp(-(t - 0.18) * 9) * Math.cos((t - 0.18) * 26)); // settlet
        else { const k = (t - 0.75) / 0.25; s = S * (1 - easeInOut(k)); sp.material.opacity = 1 - k; } // löst sich auf
        sp.scale.setScalar(Math.max(s, 0.0001));
        sp.position.y = top + t * 0.10;
      }).then(() => { if (ch._emote === sp) { ch.group.remove(sp); ch._emote = null; } });
    },
    dispose(ch) { if (ch._emote) { ch.group.remove(ch._emote); ch._emote = null; } }
  }
};

// ---------- Character (ersetzt CubePet — ein Code-Pfad für alle Sets) ----------
export class Character {
  // o: { THREE, loadGltf(url)=>Promise<gltf>, makeMat(opts)=>Material, makeHull?(mesh,pad),
  //      layer?  — Render-Layer für Body+Overlays (Kollisions-Pass isoliert den Pet auf 2),
  //      receiveShadow? — default false (Selbst-Schatten-Acne, s. Host v6) }
  constructor(o) {
    this.o = o;
    this.THREE = o.THREE;
    this.group = new o.THREE.Group();
    this.loaded = false;
    this.busy = false;
    this._tweens = [];
    this._squash = { s: 1, v: 0 }; // Feder für Stretch/Squash-Impulse (settlet in Ruhe)
  }

  setArchetype(id) {
    const arch = ARCHETYPES[id] || ARCHETYPES.frizzlebob;
    this.archetype = ARCHETYPES[id] ? id : 'frizzlebob';
    this.label = arch.label;
    return this.load(arch.set || 'animals', arch.char, { tint: arch.tint, recolor: arch.recolor })
      .then(() => this);
  }

  // load(setId, charId, opts) — oder Back-Compat SPRINT 07: load(charId, opts) => Set 'animals'.
  async load(setId, charId, opts) {
    if (typeof charId !== 'string') { opts = charId; charId = setId; setId = 'animals'; }
    opts = opts || {};
    const THREE = this.THREE;
    const set = SETS[setId] || SETS.animals;
    this.setId = setId; this.charId = charId;
    this._set = set;
    const gltf = await this.o.loadGltf(set.urlPattern.replace('{id}', charId));
    // alten Körper ersetzen (Avatar-Swap) + Mods sauber lösen
    for (const m of (this._mods || [])) { if (MODS[m] && MODS[m].dispose) MODS[m].dispose(this); }
    if (this.inner) {
      if (this.mixer) this.mixer.stopAllAction();
      this.group.remove(this.inner);
    }
    const root = gltf.scene;
    const size = opts.size || set.scale || 0.82;
    let box = new THREE.Box3().setFromObject(root);
    const sz = box.getSize(new THREE.Vector3());
    const s = size / Math.max(sz.x, sz.y, sz.z);
    root.scale.setScalar(s);
    this._baseS = s;
    root.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    root.position.x -= c.x; root.position.z -= c.z; root.position.y -= box.min.y;
    // Cel-Reskin (set.reskin='colormap'): Map behalten, Material über den Host (Toon/Standard je Look).
    // WICHTIG: erst Meshes sammeln, DANN reskin+hull — makeHull hängt Kind-Meshes an (Rekursion, Spec 13).
    const meshes = [];
    root.traverse((n) => { if (n.isMesh) meshes.push(n); });
    this._applyFace(opts.face, charId, meshes);   // v5: Augen/Schnauze-Schalen weg (contract-gesteuert), VOR Reskin/Hull
    for (const n of meshes) {
      n.castShadow = true;
      n.receiveShadow = this.o.receiveShadow != null ? this.o.receiveShadow : false;
      if (n.userData._glbMap === undefined) n.userData._glbMap = (n.material && n.material.map) || null;   // Original-GLB-Colormap EINMAL sichern (ueberlebt jeden Material-Swap)
      let map = set.reskin === 'flat' ? null : n.userData._glbMap;
      if (map && opts.recolor != null) map = this._recolorMap(map, opts.recolor); // Mod: selektiver Tint (helle Pixel), Augen/Ink bleiben
      n.material = this.o.makeMat({ map, color: opts.tint != null ? opts.tint : 0xffffff, roughness: 0.85 });
      if (this.o.makeHull) {
        const ws = new THREE.Vector3(); n.getWorldScale(ws);
        this.o.makeHull(n, 0.02 / Math.max(Math.abs(ws.x), 1e-6));
      }
    }
    this.inner = root;
    this._petSize = size;
    this.group.add(root);
    root.updateMatrixWorld(true);
    if (this.o.layer != null) this.group.traverse((o) => o.layers.set(this.o.layer)); // Layer überlebt den Swap (Kollisions-Pass)
    this.mixer = new THREE.AnimationMixer(root);
    this.clips = {};
    (gltf.animations || []).forEach((cl) => { this.clips[cl.name.toLowerCase()] = cl; });
    this.mixer.addEventListener('finished', () => { if (!this.busy) this.play('idle'); }); // One-Shots lösen sich in Ruhe auf
    this.loaded = true;
    this.play('idle');
    // Mods anstecken (steckbar per Set-Config)
    this._mods = (opts.mods || set.mods || []).filter((m) => MODS[m]);
    for (const m of this._mods) { if (MODS[m].attach) MODS[m].attach(this); }
    return this;
  }

  // Default-Anchor des Sets + Char-Override gemerged (Spec 10: EIN Default deckt fast alle)
  _anchor() {
    const base = (this._set && this._set.eyeAnchor) || SETS.animals.eyeAnchor;
    const ov = this._set && this._set.overrides && this._set.overrides[this.charId];
    const arch = ARCHETYPES[this.archetype] || {};
    return Object.assign({}, base, (ov && ov.eyeAnchor) || {}, arch.eyeAnchor || {});
  }

  // ---- FACE (v5): Kenney-Augen/Schnauze aus dem body-Mesh loeschen (contract-gesteuert) ----
  _findBody(meshes) {
    return meshes.find((m) => m.name && m.name.toLowerCase() === 'body') || meshes[0] || null;
  }
  // face = { stripEyes, eyeShell{zPlane,zTolerance,minTris}, stripSnout{perPet} }. Kein face =
  // Default stripEyes true (Contract-Default). Original-Geometrie + Schalen einmal je Mesh gemerkt
  // -> reversibel ohne GLB-Reload, stabile Schalen-Indizes.
  _applyFace(face, charId, meshes) {
    face = face || {};
    const body = this._findBody(meshes);
    if (!body || !body.geometry) return;
    const orig = body.userData._faceOrigGeo || (body.userData._faceOrigGeo = body.geometry);
    const shells = body.userData._faceShells || (body.userData._faceShells = faceShells(orig));
    const strip = [];
    const stripEyes = face.stripEyes !== undefined ? face.stripEyes : true;
    if (stripEyes) {
      const eyes = selectEyeShells(shells, face);
      if (eyes) for (const i of eyes) strip.push.apply(strip, shells[i].tris);
      else console.warn('[PetLibrary] stripEyes: keine genau 2 gespiegelten Augen-Schalen bei "' + charId + '" — nichts geloescht.');
    }
    const perPet = (face.stripSnout && face.stripSnout.perPet) || {};
    for (const si of (perPet[charId] || [])) { if (shells[si]) strip.push.apply(strip, shells[si].tris); }
    const facet = face.facet === true;   // v7: Normalen-Entscheidung KOMMT AUS DEM CONTRACT (Default rund) -> jede App gleich
    body.geometry = strip.length ? buildStripped(orig, strip, facet) : orig;   // geloescht bzw. Original zurueck
    this._body = body;
  }
  // Re-Apply ohne GLB-Reload (Editor-Toggle): geht in beide Richtungen (Original-Geometrie gemerkt).
  applyFace(face) {
    if (!this.inner) return;
    const meshes = []; this.inner.traverse((n) => { if (n.isMesh && !n.userData.petOverlay) meshes.push(n); });
    this._applyFace(face, this.charId, meshes);
  }
  // Ablesehilfe fuer den Editor: die Schalen des body-Mesh (stabile Indizes, aus der Original-Geometrie).
  getFaceShells() {
    const b = this._body; if (!b) return [];
    const orig = b.userData._faceOrigGeo || b.geometry;
    return b.userData._faceShells || (b.userData._faceShells = faceShells(orig));
  }
  // Original-Geometrie des body (fuer Highlight-Meshes im Editor).
  getBodyOrigGeo() { const b = this._body; return b ? (b.userData._faceOrigGeo || b.geometry) : null; }

  // ---- Gaze-API (Bus-Hooks: roll->Würfel, tell->Karte, verdict->King; idle->gazeIdle) ----
  lookAt(worldTarget) {
    if (!this._eyes || !this._body || !worldTarget) return;
    const local = this._body.worldToLocal(worldTarget.clone());
    this._gazeHold = 1.8; // hält kurz, dann wandert der Idle-Blick wieder
    for (const e of this._eyes) {
      const dx = local.x - e.position.x, dy = local.y - e.position.y;
      const len = Math.hypot(dx, dy) || 1;
      const strength = Math.min(1, len / (this._eyeMax * 8));
      e._tx = (dx / len) * this._eyeMax * strength; // Richtung projiziert, auf Sclera-Radius geclampt
      e._ty = (dy / len) * this._eyeMax * strength;
    }
  }
  blink() { if (this._blinkK < 0) this._blinkK = 0; }
  gazeIdle() { this._gazeHold = 0; this._gazeT = 0.2; }

  emote(kind) { if (this._mods && this._mods.includes('emotes')) MODS.emotes.show(this, kind); }

  // Mod: selektive Umfärbung der Colormap (v4.1) — helle/saturierte Pixel -> Tint, Augen/Ink bleiben.
  _recolorMap(tex, hex) {
    this._recolorCache = this._recolorCache || new Map();
    const key = (tex.uuid || '') + '|' + hex;
    if (this._recolorCache.has(key)) return this._recolorCache.get(key);
    const THREE = this.THREE;
    const img = tex.image;
    if (!img || !img.width) return tex;
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height);
    const tr = (hex >> 16) & 255, tg = (hex >> 8) & 255, tb = hex & 255;
    for (let i = 0; i < d.data.length; i += 4) {
      const r = d.data[i], gg = d.data[i + 1], b = d.data[i + 2];
      const lum = (0.299 * r + 0.587 * gg + 0.114 * b) / 255;
      const sat = Math.max(r, gg, b) - Math.min(r, gg, b);
      if (sat < 22) continue; // neutrale Pixel (Augen-Zellen, Schwarz/Weiß) bleiben ORIGINAL (v4.2-Briefing)
      const l2 = Math.min(1, lum * 1.15 + 0.18);
      d.data[i] = Math.round(tr * l2);
      d.data[i + 1] = Math.round(tg * l2);
      d.data[i + 2] = Math.round(tb * l2);
    }
    g.putImageData(d, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = tex.colorSpace; t.flipY = tex.flipY;
    t.wrapS = tex.wrapS; t.wrapT = tex.wrapT;
    t.magFilter = tex.magFilter; t.minFilter = tex.minFilter;
    t.generateMipmaps = tex.generateMipmaps;
    this._recolorCache.set(key, t);
    return t;
  }

  // our-Trigger-Clipname -> their-GLB-Clip (Set-clipMap), mit includes-Fallback
  _clip(name) {
    const mapped = ((this._set && this._set.clipMap) || {})[name] || name;
    if (this.clips[mapped]) return this.clips[mapped];
    const k = Object.keys(this.clips).find((n) => n.includes(mapped));
    return k ? this.clips[k] : null;
  }

  play(trigger) {
    if (!this.loaded) return;
    const def = TRIGGERS[trigger] || TRIGGERS.idle;
    const clip = this._clip(def.clip) || this._clip('idle');
    if (!clip) return;
    const THREE = this.THREE;
    const action = this.mixer.clipAction(clip);
    if (this._action === action && def.loop && trigger !== 'speak') return action;
    action.reset();
    action.setLoop(def.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    action.clampWhenFinished = !def.loop;
    if (this._action && this._action !== action) this._action.fadeOut(0.15);
    action.fadeIn(0.15).play();
    this._action = action;
    clearTimeout(this._holdT);
    if (def.hold) this._holdT = setTimeout(() => this.play('idle'), def.hold * 1000);
    return action;
  }

  // ---- Event-Hooks (Rituale — Interpunktion, settlet in Ruhe) ----
  speak() { this.play('speak'); this.bob(0.06); }
  react(kind) {
    this.play(kind === 'negative' ? 'react-negative' : 'react-positive');
    if (kind === 'negative') { this.squash(0.22); this.emote('negative'); }
    else { this.bob(0.09); this.emote('positive'); }
  }
  celebrate() { this.play('celebrate'); this.bob(0.13); this.emote('celebrate'); }
  deflate() { this.play('deflate'); this.squash(0.34); this.emote('deflate'); }

  // Cartoon-Physics (03 §Vertrag): Impuls -> Feder, kritisch gedämpft, endet in Ruhe
  squash(amount = 0.3) { this._squash.v = -amount * 14; }
  bob(h = 0.08) {
    const g = this.group, y0 = this._home ? this._home.y : g.position.y;
    this._tw(0.45, (t) => { g.position.y = y0 + Math.sin(t * Math.PI) * h; });
  }

  // v4: Klick-Gruß — zwei kleine Freuden-Hüpfer (event-getrieben, settlet in Ruhe)
  hopJoy() {
    if (!this.loaded || this.busy) return;
    this.play('react-positive');
    this.squash(0.18);
    const g = this.group, y0 = g.position.y;
    this._tw(0.62, (t) => { g.position.y = y0 + Math.abs(Math.sin(t * Math.PI * 2)) * 0.16 * (1 - 0.35 * t); });
  }

  setHome() { this._home = this.group.position.clone(); this._homeRy = this.group.rotation.y; }
  _face(dir) { this.group.rotation.y = Math.atan2(dir.x, dir.z); }

  // Der Kick: Anlauf (Run mit Hüpfern) -> Lunge + Squash auf Kontakt -> der Würfel taumelt (= Roll)
  async kickDie(target) {
    if (!this.loaded || this.busy) return;
    this.busy = true;
    const g = this.group;
    const from = g.position.clone();
    const flat = target.clone(); flat.y = from.y;
    const dir = flat.clone().sub(from);
    const dist = Math.max(dir.length(), 0.001);
    dir.normalize();
    const stop = flat.clone().addScaledVector(dir, -0.66);
    this._face(dir);
    this.play('run');
    await this._tw(Math.min(1.15, 0.4 + dist * 0.16), (t) => {
      const k = easeInOut(t);
      g.position.lerpVectors(from, stop, k);
      g.position.y = from.y + Math.abs(Math.sin(t * Math.PI * 3)) * 0.09;
    });
    g.position.y = from.y;
    const lunge = stop.clone().addScaledVector(dir, 0.2);
    await this._tw(0.16, (t) => { g.position.lerpVectors(stop, lunge, Math.sin(t * Math.PI)); });
    this.squash(0.3);
    this.play('react-positive');
    this.busy = false;
  }

  async goHome() {
    if (!this.loaded || !this._home || this.busy) return;
    this.busy = true;
    const g = this.group, from = g.position.clone();
    const dir = this._home.clone().sub(from); dir.y = 0;
    if (dir.length() > 0.05) {
      this._face(dir.clone().normalize());
      this.play('enter');
      await this._tw(Math.min(1.4, 0.4 + dir.length() * 0.22), (t) => {
        g.position.lerpVectors(from, this._home, easeInOut(t));
        g.position.y = this._home.y + Math.abs(Math.sin(t * Math.PI * 2.5)) * 0.05;
      });
    }
    g.position.copy(this._home);
    const r0 = g.rotation.y, r1 = this._homeRy;
    await this._tw(0.25, (t) => { g.rotation.y = r0 + (r1 - r0) * t; });
    this.busy = false;
    this.play('idle'); // Ruhe: die Animation löst sich auf
  }

  _tw(dur, fn) { return new Promise((res) => this._tweens.push({ t: 0, dur, fn, res })); }

  update(dt) {
    if (this.mixer) this.mixer.update(dt);
    for (const m of (this._mods || [])) { if (MODS[m].update) MODS[m].update(this, dt); }
    for (let i = this._tweens.length - 1; i >= 0; i--) {
      const tw = this._tweens[i];
      tw.t += dt;
      const k = Math.min(tw.t / tw.dur, 1);
      tw.fn(k);
      if (k >= 1) { this._tweens.splice(i, 1); tw.res(); }
    }
    // Squash-Feder: Impulse settlen, dann exakt 1.0 — kein Dauerwackeln
    const q = this._squash;
    if (this.inner && (Math.abs(q.s - 1) > 0.001 || Math.abs(q.v) > 0.001)) {
      q.v += (1 - q.s) * 90 * dt - q.v * 12 * dt;
      q.s += q.v * dt;
      const sy = Math.max(0.5, Math.min(1.5, q.s));
      const sxz = 1 + (1 - sy) * 0.6;
      this.inner.scale.set(this._baseS * sxz, this._baseS * sy, this._baseS * sxz);
    } else if (this.inner && this._settled !== true) {
      this.inner.scale.setScalar(this._baseS);
      q.s = 1; q.v = 0;
    }
  }
}

// Back-Compat: SPRINT-07-API bleibt gültig — CubePet ist jetzt die Library.
export { Character as CubePet };

// Standalone-Fallback: Globals, falls der relative dynamische Import in einem
// inlineten Bundle nicht auflösbar ist.
try {
  if (typeof window !== 'undefined') {
    window.CubePet = Character;
    window.PET_ARCHETYPES = ARCHETYPES;
    window.PetLibrary = { Character, SETS, ARCHETYPES, MODS, faceShells, selectEyeShells, buildStripped };
  }
} catch (e) {}
