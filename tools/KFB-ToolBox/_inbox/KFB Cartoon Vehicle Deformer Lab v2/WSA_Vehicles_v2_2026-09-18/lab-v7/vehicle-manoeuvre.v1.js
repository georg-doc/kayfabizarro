/**
 * lab-v7/vehicle-manoeuvre.v1.js · Motion-Familie »Manöver«.
 * Rückwärtsfahren · Wenden · Einparken. Georgs Auftrag vom 18.09.
 *
 * WAS MAN SEHEN SOLL (ein Read je Programm, §1.2)
 *   rückwärts   Das Fahrzeug überlegt, legt den Rückwärtsgang ein und zieht zurück.
 *   wenden      Es passt nicht in einem Zug — also vor, zurück, vor.
 *   einparken   Es fährt vorbei, hält, und zieht in die Lücke.
 *
 * DER UNTERSCHIED ZU ALLEN BISHERIGEN FAMILIEN: hier FÄHRT das Fahrzeug. Deformer, Schlingern
 * und Zwei-Rad sind Posen auf der Stelle. Ein Manöver ist ein WEG, und der Weg ist das, was man
 * liest — welche Pose dabei entsteht, ist Folge, nicht Absicht. Darum erfindet diese Datei keine
 * einzige Deformation. Sie erzeugt die SIGNALE (`speed`, `longAccel`, `lateral`), die der
 * Deformer schon frisst, und der macht die Cartoon-Verformung wie gehabt.
 *
 * GEMESSEN, NICHT GERATEN
 *   Der Weg kommt aus einem kinematischen Einspurmodell auf dem GEMESSENEN Radstand
 *   (`rig.report.wheelbase`), Drehpunkt ist die gemessene Hinterachse (kleinstes z der Räder),
 *   und die Fahrzeughülle (`rig.frame`) ist es, die an der Bordsteinkante anstößt. Wie viele Züge
 *   eine Wende braucht, wird darum nicht gesetzt, sondern AUSGERECHNET: der Löser fährt bei
 *   Vollausschlag, bis eine gemessene Fahrzeugecke aus der Gasse läuft, wechselt Gang und
 *   Einschlag und zählt weiter. Ein kurzer Wagen wendet in drei Zügen, ein langer in fünf. Das
 *   ist ein Befund, keine Einstellung.
 *
 * ABGELEITET STATT ERFUNDEN
 *   `longAccel` wird DIFFERENZIERT, nicht geschrieben: aus dem Geschwindigkeitsverlauf des Zuges.
 *   Deshalb taucht die Nase beim Anfahren im Rückwärtsgang nach VORN — die Trägheit weiß nichts
 *   vom Gang. `lateral` ist v²·Krümmung. Beide werden auf ihr Maximum im Plan normiert, damit der
 *   Deformer seinen ganzen Bereich sieht, ohne dass ein Faktor gesetzt wird.
 *
 * FREI GESETZT sind genau vier Zahlen (STEER_MAX_DEG, LANE_OF_LENGTH, CRUISE_LEN_PER_S, RAMP)
 * plus die drei Mode-Zeilen. Die Mode-Zeilen sind ausdrücklich Gestaltung, keine Messung — sie
 * sind der Charakter der Fahrweise, und Georg hat drei davon bestellt.
 */
export const SCHEMA = 'kfb.manoeuvre/1';

export const MANOEUVRE = {
  id: 'manoeuvre',
  family: 'locomotion',
  meaning: 'Das Fahrzeug legt einen Weg zurück, den es sich vorher überlegt hat.',
  loop: false,
  phases: ['anticipation', 'action', 'followThrough', 'recovery'],
  requiredAnchors: ['rearAxle', 'contactPlane', 'lane'],
  protectedAreas: [],
  eventBudget: {
    maxPrimaryVfx: 0, maxSecondaryVfx: 0, maxTertiaryVfx: 0,
    maxSoundWords: 0, maxAudioCues: 0, maxCameraActions: 0,
  },
  recovery: { restorePose: true, restoreTransform: true, clearVfx: true, clearAudioState: true, withinMs: 260 },
};

