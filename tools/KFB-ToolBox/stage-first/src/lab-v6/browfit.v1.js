/**
 * browfit.v1 · EINE Stellformel für ALLE Brauen-Arten, und die drei Reparaturen dazu.
 *
 * Georg, 15.09.: »balken-augenbrauen skalieren als block, größe ist schlecht den augen anzupassen
 * → check & repair der globalen funktion für alle eyebrow types; auch fixen: tapering &
 * skalierungen, inkl. mono-brow-maske mit schnittkanten der tube«.
 *
 * ═══ WAS GEMESSEN WURDE (15.09., nachrechenbar) ══════════════════════════════════════════════
 *
 * (a) DICKE HING AN DER LÄNGE. In `brow-rig.v2` und `brow.v3` ist die halbe Dicke
 *     `nib(i) · width/512`, und `width = span · (0,55 + 0,75 · length)`. Der Längenregler hat
 *     also die Braue mitverdickt. Bei `length = 0,6` ist `width` GENAU `span` — darum ist der
 *     Bezug hier `span`: bei der Vorgabe Ziffer für Ziffer dasselbe Ergebnis, aber der
 *     Längenregler ändert die Dicke nicht mehr.
 *
 * (b) DICKE HING AM AUSLAUF. Im Balken-Stand (`even`) war der Radius der MITTELWERT der
 *     Federkurve, und die Feder hängt an `taper`. Gemessen über die Kennlinie (Kurve »neutral«,
 *     Seed 1001, 129 Abtastungen), Verhältnis Mittelwert/`hb·512`:
 *         taper 0 → 0,464 · 0,5 → 0,422 · **0,85 → 0,392** · 1 → 0,380
 *     — unabhängig von der Dicke (alle vier Dickenstufen liefern dieselben Verhältnisse).
 *     Der Auslaufregler hat den Balken also um **18 %** verdünnt, ohne daß es jemand bestellt hat.
 *     `EVEN_K = 0,392` ist dieses Verhältnis bei der VORGABE `taper = 0,85`: der Balken sieht
 *     heute aus wie gestern und rührt sich nicht mehr, wenn der Auslauf wandert.
 *
 * (c) DER BALKEN KAM NIE AN DIE AUGEN HERAN. Mit (a)+(b) ist die Balkenhöhe
 *     `2 · hbAt(thickness) · EVEN_K · span`. Für CapsuleCarl (Augenabstand 0,328, Radius 0,13,
 *     also span 0,588) ergibt das bei `thickness 1` **0,121 Augenradien** — und am alten
 *     Anschlag 3 erst 0,36. Carls EIGENE Balkenbraue ist **1,01 Augenradien** hoch (Insel
 *     0,166 hoch, Maßstab 0,790). Der gezeichnete Regler konnte die Blockbraue also nie
 *     erreichen: er endete beim Drittel. Darum reicht `thickness` jetzt bis **10** (≈ 1,21
 *     Augenradien) und der Bericht nennt die Höhe IN AUGENRADIEN (`barR`) — die Zahl, nach der
 *     Georg gefragt hat (»der Größe der Augen anpassen«).
 *
 * (d) DIE BLOCKBRAUE SKALIERTE ALS BLOCK. `facegraft.v1` setzt
 *     `s = width / donor.pairWidth` und dann `pivot.scale.setScalar(s)` — EIN Maßstab für Länge,
 *     Dicke UND Tiefe, abgeleitet aus der PAARBREITE (beide Brauen samt Lücke, bei Carl 0,744
 *     für eine 0,300 breite Braue). Folge: wer die Braue länger machte, machte sie dicker; wer
 *     sie dicker wollte, schob sie auseinander (die Spreizung hing an `s`). Hier sind es zwei
 *     Maßstäbe: `sx` aus der Paarbreite (Länge, unverändert), `sy = sz` aus der GEWÜNSCHTEN
 *     BALKENHÖHE IN AUGENRADIEN. Vorgabe `thickness = 1` reproduziert Carls heutige Größe auf
 *     1 % — und ist ab jetzt von der Länge unabhängig.
 *
 * (e) `cap` WAR KEINE LÄNGE, SONDERN EINE ABTASTZAHL. `endU = min(i, N−1−i) / ((N−1)·0,25·cap)`
 *     verjüngte bei `cap 0,8` das äußere FÜNFTEL jeder Hälfte — unabhängig von der Dicke, also
 *     bei jedem Pet anders. Jetzt macht das Ende eine KUPPEL aus `inkform.v2` (Radius = Ringradius,
 *     Kreisprofil), `cap` ist ihre Höhe: 0 = flacher Schnitt, 1 = Halbkugel. Die Kurve selbst
 *     wird nicht mehr verjüngt — ein Balken ist ein Balken.
 *
 * (f) DIE MASKE SCHNITT IN EINEN HOHLEN SCHLAUCH. `brow-rig.v2` verwirft Fragmente (`gap`); auf
 *     einem Körper sieht man in das Rohr. `brow.v3` hat die Form geteilt und gedeckelt, aber mit
 *     6 Facetten und einer SPITZE als Deckel. Hier: 12 Facetten, an der Maske ein flacher
 *     SCHNITT (`disc`), außen die Kuppel.
 *
 * Alles andere — Kurve, Presets, Anker `eyeFrame()`, Kopfabtastung, Feder, Spiegelung,
 * Lebenszyklus, Fehlervertrag — ist unverändert geerbt. Die Vendor-Module bleiben unberührt.
 */
