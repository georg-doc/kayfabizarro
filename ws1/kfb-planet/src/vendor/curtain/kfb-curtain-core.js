/* KFB Theatre Curtain Core · recovery candidate r1 · 2026-10-07 · Issue #372
   Donor: KFB Theatre Curtain v2.html (blob db96d54bd761) ← three.js examples/webgpu_compute_cloth.html @ 7300402f.
   KEPT VERBATIM from donor: verlet vertex/spring topology (structural + 2 diagonals), spring-force kernel,
   vertex-force kernel body (dampening, spring loop, triNoise3D wind on z), quad-centroid render mesh,
   analytic per-quad normal in positionNode incl. mirror-sign fix, no tiled texture, 360 Hz sub-steps.
   TUNED (see KEEP_TUNE_REJECT.md):
   T1 cloth hangs vertically at construction + hidden warm-up (donor starts horizontal and swings down)
   T2 fixed row gathers toward the wing (donor slides all pins by one offset → panel translates, no gathering)
   T3 pins zig-zag in z by an amplitude derived from pin spacing → real pinch pleats, deeper when gathered
   T4 render-mesh row loop bound fixed (donor iterates y < segX → only 30 of 40 rows were drawn)
   T5 opaque material; right panel 3.5 cm behind left (donor: opacity 0.85, both panels coplanar → seam/z-fight)
   T6 heavier hang (dampening 0.992, wind 0.12) · T6b momentum drive (MOTION): ramped pull, capped run, end stop + rebound
   T7 optional tieback force (lower-third, inner edge) · QUARANTINED in r1: no self-collision, cloth folds over itself and stays tangled after close
   T8 impact impulse
   T10 r3: rounder pleats (segX 64 / pin every 8, 12 % slack, pin depth 60 %) + hem weight (bottom 10 %, strongest at the leading edge)
   T9 material presets; patina is low-frequency colour/roughness in cloth parameter space only (moves with the cloth)
   Hardware (rail, rings, pelmet, proscenium, floor, footlights) is separate static geometry.
   Curtain Core owns curtain presentation state only. It does not own renderer, camera, world, loading, audio or save. */
import * as THREE from 'three/webgpu';
import { Fn, If, Return, instancedArray, instanceIndex, uniform, select, attribute, Loop, float, vec3, transformNormalToView, cross, triNoise3D, time, mix, smoothstep, mx_noise_float, positionWorld, color } from 'three/tsl';

export const STATES = ['closed_rest', 'covered_wait', 'opening', 'open_rest', 'closing', 'impact', 'fallback_reveal'];

export const DIM = { topY: 1.22, H: 2.32, Wspan: 1.6, fullness: 0.88, railGap: -0.09, segX: 64, segY: 48, pinEvery: 8, gather: 0.72, zBack: 0.035 };
DIM.Wc = DIM.Wspan / DIM.fullness;
DIM.floorY = DIM.topY - DIM.H - 0.025;

const VELVET = { color: '#4a0b11', roughness: 0.86, sheen: 1, sheenColor: '#c4545c', sheenRoughness: 0.34, transparent: false, opacity: 1 };
export const MATERIALS = {
  donor: { label: 'Donor v2 · #8c3f37 satin, 0.85 opacity', color: '#8c3f37', roughness: 1, sheen: 1, sheenColor: '#ffffff', sheenRoughness: 0.5, transparent: true, opacity: 0.85, patina: 0, hwAge: 0.2 },
  A: { label: 'A · Donor-clean aged velvet', ...VELVET, patina: 0, hwAge: 0.35 },
  B: { label: 'B · Motion-safe macro patina', ...VELVET, patina: 1, hwAge: 0.35 },
  C: { label: 'C · Clean cloth + aged hardware', ...VELVET, patina: 0, hwAge: 1 },
  P: { label: 'Preferred · B cloth + C hardware', ...VELVET, patina: 1, hwAge: 1 },
};

export const MOTION = { k: 26, kReduced: 60, zetaOpen: 0.42, zetaClose: 0.5, aMax: 3.4, vMax: 1.05, overOpen: 0.05, overClose: 0.03, bounce: 0.25 };

