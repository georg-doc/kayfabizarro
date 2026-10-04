/**
 * lab-v8/travel-flight-seam.v1.js · DIE EINE NAHT zwischen Travel und dem Flight-Deformer.
 *
 * ═══ EIGENTUM ═══════════════════════════════════════════════════════════════════════════════
 * Travel bleibt alleiniger Eigentuemer von Weltposition, Kugelbewegung, Tempo, Kurs, Hoehe,
 * Schraeglage, Nickwinkel, Flugeingabe und Kamera (`travel/CONTRACT.md`: Flugbewegung gehoert
 * `globe-v13/carpet.js` AUSSCHLIESSLICH, Flugeingaben `globe-v13/flight-controls.js`).
 *
 * Diese Datei schreibt in KEINEN dieser Werte. Sie liest den Zustand, den Travel ohnehin schon
 * fuehrt, und legt EINEN Block daneben, den die Praesentation verbraucht. Es entsteht keine
 * zweite Physik und kein zweiter Flight-Controller: `carpet.js` und `flight-controls.js` laufen
 * in dieser Werkbank UNVERAENDERT als Vendor (`lab-v8/vendor-travel/`).
 *
 * ═══ DIE VORLAGE, DIE ES SCHON GIBT ═════════════════════════════════════════════════════════
 * Travel hat diese Naht bereits einmal gebaut — fuer den Kartentraeger. `globe-poc.js` fuellt je
 * Bild `carrierState` und `card-carrier.js` liest daraus:
 *
 *     position, quaternion  ← carpet.matrix() zerlegt
 *     speed                 ← S.speed
 *     bank                  ← S.bankAngle          (rad)
 *     pitchTilt             ← S.pitch              (rad)
 *     boosting              ← controls.elevate     (bool)
 *     climbIn               ← controls.elevate ? 1 : 0
 *
 * Diese fuenf Namen werden hier NICHT umbenannt. Der Block ist eine Erweiterung derselben Naht,
 * keine zweite daneben. Was Georgs Entwurf zusaetzlich verlangt (`speedNorm`, `longAccel`,
 * `turnRate`, `yawRate`, `drifting`, `gust`, `impact`, `touchdown`, `dt`), bekommt je Feld eine
 * ausdrueckliche Herkunft: TRAVEL, DERIVED (genau einmal, hier) oder UNAVAILABLE.
 *
 * ═══ REGEL FUER ABLEITUNGEN ═════════════════════════════════════════════════════════════════
 * Eine abgeleitete Groesse wird EINMAL gerechnet, an dieser Stelle, aus Werten, die Travel
 * schreibt — und sie wird als abgeleitet gemeldet. Kein Feld wird aus einem zweiten Integrator,
 * einem zweiten Tastenleser oder einem zweiten Zustandsautomaten geholt.
 */
import { createCarpet, CARPET_QUELLE } from './vendor-travel/carpet.js';
import { createFlightControls } from './vendor-travel/flight-controls.js';
import { TERRAIN_TYPES } from './vendor-travel/simplex-noise.js';

export const SCHEMA = 'kfb.travel-flight-seam/1';
export { TERRAIN_TYPES };

/** Das Reisetempo, mit dem Travel den Kurs glaettet — `flight-controls.js` TURN_SPEED. */
const TURN_SPEED = 1.2;

/**
 * Herkunft je Feld. Diese Tabelle ist die Abnahme dieser Datei: sie wird in der Oberflaeche
 * angezeigt, damit niemand raten muss, welche Zahl aus Travel kommt und welche hier entsteht.
 */
