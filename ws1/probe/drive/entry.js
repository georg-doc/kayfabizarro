// KFB-Fahrphysik aus dem Spiel (unverändert gebündelt): k2t (M2/M3 inkl. Drift Q/E, Boost, Sprung, Hang, Landung) + Racer-Flug (Elan S2)
export * from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/src/m2/k2t.js'
export { RFLY, createRacerFlight, racerTakeoff, racerLand, racerFlightStep, racerAfterK2t, racerDrive } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/src/m2/racerFlight.js'
export { K, G, JUMP_K } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/src/m1/m1Scale.js'
export { M_PER_RIG, CLASS_K, WORLD_K } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/src/worldScale.js'
export { createFollowCam, FOLLOW, smoothDamp } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/src/camera/followCam.js'
