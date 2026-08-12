// ============================================================================
// flight-controller.js — KFB Travel v15 · Motion Controller (Flight) · fc-v2.0
// ----------------------------------------------------------------------------
// Herkunft: v14/fc-v1 (aus PetFlight v2, Kugel → flache Welt). **v15 baut die
// Fahrdynamik nach dem Vorbild `dannylimanseta/tinyskies` um** (Zweig
// `cursor/globefly-multiplayer-globe-flight-game`, `client/src/game/Carpet.ts`
// und `Plane.ts`). Was von dort kommt, steht mit Zahl und Herkunft im Kommentar.
//
// Contract (004/005 Motion Controller) unverändert: der Controller besitzt die
// BEWEGUNG — keine Kamera, kein Pet, kein Rendern. Er liest normierte Eingaben +
// Bodenhöhe und veröffentlicht den Fahrzeugzustand.
//
//   const fc = createFlightController({ THREE });
//   fc.update(dt, input, groundY);
//   fc.state → { position, quaternion, forward, right, up, speed, alt, bank,
//                pitchTilt, boosting, climbIn, grounded, flying, drift, driftAmt,
//                heading, vHeading, turnRate, … }
//
// ── Die fünf Änderungen gegen v14, und warum ────────────────────────────────
// (1) **Der Kurs ist eine ZAHL, kein gedrehter Vektor.** `head` (Facing) und
//     `vHead` (Fahrtrichtung) sind Winkel; `forward` wird daraus gerechnet.
//     Erst damit lassen sich beide auseinanderlaufen — und das ist Punkt (3).
// (2) **Zeitkonstanten exponentiell** (`1 − e^(−k·dt)`) statt `min(1, k·dt)`.
//     Die alte Form ist bildratenabhängig: bei 30 fps glättet sie doppelt so
//     hart wie bei 60. tinyskies rechnet durchgängig exponentiell.
// (3) **Traktion und Drift** (`Carpet.ts` §Drift): die Fahrtrichtung folgt dem
//     Facing mit endlicher Haftung. Scharfe Kurve bei Tempo = die Haftung reißt,
//     das Pad rutscht — und LEHNT sich in den Rutsch. Bremsen stellt Haftung
//     schneller her als Fahren. **Das ist die Signatur des Vorbilds**, nicht
//     Zierrat: ohne sie ist eine Kurve nur eine gedrehte Gerade.
// (4) **Lenken kostet Tempo** (`Plane.ts`: `turnDrag = turnStrength * 0.8 * dt`).
//     In v14 stand ausdrücklich das Gegenteil im Kommentar. Der Grund für die
//     Umkehr ist der Boost: er fühlt sich nur dann „freier" an, wenn Kurven
//     sonst etwas kosten. `boostYawGain` (v14/S2) bleibt und wirkt jetzt gegen
//     einen echten Widerstand.
// (5) **Höhe steigt schnell, sinkt langsam** (`Carpet.ts` ALTITUDE_RISE 0.75 /
//     FALL 0.38) und **die Kufe hebt sich über den Hügel**, statt an ihm zu
//     klemmen: der Boden schiebt das SOLL mit hoch, nicht nur den Istwert.
//     Genau das ist Georgs Auftrag „Bodenkontakt ist kein Landebefehl" auf der
//     Physik-Seite — die Modus-Seite steht im Runner (`autoMode`, v15/F0).
//
// **Was NICHT übernommen wurde und warum:** tinyskies fliegt vollständig
// geländefolgend (Höhe = Oberfläche + Bodenfreiheit). Bei uns hängen Karten,
// Zonenring („Bodenluft") und Anflug an ABSOLUTEN Höhen — geländefolgend wäre
// eine zweite Höhen-Wahrheit neben der Registry. Übernommen ist deshalb die
// Kufe (weicher Auftrieb am Hang), nicht das Prinzip.
// ============================================================================

// Fassung dieses Moduls. **Bewusst KEIN eigener `export`** — der Standalone-Bundler zog die
// Datei nicht in den Bundle-Graphen, sobald sie zwei Ausfuhren hatte (der Modulspezifizierer
// `./flight-controller.js` blieb im Bundle unaufgelöst, Bild blieb leer). Eine Konstante ist
// das nicht wert: sie steht im Zustandsobjekt und im Boot-Log.
const FC_VERSION = 'fc-v2.0';

