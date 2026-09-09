// ============================================================================
// komposition.js — v10 · Die Rule of Three als Reiter auf der Streuungsschicht
// ----------------------------------------------------------------------------
// Anlass (Georg, 2.9.): „visuelle Elemente in asymmetrischen Dreiergruppen … 1 großes (Fokus),
// 1 mittleres (Übergang), 1 kleines (Detail) … niemals in einer Linie … das Mittlere leicht in
// das Große geschoben … Dichte nahe am Hauptobjekt hoch, nach außen exponentiell dünner."
//
// **Wo das in unserer Architektur hingehört:** zwischen STANDORT und PROP. Bisher stand auf einem
// Standort EIN Modell; die Kokos- und Felsgruppen waren Cluster gleicher Größe. Hier wird der
// Standort eine KOMPOSITION — und die ist ein Reiter wie Vulkan und Leuchtturm: sie bringt ein
// Prädikat (Land, nicht zu steil) und ihre Stücke im lokalen Tangentialrahmen mit, keinen eigenen
// Zufall. Die Streuung der Standorte selbst bleibt bei `streuen()`.
//
// **Zwei Bauarten je Standort, gemessen am Modell, nicht geraten (Inseln im Audit):**
//   · TRIADE — drei Einzelstücke aus Georgs Größenleiter (auswahl-georg.json): groß · mittel · klein,
//     dazu 0–2 Detail-Kiesel im exponentiellen Abfall um das Große.
//   · FORMATION — EIN Modell, in dem der Designer die Dreiergruppe schon gebaut hat (KayKit
//     Rock_1_K…Q, Rock_2_E…G). Es steht allein; noch eine Triade daneben wäre doppelt.
//
// **Die Geometrie der Triade, in Zahlen:**
//   · Radius eines Stücks r = halbe Grundfläche (aus dem Rohmaß × Kit-Faktor).
//   · Mittel: Abstand (rG + rM) · 0,85 — die 15 % sind das „leicht ineinander geschoben".
//   · Klein: Abstand (rG + rK) · 1,7, Winkel zum Mittleren 70–110° — zwei nah, eins abgesetzt.
//     ⚠ Erste Fassung sagte 100–150° — und fiel durch ihr eigenes Tor (Abnahme 2.9.): ein Scheitel
//     von 100–150° lässt den beiden anderen Ecken zusammen nur 30–80°, bei 150° höchstens 15° für
//     die kleinste. Regel und Tor widersprachen sich per Geometrie, nicht per Zufall — 3 von 5
//     Triaden „fast eine Linie", jeden Start. Seit der dritten Runde ist der Winkel Teil des
//     Platzierungs-Prädikats (`kleinsterWinkel ≥ MIN_WINKEL`), dieselbe Funktion wie im Tor.
//   · Detail: Abstand rG · (1 + Exp(λ=1,2)), gedeckelt bei rG · 3 — der exponentielle Abfall.
//   · Jedes Stück liest den Boden an SEINEM Ort (nicht am Standort) und sinkt 8 % seiner Höhe ein.
//
// **Größen:** KEIN `h:`. Kit-Faktor × Rohmaß, wie alles seit heute (kit-massstab.js). Ein 3,6-m-
// Quaternius-Fels neben einem 0,5-m-KayKit-Stein ist damit von sich aus groß neben klein.
//
// **Was das Tor misst:** Standorte gesetzt/gesucht, Bauart-Anteile, Modelle geladen/gescheitert,
// und je Triade der kleinste Innenwinkel des Dreiecks (< 25° wäre „fast eine Linie" — genau das,
// was die Regel verbietet). Eine Triade, die in der Linie steht, ist ein Fehler, kein Stil.
// ============================================================================
import { streuen } from './verteilung.js';
import { isLand } from './globe-field.js';
import { weltHoehe } from './kit-massstab.js';
// v11 · Die Triaden-Geometrie steht in `formation.js` — EINE Regel für Felsen (hier) und Flora.
import { MIN_WINKEL, kleinsterWinkel as kwFormation, triadeSuchen, detailPlaetze } from './formation.js';

