// ============================================================================
// fx-bus.js — KFB Travel Globe v4 · Slice B · EIN Eingang für Ereignisse
// ----------------------------------------------------------------------------
// Der Befund, aus dem dieses Modul entstanden ist (D-08 §1, gemessen): beim Kartendurchflug
// feuerten SECHS Ereignisse bei `t = 0` und **keins danach** — während der Höhepunkt, die Ankunft
// der Karte im Stapel, bei `t = 1,05 s` **stumm** war. Das ist kein Nachhall, das ist ein Akkord.
// tinyskies löst denselben Vorgang mit zwei Klängen zu zwei Zeiten (`FishCatchVfx`: Splash bei 0,
// `fish_catch_1` bei 0,62 auf der Landung).
//
// Georgs Formulierung ist die Prüffrage: *you hit, now ride the consequences.* Eine Kaskade ist
// eine Kette mit ZEITVERSATZ. Also braucht sie eine Zeitachse, und die gehört in Daten.
//
// ── Die fünf Bauregeln (E-28, E-29 · D-08 §14.3) ────────────────────────────────────────────
//  1 **Eine Kaskade ist ein Array, kein `if`-Baum.** Wer einen Effekt ergänzt, ergänzt eine Zeile.
//    Im Runner darf ein Ereignis-Handler nur noch `fx.fire(...)` enthalten.
//  2 **Jeder Beat hat ein `t`. Höchstens DREI Beats dürfen auf `t = 0` liegen.** Mehr ist per
//    Definition ein Akkord. `report()` zählt es, `define()` warnt beim Überschreiten.
//  3 **Jeder Wirker hat genau EINEN Eigentümer und wird EINMAL registriert.** Kein zweiter Weg zu
//    `rig.shake`, kein zweiter Kartenmaler, kein zweiter Lichterzeuger — drei Fehlerklassen, die
//    dieses Projekt schon bezahlt hat.
//  4 **Jede Kaskade hat eine Höchstdauer; der Abspieler beendet sie.** Ein Beat, dessen Kaskade
//    überschrieben wurde, wird VERWORFEN UND GEZÄHLT — nie stillschweigend geschluckt.
//  5 **Gewichte stehen in einer Tabelle mit Begründung** (`trauma.js` · GEWICHTE), nicht als Zahl
//    an der Aufrufstelle.
//
// ⚠ **Warum der Abspieler eine eigene Uhr hat und nicht `performance.now()` liest:** damit er mit
// dem `step(dt)`-Antrieb des Prüfstands mitläuft. Slice A hat gemessen, dass `requestAnimationFrame`
// in einem verdeckten Tab fast stillsteht (PM-50, drittes Mal) — ein Prüfstand, dessen Uhr der
// Browser stellt, misst die Aufmerksamkeit des Zuschauers mit. `update(dt)` nimmt das `dt`, das
// ihm gegeben wird, und fragt nicht nach.
//
// ⚠ **Ein fehlender Wirker ist ein Zähler, kein Absturz.** Eine Kaskade, die einen unbekannten
// Wirker nennt, darf nicht den Frame-Loop töten (PM: „Fehler im Tick tötet den Tick"). Sie zählt
// den Fehlschlag und läuft weiter — und `report()` sagt es.
//
//   const fx = createFxBus({ wirker: { sfx, trauma, dust, post, hud, pet, speed, duck, fov } });
//   fx.defineAll(KASKADEN);            // aus fx-script.js
//   fx.fire('card.collect', { pos, dir, strength });
//   fx.update(dt);
// ============================================================================

