// ============================================================================
// karten-teppich.js — v10 · Die Karte LIEGT auf dem Gelände
// ----------------------------------------------------------------------------
// **Georgs Entscheidung (2.9.):** *„die Karte liegt flach auf dem Gelände wie ein Teppich
// (folgt den Hügeln, wird an Hängen verzerrt)"* — und für den ersten Anlauf **ohne die
// KFB-Ink-Silhouette**. Also ein Rechteck, das sich dem Boden anschmiegt, kein ausgeschnittenes
// Blatt. Die Tuschekante kann später dazukommen; sie ändert die Geometrie, nicht die Idee.
//
// **Was dieses Modul von den drei vorhandenen Kartenträgern unterscheidet:**
//   · `sky-cards.js` — die Karte SCHWEBT und dreht sich zur Kamera (Billboard).
//   · `card-towers.js` — die Karte STEHT, gestapelt, als Wegweiser.
//   · hier — die Karte LIEGT. Sie hat keine eigene Form mehr; die Form ist das Gelände.
//
// ⚠ **Warum das kein weiteres Kartenmodul mit eigenem Maler ist.** Die Textur kommt über
// `textureFor` von außen, und der Wirt reicht dort dasselbe `cardTexture` aus `sky-cards.js`
// herein, das Türme und Flugkarten benutzen. Ein zweiter Kartenmaler war in v2 die Ursache für
// Gutter und Doppelkante — dieselbe Regel gilt hier: EIN Maler, eine Kante.
// Ebenso die Höhe: dieses Modul rechnet keinen Boden aus, es fragt `bodenRadius(up)`
// (`boden-lesung.js`). Das ist derselbe Leser, mit dem der Mech steht und die Leuchttürme
// stehen — die Frage „wie hoch ist der Boden" hat in dieser Welt genau einen Eigentümer.
//
// **Die Verzerrung ist gewollt und benannt.** Das Netz wird über eine Tangentialebene
// aufgespannt und dann radial auf die gelesene Höhe gezogen. An einem Hang wird die Karte damit
// länger als sie breit ist — genau das, was ein Teppich über einem Hügel tut. Wer das nicht
// will, braucht eine Projektion, die Flächen erhält, und die kann keine Karte lesbar halten.
//
//   const tep = createKartenTeppich({ THREE, radius: 5, bodenRadius, textureFor });
//   scene.add(tep.group);
//   tep.setDeck(karten); tep.bauen(orte);   // orte = Vector3-Normalen (aus verteilung.js)
//   tep.tor();                              // eine Zeile: wie weit liegt sie über dem Grund
// ============================================================================

const KFB_CARD_AR = 1.74;   // Sollformat, Quelle: kfb-card-format.js (CARD_AR) — nie hier erfinden