/* Die drei Fahrweisen. Georg: »freeroam & city parcours race & chill ride modes können
 * fließend wechseln« — also darf der Wechsel MITTEN im Manöver kommen. Er ändert dann nicht die
 * Geometrie (der Weg ist gefahren, der Bordstein bleibt, wo er ist), sondern nur das Tempo der
 * verbleibenden Züge. `beatMs` ist die Standzeit beim Gangwechsel: der Moment, in dem das
 * Fahrzeug nachdenkt. Er ist das, was chill von freeroam unterscheidet, mehr als die Geschwindigkeit.
 * `overshoot` ist der Lenk-Überschlag beim Anfahren (Cartoon-Anschlag, §2.5). */
export const MODES = {
  chill:    { id: 'chill',    label: 'CHILL RIDE',    pace: 0.62, beatMs: 430, lock: 0.80, overshoot: 0.22 },
  city:     { id: 'city',     label: 'CITY PARCOURS', pace: 1.00, beatMs: 260, lock: 1.00, overshoot: 0.42 },
  freeroam: { id: 'freeroam', label: 'FREEROAM',      pace: 1.38, beatMs: 145, lock: 1.00, overshoot: 0.72 },
};

const RAD = Math.PI / 180;
const STEER_MAX_DEG = 34;      /* Vollausschlag. Ein Serienwagen schafft 27–30°, der Cartoon darf enger. */
/* Gassenbreite in Fahrzeuglängen. GEMESSEN eingestellt, nicht geschaetzt: der Löser wurde an
 * car_hatchback gegen die Gassenbreite abgefahren (Radstand 0,502 u, R 0,744 u, Länge 0,806 u).
 *   ≤ 1,25 → erreicht 180° gar nicht (77–117° bei sieben Zügen)
 *   1,30–1,35 → 7 Züge     1,40–1,50 → 5     1,55 → 4
 *   1,60–2,00 → 3 Züge     ≥ 2,05 → 2, dann ist es keine Wende mehr, sondern eine Kehre
 * 1,60 ist der schmalste Wert, bei dem die Bewegung als DREI-Punkt-Wende liest — das ist der
 * Read, den Georg bestellt hat. Eine reale Wohnstraße liegt bei 1,33; dort braucht ein echtes
 * Auto tatsächlich fünf bis sieben Züge, und das gibt der Löser auch so aus. */
const LANE_OF_LENGTH = 1.60;
const CRUISE_LEN_PER_S = 0.95; /* Manövertempo: Fahrzeuglängen je Sekunde. Erste Fassung stand auf 0,55 —
                                * gemessen ergab das 6,4 s für ein Rückwärtsstück von 1,8 u. Zu träge für
                                * einen Cartoon, in dem die Standzeit die Pointe ist und nicht die Fahrt. */
const RAMP = 0.3;              /* Anteil des Zuges für An- und Auslauf. Mittleres Tempo = (1 − RAMP)·Spitze. */

/** Vermessen. Kein Wert je Fixture, kein Wert je Pack. */
export function measure(rig, facing = 1) {
  const rep = rig.report, f = rig.frame;
  const L = rep.wheelbase > 1e-4 ? rep.wheelbase : f.length * 0.6;
  const T = rep.track > 1e-4 ? rep.track : f.width;
  const zs = rig.wheels.map((w) => w.centre.z);
  /* Die Hinterachse ist der Drehpunkt des Einspurmodells. Welches Ende hinten ist, sagt `facing` —
     gemessen ist nur, WO die Radpaare liegen. */
  const zRear = zs.length ? (facing >= 0 ? Math.min(...zs) : Math.max(...zs)) : -L / 2 * facing;
  return {
    L: +L.toFixed(4), T: +T.toFixed(4), W: f.width, len: f.length,
    zRear: +zRear.toFixed(4), back: Math.abs(zRear), facing,
  };
}

