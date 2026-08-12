// ============================================================================
// sky-dice.js — KFB Travel · Slice S60c (v11) · Drei Würfel im Himmel
// ----------------------------------------------------------------------------
// Dritter Anlauf, und diesmal aus dem Vorbild statt aus der Theorie. Was vorher schiefging:
//  · **S60** nahm „borromäisch" wörtlich → drei Rahmen, physisch verschränkt. Sah aus wie ein
//    Baugerüst. Die Mathematik war gerettet, der Gegenstand verloren.
//  · **S60b** trennte Körper und Bahn → drei Würfel auf drei verschlungenen Ellipsen. Besser, aber
//    die Bahnen dominierten das Bild, und drei Würfel an einem Ort sind keine Himmelsordnung.
//  · **Das Konstrukt ist geparkt** (Georg, 26.7.). Es kommt wieder, wenn es etwas erzählt.
//
// DIESE FASSUNG folgt `rollercoaster-v11` (dort funktioniert es): das echte Würfelmodell aus dem
// Repo, ein **Sitz** pro Würfel (Richtung + scheinbare Größe), ein **Dreher** darin, Augen dunkel,
// Körper leuchtend. Neu für Travel:
//
//  1. **Gleichmäßig im Skydome verteilt** — drei Sitze, 120° im Azimut auseinander, verschiedene
//     Höhenwinkel. Wer sich dreht, hat nach höchstens 120° einen Würfel im Bild. Sie sitzen auf einer
//     Kugel um den Spieler: die Ordnung ist immer dieselbe, egal wo man fliegt.
//  2. **Die Verschränkung liegt UNTER DER HAUBE, nicht in der Geometrie.** Jede Eigendrehung hängt
//     von den beiden anderen ab — zyklische Kopplung:
//
//         ω₁ = b₁ + K·sin(φ₂ − φ₃)     ω₂ = b₂ + K·sin(φ₃ − φ₁)     ω₃ = b₃ + K·sin(φ₁ − φ₂)
//
//     Das ist der borromäische Gedanke als Bewegung: **kein Paar erklärt das Muster, erst alle drei.**
//     Nimmt man einen weg, ist die Kopplung der beiden anderen ein konstanter Versatz — die Figur
//     zerfällt. Bei K = 0 laufen sie unabhängig (zum Vergleichen).
//  3. **Planeten-Anmutung:** der Körper leuchtet in seiner Farbe und atmet (Emissiv-Puls), die Augen
//     bleiben dunkle Punkte. Kein Shader, kein Post-Pass — Emissiv plus Skalierung.
//  4. **Optional am Takt** (Setting): Größe pulst auf den Beat, dazu Cartoon-Kinetik als Squash &
//     Stretch (breiter wenn gestaucht, schlanker wenn gestreckt — Volumen bleibt gefühlt gleich),
//     Drehung zieht kurz an (Disco-Logik) und das Leuchten blitzt. Alles auf DREI Objekten, also
//     performance-schonend: kein Partikel, kein zweiter Renderpass.
//
// **King Kayfabian bleibt der rotierende Richter:** Recht spricht der Würfel, der der Kamera am
// direktesten gegenübersteht — und weil sie dauernd drehen, wandert das Amt von selbst.
//
//   const dice = createSkyDice({ THREE, sfx, beat: () => beatNow });
//   scene.add(dice.group);  dice.setCenter(x, y, z);  dice.update(dt, camera);  dice.roll();
// ============================================================================

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const DICE_URL = RAW + 'media/3D_Assets/dice_ugur_lowpoly.glb';

