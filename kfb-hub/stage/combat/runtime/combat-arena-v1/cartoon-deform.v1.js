/**
 * cartoon-deform.v1.js — der Cartoon-Verbieger für Kämpfer (SOP kfb-cartoon-animation_v2).
 *
 * Eine SICHT-Schicht: sie schreibt nur Skala und Kipp einer Hülle um die Figur, nie die Lage, die
 * dem Spiel gehört (§8.3: finalPosition = gameplay + visual offset). Jedes Ereignis läuft die
 * Phasen Anticipation → Action → Impact → Follow-through → Recovery (§2.1) mit fester Dauer und
 * endet in der Ruhelage (§2.1 Recovery: kein Ereignis ohne Rückweg). Volumen bleibt: sx·sy·sz ≈ 1.
 *
 * Presets nach §11.4 `impact` (Kontakt 0–40 ms, Hitstop 40–95, Recovery 620–850) und den
 * mentalen Modellen aus Georgs Auftrag: FIRE (Rückstoß), HIT (Stauchung + Rückprall), STUN
 * (Wackeln, abklingend), DEATH (Zusammensacken, Kippen, Ausblenden), RECOVER (zurück).
 */
export const PRESETS = {
  fire:  { dur: 0.42, hitstop: 0,     recoil: 0.18, phases: [[0, 0.10, 'anticipation'], [0.10, 0.16, 'action'], [0.16, 0.20, 'impact'], [0.20, 0.32, 'followThrough'], [0.32, 0.42, 'recovery']] },
  hit:   { dur: 0.72, hitstop: 0.07,  recoil: 0.26, phases: [[0, 0.04, 'impact'], [0.04, 0.10, 'hitstop'], [0.10, 0.30, 'action'], [0.30, 0.52, 'followThrough'], [0.52, 0.72, 'recovery']] },
  stun:  { dur: 1.30, hitstop: 0,     recoil: 0,    phases: [[0, 0.08, 'impact'], [0.08, 1.05, 'action'], [1.05, 1.30, 'recovery']] },
  death: { dur: 1.40, hitstop: 0.09,  recoil: 0.35, phases: [[0, 0.05, 'impact'], [0.05, 0.14, 'hitstop'], [0.14, 0.55, 'action'], [0.55, 1.05, 'followThrough'], [1.05, 1.40, 'recovery']] },
};
const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export class Deformer {
  constructor(THREE, shell, o = {}) {
    this.THREE = THREE; this.shell = shell;                 // shell = Gruppe UM die Figur, die das Spiel nie anfasst
    this.mixer = o.mixer || null;                           // für den Hitstop (timeScale 0, dann zurück)
    this.forward = o.forward || new THREE.Vector3(0, 0, 1);  // Blickrichtung der Figur (Welt), Rückstoß läuft dagegen
    this.onPhase = o.onPhase || null;
    this.ev = null; this.t = 0; this.phase = 'idle'; this.count = 0;
    this.rest = { s: [1, 1, 1], rx: 0, rz: 0, off: [0, 0, 0], op: 1 };
  }
  fire(name) {
    const P = PRESETS[name]; if (!P) return false;
    this.ev = { name, P }; this.t = 0; this.count++;
    if (this.mixer && P.hitstop) { this._ts = this.mixer.timeScale; this.mixer.timeScale = 0; }
    return true;
  }
  update(dt) {
    const s = this.shell;
    if (!this.ev) { this._apply(this.rest); return; }
    const { name, P } = this.ev; this.t += dt;
    const ph = (P.phases.find(([a, b]) => this.t >= a && this.t < b) || [0, 0, 'recovery'])[2];
    if (ph !== this.phase) { this.phase = ph; if (this.onPhase) this.onPhase(name, ph, +this.t.toFixed(3)); }
    if (this.mixer && P.hitstop && this.t >= P.hitstop + 0.04 && this.mixer.timeScale === 0) this.mixer.timeScale = this._ts || 1;
    const k = Math.min(1, this.t / P.dur), f = this.forward, v = { s: [1, 1, 1], rx: 0, rz: 0, off: [0, 0, 0], op: 1 };
    const sq = (amt) => { v.s = [1 + amt, 1 - amt, 1 + amt]; };                                   // Stauchung, volumenerhaltend
    const st = (amt) => { v.s = [1 - amt * 0.5, 1 + amt, 1 - amt * 0.5]; };                       // Streckung
    const back = (amt) => { v.off = [-f.x * amt, 0, -f.z * amt]; };                                 // Rückstoß gegen die Blickrichtung
    if (name === 'fire') {
      if (this.t < 0.10) sq(0.10 * (this.t / 0.10));                                                // Anticipation: duckt sich
      else if (this.t < 0.20) { st(0.14 * (1 - (this.t - 0.10) / 0.10)); back(P.recoil * ((this.t - 0.10) / 0.10)); v.rx = -0.18 * ((this.t - 0.10) / 0.10); }
      else { const r = ease(Math.min(1, (this.t - 0.20) / 0.22)); back(P.recoil * (1 - r)); v.rx = -0.18 * (1 - r); sq(0.05 * Math.sin(r * Math.PI)); }
    } else if (name === 'hit') {
      if (this.t < 0.10) { sq(0.28 * Math.min(1, this.t / 0.04)); back(P.recoil * 0.4 * Math.min(1, this.t / 0.04)); v.rx = 0.22; }
      else if (this.t < 0.30) { const r = (this.t - 0.10) / 0.20; sq(0.28 * (1 - r) - 0.12 * Math.sin(r * Math.PI)); back(P.recoil * (0.4 + 0.6 * ease(r))); v.rx = 0.22 * (1 - r); }
      else { const r = ease(Math.min(1, (this.t - 0.30) / 0.42)); back(P.recoil * (1 - r)); sq(0.05 * Math.sin(r * Math.PI * 2) * (1 - r)); }
    } else if (name === 'stun') {
      const decay = Math.max(0, 1 - (this.t - 0.08) / 0.97);
      v.rz = Math.sin(this.t * 11) * 0.16 * decay; v.rx = Math.cos(this.t * 7.3) * 0.06 * decay; sq(0.04 * decay);
    } else if (name === 'death') {
      if (this.t < 0.14) { sq(0.30 * Math.min(1, this.t / 0.05)); back(P.recoil * 0.3); }
      else if (this.t < 0.55) { const r = ease((this.t - 0.14) / 0.41); v.rx = -1.45 * r; back(P.recoil * (0.3 + 0.7 * r)); v.s = [1 + 0.1 * r, 1 - 0.1 * r, 1]; }
      else if (this.t < 1.05) { const r = (this.t - 0.55) / 0.5; v.rx = -1.45 - 0.12 * Math.sin(r * Math.PI); back(P.recoil); v.s = [1.15 + 0.05 * r, 0.75 - 0.15 * r, 1]; }
      else { const r = ease((this.t - 1.05) / 0.35); v.rx = -1.57; back(P.recoil); v.s = [1.2, 0.6, 1]; v.op = 1 - r; }
    }
    this._apply(v);
    if (k >= 1) { this.ev = null; this.phase = 'idle'; if (name !== 'death') this._apply(this.rest); if (this.onPhase) this.onPhase(name, 'idle', +this.t.toFixed(3)); }
  }
  _apply(v) {
    const s = this.shell;
    s.scale.set(v.s[0], v.s[1], v.s[2]); s.rotation.x = v.rx; s.rotation.z = v.rz; s.position.set(v.off[0], v.off[1], v.off[2]);
    if (v.op !== this._op) { this._op = v.op; s.traverse((m) => { if (m.isMesh || m.isSkinnedMesh) [].concat(m.material).forEach((mat) => { if (!mat) return; mat.transparent = v.op < 1 || mat.userData.wasTransparent; mat.opacity = v.op; }); }); }
  }
  get busy() { return !!this.ev; }
}
