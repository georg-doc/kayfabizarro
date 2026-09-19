/**
 * lab-v8/spring.v1.js · Der gedaempfte Spring, WOERTLICH aus dem Boden-Deformer gehoben.
 *
 * Warum eine eigene Datei und keine Kopie im Flight-Deformer: zwei Integratoren mit denselben
 * Parametern waeren zwei Orte, an denen eine Zahl driften kann. Und warum kein Import aus
 * `lab-v7/vehicle-cartoon-deformer.v2.js`: die Klasse ist dort nicht exportiert, und die Datei
 * wird in dieser Runde NICHT angefasst (v2-Aenderungsliste bleibt leer).
 *
 * Der Code unten ist Zeile fuer Zeile derselbe wie in v2 (Teilschritte 1/240 s, Kappung mit
 * Geschwindigkeitsbremse, NaN-Auffangen, attack/release als Frequenzskalierung). Wer hier etwas
 * aendert, aendert die Grammatik beider Linien — dann bitte mit Messung.
 */
export const SCHEMA = 'kfb.spring/1';
export const LIFTED_FROM = 'lab-v7/vehicle-cartoon-deformer.v2.js (class Spring)';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const finite = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);

export class Spring {
  constructor({ freq = 3, damp = 0.7, cap = 1, attack = 1, release = 1 } = {}) {
    Object.assign(this, { freq, damp, cap, attack, release });
    this.value = 0; this.vel = 0; this.target = 0;
  }
  set(target) { this.target = clamp(finite(target), -this.cap, this.cap); }
  /** Ereignis-Impuls: setzt Geschwindigkeit, nicht Ziel. Daraus entsteht Impact → Overshoot → Settle. */
  kick(v) { this.vel += finite(v); }
  step(dt) {
    let left = clamp(dt, 0, 0.5);
    const rising = Math.abs(this.target) > Math.abs(this.value);
    const scale = rising ? this.attack : this.release;
    const w = 2 * Math.PI * Math.max(0.01, this.freq * scale);
    while (left > 0) {
      const h = Math.min(left, 1 / 240); left -= h;
      const a = -2 * this.damp * w * this.vel - w * w * (this.value - this.target);
      this.vel += a * h;
      this.value += this.vel * h;
      if (this.value > this.cap) { this.value = this.cap; this.vel = Math.min(this.vel, 0); }
      if (this.value < -this.cap) { this.value = -this.cap; this.vel = Math.max(this.vel, 0); }
    }
    if (!isFinite(this.value) || !isFinite(this.vel)) { this.value = 0; this.vel = 0; }
    return this.value;
  }
  reset() { this.value = 0; this.vel = 0; this.target = 0; }
  tune(o) { Object.assign(this, o); this.cap = Math.abs(this.cap); }
  /** Ereignis-Energie: Abweichung vom ZIEL, nicht Absolutwert. Begruendung in v2 ausfuehrlich. */
  get amplitude() {
    const w = 2 * Math.PI * Math.max(0.01, this.freq);
    const dx = this.value - this.target;
    return Math.sqrt(dx * dx + (this.vel / w) * (this.vel / w));
  }
}
