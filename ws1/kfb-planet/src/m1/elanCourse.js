// Elan S1 · Ringkurs (research/DRAGONRIDING_RESEARCH_R1.md §6.9, Datenformat-Vorschlag kfb.course/1) als reine Logik, ohne three/React:
// rings: [{ pos, radius, normal }] in Weltmetern; ein Ring zählt, wenn die Strecke eines Schritts seine Ebene in Normalenrichtung kreuzt und der
// Schnittpunkt innerhalb des Radius liegt. Zeit läuft vom ersten bis zum letzten Ring; nur der nächste Ring zählt (Reihenfolge).
export const COURSE_SCHEMA = 'kfb.course/1'

// 10 Ringe in einer Schleife um das Theater (J17-Meter, × J für wscale=legacy): Start vor der offenen Seite, dann im Uhrzeigersinn über den Hügelring,
// Höhen 10–26 m über dem Gelände, Abstände 30–45 m – Platz für Sturz und Abfangen (Faustregel §6.2: 60 m/s Abfangen ≈ 180 m Höhe im Tempo).
// scale (Elan S2, WS1-Entscheid 18.10.): Racer fliegen denselben Kurs, Ringabstände und Radien × Tempo-Verhältnis (RACER_COURSE_SCALE)
export const RACER_COURSE_SCALE = 1.4
export function makeCourse(groundAt, J = 1, scale = 1) {
  const spec = [[0, 34, 12], [32, 40, 18], [70, 52, 26], [110, 62, 14], [150, 58, 22], [190, 50, 10], [230, 60, 24], [270, 54, 16], [310, 44, 20], [350, 36, 12]]
  const pts = spec.map(([deg, r, h]) => { const a = (deg * Math.PI) / 180, x = Math.sin(a) * r * J * scale, z = Math.cos(a) * r * J * scale; return [x, groundAt(x, z) + h * J, z] })
  const rings = pts.map((p, i) => { const q = pts[(i + 1) % pts.length], d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], l = Math.hypot(...d) || 1
    return { pos: p, radius: 4.5 * J * scale, normal: d.map((x) => x / l) } })
  return { schema: COURSE_SCHEMA, rings, medals: { bronze: 'finish', silver: null, gold: null }, variant: 'normal' }
}

export function createRun(course) {
  return { course, next: 0, t: 0, started: false, done: false, best: null, last: null, passes: [] }
}
// je Schritt: a = Lage vorher, b = Lage nachher (Weltmeter), dt; gibt das Ereignis des Schritts zurück (null | { type: 'ring' | 'start' | 'finish', i, t })
export function stepRun(run, a, b, dt) {
  if (run.started && !run.done) run.t += dt
  if (run.done) return null
  const r = run.course.rings[run.next], n = r.normal, sa = (a[0] - r.pos[0]) * n[0] + (a[1] - r.pos[1]) * n[1] + (a[2] - r.pos[2]) * n[2], sb = (b[0] - r.pos[0]) * n[0] + (b[1] - r.pos[1]) * n[1] + (b[2] - r.pos[2]) * n[2]
  if (!(sa < 0 && sb >= 0)) return null
  const k = sa / (sa - sb), p = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
  if (Math.hypot(p[0] - r.pos[0], p[1] - r.pos[1], p[2] - r.pos[2]) > r.radius) return null
  const i = run.next; run.passes.push({ i, t: run.t }); run.next++
  if (i === 0) { run.started = true; run.t = 0; return { type: 'start', i, t: 0 } }
  if (run.next >= run.course.rings.length) { run.done = true; run.last = run.t; if (run.best == null || run.t < run.best) run.best = run.t; return { type: 'finish', i, t: run.t } }
  return { type: 'ring', i, t: run.t }
}
export const resetRun = (run) => Object.assign(run, { next: 0, t: 0, started: false, done: false, passes: [] })
