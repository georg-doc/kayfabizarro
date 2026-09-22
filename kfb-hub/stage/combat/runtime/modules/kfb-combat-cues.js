/* kfb-combat-cues.js · WANN klingt ein Kampfereignis, und wie heisst es (v1)
 *
 * HERKUNFT
 * Herausgeschnitten aus `KFB Mech Slice v10 Schussbahn.dc.html` (S0, 04.09.2026),
 * wo es als `_audible` / `_cue` / `_ear` plus vier Aufrufstellen im Wirt lag.
 *
 * WAS ES TUT — und was ausdruecklich NICHT
 *   Es entscheidet ZWEI Dinge: ob gerade Ton erlaubt ist, und welchen NAMEN ein
 *   Ereignis traegt. Es mischt nicht, es laedt nicht, es besitzt keinen Kanal und
 *   keinen Hall. Wer spielt, gibt der Wirt herein (`play`) — im Schussstand ist das
 *   die Lagen-Bank, im Travel Globe der `fx-bus` (`fx.fire`). Dieselbe Tabelle,
 *   zwei Wege, eine Wahrheit.
 *
 * ═══ WARUM DAS EIN EIGENES MODUL IST ══════════════════════════════════════════
 * Der Schuss IST eine Kette: abzug · muendung · abgang · treffer · marke. Jeder
 * Kettenpunkt ist ein Ereignisanker. Diese Zuordnung ist Wissen ueber den KAMPF und
 * gehoert damit zum Kampf — nicht zum Tonsystem des jeweiligen Wirts. Genau daran
 * ist es im Schussstand hängengeblieben: die Anker klebten zwischen Physik und
 * Player, und jeder zweite Wirt haette sie nachgebaut.
 *
 * ═══ VIER REGELN, JEDE BEZAHLT ════════════════════════════════════════════════
 *
 * 1 · KEINE UHR IM MODUL. Debounce und Takt laufen auf einer Zeit, die aus `dt`
 *     aufsummiert wird. Der Travel-Wirt verbietet `performance.now()` in `update`
 *     ausdruecklich (PM-50: im verdeckten Tab wird der Bildtakt gedrosselt, ein
 *     Modul mit eigener Uhr misst dann die Aufmerksamkeit des Zuschauers mit).
 *     Der Schussstand braucht es aus einem zweiten Grund: mit einer Wanduhr zeigt
 *     Zuruecklaufen andere Toene als der Hinlauf.
 *
 * 2 · HOECHSTENS DREI EREIGNISSE AUF DEMSELBEN AUGENBLICK (E-29 des Travel-Wirts).
 *     Mehr ist per Definition ein Akkord und keine Kaskade — der Befund dahinter:
 *     beim Kartendurchflug feuerten sechs Ereignisse bei t=0 und keins danach.
 *     Unser Einschlag feuert genau drei: Welt-Einschlag, Bestaetigung, Nachwirkung.
 *     Der vierte wird VERWORFEN UND GEZAEHLT, nie geschluckt (Regel 4 dort).
 *
 * 3 · SPULEN UND ZEITLUPE SIND STUMM, und die Regel gilt fuer JEDEN Pfad. Im
 *     Schussstand hatte ich sie nur vor den Sample-Pfad gesetzt; die Synthese klang
 *     weiter, und nur eine Marke in der Zeitachse hat es verraten. Eine Regel, die
 *     fuer einen von zwei Pfaden gilt, ist keine Regel. Deshalb liegt der Riegel
 *     hier und nicht an den Aufrufstellen.
 *
 * 4 · DAS MODUL SCHREIBT NICHTS ausser seiner eigenen Buchhaltung. Es besitzt
 *     keinen Szenenknoten (`group: null`, siehe `besitzt`), keine Position, keinen
 *     Materialwert. `schreibt: []` ist deshalb leer und pruefbar leer.
 *
 * ═══ VERTRAG ══════════════════════════════════════════════════════════════════
 *   const C = createCombatCues({
 *     play,        // (name, ctx) → truthy = geklungen · PFLICHT
 *     audible,     // () → bool · darf gerade Ton sein? PFLICHT (Wirt besitzt die Antwort)
 *     loopKeep,    // (name, ctx) → truthy · optional, fuer Dauergeraeusche
 *     stopLoops,   // () → void · optional
 *     params
 *   });
 *
 *   C.launch({ weapon, sfx, energy, seed, at })      → { name, gespielt } | null
 *   C.travel({ ammo, trail, arc, at, seed })         → name | null
 *   C.impact({ energy, surface, heavy, at, seed })   → { welt, bestaetigung, nachwirkung, verworfen }
 *   C.update(dt) · C.reset() · C.tor() · C.zeile() · C.abweichungen()
 *
 *   Die Namen sind Daten, nicht Code: `params.namen` traegt die Muster. Ein neuer
 *   Wirt tauscht die Muster, nicht die Logik.
 */

