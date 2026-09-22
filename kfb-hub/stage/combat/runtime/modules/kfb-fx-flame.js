/* kfb-fx-flame.js · Flamme und Rauch als DREI PHASEN (v1, 04.09.2026)
 *
 * AUFTRAG (Georg, 04.09.): „flammen & rauch wären cool, wenn sauber konzipiert &
 * animiert." Das Wort, an dem es haengt, ist SAUBER — und das heisst hier: nicht
 * mehr Partikel, sondern eine ZEITACHSE. Ein Haufen oranger Kleckse, die
 * gleichzeitig aufgehen und gleichzeitig weg sind, ist kein Feuer, sondern ein
 * Blitz mit Farbe (derselbe Befund wie beim Sturz in v5: „konstante Rate hat keine
 * Ursache und kein Ende").
 *
 * ═══ DAS KONZEPT · DREI PHASEN, DIE SICH UEBERLAPPEN ══════════════════════════
 *
 *   ZUENDUNG   0,00–0,10 s   3–5 `fire`/`tongue`-Masken, ADDITIV, weissglut →
 *                            Waffenfarbe (die FreeHitVfx-Kurve macht das im Shader),
 *                            Schub entlang der Flaechennormale. Das ist der Knall.
 *   BRAND      0,06–0,75 s   getaktet je 0,075 s EINE Zunge, additiv, sie WACHST
 *                            nach oben und schrumpft im Durchmesser, wechselnde
 *                            Neigung (Lecken). Deterministisches Flackern, kein
 *                            Zufall. Die Groesse faellt mit der Restlebenszeit des
 *                            Herds — Feuer geht aus, es verschwindet nicht.
 *   RAUCH      0,22–1,45 s   getaktet je 0,15 s eine dunkle `smoke`-Maske, NORMAL
 *                            geblendet, erbt 25 % des Impulses, `drag` bremst ihn,
 *                            danach traegt negativer `grav` sie hoch. Sie WAECHST,
 *                            waehrend sie blasser wird.
 *
 * Der Kern der Sache ist die VERSETZUNG: Rauch beginnt, wenn die Flamme ihren
 * Hoehepunkt hinter sich hat. Genau das prueft `tor()` — und genau das war in den
 * alten Fassungen falsch, wo Rauch und Feuer im selben Bild starteten und der Rauch
 * das Feuer verdeckte.
 *
 * ═══ REGELN ══════════════════════════════════════════════════════════════════
 * 1 · KEIN `Math.random`. Das Flackern ist eine Hashfunktion aus (Herd-Seed, Nummer);
 *     der Schussstand spult vor und zurueck, und derselbe Herd muss dasselbe Feuer
 *     zeigen. Der Zufall des Wirts wird NICHT angefasst — sonst verschoebe dieses
 *     Modul die Zufallsfolge aller anderen (die Nebenwirkung waere still).
 * 2 · KEINE UHR. Alles laeuft auf `update(dt)` im Simulationstakt; kaputtes dt wird
 *     verworfen UND gezaehlt, kein dt ueberhaupt laesst das Tor fallen.
 * 3 · DAS MODUL BESITZT NICHTS IN DER SZENE. Es zeichnet ueber `emit` des Wirts
 *     (dort haengt der Instanced-Sprite-Pool), also gibt es keinen zweiten Renderer
 *     und keinen zweiten Draw-Call-Haushalt.
 *
 * VERTRAG
 *   const F = createFlame({ emit, params });
 *   F.ignite({ at, dir, size, tint, seed, luft })  → Herd-Nummer
 *   F.update(dt) (Zweitname step) · F.clear()
 *   F.stats() · F.zeile() · F.tor()
 */

