// ============================================================================
// drift-smoke.js — Staubwolken an den Kanten, während der Teppich driftet · v5 · Slice F
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, `client/src/game/CarpetDriftSmoke.ts` (gelesen 30.8.2026).
// Raten und Zeiten 1:1: Pool 120, `EMIT_RATE` 28 je Sekunde, Lebenszeit 0,35…0,70 s,
// Seitenversatz 0,055, `UP_SPEED` 0,06, `OUT_SPEED` 0,12, warmer Sandton (0,88 / 0,80 / 0,64).
//
// **Der Unterschied zum Kielwasser ist der Auslöser, nicht die Optik:** dieses Modul hängt nicht
// am Tempo, sondern am **Driftwinkel** — `isDrifting && driftIntensity ≥ 0,05`. Und das ist die
// Größe, die in `carpet.js` schon gerechnet wird (`driftIntensity`, Winkel zwischen Blick- und
// Fahrtrichtung, normiert auf π/4). Also EIN Leser mehr auf einer vorhandenen Messung, keine
// zweite Rechnung (E-19).
//
// ⚠ **Die Emissionsrate ist hier ZEITBASIERT (28/s mit Akkumulator), nicht bildbasiert.**
// Das ist bemerkenswert, weil zwei Nachbarmodule derselben Quelle es anders machen
// (`CarpetLeaves` und `CarpetWake` zählen je BILD). Wer hier eine Rate ändert, ändert eine Rate;
// dort ändert man eine Rate PLUS die Bildfrequenzabhängigkeit. Der Akkumulator ist der Grund,
// warum dieses Modul bei 30 und 60 fps gleich aussieht — und die anderen zwei nicht.
//
// ⚠ **Punktgröße:** dieselbe Abweichung wie in `carpet-wake.js` und aus demselben bezahlten
// Grund. Die Quelle rechnet `aSize * (180.0 / -mvPos.z)` ohne Obergrenze; hier steht der echte
// Projektionsfaktor plus Deckel (`params.maxPx`). `quelle.pointFormel` nennt das Original.
// ============================================================================

import { cartesianFromSpherical, tangentFrame } from './spherical-math.js';

export const SMOKE_QUELLE = Object.freeze({
  pool: 120,
  lifeMin: 0.35,
  lifeMax: 0.70,
  rate: 28,               // EMIT_RATE — je SEKUNDE (siehe Modulkopf)
  seitVersatz: 0.055,
  upSpeed: 0.06,
  outSpeed: 0.12,
  streuung: 0.025,
  hoehenAnteil: 0.98,     // Ursprung bei `altitude * 0.98` — knapp unter der Kartenfläche
  driftTor: 0.05,
  alphaSockel: 0.18,
  alphaGain: 0.22,
  groesseStart: 0.06,
  groesseWuchs: 0.18,
  maxPx: 46,              // ⚠ unsere Ergänzung — die Quelle hat keine Grenze
  tint: [0.88, 0.80, 0.64],
});

