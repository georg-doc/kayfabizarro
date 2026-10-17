/**
 * lab-v7/vehicle-cartoon-deformer.v2.js · Presentation-only Cartoon Vehicle Deformer.
 *
 * GRENZE, die dieses Modul nicht überschreitet (Briefing
 * `CLAUDE_DESIGN_CARTOON_VEHICLE_DEFORMER_BRIEF_2026-09-17.md`):
 * Race besitzt Movement, Contact, Grip, Drift, Recovery, Track und Camera. Dieses Modul liest
 * Signale und schreibt ausschließlich in eigene Presentation-Knoten. Es schreibt NIE
 * `contactRoot.position`, `contactRoot.quaternion` oder Kollisionsgeometrie — deshalb bekommt es
 * den contactRoot auch nur als *Elternteil* übergeben und hält keine Referenz zum Schreiben.
 *
 * WARUM v2 KEIN SHADER IST. `cardeform.v1.js` verbog die Karosserie im Vertex-Shader. Das
 * Briefing verlangt ausdrücklich »keinen Softbody-/Vertex-/Lattice-Overkill«, sondern nested
 * Groups, bounded non-uniform scale, Offsets und gedämpfte Springs. Das ist hier umgesetzt. Der
 * Preis ist bewusst bezahlt: die Bananen-Biegung aus v1 (Querversatz über s²) lässt sich mit
 * Gruppen nicht bauen und ist ersatzlos entfallen — sie stand auch in keinem Kanal des Briefings.
 * Was Gruppen dafür können und der Shader nicht konnte: Räder bleiben planiert, während die
 * Karosserie nickt, und ein Fixture-Wechsel kann keinen Uniform-Zustand mitschleppen.
 *
 * KNOTENBAUM, wörtlich aus dem Briefing:
 *
 *   Vehicle Dynamics / Contact Root        ← Race besitzt ihn
 *   └─ Vehicle Visual Response Root        ← Drift-Yaw (sichtbarer Schräglauf)
 *      ├─ Shell Deform Root                ← Nicken, Rollen, Squash, Höhe · NUR Karosserie
 *      ├─ Driver Seat Anchor
 *      │  └─ Driver Visual Root            ← Torso/Kopf laggen
 *      ├─ Secondary Motion Roots           ← Ohren, Antenne, lose Requisiten
 *      └─ (Räder bleiben hier)             ← planiert: sie stauchen nicht mit der Karosserie
 *
 * GRAMMATIK (Cause → Anticipation/Load → Action → Impact → Follow-through → Recovery). Sie steckt
 * in der Mechanik, nicht in Kurven: kontinuierliche Ursachen ziehen an Spring-ZIELEN (daraus
 * entstehen Load und Follow-through von selbst), Ereignisse setzen einen Spring-IMPULS (daraus
 * entstehen Impact, Overshoot und Settle von selbst). Neutralfahrt hat kein Ziel und keinen
 * Impuls und ist deshalb exakt ruhig — es gibt keine Rausch- oder Wobble-Schicht.
 */
export const SCHEMA = 'kfb.cartoon-vehicle-deformer/2';

/** Kontinuierliche Signale. Alles −1…1 außer speed (0…1). Namen = Race-Telemetrie-Entwurf. */
export const SIGNALS = [
  ['speed', 'Speed', 0, 1, 'normiertes Tempo · treibt nur einen dezenten Bias'],
  ['longAccel', 'Long accel', -1, 1, 'Längsbeschleunigung · positiv Gas, negativ Bremse'],
  ['lateral', 'Lateral load', -1, 1, 'Seitenlast · positiv nach rechts'],
  ['bank', 'Bank', -1, 1, 'Streckenneigung · die Shell folgt ihr mit Trägheit'],
  ['drift', 'Drift', -1, 1, 'Schräglauf · deutlich andere Pose als normale Kurve'],
];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
/** Jeder Signaleingang geht hier durch. Ein NaN aus der Telemetrie darf das Rig nicht vergiften. */
const finite = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const DEG = Math.PI / 180;

/**
 * Gedämpfter Spring mit verständlichen Parametern (Briefing: amplitude, stiffness/frequency,
 * damping, attack, release, overshoot cap).
 *
 * `attack` und `release` sind keine Zierde: eine Last, die schnell aufbaut und langsam abfällt,
 * liest als Gewicht. Gleiche Zeiten in beide Richtungen lesen als Feder.
 */
