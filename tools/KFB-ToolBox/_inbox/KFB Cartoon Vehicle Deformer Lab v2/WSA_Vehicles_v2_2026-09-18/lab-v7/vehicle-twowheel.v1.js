/**
 * lab-v7/vehicle-twowheel.v1.js · Motion-Familie »Zwei-Rad-Schräglage«.
 * Georgs Auftrag vom 18.09.: »seitlich gekippte cartoon stunt-fahrt auf 2 rädern zb entlang
 * einer bande oder hausfassade«.
 *
 * WAS MAN SEHEN SOLL (ein Read, §1.2)
 *   Das Fahrzeug steht auf zwei Rädern und HÄLT sich dort. Nicht: es ist gekippt.
 * Der Unterschied ist die Haltephase. Ein starr gehaltener Winkel liest als Standbild oder als
 * Fehler; was es zum Stunt macht, sind die kleinen Balancekorrekturen, mit denen das Fahrzeug
 * gegen das Umfallen arbeitet. Darum ist die Haltephase hier keine Pause, sondern der Kern.
 *
 * DIE KIPPACHSE IST GEMESSEN, nicht gesetzt: die äußere Laufflaechenkante der Räder einer Seite,
 * also x = ±(Spurweite + Radbreite)/2, Höhe y = 0. Gedreht wird um DIESE Linie.
 *
 * WARUM NICHT DIE RADMITTE: erste Fassung nahm die Spurweite allein. Gemessen sanken die unteren
 * Räder dann 0,0186 u (bei 37,3°) bzw. 0,027 u (bei 62,1°) unter den Boden. Beide Werte ergeben
 * dieselbe Rechnung: die tiefste Stelle liegt bei −sinφ × (Radmitte − Drehpunkt + Radbreite/2),
 * und daraus folgt für car_hatchback zweimal unabhängig eine Radbreite von 0,061 u. Ein gerolltes
 * Rad steht auf seiner KANTE, nicht auf seiner Mittelebene — und damit ist der Hebel gegen das
 * Umfallen auch größer als die halbe Spurweite. Beides hängt an derselben Zahl.
 *
 * WARUM y = 0 UND NICHT `rig.frame.contactY`: erste Fassung nahm `contactY` und kippte um eine
 * Achse UNTER dem Asphalt. `carrig` MISST `contactY` VOR dem Einbacken und verschiebt danach die
 * ganze Geometrie um −contactY — im Rig-Raum liegt der Boden also auf genau 0, und
 * `frame.contactY` ist der alte Modellwert (bei car_hatchback −0,15 u). Im selben `frame`-Objekt
 * steht `height` dagegen NACH dem Backen. Wer die beiden mischt, misst am falschen Nullpunkt.
 *
 * DER KIPPWINKEL IST GERECHNET. Der Schwerpunkt kippt über die Aufstandslinie, wenn
 *   φ_tip = atan( Hebel / Schwerpunkthöhe ),  Hebel = (Spurweite + Radbreite)/2.
 * Als Schwerpunkt dient der gemessene Mittelpunkt der Karosseriehülle (`rig.body`) — das ist ein
 * geometrischer Schwerpunkt, kein Massenschwerpunkt, und so steht es auch im Bericht. Darüber
 * hinaus fällt das Fahrzeug um. Deshalb:
 *   variant 'free'     hält bei φ_tip × 0,92 — knapp unter dem Umfallen, das ist der Trick.
 *   variant 'wallride' darf DARÜBER, weil die Wand tragt. Wie weit, sagt WALL_LEAN.
 * Für die Wand wird die nötige Entfernung aus der gedrehten Karosseriehülle GEMESSEN und die
 * Bande genau dort gezeichnet. Ein Wallride, dessen Wand nicht da ist, wo das Auto sie berührt,
 * ist eine Behauptung.
 *
 * ADDITIV (§8.3): eigene Gruppe, dreht nur um z. Deformer und Schlingern bleiben unberührt.
 * Die Vertikalstauchung beim Aufsetzen gehört dem Deformer — diese Datei meldet nur
 * `event: 'touchdown'` mit gemessener Stärke, und der Aufrufer gibt es weiter. Zwei Module,
 * eine Bewegung, keine doppelte Feder.
 */
export const SCHEMA = 'kfb.twowheel/1';

