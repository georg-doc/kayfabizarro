// ============================================================================
// mech-impact.js — v10 · Slice 1 · Die Impact-Tabelle als KASKADEN statt als Zeichnung
// ----------------------------------------------------------------------------
// **Warum dieses Modul existiert — und warum es NICHT der Zeichner aus dem Slice ist.**
// Mech Slice v3 hat eine Impact-Grammatik gebaut, die trägt: die Zelle kommt aus
// ENERGIEART × OBERFLÄCHE (4 × 6 = 24), nicht aus der Waffe. Die Waffe bringt Farbe und
// Wucht, die Oberfläche bestimmt Form, Ton und was liegen bleibt. Der Kernsatz des Slice —
// *Mündung zeigt Absicht, Projektil zeigt Richtung, Impact zeigt Konsequenz* — ist damit
// eine Tabelle, kein `if`-Baum.
//
// Im Slice zeichnet `_impact()` selbst: eigener Sprite-Pool, eigener Shake, eigener
// AudioContext. Im Wirt wäre jedes davon Fehlerklasse 1 (fx-bus Bauregel 3: EIN Wirker,
// EIN Eigentümer) — v9 hat `trauma.js`, `tiny-audio`/`travel-audio` und `KFBInk` bereits,
// jeweils genau einmal. Dieses Projekt hat diese Klasse schon zweimal bezahlt: die doppelte
// Bodenlesung in `mech-station.js` und der doppelte Stempel im Slice selbst.
//
// Also wandert nicht der Zeichner herüber, sondern die **Tabelle**. `_impact()` wird zu
//     fx.fire('mech.impact.<energie>.<flaeche>', ctx)
// und die 24 Zellen sind 24 Kaskaden, erzeugt aus je EINER Zeile. Eine neue Zelle ist eine
// Zeile; braucht sie mehr, ist die Implementierung falsch (Regel aus dem Slice-Handover,
// hier unverändert übernommen).
//
// ⚠ **Zwei Dinge, die dieses Modul bewusst NICHT tut:**
//  · Es zeichnet nichts. Es nennt Wirker, die der Wirt besitzt.
//  · Es erfindet keine Klänge. Die sechs Oberflächenstimmen sind **geliehene Samples mit
//    Tonhöhenversatz** aus der vorhandenen Bank — `kfb-combat-sfx.json` ist im Slice
//    geschrieben, aber nicht verdrahtet, und ein zweiter Klangweg wäre wieder ein
//    Doppelsystem. Das Tor sagt an, dass sie geliehen sind; es behauptet nicht, sie seien echt.
//
// **E-29 wird eingehalten:** höchstens drei Beats auf `t = 0`. Der Generator zählt selbst und
// das Tor druckt das Maximum — die Regel ist damit gemessen, nicht behauptet.
//
//   import { KASKADEN_MECH, createMechImpact } from './mech-impact.js';
//   const mech = createMechImpact({ getFx: () => fx });
//   fx.defineAll(KASKADEN_MECH);
//   mech.treffer('kinetisch', 'erde', { pos, dir, farbe });
//   mech.tor();   // eine Zeile, keine Wand
// ============================================================================

export const ENERGIEN = ['kinetisch', 'heiss', 'nass', 'elektrisch'];
export const FLAECHEN = ['erde', 'metall', 'knochen', 'luft', 'wasser', 'schild'];

/* Die sechs Oberflächenstimmen. Jede ist ein VORHANDENES Sample plus ein Tonhöhenfenster —
   `audio-switch` zieht `rate` je Einsatz neu, das ist derselbe Weg, den `card.collect` geht.
   Wenn `kfb-combat-sfx.json` im Wirt landet, werden hier sechs Namen getauscht und sonst nichts. */
const STIMME = {
  thump:  ['land',  0.82, 0.92],   // Erde: tief, kurz, trocken
  ping:   ['roll',  1.42, 1.58],   // Metall: hell und hart — der Würfel, hochgezogen
  snap:   ['roll',  1.20, 1.34],   // Knochen: derselbe Anschlag, eine Terz tiefer
  splat:  ['water', 0.78, 0.90],   // nasse Energie: schwer, ohne Nachhall
  splash: ['water', 0.96, 1.12],   // Wasseroberfläche: die Welle selbst
  zap:    ['shoot', 1.30, 1.46],   // elektrisch: der Schuss, überdreht
};

