// KFB toys: board-game pieces that react when something drives into them. Dominoes fall in a chain, houses of cards come down with the drag of
// paper, chess pieces topple with a cartoon squash, dice roll and come to rest, pawns and meeples are catapulted and bounce like hard rubber.
// Rigid bodies are Rapier 0.19.2, the version the game already uses. Costs nothing while nobody is near: a piece is an instance in the prop field
// (kfbfield.js) until the car comes close, then it becomes a body, and when it lies still it is frozen and later handed back.
// The knock-away numbers are the game's (PUPPE_STOSS, world/arena/arenaGegner.js, V-1868). Everything else here is own code.
import { chainAngle, hingeOffset } from './kfbdomino.js'

// One row per class of piece. shape: box | cyl | roundbox | hull. launch: share of the car's speed it takes along. up, side, spin: multiples of the
// game's knock values. squash: depth of the cartoon squash at a full hit (0 = rigid). weight: a heavy foot, the piece wobbles before it goes over.
// paper: air drag across the face (cards). loss: share of the car's speed this class asks the car to give up on a hit (reported in m/s).
export const TOY = {
  domino: { shape: 'box', density: 0.9, friction: 0.55, bounce: 0.45, launch: 0.95, up: 1.1, side: 1, spin: 0.7, squash: 0.14, damp: [0.04, 0.25], loss: 0.03 },
  chip: { shape: 'cyl', density: 1.2, friction: 0.5, bounce: 0.3, launch: 0.9, up: 0.9, side: 1, spin: 0.5, squash: 0.08, damp: [0.04, 0.3], loss: 0.01 },
  die6: { shape: 'roundbox', density: 0.8, friction: 0.62, bounce: 0.36, launch: 0.7, up: 0.3, side: 0.6, spin: 1.2, squash: 0.06, damp: [0.02, 0.1], loss: 0.1 },
  dieN: { shape: 'hull', density: 0.8, friction: 0.62, bounce: 0.36, launch: 0.7, up: 0.3, side: 0.6, spin: 1.2, squash: 0.06, damp: [0.02, 0.1], loss: 0.1 },
  meeple: { shape: 'hull', density: 0.6, friction: 0.6, bounce: 0.62, launch: 1.05, up: 1.5, side: 1.2, spin: 1, squash: 0.32, damp: [0.03, 0.2], loss: 0.02 },
  pawn: { shape: 'hull', density: 0.6, friction: 0.6, bounce: 0.62, launch: 1.05, up: 1.5, side: 1.2, spin: 1, squash: 0.32, damp: [0.03, 0.2], weight: 3, loss: 0.02 },
  chess: { shape: 'hull', density: 0.9, friction: 0.65, bounce: 0.28, launch: 0.6, up: 0.45, side: 0.9, spin: 0.45, squash: 0.3, damp: [0.05, 0.45], weight: 8, loss: 0.05 },
  card: { shape: 'box', density: 0.05, friction: 0.85, bounce: 0.04, launch: 0.5, up: 1.0, side: 0.7, spin: 1.3, squash: 0, damp: [0.15, 0.8], paper: 1, loss: 0 },
}
export const KNOCK = { auto: 0.8, autoSeite: 4, autoHoch: 3, drall: 7, autoV: 4 }   // the game's PUPPE_STOSS, unchanged: share of car speed, sideways and upward speed (m/s), spin (rad/s), slowest hit that throws (m/s)

