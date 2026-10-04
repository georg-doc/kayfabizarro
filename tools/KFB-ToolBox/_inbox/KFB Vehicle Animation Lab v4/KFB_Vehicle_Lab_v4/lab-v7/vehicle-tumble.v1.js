/**
 * lab-v7/vehicle-tumble.v1.js · Motion-Familie »Fassrolle«.
 * Georgs Vorgabe: Überschlag um die Längsachse, tempoabhängig bis zum Ausrollen, Landung auf den
 * Rädern mit EINEM Nachfedern, danach Schlingern als Erholung. Ein Lautwort, ein Ton.
 *
 * WAS MAN SEHEN SOLL (ein Read, §1.2)
 *   Das Fahrzeug überschlägt sich seitlich und fängt sich auf den Rädern wieder.
 * Der ganze Witz liegt im letzten Teil: es MUSS auf den Rädern landen. Eine Fassrolle, die auf
 * dem Dach endet, ist ein Unfall und ein anderer Read. Darum wird die Zahl der Umdrehungen auf
 * eine GANZE Zahl gerundet und die Drehrate danach nachgerechnet — nicht umgekehrt. Damit landet
 * das Fahrzeug bei jedem Tempo und jeder Stärke exakt auf 360° × n.
 *
 * DIE DREHACHSE WANDERT, und das ist gemessen, nicht dekoriert:
 *   Absprung   Aufstandslinie der Räder einer Seite (x = ±(Spur + Radbreite)/2, y = 0).
 *              Am Boden kippt ein Fahrzeug über seine Kante, nicht um seine Mitte.
 *   Flug       Schwerpunkt (x = 0, y = Mittelpunkt der Karosseriehülle). Ein freier Körper dreht
 *              um seinen Schwerpunkt; alles andere sieht nach Puppenspiel aus.
 *   Landung    zurück auf die Aufstandslinie, damit die Räder zuerst kommen.
 * Zwischen den drei Lagen wird interpoliert. Das ist EINE Zeile und der Unterschied zwischen
 * »überschlägt sich« und »dreht sich um einen unsichtbaren Spieß«.
 *
 * TEMPOABHÄNGIG
 *   Flugzeit aus Stärke und Profil, Drehrate aus dem Tempo. Ein schnelles Fahrzeug macht mehr
 *   Umdrehungen in derselben Zeit — und weil auf ganze Umdrehungen gerundet wird, springt die
 *   Zahl stufig, nicht stetig. Das ist richtig so: eine halbe Umdrehung mehr ist sichtbar, eine
 *   Zehntel nicht.
 *
 * ADDITIV (§8.3): eigene Gruppen (Hub + Drehpunkt). Deformer, Schlingern und Zwei-Rad bleiben
 * unberührt. Die Vertikalstauchung beim Aufsetzen gehört dem Deformer — diese Datei meldet nur
 * `event: 'touchdown'` mit gemessener Stärke. Und sie meldet `event: 'recover'`, wenn das
 * Schlingern als Erholungsphase übernehmen soll: die Fassrolle löst es aus, besitzt es aber nicht.
 */
export const SCHEMA = 'kfb.tumble/1';

export const TUMBLE = {
  id: 'tumble',
  family: 'stunt',
  meaning: 'Das Fahrzeug überschlägt sich seitlich und fängt sich auf den Rädern wieder.',
  loop: false,
  phases: ['anticipation', 'launch', 'flight', 'landing', 'followThrough', 'recovery'],
  requiredAnchors: ['contactLine', 'centroid'],
  protectedAreas: [],
  /* Hier steht erstmals etwas über null: die Fassrolle ist der Read, der ein Lautwort verdient.
     EIN Lautwort, und es sitzt auf dem Aufsetzen, nicht auf dem Absprung — der Einschlag ist der
     laute Moment. Zwei Töne: Absprung und Aufsetzen. VFX bleibt null, bis der Rauch-Pack
     angebunden ist; ein Read ohne VFX ist mager, ein Read mit falschem VFX ist kaputt. */
  eventBudget: {
    maxPrimaryVfx: 0, maxSecondaryVfx: 0, maxTertiaryVfx: 0,
    maxSoundWords: 1, maxAudioCues: 2, maxCameraActions: 0,
  },
  recovery: { restorePose: true, restoreTransform: true, clearVfx: true, clearAudioState: true, withinMs: 260 },
};