/* Shared velvet node graph: base colour + sun-fade blotches + hem dust + top shade, all in clothUV (rest-space). */
function velvetNodes(u, seed) {
  const uvc = attribute('clothUV', 'vec2');
  const n1 = mx_noise_float(vec3(uvc.x.mul(2.6), uvc.y.mul(1.35), float(seed))).mul(0.5).add(0.5);
  const n2 = mx_noise_float(vec3(uvc.x.mul(6.1), uvc.y.mul(2.9), float(seed + 3.7))).mul(0.5).add(0.5);
  const n = n1.mul(0.72).add(n2.mul(0.28));
  const fade = smoothstep(0.5, 0.85, n).mul(u.patina);
  const hem = smoothstep(0.8, 1.0, uvc.y).mul(u.patina);
  const topShade = float(1).sub(smoothstep(0.0, 0.14, uvc.y)).mul(u.patina);
  let c = mix(u.base, u.faded, fade.mul(0.78));
  c = mix(c, u.dust, hem.mul(0.5));
  c = c.mul(float(1).sub(topShade.mul(0.4)));
  const r = u.rough.add(fade.mul(0.08)).add(hem.mul(0.1));
  return { colorNode: c, roughnessNode: r };
}
function makeVelvetUniforms() {
  return { base: uniform(new THREE.Color(VELVET.color)), faded: uniform(new THREE.Color('#84352c')), dust: uniform(new THREE.Color('#3b2724')), patina: uniform(0), rough: uniform(VELVET.roughness) };
}
function applyVelvet(mat, u, p) {
  u.base.value.set(p.color); u.rough.value = p.roughness; u.patina.value = p.patina;
  mat.sheen = p.sheen; mat.sheenColor = new THREE.Color(p.sheenColor); mat.sheenRoughness = p.sheenRoughness;
  if (mat.transparent !== p.transparent) { mat.transparent = p.transparent; mat.needsUpdate = true; }
  mat.opacity = p.opacity;
}

