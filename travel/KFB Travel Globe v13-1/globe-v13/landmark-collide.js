// ============================================================================
// landmark-collide.js — was durchflogen, was umflogen wird (v3 · S7b)
// ----------------------------------------------------------------------------
// Georgs Regel (29.8.), wörtlich und vollständig:
//   „bäume werden durchflogen · gebäude und große landmarken werden umflogen · würfel und karten
//    sind kollisions- und pickup-ziele · die wegweiser mit karten könnten bei kontakt mit rotation
//    um die pfahl-achse und/oder cartoon-deformer reagieren"
//
// Das ist eine KLASSENFRAGE, keine Physikfrage — und deshalb gibt es hier keinen Collider, keine
// Broadphase und keinen Solver. Es gibt eine Liste mit höchstens ~30 Orten und drei Klassen:
//   · `through`  — Streuung (Bäume, Bücher, Fässer): steht nicht in dieser Liste. Nichts tun ist
//                  die Umsetzung; wer nicht gefragt wird, kostet nichts.
//   · `around`   — Gebäude und große Landmarken: eine weiche Wand. Sie DREHT den Kurs weg und
//                  bremst leicht, sie stoppt nicht. Ein harter Stopp auf einem fliegenden Teppich
//                  liest als Fehler, ein Ausweichen liest als Fliegen.
//   · `react`    — die Karten-Wegweiser: sie lassen durch und REAGIEREN (Rückruf, einmal je
//                  Annäherung — mit Hysterese, sonst feuert es jedes Bild).
//
// ⚠ **Kein zweiter Schreiber auf den Kurs.** Das Modul RECHNET nur und gibt einen Zuschlag zurück;
// der Runner addiert ihn auf die Lenkeingabe, die er sowieso zusammenstellt, und `carpet.update`
// bleibt der einzige Ort, an dem `heading` geschrieben wird. (Fehlerklasse 1, in dieser Baureihe
// schon zweimal bezahlt.)
//
// Die Seitenwahl ist sign-frei hergeleitet: `links = up × fwd` (in einem rechtshändigen Rahmen
// zeigt bei up = +Y, fwd = −Z das Kreuzprodukt nach −X, und −X ist links). Liegt das Hindernis
// links, muss nach rechts gedreht werden. `A` gibt in `flight-controls.js` PLUS turnRate und
// A ist links — also ist rechts NEGATIV. `sign` ist trotzdem ein Regler: falls das im Bild
// verkehrt ist, dreht man es um, statt die Herleitung zu diskutieren.
//
// ⚠ **Der Zuschlag ist ein AUSWEICHWINKEL, keine Kursänderung** (Georg, 29.8.):
//   „es scheint bei Kollision so, als würde die Flugrichtung geändert … statt das Objekt mit
//    sauberer Flug-Animation (banking etc) elegant daran vorbeizuführen — ohne den Kurs zu
//    ändern!"
// Erste Fassung gab eine DREHRATE heraus. Eine Drehrate integriert sich in `heading`: nach dem
// Vorbeiflug stand der Kurs schief — das Ausweichen hatte den Reiseweg umgeschrieben.
// Jetzt liefert das Modul einen **Winkelversatz gegen den gemerkten Kurs** (0 wenn frei). Der
// Runner fährt daraus einen Servo: „Kurs + Versatz" ist das Ziel, und weil der Versatz beim
// Verlassen auf 0 zurückgeht, führt derselbe Servo auf den ALTEN Kurs zurück. Netto-Kursänderung
// nach dem Manöver: null, ohne Buchhaltung.
// Die Schräglage kommt gratis: `carpet.js` bankt aus `turnInputSmoothed`, also bankt ein weiches
// Hin-und-Zurück von selbst in beide Richtungen — genau die „saubere Flug-Animation".
// ============================================================================

