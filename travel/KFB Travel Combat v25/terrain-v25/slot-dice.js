// ============================================================================
// slot-dice.js — KFB Travel Combat v25.2 · Die Action-Slots SIND Würfel
// ----------------------------------------------------------------------------
// Georgs Idee (05.09.): „statt der Action-Buttons zeigen wir Ugur-3D-Dice in der gleichen Größe
// wie die Button-Felder · Farbe entspricht der Base Color des Avatars · sie zeigen Position/Slot
// mit Würfelaugen · Cartoon-Deformer für Hover/Klick/Cooldown."
//
// Warum das mehr ist als eine Icon-Wahl:
//   1 · Der Würfel ist schon der Gegenstand dieses Projekts (drei borromäische Würfel als Kanon,
//       der Würfelwurf als Waffe). Damit hört das HUD auf, UI zu sein, und wird dasselbe Material
//       wie die Welt — „aus einem Guss" aus dem eigenen Vokabular statt aus einem gekauften Set.
//   2 · **Augen sind eine Zahl, die etwas bedeutet.** Ein Würfel ist die einzige Form, deren
//       DREHUNG eine lesbare Zahl ist. Slot 1 zeigt ein Auge; Ladungen zählen später von 6 herunter.
//       Ein Objekt trägt Identität UND Menge, ohne Text und ohne Abzeichen.
//
// ═══ EIN RENDERER FÜR DIE GANZE REIHE ═══════════════════════════════════════════════════════
// Sechs Würfel als sechs Renderer wären sechs WebGL-Kontexte — Browser deckeln bei rund 16, und
// jeder kostet echt. Also EINE Leinwand über die ganze Reihe, EINE Ortho-Kamera, N Würfel
// nebeneinander, EINE rAF. Der eigentliche Gewinn kommt gratis dazu: ein Pickup-Würfel kann später
// IN seinen Slot fliegen, weil alle in derselben Szene stehen.
// Die Leinwand zeichnet nur. Geklickt wird weiter auf die DOM-Knöpfe darüber (Trefferfläche,
// Tastatur, Titel) — ein Canvas, das Klicks selbst verteilen müßte, wäre ein zweiter Eingabepfad.
//
// ═══ WELCHE SEITE WIEVIEL AUGEN HAT, WIRD GEMESSEN ══════════════════════════════════════════
// Das Ugur-GLB hat die Augen als eigene Geometrie (Material `black`). Welche Seite die Eins trägt,
// steht nirgends — und Raten wäre hier besonders dumm, weil es genau die Beschriftung ist. Also
// gezählt: die Pupillen-Vertices werden nach ihrer dominanten Achse auf die sechs Seiten verteilt,
// und weil jedes Auge dieselbe kleine Form ist, ist die Vertex-Zahl je Seite dem Augen-Zahl
// PROPORTIONAL. Die Rangfolge gibt 1…6. Steht die Messung schief, sagt `zeile()` es.
// ============================================================================

const INK = 0x1f1a14;
const PAPER = 0xf3ead3;

