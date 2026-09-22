/* kfb-weapon-eyeball.js · Cartoon-Augaepfel als Munition (v1, 04.09.2026)
 *
 * AUFTRAG (Georg, 04.09.): „als waffe (oder auch scouting feature/gimmick) wuerde
 * ich gerne noch cartoon-eyeballs bauen: wir nehmen die pet studio eyeballs, mit
 * pupille, ohne lider als munition; kleine regenbogenfarbige kreise als trail;
 * zerplatzen bei impact; fehlschuesse bouncen auf terrain, bevor sie faden".
 *
 * ═══ VIER ZUSAGEN, VIER MESSBARE DINGE ══════════════════════════════════════
 *   Geschoss   Augapfel + Pupille, KEINE Lider — Rezept aus dem Studio (unten)
 *   Spur       kleine Kreise, Farbton wandert je Puff (Regenbogen als SWEEP)
 *   Einschlag  zerplatzen: Pupille zerfaellt in Scherben, Weiss spritzt
 *   Fehlschuss huepft auf dem Boden und verblasst dann — kein Verschwinden
 *
 * ═══ WOHER DAS AUGE KOMMT ════════════════════════════════════════════════════
 * Aus dem Studio, und zwar IMPORTIERT statt abgeschrieben: `eyeballParts()` in
 * `studio-v3/pet-eye-rig.v5.js` liefert Augapfel- und Pupillengeometrie samt
 * Materialien; der Rig setzt sie mit Lidern zusammen, dieses Geschoss ohne.
 * v1 hatte die Zahlen kopiert (f3ede2, 070707, cap = 0.12 + pupilSize*0.62) und die
 * Schuld nur BENANNT. Am 05.09. ist sie getilgt: das Rezept steht einmal, an seiner
 * Quelle, und wer dort den Glanz aendert, aendert ihn auch hier. Der EyeRig selbst
 * bleibt unbenutzbar — er baut ZWEI Augen und sucht seinen Anker auf den
 * Kopfschalen eines geladenen Pet-GLB. Ein Geschoss hat keinen Kopf.
 * FOLGE, ausdruecklich: diese Waffe haengt an den Studio-Dateien. Sind sie nicht
 * erreichbar, faellt das Modul ganz aus (die Bootzeile sagt es) — und das ist
 * richtig, denn dann fehlen auch die Pet-Gesichter. Ein eigener Rueckfall waere die
 * Kopie, die hier gerade weggeraeumt wurde.
 *
 * ═══ WARUM NICHT IN `kfb-combat-def.js` ═════════════════════════════════════
 * Dieselbe Begruendung wie beim Wuerfel: das Datenmodul ist geteiltes Gut (v8 liest
 * es). Eine Waffe, die in v8 nie im Bild war, gehoert nicht in v8s Waffenraum. Die
 * Waffe liegt bei ihrem Geschoss, der Wirt mischt die Raeume.
 *
 * VERTRAG
 *   WEAPONS · AMMO                    · Daten in der Form von kfb-combat-def.js
 *   const E = createEyeballAmmo({ THREE, params });
 *   E.mesh(w)                         · Group: Augapfel + Pupille (schaut nach -X)
 *   E.trail(emit, at, i, rng)         · ein Regenbogenkreis, Farbton nach `i`
 *   E.pop(emit, at, nrm, size, rng)   · Zerplatzen am Einschlag
 *   E.hue(i)                          · der Farbton als Hex (fuer Wirt-Marken)
 *   E.zeile() · E.tor() · E.stats()
 */

import { eyeballParts, eyeballCap } from '../studio-v3/pet-eye-rig.v5.js';

/* Nur noch fuer die Spritzer-Farben: die Materialien kommen aus dem Studio. */
const WEISS = 0xf3ede2, PUPILLE = 0x070707;

