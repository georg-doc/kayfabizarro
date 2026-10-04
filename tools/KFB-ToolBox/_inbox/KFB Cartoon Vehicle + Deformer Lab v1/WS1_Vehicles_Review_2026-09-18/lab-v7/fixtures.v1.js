/**
 * lab-v7/fixtures.v1.js · Feste Bewegungs-Fixtures für Fahrzeuge.
 *
 * Geschrieben gegen `skills/kfb-cartoon-animation_v2.md`. Was daraus WÖRTLICH gilt und hier als
 * Zahl steht, nicht als Absicht:
 *
 *   §2.1 Ursache → Antizipation → Aktion → Impakt → Nachschwingen → Rückkehr. Jede Fixture hat
 *        alle Phasen, und keine endet ohne Rückkehr in den Ruhezustand.
 *   §11.1 powerJump: 0–120 Stauchung · 120–310 Abflug · 310–560 Flugbogen · 560–680 Landeansatz ·
 *        680 Kontakt mit Hitstop · 680–860 Nachschwingen. Diese Millisekunden sind übernommen.
 *   §2.2 Timing ≠ Spacing. Darum interpoliert der Sampler mit `smoothstep`, nicht linear, und die
 *        Landung hat einen HALT (zwei gleiche Stützwerte) — ein Halt ist Spacing, keine Dauer.
 *   §12.3 Jede Fixture nennt ihren erwarteten Haupt-Read. Ohne den ist ein Beweisbild wertlos.
 *
 * Was hier NICHT passiert: Partikel, Wörter, Kamera, Ton. Der Skill verlangt die Reihenfolge
 * (§15): erst die Choreografie, dann Ton, dann Kamera. Diese Scheibe ist die Choreografie.
 *
 * Einheiten: `pose` −1…1 (Anteile der Deformer-Grenzen), `pitch/roll/yaw` Grad, `lift` in
 * Fahrzeughöhen, `speed` in Fahrzeuglängen je Sekunde, `susp` in Fahrzeughöhen, `scrunch` 0…0,5.
 */
export const SCHEMA = 'kfb.vehicle-fixtures/1';

const smooth = (u) => u * u * (3 - 2 * u);

/** Stützwerte [[ms, wert], …]; dazwischen smoothstep, außerhalb der letzte Wert. */
function track(pairs) {
  return (t) => {
    if (!pairs.length) return 0;
    if (t <= pairs[0][0]) return pairs[0][1];
    for (let i = 1; i < pairs.length; i++) {
      const [t1, v1] = pairs[i], [t0, v0] = pairs[i - 1];
      if (t <= t1) { const u = t1 === t0 ? 1 : smooth((t - t0) / (t1 - t0)); return v0 + (v1 - v0) * u; }
    }
    return pairs[pairs.length - 1][1];
  };
}

const K = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, track(v)]));

