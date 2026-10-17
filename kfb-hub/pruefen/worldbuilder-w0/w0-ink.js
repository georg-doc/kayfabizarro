/* KFB WB-W0 · Tusche = wd-ink.js (WorldDesign Lab) WÖRTLICH + EIN Delta: Entfernungsblende.
   DELTA W0: `fadeNear`/`fadeFar` (Meter, lineare Tiefe) blenden jede Linie mit der Entfernung aus —
   Georg: „Ink Outline nur entfernungsabhängig und bildschirmbezogen“. Gelände wird vom Host aus dem
   Normalen-/Tiefenpass ausgeschlossen: keine Terrain- oder Küstenlinien.
   ---- ab hier Kopfkommentar des Donors ----
   KFB WorldDesign Lab v1 · Tusche (abgeleitet von kfb-ink-outline.js, Voxel Zone S2)
   Wörtlich vom Owner: Sobel über Tiefe UND Normalen, Schwelle mit dem Anstellwinkel skaliert,
   Ausdünnen in der Ferne, Tonemapping + sRGB im letzten Pass, MSAA-Target, Ausschlussliste.

   Korrektur 23.09. (Georg: „bewegt sich auch in SOURCE · extrem pixelig mit Schnittkanten"):
   · Der Stift-Druck des Owners (`hash(floor(uv*res*0.09))`) sind harte 11-px-ZELLEN. Sobald der
     Sobel auf glatten Flächen leicht anspricht, werden die Zellen als Mosaik sichtbar — und mit
     dem gestuften Wobble wandert das Mosaik. Ersetzt durch WEICHES Rauschen (keine Zellkanten).
   · Innerhalb des Passes lief der Scissor des 4er-Rasters weiter und schnitt die Normalen-/
     Tiefenziele auf den Feldausschnitt zu (Kanten an Feldgrenzen). Jetzt: Scissor aus, danach
     wiederhergestellt.
   · Wobble verschiebt NUR die Kantenabtastung, niemals das Bild selbst.
   · SOURCE bekommt keine Tusche (entscheidet der Host).

   KFB-Schattenlogik (Georg 23.09.): Licht = dünnere Linie, Schatten = dickere Linie. Die Breite
   wird je Pixel aus der Helligkeit des gerenderten Bildes gewählt, weich zwischen `thin` und
   `thick`. Das ist MISSING_DELTA zum Owner. */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export const DEF = {
  strength: 1, thin: 2.4, thick: 5.6, lightLo: 0.06, lightHi: 0.45,
  ink: 0x14100e, depthEdge: 0.0016, normalEdge: 0.9, grain: 0.25,
  wobble: 0.8, wobbleSpeed: 0.6, gap: 0, surf: 0,
  fadeNear: 30, fadeFar: 160
};

export const PARAMS = [
  ['strength', 'Deckkraft', 0, 1, 0.01],
  ['thin', 'Breite im Licht', 0.5, 5, 0.05],
  ['thick', 'Breite im Schatten', 0.5, 8, 0.05],
  ['lightHi', 'Licht ab Helligkeit', 0.1, 1, 0.01],
  ['wobble', 'Wobble (Linie)', 0, 3, 0.01],
  ['wobbleSpeed', 'Wobble-Tempo', 0, 3, 0.01],
  ['gap', 'Aussetzer', 0, 0.8, 0.01],
  ['surf', 'Tuschefarbe aus Fläche', 0, 1, 0.01],
  ['grain', 'Stift-Druck', 0, 1, 0.01],
  ['normalEdge', 'Innenkanten-Schwelle', 0.3, 1.9, 0.01],
  ['depthEdge', 'Tiefenkanten-Schwelle', 0.0003, 0.008, 0.0001]
];

