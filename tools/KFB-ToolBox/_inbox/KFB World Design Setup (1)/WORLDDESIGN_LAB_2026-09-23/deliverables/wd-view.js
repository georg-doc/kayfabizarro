/* KFB WorldDesign Lab v1 · Ansicht: EIN dominanter Viewport, optional in synchrone Vergleichsfelder
   geteilt (Brief-Korrektur §1). Eine Kamera, ein Orbit — die Felder können sich also nicht
   auseinanderlaufen; jedes Feld ist eine eigene Szene mit derselben Asset-Kopie und einem eigenen
   Look. Unterschiede stehen dadurch NEBENEINANDER statt hintereinander in der Zeit.

   Werte für Renderer, Orbit-Gefühl und Rahmung sind aus `kit-lab.js makeViewer()` übernommen
   (Pixeldichte-Deckel, sRGB-Ausgabe, PCF-Schatten, Dämpfung 0.14, Rahmung über die Bounding-Kugel,
   rAF-Stall-Netz). MISSING_DELTA, ehrlich benannt: Mehrfeld-Scissor-Rendering und der
   PostFX-Kompositor stehen in KEINEM Owner — kit-labs Viewer kennt einen Viewport und keinen
   Composer. Diese beiden Teile sind neu und gehören bei Annahme in den Viewer des Owners. */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeRig, BLOOM_LAYER } from './wd-light.js';
import { createInk, DEF as INK_DEF } from './wd-ink.js';

