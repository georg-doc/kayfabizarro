// ============================================================================
// carpet.js — Flugphysik des Teppichs, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/Carpet.ts (gelesen 27.8.2026).
// Alle Konstanten unverändert übernommen — sie sind das Fahrgefühl, und wer daran dreht, ohne zu
// messen, verliert es. Weggelassen ist nur, was in KFB keinen Ort hat: Void-Plane, Upgrades,
// Diamant-Boost-Fassrolle, Quasten und Capybara-Wobble (die Karte hat ihre eigene Welle).
//
// **Warum das Modell hier gewinnt und der v17-Controller nicht:** unser `flight-controller.js`
// klemmt eine ABSOLUTE Höhe (`ALT_MAX`) und drückt mit einer Kufe gegen den Boden. Auf einem
// Gelände mit gewürfelter Amplitude stand diese Klemme dauernd an — daraus wurden drei Runden
// „controls sluggish". Hier ist die Höhe RELATIV zur Oberfläche (`surfaceAlt + clearance`), es gibt
// keine absolute Grenze, und der Klippen-Gleitbonus fängt genau den Fall ab, in dem der Boden
// wegbricht.
//
// Georgs Ansage 27.8.: „flug und schuss-controls übernehmen wir auch mit flug-physik."
// ============================================================================

import { initSphericalMath, moveOnSphere, tangentFrame, buildPlaneMatrix, rayFromState,
         randomSpawnQuaternionAndHeading, cartesianFromSpherical } from './spherical-math.js';
import { surfaceAltitudeAt } from './terrain-surface.js';
import { isLand } from './globe-field.js';

/* ══ Konstanten 1:1 aus Carpet.ts ═════════════════════════════════════════ */
/* Slice D · v5 · die Zahlen liegen jetzt in einer Tabelle, nicht in einem const-Block.
 *
 * Vorher waren sie von außen unerreichbar — jeder Wunsch nach „ein bisschen träger" war ein
 * Codeeingriff.
 *
 * ⚠ **Und der Block war nicht vollständig, obwohl er vollständig aussah.** Sechs Tuning-Zahlen
 * lagen als nackte Literale mitten in `update()`: das Ausrollen ohne Eingabe (`0.3 * dt`), der
 * Anteil der Lenkung an der Schräglage (`* 0.5`), die Ausstiegsschwelle aus dem Drift (`< 0.08`),
 * der Tempo-Sockel des Gleitbonus (`0.35 + 0.65·`), die Steigrate-Verstärkung (`altDelta * 1.5`)
 * und die Nick-Glättung (`4.0 * dt`). **Ein Konstantenblock, der sechs Werte nicht enthält, ist
 * schlimmer als keiner: er behält Recht, solange niemand sucht.**
 *
 * **`CARPET_QUELLE` ist eingefroren und ist der Beweis, dass Slice D nichts verändert hat:**
 * `report().abweichungen` zählt jeden Wert, der von tinyskies abweicht. 0 heißt quellentreu —
 * und DAS ist die Abnahme dieses Slice, keine Behauptung.
 */
