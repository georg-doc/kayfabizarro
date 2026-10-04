// ============================================================================
// sky-enemies.js — KFB Travel Globe v6 · Slice E2 · Fliegende Gegner: ZIELE
// ----------------------------------------------------------------------------
// Georgs Entscheidung (30.8., auf die Frage „gefährlich oder nur Ziele?"):
//   **„Nur Ziele jetzt, gefährlich als späterer Aufsatz auf denselben Treffer-Vertrag."**
// Das ist der ganze Bauauftrag dieses Moduls, und es ist ein Vertrag, kein Feature: was hier steht,
// muss so gebaut sein, dass „gefährlich" später ein LESER dazubekommt — kein zweites System.
//
// ── Quelle: `client/src/game/SkyGremlins.ts` (tinyskies@2659a5cc987d, gelesen 30.8.) ─────────
// Die Datei ist 50 kB und war bis heute bewusst ungelesen. Übernommen sind ihre ZAHLEN und ihr
// Verhaltensmodell, wörtlich:
//   Höhenband 0,52…0,65 · Bodenabstand 0,20 · Reisetempo 0,34 · Jagdtempo 0,50
//   Wippen 2,8 rad/s bei 0,08 Amplitude · Erkennungsreichweite 2,25
//   Abstandsband 0,92 / 1,15 / 1,45 mit Orbit-Gewicht 0,92 und Rückzugs-Gewicht 1,25
//   Kurs-Blende 3,6/s · Höhen-Blende 2,8/s · Trefferradius 0,16 · 3 Treffer je Gegner
//   Absturz 0,8 s bei Sinkrate 0,95 · Respawn 13…19 s · Spawn ≥ 2,5 u vom Spieler
//   Trefferwackeln 0,85 mit Abklingen exp(−5·dt)
//
// **Was ABSICHTLICH fehlt, und wo es später herkommt:** die Quelle lässt ihre Gremlins schießen
// (`GREMLIN_FIRE_RANGE 1.6` · `FIRE_DOT 0.82` · `AIM_TURN_RATE 9.0` · Nachladen 1,85…2,95 s ·
// `SHOT_SPEED 2.85` · `MUZZLE_FORWARD 0.12` · `AIM_SIDE_SPREAD 0.24` · `PLAYER_HIT_RADIUS 0.22`)
// und hat einen König (`GREMLIN_KING_*`, 10 Treffer, ab 7 Abschüssen). Nichts davon ist hier
// gebaut — aber die Konstanten stehen im Kopf, damit der Aufsatz sie KOPIERT und nicht neu erfindet.
// Der Vertrag unten hält genau die Felder offen, die er braucht: `leben`, `zustand`, `weltPos`,
// `onTreffer`, `onAbschuss`. Ein „gefährlicher" Gegner ist damit ein Sender, kein Umbau.
//
// ── Unsere Abweichungen, gezählt und benannt ────────────────────────────────────────────────
//  1 **Die Gegner sind GLB-Modelle mit eigenen Animationen** (Quaternius „Ultimate Monsters
//    Bundle", `anim: true` im Index — Ghost Skull, Ghost, Armabee, Hywirl …), nicht aus Primitiven
//    gebaut wie in der Quelle. Also: `SkeletonUtils.clone` je Exemplar, ein `AnimationMixer` je
//    Exemplar, und der Flügelschlag kommt aus dem Modell statt aus zwei Pivot-Gruppen.
//    Ein Modell ohne Animation wird GEMELDET, nicht heimlich starr gestellt (`tor()`).
//  2 **Kein Trail, keine HP-Leiste über dem Kopf** (beides hat die Quelle). Der Trail wäre ein
//    zweiter Streifenzeichner neben `carpet-trail`; die HP-Leiste ist eine HUD-Entscheidung, die
//    Georg noch nicht getroffen hat. Stattdessen sagt das Trefferwackeln, dass es gesessen hat.
//  3 **Auto-Target (Chill-Mode)** ist UNSER Zusatz und Georgs Vorgabe: die Quelle streut ihre
//    Schüsse (`AIM_SIDE_SPREAD`), wir helfen ihnen. Umgesetzt als Kegel-Suche
//    (`imKegel`), die der Runner beim Schuss fragt — die Trefferprüfung selbst bleibt unberührt.
//    Ein Zielhilfe-Winkel von 0 ist damit exakt „keine Zielhilfe".
// ============================================================================

import { moveOnSphere, tangentFrame, cartesianFromSpherical, lerpAngle,
         randomSpawnQuaternionAndHeading, seededRandom, quaternionFromSurfaceNormal } from './spherical-math.js';
import { surfaceAltitudeAt } from './terrain-surface.js';
import { streuen } from './verteilung.js';   // v11 · Erstplatzierung auf der EINEN Streuungsschicht

/** Wörtlich aus `SkyGremlins.ts` — die Tabelle, gegen die das Panel prüft. */
export const GEGNER_QUELLE = Object.freeze({
  bodenAbstand: 0.20,     // GREMLIN_SURFACE_CLEARANCE
  hoeheMin: 0.52,         // GREMLIN_ALTITUDE_MIN
  hoeheMax: 0.65,         // GREMLIN_ALTITUDE_MAX
  reiseTempo: 0.34,       // GREMLIN_CRUISE_SPEED
  jagdTempo: 0.50,        // GREMLIN_CHASE_SPEED
  wippHz: 2.8,            // GREMLIN_BOB_SPEED
  wippAmp: 0.08,          // GREMLIN_BOB_AMP
  sichtweite: 2.25,       // GREMLIN_DETECT_RANGE
  standIdeal: 1.15,       // GREMLIN_STANDOFF_IDEAL
  standMin: 0.92,         // GREMLIN_STANDOFF_MIN
  standMax: 1.45,         // GREMLIN_STANDOFF_MAX
  orbitGewicht: 0.92,     // GREMLIN_ORBIT_WEIGHT
  rueckzugGewicht: 1.25,  // GREMLIN_RETREAT_WEIGHT
  kursBlende: 3.6,        // lerpAngle-Rate im Verfolgen
  hoehenBlende: 2.8,      // Höhen-Blende
  trefferRadius: 0.16,    // GREMLIN_HIT_RADIUS
  leben: 3,               // GREMLIN_HP_MAX
  sturzDauer: 0.8,        // GREMLIN_FALL_SEC
  sturzTempo: 0.95,       // GREMLIN_FALL_SPEED
  respawnMin: 13.0,       // GREMLIN_RESPAWN_MIN_SEC
  respawnMax: 19.0,       // GREMLIN_RESPAWN_MAX_SEC
  spawnAbstand: 2.5,      // Wurzel aus distSq > 6.25
  wackelAmp: 0.85,        // hitWobbleAmp
  wackelAbklang: 5.0,     // exp(−5·dt)
});

