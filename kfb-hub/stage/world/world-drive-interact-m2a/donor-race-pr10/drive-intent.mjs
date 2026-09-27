// FR-S04-02: semantic input adapter only. Slice-04/Rapier remains the physical pose owner.
export const DEFAULTS = Object.freeze({
  length:2.8, neutralSeconds:.08, neutralSpeed:.16, switchSpeed:.45,
  maxForward:12, maxReverse:3.2, maxBoost:18, reverseThrottle:.68, driftMin:4,
});
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
      // Slice-04 physical steering is opposite the first UI adapter. Positive here is LEFT:
      // A/Q = +1, D/E = -1 in forward travel. Candidate reverse uses an explicit arcade mapping:
      // A/D keep the same visible screen-trajectory meaning while backing up. Raw donor mode remains
      // available for the unassisted physical steering convention.
      const driftDirection=Number(!!request.driftLeft)-Number(!!request.driftRight);
      const baseSteer=Number(!!request.left)-Number(!!request.right);
      let steer=baseSteer*(gear<0?-1:1);
      let brake=!!request.brake||conflict,throttle=0,boost=false,drift=false;
      const freshHop=!!request.hop&&!hopHeld;hopHeld=!!request.hop;

      if(brake){pending=0;dwell=0;phase='BRAKE';}
      else if(direction===0){pending=0;dwell=0;phase='COAST';}
      else if(gear!==direction){
        pending=direction;
        // Hysteresis: do not reclassify tiny signed-speed noise as another direction change.
        if(direction*speed < -p.switchSpeed || Math.abs(speed)>p.neutralSpeed){
          dwell=0;brake=true;phase='BRAKE_TO_REVERSE';
        }else{
          dwell+=dt;brake=true;phase='NEUTRAL_DWELL';
          if(dwell+1e-10>=p.neutralSeconds){gear=direction;pending=0;dwell=0;brake=false;}
        }
      }else if(direction*speed < -p.switchSpeed){
        // A real rollback on a slope is opposed, but sub-threshold sign noise is driven through.
        brake=true;phase='ROLLBACK_BRAKE';
      }

      if(direction!==0&&!brake&&gear===direction){
        boost=direction===1&&speed>=-p.switchSpeed&&!!request.boost;
        const cap=direction<0?p.maxReverse:boost?p.maxBoost:p.maxForward;
        const along=direction*speed;
        const driveAmount=direction<0?p.reverseThrottle:1;
        // Coast at the cap. Only large gravity overspeed gets a brake pulse; this avoids
        // the old reverse brake/throttle chatter around one exact threshold.
        throttle=along<cap?direction*driveAmount:0;
        if(along>cap+.8){brake=true;throttle=0;}
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