// Drei Sitze auf der Kugel: Azimut 120° auseinander, Höhenwinkel ungleich (sonst liest es sich als
// Gürtel). Farben sind Georgs Ausgangsidee — rot · gelb · blau, Grundfarben, sofort unterscheidbar.
//
// **Gemessen und korrigiert (26.7.):** die erste Fassung hatte az = 0 nach **+z** gerechnet — geflogen
// wird aber nach **−z**, also saß der erste Würfel hinter dem Spieler (camZ = −349, NDC-Spiegelbild).
// Und die Höhenwinkel (17° / 30° / 11°) lagen über dem sichtbaren Band: die Kamera blickt 16° nach
// unten, sichtbar ist nur −43° bis +11°. Ergebnis: **kein einziger Würfel im Bild**, während jede
// Zahl „ok" sagte. Dieselbe Fehlerklasse wie in S60 — gemessen wird beim Spieler, nicht im Modell.
// Deshalb: `azOffset` dreht die Sitze in die Flugrichtung, und die Höhen liegen im sichtbaren Band.
// **Zweiter Befund (26.7., Georgs Screenshot):** die Höhenwinkel waren NEGATIV (−5,7° / +1,1° / −2,9°).
// Bei 360 u Abstand heißt das: hinter der Skyline. Gemessen an den echten Pixeln an ihrer Stelle kam
// Stadt zurück (47,41,45), nicht Würfel — zwei von drei waren verdeckt.
// **Dritter Befund (Nachmessung):** die Korrektur schoss zu hoch. Bei 9,2° berührt die OBERKANTE des
// gelben Würfels (9,2° + 2,2° Winkelradius) die obere Bildkante bei +11,3° — angeschnitten, während
// die Zahl „3/3" meldete, weil sie Mittelpunkte zählte. Nach unten ist Platz (das Band reicht bis −43°),
// die Skyline lag bei etwa +2–3°. Also: knapp über der Stadt, weit unter der Bildkante.
const SEATS = [
  { key: 'rot',  az: 0.0,             el: 0.060, body: 0xc22d12, glow: 0xff6a3a, base: 0.16 },
  { key: 'gelb', az: Math.PI * 2 / 3, el: 0.095, body: 0xd99a08, glow: 0xffd166, base: 0.11 },
  { key: 'blau', az: Math.PI * 4 / 3, el: 0.075, body: 0x1f5793, glow: 0x74baff, base: 0.13 },
];

const PIP_LAYOUT = {
  1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]],
  3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]],
  4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
  6: [[0.3, 0.24], [0.3, 0.5], [0.3, 0.76], [0.7, 0.24], [0.7, 0.5], [0.7, 0.76]],
};
const FACE_PIPS = [3, 4, 1, 6, 5, 2];   // BoxGeometry: [+x,−x,+y,−y,+z,−z] · gegenüber = 7
const FACE_N = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

