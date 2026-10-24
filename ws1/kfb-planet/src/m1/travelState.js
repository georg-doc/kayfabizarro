// S1 Fortbewegung (V-746) · EINE Zustandsmaschine für alle Reise-Zustände: zu Fuß, Auto rufen, Einsteigen, Fahren, Aussteigen, Verschwinden,
// Flug Figur (flight=elan) und Flug Racer (fly). Rein, ohne React und ohne three.js: send(ereignis) und update(dt) liefern Aufträge (effects) an
// den Wirt, der Wirt führt sie aus (M2Car ein- und aushängen, Figur einfrieren, Kamera abgeben, Clips, kfb-fluff-suck build/suck).
// Ablauf Auto (WoW-Reittier): Klick aufs Fahrzeug-Symbol → summon (Wagen entsteht, Richtung build) → enter (Hineinhüpfen, J-7 Clip 1,2 s)
// → drive → Klick → exit (Heraushüpfen, J-7 Clip 1,0 s) → vanish (Einsaugen, Richtung suck) → foot. Flug Racer: drive ↔ flyRacer (Rampe /
// zweimal Leertaste, Landen zurück auf K2B). Flug Figur: foot ↔ flyFigure. Zeiten sind Vorgaben; der Wirt kann sie je Fahrzeug überschreiben.
export const TRAVEL = Object.freeze({ summon: 1.4, enter: 1.2, exit: 1.0, vanish: 1.4 })
export const STATES = Object.freeze(['foot', 'summon', 'enter', 'drive', 'exit', 'vanish', 'flyFigure', 'flyRacer'])
const TIMED = { summon: 'enter', enter: 'drive', exit: 'vanish', vanish: 'foot' }

export function createTravelState({ durations = {}, vehicle = null } = {}) {
  const D = { ...TRAVEL, ...durations }
  let state = 'foot', t = 0, car = null, pendingExit = false, n = 0
  const log = []
  // Eintritt in einen Zustand: Aufträge an den Wirt
  const enter = (s, out) => {
    const from = state; state = s; t = 0; n++; log.push({ from, to: s }); if (log.length > 32) log.shift()
    if (s === 'summon') out.push({ type: 'car', on: true, vehicle: car }, { type: 'fx', dir: 'build', dur: D.summon })
    if (s === 'enter') out.push({ type: 'player', freeze: true }, { type: 'clip', name: 'enter', dur: D.enter })
    if (s === 'drive') out.push({ type: 'camera', to: 'car' }, { type: 'control', to: 'car' }, { type: 'clip', name: 'drive', loop: true })
    if (s === 'exit') out.push({ type: 'control', to: 'none' }, { type: 'clip', name: 'exit', dur: D.exit })
    if (s === 'vanish') out.push({ type: 'player', freeze: false }, { type: 'camera', to: 'player' }, { type: 'control', to: 'player' }, { type: 'fx', dir: 'suck', dur: D.vanish })
    if (s === 'foot' && from === 'vanish') { out.push({ type: 'car', on: false, vehicle: car }); car = null }
    if (s === 'flyFigure') out.push({ type: 'fly', who: 'figure', on: true })
    if (s === 'foot' && from === 'flyFigure') out.push({ type: 'fly', who: 'figure', on: false })
    if (s === 'flyRacer') out.push({ type: 'fly', who: 'racer', on: true })
    if (s === 'drive' && from === 'flyRacer') out.push({ type: 'fly', who: 'racer', on: false })
    out.push({ type: 'state', from, to: s })
    return out
  }
  // Ereignisse: click (Fahrzeug-Symbol, ctx.canSummon = Figur steht auf festem Boden), takeoff/land (Racer-Flug), flyStart/flyEnd (Figur-Flug)
  const send = (type, ctx = {}) => {
    const out = []
    if (type === 'click') {
      if (state === 'foot' && ctx.canSummon !== false) { car = ctx.vehicle ?? vehicle; return enter('summon', out) }
      if (state === 'summon') return enter('vanish', out)                 // Rufen abbrechen: Wagen wird wieder eingesaugt (Figur war nie drin)
      if (state === 'enter') { pendingExit = true; return out }          // Hineinhüpfen läuft zu Ende, dann gleich wieder aussteigen
      if (state === 'drive') return enter('exit', out)
      return out                                                          // exit/vanish laufen schon; im Flug erst landen
    }
    if (type === 'takeoff' && state === 'drive') return enter('flyRacer', out)
    if (type === 'land' && state === 'flyRacer') return enter('drive', out)
    if (type === 'flyStart' && state === 'foot') return enter('flyFigure', out)
    if (type === 'flyEnd' && state === 'flyFigure') return enter('foot', out)
    return out
  }
  const update = (dt) => {
    const out = []
    if (!TIMED[state]) return out
    t += Math.max(0, dt)
    // mehrere Übergänge in einem großen Schritt (Ruckler, Tab im Hintergrund) nacheinander abarbeiten, Restzeit mitnehmen
    for (let guard = 0; TIMED[state] && t >= D[state] && guard < 8; guard++) {
      const rest = t - D[state]; enter(TIMED[state], out); t = rest
      if (state === 'drive' && pendingExit) { pendingExit = false; enter('exit', out); t = rest }
    }
    return out
  }
  return {
    send, update,
    get state() { return state },
    get vehicle() { return car },
    progress: () => (TIMED[state] ? Math.min(1, t / D[state]) : 1),   // 0..1 im laufenden Übergang (für build/suck-Fortschritt, Clip-Zeit)
    busy: () => !!TIMED[state],
    snapshot: () => ({ state, t: +t.toFixed(3), vehicle: car, pendingExit, transitions: n, log: log.slice(-8) }),
  }
}
