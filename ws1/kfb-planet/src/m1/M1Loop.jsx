// M1 · eigene Schleife (Canvas frameloop="never"): je fälligem Physik-Schritt genau ein R3F-advance() mit künstlicher Zeit (+1/60 s).
// Jeder advance() ruft alle useFrame-Handler einmal (dt = 1/60); gezeichnet wird dabei nicht (M1Draw belegt Rang 1 und merkt sich nur Renderer,
// Szene und Kamera). Gezeichnet wird genau einmal je Bildschirm-Bild, auch in Bildern ohne Schritt (120-Hz-Bildschirm), mit Bild-Interpolation
// zwischen den letzten zwei Schritten (m1Clock interpDraw, α = Rest des Akkumulators / Schritt; replay = 1, replay=120 = Phase im Doppelbild).
// Reihenfolge der Handler siehe M1World.jsx (Kopf).
import { useEffect } from 'react'
import { advance, useFrame } from '@react-three/fiber'
import { M1CLOCK, STEP, resetClock, M1INTERP, interpAfterStep, interpDraw } from './m1Clock'

const R = { gl: null, scene: null, camera: null }

export default function M1Loop() {
  useEffect(() => {
    resetClock()
    let raf = 0, last = performance.now(), acc = 0, alive = true
    const tick = (now) => {
      if (!alive) return
      M1CLOCK.frame++
      let n
      if (M1CLOCK.replay) n = M1CLOCK.frame % M1CLOCK.framesPerStep ? 0 : M1CLOCK.stepsPerFrame
      else { acc = Math.min(acc + Math.min((now - last) / 1000, 0.25), 4 * STEP); n = Math.floor(acc / STEP + 1e-6); acc -= n * STEP }
      last = now
      const st = M1CLOCK.stats; if (n > 1) st.multi++
      for (let i = 0; i < n; i++) { M1CLOCK.t += STEP; M1CLOCK.draw = false; const t0 = performance.now(); advance(M1CLOCK.t); interpAfterStep(); st.stepMs += performance.now() - t0; st.steps++; M1CLOCK.onStep?.() }
      const alpha = M1CLOCK.replay ? (M1CLOCK.framesPerStep > 1 ? (M1CLOCK.frame % M1CLOCK.framesPerStep) / M1CLOCK.framesPerStep : 1) : Math.min(1, acc / STEP)
      if (R.gl) { const t0 = performance.now(); M1CLOCK.draw = true; interpDraw(alpha, () => { M1CLOCK.onDraw?.(alpha); R.gl.render(R.scene, R.camera) }); st.drawMs += performance.now() - t0; st.draws++ }
      raf = requestAnimationFrame(tick)
    }
    advance(0); interpAfterStep(); if (R.gl) R.gl.render(R.scene, R.camera) // erstes Bild sofort (Laden, Kamera)
    raf = requestAnimationFrame(tick)
    return () => { alive = false; cancelAnimationFrame(raf) }
  }, [])
  return <M1Draw />
}

// Rang 1: R3F zeichnet dann nicht mehr selbst. Merkt sich Renderer, Szene und Kamera fürs Zeichnen je Bildschirm-Bild (M1Loop) und meldet die
// Kamera für die Bild-Interpolation an.
function M1Draw() {
  useFrame(({ gl, scene, camera }) => { R.gl = gl; R.scene = scene; R.camera = camera; M1INTERP.camera = camera }, 1)
  useEffect(() => () => { R.gl = null; M1INTERP.camera = null }, [])
  return null
}