export const WEAPONS = {
  eyeball: {
    name: 'Augapfel', kind: 'SPEZIAL', note: 'Regenbogenspur · zerplatzt · Fehlschuss hüpft',
    /* MITTLERES TEMPO MIT ECHTEM BOGEN. Ein Augapfel ist leicht und weich: langsam
       genug, dass die Regenbogenspur eine Strecke hat, auf der sie sichtbar wird,
       und mit einem Bogen, der ihn wieder auf den BODEN bringt — sonst gibt es
       keinen Aufsetzer, und der Aufsetzer ist die halbe Waffe. */
    /* GERECHNET, NICHT GESCHAETZT (Sonde 04.09., und die erste Fassung war falsch).
       v1 hatte 34 u/s bei Bogen 0,45. Der Loeser nimmt die FLACHE Loesung: 9,7°
       Abgang, Scheitel bei t = 0,67 s — und die Bahn verlaesst den Stand bei x = 22
       schon nach 0,84 s, also WAEHREND SIE NOCH STEIGT. Ein Fehlschuss konnte den
       Boden damit nie beruehren; gemessen kam er als „daneben 867" heraus, und die
       Zusage „Fehlschuesse huepfen" war unerfuellbar in den Zahlen selbst.
       24 u/s bei Bogen 2,0 (g = 38) ergeben 36,3° Abgang, Scheitel bei 0,37 s knapp
       vor dem Ziel, Bodenkontakt bei 0,86 s rund 4,6 u HINTER dem Ziel — auf dem
       Streifen und im Bild. Flugzeit zum Ziel 0,62 s: bei 0,045 s Puffabstand also
       rund vierzehn Regenbogenkreise. Ein Wurf, kein Schuss — und das ist die
       ehrlichere Bewegung fuer einen geworfenen Augapfel. */
    rate: 1.1, dmg: 14, speed: 24, clip: 'Shoot_Small',
    arc: 2.0, spreadA: 0.012, kick: 0.03, heft: 0.35,
    /* `wet` ist die Energieklasse des Zerplatzens (dieselbe wie Acid): das
       Zellprofil waehlt damit einen Spritzer statt eines Funkens, und der
       Regenbogen aus `pop()` legt sich darauf. `kinetic` haette Splitter gegeben —
       ein Auge splittert nicht. */
    energy: 'wet',
    color: 0xf3ede2, flash: 0xffffff, ammo: 'eye', sfx: 'splat',
    muz: 'blast', muzMs: 55, muzSize: 0.7,
    /* Die vier Zusagen als DATEN, damit der Wirt sie nicht erraet: `trail` ohne
       Rauchband (das ist der Regenbogen), `bounce` = wie oft ein Fehlschuss
       aufsetzt, `fade` = wie lange er danach noch da ist. */
    bounce: 3, bounceKeep: 0.52, fadeMs: 420,
    ant: 0.05, tumble: false, eyes: true
  }
};

export const AMMO = {
  eye: { form: 'Augapfel: Studio-Rezept ohne Lider, Pupille schaut in Flugrichtung', len: 0.42, wid: 0.42, px: 15, layers: 2 }
};

