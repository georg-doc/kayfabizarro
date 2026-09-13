// ============================================================================
// intro-flight.js — v12 · Die Startansicht, 1:1 nach Game.ts
// ----------------------------------------------------------------------------
// **Anlass (Georg, 3.9.):** *„animation / anflug besteht aus mehreren teilen, die ruckelig und
// unsauber zusammengebatselt wurden → erneut die Ermahnung, das TS original 1:1 nachzubauen statt
// sloppy neu zu basteln!"* Er hat recht, und die Diagnose steckt schon in seinem Wort „Teile".
//
// **Was hier bis 3.9. stand, und warum es ruckelte.** Die alte Fassung war ausdrücklich „NEUE
// ARBEIT, kein Port" und rechnete mit VIER Kurven auf drei verschiedenen Uhren:
//   1. die Bahn:        `e = (1−0,38)·easeQuint(u) + 0,38·u`
//   2. der Kreuzblend:  `k = smoothstep((u − 0,60) / 0,40)` gegen die Rig-Pose
//   3. das Blickziel:   `smoothstep((u − 0,18) / 0,72)`
//   4. die Eigendrehung: `spin · t · (1 − e)`
// Jede für sich plausibel. Zusammen hat die Kamera an drei Stellen ihre Beschleunigung gewechselt
// — bei 0,18 (das Ziel setzt sich in Bewegung), bei 0,60 (der Blend setzt ein) und am Ende, wo
// Bahn und Rig-Pose unterschiedlich schnell ankamen. **Genau das liest man als „mehrere Teile".**
// Und der Kreuzblend war die teuerste Zeile: er mischt zwei POSEN, statt EINE Bahn auf der
// Zielpose enden zu lassen. Zwei Posen mit eigenen Kurven treffen sich nie exakt; es bleibt ein
// Rest, und der Rest ist der Ruck.
//
// **Wie die Quelle es macht** (`Game.ts` 2933–3110, gelesen 3.9., Tree 2659a5cc987d):
//
//   INTRO_DURATION = 5.2                       // eine Dauer
//   raw = min(introTimer / 5.2, 1)
//   t   = raw*raw*(3 − 2*raw)                  // EINE Kurve — für alles, was folgt
//
//   computeIntroEndTargets()                   // die LIVE-Zielpose, jedes Bild neu
//   rawBlend = max(0, t − 0.85) / 0.15         // Live-Ziel erst im letzten Sechstel
//   wEnd     = rawBlend²(3 − 2·rawBlend)
//   blendedEnd  = frozenEndPos .lerp(endPos,  wEnd)
//   blendedLook = frozenEndLook.lerp(endLook, wEnd)
//
//   dir  = slerp(startPos.unit, blendedEnd.unit, t)     // GROSSKREIS, nicht lerp+normalize
//   dist = startDist + (endDist − startDist) · t
//   pos  = dir · dist
//   lookAt = blendedLook · t                   // Blick wandert vom Kugelmittelpunkt zum Ziel
//   up   = worldUp(0,1,0).lerp(pos.unit, t).normalize()
//   roll = sin²(π·t) · 0.12                    // Ableitung 0 an beiden Enden
//
// Drei Dinge daran sind der ganze Unterschied, und alle drei hatten wir nicht:
//  · **Eine Kurve.** `t` treibt Bahn, Distanz, Blick, Up UND Roll. Es gibt keine Naht, weil es
//    keine zweite Uhr gibt.
//  · **Kein Posen-Kreuzblend.** Die Bahn ENDET auf der Verfolgerpose (dieselbe Formel wie der Rig:
//    `pos − fwd·folgeAbstand + up·folgeHöhe`). Deshalb ist das letzte Intro-Bild bitgleich mit dem
//    ersten Flugbild. Die Live-Pose wird nur im letzten Sechstel eingeblendet, damit die Bahn
//    stabil bleibt und der letzte Frame trotzdem stimmt — die Quelle nennt den Grund im Kommentar
//    („avoids a late corkscrew + a discontinuous first chase frame").
//  · **Großkreis statt lerp.** `slerpUnitVectors` hält die Winkelgeschwindigkeit konstant;
//    `lerp+normalize` ist in der Mitte schneller als an den Enden — ein Schwung, den niemand
//    programmiert hat und den man als Unruhe sieht.
//
// **Zwei erklärte Abweichungen**, beide weil uns ein Stück der Quelle fehlt:
//  · **Der Startpunkt.** Bei TS ist er `previewCamera.position` — die Lobby dreht den Globus vor
//    dem Start auf einer Bahn mit Radius 12 (Desktop) und Neigung −0,26 rad (`stepPreview`), und
//    das Intro übernimmt einfach, wo sie gerade steht. Wir haben keine Lobby. Also bauen wir
//    denselben Punkt (Radius 2,4·R = 12 bei R = 5, gleiche Neigung) und WÄHLEN den Bahnwinkel,
//    statt ihn zu erben: um `anflugBogen` vor dem Spieler, damit der Großkreis nicht zufällig
//    einmal um den Planeten läuft.
//  · **Der Abbruch.** Die Quelle hat keinen (dort bricht man das Intro nicht ab). Georg hat einen
//    bestellt (28.8.). Er ist deshalb KEIN zweiter Bewegungspfad, sondern nur eine schnellere Uhr:
//    die verbleibende Zeit wird auf `skipDauer` gestaucht, dieselbe Kurve läuft zu Ende. Ein
//    Abbruch, der eine eigene Blende hätte, wäre wieder ein zweites Teil.
//
// **Dritte Abweichung, 3.9. — das STANDBILD vor dem Anflug.** Georg: *„intro ruckelt noch"*, nachdem
// die Kurven-Nähte weg waren. Die Ursache liegt nicht mehr in der Mathematik, sondern im
// Terminplan: die 5,2 s des Anflugs sind das EINZIGE Fenster der Sitzung, in dem die Kamera schnell
// fährt — und genau in dieses Fenster fällt alles, was asynchron ankommt (Pet-GLB parsen,
// Pet-Oberfläche rechnen, `renderer.compile`). Jeder dieser Blöcke hält den Hauptfaden für Dutzende
// Millisekunden an. Im Stand sieht das niemand; während eines Schwenks ist es ein Ruck.
// *Ein Ruckeln ist selten ein Kostenproblem und meistens ein Reihenfolgeproblem: bewege die Kamera
// nie, während der Hauptfaden beschäftigt ist.* Also hält das Intro auf seinem ERSTEN Bild — der
// Lobby-Bahn weit draußen, ein schönes Standbild — bis `warteAuf(pred, max)` grün meldet oder die
// Obergrenze fällt. Erst dann läuft `t`. Das ist keine vierte Kurve: `dt` ist während des Halts
// null, es rechnet dieselbe Formel mit demselben `t = 0`.
//
//   const intro = createIntroFlight({ THREE, globeRadius: 5 });
//   intro.begin(frame, avatarPos, camera);                 // NACH dem ersten rig.snapTo
//   const fertig = intro.update(dt, camera, avatarPos);    // NACH rig.snapTo je Bild
//   intro.skip();
// ============================================================================

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t) => t * t * (3 - 2 * t);

