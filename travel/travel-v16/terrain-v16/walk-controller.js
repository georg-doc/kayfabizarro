// ============================================================================
// walk-controller.js — KFB Travel · Slice 4 · Ground / walk controller
// ----------------------------------------------------------------------------
// Third-person ground movement, ported from PolyGarden's Player controller
// (Elisas Voxel-Werkstatt): WASD relative to the walker, Q/E strafe, Shift
// sprints, Space jumps; gravity vy-=g·dt, land on the surface. Ground height
// comes from the caller (terrain.groundHeightAt).
//
// Ownership (mirror of flight-controller): owns MOVEMENT + its own orbit-camera
// STATE only — no rendering, no pet. Publishes vehicle-like state the runner's
// camera + pet read. The runner decides fly⇄walk and reparents the pet.
//
// v4.1 fixes (Georg, 24.07.):
//  · SEITENVERKEHRT: A/D drehten nach rechts/links, Q/E strafte falsch herum.
//    Ursache: heading -= turn (statt +=) und _right zeigte nach LINKS
//    (right = cross(forward, up) = (−cos h, 0, sin h), nicht (cos h, 0, −sin h)).
//  · KÖRPER-RADIUS: Kollision testet jetzt einen Punkt `radius` VOR der Mitte —
//    das Pet läuft nicht mehr in den Cube hinein, sondern stellt sich davor.
//  · VORAUSSCHAUENDER AUTO-HOP mit Anticipation: der Absprung wird gezündet,
//    solange die Kante noch eine Steigzeit entfernt ist (d ≤ v·t_up), die
//    Absprunggeschwindigkeit wird auf die nötige Höhe gerechnet
//    (v = √(2g·(rise+clear))) — Apex liegt ÜBER der Kante, nicht darin.
//    Davor läuft ein kurzer Windup (`crouch` 0..1, ~90 ms, Speed gedrosselt),
//    den die Pet-Kinetik als Ducken/Ausholen liest (cartoon-motion §Snappiness).
//
//   const w = createWalkController({ THREE });
//   w.reset(x, z, groundY, heading);
//   w.setInput(ix, iy);            // joystick / normalized WASD (x=strafe, y=fwd)
//   w.orbit(dx, dy); w.zoom(dz);
//   w.jump();
//   w.update(dt, { turn, sprint }, groundHeightAt);
//   w.state → { position, facing, heading, forward, onGround, moving, speed, vy,
//               turnRate, crouch, impact, autoHop, blocked, cam:{yawOff,pitch,dist} }
// ============================================================================