export function createDriftSmoke(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({}, SMOKE_QUELLE, opts.params || {});
  const globeRadius = opts.globeRadius;
  const N = P.pool;

  const pos = new Float32Array(N * 3);
  const alp = new Float32Array(N);
  const siz = new Float32Array(N);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alp, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { projF: { value: 900 }, maxPx: { value: P.maxPx },
                tint: { value: new THREE.Color(P.tint[0], P.tint[1], P.tint[2]) } },
    vertexShader: [
      'attribute float aAlpha;',
      'attribute float aSize;',
      'uniform float projF;',
      'uniform float maxPx;',
      'varying float vAlpha;',
      'void main() {',
      '  vAlpha = aAlpha;',
      '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
      '  gl_PointSize = min(maxPx, aSize * projF / max(0.35, -mv.z));',
      '  gl_Position = projectionMatrix * mv;',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 tint;',
      'varying float vAlpha;',
      'void main() {',
      '  vec2 uv = gl_PointCoord - 0.5;',
      '  float r = dot(uv, uv) * 4.0;',
      '  float a = smoothstep(1.0, 0.0, r) * vAlpha;',
      '  if (a < 0.005) discard;',
      '  gl_FragColor = vec4(tint, a);',
      '}',
    ].join('\n'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 2;
  const group = new THREE.Group();
  group.name = 'drift-smoke';
  group.add(points);

  const px = new Float32Array(N * 3), vel = new Float32Array(N * 3);
  const age = new Float32Array(N), life = new Float32Array(N), a0 = new Float32Array(N);
  let slot = 0, akku = 0, lebend = 0, gesamt = 0, an = true;

  const _f = new THREE.Vector3(), _r = new THREE.Vector3();

  function emit(origin, up, right, seite, staerke) {
    const k = slot; slot = (slot + 1) % N;
    const b = k * 3;
    life[k] = P.lifeMin + Math.random() * (P.lifeMax - P.lifeMin);
    age[k] = 0;
    const jUp = P.upSpeed * (0.5 + Math.random());
    const jOut = P.outSpeed * (0.5 + Math.random()) * seite;
    const jBack = -Math.random() * 0.02;
    px[b]     = origin.x + right.x * P.seitVersatz * seite + (Math.random() - 0.5) * P.streuung;
    px[b + 1] = origin.y + right.y * P.seitVersatz * seite + (Math.random() - 0.5) * P.streuung;
    px[b + 2] = origin.z + right.z * P.seitVersatz * seite + (Math.random() - 0.5) * P.streuung;
    vel[b]     = up.x * jUp + right.x * jOut + up.x * jBack;
    vel[b + 1] = up.y * jUp + right.y * jOut + up.y * jBack;
    vel[b + 2] = up.z * jUp + right.z * jOut + up.z * jBack;
    a0[k] = P.alphaSockel + staerke * P.alphaGain;
    gesamt++;
  }

  return {
    name: 'drift-smoke', group, points, params: P, quelle: SMOKE_QUELLE,
    setCamera(cam) { P.camera = cam; },
    /** Farbe zur Laufzeit — für Slice H (Weltstimmungen: Sand · Asche · Schnee · Kalk). */
    setTint(r, g, b) { P.tint = [r, g, b]; mat.uniforms.tint.value.setRGB(r, g, b); },

    /**
     * @param st `{ qPosition, heading, altitude, drifting, driftIntensity }` — alle fünf liegen im
     *        Runner bereit, keine wird hier nachgerechnet.
     */
    update(dt, st) {
      if (!an) return;
      if (P.camera) {
        const h = innerHeight;
        mat.uniforms.projF.value = h / (2 * Math.tan((P.camera.fov * Math.PI / 180) / 2));
      }
      let am = 0;
      for (let i = 0; i < N; i++) {
        if (life[i] <= 0) { if (alp[i] !== 0) { alp[i] = 0; siz[i] = 0; } continue; }
        age[i] += dt;
        if (age[i] >= life[i]) { life[i] = 0; alp[i] = 0; siz[i] = 0; continue; }
        am++;
        const b = i * 3;
        px[b] += vel[b] * dt; px[b + 1] += vel[b + 1] * dt; px[b + 2] += vel[b + 2] * dt;
        pos[b] = px[b]; pos[b + 1] = px[b + 1]; pos[b + 2] = px[b + 2];
        const t = age[i] / life[i];
        alp[i] = a0[i] * (1 - t) * (1 - t);
        siz[i] = P.groesseStart + t * P.groesseWuchs;
      }
      lebend = am;
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aAlpha.needsUpdate = true;
      geo.attributes.aSize.needsUpdate = true;

      if (!st || !st.drifting || (st.driftIntensity || 0) < P.driftTor) { akku = 0; return; }
      akku += P.rate * st.driftIntensity * dt;
      const n = Math.floor(akku);
      if (n < 1) return;
      akku -= n;
      const frame = tangentFrame(st.qPosition);
      const up = frame.up;
      _f.set(0, 0, 0).addScaledVector(frame.north, Math.cos(st.heading))
                     .addScaledVector(frame.east, Math.sin(st.heading)).normalize();
      _r.crossVectors(_f, up).normalize();
      const origin = cartesianFromSpherical(st.qPosition, st.altitude * P.hoehenAnteil, globeRadius);
      for (let i = 0; i < n; i++) {
        emit(origin, up, _r, -1, st.driftIntensity);
        emit(origin, up, _r, 1, st.driftIntensity);
      }
    },

    setEnabled(on) { an = !!on; group.visible = !!an; if (!an) this.reset(); },
    get enabled() { return an; },
    reset() {
      akku = 0;
      for (let i = 0; i < N; i++) { life[i] = 0; alp[i] = 0; siz[i] = 0; }
      geo.attributes.aAlpha.needsUpdate = true;
      geo.attributes.aSize.needsUpdate = true;
    },
    abweichungen() {
      const a = [];
      for (const k in SMOKE_QUELLE) {
        const q = SMOKE_QUELLE[k], v = P[k];
        const gleich = Array.isArray(q) ? String(q) === String(v) : q === v;
        if (!gleich) a.push(k + ' ' + q + '→' + v);
      }
      return a;
    },
    report() {
      const a = this.abweichungen();
      return { an, lebend, pool: N, wolken: gesamt, rate: P.rate, driftTor: P.driftTor,
               parameter: Object.keys(SMOKE_QUELLE).length, abweichungen: a.length, abweichend: a,
               drawCalls: 1 };
    },
    zeile() {
      const a = this.abweichungen();
      return Object.keys(SMOKE_QUELLE).length + ' params · '
        + (a.length ? '⚠ ' + a.length + ' off source: ' + a.join(', ')
                    : 'all source-faithful (tinyskies CarpetDriftSmoke.ts)')
        + ' · ' + lebend + '/' + N + ' live · ' + P.rate + '/s while drifting'
        + ' · gate drift ≥ ' + P.driftTor
        + ' · time-based (unlike leaves and wake, which count per frame)'
        + ' · 1 draw call';
    },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