// Bildratenunabhängige Annäherung. `k` ist eine RATE in 1/s: nach 1/k Sekunden
// sind ~63 % des Wegs zurückgelegt. Ersetzt überall `Math.min(1, dt * k)`.
const ex = (k, dt) => 1 - Math.exp(-Math.max(0, k) * dt);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
// Winkel auf [−π, π] — ohne das springt die Haftung einmal pro Umdrehung.
const wrapPi = (a) => {
  const t = (a + Math.PI) % (Math.PI * 2);
  return (t < 0 ? t + Math.PI * 2 : t) - Math.PI;
};

export function createFlightController(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    SPD_MIN: 2, SPD_MAX: 42, CRUISE: 9,
    // **Rückwärtsgang** (v14/S45): „S" fährt unter null weiter — zurück zu einer verpassten Karte,
    // ohne eine ganze Kurve zu fliegen. Das Blatt dreht sich dabei NICHT: es schiebt sich rückwärts,
    // und man sieht es an der Nase (sie hebt sich leicht, wie beim Bremsen).
    SPD_REV: -11, revPitch: 0.12,
    // **Standdrehung** (Q/E): Drehen um die eigene Achse statt eine Kurve zu fliegen. Sie ist keine
    // zweite Lenkung, sondern Lenkung PLUS Tempo-Bremse: wer sich auf der Stelle dreht, fährt nicht.
    pivotRate: 2.4, pivotHold: 3.0,
    ALT_MIN: 2.2, ALT_MAX: 160,
    yawRate: 1.9, climbRate: 16, accel: 14, decel: 16,
    // **Harte Bremse** (X, und derselbe Weg für den Anflug): sie zieht das Soll-Tempo mit
    // `decel · brakeGain` herunter UND lässt die Ist-Geschwindigkeit schneller folgen.
    brakeGain: 3.4, brakeLag: 4.5, brakePitch: 0.3,
    // **Warp** (v14/S43): die Reisegrenze ist kein Naturgesetz, sondern eine Regie-Entscheidung.
    // `warp` ist ein FAKTOR 0..1, kein Schalter.
    warpGain: 2.6, warpLag: 3.2, warpPitch: -0.06,
    // v14/S2 · mehr Lenk-Autorität, solange der Boost läuft. 1 = aus.
    boostYawGain: 1.28,

    // ── v15 · Lenkung ────────────────────────────────────────────────────────
    // **Der Lenkbefehl wird geglättet, nicht das Ergebnis** (tinyskies
    // TURN_INPUT_SMOOTH = 8, für Flugzeug und Teppich gleich). Vorher wirkte
    // jede Taste im selben Bild voll — deshalb fühlte sich A/D digital an und
    // der Zug am Zeiger analog. Jetzt haben beide dieselbe Anstiegszeit, und die
    // Kennlinie der Eingabe-Schicht bleibt, was sie ist: eine Kennlinie.
    turnSmooth: 8,
    // **Lenken kostet Tempo** (tinyskies `Plane.ts`). Als ANTEIL von SPD_MAX pro
    // Sekunde bei vollem Ausschlag — eine absolute Zahl wäre bei SPD_MAX 18 eine
    // Vollbremsung und bei 90 nicht zu spüren.
    turnDrag: 0.12,

    // ── v15 · Traktion und Drift (tinyskies `Carpet.ts`) ─────────────────────
    driftOn: true,
    gripNormal: 5.0,     // Fahrtrichtung holt das Facing normal ein (1/s)
    gripDrift: 1.4,      // … im Rutsch deutlich langsamer
    gripBrake: 8.0,      // Bremsen stellt die Haftung her — das ist der Ausweg
    driftTurn: 0.62,     // Anteil des vollen Lenkbefehls, ab dem die Haftung reißt
    driftSpeed: 0.42,    // Anteil von SPD_MAX, darunter rutscht nichts
    driftBank: 0.55,     // wie stark der Rutschwinkel zusätzlich lehnt
    driftBankMax: Math.PI / 5,
    // **Abweichung vom Vorbild, mit Grund.** tinyskies deckelt den Rutschwinkel
    // NICHT — im Beharrungszustand ist er `Lenkrate / Haftung`, also 1,9/1,4 =
    // **1,36 rad = 78°**. Gemessen: das Pad fährt in der Dauerkurve quer. Auf einer
    // kleinen Kugel mit kurzen Kurven fällt das nicht auf; bei uns fährt man lange
    // Kurven, und ein Kartenblatt mit Pet darauf, das seitwärts fliegt, liest sich
    // als Defekt, nicht als Drift. Also ein Deckel — er begrenzt nur, er treibt nichts.
    driftMaxGap: 0.7,    // rad (40°)

    // ── v15 · Höhe ───────────────────────────────────────────────────────────
    // Steigen schnell, Sinken langsam (tinyskies 0.75 / 0.38 — Verhältnis ~2:1).
    altRise: 3.4, altFall: 1.7,
    // **Die Kufe.** v14 hatte hier eine Klemme: `alt = minAlt`. Eine Klemme ist kein
    // Fahrverhalten — sie ist ein Anschlag, und man hört förmlich, wie das Pad am Hang
    // entlangschrammt. Der erste v15-Anlauf (SOLL langsam auf `minAlt` nachziehen) war
    // gemessen **wirkungslos**: 86 Klemm-Bilder mit und ohne Kufe, weil ein träges Soll
    // langsamer ist als die Klemme, die es ersetzen sollte.
    // Richtig ist ein **Kissen ÜBER dem Boden** (`hugBand`), das mit eigener Rate
    // (`hugRise`) drückt — unabhängig von `altRise`. Das Pad hebt sich, BEVOR es
    // aufsetzt. Ruhelage: `ALT_MIN + hugBand · hugRise/(hugRise+altFall)` — aus dieser
    // Zahl wird die Schwebehöhe, und damit verhält sich das Fahrzeug wie der Teppich im
    // Vorbild: es LIEGT nie auf, es schwebt.
    hugRise: 6.0, hugBand: 1.6,

    // v14/S10 · Landung: ab wann gilt Bodenkontakt als „gelandet". **v15: das
    // Ergebnis wird im Runner NICHT mehr für einen Moduswechsel benutzt**
    // (`autoMode` steht auf aus). Der Zustand bleibt veröffentlicht, weil ihn
    // Ton und Anzeige lesen — aber er ist kein Befehl mehr.
    landSink: 7, landHold: 0.22,
    brakeLands: true,
    // u/s — darunter gilt „steht" als erreicht, solange `hold` anliegt (v14/S89b).
    holdSnap: 0.25,
  }, opts.params || {});

  const up = new THREE.Vector3(0, 1, 0);
  const forward = new THREE.Vector3(0, 0, -1);   // Facing, immer waagerecht
  const right = new THREE.Vector3(1, 0, 0);
  const vDir = new THREE.Vector3(0, 0, -1);      // Fahrtrichtung (kann vom Facing abweichen)
  const pos = new THREE.Vector3(0, P.CRUISE, 0);
  // **Kurs als Zahl.** `head` ist das Facing, `vHead` die Fahrtrichtung; `forward`
  // und `vDir` sind daraus gerechnet. Vorzeichen wie in `reset()`: (sin h, 0, cos h).
  let head = Math.PI, vHead = Math.PI;
  let alt = P.CRUISE, targetAlt = P.CRUISE;
  let speed = P.CRUISE, targetSpeed = P.CRUISE;
  let bank = 0, pitchTilt = 0, boosting = false, climbIn = 0, grounded = false, braking = 0, warp = 0, pivoting = false;
  let prevAlt = alt, sinkRate = 0, touchT = 0, landed = false;
  let turnCmd = 0, drifting = false, hugging = 0;

  const quaternion = new THREE.Quaternion();
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion();
  const _negF = new THREE.Vector3(), _zAxis = new THREE.Vector3(0, 0, 1), _xAxis = new THREE.Vector3(1, 0, 0);

  function setHead(h) {
    head = h;
    forward.set(Math.sin(head), 0, Math.cos(head));
    right.crossVectors(forward, up).normalize();
  }
  setHead(head);
  vDir.copy(forward);

  function update(dt, input, groundY) {
    input = input || {}; groundY = groundY || 0;
    dt = Math.max(1e-4, Math.min(0.1, dt));   // ein Tab-Wechsel darf keinen Sprung machen
    climbIn = input.climbIn || 0;
    boosting = !!input.boost;
    const br = clamp(input.brake || 0, 0, 1);
    const pivot = clamp(input.pivot || 0, -1, 1);
    pivoting = Math.abs(pivot) > 0.01;

    // ── Lenkung ──────────────────────────────────────────────────────────────
    // **Die Eingabe-Schicht liefert einen WINKEL für dieses Bild, nicht eine
    // Rate** (`yawIn += -nx * 1.9 * dt`) — das ist der Vertrag seit v9 und der
    // Autopilot bedient ihn genauso. Für die Glättung braucht es aber eine Rate,
    // sonst glättet man eine Zahl, die schon von `dt` abhängt. Also einmal
    // zurückrechnen, glätten, wieder mit `dt` multiplizieren. Der Vertrag nach
    // außen bleibt damit unangetastet.
    const rawRate = ((input.yawIn || 0) / dt + pivot * P.pivotRate) * (boosting ? P.boostYawGain : 1);
    turnCmd += (rawRate - turnCmd) * ex(P.turnSmooth, dt);
    setHead(head + turnCmd * dt);
    // Lehnen folgt der Drehrate (sichtbar, aber auch von CardRig/Pet gelesen).
    bank += ((-turnCmd * 0.06) - bank) * ex(5, dt);
    bank = clamp(bank, -0.6, 0.6);

    // ── Traktion: die Fahrtrichtung holt das Facing ein ─────────────────────
    // tinyskies `Carpet.ts`: `velocityHeading` läuft dem `heading` hinterher.
    // Reißt die Haftung, bleibt sie weiter zurück — das IST der Drift, es gibt
    // keine zweite Mechanik dafür. `noDrift` setzt der Runner, solange eine
    // Regie fliegt (Autopilot, Anflug): ein Regler, der auf eine Karte zusteuert,
    // rechnet mit dem Facing und würde um seinen eigenen Rutschwinkel pendeln.
    const turnMag = Math.min(1, Math.abs(turnCmd) / Math.max(0.001, P.yawRate));
    const spdFrac = Math.abs(speed) / Math.max(1, P.SPD_MAX);
    const driftAllowed = P.driftOn && !input.noDrift;
    if (!driftAllowed) drifting = false;
    else if (turnMag > P.driftTurn && spdFrac > P.driftSpeed && br < 0.5) drifting = true;
    else if (spdFrac <= P.driftSpeed || turnMag < 0.08) drifting = false;
    const grip = br > 0.5 ? P.gripBrake : (drifting ? P.gripDrift : P.gripNormal);
    vHead += wrapPi(head - vHead) * (driftAllowed ? ex(grip, dt) : 1);
    if (!driftAllowed) vHead = head;
    else {
      // Deckel auf dem Rutschwinkel (siehe `driftMaxGap`). Er wirkt an der
      // FAHRTRICHTUNG, nicht am Facing: das Pad zeigt weiter dorthin, wohin die Hand
      // lenkt — es rutscht nur nicht weiter als 40° daneben.
      const g0 = wrapPi(head - vHead);
      if (Math.abs(g0) > P.driftMaxGap) vHead = head - Math.sign(g0) * P.driftMaxGap;
    }
    vDir.set(Math.sin(vHead), 0, Math.cos(vHead));
    const driftGap = wrapPi(head - vHead);

    // ── Höhe ─────────────────────────────────────────────────────────────────
    targetAlt = clamp(targetAlt + climbIn, P.ALT_MIN, P.ALT_MAX);
    const minAlt = groundY + P.ALT_MIN;
    // Das SOLL liegt nie unter dem Boden — sonst zieht die Höhensteuerung dauerhaft
    // gegen die Kufe (v14 machte dasselbe, nur als Nebenwirkung der Klemme).
    if (targetAlt < minAlt) targetAlt = minAlt;
    alt += (targetAlt - alt) * ex(targetAlt > alt ? P.altRise : P.altFall, dt);
    // **Die Kufe:** ein Kissen über dem Boden, mit eigener Rate. `cardClearance` im
    // Runner blickt bereits voraus (1,2 + v·0,22 u), also beginnt das Heben, bevor der
    // Hang da ist — und hinter der Kuppe sinkt das Pad mit `altFall`, nicht mit einem Schnitt.
    const cushion = minAlt + P.hugBand;
    if (alt < cushion) {
      alt += (cushion - alt) * ex(P.hugRise, dt);
      hugging = Math.min(1, (cushion - alt) / Math.max(1e-3, P.hugBand));
    } else hugging = 0;
    if (alt < minAlt) { alt = minAlt; }   // letzter Anschlag, sollte praktisch nie greifen
    // **„Am Boden" heißt jetzt „auf dem Kissen", nicht „auf dem Anschlag".** Mit der Kufe
    // liegt das Pad nie auf; würde `grounded` weiter den Anschlag messen, wäre es dauerhaft
    // falsch — und `landed` (und damit der v14-Rückweg `autoMode: true`) könnte NIE mehr
    // feuern. Eine Auskunft, die durch einen anderen Umbau still unmöglich wird, ist die
    // teuerste Sorte Fehler in diesem Projekt.
    grounded = alt <= cushion + 0.05;

    // v14/S10 · Sinkrate + Landungs-Erkennung. **v15: nur noch Auskunft.** Der
    // Runner stellt daraus keinen Antrag mehr (`autoMode` aus) — wer landen will,
    // drückt F. Georgs Auftrag: „Boden-Kontakt sollte nicht in den Walk-Mode
    // wechseln." Die Erkennung bleibt, weil Ton und Panel sie lesen; sie zu
    // löschen hieße, eine Auskunft wegzunehmen, statt einen Befehl.
    const dAlt = (alt - prevAlt) / dt; prevAlt = alt;
    sinkRate += (-dAlt - sinkRate) * ex(8, dt);
    const wantsDown = climbIn < -0.001 || (P.brakeLands && br > 0.5);
    if (grounded && sinkRate < P.landSink && wantsDown) touchT += dt; else touchT = 0;
    landed = touchT >= P.landHold;

    // ── Tempo ────────────────────────────────────────────────────────────────
    // Der Schub ist ein WERT, kein Schalter (v14): sonst kann ein Regler nur
    // Vollgas, Vollbremse oder nichts — daraus wurde das ruckelige Bang-Bang.
    const th = clamp(input.thrust || 0, -1, 1);
    // v14/S89 · `hold` hebt den Tempo-Boden auf — nur so kann das Pad wirklich STEHEN.
    const hold = clamp(input.hold || 0, 0, 1);
    const sMin = P.SPD_MIN * (1 - hold);
    warp = clamp(br ? 0 : (input.warp || 0), 0, 1);   // bremsen schlägt warpen
    if (th > 0) targetSpeed = Math.min(P.SPD_MAX, targetSpeed + P.accel * th * dt);
    if (th < 0) targetSpeed = Math.max(P.SPD_REV, targetSpeed + P.decel * th * dt);
    if (th >= 0 && !br && targetSpeed < sMin) targetSpeed = Math.min(sMin, targetSpeed + P.accel * 0.7 * dt);
    if (br) targetSpeed = Math.max(sMin, targetSpeed - P.decel * P.brakeGain * br * dt);
    // **v15 · Kurvenwiderstand** (tinyskies `Plane.ts`: `turnDrag = turnStrength * 0.8`).
    // **Erster Anlauf war wirkungslos, und die Messung hat es gezeigt:** als Abzug am
    // SOLL verpufft er, weil `W` das Soll mit `accel` = 14 u/s² gegen den Deckel
    // SPD_MAX drückt — gemessen 41,88 gegen 42,00 u/s, also **0 %**. Ein Abzug, den
    // eine gehaltene Taste in einem Bild wieder auffüllt, ist keiner.
    // Er ist deshalb eine **Absenkung der Obergrenze**: wer voll lenkt, hat ein
    // niedrigeres Höchsttempo. Das ist auch die ehrlichere Aussage — eine Kurve
    // kostet nicht Energie, sie kostet Spitze. Im Boost fällt sie weg; das ist die
    // Hälfte von „der Boost fühlt sich freier an" aus dem Vorbild.
    const turnCeil = boosting ? 1 : (1 - turnMag * P.turnDrag);
    if (input.idle) targetSpeed += (P.CRUISE * 0.4 - targetSpeed) * ex(0.7, dt);
    // Standdrehung hält das Tempo bei nahezu null — sonst beschreibt man einen Bogen.
    if (pivot) targetSpeed += (0 - targetSpeed) * ex(P.pivotHold, dt);
    const desired = (boosting && !br ? P.SPD_MAX : targetSpeed) * (targetSpeed > 0 ? turnCeil : 1);
    // Warp hebt die OBERGRENZE, nicht nur das Soll — sonst deckelt `targetSpeed` bei SPD_MAX.
    const wDesired = warp > 0.001 && desired > 0 ? Math.max(desired, P.SPD_MAX * (1 + P.warpGain * warp)) : desired;
    speed += (wDesired - speed) * ex(br ? 2 + P.brakeLag * br
      : (warp > 0.001 ? 2 + P.warpLag * warp : (boosting ? 4 : 2)), dt);
    // v14/S89b · Stillstand braucht eine Totzone — eine exponentielle Annäherung erreicht die
    // Null nie, und 0,08 u/s sind über 45 s drei Meter.
    const holding = hold > 0.9 && Math.abs(speed) < P.holdSnap && Math.abs(wDesired) < P.holdSnap;
    if (holding) { speed = 0; targetSpeed = 0; }
    braking = br;

    // ── Fahren: entlang der FAHRTRICHTUNG, nicht entlang des Facings ─────────
    if (!holding) pos.addScaledVector(vDir, speed * dt);
    pos.y = alt;

    // ── Lage: −Z = vorn, +Y = oben, + Lehnen + Nicken ───────────────────────
    _negF.copy(forward).negate();
    _m.makeBasis(right, up, _negF);
    quaternion.setFromRotationMatrix(_m);
    // **Der Rutsch lehnt mit** (tinyskies DRIFT_BANK_SCALE 0.55, Deckel π/5):
    // das ist das einzige Bild, an dem man einen Drift SIEHT, ohne eine Spur zu
    // zeichnen. Ohne Drift ist der Zuschlag exakt null — kein Sonderfall.
    const dBank = clamp(driftGap * P.driftBank, -P.driftBankMax, P.driftBankMax);
    quaternion.multiply(_q.setFromAxisAngle(_zAxis, bank + dBank));
    // Bremsen hebt die Nase — das ist die Körpersprache, an der man eine Bremse SIEHT.
    const pitchTarget = clamp((targetAlt - alt) * 0.06 + climbIn * 2.4, -0.42, 0.42)
      + braking * P.brakePitch + warp * P.warpPitch + (speed < -0.4 ? P.revPitch : 0);
    pitchTilt += (pitchTarget - pitchTilt) * ex(5, dt);
    quaternion.multiply(_q.setFromAxisAngle(_xAxis, -pitchTilt));
  }

  return {
    name: 'flight-controller', version: FC_VERSION, update,
    get state() {
      return {
        position: pos, quaternion, forward, right, up, vDir,
        speed, alt, bank, pitchTilt, boosting, climbIn, grounded, flying: !grounded,
        braking, sinkRate, landed, targetAlt,
        warp, warpOver: Math.max(0, speed / P.SPD_MAX - 1),   // 0 = im Rahmen, 1 = doppelt so schnell
        reverse: speed < -0.4,
        pivoting,
        // v15
        heading: head, vHeading: vHead, turnRate: turnCmd,
        drift: drifting,
        // 0..1 — voll bei 45° Rutschwinkel (tinyskies `driftIntensity`)
        driftAmt: Math.min(1, Math.abs(wrapPi(head - vHead)) / (Math.PI / 4)),
        hug: hugging,
      };
    },
    setCruise() { alt = targetAlt = P.CRUISE; speed = targetSpeed = P.CRUISE; },
    // v14/S10: Abheben braucht beides — auf der aktuellen Höhe EINSETZEN (kein Sprung nach oben)
    // und ein Steigziel darüber.
    setTargetAlt(v) { targetAlt = clamp(v, P.ALT_MIN, P.ALT_MAX); },
    climbTo(v) { targetAlt = Math.max(alt, Math.min(P.ALT_MAX, v)); touchT = 0; landed = false; },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    // alt/heading optional: von der Landung kommend setzt der Runner beides, damit die Karte
    // dort weiterfliegt, wo das Pet stand — und in die Richtung, in die es sah.
    reset(x, z, atAlt, heading) {
      const h = heading != null ? heading : Math.PI;
      pos.set(x || 0, 0, z || 0);
      setHead(h); vHead = h; vDir.copy(forward);
      turnCmd = 0; drifting = false; hugging = 0;
      alt = targetAlt = prevAlt = (atAlt != null ? Math.max(P.ALT_MIN, atAlt) : P.CRUISE);
      pos.y = alt;
      speed = targetSpeed = P.CRUISE;
      bank = pitchTilt = 0; sinkRate = 0; touchT = 0; landed = false;
    },
  };
}
