// M1 · eigene Schleife (Canvas frameloop="never"): je fälligem Physik-Schritt genau ein R3F-advance() mit künstlicher Zeit (+1/60 s).
// Jeder advance() ruft alle useFrame-Handler einmal (dt = 1/60). Gezeichnet wird nur beim letzten fälligen Schritt eines Bildschirm-Bilds
// (M1Draw, useFrame mit Rang 1 übernimmt das Zeichnen) – sonst zeichnete ein langsames Bild bis zu viermal und hungerte andere Arbeit aus.
// Reihenfolge der Handler siehe M1World.jsx (Kopf).
import { useEffect } from 'react'
import { advance, useFrame } from '@react-three/fiber'
import { M1CLOCK, STEP, resetClock } from './m1Clock'

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
      for (let i = 0; i < n; i++) { M1CLOCK.t += STEP; M1CLOCK.draw = i === n - 1; const t0 = performance.now(); advance(M1CLOCK.t); const ms = performance.now() - t0; if (M1CLOCK.draw) { st.drawMs += ms; st.draws++ } else { st.stepMs += ms; st.steps++ } M1CLOCK.onStep?.() }
      raf = requestAnimationFrame(tick)
    }
    M1CLOCK.draw = true; advance(0) // erstes Bild sofort (Laden, Kamera)
    raf = requestAnimationFrame(tick)
    return () => { alive = false; cancelAnimationFrame(raf) }
  }, [])
  return <M1Draw />
}

// Zeichnen selbst (Rang 1: R3F zeichnet dann nicht mehr automatisch): nur beim letzten Schritt eines Bildschirm-Bilds
function M1Draw() {
  useFrame(({ gl, scene, camera }) => { if (M1CLOCK.draw) gl.render(scene, camera) }, 1)
  return null
}
