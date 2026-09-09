// ============================================================================
// carpet-trail.js — Zwei goldene Bänder hinter dem Teppich, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/CarpetTrail.ts (gelesen 27.8.2026).
// TRAIL_LENGTH 35, WIDTH 0.004, additive Mischung, Deckkraft am Tempo.
//
// **Der Kniff steckt in `_cross`:** die Bandbreite wird pro Punkt aus Fahrtrichtung × Blick zur
// Kamera gebildet — das Band steht damit immer zur Kamera und bleibt sichtbar, egal wie man um die
// Kugel fliegt. Ohne diese Zeile verschwindet ein Band, sobald man von der Seite schaut.
// ============================================================================

/* Slice D · v5 · Parameter der Bänder. Standard = Quelle (`CarpetTrail.ts`).
 *
 * ⚠ Fünf der acht Zahlen standen NICHT oben, sondern in der Punktschleife: der Einblendweg
 * (`i / 8`), die Alpha-Verstärkung (`* 1.35`), die Tempo-Verstärkung (`speedRatio * 1.5`) und
 * die beiden Seitenversätze. Und die FARBE stand als Literal im Shader — für Slice H
 * (Weltstimmungen) ist genau sie der Wert, den man braucht. */
export const TRAIL_QUELLE = Object.freeze({
  length: 35,
  width: 0.004,
  fadeInPunkte: 8,      // war `i / 8`
  alphaGain: 1.35,      // war `* 1.35`
  speedAlphaGain: 1.5,  // war `speedRatio * 1.5`
  offX: 0.026, offY: -0.015, offZ: 0.01,
  tint: [0.95, 0.82, 0.3],   // war ein Literal IM SHADER
});

