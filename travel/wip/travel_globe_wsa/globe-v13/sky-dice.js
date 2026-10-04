// ============================================================================
// sky-dice.js — KFB Travel Globe v3 · Drei Würfel im Himmel (Kugelfassung)
// ----------------------------------------------------------------------------
// Port aus `terrain-v17/sky-dice.js` (Slice S60c). Kanon bleibt Kanon: drei Würfel, rot · gelb ·
// blau, 120° im Azimut auseinander, jeder mit eigener Drehung, und **King Kayfabian ist der
// rotierende Richter** — Recht spricht die Fläche, die der Kamera am direktesten gegenübersteht.
// Modell aus dem Repo, Notfall-Würfel mit gestempelten Augen, solange (oder falls) es nicht kommt.
//
// **Was die Kugel ändert — und nur das:**
//  1. **Die Sitze rechnen im TANGENTIALRAHMEN**, nicht um die Welt-Y-Achse. `setFrame(up, north,
//     east)` bekommt jedes Bild den Rahmen des Standorts; Azimut 0 zeigt nach Norden, die Höhe
//     ist der Winkel über der Tangentialebene. Damit hängt der Himmel am ORT, nicht an einer
//     Welt-Achse, die auf einer Kugel nichts bedeutet.
//  2. **Maßstab.** v17 fliegt in einer Ebene mit Abstand 360 und Kantenlänge 32 (Winkelradius
//     2,2°). Hier ist der Kugelradius 5, die Karte 0,075 breit — also Abstand 2,2 und Größe 0,20:
//     Winkelradius asin(0,10/2,2) = 2,6°. Fast dieselbe scheinbare Größe, gerechnet statt geraten.
//  3. **Die Höhenwinkel liegen höher als in v17** (10°…15° statt 3°…5°). Grund ist die Krümmung:
//     bei 2,2 u Abstand fällt die Kugeloberfläche um d²/2R = 0,48 u weg. Ein Sitz auf 3° stünde
//     damit fast auf der Horizontlinie, hinter Bergen von 0,52 u Höhe. Auf 12° liegt er ~0,45 u
//     über der Tangentialebene und damit klar über dem Relief — dieselbe Messung wie am 26.7.,
//     nur mit der Krümmung als zusätzlichem Term.
//  4. **Beat und Bahn (`orbit`) sind draußen.** Hier gibt es keinen Takt-Geber; die Bahn war in
//     v17 Standard AUS und bleibt es. Was fehlt, fehlt sichtbar — nicht als toter Code.
//
// Kopplung 1:1 übernommen: ω_i = base_i · (1 + K·0,35·sin(φ_j − φ_k)) als FAKTOR, nie als
// Summand — sonst kippt die Drehrichtung und sieht wie ein Fehler aus statt wie ein Gesetz.
// ============================================================================

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const DICE_URL = RAW + 'media/3D_Assets/dice_ugur_lowpoly.glb';

const SEATS = [
  { key: 'rot',  az: 0.0,             el: 0.21, body: 0xc22d12, glow: 0xff6a3a, base: 0.16 },
  { key: 'gelb', az: Math.PI * 2 / 3, el: 0.26, body: 0xd99a08, glow: 0xffd166, base: 0.11 },
  { key: 'blau', az: Math.PI * 4 / 3, el: 0.18, body: 0x1f5793, glow: 0x74baff, base: 0.13 },
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

/* v10 · Das Augen-Relief, achsentreu. Begründung an der Aufrufstelle (Suche: „herausgedrückt").
   Einmal je Geometrie — geklonte Würfel teilen sie sich. */
const _reliefFertig = new WeakSet();
function reliefBacken(geo, relief) {
  if (!geo || !geo.attributes || !geo.attributes.position || _reliefFertig.has(geo)) return;
  _reliefFertig.add(geo);
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const cx = (bb.min.x + bb.max.x) * 0.5, cy = (bb.min.y + bb.max.y) * 0.5, cz = (bb.min.z + bb.max.z) * 0.5;
  // Der Hub ist derselbe, den die alte Skalierung einem Flächenmitten-Auge gegeben hätte:
  // (relief − 1) × halbe Ausdehnung. Damit ändert sich das BILD nicht, nur die Richtung.
  const halb = Math.max(bb.max.x - cx, bb.max.y - cy, bb.max.z - cz);
  const d = (relief - 1) * halb;
  const a = geo.attributes.position.array;
  for (let i = 0; i < a.length; i += 3) {
    const x = a[i] - cx, y = a[i + 1] - cy, z = a[i + 2] - cz;
    const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z);
    if (ax >= ay && ax >= az) a[i] += Math.sign(x) * d;
    else if (ay >= az) a[i + 1] += Math.sign(y) * d;
    else a[i + 2] += Math.sign(z) * d;
  }
  geo.attributes.position.needsUpdate = true;
  geo.computeBoundingSphere();
}

