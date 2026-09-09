// ============================================================================
// landmark-names.js — Überflug-Erkennung und Namen · Mechanik aus Landmarks.ts
// ----------------------------------------------------------------------------
// **Der portierbare Wert von `client/src/game/Landmarks.ts` ist nicht das Modell, sondern
// Name + Auslöseradius** (Befund vom 29.8., §6e im Living-Dokument): die Datei enthält kein
// einziges Mesh — nur einen Namensgenerator, eine Registry und einen Detektor, der über das
// SKALARPRODUKT der Spielernormale mit der Landmarkennormale auslöst.
//
// Übernommen ist die MECHANIK, mit ihren Zahlen:
//   · `enterDot` / `exitDot` als Hysterese — Dorf 0,995 / 0,990, engere Marken (Leuchtturm)
//     0,997 / 0,993. Der Abstand zwischen Ein- und Austritt ist der Grund, warum der Name nicht
//     flackert, wenn man am Rand entlangfliegt.
//   · Ein Kandidat gewinnt über das GRÖSSTE Skalarprodukt, nicht über den ersten Treffer;
//     die aktive Landmarke bleibt aktiv, bis sie unter ihren `exitDot` fällt.
//   · `onEnter` / `onExit` als einzige Schnittstelle nach außen.
//
// **Die Namen sind NEU und das ist Absicht.** Die Wortlisten der Quelle sind deren Fiktion
// („Windhaven", „Beacon Point"). KFB ist absurd und surreal, und die Landmarken hier sind ein
// Buch, eine Münze, ein Kartenhaus — also kommen die Namen aus DIESEN Dingen. Gekennzeichnet,
// damit niemand sie für einen Port hält.
//
// Auf der Kugel ist der Rechenweg identisch: unsere Spielernormale ist `tangentFrame(q).up`,
// die Landmarkennormale ist `site.n` — beides Einheitsvektoren, das Skalarprodukt ist der Kosinus
// des Winkels. 0,995 entspricht 5,7°, also bei Radius 5 einem Kreis von ~0,5 Weltmaß.
// ============================================================================

const FRONT = ['Crooked', 'Final', 'Wrong', 'Patient', 'Sold', 'Found', 'Second',
               'Printed', 'Forgotten', 'Loud', 'Dry', 'Holy', 'Cheap', 'Honest',
               'Lost', 'Turned', 'Paid', 'Annotated'];
const BACK = {
  book:   [' Footnote', ' Marginal Note', ' Edition', ' Dedication', ' Page', ' Appendix'],
  coin:   [' Deposit', ' Fee', ' Change', ' Bonus', ' Instalment', ' Donation'],
  crown:  [' Coronation', ' Regency', ' Succession', ' Tenure', ' Audience'],
  tower:  [' Floor', ' Filing', ' Registry', ' Collection', ' Display', ' Vitrine'],
  dice:   [' Throw', ' Round', ' Wager', ' Odds', ' Call'],
  table:  [' Session', ' Agenda', ' Round', ' Hearing', ' Recess'],
  house:  [' Address', ' Workshop', ' Chamber', ' Office', ' Branch'],
  default:[' Spot', ' Corner', ' Edge', ' Hollow', ' Clearing'],
};
/** Park–Miller wie in der Quelle (`s * 16807 % 2147483647`) — gleicher Seed, gleicher Name. */
function seededRandom(seed) {
  // ⚠ **Der Seed muss VOR der Multiplikation in den sicheren Bereich.** Gemessen 29.8.: bei einem
  // Weltseed von 6,3e8 wird `seed * 7919` ~5e12, `| 0` schneidet auf int32 ab und kann NEGATIV
  // werden. Dann ist der Strom negativ, `Math.floor(negativ * len)` ein negativer Index, das
  // Listenfeld `undefined` — und `undefined + undefined` ergibt **NaN**. Kein Fehler in der
  // Konsole, nur ein Ortsschild, auf dem „NaN" steht. Und es war SEED-ABHÄNGIG: mein erster
  // Beweis lief mit einem Seed, dessen Abschneiden zufällig positiv blieb.
  let s = Math.abs(seed | 0) % 2147483647 || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function makeName(seed, art) {
  // Der Startwert bleibt unter 2^31: erst modulo, dann multiplizieren.
  const basis = (Math.abs(seed | 0) % 300000) * 7919 + (art ? art.charCodeAt(0) : 7);
  const rnd = seededRandom(basis);
  const back = BACK[art] || BACK.default;
  const a = FRONT[Math.floor(rnd() * FRONT.length)] || FRONT[0];
  const b = back[Math.floor(rnd() * back.length)] || back[0];
  return a + b;
}

/** Aus einem Modellnamen die Namensfamilie ableiten — eine Tabelle, kein System. */
export function artOf(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('book') || n.includes('almanac')) return 'book';
  if (n.includes('coin')) return 'coin';
  if (n.includes('crown')) return 'crown';
  if (n.includes('dice')) return 'dice';
  if (n.includes('table')) return 'table';
  if (n.includes('tower') || n.includes('castle') || n.includes('wizard')) return 'tower';
  if (n.includes('mill') || n.includes('market') || n.includes('house')) return 'house';
  return 'default';
}

export function createLandmarkNames(opts = {}) {
  const P = Object.assign({
    enterDot: 0.995,   // Quellwert (Dorf)
    exitDot: 0.990,    // Quellwert (Dorf) — die Hysterese ist der Flackerschutz
    engEnter: 0.997,   // Quellwert für kleine Marken (Leuchtturm)
    engExit: 0.993,
  }, opts.params || {});

  const marken = [];
  let aktiv = null;
  const api = { onEnter: null, onExit: null };

  /** @param sites [{ n, def }] aus `globe-zones.planSites` — die Landmarke KENNT ihren Ort schon. */
  function register(sites, sorte) {
    for (let i = 0; i < (sites || []).length; i++) {
      const s = sites[i];
      if (!s || !s.n) continue;
      const art = artOf(s.def && s.def.name);
      const eng = art === 'tower' || art === 'coin';
      marken.push({
        art, sorte: sorte || 'landmarke',
        name: makeName((opts.seed | 0) + i * 131, art),
        n: s.n.clone().normalize(),
        enterDot: eng ? P.engEnter : P.enterDot,
        exitDot: eng ? P.engExit : P.exitDot,
      });
    }
    return marken.length;
  }

  /** @param up die Spielernormale (`tangentFrame(qPosition).up`). */
  function update(up) {
    let best = null, bestDot = -1;
    for (let i = 0; i < marken.length; i++) {
      const lm = marken[i];
      const dot = up.dot(lm.n);
      if (aktiv === lm) {
        if (dot < lm.exitDot) continue;
        if (dot > bestDot) { best = lm; bestDot = dot; }
      } else if (dot > lm.enterDot && dot > bestDot) { best = lm; bestDot = dot; }
    }
    if (best !== aktiv) {
      if (aktiv && !best) { aktiv = null; if (api.onExit) api.onExit(); }
      else if (best) { aktiv = best; if (api.onEnter) api.onEnter(best); }
    }
    return aktiv;
  }

  return {
    name: 'landmark-names', register, update,
    get onEnter() { return api.onEnter; }, set onEnter(f) { api.onEnter = f; },
    get onExit() { return api.onExit; }, set onExit(f) { api.onExit = f; },
    get active() { return aktiv; },
    get count() { return marken.length; },
    liste() { return marken.map((m) => m.name + ' (' + m.art + ')'); },
    report() { return { marken: marken.length, aktiv: aktiv ? aktiv.name : null,
                        enterDot: P.enterDot, exitDot: P.exitDot }; },
  };
}