import { BrowRig as DrawnBase, DEFAULTS as D2, PRESETS, PRESET_NAMES, pointsFor, hbAt } from '../petstudio-v9/studio-v12/brow-rig.v2.js';
import { inkHalfWidth, INK_PRESETS } from '../petstudio-v9/kfb-ink-canon.js';
import { solidForm, ribbonForm } from './inkform.v2.js';
import { probeSkin } from '../petstudio-v9/studio-v12/brow-rig.v2.js';
import { BrowGraft as GraftBase, BROW_DEFAULTS as GD } from './facegraft.v1.js';

export const SCHEMA = 'kfb.browfit/1';
export { PRESETS, PRESET_NAMES, pointsFor, hbAt };

/* Gemessen (siehe (b) oben): Mittelwert der Federbreite / (hb · 512) bei taper 0,85. */
export const EVEN_K = 0.392;
export const EVEN_K_TABLE = Object.freeze({ 0: 0.464, 0.5: 0.422, 0.85: 0.392, 1: 0.380 });

export const DEFAULTS = Object.freeze({ ...D2, thickness: 1, cap: 0.8, facets: 12 });
/* Nur die Grenzen, die sich geändert haben, stehen hier als Begründung:
   thickness 0…10 statt 0…3 (siehe (c)) · facets 3…24 (Formsache, kein Messwert). */
export const LIMITS = Object.freeze({ mask: [0, 1], thickness: [0, 10], length: [0, 1], taper: [0, 1],
  height: [0, 1], x: [-1, 1], y: [-1, 1], tiltLeft: [-1, 1], tiltRight: [-1, 1], bendLeft: [-1, 1],
  bendRight: [-1, 1], follow: [0, 1], lift: [-1, 3], round: [0, 2], cap: [0, 1], facets: [3, 24] });

