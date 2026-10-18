// Fahrzeug-Rigging R1a (V-481) · Antriebs-Modul ohne Browser: Daten der 6 Racer (Georgs Auswahl) vollständig, Motormodell schaltet unter Vollgas hoch und
// mit dem Tempo zurück, Backfire beim Gaswegnehmen aus hoher Drehzahl, Schub folgt dem Gas (mit Schaltdelle), Fahne länger bei Vollgas und Boost,
// surge = erst stauchen, dann strecken (Volumen erhalten), Anker hängen unter der Streck-Gruppe, feste Draw-Call-Zahl.
import fs from 'fs'
import { report } from './_report.mjs'
import { createEngine, createVehicleRig } from '../../src/modules/vehicleRig.js'
const RIG = JSON.parse(fs.readFileSync('src/data/vehicles/kfb-vehicle-rig.r1.json', 'utf8'))
const SIX = ['rustwing_cruiser', 'graffiti_jet_cruiser', 'street_racer_hoverbeast', 'crimson_flame_dragster', 'crimson_thunderjet', 'ironclad_skycruiser']
const dataOk = SIX.every((id) => { const v = RIG.vehicles[id]; return v && v.anchors.length >= 1 && v.anchors.every((a) => a.pos.length === 3 && a.dir.length === 3 && a.radius > 0) && /^#[0-9a-f]{6}$/.test(v.glow.plume) && v.hover.length === 4 })
// Motor: Tempo-Rampe 0 → 1 unter Vollgas, dann Gas weg
const E = createEngine(); const gears = [], ev = []; for (let i = 0; i <= 600; i++) { const s = i / 600; ev.push(...E.step(1 / 60, { speed01: s, throttle: 1 })); gears.push(E.gear) }
const ups = ev.filter((e) => e.type === 'shift' && e.up).length, topGear = Math.max(...gears)
const bf = E.step(1 / 60, { speed01: 1, throttle: 0 }).some((e) => e.type === 'backfire')
const E2 = createEngine(); for (let i = 0; i < 300; i++) E2.step(1 / 60, { speed01: 0.95, throttle: 1 }); const g0 = E2.gear; let downs = 0; for (let i = 0; i < 600; i++) downs += E2.step(1 / 60, { speed01: 0.95 - (0.9 * i) / 600, throttle: 0.3 }).filter((e) => e.type === 'shift' && !e.up).length
// Rig: Dragster
const v = RIG.vehicles.crimson_flame_dragster, R = createVehicleRig({ anchors: v.anchors, glow: v.glow, unit: 0.58 })
const idle = (() => { for (let i = 0; i < 60; i++) R.update(1 / 60, { throttle: 0, speed01: 0 }); return R.info().thrust })()
const full = (() => { for (let i = 0; i < 90; i++) R.update(1 / 60, { throttle: 1, speed01: 0.3 }); return R.info().thrust })()
const plumeLen = () => { let L = 0; R.object3d.traverse((o) => { if (o.isMesh && o.material.uniforms?.uDiam) L = Math.max(L, o.scale.z) }); return L }
const lenFull = plumeLen(); for (let i = 0; i < 60; i++) R.update(1 / 60, { throttle: 1, speed01: 0.3, boost: true }); const lenBoost = plumeLen()
const R2 = createVehicleRig({ anchors: v.anchors, glow: v.glow, unit: 0.58 }); R2.surge(1); const zs = []; for (let i = 0; i < 60; i++) { R2.update(1 / 60, { throttle: 0.5, speed01: 0.3 }); zs.push(R2.stretch.scale.z) }
const vol = R2.stretch.scale.x * R2.stretch.scale.y * R2.stretch.scale.z
const minZ = Math.min(...zs.slice(0, 8)), maxZ = Math.max(...zs.slice(5, 40)), firstMin = zs.indexOf(minZ), firstMax = zs.indexOf(maxZ)
let under = true; R.object3d.traverse((o) => { if (/^anchor:/.test(o.name) && o.parent?.parent !== R.stretch) under = false })
// Bodennähe-Staub: tief + schnell → Partikel, hoch über Grund → keine, langsam → keine
const dustRun = (gy, speed) => { const D = createVehicleRig({ anchors: v.anchors, hover: v.hover, glow: v.glow, unit: 0.58 }); D.object3d.updateMatrixWorld(true); for (let i = 0; i < 90; i++) { D.object3d.updateMatrixWorld(true); D.update(1 / 60, { throttle: 1, speed01: speed, groundAt: () => gy }) } return D.info().dust }
const dustLow = dustRun(-0.2, 0.8), dustHigh = dustRun(-20, 0.8), dustSlow = dustRun(-0.2, 0.02)
const counts = Object.fromEntries(SIX.map((id) => [id, createVehicleRig({ anchors: RIG.vehicles[id].anchors, glow: RIG.vehicles[id].glow }).info().drawCalls]))
process.exit(report('unit-vehicleRig (R1a V-481)', {
  sixRacersData: dataOk,
  shiftsUpThroughGears: ups >= 3 && topGear === 5,
  backfireOnRelease: bf,
  shiftsDownWithSpeed: g0 >= 4 && downs >= 2,
  thrustFollowsThrottle: idle < 0.2 && full > 0.85,
  boostLongerPlume: lenBoost > lenFull * 1.2,
  surgeSquashThenStretch: minZ < 0.97 && maxZ > 1.04 && firstMin < firstMax,
  volumeKept: Math.abs(vol - 1) < 0.02,
  anchorsFollowStretch: under,
  dustNearGroundOnly: dustLow > 10 && dustHigh === 0 && dustSlow === 0,
  fixedDrawCalls: Object.entries(counts).every(([id, n]) => n === RIG.vehicles[id].anchors.reduce((s, a) => s + (a.type === 'fan' ? 1 : 2), 0) + 1),
}, { ups, topGear, g0, downs, idle, full, lenFull: +lenFull.toFixed(3), lenBoost: +lenBoost.toFixed(3), minZ: +minZ.toFixed(3), maxZ: +maxZ.toFixed(3), firstMin, firstMax, counts, dust: { dustLow, dustHigh, dustSlow } }))
