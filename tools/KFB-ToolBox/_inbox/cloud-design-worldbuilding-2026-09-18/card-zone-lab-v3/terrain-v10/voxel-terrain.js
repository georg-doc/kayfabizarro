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
// KANONISCH ab 2026-07-26. Kein Fork mehr: die drei Zusätze heightStep / setCarve / setCarvePath
// sind hier übernommen, alle additiv und mit Default rückwärtskompatibel. Spec + Fallen für
// Aufrufer: docs/SPEC_v10_terrain.md.
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
    _edgeTex = new T.TextureLoader().load(_edgeCanon, undefined, undefined, () => {
      // Bilddaten erst im onLoad des Fallbacks übernehmen — vorher ist t.image undefined
      new T.TextureLoader().load(_edgeLocal, (t) => { _edgeTex.image = t.image; _edgeTex.needsUpdate = true; });
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
const VERT = /* glsl */`
  attribute vec4 aPack1;   // x=ramp y=rand(bright) z=rand2(sat/rainbow) w=water
  attribute vec4 aPack2;   // x=worldX y=worldZ z=motionSeed w=columnHeight
  uniform float uTime, uAmp, uMotionGain, uEnergy, uBeat;
  uniform float uFlow;     // 0 = Dancefloor (Phase aus dem Zufall) · 1 = Flow (Phase aus dem Ort)
  uniform vec4 uZone[4];   // (x, z, radius, amount) — Zone 0 folgt dem Fahrzeug, 1..3 sind gesetzt
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
    // Auf/Ab der Cubes: abs(sin(x)) hatte am unteren Umkehrpunkt einen KNICK (die Ableitung
    // springt) — das liest sich als Zucken statt als Sprung. Jetzt eine erhobene Kosinuswelle,
    // zusätzlich smoothstep-geäst: stetig in Wert UND Steigung, mit Hänger oben und unten.
    // (Georgs Verweis auf three.js webgl_instancing_dynamic — dort ist genau das der Trick.)
    // ZWEI MUSTER, ein Hub. Dancefloor: jede Säule hat ihre eigene Phase (Zufall aus dem Seed) —
    // richtig für den Beat, aber kein Fluss. Flow: die Phase kommt aus dem ORT, dann läuft eine
    // Welle durch das Terrain. Drei überlagerte Terme (schräg laufend, quer moduliert, langsam
    // radial) ergeben ein Interferenzmuster, das sich nie exakt wiederholt und trotzdem nicht
    // zufällig aussieht — der Unterschied, den three.js' webgl_instancing_dynamic vormacht.
    vec2 w = aPack2.xy * 0.045;
    float flowPh = uTime * 1.35
      + dot(w, vec2(0.82, 0.57)) * 3.1
      + sin(dot(w, vec2(-0.44, 0.90)) * 2.1 + uTime * 0.55) * 1.6
      + sin(length(w) * 0.7 - uTime * 0.22) * 0.9;
    float ph   = mix(uTime * 2.0 + seed * 6.2832, flowPh, uFlow);
    float rawB = 0.5 - 0.5 * cos(ph);
    float bob  = rawB * rawB * (3.0 - 2.0 * rawB);
    float ampW = uAmp * uMotionGain * 8.0 * (uEnergy * 0.7 + uBeat * 0.5);
    // RUHEZONEN: bis zu vier. Zone 0 folgt dem Fahrzeug (im Walk der Läufer, im Flug die
    // sinkende Karte — je näher am Boden, desto ruhiger), Zone 1..3 sind gesetzte Orte für
    // große Modelle (Hex-Turm, Graveyard): dort müssen die Cubes stillstehen, damit etwas
    // sauber darauf stehen kann. Bewegung kommt ab 55 % des Radius weich zurück.
    float calm = 1.0;
    for (int i = 0; i < 4; i++) {
      float amt = uZone[i].w;
      if (amt > 0.001) {
        float cd = distance(vec2(aPack2.x, aPack2.y), uZone[i].xy);
        calm = min(calm, mix(1.0 - amt, 1.0, smoothstep(uZone[i].z * 0.55, uZone[i].z, cd)));
      }
    }
    ampW *= calm;
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
  // D6-Unterteilung: die Oberflaeche rastet nicht auf ganze Cubes ein, sondern auf heightStep.
  // Mit CELL/6 entstehen sechs Stufen pro Cube — natuerliche Hoehenunterschiede statt Treppen.
  const STEP = opts.heightStep || CELL;
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
  };

  const terrainMat = new T.ShaderMaterial({ uniforms: U, vertexShader: VERT, fragmentShader: FRAG });
  const scatterMat = new T.ShaderMaterial({ uniforms: U, vertexShader: VERT, fragmentShader: SCAT_FRAG });

  // ---------------------------------------------------------------- biome height shaping (identical to v2)
  function biomeShape(h01) {
    const b = wc && wc.biome;
    if (b === 'plateau') { const s = 5; return Math.round(h01 * s) / s; }
    if (b === 'fractured') { const s = 8; return (Math.round(h01 * s) / s) * 0.7 + h01 * 0.3; }
    if (b === 'meadow') return Math.pow(h01, 1.6) * 0.8;
    if (b === 'scorched') return Math.pow(h01, 0.85);
    return h01;
  }
  function heightAt(wx, wz) {
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
    const detail = (valueNoise(wx * 0.045 + 5.7, wz * 0.045 - 3.1, (seed ^ 0x77C1) >>> 0) - 0.5) * CELL * 2.2;
    return h01 * hs - hs * 0.34 + detail;
  }
  // WATER v3: colour zone only. Height is NEVER clamped → water does not move terrain.
  // CUBE LOGIC: the surface is quantised to whole CELL steps, so every exposed face is a real
  // square cube and height changes read as walkable stairs instead of arbitrary slabs.
  function surfaceInfo(wx, wz) {
    const p = (wc && wc.params) || {};
    const water = p.waterLevel != null ? p.waterLevel : 0;
    const h = Math.round(heightAt(wx, wz) / STEP) * STEP;
    return { top: h, submerged: h < water };   // submerged = tint flag, top stays the real height
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

    let idx = 0;
    for (let j = 0; j < C; j++) {
      for (let i = 0; i < C; i++, idx++) {
        const wx = originX + (i - C / 2 + 0.5) * CELL;
        const wz = originZ + (j - C / 2 + 0.5) * CELL;
        const info = surfaceInfo(wx, wz);
        const top = info.top;
        const colH = clamp01((top - FLOOR) / (hs * 1.4 + Math.abs(FLOOR)));
        // CARVE (KFB Card Zone): ein Rechteck, in dem das Terrain SCHWEIGT. Die Zellen bleiben
        // im Buffer (Instanzzahl konstant), werden aber auf 0 skaliert — dort setzt die Card Zone
        // ihr eigenes Plateau. Vertrag sonst unveraendert.
        const carved = isCarved(wx, wz);
        _p.set(wx, FLOOR, wz); _q.identity();
        if (carved) _s.set(0.0001, 0.0001, 0.0001); else _s.set(1, Math.max(0.6, top - FLOOR), 1);
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
        if (!carved && !info.submerged && colH > 0.22) {
          const r = hash2(cxCell, czCell, seed ^ 0x7EED);
          if (r < scatterProb) {
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
  let carve = null;   // { x, z, hx, hz } — Rechteck, in dem keine Terrain-Cubes stehen
  let carvePath = null;   // { pts: [[x,z],…], w } — FLUSSLAUF: derselbe Vertrag, offene Kurve
  // Abstand zu einem Polygonzug. Der Flusslauf ist damit dieselbe Sache wie das Zonen-Rechteck:
  // eine Menge, in der das Terrain schweigt — nur eine andere Metrik.
  function distToPath(x, z, pts) {
    let best = Infinity;
    for (let i = 0; i < pts.length - 1; i++) {
      const ax = pts[i][0], az = pts[i][1], bx = pts[i + 1][0], bz = pts[i + 1][1];
      const dx = bx - ax, dz = bz - az, len2 = dx * dx + dz * dz;
      let t = len2 > 0 ? ((x - ax) * dx + (z - az) * dz) / len2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = ax + dx * t - x, pz = az + dz * t - z;
      const d = Math.sqrt(px * px + pz * pz);
      if (d < best) best = d;
    }
    return best;
  }
  function isCarved(wx, wz) {
    if (carve && Math.abs(wx - carve.x) <= carve.hx && Math.abs(wz - carve.z) <= carve.hz) return true;
    if (carvePath && distToPath(wx, wz, carvePath.pts) <= carvePath.w * 0.5) return true;
    return false;
  }
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
    if (transition) {
      transition.t += dt;
      const k = transition.t / transition.dur;
      U.uFront.value = k * 1.4;
      if (k >= 1) { setStops(U.uPA0, U.uPA1, U.uPA2, transition.stops); setWaterFrom(transition.stops); U.uFront.value = 0; transition = null; }
    }
  }

  function groundHeightAt(x, z) { return surfaceInfo(x || 0, z || 0).top; }
  function rebakeAll() { for (const ch of chunks) bakeChunk(ch, ch.cx, ch.cz); }
  function setWorldContext(next) { wc = next; if (built) rebakeAll(); }
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
    setCarve: (rect) => { carve = rect ? { x: rect.x || 0, z: rect.z || 0, hx: rect.hx || 0, hz: rect.hz || 0 } : null; if (built) rebakeAll(); },
    // FLUSSLAUF als zweite Carve-Form: setCarvePath([[x,z],…], breite). Rechteck und Pfad gelten
    // gleichzeitig — die Zone stanzt ihr Plateau, der Fluss seinen Lauf.
    setCarvePath: (pts, w) => {
      carvePath = (pts && pts.length > 1) ? { pts: pts.map((p) => [p[0], p[1]]), w: w || CELL * 3 } : null;
      if (built) rebakeAll();
    },
    carvedAt: isCarved,
    pathDistAt: (x, z) => (carvePath ? distToPath(x, z, carvePath.pts) : Infinity),
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
