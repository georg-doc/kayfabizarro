/**
 * stache.v3 · Schnurrbart als Schlauch, an der Maske GESCHLOSSEN.
 *
 * v2 hat den Schlauch eingeführt (Georg: »links und rechts zu unterschiedlich« — die Feder liefert
 * je Abtastung eine eigene Breite, `even` nimmt statt dessen EINEN gemessenen Mittelwert).
 * v3 behebt denselben Fehler, der an der Braue am Bild sichtbar wurde: die Maske ist ein
 * Fragment-Verwurf und hinterlässt im Schlauch eine offene Kante. Betrifft hier die Formen mit
 * Lücke — `chaplin` (mask 0,45), `pencil` (0,4), `handlebar` (0,18).
 *
 * Die Form baut jetzt `inkform.v1.js`: Läufe links und rechts der Maske, alle Enden gedeckelt,
 * Verwurf aus. Das Vendor-Modul bleibt unberührt; ersetzt wird genau `rebuild()`.
 */
import { MoustacheRig as Base, DEFAULTS as BASE_DEFAULTS, STYLES, STYLE_NAMES, paramsForStyle, validate as baseValidate } from '../petstudio-v9/studio-v12/pet-moustache.v1.js';
import { hbAt } from '../petstudio-v9/studio-v12/brow-rig.v2.js';
import { inkHalfWidth, INK_PRESETS } from '../petstudio-v9/kfb-ink-canon.js';
import { solidForm, ribbonForm } from './inkform.v1.js';

export { STYLES, STYLE_NAMES, paramsForStyle };
export const SCHEMA = 'kfb.moustache/0.3';
export const TUBE_DEFAULTS = Object.freeze({ solid: true, even: true, symmetric: true, round: 1, cap: 0.8 });
export const DEFAULTS = Object.freeze({ ...BASE_DEFAULTS, ...TUBE_DEFAULTS });
const TUBE_LIMITS = { round: [0, 2], cap: [0.02, 1] };

export function validate(patch) {
  const own = {}, rest = {};
  for (const [k, v] of Object.entries(patch || {})) { if (k in TUBE_DEFAULTS) own[k] = v; else rest[k] = v; }
  for (const [k, v] of Object.entries(own)) {
    if (TUBE_LIMITS[k]) { if (!Number.isFinite(v) || v < TUBE_LIMITS[k][0] || v > TUBE_LIMITS[k][1]) return { status: 'UNSUPPORTED', field: k, reason: 'Out of range' }; }
    else if (typeof v !== 'boolean') return { status: 'UNSUPPORTED', field: k, reason: 'Expected boolean' };
  }
  return baseValidate(rest);
}

export class MoustacheRig extends Base {
  constructor(opts = {}) {
    super(opts);
    Object.assign(this.params, TUBE_DEFAULTS, pickTube(opts.params));
    this.rebuild();
  }
  set(patch) {
    const c = validate(patch); if (c.status !== 'OK') return c;
    this.params = { ...this.params, ...structuredClone(patch) };
    this.rebuild(); return c;
  }
  /* `style()` der Basis baut `params` aus DEFAULTS neu und würde die Schlauch-Regler verlieren —
     eine Form ist eine Form, keine Aussage über Bändchen oder Schlauch. */
  style(name) {
    const keep = pickTube(this.params);
    const r = super.style(name);
    if (r.status === 'OK') { Object.assign(this.params, keep); this.rebuild(); }
    return r;
  }
  export() { return { ...super.export(), schema: SCHEMA }; }

