/**
 * brow.v3 · BrowRig mit GESCHLOSSENER Form an der Maske.
 *
 * Georg, 13.09.: die Schlauch-Braue zeigt an der Maske eine offene, facettierte Kante.
 * Ursache und Abhilfe stehen in `inkform.v1.js`: die Maske ist ein Fragment-Verwurf und kann eine
 * Form nicht schließen. Also wird die Geometrie in zwei Läufe geteilt und an allen vier Enden
 * gedeckelt, und der Verwurf wird abgeschaltet (`gap` 0) — sonst schneidet er in die fertige Form.
 *
 * Das Vendor-Modul bleibt UNBERÜHRT. Diese Unterklasse ersetzt genau `rebuild()`; Konstruktor,
 * `set()`, `expression()`, `sync()`, `_probeSkin()`, Material und Export werden geerbt.
 * `solid:false` gibt das flache Bändchen samt Shader-Maske zurück — der alte Weg bleibt offen.
 */
import { BrowRig as Base, DEFAULTS, PRESETS, PRESET_NAMES, pointsFor, hbAt, validate } from '../petstudio-v9/studio-v12/brow-rig.v2.js';
import { inkHalfWidth, INK_PRESETS } from '../petstudio-v9/kfb-ink-canon.js';
import { solidForm, ribbonForm } from './inkform.v1.js';

export { DEFAULTS, PRESETS, PRESET_NAMES, pointsFor, hbAt, validate };
export const SCHEMA = 'kfb.brow-experiment/0.3';

export class BrowRig extends Base {
  export() { return { ...super.export(), schema: SCHEMA }; }

  rebuild() {
    const T = this.T, p = this.params, f = this.getEyeFrame();
    if (!p) return super.rebuild();
    if (!f || !f.left || !f.right || !(f.radius > 0)) {
      this.mesh.visible = false;
      this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' };
      return this.last;
    }
    if (f.parent && f.parent !== this.mesh.parent) { this.mesh.removeFromParent(); f.parent.add(this.mesh); }
    this.gen = f.gen;

    const cx = (f.left.x + f.right.x) / 2, cy = (f.left.y + f.right.y) / 2;
    const span = Math.abs(f.right.x - f.left.x) + f.radius * 2;
    const width = span * (0.55 + 0.75 * p.length), amp = f.radius * 0.85;
    const controls = p.points.map(([x, y]) => new T.Vector3(x, y + (x < 0 ? p.tiltLeft * (-x - 0.5) : p.tiltRight * (x - 0.5)), 0));
    const samples = new T.CatmullRomCurve3(controls, false, 'centripetal').getPoints(128);
    if (p.bendLeft || p.bendRight) {
      for (const v of samples) {
        const b = v.x < 0 ? p.bendLeft : p.bendRight;
        if (!b) continue;
        const u = v.x < 0 ? (v.x + 1) : v.x, s = Math.sin(Math.PI * Math.max(0, Math.min(1, u)));
        v.y += b * 0.45 * s * s;
      }
    }
    const N = samples.length;
    const nibPoints = samples.map((v) => [(v.x + 1) * 256, 128 - v.y * 90]);
    const hb = hbAt(p.thickness);
    const nib = inkHalfWidth(nibPoints, 512, 256, this.seed, { ...INK_PRESETS.figure, hb, minHalf: 0, edge: 2.10 * (0.3 + 0.7 * p.taper), taper: 0.45 * p.taper }, 1);
    const nibW = p.symmetric === false ? nib : ((i) => nib(i < N / 2 ? i : N - 1 - i));
    let evenW = 0; for (let i = 0; i < N; i++) evenW += nibW(i); evenW /= Math.max(1, N);
    const widthAt = (i) => (p.even !== false ? evenW : nibW(i));
    const geoAt = (q) => [cx + p.x * f.radius + q.x * width / 2, cy + f.radius * (1.16 + p.height * 0.85 + p.y) + q.y * amp];
    const skin = p.follow > 0 ? this._probeSkin(f, samples, geoAt) : null;
    const solid = p.solid !== false;

    const at = (i) => {
      const t = i / (N - 1), q = samples[i];
      const prev = samples[Math.max(0, i - 1)], next = samples[Math.min(N - 1, i + 1)];
      const tg = new T.Vector2((next.x - prev.x) * width / 2, (next.y - prev.y) * amp).normalize();
      const envelope = 1 - p.taper + p.taper * Math.pow(Math.sin(Math.PI * t), 0.65);
      /* Im gedeckelten Schlauch trägt die Hüllkurve nicht mit — der Deckel macht das Ende.
         `cap` bleibt dennoch wirksam: es verjüngt die letzten Abtastungen VOR dem Deckel. */
      const endU = Math.min(i, N - 1 - i) / Math.max(1, (N - 1) * 0.5 * Math.max(0.02, p.cap ?? 0.8) * 0.5);
      const capF = p.even !== false ? (endU >= 1 ? 1 : Math.sin(Math.min(1, endU) * Math.PI / 2)) : envelope;
      const half = widthAt(i) * width / 512 * capF * (p.even !== false ? 1 : (1 + 0.18 * p.taper * Math.sin(Math.PI * t)));
      const [x, y] = geoAt(q);
      let zBase = T.MathUtils.lerp(f.left.z, f.right.z, t);
      if (skin) {
        const u = t * (skin.n - 1), k = Math.min(skin.n - 2, Math.floor(u));
        zBase = T.MathUtils.lerp(zBase, T.MathUtils.lerp(skin[k], skin[k + 1], u - k), p.follow);
      }
      return { x, y, z: zBase + f.radius * p.lift, tx: tg.x, ty: tg.y, half };
    };

    const form = solid
      ? solidForm({ N, at, mask: p.mask, round: p.round ?? 1 })
      : ribbonForm({ N, at });

    const geo = this.mesh.geometry;
    /* Die Eckpunktzahl ändert sich mit der Maske (zwei Läufe plus Deckel), darum wird nicht mehr
       blind in den alten Puffer geschrieben — sonst bleibt eine halbe Braue stehen. */
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
    if (this.material.depthWrite !== solid) { this.material.depthWrite = solid; this.material.needsUpdate = true; }
    /* Der Verwurf ist im Schlauch aus: die Lücke steht in der Geometrie. Im Bändchen bleibt er. */
    this.material.uniforms.gap.value = solid ? 0 : p.mask;
    this.material.uniforms.cap.value = hb * 0.5;
    this.material.uniforms.ink.value.copy(p.color ? new T.Color(p.color) : this.autoColor);
    this.frame = { center: [cx, cy], radius: f.radius, span, width, gen: f.gen, hb,
      form: solid ? (p.even !== false ? 'tube (even, capped)' : 'tube (quill, capped)') : 'ribbon',
      runs: form.runs, maskInGeometry: solid && p.mask > 0,
      probes: skin ? skin.hits : 0, probeN: skin ? skin.n : 0 };
    this.last = { status: 'OK' };
    return this.last;
  }
}
