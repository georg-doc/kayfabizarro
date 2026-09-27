import * as THREE from 'three';

export function mountFlightMode(app){
  if(!app?.play)throw Error('Flight C0 needs the existing World play owner');
  const play=app.play,baseUpdate=play.update.bind(play),keys={},drag={on:false,x:0,y:0};
  let mode='walk',heading=play.walker.state.heading||0,pitch=.28,speed=0;
  const forward=new THREE.Vector3(),right=new THREE.Vector3(),move=new THREE.Vector3(),target=new THREE.Vector3(),want=new THREE.Vector3();
  const keydown=e=>{if(!play.on)return;keys[e.code]=true;if(mode==='flight'&&['Space','KeyC','KeyW','KeyS','KeyA','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()};
  const keyup=e=>{keys[e.code]=false};addEventListener('keydown',keydown,{capture:true});addEventListener('keyup',keyup,{capture:true});addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
  app.renderer.domElement.addEventListener('pointerdown',e=>{if(mode!=='flight'||!play.on)return;drag.on=true;drag.x=e.clientX;drag.y=e.clientY},{capture:true});
  addEventListener('pointermove',e=>{if(!drag.on||mode!=='flight')return;heading-=(e.clientX-drag.x)*.0055;pitch=THREE.MathUtils.clamp(pitch-(e.clientY-drag.y)*.0045,-.7,1.2);drag.x=e.clientX;drag.y=e.clientY},{capture:true});
  addEventListener('pointerup',()=>drag.on=false,{capture:true});
  function follow(dt,snap=false){const p=play.position;forward.set(Math.sin(heading),0,Math.cos(heading));target.copy(p).add(new THREE.Vector3(0,1.2,0));want.copy(target).addScaledVector(forward,-11).add(new THREE.Vector3(0,5.2+pitch*5,0));if(snap)app.camera.position.copy(want);else app.camera.position.lerp(want,1-Math.exp(-dt*7));app.camera.lookAt(target)}
  function flightUpdate(dt){
    const p=play.position,boost=(keys.ShiftLeft||keys.ShiftRight)?2.15:1,iy=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),up=(keys.Space?1:0)-(keys.KeyC?1:0);
    forward.set(Math.sin(heading),0,Math.cos(heading));right.set(forward.z,0,-forward.x);move.set(0,0,0).addScaledVector(forward,iy).addScaledVector(right,ix);if(move.lengthSq())move.normalize();
    const targetSpeed=(move.lengthSq()?13:0)*boost;speed+=THREE.MathUtils.clamp(targetSpeed-speed,-20*dt,14*dt);p.addScaledVector(move,speed*dt);p.y+=up*8*boost*dt;const floor=play.ground(p.x,p.z)+1.2;p.y=THREE.MathUtils.clamp(p.y,floor,floor+180);
    play.actor.holder.position.copy(p);play.actor.holder.rotation.y=heading;play.actor.play('jump.air',0,0);play.actor.update(dt);follow(dt);return play.walker.state;
  }
  play.update=dt=>mode==='flight'&&play.on?flightUpdate(dt):baseUpdate(dt);
  function setMode(next){
    const requested=next==='flight'?'flight':'walk';if(requested===mode)return {mode};
    if(requested==='flight'){mode='flight';heading=play.walker.state.heading||heading;const g=play.ground(play.position.x,play.position.z);play.position.y=Math.max(play.position.y,g+3);speed=0;follow(0,true)}
    else{mode='walk';play.place(play.position.x,play.position.z,heading);speed=0}
    document.body.dataset.c0Mobility=mode;return {mode};
  }
  document.body.dataset.c0Mobility=mode;
  return {setMode,report:()=>({schema:'kfb.flight-mode-c0/1',mode,owner:'World r2 play object',sameWorld:true,position:[play.position.x,play.position.y,play.position.z].map(v=>+v.toFixed(2)),controls:mode==='flight'?'WASD · Space/C height · Shift boost · drag view':'World r2 walking controls'}),get mode(){return mode}};
}
