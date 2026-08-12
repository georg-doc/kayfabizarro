// ============================================================================
// hud-cube.js — KFB Travel · Slice S7 · HUD-Würfel (Instrument + Menü)
// ----------------------------------------------------------------------------
// Ein Gegenstand statt einer Textwand: unten rechts schwebt ein Würfel.
// RUHEZUSTAND = Instrument (Tacho-Nadel, geeicht aus travel-heat). ANGEFASST =
// Menü: frei drehbar, sechs Funktionsseiten, Klick öffnet die Sektion.
//
// Portiert aus der KFB Cube Academy (uploads/KFB Cube Academy v1/…): RoundedBox
// mit Fallback · CanvasTexture pro Seite · quaternion.slerp(target, 1−0.0022^dt)
// mit angleTo<0.004 · Drag-Trägheit 0.045^dt. Neu für Travel: zweiter Render-Pass
// im Scissor-Viewport, Rückkehr in die Tacho-Pose, aufrechte Beschriftung,
// Neigung gegen die Reisebewegung, spinTo() für den späteren Story-Würfel.
//
// WARUM DIE TEXTUREN AUF DER GEOMETRIE SITZEN (Georgs Review, 2026-07-24):
// Zuerst lagen sechs Planes VOR den Würfelseiten. Das liest sich als aufgeklebte
// Schilder, und ihre eckigen Ecken ragen über die gerundete Silhouette — die
// runden Kanten gehen optisch verloren. Jetzt trägt die RoundedBoxGeometry SELBST
// sechs Materialien (sie erbt von BoxGeometry, also auch deren sechs Gruppen und
// UVs): eine durchgehende Fläche, echte Rundkanten, keine Zipfel.
// FOLGE FÜR DIE GESTALTUNG: die UV 0..1 einer Seite schließt die Rundung ein →
// Inhalt braucht ~12 % Sicherheitszone am Rand. Gilt auch für Georgs PNGs.
//
//   const hud = createHudCube({ THREE, dom: renderer.domElement,
//                               edgeTex: terrain.edgeTex,        // dieselbe Oberfläche wie die Welt
//                               onSelect: (id) => openSettings(id) });
//   hud.update(dt, { kmh, heat, rate, bank, mode });   // pro Frame
//   hud.render(renderer);                              // NACH dem Hauptbild
//   hud.setPalette({ ink, panel });  ·  hud.setFaceImage('music', url);
// ============================================================================

const FACE_N = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const FACE_UP = [[0, 1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1], [0, 1, 0], [0, 1, 0]];
// Reihenfolge = BoxGeometry-Gruppen (+X, −X, +Y, −Y, +Z, −Z). Die Tacho-Seite (+Z)
// ist Startposition UND Reise-Knopf: wer aufs Instrument klickt, will Tempo/Kamera.
const FACES = [
  { id: 'cards', label: 'KARTEN', glyph: 'cards' },
  { id: 'music', label: 'MUSIK', glyph: 'note' },
  { id: 'world', label: 'WELT', glyph: 'steps' },
  { id: 'sky', label: 'HIMMEL', glyph: 'sun' },
  { id: 'travel', label: null, glyph: 'gauge' },
  { id: 'pet', label: 'PET', glyph: 'pet' },
];
const HOME = 4;

