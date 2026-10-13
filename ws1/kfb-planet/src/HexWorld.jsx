// Hex-Insel mit Himmel, Wasser und Deck-Turm. Karten liegen als Querformat-Platten auf den Plattformen.
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { buildGround, buildPiecesGeometry } from './hex'
import { TOWER } from './scene'
import { playerState } from './world'
import { useGame } from './store'
import { deckColor } from './cards'

// --- Querformat-Kartenbild (Platzhalter, bis die echten Kartenbilder aus dem Card Viewer kommen) ---
function wrap(g, text, x, y, maxW, lh, maxLines) {
  const words = text.split(/\s+/); let line = '', n = 0
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (g.measureText(t).width > maxW && line) { g.fillText(line, x, y); y += lh; line = w; if (++n >= maxLines) return } else line = t
  }
  if (line) g.fillText(line, x, y)
}
export function cardTextureLandscape(card, open) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 360
  const g = c.getContext('2d'), col = deckColor(card.deck.id)
  g.fillStyle = '#fbf3e2'; g.fillRect(0, 0, 512, 360)
  g.fillStyle = col; g.fillRect(12, 12, 488, 336)
  if (!open) {
    g.fillStyle = '#2a2040'; g.fillRect(28, 28, 456, 304)
    g.fillStyle = col; g.font = 'bold 120px Nunito, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText('?', 256, 225)
    g.font = 'bold 20px Nunito, system-ui, sans-serif'; g.fillText(`#${card.num}`, 256, 300)
  } else {
    g.fillStyle = '#fbf3e2'; g.fillRect(28, 70, 456, 262)
    g.fillStyle = '#2a2040'; g.textAlign = 'left'
    g.font = 'bold 28px Nunito, system-ui, sans-serif'; wrap(g, card.name.toUpperCase(), 32, 52, 440, 30, 1)
    g.font = '19px Nunito, system-ui, sans-serif'; wrap(g, card.power, 44, 104, 424, 23, 5)
    g.font = 'italic 17px Nunito, system-ui, sans-serif'; g.fillStyle = '#5b4d74'; wrap(g, card.lore, 44, 236, 424, 21, 4)
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
  return t
}

function labelTexture(text, sub) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 160
  const g = c.getContext('2d')
  g.fillStyle = 'rgba(42,32,64,0.85)'; g.beginPath(); g.roundRect(8, 8, 496, 144, 36); g.fill()
  g.fillStyle = '#f0c84a'; g.font = 'bold 54px Nunito, system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(text, 256, 80)
  if (sub) { g.fillStyle = '#fbf3e2'; g.font = '26px Nunito, system-ui, sans-serif'; g.fillText(sub.slice(0, 40), 256, 126) }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Sky() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { top: { value: new THREE.Color('#6fb7f2') }, mid: { value: new THREE.Color('#bfe3f7') }, bottom: { value: new THREE.Color('#fbe6c4') } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.6, h)) : mix(mid, bottom, smoothstep(0.0, 0.25, -h)); gl_FragColor = vec4(c, 1.0); }',
  }), [])
  return <mesh material={mat} renderOrder={-1}><sphereGeometry args={[900, 32, 16]} /></mesh>
}