export function createWalkController(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    speed: 5.4, sprintMul: 1.75, jumpV: 14.5, gravity: 30, eyeUp: 1.4,
    turnRate: 2.0,       // A/D turn the walker itself — same feel as the flight yaw
    minP: 0.05, maxP: 1.2, minD: 0, maxD: 20,
    stepMax: 1.5,        // rise you can walk straight up (smoothed, no pop)
    autoJumpMax: 4.2,    // one whole cube step — the launch speed is scaled to it
    hopClear: 0.55,      // extra apex above the ledge so we land ON it
    radius: 0.55,        // body radius — keeps the pet OUT of the cube face
    probeStep: 0.4,      // resolution of the ledge scan ahead
    probeMax: 4.0,       // how far ahead we look for that ledge
    windup: 0.09,        // anticipation before a hop releases (compressed, real-time)
    windupSlow: 0.55,    // horizontal speed during the windup (energy load)
    stepUpSpeed: 14,     // how fast a small step-up is climbed
    // S79c · GUMMIBALL: ein Aufprall über `bounceMin` prellt mit `bounce` der Aufprallgeschwindigkeit
    // wieder ab, höchstens `bounceMax` Mal — mittelhart, mit fallender Höhe. Der Rückweg ist
    // eingebaut: unter der Schwelle liegt Ruhe, ein neuer Sprung setzt den Zähler zurück.
    // Gemessen: Absprung 14,5 u/s → Prellen 4,9 → 1,7 u/s, danach Ruhe = zwei fallende Hüpfer.
    bounce: 0.34, bounceMin: 3.5, bounceMax: 2,
    // S79e · Höhenwechsel ist eine BEWEGUNG, kein Schnitt: `floatTo(y)` steigt/sinkt mit begrenzter
    // Rate (schnell bei großem Abstand, ruhig bei kleinem) statt zu teleportieren. Solange
    // geschwebt wird, ruht die Schwerkraft — sonst kämpfen zwei Systeme um dieselbe Zahl.
    floatMin: 5, floatMax: 22,
  }, opts.params || {});

  const pos = new THREE.Vector3(0, 6, 0);
  const input = new THREE.Vector2();          // x = strafe, y = forward
  const cam = { yawOff: 0, pitch: 0.42, dist: 9 };
  let vy = 0, onGround = true, facing = 0, heading = 0, moving = false, turnRate = 0;
  let blocked = false, autoHop = false, hSpeed = 0;
  let hopWind = 0, hopVy = 0, crouch = 0, impact = 0;
  let bounceIx = 0, travel = 0, floatY = null, floatSig = 0, _px = 0, _pz = 0;
  const forward = new THREE.Vector3(0, 0, 1);
  const _fwd = new THREE.Vector3(), _right = new THREE.Vector3(), _move = new THREE.Vector3();
  let _sprint = false;

  function update(dt, ctrl, groundHeightAt) {
    ctrl = ctrl || {};
    _px = pos.x; _pz = pos.z;
    const sprint = !!ctrl.sprint; _sprint = sprint;
    // A/D turn the WALKER (not the camera). heading GROWS to the left: forward
    // (sin h, cos h) swings toward +x, which is screen-left with the cam behind.
    const turn = ctrl.turn || 0;
    heading += turn * P.turnRate * dt;
    facing = heading;
    turnRate = turn * P.turnRate;
    _fwd.set(Math.sin(heading), 0, Math.cos(heading));
    _right.set(-Math.cos(heading), 0, Math.sin(heading));   // right = cross(forward, up)
    forward.copy(_fwd);

    let ix = input.x, iy = input.y;
    const len = Math.hypot(ix, iy); if (len > 1) { ix /= len; iy /= len; }
    moving = Math.hypot(ix, iy) > 0.08;
    _move.set(0, 0, 0).addScaledVector(_fwd, iy).addScaledVector(_right, ix);
    if (moving) _move.normalize();

    // --- windup: anticipation ticks first, then the launch releases -----------
    let speedMul = 1;
    autoHop = false;
    if (hopWind > 0) {
      hopWind -= dt; speedMul = P.windupSlow;
      crouch = Math.min(1, crouch + dt / Math.max(0.02, P.windup));
      if (hopWind <= 0) { vy = hopVy; onGround = false; autoHop = true; hopWind = 0; crouch = 0; bounceIx = 0; floatY = null; }
    } else if (crouch > 0) {
      crouch = Math.max(0, crouch - dt * 8);
    }

    const sp = P.speed * (sprint ? P.sprintMul : 1) * speedMul;
    hSpeed = 0;

    if (moving) {
      const step = sp * dt;
      // Cube collision with a BODY RADIUS: you may enter a cell only if your feet
      // are within stepMax of its top — and we test a point `radius` ahead of the
      // new centre, so the pet stops in front of the face instead of inside it.
      const walkable = (nx, nz) => pos.y >= groundHeightAt(nx, nz) - P.stepMax;
      const free = (nx, nz, dx, dz) => walkable(nx + dx * P.radius, nz + dz * P.radius) && walkable(nx, nz);
      const nx = pos.x + _move.x * step, nz = pos.z + _move.z * step;
      if (free(nx, nz, _move.x, _move.z)) { pos.x = nx; pos.z = nz; blocked = false; hSpeed = sp; }
      else {
        // slide: keep whichever single axis is still free
        let slid = false;
        if (free(nx, pos.z, Math.sign(_move.x), 0)) { pos.x = nx; slid = true; }
        else if (free(pos.x, nz, 0, Math.sign(_move.z))) { pos.z = nz; slid = true; }
        blocked = !slid;
        hSpeed = slid ? sp * 0.7 : 0;
      }

      // --- predictive auto-hop: fire while the ledge is still a steig-time away
      if (onGround && hopWind <= 0 && vy <= 0.01) {
        const g = P.gravity;
        for (let d = P.radius + 0.15; d <= P.probeMax; d += P.probeStep) {
          const rise = groundHeightAt(pos.x + _move.x * d, pos.z + _move.z * d) - pos.y;
          if (rise <= P.stepMax) continue;              // flat / walkable — keep scanning
          if (rise > P.autoJumpMax) break;              // that's a wall, not a step: slide
          const v = Math.sqrt(2 * g * (rise + P.hopClear));
          const tUp = v / g;                            // time to the apex
          // launch distance = horizontal travel during the rise (+ the windup)
          if (d - P.radius <= sp * tUp + P.windup * sp) { hopVy = v; hopWind = P.windup; }
          break;                                        // the NEAREST obstacle decides
        }
      }
    } else { blocked = false; }

    // gravity + ground contact (ground height from the caller = terrain)
    const gy = groundHeightAt(pos.x, pos.z);
    floatSig = 0;
    if (floatY != null) {
      // --- fließender Höhenwechsel (S79e): steigen/sinken mit Rate, nie schneiden ---
      const gap = floatY - pos.y;
      if (Math.abs(gap) <= 0.05) { pos.y = floatY; floatY = null; vy = 0; onGround = true; }
      else {
        const rate = Math.max(P.floatMin, Math.min(P.floatMax, 3 + Math.abs(gap) * 2.4));
        const step = Math.sign(gap) * rate * dt;
        pos.y += Math.abs(step) > Math.abs(gap) ? gap : step;
        floatSig = Math.sign(gap) * Math.min(1, rate / P.floatMax);
        vy = 0; onGround = true; bounceIx = 0;
      }
    } else {
      vy -= P.gravity * dt; pos.y += vy * dt;
      if (pos.y <= gy) {
        const rise = gy - pos.y;
        if (!onGround) impact = Math.abs(vy);          // touchdown speed → land squash
        if (onGround && rise > 0.02 && rise < P.stepMax) { pos.y = Math.min(gy, pos.y + P.stepUpSpeed * dt); vy = 0; onGround = true; }
        else if (onGround && rise >= P.stepMax) { floatY = gy; }   // Plateau: getragen, nicht gesetzt
        else {
          pos.y = gy;
          const hit = Math.abs(vy);
          // Gummiball: abprellen statt kleben — bis `bounceMax` Mal, jedes Mal flacher.
          if (hit > P.bounceMin && bounceIx < P.bounceMax) { vy = hit * P.bounce; bounceIx++; onGround = false; }
          else { vy = 0; onGround = true; bounceIx = 0; }
        }
      } else onGround = false;
    }

    // --- Tempo GEMESSEN, nicht geschätzt (S79b): die zurückgelegte Strecke pro Frame ist die
    // einzige Zahl, an der die Füße hängen dürfen. `travel` ist ihr Integral — die Pet-Kinetik
    // treibt den Gehzyklus damit, also kann ein Standbein nicht mehr rutschen.
    const dxm = pos.x - _px, dzm = pos.z - _pz, dist = Math.hypot(dxm, dzm);
    travel += dist;
    hSpeed = dist / Math.max(dt, 1e-4);
  }

  return {
    name: 'walk-controller', update,
    setInput(x, y) { input.set(x, y); },
    orbit(dx, dy) { cam.yawOff = Math.max(-2.6, Math.min(2.6, cam.yawOff - dx * 0.005)); cam.pitch = Math.max(P.minP, Math.min(P.maxP, cam.pitch - dy * 0.005)); },
    recenterView(dt) { cam.yawOff += (0 - cam.yawOff) * Math.min(1, dt * 1.8); },
    zoom(dz) { cam.dist = Math.max(P.minD, Math.min(P.maxD, cam.dist + dz)); },
    jump() { if (onGround && hopWind <= 0) { hopVy = P.jumpV; hopWind = P.windup; bounceIx = 0; floatY = null; } },
    // Ein Höhenwechsel von außen (Rettung aus einer Säule, Plateau): fließend, nie geschnitten.
    floatTo(y) { if (floatY == null || Math.abs(y - floatY) > 0.05) floatY = y; },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    // Rettung von außen: setzt den Walker auf eine bekannte Oberfläche (steckt er in einem Cube)
    lift(y) { pos.y = y; vy = 0; onGround = true; hopWind = 0; crouch = 0; floatY = null; bounceIx = 0; },
    reset(x, z, groundY, hdg) {
      pos.set(x || 0, (groundY || 0), z || 0); vy = 0; onGround = true;
      heading = hdg || 0; facing = heading; cam.yawOff = 0;
      hopWind = 0; crouch = 0; impact = 0; hSpeed = 0;
      bounceIx = 0; floatY = null; floatSig = 0; travel = 0; _px = pos.x; _pz = pos.z;
    },
    get eyeUp() { return P.eyeUp; },
    get state() {
      return {
        position: pos, facing, heading, forward, onGround, moving, vy, turnRate, cam,
        blocked, autoHop, crouch, impact, speed: hSpeed, sprinting: !!_sprint,
        travel, float: floatSig, floating: floatSig !== 0, bouncing: bounceIx > 0, bounceIx,
        walkRef: P.speed, runRef: P.speed * P.sprintMul,
      };
    },
  };
}
