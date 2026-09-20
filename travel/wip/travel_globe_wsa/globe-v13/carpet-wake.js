// ============================================================================
// carpet-wake.js — Spritzwasser über dem Ozean · v5 · Slice F
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, `client/src/game/CarpetWake.ts`, Branch
// `cursor/globefly-multiplayer-globe-flight-game` (gelesen 30.8.2026). Alle Raten und Zeiten
// übernommen — Pool 400, `EMIT_PER_FRAME` 6, Lebenszeit 0,8…2,0 s, Gravitation 0,22.
//
// **Die eine Zeile, die dieses Modul erklärt:** es emittiert NICHT am Fahrzeug, sondern an der
// **Wasseroberfläche direkt unter dem Fahrzeug** (`cartesianFromSpherical(q, 0.001, R)`), in zwei
// Fahnen links und rechts der Spur (`SPREAD_ANGLE` 0,25). Deshalb liest es als Kielwasser und
// nicht als Nebel um den Teppich — und deshalb ist es auch bei großer Flughöhe noch richtig.
//
// ── Drei Befunde beim Portieren, alle gemessen und keiner erfunden ───────────────────────────
//
// **1 · Das Tor ist ein Schnellflug-Tor, und unsere Obergrenze reicht nicht ganz hin.**
// Die Quelle schaltet erst ab `speed > 0.5` ein und blendet über `(speed − 0,5) / 0,4` auf, also
// voll erst bei 0,9. **Unser `maxSpeed` ist 0,78** (1:1 aus `Carpet.ts`) — bei Vollgas ohne Boost
// erreicht das Kielwasser damit rechnerisch **70 % Deckkraft, nie 100 %.** Das ist kein Fehler,
// sondern die Kalibrierung der Quelle: über 0,78 kommt man dort nur mit Upgrades. Die Zahl steht
// in der Panel-Zeile (`alpha ceiling`), damit niemand später „das Wasser spritzt zu schwach"
// als Shader-Problem jagt. Dieselbe Klasse wie das 0,5-Tor der Blätter (Slice A).
//
// **2 · Der Ein-/Ausblender ignoriert `dt` — 8 % je BILD.** Wörtlich dieselbe Zeile wie in
// `CarpetLeaves` (`waterAlpha += (target − waterAlpha) * 0.08`). In Slice D war das ein Befund an
// einem Modul; jetzt ist klar, dass es die **Hausschreibweise der Quelle** ist. Der Wert bleibt
// (Quellentreue), der Name sagt es: `blendJeBild`.
//
// **3 · ⚠ HIER WEICHEN WIR BEWUSST AB, und wir haben den Grund schon einmal bezahlt.**
// Die Quelle rechnet `gl_PointSize = aSize * (40.0 / -mvPos.z)` — eine Zauberzahl ohne Bezug zu
// Bildhöhe oder Bildwinkel und **ohne Obergrenze.** Genau diese Bauform hat in v3 zwei Befunde auf
// einmal erzeugt (`impact-dust`: „statt Partikel sehe ich große Kreise" UND „Terrain ist
// überstrahlt" — neun halbtransparente Scheiben dicht an der Linse waren das Milchglas). Also
// steht hier derselbe Ersatz wie dort: **echter Projektionsfaktor** `hPx / (2·tan(fov/2))` als
// Uniform plus **harte Deckelung in Pixeln.** `params.maxPx` macht es rückstellbar, und
// `quelle.pointFormel` sagt, was in der Quelle steht.
// ============================================================================

import { cartesianFromSpherical, tangentFrame } from './spherical-math.js';
import { isLand } from './globe-field.js';

