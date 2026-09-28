import * as THREE from 'three';
import {createTravelModeRouter,TRAVEL_MODE_DEFINITIONS} from './travel-mode-router.js';
import {createGroundFlightIntent,DEFAULT_DOUBLE_SPACE_WINDOW_MS} from './mode-intent.js';
import {createCardCarrier} from './card-carrier.js';
import {createWorldDriveM2A,DRIVE_SOURCE} from './world-drive-m2a.mjs?r5=pre-settle';

const SOURCE={
  travelPr:39,
  travelHead:'e10a977501cd186fe1330e9d3fd1a7b5811beb3a',
  travelRuntimeHead:'f5ea32f817403cda0e30a426e70f37db8ce03d66',
  intentWindowMs:DEFAULT_DOUBLE_SPACE_WINDOW_MS,
  carrier:'travel/terrain-planets-v1/card-carrier.js'
};

const MODES=TRAVEL_MODE_DEFINITIONS.map(mode=>{
  const copy=JSON.parse(JSON.stringify(mode));
  if(copy.id==='GROUND'){
    copy.movementAdapter={id:'world-runtime-mode-m1#GROUND',writer:'World r2 play'};
    copy.cameraAdapter={id:'world-runtime-mode-m1#GROUND',preset:'WORLD_R2_GROUND_FOLLOW',writer:'World r2 play'};
    copy.presentation={actor:'FrizzleBob Driver Graft',vehicle:null};
  }
  if(copy.id==='FLIGHT'){
    copy.movementAdapter={id:'world-runtime-mode-m1#FLIGHT',writer:'Travel flight ENU surface adapter'};
    copy.cameraAdapter={id:'world-runtime-mode-m1#FLIGHT',preset:'TINYSKIES_CHASE_ENU',writer:'Travel flight ENU surface adapter'};
    copy.presentation={actor:'FrizzleBob Driver Graft',vehicle:'card-carrier.js'};
  }
  if(copy.id==='DRIVE'){
    copy.status='READY';
    copy.movementAdapter={id:'KFB-Stunt-Car-Race PR#10 / FREE_ROAM_C0',writer:'FREE_ROAM_C0'};
    copy.cameraAdapter={id:'KFB-Stunt-Car-Race PR#10 cameraClearance',preset:'OSM_CITY_CHASE',writer:'FREE_ROAM_C0'};
    copy.presentation={actor:'FrizzleBob Driver Graft',vehicle:'kart-oobi.glb + Vehicle Deformer v2'};
    copy.allowedFx=['vehicle-deformer-v2'];
    copy.enterPayload={schema:'kfb.travel-mode-enter/1',source:'E interaction at proven vehicle',fields:['worldPosition','heading','vehicleId']};
    copy.exitPayload={schema:'kfb.travel-mode-exit/1',source:'safe side-of-vehicle sample',fields:['worldPosition','heading']};
  }
  return copy;
});

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrapPi=a=>Math.atan2(Math.sin(a),Math.cos(a));

