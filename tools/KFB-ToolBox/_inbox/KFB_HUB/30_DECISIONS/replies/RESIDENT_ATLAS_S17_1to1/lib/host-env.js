/* KFB · Resident-Host-Umgebung · prozeduraler Boden + Himmelskuppel + Tageszeit
   Gehört dem ATLAS-HOST, nie einem Resident oder Event. Konvention:
   · Der Host montiert die Umgebung EINMAL. Ein Resident/Event wird auf floorY = 0 eingesetzt und
     verändert die Fläche nicht, bringt keine Grundplatte mit und färbt den Himmel nicht um.
   · Die Tageszeit ist die einzige Stimmungsschraube: sie stellt Himmel, Nebel und die drei
     Viewer-Lichter (Hemi, Sonne, Fülllicht) gemeinsam. Aus = alles zurück auf den Viewer-Stand.
   · Boden ist prozedural (Shader-Rauschen über Weltkoordinaten), ohne Kante: er läuft in den
     Nebel der Horizontfarbe aus. Das ist ein Platzhalter mit derselben Rolle wie ein späterer
     WorldBuilder-Boden — Tausch ohne Änderung an den Residents. */
import * as THREE from 'three';

export const ENV_SCHEMA = 'kfb.resident-host-env/1';
const KEYS = [
  { h: 6,    zen: '#2b3a67', hor: '#e8a27a', gnd: '#3a3228', sun: '#ffb37a', si: 1.3, el: 5,  hs: '#9fb0d8', hg: '#4a3d30', hi: 1.2, grass: 0.85 },
  { h: 12,   zen: '#3f7fd0', hor: '#c4dcef', gnd: '#50604a', sun: '#fff4e2', si: 2.6, el: 58, hs: '#ffffff', hg: '#8a9a7a', hi: 2.0, grass: 1.0 },
  { h: 18,   zen: '#3a4e8c', hor: '#f2b074', gnd: '#4a3e30', sun: '#ffc27a', si: 2.1, el: 12, hs: '#ffe0c0', hg: '#6b5a48', hi: 1.6, grass: 0.9 },
  { h: 21.5, zen: '#0b1026', hor: '#2a2f55', gnd: '#15161c', sun: '#9fb4ff', si: 0.5, el: 35, hs: '#6a7ab0', hg: '#22222c', hi: 0.85, grass: 0.55 },
  { h: 30,   zen: '#2b3a67', hor: '#e8a27a', gnd: '#3a3228', sun: '#ffb37a', si: 1.3, el: 5,  hs: '#9fb0d8', hg: '#4a3d30', hi: 1.2, grass: 0.85 }
];
const NOISE = `
float kh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float kn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(kh(i), kh(i+vec2(1,0)), u.x), mix(kh(i+vec2(0,1)), kh(i+vec2(1,1)), u.x), u.y); }
float kfbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a*kn(p); p = p*2.03 + 7.1; a *= .5; } return s; }`;