/** Die Modelle. Alle mit `anim: true` im Index gemessen, Größe aus derselben Zeile.
 *  `h` ist die ZIELHÖHE in Weltmaß — ein Gegner soll neben dem Pet (0,075) lesbar sein, aber
 *  kleiner als eine Landmarke (0,15…0,22). */
export const GEGNER_SATZ = [
  { name: 'Ghost Skull', h: 0.16, w: 5 },
  { name: 'Ghost',       h: 0.15, w: 4 },
  { name: 'Armabee',     h: 0.13, w: 4 },
  { name: 'Hywirl',      h: 0.14, w: 3 },
  { name: 'Squidle',     h: 0.14, w: 2 },
];

export function createSkyEnemies(opts = {}) {
  const THREE = opts.THREE;
  const R_GLOBE = opts.radius != null ? opts.radius : 5;
  const seed = opts.seed | 0;
  const terrainType = opts.terrainType;

  const P = Object.assign({
    on: true,
    anzahl: 3,            // GREMLIN_BASE_COUNT
    // Zielhilfe (Chill-Mode). 0° = aus. Der Kegel wird beim SCHUSS gefragt, nicht beim Treffer.
    zielhilfeGrad: 11,
    zielhilfeWeite: 2.6,
    // ⚠ **Das HÖHENBAND ist ab jetzt RELATIV zur Reiselinie — und das ist ein Fehler von mir,
    // den mein eigenes Instrument genannt und ich wegerklärt habe.**
    // Georg, 31.8.: *„die gegner fliegen zu hoch, sie sind oft nur oben kurz im schnitt zu sehen"*.
    // Gerechnet: die Quelle hält `GREMLIN_ALTITUDE_MIN 0,52` — und **0,52 ist bei uns
    // `CARPET_QUELLE.boostHeight`**, also die Höhe, die der Teppich nur mit GEHALTENER Steigtaste
    // erreicht. Im Reiseflug schwebt er bei `hoverHeight 0,03`. Die Gegner standen damit
    // **17–21× der Reiseflughöhe** über dem Spieler, in einer Kamera, die nach vorn schaut.
    // Beide Zahlen sind 1:1 aus der Quelle. Was fehlt, ist deren BEZUG: dort hängt vermutlich eine
    // andere Kameraführung oder ein Spielfluss daran, der dauernd steigt. Nach §05q wird das
    // GEMELDET statt geschlichtet — und die Meldung steht als Zahl im Tor.
    // ⚠⚠ Die peinliche Hälfte: meine Torzeile sagte wörtlich *„they fly 0.4…0.6 u above the cruise
    // line, so ↑ (climb) is the way to reach them"* — ich habe den Befund GEMESSEN, aufgeschrieben
    // und als Feature verkauft. **Ein Instrument, das eine Zahl nennt und sie im selben Satz
    // wegerklärt, ist schlimmer als eines, das schweigt.**
    bandModus: 'reiselinie',   // 'reiselinie' (Standard) | 'quelle' (0,52…0,65 absolut)
    // ⚠ **Und hier ist der Beweis, dass nur die KLEMME falsch war, nicht die Rechnung:** die Quelle
    // setzt einen Gegner auf `boden + 0,20 + rnd·0,18` — also 0,20…0,38 ÜBER GRUND, relativ, richtig
    // — und klemmt das Ergebnis danach in ein ABSOLUTES Band 0,52…0,65. Bei ihrer Weltgröße deckt
    // sich beides; bei uns zieht die Klemme jeden Gegner auf mindestens 0,52 hoch und macht die
    // relative Rechnung wertlos. Noch deutlicher bei der Jagd: dort rechnet die Quelle
    // `spielerAlt ± 0,18` — also ausdrücklich AUF AUGENHÖHE — und die Klemme hebt es wieder auf
    // 0,52. **Die Absicht der Quelle steht in ihrer Rechnung, nicht in ihrer Klemme.**
    // Deshalb sind die Grenzen jetzt genau die Streuung der Quelle, über Grund:
    bandMin: GEGNER_QUELLE.bodenAbstand,                    // 0,20 — die Quellzahl, unverändert
    bandMax: GEGNER_QUELLE.bodenAbstand + 0.18,             // 0,38 — ihre volle Streuung, kein Deckel darüber
    trefferFaktor: 1,     // Regler auf den Trefferradius (1 = Quelle)
    sperrPuffer: 0.18,    // Zuschlag auf jede Sperrzone — gemessen 3.9.: bei 0,12 streift der frontale Anflug die Fahne (0,455 vs 0,45)
    scale: 1,
  }, opts.params || {});

  const group = new THREE.Group();
  group.name = 'sky-enemies';

  const gegner = [];
  let zeit = 0, stand = 'lädt …', modelle = 0, ohneAnim = 0;
  const stat = { treffer: 0, abschuesse: 0, respawns: 0, zielhilfeTreffer: 0, spawnVersuche: 0 };
  // v11 · Erstorte aus der Streuungsschicht: Gegner dürfen über Wasser, nur weit auseinander.
  const erstOrte = P.anzahl > 0 ? streuen({ THREE, count: P.anzahl, seed, salt: 30011, gueltig: () => true }) : null;
  stat.streuung = erstOrte ? erstOrte.bericht : null;
  const mixer = [];

  const _p = new THREE.Vector3(), _q = new THREE.Vector3(), _r = new THREE.Vector3();
  const _fwd = new THREE.Vector3(), _right = new THREE.Vector3(), _up = new THREE.Vector3();
  const _M = new THREE.Matrix4();
  const spielerPos = new THREE.Vector3();
  let spielerAlt = 0;

  /** Rückrufe für den Aufsatz „gefährlich" und für die Kaskaden. Beide optional, beide EIN Platz. */
  let onTreffer = null, onAbschuss = null;

  /** 1:1 `segmentHitsSphere` der Quelle: ein Schuss ist ein Segment je Bild, kein Punkt. */
  function segmentTrifftKugel(a, b, mitte, radius) {
    _p.copy(b).sub(a);
    const l2 = _p.lengthSq();
    _q.copy(mitte).sub(a);
    if (l2 < 1e-12) return _q.lengthSq() <= radius * radius;
    let t = _q.dot(_p) / l2;
    t = Math.max(0, Math.min(1, t));
    _r.copy(a).addScaledVector(_p, t).sub(mitte);
    return _r.lengthSq() <= radius * radius;
  }

  // ── v12 · Sperrzonen (Georg, 3.9.: „enemies fliegen räumlich falsch hinter Vulkan-Lava") ──────
  // ⚠ **Der Grund ist eine Verwechslung von zwei Leserinnen, und sie steht schon in diesem
  // Modul:** ein Gegner hält seinen Abstand zu `surfaceAltitudeAt` — dem GELÄNDE. Der Vulkan ist
  // aber ein PROP: seine Höhe kennt nur `bodenRadius` (boden-lesung.js), die Leserin, mit der der
  // Mech steht und die Karten liegen. Ein Gegner fliegt deshalb geradewegs durch Kegel und
  // Lavafahne; die additive Fahne färbt ihn dabei ein, und genau das liest man als „er ist hinter
  // der Lava". Die Tiefenprüfung ist in Ordnung (gemessen: alle Materialien `depthTest: true`,
  // Fahne `depthWrite: false` bei `renderOrder 10/11`) — **es ist kein Render-Fehler, sondern ein
  // Flugweg durch ein Objekt, das der Flugweg nicht kennt.**
  //
  // Die Reparatur ist waagerecht, nicht senkrecht: der Gegner wird AUSSEN HERUM gelenkt, statt
  // darüber gehoben. Ein Gegner, der über den Vulkan steigt, verlässt sein Jagdband und ist
  // wieder „nur oben kurz im Schnitt zu sehen" — der Fehler vom 31.8., den wir schon einmal
  // hatten. Die Zonen kommen von außen (der Wirt kennt die Vulkane), damit dieses Modul keine
  // zweite Wahrheit über die Weltbelegung führt.
  let sperren = [];
  const _sw = { n: null };
  /** @param liste [{ n: Vector3 (Einheitsnormale), r: number (Weltmaß) }] */
  function setSperrzonen(liste) { sperren = Array.isArray(liste) ? liste.filter((z) => z && z.n) : []; }
  /** Kurs-Korrektur: liegt der Ort in einer Zone, dreht der Kurs tangential an ihr vorbei.
   *  Gibt den korrigierten Kurs zurück (oder den unveränderten, wenn frei). */
  function umfliegen(qPos, kurs, dt) {
    if (!sperren.length) return kurs;
    const fr = tangentFrame(qPos);
    for (const z of sperren) {
      const bogen = Math.acos(Math.max(-1, Math.min(1, fr.up.dot(z.n)))) * R_GLOBE;
      const r = (z.r || 0.4) + P.sperrPuffer;
      if (bogen > r) continue;
      // Peilung zur Zonenmitte im Tangentialrahmen — und dann 90° daneben, damit der Gegner
      // sie UMRUNDET statt vor ihr zu wenden (eine Kehrtwende sieht aus wie ein Fehler).
      const zn = Math.atan2(z.n.dot(fr.east), z.n.dot(fr.north));
      const seite = Math.sin(kurs - zn) >= 0 ? 1 : -1;
      const ziel = zn + seite * (Math.PI / 2);
      // Je tiefer drin, desto härter — am Rand ein Hauch, in der Mitte sofort.
      const tief = Math.max(0, Math.min(1, 1 - bogen / Math.max(1e-4, r)));
      return lerpAngle(kurs, ziel, Math.min(1, (1.5 + 6 * tief) * dt));
    }
    return kurs;
  }

  const trefferRadius = () => GEGNER_QUELLE.trefferRadius * P.scale * P.trefferFaktor;
  /** Das Höhenband je Ort — im Modus `reiselinie` über dem GRUND, in `quelle` absolut. */
  function band(boden) {
    if (P.bandModus === 'quelle') return [GEGNER_QUELLE.hoeheMin, GEGNER_QUELLE.hoeheMax];
    return [boden + P.bandMin, boden + P.bandMax];
  }
  /** Zielhöhe eines Eintrags — eine Zeile, damit die Nachskalierung dieselbe Zahl liest wie der Bau. */
  const def_h = (eintrag) => (eintrag && eintrag.def && eintrag.def.h) || 0.15;

  /** Weltpose aus Kurs und Höhe — dieselbe Konstruktion wie `updateGremlinTransform`.
   *  ⚠ **Rechtshändig, und das ist bei GLB-Modellen keine Kosmetik.** Die Quelle baut
   *  `makeBasis(right, up, forward)` mit `right = forward × up` — das ergibt Determinante −1.
   *  Bei ihren Primitiven fällt es nicht auf; ein GLB-Modell mit `side: FrontSide` dreht damit
   *  seine Dreiecks-Wicklung und ist von INNEN zu sehen. Richtig ist die Reihenfolge der
   *  Rechtshändigkeit: X = Y × Z, dann Y = Z × X. Kein `DoubleSide` darüber — das wäre ein
   *  Pflaster auf einem Vorzeichen. */
  function poseSetzen(g) {
    const fr = tangentFrame(g.qPosition);
    _fwd.set(0, 0, 0).addScaledVector(fr.north, Math.cos(g.heading))
        .addScaledVector(fr.east, Math.sin(g.heading)).normalize();
    g.weltPos.copy(cartesianFromSpherical(g.qPosition, g.altitude, R_GLOBE));
    _up.copy(g.weltPos).normalize();
    _right.crossVectors(_up, _fwd).normalize();
    _up.crossVectors(_fwd, _right).normalize();
    _M.makeBasis(_right, _up, _fwd);
    _M.setPosition(g.weltPos);
    g.root.matrix.copy(_M);
    g.root.matrixWorldNeedsUpdate = true;
  }

  /** 1:1 `respawnGremlin`: bis zu zehn Versuche, mindestens 2,5 u vom Spieler entfernt. */
  function respawn(g, ersteRunde) {
    let gesetzt = false, versuche = 0;
    // v11 · Die ERSTE Runde kommt aus `streuen()` (ein Zufall für die Welt, Slice „Streuung“);
    // Respawns bleiben Quelle (ein bewegter Gegner ist kein Weltinventar). Kurs aus dem eigenen Strom.
    if (ersteRunde && erstOrte && erstOrte[g.index]) {
      const n = erstOrte[g.index];
      g.qPosition.copy(quaternionFromSurfaceNormal(n.x, n.y, n.z));
      g.heading = g.rnd() * Math.PI * 2;
      gesetzt = true; stat.spawnVersuche++;
    }
    while (!gesetzt && versuche < 10) {
      const s = randomSpawnQuaternionAndHeading(seed + g.index * 982451653 + g.salt * 7919);
      g.salt += 1; versuche++; stat.spawnVersuche++;
      const pos = cartesianFromSpherical(s.qPosition, P.bandMin, R_GLOBE);
      if (spielerPos.lengthSq() > 0
          && pos.distanceToSquared(spielerPos) <= GEGNER_QUELLE.spawnAbstand * GEGNER_QUELLE.spawnAbstand) continue;
      g.qPosition.copy(s.qPosition);
      g.heading = s.heading;
      gesetzt = true;
    }
    const fr = tangentFrame(g.qPosition);
    const boden = surfaceAltitudeAt(seed, terrainType, fr.up.x, fr.up.y, fr.up.z);
    const [bMin, bMax] = band(boden);
    g.basisHoehe = Math.min(bMax,
      Math.max(bMin, boden + GEGNER_QUELLE.bodenAbstand + g.rnd() * 0.18));
    g.altitude = g.basisHoehe;
    g.leben = GEGNER_QUELLE.leben;
    g.zustand = 'lebt';
    g.sturzT = 0;
    g.wackelAmp = 0; g.wackelPhase = 0;
    g.root.visible = true;
    g.rig.scale.setScalar(g.rigScale);
    g.rig.rotation.set(0, 0, 0);
    if (!ersteRunde) stat.respawns++;
    poseSetzen(g);
  }

  /** 1:1 `updateAliveGremlin`, ohne den Schuss-Block (siehe Kopf: das ist der Aufsatz). */
  function lebendUpdate(g, dt) {
    _p.copy(g.weltPos);
    _q.copy(spielerPos).sub(_p);
    const abstand = _q.length();
    const fr = tangentFrame(g.qPosition);
    _r.copy(_q).addScaledVector(fr.up, -_q.dot(fr.up));
    let tempo = GEGNER_QUELLE.reiseTempo;
    let laufKurs = g.heading;

    if (abstand < GEGNER_QUELLE.sichtweite && _r.lengthSq() > 1e-5) {
      _r.normalize();
      const orbit = _up.crossVectors(fr.up, _r).normalize().multiplyScalar(g.orbitSign);
      let anfahrt = 0, orbitG = GEGNER_QUELLE.orbitGewicht;
      if (abstand < GEGNER_QUELLE.standMin) {
        anfahrt = -GEGNER_QUELLE.rueckzugGewicht; orbitG = 0.38;
        tempo = GEGNER_QUELLE.jagdTempo * 1.08;
      } else if (abstand > GEGNER_QUELLE.standMax) {
        anfahrt = 0.9; orbitG = 0.56; tempo = GEGNER_QUELLE.jagdTempo;
      } else {
        const halb = Math.max(0.08, (GEGNER_QUELLE.standMax - GEGNER_QUELLE.standMin) * 0.5);
        anfahrt = ((abstand - GEGNER_QUELLE.standIdeal) / halb) * 0.28;
        tempo = GEGNER_QUELLE.reiseTempo * 1.08;
      }
      _fwd.copy(orbit).multiplyScalar(orbitG).addScaledVector(_r, anfahrt);
      if (_fwd.lengthSq() < 1e-5) _fwd.copy(orbit);
      _fwd.normalize();
      laufKurs = Math.atan2(_fwd.dot(fr.east), _fwd.dot(fr.north));
      const zielKurs = Math.atan2(_r.dot(fr.east), _r.dot(fr.north))
                     + Math.sin(zeit * 0.9 + g.drehPhase) * 0.2;
      g.heading = lerpAngle(g.heading, zielKurs, Math.min(1, GEGNER_QUELLE.kursBlende * dt));
      const jagdHoehe = spielerAlt + Math.sin(zeit * 1.7 + g.wippPhase) * 0.12
                      + Math.cos(g.drehPhase) * 0.06;
      // Die Klemme ist relativ zum GRUND an DIESEM Ort — nicht absolut (siehe `bandMin`/`bandMax`).
      const bFr = tangentFrame(g.qPosition);
      const bBoden = surfaceAltitudeAt(seed, terrainType, bFr.up.x, bFr.up.y, bFr.up.z);
      const [jMin, jMax] = band(bBoden);
      g.basisHoehe = Math.max(jMin, Math.min(jMax, jagdHoehe));
      g.jagt = true;
    } else {
      g.heading += Math.sin(zeit * 0.7 + g.drehPhase) * 0.55 * dt;
      g.basisHoehe += Math.sin(zeit * 0.35 + g.wippPhase) * 0.012 * dt;
      const pFr = tangentFrame(g.qPosition);
      const pBoden = surfaceAltitudeAt(seed, terrainType, pFr.up.x, pFr.up.y, pFr.up.z);
      const [pMin, pMax] = band(pBoden);
      g.basisHoehe = Math.max(pMin, Math.min(pMax, g.basisHoehe));
      laufKurs = g.heading;
      g.jagt = false;
    }

    const zielHoehe = g.basisHoehe
      + Math.sin(zeit * GEGNER_QUELLE.wippHz + g.wippPhase) * GEGNER_QUELLE.wippAmp;
    g.altitude += (zielHoehe - g.altitude) * Math.min(1, GEGNER_QUELLE.hoehenBlende * dt);
    laufKurs = umfliegen(g.qPosition, laufKurs, dt);
    // ⚠ Nur im PATROUILLIEREN darf der korrigierte Kurs in `g.heading` zurück — dort ist
    // `laufKurs = g.heading`, und ohne das Zurückschreiben zöge die nächste Runde ihn wieder hinein.
    // Im JAGEN sind Blick und Bewegung zwei Größen (Quelle: `heading` = Gesicht zum Spieler,
    // `laufKurs` = Orbit/Anfahrt), und die Bewegung liest `g.heading` gar nicht. Erste Fassung schrieb
    // unbedingt — der Gegner schaute dann in seine Orbit-Tangente statt zum Spieler, und die
    // Kurs-Blende (3,6/s) startete jedes Bild vom überschriebenen Wert. Abnahme 3.9.
    if (!g.jagt) g.heading = laufKurs;
    g.qPosition.copy(moveOnSphere(g.qPosition, laufKurs, (tempo * dt) / R_GLOBE));

    const fr2 = tangentFrame(g.qPosition);
    const boden = surfaceAltitudeAt(seed, terrainType, fr2.up.x, fr2.up.y, fr2.up.z);
    const minH = boden + GEGNER_QUELLE.bodenAbstand;
    if (g.altitude < minH) g.altitude = minH;
    poseSetzen(g);

    // Trefferwackeln: die Quelle nimmt dafür `bankScale` als dt (ihre eigene Eigenheit) —
    // hier heißt dt auch dt.
    if (g.wackelAmp > 0.002) {
      g.wackelPhase += dt * 25;
      g.rig.rotation.z = Math.sin(g.wackelPhase) * g.wackelAmp;
      g.wackelAmp *= Math.exp(-GEGNER_QUELLE.wackelAbklang * dt);
    } else { g.wackelAmp = 0; g.rig.rotation.z = 0; }
  }

  /** 1:1 `updateFallingGremlin`: Trudeln, Schrumpfen in den letzten 0,2 s, dann Respawn-Uhr. */
  function sturzUpdate(g, dt) {
    g.sturzT = Math.max(0, g.sturzT - dt);
    if (g.sturzT < 0.2) g.rig.scale.setScalar(g.rigScale * (g.sturzT / 0.2));
    const fr = tangentFrame(g.qPosition);
    const boden = surfaceAltitudeAt(seed, terrainType, fr.up.x, fr.up.y, fr.up.z);
    g.altitude = Math.max(boden + GEGNER_QUELLE.bodenAbstand * 0.55,
                          g.altitude - GEGNER_QUELLE.sturzTempo * dt);
    g.heading += 3.6 * dt;
    poseSetzen(g);
    g.rig.rotation.x += dt * 11.5;
    g.rig.rotation.z += dt * 9.5;
    if (g.sturzT <= 0) {
      g.zustand = 'wartet';
      g.respawnT = GEGNER_QUELLE.respawnMin
        + g.rnd() * (GEGNER_QUELLE.respawnMax - GEGNER_QUELLE.respawnMin);
      g.root.visible = false;
    }
  }

  async function bauen() {
    let index = null;
    for (const url of ['./asset-repo.json', '../asset-repo.json']) {
      try { const r = await fetch(url); if (r.ok) { index = await r.json(); break; } } catch (e) {}
    }
    if (!index || !index.assets) { stand = 'asset-repo.json nicht lesbar — keine Gegner'; return; }
    const byName = new Map();
    for (const a of index.assets) if (!byName.has(a.name)) byName.set(a.name, a);

    const [loaderMod, skelMod] = await Promise.all([
      import('three/addons/loaders/GLTFLoader.js'),
      // ⚠ **`SkeletonUtils.clone`, nicht `Object3D.clone`.** Die Monster sind SKINNED: ein
      // gewöhnlicher Klon teilt das Skelett, und dann tanzen fünf Gegner exakt gleich — oder
      // brechen zusammen, weil zwei Mixer auf denselben Knochen schreiben.
      import('three/addons/utils/SkeletonUtils.js'),
    ]);
    const loader = new loaderMod.GLTFLoader();

    const geladen = new Map();
    for (const def of GEGNER_SATZ) {
      const asset = byName.get(def.name);
      if (!asset) { console.warn('[gegner] nicht im Index:', def.name); continue; }
      try {
        const gltf = await new Promise((res, rej) => loader.load(asset.ghUrl, res, undefined, rej));
        // ⚠ **Die Größe kommt aus dem INDEX, nicht aus `Box3.setFromObject`.** Das ist der Fehler,
        // der diesen Slice unsichtbar gemacht hat: über eine SKINNED-Hierarchie misst `Box3` die
        // un-geskinnte Bindpose und lieferte bei „Ghost Skull" eine Höhe von rund **200 u**. Daraus
        // wurde `norm = 0,00076`, das Modell war **68× zu klein** — die Bone-Spanne lag bei 1,7
        // Millimetern Weltmaß, also sub-pixel aus jeder Entfernung. Der Index nennt dieselbe
        // Größe korrekt (`size: [5.50, 3.101, 1.534]`, `naturalScale: 0.182`), weil sie dort EINMAL
        // sauber gemessen wurde. **Eine Messung, die man schon hat, wird nicht zur Laufzeit neu
        // erfunden** — und eine Messmethode, die für statische Netze stimmt, gilt nicht automatisch
        // für animierte.
        const hoheIdx = asset.size && asset.size[1] ? asset.size[1] : null;
        let norm, quelleDerGroesse;
        if (hoheIdx) { norm = def.h / hoheIdx; quelleDerGroesse = 'index'; }
        else {
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const sy = Math.max(1e-4, box.getSize(new THREE.Vector3()).y);
          norm = def.h / sy; quelleDerGroesse = 'box3(fallback)';
          console.warn('[gegner] ' + def.name + ': keine Größe im Index — Box3-Rückweg, '
            + 'bei skinned Modellen unzuverlässig (sy=' + sy.toFixed(2) + ')');
        }
        geladen.set(def.name, { def, gltf, norm, quelleDerGroesse,
                               clips: gltf.animations || [] });
        if (!gltf.animations || !gltf.animations.length) ohneAnim++;
        modelle++;
      } catch (e) { console.warn('[gegner] nicht ladbar:', def.name, e && e.message); }
    }
    if (!geladen.size) { stand = 'kein Gegner-Modell ladbar'; return; }
    const liste = [...geladen.values()];

    for (let i = 0; i < P.anzahl; i++) {
      const eintrag = liste[i % liste.length];
      const root = new THREE.Group();
      root.matrixAutoUpdate = false;
      const rig = new THREE.Group();
      root.add(rig);
      const klon = skelMod.clone(eintrag.gltf.scene);
      klon.scale.setScalar(eintrag.norm * P.scale);
      // Kein Fuß-Versatz: ein Gegner FLIEGT, er steht nicht. (Der alte Versatz kam aus derselben
      // falschen Box3-Messung und hätte das Modell zusätzlich verschoben.)
      klon.traverse((n) => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; } });
      rig.add(klon);
      group.add(root);

      const rnd = seededRandom(seed + i * 104729 + 17);
      const g = {
        index: i, root, rig, rnd, def: eintrag.def,
        rigScale: 1,
        qPosition: new THREE.Quaternion(), heading: 0,
        altitude: P.bandMin, basisHoehe: P.bandMin,
        weltPos: new THREE.Vector3(),
        orbitSign: rnd() < 0.5 ? -1 : 1,
        wippPhase: rnd() * Math.PI * 2, drehPhase: rnd() * Math.PI * 2,
        // ── DER VERTRAG (siehe Kopf) ────────────────────────────────────────────────────────
        leben: GEGNER_QUELLE.leben,
        zustand: 'lebt',      // 'lebt' | 'stuerzt' | 'wartet'
        salt: 0, respawnT: 0, sturzT: 0,
        wackelAmp: 0, wackelPhase: 0, jagt: false,
        clips: eintrag.clips.length,
      };
      if (eintrag.clips.length) {
        const mx = new THREE.AnimationMixer(klon);
        // Die Quaternius-Modelle bringen mehrere Clips; genommen wird der erste, dessen Name nach
        // Fliegen/Schweben klingt — sonst der erste überhaupt. Ein Modell ohne passenden Namen ist
        // kein Fehler, ein Modell ohne Clip schon (und das zählt `tor()`).
        const clip = eintrag.clips.find((c) => /fly|hover|idle|float|walk|run/i.test(c.name))
                   || eintrag.clips[0];
        const action = mx.clipAction(clip);
        action.time = rnd() * clip.duration;   // nicht im Gleichtakt
        action.play();
        mixer.push(mx);
        g.mixer = mx; g.clipName = clip.name;
      }
      gegner.push(g);
      respawn(g, true);
      // ⚠ **Nachskaliert an der KNOCHEN-Spanne, nicht an der Netz-Hülle.** Bei einem skinned Modell
      // sagt die Geometrie nur die Bindpose; wohin die Vertices wirklich wandern, sagen die Knochen.
      // Gemessen an „Ghost Skull": Index-Höhe 3,10 (Bindpose) gegen eine Knochen-Spanne, die nach
      // der Normierung 0,11 u ergibt — die Absicht war 0,16. Also wird EINMAL nachgezogen, mit der
      // Größe, die das Bild bestimmt. (Der Index bleibt der Einstieg: er verhindert den 68×-Fehler
      // von `Box3.setFromObject`; die Knochen machen daraus die letzten 30 %.)
      klon.updateWorldMatrix(true, true);
      let sm = null;
      klon.traverse((n) => { if (!sm && n.isSkinnedMesh && n.skeleton) sm = n; });
      let spanne = 0;
      if (sm) {
        const bb = new THREE.Box3(), bp = new THREE.Vector3();
        for (const b of sm.skeleton.bones) {
          if (!b) continue;
          b.updateWorldMatrix(true, false);
          bb.expandByPoint(bp.setFromMatrixPosition(b.matrixWorld));
        }
        const bs = bb.getSize(new THREE.Vector3());
        spanne = Math.max(bs.x, bs.y, bs.z);
      }
      if (spanne > 1e-5) {
        const korr = def_h(eintrag) / spanne;
        // Geklemmt: eine Korrektur um mehr als das Zehnfache wäre keine Feinjustierung, sondern ein
        // Hinweis darauf, dass die Eingangsgröße falsch ist — dann bleibt sie stehen und `tor()`
        // meldet es.
        if (korr > 0.1 && korr < 10) {
          klon.scale.multiplyScalar(korr);
          klon.updateWorldMatrix(true, true);
          spanne *= korr;
        }
      }
      g.weltRadius = (spanne || 0) * 0.5;
    }
    stand = modelle + ' Modelle · ' + gegner.length + ' Gegner'
          + (ohneAnim ? ' · ⚠ ' + ohneAnim + ' ohne Animation' : ' · alle animiert');
    console.info('[gegner] ' + stand);
  }
  bauen().catch((e) => { stand = 'Fehler: ' + (e && e.message || e); console.warn('[gegner]', e); });

  return {
    name: 'sky-enemies', group, params: P, quelle: GEGNER_QUELLE,
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; group.visible = !!on; },
    get status() { return stand; },
    /** Der Spieler als EINE Eingabe je Bild — zwei Quellen für „wo ist er" wären Fehlerklasse 1. */
    setPlayer(weltPos, altitude) { if (weltPos) spielerPos.copy(weltPos); if (altitude != null) spielerAlt = altitude; },
    /** v12 · Orte, um die herumgeflogen wird (Vulkane). Der Wirt kennt sie — siehe Kommentar oben. */
    setSperrzonen,
    get sperrzonen() { return sperren.length; },
    /** PRÜFHAKEN (kein Spielweg): Gegner `i` an die Einheitsnormale `n` mit Kurs `kurs` setzen. Damit
     *  lässt sich das Umfliegen deterministisch messen, statt darauf zu warten, dass einer zufällig
     *  einen Vulkan streift — die Abnahme vom 3.9. hat 480 Bilder gewartet und nichts gesehen. */
    _pruefSetze(i, n, kurs) {
      const g = gegner[i]; if (!g || !n) return false;
      g.qPosition.copy(quaternionFromSurfaceNormal(n.x, n.y, n.z));
      if (kurs != null) g.heading = kurs;
      g.zustand = 'lebt'; g.jagt = false;
      const fr = tangentFrame(g.qPosition);
      const boden = surfaceAltitudeAt(seed, terrainType, fr.up.x, fr.up.y, fr.up.z);
      g.basisHoehe = boden + GEGNER_QUELLE.bodenAbstand + 0.05; g.altitude = g.basisHoehe;
      return true;
    },
    _pruefLese(i) {
      const g = gegner[i]; if (!g) return null;
      const fr = tangentFrame(g.qPosition);
      const boden = surfaceAltitudeAt(seed, terrainType, fr.up.x, fr.up.y, fr.up.z);
      return { n: fr.up.clone(), altitude: g.altitude, agl: g.altitude - boden, jagt: g.jagt, heading: g.heading };
    },
    /** Die zwei Rückrufe des Vertrags. `onTreffer(g, kill)` je Treffer, `onAbschuss(g)` beim Kill. */
    setHandlers(h) { onTreffer = (h && h.onTreffer) || null; onAbschuss = (h && h.onAbschuss) || null; },
    update(dt) {
      if (!P.on) { group.visible = false; return; }
      group.visible = true;
      zeit += dt;
      for (const g of gegner) {
        if (g.zustand === 'wartet') {
          g.respawnT = Math.max(0, g.respawnT - dt);
          if (g.respawnT <= 0) respawn(g, false);
          continue;
        }
        if (g.zustand === 'stuerzt') { sturzUpdate(g, dt); continue; }
        lebendUpdate(g, dt);
      }
      for (const mx of mixer) mx.update(dt);
    },
    /**
     * **Der Treffer-Vertrag.** Ein Schuss ist das Segment `vorher → jetzt` EINES Bildes; geprüft
     * wird gegen eine Kugel um den Gegner (1:1 `segmentHitsSphere`). Rückgabe = der getroffene
     * Gegner oder `null`; der Aufrufer entscheidet, ob sein Projektil verbraucht ist.
     * Genau hier hängt „gefährlich" später an: dieselbe Funktion, andere Richtung.
     */
    treffer(vorher, jetzt) {
      if (!P.on) return null;
      const r = trefferRadius();
      for (const g of gegner) {
        if (g.zustand !== 'lebt') continue;
        if (!segmentTrifftKugel(vorher, jetzt, g.weltPos, r)) continue;
        g.leben--;
        stat.treffer++;
        const kill = g.leben <= 0;
        if (kill) {
          g.zustand = 'stuerzt';
          g.sturzT = GEGNER_QUELLE.sturzDauer;
          stat.abschuesse++;
          if (onAbschuss) { try { onAbschuss(g); } catch (e) {} }
        } else {
          g.wackelAmp = GEGNER_QUELLE.wackelAmp;
          g.wackelPhase = 0;
        }
        if (onTreffer) { try { onTreffer(g, kill); } catch (e) {} }
        return { gegner: g, pos: g.weltPos.clone(), kill, leben: g.leben };
      }
      return null;
    },
    /**
     * **Zielhilfe (Chill-Mode).** Sucht den lebenden Gegner, der am nächsten an der Schussachse
     * liegt — innerhalb eines Kegels. Gibt eine Richtung zurück oder `null`; der Runner biegt
     * damit den Schuss. `zielhilfeGrad = 0` heißt „aus", und das ist keine Sonderregel, sondern
     * das Ergebnis der Rechnung.
     */
    imKegel(origin, richtung) {
      if (!P.on || P.zielhilfeGrad <= 0) return null;
      const cosMax = Math.cos(P.zielhilfeGrad * Math.PI / 180);
      let best = null, bestCos = cosMax;
      for (const g of gegner) {
        if (g.zustand !== 'lebt') continue;
        _p.copy(g.weltPos).sub(origin);
        const d = _p.length();
        if (d < 1e-4 || d > P.zielhilfeWeite) continue;
        const c = _p.divideScalar(d).dot(richtung);
        if (c > bestCos) { bestCos = c; best = g; }
      }
      if (!best) return null;
      stat.zielhilfeTreffer++;
      return { gegner: best,
               dir: _q.copy(best.weltPos).sub(origin).normalize().clone(),
               grad: +(Math.acos(Math.min(1, bestCos)) * 180 / Math.PI).toFixed(1) };
    },
    /** Nächster lebender Gegner (für HUD/Erzähler). */
    naechster(weltPos) {
      let best = null, bd = 1e9;
      for (const g of gegner) {
        if (g.zustand !== 'lebt') continue;
        const d = g.weltPos.distanceTo(weltPos);
        if (d < bd) { bd = d; best = g; }
      }
      return best ? { gegner: best, abstand: bd } : null;
    },
    setAnzahl() { /* absichtlich nicht: die Modelle werden asynchron geladen, ein Neuaufbau
                     mitten im Laden wäre zwei Wahrheiten über eine Welt. Anzahl ist ein
                     Startparameter (`?gegner=N`). */ },
    /**
     * ⚠ **Die durchfallbare Zahl.** Fünf Aussagen, alle brechbar:
     *  · jeder Gegner hat ein Modell UND einen Animationsclip (ein starrer Gegner ist ein Fehler,
     *    kein Stil — und er sieht wie ein vergessenes Prop aus)
     *  · jeder lebende Gegner hält den Bodenabstand der Quelle (0,20)
     *  · das Höhenband liegt in 0,52…0,65 (Quelle) — sonst schweben sie im Nichts
     *  · der Trefferradius steht im Verhältnis zur sichtbaren Größe (1 = Modellhöhe)
     *  · erreichbar: das Höhenband liegt über der Reiseflughöhe, also MUSS der Spieler steigen —
     *    die Zahl sagt, um wie viel (das ist die Lehre aus dem Portal, hier vorher gemessen)
     */
    tor(camera) {
      if (!gegner.length) return { idle: true, text: 'idle · 0 enemies (loading or off)' };
      let ohneClip = 0, zuTief = 0, ausBand = 0, lebt = 0, minAgl = 9, maxAgl = 0;
      let minH = 9e9, maxH = 0, verhMin = 9e9, verhMax = 0;
      for (const g of gegner) {
        if (!g.clips) ohneClip++;
        const h = (g.weltRadius || 0) * 2;
        if (h < minH) minH = h;
        if (h > maxH) maxH = h;
        // ⚠ **Das Verhältnis gehört JE GEGNER gegen SEINE eigene Zielhöhe.** Erste Fassung teilte
        // das Minimum über alle Gegner durch `gegner[0].def.h` — also 0,130 (Armabee) durch 0,16
        // (Ghost Skull) und meldete 0,81×, obwohl jeder Gegner exakt seine Absicht erreicht hat.
        // Der Abstand zwischen zwei MODELLSORTEN, ausgegeben als Skalierungsfehler, und zwar in
        // genau der Zeile, die den 68×-Fehler fangen soll. Mit anderer Reihenfolge im Satz hätte
        // dieselbe korrekte Welt „1,23×" gemeldet — **ein Messwert, der von der Sortierung
        // abhängt, misst die Sortierung.**
        const soll = g.def && g.def.h ? g.def.h : 0;
        if (soll > 0 && h > 0) {
          const v = h / soll;
          if (v < verhMin) verhMin = v;
          if (v > verhMax) verhMax = v;
        }
        if (g.zustand !== 'lebt') continue;
        lebt++;
        const fr = tangentFrame(g.qPosition);
        const boden = surfaceAltitudeAt(seed, terrainType, fr.up.x, fr.up.y, fr.up.z);
        const agl = g.altitude - boden;
        if (agl < GEGNER_QUELLE.bodenAbstand - 1e-3) zuTief++;
        // Geprüft wird gegen das Band, das GILT — nicht gegen das der Quelle, wenn ein anderer
        // Modus läuft. Sonst meldet die Zeile einen Fehler, den die Einstellung ausdrücklich will.
        const [tMin, tMax] = band(boden);
        if (g.altitude < tMin - 0.15 || g.altitude > tMax + 0.15) ausBand++;
        if (agl < minAgl) minAgl = agl;
        if (agl > maxAgl) maxAgl = agl;
      }
      const hoehe = (gegner[0].def.h || 0.15);
      const verh = trefferRadius() / hoehe;
      // **Gebaut gegen geplant.** `def.h` ist die ABSICHT; `weltRadius` ist gemessen am Netz. Ein
      // Verhältnis von 0,015 (der 68×-Fehler) oder 20 muss durchfallen — sonst wiederholt die
      // Zeile nur den Plan und meldet grün, während nichts zu sehen ist.
      const gebautMin = minH < 9e9 ? minH : 0;
      const vMin = verhMin < 9e9 ? verhMin : 0, vMax = verhMax;
      const groesseOk = vMin >= 0.4 && vMax <= 2.5;
      // ⚠ **Die Zahl, die aus „wird gezeichnet" ein Urteil macht: Bildschirmhöhe in PIXELN.**
      // Diese Runde hat gekostet, weil beide Seiten mit `readPixels` auf dem Default-Framebuffer
      // gemessen haben — dort liegt das letzte PRÄSENTIERTE Bild, nicht das eigene Probe-Render,
      // und A/B ergibt dann zwangsläufig „identisch". Projektion lügt nicht: Weltgröße, Abstand,
      // Öffnungswinkel, Canvashöhe. Ein Gegner unter 8 px ist unabhängig von jeder Pixelprobe zu
      // klein, und das steht hier als Warnung.
      let schirm = null;
      if (camera && camera.isPerspectiveCamera) {
        let best = null, bd = 1e9;
        for (const g of gegner) {
          if (g.zustand !== 'lebt') continue;
          const d = camera.position.distanceTo(g.weltPos);
          if (d < bd) { bd = d; best = g; }
        }
        if (best && bd > 1e-3) {
          const h = (best.weltRadius || 0) * 2;
          const fovY = camera.fov * Math.PI / 180;
          const px = (h / (2 * bd * Math.tan(fovY / 2)))
                   * ((typeof camera.__canvasH === 'number' && camera.__canvasH > 0)
                      ? camera.__canvasH
                      : (typeof innerHeight === 'number' ? innerHeight : 540));
          schirm = Math.round(px);
        }
      }
      const ok = ohneClip === 0 && zuTief === 0 && ausBand === 0 && groesseOk;
      return { idle: false, ok, gegner: gegner.length, lebend: lebt, ohneClip, zuTief, ausBand,
               aglMin: +minAgl.toFixed(3), aglMax: +maxAgl.toFixed(3),
               gebautMin: +gebautMin.toFixed(3), gebautMax: +maxH.toFixed(3),
               gebautAnteil: [+vMin.toFixed(3), +vMax.toFixed(3)], schirmPx: schirm,
               trefferRadius: +trefferRadius().toFixed(3), trefferVerhaeltnis: +verh.toFixed(2),
               text: (ok ? '✓' : '⚠') + ' ' + gegner.length + ' enemies (' + lebt + ' alive, '
                 + modelle + ' models)'
                 + (ohneClip ? ' · ⚠ ' + ohneClip + ' WITHOUT animation clip' : ' · all animated')
                 + ' · built ' + gebautMin.toFixed(3) + '…' + maxH.toFixed(3) + ' u tall = '
                 + vMin.toFixed(2) + '…' + vMax.toFixed(2) + '× intended PER MODEL'
                 + (groesseOk ? ' (measured on the mesh, not planned)'
                              : ' ⚠ THE MODELS ARE NOT THE SIZE THEY CLAIM — nothing to see')
                 + ' · ' + minAgl.toFixed(2) + '…' + maxAgl.toFixed(2) + ' u above ground'
                 + (P.bandModus === 'quelle'
                     ? ' · band 0.52…0.65 ABSOLUTE (source) — that is '
                       + Math.round(GEGNER_QUELLE.hoeheMin / 0.03) + '× the cruise height, they will sit off-screen'
                     : ' · band ' + P.bandMin.toFixed(2) + '…' + P.bandMax.toFixed(2)
                       + ' u over ground (source spread, relative) · cruise line 0.03, climb reaches 0.52')
                 + (zuTief ? ' ⚠ ' + zuTief + ' TOO LOW' : '')
                 + (ausBand ? ' · ⚠ ' + ausBand + ' outside the band' : '')
                 + ' · hit sphere ' + trefferRadius().toFixed(3) + ' u'
                 + (schirm != null ? ' · nearest one is ' + schirm + ' px tall on screen'
                     + (schirm < 8 ? ' ⚠ barely visible' : '') : '') };
    },
    report() {
      return { an: P.on, gegner: gegner.length, modelle, ohneAnim, stand,
               lebend: gegner.filter((g) => g.zustand === 'lebt').length,
               stuerzend: gegner.filter((g) => g.zustand === 'stuerzt').length,
               wartend: gegner.filter((g) => g.zustand === 'wartet').length,
               jagend: gegner.filter((g) => g.jagt).length,
               treffer: stat.treffer, abschuesse: stat.abschuesse, respawns: stat.respawns,
               zielhilfe: stat.zielhilfeTreffer,
               clips: gegner.map((g) => g.clipName || '—').slice(0, 5) };
    },
    dispose() { group.removeFromParent(); gegner.length = 0; mixer.length = 0; },
  };
}
