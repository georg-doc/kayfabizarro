// ============================================================================
// hud-flight.js — Das HUD reagiert auf den Flug · v5 · Slice G
// ----------------------------------------------------------------------------
// Georg, 29.8.: *„die Flug-Kinetik würde ich gerne dynamisch und mit Deformern animiert mit allen
// 4 UI-Main-Elements für noch mehr Immersion abbilden."*
//
// ── Der KISS-Kern: EIN Signalgeber, vier Leser ───────────────────────────────────────────────
// Die Versuchung ist, vier Reaktionen zu verdrahten. Das wären vier Leser auf `carpet.state` —
// Fehlerklasse 40 (eine Größe ohne Eigentümer), nur in der UI. Vorbild im Projekt ist
// `travel-heat.js`: *EINE normalisierte Zahl, an der jeder Effekt hängt, statt sechs
// Sonderverdrahtungen.* Also schreibt dieses Modul je Bild **vier Zahlen** und sonst nichts:
//
//   --bank   Schräglage, −1 … +1      (aus `carpet.state.bankAngle` / MAX_BANK)
//   --g      Querbeschleunigung, −1…1 (aus der geglätteten Drehrate — die Fliehkraft)
//   --speed  Tempo, 0 … 1            (`carpet.speedRatio`)
//   --hit    Einschlag, 1 → 0        (am EREIGNIS, nicht an einer Uhr)
//
// ── Warum Federn und nicht Interpolation ─────────────────────────────────────────────────────
// Ohne Nachlauf und Überschwinger fühlt sich das HUD **getimed** an, nicht kinetisch (Zielbild,
// Stufe 2). Also Federn zweiter Ordnung — dieselbe Familie wie `pet-kinetics` und `card-carrier`,
// nicht eine dritte Bauform für dasselbe Problem.
//
// ── Warum jede Ecke etwas ANDERES tut ────────────────────────────────────────────────────────
// Reagieren alle vier gleich, wackelt der Bildschirm, und das liest als Fehler. Der Unterschied
// zwischen billig und gut: **die Reaktion folgt daraus, was das Element IST** (Zielbild §S14).
//
//   Wortmarke   ein Blatt, ans Cockpit geklebt   → Gegenrotation mit Nachlauf, Flattern bei Tempo
//   Zahnrad     eine Maschine                    → dreht mit dem Tempo, die Zahl bleibt aufrecht
//   Pop-Würfel  ein Körper in der Ecke           → kippt mit der Schräglage, Squash beim Einschlag
//   Kartendeck  ein Stapel Papier                → fächert in der Kurve nach außen, staucht beim Hit
//
// ⚠ **Grenzen, von Anfang an.** Backlog: „maximal ±1,5° Drehung und ±4 px Versatz bei voller
// Schräglage (π/4), Rückstellzeit ~0,6 s". Zielbild: „1–3° Rotation, 2–6 px Versatz, Squash ≤ 6 %".
// Ein HUD, das sich stark bewegt, wird unlesbar und macht müde — und die Sky-Dice haben gezeigt,
// wie schnell ein Effekt den Gegenstand frisst (0,42 Squash → Riegel statt Würfel).
//
// ⚠ **EIN Schreiber je Element.** Die Wortmarke hat seit v3j eine CSS-Schleife auf `transform`.
// Dieses Modul schreibt NIE auf sie, sondern auf einen **Träger** (`.kfb-slot`) — zwei Elemente,
// zwei Eigentümer. Der Backlog hat vor genau diesem Konflikt gewarnt; die Lösung ist ein Knoten
// und keine Verhandlung.
// ============================================================================

/** Standardwerte. Slice-D-Hausstandard: eingefroren, `abweichungen()` ist die Abnahme. */
export const HUDFLUG_QUELLE = Object.freeze({
  /** Ausschläge bei VOLLER Schräglage (π/4). Aus dem Backlog, nicht erfunden. */
  maxGrad: 1.5,
  maxPx: 4,
  /** Rückstellzeit ~0,6 s → Federkonstante und Dämpfung daraus. */
  stiff: 90,
  damp: 0.80,
  /** Der Einschlag läuft in dieser Zeit aus. */
  hitAbklingS: 0.45,
  /** Squash beim Einschlag, Obergrenze 6 % (Zielbild). */
  hitSquash: 0.06,
  /** Flattern der Wortmarke bei Tempo: Grad je Tempoanteil. */
  flatterGrad: 0.9,
  flatterHz: 7.5,
  /** Auffächern des Kartendecks in der Kurve: Grad je Querkraft. */
  faecherGrad: 2.6,
  /** Wie stark das Zahnrad-Label das Tempo zeigt (nur Anzeige, keine Bewegung). */
  tempoStellen: 0,
  /** Das HUD darf nicht mit dem Bild kippen — hier ist der Notausgang. */
  on: true,
});

