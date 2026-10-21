// M1 · eigene Schleife (Canvas frameloop="never"): je fälligem Physik-Schritt genau ein R3F-advance() mit künstlicher Zeit (+1/60 s).
// Jeder advance() ruft alle useFrame-Handler einmal (dt = 1/60); gezeichnet wird dabei nicht (M1Draw belegt Rang 1 und merkt sich nur Renderer,
// Szene und Kamera). Gezeichnet wird genau einmal je Bildschirm-Bild, auch in Bildern ohne Schritt (120-Hz-Bildschirm), mit Bild-Interpolation
// zwischen den letzten zwei Schritten (m1Clock interpDraw, α = Rest des Akkumulators / Schritt; replay = 1, replay=120 = Phase im Doppelbild).
// Reihenfolge der Handler siehe M1World.jsx (Kopf).
import { useEffect } from 'react'
import { advance, useFrame } from '@react-three/fiber'
import { M1CLOCK, STEP, resetClock, M1INTERP, interpAfterStep, interpDraw } from './m1Clock'

const R = { gl: null, scene: null, camera: null }
// höchstens so viele Schritte je Bild (M3 Stufe A, V-379: ≤ 8); der Rest wird verworfen (Spiel läuft unter 7,5 fps langsamer statt zu springen)
const MAX_STEPS = 8

export default function M1Loop() {
  useEffect(() => {
    resetClock()
    let raf = 0, last = performance.now(), acc = 0, alive = true
    // M3 Stufe A (V-379): versteckter Tab = Physik pausiert, Zeit-Ansammlung 0 – beim Zurückkehren wird nichts nachgeholt
    const vis = () => { acc = 0; last = performance.now(); M1CLOCK.hidden = document.hidden }
    document.addEventListener('visibilitychange', vis)
    const tick = (now) => {
      if (!alive) return
      if (M1CLOCK.half && (M1CLOCK.rawFrame = (M1CLOCK.rawFrame || 0) + 1) % 2) { raf = requestAnimationFrame(tick); return } // fps=30: jedes zweite Bild auslassen
      M1CLOCK.frame++
      let n
      if (M1CLOCK.replay) n = M1CLOCK.frame % M1CLOCK.framesPerStep ? 0 : M1CLOCK.stepsPerFrame
      else if (M1CLOCK.hidden) n = 0
      else { const a = acc + Math.min((now - last) / 1000, 0.25); acc = Math.min(a, MAX_STEPS * STEP); if (a > acc) M1CLOCK.stats.dropped++; n = Math.floor(acc / STEP + 1e-6); acc -= n * STEP }
      last = now
      const st = M1CLOCK.stats; if (n > 1) st.multi++
      for (let i = 0; i < n; i++) { M1CLOCK.t += STEP; M1CLOCK.draw = false; const t0 = performance.now(); advance(M1CLOCK.t); interpAfterStep(); st.stepMs += performance.now() - t0; st.steps++; M1CLOCK.onStep?.() }
      M1CLOCK.frameDt = M1CLOCK.replay ? STEP * M1CLOCK.stepsPerFrame / M1CLOCK.framesPerStep : Math.min(0.1, Math.max(0, (now - (M1CLOCK.lastDraw ?? now)) / 1000)); M1CLOCK.lastDraw = now // Bildzeit für die Kamera im Bildtakt
      const alpha = M1CLOCK.replay ? (M1CLOCK.framesPerStep > 1 ? (M1CLOCK.frame % M1CLOCK.framesPerStep) / M1CLOCK.framesPerStep : 1) : Math.min(1, acc / STEP)
      if (R.gl && !(M1CLOCK.nodraw && M1CLOCK.frame > 30)) { const t0 = performance.now(); M1CLOCK.draw = true; interpDraw(alpha, () => { M1CLOCK.onDraw?.(alpha); if (!M1CLOCK.norender) R.gl.render(R.scene, R.camera) }); st.drawMs += performance.now() - t0; st.draws++ }
      raf = requestAnimationFrame(tick)
    }
    advance(0); interpAfterStep(); if (R.gl) R.gl.render(R.scene, R.camera) // erstes Bild sofort (Laden, Kamera)
    raf = requestAnimationFrame(tick)
    return () => { alive = false; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', vis) }
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