export function validate(patch) {
  for (const [k, v] of Object.entries(patch || {})) {
    if (!(k in DEFAULTS) && k !== 'points' && k !== 'expr') return { status: 'UNSUPPORTED', field: k, reason: 'Unknown eyebrow field' };
    const lim = LIMITS[k];
    if (lim && (!Number.isFinite(v) || v < lim[0] || v > lim[1])) return { status: 'UNSUPPORTED', field: k, reason: 'Out of range ' + lim.join('…') };
    if (['enabled', 'symmetric', 'solid', 'even'].indexOf(k) >= 0 && typeof v !== 'boolean') return { status: 'UNSUPPORTED', field: k, reason: 'Expected boolean' };
    if (k === 'color' && v !== null && !/^#[0-9a-f]{6}$/i.test(v)) return { status: 'UNSUPPORTED', field: k, reason: 'Expected #RRGGBB or null' };
    if (k === 'points' && (!Array.isArray(v) || v.length < 3 || v.length > 5)) return { status: 'UNSUPPORTED', field: k, reason: '3–5 control points required' };
  }
  return { status: 'OK' };
}

/**
 * DIE GLOBALE STELLFORMEL. Ein Augen-Anker plus Regler → Lage und Maße in WELTEINHEITEN.
 * Sie ist der einzige Ort, an dem aus `length`, `height`, `thickness`, `x`, `y` Zahlen werden —
 * die gezeichnete Braue, der Schnurrbart-Bauweg und die gegraftete Blockbraue lesen dieselbe.
 *
 *   span     Augenabstand + zwei Radien (der Bezug für ALLES Waagerechte)
 *   width    span · (0,55 + 0,75 · length)     — x-Ausdehnung, unverändert wie v1/v2/v3
 *   barHalf  hbAt(thickness) · EVEN_K · span   — halbe Balkendicke, OHNE length und OHNE taper
 *   barR     Balkenhöhe in Augenradien         — die Zahl für »an die Augen anpassen«
 */
export function fitBrow(f, p) {
  const r = f.radius;
  const cx = (f.left.x + f.right.x) / 2, cy = (f.left.y + f.right.y) / 2;
  const span = Math.abs(f.right.x - f.left.x) + r * 2;
  const width = span * (0.55 + 0.75 * (p.length ?? DEFAULTS.length));
  const amp = r * 0.85;
  const y0 = cy + r * (1.16 + (p.height ?? DEFAULTS.height) * 0.85 + (p.y ?? 0));
  const barHalf = hbAt(p.thickness ?? 1) * EVEN_K * span;
  return { cx, cy, r, span, width, amp, y0,
    x0: cx + (p.x ?? 0) * r,
    barHalf, barR: +(2 * barHalf / Math.max(1e-6, r)).toFixed(3) };
}

/** Balkenhöhe in Augenradien → der Reglerwert, der sie erzeugt. Für Vorgaben und Berichte. */
export function thicknessForBarR(barR, f) {
  const span = Math.abs(f.right.x - f.left.x) + f.radius * 2;
  const hb = barR * f.radius / (2 * EVEN_K * span);
  return hb <= 0.034 ? (hb - 0.014) / 0.02 : hb / 0.034;
}

/* ═══ DIE GEZEICHNETE BRAUE ═══════════════════════════════════════════════════════════════════ */
export class BrowRig extends DrawnBase {
  export() { return { ...super.export(), schema: 'kfb.brow-experiment/0.4' }; }
  set(patch) {
    const check = validate(patch); if (check.status !== 'OK') return check;
    this.params = { ...this.params, ...structuredClone(patch) }; this.rebuild(); return check;
  }
  rebuild() {
    const T = this.T, p = this.params, f = this.getEyeFrame && this.getEyeFrame();
    if (!p) return { status: 'OK' };
    if (!f || !f.left || !f.right || !(f.radius > 0)) {
      this.mesh.visible = false;
      this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' };
      return this.last;
    }
    if (f.parent && f.parent !== this.mesh.parent) { this.mesh.removeFromParent(); f.parent.add(this.mesh); }
    this.gen = f.gen;

    const F = fitBrow(f, p);
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
    const even = p.even !== false, solid = p.solid !== false;
    /* Die Feder wird nur noch für die HANDSCHRIFT gebraucht (Stand »Tube (Feder)«), nicht mehr
       für die Dicke: ihr Verlauf wird auf seinen eigenen Mittelwert normiert und auf `barHalf`
       gelegt. Damit bedeutet »Dicke 1« in beiden Ständen dieselbe Balkenhöhe. */
    let nibW = null, nibMean = 1;
    if (!even) {
      const nibPoints = samples.map((v) => [(v.x + 1) * 256, 128 - v.y * 90]);
      const nib = inkHalfWidth(nibPoints, 512, 256, this.seed,
        { ...INK_PRESETS.figure, hb: hbAt(p.thickness), minHalf: 0, edge: 2.10 * (0.3 + 0.7 * p.taper), taper: 0.45 * p.taper }, 1);
      nibW = p.symmetric === false ? nib : ((i) => nib(i < N / 2 ? i : N - 1 - i));
      let m = 0; for (let i = 0; i < N; i++) m += nibW(i); nibMean = Math.max(1e-6, m / N);
    }
    const geoAt = (q) => [F.x0 + q.x * F.width / 2, F.y0 + q.y * F.amp];
    const skin = p.follow > 0 ? this._probeSkin(f, samples, geoAt) : null;

    const at = (i) => {
      const t = i / (N - 1), q = samples[i];
      const prev = samples[Math.max(0, i - 1)], next = samples[Math.min(N - 1, i + 1)];
      const tg = new T.Vector2((next.x - prev.x) * F.width / 2, (next.y - prev.y) * F.amp).normalize();
      let half = F.barHalf;
      if (!even) {
        const envelope = 1 - p.taper + p.taper * Math.pow(Math.sin(Math.PI * t), 0.65);
        half = F.barHalf * (nibW(i) / nibMean) * envelope * (1 + 0.18 * p.taper * Math.sin(Math.PI * t));
      }
      const [x, y] = geoAt(q);
      let zBase = T.MathUtils.lerp(f.left.z, f.right.z, t);
      if (skin) {
        const u = t * (skin.n - 1), k = Math.min(skin.n - 2, Math.floor(u));
        zBase = T.MathUtils.lerp(zBase, T.MathUtils.lerp(skin[k], skin[k + 1], u - k), p.follow);
      }
      return { x, y, z: zBase + f.radius * p.lift, tx: tg.x, ty: tg.y, half };
    };

    const form = solid
      ? solidForm({ N, at, mask: p.mask, round: p.round ?? 1, rad: Math.round(p.facets ?? 12), cap: p.cap ?? 0.8 })
      : ribbonForm({ N, at });

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
    if (this.material.depthWrite !== solid) { this.material.depthWrite = solid; this.material.needsUpdate = true; }
    /* Im Schlauch steht die Lücke in der GEOMETRIE — der Fragment-Verwurf muß aus, sonst schneidet
       er ein zweites Mal, und zwar in die geschlossene Form. */
    this.material.uniforms.gap.value = solid ? 0 : p.mask;
    this.material.uniforms.cap.value = hbAt(p.thickness) * 0.5;
    this.material.uniforms.ink.value.copy(p.color ? new T.Color(p.color) : this.autoColor);
    this.frame = { center: [F.cx, F.cy], radius: f.radius, span: F.span, width: F.width, gen: f.gen,
      hb: hbAt(p.thickness), barHalf: +F.barHalf.toFixed(4), barR: F.barR,
      form: solid ? (even ? 'bar (even, capped ' + (p.cap ?? 0.8).toFixed(2) + ')' : 'tube (quill, normalised)') : 'ribbon',
      runs: form.runs, facets: form.rad, maskInGeometry: solid && p.mask > 0,
      probes: skin ? skin.hits : 0, probeN: skin ? skin.n : 0 };
    this.last = { status: 'OK' };
    return this.last;
  }
}

/* ═══ CARLS EIGENE BLOCKBRAUE, NICHT MEHR ALS BLOCK SKALIERT ══════════════════════════════════ */
export const BROW_DEFAULTS = Object.freeze({ ...GD, thickness: 1, depthScale: 1 });
export const BROW_META = [
  ['length', 'Width', 0, 1, 0.01], ['thickness', 'Thickness (eye radii)', 0.2, 3, 0.02],
  ['height', 'Height', 0, 1, 0.01], ['scale', 'Size (both)', 0.4, 2.2, 0.01],
  ['spread', 'Spacing', -0.5, 0.5, 0.01], ['y', 'Lift', -1, 1, 0.01],
  ['depth', 'Depth', -0.12, 0.2, 0.004], ['depthScale', 'Roundness', 0.3, 2, 0.02],
  ['tilt', 'Tilt', -25, 25, 1], ['wobble', 'Wobble', 0, 1, 0.05],
];

export class BrowGraft extends GraftBase {
  set(patch) {
    for (const [k, v] of Object.entries(patch || {})) {
      if (!(k in BROW_DEFAULTS)) return { status: 'UNSUPPORTED', field: k, reason: 'unknown' };
      if (k !== 'enabled' && k !== 'color' && !Number.isFinite(v)) return { status: 'UNSUPPORTED', field: k, reason: 'not a number' };
    }
    Object.assign(this.params, patch);
    if ('color' in (patch || {})) this._paint();
    this.rebuild();
    return { status: 'OK' };
  }
  reset() { this.params = { ...BROW_DEFAULTS, enabled: this.params.enabled }; this._paint(); this.rebuild(); return { status: 'OK' }; }
  rebuild() {
    const T = this.T, p = { ...BROW_DEFAULTS, ...this.params }, f = this.getEyeFrame && this.getEyeFrame();
    if (!f || !f.left || !f.right || !(f.radius > 0)) {
      this.group.visible = false;
      this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' };
      return this.last;
    }
    if (f.parent && f.parent !== this.group.parent) { this.group.removeFromParent(); f.parent.add(this.group); }
    this.gen = f.gen;
    this.group.visible = !!p.enabled;
    if (!p.enabled || !this.parts.length) { this.last = { status: 'OK', enabled: !!p.enabled }; return this.last; }
    this._paint();

    const F = fitBrow(f, p);
    /* ZWEI Maßstäbe statt einem. `sx` aus der Paarbreite (wie bisher, das war richtig), `sy` aus
       der gewünschten Balkenhöhe in Augenradien — darum verdickt Länge nicht mehr, und Dicke
       spreizt nicht mehr. `depthScale` trennt die Tiefe ab, ohne sie zu erfinden (1 = wie hoch). */
    const sx = (F.width / Math.max(1e-6, this.donor.pairWidth)) * p.scale;
    /* Tiefe: zwei Strahlen auf die Kopffläche, an den beiden Brauenenden — dieselbe Abtastung wie
       in der geerbten Fassung und dieselbe, die die gezeichnete Braue benutzt. */
    let zL = f.left.z, zR = f.right.z;
    if (p.follow > 0) {
      const probes = [new T.Vector3(-1, 0, 0), new T.Vector3(1, 0, 0)];
      const skin = probeSkin(T, f, probes, (q) => [F.x0 + q.x * F.width / 2, F.y0], 2);
      if (skin && skin.n >= 2) { zL = skin[0]; zR = skin[1]; }
    }

    const rep = [];
    this.parts.forEach((pm) => {
      const it = pm.donor, sgn = it.sign;
      const sy = (p.thickness * f.radius) / Math.max(1e-6, it.size.y) * p.scale;
      const x = F.x0 + sx * it.centre.x + p.spread * f.radius * sgn;
      const z = (sgn < 0 ? zL : zR) + p.depth;
      pm.pivot.position.set(x, F.y0, z);
      pm.pivot.scale.set(sx, sy, sy * (p.depthScale ?? 1));
      pm.pivot.rotation.set(0, 0, (p.tilt * Math.PI / 180) * sgn);
      pm._restQ = pm.pivot.quaternion.clone();
      rep.push({ island: it.island + 1, sx: +sx.toFixed(4), sy: +sy.toFixed(4),
        barH: +(p.thickness * f.radius).toFixed(4), donorH: +it.size.y.toFixed(3) });
    });
    this.last = { status: 'OK', schema: SCHEMA, scale: +sx.toFixed(4), width: +F.width.toFixed(4),
      y: +F.y0.toFixed(4), barR: p.thickness, parts: rep, donorPairWidth: +this.donor.pairWidth.toFixed(4) };
    return this.last;
  }
}