class Spring {
  constructor({ freq = 3, damp = 0.7, cap = 1, attack = 1, release = 1 } = {}) {
    Object.assign(this, { freq, damp, cap, attack, release });
    this.value = 0; this.vel = 0; this.target = 0;
  }
  set(target) { this.target = clamp(finite(target), -this.cap, this.cap); }
  /** Ereignis-Impuls: setzt Geschwindigkeit, nicht Ziel. Daraus entsteht Impact → Overshoot → Settle. */
  kick(v) { this.vel += finite(v); }
  step(dt) {
    /* Große dt (Tab-Wechsel, Debugger-Halt) in Teilschritte zerlegen. Ohne das explodiert der
       Integrator und das Rig kommt mit NaN zurück. */
    let left = clamp(dt, 0, 0.5);
    const rising = Math.abs(this.target) > Math.abs(this.value);
    const scale = rising ? this.attack : this.release;
    const w = 2 * Math.PI * Math.max(0.01, this.freq * scale);
    while (left > 0) {
      const h = Math.min(left, 1 / 240); left -= h;
      const a = -2 * this.damp * w * this.vel - w * w * (this.value - this.target);
      this.vel += a * h;
      this.value += this.vel * h;
      if (this.value > this.cap) { this.value = this.cap; this.vel = Math.min(this.vel, 0); }
      if (this.value < -this.cap) { this.value = -this.cap; this.vel = Math.max(this.vel, 0); }
    }
    if (!isFinite(this.value) || !isFinite(this.vel)) { this.value = 0; this.vel = 0; }
    return this.value;
  }
  reset() { this.value = 0; this.vel = 0; this.target = 0; }
  tune(o) { Object.assign(this, o); this.cap = Math.abs(this.cap); }
}

export const FALLBACK_PROFILE = {
  id: 'CAR_CHILL_LIGHT', massFeel: 0.5,
  squashAmount: 0.03, stretchAmount: 0.03, lateralSquash: 0.02,
  pitchResponse: 4, rollResponse: 5, bankFollow: 0.75, driftYawResponse: 8, driftRoll: 3,
  impactResponse: 0.07, landingSquash: 0.09, speedBias: 0.35,
  springFrequency: 3.0, springDamping: 0.55, secondaryLag: 0.35,
  volumePreserve: 0.8, retriggerMs: 140,
};

