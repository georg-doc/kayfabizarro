// Host-Vertrag R3F R1 · Modul-Hülle
// Ein Modul ist: create(options) -> { object3d, update(dt, ctx), dispose() }
// Die Hülle erzeugt es genau einmal pro options-Objekt, hängt object3d ein,
// ruft update pro Frame und dispose beim Aushängen. Kein React im Modul.
import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { playerState } from './world'
import { useGame } from './store'
import { registerAnchor } from './bubbleAnchors'

export default function ModuleHost({ create, options }) {
  // options MUSS stabil sein (useMemo oder Konstante), sonst entsteht das Modul bei jedem Render neu.
  const mod = useMemo(() => create(options), [create, options])
  useEffect(() => {
    // Vertrag R1.2 §4: optionale Ankerpunkte für Sprechblasen; abgemeldet vor dispose()
    const offs = (mod.bubbleAnchors || []).map((a) => registerAnchor(a))
    return () => { offs.forEach((off) => off()); mod.dispose() }
  }, [mod])
  const camera = useThree((s) => s.camera)
  useFrame((_, dt) => {
    mod.update(Math.min(dt, 0.1), { camera, player: playerState.pos, game: useGame.getState() })
  })
  return <primitive object={mod.object3d} />
}
