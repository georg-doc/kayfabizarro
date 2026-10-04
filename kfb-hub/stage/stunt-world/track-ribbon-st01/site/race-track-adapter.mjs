export function validateA0TrackRecipe(recipe){
  const errors=[];
  if(!recipe||recipe.kind!=='track')errors.push('recipe.kind must be track');
  if(!String(recipe?.schemaVersion||'').startsWith('kfb.assembly-a0/'))errors.push('schemaVersion must reference kfb.assembly-a0');
  if(!recipe?.track?.nodes?.length)errors.push('track.nodes required');
  if(!(recipe?.track?.sampleCount>0))errors.push('track.sampleCount required');
  if(!(recipe?.track?.roadWidth>0))errors.push('track.roadWidth required');
  if(!Array.isArray(recipe?.surfaces)||!recipe.surfaces.some(s=>Array.isArray(s.roles)&&s.roles.includes('drivable')))errors.push('at least one drivable Surface required');
  if(!Array.isArray(recipe?.connectors)||!recipe.connectors.some(c=>c.id==='track.entry'))errors.push('track.entry Connector required');
  if(!Array.isArray(recipe?.connectors)||!recipe.connectors.some(c=>c.id==='track.exit'))errors.push('track.exit Connector required');
  if('flowTuning' in (recipe||{}))errors.push('Race runtime tuning must not live in A0 recipe.flowTuning');
  if('flow' in (recipe||{}))errors.push('Race runtime tuning must not live in A0 recipe.flow');
  return {ok:errors.length===0,errors};
}

export function validateRaceRuntimeConfig(runtime){
  const errors=[];
  if(!runtime||!runtime.flow)errors.push('Race runtime flow config required');
  const keys=['accel','brake','reverseAccel','drag','maxForward','maxReverse','steerBase','lateralDamping','centrifugalGain','proxyHalfWidth','softStart','softBase','softGain','bounceBase','bounceLat','bounceSpeed','retention','cooldown'];
  for(const k of keys)if(!Number.isFinite(runtime?.flow?.[k]))errors.push(`flow.${k} must be finite`);
  return {ok:errors.length===0,errors};
}

export function adaptA0TrackRecipeForRace(recipe,runtime){
  const a0=validateA0TrackRecipe(recipe);
  const race=validateRaceRuntimeConfig(runtime);
  if(!a0.ok||!race.ok){
    throw new Error([...a0.errors,...race.errors].join('; '));
  }

  // Thin adapter only. Shared recipe stays read-only; Race-local runtime values are
  // attached to an ephemeral consumer view used by the existing Track Core.
  return Object.freeze({
    ...recipe,
    track:Object.freeze({...recipe.track}),
    surfaces:Object.freeze(recipe.surfaces.map(s=>Object.freeze({...s,roles:Object.freeze([...(s.roles||[])])}))),
    connectors:Object.freeze(recipe.connectors.map(c=>Object.freeze({...c}))),
    slots:Object.freeze((recipe.slots||[]).map(s=>Object.freeze({...s}))),
    flow:Object.freeze({...runtime.flow}),
    raceAdapter:Object.freeze({
      sourceRecipeId:recipe.id,
      sourceRecipeRevision:recipe.revision,
      runtimeRevision:runtime.revision,
      owner:runtime.owner,
      behaviorOwnership:'RACE_LOCAL'
    })
  });
}