export const FIXTURES = [
  {
    id: 'launch', label: 'Start', family: 'jump', durationMs: 900,
    meaning: 'Ein gewollter Antritt aus dem Stand, mit Gewicht auf der Hinterachse.',
    primaryRead: 'Karosserie sinkt, dann schießt sie in die Länge — die Richtung ist vor dem Tempo lesbar.',
    phases: [['anticipation', 0, 140], ['action', 140, 420], ['followThrough', 420, 700], ['recovery', 700, 900]],
    tracks: K({
      squash: [[0, 0], [140, 0.45], [300, -0.1], [700, 0], [900, 0]],
      stretch: [[0, 0], [140, -0.15], [330, 0.8], [620, 0.25], [900, 0]],
      bend: [[0, 0]], twist: [[0, 0], [160, -0.12], [420, 0.1], [900, 0]],
      pitch: [[0, 0], [140, 2.5], [340, -5.5], [700, -1], [900, 0]],
      roll: [[0, 0]], yaw: [[0, 0]], lift: [[0, 0]],
      speed: [[0, 0], [140, 0], [420, 2.2], [900, 3.0]],
      steer: [[0, 0]], susp: [[0, 0], [140, -0.05], [340, 0.02], [700, 0], [900, 0]],
      scrunch: [[0, 0], [140, 0.18], [340, 0], [900, 0]],
    }),
  },
  {
    id: 'jump', label: 'Sprung', family: 'jump', durationMs: 900,
    meaning: 'Absprung von einer Kante, Flugbogen, gewichtete Landung.',
    primaryRead: 'Der Flugbogen und der Einschlag: Stauchung am Kontakt, danach ein einziges Nachschwingen.',
    phases: [['anticipation', 0, 120], ['action', 120, 310], ['followThrough', 310, 560], ['impact', 560, 700], ['recovery', 700, 900]],
    tracks: K({
      /* Landung 680 ms mit Halt: zwei gleiche Stützwerte bei 680 und 700 sind der Hitstop. */
      squash: [[0, 0], [120, 0.5], [310, -0.35], [560, -0.15], [680, 1.0], [700, 1.0], [800, -0.2], [900, 0]],
      stretch: [[0, 0], [120, -0.2], [310, 0.65], [560, 0.3], [680, -0.5], [780, 0.12], [900, 0]],
      bend: [[0, 0]], twist: [[0, 0], [310, 0.08], [680, -0.1], [900, 0]],
      pitch: [[0, 0], [120, 3], [310, -7], [430, -2], [560, 4], [680, 6], [780, -2], [900, 0]],
      roll: [[0, 0]], yaw: [[0, 0]],
      lift: [[0, 0], [120, -0.03], [310, 0.55], [430, 0.75], [560, 0.35], [680, 0], [900, 0]],
      speed: [[0, 1.6], [900, 1.6]],
      steer: [[0, 0]],
      susp: [[0, 0], [120, -0.06], [310, 0.04], [560, 0.04], [680, -0.09], [700, -0.09], [820, 0.01], [900, 0]],
      scrunch: [[0, 0], [120, 0.2], [310, 0], [660, 0], [680, 0.42], [700, 0.42], [820, 0], [900, 0]],
    }),
  },
  {
    id: 'landing', label: 'Landung', family: 'impact', durationMs: 860,
    meaning: 'Nur der Einschlag, isoliert — die Fixture für Gewicht und Rückkehr.',
    primaryRead: 'Ein harter Kontakt mit Halt, dann genau ein Überschwingen, dann Ruhe.',
    phases: [['impact', 0, 95], ['followThrough', 95, 420], ['recovery', 420, 860]],
    tracks: K({
      squash: [[0, -0.2], [40, 1.0], [95, 1.0], [260, -0.28], [460, 0.08], [860, 0]],
      stretch: [[0, 0.3], [40, -0.55], [95, -0.5], [260, 0.16], [860, 0]],
      bend: [[0, 0]], twist: [[0, 0], [95, -0.14], [300, 0.06], [860, 0]],
      pitch: [[0, 5], [40, 7.5], [95, 7], [300, -2.5], [860, 0]],
      roll: [[0, 0]], yaw: [[0, 0]], lift: [[0, 0.08], [40, 0], [860, 0]],
      speed: [[0, 1.4], [860, 1.2]], steer: [[0, 0]],
      susp: [[0, 0.05], [40, -0.1], [95, -0.1], [300, 0.02], [860, 0]],
      scrunch: [[0, 0], [40, 0.45], [95, 0.45], [320, 0], [860, 0]],
    }),
  },
  {
    id: 'corner', label: 'Kurve', family: 'turn', durationMs: 1000,
    meaning: 'Eine schnelle Kurve nach links mit Gewichtsverlagerung und Banane.',
    primaryRead: 'Die Karosserie legt sich nach außen und biegt zur Innenseite — man sieht, wohin gelenkt wird.',
    phases: [['anticipation', 0, 160], ['action', 160, 620], ['followThrough', 620, 820], ['recovery', 820, 1000]],
    tracks: K({
      squash: [[0, 0], [300, 0.12], [700, 0.1], [1000, 0]],
      stretch: [[0, 0], [1000, 0]],
      bend: [[0, 0], [160, -0.12], [420, 0.85], [700, 0.7], [1000, 0]],
      twist: [[0, 0], [160, -0.1], [420, 0.55], [760, 0.2], [1000, 0]],
      pitch: [[0, 0], [160, 1.5], [1000, 0]],
      roll: [[0, 0], [140, -1.5], [420, 9], [700, 7.5], [900, -1.5], [1000, 0]],
      yaw: [[0, 0]], lift: [[0, 0]],
      speed: [[0, 2.4], [420, 1.7], [1000, 2.2]],
      steer: [[0, 0], [140, -3], [420, 26], [700, 22], [900, 0], [1000, 0]],
      susp: [[0, 0], [420, -0.03], [1000, 0]],
      scrunch: [[0, 0], [420, 0.12], [1000, 0]],
    }),
  },
  {
    id: 'brake', label: 'Notbremse', family: 'impact', durationMs: 900,
    meaning: 'Vollbremsung aus Tempo: Nicken nach vorn, ein Überschwingen zurück, Stand.',
    primaryRead: 'Das Vorwärtsnicken und der eine Rückschwinger — kein Zittern, kein Dauerwackeln.',
    phases: [['action', 0, 120], ['impact', 120, 260], ['followThrough', 260, 640], ['recovery', 640, 900]],
    tracks: K({
      squash: [[0, 0], [180, 0.3], [420, -0.1], [900, 0]],
      stretch: [[0, 0.1], [180, -0.35], [480, 0.12], [900, 0]],
      bend: [[0, 0]], twist: [[0, 0], [200, 0.1], [520, -0.05], [900, 0]],
      pitch: [[0, 0], [60, -2], [220, 9.5], [420, -3.5], [640, 1], [900, 0]],
      roll: [[0, 0]], yaw: [[0, 0]], lift: [[0, 0]],
      speed: [[0, 3.0], [260, 1.0], [520, 0], [900, 0]],
      steer: [[0, 0]],
      susp: [[0, 0], [220, -0.07], [480, 0.02], [900, 0]],
      scrunch: [[0, 0], [220, 0.3], [560, 0], [900, 0]],
    }),
  },
];

