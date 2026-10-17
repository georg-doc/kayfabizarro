// M1 · Gang-Mischer nach V-248 (WS0 15.10.): Die Abspielrate des Clips folgt dem Körpertempo – timeScale = Tempo / Eigentempo des Clips, Grenzen
// 0,8–1,25; außerhalb wechselt der Clip. Ersetzt für die Fortbewegung die festen LOCO-Anker aus anim.mjs (dort kann die Abspielrate nicht dem Tempo
// folgen). Übernommen aus anim.mjs (ActorAnimator, cloudflare-live @e21e4904, Blob 2c68c36d): ein Mixer je Figur, gemeinsame Gangphase mit dem
// Linksfuß-Versatz je Clip (Handover §3), Overlays (play/stop/current/progress) für Sprung, Landung, Flug und Emotes – gleiche Schnittstelle.
// Eigentempi = Wurzeltempo, bei dem die Sohle während des Kontakts steht (scripts/m1/clip-speed.mjs, FB v5b, 240 Hz), in Rig-Einheiten (÷ Maßstab).
// In einer Lücke zwischen zwei Bereichen spielt der näher liegende Clip mit seiner Grenz-Abspielrate – dort rutschen die Füße (offengelegt). Die Tempi
// nach V-020 liegen alle in einem Bereich: Gehen 1,12 (×1,0), Joggen 3,08 (Running_A ×0,95), Sprint 4,88 (Running_B ×0,96); Lücke nur Gehen↔Joggen.
import * as THREE from 'three'

// Rig-Einheiten/s (FB: Welt = Rig × 0,947). Gemessen 15.10. mit Ferse/Ballen aus dem Netz (m1-sole, clip-speed.mjs): Walking_B 1,12 · Running_A 3,24 ·
// Running_B 5,08 m/s auf FB. (Die erste Messung über Knochen-Ursprünge lag daneben, Prüfer M1-3 Befund 3.) Nahe der Motion-SSOT LOCO (0,98/3,303/5,255).
export const GAITS = Object.freeze([
  { key: 'walk', clip: 'Walking_B', native: 1.182, lfd: 0 },
  { key: 'run', clip: 'Running_A', native: 3.42, lfd: 0.0833 },
  { key: 'sprint', clip: 'Running_B', native: 5.364, lfd: 0.125 },
])
export const TS = Object.freeze({ min: 0.8, max: 1.25 })

// Gewichte und Abspielraten je Gangart für Tempo v (Rig-Einheiten/s). Unter dem Bereich der ersten Gangart: Mischung mit Idle.
export function gaitWeights(v) {
  const w = { idle: 0 }, ts = {}
  for (const g of GAITS) { w[g.key] = 0; ts[g.key] = 1 }
  if (v <= 0.05) { w.idle = 1; return { w, ts } }
  const lo = (g) => g.native * TS.min, hi = (g) => g.native * TS.max
  const first = GAITS[0]
  if (v < lo(first)) { const k = v / lo(first); w.idle = 1 - k; w[first.key] = k; ts[first.key] = TS.min; return { w, ts } }
  for (let i = 0; i < GAITS.length; i++) {
    const g = GAITS[i]
    if (v >= lo(g) && v <= hi(g)) { w[g.key] = 1; ts[g.key] = v / g.native; return { w, ts } }
    const n = GAITS[i + 1]
    if (n && v > hi(g) && v < lo(n)) {
      // Lücke zwischen zwei Bereichen: der Clip mit dem kleineren Abstand der Abspielrate zu seiner Grenze spielt allein (am Rand begrenzt) –
      // Umschaltpunkt = geometrisches Mittel der Grenzen; nur in einem schmalen Band (±4 %) phasengleich überblendet, damit nichts springt.
      const sw = Math.sqrt(hi(g) * lo(n)), band = 0.04 * sw, k = THREE.MathUtils.clamp((v - (sw - band)) / (2 * band), 0, 1)
      w[g.key] = 1 - k; w[n.key] = k; ts[g.key] = TS.max; ts[n.key] = TS.min; return { w, ts }
    }
  }
  const last = GAITS.at(-1); w[last.key] = 1; ts[last.key] = Math.min(TS.max, v / last.native); return { w, ts }
}

