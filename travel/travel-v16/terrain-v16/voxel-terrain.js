// ============================================================================
// voxel-terrain.js — KFB Terrain + Skydome v3 (WebGL rebuild)
// ----------------------------------------------------------------------------
// SAME seeded voxel landscape as v2 (fbm + domain-warp + biome-shaping, one
// InstancedMesh of boxes per chunk, chunk-streaming with a travel seam) — but
// the MATERIAL is now classic WebGL: THREE.ShaderMaterial (GLSL), NOT TSL/Node.
// This is the v2→v3 port the brief asks for: one renderer, one engine, shared
// with the Pet (three 0.160, WebGL). The colour model is unchanged in spirit
// (it was always "1:1 with webgl_instancing_dynamic") — it just comes home.
//
// Colour, live per cube (all via instanced attributes + uniforms, no rebake):
//   3-stop ramp (topo↔random) × palette × brightness-range × saturation
//   + water tint + optional rainbow + radial palette-spread.
//
// WATER (brief §3): colour/material ONLY, never a level. The heightfield is NOT
// clamped to a water plane anymore — low cells are just TINTED (an oil-lake
// colour zone). Terrain height is untouched by water.
//
// Contract (unchanged from v1/v2):
//   const t = createVoxelTerrain({ THREE, worldContext });
//   t.build(scene); t.recenter(x,z); t.update(dt, ctx); t.groundHeightAt(x,z);
//   t.setWorldContext(wc); t.dispose(scene);
//   t.setPalette(stops, {spread, cx, cz, maxDist, dur});
//   t.setRainbow(on, speed, spread);  t.setColorParams({brightMin,...});
//   t.setFog(colorHexOrArray, density);   // NEW: horizon fog is in-shader
// ============================================================================

import * as THREE from 'three';

const _edgeCanon = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/edge3.jpg';
const _edgeLocal = new URL('./edge3.jpg', import.meta.url).href;
let _edgeTex = null;
function edgeTexture(T) {
  if (!_edgeTex) {
    // Pfad-Hygiene: kanonische RAW-URL zuerst (Standalone-Export hat kein ./ neben sich),
    // lokaler Spiegel nur als Fallback, solange die Textur noch nicht im Repo liegt.
    // **Reihenfolge getauscht am 26.7.:** die RAW-URL antwortet mit 404 (gemessen im Resource-Timing),
    // also lief bisher JEDER Start durch einen Fehlschlag in den lokalen Spiegel — ein Konsolenfehler
    // bei jedem Laden, für nichts. Die Datei liegt neben dem Modul; sie ist die Wahrheit, bis sie im
    // Repo liegt. Der kanonische Pfad bleibt als Fallback (Standalone-Export hat kein `./` neben sich).
    _edgeTex = new T.TextureLoader().load(_edgeLocal, undefined, undefined, () => {
      new T.TextureLoader().load(_edgeCanon, (t) => { _edgeTex.image = t.image; _edgeTex.needsUpdate = true; });
    });
    _edgeTex.colorSpace = T.NoColorSpace;   // ShaderMaterial writes display-space directly (no auto-encode) → no decode either
    _edgeTex.wrapS = _edgeTex.wrapT = T.RepeatWrapping;
    _edgeTex.anisotropy = 4;
  }
  return _edgeTex;
}

