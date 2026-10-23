// kfb-headbeam.v1 · WS1d · Georg 22.10. (nach Recherche HEADLIGHTS_RESEARCH_R1, Chapman „Good Enough Volumetrics“, VLB, drei SpotLight):
// Sichtbares Scheinwerfer-Paar als echter 3D-Lichtkegel. Je Lampe ein elliptischer Kegelstumpf: an der Lampe so breit wie das Glas (radiusTop = Glas, keine
// Spitze), Achse aus dem Lampen-Anker leicht nach unten, fährt mit dem Wagen. Beide Kegel öffnen sich natürlich und überlagern sich vorn (gewollt).
// Ein Mesh für beide Lampen (1 Draw Call), die Form entsteht im Vertex-Shader aus denselben Zahlen wie das Kontaktlicht (groundfx-Form beam2).
// Licht-Shader, additiv, als Lichtvolumen (23.10.): Weglänge des Blickstrahls durch den Kegel, weiche Wände, Ausblenden über das letzte Viertel und am Boden
// (Bodenprofil je Lampe, keine Tiefentextur); Blendung nur von vorn zurückgenommen. Querschnitt elliptisch: Fleck und Volumen enden rund und weich.
// Zwei weiche Tonstufen (Kern heller, Saum). THREE wird übergeben, kein React.
//
//   const B = createHeadBeams({ THREE })   → B.mesh in die Szene
//   B.set({ origin, axis, roll, half, r0, tanH, tanV, len, ground: [[10 Höhen], [10 Höhen]], profLen, color, core, opacity })   jedes Bild, Szenen-Koordinaten
//   Lampen bei origin ± half·R; R/U wie in kfb-groundfx beam2 (beamFrame) – Kegel und Kontaktfläche sind dieselbe Form.
export const VERSION = 'kfb-headbeam.v1'
const SEG_R = 28, SEG_T = 24, NP = 10

