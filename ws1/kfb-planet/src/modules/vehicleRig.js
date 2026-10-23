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
export const PLUME = Object.freeze({ idle: 0.12, lenIdle: 1.6, lenMax: 9, boostLen: 1.45, diamonds: 0.62, flicker: 0.18,
  // Schockdiamanten weich (Georg 23.10.: „einzelne Kreise“ / Kritiker R1 „Ring-/Kugelstapel“): Bandform pow(cos, diamondPow) – vorher 6 (abgesetzte Scheiben),
  // jetzt breit ineinander verlaufend; Stärke diamondsSoft statt diamonds (alt bleibt als Wert für A/B)
  diamondPow: 1.5, diamondsSoft: 0.3,
  // Nacht: Fahne gedämpft (Vorder- und Rückseite und überlappende Fahnen addieren sich sonst über 1 → weißlich) und der heiße Kernbereich kürzer (Exponent + nightCore)
  nightDim: 0.35, nightCore: 3.0 })
const SPARKS = 96

const VERT = /* glsl */`varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`
// Fahne: Kegel entlang +Z, breites Ende an der Düse (CylinderGeometry: uv.y = 1 oben → nach der Drehung an der Düse); ax = 0 Düse … 1 Spitze. Kern heiß-hell → Fahnenfarbe → aus; weiche Ränder über den Blickwinkel; Schockdiamanten als helle Bänder
// Nacht (Georg 23.10., glow Standard): additiv ohne Tonemapping liefen Kern- und Fahnenfarbe × (1,2 + 1,6·Schub) in allen Kanälen über 1 → weiße Bänder.
// uNight (0 Tag … 1 Nacht, aus der Lichtmenge des einen Rigs, vom Wirt) begrenzt die Farbe farbtreu (durch den größten Kanal geteilt) statt kanalweise
// abzuschneiden: Fahne bleibt in der Antriebsfarbe, Kern heiß-gelb. Tags (uNight = 0) unverändert.
const HUE_CLAMP = /* glsl */`vec3 hueClamp(vec3 o, float k){ float m = max(o.r, max(o.g, o.b)); return mix(o, o / max(1., m), k); }`
const PLUME_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; uniform float uTime; uniform float uDiam; uniform float uSeed; uniform float uDiamPow; uniform float uNight; uniform float uNightDim; uniform float uNightCore;
${HUE_CLAMP}
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
float h(float n){ return fract(sin(n)*43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); return mix(h(i), h(i+1.), f*f*(3.-2.*f)); }
void main(){ float ax = 1.0 - vUv.y, a = vUv.y; float rim = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);
  float fl = 0.82 + 0.18 * n1(ax*9. - uTime*23. + uSeed) + 0.1 * n1(vUv.x*31. + uTime*17.);
  float d = uDiam * smoothstep(0.55, 1.0, uThrust) * pow(0.5 + 0.5*cos((ax*7.5 - uTime*1.5)*6.2832), uDiamPow) * a;
  vec3 c = mix(uPlume, uCore, pow(a, 3.2 + uNightCore * uNight) + d);
  float al = rim * pow(a, 1.25) * fl * (0.35 + 0.65*uThrust) + d*0.6;
  gl_FragColor = vec4(hueClamp(c * (1.2 + 1.6*uThrust), uNight) * (1. - uNightDim * uNight), clamp(al, 0., 1.)); }`
const CORE_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; uniform float uNight; varying vec2 vUv;
${HUE_CLAMP}
void main(){ float r = length(vUv - 0.5) * 2.; float k = smoothstep(1.0, 0.0, r);
  vec3 c = mix(uPlume, uCore, smoothstep(0.75, 0.0, r)); gl_FragColor = vec4(hueClamp(c * (0.9 + 2.2*uThrust), uNight), k * (0.45 + 0.55*uThrust)); }`
