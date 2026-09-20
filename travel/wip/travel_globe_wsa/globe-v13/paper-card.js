// ============================================================================
// paper-card.js — das Blatt der Wegweiser (v3c, 29.8. · zweite Nachbesserung)
// ----------------------------------------------------------------------------
// Georg: *„für die Wegweiser können wir diese Karten für die einzelnen KFB Cover/Cards nehmen …
// dadurch werden wir auch den ‚Box'-Look der Karten/Schilder los."*
// Und danach, zweimal: *„die Wegweiserkarten sind alle blasig deformiert und broken!"* ·
// *„die wegweiser-karten sind völlig deformiert seit dem letzten Eingriff."*
//
// ── WAS DIESE FASSUNG ÄNDERT, UND WARUM ES KEINE ZAHL MEHR IST ──────────────────────────────
// Zweimal habe ich `bend` gesenkt (0,22 → 0,05) und beide Male eine ZAHL gegen ein FORMPROBLEM
// gestellt. Diese Sitzung hat es endlich ANGESEHEN statt nur gemessen, und im Bild steht:
//
//   1. Die Silhouette ist ein **Fünfeck mit Spitzen** — ein Drachen, keine Karte. `KFB_PaperCard_01`
//      ist ein Kissen (gemessen: nur 33 % der 312 Vertices nahe der Mittelebene, Hüllmaß
//      0,510 × 0,516 × 0,306). Flach skaliert bleibt die Silhouette ein Kissenumriss; nur die
//      Tiefe verschwindet. **Die Wölbung war nie das Problem, der UMRISS war es.**
//   2. Die Hälfte der Schilder zeigt die **Rückseite**: `side: DoubleSide` auf EINER Lage heißt,
//      von hinten liest man das Motiv spiegelverkehrt. Bei einem Wegweiser mit Wortmarke ist das
//      kein Schönheitsfehler, sondern ein Lesefehler — es stand „orrasiBafyaK" in der Welt.
//   3. Die planare Projektion über die Bounding Box zieht das Motiv in die Kissenspitzen. Ein
//      quadratisches Kissen auf Format 1,74 gequetscht verzerrt zusätzlich um 74 % in y.
//
// **Also wird das Blatt hier gebaut, nicht geladen.** Ein Blatt Papier ist geometrisch trivial:
// ein Rechteck im Sollformat, eine sanfte zylindrische Wölbung, aufgeworfene Ecken, ein leicht
// unruhiger Rand. Das sind zwölf Zeilen Mathematik und dafür:
//   · **exaktes Format** → das Motiv ist unverzerrt (und das Motiv ist die Information);
//   · **kein Box-Look** → es gibt keine Schmalseiten, weil es keinen Quader gibt;
//   · **kein perfektes Rechteck** → Wölbung, Eckenwurf und Randunruhe nehmen den Lineal-Eindruck,
//     der Georgs ERSTE Rüge war. Genau dafür war das GLB gedacht; es liefert es nur nicht.
//   · **beidseitig lesbar** → zwei Lagen in EINER Geometrie, die Rückseite mit gespiegeltem u.
//     Ein Draw-Call wie vorher, aber ohne `DoubleSide`-Spiegelung.
//
// ⚠ **Der Rückweg ist jetzt umgekehrt herum.** `quelle: 'glb'` holt das Kissen zurück (der Regler
// „Signpost curl" wirkt in beiden Fassungen). Es steht drin, weil eine verworfene Fassung, die man
// nicht wieder einschalten kann, keine Entscheidung dokumentiert, sondern nur eine Behauptung.
//
// ⚠ **Und die Lehre, die über dieses Modul hinausgeht:** ich habe zweimal die richtige GRÖSSE
// falsch gewählt (PM-47). Gemessen war die Wölbungs-TIEFE, kaputt war der UMRISS. Ein Hüllmaß
// sagt, wie groß etwas ist; eine z-Verteilung sagt, wo die Masse liegt; **welche FORM etwas hat,
// sagt nur der Umriss — und den sieht man, indem man hinsieht.** Drei Messungen, alle korrekt,
// alle am falschen Gegenstand.
// ============================================================================

const URL_PAPER = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/'
  + 'media/3D_Assets/KFB_PaperCard_01.glb';