const VERT = /* glsl */`
attribute float aSide; attribute float aT; attribute float aTh;
uniform vec3 uP[2]; uniform vec3 uAx; uniform vec3 uR; uniform vec3 uU; uniform float uR0, uTanH, uTanV, uLen, uProfLen; uniform float uG[${2 * NP}];
varying float vT; varying float vAbove; varying vec3 vN; varying vec3 vW; varying float vCore; varying float vSide;
float groundAt(int s, float d) { float x = clamp(d / uProfLen, 0.0, 1.0) * ${NP - 1}.0; int i = int(floor(x)); float f = x - float(i); int j = min(i + 1, ${NP - 1});
  float a = 0.0, b = 0.0; for (int k = 0; k < ${2 * NP}; k++) { if (k == s * ${NP} + i) a = uG[k]; if (k == s * ${NP} + j) b = uG[k]; } return mix(a, b, f); }
void main() {
  int s = int(aSide + 0.5); vec3 P = s == 0 ? uP[0] : uP[1]; float t = aT * uLen; vSide = aSide;
  float rh = uR0 + t * uTanH, rv = uR0 + t * uTanV; float c = cos(aTh), sn = sin(aTh);
  float X = c, Y = sn;   /* elliptischer Querschnitt (Georg 23.10.: rund statt kantig) */
  vec3 w = P + uAx * t + uR * (X * rh) + uU * (Y * rv);
  vN = normalize(uR * (X / rh) + uU * (Y / rv)); vT = aT; vW = w; vCore = abs(X);
  vec3 h = vec3(uAx.x, 0.0, uAx.z); float hl = max(1e-4, length(h)); float d = dot(w - P, h / hl);
  vAbove = w.y - groundAt(s, d);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(w, 1.0);
}`
// Lichtvolumen (Korrektur 23.10.): je Pixel die Weglänge des Blickstrahls durch DIESEN Kegel (Querschnitt wie im Vertex-Shader) aufsummiert – von hinten
// entlang des Strahls am dichtesten, von der Seite dünner, Wände weich. Gezeichnet wird nur die Eintrittsfläche (bzw. bei Kamera im Kegel die Austrittsfläche),
// Marsch bis zum Austritt oder unter den Boden (Bodenprofil je Lampe). Alpha = Deckkraft · (1 − e^(−Weg/1,6 m)) · 1,3: in klarer Luft nie deckend; gemischt als Screen (weich gekappt).
const FRAG = /* glsl */`
uniform vec3 uP[2]; uniform vec3 uAx; uniform vec3 uR; uniform vec3 uU; uniform float uR0, uTanH, uTanV, uLen, uProfLen; uniform float uG[${2 * NP}];
uniform vec3 uCol; uniform vec3 uCore; uniform float uOp; uniform vec3 uCam;
varying float vT; varying float vAbove; varying vec3 vN; varying vec3 vW; varying float vCore; varying float vSide;
float gAt(int s, vec3 X) { vec3 P = s == 0 ? uP[0] : uP[1]; vec3 h = vec3(uAx.x, 0.0, uAx.z); float d = dot(X - P, h / max(1e-4, length(h)));
  float x = clamp(d / uProfLen, 0.0, 1.0) * ${NP - 1}.0; int i = int(floor(x)); int j = min(i + 1, ${NP - 1}); return mix(uG[s * ${NP} + i], uG[s * ${NP} + j], x - float(i)); }
float shape(int s, vec3 X, out float t) { vec3 Lx = X - (s == 0 ? uP[0] : uP[1]); t = dot(Lx, uAx); if (t < 0.0 || t > uLen) return 2.0;
  float xn = dot(Lx, uR) / (uR0 + t * uTanH), yn = dot(Lx, uU) / (uR0 + t * uTanV); return xn * xn + yn * yn; }   /* ≤ 1: im Kegel (Ellipse) */
void main() {
  int s = int(vSide + 0.5); vec3 rd = normalize(vW - uCam); float t, e = 0.02;
  bool camIn = shape(s, uCam, t) <= 1.0;
  float s0, s1;
  if (!camIn) { if (shape(s, vW + rd * e, t) > 1.0) discard; s0 = length(vW - uCam); s1 = s0 + uLen * 2.0; }   /* Eintritt */
  else { if (shape(s, vW - rd * e, t) > 1.0) discard; s0 = 0.4; s1 = length(vW - uCam); }                       /* Kamera im Kegel: bis zur Wand */
  float acc = 0.0, sd = s0, jit = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  for (int k = 0; k < 14; k++) {
    vec3 X = uCam + rd * sd; float tt; float sh = shape(s, X, tt); if (sh > 1.0 && k > 0) break;
    float rr = uR0 + tt * min(uTanH, uTanV), dt = clamp(0.6 * rr, 0.06, 3.0), gy = gAt(s, X); if (X.y < gy - 0.05) break;
    float vT = tt / uLen, dens = (1.0 - smoothstep(0.7, 1.0, sh)) * smoothstep(0.0, 0.04, vT) * (1.0 - smoothstep(0.35, 1.0, vT)) * smoothstep(0.0, 0.1, X.y - gy);   /* verliert sich langsam über die zweite Hälfte, aus am Kegelende mit dem Fleck */
    dens *= 1.0 + 3.0 * (1.0 - smoothstep(0.0, 0.18, vT));                     /* nahe der Lampe dichter (Streulicht am stärksten an der Quelle) */
    acc += dens * dt * (k == 0 ? jit : 1.0); sd += dt; if (sd > s1) break; }
  float fill = 1.0 - exp(-acc / 1.6), a = uOp * 1.3 * fill;   /* sättigt langsamer: kein harter Rand, wo der Blick den flachen Strahl verlässt */
  a *= 1.0 - 0.8 * pow(max(dot(-rd, uAx), 0.0), 2.0);                           /* nur von VORN in die Lampe: zurücknehmen (der Blendstern übernimmt) */
  vec3 c = mix(uCol, uCore, smoothstep(0.3, 1.0, fill) * 0.6);                   /* zwei weiche Tonstufen: dichter Kern heller */
  gl_FragColor = vec4(linearToOutputTexel(vec4(c, 1.0)).rgb * a, a);
}`