class Panel {
  constructor(side, velvetU, seed) {
    const D = DIM;
    this.sign = side; this.mirrorX = side < 0;
    this.zBase = side < 0 ? D.zBack : 0;
    this.inner = side * D.railGap; this.wing = side * (D.railGap + D.Wspan);
    this.verletVertices = []; this.verletSprings = []; this.verletVertexColumns = [];
    this.openU = uniform(0); this.ampU = uniform(0); this.tieK = uniform(0); this.impulse = uniform(0);
    this.tieX = uniform(side * (D.railGap + D.Wspan - 0.1)); this.tieY = uniform(D.topY - 0.6 * D.H);
    this._geometry(); this._buffers(); this._uniforms(); this._compute(); this._mesh(velvetU, seed);
  }
  _geometry() {
    const D = DIM, dy = D.H / D.segY;
    const addVertex = (x, y, z, isFixed, u, zig, tie, hem) => { const v = { id: this.verletVertices.length, position: new THREE.Vector3(x, y, z), isFixed, u, zig, tie, hem, springIds: [] }; this.verletVertices.push(v); return v; };
    const addSpring = (v0, v1) => { const s = { id: this.verletSprings.length, vertex0: v0, vertex1: v1 }; v0.springIds.push(s.id); v1.springIds.push(s.id); this.verletSprings.push(s); };
    for (let x = 0; x <= D.segX; x++) {
      const u = x / D.segX, column = [];
      for (let y = 0; y <= D.segY; y++) {
        const isFixed = y === 0 && x % D.pinEvery === 0;
        const zig = ((x / D.pinEvery) % 2 === 0) ? -1 : 1;
        const t = y / D.segY, tie = Math.exp(-(((t - 0.62) / 0.05) ** 2)) * Math.pow(1 - u, 1.5);
        const hem = Math.pow(Math.max(0, (t - 0.9) / 0.1), 2) * (1 + 1.5 * Math.pow(1 - u, 3));
        column.push(addVertex(this.wing - this.sign * (1 - u) * D.Wc, D.topY - y * dy, this.zBase, isFixed, u, zig, tie, hem));
      }
      this.verletVertexColumns.push(column);
    }
    for (let x = 0; x <= D.segX; x++) for (let y = 0; y <= D.segY; y++) {
      const v0 = this.verletVertexColumns[x][y];
      if (x > 0) addSpring(v0, this.verletVertexColumns[x - 1][y]);
      if (y > 0) addSpring(v0, this.verletVertexColumns[x][y - 1]);
      if (x > 0 && y > 0) addSpring(v0, this.verletVertexColumns[x - 1][y - 1]);
      if (x > 0 && y < D.segY) addSpring(v0, this.verletVertexColumns[x - 1][y + 1]);
    }
  }
  _buffers() {
    const n = this.verletVertices.length, springList = [];
    const pos = new Float32Array(n * 3), params = new Uint32Array(n * 3), pin = new Float32Array(n * 2), tie = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const v = this.verletVertices[i];
      pos[i * 3] = v.position.x; pos[i * 3 + 1] = v.position.y; pos[i * 3 + 2] = v.position.z;
      pin[i * 2] = v.u; pin[i * 2 + 1] = v.zig; tie[i * 2] = v.tie; tie[i * 2 + 1] = v.hem;
      params[i * 3] = v.isFixed ? 1 : 0;
      if (!v.isFixed) { params[i * 3 + 1] = v.springIds.length; params[i * 3 + 2] = springList.length; springList.push(...v.springIds); }
    }
    this.vertexPositionBuffer = instancedArray(pos, 'vec3').setPBO(true);
    this.vertexForceBuffer = instancedArray(n, 'vec3');
    this.vertexParamsBuffer = instancedArray(params, 'uvec3');
    this.vertexPinBuffer = instancedArray(pin, 'vec2');
    this.vertexTieBuffer = instancedArray(tie, 'vec2'); // x = tieback weight, y = hem weight
    this.springListBuffer = instancedArray(new Uint32Array(springList), 'uint').setPBO(true);
    const m = this.verletSprings.length, ids = new Uint32Array(m * 2), rest = new Float32Array(m);
    for (let i = 0; i < m; i++) { const s = this.verletSprings[i]; ids[i * 2] = s.vertex0.id; ids[i * 2 + 1] = s.vertex1.id; rest[i] = s.vertex0.position.distanceTo(s.vertex1.position); }
    this.springVertexIdBuffer = instancedArray(ids, 'uvec2').setPBO(true);
    this.springRestLengthBuffer = instancedArray(rest, 'float');
    this.springForceBuffer = instancedArray(m * 3, 'vec3').setPBO(true);
  }
  _uniforms() { this.dampeningUniform = uniform(0.992); this.stiffnessUniform = uniform(0.34); this.windUniform = uniform(0.12); this.gravityUniform = uniform(0.00005); }
  _compute() {
    const D = DIM, n = this.verletVertices.length, m = this.verletSprings.length;
    const innerF = float(this.inner), wingF = float(this.wing), topF = float(D.topY), zF = float(this.zBase), gF = float(D.gather);
    this.computeSpringForces = Fn(() => {
      const vertexIds = this.springVertexIdBuffer.element(instanceIndex);
      const restLength = this.springRestLengthBuffer.element(instanceIndex);
      const v0 = this.vertexPositionBuffer.element(vertexIds.x);
      const v1 = this.vertexPositionBuffer.element(vertexIds.y);
      const delta = v1.sub(v0).toVar();
      const dist = delta.length().max(0.000001).toVar();
      const force = dist.sub(restLength).mul(this.stiffnessUniform).mul(delta).mul(0.5).div(dist);
      this.springForceBuffer.element(instanceIndex).assign(force);
    })().compute(m).setName('Spring Forces');
    this.computeVertexForces = Fn(() => {
      const params = this.vertexParamsBuffer.element(instanceIndex).toVar();
      const isFixed = params.x, sCount = params.y, sPointer = params.z;
      If(isFixed, () => {
        // T2/T3: pin row gathers toward the wing and zig-zags in z (pleats). Direct position write, as in the donor.
        const pin = this.vertexPinBuffer.element(instanceIndex);
        const x = wingF.add(float(1).sub(pin.x).mul(innerF.sub(wingF)).mul(float(1).sub(this.openU.mul(gF))));
        this.vertexPositionBuffer.element(instanceIndex).assign(vec3(x, topF, zF.add(pin.y.mul(this.ampU))));
        Return();
      });
      const position = this.vertexPositionBuffer.element(instanceIndex).toVar('vertexPosition');
      const force = this.vertexForceBuffer.element(instanceIndex).toVar('vertexForce');
      force.mulAssign(this.dampeningUniform);
      const ptrStart = sPointer.toVar('ptrStart');
      const ptrEnd = ptrStart.add(sCount).toVar('ptrEnd');
      Loop({ start: ptrStart, end: ptrEnd, type: 'uint', condition: '<' }, ({ i }) => {
        const springId = this.springListBuffer.element(i).toVar('springId');
        const springForce = this.springForceBuffer.element(springId);
        const springVertexIds = this.springVertexIdBuffer.element(springId);
        const factor = select(springVertexIds.x.equal(instanceIndex), 1.0, -1.0);
        force.addAssign(springForce.mul(factor));
      });
      const tw = this.vertexTieBuffer.element(instanceIndex);
      force.y.subAssign(this.gravityUniform.mul(float(1).add(tw.y.mul(1.6))));
      const noise = triNoise3D(position, 1, time).sub(0.2).mul(0.0001);
      force.z.subAssign(noise.mul(this.windUniform));
      // T7 tieback (lower-third inner edge pulled toward the wing) · T8 impact impulse, stronger toward the hem
      force.x.addAssign(this.tieX.sub(position.x).mul(tw.x).mul(this.tieK));
      force.y.addAssign(this.tieY.sub(position.y).mul(tw.x).mul(this.tieK).mul(0.4));
      force.z.addAssign(this.impulse.mul(topF.sub(position.y)).div(D.H));
      this.vertexForceBuffer.element(instanceIndex).assign(force);
      this.vertexPositionBuffer.element(instanceIndex).addAssign(force);
    })().compute(n).setName('Vertex Forces');
  }
  _mesh(velvetU, seed) {
    const D = DIM, count = D.segX * D.segY;
    const geometry = new THREE.BufferGeometry();
    const ids = new Uint32Array(count * 4), uvs = new Float32Array(count * 2), indices = [];
    const getIndex = (x, y) => y * D.segX + x;
    for (let x = 0; x < D.segX; x++) for (let y = 0; y < D.segY; y++) { // T4: donor looped y < segX here
      const i = getIndex(x, y);
      ids[i * 4] = this.verletVertexColumns[x][y].id; ids[i * 4 + 1] = this.verletVertexColumns[x + 1][y].id;
      ids[i * 4 + 2] = this.verletVertexColumns[x][y + 1].id; ids[i * 4 + 3] = this.verletVertexColumns[x + 1][y + 1].id;
      uvs[i * 2] = (x + 0.5) / D.segX; uvs[i * 2 + 1] = (y + 0.5) / D.segY;
      if (x > 0 && y > 0) { indices.push(getIndex(x, y), getIndex(x - 1, y), getIndex(x - 1, y - 1)); indices.push(getIndex(x, y), getIndex(x - 1, y - 1), getIndex(x, y - 1)); }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3, false));
    geometry.setAttribute('vertexIds', new THREE.BufferAttribute(ids, 4, false));
    geometry.setAttribute('clothUV', new THREE.BufferAttribute(uvs, 2, false));
    geometry.setIndex(indices);
    this.material = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide, sheen: 1, sheenRoughness: 0.34, sheenColor: new THREE.Color(VELVET.sheenColor) });
    Object.assign(this.material, velvetNodes(velvetU, seed));
    const vpb = this.vertexPositionBuffer, mirrorSign = float(this.mirrorX ? -1 : 1);
    this.material.positionNode = Fn(({ material }) => {
      const vertexIds = attribute('vertexIds');
      const v0 = vpb.element(vertexIds.x).toVar(), v1 = vpb.element(vertexIds.y).toVar(), v2 = vpb.element(vertexIds.z).toVar(), v3 = vpb.element(vertexIds.w).toVar();
      const top = v0.add(v1), right = v1.add(v3), bottom = v2.add(v3), left = v0.add(v2);
      const tangent = right.sub(left).normalize(), bitangent = bottom.sub(top).normalize();
      material.normalNode = transformNormalToView(cross(tangent, bitangent).mul(mirrorSign)).toVarying();
      return v0.add(v1).add(v2).add(v3).mul(0.25);
    })();
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.frustumCulled = false; this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    this.mesh.name = 'curtain-panel-' + (this.sign > 0 ? 'L' : 'R');
  }
  pinX(u, open) { return this.wing + (1 - u) * (this.inner - this.wing) * (1 - open * DIM.gather); }
  static amp(open) {
    const D = DIM, k = D.pinEvery / D.segX, cloth = D.Wc * k * 0.88, spacing = D.Wspan * k * (1 - open * D.gather);
    return 0.3 * Math.sqrt(Math.max(0, cloth * cloth - spacing * spacing)); // r3: 60 % of the fully-folded depth → slack bellies into round folds
  }
}