export const TWO_WHEEL = {
  id: 'twoWheel',
  family: 'stunt',
  meaning: 'Das Fahrzeug steht auf zwei Rädern und hält sich dort.',
  loop: false,
  phases: ['anticipation', 'action', 'hold', 'followThrough', 'recovery'],
  requiredAnchors: ['contactLine', 'centroid', 'wallPlane'],
  protectedAreas: [],
  eventBudget: {
    maxPrimaryVfx: 0, maxSecondaryVfx: 0, maxTertiaryVfx: 0,
    maxSoundWords: 0, maxAudioCues: 0, maxCameraActions: 0,
  },
  recovery: { restorePose: true, restoreTransform: true, clearVfx: true, clearAudioState: true, withinMs: 240 },
};

const RAD = Math.PI / 180;
/* Zeiten als Vielfache der Karosseriefeder-Periode (1000/springFrequency ms). Damit erbt der
 * Stunt das Gewicht des Profils: ein Kart schnappt hoch, ein Truck wälzt sich hoch.
 * FALL_OF_BASE ist KLEINER als RISE_OF_BASE, weil beim Fallen die Schwerkraft mithilft und beim
 * Steigen dagegen — das ist keine Geschmacksfrage. */
const ANT_OF_BASE = 0.34;
const RISE_OF_BASE = 1.15;
const SETTLE_OF_BASE = 0.50;
const FALL_OF_BASE = 0.78;
const REBOUND_OF_BASE = 0.62;
const TIP_SAFETY = 0.92;     /* free: Anteil des Umfallwinkels, der gehalten wird */
const WALL_LEAN = 0.45;      /* wallride: Anteil des Rests zwischen Umfallwinkel und 90° */
const BALANCE_HZ = 0.42;     /* dieselbe Pendel-Ableitung wie beim Schlingern — eine Masse, eine Rate */
const BALANCE_AMP = 0.028;   /* Balancekorrektur als Anteil des Haltewinkels */
const SNUG_DEG = 3.4;        /* Anschmiegen: Gierwinkel zur Wand, folgt der Kipp-RATE */
const STEER_OF_RATE = 9;     /* Gegenlenken, folgt derselben Rate */
const REBOUND_FRAC = 0.13;   /* einmaliges Zurückfedern über die Waagerechte hinaus */

const smooth = (u) => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };

/**
 * Was am Fahrzeug gemessen wird. `centroidY` braucht THREE, darum kommt es von `attachTwoWheel`
 * herein und nicht aus dem Rig — das Rig meldet nur die Gesamthöhe, und die ist für den
 * Kippwinkel die falsche Zahl.
 */
export function deriveTwoWheel(rig, profile, centroidY, variant = 'wallride') {
  const track = rig.report.track > 1e-4 ? rig.report.track : rig.frame.width;
  const wheelWidth = rig.report.wheelWidth > 0 ? rig.report.wheelWidth : 0;
  /* Der Hebel endet an der äußersten Laufflaechenkante ÜBER ALLE RÄDER — nicht Spurweite plus
     Breite des ERSTEN Rades. `vehicle-drag-racer` hat vorn schmale und hinten breite Räder; mit
     der Ersten-Rad-Breite fällt der Drehpunkt zu weit innen aus. */
  const contactX = rig.wheels.length
    ? Math.max.apply(null, rig.wheels.map((w) => Math.abs(w.centre.x) + w.width / 2))
    : track / 2 + wheelWidth / 2;
  const cg = Math.max(1e-4, centroidY);
  const tipDeg = Math.atan(contactX / cg) / RAD;
  const holdDeg = variant === 'free'
    ? tipDeg * TIP_SAFETY
    : tipDeg + (90 - tipDeg) * WALL_LEAN;
  const base = 1000 / Math.max(0.4, profile.springFrequency || 3);
  return {
    variant, track: +track.toFixed(4), wheelWidth: +wheelWidth.toFixed(4),
    contactX: +contactX.toFixed(4), halfTrack: +contactX.toFixed(4), centroidY: +cg.toFixed(4),
    tipDeg: +tipDeg.toFixed(2), holdDeg: +holdDeg.toFixed(2),
    overshootDeg: +(holdDeg * 0.055).toFixed(2),
    antMs: Math.round(base * ANT_OF_BASE), riseMs: Math.round(base * RISE_OF_BASE),
    settleMs: Math.round(base * SETTLE_OF_BASE), fallMs: Math.round(base * FALL_OF_BASE),
    reboundMs: Math.round(base * REBOUND_OF_BASE),
    balanceHz: +((1000 / base) * BALANCE_HZ).toFixed(3),
    balanceDeg: +(holdDeg * BALANCE_AMP).toFixed(2),
  };
}

/**
 * `child` ist das, was gekippt wird (in der Kette normalerweise `fishtail.root`).
 * `worldSign` dreht die Weltmarkierungen mit, wenn der Träger des Manövers das Fahrzeug um 180°
 * gedreht hat (Modelle, die auf −z schauen).
 */
