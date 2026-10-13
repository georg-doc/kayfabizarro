// Karten als Wesen auf den Planeten: Aufsteller, die sich drehen; Nähe wird an den Store gemeldet
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from './store'
import { PLANETS, placeOnSurface, rng, playerState, stagePosition } from './world'
import { deckColor } from './cards'

function wrap(ctx, text, x, y, maxW, lh, maxLines) {
  const words = text.split(/\s+/); let line = ''; let n = 0
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; if (++n >= maxLines - 1) break } else line = t
  }
  if (line) ctx.fillText(n >= maxLines - 1 && words.length ? line + '…' : line, x, y)
}

export function cardTexture(card) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 360
  const g = c.getContext('2d')
  g.fillStyle = '#fbf3e2'; g.fillRect(0, 0, 256, 360)
  g.fillStyle = deckColor(card.deck.id); g.fillRect(10, 10, 236, 340)
  g.fillStyle = '#fbf3e2'; g.fillRect(20, 92, 216, 248)
  g.fillStyle = '#2a2040'; g.textAlign = 'center'
  g.font = 'bold 22px Nunito, system-ui, sans-serif'; wrap(g, card.name.toUpperCase(), 128, 42, 220, 24, 2)
  g.font = '15px Nunito, system-ui, sans-serif'; g.textAlign = 'left'
  wrap(g, card.power, 30, 118, 196, 18, 6)
  g.font = 'italic 14px Nunito, system-ui, sans-serif'; g.fillStyle = '#5b4d74'
  wrap(g, card.lore, 30, 238, 196, 17, 5)
  g.font = '11px Nunito, system-ui, sans-serif'; g.fillStyle = '#2a2040'; g.textAlign = 'center'
  wrap(g, card.deck.title, 128, 352, 230, 12, 1)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
  return t
}

function Being({ card, transform, i }) {
  const ref = useRef()
  const tex = useMemo(() => cardTexture(card), [card])
  useFrame((st) => { if (ref.current) { ref.current.rotation.y = st.clock.elapsedTime * 0.6 + i; ref.current.position.y = 1.4 + Math.sin(st.clock.elapsedTime * 1.6 + i) * 0.12 } })
  return (
    <group position={transform.position} quaternion={transform.quaternion}>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.45, 0.55, 0.3, 20]} /><meshStandardMaterial color={deckColor(card.deck.id)} roughness={0.9} /></mesh>
      <group ref={ref}>
        <mesh castShadow><planeGeometry args={[1.25, 1.75]} /><meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.85} emissive="#ffffff" emissiveIntensity={0.08} emissiveMap={tex} /></mesh>
      </group>
    </group>
  )
}

export default function CardBeings() {
  const planetCards = useGame((s) => s.planetCards)
  const collected = useGame((s) => s.collected)
  const placed = useMemo(() => {
    const out = []
    for (const p of PLANETS) {
      const r = rng(p.seed * 13 + 5)
      const list = planetCards[p.id].cards
      list.forEach((card, k) => {
        let d
        if (p.id === 'prison' && k < 3) {
          // im Labyrinth verstecken
          const a = r() * Math.PI * 2, ang = 0.25 + r() * 0.5
          d = new THREE.Vector3(Math.sin(ang) * Math.cos(a), Math.cos(ang), Math.sin(ang) * Math.sin(a))
        } else {
          do { d = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1) } while (d.lengthSq() > 1 || d.lengthSq() < 0.05)
          d.normalize()
          if (p.id === 'home' && d.angleTo(new THREE.Vector3(0, 1, 0)) < 0.5) d.y = -Math.abs(d.y) // Start/Bühne frei halten
          if (p.id === 'prison' && d.angleTo(new THREE.Vector3(0, 1, 0)) < 1.4) d.y = -Math.abs(d.y)
          d.normalize()
        }
        const tr = placeOnSurface(p, d, 0, 0)
        out.push({ card, transform: tr, pos: tr.position.clone().addScaledVector(d, 1.2) })
      })
    }
    return out
  }, [planetCards])
  const stage = useMemo(() => stagePosition(), [])
  if (typeof window !== 'undefined') window.__kfbBeings = placed.map((b) => ({ idx: b.card.idx, name: b.card.name, pos: b.pos.toArray() }))

  useFrame(() => {
    const s = useGame.getState()
    if (s.mode !== 'play' || s.dialog) return
    const pp = playerState.pos
    let best = null, bestD = 2.8
    for (const b of placed) {
      if (s.collected.includes(b.card.idx)) continue
      const d = b.pos.distanceTo(pp); if (d < bestD) { bestD = d; best = b }
    }
    if (best) s.setNear({ type: 'card', card: best.card })
    else if (stage.distanceTo(pp) < 3.6) s.setNear({ type: 'stage' })
    else s.setNear(null)
  })

  return placed.filter((b) => !collected.includes(b.card.idx)).map((b, i) => <Being key={b.card.idx} card={b.card} transform={b.transform} i={i} />)
}