/* ---------- static presentation hardware ---------- */
function agedMaterial(age, dark, light, scale, rough) {
  const m = new THREE.MeshStandardNodeMaterial();
  const n = mx_noise_float(positionWorld.mul(scale)).mul(0.5).add(0.5);
  const s = mx_noise_float(positionWorld.mul(scale * 11.0)).mul(0.5).add(0.5);
  const t = n.mul(0.8).add(s.mul(0.2));
  m.colorNode = mix(color(light), color(dark), smoothstep(0.3, 0.8, t).mul(age.mul(0.55).add(0.25)));
  m.roughnessNode = float(rough).add(t.mul(0.1));
  return m;
}
function giltMaterial(age) {
  const m = new THREE.MeshStandardNodeMaterial();
  const n = mx_noise_float(positionWorld.mul(7.0)).mul(0.5).add(0.5);
  const tarnish = smoothstep(0.3, 0.8, n).mul(age);
  m.colorNode = mix(color('#9a7c4c'), color('#3a2e1e'), tarnish.mul(0.8));
  m.metalnessNode = mix(float(0.7), float(0.3), tarnish);
  m.roughnessNode = mix(float(0.32), float(0.7), tarnish);
  return m;
}

function buildProscenium(age) {
  const D = DIM, g = new THREE.Group(); g.name = 'proscenium';
  const yb = D.topY - 0.35, peak = D.topY + 0.12, xo = 2.15, xi = 1.42, top = D.topY + 0.78;
  const wall = agedMaterial(age, '#1c1714', '#3f342b', 0.9, 0.88);
  const shape = new THREE.Shape();
  shape.moveTo(-xo, top); shape.lineTo(xo, top); shape.lineTo(xo, D.floorY); shape.lineTo(xi, D.floorY); shape.lineTo(xi, yb);
  shape.quadraticCurveTo(0, 2 * peak - yb, -xi, yb); shape.lineTo(-xi, D.floorY); shape.lineTo(-xo, D.floorY); shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 40 });
  const frame = new THREE.Mesh(geo, wall); frame.position.z = -0.44; frame.castShadow = frame.receiveShadow = true; g.add(frame);
  const gilt = giltMaterial(age);
  const path = new THREE.CurvePath();
  const z = -0.47;
  path.add(new THREE.LineCurve3(new THREE.Vector3(-xi, D.floorY + 0.12, z), new THREE.Vector3(-xi, yb, z)));
  path.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-xi, yb, z), new THREE.Vector3(0, 2 * peak - yb, z), new THREE.Vector3(xi, yb, z)));
  path.add(new THREE.LineCurve3(new THREE.Vector3(xi, yb, z), new THREE.Vector3(xi, D.floorY + 0.12, z)));
  const molding = new THREE.Mesh(new THREE.TubeGeometry(path, 160, 0.032, 10, false), gilt); g.add(molding);
  for (const s of [-1, 1]) {
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.38), wall); plinth.position.set(s * 1.775, D.floorY + 0.11, -0.35); plinth.castShadow = plinth.receiveShadow = true; g.add(plinth);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 0.3), gilt); cap.position.set(s * 1.78, yb - 0.02, -0.35); g.add(cap);
  }
  g.userData.mats = [wall, gilt];
  return g;
}

