import * as THREE from 'three';
import {createTravelModeRouter,TRAVEL_MODE_DEFINITIONS} from './travel-mode-router.js';
import {createGroundFlightIntent,DEFAULT_DOUBLE_SPACE_WINDOW_MS} from './mode-intent.js';
import {createCardCarrier} from './card-carrier.js';

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
  return copy;
});

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrapPi=a=>Math.atan2(Math.sin(a),Math.cos(a));

export function mountWorldMobility(app){
  if(!app?.play||!app?.scene||!app?.camera)throw Error('WORLD-MOBILITY-M1 needs the existing World r2 play owner');
  const play=app.play,baseUpdate=play.update.bind(play),keys={};
  const carrier=createCardCarrier({THREE,width:3.2});
  carrier.group.name='Travel Card Carrier · exact donor · World ENU adapter';
  carrier.group.scale.setScalar(.92);
  carrier.setVisible(false);carrier.setClipEnabled(false);app.scene.add(carrier.group);

  const flight={
    position:new THREE.Vector3(),heading:0,velocityHeading:0,speed:0,clearance:3,
    bank:0,pitchTilt:0,boosting:false,climbIn:0,groundM:0
  };
  const camTarget=new THREE.Vector3(),camWant=new THREE.Vector3(),forward=new THREE.Vector3();
  let cameraLook=new THREE.Vector3(),mode='GROUND',lastY=0,turnSmoothed=0,actorParent='world';

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
    carrier.seat.remove(play.actor.holder);app.scene.add(play.actor.holder);
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
    const p=flight.position.clone(),heading=flight.heading;groundActor();
    play.place(p.x,p.z,heading);play.setPosture('stand');
    return {mode:'GROUND',movementOwner:'World r2 play',cameraOwner:'World r2 play'};
  }

  const router=createTravelModeRouter({
    modes:MODES,initialMode:'GROUND',
    applyMode(next){mode=next;document.body.dataset.m1Mobility=next.toLowerCase();return next==='FLIGHT'?enterFlight():enterGround();},
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
  play.update=dt=>mode==='FLIGHT'&&play.on?flightUpdate(dt):baseUpdate(dt);

  function report(){return {schema:'kfb.world-mobility-m1/1',mode:mode.toLowerCase(),sameWorld:true,trackProxy:false,source:SOURCE,router:router.report(),intent:intent.report(),flight:{position:[flight.position.x,flight.position.y,flight.position.z].map(v=>+v.toFixed(2)),speed:+flight.speed.toFixed(2),clearance:+flight.clearance.toFixed(2),actorPose:mode==='FLIGHT'?'idle on card carrier':play.motion.state,vehicle:mode==='FLIGHT'?'card-carrier.js':null}}}
  function setMode(next,meta={source:'UI'}){
    const target=String(next||'').toUpperCase()==='FLIGHT'?'FLIGHT':'GROUND';
    if(target===mode)return report();
    intent.reset('explicit-mode-change');router.set(target,meta);return report();
  }
  function paintModeEvent(){dispatchEvent(new CustomEvent('kfb-world-mobility',{detail:report()}))}
  document.body.dataset.m1Mobility='ground';
  return {
    setMode,router,intent,source:SOURCE,carrier,
    report,
    get mode(){return mode.toLowerCase()}
  };
}
