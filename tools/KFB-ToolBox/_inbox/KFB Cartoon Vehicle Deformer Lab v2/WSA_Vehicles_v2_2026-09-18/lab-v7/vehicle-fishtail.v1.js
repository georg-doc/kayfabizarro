/**
 * lab-v7/vehicle-fishtail.v1.js · Motion-Familie »Schlingern«.
 *
 * Georgs Vorgabe (18.09.): Schlingern zuerst als eigene Familie, danach als Erholungsphase in
 * den Überschlag eingehängt. Also steht hier nur das Schlingern — kein Flug, kein Lautwort,
 * kein Ton, keine Kamera. Motion-Skill §15: eine Choreografie sichtbar richtig, dann die nächste.
 *
 * WAS MAN SEHEN SOLL (ein Read, §1.2)
 *   Das Heck pendelt aus, die Nase bleibt auf Kurs.
 * Darum dreht das Fahrzeug um die VORDERACHSE und nicht um seine Mitte. Das ist der ganze
 * Unterschied zum Drift: dreht man um die Mitte, wandert die Nase mit und das Bild liest als
 * Schräglauf. Der Drehpunkt ist gemessen — Mittelpunkt der beiden Vorderräder aus dem Rig,
 * Höhe auf der Aufstandsebene (`rig.frame.contactY`), damit der Gegenroll um die Bodenlinie
 * kippt und die Räder aufstehen bleiben.
 *
 * SCHICHTUNG (§2.4)
 *   primär      Gierauslenkung des Hecks, abklingende Schwingung
 *   sekundär    Gegenroll, eine Vierteldrehung nachlaufend (§2.5 Follow-through)
 *   sekundär    Gegenlenkung der Vorderräder, aus dem Gierwinkel abgeleitet
 *   tertiär     nichts. Staub und Lautwort gehören zum Überschlag, nicht hierher.
 *
 * ADDITIV (§8.3)
 *   Der Deformer besitzt `responseRoot` (Drift-Yaw) und `shellRoot` (Nicken, Rollen, Stauchung).
 *   Diese Datei fasst NICHTS davon an. Sie hängt eine eigene Gruppe ÜBER `rig.group` und dreht
 *   nur die. Beide Posen addieren sich, keine überschreibt die andere.
 *
 * ABGELEITET, NICHT ERFUNDEN
 *   Alle Werte kommen aus dem Profil, das schon abgestimmt beschrieben ist. Genau EIN freier
 *   Faktor: `HZ_OF_SPRING`. Begründung steht dort.
 */
export const SCHEMA = 'kfb.fishtail/1';

/** Motion-Preset-Vertrag, §10. `durationMs` ist abgeleitet — siehe `deriveFishtail`. */
export const FISHTAIL = {
  id: 'fishtail',
  family: 'locomotion',
  meaning: 'Das Fahrzeug fängt sich wieder ein: das Heck pendelt aus, die Nase bleibt auf Kurs.',
  loop: false,
  phases: ['anticipation', 'action', 'followThrough', 'recovery'],
  requiredAnchors: ['frontAxle', 'contactPlane'],
  protectedAreas: [],
  eventBudget: {
    maxPrimaryVfx: 0, maxSecondaryVfx: 0, maxTertiaryVfx: 0,
    maxSoundWords: 0, maxAudioCues: 0, maxCameraActions: 0,
  },
  recovery: { restorePose: true, restoreTransform: true, clearVfx: true, clearAudioState: true, withinMs: 220 },
};

/* Der eine freie Faktor. Die Pendelbewegung des Hecks ist LANGSAMER als die Karosseriefeder —
 * eine Feder wippt, ein schlingerndes Fahrzeug pendelt. 0,42 ist an der Lesbarkeit gesetzt:
 * CAR_CHILL_LIGHT (3,0 Hz) ergibt 1,26 Hz, also 397 ms je Schwinger; HEAVY_FUTURE (1,9 Hz)
 * ergibt 0,80 Hz, also 627 ms. Schwer pendelt sichtbar träger als leicht, und beides bleibt
 * über der Wahrnehmungsschwelle für eine gelesene Einzelbewegung. */