function buildFloor(age) {
  const D = DIM, m = new THREE.MeshStandardNodeMaterial();
  const z = positionWorld.z.mul(5.2), board = z.floor(), f = z.fract();
  const seam = smoothstep(0.0, 0.05, f).mul(float(1).sub(smoothstep(0.95, 1.0, f)));
  const tone = mx_noise_float(vec3(board.mul(3.1), positionWorld.x.mul(0.6), float(2))).mul(0.5).add(0.5);
  const grain = mx_noise_float(vec3(positionWorld.x.mul(14), z.mul(0.5), float(9))).mul(0.5).add(0.5);
  const wear = mx_noise_float(positionWorld.mul(1.3)).mul(0.5).add(0.5).mul(age);
  let c = mix(color('#3a2618'), color('#6b4a30'), tone.mul(0.6).add(grain.mul(0.25)));
  c = mix(c, color('#5c5148'), smoothstep(0.55, 0.9, wear).mul(0.45));
  m.colorNode = c.mul(seam.mul(0.55).add(0.45));
  m.roughnessNode = float(0.78);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.32, 3.6), m);
  mesh.position.set(0, D.floorY - 0.16, 0.3); mesh.receiveShadow = true; mesh.name = 'stage-floor';
  return mesh;
}

function buildPelmet(velvetU) {
  const D = DIM, cols = 180, rows = 12, sc = 7, x0 = -1.52, x1 = 1.52, yT = D.topY + 0.2, yB = D.topY - 0.2;
  const pos = [], uv = [], idx = [], fringe = [];
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
    const u = i / cols, v = j / rows, t = (u * sc) % 1, dip = 0.11 * Math.sin(Math.PI * t);
    const x = x0 + (x1 - x0) * u, y = yT + (yB - dip - yT) * v;
    const zz = -0.13 - 0.018 * Math.sin(u * Math.PI * 2 * 30) * (0.35 + 0.65 * v) - 0.045 * Math.sin(Math.PI * t) * Math.sin(Math.PI * v * 0.9);
    pos.push(x, y, zz); uv.push(u, v * 0.18);
    if (j === rows) fringe.push(new THREE.Vector3(x, y - 0.006, zz - 0.006));
  }
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const a = j * (cols + 1) + i, b = a + 1, c = a + cols + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('clothUV', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  const mat = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide, sheen: 1, sheenRoughness: 0.34, sheenColor: new THREE.Color(VELVET.sheenColor) });
  Object.assign(mat, velvetNodes(velvetU, 4.4));
  const g = new THREE.Group(); g.name = 'pelmet';
  const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = mesh.receiveShadow = true; g.add(mesh);
  g.userData.fringeCurve = new THREE.CatmullRomCurve3(fringe);
  g.userData.mat = mat;
  return g;
}

