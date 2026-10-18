import {createFootstepAudio,SURFACES} from './audio.mjs?v=0.7.6';
// Audio-owned consumer seam. The GAME owns contact/support/time; this module owns only sounds.
export async function createFootstepConsumer({audioContext,destination,rows,defaultSurface='wood'}){
 if(!audioContext||!destination)throw Error('Inject existing context and PLAYER_CRITICAL destination');
 if(!rows){const [s,i]=await Promise.all(['sources.json','imported-sources.json'].map(async p=>{const r=await fetch(new URL(p,import.meta.url));if(!r.ok)throw Error('Missing '+p);return r.json();}));rows=[...s.rows,...s.r2Rows,...i.rows];}
 const audio=await createFootstepAudio({audioContext,destination,rows}),seen=new Set();let surface=defaultSurface,active=false;
 const select=id=>{if(!SURFACES[id]||SURFACES[id].role==='accent')throw Error('Unknown walking surface '+id);surface=id;};select(surface);
 return {start(){active=true;audio.arm();},stop(){active=false;audio.stop();seen.clear();},setSurface:select,
  emit(event){if(!active)return null;if(!event?.id||!Number.isFinite(event.at))throw Error('Unique cue id and existing-context time required');if(seen.has(event.id))return null;
   if(event.type==='footstep'&&(!event.grounded||!event.moving||!['l','r'].includes(event.foot)))return null;
   if(!['footstep','creak'].includes(event.type))return null;const bank=event.type==='creak'?'creak':event.surface||surface;
   if(!SURFACES[bank]||(event.type==='footstep'&&SURFACES[bank].role==='accent'))throw Error('Invalid cue surface');
   seen.add(event.id);if(seen.size>512)seen.delete(seen.values().next().value);
   return audio.play({kind:event.type,time:event.at,foot:event.foot,surface:bank,key:event.id});},
  snapshot(){return {surface,active,metrics:audio.metrics,state:audio.state(),clock:'injected existing AudioContext',moduleCreatedContexts:0};},dispose(){active=false;audio.dispose();}};
}
