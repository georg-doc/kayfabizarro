// ============================================================================
// warp-jump.js — KFB Travel v12 · Slice S77 · Der Sprung (Wurmloch)
// ----------------------------------------------------------------------------
// Nach S76 ist eine Zone ein Strahl: innerhalb 105 u pro Bein (2,5 s), zwischen
// zwei Zonen aber 500–700 u — zwölf bis siebzehn Sekunden Flug. Nichts daran ist
// kaputt, es ist nur lang. Georgs Antwort: ein Sprung.
//
// **DIESES MODUL IST EINE REGIE, KEIN EFFEKT.** Genau wie `arrival.js`: EIN
// Fortschritt, und alles andere ist eine Funktion davon. Der Effekt selbst
// entsteht aus Systemen, die es schon gibt (Konzept §3):
//
//   Strudel  → `post-radial` (dieselbe radiale Unschärfe, mit Drehung)
//   Striche  → `speed-lines` (Fahrtwind, hochgezogen)
//   Blende   → die kanonische Kartenkontur als Vollbild-Maske
//   Tempo    → `flight.SPD_MAX` kurzzeitig angehoben
//
// **Warum das Tempo und nicht ein Teleport.** Ein Ortswechsel, der die Kamera
// SETZT, ist ein zweiter Eigentümer — genau der Fehler aus S73, der aussah wie
// „die Kamera zeigt eine andere Karte als die Reise". Der Sprung hebt deshalb
// nur EINE ZAHL an: die Welt erlaubt kurz mehr Tempo. Die Physik bleibt
// dieselbe, der Pilot bleibt der Pilot, die Strecke wird wirklich geflogen —
// sie fühlt sich nur an wie ein Sprung. Und weil nichts gesetzt wird, gibt es
// nichts, was danebenliegen kann.
//
// DER FORTSCHRITT `j` (0 … 1 … 0), drei Beats:
//   Einsog   j 0 → 0,45   Strudel zieht an, Striche werden lang, Tempo steigt
//   Durch    j 0,45 → 0,8 Blende fast zu, Höchsttempo, der Ortswechsel passiert
//   Ausstoß  j 0,8 → 1    Blende auf, Tempo fällt, das Gummiband (S75) zieht ein
//
//   const jump = createWarpJump();
//   const s = jump.update(dt, { dist: auto.status.dist, flying, docked });
//   post.setStrength(s.swirl, dt); lines.setBoost(s.streak);
//   flight.setParams({ SPD_MAX: spdBase * s.speedFactor });   // ein FAKTOR auf den LEBENDEN Wert —
//   // niemals ein absoluter Wert: dann wäre dieses Modul der zweite Eigentümer der
//   // Höchstgeschwindigkeit und der Regler im Panel wirkungslos (gemessen, S77b).
// ============================================================================

export function createWarpJump(opts = {}) {
  const P = Object.assign({
    // Ab welcher Restdistanz gesprungen wird. 300 u ist die Zahl aus S76: darunter
    // ist ein Bein ≤ 3 s (fliegen ist schöner), darüber wird es Warten.
    from: 300,
    // Wo der Sprung endet: kurz vor dem Bremsweg, damit die Ankunft ungestört ist.
    to: 120,
    // Faktoren, keine Schalter — jeder Anteil einzeln verstellbar.
    boost: 3.4,        // ×Höchstgeschwindigkeit im Durchflug
    swirl: 0.085,      // Stärke der radialen Verzerrung (post-radial rechnet ab ~0,11 hart)
    streak: 2.6,       // ×Fahrtwind
    veil: 0.92,        // wie weit die Blende schließt (1 = ganz zu — nie ganz, sonst ist es ein Schnitt)
    inRate: 1.15,      // 1/s hinein …
    outRate: 2.2,      // … und schneller heraus (Ausstoß darf nicht zäh sein)
  }, opts.params || {});

  const baseMax = opts.maxSpeed || 42;   // nur noch Notnagel für `report()`; die Regie rechnet in Faktoren
  let j = 0, want = 0, runs = 0, wasIn = false;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  // Fenster auf dem Fortschritt: dieselbe Bauweise wie in `arrival.js` (`win`).
  const win = (lo, hi) => smooth(clamp01((j - lo) / Math.max(1e-4, hi - lo)));

  function update(dt, s) {
    const d = (s && s.dist) || 0;
    const erlaubt = !!(s && s.flying && !s.docked && d > 0);
    // Der Wunsch ist ein FENSTER in der Distanz, kein Ereignis: wer mitten im Sprung
    // abbremst oder andockt, fährt ihn zurück statt ihn abzubrechen.
    want = erlaubt && d > P.from ? 1 : (erlaubt && d > P.to && j > 0.02 ? 1 : 0);
    const rate = want > j ? P.inRate : P.outRate;
    j += (want - j) * Math.min(1, dt * rate);
    if (j < 0.002) j = 0;
    const drin = j > 0.5;
    if (drin && !wasIn) runs++;
    wasIn = drin;
    return this.state;
  }

  return {
    name: 'warp-jump', update,
    get j() { return j; },
    get active() { return j > 0.02; },
    get phase() { return j <= 0.02 ? 'off' : (j < 0.45 ? 'einsog' : (j < 0.8 ? 'durch' : 'ausstoß')); },
    get runs() { return runs; },
    // Die vier Ableitungen. Alle Funktionen von `j` — kein eigener Zustand, keine zweite Uhr.
    get state() {
      const ein = win(0.02, 0.45), durch = win(0.35, 0.80);
      return {
        j,
        swirl: P.swirl * ein,                       // Strudel zieht früh an
        streak: 1 + (P.streak - 1) * ein,           // Striche wachsen mit dem Sog
        veil: P.veil * durch,                       // Blende erst im Durchflug
        // **S77b · ein FAKTOR, kein absoluter Wert.** Erste Fassung gab `baseMax × …` zurück, und der
        // Runner schrieb das jeden Frame in `SPD_MAX` — damit war der Sprung der zweite Eigentümer der
        // Höchstgeschwindigkeit und der Regler im Panel wirkungslos (der Wert schnappte zurück).
        // Genau die Fehlerklasse, die dieser Slice vermeiden wollte. Ein Faktor weiß nichts über den
        // Sockel — also kann er ihn auch nicht überschreiben.
        speedFactor: 1 + (P.boost - 1) * durch,
      };
    },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    // Abnahme: dass der Sprung wirklich Zeit spart, ist eine Rechnung, keine Meinung.
    report() {
      const s = this.state;
      return {
        phase: this.phase, j: +j.toFixed(3), runs,
        faktor: +s.speedFactor.toFixed(2),
        blende: +(s.veil * 100).toFixed(0) + ' %',
        // 600 u sind das gemessene Zonen-zu-Zone-Maß aus S76. Der Sockel kommt von außen — dieses
        // Modul kennt ihn nicht (siehe `speedFactor`).
        sekunden600(basis) {
          const b = basis || 42;
          return { ohne: +(600 / b).toFixed(1), mit: +(600 / (b * P.boost)).toFixed(1) };
        },
      };
    },
  };
}