export function createSlotDice(o) {
  const THREE = o.THREE;
  const loadGLTF = o.loadGLTF;          // (pfad) → gltf, vom Wirt (kennt die Hosts)
  const P = Object.assign({
    slot: 44, gap: 6, max: 6,
    /* v25.2b · **Der Würfel füllt seine Zelle** (Georg: „viel zu klein"). 0,94 statt 0,62: bei 44 px
       Zelle sind das rund 41 px Kantenlänge, also dieselbe Größe wie das Zahnrad. Damit die
       Ecken bei der Neigung nicht an der Leinwandkante abgeschnitten werden, ist die Leinwand um
       `rand` breiter als die Reihe und liegt um denselben Betrag versetzt — die Würfelmitten
       bleiben dabei exakt auf den Knopfmitten (das war Naht 159, und es bleibt gemessen). */
    /* v25.2c · **Die Füllung ist die des Zahnrads, gemessen.** Georg: „ca 20 % zu groß." Nachgerechnet
       am Zahnrad: sein Bild ist bei fov 34 und z = 3,1 **1,895 Einheiten** hoch, das eingepasste
       GEAR_ICON.glb spannt **1,5** — der Glyph füllt also 0,79 seiner 44-px-Zelle, nicht 1,0. Der
       Würfel füllte 0,94; 0,94 / 0,79 = **1,19**, also genau Georgs Schätzung. Jetzt teilen beide
       dieselbe Zahl. Sie steht hier als 1,5/1,895 ausgerechnet, damit sichtbar bleibt, WOHER sie
       kommt: ändert das Zahnrad seine Einpassung, ist das hier eine Zeile. */
    fuellung: 0.79, rand: 6,
    /* Georgs Ruhelage: „langsames Atmen (nicht alle zusammen, sondern als dezente WELLE) ·
       floating · frontal, aber 3D sichtbar". Drei Zahlen, jede für eine Zusage:
         `neige`  frontal bleibt frontal — 0,17 rad (10°) zeigen Kante und Oberseite, ohne die
                  vordere Fläche zu verkürzen. Bei 40 px ist das die Grenze: darüber fangen die
                  Augen an, sich zu überlagern, und die Beschriftung geht verloren.
         `welle`  Phasenversatz je Slot. 0,7 rad ergibt bei 1,05 Hz rund 0,1 s Nachlauf von Würfel
                  zu Würfel — man liest eine Welle, kein Metronom (dieselbe Regel wie der
                  Nachlauf-Jitter der Props: alle gleichzeitig wirkt wie ein Uhrwerk).
         `schweb` Höhe. Klein, weil ein 40-px-Feld keine große Amplitude verträgt. */
    neige: 0.17, dreh: 0.2,    atem: 0.035, atemHz: 1.05, welle: 0.7,
    schweb: 0.035, schwebHz: 0.72,
    /* Cartoon-Deformer, Georgs Wortwahl. Squash bei Klick, Stretch beim Aufladen — volumen-
       erhaltend (Prinzip 1), also geht eine Achse hoch und die anderen zwei herunter. */
    klickSquash: 0.28, klickAbklang: 7.5,
    hoverGross: 1.12, hoverSpeed: 12,
    /* „Würfel verblasst, Transparenz ist die Uhr" (Georg). 0,18 ist der Boden: ganz weg wäre ein
       leerer Slot, und ein leerer Slot sagt „gibt es nicht" statt „lädt noch". */
    coolAlpha: 0.18,
    pfade: ['media/3D_Assets/Dice/dice_ugur_lowpoly.glb', 'media/3D_Assets/dice_ugur_lowpoly.glb'],
  }, o.params || {});

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;';
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  /* ═══ v25.2p · DIE WÜRFELFARBE WIRD GEMESSEN, NICHT ÜBERNOMMEN ═══════════════════════
     Georg zum vierten Mal: „dice color entspricht nicht model/pet/mech base color". Diesmal ist
     der Hexwert nachweislich richtig — in seiner Sitzung gemessen: Pet-Körpermaterial
     **#d3a244**, `cfg.color` **#d3a244**, `slotDice.farbeIst()` **#d3a244**. Drei gleiche Zahlen,
     und das Bild zeigt trotzdem zwei verschiedene Gelbs. Also war die Suche an der falschen
     Stelle: nicht der Wert ist falsch, sondern was diese Leinwand daraus MACHT.
     Gemessen an derselben Konfiguration: Schlüssellicht 1,5 + Fülllicht 0,55 + Umgebung 0,55
     ergeben auf einer kamerazugewandten Fläche eine Bestrahlung von **1,95** — knapp das Doppelte
     dessen, was den Albedowert unverändert durchließe. Das allein wäre ein zu HELLES Gelb; dazu
     kam das vom Wirt übernommene Tonemapping (v25.2f), das genau diese Überhelligkeit wieder
     herunterdrückt und dabei entsättigt. Ergebnis: olivgrau statt gold. Zwei Fehler, die sich
     gegenseitig halb verdecken — deshalb war es vier Runden lang „fast richtig".
     Die Korrektur macht aus der Übernahme eine Messung:
       1 · KEIN Tonemapping auf dieser Leinwand. Tonemapping ist für Szenenleuchtdichten da; hier
           wird eine Farbprobe gezeigt, und eine Farbprobe darf nicht komprimiert werden. Der
           Farbraum des Wirts wird weiter übernommen — der beschreibt die Kodierung, nicht die
           Belichtung.
       2 · Die Lampen werden EINMAL kalibriert (`kalibriere()` unten): ein 1×1-Probebild einer
           weißen, kamerazugewandten Fläche unter genau diesen Lampen sagt, welchen Faktor sie
           tatsächlich auf den Albedowert legen. Der Kehrwert geht auf alle drei. Danach gilt:
           die der Kamera zugewandte Würfelseite rendert **exakt** den übergebenen Hexwert, die
           schrägen Seiten dunkler — das 3D bleibt lesbar, die Farbe ist die des Avatars.
     Damit ist „die Würfel haben die falsche Farbe" kein Gelbton-Gespräch mehr, sondern ein
     Zahlenvergleich: `farbeIst()` nennt Soll und gemessenes Ist. */
  renderer.toneMapping = THREE.NoToneMapping;
  if (o.colorSpace != null) renderer.outputColorSpace = o.colorSpace;
  const scene = new THREE.Scene();
  /* Ortho, und die Höhe ist EINE Einheit je Zelle: damit ist „ein Würfel füllt 62 % seiner Zelle"
     eine Zahl (0,62) und keine Pixelrechnung, die bei jedem Maßstab neu stimmen muß. */
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10);
  camera.position.z = 3;
  // Zwei Lampen, damit „3D sichtbar" nicht von der Weltbeleuchtung abhängt: das HUD ist kein Ort
  // in der Welt, es darf nicht mit ihr dunkel werden.
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-0.6, 0.9, 1.2); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.55); fill.position.set(0.9, -0.4, 0.6); scene.add(fill);
  const amb = new THREE.AmbientLight(0xffffff, 0.55); scene.add(amb);
  const LICHT_ROH = { key: 1.5, fill: 0.55, amb: 0.55 };
  const MAT_KOERPER = { roughness: 0.42, metalness: 0.1 };
  let lichtSkala = 1, lichtGemessen = null;
  /* Die Probe: EINE weiße Fläche, der Kamera zugewandt, unter Kopien genau dieser Lampen. Was
     davon im Bild ankommt, ist der Faktor, den die Beleuchtung auf jeden Albedowert legt. Die
     Kopien sind nötig, weil ein Light-Objekt nur einen Elternknoten haben kann — Position und
     Stärke sind identisch, also ist die Bestrahlung auf eine +Z-Fläche identisch. Ziel ist ein
     Renderziel im linearen Farbraum (Voreinstellung), damit der Rücklesewert nicht erst aus sRGB
     zurückgerechnet werden muß. */
  function kalibriere() {
    const ps = new THREE.Scene();
    const k2 = new THREE.DirectionalLight(0xffffff, LICHT_ROH.key); k2.position.copy(key.position); ps.add(k2);
    const f2 = new THREE.DirectionalLight(0xffffff, LICHT_ROH.fill); f2.position.copy(fill.position); ps.add(f2);
    ps.add(new THREE.AmbientLight(0xffffff, LICHT_ROH.amb));
    const probeMat = new THREE.MeshStandardMaterial(Object.assign({ color: 0xffffff }, MAT_KOERPER));
    const probe = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), probeMat);
    ps.add(probe);
    const pc = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10); pc.position.z = 3;
    const rt = new THREE.WebGLRenderTarget(1, 1);
    const vorher = renderer.getRenderTarget();
    renderer.setRenderTarget(rt); renderer.clear(); renderer.render(ps, pc);
    const px = new Uint8Array(4);
    try { renderer.readRenderTargetPixels(rt, 0, 0, 1, 1, px); } catch (e) { px[0] = px[1] = px[2] = 255; }
    renderer.setRenderTarget(vorher);
    rt.dispose(); probeMat.dispose(); probe.geometry.dispose();
    const s = (px[0] + px[1] + px[2]) / (3 * 255);
    lichtGemessen = s;
    /* Der Riegel: ein Probebild, das schwarz oder überstrahlt zurückkommt (verlorener Kontext,
       ein Renderer ohne Float-Rücklesen), darf die Leiste nicht unsichtbar machen. Dann bleibt
       es bei den Rohwerten — sichtbar falsch ist besser als sichtbar nichts. */
    if (!(s > 0.05 && s < 1.5)) { console.warn('[slot-dice] Lichtprobe unbrauchbar (' + s.toFixed(3) + ') — Rohwerte bleiben'); return; }
    lichtSkala = 1 / s;
    key.intensity = LICHT_ROH.key * lichtSkala;
    fill.intensity = LICHT_ROH.fill * lichtSkala;
    amb.intensity = LICHT_ROH.amb * lichtSkala;
    console.info('[slot-dice] Lichtprobe ' + s.toFixed(3) + ' → Skala ' + lichtSkala.toFixed(3)
      + ' · zugewandte Würfelseite trägt jetzt den Albedowert selbst');
  }
  kalibriere();

  let geoBody = null, geoPips = null, seiten = null, quelle = 'ungeladen', fehler = null;
  let achsen = null, achsig = true, neigung = 0;   // v25.2c · gemessene Würfelachsen (siehe § unten)
  const wuerfel = [];   // { grp, matB, matP, id, augen, phase, sq, hover, klick, cool, alpha }
  let t = 0, raf = 0, breiteN = 0;

  /* ── v25.2c · DIE WÜRFELACHSEN WERDEN GEMESSEN, NICHT ANGENOMMEN ─────────────────────────
     Georgs Befund (05.09.): „die Würfel sind noch unterschiedlich ausgerichtet." Die vorige Fassung
     legte die sechs Seiten auf die WELTACHSEN des GLB (Vertex-Binning nach dominanter Achse). Steht
     der Würfel in seiner Datei aber schräg — und gemessen steht er schräg —, dann ist jede dieser
     sechs Richtungen nur die NÄCHSTE Achse und nicht die Flächennormale: die Pose bringt die Seite
     bis auf einige Grad nach vorn, und der Restwinkel ist JE SEITE ein anderer. Genau das steht im
     Bild — einer auf der Fläche, der Nachbar auf der Ecke.
     Zweiter, schlimmerer Nebeneffekt derselben Annahme: die achsenweise Normierung (1/sx, 1/sy, 1/sz)
     ist bei einem schräg stehenden Körper eine SCHERUNG. Dann sind die Seiten nicht mehr quadratisch,
     und keine Pose der Welt kann sie noch gleich aussehen lassen.
     Also aus den Dreiecken messen: Normalen nach Fläche gewichtet gruppieren, die größte Gruppe ist
     eine Flächennormale, die erste dazu senkrechte die zweite, das Kreuzprodukt die dritte.
     Sechs Seiten = ±U, ±V, ±W. */
  const WELT = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
  function achsenMessen(geo) {
    const pos = geo.getAttribute('position'), idx = geo.index;
    const n = idx ? idx.count : pos.count;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    const ab = new THREE.Vector3(), ac = new THREE.Vector3(), nr = new THREE.Vector3();
    const gruppen = [];
    for (let i = 0; i + 2 < n; i += 3) {
      const i0 = idx ? idx.getX(i) : i, i1 = idx ? idx.getX(i + 1) : i + 1, i2 = idx ? idx.getX(i + 2) : i + 2;
      a.fromBufferAttribute(pos, i0); b.fromBufferAttribute(pos, i1); c.fromBufferAttribute(pos, i2);
      nr.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a));
      const fl = nr.length(); if (fl < 1e-10) continue;   // Fläche IST das Gewicht (doppelt, egal)
      nr.divideScalar(fl);
      let g = null;
      for (const k of gruppen) if (k.dir.dot(nr) > 0.985) { g = k; break; }
      if (g) { g.dir.addScaledVector(nr, fl / (g.flaeche + fl)).normalize(); g.flaeche += fl; }
      else gruppen.push({ dir: nr.clone(), flaeche: fl });
    }
    gruppen.sort((x, y) => y.flaeche - x.flaeche);
    if (!gruppen.length) return null;
    const U = gruppen[0].dir.clone().normalize();
    let zweit = null;
    for (const k of gruppen) if (Math.abs(k.dir.dot(U)) < 0.25) { zweit = k.dir; break; }
    if (!zweit) return null;
    const V = zweit.clone().addScaledVector(U, -zweit.dot(U)).normalize();
    const W = new THREE.Vector3().crossVectors(U, V).normalize();
    return [U, V, W];
  }
  /** Ausdehnung entlang der gemessenen Achsen — die Kantenlängen DIESES Körpers, nicht die der Box. */
  function ausdehnung(geo, ach) {
    const pos = geo.getAttribute('position'), v = new THREE.Vector3();
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      for (let k = 0; k < 3; k++) { const d = v.dot(ach[k]); if (d < lo[k]) lo[k] = d; if (d > hi[k]) hi[k] = d; }
    }
    return [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]];
  }
  /** Die Messung: welche Seite trägt wieviel Augen — jetzt gegen die GEMESSENEN sechs Seiten. */
  function seitenMessen(geo, ach) {
    const seiten6 = [ach[0], ach[0].clone().negate(), ach[1], ach[1].clone().negate(), ach[2], ach[2].clone().negate()];
    const pos = geo.getAttribute('position');
    const n = [0, 0, 0, 0, 0, 0];
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      let best = -Infinity, k = 0;
      for (let j = 0; j < 6; j++) { const d = v.dot(seiten6[j]); if (d > best) { best = d; k = j; } }
      n[k]++;
    }
    // Rangfolge: wenigste Vertices = eine Augenzahl von 1, meiste = 6.
    const rang = n.map((c, i) => ({ i, c })).sort((a, b) => a.c - b.c);
    const augenZuSeite = {};
    rang.forEach((r, k) => { augenZuSeite[k + 1] = seiten6[r.i].clone(); });
    // Gegenseiten müssen sich auf 7 summieren — die Probe, die eine schiefe Messung verrät.
    let ok = true;
    for (let a = 1; a <= 3; a++) {
      const d1 = augenZuSeite[a], d2 = augenZuSeite[7 - a];
      if (!d1 || !d2 || d1.dot(d2) > -0.9) ok = false;
    }
    return { augenZuSeite, roh: n, plausibel: ok };
  }

  async function laden() {
    if (!loadGLTF) { fehler = 'kein Lader'; quelle = 'aus'; return quelle; }
    for (const p of P.pfade) {
      try {
        const g = await loadGLTF(p);
        g.scene.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(g.scene);
        const c = box.getCenter(new THREE.Vector3());
        const koerper = [], pips = [];
        const lum = (col) => 0.2126 * col.r + 0.7152 * col.g + 0.0722 * col.b;
        g.scene.traverse((nd) => {
          if (!nd.isMesh || !nd.geometry) return;
          const geo = nd.geometry.clone();
          geo.applyMatrix4(nd.matrixWorld);
          geo.translate(-c.x, -c.y, -c.z);
          const m = Array.isArray(nd.material) ? nd.material[0] : nd.material;
          const nm = String((m && m.name) || nd.name || '');
          const dunkel = /black|pip|dot|auge/i.test(nm) || (m && m.color && lum(m.color) < 0.3);
          (dunkel ? pips : koerper).push(geo);
        });
        if (!koerper.length) throw new Error('GLB ohne Körper-Mesh');
        geoBody = koerper[0];
        geoPips = pips[0] || null;
        /* Erst die Achsen, dann die Normierung — in dieser Reihenfolge, weil die Normierung von den
           Achsen abhängt (siehe § oben). Liegen die gemessenen Achsen auf den Weltachsen, bleibt es
           bei der achsenweisen Normierung (die Ugur-Box ist gemessen nicht würfelig: 2,544 × 2,701 ×
           2,550). Steht der Körper schräg, ist achsenweise eine Scherung — dann EIN Faktor. */
        achsen = achsenMessen(geoBody) || WELT.map((v) => v.clone());
        const ext = ausdehnung(geoBody, achsen);
        const zuWelt = achsen.map((ax) => {
          let k = 0, best = 0;
          for (let j = 0; j < 3; j++) { const q = Math.abs(ax.dot(WELT[j])); if (q > best) { best = q; k = j; } }
          return best > 0.999 ? k : -1;
        });
        achsig = zuWelt.every((k) => k >= 0) && new Set(zuWelt).size === 3;
        const sv = new THREE.Vector3(1, 1, 1);
        if (achsig) achsen.forEach((ax, i) => { sv.setComponent(zuWelt[i], 1 / Math.max(1e-4, ext[i])); });
        else sv.setScalar(1 / Math.max(1e-4, Math.max(ext[0], ext[1], ext[2])));
        geoBody.scale(sv.x, sv.y, sv.z);
        if (geoPips) geoPips.scale(sv.x, sv.y, sv.z);
        seiten = geoPips ? seitenMessen(geoPips, achsen) : null;
        quelle = 'glb';
        neigung = Math.round(Math.acos(Math.min(1, Math.abs(achsen[0].dot(WELT[0])))) * 180 / Math.PI);
        console.info('[slot-dice] ' + p + ' geladen · Achsen ' + (achsig ? 'weltparallel' : 'schräg (' + neigung + '° zur X-Achse) → EIN Skalenfaktor')
          + ' · Kanten ' + ext.map((x) => x.toFixed(3)).join(' × ')
          + ' · Augen-Messung ' + (seiten ? (seiten.plausibel ? 'plausibel (Gegenseiten = 7)' : 'SCHIEF: ' + JSON.stringify(seiten.roh)) : 'keine Augen-Geometrie'));
        return quelle;
      } catch (e) { fehler = String((e && e.message) || e); }
    }
    /* Georgs Wahl für den Rückweg: **nichts.** Keine Ersatzform, keine Zifferntaste — „die ja auch
       keinen Sinn machen würde". Eine leere Zelle sagt ehrlich, dass das Zeichen fehlt; ein
       Ersatzwürfel ohne Augen würde eine Zahl behaupten, die er nicht zeigt. */
    quelle = 'aus';
    console.warn('[slot-dice] kein GLB (' + fehler + ') — die Zellen bleiben leer (Georgs Entscheidung)');
    return quelle;
  }

  /** ═══ v25.2b · ALLE WÜRFEL ZEIGEN DIESELBE AUSRICHTUNG ════════════════════════════
   *  Georgs Befund: „Würfel sollten die gleiche Ausrichtung zur Kamera zeigen." Erste Fassung nahm
   *  `setFromUnitVectors`, und das ist genau die Falle: die Funktion bringt die gewünschte Seite
   *  nach vorn, wählt die ROLLE um die Blickachse aber beliebig (sie nimmt die kürzeste Drehung).
   *  Im Bild stand deshalb einer auf der Fläche und der Nachbar auf der Ecke — das liest als
   *  schlampig, obwohl beide „richtig" waren.
   *  Jetzt wird eine VOLLE Basis gebaut: die gewählte Seite geht nach +Z, und eine deterministisch
   *  gewählte Würfelachse geht nach +Y. Damit ist die Lage vollständig bestimmt, und der Unterschied
   *  zwischen zwei Slots ist NUR die Augenzahl — was der ganze Sinn der Idee war. */
  const _q = new THREE.Quaternion(), _m4 = new THREE.Matrix4();
  const _ax = new THREE.Vector3(), _ay = new THREE.Vector3(), _az = new THREE.Vector3();
  /* Die Oben-Achse kommt aus den GEMESSENEN Würfelachsen, nicht aus den Weltachsen: nur dann liegt
     die Kante der vorgedrehten Seite waagerecht im Bild, und alle Slots zeigen dieselbe Silhouette. */
  const _obenAus = () => (achsen || WELT);
  function poseFuer(grp, augen) {
    grp.quaternion.identity();
    const d = seiten && seiten.augenZuSeite[augen];
    if (d) {
      _az.copy(d).normalize();
      // Die Oben-Achse: die erste Kandidatin, die nicht (fast) parallel zur Blickachse liegt.
      // Deterministisch, also für jede Augenzahl dieselbe Regel — kein Zufall aus der Mathematik.
      const kand = _obenAus();
      let oben = kand[0];
      for (const k of kand) { if (Math.abs(k.dot(_az)) < 0.5) { oben = k; break; } }
      _ay.copy(oben).addScaledVector(_az, -oben.dot(_az)).normalize();
      _ax.crossVectors(_ay, _az);
      _m4.makeBasis(_ax, _ay, _az);
      _q.setFromRotationMatrix(_m4).invert();
      grp.quaternion.copy(_q);
    }
    // Die Neigung kommt NACH der Augenwahl und im Kameraraum — sonst dreht sie die gewählte Seite
    // wieder weg, und die Beschriftung wäre eine andere als die bestellte.
    grp.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -P.neige);
    grp.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), P.dreh);
  }

  /** Die Reihe neu bestücken. `list` = [{ id, augen, farbe }] in Slot-Reihenfolge. */
  function setzen(list) {
    for (const w of wuerfel) scene.remove(w.grp);
    wuerfel.length = 0;
    const l = (list || []).slice(0, P.max);
    breiteN = l.length;
    groesse();
    if (quelle !== 'glb') return 0;
    l.forEach((s, i) => {
      const grp = new THREE.Group();
      // Material JE WÜRFEL: ein geteiltes ließe alle gleichzeitig verblassen, und die Abklingzeit
      // ist genau eine Deckkraft je Würfel (v5-Befund an den Würfeln, hier dieselbe Falle).
      const matB = new THREE.MeshStandardMaterial(Object.assign({ color: new THREE.Color(s.farbe || 0xf3ead3), transparent: true }, MAT_KOERPER));
      /* v25.2b · Augen in PAPIER, nicht Tusche (Georgs Wahl). Der Grund ist nicht Kontrast auf dem
         Papier, sondern WO die Augen liegen: in einer eigengeschatteten Vertiefung. Dunkle Augen
         verschmelzen dort mit dem Schatten und verschwinden bei 44 px; Creme leuchtet heraus und
         bleibt zählbar. Und die Augen sind die Beschriftung — sind sie nicht zählbar, ist die
         ganze Idee weg. */
      const matP = new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.55, metalness: 0, transparent: true });
      grp.add(new THREE.Mesh(geoBody, matB));
      if (geoPips) grp.add(new THREE.Mesh(geoPips, matP));
      poseFuer(grp, s.augen || (i + 1));
      grp.scale.setScalar(P.fuellung);
      grp.position.x = zelleX(i);
      scene.add(grp);
      wuerfel.push({ grp, matB, matP, id: s.id, augen: s.augen || (i + 1), i,
                     phase: i * P.welle, sq: 0, hover: 0, klick: 0, cool: 0, weg: 0 });
    });
    return wuerfel.length;
  }

  // Zellmitte in Kamera-Einheiten: die Reihe ist um 0 zentriert, eine Zelle ist 1 breit + Lücke.
  const zelleX = (i) => (i - (breiteN - 1) / 2) * (1 + P.gap / P.slot);
  function groesse() {
    // Reihenbreite in px, plus `rand` auf jeder Seite: bei 0,94 Füllung ragen die geneigten Ecken
    // über die Zelle, und ohne den Rand würde die Leinwand sie abschneiden.
    const reiheCss = breiteN * P.slot + Math.max(0, breiteN - 1) * P.gap;
    const wCss = reiheCss + 2 * P.rand, hCss = P.slot + 2 * P.rand;
    canvas.style.left = -P.rand + 'px'; canvas.style.top = -P.rand + 'px';
    canvas.style.width = wCss + 'px'; canvas.style.height = hCss + 'px';
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(wCss, hCss, false);
    // EINE Einheit = eine Zelle. Der Rand wird in Einheiten umgerechnet, damit px/Einheit waagerecht
    // und senkrecht gleich bleiben — sonst wäre der Würfel wieder kein Würfel (Naht 159).
    const randE = P.rand / P.slot;
    const halbB = (breiteN + Math.max(0, breiteN - 1) * (P.gap / P.slot)) / 2 + randE;
    const halbH = 0.5 + randE;
    camera.left = -halbB; camera.right = halbB; camera.top = halbH; camera.bottom = -halbH;
    camera.updateProjectionMatrix();
    for (const w of wuerfel) w.grp.position.x = zelleX(w.i);
  }

  function tick() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - (tick._l || now)) / 1000) || 0.016;
    tick._l = now; t += dt;
    for (const w of wuerfel) {
      // Atem als WELLE (Phasenversatz je Slot) — volumenerhaltend.
      const atem = Math.sin(t * P.atemHz * 6.283 - w.phase) * P.atem;
      w.klick = Math.max(0, w.klick - dt * P.klickAbklang);
      const sy = 1 + atem - w.klick * P.klickSquash;
      const sxz = 1 / Math.sqrt(Math.max(0.2, sy));
      const hov = 1 + (P.hoverGross - 1) * w.hover;
      const s = P.fuellung * hov;
      w.grp.scale.set(s * sxz, s * sy, s * sxz);
      w.grp.position.y = Math.sin(t * P.schwebHz * 6.283 - w.phase * 0.8) * P.schweb;
      // Transparenz IST die Uhr (Georg): voll geladen = deckend, frisch gefeuert = fast weg.
      const a = P.coolAlpha + (1 - P.coolAlpha) * (1 - Math.max(0, Math.min(1, w.cool)));
      w.matB.opacity = a; w.matP.opacity = a;
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  return {
    name: 'slot-dice', canvas, laden, setzen,
    get quelle() { return quelle; },
    get anzahl() { return wuerfel.length; },
    /** Zustand je Slot — derselbe Vertrag wie vorher, nur in 3D. */
    zustand(id, st) {
      const w = wuerfel.find((x) => x.id === id); if (!w) return;
      if (st.cool != null) w.cool = st.cool;
      if (st.hover != null) w.hover += ((st.hover ? 1 : 0) - w.hover) * 0.5;
    },
    hover(id, on) { const w = wuerfel.find((x) => x.id === id); if (w) w.hover = on ? 1 : 0; },
    /** Klick: Squash. Der Deformer ist Georgs Wort, und er läuft NUR auf Ereignisse — bei 40 px
     *  würde ein dauerndes Taumeln die Augen unlesbar machen, und die Augen sind die Beschriftung. */
    klick(id) { const w = wuerfel.find((x) => x.id === id); if (w) w.klick = 1; },
    /** Alle Körper auf eine neue Grundfarbe (Avatar-Wechsel). */
    faerben(farbe) { const c = new THREE.Color(farbe); for (const w of wuerfel) w.matB.color.copy(c); },
    /** v25.2j · Die Farbe, die WIRKLICH auf den Körpern liegt — als Hexwort. Damit ist „Würfel
     *  haben die falsche Farbe" ein Vergleich zweier Zahlen und keine Diskussion über Gelbtöne. */
    farbeIst() { const w = wuerfel[0]; return w ? '#' + w.matB.color.getHexString() : null; },
    /** v25.2p · Die Lichtprobe als Zahlenpaar: `probe` ist, was die Lampen ungeskaliert auf einen
     *  Albedowert legten (1,0 wäre neutral), `skala` der Kehrwert, der jetzt gilt. Steht die Skala
     *  auf 1, ist die Probe fehlgeschlagen — dann ist die Farbe wieder Verhandlungssache. */
    get lichtprobe() { return { probe: lichtGemessen, skala: lichtSkala, tonemapping: renderer.toneMapping }; },
    /** v25.2d · Die Füllung kommt vom ZAHNRAD, nicht aus einer Konstante hier: es meldet, wieviel
     *  seiner Zelle sein Glyph füllt (0,79 mit GLB, 0,92 mit dem gebauten Rad), und die Würfel
     *  nehmen dieselbe Zahl. Damit bleiben die beiden Zeichen gleich groß, auch wenn das entfernte
     *  GLB einmal ausfällt. `tick()` liest `P.fuellung` je Bild — es braucht keinen Neuaufbau. */
    setFuellung(v) { const q = +v; if (q > 0.2 && q < 1.3) P.fuellung = q; },
    get fuellung() { return P.fuellung; },
    zeile() {
      return 'slot-dice · ' + quelle + ' · ' + wuerfel.length + ' Würfel'
        + (quelle === 'glb' ? ' · Achsen ' + (achsig ? 'weltparallel' : 'schräg ' + neigung + '°') : '')
        + (seiten ? ' · Augen-Messung ' + (seiten.plausibel ? 'plausibel' : 'SCHIEF') : ' · keine Augen')
        + (fehler && quelle !== 'glb' ? ' · ' + fehler : '');
    },
    dispose() { cancelAnimationFrame(raf); renderer.dispose(); canvas.remove(); },
  };
}
