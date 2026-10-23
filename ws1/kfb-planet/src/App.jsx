import { Suspense } from 'react'
import { m1Dpr } from './start/quality.js' // MVP-Startseite: Qualitätsstufe (Standard = bisher [1, 1,25])
import QualityDpr from './start/QualityDpr.jsx'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Stars } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Planets from './Planets'
import Player, { GravitySetup } from './Player'
import Editor from './Editor'
import Hud from './Hud'
import Dialog from './Dialog'
import CardBeings from './CardBeings'
import StageShow from './StageShow'
import HexWorld from './HexWorld'
import { SCENE } from './scene'
import ModuleHost from './ModuleHost'
import BubbleHost from './BubbleHost'
import ChoiceHost from './ChoiceHost'
import EyeTest from './EyeTest'
import ActorTest from './ActorTest'
import StageTest from './StageTest'
import Stage from './Stage'
import M1World from './m1/M1World'
import { MOVE_MAP } from './hostKeys'
import { createProbe } from './probeModule'
import { useState, useEffect } from 'react'
const PROBE_OPTS = { pos: [0, 6, 0] }
function HostTest() {
  const [on, setOn] = useState(true)
  const [, force] = useState(0)
  useEffect(() => { window.__kfbHostTest = { off: () => setOn(false), rerender: () => force((n) => n + 1) } }, [])
  return on ? <ModuleHost create={createProbe} options={PROBE_OPTS} /> : null
}


export default function App() {
  const debug = typeof location !== 'undefined' && location.hash.includes('debug')
  const m1 = typeof location !== 'undefined' && /#m1(,|$)/.test(location.hash) // M1 Bewegung mit FrizzleBob v5b (offene Welt, Amphitheater), im selben Canvas
  const stage = typeof location !== 'undefined' && /#stage(,|$)/.test(location.hash) // Amphitheater-Bühne (G4-Vorbereitung), im selben Canvas
  const stagetest = typeof location !== 'undefined' && location.hash.includes('stagetest') // B1-Prüfszene: Billboard + zwei Darsteller, im selben Canvas
  const actortest = m1 || stage || stagetest || (typeof location !== 'undefined' && location.hash.includes('actortest')) // Darsteller-Slot-Prüfszene (ToolBox-Licht), im selben Canvas
  const eyetest = actortest || (typeof location !== 'undefined' && location.hash.includes('eyetest')) // F1-Prüfszene: Studio-Bühne statt Welt, im selben Canvas
  return (
    <>
      <KeyboardControls map={MOVE_MAP}>
        <Canvas frameloop={m1 ? 'never' : 'always'} shadows dpr={m1 ? m1Dpr() : eyetest ? 1 : [1, 1.75]} flat={actortest} gl={eyetest && !actortest ? { toneMappingExposure: 1.05 } : /(^|[#,])outline=1(,|$)/.test(location.hash) ? { stencil: true } : undefined /* outline=1: Stencil-Puffer für den Figuren-Umriss (three ≥ r163 ohne Stencil) */} camera={{ fov: 55, near: 0.1, far: 2000, position: [0, 30, 12] }}>
          {m1 && <QualityDpr />}
          {m1 ? <Suspense fallback={null}><M1World /></Suspense> : stage ? <Suspense fallback={null}><Stage /></Suspense> : stagetest ? <Suspense fallback={null}><StageTest /></Suspense> : actortest ? <Suspense fallback={null}><ActorTest /></Suspense> : eyetest ? <Suspense fallback={null}><EyeTest /></Suspense> : <>
          {SCENE === 'planets' ? <>
            <color attach="background" args={['#1b1633']} />
            <fog attach="fog" args={['#1b1633', 90, 260]} />
            <Stars radius={300} depth={60} count={2500} factor={6} fade speed={0.5} />
            <hemisphereLight args={['#fff1d6', '#3a2d5c', 1.1]} />
            <ambientLight intensity={0.35} />
          </> : <>
            <color attach="background" args={['#bfe3f7']} />
            <fog attach="fog" args={['#cfe8f5', 120, 520]} />
            <hemisphereLight args={['#dff1ff', '#8a7a5c', 1.25]} />
            <ambientLight intensity={0.25} />
          </>}
          <directionalLight position={[60, 90, 40]} intensity={2.2} color="#fff4e0" />
          <Suspense fallback={null}>
            <Physics gravity={[0, 0, 0]} debug={debug} timeStep={1 / 60}>
              <GravitySetup />
              {SCENE === 'planets' ? <><Planets /><Editor /><CardBeings /></> : <HexWorld />}
              {location.hash.includes('hosttest') && <HostTest />}
              <StageShow />
              <BubbleHost />
              <ChoiceHost />
              <Player />
            </Physics>
          </Suspense>
          </>}
        </Canvas>
      </KeyboardControls>
      {!eyetest && <Hud />}
      {!eyetest && <Dialog />}
    </>
  )
}
