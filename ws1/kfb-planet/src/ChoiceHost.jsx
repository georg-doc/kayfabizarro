// S5c · Host-Seite der Spielerwahl: eine Choice-Ebene im Slot #ui-choice, Tasten über den Host-Router (Rang choice),
// Ergebnis als Ereignis in den Store; die Wahl wird zur Sprechblase der Spielfigur (Zuruf oder eigene Wörter).
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createChoiceLayer } from './choiceLayer'
import { anchorAt } from './bubbleAnchors'
import { useGame } from './store'
import { useHostKeys, PRIO } from './hostKeys'
import { zurufLine, playerLine } from './poolReader'
import { expose } from './debug'

export default function ChoiceHost() {
  const layer = useRef(null)
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    const L = createChoiceLayer({
      host: document.getElementById('ui-choice'),
      onChoice: (res) => {
        const s = useGame.getState()
        s.choose(res)
        const line = res.id === 'own' ? playerLine(res.text) : zurufLine(res.label)
        if (line) s.say('player', line)
      },
    })
    layer.current = L
    const screenOfPlayer = () => {
      const p = anchorAt('player', new THREE.Vector3()); if (!p) return null
      const a = p.project(camera); if (a.z > 1 || a.z < -1) return null
      return [(a.x * 0.5 + 0.5) * innerWidth, (-a.y * 0.5 + 0.5) * innerHeight]
    }
    const unsub = useGame.subscribe((s, prev) => {
      if (s.choice && s.choice !== prev.choice) L.open({ anchorXY: screenOfPlayer() })
      if (!s.choice && prev.choice && L.isOpen()) L.close()
    })
    expose('Choice', { open: () => useGame.getState().openChoice(), isOpen: () => L.isOpen(), last: () => useGame.getState().lastChoice })
    return () => { unsub(); L.dispose(); layer.current = null }
  }, [camera])
  useHostKeys((e) => { layer.current?.key(e) }, PRIO.choice)
  return null
}