export function createInk({ renderer, scene, camera }) {
  const size = new THREE.Vector2(2, 2);
  const nrmTarget = new THREE.WebGLRenderTarget(2, 2, {
    minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, type: THREE.HalfFloatType
  });
  nrmTarget.depthTexture = new THREE.DepthTexture(2, 2);
  nrmTarget.depthTexture.type = THREE.UnsignedIntType;
  const nrmMat = new THREE.MeshNormalMaterial();

  const U0 = {
    tDiffuse: { value: null }, tNormal: { value: null }, tDepth: { value: null },
    uRes: { value: new THREE.Vector2(2, 2) },
    uInk: { value: new THREE.Color(DEF.ink) },
    uNear: { value: camera.near }, uFar: { value: camera.far }, uTime: { value: 0 }
  };
  for (const k of ['strength', 'thin', 'thick', 'lightLo', 'lightHi', 'depthEdge', 'normalEdge', 'grain', 'wobble', 'wobbleSpeed', 'gap', 'surf', 'fadeNear', 'fadeFar']) {
    U0['u' + k[0].toUpperCase() + k.slice(1)] = { value: DEF[k] };
  }
  const Shader = {
    uniforms: U0,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: [
      'uniform sampler2D tDiffuse, tNormal, tDepth;',
      'uniform vec2 uRes; uniform vec3 uInk;',
      'uniform float uStrength, uThin, uThick, uLightLo, uLightHi, uDepthEdge, uNormalEdge, uNear, uFar, uTime, uGrain, uWobble, uWobbleSpeed, uGap, uSurf, uFadeNear, uFadeFar;',
      'varying vec2 vUv;',
      'float lin(float d){ float z = d * 2.0 - 1.0; return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear)); }',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }',
      'float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
      '  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }',
      /* Silhouette: ZWEITE Ableitung der Tiefe. Eine schräge Ebene hat eine konstante Steigung und
         damit Laplace 0 — die erste Ableitung des Owners feuerte in kleinen Feldern auf jeder
         schrägen Fläche (gemessen: Figur voll eingefärbt, auch bei 1 px). */
      'float silAt(vec2 uv, vec2 px){',
      '  float d0 = lin(texture2D(tDepth, uv).x);',
      '  float ax = lin(texture2D(tDepth, uv + vec2(px.x,0.0)).x) + lin(texture2D(tDepth, uv - vec2(px.x,0.0)).x) - 2.0 * d0;',
      '  float ay = lin(texture2D(tDepth, uv + vec2(0.0,px.y)).x) + lin(texture2D(tDepth, uv - vec2(0.0,px.y)).x) - 2.0 * d0;',
      '  float lap = max(abs(ax), abs(ay));',
      '  return smoothstep(uDepthEdge * d0 * 8.0, uDepthEdge * d0 * 24.0, lap) * (1.0 - smoothstep(0.55, 1.0, d0 / uFar));',
      '}',
      /* Innenkanten: nur echte Knicke (Normalensprung), mit eigener, schmaler Breite */
      'float creaseAt(vec2 uv, vec2 px){',
      '  vec3 n0 = texture2D(tNormal, uv).xyz;',
      '  float nd = max(max(distance(n0, texture2D(tNormal, uv + vec2(px.x,0.0)).xyz), distance(n0, texture2D(tNormal, uv - vec2(px.x,0.0)).xyz)),',
      '                 max(distance(n0, texture2D(tNormal, uv + vec2(0.0,px.y)).xyz), distance(n0, texture2D(tNormal, uv - vec2(0.0,px.y)).xyz)));',
      '  return smoothstep(uNormalEdge, uNormalEdge * 1.5, nd);',
      '}',
      'void main(){',
      '  vec2 sp = vUv * uRes;',
      '  float t = uTime * uWobbleSpeed;',
      // weicher, fliessender Wobble der Abtastung (keine Stufen, keine Zellen)
      '  vec2 wob = vec2(vn(sp / 38.0 + vec2(t, 0.3 * t)), vn(sp / 38.0 + vec2(17.3 - 0.4 * t, t))) - 0.5;',
      '  vec2 uv = vUv + wob * uWobble * 2.0 / uRes;',
      // KFB-Schattenlogik: Breite aus der Bildhelligkeit (Licht dünn, Schatten dick)
      '  vec3 c0 = texture2D(tDiffuse, vUv).rgb;',
      '  float lum = dot(c0, vec3(0.299, 0.587, 0.114));',
      '  float lit = smoothstep(uLightLo, uLightHi, lum);',
      /* Breiten sind auf 1000 px Feldhöhe bezogen — im 4er-Raster also schmaler, im Einzelfeld breiter */
      '  float k = uRes.y / 1000.0;',
      '  float w = mix(uThick, uThin, lit) * k * (1.0 + (vn(sp / 90.0 + t * 0.5) - 0.5) * 0.35 * uWobble);',
      '  float e = max(silAt(uv, vec2(max(w, 0.75)) / uRes), creaseAt(uv, vec2(max(uThin * k * 0.6, 0.75)) / uRes) * 0.85);',
      '  e *= 1.0 - smoothstep(uFadeNear, uFadeFar, lin(texture2D(tDepth, vUv).x));',   // DELTA W0
      '  e *= 1.0 - uGrain * vn(sp / 14.0 + 3.1);',
      '  if (uGap > 0.001) e *= smoothstep(uGap - 0.1, uGap + 0.1, vn(sp / 70.0 + t * 0.2));',
      /* Tuschefarbe aus der Fläche: die dunkelste Nachbarfarbe, gesättigt und abgedunkelt — die Linie
         nimmt den Ton des Objekts an, dessen Rand sie zeichnet (Derek: braune Linie am Holz) */
      '  vec3 cn = min(min(texture2D(tDiffuse, vUv + vec2(2.0,0.0)/uRes).rgb, texture2D(tDiffuse, vUv - vec2(2.0,0.0)/uRes).rgb),',
      '                min(texture2D(tDiffuse, vUv + vec2(0.0,2.0)/uRes).rgb, texture2D(tDiffuse, vUv - vec2(0.0,2.0)/uRes).rgb));',
      '  float cl = dot(cn, vec3(0.3333));',
      '  vec3 sink = clamp(mix(vec3(cl), cn, 1.6) * 0.32, 0.0, 1.0);',
      '  vec3 ink = mix(uInk, sink, uSurf);',
      '  gl_FragColor = vec4(mix(c0, ink, clamp(e, 0.0, 1.0) * uStrength), texture2D(tDiffuse, vUv).a);',
      '#ifdef KFB_TONEMAP',
      '  #include <tonemapping_fragment>',
      '#endif',
      '#ifdef KFB_SRGB',
      '  #include <colorspace_fragment>',
      '#endif',
      '}'
    ].join('\n')
  };

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: 4 }));
  composer.renderToScreen = true;
  composer.addPass(new RenderPass(scene, camera));
  const pass = new ShaderPass(Shader);
  pass.uniforms.tNormal.value = nrmTarget.texture;
  pass.uniforms.tDepth.value = nrmTarget.depthTexture;
  pass.material.defines = { KFB_TONEMAP: '', KFB_SRGB: '' };
  pass.material.needsUpdate = true;
  composer.addPass(pass);

  let enabled = true, excluded = [];
  const U = pass.uniforms;
  const vp = new THREE.Vector4(), sc = new THREE.Vector4();
  return {
    uniforms: U,
    get enabled() { return enabled; },
    setEnabled(v) { enabled = !!v; },
    setParams(p = {}) {
      for (const [k, v] of Object.entries(p)) {
        if (v == null) continue;
        if (k === 'ink') { U.uInk.value.set(v); continue; }
        const u = U['u' + k[0].toUpperCase() + k.slice(1)];
        if (u) u.value = v;
      }
    },
    setExcluded(list) { excluded = (Array.isArray(list) ? list : [list]).filter(Boolean); },
    setSize(w, h) {
      if (size.x === w && size.y === h) return;
      size.set(w, h);
      const r = renderer.getPixelRatio();
      composer.setSize(w, h);
      nrmTarget.setSize(Math.max(2, w * r), Math.max(2, h * r));
      U.uRes.value.set(w * r, h * r);
    },
    render(t) {
      U.uTime.value = t;
      U.uNear.value = camera.near;
      U.uFar.value = camera.far;
      renderer.getViewport(vp);
      renderer.getScissor(sc);
      const scOn = renderer.getScissorTest();
      renderer.setScissorTest(false);
      const prevO = scene.overrideMaterial, prevB = scene.background;
      scene.overrideMaterial = nrmMat; scene.background = null;
      const hidden = excluded.map((o) => o.visible);
      excluded.forEach((o) => { o.visible = false; });
      renderer.setRenderTarget(nrmTarget);
      renderer.clear();
      renderer.render(scene, camera);
      excluded.forEach((o, i) => { o.visible = hidden[i]; });
      scene.overrideMaterial = prevO; scene.background = prevB;
      renderer.setRenderTarget(null);
      composer.passes[0].enabled = true;
      /* Offscreen-Passes ohne Scissor, der letzte Pass zurück in den Feldausschnitt */
      const last = composer.passes[composer.passes.length - 1];
      const orig = last.render;
      last.render = function (r, ...args) {
        r.setViewport(vp);
        r.setScissor(sc);
        r.setScissorTest(scOn);
        return orig.call(this, r, ...args);
      };
      composer.render();
      last.render = orig;
      renderer.setViewport(vp);
      renderer.setScissor(sc);
      renderer.setScissorTest(scOn);
    },
    dispose() { nrmTarget.dispose(); composer.dispose && composer.dispose(); nrmMat.dispose(); }
  };
}
