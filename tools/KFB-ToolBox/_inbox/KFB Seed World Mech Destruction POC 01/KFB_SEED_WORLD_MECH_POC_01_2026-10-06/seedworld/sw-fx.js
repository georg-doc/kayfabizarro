/* KFB Seed World · POC 01 · weapon FX: camera-facing energy streaks (tracers, muzzle cones, rocket exhaust, impact sparks),
   ejected brass, muzzle light. All pooled, fixed caps, one draw call per streak family. */
import * as THREE from 'three';

const VS = `
uniform float uTaper;
attribute float aFade;
varying vec2 vUv; varying float vA;
void main() {
  vec3 p = instanceMatrix[3].xyz, d = instanceMatrix[2].xyz; float len = length(d); d /= max(len, 1e-4);
  float w = instanceMatrix[0].x;
  vec3 side = normalize(cross(d, normalize(cameraPosition - p)) + vec3(1e-5));
  vec3 wp = p + d * (position.y * len) + side * position.x * w * mix(1.0, uTaper, uv.y);
  vUv = uv; vA = aFade;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`;
const FS = `
uniform vec3 uCore, uGlow; uniform float uMode;
varying vec2 vUv; varying float vA;
void main() {
  if (uMode > 1.5) {
    float r = length(vUv - 0.5) * 2.0, g = smoothstep(1.0, 0.0, r), c = smoothstep(0.38, 0.0, r);
    float a = (g * g * 0.8 + c) * vA;
    gl_FragColor = vec4((uGlow * g * g + uCore * c) * a, 1.0); return;
  }
  float x = abs(vUv.x - 0.5) * 2.0, y = vUv.y;
  float core = smoothstep(0.45, 0.0, x), glow = (1.0 - x) * (1.0 - x);
  float tail = smoothstep(0.0, 0.85, y) * smoothstep(1.0, 0.94, y);
  float cone = smoothstep(0.0, 0.1, y) * (1.0 - y) * 1.6;
  float a = (glow * 1.1 + core) * mix(tail, cone, uMode) * vA;
  gl_FragColor = vec4((uGlow * glow + uCore * core) * a, 1.0);
}`;

function streaks(cap, o) {
  const geo = new THREE.PlaneGeometry(1, 1), fade = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1);
  geo.setAttribute('aFade', fade);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uCore: { value: new THREE.Color(o.core) }, uGlow: { value: new THREE.Color(o.glow) }, uTaper: { value: o.taper ?? 1 }, uMode: { value: o.mode ?? 0 } },
    vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor
  });
  const mesh = new THREE.InstancedMesh(geo, mat, cap); mesh.count = 0; mesh.frustumCulled = false; mesh.renderOrder = 25;
  const M = new THREE.Matrix4(), e = M.elements; let n = 0;
  return {
    mesh,
    begin() { n = 0; },
    push(c, d, len, w, a) {
      if (n >= cap) return;
      e.fill(0); e[0] = w; e[8] = d.x * len; e[9] = d.y * len; e[10] = d.z * len; e[12] = c.x; e[13] = c.y; e[14] = c.z; e[15] = 1;
      mesh.setMatrixAt(n, M); fade.array[n] = a; n++;
    },
    end() { mesh.count = n; mesh.instanceMatrix.needsUpdate = true; fade.needsUpdate = true; },
    get n() { return n; }
  };
}

export const FXCAPS = { tracers: 128, flares: 48, sparks: 160, dots: 160, casings: 96 };

