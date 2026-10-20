// ============================================================================
// skydome-shader.js — KFB Terrain + Skydome v3 (WebGL sky, full variant set)
// ----------------------------------------------------------------------------
// The animated shader sky + the RC-v11 image/gradient skies, all ported to
// classic WebGL on a BackSide dome that follows the camera. Variants:
//
//  PROCEDURAL (animated, seam-free, cheap):
//   'S'     — Sphere shader: domain-warped 4-octave fbm nebula, mood ramp, flow ribbons.
//   'A'     — Waber: kaleidoscopically FOLDED domain-warped noise (multi-fold → no pole pinch).
//   'space' — deep space: gradient dome + drifting nebula + a 1800-point star field (twinkle).
//
//  STATIC equirect textures (raw, Kenney + watercolor), shared dome, map swap:
//   'watercolor' 'watercolor2' 'starfield' 'night' 'morning' 'day' 'alien'
//
//  (Raymarch fractals 'B'/'L' intentionally dropped — WebGL core, brief §Fällt.)
//
// Drive: phase/energy/beat integrate → evolves, never loops. Colour: colA/B/C
// from the active palette (story palettes). Per-mode feel via setMode(i).
// worldMix + exposure. Independent hypno-spiral overlay. Bloom discipline:
// emission modest so cards stay readable; only the beat accent lifts.
// ============================================================================

import * as THREE from 'three';

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/media/3D_Assets/Textures/Skyboxes/';
const STATIC = {
  watercolor:  { file: 'skydome_a.webp',   repeat: 2 },
  watercolor2: { file: 'skydome_b.webp',   repeat: 2 },
  starfield:   { file: 'skybox-space.png',  repeat: 1 },
  night:       { file: 'skybox-night.png',  repeat: 1 },
  morning:     { file: 'skybox-morning.png', repeat: 1 },
  day:         { file: 'skybox-day.png',    repeat: 1 },
  alien:       { file: 'skybox-alien.png',  repeat: 1 },
};
const PROC = { S: 0, A: 1, space: 2 };

const MODE_FEEL = [
  { warp: 0.7, twist: 0.35, contrast: 0.8, flow: 0.5 },
  { warp: 1.1, twist: 0.60, contrast: 1.1, flow: 1.4 },
  { warp: 1.7, twist: 0.95, contrast: 1.4, flow: 1.7 },
  { warp: 1.0, twist: 0.45, contrast: 1.5, flow: 1.1 },
  { warp: 0.9, twist: 0.50, contrast: 0.9, flow: 0.7 },
  { warp: 1.5, twist: 0.80, contrast: 1.6, flow: 1.3 },
];

const GLSL_NOISE = /* glsl */`
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float fbm(vec3 p){
    float s=snoise(p)*0.5;
    s+=snoise(p*2.03+11.7)*0.25;
    s+=snoise(p*4.11+23.3)*0.125;
    s+=snoise(p*8.07+47.1)*0.0625;
    return s;
  }
`;

