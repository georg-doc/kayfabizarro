// Elan S1 · Ringkurs im M1-Gelände und Platzhalter-Anzeige (research/DRAGONRIDING_RESEARCH_R1.md §6.8/§6.9). Ringe: nächster gelb, übernächster blass
// blau, sonst unsichtbar (wie WoW); sichtbar, solange im Schwungflug geflogen wird oder ein Lauf läuft. Zeit vom ersten bis zum letzten Ring, Bestzeit
// je Sitzung (Browser-Speicher nur als Bequemlichkeit). Ladungen: 6 große Knet-Perlen am linken Bildrand, Glühen bei Thrill – Platzhalter, bis das HUD
// R5f einen Platz für Ladungen hat. Ein großer Sprung der Figur (R, Teleport) setzt den Lauf zurück.
// Flug-VFX (vendor/vfx/kfb-flight-vfx.js R2, byte-gleich, blob be9cbb90 von main tools/KFB-ToolBox/_inbox/KFB HUD Flight Board – Flight VFX): Kondensstreifen
// an den Schultern ab Tempo, Manöver-Linien bei Schub und Fassrolle (Komfortmodus: aus), Überflug-Staub bodennah; kein Düsenschub (FB trägt kein Jetpack).
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { createFlightVfx } from '../vendor/vfx/kfb-flight-vfx.js'
import { makeCourse, createRun, stepRun, resetRun } from './elanCourse'
import { ELAN_MEM } from './M1Player'
import { ELAN } from './elan'

