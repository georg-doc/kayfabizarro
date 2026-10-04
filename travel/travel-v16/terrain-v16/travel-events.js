// ============================================================================
// travel-events.js — KFB Travel · Slice S45 (V9-D) · Ereignisse an EINEM Ort
// ----------------------------------------------------------------------------
// Vier der fünf Audits wollen einen Event-Bus. Die Intermission hat das begründet
// abgelehnt (§4a) und gemessen, warum: wir haben **acht Ereignisse mit je genau
// einem Zuhörer**. Ein Bus entfernt diese Verdrahtung nicht, er verlegt sie — und
// macht dabei die Aufrufreihenfolge implizit. In einem Projekt, dessen letzte
// Fehler Reihenfolge- und Eigentumsfehler waren, ist das die falsche Richtung.
//
// **Was wirklich fehlte, war nicht ein Bus, sondern eine TABELLE.** Vorher standen
// die acht Zuweisungen über 100 Zeilen verstreut zwischen Systemaufbau und HUD:
//
//     skyCards.onPass = (data, n) => { … };        // Zeile 371
//     academy.onFocus = (c) => { … };              // Zeile 426
//     auto.onWarn = (w) => { … };                  // Zeile 460
//
// Jetzt hängt jedes über `EV.on(besitzer, name, was, fn)` an einer Stelle, mit
// Klartext-Beschreibung, Zähler und Zeitstempel. Das ist derselbe Gewinn, den der
// Modus-Eigentümer gebracht hat: **benannte Vorgänge sind diagnostizierbar.** Der
// Fehler „warum kommt die Ankunft nicht an?" ist damit eine Tabellenzeile.
//
// Dazu **Fehler-Isolation**: eine werfende Rückmeldung darf den Sender nicht
// mitnehmen. Vorher hatte jeder Sender sein eigenes `try/catch` — oder auch nicht.
//
// **Die Regel bleibt:** ein Ereignis bekommt erst dann einen Verteiler, wenn es
// ≥3 Zuhörer hat. Bis dahin ist ein Zuhörer ein Zuhörer, und die Tabelle sagt, wer.
//
//   const EV = createEventTable();
//   EV.on(auto, 'onArrive', 'Anflug angekommen → Karte besucht, Dock anfordern', (card) => …);
//   EV.table   // [{ owner, event, was, calls, lastAt, broke }]
// ============================================================================

export function createEventTable(opts = {}) {
  const rows = [];
  const onError = opts.onError || null;

  function on(owner, event, was, fn) {
    if (!owner || typeof fn !== 'function') { console.warn('[events] ungültige Anmeldung', event); return null; }
    const row = { owner: (owner.name || '?'), event, was, calls: 0, lastAt: 0, broke: false };
    rows.push(row);
    owner[event] = function wrapped(...args) {
      row.calls++; row.lastAt = performance.now();
      try { return fn.apply(null, args); } catch (e) {
        // Einmal melden. Eine werfende Rückmeldung darf den Sender nicht mitnehmen —
        // sonst stirbt der Auto-Pilot an einer HUD-Zeile.
        if (!row.broke) {
          row.broke = true;
          console.error('[events] „' + was + '" (' + row.owner + '.' + event + ') wirft', e);
          if (onError) { try { onError(row, e); } catch (e2) {} }
        }
      }
    };
    return row;
  }

  return {
    name: 'travel-events', on,
    get table() { return rows.map((r) => ({ owner: r.owner, event: r.event, was: r.was, calls: r.calls,
      seit: r.lastAt ? +((performance.now() - r.lastAt) / 1000).toFixed(1) : null, broke: r.broke })); },
    get count() { return rows.length; },
    get broken() { return rows.filter((r) => r.broke).map((r) => r.owner + '.' + r.event); },
    // Wer mehr als einen Zuhörer hätte, wäre der Kandidat für einen echten Verteiler.
    get duplicates() {
      const seen = {}, dup = [];
      for (const r of rows) { const k = r.owner + '.' + r.event; if (seen[k]) dup.push(k); seen[k] = 1; }
      return dup;
    },
  };
}
