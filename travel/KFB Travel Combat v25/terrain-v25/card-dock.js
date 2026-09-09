// ============================================================================
// card-dock.js — KFB Travel · Slice S32c · Landung in die Karten-Detailansicht
// ----------------------------------------------------------------------------
// Georgs Sequenz, wörtlich: **mit dem Pet anfliegen → per Zoom in POV (Pet weg) →
// vor der Karte abbremsen → ausrichten → saubere Landung in die Detailansicht.**
// Die Detailansicht ist KEIN Overlay und kein zweiter Viewport: sie ist die Karte,
// bildschirmfüllend, mit ihrer Tuschekante und ihrer Live-Demo. Genau deshalb
// braucht es hier auch kein DOM — nur eine Kamera, die richtig steht.
//
// WIE DIE ÜBERGABE FUNKTIONIERT (der Trick, der den Slice klein hält):
// Das Dock rechnet die IDEALE Kartenansicht und liefert sie als GEWICHTETEN BEITRAG:
//     mix = { k, pos, look },  k: 0 → 1 beim Landen, 1 → 0 beim Lösen.
// Das Rig mischt beides mit demselben k. Damit gibt es keinen zweiten Kamera-Zustand,
// kein Umschalten, kein Ruck — und das Lösen ist derselbe Weg rückwärts.
//
// **Responsiv heißt hier: die Distanz kommt aus dem FOV und dem Seitenverhältnis.**
// Ein Hochformat-Fenster darf die Karte nicht anschneiden, ein breites soll sie
// nicht verschenken — also `max(halfH/tan(fov/2), halfW/(tan(fov/2)·aspect))·pad`.
// Beim Fenster-Resize stimmt es dadurch von selbst, jeden Frame neu.
//
// Das FLUGZEUG hält das Dock NICHT an — die Karte fliegt, das ist Kanon. Während
// der Detailansicht kreist der Auto-Pilot weiter (`loiter`), unsichtbar hinter der
// Kamera. Das hält Streaming, Live-Pacer und Fokus-Distanz am Leben.
//
// **S41 (V9-A): das Dock schreibt die Kamera NICHT mehr.** Es liefert `mix` = { k, pos, look },
// und `camera-rig.js` mischt es an seiner einen Schreibstelle ein. Vorher wurde die Position mit
// `k` gemischt, das Blickziel aber ab `k > 0,04` **hart überschrieben** — ein Faktor für das eine,
// ein Schalter für das andere. Genau das war Georgs springende Detailansicht.
// Es bekommt deshalb auch keine Kamera mehr, sondern nur noch `{ fov, aspect }`: was man nicht
// hat, kann man nicht schreiben.
//
//   const dock = createCardDock({ THREE });
//   dock.request(card, camera);          // nach der Ankunft (liest die Blickachse EINMAL)
//   dock.update(dt, { fov, aspect });    // VOR dem Rig
//   dock.release();                      // Esc/X/Steuern
// ============================================================================

