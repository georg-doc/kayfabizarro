// ============================================================================
// post-radial.js — KFB Travel · Slice S2 · radialer Blur als Overlay
// ----------------------------------------------------------------------------
// Zoom-Blur zum Boost: pro Pixel N Samples auf der Linie zum Fluchtpunkt.
//
// DRITTE FASSUNG — und die erste, die die Szene nicht anfasst. Vorgeschichte, weil
// sie eine Regel trägt:
//
//  1. Szene → HalfFloat-Rendertarget → Blur → `<colorspace_fragment>`:
//     doppelte sRGB-Kodierung, Bildmittel 82,7 → 144,0. Sichtbar als Lichtschalter.
//  2. Szene → RGBA8-Target, Werte durchgeschrieben: global sauber (Δ 0,4/255),
//     ABER die Karte (MeshStandardMaterial mit `CanvasTexture`, Mips, Aniso 8)
//     rendert im Target messbar anders — gemessen −22/255 im Kartenbereich, während
//     99 % des Bildes identisch blieben. Also sah Pet + Karte dauerhaft „ausgeknipst"
//     aus. Ursache steckt in der Filterung/Programmvariante im Offscreen-Pfad; egal
//     wie man den Farbraum dreht, sie bleibt.
//  3. **Diese Fassung: kein Rendertarget.** Die Szene rendert wie ohne Post DIREKT
//     auf den Schirm — Pixel für Pixel identisch zu v5. Danach wird das fertige Bild
//     mit `copyFramebufferToTexture` in eine `FramebufferTexture` kopiert und als
//     geblurrtes **Overlay** darübergelegt, dessen ALPHA die radiale Maske ist:
//     Mitte = 0 (die Originalpixel bleiben unberührt), Rand = 1.
//
// Damit ist der Effekt konstruktiv unfähig, Pet, Karte oder Tacho zu verändern, und
// es gibt keinen Pfadwechsel mehr: bei Stärke 0 wird nur das Overlay nicht gezeichnet.
// Farbraum ist ebenfalls kein Thema mehr — kopiert werden schirmfertige Werte, und
// genau die werden zurückgeschrieben.
//
// REIHENFOLGE bleibt: Szene → dieser Pass → Speedlines → hud.render().
//
//   const post = createRadialPost({ THREE, renderer });
//   post.setSize(w, h, pixelRatio);
//   post.setStrength(s, dt);        // 0 … ~0.11
//   post.render(scene, camera);     // statt renderer.render(scene, camera)
// ============================================================================

export function createRadialPost(opts = {}) {
  const THREE = opts.THREE;
  const renderer = opts.renderer;
  const P = Object.assign({
    samples: 10,        // Taps entlang der Linie zum Zentrum
    inner: 0.16,        // Radius, unter dem das Original unberührt bleibt
    outer: 0.92,        // ab hier volle Überblendung
    eps: 0.0015,        // darunter: Overlay wird nicht gezeichnet
  }, opts.params || {});

  let strength = 0, target = 0, w = 1, h = 1, pr = 1;
  let tex = new THREE.FramebufferTexture(2, 2);
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  const _origin = new THREE.Vector2(0, 0);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      tScreen: { value: tex },
      uStrength: { value: 0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.52) },
      uAspect: { value: 1 },
      uInner: { value: P.inner },
      uOuter: { value: P.outer },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      #define TAPS ${P.samples}
      uniform sampler2D tScreen;
      uniform float uStrength, uAspect, uInner, uOuter;
      uniform vec2 uCenter;
      varying vec2 vUv;
      void main() {
        vec2 d = vUv - uCenter;
        float r = length(d * vec2(uAspect, 1.0));
        float mask = smoothstep(uInner, uOuter, r);
        if (mask <= 0.002) discard;                 // Mitte: Originalpixel bleiben stehen
        float amt = uStrength * mask;
        vec3 sum = vec3(0.0); float wsum = 0.0;
        for (int i = 0; i < TAPS; i++) {
          float t = float(i) / float(TAPS - 1);
          float w = 1.0 - t * 0.55;                 // der scharfe Tap wiegt am meisten
          sum += texture2D(tScreen, uCenter + d * (1.0 - amt * t)).rgb * w;
          wsum += w;
        }
        gl_FragColor = vec4(sum / wsum, mask);      // Alpha = Maske → weiche Überblendung
      }`,
    transparent: true, depthTest: false, depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  quad.frustumCulled = false;
  const qScene = new THREE.Scene(); qScene.add(quad);
  const qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  function setSize(cw, ch, ratio) {
    w = Math.max(1, cw | 0); h = Math.max(1, ch | 0);
    pr = ratio || renderer.getPixelRatio() || 1;
    const dw = Math.max(1, Math.round(w * pr)), dh = Math.max(1, Math.round(h * pr));
    // FramebufferTexture wächst nicht mit — bei Größenwechsel neu anlegen
    if (tex.image.width !== dw || tex.image.height !== dh) {
      tex.dispose();
      tex = new THREE.FramebufferTexture(dw, dh);
      tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      mat.uniforms.tScreen.value = tex;
    }
    mat.uniforms.uAspect.value = w / h;
  }

  function render(scene, camera) {
    // 1) Szene wie immer direkt auf den Schirm — identisch zum Pfad ohne Post
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
    if (strength <= P.eps) return false;
    // 2) fertiges Bild kopieren und als geblurrtes Overlay darüberlegen
    mat.uniforms.uStrength.value = strength;
    renderer.copyFramebufferToTexture(_origin, tex);
    const keep = renderer.autoClear;
    renderer.autoClear = false;
    renderer.render(qScene, qCam);
    renderer.autoClear = keep;
    return true;
  }

  return {
    name: 'post-radial', setSize, render,
    // geglättet, damit der Effekt nicht an der eps-Schwelle flackert
    setStrength(v, dt) {
      target = Math.max(0, v || 0);
      if (dt == null) { strength = target; return; }
      strength += (target - strength) * Math.min(1, dt * (target > strength ? 8 : 3));
      if (strength < P.eps * 0.5) strength = 0;
    },
    setCenter(x, y) { mat.uniforms.uCenter.value.set(x, y); },
    setParams(p) { Object.assign(P, p || {}); mat.uniforms.uInner.value = P.inner; mat.uniforms.uOuter.value = P.outer; },
    get params() { return P; },
    get strength() { return strength; },
    get active() { return strength > P.eps; },
    dispose() { tex.dispose(); mat.dispose(); quad.geometry.dispose(); },
  };
}
