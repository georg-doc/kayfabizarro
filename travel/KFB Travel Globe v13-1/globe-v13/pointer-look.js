// ============================================================================
// pointer-look.js — KFB Travel Globe v3 · S1b · Maus und Touchpad
// ----------------------------------------------------------------------------
// Georg, 28.8.: die Maus ist fast unbelegt (Rad/Pinch fahren den Abstand, sonst nichts);
// tinyskies belegt sie ebenfalls nicht (`FlightControls.ts` ist reine Tastatur).
// Entschieden am 29.8.: **EINE Gebärde — Links-Ziehen** — und im Panel steht, was sie tut
// (umsehen oder lenken). Das jeweils andere liegt auf **Alt/Option + Ziehen**.
//
// Warum nicht links/rechts aufteilen: auf dem Touchpad ist Zwei-Finger-Ziehen KEIN Rechtsklick,
// sondern ein Wheel-Ereignis — also genau unser Zoom. „Secondary click" ist dort das
// Zwei-Finger-TIPPEN; ein Rechts-Ziehen heißt tippen-halten-ziehen und ist unbequem.
//
// ── Die zwei Eigentümer-Fallen (Fehlerklasse 1), beide hier gelöst ──────────
//  1. **Umsehen ist kein zweiter Kamerabesitzer.** `apply()` dreht die fertige Rig-Kamera
//     STARR um den Avatar: Position UND Orientierung mit demselben Quaternion. Bei Versatz 0
//     kommt bitgenau die Rig-Pose heraus, und weil die Drehung starr ist, bleibt der Avatar
//     an derselben Bildstelle stehen, während sich die Welt um ihn dreht — genau das, was man
//     von einem Umsehen erwartet. Nach dem Loslassen läuft der Versatz von selbst zurück.
//  2. **Maus-Lenken kollidiert mit A/D.** Solange gezogen wird, GEHÖRT die Lenkung der Maus
//     (analog, mit Betrag); der Runner fragt `steerActive` und ignoriert dann A/D.
//     Eigentümerwechsel, keine Addition.
//
// Nur `pointerType` **mouse/pen**: Ein-Finger-Ziehen auf einem TOUCHSCREEN würde sonst mit dem
// Pinch-Zoom des Runners um dieselben Ereignisse streiten. Auf dem Touchpad ist das Ziehen mit
// einem oder zwei Fingern eine Maus, also greift es dort wie gewünscht.
// ============================================================================

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function createPointerLook(opts = {}) {
  const THREE = opts.THREE;
  const el = opts.el;
  const P = Object.assign({
    mode: 'look',        // was Links-Ziehen tut: 'look' (Standard, Georg) oder 'steer'
    lookSpeed: 0.0052,   // rad je Pixel
    steerSpeed: 0.0075,  // turnRate je Pixel Ausschlag
    steerMax: 1.7,       // etwas über TURN_SPEED 1.2 — die Maus darf entschlossener sein
    returnTime: 1.5,     // Rückstellung nach dem Loslassen (Sekunden bis ~95 %) — Georg: gemütlich
    pitchMax: 1.45,      // ±83°: „frei, auch Untersicht"
    invertY: false,
  }, opts.params || {});

  let yaw = 0, pitch = 0;
  let ziehend = false, aktion = null, pid = null;
  let ax = 0, ay = 0, steer = 0;
  let letzteTaste = 0;   // für die Anzeige im Panel

  const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
  const _dir = new THREE.Vector3(), _right = new THREE.Vector3(), _off = new THREE.Vector3();

  const aktionVon = (e) => {
    const andere = e.altKey;
    if (P.mode === 'look') return andere ? 'steer' : 'look';
    return andere ? 'look' : 'steer';
  };

  function onDown(e) {
    if (e.pointerType === 'touch') return;
    if (e.button !== 0 && e.button !== 2) return;
    ziehend = true; pid = e.pointerId;
    aktion = aktionVon(e);
    ax = e.clientX; ay = e.clientY; steer = 0;
    letzteTaste = e.button;
    try { el.setPointerCapture(pid); } catch (err) {}
    e.preventDefault();
  }
  function onMove(e) {
    if (!ziehend || e.pointerId !== pid) return;
    const neu = aktionVon(e);
    if (neu !== aktion) { aktion = neu; ax = e.clientX; ay = e.clientY; steer = 0; }
    if (aktion === 'look') {
      const dx = e.clientX - ax, dy = e.clientY - ay;
      ax = e.clientX; ay = e.clientY;
      yaw -= dx * P.lookSpeed;
      pitch = clamp(pitch + (P.invertY ? dy : -dy) * P.lookSpeed, -P.pitchMax, P.pitchMax);
    } else {
      // Analog wie ein Stick: der ABSTAND zum Anfasspunkt ist der Ausschlag, nicht die
      // Bewegung je Bild. Sonst wäre Lenken ein Zählwerk und kein Ausschlag.
      steer = clamp(-(e.clientX - ax) * P.steerSpeed, -P.steerMax, P.steerMax);
    }
  }
  function onUp(e) {
    if (pid != null && e.pointerId !== pid) return;
    ziehend = false; aktion = null; steer = 0; pid = null;
  }
  const onCtx = (e) => { e.preventDefault(); };

  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  addEventListener('pointerup', onUp);
  addEventListener('pointercancel', onUp);
  el.addEventListener('contextmenu', onCtx);
  // Verliert das Fenster den Fokus mitten im Ziehen, kommt kein pointerup — dieselbe Naht,
  // an der in v2 „W bleibt für immer gedrückt" hing.
  addEventListener('blur', () => { ziehend = false; aktion = null; steer = 0; pid = null; });

  function update(dt) {
    if (!(ziehend && aktion === 'look')) {
      // 3/returnTime ⇒ nach `returnTime` sind ~95 % zurückgelaufen.
      const k = 1 - Math.exp(-dt * 3 / Math.max(0.05, P.returnTime));
      yaw += (0 - yaw) * k;
      pitch += (0 - pitch) * k;
      if (Math.abs(yaw) < 1e-4) yaw = 0;
      if (Math.abs(pitch) < 1e-4) pitch = 0;
    }
  }

  /** Starre Drehung der fertigen Kamera um `pivot`. `up` = Flächennormale am Avatar. */
  function apply(camera, pivot, up) {
    if (!yaw && !pitch) return false;
    _q.setFromAxisAngle(up, yaw);
    camera.getWorldDirection(_dir).applyQuaternion(_q).normalize();
    _right.crossVectors(_dir, up).normalize();
    _q2.setFromAxisAngle(_right, pitch);
    _q.premultiply(_q2);
    _off.copy(camera.position).sub(pivot).applyQuaternion(_q);
    camera.position.copy(pivot).add(_off);
    camera.quaternion.premultiply(_q);
    camera.up.applyQuaternion(_q);
    return true;
  }

  return {
    name: 'pointer-look', params: P, update, apply,
    get mode() { return P.mode; },
    setMode(m) { P.mode = m === 'steer' ? 'steer' : 'look'; },
    get steerActive() { return ziehend && aktion === 'steer'; },
    get steer() { return steer; },
    get looking() { return ziehend && aktion === 'look'; },
    get offset() { return { yaw, pitch }; },
    /** Betrag des Versatzes in Grad — die Zahl, die das Panel zeigt. */
    get offsetGrad() {
      return { yaw: +(yaw * 180 / Math.PI).toFixed(0), pitch: +(pitch * 180 / Math.PI).toFixed(0) };
    },
    center() { yaw = 0; pitch = 0; },
    report() {
      return { modus: P.mode, ziehend, aktion, taste: letzteTaste,
               yaw: +(yaw * 180 / Math.PI).toFixed(1), pitch: +(pitch * 180 / Math.PI).toFixed(1),
               lenkung: +steer.toFixed(2) };
    },
    dispose() {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', onUp);
      removeEventListener('pointercancel', onUp);
      el.removeEventListener('contextmenu', onCtx);
    },
  };
}