export function createCombatCues(o) {
  const play = (o && o.play) || (() => false);
  const audible = (o && o.audible) || (() => false);
  const loopKeep = (o && o.loopKeep) || null;
  const stopLoops = (o && o.stopLoops) || null;

  const QUELLE = {
    /* Namensmuster. `{x}` wird ersetzt. Im Schussstand sind das Cue-Schluessel des
       Manifests, im Travel Globe Kaskadennamen des fx-bus — dieselben Zeichen. */
    launch: 'launch.{weapon}',
    impact: 'impact.{energy}.{surface}',
    confirm: 'confirm.hit',
    aftermath: 'aftermath.boom',
    /* AUFSETZER — ein Geschoss, das auf dem Boden AUFSETZT, statt einzuschlagen.
       Neu am 05.09. fuer die Augapfel-Munition („fehlschuesse bouncen auf terrain").
       Er hat einen eigenen Anker, weil er WEDER ein Einschlag noch ein Nichts ist:
       den Fehlschuss durch `impact()` zu geben, haette `confirm.hit` am OHR gefeuert
       — die Trefferbestaetigung fuer einen Fehlschuss. Ein falscher Treffer im Ton
       ist schlimmer als kein Ton, deshalb blieb der Aufsetzer zunaechst stumm.
       Er steht am ORT (Raum, Entfernung), nie am Ohr, und traegt KEINE Bestaetigung.
       `{n}` ist die Nummer des Aufsetzers: der erste ist der lauteste, und ein Wirt
       mit gestaffelten Mustern kann das hoeren lassen. */
    hop: 'hop.{surface}',
    travelLoop: 'travel.rocket',
    travelTakt: 'travel.ink',
    /* Debounce je Ereignisname, in Sekunden. 0,07 ist der Wert aus dem Manifest
       (`debounce_ms: 70`) — ein zweiter Einschlag derselben Zelle innerhalb von
       70 ms ist ein Doppelschlag, kein zweites Ereignis. */
    debounce: 0.07,
    /* Takt fuer getaktete Dauergeraeusche (Wurfzischer). 0,26 s aus `takt_ms: 260`. */
    takt: 0.26,
    /* E-29: hoechstens drei auf demselben Augenblick. */
    beats: 3,
    /* Fenster, innerhalb dessen Ereignisse als „derselbe Augenblick" gelten.
       0,09 s ist das Polyphonie-Fenster des Manifests (`fenster_ms: 120`) minus
       Sicherheitsabstand — kuerzer, weil wir vor dem Player entscheiden, nicht in ihm. */
    fenster: 0.09
  };
  const P = Object.assign({}, QUELLE, (o && o.params) || {});

  let t = 0;                       // Modulzeit, ausschliesslich aus `dt`
  const letzte = new Map();        // name → Modulzeit des letzten Klangs
  const takte = new Map();         // name → Modulzeit des letzten Takts
  let fenster = [];                // Zeitstempel der letzten Ereignisse
  const zaehler = { gespielt: 0, debounced: 0, verworfen: 0, stumm: 0, loops: 0, dtRufe: 0, dtVerworfen: 0 };
  /* STILLE DARF EIN ERGEBNIS SEIN, ABER NIE EIN UNBEMERKTES (docs/BEFUND_audio-pfade.md:
     „Eine Zeile in der Konsole haette das hier am ersten Tag beendet"). */
  let taktGemeldet = false;

  const name = (muster, v) => String(muster).replace(/\{(\w+)\}/g, (_, k) => (v && v[k] != null ? String(v[k]) : k));

  /* Ein Ereignis kommt durch, wenn drei Fragen mit ja beantwortet sind: darf
     ueberhaupt Ton sein, ist dieser Name nicht gerade eben erst geklungen, und ist
     im Augenblick noch Platz. Jede Ablehnung wird GEZAEHLT. */
  function feuer(n, ctx, dkey) {
    /* Feuert ein Ereignis, ohne dass der Wirt je getaktet hat, ist dieses Modul
       faktisch tot: `t` bleibt 0, also ist `t - letzte < debounce` fuer jeden
       wiederkehrenden Namen dauerhaft wahr und `fenster` wird nie geleert — nach
       drei Ereignissen laeuft das Beat-Budget fuer immer ueber. Kein Fehler, kein
       Log, nur Stille. Also EINE Zeile, einmal. (Verifier-Fund 04.09.)
       Kein Rueckfall auf eine eigene Uhr: die ist im Wirt-Vertrag verboten, und
       ein stiller Ersatztakt waere genau die Tarnung, die hier gerade auffiel. */
    if (!zaehler.dtRufe && !taktGemeldet) {
      taktGemeldet = true;
      console.warn('[combat-cues] Ereignis ohne Takt: `update(dt)` wurde nie gerufen. '
        + 'Die Modulzeit bleibt 0, deshalb fallen alle weiteren Ereignisse in Debounce '
        + 'und Beat-Budget. Der Wirt muss `update(dt)` je Schritt rufen.');
    }
    if (!audible()) { zaehler.stumm++; return false; }
    /* DER DEBOUNCE-SCHLUESSEL IST NICHT IMMER DER NAME. Normalerweise schon: ein
       zweiter Einschlag derselben Zelle in 70 ms ist ein Doppelschlag. Eine FOLGE
       gleichartiger Ereignisse ist aber etwas anderes — drei Aufsetzer eines
       huepfenden Geschosses sind drei Ereignisse, auch wenn sie denselben Cue
       tragen. Wer eine Folge meint, gibt seinen eigenen Schluessel (05.09.). */
    const dk = dkey || n;
    const l = letzte.get(dk);
    if (l != null && t - l < P.debounce) { zaehler.debounced++; return false; }
    fenster = fenster.filter((x) => t - x < P.fenster);
    if (fenster.length >= P.beats) { zaehler.verworfen++; return false; }
    const ok = play(n, ctx || {});
    if (!ok) return false;
    letzte.set(dk, t);
    fenster.push(t);
    zaehler.gespielt++;
    return true;
  }

  return {
    name: 'kfb-combat-cues',
    /* Kein Szenenknoten, und das ist eine AUSSAGE, keine leere Kiste. Ein leerer
       Group-Knoten waere unsichtbare Abwesenheit — genau das, was die Regel
       „Fehlen ist sichtbar, nicht still" verbietet. */
    group: null,
    besitzt: 'nichts in der Szene · nur eigene Buchhaltung',
    schreibt: [],
    params: P,
    quelle: QUELLE,

    /* ---------- Die Anker: abzug · abgang · treffer · marke · aufsetzer --- */
    /* ANKER `abzug`. `sfx` ist der Kurzname aus dem Waffenblatt (pop, thump, zap);
       traegt die Waffe ihn, gewinnt er, weil der Wirt ihn auf seinen Namensraum
       abbildet. Sonst wird der Name gebaut. Kein zweiter Namensraum hier. */
    launch(w) {
      const n = (w && w.sfx) || name(P.launch, w);
      return { name: n, gespielt: feuer(n, { seed: w && w.seed, at: w && w.at }) };
    },

    /* ANKER `abgang`. Ein Triebwerk haelt einen Dauerton, ein geworfener Schuss
       zischt getaktet. Die Unterscheidung kommt aus dem Waffenblatt (`arc`), nicht
       aus einem Waffennamen — eine neue Bogenwaffe braucht hier keine Zeile. */
    travel(w) {
      /* TOR-1-FUND beim Verdrahten (04.09.): erste Fassung schloss aus fehlendem
         Bogen auf ein Triebwerk — damit haette der Stinger einen Schubloop bekommen,
         weil er auch keinen Bogen fliegt. Eine Waffe ohne Spur hat kein
         Reisegeraeusch, und DAS ist die Aussage, nicht der Umkehrschluss.
         Genau dafuer gibt es Tor 1: eigenstaendig war das Modul richtig, im Wirt
         war es falsch. */
      const bogen0 = !!(w && w.arc);
      const triebwerk = !!(w && w.trail) && !bogen0;
      if (!bogen0 && !triebwerk) return null;
      if (!audible()) { zaehler.stumm++; if (stopLoops) stopLoops(); return null; }
      const bogen = !!(w && w.arc);
      if (!bogen && loopKeep) {
        const n = P.travelLoop;
        if (loopKeep(n, { at: w && w.at })) { zaehler.loops++; return n; }
        return null;
      }
      const n = P.travelTakt;
      const l = takte.get(n);
      if (l != null && t - l < P.takt) return null;
      takte.set(n, t);
      return feuer(n, { seed: w && w.seed, at: w && w.at }) ? n : null;
    },

    /* ANKER `treffer` und `marke`. DREI Ereignisse, in dieser Reihenfolge und mit
       Grund: der Welt-Einschlag steht am ORT (mit Entfernung), die Bestaetigung am
       OHR (ohne Raum), die Nachwirkung nur bei schweren Waffen. Die Reihenfolge ist
       die Rangfolge — laeuft das Fenster voll, faellt die Nachwirkung zuerst, weil
       sie die schwaechste Aussage traegt. */
    impact(h) {
      const welt = name(P.impact, h);
      const r = { welt: null, bestaetigung: null, nachwirkung: null, verworfen: 0 };
      const v0 = zaehler.verworfen;
      if (feuer(welt, { at: h && h.at, seed: h && h.seed })) r.welt = welt;
      if (feuer(P.confirm, { seed: h && h.seed })) r.bestaetigung = P.confirm;
      if (h && h.heavy && feuer(P.aftermath, { at: h.at, seed: h.seed })) r.nachwirkung = P.aftermath;
      r.verworfen = zaehler.verworfen - v0;
      return r;
    },

    /* ANKER `aufsetzer`. EIN Ereignis, am Ort, ohne Bestaetigung — und mit eigenem
       Debounce-Namen je Aufsetzernummer, damit drei Aufsetzer in Folge nicht als
       Doppelschlag durchfallen (0,99 / 1,52 / 1,76 s liegen weit auseinander, aber
       ein weicher Boden kann sie auch dichter legen). */
    hop(h) {
      const n = name(P.hop, h);
      const r = { welt: null, verworfen: 0 };
      const v0 = zaehler.verworfen;
      if (feuer(n, { at: h && h.at, seed: h && h.seed }, n + '#' + ((h && h.n) || 0))) r.welt = n;
      r.verworfen = zaehler.verworfen - v0;
      return r;
    },

    /* ---------- Takt ------------------------------------------------------ */
    /* `dt` WIRD GEPRUEFT, NICHT KASCHIERT. Erste Fassung stand `t += (dt || 0)` —
       und `NaN || 0` ist 0, also wurde ein NaN-dt STILL geschluckt, waehrend die
       Torzeile darueber genau diesen Schutz versprach. Ein negatives dt wurde sogar
       aufsummiert und hat damit jeden Debounce- und Takt-Vergleich verschoben.
       Verworfene dt werden GEZAEHLT, nie geschluckt — dieselbe Regel wie fuer
       verworfene Ereignisse, und ein verworfenes dt hat groessere Folgen als ein
       verworfener Ton. (Verifier-Fund 04.09.: von drei kaputten Werten wurde einer
       geschluckt, einer akzeptiert, einer gefangen.) */
    update(dt) {
      zaehler.dtRufe++;
      if (typeof dt === 'number' && isFinite(dt) && dt >= 0) { t += dt; return; }
      zaehler.dtVerworfen++;
    },
    reset() {
      letzte.clear(); takte.clear(); fenster = [];
      if (stopLoops) stopLoops();
    },

    /* ---------- Bericht und Tor ------------------------------------------ */
    stats() { return Object.assign({ zeit: +t.toFixed(2) }, zaehler); },
    abweichungen() {
      const out = [];
      for (const k in QUELLE) if (QUELLE[k] !== P[k]) out.push({ feld: k, quelle: String(QUELLE[k]), ist: String(P[k]) });
      return out;
    },
    zeile() {
      const ab = this.abweichungen();
      return 'combat-cues · ' + zaehler.gespielt + ' geklungen · ' + zaehler.debounced + ' zu schnell · '
        + zaehler.verworfen + ' verworfen · ' + zaehler.stumm + ' stumm · '
        + (ab.length ? ab.length + ' Wert(e) abweichend' : 'Werte wie gemessen');
    },
    tor() {
      const z = []; let ok = 0, von = 0, nm = 0;
      const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
      const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };
      /* INFORMATION, KEIN URTEIL (§5: `kind: 'info'`). Eine Zeile, die nicht fallen
         kann, zaehlt nicht mit — sonst schoent das Instrument sein eigenes
         Verhaeltnis. Verifier-Fund 04.09. am Schwestermodul: das Tor meldete 5/5,
         gemessen waren vier. */
      const info = (s2) => { z.push('· ' + s2); };

      pruef(this.group === null && this.schreibt.length === 0,
        'besitzt nichts und schreibt nichts (' + this.besitzt + ')',
        'beansprucht ' + this.schreibt.length + ' Feld(er), erwartet 0');

      /* Die Beat-Grenze ist die eine Zahl, an der dieses Modul scheitern kann.
         Gemessen wird das FENSTER, nicht die Absicht. */
      const imFenster = fenster.filter((x) => t - x < P.fenster).length;
      pruef(imFenster <= P.beats,
        imFenster + ' von hoechstens ' + P.beats + ' Ereignissen im Augenblick',
        imFenster + ' Ereignisse im Fenster, erlaubt ' + P.beats + ' \u2014 das ist ein Akkord');

      /* Ein verworfener Beat MUSS gezaehlt sein. Ist die Zahl 0 und es lief nie ein
         Fenster voll, ist das nicht messbar statt gut. */
      if (zaehler.gespielt + zaehler.verworfen + zaehler.debounced + zaehler.stumm === 0) offen('noch kein Ereignis gelaufen');
      else info('Buchhaltung: ' + zaehler.gespielt + ' geklungen, ' + zaehler.verworfen
        + ' verworfen, ' + zaehler.debounced + ' zu schnell, ' + zaehler.stumm + ' stumm');

      /* Diese Zeile faellt jetzt fuer BEIDE Todesarten: kaputtes dt (NaN, negativ,
         unendlich) UND ueberhaupt kein dt. Der zweite Fall war der stille. */
      const ereignisse = zaehler.gespielt + zaehler.verworfen + zaehler.debounced + zaehler.stumm;
      if (!ereignisse && !zaehler.dtRufe) offen('Takt: noch kein Ereignis und noch kein dt');
      else pruef(zaehler.dtRufe > 0 && zaehler.dtVerworfen === 0 && isFinite(t) && t >= 0,
        'Modulzeit ' + t.toFixed(2) + ' s aus ' + zaehler.dtRufe + ' dt-Rufen, 0 verworfen',
        (zaehler.dtRufe === 0
          ? 'NIE GETAKTET: 0 dt-Rufe bei ' + ereignisse + ' Ereignissen'
          : zaehler.dtVerworfen + ' von ' + zaehler.dtRufe + ' dt-Werten verworfen (NaN, negativ oder unendlich)')
        + ' — Modulzeit steht bei ' + String(t));

      const ab = this.abweichungen();
      info('Regler: ' + ab.length + ' von ' + Object.keys(QUELLE).length + ' Werten abweichend');

      return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
               text: 'combat-cues: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
    },

    /* Fuer das Tor, das zwei Namenslisten vergleicht (Vorschlag 5 an WIRT v14):
       welche Namen kann dieses Modul ueberhaupt feuern? Ein Wirt kann damit pruefen,
       ob seine Kaskadentabelle sie alle kennt — statt es beim ersten Schuss zu merken. */
    namen(energien, oberflaechen, waffen) {
      const out = new Set([P.confirm, P.aftermath, P.travelLoop, P.travelTakt]);
      for (const w of (waffen || [])) out.add(name(P.launch, { weapon: w }));
      for (const e of (energien || [])) for (const s of (oberflaechen || [])) out.add(name(P.impact, { energy: e, surface: s }));
      return Array.from(out);
    }
  };
}