export function createDeformer(THREE, rig, opts = {}) {
  const profile = Object.assign({}, FALLBACK_PROFILE, opts.profile || {});
  const frame = rig.frame;

  /* ── Knotenbaum einziehen ────────────────────────────────────────────────────────────────
     rig.group ist der contactRoot-Stellvertreter (im Lab; im Race ist es Races Knoten). Body und
     Radgruppen sitzen darin mit ihren gemessenen lokalen Lagen. Zwei Gruppen mit Identität
     dazwischenzuhängen verändert keine Welttransformation — darum ist das Umhängen hier ohne
     Matrixrechnung korrekt, anders als beim Rig-Aufbau selbst. */
  const contactRoot = rig.group;
  const responseRoot = new THREE.Group(); responseRoot.name = 'VehicleVisualResponseRoot';
  const shellRoot = new THREE.Group(); shellRoot.name = 'ShellDeformRoot';
  const seatAnchor = new THREE.Group(); seatAnchor.name = 'DriverSeatAnchor';
  const driverRoot = new THREE.Group(); driverRoot.name = 'DriverVisualRoot';

  contactRoot.add(responseRoot);
  responseRoot.add(shellRoot);
  shellRoot.add(rig.body);
  /* Räder wandern unter den responseRoot, NICHT unter shellRoot: sie folgen dem Schräglauf, aber
     nicht dem Nicken und nicht der Stauchung. Ein Rad, das mit der Karosserie kippt, hebt sichtbar
     von der Straße ab. */
  rig.wheels.forEach((w) => responseRoot.add(w.steer));
  seatAnchor.position.set(0, frame.height * 0.45, 0);
  seatAnchor.add(driverRoot); responseRoot.add(seatAnchor);

  const secondary = [];

  /* ── Springs ─────────────────────────────────────────────────────────────────────────────── */
  const F = profile.springFrequency, D = profile.springDamping;
  const S = {
    pitch: new Spring({ freq: F, damp: D, cap: profile.pitchResponse * 2.2, attack: 1.25, release: 0.8 }),
    roll: new Spring({ freq: F * 0.95, damp: D, cap: (profile.rollResponse + profile.driftRoll) * 2.0, attack: 1.15, release: 0.85 }),
    yaw: new Spring({ freq: F * 0.8, damp: D + 0.12, cap: profile.driftYawResponse * 1.8, attack: 1.0, release: 0.7 }),
    squash: new Spring({ freq: F * 1.35, damp: D - 0.08, cap: Math.max(profile.landingSquash, profile.impactResponse) * 1.8, attack: 1.6, release: 0.9 }),
    stretch: new Spring({ freq: F * 1.1, damp: D, cap: profile.stretchAmount * 2.4, attack: 1.3, release: 0.85 }),
    side: new Spring({ freq: F * 1.2, damp: D, cap: Math.max(profile.lateralSquash, profile.impactResponse) * 2.0, attack: 1.5, release: 0.9 }),
    lift: new Spring({ freq: F * 1.25, damp: D, cap: 0.18, attack: 1.5, release: 0.9 }),
  };
  const seatPitch = new Spring({ freq: F * 0.7, damp: D + 0.05, cap: 14, attack: 0.8, release: 0.6 });
  const seatRoll = new Spring({ freq: F * 0.7, damp: D + 0.05, cap: 14, attack: 0.8, release: 0.6 });

  const sig = { speed: 0, longAccel: 0, lateral: 0, bank: 0, drift: 0 };
  let lastRail = -1e9, lastLand = -1e9, now = 0;
  /* KONTAKT-LATCH statt Cooldown. `retriggerMs` allein war die falsche Antwort auf die
     Briefing-Zeile »nicht jeden Frame neu triggern, solange Kontakt besteht«: eine 600 ms lange
     Wandberührung ergab bei 140 ms Sperre GEMESSENE fünf Einschläge statt einem, und die Shell
     wurde beim Anlehnen wiederholt geschlagen. Ein Cooldown kennt nur »zu früh«, nicht »noch
     derselbe Kontakt«. Der Latch kennt den Unterschied: ein Kontakt ergibt EINEN Impuls plus eine
     gehaltene Schräglage, und er löst sich von selbst, wenn keine Meldung mehr kommt. */
  const rail = { held: false, side: 0, strength: 0, lastSeen: -1e9 };
  const RAIL_TIMEOUT_MS = 60;
  const readout = { impactWeight: 0, dominant: 'idle' };

  const api = {
    schema: SCHEMA,
    nodes: { contactRoot, responseRoot, shellRoot, seatAnchor, driverRoot, secondary },
    get profile() { return Object.assign({}, profile); },
    get signals() { return Object.assign({}, sig); },
    get readout() { return Object.assign({}, readout); },

    setProfile(next) {
      Object.assign(profile, next || {});
      const f = profile.springFrequency, d = profile.springDamping;
      S.pitch.tune({ freq: f, damp: d, cap: profile.pitchResponse * 2.2 });
      S.roll.tune({ freq: f * 0.95, damp: d, cap: (profile.rollResponse + profile.driftRoll) * 2.0 });
      S.yaw.tune({ freq: f * 0.8, damp: d + 0.12, cap: profile.driftYawResponse * 1.8 });
      S.squash.tune({ freq: f * 1.35, damp: d - 0.08, cap: Math.max(profile.landingSquash, profile.impactResponse) * 1.8 });
      S.stretch.tune({ freq: f * 1.1, damp: d, cap: profile.stretchAmount * 2.4 });
      S.side.tune({ freq: f * 1.2, damp: d, cap: Math.max(profile.lateralSquash, profile.impactResponse) * 2.0 });
      S.lift.tune({ freq: f * 1.25, damp: d, cap: 0.18 });
      secondary.forEach((s) => s.spring.tune({ freq: f * (0.55 + 0.25 * s.depth), damp: d - 0.1 }));
      return api;
    },

    /** Kontinuierliche Signale. Teilmengen sind erlaubt; was fehlt, bleibt stehen. */
    setSignals(next) {
      if (!next) return api;
      SIGNALS.forEach(([k, , lo, hi]) => { if (k in next) sig[k] = clamp(finite(next[k]), lo, hi); });
      return api;
    },

    /**
     * Rubber-Rail-Impact. `side` −1 links, +1 rechts.
     * Die Retrigger-Sperre ist die Antwort auf die Briefing-Zeile »nicht jeden Frame neu triggern,
     * solange Kontakt besteht« — ohne sie wird aus einer Wandberührung ein Dauerzittern.
     */
    /**
     * Rubber-Rail-Impact. `side` −1 links, +1 rechts.
     *
     * EIN KONTAKT, EIN SCHLAG — und das gilt auch ohne Flag. Ein Aufruf innerhalb von
     * `retriggerMs` nach dem letzten setzt denselben Kontakt fort: er frischt Seite, Stärke und
     * Wachhund auf, schlägt aber nicht erneut zu. `contact: true` macht diese Absicht nur
     * ausdrücklich, es schaltet sie nicht ein.
     *
     * Warum das die Regel ist und nicht eine Option: die Naht darf nicht zwei Wege haben, von
     * denen einer kaputt ist. Erste Fassung war ein reiner Cooldown — 600 ms Wandkontakt ergaben
     * gemessene fünf Einschläge. Zweite Fassung hatte den Latch, aber nur hinter `contact: true`,
     * und die dokumentierte flaglose Form ergab weiterhin drei. Ein Aufrufer, der jeden Frame
     * meldet, ist der normale Fall, nicht der Fehlerfall; er muss ohne Sonderwissen richtig
     * herauskommen. Der Preis ist bezahlt und benannt: zwei ECHTE Einschläge, die dichter als
     * `retriggerMs` aufeinander folgen, verschmelzen zu einem. Das ist die harmlosere Richtung —
     * ein verschluckter Zweitschlag liest als ein kräftiger, fünf liest als Defekt.
     */
    railImpact({ side = 1, strength = 1, contact = false } = {}) {
      const sd = Math.sign(side || 1), st = clamp(finite(strength, 1), 0, 1);
      const continuing = contact || rail.held || (now - lastRail) <= profile.retriggerMs;
      rail.side = sd; rail.strength = st; rail.lastSeen = now;
      if (continuing && rail.held) return api;
      rail.held = true;
      lastRail = now;
      const s = st * profile.impactResponse;
      S.side.kick(-sd * s * 26);
      S.yaw.kick(-sd * profile.driftYawResponse * 1.1 * st);
      S.roll.kick(sd * profile.rollResponse * 0.9 * st);
      S.squash.kick(s * 7);
      return api;
    },

    /** Kontakt beendet. Optional — der Wachhund löst auch von selbst, wenn keine Meldung kommt. */
    railRelease() { rail.held = false; rail.strength = 0; return api; },

    /** Landing / Ground Bounce. Synthetischer Test — hier wird keine echte Federung behauptet. */
    landing({ strength = 1 } = {}) {
      if (now - lastLand < profile.retriggerMs) return api;
      lastLand = now;
      const s = clamp(finite(strength, 1), 0, 1) * profile.landingSquash;
      S.squash.kick(s * 30);
      S.lift.kick(-s * 2.2);
      S.pitch.kick(profile.pitchResponse * 0.8 * clamp(strength, 0, 1));
      seatPitch.kick(-9 * clamp(strength, 0, 1));
      return api;
    },

    /** Sekundärteil anmelden (Ohr, Antenne, Cape). `depth` 0 Basis … 1 Spitze. */
    addSecondary(node, { name = node.name || 'secondary', depth = 1, axis = 'x', gain = 1 } = {}) {
      const spring = new Spring({ freq: profile.springFrequency * (0.55 + 0.25 * depth), damp: profile.springDamping - 0.1, cap: 26, attack: 0.7, release: 0.5 });
      secondary.push({ node, name, depth, axis, gain, spring, rest: node.rotation.clone() });
      return api;
    },

    update(dt) {
      const h = clamp(finite(dt), 0, 0.5);
      now += h * 1000;
      /* Wachhund: hört die Kontaktmeldung auf, gilt der Kontakt als beendet. 60 ms sind rund vier
         Bilder bei 60 Hz und zwei bei 30 Hz — tolerant gegen einen ausgelassenen Frame, ohne eine
         gelöste Wandberührung hängen zu lassen. */
      if (rail.held && now - rail.lastSeen > RAIL_TIMEOUT_MS) { rail.held = false; rail.strength = 0; }
      const railLean = rail.held ? rail.side * rail.strength : 0;

      /* Ereignis-Gewicht aus der SPRING-AMPLITUDE, nicht aus der Geschwindigkeit.
         Erster Versuch war `|vel| / 40`. Der war doppelt falsch: der Teiler war zu groß (ein
         voller Landeschlag kam auf 0,07 und wurde von »speed bias« überstimmt), und vor allem ist
         die Geschwindigkeit im Moment der GRÖSSTEN Stauchung null — der Einschlag meldete sich
         genau dann nicht, wenn er am deutlichsten zu sehen war. Die Amplitude eines gedämpften
         Schwingers ist sqrt(x² + (v/ω)²); sie ist über den ganzen Schlag hinweg stabil. Normiert
         wird auf die Impact-Amplitude des Profils, nicht auf eine geratene Zahl. */
      /* Ereignis-Gewicht aus der SPRING-AMPLITUDE UM DAS AKTUELLE ZIEL, nicht aus der
         Geschwindigkeit und nicht aus dem Absolutwert.
         Drei Anläufe, zwei davon falsch, beide gemessen:
           `|vel| / 40`      — zu klein skaliert UND im Moment der größten Stauchung null, weil die
                               Geschwindigkeit dort durch den Umkehrpunkt geht. Ein voller
                               Landeschlag meldete sich als »speed bias«.
           `sqrt(x² + …)`    — richtig über den Schlag hinweg, aber es zählte auch die RUHENDE
                               Auslenkung mit: zwei Sekunden Neutralfahrt standen auf impact 0,10,
                               obwohl nichts eingeschlagen war.
         Was zählt, ist die Abweichung vom Ziel: ein Spring, der auf seinem Ziel sitzt, hat keine
         Ereignis-Energie, egal wie weit ausgelenkt das Ziel liegt. */
      const amp = (s) => {
        const w = 2 * Math.PI * Math.max(0.01, s.freq);
        const dx = s.value - s.target;
        return Math.sqrt(dx * dx + (s.vel / w) * (s.vel / w));
      };
      const impactRef = Math.max(1e-4, Math.max(profile.landingSquash, profile.impactResponse) * 0.55);
      const impactWeight = clamp((amp(S.squash) + amp(S.side)) / impactRef, 0, 1);
      /* PRIORITÄT statt Multiplikation (Briefing: impact > drift/load > speed bias > idle).
         Die Ursachen werden gegeneinander GEDÄMPFT, nicht miteinander verrechnet — sonst hebt ein
         gleichzeitiger Drift den Einschlag auf. */
      const loadScale = 1 - 0.55 * impactWeight;
      const speedScale = (1 - impactWeight) * (1 - 0.6 * Math.abs(sig.drift));

      const driftMag = Math.abs(sig.drift);
      /* Drift muss anders lesen als eine schnelle Kurve, nicht nur stärker: die Seitenlast tritt
         zurück, dafür kommt sichtbarer Yaw und Gegenroll. */
      const lateralEff = sig.lateral * (1 - 0.45 * driftMag);

      S.pitch.set((sig.longAccel * profile.pitchResponse - sig.speed * profile.speedBias) * loadScale);
      /* Gehaltene Schräglage aus dem Dauerkontakt: die Wand drückt weiter, auch wenn sie nur
         einmal geschlagen hat. Das ist der Unterschied zwischen »anlehnen« und »fünfmal treffen«. */
      S.roll.set((lateralEff * profile.rollResponse + sig.bank * profile.rollResponse * profile.bankFollow
        - sig.drift * profile.driftRoll) * loadScale + railLean * profile.rollResponse * 0.5);
      S.yaw.set(sig.drift * profile.driftYawResponse * loadScale);
      S.stretch.set(sig.longAccel * profile.stretchAmount * loadScale);
      S.side.set(-Math.abs(lateralEff) * profile.lateralSquash * loadScale
        - Math.abs(railLean) * profile.impactResponse * 0.45);
      S.squash.set((Math.abs(lateralEff) * profile.squashAmount * 0.5
        + sig.speed * profile.squashAmount * 0.35 * speedScale) * loadScale);
      S.lift.set(-sig.speed * profile.speedBias * 0.02 * speedScale);

      const pitch = S.pitch.step(h), roll = S.roll.step(h), yaw = S.yaw.step(h);
      const squash = S.squash.step(h), stretch = S.stretch.step(h), side = S.side.step(h), lift = S.lift.step(h);

      responseRoot.rotation.y = yaw * DEG;
      shellRoot.rotation.x = -pitch * DEG;
      shellRoot.rotation.z = -roll * DEG;

      /* BOUNDED NON-UNIFORM SCALE im semantischen Vehicle Space (forward = z, right = x, up = y),
         nicht auf einer beliebigen Mesh-Achse. Approximate Volume Preservation: was die Höhe
         verliert, teilen Breite und Länge sich anteilig — über `volumePreserve` regelbar, weil
         100 % bei einem Spielzeugauto überzeichnet wirkt. */
      const sy = clamp(1 - squash, 0.55, 1.45);
      const sz = clamp(1 + stretch, 0.6, 1.4);
      const comp = Math.pow(1 / Math.max(sy * sz, 1e-3), 0.5 * profile.volumePreserve);
      const sx = clamp(comp * (1 + side), 0.6, 1.4);
      shellRoot.scale.set(sx, sy, clamp(sz * comp, 0.6, 1.4));
      /* Die Shell staucht gegen den Radaufstandspunkt: y = 0 ist der Boden (vom Rig gemessen),
         also braucht es keinen Ausgleichsversatz — das ist der Grund, warum das Rig den Nullpunkt
         dorthin gelegt hat. `lift` ist rein optisch und bleibt klein. */
      shellRoot.position.y = lift * frame.height;

      /* Fahrer laggt der Shell nach (Briefing: torso/head lag). Ziel ist die aktuelle Shell-Lage,
         der Spring ist langsamer — daraus entsteht das Nachziehen von selbst. */
      seatPitch.set(pitch * 1.15 + sig.longAccel * 3);
      seatRoll.set(roll * 1.2 + lateralEff * 3);
      driverRoot.rotation.x = -seatPitch.step(h) * DEG;
      driverRoot.rotation.z = -seatRoll.step(h) * DEG;

      secondary.forEach((s) => {
        const drive = s.axis === 'z' ? (roll * 1.4 + lateralEff * 6) : (pitch * 1.4 + sig.longAccel * 6);
        s.spring.set(drive * profile.secondaryLag * s.gain * (0.6 + 0.8 * s.depth));
        const v = s.spring.step(h) * DEG;
        s.node.rotation[s.axis] = s.rest[s.axis] - v;
      });

      readout.impactWeight = +impactWeight.toFixed(3);
      readout.dominant = impactWeight > 0.12 ? 'impact'
        : (driftMag > 0.15 ? 'drift' : (Math.abs(sig.longAccel) > 0.1 || Math.abs(lateralEff) > 0.1 ? 'load'
        : (sig.speed > 0.05 ? 'speed bias' : 'idle')));
      readout.pose = { pitch: +pitch.toFixed(3), roll: +roll.toFixed(3), yaw: +yaw.toFixed(3), squash: +squash.toFixed(4), stretch: +stretch.toFixed(4) };
      return readout;
    },

    /** Muss EXAKT neutral werden — kein Restversatz, keine akkumulierte Stauchung. */
    reset() {
      Object.values(S).forEach((s) => s.reset());
      seatPitch.reset(); seatRoll.reset();
      secondary.forEach((s) => { s.spring.reset(); s.node.rotation.copy(s.rest); });
      SIGNALS.forEach(([k]) => { sig[k] = 0; });
      lastRail = -1e9; lastLand = -1e9;
      rail.held = false; rail.side = 0; rail.strength = 0; rail.lastSeen = -1e9;
      responseRoot.rotation.set(0, 0, 0);
      shellRoot.rotation.set(0, 0, 0);
      shellRoot.scale.set(1, 1, 1);
      shellRoot.position.set(0, 0, 0);
      driverRoot.rotation.set(0, 0, 0);
      readout.impactWeight = 0; readout.dominant = 'idle';
      return api;
    },

    dispose() {
      /* Beim Fixture-Wechsel darf kein Spring-Zustand mitwandern. Der sicherste Weg ist, die
         Knoten wegzuwerfen statt sie zurückzusetzen. */
      secondary.length = 0;
      shellRoot.remove(rig.body);
      contactRoot.remove(responseRoot);
    },
  };
  return api;
}
