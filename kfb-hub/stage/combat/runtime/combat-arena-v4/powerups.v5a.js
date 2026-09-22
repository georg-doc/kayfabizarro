// Gameplay only. Sound/particles are emitted by Rewards/Fun after this has resolved.
export const POWERUPS=Object.freeze({
  waterbomb:{radius:3.2},smokebomb:{radius:3.2,duration:2.5}
});
export function activatePowerup(gf,kind,at=gf.pc.pos){
  const spec=POWERUPS[kind];if(!spec)return null;
  let affected=0;
  // Snapshot: a defeat may change the mob list, but cannot recursively detonate its loot.
  const nearby=gf.mb.lebende().filter(m=>Math.hypot(m.pos.x-at.x,m.pos.z-at.z)<=spec.radius+(m.radius||0));
  if(kind==='waterbomb'){
    gf.onReveal?.(at,spec.radius);
    for(const m of nearby){
      const dx=m.pos.x-at.x,dz=m.pos.z-at.z,d=Math.hypot(dx,dz)||1;
      if(gf.damageMob(m,{x:dx/d,z:dz/d},m.pos.clone()))affected++;
    }
  }else{
    for(const m of nearby){m.powerStun=Math.max(m.powerStun||0,spec.duration);m._windup=0;m.kalt=Math.max(m.kalt||0,.3);affected++;}
  }
  if(affected){gf.aggro=true;gf.mb.friedlich=false;}
  return {kind,affected,text:kind==='waterbomb'?'SPLASH! · Tinte weg':`PUFF! · ${affected} benommen`};
}