const FAN_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; uniform float uAngle; varying vec2 vUv;
void main(){ vec2 p = vUv - 0.5; float r = length(p) * 2.; if (r > 1.) discard; float a = atan(p.y, p.x) + uAngle;
  float blades = 0.5 + 0.5 * cos(a * 7.); float blur = mix(pow(blades, 3.), 0.55, smoothstep(0.3, 1.0, uThrust));
  float ring = smoothstep(0.78, 0.92, r) * smoothstep(1.0, 0.94, r); float hub = smoothstep(0.22, 0.12, r);
  vec3 c = mix(uPlume, uCore, ring + hub*0.6); float al = (ring * (0.5 + 0.5*uThrust) + blur * (0.18 + 0.4*uThrust) * smoothstep(0.95, 0.3, r) + hub*0.4);
  gl_FragColor = vec4(c * (0.8 + 1.4*uThrust), clamp(al, 0., 1.)); }`
// Knet-Lüfter (V-654, Georg 22.10.: Lüfter auch Knete, Leuchtring bleibt als Effekt): matte Scheibe in drei Tonstufen (Nabe hell, Flügel, Spalten dunkel),
// Flügel verwischen mit dem Schub zu einem Mittelton; normal geblendet mit Tonemapping. Darüber der Leuchtring allein (RING_FRAG, additiv).
// Erster Versuch mit hellen Tönen wirkte wie Radkappen (Prüfbild 22.10.) → dunkler Rotor, der Ring leuchtet davor.
const CLAY_FAN_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; uniform float uAngle; varying vec2 vUv;
void main(){ vec2 p = vUv - 0.5; float r = length(p) * 2.; if (r > 0.97) discard; float a = atan(p.y, p.x) + uAngle;
  float blades = 0.5 + 0.5 * cos(a * 7.); float v = mix(blades, 0.5, smoothstep(0.25, 0.9, uThrust)); vec3 clay = mix(vec3(0.13, 0.12, 0.115), uPlume, 0.18);   /* dunkler Knet-Rotor: der Leuchtring und die Flügelkanten tragen den Effekt */
  vec3 c = r < 0.2 ? clay * 1.8 : v > 0.62 ? clay * 1.25 : v > 0.38 ? clay : clay * 0.55;
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
const RING_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; varying vec2 vUv;
void main(){ float r = length(vUv - 0.5) * 2.; float ring = smoothstep(0.78, 0.92, r) * smoothstep(1.0, 0.94, r); if (ring <= 0.001) discard;
  gl_FragColor = vec4(mix(uPlume, uCore, ring) * (0.8 + 1.4*uThrust), ring * (0.5 + 0.5*uThrust)); }`