export function createFlame(o) {
  const emit = (o && o.emit) || null;

  const QUELLE = {
    zuendung: 4,          // Zungen im ersten Bild
    brandDauer: 0.75,     // wie lange ein Herd brennt
    brandTakt: 0.075,     // Abstand zwischen zwei Zungen
    brandAb: 0.06,        // wann die getaktete Phase einsetzt
    rauchAb: 0.22,        // wann Rauch einsetzt — NACH dem Hoehepunkt der Flamme
    rauchTakt: 0.15,
    rauchNach: 0.7,       // wie lange Rauch nach dem Brandende noch kommt
    rauchErbe: 0.25,      // Anteil des Impulses, den die Wolke erbt
    zungenLeben: 0.24,
    rauchLeben: 1.0,
    /* ═══ DIE FARBEN SIND PARAMETER, KEINE LITERALE ═════════════════════════════
       VERIFIER-FUND (04.09.), und es ist ein RUECKFALL in eine Lehre, die der Wirt
       seit v10 mitfuehrt: sein `SMOKE = 0x9aa09c` steht dort mit der Begruendung
       „der Rauch war 0xb9ad94 — beige auf beigem Boden … Rauch braucht Abstand in
       HELLIGKEIT und in FARBTON vom Untergrund". Dieses Modul kam mit `0x6e6455`
       daher, also mit genau dem warmen Ton zurueck: gegen den Sandboden
       (177,181,143) ergibt das bei op 0,42 ein Komposit von rund 149,147,119 —
       Kontrast 1,18:1, eine Verfaerbung statt einer Wolke.
       Deshalb ist die Farbe jetzt eine VORGABE, die der Wirt setzen kann (er kennt
       seinen Untergrund, das Modul nicht). Und die Zuendung bekommt einen
       gesaettigten Glutkern statt des nach Metall-Weiss gelerpten Waffentons:
       additives Fast-Weiss auf hellem Grund ist unsichtbar. */
    rauchFarbe: 0x9aa09c,
    rauchOp: 0.62,
    rauchWuchs: 3.1,
    zungeKern: 0xffd27a,   // Glutkern (ENERGY.hot.hot); null = Wirtsfarbe unveraendert
    zungeMisch: 0.65,      // wie weit die Zunge Richtung Glutkern wandert
    cap: 6                // gleichzeitige Herde
  };
  const P = Object.assign({}, QUELLE, (o && o.params) || {});

  const herde = [];
  let t = 0, naechste = 1;
  const zaehler = { herde: 0, zungen: 0, wolken: 0, dtRufe: 0, dtVerworfen: 0, verworfeneHerde: 0 };
  let letzteZungeBei = -1, ersteWolkeBei = -1;

  /* Zwei Farben mischen, ohne three zu kennen: das Modul rechnet auf Kanaelen. */
  function mische(a, b, k) {
    if (b == null || !(k > 0)) return a;
    const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
    const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
    return (Math.round(ar + (br - ar) * k) << 16) | (Math.round(ag + (bg - ag) * k) << 8) | Math.round(ab + (bb - ab) * k);
  }

  /* Deterministisches Flackern: Hash aus Herd-Seed und Nummer, 0..1. Kein
     `Math.random`, kein Zugriff auf den Zufall des Wirts. */
  function jitter(seed, n) {
    let h = ((seed >>> 0) ^ (n * 0x9e3779b1)) >>> 0;
    h ^= h >>> 15; h = (h * 0x85ebca6b) >>> 0;
    h ^= h >>> 13; h = (h * 0xc2b2ae35) >>> 0;
    h ^= h >>> 16;
    return (h >>> 8) / 16777216;
  }

  function zunge(H, n, k) {
    if (!emit) return;
    const j1 = jitter(H.seed, n * 3 + 1), j2 = jitter(H.seed, n * 3 + 2), j3 = jitter(H.seed, n * 3 + 3);
    /* Die Zunge steigt und wird SCHMALER, waehrend der Herd ausgeht: `size1`
       kleiner als `size` ist der Unterschied zwischen einer Flamme und einem
       Farbfleck, der aufgeht. */
    const rest = 1 - k;
    const gr = H.size * (0.55 + rest * 0.65);
    const p = { x: H.at.x + (j1 - 0.5) * H.size * 0.5, y: H.at.y + 0.05 * H.size + j2 * H.size * 0.25, z: H.at.z + (j3 - 0.5) * H.size * 0.5 };
    emit(n % 2 ? 'tongue' : 'fire', H.vec(p), {
      color: H.glut, size: gr, size1: gr * 0.45, life: P.zungenLeben * (0.7 + rest * 0.5),
      add: true, op: 0.85 * (0.45 + rest * 0.55), pop: n === 0,
      /* Neigung wechselt das Vorzeichen: Lecken hat eine Richtung je Zunge, aber
         keine Vorzugsseite ueber die Zeit. */
      rot: (j1 - 0.5) * 0.5 * (n % 2 ? 1 : -1),
      vel: H.vecv(H.dir.x * 0.6 + (j2 - 0.5) * 0.5, 1.6 + j1 * 1.4, H.dir.z * 0.6 + (j3 - 0.5) * 0.5),
      drag: 1.5, grav: -0.8, seed: (H.seed + n) | 0
    });
    zaehler.zungen++;
    letzteZungeBei = t;
  }

  function wolke(H, n) {
    if (!emit) return;
    const j1 = jitter(H.seed, 1000 + n * 2), j2 = jitter(H.seed, 2000 + n * 2);
    const gr = H.size * (0.45 + j1 * 0.3);
    emit('smoke', H.vec({ x: H.at.x + (j1 - 0.5) * H.size * 0.6, y: H.at.y + H.size * 0.3, z: H.at.z + (j2 - 0.5) * H.size * 0.6 }), {
      color: (H.rauch == null ? P.rauchFarbe : H.rauch), size: gr, size1: gr * P.rauchWuchs, life: P.rauchLeben * (0.8 + j2 * 0.6),
      op: P.rauchOp, fade: 1.5, rot: j1 * 6.283, spin: (j2 - 0.5) * 0.9,
      /* Impuls → Widerstand → Auftrieb, in dieser Reihenfolge sichtbar. Genau das
         Modell, das der Raketenrauch im Wirt schon fuehrt; Rauch ohne Impuls wird
         im Raum ABGELEGT und liest sich als Fehler. */
      vel: H.vecv(H.imp.x * P.rauchErbe + (j1 - 0.5) * 0.4, 0.85 + j2 * 0.5, H.imp.z * P.rauchErbe + (j2 - 0.5) * 0.4),
      drag: 2.2, grav: -0.5, seed: (H.seed + 977 + n) | 0
    });
    zaehler.wolken++;
    if (ersteWolkeBei < 0) ersteWolkeBei = t;
  }

  return {
    id: 'kfb-fx-flame',
    version: '1.0.0',
    group: null,
    besitzt: 'nichts — gezeichnet wird im Sprite-Pool des Wirts (ein Draw-Call-Haushalt)',
    schreibt: [],
    quelle: QUELLE,
    params: P,

    /** Einen Herd entzuenden. `at`/`dir`/`imp` sind Vector3-artig; `vec`/`vecv`
        sind die Fabriken des Wirts, damit dieses Modul three nicht kennen muss. */
    ignite(spec) {
      spec = spec || {};
      if (!emit) return 0;
      if (herde.length >= P.cap) { zaehler.verworfeneHerde++; herde.shift(); }
      const d = spec.dir || { x: 0, y: 1, z: 0 };
      const H = {
        nr: naechste++,
        at: { x: spec.at.x, y: spec.at.y, z: spec.at.z },
        dir: { x: d.x, y: d.y, z: d.z },
        imp: spec.imp ? { x: spec.imp.x, y: spec.imp.y, z: spec.imp.z } : { x: 0, y: 0, z: 0 },
        size: spec.size || 0.6,
        tint: spec.tint == null ? 0xffb257 : spec.tint,
        /* GLUT ist die Farbe, die man WIRKLICH sieht: der Waffenton, Richtung
           Glutkern gemischt. `rauch` darf der Wirt setzen. */
        glut: mische(spec.tint == null ? 0xffb257 : spec.tint, P.zungeKern, P.zungeMisch),
        rauch: spec.rauch == null ? null : spec.rauch,
        seed: (spec.seed == null ? 1 : spec.seed) >>> 0,
        luft: !!spec.luft,
        t0: t, n: 0, nRauch: 0, brandT: 0, rauchT: 0
      };
      /* Die Fabriken einmal pro Herd merken: `emit` will echte Vektoren, das Modul
         soll keine three-Abhaengigkeit haben. Ohne Fabrik fliegt ein Objektliteral
         durch — der Sprite-Pool kann das lesen, `vel` braucht aber Vektormathematik. */
      H.vec = spec.vec || ((p) => p);
      H.vecv = spec.vecv || ((x, y, z) => ({ x: x, y: y, z: z }));
      herde.push(H);
      zaehler.herde++;
      /* ZUENDUNG: nicht getaktet, sondern JETZT — sonst haette der Einschlag ein
         Bild lang kein Feuer, und genau dieses Bild ist das wichtigste. */
      const n0 = P.zuendung + (H.size > 1 ? 1 : 0);
      for (let i = 0; i < n0; i++) { zunge(H, H.n++, 0); }
      return H.nr;
    },

    /* EIN HERD AUF EINEM BEWEGTEN KOERPER MUSS MITFAHREN.
       Georgs Befund: „impact-VFX & rauchwolken bleiben an position, waehrend ziel
       weiter in flug-loop pendelt". Der Herd war ein WELTPUNKT (`at` wird beim
       Zuenden kopiert), also brannte die Luft dort weiter, wo das Ziel gewesen war.
       Ein brennender Flieger traegt sein Feuer mit; sein RAUCH bleibt liegen, weil
       Rauch einen Impuls hat und nicht mehr zum Koerper gehoert, sobald er weg ist.
       Genau diese Trennung macht `move`: es verschiebt die QUELLE, nicht das schon
       Ausgestossene. Wer verschiebt, ist der Wirt \u2014 nur er kennt die Koerper. */
    move(nr, at) {
      if (!at) return false;
      for (let i = 0; i < herde.length; i++) {
        if (herde[i].nr !== nr) continue;
        herde[i].at.x = at.x; herde[i].at.y = at.y; herde[i].at.z = at.z;
        return true;
      }
      return false;
    },

    update(dt) {
      if (!(isFinite(dt) && dt >= 0)) { zaehler.dtVerworfen++; return; }
      zaehler.dtRufe++;
      t += dt;
      for (let i = herde.length - 1; i >= 0; i--) {
        const H = herde[i];
        const alter = t - H.t0;
        const k = Math.min(1, alter / P.brandDauer);
        if (alter >= P.brandAb && alter < P.brandDauer) {
          H.brandT += dt;
          if (H.brandT >= P.brandTakt) { H.brandT = 0; zunge(H, H.n++, k); }
        }
        if (alter >= P.rauchAb && alter < P.brandDauer + P.rauchNach) {
          H.rauchT += dt;
          if (H.rauchT >= P.rauchTakt) { H.rauchT = 0; wolke(H, H.nRauch++); }
        }
        if (alter >= P.brandDauer + P.rauchNach) herde.splice(i, 1);
      }
    },
    step(dt) { this.update(dt); },

    clear() { herde.length = 0; letzteZungeBei = -1; ersteWolkeBei = -1; },
    reset() { this.clear(); t = 0; },

    stats() { return Object.assign({ zeit: +t.toFixed(3), live: herde.length }, zaehler); },
    abweichungen() {
      const out = [];
      for (const k in QUELLE) if (QUELLE[k] !== P[k]) out.push({ feld: k, quelle: QUELLE[k], ist: P[k] });
      return out;
    },
    zeile() {
      const ab = this.abweichungen();
      return 'fx-flame · ' + zaehler.herde + ' Herde · ' + zaehler.zungen + ' Zungen · ' + zaehler.wolken + ' Wolken · '
        + herde.length + ' live · Phasen ' + P.brandAb + '/' + P.rauchAb + '/' + (P.brandDauer + P.rauchNach) + ' s · '
        + (ab.length ? ab.length + ' Wert(e) abweichend' : 'Werte wie entworfen');
    },
    tor() {
      const z = []; let ok = 0, von = 0, nm = 0;
      const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
      const info = (s) => { z.push('\u00b7 ' + s); };
      const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };

      pruef(this.group === null && this.schreibt.length === 0,
        'besitzt nichts und schreibt nichts (' + this.besitzt + ')',
        'beansprucht ' + this.schreibt.length + ' Feld(er), erwartet 0');

      /* Die EINE Zeile, an der das Konzept haengt: Rauch beginnt NACH der Flamme.
         Ohne Herd ist das nicht messbar — dann steht hier kein Urteil. */
      if (!zaehler.herde) offen('noch kein Herd entzuendet — Phasenfolge nicht messbar');
      else if (ersteWolkeBei < 0) offen('Rauchphase noch nicht erreicht (' + P.rauchAb + ' s)');
      else pruef(ersteWolkeBei > 0 && zaehler.zungen > 0,
        'Flamme vor Rauch: ' + zaehler.zungen + ' Zungen, erste Wolke bei ' + ersteWolkeBei.toFixed(2) + ' s',
        'Rauch ohne Flamme — die Phasenfolge ist verletzt');

      pruef(zaehler.zungen === 0 || zaehler.zungen >= P.zuendung,
        zaehler.zungen + ' Zungen (Zuendung allein setzt ' + P.zuendung + ')',
        'nur ' + zaehler.zungen + ' Zungen bei ' + zaehler.herde + ' Herden — die Zuendung feuert nicht');

      /* Leckt das Modul Herde? Nach Brandende + Nachlauf darf keiner mehr stehen. */
      if (!zaehler.herde) offen('Abbau nicht pruefbar (kein Herd)');
      else pruef(herde.length <= P.cap, herde.length + ' Herde live (Deckel ' + P.cap + ')',
        herde.length + ' Herde live, Deckel ' + P.cap + ' — Abbau haengt');

      if (!zaehler.herde && !zaehler.dtRufe) offen('Takt: noch kein dt und kein Herd');
      else pruef(zaehler.dtRufe > 0 && zaehler.dtVerworfen === 0,
        'Modulzeit ' + t.toFixed(2) + ' s aus ' + zaehler.dtRufe + ' dt-Rufen, 0 verworfen',
        (zaehler.dtRufe === 0
          ? 'NIE GETAKTET: 0 dt-Rufe bei ' + zaehler.herde + ' Herden — nur die Zuendung waere zu sehen'
          : zaehler.dtVerworfen + ' von ' + zaehler.dtRufe + ' dt-Werten verworfen (NaN, negativ, unendlich)'));

      info('verworfene Herde am Deckel: ' + zaehler.verworfeneHerde);
      return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
               text: 'fx-flame: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
    }
  };
}
