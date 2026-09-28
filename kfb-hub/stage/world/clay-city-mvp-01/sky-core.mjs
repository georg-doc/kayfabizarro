/* KFB SKY-CORE-01 · shared sky adapter (World now, Resident Atlas later)
   Contract  kfb.sky-core/1:  mountSkyCore({ scene, camera, world? }) → { set(mode, variant), mode, variant, report() }
     BASIC        own, cheap: gradient dome (one draw call) + sun disc/glow + a ring of flat clay clouds
                  (one instanced draw call) + linear fog. Follows the camera, horizon never moves.
     TINY_SKIES   delegates to the existing World sky owner (wd-sky.js → tinyskies paintRadialSky presets
                  day/evening/night); no second TinySkies copy. Hosts without a World owner fall back to BASIC.
     KFB_UNIVERSE optional later tier (cards/dice/planets) — not mounted here, reported as 'not-mounted'.
   The watercolor dome of World r2 is no longer the default. */
import * as THREE from 'three';

export const SKY_CORE = Object.freeze({
  schema: 'kfb.sky-core/1', modes: ['BASIC', 'TINY_SKIES'], defaultMode: 'TINY_SKIES', defaultVariant: 'day',
  fog: { near: 150, far: 720 },
  basic: {
    day: { zenith: '#6fb2e0', horizon: '#cfe6ee', ground: '#9cbf73', sun: '#fff1c8', cloud: '#fff8ee' },
    evening: { zenith: '#5a6fb0', horizon: '#f6c7a4', ground: '#8aa06a', sun: '#ffd08a', cloud: '#ffe6d6' },
    night: { zenith: '#101a3a', horizon: '#34406e', ground: '#2b3a2e', sun: '#dfe8ff', cloud: '#6b7598' }
  }
});

const DOME_V = `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }`;
const DOME_F = `uniform vec3 uZen, uHor, uGnd, uSun, uSunDir; varying vec3 vDir;
void main(){ vec3 d = normalize(vDir); float h = d.y;
  vec3 c = h > 0.0 ? mix(uHor, uZen, pow(clamp(h,0.0,1.0), 0.55)) : mix(uHor, uGnd, clamp(-h*6.0,0.0,1.0));
  float s = max(dot(d, normalize(uSunDir)), 0.0);
  c += uSun * (pow(s, 900.0) * 1.6 + pow(s, 24.0) * 0.22);
  gl_FragColor = vec4(c, 1.0); }`;

function makeBasic(scene, camera) {
  const U = { uZen: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uGnd: { value: new THREE.Color() }, uSun: { value: new THREE.Color() }, uSunDir: { value: new THREE.Vector3(-0.45, 0.42, 0.55) } };
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.ShaderMaterial({ uniforms: U, vertexShader: DOME_V, fragmentShader: DOME_F, side: THREE.BackSide, depthWrite: false, fog: false }));
  dome.name = 'sky-core:basic-dome'; dome.frustumCulled = false; dome.renderOrder = -10;
  /* clouds: squashed icosahedra, one instanced mesh, parked on a ring 520–650 m out, 90–150 m up */
  const cg = new THREE.IcosahedronGeometry(1, 2); cg.scale(1, 0.42, 1);
  const cm = new THREE.MeshLambertMaterial({ color: '#ffffff', fog: false });
  const N = 26, clouds = new THREE.InstancedMesh(cg, cm, N); clouds.name = 'sky-core:basic-clouds'; clouds.frustumCulled = false;
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const M = new THREE.Matrix4(), q = new THREE.Quaternion();
  for (let i = 0; i < N; i++) { const a = (i / N) * Math.PI * 2 + rnd() * 0.2, r = 520 + rnd() * 130, s = 22 + rnd() * 30;
    M.compose(new THREE.Vector3(Math.cos(a) * r, 90 + rnd() * 60, Math.sin(a) * r), q, new THREE.Vector3(s * (1.4 + rnd()), s, s)); clouds.setMatrixAt(i, M); }
  const group = new THREE.Group(); group.name = 'sky-core:BASIC'; group.add(dome, clouds);
  group.onBeforeRender = () => {};
  dome.onBeforeRender = () => { const f = camera.far * 0.9; dome.scale.setScalar(f); group.position.set(camera.position.x, 0, camera.position.z); dome.position.y = camera.position.y; };
  scene.add(group);
  return {
    group, U,
    setVariant(v) { const P = SKY_CORE.basic[v] || SKY_CORE.basic.day; U.uZen.value.set(P.zenith); U.uHor.value.set(P.horizon); U.uGnd.value.set(P.ground); U.uSun.value.set(P.sun); cm.color.set(P.cloud); return P; },
    dispose() { scene.remove(group); dome.geometry.dispose(); dome.material.dispose(); cg.dispose(); cm.dispose(); }
  };
}