export function createCardDock(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    // S95 · 1,02 statt 1,08 — Georg: „ein bisschen mehr in den Anschnitt". 1,0 = randlos, darunter
    // schneidet der Rahmen die Karte an; die Wonky-Rotation der Karten nimmt sich davon ohnehin ein
    // halbes Prozent. Die Tusche bleibt drin, nur die Luft geht weg.
    pad: 1.02,        // Randabstand: 1.0 = Karte randlos, größer = mehr Luft
    // **S56 (v10): das Dock hat keine eigene Uhr mehr.** `k` kommt von der Ankunfts-Regie
    // (`arrival.js`), die EINEN Fortschritt für alle vier Anteile besitzt. `ease`/`sCurve`/`leave`
    // bleiben stehen und gelten nur noch im Eigenantrieb (`drive: 'self'`) — der ist der Rückfall,
    // falls jemand das Dock ohne Regie benutzt, und die Vergleichsfassung für die Messung.
    drive: 'extern',  // 'extern' = die Regie setzt k · 'self' = alte Fassung mit eigener Uhr
    ease: 2.4,        // 1/s — Landegeschwindigkeit (Position mischt sich ein)
    // Die Landung mischt mit einer S-KURVE, nicht mit dem rohen `k`. Das rohe k ist exponentiell
    // (`k += (1-k)*dt*ease`), also am ANFANG am schnellsten — genau im Moment der Übergabe vom
    // Follow-Flug. Das war der Lurch beim Andocken (gemessen 46°/s Spitze).
    sCurve: true,
    leave: 0.55,      // s — Lösen
    dockedAt: 0.9,    // ab diesem k gilt „gelandet" (Zeiger gehört der Demo)
    // ---- S93 · Der SITZ. Georgs Regie, wörtlich: „das Pad steht unten links auf der Karte, rechts
    // der Tacho — das ist eine Zeile, darüber die Karte, die kann auch höher sitzen." Damit ist der
    // Platz des Fahrzeugs **relativ zur Karte** definiert, genau wie der Blick des Spielers, und
    // beide fallen aus EINER Rechnung (`frameFor`).
    //
    // Warum das die eigentliche Reparatur ist: bis S92 hatte die Ankunft ZWEI Endzustände. Der
    // Anflug endete im POV (`arrival.zoomNear` 0,75 u), das Dock rahmt die Leseweite
    // (`fitDistance` ≈ 1,66 × Kartenhalbhöhe, gemessen 8 u) — der letzte Beat MUSSTE also
    // rückwärts fahren (gemessen S89l: 2,19 u hinter dem Fahrzeug statt 0,75 u davor). Auf diesem
    // Rückweg kam das Pad zurück ins Bild und musste weggeblendet werden. Genau das hat Georg
    // fünf Runden lang gemeldet. Ein Sitz macht das Ausblenden ARBEITSLOS: das Fahrzeug hat einen
    // Platz im Bild, also ist nichts zu verstecken.
    seatOn: true,
    // S95 · Tiefer in die Ecke (Georg). Das Pet ist 0,94 u hoch, bei 4,8 u Sitztiefe sind das ±0,15
    // in NDC — bei −0,72 reicht es also bis −0,87 und bleibt ganz im Bild. Der Teppich darf an der
    // Ecke anschneiden; er ist der Boden der Zeile, nicht ihr Gegenstand.
    seatNdc: [-0.62, -0.72],   // wo das Fahrzeug im Bild steht (NDC, −1..1)
    cardNdc: [0.00, 0.15],     // wo die Kartenmitte sitzt — positiv = höher, macht die Zeile unten frei
    seatDepth: 4.2,            // u — Mindesttiefe des Sitzes: darunter wächst das Pet ins Bild
    // S95 · 12 statt 8 Runden. Mit dem Sitz weiter draußen (−0,62/−0,72) ist die Kopplung zwischen
    // Versatz und Blickpunkt stärker, und der Restfehler stieg gemessen auf 0,038 — über der Grenze
    // von 0,03, die ich mir gesetzt habe. Vier Runden mehr kosten nichts (Vektormathematik, kein
    // Zeichnen) und bringen ihn rechnerisch um Faktor 0,46⁴ ≈ 0,045 herunter.
    solve: 12, relax: 0.9,     // Löser: Runden und Dämpfung (Begründung an `frameFor`)
  }, opts.params || {});

  const api = { onDock: null, onLeave: null };
  let phase = 'off', card = null, k = 0, fit = 0;
  const _n = new THREE.Vector3(), _p = new THREE.Vector3(), _t = new THREE.Vector3(), _up = new THREE.Vector3();
  // **Die Andock-Achse wird beim Anfordern EINGEFROREN.** Sie aus der laufenden Kartennormale zu
  // nehmen war eine Mitkopplung: die Kamera stellt sich auf die Normale, die Karte dreht sich zur
  // Kamera — jede kleine Vertikal-Abweichung wuchs, bis die Kamera über der Karte stand. Dann
  // entartet die Billboard-Basis (`up × to` → 0) und alles kippt: gemessen Karten-Up 88° aus der
  // Senkrechten, Kamera-Roll 71°, Normale und Blickachse trotzdem deckungsgleich (5°) — ein
  // stabiler, falscher Fixpunkt. Eine feste Achse hat den nicht.
  const _axis = new THREE.Vector3(0, 0, 1), _a2 = new THREE.Vector3(0, 0, 1);

  function pads(c) {
    const top = (c && c.padTop) || 0;                       // Titel-Anhängsel über der Karte
    // Post-it unter der Karte: **statische** Geometrie, nicht die lebende Position. Die wippt im
    // Wind (`lagY`), und jede Wippe änderte sonst die Andock-Distanz — die Kamera kroch mit.
    const bottom = c && c.postit && c.postit.visible ? c.pw * 0.42 + c.postit.geometry.parameters.height * 0.5 : 0;
    return { top, bottom };
  }
  function fitDistance(view, c) {
    const vf = view.fov * Math.PI / 180, tan = Math.tan(vf / 2);
    // Was an der Karte hängt, gehört in den Rahmen: Glyph-Titel oben, Post-it unten. Rahmt man
    // nur das Blatt, rutschen beide aus dem Bild (erst beim Post-it gemessen, dann bei den Glyphen).
    const pd = pads(c);
    // **S93 · Eine ausmittige Karte braucht mehr Weg.** Sitzt ihre Mitte bei `cardNdc` statt bei
    // (0,0), bleibt für ihre halbe Höhe nur `1 − |ndc|` des Halbbildes — sonst schiebt genau die
    // Anhebung, die die untere Zeile freimacht, den oberen Rand aus dem Bild.
    const cx = P.seatOn ? Math.abs(P.cardNdc[0]) : 0, cy = P.seatOn ? Math.abs(P.cardNdc[1]) : 0;
    const dH = (c.half.h + (pd.top + pd.bottom) * 0.5) / (tan * Math.max(0.12, 1 - cy));
    const dW = c.half.w / (tan * Math.max(view.aspect, 0.2) * Math.max(0.12, 1 - cx));
    return Math.max(dH, dW) * P.pad;
  }

  // ---- S93 · EINE Geometrie für zwei Plätze ------------------------------------------------
  // Gesucht ist die Kamera, bei der das Fahrzeug auf `seatNdc` und die Karte auf `cardNdc` steht.
  // Ein Löser und keine Formel, weil die zwei Wünsche an verschiedenen Hebeln hängen: ein
  // SEITLICHER Kameraversatz verschiebt das nahe Fahrzeug stark und die ferne Karte kaum
  // (Parallaxe, 1/Tiefe), ein anderer BLICKPUNKT verschiebt beide gleich. Also stellt der Versatz
  // den Sitz, der Blickpunkt die Karte, und ein paar gedämpfte Runden lösen die Kopplung. Die
  // Unterkorrektur ist bekannt und eingerechnet: der Versatz dreht die Kamera mit (der Blickpunkt
  // steht ja fest), was einen Teil seiner Wirkung zurücknimmt — Faktor (1 − dSitz/dKarte) ≈ 0,6.
  // Mit `relax` 0,9 bleiben je Runde 0,46 Restfehler, nach 8 Runden 0,2 % (`report().fehler`).
  const _cc = new THREE.Vector3(), _v = new THREE.Vector3();
  const _F = new THREE.Vector3(), _A = new THREE.Vector3(), _R = new THREE.Vector3(), _U = new THREE.Vector3();
  const _UP = new THREE.Vector3(0, 1, 0);
  const _t2 = new THREE.Vector3(), _p2 = new THREE.Vector3();
  const _nq = { x: 0, y: 0, d: 0 }, _nc = { x: 0, y: 0, d: 0 };
  let _gap = 0, _err = 0, _seatD = 0;

  function ndcOf(pt, C, tan, asp, out) {
    _v.subVectors(pt, C);
    const dz = _v.dot(_F);
    out.d = dz;
    out.x = dz > 1e-3 ? _v.dot(_R) / (dz * tan * asp) : 0;
    out.y = dz > 1e-3 ? _v.dot(_U) / (dz * tan) : 0;
    return out;
  }
  // Die Kartenmitte inklusive Anhänge-Ausgleich — EINE Stelle, beide Verbraucher lesen sie.
  function centerOf(c) {
    const pd = pads(c);
    _cc.copy(c.holder.position);
    _cc.y += (pd.top - pd.bottom) * 0.5;
    return _cc;
  }
  function fitWant(view, c, padPos, ax) {
    let f = fitDistance(view, c);
    _gap = 0;
    if (padPos) { _v.subVectors(padPos, centerOf(c)); _gap = Math.max(0, _v.dot(ax)); }
    // **Das Fahrzeug darf nicht ins Bild wachsen.** Es hält 6,3 u vor dem Blatt (gemessen S89) —
    // bei 8 u Leseweite wären das 1,7 u Tiefe und damit 43 % Bildhöhe für ein 0,94 u hohes Pet.
    // Also rückt die Kamera so weit, dass dem Sitz `seatDepth` Tiefe bleibt. Der HALT gehört
    // weiter dem Piloten (`settleDist`); hier wird nur gerahmt — ein Eigentümer je Zahl.
    if (P.seatOn && padPos) f = Math.max(f, _gap + P.seatDepth);
    return f;
  }
  function frameFor(view, c, padPos, ax, fitD, outPos, outLook) {
    const tan = Math.tan(view.fov * Math.PI / 360), asp = Math.max(view.aspect, 0.2);
    const C0 = centerOf(c);
    outPos.copy(C0).addScaledVector(ax, fitD);
    outLook.copy(C0);
    const seat = !!(P.seatOn && padPos);
    const runs = seat ? Math.max(1, P.solve) : 1;
    for (let it = 0; it < runs; it++) {
      _F.subVectors(outLook, outPos);
      if (_F.lengthSq() < 1e-8) _F.copy(ax).multiplyScalar(-1);
      _F.normalize();
      _A.copy(_F).multiplyScalar(-1);
      _R.crossVectors(_UP, _A);
      if (_R.lengthSq() < 1e-8) _R.set(1, 0, 0);
      _R.normalize();
      _U.crossVectors(_A, _R);
      if (!seat) break;
      const q = ndcOf(padPos, outPos, tan, asp, _nq);
      const qc = ndcOf(centerOf(c), outPos, tan, asp, _nc);
      _err = Math.max(Math.abs(q.x - P.seatNdc[0]), Math.abs(q.y - P.seatNdc[1]),
                      Math.abs(qc.x - P.cardNdc[0]), Math.abs(qc.y - P.cardNdc[1]));
      _seatD = q.d;
      // Sitz über den Kameraversatz: C nach +R schiebt das Bild des Sitzes nach −x.
      if (q.d > 0.4) {
        outPos.addScaledVector(_R, (q.x - P.seatNdc[0]) * q.d * tan * asp * P.relax);
        outPos.addScaledVector(_U, (q.y - P.seatNdc[1]) * q.d * tan * P.relax);
      }
      // Karte über den Blickpunkt: L nach +R dreht die Kamera nach rechts, das Bild wandert nach −x.
      if (qc.d > 0.4) {
        outLook.addScaledVector(_R, (qc.x - P.cardNdc[0]) * qc.d * tan * asp * P.relax);
        outLook.addScaledVector(_U, (qc.y - P.cardNdc[1]) * qc.d * tan * P.relax);
      }
    }
    return padPos ? outPos.distanceTo(padPos) : fitD;
  }
  // Die Achse aus einer Blickrichtung, flach gehalten — dieselbe Regel wie in `request`, und
  // deshalb an EINER Stelle: sonst rahmt die Vorschau anders als die Landung.
  function flatAxis(out, from, to) {
    out.subVectors(from, to);
    if (out.lengthSq() < 1e-6) out.set(0, 0, 1);
    out.normalize();
    const maxY = 0.3;
    if (Math.abs(out.y) > maxY) {
      const s = Math.sign(out.y) * maxY;
      out.y = s;
      const h = Math.sqrt(Math.max(1e-6, 1 - s * s)) / Math.max(1e-6, Math.hypot(out.x, out.z));
      out.x *= h; out.z *= h;
    }
    return out;
  }

  function update(dt, view, padPos) {
    if (phase === 'off' || !card) return false;
    if (P.drive === 'self') {
      if (phase === 'leave') { k -= dt / Math.max(0.05, P.leave); }
      else k += (1 - k) * Math.min(1, dt * P.ease);
    }
    if (phase === 'leave' && k <= 0.001) { k = 0; phase = 'off'; card = null; return false; }
    if (phase === 'align' && k >= P.dockedAt) { phase = 'docked'; if (api.onDock) { try { api.onDock(card); } catch (e) {} } }
    // Die Fit-Distanz wird TIEFPASSGEFILTERT: sie hängt an FOV und Seitenverhältnis (soll sie),
    // aber das FOV selbst läuft während des Übergangs noch — ungefiltert wäre das ein Kriechen.
    // S93 · Gefiltert wird weiter die DISTANZ, nicht das Ergebnis: die Rahmung selbst muss jeden
    // Frame exakt lösen, sonst schleppt der Sitz hinter dem Bild her.
    const want = fitWant(view, card, padPos, _axis);
    fit = fit > 0 ? fit + (want - fit) * Math.min(1, dt * 3) : want;
    // Blickziel und Kameraort kommen aus EINER Rechnung (Kommentar an `frameFor`). Der
    // Anhänge-Ausgleich steckt in `centerOf`.
    frameFor(view, card, padPos || null, _axis, fit, _t, _p);
    return true;
  }

  return {
    name: 'card-dock', update, fitDistance,
    // Der Beitrag ans Rig: Ziel, Blickziel, Gewicht. Kein Schreibzugriff.
    // `k` ist die S-Kurve über dem rohen Fortschritt — weiche Enden auf beiden Seiten.
    // `k` ist im Eigenantrieb die S-Kurve über dem rohen Fortschritt; im Extern-Antrieb bringt die
    // Regie ihre Kurve schon mit — zweimal glätten wäre wieder ein zweiter Verlauf auf derselben
    // Bewegung, also genau die Fehlerklasse, die dieser Slice abschafft.
    get mix() { return phase === 'off' ? null : { k: (P.drive === 'self' && P.sCurve) ? k * k * (3 - 2 * k) : k, pos: _t, look: _p }; },
    get phase() { return phase; },
    get owns() { return phase !== 'off'; },
    get docked() { return phase === 'docked'; },
    get progress() { return k; },
    get card() { return card; },
    // Der Beitrag von außen. Die Regie schreibt hier ihren Fortschritt hinein — das Dock rechnet
    // weiter die IDEALE Ansicht (Fit-Distanz, Achse), aber nicht mehr, WANN sie gilt.
    setK(v) { if (P.drive === 'extern') k = Math.max(0, Math.min(1, v || 0)); },
    // **S93 · Der Soll-Abstand Kamera↔Fahrzeug am Ende der Ankunft — für JEDE Karte, auch bevor
    // das Dock sie besitzt.** Das ist die eine fehlende Tatsache gegen die zwei Endzustände: die
    // Ankunfts-Regie fragt hier, wohin ihr Zoom laufen soll, statt eine eigene Zahl (0,75 u) zu
    // führen, die dem Dock widerspricht. Vorschau und Landung rechnen dieselbe Rahmung, also gibt
    // es beim Übergeben keinen Sprung.
    followFor(view, c, padPos, camPos) {
      if (!c || !c.holder || !view) return 0;
      const ax = (phase !== 'off' && c === card) ? _axis : flatAxis(_a2, camPos || c.holder.position, c.holder.position);
      return frameFor(view, c, padPos || null, ax, fitWant(view, c, padPos, ax), _t2, _p2);
    },
    // Messwerte dieses Slices: Restfehler des Lösers, Tiefe des Sitzes, Abstand Fahrzeug↔Blatt.
    report() { return { fehler: _err, sitzTiefe: _seatD, abstand: _gap, fit }; },
    request(c, camera) {
      if (!c || card === c) return;
      card = c; phase = 'align'; k = Math.max(k, 0); fit = 0;
      // Achse = Blickrichtung im Moment der Ankunft, aber flach gehalten: aus steiler Auf- oder
      // Untersicht ist eine Lesekarte keine Lesekarte.
      if (camera) flatAxis(_axis, camera.position, c.holder.position);
      else { _axis.set(0, 0, 1).applyQuaternion(c.holder.quaternion); flatAxis(_axis, _axis.add(c.holder.position), c.holder.position); }
    },
    release() {
      if (phase === 'off' || phase === 'leave') return;
      phase = 'leave';
      if (api.onLeave) { try { api.onLeave(card); } catch (e) {} }
    },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    get onDock() { return api.onDock; }, set onDock(f) { api.onDock = f; },
    get onLeave() { return api.onLeave; }, set onLeave(f) { api.onLeave = f; },
  };
}