export function createHudCube(opts = {}) {
  const THREE = opts.THREE;
  const dom = opts.dom;
  const onSelect = opts.onSelect || (() => {});
  const P = Object.assign({
    size: 240, minSize: 196, margin: 16, narrow: 520, screenFrac: 0.26,
    // S12-Vorgriff: klein, solange er Instrument ist — groß, solange er Menü ist.
    // Ein Drittel kleiner kostet Lesbarkeit (Label 18 px → 12 px), deshalb nur im Ruhezustand.
    restScale: 0.67, growStiff: 12, menuHold: 2.2,
    cubeD: 1.0, round: 0.07, texSize: 512,
    idleReturn: 2.5, clickPx: 4, clickMs: 250,
    float: 0.028, floatHz: 0.38,
    // S57: Oberfläche. `edgeGain` 1 = die Rechnung der Welt 1:1 (`col *= texture2D(uEdge, vUv)`),
    // 0 = keine Kanten-Textur. `paper` schaltet das alte Papier-Relief zurück — EIN Schalter zum
    // Vergleichen, damit die Angleichung nachprüfbar bleibt und nicht Geschmack gegen Geschmack steht.
    edgeGain: 1, paper: false,
  }, opts.params || {});

  const ink = new THREE.Color(opts.ink != null ? opts.ink : 0xb5642a);
  const panel = new THREE.Color(opts.panel != null ? opts.panel : 0xf0e2d2);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  camera.position.set(0, 0, 3.75);   // Worst Case ist der GEDREHTE Würfel (√2 breiter), nicht die Rast-Pose
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(1.3, 1.9, 2.4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfeaff, 0.55); fill.position.set(-1.6, -0.7, -1.1); scene.add(fill);

  const pivot = new THREE.Group(); scene.add(pivot);   // Float + Reise-Neigung
  const cube = new THREE.Group(); pivot.add(cube);     // Orientierung

  // Oberfläche: **dieselbe Kanten-Textur, die die Welt-Würfel tragen** (S57). `voxel-terrain.js`
  // gibt sie als `edgeTex` heraus — mit dem Kommentar „der HUD-Würfel (S7) trägt dieselbe
  // Oberfläche", nur nahm er sie zwei Sprints lang nicht. Die Welt rechnet `col *= texture2D(uEdge,
  // vUv)`, also ein **Multiply auf die Flächenfarbe**; hier wird genau das in das Face-Canvas
  // gebacken (MeshStandardMaterial kann keine zwei Farbkarten multiplizieren).
  //
  // WICHTIG — die Tusche liegt DRÜBER, nicht drunter: der Kachel-Multiply passiert direkt nach der
  // Grundfarbe, VOR Nadel, Ziffern und Beschriftung. Das Korn gehört zur Oberfläche, der Aufdruck
  // nicht — und die Seite ist im Ruhezustand nur ~58 px breit: das Label bei 12 px durch eine
  // Körnung zu schicken wäre die Lesbarkeits-Untergrenze aus S12 hinterrücks gerissen.
  //
  // Geladen wird nichts doppelt: liegt `opts.edgeTex` an, wird sein `image` benutzt (ein Fetch für
  // Welt und Würfel). Ohne Terrain — Standalone-Export, Messblatt — lädt der Würfel dieselbe URL
  // selbst, kanonisch zuerst, lokaler Spiegel als Fallback.
  const EDGE_CANON = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/edge3.jpg';
  const EDGE_LOCAL = new URL('./edge3.jpg', import.meta.url).href;
  let edgeImg = null;

  // Nur das PBR-Relief ist optional — und es wird gar nicht geladen, wenn es aus ist (zwei Fetches
  // für eine Oberfläche, die niemand sieht, sind kein Fallback, sondern Ballast).
  const _tl = new THREE.TextureLoader();
  let paperN = null, paperR = null;
  if (P.paper) {
    const TEX = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/Paper003/';
    paperN = _tl.load(TEX + 'Paper003_normal.jpg');
    paperR = _tl.load(TEX + 'Paper003_roughness.jpg');
    for (const t of [paperN, paperR]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); }
  }

  const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3();
  const _m4 = new THREE.Matrix4();

  // Alle Rast-Positionen tragen die gleiche leichte 3/4-Neigung: nur so liest sich der
  // Würfel als Körper und nicht als flaches Rechteck; Beschriftung bleibt trotzdem lesbar.
  const HOME_TILT = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.15, 0.26, 0));
  function faceForwardQuat(i) {
    _v1.set(FACE_N[i][0], FACE_N[i][1], FACE_N[i][2]);
    _v2.set(FACE_UP[i][0], FACE_UP[i][1], FACE_UP[i][2]);
    _v3.crossVectors(_v2, _v1).normalize();
    _m4.makeBasis(_v3, _v2, _v1);
    return new THREE.Quaternion().setFromRotationMatrix(_m4).invert().premultiply(HOME_TILT);
  }

  // ---------------------------------------------------------------- Flächen malen
  const faceCanvas = [], faceTex = [], faceMats = [];
  const SAFE = 0.12;   // Sicherheitszone: die UV schließt die Rundkante ein

  function fillFace(g, S) {
    g.clearRect(0, 0, S, S);
    g.fillStyle = '#' + panel.getHexString();
    g.fillRect(0, 0, S, S);
    // Die Rechnung der Welt: Flächenfarbe × Kachel. Eine Kachel pro Seite — die UV 0..1 einer
    // Würfelseite ist genau ein Tile, in der Welt wie hier, also kein `repeat`.
    if (edgeImg && P.edgeGain > 0) {
      g.save();
      g.globalCompositeOperation = 'multiply';
      g.globalAlpha = Math.max(0, Math.min(1, P.edgeGain));
      g.drawImage(edgeImg, 0, 0, S, S);
      g.restore();
    }
  }

  function glyph(g, S, kind, col, cyF) {
    const c = S * 0.5, cy = S * (cyF != null ? cyF : 0.5), u = S * 0.10;
    g.save();
    g.strokeStyle = col; g.fillStyle = col; g.lineWidth = S * 0.028;
    g.lineJoin = 'round'; g.lineCap = 'round';
    if (kind === 'cards') {
      for (const [dx, rot] of [[-u * 0.5, -0.18], [u * 0.5, 0.14]]) {
        g.save(); g.translate(c + dx, cy); g.rotate(rot);
        g.beginPath(); g.rect(-u * 0.95, -u * 1.35, u * 1.9, u * 2.7); g.stroke(); g.restore();
      }
    } else if (kind === 'note') {
      g.beginPath(); g.ellipse(c - u * 0.55, cy + u * 1.05, u * 0.72, u * 0.56, -0.3, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(c + u * 0.12, cy + u * 1.0); g.lineTo(c + u * 0.12, cy - u * 1.5); g.stroke();
      g.beginPath(); g.moveTo(c + u * 0.12, cy - u * 1.5); g.lineTo(c + u * 1.25, cy - u * 1.05); g.stroke();
    } else if (kind === 'steps') {
      for (let i = 0; i < 3; i++) {
        const w = u * 1.05;
        g.beginPath(); g.rect(c - u * 1.6 + i * w, cy + u * 1.0 - (i + 1) * w * 0.85, w, (i + 1) * w * 0.85); g.stroke();
      }
    } else if (kind === 'sun') {
      g.beginPath(); g.arc(c, cy - u * 0.35, u * 0.78, 0, Math.PI * 2); g.stroke();
      for (let i = -2; i <= 2; i++) {
        const a = -Math.PI / 2 + i * 0.52;
        g.beginPath();
        g.moveTo(c + Math.cos(a) * u * 1.15, cy - u * 0.35 + Math.sin(a) * u * 1.15);
        g.lineTo(c + Math.cos(a) * u * 1.6, cy - u * 0.35 + Math.sin(a) * u * 1.6);
        g.stroke();
      }
      g.beginPath(); g.moveTo(c - u * 1.7, cy + u * 1.5); g.lineTo(c + u * 1.7, cy + u * 1.5); g.stroke();
    } else if (kind === 'pet') {
      g.beginPath(); g.rect(c - u * 1.15, cy - u * 0.85, u * 2.3, u * 2.0); g.stroke();
      g.beginPath(); g.moveTo(c - u * 0.6, cy - u * 0.85); g.lineTo(c - u * 0.75, cy - u * 1.9); g.stroke();
      g.beginPath(); g.moveTo(c + u * 0.6, cy - u * 0.85); g.lineTo(c + u * 0.75, cy - u * 1.9); g.stroke();
      g.beginPath(); g.arc(c - u * 0.42, cy + u * 0.1, u * 0.2, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(c + u * 0.42, cy + u * 0.1, u * 0.2, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }

  // Tacho mit Nadel: Zeiger auf travelHeat, Zahl in geeichten km/h. Bei 0 steht die
  // Nadel am linken Anschlag (der frühere Balken behielt dort einen roten Stummel).
  // ZWEI FASSUNGEN: im Ruhezustand ist der Würfel ein Drittel kleiner — die Seite ist dann
  // nur ~58 px breit, und die Zahl würde auf 12 px fallen. Kompakt-Fassung: größere Zahl,
  // größere Nadel, kein Beiwerk. Details gehören in die gewachsene Fassung.
  let shownKmh = -1, shownMode = '', lastHeat = 0, shownCompact = null;
  function paintGauge(kmh, mode, heat, compact) {
    const S = P.texSize, g = faceCanvas[HOME].getContext('2d');
    fillFace(g, S);
    const dark = '#1f1a14', inkHex = '#' + ink.getHexString();
    const cy = compact ? S * 0.50 : S * 0.55, R = compact ? S * 0.255 : S * 0.265;
    const cx = S / 2;
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.lineCap = 'butt';
    g.strokeStyle = 'rgba(31,26,20,.20)'; g.lineWidth = S * (compact ? 0.028 : 0.022);
    g.beginPath(); g.arc(cx, cy, R, Math.PI, Math.PI * 2); g.stroke();
    const ticks = compact ? 4 : 8;
    for (let i = 0; i <= ticks; i++) {
      const a = Math.PI + (i / ticks) * Math.PI, lng = (i % 2 === 0) ? S * 0.06 : S * 0.034;
      g.strokeStyle = (i / ticks) >= 0.87 ? inkHex : 'rgba(31,26,20,.45)';
      g.lineWidth = (i % 2 === 0) ? S * 0.018 : S * 0.011;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * (R - lng), cy + Math.sin(a) * (R - lng));
      g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      g.stroke();
    }
    const na = Math.PI + Math.max(0, Math.min(1, heat)) * Math.PI;
    g.strokeStyle = inkHex; g.lineCap = 'round'; g.lineWidth = S * (compact ? 0.032 : 0.026);
    g.beginPath();
    g.moveTo(cx - Math.cos(na) * S * 0.042, cy - Math.sin(na) * S * 0.042);
    g.lineTo(cx + Math.cos(na) * (R - S * 0.07), cy + Math.sin(na) * (R - S * 0.07));
    g.stroke();
    g.fillStyle = dark; g.beginPath(); g.arc(cx, cy, S * (compact ? 0.036 : 0.03), 0, Math.PI * 2); g.fill();
    if (compact) {
      g.font = `700 ${Math.round(S * 0.28)}px 'Baloo 2', system-ui, sans-serif`;
      g.fillText(String(Math.max(0, Math.round(kmh))), cx, S * 0.865);
    } else {
      g.font = `700 ${Math.round(S * 0.21)}px 'Baloo 2', system-ui, sans-serif`;
      g.fillText(String(Math.max(0, Math.round(kmh))), cx, S * 0.80);
      g.font = `${Math.round(S * 0.115)}px 'Special Elite', monospace`;
      g.fillStyle = 'rgba(31,26,20,.55)';
      g.fillText('km/h', cx, S * 0.90);
      g.font = `${Math.round(S * 0.125)}px 'Special Elite', monospace`;
      g.fillStyle = 'rgba(31,26,20,.62)';
      g.fillText(mode, cx, S * 0.185);
    }
    if (faceTex[HOME]) faceTex[HOME].needsUpdate = true;
  }

  function paintFace(i) {
    if (i === HOME) { paintGauge(shownKmh < 0 ? 0 : shownKmh, shownMode || 'FLY', lastHeat, shownCompact !== false); return; }
    const S = P.texSize, g = faceCanvas[i].getContext('2d'), f = FACES[i];
    fillFace(g, S);
    glyph(g, S, f.glyph, '#1f1a14', 0.44);
    g.fillStyle = '#1f1a14';
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    // Lesbarkeits-Untergrenze: die Seite ist auf dem Schirm nur ~95 px breit,
    // erst ab 0.17·S landet das Label über 14 px — alles darunter wird zu Schlieren.
    g.font = `600 ${Math.round(S * 0.17)}px 'Special Elite', monospace`;
    g.fillText(f.label, S / 2, S * 0.83);
    if (faceTex[i]) faceTex[i].needsUpdate = true;
  }

  for (let i = 0; i < 6; i++) {
    const cnv = document.createElement('canvas'); cnv.width = cnv.height = P.texSize;
    faceCanvas[i] = cnv;
    const tex = new THREE.CanvasTexture(cnv);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    tex.center.set(0.5, 0.5);   // PFLICHT: sonst rotiert die Beschriftung um die Ecke
    faceTex[i] = tex;
    faceMats[i] = new THREE.MeshStandardMaterial({
      map: tex, roughness: P.paper ? 0.88 : 0.94, metalness: 0,
      normalMap: paperN, roughnessMap: paperR,
      normalScale: new THREE.Vector2(0.4, 0.4),
    });
  }

  // Auf „läuft" gaten, nicht auf „existiert": ein `THREE.Texture` hat sein `image` erst nach dem
  // Dekodieren, und `voxel-terrain.js` TAUSCHT es später noch aus (RAW schlägt fehl → lokaler
  // Spiegel). Events gibt es dafür keine, also wird kurz nachgesehen und dann neu gemalt; bis dahin
  // steht der Würfel in seiner alten Fassung — sichtbar, nur ohne Korn.
  const decoded = (t) => { const im = t && t.image; return im && (im.naturalWidth || im.width) ? im : null; };
  function adoptEdge(img) {
    if (!img || img === edgeImg) return;
    edgeImg = img;
    for (let i = 0; i < 6; i++) paintFace(i);
  }
  if (opts.edgeTex) {
    if (!decoded(opts.edgeTex)) {
      let tries = 0;
      const iv = setInterval(() => {
        const im = decoded(opts.edgeTex);
        if (im) { adoptEdge(im); clearInterval(iv); }
        else if (++tries > 80) clearInterval(iv);   // 10 s, dann bleibt es bei der alten Fassung
      }, 125);
    } else adoptEdge(decoded(opts.edgeTex));
  } else {
    _tl.load(EDGE_CANON, (t) => adoptEdge(t.image),
             undefined, () => _tl.load(EDGE_LOCAL, (t) => adoptEdge(t.image)));
  }

  // EIN Mesh, sechs Materialien: BoxGeometry (und die davon erbende RoundedBoxGeometry)
  // liefert pro Seite eine Gruppe. Damit sitzt die Textur AUF der Würfelfläche.
  const body = new THREE.Mesh(new THREE.BoxGeometry(P.cubeD, P.cubeD, P.cubeD), faceMats);
  cube.add(body);
  // **Gemessen am 26.7.: dieser Import ist von Anfang an fehlgeschlagen** — der Würfel lief die ganze
  // Zeit mit `BoxGeometry`, also mit scharfen Kanten, und das war der wiederkehrende Konsolenfehler
  // „SCRIPT failed to load" (ohne Namen, weil ein dynamischer Import im Modulgraph fällt). Der
  // `catch(() => {})` hat ihn zusätzlich unsichtbar gemacht — ein stiller Fallback, der drei Sprints
  // lang als Erfolg durchging. Jetzt die **volle URL** (dieselbe Version wie die Importmap) und ein
  // Fallback, der SAGT, dass er greift.
  import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js')
    .then((m) => {
      const g = new m.RoundedBoxGeometry(P.cubeD, P.cubeD, P.cubeD, 6, P.cubeD * P.round);
      if (g.groups && g.groups.length === 6) { body.geometry.dispose(); body.geometry = g; }
      else g.dispose();
    })
    .catch((e) => console.warn('[hud-cube] Rundkanten nicht ladbar — scharfe Kanten', e));

  for (let i = 0; i < 6; i++) paintFace(i);
  cube.quaternion.copy(faceForwardQuat(HOME));

  // ---------------------------------------------------------------- Interaktion
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let targetQuat = null, dragging = false, wantSnap = false;
  const dragVel = { x: 0, y: 0 };
  let lastX = 0, lastY = 0, downX = 0, downY = 0, downT = 0, lastInputAt = -1e9, enabled = true, hovering = false;

  const size = () => {
    const w = dom.clientWidth || 1, h = dom.clientHeight || 1;
    const full = Math.min(P.size, Math.max(P.minSize, Math.min(w, h) * P.screenFrac));
    return Math.round(full * (P.restScale + (1 - P.restScale) * grow));
  };
  const narrow = () => (dom.clientWidth || 1) < P.narrow;
  function rectOf() {
    const s = size();
    return { x: (dom.clientWidth || 1) - s - P.margin, y: (dom.clientHeight || 1) - s - P.margin, s };
  }
  function localPt(cx, cy) {
    const r = dom.getBoundingClientRect(), q = rectOf();
    return { px: cx - r.left - q.x, py: cy - r.top - q.y, s: q.s };
  }
  function inside(cx, cy) {
    const l = localPt(cx, cy);
    return l.px >= 0 && l.px <= l.s && l.py >= 0 && l.py <= l.s;
  }
  // Fläche = Material-Index des getroffenen Dreiecks (Academy-Muster, jetzt auf EINEM Mesh)
  function pick(cx, cy) {
    const l = localPt(cx, cy);
    ndc.set((l.px / l.s) * 2 - 1, -((l.py / l.s) * 2 - 1));
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObject(body, false);
    return hits.length && hits[0].face ? hits[0].face.materialIndex : -1;
  }
  function rotate(dx, dy) {
    _v1.setFromMatrixColumn(camera.matrixWorld, 0);
    _v2.setFromMatrixColumn(camera.matrixWorld, 1);
    cube.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(_v2, dx));
    cube.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(_v1, dy));
  }
  function frontFace() {
    let best = HOME, dot = -2;
    for (let i = 0; i < 6; i++) {
      _v1.set(FACE_N[i][0], FACE_N[i][1], FACE_N[i][2]).applyQuaternion(cube.quaternion);
      if (_v1.z > dot) { dot = _v1.z; best = i; }
    }
    return best;
  }

  // Der Würfel beansprucht den Zeiger EXKLUSIV. stopPropagation() reicht NICHT:
  // travel-poc hört auf demselben Element, das ist AT_TARGET — da laufen alle Listener
  // weiter. Also stopImmediatePropagation() plus eine Marke am Event als Sicherheitsnetz.
  const claim = (e) => { e.__hudClaimed = true; e.stopImmediatePropagation(); };

  const onDown = (e) => {
    if (!enabled || !inside(e.clientX, e.clientY)) return;
    claim(e);
    dragging = true; wantSnap = false;
    lastX = downX = e.clientX; lastY = downY = e.clientY; downT = performance.now();
    lastInputAt = downT; targetQuat = null;
    try { dom.setPointerCapture(e.pointerId); } catch (err) {}
  };
  const onMove = (e) => {
    if (!enabled) return;
    if (!dragging) {
      hovering = inside(e.clientX, e.clientY);
      if (hovering && e.pointerType === 'mouse') dom.style.cursor = 'grab';
      else if (dom.style.cursor === 'grab') dom.style.cursor = '';
      return;
    }
    claim(e);
    if (narrow()) return;                      // Schmalformat: nicht drehbar (Trefferflächen)
    const dx = (e.clientX - lastX) * 0.012, dy = (e.clientY - lastY) * 0.012;
    lastX = e.clientX; lastY = e.clientY; lastInputAt = performance.now();
    rotate(dx, dy); dragVel.x = dx; dragVel.y = dy;
  };
  const onUp = (e) => {
    if (!enabled || !dragging) return;
    claim(e);
    dragging = false; lastInputAt = performance.now();
    const quick = performance.now() - downT < P.clickMs;
    const still = Math.hypot(e.clientX - downX, e.clientY - downY) < P.clickPx;
    if (quick && still) {
      dragVel.x = dragVel.y = 0;
      const i = narrow() ? frontFace() : pick(e.clientX, e.clientY);
      if (i >= 0) { targetQuat = faceForwardQuat(i); onSelect(FACES[i].id, i); }
    } else {
      wantSnap = true;                         // Trägheit ausklingen lassen, dann einrasten
    }
  };
  dom.addEventListener('pointerdown', onDown, true);
  dom.addEventListener('pointermove', onMove, true);
  dom.addEventListener('pointerup', onUp, true);
  dom.addEventListener('pointercancel', onUp, true);

  // ---------------------------------------------------------------- Frame
  const tiltZ = { x: 0, v: 0 }, tiltX = { x: 0, v: 0 };
  let grow = 0;   // 0 = Instrument (klein), 1 = Menü (voll)
  const sp = (s, t, stiff, damp, dt) => { s.v += (t - s.x) * stiff * dt; s.v *= Math.pow(damp, dt * 60); s.x += s.v * dt; };
  let tt = 0, gaugeT = 0;

  function uprightLabels() {
    for (let i = 0; i < 6; i++) {
      _v1.set(FACE_N[i][0], FACE_N[i][1], FACE_N[i][2]).applyQuaternion(cube.quaternion);
      if (_v1.z < 0.2) continue;               // nicht sichtbar → nicht anfassen
      _v2.set(FACE_UP[i][0], FACE_UP[i][1], FACE_UP[i][2]).applyQuaternion(cube.quaternion);
      const ang = Math.atan2(_v2.x, _v2.y);    // Neigung der Oberkante gegen die Senkrechte
      const t = Math.round(ang / (Math.PI / 2)) * (Math.PI / 2);
      if (Math.abs(t - faceTex[i].rotation) > 0.35) faceTex[i].rotation = t;   // Totband
    }
  }

  function update(dt, src) {
    src = src || {};
    tt += dt;
    // Größe folgt der Aufmerksamkeit: gewachsen bleibt er, solange man ihn anfasst oder
    // gerade angefasst hat — danach schrumpft er zurück in die Tacho-Pose.
    const wants = (dragging || hovering || (performance.now() - lastInputAt) / 1000 < P.menuHold) ? 1 : 0;
    grow += (wants - grow) * Math.min(1, dt * P.growStiff);
    // Float + Reise-Neigung: GEGEN die Bewegung (Trägheit), nicht mit.
    // Clamps klein halten — bei größeren Winkeln läuft die Ecke aus dem Viewport.
    pivot.position.y = Math.sin(tt * Math.PI * 2 * P.floatHz) * P.float;
    sp(tiltZ, Math.max(-0.16, Math.min(0.16, -(src.bank || 0) * 0.55)), 90, 0.8, dt);
    sp(tiltX, Math.max(-0.12, Math.min(0.12, -(src.rate || 0) * 0.07)), 80, 0.82, dt);
    pivot.rotation.set(tiltX.x, 0, tiltZ.x);

    if (targetQuat) {
      cube.quaternion.slerp(targetQuat, 1 - Math.pow(0.0022, dt));
      if (cube.quaternion.angleTo(targetQuat) < 0.004) { cube.quaternion.copy(targetQuat); targetQuat = null; }
    } else if (!dragging) {
      dragVel.x *= Math.pow(0.045, dt); dragVel.y *= Math.pow(0.045, dt);
      const spin = Math.abs(dragVel.x) + Math.abs(dragVel.y);
      if (spin > 1e-4) rotate(dragVel.x, dragVel.y);
      if (wantSnap && spin < 0.004) { wantSnap = false; targetQuat = faceForwardQuat(frontFace()); }
      if (!wantSnap && (performance.now() - lastInputAt) / 1000 > P.idleReturn) {
        const home = faceForwardQuat(HOME);
        if (cube.quaternion.angleTo(home) > 0.01) targetQuat = home;
      }
    }

    lastHeat = src.heat || 0;
    gaugeT += dt;
    const kmh = Math.round(src.kmh || 0), md = (src.mode || 'fly').toUpperCase();
    const compact = grow < 0.45;
    if (compact !== shownCompact) { shownCompact = compact; shownKmh = kmh; shownMode = md; paintGauge(kmh, md, lastHeat, compact); }
    else if (gaugeT > 0.06 && (kmh !== shownKmh || md !== shownMode)) {
      gaugeT = 0; shownKmh = kmh; shownMode = md;
      paintGauge(kmh, md, lastHeat, compact);
    }
    uprightLabels();
  }

  function render(renderer) {
    const w = dom.clientWidth || 1, h = dom.clientHeight || 1, q = rectOf();
    const yBottom = h - q.y - q.s;             // WebGL zählt von unten
    renderer.autoClear = false;
    renderer.setScissorTest(true);
    renderer.setViewport(q.x, yBottom, q.s, q.s);
    renderer.setScissor(q.x, yBottom, q.s, q.s);
    renderer.clearDepth();
    renderer.render(scene, camera);
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, w, h);
    renderer.autoClear = true;
  }

  return {
    name: 'hud-cube', update, render, scene, camera, cube, body,
    get faces() { return FACES.map((f) => f.id); },
    get sizePx() { return size(); },
    get growth() { return grow; },
    get safeZone() { return SAFE; },
    spinTo(id) {
      const i = typeof id === 'number' ? id : FACES.findIndex((f) => f.id === id);
      if (i >= 0) { targetQuat = faceForwardQuat(i); lastInputAt = performance.now(); }
    },
    home() { targetQuat = faceForwardQuat(HOME); },
    // kurzer Flip — trägt später den Story-Mode-Wurf (dann mit D6-Augen)
    spin(strength) {
      const k = strength != null ? strength : 1;
      dragVel.x = 0.16 * k; dragVel.y = 0.09 * k;
      targetQuat = null; wantSnap = true; lastInputAt = performance.now();
    },
    setPalette(pal) {
      if (!pal) return;
      if (pal.ink != null) ink.set(pal.ink);
      if (pal.panel != null) panel.set(pal.panel);
      for (let i = 0; i < 6; i++) paintFace(i);
    },
    // Oberfläche zur Laufzeit vergleichen (Regler im Einstellungs-Overlay, Sektion „Würfel").
    get edgeGain() { return P.edgeGain; },
    setEdgeGain(v) {
      const g = Math.max(0, Math.min(1, v));
      if (Math.abs(g - P.edgeGain) < 1e-3) return;
      P.edgeGain = g;
      for (let i = 0; i < 6; i++) paintFace(i);
    },
    get hasEdge() { return !!edgeImg; },
    // Procreate-PNGs: transparent, quadratisch, 12 % Sicherheitszone (Rundkante!)
    setFaceImage(id, url) {
      const i = typeof id === 'number' ? id : FACES.findIndex((f) => f.id === id);
      if (i < 0) return;
      _tl.load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.center.set(0.5, 0.5);
        if (faceMats[i].map && faceMats[i].map !== tex) faceMats[i].map.dispose();
        faceMats[i].map = tex; faceMats[i].needsUpdate = true; faceTex[i] = tex;
      });
    },
    setEnabled(on) { enabled = !!on; if (!on) { dragging = false; hovering = false; dom.style.cursor = ''; } },
    preWarm(renderer) { renderer.compile(scene, camera); },
    dispose() {
      dom.removeEventListener('pointerdown', onDown, true);
      dom.removeEventListener('pointermove', onMove, true);
      dom.removeEventListener('pointerup', onUp, true);
      dom.removeEventListener('pointercancel', onUp, true);
      body.geometry.dispose();
      for (const m of faceMats) { if (m.map) m.map.dispose(); m.dispose(); }
      if (paperN) paperN.dispose();
      if (paperR) paperR.dispose();
    },
  };
}
