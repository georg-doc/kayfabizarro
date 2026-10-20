// C1 Kamera (V-408, Werte V-088 in J17-Metern nach V-345): Folgekamera für Figur und Fahrzeug im Spielmodus. Ohne React, ohne Fenster-Listener außer am
// übergebenen DOM-Element. Läuft je Bildschirm-Bild NACH der Bild-Interpolation (gleicher Transform wie das Rendering, kein Ziel aus dem rohen
// Physik-Schritt), framerate-unabhängig über smoothDamp (kritisch gedämpft, kein lerp(dt·k)); auch der Zielpunkt selbst wird geglättet.
//   Orbit       von allen Seiten per Maus (Ziehen, beliebige Taste), auch in Bewegung; Winkel folgen der Eingabe über die Orbit-Feder (ω 7,5)
//   Recenter    träges Zurückgleiten hinter die Fahrtrichtung nur in Bewegung und erst idleS nach der letzten Orbit-Eingabe, 1,6/s
//   Zoom        Rad/Touchpad normalisiert (Δ ±120 je Raste), Schritt exp(Δ·0,0012), Bereich 0,55–2,8 × Grundabstand, darunter Ich-Perspektive (0,12)
//   Arm         Kollision (Strahl Ziel → Kamera): rein 8/s, raus 3/s, höchstens maxArm m/s – ohne Springen; nie unter Boden + minClear
// smoothDamp nach dem allgemein beschriebenen kritisch gedämpften Feder-Verfahren (Game Programming Gems 4, Kap. 1.10), eigene Umsetzung.
import * as THREE from 'three'

export function smoothDamp(cur, target, st, key, smoothTime, dt, maxSpeed = Infinity) {
  const T = Math.max(1e-4, smoothTime), w = 2 / T, x = w * dt, e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
  let change = cur - target; const maxC = maxSpeed * T; change = Math.max(-maxC, Math.min(maxC, change))
  const tgt = cur - change, v = st[key] || 0, temp = (v + w * change) * dt
  st[key] = (v - w * temp) * e
  let out = tgt + (change + temp) * e
  if ((target - cur > 0) === (out > target)) { out = target; st[key] = (out - target) / Math.max(dt, 1e-6) }
  return out
}
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))

export const FOLLOW = Object.freeze({ omega: 7.5, armIn: 8, armOut: 3, recenter: 1.6, idleS: 1.0, zoomStep: 0.0012, zoomMin: 0.55, zoomMax: 2.8, zoomPov: 0.12,
  rotate: 0.005, pitchMin: -0.15, pitchMax: 1.25, pad: 0.3 })