export class GaitAnimator {
  constructor(root, clips) {
    this.root = root; this.mixer = new THREE.AnimationMixer(root); this.clips = clips
    this.actions = new Map(); this.phase = 0; this.speed = 0; this.overlays = []; this.locoScale = 1; this.time = 0; this.last = null
    for (const g of GAITS) { const a = this.action(g.clip); if (a) { a.play(); a.timeScale = 0; a.setEffectiveWeight(0) } }
    const idle = this.action('Idle_A'); if (idle) { idle.play(); idle.setEffectiveWeight(1) }
  }
  action(name) { if (this.actions.has(name)) return this.actions.get(name); const c = this.clips[name]; if (!c) return null; const a = this.mixer.clipAction(c); this.actions.set(name, a); return a }
  has(name) { return !!this.clips[name] }
  // Overlay wie anim.mjs ActorAnimator.play: 'once' (zurück zur Fortbewegung), 'clamp', 'loop'
  play(name, { mode = 'once', fade = 0.15, timeScale = 1, from = 0, exclusive = true } = {}) {
    const a = this.action(name); if (!a) return null
    a.reset(); a.enabled = true; a.timeScale = timeScale; a.time = from
    a.setLoop(mode === 'loop' ? THREE.LoopRepeat : THREE.LoopOnce, Infinity); a.clampWhenFinished = mode !== 'loop'; a.play()
    if (exclusive) for (const o of this.overlays) o.target = 0
    let o = this.overlays.find((x) => x.action === a)
    if (!o) { o = { action: a, name, w: 0, target: 1, fade, mode }; this.overlays.push(o) }
    o.target = 1; o.fade = fade; o.mode = mode; o.started = this.time
    return a
  }
  stop(name, fade = 0.2) { for (const o of this.overlays) if (!name || o.name === name) { o.target = 0; o.fade = fade } }
  current() { let b = null; for (const o of this.overlays) if (o.target > 0 && (!b || o.started > b.started)) b = o; return b?.name ?? null }
  isPlaying(name) { return this.overlays.some((o) => o.name === name && o.target > 0) }
  progress(name) { const a = this.actions.get(name); return a ? a.time / a.getClip().duration : 0 }
  update(dt, speed) {
    this.time += dt; this.speed = speed
    let sum = 0
    for (const o of this.overlays) {
      if (o.mode === 'once' && o.target > 0) { const d = o.action.getClip().duration; if (o.action.time >= d - 1e-3 || !o.action.isRunning()) o.target = 0 }
      const rate = dt / Math.max(0.01, o.fade); o.w += Math.sign(o.target - o.w) * Math.min(Math.abs(o.target - o.w), rate); sum += o.w
    }
    if (sum > 1) for (const o of this.overlays) o.w /= sum
    this.overlays = this.overlays.filter((o) => { if (o.w <= 1e-3 && o.target === 0) { o.action.stop(); o.action.setEffectiveWeight(0); return false } o.action.setEffectiveWeight(o.w); return true })
    sum = Math.min(1, this.overlays.reduce((s, o) => s + o.w, 0)); this.locoScale = 1 - sum
    // gemeinsame Gangphase: Phasenrate = Σ w·ts/T / Σ w (Handover §3 mit Abspielrate je Clip, V-248)
    const { w, ts } = gaitWeights(speed); this.last = { w, ts }
    let num = 0, den = 0
    for (const g of GAITS) { const a = this.actions.get(g.clip); if (!a || !w[g.key]) continue; num += w[g.key] * ts[g.key] / a.getClip().duration; den += w[g.key] }
    if (den > 0) this.phase = (this.phase + dt * num / den) % 1
    for (const g of GAITS) { const a = this.actions.get(g.clip); if (!a) continue; a.time = ((this.phase + g.lfd) % 1) * a.getClip().duration; a.setEffectiveWeight(w[g.key] * this.locoScale) }
    const idle = this.actions.get('Idle_A'); if (idle) idle.setEffectiveWeight(w.idle * this.locoScale)
    this.mixer.update(dt)
  }
  dispose() { this.mixer.stopAllAction(); this.mixer.uncacheRoot(this.root) }
}
