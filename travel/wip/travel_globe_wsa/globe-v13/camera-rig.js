// ============================================================================
// camera-rig.js — Verfolgerkamera, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/CameraRig.ts (gelesen 27.8.2026).
// Alle Konstanten unverändert. Weggelassen: der Void-Plane-Zweig (den gibt es in KFB nicht).
//
// **Was ich vorher selbst gebaut hatte und was hier anders ist — der Reihe nach:**
//   · `camera.up` ist die NORMIERTE KAMERAPOSITION, nicht die Tangentialnormale des Fahrzeugs.
//     Das klingt nach einer Nuance und ist der Grund, warum die Kamera im Original nicht kippt.
//   · `closeDamp` dämpft Positions- UND Blickglättung mit der Verfolgerdistanz, und der Blick
//     wird zusätzlich mit 0,78 gebremst: „so look-at does not outrun position (reduces dizzy
//     spins)". Genau dieses Überholen war mein Schwindelgefühl.
//   · FOV atmet mit dem Tempo (60 + 20·Zoom), Distanz und Höhe ebenso.
//   · Eine Rollneigung von maximal 0,06 rad — winzig, aber sie macht die Kurve.
//   · `snapTo` beim Start, damit das erste Bild nicht aus dem Nichts heranfliegt.
// ============================================================================

import { cartesianFromSpherical, tangentFrame } from './spherical-math.js';

/* Slice D · v5 · Parameter der Verfolgerkamera.
 *
 * Alle Standardwerte sind die von `CameraRig.ts` — `RIG_QUELLE` ist eingefroren, und
 * `abweichungen()` sagt, wie viele davon nicht mehr die Quelle sind.
 *
 * ⚠ **Sieben Zahlen standen NICHT im Konstantenblock, sondern mitten in der Rechnung** — und es
 * sind ausgerechnet die, die der Modulkopf als das Heilmittel gegen Schwindel benennt: der
 * Bezugsabstand der Dämpfung (`dist / 0.95`), ihre Untergrenze (`0.36`), die **Blickbremse
 * `0.78`** („so look-at does not outrun position"), der Blick-Vorlauf (`forward, 0.5`), der
 * Sockel der Neigungsdämpfung (`0.45 + 0.55·`), das FOV-Atmen (`20`) und die Amplitude des
 * alten Rausch-Shakes (`0.06`). Der Kopf erklärt die Blickbremse in drei Zeilen — und die Zahl
 * selbst war der einzige Wert des Moduls, den man nicht finden konnte, ohne die Rechnung zu lesen.
 */
