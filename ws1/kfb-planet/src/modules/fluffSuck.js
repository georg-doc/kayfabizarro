// Fluff-Ernte R1 (V-479/V-480/V-484, SPEC_FLUFF_SUCTION_R1 §2/§7/§8, Integrationsplan V-487 Stufe 2) · EIN Saug-Modul `kfb-fluff-suck` für Bots, Spieler-
// Saugarm und UFO. Sauger-Typen: nozzle (Düse: Punkt + Richtung) und beam (Kegel: Spitze oben, Mündung unten; Kugeln strömen in den Kegel).
// Ablauf je Kugel (Cartoon, Squash & Stretch, Volumen bleibt):
//   1 Anlauf 0,3 s (Kugel zittert, Partikel strömen zur Düse) → 2 Stretch am Ursprung 0,4 s (Gummi-Hals Richtung Düse, Fuß haftet) → 3 Plopp 0,1 s
//   (Squash; Ursprungs-Effekt Baum: Blätter / Erde: Krümel / Wasser: Spritzer) → 4 Flug 0,4 s (gestreckter Tropfen, leichte Kurve, schneller werdend)
//   → 5 Einsaugen 0,2 s (Kugel verschwindet in der Düse, Ereignis „swallow“ für die Beule am Arm und den Tank-Zähler).
// Die Phasen sind Cues (charge, stretch, plop, fly, swallow) – Ton und VFX hängen sich daran (V-389). Darstellung: ein InstancedMesh für alle
// fliegenden Kugeln (nicht-uniforme Skalierung entlang Kugel → Düse, Volumen erhalten), ein Punkt-Pool für Ursprungs-Effekte; feste Obergrenzen
// (V-357). Über maxJobs werden weitere Kugeln zu einer Wolke zusammengefasst (zählen sofort, nur ein Wolken-Puff) – Gebiete mit vielen Kugeln bleiben
// flüssig. Modul nach Host-Vertrag R1.2. options: { maxJobs = 24, onCue?(cue, job) }
import * as THREE from 'three'

export const SUCK = Object.freeze({ charge: 0.3, stretch: 0.4, plop: 0.1, fly: 0.4, swallow: 0.2, stretchMax: 1.9, flyStretch: 1.6, jitter: 0.06, curve: 0.25 })
export const ORIGIN_FX = Object.freeze({ tree: { color: '#7fae4a', n: 8, up: 1.2 }, ground: { color: '#8a6a4a', n: 10, up: 1.6 }, water: { color: '#e8f4ff', n: 12, up: 2.2 } })
const POOL = 160

