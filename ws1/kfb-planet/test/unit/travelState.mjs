// S1 Fortbewegung (V-746) · Zustandsmaschine ohne Browser: Auto rufen → Einsteigen → Fahren → Aussteigen → Verschwinden → zu Fuß, Rufen abbrechen,
// Klick beim Hineinhüpfen, Racer-Flug nur aus der Fahrt, Figur-Flug nur zu Fuß, großer Zeitschritt, Aufträge an den Wirt vollständig und paarig.
import { report } from './_report.mjs'
import { createTravelState, TRAVEL, STATES } from '../../src/m1/travelState.js'
const run = (T, sec, dt = 1 / 60) => { const out = []; for (let i = 0; i < Math.round(sec / dt); i++) out.push(...T.update(dt)); return out }
const types = (fx) => fx.map((e) => e.type + (e.dir ? ':' + e.dir : '') + (e.name ? ':' + e.name : '') + (e.on != null ? ':' + e.on : '') + (e.to ? ':' + e.to : '') + (e.freeze != null ? ':' + e.freeze : ''))

// 1 voller Ablauf
const T = createTravelState({ vehicle: 'crimson_flame_dragster' }), fx = []
fx.push(...T.send('click', { canSummon: true })); const s1 = T.state
fx.push(...run(T, TRAVEL.summon + 0.02)); const s2 = T.state
fx.push(...run(T, TRAVEL.enter + 0.02)); const s3 = T.state
fx.push(...T.send('click')); const s4 = T.state
fx.push(...run(T, TRAVEL.exit + 0.02)); const s5 = T.state
fx.push(...run(T, TRAVEL.vanish + 0.02)); const s6 = T.state
const seq = fx.filter((e) => e.type === 'state').map((e) => e.to)
const ft = types(fx), carOn = fx.filter((e) => e.type === 'car' && e.on), carOff = fx.filter((e) => e.type === 'car' && !e.on)

// 2 Rufen abbrechen (zweiter Klick während der Wagen entsteht): Wagen wird eingesaugt, Figur nie eingefroren
const A = createTravelState({ vehicle: 'x' }), fa = [...A.send('click'), ...run(A, 0.5), ...A.send('click')], aState = A.state; fa.push(...run(A, TRAVEL.vanish + 0.02))
const abortOk = aState === 'vanish' && A.state === 'foot' && !fa.some((e) => e.type === 'player' && e.freeze) && fa.filter((e) => e.type === 'car').length === 2

// 3 Klick beim Hineinhüpfen: läuft zu Ende, dann gleich Aussteigen
const B = createTravelState({ vehicle: 'x' }); B.send('click'); run(B, TRAVEL.summon + 0.02); B.send('click'); const bWait = B.state; const fb = run(B, TRAVEL.enter + 0.02)
const pendingOk = bWait === 'enter' && B.state === 'exit' && fb.filter((e) => e.type === 'state').map((e) => e.to).join() === 'drive,exit'

// 4 Flüge: Racer nur aus der Fahrt, Figur nur zu Fuß; Klick im Flug wirkt nicht
const C = createTravelState({ vehicle: 'x' }); const noRacerFly = C.send('takeoff').length === 0 && C.state === 'foot'
C.send('flyStart'); const figFly = C.state === 'flyFigure'; const clickInFly = C.send('click').length === 0 && C.state === 'flyFigure'; C.send('flyEnd'); const backFoot = C.state === 'foot'
C.send('click'); run(C, TRAVEL.summon + TRAVEL.enter + 0.05); const fr = [...C.send('takeoff')]; const racerFly = C.state === 'flyRacer'; const noFigFly = C.send('flyStart').length === 0
fr.push(...C.send('land')); const landed = C.state === 'drive'; const flyPairs = fr.filter((e) => e.type === 'fly').map((e) => e.on).join() === 'true,false'

// 5 großer Zeitschritt (Tab im Hintergrund): alle fälligen Übergänge in einem update
const G = createTravelState({ vehicle: 'x' }); G.send('click'); const fg = G.update(10); const bigStep = G.state === 'drive' && fg.filter((e) => e.type === 'state').length === 2

// 6 kein Rufen ohne festen Boden; eigene Zeiten
const W = createTravelState(); const noGround = W.send('click', { canSummon: false }).length === 0 && W.state === 'foot'
const K = createTravelState({ durations: { summon: 0.2 } }); K.send('click'); run(K, 0.25); const custom = K.state === 'enter'
const P = createTravelState(); P.send('click'); run(P, TRAVEL.summon / 2); const prog = Math.abs(P.progress() - 0.5) < 0.02 && P.busy()

process.exit(report('travelState', {
  fullCycle: [s1, s2, s3, s4, s5, s6].join() === 'summon,enter,drive,exit,vanish,foot' && seq.join() === 'summon,enter,drive,exit,vanish,foot',
  carMountedOnceUnmountedOnce: carOn.length === 1 && carOff.length === 1 && carOn[0].vehicle === 'crimson_flame_dragster' && T.vehicle === null,
  fxBuildThenSuck: ft.indexOf('fx:build') >= 0 && ft.indexOf('fx:suck') > ft.indexOf('fx:build'),
  playerFrozenWhileInCar: ft.indexOf('player:true') < ft.indexOf('camera:car') && ft.indexOf('player:false') > ft.indexOf('clip:exit'),
  controlHandover: ft.includes('control:car') && ft.indexOf('control:player') > ft.indexOf('control:car'),
  clips: ['clip:enter', 'clip:drive', 'clip:exit'].every((c) => ft.includes(c)),
  abortSummon: abortOk, clickDuringEnter: pendingOk,
  racerFlyOnlyFromDrive: noRacerFly && racerFly && landed && flyPairs, figureFlyOnlyOnFoot: figFly && clickInFly && backFoot && noFigFly,
  bigStep, noSummonWithoutGround: noGround, customDurations: custom, progress: prog,
  statesKnown: STATES.length === 8 && [...new Set(seq)].every((s) => STATES.includes(s)),
}, { seq, snapshot: T.snapshot() }))
