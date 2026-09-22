/* stage.v1.js — KFB Pet Podcast v1 · die Bühne.

   EIN Comic-Panel, ZWEI Pets davor, EINE Uhr. Das ist der ganze Auftrag dieses Moduls.

   EIGENTUM (die Falle bei zwei Pets ist, dass zwei Besitzer am selben Frame ziehen):
     - Die Bühne besitzt: Renderer, Szene, Kamera, Licht, das Panel und je Pet einen WRAPPER.
     - `makePet` (kfb-pets.js) besitzt alles INNERHALB des Pets: `ch.group` wird von PetMotion
       bewegt und von uns nie angefasst. Wir setzen ausschliesslich den Wrapper.
     - Die Sprech-Uhr gehoert voice.v1.js (die Stimme ist die Uhr), nicht der Buehne.

   PRIME DIRECTIVE: die Sprech-Betonung des Koerpers ist Interpunktion und loest sich in Ruhe
   auf — der Wrapper faehrt beim Sprechen ein Stueck nach vorn/oben und kritisch gedaempft
   zurueck. Kein Idle-Fidget. */

import { contour, drawInk, maskGrow, pathOf } from '../cardbuilder/kfb-ink-canon.js';

const PAPER_BG = '#131210';
const SKY = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/skydome_a.webp';

/* Watercolor-Backdrop, 1:1 der Griff aus Pet Studio v4 (`bgTex`): weicher Gradient statt flacher
   Farbe. Grund hier ist NICHT Stimmung, sondern Lesbarkeit — auf Schwarz verschwindet die Tusche des
   Kartenblatts, auf einem hellen Aquarell-Grund steht sie. Der echte Skydome (`skydome_a.webp`)
   wird versucht; faellt er aus (404, CORS), traegt der Gradient. Kein halber Zustand. */
