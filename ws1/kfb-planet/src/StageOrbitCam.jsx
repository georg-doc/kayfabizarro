// V-257 Bühnen-Kamera: frei bewegliche Orbit-Kamera (360° drehen, Zoom zum Cursor, Panning, Fokus per Doppelklick), ruhig nach V-026
// (geglättet, nicht zu empfindlich), nie unter 0,5 m (V-203). Feste Blicke nur als Sprungmarken: „Standard“ = Standard-Blick, „Nah“ = 40 % näher.
// Aus Stage.jsx herausgelöst (Werte und Ablauf unverändert), damit auch der M1-Dialog dieselbe Kamera nutzt statt eines zweiten Wegs (V-206).
// Props: view = { pos, target, fov? } (Startblick und Sprungmarken) · active (Standard true). active = false: Steuerung aus, Knöpfe verborgen,
// kein update – die Kamera gehört dann einem anderen Besitzer (M1: ecctrl-Folgekamera). Beim Einschalten gleitet sie von der aktuellen Kamera zum Startblick.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { expose } from './debug'

export const ORBIT = Object.freeze({ damping: 0.08, rotate: 0.45, zoom: 0.5, pan: 0.6, minDist: 2, maxDist: 60, minY: 0.5, glideS: 0.8 })
const marksOf = (view) => { const p = new THREE.Vector3(...view.pos), t = new THREE.Vector3(...view.target); return { standard: { pos: p, target: t }, nah: { pos: t.clone().lerp(p, 0.6), target: t.clone() } } }

export function StageOrbitCam({ view, active = true }) {
  const { camera, gl, scene, size } = useThree()
  const viewRef = useRef(view); viewRef.current = view
  const activeRef = useRef(active)
  const ctl = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement)
    Object.assign(c, { enableDamping: true, dampingFactor: ORBIT.damping, rotateSpeed: ORBIT.rotate, zoomSpeed: ORBIT.zoom, panSpeed: ORBIT.pan, zoomToCursor: true, screenSpacePanning: true, minDistance: ORBIT.minDist, maxDistance: ORBIT.maxDist, maxPolarAngle: Math.PI * 0.55 }) // knapp unter die Waagrechte erlaubt (Standard-Blick ist fast waagrecht); den Boden schützt minY
    return c
  }, [camera, gl])
  const glide = useMemo(() => ({ on: false, t: 0, a: null, b: null }), [])
  const camMarks = () => marksOf(viewRef.current)
  // Sprungmarke: weich hingleiten (Kamera und Ziel), kein Schnitt
  // Restschwung der Dämpfung vor dem Gleiten verbrauchen (sonst verschiebt er den Blick nach dem Ankommen); während des Gleitens ohne Dämpfung
  const startGlide = (b) => { ctl.enableDamping = false; ctl.update(); Object.assign(glide, { on: true, t: 0, a: { pos: camera.position.clone(), target: ctl.target.clone() }, b }) }
  const jump = (name) => { const m = camMarks()[name]; if (m) startGlide(m) }
  // Startblick: aktiv beim Einhängen → wie bisher sofort setzen; inaktiv → Kamera nicht anfassen (anderer Besitzer)
  useEffect(() => { if (!activeRef.current) return; const v = viewRef.current; camera.fov = v.fov || 38; camera.near = 0.1; camera.far = 600; camera.position.fromArray(v.pos); ctl.target.fromArray(v.target); camera.lookAt(ctl.target); camera.updateProjectionMatrix(); ctl.update(); expose('StageCamera', camera) }, [camera, ctl])
  useEffect(() => { camera.aspect = size.width / size.height; camera.updateProjectionMatrix() }, [camera, size])
  // Ein- und Ausschalten: aus = Steuerung und Knöpfe weg; ein = Orbit-Ziel vor die aktuelle Kamera legen und von dort zum Startblick gleiten
  useEffect(() => {
    const was = activeRef.current; activeRef.current = active; ctl.enabled = active
    const box = document.getElementById('kfb-cam-marks'); if (box) box.style.display = active ? 'flex' : 'none'
    if (active && !was) {
      const v = viewRef.current, d = new THREE.Vector3(...v.pos).distanceTo(new THREE.Vector3(...v.target)), dir = camera.getWorldDirection(new THREE.Vector3())
      ctl.target.copy(camera.position).addScaledVector(dir, d); camera.fov = v.fov || camera.fov; camera.updateProjectionMatrix(); expose('StageCamera', camera); jump('standard')
    }
    if (!active) glide.on = false
  }, [active, ctl, camera])
  // Fokus auf Klick (V-257): Doppelklick setzt das Orbit-Ziel weich auf den getroffenen Punkt
  useEffect(() => {
    const ray = new THREE.Raycaster(), v = new THREE.Vector2()
    const onDbl = (e) => { if (!activeRef.current) return; const r = gl.domElement.getBoundingClientRect(); v.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(v, camera)
      const hit = ray.intersectObjects(scene.children, true).find((h) => h.object.visible && h.object.name !== 'sky'); if (!hit) return
      startGlide({ pos: camera.position.clone().add(hit.point.clone().sub(ctl.target)), target: hit.point.clone() }) }
    gl.domElement.addEventListener('dblclick', onDbl); return () => gl.domElement.removeEventListener('dblclick', onDbl)
  }, [gl, camera, scene, ctl, glide])
  useEffect(() => { // Sprungmarken als kleine Knöpfe oben rechts
    const box = document.createElement('div'); box.id = 'kfb-cam-marks'
    box.style.cssText = 'position:fixed;right:16px;top:14px;display:flex;gap:8px;z-index:9000'
    for (const [k, label] of [['standard', 'Standard'], ['nah', 'Nah']]) { const b = document.createElement('button'); b.dataset.mark = k; b.textContent = label
      b.style.cssText = 'padding:6px 12px;border:0;border-radius:10px;background:rgba(40,28,16,.72);color:#ffe9b8;font:600 14px/1.2 system-ui,sans-serif;cursor:pointer'; b.onclick = () => jump(k); box.appendChild(b) }
    if (!activeRef.current) box.style.display = 'none'
    document.body.appendChild(box); expose('StageOrbit', { controls: ctl, jump, marks: camMarks, glide: () => glide.on, active: () => activeRef.current }); return () => { box.remove(); ctl.dispose() }
  }, [ctl])
  useFrame((_, dt) => {
    if (!activeRef.current) return
    if (glide.on) { glide.t = Math.min(ORBIT.glideS, glide.t + Math.min(dt, 0.1)); const u = glide.t / ORBIT.glideS, k = u * u * (3 - 2 * u)
      camera.position.lerpVectors(glide.a.pos, glide.b.pos, k); ctl.target.lerpVectors(glide.a.target, glide.b.target, k); if (u >= 1) { glide.on = false; ctl.update(); ctl.enableDamping = true } }
    ctl.update()
    if (camera.position.y < ORBIT.minY) camera.position.y = ORBIT.minY // nie unter das Gelände (V-203)
  })
  return null
}