export function createFluffSuck({ maxJobs = 24, onCue = null } = {}) {
  const root = new THREE.Group(); root.name = 'fluff-suck'
  const geo = new THREE.IcosahedronGeometry(1, 2), mat = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0 })
  const mesh = new THREE.InstancedMesh(geo, mat, maxJobs); mesh.name = 'fluff-suck-balls'; mesh.castShadow = true; mesh.frustumCulled = false; mesh.count = 0; root.add(mesh)
  const col = new THREE.Color(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0)
  // Ursprungs-Effekte (Punkte, normal geblendet, kurze Lebenszeit)
  const P = { pos: new Float32Array(POOL * 3), vel: new Float32Array(POOL * 3), life: new Float32Array(POOL), col: new Float32Array(POOL * 3), next: 0 }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(P.pos, 3)); pg.setAttribute('aLife', new THREE.BufferAttribute(P.life, 1)); pg.setAttribute('aColor', new THREE.BufferAttribute(P.col, 3))
  const pm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uScale: { value: 220 } },
    vertexShader: 'attribute float aLife; attribute vec3 aColor; varying float vL; varying vec3 vC; uniform float uScale; void main(){ vL = aLife; vC = aColor; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = uScale * (0.03 + 0.05*aLife) / max(0.2, -mv.z); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying float vL; varying vec3 vC; void main(){ if (vL <= 0.) discard; float k = smoothstep(0.5, 0.2, length(gl_PointCoord - 0.5)); gl_FragColor = vec4(vC, k * vL); }' })
  const pts = new THREE.Points(pg, pm); pts.frustumCulled = false; root.add(pts)
  let rnd = 7; const rand = () => { rnd = (rnd * 1664525 + 1013904223) >>> 0; return rnd / 4294967296 }
  const burst = (at, kind, n = null) => { const F = ORIGIN_FX[kind] || ORIGIN_FX.ground, c = col.set(F.color)
    for (let k = 0; k < (n ?? F.n); k++) { const j = P.next; P.next = (P.next + 1) % POOL; const a = rand() * Math.PI * 2, s = 0.6 + rand() * 0.9
      P.pos[j * 3] = at.x; P.pos[j * 3 + 1] = at.y; P.pos[j * 3 + 2] = at.z; P.vel[j * 3] = Math.cos(a) * s; P.vel[j * 3 + 1] = F.up * (0.6 + rand() * 0.6); P.vel[j * 3 + 2] = Math.sin(a) * s
      P.life[j] = 1; P.col[j * 3] = c.r; P.col[j * 3 + 1] = c.g; P.col[j * 3 + 2] = c.b } }
  const jobs = [], stats = { started: 0, swallowed: 0, clouded: 0, plops: { tree: 0, ground: 0, water: 0 } }
  const D = SUCK.charge + SUCK.stretch + SUCK.plop + SUCK.fly + SUCK.swallow
  const cue = (name, J) => { J.cues.push(name); onCue?.(name, J) }
  // nozzle: () => ({ pos: Vector3, dir: Vector3 }) bzw. beam: () => ({ pos: Mündung, dir: nach oben, radius })
  function suck(ball, nozzle, origin = 'ground', { onSwallow = null } = {}) {
    if (jobs.length >= maxJobs) { stats.clouded++; burst(new THREE.Vector3(...ball.pos), origin, 3); onSwallow?.(ball); onCue?.('cloud', { ball }); return { clouded: true } }
    const J = { ball, from: new THREE.Vector3(...ball.pos), r: ball.r || 0.12, color: new THREE.Color(ball.color || '#ffd21f'), nozzle, origin, t: 0, cues: [], onSwallow, side: (rand() - 0.5) * 2 }
    jobs.push(J); stats.started++; cue('charge', J); return J
  }
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), dir = new THREE.Vector3()
  return {
    object3d: root,
    suck,
    active: () => jobs.length,
    stats: () => ({ ...stats, active: jobs.length, plops: { ...stats.plops } }),
    update(dt) {
      dt = Math.min(dt || 0, 0.1)
      for (let i = jobs.length - 1; i >= 0; i--) {
        const J = jobs[i], t0 = J.t; J.t += dt; const t = J.t, N = J.nozzle(), np = N.pos
        const T1 = SUCK.charge, T2 = T1 + SUCK.stretch, T3 = T2 + SUCK.plop, T4 = T3 + SUCK.fly
        if (t0 < T1 && t >= T1) cue('stretch', J)
        if (t0 < T2 && t >= T2) { cue('plop', J); stats.plops[J.origin] = (stats.plops[J.origin] || 0) + 1; burst(J.from, J.origin) }
        if (t0 < T3 && t >= T3) cue('fly', J)
        if (t0 < T4 && t >= T4) cue('swallow-start', J)
        let p = tmpA, sAlong = 1, sSide = 1
        dir.subVectors(np, J.from).normalize()
        if (t < T1) { p.copy(J.from).addScaledVector(new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5), J.r * SUCK.jitter * 2) } // Zittern
        else if (t < T2) { const u = (t - T1) / SUCK.stretch, e = u * u * (3 - 2 * u); sAlong = 1 + (SUCK.stretchMax - 1) * e; p.copy(J.from).addScaledVector(dir, J.r * (sAlong - 1) * 0.5) } // Fuß haftet, Hals wächst
        else if (t < T3) { const u = (t - T2) / SUCK.plop; sAlong = SUCK.stretchMax - (SUCK.stretchMax - 0.7) * u; p.copy(J.from).addScaledVector(dir, J.r * 0.4) } // Plopp: Squash
        else if (t < T4) { const u = (t - T3) / SUCK.fly, e = u * u; tmpB.lerpVectors(J.from, np, e); const off = Math.sin(u * Math.PI) * SUCK.curve * J.from.distanceTo(np) * J.side
            p.copy(tmpB).add(new THREE.Vector3().crossVectors(dir, Y).normalize().multiplyScalar(off)); sAlong = 1 + (SUCK.flyStretch - 1) * Math.sin(u * Math.PI * 0.9) } // Flug, schneller werdend
        else { const u = Math.min(1, (t - T4) / SUCK.swallow); p.copy(np); sAlong = (1 - u) * 1.3; sSide = (1 - u) }
        J.render = { p: p.clone(), sAlong, sSide: sSide / Math.sqrt(Math.max(0.05, sAlong)), dir: dir.clone() }
        if (t >= D) { stats.swallowed++; cue('swallow', J); J.onSwallow?.(J.ball); jobs.splice(i, 1) }
      }
      mesh.count = jobs.length
      jobs.forEach((J, k) => { const R = J.render; if (!R) return; q.setFromUnitVectors(Y, R.dir); sc.set(J.r * R.sSide, J.r * R.sAlong, J.r * R.sSide); mesh.setMatrixAt(k, m4.compose(pos.copy(R.p), q, sc)); mesh.setColorAt(k, J.color) })
      mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      for (let j = 0; j < POOL; j++) { if (P.life[j] <= 0) continue; P.life[j] = Math.max(0, P.life[j] - dt / 0.6); P.vel[j * 3 + 1] -= 6 * dt; for (let k = 0; k < 3; k++) P.pos[j * 3 + k] += P.vel[j * 3 + k] * dt }
      pg.attributes.position.needsUpdate = true; pg.attributes.aLife.needsUpdate = true; pg.attributes.aColor.needsUpdate = true
    },
    dispose() { geo.dispose(); mat.dispose(); pg.dispose(); pm.dispose(); root.clear() },
  }
}
