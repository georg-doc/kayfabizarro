// V-619 · Niederschlag der endlosen Fahrt, Modul nach Host-Vertrag R1.2 §2 (eigene Umsetzung, Idee wie TinySkies-Regen mit Tropfen, V-092):
//   Regen bzw. Schnee (Schnee-Biom): EIN Draw Call, Instanz-Streifen in einem Kasten um die Kamera, Bewegung ganz im Vertex-Shader (fallen, Windzug aus
//   dem geteilten Wind, Umlauf im Kasten), Farbe = Nebelfarbe aufgehellt (kein eigenes Licht).
//   Tropfen auf dem Bildschirm: gemalte Knet-Tropfen (heller Körper, dunkle Unterkante, Glanzpunkt), entstehen nach Regenstärke (beim Fahren mehr),
//   rutschen nach unten und zur Seite (Fahrtwind), trocknen ab. Liegen vor der Kamera, ohne Tiefentest, ohne Nebel.
// amount(rain 0..1, snow 0|1) setzt der Host je Bild aus der Atmosphäre.
import * as THREE from 'three'
import { windUniforms, WIND } from './kfbWind.js'

export const weatherLog = { create: 0, update: 0, dispose: 0, drops: 0 }

const RAIN_VERT = `
uniform float uTime, uAmt, uSnow, uSpeed; uniform vec3 uCam, uBox; uniform vec2 uWindDir; uniform float uWindStr, uLen, uWid, uCarV;
attribute vec4 aSeed; varying float vA; varying vec2 vUv;
void main(){
  float fall = mix(9.5, 1.3, uSnow);                                            // m/s
  vec2 drift = uWindDir * uWindStr * mix(7.0, 3.0, uSnow);
  vec3 p = aSeed.xyz * uBox + vec3(drift.x, -fall, drift.y) * uTime + vec3(sin(uTime * 1.3 + aSeed.w * 30.0), 0.0, cos(uTime * 1.1 + aSeed.w * 21.0)) * uSnow * 0.6;
  p = mod(p - uCam + uBox * 0.5, uBox) - uBox * 0.5 + uCam;                    // Umlauf im Kasten um die Kamera
  vec3 vel = normalize(vec3(drift.x, -fall, drift.y));
  vec3 toCam = normalize(cameraPosition - p), side = normalize(cross(vel, toCam));
  float len = mix(uLen, uWid * 1.6, uSnow), wid = mix(uWid, uWid * 1.6, uSnow);
  vec3 wp = p + side * position.x * wid + vel * position.y * len;
  vA = step(aSeed.w, uAmt) * (1.0 - smoothstep(0.35, 0.5, length((p - uCam).xz) / uBox.x));
  vUv = position.xy + 0.5;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`
const RAIN_FRAG = `
uniform vec3 uCol; uniform float uSnow, uOpacity; varying float vA; varying vec2 vUv;
void main(){
  if (vA < 0.01) discard;
  vec2 q = vUv - 0.5; float m = uSnow > 0.5 ? 1.0 - smoothstep(0.32, 0.5, length(q)) : (1.0 - smoothstep(0.2, 0.5, abs(q.x))) * smoothstep(0.0, 0.25, vUv.y);
  gl_FragColor = vec4(uCol, m * vA * uOpacity);
  #include <colorspace_fragment>
}`
const DROP_VERT = `
attribute vec4 aDrop; attribute float aLife; varying vec2 vQ; varying float vL;
uniform vec2 uView;
void main(){ vQ = position.xy * 2.0; vL = aLife;
  vec2 c = (aDrop.xy * 2.0 - 1.0) * uView; float r = aDrop.z * uView.y; vec2 s = vec2(r, r * aDrop.w);
  gl_Position = projectionMatrix * vec4(c + position.xy * 2.0 * s, -1.0, 1.0); }`
const DROP_FRAG = `
uniform vec3 uBody, uRim; varying vec2 vQ; varying float vL;
void main(){
  vec2 q = vQ; q.y += 0.18 * q.x * q.x;                                          // leicht birnenförmig (Schwerkraft)
  float d = length(q), fw = fwidth(d) * 1.2 + 1e-3, m = 1.0 - smoothstep(1.0 - fw, 1.0 + fw, d);
  if (m < 0.01) discard;
  float rim = smoothstep(0.55, 0.95, d) * smoothstep(0.1, -0.6, q.y);               // dunkle Unterkante
  float hi = 1.0 - smoothstep(0.12, 0.2, length(q - vec2(-0.32, 0.38)));            // Glanzpunkt
  vec3 col = mix(uBody, uRim, rim * 0.8); col = mix(col, vec3(1.0), hi * 0.85);
  gl_FragColor = vec4(col, m * (0.34 + 0.4 * rim + 0.5 * hi) * vL);
  #include <colorspace_fragment>
}`

