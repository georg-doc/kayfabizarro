// S1 Fortbewegung (V-746) · Entstehen/Verschwinden des gerufenen Wagens als Mechanik über kfb-fluff-suck (V-533): n Kugeln je Wagen – build von der
// Figur (Düse) auf Punkte der Wagen-Hülle (Wagen wächst mit jeder gelandeten Kugel), suck von der Hülle zur Figur (Wagen schrumpft mit jedem Plopp, der
// eine Kugel vom Wagen löst). Ohne React (Host-Vertrag R1.2). Die Kugeln zeigt der Wirt erst nach Georgs Bild-Ja; kein Ton-Anschluss (Ton nur über WS-Audio).
// createTravelFluff({ n = 16, stagger = 0.3, r = 0.14 }) → { object3d, start(mode, base, yaw, size, nozzle), update(dt), grow(), stop(), dispose() }
import { createFluffSuck } from '../modules/fluffSuck.js'

export function createTravelFluff({ n = 16, stagger = 0.3, r = 0.14 } = {}) {
  const F = { mode: null, n, done: 0, queue: [], nozzle: null }
  const fx = createFluffSuck({ maxJobs: Math.max(24, n), onCue: (c) => { if (c === 'plop' && F.mode === 'suck') F.done++ } })
  // Punkte auf der Hülle (Ellipse um die Wagenmitte, versetzte Höhen), gedreht mit der Gierung; base = Bodenpunkt unter der Wagenmitte
  const hull = (b, yaw, { half, h }) => {
    const pts = []
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, rr = half * (0.45 + 0.15 * (i % 2)), lx = Math.cos(a) * rr * 0.5, lz = Math.sin(a) * rr
      pts.push([b.x + lx * Math.cos(yaw) + lz * Math.sin(yaw), b.y + h * (0.3 + (0.5 * ((i * 7) % 5)) / 4), b.z - lx * Math.sin(yaw) + lz * Math.cos(yaw)])
    }
    return pts
  }
  return {
    object3d: fx.object3d,
    start(mode, base, yaw, size, nozzle) {
      F.mode = mode; F.done = 0; F.nozzle = nozzle
      F.queue = hull(base, yaw, size).map((pos, i) => ({ t: (i / n) * stagger, pos }) /* gestaffelt: Wagen wächst und schrumpft stetig */)
    },
    update(dt) {
      if (F.mode) for (const q of F.queue) {
        if (q.t == null) continue; q.t -= dt; if (q.t > 0) continue; q.t = null
        if (F.mode === 'build') fx.build({ pos: q.pos, r }, F.nozzle, 'ground', { onLand: () => { F.done++ } })
        else fx.suck({ pos: q.pos, r }, F.nozzle, 'ground')
      }
      fx.update(dt)
    },
    // Wagen-Maßstab 0..1 aus den Kugeln; null = keine Fluff-Phase (Wirt nimmt dann den Zeitfortschritt)
    grow: () => (F.mode === 'build' ? Math.min(1, F.done / n) : F.mode === 'suck' ? Math.max(0, 1 - F.done / n) : null),
    stop() { F.mode = null; F.queue = [] },
    info: () => ({ mode: F.mode, done: F.done, n, build: fx.buildStats(), suck: fx.stats() }),
    dispose() { fx.dispose() },
  }
}
