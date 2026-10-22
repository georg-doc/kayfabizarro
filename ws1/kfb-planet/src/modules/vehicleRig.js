// Fahrzeug-Rigging R1a (V-481, Georg 18.10.) · Antrieb als Daten + EIN Modul für alle Racer: je Anker aus kfb-vehicle-rig.json (thrust | fan; später
// antigrav | exhaust | weapon | light) ein pulsierender Antrieb, skaliert nach Düsengröße, Farbe aus dem Fahrzeug (glow.core/plume/spark).
//   thrust · heißer Kern (Scheibe) + Fahne (offener Kegel, additiv, Längs-Verlauf, Flackern, Schockdiamanten bei Vollgas), Länge = Schub
//   fan    · drehende Lüfterscheibe (Flügel-Muster im Shader) + Glühring, Drehzahl = Schub
//   Funken · ein gemeinsamer Punkt-Pool (Backfire beim Gaswegnehmen, Schaltknall, Bremsen), feste Obergrenze
// Ein Motormodell (Drehzahl, Gänge) treibt Pulsieren, Schaltstoß (kurz Schub weg, dann Stoß) und Backfire – dieselben Werte gehen an Klang und Deformer
// (surge: Stauchen → Strecken → Nachschwingen, über die Gruppe `stretch`, an der Modell und Anker gemeinsam hängen: die Fahnen bleiben an den Düsen).
// Leistung: keine Lichter (ein Licht-Rig, V-385/V-429), kein Nachbearbeitungs-Bloom; Leuchten über additive Materialien ohne Tonemapping im Kern;
// je Düse 2 Draw Calls, Funken 1 Draw Call je Fahrzeug, keine Allokation im Bild. Modul nach Host-Vertrag R1.2.
// Bodennähe-Partikel (Georg 18.10.): an den Schwebe-Ankern (kfb_hover_*) wirbelt der Racer in Bodennähe Staub und Krumen in der Geländefarbe auf, Stärke nach
// Höhe über Grund und Tempo, blendet mit der Höhe aus (gleicher Layer für alle Fahrzeuge); Farbe je Untergrund über groundColorAt(x, z) (Terraintyp). Weltraum-Pool `world` (der Wirt hängt ihn in die Szene), normal geblendet.
// options: { anchors, hover?: [[x,y,z]…] (GLB-Raum), glow: { core, plume, spark }, unit (m je GLB-Einheit), engine?: ENGINE-Teilwerte, seed }
import * as THREE from 'three'

export const VEHICLE_RIG_SCHEMA = 'kfb.vehicle-rig/1'
export const ENGINE = Object.freeze({ gears: 5, upshift: 0.93, downshift: 0.36, idleRpm: 0.18, shiftDip: 0.14, shiftKick: 0.5, backfireChance: 0.55, rpmHz: [9, 46] })
export const PLUME = Object.freeze({ idle: 0.12, lenIdle: 1.6, lenMax: 9, boostLen: 1.45, diamonds: 0.62, flicker: 0.18 })
const SPARKS = 96

const VERT = /* glsl */`varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`
// Fahne: Kegel entlang +Z, breites Ende an der Düse (CylinderGeometry: uv.y = 1 oben → nach der Drehung an der Düse); ax = 0 Düse … 1 Spitze. Kern heiß-hell → Fahnenfarbe → aus; weiche Ränder über den Blickwinkel; Schockdiamanten als helle Bänder
const PLUME_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; uniform float uTime; uniform float uDiam; uniform float uSeed;
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
float h(float n){ return fract(sin(n)*43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); return mix(h(i), h(i+1.), f*f*(3.-2.*f)); }
void main(){ float ax = 1.0 - vUv.y, a = vUv.y; float rim = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
  float fl = 0.82 + 0.18 * n1(ax*9. - uTime*23. + uSeed) + 0.1 * n1(vUv.x*31. + uTime*17.);
  float d = uDiam * smoothstep(0.55, 1.0, uThrust) * pow(0.5 + 0.5*cos((ax*7.5 - uTime*1.5)*6.2832), 6.) * a;
  vec3 c = mix(uPlume, uCore, pow(a, 3.2) + d);
  float al = rim * pow(a, 1.25) * fl * (0.35 + 0.65*uThrust) + d*0.6;
  gl_FragColor = vec4(c * (1.2 + 1.6*uThrust), clamp(al, 0., 1.)); }`
const CORE_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; varying vec2 vUv;
void main(){ float r = length(vUv - 0.5) * 2.; float k = smoothstep(1.0, 0.0, r);
  vec3 c = mix(uPlume, uCore, smoothstep(0.75, 0.0, r)); gl_FragColor = vec4(c * (0.9 + 2.2*uThrust), k * (0.45 + 0.55*uThrust)); }`
