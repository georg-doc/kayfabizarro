// WB0 spherical Ground controller.
// Donor behavior: kayfabizarro/travel/travel-v16/terrain-v16/walk-controller.js + travel-poc.js.
// Ground browser semantics after human test:
// W/S = forward/back, A/D = visible left/right turn, Q/E = strafe left/right,
// Shift = run, Space = Ground-only jump, RMB drag = free camera, wheel = smooth zoom.
// The donor is planar, so WB0 maps that intent to the Globe tangent frame and reads the accepted
// baked mesh through boden-lesung.js. Additive support surfaces may RAISE the standing radius,
// but terrain remains the base height truth and this module remains the only Ground movement writer.

import { createBodenLesung } from '../globe-v13/boden-lesung.js';

export function createGroundController({ THREE, camera, globe, renderer, bodyHeight = 0.022 }) {
  const Y = new THREE.Vector3(0, 1, 0);
  const X = new THREE.Vector3(1, 0, 0);
  const keys = new Set();
  const dir = new THREE.Vector3(0, 1, 0);
  const up = new THREE.Vector3(), east = new THREE.Vector3(), north = new THREE.Vector3();
  const forward = new THREE.Vector3(), right = new THREE.Vector3(), moveTangent = new THREE.Vector3();
  const cameraForward = new THREE.Vector3();
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
    cameraYawSensitivity: 0.0028,
    cameraPitchSensitivity: 0.0022,
    cameraPitchMin: -0.35,
    cameraPitchMax: 0.55,
    // Continuous wheel/trackpad zoom. Previous sign-only 0.7 body-height jumps were too sensitive.
    cameraZoomSensitivity: 0.00045,
    cameraDistanceMin: bodyHeight * 3.5,
    cameraDistanceMax: bodyHeight * 14,
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
  let supportResolver = null;
  let currentSupport = {
    radius: 5,
    terrainRadius: 5,
    delta: 0,
    source: 'terrain',
    kind: 'terrain',
    id: 'terrain',
  };

  // Camera orbit is presentation only. Heading remains owned by keyboard/controller input.
  let cameraYaw = 0;
  let cameraPitch = 0;
  let cameraDragging = false;
  let cameraPointerId = null;
  let pointerX = 0, pointerY = 0;
  let cameraDragPixels = 0;

  function wrapPi(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function basisAt(n) {
    up.copy(n).normalize();
    east.crossVectors(Y, up);
    if (east.lengthSq() < 1e-8) east.crossVectors(X, up);
    east.normalize();
    north.crossVectors(up, east).normalize();
    forward.copy(north).multiplyScalar(Math.cos(heading)).addScaledVector(east, Math.sin(heading)).normalize();
    right.crossVectors(up, forward).normalize();
  }

  function terrainRadiusAt(n) {
    return groundReader.radiusAt(n.clone().normalize()) || 5;
  }

  function resolveSupport(n) {
    const direction = n.clone().normalize();
    const terrain = terrainRadiusAt(direction);
    if (typeof supportResolver !== 'function') {
      return {
        radius: terrain,
        terrainRadius: terrain,
        delta: 0,
        source: 'terrain',
        kind: 'terrain',
        id: 'terrain',
      };
    }
    try {
      const candidate = supportResolver(direction, terrain);
      if (Number.isFinite(candidate)) {
        const radius = Math.max(terrain, candidate);
        return {
          radius,
          terrainRadius: terrain,
          delta: radius - terrain,
          source: radius > terrain + 1e-6 ? 'support' : 'terrain',
          kind: radius > terrain + 1e-6 ? 'support' : 'terrain',
          id: radius > terrain + 1e-6 ? 'support' : 'terrain',
        };
      }
      if (candidate && Number.isFinite(candidate.radius)) {
        const radius = Math.max(terrain, candidate.radius);
        return {
          radius,
          terrainRadius: terrain,
          delta: radius - terrain,
          source: candidate.source || candidate.id || (radius > terrain + 1e-6 ? 'support' : 'terrain'),
          kind: candidate.kind || (radius > terrain + 1e-6 ? 'support' : 'terrain'),
          id: candidate.id || candidate.source || (radius > terrain + 1e-6 ? 'support' : 'terrain'),
        };
      }
    } catch (error) {
      console.warn('[wb0 ground] support resolver failed; using terrain', error);
    }
    return {
      radius: terrain,
      terrainRadius: terrain,
      delta: 0,
      source: 'terrain',
      kind: 'terrain',
      id: 'terrain',
    };
  }

  function supportRadiusAt(n) {
    return resolveSupport(n).radius;
  }

  function syncPlayer() {
    basisAt(dir);
    currentSupport = resolveSupport(dir);
    playerPos.copy(dir).multiplyScalar(currentSupport.radius + params.footLift + jumpOffset);
    if (playerRoot) {
      playerRoot.position.copy(playerPos);
      basis.makeBasis(right, up, forward);
      q.setFromRotationMatrix(basis);
      playerRoot.quaternion.copy(q);
    }
  }

  function syncCamera(dt, snap = false) {
    basisAt(dir);

    // Camera yaw is relative to actor heading. Positive mouse-X looks to the actor's right while
    // leaving the actor itself untouched. Pitch orbits above/below the default chase angle.
    cameraForward.copy(forward).multiplyScalar(Math.cos(cameraYaw))
      .addScaledVector(right, Math.sin(cameraYaw)).normalize();
    const orbitRadius = Math.hypot(params.cameraDistance, params.cameraHeight);
    const baseElevation = Math.atan2(params.cameraHeight, Math.max(1e-6, params.cameraDistance));
    const elevation = THREE.MathUtils.clamp(baseElevation + cameraPitch, 0.12, 1.10);
    const horizontalDistance = orbitRadius * Math.cos(elevation);
    const verticalDistance = orbitRadius * Math.sin(elevation);

    desiredCam.copy(playerPos)
      .addScaledVector(cameraForward, -horizontalDistance)
      .addScaledVector(up, verticalDistance);
    desiredLook.copy(playerPos)
      .addScaledVector(up, params.cameraLookHeight)
      .addScaledVector(cameraForward, params.cameraLookAhead);
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
      support: { ...currentSupport },
      camera: {
        yaw: cameraYaw,
        pitch: cameraPitch,
        distance: params.cameraDistance,
        dragging: cameraDragging,
        dragPixels: cameraDragPixels,
      },
    };
  }

  function update(dt) {
    if (!enabled) return;

    // Human browser correction: the old planar +/− sign produced visually reversed Ground turns
    // on the Globe tangent frame. D is therefore positive and A negative here; Flight is untouched.
    const turn = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0);
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

    // Angular travel still uses the baked terrain radius. Support surfaces change where feet stand,
    // not the ownership of the sphere/terrain coordinate system.
    const r = terrainRadiusAt(dir);
    const locomotionSpeed = params.speed * (running ? params.runMul : 1);
    const distance = moveMagnitude * locomotionSpeed * dt;
    if (distance > 1e-8) {
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

  function resetCameraOrbit() {
    cameraYaw = 0;
    cameraPitch = 0;
    snappedCamera = false;
  }

  function resetFromFlight(carpet) {
    const p = carpet.worldPos();
    if (p && p.lengthSq() > 1e-8) dir.copy(p).normalize();
    heading = Number(carpet.state && carpet.state.heading || 0);
    onGround = true;
    jumpOffset = 0;
    verticalVelocity = 0;
    jumpQueued = false;
    resetCameraOrbit();
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
    resetCameraOrbit();
    syncPlayer();
    syncCamera(1 / 60, true);
  }

  function toFlightPose() {
    qSurface.setFromUnitVectors(Y, dir);
    const support = resolveSupport(dir);
    return {
      qPosition: qSurface.clone(),
      heading,
      altitude: Math.max(0, support.radius - 5) + bodyHeight * 0.35 + jumpOffset,
    };
  }

  const heldCodes = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ShiftLeft', 'ShiftRight'];
  function claimGroundKey(e) {
    e.preventDefault();
    // Capture-phase ownership prevents the older Flight Space/paintball listener from seeing a
    // Ground jump and also keeps the flight key-set clean while Ground owns locomotion.
    e.stopImmediatePropagation();
  }
  function onKeyDown(e) {
    if (!enabled) return;
    if (heldCodes.includes(e.code)) {
      keys.add(e.code);
      claimGroundKey(e);
      return;
    }
    if (e.code === 'Space') {
      if (!e.repeat) jumpQueued = true;
      claimGroundKey(e);
    }
  }
  function onKeyUp(e) {
    if (!enabled) return;
    if (heldCodes.includes(e.code)) {
      keys.delete(e.code);
      claimGroundKey(e);
      return;
    }
    if (e.code === 'Space') claimGroundKey(e);
  }
  function clearKeys() {
    keys.clear();
    jumpQueued = false;
    inputTurn = 0; inputThrottle = 0; inputStrafe = 0;
    running = false;
  }

  function endCameraDrag(e = null) {
    if (!cameraDragging) return;
    if (e && cameraPointerId != null && e.pointerId !== cameraPointerId) return;
    try {
      if (cameraPointerId != null && renderer.domElement.hasPointerCapture(cameraPointerId)) {
        renderer.domElement.releasePointerCapture(cameraPointerId);
      }
    } catch (_) {}
    cameraDragging = false;
    cameraPointerId = null;
  }

  function onPointerDown(e) {
    if (!enabled || e.button !== 2) return;
    cameraDragging = true;
    cameraPointerId = e.pointerId;
    pointerX = e.clientX; pointerY = e.clientY;
    cameraDragPixels = 0;
    try { renderer.domElement.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  function onPointerMove(e) {
    if (!enabled || !cameraDragging || e.pointerId !== cameraPointerId) return;
    const dx = e.clientX - pointerX;
    const dy = e.clientY - pointerY;
    pointerX = e.clientX; pointerY = e.clientY;
    cameraDragPixels += Math.hypot(dx, dy);
    cameraYaw = wrapPi(cameraYaw + dx * params.cameraYawSensitivity);
    cameraPitch = THREE.MathUtils.clamp(cameraPitch + dy * params.cameraPitchSensitivity,
      params.cameraPitchMin, params.cameraPitchMax);
    snappedCamera = false;
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  function onPointerUp(e) {
    if (!enabled || e.button !== 2) return;
    endCameraDrag(e);
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  function onContextMenu(e) {
    if (!enabled) return;
    e.preventDefault();
  }
  function onWheel(e) {
    if (!enabled) return;
    const delta = THREE.MathUtils.clamp(e.deltaY, -120, 120);
    const ratio = Math.exp(delta * params.cameraZoomSensitivity);
    params.cameraDistance = THREE.MathUtils.clamp(params.cameraDistance * ratio,
      params.cameraDistanceMin, params.cameraDistanceMax);
    snappedCamera = false;
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  // Ground claims its keys in capture phase so Space cannot leak into Flight paintball/specialAction.
  addEventListener('keydown', onKeyDown, { passive: false, capture: true });
  addEventListener('keyup', onKeyUp, { passive: false, capture: true });
  addEventListener('blur', clearKeys);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearKeys(); endCameraDrag(); } });
  renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: false, capture: true });
  renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: false, capture: true });
  renderer.domElement.addEventListener('pointerup', onPointerUp, { passive: false, capture: true });
  renderer.domElement.addEventListener('pointercancel', endCameraDrag, { passive: true, capture: true });
  renderer.domElement.addEventListener('contextmenu', onContextMenu, { passive: false });
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false, capture: true });

  return {
    name: 'wb0-ground-controller',
    params,
    update,
    resetFromFlight,
    resetCameraOrbit,
    setSurfaceDirection,
    toFlightPose,
    // Compatibility: existing authoring/snap callers still receive the baked terrain radius.
    radiusAt: terrainRadiusAt,
    supportRadiusAt,
    setSupportResolver(fn) {
      supportResolver = typeof fn === 'function' ? fn : null;
      syncPlayer();
    },
    setPlayerRoot(root) { playerRoot = root || null; syncPlayer(); },
    setPresentationUpdater(fn) { presentationUpdater = typeof fn === 'function' ? fn : null; },
    queueJump() { if (enabled && onGround) jumpQueued = true; },
    setEnabled(on) {
      enabled = !!on;
      if (!enabled) { clearKeys(); endCameraDrag(); }
    },
    get enabled() { return enabled; },
    get state() { return stateSnapshot(); },
    dispose() {
      removeEventListener('keydown', onKeyDown, true);
      removeEventListener('keyup', onKeyUp, true);
      removeEventListener('blur', clearKeys);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown, true);
      renderer.domElement.removeEventListener('pointermove', onPointerMove, true);
      renderer.domElement.removeEventListener('pointerup', onPointerUp, true);
      renderer.domElement.removeEventListener('pointercancel', endCameraDrag, true);
      renderer.domElement.removeEventListener('contextmenu', onContextMenu);
      renderer.domElement.removeEventListener('wheel', onWheel, true);
    },
  };
}
