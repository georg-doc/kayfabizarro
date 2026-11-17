// KFB car port adapter: connects the reacting props (kfbtoys, kfbbend) to the racer's owner port (WSA, src/racer-host/carContactPort.js,
// handover CAR_TYPES_CLAUDE_DESIGN_2026-11-17). The owner publishes one frozen frame after its one physics step; this adapter turns it into
// the car the props understand, and hands hits back as requests { type, kind, speed, loss }. It never writes the car and never steps a world.
//   profiles: { [vehicleId]: kfb.car-contact-profile/1 }   hull: 'hull' (full visual box, the owner's advice for recipe hits) or 'physicsHull'
export function connectCar({ port, profiles, toys = null, bend = null, hull = 'hull', onFrame = null } = {}) {
  const stats = { frames: 0, reported: { toy: 0, gummi: 0 }, refused: 0, lossAsked: 0, unknownVehicle: 0 }, send = (ev) => { const r = port.report({ type: ev.type, kind: String(ev.kind), speed: ev.speed, loss: ev.loss }); if (r === false || r?.ok === false) stats.refused++; else { stats.reported[ev.type]++; stats.lossAsked += ev.loss } }
  const off = port.subscribe((f) => { const p = profiles[f.vehicleId]; if (!p) { stats.unknownVehicle++; return } stats.frames++
    const box = { c: p[hull].c, h: p[hull].h }, car = { x: f.x, y: f.y, z: f.z, yaw: f.yaw, vx: f.vx, vy: f.vy, vz: f.vz, box, weight01: p.weight01 }
    if (toys) for (const ev of toys.update(f.dt, { car })) send(ev)
    if (bend) { const fwd = f.vx * Math.sin(f.yaw) + f.vz * Math.cos(f.yaw), d = { x: f.x, y: f.y, z: f.z, yaw: f.yaw, speed: fwd, latV: f.latV, events: [] }   // the game's rubber module brakes the state it is given: it gets a copy, and the difference goes back as a request
      bend.car(d, f.dt, box); const lost = Math.max(0, Math.abs(fwd) - Math.abs(d.speed)); d.events.forEach((e, i) => send({ type: 'gummi', kind: e.kind, speed: e.speed, loss: i ? 0 : lost })); bend.tick(performance.now()) }
    onFrame?.(car, p) })
  return { off, stats }
}