export const CARPET_QUELLE = Object.freeze({
  brakeDecel: 2.5,
  accel: 1.8,
  // 27.8.: kurz auf 0,14 halbiert (Georg wollte langsamer andocken) — das war ZU langsam, gefühlt
  // Stillstand. Zurück auf den Quellwert. Das Andocken lösen wir über die Bremse (S) und die
  // Kamera, nicht über das Grundtempo: 0,28 ist die Zahl, auf die Drift, Traktion und Schräglage
  // abgestimmt sind (`driftMinSpeed` 0,52 wird relativ dazu gerechnet).
  minSpeed: 0.28,
  maxSpeed: 0.78,
  absMaxSpeed: 1.45,
  coastDecel: 0.3,             // war ein nacktes Literal: Ausrollen ohne Eingabe
  maxBank: Math.PI / 4,
  bankResp: 4,
  turnSmooth: 8,
  turnMult: 1.45,
  turnBankShare: 0.5,          // war ein nacktes Literal: Anteil der Lenkung an der Schräglage
  elevateSmooth: 6,
  // Drift
  driftMinSpeed: 0.52,
  driftTurnThreshold: 0.62,
  driftExitTurn: 0.08,         // war ein nacktes Literal: darunter endet der Drift
  tractionNormal: 5.0,
  tractionDrift: 1.4,
  tractionBraking: 8.0,
  driftBankScale: 0.55,
  driftBankMax: Math.PI / 5,
  // Höhe
  // ── v12 · Schwebemodus (Georg, 3.9.: „um terrain zu betrachten und karten zu lesen") ──────
  // Die Quelle kennt ihn nicht — sie hat keinen Grund dafür, wir schon: unsere Welt trägt 56
  // Karten, die man LESEN soll. Deshalb eine deklarierte Erweiterung, keine stille Änderung:
  // Schweben setzt das Tempo-Ziel auf 0 (Sockel aus) und gibt Pfeil hoch/runter die Höhe frei.
  schwebeRate: 0.55,           // Weltmaß je Sekunde, mit dem Pfeil hoch/runter steigt und sinkt
  schwebeMax: 1.20,            // wie weit über die normale Reiseflughöhe man steigen kann
  schwebeBremse: 1.10,         // Verzögerung auf 0 im Schweben — spürbar schneller als coastDecel
  // ⚠ **Im Schweben wird die Höhe DIREKT geschrieben — in zwei Schritten hierher gelernt.**
  // (1) Erste Fassung ließ den Versatz nur das ZIEL verschieben und die Höhe mit altRiseLerp/
  //     altFallLerp (0,75 / 0,38 je Sekunde) hinterherlaufen. Gemessen bei gehaltener
  //     Pfeil-runter: der Teppich STIEG noch eine Sekunde weiter (0,826 → 0,834), weil das Ziel
  //     zwar sank, aber immer noch über ihm lag. Diese beiden Zahlen sind dafür da, dass der
  //     Teppich nicht springt, wenn der BODEN sich ändert — **auf eine Spielereingabe angewandt
  //     sind sie der falsche Leser.**
  // (2) Eine eigene, symmetrische Glättung (8/s) hat das Steigen beendet, aber nicht die Ursache:
  //     JEDE Glättung hält im Steigflug einen Nachlauf von Rate/Lerp = 0,069 u, und beim Umkehren
  //     wird der noch abgebaut — gemessen +6,5 mm im ersten Bild nach dem Tastenwechsel.
  // Also die Frage stellen statt die Zahl drehen: **was soll hier eigentlich geglättet werden?**
  // Nichts. Der Versatz rampt bereits mit 0,55 u/s — DAS ist die Bewegung. Eine Glättung darüber
  // ist eine zweite, die nur nachläuft. Im Schweben gilt: Höhe = Boden + Sockel + Versatz, fertig.
  // Beim EINSCHALTEN wird der Versatz aus der aktuellen Höhe gerückgerechnet (siehe setSchwebe),
  // damit nichts springt — und damit tut der Modus genau, was bestellt war: in der AKTUELLEN Höhe
  // stehenbleiben.
  hoverHeight: 0.03,
  boostHeight: 0.52,
  altRiseLerp: 0.75,
  altFallLerp: 0.38,
  cliffGain: 0.7,
  cliffMax: 0.12,
  cliffDecay: 3.2,
  cliffSpeedFloor: 0.35,       // war ein nacktes Literal im Gleitbonus (0,35 + 0,65·Tempo)
  climbPitchMax: Math.PI / 5,
  climbRateGain: 1.5,          // war ein nacktes Literal: Steigrate → Nickwinkel
  pitchSmooth: 4.0,            // war ein nacktes Literal
});

