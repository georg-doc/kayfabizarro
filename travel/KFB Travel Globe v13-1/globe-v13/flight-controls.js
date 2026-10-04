// ============================================================================
// flight-controls.js — Tastenbelegung, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/FlightControls.ts (gelesen 27.8.2026).
//
// **Das ist der Teil, den ich vorher selbst erfunden hatte, und genau deshalb war er falsch.**
// Die echte Belegung: A/D lenken (A = PLUS turnRate, nicht minus), W vorwärts, S bremsen,
// **Pfeil-hoch** steigen (nicht Leertaste), Leertaste ist die Aktion, F ist Interaktion.
// TURN_SPEED 1.2 — ein Wert, der zusammen mit CARPET_TURN_MULT 1.45 das Kurvengefühl ergibt.
//
// Die Einmal-Aktionen (`paintball`, `specialAction`, `interact`) werden beim Lesen VERBRAUCHT:
// eine gedrückte Taste feuert genau einmal, nicht jeden Frame. Auch das hatte ich vorher anders.
// ============================================================================

const TURN_SPEED = 1.2;

export function createFlightControls(element) {
  const keys = new Set();
  let enabled = true;
  let paintballQueued = false, specialActionQueued = false, interactQueued = false;
  // v12 · Eigene Erweiterung, deklariert: H schaltet das Schweben. Wie die anderen Einmal-Aktionen
  // wird sie beim LESEN verbraucht — ein gehaltenes H soll nicht jeden Frame umschalten.
  let schwebeQueued = false;

  const onKeyDown = (e) => {
    if (!enabled) return;
    const key = e.key.toLowerCase();
    if (key === ' ' && !e.repeat) { paintballQueued = true; specialActionQueued = true; }
    if (key === 'f' && !e.repeat) { interactQueued = true; }
    if (key === 'h' && !e.repeat) { schwebeQueued = true; }
    if (key === ' ' || key === 'arrowup' || key === 'arrowdown') e.preventDefault();
    keys.add(key);
  };
  const onKeyUp = (e) => { keys.delete(e.key.toLowerCase()); };
  const reset = () => { keys.clear(); };

  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);
  if (element) element.addEventListener('blur', reset);
  // ⚠ **Der Fall, der Georg als „Geschwindigkeit ändert sich willkürlich ohne Input" begegnet ist.**
  // Verlässt der Fokus das Fenster WÄHREND eine Taste gedrückt ist, kommt das `keyup` nie an: W
  // bleibt für immer „gedrückt", der Teppich gibt dauerhaft Gas, und beim nächsten Klick ins Bild
  // löst sich das schlagartig — genau „zu schnell, dann verzögert". Die Quelle horcht nur auf
  // `blur` des übergebenen Elements; ein Canvas bekommt `blur` aber nur, wenn er fokussierbar ist.
  // Deshalb zusätzlich am Fenster und an der Sichtbarkeit. Das ist keine neue Mechanik, sondern
  // dieselbe Absicht (`reset`) an den Stellen, an denen sie in dieser Umgebung greift.
  addEventListener('blur', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });

  return {
    name: 'flight-controls',
    get enabled() { return enabled; },
    set enabled(v) { enabled = v; if (!v) keys.clear(); },
    getState() {
      if (!enabled) {
        return { turnRate: 0, forward: false, brake: false, elevate: false,
                 descend: false, paintball: false, specialAction: false, interact: false,
                 schwebeToggle: false };
      }
      let turnRate = 0;
      if (keys.has('a')) turnRate += TURN_SPEED;
      if (keys.has('d')) turnRate -= TURN_SPEED;
      const forward = keys.has('w');
      const brake = keys.has('s');
      const elevate = keys.has('arrowup');
      // v12 · Pfeil-runter stand im Vertrag (descend) und wurde nie belegt — im Schweben ist es das
      // Gegenstück zu Pfeil-hoch, im Reiseflug bleibt es wirkungslos (die Quelle kennt kein Sinken).
      const descend = keys.has('arrowdown');
      const paintball = paintballQueued; paintballQueued = false;
      const specialAction = specialActionQueued; specialActionQueued = false;
      const interact = interactQueued; interactQueued = false;
      const schwebeToggle = schwebeQueued; schwebeQueued = false;
      return { turnRate, forward, brake, elevate, descend, paintball, specialAction, interact, schwebeToggle };
    },
    dispose() {
      removeEventListener('keydown', onKeyDown);
      removeEventListener('keyup', onKeyUp);
    },
  };
}