const PROC_VERT = /* glsl */`
  varying vec3 vDir;
  void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const PROC_FRAG = /* glsl */`
  uniform float uVariant, uPhase, uEnergy, uBeat, uWorldMix, uExposure;
  uniform vec3 uColA, uColB, uColC;
  uniform float uSphWarp, uContrast, uFlow, uSpeed;
  uniform float uScale, uTwist; uniform vec3 uFoldOff;
  varying vec3 vDir;
  ${GLSL_NOISE}
  vec3 rotY(vec3 q, float a){ float c=cos(a), s=sin(a); return vec3(q.x*c - q.z*s, q.y, q.x*s + q.z*c); }
  // S — nebula. Lower base frequency than v3.0 → LARGER cloud folds (brief: "nebel zu kleinflächig").
  vec3 skyS(vec3 dir){
    float ph = uPhase;
    vec3 w = vec3(
      fbm(dir*0.75 + ph*0.5),
      fbm(dir*0.75 + ph*0.5 + 5.2),
      fbm(dir*0.75 - ph*0.35 + 9.1)
    ) * uSphWarp;
    vec3 warped = dir*0.7 + w;
    float field = fbm(warped*0.95 + ph*0.4);
    float detail = fbm(warped*2.6 - ph*0.7);
    float t1 = field*0.5*uContrast + 0.5;
    vec3 col = mix(uColA, uColB, smoothstep(0.15,0.62,t1));
    col = mix(col, uColC, smoothstep(0.55,0.96, t1 + detail*0.18));
    float ribbon = sin(ph*3.0*uFlow + field*6.283 + dir.y*3.5)*0.5+0.5;
    float beam = pow(ribbon,3.0)*(uSpeed*0.7+0.12);
    col += uColC*beam;
    float h = dir.y*0.5+0.5;
    col *= mix(0.7,1.18,h);
    return col;
  }
  // A — folded noise. MULTI-fold (3 folds + 2 rotations, RC-v11 lineage) with an off-axis warp
  // so the fold planes don't converge on the view axis → kills the central pinch/seam.
  vec3 skyA(vec3 dir){
    float ph = uPhase;
    vec3 q = dir*uScale;
    q += vec3(fbm(q*0.6 + ph*0.4), fbm(q*0.6 + 4.1 - ph*0.3), fbm(q*0.6 + 8.7)) * (uTwist*0.5);  // vector warp breaks symmetry
    q = abs(q) - uFoldOff;              q = rotY(q, uTwist);
    q = abs(q) - uFoldOff*0.7;          q = rotY(q, uTwist*-1.3);
    q = abs(q) - uFoldOff*0.5;
    float n = fbm(q + ph);
    float rmp = clamp(n*0.5+0.5 + uEnergy*0.25, 0.0, 1.0);
    vec3 col = mix(uColA,uColB, smoothstep(0.22,0.66,rmp));
    col = mix(col,uColC, smoothstep(0.70,0.99,rmp));
    float land = mix(1.0, smoothstep(0.5,-0.55,dir.y), uWorldMix);
    col *= land*0.4+0.6;
    float beatPop = uBeat*uBeat*smoothstep(0.2,0.9, n*0.5+0.5);
    col += uColC*beatPop*1.2;
    col += uColA*0.05;
    float h = dir.y*0.5+0.5;
    col *= mix(0.82,1.12,h);
    return col;
  }
  // space — brighter deep-space: indigo→violet gradient + visible drifting nebula (reads even at
  // horizon level where terrain fills the lower half). Stars are a separate additive mesh.
  vec3 skySpace(vec3 dir){
    float fy = dir.y*0.5+0.5;
    vec3 base = mix(vec3(0.10,0.09,0.22), vec3(0.03,0.04,0.10), smoothstep(0.0,1.0,fy));
    float neb = snoise(dir*1.6)*0.5+0.5;
    float neb2 = snoise(dir*3.4 + vec3(9.0,2.0,5.0))*0.5+0.5;
    float cloud = pow(neb*neb2, 1.7);
    vec3 nebCol = mix(vec3(0.32,0.12,0.42), vec3(0.10,0.22,0.40), neb);
    return base + nebCol*cloud*0.9;
  }
  void main(){
    vec3 dir = normalize(vDir);
    vec3 col;
    if (uVariant < 0.5) col = skyS(dir) * uExposure;
    else if (uVariant < 1.5) col = skyA(dir) * uExposure;
    else col = skySpace(dir);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const SPIRAL_FRAG = /* glsl */`
  uniform float uSpiralArms, uSpiralFreq, uSpiralRot, uSpiralAmt;
  varying vec3 vDir;
  void main(){
    vec3 dir = normalize(vDir);
    float az = atan(dir.z, dir.x);
    float el = acos(clamp(dir.y,-1.0,1.0));
    float phase = az*uSpiralArms + el*uSpiralFreq - uSpiralRot;
    float band = smoothstep(0.46,0.54, sin(phase)*0.5+0.5);
    gl_FragColor = vec4(0.0,0.0,0.0, band*uSpiralAmt);
  }
`;

const STAR_VERT = /* glsl */`
  attribute float aTw; attribute float aSz; attribute float aWarm;
  uniform float uTime;
  varying float vTw; varying float vWarm;
  void main(){
    vTw = sin(uTime*0.8 + aTw)*0.35 + 0.6;
    vWarm = aWarm;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSz * (320.0 / max(-mv.z, 1.0));
    gl_Position = projectionMatrix * mv;
  }
`;
const STAR_FRAG = /* glsl */`
  varying float vTw; varying float vWarm;
  void main(){
    float r = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.26, r);
    vec3 col = mix(vec3(0.66,0.76,1.0), vec3(1.0,0.9,0.72), vWarm);
    gl_FragColor = vec4(col*vTw, mask*vTw);
  }
`;

const STATIC_VERT = /* glsl */`
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const STATIC_FRAG = /* glsl */`
  uniform sampler2D uMap; uniform vec3 uTint; uniform float uTintAmt, uBright, uRepeat;
  varying vec2 vUv;
  void main(){
    vec3 base = texture2D(uMap, vec2(vUv.x*uRepeat, vUv.y)).rgb;
    vec3 tinted = mix(base, base*(uTint*2.0), uTintAmt);
    gl_FragColor = vec4(tinted*uBright, 1.0);
  }
`;

function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function createSkydome(opts = {}) {
  const T = opts.THREE || THREE;
  const radius = opts.radius || 1400;
  const group = new T.Group();
  let mode = opts.mode == null ? 3 : opts.mode;
  const feel = MODE_FEEL[mode] || MODE_FEEL[3];

  // ---- procedural dome (S / A / space) ----
  const U = {
    uVariant: { value: PROC[opts.variant] != null ? PROC[opts.variant] : 0 },
    uPhase: { value: 0 }, uEnergy: { value: 0.4 }, uBeat: { value: 0 },
    uWorldMix: { value: opts.worldMix == null ? 0.4 : opts.worldMix },
    uExposure: { value: opts.exposure == null ? 0.85 : opts.exposure },
    uColA: { value: new T.Color(0.14, 0.05, 0.02) }, uColB: { value: new T.Color(0.86, 0.42, 0.12) }, uColC: { value: new T.Color(1.0, 0.86, 0.52) },
    uSphWarp: { value: feel.warp }, uContrast: { value: feel.contrast }, uFlow: { value: feel.flow }, uSpeed: { value: 0 },
    uScale: { value: 0.9 }, uTwist: { value: feel.twist }, uFoldOff: { value: new T.Vector3(0.92, 1.08, 0.92) },
  };
  const procMat = new T.ShaderMaterial({ uniforms: U, vertexShader: PROC_VERT, fragmentShader: PROC_FRAG, side: T.BackSide, depthWrite: false, fog: false });
  const procMesh = new T.Mesh(new T.SphereGeometry(radius, 64, 40), procMat);
  procMesh.frustumCulled = false; procMesh.renderOrder = -2;
  group.add(procMesh);

  // ---- star field (only for 'space') ----
  const STARN = 1800;
  const sgeo = new T.BufferGeometry();
  const spos = new Float32Array(STARN * 3), stw = new Float32Array(STARN), ssz = new Float32Array(STARN), swarm = new Float32Array(STARN);
  const rng = mulberry(4242), SR = radius * 0.93;
  for (let i = 0; i < STARN; i++) {
    const u = rng() * 2 - 1, th = rng() * Math.PI * 2, r = Math.sqrt(1 - u * u);
    spos[i * 3] = Math.cos(th) * r * SR; spos[i * 3 + 1] = u * SR; spos[i * 3 + 2] = Math.sin(th) * r * SR;
    stw[i] = rng() * 6.28; ssz[i] = 2.5 + rng() * rng() * 9; swarm[i] = Math.sin(stw[i] * 1.7) * 0.5 + 0.5;
  }
  sgeo.setAttribute('position', new T.BufferAttribute(spos, 3));
  sgeo.setAttribute('aTw', new T.BufferAttribute(stw, 1));
  sgeo.setAttribute('aSz', new T.BufferAttribute(ssz, 1));
  sgeo.setAttribute('aWarm', new T.BufferAttribute(swarm, 1));
  const starU = { uTime: { value: 0 } };
  const starMat = new T.ShaderMaterial({ uniforms: starU, vertexShader: STAR_VERT, fragmentShader: STAR_FRAG, transparent: true, depthWrite: false, depthTest: false, blending: T.AdditiveBlending });
  const stars = new T.Points(sgeo, starMat);
  stars.frustumCulled = false; stars.renderOrder = -1; stars.visible = false;
  group.add(stars);

  // ---- spiral overlay (independent) ----
  const SU = { uSpiralArms: { value: 10.0 }, uSpiralFreq: { value: 12.0 }, uSpiralRot: { value: 0 }, uSpiralAmt: { value: opts.spiralAmt == null ? 0.45 : opts.spiralAmt } };
  const spiralMat = new T.ShaderMaterial({ uniforms: SU, vertexShader: PROC_VERT, fragmentShader: SPIRAL_FRAG, side: T.BackSide, transparent: true, depthWrite: false, fog: false });
  const spiralMesh = new T.Mesh(new T.SphereGeometry(radius * 0.985, 64, 40), spiralMat);
  spiralMesh.frustumCulled = false; spiralMesh.renderOrder = 0; spiralMesh.visible = !!opts.spiral;
  group.add(spiralMesh);
  let spiralSpeed = opts.spiralSpeed == null ? 0.8 : opts.spiralSpeed;

  // ---- static equirect dome (watercolor / Kenney) — EXACT rollercoaster-v11 recipe:
  // MeshBasicMaterial (unlit, colour-managed) on a BackSide sphere r=700, y+40, SRGB texture,
  // wrapS=Repeat with repeat.x = cfg.repeat (Aquarell is a half-panorama ×2, Kenney full equirect ×1).
  // Own radius (700) so it is NOT the far 1400 shell — stays crisp and matches RC feel/scale.
  const loader = new T.TextureLoader(); loader.setCrossOrigin('anonymous');
  const texCache = {};
  function tex(key) {
    if (!texCache[key]) {
      const cfg = STATIC[key] || STATIC.watercolor;
      const t = loader.load(RAW + cfg.file);
      t.colorSpace = T.SRGBColorSpace; t.wrapS = T.RepeatWrapping; t.repeat.set(cfg.repeat || 1, 1);
      texCache[key] = t;
    }
    return texCache[key];
  }
  const staticMat = new T.MeshBasicMaterial({ side: T.BackSide, fog: false, depthWrite: false });
  staticMat.color.setScalar(opts.brightness == null ? 1 : opts.brightness);
  const staticMesh = new T.Mesh(new T.SphereGeometry(700, 60, 40), staticMat);
  staticMesh.position.y = 40;
  staticMesh.rotation.y = Math.PI / 2;   // both ×2 wrap-seams to the sides, out of the forward view
  staticMesh.frustumCulled = false; staticMesh.renderOrder = -2; staticMesh.visible = false;
  group.add(staticMesh);

  let variant = opts.variant || 'S';
  let _phase = 0, _beatEnv = 0, _speed = 0, _t = 0, _worldBase = U.uWorldMix.value, autoWaver = opts.autoWaver !== false;

  function applyVariant() {
    const proc = PROC[variant] != null;
    procMesh.visible = proc;
    stars.visible = (variant === 'space');
    staticMesh.visible = !proc;
    if (proc) U.uVariant.value = PROC[variant];
    else { staticMat.map = tex(variant); staticMat.needsUpdate = true; }
  }
  applyVariant();

  return {
    name: 'skydome-shader', group,
    follow(camera) { if (camera) group.position.copy(camera.position); },
    setVariant(v) { variant = (PROC[v] != null || STATIC[v]) ? v : 'S'; applyVariant(); },
    getVariant() { return variant; },
    setPalette(stops) {
      if (!stops || stops.length < 3) return;
      U.uColA.value.setRGB(stops[0][0], stops[0][1], stops[0][2]);
      U.uColB.value.setRGB(stops[1][0], stops[1][1], stops[1][2]);
      U.uColC.value.setRGB(stops[2][0], stops[2][1], stops[2][2]);
    },
    setMode(i) {
      mode = ((i % 6) + 6) % 6;
      const f = MODE_FEEL[mode];
      U.uSphWarp.value = f.warp; U.uTwist.value = f.twist; U.uContrast.value = f.contrast; U.uFlow.value = f.flow;
    },
    setWorldMix(x) { _worldBase = x; U.uWorldMix.value = x; },
    setExposure(x) { U.uExposure.value = x; },
    setAutoWaver(on) { autoWaver = !!on; },
    setSpiral(on) { spiralMesh.visible = !!on; },
    setSpiralAmt(v) { SU.uSpiralAmt.value = v; },
    setSpiralSpeed(v) { spiralSpeed = v; },
    setTint() { /* RC-static dome is colour-managed 1:1; no tint */ },
    setBrightness(b) { staticMat.color.setScalar(b); },
    horizonColor() {
      const a = U.uColA.value, b = U.uColB.value, c = U.uColC.value;
      if (variant === 'space' || variant === 'starfield' || variant === 'night') return new T.Color(0.03, 0.035, 0.07);
      // bright, mid/glow-leaning (NOT the muddy A+B+C average) → residual haze reads as a light
      // palette tint, not brown. The depth-blur does the real per-pixel sky matching.
      const k = 1.04;
      return new T.Color(
        (a.r * 0.10 + b.r * 0.55 + c.r * 0.35) * k,
        (a.g * 0.10 + b.g * 0.55 + c.g * 0.35) * k,
        (a.b * 0.10 + b.b * 0.55 + c.b * 0.35) * k,
      );
    },
    update(dt, audio) {
      _t += dt;
      const energy = audio && typeof audio.energy === 'number' ? audio.energy : 0.4;
      U.uEnergy.value += (energy - U.uEnergy.value) * Math.min(1, dt * 4);
      const beat = audio && typeof audio.beat === 'number' ? audio.beat : 0;
      _beatEnv = Math.max(_beatEnv * Math.exp(-dt * 5.5), beat);
      U.uBeat.value += (_beatEnv - U.uBeat.value) * Math.min(1, dt * 12);
      _phase += dt * (0.05 + U.uEnergy.value * 0.5 + U.uBeat.value * 0.08);
      U.uPhase.value = _phase;
      _speed += (U.uEnergy.value - _speed) * Math.min(1, dt * 3);
      U.uSpeed.value = _speed;
      starU.uTime.value = _t;
      SU.uSpiralRot.value += dt * (spiralSpeed + U.uBeat.value * 1.5 + _speed * 1.2);
      if (autoWaver) U.uWorldMix.value = Math.max(0, Math.min(1, _worldBase + Math.sin(_phase * 0.9) * 0.28));
    },
    dispose(scene) {
      group.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      if (scene) scene.remove(group);
    },
  };
}