export async function mountWorldMobility(app){
  if(!app?.play||!app?.scene||!app?.camera)throw Error('WORLD-MOBILITY-M1 needs the existing World r2 play owner');
  const play=app.play,baseUpdate=play.update.bind(play),keys={};
  const interactionResolvers=[];
  function registerInteractionResolver(def={}){
    if(!def.id||typeof def.probe!=='function'||typeof def.interact!=='function')throw Error('interaction resolver needs id + probe + interact');
    const entry={id:String(def.id),priority:Number(def.priority)||0,probe:def.probe,interact:def.interact};
    interactionResolvers.push(entry);
    interactionResolvers.sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));
    paintModeEvent();
    return ()=>{const i=interactionResolvers.indexOf(entry);if(i>=0)interactionResolvers.splice(i,1);paintModeEvent();};
  }
  function interactionCandidates(){
    if(mode!=='GROUND')return [];
    const out=[];
    const vehicleDistance=drive?.distanceTo?.(play.position)??Infinity;
    if(vehicleDistance<=8)out.push({id:'vehicle:kart-oobi',kind:'vehicle',label:'get in the car',distanceM:vehicleDistance,priority:0,resolverId:null});
    for(const resolver of interactionResolvers){
      let candidate=null;
      try{candidate=resolver.probe({app,play,mode,vehicleDistanceM:vehicleDistance});}catch(err){console.warn('KFB interaction probe failed',resolver.id,err);}
      if(!candidate||candidate.available===false)continue;
      const distanceM=Number(candidate.distanceM);
      out.push({...candidate,id:String(candidate.id||resolver.id),kind:String(candidate.kind||'interaction'),label:String(candidate.label||'interact'),distanceM:Number.isFinite(distanceM)?distanceM:Infinity,priority:Number(candidate.priority??resolver.priority)||0,resolverId:resolver.id,_resolver:resolver});
    }
    return out.sort((a,b)=>b.priority-a.priority||a.distanceM-b.distanceM||a.id.localeCompare(b.id));
  }
  function publicCandidate(candidate){
    if(!candidate)return null;
    const { _resolver, ...safe }=candidate;
    return {...safe,distanceM:Number.isFinite(safe.distanceM)?+safe.distanceM.toFixed(2):null};
  }
  const drive=await createWorldDriveM2A(app);
  const carrier=createCardCarrier({THREE,width:3.2});
  carrier.group.name='Travel Card Carrier · exact donor · World ENU adapter';
  carrier.group.scale.setScalar(.92);
  carrier.setVisible(false);carrier.setClipEnabled(false);app.scene.add(carrier.group);

  const flight={
    position:new THREE.Vector3(),heading:0,velocityHeading:0,speed:0,clearance:3,
    bank:0,pitchTilt:0,boosting:false,climbIn:0,groundM:0
  };
  const camTarget=new THREE.Vector3(),camWant=new THREE.Vector3(),forward=new THREE.Vector3();
  let cameraLook=new THREE.Vector3(),mode='GROUND',lastY=0,turnSmoothed=0,actorParent='world',drivePulse=0;

  const keydown=e=>{
    if(!play.on)return;
    keys[e.code]=true;
    if(mode==='FLIGHT'&&['Space','KeyC','KeyW','KeyS','KeyA','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  };
  const keyup=e=>{keys[e.code]=false};
  addEventListener('keydown',keydown,{capture:true});addEventListener('keyup',keyup,{capture:true});
  addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));

  function seatActor(){
    if(actorParent==='carrier')return;
    carrier.seat.add(play.actor.holder);
    play.actor.holder.position.set(0,0,0);
    play.actor.holder.rotation.set(0,0,0);
    carrier.applyClip(play.actor.body||play.actor.holder);
    carrier.setClipEnabled(true);carrier.setVisible(true);actorParent='carrier';
  }
  function groundActor(){
    if(actorParent==='world')return;
    play.actor.holder.removeFromParent();app.scene.add(play.actor.holder);
    carrier.setClipEnabled(false);carrier.setVisible(false);actorParent='world';
  }

  function enterFlight(){
    const p=play.position,g=play.ground(p.x,p.z);
    flight.position.copy(p);flight.position.y=Math.max(p.y,g+2.6);flight.groundM=g;
    flight.heading=play.walker.state.heading||0;flight.velocityHeading=flight.heading;
    flight.speed=Math.max(2.8,play.motion.speed||0);flight.clearance=flight.position.y-g;
    flight.bank=flight.pitchTilt=0;lastY=flight.position.y;seatActor();
    updateCarrier(1/60);follow(1/60,true);
    return {mode:'FLIGHT',movementOwner:'Travel flight ENU surface adapter',cameraOwner:'Travel flight ENU surface adapter'};
  }
  function enterGround(){
    groundActor();
    if(drive.active){const out=drive.safeExit();drive.setActive(false);play.actor.holder.visible=true;play.place(out.x,out.z,out.heading)}
    else {const p=flight.position.clone(),heading=flight.heading;play.place(p.x,p.z,heading)}
    play.setPosture('stand');
    return {mode:'GROUND',movementOwner:'World r2 play',cameraOwner:'World r2 play'};
  }

  function enterDrive(){
    if(drive.distanceTo(play.position)>8)throw Error('Das Fahrzeug ist zu weit entfernt');
    groundActor();drive.root.add(play.actor.holder);play.actor.holder.position.set(0,-.18,-.16);play.actor.holder.rotation.set(0,0,0);play.actor.holder.visible=true;actorParent='drive';drive.setActive(true);drivePulse=.42;
    return {mode:'DRIVE',movementOwner:'FREE_ROAM_C0',cameraOwner:'FREE_ROAM_C0',source:DRIVE_SOURCE};
  }

  const router=createTravelModeRouter({
    modes:MODES,initialMode:'GROUND',
    applyMode(next,transaction){
      const from=transaction?.from||mode;
      if(from==='DRIVE'&&next!=='DRIVE')enterGround();
      mode=next;document.body.dataset.m1Mobility=next.toLowerCase();
      if(next==='FLIGHT')return enterFlight();
      if(next==='DRIVE')return enterDrive();
      return from==='DRIVE'?{mode:'GROUND',movementOwner:'World r2 play',cameraOwner:'World r2 play'}:enterGround();
    },
    onChange(){paintModeEvent();}
  });
  const intent=createGroundFlightIntent({
    windowMs:DEFAULT_DOUBLE_SPACE_WINDOW_MS,
    onRequestFlight:request=>{router.set('FLIGHT',{source:request.source,deltaMs:request.deltaMs});return true;}
  });
  play.setJumpHandler(({event,jump})=>{
    if(mode==='FLIGHT')return true;
    const result=intent.noteGroundSpace(event);
    if(!result.requestFlight)jump();
    return true;
  });

  function updateCarrier(dt){
    const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),flight.heading);
    carrier.sync({position:flight.position,quaternion:q,bank:flight.bank,pitchTilt:flight.pitchTilt,boosting:flight.boosting,climbIn:flight.climbIn,speed:flight.speed},dt,play.actor);
  }
  function follow(dt,snap=false){
    const speedRatio=clamp(flight.speed/18,0,1),dist=8.5+speedRatio*5,height=4.2+speedRatio*1.4;
    forward.set(Math.sin(flight.heading),0,Math.cos(flight.heading));
    camTarget.copy(flight.position).addScaledVector(forward,2.1);camTarget.y+=1.0;
    camWant.copy(flight.position).addScaledVector(forward,-dist);camWant.y+=height;
    const posK=snap?1:1-Math.exp(-10*dt),lookK=snap?1:1-Math.exp(-9*.78*dt);
    app.camera.position.lerp(camWant,posK);cameraLook.lerp(camTarget,lookK);app.camera.up.set(0,1,0);app.camera.lookAt(cameraLook);
    const fov=60+12*speedRatio;if(Math.abs(app.camera.fov-fov)>.02){app.camera.fov=fov;app.camera.updateProjectionMatrix()}
  }
  function flightUpdate(dt){
    const turn=((keys.KeyA||keys.ArrowLeft)?1:0)-((keys.KeyD||keys.ArrowRight)?1:0);
    const throttle=!!(keys.KeyW||keys.ArrowUp),brake=!!(keys.KeyS||keys.ArrowDown),boost=!!(keys.ShiftLeft||keys.ShiftRight);
    const climb=(keys.Space?1:0)-(keys.KeyC?1:0);flight.boosting=boost&&throttle;flight.climbIn=climb;
    if(brake)flight.speed=Math.max(0,flight.speed-12*dt);
    else if(throttle)flight.speed=Math.min(boost?24:18,flight.speed+(boost?12:8)*dt);
    else flight.speed=Math.max(0,flight.speed-2*dt);
    turnSmoothed+=(turn*1.6-turnSmoothed)*(1-Math.exp(-8*dt));flight.heading=wrapPi(flight.heading+turnSmoothed*dt);
    const traction=Math.abs(turnSmoothed)>.75&&flight.speed>8?1.7:5;
    flight.velocityHeading=wrapPi(flight.velocityHeading+wrapPi(flight.heading-flight.velocityHeading)*Math.min(1,traction*dt));
    flight.position.x+=Math.sin(flight.velocityHeading)*flight.speed*dt;
    flight.position.z+=Math.cos(flight.velocityHeading)*flight.speed*dt;
    flight.clearance=clamp(flight.clearance+climb*8*dt,1.8,120);
    flight.groundM=play.ground(flight.position.x,flight.position.z);
    const targetY=flight.groundM+flight.clearance;flight.position.y+=(targetY-flight.position.y)*(1-Math.exp(-(targetY>flight.position.y?3.4:2.2)*dt));
    const rise=(flight.position.y-lastY)/Math.max(dt,1e-4);lastY=flight.position.y;
    const drift=wrapPi(flight.heading-flight.velocityHeading);
    const bankTarget=clamp(-turnSmoothed*.42+drift*.55,-.78,.78);flight.bank+=(bankTarget-flight.bank)*Math.min(1,5*dt);
    const pitchTarget=clamp(-rise*.025,-.38,.38);flight.pitchTilt+=(pitchTarget-flight.pitchTilt)*Math.min(1,4*dt);
    play.actor.play('idle',1,.18);play.actor.update(dt);updateCarrier(dt);follow(dt,false);
    return flight;
  }
  play.update=dt=>{
    if(mode==='FLIGHT'&&play.on)return flightUpdate(dt);
    if(mode==='DRIVE'&&play.on){
      if(drivePulse>0){drivePulse=Math.max(0,drivePulse-dt);const q=1-Math.abs(drivePulse/.21-1);drive.root.scale.set(1+.05*q,1-.08*q,1+.05*q)}else drive.root.scale.setScalar(1);
      play.actor.play('idle',1,.18);play.actor.update(dt);
      return drive.update(dt);
    }
    drive.update(dt);return baseUpdate(dt);
  };

  function report(){
    const candidate=mode==='GROUND'?publicCandidate(interactionCandidates()[0]):null;
    return {schema:'kfb.world-drive-interact-m2a/1',mode:mode.toLowerCase(),sameWorld:true,trackProxy:false,source:{...SOURCE,drive:DRIVE_SOURCE},router:router.report(),intent:intent.report(),interaction:{key:'E',available:mode==='DRIVE'||!!candidate,target:mode==='DRIVE'?{id:'vehicle:kart-oobi',kind:'vehicle',label:'get out of the car',distanceM:0}:candidate,candidateCount:mode==='GROUND'?interactionCandidates().length:0,vehicleDistanceM:+drive.distanceTo(play.position).toFixed(2)},ground:{position:[play.position.x,play.position.y,play.position.z].map(v=>+v.toFixed(2)),motion:play.motion.state,speed:+(play.motion.speed||0).toFixed(2)},drive:drive.report(),flight:{position:[flight.position.x,flight.position.y,flight.position.z].map(v=>+v.toFixed(2)),speed:+flight.speed.toFixed(2),clearance:+flight.clearance.toFixed(2),actorPose:mode==='FLIGHT'?'idle on card carrier':play.motion.state,vehicle:mode==='FLIGHT'?'card-carrier.js':null}};
  }
  function setMode(next,meta={source:'UI'}){
    const raw=String(next||'').toUpperCase(),target=raw==='FLIGHT'?'FLIGHT':raw==='DRIVE'?'DRIVE':'GROUND';
    if(target===mode)return report();
    intent.reset('explicit-mode-change');router.set(target,meta);return report();
  }
  function interact(meta={source:'E interaction'}){
    if(mode==='DRIVE'){router.set('GROUND',meta);return {ok:true,action:'EXIT_VEHICLE',report:report()}}
    if(mode!=='GROUND')return {ok:false,reason:'GROUND_REQUIRED',report:report()};
    const candidate=interactionCandidates()[0];
    if(!candidate)return {ok:false,reason:'NO_INTERACTION_TARGET',report:report()};
    if(candidate.kind==='vehicle'){
      router.set('DRIVE',meta);return {ok:true,action:'ENTER_VEHICLE',target:publicCandidate(candidate),report:report()};
    }
    const resolver=candidate._resolver;
    const result=resolver?.interact?.({candidate:publicCandidate(candidate),meta,app,play,mode});
    paintModeEvent();
    return {ok:true,action:'EXTERNAL_INTERACTION',target:publicCandidate(candidate),result:result??null,report:report()};
  }
  addEventListener('keydown',e=>{if(!play.on||e.repeat||e.code!=='KeyE')return;const t=String(e.target?.tagName||'').toLowerCase();if(['input','textarea','select'].includes(t))return;e.preventDefault();e.stopImmediatePropagation();interact()},{capture:true});
  function paintModeEvent(){dispatchEvent(new CustomEvent('kfb-world-mobility',{detail:report()}))}
  document.body.dataset.m1Mobility='ground';
  return {
    setMode,interact,registerInteractionResolver,interactionCandidates:()=>interactionCandidates().map(publicCandidate),
    router,intent,source:SOURCE,carrier,drive,
    report,
    get mode(){return mode.toLowerCase()}
  };
}