function buildFootlights() {
  const D = DIM, g = new THREE.Group(); g.name = 'footlights';
  const level = uniform(1);
  // r3: visible bulbs removed (Georg) · only the warm front light remains; props/fixtures come later as real 3D models
    const spot = new THREE.SpotLight('#ffb267', 9, 7, 0.95, 0.9, 1.4);
  spot.position.set(0, D.floorY + 0.06, -1.5); spot.target.position.set(0, 0.5, 0.1); g.add(spot, spot.target);
  g.userData = { level, spot };
  return g;
}

/* ---------- public module ---------- */
export function isSupported() { return typeof navigator !== 'undefined' && !!navigator.gpu; }

export function createTheatreCurtain(opts = {}) {
  const o = { material: 'P', hardware: 'pelmet', tieback: false, proscenium: true, floor: true, footlights: true, reducedMotion: false, duration: 2.6, ...opts };
  const group = new THREE.Group(); group.name = 'kfb-theatre-curtain';
  const velvetU = makeVelvetUniforms();
  const panels = [new Panel(1, velvetU, 1.3), new Panel(-1, velvetU, 7.9)];
  panels.forEach((p) => group.add(p.mesh));

  const hwAge = uniform(1);
  const hw = new THREE.Group(); hw.name = 'hardware'; group.add(hw);
  const gilt = giltMaterial(hwAge);
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3.3, 16), gilt);
  rail.rotation.z = Math.PI / 2; rail.position.set(0, DIM.topY + 0.06, DIM.zBack * 0.5); hw.add(rail);
  for (const s of [-1, 1]) { const fin = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), gilt); fin.position.set(s * 1.66, DIM.topY + 0.06, DIM.zBack * 0.5); hw.add(fin); }
  const pinsPer = DIM.segX / DIM.pinEvery + 1;
  const ringGeo = new THREE.TorusGeometry(0.05, 0.016, 12, 28); ringGeo.rotateY(Math.PI / 2);
  const rings = new THREE.InstancedMesh(ringGeo, gilt, pinsPer * 2); rings.name = 'rings';
  const hookGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.05, 6);
  const hooks = new THREE.InstancedMesh(hookGeo, gilt, pinsPer * 2);
  hw.add(rings, hooks);
  // masking border behind the rail: whatever is above the cloth top stays covered in every hardware mode
  const mask = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.7), new THREE.MeshStandardMaterial({ color: '#0b0707', roughness: 0.95 }));
  mask.position.set(0, DIM.topY + 0.3, 0.16); mask.rotation.y = Math.PI; group.add(mask);
  const pelmet = buildPelmet(velvetU); group.add(pelmet);
  const fringe = new THREE.Mesh(new THREE.TubeGeometry(pelmet.userData.fringeCurve, 200, 0.012, 6, false), gilt); pelmet.add(fringe);
  const pros = o.proscenium ? buildProscenium(hwAge) : null; if (pros) group.add(pros);
  const floor = o.floor ? buildFloor(hwAge) : null; if (floor) group.add(floor);
  const foot = o.footlights ? buildFootlights() : null; if (foot) group.add(foot);

  const facts = { loadingReady: true, selectedActorReady: true, revealAllowed: true, reducedMotion: !!o.reducedMotion };
  let state = 'closed_rest', listeners = [], p = 0, pv = 0, goal = 0, pending = false, impactT = 0, impulse = 0, matKey = o.material, simTime = 0, acc = 0;
  const STEP = 1 / 360;

  const emit = (s) => { if (s === state) return; const prev = state; state = s; listeners.forEach((f) => f(s, prev)); };
  const restState = () => (goal === 1 ? 'open_rest' : ((facts.loadingReady === false || facts.selectedActorReady === false || pending) ? 'covered_wait' : 'closed_rest'));
  const tryReveal = () => { if (pending && facts.revealAllowed !== false) { pending = false; goal = 1; emit('opening'); } else if (pending) emit('covered_wait'); };
  const dur = () => (facts.reducedMotion ? 0.9 : o.duration);

  function setMaterial(k) {
    matKey = MATERIALS[k] ? k : 'P'; const m = MATERIALS[matKey];
    panels.forEach((pn) => applyVelvet(pn.material, velvetU, m));
    applyVelvet(pelmet.userData.mat, velvetU, { ...m, transparent: false, opacity: 1 });
    hwAge.value = m.hwAge;
  }
  function setHardware(k) { o.hardware = k; pelmet.visible = k === 'pelmet'; rings.visible = hooks.visible = k !== 'none'; rail.visible = k !== 'none'; }
  setMaterial(matKey); setHardware(o.hardware);

  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(1, 1, 1), _v = new THREE.Vector3();
  function updateRings(open, amp) {
    let k = 0;
    for (const pn of panels) for (let i = 0; i < pinsPer; i++) {
      const u = (i * DIM.pinEvery) / DIM.segX, x = pn.pinX(u, open), zig = (i % 2 === 0) ? -1 : 1, z = pn.zBase + zig * amp;
      _v.set(x, DIM.topY + 0.06, DIM.zBack * 0.5); rings.setMatrixAt(k, _m.compose(_v, _q, _s));
      _v.set(x, DIM.topY + 0.02, z); hooks.setMatrixAt(k, _m.compose(_v, _q, _s)); k++;
    }
    rings.instanceMatrix.needsUpdate = hooks.instanceMatrix.needsUpdate = true;
  }

  function stepOnce(renderer) {
    simTime += STEP;
    if (p !== goal || pv !== 0) driveStep();
    const open = p, amp = Panel.amp(Math.min(1, Math.max(0, open)));
    const tieK = (o.tieback ? 0.0004 : 0) * smoothstep01((open - 0.45) / 0.55);
    impulse *= 0.97;
    for (const pn of panels) {
      pn.openU.value = open; pn.ampU.value = amp; pn.tieK.value = tieK; pn.impulse.value = impulse;
      pn.windUniform.value = facts.reducedMotion ? 0 : 0.12;
      renderer.compute(pn.computeSpringForces); renderer.compute(pn.computeVertexForces);
    }
    if (state === 'impact') { impactT -= STEP; if (impactT <= 0) emit(restState()); }
    return open;
  }
  /* T6b · heavy-curtain drive: the stagehand pulls (ramped force), the rings run at a capped speed,
     then hit the end and rebound slightly. Cloth inertia (dampening 0.992) supplies the swing. */
  function driveStep() {
    const M = MOTION, rm = facts.reducedMotion, sg = Math.sign(goal - p) || Math.sign(-pv) || 1;
    const k = rm ? M.kReduced : M.k, zeta = rm ? 1 : (goal === 1 ? M.zetaOpen : M.zetaClose);
    const a = k * (goal - p) - 2 * zeta * Math.sqrt(k) * pv;
    pv += Math.max(-M.aMax, Math.min(M.aMax, a)) * STEP;
    pv = Math.max(-M.vMax, Math.min(M.vMax, pv));
    p += pv * STEP;
    const lo = goal === 0 ? -M.overClose : 0, hi = goal === 1 ? 1 + M.overOpen : 1;
    if (p < lo) { p = lo; pv = Math.abs(pv) * M.bounce; } else if (p > hi) { p = hi; pv = -Math.abs(pv) * M.bounce; }
    if (Math.abs(goal - p) < 0.0015 && Math.abs(pv) < 0.01) { p = goal; pv = 0; emit(restState()); }
  }
  function smoothstep01(x) { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); }

  return {
    group, panels, facts, DIM, MATERIALS,
    get state() { return state; },
    get openness() { return p; },
    get material() { return matKey; },
    onState(f) { listeners.push(f); return () => { listeners = listeners.filter((x) => x !== f); }; },
    setHostFacts(f) { Object.assign(facts, f); if (state === 'closed_rest' || state === 'covered_wait') emit(restState()); tryReveal(); },
    requestReveal() { pending = true; tryReveal(); },
    cover() { pending = false; goal = 0; if (p > 0) emit('closing'); else emit(restState()); },
    impact(strength = 1) { if (facts.reducedMotion) return; impulse = 0.00022 * strength; if (/_rest|covered_wait|impact/.test(state)) { impactT = 0.6; emit('impact'); } },
    setMaterial, setHardware,
    setTieback(b) { o.tieback = !!b; },
    setFootlights(level) { if (foot) { foot.userData.level.value = level; foot.userData.spot.intensity = 9 * level; } },
    /* host calls this every frame with real elapsed seconds; fixed 360 Hz internally */
    update(renderer, dt) {
      acc += Math.min(dt, 1 / 30); let open = p, n = 0;
      while (acc >= STEP && n < 24) { acc -= STEP; open = stepOnce(renderer); n++; }
      updateRings(open, Panel.amp(Math.min(1, Math.max(0, open))));
    },
    /* hidden settle before the first visible frame, so the cover is already at rest when shown */
    warmup(renderer, steps = 900) { for (let i = 0; i < steps; i++) stepOnce(renderer); updateRings(p, Panel.amp(p)); },
    snap(open) { p = goal = open ? 1 : 0; pv = 0; emit(restState()); },
    dispose() { group.traverse((x) => { x.geometry && x.geometry.dispose(); }); },
  };
}

/* No WebGPU: the core never fakes a curtain. The host gets fallback_reveal and shows its world directly. */
export function createFallbackCurtain() {
  return { state: 'fallback_reveal', group: new THREE.Group(), onState() { return () => {}; }, setHostFacts() {}, requestReveal() {}, cover() {}, impact() {}, update() {}, warmup() {}, setMaterial() {}, setHardware() {}, setTieback() {}, setFootlights() {} };
}