export function createKartenTeppich(opts = {}) {
  const THREE = opts.THREE;
  const R = opts.radius != null ? opts.radius : 5;
  const bodenRadius = opts.bodenRadius || null;
  const textureFor = opts.textureFor || null;
  // v10 · `(anzahl) => Vector3[]` — der Wirt streut, dieses Modul legt. Ein Modul, das seine
  // eigenen Orte würfelt, ist der vierte Zufall in dieser Welt (siehe `verteilung.js`).
  const orteFn = opts.orteFn || null;
  // v11 · Land oder Wasser? Im Wasser liegt die Karte als FLOSS auf dem Meeresspiegel (Georg, Formular
  // 2.9.: „flach auf Meeresspiegel, schwimmt“). Ohne Prädikat gilt alles als Land (alter Weg).
  const istLand = opts.istLand || (() => true);

  const P = Object.assign({
    on: true,
    anzahl: 56,          // v11 · das GANZE Deck liegt in der Welt (Georg: 56 Karten bilden narrativ die Welt)
    breite: 0.44,        // Kartenbreite in Weltmaß — groß genug zum Lesen, klein genug für 56
    // ⚠ **Die Feinheit des Netzes ist eine Kostenentscheidung, keine Qualitätsfrage.**
    // 24 × 24 sind 1250 Dreiecke und 625 Bodenlesungen JE Teppich. Bei sechs Teppichen sind das
    // 3750 Lesungen — einmalig beim Bauen, nie im Bild. Feiner schmiegt sich besser an, aber
    // unterhalb der Dreiecksgröße des Globus selbst gewinnt man nichts: das Gelände hat dort
    // keine Form mehr, die man nachzeichnen könnte.
    segmente: 16,
    lift: 0.004,         // Abstand über dem gelesenen Boden (Weltmaß)
    deckkraft: 0.96,
    // v11 · Eingesammelt (Georg, abends): *„noch lesbar, aber im Vorbeiflug als ›hab ich schon‹
    // erkennbar“.* Also bleibt die Karte liegen und wird gedämpft. **Der Tuschehaken, der hier
    // zusätzlich lag, ist am 3.9. gestrichen** (Georg: „keine gute lösung, der muss weg") — die
    // Begründung steht unten am entkernten Block.
    deckkraftGesammelt: 0.5,
    tonGesammelt: 0.66,   // Materialfarbe der gesammelten Karte (Lambert multipliziert die Textur)
  }, opts.params || {});

  const group = new THREE.Group();
  group.name = 'karten-teppiche';

  let deck = [];
  let zeiger = 0;              // EIN Zeiger fürs ganze Modul — dieselbe Regel wie in card-towers
  const teppiche = [];
  let orteMerk = [];
  let bauMs = 0, gelesen = 0, ohneBoden = 0;

  const _t1 = new THREE.Vector3(), _t2 = new THREE.Vector3(), _d = new THREE.Vector3();
  const _n = new THREE.Vector3();

  // ── v11 · Der Tuschehaken für gesammelte Karten — ENTFERNT am 3.9.2026 ─────────────
  // **Georg, 3.9.: „der tusche-haken ist keine gute lösung, der muss weg → später dann besser
  // färbung oder rahmen-FX oder so".** Ersatzlos gestrichen, und der Grund gehört aufgeschrieben,
  // weil die Idee wiederkommt: die Marke sollte in derselben Sprache sprechen wie die Kartenkontur,
  // gelesen hat sie sich aber als **schwarzes „L"** — beide Schenkel fast gleich lang, `lineWidth`
  // 0,13 · 96 px, und auf einer flach liegenden Karte in Schrägsicht zusätzlich verkürzt.
  // *Ein Zeichen, das man erklären muss, ist keine Marke.*
  //
  // Und er hat noch etwas geleistet, bevor er ging: er war ein EIGENES Mesh mit eigener Textur und
  // im Bild **genauso gespiegelt wie die Kartenschrift**. Zwei unabhängige Texturen spiegeln nicht
  // gemeinsam, eine Ebene aber schon. Damit ist die Spiegelung der Wasserkarten als Sache der
  // EBENE belegt und nicht der Kartentextur (Befund S4a im Sprintplan v14).
  //
  // Was bleibt: die gesammelte Karte liegt gedämpft (`deckkraftGesammelt`, `tonGesammelt`).
  // Was kommt: Färbung oder Rahmen-FX, also eine Eigenschaft der KARTE statt eines Symbols
  // darauf — zu entscheiden, nicht zu raten.

  function rahmen(n, drehung) {
    _t1.set(Math.abs(n.y) > 0.9 ? 1 : 0, Math.abs(n.y) > 0.9 ? 0 : 1, 0);
    _t1.crossVectors(_t1, n).normalize();
    _t2.crossVectors(n, _t1).normalize();
    if (drehung) {
      const c = Math.cos(drehung), s = Math.sin(drehung);
      const ax = _t1.x * c + _t2.x * s, ay = _t1.y * c + _t2.y * s, az = _t1.z * c + _t2.z * s;
      _t2.set(_t2.x * c - _t1.x * s, _t2.y * c - _t1.y * s, _t2.z * c - _t1.z * s);
      _t1.set(ax, ay, az);
    }
  }

  /** Ein Teppich: Gitter über der Tangentialebene, jeder Punkt radial auf den GELESENEN Boden. */
  function einTeppich(n, drehung) {
    const S = P.segmente;
    const wasser = !istLand(n);
    const bw = P.breite, bh = bw / KFB_CARD_AR;
    const geo = new THREE.PlaneGeometry(bw, bh, S, S);
    const pos = geo.attributes.position;
    rahmen(n, drehung);
    let hoch = -1e9, tief = 1e9;
    for (let i = 0; i < pos.count; i++) {
      // Der Punkt der Ebene, in Weltkoordinaten neben dem Mittelpunkt aufgetragen. Bei
      // Kartenbreiten um 0,6 gegen Radius 5 ist das ein Ausschnitt von rund sieben Grad —
      // klein genug, dass die Ebene nicht spürbar von der Kugel abweicht.
      const x = pos.getX(i), y = pos.getY(i);
      _d.copy(n).multiplyScalar(R).addScaledVector(_t1, x).addScaledVector(_t2, y).normalize();
      const rb = bodenRadius ? bodenRadius(_d) : null;
      if (rb == null) ohneBoden++; else gelesen++;
      // Floß: auf Wasser zählt der Meeresspiegel (R), nie der Meeresboden darunter; wo die Karte
      // noch Land berührt (Küste), folgt sie dem Land — sonst steckte die Kante im Strand.
      // ⚠ **Der Meeresspiegel gilt JE ECKPUNKT, nicht je Karte** (Georg, 3.9.: „karten liegen
      // teilweise scheinbar unter dem wasser statt darauf zu floaten"). Erste Fassung entschied
      // `wasser` EINMAL am Kartenmittelpunkt und ließ dann bei einer LANDkarte alle Eckpunkte dem
      // Boden folgen. Eine Karte ist 0,44 u breit; an einer Küste liegt ihr Mittelpunkt an Land
      // und ihr halbes Blatt über dem Meeresboden — mehrere Hundertstel UNTER dem Spiegel. Genau
      // das „teilweise": nicht die falschen Karten, die falschen ECKEN.
      // **Wer eine Fläche an ihrer Mitte klassifiziert, hat ihre Kanten nicht gemessen.**
      // Jetzt gilt für jeden Punkt dasselbe: nie unter den Spiegel. An Land ist das wirkungslos
      // (dort liegt der Boden ohnehin über R), am Wasser ist es das Floß.
      const r = Math.max(rb != null ? rb : R, R) + P.lift;
      if (r > hoch) hoch = r;
      if (r < tief) tief = r;
      pos.setXYZ(i, _d.x * r, _d.y * r, _d.z * r);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();

    const karte = deck.length ? deck[zeiger++ % deck.length] : null;
    const mat = new THREE.MeshLambertMaterial({
      map: textureFor && karte ? textureFor(karte, 4200 + teppiche.length * 91) : null,
      transparent: true, opacity: P.deckkraft, side: THREE.FrontSide,
      // ⚠ **`polygonOffset` statt „einfach höher legen".** Ein Teppich, der weit genug über dem
      // Boden schwebt, um Z-Fighting sicher zu vermeiden, schwebt sichtbar. Der Versatz wirkt
      // dagegen erst in der Tiefenprüfung — die Karte bleibt geometrisch, wo sie liegt, und
      // gewinnt trotzdem gegen das Gelände darunter.
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    return { mesh, geo, mat, karte, n: n.clone(), spanne: hoch - tief, art: false, wasser, rOben: hoch, weg: false };
  }

  function leeren() {
    for (const t of teppiche) {
      group.remove(t.mesh);
      t.geo.dispose();
      if (t.mat.map) t.mat.map.dispose();
      t.mat.dispose();
    }
    teppiche.length = 0;
  }

  function bauen(orte) {
    if (orte) orteMerk = orte;
    else if (orteFn) orteMerk = orteFn(P.anzahl) || [];
    leeren();
    gelesen = 0; ohneBoden = 0;
    if (!P.on || !orteMerk.length) return;
    const t0 = performance.now();
    const anz = Math.min(P.anzahl, orteMerk.length);
    for (let i = 0; i < anz; i++) {
      // Die Drehung ist aus dem Ort abgeleitet, nicht gewürfelt: dieselbe Welt legt ihre Karten
      // immer gleich herum. Ein `Math.random()` hier wäre die vierte Stelle in diesem Projekt,
      // an der eine Welt bei jedem Laden anders aussieht.
      const dreh = (i * 2.399963) % (Math.PI * 2);
      const t = einTeppich(orteMerk[i], dreh);
      group.add(t.mesh);
      teppiche.push(t);
    }
    bauMs = Math.round(performance.now() - t0);
  }

  return {
    name: 'karten-teppich', group, params: P,
    get teppiche() { return teppiche; },

    setDeck(karten) { deck = Array.isArray(karten) ? karten : []; zeiger = 0; },
    /** v11 · Die Karte ist eingesammelt (Georg: „verschwindet“). Sie wird entfernt, nicht versteckt —
     *  eine unsichtbare Karte wäre weiter ein Ort für das Familien-Abstand-Tor. */
    /** v11 · Die Karte ist eingesammelt — sie bleibt LIEGEN (Georg, abends: noch lesbar, aber als
     *  gesammelt erkennbar). Nur gedämpft (der Haken ist am 3.9. gestrichen); sie bleibt ein Ort für das
     *  Familien-Abstand-Tor, was ehrlicher ist als ein unsichtbarer Belegungseintrag.
     *  Rückweg: `entfernen(karte)` gibt es weiter, wird aber nicht mehr gerufen. */
    gesammelt(karte) {
      const t = teppiche.find((x) => x.karte === karte && !x.weg && !x.gesammelt);
      if (!t) return false;
      t.gesammelt = true;
      t.mat.opacity = P.deckkraftGesammelt;
      t.mat.color.setScalar(P.tonGesammelt);
      t.mat.needsUpdate = true;
      return true;
    },
    entfernen(karte) {
      const t = teppiche.find((x) => x.karte === karte && !x.weg);
      if (!t) return false;
      group.remove(t.mesh); t.weg = true; t.mesh.visible = false;
      return true;
    },
    /** v11 · Anker für die Sky-Cards: eine je liegender Karte, über ihrer höchsten Kante. */
    anker() { return teppiche.filter((t) => !t.weg && !t.gesammelt && t.karte).map((t) => ({ n: t.n, r0: t.rOben, karte: t.karte, wasser: t.wasser })); },
    /** v11 · Für das Familien-Abstand-Tor. */
    orte() { return teppiche.filter((t) => !t.weg).map((t) => ({ familie: 'karte', n: t.n, r: P.breite / 2, wasser: t.wasser })); },
    bauen,
    neubau() { bauen(orteFn ? null : orteMerk); },

    /** Das Artwork kommt nach, wie bei Flugkarten und Türmen — EIN Auftrag je Runde.
     *  v11 · `registry` ist die **Motiv-Kasse**: die Sky-Card über dieser Karte fragt dasselbe
     *  Motiv, und ohne die Kasse wurde der zweite Frager still verworfen (dauerhafte Rückseite).
     *  v11 · `nahe` (Weltposition des Spielers) entscheidet die REIHENFOLGE: das nächste Blatt
     *  zuerst. Ohne das arbeitet die Pumpe die Bauordnung ab — also zufällig gegen den Blick. */
    pumpArt(registry, artFor, nahe) {
      if (!registry || !artFor || registry.pending || document.hidden) return false;
      let ziel = null;
      if (nahe) {
        let best = Infinity;
        for (const t of teppiche) {
          if (t.art || !t.karte || t.weg) continue;
          const d = _n.copy(t.n).multiplyScalar(t.rOben).distanceToSquared(nahe);
          if (d < best) { best = d; ziel = t; }
        }
      } else ziel = teppiche.find((t) => !t.art && t.karte && !t.weg);
      if (!ziel) return false;
      ziel.art = 'pending';
      registry.requestArt(ziel.karte, (crop) => {
        if (ziel.art !== 'pending') return;
        if (ziel.mat.map) ziel.mat.map.dispose();
        ziel.mat.map = artFor(crop, 4200 + teppiche.indexOf(ziel) * 91);
        ziel.mat.needsUpdate = true;
        ziel.art = true;
      });
      return true;
    },

    /** EINE Zeile. Die Spanne sagt, wie hügelig der Untergrund war — das ist die Zahl, an der
     *  man sieht, ob die Karte wirklich folgt oder nur flach daliegt. */
    tor() {
      if (!teppiche.length) return 'carpets off';
      let maxSpanne = 0, summe = 0;
      for (const t of teppiche) { summe += t.spanne; if (t.spanne > maxSpanne) maxSpanne = t.spanne; }
      const mit = teppiche.filter((t) => t.art === true).length;
      const imWasser = teppiche.filter((t) => t.wasser && !t.weg).length, weg = teppiche.filter((t) => t.weg).length;
      const gesamm = teppiche.filter((t) => t.gesammelt).length;
      const rueck = teppiche.filter((t) => t.karte && t.art !== true && !t.weg).length;
      return (teppiche.length - weg) + ' cards on the ground (' + imWasser + ' afloat on water'
        + (gesamm ? ', ' + gesamm + ' collected — dimmed to ' + P.deckkraftGesammelt + ', still readable (the ink hook was dropped on 3.9.)' : '')
        + (weg ? ', ' + weg + ' removed' : '') + ') · ' + P.breite.toFixed(2) + ' u wide'
        + ' · artwork ' + mit + '/' + (teppiche.length - weg) + (rueck ? ' · ' + rueck + ' still showing the back (queue, not an error — see Motif desk)' : '')
        + ' · relief ' + (summe / teppiche.length * 1000).toFixed(0) + ' mm avg'
        + ' / ' + (maxSpanne * 1000).toFixed(0) + ' mm max'
        + ' · ' + gelesen + ' ground reads' + (ohneBoden ? ' · ' + ohneBoden + ' MISSED' : '')
        + ' · built in ' + bauMs + ' ms';
    },
  };
}
