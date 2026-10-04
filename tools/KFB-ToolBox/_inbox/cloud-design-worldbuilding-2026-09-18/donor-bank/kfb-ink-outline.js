// ============================================================================
// kfb-ink-outline.js — Screen-Space-Tusche für ALLES im Bild
// ----------------------------------------------------------------------------
// Der Kitt zwischen den Asset-Welten: ein Sobel über Tiefe UND Normalen zieht
// dieselbe Tusche-Linie um Voxel-Cubes, Kenney-GLBs, Pets und Karten. Kein Asset
// muss dafür angefasst werden (Art-Direction-Papier §2, Roadmap Schritt 2).
//
// Linienstärke variiert mit Tiefe + einem Welt-Rauschen → keine CAD-Kontur,
// sondern ein Stift, der mal drückt und mal nicht.
// WebGL / three 0.160. Nutzt EffectComposer (three/addons).
// ============================================================================

export async function createInkOutline(THREE, { renderer, scene, camera, addons = 'three/addons/' }) {
  const [{ EffectComposer }, { RenderPass }, { ShaderPass }] = await Promise.all([
    import(addons + 'postprocessing/EffectComposer.js'),
    import(addons + 'postprocessing/RenderPass.js'),
    import(addons + 'postprocessing/ShaderPass.js'),
  ]);

  const size = new THREE.Vector2();
  renderer.getSize(size);
  const dpr = renderer.getPixelRatio();

  // Normalen + Tiefe in ein eigenes Target — daraus liest der Sobel die Kanten.
  const nrmTarget = new THREE.WebGLRenderTarget(size.x * dpr, size.y * dpr, {
    minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.HalfFloatType,
  });
  nrmTarget.depthTexture = new THREE.DepthTexture(size.x * dpr, size.y * dpr);
  nrmTarget.depthTexture.type = THREE.UnsignedShortType;
  const nrmMat = new THREE.MeshNormalMaterial();

  const InkShader = {
    uniforms: {
      tDiffuse: { value: null }, tNormal: { value: nrmTarget.texture }, tDepth: { value: nrmTarget.depthTexture },
      uRes: { value: new THREE.Vector2(size.x * dpr, size.y * dpr) },
      uThickness: { value: 1.35 }, uStrength: { value: 0.85 },
      uInk: { value: new THREE.Color(0x241b18) },
      uDepthEdge: { value: 0.0016 }, uNormalEdge: { value: 0.62 },
      uNear: { value: camera.near }, uFar: { value: camera.far }, uTime: { value: 0 },
      uGrain: { value: 0.28 },
    },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: [
      'uniform sampler2D tDiffuse, tNormal, tDepth;',
      'uniform vec2 uRes; uniform vec3 uInk;',
      'uniform float uThickness, uStrength, uDepthEdge, uNormalEdge, uNear, uFar, uTime, uGrain;',
      'varying vec2 vUv;',
      'float lin(float d){ float z = d * 2.0 - 1.0; return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear)); }',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }',
      'void main(){',
      '  vec2 px = uThickness / uRes;',
      '  float d0 = lin(texture2D(tDepth, vUv).x);',
      '  float dx = abs(lin(texture2D(tDepth, vUv + vec2(px.x,0.0)).x) - d0) + abs(lin(texture2D(tDepth, vUv - vec2(px.x,0.0)).x) - d0);',
      '  float dy = abs(lin(texture2D(tDepth, vUv + vec2(0.0,px.y)).x) - d0) + abs(lin(texture2D(tDepth, vUv - vec2(0.0,px.y)).x) - d0);',
      '  vec3 n0 = texture2D(tNormal, vUv).xyz;',
      // SCHLEIFENDE FLAECHEN: liegt eine Flaeche fast in Blickrichtung (Boden am Horizont,
      // Waende am Bildrand), springt die Tiefe von Pixel zu Pixel — der Sobel sieht dort
      // ueberall "Kante" und es rauscht. Schwelle deshalb mit dem Anstellwinkel skalieren.
      '  float facing = clamp(abs(n0.z * 2.0 - 1.0), 0.06, 1.0);',
      '  float thr = uDepthEdge / (facing * facing);',
      '  float dEdge = smoothstep(thr * d0, thr * d0 * 3.5, dx + dy);',
      '  float nd = 0.0;',
      '  nd += distance(n0, texture2D(tNormal, vUv + vec2(px.x,0.0)).xyz);',
      '  nd += distance(n0, texture2D(tNormal, vUv - vec2(px.x,0.0)).xyz);',
      '  nd += distance(n0, texture2D(tNormal, vUv + vec2(0.0,px.y)).xyz);',
      '  nd += distance(n0, texture2D(tNormal, vUv - vec2(0.0,px.y)).xyz);',
      '  float nEdge = smoothstep(uNormalEdge, uNormalEdge * 1.9, nd);',
      '  float e = max(dEdge, nEdge);',
      // Stift-Druck: die Linie schwankt, statt gleichmaessig zu sein.
      // Stift-Druck in groben Zellen: feinkoerniger Hash wandert als Pixelrauschen ueber
      // die Kontur, sobald sich die Kamera bewegt. Grobe Zellen lesen als Strichstaerke.
      '  e *= 1.0 - uGrain * hash(floor(vUv * uRes * 0.09));',
      '  e *= 1.0 - smoothstep(0.55, 1.0, d0 / uFar);',       // in der Ferne ausduennen
      '  vec4 c = texture2D(tDiffuse, vUv);',
      '  gl_FragColor = vec4(mix(c.rgb, uInk, clamp(e, 0.0, 1.0) * uStrength), c.a);',
      // Der Ink-Pass ist der LETZTE Pass und schreibt direkt auf den Canvas, also macht er
      // hier die sRGB-Wandlung selbst. Mit einem OutputPass dahinter wuerde ACES doppelt
      // greifen (Material + OutputPass) und das Bild ~11% zu dunkel rendern — dann vergliche
      // "Tusche an/aus" Belichtung statt Konturen.
      // Der Ink-Pass ist der LETZTE Pass und schreibt direkt auf den Canvas. Ob hier noch
      // Tonemapping/sRGB noetig ist, haengt daran, was der RenderPass ins Target geschrieben
      // hat — deshalb steuert es KFB_OUT (unten gesetzt), statt es blind einzubauen.
      '#ifdef KFB_TONEMAP',
      '  #include <tonemapping_fragment>',
      '#endif',
      '#ifdef KFB_SRGB',
      '  #include <colorspace_fragment>',
      '#endif',
      '}',
    ].join('\n'),
  };

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(
    Math.max(2, size.x * dpr), Math.max(2, size.y * dpr),
    // OHNE samples rendert der Composer in ein Target ohne Multisampling: jede Kante
    // aliast und KRIECHT beim Drehen (das "Flackern"). Der Default-Canvas hat MSAA, das
    // Target erbt es nicht.
    { type: THREE.HalfFloatType, samples: 4 },
  ));
  composer.addPass(new RenderPass(scene, camera));
  const inkPass = new ShaderPass(InkShader);
  // ShaderPass klont die Uniforms — Render-Target-Texturen ueberleben das Klonen nicht.
  inkPass.uniforms.tNormal.value = nrmTarget.texture;
  inkPass.uniforms.tDepth.value = nrmTarget.depthTexture;
  // Was der RenderPass ins HalfFloat-Target schreibt, haengt an der three-Version. Der
  // Pass gleicht die Differenz aus, statt Tonemapping/sRGB doppelt oder gar nicht zu machen.
  const setOut = (tonemap, srgb) => {
    inkPass.material.defines = Object.assign({}, inkPass.material.defines);
    if (tonemap) inkPass.material.defines.KFB_TONEMAP = ''; else delete inkPass.material.defines.KFB_TONEMAP;
    if (srgb) inkPass.material.defines.KFB_SRGB = ''; else delete inkPass.material.defines.KFB_SRGB;
    inkPass.material.needsUpdate = true;
  };
  // Gemessen (three 0.160): der RenderPass schreibt LINEAR und OHNE Tonemapping ins Target.
  // Also macht der Ink-Pass beides — dann liegen Objektpixel mit und ohne Tusche auf 1 Luma
  // gleich, statt dass "Tusche an" die ganze Bank um ~11% abdunkelt.
  setOut(true, true);
  composer.addPass(inkPass);

  let enabled = true;
  let lastSceneCalls = 0;
  // Objekte, die KEINE Kontur bekommen. Auf einem dichten Voxel-Feld feuert der Sobel an jeder
  // Zellkante und die Stift-Modulation macht daraus ein Schraffur-Raster — das Terrain macht
  // seinen Look im eigenen Shader, es braucht die Feder nicht. Silhouetten der uebrigen Objekte
  // GEGEN das Terrain bleiben erhalten, weil dort die Tiefe auf "fern" springt.
  let excluded = [];

  return {
    get enabled() { return enabled; },
    setEnabled(v) { enabled = !!v; },
    setParams(p = {}) {
      const u = inkPass.uniforms;
      if (p.thickness != null) u.uThickness.value = p.thickness;
      if (p.strength != null) u.uStrength.value = p.strength;
      if (p.ink != null) u.uInk.value.set(p.ink);
      if (p.depthEdge != null) u.uDepthEdge.value = p.depthEdge;
      if (p.normalEdge != null) u.uNormalEdge.value = p.normalEdge;
      if (p.grain != null) u.uGrain.value = p.grain;
      if (p.output) setOut(!!p.output.tonemap, !!p.output.srgb);
    },
    /** setExcluded([Object3D]) — diese Teilbaeume liefern keine Kanten an den Sobel. */
    setExcluded(list) { excluded = Array.isArray(list) ? list.filter(Boolean) : (list ? [list] : []); },
    setSize(w, h) {
      const r = renderer.getPixelRatio();
      composer.setSize(w, h);
      nrmTarget.setSize(w * r, h * r);
      inkPass.uniforms.uRes.value.set(w * r, h * r);
    },
    /** Draw-Calls der eigentlichen Szene — nach composer.render() zaehlt info nur den letzten Pass. */
    get sceneCalls() { return lastSceneCalls; },
    render(dt) {
      if (!enabled) { renderer.render(scene, camera); lastSceneCalls = renderer.info.render.calls; return; }
      inkPass.uniforms.uTime.value += dt || 0;
      inkPass.uniforms.uNear.value = camera.near;
      inkPass.uniforms.uFar.value = camera.far;
      const prevOverride = scene.overrideMaterial, prevBg = scene.background;
      scene.overrideMaterial = nrmMat; scene.background = null;
      const hidden = excluded.map((o) => o.visible);
      for (let i = 0; i < excluded.length; i++) excluded[i].visible = false;
      renderer.setRenderTarget(nrmTarget);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      for (let i = 0; i < excluded.length; i++) excluded[i].visible = hidden[i];
      scene.overrideMaterial = prevOverride; scene.background = prevBg;
      lastSceneCalls = renderer.info.render.calls;   // Szene, ohne die Fullscreen-Passes
      composer.render();
    },
    dispose() { nrmTarget.dispose(); composer.dispose && composer.dispose(); },
  };
}

export default { createInkOutline };