// options: { count = 7000, box = [44, 26, 44], drops = 40 }
export function createDriveWeather(options = {}) {
  weatherLog.create++
  const N = options.count ?? 7000, BOX = options.box ?? [44, 26, 44], ND = options.drops ?? 40
  const root = new THREE.Group(); root.name = 'drive-weather'
  // Regen/Schnee
  const q = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0), g = new THREE.InstancedBufferGeometry(); g.index = q.index; g.setAttribute('position', q.attributes.position); g.instanceCount = N
  const seed = new Float32Array(N * 4); let s = 12345; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647); for (let i = 0; i < N * 4; i++) seed[i] = rnd()
  g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 4))
  const RU = { uTime: { value: 0 }, uAmt: { value: 0 }, uSnow: { value: 0 }, uSpeed: { value: 0 }, uCam: { value: new THREE.Vector3() }, uBox: { value: new THREE.Vector3(...BOX) }, uLen: { value: 0.75 }, uWid: { value: 0.022 }, uCarV: { value: 0 },
    uCol: { value: new THREE.Color('#dfe6ee') }, uOpacity: { value: 0.42 }, uWindDir: windUniforms.uWindDir, uWindStr: windUniforms.uWindStr }
  const rainMat = new THREE.ShaderMaterial({ uniforms: RU, vertexShader: RAIN_VERT, fragmentShader: RAIN_FRAG, transparent: true, depthWrite: false, fog: false })
  const rain = new THREE.Mesh(g, rainMat); rain.frustumCulled = false; rain.name = 'rain'; rain.renderOrder = 5; rain.visible = false; root.add(rain)
  // Tropfen auf dem Bildschirm (Kamera-Raum, ohne Tiefentest)
  const dq = new THREE.PlaneGeometry(1, 1), dg = new THREE.InstancedBufferGeometry(); dg.index = dq.index; dg.setAttribute('position', dq.attributes.position); dg.instanceCount = 0
  const dA = new Float32Array(ND * 4), dL = new Float32Array(ND), aDrop = new THREE.InstancedBufferAttribute(dA, 4), aLife = new THREE.InstancedBufferAttribute(dL, 1); aDrop.setUsage(THREE.DynamicDrawUsage); aLife.setUsage(THREE.DynamicDrawUsage)
  dg.setAttribute('aDrop', aDrop); dg.setAttribute('aLife', aLife)
  const DU = { uView: { value: new THREE.Vector2(1, 1) }, uBody: { value: new THREE.Color('#e9f1f6') }, uRim: { value: new THREE.Color('#5a6a7c') } }
  const dropMat = new THREE.ShaderMaterial({ uniforms: DU, vertexShader: DROP_VERT, fragmentShader: DROP_FRAG, transparent: true, depthTest: false, depthWrite: false, fog: false })
  const dropMesh = new THREE.Mesh(dg, dropMat); dropMesh.frustumCulled = false; dropMesh.renderOrder = 1000; dropMesh.name = 'screen-drops'; dropMesh.matrixAutoUpdate = false; root.add(dropMesh)
  const drops = []; let spawnAcc = 0, amt = 0, snow = 0, speed = 0, sideK = 0
  function setAmount(rainAmt, snowOn, { color, speed: v = 0, side = 0 } = {}) { amt = rainAmt; snow = snowOn ? 1 : 0; speed = v; sideK = side; if (color) { RU.uCol.value.copy(color).lerp(new THREE.Color(1, 1, 1), 0.45); DU.uBody.value.copy(color).lerp(new THREE.Color(1, 1, 1), 0.6); DU.uRim.value.copy(color).multiplyScalar(0.45) } }
  function stepDrops(dt) {
    if (amt > 0.15 && !snow) { spawnAcc += dt * amt * (2.2 + Math.min(4, speed / 6)); while (spawnAcc > 1 && drops.length < ND) { spawnAcc -= 1; weatherLog.drops++
      drops.push({ x: Math.random(), y: 0.25 + 0.75 * Math.random(), r: 0.012 + 0.03 * Math.random() ** 2, a: 1 + 0.25 * Math.random(), life: 1, dry: 3 + 4 * Math.random(), vy: 0, stick: 0.4 + 1.6 * Math.random() }) } } else spawnAcc = 0
    for (const d of drops) { d.stick -= dt; if (d.stick < 0) { d.vy = Math.min(0.35, d.vy + dt * (0.06 + d.r * 4)); d.y -= d.vy * dt; d.a = Math.min(1.9, d.a + dt * 0.4) }
      d.x += (d.x - 0.5) * dt * speed * 0.012 + sideK * dt * 0.05; d.life -= dt / d.dry }
    for (let i = drops.length - 1; i >= 0; i--) if (drops[i].life <= 0 || drops[i].y < -0.1 || drops[i].x < -0.1 || drops[i].x > 1.1) drops.splice(i, 1)
    drops.forEach((d, i) => { dA[i * 4] = d.x; dA[i * 4 + 1] = d.y; dA[i * 4 + 2] = d.r; dA[i * 4 + 3] = d.a; dL[i] = Math.min(1, d.life * 3) })
    dg.instanceCount = drops.length; aDrop.needsUpdate = true; aLife.needsUpdate = true
  }
  return {
    object3d: root, setAmount,
    info: () => ({ rain: +amt.toFixed(2), snow, drops: drops.length, streaks: Math.round(N * amt), visible: rain.visible }),
    update(dt, ctx) { weatherLog.update++; RU.uTime.value += dt
      const cam = ctx?.camera; if (cam) { RU.uCam.value.copy(cam.position)
        // Tropfen-Ebene: Kamera-Raum (Projektionsmatrix der Kamera, z = −1), Ausdehnung = halbe Bildbreite/-höhe bei z = 1
        dropMesh.matrix.copy(cam.matrixWorld); dropMesh.matrixWorld.copy(cam.matrixWorld); const ty = Math.tan((cam.fov || 50) * Math.PI / 360); DU.uView.value.set(ty * (cam.aspect || 1.6), ty) }
      RU.uAmt.value = amt; RU.uSnow.value = snow; rain.visible = amt > 0.01
      stepDrops(dt) },
    dispose() { weatherLog.dispose++; g.dispose(); q.dispose(); dg.dispose(); dq.dispose(); rainMat.dispose(); dropMat.dispose(); root.clear() },
  }
}
