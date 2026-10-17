export const RECIPE_SCHEMA='kfb.legacy-actor-recipe/0.1-candidate';
export const RANDOMIZER_SCHEMA='kfb.legacy-actor-randomizer/0.1-candidate';

const ALLOWED_TOP=new Set(['schema','rigFamily','bodyId','headId','headExtras','held','source']);
const GAMEPLAY_KEYS=new Set([
  'hp','health','damage','dmg','armor','speed','moveSpeed','runSpeed','ai','brain',
  'team','faction','score','lives','spawn','spawnWeight','aggression','target','ghostMode'
]);

function assertCatalog(catalog){
  if(!catalog||!Array.isArray(catalog.characters)||!Array.isArray(catalog.heads)||!Array.isArray(catalog.weapons)||!Array.isArray(catalog.accessories)) {
    throw new Error('Legacy catalog missing required collections');
  }
  if(!catalog.source?.partsRevision||!catalog.source?.rigRevision) throw new Error('Legacy catalog missing source revisions');
  return catalog;
}
function ids(list){return new Set(list.map(x=>x.id));}
function pathProps(catalog){return catalog.accessories.filter(x=>x.path);}
function unit(rng){
  if(typeof rng!=='function') throw new Error('caller-owned rng function required');
  const v=Number(rng());
  if(!Number.isFinite(v)||v<0||v>=1) throw new Error('rng must return finite values in [0,1)');
  return v;
}
function pick(list,rng){
  if(!list.length) throw new Error('cannot pick from empty candidate list');
  return list[Math.min(list.length-1,Math.floor(unit(rng)*list.length))];
}
function selectIds(list,wanted,label){
  if(wanted==null)return list.slice();
  if(!Array.isArray(wanted)||!wanted.length)throw new Error(label+' filter must be a non-empty array');
  const by=new Map(list.map(x=>[x.id,x]));
  const missing=wanted.filter(id=>!by.has(id));
  if(missing.length)throw new Error(label+' filter contains unknown id(s): '+missing.join(', '));
  return wanted.map(id=>by.get(id));
}
function scanGameplayFields(v,path='recipe'){
  const hits=[];
  if(!v||typeof v!=='object')return hits;
  for(const [k,val] of Object.entries(v)){
    if(GAMEPLAY_KEYS.has(k))hits.push(path+'.'+k);
    if(val&&typeof val==='object')hits.push(...scanGameplayFields(val,path+'.'+k));
  }
  return hits;
}
function sourceFromCatalog(catalog){
  return {
    catalogSchema:catalog.schema,
    partsRevision:catalog.source.partsRevision,
    rigRevision:catalog.source.rigRevision
  };
}

export function validateLegacyActorRecipe(catalog,recipe){
  assertCatalog(catalog);
  const errors=[];
  if(!recipe||typeof recipe!=='object')return {ok:false,errors:['recipe must be an object']};
  for(const k of Object.keys(recipe))if(!ALLOWED_TOP.has(k))errors.push('unknown top-level field: '+k);
  const gameplay=scanGameplayFields(recipe);
  if(gameplay.length)errors.push('gameplay fields forbidden: '+gameplay.join(', '));
  if(recipe.schema!==RECIPE_SCHEMA)errors.push('schema must be '+RECIPE_SCHEMA);
  if(recipe.rigFamily!=='Rig_Legacy')errors.push('rigFamily must be Rig_Legacy');
  if(!ids(catalog.characters).has(recipe.bodyId))errors.push('unknown bodyId: '+String(recipe.bodyId));
  if(!ids(catalog.heads).has(recipe.headId))errors.push('unknown headId: '+String(recipe.headId));
  if(typeof recipe.headExtras!=='boolean')errors.push('headExtras must be boolean');
  if(!recipe.held||typeof recipe.held!=='object'||Array.isArray(recipe.held))errors.push('held must be an object');
  const heldIds=ids([...catalog.weapons,...pathProps(catalog)]);
  for(const side of ['right','left']){
    const v=recipe.held?.[side]??null;
    if(v!==null&&!heldIds.has(v))errors.push('unknown held.'+side+': '+String(v));
  }
  const expected=sourceFromCatalog(catalog);
  for(const k of Object.keys(expected)){
    if(recipe.source?.[k]!==expected[k])errors.push('source.'+k+' mismatch');
  }
  return {ok:errors.length===0,errors};
}