/** Feder zweiter Ordnung: Wert plus Geschwindigkeit → Nachlauf und Überschwinger. */
function feder(s, ziel, stiff, damp, dt) {
  s.v += (ziel - s.x) * stiff * dt;
  s.v *= Math.pow(damp, dt * 60);
  s.x += s.v * dt;
}

export function createHudFlight(opts = {}) {
  const P = Object.assign({}, HUDFLUG_QUELLE, opts.params || {});
  const wurzel = opts.root || document.getElementById('tv-hud');
  const maxBank = opts.maxBank || (Math.PI / 4);

  // Vier Federn — eine je Signal, nicht eine je Ecke. Die Ecken sind Leser.
  const fBank = { x: 0, v: 0 }, fG = { x: 0, v: 0 }, fSpeed = { x: 0, v: 0 };
  let hit = 0, t = 0, letzterHit = '—', hits = 0, bilder = 0;

  /** Die Ecken. Jede ist ein Träger (`.kfb-slot`), den DIESES Modul allein beschreibt.
   *
   * ⚠⚠ **Hier stand ein Zwischenspeicher, der `null` FÜR IMMER behalten hat — und er hat zwei
   * von vier Ecken stillgelegt, während der Selbsttest daneben „4/4" meldete.** Zwei Fehlerarten
   * in einer Zeile (`if (ecken[name] !== undefined) return ecken[name];`):
   *
   *  1. **Negativ zwischengespeichert.** `createHudFlight()` läuft im Verdrahtungsblock, und die
   *     nächste Zeile ruft `selbsttest()` → `ecken()` → `ecke('gear')` — **rund 30 Zeilen bevor
   *     das Zahnrad gebaut ist.** Damit war `null` festgeschrieben, und keine spätere
   *     Markierung konnte es je einlösen. Das ist PM-73 eine Ebene tiefer: ich habe die
   *     Reihenfolge des `markiere`-Aufrufs korrigiert und den Zwischenspeicher stehen gelassen.
   *  2. **Positiv zwischengespeichert, aber der Knoten war weg.** Der Wiedereinhänger baut
   *     Leinwand, Wortmarke und Tastenlegende neu; die zwischengespeicherte Wortmarke war danach
   *     ein **abgehängter** Knoten. Ein Schreibzugriff darauf wirft nicht — er landet nur nirgends.
   *
   * *Beide Fälle sehen im Bild gleich aus: „der Effekt ist zu schwach." Und der Selbsttest, den
   * ich GEGEN genau diese Verwechslung gebaut habe, prüfte auf Existenz statt auf VERBUNDENHEIT —
   * er hat also mitgelogen.*
   *
   * Deshalb: **Zwischenspeicher mit Nachprüfung.** Ein Knoten gilt nur, solange er im Dokument
   * hängt (`isConnected`); sonst wird neu gesucht. Kostet eine Abfrage je Bild und Ecke im
   * schlechtesten Fall, und das ist der Preis dafür, dass eine stumme Nichtreaktion unmöglich wird.
   */
  const ecken = {};
  function ecke(name) {
    const merk = ecken[name];
    if (merk && merk.isConnected) return merk;
    const el = document.querySelector('.kfb-slot[data-slot="' + name + '"]');
    ecken[name] = el || null;
    return ecken[name];
  }

  function setzen(el, transform) { if (el) el.style.transform = transform; }

  return {
    name: 'hud-flight', params: P, quelle: HUDFLUG_QUELLE,

    /**
     * Der Einschlag-Impuls. **Am EREIGNIS, nicht an einer Uhr** — ein Impuls mit eigener Uhr
     * verfehlt den Moment auf einem anderen Gerät (E-15, dieselbe Bedingung wie bei Georgs
     * Flash-Notlösung). Wird von `fx-script.js` über den Wirker `hud` gerufen.
     */
    kick(betrag, anlass) {
      hit = Math.min(1.6, hit + Math.abs(betrag || 1));
      hits++; letzterHit = anlass || 'kick';
    },

    /**
     * @param st `{ bankAngle, turnRate, speedRatio }` — drei Größen, die der Runner ohnehin
     *        jedes Bild liest. Keine wird hier nachgerechnet (E-19).
     */
    update(dt, st) {
      if (!P.on || !wurzel) return;
      bilder++;
      t += dt;
      const bankZiel = Math.max(-1, Math.min(1, (st.bankAngle || 0) / maxBank));
      // Die Querkraft ist die DREHRATE, nicht die Lage: sie ist das, was den Stapel nach außen
      // drückt. Zwei verschiedene Größen für zwei verschiedene Reaktionen.
      const gZiel = Math.max(-1, Math.min(1, (st.turnRate || 0) * 1.6));
      feder(fBank, bankZiel, P.stiff, P.damp, dt);
      feder(fG, gZiel, P.stiff * 0.7, P.damp, dt);
      feder(fSpeed, Math.max(0, Math.min(1, st.speedRatio || 0)), 40, 0.86, dt);
      if (hit > 0) hit = Math.max(0, hit - dt / P.hitAbklingS);

      const b = fBank.x, g = fG.x, sp = fSpeed.x, h = hit;

      // Die vier Zahlen — EINMAL geschrieben. Wer eine fünfte Reaktion will, liest sie hier ab
      // und verdrahtet keine zweite Messung.
      const s = wurzel.style;
      s.setProperty('--bank', b.toFixed(4));
      s.setProperty('--g', g.toFixed(4));
      s.setProperty('--speed', sp.toFixed(4));
      s.setProperty('--hit', h.toFixed(4));

      const grad = P.maxGrad, px = P.maxPx;

      // Wortmarke · ein Blatt, lose angeklebt: GEGENrotation (sie hängt nach) plus Flattern bei
      // Tempo. Das Flattern ist eine Schwingung, kein Rauschen — Rauschen liest als Fehler.
      const flatter = Math.sin(t * P.flatterHz * Math.PI * 2) * P.flatterGrad * sp * sp;
      setzen(ecke('wordmark'),
        'translate3d(' + (-b * px).toFixed(2) + 'px,' + (Math.abs(b) * px * 0.35).toFixed(2) + 'px,0)'
        + ' rotate(' + (-b * grad + flatter).toFixed(3) + 'deg)'
        + ' skewX(' + (-b * grad * 0.5).toFixed(3) + 'deg)');

      // Zahnrad · eine Maschine: sie bewegt sich NICHT mit der Schräglage. Die Drehung gehört
      // `gear-icon.js` (eigener Renderer, eigene rAF) — hier nur ein Hauch Versatz, damit die
      // Ecke nicht steif im bewegten Bild klebt. Die Zahl in der Nabe bleibt aufrecht: sie hängt
      // an der Platte, nicht am Träger.
      setzen(ecke('gear'),
        'translate3d(' + (-b * px * 0.4).toFixed(2) + 'px,' + (h * 2).toFixed(2) + 'px,0)');

      // Pop-Würfel · ein Körper, der in der Ecke liegt: kippt mit der Lage, staucht beim
      // Einschlag. Volumenerhaltend — eine Achse hoch heißt die andere runter, sonst wird aus
      // dem Würfel ein Riegel (die Sky-Dice haben es vorgemacht).
      const sy = 1 - h * P.hitSquash;
      const sx = 1 / Math.sqrt(Math.max(0.5, sy));
      setzen(ecke('pop'),
        'translate3d(' + (b * px * 0.6).toFixed(2) + 'px,0,0)'
        + ' rotate(' + (b * grad * 1.2).toFixed(3) + 'deg)'
        + ' scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')');

      // Kartendeck · ein Stapel Papier: die Blätter FÄCHERN in der Kurve nach außen. Das ist die
      // eigentliche Antwort auf „mehr Immersion" — nicht mehr Bewegung, sondern Bewegung, die
      // etwas über den Gegenstand sagt. Ein Stapel, der auffächert, erzählt die Fliehkraft.
      setzen(ecke('stack'),
        'translate3d(' + (g * px * 0.5).toFixed(2) + 'px,' + (h * 3).toFixed(2) + 'px,0)'
        + ' rotate(' + (g * P.faecherGrad).toFixed(3) + 'deg)'
        + ' scale(1,' + (1 - h * P.hitSquash * 0.8).toFixed(4) + ')');
    },

    setEnabled(on) {
      P.on = !!on;
      if (!P.on) for (const k in ecken) setzen(ecken[k], 'none');
    },
    get enabled() { return P.on; },
    abweichungen() {
      const a = [];
      for (const k in HUDFLUG_QUELLE) if (P[k] !== HUDFLUG_QUELLE[k])
        a.push(k + ' ' + HUDFLUG_QUELLE[k] + '→' + P[k]);
      return a;
    },
    /** Welche Ecken tatsächlich gefunden wurden. **Eine Reaktion auf einem fehlenden Knoten ist
     *  eine stille Nichtreaktion** — und die sieht genauso aus wie „Effekt zu schwach". */
    ecken() {
      const o = {};
      // `!!ecke(n)` allein hat gelogen: ein abgehängter Knoten ist wahr und trotzdem tot.
      for (const n of ['wordmark', 'gear', 'pop', 'stack']) {
        const el = ecke(n);
        o[n] = !!(el && el.isConnected);
      }
      return o;
    },
    report() {
      const a = this.abweichungen();
      return { an: P.on, bank: +fBank.x.toFixed(3), g: +fG.x.toFixed(3),
               speed: +fSpeed.x.toFixed(3), hit: +hit.toFixed(3), hits, letzterHit, bilder,
               ecken: this.ecken(),
               budgets: { bank: P.maxGrad, versatz: P.maxPx, flatter: P.flatterGrad,
                          deckFaecher: P.faecherGrad,
                          schlimmstenfallGrad: +(P.maxGrad + P.flatterGrad).toFixed(2) },
               parameter: Object.keys(HUDFLUG_QUELLE).length,
               abweichungen: a.length, abweichend: a };
    },
    zeile() {
      const a = this.abweichungen();
      const e = this.ecken();
      const fehlt = Object.keys(e).filter((k) => !e[k]);
      return Object.keys(HUDFLUG_QUELLE).length + ' params · '
        + (a.length ? '⚠ ' + a.length + ' off default: ' + a.join(', ') : 'all at default')
        + ' · ' + (P.on ? 'on' : 'OFF')
        + ' · bank ' + fBank.x.toFixed(2) + ' · g ' + fG.x.toFixed(2)
        + ' · speed ' + fSpeed.x.toFixed(2) + ' · hit ' + hit.toFixed(2)
        + ' · ' + hits + ' impacts (last ' + letzterHit + ')'
        // ⚠ **„limits ±1,5° / ±4 px" war als Gesamtaussage falsch, und die Messung hat es
        // gezeigt:** gemessen bei voller Schräglage `wordmark rotate(-1.805deg)` und
        // `stack rotate(2.576deg)`. Der Grund ist kein Fehler, sondern eine Buchhaltung:
        // `maxGrad` ist das Budget des SCHRÄGLAGE-Kanals, und darauf addieren zwei weitere
        // Kanäle mit eigenem Budget — das Flattern (`flatterGrad`, nur bei Tempo) und das
        // Auffächern des Stapels (`faecherGrad`, an der Drehrate). Drei Kanäle, drei Budgets,
        // wie beim Trauma-Roll gegen MAX_TILT in `camera-rig`.
        // *Eine Zeile, die eine Summe verspricht und einen Summanden nennt, ist eine falsche
        // Zeile — auch wenn jede Zahl darin stimmt.* Jetzt steht die Summe da.
        + ' · budgets: bank ±' + P.maxGrad + '° / ±' + P.maxPx + ' px'
        + ' · flutter ±' + P.flatterGrad + '° · deck fan ±' + P.faecherGrad + '°'
        + ' → worst case ±' + (P.maxGrad + P.flatterGrad).toFixed(1) + '° (wordmark), ±'
        + P.faecherGrad.toFixed(1) + '° (deck)'
        + (fehlt.length ? '  ·  ⚠ carrier missing: ' + fehlt.join(', ')
                        : '  ·  4/4 carriers found');
    },
    /** Kontrollprobe (PM-41): eine Feder, deren Ziel bekannt ist, gegen die eigene Uhr. */
    selbsttest() {
      const z = [];
      const s = { x: 0, v: 0 };
      for (let i = 0; i < 60; i++) feder(s, 1, P.stiff, P.damp, 1 / 60);
      z.push((Math.abs(s.x - 1) < 0.05 ? '✓' : '✗') + ' feder erreicht 1 nach 1 s: ' + s.x.toFixed(3));
      const s2 = { x: 0, v: 0 };
      let max = 0;
      for (let i = 0; i < 60; i++) { feder(s2, 1, P.stiff, P.damp, 1 / 60); if (s2.x > max) max = s2.x; }
      z.push((max > 1.0 ? '✓' : '✗') + ' überschwinger vorhanden (peak ' + max.toFixed(3)
             + ') — ohne ihn fühlt es sich getimed an, nicht kinetisch');
      const e = this.ecken();
      const n = Object.keys(e).filter((k) => e[k]).length;
      z.push((n === 4 ? '✓' : '✗') + ' ' + n + '/4 träger im DOM gefunden');
      // Kontrollprobe der Kontrollprobe: eine Feder mit Steifigkeit 0 darf NICHT ankommen.
      const s3 = { x: 0, v: 0 };
      for (let i = 0; i < 60; i++) feder(s3, 1, 0, P.damp, 1 / 60);
      z.push((Math.abs(s3.x) < 1e-9 ? '✓' : '✗') + ' kontrollprobe: stiff=0 bewegt nichts ('
             + s3.x.toFixed(6) + ')');
      return z;
    },
  };
}