export function createSkyDice(opts = {}) {
  const THREE = opts.THREE;
  const sfx = opts.sfx || (() => {});
  const P = Object.assign({
    radius: 2.2,      // Abstand vom Spieler (siehe Kopf: gerechnet, nicht geraten)
    size: 0.05,       // scheinbare Kantenlänge in Weltmaß
    // v3 · S7 (Georg, 29.8.): „die Würfel sind zu groß und wirken wie dunkle Gebäude ·
    // Würfelaugen sehe ich nicht". Gemessen war beides:
    //  · 0,11 Kantenlänge neben einer 0,08 breiten Karte — als KöRPER liest das viel größer als
    //    eine Platte. Jetzt 0,07, etwa Pet-Maß; die Großzügigkeit trägt `pickupRadius`, nicht
    //    die Silhouette.
    //  · Die Augen sind ein eigenes Mesh (GLB `Dice-Mesh_1`), Farbe #0d0b10 = **L 0,00**, auf
    //    einem Körper von L 0,15 (blau) bis 0,35 (gelb). Schwarz auf Dunkel bei 0,07 Weltmaß
    //    ist kein Auge, das ist Schmutz. Und L 0,15 ist genau der Fall, für den in S3i schon
    //    eine Regel steht: fast-schwarze Materialien werden gehoben.
    // Kanon bleibt Kanon: HUE und SÄTTIGUNG der drei Würfel sind unverändert, nur die HELLIGKEIT
    // wird auf `bodyLift` gezogen. `bodyLift: 0` ist der Rückweg auf die reinen Kanon-Farben.
    bodyLift: 0.26,
    // Verlauf dieser Zahl, als Beispiel für Whack-a-Mole: 0,50 (zu hell) → 0,44 (noch zu hell)
    // → **0,26**. Erst der dritte Wert ist begründet statt geraten: seit S9d liegt die WELT bei
    // Albedo 0,24–0,38, und seit S9c antwortet der Würfel auf dasselbe Licht wie sie. Kanon-Blau
    // (L 0,15) liest jetzt nicht mehr als Loch, weil daneben kein weißer Sand mehr steht.
    // Die zwei Korrekturen davor waren nicht falsch gerechnet — sie beantworteten die falsche Frage.
    pipHex: 0xf2e8d0,   // Papiercreme statt Schwarz — dieselbe Farbwelt wie die Karten
    pipRelief: 1.045,   // Augen radial nach außen — bündige Pips sind bei diesem Maßstab unsichtbar
    pipGlow: 0.85,      // Eigenglut der Augen: sie sollen auch bei Nacht die Augenzahl verraten
    spreadAz: 1,      // 1 = die kanonischen 120°
    lift: 0,
    spinHz: 0.13,
    couple: 0,        // K — Standard aus (v17: die Drehung ruckelte damit)
    drift: 0.06,
    glow: 0.10,
    // ⚠ Die Eigenglut steht ZUSÄTZLICH auf der gehobenen Helligkeit. Sie war 0,22, und zusammen
    // mit `bodyLift` 0,50 addierte sich beides zu dem Neongelb im Screenshot. Bei Nacht sollen die
    // Würfel gefunden werden, nicht selbst Lichtquelle sein: die Augen tragen die Lesbarkeit
    // (`pipGlow`), der Körper nur seine Farbe.
    pulseHz: 0.32,
    tumbleDur: 2.2,
    respawnDelay: 6,      // Sekunden, die ein getroffener Würfel wegbleibt
    pickupRadius: 1.8,    // Trefferfenster als Vielfaches der Würfelgröße (wie passRadius bei den Karten)
    // ⚠ **`pickupPad` ist ABSICHTLICH unabhängig von `size` — und das ist keine Feinheit, sondern
    // die Reparatur eines Fehlers, den ich zweimal gemacht habe.** Der Zuschlag ist eine
    // Körperkontakt-Zugabe („berührt mein Fahrzeug den Würfel, ist es ein Treffer") und hängt
    // damit am AVATAR, nicht am Würfel. Würde er mitskalieren, würde jede Größenänderung das
    // Trefferfenster still mitziehen — genau das ist passiert:
    //   0,11 → 0,07 machte das Fenster 0,198 → 0,126 (behoben mit dem Zuschlag 0,038)
    //   0,07 → 0,05 machte es 0,164 → 0,128 — IN DERSELBEN RUNDE, in der ich die Lehre
    //   „wer eine Größe ändert, muss jede Schwelle nachrechnen, die relativ auf ihr sitzt"
    //   aufgeschrieben habe.
    // Deshalb trägt der Zuschlag jetzt die GANZE Großzügigkeit: eine volle Avatarbreite (0,075).
    // Fenster bei size 0,05: 0,05 · 1,8 + 0,075 = **0,165** — unabhängig davon bleibend, wie klein
    // der Würfel noch wird. Die Silhouette darf schrumpfen, die Reichweite nicht.
    pickupPad: 0.075,
    // ── v3 · S7 · **Die Würfel schweben IN DER WELT, nicht am Spieler** ──────────────────
    // Georg, 29.8.: „die Würfel sollen auch animiert in der Luft floaten, hatte ich gesagt…?"
    // — er hatte, in S6d: „auf Flughöhe schwebend, langsam um ihre Position drehend".
    // Gelesen, was gebaut war: `group.position.copy(center)` und
    // `d.grp.position = d.dir · radius` — **jedes Bild neu, relativ zum Spieler.** Die drei
    // Würfel waren also ein 3D-HUD: sie fliegen mit, deshalb schweben sie nie. In v17 ist das
    // richtig (dort sind sie König Kayfabians Sitze), als PICKUP ist es falsch.
    // Jetzt: beim Erscheinen wird EINMAL ein Weltort gesetzt (Tangentialrahmen, Höhenband über
    // Grund — dieselbe Rechnung wie `sky-cards.place`), danach bleibt der Würfel dort und
    // schwebt um seinen Ort. `world: false` ist der Rückweg auf die v17-Sitze.
    world: true,
    // ⚠ **DAS HÖHENBAND WAR DER EIGENTLICHE FEHLER** (Georg, 29.8.: „dice stecken teilweise in
    // terrain", „viel zu groß", „kaum als cube zu erkennen"). Gemessen: die Würfel saßen 0,04–0,08
    // über Grund, während das Pet auf 0,12 fliegt. Man flog also DARÜBER, sah sie von oben halb im
    // Hang stecken — und weil sie dabei dicht an der Kamera vorbeizogen, wirkten sie riesig,
    // obwohl sie mit 0,108 nur wenig größer als das Pet (0,075) waren. Drei Befunde, eine Ursache.
    // Ich hatte das Band von den KARTEN kopiert (0,005…0,045) — aber Karten sind Platten, die man
    // von der Seite durchfliegt, Würfel sind Körper, die man auf Augenhöhe treffen soll. Georgs
    // Wort in S6d war „auf Flughöhe schwebend", und genau das steht jetzt hier.
    hMin: 0.085, hMax: 0.165,   // Höhenband ÜBER GRUND, um die Reise-Flughöhe (≈ 0,12) herum
    ringJit: 0.5,               // Streuung des Abstands beim Setzen
    // Schweben und Drehen sind RELATIV zur Größe gedacht: ein Bob von 0,014 ist an einem 0,05
    // großen Würfel ein Drittel Kantenlänge (deutlich), an einem 0,2 großen ein Zucken.
    bob: 0.022, bobHz: 0.34,    // Schweben längs der Standortnormale
    sway: 0.014, swayHz: 0.21,  // seitliches Wandern in der Tangentialebene
    recycleDist: 3.2,           // weiter dahinter: neu setzen, damit man wieder welche trifft
    // ── v3 · S7e · Die Treffer-Reaktion: Hartgummi-Würfel ──────────────────────────
    // Ballistik in EINER Zahl je Bild (Höhe über der Ruhelage), nicht als Vektorphysik: der Wurf
    // ist senkrecht, also ist er eindimensional. Alles andere wäre Aufwand ohne Bild.
    kickV0: 1.15,       // Startgeschwindigkeit nach OBEN (Weltmaß/s) — sichtbar im Flug
    kickG: 2.6,         // Fallbeschleunigung
    kickFloat: 0.34,    // Schwerkraft-Anteil im Scheitel („kurz floaten") — 0,34 = ein Drittel
    kickFloatBand: 0.34, // wie nah am Scheitel der Float greift (Anteil von v0)
    kickBounce: 0.52,   // Restitution — Hartgummi: hoch und kurz
    kickBounces: 3,     // danach liegt er, und die Sperre läuft
    kickSpin: 5.5,      // Zusatzdrehung beim Wurf (Vielfaches der Ruhe-Drehrate)
    kickStretch: 0.20,  // Streckung längs der Flugachse bei voller Geschwindigkeit
    kickSquash: 0.24,   // Quetschung beim Aufprall
    // ⚠ Waren 0,42 / 0,46 — das ist Trickfilm-Extrem und an einem Würfel falsch: ein Würfel ist
    // erkennbar, WEIL er kantig und gleichseitig ist. Wird er zum Riegel, verliert er seine
    // Identität, und der Effekt frisst den Gegenstand. Hartgummi verformt sich WENIG und
    // schnell — die Härte liegt in der Kurve, nicht im Betrag.
    kickSquashDamp: 9.0, // wie schnell die Quetschung ausläuft (1/s)
    kickNah: 0.09,      // Bodennähe in Weltmaß, innerhalb der überhaupt verformt wird (≈ 2 Kanten)
    visible: true,
    pipTex: 256,
  }, opts.params || {});

  const api = { onJudge: null, onBounce: null };
  const group = new THREE.Group();
  group.frustumCulled = false;

  const dice = [];
  let fromGlb = false;
  const allTex = [], allMats = [], allGeo = [];
  const emiOf = (seat) => new THREE.Color(seat.body).lerp(new THREE.Color(seat.glow), 0.35);
  /** Kanon-Farbe mit gehobener Helligkeit — HSL, damit Hue und Sättigung stehen bleiben. */
  const bodyOf = (seat) => {
    const c = new THREE.Color(seat.body);
    if (P.bodyLift > 0) {
      const h = {}; c.getHSL(h);
      const l = Math.max(h.l, P.bodyLift);
      // ⚠ **Nur Helligkeit heben ergibt NEON** (Georg, 29.8.: „die Würfel sind jetzt zu hell").
      // Der gelbe Würfel liegt bei S 1,00 / L 0,35; auf L 0,50 gezogen ist das reines Signalgelb —
      // bei Nacht war es endlich lesbar, bei Tag leuchtet es aus dem Bild heraus.
      // Der Grund ist Farbenlehre, nicht Geschmack: **Sättigung und Helligkeit sind gemeinsam der
      // Regler für „leuchtet".** Wer eine gesättigte Farbe aufhellt, ohne Sättigung abzugeben,
      // bekommt Leuchtstoff. Papier hat helle, WENIGER gesättigte Töne — deshalb wird hier je
      // gehobenem Helligkeitsschritt Sättigung abgegeben. Hue bleibt unangetastet: der Kanon sagt
      // welche FARBE, nicht wie grell.
      const gabe = Math.max(0, l - h.l);
      c.setHSL(h.h, Math.max(0.35, h.s - gabe * 1.5), l);
    }
    return c;
  };

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
    const hex = '#' + bodyOf(seat).getHexString();
    const mats = FACE_PIPS.map((n) => {
      // S9c · **Phong, nicht Standard.** Die Welt ist Phong (quellentreu, Globe.ts 519). Ein
      // PBR-Würfel in einer Phong-Welt war der Grund, warum er erst „dunkel wie ein Gebäude" und
      // nach dem Aufhellen „neon" aussah: er bekam als einziger `scene.environment` dazu und
      // antwortete auf dieselben sieben Lichter völlig anders (§6j). Kein Konverter nötig — hier
      // entsteht das Material, also entsteht es richtig.
      const m = new THREE.MeshPhongMaterial({
        map: pipTexture(n, 7 + i * 13, hex),
        shininess: 8, specular: new THREE.Color(0x111111),
        emissive: emiOf(seat), emissiveIntensity: P.glow * 0.5,
        // ⚠ Hier standen `roughness: 0.55, metalness: 0` — Reste des MeshStandardMaterial, das
        // dieser Konstruktor bis zum 29.8. war. Phong kennt beide nicht: three warf sie still weg
        // und meldete es 36× in die Konsole (6 Flächen × 3 Würfel × 2 Eigenschaften).
        // Der Kommentar oben behauptete „hier entsteht das Material, also entsteht es richtig" —
        // und drei Zeilen tiefer stand der Widerspruch. **Ein Materialwechsel ist nicht der Wechsel
        // des Klassennamens, sondern der Wechsel des Eigenschaftssatzes.**
        // Das matte Aussehen kommt jetzt allein aus `shininess: 8` und dem dunklen `specular` —
        // das ist der Quellwert (Globe.ts 520), nicht ein Ersatz für `roughness`.
        fog: false,
      });
      allMats.push(m);
      return m;
    });
    const mesh = new THREE.Mesh(geo, mats);
    mesh.frustumCulled = false;
    return { obj: mesh, bodyMats: mats };
  }

  function seatDie(seat, i, build) {
    const grp = new THREE.Group();
    const spinner = new THREE.Group();
    const made = build(seat, i);
    spinner.add(made.obj);
    grp.add(spinner);
    group.add(grp);
    return {
      seat, grp, spinner,
      dir: new THREE.Vector3(0, 1, 0),
      axis: new THREE.Vector3(0.3 + i * 0.21, 1, 0.17 - i * 0.11).normalize(),
      phase: (i / 3) * Math.PI * 2,
      omega: seat.base, omegaSm: seat.base,
      axisPhase: i * 2.1, aus: 0,
      home: new THREE.Vector3(), anchored: false, bobPh: i * 2.0,
      // v3 · S7e · Treffer-Reaktion (Hartgummi-Wurf). `hUp` ist die Höhe ÜBER der Ruhelage — eine
      // Zahl, weil der Wurf senkrecht ist.
      kick: 0, kickT: 0, vUp: 0, hUp: 0, bounces: 0, squash: 0, kickSpin: 0,
      bodyMats: made.bodyMats,
      tumbleFrom: null, tumbleTo: null, quarters: 0,
    };
  }
  for (let i = 0; i < SEATS.length; i++) dice.push(seatDie(SEATS[i], i, fallbackDie));

  // Das echte Modell nachladen — kein `await` im Aufbau: der Himmel steht sofort.
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
        obj.scale.setScalar(norm);
        const bodyMats = [];
        obj.traverse((n) => {
          if (!n.isMesh) return;
          const nm = ((n.material && n.material.name) || '').toLowerCase();
          let lum = 1;
          if (n.material && n.material.color) { const h = {}; n.material.color.getHSL(h); lum = h.l; }
          const isEye = nm.includes('black') || lum < 0.25;
          // S9c · Phong wie die Welt (siehe Kommentar am eigenen Würfel oben).
          const m = new THREE.MeshPhongMaterial({
            color: isEye ? new THREE.Color(P.pipHex) : bodyOf(seat),
            emissive: isEye ? new THREE.Color(P.pipHex).multiplyScalar(0.6) : emiOf(seat),
            emissiveIntensity: isEye ? P.pipGlow : P.glow,
            shininess: 8, specular: new THREE.Color(0x111111), fog: false,
          });
          n.material = m;
          // ⚠ **Die Augen waren die ganze Zeit da — nur flach** (Georg, dreimal: „keine
          // würfelaugen"). Gemessen: eigenes Mesh, Papiercreme L 0,76, Bounding Box 0,80 gegen
          // 0,94 Korpus — also Pips auf allen sechs Flächen, korrekt gefärbt, aber BÜNDIG mit der
          // Oberfläche. Eine bündige Farbfläche von wenigen Hundertsteln Weltmaß hat bei
          // Streiflicht keinen eigenen Ton: sie verschwindet im Korpus.
          // Also bekommen sie **Relief**. Erste Fassung war `n.scale.setScalar(pipRelief)` —
          // radial vom Ursprung. Das war falsch, und Georg hat es beim Nahflug gesehen (2.9.:
          // „die Würfelaugen werden aus dem Cube herausgedrückt").
          // ⚠ **Warum eine radiale Skalierung an einem WÜRFEL nicht Relief ist, sondern Rutschen:**
          // ein Skalar bewegt jeden Punkt entlang seines Ortsvektors. Für ein Auge in der
          // Flächenmitte zeigt der Vektor genau nach außen — das ist Relief. Für ein Eckauge
          // (die 6 sitzt bei 0,3/0,24) zeigt er SCHRÄG: der Anteil senkrecht zur Fläche hebt es
          // heraus, der Anteil IN der Fläche schiebt es zur Kante. Bei 4,5 % sind das gut 2 % der
          // halben Kantenlänge in der Fläche — aus der Ferne unsichtbar, im Nahflug hängt das
          // Auge über der Kante und liest wie herausgedrückt. Der Fehler war nicht der Betrag,
          // sondern die RICHTUNG.
          // Jetzt wandert jeder Vertex nur entlang SEINER eigenen dominanten Achse, also entlang
          // der Normalen der Fläche, auf der sein Auge liegt. Gleicher Hub, kein Seitwärts.
          // Gebacken in die Geometrie, nicht in den Knoten: `clone(true)` teilt die Geometrie
          // zwischen allen drei Würfeln, der WeakSet-Riegel backt sie deshalb genau einmal.
          // `pipRelief: 1` ist der Rückweg auf das unveränderte Modell.
          if (isEye && P.pipRelief !== 1) reliefBacken(n.geometry, P.pipRelief);
          allMats.push(m);
          if (!isEye) bodyMats.push(m);
        });
        for (const old of d.spinner.children.slice()) d.spinner.remove(old);
        d.spinner.add(obj);
        d.bodyMats = bodyMats.length ? bodyMats : d.bodyMats;
      }
      fromGlb = true;
    } catch (e) {
      console.warn('[sky-dice] Würfelmodell nicht ladbar — eigene Würfel bleiben stehen', e);
    }
  })();

  const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _q = new THREE.Quaternion();
  const _ax = new THREE.Vector3(), _dq = new THREE.Quaternion(), _pos = new THREE.Vector3();
  // v3 · S7e · Für den Cartoon-Deformer: die Wurfachse ist die Standortnormale, nicht Welt-Y.
  const _Y = new THREE.Vector3(0, 1, 0), _kq = new THREE.Quaternion();
  const _bv = new THREE.Vector3();   // v3 · S7f · Aufprallgeschwindigkeit für die Steinchen-Meldung
  const _up = new THREE.Vector3(0, 1, 0), _north = new THREE.Vector3(0, 0, -1), _east = new THREE.Vector3(1, 0, 0);
  const center = new THREE.Vector3();
  // v3 · S7 · Kugel und Boden für die Weltverankerung (wie in `sky-cards`).
  const sph = { R: 5, altAt: null, keepOut: null, fwd: new THREE.Vector3(0, 0, -1) };
  const _home = new THREE.Vector3();
  let tt = 0, judge = null, lastCam = null, tumble = 0, tumbleT = 0, lastQuarter = -1;

  /** Sitzrichtung im Tangentialrahmen: Azimut ab Norden, Höhe über der Tangentialebene. */
  function placeDirs() {
    for (const d of dice) {
      const az = (d.seat.az - Math.PI * 2 / 3) * P.spreadAz;
      const c = Math.cos(d.seat.el);
      d.dir.set(0, 0, 0)
        .addScaledVector(_north, Math.cos(az) * c)
        .addScaledVector(_east, Math.sin(az) * c)
        .addScaledVector(_up, Math.sin(d.seat.el) + P.lift)
        .normalize();
    }
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

  /** v3 · S7 · EINEN Weltort für diesen Würfel setzen — Azimut im Tangentialrahmen mit
   *  Vorwärts-Bias (man soll sie vor sich finden, nicht suchen), Abstand als BOGEN, Höhe über
   *  GRUND. Dieselbe Rechnung wie `sky-cards.place`, damit es nicht zwei Platzierungslogiken gibt. */
  function anchor(d) {
    // ⚠ Ohne gültigen Tangentialrahmen würde hier ein Nullvektor normalisiert — das ergibt NaN in
    // der Weltposition, und NaN breitet sich lautlos durch Bounding-Spheres und Culling aus.
    // Also: nicht verankern, sondern warten. Der Frame-Loop setzt den Rahmen, und der nächste
    // `update()` holt es nach.
    if (_up.lengthSq() < 0.5) return false;
    // v3 · S7h · Bis zu sechs Versuche, wenn der Platz gesperrt ist (Landmarken — siehe
    // `setKeepOut`). Ein Treffer ist billiger als ein Würfel auf einem Schlossdach.
    for (let versuch = 0; versuch < 6; versuch++) {
      if (setzen(d)) return true;
    }
    setzen(d, true);
    return true;
  }

  function setzen(d, erzwingen) {
    const base = Math.atan2(sph.fwd.dot(_east), sph.fwd.dot(_north));
    const az = base + (d.seat.az - Math.PI * 2 / 3) * P.spreadAz + (Math.random() - 0.5) * 0.9;
    const r = P.radius + (0.5 + Math.random() * 0.5) * P.ringJit;
    _home.copy(_up)
      .addScaledVector(_north, Math.cos(az) * r / sph.R)
      .addScaledVector(_east, Math.sin(az) * r / sph.R)
      .normalize();
    // v3 · S7h · Gesperrter Platz? Neu würfeln. Der Würfel soll auf ERREICHBARER Höhe schweben,
    // und über einem Schloss (0,22 hoch) wäre er das nicht — siehe `setKeepOut`.
    if (!erzwingen && sph.keepOut && sph.keepOut(_home.x, _home.y, _home.z)) return false;
    const boden = sph.altAt ? Math.max(0, sph.altAt(_home.x, _home.y, _home.z)) : 0;
    const h = P.hMin + Math.random() * (P.hMax - P.hMin);
    d.homeH = h;      // v3 · S7e · Höhe ÜBER GRUND — der Wurf braucht sie, um den Boden zu finden
    d.home.copy(_home).multiplyScalar(sph.R + boden + 0.03 + h);
    d.bobPh = Math.random() * Math.PI * 2;
    d.anchored = true;
    return true;
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
    // Weltmodus: die Gruppe steht im Weltnullpunkt, jeder Würfel trägt seinen eigenen Ort.
    group.position.set(0, 0, 0);
    if (!P.world) group.position.copy(center);
    if (camera) lastCam = camera;
    placeDirs();

    const ph = [dice[0].phase, dice[1].phase, dice[2].phase];
    for (let i = 0; i < dice.length; i++) {
      const j = (i + 1) % 3, k = (i + 2) % 3, d = dice[i];
      d.omega = d.seat.base * (1 + P.couple * 0.35 * Math.sin(ph[j] - ph[k]));
      d.omegaSm += (d.omega - d.omegaSm) * Math.min(1, dt * 2.2);
      d.phase += dt * Math.PI * 2 * P.spinHz * d.omegaSm * 6;
    }

    const rolling = tumble > 0;
    if (rolling) {
      tumbleT = Math.min(1, tumbleT + dt / P.tumbleDur);
      const q = Math.floor(tumbleT * 4);
      if (q !== lastQuarter && q < 4) { lastQuarter = q; sfx('dice-tumble', 0.5 + q * 0.16); }
    }
    const ease = rolling ? 1 - Math.pow(1 - tumbleT, 3) : 0;

    for (const d of dice) {
      if (d.aus > 0) {
        d.aus -= dt;
        // Nach der Sperre erscheint der Würfel an einem NEUEN Ort vor dem Spieler — sonst
        // taucht er dort wieder auf, wo man schon war.
        if (d.aus <= 0) { d.aus = 0; if (P.world) anchor(d); d.grp.visible = true; }
      }
      if (P.world) {
        if (!d.anchored) anchor(d);
        // Zu weit hinter dem Spieler: neu setzen. Ohne das fliegt man aus dem Würfelfeld heraus.
        // ⚠ Nicht während eines Wurfs — ein laufendes Ereignis wird nicht umgesiedelt.
        else if (!d.kick && d.grp.visible && d.home.distanceTo(center) > P.recycleDist) {
          _v.copy(d.home).sub(center);
          if (_v.lengthSq() > 1e-9 && _v.normalize().dot(sph.fwd) < -0.15) anchor(d);
        }
        // ── v3 · S7e · Der Wurf: senkrecht hoch, floaten, auf den Boden bouncen ───────────
        if (d.kick) {
          d.kickT += dt;
          // **Float im Scheitel:** nahe v = 0 wird die Schwerkraft gedämpft. Das ist der
          // Animator-Trick für „kurz floaten" — keine zweite Phase, nur ein Faktor auf g, und
          // genau deshalb bleibt der Bogen stetig statt zu stocken.
          const nahScheitel = Math.abs(d.vUp) < P.kickV0 * P.kickFloatBand;
          d.vUp -= P.kickG * (nahScheitel ? P.kickFloat : 1) * dt;
          d.hUp += d.vUp * dt;
          // Der Boden liegt unter der Ruhelage: der Würfel schwebt auf Flughöhe, fällt also
          // durch sie hindurch bis aufs Gelände.
          const bodenH = -(d.homeH || P.hMin) + P.size * 0.5;
          if (d.hUp <= bodenH && d.vUp < 0) {
            d.hUp = bodenH;
            d.bounces++;
            d.squash = 1;
            // v3 · S7f · Steinchen am Aufprallort. Das Modul kennt `impact-dust` NICHT — es meldet
            // nur „hier, so schnell, so orientiert". Wer daraus Partikel macht, entscheidet der
            // Runner; sonst hängt der Port an einem Effekt.
            if (api.onBounce) {
              _pos.copy(d.grp.position);
              _bv.copy(_up).multiplyScalar(d.vUp);
              try { api.onBounce(_pos, _up, _bv, d.bounces); } catch (e) {}
            }
            if (d.bounces >= P.kickBounces || Math.abs(d.vUp) < 0.12) {
              // Er liegt. Ab jetzt die Sperre — und danach erscheint er vor dem Spieler neu.
              // ⚠ **`squash` MUSS hier zurückgesetzt werden.** Genau das fehlte, und der Screenshot
              // vom 29.8. hat es bewiesen: der Würfel war ein flacher Riegel im Verhältnis 2,5:1 —
              // und 1/(1−0,46) ÷ (1−0,46) = **2,5**. Das ist kein ähnlicher Wert, das ist genau
              // `squash = 1`. Ursache: der Abbau von `squash` stand INNERHALB von `if (d.kick)`,
              // und der letzte Bounce setzt `d.kick = 0`. Der Abbau lief also nie wieder, `squash`
              // blieb auf 1, und nach dem Neusetzen war der Würfel dauerhaft platt — auch im
              // frontalen Anflug, weil es nichts mit der Perspektive zu tun hatte.
              // Fehlerklasse: **wer eine Größe in einem Zweig abbaut, muss sie in DEMSELBEN Zweig
              // beenden, der den Zweig schließt.** Der Abbau steht jetzt zusätzlich außerhalb.
              d.kick = 0; d.vUp = 0; d.squash = 0; d.kickSpin = 0;
              d.grp.quaternion.identity();
              d.grp.scale.setScalar(P.size);
              d.aus = P.respawnDelay;
              d.grp.visible = false;
            } else {
              d.vUp = -d.vUp * P.kickBounce;
              sfx('dice-tumble', 0.4 + d.bounces * 0.2);
            }
          }
          if (d.squash > 0) d.squash = Math.max(0, d.squash - dt * P.kickSquashDamp);
          d.kickSpin = Math.max(0, 1 - d.kickT / 1.6);
          d.grp.position.copy(d.home).addScaledVector(_up, d.hUp);
        } else {
          // Zweite Sicherung gegen genau den Fehler oben: auch ohne laufenden Wurf läuft der
          // Abbau. Ein Zustand, der nur in einem Zweig abgebaut wird, bleibt stehen, sobald der
          // Zweig schließt — und dann sieht man ihn für immer.
          if (d.squash > 0) d.squash = Math.max(0, d.squash - dt * P.kickSquashDamp);
          // **Das Schweben:** Bob längs der Standortnormale, dazu ein langsames seitliches Wandern
          // in der Tangentialebene. Drei inkommensurable Frequenzen, damit es sich nicht wiederholt.
          const w = tt * Math.PI * 2, p = d.bobPh;
          d.grp.position.copy(d.home)
            .addScaledVector(_up, Math.sin(w * P.bobHz + p) * P.bob)
            .addScaledVector(_north, Math.sin(w * P.swayHz * 0.73 + p * 1.7) * P.sway)
            .addScaledVector(_east, Math.cos(w * P.swayHz + p * 1.3) * P.sway);
        }
      } else {
        d.grp.position.copy(d.dir).multiplyScalar(P.radius);
      }
      if (rolling) {
        d.spinner.quaternion.copy(d.tumbleFrom).slerp(d.tumbleTo, ease);
      } else {
        d.axisPhase += dt * P.drift;
        _ax.set(
          d.axis.x + Math.sin(d.axisPhase) * 0.5,
          d.axis.y + Math.sin(d.axisPhase * 0.61 + 1.3) * 0.35,
          d.axis.z + Math.cos(d.axisPhase * 0.77) * 0.5,
        ).normalize();
        _dq.setFromAxisAngle(_ax, dt * Math.PI * 2 * P.spinHz * d.omegaSm * 6
                                  * (1 + (d.kick ? P.kickSpin * d.kickSpin : 0)));
        d.spinner.quaternion.multiply(_dq).normalize();
      }
      const pulse = 1 + (rolling ? (1 - ease) * 0.12 : 0);
      // ── v3 · S7e · Der Cartoon-Deformer ───────────────────────────────────────
      // ⚠ **Zweimal falsch gebaut, und beide Male hat Georg es im Bild gesehen.**
      //  (a) `squash` wurde nur INNERHALB von `if (d.kick)` abgebaut, und der letzte Bounce setzt
      //      `kick = 0` — der Würfel blieb für immer ein Riegel 2,5:1. Behoben oben.
      //  (b) Die Streckung hängte an der GESCHWINDIGKEIT, also war der Würfel den ganzen Flug über
      //      verformt: „die Würfel sind immer noch weit vor Kontakt bereits deformiert".
      //      Das ist animatorisch falsch, nicht nur zu stark. **Squash & Stretch gehören an den
      //      KONTAKT** — Anlauf, Aufprall, Abstoß. Ein Gummiwürfel in freier Flugbahn ist ein
      //      Würfel; er verformt sich, wenn ihn etwas verformt. Deshalb steuert jetzt allein die
      //      Bodennähe: innerhalb `kickNah` über dem Boden gibt es Streckung (aufwärts wie
      //      abwärts — das ist Anlauf und Abstoß), darauf die Quetschung des Aufpralls.
      //      Über der Zone: unverformt. Der Rest des Wurfs erzählt über Drall und Bogen.
      const nahBoden = d.kick
        ? Math.max(0, 1 - Math.abs(d.hUp - (-(d.homeH || P.hMin) + P.size * 0.5)) / P.kickNah)
        : 0;
      if (d.squash > 0 || nahBoden > 0) {
        const stretch = nahBoden * Math.min(1, Math.abs(d.vUp) / Math.max(0.01, P.kickV0)) * P.kickStretch;
        const s = 1 + stretch - d.squash * P.kickSquash;
        const q = 1 / Math.sqrt(Math.max(0.2, s));
        _kq.setFromUnitVectors(_Y, _up);
        d.grp.quaternion.copy(_kq);
        d.grp.scale.set(P.size * pulse * q, P.size * pulse * s, P.size * pulse * q);
      } else {
        d.grp.quaternion.identity();
        d.grp.scale.setScalar(P.size * pulse);
      }
      const breathe = 0.78 + 0.22 * Math.sin(tt * Math.PI * 2 * P.pulseHz + d.phase * 0.3);
      const gi = P.glow * breathe * (rolling ? 1 + (1 - ease) * 0.8 : 1);
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

  /**
   * Durchflug-Treffer: liegt `pos` innerhalb von `radius` um einen Würfel, kommt die Augenzahl
   * der Fläche zurück, die der FLUGRICHTUNG am direktesten gegenübersteht (Georgs Regel:
   * „Impact-Seite"). Dieselbe Rechnung wie `findJudge`, nur mit `dirIn` statt der Kamera.
   * Der getroffene Würfel wird für `respawnDelay` Sekunden versteckt — sonst zählt ein Durchflug
   * mehrfach.
   */
  function impactAt(pos, dirIn, radius) {
    for (const dd of dice) {
      if (dd.aus > 0 || dd.kick) continue;   // ein Wurf ist ein Ereignis, nicht zwei
      dd.grp.getWorldPosition(_pos);
      const r = radius != null ? radius : P.size * P.pickupRadius + P.pickupPad;
      if (_pos.distanceTo(pos) > r) continue;
      dd.spinner.getWorldQuaternion(_q);
      let best = 0, bestDot = -2;
      for (let f = 0; f < 6; f++) {
        _n.set(FACE_N[f][0], FACE_N[f][1], FACE_N[f][2]).applyQuaternion(_q);
        const dot = -_n.dot(dirIn);          // der Flugrichtung gegenüber = Impact
        if (dot > bestDot) { bestDot = dot; best = FACE_PIPS[f]; }
      }
      // ── v3 · S7e · **Der Würfel wird GESCHOSSEN, nicht ausgeknipst** ──────────────────
      // Georg, 29.8.: „die würfel sollten bei kontakt mit cartoon deformer senkrecht (so dass man
      // es noch im flug sieht) in die luft springen, mit transition rotieren kurz floaten, und
      // dann wieder auf den boden bouncen (hartgummi-würfel)".
      // Vorher stand hier `visible = false` — der Treffer löschte sein eigenes Ereignis.
      // **SENKRECHT ist der Kern der Anweisung:** ein Wegfliegen in Flugrichtung ist nach einem
      // halben Bild aus dem Blick; nach OBEN bleibt der Würfel im Bildfeld, während man
      // weiterfliegt. Deshalb ist die Startgeschwindigkeit rein die Standortnormale.
      dd.kick = 1;
      dd.kickT = 0;
      dd.vUp = P.kickV0;
      dd.hUp = 0;                                   // Höhe ÜBER der Ruhelage
      dd.bounces = 0;
      dd.squash = 0;
      dd.kickSpin = 1;
      dd.aus = 0;
      dd.grp.visible = true;
      sfx('dice-tumble', 1);
      return { pips: best, die: dd.seat.key, farbe: dd.seat.body };
    }
    return null;
  }

  /** Abnahme: wie viele stehen wirklich im Bild — Mittelpunkte lügen (S60). */
  function verteilung() {
    let minA = 180;
    for (let i = 0; i < 3; i++) {
      const a = dice[i].dir, b = dice[(i + 1) % 3].dir;
      minA = Math.min(minA, Math.acos(Math.max(-1, Math.min(1, a.dot(b)))) * 180 / Math.PI);
    }
    let imBild = 0;
    if (lastCam) {
      for (const d of dice) {
        d.grp.getWorldPosition(_pos);
        const p = _v.copy(_pos).project(lastCam);
        if (p.z < 1 && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1) imBild++;
      }
    }
    return {
      mindestwinkel: +minA.toFixed(1),
      sichtbar: lastCam ? imBild : null,
      winkelradius: +(Math.asin(Math.min(1, P.size * 0.5 / P.radius)) * 180 / Math.PI).toFixed(2),
    };
  }

  return {
    name: 'sky-dice', group, dice, params: P,
    get onJudge() { return api.onJudge; },
    set onJudge(fn) { api.onJudge = fn; },
    /** Mittelpunkt der Sitzkugel — der Ort des Spielers. */
    setCenter(v) { center.copy(v); },
    /** Tangentialrahmen des Standorts (aus `spherical-math.tangentFrame`). */
    setFrame(up, north, east, forward) {
      _up.copy(up); _north.copy(north); _east.copy(east);
      if (forward) sph.fwd.copy(forward);
    },
    /** v3 · S7 · Kugelradius und Bodenhöhe — ohne die schweben Würfel im Nichts statt über Grund. */
    setSphere(R) { sph.R = R || 5; },
    setAltFn(fn) { sph.altAt = fn || null; },
    /** v3 · S7h · `(x,y,z) => true` an Stellen, an denen kein Würfel schweben soll.
     *  Grund: die Würfel lesen das REINE Gelände als Boden (anders als die Karten, die den
     *  Bauten-Boden lesen). Ein Würfel über einem Schlossdach säße sonst auf 0,30 über Grund und
     *  wäre bei 0,12 Flughöhe unerreichbar. Karten dürfen ÜBER Bürgen hängen (man sieht sie),
     *  Würfel müssen TREFFBAR sein — zwei Ansprüche, deshalb zwei Antworten, aber nur EINE
     *  Höhenfunktion je Anspruch. */
    setKeepOut(fn) { sph.keepOut = fn || null; },
    /** v3 · S7f · (pos, normale, aufprallGeschwindigkeit, nummer) je Bounce. */
    set onBounce(fn) { api.onBounce = fn || null; },
    get onBounce() { return api.onBounce; },
    /** Alle Würfel neu in der Welt verankern (z. B. nach einem Rahmenwechsel). */
    reanchor() { let n = 0; for (const d of dice) if (anchor(d)) n++; return n; },
    update, roll, impactAt,
    get rolling() { return tumble > 0; },
    get judge() { return judge; },
    get fromModel() { return fromGlb; },
    setVisible(on) { P.visible = !!on; group.visible = !!on; },
    setParams(o = {}) { Object.assign(P, o); },
    report() {
      return {
        modell: fromGlb ? 'GLB (Ugur-D6)' : 'eigener Würfel',
      pickupFenster: +(P.size * P.pickupRadius + P.pickupPad).toFixed(3),
        richter: judge ? judge.pips : null,
        wuerfel: judge ? judge.die : null,
        rollt: tumble > 0,
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