export async function createToys(THREE, RAPIER, { field, classOf, ground, world = null, gravity = 13.5, carBody = false, budgetMs = 12, reach = 9, freezeAt = 34, giveBack = 150, pool = 96, maxBodies = 240, table = TOY, knock = KNOCK, fronts = null, squashSpring = [24, 0.3], domino = {}, now = () => performance.now(), step = null } = {}) {
  // step: true = this module steps the world (its own world, 120 Hz). false = the host owns the world and its one step; update() is then called once after each host step.
  const own = !world; if (own) { await RAPIER.init?.(); world = new RAPIER.World({ x: 0, y: -gravity, z: 0 }) }
  const stepping = step ?? own, STEP = stepping ? 1 / 120 : world.timestep; if (stepping) world.timestep = STEP
  const object3d = new THREE.Group(), pools = {}, shapes = {}, live = new Map(), events = [], stats = { steps: 0, ms: 0, hits: 0, spawned: 0, frozen: 0, given: 0 }
  const M = new THREE.Matrix4(), M2 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), P = new THREE.Vector3(), Sc = new THREE.Vector3(), v3 = new THREE.Vector3(), v4 = new THREE.Vector3(), ZERO = new THREE.Matrix4().makeScale(0, 0, 0)
  // --- what a kind looks like to the physics: taken once from its geometry (foot at the origin) ---
  const DIRS = (() => { const d = []; for (let i = 0; i < 44; i++) { const y = 1 - 2 * (i + 0.5) / 44, r = Math.sqrt(1 - y * y), a = i * 2.399963; d.push([Math.cos(a) * r, y, Math.sin(a) * r]) } return d })()
  const shapeOf = (kind) => { if (shapes[kind] !== undefined) return shapes[kind]; const cls = classOf(kind), list = field.meshes[kind]; if (!cls || !table[cls] || !list) return (shapes[kind] = null)
    const g = list[0].geometry, p = g.attributes.position; g.computeBoundingBox(); const b = g.boundingBox, c = [(b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2], h = [(b.max.x - b.min.x) / 2, (b.max.y - b.min.y) / 2, (b.max.z - b.min.z) / 2]
    const pts = []; for (const d of DIRS) { let best = -1e9, bi = 0; for (let i = 0; i < p.count; i++) { const s = p.getX(i) * d[0] + p.getY(i) * d[1] + p.getZ(i) * d[2]; if (s > best) { best = s; bi = i } } pts.push(p.getX(bi), p.getY(bi), p.getZ(bi)) }
    pools[kind] = list.map((src) => { const im = new THREE.InstancedMesh(src.geometry, src.material, pool); im.name = 'toy:' + kind; im.count = 0; im.castShadow = im.receiveShadow = true; im.frustumCulled = false; if (src.customDepthMaterial) im.customDepthMaterial = src.customDepthMaterial; Object.assign(im.userData, src.userData); object3d.add(im); return im })
    return (shapes[kind] = { cls, T: table[cls], c, h, pts, r: Math.hypot(h[0], h[1], h[2]) }) }
  const collider = (S, sc) => { const T = S.T, [hx, hy, hz] = S.h.map((v) => v * sc); let d
    if (T.shape === 'box') d = RAPIER.ColliderDesc.cuboid(hx, hy, hz).setTranslation(S.c[0] * sc, S.c[1] * sc, S.c[2] * sc)
    else if (T.shape === 'cyl') d = RAPIER.ColliderDesc.cylinder(hy, Math.max(hx, hz)).setTranslation(S.c[0] * sc, S.c[1] * sc, S.c[2] * sc)
    else if (T.shape === 'roundbox') { const r = Math.min(hx, hy, hz) * 0.16; d = RAPIER.ColliderDesc.roundCuboid(hx - r, hy - r, hz - r, r).setTranslation(S.c[0] * sc, S.c[1] * sc, S.c[2] * sc) }
    else d = RAPIER.ColliderDesc.convexHull(new Float32Array(S.pts.map((v) => v * sc))) || RAPIER.ColliderDesc.cuboid(hx, hy, hz).setTranslation(S.c[0] * sc, S.c[1] * sc, S.c[2] * sc)
    return d.setFriction(T.friction).setRestitution(T.bounce).setDensity(T.density) }
  // --- the ground under the action: a patch of triangles from the host's height function, laid again when the car has moved on ---
  let patch = null, patchAt = null
  const layGround = (x, z) => { if (!ground) return; if (patchAt && Math.hypot(x - patchAt.x, z - patchAt.z) < 26) return; const N = 56, cell = 2, x0 = Math.round(x / cell) * cell - N * cell / 2, z0 = Math.round(z / cell) * cell - N * cell / 2, vs = new Float32Array((N + 1) * (N + 1) * 3), ix = new Uint32Array(N * N * 6); let k = 0
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) { const px = x0 + i * cell, pz = z0 + j * cell; vs[k++] = px; vs[k++] = ground(px, pz); vs[k++] = pz } k = 0
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; ix[k++] = a; ix[k++] = c; ix[k++] = b; ix[k++] = b; ix[k++] = c; ix[k++] = d }
    const next = world.createCollider(RAPIER.ColliderDesc.trimesh(vs, ix).setFriction(0.8).setRestitution(0.2)); if (patch) world.removeCollider(patch, false); patch = next; patchAt = { x, z } }
  // --- the car. By default it is no body at all: the hit is the recipe below, as with the game's soldier puppets. carBody: true adds a moving box that nothing can pass through. ---
  let carRB = null, carKey = ''
  const moveCar = (car) => { if (!carBody) return; const [hw, hh, hl] = car.box.h, key = hw + ',' + hh + ',' + hl
    if (key !== carKey) { if (carRB) world.removeRigidBody(carRB); carRB = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(car.x, car.y, car.z)); world.createCollider(RAPIER.ColliderDesc.roundCuboid(hw - 0.15, hh - 0.15, hl - 0.15, 0.15).setTranslation(...car.box.c).setFriction(0.3).setRestitution(0.1), carRB); carKey = key }
    carRB.setNextKinematicTranslation({ x: car.x, y: car.y, z: car.z }); q.setFromAxisAngle(v3.set(0, 1, 0), car.yaw); carRB.setNextKinematicRotation({ x: q.x, y: q.y, z: q.z, w: q.w }) }
  // --- a piece: from the field into a body, and back ---
  const poseOf = (s, tilt = s.tilt ?? 0, lift = null) => { e.set(tilt, s.yaw ?? 0, s.roll ?? 0, 'YXZ'); q.setFromEuler(e); P.set(s.x, s.y, s.z); if (lift) { v3.set(0, lift.y, lift.z).applyAxisAngle(v4.set(0, 1, 0), s.yaw ?? 0); P.add(v3) } return { p: [P.x, P.y, P.z], q: [q.x, q.y, q.z, q.w] } }
  const slot = (kind) => { const used = pools[kind].used || (pools[kind].used = []); let i = used.indexOf(false); if (i < 0) { if (used.length >= pool) return -1; i = used.length; used.push(false) } used[i] = true; for (const im of pools[kind]) im.count = Math.max(im.count, i + 1); return i }
  const adopt = (s, mode) => { let L = live.get(s.id); if (L) return L; const S = shapeOf(s.kind); if (!S) return null; const i = slot(s.kind); if (i < 0) return null
    L = { s, S, i, sc: s.scale ?? 1, body: null, pose: poseOf(s), mode, sq: { a: 0, v: 0, n: [0, 1, 0] }, hitAt: -9, still: 0, pv: [0, 0, 0] }; live.set(s.id, L); field.take(s.id); stats.spawned++; return L }
  const embody = (L, asleep) => { if (L.body) return L.body; if (bodies() >= maxBodies) return null; const d = RAPIER.RigidBodyDesc.dynamic().setTranslation(...L.pose.p).setRotation({ x: L.pose.q[0], y: L.pose.q[1], z: L.pose.q[2], w: L.pose.q[3] }).setLinearDamping(L.S.T.damp[0]).setAngularDamping(L.S.T.damp[1]).setCcdEnabled(!L.S.T.paper).setSleeping(!!asleep)
    L.body = world.createRigidBody(d); world.createCollider(collider(L.S, L.sc), L.body)
    if (L.S.T.weight) { const r = Math.min(L.S.h[0], L.S.h[2]) * L.sc * 0.45; world.createCollider(RAPIER.ColliderDesc.ball(r).setTranslation(L.S.c[0] * L.sc, r * 1.35, L.S.c[2] * L.sc).setDensity(L.S.T.density * L.S.T.weight).setFriction(L.S.T.friction).setRestitution(L.S.T.bounce), L.body) }
    L.mode = 'body'; L.still = 0; return L.body }
  const freeze = (L) => { if (!L.body) return; const t = L.body.translation(), r = L.body.rotation(); L.pose = { p: [t.x, t.y, t.z], q: [r.x, r.y, r.z, r.w] }; world.removeRigidBody(L.body); L.body = null; L.mode = 'frozen'; L.sq.a = L.sq.v = 0; stats.frozen++ }
  const release = (L) => { if (L.body) world.removeRigidBody(L.body); pools[L.s.kind].used[L.i] = false; for (const im of pools[L.s.kind]) im.setMatrixAt(L.i, ZERO); live.delete(L.s.id); field.give(L.s.id); stats.given++ }
  const bodies = () => { let n = 0; for (const L of live.values()) if (L.body) n++; return n }
  const draw = (L) => { let p = L.pose.p, r = L.pose.q; if (L.body) { const t = L.body.translation(), o = L.body.rotation(); p = [t.x, t.y, t.z]; r = [o.x, o.y, o.z, o.w] }
    M.compose(P.set(p[0], p[1], p[2]), q.set(r[0], r[1], r[2], r[3]), Sc.set(L.sc, L.sc, L.sc))
    const a = L.sq.a; if (Math.abs(a) > 0.004) { const [nx, ny, nz] = L.sq.n, along = 1 - a, across = 1 / Math.sqrt(Math.max(0.3, along)), d = along - across, c = L.S.c   // squash along n, bulge across, volume kept; about the middle of the piece
      M2.set(across + d * nx * nx, d * nx * ny, d * nx * nz, 0, d * ny * nx, across + d * ny * ny, d * ny * nz, 0, d * nz * nx, d * nz * ny, across + d * nz * nz, 0, 0, 0, 0, 1)
      const ox = c[0] - (M2.elements[0] * c[0] + M2.elements[4] * c[1] + M2.elements[8] * c[2]), oy = c[1] - (M2.elements[1] * c[0] + M2.elements[5] * c[1] + M2.elements[9] * c[2]), oz = c[2] - (M2.elements[2] * c[0] + M2.elements[6] * c[1] + M2.elements[10] * c[2]); M2.elements[12] = ox; M2.elements[13] = oy; M2.elements[14] = oz; M.multiply(M2) }
    for (const im of pools[L.s.kind]) im.setMatrixAt(L.i, M) }
  const dent = (L, depth, wx, wy, wz) => { if (!L.S.T.squash || depth < 0.01) return; const r = L.body ? L.body.rotation() : { x: L.pose.q[0], y: L.pose.q[1], z: L.pose.q[2], w: L.pose.q[3] }; v3.set(wx, wy, wz); if (v3.lengthSq() < 1e-8) v3.set(0, 1, 0); v3.normalize().applyQuaternion(q.set(-r.x, -r.y, -r.z, r.w)); L.sq.n = [v3.x, v3.y, v3.z]; L.sq.a = Math.min(0.42, Math.max(L.sq.a, depth)); L.sq.v = 0 }
  // --- the hit: the game's knock-away recipe, scaled per class and by the car's weight class (car.weight01: 0 light, 1 heavy).
  // The event's loss is metres per second the hit asks the car to give up; a heavy car is asked for less. The car's owner decides. ---
  const knockAway = (L, car, t) => { const T = L.S.T, heavy = car.weight01 ?? 0.5, push = 0.85 + 0.3 * heavy, fx = Math.sin(car.yaw), fz = Math.cos(car.yaw), lx = fz, lz = -fx, sp = Math.hypot(car.vx, car.vz), b = L.body.translation(), sd = ((b.x - car.x) * lx + (b.z - car.z) * lz) >= 0 ? 1 : -1
    const edge = Math.min(1, Math.abs((b.x - car.x) * lx + (b.z - car.z) * lz) / car.box.h[0]), f = Math.min(1, Math.max(0, (sp - knock.autoV * 0.5) / (knock.autoV * 3))), fwd = knock.auto * T.launch / 0.8 * (1 - edge) + knock.auto * T.launch * edge   // dead centre it leaves at least as fast as the car, at the corner with the game's share
    const v = L.body.linvel(); L.body.setLinvel({ x: car.vx * Math.max(fwd * push, edge < 0.5 && carBody ? 1.02 : 0) + lx * sd * knock.autoSeite * T.side * f * push, y: Math.max(v.y, 0) + knock.autoHoch * T.up * f * push, z: car.vz * Math.max(fwd * push, edge < 0.5 && carBody ? 1.02 : 0) + lz * sd * knock.autoSeite * T.side * f * push }, true)
    const h = (Math.sin(L.i * 12.9898 + t * 7.13) * 43758.5453) % 1; L.body.setAngvel({ x: lx * knock.drall * T.spin * f + fx * h * 2, y: h * knock.drall * T.spin * 0.5 * f, z: lz * knock.drall * T.spin * f + fz * h * 2 }, true)
    dent(L, T.squash * Math.min(1, sp / 18), car.vx, 0, car.vz); L.hitAt = t; stats.hits++; events.push({ type: 'toy', kind: L.S.cls, speed: sp, loss: T.loss * sp * (1 - 0.6 * heavy), piece: L.s.kind, at: [b.x, b.y, b.z] }) }
  const inCar = (car, x, y, z, r, ahead = 0) => { const fx = Math.sin(car.yaw), fz = Math.cos(car.yaw), cx = car.x + car.vx * ahead, cz = car.z + car.vz * ahead, dx = x - cx, dz = z - cz, al = dx * fx + dz * fz - car.box.c[2], si = dx * fz - dz * fx - car.box.c[0], [hw, hh, hl] = car.box.h
    return Math.abs(al) < hl + r && Math.abs(si) < hw + r && y - r < car.y + car.box.c[1] + hh + 0.4 && y + r > car.y + car.box.c[1] - hh - 0.6 }
  let clock = 0, acc = 0
  function update(dt, { car }) { const t0 = now(); clock += dt; events.length = 0; layGround(car.x, car.z); const sp = Math.hypot(car.vx, car.vz)
    // 1 · runs that fall by the book (no bodies): the host says how far the front is
    if (fronts) { const seen = new Map(); for (const s of field.near(car.x, car.z, giveBack * 0.8, (s) => s.chain)) { if (!seen.has(s.group)) seen.set(s.group, fronts(s.group, s)); const u = seen.get(s.group), L0 = live.get(s.id); if (u == null || (L0 && L0.mode !== 'chain')) continue
        const fall = s.chain.fall ?? -1, S0 = shapeOf(s.kind); if (!S0) continue; const sc0 = s.scale ?? 1, thick = S0.h[2] * 2 * sc0, D = { ...domino, n: s.chain.n, gap: s.chain.gap, thick, height: S0.h[1] * 2 * sc0 }, ang = chainAngle(s.chain.i, u, D); if (ang <= 0 && !L0) continue; const L = L0 || adopt(s, 'chain'); if (!L) continue
        L.prev = L.ang ?? ang; L.ang = ang; L.pose = poseOf(s, fall * ang, hingeOffset(fall * ang, thick, fall)) } }
    // 2 · who is about to be hit: the piece itself, everything of its group, and what stands close by (asleep until touched)
    const look = sp * 0.16 + 1.2; for (const s of field.near(car.x + car.vx * 0.1, car.z + car.vz * 0.1, reach + sp * 0.3, (s) => shapeOf(s.kind))) { const L0 = live.get(s.id); if (L0 && L0.mode === 'body') continue; const S = shapes[s.kind], sc = s.scale ?? 1, px = L0 ? L0.pose.p[0] : s.x, py = (L0 ? L0.pose.p[1] : s.y) + S.c[1] * sc, pz = L0 ? L0.pose.p[2] : s.z
      if (!inCar(car, px, py, pz, S.r * sc * 0.7 + look * 0.5, 0.06)) continue
      const wake = (m, asleep) => { const L = live.get(m.id) || adopt(m, 'body'); if (!L || L.body) return; const was = L.mode; embody(L, asleep && was !== 'chain'); if (was === 'chain' && L.body && L.ang > 0.02 && L.ang < 1.2) { const w = (L.ang - L.prev) / Math.max(dt, 1e-3) * (m.chain.fall ?? -1), yaw = m.yaw ?? 0; L.body.setAngvel({ x: Math.cos(yaw) * w, y: 0, z: -Math.sin(yaw) * w }, true) } }
      wake(s, false); if (s.group) for (const m of field.near(s.x, s.z, 120, (m) => m.group === s.group && shapeOf(m.kind))) wake(m, false)
      for (const m of field.near(s.x, s.z, reach, (m) => shapeOf(m.kind))) wake(m, true) }
    // 3 · the steps
    acc = Math.min(acc + dt, 0.1); const n = stepping ? Math.floor(acc / STEP) : 1; acc = stepping ? acc - n * STEP : 0
    for (let k = 0; k < n; k++) { if (now() - t0 > budgetMs && k > 0) { stats.skipped = (stats.skipped || 0) + n - k; break } const tt = clock - acc - (n - 1 - k) * STEP; if (carRB || carBody) moveCar({ ...car, x: car.x - car.vx * (n - 1 - k) * STEP, z: car.z - car.vz * (n - 1 - k) * STEP })
      for (const L of live.values()) { const b = L.body; if (!b) continue; const T = L.S.T
        if (T.paper && !b.isSleeping()) { const r = b.rotation(), v = b.linvel(); v3.set(0, 0, 1).applyQuaternion(q.set(r.x, r.y, r.z, r.w)); const vn = v.x * v3.x + v.y * v3.y + v.z * v3.z, m = b.mass(), kA = Math.min(m * gravity / 9 * T.paper * Math.abs(vn), 0.5 * m / STEP), F = -kA * vn   // face-on a card falls at about 3 m/s
          const tx = v.x - vn * v3.x, ty = v.y - vn * v3.y, tz = v.z - vn * v3.z, tl = Math.hypot(tx, ty, tz) || 1, lead = L.S.h[1] * L.sc * 0.22 * Math.min(1, tl / 6), t = b.translation(); v4.set(L.S.c[0], L.S.c[1], L.S.c[2]).multiplyScalar(L.sc).applyQuaternion(q)
          b.resetForces(false); b.addForceAtPoint({ x: F * v3.x, y: F * v3.y, z: F * v3.z }, { x: t.x + v4.x + tx / tl * lead, y: t.y + v4.y + ty / tl * lead, z: t.z + v4.z + tz / tl * lead }, true) }   // the push sits ahead of the middle: that is what makes paper rock and tumble
        if (sp > knock.autoV * 0.5 && tt - L.hitAt > 0.5) { const t = b.translation(); v4.set(L.S.c[0], L.S.c[1], L.S.c[2]).multiplyScalar(L.sc).applyQuaternion(q.set(b.rotation().x, b.rotation().y, b.rotation().z, b.rotation().w)); if (inCar(car, t.x + v4.x - car.vx * (n - 1 - k) * STEP, t.y + v4.y, t.z + v4.z - car.vz * (n - 1 - k) * STEP, L.S.r * L.sc * 0.45)) { b.wakeUp(); knockAway(L, car, tt) } } }
      if (stepping) world.step(); stats.steps++
      for (const L of live.values()) if (L.body) { const v = L.body.linvel(), s2 = Math.hypot(v.x, v.y, v.z); if (s2 > 90) L.body.setLinvel({ x: v.x * 90 / s2, y: v.y * 90 / s2, z: v.z * 90 / s2 }, true) }   // nothing leaves faster than 90 m/s, whatever happened
      for (const L of live.values()) { const b = L.body; if (!b) continue; const v = b.linvel(), dx = v.x - L.pv[0], dy = v.y - L.pv[1], dz = v.z - L.pv[2], jolt = Math.hypot(dx, dy, dz); if (jolt > 3.5 && clock - L.hitAt > 0.08) dent(L, L.S.T.squash * Math.min(1, jolt / 16), dx, dy, dz); L.pv[0] = v.x; L.pv[1] = v.y; L.pv[2] = v.z
        const w = squashSpring[0], z = squashSpring[1]; L.sq.v += (-w * w * L.sq.a - 2 * z * w * L.sq.v) * STEP; L.sq.a += L.sq.v * STEP } }
    // 4 · rest, freeze, hand back; then draw
    for (const L of [...live.values()]) { const p = L.body ? L.body.translation() : { x: L.pose.p[0], y: L.pose.p[1], z: L.pose.p[2] }, d = Math.hypot(p.x - car.x, p.z - car.z)
      if (L.body) { L.still = L.body.isSleeping() ? L.still + dt : 0; if ((L.still > 1 && d > freezeAt) || d > giveBack * 0.6 || p.y < -60) freeze(L) }
      if (!L.body && L.mode !== 'chain' && d > giveBack) { release(L); continue } if (L.mode === 'chain' && d > giveBack * 0.9) { release(L); continue }
      draw(L) }
    for (const list of Object.values(pools)) for (const im of list) im.instanceMatrix.needsUpdate = true
    stats.ms += now() - t0; return events }
  const report = () => { let b = 0, awake = 0, frozen = 0, chain = 0; const cls = {}; for (const L of live.values()) { if (L.body) { b++; if (!L.body.isSleeping()) awake++ } else if (L.mode === 'chain') chain++; else frozen++; cls[L.S.cls] = (cls[L.S.cls] || 0) + 1 } return { pieces: live.size, bodies: b, awake, frozen, byTheBook: chain, perClass: cls, hits: stats.hits, taken: stats.spawned, handedBack: stats.given, steps: stats.steps, stepsSkipped: stats.skipped || 0, msPerStep: +(stats.ms / Math.max(1, stats.steps)).toFixed(3) } }
  return { object3d, update, report, world, live, table, knock }
}