const FAN_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; uniform float uAngle; varying vec2 vUv;
void main(){ vec2 p = vUv - 0.5; float r = length(p) * 2.; if (r > 1.) discard; float a = atan(p.y, p.x) + uAngle;
  float blades = 0.5 + 0.5 * cos(a * 7.); float blur = mix(pow(blades, 3.), 0.55, smoothstep(0.3, 1.0, uThrust));
  float ring = smoothstep(0.78, 0.92, r) * smoothstep(1.0, 0.94, r); float hub = smoothstep(0.22, 0.12, r);
  vec3 c = mix(uPlume, uCore, ring + hub*0.6); float al = (ring * (0.5 + 0.5*uThrust) + blur * (0.18 + 0.4*uThrust) * smoothstep(0.95, 0.3, r) + hub*0.4);
  gl_FragColor = vec4(c * (0.8 + 1.4*uThrust), clamp(al, 0., 1.)); }`
const SPARK_VERT = /* glsl */`attribute float aLife; attribute float aSize; varying float vLife; uniform float uScale;
void main(){ vLife = aLife; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = aSize * uScale * (0.4 + aLife) / max(0.2, -mv.z); gl_Position = projectionMatrix * mv; }`
const SPARK_FRAG = /* glsl */`uniform vec3 uSpark; uniform vec3 uCore; varying float vLife;
void main(){ if (vLife <= 0.) discard; vec2 p = gl_PointCoord - 0.5; float k = smoothstep(0.5, 0.0, length(p)); gl_FragColor = vec4(mix(uSpark, uCore, vLife) * 2.2, k * vLife); }`

// Knet-Flamme (V-654 C5, CANON Gebiet 11 „eine Masse mit Beulen, nie Kugelstapel … 2–3 Tonstufen, keine Emission“): style 'clay'. Eine tropfenförmige
// Masse (Drehkörper), deren Umriss zwei bis drei überlappende Beulen trägt, die langsam nach hinten wandern; Farbe in drei Stufen (Kern, Fahne, Rand)
// nach Blickwinkel, normal geblendet, mit Tonemapping (kein Leuchten). Keine Schockdiamanten, kein Glühkern.
const CLAY_VERT = /* glsl */`uniform float uTime; uniform float uSeed; uniform float uThrust; varying vec3 vN; varying vec3 vV; varying float vAx;
void main(){ float ax = position.z; vAx = ax; float lob = 1.0 + 0.16 * sin(ax * 9.0 - uTime * (5.0 + 6.0 * uThrust) + uSeed) * smoothstep(0.05, 0.35, ax) + 0.12 * sin(ax * 17.0 - uTime * 9.0 + uSeed * 1.7) * smoothstep(0.2, 0.6, ax);
  vec3 p = vec3(position.xy * lob, position.z); vec4 mv = modelViewMatrix * vec4(p, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`
const CLAY_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; varying vec3 vN; varying vec3 vV; varying float vAx;
void main(){ float f = abs(dot(normalize(vN), normalize(vV))); float k = f * (1.0 - 0.55 * vAx);
  vec3 warm = mix(uPlume, vec3(1.0, 0.78, 0.38), 0.55); vec3 c = k > 0.74 ? mix(warm, uCore, 0.25) : k > 0.4 ? mix(uPlume, warm, 0.35) : uPlume * 0.74;   /* drei Stufen: warmer Kern (klein), Fahne, dunklerer Rand */
  float al = smoothstep(1.0, 0.82, vAx) * (0.78 + 0.22 * uThrust);
  gl_FragColor = vec4(c, al);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
// Tropfen-Umriss (Radius über z 0 → 1): an der Düse voll, Bauch bei 0,25, dann zur runden Spitze; Drehkörper mit 12 Ringen für die Beulen
const clayFlameGeo = () => { const pts = []; for (let i = 0; i <= 14; i++) { const z = i / 14, r = Math.max(0.001, (z < 0.25 ? 0.92 + 0.32 * Math.sin(z / 0.25 * Math.PI / 2) : 1.24 * Math.cos((z - 0.25) / 0.75 * Math.PI / 2) ** 0.8)); pts.push(new THREE.Vector2(r, z)) }
  return new THREE.LatheGeometry(pts, 18).rotateX(Math.PI / 2) }   // Drehachse +Y → +Z (Düse z 0, Spitze z 1)
const additive = (frag, uniforms, extra = {}) => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, ...extra })

// Motormodell: Tempo (0..1) und Gas → Gang, Drehzahl (0..1), Ereignisse shift/backfire. Rein, ohne three (Node-prüfbar über createEngine)
export function createEngine(cfg = {}) {
  const E = { ...ENGINE, ...cfg }; let gear = 1, rpm = E.idleRpm, dip = 0, prevThrottle = 0
  const band = (g) => [(g - 1) / E.gears, g / E.gears] // jeder Gang deckt ein Tempo-Band ab
  return {
    get gear() { return gear }, get rpm() { return rpm }, get dip() { return dip },
    step(dt, { speed01 = 0, throttle = 0 } = {}) {
      const ev = []; const [a, b] = band(gear), inBand = Math.max(0, Math.min(1.08, (speed01 - a) / (b - a)))
      const target = Math.max(E.idleRpm, Math.min(1, E.idleRpm + (1 - E.idleRpm) * inBand * (0.75 + 0.25 * throttle)))
      rpm += (target - rpm) * Math.min(1, dt * 9)
      if (rpm > E.upshift && gear < E.gears && throttle > 0.2) { gear++; dip = E.shiftDip; rpm = E.downshift + 0.12; ev.push({ type: 'shift', gear, up: true }) }
      else if (rpm < E.downshift && gear > 1 && speed01 < band(gear - 1)[1] * 0.9) { gear--; rpm = E.upshift - 0.2; ev.push({ type: 'shift', gear, up: false }) }
      if (prevThrottle > 0.6 && throttle < 0.15 && rpm > 0.55) ev.push({ type: 'backfire', strength: rpm })
      dip = Math.max(0, dip - dt); prevThrottle = throttle
      return ev
    },
    hz: () => E.rpmHz[0] + (E.rpmHz[1] - E.rpmHz[0]) * rpm,
  }
}

// size: Punktgröße × 300·unit / Abstand (R1a-Bilder 18.10.: 5–12 ergab mehrere Meter große Wolken über dem Heck → ≈ 0,3–0,8 m), Staub steigt flach auf
export const DUST = Object.freeze({ count: 160, hMax: 2.2, rate: 46, life: [0.5, 1.1], size: [1.0, 2.4], rise: [0.3, 0.9], spread: [0.4, 1.2], alpha: 0.55, minSpeed: 0.06 })
const DUST_VERT = /* glsl */`attribute float aLife; attribute float aSize; attribute vec3 aColor; varying float vLife; varying vec3 vColor; uniform float uScale;
void main(){ vLife = aLife; vColor = aColor; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = aSize * uScale * (0.4 + aLife) / max(0.2, -mv.z); gl_Position = projectionMatrix * mv; }`
const DUST_FRAG = /* glsl */`varying float vLife; varying vec3 vColor;
void main(){ if (vLife <= 0.) discard; vec2 p = gl_PointCoord - 0.5; float k = smoothstep(0.5, 0.15, length(p)); gl_FragColor = vec4(vColor * (0.85 + 0.25*vLife), k * vLife * 0.55); }`

export function createVehicleRig({ anchors = [], hover = [], glow = {}, unit = 1, engine = {}, seed = 1, style = 'glow' } = {}) {
  const root = new THREE.Group(); root.name = 'vehicle-rig'
  const stretch = new THREE.Group(); stretch.name = 'vehicle-rig-stretch'; root.add(stretch) // Wirt hängt das Modell hier ein (Modell + Anker verformen gemeinsam)
  const fx = new THREE.Group(); fx.name = 'vehicle-rig-fx'; stretch.add(fx)
  const C = { core: new THREE.Color(glow.core || '#fff1c9'), plume: new THREE.Color(glow.plume || '#ffa97a'), spark: new THREE.Color(glow.spark || '#ffae3d') }
  const shared = { uCore: { value: C.core }, uPlume: { value: C.plume }, uTime: { value: 0 } }
  const Z = new THREE.Vector3(0, 0, 1), cone = new THREE.CylinderGeometry(1, 0.12, 1, 20, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 0.5) // breit an der Düse (z 0), Spitze bei z 1
  const disc = new THREE.CircleGeometry(1, 24), units = [], clayGeo = style === 'clay' ? clayFlameGeo() : null
  anchors.forEach((a, i) => {
    const g = new THREE.Group(); g.name = 'anchor:' + a.id; g.position.fromArray(a.pos).multiplyScalar(unit)
    g.quaternion.setFromUnitVectors(Z, new THREE.Vector3(...a.dir).normalize()); fx.add(g)
    const r = a.radius * unit, ro = (a.outerRadius || a.radius) * unit, u = { a, g, r, ro, type: a.type || 'thrust', mats: [] }
    if (u.type === 'fan') {
      const m = additive(FAN_FRAG, { ...shared, uThrust: { value: 0 }, uAngle: { value: 0 } }, { side: THREE.DoubleSide })
      const d = new THREE.Mesh(disc, m); d.scale.setScalar(ro * 1.02); d.position.z = r * 0.06; d.renderOrder = 3; g.add(d); u.fan = d; u.mats.push(m)
    } else if (clayGeo) {
      const mp = new THREE.ShaderMaterial({ vertexShader: CLAY_VERT, fragmentShader: CLAY_FRAG, uniforms: { ...shared, uThrust: { value: 0 }, uSeed: { value: i * 7.13 + seed } }, transparent: true, depthWrite: false, side: THREE.DoubleSide })
      const plume = new THREE.Mesh(clayGeo, mp); plume.renderOrder = 4; plume.frustumCulled = false; g.add(plume); u.plume = plume; u.clay = true; u.mats.push(mp)
    } else {
      const mc = additive(CORE_FRAG, { ...shared, uThrust: { value: 0 } }, { side: THREE.DoubleSide })
      const core = new THREE.Mesh(disc, mc); core.scale.setScalar(r * 0.95); core.position.z = -r * 0.25; core.renderOrder = 3; g.add(core)
      const mp = additive(PLUME_FRAG, { ...shared, uThrust: { value: 0 }, uDiam: { value: PLUME.diamonds }, uSeed: { value: i * 7.13 + seed } }, { side: THREE.DoubleSide })
      const plume = new THREE.Mesh(cone, mp); plume.renderOrder = 4; plume.frustumCulled = false; g.add(plume); u.core = core; u.plume = plume; u.mats.push(mc, mp)
    }
    units.push(u)
  })
  // Funken-Pool (Backfire, Schaltknall, Bremsen): Weltraum der Fahrzeug-Darstellung, feste Größe
  const sp = { pos: new Float32Array(SPARKS * 3), vel: new Float32Array(SPARKS * 3), life: new Float32Array(SPARKS), max: new Float32Array(SPARKS), size: new Float32Array(SPARKS), next: 0 }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp.pos, 3)); sg.setAttribute('aLife', new THREE.BufferAttribute(sp.life, 1)); sg.setAttribute('aSize', new THREE.BufferAttribute(sp.size, 1))
  const sm = new THREE.ShaderMaterial({ vertexShader: SPARK_VERT, fragmentShader: SPARK_FRAG, uniforms: { uSpark: { value: C.spark }, uCore: { value: C.core }, uScale: { value: 300 * unit } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
  const sparks = new THREE.Points(sg, sm); sparks.frustumCulled = false; sparks.renderOrder = 5; fx.add(sparks)
  let rnd = seed >>> 0; const rand = () => { rnd = (rnd * 1664525 + 1013904223) >>> 0; return rnd / 4294967296 }
  const emit = (u, n, speed) => { for (let k = 0; k < n; k++) { const j = sp.next; sp.next = (sp.next + 1) % SPARKS
    const p = u.g.position, d = new THREE.Vector3(0, 0, 1).applyQuaternion(u.g.quaternion), s = speed * (0.6 + 0.8 * rand())
    sp.pos[j * 3] = p.x + (rand() - 0.5) * u.r; sp.pos[j * 3 + 1] = p.y + (rand() - 0.5) * u.r; sp.pos[j * 3 + 2] = p.z + (rand() - 0.5) * u.r
    sp.vel[j * 3] = d.x * s + (rand() - 0.5) * s * 0.5; sp.vel[j * 3 + 1] = d.y * s + (rand() - 0.2) * s * 0.5; sp.vel[j * 3 + 2] = d.z * s + (rand() - 0.5) * s * 0.5
    sp.max[j] = 0.25 + 0.35 * rand(); sp.life[j] = 1; sp.size[j] = (1.5 + 2.5 * rand()) * Math.max(0.6, u.r / unit) } }
  // Stauchen → Strecken (surge) und Steigen (ascent): eine gedämpfte Feder auf der Gruppe stretch, Anticipation als kurze Gegenbewegung vor dem Impuls
  const spr = { z: 0, vz: 0, y: 0, vy: 0, p: 0, vp: 0, queue: [] }
  const springStep = (dt) => { const w = 2 * Math.PI * 3.2, d = 0.42
    for (const q of spr.queue) q.t -= dt
    while (spr.queue.length && spr.queue[0].t <= 0) { const q = spr.queue.shift(); spr[q.axis === 'z' ? 'vz' : 'vy'] += q.kick }
    spr.vz += (-2 * d * w * spr.vz - w * w * spr.z) * dt; spr.z += spr.vz * dt; spr.vy += (-2 * d * w * spr.vy - w * w * spr.y) * dt; spr.y += spr.vy * dt
    spr.vp += (-2 * 0.38 * w * spr.vp - w * w * spr.p) * dt; spr.p += spr.vp * dt; spr.p = Math.max(-1, Math.min(1, spr.p)); stretch.rotation.x = spr.p * 0.4 // brake: Nase taucht (≈ 5°), Heck hebt, federt nach
    spr.z = Math.max(-0.16, Math.min(0.2, spr.z)); spr.y = Math.max(-0.16, Math.min(0.2, spr.y))
    const ez = 1 + spr.z, ey = 1 + spr.y // Volumen erhalten: x · y · z = 1
    stretch.scale.set(1 / Math.sqrt(ez * ey), ey / Math.sqrt(ez), ez / Math.sqrt(ey)) }
  const surge = (strength = 1) => { spr.vz -= 1.6 * strength; spr.queue.push({ t: 0.1, axis: 'z', kick: 3.4 * strength }) } // erst stauchen, nach 0,1 s strecken
  const brakeDip = (strength = 1) => { spr.vp += 9 * strength }
  const ascent = (strength = 1) => { spr.vy -= 1.5 * strength; spr.queue.push({ t: 0.09, axis: 'y', kick: 3.1 * strength }) }
  // Bodennähe-Staub: Weltraum-Pool, Schwebe-Anker als Gruppen unter stretch (folgen Verformung und Lage)
  const hov = hover.map((p, i) => { const o = new THREE.Object3D(); o.name = 'hover:' + i; o.position.fromArray(p).multiplyScalar(unit); stretch.add(o); return o })
  const du = { pos: new Float32Array(DUST.count * 3), vel: new Float32Array(DUST.count * 3), life: new Float32Array(DUST.count), max: new Float32Array(DUST.count), size: new Float32Array(DUST.count), col: new Float32Array(DUST.count * 3), next: 0, acc: 0 }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(du.pos, 3)); dg.setAttribute('aLife', new THREE.BufferAttribute(du.life, 1)); dg.setAttribute('aSize', new THREE.BufferAttribute(du.size, 1)); dg.setAttribute('aColor', new THREE.BufferAttribute(du.col, 3))
  const dustCol = new THREE.Color('#cdb48c'), _c = new THREE.Color()
  const dm = new THREE.ShaderMaterial({ vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, uniforms: { uScale: { value: 300 * unit } }, transparent: true, depthWrite: false })
  const world = new THREE.Points(dg, dm); world.name = 'vehicle-rig-dust'; world.frustumCulled = false; world.renderOrder = 2
  const _w = new THREE.Vector3()
  const dustStep = (dt, speed01, groundAt, colorAt) => {
    if (groundAt && hov.length && speed01 > DUST.minSpeed) for (const o of hov) {
      o.getWorldPosition(_w); const gy = groundAt(_w.x, _w.z); if (gy == null) continue; const h = _w.y - gy, k = Math.max(0, 1 - h / (DUST.hMax * unit * 1.6)) * Math.min(1, speed01 * 1.6)
      du.acc += DUST.rate * k * dt
      while (du.acc >= 1) { du.acc -= 1; const j = du.next; du.next = (du.next + 1) % DUST.count
        du.pos[j * 3] = _w.x + (rand() - 0.5) * 0.6 * unit; du.pos[j * 3 + 1] = gy + 0.05; du.pos[j * 3 + 2] = _w.z + (rand() - 0.5) * 0.6 * unit
        const a = rand() * Math.PI * 2, sp = (DUST.spread[0] + rand() * (DUST.spread[1] - DUST.spread[0])) * unit; du.vel[j * 3] = Math.cos(a) * sp; du.vel[j * 3 + 1] = (DUST.rise[0] + rand() * (DUST.rise[1] - DUST.rise[0])) * unit; du.vel[j * 3 + 2] = Math.sin(a) * sp
        const cc = colorAt ? _c.set(colorAt(_w.x, _w.z) || dustCol) : dustCol, jit = 0.9 + 0.2 * rand(); du.col[j * 3] = cc.r * jit; du.col[j * 3 + 1] = cc.g * jit; du.col[j * 3 + 2] = cc.b * jit
        du.max[j] = DUST.life[0] + (DUST.life[1] - DUST.life[0]) * rand(); du.life[j] = 1; du.size[j] = (DUST.size[0] + (DUST.size[1] - DUST.size[0]) * rand()) }
    }
    for (let j = 0; j < DUST.count; j++) { if (du.life[j] <= 0) continue; du.life[j] -= dt / du.max[j]; if (du.life[j] < 0) du.life[j] = 0
      du.vel[j * 3 + 1] -= 1.8 * unit * dt; for (let k = 0; k < 3; k++) { du.vel[j * 3 + k] *= 1 - Math.min(1, dt * 1.2); du.pos[j * 3 + k] += du.vel[j * 3 + k] * dt } }
    dg.attributes.position.needsUpdate = true; dg.attributes.aLife.needsUpdate = true; dg.attributes.aSize.needsUpdate = true; dg.attributes.aColor.needsUpdate = true
  }
  const eng = createEngine(engine), state = { thrust: PLUME.idle, boost: 0, angle: 0, last: [], events: { shift: 0, backfire: 0, surge: 0 } }
  return {
    object3d: root,
    stretch,
    world, // Weltraum-Staub: der Wirt hängt ihn in die Szene
    setDustColor(hex) { dustCol.set(hex) },
    engine: eng,
    get thrust() { return state.thrust }, get boostLevel() { return state.boost }, // für Klang (ein Signal mit Fahne und Deformer)
    surge(s) { surge(s); state.events.surge++ },
    ascent,
    brake(s) { brakeDip(s); state.events.brake = (state.events.brake || 0) + 1 },
    // in: throttle 0..1, speed01 0..1, boost bool, brake bool. Gibt die Ereignisse dieses Bildes zurück (shift/backfire) – für Klang und Deformer
    update(dt, inp = {}) {
      dt = Math.min(dt || 0, 0.1); shared.uTime.value += dt
      const { throttle = 0, speed01 = 0, boost = false, brake = false, groundAt = null, groundColorAt = null } = inp
      const ev = eng.step(dt, { speed01, throttle }); state.last = ev
      for (const e of ev) { if (e.type === 'shift' && e.up) { state.events.shift++; units.forEach((u) => u.type !== 'fan' && emit(u, 3, 4 * unit)); surge(0.45) }
        if (e.type === 'backfire' && Math.random() < ENGINE.backfireChance) { state.events.backfire++; units.forEach((u) => u.type !== 'fan' && emit(u, 8, 7 * unit)) } }
      if (brake && speed01 > 0.2) units.forEach((u) => { if (u.type !== 'fan' && Math.random() < dt * 14) emit(u, 1, 3 * unit) })
      state.boost += ((boost ? 1 : 0) - state.boost) * Math.min(1, dt * 6)
      const pulse = 1 + PLUME.flicker * 0.35 * Math.sin(shared.uTime.value * eng.hz() * 2 * Math.PI) // Takt nach Drehzahl
      const want = Math.max(PLUME.idle, (PLUME.idle + (1 - PLUME.idle) * throttle) * (eng.dip > 0 ? 0.35 : 1) + 0.25 * state.boost)
      state.thrust += (want - state.thrust) * Math.min(1, dt * (want > state.thrust ? 14 : 5))
      const t = Math.min(1.25, state.thrust), st = 1 + Math.max(0, spr.z) * 2.5 - Math.max(0, -spr.z) * 2 // Fahne zieht in der Anticipation ein, schießt beim Strecken raus
      state.angle += dt * (6 + 60 * t)
      for (const u of units) {
        for (const m of u.mats) { m.uniforms.uThrust.value = Math.min(1, t); if (m.uniforms.uAngle) m.uniforms.uAngle.value = state.angle }
        if (u.plume) { const len = u.ro * (PLUME.lenIdle + (PLUME.lenMax - PLUME.lenIdle) * t) * (1 + (PLUME.boostLen - 1) * state.boost) * pulse * Math.max(0.3, st)
          if (u.clay) u.plume.scale.set(u.ro * 0.8, u.ro * 0.8, len * 0.45); else { u.plume.scale.set(u.ro * 0.92, u.ro * 0.92, len); u.core.scale.setScalar(u.r * (0.9 + 0.2 * t) * pulse) } }   /* Knet-Flamme kürzer und dicker: eine Masse statt Strahl */
      }
      for (let j = 0; j < SPARKS; j++) { if (sp.life[j] <= 0) continue; sp.life[j] -= dt / sp.max[j]; if (sp.life[j] < 0) sp.life[j] = 0
        sp.vel[j * 3 + 1] -= 4 * unit * dt; for (let k = 0; k < 3; k++) sp.pos[j * 3 + k] += sp.vel[j * 3 + k] * dt }
      sg.attributes.position.needsUpdate = true; sg.attributes.aLife.needsUpdate = true; sg.attributes.aSize.needsUpdate = true
      springStep(dt); dustStep(dt, speed01, groundAt, groundColorAt)
      return ev
    },
    info: () => ({ schema: VEHICLE_RIG_SCHEMA, style, anchors: units.length, thrust: +state.thrust.toFixed(3), gear: eng.gear, rpm: +eng.rpm.toFixed(3), boost: +state.boost.toFixed(2), events: { ...state.events }, stretch: [+stretch.scale.x.toFixed(3), +stretch.scale.y.toFixed(3), +stretch.scale.z.toFixed(3)], drawCalls: units.reduce((n, u) => n + u.mats.length, 0) + 1 + (hov.length ? 1 : 0), dust: du.life.reduce((n, v) => n + (v > 0 ? 1 : 0), 0) }),
    anchorWorld: (i, v = new THREE.Vector3()) => units[i]?.g.getWorldPosition(v) ?? null, // Prüfungen: sitzt die Düse am Modell?
    dispose() { for (const u of units) u.mats.forEach((m) => m.dispose()); cone.dispose(); disc.dispose(); clayGeo?.dispose(); sg.dispose(); sm.dispose(); dg.dispose(); dm.dispose(); world.parent?.remove(world); root.clear() },
  }
}