function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function createKomposition({ THREE, radius, seed, terrainType, bodenRadius, anzahl = 14,
                                    salt = 7731, params = {}, frei = null }) {
  const P = Object.assign({ on: true, formationAnteil: 0.35, sink: 0.08, detailMax: 2 }, params);
  const group = new THREE.Group(); group.name = 'komposition'; group.visible = !!P.on;
  const rnd = seededRandom((seed | 0) + salt);
  const R = radius;

  let auswahl = null, stand = 'lädt Auswahl …';
  const protokoll = { standorte: 0, gesucht: anzahl, triaden: 0, formationen: 0, stuecke: 0,
                      geladen: 0, gescheitert: [], minWinkel: [], zuSteil: 0 };

  // ── Tangentialrahmen an einer Richtung ──────────────────────────────────
  const _t1 = new THREE.Vector3(), _t2 = new THREE.Vector3(), _h = new THREE.Vector3();
  function rahmen(n, t1, t2) {
    _h.set(0, 1, 0); if (Math.abs(n.y) > 0.9) _h.set(1, 0, 0);
    t1.crossVectors(_h, n).normalize(); t2.crossVectors(n, t1).normalize();
  }
  /** Punkt auf der Kugel: von `n` um `bogen` Radiant in Richtung Winkel `a` im Rahmen. */
  function versetzt(n, a, bogen, out) {
    rahmen(n, _t1, _t2);
    return out.copy(n).addScaledVector(_t1, Math.cos(a) * Math.tan(bogen))
                      .addScaledVector(_t2, Math.sin(a) * Math.tan(bogen)).normalize();
  }
  /** Steilheit: größte Höhendifferenz im Ring ÷ Ringweite. */
  const _q = new THREE.Vector3();
  function steil(n, weite) {
    if (!bodenRadius) return 0;
    const mitte = bodenRadius(n); let max = 0;
    for (let i = 0; i < 6; i++) {
      const r = bodenRadius(versetzt(n, (i / 6) * Math.PI * 2, weite / R, _q));
      if (r != null && mitte != null) max = Math.max(max, Math.abs(r - mitte));
    }
    return max / weite;
  }

  // ── Modelle laden (einmal je Datei), Kit-Maßstab anwenden ───────────────
  const modelle = new Map();   // ghUrl → { geo:[{g, mat}], hW, rGrund }
  async function lade(eintrag, loader, klasse) {
    if (modelle.has(eintrag.ghUrl)) return modelle.get(eintrag.ghUrl);
    let gltf;
    try { gltf = await loader.loadAsync(eintrag.ghUrl); }
    catch (e) { protokoll.gescheitert.push(eintrag.name); modelle.set(eintrag.ghUrl, null); return null; }
    const root = gltf.scene; root.updateWorldMatrix(true, true);
    const bb = new THREE.Box3().setFromObject(root), size = bb.getSize(new THREE.Vector3());
    // ⚠ Bezug wie in globe-landmarks: ein FLACHES Modell (Breite/Höhe > 1,8) wird an seiner
    // Grundfläche gemessen, nicht an der Höhe — sonst wird aus einem 6 cm hohen, 50 cm breiten
    // Flachstein beim Anheben eine Platte. Und die Detail-Klasse bekommt KEINEN Boden: sie soll
    // unter ihm liegen (auswahl-georg.json: „nur im Nahfeld"). Abnahme 2.9.: Kiesel 0,18 u breit,
    // Fokusfels 0,136 — die Regel stand auf dem Kopf.
    const flach = Math.max(size.x, size.z) / Math.max(1e-4, size.y);
    const bezug = flach > 1.8 ? Math.max(size.x, size.z) : size.y;
    // Kein Sichtbarkeitsboden in Kompositionen: die Gruppe ist so groß, wie ihr Fokusstück sie macht,
    // und die Leiter darunter muss ihr Verhältnis behalten — ein angehobener Kleinstein wäre kein
    // kleiner Stein mehr. (Der Boden gilt für einzeln gestreute Props, nicht hier.)
    // `art: 'rock'` — die Familien-Ausnahme aus kit-massstab.js. Hier steht kein `def.kind`,
    // also wird die Art benannt statt geraten.
    const wh = weltHoehe({}, eintrag.pack, bezug, { ohneBoden: true, art: 'rock' });
    const norm = wh.h / Math.max(1e-4, bezug);
    const mitte = bb.getCenter(new THREE.Vector3());
    const M = new THREE.Matrix4().makeTranslation(-mitte.x * norm, -bb.min.y * norm, -mitte.z * norm)
      .multiply(new THREE.Matrix4().makeScale(norm, norm, norm));
    const geo = [];
    root.traverse((c) => {
      if (!c.isMesh) return;
      const g = c.geometry.clone(); g.applyMatrix4(new THREE.Matrix4().copy(M).multiply(c.matrixWorld));
      const src = Array.isArray(c.material) ? c.material[0] : c.material;
      // Lambert statt Standard: derselbe Lichthaushalt wie die übrigen Props (S9c) — und ohne
      // die Umgebungs-Map, die die Kugel nicht bezahlt.
      const mat = new THREE.MeshLambertMaterial({ color: src && src.color ? src.color.clone() : new THREE.Color(0xffffff),
        map: src && src.map ? src.map : null, vertexColors: !!(g.attributes && g.attributes.color) });
      geo.push({ g, mat });
    });
    const m = { geo, hW: size.y * norm, rGrund: Math.max(size.x, size.z) * norm * 0.5, name: eintrag.name };
    modelle.set(eintrag.ghUrl, m); protokoll.geladen++;
    return m;
  }

  // ── Ein Stück setzen: Bodenhöhe an SEINEM Ort, Kurs zufällig, eingesunken ──
  const _n = new THREE.Vector3(), _p = new THREE.Vector3(), _Y = new THREE.Vector3(0, 1, 0);
  const _qq = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _s = new THREE.Vector3(), _M = new THREE.Matrix4();
  const instanzen = new Map();   // modell → Matrizen-Liste
  const orteListe = [];          // v11 · { familie: 'felsen', n, r } für das Familien-Abstand-Tor
  function setze(m, n) {
    const rB = bodenRadius ? bodenRadius(n) : R;
    if (rB == null) return false;
    orteListe.push({ familie: 'felsen', n: n.clone(), r: m.rGrund });
    _qq.setFromUnitVectors(_Y, n); _q2.setFromAxisAngle(n, rnd() * Math.PI * 2); _qq.premultiply(_q2);
    _p.copy(n).multiplyScalar(rB - m.hW * P.sink); _s.setScalar(1);
    if (!instanzen.has(m)) instanzen.set(m, []);
    instanzen.get(m).push(new THREE.Matrix4().compose(_p, _qq, _s));
    protokoll.stuecke++;
    return true;
  }
  const wahl = (liste) => liste[Math.floor(rnd() * liste.length)];
  /** Kleinster Innenwinkel des Dreiecks (Grad), im Tangentialraum genähert. EINE Funktion für
   *  Prädikat UND Tor — damit beide dasselbe messen. */
  // v11 · aus formation.js — dieselbe Funktion wie in flora.js, damit beide Reiter dasselbe messen.
  const kleinsterWinkel = (a, b, c) => kwFormation(THREE, a, b, c);

  async function bauen() {
    try {
      const r = await fetch('./globe-v13/auswahl-georg.json');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      auswahl = await r.json();
    } catch (e) { stand = 'auswahl-georg.json nicht lesbar: ' + (e.message || e); return; }
    const F = auswahl.felsen;
    // v11 · `frei` = die Belegung der Welt (verteilung.js): kein Fels in einer Karte, einem Portal, einem Wegweiser.
    const gueltig = (n) => isLand(seed, terrainType, n.x, n.y, n.z) && steil(n, 0.06) < 0.9 && (!frei || frei(n));
    const orte = streuen({ THREE, count: anzahl, seed, salt, gueltig, minSep: null });
    protokoll.standorte = orte.length;

    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();

    // ⚠ **Die Leiter wird HIER gebaut, aus Weltmaßen — nicht aus der JSON** (Abnahme 2.9., dritte
    // Runde zur Leiter). Die JSON teilt nach Roh-Metern ein; seit jedes Kit seinen eigenen Faktor
    // hat (Kenney 0,044 · KayKit 0,011 — Faktor 4,2 dazwischen), ist ein „0,5-m-Stein" aus
    // KayKit 2,7× SCHMALER als ein „0,36-m-Kiesel" aus Kenney. Roh-Meter über Kits hinweg sagen
    // nichts. Also: alle Einzelstücke laden, ihre Welt-Grundfläche lesen, und DANN in vier
    // Klassen schneiden — nach Quartilen des Pools, damit jede Klasse besetzt ist.
    const pool = [];
    for (const kl of ['gross', 'mittel', 'klein', 'detail']) {
      for (const e of F.einzel[kl].namen) { const m = await lade(e, loader, kl); if (m) pool.push(m); }
    }
    pool.sort((a, b) => a.rGrund - b.rGrund);
    const q = (t) => pool[Math.min(pool.length - 1, Math.floor(pool.length * t))];
    const leiter = {
      detail: pool.slice(0, Math.floor(pool.length * 0.25)),
      klein:  pool.slice(Math.floor(pool.length * 0.25), Math.floor(pool.length * 0.5)),
      mittel: pool.slice(Math.floor(pool.length * 0.5), Math.floor(pool.length * 0.75)),
      gross:  pool.slice(Math.floor(pool.length * 0.75)),
    };
    for (const kl of Object.keys(leiter)) for (const m of leiter[kl]) m.klasse = kl;
    protokoll.leiter = Object.fromEntries(Object.keys(leiter).map((kl) => [kl,
      leiter[kl].length ? leiter[kl][0].rGrund.toFixed(3) + '–' + leiter[kl][leiter[kl].length - 1].rGrund.toFixed(3) : '—']));
    if (!leiter.gross.length || !leiter.mittel.length || !leiter.klein.length) { stand = 'Leiter unvollständig'; return; }

    for (const n of orte) {
      if (rnd() < P.formationAnteil) {
        const m = await lade(wahl(F.formationen.namen), loader, 'formation');
        if (m) { m.klasse = 'formation'; if (setze(m, n)) protokoll.formationen++; }
        continue;
      }
      const G = wahl(leiter.gross), Mi = wahl(leiter.mittel), K = wahl(leiter.klein);
      // Groß in der Mitte; Mittel nah und leicht hineingeschoben; Klein abgesetzt im Winkel.
      // ⚠ Nachrücken statt Verwerfen (Hausregel aus verteilung.js): fällt ein Satellit ins Wasser
      // oder an den Hang, wird der Winkel gedreht, nicht der Standort aufgegeben. Erste Fassung
      // warf 5 von 14 Standorten weg und zählte sie trotzdem als gesetzt.
      const dM = (G.rGrund + Mi.rGrund) * 0.85, dK = (G.rGrund + K.rGrund) * 1.7;
      // ⚠ Dritte Runde derselben Klasse (Abnahme 2.9.): das Tor prüfte den Winkel NACH dem Setzen,
      // die Platzierung kannte ihn nicht — zwei Stellen, eine Regel, und sie liefen auseinander
      // (Sinussatz: Scheitel 110° bei dK/dM = 1,72 gibt 24,5°, nicht die behaupteten ≥30°).
      // Jetzt ist der Winkel Teil des Prädikats: ein Paar wird nur angenommen, wenn sein Dreieck
      // die Tor-Schwelle einhält. Was das Tor mißt, hat die Platzierung schon garantiert — das
      // Tor kann dann nur noch durch einen ECHTEN Fehler fallen, nicht durch die eigene Regel.
      // Drei Stufen Nachrücken: 8 Winkel · 4 Unterwinkel · und wenn das nicht reicht, der Abstand
      // des Kleinen auf 1,3× statt 1,7× — enger ist besser als weg (Hausregel: relocate, don't reject).
      // v11 · Suche in `formation.js` (zeichengleiche Zahlen: 0,85 · 1,7 · 70–110° · 8×4×2).
      void dM; void dK;
      const tri3 = triadeSuchen({ THREE, n, rG: G.rGrund, rM: Mi.rGrund, rK: K.rGrund, R, gueltig, rnd });
      if (!tri3) { protokoll.zuSteil++; continue; }
      const pM = tri3.pM, pK = tri3.pK;
      setze(G, n); setze(Mi, pM); setze(K, pK);
      protokoll.triaden++;
      // Innenwinkel des Dreiecks — das Tor liest den kleinsten. Dieselbe Funktion wie im Prädikat.
      protokoll.minWinkel.push(kleinsterWinkel(n, pM, pK));
      // Detail-Kiesel: exponentieller Abfall um das Große, gedeckelt.
      const nD = Math.floor(rnd() * (P.detailMax + 1));
      if (nD && leiter.detail.length) {
        for (const pD of detailPlaetze({ THREE, n, rG: G.rGrund, R, anzahl: nD, gueltig, rnd })) setze(wahl(leiter.detail), pD);
      }
    }
    // Instanzen bauen: ein InstancedMesh je (Modell, Teil).
    for (const [m, mats] of instanzen) {
      for (const { g, mat } of m.geo) {
        const inst = new THREE.InstancedMesh(g, mat, mats.length);
        for (let i = 0; i < mats.length; i++) inst.setMatrixAt(i, mats[i]);
        inst.instanceMatrix.needsUpdate = true; inst.name = 'komp-' + m.name; inst.frustumCulled = false;
        group.add(inst);
      }
    }
    stand = 'gebaut';
  }
  bauen().catch((e) => { stand = 'Fehler: ' + (e && e.message || e); console.warn('[komposition]', e); });

  return {
    name: 'komposition', group, params: P,
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; group.visible = !!on; },
    get status() { return stand; },
    orte() { return orteListe; },
    tor() {
      const p = protokoll;
      if (stand !== 'gebaut') return { ok: false, text: '— ' + stand };
      // Größenordnung prüfen, nicht behaupten: der breiteste Kiesel muss schmaler sein als der
      // schmalste Kleinstein — sonst steht die Regel auf dem Kopf (Abnahme 2.9.).
      let kieselMax = 0, kleinMin = Infinity;
      for (const [m] of instanzen) {
        if (m.klasse === 'detail') kieselMax = Math.max(kieselMax, m.rGrund);
        if (m.klasse === 'klein') kleinMin = Math.min(kleinMin, m.rGrund);
      }
      const leiterOk = !(kieselMax > 0 && kleinMin < Infinity) || kieselMax < kleinMin;
      const mw = p.minWinkel.length ? Math.min.apply(null, p.minWinkel) : null;
      const linie = p.minWinkel.filter((w) => w < MIN_WINKEL).length;
      // „Gebaut" heißt: dort steht etwas. Ein gefundener Standort ohne Komposition zählt nicht.
      const gebaut = p.triaden + p.formationen;
      const ok = gebaut === p.gesucht && !p.gescheitert.length && linie === 0 && leiterOk;
      return { ok, ...p, gebaut, kleinsterWinkel: mw, kieselMax, kleinMin,
        text: (ok ? '✓' : '⚠') + ' ' + gebaut + '/' + p.gesucht + ' sites built (' + p.standorte + ' found) · ' + p.triaden + ' triads + '
          + p.formationen + ' formations · ' + p.stuecke + ' pieces · ' + p.geladen + ' models'
          + (p.gescheitert.length ? ' · ⚠ failed: ' + p.gescheitert.join(', ') : '')
          + (mw != null ? ' · smallest triangle angle ' + mw.toFixed(0) + '°' + (linie ? ' · ⚠ ' + linie + ' near a line' : '') : '')
          + (p.zuSteil ? ' · ⚠ ' + p.zuSteil + ' sites without room (8 angles tried)' : '')
          + (kieselMax > 0 && kleinMin < Infinity ? ' · ladder ' + (leiterOk ? '✓' : '⚠') + ' pebble r ' + kieselMax.toFixed(3) + ' < small r ' + kleinMin.toFixed(3) : '')
          + (p.leiter ? ' · world ladder r: ' + Object.entries(p.leiter).map(([a, b]) => a + ' ' + b).join(' · ') : '') };
    },
  };
}
