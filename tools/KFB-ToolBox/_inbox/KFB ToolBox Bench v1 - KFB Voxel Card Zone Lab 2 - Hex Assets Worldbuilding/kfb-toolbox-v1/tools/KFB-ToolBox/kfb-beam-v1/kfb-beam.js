/**
 * KFB Beam v1 · HOLO-SCHLEIER
 * ===========================
 * Die Verbindung zwischen einem Objekt am Boden und einer Flaeche in der Luft.
 *
 * KEIN KEGEL, KEINE LINIEN. Vier Bahnen spannen sich von vier Bodenecken zu vier
 * Kartenecken; im Vertex-Shader werden sie quer zur Bahn ausgebeult und nach oben
 * aufgeloest. Harte Glaskanten passen nicht zu Papier und Tusche — ein Schleier schon.
 * Im Fragment-Shader steigen zwei gegenlaeufige fbm-Felder auf: Schwaden, keine Scanlines,
 * kein Raster.
 *
 * DAS EIGENTLICHE PROBLEM war nie das Aussehen, sondern die ZUORDNUNG der Ecken. Eine
 * senkrechte Karte hat vier Ecken, die in XZ auf nur ZWEI Punkte fallen — eine
 * Ecke-fuer-Ecke-Nachbarschaftssuche kann oben und unten dort nicht unterscheiden und kippt
 * bei etwa 90 Grad in eine Schleife (der Schleier verdreht sich). Zwei Gegenmittel:
 *
 *   1. ZYKLUS-ERHALTENDE ZUORDNUNG. Geprueft werden nur die acht Permutationen, die den
 *      Eckenumlauf erhalten (4 Versaetze x 2 Richtungen). Eine Verdrehung ist damit
 *      konstruktiv unmoeglich.
 *   2. HYSTERESE + NACHLAUF. Rund um die Diagonale liegen zwei Zuordnungen fast gleichauf
 *      und die Kosten rauschen mit jedem Grad Drehung — der Gewinner wechselt sonst im
 *      Sekundentakt. Die gebrauchte Zuordnung bleibt, bis eine andere 30 % besser ist, und
 *      die Eckpunkte laufen ihren Zielen exponentiell nach.
 *
 * @module kfb-beam
 * @version 1.0.0
 * @herkunft KFB Card Zone Lab v2 (2026-09)
 */