export function createWeaponFX({ scene, camera, groundAt }) {
  const tr = streaks(FXCAPS.tracers, { core: '#fffbea', glow: '#ff9426', taper: 0.55, mode: 0 });
  const fl = streaks(FXCAPS.flares, { core: '#fff4cf', glow: '#ff6a12', taper: 0.3, mode: 1 });
  const sp = streaks(FXCAPS.sparks, { core: '#fff1bd', glow: '#ffae3d', taper: 0.2, mode: 0 });
  const dt2 = streaks(FXCAPS.dots, { core: '#fffbe6', glow: '#ff8a1e', mode: 2 });
  const CU = new THREE.Vector3(), flashes = Array.from({ length: 24 }, () => ({ on: false, p: new THREE.Vector3(), age: 0, life: 0, s: 1 })); let fi = 0;
  const casingMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.13, 6).rotateZ(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#d4a94e', metalness: 0.85, roughness: 0.32 }), FXCAPS.casings);
  casingMesh.count = 0; casingMesh.frustumCulled = false;
  const light = new THREE.PointLight('#ffb15c', 0, 16, 2);
  scene.add(tr.mesh, fl.mesh, sp.mesh, dt2.mesh, casingMesh, light);

  const V = new THREE.Vector3(), C = new THREE.Vector3(), R = new THREE.Vector3(), M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), ONE = new THREE.Vector3(1, 1, 1);
  const sparks = Array.from({ length: FXCAPS.sparks }, () => ({ on: false, p: new THREE.Vector3(), v: new THREE.Vector3(), age: 0, life: 0 }));
  const casings = Array.from({ length: FXCAPS.casings }, () => ({ on: false, p: new THREE.Vector3(), v: new THREE.Vector3(), q: new THREE.Quaternion(), w: new THREE.Vector3(), age: 0 }));
  let si = 0, ci = 0, lightT = 0;
  const stats = { sparks: 0, casings: 0 };

  return {
    meshes: [tr.mesh, fl.mesh, sp.mesh, dt2.mesh, casingMesh], light, stats,
    /* call once per frame before any push */
    begin(dt) {
      tr.begin(); fl.begin(); sp.begin(); dt2.begin();
      CU.set(0, 1, 0).applyQuaternion(camera.quaternion);
      for (const f of flashes) { if (!f.on) continue; f.age += dt; if (f.age > f.life) { f.on = false; continue; } const k = 1 - f.age / f.life; dt2.push(f.p, CU, f.s * (0.6 + 0.4 * k), f.s * (0.6 + 0.4 * k), k * 1.3); }
      lightT = Math.max(0, lightT - dt); light.intensity = lightT > 0 ? 70 + Math.random() * 60 : 0;
      let ns = 0;
      for (const s of sparks) {
        if (!s.on) continue;
        s.age += dt; if (s.age > s.life) { s.on = false; continue; }
        s.v.y -= 16 * dt; s.v.multiplyScalar(Math.exp(-2.5 * dt)); s.p.addScaledVector(s.v, dt);
        const sp2 = s.v.length(), k = 1 - s.age / s.life;
        V.copy(s.v).divideScalar(sp2 || 1); C.copy(s.p).addScaledVector(V, -Math.min(0.9, sp2 * 0.03) / 2);
        sp.push(C, V, Math.min(0.9, sp2 * 0.03) + 0.05, 0.05 + 0.03 * k, k * k * 1.4); ns++;
      }
      stats.sparks = ns;
      let nc = 0;
      for (const c of casings) {
        if (!c.on) continue;
        c.age += dt; if (c.age > 2.2) { c.on = false; continue; }
        c.v.y -= 22 * dt; c.p.addScaledVector(c.v, dt);
        Q.setFromEuler(E.set(c.w.x * dt, c.w.y * dt, c.w.z * dt)); c.q.multiply(Q);
        const g = groundAt(c.p.x, c.p.z) + 0.03;
        if (c.p.y < g) { c.p.y = g; c.v.y = Math.abs(c.v.y) * 0.3; c.v.x *= 0.5; c.v.z *= 0.5; c.w.multiplyScalar(0.5); }
        M4.compose(c.p, c.q, ONE); casingMesh.setMatrixAt(nc++, M4);
      }
      casingMesh.count = nc; casingMesh.instanceMatrix.needsUpdate = true; stats.casings = nc;
    },
    end() { tr.end(); fl.end(); sp.end(); dt2.end(); },
    dot(p, size, a = 1) { dt2.push(p, CU, size, size, a); },
    /* head = bullet tip, d = unit direction */
    tracer(head, d, len, w = 0.12, a = 1) { C.copy(head).addScaledVector(d, -len / 2); tr.push(C, d, len, w, a); },
    /* base at p, cone along d */
    flare(p, d, len, w, a = 1) { C.copy(p).addScaledVector(d, len / 2); fl.push(C, d, len, w, a); },
    muzzleLight(p, t = 0.06) { light.position.copy(p); lightT = Math.max(lightT, t); },
    impact(p, n, d, count = 6, speed = 1) {
      // reflect the incoming direction about the surface normal, then scatter
      R.copy(d).addScaledVector(n, -2 * d.dot(n)).normalize();
      const f = flashes[fi]; fi = (fi + 1) % flashes.length; f.on = true; f.age = 0; f.life = 0.07 + Math.random() * 0.05; f.s = (0.9 + Math.random() * 0.7) * speed; f.p.copy(p).addScaledVector(n, 0.15);
      for (let k = 0; k < count; k++) {
        const s = sparks[si]; si = (si + 1) % sparks.length;
        s.on = true; s.age = 0; s.life = 0.14 + Math.random() * 0.26;
        s.p.copy(p).addScaledVector(n, 0.05);
        s.v.copy(R).multiplyScalar(0.6).addScaledVector(n, 0.5).add(V.set(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).multiplyScalar(1.1)).normalize().multiplyScalar((7 + Math.random() * 16) * speed);
      }
    },
    eject(p, right, up, carry) {
      const c = casings[ci]; ci = (ci + 1) % casings.length;
      c.on = true; c.age = 0; c.p.copy(p);
      c.v.copy(right).multiplyScalar(2.6 + Math.random() * 1.6).addScaledVector(up, 2.2 + Math.random() * 1.4).add(carry);
      c.q.set(Math.random(), Math.random(), Math.random(), Math.random()).normalize();
      c.w.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
    },
    active: () => sparks.filter((s) => s.on).length + casings.filter((c) => c.on).length
  };
}
