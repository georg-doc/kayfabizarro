const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

export function normalizePhaseWeights(input={}){
  const raw={
    day:Math.max(0,Number(input.day??1)),
    evening:Math.max(0,Number(input.evening??0)),
    night:Math.max(0,Number(input.night??0))
  };
  const sum=raw.day+raw.evening+raw.night||1;
  return {day:raw.day/sum,evening:raw.evening/sum,night:raw.night/sum};
}

export function createWorldAppearanceState(input={}){
  const phase=normalizePhaseWeights(input.phase);
  return {
    schema:'kfb.world-appearance-state/1.0',
    phase,
    rainWeight:clamp(Number(input.rainWeight??0)),
    fog:{
      color:input.fog?.color??null,
      near:Number.isFinite(input.fog?.near)?Number(input.fog.near):null,
      far:Number.isFinite(input.fog?.far)?Number(input.fog.far):null
    },
    rimColor:input.rimColor??'#ffeebb',
    atmosphereGlow:input.atmosphereGlow??null,
    cloudOpacity:clamp(Number(input.cloudOpacity??0)),
    lights:input.lights??null,
    source:input.source??'host'
  };
}

/**
 * TinySkies donor-match object response.
 * Important: current TinySkies confirms global lighting/rim/fog changes and
 * local emissive accents; it does NOT confirm rain-driven building wetness.
 */
export function deriveTinySkiesLikeObjectResponse(state,opts={}){
  const night=state.phase.night,evening=state.phase.evening;
  return {
    rimColor:state.rimColor,
    rimIntensityScale:1,
    albedoMultiplier:1,
    wetness:0,
    roughnessDelta:0,
    specularDelta:0,
    emissiveGain:opts.emissiveRole
      ? Number(opts.emissiveGain??1)
      : 0,
    perceivedGlowContext:clamp(.15+evening*.35+night*.5),
    rainWeight:state.rainWeight,
    weatherMaterialMode:'WORLD_ONLY_BASELINE'
  };
}

export function groundingContract(input={}){
  return {
    mode:'terrain-sampled-foundation',
    terrainHeight:Number.isFinite(input.terrainHeight)?Number(input.terrainHeight):null,
    foundationDepth:Number.isFinite(input.foundationDepth)?Math.max(0,Number(input.foundationDepth)):null,
    extraSlopeFoundation:Number.isFinite(input.extraSlopeFoundation)?Math.max(0,Number(input.extraSlopeFoundation)):0,
    requireNoFloating:true
  };
}

export function assertWorldAppearanceState(state){
  if(state?.schema!=='kfb.world-appearance-state/1.0')throw Error('Invalid WorldAppearanceState schema');
  const s=state.phase.day+state.phase.evening+state.phase.night;
  if(Math.abs(s-1)>1e-9)throw Error('Phase weights must sum to 1');
  if(!(state.rainWeight>=0&&state.rainWeight<=1))throw Error('rainWeight out of range');
  return true;
}
