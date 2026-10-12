// KFB Motion-to-Video R1: pure frame-time plan for EXISTING MUSIC-PERF-01.
// Neither a renderer nor audio engine. Source identity and chronology are authoritative.
export const EXPORT_PROFILE=Object.freeze({
 schema:'kfb.motion-to-video.frame-plan/0.1',
 durationSec:8,
 fps:30,
 width:1280,
 height:720,
 mode:'performance',
 frameCount:240
});
const mod=(v,n)=>((v%n)+n)%n;
function guard(v,message){if(!v)throw new Error(message);}
function approx(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8;}
export function createFramePlan(recipe,donor,profile=EXPORT_PROFILE){
 guard(recipe?.schema==='kfb.resident-performance.v1','recipe schema mismatch');
 guard(donor?.schema==='kfb.resident-module/0.1','donor schema mismatch');
 guard(profile?.schema===EXPORT_PROFILE.schema,'export profile schema mismatch');
 for(const k of ['durationSec','fps','width','height','frameCount'])guard(profile[k]===EXPORT_PROFILE[k],'unsupported export profile '+k);
 guard(profile.mode==='performance','only accepted performance mode in export R1');
 guard(recipe.sourceObject?.residentModuleId===donor.id&&recipe.sourceObject?.version===donor.version,'source identity mismatch');
 guard(recipe.sourceObject?.isolationRequired===true,'source isolation requirement missing');
 guard(recipe.sourceObject?.glbBlob==='446b044ed7c68bf877afc0f456f0aa87cc390b46','GLB source pin mismatch');
 guard(recipe.songRef?.blob==='368eb5ae8fafcfba1cce3ba3f80488378fe056b0','song pin mismatch');
 guard(recipe.songRef.blob===donor.track?.gitBlob,'source soundtrack mismatch');
 guard(approx(recipe.timing?.bpm,100)&&approx(recipe.timing?.phaseOffsetSec,0.465),'timing source mismatch');
 guard(recipe.timing?.beatsPerBar===4&&Number.isInteger(recipe.timing?.barOffset),'bar timing invalid');
 guard(recipe.markers?.startBeat===0&&recipe.markers?.loopEndBeat===32,'source marker mismatch');
 guard(Array.isArray(recipe.performers)&&recipe.performers.length===3,'expected original ORB roster');
 guard(recipe.performers.every(p=>!('songRef' in p)),'per-performer song transport prohibited');
 const names=new Set();
 const performerPlan=recipe.performers.map(p=>{
   guard(typeof p.id==='string'&&!names.has(p.id),'duplicate performer id');names.add(p.id);
   const c=donor.clips.find(v=>v.name===p.choreography?.actionRef);
   guard(!!c&&Number.isFinite(c.duration)&&c.duration>0,'missing or invalid donor clip '+p.id);
   guard(c.performer===p.id&&c.beats===p.choreography.cycleBeats,'choreography donor mismatch '+p.id);
   guard(p.sourceNode===donor.performers?.[p.id]?.node,'performer source node mismatch '+p.id);
   guard(p.humanResult==='PASS'?p.enabled===true:p.humanResult==='HOLD'&&p.enabled===false,'unauthorized HOLD or unknown approval '+p.id);
   guard(Number.isFinite(p.choreography.startBeat)&&Number.isFinite(p.choreography.beatOffset),'invalid action offsets');
   return Object.freeze({id:p.id,sourceNode:p.sourceNode,actionRef:c.name,clipDurationSec:c.duration,cycleBeats:c.beats,startBeat:p.choreography.startBeat,beatOffset:p.choreography.beatOffset,visible:p.enabled,humanResult:p.humanResult});
 });
 guard(names.has('leader')&&names.has('guitarist')&&names.has('drummer'),'ORB performers absent');
 const audioStartSec=recipe.timing.phaseOffsetSec+recipe.markers.startBeat*60/recipe.timing.bpm;
 return Object.freeze({
   schema:EXPORT_PROFILE.schema,id:recipe.id,sourceId:donor.id,sourceVersion:donor.version,
   modelGitBlob:recipe.sourceObject.glbBlob,songGitBlob:recipe.songRef.blob,
   fps:profile.fps,width:profile.width,height:profile.height,frameCount:profile.frameCount,
   durationSec:profile.durationSec,mode:'performance',audioStartSec,audioEndSec:audioStartSec+profile.durationSec,
   bpm:recipe.timing.bpm,phaseOffsetSec:recipe.timing.phaseOffsetSec,performers:Object.freeze(performerPlan)
 });
}
export function sampleFrame(plan,frameIndex){
 guard(plan?.schema===EXPORT_PROFILE.schema,'frame plan missing');
 guard(Number.isInteger(frameIndex)&&frameIndex>=0&&frameIndex<plan.frameCount,'frame outside [0,frameCount)');
 const timelineSec=frameIndex/plan.fps;
 const songTimeSec=plan.audioStartSec+timelineSec;
 const beatPos=(songTimeSec-plan.phaseOffsetSec)*plan.bpm/60;
 const actions=plan.performers.map(p=>{
   const localBeat=beatPos-p.startBeat-p.beatOffset;
   const actionTimeSec=(localBeat<0?0:mod(localBeat,p.cycleBeats))*p.clipDurationSec/p.cycleBeats;
   return Object.freeze({performerId:p.id,sourceNode:p.sourceNode,actionRef:p.actionRef,actionTimeSec,visible:p.visible});
 });
 return Object.freeze({frameIndex,timestampUs:Math.round(frameIndex*1000000/plan.fps),timelineSec,songTimeSec,beatPos,actions:Object.freeze(actions)});
}