function bgGradient(THREE, hex) {
  const base = new THREE.Color(hex);
  const top = base.clone().multiplyScalar(1.5).offsetHSL(0, -0.04, 0.04);
  const bot = base.clone().multiplyScalar(0.5);
  const c = document.createElement('canvas'); c.width = 16; c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#' + top.getHexString());
  grd.addColorStop(0.62, '#' + base.getHexString());
  grd.addColorStop(1, '#' + bot.getHexString());
  g.fillStyle = grd; g.fillRect(0, 0, 16, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// kritisch gedaempfte Feder, dieselbe wie im ganzen Stack (kein Overshoot, framerate-unabhaengig)
function sd(cur, target, vel, st, dt) {
  st = Math.max(1e-4, st);
  const w = 2 / st, x = w * dt;
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const ch = cur - target, tmp = (vel.v + w * ch) * dt;
  vel.v = (vel.v - w * tmp) * e;
  return target + (ch + tmp) * e;
}

/** Panel-Blatt: Seite + kanonische Karten-Tusche, in EINEM Canvas, als Alpha-Plane.
    Wichtig (SSOT_Card_Ink_Outline_v2 §4): die Flaeche waechst hoechstens um die kleinste
    Halbbreite nach aussen, sonst blitzt Papier ueber die Linie. */
export function inkedSheet(THREE, page, o = {}) {
  const seed = o.seed || 7;
  const W = page.width, H = page.height;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const pts = contour('card', seed, W, H);

  // 1 · Papier auf die Silhouette geclippt (leicht gewachsen, damit keine Fuge entsteht)
  const grow = maskGrow('card', pts, W, H, seed);
  const cx = W / 2, cy = H / 2;
  const grown = pts.map(([x, y]) => {
    const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy) || 1;
    return [x + (dx / L) * grow, y + (dy / L) * grow];
  });
  g.save(); pathOf(g, grown); g.clip();
  g.drawImage(page, 0, 0, W, H);
  g.restore();

  // 2 · die Feder darueber
  drawInk('card', g, pts, W, H, seed);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export async function createStage(o = {}) {
  const THREE = o.THREE;
  const canvas = o.canvas;
  const { OrbitControls, RoomEnvironment } = o.deps || {};

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  // Echter projizierter Schatten — wie in Pet Studio v4 (Georgs Hinweis 17.8.: der gemalte Fleck war
  // ein anderer Schatten als dort). Die Weichheit macht `shadow.radius`, nicht ein Gradient.
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  // Aquarell-Grund (Studio-Griff). Auf Schwarz war die Karten-Tusche nicht zu sehen — Befund Georg
  // 17.8. Erst der Gradient, dann versucht der Skydome ihn zu ersetzen.
  const bgFallback = bgGradient(THREE, o.bg || '#b9c6bd');
  scene.background = bgFallback;

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 120);
  camera.position.set(0, 1.92, 9.1);
  camera.lookAt(0, 1.16, 0);

  // Licht: HDRI traegt die Aufhellung (sonst sieht Clay tot aus), Key nur als weicher Formgeber.
  const pmrem = new THREE.PMREMGenerator(renderer);
  if (RoomEnvironment) scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.06).texture;
  const key = new THREE.DirectionalLight(0xfff3dc, 1.55);
  /* Schatten-Einstellungen 1:1 aus Pet Studio v4 (dort: `sun`):
       mapSize 2048 · bias -0.0005 · **radius 12** · enge Schattenkamera.
     `radius 12` ist der Grund, warum es dort weich aussieht — mein erster Versuch hatte radius 0
     und eine doppelt so weite Kamera, das ergab einen harten, verschmierten Fleck. Die Kamera ist
     hier ETWAS weiter als im Studio (±4,5 statt ±3), weil zwei Pets und ihre Wurfweite hineinmuessen;
     mapSize bleibt 2048, damit die Aufloesung je Einheit vergleichbar bleibt.
     Richtung steil von oben: flach warf es den Schatten seitlich neben das Pet (Befund 17.8.). */
  key.position.set(-1.9, 7.2, 3.0);
  /* STUDIO-WERT (y/z = 2,40). Der Versuch, ihn auf 10,4 zu heben, sollte die Klippung an der
     Kartenkante beheben — er machte aber den Schatten noch länger (Abfall ≈ 133 px) und damit den
     diagonalen Schmierer, den Georg gesehen hat. Die Klippung gehört nicht dem Licht: sie gehört dem
     ABSTAND (`SEAT_OUT` in layout.v3.js, 0,42 → 0,10). Ein Wert, ein Eigentümer. */
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0005;
  key.shadow.radius = (o.shadowRadius != null ? o.shadowRadius : 12);
  /* `radius` additiv übersteuerbar (24.8.): 12 ist der Studio-Wert und richtig für eine Figur, die
     das Bild füllt — unter einem 0,78 großen Cube-Pet wird daraus Brei. v3 gibt einen kleineren
     Wert; ohne Angabe bleibt es beim Studio-Wert, v1/v2 also unverändert. */
  Object.assign(key.shadow.camera, { left: -4.5, right: 4.5, top: 4.5, bottom: -4.5, near: 0.5, far: 18 });
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcfe0ff, 0.42); fill.position.set(4.2, 2.4, 3.0); scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  /* EIN LICHT FÜR ALLES (Georgs Vorgabe 25.8.: „globales rechts/unten-Konzept, Pets sollen dieselbe
     Licht-Logik simulieren"). Vorher gab es ZWEI: der `key` machte die Schattierung, ein eigenes
     Licht den Schatten — also konnten Schattierung und Schattenrichtung sich widersprechen, und im
     Bild sah es aus, als wäre jedes Pet von SEINER Außenseite angeleuchtet.
     Ab jetzt wirft der `key` selbst: Richtung von oben-links (−1,9; 7,2; 3,0) → Schatten nach
     RECHTS-UNTEN, dieselbe Richtung wie der Schlagschatten der Karte. Ein Licht, ein Konzept.
     Der Ausschnitt der Schattenkamera deckt Karte plus Pets ab (±10) — zu klein hieß: außerhalb
     liefert die Schattenkarte „im Schatten", und das war das graue Rechteck („Maske"). */
  let shadowKey = null;
  const SHADOW_DIR = new THREE.Vector3(1.9, -7.2, -3.0).normalize();
  if (o.dedicatedShadow) {
    key.castShadow = true;
    Object.assign(key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 0.5, far: 34 });
    key.shadow.camera.updateProjectionMatrix();   // im Original vergessen — sonst gelten die Defaults
    /* Das Gegenlicht von RECHTS runter (0,42 → 0,16): es war der Grund, warum beide Pets von ihrer
       jeweiligen Außenseite beleuchtet wirkten. Eine Hauptrichtung, ein schwacher Aufheller. */
    fill.intensity = 0.16;
    shadowKey = key;
    scene.add(key.target);
  }

  // --- Das Panel -------------------------------------------------------------------------------
  // Steht aufrecht hinter den Pets. Breite fix, Hoehe folgt dem Seitenverhaeltnis der Seite.
  /* Breite 5,9 statt 6,35 (17.8., Befund Georg: „Header überdeckt die Karte"). Das Blatt muss zwischen
     ZWEI Kanten passen: die Kopfleiste (~44 px von 613 = NDC 0,86) und die Schattenebene bei y 0.
     Bei 6,35 ist das Blatt 3,65 hoch — dafür reicht der Zwischenraum nicht, egal wo es hängt.
     5,9 → Höhe 3,39; bei y 1,79 liegt die Oberkante auf 3,49 (NDC 0,82, unter der Leiste) und die
     Unterkante auf +0,10 (über der Ebene). Gemessene Umrechnung: Weltkante 3,51 → NDC 0,827. */
  const panelW = o.panelWidth || 5.9;
  const panelGroup = new THREE.Group();
  /* Hoehe gemessen, nicht geschaetzt (17.8., Befund Georg: „untere Tusche fehlt", sobald eine echte
     Karte haengt). Ursache war keine Tusche-Sache: bei y 1,66 lag die Blattunterkante auf y −0,19,
     also UNTER der Schattenebene (40x40 bei y 0,001, schreibt Tiefe) — die hat die untere Kante
     verdeckt. Gemessen am Bedienweg, Blattkante gegen Bildrand (Kamera y 1,92 / fov 34 / z 9,1):
       y 1,66 → Unterkante −0,19 (unter der Ebene)   · Oberkante NDC 0,83
       y 1,95 → Unterkante  +0,10 (frei)             · Oberkante NDC 0,93 (dort sitzt die Kopfleiste)
     Mit der kleineren Breite (5,9 → Höhe 3,39) gibt es einen Wert mit Luft an beiden Kanten:
       y 1,79 → Unterkante  +0,10                    · Oberkante 3,49 ≡ NDC 0,82
     Zweite Sicherung darunter: die Schattenebene schreibt keine Tiefe mehr, sie ist kein Koerper. */
  panelGroup.position.set(0, 1.79, -0.5);
  panelGroup.rotation.z = -0.008;                       // nie steril gerade (UI-Kit)
  scene.add(panelGroup);

  let panelMesh = null, panelTex = null, cardRec = null;
  function clearPanel() {
    if (panelMesh) { panelGroup.remove(panelMesh); panelMesh.geometry.dispose(); panelMesh.material.dispose(); panelMesh = null; }
    if (panelTex) { panelTex.dispose(); panelTex = null; }
    if (cardRec) { panelGroup.remove(cardRec.group); cardRec.dispose(); cardRec = null; }
  }
  function setPage(pageCanvas, seed) {
    const tex = inkedSheet(THREE, pageCanvas, { seed: seed || 7 });
    const h = panelW * (pageCanvas.height / pageCanvas.width);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.02, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(panelW, h), mat);
    clearPanel();
    panelMesh = mesh; panelTex = tex;
    panelGroup.add(mesh);
    return { w: panelW, h };
  }

  /** Eine ECHTE KFB-Karte als Panel. `rec` = Rueckgabe von cardBuilder.make() — die Karte bringt
      ihr eigenes Blatt, ihre eigene Silhouette und ihre eigene Tusche mit und schiebt ihr Artwork
      selbst nach. Die Buehne haengt sie nur auf und besitzt sie danach (dispose beim Wechsel). */
  function setCard(rec) {
    if (!rec || !rec.group) return null;
    clearPanel();
    cardRec = rec;
    panelGroup.add(rec.group);
    return { w: rec.width, h: rec.height };
  }

  // Kein Schattenfaenger-Boden mehr: er zeigte den seitlich versetzten Schlagschatten des Keys.

  /* Schatten-Ebene wie in Pet Studio v4: ein `ShadowMaterial` zeigt NUR den Schatten, sonst nichts —
     deshalb bleibt es auch bei transparentem Hintergrund stehen (Voraussetzung fuer den PNG-Export).
     Deckkraft aus dem Studio-Default. */
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShadowMaterial({ opacity: o.shadowOpacity != null ? o.shadowOpacity : 0.32, transparent: true, depthWrite: false }),
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.001;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // --- Die zwei Plaetze ------------------------------------------------------------------------
  // Unten links / unten rechts, vor dem Panel, leicht nach innen gedreht: die zwei reden
  // MITEINANDER vor dem Ding, sie praesentieren es nicht.
  const SEATS = {
    left:  { x: -2.28, z: 2.55, yaw:  0.42 },
    right: { x:  2.28, z: 2.55, yaw: -0.42 },
  };

  const actors = {};
  const order = [];
  /** Ein Pet auf einen Platz stellen. `pet` = Rueckgabe von makePet().
      `opts.byCube` (additiv, 25.8., Georgs Befund): dann ist die GRUNDFORM der Bezug, nicht der
      Umriss. Der Umriss enthaelt Ohren, Fluegel und Beinchen, und die sind bei jedem Tier anders
      lang — skaliert man darauf, wird ein Hase mit langen Ohren KLEINER als ein Pinguin, obwohl
      beide denselben Wuerfel als Koerper haben. Die Anatomie bleibt trotzdem vollstaendig: sie ist
      Trefferflaeche, nur nicht Massstab. Ohne `byCube` rechnet die Buehne wie in v1/v2. */
  function seat(key, pet, side, targetHeight, opts = {}) {
    const s = SEATS[side];
    const wrap = new THREE.Group();
    wrap.position.set(s.x, 0, s.z);
    wrap.rotation.y = s.yaw;
    scene.add(wrap);

    // Groesse messen, nicht raten: die GLBs kommen in unterschiedlichen Maßstäben an.
    const box = new THREE.Box3().setFromObject(pet.object3D);
    const size = new THREE.Vector3(); box.getSize(size);
    /* Der Bezug: entweder der ganze Umriss (v1/v2) oder die GRUNDFORM. Die Grundform ist das
       groesste zusammenhaengende Teil — bei einem Cube-Pet der Koerperwuerfel. Gesucht wird
       zuerst nach Namen (`body`), sonst nach Rauminhalt; welches Teil es war, steht danach im
       Actor (`cube.name`), damit man es nachmessen kann statt es zu glauben. */
    let refY = size.y, cube = null;
    if (opts.byCube) {
      /* KERNMASS STATT UMRISS — und statt der Bbox EINES Teils. Zweiter Anlauf (25.8., Georgs
         Befund „die beiden sind immer noch unterschiedlich groß"): die Höhe des `body`-Meshes ist
         KEIN Maß für die Grundform, weil die Teile bei jedem Tier anders zusammengebaut sind — beim
         Pinguin stecken Flügel und Bauch im selben Mesh (gemessen Spannweite 1,57 gegen Höhe 1,02),
         beim Hasen nicht. Zwei gleich hohe Meshes können also sehr verschieden groß AUSSEHEN.
         Deshalb wird jetzt der KERN gemessen: von allen Eckpunkten des größten Teils das 5.–95.
         Perzentil je Achse (Anhängsel wie Ohren, Flügel und Beinchen sind wenige Punkte weit
         draussen und fallen heraus), und daraus das geometrische Mittel = die Kantenlänge des
         Würfels. Isotrop, also unabhängig davon, WELCHE Achse ein Tier verlängert. */
      let best = null, bestV = 0;
      pet.object3D.traverse((n) => {
        if (!n.isMesh || !n.geometry || !n.geometry.attributes || !n.geometry.attributes.position) return;
        const b = new THREE.Box3().setFromObject(n);
        const s = new THREE.Vector3(); b.getSize(s);
        const v = s.x * s.y * s.z;
        if (v > bestV) { bestV = v; best = n; }
      });
      if (best) {
        pet.object3D.updateWorldMatrix(true, true);
        const toRoot = new THREE.Matrix4().copy(pet.object3D.matrixWorld).invert().multiply(best.matrixWorld);
        const pos = best.geometry.attributes.position;
        const xs = [], ys = [], zs = [], p = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          p.fromBufferAttribute(pos, i).applyMatrix4(toRoot);
          xs.push(p.x); ys.push(p.y); zs.push(p.z);
        }
        const q = (arr, f) => arr[Math.max(0, Math.min(arr.length - 1, Math.floor(arr.length * f)))];
        xs.sort((a, b2) => a - b2); ys.sort((a, b2) => a - b2); zs.sort((a, b2) => a - b2);
        const cx2 = Math.max(0.001, q(xs, 0.95) - q(xs, 0.05));
        const cy2 = Math.max(0.001, q(ys, 0.95) - q(ys, 0.05));
        const cz2 = Math.max(0.001, q(zs, 0.95) - q(zs, 0.05));
        const edge = Math.cbrt(cx2 * cy2 * cz2);
        refY = edge;
        cube = { name: best.name || '(unnamed)', edge, core: new THREE.Vector3(cx2, cy2, cz2),
                 bottom: q(ys, 0.05), verts: pos.count };
      } else console.warn('[stage] byCube: kein Teil mit Eckpunkten gefunden — rechne auf den Umriss');
    }
    const k = (targetHeight || 1.62) / Math.max(0.001, refY);
    pet.object3D.scale.setScalar(k);
    /* DER ANKER IST DIE FUSSLINIE (Georgs Auftrag 25.8.: „beide unten auf eine Baseline").
       Vorher lag die Unterkante der GRUNDFORM auf dem Sitz — das machte die Blickwinkel gleich,
       aber die Füße verschieden hoch, weil Beinlängen sich unterscheiden (Pinguin kürzer). Jetzt
       liegt der tiefste sichtbare Punkt auf dem Sitz: beide stehen auf derselben Ebene, und die
       Ebene ist damit auch die Bezugsfläche für Bodenschatten, Kollision und Deformer.
       Der Würfel bleibt der MASSSTAB (gleiche Kantenlänge), er ist nur nicht mehr der Anker.
       `footAnchor: false` stellt das v-1f-Verhalten wieder her. */
    pet.object3D.position.y = (opts.footAnchor === false && cube) ? -cube.bottom * k : -box.min.y * k;
    /* BLICKACHSE GERADEZIEHEN (pragmatisch, Georgs Auftrag 25.8. — die richtige Stelle ist das
       Studio, siehe HANDOVER_WS1 §1). Die GLBs haben unterschiedliche Nullstellungen: das Gesicht
       des einen zeigt leicht nach oben, das des anderen gerade. Im Bild liest sich das als „der
       eine wird von unten gezeigt" — obwohl beide gleich groß sind und gleich stehen.
       GEMESSEN, nicht geraten: Bezug ist die Frontnormale der MUNDFLÄCHE (dieselbe Referenz, die
       der Puppet-Vertrag aus Studio v4 für `az` benutzt). Ihre Höhenkomponente sagt, wie weit das
       Gesicht nach oben blickt; genau das wird zurückgedreht, geklemmt auf ±20 Grad. */
    let facePitch = 0;
    if (opts.levelFace !== false && pet.mouth && pet.mouth.mesh) {
      pet.object3D.updateWorldMatrix(true, true);
      const n = new THREE.Vector3(0, 0, 1)
        .applyQuaternion(pet.mouth.mesh.getWorldQuaternion(new THREE.Quaternion())).normalize();
      facePitch = Math.asin(Math.max(-1, Math.min(1, n.y)));
      const fix = Math.max(-0.35, Math.min(0.35, -facePitch));
      pet.object3D.rotation.x += fix;
      facePitch = +facePitch.toFixed(4);
    }
    /* NACH dem Geradeziehen: eine gewollte Vorneigung je Pet (Georg 25.8. „FrizzleBob 10 % nach vorn
       kippen"). Getrennt von `levelFace`, weil das eine eine KORREKTUR ist und das andere eine
       Look-Entscheidung — sonst kann man später nicht mehr unterscheiden, was gemessen und was
       gewollt war. Positiv = Nase nach unten. */
    if (opts.leanFwd) pet.object3D.rotation.x += opts.leanFwd;
    /* ANKER NACHZIEHEN. Der Fusspunkt wurde VOR den Drehungen gesetzt — eine Vorneigung kippt die
       Zehen aber unter die Standlinie (gemessen: 0,025 unter dem Sitz bei 5,7°). Also nach den
       Drehungen nochmal messen und die Differenz abziehen: die Baseline gilt für die GEDREHTE
       Figur, sonst ist sie keine. */
    if (opts.footAnchor !== false) {
      pet.object3D.updateWorldMatrix(true, true);
      const b2 = new THREE.Box3().setFromObject(pet.object3D);
      if (isFinite(b2.min.y)) pet.object3D.position.y -= b2.min.y;
    }
    pet.object3D.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = false; n.frustumCulled = false; } });
    wrap.add(pet.object3D);

    const a = actors[key] = {
      key, pet, side, wrap, seat: s,
      radius: Math.max(size.x, size.y, size.z) * k * 0.5,
      height: size.y * k,                         // gemessene Ruhehoehe (die Blase pinnt daran)
      /* Die Grundform in Weltmass — `edge` ist die Zahl, die bei zwei Pets GLEICH sein soll.
         `height` bleibt der Umriss (Ohren mit), denn daran haengen Blase, Decke und Trefferflaeche. */
      cube: cube ? { name: cube.name, edge: +(cube.edge * k).toFixed(4), verts: cube.verts,
                     coreX: +(cube.core.x * k).toFixed(4), coreY: +(cube.core.y * k).toFixed(4),
                     coreZ: +(cube.core.z * k).toFixed(4) } : null,
      /* Volle waagerechte Halbbreite MIT Anhängseln (Flügel!). Die Klemmung braucht sie, damit
         kein Flügel aus dem Bild ragt; die Ecken-Steuerung nimmt weiter den Kern, sonst stehen die
         beiden Figuren nicht gleich. Zwei Aufgaben, zwei Zahlen. */
      spanX: +(size.x * k * 0.5).toFixed(4),
      facePitch, leanFwd: +(opts.leanFwd || 0).toFixed(4),
      lean: 0, leanV: { v: 0 }, target: 0,        // Sprech-Interpunktion (0 = Ruhe)
      pop: 0, popV: { v: 0 },                     // Betonungs-Stups
    };

    order.push(a);
    return a;
  }

  /** Platz raeumen (Umbesetzung). Der Wrapper und ALLES darin geht weg — die Buehne haelt danach
      keinen halben Zustand mehr: kein Actor, kein Wrapper, kein Eintrag in der Frame-Liste. */
  function unseat(key) {
    const a = actors[key];
    if (!a) return false;
    const i = order.indexOf(a); if (i >= 0) order.splice(i, 1);
    scene.remove(a.wrap);
    try { if (a.pet && a.pet.dispose) a.pet.dispose(); } catch (e) { console.warn('[stage] dispose', e); }
    delete actors[key];
    return true;
  }

  /** Wer spricht. Der Sprecher tritt vor, der Zuhoerer bleibt und schaut hin. */
  function setSpeaker(key) {
    for (const k of Object.keys(actors)) actors[k].target = (k === key) ? 1 : 0;
  }
  /** Betonungs-Stups (Naht zu PetPuppet.onEmphasis). */
  function emphasize(key, amt) { const a = actors[key]; if (a) a.pop = Math.min(1, a.pop + (amt || 1) * 0.55); }

  // --- Blick ------------------------------------------------------------------------------------
  // Die Pets schauen die Kamera an, ausser der Zuhoerer schaut den Sprecher an. Das ist der
  // ganze „Konflikt im Bild": zwei Blicke, die sich treffen.
  const _v = new THREE.Vector3();
  function aim(a, other, cursor) {
    const rig = a.pet.rig;
    if (!rig || !rig.pointTo) return;
    if (a.target < 0.5 && other && other.target > 0.5) {
      // Zuhoerer: zum Sprecher. Seite aus der Sitzordnung, nicht geraten.
      rig.pointTo(a.side === 'left' ? 0.72 : -0.72, 0.06);
    } else if (cursor) {
      rig.pointTo(cursor.x * 0.55, cursor.y * 0.35 + 0.05);
    } else {
      rig.pointTo(0, 0.05);
    }
  }

  let cursor = null;
  function onPointer(nx, ny) { cursor = { x: nx, y: ny }; }

  function resize(w, h) {
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  const clock = new THREE.Clock();
  let raf = 0, running = false, onFrame = null;
  const stats = { frames: 0, fps: 0, _t: 0 };

  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, clock.getDelta());

    for (let i = 0; i < order.length; i++) {
      const a = order[i];
      const other = order[(i + 1) % order.length];
      a.lean = sd(a.lean, a.target, a.leanV, 0.34, dt);
      a.pop = sd(a.pop, 0, a.popV, 0.16, dt);
      // Interpunktion: vor + hoch. Kleine Zahlen — das Bild soll atmen, nicht hopsen.
      /* v3-NAHT (additiv, 25.8.): der SITZ traegt jetzt drei Zahlen statt zwei. Bis v2 war x nur
         beim Einsetzen gelesen (der Sitz konnte nachtraeglich nicht wandern) und y gar nicht —
         ein Pet stand immer auf der Weltnull. In v3 besitzt `podcast-v3/layout.v3.js` die
         Komposition und legt die Sitze auf die OBERKANTE der Karte; dafuer muss der Sitz eine
         Hoehe haben duerfen. Fuer v1 und v2 aendert sich dadurch NICHTS: dort ist x konstant und
         `seat.y` nicht gesetzt, also faellt der Ausdruck auf die alten Werte zurueck. */
      a.wrap.position.x = a.seat.x;
      a.wrap.position.z = a.seat.z + a.lean * 0.30;
      a.wrap.position.y = (a.seat.y || 0) + a.pop * 0.075;
      a.wrap.rotation.y = a.seat.yaw + a.lean * (a.side === 'left' ? 0.10 : -0.10);
      aim(a, other === a ? null : other, cursor);
      a.pet.update(dt);
    }
    if (onFrame) onFrame(dt);
    renderer.render(scene, camera);

    stats.frames++; stats._t += dt;
    if (stats._t >= 1) { stats.fps = Math.round(stats.frames / stats._t); stats.frames = 0; stats._t = 0; }
  }

  return {
    THREE, renderer, scene, camera, panelGroup,
    setPage, setCard, seat, unseat, setSpeaker, emphasize, onPointer, resize, actors, stats, SEATS,
    get panelWidth() { return panelW; },
    /** EIN Zuhoerer pro Frame (Blasen, Overlays). Die Buehne behaelt ihre Uhr. */
    setOnFrame(fn) { onFrame = typeof fn === 'function' ? fn : null; },
    get panelSize() { return panelMesh ? { w: panelW, h: panelMesh.geometry.parameters.height } : null; },
    start() { if (running) return; running = true; clock.getDelta(); frame(); },
    /** Skydome nachladen. Faellt er aus, bleibt der Gradient — kein halber Zustand. */
    async loadSky(url) {
      try {
        const t = await new Promise((res, rej) => new THREE.TextureLoader().load(url || SKY, res, undefined, rej));
        t.mapping = THREE.EquirectangularReflectionMapping;
        t.colorSpace = THREE.SRGBColorSpace;
        scene.background = t;
        return true;
      } catch (e) { return false; }
    },
    setBg(hex) { scene.background = bgGradient(THREE, hex); },
    /** Schatten-Ebene: Schalter + Deckkraft, wie im Studio (der PNG-Export braucht beides). */
    setShadow(on, opacity) {
      shadowPlane.visible = on !== false;
      if (opacity != null) shadowPlane.material.opacity = Math.max(0, Math.min(1, +opacity));
    },
    get shadowPlane() { return shadowPlane; },
    get shadowKey() { return shadowKey; },
    get shadowDir() { return SHADOW_DIR; },
    /** Nur zum Vergleichen von Varianten: Richtung des Schattenlichts. */
    setShadowDir(x, y, z) { SHADOW_DIR.set(x, y, z).normalize(); },
    get key() { return key; },
    stop() { running = false; cancelAnimationFrame(raf); },
    /** Einzelbild als PNG (Ausblick: Clip-Export). preserveDrawingBuffer ist dafuer an. */
    snapshot() { renderer.render(scene, camera); return renderer.domElement.toDataURL('image/png'); },
    /** Bildschirm-Position eines Pet-Kopfes — die Sprechblase haengt im DOM, nicht in 3D. */
    headScreen(key, w, h) {
      const a = actors[key]; if (!a) return null;
      const box = new THREE.Box3().setFromObject(a.wrap);
      _v.set((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2).project(camera);
      return { x: (_v.x * 0.5 + 0.5) * w, y: (-_v.y * 0.5 + 0.5) * h };
    },
  };
}