const smooth = (u) => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };
const ramp = (u) => (u < RAMP ? smooth(u / RAMP) : u > 1 - RAMP ? smooth((1 - u) / RAMP) : 1);

/** Karosserieursprung aus dem Hinterachspunkt: `back` Einheiten in Nasenrichtung davor. */
function bodyOf(st, m) {
  return { x: st.x + Math.sin(st.yaw) * m.back, z: st.z + Math.cos(st.yaw) * m.back };
}
/** Die vier gemessenen Grundrissecken in der Welt. Sie stoßen an, nicht der Mittelpunkt. */
function corners(b, yaw, m) {
  const hw = m.W / 2, hl = m.len / 2, c = Math.cos(yaw), s = Math.sin(yaw);
  return [[-hw, -hl], [hw, -hl], [hw, hl], [-hw, hl]].map(([bx, bz]) => [b.x + bx * c + bz * s, b.z - bx * s + bz * c]);
}

/**
 * Plan bauen UND dabei integrieren. Beides in einem Durchgang, weil der Löser der Wende die
 * Abbruchbedingung erst am gefahrenen Weg erkennt — eine Wende lässt sich nicht deklarieren.
 */
export function plan(program, m, mode, opts = {}) {
  const steerMax = STEER_MAX_DEG * mode.lock;
  const R = m.L / Math.tan(steerMax * RAD);
  const lane = m.len * (opts.laneOfLength || LANE_OF_LENGTH);
  /* DER WAGEN STARTET AM BORDSTEIN, nicht in der Mitte der Gasse. Die erste Fassung setzte ihn
     mittig — gemessen brauchte car_hatchback dann SIEBEN Züge und erreichte nur 74,7° statt 180°,
     weil jedem Zug nur die halbe Gassenbreite blieb. Ein Fahrer fährt vor dem Wenden an den Rand,
     und damit verdoppelt sich der Weg quer. Statt das Fahrzeug zu versetzen, liegt die Gasse
     asymmetrisch: sie beginnt dicht an seiner Flanke und reicht nach +x. Gleiche Geometrie,
     kein Sprung im Bild, und die gezeichneten Linien sagen die Wahrheit. */
  const clear = m.W * 0.12;
  const laneMin = -(m.W / 2 + clear), laneMax = laneMin + lane;
  const ds = Math.max(m.L / 60, 1e-5);
  const st = { x: 0, z: 0, yaw: 0 };
  const legs = [], path = [];
  const mark = () => { const b = bodyOf(st, m); path.push(b.x, 0.002, b.z); };
  mark();

  function run(gear, steerDeg, stop) {
    const leg = { kind: 'drive', gear, steerDeg, arc: 0, samples: [{ s: 0, x: st.x, z: st.z, yaw: st.yaw }] };
    const k = Math.tan(steerDeg * RAD) / m.L;
    let guard = 0;
    while (!stop(st, leg) && guard++ < 40000) {
      st.yaw += k * ds * gear;
      st.x += Math.sin(st.yaw) * ds * gear;
      st.z += Math.cos(st.yaw) * ds * gear;
      leg.arc += ds;
      leg.samples.push({ s: leg.arc, x: st.x, z: st.z, yaw: st.yaw });
      if (guard % 3 === 0) mark();
    }
    mark();
    legs.push(leg);
    return leg;
  }
  const dist = (d) => (s, lg) => lg.arc >= d;
  const yawTo = (target, sign) => (s) => (sign > 0 ? s.yaw >= target : s.yaw <= target);
  function beat(ms) { legs.push({ kind: 'beat', ms, arc: 0, x: st.x, z: st.z, yaw: st.yaw }); }

  const note = [];
  let legCount = 0, slot = null, theta = 0;

  if (program === 'straight') {
    run(1, 0, dist(m.len * (opts.distOfLength || 4)));
    note.push('Gerade Fahrt. Trägerprogramm für Stunts, die unterwegs stattfinden.');

  } else if (program === 'reverse') {
    beat(mode.beatMs * 1.45);
    run(-1, 0, dist(m.len * (opts.distOfLength || 1.6)));
    beat(mode.beatMs);
    note.push('Gerade zurück. Die Standzeit vorweg ist der Gangwechsel, und sie ist der Read.');

  } else if (program === 'reverseArc') {
    beat(mode.beatMs * 1.45);
    run(-1, -steerMax, yawTo(75 * RAD, 1));
    run(-1, 0, dist(m.len * 0.75));
    beat(mode.beatMs);
    note.push('Rückwärts um die Ecke: Vollausschlag bis 75° Gierwinkel, dann gerade weiter.');

  } else if (program === 'turn') {
    /* DER LÖSER. Vollausschlag, bis eine gemessene Ecke aus der Gasse läuft, dann Gang UND
       Einschlag wechseln — beide, sonst dreht der Rückzug wieder zurück. Der Mindestweg
       `minArc` verhindert einen Zug der Länge null: beim Umsetzen steht die Ecke, die gerade
       angestoßen hat, noch draußen. */
    const minArc = m.L * 0.2;
    let gear = 1, steer = steerMax;
    while (Math.abs(st.yaw) < Math.PI - 1e-3 && legCount < 7) {
      run(gear, steer, (s, lg) => Math.abs(s.yaw) >= Math.PI
        || (lg.arc > minArc && corners(bodyOf(s, m), s.yaw, m).some((c) => c[0] > laneMax || c[0] < laneMin))
        || lg.arc > m.len * 8);
      legCount++;
      if (Math.abs(st.yaw) >= Math.PI - 1e-3) break;
      beat(mode.beatMs);
      gear = -gear; steer = -steer;
    }
    beat(mode.beatMs * 0.8);
    note.push(legCount + ' Züge bei Gasse ' + (lane / m.len).toFixed(2) + ' × Fahrzeuglänge'
      + (legCount === 1 ? ' — es passt in einem Zug, das ist keine Wende, das ist eine Kehre.' : '.'));

  } else if (program === 'park') {
    /* PARALLEL EINPARKEN, zwei Bögen. Der Einschlagwinkel ist EXAKT lösbar und nicht geraten:
       zwei gleich große Bögen um ±R versetzen das Fahrzeug seitlich um 2R(1 − cos θ) und geben
       ihm den Kurs zurück. Aus dem gewünschten Versatz d folgt θ = arccos(1 − d/2R). Die
       Integration fährt es danach nach und der Bericht vergleicht Soll und Ist. */
    const d = m.W * (1 + (opts.gapOfWidth || 0.35));
    theta = Math.acos(Math.max(-1, Math.min(1, 1 - d / (2 * R))));
    run(1, 0, dist(m.len * 1.15));
    beat(mode.beatMs * 1.45);
    run(-1, -steerMax, yawTo(theta, 1));
    /* Kurze Standzeit ZWISCHEN den beiden Bögen. Ohne sie springt die Lenkung in einem Frame von
       −34° auf +34° — 68° auf einen Schlag, und das sieht man. Mit ihr dreht der Fahrer im Stand
       um, was ohnehin die einzige Art ist, wie das geht. */
    beat(mode.beatMs * 0.6);
    run(-1, steerMax, yawTo(0, -1));
    beat(mode.beatMs * 0.9);
    run(1, 0, dist(m.len * 0.16));
    beat(mode.beatMs * 0.7);
    slot = { d: +d.toFixed(4), theta: +(theta / RAD).toFixed(2) };
    note.push('Einschlagbogen ' + (theta / RAD).toFixed(1) + '° je Seite für ' + d.toFixed(3) + ' u Seitenversatz.');
  }

  /* ── Zeit auf den Weg legen ───────────────────────────────────────────────────────────────
     Ein Zug fährt mit Anlauf und Auslauf (`ramp`). Daraus folgt die Dauer aus dem Weg, und die
     Beschleunigung folgt aus der Dauer — nicht umgekehrt. */
  const v = CRUISE_LEN_PER_S * m.len * mode.pace;
  let t = 0;
  legs.forEach((lg) => {
    lg.t0 = t;
    if (lg.kind === 'beat') { t += lg.ms; lg.t1 = t; return; }
    lg.ms = Math.max(60, 1000 * lg.arc / (v * (1 - RAMP)));
    /* u → gefahrener Anteil. Einmal tabelliert, damit `poseAt(ms)` exakt und wiederholbar ist. */
    const N = 128, F = new Float64Array(N + 1);
    let acc = 0;
    for (let i = 1; i <= N; i++) { acc += ramp((i - 0.5) / N) / N; F[i] = acc; }
    for (let i = 0; i <= N; i++) F[i] /= acc || 1;
    lg.F = F; lg.vPeak = v;
    t += lg.ms; lg.t1 = t;
  });

  const p = {
    program, mode: mode.id, legs, path, durationMs: Math.round(t),
    steerMax: +steerMax.toFixed(2), R: +R.toFixed(4), lane: +lane.toFixed(4),
    laneMin: +laneMin.toFixed(4), laneMax: +laneMax.toFixed(4),
    vCruise: +v.toFixed(4), legCount: legs.filter((l) => l.kind === 'drive').length,
    turnLegs: legCount || null, slot, note: note.join(' '),
  };
  /* Normierung: die Signale bekommen ihren Maßstab aus dem Plan selbst. */
  let aMax = 1e-9, latMax = 1e-9;
  const bb = { minX: 1e9, maxX: -1e9, minZ: 1e9, maxZ: -1e9 };
  for (let ms = 0; ms <= p.durationMs; ms += 10) {
    const s = raw(p, ms, m);
    aMax = Math.max(aMax, Math.abs(s.a)); latMax = Math.max(latMax, Math.abs(s.lat));
    corners(s.body, s.yaw, m).forEach((c) => {
      bb.minX = Math.min(bb.minX, c[0]); bb.maxX = Math.max(bb.maxX, c[0]);
      bb.minZ = Math.min(bb.minZ, c[1]); bb.maxZ = Math.max(bb.maxZ, c[1]);
    });
  }
  p.aRef = aMax; p.latRef = latMax;
  /* Die überstrichene Fläche, gemessen am gefahrenen Weg. Die Kamera braucht sie, um das ganze
     Manöver zu zeigen — ein Bildausschnitt für ein stehendes Fahrzeug schneidet eine Wende ab. */
  p.bounds = { minX: +bb.minX.toFixed(4), maxX: +bb.maxX.toFixed(4), minZ: +bb.minZ.toFixed(4), maxZ: +bb.maxZ.toFixed(4) };
  p.centre = { x: +((bb.minX + bb.maxX) / 2).toFixed(4), z: +((bb.minZ + bb.maxZ) / 2).toFixed(4) };
  p.sweptWidth = +(bb.maxX - bb.minX).toFixed(4);
  p.sweptLength = +(bb.maxZ - bb.minZ).toFixed(4);
  const last = raw(p, p.durationMs, m);
  p.endBody = { x: +last.body.x.toFixed(4), z: +last.body.z.toFixed(4) };
  p.endYawDeg = +(last.yaw / RAD).toFixed(2);
  p.lateralAchieved = +Math.abs(last.body.x).toFixed(4);
  if (slot) { slot.lateralAchieved = p.lateralAchieved; slot.slotLength = p.sweptLength; }
  return p;
}