const RAD = Math.PI / 180;
/* Zeiten als Vielfache der Karosseriefeder-Periode (1000/springFrequency ms) — dieselbe Ableitung
 * wie beim Zwei-Rad, damit ein Kart schnappt und ein Truck sich wälzt. */
const ANT_OF_BASE = 0.42;     /* Hocken und Gegenroll vor dem Absprung */
/* Die beiden folgenden Zahlen definieren NUR NOCH EINEN BEZUGSPUNKT: die Flugzeit bei Stärke 1.
 * Aus ihr und dem Gipfel bei Stärke 1 wird EINE Schwerkraftkonstante je Fahrzeug gerechnet, und
 * alle anderen Stärken folgen daraus ballistisch.
 *
 * Vorher standen Gipfel UND Flugzeit unabhängig an der Stärke, und beide wuchsen fast gleich
 * schnell (×2,08 gegen ×2,14). In der Aufsetzgeschwindigkeit 4·Gipfel/Flugzeit kürzte sich das
 * weg: gemessen 1,074 → 1,044 bei car_hatchback, also FALLEND bei steigender Stärke, und die
 * Landestärke lag in 16 von 16 Messungen auf ihrer Untergrenze 0,35. Eine Zahl, die immer gleich
 * ist, ist keine Ableitung. Physikalisch war die Bahn auch keine Wurfparabel: dort gilt
 * Gipfel = g·t²/8, also t ∝ √Gipfel — hier war t ∝ Gipfel, die wirksame Schwerkraft sank mit der
 * Stärke. */
const AIR_OF_BASE = 1.05;
const AIR_GAIN = 2.10;
const REBOUND_OF_BASE = 0.58; /* das EINE Nachfedern */
const HEIGHT_OF_LENGTH = 0.34; /* Gipfelhöhe bei Stärke 1, in Fahrzeuglängen */
const ROLL_HZ_BASE = 0.55;    /* Umdrehungen je Sekunde bei Tempo 0 … */
const ROLL_HZ_GAIN = 1.45;    /* … plus so viel bei Tempo 1 */
const TIP_FRAC = 0.16;        /* Anteil der Flugzeit, in dem die Achse noch an der Kante liegt */
const LAND_FRAC = 0.14;       /* … und in dem sie für die Landung zurückwandert */
const REBOUND_FRAC = 0.18;    /* Höhe des Nachfederns als Anteil des Gipfels */

const smooth = (u) => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };
/* Volle Sinus-Rampe: langsam an, schnell durch, langsam aus — und sie trifft bei u = 1 EXAKT 1.
   Genau das braucht eine Fassrolle: sie kippt zögerlich weg, dreht in der Luft durch und kommt
   oben langsam wieder auf die Räder. Eine lineare Drehung liest als Motor, nicht als Schwung. */
const rollEase = (u) => 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, u)));
const arc = (u) => 4 * u * (1 - u);

/**
 * Leitet die Fassrolle ab. `speed` 0–1 ist das Tempo beim Absprung, `severity` 0–1 die Stärke.
 * Rückgabe enthält die GANZE Zahl der Umdrehungen — das ist der Wert, der abgenommen wird.
 */