export function createSkyDice(opts = {}) {
  const THREE = opts.THREE;
  const sfx = opts.sfx || (() => {});
  const beatOf = opts.beat || (() => 0);
  const P = Object.assign({
    radius: 360,        // Abstand vom Spieler (Sitz auf der Kugel)
    // Grunddrehung aller Sitze. π = der erste Würfel steht dort, wo man beim Start hinsieht (nach −z).
    // Die Sitze bleiben **weltfest**: sie kleben nicht am Blick, sondern man dreht sich zu ihnen hin.
    azOffset: Math.PI,
    size: 32,           // scheinbare Kantenlänge in Weltunits (Georg, 26.7.)
    // **Streuung der Sitze.** 1 = die kanonischen 120° (man dreht sich zu ihnen hin, höchstens 120° weit),
    // kleiner = die drei rücken vor dir zusammen. Standard 0,24 ≈ 29° Abstand: **alle drei zugleich im
    // Bild** (Georg, 26.7.) — gemessen im Reiseblick (fov 55,4°, Seitenverhältnis 1,71): 24° und 34°
    // ergeben 3/3, ab 48° nur noch 1/3. 0,24 statt 0,28, damit auch ein schmaleres Fenster reicht —
    // das waagerechte Bildfeld schrumpft mit dem Seitenverhältnis, die Höhe nicht.
    // Der Sitz-Azimut wird um die Mitte zentriert, nicht nur skaliert — sonst wänderte die Gruppe
    // beim Regeln nach rechts.
    // **v16/S60d (Georg, 12.8.): zurück auf die kanonischen 120°.** Diese Zeile stand auf 0,24
    // (≈ 29°), weil am 26.7. gewünscht war, alle drei zugleich im Bild zu haben. Das war eine
    // Regie-Entscheidung, keine Messung — und sie kostete genau das, was die 120° leisten: eine
    // ORDNUNG des Himmels, in der man sich orientieren kann. Bei 29° sind drei Würfel eine Gruppe
    // an einer Stelle; bei 120° ist jede Richtung durch einen Würfel benannt, und wer sich dreht,
    // hat nach höchstens einer Dritteldrehung einen im Bild.
    // Rückweg auf das Bild vom 26.7.: 0,24. Der Regler heißt „Streuung der Sitze".
    spreadAz: 1,
    lift: 0,            // Feinjustage der Höhe (die Höhenwinkel machen die Arbeit)
    spinHz: 0.13,       // Grundtempo der Eigendrehung
    // K — zyklische Kopplung. **Standard aus** (Georg, 26.7.): sie hat das Rotieren ruckeln lassen.
    // Grund: `ω = b + K·sin(…)` konnte durch Null gehen — die Drehrichtung kippte, das sah wie ein
    // Fehler aus, nicht wie ein Gesetz. Jetzt greift K nur als **Faktor** aufs Grundtempo, gedämpft —
    // die Drehung kann nie stehen bleiben und nie umkehren.
    couple: 0,
    drift: 0.06,        // Achsen-Wandern: gibt der Drehung die Schwerelosigkeit (0 = starre Achse)
    // **Gemessen an den Pixeln (26.7.):** mit glow 0,85 kam der gelbe Würfel als 242/219/140 heraus —
    // Sättigung 0,42, also Creme. Ursache ist nicht die Grundfarbe, sondern die Kette Emissive →
    // Tonemapping → sRGB: ein helles Emissive schiebt alle Kanäle gegen 1 und frisst die Farbe.
    // Weniger Leuchten heißt hier MEHR Farbe (0,12 ergäbe 0,64). 0,22 ist der Kompromiss: die Würfel
    // glimmen noch gegen den Himmel, tragen aber rot/gelb/blau erkennbar.
    glow: 0.22,
    pulseHz: 0.32,      // Atem
    beatOn: true,       // am Takt pulsieren?
    beatScale: 0.07,    // wie stark der Beat die Größe treibt — war 0,22 und wirkte wie ein Fehler
    beatSquash: 0.6,    // Anteil davon, der als Squash & Stretch läuft (Cartoon-Kinetik)
    beatSpin: 0.45,     // Drehung zieht auf dem Beat an (Disco) — sanft, sonst reißt es die Drehung
    tumbleDur: 2.2,
    // ---- Bahn (Auf- und Untergang). Georgs Idee vom 26.7., nachdem ein Würfel hinter den Horizont
    // gerutscht war und wie ein Gestirn aussah. **Eine gemeinsame Bahn, drei Sitze 120° auseinander.**
    // Warum eine und nicht drei: auf EINEM Großkreis sind drei Punkte mit 120° Phasenabstand **immer
    // exakt 120°** voneinander entfernt — die gleichmäßigste Verteilung, die es für drei Punkte gibt,
    // ohne Abstimmung, ohne Regelkreis. Drei eigene Bahnen könnten das nur annähern.
    // Die Bahn geht seitlich auf, kulminiert vor dir (`orbitEl`) und untergeht auf der anderen Seite.
    orbitOn: false,     // Standard aus: der Standardblick soll alle drei zeigen
    orbitMin: 4,        // Minuten pro Umlauf — ein Tag
    orbitEl: 0.18,      // Höhe der Kulmination (rad). **Gemessen, nicht gewählt:** der Reiseblick liegt
                        // 16° nach unten, sichtbar ist das Band −44°…+12°. Eine Bahn, die über +12°
                        // kulminiert, läuft im Bild NIE durch (bei 20°: 0 % der Zeit ein Würfel im Bild,
                        // obwohl ständig einer „über dem Horizont" steht — dieselbe Falle wie in S60).
                        // Bei 10°: 58 % der Zeit steht mindestens einer im Bild.
    // Anheben der ganzen Bahn kostet **zweimal**: mit Hub ist es kein Großkreis mehr (der Mindestwinkel
    // fällt unter 120°), und die Würfel stehen zwar häufiger über dem Horizont, aber über dem Bildfeld
    // — gemessen: Hub 0,15 hebt „oben" von 1,5 auf 2,4 von 3 und senkt „im Bild" von 0,58 auf **0**.
    // Deshalb Standard 0: der Aufgang ist die Erzählung, nicht die Anwesenheit.
    orbitLift: 0,
    orbitAuto: true,    // Tageszeit läuft von selbst
    orbitPhase: 0,      // 0…1 = Tageszeit; 0 = der erste Würfel steht im Zenit vor dir
    visible: true,
    pipTex: 256,
  }, opts.params || {});

  const api = { onJudge: null };
  const group = new THREE.Group();
  group.frustumCulled = false;

  const dice = [];
  let ready = false, fromGlb = false;

  // ---------------------------------------------------------------- Notfall-Würfel (ohne GLB)
  // Auf „läuft" gaten, nicht auf „existiert": das Modell kommt über das Netz. Bis es da ist (oder
  // wenn es nie kommt) steht ein eigener Würfel mit gestempelten Augen — nie ein leerer Himmel.
  const allTex = [], allMats = [], allGeo = [];
  // Emissive ist die Körperfarbe, nur 35 % zum hellen Ton gezogen — nicht der helle Ton selbst. Ein
  // helles Emissive wäscht durch Tonemapping genau die Farbe aus, die es betonen soll.
  const emiOf = (seat) => new THREE.Color(seat.body).lerp(new THREE.Color(seat.glow), 0.35);
  function pipTexture(n, seed, bodyHex) {
    const S = P.pipTex, c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d');
    g.fillStyle = bodyHex; g.fillRect(0, 0, S, S);
    let r = seed * 9301 + n * 49297;
    const rnd = () => ((r = (r * 233280 + 49297) % 233280) / 233280);
    g.fillStyle = 'rgba(16,12,10,.94)';
    for (const [px, py] of (PIP_LAYOUT[n] || PIP_LAYOUT[1])) {
      const x = px * S, y = py * S, rr = S * 0.085;
      g.beginPath();
      for (let i = 0; i <= 20; i++) {
        const a = (i / 20) * Math.PI * 2, q = rr * (1 + (rnd() - 0.5) * 0.06);
        const vx = x + Math.cos(a) * q, vy = y + Math.sin(a) * q;
        if (i === 0) g.moveTo(vx, vy); else g.lineTo(vx, vy);
      }
      g.closePath(); g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    allTex.push(t);
    return t;
  }
  function fallbackDie(seat, i) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    allGeo.push(geo);
    const hex = '#' + new THREE.Color(seat.body).getHexString();
    const mats = FACE_PIPS.map((n) => {
      const m = new THREE.MeshStandardMaterial({
        map: pipTexture(n, 7 + i * 13, hex),
      emissive: emiOf(seat), emissiveIntensity: P.glow * 0.5,
        roughness: 0.55, metalness: 0, fog: false,
      });
      allMats.push(m);
      return m;
    });
    const mesh = new THREE.Mesh(geo, mats);
    mesh.frustumCulled = false;
    return { obj: mesh, bodyMats: mats };
  }

  // Ein Sitz: Gruppe für Ort und scheinbare Größe, darin ein Dreher, darin der Körper.
  // Genau die Aufteilung aus rollercoaster-v11 — Größe und Drehung dürfen sich nicht ins Gehege kommen.
  function seatDie(seat, i, build) {
    const grp = new THREE.Group();
    const spinner = new THREE.Group();
    const made = build(seat, i);
    spinner.add(made.obj);
    grp.add(spinner);
    group.add(grp);
    const cosEl = Math.cos(seat.el);
    const az = seat.az + P.azOffset;
    const dir = new THREE.Vector3(Math.sin(az) * cosEl, Math.sin(seat.el), Math.cos(az) * cosEl).normalize();
    const axis = new THREE.Vector3(0.3 + i * 0.21, 1, 0.17 - i * 0.11).normalize();
    return {
      seat, grp, spinner, dir, axis,
      phase: (i / 3) * Math.PI * 2,     // Startphasen gleichmäßig — die Kopplung verteilt sie neu
      omega: seat.base, omegaSm: seat.base,
      // Zero-G: die Drehung wird **fortgeschrieben** (q ⨯ dq je Bild) statt je Bild aus einem Winkel neu
      // gesetzt. Ein gesetzter Winkel springt, sobald sich das Tempo ändert; ein fortgeschriebener kann
      // es nicht — er kennt nur „ein Stück weiter". Dazu wandert die Achse langsam: eine starre Achse
      // liest sich als Motor, eine wandernde als Trudeln im Nichts.
      axisPhase: i * 2.1,
      bodyMats: made.bodyMats,
      squash: 0, tumbleFrom: null, tumbleTo: null,
    };
  }

  for (let i = 0; i < SEATS.length; i++) dice.push(seatDie(SEATS[i], i, fallbackDie));
  ready = true;

  // ---------------------------------------------------------------- das echte Modell nachladen
  // Kein `await` im Aufbau: der Himmel steht sofort, das Modell tauscht den Körper aus, wenn es da ist.
  (async () => {
    try {
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
      const gltf = await new Promise((res, rej) => new GLTFLoader().load(DICE_URL, res, undefined, rej));
      const src = gltf.scene;
      const bb = new THREE.Box3().setFromObject(src);
      const center = bb.getCenter(new THREE.Vector3());
      const size = bb.getSize(new THREE.Vector3());
      const norm = 1 / Math.max(size.x, size.y, size.z, 1e-3);
      for (let i = 0; i < dice.length; i++) {
        const d = dice[i], seat = d.seat;
        const obj = src.clone(true);
        obj.position.copy(center).multiplyScalar(-norm);
        obj.scale.setScalar(norm);        // auf Kantenlänge 1 normiert — die Größe macht der Sitz
        const bodyMats = [];
        obj.traverse((n) => {
          if (!n.isMesh) return;
          // Augen erkennen wie in v11: Materialname oder dunkle Helligkeit. Sie bleiben dunkel —
          // ein Würfel mit leuchtenden Augen und leuchtendem Körper hätte keine Augen mehr.
          const nm = ((n.material && n.material.name) || '').toLowerCase();
          let lum = 1;
          if (n.material && n.material.color) { const h = {}; n.material.color.getHSL(h); lum = h.l; }
          const isEye = nm.includes('black') || lum < 0.25;
          const m = new THREE.MeshStandardMaterial({
            color: isEye ? new THREE.Color(0x0d0b10) : new THREE.Color(seat.body),
            emissive: isEye ? new THREE.Color(0x000000) : emiOf(seat),
            emissiveIntensity: isEye ? 0 : P.glow,
            roughness: isEye ? 0.5 : 0.42, metalness: 0, fog: false,
          });
          n.material = m;
          allMats.push(m);
          if (!isEye) bodyMats.push(m);
        });
        // alten Körper raus, neuen rein — der Sitz und der Dreher bleiben, also auch Phase und Kopplung
        for (const old of d.spinner.children.slice()) d.spinner.remove(old);
        d.spinner.add(obj);
        d.bodyMats = bodyMats.length ? bodyMats : d.bodyMats;
      }
      fromGlb = true;
    } catch (e) {
      console.warn('[sky-dice] Würfelmodell nicht ladbar — eigene Würfel bleiben stehen', e);
    }
  })();

  // ---------------------------------------------------------------- Frame
  const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _q = new THREE.Quaternion();
  const _ax = new THREE.Vector3(), _dq = new THREE.Quaternion();
  const _pos = new THREE.Vector3();
  const _A = new THREE.Vector3(), _B = new THREE.Vector3(), _UP = new THREE.Vector3(0, 1, 0);
  const _ndc = new THREE.Vector3(), _camU = new THREE.Vector3(), _camR = new THREE.Vector3();
  let cx = 0, cy = 0, cz = 0, tt = 0, judge = null, lastCam = null;

  function dirOf(az, el, out) {
    const c = Math.cos(el);
    return out.set(Math.sin(az) * c, Math.sin(el), Math.cos(az) * c);
  }

  // Wohin schaut jeder Würfel? Zwei Betriebsarten, EINE Stelle — sonst hätte die Bahn ihre eigene
  // Wahrheit über den Ort. Die Richtungen werden jedes Bild gerechnet, damit Regler live wirken.
  function placeDirs(dt) {
    if (!P.orbitOn) {
      for (const d of dice) {
        dirOf(P.azOffset + (d.seat.az - Math.PI * 2 / 3) * P.spreadAz, d.seat.el, d.dir).normalize();
      }
      return;
    }
    if (P.orbitAuto) P.orbitPhase = (P.orbitPhase + dt / Math.max(6, P.orbitMin * 60)) % 1;
    // Großkreis durch zwei senkrechte Richtungen: A = Kulmination vor dir, B = Horizont zur Seite.
    // A ⊥ B, weil B waagerecht und 90° im Azimut versetzt ist — deshalb ist die Bahn wirklich ein
    // Kreis und nicht eine Ellipse mit ungleicher Winkelgeschwindigkeit.
    dirOf(P.azOffset, P.orbitEl, _A);
    dirOf(P.azOffset + Math.PI / 2, 0, _B);
    const th0 = P.orbitPhase * Math.PI * 2;
    for (let i = 0; i < dice.length; i++) {
      const th = th0 + i * Math.PI * 2 / 3;
      dice[i].dir.set(0, 0, 0)
        .addScaledVector(_A, Math.cos(th))
        .addScaledVector(_B, Math.sin(th))
        .addScaledVector(_UP, P.orbitLift)
        .normalize();
    }
  }
  let tumble = 0, tumbleT = 0, lastQuarter = -1, beatEnv = 0, lastBeat = 0;

  function verteilung() {
    let minA = 180;
    for (let i = 0; i < 3; i++) {
      const a = dice[i].dir, b = dice[(i + 1) % 3].dir;
      minA = Math.min(minA, Math.acos(Math.max(-1, Math.min(1, a.dot(b)))) * 180 / Math.PI);
    }
    let oben = 0, imBild = 0, ganz = 0;
    // Sichtbarkeit mit AUSDEHNUNG, nicht als Punkt: der halbe Körperdurchmesser wird im Bildraum nach
    // oben, unten, links und rechts abgetragen. Ein Mittelpunkt im Bild beweist nichts — genau daran
    // ist die erste Fassung dieser Zahl gescheitert (sie meldete 3/3, während oben eine Ecke fehlte).
    const rad = P.size * 0.87 * 0.5;
    for (const d of dice) {
      if (d.dir.y > 0) oben++;
      if (!lastCam) continue;
      d.grp.getWorldPosition(_ndc);
      const inFrame = (v) => { const p = _v.copy(v).project(lastCam); return p.z < 1 && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1; };
      const mid = _n.copy(_ndc);
      if (inFrame(mid)) imBild++;
      _camU.setFromMatrixColumn(lastCam.matrixWorld, 1);
      _camR.setFromMatrixColumn(lastCam.matrixWorld, 0);
      let all = true;
      for (const [ax, s] of [[_camU, 1], [_camU, -1], [_camR, 1], [_camR, -1]]) {
        if (!inFrame(_pos.copy(mid).addScaledVector(ax, rad * s))) { all = false; break; }
      }
      if (all) ganz++;
    }
    return {
      mindestwinkel: +minA.toFixed(1),
      ueberHorizont: oben,
      sichtbar: lastCam ? imBild : null,
      ganzImBild: lastCam ? ganz : null,
      winkelradius: +(Math.asin(Math.min(1, rad / P.radius)) * 180 / Math.PI).toFixed(2),
      tageszeit: P.orbitOn ? +P.orbitPhase.toFixed(3) : null,
    };
  }

  function findJudge(camera) {
    if (!camera) return null;
    let best = null, bestDot = -2;
    for (const d of dice) {
      d.spinner.getWorldQuaternion(_q); d.grp.getWorldPosition(_pos);
      _v.copy(camera.position).sub(_pos).normalize();
      for (let f = 0; f < 6; f++) {
        _n.set(FACE_N[f][0], FACE_N[f][1], FACE_N[f][2]).applyQuaternion(_q);
        const dot = _n.dot(_v);
        if (dot > bestDot) { bestDot = dot; best = { die: d.seat.key, pips: FACE_PIPS[f], facing: dot }; }
      }
    }
    return best;
  }

  function roll(strength) {
    const s = strength == null ? 1 : Math.max(0.3, Math.min(2, strength));
    tumble = 1; tumbleT = 0; lastQuarter = -1;
    for (const d of dice) {
      d.quarters = 4 + Math.floor(Math.random() * 7);
      d.tumbleFrom = d.spinner.quaternion.clone();
      d.tumbleTo = new THREE.Quaternion().setFromAxisAngle(d.axis, d.quarters * Math.PI / 2).premultiply(d.tumbleFrom);
    }
    sfx('dice-roll', s);
  }

  function update(dt, camera) {
    tt += dt;
    if (!P.visible) { group.visible = false; return; }
    group.visible = true;
    group.position.set(cx, cy + P.lift, cz);
    if (camera) lastCam = camera;
    placeDirs(dt);

    // Takt: eine Hüllkurve, die schnell anspringt und langsam abfällt — ein roher Pegel wäre ein
    // Flimmern, kein Puls. (Muster aus dem Skydome-Shader: max(env·exp(−k·dt), beat).)
    const raw = P.beatOn ? Math.max(0, Math.min(1.5, beatOf() || 0)) : 0;
    beatEnv = Math.max(beatEnv * Math.exp(-dt * 5.5), raw);
    lastBeat = raw;

    // Zyklische Kopplung als FAKTOR (nie als Summand): jede Rate hängt von den anderen zwei ab, aber
    // das Vorzeichen kann nicht kippen. Zusätzlich weich nachgeführt — ein Sprung im Tempo ist ein
    // Sprung im Bild.
    const ph = [dice[0].phase, dice[1].phase, dice[2].phase];
    for (let i = 0; i < dice.length; i++) {
      const j = (i + 1) % 3, k = (i + 2) % 3;
      const d = dice[i];
      d.omega = d.seat.base * (1 + P.couple * 0.35 * Math.sin(ph[j] - ph[k]));
      d.omegaSm += (d.omega - d.omegaSm) * Math.min(1, dt * 2.2);
      d.phase += dt * Math.PI * 2 * P.spinHz * d.omegaSm * (1 + beatEnv * P.beatSpin) * 6;
    }

    const rolling = tumble > 0;
    if (rolling) {
      tumbleT = Math.min(1, tumbleT + dt / P.tumbleDur);
      const q = Math.floor(tumbleT * 4);
      if (q !== lastQuarter && q < 4) { lastQuarter = q; sfx('dice-tumble', 0.5 + q * 0.16); }
    }
    const ease = rolling ? 1 - Math.pow(1 - tumbleT, 3) : 0;

    for (const d of dice) {
      // Ort: fester Sitz auf der Kugel um den Spieler.
      d.grp.position.copy(d.dir).multiplyScalar(P.radius);
      // Drehung: im Ruhezustand um die eigene Achse mit gekoppelter Phase, beim Wurf das Taumeln.
      if (rolling) {
        d.spinner.quaternion.copy(d.tumbleFrom).slerp(d.tumbleTo, ease);
      } else {
        d.axisPhase += dt * P.drift;
        _ax.set(
          d.axis.x + Math.sin(d.axisPhase) * 0.5,
          d.axis.y + Math.sin(d.axisPhase * 0.61 + 1.3) * 0.35,
          d.axis.z + Math.cos(d.axisPhase * 0.77) * 0.5,
        ).normalize();
        _dq.setFromAxisAngle(_ax, dt * Math.PI * 2 * P.spinHz * d.omegaSm * (1 + beatEnv * P.beatSpin) * 6);
        d.spinner.quaternion.multiply(_dq).normalize();
      }

      // Größe: Grundmaß × Beat-Puls. Squash & Stretch teilt denselben Impuls auf: y länger,
      // x/z schmaler (und umgekehrt) — Cartoon-Kinetik statt Aufblasen.
      const pulse = 1 + beatEnv * P.beatScale + (rolling ? (1 - ease) * 0.12 : 0);
      const sq = beatEnv * P.beatScale * P.beatSquash;
      d.grp.scale.set(P.size * pulse * (1 - sq), P.size * pulse * (1 + sq * 1.4), P.size * pulse * (1 - sq));

      // Leuchten: Atem + Beat-Blitz. Pro Würfel phasenverschoben, damit sie nicht im Chor pulsieren.
      const breathe = 0.78 + 0.22 * Math.sin(tt * Math.PI * 2 * P.pulseHz + d.phase * 0.3);
      const flash = 1 + beatEnv * 1.1 + (rolling ? (1 - ease) * 0.8 : 0);
      const gi = P.glow * breathe * flash;
      for (const m of d.bodyMats) m.emissiveIntensity = gi;
    }

    if (rolling && tumbleT >= 1) {
      tumble = 0;
      for (const d of dice) d.spinner.quaternion.copy(d.tumbleTo);
      sfx('dice-lock', 1);
      judge = findJudge(camera);
      if (judge && api.onJudge) { try { api.onJudge(judge.pips, judge); } catch (e) {} }
    } else {
      judge = findJudge(camera);
    }
  }

  return {
    name: 'sky-dice', group, dice, params: P,
    get onJudge() { return api.onJudge; },
    set onJudge(fn) { api.onJudge = fn; },
    setCenter(x, y, z) { cx = x; cy = y || 0; cz = z; },
    update, roll,
    get rolling() { return tumble > 0; },
    get judge() { return judge; },
    get fromModel() { return fromGlb; },
    setVisible(on) { P.visible = !!on; group.visible = !!on; },
    setParams(o = {}) { Object.assign(P, o); },
    setPalette() {},   // die Würfel tragen ihre eigenen Farben — rot/gelb/blau sind Kanon, keine Laune
    // Abnahme der Verteilung. Drei Zahlen, weil drei Dinge kollidieren:
    //  · `mindestwinkel` — der kleinste paarweise Winkel der drei Richtungen. Für drei Punkte ist 120°
    //    das Maximum; auf einem Großkreis (Hub 0) steht er exakt dort und wandert nicht.
    //  · `ueberHorizont` — wie viele gerade oben sind. Der Preis eines echten Aufgangs: ohne Hub ist
    //    im Mittel genau die Hälfte unten (die Bahn ist symmetrisch), mit Hub mehr.
    //  · `sichtbar` — wie viele wirklich im Bild stehen. **Die Zahl, die zählt** (S60: alle Winkel
    //    waren „ok", im Bild war keiner) — gemessen im Bildraum der echten Kamera, nicht im Modell.
    verteilung,
    // Abnahme: die Kopplung muss man SEHEN können. `spread` ist der Abstand zwischen der schnellsten
    // und der langsamsten Drehung — bei K = 0 ist er konstant (die Grundwerte), mit Kopplung atmet er.
    report() {
      const om = dice.map((d) => d.omega);
      const diffs = [
        Math.abs(((dice[0].phase - dice[1].phase) % (Math.PI * 2))),
        Math.abs(((dice[1].phase - dice[2].phase) % (Math.PI * 2))),
        Math.abs(((dice[2].phase - dice[0].phase) % (Math.PI * 2))),
      ];
      return {
        modell: fromGlb ? 'GLB (Ugur-D6)' : 'eigener Würfel',
      sitze: dice.map((d) => d.grp.position.clone()),
        omega: om, spread: Math.max(...om) - Math.min(...om),
        phasen: diffs,
        beat: lastBeat, beatEnv,
        richter: judge ? judge.pips : null,
        wuerfel: judge ? judge.die : null,
        blick: judge ? judge.facing : null,
        rollt: tumble > 0,
        bereit: ready,
        ...verteilung(),
      };
    },
    dispose() {
      for (const t of allTex) t.dispose();
      for (const m of allMats) m.dispose();
      for (const g of allGeo) g.dispose();
      group.removeFromParent();
    },
  };
}