// ---------------------------------------------------------------- pure seeded noise (identical to v2)
function hash2(ix, iz, seed) {
  let h = (seed ^ Math.imul(ix | 0, 374761393) ^ Math.imul(iz | 0, 668265263)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function valueNoise(x, z, seed) {
  const x0 = Math.floor(x), z0 = Math.floor(z), fx = x - x0, fz = z - z0;
  const u = fx * fx * (3 - 2 * fx), w = fz * fz * (3 - 2 * fz);
  const a = hash2(x0, z0, seed), b = hash2(x0 + 1, z0, seed);
  const c = hash2(x0, z0 + 1, seed), d = hash2(x0 + 1, z0 + 1, seed);
  return (a * (1 - u) + b * u) * (1 - w) + (c * (1 - u) + d * u) * w;
}
function fbm(x, z, seed, oct, gain, lac) {
  let sum = 0, amp = 0.5, freq = 1, norm = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * valueNoise(x * freq, z * freq, (seed + i * 1013) >>> 0);
    norm += amp; amp *= gain; freq *= lac;
  }
  return sum / norm;
}
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// ---------------------------------------------------------------- GLSL
// v16/L3b · **DIE BODENBEWEGUNG, EINMAL.** Georgs Befund: „die Props sollten die Bewegungen des
// Floor mitmachen — sonst versinken sie im Voxel." Richtig, und die Reparatur ist nicht, die
// Rechnung im Prop-Shader nachzubauen: zwei Kopien derselben Bewegung laufen auseinander, sobald
// eine von beiden angefasst wird (dieselbe Fehlerklasse wie zwei Höhen-Wahrheiten, §4h/Naht 109).
//
// Deshalb steht die Bewegung hier als **exportierter GLSL-Block**, den Terrain UND Props
// einbinden — und die Uniforms werden als **dieselben Objekte** geteilt (`motionUniforms`), nicht
// kopiert. Ein `uEnergy`-Schreibvorgang erreicht damit beide Shader, ohne eine Zeile Synchronisation.
//
// `kfbLift` gibt die ABSOLUTE Höhenänderung in Welteinheiten. Wer sie in Objektraum braucht,
// teilt durch seinen eigenen Maßstab.
// ⚠ Keine Backticks in diesem Block (Naht 111).
export const MOTION_GLSL = /* glsl */`
  uniform float uTime, uAmp, uMotionGain, uEnergy, uBeat;
  uniform float uFlow;     // 0 = Dancefloor (Phase aus dem Zufall) · 1 = Flow (Phase aus dem Ort)
  uniform vec4 uZone[4];   // (x, z, radius, amount) — Zone 0 folgt dem Fahrzeug, 1..3 sind gesetzt
  // Auf/Ab der Cubes: abs(sin(x)) hatte am unteren Umkehrpunkt einen KNICK (die Ableitung
  // springt) — das liest sich als Zucken statt als Sprung. Jetzt eine erhobene Kosinuswelle,
  // zusaetzlich smoothstep-geglaettet: stetig in Wert UND Steigung, mit Haenger oben und unten.
  // (Georgs Verweis auf three.js webgl_instancing_dynamic — dort ist genau das der Trick.)
  // ZWEI MUSTER, ein Hub. Dancefloor: jede Saeule hat ihre eigene Phase (Zufall aus dem Seed) —
  // richtig fuer den Beat, aber kein Fluss. Flow: die Phase kommt aus dem ORT, dann laeuft eine
  // Welle durch das Terrain. Drei ueberlagerte Terme (schraeg laufend, quer moduliert, langsam
  // radial) ergeben ein Interferenzmuster, das sich nie exakt wiederholt und trotzdem nicht
  // zufaellig aussieht.
  float kfbBobAt(vec2 wxz, float seed, float tOff) {
    float tt = uTime + tOff;
    vec2 w = wxz * 0.045;
    float flowPh = tt * 1.35
      + dot(w, vec2(0.82, 0.57)) * 3.1
      + sin(dot(w, vec2(-0.44, 0.90)) * 2.1 + tt * 0.55) * 1.6
      + sin(length(w) * 0.7 - tt * 0.22) * 0.9;
    float ph   = mix(tt * 2.0 + seed * 6.2832, flowPh, uFlow);
    float rawB = 0.5 - 0.5 * cos(ph);
    return rawB * rawB * (3.0 - 2.0 * rawB);
  }
  float kfbBob(vec2 wxz, float seed) { return kfbBobAt(wxz, seed, 0.0); }
  // RUHEZONEN: bis zu vier. Zone 0 folgt dem Fahrzeug (im Walk der Laeufer, im Flug die
  // sinkende Karte — je naeher am Boden, desto ruhiger), Zone 1..3 sind gesetzte Orte fuer
  // grosse Modelle (Hex-Turm, Graveyard): dort muessen die Cubes stillstehen, damit etwas
  // sauber darauf stehen kann. Bewegung kommt ab 55 % des Radius weich zurueck.
  float kfbCalm(vec2 wxz) {
    float calm = 1.0;
    for (int i = 0; i < 4; i++) {
      float amt = uZone[i].w;
      if (amt > 0.001) {
        float cd = distance(wxz, uZone[i].xy);
        calm = min(calm, mix(1.0 - amt, 1.0, smoothstep(uZone[i].z * 0.55, uZone[i].z, cd)));
      }
    }
    return calm;
  }
  float kfbAmp() { return uAmp * uMotionGain * 8.0 * (uEnergy * 0.7 + uBeat * 0.5); }
  // Absolute Hoehenaenderung der Cube-Oberseite an diesem Ort, in Welteinheiten.
  float kfbLift(vec2 wxz, float seed) { return kfbBob(wxz, seed) * kfbAmp() * kfbCalm(wxz); }
`;

const VERT = /* glsl */`
  attribute vec4 aPack1;   // x=ramp y=rand(bright) z=rand2(sat/rainbow) w=water
  attribute vec4 aPack2;   // x=worldX y=worldZ z=motionSeed w=columnHeight
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec4 vP1;
  varying vec2 vWXZ;
  varying float vBob;
  varying float vFogDepth;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vP1 = aPack1;
    vWXZ = aPack2.xy;
    float seed = aPack2.z;
    float aHn  = max(aPack2.w, 0.6);
    float bob  = kfbBob(aPack2.xy, seed);
    float calm = kfbCalm(aPack2.xy);
    float ampW = kfbAmp() * calm;
    float dyLocal = bob * ampW / aHn;      // /aHn cancels the column Y-scale → absolute lift
    vBob = mix(0.5, bob, calm);            // frozen cubes hold a steady glow instead of blinking
    vec3 transformed = position;
    transformed.y += dyLocal;
    vNormalW = normalize(normalMatrix * mat3(instanceMatrix) * normal);
    vec4 wPos = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
    vWorld = wPos.xyz;                     // für den projizierten Schatten (S15b)
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);
    vFogDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
// v16/L3c · **DIE BODENFARBE, EINMAL.** Georg: „ob wir die Props irgendwie leicht mit der
// Terrain-Farbe einfärben können". Die schwächere Antwort wäre ein globaler Farbton aus der
// Palette. Die richtige: **jedes Prop nimmt die Farbe des Würfels, auf dem es steht** — dann
// färbt nicht „die Welt" ein, sondern der Boden, und ein Baum am Hang ist anders getönt als einer
// auf der Kuppe. Dafür braucht der Prop-Shader dieselbe Rampe und dieselben Paletten-Uniforms;
// beide werden geteilt, nicht kopiert (siehe `paletteUniforms`).
// ⚠ Keine Backticks in diesem Block (Naht 111).
export const PALETTE_GLSL = /* glsl */`
  uniform vec3 uPA0, uPA1, uPA2, uPB0, uPB1, uPB2;
  uniform float uFront, uCenterX, uCenterZ, uMaxDist;
  vec3 kfbRamp(float t, vec3 p0, vec3 p1, vec3 p2) {
    t = clamp(t, 0.0, 1.0);
    vec3 lo = mix(p0, p1, clamp(t * 2.0, 0.0, 1.0));
    vec3 hi = mix(p1, p2, clamp((t - 0.5) * 2.0, 0.0, 1.0));
    return mix(lo, hi, step(0.5, t));
  }
  // Bodenfarbe an einem Ort, inklusive der radialen Front zwischen alter und neuer Farbwelt --
  // damit ein Wald MIT der Front umfaerbt und nicht einen Takt spaeter.
  vec3 kfbGroundColor(float rampT, vec2 wxz) {
    vec3 a = kfbRamp(rampT, uPA0, uPA1, uPA2);
    vec3 b = kfbRamp(rampT, uPB0, uPB1, uPB2);
    float d = length(wxz - vec2(uCenterX, uCenterZ)) / max(uMaxDist, 0.001);
    float sel = 1.0 - smoothstep(uFront - 0.07, uFront + 0.07, d);
    return mix(a, b, sel);
  }
`;

const FRAG = /* glsl */`
  uniform sampler2D uEdge;
  uniform vec3 uPA0, uPA1, uPA2, uPB0, uPB1, uPB2;
  uniform vec3 uWater, uFogColor;
  uniform vec3 uLightDir; uniform float uAmbient, uLightInt;
  uniform float uFront, uCenterX, uCenterZ, uMaxDist;
  uniform float uBrightMin, uBrightRange, uSatBase, uSatRange, uTopoMix;
  uniform float uRainbow, uRainbowSpeed, uRainbowSpread, uTime, uFogDensity;
  uniform float uBeat, uEnergy;
  uniform float uGlowB, uGlowE, uGlowGain;
  // S15b · projizierte Werfer-Schatten: xyz = Weltposition, w = Radius (0 = aus)
  uniform vec4 uCast0, uCast1;
  uniform float uCastGain;
  // ── v16/L2d · RINGWELLEN ───────────────────────────────────────────────────────────────
  // Georgs Bild: „Farbkreis-Flächen laufen über die Voxel, breiten sich aus und faden zur
  // Terrainfarbe zurück" — Variante A (die Welle zieht durch, kein Gedächtnis).
  //
  // **Warum das hier steht und nicht als Geometrie.** Eine flache Scheibe über einer
  // Voxel-Landschaft z-fightet mit den Würfeloberseiten und schwebt über Stufen — und L1 hat
  // das Gelände gerade STUFIGER gemacht (Klippen 6 u). Die Welle im Fragment-Shader liegt
  // exakt auf dem Gelände, weil sie die Oberfläche SELBST ist. Kosten: kein Draw-Call, kein
  // Attribut, kein Rebake — vWXZ (aus aPack2.xy) liegt ohnehin schon hier.
  //
  // ⚠ **Keine Backticks in diesem Block.** Der Shader steht in einem Template-Literal; ein
  // Backtick in einem GLSL-Kommentar beendet es, und der Fehler erscheint als „SyntaxError:
  // unexpected token" in einer JS-Zeile weiter unten — also nicht dort, wo er steht.
  // (Zweimal passiert am 12.8. — beim zweiten Mal in der Erklärung, warum der erste Anlauf
  // falsch war. Deshalb steht die Warnung hier oben und nicht in einem Dokument daneben.)
  //
  // Acht Plätze, je zwei vec4:
  //   uRip[i]  = (Mitte X, Mitte Z, Alter in s, Lebensdauer in s;  Lebensdauer 0 = Platz frei)
  //   uRipC[i] = (Farbe RGB, Deckkraft 0..1)
  //
  // **Der Ring ist ein BAND um einen wachsenden Radius**, nicht die Differenz zweier Kanten.
  // Erster Anlauf war front - back*0.72 aus zwei smoothsteps — nachgerechnet erreicht der
  // Ring damit im Scheitel nur **0,45**, weil d genau auf der Mitte des ersten smoothstep
  // liegt (0,5) und die Hinterkante davon noch etwas abzieht. Mit einer Deckkraft von 0,42
  // (Atemzug) blieben **16 % Beimischung** übrig: unsichtbar, und niemand hätte es am Code
  // gesehen. Ein Band über den Abstand zum Radius erreicht im Scheitel sauber 1,0.
  // Das Band wird mit dem Alter BREITER (0,4 → 1,4 · uRipWidth) — so breitet sich die Welle aus
  // UND verläuft, ohne dass es eine zweite Kante braucht.
  uniform vec4 uRip[8];
  uniform vec4 uRipC[8];
  uniform float uRipSpeed, uRipWidth, uRipGain;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec4 vP1;
  varying vec2 vWXZ;
  varying float vBob;
  varying float vFogDepth;
  varying vec3 vWorld;
  vec3 ramp(float t, vec3 p0, vec3 p1, vec3 p2) {
    t = clamp(t, 0.0, 1.0);
    vec3 lo = mix(p0, p1, clamp(t * 2.0, 0.0, 1.0));
    vec3 hi = mix(p1, p2, clamp((t - 0.5) * 2.0, 0.0, 1.0));
    return mix(lo, hi, step(0.5, t));
  }
  // Schatten OHNE Geometrie: jedes Terrain-Fragment kennt seine Weltposition, also lässt sich der
  // Werfer entlang des Lichtstrahls auf genau diese Höhe projizieren. Vorteile gegenüber einem
  // Schatten-Quad: er sitzt immer auf der Fläche, die wirklich da ist (auch auf Wänden), bewegt
  // sich mit den hüpfenden Cubes, kann nicht z-fighten und flackert nicht an Höhensprungen.
  float castShadow(vec4 c) {
    if (c.w <= 0.001) return 0.0;
    vec3 L = normalize(uLightDir);              // zeigt ZUR Sonne
    float dy = c.y - vWorld.y;
    if (dy <= 0.02) return 0.0;                 // Werfer unter dieser Fläche → kein Schatten
    vec2 p = c.xz + (L.xz / max(L.y, 0.25)) * dy;
    float d = length(vWorld.xz - p) / (c.w * (1.0 + dy * 0.045));
    float core = 1.0 - smoothstep(0.34, 1.0, d);
    return core * (1.0 - smoothstep(5.0, 34.0, dy));   // mit der Höhe weich raus
  }
  void main() {
    float nRamp = vP1.x, nRand = vP1.y, nRand2 = vP1.z, nWater = vP1.w;
    float rampT = mix(nRand, nRamp, uTopoMix);
    vec3 colA = ramp(rampT, uPA0, uPA1, uPA2);
    vec3 colB = ramp(rampT, uPB0, uPB1, uPB2);
    // radial spread select — B grows outward from centre as uFront rises
    float dist = length(vec2(vWXZ.x - uCenterX, vWXZ.y - uCenterZ));
    float f = dist / max(uMaxDist, 0.001);
    float sel = 1.0 - smoothstep(uFront - 0.07, uFront + 0.07, f);
    vec3 col = mix(colA, colB, sel);
    // animated rainbow
    float hue = (vWXZ.x + vWXZ.y) * 0.0045 + uTime * uRainbowSpeed + rampT * uRainbowSpread + nRand2 * 0.04;
    vec3 rk = clamp(abs(fract(vec3(0.0, 0.6667, 0.3333) + hue) * 6.0 - 3.0) - 1.0, 0.0, 1.0);
    col = mix(col, rk, uRainbow);
    // water tint (colour zone, not a level)
    col = mix(col, uWater, nWater * 0.6);
    // per-cube brightness (demo's 0.5 + rand·0.5 light spread)
    col *= (uBrightMin + nRand * uBrightRange);
    // per-cube saturation jitter
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, clamp(uSatBase + nRand2 * uSatRange, 0.0, 1.5));
    // v16/L2d · **Die Ringwellen sitzen HIER, und die Stelle ist das Ergebnis einer Messung.**
    // Erster Anlauf: direkt nach der Palettenmischung. Im Bild kam ein olivgraues Band heraus,
    // kein Farbring — weil zwei Zeilen darunter der Streu-Kanal des Terrains steht
    // (uSatBase 0.72 + nRand2 * uSatRange 0.34), der jede Farbe um 11 bis 28 Prozent
    // ENTSAETTIGT. Die Streuung ist eine Eigenschaft des Gelaendes, nicht einer Welle, die
    // darueber laeuft: also erst das Gelaende fertig faerben, dann die Welle darueber.
    //
    // Weiterhin VOR Kantentextur und Licht: eine Welle ist eine Faerbung der Flaeche, keine
    // Lampe. Nach der Belichtung addiert wuerde sie auf Nordhaengen genauso leuchten wie in der
    // Sonne und sich als Aufkleber lesen (dieselbe Lehre wie beim Werfer-Schatten).
    for (int i = 0; i < 8; i++) {
      float life = uRip[i].w;
      if (life > 0.001) {
        float age = uRip[i].z;
        float t = clamp(age / life, 0.0, 1.0);
        float r = age * uRipSpeed;
        float d = length(vec2(vWXZ.x - uRip[i].x, vWXZ.y - uRip[i].y));
        // Band um den Radius. Scheitel = 1,0 bei d == r, null bei +/- w.
        float w = uRipWidth * (0.4 + t);
        float ring = 1.0 - smoothstep(0.0, w, abs(d - r));
        ring *= ring;                     // Kanten weicher, Scheitel bleibt 1,0
        // Ein- und Ausblenden ueber die Lebensdauer: sin(pi*t) - kein Aufblitzen am Anfang,
        // kein Abschneiden am Ende.
        float fade = sin(t * 3.14159265) * uRipC[i].w * uRipGain;
        col = mix(col, uRipC[i].rgb, clamp(ring * fade, 0.0, 1.0));
      }
    }
    // texture edge tile
    col *= texture2D(uEdge, vUv).rgb;
    // lighting (simple lambert + ambient)
    vec3 N = normalize(vNormalW);
    float diff = max(dot(N, normalize(uLightDir)), 0.0);
    vec3 lit = col * (uAmbient + diff * uLightInt);
    // Werfer-Schatten multiplikativ auf die belichtete Farbe — nie als aufgeklebter Fleck
    float sh = max(castShadow(uCast0), castShadow(uCast1)) * uCastGain;
    lit *= 1.0 - 0.52 * sh;
    float lum = dot(col, vec3(0.3, 0.6, 0.1));
    // Blinken hängt an einem EIGENEN Kanal (uGlowB/uGlowE), nicht am Tanz-Kanal —
    // sonst blinken die Cubes weiter, wenn der Tanz aus ist (Georgs Befund).
    float glow = (uGlowB * 0.5 + uGlowE * 0.26) * uGlowGain * smoothstep(0.12, 0.85, lum) * (vBob * 0.4 + 0.6);
    lit += col * glow;
    // exp2 fog → dissolves into the sky horizon colour
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    lit = mix(lit, uFogColor, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(lit, 1.0);
  }
`;

const SCAT_FRAG = /* glsl */`
  uniform sampler2D uEdge;
  uniform vec3 uGlow, uFogColor;
  uniform vec3 uLightDir; uniform float uAmbient, uLightInt;
  uniform float uBrightMin, uBrightRange, uBeat, uFogDensity;
  uniform float uGlowB, uGlowGain;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec4 vP1;
  varying float vFogDepth;
  void main() {
    vec3 col = uGlow * (uBrightMin + vP1.y * uBrightRange);
    col *= texture2D(uEdge, vUv).rgb;
    vec3 N = normalize(vNormalW);
    float diff = max(dot(N, normalize(uLightDir)), 0.0);
    vec3 lit = col * (uAmbient + diff * uLightInt) + col * (uGlowB * 0.4 * uGlowGain);
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    lit = mix(lit, uFogColor, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(lit, 1.0);
  }
`;

export function createVoxelTerrain(opts = {}) {
  const T = opts.THREE || THREE;
  const CELL = opts.cell || 3.0;
  const C = opts.chunkCells || 16;
  const GRID = opts.grid || 9;
  const CHUNK = C * CELL;
  const FLOOR = opts.floor != null ? opts.floor : -26;
  const BASE_FREQ = 0.017;

  let wc = opts.worldContext || null;
  const group = new T.Group();
  const chunks = [];
  let built = false;
  let focusX = 0, focusZ = 0;

  const edgeTex = edgeTexture(T);

  // ---- ONE shared uniforms object across all chunk materials (change once → all update) ----
  const U = {
    uEdge: { value: edgeTex },
    uTime: { value: 0 }, uAmp: { value: 0.35 }, uMotionGain: { value: 1.2 },
    uZone: { value: [new T.Vector4(0, 0, 1, 0), new T.Vector4(0, 0, 1, 0), new T.Vector4(0, 0, 1, 0), new T.Vector4(0, 0, 1, 0)] },
    uEnergy: { value: 0.4 }, uBeat: { value: 0 },
    uFlow: { value: 0 },
    uGlowB: { value: 0 }, uGlowE: { value: 0.4 }, uGlowGain: { value: 1 },
    uPA0: { value: new T.Color(0.06, 0.10, 0.16) }, uPA1: { value: new T.Color(0.4, 0.45, 0.5) }, uPA2: { value: new T.Color(0.8, 0.82, 0.86) },
    uPB0: { value: new T.Color(0.06, 0.10, 0.16) }, uPB1: { value: new T.Color(0.4, 0.45, 0.5) }, uPB2: { value: new T.Color(0.8, 0.82, 0.86) },
    uFront: { value: 0 }, uCenterX: { value: 0 }, uCenterZ: { value: 0 }, uMaxDist: { value: 220 },
    uBrightMin: { value: 0.52 }, uBrightRange: { value: 0.62 },
    uSatBase: { value: 0.72 }, uSatRange: { value: 0.34 }, uTopoMix: { value: 0.6 },
    uRainbow: { value: 0 }, uRainbowSpeed: { value: 0.055 }, uRainbowSpread: { value: 0.55 },
    uWater: { value: new T.Color(0.10, 0.20, 0.30) },
    uGlow: { value: new T.Color(0.85, 0.75, 0.42) },
    uFogColor: { value: new T.Color(0.12, 0.13, 0.18) }, uFogDensity: { value: 0.012 },
    uLightDir: { value: new T.Vector3(0.4, 1.0, 0.35).normalize() }, uAmbient: { value: 0.55 }, uLightInt: { value: 0.7 },
    uCast0: { value: new T.Vector4(0, 0, 0, 0) }, uCast1: { value: new T.Vector4(0, 0, 0, 0) }, uCastGain: { value: 1 },
    // v16/L2d · Ringwellen. Acht Plätze, `w = 0` heißt frei. Die Arrays werden EINMAL angelegt
    // und danach nur beschrieben — ein neues Array pro Frame würde three.js zwingen, die
    // Uniform-Struktur neu zu binden.
    uRip: { value: Array.from({ length: 8 }, () => new T.Vector4(0, 0, 0, 0)) },
    uRipC: { value: Array.from({ length: 8 }, () => new T.Vector4(1, 1, 1, 0)) },
    // Tempo in u/s. 46 ist etwas über Reisetempo (42): eine Welle, die langsamer läuft als der
    // Spieler, wird von ihm überholt und sieht aus, als stünde sie.
    uRipSpeed: { value: 46 }, uRipWidth: { value: 26 }, uRipGain: { value: 1 },
  };

  const terrainMat = new T.ShaderMaterial({ uniforms: U, vertexShader: MOTION_GLSL + VERT, fragmentShader: FRAG });
  const scatterMat = new T.ShaderMaterial({ uniforms: U, vertexShader: MOTION_GLSL + VERT, fragmentShader: SCAT_FRAG });

  // ---------------------------------------------------------------- biome height shaping (identical to v2)
  function biomeShape(h01) {
    const b = wc && wc.biome;
    if (b === 'plateau') { const s = 5; return Math.round(h01 * s) / s; }
    if (b === 'fractured') { const s = 8; return (Math.round(h01 * s) / s) * 0.7 + h01 * 0.3; }
    if (b === 'meadow') return Math.pow(h01, 1.6) * 0.8;
    if (b === 'scorched') return Math.pow(h01, 0.85);
    return h01;
  }

  // ================================================================ v16/L1 · DIE STUFUNG
  // Auftrag Georg (12.8.): „1/6-Abstufung für Terrain-/Voxel-Höhen — dann können wir
  // unterschiedlichere Steigungen, Senken etc. neben hohen Klippen abbilden."
  //
  // **Eine feinere Stufe allein tut das NICHT.** Wer überall auf CELL/6 rastet, bekommt überall
  // sanfte Terrassen — die Klippe verschwindet mit. Steigung und Klippe sind kein Gegensatz von
  // Höhe, sondern von **Stufengröße**: dieselbe Höhendifferenz ist eine Treppe, wenn sie in
  // zwölf Stufen kommt, und eine Wand, wenn sie in einer kommt.
  //
  // Also ist die Stufengröße **ein Ort-Merkmal**, kein Weltparameter. Eine eigene, sehr
  // langwellige Rauschkarte (`reliefFreq`, ~220 u) teilt die Welt in vier Reliefarten:
  //
  //   fein   = CELL/div (6 → 0,50 u)  ·  Hänge und Senken, begehbar ohne Sprung
  //   mittel = CELL/2   (1,50 u)      ·  Terrassen, ein Schritt hoch
  //   grob   = CELL     (3,00 u)      ·  das alte v15-Verhalten, Stufen wie Kisten
  //   klippe = CELL·2   (6,00 u)      ·  Wand: über `walk.autoJumpMax` (4,2), also nicht kletterbar
  //
  // Das Höhenfeld darunter ist **unverändert** — es wird nur unterschiedlich fein gerastert.
  // Deshalb gibt es an einer Reliefgrenze keinen Sprung in der Höhe, nur einen Wechsel in der
  // Stufengröße: aus einer Treppe wird eine Kante, ohne daß der Berg sich bewegt.
  //
  // **Und die zweite Hälfte, ohne die es Kies wird:** das Detailrauschen in `heightAt` hatte eine
  // feste Amplitude von ±CELL·1,1 (±3,3 u). Das war richtig, solange die Stufe 3,0 u war — bei
  // 0,5 u sind das ±6,6 Stufen Zappeln pro Zelle, also Schotter statt Hang. Die Amplitude hängt
  // ab jetzt an der örtlichen Stufe.
  const STEP = {
    on: true,
    div: 6,              // feine Stufe = CELL / div
    reliefFreq: 0.0045,  // ~220 u Wellenlänge — Reliefarten sind Landschaften, keine Flecken
    // ⚠ **Die Schwellen sind FLÄCHENANTEILE, keine Rauschwerte** — und das ist die Reparatur
    // von Naht 115. Erster Anlauf schnitt den rohen `valueNoise`, das ergab 0 % Klippe (die
    // Verteilung ist eine Glocke um 0,5, die Enden sind leer). Zweiter Anlauf spreizte die
    // Glocke mit `reliefKontrast: 2.6` — auf dem damaligen FESTEN Weltseed kamen 6 % Klippe
    // heraus, auf den gewürfelten Welten von L2a aber **17 bis 40 %**. Eine Spreizung ist das
    // falsche Werkzeug: sie verschiebt die Verteilung, ohne sie zu KENNEN, und ihr Ergebnis
    // hängt damit an jedem einzelnen Seed.
    //
    // Jetzt wird die Verteilung EINMAL je Welt gemessen (`buildReliefLut`) und `reliefAt` gibt
    // den **Perzentilrang** zurück. Damit heißt `tFein: 0.45` genau das, was dort steht: 45 %
    // der Fläche sind Hang — auf JEDER Welt, nicht nur auf der, auf der gemessen wurde. Und
    // die Regler im Panel bedeuten endlich etwas, worauf Georg zielen kann.
    tFein: 0.45, tMittel: 0.75, tGrob: 0.93,   // → 45 % Hang · 30 % Terrasse · 18 % Kiste · 7 % Klippe
    klippeMul: 2,        // Klippenstufe = CELL · klippeMul
    lutSamples: 4096,    // Stützstellen der Verteilungsmessung (einmal je Welt, ~1 ms)
  };

  // **Die Verteilungstabelle.** 65 Quantile des Reliefrauschens dieser Welt, aufsteigend. Wird
  // verworfen, wenn Seed oder Reliefgröße sich ändern — sonst würde nach einem Weltwürfel die
  // Tabelle der VORIGEN Welt gelesen, und das wäre genau wieder Naht 115.
  let reliefLut = null, lutKey = '';
  function buildReliefLut() {
    const seed = (wc && wc.seed) || 1;
    const key = seed + '/' + STEP.reliefFreq;
    if (reliefLut && lutKey === key) return reliefLut;
    const n = Math.max(256, STEP.lutSamples | 0);
    const side = Math.ceil(Math.sqrt(n));
    // Schrittweite eine halbe Wellenlänge: enger würde dieselbe Kuppe mehrfach zählen und die
    // Verteilung zur Mitte hin verfälschen.
    const d = 0.5 / Math.max(1e-6, STEP.reliefFreq);
    const vals = new Float64Array(side * side);
    for (let i = 0; i < side; i++) {
      for (let j = 0; j < side; j++) {
        const wx = (j - side / 2) * d, wz = (i - side / 2) * d;
        vals[i * side + j] = valueNoise(wx * STEP.reliefFreq + 41.7, wz * STEP.reliefFreq - 12.3, (seed ^ 0x3A17) >>> 0);
      }
    }
    vals.sort();
    const Q = 64, lut = new Float64Array(Q + 1);
    for (let q = 0; q <= Q; q++) lut[q] = vals[Math.min(vals.length - 1, Math.round((q / Q) * (vals.length - 1)))];
    reliefLut = lut; lutKey = key;
    return lut;
  }
  // Reliefwert als **Perzentilrang 0..1**. Reine Funktion des Ortes (plus Weltseed), monoton in
  // der Rauschhöhe — also bleiben zusammenhängende Felder zusammenhängend, nur ihre Größe ist
  // jetzt vorhersagbar.
  function reliefAt(wx, wz) {
    const seed = (wc && wc.seed) || 1;
    const v = valueNoise(wx * STEP.reliefFreq + 41.7, wz * STEP.reliefFreq - 12.3, (seed ^ 0x3A17) >>> 0);
    const lut = buildReliefLut(), Q = lut.length - 1;
    if (v <= lut[0]) return 0;
    if (v >= lut[Q]) return 1;
    let lo = 0, hi = Q;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (lut[m] <= v) lo = m; else hi = m; }
    const span = lut[hi] - lut[lo];
    return (lo + (span > 1e-12 ? (v - lut[lo]) / span : 0)) / Q;
  }
  // Die Stufengröße an einem Ort. **Reine Funktion des Ortes** — deshalb sehen Physik
  // (`groundHeightAt`) und Bild (`bakeChunk`) garantiert dasselbe; eine zweite Wahrheit über die
  // Höhe kann hier gar nicht entstehen.
  function stepAt(wx, wz) {
    if (!STEP.on) return CELL;
    const m = reliefAt(wx, wz);
    if (m < STEP.tFein) return CELL / Math.max(1, STEP.div);
    if (m < STEP.tMittel) return CELL / 2;
    if (m < STEP.tGrob) return CELL;
    return CELL * STEP.klippeMul;
  }

  function heightAt(wx, wz, step) {
    const p = (wc && wc.params) || {};
    const seed = (wc && wc.seed) || 1;
    const rough = p.terrainRoughness != null ? p.terrainRoughness : 0.6;
    const surr = p.surrealism || 0.4;
    const gain = Math.max(0.4, Math.min(0.66, 0.4 + rough * 0.24));
    const warp = surr * 26;
    const wx2 = wx + warp * (valueNoise(wx * 0.006 + 19.3, wz * 0.006, seed ^ 0x51) - 0.5);
    const wz2 = wz + warp * (valueNoise(wx * 0.006, wz * 0.006 - 7.1, seed ^ 0xA3) - 0.5);
    let h01 = fbm(wx2 * BASE_FREQ, wz2 * BASE_FREQ, seed, 5, gain, 2.02);
    h01 = biomeShape(h01);
    const hs = p.heightScale != null ? p.heightScale : 16;
    // mid-frequency detail (~22-unit wavelength) breaks big plateaus into multi-cell staircases
    // once the surface is quantised to cube steps — variety without spiky, unwalkable noise.
    // **v16/L1:** die Amplitude hängt an der ÖRTLICHEN Stufe, gedeckelt bei CELL. Ohne den Deckel
    // würde ausgerechnet die Klippenzone (Stufe 6 u) am wildesten zappeln.
    const amp = Math.min(step != null ? step : CELL, CELL) * 2.2;
    const detail = (valueNoise(wx * 0.045 + 5.7, wz * 0.045 - 3.1, (seed ^ 0x77C1) >>> 0) - 0.5) * amp;
    return h01 * hs - hs * 0.34 + detail;
  }
  // WATER v3: colour zone only. Height is NEVER clamped → water does not move terrain.
  // CUBE LOGIC: the surface is quantised to whole CELL steps, so every exposed face is a real
  // square cube and height changes read as walkable stairs instead of arbitrary slabs.
  function surfaceInfo(wx, wz) {
    const p = (wc && wc.params) || {};
    const water = p.waterLevel != null ? p.waterLevel : 0;
    const s = stepAt(wx, wz);
    const h = Math.round(heightAt(wx, wz, s) / s) * s;
    return { top: h, submerged: h < water, step: s };   // submerged = tint flag, top stays the real height
  }

  // ---------------------------------------------------------------- one chunk
  function makeChunk() {
    const count = C * C;
    const aPack1 = new Float32Array(count * 4);
    const aPack2 = new Float32Array(count * 4);
    const geo = new T.BoxGeometry(CELL * 1.008, 1, CELL * 1.008); geo.translate(0, 0.5, 0);
    geo.setAttribute('aPack1', new T.InstancedBufferAttribute(aPack1, 4));
    geo.setAttribute('aPack2', new T.InstancedBufferAttribute(aPack2, 4));
    const mesh = new T.InstancedMesh(geo, terrainMat, count);
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);

    const SC = C * C;
    const sPack1 = new Float32Array(SC * 4);
    const sPack2 = new Float32Array(SC * 4);
    const sgeo = new T.BoxGeometry(0.5, 1, 0.5); sgeo.translate(0, 0.5, 0);
    sgeo.setAttribute('aPack1', new T.InstancedBufferAttribute(sPack1, 4));
    sgeo.setAttribute('aPack2', new T.InstancedBufferAttribute(sPack2, 4));
    const scatter = new T.InstancedMesh(sgeo, scatterMat, SC);
    scatter.frustumCulled = false; scatter.count = 0;
    scatter.instanceMatrix.setUsage(T.StaticDrawUsage);

    group.add(mesh); group.add(scatter);
    return { mesh, scatter, cx: 0, cz: 0, aPack1, aPack2, sPack1, sPack2 };
  }

  const _p = new T.Vector3(), _q = new T.Quaternion(), _s = new T.Vector3(), _m = new T.Matrix4();
  function bakeChunk(ch, cx, cz) {
    ch.cx = cx; ch.cz = cz;
    const p = (wc && wc.params) || {};
    const hs = p.heightScale != null ? p.heightScale : 16;
    const shift = p.colorShift != null ? p.colorShift : 0.5;
    const originX = cx * CHUNK, originZ = cz * CHUNK;
    const seed = (wc && wc.seed) || 1;
    const b = wc && wc.biome;
    const scatterProb = b === 'meadow' ? 0.16 : b === 'luminous' ? 0.12 : b === 'fractured' ? 0.14 : b === 'scorched' ? 0.10 : 0.07;
    let scount = 0;
    // v16/L3 · Sobald die Kenney-Props geladen sind, gehört ihnen die Streuung. Die grauen
    // Blöcke bleiben als **Fallback** im Code, nicht als Altlast: wenn die Assets nicht laden
    // (offline, RAW nicht erreichbar), streut wieder das, was ohne Netz funktioniert.
    const grey = !propsOwn;

    let idx = 0;
    for (let j = 0; j < C; j++) {
      for (let i = 0; i < C; i++, idx++) {
        const wx = originX + (i - C / 2 + 0.5) * CELL;
        const wz = originZ + (j - C / 2 + 0.5) * CELL;
        const info = surfaceInfo(wx, wz);
        const top = info.top;
        const colH = clamp01((top - FLOOR) / (hs * 1.4 + Math.abs(FLOOR)));
        _p.set(wx, FLOOR, wz); _q.identity(); _s.set(1, Math.max(0.6, top - FLOOR), 1);
        _m.compose(_p, _q, _s); ch.mesh.setMatrixAt(idx, _m);
        const cxCell = Math.floor(wx / CELL), czCell = Math.floor(wz / CELL);
        const o4 = idx * 4;
        ch.aPack1[o4]     = clamp01(colH * (0.55 + shift * 0.7) + (shift - 0.5) * 0.28);
        ch.aPack1[o4 + 1] = hash2(cxCell, czCell, seed ^ 0x1F53);
        ch.aPack1[o4 + 2] = hash2(cxCell, czCell, seed ^ 0x2B71);
        ch.aPack1[o4 + 3] = info.submerged ? 1 : 0;
        ch.aPack2[o4]     = wx;
        ch.aPack2[o4 + 1] = wz;
        ch.aPack2[o4 + 2] = hash2(cxCell, czCell, seed ^ 0x5EED);
        ch.aPack2[o4 + 3] = Math.max(0.6, top - FLOOR);
        if (!info.submerged && colH > 0.22) {
          const r = hash2(cxCell, czCell, seed ^ 0x7EED);
          if (grey && r < scatterProb * propDensity) {
            const ph = 0.5 + hash2(Math.floor(wx), Math.floor(wz), seed ^ 0xBEEF) * (b === 'fractured' ? 2.6 : b === 'scorched' ? 2.2 : 1.7);
            _p.set(wx + (r - scatterProb / 2) * CELL, top, wz); _q.identity(); _s.set(1.3 + r * 3, ph, 1.3 + r * 3);
            _m.compose(_p, _q, _s); ch.scatter.setMatrixAt(scount, _m);
            const s4 = scount * 4;
            ch.sPack2[s4]     = wx;   // world X/Z — needed so the calm zone reaches the props too
            ch.sPack2[s4 + 1] = wz;
            ch.sPack1[s4 + 1] = 0.55 + r * 0.6;   // y = bright rand
            ch.sPack2[s4 + 2] = hash2(cxCell, czCell, seed ^ 0x5EED);
            ch.sPack2[s4 + 3] = ph;
            scount++;
          }
        }
      }
    }
    ch.mesh.instanceMatrix.needsUpdate = true;
    ch.mesh.geometry.getAttribute('aPack1').needsUpdate = true;
    ch.mesh.geometry.getAttribute('aPack2').needsUpdate = true;
    ch.scatter.count = scount;
    ch.scatter.instanceMatrix.needsUpdate = true;
    ch.scatter.geometry.getAttribute('aPack1').needsUpdate = true;
    ch.scatter.geometry.getAttribute('aPack2').needsUpdate = true;
  }

  function build(scene) {
    if (built) return;
    const half = (GRID - 1) / 2;
    const fcx = Math.round(focusX / CHUNK), fcz = Math.round(focusZ / CHUNK);
    for (let gz = -half; gz <= half; gz++) {
      for (let gx = -half; gx <= half; gx++) {
        const ch = makeChunk(); bakeChunk(ch, fcx + gx, fcz + gz); chunks.push(ch);
      }
    }
    if (scene) scene.add(group);
    built = true;
  }
  function recenter(x, z) {
    focusX = x || 0; focusZ = z || 0;
    if (!built) return;
    const fcx = Math.round(focusX / CHUNK), fcz = Math.round(focusZ / CHUNK);
    const half = (GRID - 1) / 2;
    for (const ch of chunks) {
      let ncx = ch.cx, ncz = ch.cz, moved = false;
      while (ncx - fcx > half) { ncx -= GRID; moved = true; }
      while (fcx - ncx > half) { ncx += GRID; moved = true; }
      while (ncz - fcz > half) { ncz -= GRID; moved = true; }
      while (fcz - ncz > half) { ncz += GRID; moved = true; }
      if (moved) bakeChunk(ch, ncx, ncz);
    }
  }

  // ---------------------------------------------------------------- palette / colour API
  function setWaterFrom(stops) {
    const b = stops[0];
    U.uWater.value.setRGB(b[0] * 0.5 + 0.03, b[1] * 0.5 + 0.07, b[2] * 0.5 + 0.14);
  }
  function setStops(u0, u1, u2, stops) {
    u0.value.setRGB(stops[0][0], stops[0][1], stops[0][2]);
    u1.value.setRGB(stops[1][0], stops[1][1], stops[1][2]);
    u2.value.setRGB(stops[2][0], stops[2][1], stops[2][2]);
  }
  let transition = null;
  // ---------------------------------------------------------------- v16/L2d · Ringwellen (A)
  // Der Zustand ist EINE Referenz auf die Uniform-Arrays — es gibt keine zweite Liste daneben,
  // die auseinanderlaufen könnte. `ripples[i].z` ist das Alter, `.w` die Lebensdauer.
  const ripples = U.uRip.value, rippleCols = U.uRipC.value;
  let ripplesLive = 0, ripplesTotal = 0;
  /**
   * Eine Welle setzen. **Der Auslöser gehört dem Aufrufer** — deshalb nimmt diese Funktion
   * Ort und Farbe und fragt nicht nach dem Anlaß. Landung, Kartenzone, Grenzübertritt und
   * später Wassertropfen (Wetter) rufen dieselbe Funktion; das ist der Grund, warum L2d die
   * Vorarbeit für das Wetter ist und nicht nur ein Effekt.
   *
   * ⚠ **Der Lesbarkeits-Riegel gilt auch hier.** Eine helle Welle, die unter einer Karte
   * durchläuft, frißt sie genauso wie eine helle Palette — `guardStops` schützt nur die
   * Palette. Deshalb wird die Helligkeit der Wellenfarbe hier gedeckelt, an derselben Zahl.
   */
  function spawnRipple(x, z, color, o = {}) {
    let slot = -1, oldest = -1, oldAge = -1;
    for (let i = 0; i < ripples.length; i++) {
      if (ripples[i].w <= 0.001) { slot = i; break; }
      if (ripples[i].z > oldAge) { oldAge = ripples[i].z; oldest = i; }
    }
    // Alle acht belegt: die ÄLTESTE weicht. Sie ist am weitesten draußen und am schwächsten —
    // ihr Verschwinden fällt am wenigsten auf. Die jüngste zu überschreiben würde ein
    // Aufblitzen abschneiden.
    if (slot < 0) { slot = oldest; } else ripplesLive++;
    ripplesTotal++;
    const life = o.life != null ? o.life : 3.4;
    ripples[slot].set(x || 0, z || 0, 0, Math.max(0.2, life));
    const c = color || [1, 1, 1];
    const lum = c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
    const cap = o.maxLum != null ? o.maxLum : ripMaxLum;
    const k = lum > cap && lum > 0.001 ? cap / lum : 1;
    rippleCols[slot].set(c[0] * k, c[1] * k, c[2] * k, o.alpha != null ? o.alpha : 0.85);
    return slot;
  }
  let ripMaxLum = 0.8;
  function setPalette(stops, o = {}) {
    if (!stops || stops.length < 3) return;
    U.uGlow.value.setRGB(stops[2][0] * 0.9 + 0.05, stops[2][1] * 0.85 + 0.05, stops[2][2] * 0.8 + 0.05);
    if (o.spread) {
      setStops(U.uPB0, U.uPB1, U.uPB2, stops);
      U.uCenterX.value = o.cx || 0; U.uCenterZ.value = o.cz || 0;
      U.uMaxDist.value = o.maxDist || 220; U.uFront.value = 0;
      transition = { t: 0, dur: o.dur || 1.8, stops };
    } else {
      setStops(U.uPA0, U.uPA1, U.uPA2, stops);
      setStops(U.uPB0, U.uPB1, U.uPB2, stops);
      U.uFront.value = 0; setWaterFrom(stops); transition = null;
    }
  }
  function setRainbow(on, speed, spread) {
    U.uRainbow.value = on ? 1 : 0;
    if (speed != null) U.uRainbowSpeed.value = speed;
    if (spread != null) U.uRainbowSpread.value = spread;
  }
  function setColorParams(o = {}) {
    if (o.brightMin != null) U.uBrightMin.value = o.brightMin;
    if (o.brightRange != null) U.uBrightRange.value = o.brightRange;
    if (o.satBase != null) U.uSatBase.value = o.satBase;
    if (o.satRange != null) U.uSatRange.value = o.satRange;
    if (o.topoMix != null) U.uTopoMix.value = o.topoMix;
    if (o.rainbowSpeed != null) U.uRainbowSpeed.value = o.rainbowSpeed;
    if (o.rainbowSpread != null) U.uRainbowSpread.value = o.rainbowSpread;
  }
  function setFog(color, density) {
    if (color != null) { if (Array.isArray(color)) U.uFogColor.value.setRGB(color[0], color[1], color[2]); else U.uFogColor.value.set(color); }
    if (density != null) U.uFogDensity.value = density;
  }

  function update(dt, ctx) {
    const p = (wc && wc.params) || {};
    U.uAmp.value = p.motionAmplitude != null ? p.motionAmplitude : 0.35;
    const energy = ctx && ctx.energy != null ? ctx.energy : 0.4;
    const beat = ctx && ctx.beat != null ? ctx.beat : 0;
    U.uEnergy.value += (energy - U.uEnergy.value) * Math.min(1, dt * 5);
    U.uBeat.value += (beat - U.uBeat.value) * Math.min(1, dt * 12);
    // Zweiter Kanal fuer das Blinken — fällt auf den Tanz-Kanal zurück, wenn der Aufrufer
    // nichts sagt (alte Aufrufe bleiben damit gültig).
    const gB = ctx && ctx.glowBeat != null ? ctx.glowBeat : beat;
    const gE = ctx && ctx.glowEnergy != null ? ctx.glowEnergy : energy;
    U.uGlowB.value += (gB - U.uGlowB.value) * Math.min(1, dt * 12);
    U.uGlowE.value += (gE - U.uGlowE.value) * Math.min(1, dt * 5);
    if (ctx && ctx.glowGain != null) U.uGlowGain.value = ctx.glowGain;
    U.uTime.value += dt;
    // v16/L2d · Die Wellen altern. Kein Aufräumen nötig: `w = 0` gibt den Platz frei, und der
    // Shader überspringt ihn. **Beliebig viele Wellen im Sinne von: beliebig oft** — es sind
    // immer dieselben acht Plätze, und der älteste wird überschrieben (`spawnRipple`).
    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      if (r.w > 0.001) { r.z += dt; if (r.z >= r.w) { r.w = 0; ripplesLive--; } }
    }
    if (transition) {
      transition.t += dt;
      const k = transition.t / transition.dur;
      U.uFront.value = k * 1.4;
      if (k >= 1) { setStops(U.uPA0, U.uPA1, U.uPA2, transition.stops); setWaterFrom(transition.stops); U.uFront.value = 0; transition = null; }
    }
  }

  // ================================================================ v16/L3 · STREU-ORTE
  // **Eine Wahrheit darüber, WO etwas steht.** Die grauen Blöcke (`bakeChunk`) und die
  // Kenney-Props (`prop-scatter.js`) benutzen dieselbe Bedingung und dieselben Hashes — sonst
  // ständen die Props NEBEN den Blöcken statt an ihrer Stelle, und beim Umschalten würde die
  // Landschaft sich verschieben. Diese Funktion läuft dasselbe Raster wie `bakeChunk`, in
  // derselben Reihenfolge, und meldet jeden Standort einmal.
  //
  // Sie gehört HIERHER und nicht in `prop-scatter.js`, weil hier die Bodenhöhe wohnt. Ein
  // Prop-Modul, das den Boden selbst rechnet, wäre eine zweite Höhen-Wahrheit — dieselbe
  // Fehlerklasse, gegen die §4h und Naht 109 geschrieben sind.
  let propsOwn = false, propDensity = 1;
  // Ein wiederverwendetes Objekt statt 1400 neuer pro Aufbau — der Aufbau laeuft bei Reisetempo
  // etwa einmal pro Sekunde.
  const _site = { x: 0, z: 0, top: 0, cubeX: 0, cubeZ: 0, mseed: 0, rampT: 0, r2: 0, r3: 0, step: 0, cell: 0, cellZ: 0 };
  function propSites(cb) {
    const p = (wc && wc.params) || {};
    const hs = p.heightScale != null ? p.heightScale : 16;
    const shift = p.colorShift != null ? p.colorShift : 0.5;
    const seed = (wc && wc.seed) || 1;
    const b = wc && wc.biome;
    const prob = (b === 'meadow' ? 0.16 : b === 'luminous' ? 0.12 : b === 'fractured' ? 0.14
                : b === 'scorched' ? 0.10 : 0.07) * propDensity;
    let n = 0;
    for (const ch of chunks) {
      const originX = ch.cx * CHUNK, originZ = ch.cz * CHUNK;
      for (let j = 0; j < C; j++) {
        for (let i = 0; i < C; i++) {
          const wx = originX + (i - C / 2 + 0.5) * CELL;
          const wz = originZ + (j - C / 2 + 0.5) * CELL;
          const info = surfaceInfo(wx, wz);
          const colH = clamp01((info.top - FLOOR) / (hs * 1.4 + Math.abs(FLOOR)));
          if (info.submerged || colH <= 0.22) continue;
          const cxCell = Math.floor(wx / CELL), czCell = Math.floor(wz / CELL);
          const r = hash2(cxCell, czCell, seed ^ 0x7EED);
          if (r >= prob) continue;
          // `r2`/`r3` sind ZWEITE, unabhängige Hashes — die Modellwahl darf nicht an `r` hängen.
          // Mit `r` würden die seltenen Standorte (r nahe 0) immer dasselbe Modell tragen: das
          // Set wäre nach Dichte sortiert statt gemischt.
          _site.x = wx + (r - prob / 2) * CELL;   // Platzierung, leicht aus der Zellmitte
          _site.z = wz;
          _site.top = info.top;
          // v16/L3b · **Bewegung und Farbe kommen vom WUERFEL, nicht vom Prop.** Der Standort ist
          // gegen die Zellmitte versetzt; nimmt das Prop seine EIGENE Position als Phase, laeuft
          // es minimal anders als der Wuerfel unter ihm und versinkt an den Umkehrpunkten
          // (Georgs Befund). Deshalb reisen Wuerfelmitte, Bewegungs-Seed und Rampenwert mit.
          _site.cubeX = wx; _site.cubeZ = wz;
          _site.mseed = hash2(cxCell, czCell, seed ^ 0x5EED);
          _site.rampT = clamp01(colH * (0.55 + shift * 0.7) + (shift - 0.5) * 0.28);
          _site.r2 = hash2(cxCell, czCell, seed ^ 0x3C9D);
          _site.r3 = hash2(cxCell, czCell, seed ^ 0x51A7);
          _site.step = info.step; _site.cell = cxCell; _site.cellZ = czCell;
          cb(_site);
          n++;
        }
      }
    }
    return n;
  }

  function groundHeightAt(x, z) { return surfaceInfo(x || 0, z || 0).top; }
  // v16/L1 · **Das Messblatt der Stufung.** Tastet ein Quadrat ab und meldet, was daraus
  // wirklich geworden ist: Verteilung der vier Reliefarten, größter Nachbarsprung (= höchste
  // Wand) und wieviel davon über die Kletterschwelle des Läufers geht. Eine Reliefkarte kann man
  // sich ausdenken; ob daraus Hänge NEBEN Klippen werden, muß man zählen.
  function stepReport(cx, cz, radius, climbMax) {
    // **Der Probenabstand ist CELL, nicht „irgendwas Rundes“.** Erster Anlauf tastete 60×60 Punkte
    // über 480 u ab, also alle 8 u — gemeldet wurde damit der Sprung zwischen übernächsten
    // Nachbarn, nicht der zwischen zwei Würfeln. Eine Wand ist aber genau das: die Kante zwischen
    // zwei benachbarten Zellen. Ein Messgitter, das gröber ist als der Gegenstand, misst etwas
    // anderes und meldet es unter dessen Namen.
    const r = radius || 240;
    const n = Math.min(160, Math.max(8, Math.round((r * 2) / CELL)));
    const d = (r * 2) / n;
    const kl = CELL / Math.max(1, STEP.div);
    const tiers = { fein: 0, mittel: 0, grob: 0, klippe: 0 };
    let maxRise = 0, wall = 0, cells = 0, sumRise = 0;
    // v16/L1b · **Der Wandanteil wird nach Reliefart GETRENNT gezählt** — das ist die Zahl, die
    // L1 wirklich abnimmt. „Steigungen und Senken NEBEN hohen Klippen" heißt nicht „weniger
    // Wände" (eine Klippe IST eine Wand, das ist ihr Zweck), sondern: die Wände liegen in den
    // Klippengebieten, und der Rest ist begehbar. Ein Gesamtanteil kann das nicht zeigen — er
    // mittelt genau die Trennung weg, um die es geht.
    let wallK = 0, cellsK = 0, wallR = 0, cellsR = 0;
    let prevRow = null, prevKl = null;
    const isKl = (x, z) => stepAt(x, z) > CELL + 1e-6;
    for (let i = 0; i <= n; i++) {
      const row = [], rowKl = [];
      for (let j = 0; j <= n; j++) {
        const x = (cx || 0) - r + j * d, z = (cz || 0) - r + i * d;
        const s = stepAt(x, z);
        tiers[s <= kl + 1e-6 ? 'fein' : s <= CELL / 2 + 1e-6 ? 'mittel' : s <= CELL + 1e-6 ? 'grob' : 'klippe']++;
        const h = Math.round(heightAt(x, z, s) / s) * s;
        row.push(h); rowKl.push(s > CELL + 1e-6);
        const acc = (rise, klippe) => {
          if (rise > maxRise) maxRise = rise;
          sumRise += rise; cells++;
          const isWall = rise > (climbMax || 4.2);
          if (isWall) wall++;
          if (klippe) { cellsK++; if (isWall) wallK++; } else { cellsR++; if (isWall) wallR++; }
        };
        if (j > 0) acc(Math.abs(h - row[j - 1]), rowKl[j] || rowKl[j - 1]);
        if (prevRow) acc(Math.abs(h - prevRow[j]), rowKl[j] || prevKl[j]);
      }
      prevRow = row; prevKl = rowKl;
    }
    const total = (n + 1) * (n + 1);
    const pct = (v) => Math.round((v / total) * 100);
    return {
      an: STEP.on, feineStufe: +(CELL / Math.max(1, STEP.div)).toFixed(2), zelle: CELL,
      verteilung: { fein: pct(tiers.fein), mittel: pct(tiers.mittel), grob: pct(tiers.grob), klippe: pct(tiers.klippe) },
      maxSprung: +maxRise.toFixed(2),
      mittlererSprung: +(sumRise / Math.max(1, cells)).toFixed(2),
      wandAnteil: +((wall / Math.max(1, cells)) * 100).toFixed(1),   // % aller Nachbarschaften
      wandInKlippe: +((wallK / Math.max(1, cellsK)) * 100).toFixed(1),
      wandSonst: +((wallR / Math.max(1, cellsR)) * 100).toFixed(1),  // ← DIE Abnahmezahl von L1
      probeAbstand: +d.toFixed(2),
    };
  }
  function rebakeAll() { for (const ch of chunks) bakeChunk(ch, ch.cx, ch.cz); }
  // ⚠ v16/L1b · **Der Weltwürfel wechselt den Seed, und die Verteilungstabelle hängt am Seed.**
  // `lutKey` fängt das von selbst ab (der Schlüssel enthält den Seed), aber die Zeile steht hier
  // ausdrücklich: eine Tabelle, die eine WELT beschreibt, muss beim Weltwechsel fallen. Genau
  // diese Sorte stiller Kopplung war Naht 115.
  function setWorldContext(next) { wc = next; reliefLut = null; if (built) rebakeAll(); }
  function dispose(scene) {
    for (const ch of chunks) {
      group.remove(ch.mesh); group.remove(ch.scatter);
      ch.mesh.geometry.dispose(); ch.scatter.geometry.dispose();
    }
    terrainMat.dispose(); scatterMat.dispose();
    chunks.length = 0;
    if (scene) scene.remove(group);
    built = false;
  }

  return {
    name: 'voxel-terrain', group, build, recenter, update, groundHeightAt,
    surfaceInfo, stepAt, reliefAt, stepReport,
    // v16/L3 · Bewegung und Palette werden als **dieselben Uniform-Objekte** geteilt, nicht
    // kopiert: ein Schreibvorgang erreicht Terrain und Props zugleich. Ginge hier ein Klon heraus,
    // muesste jemand sie synchron halten — und genau diese Synchronisation ist die Stelle, an der
    // zwei Wahrheiten entstehen.
    get motionUniforms() {
      return { uTime: U.uTime, uAmp: U.uAmp, uMotionGain: U.uMotionGain, uEnergy: U.uEnergy,
               uBeat: U.uBeat, uFlow: U.uFlow, uZone: U.uZone };
    },
    get paletteUniforms() {
      return { uPA0: U.uPA0, uPA1: U.uPA1, uPA2: U.uPA2, uPB0: U.uPB0, uPB1: U.uPB1, uPB2: U.uPB2,
               uFront: U.uFront, uCenterX: U.uCenterX, uCenterZ: U.uCenterZ, uMaxDist: U.uMaxDist };
    },
    propSites,
    setPropsOwn(on) { const was = propsOwn; propsOwn = !!on; if (built && was !== propsOwn) rebakeAll(); },
    get propsOwn() { return propsOwn; },
    setPropDensity(v) { propDensity = Math.max(0, v); if (built) rebakeAll(); },
    get propDensity() { return propDensity; },
    // v16/L2d
    spawnRipple,
    setRippleParams(p) {
      if (!p) return;
      if (p.speed != null) U.uRipSpeed.value = p.speed;
      if (p.width != null) U.uRipWidth.value = p.width;
      if (p.gain != null) U.uRipGain.value = p.gain;
      if (p.maxLum != null) ripMaxLum = p.maxLum;
    },
    get rippleParams() { return { speed: U.uRipSpeed.value, width: U.uRipWidth.value, gain: U.uRipGain.value, maxLum: ripMaxLum }; },
    rippleReport() {
      return { plaetze: ripples.length, live: ripplesLive, gesamt: ripplesTotal,
               tempo: U.uRipSpeed.value, breite: U.uRipWidth.value,
               radien: ripples.filter((r) => r.w > 0.001).map((r) => +(r.z * U.uRipSpeed.value).toFixed(0)) };
    },
    get stepping() { return STEP; },
    setStepping(p) { Object.assign(STEP, p || {}); reliefLut = null; if (built) rebakeAll(); },
    setWorldContext, dispose, setPalette, setRainbow, setColorParams, setFog,
    setMotionGain: (v) => { U.uMotionGain.value = v; },
    // S15b · Schattenwerfer: bis zu zwei. (x, y, z, Radius) in Weltkoordinaten, Radius 0 = aus.
    setCasters: (a, b) => {
      const c0 = U.uCast0.value, c1 = U.uCast1.value;
      if (a) c0.set(a.x || 0, a.y || 0, a.z || 0, Math.max(0, a.r || 0)); else c0.set(0, 0, 0, 0);
      if (b) c1.set(b.x || 0, b.y || 0, b.z || 0, Math.max(0, b.r || 0)); else c1.set(0, 0, 0, 0);
    },
    setCasterGain: (v) => { U.uCastGain.value = Math.max(0, v == null ? 1 : v); },
    get casterGain() { return U.uCastGain.value; },
    // S18: 0 = Dancefloor, 1 = Flow. Dazwischen wird gemischt (die Phase wandert dabei einmal
    // durch — gewollt, das ist der Übergang).
    setFlow: (v) => { U.uFlow.value = Math.max(0, Math.min(1, v || 0)); },
    get flow() { return U.uFlow.value; },
    // Ruhezone 0 — folgt dem Fahrzeug (Walk: der Läufer; Flug: die sinkende Karte)
    setCalm: (x, z, r, amt) => {
      const z0 = U.uZone.value[0];
      z0.set(x || 0, z || 0, Math.max(0.001, r || 1), Math.max(0, Math.min(1, amt || 0)));
    },
    // Ruhezonen 1..3 — gesetzte Orte (Hex-Turm, Graveyard, Landeplätze). Übergabe:
    // [{ x, z, r, amt }] · leeres Array löscht sie. Mehr als drei würden eine Texture-Lookup
    // brauchen; drei reichen für gesetzte Landmarken.
    setZones: (list) => {
      const arr = U.uZone.value;
      for (let i = 1; i < 4; i++) {
        const z = (list && list[i - 1]) || null;
        if (z) arr[i].set(z.x || 0, z.z || 0, Math.max(0.001, z.r || 1), Math.max(0, Math.min(1, z.amt != null ? z.amt : 1)));
        else arr[i].set(0, 0, 1, 0);
      }
    },
    get zones() { return U.uZone.value.map((v) => ({ x: v.x, z: v.y, r: v.z, amt: v.w })); },
    // wie ruhig ist es an einem Ort? 0 = voller Tanz, 1 = still. Der Runner rechnet damit
    // die Bodenfreiheit der Karte: wo die Cubes stehen, braucht sie keine Bob-Reserve.
    calmAt: (x, z) => {
      let calm = 0;
      for (const v of U.uZone.value) {
        if (v.w <= 0.001) continue;
        const d = Math.hypot((x || 0) - v.x, (z || 0) - v.y);
        const t = Math.max(0, Math.min(1, (d - v.z * 0.55) / Math.max(1e-4, v.z * 0.45)));
        calm = Math.max(calm, v.w * (1 - t * t * (3 - 2 * t)));
      }
      return calm;
    },
    // current worst-case upward cube lift in world units — flight clamps above this so the
    // bobbing columns can never punch through the card.
    // `steady` (Runner-Default) rechnet den Beat-Anteil als MITTELWERT statt live: sonst atmet
    // die Flughöhen-Reserve im Takt, und Karte und Kamera hüpfen mit dem Beat mit.
    maxLift: (steady) => U.uAmp.value * U.uMotionGain.value * 8.0
      * (U.uEnergy.value * 0.7 + (steady ? 0.28 : U.uBeat.value * 0.5)),
    get worldContext() { return wc; },
    edgeTex,   // geteilte Kanten-Textur — der HUD-Würfel (S7) trägt dieselbe Oberfläche
    CHUNK, CELL, GRID,
  };
}