export function deriveTumble(rig, profile, { severity = 1, speed = 0.7, apexFloor = 0 } = {}) {
  const sev = Math.max(0, Math.min(1, severity)), spd = Math.max(0, Math.min(1, speed));
  const base = 1000 / Math.max(0.4, profile.springFrequency || 3);

  /* GIPFELHÖHE. Die künstlerische Wurfhöhe folgt der Stärke — aber ein Fahrzeug, das sich
     überschlägt, muss mindestens so hoch springen, dass es seinen eigenen Drehradius freiräumt.
     Diese Untergrenze ist gemessen (`apexFloor`, siehe `attachTumble`) und sie ist auch der
     richtige Read: ein breiter Wagen MUSS höher springen als ein schmaler. Gefunden bei der
     Abnahme an `race` (Spur 1,0 u) und `vehicle-monster-truck`, die mit der reinen Parabel ihre
     Räder bis 0,042 u unter den Boden zogen. */
  const apexAt = (s) => Math.max(rig.frame.length * HEIGHT_OF_LENGTH * (0.35 + 0.65 * s), apexFloor * 1.04);
  const apex = apexAt(sev), apexRef = apexAt(1), apexLo = apexAt(0);

  /* EINE SCHWERKRAFT JE FAHRZEUG, verankert am Bezugspunkt Stärke 1. Danach ist die Bahn eine
     echte Wurfparabel: Flugzeit ∝ √Gipfel, Aufsetzgeschwindigkeit ∝ √Gipfel. */
  const tRef = base * (AIR_OF_BASE + AIR_GAIN) / 1000;
  const g = (8 * apexRef) / (tRef * tRef);
  const airMs = 2000 * Math.sqrt(2 * apex / g);

  /* LANDESTÄRKE aus der Aufsetzgeschwindigkeit, gespannt zwischen Stärke 0 und Stärke 1 DESSELBEN
     Fahrzeugs — sonst fährt der Bereich 0–1 nie aus. Bindet die Gipfel-Untergrenze bei beiden
     Enden (sehr breites Fahrzeug), fällt die Spanne zusammen und die Stärke ist voll. */
  const vLand = Math.sqrt(2 * g * apex);
  const vRef = Math.sqrt(2 * g * apexRef), vLo = Math.sqrt(2 * g * apexLo);
  const span = vRef - vLo;
  const strength = span > 1e-6 ? Math.max(0.15, Math.min(1, (vLand - vLo) / span)) : 1;

  const rollHz = ROLL_HZ_BASE + ROLL_HZ_GAIN * spd;
  /* AUF GANZE UMDREHUNGEN RUNDEN, dann die Rate nachrechnen. Nicht umgekehrt. Sonst landet das
     Fahrzeug auf der Seite, und das ist ein anderer Read (und ein Unfall). */
  const turns = Math.max(1, Math.round((airMs / 1000) * rollHz));
  const rateHz = turns / (airMs / 1000);
  /* GIPFELHÖHE MIT UNTERGRENZE — siehe oben bei `apexAt`. */
  const apexWanted = rig.frame.length * HEIGHT_OF_LENGTH * (0.35 + 0.65 * sev);
  return {
    severity: +sev.toFixed(2), speed: +spd.toFixed(2),
    airMs: Math.round(airMs), antMs: Math.round(base * ANT_OF_BASE), reboundMs: Math.round(base * REBOUND_OF_BASE),
    turns, rollHzWanted: +rollHz.toFixed(3), rollHz: +rateHz.toFixed(3),
    totalDeg: turns * 360,
    apex: +apex.toFixed(4), apexWanted: +apexWanted.toFixed(4), apexFloor: +apexFloor.toFixed(4),
    gravity: +g.toFixed(4), vLand: +vLand.toFixed(4), strength: +strength.toFixed(3),
    durationMs: Math.round(base * ANT_OF_BASE + airMs + base * REBOUND_OF_BASE),
  };
}

/**
 * `child` ist das, was überschlägt (in der Kette `twowheel.root`).
 */
