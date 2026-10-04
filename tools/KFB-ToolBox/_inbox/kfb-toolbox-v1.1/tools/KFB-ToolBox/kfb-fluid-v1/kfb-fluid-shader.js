/**
 * KFB Fluid v1 · SHADER
 * =====================
 * WORTLAUT AUS DER QUELLE. Vertex- und Fragment-Shader sind Zeile fuer Zeile aus
 * `KFB Card Zone Lab v2.dc.html#buildFluidSurface()` uebernommen. Nichts umformuliert,
 * nichts "aufgeraeumt", nichts parametrisiert.
 *
 * NAHT (die einzige eigene Arbeit): die Shader-Strings sind hier Template-Literale statt
 * `[...].join('\n')`, und das Material kommt aus einer Fabrikfunktion statt inline. Der
 * GLSL-Text selbst ist unveraendert.
 *
 * WAS IN DER QUELLE ABGESCHALTET WAR — und hier abgeschaltet BLEIBT:
 *   `float u = 0.5;` ist eine Konstante, seit der Shader-Beschnitt aus der Fluessigkeit
 *   herausgenommen wurde (die Geometrie entscheidet jetzt, welche Zelle Wasser traegt).
 *   Damit ist `shore` konstruktiv 1 und `foam` konstruktiv 0. Der Schaum-Block ist toter
 *   Code im Bild. Er bleibt trotzdem drin und bleibt tot: eine Kopie, die abgeschalteten
 *   Code einschaltet, ist keine Kopie.
 *
 *   In v1.0.0 dieses Moduls war genau das passiert (uFoam machte den Schaum live). Das war
 *   der Grund, warum die Bank grauen Schaum zeigte, den das Lab nie hatte. Behoben in 1.1.0.
 *
 * DIE TEXTUREN SIND NICHT OPTIONAL, auch wenn der Code ohne sie laeuft.
 * Ohne `uDudv` liefert `texture2D` Null, `duv` ist dann die Konstante -0.3 und die gesamte
 * Verzerrung faellt weg. Ohne `uMap` ist `tex` konstant 1.0 und die Struktur fehlt. Uebrig
 * bleibt ein flaches, stumpfes Rauschfeld — NICHT das Bild aus dem Lab. `loadFluidTextures()`
 * laedt beide aus dem Repo (SourceRef, keine Kopie).
 *
 * @module kfb-fluid-shader
 * @version 1.1.0
 * @quelle KFB Card Zone Lab v2.dc.html · buildFluidSurface() · Uniforms, vertexShader, fragmentShader
 */

/** SourceRef-Basis. Daten ueber raw (KFB-Regel 2 betrifft Module, nicht Bilddaten). */
export const KFB_RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
export const DUDV_URL = KFB_RAW + 'KFB/waterdudv.jpg';
export const WATER_URL = KFB_RAW + 'KFB/water.jpg';

/**
 * Fuellungen — Tabelle aus dem Lab, `FLUIDS`. `kind` steuert Blasenrate und Drone-Grundton:
 * 1 = fluessig · 2 = gasend · 3 = zaeh/fest.
 */
export const FLUIDS = {
  wasser:    { label: 'Wasser',    col: [0.16, 0.42, 0.50], kind: 1 },
  oel:       { label: 'Öl',        col: [0.07, 0.06, 0.05], kind: 1 },
  saeure:    { label: 'Säure',     col: [0.46, 0.72, 0.14], kind: 2 },
  bubblegum: { label: 'Bubblegum', col: [0.88, 0.42, 0.62], kind: 1 },
  schlacke:  { label: 'Schlacke',  col: [0.30, 0.27, 0.25], kind: 3 },
};

// ---------------------------------------------------------------- GLSL, verbatim

export const FLUID_VERT = [
  'attribute vec2 aFlow;',
  'varying vec3 vW;',
  'varying vec2 vFlow;',
  'void main(){',
  '  vec4 p = vec4(position, 1.0);',
  '  #ifdef USE_INSTANCING',
  '    p = instanceMatrix * p;',
  '  #endif',
  '  vec4 wp = modelMatrix * p;',
  '  vW = wp.xyz;',
  '  vFlow = aFlow;',
  '  gl_Position = projectionMatrix * viewMatrix * wp;',
  '}',
].join('\n');

