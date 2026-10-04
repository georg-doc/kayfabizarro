// ============================================================================
// autopilot.js — KFB Travel · Slice S22d · Auto-Pilot & Anflug
// ----------------------------------------------------------------------------
// Der Auto-Pilot ist KEIN zweiter Flug-Controller. Er ist eine Eingabequelle:
// er erzeugt genau dieselben vier Werte wie die Tastatur (`yawIn`, `climbIn`,
// `thrust`, `boost`) und schiebt sie in `flight.update()`. Damit bleibt
// `flight-controller.js` unangetastet (Briefing §8) — kein Teleport, kein
// zweiter Zustand, keine Bahn, die neben der Physik läuft.
//
// GEORGS KISS-VORGABE, und sie ist der ganze Trick:
// **Die Flugzeit wird am ENDE geregelt, nicht über die ganze Bahn.** Normal
// anfliegen und den Schluss boosten, statt die Kurve künstlich zu dehnen. Also
// pro Frame:
//     rest   = zielZeit − verstrichen
//     nötig  = distanz / rest
// Liegt `nötig` über dem aktuellen Reisetempo, geht Schub/Boost hoch — sonst
// nicht. Das Gefühl bleibt erhalten, die Ankunftszeit ist trotzdem ein Regler.
//
// **Die Höchstgeschwindigkeit ist eine physikalische Grenze.** Eine Zielzeit
// unter `distanz / SPD_MAX` ist nicht erfüllbar. Sie wird GEMELDET (`onWarn`)
// und auf die erreichbare Zeit angehoben — nicht stillschweigend verfehlt.
// Sonst debuggt man später eine Narrator-Stimme, die zu spät kommt, im
// falschen Modul (S28/S30 hängen an dieser Zahl).
//
//   const auto = createAutopilot({ THREE, flight });
//   auto.flyTo(card, { seconds: 6 });      // card = { mesh } | { position }
//   auto.routeTo([c1, c2, …], { seconds: 6 });
//   const input = auto.active ? auto.update(dt) : readInput(dt);
//   auto.arrived(card)                     // vom Runner beim Durchflug gemeldet
// ============================================================================

