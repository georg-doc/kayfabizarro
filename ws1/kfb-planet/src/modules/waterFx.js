// WS1c (V-631, V-621) · Wasser-VFX am Fahrzeug, Modul nach Host-Vertrag: create(options) → { object3d, update(dt, ctx), dispose() }.
// Bugwelle (V aus Schaum am Spiegel vor dem Bug, wächst mit dem Tempo), Kielwasser (Schaumband hinter dem Wagen, wird breiter und blasser),
// Spritzer (Knet-Tropfen im Bogen + Ring auf dem Spiegel) beim Eintauchen, Auftauchen, Schwimmstoß und Verlassen, Gischtfahne beim Gleiten,
// Blasen unter Wasser (über bubbles() des Wassers). Alles Standard-Material: das eine Licht-Rig beleuchtet es, keine eigenen Lichter.
// options: { car() → { x, y, z, yaw, speed } | null, water() → { mode, level, sub } | null, on(type, fn) → abmelden (Ereignis-Bus, 'water'),
//            bubbles(x, y, z, n, r) (Wasser-Modul), expose(api) (Prüfwerte, nur Lesen) }
import * as THREE from 'three'

export const WATER_FX = Object.freeze({ wakeN: 56, wakeStep: 0.9, wakeLife: 2.6, wakeW0: 0.7, wakeW1: 3.2, bowMin: 1.5, dropN: 260, dropLife: 1.1, ringN: 6, ringLife: 0.9, tailRate: 40 })
export const waterFxLog = { create: 0, dispose: 0 }