export const BEAM_VERT = /* glsl */`
attribute float aSide;
uniform vec3 uG[4]; uniform vec3 uC[4]; uniform float uTime, uBulge;
varying vec2 vUv; varying float vWarp;
float hh(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float nz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hh(i), hh(i+vec2(1,0)), f.x), mix(hh(i+vec2(0,1)), hh(i+vec2(1,1)), f.x), f.y); }
void main(){
  int s = int(aSide + 0.5);
  int t = s + 1; if (t > 3) t = 0;
  vec3 g0 = uG[s], g1 = uG[t], c0 = uC[s], c1 = uC[t];
  vUv = uv;
  vec3 lo = mix(g0, g1, uv.x), hi = mix(c0, c1, uv.x);
  vec3 p = mix(lo, hi, uv.y);
  vec3 along = normalize(g1 - g0 + 0.0001);
  vec3 nrm = normalize(cross(along, vec3(0.0, 1.0, 0.0)));
  float belly = sin(uv.y * 3.14159);
  float w  = nz(vec2(uv.x * 3.0 + float(s) * 4.0, uv.y * 2.2 - uTime * 0.22)) - 0.5;
  float w2 = nz(vec2(uv.x * 7.0 - float(s) * 2.0, uv.y * 5.0 + uTime * 0.35)) - 0.5;
  vWarp = w;
  p += nrm * (w * 5.5 + w2 * 1.8) * belly * uBulge;
  p.y += (w2 * 1.2) * belly * uBulge;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

export const BEAM_FRAG = /* glsl */`
uniform float uTime, uGain; uniform vec3 uCol, uCol2;
varying vec2 vUv; varying float vWarp;
float hh(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float nz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hh(i), hh(i+vec2(1,0)), f.x), mix(hh(i+vec2(0,1)), hh(i+vec2(1,1)), f.x), f.y); }
float fb(vec2 p){ return nz(p) * 0.6 + nz(p * 2.3 + 7.0) * 0.28 + nz(p * 5.1 - 3.0) * 0.12; }
void main(){
  float v = vUv.y;
  float f1 = fb(vec2(vUv.x * 4.0, v * 2.4 - uTime * 0.5));
  float f2 = fb(vec2(vUv.x * 9.0 + 3.0, v * 5.5 - uTime * 0.9));
  float body = smoothstep(0.28, 0.85, f1 * 0.65 + f2 * 0.45);
  float rise = smoothstep(0.0, 0.18, v) * (1.0 - smoothstep(0.45, 1.0, v) * 0.8);
  float edge = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
  float a = body * rise * (0.07 + edge * 0.26);
  vec3 c = mix(uCol, uCol2, smoothstep(0.1, 0.9, v) * 0.7 + vWarp * 0.3);
  gl_FragColor = vec4(c * (0.7 + body * 0.8), a * uGain);
}`;

/**
 * @param {object} cfg
 * @param {object} cfg.THREE · @param {object} cfg.scene
 * @param {number} [cfg.segU=12] · @param {number} [cfg.segV=16] Aufloesung je Bahn.
 * @param {number} [cfg.colorLow=0xffd9a8]  Farbe am Boden.
 * @param {number} [cfg.colorHigh=0x8fd0ff] Farbe oben.
 * @param {number} [cfg.gain=0.85]
 * @param {number} [cfg.bulge=1] Staerke der Ausbeulung. 0 = flache Bahnen.
 */
export function createBeam(cfg) {
  const T = cfg.THREE;
  const SU = cfg.segU || 12, SV = cfg.segV || 16;
  const verts = 4 * SU * SV * 6;
  const pos = new Float32Array(verts * 3);        // wird im Shader berechnet, nie hier
  const side = new Float32Array(verts);
  const uvs = new Float32Array(verts * 2);
  let o = 0;
  for (let s4 = 0; s4 < 4; s4++) {
    for (let i = 0; i < SU; i++) {
      for (let j = 0; j < SV; j++) {
        const u0 = i / SU, u1 = (i + 1) / SU, v0 = j / SV, v1 = (j + 1) / SV;
        [[u0, v0], [u1, v0], [u1, v1], [u0, v0], [u1, v1], [u0, v1]].forEach(([u, v]) => {
          uvs[o * 2] = u; uvs[o * 2 + 1] = v; side[o] = s4; o++;
        });
      }
    }
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new T.BufferAttribute(uvs, 2));
  geo.setAttribute('aSide', new T.BufferAttribute(side, 1));

  const uniforms = {
    uTime: { value: 0 }, uGain: { value: cfg.gain != null ? cfg.gain : 0.85 },
    uBulge: { value: cfg.bulge != null ? cfg.bulge : 1 },
    uCol: { value: new T.Color(cfg.colorLow != null ? cfg.colorLow : 0xffd9a8) },
    uCol2: { value: new T.Color(cfg.colorHigh != null ? cfg.colorHigh : 0x8fd0ff) },
    uG: { value: [new T.Vector3(), new T.Vector3(), new T.Vector3(), new T.Vector3()] },
    uC: { value: [new T.Vector3(), new T.Vector3(), new T.Vector3(), new T.Vector3()] },
  };
  const material = new T.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, side: T.DoubleSide,
    blending: T.AdditiveBlending, vertexShader: BEAM_VERT, fragmentShader: BEAM_FRAG,
  });
  const mesh = new T.Mesh(geo, material);
  mesh.name = 'kfb-beam';
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;
  cfg.scene.add(mesh);

  let perm = null, init = false;

  /** Kosten einer Zuordnung: Summe der XZ-Quadratabstaende Boden↔Karte. */
  function cost(raw, p) {
    const G = uniforms.uG.value;
    let c = 0;
    for (let k = 0; k < 4; k++) {
      const a = raw[p[k]], g = G[k];
      c += (a.x - g.x) * (a.x - g.x) + (a.z - g.z) * (a.z - g.z);
    }
    return c;
  }

  /**
   * Einmal pro Frame.
   * @param {object} o
   * @param {Array<{x,y,z}>} o.ground Vier Bodenecken, im Umlauf.
   * @param {Array<{x,y,z}>} o.target Vier Zielecken (z. B. aus der Weltmatrix der Karte).
   * @param {number} o.dt   Frame-Zeit fuer den Nachlauf.
   * @param {number} o.time Sekunden seit Start.
   * @param {number} [o.gain] Deckkraft, sonst bleibt der gesetzte Wert.
   */
  function update(o) {
    const G = uniforms.uG.value, C = uniforms.uC.value;
    for (let k = 0; k < 4; k++) G[k].set(o.ground[k].x, o.ground[k].y, o.ground[k].z);
    const raw = o.target.map((p) => new T.Vector3(p.x, p.y, p.z));

    let bestPerm = [0, 1, 2, 3], bestCost = Infinity;
    for (let dir = 0; dir < 2; dir++) {
      for (let sh = 0; sh < 4; sh++) {
        const p = [0, 1, 2, 3].map((k) => (dir ? (sh - k + 8) % 4 : (sh + k) % 4));
        const c = cost(raw, p);
        if (c < bestCost) { bestCost = c; bestPerm = p; }
      }
    }
    if (!perm) perm = bestPerm;
    else if (bestCost < cost(raw, perm) * 0.7) perm = bestPerm;   // Hysterese

    if (!init) { for (let k = 0; k < 4; k++) C[k].copy(raw[perm[k]]); init = true; }
    else {
      const a = 1 - Math.pow(0.0001, o.dt || 0.016);
      for (let k = 0; k < 4; k++) C[k].lerp(raw[perm[k]], a);
    }
    uniforms.uTime.value = o.time || 0;
    if (o.gain != null) uniforms.uGain.value = o.gain;
    return api;
  }

  const api = {
    name: 'kfb-beam', version: '1.0.0', mesh, material, uniforms,
    update,
    setGain(v) { uniforms.uGain.value = v; return api; },
    setColors(low, high) { uniforms.uCol.value.set(low); uniforms.uCol2.value.set(high); return api; },
    setVisible(v) { mesh.visible = !!v; return api; },
    /**
     * Sichtbarkeitsrampe: aus der Naehe darf der Schleier die Karte nicht ueberdecken.
     * @param {number} dist Kameraabstand zur Karte. @param {number} [near=26] @param {number} [span=34]
     */
    distanceGain(dist, near = 26, span = 34) { return Math.min(1, Math.max(0, (dist - near) / span)); },
    measure() {
      return {
        vertices: verts, lanes: 4, permutation: perm ? perm.join(',') : null,
        gain: +uniforms.uGain.value.toFixed(3), visible: mesh.visible,
      };
    },
    dispose() { cfg.scene.remove(mesh); geo.dispose(); material.dispose(); },
  };
  return api;
}

export default createBeam;