export function createEyeballAmmo(o) {
  const THREE = o && o.THREE;
  if (!THREE) throw new Error('kfb-weapon-eyeball: THREE fehlt');

  const QUELLE = {
    /* 0,42 u: zwischen Nadel (0,3) und Wuerfel (0,52). Auf 12 u Bahn projiziert
       das rund 15 px — die Pupille bleibt damit als Form erkennbar, und genau das
       ist die ganze Pointe der Waffe. Kleiner ist ein Punkt. */
    R: 0.21,
    /* 0,62 uebernommen aus dem Studio-Vorgabewert `pupilSize` fuer die grossen
       Cartoon-Augen: cap = 0.12 + 0.62*0.62 = 0.504 rad, also gut ein Drittel der
       Halbkugel. Ein Geschoss braucht MEHR Pupille als ein Gesicht: es ist klein
       und dreht sich, die Pupille muss aus jeder Lage lesbar bleiben. */
    pupilSize: 0.62,
    /* Die Segmentzahlen stehen NICHT mehr hier: sie sind Teil des Rezepts und
       kommen aus `eyeballParts`. Ein Regler, der eine fremde Zahl nur nachbetet,
       ist eine zweite Wahrheit mit Bedienoberflaeche. */
    /* Regenbogen als SWEEP, nicht als Zufall: 0,06 Farbton je Puff ergibt auf acht
       Puffen knapp die Haelfte des Kreises — ein Verlauf, den man als Regenbogen
       liest. Zufaellige Farbtoene sahen wie Konfetti aus, nicht wie eine Spur. */
    hueStep: 0.06,
    /* ═══ DIE FARBE MUSS DIE MISCHUNG UEBERLEBEN ═══════════════════════════
       VERIFIER-FUND 05.09., und es ist der teuerste Fehler dieser Waffe: die Kreise
       liefen ADDITIV (`add: true`) ueber den hellen Sandboden (`adb68b`, also
       0,68/0,71/0,55). Additiv heisst summieren, und eine Summe auf so hellem Grund
       clippt in allen drei Kanaelen gegen 1,0 — gemessen fiel die Saettigung von
       0,72 VOR der Mischung auf 0,02–0,12 DANACH. Die 24 Farbtoene lagen in den
       Daten und kamen nie auf den Schirm: eine Kette blasser weisser Ringe.
       Dieselbe Doktrin steht eine Datei weiter in `kfb-fx-flame.js` (der Rauch
       bekommt seine Farbe VOM WIRT, „weil nur er seinen Untergrund kennt") — hier
       war sie nicht angewendet.
       NORMALE Mischung haelt den Farbton, dafuer muss der Kreis gegen den Sand
       ABDUNKELN: Helligkeit 0,42 statt 0,6, Saettigung 0,95 statt 0,85, Deckung
       nahe eins. Gegen den dunklen Himmel verliert er dadurch Helligkeitskontrast,
       nicht aber den Farbton — und der Sand ist der schlechtere Fall, weil die
       Wurfbahn aus dieser Kamera fast vollstaendig darueber liegt. */
    sat: 0.95, lig: 0.42, kreisAdd: false,
    /* ═══ DIE SPUR, ZWEITER ENTWURF ═══════════════════════════════════
       Georgs Befund war richtig und die Ursache waren VIER Entscheidungen, die sich
       gegenseitig verstaerkt haben: eine einzige Groesse, `pop` (Groesse sofort da,
       also keine Bewegung im Kreis selbst), WACHSEND statt schrumpfend, und ein
       fester ZEITtakt. Zusammen ergibt das genau eine Perlenschnur — gleiche Perlen,
       gleicher Abstand, kein Leben.
       Was eine Spur zu einer Spur macht, ist der VERLAUF: sie ist am Geschoss dick
       und wird nach hinten duenn, sie loest sich auf, und sie sitzt nicht auf einer
       Linie. Also:
         Groesse   je Kreis gewuerfelt (0,62–1,17 ×), damit keine zwei gleich sind
         Schrumpf  `size1` KLEINER als `size` → jeder Kreis laeuft auf null zu, und
                   weil die hinteren aelter sind, entsteht die Verjuengung von selbst
         Streuung  quer zur Flugachse, sonst liegen sie auf einer Schnur
         Drift     kleine Eigengeschwindigkeit nach aussen: die Spur BLUEHT auf,
                   statt zu stehen (und das ist die fehlende Animation)
         Abstand   nach STRECKE, nicht nach Zeit — sonst haengt die Dichte am Tempo,
                   und in Zeitlupe waere es eine andere Spur
         Rhythmus  jeder dritte Kreis bekommt einen kleinen Begleiter im naechsten
                   Farbton: ein Puls statt eines Metronoms */
    kreisGross: 0.34,      // Grundgroesse; × Wuerfel unten
    kreisWurf: [0.62, 1.17],
    kreisSchrumpf: 0.32,   // size1 = size × dies → negatives `grow`, also Verjuengung
    kreisLeben: 0.36,
    kreisOp: 0.95,
    kreisStreu: 0.085,     // u quer zur Bahn
    kreisDrift: 0.6,       // u/s nach aussen
    kreisAbstand: 0.2,     // u Strecke je Kreis (der Wirt liest das)
    kreisPuls: 3,          // jeder n-te bekommt einen Begleiter
    /* Zerplatzen: das WEISS spritzt (mehr, groesser, blass), die PUPILLE zerfaellt
       (weniger, kleiner, dunkel) — zwei Stoffe, zwei Wolken. Ein Auge, das in einer
       einzigen Farbe zerplatzt, ist ein Ballon. */
    popWeiss: 7, popPupille: 5, popRegen: 9,
    popSpeed: 5.5, popLeben: 0.36
  };
  const P = Object.assign({}, QUELLE, (o && o.params) || {});

  const cap = eyeballCap(P.pupilSize);
  let teile = null;
  const zaehler = { gebaut: 0, spur: 0, platzer: 0, huepfer: 0, mitAchse: 0, puls: 0 };
  /* Den Untergrund kennt nur der Wirt (Doktrin aus `kfb-fx-flame.js`). Er meldet ihn
     mit jedem Puff; gemerkt wird er, damit `tor()` gegen ihn RECHNEN kann statt die
     Absicht zu pruefen. Ohne Meldung ist die Farbe „nicht messbar" — nicht „ok". */
  let letzterGrund = null;

  /* GLOSSY-GOOGLY, nicht matte-cute: ein geschossener Augapfel ist der Gag, und der
     Gag braucht Glanz. `gloss` 0,7 ergibt im Studio-Rezept 0,053 Clearcoat-Rauheit
     auf der Pupille — dieselbe Kurve, die die Cartoon-Augen der Pets tragen. */
  const bauTeile = () => {
    if (!teile) teile = eyeballParts(THREE, { R: P.R, cap: cap, googly: true, gloss: 0.7 });
    return teile;
  };

  const hueHex = (i) => {
    const c = new THREE.Color();
    c.setHSL(((i * P.hueStep) % 1 + 1) % 1, P.sat, P.lig);
    return c.getHex();
  };

  return {
    id: 'kfb-weapon-eyeball',
    version: '1.0.0',
    group: null,
    besitzt: 'zwei Geometrien (Augapfel, Pupille) — die Meshes gehoeren dem Wirt',
    schreibt: [],
    quelle: QUELLE,
    params: P,
    WEAPONS: WEAPONS,
    AMMO: AMMO,

    /** Ein Augapfel. Material JE Geschoss (ein geteiltes Material laesst alle
        gleichzeitig verblassen — v5-Befund, hier genauso gueltig). */
    mesh(w) {
      const T = bauTeile();
      const grp = new THREE.Group();
      /* Geometrie GETEILT (sie wird nicht angefasst), Material JE GESCHOSS — ein
         geteiltes Material liesse alle liegenden Augaepfel gleichzeitig verblassen
         (v5-Befund an den Wuerfeln). Die Waffenfarbe darf den Augapfel toenen, die
         Pupille bleibt die des Studios. */
      const matW = T.matW.clone();
      if (w && w.color) matW.color.set(w.color);
      const matP = T.matP.clone();
      const ball = new THREE.Mesh(T.geoBall, matW);
      ball.castShadow = true;
      const pu = new THREE.Mesh(T.geoPupil, matP);
      /* Die Pupille sitzt auf -X, weil `_poseAmmo` die Gruppe mit -X in die
         Flugrichtung dreht (Wirt-Konvention, siehe dort: „X folgt der
         Flugrichtung", Kuppe im Nullpunkt, Koerper nach -X). */
      pu.rotation.y = -Math.PI / 2;
      grp.add(ball); grp.add(pu);
      grp.userData = { ammo: 'eye', roll: true };
      zaehler.gebaut++;
      return grp;
    },

    hue: hueHex,

    /** EIN Kreis der Spur (mit Begleiter auf jedem dritten). `i` ist die laufende
        Nummer, nicht die Zeit — so haengt die Farbe an der STRECKE und nicht am
        Bildtakt, und Zeitlupe zeigt denselben Regenbogen wie Echtzeit.
        `o.dir` ist die Flugrichtung: ohne sie gibt es kein „quer zur Bahn", also
        keine Streuung und keinen Drift — dann bleibt eine Kette, und das sagt
        `tor()` an, statt es zu verschweigen. */
    trail(emit, at, o) {
      if (!emit) return null;
      o = o || {};
      const i = o.i || 0;
      const r = o.rng || Math.random;
      const vecv = o.vecv;
      const d = o.dir;
      zaehler.spur++;
      if (d) zaehler.mitAchse++;

      /* Zwei Querachsen aus der Flugrichtung: eine waagerecht, eine senkrecht dazu.
         Damit ist die Streuung eine SCHEIBE um die Bahn und keine Linie. */
      let px = 0, py = 1, pz = 0, qx = 0, qy = 0, qz = 1;
      if (d) {
        const L = Math.hypot(d.x, d.z) || 1;
        qx = -d.z / L; qz = d.x / L; qy = 0;                  // waagerecht quer
        px = -d.y * qz; py = d.x * qz - d.z * qx; pz = d.y * qx;   // d × q
        const PL = Math.hypot(px, py, pz) || 1;
        px /= PL; py /= PL; pz /= PL;
      }
      const a = (r() - 0.5) * 2, b = (r() - 0.5) * 2;
      const off = P.kreisStreu;
      const pos = { x: at.x + (qx * a + px * b) * off, y: at.y + (qy * a + py * b) * off, z: at.z + (qz * a + pz * b) * off };
      const w0 = P.kreisWurf[0], w1 = P.kreisWurf[1];
      const gr = P.kreisGross * (w0 + r() * (w1 - w0));
      const drift = P.kreisDrift;
      if (o.grund != null) letzterGrund = o.grund;
      const mk = (groesse, hue, leben, opf) => emit('ring', o.vec ? o.vec(pos) : pos, {
        color: hue, size: groesse, size1: groesse * P.kreisSchrumpf,
        life: leben, add: P.kreisAdd, op: opf, fade: 1.35,
        rot: r() * 6.283, spin: (r() - 0.5) * 2.4,
        /* KEIN `pop`: der Kreis soll seine Groesse DURCHLAUFEN. `pop` setzt 85 %
           im ersten Bild — genau das liess ihn wie einen Stempel aussehen. */
        vel: vecv ? vecv((qx * a + px * b) * drift, (qy * a + py * b) * drift + 0.35, (qz * a + pz * b) * drift) : null,
        drag: 1.9, grav: -0.25
      });
      const s = mk(gr, hueHex(i), P.kreisLeben * (0.82 + r() * 0.45), P.kreisOp);
      if (P.kreisPuls && i % P.kreisPuls === 0) {
        zaehler.puls++;
        mk(gr * 0.46, hueHex(i + 1), P.kreisLeben * 0.7, P.kreisOp * 0.75);
      }
      return s;
    },

    /** ZERPLATZEN. Drei Wolken in einer Reihenfolge, die man lesen kann: Weiss
        spritzt nach aussen, Pupillenscherben bleiben naeher, Regenbogen darueber.
        `vecv` ist die VEKTORFABRIK des Wirts — GEMESSENER FUND (Sonde 04.09.):
        erste Fassung gab `vel` als Objektliteral `{x,y,z}` heraus. Der Sprite-Pool
        rechnet damit `s.vel.multiplyScalar(...)` und starb mit „not a function" —
        mitten im Schrittloop, also war nach dem ersten Platzer die ganze Simulation
        hin. Dieselbe Falle hat `kfb-fx-flame` mit `vec`/`vecv` geloest; ohne Fabrik
        wird hier OHNE `vel` ausgestossen (sichtbar, nur ohne Wurf) statt zu
        sterben — ein fehlendes Detail ist kein Grund fuer einen Absturz. */
    pop(emit, at, nrm, size, rng, vecv) {
      if (!emit) return 0;
      const r = rng || Math.random;
      const s = size || 1;
      let n = 0;
      const wurf = (dir, sp) => {
        if (!vecv) return null;
        const j = () => (r() - 0.5) * 2;
        return vecv(dir.x * sp + j() * sp * 0.55, dir.y * sp + Math.abs(j()) * sp * 0.5 + 1.2, dir.z * sp + j() * sp * 0.55);
      };
      for (let k = 0; k < P.popWeiss; k++) {
        emit('smoke', at, {
          color: WEISS, size: s * 0.3, size1: s * 0.62, life: P.popLeben * (0.8 + r() * 0.5),
          op: 0.85, rot: r() * 6.283, spin: (r() - 0.5) * 2,
          vel: wurf(nrm, P.popSpeed), drag: 2.6, grav: 3.4
        });
        n++;
      }
      /* `shard` und nicht `spark`: ein Funke leuchtet, eine SCHERBE bricht. Die
         Pupille ist ein Stueck Material, das zerfaellt — und die Kachel dafuer gibt
         es im Blatt (Reihenfolge: burst star puff spark | splat ring streak shard). */
      for (let k = 0; k < P.popPupille; k++) {
        emit('shard', at, {
          color: PUPILLE, size: s * 0.16, size1: s * 0.1, life: P.popLeben * 0.7,
          op: 1, rot: r() * 6.283,
          vel: wurf(nrm, P.popSpeed * 0.6), drag: 3.2, grav: 6.5
        });
        n++;
      }
      /* Auch hier normal statt additiv — der Einschlag liegt auf dem Ziel oder auf
         dem Sand, und ein Regenbogen, der beim Platzen weiss wird, ist keiner. */
      for (let k = 0; k < P.popRegen; k++) {
        emit('ring', at, {
          color: hueHex(k * 2), size: s * 0.2, size1: s * 0.5, life: P.popLeben * 1.1,
          add: P.kreisAdd, op: 0.95, pop: true, rot: r() * 6.283,
          vel: wurf(nrm, P.popSpeed * 0.85), drag: 2.2, grav: -0.4
        });
        n++;
      }
      zaehler.platzer++;
      return n;
    },

    /** Ein Aufsetzer: kleine Staubwolke plus EIN Regenbogenkreis, damit der Huepfer
        zur Waffe gehoert und nicht wie ein Bodentreffer aussieht. */
    hop(emit, at, nrm, i, rng, vecv) {
      if (!emit) return;
      const r = rng || Math.random;
      zaehler.huepfer++;
      emit('ring', at, { color: hueHex(i), size: 0.3, size1: 0.85, life: 0.3, add: P.kreisAdd, op: 0.9, pop: true, rot: r() * 6.283 });
      emit('smoke', at, {
        color: 0xb9ad90, size: 0.22, size1: 0.6, life: 0.34, op: 0.42, rot: r() * 6.283,
        vel: vecv ? vecv((r() - 0.5) * 1.2, 0.9 + r() * 0.6, (r() - 0.5) * 1.2) : null, drag: 2.4, grav: -0.3
      });
    },

    stats() { return Object.assign({ cap: +cap.toFixed(3), R: P.R }, zaehler); },
    zeile() {
      return 'weapon-eyeball · Studio-Rezept ohne Lider (R ' + P.R + ' u, Pupillenkappe '
        + cap.toFixed(2) + ' rad) · Spur: Kreis je ' + P.kreisAbstand + ' u, Groesse ×'
        + P.kreisWurf[0] + '–' + P.kreisWurf[1] + ', verjuengt auf ×' + P.kreisSchrumpf
        + ', Farbton +' + P.hueStep + ' je Kreis · ' + WEAPONS.eyeball.bounce + ' Aufsetzer, dann '
        + WEAPONS.eyeball.fadeMs + ' ms Verblassen · ' + zaehler.gebaut + ' gebaut, '
        + zaehler.platzer + ' geplatzt, ' + zaehler.huepfer + ' Aufsetzer';
    },

    tor() {
      const z = []; let ok = 0, von = 0, nm = 0;
      const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
      const info = (s) => { z.push('\u00b7 ' + s); };
      const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };

      /* 1 · KEINE LIDER. Georgs Zusage war ausdruecklich „ohne lider" — also wird
         die Teilezahl gezaehlt und nicht behauptet. Der EyeRig baut je Auge fuenf
         Teile (Schale, Pupille, zwei Lider, Wimpern); hier duerfen es zwei sein. */
      const probe = this.mesh(WEAPONS.eyeball);
      pruef(probe.children.length === 2,
        'zwei Teile: Augapfel und Pupille, keine Lider',
        probe.children.length + ' Teile — es haengt etwas am Geschoss, das nicht dazugehoert');

      /* 2 · DIE PUPILLE MUSS SICHTBAR SEIN, sonst ist es eine weisse Kugel. Gemessen
         wird der Kontrast (dieselbe Pruefung wie bei den Wuerfelaugen). */
      const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
      const a = probe.children[0].material.color, b = probe.children[1].material.color;
      const k = (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
      pruef(k >= 4.5, 'Pupille bleibt lesbar: Kontrast ' + k.toFixed(2) + ':1 (Grenze 4,5)',
        'Pupille verschwindet im Augapfel: Kontrast ' + k.toFixed(2) + ':1');

      /* 3 · DER REGENBOGEN MUSS EINER SEIN. Zwei aufeinanderfolgende Puffe muessen
         sich unterscheiden, und acht Puffe muessen einen Bogen ergeben statt zu
         kreisen — 8 × 0,06 = 0,48, also unter einer ganzen Runde. */
      const h0 = hueHex(0), h1 = hueHex(1), h8 = hueHex(8);
      pruef(h0 !== h1 && h0 !== h8 && P.hueStep * 8 < 1,
        'Farbton wandert je Puff und schliesst sich auf acht Puffen nicht (8 \u00d7 ' + P.hueStep + ' = ' + (P.hueStep * 8).toFixed(2) + ')',
        'Farbverlauf kreist oder steht — aus dem Regenbogen wird Konfetti');

      /* 4 · DAS GESCHOSS MUSS IN DIE HITBOX PASSEN. 0,42 u Durchmesser gegen den
         kleinsten Trefferradius im Stand (rund 0,5 u): passt es nicht, waere die
         Waffe unbrauchbar, und das waere kein Balancing, sondern ein Baufehler. */
      pruef(P.R * 2 < 0.5,
        'Durchmesser ' + (P.R * 2).toFixed(2) + ' u unter dem kleinsten Trefferradius (0,50 u)',
        'Durchmesser ' + (P.R * 2).toFixed(2) + ' u — das Geschoss ist groesser als die Hitbox');

      const W = WEAPONS.eyeball;
      pruef(W.arc >= 1.5 && W.bounce > 0,
        'Fehlschuss kann huepfen: Bogen ' + W.arc + ' bringt ihn auf den Boden, ' + W.bounce + ' Aufsetzer',
        'Bogen ' + W.arc + ' ist zu flach — die Bahn verlaesst den Stand im Steigen, es gibt keinen Bodenkontakt');

      if (!zaehler.spur) offen('Spur: noch kein Puff ausgestossen');
      else info('Spur: ' + zaehler.spur + ' Kreise (' + zaehler.puls + ' mit Begleiter), '
        + zaehler.huepfer + ' Aufsetzer, ' + zaehler.platzer + ' Platzer');

      /* ═══ DIE FARBE WIRD NACH DER MISCHUNG GEMESSEN ══════════════════════
         Der eigentliche Fehler der letzten Runde war nicht das `add: true`, sondern
         DIESES TOR: es prüfte `kreisSchrumpf`, `kreisWurf` und `mitAchse` — alles
         Werte VOR dem Rendern — und meldete 7/7, waehrend im Bild eine Kette
         weisser Ringe stand. Ein Tor, das die ABSICHT statt des ERGEBNISSES misst,
         ist genau das Instrument, das die Runde haette fangen sollen.
         Also gerechnet: Kreisfarbe auf den gemeldeten Untergrund gemischt (additiv
         summieren und clippen, normal nach Deckung interpolieren), dann die
         Saettigung des Ergebnisses. Unter 0,30 ist es kein Farbton mehr.
         Kein Untergrund gemeldet = NICHT MESSBAR, nicht „bestanden". */
      if (letzterGrund == null) offen('Farbe gegen den Untergrund: der Wirt hat keinen Untergrund gemeldet');
      else {
        const g = new THREE.Color(letzterGrund);
        const hsl = {};
        let minS = 1, schlecht = 0, proben = 0;
        for (let k = 0; k < 12; k++) {
          const c = new THREE.Color(hueHex(k));
          if (P.kreisAdd) { c.r = Math.min(1, c.r + g.r); c.g = Math.min(1, c.g + g.g); c.b = Math.min(1, c.b + g.b); }
          else { const op = P.kreisOp; c.r = c.r * op + g.r * (1 - op); c.g = c.g * op + g.g * (1 - op); c.b = c.b * op + g.b * (1 - op); }
          c.getHSL(hsl);
          proben++;
          minS = Math.min(minS, hsl.s);
          if (hsl.s < 0.3) schlecht++;
        }
        pruef(schlecht === 0,
          proben + ' Farbtoene halten die Mischung auf #' + g.getHexString() + ' (Saettigung min '
            + minS.toFixed(2) + ', ' + (P.kreisAdd ? 'additiv' : 'normal') + ')',
          schlecht + ' von ' + proben + ' Farbtoenen verblassen auf #' + g.getHexString()
            + ' (Saettigung min ' + minS.toFixed(2) + ') — aus dem Regenbogen wird Weiss');
      }

      /* DIE SPUR DARF KEINE PERLENSCHNUR SEIN — Georgs Befund vom 04.09. („eine
         groesse, keine animation, wie auf perlenschnur"), also steht hier die Zeile,
         die ihn gefangen HAETTE. Drei Eigenschaften, jede einzeln notwendig:
         verjuengen, Groessen streuen, und eine Flugachse haben (ohne sie gibt es
         kein Quer, also keine Streuung im Raum). */
      const schrumpft = P.kreisSchrumpf < 0.8;
      const streut = (P.kreisWurf[1] - P.kreisWurf[0]) >= 0.3;
      const achse = !zaehler.spur || zaehler.mitAchse === zaehler.spur;
      pruef(schrumpft && streut && achse,
        'Spur verjuengt (×' + P.kreisSchrumpf + '), Groessen streuen (×' + P.kreisWurf[0] + '–' + P.kreisWurf[1]
          + ') und liegen um die Flugachse — keine Perlenschnur',
        'Perlenschnur-Gefahr: ' + (schrumpft ? '' : 'kein Schrumpfen · ') + (streut ? '' : 'eine Groesse · ')
          + (achse ? '' : (zaehler.spur - zaehler.mitAchse) + ' Kreise ohne Flugachse'));

      /* AUS DER SCHULD IST EINE PRUEFUNG GEWORDEN (05.09.): v1 konnte hier nur
         MELDEN, dass das Rezept zweimal steht. Jetzt wird gemessen, dass es aus dem
         Studio KOMMT — und zwar an den Werten, nicht am Import: gleiche Grundfarbe
         des Augapfels, gleiche Pupillenfarbe, gleicher Kappenwinkel. Wer im Studio
         etwas anderes einsetzt, faellt hier durch, statt still auseinanderzulaufen. */
      const stud = eyeballParts(THREE, { R: P.R, cap: cap, googly: true, gloss: 0.7 });
      const gleich = stud.matW.color.getHex() === 0xf3ede2
        && stud.matP.color.getHex() === PUPILLE
        && Math.abs(stud.cap - eyeballCap(P.pupilSize)) < 1e-9;
      pruef(gleich,
        'Rezept kommt aus studio-v3/pet-eye-rig.v5.js (eyeballParts) — eine Quelle, zwei Leser',
        'Studio-Rezept weicht ab: Augapfel #' + stud.matW.color.getHexString()
          + ', Pupille #' + stud.matP.color.getHexString() + ', Kappe ' + stud.cap.toFixed(3));

      return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
               text: 'weapon-eyeball: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
    }
  };
}