export function createFxBus(opts = {}) {
  const wirker = opts.wirker || {};
  const P = Object.assign({
    on: true,
    maxGleichzeitig: 12,   // Obergrenze laufender Kaskaden — darüber wird die älteste beendet
    nullBeatGrenze: 3,     // E-29
  }, opts.params || {});

  /** name → { beats:[{t, w, args}], dauer, nullBeats } */
  const defs = new Map();
  /** laufende Kaskaden */
  const live = [];
  const stat = { gefeuert: 0, beats: 0, verworfen: 0, unbekannteWirker: 0, fehler: 0,
                 letzterFehler: null, maxLive: 0,
                 // v5 · Slice C · **je Kaskade**, nicht nur in Summe. Der Grund ist gemessen: der
                 // Beat-Audit zählte den GLOBALEN Zähler und schrieb damit jeden Beat, den die
                 // laufende Welt im Messfenster feuerte, der geprüften Kaskade zu
                 // (`card.collect` „7 von 6", `intro.handover` „7 von 4").
                 beatsJe: {}, gefeuertJe: {} };
  /** v5 · Slice C · EIN Horcher für Messungen: `(kaskade, wirker, sollzeit)` je gespieltem Beat.
   *  Kein Ereignissystem, keine Liste — ein Steckplatz, den der Prüfstand belegt und räumt. */
  let horcher = null;

  /**
   * Beat-Form: `{ t: 0.06, sfx: ['card', 1.0] }` — genau EIN Schlüssel neben `t` ist der Wirker,
   * sein Wert sind die Argumente (Array = Argumentliste, sonst ein einzelnes Argument).
   * Zwei Wirker in einem Beat wären zwei Beats mit gleicher Zeit — dann schreibt man sie auch so
   * hin, sonst ist Regel 2 nicht zählbar.
   */
  function normBeat(b, name, i) {
    const keys = Object.keys(b).filter((k) => k !== 't');
    if (keys.length !== 1) {
      console.warn('[fx-bus] ' + name + ' Beat ' + i + ': ' + keys.length
        + ' Wirker in einem Beat — genau einer ist erlaubt (Regel 2 wäre sonst nicht zählbar).');
    }
    const w = keys[0];
    const v = b[w];
    return { t: +b.t || 0, w, args: Array.isArray(v) ? v : [v] };
  }

  function define(name, beats) {
    const bs = (beats || []).map((b, i) => normBeat(b, name, i))
      .sort((a, b) => a.t - b.t);
    const nullBeats = bs.filter((b) => b.t <= 1e-6).length;
    const dauer = bs.length ? bs[bs.length - 1].t : 0;
    if (nullBeats > P.nullBeatGrenze) {
      // Warnen, nicht verbieten: die Regel soll sichtbar brechen, nicht den Bau blockieren.
      console.warn('[fx-bus] ' + name + ': ' + nullBeats + ' Beats auf t=0 (Grenze '
        + P.nullBeatGrenze + ', E-29) — das ist ein Akkord, kein Nachhall.');
    }
    for (const b of bs) {
      if (!wirker[b.w]) { stat.unbekannteWirker++;
        console.warn('[fx-bus] ' + name + ': Wirker „' + b.w + '" ist nicht registriert.'); }
    }
    defs.set(name, { beats: bs, dauer, nullBeats });
    return dauer;
  }

  function defineAll(tabelle) {
    let n = 0;
    for (const name in tabelle) { define(name, tabelle[name]); n++; }
    return n;
  }

  /**
   * @param {string} name
   * @param {object} [ctx] Kontext der Kaskade — `pos`, `dir`, `strength`, was der Anlass weiß.
   *        Die Wirker bekommen ihn als LETZTES Argument, damit die Argumentliste im Skript
   *        lesbar bleibt.
   */
  function fire(name, ctx) {
    if (!P.on) return false;
    const d = defs.get(name);
    if (!d) { stat.fehler++; stat.letzterFehler = 'unbekannte Kaskade ' + name; return false; }
    // Regel 4 · Selbstüberschreibung: dieselbe Kaskade erneut heißt neu beginnen. Die restlichen
    // Beats der alten werden VERWORFEN UND GEZÄHLT — sonst treffen zwei Ankunftstöne aufeinander.
    for (let i = live.length - 1; i >= 0; i--) {
      if (live[i].name === name) { stat.verworfen += live[i].beats.length - live[i].idx; live.splice(i, 1); }
    }
    if (live.length >= P.maxGleichzeitig) {
      const alt = live.shift();
      stat.verworfen += alt.beats.length - alt.idx;
    }
    live.push({ name, beats: d.beats, dauer: d.dauer, idx: 0, t: 0, ctx: ctx || {} });
    stat.gefeuert++;
    stat.gefeuertJe[name] = (stat.gefeuertJe[name] || 0) + 1;
    if (live.length > stat.maxLive) stat.maxLive = live.length;
    return true;
  }

  function update(dt) {
    if (!P.on || !live.length) return;
    for (let i = live.length - 1; i >= 0; i--) {
      const k = live[i];
      k.t += dt;
      while (k.idx < k.beats.length && k.beats[k.idx].t <= k.t) {
        const b = k.beats[k.idx++];
        const fn = wirker[b.w];
        if (!fn) { stat.unbekannteWirker++; continue; }
        try { fn(...b.args, k.ctx); stat.beats++;
              stat.beatsJe[k.name] = (stat.beatsJe[k.name] || 0) + 1;
              if (horcher) horcher(k.name, b.w, b.t); }
        catch (e) {
          // Ein Wirker, der wirft, darf die Kaskade nicht töten und den Frame-Loop erst recht
          // nicht. Gezählt und benannt — stumme Fehlschläge haben dieses Projekt vier Runden
          // gekostet (BUG-08).
          stat.fehler++;
          stat.letzterFehler = k.name + '/' + b.w + ': ' + ((e && e.message) || String(e));
        }
      }
      if (k.idx >= k.beats.length) live.splice(i, 1);
    }
  }

  return {
    name: 'fx-bus', params: P, define, defineAll, fire, update,
    get wirkerNamen() { return Object.keys(wirker); },
    /** Wirker nachreichen (der Runner baut manches erst später — z. B. das HUD). */
    setWirker(name, fn) { wirker[name] = fn; },
    /** Messhorcher setzen oder räumen (`null`). Genau EIN Platz — zwei Horcher wären zwei
     *  Messungen derselben Sache, und die gehen auseinander. */
    setHorcher(fn) { horcher = typeof fn === 'function' ? fn : null; },
    /** Eine Zeile fürs Panel. Ohne sie ist „die Effekte feuern gleichzeitig" eine Meinung. */
    zeile() {
      let maxNull = 0, wo = '—';
      for (const [n, d] of defs) if (d.nullBeats > maxNull) { maxNull = d.nullBeats; wo = n; }
      return defs.size + ' cascades · ' + live.length + ' live (peak ' + stat.maxLive + ') · '
        + stat.gefeuert + ' fired · ' + stat.beats + ' beats · '
        + (stat.verworfen ? '⚠ ' + stat.verworfen + ' dropped' : '0 dropped')
        + ' · max t=0 beats: ' + maxNull + ' (' + wo + ')'
        + (stat.fehler ? '  ·  ⚠ ' + stat.fehler + ' errors · ' + stat.letzterFehler : '');
    },
    report() {
      const liste = [];
      for (const [n, d] of defs) {
        // `spielbar` wird HIER gerechnet, nicht in `define`: Wirker können nachgereicht werden
        // (`setWirker`), und eine beim Definieren eingefrorene Zahl wäre danach falsch.
        // Der Unterschied ist die ganze Auskunft: `water.enter` hat 3 Beats und 2 spielbare —
        // der dritte ist die Vormerkung für Slice F und darf im Audit nicht als Ausfall lesen.
        const fehlend = [];
        for (const b of d.beats) if (!wirker[b.w] && fehlend.indexOf(b.w) < 0) fehlend.push(b.w);
        liste.push({ name: n, beats: d.beats.length,
                     spielbar: d.beats.filter((b) => !!wirker[b.w]).length,
                     fehlendeWirker: fehlend,
                     dauer: +d.dauer.toFixed(2), nullBeats: d.nullBeats });
      }
      return Object.assign({ kaskaden: liste, live: live.map((k) => k.name) }, stat);
    },
    /** Kontrollprobe (PM-41): eine Kaskade, deren Beats bekannt sind, gegen die Uhr. */
    selbsttest() {
      const z = [];
      const spur = [];
      const merk = wirker.__test;
      wirker.__test = (marke) => spur.push(+(marke).toFixed(3));
      define('__probe', [{ t: 0.00, __test: 0 }, { t: 0.10, __test: 1 }, { t: 0.25, __test: 2 }]);
      fire('__probe', {});
      // 30 Schritte × 1/60 s = 0,500 s — alle drei Beats müssen gefallen sein
      const zeiten = [];
      for (let i = 0; i < 30; i++) { const vor = spur.length; update(1 / 60);
        for (let j = vor; j < spur.length; j++) zeiten.push((i + 1) / 60); }
      z.push((spur.length === 3 ? '✓' : '✗') + ' 3 beats gespielt (' + spur.length + ')');
      z.push((spur.join(',') === '0,1,2' ? '✓' : '✗') + ' reihenfolge ' + spur.join(','));
      const soll = [0, 0.10, 0.25], tol = 1 / 60 + 1e-6;
      let ok = zeiten.length === 3;
      for (let i = 0; i < zeiten.length && ok; i++) ok = Math.abs(zeiten[i] - soll[i]) <= tol;
      z.push((ok ? '✓' : '✗') + ' zeiten ' + zeiten.map((v) => v.toFixed(3)).join(' / ')
             + ' (soll 0,000 / 0,100 / 0,250, Toleranz 1 Bild)');
      // Kontrollprobe der Kontrollprobe: eine absichtlich um 100 ms verschobene Erwartung MUSS
      // als Abweichung erkannt werden — sonst prüft der Test nichts.
      const falsch = Math.abs((zeiten[1] || 0) - (soll[1] + 0.1)) <= tol;
      z.push((!falsch ? '✓' : '✗') + ' kontrollprobe: +100 ms wird als abweichung erkannt');
      defs.delete('__probe');
      // BUG-07-Klasse: ein Prüfwerkzeug, das seine Probe in die Betriebszahlen schreibt, macht
      // die Messung unlesbar. Der Probelauf räumt seinen eigenen Zähler weg.
      delete stat.beatsJe['__probe']; delete stat.gefeuertJe['__probe'];
      if (merk) wirker.__test = merk; else delete wirker.__test;
      return z;
    },
  };
}
