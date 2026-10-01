// ============================================================================
// lens-flare.js — v9 · Port von `client/src/game/LensFlare.ts` (zeichengleich)
// ----------------------------------------------------------------------------
// Kein Post-Processing-Pass: eine ORTHO-Szene mit acht additiven Quads, gerendert NACH dem
// Hauptbild mit `autoClear = false`. Genau die Bauform, die `post-radial.js` schon benutzt —
// deshalb passt sie hinter `post.render` und vor `lines.render`.
//
// 1:1 übernommen: die beiden Fragment-Shader (weicher Kreis, Hexagon), die acht Elemente mit
// Farbe/Größe/Offset, die Streckung `ex = sunX · (1 − 2·offset)`, das Gesamt-Alpha **0,25**, die
// Randabblendung ab 0,8 über 0,6 und die Sichtbarkeitsregel (nicht hinter der Kamera, |x|,|y| < 1,4).
//
// Zwei benannte Abweichungen, beide aus unserem Aufbau, nicht aus Geschmack:
//  1 **Die Sonnenposition ist UNSERE Lampe** (`lights.sun.position`, Richtung × 60), nicht die
//    Konstante `(10, 12, 5)` der Quelle. Der Reflex muss dort sitzen, wo unser Licht herkommt —
//    sonst zeigt das Bild eine zweite Sonne, die es nicht gibt.
//  2 **Die Tagesgewichtung liegt beim Wirt** (`Game.ts` 6290 rechnet `flareColorScale × dayW`);
//    hier steht nur `setColorScale`, damit es EINEN Schreiber gibt.
// ============================================================================

const FLARE_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const CIRCLE_FRAG = `
uniform float opacity;
uniform vec3 color;
uniform float softness;
varying vec2 vUv;
void main() {
  vec2 c = vUv - 0.5;
  float d = length(c) * 2.0;
  float a = 1.0 - smoothstep(1.0 - softness, 1.0, d);
  gl_FragColor = vec4(color, a * opacity);
}
`;

const HEX_FRAG = `
uniform float opacity;
uniform vec3 color;
varying vec2 vUv;
void main() {
  vec2 c = (vUv - 0.5) * 2.0;
  vec2 ac = abs(c);
  float hex = max(ac.x * 0.866 + ac.y * 0.5, ac.y);
  float a = 1.0 - smoothstep(0.7, 0.9, hex);
  gl_FragColor = vec4(color, a * opacity * 0.5);
}
`;

/** Die acht Elemente der Quelle, Reihenfolge und Zahlen unverändert. */
const DEFS = [
  { frag: CIRCLE_FRAG, color: [1.0, 0.95, 0.8], size: 0.45, offset: 0.0, softness: 0.8 },
  { frag: CIRCLE_FRAG, color: [1.0, 0.9, 0.6], size: 0.18, offset: 0.25, softness: 0.7 },
  { frag: HEX_FRAG, color: [0.8, 0.85, 1.0], size: 0.12, offset: 0.4 },
  { frag: CIRCLE_FRAG, color: [1.0, 0.85, 0.5], size: 0.08, offset: 0.7, softness: 0.5 },
  { frag: HEX_FRAG, color: [0.7, 0.9, 1.0], size: 0.15, offset: 0.85 },
  { frag: CIRCLE_FRAG, color: [1.0, 0.95, 0.9], size: 0.09, offset: 1.0, softness: 0.8 },
  { frag: HEX_FRAG, color: [0.9, 0.7, 0.8], size: 0.06, offset: 1.2 },
  { frag: CIRCLE_FRAG, color: [0.6, 0.8, 1.0], size: 0.1, offset: 1.4, softness: 0.6 },
];

