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
    speed: 5.4, sprintMul: 1.75, gravity: 30, eyeUp: 1.4,
    turnRate: 2.0,       // A/D turn the walker itself — same feel as the flight yaw
    minP: 0.05, maxP: 1.2, minD: 0, maxD: 20,
    stepMax: 1.5,        // rise you can walk straight up (smoothed, no pop)
    autoJumpMax: 4.2,    // one whole cube step — the launch speed is scaled to it
    hopClear: 0.55,      // extra apex above the ledge so we land ON it
    radius: 0.55,        // body radius — keeps the pet OUT of the cube face
    /* ═══ v25.2q/1 · DER KÖRPER IST EINE SCHEIBE, KEIN PUNKT ══════════════════════════
       `bodyArc` ist der halbe Öffnungswinkel der Führungskante, an der geprobt wird. Die vorige
       Fassung probte EINEN Punkt `radius` voraus — eine Säulenecke, die 40° schräg vor dem
       Mittelpunkt steht, liegt dann noch im Körper, aber nicht auf der Probe: das Pet fährt mit
       der Schulter hinein, und ab da ist es drin. 55° deckt die halbe vordere Hälfte ab; drei
       Punkte (geradeaus + beide Flanken) kosten zwei Bodenabfragen mehr je Bild. */
    bodyArc: 0.96,
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
  /* ═══ v25.2q/2 · DER WILLENTLICHE SPRUNG WAR SCHWÄCHER ALS DER AUTOMATISCHE ════════════
     `jumpV: 14.5` bei `gravity: 30` ergibt einen Gipfel von 14,5²/60 = **3,5 u**. Der
     vorausschauende Auto-Hop nimmt dagegen Stufen bis `autoJumpMax` = **4,2 u** und rechnet
     seine Absprunggeschwindigkeit dafuer aus (`sqrt(2g(rise+hopClear))` = 16,9 u/s). Wer also
     eine 4,2-u-Stufe ansprang, kam nicht hoch — waehrend Hineinlaufen ohne Taste sie genommen
     hätte. Die Taste war schwaecher als Nichtstun; das ist Georgs „Sprung ist buggy", und es ist
     ein Zahlenfehler, kein Gefühl.
     Jetzt wird `jumpV` aus derselben Formel ABGELEITET, die der Auto-Hop benutzt — dieselbe
     Wahrheit, eine Quelle. Ein ausdrücklich uebergebenes `jumpV` gewinnt weiter (Panel/Preset). */
  if (!(opts.params && opts.params.jumpV > 0)) {
    P.jumpV = Math.sqrt(2 * P.gravity * (P.autoJumpMax + P.hopClear));
  }
  /* v25.2q/3 · EINE Toleranz für beide Schwellen. `stepMax` (1,5) ist zahlengleich mit der
     Terrassenstufe des Geränds (CELL/2 = 1,5 u) — eine Stufe landet damit exakt auf der Grenze,
     und Rundungsrest entscheidet je Bild neu, ob sie begehbar ist oder einen Hop auslöst. Das
     Ergebnis war Zappeln an Terrassenkanten. Mit derselben Toleranz in BEIDEN Vergleichen fällt
     die 1,5-u-Stufe eindeutig auf die begehbare Seite. */
  const TOL = 0.01;

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
      /* ═══ v25.2q/1 · KOLLISION: FÜHRUNGSKANTE STATT PUNKT, UND EIN AUSWEG ══════════════
         Zwei Fehler, die zusammen das Steckenbleiben an Säulen ergaben (SPRINT_v25.md).
         1 · Geprobt wurde EIN Punkt voraus (§ `bodyArc`) — eine Ecke schräg vor der Mitte lag im
             Körper, aber nicht auf der Probe. Das Pet fuhr mit der Schulter hinein.
         2 · Und dann kam es nicht mehr heraus, und DAS war der eigentliche Fehler: `frei()`
             fragt „ist das Ziel begehbar", und wenn die Mitte schon in der Säule steht, ist die
             Umgebung in JEDER Richtung unbegehbar — auch nach hinten. Es gab keinen Satz, der
             sagt, was gilt, wenn man bereits drin ist. Ein Zustand ohne Ausweg ist kein
             Kollisionsfehler mehr, sondern eine fehlende Regel.
         Die Regel: steht die Mitte in etwas, ist jeder Schritt erlaubt, der die Bodenhöhe nicht
         ERHÖHT. Das ist monoton — der Weg nach draußen geht garantiert bergab — und kann nie
         zum Klettern mißbraucht werden, weil Aufwärts gerade das Verbotene ist. */
      const walkable = (nx, nz) => pos.y >= groundHeightAt(nx, nz) - P.stepMax - TOL;
      const cA = Math.cos(P.bodyArc), sA = Math.sin(P.bodyArc);
      const frei = (nx, nz, dx, dz) => walkable(nx, nz)
        && walkable(nx + dx * P.radius, nz + dz * P.radius)
        && walkable(nx + (dx * cA - dz * sA) * P.radius, nz + (dx * sA + dz * cA) * P.radius)
        && walkable(nx + (dx * cA + dz * sA) * P.radius, nz + (dz * cA - dx * sA) * P.radius);
      const drin = !walkable(pos.x, pos.z);
      const hJetzt = drin ? groundHeightAt(pos.x, pos.z) : 0;
      const darf = (nx, nz, dx, dz) => (drin
        ? groundHeightAt(nx, nz) <= hJetzt + TOL
        : frei(nx, nz, dx, dz));
      const nx = pos.x + _move.x * step, nz = pos.z + _move.z * step;
      if (darf(nx, nz, _move.x, _move.z)) { pos.x = nx; pos.z = nz; blocked = false; hSpeed = sp; }
      else {
        // slide: keep whichever single axis is still free
        let slid = false;
        if (darf(nx, pos.z, Math.sign(_move.x), 0)) { pos.x = nx; slid = true; }
        else if (darf(pos.x, nz, 0, Math.sign(_move.z))) { pos.z = nz; slid = true; }
        blocked = !slid;
        hSpeed = slid ? sp * 0.7 : 0;
      }

      // --- predictive auto-hop: fire while the ledge is still a steig-time away
      if (onGround && hopWind <= 0 && vy <= 0.01) {
        const g = P.gravity;
        for (let d = P.radius + 0.15; d <= P.probeMax; d += P.probeStep) {
          const rise = groundHeightAt(pos.x + _move.x * d, pos.z + _move.z * d) - pos.y;
          if (rise <= P.stepMax + TOL) continue;        // flat / walkable — keep scanning (§ TOL)
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
    /* v25.2d · Der Kameraabstand ist bisher nur relativ verstellbar (`zoom`). Wenn die KÖRPERGRÖSSE
       des Pets sich ändert, muß er absolut mitgehen: derselbe Bildanteil bei dreifacher Figur
       heißt dreifacher Abstand. Ein relatives `zoom(d)` müßte dazu den Istwert kennen — der Aufrufer
       hat ihn, aber dann steht die Rechnung an zwei Stellen. */
    setCamDist(d) { cam.dist = Math.max(P.minD, Math.min(P.maxD, d)); },
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