export const BY_ID = Object.fromEntries(FIXTURES.map((f) => [f.id, f]));

/** Ein Zustand aus einer Fixture zum Zeitpunkt t (ms). Reine Funktion, kein Zustand im Modul. */
export function sample(id, t) {
  const f = BY_ID[id]; if (!f) return null;
  const tt = Math.max(0, Math.min(f.durationMs, t));
  const g = (k) => +f.tracks[k](tt).toFixed(4);
  const ph = (f.phases.find(([, a, b]) => tt >= a && tt < b) || f.phases[f.phases.length - 1])[0];
  return {
    id, t: tt, phase: ph, durationMs: f.durationMs, primaryRead: f.primaryRead,
    pose: { squash: g('squash'), stretch: g('stretch'), bend: g('bend'), twist: g('twist') },
    attitude: { pitch: g('pitch'), roll: g('roll'), yaw: g('yaw'), lift: g('lift') },
    wheels: { speed: g('speed'), steer: g('steer'), susp: g('susp'), scrunch: g('scrunch') },
  };
}

/** Ruhezustand — der eine Zustand, in den jede Fixture zurückkehren MUSS (§2.1 Recovery). */
export const REST = Object.freeze({
  pose: { squash: 0, stretch: 0, bend: 0, twist: 0 },
  attitude: { pitch: 0, roll: 0, yaw: 0, lift: 0 },
  wheels: { speed: 0, steer: 0, susp: 0, scrunch: 0 },
});