export function createLegacyActorRecipe(catalog,input={}){
  assertCatalog(catalog);
  const recipe={
    schema:RECIPE_SCHEMA,
    rigFamily:'Rig_Legacy',
    bodyId:input.bodyId,
    headId:input.headId,
    headExtras:input.headExtras!==false,
    held:{
      right:input.held?.right??null,
      left:input.held?.left??null
    },
    source:sourceFromCatalog(catalog)
  };
  const report=validateLegacyActorRecipe(catalog,recipe);
  if(!report.ok)throw new Error('invalid LegacyActorRecipe: '+report.errors.join('; '));
  return recipe;
}

export function createSeededRng(seed){
  let h=2166136261>>>0;
  const s=String(seed??'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
  if(h===0)h=0x6d2b79f5;
  return function seeded(){
    h=(h+0x6D2B79F5)>>>0;
    let t=h;
    t=Math.imul(t^(t>>>15),t|1);
    t^=t+Math.imul(t^(t>>>7),t|61);
    return ((t^(t>>>14))>>>0)/4294967296;
  };
}

export function randomLegacyActorRecipe(catalog,options={}){
  assertCatalog(catalog);
  const rng=options.rng;
  if(typeof rng!=='function')throw new Error('randomLegacyActorRecipe requires caller-owned rng');

  const bodies=selectIds(catalog.characters,options.bodies,'bodies');
  const heads=selectIds(catalog.heads,options.heads,'heads');

  let weapons=catalog.weapons.slice();
  if(options.weaponFamilies!=null){
    if(!Array.isArray(options.weaponFamilies)||!options.weaponFamilies.length)throw new Error('weaponFamilies must be a non-empty array');
    const known=new Set(catalog.weapons.map(x=>x.family));
    const missing=options.weaponFamilies.filter(x=>!known.has(x));
    if(missing.length)throw new Error('unknown weapon family/families: '+missing.join(', '));
    weapons=weapons.filter(x=>options.weaponFamilies.includes(x.family));
  }
  if(options.weaponTiers!=null){
    if(!Array.isArray(options.weaponTiers)||!options.weaponTiers.length)throw new Error('weaponTiers must be a non-empty array');
    const known=new Set(catalog.weapons.map(x=>x.tier));
    const missing=options.weaponTiers.filter(x=>!known.has(x));
    if(missing.length)throw new Error('unknown weapon tier(s): '+missing.join(', '));
    weapons=weapons.filter(x=>options.weaponTiers.includes(x.tier));
  }

  let heldPool=weapons;
  if(options.includeProps===true && options.weaponFamilies==null && options.weaponTiers==null) {
    heldPool=heldPool.concat(pathProps(catalog));
  }
  const heldChance=options.heldChance==null?.65:Number(options.heldChance);
  if(!Number.isFinite(heldChance)||heldChance<0||heldChance>1)throw new Error('heldChance must be in [0,1]');
  if(heldChance>0&&!heldPool.length)throw new Error('held candidate filter produced no source items');

  const body=pick(bodies,rng);
  const head=pick(heads,rng);
  const chooseHeld=()=>heldPool.length&&unit(rng)<heldChance?pick(heldPool,rng).id:null;
  const right=chooseHeld();
  let left=chooseHeld();
  if(left&&right&&left===right&&options.allowDuplicateHeld!==true){
    const alternatives=heldPool.filter(x=>x.id!==right);
    left=alternatives.length?pick(alternatives,rng).id:null;
  }

  let headExtras;
  if(typeof options.headExtras==='boolean')headExtras=options.headExtras;
  else headExtras=unit(rng)<.75;

  return createLegacyActorRecipe(catalog,{
    bodyId:body.id,
    headId:head.id,
    headExtras,
    held:{right,left}
  });
}

export function recipeKey(recipe){
  if(!recipe||recipe.schema!==RECIPE_SCHEMA)throw new Error('recipeKey requires a LegacyActorRecipe');
  return [
    recipe.rigFamily,
    recipe.bodyId,
    recipe.headId,
    recipe.headExtras?'extras':'clean',
    'R:'+(recipe.held?.right||'-'),
    'L:'+(recipe.held?.left||'-'),
    recipe.source?.partsRevision||'-',
    recipe.source?.rigRevision||'-'
  ].join('|');
}

export default {
  RECIPE_SCHEMA,RANDOMIZER_SCHEMA,
  validateLegacyActorRecipe,createLegacyActorRecipe,
  createSeededRng,randomLegacyActorRecipe,recipeKey
};
