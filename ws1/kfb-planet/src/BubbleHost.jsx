// S5a · Host-Seite der Sprechblasen: eine Blasen-Ebene im Slot #ui-bubbles, pro Frame Anker projizieren (ohne
// React-State), Text kommt als Ereignis aus dem Store (`speech`). Welche Texte erlaubt sind, regelt S5b (Vertrag §5).
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createBubbleLayer } from './bubbleLayer'
import { anchorAt, anchorIds, registerAnchor } from './bubbleAnchors'
import { playerState } from './world'
import { useGame } from './store'
import { DEBUG, expose } from './debug'
import { isIssuedLine, SILENCE } from './dialogText'
import { testLine, zurufLine } from './poolReader'
import { CHAT_SYL, speak, speakerOf } from './audio/kfbAudio.js' // WS-Audio Chatter-Silben R1: jede Sprech-Blase mit Laut (nur #chat=syl)

// Kopf-Oberkante der Spielfigur: playerState.pos ist die Körpermitte; +1,05 m liegt knapp über dem Kopf (gemessen am Bildschirm)
const PLAYER_ANCHOR = { id: 'player', position: playerState.pos, offset: [0, 1.05, 0] }

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
    // Vertrag §5: nur Zeilen aus dem Pool-Leser (POOL, CARD, SILENCE; TEST nur mit Debug-Schalter). Alles andere -> „…“
    const unsub = useGame.subscribe((s, prev) => {
      if (!s.speech || s.speech === prev.speech) return
      const { anchor, line, kind, color } = s.speech
      const ok = isIssuedLine(line) && (line.source !== 'TEST' || DEBUG) && (!line.speaker || line.speaker === anchor)
      if (!ok) { console.warn('[bubble] Zeile ohne geprüfte Quelle verworfen'); L.show(anchor, [SILENCE], 'thought', color); return }
      L.show(anchor, line.parts, line.source === 'SILENCE' ? 'thought' : kind, color)
      if (CHAT_SYL) { const sp = speakerOf(anchor), p = anchorAt(anchor, new THREE.Vector3()); speak({ text: line.parts.join(' '), characterId: sp.characterId, group: sp.group, pos: p ? { x: p.x, y: p.y, z: p.z } : null, kind: line.source === 'ZURUF' ? 'call' : 'line' }) } // WS-Audio: Laut zur Blase (doppelt gerufen = einmal)
    })
    const test = { set: new Map() }
    expose('Bubbles', () => L.list())
    expose('BubbleRenders', () => renders.current)
    expose('SayTest', (anchor, parts, kind, color) => useGame.getState().say(anchor, testLine(parts), kind, color))
    expose('SayZuruf', (anchor, label) => useGame.getState().say(anchor, zurufLine(label)))
    expose('SayForged', (anchor, text) => useGame.getState().say(anchor, { text, parts: [text], source: 'POOL' }))
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
