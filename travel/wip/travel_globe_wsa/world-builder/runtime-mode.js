// WB0 runtime mode bridge.
// This is deliberately an adapter over the accepted B0 runtime. It proves the candidate owner rule
// without mutating the frozen travel/ source tree: one active locomotion writer per mode.

export function createRuntimeModeBridge({ g, ground, onChange = null }) {
  const originals = {
    carpetUpdate: g.carpet.update.bind(g.carpet),
    rigUpdate: g.rig.update.bind(g.rig),
    linesRender: g.lines && g.lines.render ? g.lines.render.bind(g.lines) : null,
    postStrength: g.post && g.post.setStrength ? g.post.setStrength.bind(g.post) : null,
  };

  const hiddenGroups = [g.trail && g.trail.group, g.wake && g.wake.group, g.rauch && g.rauch.group]
    .filter(Boolean);
  let mode = 'FLIGHT';

  function setFlightPresentationVisible(on) {
    if (g.avatar) g.avatar.visible = !!on;
    if (g.carrier && g.carrier.group) g.carrier.group.visible = !!on;
    for (const group of hiddenGroups) group.layers.set(on ? 0 : 31);
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

    // Reuse the host's exact camera-update slot: no second rAF loop and no second simultaneous writer.
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
    try {
      g.carpet.setSpeedFloor(0);
      g.carpet.setSpeed(0);
      g.carpet.teleportTo(p.qPosition, p.heading, p.altitude, 0);
    } catch (error) {
      console.warn('[wb0 mode] could not hand Ground position back to Flight', error);
    }
    if (g.controls) g.controls.enabled = true;
    setFlightPresentationVisible(true);
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
        activeMovementOwner: mode === 'GROUND' ? 'wb0-ground-controller' : 'carpet.js',
        activeCameraOwner: mode === 'GROUND' ? 'wb0-ground-controller' : 'camera-rig.js',
      };
    },
  };
}