  rebuild() {
    const T = this.T, p = this.params, f = this.getEyeFrame();
    if (!p || !('solid' in p)) return super.rebuild();
    if (!f || !f.left || !f.right || !(f.radius > 0)) {
      this.mesh.visible = false;
      this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' };
      return this.last;
    }
    if (f.parent && f.parent !== this.mesh.parent) { this.mesh.removeFromParent(); f.parent.add(this.mesh); }
    this.gen = f.gen;
    const R = f.radius;
    const nz = this.getNose && this.getNose();
    this._noseKey = nz ? nz.gen + ':' + nz.center[1].toFixed(3) : '-';
    const eyeCx = (f.left.x + f.right.x) / 2, eyeCy = (f.left.y + f.right.y) / 2;
    const cx = (nz ? nz.center[0] : eyeCx) + p.x * R;
    const cy = (nz ? nz.center[1] - nz.size[1] / 2 : eyeCy - 1.55 * R) - p.height * R + p.y * R;
    const span = Math.abs(f.right.x - f.left.x) + R * 2;
    const width = span * (0.5 + 0.85 * p.length), amp = R * 0.9;

    const controls = p.points.map(([x, y]) => new T.Vector3(x, y, 0));
    const samples = new T.CatmullRomCurve3(controls, false, 'centripetal').getPoints(128);
    for (const v of samples) {
      const ax = Math.abs(v.x);
      if (p.sag) v.y -= p.sag * 0.42 * ax * ax;
      const c = v.x < 0 ? p.curlLeft : p.curlRight;
      if (c) { const u = Math.max(0, (ax - 0.55) / 0.45); v.y += c * 0.55 * u * u; }
      const b = v.x < 0 ? p.bendLeft : p.bendRight;
      if (b) { const u = v.x < 0 ? (v.x + 1) : v.x, s = Math.sin(Math.PI * Math.max(0, Math.min(1, u))); v.y += b * 0.4 * s * s; }
    }
    const N = samples.length;
    const nibPoints = samples.map((v) => [(v.x + 1) * 256, 128 - v.y * 90]);
    const hb = hbAt(p.thickness);
    const nib = inkHalfWidth(nibPoints, 512, 256, this.seed, { ...INK_PRESETS.figure, hb, minHalf: 0, edge: 2.10 * (0.3 + 0.7 * p.taper), taper: 0.45 * p.taper }, 1);
    const nibW = p.symmetric === false ? nib : ((i) => nib(i < N / 2 ? i : N - 1 - i));
    let evenW = 0; for (let i = 0; i < N; i++) evenW += nibW(i); evenW /= Math.max(1, N);
    const widthAt = (i) => (p.even !== false ? evenW : nibW(i));
    const geoAt = (q) => [cx + q.x * width / 2, cy + q.y * amp];
    const skin = p.follow > 0 ? this._probeSkin(f, samples, geoAt) : null;
    const solid = p.solid !== false;

    const at = (i) => {
      const t = i / (N - 1), q = samples[i];
      const prev = samples[Math.max(0, i - 1)], next = samples[Math.min(N - 1, i + 1)];
      const tg = new T.Vector2((next.x - prev.x) * width / 2, (next.y - prev.y) * amp).normalize();
      const envelope = 1 - p.taper + p.taper * Math.pow(Math.sin(Math.PI * t), 0.5);
      const endU = Math.min(i, N - 1 - i) / Math.max(1, (N - 1) * 0.5 * Math.max(0.02, p.cap ?? 0.8) * 0.5);
      const capF = p.even !== false ? (endU >= 1 ? 1 : Math.sin(Math.min(1, endU) * Math.PI / 2)) : envelope;
      const half = widthAt(i) * width / 512 * capF * (p.even !== false ? 1 : (1 + 0.18 * p.taper * Math.sin(Math.PI * t)));
      const [x, y] = geoAt(q);
      let zBase = T.MathUtils.lerp(f.left.z, f.right.z, t);
      if (skin) {
        const u = t * (skin.n - 1), k = Math.min(skin.n - 2, Math.floor(u));
        zBase = T.MathUtils.lerp(zBase, T.MathUtils.lerp(skin[k], skin[k + 1], u - k), p.follow);
      }
      return { x, y, z: zBase + R * p.lift, tx: tg.x, ty: tg.y, half };
    };

    const form = solid ? solidForm({ N, at, mask: p.mask, round: p.round ?? 1 }) : ribbonForm({ N, at });
    const geo = this.mesh.geometry;
    if (geo.attributes.position?.count === form.positions.length / 3) {
      geo.attributes.position.array.set(form.positions); geo.attributes.position.needsUpdate = true;
      geo.attributes.uv.array.set(form.uv); geo.attributes.uv.needsUpdate = true;
    } else {
      geo.setAttribute('position', new T.Float32BufferAttribute(form.positions, 3));
      geo.setAttribute('uv', new T.Float32BufferAttribute(form.uv, 2));
      geo.setIndex(form.indices);
    }
    geo.computeBoundingSphere();
    this.mesh.visible = p.enabled;
    const wantDepth = solid;
    if (this.material.depthWrite !== wantDepth) { this.material.depthWrite = wantDepth; this.material.needsUpdate = true; }
    this.material.uniforms.gap.value = solid ? 0 : p.mask;
    this.material.uniforms.cap.value = hb * 0.5;
    this.material.uniforms.ink.value.copy(p.color ? new T.Color(p.color) : this.autoColor);
    this.frame = { center: [cx, cy], radius: R, width, hb, gen: f.gen, anchoredAt: nz ? 'nose' : 'eye-line',
      form: solid ? (p.even !== false ? 'tube (even, capped)' : 'tube (quill, capped)') : 'ribbon',
      runs: form.runs, evenHalf: +(evenW * width / 512).toFixed(4),
      probes: skin ? skin.hits : 0, probeN: skin ? skin.n : 0 };
    this.last = { status: 'OK' };
    return this.last;
  }
}

function pickTube(src) {
  const out = {};
  if (!src) return out;
  for (const k of Object.keys(TUBE_DEFAULTS)) if (k in src) out[k] = src[k];
  return out;
}
