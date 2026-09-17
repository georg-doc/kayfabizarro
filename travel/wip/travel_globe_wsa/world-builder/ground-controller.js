// WB0 spherical Ground controller.
// Donor behavior: kayfabizarro/travel/travel-v16/terrain-v16/walk-controller.js + travel-poc.js.
// Preserve the established KFB Ground mapping instead of inventing another scheme:
// W/S = forward/back, A/D = turn walker, Q/E = strafe left/right, Shift = run, Space = jump.
// The donor is planar, so WB0 maps that intent to the Globe tangent frame and reads the accepted
// baked mesh through boden-lesung.js.

import { createBodenLesung } from '../globe-v13/boden-lesung.js';

export function createGroundController({ THREE, camera, globe, renderer, bodyHeight = 0.022 }) {
  const Y = new THREE.Vector3(0, 1, 0);
  const X = new THREE.Vector3(1, 0, 0);
  const keys = new Set();
  const dir = new THREE.Vector3(0, 1, 0);
  const up = new THREE.Vector3(), east = new THREE.Vector3(), north = new THREE.Vector3();
  const forward = new THREE.Vector3(), right = new THREE.Vector3(), moveTangent = new THREE.Vector3();
  const desiredCam = new THREE.Vector3(), desiredLook = new THREE.Vector3();
  const playerPos = new THREE.Vector3(), lookAt = new THREE.Vector3();
  const basis = new THREE.Matrix4(), q = new THREE.Quaternion();
  const qSurface = new THREE.Quaternion();
  const groundReader = createBodenLesung({ THREE, mesh: globe.mesh, radius: 5 });

  const params = {
    speed: bodyHeight * 1.15,
    runMul: 1.75,
    backMul: 0.55,
    turnRate: 2.35,
    // Cartoon-ish but bounded jump: about one body-height apex and ~0.9 s airborne.
    jumpSpeed: bodyHeight * 4.5,
    gravity: bodyHeight * 10.0,
    footLift: bodyHeight * 0.018,
    cameraDistance: bodyHeight * 7.0,
    cameraHeight: bodyHeight * 4.1,
    cameraLookHeight: bodyHeight * 1.15,
    cameraLookAhead: bodyHeight * 1.6,
    cameraSmooth: 14,
    fov: 42,
  };

  let enabled = false;
  let heading = 0;
  let moving = false;
  let running = false;
  let speed = 0;
  let inputTurn = 0, inputThrottle = 0, inputStrafe = 0;
  let onGround = true;
  let jumpOffset = 0;
  let verticalVelocity = 0;
  let jumpQueued = false;
  let playerRoot = null;
  let snappedCamera = false;
  let presentationUpdater = null;

  function basisAt(n) {
    up.copy(n).normalize();
    east.crossVectors(Y, up);
    if (east.lengthSq() < 1e-8) east.crossVectors(X, up);
    east.normalize();
    north.crossVectors(up, east).normalize();
    forward.copy(north).multiplyScalar(Math.cos(heading)).addScaledVector(east, Math.sin(heading)).normalize();
    right.crossVectors(up, forward).normalize();
  }

  function radiusAt(n) {
    return groundReader.radiusAt(n.clone().normalize()) || 5;
  }

  function syncPlayer() {
    basisAt(dir);
    playerPos.copy(dir).multiplyScalar(radiusAt(dir) + params.footLift + jumpOffset);
    if (playerRoot) {
      playerRoot.position.copy(playerPos);
      basis.makeBasis(right, up, forward);
      q.setFromRotationMatrix(basis);
      playerRoot.quaternion.copy(q);
    }
  }

  function syncCamera(dt, snap = false) {
    basisAt(dir);
    desiredCam.copy(playerPos)
      .addScaledVector(forward, -params.cameraDistance)
      .addScaledVector(up, params.cameraHeight);
    desiredLook.copy(playerPos)
      .addScaledVector(up, params.cameraLookHeight)
      .addScaledVector(forward, params.cameraLookAhead);
    if (snap || !snappedCamera) {
      camera.position.copy(desiredCam);
      lookAt.copy(desiredLook);
      snappedCamera = true;
    } else {
      const a = 1 - Math.exp(-params.cameraSmooth * Math.max(0.001, dt));
      camera.position.lerp(desiredCam, a);
      lookAt.lerp(desiredLook, a);
    }
    camera.up.copy(up);
    if (Math.abs(camera.fov - params.fov) > 0.01) {
      camera.fov = params.fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(lookAt);
  }

  function stateSnapshot() {
    return {
      direction: dir.clone(), heading, moving, running, speed,
      onGround, jumping: !onGround, jumpOffset, verticalVelocity,
      input: { turn: inputTurn, throttle: inputThrottle, strafe: inputStrafe },
      position: playerPos.clone(), forward: forward.clone(), right: right.clone(), bodyHeight,
    };
  }

  function update(dt) {
    if (!enabled) return;

    // Same Ground controls already used by Travel v16, extended with its documented sprint intent:
    // W/S move, A/D turn, Q/E strafe, Shift run. Space is one-shot jump input.
    const turn = (keys.has('KeyA') ? 1 : 0) - (keys.has('KeyD') ? 1 : 0);
    const throttle = (keys.has('KeyW') ? 1 : 0) - (keys.has('KeyS') ? params.backMul : 0);
    const strafe = (keys.has('KeyE') ? 1 : 0) - (keys.has('KeyQ') ? 1 : 0);
    running = keys.has('ShiftLeft') || keys.has('ShiftRight');
    inputTurn = turn; inputThrottle = throttle; inputStrafe = strafe;

    if (jumpQueued && onGround) {
      verticalVelocity = params.jumpSpeed;
      onGround = false;
    }
    jumpQueued = false;

    heading += turn * params.turnRate * dt;
    basisAt(dir);

    // Build one tangent movement vector. Clamp the combined input so diagonals are not faster.
    const rawMagnitude = Math.hypot(strafe, throttle);
    const moveMagnitude = Math.min(1, rawMagnitude);
    moveTangent.set(0, 0, 0).addScaledVector(forward, throttle).addScaledVector(right, strafe);
    if (rawMagnitude > 1e-8) moveTangent.multiplyScalar(1 / rawMagnitude);

    const r = radiusAt(dir);
    const locomotionSpeed = params.speed * (running ? params.runMul : 1);
    const distance = moveMagnitude * locomotionSpeed * dt;
    if (distance > 1e-8) {
      // Great-circle step in the selected local tangent direction. The actor keeps its heading while
      // strafing; Q/E move sideways instead of secretly becoming another turn input.
      const angle = distance / Math.max(0.001, r);
      const c = Math.cos(angle), s = Math.sin(angle);
      dir.multiplyScalar(c).addScaledVector(moveTangent, s).normalize();
      moving = true;
      speed = distance / Math.max(dt, 1e-4);
    } else {
      moving = false;
      speed = 0;
    }

    if (!onGround) {
      verticalVelocity -= params.gravity * dt;
      jumpOffset += verticalVelocity * dt;
      if (jumpOffset <= 0 && verticalVelocity <= 0) {
        jumpOffset = 0;
        verticalVelocity = 0;
        onGround = true;
      }
    } else {
      jumpOffset = 0;
      verticalVelocity = 0;
    }

    syncPlayer();
    syncCamera(dt);
    if (presentationUpdater) presentationUpdater(dt, stateSnapshot());
  }

  function resetFromFlight(carpet) {
    const p = carpet.worldPos();
    if (p && p.lengthSq() > 1e-8) dir.copy(p).normalize();
    heading = Number(carpet.state && carpet.state.heading || 0);
    onGround = true;
    jumpOffset = 0;
    verticalVelocity = 0;
    jumpQueued = false;
    snappedCamera = false;
    syncPlayer();
    syncCamera(1 / 60, true);
  }

  function setSurfaceDirection(n, hdg = heading) {
    dir.copy(n).normalize();
    heading = hdg;
    onGround = true;
    jumpOffset = 0;
    verticalVelocity = 0;
    jumpQueued = false;
    snappedCamera = false;
    syncPlayer();
    syncCamera(1 / 60, true);
  }

  function toFlightPose() {
    qSurface.setFromUnitVectors(Y, dir);
    return {
      qPosition: qSurface.clone(),
      heading,
      altitude: Math.max(0, radiusAt(dir) - 5) + bodyHeight * 0.35 + jumpOffset,
    };
  }

  function onKeyDown(e) {
    if (!enabled) return;
    const held = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ShiftLeft', 'ShiftRight'];
    if (held.includes(e.code)) {
      keys.add(e.code);
      e.preventDefault();
      return;
    }
    if (e.code === 'Space') {
      if (!e.repeat) jumpQueued = true;
      e.preventDefault();
    }
  }
  function onKeyUp(e) { keys.delete(e.code); }
  function clearKeys() {
    keys.clear();
    jumpQueued = false;
    inputTurn = 0; inputThrottle = 0; inputStrafe = 0;
    running = false;
  }
  function onWheel(e) {
    if (!enabled) return;
    params.cameraDistance = THREE.MathUtils.clamp(params.cameraDistance + Math.sign(e.deltaY) * bodyHeight * 0.7,
      bodyHeight * 3.5, bodyHeight * 14);
  }

  addEventListener('keydown', onKeyDown, { passive: false });
  addEventListener('keyup', onKeyUp);
  addEventListener('blur', clearKeys);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearKeys(); });
  renderer.domElement.addEventListener('wheel', onWheel, { passive: true });

  return {
    name: 'wb0-ground-controller',
    params,
    update,
    resetFromFlight,
    setSurfaceDirection,
    toFlightPose,
    radiusAt,
    setPlayerRoot(root) { playerRoot = root || null; syncPlayer(); },
    setPresentationUpdater(fn) { presentationUpdater = typeof fn === 'function' ? fn : null; },
    queueJump() { if (enabled && onGround) jumpQueued = true; },
    setEnabled(on) { enabled = !!on; if (!enabled) clearKeys(); },
    get enabled() { return enabled; },
    get state() { return stateSnapshot(); },
    dispose() {
      removeEventListener('keydown', onKeyDown);
      removeEventListener('keyup', onKeyUp);
      removeEventListener('blur', clearKeys);
      renderer.domElement.removeEventListener('wheel', onWheel);
    },
  };
}
