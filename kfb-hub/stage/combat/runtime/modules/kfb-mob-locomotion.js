/* kfb-mob-locomotion.js · Boden- und Flugbewegung fuer Gegner und Spielfiguren (v1, 04.09.2026)
 *
 * WAS ES TUT
 * Es beantwortet EINE Frage je Koerper und Bild: welchen VERSATZ hat er gegenueber
 * seiner Ruhelage, wie ist er gedreht, und welche Clip-Rolle laeuft dabei mit
 * welchem Tempo. Vier Haltungen: `stand` · `lauf` (Boden) · `hover` · `flug` (Luft).
 *
 * ═══ DREI REGELN, JEDE AUS EINEM FEHLER DIESES ZWEIGS ═════════════════════════
 *
 * 1 · DAS MODUL SCHREIBT KEINE POSITION. Es gibt den Versatz heraus (`offset`),
 *     der Wirt addiert ihn auf die Ruhelage. Dieselbe Regel wie in
 *     `kfb-hit-response.js` — dort war der Knockback nie am Mesh angekommen, weil
 *     sein einziger Leser hinter einer fremden Bedingung stand. Eine Groesse mit
 *     zwei Schreibern hat keinen.
 *
 * 2 · KEINE UHR, KEIN ZUFALL. Alles ist eine reine Funktion aus Modulzeit `t`
 *     (aus `dt` aufsummiert) und der Phase des Koerpers. Der Schussstand spult Bild
 *     fuer Bild vor UND zurueck: eine Bewegung mit `Math.random` oder
 *     `performance.now()` waere danach eine andere Bewegung, und der
 *     Determinismus-Vergleich (Bild 60 → 200 → 60) wuerde luegen. Deshalb ist
 *     `reset()` vollstaendig: t = 0 heisst Ausgangslage.
 *
 * 3 · EIN KAPUTTES `dt` WIRD VERWORFEN UND GEZAEHLT, nie geschluckt. `t += dt || 0`
 *     schluckt NaN still (Verifier-Fund am Schwestermodul), und ein negatives dt
 *     verschiebt jede Phase. Das Tor faellt fuer beide Todesarten — kaputtes dt UND
 *     ueberhaupt kein dt.
 *
 * ═══ WARUM DIE BAHN QUER ZUR SCHUSSBAHN LIEGT ═════════════════════════════════
 * Laufen und Fliegen sind nur sichtbar, wenn sie NICHT auf der Schussachse liegen:
 * ein Ziel, das auf den Schuetzen zulaeuft, veraendert nur seine Groesse. Die
 * Pendelachse ist deshalb Z (quer), und damit bekommt der Stand kostenlos etwas,
 * das er vorher nicht hatte: der Schuss muss VORHALTEN, und eine Marke auf einem
 * bewegten Ziel beweist M12 (sie reist mit oder sie ist falsch).
 *
 * ═══ WAS AUSDRUECKLICH FEHLT ══════════════════════════════════════════════════
 * Das Schrittmass der Cube-Monster ist NICHT gemessen (in `KFB Academy 01` steht,
 * wie das geht: Standfuss-Drift im Clip). Die Clip-Rate ist deshalb an das
 * Bodentempo GEKOPPELT (`refSpeed` = Tempo, bei dem die Rate 1,0 ist), nicht
 * kalibriert. `zeile()` sagt das, damit niemand „Schritt-Sync" liest, wo
 * „Kopplung" steht.
 *
 * VERTRAG
 *   const L = createLocomotion({ THREE, params });
 *   L.set(key, { pose, h, phase })   · Koerper anmelden/umstellen (idempotent)
 *   L.drop(key) · L.reset()
 *   L.update(dt) (Zweitname: step)   · genau EINMAL je Simulationsschritt
 *   L.offset(key) → { x, y, z, yaw, roll, rolle, rate, luft }
 *   L.zeile() · L.tor() · L.stats()
 */

