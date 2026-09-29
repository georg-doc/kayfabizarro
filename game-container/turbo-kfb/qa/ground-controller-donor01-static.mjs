import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const feelSrc=await fs.readFile(new URL('app/src/ground-feel.js',root),'utf8');
const walkSrc=await fs.readFile(new URL('app/src/walk-controller.js',root),'utf8');
const playerSrc=await fs.readFile(new URL('app/src/ground-player.js',root),'utf8');

const mod=await import('data:text/javascript;base64,'+Buffer.from(feelSrc).toString('base64'));

assert.equal(mod.normalizeFeel(),mod.DIRECT);
assert.equal(mod.normalizeFeel('velocity'),mod.VELOCITY);
const first=mod.stepLocalVelocity({x:0,y:0},{x:0,y:1},1/60,{acceleration:7.5,deceleration:11,directionResponse:13});
assert.ok(first.speed>0&&first.speed<1,'velocity starts below target');

function sim(hz,target={x:0,y:1},start={x:0,y:0},seconds=1){
  let s={...start};
  for(let i=0;i<hz*seconds;i++)s=mod.stepLocalVelocity(s,target,1/hz,{acceleration:7.5,deceleration:11,directionResponse:13});
  return s;
}
const a=sim(60),b=sim(120);
assert.ok(Math.abs(a.speed-b.speed)<1e-9,'response is frame-rate independent');
const reverse=mod.stepLocalVelocity({x:0,y:1},{x:0,y:-1},1/60,{acceleration:7.5,deceleration:11,directionResponse:13});
assert.ok(reverse.y>0,'reversal does not flip full direction in one frame');

assert.match(feelSrc,/No source code is copied/);
assert.doesNotMatch(feelSrc,/Soldier\.glb|NUM_SPHERES|sphereIdx|playerCollider/);
assert.match(walkSrc,/feelMode: DIRECT/);
assert.match(walkSrc,/normalizeFeel\(P\.feelMode\) === VELOCITY/);
assert.match(playerSrc,/groundFeel/);
assert.match(playerSrc,/Rig_Medium_MovementAdvanced\.glb/);
for(const role of ['Running_B','Walking_Backwards','Running_Strafe_Left','Running_Strafe_Right'])assert.match(playerSrc,new RegExp(role));
assert.match(playerSrc,/jumpApex=actorHeight\*\.52/);
assert.match(playerSrc,/bounceMax:0/);
assert.match(playerSrc,/LEGACY_WALK_SPEED = 1\.08/);
assert.match(playerSrc,/enhanced \? Object\.values\(CLIP\)/);

console.log('RESULT 16/16 PASS');