export function createWaterFx(options = {}) {
  waterFxLog.create++
  const F = WATER_FX, root = new THREE.Group(); root.name = 'kfb-water-fx'
  const foamMat = new THREE.MeshStandardMaterial({ color: '#f2fbf8', emissive: '#a9d9d2', emissiveIntensity: 0.25, roughness: 0.85, metalness: 0, vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide })
  // ── Kielwasser: Band aus Punkten hinter dem Wagen (Ringpuffer), Breite und Blässe nach Alter ──────────────────────────────────────────────
  const wk = { p: new Float32Array(F.wakeN * 4), n: 0, head: 0, last: null }   // x, y, z, t0
  const wGeo = new THREE.BufferGeometry(), wPos = new Float32Array(F.wakeN * 4 * 3), wCol = new Float32Array(F.wakeN * 4 * 4), wIdx = []   // je Reihe außen-links · innen-links · innen-rechts · außen-rechts: zwei schmale Schaumlinien (Kelvin-V), Mitte offen
  for (let i = 0; i < F.wakeN - 1; i++) { const a = i * 4; wIdx.push(a, a + 1, a + 4, a + 1, a + 5, a + 4, a + 2, a + 3, a + 6, a + 3, a + 7, a + 6) }
  wGeo.setAttribute('position', new THREE.BufferAttribute(wPos, 3)); wGeo.setAttribute('color', new THREE.BufferAttribute(wCol, 4)); wGeo.setIndex(wIdx)
  const wake = new THREE.Mesh(wGeo, foamMat); wake.frustumCulled = false; wake.renderOrder = 6; root.add(wake)
  // ── Bugwelle: zwei Schaumflügel als V vor dem Bug (12 Segmente je Flügel), Länge/Öffnung nach Tempo ─────────────────────────────────────
  const BW = 12, bGeo = new THREE.BufferGeometry(), bPos = new Float32Array(2 * (BW + 1) * 2 * 3), bCol = new Float32Array(2 * (BW + 1) * 2 * 4), bIdx = []
  for (let w = 0; w < 2; w++) for (let i = 0; i < BW; i++) { const a = (w * (BW + 1) + i) * 2; bIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2) }
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3)); bGeo.setAttribute('color', new THREE.BufferAttribute(bCol, 4)); bGeo.setIndex(bIdx)
  const bow = new THREE.Mesh(bGeo, foamMat); bow.frustumCulled = false; bow.renderOrder = 6; bow.visible = false; root.add(bow)
  // ── Tropfen (Knete, Instanzen) und Ringe ────────────────────────────────────────────────────────────────────────────────────────────────
  const dGeo = new THREE.IcosahedronGeometry(1, 1), dMat = new THREE.MeshStandardMaterial({ color: '#d9f4f0', emissive: '#6fc3c4', emissiveIntensity: 0.45, roughness: 0.25, metalness: 0, transparent: true, opacity: 0.7, depthWrite: false })   // Wasserton (Kit-Flachwasser hell), glänzend vom Rig
  const drops = new THREE.InstancedMesh(dGeo, dMat, F.dropN); drops.count = 0; drops.frustumCulled = false; root.add(drops)
  const D = { p: new Float32Array(F.dropN * 3), v: new Float32Array(F.dropN * 3), r: new Float32Array(F.dropN), t: new Float32Array(F.dropN).fill(-1), lv: new Float32Array(F.dropN), i: 0 }
  const rGeo = (() => { const g = new THREE.RingGeometry(0.8, 1, 48, 1).rotateX(-Math.PI / 2), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z), k = 1 + 0.12 * Math.sin(a * 3 + 1.3) + 0.07 * Math.sin(a * 7 + 0.4), w = r < 0.9 ? 1 + 0.25 * Math.sin(a * 5 + 2.1) : 1; p.setXYZ(i, Math.cos(a) * (r < 0.9 ? 1 - 0.2 * w : 1) * k, 0, Math.sin(a) * (r < 0.9 ? 1 - 0.2 * w : 1) * k) } return g })(),   /* Ring unregelmäßig (gemalt), Breite wechselt */ rMat = new THREE.MeshStandardMaterial({ color: '#f2fbf8', emissive: '#a9d9d2', emissiveIntensity: 0.25, roughness: 0.85, transparent: true, depthWrite: false, side: THREE.DoubleSide })
  const rings = Array.from({ length: F.ringN }, () => { const m = new THREE.Mesh(rGeo, rMat.clone()); m.visible = false; m.renderOrder = 6; m.userData.t = -1; root.add(m); return m })
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), po = new THREE.Vector3(), vv = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0)
  const stats = { splashes: 0, drops: 0, rings: 0, wakePts: 0, bowOn: 0, tail: 0, bubbles: 0 }
  // Spritzer: n Tropfen im Bogen (Tempo up, Streuung spread, Richtung dir optional), dazu ein Ring auf dem Spiegel
  const splash = (x, y, z, n, up, spread, dir = null, ring = true) => { stats.splashes++
    for (let k = 0; k < n; k++) { const i = D.i++ % F.dropN, a = rnd() * 6.283, s = spread * (0.3 + 0.7 * rnd())
      D.p.set([x + Math.cos(a) * 0.3, y + 0.05, z + Math.sin(a) * 0.3], i * 3)
      D.v.set([Math.cos(a) * s + (dir ? dir[0] : 0), up * (0.55 + 0.6 * rnd()), Math.sin(a) * s + (dir ? dir[1] : 0)], i * 3)
      D.r[i] = 0.03 + 0.07 * rnd() ** 1.5; D.t[i] = 0; D.lv[i] = y; stats.drops++ }
    if (ring) { const r = rings.find((m) => m.userData.t < 0) || rings[0]; r.position.set(x, y + 0.04, z); r.userData.t = 0; r.userData.size = 0.4 + spread * 0.22; r.visible = true; stats.rings++ } }
  const off = options.on ? options.on('water', (e) => { const s = e.strength ?? 0.5
    if (e.kind === 'enter') splash(e.x, e.y, e.z, Math.round(18 + 34 * s), 3 + 6 * s, 1.5 + 3 * s)
    else if (e.kind === 'exit') splash(e.x, e.y, e.z, Math.round(12 + 20 * s), 2.5 + 4 * s, 1 + 2 * s)
    else if (e.kind === 'surface') splash(e.x, e.y, e.z, 22, 5, 2)
    else if (e.kind === 'kick') { options.bubbles?.(e.x, e.y + 0.3, e.z, 14, 0.8) }
    else if (e.kind === 'dive') { splash(e.x, e.y, e.z, 10, 2, 1); options.bubbles?.(e.x, e.y - 0.5, e.z, 18, 1) } }) : null
  let tailAcc = 0, bubAcc = 0, clock = 0
  const api = {
    object3d: root,
    splash, stats: () => ({ ...stats, live: drops.count }),
    update(dt = 1 / 60, ctx) { clock += dt; const cp = ctx?.camera?.position
      const c = options.car?.(), W = options.water?.()
      const onWater = c && W && W.level != null && (W.mode === 'skim' || W.mode === 'wade'), v = c ? Math.abs(c.speed) : 0
      // Kielwasser: neuer Punkt je wakeStep Meter auf dem Spiegel hinter dem Heck
      if (onWater && v > 1) { const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw), hx = c.x - fx * 1.6, hz = c.z - fz * 1.6
        if (!wk.last || Math.hypot(hx - wk.last[0], hz - wk.last[1]) > F.wakeStep) { const i = wk.head; wk.p.set([hx, W.level + 0.035, hz, clock], i * 4); wk.head = (i + 1) % F.wakeN; wk.n = Math.min(F.wakeN, wk.n + 1); wk.last = [hx, hz]; stats.wakePts++ } }
      else wk.last = null
      // Band neu aufbauen (jüngster Punkt zuerst); Breite wächst, Deckkraft fällt mit dem Alter
      for (let k = 0; k < F.wakeN; k++) { const i = (wk.head - 1 - k + F.wakeN * 2) % F.wakeN, j = (wk.head - 2 - k + F.wakeN * 2) % F.wakeN, o = k * 12, oc = k * 16
        const age = k < wk.n ? clock - wk.p[i * 4 + 3] : 1e9, u = Math.min(1, age / F.wakeLife)
        if (u >= 1 || k >= wk.n) { wPos.fill(0, o, o + 12); wCol.fill(0, oc, oc + 16); continue }
        const ni = k + 1 < wk.n ? j : i, dx = wk.p[i * 4] - wk.p[ni * 4] || 1e-4, dz = wk.p[i * 4 + 2] - wk.p[ni * 4 + 2], dl = Math.hypot(dx, dz) || 1, w = F.wakeW0 + (F.wakeW1 - F.wakeW0) * Math.sqrt(u)
        const px = -dz / dl * w * 0.5, pz = dx / dl * w * 0.5, al = (1 - u) ** 1.5 * 0.85 * (0.75 + 0.25 * Math.sin(k * 2.1 + i)), x = wk.p[i * 4], y = wk.p[i * 4 + 1], z = wk.p[i * 4 + 2]
        const lw = 0.22 + 0.35 * u, f = 1 - lw / Math.max(w * 0.5, 1e-3), br = 0.5 + 0.5 * Math.sin(i * 1.7 + k * 0.9), a2 = al * (br > 0.25 ? 1 : 0.15)   /* Linienbreite wächst, Lücken brechen die Linie (gemalt) */
        wPos.set([x + px, y, z + pz, x + px * f, y, z + pz * f, x - px * f, y, z - pz * f, x - px, y, z - pz], o); wCol.set([1, 1, 1, a2 * 0.6, 1, 1, 1, a2, 1, 1, 1, a2, 1, 1, 1, a2 * 0.6], oc) }
      wGeo.attributes.position.needsUpdate = true; wGeo.attributes.color.needsUpdate = true
      // Bugwelle: V vor dem Bug, Flügel öffnen sich nach hinten
      bow.visible = onWater && v > F.bowMin; if (bow.visible) { stats.bowOn++; const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw), rx = fz, rz = -fx, L = Math.min(5, 1.2 + v * 0.22), op = Math.min(0.9, v / 12), y = W.level + 0.04
        for (let w = 0; w < 2; w++) { const sd = w ? 1 : -1; for (let i = 0; i <= BW; i++) { const u = i / BW, back = -u * L + 2.0, out = sd * (0.9 + u * L * 0.55), wob = 0.12 * Math.sin(clock * 9 + i * 1.7 + w), wd = 0.22 + u * 0.55
          const bx = c.x + fx * back + rx * (out + wob * sd), bz = c.z + fz * back + rz * (out + wob * sd), o = (w * (BW + 1) + i) * 6, oc = (w * (BW + 1) + i) * 8, a = op * (1 - u) ** 0.8
          bPos.set([bx, y, bz, bx + rx * sd * wd, y + (0.05 + 0.18 * op) * (1 - u), bz + rz * sd * wd], o);   /* äußere Kante als Wellenkamm */ bCol.set([1, 1, 1, a, 1, 1, 1, a * 0.5], oc) } }
        bGeo.attributes.position.needsUpdate = true; bGeo.attributes.color.needsUpdate = true }
      // Gischtfahne beim Gleiten: Tropfen hinter dem Heck, nach oben/hinten
      if (onWater && W.mode === 'skim' && v > 6) { tailAcc += dt * F.tailRate * Math.min(1.5, v / 15); const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw)
        while (tailAcc >= 1) { tailAcc--; stats.tail++; const i = D.i++ % F.dropN, s = (rnd() - 0.5) * 1.6
          D.p.set([c.x - fx * 1.8 + fz * s, W.level + 0.1, c.z - fz * 1.8 - fx * s], i * 3); D.v.set([-fx * v * 0.1 + fz * s * 1.8, 3 + 3.5 * rnd(), -fz * v * 0.1 - fx * s * 1.8], i * 3); D.r[i] = 0.02 + 0.05 * rnd() ** 2; D.t[i] = 0; D.lv[i] = W.level } }
      // Blasen am Wagen unter Wasser (und halb eingetaucht in Fahrt)
      if (c && W && (W.mode === 'under' || (W.mode === 'wade' && v > 3))) { bubAcc += dt * (W.mode === 'under' ? 10 + v : v); while (bubAcc >= 1) { bubAcc--; stats.bubbles += options.bubbles?.(c.x - Math.sin(c.yaw) * 1.5, c.y + 0.4, c.z - Math.cos(c.yaw) * 1.5, 1, 0.6) || 0 } }
      // Tropfen: Wurf mit Schwerkraft, verschwinden am Spiegel (fallend) oder nach Lebenszeit
      let n = 0; for (let i = 0; i < F.dropN; i++) { if (D.t[i] < 0) continue; D.t[i] += dt; D.v[i * 3 + 1] -= 9.81 * dt; for (let a = 0; a < 3; a++) D.p[i * 3 + a] += D.v[i * 3 + a] * dt
        if (D.t[i] > F.dropLife || (D.v[i * 3 + 1] < 0 && D.p[i * 3 + 1] < D.lv[i] - 0.05)) { D.t[i] = -1; continue }
        po.fromArray(D.p, i * 3); const near = cp ? Math.min(1, Math.max(0, (po.distanceTo(cp) - 1.5) / 2)) : 1, r = D.r[i] * (1 - 0.6 * (D.t[i] / F.dropLife) ** 2) * near; if (r < 0.004) continue   // nicht direkt vor der Linse
        vv.fromArray(D.v, i * 3); const sp = vv.length(); q.setFromUnitVectors(UP, sp > 1e-3 ? vv.multiplyScalar(1 / sp) : UP); sc.set(r * 0.8, r * (1.2 + sp * 0.18), r * 0.8); drops.setMatrixAt(n++, m4.compose(po, q, sc)) }   /* Tropfen in Flugrichtung gezogen statt Kugel */
      drops.count = n; drops.instanceMatrix.needsUpdate = true
      for (const r of rings) { if (r.userData.t < 0) continue; r.userData.t += dt; const u = r.userData.t / F.ringLife; if (u >= 1) { r.userData.t = -1; r.visible = false; continue }
        const s = r.userData.size * (0.5 + 1.6 * u); r.scale.set(s, 1, s); r.material.opacity = 0.7 * (1 - u) ** 1.5 }
    },
    dispose() { waterFxLog.dispose++; off?.(); options.expose?.(null, api); wGeo.dispose(); bGeo.dispose(); dGeo.dispose(); rGeo.dispose(); foamMat.dispose(); dMat.dispose(); rMat.dispose(); for (const r of rings) r.material.dispose(); root.clear() },
  }
  options.expose?.(api); return api
}
