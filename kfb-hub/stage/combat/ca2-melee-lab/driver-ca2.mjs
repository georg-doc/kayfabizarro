const D='bdad1806842d733e6217457fe81cd8b6259569e0',A='11d7df978c63b9e375707bd8d9431b4c8358cda8';
const B='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+D+'/tools/KFB-ToolBox/kfb-rigs-embed-v3/';
const AN='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+A+'/media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_';
export const SOURCE={repo:'georg-doc/kayfabizarro',donorCommit:D,assetCommit:A,pet:'graft-driver',animation:'host'};
export const MAP={
 Idle:['General','Idle_A','FOUND_EXACT'],Walk:['MovementBasic','Walking_A','FOUND_EXACT'],Run:['MovementBasic','Running_A','FOUND_EXACT'],
 Jump:['MovementBasic','Jump_Start','FOUND_EXACT'],Jump_Idle:['MovementBasic','Jump_Idle','FOUND_EXACT'],Jump_Land:['MovementBasic','Jump_Land','FOUND_EXACT'],
 Idle_Gun:['CombatRanged','Ranged_1H_Aiming','FOUND_EXACT'],Walk_Gun:['MovementBasic','Walking_A','NEUTRAL_FALLBACK'],Run_Gun:['MovementBasic','Running_A','NEUTRAL_FALLBACK'],
 Idle_Shoot:['CombatRanged','Ranged_1H_Shoot','FOUND_EXACT'],Run_Shoot:['CombatRanged','Ranged_1H_Shoot','NEUTRAL_FALLBACK'],
 HitReact:['General','Hit_A','FOUND_EXACT'],Death:['General','Death_A','FOUND_EXACT']
};
export default class DriverCA2{
 static describe(){return{name:'DriverCA2',capabilities:['three@0.160','assets','clock','rng','pointer'],view:'3d',determinism:'seeded'};}
 async init(c){this.T=c.three;this.loader=c.gltfLoader;this.camera=c.camera;this.log=s=>(c.log||console.info)('[ca2-driver] '+s);this.exact=new Map();this.alias=new Map();}
 mount(p){this.root=new this.T.Group();this.root.name='frizzlebob-ca2-driver';p.add(this.root);this.ready=this.build();return this.root;}
 async build(){
  const G=await import(B+'frizzlegraft-v1/graft-mount.v1.js'),r=await fetch(B+'contracts/kfb-pet-graft-driver.v4.json');
  if(!r.ok)throw Error('Driver contract '+r.status);const lib=await r.json(),pet=G.pickGraftPet(lib,'graft-driver');
  if(!pet)throw Error('MISSING_ASSET: graft-driver');
  this.g=await G.mountGraft({THREE:this.T,loader:this.loader,parent:this.root,pet,lib:lib.lib||{},camera:this.camera,animation:'host',poseOverClip:'auto',log:this.log});
  this.figure=this.g.figure;this.rig=this.g.rig;this.mouth=this.g.mouth;this.weapon=this.g.weapon||null;
  if(!this.figure)throw Error('MISSING_ASSET: graft figure');this.mixer=new this.T.AnimationMixer(this.figure);
  for(const cat of['General','MovementBasic','CombatRanged'])await this.loadCategory(cat);
  for(const[k,v]of Object.entries(MAP)){const x=this.exact.get(v[1]);if(!x)throw Error('MISSING_ASSET: '+k+' -> '+v[1]);this.alias.set(k,{name:k,clip:x.clip,dur:x.dur,source:v[0],donorName:v[1],status:v[2]});}
  this.clips=Object.fromEntries(this.alias);this.play('Idle');return this.report();
 }
 nodes(){const s=new Set();this.figure.traverse(o=>{if(o.name)s.add(o.name);});return s;}
 async loadCategory(cat){
  if(this[cat])return this[cat];const g=await this.loader.loadAsync(AN+cat+'.glb'),n=this.nodes(),a=[];
  for(const c of(g.animations||[])){const k=c.tracks.filter(t=>n.has(this.T.PropertyBinding.parseTrackName(t.name).nodeName));if(!k.length)continue;const q=k.length===c.tracks.length?c:new this.T.AnimationClip(c.name,c.duration,k),e={name:c.name,clip:q,dur:c.duration,source:cat,donorName:c.name};a.push(e);if(!this.exact.has(c.name))this.exact.set(c.name,e);}
  this[cat]=a;return a;
 }
 all(){return[...this.alias.values(),...this.exact.values()];}
 clipNames(){return this.all().map(x=>x.name);}
 findClip(re){return this.all().find(x=>{re.lastIndex=0;return re.test(x.name);})||null;}
 play(name,o={}){const e=this.alias.get(name)||this.exact.get(name);if(!e)return null;const a=this.mixer.clipAction(e.clip),once=o.loop===false,f=o.fade==null?.15:o.fade;a.setLoop(once?this.T.LoopOnce:this.T.LoopRepeat,once?1:Infinity);a.clampWhenFinished=once;a.timeScale=o.timeScale||1;if(this.action&&this.action!==a)this.action.fadeOut(f);a.reset().fadeIn(f).play();this.action=a;this.current=e;return a;}
 async setVariant(){return'driver-graft';}
 pulseGun(){return !!this.weapon?.muzzle;}
 shotExpression(){if(!this.rig?.applyEmote)return false;this.rig.applyEmote({lidUpper:.18,lidLower:.04,slant:-.20,gaze:'front',rest:'angry'});return true;}
 update(dt,c){if(this.mixer)this.mixer.update(dt);if(this.g&&this.g.update)this.g.update(dt,c||this.camera);}
 report(){return{source:SOURCE,mixerOwner:'DriverCA2',groundOwner:'Player.v2',faceOwner:'graft-mount.v1',clipCount:this.exact.size,states:Object.fromEntries([...this.alias].map(([k,v])=>[k,{clip:v.donorName,set:v.source,status:v.status}])),mount:this.g&&this.g.report||null};}
 dispose(){if(this.mixer)this.mixer.stopAllAction();if(this.g&&this.g.dispose)this.g.dispose();if(this.root&&this.root.parent)this.root.parent.remove(this.root);}
}
