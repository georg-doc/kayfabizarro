// Planar extraction of WB0 ground-controller.js: WASD semantics, backMul .55,
// turnRate 2.35, body-relative orbit camera, exponential follow (14), RMB/wheel.
// WB2 supplies all support/collision truth. Motion presentation is injected.
export function createPlanarGround({THREE,camera,dom,root,bodyHeight,spawn,groundAt,solidAt,speeds,present,hud}) {
  const keys=new Set(),position=root.position,forward=new THREE.Vector3(),desiredCam=new THREE.Vector3(),lookAt=new THREE.Vector3(),desiredLook=new THREE.Vector3();
  const params={turnRate:2.35,backMul:.55,cameraDistance:bodyHeight*7,cameraHeight:bodyHeight*4.1,cameraLookHeight:bodyHeight*1.15,cameraLookAhead:bodyHeight*1.6,cameraSmooth:14};
  let on=false,heading=spawn.heading||0,speed=0,hold=0,yaw=0,pitch=0,drag=null,snapped=false;
  position.set(spawn.x,groundAt(spawn.x,spawn.z),spawn.z);
  function blocked(x,z){const y=groundAt(x,z);return !Number.isFinite(y)||y<-30||Math.abs(y-position.y)>.75||solidAt(x,z)>0||solidAt(x+.2,z)>0||solidAt(x-.2,z)>0||solidAt(x,z+.2)>0||solidAt(x,z-.2)>0;}
  function syncCamera(dt){
    const elevation=THREE.MathUtils.clamp(Math.atan2(params.cameraHeight,params.cameraDistance)+pitch,.12,1.10),radius=Math.hypot(params.cameraDistance,params.cameraHeight);
    forward.set(Math.sin(heading+yaw),0,Math.cos(heading+yaw));
    desiredCam.copy(position).addScaledVector(forward,-radius*Math.cos(elevation));desiredCam.y+=radius*Math.sin(elevation);
    desiredCam.y=Math.max(desiredCam.y,groundAt(desiredCam.x,desiredCam.z)+bodyHeight*1.35);
    desiredLook.copy(position).addScaledVector(forward,params.cameraLookAhead);desiredLook.y+=params.cameraLookHeight;
    const a=snapped?1-Math.exp(-params.cameraSmooth*dt):1;camera.position.lerp(desiredCam,a);lookAt.lerp(desiredLook,a);camera.up.set(0,1,0);camera.lookAt(lookAt);snapped=true;
  }
  function update(dt){
    if(!on)return;dt=Math.min(.05,Math.max(0,dt));
    const turn=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),throttle=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),shift=keys.has('ShiftLeft')||keys.has('ShiftRight');
    heading+=turn*params.turnRate*dt;hold=throttle>0?hold+dt:0;
    const target=throttle<0?-speeds.walk*params.backMul:throttle>0?(shift?speeds.sprint:THREE.MathUtils.lerp(speeds.walk,speeds.run,Math.min(hold/3,1))):0;
    speed+=THREE.MathUtils.clamp(target-speed,-12*dt,12*dt);
    const x=position.x+Math.sin(heading)*speed*dt,z=position.z+Math.cos(heading)*speed*dt;
    if(!blocked(x,z))position.set(x,groundAt(x,z),z);else speed=0;
    root.rotation.y=heading;present(dt,speed);syncCamera(dt);
    if(hud)hud.textContent='W/S bewegen · A/D drehen · Shift sprinten · rechte Maustaste Kamera · Tab bauen · '+Math.abs(speed).toFixed(2)+' m/s';
  }
  function key(e,down){if(!on||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName)||e.target?.isContentEditable)return;if(['KeyW','KeyS','KeyA','KeyD','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();if(down)keys.add(e.code);else keys.delete(e.code);}}
  addEventListener('keydown',e=>key(e,true));addEventListener('keyup',e=>key(e,false));addEventListener('blur',()=>{keys.clear();speed=0;hold=0;});
  dom.addEventListener('contextmenu',e=>{if(on)e.preventDefault()});
  dom.addEventListener('pointerdown',e=>{if(on&&e.button===2){drag={id:e.pointerId,x:e.clientX,y:e.clientY};dom.setPointerCapture(e.pointerId)}});
  dom.addEventListener('pointermove',e=>{if(!on||drag?.id!==e.pointerId)return;yaw+=(e.clientX-drag.x)*.0028;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-drag.y)*.0022,-.35,.55);drag.x=e.clientX;drag.y=e.clientY;});
  function release(){drag=null;}dom.addEventListener('pointerup',release);dom.addEventListener('lostpointercapture',release);
  dom.addEventListener('wheel',e=>{if(!on)return;e.preventDefault();params.cameraDistance=THREE.MathUtils.clamp(params.cameraDistance*Math.exp(e.deltaY*.00045),bodyHeight*3.5,bodyHeight*14)},{passive:false});
  return {position,params,update,get on(){return on},get speed(){return speed},get heading(){return heading},setOn(v){on=!!v;root.visible=on;keys.clear();speed=0;hold=0;drag=null;snapped=false;if(on){present(0,0);syncCamera(0)}},handToOrbit(controls){controls.target.copy(lookAt);controls.update()},
    writeDoc(doc){doc.world.player={actorProfileId:'Mannequin_Medium',worldId:doc.id,position:position.toArray(),heading,speed:0,intention:'idle'};},
    readDoc(doc){const p=doc.world?.player;keys.clear();speed=0;hold=0;if(p?.worldId===doc.id&&p.actorProfileId==='Mannequin_Medium'&&p.position?.length===3&&p.position.every(Number.isFinite)&&Number.isFinite(p.heading)&&Number.isFinite(groundAt(p.position[0],p.position[2]))&&groundAt(p.position[0],p.position[2])>-30&&solidAt(p.position[0],p.position[2])===0){position.set(p.position[0],groundAt(p.position[0],p.position[2]),p.position[2]);heading=p.heading;}else{position.set(spawn.x,groundAt(spawn.x,spawn.z),spawn.z);heading=spawn.heading||0;}root.rotation.y=heading;snapped=false;}
  };
}
