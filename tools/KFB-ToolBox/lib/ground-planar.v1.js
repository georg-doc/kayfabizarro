// Planar extraction of WB0 ground-controller.js: body-relative WASD/QE semantics,
// turnRate 2.35, body-relative orbit camera, exponential follow (14), RMB/wheel.
// WB2 supplies all support/collision truth. Motion presentation is injected.
export function createPlanarGround({THREE,camera,dom,root,bodyHeight,spawn,groundAt,solidAt,speeds,present,hud,getActorProfileId=()=> 'Mannequin_Medium',isMovementLocked=()=>false,physics=null}) {
  const events=new AbortController();
  const listen=(type,fn,options={})=>globalThis.addEventListener(type,fn,{...options,signal:events.signal});
  const listenDom=(type,fn,options={})=>dom.addEventListener(type,fn,{...options,signal:events.signal});
  let character=physics?.createCharacter(bodyHeight),verticalSpeed=0,grounded=false;
  let jumpPhase='ground',jumpClock=0,jumpQueued=false,spaceIntent=null,lateralSpeed=0;
  const jump={anticipation:.18,launch:8.5,gravity:24,recovery:.28};
  const keys=new Set(),position=root.position,forward=new THREE.Vector3(),desiredCam=new THREE.Vector3(),lookAt=new THREE.Vector3(),desiredLook=new THREE.Vector3();
  const params={turnRate:2.35,backMul:1,cameraDistance:bodyHeight*3.4,cameraHeight:bodyHeight*1.65,cameraLookHeight:bodyHeight*1.1,cameraLookAhead:bodyHeight*.65,cameraSmooth:14};
  let on=false,heading=spawn.heading||0,speed=0,hold=0,yaw=0,pitch=0,drag=null,snapped=false;
  position.set(spawn.x,groundAt(spawn.x,spawn.z)+(character?.02:0),spawn.z);character?.reset(position);
  function blocked(x,z){const y=groundAt(x,z);return !Number.isFinite(y)||y<-30||Math.abs(y-position.y)>.75||solidAt(x,z)>0||solidAt(x+.2,z)>0||solidAt(x-.2,z)>0||solidAt(x,z+.2)>0||solidAt(x,z-.2)>0;}
  function syncCamera(dt){
    const elevation=THREE.MathUtils.clamp(Math.atan2(params.cameraHeight,params.cameraDistance)+pitch,.12,1.10),radius=Math.hypot(params.cameraDistance,params.cameraHeight);
    forward.set(Math.sin(heading+yaw),0,Math.cos(heading+yaw));
    desiredCam.copy(position).addScaledVector(forward,-radius*Math.cos(elevation));desiredCam.y+=radius*Math.sin(elevation);
    desiredCam.y=Math.max(desiredCam.y,groundAt(desiredCam.x,desiredCam.z)+bodyHeight*1.35);
    desiredLook.copy(position).addScaledVector(forward,params.cameraLookAhead);desiredLook.y+=params.cameraLookHeight;
    const avoid=()=>{if(!physics)return;const delta=desiredCam.clone().sub(desiredLook),distance=delta.length();if(distance<.01)return;delta.divideScalar(distance);const hit=physics.world.castRay(new physics.R.Ray(desiredLook,delta),distance,true,undefined,undefined,character?.collider,character?.body);if(hit)desiredCam.copy(desiredLook).addScaledVector(delta,Math.max(.2,hit.timeOfImpact-.3));};
    avoid();
    const a=snapped?1-Math.exp(-params.cameraSmooth*dt):1;camera.position.lerp(desiredCam,a);lookAt.lerp(desiredLook,a);desiredCam.copy(camera.position);avoid();camera.position.copy(desiredCam);camera.up.set(0,1,0);camera.lookAt(lookAt);snapped=true;
  }
  function integrate(dt){
    if(!on)return;
    const locked=isMovementLocked(),turn=locked?0:(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),throttle=locked?0:(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),shift=keys.has('ShiftLeft')||keys.has('ShiftRight');
    heading+=turn*params.turnRate*dt;
    const slow=keys.has('AltLeft')||keys.has('AltRight'),strafe=locked?0:(keys.has('KeyE')?1:0)-(keys.has('KeyQ')?1:0);
    const gait=slow?speeds.walk:shift?speeds.sprint:THREE.MathUtils.lerp(speeds.walk,speeds.run,.72);
    const norm=Math.max(1,Math.hypot(throttle,strafe)),target=throttle*gait/norm;
    speed+=THREE.MathUtils.clamp(target-speed,-12*dt,12*dt);
    lateralSpeed+=THREE.MathUtils.clamp(strafe*gait/norm-lateralSpeed,-12*dt,12*dt);
    const x=position.x+(Math.sin(heading)*speed+Math.cos(heading)*lateralSpeed)*dt,z=position.z+(Math.cos(heading)*speed-Math.sin(heading)*lateralSpeed)*dt;
    if(jumpQueued){if(grounded){jumpPhase='anticipation';jumpClock=0;}jumpQueued=false;}
    jumpClock+=dt;
    if(jumpPhase==='anticipation'&&jumpClock>=jump.anticipation){verticalSpeed=jump.launch;jumpPhase='air';jumpClock=0;grounded=false;}
    if(jumpPhase==='landing'&&jumpClock>=jump.recovery){jumpPhase='ground';jumpClock=0;}
    if(character){
      verticalSpeed=Math.max(-40,verticalSpeed-jump.gravity*dt);
      const wasAir=jumpPhase==='air';
      const contact=character.move(position,{x:x-position.x,y:verticalSpeed*dt,z:z-position.z});grounded=contact.grounded;if(grounded&&verticalSpeed<0){verticalSpeed=0;if(wasAir){jumpPhase='landing';jumpClock=0;}}
      else if(!grounded&&jumpPhase==='ground'){jumpPhase='air';jumpClock=0;}
      position.set(contact.position.x,contact.position.y,contact.position.z);
      if(Math.hypot(x-position.x,z-position.z)>Math.hypot(speed,lateralSpeed)*dt*.8){speed=0;lateralSpeed=0;}
    }else if(!blocked(x,z))position.set(x,groundAt(x,z),z);else speed=0;
    root.rotation.y=heading;
    if(position.y < -40){position.set(spawn.x,groundAt(spawn.x,spawn.z)+(character?.02:0),spawn.z);character?.reset(position);character?.reset(position);verticalSpeed=0;speed=0;}
  }
  const detachFixed=physics?.onFixedStep(integrate);
  function update(dt){
    if(!on)return;dt=Math.min(.05,Math.max(0,dt));if(!physics)integrate(dt);
    present(dt,Math.hypot(speed,lateralSpeed)*(speed<0?-1:1),{phase:jumpPhase,time:jumpClock,duration:jumpPhase==='anticipation'?jump.anticipation:jumpPhase==='landing'?jump.recovery:null,verticalSpeed,grounded,lateralSpeed});syncCamera(dt);
    if(hud)hud.textContent='W/S Jog · Shift Sprint · Alt Slow Walk · Q/E seitwärts · Leertaste Sprung · A/D drehen · rechte Maustaste Kamera · Tab bauen · '+Math.abs(speed).toFixed(2)+' m/s';
  }
  function key(e,down){if(!on||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName)||e.target?.isContentEditable)return;if(['KeyW','KeyS','KeyA','KeyD','ShiftLeft','ShiftRight','AltLeft','AltRight','KeyQ','KeyE','Space'].includes(e.code)){e.preventDefault();if(down){if(e.code==='Space'&&!e.repeat&&!keys.has('Space')){jumpQueued=true;spaceIntent?.(e);}keys.add(e.code);}else keys.delete(e.code);}}
  listen('keydown',e=>key(e,true));listen('keyup',e=>key(e,false));listen('blur',()=>{keys.clear();speed=0;lateralSpeed=0;jumpQueued=false;hold=0;});
  listenDom('contextmenu',e=>{if(on)e.preventDefault()});
  listenDom('pointerdown',e=>{if(on&&e.button===2){drag={id:e.pointerId,x:e.clientX,y:e.clientY};dom.setPointerCapture(e.pointerId)}});
  listenDom('pointermove',e=>{if(!on||drag?.id!==e.pointerId)return;yaw+=(e.clientX-drag.x)*.0028;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-drag.y)*.0022,-.35,.55);drag.x=e.clientX;drag.y=e.clientY;});
  function release(){drag=null;}listenDom('pointerup',release);listenDom('lostpointercapture',release);
  listenDom('wheel',e=>{if(!on)return;e.preventDefault();params.cameraDistance=THREE.MathUtils.clamp(params.cameraDistance*Math.exp(e.deltaY*.00045),bodyHeight*1.5,bodyHeight*8)},{passive:false});
  return {position,params,update,get character(){return character},get grounded(){return grounded},get motion(){return {phase:jumpPhase,time:jumpClock,duration:jumpPhase==='anticipation'?jump.anticipation:jumpPhase==='landing'?jump.recovery:null,verticalSpeed,grounded,lateralSpeed}},setSpaceIntent(fn){spaceIntent=fn},
    acceptPose(p,h){if(![p.x,p.y,p.z,h].every(Number.isFinite)||character&&!character.validPose(p))throw Error('Invalid locomotion handoff pose');position.copy(p);heading=h;root.rotation.set(0,heading,0);character?.reset(position);keys.clear();speed=lateralSpeed=verticalSpeed=0;jumpQueued=false;jumpPhase='ground';jumpClock=0;snapped=false;},
    setBodyHeight(height){bodyHeight=height;if(physics){character?.dispose();character=physics.createCharacter(height);character.reset(position);}},
    dispose(){on=false;keys.clear();speed=0;events.abort();detachFixed?.();character?.dispose();},get on(){return on},get speed(){return speed},get heading(){return heading},setOn(v){on=!!v;root.visible=on;keys.clear();speed=0;lateralSpeed=0;jumpQueued=false;hold=0;drag=null;snapped=false;if(on){present(0,0);syncCamera(0)}},handToOrbit(controls){controls.target.copy(lookAt);controls.update()},
    writeDoc(doc){doc.world.player={actorProfileId:getActorProfileId(),worldId:doc.id,position:position.toArray(),heading,speed:0,intention:'idle'};},
    readDoc(doc){
      const p=doc.world?.player;keys.clear();speed=0;lateralSpeed=0;jumpQueued=false;hold=0;verticalSpeed=0;jumpPhase='ground';jumpClock=0;
      const valid=p?.worldId===doc.id&&p.actorProfileId===getActorProfileId()&&p.position?.length===3&&p.position.every(Number.isFinite)&&Number.isFinite(p.heading);
      const saved=valid?{x:p.position[0],y:p.position[1],z:p.position[2]}:null;
      const support=saved?groundAt(saved.x,saved.z):-Infinity;
      const accepted=saved&&Number.isFinite(support)&&support>-30&&(character?character.validPose(saved):solidAt(saved.x,saved.z)===0);
      if(accepted){position.set(saved.x,character?saved.y:support,saved.z);heading=p.heading;}
      else{position.set(spawn.x,groundAt(spawn.x,spawn.z)+(character?.02:0),spawn.z);character?.reset(position);heading=spawn.heading||0;}
      character?.reset(position);root.rotation.y=heading;snapped=false;
    }
  };
}