/* Eine Zelle = eine Zeile. `wucht` nennt einen NAMEN aus `trauma.js · GEWICHTE` (Bauregel 5:
   keine Zahl an der Aufrufstelle), `staub` ist die Partikelmenge für den `dust`-Wirker,
   `marke` ist, was liegen bleibt — und `null` heißt: hier bezeugt nichts.
   **Luft und Wasser bekommen keine Marke.** Eine Marke ist eine Zeugenaussage, und in der Luft
   gibt es nichts zu bezeugen (P5 aus dem Slice-Changelog, wortwörtlich übernommen). */
const Z = (form, ton, staub, wucht, marke) => ({ form, ton, staub, wucht, marke: marke || null });

export const IMPACT = {
  kinetisch: {
    erde:    Z('puff+funken',    'thump',  22, 'treffer-mittel', 'krater'),
    metall:  Z('star+funken',    'ping',   10, 'treffer-mittel', 'kratzer'),
    knochen: Z('burst+splitter', 'snap',   14, 'treffer-mittel', 'span'),
    luft:    Z('star',           'ping',    0, 'treffer-leicht', null),
    wasser:  Z('ring',           'splash', 12, 'treffer-leicht', null),
    schild:  Z('ring',           'ping',    0, 'treffer-leicht', null),
  },
  heiss: {
    erde:    Z('burst+rauch',    'thump',  28, 'treffer-schwer', 'russ'),
    metall:  Z('burst+zungen',   'ping',   16, 'treffer-schwer', 'russ'),
    knochen: Z('burst+zungen',   'snap',   16, 'treffer-schwer', 'russ'),
    luft:    Z('burst',          'thump',   6, 'treffer-mittel', null),
    wasser:  Z('ring',           'splash', 18, 'treffer-mittel', null),
    schild:  Z('ring',           'ping',    0, 'treffer-leicht', null),
  },
  nass: {
    erde:    Z('splat',          'splat',   8, 'treffer-leicht', 'pfuetze'),
    metall:  Z('splat',          'splat',   8, 'treffer-leicht', 'pfuetze'),
    knochen: Z('splat',          'splat',   8, 'treffer-leicht', 'pfuetze'),
    luft:    Z('splat',          'splat',   0, 'treffer-leicht', null),
    wasser:  Z('ring',           'splash', 10, 'treffer-leicht', null),
    schild:  Z('ring',           'ping',    0, 'treffer-leicht', null),
  },
  elektrisch: {
    erde:    Z('star+splitter',  'zap',    12, 'treffer-mittel', 'brandmal'),
    metall:  Z('star+splitter',  'zap',     6, 'treffer-schwer', 'brandmal'),
    knochen: Z('star+splitter',  'zap',    10, 'treffer-mittel', 'brandmal'),
    luft:    Z('star',           'zap',     0, 'treffer-leicht', null),
    wasser:  Z('ring',           'splash', 14, 'treffer-schwer', null),
    schild:  Z('ring',           'zap',     0, 'treffer-leicht', null),
  },
};

/* Welche Waffe trägt welche Energieart. Steht HIER und nicht in `WEAPONS`, weil `WEAPONS` das
   Modul des Slice ist und drüben weiterlebt — eine Spalte dort hinzuzufügen hieße, zwei
   Dateien in zwei Repos synchron zu halten. Wenn der Slice die Spalte selbst bekommt, wird
   diese Tabelle gelöscht und nicht ergänzt. */
export const ENERGIE_VON_WAFFE = {
  stinger: 'kinetisch', hornet: 'kinetisch', railgun: 'kinetisch', scrap: 'kinetisch',
  rocket: 'heiss', beam: 'heiss',
  acid: 'nass', mortar: 'nass',
};

export const kaskadenName = (energie, flaeche) => 'mech.impact.' + energie + '.' + flaeche;

/* Der Generator. Die Beat-Zeiten sind die einzige Erfindung in dieser Datei, und sie folgen der
   Referenz-Kaskade `card.collect`: was gleichzeitig kommt, ist EIN Reiz — also stehen Blitz und
   Marke hinter dem Anschlag, nicht in ihm.
     t = 0.00  Ton · Wucht · Staub          (höchstens drei — E-29)
     t = 0.05  Blitz, nur bei schwerem Treffer
     t = 0.06  die Marke, die liegen bleibt */