/** Schwebehöhe über Grund — bleibt als Export, weil andere Module sie als MASS benutzen. */
export const CARPET_HOVER_HEIGHT = CARPET_QUELLE.hoverHeight;

/** Reisetempo der Quelle — der Wert, auf den der Flugstart hochrollt. */
export const CARPET_CRUISE_SPEED = CARPET_QUELLE.minSpeed;

export function createCarpet(o) {
  const THREE = o.THREE;
  initSphericalMath(THREE);
  const globeRadius = o.globeRadius, seed = o.seed, terrainType = o.terrainType;
  /** Die Parameter dieses Fluges. Standard = Quelle, also ändert Slice D nichts. */
  const P = Object.assign({}, CARPET_QUELLE, o.params || {});

  const spawn = randomSpawnQuaternionAndHeading(seed + (o.spawnSalt || 0));
  const S = {
    qPosition: spawn.qPosition.clone(),
    heading: spawn.heading,
    velocityHeading: spawn.heading,
    pitch: 0, bankAngle: 0, speed: P.minSpeed,
    altitude: 0, drifting: false, isOverWater: false,
  };
  let turnInputSmoothed = 0, elevateBlend = 0, cliffGlideBonus = 0;
  let schwebe = false, schwebeVersatz = 0;
  // ── v3 · Die EINZIGE Änderung an dieser 1:1-Portierung ────────────────────
  // Georg (29.8.): „Tempo 0, rollt selbst auf Reisetempo an". P.minSpeed 0,28 ist in der Quelle
  // eine harte Untergrenze — der Teppich kann gar nicht stehen, und ein Start aus dem Stand wäre
  // damit unmöglich. Statt die Konstante zu verbiegen (sie ist die Bezugsgröße für Drift,
  // Traktion und Schräglage) bekommt sie einen **beweglichen Boden**: `speedFloor` ist im
  // Normalbetrieb GENAU P.minSpeed, und nur der Flugstart in `globe-poc.js` fährt ihn von 0
  // hoch. Damit bleibt es EIN Schreiber auf `S.speed` — das Anrollen ist der steigende Boden,
  // kein zweiter Antrieb (Fehlerklasse 1).
  let speedFloor = P.minSpeed;
  let prevAltitude = 0, prevSurfaceAltitude = 0;

  {
    const up = tangentFrame(S.qPosition).up;
    const surfaceAlt = surfaceAltitudeAt(seed, terrainType, up.x, up.y, up.z);
    S.altitude = surfaceAlt + P.hoverHeight;
    prevAltitude = S.altitude;
    prevSurfaceAltitude = surfaceAlt;
  }

  const wrap2pi = (a) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const wrapPi = (a) => (((a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;

  function update(dt, turnRate, forward, brake, elevate, descend) {
    // ── Tempo ───────────────────────────────────────────────────────────────
    // ⚠ Im Schweben gilt der Tempo-SOCKEL nicht. Er ist die Zeile, die „Teppich" bedeutet (der
    // fliegt, er parkt nicht) — und genau deshalb muss ein Modus, der HALTEN soll, ihn AUSSETZEN
    // und nicht unterlaufen. Ein Sockel, den man heimlich auf 0 schreibt, ist beim Verlassen des
    // Modus verschwunden; einer, der ausgesetzt wird, steht danach wieder da, wo er stand.
    // ⚠ **Der Tempo-Sockel ist ein ZIEL, kein Riegel — und das ist die Reparatur von „abbremsen
    // geht nicht" (Georg, 3.9.), im zweiten Anlauf.**
    // Erster Anlauf war ein Nulltausch (siehe globe-poc.js): ich habe die Anroll-Rampe
    // beschuldigt, obwohl `CARPET_CRUISE_SPEED === minSpeed` ist. Gemessen, vorher wie nachher:
    //   ausrollen  0,631 → 0,482 → 0,334 → 0,280 → 0,280
    //   bremsen    0,280 → 0,280 → 0,280 → 0,280 → 0,280
    // Beide landen auf derselben 0,28; `S` kommt nur schneller dort an. **Die Bremse war nie
    // kaputt — es gab keinen Zustand, in dem der Teppich langsamer sein DURFTE.**
    // `minSpeed` ist quellentreu und richtig: ein fliegender Teppich parkt nicht von selbst. Aber
    // „nicht von selbst" ist etwas anderes als „auf Wunsch auch nicht". Also derselbe Mechanismus,
    // den das Schweben schon benutzt: **eine gehaltene Taste SETZT DEN SOCKEL AUS**, statt ihn zu
    // überschreiben.
    //
    // ⚠ **Und der Sockel kommt danach NICHT zurück — das ist ein Riegel, kein Schalter.**
    // Georgs zwei Sätze vom 3.9. lesen sich zuerst wie ein Widerspruch: „zu Beginn startet man wie
    // bei TS mit Reiseflug-Geschwindigkeit" und „specd sollte nicht automatisch wieder schneller
    // werden; man floatet, bis Beschleunigung via input". Sie beschreiben ein VORHER und ein
    // NACHHER. Vorher: der Sockel trägt (Auftakt, Quellverhalten, `minSpeed` ist quellentreu).
    // Nachher — ab dem ersten Bremsbefehl — gehört das Tempo dem Spieler, und ein Sockel, der
    // danach wieder hochzieht, wäre ein zweiter Gasgeber, den niemand gedrückt hat.
    // Der Riegel fällt einmal und bleibt: `setSpeedFloor` von außen kann ihn wieder setzen
    // (Neustart, Portal), eine Taste nicht.
    if (brake && speedFloor > 0) speedFloor = 0;
    const frei = schwebe || brake;
    const sockel = frei ? 0 : speedFloor;
    if (schwebe) S.speed = Math.max(0, S.speed - P.schwebeBremse * dt);
    else if (brake) S.speed = Math.max(0, S.speed - P.brakeDecel * dt);
    else if (forward) S.speed = Math.min(P.maxSpeed, S.speed + P.accel * dt);
    // Der Sockel zieht nur während der Anroll-RAMPE hoch (globe-poc setzt ihn danach auf 0).
    // Ohne diese Zeile würde der Start nicht anrollen; mit ihr UND einem stehenden Sockel hätte
    // die Welt einen zweiten Gasgeber, den niemand gedrückt hat.
    else if (S.speed < sockel) S.speed = Math.min(sockel, S.speed + P.accel * dt);
    else S.speed = Math.max(sockel, S.speed - P.coastDecel * dt);

    // ── Lenkung: die Eingabe wird geglättet, nicht die Lage ────────────────
    const turnTarget = turnRate * P.turnMult;
    turnInputSmoothed += (turnTarget - turnInputSmoothed) * (1 - Math.exp(-P.turnSmooth * dt));
    S.heading = wrap2pi(S.heading + turnInputSmoothed * dt);

    // ── Drift: Fahrtrichtung ≠ Blickrichtung ───────────────────────────────
    // Das ist die Zeile, die den Teppich zum Teppich macht: bei scharfer Lenkung reißt die
    // Traktion ab, die Fahrtrichtung hinkt nach, und daraus entsteht die Schräglage.
    const speedFrac = S.speed / P.maxSpeed;
    const sharpTurn = Math.abs(turnInputSmoothed) > P.driftTurnThreshold
                      && speedFrac > P.driftMinSpeed / P.maxSpeed;
    if (sharpTurn && !brake) S.drifting = true;
    else if (speedFrac <= P.driftMinSpeed / P.maxSpeed || Math.abs(turnInputSmoothed) < P.driftExitTurn) S.drifting = false;
    const traction = brake ? P.tractionBraking : (S.drifting ? P.tractionDrift : P.tractionNormal);
    S.velocityHeading = wrap2pi(S.velocityHeading + wrapPi(S.heading - S.velocityHeading) * Math.min(1, traction * dt));

    // ── Bewegung auf dem Großkreis ─────────────────────────────────────────
    const arcAngle = (S.speed * dt) / globeRadius;
    S.qPosition = moveOnSphere(S.qPosition, S.velocityHeading, arcAngle);

    const up = tangentFrame(S.qPosition).up;
    S.isOverWater = !isLand(seed, terrainType, up.x, up.y, up.z);
    const surfaceAlt = surfaceAltitudeAt(seed, terrainType, up.x, up.y, up.z);

    // ── Höhe: RELATIV zur Oberfläche, ohne absolute Klemme ─────────────────
    const elevateTarget = (elevate && !schwebe) ? 1 : 0;
    elevateBlend += (elevateTarget - elevateBlend) * (1 - Math.exp(-P.elevateSmooth * dt));
    // v12 · Der Höhenversatz von Hand. NUR im Schweben steuerbar — im Reiseflug behält Pfeil-hoch
    // seine Quellbedeutung (Steigflug über elevateBlend), und der Versatz läuft weich auf 0
    // zurück, damit das Verlassen des Modus kein Absacken ist.
    if (schwebe) {
      const richtung = (elevate ? 1 : 0) - (descend ? 1 : 0);
      schwebeVersatz = Math.max(0, Math.min(P.schwebeMax, schwebeVersatz + richtung * P.schwebeRate * dt));
    } else if (schwebeVersatz > 0) {
      schwebeVersatz = Math.max(0, schwebeVersatz - P.schwebeRate * 0.45 * dt);
    }
    const clearance = P.hoverHeight + (P.boostHeight - P.hoverHeight) * elevateBlend + schwebeVersatz;
    const terrainDrop = Math.max(0, prevSurfaceAltitude - surfaceAlt);
    const glideTarget = Math.min(P.cliffMax,
      terrainDrop * P.cliffGain * (P.cliffSpeedFloor + (1 - P.cliffSpeedFloor) * Math.min(1, speedRatio())));
    if (glideTarget > cliffGlideBonus) cliffGlideBonus = glideTarget;
    else cliffGlideBonus += (0 - cliffGlideBonus) * Math.min(1, P.cliffDecay * dt);
    prevSurfaceAltitude = surfaceAlt;

    // Im Schweben führt die EINGABE die Höhe, nicht das Gelände: gleiche Rate hoch wie runter,
    // und kein Klippenbonus (der ist eine Belohnung fürs Fliegen, nicht fürs Stehen).
    const targetAlt = schwebe ? surfaceAlt + P.hoverHeight + schwebeVersatz
                              : surfaceAlt + clearance + cliffGlideBonus;
    if (schwebe) {
      S.altitude = targetAlt;
    } else {
      const altitudeLerp = targetAlt >= S.altitude ? P.altRiseLerp : P.altFallLerp;
      S.altitude += (targetAlt - S.altitude) * Math.min(1, altitudeLerp * dt);
    }
    const hardFloor = surfaceAlt + P.hoverHeight;
    if (S.altitude < hardFloor) S.altitude = hardFloor;

    const altDelta = (S.altitude - prevAltitude) / Math.max(dt, 1e-4);
    prevAltitude = S.altitude;
    const climbRate = Math.max(-1, Math.min(1, altDelta * P.climbRateGain));
    S.pitch += (-P.climbPitchMax * Math.max(0, climbRate) - S.pitch) * Math.min(1, P.pitchSmooth * dt);

    // ── Schräglage: Lenkung plus Driftwinkel ───────────────────────────────
    const driftBank = Math.max(-P.driftBankMax, Math.min(P.driftBankMax,
      wrapPi(S.heading - S.velocityHeading) * P.driftBankScale));
    const turnBank = -turnInputSmoothed * P.maxBank * P.turnBankShare;
    const targetBank = Math.max(-P.maxBank, Math.min(P.maxBank, turnBank + driftBank));
    S.bankAngle += (targetBank - S.bankAngle) * Math.min(1, P.bankResp * dt);

    S.speed = Math.min(S.speed, P.absMaxSpeed);
  }

  /** v6 · Slice E · **Versetzen ohne einen zweiten Antrieb.** 1:1 `Carpet.teleportTo`
   *  (tinyskies@2659a5cc987d · `Carpet.ts:383`). Der Punkt dieser Funktion sind nicht die zwei
   *  offensichtlichen Zeilen (Ort und Kurs), sondern die FÜNF, die man vergisst: Fahrtrichtung
   *  gleichzieht, Drift löschen, `prevAltitude`/`prevSurfaceAltitude` auf den neuen Ort setzen und
   *  den Klippen-Bonus nullen. Ohne sie sieht das nächste Bild einen Höhensprung von der halben
   *  Weltdicke — und aus einem Portal-Durchflug wird ein Katapult samt Bodenkontakt-Kaskade.
   *  Wer stattdessen `S.qPosition` von außen setzt, hat genau diesen Fehler, nur unauffindbar. */
  function teleportTo(qPosition, heading, altitude, speed) {
    S.qPosition.copy(qPosition);
    S.heading = wrap2pi(heading);
    S.velocityHeading = S.heading;
    S.drifting = false;
    S.altitude = altitude;
    prevAltitude = altitude;
    const up = tangentFrame(S.qPosition).up;
    prevSurfaceAltitude = surfaceAltitudeAt(seed, terrainType, up.x, up.y, up.z);
    cliffGlideBonus = 0;
    S.speed = Math.min(speed != null ? speed : S.speed, P.absMaxSpeed);
    S.isOverWater = !isLand(seed, terrainType, up.x, up.y, up.z);
  }

  /** Welche Parameter von der Quelle abweichen — die Abnahme von Slice D in einer Liste. */
  function abweichungen() {
    const a = [];
    for (const k in CARPET_QUELLE) if (P[k] !== CARPET_QUELLE[k])
      a.push(k + ' ' + (+CARPET_QUELLE[k].toFixed(3)) + '→' + (+(+P[k]).toFixed(3)));
    return a;
  }

  function speedRatio() {
    if (S.speed <= P.minSpeed) return 0;
    return Math.min(1, (S.speed - P.minSpeed) / Math.max(1e-4, P.maxSpeed - P.minSpeed));
  }

  return {
    name: 'carpet', state: S, params: P, quelle: CARPET_QUELLE, abweichungen,
    get speedRatio() { return speedRatio(); },
    /** ⚠ **Die Anzeige-Größe, und sie ist NICHT `speedRatio`.** Georg, 3.9.: „geschwindigkeit
     *  sollte oben ÜBER dem gear rechts oben korrekt angezeigt werden (ist aktuell immer 0)".
     *  Gemessen: `speedRatio` ist quellentreu 0, solange `speed <= minSpeed` (0,28) — und ohne W
     *  rollt der Teppich genau auf diesen Sockel aus. Die Anzeige bildete also 0,28…0,78 auf
     *  0…100 ab und stand im ganzen Reiseflug auf 0. Das ist kein Fehler in `speedRatio`: die
     *  Größe misst den Abstand zum Sockel und hat sechs Leser (Drift, Boost, Klippengleiten,
     *  Tempostreifen, Klang, Erzähler), die genau das brauchen. **Eine Anzeige, die etwas anderes
     *  meint, braucht eine eigene Größe — nicht eine umgedeutete.** */
    get tempoAnzeige() { return Math.max(0, Math.min(1, S.speed / P.maxSpeed)); },
    get schwebt() { return schwebe; },
    get schwebeVersatz() { return schwebeVersatz; },
    /** Schweben an/aus. Gibt den neuen Zustand zurück, damit der Aufrufer ihn melden kann.
     *  ⚠ Beim EINSCHALTEN wird der Versatz aus der aktuellen Höhe gerückgerechnet. Ohne das
     *  spränge der Teppich aus dem Steigflug auf die Reiseflughöhe zurück — und die Ansage war
     *  „abbremsen … in der AKTUELLEN Höhe", nicht „abbremsen und absacken". */
    setSchwebe(on) {
      if (on && !schwebe) {
        const up = tangentFrame(S.qPosition).up;
        const surfaceAlt = surfaceAltitudeAt(seed, terrainType, up.x, up.y, up.z);
        schwebeVersatz = Math.max(0, Math.min(P.schwebeMax, S.altitude - surfaceAlt - P.hoverHeight));
      }
      schwebe = !!on;
      return schwebe;
    },
    // **Höhe über Grund**, nicht über dem Kugelmittelpunkt. `prevSurfaceAltitude` ist nach
    // `update` die Oberflächenhöhe DIESES Bildes — die Differenz ist damit exakt der Abstand,
    // den der Klang braucht (Bodenrumpeln) und der Erzähler liest (Tiefflug/Höhenflug).
    get agl() { return Math.max(0, S.altitude - prevSurfaceAltitude); },
    get driftIntensity() {
      const gap = Math.atan2(Math.sin(S.heading - S.velocityHeading), Math.cos(S.heading - S.velocityHeading));
      return Math.min(1, Math.abs(gap) / (Math.PI / 4));
    },
    update,
    /** v3 · Flugstart: beweglicher Boden unter dem Tempo (Standard = P.minSpeed). */
    setSpeedFloor(v) { speedFloor = Math.max(0, Math.min(P.maxSpeed, v)); },
    get speedFloor() { return speedFloor; },
    setSpeed(v) { S.speed = Math.max(0, Math.min(P.absMaxSpeed, v)); },
    /** v6 · Slice E · Versetzen (Portal). Siehe Kopf der Funktion — sie ist der EINZIGE Weg,
     *  `qPosition` von außen zu ändern. */
    teleportTo,
    /** v3 · Reisetempo-Obergrenze — damit niemand die 0,78 als zweite Konstante nachschreibt. */
    get maxSpeed() { return P.maxSpeed; },
    matrix() { return buildPlaneMatrix(S.qPosition, S.heading, S.pitch, S.bankAngle, S.altitude, globeRadius); },
    worldPos() { return cartesianFromSpherical(S.qPosition, S.altitude, globeRadius); },
    /** Für Schüsse: Ursprung und Richtung aus der Nase, dieselbe Formel wie im Original. */
    shotRay() { return rayFromState(S.qPosition, S.heading, S.pitch, S.altitude, globeRadius); },
    report() {
      const ab = abweichungen();
      return { tempo: +S.speed.toFixed(2), hoehe: +S.altitude.toFixed(3),
               drift: +this.driftIntensity.toFixed(2), ueberWasser: S.isOverWater,
               kurs: Math.round(S.heading * 180 / Math.PI),
               // v5 · Slice D: die Zahl daneben sagt, wie viele der Parameter nicht mehr
               // tinyskies sind. 0 = quellentreu.
               parameter: Object.keys(CARPET_QUELLE).length,
               abweichungen: ab.length, abweichend: ab };
    },
    /** Eine Zeile fürs Panel — Georg liest keine Konsole. */
    zeile() {
      const ab = abweichungen();
      return Object.keys(CARPET_QUELLE).length + ' params · '
        + (ab.length ? '⚠ ' + ab.length + ' off source: ' + ab.join(', ')
                     : 'all source-faithful (tinyskies Carpet.ts)')
        + ' · speed ' + S.speed.toFixed(2) + '/' + P.maxSpeed + ' · floor ' + speedFloor.toFixed(2);
    },
  };
}
