// ============================================================================
// welt-id.js — v10 · EINE Sprache für „welche Welt"
// ----------------------------------------------------------------------------
// Die Werkbank baut eine Welt und gibt sie als kurze Kennung heraus; der Globus muss dieselbe
// Kennung lesen und dieselbe Welt bauen. Das sind zwei Programme mit einer gemeinsamen Regel —
// also gehört die Regel in EINE Datei, die beide lesen.
//
// ⚠ **Warum das nicht in der Werkbank bleiben durfte.** Dort stand der Streuwert als private
// Methode. Solange nur sie ihn benutzt, ist das richtig. Sobald der Globus dieselbe Kennung
// auflösen soll, wäre eine Kopie die zweite Wahrheit — und zwar die gefährlichste Sorte: sie
// fällt nicht auf, sondern baut still eine andere Welt als die, die man abgenommen hat.
// (Regel 6 des Embed-Bundles, hier zwischen zwei eigenen Seiten statt zwischen Repo und Kopie.)
//
// **Das Format, lesbar gemeint:**
//     W1-<deck-oder-saat>-<sorte>-E<treue%>-D<drehung°>-M<meeresspiegel×100>
//     W1-anti_rules_toolkit-default-E0-D0-M-18
//     W1-704289890-pangaea-E72-D15
// Fehlende Teile sind Vorgaben, nicht Fehler: eine Kennung ohne `M` heißt „Meeresspiegel wie
// gebaut". Was nicht geparst werden kann, kommt als `null` zurück und wird vom Aufrufer
// gemeldet — nie stillschweigend durch eine Zufallswelt ersetzt.
// ============================================================================

/** FNV-1a. Kurz, streut gut, und vor allem: überall dieselbe Zahl. */
export function streuwert(text) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < String(text).length; i++) {
    h ^= String(text).charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % 2147483647;
}

/**
 * Kennung → Welt. `{ seed, typ, treue, drehung, meer, deck }` oder `null`.
 * `deck` ist gesetzt, wenn der zweite Teil eine Registry-Kennung war (dann kommt die Saat aus
 * dem Streuwert) — sonst war er die Saat selbst.
 */
export function weltAusId(id) {
  if (!id || typeof id !== 'string') return null;
  const teile = id.trim().split('-');
  // Vorsicht: `M-18` zerfällt beim Trennen an Bindestrichen in `M` und `18`. Das Format ist
  // deshalb NICHT positionsfrei — die Zahl darf ihr Vorzeichen behalten. Also wieder zusammen-
  // setzen, statt am Trennzeichen zu verzweifeln.
  const felder = [];
  for (let i = 0; i < teile.length; i++) {
    if (teile[i] === '' && i > 0) { felder[felder.length - 1] += '-'; continue; }
    if (i > 0 && /^(E|D|M)$/.test(felder[felder.length - 1] || '')) { felder[felder.length - 1] += '-' + teile[i]; continue; }
    felder.push(teile[i]);
  }
  if (felder[0] !== 'W1' || felder.length < 3) return null;
  const zweit = felder[1];
  const istZahl = /^\d+$/.test(zweit);
  const welt = {
    deck: istZahl ? null : zweit,
    seed: istZahl ? (parseInt(zweit, 10) | 0) : streuwert(zweit),
    typ: felder[2] || 'default',
    treue: 0, drehung: 0, meer: 0,
  };
  for (let i = 3; i < felder.length; i++) {
    const f = felder[i];
    const m = /^([EDM])(-?\d+)$/.exec(f);
    if (!m) continue;
    const v = parseInt(m[2], 10);
    if (m[1] === 'E') welt.treue = Math.max(0, Math.min(100, v)) / 100;
    else if (m[1] === 'D') welt.drehung = v;
    else welt.meer = v / 100;
  }
  return welt;
}

/** Welt → Kennung. Gegenstück zu `weltAusId`; die Werkbank schreibt damit, was sie herausgibt. */
export function idAusWelt(w) {
  const teile = ['W1', w.deck || w.seed, w.typ || 'default'];
  if (w.treue > 0) teile.push('E' + Math.round(w.treue * 100), 'D' + Math.round(w.drehung || 0));
  else teile.push('E0', 'D0');
  if (w.meer) teile.push('M' + Math.round(w.meer * 100));
  return teile.join('-');
}

/**
 * Der Zuschlag dieser Welt aufs Feld — die EINE Stelle, an der Erd-Maske und Meeresspiegel
 * zusammenkommen. Werkbank und Globus reichen das Ergebnis an `setKontinentHook` weiter.
 *
 * ⚠ **Der Meeresspiegel misst in der Einheit der Maske, nicht in Feldwerten.** Georg, 2.9.:
 * *„der Meeresspiegel wird nicht abgesenkt — der Regler beeinflusst nur Berge/Terrain."* Die
 * Maske senkt den Ozean bei voller Erd-Treue um gut zwei Feldwert-Einheiten; ein fester Betrag
 * von ±0,18 daneben ist an der Küste unsichtbar, auf der feiner aufgelösten Höhenrampe aber
 * sichtbar. Deshalb ist er ein ANTEIL ihres Ausschlags. Ohne Maske ist der Faktor 1, und der
 * Regler bedeutet wieder genau das, was er sagt.
 */
export function weltHaken(welt, erdeZuschlag) {
  const erde = welt.treue > 0 ? erdeZuschlag(welt.treue, welt.drehung) : null;
  const staerke = erde ? 1 + (0.40 * welt.treue + 1.70 * Math.pow(welt.treue, 3)) : 1;
  const versatz = (welt.meer || 0) * staerke;
  if (!erde && !versatz) return null;
  return (nx, ny, nz, schwelle) => (erde ? erde(nx, ny, nz, schwelle) : 0) - versatz;
}
