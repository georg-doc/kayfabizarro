const clamp01=v=>Math.max(0,Math.min(1,Number(v)||0));

export function validateContext(s){
  if(!s||s.schema!=='kfb.audio.context.v1') throw new Error('Expected kfb.audio.context.v1');
  if(!Number.isInteger(s.seq)||s.seq<0) throw new Error('Invalid context seq');
  if(!s.world?.worldId) throw new Error('world.worldId required');
  return s;
}

export function resolveFunction(s,prev='STAYING'){
  validateContext(s);
  const social=!!s.social?.dialogueActive || clamp01(s.social?.intensity01)>.55;
  const race=clamp01(s.activity?.race01);
  const action=clamp01(s.activity?.action01);
  const work=clamp01(s.activity?.work01);
  const speed=clamp01(s.movement?.speed01);
  if(social) return 'TALKING';
  if(work>.62) return 'WORK';
  if(race>.64) return 'RACE';
  if(action>.70) return 'ACTION';
  if(speed>.24 || s.movement?.drive) return 'MOVEMENT';
  if(prev==='MOVEMENT' && speed>.12) return 'MOVEMENT';
  return 'STAYING';
}

export function resolveFamily({context,registry,previousFunction='STAYING',previousFamily=null}){
  const fn=resolveFunction(context,previousFunction);
  const profile=registry.profiles?.[context.world?.worldId]||registry.profiles?.GLOBAL_BASE||{};
  const id=profile.functionMappings?.[fn]||null;
  const family=id?registry.families?.[id]:null;
  if(family?.status==='SITE_RUNTIME_VERIFIED') return {function:fn,familyId:id,reason:'PROFILE_MAPPING'};
  return {function:fn,familyId:previousFamily,reason:id?'FAMILY_NOT_RUNTIME_VERIFIED':'NO_MAPPING'};
}
