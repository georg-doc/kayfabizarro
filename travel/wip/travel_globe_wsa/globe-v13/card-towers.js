// ============================================================================
// card-towers.js — KFB Travel Globe v3 · S3d · Landmarken aus Karten
// ----------------------------------------------------------------------------
// Georgs Entscheidung (29.8.): „Cut-outs für Kleinzeug, Türme für große Landmarken", Karten aus
// dem Welt-Deck, „die Landmarke IST das Sammelziel". Die Cut-outs liefert `sky-cards.js` (immer
// zur Kamera, gedämpft). **Der Turm ist das, was sky-cards NICHT kann: er steht.**
//
// Drei Entscheidungen, jede mit Grund:
//
// 1 **Ein Blatt = ein Mesh, nicht ein Quader mit sechs Materialgruppen.** Eine `BoxGeometry` mit
//   Materialarray kostet sechs Draw-Calls; bei zehn Türmen mit drei Etagen wären das 180. Ein
//   flacher Quader mit EINEM Material (Karte auf allen Flächen, Dicke 0,01 — die Schmalseiten
//   sieht niemand) kostet einen. Zehn Türme × 3 Etagen = 30 Calls.
// 2 **Die Textur kommt aus `sky-cards.js`** (`cardTexture`), nicht aus einer zweiten Pipeline.
//   Ein zweiter Kartenmaler war in v2 die Ursache für Gutter und Doppelkante — dieselbe Regel
//   gilt hier: EIN Maler, eine Tuschekante.
// 3 **Der Turm steht auf dem BAUPLATZ aus S3a.** Er liest seine Höhe nicht selbst, sondern nimmt
//   `site.alt` — das ist die Zonenhöhe, dieselbe Zahl, die Flugphysik, Mesh und Schatten sehen.
//
// Das Kartenhaus-Motiv ist Absicht: gegeneinander verdrehte Blätter, jedes leicht geneigt, die
// Neigung wächst nach oben. Aus dem Flug liest man Silhouette und Motiv, im Anflug den Titel.
//
//   const t = createCardTowers({ THREE, radius: 5, sites, textureFor });
//   scene.add(t.group);   t.setDeck(cards);   t.update(dt);
// ============================================================================