export function createLandmarkCollide(opts = {}) {
  const THREE = opts.THREE;
  const R = opts.radius != null ? opts.radius : 5;
  const P = Object.assign({
    on: true,
    swing: 0.55,      // maximaler Ausweichwinkel gegen den Kurs (rad ≈ 32°) bei voller Durchdringung
    // **Vorausschau statt Berührung.** Bei Tempo 0,28 sind 1,1 Weltmaß knapp vier Sekunden — so
    // lange braucht ein sanfter Bogen, um einen Bau von 0,3 Breite zu umgehen, ohne dass es nach
    // Lenken aussieht. Kürzer wäre ein Reflex, länger ein Slalom um Dinge, die nie im Weg lagen.
    lookahead: 1.1,
    brake: 0,         // Tempo-Deckel im Hindernis (0 = keine Bremse — gefragt ist Eleganz, nicht Stau)
    margin: 2.4,      // seitlicher Sicherheitsabstand als Vielfaches des Wirkradius
    sign: -1,         // Drehrichtung weg vom Hindernis (siehe Kopf)
    reactR: 1.45,     // Reaktionsradius der Wegweiser, Faktor auf ihren Radius
  }, opts.params || {});

  const sites = [];
  const _sp = new THREE.Vector3(), _to = new THREE.Vector3(), _left = new THREE.Vector3();
  const out = { offset: 0, speedCap: 0, near: null, kind: null, pen: 0 };
  let treffer = 0, reaktionen = 0;

  /** @param list [{ n:{x,y,z} (Einheitsvektor), alt, r, kind:'around'|'react', ref }] */
  function setSites(list) {
    sites.length = 0;
    for (const s of (list || [])) {
      if (!s || !s.n || !s.kind) continue;
      sites.push({
        p: new THREE.Vector3(s.n.x, s.n.y, s.n.z).multiplyScalar(R + (s.alt || 0)),
        r: Math.max(0.02, s.r || 0.12), kind: s.kind, ref: s.ref || null, drin: false,
      });
    }
    return sites.length;
  }

  /** Einmal je Bild. `pos` Weltort des Avatars, `up` Standortnormale, `fwd` Flugrichtung (Welt).
   *
   *  ⚠ **Der Test war falsch konstruiert, und Georg hat es gesehen: „man fliegt durch braune
   *  Türme durch".** Er maß die AKTUELLE Überdeckung (Abstand < Grenze), und der Ausweichbetrag
   *  war `pen²`. Beides zusammen ist ein Widerspruch: der Bogen setzt genau dann am schwächsten
   *  ein, wenn man noch Zeit hätte auszuweichen, und ist erst voll, wenn man schon drin steckt.
   *  Gerechnet: eine Mühle hat 0,153 Wirkradius, mit Marge 1,9 also 0,29 — bei Tempo 0,28 sind
   *  das **eine Sekunde**, und die erste halbe davon ist der Bogen unter einem Viertel.
   *
   *  Ein Pilot weicht nicht aus, wenn er das Hindernis BERÜHRT, sondern wenn es VOR ihm liegt.
   *  Also der Test, den ein Pilot macht: Hindernis auf die Flugachse projizieren — liegt es
   *  voraus (innerhalb `lookahead`) und ist sein SEITLICHER Abstand kleiner als Radius plus
   *  Sicherheitsabstand, wird gedreht. Der Betrag hängt daran, wie ZENTRAL es liegt (nicht wie
   *  tief man drin ist) und wie nah es zeitlich ist. Das ist derselbe Rechenaufwand und die
   *  richtige Frage. */
  function query(pos, up, fwd) {
    out.offset = 0; out.speedCap = 0; out.near = null; out.kind = null; out.pen = 0;
    if (!P.on || !sites.length || !pos) return out;
    _left.copy(up).cross(fwd);
    if (_left.lengthSq() < 1e-9) return out;
    _left.normalize();

    let best = null, bestDrang = 0, bestLinks = 1;
    for (const s of sites) {
      _to.copy(s.p).sub(pos);
      const laengs = _to.dot(fwd);                 // Abstand VORAUS auf der Flugachse
      const seit = _to.dot(_left);                 // seitlicher Versatz (positiv = links)
      const hoch = _to.dot(up);                    // über/unter uns — ein Dach unter uns zählt nicht
      const dist = _to.length();

      if (s.kind === 'react') {
        // Die Wegweiser reagieren auf BERÜHRUNG, nicht auf Annäherung — sie sollen anschlagen,
        // wenn man durchfliegt. Hier bleibt der Abstandstest richtig.
        const grenze = s.r * P.reactR;
        if (dist > grenze) { if (s.drin && dist > grenze * 1.25) s.drin = false; continue; }
        if (!s.drin) {
          s.drin = true; reaktionen++;
          // 1.9. · Block 3 (Georg: „dieselbe seitenabhängige Drehung wie die Karten"): `seit` steht
          // hier schon (oben berechnet, vorher nur für 'around' gelesen) — dritter Parameter, kein
          // neuer Rechenweg. Vorzeichen 1 = von links durchflogen.
          if (opts.onReact) { try { opts.onReact(s.ref, 1 - dist / grenze, seit >= 0 ? 1 : -1); } catch (e) {} }
        }
        continue;
      }

      // Vorausschau: hinter uns und zu weit vorn interessiert nicht. Ein Stück NEGATIVES
      // `laengs` bleibt drin, damit der Bogen beim Passieren nicht abrupt endet.
      if (laengs < -s.r || laengs > P.lookahead) { s.drin = false; continue; }
      // Vertikal vorbei: der Bau reicht von seinem Fuß bis `r` nach oben (der Radius ist aus der
      // Modellhöhe abgeleitet). Wer höher fliegt, muss nicht ausweichen — und das ist der
      // ehrliche Grund, warum ein Tiefflug gefährlicher ist als ein Höhenflug.
      if (hoch < -s.r * 1.5 || hoch > s.r * 1.2) { s.drin = false; continue; }
      const frei = s.r * P.margin;
      if (Math.abs(seit) > frei) { s.drin = false; continue; }

      // **Drang** aus zwei Faktoren: wie zentral (1 = genau im Kurs) und wie nah (1 = gleich da).
      // Beide linear — zusammen ergibt das ein weiches Einsetzen ohne die `pen²`-Falle.
      const zentral = 1 - Math.abs(seit) / frei;
      const naehe = 1 - Math.max(0, laengs) / P.lookahead;
      const drang = Math.max(0.18, zentral) * (0.35 + 0.65 * naehe);
      s.drin = true;
      if (drang > bestDrang) {
        bestDrang = drang;
        best = s;
        // Weg vom Hindernis. Liegt es fast genau im Kurs, ist die Seite beliebig — dann
        // entscheidet das Vorzeichen des Versatzes, und bei exakt 0 die feste Wahl „nach rechts".
        bestLinks = seit > 0 ? 1 : -1;
      }
    }

    if (best) {
      out.offset = P.sign * bestLinks * P.swing * Math.min(1, bestDrang);
      out.speedCap = P.brake;
      out.near = best; out.kind = 'around'; out.pen = bestDrang;
      treffer++;
    }
    return out;
  }

  return {
    name: 'landmark-collide', params: P, setSites, query,
    get result() { return out; },
    setEnabled(on) { P.on = !!on; },
    setParams(o) { Object.assign(P, o || {}); },
    report() {
      let a = 0, r = 0;
      for (const s of sites) { if (s.kind === 'around') a++; else r++; }
      return { an: P.on, umfliegen: a, reagieren: r, drin: !!out.near,
               ausweichwinkel: +(out.offset * 180 / Math.PI).toFixed(1), bilderImHindernis: treffer,
               reaktionen };
    },
  };
}
