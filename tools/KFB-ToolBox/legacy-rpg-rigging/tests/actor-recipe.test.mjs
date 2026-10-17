import fs from 'node:fs';
import assert from 'node:assert/strict';
import {
  RECIPE_SCHEMA,
  createLegacyActorRecipe,
  createSeededRng,
  randomLegacyActorRecipe,
  recipeKey,
  validateLegacyActorRecipe
} from '../lib/legacy-actor-recipe.v1.js';

const catalog=JSON.parse(fs.readFileSync(new URL('../data/catalog.v1.json',import.meta.url),'utf8'));
let pass=0;
const check=(name,fn)=>{try{fn();pass++;console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1;}};
const throws=(fn,re)=>assert.throws(fn,re);

check('manual recipe validates',()=>{
  const r=createLegacyActorRecipe(catalog,{bodyId:'barbarian',headId:'rogue-c',headExtras:true,held:{right:'axe-rare',left:'shield-common'}});
  assert.equal(r.schema,RECIPE_SCHEMA);
  assert.deepEqual(validateLegacyActorRecipe(catalog,r),{ok:true,errors:[]});
});
check('recipe pins exact source revisions',()=>{
  const r=createLegacyActorRecipe(catalog,{bodyId:'knight',headId:'skull'});
  assert.equal(r.source.partsRevision,catalog.source.partsRevision);
  assert.equal(r.source.rigRevision,catalog.source.rigRevision);
});
check('same seed yields same recipe key',()=>{
  const a=randomLegacyActorRecipe(catalog,{rng:createSeededRng('arena-42')});
  const b=randomLegacyActorRecipe(catalog,{rng:createSeededRng('arena-42')});
  assert.equal(recipeKey(a),recipeKey(b));
  assert.deepEqual(a,b);
});
check('seed set produces multiple recipes',()=>{
  const keys=new Set(Array.from({length:12},(_,i)=>recipeKey(randomLegacyActorRecipe(catalog,{rng:createSeededRng('seed-'+i)}))));
  assert.ok(keys.size>=6,'only '+keys.size+' unique recipes');
});
check('body/head filters are strict and deterministic',()=>{
  const r=randomLegacyActorRecipe(catalog,{rng:createSeededRng('filtered'),bodies:['mage'],heads:['skull'],heldChance:0,headExtras:false});
  assert.equal(r.bodyId,'mage');assert.equal(r.headId,'skull');assert.equal(r.headExtras,false);
  assert.equal(r.held.right,null);assert.equal(r.held.left,null);
});
check('weapon family/tier filter never escapes source pool',()=>{
  const r=randomLegacyActorRecipe(catalog,{rng:createSeededRng('staff'),weaponFamilies:['staff'],weaponTiers:['rare'],heldChance:1});
  for(const id of [r.held.right,r.held.left].filter(Boolean))assert.equal(id,'staff-rare');
  assert.notEqual(r.held.right&&r.held.left?r.held.right===r.held.left:false,true);
});
check('includeProps can select source props',()=>{
  const rng=()=>0.999999;
  const r=randomLegacyActorRecipe(catalog,{rng,includeProps:true,heldChance:1,allowDuplicateHeld:false});
  const propIds=new Set(catalog.accessories.filter(x=>x.path).map(x=>x.id));
  assert.ok(propIds.has(r.held.right)||propIds.has(r.held.left));
});
check('default disallows duplicate held item',()=>{
  for(let i=0;i<50;i++){
    const r=randomLegacyActorRecipe(catalog,{rng:createSeededRng('dup-'+i),heldChance:1});
    assert.ok(!r.held.right||!r.held.left||r.held.right!==r.held.left);
  }
});
check('unknown body filter fails closed',()=>throws(()=>randomLegacyActorRecipe(catalog,{rng:createSeededRng('x'),bodies:['nope']}),/unknown id/));
check('unknown weapon family fails closed',()=>throws(()=>randomLegacyActorRecipe(catalog,{rng:createSeededRng('x'),weaponFamilies:['laser']}),/unknown weapon family/));
check('missing caller rng fails',()=>throws(()=>randomLegacyActorRecipe(catalog,{}),/caller-owned rng/));
check('invalid rng range fails',()=>throws(()=>randomLegacyActorRecipe(catalog,{rng:()=>1.2}),/\[0,1\)/));
check('gameplay fields are rejected',()=>{
  const r=createLegacyActorRecipe(catalog,{bodyId:'rogue',headId:'rogue-default'});
  r.hp=99;
  const v=validateLegacyActorRecipe(catalog,r);
  assert.equal(v.ok,false);assert.ok(v.errors.some(x=>/gameplay fields forbidden/.test(x)));
});
check('unknown top-level fields are rejected',()=>{
  const r=createLegacyActorRecipe(catalog,{bodyId:'rogue',headId:'rogue-default'});
  r.role='ghost';
  const v=validateLegacyActorRecipe(catalog,r);
  assert.equal(v.ok,false);assert.ok(v.errors.some(x=>/unknown top-level field: role/.test(x)));
});
check('source revision tampering is rejected',()=>{
  const r=createLegacyActorRecipe(catalog,{bodyId:'knight',headId:'knight-default'});
  r.source.partsRevision='main';
  const v=validateLegacyActorRecipe(catalog,r);
  assert.equal(v.ok,false);assert.ok(v.errors.some(x=>/partsRevision mismatch/.test(x)));
});
check('recipe key contains only appearance/source identity',()=>{
  const r=createLegacyActorRecipe(catalog,{bodyId:'mage',headId:'barbarian-b',headExtras:false,held:{right:'staff-common',left:null}});
  const k=recipeKey(r);
  assert.match(k,/Rig_Legacy\|mage\|barbarian-b\|clean\|R:staff-common\|L:-/);
  assert.ok(!/hp|damage|ai|team|ghost/i.test(k));
});

console.log(`LEGACY_ACTOR_RECIPE_RESULT ${pass}/16 PASS`);
if(process.exitCode)process.exit(process.exitCode);