export const RIG_QUELLE = Object.freeze({
  dist: 1.2,
  distBoost: 0.6,
  height: 0.7,
  heightBoost: 0.15,
  minChase: 0.42,
  posSmooth: 10.0,
  lookSmooth: 9.0,
  lookBrake: 0.78,      // war ein nacktes Literal — und laut Modulkopf das Mittel gegen Schwindel
  lookAhead: 0.5,       // war ein nacktes Literal: wie weit vor dem Fahrzeug der Blick liegt
  dampRef: 0.95,        // war ein nacktes Literal: Bezugsabstand von `closeDamp`
  dampMin: 0.36,        // war ein nacktes Literal: Untergrenze von `closeDamp`
  maxTilt: 0.06,
  tiltSmooth: 5.0,
  tiltFloor: 0.45,      // war ein nacktes Literal: Sockel der Neigungsdämpfung
  zoomSmooth: 3.0,
  baseFov: 60,
  fovBoost: 20,         // war ein Standardargument: das FOV-Atmen mit dem Tempo
  altShakeAmp: 0.06,    // war ein nacktes Literal: Amplitude des ALTEN Rausch-Shakes (Slice B abgelöst)
});

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createCameraRig(THREE, aspect, opts) {
  /** Standard = Quelle, also ändert Slice D nichts. */
  const P = Object.assign({}, RIG_QUELLE, (opts && opts.params) || {});
  const camera = new THREE.PerspectiveCamera(P.baseFov, aspect, 0.01, 200);
  camera.position.set(0, 10, 0);

  const targetPos = new THREE.Vector3(), targetLookAt = new THREE.Vector3();
  const currentPos = new THREE.Vector3(0, 10, 0), currentLookAt = new THREE.Vector3();
  let shakeIntensity = 0, shakeDuration = 0, shakeTimer = 0;
  let trauma = 0, traumaTime = 0, currentTilt = 0, currentZoom = 0;
  // Slice B: der Leser des EINEN Trauma-Eigentümers. `null` = altes Verhalten (Rausch-Shake).
  let traumaSrc = null;

  function update(dt, qPosition, heading, altitude, globeRadius, turnRate, speedRatio,
                  tiltScale, followDist, followHeight, speedZoom, fovBoost) {
    turnRate = turnRate || 0; speedRatio = speedRatio || 0;
    tiltScale = tiltScale != null ? tiltScale : 1;
    followDist = followDist != null ? followDist : P.dist;
    followHeight = followHeight != null ? followHeight : P.height;
    speedZoom = speedZoom != null ? speedZoom : 1;
    fovBoost = fovBoost != null ? fovBoost : P.fovBoost;

    const frame = tangentFrame(qPosition);
    const planeWorldPos = cartesianFromSpherical(qPosition, altitude, globeRadius);

    currentZoom += (speedRatio - currentZoom) * Math.min(1, P.zoomSmooth * dt);
    let dist = followDist + P.distBoost * currentZoom * speedZoom;
    dist = Math.max(P.minChase, dist);
    const height = followHeight + P.heightBoost * currentZoom * speedZoom;

    const targetFov = P.baseFov + fovBoost * currentZoom;
    // ⚠ Der Sollwert wird HIER nur berechnet und unten EINMAL geschrieben — zusammen mit dem
    // Trauma-Anteil. Vorher stand hier ein eigener Schreiber auf `camera.fov`; ein zweiter
    // (Trauma) hätte ihn jedes Bild überschrieben. Ein Wert, ein Schreiber.

    const forward = new THREE.Vector3()
      .addScaledVector(frame.north, Math.cos(heading))
      .addScaledVector(frame.east, Math.sin(heading)).normalize();

    targetPos.copy(planeWorldPos).addScaledVector(forward, -dist).addScaledVector(frame.up, height);
    targetLookAt.copy(planeWorldPos).addScaledVector(forward, P.lookAhead);

    const closeDamp = clamp(dist / P.dampRef, P.dampMin, 1.0);
    const posFactor = 1 - Math.exp(-P.posSmooth * closeDamp * dt);
    const lookFactor = 1 - Math.exp(-P.lookSmooth * closeDamp * P.lookBrake * dt);
    currentPos.lerp(targetPos, posFactor);
    currentLookAt.lerp(targetLookAt, lookFactor);
    camera.position.copy(currentPos);

    if (shakeTimer < shakeDuration) {
      shakeTimer += dt;
      const decay = 1 - shakeTimer / shakeDuration;
      const amp = shakeIntensity * decay * decay;
      camera.position.x += (Math.random() - 0.5) * 2 * amp;
      camera.position.y += (Math.random() - 0.5) * 2 * amp;
      camera.position.z += (Math.random() - 0.5) * 2 * amp;
    }
    if (trauma > 0.001) {
      traumaTime += dt;
      const amp = trauma * trauma * P.altShakeAmp, t = traumaTime;
      camera.position.x += Math.sin(t * 23.1 + 1.7) * amp;
      camera.position.y += Math.sin(t * 17.3 + 4.2) * amp;
      camera.position.z += Math.cos(t * 19.7 + 2.9) * amp;
    }

    // ── Slice B (30.8.) · Wucht wird GELESEN, nicht besessen ──────────────────────────
    // `trauma.js` ist der EINE Eigentümer (D-08 §14.1). Dieses Modul addiert nur — und zwar auf
    // alle drei Kanäle, nicht nur auf die Position. Der Rollkanal trägt bei kleinen Amplituden
    // die meiste wahrgenommene Wucht: eine Translation von 0,8 % der Bildbreite sieht man kaum,
    // eine Rotation von 0,8° bewegt das ganze Bild.
    // ⚠ **Korrektur zu D-08 §11.2:** dort steht „P.baseFov ist eine Konstante und wird nie
    // angefasst" — **falsch.** Das FOV ATMET mit dem Tempo (`P.baseFov + fovBoost·currentZoom`,
    // Standard 60 + 20·Zoom), und der Modulkopf sagt es in Zeile 13. Der Trauma-Stoß wird
    // deshalb ADDIERT, nicht gesetzt — sonst hätte er die Tempo-Atmung jedes Bild plattgemacht.
    // (Fünfte Selbstkorrektur an D-08, dieselbe Klasse wie PM-52: geurteilt statt gelesen.)
    // ⚠ Position VOR `lookAt` (sonst rechnet `lookAt` sie nicht mit), Roll NACH `lookAt` (sonst
    // rechnet `lookAt` ihn wieder heraus).
    let trRoll = 0, trFov = 0;
    if (traumaSrc) {
      const w = traumaSrc.read();
      if (w.wert > 0.0005) { camera.position.add(w.pos); trRoll = w.roll; trFov = w.fov; }
    }
    const fovSoll = targetFov + trFov;
    if (Math.abs(camera.fov - fovSoll) > 0.01) { camera.fov = fovSoll; camera.updateProjectionMatrix(); }

    camera.up.copy(currentPos.clone().normalize());
    camera.lookAt(currentLookAt);

    const tiltDamp = clamp(P.tiltFloor + (1 - P.tiltFloor) * closeDamp, 0, 1);
    const targetTilt = -turnRate * P.maxTilt * tiltScale * tiltDamp;
    currentTilt += (targetTilt - currentTilt) * Math.min(1, P.tiltSmooth * dt);
    // Kurven-Neigung und Trauma-Roll ADDIEREN sich: die Kurve hat ihr Budget (P.maxTilt 3,44°),
    // das Trauma sein eigenes (`trauma.ampRoll`). Zwei Kanäle auf derselben Achse, aber mit
    // getrennten Grenzen — sonst müsste einer dem anderen etwas wegnehmen.
    const rollGesamt = currentTilt + trRoll;
    if (Math.abs(rollGesamt) > 0.0001) camera.rotateZ(rollGesamt);
  }

  function snapTo(qPosition, heading, altitude, globeRadius, followDist, followHeight) {
    const frame = tangentFrame(qPosition);
    const planeWorldPos = cartesianFromSpherical(qPosition, altitude, globeRadius);
    const forward = new THREE.Vector3()
      .addScaledVector(frame.north, Math.cos(heading))
      .addScaledVector(frame.east, Math.sin(heading)).normalize();
    const dist = Math.max(P.minChase, followDist != null ? followDist : P.dist);
    currentPos.copy(planeWorldPos).addScaledVector(forward, -dist)
      .addScaledVector(frame.up, followHeight != null ? followHeight : P.height);
    currentLookAt.copy(planeWorldPos).addScaledVector(forward, P.lookAhead);
    camera.position.copy(currentPos);
    camera.up.copy(currentPos.clone().normalize());
    camera.lookAt(currentLookAt);
  }

  return {
    name: 'camera-rig', camera, update, snapTo, params: P, quelle: RIG_QUELLE,
    abweichungen() {
      const a = [];
      for (const k in RIG_QUELLE) if (P[k] !== RIG_QUELLE[k])
        a.push(k + ' ' + RIG_QUELLE[k] + '→' + P[k]);
      return a;
    },
    report() {
      const a = this.abweichungen();
      return { parameter: Object.keys(RIG_QUELLE).length, abweichungen: a.length, abweichend: a,
               fov: +camera.fov.toFixed(1), zoom: +currentZoom.toFixed(2),
               tilt: +(currentTilt * 180 / Math.PI).toFixed(2),
               traumaQuelle: !!traumaSrc };
    },
    zeile() {
      const a = this.abweichungen();
      return Object.keys(RIG_QUELLE).length + ' params · '
        + (a.length ? '⚠ ' + a.length + ' off source: ' + a.join(', ')
                    : 'all source-faithful (tinyskies CameraRig.ts)')
        + ' · fov ' + camera.fov.toFixed(1) + '° · zoom ' + currentZoom.toFixed(2)
        + ' · curve tilt ' + (currentTilt * 180 / Math.PI).toFixed(2) + '°'
        + (traumaSrc ? ' · trauma owner attached' : ' · ⚠ no trauma owner');
    },
    /** Slice B · den EINEN Trauma-Eigentümer einhängen. Danach leitet `shake()` dorthin. */
    setTraumaSource(src) { traumaSrc = src || null; },
    shake(intensity, duration) {
      // ⚠ **Weiche, kein zweiter Weg.** Alte Aufrufer (drei Stück, D-08 §2.1) sollen nicht still
      // ins Leere schlagen — also gehen sie durch denselben Integrator. Die übergebene
      // `duration` wird dabei VERWORFEN: `trauma` hat eine Abklingkonstante, kein Fenster. Wer
      // die alte Dauer braucht, braucht ein eigenes Gewicht in der Tabelle, nicht ein Fenster.
      if (traumaSrc) { traumaSrc.add(Math.min(1, (intensity != null ? intensity : 0.02) * 12)); return; }
      shakeIntensity = intensity != null ? intensity : 0.025;
      shakeDuration = duration != null ? duration : 0.25;
      shakeTimer = 0;
    },
    setTrauma(level) { trauma = clamp(level, 0, 1); },
    resize(a) { camera.aspect = a; camera.updateProjectionMatrix(); },
  };
}