function Clouds() {
  const items = useMemo(() => Array.from({ length: 18 }, (_, i) => {
    const a = i * 2.39, r = 140 + (i * 53) % 160
    return { p: [Math.cos(a) * r, 55 + (i * 17) % 30, Math.sin(a) * r], s: 8 + (i * 7) % 10 }
  }), [])
  const ref = useRef()
  useFrame((st) => { if (ref.current) ref.current.rotation.y = st.clock.elapsedTime * 0.004 })
  return (
    <group ref={ref}>
      {items.map((c, i) => (
        <group key={i} position={c.p} scale={c.s}>
          {[[0, 0, 0, 1], [1.1, -0.2, 0.3, 0.75], [-1.0, -0.25, -0.2, 0.7]].map(([x, y, z, k], j) => (
            <mesh key={j} position={[x, y, z]} scale={[k * 1.3, k * 0.7, k]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#ffffff" roughness={1} flatShading /></mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function CardSlab({ piece, open }) {
  const tex = useMemo(() => cardTextureLandscape(piece.card, open), [piece.card, open])
  const ref = useRef(), born = useRef(open ? performance.now() : 0)
  useFrame(() => {
    if (!ref.current || !born.current) return
    const u = Math.min(1, (performance.now() - born.current) / 700)
    ref.current.rotation.z = (1 - u) * Math.PI * 2
    ref.current.position.y = piece.pos.y + 0.06 + Math.sin(u * Math.PI) * 1.2
  })
  return (
    <mesh ref={ref} position={[piece.pos.x, piece.pos.y + 0.06, piece.pos.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.7, 2.6]} />
      <meshStandardMaterial map={tex} roughness={0.85} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.15} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Billboard({ position, text, sub, scale = 1 }) {
  const tex = useMemo(() => labelTexture(text, sub), [text, sub])
  return <sprite position={position} scale={[6 * scale, 1.9 * scale, 1]}><spriteMaterial map={tex} depthWrite={false} /></sprite>
}

function Portal({ position }) {
  const ref = useRef()
  useFrame((st) => { if (ref.current) { ref.current.rotation.z = st.clock.elapsedTime * 0.8; ref.current.rotation.y = Math.sin(st.clock.elapsedTime * 0.5) * 0.3 } })
  return (
    <group position={position}>
      <mesh ref={ref}><torusGeometry args={[1.8, 0.28, 12, 40]} /><meshStandardMaterial color="#a77be0" emissive="#a77be0" emissiveIntensity={1.2} roughness={0.4} /></mesh>
      <pointLight color="#c9a4ff" intensity={20} distance={12} />
    </group>
  )
}

export default function HexWorld() {
  const ground = useMemo(() => buildGround(), [])
  const groundMat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }), [])
  const pieces = useMemo(() => buildPiecesGeometry(TOWER.pieces, deckColor(TOWER.deck.id)), [])
  const collected = useGame((s) => s.collected)
  const cardPieces = TOWER.pieces.filter((p) => p.kind === 'card')

  // Karte freispielen: auf der Plattform landen
  useFrame(() => {
    const s = useGame.getState(); if (s.mode !== 'play' || s.dialog || s.assisting) return
    const p = playerState.pos
    for (const c of cardPieces) {
      if (s.collected.includes(c.card.idx)) continue
      if (Math.hypot(c.pos.x - p.x, c.pos.z - p.z) < c.r && p.y - c.pos.y > 0.4 && p.y - c.pos.y < 2.5) {
        s.collect(c.card); s.flashStage()
        s.showToast(`SHOW IT · ${c.card.name} · Seite ${c.page + 1}`)
        s.playEmote('Cheer', 1200)
      }
    }
  })

  const pages = [0, 1, 2].map((pg) => cardPieces.find((c) => c.page === pg)).filter(Boolean)
  return (
    <>
      <Sky />
      <Clouds />
      <RigidBody type="fixed" colliders="trimesh"><mesh geometry={ground} material={groundMat} receiveShadow /></RigidBody>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[600, 64]} /><meshStandardMaterial color="#5fb3d6" transparent opacity={0.82} roughness={0.3} /></mesh>
      <RigidBody type="fixed" colliders="trimesh"><mesh geometry={pieces} material={groundMat} castShadow receiveShadow /></RigidBody>
      {cardPieces.map((c) => <CardSlab key={c.card.idx + (collected.includes(c.card.idx) ? 'o' : 'c')} piece={c} open={collected.includes(c.card.idx)} />)}
      {pages.map((c) => <Billboard key={c.page} position={[c.pos.x, c.pos.y + 4.2, c.pos.z]} text={`Seite ${c.page + 1}`} sub={TOWER.deck.title} scale={0.7} />)}
      <Billboard position={[TOWER.base.x, TOWER.base.y + 9, TOWER.base.z]} text="Deck-Turm" sub={TOWER.deck.title} scale={1.4} />
      <Portal position={TOWER.portal.toArray()} />
    </>
  )
}