/** Rohzustand zu einer Zeit: Pose, Tempo, Beschleunigung, Querbeschleunigung. Ohne Normierung. */
function raw(p, ms, m) {
  const tms = Math.max(0, Math.min(p.durationMs, ms));
  let lg = p.legs[p.legs.length - 1];
  for (let i = 0; i < p.legs.length; i++) { if (tms <= p.legs[i].t1) { lg = p.legs[i]; break; } }
  if (lg.kind === 'beat') {
    const st = { x: lg.x, z: lg.z, yaw: lg.yaw };
    return { body: bodyOf(st, m), yaw: lg.yaw, v: 0, a: 0, lat: 0, gear: 0, steerDeg: 0, leg: lg, u: (tms - lg.t0) / lg.ms };
  }
  const u = Math.max(0, Math.min(1, (tms - lg.t0) / lg.ms));
  const vNow = lg.vPeak * ramp(u);
  const h = 8 / lg.ms;
  const a = (lg.vPeak * ramp(Math.min(1, u + h)) - lg.vPeak * ramp(Math.max(0, u - h))) / (2 * h * lg.ms / 1000);
  const N = lg.F.length - 1, fi = u * N, i0 = Math.floor(fi), f = fi - i0;
  const frac = lg.F[Math.min(N, i0)] + (lg.F[Math.min(N, i0 + 1)] - lg.F[Math.min(N, i0)]) * f;
  const s = frac * lg.arc;
  const sm = lg.samples, si = Math.min(sm.length - 1, Math.max(0, s / (sm[1] ? sm[1].s : 1)));
  const j0 = Math.floor(si), j1 = Math.min(sm.length - 1, j0 + 1), g = si - j0;
  const st = {
    x: sm[j0].x + (sm[j1].x - sm[j0].x) * g,
    z: sm[j0].z + (sm[j1].z - sm[j0].z) * g,
    yaw: sm[j0].yaw + (sm[j1].yaw - sm[j0].yaw) * g,
  };
  const curv = Math.tan(lg.steerDeg * RAD) / m.L;
  return { body: bodyOf(st, m), yaw: st.yaw, v: vNow, a, lat: vNow * vNow * curv, gear: lg.gear, steerDeg: lg.steerDeg, leg: lg, u };
}