export function createLensFlare({ THREE, sonne = null, params = {} }) {
  const P = Object.assign({ on: true, gain: 1 }, params);
  const orthoScene = new THREE.Scene();
  const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geo = new THREE.PlaneGeometry(1, 1);
  const sunPos = new THREE.Vector3(10, 12, 5);      // Rückfall = die Konstante der Quelle
  const _p = new THREE.Vector3();
  const elemente = [];

  for (const d of DEFS) {
    const uniforms = { opacity: { value: 0 }, color: { value: d.color.slice() } };
    if (d.softness != null) uniforms.softness = { value: d.softness };
    const mat = new THREE.ShaderMaterial({
      vertexShader: FLARE_VERT, fragmentShader: d.frag, uniforms,
      transparent: true, depthTest: false, depthWrite: false,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.visible = false;
    mesh.frustumCulled = false;
    orthoScene.add(mesh);
    elemente.push({ mesh, mat, offset: d.offset, size: d.size, basis: d.color.slice() });
  }

  let letzteDeckung = 0, letzterOrt = [0, 0], sichtbarZahl = 0;

  return {
    name: 'lens-flare', params: P, elemente,
    /** Farbskala je Element (Quelle: `setColorScale`). Der Wirt multipliziert das Tagesgewicht ein. */
    setColorScale(scale) {
      const s = scale || [1, 1, 1];
      for (const el of elemente) {
        const c = el.mat.uniforms.color.value;
        c[0] = el.basis[0] * s[0]; c[1] = el.basis[1] * s[1]; c[2] = el.basis[2] * s[2];
      }
    },
    setOn(on) { P.on = !!on; if (!P.on) for (const el of elemente) el.mesh.visible = false; return P.on; },
    setGain(v) { P.gain = Math.max(0, Math.min(3, v)); return P.gain; },
    update(camera) {
      if (!P.on) { letzteDeckung = 0; sichtbarZahl = 0; return; }
      _p.copy(sonne && sonne.position ? sonne.position : sunPos).project(camera);
      const aspect = camera.aspect || 1;
      const hinter = _p.z > 1;
      const imBild = Math.abs(_p.x) < 1.4 && Math.abs(_p.y) < 1.4;
      const randAbstand = Math.max(Math.abs(_p.x), Math.abs(_p.y));
      const randFade = 1 - Math.max(0, (randAbstand - 0.8) / 0.6);
      const deckung = (!hinter && imBild) ? Math.max(0, randFade) * 0.25 * P.gain : 0;
      letzteDeckung = deckung; letzterOrt = [+_p.x.toFixed(2), +_p.y.toFixed(2)];
      sichtbarZahl = 0;
      for (const el of elemente) {
        if (deckung <= 0) { el.mesh.visible = false; continue; }
        const t = el.offset;
        el.mesh.position.set(_p.x * (1 - t * 2), _p.y * (1 - t * 2), 0);
        el.mesh.scale.set(el.size / aspect, el.size, 1);
        el.mesh.visible = true;
        el.mat.uniforms.opacity.value = deckung;
        sichtbarZahl++;
      }
    },
    /** Nach dem Hauptbild, ohne zu löschen — wie in der Quelle. */
    render(renderer) {
      if (!P.on || sichtbarZahl === 0) return;
      renderer.autoClear = false;
      renderer.render(orthoScene, orthoCam);
      renderer.autoClear = true;
    },
    /** ⚠ Liest die LAUFENDEN Uniformen, nicht die Tabelle oben. */
    tor() {
      const additiv = elemente.filter((e) => e.mat.blending === THREE.AdditiveBlending).length;
      const kreise = elemente.filter((e) => e.mat.uniforms.softness != null).length;
      const ok = elemente.length === 8 && additiv === 8 && kreise === 5;
      return { ok, deckung: +letzteDeckung.toFixed(3), sichtbar: sichtbarZahl, ort: letzterOrt,
        text: (ok ? '✓' : '✗') + ' ' + elemente.length + ' elements (' + kreise + ' circles / '
          + (elemente.length - kreise) + ' hexes), all additive · sun at screen ('
          + letzterOrt[0] + ', ' + letzterOrt[1] + ') → opacity '
          + letzteDeckung.toFixed(3) + ' of the source cap 0.25'
          + (letzteDeckung === 0 ? ' (sun off screen or behind the camera)' : '')
          + ' · ' + sichtbarZahl + ' drawn' };
    },
    dispose() { geo.dispose(); for (const el of elemente) el.mat.dispose(); },
  };
}