/** KFB-Blattformat (Breite/Höhe, Landscape). Eine Zahl, ein Ort — `cardbuilder/kfb-card-format.js`. */
const KFB_AR = 1.74;

function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createPaperCard(opts = {}) {
  const THREE = opts.THREE;
  const loadGltf = opts.loadGltf;      // (url) => Promise<gltf> — nur für `quelle: 'glb'`
  const P = Object.assign({
    on: true, url: URL_PAPER,
    // 'eigen' = selbst gebautes Blatt (Standard) · 'glb' = das Kissen aus dem Modell (Rückweg)
    quelle: 'eigen',
    // ── `bend` · Wölbungstiefe als Anteil der BLATTBREITE ────────────────────────────────────
    // Der Name bleibt, weil der Panel-Regler „Signpost curl" darauf zeigt — die BEDEUTUNG ist
    // jetzt eindeutig: 0,05 heißt „5 % der Breite tief gewölbt", bei 0,115 Breite also 0,0058.
    // Eine echte Karte, die man an einen Pfahl nagelt, wölbt sich in genau dieser Größenordnung.
    // Über etwa 0,12 wird aus der Wölbung eine Rinne — deshalb ist die Reglerskala fein.
    bend: 0.05,
    // Die Ecken werfen sich GEGEN die Wölbung auf (Anteil der Wölbungstiefe). Das ist der
    // Unterschied zwischen „gebogenes Blech" und „Papier, das schon eine Weile hängt".
    curl: 0.55,
    // Randunruhe als Anteil der Breite. 0,008 ist bei 0,115 Breite knapp ein Millimeter Weltmaß:
    // aus dem Flug liest man „handgeschnitten", nicht „defekt". Über 0,03 wird es ein Fetzen.
    rand: 0.008,
    // Abstand der zwei Lagen, Anteil der Breite. Es ist KEINE Dicke im Sinne eines Quaders (es
    // gibt keine Schmalseiten) — nur so viel Luft, dass die Rückseite nicht z-fightet.
    lagen: 0.014,
    // Auflösung. 14 × 8 reicht für eine glatte Wölbung bei 0,115 Weltmaß; mehr sieht man nicht.
    nx: 14, ny: 8,
  }, opts.params || {});

  let quelleGeo = null;     // nur bei 'glb': normalisierte Geometrie (XY = Fläche, Z = Dicke, Höhe 1)
  let mass = null;          // gemessene Rohmaße des GLB, für den Bericht
  let laeuft = false, fehler = null, ausgegeben = 0, letzteTiefe = 0, letzteBreite = 0;

  // ── Das selbst gebaute Blatt ───────────────────────────────────────────────────────────────
  /**
   * Zwei Lagen in EINER Geometrie: Vorderseite (+z) und Rückseite (−z) mit gespiegeltem u.
   * Ein Material, ein Draw-Call, und **beide Seiten lesen das Motiv richtig herum** — das ist
   * der Punkt. `DoubleSide` auf einer Lage hätte die Rückseite gespiegelt, und ein Wegweiser,
   * dessen Wortmarke von hinten „orrasiBafyaK" heißt, weist nicht, er verwirrt.
   */
  function eigenesBlatt(w, seed) {
    const h = w / KFB_AR;
    const nx = Math.max(2, P.nx | 0), ny = Math.max(2, P.ny | 0);
    const bow = P.bend * w;              // Wölbungstiefe in Weltmaß
    const lift = P.curl * bow;           // Eckenwurf
    const unruhe = P.rand * w;           // Randunruhe
    const halb = P.lagen * w * 0.5;
    const rnd = mulberry32(seed || 1);
    const ph = [rnd() * 6.2832, rnd() * 6.2832, rnd() * 6.2832];

    const nV = (nx + 1) * (ny + 1);
    const pos = new Float32Array(nV * 2 * 3);
    const uvs = new Float32Array(nV * 2 * 2);
    const idx = [];

    for (let lage = 0; lage < 2; lage++) {
      const base = lage * nV;
      const zOff = (lage === 0 ? 1 : -1) * halb;
      for (let j = 0; j <= ny; j++) {
        for (let i = 0; i <= nx; i++) {
          const u = i / nx, v = j / ny;
          const su = u * 2 - 1, sv = v * 2 - 1;     // −1 … +1
          // Randunruhe: die Verschiebung wirkt NUR nahe der Kante (^3 als Maske) und nach außen.
          // So bleibt die Fläche in der Mitte plan — dort sitzt das Motiv.
          const mx = Math.abs(su) * Math.abs(su) * Math.abs(su);
          const my = Math.abs(sv) * Math.abs(sv) * Math.abs(sv);
          const x = su * w / 2 + Math.sin(v * 5.1 + ph[0]) * unruhe * mx * Math.sign(su);
          const y = sv * h / 2 + Math.sin(u * 4.3 + ph[1]) * unruhe * 0.7 * my * Math.sign(sv);
          // Zylindrische Wölbung um die Hochachse, Eckenwurf dagegen, plus eine sehr flache
          // Querwelle — ohne die sieht die Fläche gerechnet aus statt gehangen.
          let z = bow * (1 - su * su);
          z -= lift * (su * su) * (sv * sv);
          z += Math.sin(sv * 3.0 + ph[2]) * bow * 0.12 * (1 - su * su);
          const k = base + j * (nx + 1) + i;
          pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z + zOff;
          uvs[k * 2] = lage === 0 ? u : 1 - u;      // Rückseite: u gespiegelt → lesbar
          uvs[k * 2 + 1] = v;
        }
      }
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const a = base + j * (nx + 1) + i, b = a + 1, c = a + (nx + 1), d = c + 1;
          // Vorderseite gegen den Uhrzeigersinn von +z gesehen; Rückseite umgekehrt gewickelt,
          // damit `FrontSide` genügt und beide Lagen ihr eigenes Licht bekommen.
          if (lage === 0) idx.push(a, b, c, b, d, c);
          else idx.push(a, c, b, b, c, d);
        }
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    g.computeBoundingBox();
    const s = new THREE.Vector3();
    g.boundingBox.getSize(s);
    letzteTiefe = +s.z.toFixed(4);
    letzteBreite = +s.x.toFixed(4);
    return g;
  }

  // ── Rückweg: das GLB-Kissen ────────────────────────────────────────────────────────────────
  /** Die kleinste Ausdehnung IST die Dicke; danach Dickenachse nach Z, Höhe auf 1, UVs neu. */
  function normalisieren(geo) {
    geo.computeBoundingBox();
    const b = geo.boundingBox, s = new THREE.Vector3();
    b.getSize(s);
    const achsen = [['x', s.x], ['y', s.y], ['z', s.z]].sort((a, c) => a[1] - c[1]);
    const dick = achsen[0], mittel = achsen[1], lang = achsen[2];
    mass = { x: +s.x.toFixed(4), y: +s.y.toFixed(4), z: +s.z.toFixed(4),
             dickeAchse: dick[0], dicke: +dick[1].toFixed(4),
             ar: +(lang[1] / Math.max(1e-6, mittel[1])).toFixed(3) };
    const c = new THREE.Vector3();
    b.getCenter(c);
    geo.translate(-c.x, -c.y, -c.z);
    if (dick[0] === 'x') geo.rotateY(Math.PI / 2);
    else if (dick[0] === 'y') geo.rotateX(Math.PI / 2);
    geo.computeBoundingBox();
    const s2 = new THREE.Vector3();
    geo.boundingBox.getSize(s2);
    geo.scale(1 / Math.max(1e-6, s2.y), 1 / Math.max(1e-6, s2.y), 1 / Math.max(1e-6, s2.y));
    geo.computeBoundingBox();
    const s3 = new THREE.Vector3();
    geo.boundingBox.getSize(s3);
    mass.normAr = +(s3.x / Math.max(1e-6, s3.y)).toFixed(3);
    // Die UVs des Modells liegen alle auf [0,02 · 0,02] — vorhanden ist nicht brauchbar. Also
    // planar neu projizieren. (Das ist auch der Grund, warum es hier keinen „GLB ohne UVs"-Zweig
    // mehr gibt: eine Bedingung weniger, die falsch beantwortet werden kann.)
    const pos = geo.attributes.position, bb = geo.boundingBox;
    const bw = Math.max(1e-6, bb.max.x - bb.min.x), bh = Math.max(1e-6, bb.max.y - bb.min.y);
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uv[i * 2] = (pos.getX(i) - bb.min.x) / bw;
      uv[i * 2 + 1] = 1 - (pos.getY(i) - bb.min.y) / bh;
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    mass.uvNeu = true;
    return geo;
  }

  function glbBlatt(w) {
    if (!quelleGeo) return null;
    const h = w / KFB_AR;
    const g = quelleGeo.clone();
    const s = new THREE.Vector3();
    g.computeBoundingBox(); g.boundingBox.getSize(s);
    const fx = w / Math.max(1e-6, s.x), fy = h / Math.max(1e-6, s.y);
    g.scale(fx, fy, fx * P.bend);
    g.computeBoundingBox();
    const s2 = new THREE.Vector3();
    g.boundingBox.getSize(s2);
    letzteTiefe = +s2.z.toFixed(4);
    letzteBreite = +s2.x.toFixed(4);
    return g;
  }

  let zusage = null;
  function laden() {
    if (zusage) return zusage;
    if (!P.on) return Promise.resolve(null);
    // 'eigen' braucht kein Netz. Das ist kein Detail: die Wegweiser stehen jetzt beim ERSTEN
    // Aufbau richtig, statt als Quader zu starten und nach dem Abruf getauscht zu werden.
    if (P.quelle !== 'glb') { zusage = Promise.resolve('eigen'); return zusage; }
    if (!loadGltf) return Promise.resolve(null);
    laeuft = true;
    zusage = loadGltf(P.url).then((g) => {
      laeuft = false;
      let gefunden = null;
      g.scene.traverse((n) => {
        if (!n.isMesh || gefunden) return;
        n.updateWorldMatrix(true, false);
        const geo = n.geometry.clone();
        geo.applyMatrix4(n.matrixWorld);
        gefunden = geo;
      });
      if (!gefunden) { fehler = 'kein Mesh im GLB'; return null; }
      quelleGeo = normalisieren(gefunden);
      return quelleGeo;
    }).catch((e) => {
      laeuft = false;
      fehler = (e && e.message) || String(e);
      console.warn('[paper-card] GLB nicht geladen:', fehler);
      return null;
    });
    return zusage;
  }

  /**
   * Ein Blatt in Weltmaß `w` Breite, KFB-Format hoch (Landscape 1,74).
   * @param {number} w Blattbreite in Weltmaß
   * @param {number} [seed] Für Randunruhe und Wölbungsphase — gleiche Zahl, gleiches Blatt.
   * @returns Geometrie oder `null` (dann baut der Aufrufer seinen Quader).
   */
  function blatt(w, seed) {
    if (!P.on) return null;
    const g = P.quelle === 'glb' ? glbBlatt(w) : eigenesBlatt(w, seed);
    if (g) ausgegeben++;
    return g;
  }

  return {
    name: 'paper-card', params: P, laden, blatt,
    // 'eigen' ist ohne Abruf sofort bereit — deshalb hängt `bereit` an der Quelle, nicht am Netz.
    get bereit() { return P.on && (P.quelle === 'glb' ? !!quelleGeo : true); },
    get mass() { return mass; },
    report() {
      const eigen = P.quelle !== 'glb';
      return {
        an: P.on, quelle: eigen ? 'eigen' : 'glb',
        bereit: P.on && (eigen ? true : !!quelleGeo),
        laeuft, fehler: fehler || null,
        blaetter: ausgegeben, rohMass: mass, format: KFB_AR,
        seiten: eigen ? 2 : 1,                 // beidseitig lesbar (Rückseite mit gespiegeltem u)
        bend: P.bend, curl: P.curl, rand: P.rand,
        // Die Zahl, an der „Papier oder Rinne" ablesbar ist: Wölbungstiefe des letzten Blatts,
        // dazu ihr Anteil an der Breite — eine Tiefe ohne ihre Breite ist keine Proportion.
        tiefe: letzteTiefe, breite: letzteBreite,
        anteil: letzteBreite ? +(letzteTiefe / letzteBreite * 100).toFixed(1) : 0,
      };
    },
    dispose() { if (quelleGeo) quelleGeo.dispose(); quelleGeo = null; },
  };
}