export function attachTwoWheel({ THREE, rig, profile, facing = 1, child = null, variant = 'wallride', worldSign = 1 }) {
  const pivot = new THREE.Group(); pivot.name = 'TwoWheelPivot';
  const carrier = new THREE.Group(); carrier.name = 'TwoWheelCarrier';
  pivot.add(carrier);
  carrier.add(child || rig.group);
  const world = new THREE.Group(); world.name = 'TwoWheelWorld'; world.visible = false;

  /* Der geometrische Schwerpunkt der KAROSSERIE, gemessen. Nicht die Gesamthülle: die Räder
     ziehen den Mittelpunkt nach unten und machen den Kippwinkel zu groß. */
  const bbox = new THREE.Box3().setFromObject(rig.body);
  const centroidY = Math.max(1e-4, (bbox.min.y + bbox.max.y) / 2);
  let cfg = deriveTwoWheel(rig, profile, centroidY, variant);
  let side = 1;

  /* Welche Stelle der Karosserie die Wand zuerst berührt, wird an den acht Hüllenecken gesucht —
     bei dieser Schräglage ist es die obere Kante, nicht das Rad. */
  function wallGeometry(deg, sd) {
    const a = deg * RAD, px = sd * cfg.contactX, py = 0;
    let best = null;
    [bbox.min.x, bbox.max.x].forEach((bx) => {
      [bbox.min.y, bbox.max.y].forEach((by) => {
        const dx = bx - px, dy = by - py;
        /* Drehung um z um −a·sd: dieselbe Drehung, die der Pivot fährt. */
        const t = -a * sd;
        const x = px + dx * Math.cos(t) - dy * Math.sin(t);
        const y = py + dx * Math.sin(t) + dy * Math.cos(t);
        if (!best || x * sd > best.x * sd) best = { x, y, from: { x: +bx.toFixed(4), y: +by.toFixed(4) } };
      });
    });
    return { x: +best.x.toFixed(4), y: +best.y.toFixed(4), from: best.from,
      distance: +Math.abs(best.x - px).toFixed(4) };
  }

  const state = { active: false, hold: false, t: 0, holdMs: 1400, phase: 'rest', fired: false };
  const read = { active: false, variant, phase: 'rest', tMs: 0, rollDeg: 0, targetDeg: 0, tipDeg: 0,
    yawDeg: 0, steerDeg: 0, rate: 0, event: null, strength: 0, wallDistance: 0 };

  /** §12.2 · Kippachse, Schwerpunkthöhe und die Bande werden gezeichnet. */
  function line(pts, colour) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: colour }));
    l.frustumCulled = false; return l;
  }
  const axisLine = line([0, 0, -rig.frame.length * 0.62, 0, 0, rig.frame.length * 0.62], 0xcc0033);
  axisLine.visible = false; pivot.add(axisLine);

  let wall = null, wallMark = null;
  function buildWorld() {
    while (world.children.length) {
      const c = world.children.pop();
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    }
    wall = null; wallMark = null;
    if (cfg.variant !== 'wallride') return;
    const g = wallGeometry(cfg.holdDeg, side);
    const h = Math.max(g.y * 1.25, rig.frame.height * 1.2);
    const len = rig.frame.length * 4;
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(rig.frame.width * 0.12, h, len),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.85 }),
    );
    /* Die Bande steht genau an der gemessenen Berührstelle. Nicht »etwa daneben«. */
    m.position.set(worldSign * (g.x + side * rig.frame.width * 0.06), h / 2, 0);
    m.castShadow = true; m.receiveShadow = true; m.name = 'Bande';
    world.add(m);
    wall = m;
    wallMark = line([worldSign * g.x, g.y, -len / 2, worldSign * g.x, g.y, len / 2], 0xcc0033);
    world.add(wallMark);
    read.wallDistance = g.distance;
  }

  /** Winkelverlauf. Eine Funktion der Zeit, kein Integrator — damit `poseAt(ms)` exakt trifft. */
  function angleAt(t) {
    const c = cfg;
    const t1 = c.antMs, t2 = t1 + c.riseMs, t3 = t2 + c.settleMs;
    const t4 = t3 + state.holdMs, t5 = t4 + c.fallMs, t6 = t5 + c.reboundMs;
    if (t < t1) return { deg: -c.holdDeg * 0.10 * Math.sin(Math.PI * (t / t1)), phase: 'anticipation', end: t6 };
    if (t < t2) {
      /* Aufsteigen mit Auslauf: schnell weg vom Boden, langsam an den Haltewinkel — die Masse
         wird gegen die Schwerkraft gehoben und wird oben langsamer. */
      const u = (t - t1) / c.riseMs, e = 1 - Math.pow(1 - u, 2.2);
      return { deg: (c.holdDeg + c.overshootDeg) * e, phase: 'action', end: t6 };
    }
    if (t < t3) {
      const u = (t - t2) / c.settleMs;
      return { deg: c.holdDeg + c.overshootDeg * (1 - smooth(u)), phase: 'action', end: t6 };
    }
    if (t < t4) {
      /* HALTEN mit Balance. Zwei nicht ganzzahlig verwandte Raten, damit es nicht als Schleife
         liest. Die Amplitude ist ein Anteil des Haltewinkels, kein absoluter Wert — sonst
         zappelt ein Kart genauso weit wie ein Truck. */
      const s = (t - t3) / 1000, w = 2 * Math.PI * c.balanceHz;
      const b = c.balanceDeg * (Math.sin(w * s) + 0.58 * Math.sin(w * 0.37 * s + 1.1));
      return { deg: c.holdDeg + b, phase: 'hold', end: t6 };
    }
    if (t < t5) {
      /* Fallen mit Einlauf: die Schwerkraft beschleunigt, also quadratisch. */
      const u = (t - t4) / c.fallMs;
      return { deg: c.holdDeg * (1 - u * u), phase: 'followThrough', end: t6 };
    }
    if (t < t6) {
      /* EIN Zurückfedern über die Waagerechte hinaus, dann Ruhe. Nicht zwei. */
      const u = (t - t5) / c.reboundMs;
      return { deg: -c.holdDeg * REBOUND_FRAC * Math.sin(Math.PI * u) * (1 - u * 0.45), phase: 'recovery', end: t6 };
    }
    return { deg: 0, phase: 'recovery', end: t6, done: true };
  }

  /**
   * Der Drehpunkt folgt dem VORZEICHEN des Rollwinkels, nicht nur `side`.
   *
   * Erste Fassung setzte ihn fest auf `side * contactX`. In den beiden Phasen mit NEGATIVEM
   * Winkel — dem Gegenroll der Anticipation und dem einmaligen Rückfedern nach dem Aufsetzen —
   * drehte die Karosserie damit über die Laufflaechenkante der anderen Seite HINWEG und zog deren
   * Räder unter die Ebene: gemessen 2 × contactX × sin|φ|, bei der Bande −0,0483 u im Landeframe,
   * also zwei Drittel des Radradius im Asphalt — und das im meistbeachteten Bild des Stunts.
   * Gefunden wurde es erst beim Abtasten des GANZEN Verlaufs; die Marken `peak / settled /
   * holdMid / touchdown` sind genau die Stellen mit nicht-negativem Winkel.
   *
   * Physikalisch ist das Umsetzen auch der richtige Read: wer sich zum Aufschwingen belädt,
   * kippt kurz auf die Räder der GEGENSEITE.
   */
  function place(deg) {
    const px = (deg >= 0 ? side : -side) * cfg.contactX, py = 0;
    pivot.position.set(px, py, 0);
    carrier.position.set(-px, -py, 0);
    pivot.rotation.z = -deg * RAD * side;
    axisLine.position.set(0, 0, 0);
  }
  place(0);

  const api = {
    schema: SCHEMA, preset: TWO_WHEEL, root: pivot, world,
    get config() { return Object.assign({}, cfg); },
    get readout() { return Object.assign({}, read); },
    get wallAt() { return wallGeometry(cfg.holdDeg, side); },

    setProfile(next) { profile = next; cfg = deriveTwoWheel(rig, next, centroidY, cfg.variant); buildWorld(); return api; },
    setFacing(f) { facing = f; return api; },
    setWorldSign(s) { worldSign = s < 0 ? -1 : 1; buildWorld(); return api; },

    /**
     * `side` +1 kippt nach +x (die Räder auf +x bleiben unten, die Bande steht auf +x).
     * `holdMs` ist die Haltezeit — der eigentliche Stunt. `variant` 'wallride' oder 'free'.
     */
    trigger({ side: sd = 1, holdMs = 1400, variant: vr = null } = {}) {
      side = sd < 0 ? -1 : 1;
      if (vr && vr !== cfg.variant) cfg = deriveTwoWheel(rig, profile, centroidY, vr);
      state.active = true; state.hold = false; state.t = 0; state.fired = false;
      state.holdMs = Math.max(0, holdMs);
      read.variant = cfg.variant;
      buildWorld();
      world.visible = cfg.variant === 'wallride';
      axisLine.visible = true;
      return api;
    },

    update(dt) {
      read.event = null;
      if (!state.active) {
        read.active = false; read.phase = 'rest'; read.tMs = 0;
        read.rollDeg = 0; read.yawDeg = 0; read.steerDeg = 0; read.rate = 0;
        return read;
      }
      if (!state.hold) state.t += dt * 1000;
      const a = angleAt(state.t);
      if (a.done) { api.reset(); read.phase = 'recovery'; return read; }
      const b = angleAt(Math.max(0, state.t - 16));
      const rate = (a.deg - b.deg) / 16;   /* Grad je Millisekunde */

      place(a.deg);
      /* Anschmiegen und Gegenlenken folgen der RATE, nicht dem Winkel: beim Hochziehen dreht die
         Nase zur Wand, beim Abfallen weg. Im Halten ist die Rate fast null, also steht das
         Fahrzeug parallel — genau wie es sein soll. */
      const rn = Math.max(-1, Math.min(1, rate / 0.12));
      read.yawDeg = +(SNUG_DEG * side * rn).toFixed(2);
      read.steerDeg = +(STEER_OF_RATE * -side * rn).toFixed(2);
      pivot.rotation.y = read.yawDeg * RAD;

      /* Aufsetzen. Die Stärke kommt aus der Fallgeschwindigkeit an der Aufstandslinie, normiert
         auf das, was ein freier Fall aus dem Haltewinkel in der Fallzeit ergibt — damit ein
         flacher Stunt weicher aufsetzt als ein hoher. */
      if (!state.fired && a.phase === 'recovery') {
        state.fired = true;
        const vEnd = (cfg.holdDeg * 2) / cfg.fallMs;
        read.event = 'touchdown';
        read.strength = +Math.max(0.2, Math.min(1, Math.abs(rate) / Math.max(1e-6, vEnd))).toFixed(3);
      }

      read.active = true; read.phase = a.phase; read.tMs = Math.round(state.t);
      read.rollDeg = +a.deg.toFixed(2); read.targetDeg = cfg.holdDeg; read.tipDeg = cfg.tipDeg;
      read.rate = +rate.toFixed(4);
      return read;
    },

    poseAt(ms, o = {}) {
      if (!state.active) api.trigger(o);
      state.hold = true; state.t = Math.max(0, ms);
      api.update(0);
      return api.readout;
    },
    /** Die Kernzeiten, damit ein Beweisbild nicht irgendwo im Verlauf landet. */
    marks() {
      const c = cfg, t1 = c.antMs, t2 = t1 + c.riseMs, t3 = t2 + c.settleMs;
      const t4 = t3 + state.holdMs, t5 = t4 + c.fallMs;
      return { anticipation: Math.round(t1 * 0.5), peak: t2, settled: t3 + 40,
        holdMid: Math.round((t3 + t4) / 2), release: t4 + 20, touchdown: t5, end: t5 + c.reboundMs };
    },
    release() { state.hold = false; return api; },

    reset() {
      state.active = false; state.hold = false; state.t = 0; state.fired = false;
      place(0); pivot.rotation.y = 0;
      axisLine.visible = false; world.visible = false;
      read.active = false; read.phase = 'rest'; read.tMs = 0; read.rollDeg = 0;
      read.yawDeg = 0; read.steerDeg = 0; read.rate = 0; read.event = null; read.strength = 0;
      return api;
    },

    dispose() {
      api.reset();
      if (pivot.parent) pivot.parent.remove(pivot);
      if (world.parent) world.parent.remove(world);
      if (axisLine.geometry) { axisLine.geometry.dispose(); axisLine.material.dispose(); }
      return api;
    },
  };
  return api;
}

/** Fixture-Vertrag, §12.3. */
export const TWO_WHEEL_FIXTURES = [
  { id: 'twoWheelFree', seed: 'tw-free', trigger: "twoWheel({variant:'free', side:1})",
    expectedPrimaryRead: 'Steht frei auf zwei Rädern, knapp unter dem Umfallwinkel, und balanciert sichtbar',
    forbiddenOverlaps: ['fishtail'] },
  { id: 'twoWheelWall', seed: 'tw-wall', trigger: "twoWheel({variant:'wallride', side:1})",
    expectedPrimaryRead: 'Lehnt an der Bande, deutlich über dem Umfallwinkel — die Wand trägt',
    forbiddenOverlaps: ['fishtail'] },
  { id: 'wallrideRolling', seed: 'tw-rolling', trigger: "manoeuvre('straight') + twoWheel({variant:'wallride'})",
    expectedPrimaryRead: 'Fährt an der Bande entlang, während es auf zwei Rädern steht — Fahrt und Stunt zugleich',
    forbiddenOverlaps: ['fishtail'] },
];