/* Grade statt LUT-Datei: im Repo liegt kein `.cube`-LUT. Ein erfundenes LUT-Bild wäre ein
   Scheinbeleg (§20) — deshalb ein benannter Grade-Pass (Belichtung, Kontrast, Sättigung,
   Warm/Kalt-Splittönung) mit EINEM Intensitätsregler, und im Beleg steht, dass ein echtes
   KFB-LUT als SOURCE_REQUIRED offen ist. */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null }, uAmt: { value: 0.6 },
    uExp: { value: 1.04 }, uCon: { value: 1.08 }, uSat: { value: 1.06 },
    uWarm: { value: new THREE.Vector3(1.05, 1.0, 0.94) }, uCool: { value: new THREE.Vector3(0.94, 0.99, 1.08) }
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uAmt, uExp, uCon, uSat;
    uniform vec3 uWarm, uCool; varying vec2 vUv;
    void main(){
      vec4 t = texture2D(tDiffuse, vUv);
      vec3 c = t.rgb * uExp;
      float l = dot(c, vec3(0.299,0.587,0.114));
      c = (c - 0.5) * uCon + 0.5;
      c = mix(vec3(l), c, uSat);
      c *= mix(uCool, uWarm, smoothstep(0.25, 0.75, l));
      gl_FragColor = vec4(mix(t.rgb, max(c, 0.0), uAmt), t.a);
    }`
};

const CombineShader = {
  uniforms: { tDiffuse: { value: null }, tBloom: { value: null }, uStrength: { value: 1 } },
  vertexShader: GradeShader.vertexShader,
  fragmentShader: `
    uniform sampler2D tDiffuse, tBloom; uniform float uStrength; varying vec2 vUv;
    void main(){ gl_FragColor = texture2D(tDiffuse, vUv) + texture2D(tBloom, vUv) * uStrength; }`
};

export function makeView(canvas, lightState) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.autoClear = false;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 4000);
  camera.position.set(3, 2, 4);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.14;
  controls.rotateSpeed = 0.85;
  controls.zoomSpeed = 1.1;
  controls.screenSpacePanning = true;
  controls.zoomToCursor = true;
  controls.maxPolarAngle = Math.PI * 0.495;

  let slots = [];
  let solo = -1;
  /* Tusche je Feld: eine Instanz pro Feld-Szene, alle mit denselben Parametern */
  const inkState = { on: false, params: { ...INK_DEF }, t0: performance.now() };
  function inkFor(s) {
    if (!s.ink) { s.ink = createInk({ renderer, scene: s.scene, camera }); s.ink.setParams(inkState.params); s.ink.setExcluded(s.inkExcluded || []); }
    return s.ink;
  }
  const fx = { bloom: false, strength: 1.1, threshold: 0.2, radius: 0.5, grade: false, gradeAmt: 0.6 };
  let bloomComposer = null, finalComposer = null, bloomPass = null, gradePass = null, combinePass = null, rtSize = [1, 1];

  function setSlots(names) {
    for (const s of slots) { if (s.ink) s.ink.dispose(); if (s.sky) s.sky.dispose(); s.scene.clear(); }
    solo = Math.min(solo, names.length - 1);
    slots = names.map((name) => {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      group.name = 'slot:' + name;
      scene.add(group);
      const grid = new THREE.GridHelper(40, 10, 0x6b5fa8, 0x342c52);
      grid.position.y = -0.001;
      scene.add(grid);
      const rig = makeRig(scene, lightState);
      return { name, scene, group, rig, grid, ink: null, sky: null, inkExcluded: [], noInk: false };
    });
    buildFX();
    return slots;
  }

  function size() {
    const host = canvas.parentElement || canvas;
    const r = host.getBoundingClientRect();
    return [Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height))];
  }

  function buildFX() {
    bloomComposer = finalComposer = null;
    if (slots.length !== 1) return;
    const [w, h] = size();
    rtSize = [w, h];
    const scene = slots[0].scene;
    bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.setSize(w, h);
    bloomComposer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), fx.strength, fx.radius, fx.threshold);
    bloomComposer.addPass(bloomPass);

    finalComposer = new EffectComposer(renderer);
    finalComposer.setSize(w, h);
    finalComposer.addPass(new RenderPass(scene, camera));
    combinePass = new ShaderPass(CombineShader);
    combinePass.uniforms.tBloom.value = bloomComposer.renderTarget2.texture;
    finalComposer.addPass(combinePass);
    finalComposer.addPass(new OutputPass());
    /* Der Grade sitzt NACH OutputPass, also im Anzeigeraum. Vorher lief er im linearen Raum,
       wo 0.5 nicht Mittelgrau ist — ein Kontrast um diesen Punkt hat die Szene zugedrückt
       (gemessen: Bild fast schwarz). Ein LUT wirkt ebenfalls im Anzeigeraum. */
    gradePass = new ShaderPass(GradeShader);
    gradePass.renderToScreen = true;
    finalComposer.addPass(gradePass);
  }

  let rsPending = false;
  function resize() {
    const [w, h] = size();
    renderer.setSize(w, h, false);
    if (bloomComposer) { bloomComposer.setSize(w, h); finalComposer.setSize(w, h); bloomPass.setSize(w, h); }
    rtSize = [w, h];
  }
  /* Der Beobachter hängt am ELTERNKASTEN, nicht am Canvas: `setSize` schreibt die
     Canvas-Attribute, und ein Beobachter am Canvas selbst hätte sich damit endlos
     selbst geweckt (gemessen: „ResizeObserver loop completed with undelivered notifications"). */
  new ResizeObserver(() => {
    if (rsPending) return;
    rsPending = true;
    requestAnimationFrame(() => { rsPending = false; resize(); });
  }).observe(canvas.parentElement || canvas);
  resize();

  /* Rahmung über die Bounding-Kugel — dieselbe Rechnung wie kit-labs frame() */
  function frame(box, pad = 1.2, dir = [0.9, 0.55, 1]) {
    if (!box || !isFinite(box.min.y)) return;
    const c = box.getCenter(new THREE.Vector3());
    const s = box.getSize(new THREE.Vector3());
    const radius = s.length() / 2;
    /* Horizontal UND vertikal passen: in schmalen/flachen Feldern ist der kleinere Winkel massgebend */
    const [fw, fh] = fieldSize();
    const fv = THREE.MathUtils.degToRad(camera.fov);
    const fhz = 2 * Math.atan(Math.tan(fv / 2) * (fw / fh));
    const dist = (radius * pad) / Math.sin(Math.min(fv, fhz) / 2);
    camera.position.copy(c).add(new THREE.Vector3(...dir).normalize().multiplyScalar(dist));
    /* near nicht zu klein: der Tiefen-Sobel der Tusche braucht Präzision (Ringe bei dist/500) */
    camera.near = Math.max(0.02, dist / 60);
    camera.far = Math.max(400, dist * 30);
    camera.updateProjectionMatrix();
    controls.target.copy(c);
    controls.minDistance = Math.max(0.03, radius * 0.1);
    controls.maxDistance = dist * 10;
    controls.update();
    for (const s2 of slots) s2.rig.place(box);
  }

  function visible() { return solo >= 0 && slots[solo] ? [slots[solo]] : slots; }
  function layoutOf() {
    const n = visible().length;
    const cols = n <= 1 ? 1 : 2;
    return { n, cols, rows: Math.ceil(n / cols) };
  }
  function fieldSize() {
    const [w, h] = size();
    const L = layoutOf();
    return [Math.max(1, Math.floor(w / L.cols)), Math.max(1, Math.floor(h / L.rows))];
  }
  function grid(on) { for (const s of slots) s.grid.visible = on; }

  function draw() {
    controls.update();
    const [w, h] = size();
    const now = performance.now();
    const dt = Math.min(0.05, (now - (draw._t || now)) / 1000);
    draw._t = now;
    /* Puffer und Viewport-Rechnung aus DERSELBEN Messung: hält rAF an oder feuert der Beobachter
       nach einem Layoutwechsel nicht erneut, bliebe der Zeichenpuffer sonst auf alter Größe und
       nur das erste Feld landete — gestreckt — im Bild. */
    const pr = renderer.getPixelRatio();
    if (canvas.width !== Math.floor(w * pr) || canvas.height !== Math.floor(h * pr)) {
      resize();
      if (slots.length === 1) buildFX();
    }
    /* Tusche (Voxel-Zone-S2-Owner) ersetzt im Einzelfeld den Composer: sie rendert Szene + Sobel
       selbst. Bloom/Grade laufen dann nicht — zwei Kompositoren hintereinander wären ein
       zweiter Tonemapping-Durchgang (der Owner dokumentiert genau diesen 11-%-Fehler). */
    const vis = visible();
    for (const s of vis) if (s.sky) s.sky.update(camera, s.rig.key.getWorldPosition(new THREE.Vector3()));
    const tInk = (now - inkState.t0) / 1000;
    if (!inkState.on && slots.length === 1 && (fx.bloom || fx.grade) && finalComposer) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      combinePass.uniforms.uStrength.value = fx.bloom ? 1 : 0;
      gradePass.uniforms.uAmt.value = fx.grade ? fx.gradeAmt : 0;
      bloomPass.strength = fx.strength;
      bloomPass.threshold = fx.threshold;
      bloomPass.radius = fx.radius;
      if (fx.bloom) {
        /* Selektiv ohne Materialtausch: der Bloom-Durchgang sieht NUR die getaggte Ebene. */
        camera.layers.set(BLOOM_LAYER);
        bloomComposer.render();
        camera.layers.enableAll();
      }
      renderer.setScissorTest(false);
      finalComposer.render();
      return;
    }
    renderer.setScissorTest(true);
    renderer.setViewport(0, 0, w, h);
    renderer.setScissor(0, 0, w, h);
    renderer.clear();
    const { cols, rows } = layoutOf();
    const sw = Math.floor(w / cols), sh = Math.floor(h / rows);
    camera.aspect = sw / sh;
    camera.updateProjectionMatrix();
    camera.layers.enableAll();
    vis.forEach((s, i) => {
      const cx = (i % cols) * sw;
      const cy = h - sh - Math.floor(i / cols) * sh;
      renderer.setViewport(cx, cy, sw, sh);
      renderer.setScissor(cx, cy, sw, sh);
      if (inkState.on && !s.noInk) {
        const ink = inkFor(s);
        ink.setSize(sw, sh);
        ink.render(tInk);
      } else renderer.render(s.scene, camera);
    });
    renderer.setScissorTest(false);
  }

  /* Takt: rAF führt, ein Intervall fängt auf (kit-lab-Bauart: der Nachzügler zeichnet nur,
     wenn der Führende wirklich steht — in unsichtbaren Vorschaurahmen hält rAF an). */
  let lastTick = performance.now(), onTick = null;
  (function loop() {
    requestAnimationFrame(loop);
    lastTick = performance.now();
    if (onTick) onTick();
    draw();
  })();
  setInterval(() => { if (performance.now() - lastTick > 400) { if (onTick) onTick(); draw(); } }, 150);

  return {
    renderer, camera, controls, fx,
    get slots() { return slots; },
    setSlots, frame, resize, draw, grid, buildFX,
    ink: inkState,
    setInkOn: (on) => { inkState.on = !!on; },
    setInkParams: (p) => { Object.assign(inkState.params, p); for (const s of slots) if (s.ink) s.ink.setParams(p); },
    setInkExcluded: (i, list) => { const s = slots[i]; if (!s) return; s.inkExcluded = list; if (s.ink) s.ink.setExcluded(list); },
    setSky: (i, sky) => { const s = slots[i]; if (!s) { if (sky) sky.dispose(); return; } if (s.sky) s.sky.dispose(); s.sky = sky; s.scene.userData.skyBg = sky ? (sky.background || (sky.group ? null : undefined)) : undefined; s.rig.refresh(); },
    get solo() { return solo; },
    setSolo: (i) => { solo = i; },
    fieldSize,
    renameSlot: (i, name) => { if (slots[i]) slots[i].name = name; },
    setTick: (f) => { onTick = f; },
    slotRects: () => {
      const { cols, rows } = layoutOf();
      return visible().map((s, k) => ({ name: s.name, index: slots.indexOf(s), col: k % cols, row: Math.floor(k / cols), cols, rows }));
    }
  };
}
