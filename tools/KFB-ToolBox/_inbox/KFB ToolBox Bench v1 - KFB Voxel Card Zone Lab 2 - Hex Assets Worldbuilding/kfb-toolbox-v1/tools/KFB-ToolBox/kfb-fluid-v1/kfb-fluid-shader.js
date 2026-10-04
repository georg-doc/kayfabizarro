/**
 * KFB Fluid v1 · SHADER
 * =====================
 * Die Oberflaeche. Ein ShaderMaterial plus die Netz-Erzeugung, die dazugehoert.
 *
 * ZWEI ENTSCHEIDUNGEN, die den Unterschied machen:
 *
 * 1. EIN NETZ, nicht ein Quad pro Zelle. Kachel-Quads stossen Kante an Kante: bei transparentem
 *    Wasser reisst dort sub-pixelweise der dunkle Wannenboden durch, und Ueberlappen blendet
 *    doppelt (helles Raster an den Naehten). Ein durchgehendes Netz teilt echte Eckpunkte —
 *    dieselbe Koordinate aus derselben Formel, also gar keine Kante zum Reissen.
 *
 * 2. STROEMUNG ALS VERTEX-ATTRIBUT (`aFlow`), nicht als Uniform. Stillwasser und Fluss liegen
 *    im selben Netz; ein Uniform koennte nur eines von beidem. Betrag 0 = isotropes Waberm,
 *    Betrag 1 = voller Laengstransport, dazwischen wird ueberblendet. Damit gibt es an der
 *    Muendung keinen Schnitt.
 *
 * TEXTUREN (optional, beide aus dem KFB-Repo, nie mitkopieren — SourceRef mit Commit-Pin):
 *   dudv:  media/3D_Assets/KFB/waterdudv.jpg   Verzerrung
 *   map:   media/3D_Assets/KFB/water.jpg       Struktur (NICHT Farbquelle: entsaettigt, multiplikativ)
 * Ohne sie laeuft der rein prozedurale Pfad.
 *
 * TIEFE. `depthWrite:false` + `polygonOffset` sind Pflicht, nicht Geschmack: die Ebene liegt
 * knapp ueber Cube-Deckflaechen, und ohne beides streitet der Tiefenpuffer (sichtbar als
 * Schraffur). Die gezeichnete Ebene liegt zusaetzlich eine Viertelstufe UNTER der Klassifizier-
 * Hoehe, damit sie nie auf dem SUB-Raster der Deckflaechen sitzt.
 *
 * @module kfb-fluid-shader
 * @version 1.0.0
 * @herkunft KFB Card Zone Lab v2 (2026-09)
 */

/**
 * Fuellungen. `col` ist die Grundfarbe (RGB 0..1), `kind` steuert Blasenrate und Drone-Grundton:
 *   1 = fluessig · 2 = gasend · 3 = zaeh/fest
 */
export const FLUIDS = {
  wasser:    { label: 'Wasser',    col: [0.16, 0.42, 0.50], kind: 1 },
  oel:       { label: 'Öl',        col: [0.07, 0.06, 0.05], kind: 1 },
  saeure:    { label: 'Säure',     col: [0.46, 0.72, 0.14], kind: 2 },
  bubblegum: { label: 'Bubblegum', col: [0.88, 0.42, 0.62], kind: 1 },
  schlacke:  { label: 'Schlacke',  col: [0.30, 0.27, 0.25], kind: 3 },
};

export const FLUID_VERT = /* glsl */`
attribute vec2 aFlow;
varying vec3 vW;
varying vec2 vFlow;
void main(){
  vec4 p = vec4(position, 1.0);
  #ifdef USE_INSTANCING
    p = instanceMatrix * p;
  #endif
  vec4 wp = modelMatrix * p;
  vW = wp.xyz;
  vFlow = aFlow;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

export const FLUID_FRAG = /* glsl */`
uniform float uTime, uHasMap, uFoam, uAlpha, uFlowGain;
uniform vec3 uCol;
uniform sampler2D uDudv, uMap;
varying vec3 vW;
varying vec2 vFlow;

float hh(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float nz(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hh(i), hh(i+vec2(1,0)), f.x), mix(hh(i+vec2(0,1)), hh(i+vec2(1,1)), f.x), f.y);
}