/**
 * Hängt das Manöver als ÄUSSERSTE Schicht ein. Darunter kommt alles, was auf der Stelle
 * passiert — Zwei-Rad, Schlingern, Deformer. `root` ist statisch (die Anker gehören in die Welt),
 * `carrier` bewegt sich.
 */
export function attachManoeuvre({ THREE, rig, profile, facing = 1, child = null, mode = 'city' }) {
  const root = new THREE.Group(); root.name = 'ManoeuvreWorld';
  const anchors = new THREE.Group(); anchors.name = 'ManoeuvreAnchors'; root.add(anchors);
  const carrier = new THREE.Group(); carrier.name = 'ManoeuvreCarrier'; root.add(carrier);
  carrier.add(child || rig.group);
  /* Fährt das Modell auf −z, wird der Träger einmal umgedreht — dann ist »Nase voraus« für beide
     Fälle dieselbe Weltrichtung und der ganze Plan bleibt in EINEM Bezugssystem. */
  let spin = facing < 0 ? Math.PI : 0;

  let m = measure(rig, facing);
  let modeId = MODES[mode] ? mode : 'city';
  let p = null, drawn = null;
  const st = { t: 0, active: false, hold: false, rate: 1 };
  const read = { active: false, program: null, mode: modeId, phase: 'rest', leg: 0, legs: 0, gear: 0,
    tMs: 0, durationMs: 0, speed: 0, longAccel: 0, lateral: 0, steerDeg: 0, travelled: 0, yawDeg: 0, note: null };
  const sig = { speed: 0, longAccel: 0, lateral: 0, bank: 0, drift: 0 };

  function line(pts, colour) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: colour }));
    l.frustumCulled = false; return l;
  }
  function clearAnchors() {
    while (anchors.children.length) {
      const c = anchors.children.pop();
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    }
  }
  /** §12.2: der gerechnete Weg wird GEZEICHNET. Was man nicht sieht, kann man nicht abnehmen. */
  function buildAnchors() {
    clearAnchors();
    if (!p) return;
    anchors.add(line(p.path, 0xcc0033));
    const z0 = -m.len * 1.5, z1 = m.len * 3;
    if (p.program === 'turn') {
      [p.laneMin, p.laneMax].forEach((x) => anchors.add(line([x, 0.002, z0, x, 0.002, z1], 0x888888)));
    }
    if (p.program === 'park' && p.slot) {
      /* Die Lücke, wie sie der Plan braucht — gemessen am überstrichenen Weg, nicht gesetzt. */
      const x = -p.lateralAchieved, hw = m.W / 2 * 1.12, len = p.sweptLength;
      const zc = p.endBody.z;
      const a = zc - len / 2, b = zc + len / 2;
      anchors.add(line([x - hw, 0.002, a, x + hw, 0.002, a, x + hw, 0.002, b, x - hw, 0.002, b, x - hw, 0.002, a], 0x9c3300));
    }
    drawn = p.program;
  }

  const api = {
    schema: SCHEMA, preset: MANOEUVRE, root, carrier,
    get measured() { return Object.assign({}, m); },
    get config() { return p ? Object.assign({}, p, { legs: undefined, path: undefined }) : null; },
    get readout() { return Object.assign({}, read); },
    get signals() { return Object.assign({}, sig); },
    get mode() { return modeId; },
    get programs() { return ['straight', 'reverse', 'reverseArc', 'turn', 'park']; },

    setProfile(next) { profile = next; return api; },
    setFacing(f) {
      facing = f; m = measure(rig, f);
      spin = f < 0 ? Math.PI : 0;
      if (!st.active) carrier.rotation.y = spin;
      return api;
    },

    /** Vorausrechnen, ohne zu fahren — für den Bericht und für Georgs Abnahme der Zahlen. */
    preview(program, opts = {}) { return plan(program, m, MODES[modeId], opts); },

    start(program, opts = {}) {
      p = plan(program, m, MODES[modeId], opts);
      buildAnchors();
      st.t = 0; st.active = true; st.hold = false; st.rate = 1;
      read.note = p.note;
      return api;
    },

    /** Moduswechsel. Während der Fahrt bleibt die GEOMETRIE — nur die restliche Zeit skaliert. */
    setMode(id) {
      if (!MODES[id]) return api;
      if (st.active && p) st.rate = MODES[id].pace / MODES[p.mode].pace;
      modeId = id; read.mode = id;
      if (!st.active) { p = null; clearAnchors(); }
      return api;
    },

    update(dt) {
      if (!st.active || !p) {
        read.active = false; read.phase = 'rest'; read.tMs = 0;
        sig.speed = sig.longAccel = sig.lateral = 0;
        return read;
      }
      if (!st.hold) st.t += dt * 1000 * st.rate;
      if (st.t > p.durationMs) { api.stop(); read.phase = 'recovery'; return read; }
      const s = raw(p, st.t, m);

      carrier.position.set(s.body.x, 0, s.body.z);
      carrier.rotation.y = s.yaw + spin;

      /* Lenkung: Zielwinkel des Zuges, beim Anfahren mit Überschlag (§2.5), und im Gangwechsel
         schon auf den NÄCHSTEN Zug vorgelegt — genau das tut ein Fahrer im Stand, und es ist die
         Anticipation, die das Umsetzen lesbar macht. */
      const mo = MODES[modeId];
      let steer = s.steerDeg;
      if (s.leg.kind === 'beat') {
        const nx = p.legs[p.legs.indexOf(s.leg) + 1];
        const target = nx && nx.kind === 'drive' ? nx.steerDeg : 0;
        steer = target * smooth((s.u - 0.45) / 0.55);
      } else if (s.u < 0.25) {
        steer = s.steerDeg * (1 + mo.overshoot * (1 - smooth(s.u / 0.25)) * 0.35);
      }

      sig.speed = Math.min(1, Math.abs(s.v) / (CRUISE_LEN_PER_S * m.len * 1.38));
      /* Vorzeichen: `longAccel` ist positiv beim Gasgeben. Im Rückwärtsgang zeigt der
         Beschleunigungsvektor nach hinten, die Trägheit drückt die Masse nach vorn — also
         NEGATIV, und die Nase taucht. Das ist keine Einstellung, das ist `gear × a`. */
      sig.longAccel = Math.max(-1, Math.min(1, (s.gear * s.a) / p.aRef));
      sig.lateral = Math.max(-1, Math.min(1, -s.lat / p.latRef));
      sig.drift = 0; sig.bank = 0;

      const di = p.legs.filter((l) => l.kind === 'drive').indexOf(s.leg);
      read.active = true; read.program = p.program; read.mode = modeId;
      read.phase = s.leg.kind === 'beat' ? 'anticipation' : (s.u > 0.72 ? 'followThrough' : 'action');
      read.leg = di >= 0 ? di + 1 : 0; read.legs = p.legCount;
      read.gear = s.gear; read.tMs = Math.round(st.t); read.durationMs = p.durationMs;
      read.speed = +sig.speed.toFixed(3); read.longAccel = +sig.longAccel.toFixed(3);
      read.lateral = +sig.lateral.toFixed(3); read.steerDeg = +steer.toFixed(2);
      read.travelled = +Math.hypot(s.body.x, s.body.z).toFixed(3);
      read.yawDeg = +(s.yaw / RAD).toFixed(2);
      /* Radlauf: Weg je Sekunde MIT Vorzeichen des Gangs. Rückwärts drehen die Räder rückwärts —
         der billigste und sicherste Read für »Rückwärtsgang«. */
      read.wheelSpeed = s.gear * s.v;
      return read;
    },

    /** Pose auf exakter Zeit halten. Derselbe Beweisgriff wie beim Schlingern. */
    poseAt(ms) {
      if (!p) return null;
      st.active = true; st.hold = true; st.t = Math.max(0, Math.min(p.durationMs, ms));
      api.update(0);
      return api.readout;
    },
    release() { st.hold = false; return api; },

    stop() {
      st.active = false; st.hold = false; st.t = 0;
      carrier.position.set(0, 0, 0); carrier.rotation.y = spin;
      sig.speed = sig.longAccel = sig.lateral = 0;
      read.active = false; read.phase = 'rest'; read.tMs = 0; read.leg = 0; read.gear = 0;
      read.speed = 0; read.longAccel = 0; read.lateral = 0; read.steerDeg = 0; read.wheelSpeed = 0;
      return api;
    },
    reset() { api.stop(); clearAnchors(); p = null; drawn = null; return api; },

    dispose() {
      api.reset();
      if (root.parent) root.parent.remove(root);
      return api;
    },
  };
  carrier.rotation.y = spin;
  return api;
}

