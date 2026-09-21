/**
 * lab-v8/flight-deformer.v1.js · S1 + S3 · Lage und Ereignisse eines Flugkoerpers.
 *
 * ═══ WAS DIESES MODUL BESITZT UND WAS NICHT ═════════════════════════════════════════════════
 * Es besitzt AUSSCHLIESSLICH Praesentationsknoten: eine Lage-Gruppe um die gemessene Huellenmitte
 * und eine Roll-Gruppe in der gemessenen Fluegelebene. Es schreibt nie Weltposition, nie Kurs,
 * nie Tempo, nie Hoehe und nie die Kamera — die gehoeren Travel (`travel/CONTRACT.md`).
 *
 * Die Schraeglage kommt als ZAHL aus Travel (`carpet.state.bankAngle`, ueber die Naht auf -1..1
 * normiert). Hier steht kein zweiter Pose-Regler daneben: `bank` ist ein Eingang, kein Parameter.
 *
 * ═══ WARUM ZWEI DREHPUNKTE UND NICHT EINER ══════════════════════════════════════════════════
 * Ein Flugkoerper nickt und giert um seinen Schwerpunkt, rollt aber um die Laengsachse IN DER
 * FLUEGELEBENE. Bei einem Hochdecker liegen die beiden mehrere Zentimeter auseinander; rollt man
 * um den Schwerpunkt, wandert die Fluegelspitze sichtbar auf einer zu grossen Kreisbahn. Beides
 * ist gemessen (`flight-frame.v1.js`), also bekommt beides einen eigenen Drehpunkt.
 *
 *   FlightAttitude            (Wurzel, haengt in der Szene)
 *   └─ NickGier   pos=+Huelle      rot.x = Nicken, rot.y = Gieren
 *      └─          pos=-Huelle
 *         └─ Rollen pos=(0,Fluegelebene,0)   rot.z = Rollen
 *            └─     pos=(0,-Fluegelebene,0)
 *               └─ rig.group  (darin unveraendert der Boden-Deformer aus v2 fuer die FORM)
 *
 * ═══ ARBEITSTEILUNG MIT DEM BESTEHENDEN DEFORMER ════════════════════════════════════════════
 * Squash, Stretch und Twist der Huelle haengen an Signalen, nicht an Raedern — `vehicle-cartoon-
 * deformer.v2.js` kann also unveraendert weiterlaufen und macht hier die FORM. Damit die Bank
 * nicht doppelt erscheint, steht in allen Flugprofilen `bankFollow: 0` und `rollResponse` klein.
 *
 * ═══ GRAMMATIK ══════════════════════════════════════════════════════════════════════════════
 * Kontinuierliche Ursachen ziehen an Spring-ZIELEN (daraus entstehen Load und Follow-through von
 * selbst), Ereignisse setzen einen Spring-IMPULS (daraus entstehen Impact, Overshoot und Settle
 * von selbst). Ruhiger Reiseflug hat kein Ziel und keinen Impuls und ist deshalb exakt ruhig.
 */
import { Spring } from './spring.v1.js';

export const SCHEMA = 'kfb.flight-deformer/1';
const DEG = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const finite = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);

export const FALLBACK_FLIGHT_PROFILE = {
  id: 'FLIGHT_LIGHT',
  rollDeg: 54, pitchDeg: 30, pitchAccelDeg: 6,
  slipDeg: 9, slipTurnDeg: 5,
  twistDeg: 7, twistLag: 0.55,
  attitudeFreq: 2.6, attitudeDamp: 0.52,
  gustRoll: 11, gustYaw: 6,
  boostPitch: 7, boostStretch: 0.05,
  climbSquash: 0.045, pullOutPitch: 13, touchdownPitch: 9,
};

/**
 * @param {object} o
 * @param {object} o.THREE
 * @param {object} o.rig        carrig.v3 `analyse()`
 * @param {object} o.frame      flight-frame.v1 `measureFlightFrame()`
 * @param {object} o.shell      der laufende vehicle-cartoon-deformer.v2 (FORM) — optional
 * @param {object} o.profile    Flugprofil
 */
