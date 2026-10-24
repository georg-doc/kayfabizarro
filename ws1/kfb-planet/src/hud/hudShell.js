// HUD-Hülle (eine Implementierung für alle HUD-Bausteine, Owner-Arbitrierung HUD 3D R1 mit dem Lead 24.10.): Mini-Szene je Prop, gecachtes
// Render-Ziel (neu nur bei Zustandswechsel oder solange ein Prop lebt), Overlay-Rechtecke mit Bildraum-Kontur, gefilterte Reaktion (Federn auf den
// Rechtecken, nie auf der 3D-Ansicht), Interaktions-Zustände und Animations-Haken, Messwerte. Kein DOM, keine Listener, kein eigener Renderer:
// gezeichnet wird im Overlay-Pass des Spiels (hudPass.js). Die Bausteinlisten (Kits) liegen daneben: clayHud.js (Knet-HUD R1, hud=clay) und
// hud3d.js (HUD 3D R1 Board, hud=3d). Kein Modul nach Host-Vertrag (kein object3d) – die Kits sind die Module.
import * as THREE from 'three'
import { clayFrom } from '../modules/clayLook.js'

export const DEG = Math.PI / 180
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// ── Materialien ───────────────────────────────────────────────────────────────────────────────────────────────────────
// Knet-Material mit drei Zonen (V-653): COLOR_0 R/G/B = base/accent/detail, Farben aus Z ({ base, accent, detail } als Uniform-Werte)
export function zoneMaterial(Z, { alpha = false, plain = false } = {}) {
  const src = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, transparent: alpha, side: alpha ? THREE.DoubleSide : THREE.FrontSide, roughness: 0.85 })
  const m = alpha ? new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }) : plain ? src : clayFrom(src, 'house')
  const prev = m.onBeforeCompile
  m.onBeforeCompile = (sh, r) => {
    prev?.call(m, sh, r)
    sh.uniforms.uZoneB = Z.base; sh.uniforms.uZoneA = Z.accent; sh.uniforms.uZoneD = Z.detail
    sh.fragmentShader = 'uniform vec3 uZoneB, uZoneA, uZoneD;\n' + sh.fragmentShader.replace('#include <color_fragment>',
      `#include <color_fragment>
      #if defined( USE_COLOR_ALPHA ) || defined( USE_COLOR )
      { vec3 w = max(vColor.rgb, vec3(0.0)); float s = max(w.r + w.g + w.b, 1e-4); diffuseColor.rgb = (uZoneB * w.r + uZoneA * w.g + uZoneD * w.b) / s; }
      #endif`)
  }
  const key = m.customProgramCacheKey?.bind(m)
  m.customProgramCacheKey = () => (key ? key() : '') + '|kfb-hud-zones' + (alpha ? '-a' : plain ? '-p' : '')
  return m
}
export const zoneSet = (z) => ({ base: { value: new THREE.Color(z.base) }, accent: { value: new THREE.Color(z.accent) }, detail: { value: new THREE.Color(z.detail) } })

// Knete nach HUD 3D R1 (Werte aus h3d-core clayMat: Rauheit 0,92, prozedurales Normalen-Rauschen Stärke 0,5, Helligkeit ±5 %); Farbe fest
const NOISE = `float kh3(vec3 p){ p = fract(p*0.3183099+.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float kn3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
 return mix(mix(mix(kh3(i),kh3(i+vec3(1,0,0)),f.x),mix(kh3(i+vec3(0,1,0)),kh3(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(kh3(i+vec3(0,0,1)),kh3(i+vec3(1,0,1)),f.x),mix(kh3(i+vec3(0,1,1)),kh3(i+vec3(1,1,1)),f.x),f.y),f.z); }`