const BEST_KEY = 'kfb.elan.s1.best'
export const ELAN_RUN = { run: null }
// Elan S2: im Fahrmodus fliegt der Racer denselben Kurs × scale (RACER_COURSE_SCALE), eigene Bestzeit (bestKey); statt Schulter-Streifen trägt der Racer
// seine Düsenfahnen selbst (Antriebs-Modul), daher hier keine Flug-VFX für profile racer. Kesseldruck P als Platzhalter-Säule unter den Perlen (rot: kocht).
export default function ElanRings({ groundAt, J = 1, playerPos, playerObj, scale = 1, bestKey = BEST_KEY }) {
  const { scene, camera } = useThree(), fx = useRef({ vfx: null, boost: 0 })
  const course = useMemo(() => makeCourse(groundAt, J, scale), [groundAt, J, scale])
  const run = useMemo(() => { const r = createRun(course); try { const b = +localStorage.getItem(bestKey); if (b > 0) r.best = b } catch { /* privat */ } return r }, [course])
  const group = useRef(null), prev = useRef(null)
  const mats = useMemo(() => ({ next: new THREE.MeshBasicMaterial({ color: '#ffd34d' }), after: new THREE.MeshBasicMaterial({ color: '#a9d6ff', transparent: true, opacity: 0.55 }) }), [])
  const rings = useMemo(() => course.rings.map((r) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r.radius, 0.22 * J * scale, 10, 48), mats.next); m.position.fromArray(r.pos)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...r.normal)); m.visible = false; m.name = 'elan-ring'; return m }), [course, mats, J])
  // Anzeige (Host-DOM): Perlen links, Zeit oben rechts
  const ui = useMemo(() => {
    if (typeof document === 'undefined') return null
    const box = document.createElement('div'); box.id = 'elan-hud'; box.style.cssText = 'position:fixed;left:18px;top:50%;translate:0 -50%;display:none;flex-direction:column;gap:10px;z-index:8995;pointer-events:none'
    const pearls = Array.from({ length: ELAN.charges }, () => { const p = document.createElement('div'); p.style.cssText = 'width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3c9,#e8a64a 55%,#a8641f);box-shadow:0 2px 4px rgba(42,26,12,.35);transition:opacity .2s,box-shadow .2s'; box.append(p); return p })
    const time = document.createElement('div'); time.id = 'elan-time'; time.style.cssText = "position:fixed;right:18px;top:64px;display:none;padding:6px 12px;border-radius:10px;background:rgba(255,250,240,.82);color:#1f1a14;font:700 18px/1.2 'Shantell Sans',system-ui,sans-serif;z-index:8995;pointer-events:none"
    const boiler = document.createElement('div'); boiler.id = 'elan-boiler'; boiler.style.cssText = 'width:30px;height:90px;border-radius:15px;background:rgba(42,26,12,.25);position:relative;overflow:hidden;display:none;box-shadow:0 2px 4px rgba(42,26,12,.35)'
    const fill = document.createElement('div'); fill.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:100%;background:linear-gradient(#ffe3a3,#c8782a)'; boiler.append(fill); box.append(boiler)
    document.body.append(box, time); return { box, pearls, time, boiler, fill }
  }, [])
  useEffect(() => { ELAN_RUN.run = run; return () => { ELAN_RUN.run = null; ui?.box.remove(); ui?.time.remove(); ui?.boiler.remove(); fx.current.vfx?.dispose(); fx.current.vfx = null } }, [run, ui])
  useFrame((_, dt) => {
    const p = playerPos(); if (!p) return
    const cur = [p.x, p.y, p.z], a = prev.current; prev.current = cur
    if (a && Math.hypot(cur[0] - a[0], cur[1] - a[1], cur[2] - a[2]) > 6 * J) resetRun(run) // Teleport/R: Lauf zurück
    const st = ELAN_MEM.state, active = !!st || (run.started && !run.done)
    // Flug-VFX: beim ersten Schwungflug anlegen, danach mit Tempo (km/h) und Schub speisen; ohne Schwungflug auslaufen lassen
    const F = fx.current, obj = playerObj?.()
    if (st && st.profile !== 'racer' && !F.vfx && obj) F.vfx = createFlightVfx({ scene, camera, body: obj, nozzles: [], trails: [{ object: obj, offset: [0.45 * J, 1.05 * J, -0.1 * J] }, { object: obj, offset: [-0.45 * J, 1.05 * J, -0.1 * J] }], surfaceAt: (x, z) => ({ y: groundAt(x, z), water: false }) })
    const log = ELAN_MEM.events, fresh = log.slice(F.seen || 0); F.seen = log.length; if (log.length > 500) { log.splice(0, 400); F.seen = log.length } // Ereignisse seit dem letzten Bild
    if (F.vfx) { for (const e of fresh) { if (e.type === 'surge' || e.type === 'ascent') F.boost = 0.45; if (!ELAN_MEM.comfort && (e.type === 'surge' || e.type === 'roll')) F.vfx.maneuver(e.type === 'roll' ? 0.9 : 0.6, e.type === 'roll' ? 0.55 : 0.45) }
      F.boost = Math.max(0, F.boost - dt); F.vfx.update(dt, st ? Math.hypot(...st.v) * 3.6 / J : 0, st ? (F.boost > 0 ? 1 : 0.14) : 0) }
    if (a && (st || run.started)) { const ev = stepRun(run, a, cur, dt); if (ev?.type === 'finish') try { localStorage.setItem(bestKey, String(run.best)) } catch { /* privat */ } }
    rings.forEach((m, i) => { const k = i - run.next; m.visible = active && !run.done && (k === 0 || k === 1); m.material = k === 0 ? mats.next : mats.after })
    if (!ui) return
    ui.box.style.display = st ? 'flex' : 'none'
    if (st) { const R = st.profile === 'racer'; ui.boiler.style.display = R ? 'block' : 'none'; if (R) { ui.fill.style.height = `${Math.round(st.P * 100)}%`; ui.fill.style.background = st.boilT > 0 ? '#c0392b' : 'linear-gradient(#ffe3a3,#c8782a)' } }
    if (st) ui.pearls.forEach((q, i) => { const on = i < st.charges; q.style.opacity = on ? '1' : '0.22'; q.style.boxShadow = on && st.thrill ? '0 0 14px 4px rgba(255,214,120,.9)' : '0 2px 4px rgba(42,26,12,.35)' })
    const show = run.started || run.best != null
    ui.time.style.display = show && (active || run.done) ? 'block' : 'none'
    if (show) ui.time.textContent = `Ringe ${Math.min(run.next, 10)}/10 · ${run.started ? run.t.toFixed(1) : '0.0'} s${run.best != null ? ` · Bestzeit ${run.best.toFixed(1)} s` : ''}`
  })
  return <group ref={group} name="elan-course">{rings.map((m, i) => <primitive key={i} object={m} />)}</group>
}
