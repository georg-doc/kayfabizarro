// Stable shadow frustum for the single directional light.
// - Covers a square (in light space) around the chunk focus, pushed a little toward where the camera looks.
// - Half-size R depends on the camera distance to the focus, quantised to 8 m steps so the texel size only
//   changes when the zoom changes substantially (no per-frame swimming from a springy camera).
// - The centre is snapped to the shadow-map texel grid in light space → no shimmering edges while moving.
// - normalBias scales with the texel size (KayKit meshes are DoubleSide: both faces cast, so we rely on
//   normalBias rather than face culling; depth bias stays tiny to avoid peter-panning at contact points).
import * as THREE from 'three';

const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();
const _c = new THREE.Vector3();
const _f = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const _X = new THREE.Vector3(1, 0, 0);
const _q = new THREE.Quaternion();
const _ray = new THREE.Vector3();
const _fc = new THREE.Vector3();

export interface ShadowFitOptions {
  mapSize: number;
  /** Penumbra half-width in metres (converted to PCF radius in texels). */
  softness: number;
  minR: number;
  maxR: number;
  /** Max half-size when fitting the footprint of high cameras. */
  maxHighR?: number;
  vsm?: boolean;
}

export class ShadowFitter {
  R = 0;
  texel = 0;
  normalBiasTexels = 2.0;
  /** PCF grid half-width cap in texels (5×5 grid → ≤ 2 texel tap spacing keeps the penumbra band-free). */
  maxRadiusTexels = 4;
  /** Debug: disable texel snapping (to demonstrate shimmering). */
  snap = true;
  constructor(readonly light: THREE.DirectionalLight, readonly opt: ShadowFitOptions) {
    const s = light.shadow;
    s.mapSize.set(opt.mapSize, opt.mapSize);
    s.camera.near = 1;
  }

  /**
   * Ground footprint of the view (frustum corner rays ∩ plane y = groundY, rays clamped at maxDist metres from the
   * camera). Writes the footprint centre to `out` and returns its radius (max distance centre → corner).
   */
  private footprint(camera: THREE.Camera, groundY: number, maxDist: number, out: THREE.Vector3): number {
    const pts: THREE.Vector3[] = [];
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, 0]] as const) {
      _ray.set(x, y, 0.5).unproject(camera).sub(camera.position).normalize();
      let t = maxDist;
      if (_ray.y < -1e-4) t = Math.min(maxDist, (groundY - camera.position.y) / _ray.y);
      pts.push(camera.position.clone().addScaledVector(_ray, t).setY(groundY));
    }
    out.set(0, 0, 0);
    for (const p of pts) out.add(p);
    out.divideScalar(pts.length);
    let r = 0;
    for (const p of pts) r = Math.max(r, Math.hypot(p.x - out.x, p.z - out.z));
    return r;
  }

  /** Far edge (metres from the camera) up to which shadows must be drawn — set from the fog distance. */
  shadowReach = 240;
  /** Fit the view footprint for high cameras (?highshadow=0 disables, for perf comparison). */
  fitHigh = true;

  update(focus: THREE.Vector3, camera: THREE.Camera, lightDir: THREE.Vector3): void {
    const s = this.light.shadow;
    const cam = s.camera as THREE.OrthographicCamera;
    const d = camera.position.distanceTo(focus);
    const camH = camera.position.y - focus.y;
    // Play height / normal zoom: square of half-size R around the focus, pushed toward the view direction
    // (follow cam → 72 m, 4096² → 3.5 cm texels). High cameras (aerial/overview): fit the visible ground
    // footprint instead, so mid-distance forests/buildings keep their shadows up to where the fog takes over.
    let R = THREE.MathUtils.clamp(d * 0.95 + 60, this.opt.minR, this.opt.maxR);
    camera.getWorldDirection(_f);
    _f.y = 0;
    const fl = _f.length();
    _c.copy(focus);
    if (camH > 40 && this.fitHigh) {
      const fr = this.footprint(camera, focus.y, d + this.shadowReach, _fc);
      if (fr + 12 > R) {
        R = Math.min(fr + 12, this.opt.maxHighR ?? 300);
        _c.copy(_fc).setY(focus.y);
      } else if (fl > 1e-3) _c.addScaledVector(_f, (R * 0.35) / fl);
    } else if (fl > 1e-3) _c.addScaledVector(_f, (R * 0.35) / fl);
    R = Math.ceil(R / 16) * 16;
    const texel = (2 * R) / this.opt.mapSize;

    // light-space basis exactly as Object3D.lookAt builds it for the shadow camera (z = toward light)
    _z.copy(lightDir).normalize();
    _x.crossVectors(UP, _z);
    if (_x.lengthSq() < 1e-6) _x.set(1, 0, 0);
    _x.normalize();
    _y.crossVectors(_z, _x);
    // Roll the shadow camera so the hex grid's edge directions are never nearly parallel to the shadow texel grid
    // (shallow-angle edges rasterise into long 1-texel stair runs that survive filtering). World +X (a hex edge
    // direction family, period 60°; texel grid period 90° → combined 30°) is set to 15° off the texel axes.
    const a = Math.atan2(_X.dot(_y), _X.dot(_x));
    const P = Math.PI / 6;
    const delta = a - P / 2 - Math.round((a - P / 2) / P) * P;
    if (Math.abs(delta) > 1e-6) {
      _q.setFromAxisAngle(_z, delta);
      _x.applyQuaternion(_q);
      _y.applyQuaternion(_q);
    }
    (this.light.shadow.camera as THREE.OrthographicCamera).up.copy(_y);
    const lx = this.snap ? Math.round(_c.dot(_x) / texel) * texel : _c.dot(_x);
    const ly = this.snap ? Math.round(_c.dot(_y) / texel) * texel : _c.dot(_y);
    const lz = _c.dot(_z);
    _c.set(0, 0, 0).addScaledVector(_x, lx).addScaledVector(_y, ly).addScaledVector(_z, lz);

    const D = R + 160; // light distance: room for tall casters up-light of the frustum
    this.light.target.position.copy(_c);
    this.light.position.copy(_c).addScaledVector(_z, D);
    this.light.target.updateMatrixWorld();
    this.light.updateMatrixWorld();

    if (R !== this.R) {
      cam.left = -R;
      cam.right = R;
      cam.top = R;
      cam.bottom = -R;
      cam.near = 1;
      cam.far = D + R + 80;
      cam.updateProjectionMatrix();
      this.R = R;
      this.texel = texel;
      s.normalBias = texel * this.normalBiasTexels;
      s.bias = -0.00006;
      s.radius = THREE.MathUtils.clamp(this.opt.softness / texel, 1.5, this.opt.vsm ? 16 : this.maxRadiusTexels);
      if (this.opt.vsm) s.blurSamples = 12;
    }
  }
}
