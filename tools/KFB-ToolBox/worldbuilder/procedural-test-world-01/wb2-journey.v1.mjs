/* Lean receipts live in WB2's existing scene document. Cards/media remain canonical references. */
export const JOURNEY_SCHEMA='kfb.golden-journey-memory/1';
const PIN='b6afb431c25e48767bf875c8b2eb74866f6946e5';
export const OFFERS=Object.freeze({
  'town.clown':{id:'clown-onboarding',choice:'bingo',grant:'ignore_dystopia:1',opens:'quest.deliver.dystopia01.orc-band'},
  'town.driver':{id:'driver-key',choice:'bingo',grant:'item.taxi-key.01'},
  'dystopia.orc':{id:'orc-handoff',choice:'bingo',requires:['ignore_dystopia:1','song:demon-afro-strut'],grant:'forget_utopia:1',closes:'quest.deliver.dystopia01.orc-band',opens:'quest.deliver.utopia01.ceo'},
  'utopia.monstrosity':{id:'utopia-ceo',choice:'bongo',requires:['forget_utopia:1'],grant:'embrace_protopia:1',closes:'quest.deliver.utopia01.ceo',opens:'quest.deliver.protopia01.farmers'},
  'protopia.farmers':{id:'protopia-farmers',choice:'bingo',requires:['embrace_protopia:1'],grant:'anti_rules_toolkit:1',closes:'quest.deliver.protopia01.farmers',opens:'quest.deliver.antirules01.lorekeeper'},
  'protopia.lorekeeper':{id:'lorekeeper',choice:'boggle',requires:['anti_rules_toolkit:1'],closes:'quest.deliver.antirules01.lorekeeper'}
});
export function memoryOf(doc){
  const m=doc.memory||(doc.memory={schema:JOURNEY_SCHEMA,seed:3,sessionId:globalThis.crypto?.randomUUID?.()||'session-'+Date.now(),receipts:[],quests:[],completed:[]});
  if(m.schema!==JOURNEY_SCHEMA||!Array.isArray(m.receipts)||!Array.isArray(m.quests)||!Array.isArray(m.completed))throw Error('Invalid Lean Memory');return m;
}
export function createJourney(getDoc,{now=()=>new Date().toISOString()}={}){
  const owns=ref=>memoryOf(getDoc()).receipts.some(r=>r.ref===ref);
  const remember=(ref,residentId,kind,extra={})=>{const m=memoryOf(getDoc());if(m.receipts.some(r=>r.ref===ref&&r.kind===kind))return null;const receipt={id:m.sessionId+':'+m.receipts.length,ref,kind,residentId,worldId:({town:'world.kfb-town',dystopia:'world.dystopia',utopia:'world.utopia',protopia:'world.protopia'})[residentId?.split('.')[0]]||null,seed:m.seed,time:now(),sourceCommit:PIN,...extra};m.receipts.push(receipt);return receipt;};
  return{owns,memory:()=>memoryOf(getDoc()),remember,
    offer(residentId){const offer=OFFERS[residentId];if(!offer)return null;const missing=(offer.requires||[]).filter(ref=>!owns(ref));return{...offer,residentId,missing,completed:memoryOf(getDoc()).completed.includes(offer.id)}},
    choose(residentId,choice){const offer=this.offer(residentId);if(!offer)throw Error('Unknown Golden Resident');remember('resident:'+residentId,residentId,'met');if(offer.missing.length)return{ok:false,reason:'prerequisite',missing:offer.missing};if(offer.completed)return{ok:true,repeated:true};if(choice!==offer.choice)return{ok:false,reason:'choice',choice};const m=memoryOf(getDoc());const receipt=offer.grant?remember(offer.grant,residentId,offer.grant.startsWith('item:')||offer.grant.startsWith('item.')?'item':'card',{choice,encounterId:offer.id}):remember('encounter:'+offer.id,residentId,'encounter',{choice});if(offer.closes)m.quests=m.quests.filter(q=>q!==offer.closes);if(offer.opens&&!m.quests.includes(offer.opens))m.quests.push(offer.opens);m.completed.push(offer.id);return{ok:true,receipt};},
    completeSong(track,{playedSeconds,duration,ended,gitBlob,blobOk}={}){if(track!=='demon-afro-strut'||!ended||!blobOk||!gitBlob||!Number.isFinite(duration)||duration<100||playedSeconds<duration-.5)return{ok:false,reason:'actual-complete-song-required'};const song=remember('song:'+track,'dystopia.orc','song',{gitBlob,playedSeconds,duration});remember('dance:kfb_dance_hip_hop_a','dystopia.orc','dance',{songId:track});return{ok:true,song};},
    exportBundle(){const doc=getDoc();const player=doc.world?.player;if(!player||!player.position?.every(Number.isFinite))throw Error('Safe player state required');return{schema:'kfb.player-journey-bundle/1',worldId:doc.id,worldSource:doc.world.source,player:structuredClone(player),memory:structuredClone(memoryOf(doc))};},
    applyBundle(bundle){const doc=getDoc();if(bundle.schema!=='kfb.player-journey-bundle/1'||bundle.worldId!==doc.id||bundle.memory?.schema!==JOURNEY_SCHEMA||!Array.isArray(bundle.memory.receipts)||!bundle.player?.position?.every(Number.isFinite)||!Number.isFinite(bundle.player.heading))throw Error('Invalid Journey Bundle');const cardRefs=new Set(['ignore_dystopia:1','forget_utopia:1','embrace_protopia:1','anti_rules_toolkit:1']);for(const r of bundle.memory.receipts)if(r.kind==='card'&&!cardRefs.has(r.ref))throw Error('Unknown canonical Card identity');doc.memory=structuredClone(bundle.memory);doc.world.player={...structuredClone(bundle.player),speed:0,intention:'idle'};return doc;}
  };
}