/** Fixture-Vertrag, §12.3. Ein Eintrag je Read, nicht je Einstellung. */
export const MANOEUVRE_FIXTURES = [
  { id: 'reverse', seed: 'mv-reverse', trigger: "manoeuvre('reverse')",
    expectedPrimaryRead: 'Standzeit, dann zieht es gerade zurück; Räder drehen rückwärts, Nase taucht beim Anfahren',
    forbiddenOverlaps: ['fishtail'] },
  { id: 'reverseArc', seed: 'mv-reverse-arc', trigger: "manoeuvre('reverseArc')",
    expectedPrimaryRead: 'Rückwärts um die Ecke, Vollausschlag, danach gerade',
    forbiddenOverlaps: ['fishtail'] },
  { id: 'turn', seed: 'mv-turn', trigger: "manoeuvre('turn')",
    expectedPrimaryRead: 'Es passt nicht in einem Zug: vor, zurück, vor — die Zahl der Züge ist gerechnet',
    forbiddenOverlaps: ['twoWheel'] },
  { id: 'park', seed: 'mv-park', trigger: "manoeuvre('park')",
    expectedPrimaryRead: 'Vorbeifahren, halten, in zwei Bögen in die Lücke, ein Vorwärtsschub zum Ausrichten',
    forbiddenOverlaps: ['twoWheel', 'fishtail'] },
];