const HZ_OF_SPRING = 0.42;
const FLOOR_DEG = 0.4;      /* darunter ist die Auslenkung nicht mehr zu sehen — Ende der Bewegung */
const STEER_GAIN = 1.6;     /* Grad Gegenlenkung je Grad Gierauslenkung */
const STEER_CAP = 22;       /* Radeinschlag ist mechanisch begrenzt, auch im Cartoon */
/* Nachlauf des Gegenrolls, als Anteil einer halben Schwingerzeit. Die erste Fassung nahm eine
 * Vierteldrehung (0,5) — gemessen ergab das auf jeder Gierspitze genau 0,00° Roll und umgekehrt:
 * das ist Gegenphase, nicht Follow-through, und beide Bewegungen sind nie zusammen zu sehen.
 * 0,18 entspricht bei CAR_CHILL_LIGHT 71 ms und liegt damit im Bereich, den der Motion-Skill
 * §2.5 fuer nachlaufende Teile nennt (35–85 ms). */
const ROLL_LAG = 0.18;

/**
 * Leitet die Schwingung aus dem Profil ab. Kein Wert je Fixture, kein Wert je Pack.
 * `zeta` ist die Dämpfung der Pendelbewegung, aus `springDamping` gestreckt: die Karosseriefeder
 * ist stark gedämpft (ein Wippen darf nicht nachhallen), das Schlingern soll drei bis vier
 * Schwinger zeigen. Daraus folgt das Verhältnis je Schwinger analytisch.
 */
export function deriveFishtail(profile) {
  const hz = Math.max(0.25, (profile.springFrequency || 3) * HZ_OF_SPRING);
  const zeta = 0.06 + 0.10 * (profile.springDamping != null ? profile.springDamping : 0.55);
  const ratio = Math.exp((-2 * Math.PI * zeta) / Math.sqrt(1 - zeta * zeta));
  const yawDeg = (profile.driftYawResponse || 8) * 0.85;
  const rollDeg = (profile.driftRoll || 3) * 0.6;
  const halfMs = 500 / hz;
  const swings = Math.max(1, Math.ceil(Math.log(FLOOR_DEG / yawDeg) / Math.log(ratio)));
  /* Was man WIRKLICH sieht. `yawDeg` ist die Amplitude bei t = 0, und dort ist der Sinus null —
     der erste Ausschlag faellt auf die halbe Schwingerzeit, und bis dahin hat die Huellkurve
     schon `ratio^0.5` abgebaut. Gemessen an CAR_CHILL_LIGHT: 6,80° deklariert, 4,73° gesehen.
     Beide Zahlen stehen im Readout, damit niemand die eine fuer die andere nimmt. */
  const firstPeakDeg = yawDeg * Math.sqrt(ratio);
  return {
    hz: +hz.toFixed(3), zeta: +zeta.toFixed(3), ratio: +ratio.toFixed(3),
    yawDeg: +yawDeg.toFixed(2), firstPeakDeg: +firstPeakDeg.toFixed(2), rollDeg: +rollDeg.toFixed(2),
    halfMs: +halfMs.toFixed(1), swings,
    durationMs: Math.round(swings * halfMs),
    retriggerMs: profile.retriggerMs || 160,
  };
}

/**
 * Hängt die Schlinger-Gruppe über `rig.group`. Danach ist `root` das, was in die Szene gehört —
 * nicht mehr `rig.group`.
 */
