// S5a · Host-Seite der Sprechblasen: eine Blasen-Ebene im Slot #ui-bubbles, pro Frame Anker projizieren (ohne
// React-State), Text kommt als Ereignis aus dem Store (`speech`). Welche Texte erlaubt sind, regelt S5b (Vertrag §5).
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createBubbleLayer } from './bubbleLayer'
import { anchorAt, anchorIds, registerAnchor } from './bubbleAnchors'
import { playerState } from './world'
import { useGame } from './store'
import { expose } from './debug'

const PLAYER_ANCHOR = { id: 'player', position: playerState.pos, offset: [0, 2.0, 0] }

export default function BubbleHost() {
  const layer = useRef(null)
  const camera = useThree((s) => s.camera)
  const renders = useRef(0)
  renders.current++
  useEffect(() => {
    const L = createBubbleLayer({ host: document.getElementById('ui-bubbles') })
    layer.current = L
    const offPlayer = registerAnchor(PLAYER_ANCHOR)
    // Ereignis aus dem Store -> Blase (kein Re-Render der Komponente)
    const unsub = useGame.subscribe((s, prev) => { if (s.speech && s.speech !== prev.speech) L.show(s.speech.anchor, s.speech.parts, s.speech.kind, s.speech.color) })
    const test = { set: new Map() }
    expose('Bubbles', () => L.list())
    expose('BubbleRenders', () => renders.current)
    expose('Anchors', {
      ids: anchorIds,
      // Debug: Testanker an fester Weltposition bzw. relativ zur Kamera (vorwärts, rechts, hoch)
      at: (id, xyz) => { test.set.get(id)?.(); test.set.set(id, registerAnchor({ id, position: new THREE.Vector3(...xyz) })) },
      ahead: (id, f, r = 0, u = 0) => { const d = new THREE.Vector3(); camera.getWorldDirection(d); const right = new THREE.Vector3().crossVectors(d, camera.up).normalize(); const p = camera.position.clone().addScaledVector(d, f).addScaledVector(right, r).addScaledVector(camera.up, u); test.set.get(id)?.(); test.set.set(id, registerAnchor({ id, position: p })) },
    })
    return () => { unsub(); offPlayer(); for (const off of test.set.values()) off(); L.dispose(); layer.current = null }
  }, [camera])
  useFrame((_, dt) => { layer.current?.update(Math.min(dt, 0.1), camera, anchorAt) })
  return null
}