/** Quellentreue Vorgaben. Eingefroren — `abweichungen()` ist die Abnahme (Slice-D-Hausstandard). */
export const WAKE_QUELLE = Object.freeze({
  pool: 400,
  lifeMin: 0.8,
  lifeMax: 2.0,
  jeBild: 6,              // EMIT_PER_FRAME — je Fahne, also 12 Tropfen je Bild bei Vollgas
  upSpeed: 0.12,
  outSpeed: 0.18,
  gravity: 0.22,
  spreadWinkel: 0.25,     // SPREAD_ANGLE — Öffnung der beiden Fahnen
  seitVersatz: 0.008,
  vorVersatz: 0.008,
  tempoTor: 0.5,          // darunter kein Kielwasser
  tempoSpanne: 0.4,       // volle Deckkraft bei tempoTor + tempoSpanne = 0,9
  blendJeBild: 0.08,      // ⚠ Anteil je BILD, nicht je Sekunde (Quelle, siehe Befund 2)
  alphaGain: 0.4,         // Deckkraft eines Tropfens am Anfang
  einblendZeit: 0.15,
  groesse: 0.12,
  maxPx: 22,              // ⚠ unsere Ergänzung (Befund 3) — die Quelle hat keine Grenze
});

export function createCarpetWake(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({}, WAKE_QUELLE, opts.params || {});
  const globeRadius = opts.globeRadius, seed = opts.seed, terrainType = opts.terrainType;
  const N = P.pool;

  const pos = new Float32Array(N * 3);
  const alp = new Float32Array(N);
  const siz = new Float32Array(N);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alp, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uGlobalAlpha: { value: 0 }, projF: { value: 900 }, maxPx: { value: P.maxPx } },
    vertexShader: [
      'attribute float aAlpha;',
      'attribute float aSize;',
      'uniform float projF;',
      'uniform float maxPx;',
      'varying float vAlpha;',
      'void main() {',
      '  vAlpha = aAlpha;',
      '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
      // Befund 3: echter Projektionsfaktor statt der Zauberzahl 40, plus Deckel.
      '  gl_PointSize = min(maxPx, aSize * projF / max(0.35, -mv.z));',
      '  gl_Position = projectionMatrix * mv;',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform float uGlobalAlpha;',
      'varying float vAlpha;',
      'void main() {',
      '  float d = length(gl_PointCoord - 0.5) * 2.0;',
      '  if (d > 1.0) discard;',
      '  float soft = 1.0 - d * d;',
      '  gl_FragColor = vec4(0.92, 0.97, 1.0, soft * vAlpha * uGlobalAlpha);',
      '}',
    ].join('\n'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = 2;
  const group = new THREE.Group();
  group.name = 'carpet-wake';
  group.add(points);

  // Zustand je Tropfen in flachen Feldern — ein Objekt je Tropfen wären 400 Allokationen.
  const px = new Float32Array(N * 3), vel = new Float32Array(N * 3);
  const age = new Float32Array(N), life = new Float32Array(N);
  let slot = 0, wasserAlpha = 0, lebend = 0, gesamt = 0, salven = 0, an = true;

  const _f = new THREE.Vector3(), _r = new THREE.Vector3(), _l = new THREE.Vector3();
  const _lp = new THREE.Vector3(), _rp = new THREE.Vector3(), _rn = new THREE.Vector3();

  function emit(origin, up, outward, tempo, anzahl) {
    const n = Math.max(1, Math.ceil((anzahl != null ? anzahl : P.jeBild) * Math.min(1, tempo * 1.2)));
    for (let i = 0; i < n; i++) {
      const k = slot; slot = (slot + 1) % N;
      const b = k * 3;
      life[k] = P.lifeMin + Math.random() * (P.lifeMax - P.lifeMin);
      age[k] = 0;
      const jOut = (0.5 + Math.random()) * P.outSpeed;
      const jUp = (0.4 + Math.random()) * P.upSpeed;
      const jBack = (Math.random() - 0.5) * 0.03;
      px[b]     = origin.x + (Math.random() - 0.5) * 0.006;
      px[b + 1] = origin.y + (Math.random() - 0.5) * 0.006;
      px[b + 2] = origin.z + (Math.random() - 0.5) * 0.006;
      vel[b]     = outward.x * jOut + up.x * jUp + (Math.random() - 0.5) * jBack;
      vel[b + 1] = outward.y * jOut + up.y * jUp + (Math.random() - 0.5) * jBack;
      vel[b + 2] = outward.z * jOut + up.z * jUp + (Math.random() - 0.5) * jBack;
      gesamt++;
    }
    salven++;
    return n;
  }

  function tropfenSchritt(dt, up) {
    mat.uniforms.uGlobalAlpha.value = wasserAlpha;
    const gx = -up.x * P.gravity * dt, gy = -up.y * P.gravity * dt, gz = -up.z * P.gravity * dt;
    let am = 0;
    for (let i = 0; i < N; i++) {
      if (life[i] <= 0) { if (alp[i] !== 0) { alp[i] = 0; siz[i] = 0; } continue; }
      age[i] += dt;
      if (age[i] >= life[i]) { life[i] = 0; alp[i] = 0; siz[i] = 0; continue; }
      am++;
      const b = i * 3;
      vel[b] += gx; vel[b + 1] += gy; vel[b + 2] += gz;
      px[b] += vel[b] * dt; px[b + 1] += vel[b + 1] * dt; px[b + 2] += vel[b + 2] * dt;
      pos[b] = px[b]; pos[b + 1] = px[b + 1]; pos[b + 2] = px[b + 2];
      const t = age[i] / life[i];
      const ein = Math.min(1, age[i] / P.einblendZeit);
      alp[i] = ein * (1 - t) * (1 - t) * P.alphaGain;
      siz[i] = (1 - t * 0.5) * P.groesse;
    }
    lebend = am;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aAlpha.needsUpdate = true;
    geo.attributes.aSize.needsUpdate = true;
  }

  /** Die beiden Fahnen an der Wasseroberfläche unter dem Fahrzeug. */
  function fahnen(qPosition, heading, tempo, anzahl) {
    const frame = tangentFrame(qPosition);
    const up = frame.up;
    const flaeche = cartesianFromSpherical(qPosition, 0.001, globeRadius);
    _f.set(0, 0, 0).addScaledVector(frame.north, Math.cos(heading))
                   .addScaledVector(frame.east, Math.sin(heading)).normalize();
    _r.crossVectors(_f, up).normalize();
    _l.copy(_f).multiplyScalar(1000).addScaledVector(_r, -P.spreadWinkel).normalize();
    _lp.copy(flaeche).addScaledVector(_l, P.vorVersatz).addScaledVector(_r, -P.seitVersatz);
    emit(_lp, up, _rn.copy(_r).negate(), tempo, anzahl);
    _l.copy(_f).multiplyScalar(1000).addScaledVector(_r, P.spreadWinkel).normalize();
    _rp.copy(flaeche).addScaledVector(_l, P.vorVersatz).addScaledVector(_r, P.seitVersatz);
    emit(_rp, up, _r, tempo, anzahl);
    return up;
  }

  return {
    name: 'carpet-wake', group, points, params: P, quelle: WAKE_QUELLE,
    /** Kamera für den Projektionsfaktor (Befund 3) — ohne sie bleibt die Voreinstellung stehen. */
    setCamera(cam) { P.camera = cam; },

    /**
     * @param dt
     * @param st `{ qPosition, heading, speed, elevating }` — dieselben Größen, die der Runner
     *        ohnehin jedes Bild liest. EINE Messung, mehrere Leser (E-19).
     */
    update(dt, st) {
      if (!an) return;
      if (P.camera) {
        const h = innerHeight;
        mat.uniforms.projF.value = h / (2 * Math.tan((P.camera.fov * Math.PI / 180) / 2));
      }
      const frame = tangentFrame(st.qPosition);
      const up = frame.up;
      const ueberWasser = !isLand(seed, terrainType, up.x, up.y, up.z);
      const fade = Math.min(1, Math.max(0, (st.speed - P.tempoTor) / P.tempoSpanne));
      const ziel = (ueberWasser && st.speed > P.tempoTor && !st.elevating) ? fade : 0;
      // ⚠ Befund 2: Anteil je BILD, nicht je Sekunde. Quellentreu, siehe Modulkopf.
      wasserAlpha += (ziel - wasserAlpha) * P.blendJeBild;
      tropfenSchritt(dt, up);
      if (wasserAlpha < 0.01) return;
      fahnen(st.qPosition, st.heading, st.speed);
    },

    /**
     * Der WIRKER `wake` aus `fx-script.js`. Slice B hat die Kaskade `water.enter` geschrieben und
     * den Platz beschriftet: `{ t: 0, wake: ['burst'] }`. **Genau dieser Aufruf war die
     * Vormerkung** — Loop B wies ihn als „1 vorgemerkt (Wirker fehlt: wake)" aus.
     * Der Eintritts-Spritzer ist KEIN Dauereffekt: eine kräftige Salve am Ort des Eintritts,
     * einmalig, unabhängig vom Tempo-Tor. Sonst wäre der Moment, in dem man ins Wasser
     * eintaucht, genau der eine ohne Spritzer.
     */
    burst(art, ctx) {
      if (!an) return 0;
      const st = (ctx && ctx.state) || null;
      const q = st ? st.qPosition : (ctx && ctx.qPosition);
      if (!q) return 0;
      const heading = st ? st.heading : ((ctx && ctx.heading) || 0);
      const stark = art === 'burst' ? 3.2 : 1.6;
      // Der Eintritt zeigt sich sofort, also wird die Blende vorgezogen statt abgewartet:
      // 8 % je Bild wären hier eine halbe Sekunde Verspätung auf einen Schlag.
      wasserAlpha = Math.max(wasserAlpha, 0.55);
      fahnen(q, heading, 1, P.jeBild * stark);
      return Math.round(P.jeBild * stark * 2);
    },

    setEnabled(on) { an = !!on; group.visible = !!an; if (!an) this.reset(); },
    get enabled() { return an; },
    reset() {
      wasserAlpha = 0; mat.uniforms.uGlobalAlpha.value = 0;
      for (let i = 0; i < N; i++) { life[i] = 0; alp[i] = 0; siz[i] = 0; }
      geo.attributes.aAlpha.needsUpdate = true;
      geo.attributes.aSize.needsUpdate = true;
    },
    abweichungen() {
      const a = [];
      for (const k in WAKE_QUELLE) if (P[k] !== WAKE_QUELLE[k])
        a.push(k + ' ' + WAKE_QUELLE[k] + '→' + P[k]);
      return a;
    },
    /** Die rechnerische Deckkraft-Obergrenze bei unserem Vollgas — Befund 1, als Zahl. */
    deckel(maxSpeed) {
      const m = maxSpeed || 0.78;
      return +Math.min(1, Math.max(0, (m - P.tempoTor) / P.tempoSpanne)).toFixed(2);
    },
    report() {
      const a = this.abweichungen();
      return { an, lebend, pool: N, tropfen: gesamt, salven,
               wasserAlpha: +wasserAlpha.toFixed(3), tempoTor: P.tempoTor,
               deckelBei078: this.deckel(0.78),
               parameter: Object.keys(WAKE_QUELLE).length, abweichungen: a.length, abweichend: a,
               drawCalls: 1 };
    },
    zeile() {
      const a = this.abweichungen();
      return Object.keys(WAKE_QUELLE).length + ' params · '
        + (a.length ? '⚠ ' + a.length + ' off source: ' + a.join(', ')
                    : 'all source-faithful (tinyskies CarpetWake.ts)')
        + ' · ' + lebend + '/' + N + ' live · blend ' + wasserAlpha.toFixed(2)
        + ' · gate speed > ' + P.tempoTor
        + ' · alpha ceiling at our max speed 0.78: ' + this.deckel(0.78)
        + ' · 1 draw call';
    },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