// opts: { dom, base: Grundabstand (m), height: Zielhöhe über der Wurzel (m), eye: Augenhöhe (m, Ich-Perspektive), pitch0, maxArm (m/s), minClear (m),
//         eyeAhead: Auge so weit vor der Wurzel (m, Ich-Perspektive am Fahrzeug), onPov(bool): eigenes Modell aus-/einblenden,
//         collide(from: Vector3, dir: Vector3, dist) → Treffer-Abstand | null, ground(x, z) → y }
export function createFollowCam(opts) {
  const O = { pitch0: 0.32, maxArm: 7.5, minClear: 0.4, ...opts }
  const st = { yaw: null, pitch: O.pitch0, wantYaw: 0, wantPitch: O.pitch0, zoom: 1, wantZoom: 1, arm: O.base, lastInput: -1e9, t: 0, v: {}, tgt: null, init: false }
  const tmp = { off: new THREE.Vector3(), dir: new THREE.Vector3(), p: new THREE.Vector3(), look: new THREE.Vector3() }
  // Eingabe: Ziehen = Orbit (Δ Pixel × rotate), Rad = Zoom (normalisiert: Zeilen/Seiten → Pixel, je Raste ±120)
  let drag = null
  const down = (e) => { drag = { x: e.clientX, y: e.clientY } }, up = () => { drag = null }
  const move = (e) => { if (!drag || !e.buttons) return; api.orbit((e.clientX - drag.x) * -FOLLOW.rotate, (e.clientY - drag.y) * FOLLOW.rotate); drag = { x: e.clientX, y: e.clientY } }
  const wheel = (e) => { const d = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * 800 : e.deltaY; api.zoomBy(Math.max(-360, Math.min(360, d))); e.preventDefault() }
  if (O.dom) { O.dom.addEventListener('pointerdown', down); window.addEventListener('pointerup', up); O.dom.addEventListener('pointermove', move); O.dom.addEventListener('wheel', wheel, { passive: false }) }
  const api = {
    state: st,
    orbit(dYaw, dPitch) { st.wantYaw = wrap(st.wantYaw + dYaw); st.wantPitch = Math.max(FOLLOW.pitchMin, Math.min(FOLLOW.pitchMax, st.wantPitch + dPitch)); st.lastInput = st.t },
    // Zoom: weiter hinein über zoomMin hinaus schaltet in die Ich-Perspektive, heraus aus ihr zurück auf zoomMin (vorher: der Schritt blieb an zoomMin hängen)
    zoomBy(delta) { if (st.wantZoom <= FOLLOW.zoomPov) { if (delta > 0) st.wantZoom = FOLLOW.zoomMin; return }
      const z = st.wantZoom * Math.exp(delta * FOLLOW.zoomStep); st.wantZoom = z < FOLLOW.zoomMin && st.wantZoom <= FOLLOW.zoomMin + 1e-6 ? FOLLOW.zoomPov : Math.max(FOLLOW.zoomMin, Math.min(FOLLOW.zoomMax, z)) },
    pov: () => st.zoom <= FOLLOW.zoomPov + 1e-6,
    reset() { st.init = false; st.v = {} },
    // je Bild nach der Interpolation: target = Wurzel des Verfolgten (Vector3), heading = Fahrtrichtung (rad, 0 = +Z), moving = bewegt sich
    update(dt, camera, { target, heading, moving }) {
      if (dt <= 0) return
      st.t += dt; const T = 2 / FOLLOW.omega // kritisch gedämpft: Zeitkonstante aus ω
      if (!st.init) { st.tgt = target.clone(); st.yaw = st.wantYaw = wrap(heading + Math.PI); st.pitch = st.wantPitch = O.pitch0; st.zoom = st.wantZoom; st.arm = O.base * st.zoom; st.init = true }
      // Recenter nur in Bewegung und ohne frische Orbit-Eingabe: der Wunschwinkel gleitet hinter die Fahrtrichtung
      if (moving && st.t - st.lastInput > FOLLOW.idleS) st.wantYaw = wrap(st.wantYaw + wrap(heading + Math.PI - st.wantYaw) * (1 - Math.exp(-FOLLOW.recenter * dt)))
      // Winkel über die Orbit-Feder (smoothDamp über den kürzesten Weg), Zoom ebenso
      st.yaw = wrap(st.yaw + (smoothDamp(0, wrap(st.wantYaw - st.yaw), st.v, 'yaw', T, dt)))
      st.pitch = smoothDamp(st.pitch, st.wantPitch, st.v, 'pitch', T, dt)
      // Ich-Perspektive ist ein Umschalten, kein Heranfahren (sonst schwebt die Kamera eine Weile dicht über dem Dach): rein sofort, raus ab zoomMin
      if (st.wantZoom <= FOLLOW.zoomPov) { st.zoom = FOLLOW.zoomPov; st.v.zoom = 0 } else { if (st.zoom <= FOLLOW.zoomPov) { st.zoom = FOLLOW.zoomMin; st.arm = O.base * st.zoom } st.zoom = smoothDamp(st.zoom, st.wantZoom, st.v, 'zoom', T, dt) }
      const pov = api.pov(); if (pov !== st.povShown) { st.povShown = pov; O.onPov?.(pov) }
      // Zielpunkt glätten (dieselbe Feder, je Achse)
      for (const a of ['x', 'y', 'z']) st.tgt[a] = smoothDamp(st.tgt[a], target[a], st.v, 't' + a, T * 0.35, dt)
      const look = tmp.look.copy(st.tgt); look.y += O.height
      if (pov) { // Ich-Perspektive: Auge vorn über der Wurzel (eyeAhead in Fahrtrichtung), Blick in Fahrtrichtung + Orbit-Abweichung; Modell ausgeblendet (onPov)
        const yaw = st.yaw + Math.PI, c = Math.cos(st.pitch * 0.5), a = O.eyeAhead || 0, ex = st.tgt.x + Math.sin(heading) * a, ez = st.tgt.z + Math.cos(heading) * a
        camera.position.set(ex, st.tgt.y + O.eye, ez); camera.lookAt(ex + Math.sin(yaw) * c, st.tgt.y + O.eye - Math.sin(st.pitch * 0.5) * 0.3, ez + Math.cos(yaw) * c); return }
      // Arm: Wunschlänge aus Zoom, gekürzt durch Kollision (Strahl vom Blickpunkt zur Kamera); rein schnell, raus langsam, Tempo begrenzt
      const want = O.base * st.zoom, cp = Math.cos(st.pitch)
      tmp.dir.set(Math.sin(st.yaw) * cp, Math.sin(st.pitch), Math.cos(st.yaw) * cp).normalize()
      const hit = O.collide ? O.collide(look, tmp.dir, want + FOLLOW.pad) : null, lim = hit != null ? Math.max(0.6, Math.min(want, hit - FOLLOW.pad)) : want
      const rate = lim < st.arm ? FOLLOW.armIn : FOLLOW.armOut, step = (lim - st.arm) * (1 - Math.exp(-rate * dt))
      st.arm += Math.sign(step) * Math.min(Math.abs(step), O.maxArm * dt)
      const p = tmp.p.copy(look).addScaledVector(tmp.dir, st.arm)
      const gy = O.ground ? O.ground(p.x, p.z) : -Infinity; if (p.y < gy + O.minClear) p.y = gy + O.minClear
      camera.position.copy(p); camera.lookAt(look)
    },
    detach() { if (O.dom) { O.dom.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); O.dom.removeEventListener('pointermove', move); O.dom.removeEventListener('wheel', wheel) } },
  }
  return api
}
