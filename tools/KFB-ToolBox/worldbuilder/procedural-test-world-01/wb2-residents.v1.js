/* Resident Atlas → WB2 scene-object seam. No viewer, renderer, input, support or save owner. */
import * as THREE from 'three';
import {buildVignette,BATCH,PIN} from '../../_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/lib/atlas.js';
import {lowestPosedY} from '../../_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/lib/rigwork.js';
import {RESIDENTS} from '../../_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/cast.js';

const SOURCE_PIN='b6afb431c25e48767bf875c8b2eb74866f6946e5';
const S6_PIN='be4843354c5cf420ddecbb25ed5a51aa5f21ca18';
const raw=(pin,path)=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+pin+'/'+path.split('/').map(encodeURIComponent).join('/');
const S16_PATH='tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/cast.js';
export const RESIDENT_SOURCE=id=>id==='town.clown'?{commit:S6_PIN,path:'tools/resident_atlas/modules/clown-juggling-island.module.json'}:['town.driver','utopia.robots'].includes(id)?{commit:'8614726082b820fed1795c105b2581265985c9fd',path:'tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/wb2-residents.v1.js'}:{commit:SOURCE_PIN,path:S16_PATH};
const EXTRA={
  driver:{residentId:'driver',name:'Driver',actor:{id:'driver',role:'resident',a:'media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb',rig:'Rig_Medium',pose:/^Idle_A$/,poseFreeze:false},habitat:[],signatureProps:[]},
  robots:{residentId:'robots',name:'Robots',actor:{id:'robot_one',role:'resident',a:'media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb',rig:'Rig_Medium',pose:/^Idle_A$/,poseFreeze:false},habitat:[],signatureProps:[{id:'robot_two',role:'resident',a:'media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb',rig:'Rig_Medium',pose:/^Idle_B$/,poseFreeze:false,p:[2.7,0]}]}
};
export const RESIDENT_SETS=Object.freeze([
  {id:'town.clown',residentId:'clown',anchor:'town.resident.clown.onboarding',title:'Clown · Jonglage'},
  {id:'town.driver',residentId:'driver',anchor:'town.resident.driver.taxi',title:'Driver · Taxi'},
  {id:'dystopia.demon',residentId:'demon-lord',anchor:'dystopia.party.pentagram',title:'Demon Lord'},
  {id:'utopia.robots',residentId:'robots',anchor:'utopia.robot.works',title:'Robot Works'},
  {id:'utopia.monstrosity',residentId:'monstrosity',anchor:'utopia.monstrosity.throne',title:'Monstrosity'},
  {id:'protopia.farmers',residentId:'farmers',anchor:'protopia.farm.social-core',title:'Farmers · Duo'},
  {id:'protopia.lorekeeper',residentId:'lorekeeper',anchor:'protopia.lorekeeper.plateau',title:'Lorekeeper'}
]);

function pinnedRecipe(recipe,original){
  const item=it=>{const copy={...it};if(copy.commit==='main')copy.commit=SOURCE_PIN;
    // Every cleaned-eye branch ref must be frozen before intake. Originals keep native eyes.
    if(copy.eyes&&!/^[a-f0-9]{40}$/.test(copy.eyes.commit))delete copy.eyes;
    if(original)delete copy.eyes;return copy;};
  return{...recipe,actor:item(recipe.actor),habitat:(recipe.habitat||[]).map(item),signatureProps:(recipe.signatureProps||[]).filter(it=>!it.optional).map(item)};
}
export async function createResidentSet(id,{original=false,onProgress}={}){
  const def=RESIDENT_SETS.find(d=>d.id===id);if(!def)throw Error('Unknown resident set '+id);
  let built,module=null,recipeUsed=null;
  if(def.residentId==='clown'){
    // Exact S6 donor: three-club activity, not the static S16 promo recipe.
    const api=await import('../../../resident_atlas/modules/runtime/s6-resident-module.js'); // b1119333 @ S6_PIN: exact receiving blob verified; no cold-CDN module wait.
    const recipe=await fetch(raw(S6_PIN,'tools/resident_atlas/modules/clown-juggling-island.module.json')).then(r=>{if(!r.ok)throw Error('Clown source '+r.status);return r.json()});
    const parent=new THREE.Group();module=await api.mountResidentSceneModule(recipe,{parent,onProgress});built=module.built;
    if(!module.activity||!['pin_blue','pin_green','pin_red'].every(k=>built.nodes.has(k)))throw Error('Required native Clown activity incomplete: '+built.open.join('; '));
  }else{
    const recipe=RESIDENTS.find(r=>r.residentId===def.residentId)||EXTRA[def.residentId];
    if(!recipe)throw Error('Missing actual Resident Atlas recipe '+id);
    recipeUsed=pinnedRecipe(recipe,original);
    BATCH.accept=new Set(original?[]:['APPROVED','ADJUSTED_APPROVED']);
    built=await buildVignette(recipeUsed,onProgress);
    const required=[recipe.actor,...(recipe.signatureProps||[]).filter(it=>!it.optional)];
    const absent=required.filter(it=>!built.nodes.has(it.id));
    if(absent.length)throw Error('Required resident source missing: '+absent.map(it=>it.id).join(', ')+' · '+built.open.join('; '));
  }
  const root=built.root;root.name=def.title;
  root.userData.residentSetId=def.id;
  root.userData.sourceRecord={assetId:'resident-set/'+def.id,packId:module?'Resident Atlas S6':'Resident Atlas S16',source:RESIDENT_SOURCE(id),assetPin:PIN.assets};
  for(const node of built.nodes.values()){const entry=node.userData.entry;if(entry?.a)node.userData.sourceRecord={assetId:entry.a,packId:def.residentId,source:{commit:entry.commit||PIN.assets,path:entry.a,blobSha:null}}}
  const groundActors=(groundAt)=>{if(!groundAt||module||!recipeUsed)return;for(const it of [recipeUsed.actor,...recipeUsed.signatureProps].filter(it=>it.rig&&!it.hover)){const node=built.nodes.get(it.id);if(!node)continue;const pos=node.getWorldPosition(new THREE.Vector3()),min=lowestPosedY(node,3),y=groundAt(pos.x,pos.z),scale=node.parent.getWorldScale(new THREE.Vector3()).y;if(Number.isFinite(min)&&Number.isFinite(y)&&Math.abs(scale)>.001){node.position.y+=(y-min)/scale;node.updateWorldMatrix(true,true)}}};
  const mixers=new Set([built.mixer,...(built.extraMixers||[])].filter(Boolean).map(m=>m.mixer));
  let disposed=false;
  return{def,root,built,activity:module?.activity,update(dt,groundAt){if(disposed)return;if(module)module.update(dt);else{for(const info of [built.mixer,...(built.extraMixers||[])].filter(Boolean)){if(!info.action?.paused)info.mixer.update(dt)}for(const eye of built.eyeRigs||[])eye.tick?.(dt);for(const ticker of built.tickers||[])ticker(dt);groundActors(groundAt)}},
    evidence(){return{id,recipe:def.residentId,nodeIds:[...built.nodes.keys()],notes:built.notes,open:built.open,mixers:mixers.size,activity:module?.activity?{kind:'juggle-cascade-v1',enabled:module.activity.enabled,stats:module.activity.stats}:null,eyeRigs:(built.eyeRigs||[]).map(e=>({status:e.status,actorId:e.actorId}))}},
    dispose(){if(disposed)return;disposed=true;if(module)module.dispose();else{for(const m of mixers)m.stopAllAction();root.removeFromParent()}}
  };
}
