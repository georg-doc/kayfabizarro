// FR-S04-01: input adapter only. Slice-04/Rapier remains the physical pose owner.
export const DEFAULTS = Object.freeze({length:2.8, neutralSeconds:.12, maxForward:10, maxReverse:2.5, maxBoost:14, driftMin:4});
export function createDriveIntent(options={}) {
  const p={...DEFAULTS,...options};
  for(const key of Object.keys(p)) if(!Number.isFinite(p[key])||p[key]<=0) throw new TypeError('Invalid drive parameter: '+key);
  let gear=0,pending=0,dwell=0,hopHeld=false,phase='NEUTRAL';
  const reset=()=>{gear=0;pending=0;dwell=0;hopHeld=false;phase='NEUTRAL';};
  return {reset, snapshot:()=>({gear,pending,dwell,phase}),
    step(request={}, speed=0, dt=1/60, contacts=0) {
      if(!Number.isFinite(speed)||!Number.isFinite(dt)||dt<0||dt>.1) throw new TypeError('Invalid simulation sample');
      const direction=Number(!!request.forward)-Number(!!request.backward);
      const conflict=!!request.forward&&!!request.backward;
      const driftDirection=Number(!!request.driftRight)-Number(!!request.driftLeft);
      let steer=Number(!!request.right)-Number(!!request.left),brake=!!request.brake||conflict;
      let throttle=0,boost=false,drift=false;
      const freshHop=!!request.hop&&!hopHeld;hopHeld=!!request.hop;
      const epsilon=.02*p.length;
      if(brake||direction===0){pending=0;dwell=0;phase=brake?'BRAKE':'COAST';}
      else if(direction*speed < -epsilon){pending=direction;dwell=0;brake=true;phase='BRAKE_TO_REVERSE';}
      else if(gear!==direction||pending===direction){
        if(pending!==direction){pending=direction;dwell=0;}
        // A fast roll in the desired direction does not need a brake/reverse sequence.
        if(direction*speed>epsilon){gear=direction;pending=0;dwell=0;}
        else {dwell+=dt;brake=true;phase='NEUTRAL_DWELL';if(dwell+1e-10>=p.neutralSeconds){gear=direction;pending=0;dwell=0;brake=false;}}
      }
      if(direction!==0&&!brake&&gear===direction){
        boost=direction===1&&speed>=-epsilon&&!!request.boost;
        const cap=direction<0?p.maxReverse:boost?p.maxBoost:p.maxForward;
        const along=direction*speed;
        // Cap propulsion first. Braking only corrects genuine overspeed; never flip velocity.
        throttle=along<cap?direction:0;brake=along>cap+.12;
        drift=direction===1&&driftDirection!==0&&speed>p.driftMin&&contacts>=2&&!brake;
        if(drift)steer=Math.max(-1,Math.min(1,steer+.35*driftDirection));
        if(brake){boost=false;drift=false;}
        phase=brake?'LIMIT_BRAKE':direction<0?'REVERSE':boost?'BOOST':drift?'DRIFT':'DRIVE';
      }
      return {throttle:brake?0:throttle,steer,brake,drift,boost:boost&&!brake,
        hop:freshHop&&contacts>=2,phase,gear,neutralSeconds:dwell};
    }
  };
}