// Kegel-Rahmen wie im groundfx-Shader: R = cross(Achse, oben), um roll zur Oberseite U gedreht
export function beamFrame(THREE, axis, roll, R = new THREE.Vector3(), U = new THREE.Vector3()) {
  const R0 = new THREE.Vector3().crossVectors(axis, new THREE.Vector3(0, 1, 0)).normalize(), U0 = new THREE.Vector3().crossVectors(R0, axis)
  R.copy(R0).multiplyScalar(Math.cos(roll)).addScaledVector(U0, Math.sin(roll)); U.crossVectors(R, axis); return { R, U }
}

export function createHeadBeams({ THREE }) {
  const pos = [], side = [], tt = [], th = [], idx = []
  for (let s = 0; s < 2; s++) { const base = pos.length / 3
    for (let j = 0; j <= SEG_T; j++) for (let i = 0; i <= SEG_R; i++) { pos.push(0, 0, 0); side.push(s); tt.push(j / SEG_T); th.push((i / SEG_R) * Math.PI * 2) }
    for (let j = 0; j < SEG_T; j++) for (let i = 0; i < SEG_R; i++) { const a = base + j * (SEG_R + 1) + i, b = a + SEG_R + 1; idx.push(a, b, a + 1, b, b + 1, a + 1) } }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1))
  geo.setAttribute('aT', new THREE.Float32BufferAttribute(tt, 1)); geo.setAttribute('aTh', new THREE.Float32BufferAttribute(th, 1)); geo.setIndex(idx)
  const U = {
    uP: { value: [new THREE.Vector3(), new THREE.Vector3()] }, uAx: { value: new THREE.Vector3(0, 0, 1) }, uR: { value: new THREE.Vector3(1, 0, 0) }, uU: { value: new THREE.Vector3(0, 1, 0) },
    uR0: { value: 0.1 }, uTanH: { value: 0.2 }, uTanV: { value: 0.2 }, uLen: { value: 10 }, uProfLen: { value: 10 }, uG: { value: new Array(2 * NP).fill(0) },
    uCol: { value: new THREE.Color('#ffffff') }, uCore: { value: new THREE.Color('#ffffff') }, uOp: { value: 0.3 }, uCam: { value: new THREE.Vector3() },
  }
  // Mischung „Screen“ (Quelle + Ziel·(1 − Quelle)): weich gekappt, Volumen über hellem Fleck brennt nicht aus (F8)
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: U, transparent: true, depthWrite: false, depthTest: true, blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcColorFactor, side: THREE.DoubleSide })
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'kfb-headbeam'; mesh.frustumCulled = false; mesh.renderOrder = 3
  mesh.onBeforeRender = (r, sc, cam) => { mesh.worldToLocal(cam.getWorldPosition(U.uCam.value)) }   // Kamera in Mesh- (= Szenen-) Koordinaten
  return {
    VERSION, mesh, uniforms: U, NP,
    set({ origin, axis, roll = 0, half, r0, tanH, tanV, len, ground, profLen, color, core, opacity }) {
      U.uAx.value.copy(axis).normalize(); beamFrame(THREE, U.uAx.value, roll, U.uR.value, U.uU.value)
      U.uP.value[0].copy(origin).addScaledVector(U.uR.value, half); U.uP.value[1].copy(origin).addScaledVector(U.uR.value, -half)
      U.uR0.value = r0; U.uTanH.value = tanH; U.uTanV.value = tanV; U.uLen.value = len; U.uProfLen.value = profLen
      for (let s = 0; s < 2; s++) for (let i = 0; i < NP; i++) U.uG.value[s * NP + i] = (ground[s] || ground[0])[i]
      if (color) U.uCol.value.copy(color); if (core) U.uCore.value.copy(core); if (opacity != null) U.uOp.value = opacity
    },
    dispose() { geo.dispose(); mat.dispose() },
  }
}
