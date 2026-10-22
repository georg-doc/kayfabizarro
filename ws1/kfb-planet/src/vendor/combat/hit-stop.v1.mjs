/** V567 participant-local time budget, prepared for WS1. No clock/mixer/world/camera writer. */
export const HIT_STOP_DEFAULT_MS=4/60*1000;
export const HIT_STOP_CAP_MS=150;
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite)&&Math.hypot(...v)>1e-9;
export function createHitStop({cameraKick=false,maxEvents=256}={}){
 if(!Number.isInteger(maxEvents)||maxEvents<1||maxEvents>4096)throw new TypeError('BOUNDED_EVENT_LEDGER_REQUIRED');
 const actors=new Map(),seen=new Set();let now=0;
 return {
  trigger({eventId,participants,hitStop={}}){
   if(typeof eventId!=='string'||!eventId||!Array.isArray(participants)||!participants.length||participants.length>64||participants.some(id=>typeof id!=='string'||!id))throw new TypeError('CONTACT_AND_PARTICIPANTS_REQUIRED');
   const strength=hitStop.strength??1,durationMs=hitStop.durationMs??HIT_STOP_DEFAULT_MS,dir=hitStop.dir??[0,0,1];
   if(!Number.isFinite(strength)||strength<0||strength>1||!Number.isFinite(durationMs)||durationMs<0||!vec(dir))throw new TypeError('INVALID_HIT_STOP_MARKER');
   if(seen.has(eventId))return {accepted:false,reason:'duplicate',cameraKick:null};
   seen.add(eventId);if(seen.size>maxEvents)seen.delete(seen.values().next().value);
   const ms=strength===0?0:Math.min(HIT_STOP_CAP_MS,durationMs),unit=dir.map(v=>v/Math.hypot(...dir));
   for(const id of new Set(participants)){
    const old=actors.get(id),start=old?.start??now;
    // Overlapping contacts extend to max, never add, never exceed one 150ms window.
    const until=Math.min(start+HIT_STOP_CAP_MS,Math.max(old?.until??now,now+ms));
    if(until>now)actors.set(id,{start,until});
   }
   return {accepted:true,durationMs:ms,participants:[...new Set(participants)],cameraKick:cameraKick&&ms?{strength,dir:unit}:null};
  },
  step(dt,{paused=false}={}){
   if(!Number.isFinite(dt)||dt<0)throw new TypeError('FINITE_NONNEGATIVE_DT_REQUIRED');
   if(paused)return {worldDt:0,for:()=>0};
   const end=now+dt*1000,budgets=new Map();
   for(const [id,state]of actors){const frozen=Math.max(0,Math.min(end,state.until)-now);budgets.set(id,Math.max(0,dt-frozen/1000));if(state.until<=end)actors.delete(id);}
   now=end;return {worldDt:dt,for:id=>budgets.get(id)??dt};
  },
  cancel(id){actors.delete(id);},
  clear(){actors.clear();seen.clear();now=0;},
  report(){return {activeParticipants:actors.size,rememberedEvents:seen.size,capMs:HIT_STOP_CAP_MS,cameraKick};}
 };
}