export function boardClay(color, { amp = 0.5, scale = 9, zones = null, emissive = null, emissiveIntensity = 0.38, map = null, cream = null, vertexColors = false } = {}) { // cream: dunkle Flächen auf Creme ziehen (weiße Kassette, h3d-core)
  const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color || '#ffffff'), roughness: 0.92, metalness: 0, vertexColors: !!zones || vertexColors, map })
  if (emissive) { m.emissive.set(emissive); m.emissiveIntensity = emissiveIntensity }
  const u = { clayAmp: { value: amp }, clayS: { value: scale }, cream: { value: new THREE.Color(cream || '#f6efe0') } }
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u); if (zones) { sh.uniforms.uZoneB = zones.base; sh.uniforms.uZoneA = zones.accent; sh.uniforms.uZoneD = zones.detail }
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vClayP;\nuniform float clayS;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvClayP = position * clayS;')
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vClayP;\nuniform float clayAmp;\n' + (zones ? 'uniform vec3 uZoneB, uZoneA, uZoneD;\n' : '') + (cream ? 'uniform vec3 cream;\n' : '') + NOISE)
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + (zones ? '  { vec3 w = max(vColor.rgb, vec3(0.0)); float s = max(w.r + w.g + w.b, 1e-4); diffuseColor.rgb = (uZoneB * w.r + uZoneA * w.g + uZoneD * w.b) / s; }\n' : '') + (cream ? '  { float l = dot(diffuseColor.rgb, vec3(.299,.587,.114)); diffuseColor.rgb = mix(cream, diffuseColor.rgb, smoothstep(.10,.30,l)); }\n' : '') + '  diffuseColor.rgb *= 0.95 + 0.1*kn3(vClayP*0.35);')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
  { vec3 cp = vClayP; float e = .2;
    vec3 g = vec3(kn3(cp+vec3(e,0,0))-kn3(cp-vec3(e,0,0)), kn3(cp+vec3(0,e,0))-kn3(cp-vec3(0,e,0)), kn3(cp+vec3(0,0,e))-kn3(cp-vec3(0,0,e)));
    g += .5*vec3(kn3(cp*2.3+vec3(e,0,0))-kn3(cp*2.3-vec3(e,0,0)), kn3(cp*2.3+vec3(0,e,0))-kn3(cp*2.3-vec3(0,e,0)), kn3(cp*2.3+vec3(0,0,e))-kn3(cp*2.3-vec3(0,0,e)));
    normal = normalize(normal - clayAmp * g); }`)
  }
  m.customProgramCacheKey = () => 'kfb-hud-boardclay' + (zones ? '-z' : '') + (cream ? '-c' : '') + (map ? '-m' : '')
  m.userData.u = u
  return m
}

// Overlay-Rechteck: gecachte Ansicht (vormultipliertes Alpha) + Kontur außen. ol = [oben links, unten rechts] in Spiel-px (1080p); gleich = gleichmäßig
// (R1), 2 → 3,5 = HUD 3D R1 (Licht oben links). 16 Richtungen, Radius stetig über den Winkel; dazu ein 1-px-Innenring gegen Löcher.
export function quadMaterial({ toneMapped = true, rim = 0.9 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: null }, uvScale: { value: new THREE.Vector2(1, 1) }, texel: { value: new THREE.Vector2(1 / 256, 1 / 256) }, ink: { value: new THREE.Color('#2a1a10') }, ol: { value: new THREE.Vector2(2, 2) }, inner: { value: 1 }, rim: { value: rim }, opacity: { value: 1 },
      haloA: { value: 0 }, haloC: { value: new THREE.Color('#fff6e0') }, haloR: { value: 10 } },
    vertexShader: 'varying vec2 vUv; uniform vec2 uvScale; void main() { vUv = uv * uvScale; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D map; uniform vec2 texel, ol; uniform vec3 ink, haloC; uniform float inner, rim, opacity, haloA, haloR; varying vec2 vUv;
      void main() {
        vec4 c = texture2D(map, vUv); float a = c.a, n = 0.0;
        for (int i = 0; i < 16; i++) { float ang = float(i) * 0.3926991; vec2 d = vec2(cos(ang), sin(ang));
          float w = 0.5 + 0.5 * ((d.x + d.y) * 0.7071068); float r = mix(ol.x, ol.y, w);
          n = max(n, texture2D(map, vUv - vec2(d.x, -d.y) * texel * r).a); }
        for (int i = 0; i < 8; i++) { float ang = float(i) * 0.7853982; n = max(n, texture2D(map, vUv + vec2(cos(ang), sin(ang)) * texel * inner).a); }
        float k = clamp(n - a, 0.0, 1.0) * rim;
        // Lichthof (Zustand, HUD_UX_STATES): weicher Saum aus der Silhouette, nur wenn haloA > 0 (Ruhe = kein Lichthof)
        float g = 0.0;
        if (haloA > 0.001) { for (int j = 1; j <= 3; j++) { float rr = haloR * float(j) / 3.0; for (int i = 0; i < 12; i++) { float ang = float(i) * 0.5235988 + float(j);
          g += texture2D(map, vUv + vec2(cos(ang), sin(ang)) * texel * rr).a * (1.15 - float(j) * 0.25); } } g = clamp(g / 18.0, 0.0, 1.0); g = smoothstep(0.0, 0.7, g) * haloA; }
        vec4 halo = vec4(haloC * g, g), line = vec4(ink * k, k);
        vec4 under = line + (1.0 - k) * halo; vec4 o = c + (1.0 - a) * under;
        gl_FragColor = o * opacity;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true, depthTest: false, depthWrite: false, toneMapped,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  })
}

export function textCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, g: c.getContext('2d'), t } }

// Licht je Mini-Szene: 'clay' = Knet-HUD R1, 'board' = h3d-core initR (hemi 1,45, key 2,3, fill 0,7, rim 0,5; Kamera schaut von +Z)
function addLights(scene, preset) {
  if (preset === 'board') {
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0x6e6470, 1.45))
    const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(-2.2, 3.2, 2.6)
    const fill = new THREE.DirectionalLight(0xdde6ff, 0.7); fill.position.set(2.5, 0.6, 1.4)
    const rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(0.5, 1.5, -2.5)
    scene.add(key, fill, rim); return
  }
  scene.add(new THREE.HemisphereLight('#fff4e4', '#6d5a4a', 1.5))
  const sun = new THREE.DirectionalLight('#fff0dc', 2.4); sun.position.set(-2.5, 4, 3.2); scene.add(sun)
  const fill = new THREE.DirectionalLight('#dce8ff', 0.55); fill.position.set(3, 1.2, 1.5); scene.add(fill)
}

// opts: { ref: { W, H } Bezugsfläche, pad (Bezugs-px), phoneK, reducedMotion: bool|fn, gain: { key: Stärke }, ink: () => Color (je Bild), ol: [a, b] }
export function createHudShell(opts = {}) {
  const O = { ref: { W: 1920, H: 1080 }, pad: 22, phoneK: 1.55, reducedMotion: false, gain: {}, ink: null, ol: [2, 2], sqX: 0.6, sqMax: 0.12, fx: false, haloR: 20, ...opts } // fx: Zustände sichtbar machen (HUD 3D, SPEC_WERTE „Zustände“); haloR in Bezugs-px // sqX/sqMax: Stauchung (R1 0,6/0,12; Board 1/0,25)
  const REF = O.ref
  const S = { rtRenders: 0, draws: 0, drawMs: 0, drawMsMax: 0, ring: new Float32Array(240), ri: 0, updMs: 0, updates: 0, tris: 0 }
  const slots = {}, ORDER = []
  const overlay = new THREE.Scene(), ocam = new THREE.OrthographicCamera(0, REF.W, REF.H, 0, -2000, 2000)
  overlay.add(new THREE.HemisphereLight('#fff4e4', '#6d5a4a', 1.6)); { const d = new THREE.DirectionalLight('#fff0dc', 2.2); d.position.set(-0.5, 0.8, 1); overlay.add(d) }
  const view = { W: REF.W, H: REF.H, k: 1, dpr: 1 }
  const tmpB = new THREE.Box3(), tmpS = new THREE.Sphere()
  const _corner = new THREE.Vector3(), _dir = new THREE.Vector3(), _right = new THREE.Vector3(), _up = new THREE.Vector3()

  // L: { corner 'tl'|'tr'|'bl'|'br'|'tc'|'bc', w, h, dx, dy (Bezugs-px), open?: { w, h } } · o: { lights, ortho, toneMapped, rim, ol }
  function addSlot(key, L, o = {}) {
    const scene = new THREE.Scene(); addLights(scene, o.lights || 'clay')
    const cam = o.ortho ? new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 100) : new THREE.PerspectiveCamera(20, L.w / L.h, 0.01, 100)
    const mat = quadMaterial({ toneMapped: o.toneMapped !== false, rim: o.rim ?? 0.9 })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat); quad.name = 'hud-quad:' + key
    const pivot = new THREE.Group(); pivot.add(quad); quad.renderOrder = ORDER.length; overlay.add(pivot)
    const s = { key, L, o, scene, cam, mat, quad, pivot, rt: null, root: null, dirty: true, live: 0, rect: { x: 0, y: 0, w: L.w, h: L.h }, sp: { tilt: 0, vt: 0, dy: 0, vy: 0, sq: 0, vs: 0, sx: 0, vsx: 0, dx: 0, vx: 0 }, mixer: null, clips: {}, fitR: 1, fitC: new THREE.Vector3(), ortho: !!o.ortho }
    slots[key] = s; ORDER.push(key); return s
  }

  // Kamera einpassen: Richtung aus Höhenwinkel/Gier; Perspektive: Abstand so, dass die 8 Kastenecken das Rechteck zu `fill` füllen; Ortho: Ausschnitt
  // direkt aus den projizierten Ecken (box) bzw. aus der Kugel (sphere: drehfest, z. B. Pfeil). fit < 1 = enger, > 1 = mehr Rand.
  function fitCamera(s, el, yaw, fit = 1, center = null, radius = null, box = null) {
    if (center) s.fitC.copy(center); if (radius) s.fitR = radius; if (box) s.fitBox = box.clone()
    _dir.set(Math.sin(yaw * DEG) * Math.cos(el * DEG), Math.sin(el * DEG), Math.cos(yaw * DEG) * Math.cos(el * DEG))
    const r = s.rect, aspect = r.w / r.h
    if (s.ortho) {
      const d = s.fitR * 6 + 1, target = s.fitC.clone(); s.cam.position.copy(_dir).multiplyScalar(d).add(target); s.cam.up.set(0, 1, 0); s.cam.lookAt(target); s.cam.updateMatrixWorld(true)
      let cx = 0, cy = 0, hw, hh
      if (s.fitMode === 'sphere' || !s.fitBox) { hw = s.fitR * Math.max(1, aspect); hh = s.fitR * Math.max(1, 1 / aspect) }
      else { const inv = s.cam.matrixWorldInverse, B = s.fitBox; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9
        for (let i = 0; i < 8; i++) { _corner.set(i & 1 ? B.max.x : B.min.x, i & 2 ? B.max.y : B.min.y, i & 4 ? B.max.z : B.min.z).applyMatrix4(inv); x0 = Math.min(x0, _corner.x); x1 = Math.max(x1, _corner.x); y0 = Math.min(y0, _corner.y); y1 = Math.max(y1, _corner.y) }
        cx = (x0 + x1) / 2; cy = (y0 + y1) / 2; const bw = (x1 - x0) / 2, bh = (y1 - y0) / 2; if (bw / bh > aspect) { hw = bw; hh = bw / aspect } else { hh = bh; hw = bh * aspect } }
      hw *= fit; hh *= fit
      Object.assign(s.cam, { left: cx - hw, right: cx + hw, top: cy + hh, bottom: cy - hh, near: 0.01, far: d * 2 + s.fitR * 4 }); s.cam.updateProjectionMatrix(); return
    }
    const fov = s.cam.fov * DEG, fill = 0.9 / fit
    let d = s.fitR / Math.sin(Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * aspect)) / 2), target = s.fitC.clone()
    const B = s.fitBox
    for (let it = 0; B && it < 3; it++) {
      s.cam.position.copy(_dir).multiplyScalar(d).add(target); s.cam.lookAt(target); s.cam.near = Math.max(0.005, d * 0.05); s.cam.far = d * 4 + s.fitR * 4; s.cam.updateProjectionMatrix(); s.cam.updateMatrixWorld(true)
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9
      for (let i = 0; i < 8; i++) { _corner.set(i & 1 ? B.max.x : B.min.x, i & 2 ? B.max.y : B.min.y, i & 4 ? B.max.z : B.min.z).project(s.cam); x0 = Math.min(x0, _corner.x); x1 = Math.max(x1, _corner.x); y0 = Math.min(y0, _corner.y); y1 = Math.max(y1, _corner.y) }
      const ext = Math.max((x1 - x0) / 2, (y1 - y0) / 2) / fill; if (!(ext > 1e-4)) break
      _right.setFromMatrixColumn(s.cam.matrixWorld, 0); _up.setFromMatrixColumn(s.cam.matrixWorld, 1)
      const th = Math.tan(fov / 2) * d; target.addScaledVector(_right, (x0 + x1) / 2 * th * aspect).addScaledVector(_up, (y0 + y1) / 2 * th)
      d *= ext
    }
    if (!B) d *= fit
    s.cam.position.copy(_dir).multiplyScalar(d).add(target); s.cam.lookAt(target)
    s.cam.near = Math.max(0.005, d * 0.05); s.cam.far = d * 4 + s.fitR * 4; s.cam.updateProjectionMatrix()
  }
  const sphereOf = (o) => { o.updateMatrixWorld(true); tmpB.setFromObject(o); tmpB.getBoundingSphere(tmpS); return { c: tmpS.center.clone(), r: tmpS.radius, box: tmpB.clone() } }
  const countTris = (o) => o.traverse((n) => { if (n.isMesh) S.tris += (n.geometry.index ? n.geometry.index.count : n.geometry.attributes.position.count) / 3 })
  const clipsOf = (g, mixerRoot) => { const mixer = new THREE.AnimationMixer(mixerRoot); const clips = {}; for (const a of g.animations) clips[a.name] = mixer.clipAction(a); return { mixer, clips } }
  const playOnce = (s, name, { at = null } = {}) => { const a = s.clips?.[name]; if (!a) return 0; for (const c of Object.values(s.clips)) if (c !== a && c.getClip().tracks.some((t) => a.getClip().tracks.some((u) => u.name === t.name))) c.stop()
    a.reset(); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.play(); if (at === 'end') { a.time = a.getClip().duration; s.mixer.update(0) } const d = a.getClip().duration; s.live = Math.max(s.live, d + 0.05); return d }

  // ── Bildschirm-Rechtecke ─────────────────────────────────────────────────────────────────────────────────────────────
  function rectOf(key) {
    const s = slots[key], L = s.L, k = view.k, pad = O.pad * k
    let w = L.w, h = L.h
    if (L.open) { const o = s.openK ?? 0; w += (L.open.w - L.w) * o; h += (L.open.h - L.h) * o }
    w *= k; h *= k; const dx = (L.dx || 0) * k
    const x = L.corner.endsWith('l') ? pad + dx : L.corner.endsWith('r') ? view.W - pad - dx - w : (view.W - w) / 2 + dx
    const y = L.corner.startsWith('t') ? pad + (L.dy || 0) * k : view.H - pad - (L.dy || 0) * k - h // y von oben (CSS)
    return { x, y, w, h }
  }
  function ensureRT(s, gl) {
    const L = s.L, maxW = (L.open?.w || L.w) * view.k * view.dpr, maxH = (L.open?.h || L.h) * view.k * view.dpr
    const w = Math.max(16, Math.round(maxW)), h = Math.max(16, Math.round(maxH))
    if (s.rt && s.rt.width === w && s.rt.height === h) return
    s.rt?.dispose(); s.rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: Math.min(4, gl.capabilities?.maxSamples ?? 4), depthBuffer: true })
    s.mat.uniforms.map.value = s.rt.texture; s.mat.uniforms.texel.value.set(1 / w, 1 / h); s.dirty = true
  }

  // ── Reaktionen (gefiltert, nur 2D) ───────────────────────────────────────────────────────────────────────────────────
  const IN = { yawRate: 0, accel: 0, yawF: 0, accF: 0 }
  const RM = () => (typeof O.reducedMotion === 'function' ? O.reducedMotion() : !!O.reducedMotion)
  const gainOf = (k) => O.gain[k] ?? O.gain['*'] ?? 0.8
  function kick(type, e = {}) {
    if (RM()) return
    const st = clamp(e.strength ?? 0.6, 0, 1)
    for (const k of ORDER) { const sp = slots[k].sp, g = gainOf(k)
      if (type === 'landing') { sp.vs += 9 * st * g; sp.vy -= 220 * st * g }
      else if (type === 'railImpact') { sp.vx += (e.side || 1) * 260 * st * g; sp.vt += (e.side || 1) * 2.2 * st * g }
      else if (type === 'takeoff') sp.vy += 120 * g
      else if (type === 'boost') sp.vy -= 60 * g }
  }
  // Squash eines einzelnen Props (Kontakt, Klick): Impuls auf die Stauch-Feder (sq > 0 = breiter und flacher)
  function squash(key, amount = 4) { if (RM()) return; const s = slots[key]; if (s) s.sp.vs += amount }
  function springs(dt) {
    IN.yawF += (IN.yawRate - IN.yawF) * Math.min(1, dt * 4); IN.accF += (IN.accel - IN.accF) * Math.min(1, dt * 3)
    const rm = RM(), tiltT = rm ? 0 : clamp(-IN.yawF * 0.045, -3.5 * DEG, 3.5 * DEG), dyT = rm ? 0 : clamp(-IN.accF * 0.6, -6, 6)
    for (const k of ORDER) { const sp = slots[k].sp, g = gainOf(k), K = 70, D = 11
      sp.vt += ((tiltT * g - sp.tilt) * K - sp.vt * D) * dt; sp.tilt += sp.vt * dt
      sp.vy += ((dyT * g - sp.dy) * K - sp.vy * D) * dt; sp.dy += sp.vy * dt
      sp.vx += ((0 - sp.dx) * K - sp.vx * D) * dt; sp.dx += sp.vx * dt
      sp.vs += ((0 - sp.sq) * 110 - sp.vs * 12) * dt; sp.sq += sp.vs * dt
      if (rm) { sp.tilt = sp.dy = sp.dx = sp.sq = 0 } }
  }
  function placeQuads() {
    const ink = O.ink?.(), ol = O.ol
    for (const k of ORDER) { const s = slots[k], r = rectOf(k); s.rect = r; const sp = s.sp, sq = clamp(sp.sq * 0.04, -O.sqMax, O.sqMax)
      s.pivot.position.set(r.x + r.w / 2 + sp.dx * view.k, view.H - (r.y + r.h) - sp.dy * view.k, 0) // Drehpunkt unten Mitte (steht auf der Bildkante)
      s.pivot.rotation.z = sp.tilt; s.pivot.scale.set(1 + sq * O.sqX, 1 - sq, 1)
      s.quad.scale.set(r.w, r.h, 1); s.quad.position.set(0, r.h / 2, 0)
      if (s.rt) { const ux = r.w * view.dpr / s.rt.width, uy = r.h * view.dpr / s.rt.height, U = s.mat.uniforms, f = view.k * view.dpr, so = s.o.ol || ol
        U.uvScale.value.set(ux, uy); U.ol.value.set(Math.max(1.2, so[0] * f), Math.max(1.2, so[1] * f)); U.inner.value = Math.max(1, f); if (ink) U.ink.value.copy(ink) }
      s.quad.visible = !!s.root && s.L.hidden !== true }
    ocam.left = 0; ocam.right = view.W; ocam.top = view.H; ocam.bottom = 0; ocam.updateProjectionMatrix()
  }

  // ── Interaktions-Zustände + Animations-Haken (Vorbereitung Micro-Interactions; ohne Animator keine sichtbare Wirkung) ───────
  const UI_STATES = ['idle', 'hover', 'active', 'pressed']
  const UI = new Map(), uiSubs = new Set(), animators = new Map()
  const uiOf = (key) => { if (!UI.has(key)) UI.set(key, { flags: { hover: false, pressed: false, focus: false, on: false }, state: 'idle', prev: 'idle', t: 0 }); return UI.get(key) }
  const slotOfKey = (key) => slots[key.split('.')[0]] || null
  function setUiFlag(key, flag, v) {
    const u = uiOf(key); if (!(flag in u.flags) || u.flags[flag] === !!v) return u.state; u.flags[flag] = !!v
    const f = u.flags, st = f.pressed ? 'pressed' : f.hover ? 'hover' : f.focus || f.on ? 'active' : 'idle'
    if (st !== u.state) { u.prev = u.state; u.state = st; u.t = 0; if (st === 'pressed' && O.fx) { const f = fxOf(key.split('.')[0]); f.press = 0; f.flash = 1 } for (const fn of [...uiSubs]) { try { fn(key, st, u.prev) } catch (e) { console.warn('[hud ui]', e) } } }
    return u.state
  }
  function runAnimators(dt, nodeOf) {
    for (const [key, u] of UI) { u.t += dt; const fn = animators.get(key); if (!fn) continue; const s = slotOfKey(key); if (!s?.root) continue
      try { if (fn({ key, state: u.state, prev: u.prev, t: u.t, dt, slot: s.key, node: nodeOf?.(key) || s.root, root: s.root })) s.dirty = true } catch (e) { console.warn('[hud animator]', key, e); animators.delete(key) } }
  }

  // ── Zustands-Darstellung (nur mit fx, HUD 3D R1 SPEC_WERTE): Hover/Fokus Lichthof 0,4 + 1,08 und −3° in 160 ms · Klick Blitz 1,0 + Squash
  // 1,16 × 0,80 → 0,94 × 1,08 → 1 in 300 ms · Aktiv Lichthof 0,85 ↔ 0,55 in 2,4 s · Hinweis Hinweisfarbe 0,95 ↔ 0,35 in 1,3 s + Wackeln ±7° alle 2,6 s.
  // Reduzierte Bewegung: nur Lichthof und Farbe. Alles wirkt auf das Overlay-Rechteck, nie auf die gecachte Ansicht.
  const FXS = new Map(), HALO_C = new THREE.Color('#fff6e0')
  const fxOf = (k) => { if (!FXS.has(k)) FXS.set(k, { h: 0, press: -1, flash: 0, hint: false, hintC: new THREE.Color('#ffc23d'), t: 0, sx: 1, sy: 1, rot: 0, haloA: 0, haloC: new THREE.Color() }); return FXS.get(k) }
  const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  function stepFx(dt) {
    if (!O.fx) return
    const rm = RM()
    for (const k of ORDER) {
      const f = fxOf(k); f.t += dt
      let hover = false, active = false
      for (const [key, u] of UI) { if (key !== k && !key.startsWith(k + '.')) continue; if (u.state === 'hover' || u.state === 'pressed') hover = true; if (u.state === 'active') active = true }
      f.h += ((hover ? 1 : 0) - f.h) * Math.min(1, dt / 0.16 * 3)
      let sq = [1, 1]
      if (f.press >= 0) { f.press += dt; const t = f.press; sq = t < 0.1 ? lerp2([1, 1], [1.16, 0.8], t / 0.1) : t < 0.2 ? lerp2([1.16, 0.8], [0.94, 1.08], (t - 0.1) / 0.1) : t < 0.3 ? lerp2([0.94, 1.08], [1, 1], (t - 0.2) / 0.1) : [1, 1]; if (t >= 0.3) f.press = -1 }
      f.flash = Math.max(0, f.flash - dt / 0.3)
      let rot = -3 * DEG * f.h, ha = 0.4 * f.h, hc = HALO_C
      if (active) ha = Math.max(ha, 0.55 + 0.3 * (0.5 + 0.5 * Math.cos(2 * Math.PI * f.t / 2.4)))
      if (f.hint) { ha = Math.max(ha, 0.35 + 0.6 * (0.5 + 0.5 * Math.cos(2 * Math.PI * f.t / 1.3))); hc = f.hintC; const w = f.t % 2.6; if (w < 0.5) rot += (f.hintWob ?? 7) * DEG * Math.sin(w / 0.5 * Math.PI * 3) * (1 - w / 0.5) }
      ha = Math.max(ha, f.flash); if (f.flash > 0.01) hc = HALO_C
      const sc = 1 + 0.08 * f.h
      f.sx = rm ? 1 : sq[0] * sc; f.sy = rm ? 1 : sq[1] * sc; f.rot = rm ? 0 : rot; f.haloA = clamp(ha, 0, 1); f.haloC.copy(hc)
    }
  }
  function applyFx() {
    if (!O.fx) return
    for (const k of ORDER) { const s = slots[k], f = FXS.get(k); if (!f) continue
      s.pivot.scale.x *= f.sx; s.pivot.scale.y *= f.sy; s.pivot.rotation.z += f.rot
      const U = s.mat.uniforms; U.haloA.value = f.haloA; U.haloC.value.copy(f.haloC); U.haloR.value = O.haloR * view.k * view.dpr }
  }

  return {
    S, slots, ORDER, overlay, view, REF,
    addSlot, fitCamera, sphereOf, countTris, clipsOf, playOnce, rectOf, kick, squash, setUiFlag, runAnimators,
    signal(sig) { if (sig) { IN.yawRate = sig.yawRate ?? IN.yawRate; IN.accel = sig.accel ?? IN.accel } },
    // je Spielschritt: Mixer der lebenden Props, Animatoren, Federn, Rechtecke
    step(dt, nodeOf) {
      for (const k of ORDER) { const s = slots[k]; if (s.mixer && s.live > 0) { s.mixer.update(dt); s.live -= dt; if (s.live <= 0) s.dirty = true } }
      runAnimators(dt, nodeOf); springs(dt); stepFx(dt); placeQuads(); applyFx()
    },
    // Overlay-Pass: gecachte Ansichten nachziehen, dann die Rechtecke über das fertige Bild legen
    draw(gl) {
      const t0 = performance.now()
      const W = gl.domElement.clientWidth || REF.W, H = gl.domElement.clientHeight || REF.H, dpr = gl.getPixelRatio()
      if (W !== view.W || H !== view.H || dpr !== view.dpr) { view.W = W; view.H = H; view.dpr = dpr; view.k = Math.min(W / REF.W, H / REF.H) * (W < 760 ? O.phoneK : 1); placeQuads() }
      for (const k of ORDER) { const s = slots[k]; if (!s.root || s.L.hidden) continue; ensureRT(s, gl)
        if (s.dirty || s.live > 0) { const r = s.rect; if (!s.ortho) { s.cam.aspect = r.w / r.h; s.cam.updateProjectionMatrix() }
          s.rt.viewport.set(0, 0, Math.round(r.w * view.dpr), Math.round(r.h * view.dpr)); s.rt.scissor.copy(s.rt.viewport); gl.setRenderTarget(s.rt); gl.clear(true, true, false)
          gl.render(s.scene, s.cam); s.dirty = false; S.rtRenders++ } }
      gl.setRenderTarget(null); gl.clearDepth(); gl.render(overlay, ocam)
      const ms = performance.now() - t0; S.draws++; S.drawMs += ms; S.drawMsMax = Math.max(S.drawMsMax, ms); S.ring[S.ri++ % S.ring.length] = ms
    },
    pressFx: (key, flash = false) => { if (!O.fx) return; const f = fxOf(key); f.press = 0; if (flash) f.flash = 1 }, // Squash/Stretch wie Klick, ohne UI-Zustand (Kontakt, Hochzählen)
    setHint: (key, on, color = '#ffc23d', o = null) => { const f = fxOf(key); f.hint = !!on; f.hintC.set(color); f.hintWob = o?.wob ?? 7 }, /* o.wob: Wackel-Ausschlag in Grad (Standard 7) */ fxState: (key) => { const f = FXS.get(key); return f ? { haloA: +f.haloA.toFixed(2), sx: +f.sx.toFixed(3), rot: +(f.rot / DEG).toFixed(1), hint: f.hint } : null },
    uiStates: UI_STATES, uiState: (key) => uiOf(key).state, uiAll: () => Object.fromEntries([...UI].map(([k, u]) => [k, u.state])),
    onUiState: (fn) => { uiSubs.add(fn); return () => uiSubs.delete(fn) },
    setAnimator: (key, fn) => { if (fn) animators.set(key, fn); else animators.delete(key) },
    rects: () => Object.fromEntries(ORDER.map((k) => [k, { ...slots[k].rect }])),
    perf: () => ({ rtRenders: S.rtRenders, draws: S.draws, drawMsAvg: S.draws ? +(S.drawMs / S.draws).toFixed(4) : 0, drawMsMax: +S.drawMsMax.toFixed(3),
      drawMsP95: (() => { const n = Math.min(S.draws, S.ring.length); if (!n) return 0; const a = Array.from(S.ring.slice(0, n)).sort((x, y) => x - y); return +a[Math.floor(n * 0.95)].toFixed(4) })(),
      updMsAvg: S.updates ? +(S.updMs / S.updates).toFixed(4) : 0, tris: Math.round(S.tris), quads: ORDER.filter((k) => slots[k].quad.visible).length,
      rtBytes: ORDER.reduce((b, k) => b + (slots[k].rt ? slots[k].rt.width * slots[k].rt.height * (8 + 4) * (slots[k].rt.samples > 1 ? 2 : 1) : 0), 0) }), // Halbfloat-RGBA + Tiefe; MSAA ≈ doppelt
    motion: () => +ORDER.reduce((m, k) => { const sp = slots[k].sp; return Math.max(m, Math.abs(sp.tilt) * 57.3, Math.abs(sp.dy), Math.abs(sp.dx), Math.abs(sp.sq)) }, 0).toFixed(3),
    live: () => ORDER.filter((k) => slots[k].live > 0),
    resetStats: () => { S.rtRenders = 0; S.draws = 0; S.drawMs = 0; S.drawMsMax = 0; S.ri = 0; S.updMs = 0; S.updates = 0 },
    dispose(keep = new Set()) {
      for (const k of ORDER) { const s = slots[k]; s.rt?.dispose(); s.mat.dispose(); s.quad.geometry.dispose(); s.mixer?.stopAllAction(); s.scene.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); for (const m of [].concat(o.material)) { if (!keep.has(m)) { m.map?.dispose(); m.dispose() } } } }) }
    },
  }
}
