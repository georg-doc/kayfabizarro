/* ============================================================================
   KFB Combat Arena v4b · SPRINT E — DIE SPINDEL
   »Erst die Geometrie, dann die Oberfläche.«

   Georg 09.09.: »grundsätzlich hatte ich gedacht, dass das so eine Art Spindel wäre — wenn ich nach
   oben gucke, auch eine Art Trichter, und wie weit unten die Trichter zusammenlaufen, da so eine
   Fläche hinsetzen: Lava mit Flammen, Bubblegum-See, grüner Säure-See, oder ein schwarzes Loch.«

   ZUSTAND VORHER, GEMESSEN (nicht gelesen): `himmel.v3.js` hat einen Zylindermantel (Radius 34,
   fünf Reihen, Höhe 100,2 u) und **nur unten** einen Abschluss — eine gestauchte Halbkugel
   (`_trichterBauen`, Tiefe 0,9 R) mit derselben Kartentextur und einer Helligkeitsrampe. Nach oben
   ist der Mantel offen (`openEnded`), und die Deckungsmessung in v3 fragte nur nach UNTEN
   (20/37/55/70/85° unter der Waagerechten). Wer nach oben sieht, sieht deshalb aus dem Bild heraus.

   WAS DIESES MODUL TUT — in dieser Reihenfolge, und die Reihenfolge ist die Entscheidung:
     E1  Abschluss NACH OBEN, gespiegelt zum unteren: dieselbe Kugelform, dieselbe Textur, dasselbe
         Material (`hi.matTrichter` wird WIEDERVERWENDET — ein Zeichenaufruf mehr, kein zweiter
         Materialzustand). Damit ist die Silhouette rundum dicht, bevor irgendetwas hübsch wird.
     E2  Boden C29: Strahlen nach OBEN und nach UNTEN, 0 Fehlstrahlen, kein Treffer jenseits der
         Sichtweite. Ohne diese Zahl ist »geschlossen« eine Behauptung — genau der Fehler, mit dem
         v3 einen Abschluss hatte, der komplett hinter `camera.far` lag und trotzdem als geschlossen galt.
     E3  Der SEE als Scheibe im Schlund, mit austauschbarem Preset: `wirbel` (Sog, schwarzer Kern)
         und `lava` (Kruste mit glühenden Adern). Ein Shader, zwei Zweige, ein Regler.

   WARUM DIE SCHEIBE GENAU DORT LIEGT: die Halbkugel hat bei y' = 0,9·R·√(1−f²) den waagerechten
   Radius f·R. Mit f = 0,62 sitzt eine Scheibe vom Radius 21,1 u also **randgenau** in der Wand —
   kein Spalt, kein Durchdringen, unabhängig vom Radius des Himmels. Bei R 34 liegt sie auf
   y ≈ −78,6, das sind 84,5 u von der Kamera und damit innerhalb von `far` = 120 (nachgerechnet,
   weil in v3 genau diese Rechnung einmal gefehlt hat).

   UND WARUM DER SEE KEINEN NEBEL BEKOMMT: `SPEC.nebelU` endet bei 95 u, die Scheibe liegt bei
   84,5 u — mit Nebel wäre sie zu 88 % weggeblendet. Ein See im Schlund ist die LICHTQUELLE der
   Szene, kein fernes Objekt; er blendet sich über seinen eigenen Randabfall in die Wand ein
   (`uDeckung`, Randbreite im Shader). RÜCKWEG: `fog: true` in `_seeMaterial`.
============================================================================ */