export function attachTumble({ THREE, rig, profile, facing = 1, child = null }) {
  const lift = new THREE.Group(); lift.name = 'TumbleLift';
  const pivot = new THREE.Group(); pivot.name = 'TumblePivot';
  const carrier = new THREE.Group(); carrier.name = 'TumbleCarrier';
  lift.add(pivot); pivot.add(carrier);
  carrier.add(child || rig.group);

  const track = rig.report.track > 1e-4 ? rig.report.track : rig.frame.width;
  const wheelWidth = rig.report.wheelWidth > 0 ? rig.report.wheelWidth : 0;
  /* Die äußerste Laufflaechenkante wird ÜBER ALLE RÄDER gemessen, nicht aus Spurweite plus der
     Breite des ERSTEN Rades gerechnet. `vehicle-drag-racer` hat vorn schmale und hinten breite
     Räder — mit der Ersten-Rad-Breite sank er 0,0016 u ein. Kleiner Betrag, klarer Denkfehler. */
  const contactX = rig.wheels.length
    ? Math.max.apply(null, rig.wheels.map((w) => Math.abs(w.centre.x) + w.width / 2))
    : track / 2 + wheelWidth / 2;
  const bbox = new THREE.Box3().setFromObject(rig.body);
  const centroidY = Math.max(1e-4, (bbox.min.y + bbox.max.y) / 2);

  /* DIE HÜLLE, die den Boden nicht durchdringen darf: Karosseriehülle VEREINT mit der Radspur.
     Die Karosserie kann schmaler sein als die Räder (Monster-Truck) und umgekehrt. */
  const hull = {
    xMin: Math.min(bbox.min.x, -contactX), xMax: Math.max(bbox.max.x, contactX),
    yMin: 0, yMax: Math.max(bbox.max.y, rig.frame.height),
  };
  /** Wie tief geriete die gedrehte Hülle unter den Boden? Der Rückgabewert IST der nötige Hub. */
  function needLift(ax, ay, deg) {
    const t = -deg * RAD, s = Math.sin(t), c = Math.cos(t);
    let lo = Infinity;
    [[hull.xMin, hull.yMin], [hull.xMin, hull.yMax], [hull.xMax, hull.yMin], [hull.xMax, hull.yMax]]
      .forEach(([cx, cy]) => { lo = Math.min(lo, ay + (cx - ax) * s + (cy - ay) * c); });
    return Math.max(0, -lo);
  }
  /* Untergrenze für den Gipfel: der weiteste Punkt der Hülle vom Schwerpunkt, minus die
     Schwerpunkthöhe. Darunter kann sich das Fahrzeug nicht frei überschlagen. */
  const apexFloor = Math.max(0, Math.max(
    Math.hypot(hull.xMin, hull.yMin - centroidY), Math.hypot(hull.xMin, hull.yMax - centroidY),
    Math.hypot(hull.xMax, hull.yMin - centroidY), Math.hypot(hull.xMax, hull.yMax - centroidY),
  ) - centroidY);

  let cfg = deriveTumble(rig, profile, { apexFloor });
  let side = 1;
  /* LAUTWORT AUS VORGABE AUS. Georg, 18.09.: das Lautwort gehört in die optionale VFX-Schicht,
     zusammen mit Bangers-Typo und Cartoon-Deformer auf der Schrift — nicht in die Grundbewegung.
     Das Modul meldet es nur, wenn es ausdrücklich verlangt wird. Der Ereignisbudget-Eintrag
     `maxSoundWords: 1` bleibt stehen: er ist die OBERGRENZE, nicht die Vorgabe. */
  let wantWord = false;
  const state = { active: false, hold: false, t: 0, phase: 'rest', land: false, rec: false, word: false, cue: null };
  const read = { active: false, phase: 'rest', tMs: 0, durationMs: 0, rollDeg: 0, turns: 0, turn: 0,
    heightY: 0, apex: 0, lift: 0, axisX: 0, axisY: 0, event: null, strength: 0, soundWord: null, tone: null };

  /* §12.2 · beide Drehachsen werden gezeichnet, damit man das Wandern sieht. */
  function line(pts, colour) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: colour }));
    l.frustumCulled = false; l.visible = false; return l;
  }
  const L = rig.frame.length * 0.62;
  const axisLine = line([0, 0, -L, 0, 0, L], 0xcc0033);
  pivot.add(axisLine);

  /** Achslage zur Flugzeit: Kante → Schwerpunkt → Kante. */
  function axisAt(u) {
    const up = u < TIP_FRAC ? smooth(u / TIP_FRAC) : u > 1 - LAND_FRAC ? smooth((1 - u) / LAND_FRAC) : 1;
    return { x: side * contactX * (1 - up), y: centroidY * up };
  }

  /** Ein Zustand zu einer Zeit. Reine Funktion — darum trifft `poseAt(ms)` exakt. */
  function at(t) {
    const t1 = cfg.antMs, t2 = t1 + cfg.airMs, t3 = t2 + cfg.reboundMs;
    if (t < t1) {
      /* HOCKEN UND GEGENROLL. Anticipation, §2.5: es lädt zur Gegenseite, bevor es wegkippt.
         Der Drehpunkt MUSS dem Vorzeichen des Winkels folgen, nicht der Absprungseite — sonst
         dreht die Karosserie über die Radkante der anderen Seite hinweg und zieht deren Räder
         unter den Boden. Gemessen 2 × contactX × sin|φ| = 0,0432 u bei 6°, exakt die Vorhersage.
         Derselbe Fehler war zuvor in `vehicle-twowheel.v1.js` gefunden worden; hier ist er beim
         Übernehmen des Musters mitgekommen — und der erste Fix griff nur für eine Drehrichtung,
         weil er die Seite statt den WINKEL befragte. In dieser Datei steckt `side` schon im
         Winkel (`rotation.z = −deg`), also entscheidet allein das Vorzeichen von `deg`: positiv
         kippt nach +x und braucht die +x-Kante. */
      const u = t / Math.max(1, t1);
      const deg = -6 * side * Math.sin(Math.PI * u);
      const axis = { x: (deg >= 0 ? 1 : -1) * contactX, y: 0 };
      const liftNeeded = needLift(axis.x, axis.y, deg);
      return { phase: 'anticipation', u, deg, h: liftNeeded, lift: liftNeeded, axis, turn: 0 };
    }
    if (t < t2) {
      const u = (t - t1) / cfg.airMs;
      const deg = side * cfg.totalDeg * rollEase(u);
      const axis = axisAt(u);
      /* DER BODEN UNTER DER PARABEL. Die Wurfhöhe ist die gewollte Flugbahn, die Bodenfreiheit
         ist eine Untergrenze darunter — beim Abheben und beim Aufsetzen wandert die Drehachse,
         der Hub ist dort noch klein, der Drehradius aber schon voll wirksam. Ohne diese Grenze
         verschwinden bei breiter Spur die Räder im Asphalt (gemessen: `race` −0,0422 u mitten im
         Flug, Monster-Truck −0,0284 u im Frame vor dem Aufsetzen). */
      const liftNeeded = needLift(axis.x, axis.y, deg);
      return { phase: u < TIP_FRAC ? 'launch' : (u > 1 - LAND_FRAC ? 'landing' : 'flight'), u,
        deg, h: Math.max(cfg.apex * arc(u), liftNeeded), lift: liftNeeded, axis,
        turn: Math.min(cfg.turns, Math.floor(Math.abs(deg) / 360) + 1) };
    }
    if (t < t3) {
      /* EIN Nachfedern. Dieselbe Wurfparabel, kleiner, und kein zweites. */
      const u = (t - t2) / cfg.reboundMs;
      return { phase: 'followThrough', u, deg: 0, h: cfg.apex * REBOUND_FRAC * arc(u), lift: 0,
        axis: { x: side * contactX, y: 0 }, turn: cfg.turns };
    }
    return { phase: 'recovery', u: 1, deg: 0, h: 0, lift: 0, axis: { x: side * contactX, y: 0 }, turn: cfg.turns, done: true };
  }

  function place(s) {
    lift.position.y = s.h;
    pivot.position.set(s.axis.x, s.axis.y, 0);
    carrier.position.set(-s.axis.x, -s.axis.y, 0);
    pivot.rotation.z = -s.deg * RAD;
  }
  place(at(0));

  const api = {
    schema: SCHEMA, preset: TUMBLE, root: lift,
    get config() { return Object.assign({}, cfg, { contactX: +contactX.toFixed(4), centroidY: +centroidY.toFixed(4), apexFloor: +apexFloor.toFixed(4) }); },
    get readout() { return Object.assign({}, read); },

    setProfile(next) { profile = next; cfg = deriveTumble(rig, next, Object.assign({}, cfg, { apexFloor })); return api; },
    setFacing(f) { facing = f; return api; },
    /** Vorausrechnen ohne zu springen — für die Abnahme der Umdrehungszahl. */
    preview(o) { return deriveTumble(rig, profile, Object.assign({ apexFloor }, o || {})); },

    /**
     * `severity` 0–1 Stärke, `speed` 0–1 Tempo beim Absprung, `side` −1/+1 Drehrichtung,
     * `words` schaltet das Lautwort ein.
     */
    trigger({ severity = 1, speed = 0.7, side: sd = 1, words = false } = {}) {
      side = sd < 0 ? -1 : 1;
      wantWord = !!words;
      cfg = deriveTumble(rig, profile, { severity, speed, apexFloor });
      state.active = true; state.hold = false; state.t = 0;
      state.land = false; state.rec = false; state.word = false;
      read.durationMs = cfg.durationMs; read.apex = cfg.apex; read.turns = cfg.turns;
      axisLine.visible = true;
      /* Der Absprungton wird GEPUFFERT, nicht direkt in den Readout geschrieben: `update()` löscht
         die Ereignisfelder in seiner ersten Zeile, und ein Cue, den nur der Aufrufer sieht, der
         zufällig selbst auslöst, ist kein deklarierter Cue. So bekommt ihn auch eine Laufzeit, die
         das Modul allein über seinen Readout fährt. */
      state.cue = 'launch';
      return api;
    },

    update(dt) {
      read.event = null; read.soundWord = null; read.tone = null;
      if (!state.active) {
        read.active = false; read.phase = 'rest'; read.tMs = 0;
        read.rollDeg = 0; read.heightY = 0; read.turn = 0;
        return read;
      }
      if (!state.hold) state.t += dt * 1000;
      const s = at(state.t);
      if (s.done) {
        if (!state.rec) { state.rec = true; read.event = 'recover'; read.active = true; read.phase = 'recovery'; place(s); return read; }
        api.reset(); read.phase = 'recovery';
        return read;
      }
      place(s);
      if (state.cue) { read.event = 'tone'; read.tone = state.cue; state.cue = null; }

      /* AUFSETZEN. Die Stärke steht im Plan: sie kommt aus der Aufsetzgeschwindigkeit √(2g·Gipfel),
         gespannt zwischen Stärke 0 und 1 desselben Fahrzeugs. Ein hoher Überschlag setzt härter
         auf als ein flacher — nachprüfbar an `config().vLand` und `config().strength`. */
      if (!state.land && s.phase === 'followThrough') {
        state.land = true;
        read.event = 'touchdown';
        read.strength = cfg.strength;
        /* DAS EINE LAUTWORT, wenn es verlangt ist. Es sitzt hier und nicht auf dem Absprung: der
           Absprung ist leise, der Einschlag ist laut. */
        if (wantWord && !state.word) { state.word = true; read.soundWord = cfg.severity < 0.5 ? 'WUPP' : 'WUMM'; }
        read.tone = 'land';
      }

      read.active = true; read.phase = s.phase; read.tMs = Math.round(state.t);
      read.rollDeg = +(side * cfg.totalDeg * (s.phase === 'anticipation' ? 0 : rollEase(s.u))).toFixed(1);
      if (s.phase === 'anticipation') read.rollDeg = +s.deg.toFixed(1);
      read.turn = s.turn; read.turns = cfg.turns;
      read.heightY = +s.h.toFixed(4); read.apex = cfg.apex; read.lift = +(s.lift || 0).toFixed(4);
      read.axisX = +s.axis.x.toFixed(4); read.axisY = +s.axis.y.toFixed(4);
      read.durationMs = cfg.durationMs;
      return read;
    },

    poseAt(ms, o) {
      if (!state.active) api.trigger(o || {});
      state.hold = true; state.t = Math.max(0, ms);
      api.update(0);
      return api.readout;
    },
    /** Kernzeiten für ein Beweisbild. */
    marks() {
      const t1 = cfg.antMs, t2 = t1 + cfg.airMs;
      return { anticipation: Math.round(t1 * 0.6), launch: t1 + Math.round(cfg.airMs * TIP_FRAC * 0.9),
        quarter: t1 + Math.round(cfg.airMs * 0.25), apex: t1 + Math.round(cfg.airMs * 0.5),
        threeQuarter: t1 + Math.round(cfg.airMs * 0.75),
        landing: t2 - 20, touchdown: t2 + 10, rebound: t2 + Math.round(cfg.reboundMs * 0.5),
        end: t2 + cfg.reboundMs };
    },
    release() { state.hold = false; return api; },

    reset() {
      state.active = false; state.hold = false; state.t = 0;
      state.land = false; state.rec = false; state.word = false; state.cue = null;
      place(at(0)); lift.position.y = 0; pivot.rotation.z = 0;
      axisLine.visible = false;
      read.active = false; read.phase = 'rest'; read.tMs = 0; read.rollDeg = 0;
      read.heightY = 0; read.turn = 0; read.event = null; read.soundWord = null; read.tone = null;
      return api;
    },

    dispose() {
      api.reset();
      if (lift.parent) lift.parent.remove(lift);
      if (axisLine.geometry) { axisLine.geometry.dispose(); axisLine.material.dispose(); }
      return api;
    },
  };
  return api;
}

/** Fixture-Vertrag, §12.3. */
export const TUMBLE_FIXTURES = [
  { id: 'tumbleLight', seed: 'tb-light', trigger: "tumble({severity:0.45, speed:0.5})",
    expectedPrimaryRead: 'Eine Umdrehung, flach, landet auf den Rädern',
    forbiddenOverlaps: ['twoWheel'] },
  { id: 'tumbleHeavy', seed: 'tb-heavy', trigger: "tumble({severity:1, speed:1})",
    expectedPrimaryRead: 'Mehrere Umdrehungen, hoch, landet trotzdem exakt auf den Rädern',
    forbiddenOverlaps: ['twoWheel'] },
  { id: 'tumbleRecover', seed: 'tb-recover', trigger: "tumble({severity:0.8}) → landing → fishtail",
    expectedPrimaryRead: 'Überschlag ist der Hauptread, das Aufsetzen der Akzent, das Schlingern die Erholung — drei Beats, nicht gleichzeitig',
    forbiddenOverlaps: ['twoWheel'] },
];