/** Großkreis-Interpolation zwischen zwei Einheitsrichtungen — wörtlich `slerpUnitVectors`
 *  (Game.ts 2989). Der Kommentar der Quelle nennt den Grund: „stable turn rate vs lerp+normalize". */
/** ⚠ **Diese Funktion darf NICHT mit `out === b` aufgerufen werden — teuer gelernt am 3.9.**
 *  Erste Fassung des Aufrufers gab denselben Arbeitsvektor als Ziel UND als Ausgang. `out.copy(a)`
 *  löscht damit `b`, bevor `addScaledVector(b, w1)` es liest. Folgen, beide im Bild sichtbar:
 *  die Bahn blieb auf der Startrichtung stehen (der Anflug kam von der falschen Seite des
 *  Planeten), und im letzten Bild mit `w0 = 0` wurde die Kameraposition **exakt (0,0,0)** — ein
 *  Bild im Kugelmittelpunkt, und genau das ist der Ruck an der Übergabe.
 *  **Ein Arbeitsvektor, der gleichzeitig Eingang und Ausgang ist, ist kein Sparen, sondern ein
 *  stiller Schreiber** (dieselbe Fehlerklasse wie zwei Schreiber auf einem Winkel). Der Wachhund
 *  unten macht den Missbrauch laut, statt ihn zu erlauben. */
function slerpEinheit(THREE, a, b, t, out) {
  if (out === b || out === a) throw new Error('slerpEinheit: out darf nicht a oder b sein');
  const dot = Math.max(-1, Math.min(1, a.dot(b)));
  const theta = Math.acos(dot);
  if (theta < 1e-4) return out.copy(a).lerp(b, t).normalize();
  const sinT = Math.sin(theta);
  const w0 = Math.sin((1 - t) * theta) / sinT;
  const w1 = Math.sin(t * theta) / sinT;
  return out.copy(a).multiplyScalar(w0).addScaledVector(b, w1).normalize();
}

