// KFB GROUND-CONTROLLER-DONOR-01 · clean-room movement response.
// The external 3D-Game-Template-Ultimate repository was inspected for behavior only.
// No source code is copied: the useful idea is simply velocity response/damping instead of
// instantly snapping the player's world speed to the commanded speed.

const finite=(v,f=0)=>Number.isFinite(v)?v:f;
export const DIRECT='direct';
export const VELOCITY='velocity';

export function normalizeFeel(value){
  return String(value||'').toLowerCase()===VELOCITY?VELOCITY:DIRECT;
}

export function responseAlpha(rate,dt){
  return 1-Math.exp(-Math.max(0,finite(rate))*Math.max(0,Math.min(.1,finite(dt))));
}

export function stepLocalVelocity(current,target,dt,opts={}){
  const cx=finite(current?.x), cy=finite(current?.y);
  const tx=finite(target?.x), ty=finite(target?.y);
  const cm=Math.hypot(cx,cy), tm=Math.hypot(tx,ty);
  const accel=Math.max(.01,finite(opts.acceleration,7.5));
  const decel=Math.max(.01,finite(opts.deceleration,11));
  const turn=Math.max(.01,finite(opts.directionResponse,13));
  let rate=tm+1e-6<cm?decel:accel;
  if(cm>1e-6&&tm>1e-6){
    const alignment=(cx*tx+cy*ty)/(cm*tm);
    if(alignment<.75)rate=turn;
  }
  const a=responseAlpha(rate,dt);
  let x=cx+(tx-cx)*a, y=cy+(ty-cy)*a;
  const snap=Math.max(0,finite(opts.snap,1e-4));
  if(Math.hypot(x-tx,y-ty)<=snap){x=tx;y=ty;}
  if(tm<=snap&&Math.hypot(x,y)<=snap){x=0;y=0;}
  return {x,y,speed:Math.hypot(x,y),targetSpeed:tm,alpha:a,rate};
}