export const SPEC = {
  stauch: 0.9,        // wie der untere Abschluss in himmel.v3 — sonst treffen sich die Tangenten nicht
  /* ⚠ 0,62 WAR GEMESSEN RICHTIG UND IM BILD FALSCH. Die Scheibe sass randgenau in der Wand — und
     lag damit 94,6 u unter der Kamera und **2,78 Bildhoehen unter dem unteren Bildrand** (NDC y
     −2,78, projiziert gemessen). Der Grund steht in himmel.v3: der Mantel hat SECHS Reihen a 20 u,
     seine Unterkante liegt also schon 60 u tief; alles, was im Schlund sitzt, ist mindestens 60 u
     weg. Je kleiner der Scheibenradius, je tiefer sie sitzt — 0,62 war der unsichtbarste Fall.
     0,8 ist der Kompromiss: Radius 27 u auf y −83 (34° Bildwinkel, sichtbar sobald man an der
     Karte vorbei nach unten sieht) und darunter bleibt noch rund eine Kartenreihe Trichter stehen,
     damit die zusammenlaufenden Reihen nicht verdeckt werden. Der Regler `seeTiefe` ist Georgs
     eigene Frage in Zahlen: wie weit unten laufen die Trichter zusammen.
     Merksatz: eine Flaeche, die geometrisch richtig sitzt, kann trotzdem ausserhalb des Bildes liegen. */
  seeF: 0.8,          // Anteil des Radius: dort berührt die waagerechte Scheibe die Trichterwand
  segmente: 96,
  rampe: 0.85,        // Helligkeitsabfall zum Pol (unten 0,9 — oben etwas flacher, dort hängt der See)
  /* ⚠ DER BODEN MISST DIE KULISSE, NICHT DEN STANDORT DES PRÜFERS. Erste Fassung schoss von der
     LEBENDEN Kamera aus — und fiel prompt durch, als ich sie zum Ansehen der Unterseite auf
     y −21 gestellt habe (»oben 75° LEER«). Das war kein Loch in der Kulisse: von 21 u unter der
     Karte steigt ein 75°-Strahl über den Scheitel der Kuppel (y 86) hinaus. Mit der freien Kamera
     kann man IMMER aus der Spindel herausfliegen; ein Boden, der das als Defekt meldet, misst den
     Prüfer.
     Bezug ist deshalb die SPIELPOSITION: Kartenmitte, Augenhöhe 5,9 u (gemessene Höhe der
     Spielkamera). Die lebende Kamera wird zusätzlich gemessen und als Auskunft mitgeführt — sie
     sagt dann, ab wo es aufreißt, und das ist beim Bauen nützlich statt störend.
     Merksatz: ein Boden braucht einen festen Bezugspunkt, sonst misst er den, der hinsieht. */
  augeY: 5.9,
  strahlen: {         // Deckungsmessung: Neigungen über/unter der Waagerechten
    unten: [20, 40, 60, 75, 85],
    oben: [20, 40, 60, 75, 85],
    yaw: [0, 135, 250]
  }
};

const PRESETS = { aus: -1, wirbel: 0, lava: 1 };

export default class Spindel {
  constructor(o = {}) {
    this.THREE = o.THREE || o.three;
    this.log = (s) => (o.log || console.info)('[spindel] ' + s);
    this.camera = o.camera || null;
    this.see = o.see || 'wirbel';
    this.f = o.f || SPEC.seeF;
    this.oben = o.oben || 'aus';
    this.hi = null; this.kuppel = null; this.seeM = null; this.seeOben = null;
    this.zeit = 0; this._messZeit = -99; this.deckung = null;
  }