export function attachFlightDeformer({ THREE, rig, frame, shell = null, profile = null }) {
  const P = Object.assign({}, FALLBACK_FLIGHT_PROFILE, profile || {});

  const root = new THREE.Group(); root.name = 'FlightAttitude';
  const pitchYaw = new THREE.Group(); pitchYaw.name = 'FlightPitchYaw';
  const pyInner = new THREE.Group(); pyInner.name = 'FlightPitchYawInner';
  const rollPivot = new THREE.Group(); rollPivot.name = 'FlightRoll';
  const rollInner = new THREE.Group(); rollInner.name = 'FlightRollInner';

  pitchYaw.position.set(frame.hull.x, frame.hull.y, frame.hull.z);
  pyInner.position.set(-frame.hull.x, -frame.hull.y, -frame.hull.z);
  rollPivot.position.set(0, frame.wingY, 0);
  rollInner.position.set(0, -frame.wingY, 0);

  root.add(pitchYaw); pitchYaw.add(pyInner); pyInner.add(rollPivot);
  rollPivot.add(rollInner); rollInner.add(rig.group);

  const F = P.attitudeFreq, D = P.attitudeDamp;
  const S = {
    roll: new Spring({ freq: F, damp: D, cap: P.rollDeg * 2.0, attack: 1.1, release: 0.85 }),
    pitch: new Spring({ freq: F * 1.05, damp: D + 0.04, cap: (P.pitchDeg + P.pitchAccelDeg) * 2.0, attack: 1.2, release: 0.85 }),
    yaw: new Spring({ freq: F * 0.85, damp: D + 0.1, cap: (P.slipDeg + P.slipTurnDeg) * 2.2, attack: 1.0, release: 0.7 }),
    twist: new Spring({ freq: F * 1.4, damp: D - 0.1, cap: P.twistDeg * 2.4, attack: 1.5, release: 0.8 }),
  };

  /* Fluegelteile: nur wenn die Quelle sie getrennt fuehrt. Sonst bleibt der Twist UNAVAILABLE —
     ein Differenztwist auf EINEM Netz waere eine Scherung der ganzen Zelle, nicht ein Fluegel. */
  const wingNodes = [];
  if (frame.wings.left && frame.wings.right) {
    rig.body.children.forEach((n) => {
      if (!n.isMesh) return;
      if (n.name === frame.wings.left.name) wingNodes.push({ node: n, sign: 1, rest: n.rotation.z, pivotX: frame.wings.left.cx });
      if (n.name === frame.wings.right.name) wingNodes.push({ node: n, sign: -1, rest: n.rotation.z, pivotX: frame.wings.right.cx });
    });
  }
  const twistAvailable = wingNodes.length === 2;

  const inSig = { bank: 0, pitch: 0, turnRate: 0, drifting: 0, longAccel: 0, speedNorm: 0, climbIn: 0, boosting: false };
  let prevBoost = false, prevClimb = 0, now = 0;
  const events = [];
  const readout = { rollDeg: 0, pitchDeg: 0, yawDeg: 0, twistDeg: 0, dominant: 'idle', energy: 0, last: null, twistAvailable };

  const api = {
    schema: SCHEMA,
    root, nodes: { root, pitchYaw, rollPivot },
    frame, get profile() { return Object.assign({}, P); },
    get readout() { return Object.assign({}, readout); },
    get signals() { return Object.assign({}, inSig); },
    get twistAvailable() { return twistAvailable; },

    setProfile(next) {
      Object.assign(P, next || {});
      const f = P.attitudeFreq, d = P.attitudeDamp;
      S.roll.tune({ freq: f, damp: d, cap: P.rollDeg * 2.0 });
      S.pitch.tune({ freq: f * 1.05, damp: d + 0.04, cap: (P.pitchDeg + P.pitchAccelDeg) * 2.0 });
      S.yaw.tune({ freq: f * 0.85, damp: d + 0.1, cap: (P.slipDeg + P.slipTurnDeg) * 2.2 });
      S.twist.tune({ freq: f * 1.4, damp: d - 0.1, cap: P.twistDeg * 2.4 });
      return api;
    },

    /**
     * DER EINZIGE EINGANG. Bekommt den Block aus `travel-flight-seam.v1.js`. Alles, was hier
     * ankommt, gehoert Travel oder ist dort einmal abgeleitet worden — dieses Modul leitet
     * nichts nach.
     */
    consume(block) {
      if (!block) return api;
      inSig.bank = clamp(finite(block.bank), -1, 1);
      inSig.pitch = clamp(finite(block.pitch), -1, 1);
      inSig.turnRate = clamp(finite(block.turnRate), -1, 1);
      inSig.drifting = clamp(finite(block.drifting), 0, 1);
      inSig.longAccel = clamp(finite(block.longAccel), -1, 1);
      inSig.speedNorm = clamp(finite(block.speedNorm), 0, 1);
      inSig.climbIn = clamp(finite(block.climbIn), -1, 1);
      inSig.boosting = !!block.boosting;

      /* FORM: dieselben fuenf Signale, die der Boden-Deformer seit v2 kennt. `lateral` ist die
         Seitenlast der Kurve und folgt der Bank — sie wird NICHT zusaetzlich gerollt, dafuer
         steht bankFollow der Flugprofile auf 0. */
      if (shell) {
        shell.setSignals({
          speed: inSig.speedNorm,
          longAccel: inSig.longAccel,
          lateral: inSig.bank * 0.5,
          bank: inSig.bank,
          drift: inSig.drifting * Math.sign(inSig.bank || 1),
        });
      }

      /* Flanken. Genau die Stellen, an denen Travel/TinySkies selbst einen Impuls setzt —
         `card-carrier.js` macht es an derselben Kante (boosting an/aus, climbIn-Vorzeichen). */
      if (inSig.boosting && !prevBoost) api.boost(1);
      if (!inSig.boosting && prevBoost) api.boost(-0.45);
      prevBoost = inSig.boosting;
      const cs = inSig.climbIn > 0.1 ? 1 : inSig.climbIn < -0.1 ? -1 : 0;
      if (cs !== prevClimb) { api.climbEdge(cs); prevClimb = cs; }

      if (block.gust) api.gust({ side: Math.sign(block.gust), strength: Math.abs(block.gust) });
      if (block.impact) api.impact({ side: block.impactSide || 1, strength: block.impact });
      if (block.touchdown) api.touchdown({ strength: block.touchdown });
      return api;
    },

    /* ── Ereignisse · jedes setzt einen IMPULS, keine Pose ─────────────────────────────────
       DIE FAKTOREN SIND GERECHNET, NICHT GERATEN. Ein Geschwindigkeitsstoss v auf einen
       gedaempften Schwinger erreicht den Scheitel bei rund v/w, mit w = 2·pi·freq. Fuer
       attitudeFreq 2,6 Hz ist w ≈ 16,3 — ein Stoss soll also etwa 16…18 mal den gewuenschten
       Winkel gross sein, damit der Scheitel DIESER Winkel wird. Erste Fassung stand auf 7…11
       und ergab gemessene 0,4° Rollen bei einer Boe der Staerke 0,9: rechnerisch richtig gebaut,
       aber um den Faktor zwei zu leise. */

    /** Boe. Kein Travel-Eigentuemer — im Labor gefeuert, in der Naht als UNAVAILABLE gefuehrt. */
    gust({ side = 1, strength = 1 } = {}) {
      const s = clamp(finite(strength, 1), 0, 1), d = Math.sign(side || 1);
      S.roll.kick(d * P.gustRoll * s * 17);
      S.yaw.kick(-d * P.gustYaw * s * 15);
      S.twist.kick(d * P.twistDeg * s * 18);
      if (shell) shell.railImpact({ side: d, strength: s * 0.45 });
      mark('gust', s);
      return api;
    },

    /** Einschlag. Die FORM macht der bestehende Deformer, die LAGE dieses Modul. */
    impact({ side = 1, strength = 1 } = {}) {
      const s = clamp(finite(strength, 1), 0, 1), d = Math.sign(side || 1);
      S.yaw.kick(-d * (P.slipDeg + P.slipTurnDeg) * s * 15);
      S.roll.kick(d * P.gustRoll * s * 15);
      S.pitch.kick(P.pullOutPitch * s * 6);
      if (shell) shell.railImpact({ side: d, strength: s });
      mark('impact', s);
      return api;
    },

    /** Abfangen. Nase reisst hoch, Zelle staucht — ein Zug, kein gehaltener Winkel. */
    pullOut({ strength = 1 } = {}) {
      const s = clamp(finite(strength, 1), 0, 1);
      S.pitch.kick(P.pullOutPitch * s * 17);
      S.twist.kick(P.twistDeg * s * 12);
      if (shell) shell.landing({ strength: s * 0.7 });
      mark('pullOut', s);
      return api;
    },

    /** Aufsetzen. Bei den drei Fixtures MIT gemessenem Fahrwerk ist das derselbe Vorgang wie am
     *  Boden — darum ruft es dieselbe `landing()` des Boden-Deformers und erfindet keine zweite. */
    touchdown({ strength = 1 } = {}) {
      const s = clamp(finite(strength, 1), 0, 1);
      S.pitch.kick(-P.touchdownPitch * s * 16);
      if (shell) shell.landing({ strength: s });
      mark('touchdown', s);
      return api;
    },

    /** Schub an (+1) oder aus (negativ). Kante aus `boosting`, nicht aus dem Tempo. */
    boost(dir = 1) {
      const s = clamp(Math.abs(finite(dir, 1)), 0, 1) * Math.sign(dir);
      S.pitch.kick(P.boostPitch * s * 15);
      if (shell) {
        /* Stretch als Impuls: der bestehende Deformer hat keine oeffentliche Stretch-Kante, aber
           `landing()` waere das falsche Ereignis. Also nur die Lage hier, die Laengung entsteht
           ueber `longAccel` von selbst — das ist die Groesse, die Travel beim Schub aendert. */
      }
      mark(s >= 0 ? 'boost' : 'boostOff', Math.abs(s));
      return api;
    },

    /** Steig-/Sinkflanke. Card-carrier setzt hier denselben Stauchimpuls. */
    climbEdge(sign) {
      if (!sign) return api;
      S.pitch.kick(sign * P.pitchDeg * 0.35 * 12);
      S.twist.kick(sign * P.twistDeg * 0.5 * 10);
      mark(sign > 0 ? 'climb' : 'dive', 1);
      return api;
    },

    update(dt) {
      const h = clamp(finite(dt), 0, 0.5);
      now += h * 1000;

      /* ZIELE aus den Travel-Groessen. Bank ist ein Eingang; der einzige Freiheitsgrad hier ist,
         WIE WEIT die Praesentation ueberzeichnet (P.rollDeg), nicht OB sie rollt. */
      S.roll.set(inSig.bank * P.rollDeg);
      S.pitch.set(inSig.pitch * P.pitchDeg + inSig.longAccel * P.pitchAccelDeg);
      S.yaw.set(inSig.drifting * P.slipDeg * Math.sign(inSig.bank || 1) + inSig.turnRate * P.slipTurnDeg);
      S.twist.set(inSig.bank * P.twistDeg * (1 - P.twistLag) + inSig.turnRate * P.twistDeg * P.twistLag);

      const roll = S.roll.step(h), pitch = S.pitch.step(h), yaw = S.yaw.step(h), twist = S.twist.step(h);

      rollPivot.rotation.z = -roll * DEG;
      pitchYaw.rotation.x = -pitch * DEG;
      pitchYaw.rotation.y = yaw * DEG;

      if (twistAvailable) wingNodes.forEach((w) => { w.node.rotation.z = w.rest + w.sign * twist * DEG; });

      const energy = clamp((S.roll.amplitude / Math.max(1e-3, P.rollDeg)
        + S.pitch.amplitude / Math.max(1e-3, P.pitchDeg)
        + S.yaw.amplitude / Math.max(1e-3, P.slipDeg)) / 1.5, 0, 1);
      readout.rollDeg = +roll.toFixed(2);
      readout.pitchDeg = +pitch.toFixed(2);
      readout.yawDeg = +yaw.toFixed(2);
      readout.twistDeg = +twist.toFixed(2);
      readout.energy = +energy.toFixed(3);
      readout.dominant = energy > 0.18 ? 'ereignis'
        : (Math.abs(inSig.bank) > 0.12 ? 'bank'
        : (inSig.drifting > 0.15 ? 'drift'
        : (Math.abs(inSig.pitch) > 0.1 ? 'steigen' : (inSig.speedNorm > 0.05 ? 'reiseflug' : 'ruhe'))));
      readout.last = events.length ? events[events.length - 1] : null;
      return readout;
    },

    /** Muss EXAKT neutral werden. */
    reset() {
      Object.values(S).forEach((s) => s.reset());
      wingNodes.forEach((w) => { w.node.rotation.z = w.rest; });
      rollPivot.rotation.set(0, 0, 0);
      pitchYaw.rotation.set(0, 0, 0);
      Object.keys(inSig).forEach((k) => { inSig[k] = typeof inSig[k] === 'boolean' ? false : 0; });
      prevBoost = false; prevClimb = 0; events.length = 0;
      readout.rollDeg = 0; readout.pitchDeg = 0; readout.yawDeg = 0; readout.twistDeg = 0;
      readout.dominant = 'idle'; readout.energy = 0; readout.last = null;
      return api;
    },

    /** Was seit dem letzten Abruf gefeuert hat — fuer den Nachweis, nicht fuer die Darstellung. */
    drainEvents() { const e = events.slice(); events.length = 0; return e; },

    dispose() {
      rollInner.remove(rig.group);
      if (root.parent) root.parent.remove(root);
    },
  };

  function mark(name, strength) {
    events.push({ name, strength: +(+strength).toFixed(3), at: Math.round(now) });
    if (events.length > 40) events.shift();
    readout.last = events[events.length - 1];
  }

  return api;
}
