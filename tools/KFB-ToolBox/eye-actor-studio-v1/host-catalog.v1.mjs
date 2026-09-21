export const HOST_SCHEMA='kfb.eye-actor-host-catalog/0.1-candidate';

export const STATIC_HOSTS=[
  {id:'legacy-prototype-pete',label:'Legacy · Prototype Pete · template',group:'Legacy · blank/template',kind:'legacy-template',default:true,path:'media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Models/gltf/PrototypePete.gltf',headNode:'PrototypePete_head',bodyNode:'PrototypePete_body',rigClass:'Rig_Legacy'},
  {id:'mannequin-medium',label:'Modern · Mannequin Medium',group:'Modern · blank/template',kind:'modern',path:'media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Medium.glb',rigClass:'Rig_Medium'},
  {id:'mannequin-large',label:'Modern · Mannequin Large',group:'Modern · blank/template',kind:'modern',path:'media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Large.glb',rigClass:'Rig_Large'},

  {id:'legacy-skeleton-archer',label:'Legacy Skeleton · Archer',group:'Legacy · Skeletons',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_archer.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-skeleton-archer-broken',label:'Legacy Skeleton · Archer broken',group:'Legacy · Skeletons',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_archer_broken.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-skeleton-mage',label:'Legacy Skeleton · Mage',group:'Legacy · Skeletons',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_mage.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-skeleton-mage-broken',label:'Legacy Skeleton · Mage broken',group:'Legacy · Skeletons',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_mage_broken.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-skeleton-minion',label:'Legacy Skeleton · Minion',group:'Legacy · Skeletons',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_minion.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-skeleton-minion-broken',label:'Legacy Skeleton · Minion broken',group:'Legacy · Skeletons',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_minion_broken.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-skeleton-warrior',label:'Legacy Skeleton · Warrior',group:'Legacy · Skeletons',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_warrior.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-skeleton-warrior-broken',label:'Legacy Skeleton · Warrior broken',group:'Legacy · Skeletons',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_warrior_broken.gltf',rigClass:'Rig_Legacy'},

  {id:'legacy-jack',label:'Legacy Spooktober · Jack / pumpkin',group:'Legacy · Spooktober',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Spooktober Seasonal Pack 1.1/Models/Characters/Jack/gltf/character_jack.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-witch',label:'Legacy Spooktober · Witch',group:'Legacy · Spooktober',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/KayKit Spooktober Seasonal Pack 1.1/Models/Characters/Witch/gltf/character_witch.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-orc-a',label:'Legacy Orc Warband · Orc A',group:'Legacy · Orc Warband',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcA.gltf',rigClass:'Rig_Legacy'},
  {id:'legacy-orc-b',label:'Legacy Orc Warband · Orc B',group:'Legacy · Orc Warband',kind:'legacy-static',path:'media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcB.gltf',rigClass:'Rig_Legacy'},

  {id:'prop-pencil-short',label:'Prop · Pencil B short',group:'Props',kind:'prop',path:'media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_B_short.gltf'},
  {id:'prop-pencil-long',label:'Prop · Pencil B long',group:'Props',kind:'prop',path:'media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_B_long.gltf'},
  {id:'prop-eraser',label:'Prop · Rubber / Eraser',group:'Props',kind:'prop',path:'media/3D_Assets/KFB/Eraser by Poly by Google - dexMJlf51a8.glb'}
];

export const OWNER_CATALOGS={
  legacyDungeon:'tools/KFB-ToolBox/legacy-rpg-rigging/data/catalog.v1.json',
  medium:'tools/KFB-ToolBox/eye-rig-batch/data/rig-medium-actors.v0.json',
  large:'tools/KFB-ToolBox/eye-rig-batch/data/rig-large-reviewed.v1.json'
};

async function getJSON(url){const r=await fetch('/'+url);if(!r.ok)throw Error(url+' · '+r.status);return r.json();}

export async function loadHostCatalog(){
  const [legacy,medium,large]=await Promise.all([
    getJSON(OWNER_CATALOGS.legacyDungeon),
    getJSON(OWNER_CATALOGS.medium),
    getJSON(OWNER_CATALOGS.large)
  ]);
  const hosts=[...STATIC_HOSTS];
  for(const a of medium.actors||[]){
    if(a.id==='mannequin-medium')continue;
    hosts.push({id:'medium-'+a.id,label:'Medium · '+a.label,group:'Rig_Medium · owner catalog',kind:'modern',path:a.path,rigClass:'Rig_Medium',revision:a.revision,faceColor:a.faceColor??null,ownerCatalog:OWNER_CATALOGS.medium});
  }
  for(const p of large.profiles||[]){
    hosts.push({id:'large-'+p.actorId,label:'Large · '+p.actorId.replaceAll('-',' '),group:'Rig_Large · reviewed',kind:'modern',path:p.source?.path,rigClass:'Rig_Large',revision:p.source?.revision,eyeProfile:p.eye??null,ownerCatalog:OWNER_CATALOGS.large});
  }
  hosts.push({id:'legacy-dungeon-modular',label:'Legacy Dungeon · modular body + 17 heads',group:'Legacy · Dungeon 1.0',kind:'legacy-modular',rigClass:'Rig_Legacy',ownerCatalog:OWNER_CATALOGS.legacyDungeon});
  return {schema:HOST_SCHEMA,hosts,legacyDungeon:legacy,owners:OWNER_CATALOGS};
}