export function createLocomotion(o) {
  const THREE = o && o.THREE;

  const QUELLE = {
    /* Boden: 3,2 u Weg (± 1,6 quer), 3,4 s je Hin-und-Her. Auf 12 u Bahn ist das
       rund ein Viertel der Bildbreite — sichtbar, ohne aus dem Bild zu laufen. */
    laufAmp: 1.6, laufDauer: 3.4, laufBob: 0.035, refSpeed: 3.0,
    /* Schweben: klein und langsam. Ein Flieger, der auf der Stelle wippt, darf
       nicht huepfen — 0,12 u bei 2,6 s ist Atem, nicht Sprung. */
    hoverAmp: 0.12, hoverDauer: 2.6, hoverDrift: 0.25,
    /* Flug: dieselbe Querachse, dazu Steigen/Sinken auf der doppelten Frequenz
       (eine flache Acht) und Rollen IN die Kurve, nicht dagegen. */
    flugAmp: 1.9, flugDauer: 3.0, flugHub: 0.42, flugRoll: 0.30,
    /* Ein Laeufer in der Luft hat keinen Flugzyklus (siehe kfb-monster-roster):
       er bekommt mehr Bob, damit „schwebt" nicht wie „eingefroren" aussieht. */
    ersatzBob: 0.09
  };
  const P = Object.assign({}, QUELLE, (o && o.params) || {});

  const bodies = new Map();
  let t = 0;
  const zaehler = { dtRufe: 0, dtVerworfen: 0, gesetzt: 0, abfragen: 0 };

  const TAU = Math.PI * 2;
  const vec = () => (THREE ? new THREE.Vector3() : { x: 0, y: 0, z: 0 });

  /* Die gemessene Tabelle (KFB Academy 02) und ihr Nachschlagewerk. `null` heisst
     „nicht kalibriert" und wird als solches berichtet, nicht als 3,0 getarnt. */
  let kal = null, kalN = 0;
  /* ═══ DER CLIP FOLGT DEM TEMPO ═════════════════════════════════════════════
     Georgs Einwand, und er beendet einen Umweg: „pets haben ja auch walk & run
     animations". Richtig — und damit ist die Frage nicht mehr, wie schnell ein Pet
     laufen DARF, sondern welcher Clip zu seiner Geschwindigkeit gehoert.
     Gemessen (Academy 02): walk traegt 1,03 u/s, run traegt 4,13 u/s. Der entworfene
     Laufweg hat im Scheitel 2,96 u/s — das liegt ZWISCHEN beiden. Ein Pet, das mit
     3 u/s ueber den Boden geht, soll nicht mit rasenden Beinen GEHEN, es soll
     RENNEN. Genau das war der Fehler: es gab nur einen Clip, also musste er alles
     tragen.
     Der UEBERGANG ist gerechnet, nicht geraten: das geometrische Mittel der beiden
     Bezugstempi (√(1,03 · 4,13) = 2,06 u/s) ist der Punkt, an dem der Gehclip
     genauso stark ueberdreht ist wie der Rennclip untertourig laeuft. Darunter
     gehen, darueber rennen — und in einem Fenster um diesen Punkt WEICH ueberblendet,
     weil ein Umschalten mitten im Schritt ein Sprung waere.
     Zustandslos gerechnet (kein Fade-Zustand, keine Uhr): dieselbe Zeit ergibt
     dieselbe Mischung, also bleibt das Zuruecklaufen bitgleich. */
  const uebergang = (b) => {
    const w = b.refSpeed, r = b.runSpeed;
    if (!w || !r || r <= w) return null;
    return Math.sqrt(w * r);
  };
  const tempoVon = (id, art) => {
    if (!kal || !kal.modelle || !id) return null;
    const e = kal.modelle[id];
    const c = e && e[art || 'walk'];
    if (!c || !isFinite(c.tempo) || c.tempo <= 0) return null;
    return c.tempo;
  };

  /* Die Phase haengt am NAMEN, nicht am Zufall: zwei gleichzeitig gesetzte Koerper
     sollen nicht im Gleichschritt laufen, und beim Zuruecklaufen muss dieselbe
     Phase wieder herauskommen. FNV-1a ueber den Schluessel — dieselbe Hauskonvention
     wie bei der Prop-Streuung (`prop-scatter.js`). */
  function phaseOf(key) {
    let h = 0x811c9dc5;
    for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
    return (h % 1000) / 1000 * TAU;
  }

  function calc(b, tt) {
    /* JEDER KOERPER HAT SEINE EIGENE UHR. Vorher gab es eine gemeinsame `t`, und
       damit war „dieser eine haelt kurz an" nicht ausdrueckbar — genau das braucht
       aber ein Treffer: die Bewegung des Getroffenen muss stehen, sonst gleitet er
       waehrend der Verformung weiter und der Einschlag liest sich als Delle in
       einem Manoever statt als Anschlag (Georgs Befund „gleitet nach treffer zu
       seiner rechten seite/oben — statt nach hinten in schussbahn-richtung").
       `t` bleibt die Weltuhr fuer Phasen und Vorhersagen; `b.t` ist die gefahrene
       Zeit DIESES Koerpers. */
    const t2 = (tt == null) ? (b.t == null ? t : b.t) : tt;
    const out = { x: 0, y: 0, z: 0, yaw: 0, roll: 0, rolle: 'idle', rate: 1, luft: false };
    const ph = b.phase;
    if (b.pose === 'lauf') {
      /* Die Zykluszeit ist eine BILDentscheidung und bleibt entworfen: 3,2 u Weg in
         3,4 s sind rund ein Viertel der Bahn, also sichtbar. Was sich nach der
         Messung richtet, ist der CLIP — Herleitung an `uebergang`. */
      const dauer = P.laufDauer;
      const w = TAU / dauer;
      const s = Math.sin(w * t2 + ph);
      out.z = P.laufAmp * s;
      const vz = P.laufAmp * w * Math.cos(w * t2 + ph);      // u/s, quer
      /* Blickrichtung IN die Laufrichtung. Der Wirt dreht das Modell ohnehin um
         -90° auf den Schuetzen; `yaw` ist der Zuschlag, also ±90° zur Bahn. */
      out.yaw = (vz >= 0 ? 1 : -1) * Math.PI * 0.5;
      /* Fussfall auf der DOPPELTEN Frequenz und nur nach oben (|sin|): ein Bob, der
         unter die Standhoehe geht, laesst die Fuesse im Boden verschwinden. */
      out.y = Math.abs(Math.sin(2 * (w * t2 + ph))) * P.laufBob * (b.h || 1);
      /* GEMESSEN SCHLAEGT GEKOPPELT, und mit ZWEI Clips wird aus der Rate eine
         Mischung. `mix` 0 = nur gehen, 1 = nur rennen. Das Fenster um den Uebergang
         ist eine halbe Oktave breit (Faktor √2 nach oben und unten) — schmaler
         waere ein Umschalten, breiter ein Dauerzustand aus halb und halb. */
      const tempo = Math.abs(vz);
      const wRef = b.refSpeed || P.refSpeed;
      const rRef = b.runSpeed || null;
      const u = uebergang(b);
      let mix = 0;
      if (u) {
        const k = Math.log(Math.max(0.01, tempo / u)) / Math.log(Math.SQRT2);
        mix = Math.max(0, Math.min(1, 0.5 + k * 0.5));
      }
      out.mix = +mix.toFixed(4);
      out.rateWalk = Math.max(0.25, Math.min(2.2, tempo / wRef));
      out.rateRun = rRef ? Math.max(0.25, Math.min(2.2, tempo / rRef)) : 1;
      out.rolle = mix >= 0.5 ? 'run' : 'walk';
      out.rate = mix >= 0.5 ? out.rateRun : out.rateWalk;
      out.refSpeed = wRef;
      out.runSpeed = rRef;
      out.uebergang = u ? +u.toFixed(3) : null;
      out.kalibriert = !!b.refSpeed;
    } else if (b.pose === 'hover') {
      const w = TAU / P.hoverDauer;
      const amp = (b.echt ? P.hoverAmp : P.ersatzBob) * (b.h || 1);
      out.y = Math.sin(w * t2 + ph) * amp;
      out.z = Math.sin(w * 0.5 * t2 + ph * 1.7) * P.hoverDrift;
      out.rolle = b.echt ? 'fly' : 'idle';
      out.rate = b.echt ? 0.85 : 1;
      out.luft = true;
    } else if (b.pose === 'flug') {
      const w = TAU / P.flugDauer;
      const a = w * t2 + ph;
      out.z = P.flugAmp * Math.sin(a);
      out.y = P.flugHub * Math.sin(2 * a) * (b.echt ? 1 : 0.5)
        + (b.echt ? 0 : Math.sin(a * 3) * P.ersatzBob * 0.5);
      const vz = P.flugAmp * w * Math.cos(a);
      out.yaw = (vz >= 0 ? 1 : -1) * Math.PI * 0.5;
      /* Rollen IN die Kurve: das Vorzeichen haengt an der BESCHLEUNIGUNG (−sin),
         nicht an der Geschwindigkeit — sonst legt sich der Koerper am Wendepunkt
         falsch, und genau dort sieht man es. */
      out.roll = -Math.sin(a) * P.flugRoll * (b.echt ? 1 : 0.4);
      out.rolle = b.echt ? 'fly' : 'idle';
      out.rate = b.echt ? 1.1 : 1;
      out.luft = true;
    } else {
      out.rolle = 'idle';
      out.luft = false;
    }
    return out;
  }

  return {
    id: 'kfb-mob-locomotion',
    version: '1.0.0',
    /* Absichtlich KEIN Szenenknoten: das Modul bewegt fremde Koerper und besitzt
       nichts. `group: null` plus Grund statt eines leeren Group-Knotens — ein leerer
       Knoten ist unsichtbare Abwesenheit (Vorschlag 1 an WIRT v14). */
    group: null,
    besitzt: 'nichts in der Szene — es rechnet Versaetze, der Wirt schreibt sie',
    schreibt: [],
    quelle: QUELLE,
    params: P,

    set(key, spec) {
      spec = spec || {};
      const b = bodies.get(key) || { phase: phaseOf(key) };
      b.pose = spec.pose || b.pose || 'stand';
      b.h = spec.h == null ? (b.h == null ? 1 : b.h) : spec.h;
      /* `echt` = der Koerper hat den Clip fuer diese Haltung wirklich (Roster).
         Fehlt er, uebernimmt die Bewegung mehr Arbeit — das ist die einzige Stelle,
         an der der Ersatz etwas KOSTET, und er ist damit sichtbar. */
      if (spec.echt != null) b.echt = !!spec.echt;
      if (spec.phase != null) b.phase = spec.phase;
      /* Die Modell-Kennung ist der Schluessel in die gemessene Tabelle. Ohne sie
         bleibt der Koerper auf dem gekoppelten Vorgabewert — und `zeile()` zaehlt
         ihn als unkalibriert, statt ihn stillschweigend mitzurechnen. */
      if (spec.id != null) b.modelId = spec.id;
      b.refSpeed = tempoVon(b.modelId, 'walk');
      b.runSpeed = tempoVon(b.modelId, 'run');
      if (b.t == null) b.t = t;
      if (b.gate == null) b.gate = 1;
      bodies.set(key, b);
      zaehler.gesetzt++;
      return b;
    },
    drop(key) { bodies.delete(key); },
    reset() { t = 0; for (const [, b] of bodies) b.t = 0; },
    /* EIN WIRT, DER ZWISCHEN DEN SCHUESSEN WEITERLEBT, braucht einen ANKER statt
       einer Null. Der Schussstand nimmt eine Aufnahme (Bild 0 bis 92) und laesst
       sie zuruecklaufen; wuerde `reset()` dabei auf 0 stellen, spraenge ein
       fliegendes Ziel bei jedem Feuern in die Bahnmitte zurueck (Georgs Befund
       „erst bei erneutem feuern kehrt das ziel zur position zurueck"). Also merkt
       der Wirt sich die Uhrzeit des Bandanfangs und stellt SIE wieder her: gleiches
       Band, gleiche Zahlen, und dazwischen laeuft die Bewegung weiter. */
    zeitSetzen(v) { if (isFinite(v) && v >= 0) { t = v; for (const [, b] of bodies) b.t = v; } return t; },
    /* DIE BREMSE FUER EINEN EINZELNEN KOERPER, 0 = steht, 1 = volle Fahrt. Der
       Treffer setzt sie, nicht das Modul: WER wie hart getroffen wurde, weiss nur
       der Wirt. Sie liegt hier, weil die Zeit hier liegt — ein Wirt, der stattdessen
       `update(dt)` mit kleinerem dt ruft, wuerde BEIDE Koerper bremsen. */
    /* ═══ KALIBRIERUNG (05.09.2026) ══════════════════════════════════════════
       Die Clip-Rate war GEKOPPELT: `refSpeed` 3,0 u/s = Rate 1,0, und das Modul
       sagte in seiner eigenen Zeile, dass das nicht kalibriert ist. KFB Academy 02
       misst das Schrittmass je Modell (Standfuss-Drift im Clip) und schreibt
       `schrittmass.json`. Hier kommt sie herein.
       DREI DINGE, DIE DABEI WICHTIG SIND:
       1 · Je KOERPER, nicht global. Ein Bunny und ein Elefant haben verschiedene
           Schritte; ein gemeinsamer Wert waere die alte Vermutung mit mehr Stellen.
       2 · FEHLEN IST SICHTBAR. Ein Modell ohne Eintrag behaelt den gekoppelten
           Vorgabewert, und `zeile()` sagt, wie viele Koerper kalibriert sind.
           Ein stiller Rueckfall waere genau die Tarnung, die hier schon einmal
           aufgefallen ist.
       3 · NUR `walk.tempo`. Der Befund der Academy: die 21 Cube-Monster haben
           KEINE Beine, ihr `Walk` ist ein Wippen. Fuer sie liefert die Datei
           `walkHub` statt `walk` — und dieser Schluessel wird hier ABSICHTLICH
           nicht gelesen. Ein Hub ist keine Strecke; wer ihn als Tempo einsetzt,
           erfindet eine Zahl. */
    kalibrieren(tab) {
      kal = null;
      if (!tab || !tab.modelle) return { gelesen: 0, quelle: null };
      kal = tab;
      let n = 0;
      for (const id in tab.modelle) {
        const e = tab.modelle[id];
        if (e && e.walk && isFinite(e.walk.tempo) && e.walk.tempo > 0) n++;
      }
      kalN = n;
      /* Schon angemeldete Koerper nachziehen: die Reihenfolge von `set` und
         `kalibrieren` ist Sache des Wirts und darf das Ergebnis nicht aendern. */
      for (const [, b] of bodies) if (b.modelId) { b.refSpeed = tempoVon(b.modelId, 'walk'); b.runSpeed = tempoVon(b.modelId, 'run'); }
      return { gelesen: n, quelle: tab.quelle || null, gemessen: tab.gemessen || null };
    },
    kalibrierung() { return kal ? { quelle: kal.quelle, gemessen: kal.gemessen, modelle: kalN } : null; },

    gate(key, f) {
      const b = bodies.get(key);
      if (!b) return 1;
      if (f != null && isFinite(f)) b.gate = Math.max(0, Math.min(1, f));
      return b.gate;
    },
    clear() { bodies.clear(); t = 0; },

    update(dt) {
      if (!(isFinite(dt) && dt >= 0)) { zaehler.dtVerworfen++; return; }
      zaehler.dtRufe++;
      t += dt;
      for (const [, b] of bodies) b.t = (b.t == null ? t : b.t) + dt * (b.gate == null ? 1 : b.gate);
    },
    step(dt) { this.update(dt); },

    offset(key) {
      const b = bodies.get(key);
      zaehler.abfragen++;
      if (!b) return { x: 0, y: 0, z: 0, yaw: 0, roll: 0, rolle: 'idle', rate: 1, luft: false };
      return calc(b);
    },
    /* DIE BEWEGUNG IST VORHERSAGBAR, also darf ein Wirt sie FRAGEN: `offsetAt` gibt
       den Versatz zu einem beliebigen Zeitpunkt. Genau das braucht ein Vorhalt —
       ohne ihn fliegt jeder Schuss hinter ein laufendes Ziel, und der Stand koennte
       an einem bewegten Ziel keinen Einschlag mehr zeigen. Reine Funktion, kein
       Zustand: `t` bleibt unberuehrt. */
    offsetAt(key, tAbs) {
      const b = bodies.get(key);
      zaehler.abfragen++;
      if (!b || !isFinite(tAbs)) return this.offset(key);
      return calc(b, tAbs);
    },
    zeit(key) {
      if (key == null) return t;
      const b = bodies.get(key);
      return b && b.t != null ? b.t : t;
    },
    /** Bequemlichkeit fuer three-Wirte: derselbe Versatz als Vector3. */
    offsetVec(key, into) {
      const o = this.offset(key), v = into || vec();
      v.set ? v.set(o.x, o.y, o.z) : (v.x = o.x, v.y = o.y, v.z = o.z);
      return v;
    },
    pose(key) { const b = bodies.get(key); return b ? b.pose : null; },

    stats() { return Object.assign({ zeit: +t.toFixed(3), koerper: bodies.size }, zaehler); },
    abweichungen() {
      const out = [];
      for (const k in QUELLE) if (QUELLE[k] !== P[k]) out.push({ feld: k, quelle: QUELLE[k], ist: P[k] });
      return out;
    },
    zeile() {
      const ab = this.abweichungen();
      /* WAS DIE ZEILE SAGEN MUSS: nicht „kalibriert" oder „nicht kalibriert" als
         Zustand des Moduls, sondern WIE VIELE Koerper einen gemessenen Bezug haben.
         Ein Wirt mit zwei Koerpern, von denen einer gemessen ist, ist genau das —
         und nicht das eine oder das andere. */
      let mit = 0;
      for (const [, b] of bodies) if (b.refSpeed) mit++;
      const k = kal
        ? ('Schrittmass GEMESSEN: ' + mit + '/' + bodies.size + ' Koerper aus ' + kalN + ' Eintraegen ('
           + (kal.gemessen || 'ohne Datum') + ') · Clip folgt dem Tempo (walk/run, Uebergang am geometrischen Mittel)')
        : ('Clip-Rate GEKOPPELT (' + P.refSpeed + ' u/s = 1,0×), Schrittmass nicht kalibriert');
      return 'mob-locomotion · ' + bodies.size + ' Koerper · Modulzeit ' + t.toFixed(2) + ' s aus ' + zaehler.dtRufe + ' dt-Rufen · '
        + k + ' · ' + (ab.length ? ab.length + ' Wert(e) abweichend' : 'Werte wie entworfen');
    },
    tor() {
      const z = []; let ok = 0, von = 0, nm = 0;
      const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
      const info = (s) => { z.push('\u00b7 ' + s); };
      const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };

      pruef(this.group === null && this.schreibt.length === 0,
        'besitzt nichts und schreibt nichts (' + this.besitzt + ')',
        'beansprucht ' + this.schreibt.length + ' Feld(er), erwartet 0');

      /* Die Zeile, die fallen MUSS, wenn jemand eine Uhr oder einen Zufall
         einbaut: dieselbe Zeit muss denselben Versatz ergeben. Gemessen an einem
         echten Koerper, nicht behauptet. */
      const key = bodies.keys().next().value;
      if (!key) offen('kein Koerper angemeldet — Determinismus nicht pruefbar');
      else {
        const a = this.offset(key);
        const zwischen = this.offsetAt(key, t + 1.234);
        const b2 = this.offset(key);
        const gleich = ['x', 'y', 'z', 'yaw', 'roll'].every((k) => Math.abs(a[k] - b2[k]) < 1e-12);
        pruef(gleich, 'derselbe Zeitpunkt ergibt denselben Versatz (bit-gleich), und die Vorhersage laesst die Uhr in Ruhe',
          'Versatz driftet: ' + JSON.stringify(a) + ' gegen ' + JSON.stringify(b2));
        info('Probe ' + key + ': z ' + a.z.toFixed(3) + ' → ' + zwischen.z.toFixed(3) + ' in 1,234 s (Vorhalt liest das)');
      }

      if (!zaehler.abfragen && !zaehler.dtRufe) offen('Takt: noch kein dt und keine Abfrage');
      else if (zaehler.dtVerworfen > 0) pruef(false, '', zaehler.dtVerworfen + ' von ' + zaehler.dtRufe + ' dt-Werten verworfen (NaN, negativ, unendlich) — Modulzeit steht bei ' + String(t));
      else if (!zaehler.dtRufe) {
        /* KEIN FEHLALARM IM RUHEZUSTAND (Verifier-Fund 04.09.). Die erste Fassung
           liess das Tor fallen, sobald Versaetze abgefragt wurden, ohne dass je ein
           dt kam — und genau das IST der Ruhezustand des Wirts: der Schussstand
           fragt bei jedem Bild ab, taktet aber nur im Simulationsschritt (also nur
           waehrend eines Schusses). Damit schlug das Instrument, das den stillen Tod
           fangen soll, im Normalbetrieb an. Ein Fehlalarm ist schlimmer als kein
           Alarm, weil er den echten unhoerbar macht (Runde 10).
           Das Modul kann „Schuss laeuft" nicht wissen — also ist „noch nie getaktet"
           hier NICHT MESSBAR, nicht falsch. Wer den Takt beweisen will, liest die
           Modulzeit: der Wirt zeigt sie in der HUD-Zeile ZIEL. */
        offen('noch nie getaktet (' + zaehler.abfragen + ' Abfragen) — im Ruhezustand normal, ein Schuss muss dt bringen');
      }
      else pruef(isFinite(t) && t >= 0,
        'Modulzeit ' + t.toFixed(2) + ' s aus ' + zaehler.dtRufe + ' dt-Rufen, 0 verworfen',
        'Modulzeit ist kein brauchbarer Wert: ' + String(t));

      /* Ein Bob, der unter die Standhoehe geht, laesst Fuesse im Boden
         verschwinden — die Zeile prueft die Untergrenze ueber eine ganze Periode. */
      let tiefster = 0;
      const laeufer = Array.from(bodies.keys()).filter((k) => bodies.get(k).pose === 'lauf');
      if (!laeufer.length) offen('kein laufender Koerper — Bodenkontakt nicht pruefbar');
      else {
        for (let i = 0; i < 60; i++) tiefster = Math.min(tiefster, this.offsetAt(laeufer[0], t + i * (P.laufDauer / 60)).y);
        pruef(tiefster >= -1e-9, 'Laufbob bleibt auf oder ueber Standhoehe (min ' + tiefster.toFixed(4) + ')',
          'Laufbob geht ' + tiefster.toFixed(3) + ' u unter die Standhoehe — Fuesse im Boden');
      }

      info('Haltungen: ' + Array.from(bodies.keys()).map((k) => k + '=' + bodies.get(k).pose + (bodies.get(k).echt === false ? '(Ersatz)' : '')).join(' · ') || 'keine');
      return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
               text: 'mob-locomotion: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
    }
  };
}