export const FLUID_FRAG = [
  'uniform float uTime, uMoat, uHasMap; uniform vec3 uCol; uniform vec2 uZ;',
  'uniform sampler2D uDudv, uMap;',
  'varying vec3 vW;',
  'varying vec2 vFlow;',
  'float hh(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }',
  'float nz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
  '  return mix(mix(hh(i), hh(i+vec2(1,0)), f.x), mix(hh(i+vec2(0,1)), hh(i+vec2(1,1)), f.x), f.y); }',
  'void main(){',
  // Kein Beschnitt mehr im Shader: WELCHE Zelle Wasser traegt, entscheidet die Geometrie
  // (nur Zellen, deren Wannenboden unter dem Wasserstand liegt). Dadurch ist die Kante
  // zwangsweise buendig mit den Cubes.
  '  float u = 0.5;',
  // STROEMUNG: Stillwasser (Graben, Teiche) treibt wie bisher isotrop, Flusszellen tragen
  // eine Richtung als Attribut — das Muster wandert dann laengs des Laufs, statt zu wabern.
  '  float fl = length(vFlow);',
  '  vec2 drift = mix(vec2(uTime * 0.02, uTime * 0.015), vFlow * uTime * 0.16, min(fl, 1.0));',
  '  vec2 duv = (texture2D(uDudv, vW.xz * 0.02 + drift).rg - 0.5) * 0.6;',
  '  vec2 adv = mix(vec2(uTime * 0.25, -uTime * 0.18), vFlow * uTime * 1.6, min(fl, 1.0));',
  '  float wave = nz(vW.xz * 0.09 + duv * 4.0 + adv);',
  '  float wave2 = nz(vW.xz * 0.31 + duv * 8.0 - adv * 1.5);',
  // Laengsstreifen nur im Fluss: quer zur Richtung gestaucht, laengs gestreckt.
  '  if (fl > 0.01) {',
  '    vec2 n2d = normalize(vFlow), t2d = vec2(-n2d.y, n2d.x);',
  '    float across = dot(vW.xz, t2d), along = dot(vW.xz, n2d);',
  '    float streak = nz(vec2(across * 0.5, along * 0.08 - uTime * 1.1));',
  '    wave = mix(wave, streak, 0.55);',
  '  }',
  // water.jpg (Basis aus Zone S1): ihre Struktur traegt das Bild, die Fuellung nur die
  // Farbe — deshalb entsaettigt und als Multiplikator, nicht als Farbquelle.
  '  vec3 mp = texture2D(uMap, vW.xz * 0.035 + duv * 0.5 + vec2(uTime * 0.012, -uTime * 0.009)).rgb;',
  '  float ml = dot(mp, vec3(0.299, 0.587, 0.114));',
  '  float tex = mix(1.0, 0.55 + ml * 0.9, uHasMap);',
  '  vec3 col = uCol * (0.55 + wave * 0.75) * tex + vec3(0.06, 0.07, 0.08) * wave2;',
  // Schaum an beiden Ufern: dort, wo die Fluessigkeit den Rand beruehrt, bricht sie auf.
  // (Mit u = 0.5 ist shore == 1 und foam == 0 — der Block ist im Bild aus. Siehe Modulkopf.)
  '  float shore = min(smoothstep(0.0, 0.22, u), smoothstep(1.0, 0.78, u));',
  '  float foam = smoothstep(0.55, 0.95, wave2) * (1.0 - shore);',
  '  col += vec3(0.7, 0.72, 0.7) * foam * 0.5;',
  '  float a = 0.72 + foam * 0.28;',
  '  gl_FragColor = vec4(col, a);',
  '}',
].join('\n');

// ---------------------------------------------------------------- Fabrik

