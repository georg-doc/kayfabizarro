// WB0 runtime mode bridge.
// This is deliberately an adapter over the accepted B0 runtime. It proves the candidate owner rule
// without mutating the frozen travel/ source tree: one active locomotion writer per mode.
//
// Ground hardening rule: disabling Flight is not a threshold tweak. Every Flight-only writer or
// presentation hook that can still touch the Ground frame is explicitly gated here and restored
// exactly when returning to Flight.

export function createRuntimeModeBridge({ g, ground, onChange = null }) {
  const originals = {
    carpetUpdate: g.carpet.update.bind(g.carpet),
    rigUpdate: g.rig.update.bind(g.rig),
    linesRender: g.lines && g.lines.render ? g.lines.render.bind(g.lines) : null,
    postStrength: g.post && g.post.setStrength ? g.post.setStrength.bind(g.post) : null,
    lookUpdate: g.look && g.look.update ? g.look.update.bind(g.look) : null,
    lookApply: g.look && g.look.apply ? g.look.apply.bind(g.look) : null,
    petFillVisible: g.lights && g.lights.petFill ? g.lights.petFill.visible : null,
    lightingEnv: g.lighting && g.lighting.params ? g.lighting.params.env : null,
    lightingTintAmount: g.lighting && Number.isFinite(g.lighting.tintAmount) ? g.lighting.tintAmount : null,
  };

  // Preserve layer masks exactly. Ground must not inherit vehicle-only trails/particles/shadow, but
  // returning to Flight must restore whatever the accepted Travel runtime owned before WB0 touched it.
  const flightOnlyObjects = [
    g.trail && g.trail.group,
    g.wake && g.wake.group,
    g.rauch && g.rauch.group,
    g.leaves && g.leaves.group,
    g.schatten && g.schatten.mesh,
  ].filter(Boolean).map((object) => ({ object, mask: object.layers.mask }));

  let mode = 'FLIGHT';
  let flightPresentationHidden = false;

  function setObjectLayerState(on) {
    for (const entry of flightOnlyObjects) {
      if (on) entry.object.layers.mask = entry.mask;
      else entry.object.layers.set(31);
    }
  }

  function setFlightPresentationVisible(on) {
    if (g.avatar) g.avatar.visible = !!on;
    if (g.carrier && g.carrier.group) g.carrier.group.visible = !!on;
    setObjectLayerState(!!on);

    // Pointer-look is a Flight-camera modifier applied after the rig. Leaving it alive would mean
    // Ground still has a second camera writer even if camera-rig itself is replaced.
    if (g.look) {
      try { if (!on && g.look.center) g.look.center(); } catch (_) {}
      if (!on) {
        if (originals.lookUpdate) g.look.update = () => {};
        if (originals.lookApply) g.look.apply = () => false;
      } else {
        if (originals.lookUpdate) g.look.update = originals.lookUpdate;
        if (originals.lookApply) g.look.apply = originals.lookApply;
      }
    }

    // Travel's petFill/environment/tint are presentation helpers for the Flight avatar, not global
    // world truth. The Ground actor uses its own explicit world-material calibration, so the Flight
    // fill must not bleach it. Hide the source-owned light non-destructively and restore on Flight.
    if (g.lights && g.lights.petFill && originals.petFillVisible != null) {
      g.lights.petFill.visible = on ? originals.petFillVisible : false;
    }
    if (g.lighting) {
      try {
        if (!on) {
          if (g.lighting.setEnv) g.lighting.setEnv(0);
          if (g.lighting.setTint) g.lighting.setTint(null, 0);
        } else {
          if (g.lighting.setEnv && originals.lightingEnv != null) g.lighting.setEnv(originals.lightingEnv);
          if (g.lighting.setTint && originals.lightingTintAmount != null) g.lighting.setTint(null, originals.lightingTintAmount);
        }
      } catch (error) {
        console.warn('[wb0 mode] lighting presentation switch failed', error);
      }
    }

    flightPresentationHidden = !on;
  }

  function enterGround() {
    if (mode === 'GROUND') return;
    mode = 'GROUND';
    try { if (g.intro && g.intro.active) g.intro.skip(); } catch (_) {}
    try { g.carpet.setSpeedFloor(0); g.carpet.setSpeed(0); } catch (_) {}
    if (g.controls) g.controls.enabled = false;
    ground.resetFromFlight(g.carpet);
    ground.setEnabled(true);
    setFlightPresentationVisible(false);

    // The accepted Flight writer is still present but is inactive in this mode.
    g.carpet.update = () => {};

    // Reuse the host's exact camera-update slot: no second rAF loop and no simultaneous movement
    // writer. Flight pointer-look is separately gated above so Ground is the sole camera writer.
    g.rig.update = (dt) => {
      try { g.carpet.setSpeedFloor(0); g.carpet.setSpeed(0); } catch (_) {}
      ground.update(dt);
    };

    // Flight-only screen presentation is disabled by locomotion mode, not by speed heuristics.
    if (g.lines) g.lines.render = () => {};
    if (g.post && originals.postStrength) g.post.setStrength = () => originals.postStrength(0);
    if (onChange) onChange(mode);
  }

  function enterFlight() {
    if (mode === 'FLIGHT') return;
    const p = ground.toFlightPose();
    ground.setEnabled(false);
    g.carpet.update = originals.carpetUpdate;
    g.rig.update = originals.rigUpdate;
    if (g.lines && originals.linesRender) g.lines.render = originals.linesRender;
    if (g.post && originals.postStrength) g.post.setStrength = originals.postStrength;
    setFlightPresentationVisible(true);
    try {
      g.carpet.setSpeedFloor(0);
      g.carpet.setSpeed(0);
      g.carpet.teleportTo(p.qPosition, p.heading, p.altitude, 0);
    } catch (error) {
      console.warn('[wb0 mode] could not hand Ground position back to Flight', error);
    }
    if (g.controls) g.controls.enabled = true;
    mode = 'FLIGHT';
    if (onChange) onChange(mode);
  }

  return {
    set(modeName) {
      const next = String(modeName || '').toUpperCase();
      if (next === 'GROUND') enterGround();
      else if (next === 'FLIGHT') enterFlight();
      else throw new Error('Unsupported locomotion mode: ' + modeName);
      return mode;
    },
    get mode() { return mode; },
    restoreFlight() { enterFlight(); },
    report() {
      return {
        mode,
        flightControlsEnabled: !!(g.controls && g.controls.enabled),
        groundEnabled: !!ground.enabled,
        flightPresentationHidden,
        pointerLookSuppressed: mode === 'GROUND' && !!g.look,
        petFillVisible: !!(g.lights && g.lights.petFill && g.lights.petFill.visible),
        activeMovementOwner: mode === 'GROUND' ? 'wb0-ground-controller' : 'carpet.js',
        activeCameraOwner: mode === 'GROUND' ? 'wb0-ground-controller' : 'camera-rig.js',
      };
    },
  };
}