void main(){
  // WELCHE Zelle Wasser traegt, entscheidet die GEOMETRIE, nicht der Shader. Ein Beschnitt hier
  // waere eine zweite Wahrheit und wuerde nie exakt mit den Cubes fluchten.
  vec2 fv = vFlow * uFlowGain;
  float fl = length(fv);

  vec2 drift = mix(vec2(uTime * 0.02, uTime * 0.015), fv * uTime * 0.16, min(fl, 1.0));
  vec2 duv   = (texture2D(uDudv, vW.xz * 0.02 + drift).rg - 0.5) * 0.6;
  vec2 adv   = mix(vec2(uTime * 0.25, -uTime * 0.18), fv * uTime * 1.6, min(fl, 1.0));

  float wave  = nz(vW.xz * 0.09 + duv * 4.0 + adv);
  float wave2 = nz(vW.xz * 0.31 + duv * 8.0 - adv * 1.5);

  // Laengsstreifen NUR im Fluss: quer zur Richtung gestaucht, laengs gestreckt. Das ist der
  // Unterschied zwischen "Wasser bewegt sich" und "Wasser fliesst irgendwohin".
  if (fl > 0.01) {
    vec2 n2d = normalize(fv), t2d = vec2(-n2d.y, n2d.x);
    float across = dot(vW.xz, t2d), along = dot(vW.xz, n2d);
    float streak = nz(vec2(across * 0.5, along * 0.08 - uTime * 1.1));
    wave = mix(wave, streak, 0.55);
  }

  // water.jpg traegt die STRUKTUR, die Fuellung die FARBE — deshalb entsaettigt und als
  // Multiplikator, nicht als Farbquelle. Sonst ist jede Fuellung am Ende blau.
  vec3  mp  = texture2D(uMap, vW.xz * 0.035 + duv * 0.5 + vec2(uTime * 0.012, -uTime * 0.009)).rgb;
  float ml  = dot(mp, vec3(0.299, 0.587, 0.114));
  float tex = mix(1.0, 0.55 + ml * 0.9, uHasMap);

  vec3 col = uCol * (0.55 + wave * 0.75) * tex + vec3(0.06, 0.07, 0.08) * wave2;

  float foam = smoothstep(0.55, 0.95, wave2) * uFoam;
  col += vec3(0.7, 0.72, 0.7) * foam * 0.5;

  gl_FragColor = vec4(col, uAlpha + foam * 0.28);
}`;

/**
 * @param {object} THREE
 * @param {object} [opts]
 * @param {string} [opts.fluid='wasser'] Schluessel aus FLUIDS.
 * @param {object} [opts.dudvMap] Vorgeladene Textur (RepeatWrapping, NoColorSpace).
 * @param {object} [opts.map]     Vorgeladene Textur (RepeatWrapping, SRGB).
 * @param {number} [opts.alpha=0.72]
 * @param {number} [opts.foam=1]
 * @returns {{material:object, uniforms:object, setFluid:Function, setColor:Function, update:Function, dispose:Function}}
 */
export function createFluidMaterial(THREE, opts = {}) {
  const key = FLUIDS[opts.fluid] ? opts.fluid : 'wasser';
  const f = FLUIDS[key];
  const uniforms = {
    uTime: { value: 0 },
    uCol: { value: new THREE.Color(f.col[0], f.col[1], f.col[2]) },
    uDudv: { value: opts.dudvMap || null },
    uMap: { value: opts.map || null },
    uHasMap: { value: opts.map ? 1 : 0 },
    uAlpha: { value: opts.alpha != null ? opts.alpha : 0.72 },
    uFoam: { value: opts.foam != null ? opts.foam : 1 },
    uFlowGain: { value: opts.flowGain != null ? opts.flowGain : 1 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, side: THREE.DoubleSide, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
    vertexShader: FLUID_VERT, fragmentShader: FLUID_FRAG,
  });
  let current = key;
  return {
    material, uniforms,
    get fluid() { return current; },
    setFluid(k) {
      const g = FLUIDS[k]; if (!g) return this;
      current = k; uniforms.uCol.value.setRGB(g.col[0], g.col[1], g.col[2]); return this;
    },
    setColor(r, g, b) { uniforms.uCol.value.setRGB(r, g, b); return this; },
    setMap(t) { uniforms.uMap.value = t || null; uniforms.uHasMap.value = t ? 1 : 0; return this; },
    setDudv(t) { uniforms.uDudv.value = t || null; return this; },
    /** Einmal pro Frame. `t` ist Sekunden seit Start, NICHT dt. */
    update(t) { uniforms.uTime.value = t; return this; },
    dispose() { material.dispose(); },
  };
}

/**
 * Baut das durchgehende Wassernetz aus einer Zellliste.
 *
 * Die Zellkoordinaten werden VOR der Eckenbildung auf das halbe Zellraster gerundet: schon
 * 1e-6 Abweichung zwischen zwei Nachbarzellen ergibt einen sichtbaren Riss.
 *
 * @param {object} THREE
 * @param {Array<{x:number,z:number}>} cells  Nur NASSE Zellen.
 * @param {object} opts
 * @param {number} opts.y     Hoehe der gezeichneten Ebene.
 * @param {number} opts.cell  Zellkante.
 * @param {(x:number,z:number)=>[number,number]} [opts.flowAt] Stroemung pro Zelle.
 * @param {object} [opts.geometry] Vorhandene BufferGeometry weiterverwenden (kein GC-Druck).
 * @returns {object} BufferGeometry mit position / aFlow / index / normals
 */
export function buildFluidGeometry(THREE, cells, opts) {
  const cell = opts.cell, h = cell / 2, y = opts.y;
  const flowAt = opts.flowAt || (() => [0, 0]);
  const g = opts.geometry || new THREE.BufferGeometry();
  const pos = [], idx = [], flow = [];
  const snap = (v) => Math.round(v / h) * h;
  cells.forEach((c) => {
    const cx = snap(c.x), cz = snap(c.z);
    const fv = flowAt(c.x, c.z);
    const b = pos.length / 3;
    pos.push(cx - h, y, cz - h, cx + h, y, cz - h, cx + h, y, cz + h, cx - h, y, cz + h);
    for (let v = 0; v < 4; v++) flow.push(fv[0] || 0, fv[1] || 0);
    idx.push(b, b + 2, b + 1, b, b + 3, b + 2);
  });
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aFlow', new THREE.Float32BufferAttribute(flow, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

export default createFluidMaterial;