/**
 * Laedt die beiden Wassertexturen genau so, wie das Lab sie laedt (`loadTex`):
 * RepeatWrapping, anisotropy 8, dudv ohne Farbraum, water.jpg in sRGB.
 * @param {object} THREE
 * @param {object} [o] { dudvUrl, mapUrl }
 * @returns {Promise<{dudv:object|null, map:object|null}>}
 */
export function loadFluidTextures(THREE, o = {}) {
  const one = (url, srgb) => new Promise((res) => {
    const L = new THREE.TextureLoader(); L.crossOrigin = 'anonymous';
    L.load(url, (t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = 8;
      res(t);
    }, undefined, () => res(null));
  });
  return Promise.all([
    one(o.dudvUrl || DUDV_URL, false),
    one(o.mapUrl || WATER_URL, true),
  ]).then(([dudv, map]) => ({ dudv, map }));
}

/**
 * @param {object} THREE
 * @param {object} [opts] { fluid, dudvMap, map, moat, halfX, halfZ }
 * @returns {{material,uniforms,setFluid,setColor,setMap,setDudv,update,ready,dispose}}
 */
export function createFluidMaterial(THREE, opts = {}) {
  const key = FLUIDS[opts.fluid] ? opts.fluid : 'wasser';
  const f = FLUIDS[key];
  // Uniform-Satz wie im Lab. uMoat und uZ werden vom Fragment-Shader deklariert, aber nicht
  // gelesen (Rest des frueheren Shader-Beschnitts). Sie bleiben, weil die Kopie bleibt.
  const uniforms = {
    uTime: { value: 0 },
    uCol: { value: new THREE.Color(f.col[0], f.col[1], f.col[2]) },
    uMoat: { value: opts.moat != null ? opts.moat : 3 },
    uZ: { value: new THREE.Vector2(opts.halfX || 24, opts.halfZ || 13.5) },
    uDudv: { value: opts.dudvMap || null },
    uMap: { value: opts.map || null },
    uHasMap: { value: opts.map ? 1 : 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, side: THREE.DoubleSide, depthWrite: false,
    // Tiefen-Versatz als zweite Sicherung: selbst wenn eine Deckflaeche der Ebene sehr nahe
    // kommt, gewinnt die Ebene eindeutig statt zu flackern.
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
    vertexShader: FLUID_VERT, fragmentShader: FLUID_FRAG,
  });
  let current = key;

  const api = {
    material, uniforms,
    get fluid() { return current; },
    get hasTextures() { return !!(uniforms.uDudv.value && uniforms.uMap.value); },
    setFluid(k) {
      const g = FLUIDS[k]; if (!g) return api;
      current = k; uniforms.uCol.value.setRGB(g.col[0], g.col[1], g.col[2]); return api;
    },
    setColor(r, g, b) { uniforms.uCol.value.setRGB(r, g, b); return api; },
    setMap(t) { uniforms.uMap.value = t || null; uniforms.uHasMap.value = t ? 1 : 0; return api; },
    setDudv(t) { uniforms.uDudv.value = t || null; return api; },
    /** Laedt die Repo-Texturen nach und haengt sie ein. */
    ready(o) {
      return loadFluidTextures(THREE, o).then(({ dudv, map }) => {
        if (dudv) api.setDudv(dudv);
        if (map) api.setMap(map);
        return api;
      });
    },
    /** Einmal pro Frame. `t` ist Sekunden seit Start, NICHT dt. */
    update(t) { uniforms.uTime.value = t; return api; },
    dispose() { material.dispose(); },
  };
  return api;
}

/**
 * Baut das durchgehende Wassernetz aus einer Zellliste.
 *
 * EIN NETZ statt Instanz-Quads. Kachel-Quads stossen Kante an Kante: bei transparentem
 * Wasser reisst dort sub-pixelweise der dunkle Wannenboden durch, und Ueberlappen blendet
 * doppelt (helles Raster an den Naehten). Ein durchgehendes Netz teilt echte Eckpunkte.
 *
 * Zellkoordinaten werden VOR der Eckenbildung auf das halbe Zellraster gerundet: schon
 * 1e-6 Abweichung zwischen zwei Nachbarzellen ergibt einen sichtbaren Riss.
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