  /* ── E1 · Der Abschluss nach oben ─────────────────────────────────────────────────────────────
     Gespiegelt gebaut, nicht neu erfunden: dieselbe Halbkugel, dieselbe Stauchung, dieselbe
     Rampe — nur die Vorzeichen kehren. Zwei Abschlüsse, die aus einer Regel entstehen, können
     nicht auseinanderlaufen; zwei getrennt gebaute schon (siehe »Fläche und Tusche teilen EINE
     Kontur« im Kartenkanon — dieselbe Lehre, andere Ebene).
     ⚠ uv.y LÄUFT BEI DER OBEREN HALBKUGEL ANDERSHERUM: `SphereGeometry` normalisiert v je Segment
     (`1 − iy/heightSegments`), also ist uv.y beim POL 1 und am ÄQUATOR 0 — beim unteren Abschluss
     genau umgekehrt. Wer die Zeile des unteren Trichters kopiert, dreht den Verband auf den Kopf. */
  bauen(hi) {
    const T = this.THREE;
    if (!hi || !hi.mesh || !hi.tex) return 0;
    this.hi = hi;
    if (this.kuppel) return 1;
    const R = hi.radius, tiefe = +(R * SPEC.stauch).toFixed(2);
    const geo = new T.SphereGeometry(R, SPEC.segmente, 28, Math.PI / 2, Math.PI * 2, 0, Math.PI / 2);
    geo.scale(1, SPEC.stauch, 1);
    const uv = geo.attributes.uv;
    const k = 1.6 / (hi.reihen || 5);
    /* ⚠ IN DER KUPPEL STANDEN DIE KARTEN KOPF (Georg 09.09.: »karten oben bitte richtig herum«).
       Grund: der Mantel wird von innen gesehen (\`BackSide\`), und beim Blick nach OBEN kippt die
       Projektion die senkrechte Achse — dasselbe Motiv, das an der Wand richtig steht, erscheint
       über Kopf um 180° gedreht. Eine Drehung um 180° ist das Spiegeln BEIDER UV-Achsen; nur v zu
       kippen gäbe Spiegelschrift, nur u zu kippen liesse sie auf dem Kopf.
       RÜCKWEG (Textur läuft über die Fuge weiter, Karten über Kopf): die zwei Zeilen auf
       \`uv.setX(i, uv.getX(i))\` und \`uv.setY(i, 1 + s * k)\`. */
    for (let i = 0; i < uv.count; i++) {
      const s = 1 - uv.getY(i);              // 0 am Äquator, 1 am Pol
      /* ⚠ NUR EINE ACHSE. Erster Versuch spiegelte BEIDE (u und v) in der Annahme, die Karten
         stünden um 180° gedreht — im Bild waren sie danach aufrecht, aber SPIEGELSCHRIFT (gemessen
         am Screenshot: »PCA-the-Demand-Button« von rechts nach links). Also war der Fehler von
         Anfang an nur die senkrechte Achse: die Kuppel klappt v um, u stimmte immer.
         Merksatz: bevor man zwei Achsen dreht, prüft man, ob Spiegelschrift oder Kopfstand vorliegt —
         das eine ist eine Achse, das andere zwei. */
      uv.setY(i, -(1 + s * k));              // v umgekehrt (Wiederholung nach oben)
    }
    uv.needsUpdate = true;
    const pos = geo.attributes.position, col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const t = Math.min(1, pos.getY(i) / tiefe);
      const v = 1 - SPEC.rampe * Math.pow(t, 1.25);
      col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = v;
    }
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    /* Das Material des unteren Trichters, wenn es steht: gleiche Textur, gleiche Flags, gleicher
       Zustand. Ein zweites Material mit denselben Werten wäre ein zweiter Ort, an dem man es
       ändern muss. */
    this.mat = hi.matTrichter || new T.MeshBasicMaterial({
      map: hi.tex, side: T.BackSide, toneMapped: false, fog: false,
      vertexColors: true, depthTest: false, depthWrite: false
    });
    const m = new T.Mesh(geo, this.mat);
    m.name = 'spindel-kuppel';
    m.position.y = +(hi.hoehe / 2);          // Äquator genau auf der Mantel-OBERkante
    m.renderOrder = -800;
    m.frustumCulled = false;
    hi.mesh.add(m);
    this.kuppel = m; this.kuppelTiefe = tiefe;
    this.log('Kuppel oben · R ' + R + ' · Tiefe ' + tiefe + ' u · Scheitel y ' + (hi.mesh.position.y + hi.hoehe / 2 + tiefe).toFixed(1));
    this._seeBauen('unten', this.see);
    this._seeBauen('oben', this.oben);
    return 1;
  }

  /* ── E3 · Der See ─────────────────────────────────────────────────────────────────────────────
     Eine Scheibe, ein Shader, zwei Zweige. Der Radius folgt aus der Wand (siehe Kopf), die Lage
     also auch — nichts daran ist geschätzt. */
  _seeBauen(wo, preset) {
    const T = this.THREE, hi = this.hi;
    if (!hi) return null;
    const alt = wo === 'oben' ? this.seeOben : this.seeM;
    if (alt) { if (alt.parent) alt.parent.remove(alt); alt.geometry.dispose(); alt.material.dispose(); }
    if (wo === 'oben') this.seeOben = null; else this.seeM = null;
    if (!preset || preset === 'aus') return null;
    const R = hi.radius, f = this.f || SPEC.seeF;
    const rD = +(R * f).toFixed(2);
    const yv = +(SPEC.stauch * R * Math.sqrt(Math.max(0, 1 - f * f))).toFixed(2);
    const geo = new T.CircleGeometry(rD, 96);
    geo.rotateX(-Math.PI / 2);                       // waagerecht
    const mat = this._seeMaterial(preset);
    const m = new T.Mesh(geo, mat);
    m.name = 'spindel-see-' + wo;
    m.position.y = wo === 'oben' ? (hi.hoehe / 2 + yv) : -(hi.hoehe / 2 + yv);
    m.renderOrder = -799;                            // NACH dem Abschluss (−800), der depthTest aus hat
    m.frustumCulled = false;
    hi.mesh.add(m);
    if (wo === 'oben') this.seeOben = m; else this.seeM = m;
    if (wo === 'unten') this._glutBauen(preset);
    const weltY = hi.mesh.position.y + m.position.y;
    const dist = this.camera ? this.camera.position.distanceTo(new T.Vector3(0, weltY, 0)) : null;
    this.log('See ' + wo + ' · ' + preset + ' · Radius ' + rD + ' u · y ' + weltY.toFixed(1)
      + (dist != null ? ' · ' + dist.toFixed(1) + ' u von der Kamera (far 120)' : ''));
    return m;
  }

  /* Die Farbe kommt aus dem Deck, nicht aus einer zweiten Tabelle: `hi.basis` ist der gemessene
     Mittelwert der Kartenmotive (himmel.v3 §3). Der heiße Ton bleibt im Kanon — Gold #f2c93c und
     Rot #b8361f, dieselben, mit denen die Karten gedruckt sind. */
  _seeMaterial(preset) {
    const T = this.THREE, hi = this.hi;
    const b = hi && hi.basis ? hi.basis : [58, 48, 40];
    const farbe = new T.Color(b[0] / 255, b[1] / 255, b[2] / 255);
    const heiss = new T.Color(preset === 'lava' ? 0xf2c93c : 0xe9c14a);
    const glut = new T.Color(0xb8361f);
    return new T.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }, uPreset: { value: PRESETS[preset] != null ? PRESETS[preset] : 0 },
        uFarbe: { value: farbe }, uHeiss: { value: heiss }, uGlut: { value: glut },
        uDeckung: { value: 1 }
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'precision highp float;',
        'varying vec2 vUv;',
        'uniform float uTime, uPreset, uDeckung;',
        'uniform vec3 uFarbe, uHeiss, uGlut;',
        // Wert-Rauschen, hash-basiert: drei Zeilen statt einer Textur. Zwei Oktaven reichen fuer
        // eine Kruste; mehr kostet Fuellrate fuer etwas, das 84 u weit weg liegt.
        'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
        'float noise(vec2 p) {',
        '  vec2 i = floor(p), f = fract(p);',
        '  vec2 u = f * f * (3.0 - 2.0 * f);',
        '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),',
        '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
        '}',
        'void main() {',
        '  vec2 p = (vUv - 0.5) * 2.0;',
        '  float r = length(p);',
        '  if (r > 1.0) discard;',
        // Der Rand laeuft in die Trichterwand aus — ohne diesen Abfall waere die Scheibe eine
        // Scheibe (harte Kreiskante im Schlund, genau der zweimal durchgefallene Scheibenboden).
        '  float rand = smoothstep(1.0, 0.74, r);',
        '  vec3 c; float a;',
        '  if (uPreset < 0.5) {',
        // WIRBEL: Winkel + Kehrwert des Radius = logarithmische Spirale. Zur Mitte dreht sie
        // schneller, das ist der Sog; der Kern bleibt schwarz (das »schwarze Loch«).
        '    float w = atan(p.y, p.x) * 2.0 + 3.2 / max(r, 0.07) - uTime * 0.55;',
        '    float band = pow(0.5 + 0.5 * sin(w), 2.2);',
        '    float w2 = atan(p.y, p.x) * 3.0 - 5.1 / max(r, 0.09) + uTime * 0.31;',
        '    band = max(band, pow(0.5 + 0.5 * sin(w2), 3.0) * 0.7);',
        '    float schlund = smoothstep(0.36, 0.06, r);',
        '    c = mix(uFarbe * 0.22, uHeiss, band * (0.30 + 0.70 * (1.0 - r)));',
        '    c = mix(c, uGlut * 0.55, band * schlund);',
        '    c = mix(c, vec3(0.015, 0.012, 0.018), schlund);',
        '    a = rand * uDeckung;',
        '  } else {',
        // LAVA: Kruste (Basalt) mit gluehenden Adern. Domain-Warp mit zwei Frequenzen, damit die
        // Kruste kriecht statt zu blinken — dieselbe Lehre wie beim Dunst: eine Periode, die nicht
        // ins Bild passt, statt mehr Tempo.
        '    vec2 q = p * 2.7;',
        '    q += 0.45 * vec2(sin(uTime * 0.13 + q.y * 1.3), cos(uTime * 0.11 + q.x * 1.1));',
        '    float n = noise(q) * 0.62 + noise(q * 2.3 + 7.0) * 0.38;',
        '    float kruste = smoothstep(0.44, 0.54, n);',
        '    vec3 basalt = mix(vec3(0.10, 0.08, 0.075), uFarbe * 0.35, 0.35);',
        '    vec3 gluehen = mix(uGlut, uHeiss, smoothstep(0.42, 0.72, n));',
        '    c = mix(gluehen, basalt, kruste * 0.88);',
        '    c += uHeiss * 0.75 * (1.0 - smoothstep(0.0, 0.055, abs(n - 0.49)));',
        '    c *= 0.55 + 0.45 * (1.0 - r * 0.8);',
        '    a = rand * uDeckung;',
        '  }',
        '  gl_FragColor = vec4(c, a);',
        '}'
      ].join('\n'),
      /* ⚠ `depthTest: false` WAR DER GRUND, WARUM DER WIRBEL ÜBER DER KARTE LAG (Georg 09.09.,
         Screenshot 1). three sortiert transparente Objekte in eine EIGENE Warteschlange, die NACH
         allen opaken läuft — `renderOrder −799` ordnet also nur innerhalb der Transparenten, nicht
         gegen die Karte. Ohne Tiefenprüfung malt der See deshalb über ein Blatt, das längst
         gezeichnet ist. Mit Tiefenprüfung entscheidet die Geometrie, und die ist eindeutig: die
         Karte liegt 83 u davor. Abschluss und Kuppel schreiben keine Tiefe, sie verdecken den See
         also weiterhin nicht.
         Merksatz: renderOrder ordnet innerhalb einer Warteschlange, nicht zwischen zwei. */
      transparent: true, depthTest: true, depthWrite: false, side: T.DoubleSide,
      toneMapped: false, fog: false
    });
  }

  /* ⚠ DER SEE IST GEMESSEN SICHTBAR UND IM BILD WINZIG — und das ist Geometrie, keine Meinung:
     der Mantel hat sechs Reihen a 20 u, seine Unterkante liegt 60 u tief, und die Karte selbst
     deckt vom Blickfeld nach unten rund 70° ab. Was unten leuchtet, sieht man also nur am
     Kartenrand vorbei. Ein groesserer See waere die falsche Antwort (er verdeckt die
     zusammenlaufenden Reihen, also genau das, was den Trichter erzaehlt).
     Die richtige Antwort ist LICHT statt Flaeche: eine additive Glutplatte auf halber Trichterhoehe,
     in der Farbe des Sees, mit weichem Rand. Sie erzaehlt »da unten brennt etwas«, ohne die Wand
     zu verdecken — die Reihen bleiben lesbar, sie werden nur von unten angeleuchtet.
     Ein Zeichenaufruf, additiv, ohne Tiefenschreiben. RUECKWEG: `glut: false` im Konstruktor.
     Merksatz: was zu weit weg ist, um es zu zeigen, zeigt man als Licht. */
  _glutBauen(preset) {
    const T = this.THREE, hi = this.hi;
    if (this.glut) { if (this.glut.parent) this.glut.parent.remove(this.glut); this.glut.geometry.dispose(); this.glut.material.dispose(); this.glut = null; }
    if (!hi || !preset || preset === 'aus' || this.glutAus) return null;
    const heiss = new T.Color(preset === 'lava' ? 0xf2c93c : 0xe9c14a);
    const glut = new T.Color(0xb8361f);
    const geo = new T.CircleGeometry(hi.radius * 0.92, 64);
    geo.rotateX(-Math.PI / 2);
    const mat = new T.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uA: { value: heiss }, uB: { value: glut }, uStaerke: { value: preset === 'lava' ? 0.5 : 0.34 } },
      vertexShader: ['varying vec2 vUv;', 'void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'].join('\n'),
      fragmentShader: [
        'precision highp float;', 'varying vec2 vUv;', 'uniform float uTime, uStaerke;', 'uniform vec3 uA, uB;',
        'void main() {',
        '  vec2 p = (vUv - 0.5) * 2.0; float r = length(p);',
        '  if (r > 1.0) discard;',
        '  float puls = 0.82 + 0.10 * sin(uTime * 0.7) + 0.08 * sin(uTime * 0.41 + 1.7);',
        '  float fall = pow(1.0 - r, 2.3);',
        '  vec3 c = mix(uB, uA, fall);',
        '  gl_FragColor = vec4(c * fall * uStaerke * puls, 1.0);',
        '}'
      ].join('\n'),
      transparent: true, blending: T.AdditiveBlending, depthTest: true, depthWrite: false,
      side: T.DoubleSide, toneMapped: false, fog: false
    });
    const m = new T.Mesh(geo, mat);
    m.name = 'spindel-glut';
    m.position.y = -(hi.hoehe / 2) * 0.55;
    m.renderOrder = -798;
    m.frustumCulled = false;
    hi.mesh.add(m);
    this.glut = m;
    this.log('Glutplatte auf y ' + (hi.mesh.position.y + m.position.y).toFixed(1) + ' · R ' + (hi.radius * 0.92).toFixed(1) + ' u · additiv (' + preset + ')');
    return m;
  }

  /** Wie tief der See im Schlund sitzt (Anteil des Radius). Groesser = weiter oben und breiter. */
  setGroesse(f) {
    const w = Math.max(0.35, Math.min(0.98, +f || SPEC.seeF));
    if (Math.abs(w - this.f) < 0.005) return false;
    this.f = w;
    this._seeBauen('unten', this.see); this._seeBauen('oben', this.oben);
    return true;
  }

  /** Preset im Bild wechseln (Regler). Baut die Scheibe neu — ein Shaderzweig ist billig, aber die
      Lage hängt am Preset nicht, also ist der Neubau ein Austausch und kein Umbau. */
  setSee(wo, preset) {
    if (wo === 'oben') { if (preset === this.oben) return false; this.oben = preset; }
    else { if (preset === this.see) return false; this.see = preset; }
    this._seeBauen(wo, preset);
    return true;
  }

  update(dt) {
    this.zeit += dt || 0;
    for (const m of [this.seeM, this.seeOben, this.glut]) if (m && m.material.uniforms) m.material.uniforms.uTime.value = this.zeit;
    /* Die Deckung wird alle zwei Sekunden gemessen, nicht jedes Bild: 45 Strahlen gegen zwei
       Kuppeln sind billig, aber nicht kostenlos, und eine Kulisse ändert sich nicht in 16 ms.
       Die Probe sagt DANN, wie alt die Zahl ist — eine Messung ohne Alter ist eine Behauptung. */
    if (this.zeit - this._messZeit > 2) { this._messZeit = this.zeit; this._deckungMessen(); }
  }

  /* ── E2 · Boden C29 · Ist die Spindel WIRKLICH zu? ────────────────────────────────────────────
     Gemessen wird mit Strahlen von der Kamera aus, nach oben UND nach unten, über drei Azimute
     (Nähte liegen an Segmentgrenzen). Ein Fehlstrahl heißt: dort ist ein Loch. Ein Treffer jenseits
     `far` heißt: dort ist Geometrie, die nie rasterisiert wird — in v3 war genau das der Fall, und
     der Abschluss galt trotzdem als geschlossen.
     Merksatz: eine Fläche, die hinter der Sichtweite liegt, ist kein Abschluss, sondern ein Alibi. */
  _deckungMessen() {
    const T = this.THREE, hi = this.hi, cam = this.camera;
    if (!hi || !cam) return null;
    const bezug = new T.Vector3(0, SPEC.augeY, 0);
    this.deckung = this._strahlen(bezug, cam.far || 120);
    /* Die lebende Kamera als AUSKUNFT, nicht als Boden (siehe SPEC.augeY). */
    this.live = this._strahlen(cam.position, cam.far || 120);
    return this.deckung;
  }

  _strahlen(von, far) {
    const T = this.THREE, hi = this.hi;
    const ziele = [hi.mesh, hi.trichter, this.kuppel, this.seeM, this.seeOben].filter(Boolean);
    const rc = new T.Raycaster();
    rc.far = far;
    const dir = new T.Vector3();
    let fehlOben = 0, fehlUnten = 0, maxD = 0, jenseits = 0, n = 0;
    const proben = [];
    for (const yawDeg of SPEC.strahlen.yaw) {
      const yaw = yawDeg / 57.3;
      for (const seite of ['oben', 'unten']) {
        for (const pDeg of SPEC.strahlen[seite]) {
          const p = (seite === 'oben' ? 1 : -1) * pDeg / 57.3;
          dir.set(Math.sin(yaw) * Math.cos(p), Math.sin(p), Math.cos(yaw) * Math.cos(p)).normalize();
          rc.set(von, dir);
          const tr = rc.intersectObjects(ziele, true);
          n++;
          if (!tr.length) { if (seite === 'oben') fehlOben++; else fehlUnten++; proben.push(seite + ' ' + pDeg + '°/' + yawDeg + '° LEER'); continue; }
          const d = tr[0].distance;
          if (d > maxD) maxD = d;
          if (d > far) jenseits++;
        }
      }
    }
    return { strahlen: n, fehlOben, fehlUnten, jenseits, maxD: +maxD.toFixed(1), far, leer: proben.slice(0, 4) };
  }

  probe() {
    const d = this.deckung;
    return {
      kuppel: !!this.kuppel,
      kuppelTiefe: this.kuppelTiefe || null,
      seeUnten: this.see, seeOben: this.oben,
      seeF: +(this.f || SPEC.seeF).toFixed(2),
      seeR: this.hi ? +(this.hi.radius * (this.f || SPEC.seeF)).toFixed(2) : null,
      /* ⚠ IM BILD ODER NICHT — projiziert, nicht geschaetzt. Genau diese Zahl hat den unsichtbaren
         See von 0,62 entlarvt: NDC y −2,78 heisst fast drei Bildhoehen unter dem Rand. */
      imBild: (() => {
        if (!this.seeM || !this.camera) return null;
        const T = this.THREE, wp = new T.Vector3();
        this.seeM.getWorldPosition(wp);
        const n = wp.project(this.camera);
        return { x: +n.x.toFixed(2), y: +n.y.toFixed(2), drin: Math.abs(n.x) <= 1 && Math.abs(n.y) <= 1 && n.z <= 1 };
      })(),
      seeY: this.seeM && this.hi ? +(this.hi.mesh.position.y + this.seeM.position.y).toFixed(1) : null,
      seeDist: this.seeM && this.camera && this.hi
        ? +this.camera.position.distanceTo(new this.THREE.Vector3(0, this.hi.mesh.position.y + this.seeM.position.y, 0)).toFixed(1) : null,
      glut: !!this.glut,
      zeit: +this.zeit.toFixed(1),
      messAlter: +(this.zeit - this._messZeit).toFixed(1),
      deckung: d,
      /* Auskunft, kein Boden: von wo der Prüfer gerade schaut und ob DORT etwas aufreißt. */
      live: this.live ? { fehlOben: this.live.fehlOben, fehlUnten: this.live.fehlUnten, maxD: this.live.maxD,
        vonY: this.camera ? +this.camera.position.y.toFixed(1) : null } : null
    };
  }

  /** Tor C29: rundum dicht und alles innerhalb der Sichtweite. */
  tor() {
    const p = this.probe();
    if (!p.kuppel) return { pass: false, wait: true, text: 'Kuppel nicht gebaut' };
    if (!p.deckung) return { pass: false, wait: true, text: 'Deckung noch nicht gemessen' };
    const d = p.deckung;
    const ok = d.fehlOben === 0 && d.fehlUnten === 0 && d.jenseits === 0;
    return {
      pass: ok, wait: false,
      text: (ok ? 'C29 ✓ ' : 'C29 ✗ ') + d.strahlen + ' Strahlen · ' + d.fehlOben + ' fehl oben · '
        + d.fehlUnten + ' fehl unten · ' + d.jenseits + ' jenseits far ' + d.far + ' · max ' + d.maxD + ' u'
        + (d.leer.length ? ' · ' + d.leer.join(' | ') : '')
    };
  }

  zeile() {
    const p = this.probe();
    if (!p.kuppel) return '[spindel] nicht gebaut';
    const d = p.deckung;
    return '[spindel] Kuppel ' + p.kuppelTiefe + ' u · See ' + p.seeUnten + ' (R ' + p.seeR + ' u = ' + p.seeF + '×R, y ' + p.seeY + ', ' + p.seeDist + ' u weit'
      + (p.imBild ? ', NDC y ' + p.imBild.y + (p.imBild.drin ? ' IM BILD' : ' außerhalb') : '') + ')'
      + ' · oben ' + p.seeOben
      + (d ? ' · Spielpose ' + d.fehlOben + '/' + d.fehlUnten + ' fehl oben/unten, max ' + d.maxD + ' u (vor ' + p.messAlter + ' s)' : ' · Deckung ungemessen')
      + (p.live ? ' · Kamera bei y ' + p.live.vonY + ': ' + p.live.fehlOben + '/' + p.live.fehlUnten + ' fehl' : '');
  }

  /** Rückweg: Kuppel und Seen weg, der Himmel ist wieder der von v3. */
  aus() {
    for (const m of [this.kuppel, this.seeM, this.seeOben, this.glut]) {
      if (!m) continue;
      if (m.parent) m.parent.remove(m);
      m.geometry.dispose();
      if (m.material !== this.mat || m !== this.kuppel) m.material.dispose();
    }
    this.kuppel = null; this.seeM = null; this.seeOben = null; this.glut = null; this.deckung = null;
    this.log('aus — Himmel wie in v3 (oben offen)');
    return true;
  }
}