export function mountSkyCore({ scene, camera, world = null }) {
  let mode = null, variant = null, basic = null, last = null;
  const hideOwnerDomes = (on) => scene.traverse((o) => { if (/^sky:(dome|real)/.test(o.name)) o.visible = on; });
  async function set(nextMode = SKY_CORE.defaultMode, nextVariant = SKY_CORE.defaultVariant) {
    const m = String(nextMode).toUpperCase() === 'BASIC' || !world?.setSky ? 'BASIC' : 'TINY_SKIES';
    const v = ['day', 'evening', 'night'].includes(nextVariant) ? nextVariant : 'day';
    const t0 = performance.now();
    if (m === 'BASIC') {
      if (world?.setSky) { await world.setSky('aus'); hideOwnerDomes(false); }
      basic ||= makeBasic(scene, camera); basic.group.visible = true;
      const P = basic.setVariant(v);
      scene.background = new THREE.Color(P.horizon);
      if (scene.fog) scene.fog.color.set(P.horizon);
    } else {
      if (basic) basic.group.visible = false;
      await world.setSky('tiny:' + v);
    }
    if (scene.fog && scene.fog.isFog) { scene.fog.near = SKY_CORE.fog.near; scene.fog.far = SKY_CORE.fog.far; }
    mode = m; variant = v;
    last = { mode, variant, ms: Math.round(performance.now() - t0), owner: m === 'BASIC' ? 'sky-core BASIC (own)' : 'World wd-sky.js → tinyskies paintRadialSky', fog: scene.fog ? { color: '#' + scene.fog.color.getHexString(), near: scene.fog.near, far: scene.fog.far } : null, drawCalls: m === 'BASIC' ? 2 : 0 };
    document.body.dataset.skyCore = mode + ':' + variant;
    return last;
  }
  return { set, get mode() { return mode; }, get variant() { return variant; }, report: () => ({ schema: SKY_CORE.schema, modes: SKY_CORE.modes, ...last, kfbUniverse: 'not-mounted (optional tier)' }) };
}

/* small UI: one button cycling Tiny Tag → Tiny Abend → Basic */
export function mountSkyButton(sky) {
  const cycle = [['TINY_SKIES', 'day', 'Himmel: Tiny'], ['TINY_SKIES', 'evening', 'Himmel: Abend'], ['BASIC', 'day', 'Himmel: Basic']];
  let i = 0; const b = document.createElement('button');
  b.id = 'cc-sky'; b.type = 'button'; b.textContent = cycle[0][2];
  b.style.cssText = 'position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));z-index:85;border:1px solid #71563e55;border-radius:12px;background:#fff8ebdf;color:#443237;padding:8px 11px;font:700 12px system-ui;cursor:pointer;box-shadow:0 5px 24px #4e385033';
  b.onclick = async () => { i = (i + 1) % cycle.length; const [m, v, l] = cycle[i]; b.textContent = l; await sky.set(m, v); };
  document.body.appendChild(b);
  return b;
}