export function createAutopilot(opts = {}) {
  const THREE = opts.THREE;
  const flight = opts.flight;
  const P = Object.assign({
    seconds: 6,        // Wunsch-Anflugzeit (der Regler, an dem S28/S30 hängen)
    yawRate: 1.7,      // rad/s — bewusst unter der Handsteuerung: der Pilot lenkt weich
    yawGain: 1.9,      // 1/s — P-Regler auf den Kurswinkel
    climbGain: 2.0,    // 1/s — P-Regler auf das Höhenziel
    climbMax: 34,      // units/s Höhenänderung
    arrive: 7.0,       // units — so nah gilt „da", falls der Durchflug nicht auslöst
    // **Der Bremsweg kommt aus der Physik, nicht aus einer Konstante.** 34 u fest hieß: bei hohem
    // Tempo zu kurz (überschießen), bei niedrigem viel zu lang — man kroch die letzten Meter, der
    // Zoom kam zu spät, das Pet verschwand vor der Kamera (Georgs Befund). Bremsweg = v²/(2a).
    // **`brakeAccel` ist GEMESSEN, nicht aus den Reglern gerechnet:** aus über 900 Frames Anflug
    // ergibt sich eine wirksame Verzögerung von rund 12 u/s². Die Rechnung aus `decel · brakeGain`
    // lieferte 45 — damit begann die Bremse 12 u vor dem Ziel statt 24, und der Zoom hing hinterher.
    // Genau der Fehler, den man bekommt, wenn man Reglerwerte für Verhalten hält.
    brakeAccel: 12, brakeSafety: 1.3, brakeMin: 14,
    // Regler statt Bang-Bang: Schub ist proportional zum Tempo-Fehler über dieser Spanne.
    thrustBand: 6, thrustSlew: 3.2,
    // Boost mit Hysterese UND Mindestdauer — ein pro Frame neu entschiedener Boost lässt
    // Speedlines und Barrel-Roll flackern, weil beide am Boost hängen.
    boostOn: 1.16, boostOff: 1.02, boostMinT: 0.9,
    // **Ankommen heißt anhalten** (S42a): vor der Karte wird hart gebremst, bis das Pet steht.
    // Erst dann zoomt die Regie — der Schwung ist die Kurve, nicht ein Schwellwert.
    settleSpeed: 3.2, settleMaxT: 2.6, settleDist: 9, settleMinT: 0.45,
    // **Warp für lange Strecken** (S43): die Zonen liegen 250 u vom Startpunkt, ein Zonenwechsel
    // kann 500 u sein. Der Pilot warpt, solange die Strecke lang und der Kurs sauber ist — nie im
    // Bremsweg und nie, während er noch stark dreht (sonst fährt er die Kurve nach außen).
    warpFrom: 60, warpFull: 260, warpYaw: 0.6,
    // Abbremsen VOR der Karte: im letzten Stück kein Boost mehr und Schub zurück. Das ist
    // auch die Regie-Marke für den Zoom — der Runner zoomt, wenn `braking` gilt, nicht auf
    // eine Distanz hin (Georgs Befund: der Zoom setzte zu früh und zu hart ein).
    brakeDist: 34,
    dwell: 1.8,        // s Pause an der Karte, bevor die Route weiterfliegt
    // S76b · **Vollgas bis zum Bremspunkt** (Georg: „Beschleunigung max, dann abbremsen, keine langsamen
    // Fahrten dazwischen"). Vorher regelte der Pilot auf eine ZIELZEIT — „schaffe die Strecke in 9 s"
    // heißt bei kurzer Strecke gemütlich rollen, und das ist dramaturgisch genau falsch. Jetzt ist das
    // Soll immer die Höchstgeschwindigkeit, gebremst wird, wenn der Bremsweg es verlangt (`brakePath`,
    // dieselbe Rechnung wie die Handbremse). **Die Zielzeit ist damit ein ERGEBNIS, keine Vorgabe** —
    // und die Warnung „Zeit nicht erfüllbar" fällt weg, weil niemand mehr eine Zeit verspricht.
    fullThrottle: true,
    // S73 · Rechnet zurück: solange diese Funktion wahr sagt, rückt die Route NICHT vor (die Kamera
    // gehört gerade jemand anderem — Detailansicht). Ein Faktor wäre hier falsch: Eigentum ist ja/nein.
    holdWhile: null,
    // S32a-Nachtrag, gemessen: ankommen reicht nicht. Nach der Übergabe fliegt die Karte
    // stur weiter — 19 s nach der Ankunft war der Spieler 140 u weg und die Live-Demo aus.
    // Eine Lektion, die man bedienen soll, braucht also ein BLEIBEN: langsamer Kreis um die
    // Karte, bis der Nutzer selbst steuert. Kein Anhalten (die Karte fliegt, das ist Kanon),
    // sondern eine Warteschleife.
    // S83b · **Kein Kreisen ohne Auftrag.** Georgs Befund: nach einem einzelnen (manuellen) Anflug fuhr
    // der Pilot eine Warteschleife um die Karte — die Detailansicht wurde aus dem Bild gedreht, und die
    // Zeile sagte „kreist um …", obwohl niemand etwas beauftragt hatte. Eine Warteschleife ist nur auf
    // einer REISE sinnvoll (dort wartet sie auf die nächste Karte). Ohne Warteschlange gibt der Pilot ab.
    loiter: false,
    loiterRadius: 22,  // u — innerhalb der Zugriffsdistanz (focusDist 46), also bleibt live an
    loiterSolo: false, // Warteschleife auch nach einem EINZELNEN Anflug? Nein (Georg, 26.7.)
    loiterAdvance: 0.9, // rad Vorhalt auf dem Kreis: größer = engerer Kurs zur Karte
    handover: 0.45,    // s Übergabe: kein Schub, kein Boost, Steuerung läuft aus
    lead: 0.55,        // Vorhalt auf die Karten-Drift (Zero-G) in Sekunden
  }, opts.params || {});

  const api = { onArrive: null, onWarn: null, onRoute: null };
  const _t = new THREE.Vector3(), _prev = new THREE.Vector3(), _vel = new THREE.Vector3();
  let target = null, queue = [], mode = 'off';   // 'off' | 'fly' | 'dwell' | 'loiter' | 'hand'
  let loiterTarget = null;
  let elapsed = 0, want = P.seconds, dwellT = 0, handT = 0, warned = false;
  let lastDist = 0, lastNeed = 0, lastFeasible = true, hasPrev = false, braking = false;
  let thrustCmd = 0, boostOn = false, boostT = 0, settleT = 0, brakeCmd = 0, warpCmd = 0;

  // Bremsweg aus dem Fahrzeugmodell: das Soll fällt mit `decel·brakeGain`, das Ist folgt mit
  // `brakeLag`. Die effektive Verzögerung ist damit annähernd das Minimum der beiden Raten.
  function brakePath(v) {
    return Math.max(P.brakeMin, (v * v) / (2 * P.brakeAccel) * P.brakeSafety + P.arrive * 0.5);
  }

  // Ziel-Position: die Academy-Karte ist eine GRUPPE (Blatt + Live-Fenster), ihr Blatt sitzt
  // lokal auf (0,0,0) — `card.mesh.position` wäre dort also der Weltursprung. Gemessen: der
  // Pilot flog sauber und pünktlich zum Nullpunkt, 129 u neben der Karte. Deshalb zuerst der
  // Halter, dann das Mesh (Sky-Karten aus S22 haben keinen Halter), dann eine rohe Position.
  const posOf = (c) => (c && (c.holder ? c.holder.position : (c.mesh ? c.mesh.position : c.position))) || null;

  // Erreichbarkeit EINMAL beim Auftrag prüfen: unter distanz/vMax geht nichts.
  function feasibleSeconds(dist) {
    const vMax = flight.params.SPD_MAX;
    const floor = dist / Math.max(vMax, 1e-3);
    return { floor, ok: want >= floor * 1.02 };
  }

  function begin(card, o) {
    target = card; elapsed = 0; dwellT = 0; handT = 0; warned = false; hasPrev = false; braking = false;
    thrustCmd = 0; boostOn = false; boostT = 0; settleT = 0; brakeCmd = 0; warpCmd = 0;
    _vel.set(0, 0, 0);   // sonst rechnet der erste Frame mit dem Vorhalt des VORIGEN Auftrags
    want = (o && o.seconds != null) ? o.seconds : P.seconds;
    const p = posOf(card);
    const dist = p ? p.distanceTo(flight.state.position) : 0;
    lastDist = dist;
    const f = feasibleSeconds(dist);
    lastFeasible = f.ok;
    if (!f.ok) {
      // Meldung statt stillem Verfehlen — und die Zeit wird auf das Erreichbare gehoben.
      want = f.floor * 1.02;
      if (api.onWarn) api.onWarn({ reason: 'too-fast', asked: (o && o.seconds) || P.seconds, min: f.floor, dist });
    }
    mode = 'fly';
  }

  // Warteschleife: Kurs auf einen Punkt, der auf dem Kreis um die Karte VOR uns liegt.
  // Derselbe P-Regler wie beim Anflug, nur mit wanderndem Ziel — und Schub gegen die
  // Reisegeschwindigkeit, damit der Kreis nicht ausufert.
  function orbitInput(dt, p) {
    const st = flight.state;
    if (!p) return { yawIn: 0, climbIn: 0, thrust: 0, boost: false, idle: true };
    const dx = st.position.x - p.x, dz = st.position.z - p.z;
    const a = Math.atan2(dx, dz) + P.loiterAdvance;
    const tx = p.x + Math.sin(a) * P.loiterRadius, tz = p.z + Math.cos(a) * P.loiterRadius;
    const ddx = tx - st.position.x, ddz = tz - st.position.z;
    const cross = st.forward.z * ddx - st.forward.x * ddz;
    const dot = st.forward.x * ddx + st.forward.z * ddz;
    const ang = Math.atan2(cross, dot);
    const yawIn = Math.max(-P.yawRate, Math.min(P.yawRate, ang * P.yawGain)) * dt;
    const climbIn = Math.max(-P.climbMax, Math.min(P.climbMax, (p.y - st.targetAlt) * P.climbGain)) * dt;
    const cruise = flight.params.CRUISE;
    const thrust = st.speed > cruise * 0.9 ? -1 : (st.speed < cruise * 0.6 ? 1 : 0);
    return { yawIn, climbIn, thrust, boost: false, idle: false };
  }

  function update(dt) {
    const st = flight.state;
    if (mode === 'hand') {
      handT += dt;
      if (handT >= P.handover) { mode = 'off'; target = null; }
      return { yawIn: 0, climbIn: 0, thrust: 0, boost: false, idle: false };
    }
    if (mode === 'loiter') return orbitInput(dt, posOf(loiterTarget));
    // SETTLE: harte Bremse vor der Karte, Kurs weiter aufs Blatt. Kein Zeitplan mehr — hier gilt
    // nur noch Stillstand. Watchdog: nach `settleMaxT` gilt es als angekommen, egal was das Tempo
    // sagt (jeder Auftrag braucht einen Rückweg).
    if (mode === 'settle') {
      settleT += dt;
      const p2 = posOf(target); const st2 = flight.state;
      let yaw2 = 0;
      if (p2) {
        const dx2 = p2.x - st2.position.x, dz2 = p2.z - st2.position.z;
        const c2 = st2.forward.z * dx2 - st2.forward.x * dz2, d2 = st2.forward.x * dx2 + st2.forward.z * dz2;
        yaw2 = Math.max(-P.yawRate, Math.min(P.yawRate, Math.atan2(c2, d2) * P.yawGain)) * dt;
      }
      lastDist = p2 ? p2.distanceTo(st2.position) : lastDist;
      // Mindestdauer, damit der Beat LESBAR ist: das Pet soll sichtbar vor der Karte stehen,
      // nicht nur rechnerisch langsam sein. Sonst ist die Bremse eine Zahl, kein Moment.
      if ((st2.speed <= P.settleSpeed && settleT >= P.settleMinT) || settleT > P.settleMaxT) { finish(true); return { yawIn: yaw2, climbIn: 0, thrust: 0, boost: false, brake: 0.6, idle: false }; }
      return { yawIn: yaw2, climbIn: 0, thrust: 0, boost: false, brake: 1, idle: false };
    }
    if (mode === 'dwell') {
      // S73 · **Die Reise wartet, solange ein anderer die Kamera besitzt.** Georgs Befund: nach ein bis
      // zwei Karten zeigte das Bild eine andere Karte als die, an der die Reise war. Ursache war kein
      // Rechenfehler, sondern ZWEI EIGENTÜMER — die Detailansicht hielt die Kamera fest, während die
      // Route zur nächsten Karte weiterflog. Ein Halt ist hier richtig und nicht ein Abbruch: die
      // Reise ist nicht weg, sie steht.
      // Warten heißt STEHEN, nicht kreisen (S83b): solange ein anderer die Kamera besitzt, gibt der
      // Pilot eine neutrale Eingabe. Vorher lief hier `orbitInput` — die Karte drehte sich unter dem
      // Lesenden weg, und genau das sah Georg als „glitcht nach rechts weg".
      if (P.holdWhile && P.holdWhile()) { dwellT = P.dwell; return { yawIn: 0, climbIn: 0, thrust: 0, boost: false, brake: 0.4, idle: true }; }
      dwellT += dt;
      if (dwellT >= P.dwell) {
        const next = queue.shift();
        if (next) { begin(next, { seconds: want }); if (api.onRoute) api.onRoute(next, queue.length); }
        else if (P.loiter && loiterTarget && queue.length) mode = 'loiter';
        else { mode = 'hand'; handT = 0; }
      }
      return orbitInput(dt, posOf(loiterTarget));
    }
    if (mode !== 'fly' || !target) return null;

    const p = posOf(target);
    if (!p) { finish(false); return null; }
    elapsed += dt;

    // Vorhalt auf die Karten-Drift: die Karte schwebt in Zero-G, ein Kurs auf die
    // MOMENTAN-Position schleppt hinterher. Ein halbe Sekunde Vorhalt genügt.
    if (hasPrev) _vel.subVectors(p, _prev).multiplyScalar(1 / Math.max(dt, 1e-3));
    _prev.copy(p); hasPrev = true;
    _t.copy(p).addScaledVector(_vel, P.lead);

    const dx = _t.x - st.position.x, dz = _t.z - st.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz + (_t.y - st.position.y) * (_t.y - st.position.y));
    lastDist = dist;

    // --- Kurs: P-Regler auf den Winkel zwischen Blick und Ziel, begrenzt auf yawRate.
    const fw = st.forward;
    // Vorzeichen ist hier NICHT Geschmackssache: `flight` dreht `forward` um +Y, positives
    // yawIn geht also nach LINKS (dieselbe Richtung wie Taste A). Links von forward ist
    // up × forward — daraus folgt genau dieses Kreuzprodukt. Falsches Vorzeichen = der
    // Pilot fliegt vom Ziel weg (gemessen: 883 u Abstand nach 16 s statt Ankunft).
    const cross = fw.z * dx - fw.x * dz;          // > 0 = Ziel links
    const dot = fw.x * dx + fw.z * dz;
    const ang = Math.atan2(cross, dot);
    const rate = Math.max(-P.yawRate, Math.min(P.yawRate, ang * P.yawGain));
    const yawIn = rate * dt;

    // --- Höhe: targetAlt des Controllers wandert auf die Kartenhöhe zu (climbIn ist ein Delta)
    const dAlt = _t.y - st.targetAlt;
    const climbIn = Math.max(-P.climbMax, Math.min(P.climbMax, dAlt * P.climbGain)) * dt;

    // --- DAS HERZSTÜCK: rest → nötig → Schub. Nichts hiervon dehnt die Bahn.
    const rest = Math.max(0.12, want - elapsed);
    // Der Plan zielt auf das ANKUNFTSFENSTER, nicht auf den Kartenmittelpunkt — sonst
    // kommt der Anflug systematisch zu früh an (gemessen: 13,43 s bei 14 s Vorgabe, weil
    // die letzten 7 u nie geflogen werden). S28/S30 rechnen mit dieser Zahl.
    const need = Math.max(0, dist - P.arrive * 0.5) / rest;
    lastNeed = need;
    const vMax = flight.params.SPD_MAX;
    if (!P.fullThrottle && need > vMax * 1.02 && !warned && dist > P.arrive * 2) {
      warned = true; lastFeasible = false;
      if (api.onWarn) api.onWarn({ reason: 'lost-time', need, max: vMax, dist, rest });
    }
    // Im Bremsweg gewinnt das Ankommen über den Zeitplan: kein Boost mehr, Schub zurück.
    // Der Zeitplan ist damit nicht verletzt — 34 u sind bei Reisegeschwindigkeit gut drei
    // Sekunden, und in genau diesen Sekunden soll die Karte größer werden, nicht schneller.
    braking = dist < brakePath(st.speed);
    // Boost mit Hysterese und Mindestdauer statt Frame-für-Frame-Entscheidung.
    boostT = Math.max(0, boostT - dt);
    if (braking) { boostOn = false; boostT = 0; }
    else if (!boostOn && (P.fullThrottle || (need > st.speed * P.boostOn && need > flight.params.CRUISE))) { boostOn = true; boostT = P.boostMinT; }
    else if (boostOn && boostT <= 0 && need < st.speed * P.boostOff) boostOn = false;
    const boost = boostOn;
    // **Schub als Regler.** Proportional zum Tempo-Fehler, dazu ratenbegrenzt (`thrustSlew`) —
    // das ist der Unterschied zwischen „Hand hält W“ und einem Schalter, der pro Frame klappert.
    const err = (P.fullThrottle ? vMax : need) - st.speed;
    const want01 = Math.max(-1, Math.min(1, err / P.thrustBand));
    thrustCmd += Math.max(-P.thrustSlew * dt, Math.min(P.thrustSlew * dt, want01 - thrustCmd));
    // Vor der Karte: harte Bremse, so stark wie nötig — dieselbe Bremse wie die Hand mit X.
    const need0 = braking ? Math.max(0, Math.min(1, (brakePath(st.speed) - dist) / Math.max(6, brakePath(st.speed) * 0.6))) : 0;
    brakeCmd += (need0 - brakeCmd) * Math.min(1, dt * 6);
    const thrust = braking ? Math.min(thrustCmd, 0) : thrustCmd;
    // Warp als Faktor: wächst mit der Restdistanz, fällt mit dem Lenkeinschlag.
    const wDist = Math.max(0, Math.min(1, (dist - P.warpFrom) / Math.max(1, P.warpFull - P.warpFrom)));
    const wStraight = Math.max(0, 1 - Math.abs(rate) / Math.max(0.01, P.warpYaw));
    const warpWant = braking ? 0 : wDist * wStraight;
    warpCmd += (warpWant - warpCmd) * Math.min(1, dt * (warpWant > warpCmd ? 1.6 : 4));

    // Watchdog: ein Anflug, der nie ankommt, muss einen Rückweg haben. Passiert genau dann,
    // wenn sich das Ziel bewegt (die Leine hat die Karten mitgezogen — Laufband, gemessen bei
    // konstantem Abstand und ETA 0,0). Nach 2,5× Zielzeit + 3 s gibt der Pilot zurück, statt
    // stumm weiterzujagen.
    if (elapsed > want * 2.5 + 3) {
      if (api.onWarn) api.onWarn({ reason: 'escaped', dist, need, max: vMax, rest });
      finish(false);
      return { yawIn, climbIn, thrust: 0, boost: false, brake: 0, idle: false };
    }
    // **Ankommen ist ein Beat, kein Punkt:** in Reichweite wird nicht abgeschnitten, sondern
    // angehalten. Der Zustand `settle` bremst hart weiter, bis das Pet vor der Karte steht —
    // erst dann meldet der Pilot die Ankunft und die Kamera zoomt heran.
    if (dist < P.settleDist) { mode = 'settle'; settleT = 0; return { yawIn, climbIn, thrust: 0, boost: false, brake: 1, idle: false }; }
    return { yawIn, climbIn, thrust, boost, brake: brakeCmd, warp: warpCmd, idle: false };
  }

  // Ankunft: entweder der Durchflug meldet sie (Runner) oder der Abstand.
  // Danach ÜBERGABE, nicht Abbruch: `handover` Sekunden ohne Schub, dann gehört
  // die Steuerung wieder dem Nutzer. Die Kamera-Dämpfung im Runner ist ohnehin
  // asymmetrisch — reinziehen schnell, rausschieben langsam.
  function finish(ok) {
    const done = target;
    loiterTarget = target;
    if (queue.length) { mode = 'dwell'; dwellT = 0; }
    else if (P.loiter && target && P.loiterSolo) { mode = 'loiter'; }
    else { mode = 'hand'; handT = 0; }
    if (ok && api.onArrive && done) { try { api.onArrive(done, elapsed); } catch (e) {} }
    target = null;
  }

  return {
    name: 'autopilot',
    update,
    get active() { return mode === 'fly' || mode === 'dwell' || mode === 'loiter' || mode === 'hand' || mode === 'settle'; },
    get flying() { return mode === 'fly'; },
    get settling() { return mode === 'settle'; },
    get braking() { return (mode === 'fly' && braking) || mode === 'settle'; },
    // S56 · Was die Ankunfts-Regie lesen muss, um ihren Fortschritt zu bilden — beides ohne
    // Allokation, weil es im Frame-Pfad steht (`status` baut ein Objekt und gehört der Anzeige).
    get dist() { return lastDist; },
    get brakeStart() { return brakePath(flight.state.speed); },
    get warp() { return warpCmd; },
    get mode() { return mode; },
    get target() { return target || loiterTarget; },
    get queued() { return queue.length; },
    get eta() { return Math.max(0, want - elapsed); },
    get seconds() { return want; },
    get status() {
      return { mode, dist: lastDist, need: lastNeed, max: flight.params.SPD_MAX,
               feasible: lastFeasible, eta: Math.max(0, want - elapsed), queued: queue.length };
    },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    flyTo(card, o) { queue = []; begin(card, o); },
    routeTo(list, o) {
      if (!list || !list.length) return;
      queue = list.slice(1);
      begin(list[0], o);
      if (api.onRoute) api.onRoute(list[0], queue.length);
    },
    // Der Durchflug ist die schönere Ankunft als ein Abstands-Test: er passiert
    // genau in der Kartenebene. Der Runner meldet ihn hierher.
    arrived(card) { if (mode === 'fly' && target && (card === target || posOf(card) === posOf(target))) finish(true); },
    cancel() { queue = []; target = null; loiterTarget = null; mode = 'off'; },
    get onArrive() { return api.onArrive; }, set onArrive(f) { api.onArrive = f; },
    get onWarn() { return api.onWarn; }, set onWarn(f) { api.onWarn = f; },
    get onRoute() { return api.onRoute; }, set onRoute(f) { api.onRoute = f; },
  };
}