export const SEAM_FIELDS = [
  ['speed', 'TRAVEL', 'carpet.state.speed', 'Weltmass je Sekunde. Derselbe Wert, den globe-poc in carrierState.speed legt.'],
  ['speedNorm', 'TRAVEL', 'carpet.tempoAnzeige', 'Travel fuehrt diesen Getter bereits als ANZEIGE-Groesse (speed/maxSpeed). Nicht speedRatio — die misst den Abstand zum Sockel und steht im Reiseflug auf 0.'],
  ['bank', 'TRAVEL', 'carpet.state.bankAngle / maxBank', 'Schraeglage aus Lenkung plus Driftwinkel, von Travel gerechnet. Hier nur auf -1..1 normiert. Es gibt keinen zweiten Pose-Regler.'],
  ['pitch', 'TRAVEL', 'carpet.state.pitch / climbPitchMax', 'Nickwinkel aus der Steigrate, von Travel gerechnet.'],
  ['drifting', 'TRAVEL', 'carpet.state.drifting · carpet.driftIntensity', 'Travel besitzt den Drift-Zustand und die Intensitaet.'],
  ['climbIn', 'TRAVEL', 'controls.elevate ? 1 : 0', 'Die Steig-EINGABE. Genau die Zeile, die globe-poc.js schon schreibt.'],
  ['boosting', 'TRAVEL', 'controls.elevate', 'Schub. Genau die Zeile, die globe-poc.js schon schreibt (in dieser Fassung ist elevate der Schub).'],
  ['dt', 'TRAVEL', 'Wirt-Uhr', 'Kommt herein. Kein Modul haelt eine eigene Uhr (CONTRACT, PM-50).'],
  ['longAccel', 'DERIVED', 'd(speed)/dt, normiert auf accel bzw. brakeDecel', 'Travel liefert keine Laengsbeschleunigung. EINMAL hier abgeleitet aus dem Tempo, das Travel schreibt; Glaettung 12/s, weil eine Differenz bei schwankendem dt sonst flackert.'],
  ['yawRate', 'DERIVED', 'wrapPi(d heading)/dt', 'Travel haelt die geglaettete Lenkeingabe privat. Gemessen wird stattdessen die tatsaechliche Kursaenderung — EINE Messung, zwei Ansichten (yawRate roh, turnRate normiert).'],
  ['turnRate', 'DERIVED', 'yawRate / (TURN_SPEED · turnMult)', 'Dieselbe Messung wie yawRate, auf -1..1 gebracht. 1,2 aus flight-controls.js, 1,45 aus CARPET_QUELLE.turnMult.'],
  ['touchdown', 'DERIVED', 'agl faellt unter hoverHeight · 1,05 bei negativer Rate', 'Travel feuert Bodenkontakt auf dem fx-Bus (ground.touch). Liegt kein fx-Bus an, wird das Ereignis hier aus der Hoehe ueber Grund abgeleitet, die Travel fuehrt. Wiederbewaffnung ab agl > 2,5 · hoverHeight.'],
  ['gust', 'UNAVAILABLE', '—', 'Travel kennt keine Boe. Kein Eigentuemer, keine Ableitung: das Feld bleibt 0, bis eine Quelle es liefert. Im Labor wird es von Hand gefeuert und ist dann als LABOR markiert.'],
  ['impact', 'UNAVAILABLE', 'fx.fire(...) beim Empfaenger', 'Einschlaege gehoeren in Travel dem fx-Bus (landmark-collide, sky-enemies). Die Naht nimmt sie entgegen (inject), erfindet sie aber nicht.'],
];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const wrapPi = (a) => (((a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;

/**
 * Der Adapter. Bekommt einen LAUFENDEN Travel-Flug herein und gibt je Bild den Block zurueck.
 *
 * @param {object} o
 * @param {object} o.carpet    das Ergebnis von `createCarpet` (Travel, unveraendert)
 * @param {object} [o.controls] das Ergebnis von `createFlightControls` (Travel, unveraendert)
 */
export function createTravelFlightSeam({ carpet, controls } = {}) {
  const P = carpet ? carpet.params : CARPET_QUELLE;
  const TURN_FULL = TURN_SPEED * P.turnMult;

  let prevSpeed = carpet ? carpet.state.speed : 0;
  let prevHeading = carpet ? carpet.state.heading : 0;
  let accelSmooth = 0;
  /* ⚠ Unbewaffnet starten. `carpet.js` setzt die Anfangshoehe auf `surfaceAlt + hoverHeight` —
     agl ist im ersten Bild also GENAU die Schwelle, und ein bewaffneter Wachhund haette beim
     Start ein Aufsetzen gemeldet, das nie stattgefunden hat. Bewaffnet wird erst, wer oben war. */
  let armed = false;
  const injected = { gust: 0, impact: 0, impactSide: 0, touchdown: 0 };

  const block = {
    speed: 0, speedNorm: 0, longAccel: 0, turnRate: 0, bank: 0, pitch: 0, yawRate: 0,
    climbIn: 0, drifting: 0, boosting: false, gust: 0, impact: 0, touchdown: 0, dt: 0,
  };
  const origin = {};
  SEAM_FIELDS.forEach(([k, s]) => { origin[k] = s; });

  const api = {
    schema: SCHEMA,
    fields: SEAM_FIELDS,
    origin,
    get block() { return Object.assign({}, block); },

    /**
     * Ereignisse, die Travel auf seinem fx-Bus fuehrt (oder das Labor von Hand feuert).
     * `name` folgt der Travel-Schreibweise, damit der Empfaenger spaeter nur den Bus anhaengen
     * muss: `fx.on('ground.touch', () => seam.inject('ground.touch'))`.
     */
    inject(name, ctx = {}) {
      const s = clamp(ctx.strength != null ? ctx.strength : 1, 0, 1);
      if (name === 'ground.touch' || name === 'touchdown') injected.touchdown = s;
      else if (name === 'impact' || name === 'landmark.hit') { injected.impact = s; injected.impactSide = Math.sign(ctx.side || 1); }
      else if (name === 'gust') injected.gust = clamp(ctx.side != null ? ctx.side * s : s, -1, 1);
      return api;
    },

    /** Ein Aufruf je Bild, NACH `carpet.update`. */
    sample(dt, ctrl) {
      const S = carpet.state;
      const h = Math.max(1e-4, Math.min(0.5, dt || 0));

      /* TRAVEL — durchgereicht, nur normiert. */
      block.dt = h;
      block.speed = S.speed;
      block.speedNorm = carpet.tempoAnzeige;
      block.bank = clamp(S.bankAngle / P.maxBank, -1, 1);
      block.pitch = clamp(S.pitch / P.climbPitchMax, -1, 1);
      block.drifting = S.drifting ? carpet.driftIntensity : 0;
      block.boosting = !!(ctrl && ctrl.elevate);
      block.climbIn = (ctrl && ctrl.elevate) ? 1 : 0;

      /* DERIVED — genau einmal, hier. */
      const raw = (S.speed - prevSpeed) / h;
      prevSpeed = S.speed;
      const ref = raw >= 0 ? P.accel : P.brakeDecel;
      accelSmooth += (clamp(raw / ref, -1, 1) - accelSmooth) * (1 - Math.exp(-12 * h));
      block.longAccel = +accelSmooth.toFixed(4);

      const dHead = wrapPi(S.heading - prevHeading) / h;
      prevHeading = S.heading;
      block.yawRate = +dHead.toFixed(4);
      block.turnRate = clamp(dHead / TURN_FULL, -1, 1);

      /* Aufsetzen: aus der Hoehe ueber Grund, die Travel fuehrt. Ein Ereignis, das der Empfaenger
         schon feuert (`fx.fire('ground.touch')`), gewinnt — dann ist hier nichts abzuleiten. */
      const agl = carpet.agl;
      if (agl > P.hoverHeight * 2.5) armed = true;
      let touch = injected.touchdown;
      if (!touch && armed && agl <= P.hoverHeight * 1.05) {
        armed = false;
        touch = clamp(Math.abs(Math.min(0, block.pitch)) + 0.35, 0, 1);
      }
      block.touchdown = touch;
      block.impact = injected.impact;
      block.impactSide = injected.impactSide;
      block.gust = injected.gust;
      injected.touchdown = 0; injected.impact = 0; injected.gust = 0;
      return block;
    },

    /** Was diese Runde NICHT aus Travel kommt — fuer die Oberflaeche. */
    report() {
      return {
        travel: SEAM_FIELDS.filter((f) => f[1] === 'TRAVEL').map((f) => f[0]),
        derived: SEAM_FIELDS.filter((f) => f[1] === 'DERIVED').map((f) => f[0]),
        unavailable: SEAM_FIELDS.filter((f) => f[1] === 'UNAVAILABLE').map((f) => f[0]),
        carpetAbweichungen: carpet ? carpet.abweichungen() : null,
        carpetZeile: carpet ? carpet.zeile() : null,
      };
    },
  };
  return api;
}

/**
 * Ein LAUFENDER Travel-Flug fuer die Werkbank. Das ist kein zweiter Controller: hier wird nur
 * `createCarpet` und `createFlightControls` aus dem Vendor-Ordner gestartet — dieselben Dateien,
 * die Travel ausliefert, byteweise unveraendert. Die Werkbank besitzt nichts davon; sie ruft
 * `update` und liest.
 *
 * Kein Globus, kein Gelaende-Netz, keine Kamera: fuer die Naht zaehlt der ZUSTAND, und den
 * rechnet `carpet.js` aus Saat und Gelaendeart ohne jede Darstellung.
 */
export function createTravelFlight({ THREE, seed = 1337, terrainType = 'default', globeRadius = 5, element = null } = {}) {
  const carpet = createCarpet({ THREE, globeRadius, seed, terrainType });
  const controls = createFlightControls(element);
  const seam = createTravelFlightSeam({ carpet, controls });
  let last = null;
  return {
    carpet, controls, seam, globeRadius, seed, terrainType,
    /** Ein Bild: Travel rechnet, die Naht liest. Reihenfolge ist nicht verhandelbar. */
    step(dt) {
      const c = controls.getState();
      carpet.update(dt, c.turnRate, c.forward, c.brake, c.elevate, c.descend);
      if (c.schwebeToggle) carpet.setSchwebe(!carpet.schwebt);
      last = seam.sample(dt, c);
      return { block: last, ctrl: c };
    },
    get lastBlock() { return last; },
    dispose() { controls.dispose(); },
  };
}

/**
 * Eingabespur. KEINE Physik — sie druckt Tasten. Die Spur dispatcht echte `KeyboardEvent`s ans
 * Fenster, also liest `flight-controls.js` sie auf demselben Weg wie eine Hand. Dadurch wird die
 * Tastenbelegung mitgeprueft (A ist PLUS turnRate, Pfeil-hoch steigt, Leertaste ist die Aktion)
 * statt umgangen.
 */
export function createKeyTrack() {
  const held = new Set();
  const press = (key, down) => {
    const k = key.toLowerCase();
    if (down && held.has(k)) return;
    if (!down && !held.has(k)) return;
    if (down) held.add(k); else held.delete(k);
    dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { key, bubbles: true }));
  };
  let steps = null, t = 0, idx = 0;
  const api = {
    get active() { return !!steps; },
    get t() { return t; },
    get end() { return steps ? steps[steps.length - 1][0] : 0; },
    get held() { return [...held]; },
    /** steps: [[ms, {w:true, a:true, arrowup:false}], …] — gehaltene Tasten je Marke. */
    start(list) { api.stop(); steps = list; t = 0; idx = 0; api.apply(list[0][1]); return api; },
    apply(set) {
      const want = new Set(Object.keys(set || {}).filter((k) => set[k]));
      [...held].forEach((k) => { if (!want.has(k)) press(k, false); });
      want.forEach((k) => press(k, true));
    },
    update(dt) {
      if (!steps) return null;
      t += dt * 1000;
      while (idx + 1 < steps.length && t >= steps[idx + 1][0]) { idx++; api.apply(steps[idx][1]); }
      if (t > steps[steps.length - 1][0]) { api.stop(); return { done: true }; }
      return { t, idx };
    },
    stop() { [...held].forEach((k) => press(k, false)); steps = null; t = 0; idx = 0; return api; },
  };
  return api;
}