export function attachFishtail({ THREE, rig, profile, facing = 1 }) {
  const DEG = Math.PI / 180;
  const pivot = new THREE.Group(); pivot.name = 'FishtailYawPivot';
  const carrier = new THREE.Group(); carrier.name = 'FishtailCarrier';
  pivot.add(carrier);
  carrier.add(rig.group);

  let cfg = deriveFishtail(profile);
  let anchor = null;
  const state = { active: false, t: 0, sev: 0, dir: 1, phase: 'rest', hold: false };
  const read = { active: false, phase: 'rest', tMs: 0, swing: 0, yawDeg: 0, rollDeg: 0, steerDeg: 0, amplitudeDeg: 0 };

  /** Vorderachse aus dem Rig, gemessen. Kein geschätzter Offset. */
  function axlePoint() {
    const front = facing >= 0 ? 'zPlus' : 'zMinus';
    const ws = rig.wheels.filter((w) => w.end === front);
    const src = ws.length ? ws : rig.wheels;
    const z = src.length ? src.reduce((s, w) => s + w.centre.z, 0) / src.length : 0;
    /* KORREKTUR 18.09. (abends): die Höhe war `rig.frame.contactY`. Das ist der Wert, den `carrig`
       VOR dem Einbacken gemessen hat; danach verschiebt es die Geometrie um −contactY, und im
       Rig-Raum liegt der Boden auf genau 0 (bei car_hatchback ist `frame.contactY` −0,15 u).
       Gefunden wurde der Fehler an der Zwei-Rad-Familie, wo dieselbe Verwechslung die unteren
       Räder 0,059 u in den Asphalt zog. Hier war er nicht sichtbar: der Gegenroll geht bis 1,3°,
       und 0,15 × (1 − cos 1,3°) sind 4 × 10⁻⁵ u. Die Messreihe im Changelog bleibt gültig — der
       Gierwinkel hängt nicht an der Höhe des Drehpunkts. */
    return { x: 0, y: 0, z };
  }

  function place() {
    const p = axlePoint();
    pivot.position.set(p.x, p.y, p.z);
    carrier.position.set(-p.x, -p.y, -p.z);
    if (anchor) anchor.position.set(0, 0, 0);
  }
  place();

  function buildAnchor() {
    /* §12.2 verlangt sichtbare Anker. Ein Kreuz auf der Aufstandsebene, quer und längs, in der
       Breite der Spur — man sieht den Drehpunkt und an ihm auch den Gierwinkel. */
    const w = Math.max(rig.frame.width * 0.6, 0.02);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([-w, 0, 0, w, 0, 0, 0, 0, -w * 0.35, 0, 0, w * 0.35], 3));
    const m = new THREE.LineBasicMaterial({ color: 0xcc0033 });
    const l = new THREE.LineSegments(g, m);
    l.name = 'FishtailAnchor'; l.visible = false;
    pivot.add(l);
    return l;
  }
  anchor = buildAnchor();

  const api = {
    schema: SCHEMA, preset: FISHTAIL, root: pivot,
    get config() { return Object.assign({}, cfg); },
    get readout() { return Object.assign({}, read); },

    setProfile(next) { profile = next; cfg = deriveFishtail(next); return api; },
    setFacing(f) { facing = f; place(); return api; },

    /**
     * Auslösen. `severity` 0–1, `dir` −1 oder +1 (zu welcher Seite das Heck zuerst ausbricht).
     * RETRIGGER-LATCH wie beim Deformer: ein zweiter Aufruf innerhalb `retriggerMs` verschmilzt
     * mit dem laufenden statt ihn neu zu starten. Sonst ergibt ein Ereignis, das drei Frames
     * lang gemeldet wird, drei Schlingerbewegungen.
     */
    trigger({ severity = 1, dir = 1 } = {}) {
      const sev = Math.max(0, Math.min(1, severity));
      const d = dir < 0 ? -1 : 1;
      if (state.active && state.t < cfg.retriggerMs) {
        state.sev = Math.max(state.sev, sev);
        return api;
      }
      state.active = true; state.t = 0; state.sev = sev; state.dir = d; state.phase = 'anticipation';
      return api;
    },

    update(dt) {
      if (!state.active) {
        read.active = false; read.phase = 'rest';
        read.tMs = 0; read.swing = 0; read.yawDeg = 0; read.rollDeg = 0; read.steerDeg = 0; read.amplitudeDeg = 0;
        return read;
      }
      /* HALT: im Haltezustand rechnet der Frame dieselbe Zeit erneut, statt weiterzulaufen.
         Nur fuer den Beweis — eine Aufnahme, die der Bewegung nachrennt, trifft die Spitze nicht
         und zeigt dann eine Pose, die niemand gemeint hat (gemessen: Ziel 170 ms, Bild 418 ms). */
      if (!state.hold) state.t += dt * 1000;
      const half = cfg.halfMs, u = state.t / half;
      const env = Math.pow(cfg.ratio, u);
      const amp = cfg.yawDeg * state.sev * env;

      if (amp < FLOOR_DEG && !state.hold) {
        /* Ende. Die Auslenkung ist hier kleiner als 0,4° — auf 0 zu setzen ist nicht sichtbar,
           aber es stellt die Rückkehr sicher. §2.1: ohne definierte Rückkehr keine Bewegung. */
        api.reset();
        read.phase = 'recovery';
        return read;
      }

      const yaw = state.dir * amp * Math.sin(Math.PI * u);
      /* Gegenroll läuft kurz nach — Follow-through, §2.5, Nachlauf siehe ROLL_LAG. */
      const tl = Math.max(0, state.t - half * ROLL_LAG), ul = tl / half;
      const roll = -state.dir * cfg.rollDeg * state.sev * Math.pow(cfg.ratio, ul) * Math.sin(Math.PI * ul);
      const steer = Math.max(-STEER_CAP, Math.min(STEER_CAP, -yaw * STEER_GAIN));

      pivot.rotation.y = yaw * DEG;
      pivot.rotation.z = roll * DEG;

      state.phase = u < 0.25 ? 'anticipation' : (u < 2 ? 'action' : 'followThrough');
      if (anchor) anchor.visible = true;

      read.active = true; read.phase = state.phase;
      read.tMs = Math.round(state.t);
      read.swing = Math.floor(u) + 1;
      read.yawDeg = +yaw.toFixed(2);
      read.rollDeg = +roll.toFixed(2);
      read.steerDeg = +steer.toFixed(2);
      read.amplitudeDeg = +amp.toFixed(2);
      return read;
    },

    /**
     * Pose auf einer exakten Zeit anhalten. `peak(k)` liefert die Zeiten der Umkehrpunkte:
     * sie liegen auf (k + 0,5) × halber Schwingerzeit, nicht auf ganzen Schwingern.
     */
    poseAt(ms, { severity = 1, dir = 1 } = {}) {
      state.active = true; state.hold = true;
      state.sev = Math.max(0, Math.min(1, severity)); state.dir = dir < 0 ? -1 : 1;
      state.t = Math.max(0, ms);
      api.update(0);
      return api.readout;
    },
    peakMs(k) { return (k + 0.5) * cfg.halfMs; },
    release() { state.hold = false; return api; },

    reset() {
      state.active = false; state.hold = false; state.t = 0; state.sev = 0; state.phase = 'rest';
      pivot.rotation.set(0, 0, 0);
      if (anchor) anchor.visible = false;
      read.active = false; read.phase = 'rest';
      read.tMs = 0; read.swing = 0; read.yawDeg = 0; read.rollDeg = 0; read.steerDeg = 0; read.amplitudeDeg = 0;
      return api;
    },

    dispose() {
      api.reset();
      if (pivot.parent) pivot.parent.remove(pivot);
      if (anchor) { anchor.geometry.dispose(); anchor.material.dispose(); }
      return api;
    },
  };
  return api;
}

/**
 * Fixture-Vertrag, §12.3. Zwei Stärken plus der Fall, für den das Ganze gebaut wird:
 * Landung, danach Schlingern als Erholungsphase.
 */
export const FISHTAIL_FIXTURES = [
  { id: 'fishtailLight', seed: 'fishtail-light', trigger: 'fishtail(severity 0.45, dir −1)',
    expectedPrimaryRead: 'Heck bricht nach links aus und pendelt aus, Nase bleibt auf Kurs',
    forbiddenOverlaps: [] },
  { id: 'fishtailHeavy', seed: 'fishtail-heavy', trigger: 'fishtail(severity 1, dir +1)',
    expectedPrimaryRead: 'Gleiche Bewegung, deutlich weiter ausgestellt, gleich viele Schwinger',
    forbiddenOverlaps: [] },
  { id: 'landingFishtail', seed: 'landing-fishtail', trigger: 'landing(1) → fishtail(0.85)',
    expectedPrimaryRead: 'Aufsetzen ist der Hauptread, das Schlingern ist die Erholung danach — nicht gleichzeitig',
    forbiddenOverlaps: [] },
];