function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createCardTowers(opts = {}) {
  const THREE = opts.THREE;
  const R = opts.radius != null ? opts.radius : 5;
  const textureFor = opts.textureFor;          // (card, seed) → THREE.Texture
  const P = Object.assign({
    max: 10,            // wie viele Standorte Türme bekommen (der Rest bleibt Kenney)
    width: 0.115,       // Blattbreite in Weltmaß — 1,5× die Flugkarte, damit sie im Flug liest
    aspect: 1.74,       // Sollformat (CARD_AR); die Textur bringt es mit
    thick: 0.01,
    etagen: [2, 4],     // Blätter je Turm
    lean: 0.16,         // Neigung des obersten Blatts (rad), wächst linear nach oben
    twist: 0.9,         // Verdrehung je Etage (rad), Vorzeichen wechselt
    sway: 0.05,         // Schwanken in rad — das Kartenhaus atmet, es tanzt nicht
    swayHz: 0.14,
    // v3 · S7b · Reaktion auf Kontakt (Georgs Wegweiser-Regel)
    reaktSpin: 7.0,      // Anfangs-Drehrate um die Pfahl-Achse (rad/s)
    reaktDamp: 2.6,      // Dämpfung der Drehung (1/s)
    // ⚠ **A5, und der Befund ist größer als die Notiz im Critique.** Dort stand „ReaktSpin auf
    // ≤ 25° klemmen · Rückweg ist gebaut, nur der Gesamtwinkel fehlt". **Der Rückweg war NICHT
    // gebaut.** Gemessen am laufenden Bild (1.9., ein `hit`, 7 s in 60-Hz-Schritten):
    //     Ausschlag **150,9°**, danach dauerhaft stehen geblieben.
    // Die Rechnung dazu ist eine Zeile: eine gedämpfte Drehung ohne Feder läuft
    // ∫v₀·e^(−λt)dt = **v₀/λ = 7,0/2,6 = 2,69 rad = 154,3°** — die Messung liegt 2 % darunter,
    // also stimmt das Modell. `yaw` wurde integriert und nie zurückgenommen; der Zielservo schreibt
    // `q0`, und `yaw` liegt als Faktor DARÜBER. **Ein einmal angestreiftes Schild weist danach
    // 151° daneben, für immer** — und weist damit auf nichts.
    // Schlimmer als der Fehler ist, dass er unsichtbar war: `weiserTor()` meldete direkt nach dem
    // Treffer `servo lag Ø 0,0°, max 0,0°`. Die Zeile misst die Servo-Abweichung von `aimYaw`, und
    // der Reaktionsversatz sitzt hinter dem Servo. **Ein Instrument, das nur den einen Weg prüft,
    // auf dem es selbst rechnet, bestätigt sich statt zu prüfen** — die Zeile misst ihn jetzt mit.
    // Zwei Zahlen, zwei Aufgaben: die Klemme besitzt den WINKEL, die Rückfeder die HEIMKEHR. Die
    // Anfangsrate bleibt bei 7,0, weil sie den STOSS macht — mit Klemme erreicht sie 25° in 62 ms.
    reaktWinkelMax: 0.436, // 25° (Georg, D-08 · A5) — Obergrenze des Ausschlags
    reaktRueck: 0.45,      // Zeitkonstante der Rückfeder auf 0 (s)
    // ── v6 · Slice E · Teil 2 · Der Wegweiser WEIST (E-34, E-35) ────────────────────────
    // Bis v5 stand hier ein Kartenhaus mit Zufallskurs. Georgs Slice E heißt „Wegweiser & Portal":
    // ein Schild, das nichts zeigt, ist Bauschmuck.
    zeigen: true,
    aimSmooth: 1.6,      // 1/s · gedämpfter Servo auf den Kurs zum Ziel. **Lesbarkeit schlägt
                         // Physik** (dieselbe Regel, mit der `sky-cards` zur Kamera dreht): ein
                         // Schild, das jedem Bild folgt, zittert; eins mit 1,6/s dreht sichtbar.
    // E-35 · ZWEI Sorten, unterschieden durch FARBE, beide PULSIEREND. Die Zuteilung ist
    // abwechselnd nach Standort-Index — deterministisch, also in derselben Welt immer gleich.
    glow: 0.42,          // Amplitude des Pulses als Emissiv-Anteil
    // ⚠ Breite der Leuchtkontur als Anteil der halben Blattausdehnung (Georg, 1.9.: „Leuchten nur
    // als Rand/Kontur um die Karte"). 1 = das alte Verhalten, das ganze Blatt (und damit der
    // Befund). 0,12 lässt rund drei Viertel der Fläche als Motiv stehen.
    randBreite: 0.12,
    glowHz: 0.55,        // Pulsfrequenz — ein Atemzug, kein Blinker
    regenbogenHz: 0.08,  // Farbtonumlauf der Karten-Weiser (0,08 Hz = 12,5 s je Runde)
    // ⚠ **Der Regenbogen läuft NICHT über den ganzen Kreis, und das ist der Kern von E-35.**
    // Erste Fassung sweepte 0…360° — gemessen über eine Runde traf ein Karten-Weiser den
    // Portal-Hue auf **0,3°** genau. In diesem Moment sind die beiden Sorten farbgleich, und weil
    // die FORM gleich bleibt, ist die Unterscheidung dann komplett weg. Eine Eigenschaft, die
    // Bedeutung trägt, darf nicht periodisch verschwinden.
    // Also werden die Portal-Farbtöne AUSGESPART: `tabuHues` kommt vom Runner aus `PORTAL_COLORS`
    // (ein Eigentümer, weitergegeben — keine zweite Farbtabelle), und der Regenbogen wird auf die
    // übrigen Bögen abgebildet. Damit ist der Mindestabstand STRUKTURELL garantiert, nicht
    // gemessen-und-gehofft: er kann nicht kleiner werden als `regenbogenMeiden`.
    tabuHues: null,      // Array von Farbtonwerten in Grad (0…360) — vom Runner gesetzt
    regenbogenMeiden: 34, // Sperrband je Seite in Grad
    // E-34 · „Motiv erstmal RANDOM, später konfigurierbar je Spielmodus und Setting". Der
    // Parameter steht, damit die Entscheidung eine Adresse hat — und ein unbekannter Wert wird
    // GEMELDET, nicht ignoriert: ein Register, das unbekannte Schlüssel schluckt, ist ein
    // Tippfehler-Verstecker (Fehlerklasse 8).
    deckWahl: 'random',
    reaktDauer: 1.1,     // Sekunden, über die Wackeln und Squash auslaufen
    reaktKipp: 0.22,     // zusätzliches Kippen der Blätter im Ausklang (rad)
    reaktSquash: 0.16,   // Squash entlang des Pfahls
    on: true,
  }, opts.params || {});
  // E-34 · Unbekannte Deckwahl wird GEMELDET und auf den einzigen umgesetzten Wert gestellt.
  if (P.deckWahl !== 'random') {
    console.warn('[card-towers] deckWahl „' + P.deckWahl + '" ist nicht umgesetzt — es gilt '
      + '„random". Slice E kennt nur diesen Wert (E-34: später konfigurierbar je Spielmodus).');
    P.deckWahl = 'random';
  }

  const group = new THREE.Group();
  group.name = 'card-towers';
  // S3d · Der Blatt-Lieferant. `null` = Quader-Rückweg. Dieses Modul LÄDT nicht selbst: der
  // Runner besitzt den Loader, und zwei Ladewege für dasselbe Modell wären Fehlerklasse 1.
  let papier = opts.paper || null;
  const tuerme = [];
  let deck = opts.cards && opts.cards.length ? opts.cards : null;
  let gebaut = 0, blaetter = 0, mitArt = 0, reaktionen = 0;
  /** A5 · `reaktRestMax` ist der Spitzenausschlag (ein laufendes Maximum ist hier richtig: die
   *  Klemme ist eine Obergrenze, und die prüft man am Größten). Der VERBLEIBENDE Versatz wird
   *  dagegen LIVE gelesen, nicht als laufendes Maximum — die erste Fassung hat dort den
   *  Ausklang-Transienten festgerastet (2,4° im Moment des Hüllenendes) und ihn als Dauerfehler
   *  gemeldet. **Ein laufendes Maximum über eine Größe, die zurückkehren SOLL, verwandelt jede
   *  Bewegung in einen Befund** — genau der Fehler, den ich eine Zeile weiter oben behoben hatte. */
  let reaktRestMax = 0;
  // ── BUG-01 · EIN Zeiger für die ganze Welt der Türme ───────────────────────────────────────
  // Hier stand `deck[(i * 3 + e) % deck.length]` — und das war die Ursache von Georgs
  // *„karten wiederholen sich gerade ständig…?"*. Bei drei Blättern Schrittweite und bis zu VIER
  // Etagen greifen benachbarte Türme in denselben Bereich: Turm 0 nimmt 0,1,2,**3**, Turm 1
  // beginnt bei **3**. Gemessen in der Szene: von 38 Kartentexturen waren **8 Paare identisch**
  // (16×9-Fingerabdruck, Abstand 0,00), alle anderen Paare lagen bei mittlerer Abweichung 73,7 —
  // das Artwork war also NIE das Problem, die Zuteilung war es.
  // ⚠ Und die Messung, die „doppelteTitel 0" meldete, hatte den falschen GELTUNGSBEREICH: sie
  // verglich die sechs Flugkarten untereinander und nie gegen die 32 Wegweiser-Blätter. Ein
  // Duplikat, das über zwei Systeme verteilt liegt, ist für beide Systeme unsichtbar.
  let zeiger = 0;

  const _Y = new THREE.Vector3(0, 1, 0);
  const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _rq = new THREE.Quaternion();
  const _d = new THREE.Vector3(), _f = new THREE.Vector3(), _c = new THREE.Vector3();
  const _farbe = new THREE.Color(), _hsl = {};
  /** (turm) → { pos, farbe } | null — gesetzt vom Runner. Dieses Modul kennt weder Portale noch
   *  Karten: es kennt ZIELE. Sonst hätte der Wegweiser eine Meinung darüber, was wichtig ist. */
  let zielFn = null;
  let ohneZiel = 0, fehlerSumme = 0, fehlerZahl = 0;
  /** Farbabstand der beiden Sorten: JETZT und das schlechteste, was diese Sitzung gesehen hat.
   *  Ein Puls ist zeitabhängig — eine Momentaufnahme kann eine Sorte nicht freisprechen. */
  let farbJetzt = null, farbMin = null;

  /** Farbton des Regenbogens: `u ∈ [0,1)` wird auf die ERLAUBTEN Bögen abgebildet (alles außerhalb
   *  der Sperrbänder um die Portal-Farbtöne). Ohne `tabuHues` der volle Kreis — dann gibt es auch
   *  keine zweite Sorte, deren Farbe man treffen könnte. */
  function regenbogenAnteil(u) {
    const tabu = P.tabuHues;
    if (!tabu || !tabu.length) return u;
    const m = Math.max(0, Math.min(80, P.regenbogenMeiden));
    const s = tabu.slice().sort((a, b) => a - b);
    const boegen = [];
    let total = 0;
    for (let i = 0; i < s.length; i++) {
      const a = s[i] + m;
      const naechste = s[(i + 1) % s.length] + (i === s.length - 1 ? 360 : 0);
      const len = (naechste - m) - a;
      if (len > 1) { boegen.push({ a, len }); total += len; }
    }
    if (!total) return u;   // die Sperrbänder decken den Kreis — dann lieber der volle Kreis als nichts
    let x = ((u % 1) + 1) % 1 * total;
    for (const b of boegen) {
      if (x <= b.len) return ((((b.a + x) % 360) + 360) % 360) / 360;
      x -= b.len;
    }
    return u;
  }

  /** Ein Turm auf einem Standort. `site` kommt aus `globe-zones.planSites` (+ `planZones`). */
  function bauen(site, i) {
    const rnd = mulberry32(1234 + i * 7919);
    const anz = P.etagen[0] + Math.floor(rnd() * (P.etagen[1] - P.etagen[0] + 1));
    const grp = new THREE.Group();
    // Ort und Lage: lokale Y-Achse auf die Flächennormale, dann Kurs um die Normale — dieselbe
    // Konstruktion wie bei den Props, damit ein Turm neben einem Baum nicht anders steht.
    _q.setFromUnitVectors(_Y, site.n);
    _q2.setFromAxisAngle(site.n, site.yaw);
    grp.quaternion.copy(_q2).multiply(_q);
    grp.position.copy(site.n).multiplyScalar(R + site.alt);
    group.add(grp);

    const w = P.width, h = w / P.aspect;
    const etagen = [];
    let y = 0;
    for (let e = 0; e < anz; e++) {
      // ── S3d-Nachbesserung · echtes Papier statt Quader ────────────────────────────────────
      // Georg: „dadurch werden wir auch den 'Box'-Look der Karten/Schilder los." Der war wörtlich
      // einer: hier stand `BoxGeometry(w, h, 0.01)` — sechs planparallele Flächen mit scharfen
      // Kanten. Aus der Ferne ein Rechteck mit Rahmen, und genau so sah es aus. Ein Blatt Papier
      // hat keine Schmalseiten, es hat eine Silhouette mit leichter Wölbung.
      // `paper-card` liefert die; ist es nicht (noch) geladen, bleibt der Quader als Rückweg —
      // ein Wegweiser ohne Blatt wäre ein Loch in der Welt.
      const bw = w * (1 - e * 0.08), bh = h * (1 - e * 0.06);
      const karte = deck ? deck[(zeiger++) % deck.length] : { title: 'KFB', deck: 'Travel' };
      const seed = 4000 + i * 31 + e * 7;
      const eigen = papier && papier.blatt(bw, seed);
      const geo = eigen || new THREE.BoxGeometry(bw, bh, P.thick);
      const mat = new THREE.MeshLambertMaterial({
        map: textureFor ? textureFor(karte, seed) : null,
        // Das selbst gebaute Blatt hat ZWEI Lagen mit eigener Wicklung und gespiegeltem u — also
        // genügt `FrontSide`, und die Rückseite liest das Motiv richtig herum. `DoubleSide` auf
        // einer Lage hatte das Gegenteil getan: die Hälfte der Schilder zeigte die Wortmarke
        // spiegelverkehrt („orrasiBafyaK"). Nur der Quader-Rückweg braucht noch DoubleSide.
        side: eigen ? THREE.FrontSide : THREE.DoubleSide, fog: true,
      });
      // ⚠ **Georg, 1.9.: „die Wegweiser sind stumpf einfarbig, man erkennt die Karten gar nicht —
      // das ganze Konstrukt sieht fast wie ein Fehler aus."** Und er hat recht, es war einer, aber
      // nicht im Artwork: der Puls aus E-35 schreibt seine Zielfarbe als **Emissiv auf das ganze
      // Blatt** (`glow: 0,42`, Sättigung 0,85). Ein flaches Emissiv addiert sich ÜBER die Textur —
      // bei 0,42 in gesättigtem Ton übermalt es das Motiv, und je dunkler die Karte, desto
      // vollständiger. **Das Motiv war nie weg, es lag unter der Farbe.**
      // Georgs Entscheidung (1.9.): *Leuchten nur als Rand/Kontur um die Karte.*
      // Umgesetzt als Maske im Shader statt als zweites Netz: das Emissiv wird mit dem Abstand zur
      // Blattkante multipliziert, also leuchtet der Rand und die Fläche bleibt Motiv. Kosten: null
      // zusätzliche Draw-Calls (ein zweites Randnetz je Blatt wären 32 mehr).
      // ⚠ Die Maske rechnet mit **`position.xy`**, nicht mit den UVs: das selbst gebaute Blatt hat
      // zwei Lagen mit GESPIEGELTEM u, und `uv` ist im Vertex-Shader nur deklariert, wenn das
      // Material eine Textur trägt — eine Karte ohne Artwork hätte den Shader zerlegt.
      geo.computeBoundingBox();
      const bbx = Math.max(1e-5, geo.boundingBox.max.x), bby = Math.max(1e-5, geo.boundingBox.max.y);
      mat.emissive = new THREE.Color(0x000000);
      mat.userData.rand = { value: P.randBreite };
      mat.customProgramCacheKey = () => 'kfb-signpost-rim';
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.kfbHalb = { value: new THREE.Vector2(bbx, bby) };
        sh.uniforms.kfbRand = mat.userData.rand;
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec2 kfbXY;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nkfbXY = position.xy;');
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>',
            '#include <common>\nvarying vec2 kfbXY;\nuniform vec2 kfbHalb;\nuniform float kfbRand;')
          .replace('#include <emissivemap_fragment>',
            `#include <emissivemap_fragment>
            // 0 an der Kante, 1 in der Mitte — in BEIDEN Achsen, also ist das Minimum der Abstand
            // zur nächsten Kante. Ein Rand von 12 % lässt 76 % der Fläche unangetastet.
            float kfbD = min(1.0 - abs(kfbXY.x) / kfbHalb.x, 1.0 - abs(kfbXY.y) / kfbHalb.y);
            totalEmissiveRadiance *= 1.0 - smoothstep(0.0, max(0.001, kfbRand), kfbD);`);
      };
      const mesh = new THREE.Mesh(geo, mat);
      // Aufrecht: das Blatt steht auf seiner langen Kante, Motiv nach außen.
      mesh.position.set(0, y + h / 2, 0);
      const tw = P.twist * (e % 2 ? 1 : -1) * (0.6 + rnd() * 0.6);
      mesh.rotation.y = tw;
      const le = P.lean * ((e + 1) / anz);
      mesh.rotation.z = (rnd() - 0.5) * 2 * le;
      grp.add(mesh);
      etagen.push({ mesh, mat, geo, karte, seed, art: false,
                    phase: rnd() * Math.PI * 2, baseZ: mesh.rotation.z, baseY: tw });
      y += h * 0.92;                       // Blätter überlappen leicht — kein Stapel mit Luft
      blaetter++;
    }
    gebaut++;
    // v3 · S7b · `q0` ist die RUHELAGE. Ohne sie könnte die Reaktionsdrehung nicht zurückkommen:
    // wer jedes Bild auf die aktuelle Quaternion multipliziert, integriert den Fehler mit.
    tuerme.push({ grp, etagen, site, hoehe: y,
                  q0: grp.quaternion.clone(), yaw: 0, yawV: 0, reakt: 0,
                  // v6 · Teil 2: Basislage OHNE Kurs (der Kurs ist ab jetzt eine Größe, die sich
                  // ändert) plus die Sorte nach E-35.
                  qBase: _q.clone(), aimYaw: site.yaw, aimInit: false,
                  sorte: (i % 2 === 0) ? 'portal' : 'karte',
                  glowPhase: rnd() * Math.PI * 2, zielFarbe: null, glowStoss: 0, fehlerGrad: null });
    site.turm = true;
  }

  function build(sites) {
    zeiger = 0;                       // ein Aufbau = ein Durchgang durchs Deck, ohne Sprünge
    const liste = (sites || []).filter((s) => s && s.n).slice(0, P.max);
    for (let i = 0; i < liste.length; i++) bauen(liste[i], i);
  }
  if (opts.sites) build(opts.sites);

  let T = 0;
  return {
    name: 'card-towers', group, params: P,
    /**
     * EIN Artwork-Auftrag je Aufruf, wie in `sky-cards.pumpArt` — und aus demselben Grund: v17
     * hat gemessen, dass sieben gleichzeitige PDF-Seitenrender die Bildrate auf 0 ziehen. Der
     * Turm, der dem Spieler am nächsten steht, kommt zuerst; ohne `player` in Reihenfolge.
     *
     * ⚠ Ohne diesen Aufruf tragen die Türme dauerhaft die TEXTFASSUNG (Georg, 29.8.: „nur noch
     * Texte/Platzhalter auf den Cards") — die Sky-Cards hatten ihre Pumpe, die Türme nicht.
     */
    pumpArt(registry, artFor, player) {
      if (!registry || !artFor || registry.pending || document.hidden) return false;
      let ziel = null, bd = 1e9;
      for (const t of tuerme) {
        const d = player ? t.grp.position.distanceTo(player) : 0;
        if (d > bd) continue;
        for (const e of t.etagen) {
          if (e.art || !e.karte || e.karte.packId == null) continue;
          ziel = e; bd = d; break;
        }
      }
      if (!ziel) return false;
      ziel.art = 'pending';
      registry.requestArt(ziel.karte, (crop) => {
        if (ziel.art !== 'pending') return;
        if (ziel.mat.map) ziel.mat.map.dispose();
        ziel.mat.map = artFor(crop, ziel.seed);
        ziel.mat.needsUpdate = true;
        ziel.art = true;
        mitArt++;
      }, () => { if (ziel.art === 'pending') ziel.art = false; });
      return true;
    },
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; group.visible = !!on; },
    /** Deck einhängen: wirkt beim nächsten Bau (die stehenden Türme behalten ihre Blätter). */
    setDeck(list) { if (list && list.length) deck = list; },
    /** Türme neu aufstellen (z. B. nachdem das Welt-Deck da ist). */
    rebuild(sites) {
      for (const t of tuerme) {
        for (const e of t.etagen) { e.geo.dispose(); if (e.mat.map) e.mat.map.dispose(); e.mat.dispose(); }
        t.grp.removeFromParent();
      }
      tuerme.length = 0; gebaut = 0; blaetter = 0;
      build(sites || (opts.sites || []));
    },
    /** Atem: zwei langwellige Sinus je Blatt, Phase je Blatt — ein Kartenhaus schwankt, es tanzt nicht.
     *  Dazu (v3 · S7b) die REAKTION auf Kontakt: Drehung um die Pfahl-Achse, die ausläuft. */
    update(dt) {
      if (!P.on) return;
      T += dt;
      const w = Math.PI * 2 * P.swayHz;
      ohneZiel = 0; fehlerSumme = 0; fehlerZahl = 0;
      for (const t of tuerme) {
        // ── v6 · Teil 2 · ZEIGEN (E-31: das NÄCHSTE, je Bild gerechnet) ───────────────────
        // Der Kurs des Schildes ist ab hier eine GRÖSSE, nicht ein Bauwert. Die Reaktionsdrehung
        // rechnet weiter gegen `q0` — nur ist `q0` jetzt die gezielte Ruhelage und wird hier
        // fortgeschrieben. Zwei Schreiber auf `grp.quaternion` gibt es damit nicht: ein
        // Eigentum (Ziel-Kurs) plus ein Modifikator (Anschlag), genau wie überall sonst.
        let ziel = null;
        if (P.zeigen && zielFn) {
          try { ziel = zielFn(t); } catch (e) { ziel = null; }
        }
        if (P.zeigen && !ziel) ohneZiel++;
        if (ziel && ziel.pos) {
          // Kurs zum Ziel als Winkel um die Standortnormale — auf der Kugel ist die Projektion in
          // die Tangentialebene die einzige ehrliche Richtung.
          _d.copy(ziel.pos).sub(t.grp.position);
          _d.addScaledVector(t.site.n, -_d.dot(t.site.n));
          if (_d.lengthSq() > 1e-8) {
            _d.normalize();
            _f.set(0, 0, 1).applyQuaternion(t.qBase);
            const zielYaw = Math.atan2(_c.crossVectors(_f, _d).dot(t.site.n), _f.dot(_d));
            const diff = Math.atan2(Math.sin(zielYaw - t.aimYaw), Math.cos(zielYaw - t.aimYaw));
            if (!t.aimInit) {
              // **Beim ERSTEN Bild wird gesetzt, nicht gedreht.** Ein Schild, das aus seinem
              // Bauwinkel erst hinschwenkt, wäre eine Animation ohne Anlass — und die Abnahme
              // hätte drei Sekunden lang 98° Restfehler gemeldet (gemessen, genau so passiert).
              // Danach zählt jeder Grad Abweichung als das, was er ist: Nachlauf hinter einem
              // Ziel, das sich bewegt.
              t.aimYaw = zielYaw; t.aimInit = true; t.fehlerGrad = 0;
            } else {
              t.aimYaw += diff * Math.min(1, P.aimSmooth * dt);
              t.fehlerGrad = Math.abs(diff) * 180 / Math.PI;
            }
            fehlerSumme += t.fehlerGrad; fehlerZahl++;
          }
          t.zielFarbe = ziel.farbe != null ? ziel.farbe : null;
        }
        _q2.setFromAxisAngle(t.site.n, t.aimYaw);
        t.q0.copy(_q2).multiply(t.qBase);
        // ── Reaktion: eine Drehung um die eigene Hochachse, gedämpft, plus ein Wackeln, das
        // mit derselben Hülle abklingt. `q0` bleibt die Ruhelage — die Drehung wird immer
        // dagegen gerechnet, nie aufaddiert.
        if (t.reakt > 0 || Math.abs(t.yawV) > 1e-4 || Math.abs(t.yaw) > 1e-4) {
          t.yawV *= Math.exp(-P.reaktDamp * dt);
          t.yaw += t.yawV * dt;
          // Rückfeder: ohne sie bleibt der Ausschlag stehen (gemessen 150,9°, Begründung oben).
          t.yaw *= Math.exp(-dt / Math.max(0.02, P.reaktRueck));
          // Klemme: der Ausschlag gehört DIESER Zahl, nicht der Anfangsrate.
          const wMax = P.reaktWinkelMax;
          if (t.yaw > wMax) { t.yaw = wMax; if (t.yawV > 0) t.yawV = 0; }
          else if (t.yaw < -wMax) { t.yaw = -wMax; if (t.yawV < 0) t.yawV = 0; }
          if (Math.abs(t.yaw) > reaktRestMax) reaktRestMax = Math.abs(t.yaw);
          t.reakt = Math.max(0, t.reakt - dt / P.reaktDauer);
          // Ruhezeit: wie lange ist die Hülle schon abgelaufen? Erst nach drei Zeitkonstanten der
          // Rückfeder ist „er steht schief" von „er kommt gerade zurück" zu unterscheiden.
          t.ruhezeit = t.reakt > 0 ? 0 : (t.ruhezeit || 0) + dt;
          _rq.setFromAxisAngle(_Y, t.yaw);
          t.grp.quaternion.copy(t.q0).multiply(_rq);
        } else {
          t.grp.quaternion.copy(t.q0);
        }
        // ── E-35 · der Puls. FARBE trägt hier Bedeutung, ohne dass die Form es tut — deshalb
        // ist sie ein eigener Kanal (Emissiv am Blatt), kein zweiter Materialsatz.
        if (t.glowStoss > 0) t.glowStoss = Math.max(0, t.glowStoss - dt / 0.5);
        const puls = 0.5 + 0.5 * Math.sin(T * Math.PI * 2 * P.glowHz + t.glowPhase);
        const staerke = P.glow * (0.35 + 0.65 * puls) + 0.5 * t.glowStoss;
        if (t.sorte === 'portal' && t.zielFarbe != null) _farbe.setHex(t.zielFarbe);
        else _farbe.setHSL(regenbogenAnteil(T * P.regenbogenHz + t.glowPhase / (Math.PI * 2)), 0.85, 0.55);
        _farbe.getHSL(_hsl);
        t.hue = _hsl.h * 360;
        const k = t.reakt * t.reakt;          // quadratisch: der Ausklang ist weich
        for (const e of t.etagen) {
          e.mat.emissive.copy(_farbe).multiplyScalar(staerke);
          if (!P.sway && !k) continue;
          e.mesh.rotation.z = e.baseZ + Math.sin(T * w + e.phase) * P.sway
                            + Math.sin(T * 26 + e.phase) * P.reaktKipp * k;
          e.mesh.rotation.y = e.baseY + Math.sin(T * w * 0.61 + e.phase * 1.7) * P.sway * 0.5;
          // Squash entlang des Pfahls, volumenerhaltend — dieselbe Sprache wie `pet-kinetics`.
          const sq = 1 + P.reaktSquash * k * Math.sin(T * 21 + e.phase * 1.3);
          e.mesh.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
        }
      }
      // ── Farbabstand der SORTEN: Minimum über ALLE Paare, nicht ein Paar (Fehlerklasse 5) ────
      // Und als laufendes Minimum, weil der Puls eine Zeitfunktion ist: die Zeile darf nicht
      // grün melden, weil man im günstigen Augenblick hingesehen hat.
      let min = 360;
      for (const a of tuerme) {
        if (a.sorte !== 'portal' || a.hue == null) continue;
        for (const b of tuerme) {
          if (b.sorte !== 'karte' || b.hue == null) continue;
          const d = Math.abs(a.hue - b.hue);
          const w2 = Math.min(d, 360 - d);
          if (w2 < min) min = w2;
        }
      }
      if (min < 360) {
        farbJetzt = min;
        if (farbMin == null || min < farbMin) farbMin = min;
      }
    },
    /** v6 · Teil 2 · Der Zielgeber. `(turm) → { pos, farbe } | null`; `farbe: null` heißt
     *  Regenbogen (Karten-Weiser). `null` als ganze Antwort heißt „kein Ziel" — und wird gezählt,
     *  nicht verschwiegen (ein Schild, das ins Leere zeigt, muss sich melden). */
    setAim(fn) { zielFn = typeof fn === 'function' ? fn : null; },
    /** Die Farbtöne, die der Regenbogen aussparen muss — vom Runner aus `PORTAL_COLORS`.
     *  Weitergegeben statt nachgeschrieben: die Portalfarbe hat EINEN Eigentümer, und wenn er sich
     *  ändert, wandert das Sperrband mit. Setzt das laufende Minimum zurück, weil ein Maß, das
     *  einen ALTEN Zustand mitschleppt, die neue Einstellung verleumdet. */
    setTabuFarben(hexListe) {
      if (!hexListe || !hexListe.length) { P.tabuHues = null; farbMin = null; return null; }
      const hues = [];
      for (const hex of hexListe) { _farbe.setHex(hex); _farbe.getHSL(_hsl); hues.push(_hsl.h * 360); }
      P.tabuHues = hues;
      farbMin = null;
      return hues.map((h) => Math.round(h));
    },
    get zeigt() { return !!(P.zeigen && zielFn); },
    /** E-35 · Der Wirker `glow` der Kaskadenschicht: ein kurzer Aufleuchter auf EINEM Schild.
     *  Die Dauerpulsation gehört dem Modul, der STOSS gehört der Partitur. */
    glowBurst(site, strength) {
      const s = Math.max(0.2, Math.min(1.5, strength == null ? 1 : strength));
      let n = 0;
      for (const t of tuerme) {
        if (site && t.site !== site) continue;
        t.glowStoss = Math.max(t.glowStoss, s); n++;
        if (site) break;
      }
      return n;
    },
    /** S3d · Blatt-Lieferant nachreichen — das GLB kommt asynchron, die Türme stehen schon.
     *  Danach `rebuild` aufrufen: bestehende Quader werden NICHT heimlich getauscht, sonst hätte
     *  die Welt zwei Blattsorten gleichzeitig. */
    setPaper(p) { papier = p || null; },
    /** Breite der Leuchtkontur. Wirkt sofort auf alle Blätter — die Uniform ist geteilt, weil sie
     *  EINE Entscheidung ist und nicht 32. */
    setRandBreite(v) {
      P.randBreite = Math.max(0.02, Math.min(1, v));
      for (const t of tuerme) for (const e of t.etagen)
        if (e.mat.userData.rand) e.mat.userData.rand.value = P.randBreite;
      return P.randBreite;
    },
    /** ⚠ **Die durchfallbare Zahl zu Georgs Befund.** Wie viel der Blattfläche das Leuchten
     *  überhaupt anfassen darf. Vorher: 100 % — deshalb war das Motiv nicht zu sehen. Gerechnet,
     *  nicht geschätzt: die Maske ist ein Rechteckring der Breite `randBreite` in beiden Achsen,
     *  der unangetastete Kern ist also `(1−r)²` der Fläche. */
    motivTor() {
      const r = P.randBreite;
      const kern = (1 - r) * (1 - r);
      const ok = kern >= 0.5;
      return {
        idle: false, ok,
        randBreite: r,
        motivAnteil: +(kern * 100).toFixed(1),
        text: (ok ? '✓' : '✗') + ' rim ' + (r * 100).toFixed(0) + ' % · '
          + (kern * 100).toFixed(0) + ' % of the sheet stays artwork'
          + (r >= 0.99 ? ' — ✗ flat glow over the whole card, the 1.9. finding' : '')
          + (!ok && r < 0.99 ? ' — ⚠ the glow owns more than half the card' : ''),
      };
    },
    /** A5 · Der Reaktionsversatz als eigene Torzeile — er saß hinter dem Servo und war deshalb
     *  für `weiserTor()` unsichtbar. Durchgefallen ist ein Versatz, der bleibt, nachdem die
     *  Reaktionshülle abgelaufen ist: dann weist das Schild dauerhaft falsch.
     *  `reset` löscht die laufenden Maxima — ein Maß, das einen ALTEN Zustand mitschleppt,
     *  verleumdet die neue Einstellung (dieselbe Regel wie bei `setTabuFarben`). */
    reaktTor(reset) {
      const grad = (r) => +(r * 180 / Math.PI).toFixed(1);
      // LIVE gelesen: der größte Versatz unter den Schildern, deren Hülle länger als drei
      // Federzeitkonstanten abgelaufen ist. Nur dort heißt ein Versatz „steht schief".
      const ruheAb = 3 * P.reaktRueck;
      let restLive = 0, ruhende = 0;
      for (const t of tuerme) {
        if (t.reakt > 0 || (t.ruhezeit || 0) < ruheAb) continue;
        ruhende++;
        if (Math.abs(t.yaw) > restLive) restLive = Math.abs(t.yaw);
      }
      const jetzt = { max: grad(reaktRestMax), rest: grad(restLive) };
      const klemme = grad(P.reaktWinkelMax);
      const ohneKlemme = grad(P.reaktSpin / P.reaktDamp);
      const ok = jetzt.rest <= 0.5 && jetzt.max <= klemme + 0.5;
      if (reset) reaktRestMax = 0;
      return {
        idle: reaktionen === 0, ok, reaktionen, ruhende,
        ausschlagMax: jetzt.max, restLive: jetzt.rest,
        klemme, ohneKlemme,
        text: (reaktionen === 0
                ? 'idle · no signpost has been hit yet (clamp ' + klemme + '°, spring ' + P.reaktRueck + ' s)'
                : (ok ? '✓' : '✗') + ' ' + reaktionen + ' hits · peak ' + jetzt.max + '° (clamp '
                  + klemme + '°) · ' + jetzt.rest + '° left on ' + ruhende + ' settled signposts'
                  + (ok ? ' — back on their aim' : ' — ✗ A SIGN STAYS TURNED and points nowhere'))
          + ' · uncapped this spin would run ' + ohneKlemme + '° (measured 150.9° on 1.9.)',
      };
    },
    get paperReady() { return !!(papier && papier.bereit); },
    /** v3 · S7b · Kontakt: Georg — „bei kontakt mit rotation um die pfahl-achse und/oder
     *  cartoon-deformer reagieren". Aufgerufen von `landmark-collide` (Klasse `react`).
     *  ⚠ **1.9., Block 3 (Georg): „gilt auch für die Wegweiser: dieselbe seitenabhängige Drehung"
     *  wie bei den Karten.** `seite` kommt jetzt von `landmark-collide` (Vorzeichen von `seit`,
     *  dort ohnehin schon berechnet) statt vom eigenen `yawV`-Vorzeichen — vorher schlug ein
     *  Schild in die Richtung aus, in der es GERADE SCHWANG, nicht in die, aus der es getroffen
     *  wurde. `seite` fehlt nur, wenn ein Aufrufer außerhalb des Kollisionswegs testet (Panel-
     *  Knopf) — dann bleibt die alte Regel als Rückweg. */
    hit(site, strength, seite) {
      const s = Math.max(0.2, Math.min(1.5, strength == null ? 1 : strength));
      for (const t of tuerme) {
        if (t.site !== site) continue;
        t.yawV = P.reaktSpin * s * (seite === 1 || seite === -1 ? seite : (t.yawV >= 0 ? 1 : -1));
        t.reakt = 1;
        reaktionen++;
        return true;
      }
      return false;
    },
    /** BUG-01 · Die Titel, die als Schild in der Welt stehen. Das Instrument, das gefehlt hat:
     *  ohne diese Liste kann keine Messung prüfen, ob eine Flugkarte gleichzeitig ein Wegweiser
     *  ist — und genau diese Frage war der ganze Bug. */
    titel() {
      const t = [];
      for (const tu of tuerme) for (const e of tu.etagen) if (e.karte && e.karte.title) t.push(e.karte.title);
      return t;
    },
    report() { return { an: P.on, tuerme: gebaut, blaetter, mitArtwork: mitArt, drawCalls: blaetter,
                        breite: P.width, deck: deck ? deck.length : 0, reaktionen,
                        zeigt: !!(P.zeigen && zielFn),
                        portalWeiser: tuerme.filter((t) => t.sorte === 'portal').length,
                        kartenWeiser: tuerme.filter((t) => t.sorte === 'karte').length,
                        ohneZiel,
                        fehlerGradMittel: fehlerZahl ? +(fehlerSumme / fehlerZahl).toFixed(1) : null,
                        // BUG-01 · ablesbar statt behauptet: so viele Deck-Plätze hat dieser
                        // Aufbau verbraucht. `verbraucht > deck` heißt: es MUSS Duplikate geben.
                        verbraucht: zeiger,
                        eindeutig: deck ? Math.min(zeiger, deck.length) : 0 }; },
    /** ⚠ **Die durchfallbare Zahl von Teil 2.** Ein Wegweiser ist die einzige Sorte Landmarke, die
     *  eine BEHAUPTUNG aufstellt („dort"), und eine falsche Behauptung ist schlimmer als keine.
     *  Vier Sätze, alle brechbar:
     *   · zwei Sorten vorhanden und BEIDE besetzt (E-35 — eine Sorte allein ist keine Unterscheidung)
     *   · kein Schild ohne Ziel (ein Zeiger ins Leere zählt sich)
     *   · Restfehler des Servos: er darf im Flug hinterherlaufen, aber nicht wegdriften
     *   · die beiden Sorten sind FARBLICH unterscheidbar — gemessen am Material, nicht behauptet
     *  Und ein leerer Eimer ist ein Ergebnis: ohne Zielgeber meldet die Zeile `idle`. */
    weiserTor() {
      if (!tuerme.length) return { idle: true, text: 'idle · 0 signposts' };
      if (!(P.zeigen && zielFn)) return { idle: true, text: 'idle · pointing off (no target source)' };
      const pw = tuerme.filter((t) => t.sorte === 'portal');
      const kw = tuerme.filter((t) => t.sorte === 'karte');
      const mittel = fehlerZahl ? fehlerSumme / fehlerZahl : 0;
      let maxFehler = 0;
      for (const t of tuerme) if (t.fehlerGrad != null && t.fehlerGrad > maxFehler) maxFehler = t.fehlerGrad;
      const zeigenText = pw.length + ' portal + ' + kw.length + ' card signposts'
        + (ohneZiel ? ' · ⚠ ' + ohneZiel + ' POINTING AT NOTHING' : ' · all have a target')
        + ' · servo lag Ø ' + mittel.toFixed(1) + '°, max ' + maxFehler.toFixed(1) + '°'
        + (maxFehler >= 25 ? ' ⚠ drifting' : '');
      const zeigenOk = pw.length > 0 && kw.length > 0 && ohneZiel === 0 && maxFehler < 25;
      // **Bei ausgeschaltetem Glow ist die Farbfrage nicht rot, sondern gegenstandslos.** Eine
      // Zeile, die durchfällt, weil man einen Effekt abgeschaltet hat, erzieht zum Überlesen
      // (Onboarding §2) — dieselbe Regel wie „ein leerer Eimer ist ein Ergebnis".
      if (P.glow < 0.02) {
        return { idle: false, ok: zeigenOk, glowAus: true, portalWeiser: pw.length,
                 kartenWeiser: kw.length, ohneZiel, fehlerMittel: +mittel.toFixed(1),
                 fehlerMax: +maxFehler.toFixed(1), farbabstand: null,
                 text: (zeigenOk ? '✓' : '⚠') + ' ' + zeigenText + ' · colour idle · glow off' };
      }
      // Garantie und Messung getrennt nennen: das Sperrband ist die ZUSAGE (strukturell), das
      // laufende Minimum die PRÜFUNG über alle Paare und die ganze Sitzung.
      const band = P.tabuHues && P.tabuHues.length ? P.regenbogenMeiden : null;
      const gemessen = farbMin;
      const farbOk = band != null && (gemessen == null || gemessen >= band - 1);
      const ok = zeigenOk && farbOk;
      return { idle: false, ok, portalWeiser: pw.length, kartenWeiser: kw.length, ohneZiel,
               fehlerMittel: +mittel.toFixed(1), fehlerMax: +maxFehler.toFixed(1),
               farbabstand: gemessen != null ? +gemessen.toFixed(1) : null,
               farbJetzt: farbJetzt != null ? +farbJetzt.toFixed(1) : null, sperrband: band,
               text: (ok ? '✓' : '⚠') + ' ' + zeigenText
                 + ' · hue gap ' + (gemessen != null ? gemessen.toFixed(0) + '° worst of all pairs this session'
                                                      : 'not measured yet')
                 + (band != null ? ' (guaranteed ≥ ' + band + '° by blocking the portal hues)'
                                 : ' ⚠ NO portal hues handed over — rainbow may run through them') };
    },
    /** Liste der Stände — `landmark-collide` braucht Ort und Größe für die Klasse `react`. */
    sites() { return tuerme.map((t) => ({ site: t.site, r: Math.max(P.width * 0.9, t.hoehe * 0.5) })); },
    dispose() { group.removeFromParent(); },
  };
}
