// ============================================================================
// motiv-kasse.js — v11 · EIN Auftrag je Motiv, alle Leser teilen ihn
// ----------------------------------------------------------------------------
// **Befund (Georg, 2.9.: „die Terrain-Karten zeigen Rückseiten, obwohl die zugehörige Sky-Card
// schon gerendert ist").** Das war kein Ladefehler und keine Reihenfolge-Frage, sondern eine
// stille Rückweisung. In `card-registry.requestArt` steht:
//
//     if (queue.some((j) => j.card === card)) return;
//
// Seit dem Anker-Modus (v11) hängt über jeder liegenden Karte die Sky-Card **desselben
// Kartenobjekts**. Fragt die Sky-Card zuerst, ist der Auftrag in der Schlange — und die Anfrage
// des Teppichs wird **ohne Rückruf verworfen**. Der Teppich hat aber schon `art = 'pending'`
// gesetzt und wartet ab jetzt für immer: **Rückseite, dauerhaft, ohne Fehlermeldung.**
// *Ein Wächter gegen Doppelarbeit, der den zweiten Frager verschluckt statt ihn anzuhängen, ist
// kein Schutz, sondern ein Datenverlust.*
//
// **Warum die Reparatur hier steht und nicht in der Registry:** `card-registry.js` liegt in
// `terrain-planets-v1/` und wird von v9 und v10 (FROZEN) gelesen. Also wird sie nicht angefasst;
// diese Schicht sorgt dafür, dass **niemals zwei Anfragen für dasselbe Motiv** dort ankommen.
//
// Die Kasse ist ein VORSATZ, kein Ersatz: `Object.create(registry)` — alles, was die Leser sonst
// benutzen (`pool`, `pending`, `cellAspect`, `cropReport`), geht unverändert durch. Überschrieben
// ist nur `requestArt`.
//
// **Was geteilt wird, ist der AUSSCHNITT (Canvas), nicht die Textur.** Jedes Blatt malt seine
// eigene Tuschekontur mit eigenem Seed (Regel: ein Seed pro Blatt) — und eine geteilte Textur
// hätte zwei Eigentümer beim Entsorgen, also Fehlerklasse 1. Teuer ist der PDF-Ausschnitt, und
// genau der fällt jetzt einmal an.
// ============================================================================

export function createMotivKasse({ registry }) {
  const kasse = Object.create(registry);
  const offen = new Map();            // key → [{cb, fail}]
  const z = { auftraege: 0, geteilt: 0, fertig: 0, fehler: 0, wartendMax: 0 };
  const key = (c) => c.packId + '#' + c.n;
  kasse.requestArt = function (card, cb, fail) {
    if (!card || !cb) return;
    const k = key(card);
    const warteliste = offen.get(k);
    if (warteliste) {
      // ⚠ **Hier lag der Verlust.** Anhängen statt verwerfen — und die Zahl dazu ins Tor, damit
      // sichtbar ist, dass das Teilen wirkt (`shared` in der Panel-Zeile).
      warteliste.push({ cb, fail });
      z.geteilt++;
      if (warteliste.length > z.wartendMax) z.wartendMax = warteliste.length;
      return;
    }
    offen.set(k, [{ cb, fail }]);
    z.auftraege++;
    registry.requestArt(card,
      (crop, aspect) => {
        const liste = offen.get(k) || [];
        offen.delete(k);
        z.fertig++;
        for (const s of liste) { try { s.cb(crop, aspect); } catch (e) { console.warn('[motiv-kasse]', e); } }
      },
      (err) => {
        const liste = offen.get(k) || [];
        offen.delete(k);
        z.fehler++;
        for (const s of liste) if (s.fail) s.fail(err);
      });
  };

  /** Wie viele Motive gerade auf ihren Ausschnitt warten (unabhängig von der Zahl der Leser). */
  Object.defineProperty(kasse, 'offeneMotive', { get: () => offen.size });
  kasse.zahlen = () => ({ ...z, offeneMotive: offen.size });
  kasse.tor = function () {
    const ok = z.fehler === 0;
    return { ok, ...z,
      text: (ok ? '✓' : '⚠') + ' ' + z.fertig + ' motifs cropped once · ' + z.geteilt + ' shared requests'
        + ' (a lying card and its sky card are ONE job, up to ' + Math.max(1, z.wartendMax) + ' readers)'
        + ' · ' + offen.size + ' waiting'
        + (z.fehler ? ' · ⚠ ' + z.fehler + ' failed' : '')
        + ' · without this layer the second reader was dropped silently and stayed backside forever' };
  };
  return kasse;
}

/**
 * ⚠ **Der Selbsttest, und er ist hier nötig, nicht optional.** Die Artwork-Kette läuft über pdf.js,
 * und pdf.js rendert per `requestAnimationFrame` — in einem verdeckten Rahmen (`document.hidden`,
 * bei mir in der Vorschau immer) läuft sie **gar nicht**. Ein Mechanismus, den nur Georgs Bildschirm
 * ausführt, wäre also ungeprüft ausgeliefert — genau der Fall, gegen den die Hausregel steht.
 * Deshalb prüft dieser Test die Kasse über einer **Attrappe**: was gemessen wird, ist das Verhalten,
 * das kaputt war (der zweite Frager bekam keine Antwort), nicht das PDF.
 */
export function kasseSelbsttest() {
  const z = [];
  const auftraege = [];
  const attrappe = {
    get pending() { return auftraege.length; },
    requestArt(card, cb, fail) { auftraege.push({ card, cb, fail }); },
  };
  const k = createMotivKasse({ registry: attrappe });
  const A = { packId: 'deck', n: 7 }, A2 = { packId: 'deck', n: 7 }, B = { packId: 'deck', n: 8 };
  let a1 = 0, a2 = 0, b1 = 0, f1 = 0, f2 = 0;
  k.requestArt(A, () => a1++);
  k.requestArt(A2, () => a2++);          // dasselbe Motiv, ANDERES Objekt — die Registry sah hier nur `===`
  k.requestArt(B, () => b1++);
  z.push((auftraege.length === 2 ? '✓' : '✗') + ' two motifs, three askers → ' + auftraege.length + ' jobs (want 2)');
  auftraege[0].cb({}, 1.74);
  z.push((a1 === 1 && a2 === 1 ? '✓' : '✗') + ' both askers for the shared motif answered (' + a1 + '/' + a2 + ', want 1/1)');
  auftraege[1].cb({}, 1.74);
  z.push((b1 === 1 ? '✓' : '✗') + ' the other motif answered once (' + b1 + ')');
  // Fehlschlag muss ebenfalls an ALLE gehen — sonst wartet ein Leser für immer auf ein Motiv, das
  // nie kommt (dieselbe Klasse wie der stille Verlust, nur mit Fehler statt Erfolg).
  auftraege.length = 0;
  k.requestArt(A, () => {}, () => f1++);
  k.requestArt(A2, () => {}, () => f2++);
  auftraege[0].fail(new Error('probe'));
  z.push((f1 === 1 && f2 === 1 ? '✓' : '✗') + ' a failure reaches both askers (' + f1 + '/' + f2 + ')');
  const ok = z.every((s) => s.startsWith('✓'));
  return { ok, zeilen: z, text: (ok ? '✓ 4/4' : '✗ MISMATCH') + ' · ' + z.join(' · ') };
}
