// ============================================================================
// journey-route.js — KFB Travel v12 · Slice S72 · Die Reihenfolge der Reise
// ----------------------------------------------------------------------------
// Seit S71 sind die Karten echt. Was fehlte, war der WEG durch sie. Georg nennt
// zwei Formen, und sie sind nicht Varianten derselben Sache:
//
//   LINEAR    Deck für Deck, in Kartenordnung. Das ist Lehrmaterial: eine
//             Dramaturgie, die jemand gesetzt hat (Karte 1 kommt vor Karte 6,
//             weil sie davor kommt).
//   GEMISCHT  drei Decks in einem Topf. Das ist das Spiel: Beweisstücke, die
//             zusammenpassen müssen, weil sie zusammen liegen.
//
// **Das Mischen gehört der REISE, nicht dem ORT** (S71-Entscheidung): die Zonen
// bleiben nach Decks sortiert und behalten ihre Farbe. Gemischt heißt, dass der
// Weg zwischen den Zonen springt — man sieht dem Himmel an, wo man ist, und der
// Reise an, dass sie nicht sortiert.
//
// DREI ENTSCHEIDUNGEN, die den Bau bestimmen:
//
// 1. **Gemischt ist gesät, nicht zufällig.** Dieselbe Zahl gibt dieselbe Reise.
//    Eine Reise, die man nicht wiederholen kann, ist kein Weg, sondern ein
//    Ereignis — man kann sie nicht besprechen („nimm 4242, da liegt Dystopia
//    hinter dem Versprechen"), und ein Reload würde die Erzählung wegwerfen.
//    Deshalb Mulberry32 mit sichtbarem Seed, kein `Math.random()`.
// 2. **Die Reise besteht aus Deck-Karten.** Werkstatt und Meta sind Orte, die man
//    selbst besucht — sie in eine Story-Journey zu mischen wäre, als läge im
//    Kartenstapel die Bedienungsanleitung.
// 3. **Besucht heißt nicht erledigt.** Die Route wird nach dem Fortschritt
//    GEFILTERT, nicht neu gebaut: `open` zuerst, und wenn alles besucht ist,
//    fliegt sie wieder ganz. Sonst hätte man nach der letzten Karte keinen Weg.
//
//   const route = createJourneyRoute();
//   route.setForm('mixed'); route.setSeed(4242);
//   route.build(academy.cards, { visitedOnly: false });   // → [karte, …]
//   route.report();
// ============================================================================

function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const FORMS = [
  { v: 'linear', l: 'linear — Deck für Deck, in Kartenordnung' },
  { v: 'mixed',  l: 'gemischt — drei Decks in einem Topf' },
];

export function createJourneyRoute(opts = {}) {
  const P = Object.assign({ form: 'linear', seed: 4242 }, opts.params || {});
  let letzte = { form: null, seed: null, länge: 0, decks: [], erste: '' };

  const isDeckCard = (c) => !!(c && c.data && c.data.kind === 'kfbcard');

  function build(cards, o = {}) {
    const pool = (cards || []).filter(isDeckCard);
    if (!pool.length) { letzte = { form: P.form, seed: P.seed, länge: 0, decks: [], erste: '' }; return []; }

    let list;
    if (P.form === 'mixed') {
      // Fisher-Yates mit gesätem Zufall. Sortiert wird eine KOPIE in stabiler
      // Ausgangsordnung — sonst hinge das Ergebnis daran, in welcher Reihenfolge
      // die Karten gebaut wurden, und derselbe Seed gäbe zweimal etwas anderes.
      list = pool.slice().sort((a, b) => a.data.route - b.data.route);
      const rnd = mulberry(P.seed | 0);
      for (let i = list.length - 1; i > 0; i--) {
        const j = (rnd() * (i + 1)) | 0;
        const t = list[i]; list[i] = list[j]; list[j] = t;
      }
    } else {
      list = pool.slice().sort((a, b) => a.data.route - b.data.route);
    }

    // Fortschritt filtert, er baut nicht um: offene Karten zuerst — ist alles
    // besucht, bleibt die ganze Reise (ein Weg, der endet, ist kein Weg).
    const open = o.visitedOnly === false ? list : list.filter((c) => !c.data.visited);
    const out = open.length ? open : list;

    letzte = {
      form: P.form, seed: P.seed, länge: out.length,
      decks: [...new Set(out.map((c) => c.data.packId))],
      erste: out.length ? (out[0].data.title || '') : '',
      offen: open.length, gesamt: list.length,
    };
    return out;
  }

  return {
    name: 'journey-route',
    get form() { return P.form; },
    get seed() { return P.seed; },
    setForm(f) { P.form = (f === 'mixed' ? 'mixed' : 'linear'); },
    setSeed(n) { P.seed = (n | 0) || 1; },
    // Ein neuer Wurf ist ein neuer Seed — nicht ein anderer Zufall bei gleicher Zahl.
    reroll() { P.seed = (Math.random() * 1e9) | 0; return P.seed; },
    build,
    // Wie die Reise durch die Zonen springt: bei „linear" 2 Wechsel (drei Decks),
    // bei „gemischt" viele. **Das ist die Abnahmezahl dieses Slices** — sie
    // unterscheidet die zwei Formen messbar, während „es ist gemischt" nur eine
    // Behauptung wäre.
    zoneWechsel(list) {
      let n = 0;
      for (let i = 1; i < (list || []).length; i++) {
        if (list[i].data.packId !== list[i - 1].data.packId) n++;
      }
      return n;
    },
    report() { return Object.assign({}, letzte); },
    get params() { return P; },
  };
}
