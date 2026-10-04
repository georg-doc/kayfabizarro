// ============================================================================
// travel-heat.js — KFB Travel · Slice S1 · der eine Regie-Skalar
// ----------------------------------------------------------------------------
// EINE normalisierte 0..1-Zahl, an der jeder Effekt hängt: Kamera-Dolly, FOV,
// Terrain-Energie, später Speedlines, Rim-Intensität, Staubdichte, Tacho.
// Vorbild: TinySkies' `Plane.speedRatio` (Report §01) — dort hängt die ganze
// Bühnenregie an einer Zahl statt an sechs Sonderverdrahtungen.
//
// FORM DER SKALA (bewusst nicht linear):
//   Reisetempo belegt nur die unteren ~17 %, der ganze Rest ist Übertempo/Boost
//   mit t·(2−t)-Easing → der Einsatz knallt, das Ende läuft aus. Wer linear
//   normalisiert, bekommt eine Skala, auf der Boost kaum auffällt.
//
// DREI AUSGÄNGE:
//   heat  0..1  geglättet (Kamera, FOV, Dichten — alles, was nicht zappeln darf)
//   rate  1/s   d(heat)/dt, geglättet (der EINSATZ: Spawn-Bursts, Squash-Kicks)
//   kmh         geeichte Anzeige für den Tacho (siehe unitMeters)
//
// EICHUNG (der alte Tacho im Rollercoaster log falsch, weil diese Zahl fehlte):
//   Ein Terrain-Cube ist CELL = 3 Weltunits breit und liest sich als ein Block,
//   den ein Pet (≈1.7 units hoch) hüpfen kann → 1 unit ≈ 0.5 m. Damit:
//   Gehen 5.4 u/s ≈ 10 km/h · Sprint ≈ 17 km/h · Reiseflug 9 u/s ≈ 16 km/h ·
//   Vollgas 42 u/s ≈ 76 km/h. `unitMeters` ist der EINZIGE Eich-Regler.
//
//   const heat = createTravelHeat({});
//   heat.update(dt, { mode:'fly', speed: st.speed, boosting: st.boosting });
//   heat.update(dt, { mode:'walk', speed: ws.speed, sprinting, airborne });
//   heat.value · heat.rate · heat.kmh · heat.state
// ============================================================================

export function createTravelHeat(opts = {}) {
  const P = Object.assign({
    // Flug: aus flight-controller (SPD_MIN 2 · CRUISE 9 · SPD_MAX 42)
    flyMin: 2, flyCruise: 9, flyMax: 42,
    // Boden: aus walk-controller (speed 5.4 · sprintMul 1.75)
    walkMin: 0, walkCruise: 5.4, walkMax: 9.45,
    cruiseShare: 0.17,   // Anteil der Skala, den Reisetempo belegt
    boostFloor: 0.72,    // Boost hebt die Skala mindestens hierauf (auch bevor Tempo da ist)
    airBonus: 0.10,      // Sprung/Flugphase im Walk gibt einen kleinen Aufschlag
    smooth: 3.0,         // 1/s — Kamera-taugliche Glättung
    rateSmooth: 6.0,     // 1/s — Glättung der Ableitung
    unitMeters: 0.5,     // EICHUNG: Weltunit → Meter (s. o.)
  }, opts.params || {});

  let heat = 0, raw = 0, rate = 0, kmh = 0, boosting = false, mode = 'fly';

  // Reisetempo in die unteren cruiseShare stauchen, darüber eased bis 1
  function shape(speed, lo, cruise, hi) {
    if (speed <= lo) return 0;
    if (speed <= cruise) return P.cruiseShare * ((speed - lo) / Math.max(1e-4, cruise - lo));
    const t = Math.min(1, (speed - cruise) / Math.max(1e-4, hi - cruise));
    return P.cruiseShare + (1 - P.cruiseShare) * t * (2 - t);
  }

  function update(dt, src) {
    src = src || {};
    mode = src.mode || mode;
    const spd = src.speed || 0;
    boosting = !!src.boosting;

    raw = mode === 'walk'
      ? shape(spd, P.walkMin, P.walkCruise, P.walkMax) + (src.airborne ? P.airBonus : 0)
      : shape(spd, P.flyMin, P.flyCruise, P.flyMax);
    if (boosting) raw = Math.max(raw, P.boostFloor);
    raw = Math.max(0, Math.min(1, raw));

    const prev = heat;
    heat += (raw - heat) * Math.min(1, dt * P.smooth);
    const inst = (heat - prev) / Math.max(dt, 1e-4);
    rate += (inst - rate) * Math.min(1, dt * P.rateSmooth);
    kmh = spd * P.unitMeters * 3.6;
  }

  return {
    name: 'travel-heat', update,
    get value() { return heat; },
    get rate() { return rate; },
    get kmh() { return kmh; },
    // Sprung beim Fly⇄Walk-Wechsel vermeiden: Skala behalten, nur den Modus umschalten
    setMode(m) { mode = m; },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    reset(m) { mode = m || mode; heat = raw = rate = kmh = 0; boosting = false; },
    get state() { return { heat, raw, rate, kmh, boosting, mode, unitMeters: P.unitMeters }; },
  };
}