export function createIntroFlight(opts = {}) {
  const THREE = opts.THREE;
  const R = opts.globeRadius != null ? opts.globeRadius : 5;
  const P = Object.assign({
    dur: 5.2,             // Game.INTRO_DURATION
    liveBlendAb: 0.85,    // Game.INTRO_LIVE_END_BLEND_START
    rollAmp: 0.12,        // Game.ts 3109 · rollZ = sin²(πt) · 0.12
    // Lobby-Bahn der Quelle (`stepPreview`): Radius 12 bei Globusradius 5, Neigung −0,26 rad.
    startDist: 2.4,       // × R  → 12
    startNeigung: -0.26,
    // Unsere Wahl statt des geerbten Lobby-Winkels (siehe Kopf): so weit VOR dem Spieler beginnt
    // die Bahn. 1,9 rad ergibt einen Anflug über gut ein Drittel des Planeten — man sieht die
    // Kugel drehen und kommt trotzdem an, ohne einmal außen herum.
    anflugBogen: 1.9,
    skipDauer: 0.35,      // Sekunden, in die ein Abbruch den REST derselben Kurve staucht
    blick: 0.5,           // lookAt = Spieler + Fahrtrichtung · 0,5 (Game.ts 2977)
  }, opts.params || {});

  let t = 0, laufend = false, fertig = false, gestaucht = false, skipRest = 0;
  // Standbild vor dem Anflug (siehe Kopf): Prädikat + Obergrenze in Sekunden.
  let haltPred = null, haltMax = 0, haltT = 0, haltGelaufen = 0;
  const _start = new THREE.Vector3();
  const _frozenEnd = new THREE.Vector3(), _frozenLook = new THREE.Vector3();
  const _end = new THREE.Vector3(), _look = new THREE.Vector3();
  const _bEnd = new THREE.Vector3(), _bLook = new THREE.Vector3();
  const _dir = new THREE.Vector3(), _pos = new THREE.Vector3(), _u = new THREE.Vector3();
  const _a = new THREE.Vector3(), _b = new THREE.Vector3();   // getrennte Ein-/Ausgänge, siehe slerpEinheit
  const _up = new THREE.Vector3(), _fwd = new THREE.Vector3(), _m = new THREE.Matrix4();
  const WELT_UP = new THREE.Vector3(0, 1, 0);

  /** Die LIVE-Zielpose: wo die Verfolgerkamera JETZT steht. Der Runner hat `rig.snapTo` vor
   *  diesem Aufruf ausgeführt — genau wie in der Quelle, wo `computeIntroEndTargets` mit
   *  denselben `cameraFollowDistance/Height` rechnet, die auch der Rig benutzt. Damit ist das
   *  letzte Intro-Bild das erste Flugbild, und nicht etwas, das ihm ähnlich sieht. */
  function zielLesen(camera, avatarPos) {
    _end.copy(camera.position);
    camera.getWorldDirection(_fwd);
    _look.copy(avatarPos).addScaledVector(_fwd, P.blick);
  }

  function begin(frame, avatarPos, camera) {
    t = 0; laufend = true; fertig = false; gestaucht = false; skipRest = 0;
    haltT = 0; haltGelaufen = 0;
    if (camera) { zielLesen(camera, avatarPos); }
    else { _end.copy(avatarPos).multiplyScalar(1.2); _look.copy(avatarPos); }
    _frozenEnd.copy(_end); _frozenLook.copy(_look);
    // Der Startpunkt auf der Lobby-Bahn (siehe Kopf: nachgebaut, Winkel gewählt statt geerbt).
    const n = avatarPos.clone().normalize();
    _u.copy(n).applyAxisAngle(WELT_UP, P.anflugBogen);
    const d = R * P.startDist;
    const tiltY = Math.sin(P.startNeigung) * d, tiltXZ = Math.cos(P.startNeigung) * d;
    const eben = new THREE.Vector3(_u.x, 0, _u.z);
    if (eben.lengthSq() < 1e-6) eben.set(1, 0, 0);
    eben.normalize();
    _start.set(eben.x * tiltXZ, tiltY, eben.z * tiltXZ);
    return true;
  }

  function skip() {
    if (!laufend) return false;
    // Ein Tastendruck im Standbild löst erst den Halt — der Anflug soll dann ganz zu sehen sein.
    if (haelt()) { haltPred = null; return true; }
    if (gestaucht) return false;
    gestaucht = true;
    skipRest = Math.max(1e-3, P.dur - t);
    return true;
  }

  /** Das Standbild: hält `t` auf 0, solange `pred()` falsch ist — höchstens `maxSekunden`. */
  function warteAuf(pred, maxSekunden) {
    haltPred = typeof pred === 'function' ? pred : null;
    haltMax = maxSekunden != null ? maxSekunden : 2.2;
    haltT = 0;
    return true;
  }
  function haelt() { return !!(laufend && haltPred && haltT < haltMax && !haltPred()); }

  /** @returns true, sobald die Kamera an das Rig übergeben ist (dann nie wieder aufrufen). */
  function update(dt, camera, avatarPos) {
    if (!laufend) return true;
    // Das Standbild ist kein zweiter Pfad, sondern `dt = 0`: dieselbe Formel, dasselbe `t`.
    if (haltPred) {
      if (haelt()) { haltT += dt; haltGelaufen = haltT; dt = 0; }
      else { haltPred = null; }
    }
    // Der Abbruch ist eine schnellere UHR, kein zweiter Pfad: dieselbe Kurve, nur gestaucht.
    t += gestaucht ? dt * (skipRest / P.skipDauer) : dt;

    const raw = Math.min(t / P.dur, 1);
    const tt = smooth(raw);                        // EINE Kurve für alles, was folgt

    zielLesen(camera, avatarPos);
    const rawBlend = Math.max(0, tt - P.liveBlendAb) / (1 - P.liveBlendAb);
    const wEnd = smooth(clamp01(rawBlend));
    _bEnd.copy(_frozenEnd).lerp(_end, wEnd);
    _bLook.copy(_frozenLook).lerp(_look, wEnd);

    const startDist = _start.length(), endDist = _bEnd.length();
    _a.copy(_start).normalize();
    _b.copy(_bEnd).normalize();
    slerpEinheit(THREE, _a, _b, tt, _dir);
    _pos.copy(_dir).multiplyScalar(startDist + (endDist - startDist) * tt);

    // Blickziel skaliert vom Kugelmittelpunkt zum Ziel — wörtlich `blendedLook · t`.
    _look.copy(_bLook).multiplyScalar(tt);
    _up.copy(WELT_UP).lerp(_u.copy(_pos).normalize(), tt).normalize();

    _m.lookAt(_pos, _look, _up);
    camera.position.copy(_pos);
    camera.quaternion.setFromRotationMatrix(_m);
    camera.up.copy(_up);
    // sin²(πt): Ableitung null an beiden Enden — der Roll dreht sich nicht in den Schnitt hinein.
    const sRoll = Math.sin(tt * Math.PI);
    if (P.rollAmp) camera.rotateZ(sRoll * sRoll * P.rollAmp);

    if (raw >= 1) { laufend = false; fertig = true; return true; }
    return false;
  }

  return {
    name: 'intro-flight', params: P, begin, update, skip, warteAuf,
    get active() { return laufend; },
    get done() { return fertig; },
    get t() { return t; },
    get haelt() { return haelt(); },
    get haltSekunden() { return haltGelaufen; },
    get rest() { return Math.max(0, P.dur - t); },
    get phase() {
      if (!laufend) return fertig ? 'aus' : 'wartet';
      if (haelt()) return 'standbild';
      if (gestaucht) return 'abbruch';
      return smooth(clamp01(t / P.dur)) < P.liveBlendAb ? 'anflug' : 'übergabe';
    },
    /** Für das Tor: was die Quelle vorgibt und was wir daraus gemacht haben. */
    tor() {
      const ok = P.dur === 5.2 && P.liveBlendAb === 0.85 && P.rollAmp === 0.12;
      return { ok, text: (ok ? '✓' : '⚠') + ' intro 1:1 from Game.ts 2933–3110: ONE smoothstep curve drives path, '
        + 'distance, look-at, up and roll · great-circle slerp (not lerp+normalize) · the path ENDS on the chase pose, '
        + 'so there is no cross-fade between two poses and the last intro frame is the first flight frame · '
        + 'live end target eased in over the last ' + Math.round((1 - P.liveBlendAb) * 100) + ' % · roll sin²(πt)·'
        + P.rollAmp + ' · duration ' + P.dur + ' s'
        + ' · declared deviations: start point rebuilt from stepPreview (r ' + P.startDist + '·R, tilt '
        + P.startNeigung + ') because we have no lobby, the skip compresses the SAME curve instead of adding a second path, '
        + 'and the approach holds on its first frame (still image, dt = 0) until the async load has landed — max '
        + haltMax.toFixed(1) + ' s, used ' + haltGelaufen.toFixed(1) + ' s: never move the camera while the main thread is busy' };
    },
  };
}
