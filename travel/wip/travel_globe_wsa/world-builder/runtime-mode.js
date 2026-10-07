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


// WB2 receiving seam of this same mode owner. Each fixed step belongs to Ground OR Carpet.
export function createWorldBuilderModeBridge({ground,carpet,rig,controls,frame,physics,holder,present,worldId,actorProfileId,onMode}){
 let mode='GROUND',lastInput=null,disposed=false,flightClock=0,drive=null;const groundFov=rig.camera.fov;
 controls.enabled=false;
 function publish(){onMode?.(mode)}
 function stopFlight(){controls.enabled=false;ground.acceptPose(carpet.worldPos(),-carpet.state.heading);ground.character.setFlight(false);rig.camera.fov=groundFov;rig.camera.updateProjectionMatrix();mode='GROUND';publish()}
 function enterFlight(){
  if(disposed||mode!=='GROUND'||!ground.on)return false;
  const p=ground.position.clone(),heading=ground.heading;
  ground.setOn(false);mode='FLIGHT';ground.character.setFlight(true);holder.visible=true;
  carpet.teleportTo(frame.fromWorld(p),-heading,p.y/frame.metresPerUnit,0);carpet.setSpeedFloor(0);carpet.setSchwebe(false);
  controls.enabled=true;lastInput=null;flightClock=0;rig.snapTo(carpet.state.qPosition,carpet.state.heading,carpet.state.altitude,1);publish();return true;
 }
 function land(){
  const support=frame.landingSupport(carpet.state.qPosition),p=carpet.worldPos();
  if(support===null||p.y-support>.36||carpet.state.speed*frame.metresPerUnit>1)return false;
  const pose={x:p.x,y:support+.02,z:p.z};if(!ground.character.validPose(pose))return false;
  const heading=-carpet.state.heading;stopFlight();
  ground.readDoc({id:worldId,world:{player:{worldId,actorProfileId:actorProfileId(),position:[pose.x,pose.y,pose.z],heading}}});ground.setOn(true);return true;
 }
 const detach=physics.onFixedStep(dt=>{
  if(mode!=='FLIGHT')return;flightClock+=dt;
  lastInput=controls.getState();if(lastInput.schwebeToggle)carpet.setSchwebe(!carpet.schwebt);
  // Explicit descent starts hover, preserving present height, before consuming the downward command.
  if(lastInput.descend&&!carpet.schwebt)carpet.setSchwebe(true);
  carpet.update(dt,lastInput.turnRate,lastInput.forward,lastInput.brake,lastInput.elevate,lastInput.descend,lastInput.boost);
  const p=carpet.worldPos();ground.position.copy(p);holder.rotation.set(carpet.state.pitch,-carpet.state.heading,-carpet.state.bankAngle,'YXZ');
  if(lastInput.descend)land();
 });
 function exitDrive(){if(mode!=='DRIVE')return false;const pose=drive.exitPose();if(!pose)return false;drive.deactivate();ground.acceptPose(pose.position,pose.heading);ground.character.collider.setEnabled(true);mode='GROUND';ground.setOn(true);publish();return true;}
 return {get mode(){return mode},get active(){return mode!=='GROUND'||ground.on},enterFlight,
  attachDrive(next){if(mode==='DRIVE'&&!exitDrive())throw Error('Drive has no safe exit');drive?.dispose();drive=next;},
  requestDrive(){if(!drive||mode!=='GROUND'||!ground.on)return false;ground.setOn(false);ground.character.collider.setEnabled(false);try{drive.activate();mode='DRIVE';publish();return true}catch(error){ground.character.collider.setEnabled(true);ground.setOn(true);throw error}},exitDrive,
  setOn(on){if(mode==='DRIVE'&&!exitDrive())throw Error('Drive has no safe exit');if(!on&&mode==='FLIGHT')stopFlight();ground.setOn(on)},
  update(dt){if(mode==='GROUND')return ground.update(dt);if(mode==='DRIVE')return drive.update(dt);present(dt,0,{phase:'air',time:flightClock,grounded:false});rig.update(dt,carpet.state.qPosition,carpet.state.heading,carpet.state.altitude,1,lastInput?.turnRate||0,carpet.speedRatio)},
  reset(){if(mode==='DRIVE'&&!exitDrive())throw Error('Drive has no safe exit');if(mode==='FLIGHT')stopFlight()},
  afterActorChange(){if(mode==='DRIVE'){ground.setOn(false);ground.character.collider.setEnabled(false);}if(mode==='FLIGHT'){ground.setOn(false);ground.character.setFlight(true);holder.visible=true;}},
  writeDoc(doc){ground.writeDoc(doc);if(mode==='FLIGHT')doc.world.player.heading=-carpet.state.heading;if(mode==='DRIVE'){const pose=drive.exitPose();if(!pose)throw Error('Drive has no safe save pose');doc.world.player.position=pose.position.toArray();doc.world.player.heading=pose.heading;}},
  evidence:()=>({mode,movementOwner:mode==='DRIVE'?'Joyride K2B':mode==='FLIGHT'?'Travel Carpet':'WB2 Ground',cameraOwner:mode==='DRIVE'?'Joyride Drive camera':mode==='FLIGHT'?'Travel camera-rig':'WB2 Ground camera',drive:drive?.evidence()||null,physicsOwner:'WB2 Rapier',sourceUnitsToMetres:frame.metresPerUnit,flight:{...carpet.report(),boost:!!lastInput?.boost,hover:carpet.schwebt,pitch:carpet.state.pitch,bank:carpet.state.bankAngle},aglM:carpet.agl*frame.metresPerUnit}),
  dispose(){disposed=true;controls.enabled=false;controls.dispose();detach();drive?.dispose();},
 };
}