const SPARK_VERT = /* glsl */`attribute float aLife; attribute float aSize; varying float vLife; uniform float uScale;
void main(){ vLife = aLife; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = aSize * uScale * (0.4 + aLife) / max(0.2, -mv.z); gl_Position = projectionMatrix * mv; }`
// Knet-Funken (style 'clay', Georg 22.10.: eigene Zusätze in Knete): feste runde Krümel in Funken-/Kernfarbe, normal geblendet, kleiner – kein Überstrahlen
const CLAY_SPARK_FRAG = /* glsl */`uniform vec3 uSpark; uniform vec3 uCore; varying float vLife;
void main(){ if (vLife <= 0.) discard; vec2 p = gl_PointCoord - 0.5; float r = length(p); if (r > 0.5) discard; vec3 c = mix(uSpark, uCore, vLife * 0.2) * (r < 0.28 ? 1.1 : 0.8);
  gl_FragColor = vec4(c, smoothstep(0.5, 0.42, r) * min(1.0, vLife * 1.6));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
const SPARK_FRAG = /* glsl */`uniform vec3 uSpark; uniform vec3 uCore; uniform float uNight; varying float vLife;
${HUE_CLAMP}
void main(){ if (vLife <= 0.) discard; vec2 p = gl_PointCoord - 0.5; float k = smoothstep(0.5, 0.0, length(p)); gl_FragColor = vec4(hueClamp(mix(uSpark, uCore, vLife) * 2.2, uNight), k * vLife); }`

// Knet-Flamme (V-654 C5, CANON Gebiet 11 „eine Masse mit Beulen, nie Kugelstapel … 2–3 Tonstufen, keine Emission“): style 'clay'. Eine tropfenförmige
// Masse (Drehkörper), deren Umriss zwei bis drei überlappende Beulen trägt, die langsam nach hinten wandern; Farbe in drei Stufen (Kern, Fahne, Rand)
// nach Blickwinkel, normal geblendet, mit Tonemapping (kein Leuchten). Keine Schockdiamanten, kein Glühkern.
const CLAY_VERT = /* glsl */`uniform float uTime; uniform float uSeed; uniform float uThrust; varying vec3 vN; varying vec3 vV; varying float vAx;
void main(){ float ax = position.z; vAx = ax; float lob = 1.0 + 0.16 * sin(ax * 9.0 - uTime * (5.0 + 6.0 * uThrust) + uSeed) * smoothstep(0.05, 0.35, ax) + 0.12 * sin(ax * 17.0 - uTime * 9.0 + uSeed * 1.7) * smoothstep(0.2, 0.6, ax);
  vec3 p = vec3(position.xy * lob, position.z); vec4 mv = modelViewMatrix * vec4(p, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`
// R3 (Kritiker: „flache 2D-Form mit Kontur“): Tonstufen weich ineinander, Oberseite heller (Licht von oben = Volumen), Rand durchscheinend statt dunkler
// Kontur; dazu ein schwacher additiver Glutkern innen (GLOW_FRAG), damit die Flamme Licht hat.
const CLAY_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; varying vec3 vN; varying vec3 vV; varying float vAx;
void main(){ vec3 n = normalize(vN); float f = abs(dot(n, normalize(vV))); float k = f * (1.0 - 0.5 * vAx);
  vec3 warm = mix(uPlume, vec3(1.0, 0.78, 0.38), 0.55), rim = uPlume * 0.8;
  vec3 c = mix(rim, mix(uPlume, warm, 0.35), smoothstep(0.22, 0.42, k)); c = mix(c, mix(warm, uCore, 0.3), smoothstep(0.6, 0.78, k));
  c *= 0.82 + 0.36 * clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
  float al = smoothstep(1.0, 0.82, vAx) * smoothstep(0.04, 0.32, f) * (0.82 + 0.18 * uThrust);
  gl_FragColor = vec4(c, al);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
const GLOW_FRAG = /* glsl */`uniform vec3 uCore; uniform vec3 uPlume; uniform float uThrust; varying vec3 vN; varying vec3 vV; varying float vAx;
void main(){ float f = abs(dot(normalize(vN), normalize(vV))); float a = pow(f, 2.5) * smoothstep(1.0, 0.3, vAx) * (0.12 + 0.2 * uThrust);
  gl_FragColor = vec4(mix(uPlume, uCore, 0.6) * a, a); }`
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
// Staub-Probe (Lead 23.10., WS0 Particle-First, Hash dust2=1): Größe in Bildschirm-Pixeln gedeckelt (uMaxPx = 24 CSS-px × Pixeldichte, ≈ ¼ Racer-Höhe im Bild;
// gemessen waren bis 164 CSS-px), Untergrenze 3 Gerätepixel (kleinere werden blasser statt kleiner – kein Flimmern), nahe der Kamera (< 1,5 m) ausgeblendet.
// Drift (k2t signals.drift −1…1) wirft den Staub zur Kurvenaußenseite und Ausstoß bleibt gleich (× 1,35 und × 1,15 überschrieben im Drift lebende Partikel; der seitliche Wurf genügt – Pool 160 bleibt).
export const DUST2 = Object.freeze({ on: typeof location !== 'undefined' && /(^|[#,])dust2=1(,|$)/.test(location.hash), maxCss: 24, minPx: 3, near: [0.6, 1.5], driftRate: 0, driftSide: [3.0, 4.6], driftSpawn: 0.75, alpha: 0.75, sizeK: 3.0, spreadK: 0.45, riseK: 0.6, inherit: 0, count: 320, rateK: 2, maxCssYoung: 40 })   // r3: Pool 320, Ausstoß × 2 (× 2 belegt ≤ 233 von 320; × 2,5 überschrieb lebende), junge Tupfer bis 40 CSS-px   // inherit: Anteil der Wagengeschwindigkeit – 0,65 versteckte den Staub unter dem Wagen (Kontrast 3/255), daher aus   // r2 (Georg 23.10.): Deckkraft und Größe (bis zum Deckel) – die Fahne wirkt durch Menge und Deckung   // driftSpawn: Entstehung zur Außenseite versetzt (m × unit), wie vom ausbrechenden Heck
// Prüfhilfe (Staub-Probe): zuletzt angekommenes Drift-Signal; shader('old'|'new') tauscht nur das Material (A/B-Standbild im selben Moment)
export const DUST2_DBG = { drift: 0, rigs: [], shader(v) { for (const r of this.rigs) { r.world.material = v === 'old' ? r.old : r.neu; r.geo.setAttribute('aColor', v === 'old' ? r.colOld : r.colNew) } return v } }   // Shader UND Farbe (alte Farbe je Partikel mitgeführt)
if (DUST2.on && typeof window !== 'undefined') window.__kfbDust2 = DUST2_DBG
// r2: Farbe im Licht des einen Rigs (uLight = Bestrahlung einer nach oben zeigenden Fläche aus Sonne und Himmel, nur gelesen, kein Zusatzlicht), danach
// Tonemapping und Farbraum wie die Szene (vorher schrieb der Staub lineare Werte ins sRGB-Bild → wirkte dunkel und grünlich)
// r3: Deckel nach Alter – junge Tupfer (am Wagen) bis uMaxPxYoung (40 CSS-px), bis zur halben Lebenszeit auf uMaxPx (24) und blasser; Profil Gauß bis 0 am Rand
const DUST2_VERT = /* glsl */`attribute float aLife; attribute float aSize; attribute vec3 aColor; varying float vLife; varying vec3 vColor; varying float vFade; uniform float uScale, uMaxPx, uMaxPxYoung, uMinPx, uSizeK; uniform vec2 uNear;
void main(){ vLife = aLife; vColor = aColor; vec4 mv = modelViewMatrix * vec4(position,1.); float s = aSize * uSizeK * uScale * (0.9 + 0.4 * (1.0 - aLife)) / max(0.2, -mv.z);
  float cap = mix(uMaxPxYoung, uMaxPx, smoothstep(0.0, 0.5, 1.0 - aLife));
  gl_PointSize = clamp(s, uMinPx, cap); vFade = clamp(s / uMinPx, 0., 1.) * smoothstep(uNear.x, uNear.y, -mv.z); gl_Position = projectionMatrix * mv; }`
const DUST2_FRAG = /* glsl */`varying float vLife; varying vec3 vColor; varying float vFade; uniform vec3 uLight; uniform float uAlpha, uCov;
void main(){ if (vLife <= 0. || vFade <= 0.) discard; vec2 p = gl_PointCoord - 0.5; float r = length(p) * 2.0;
  float k = max(0.0, (exp(-3.2 * r * r) - exp(-3.2)) / (1.0 - exp(-3.2)));   // Gauß, am Rand exakt 0 (keine Kante, auch bei 40 px)
  float a = k * uAlpha * vFade * (0.35 + 0.65 * smoothstep(0.0, 0.6, vLife));   // mit dem Alter blasser
  if (uCov > 0.5) { gl_FragColor = vec4(1.0, 1.0, 1.0, a); return; }   // Prüfhilfe: Deckung (weiß, ohne Tonemapping)
  gl_FragColor = vec4(vColor * uLight * (0.92 + 0.12*vLife), a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`
const DUST_FRAG = /* glsl */`varying float vLife; varying vec3 vColor;
void main(){ if (vLife <= 0.) discard; vec2 p = gl_PointCoord - 0.5; float k = smoothstep(0.5, 0.15, length(p)); gl_FragColor = vec4(vColor * (0.85 + 0.25*vLife), k * vLife * 0.55); }`

export function createVehicleRig({ anchors = [], hover = [], glow = {}, unit = 1, engine = {}, seed = 1, style = 'glow', fanStyle = style } = {}) {   // fanStyle: Lüfter getrennt von der Flamme (Georg 23.10.: Flamme glow, Lüfter bleibt Knete)
  const root = new THREE.Group(); root.name = 'vehicle-rig'
  const stretch = new THREE.Group(); stretch.name = 'vehicle-rig-stretch'; root.add(stretch) // Wirt hängt das Modell hier ein (Modell + Anker verformen gemeinsam)
  const fx = new THREE.Group(); fx.name = 'vehicle-rig-fx'; stretch.add(fx)
  const C = { core: new THREE.Color(glow.core || '#fff1c9'), plume: new THREE.Color(glow.plume || '#ffa97a'), spark: new THREE.Color(glow.spark || '#ffae3d') }
  const shared = { uCore: { value: C.core }, uPlume: { value: C.plume }, uTime: { value: 0 }, uNight: { value: 0 } }
  const Z = new THREE.Vector3(0, 0, 1), cone = new THREE.CylinderGeometry(1, 0.12, 1, 20, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 0.5) // breit an der Düse (z 0), Spitze bei z 1
  const disc = new THREE.CircleGeometry(1, 24), units = [], clayGeo = style === 'clay' ? clayFlameGeo() : null
  anchors.forEach((a, i) => {
    const g = new THREE.Group(); g.name = 'anchor:' + a.id; g.position.fromArray(a.pos).multiplyScalar(unit)
    g.quaternion.setFromUnitVectors(Z, new THREE.Vector3(...a.dir).normalize()); fx.add(g)
    const r = a.radius * unit, ro = (a.outerRadius || a.radius) * unit, u = { a, g, r, ro, type: a.type || 'thrust', mats: [] }
    if (u.type === 'fan' && fanStyle === 'clay') {
      const m = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: CLAY_FAN_FRAG, uniforms: { ...shared, uThrust: { value: 0 }, uAngle: { value: 0 } }, side: THREE.DoubleSide })
      const d = new THREE.Mesh(disc, m); d.scale.setScalar(ro * 0.98); d.position.z = r * 0.06; d.renderOrder = 2; g.add(d)
      const mr = additive(RING_FRAG, { ...shared, uThrust: { value: 0 } }, { side: THREE.DoubleSide }), ring = new THREE.Mesh(disc, mr); ring.scale.setScalar(ro * 1.02); ring.position.z = r * 0.08; ring.renderOrder = 3; g.add(ring)
      u.fan = d; u.mats.push(m, mr)
    } else if (u.type === 'fan') {
      const m = additive(FAN_FRAG, { ...shared, uThrust: { value: 0 }, uAngle: { value: 0 } }, { side: THREE.DoubleSide })
      const d = new THREE.Mesh(disc, m); d.scale.setScalar(ro * 1.02); d.position.z = r * 0.06; d.renderOrder = 3; g.add(d); u.fan = d; u.mats.push(m)
    } else if (clayGeo) {
      const mp = new THREE.ShaderMaterial({ vertexShader: CLAY_VERT, fragmentShader: CLAY_FRAG, uniforms: { ...shared, uThrust: { value: 0 }, uSeed: { value: i * 7.13 + seed } }, transparent: true, depthWrite: false, side: THREE.DoubleSide })
      const plume = new THREE.Mesh(clayGeo, mp); plume.renderOrder = 4; plume.frustumCulled = false; g.add(plume); u.plume = plume; u.clay = true; u.mats.push(mp)
      const mg = new THREE.ShaderMaterial({ vertexShader: CLAY_VERT, fragmentShader: GLOW_FRAG, uniforms: { ...shared, uThrust: { value: 0 }, uSeed: { value: i * 7.13 + seed } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
      const glowIn = new THREE.Mesh(clayGeo, mg); glowIn.scale.set(0.55, 0.55, 0.8); glowIn.renderOrder = 5; glowIn.frustumCulled = false; plume.add(glowIn); u.mats.push(mg)   // Glutkern im Inneren
    } else {
      const mc = additive(CORE_FRAG, { ...shared, uThrust: { value: 0 } }, { side: THREE.DoubleSide })
      const core = new THREE.Mesh(disc, mc); core.scale.setScalar(r * 0.95); core.position.z = -r * 0.25; core.renderOrder = 3; g.add(core)
      const mp = additive(PLUME_FRAG, { ...shared, uThrust: { value: 0 }, uDiam: { value: PLUME.diamondsSoft }, uDiamPow: { value: PLUME.diamondPow }, uNightDim: { value: PLUME.nightDim }, uNightCore: { value: PLUME.nightCore }, uSeed: { value: i * 7.13 + seed } }, { side: THREE.DoubleSide })
      const plume = new THREE.Mesh(cone, mp); plume.renderOrder = 4; plume.frustumCulled = false; g.add(plume); u.core = core; u.plume = plume; u.mats.push(mc, mp)
    }
    units.push(u)
  })
  // Funken-Pool (Backfire, Schaltknall, Bremsen): Weltraum der Fahrzeug-Darstellung, feste Größe
  const sp = { pos: new Float32Array(SPARKS * 3), vel: new Float32Array(SPARKS * 3), life: new Float32Array(SPARKS), max: new Float32Array(SPARKS), size: new Float32Array(SPARKS), next: 0 }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp.pos, 3)); sg.setAttribute('aLife', new THREE.BufferAttribute(sp.life, 1)); sg.setAttribute('aSize', new THREE.BufferAttribute(sp.size, 1))
  const sm = clayGeo ? new THREE.ShaderMaterial({ vertexShader: SPARK_VERT, fragmentShader: CLAY_SPARK_FRAG, uniforms: { uSpark: { value: C.spark }, uCore: { value: C.core }, uScale: { value: 85 * unit } }, transparent: true, depthWrite: false })
    : new THREE.ShaderMaterial({ vertexShader: SPARK_VERT, fragmentShader: SPARK_FRAG, uniforms: { uSpark: { value: C.spark }, uCore: { value: C.core }, uNight: shared.uNight, uScale: { value: 300 * unit } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })
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
  const NP = DUST2.on ? DUST2.count : DUST.count   // r3 (Lead 23.10.): Pool 320 nur mit dust2=1 (Befund r2: Lücken bei 160)
  const du = { pos: new Float32Array(NP * 3), vel: new Float32Array(NP * 3), life: new Float32Array(NP), max: new Float32Array(NP), size: new Float32Array(NP), col: new Float32Array(NP * 3), next: 0, acc: 0 }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(du.pos, 3)); dg.setAttribute('aLife', new THREE.BufferAttribute(du.life, 1)); dg.setAttribute('aSize', new THREE.BufferAttribute(du.size, 1)); dg.setAttribute('aColor', new THREE.BufferAttribute(du.col, 3))
  const dustCol = new THREE.Color('#cdb48c'), _c = new THREE.Color()
  const dm = DUST2.on ? new THREE.ShaderMaterial({ vertexShader: DUST2_VERT, fragmentShader: DUST2_FRAG, uniforms: { uScale: { value: 300 * unit }, uMaxPx: { value: DUST2.maxCss }, uMinPx: { value: DUST2.minPx }, uNear: { value: new THREE.Vector2(DUST2.near[0] * unit, DUST2.near[1] * unit) }, uSizeK: { value: DUST2.sizeK }, uAlpha: { value: DUST2.alpha }, uMaxPxYoung: { value: DUST2.maxCssYoung }, uCov: { value: 0 }, uLight: { value: new THREE.Color(1, 1, 1) } }, transparent: true, depthWrite: false })
    : new THREE.ShaderMaterial({ vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, uniforms: { uScale: { value: 300 * unit } }, transparent: true, depthWrite: false })
  const world = new THREE.Points(dg, dm); world.name = 'vehicle-rig-dust'; world.frustumCulled = false; world.renderOrder = 2
  // Deckel in CSS-Pixeln je Pixeldichte; Licht aus dem einen Rig (Sonne · max(0, Höhe) + Himmel, wie eine nach oben zeigende Lambert-Fläche)
  let rigSun = null, rigHemi = null; const _sd = new THREE.Vector3()
  if (DUST2.on) world.onBeforeRender = (r, scene) => { dm.uniforms.uMaxPx.value = DUST2.maxCss * r.getPixelRatio(); dm.uniforms.uMaxPxYoung.value = DUST2.maxCssYoung * r.getPixelRatio()
    if (!rigSun || !rigSun.parent) { rigSun = scene.getObjectByName('sun'); rigHemi = scene.getObjectByName('hemi') }
    const L = dm.uniforms.uLight.value.setRGB(0, 0, 0)
    if (rigSun?.isDirectionalLight) { _sd.copy(rigSun.position).sub(rigSun.target.position).normalize(); L.r += rigSun.color.r * rigSun.intensity * Math.max(0, _sd.y); L.g += rigSun.color.g * rigSun.intensity * Math.max(0, _sd.y); L.b += rigSun.color.b * rigSun.intensity * Math.max(0, _sd.y) }
    if (rigHemi?.isHemisphereLight) { L.r += rigHemi.color.r * rigHemi.intensity; L.g += rigHemi.color.g * rigHemi.intensity; L.b += rigHemi.color.b * rigHemi.intensity }
    if (!rigSun && !rigHemi) L.setRGB(1, 1, 1) }
  const colOld = DUST2.on ? new Float32Array(NP * 3) : null, colOldAttr = colOld ? new THREE.BufferAttribute(colOld, 3) : null
  if (DUST2.on) DUST2_DBG.rigs.push({ world, geo: dg, colNew: dg.attributes.aColor, colOld: colOldAttr, neu: dm, old: new THREE.ShaderMaterial({ vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, uniforms: { uScale: dm.uniforms.uScale }, transparent: true, depthWrite: false }) })
  const _q = new THREE.Quaternion(), _side = new THREE.Vector3(), _cp = new THREE.Vector3(), _cpv = new THREE.Vector4(0, 0, 0, 0), _cv = new THREE.Vector3(), _hc = new THREE.Vector3()
  const _w = new THREE.Vector3()
  const dustStep = (dt, speed01, groundAt, colorAt, drift = 0, colorAtOld = null) => { const t0 = DUST2.on ? performance.now() : 0
    const dr = DUST2.on ? Math.max(-1, Math.min(1, drift || 0)) : 0, da = Math.abs(dr); if (DUST2.on) DUST2_DBG.drift = dr
    if (DUST2.on) { stretch.getWorldPosition(_cp); if (_cpv.w && dt > 0) _cv.set((_cp.x - _cpv.x) / dt, 0, (_cp.z - _cpv.z) / dt); _cpv.set(_cp.x, _cp.y, _cp.z, 1); if (_cv.length() > 80) _cv.set(0, 0, 0) }   // Wagengeschwindigkeit (waagrecht)
    if (da > 0.02) { stretch.getWorldQuaternion(_q); _side.set(1, 0, 0).applyQuaternion(_q).setY(0).normalize() }   // Querachse des Wagens (Vorzeichen: +drift = nach rechts)
    if (DUST2.on && hov.length > 1) { _hc.set(0, 0, 0); for (const o of hov) { o.getWorldPosition(_w); _hc.add(_w) } _hc.multiplyScalar(1 / hov.length) }   // r3: Mitte der Schwebe-Anker
    if (groundAt && hov.length && speed01 > DUST.minSpeed) for (const o of hov) {
      o.getWorldPosition(_w); const gy = groundAt(_w.x, _w.z); if (gy == null) continue; const h = _w.y - gy, k = Math.max(0, 1 - h / (DUST.hMax * unit * 1.6)) * Math.min(1, speed01 * 1.6)
      du.acc += DUST.rate * k * dt * (1 + DUST2.driftRate * da) * (DUST2.on ? DUST2.rateK : 1)
      while (du.acc >= 1) { du.acc -= 1; const j = du.next; du.next = (du.next + 1) % NP
        du.pos[j * 3] = _w.x + (rand() - 0.5) * 0.6 * unit; du.pos[j * 3 + 1] = gy + 0.05; du.pos[j * 3 + 2] = _w.z + (rand() - 0.5) * 0.6 * unit
        if (DUST2.on && hov.length > 1) { const u = rand(); du.pos[j * 3] += (_hc.x - _w.x) * u; du.pos[j * 3 + 2] += (_hc.z - _w.z) * u }   // r3: Entstehung über die ganze Breite (eine Fahne statt zweier Spuren je Anker)
        const a = rand() * Math.PI * 2, sp = (DUST.spread[0] + rand() * (DUST.spread[1] - DUST.spread[0])) * unit; du.vel[j * 3] = Math.cos(a) * sp; du.vel[j * 3 + 1] = (DUST.rise[0] + rand() * (DUST.rise[1] - DUST.rise[0])) * unit; du.vel[j * 3 + 2] = Math.sin(a) * sp
        if (DUST2.on) { du.vel[j * 3] = du.vel[j * 3] * DUST2.spreadK + _cv.x * DUST2.inherit; du.vel[j * 3 + 2] = du.vel[j * 3 + 2] * DUST2.spreadK + _cv.z * DUST2.inherit; du.vel[j * 3 + 1] *= DUST2.riseK }   // r2: zusammenhängende Fahne statt Streuung
        if (da > 0.02) { du.pos[j * 3] += _side.x * dr * DUST2.driftSpawn * unit; du.pos[j * 3 + 2] += _side.z * dr * DUST2.driftSpawn * unit; const rs = 1 - 0.5 * da; du.vel[j * 3] *= rs; du.vel[j * 3 + 2] *= rs; const ls = dr * (DUST2.driftSide[0] + rand() * (DUST2.driftSide[1] - DUST2.driftSide[0])) * unit * da; du.vel[j * 3] += _side.x * ls; du.vel[j * 3 + 2] += _side.z * ls }   // zur Kurvenaußenseite geworfen
        const cc = colorAt ? _c.set(colorAt(_w.x, _w.z) || dustCol) : dustCol, jit = 0.9 + 0.2 * rand(); du.col[j * 3] = cc.r * jit; du.col[j * 3 + 1] = cc.g * jit; du.col[j * 3 + 2] = cc.b * jit
        if (colOld) { const co = colorAtOld ? _c.set(colorAtOld(_w.x, _w.z) || dustCol) : dustCol; colOld[j * 3] = co.r * jit; colOld[j * 3 + 1] = co.g * jit; colOld[j * 3 + 2] = co.b * jit }   // Prüfhilfe A/B
        du.max[j] = DUST.life[0] + (DUST.life[1] - DUST.life[0]) * rand(); du.life[j] = 1; du.size[j] = (DUST.size[0] + (DUST.size[1] - DUST.size[0]) * rand()) }
    }
    for (let j = 0; j < NP; j++) { if (du.life[j] <= 0) continue; du.life[j] -= dt / du.max[j]; if (du.life[j] < 0) du.life[j] = 0
      du.vel[j * 3 + 1] -= 1.8 * unit * dt; for (let k = 0; k < 3; k++) { du.vel[j * 3 + k] *= 1 - Math.min(1, dt * 1.2); du.pos[j * 3 + k] += du.vel[j * 3 + k] * dt } }
    dg.attributes.position.needsUpdate = true; dg.attributes.aLife.needsUpdate = true; dg.attributes.aSize.needsUpdate = true; dg.attributes.aColor.needsUpdate = true; if (colOldAttr) colOldAttr.needsUpdate = true
    if (DUST2.on) { DUST2_DBG.ms = (DUST2_DBG.ms || 0) + performance.now() - t0; DUST2_DBG.n = (DUST2_DBG.n || 0) + 1 }   // CPU-Zeit je Bild (Prüfhilfe)
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
      const { throttle = 0, speed01 = 0, boost = false, brake = false, groundAt = null, groundColorAt = null, groundColorAtOld = null, drift = 0, night = 0 } = inp
      shared.uNight.value = Math.min(1, Math.max(0, night))   // vom Wirt aus der Lichtmenge des Rigs (0 = Tag: Leuchten unverändert)
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
      springStep(dt); dustStep(dt, speed01, groundAt, groundColorAt, drift, groundColorAtOld)
      return ev
    },
    info: () => ({ schema: VEHICLE_RIG_SCHEMA, style, fanStyle, night: +shared.uNight.value.toFixed(3), anchors: units.length, thrust: +state.thrust.toFixed(3), gear: eng.gear, rpm: +eng.rpm.toFixed(3), boost: +state.boost.toFixed(2), events: { ...state.events }, stretch: [+stretch.scale.x.toFixed(3), +stretch.scale.y.toFixed(3), +stretch.scale.z.toFixed(3)], drawCalls: units.reduce((n, u) => n + u.mats.length, 0) + 1 + (hov.length ? 1 : 0), dust: du.life.reduce((n, v) => n + (v > 0 ? 1 : 0), 0) }),
    anchorWorld: (i, v = new THREE.Vector3()) => units[i]?.g.getWorldPosition(v) ?? null, // Prüfungen: sitzt die Düse am Modell?
    dispose() { for (const u of units) u.mats.forEach((m) => m.dispose()); cone.dispose(); disc.dispose(); clayGeo?.dispose(); sg.dispose(); sm.dispose(); dg.dispose(); dm.dispose(); world.parent?.remove(world); root.clear() },
  }
}
