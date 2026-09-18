// Browser-driven WB0 Ground experience adapter.
// This module deliberately does NOT become a movement or animation owner.
// It only (1) adds a click-preserving LMB orbit alias to the existing Ground camera input and
// (2) tunes existing Ground parameters from measured Movement-Lab state for browser-rejected cases.

function waitForRuntime(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      const wb0 = window.__wb0;
      const g = window.__globe;
      if (wb0?.ground && wb0?.movementLab && g?.renderer?.domElement) return resolve({ wb0, g });
      if (performance.now() - t0 > timeoutMs) return reject(new Error('Ground experience hardening timed out waiting for Movement Lab'));
      setTimeout(tick, 40);
    };
    tick();
  });
}

function syntheticPointer(type, source, overrides = {}) {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: source.pointerId,
    pointerType: source.pointerType || 'mouse',
    isPrimary: source.isPrimary !== false,
    clientX: source.clientX,
    clientY: source.clientY,
    screenX: source.screenX,
    screenY: source.screenY,
    ctrlKey: source.ctrlKey,
    shiftKey: source.shiftKey,
    altKey: source.altKey,
    metaKey: source.metaKey,
    ...overrides,
  });
}

async function main() {
  const { wb0, g } = await waitForRuntime();
  const canvas = g.renderer.domElement;
  const bodyHeight = Number(wb0.report?.().bodyHeight) || 0.022;
  const defaultWalkSpeed = bodyHeight * 1.15;
  const defaultRunMul = 1.75;
  const dragThresholdPx = 6;

  // --- MMO/RPG camera seam -------------------------------------------------
  // Familiar split preserved for future interaction:
  // short LMB click = untouched (selection/interact may own it later)
  // LMB drag > threshold = camera-only orbit, forwarded to the existing RMB camera path
  // RMB drag = existing Ground look path. Character-turn coupling remains a future decision.
  let leftCandidate = null;
  let suppressClick = false;

  function beginLeft(e) {
    if (!wb0.ground.enabled || e.button !== 0) return;
    leftCandidate = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dragging: false,
    };
  }

  function moveLeft(e) {
    if (!leftCandidate || e.pointerId !== leftCandidate.pointerId || !wb0.ground.enabled) return;
    const distance = Math.hypot(e.clientX - leftCandidate.startX, e.clientY - leftCandidate.startY);
    if (!leftCandidate.dragging && distance >= dragThresholdPx) {
      leftCandidate.dragging = true;
      canvas.dispatchEvent(syntheticPointer('pointerdown', e, {
        button: 2,
        buttons: 2,
        clientX: leftCandidate.startX,
        clientY: leftCandidate.startY,
      }));
    }
    if (!leftCandidate.dragging) return;
    canvas.dispatchEvent(syntheticPointer('pointermove', e, { button: -1, buttons: 2 }));
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function endLeft(e) {
    if (!leftCandidate || e.pointerId !== leftCandidate.pointerId) return;
    const dragged = leftCandidate.dragging;
    if (dragged) {
      canvas.dispatchEvent(syntheticPointer('pointerup', e, { button: 2, buttons: 0 }));
      suppressClick = true;
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    leftCandidate = null;
  }

  function cancelLeft(e) {
    if (!leftCandidate || (e && e.pointerId !== leftCandidate.pointerId)) return;
    if (leftCandidate.dragging && e) canvas.dispatchEvent(syntheticPointer('pointerup', e, { button: 2, buttons: 0 }));
    leftCandidate = null;
  }

  function suppressDraggedClick(e) {
    if (!suppressClick) return;
    suppressClick = false;
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  canvas.addEventListener('pointerdown', beginLeft, { passive: true, capture: true });
  canvas.addEventListener('pointermove', moveLeft, { passive: false, capture: true });
  canvas.addEventListener('pointerup', endLeft, { passive: false, capture: true });
  canvas.addEventListener('pointercancel', cancelLeft, { passive: true, capture: true });
  canvas.addEventListener('click', suppressDraggedClick, { passive: false, capture: true });

  // --- Browser-driven locomotion tuning ------------------------------------
  // Large Rig finding: Monstrosity read as tiny/rapid "trippelschritte". Do not guess another clip.
  // Start heavy, then converge translation/run multiplier toward the cadenceScale measured from the
  // actual Rig_Large clip currently playing in Movement Lab.
  const largePolicy = {
    targetWalkCadence: 0.95,
    targetRunCadence: 1.05,
    minWalkBodyLengthsPerSecond: 0.85,
    maxWalkBodyLengthsPerSecond: 1.35,
    minRunMul: 1.35,
    maxRunMul: 2.15,
    tuneEveryMs: 180,
  };

  const mechProfiles = new Set(['frizzleBeeMech', 'flamingoMech']);
  let activeProfile = null;
  let profileSpeed = wb0.ground.params.speed;
  let profileRunMul = wb0.ground.params.runMul;
  let landingPlanted = false;
  let lastTuneAt = 0;
  const telemetry = {
    profile: null,
    largeCadenceObserved: null,
    largeTargetCadence: null,
    largeWalkSpeed: null,
    largeRunMul: null,
    mechLandingPlant: false,
    leftOrbitThresholdPx: dragThresholdPx,
  };

  function onProfileChanged(profile) {
    activeProfile = profile;
    landingPlanted = false;
    profileSpeed = wb0.ground.params.speed;
    profileRunMul = wb0.ground.params.runMul;

    // Movement Lab now owns the scale-class baseline: one body-length means the active rig's
    // locomotionHeight, not always Rig_Medium's 0.022. Hardening may trim cadence around that
    // baseline but must never collapse Large/Legacy back to Medium speed.
    wb0.ground.params.runMul = defaultRunMul;
    profileSpeed = wb0.ground.params.speed;
    profileRunMul = wb0.ground.params.runMul;
  }

  function tuneLarge(report, state, now) {
    if (activeProfile !== 'monstrosity' || !state.onGround || !state.moving) return;
    if (now - lastTuneAt < largePolicy.tuneEveryMs) return;
    const cadence = Number(report.cadenceScale);
    if (!Number.isFinite(cadence) || cadence < 0.25 || cadence > 4) return;
    lastTuneAt = now;
    const target = state.running ? largePolicy.targetRunCadence : largePolicy.targetWalkCadence;
    const rawRatio = target / cadence;
    const ratio = Math.max(0.84, Math.min(1.16, rawRatio));

    if (state.running) {
      wb0.ground.params.runMul = Math.max(largePolicy.minRunMul,
        Math.min(largePolicy.maxRunMul, wb0.ground.params.runMul * ratio));
      profileRunMul = wb0.ground.params.runMul;
    } else {
      const locomotionHeight = Number(report.locomotionHeight) || bodyHeight;
      const minWalkSpeed = locomotionHeight * largePolicy.minWalkBodyLengthsPerSecond;
      const maxWalkSpeed = locomotionHeight * largePolicy.maxWalkBodyLengthsPerSecond;
      wb0.ground.params.speed = Math.max(minWalkSpeed,
        Math.min(maxWalkSpeed, wb0.ground.params.speed * ratio));
      profileSpeed = wb0.ground.params.speed;
      telemetry.largeLocomotionHeight = locomotionHeight;
    }

    telemetry.largeCadenceObserved = cadence;
    telemetry.largeTargetCadence = target;
    telemetry.largeWalkSpeed = wb0.ground.params.speed;
    telemetry.largeRunMul = wb0.ground.params.runMul;
  }

  function plantMechLanding(report, state) {
    const isMech = mechProfiles.has(activeProfile);
    const input = state.input || {};
    const movementIntent = Math.abs(Number(input.throttle) || 0) + Math.abs(Number(input.strafe) || 0) > 0.01;
    // Use input intent rather than state.moving. Once speed is planted to zero, state.moving becomes
    // false by design; the plant must nevertheless persist until Movement Lab exits LAND.
    const movingLanding = isMech && report.jumpPhase === 'LAND' && state.onGround && movementIntent;
    if (movingLanding && !landingPlanted) {
      profileSpeed = wb0.ground.params.speed;
      wb0.ground.params.speed = 0;
      landingPlanted = true;
    } else if (!movingLanding && landingPlanted) {
      wb0.ground.params.speed = profileSpeed;
      landingPlanted = false;
    }
    telemetry.mechLandingPlant = landingPlanted;
  }

  function tick(now) {
    const report = wb0.movementLab.report();
    const profile = report?.profile || null;
    if (profile && profile !== activeProfile) onProfileChanged(profile);

    const state = wb0.ground.state;
    tuneLarge(report || {}, state, now);
    plantMechLanding(report || {}, state);

    telemetry.profile = activeProfile;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Update the visible cheat-sheet without changing Movement Lab ownership.
  const controls = document.querySelector('.wb0-move-controls');
  if (controls) controls.textContent = 'W/S move · A/D turn · Q/E strafe · Shift run · Space jump · LMB drag orbit · RMB look · Wheel zoom';

  wb0.groundExperience = {
    name: 'wb0-ground-experience-hardening',
    cameraConvention: {
      lmbClick: 'reserved for future select/interact',
      lmbDrag: 'camera-only orbit after 6px threshold',
      rmbDrag: 'existing camera look; character-turn coupling deferred',
    },
    largePolicy: { ...largePolicy },
    report() {
      return {
        ...telemetry,
        groundSpeed: wb0.ground.params.speed,
        groundRunMul: wb0.ground.params.runMul,
        movementLab: wb0.movementLab.report(),
      };
    },
    dispose() {
      canvas.removeEventListener('pointerdown', beginLeft, true);
      canvas.removeEventListener('pointermove', moveLeft, true);
      canvas.removeEventListener('pointerup', endLeft, true);
      canvas.removeEventListener('pointercancel', cancelLeft, true);
      canvas.removeEventListener('click', suppressDraggedClick, true);
      if (landingPlanted) wb0.ground.params.speed = profileSpeed || defaultWalkSpeed;
      wb0.ground.params.runMul = defaultRunMul;
    },
  };

  console.info('[wb0 ground-experience]', wb0.groundExperience.report());
}

main().catch((error) => console.warn('[wb0 ground-experience]', error));
