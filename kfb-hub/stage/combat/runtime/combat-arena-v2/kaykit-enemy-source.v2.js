const MODEL_COMMIT='378b209355b13304e3cff656ec0806ca5b89df28';
const ANIM_COMMIT='11d7df978c63b9e375707bd8d9431b4c8358cda8';
const MODEL='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+MODEL_COMMIT+'/media/3D_Assets/';
const ANIM='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+ANIM_COMMIT+'/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_';

export const ENEMIES=Object.freeze([
  Object.freeze({
    id:'ca2_skeleton_warrior',name:'Skeleton Warrior',ready:true,air:false,rig:'Rig_Medium',forwardZ:1,
    file:'media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb',
    path:'KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb',
    modelBlob:'575da270ed4e7e6a40eae60f056640542c2fa645',
    sets:['General','MovementBasic','CombatMelee'],
    roles:Object.freeze({idle:'Idle_A',walk:'Walking_A',attack:'Melee_Unarmed_Attack_Punch_A',hit:'Hit_A',death:'Death_A'})
  }),
  Object.freeze({
    id:'ca2_skeleton_mage',name:'Skeleton Mage',ready:false,hold:'C_MVP_MAGE_ADAPTER',air:false,rig:'Rig_Medium',forwardZ:1,
    file:'media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Mage.glb',
    path:'KayKit_Skeletons/characters/gltf/Skeleton_Mage.glb',
    modelBlob:'7fcc7e425741699d01bf9c2d4d64b795acee1355',
    sets:['General','MovementBasic','CombatRanged'],
    roles:Object.freeze({idle:'Idle_A',walk:'Walking_A',attack:'Ranged_Magic_Shoot',hit:'Hit_A',death:'Death_A'})
  })
]);

export const SOURCE=Object.freeze({
  repo:'georg-doc/kayfabizarro',modelCommit:MODEL_COMMIT,animationCommit:ANIM_COMMIT,
  models:ENEMIES.map(e=>({id:e.id,path:e.file,blob:e.modelBlob}))
});

export default class KayKitEnemySourceCA2{
  attach(ctx){this.THREE=ctx.THREE;this.loader=ctx.loader;this.log=ctx.log||(()=>{});this.cache=new Map();return this;}
  roster(){return ENEMIES.slice();}
  roleClip(e,role){return e&&e.roles?e.roles[role]||null:null;}
  async _anims(cat){
    if(this.cache.has(cat))return this.cache.get(cat);
    const g=await this.loader.loadAsync(ANIM+cat+'.glb'),a=g.animations||[];
    this.cache.set(cat,a);return a;
  }
  async load(e){
    if(!this.loader||!this.THREE)throw new Error('KayKitEnemySourceCA2 not attached');
    if(!e||!ENEMIES.find(x=>x.id===e.id))throw new Error('MISSING_ASSET: unverified CA2 enemy');
    const g=await this.loader.loadAsync(MODEL+e.path),names=new Set(),clips=[...(g.animations||[])];
    g.scene.traverse(o=>{if(o.name)names.add(o.name);});
    for(const cat of e.sets)for(const c of await this._anims(cat)){
      const keep=c.tracks.filter(tr=>names.has(this.THREE.PropertyBinding.parseTrackName(tr.name).nodeName));
      if(keep.length)clips.push(keep.length===c.tracks.length?c:new this.THREE.AnimationClip(c.name,c.duration,keep));
    }
    const got=new Set(clips.map(c=>c.name));
    const missing=Object.entries(e.roles).filter(([,clip])=>!got.has(clip));
    if(missing.length)throw new Error('MISSING_ASSET: '+e.id+' missing '+missing.map(([r,c])=>r+'->'+c).join(', '));
    g.animations=clips;
    g.userData=Object.assign({},g.userData,{ca2:{enemy:e.id,modelCommit:MODEL_COMMIT,animationCommit:ANIM_COMMIT,roles:e.roles}});
    this.log(e.name+' · exact model + '+clips.length+' bound clips');
    return g;
  }
}