export function mountHostEnv(V, { time = 14, on = true } = {}) {
  const root = new THREE.Group();
  root.name = 'host-env';
  /* ---- Boden ---- */
  const U = { uGrassA: { value: new THREE.Color('#4f6b3a') }, uGrassB: { value: new THREE.Color('#6f8a45') }, uDirt: { value: new THREE.Color('#7a6a4e') }, uTint: { value: 1 } };
  const gm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 });
  gm.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = 'varying vec3 vKW;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vKW = (modelMatrix * vec4(transformed, 1.)).xyz;');
    sh.fragmentShader = 'varying vec3 vKW;\nuniform vec3 uGrassA; uniform vec3 uGrassB; uniform vec3 uDirt; uniform float uTint;\n' + NOISE + '\n' +
      sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      vec2 kp = vKW.xz;
      float n1 = kfbm(kp * 0.32), n2 = kfbm(kp * 1.9 + 13.), n3 = kfbm(kp * 0.09 + 5.);
      vec3 kc = mix(uGrassA, uGrassB, smoothstep(0.32, 0.72, n1));
      kc = mix(kc, uDirt, smoothstep(0.6, 0.78, n3) * 0.65);
      kc *= 0.86 + 0.28 * n2;
      diffuseColor.rgb = kc * uTint;`);
  };
  gm.customProgramCacheKey = () => 'kfb-host-ground-1';
  const ground = new THREE.Mesh(new THREE.CircleGeometry(160, 96), gm);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; ground.receiveShadow = true; ground.name = 'Host · Boden (prozedural)';
  /* ---- Himmel ---- */
  const SU = { uZen: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uGnd: { value: new THREE.Color() }, uSun: { value: new THREE.Color() }, uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSunK: { value: 1 } };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: SU,
    vertexShader: 'varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p.xyww; }',
    fragmentShader: `varying vec3 vD; uniform vec3 uZen, uHor, uGnd, uSun, uSunDir; uniform float uSunK;
      void main(){ vec3 d = normalize(vD); float h = d.y;
        vec3 c = h > 0. ? mix(uHor, uZen, pow(h, 0.55)) : mix(uHor, uGnd, pow(-h, 0.35));
        float s = max(0., dot(d, normalize(uSunDir)));
        c += uSun * uSunK * (pow(s, 900.) * 3. + pow(s, 14.) * 0.22);
        gl_FragColor = vec4(c, 1.);
        #include <colorspace_fragment>
      }`
  }));
  sky.name = 'Host · Himmelskuppel'; sky.frustumCulled = false; sky.renderOrder = -10;
  root.add(ground, sky);

  /* ---- Viewer-Lichter finden und merken ---- */
  let hemi = null, key = null, fill = null, shadowGround = null;
  V.scene.traverse((o) => {
    if (o.isHemisphereLight && !hemi) hemi = o;
    else if (o.isDirectionalLight && o.castShadow && !key) key = o;
    else if (o.isDirectionalLight && !fill) fill = o;
    if (o.isMesh && o.material && o.material.isShadowMaterial) shadowGround = o;
  });
  let keep = null;
  const capture = () => ({ bg: V.scene.background, fog: V.scene.fog,
    hemi: hemi && { c: hemi.color.clone(), g: hemi.groundColor.clone(), i: hemi.intensity },
    key: key && { c: key.color.clone(), i: key.intensity, p: key.position.clone() },
    fill: fill && { c: fill.color.clone(), i: fill.intensity } });
  const fog = new THREE.Fog(0xffffff, 30, 110);
  const S = { on: false, time };
  const c1 = new THREE.Color(), c2 = new THREE.Color();
  function lerpKey(t) {
    const h = t < 6 ? t + 24 : t;
    let a = KEYS[0], b = KEYS[1];
    for (let i = 0; i < KEYS.length - 1; i++) if (h >= KEYS[i].h && h <= KEYS[i + 1].h) { a = KEYS[i]; b = KEYS[i + 1]; }
    const k = (h - a.h) / Math.max(1e-6, b.h - a.h);
    const col = (x, y) => c1.set(a[x]).lerp(c2.set(b[x]), k).clone();
    const num = (x) => a[x] + (b[x] - a[x]) * k;
    return { zen: col('zen'), hor: col('hor'), gnd: col('gnd'), sun: col('sun'), si: num('si'), el: num('el'), hs: col('hs'), hg: col('hg'), hi: num('hi'), grass: num('grass') };
  }
  function apply() {
    if (!S.on) return;
    const K = lerpKey(S.time);
    SU.uZen.value.copy(K.zen); SU.uHor.value.copy(K.hor); SU.uGnd.value.copy(K.gnd); SU.uSun.value.copy(K.sun);
    const el = K.el * Math.PI / 180, az = -0.85;
    const dir = new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
    SU.uSunDir.value.copy(dir); SU.uSunK.value = Math.min(1.4, K.si / 2);
    if (hemi) { hemi.color.copy(K.hs); hemi.groundColor.copy(K.hg); hemi.intensity = K.hi; }
    if (key) { key.color.copy(K.sun); key.intensity = K.si; key.position.copy(dir).multiplyScalar(22); }
    if (fill) { fill.intensity = 0.25 * K.si; }
    fog.color.copy(K.hor);
    U.uTint.value = K.grass;
    V.scene.background = K.hor.clone();
  }
  const E = {
    schema: ENV_SCHEMA, root, ground, sky, floorY: 0,
    setOn(on) {
      if (on === S.on) return;
      S.on = on;
      if (on) { keep = capture(); V.scene.add(root); V.scene.fog = fog; if (shadowGround) shadowGround.visible = false; apply(); }
      else {
        if (root.parent) root.parent.remove(root);
        if (keep) {
          V.scene.background = keep.bg; V.scene.fog = keep.fog;
          if (hemi && keep.hemi) { hemi.color.copy(keep.hemi.c); hemi.groundColor.copy(keep.hemi.g); hemi.intensity = keep.hemi.i; }
          if (key && keep.key) { key.color.copy(keep.key.c); key.intensity = keep.key.i; key.position.copy(keep.key.p); }
          if (fill && keep.fill) { fill.color.copy(keep.fill.c); fill.intensity = keep.fill.i; }
        }
        if (shadowGround) shadowGround.visible = true;
      }
    },
    setTime(h) { S.time = ((+h % 24) + 24) % 24; apply(); },
    get on() { return S.on; },
    state() { return { schema: ENV_SCHEMA, on: S.on, time: +S.time.toFixed(2), label: label(S.time) } },
    /* jedes Bild: Kuppel und Nebel an die Kamera, damit nichts am Far-Plane abreißt */
    post() {
      if (!S.on) return;
      const cam = V.camera;
      sky.position.copy(cam.position);
      sky.scale.setScalar(cam.far * 0.85);
      fog.far = Math.min(140, cam.far * 0.7); fog.near = fog.far * 0.3;
    }
  };
  function label(t) { return t < 5 || t >= 21 ? 'Nacht' : t < 8 ? 'Morgen' : t < 16.5 ? 'Tag' : t < 19.5 ? 'Abendsonne' : 'Dämmerung'; }
  V.post.add(() => E.post());
  E.setTime(time);
  E.setOn(on);
  return E;
}