function baueKaskade(zelle) {
  const [name, lo, hi] = STIMME[zelle.ton] || STIMME.thump;
  const beats = [
    { t: 0.00, sfx: [name, 0.85, { rate: [lo, hi] }] },
    { t: 0.00, trauma: [zelle.wucht] },
  ];
  if (zelle.staub > 0) beats.push({ t: 0.00, dust: [zelle.staub, 0.55] });
  if (zelle.wucht === 'treffer-schwer') beats.push({ t: 0.05, post: [0.38] });
  if (zelle.marke) beats.push({ t: 0.06, mark: [zelle.marke] });
  return beats;
}

export const KASKADEN_MECH = (() => {
  const out = {};
  for (const e of ENERGIEN) for (const f of FLAECHEN) out[kaskadenName(e, f)] = baueKaskade(IMPACT[e][f]);
  return out;
})();

/**
 * Der Router. Er trifft keine Entscheidung — er sucht die Zelle und feuert ihren Namen.
 * Genau das ist der Unterschied zum Slice: dort entschied `_impact()`, WAS passiert;
 * hier entscheidet die Partitur, und dieses Modul sagt nur, WELCHE.
 */
export function createMechImpact({ getFx } = {}) {
  const gezaehlt = new Map();          // Zellname → wie oft gefeuert
  let unbekannteZelle = 0;             // eine Energie/Fläche, die es nicht gibt
  let marken = 0;                      // wie oft eine Marke angefordert wurde
  let letzte = '—';

  function treffer(energie, flaeche, ctx) {
    const zeile = IMPACT[energie];
    const zelle = zeile && zeile[flaeche];
    if (!zelle) { unbekannteZelle++; return null; }
    const n = kaskadenName(energie, flaeche);
    gezaehlt.set(n, (gezaehlt.get(n) || 0) + 1);
    letzte = energie + '→' + flaeche;
    const fx = getFx && getFx();
    if (fx) fx.fire(n, Object.assign({ energie, flaeche, form: zelle.form, marke: zelle.marke }, ctx || {}));
    return zelle;
  }

  /** Treffer aus Waffensicht: die Waffe kennt ihre Energieart, die Welt kennt ihre Oberfläche. */
  function trefferVonWaffe(waffenId, flaeche, ctx) {
    return treffer(ENERGIE_VON_WAFFE[waffenId] || 'kinetisch', flaeche, ctx);
  }

  /** Der `mark`-Wirker, den der Wirt registriert. Er ZEICHNET noch nichts — Marken sind
   *  Slice 2 (der Decal-Weg gehört `ink-tail.js`, und ein zweiter Stempel wäre der Fehler,
   *  den der Slice schon einmal gemacht hat). Bis dahin ist er ein Zähler, und das Tor sagt
   *  es an. Ein registrierter Zähler ist besser als ein fehlender Wirker: er erzeugt keine
   *  Warnung, die bei jedem Laden steht und deshalb niemand mehr liest. */
  function markeWirker() { marken++; }

  /** EINE Zeile. Kein Absatz, keine Wand. */
  function tor() {
    let maxT0 = 0;
    for (const k in KASKADEN_MECH) {
      const n = KASKADEN_MECH[k].filter((b) => b.t === 0).length;
      if (n > maxT0) maxT0 = n;
    }
    const zellen = ENERGIEN.length * FLAECHEN.length;
    return zellen + ' cells · ' + gezaehlt.size + ' fired · ' + unbekannteZelle + ' unknown'
      + ' · max ' + maxT0 + '/3 beats @t0'
      + ' · ' + marken + ' marks queued (not drawn yet)'
      + ' · last ' + letzte;
  }

  /** Alles, was das Tor verdichtet — für die Zwischenablage, nicht für die Spalte. */
  function report() {
    const nie = [];
    for (const e of ENERGIEN) for (const f of FLAECHEN) {
      if (!gezaehlt.get(kaskadenName(e, f))) nie.push(e + '/' + f);
    }
    return { zellen: ENERGIEN.length * FLAECHEN.length, gefeuert: [...gezaehlt.entries()],
             nieGefeuert: nie, marken, unbekannteZelle, stimmenGeliehen: Object.keys(STIMME).length };
  }

  return { name: 'mech-impact', treffer, trefferVonWaffe, markeWirker, tor, report,
           kaskaden: KASKADEN_MECH };
}