export function createCarpetTrail(THREE, opts) {
  const P = Object.assign({}, TRAIL_QUELLE, (opts && opts.params) || {});
  const TRAIL_LENGTH = P.length, WIDTH = P.width;

  const vert = `
attribute float alpha;
varying float vAlpha;
void main() {
  vAlpha = alpha;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

  const frag = `
uniform float uSpeedAlpha;
uniform vec3 uTint;
varying float vAlpha;
void main() {
  vec3 color = uTint * vAlpha * uSpeedAlpha;
  gl_FragColor = vec4(color, 1.0);
}`;

  const _dir = new THREE.Vector3(), _toCamera = new THREE.Vector3();
  const _cross = new THREE.Vector3(), _fallback = new THREE.Vector3(0, 1, 0);

  function makeRibbon() {
    const vertCount = TRAIL_LENGTH * 2;
    const posAttr = new THREE.BufferAttribute(new Float32Array(vertCount * 3), 3);
    const alphaAttr = new THREE.BufferAttribute(new Float32Array(vertCount), 1);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('alpha', alphaAttr);
    const indices = [];
    for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    geometry.setIndex(indices);
    const material = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag,
      uniforms: { uSpeedAlpha: { value: 0 },
                  uTint: { value: new THREE.Color(P.tint[0], P.tint[1], P.tint[2]) } },
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, premultipliedAlpha: true, toneMapped: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    const points = [];
    const lastCross = new THREE.Vector3(0, 1, 0);

    function update(worldPos, cameraPos) {
      points.unshift(worldPos.clone());
      if (points.length > TRAIL_LENGTH) points.length = TRAIL_LENGTH;
      const positions = posAttr.array, alphas = alphaAttr.array;
      const count = points.length;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const p = points[i];
        if (!p) {
          for (let k = 0; k < 6; k++) positions[i * 6 + k] = 0;
          alphas[i * 2] = 0; alphas[i * 2 + 1] = 0;
          continue;
        }
        const prevIdx = Math.max(i - 1, 0), nextIdx = Math.min(i + 1, count - 1);
        _dir.subVectors(points[prevIdx], points[nextIdx]);
        if (_dir.lengthSq() < 1e-10) {
          _cross.copy(lastCross);
        } else {
          _dir.normalize();
          _toCamera.subVectors(cameraPos, p).normalize();
          _cross.crossVectors(_dir, _toCamera);
          if (_cross.lengthSq() < 1e-10) _cross.crossVectors(_dir, _fallback);
          _cross.normalize();
          lastCross.copy(_cross);
        }
        const fadeIn = Math.min(1, i / P.fadeInPunkte), fadeOut = 1 - i / TRAIL_LENGTH;
        const w = WIDTH * fadeOut;
        positions[i * 6]     = p.x + _cross.x * w;
        positions[i * 6 + 1] = p.y + _cross.y * w;
        positions[i * 6 + 2] = p.z + _cross.z * w;
        positions[i * 6 + 3] = p.x - _cross.x * w;
        positions[i * 6 + 4] = p.y - _cross.y * w;
        positions[i * 6 + 5] = p.z - _cross.z * w;
        const a = fadeIn * fadeOut * fadeOut * P.alphaGain;
        alphas[i * 2] = a; alphas[i * 2 + 1] = a;
      }
      posAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
    }
    function reset() {
      points.length = 0; lastCross.set(0, 1, 0);
      posAttr.array.fill(0); alphaAttr.array.fill(0);
      posAttr.needsUpdate = true; alphaAttr.needsUpdate = true;
    }
    return { mesh, material, update, reset,
             dispose() { geometry.dispose(); material.dispose(); } };
  }

  const group = new THREE.Group();
  group.name = 'carpet-trail';
  const left = makeRibbon(), right = makeRibbon();
  group.add(left.mesh); group.add(right.mesh);
  const leftOffset = new THREE.Vector3(-P.offX, P.offY, P.offZ);
  const rightOffset = new THREE.Vector3(P.offX, P.offY, P.offZ);

  return {
    name: 'carpet-trail', group, params: P, quelle: TRAIL_QUELLE,
    /** Farbe zur Laufzeit — der Eingang, den Slice H (Weltstimmungen) braucht. */
    setTint(r, g, b) {
      P.tint = [r, g, b];
      left.material.uniforms.uTint.value.setRGB(r, g, b);
      right.material.uniforms.uTint.value.setRGB(r, g, b);
    },
    abweichungen() {
      const a = [];
      for (const k in TRAIL_QUELLE) {
        const q = TRAIL_QUELLE[k], v = P[k];
        const gleich = Array.isArray(q) ? String(q) === String(v) : q === v;
        if (!gleich) a.push(k + ' ' + q + '→' + v);
      }
      return a;
    },
    report() {
      const a = this.abweichungen();
      return { parameter: Object.keys(TRAIL_QUELLE).length, abweichungen: a.length, abweichend: a,
               laenge: TRAIL_QUELLE.length, breite: P.width,
               deckkraft: +left.material.uniforms.uSpeedAlpha.value.toFixed(3),
               drawCalls: 2 };
    },
    zeile() {
      const a = this.abweichungen();
      const al = left.material.uniforms.uSpeedAlpha.value;
      return Object.keys(TRAIL_QUELLE).length + ' params · '
        + (a.length ? '⚠ ' + a.length + ' off source: ' + a.join(', ')
                    : 'all source-faithful (tinyskies CarpetTrail.ts)')
        + ' · ' + P.length + ' points · alpha ' + al.toFixed(2)
        + (al < 0.01 ? '  ·  ⚠ invisible at this speed' : '') + ' · 2 draw calls';
    },
    update(carpetMatrix, camera, speedRatio) {
      const alpha = Math.max(0, Math.min(1, speedRatio * P.speedAlphaGain));
      left.material.uniforms.uSpeedAlpha.value = alpha;
      right.material.uniforms.uSpeedAlpha.value = alpha;
      const camPos = camera.getWorldPosition(new THREE.Vector3());
      left.update(leftOffset.clone().applyMatrix4(carpetMatrix), camPos);
      right.update(rightOffset.clone().applyMatrix4(carpetMatrix), camPos);
    },
    reset() { left.reset(); right.reset(); },
    dispose() { left.dispose(); right.dispose(); },
  };
}
