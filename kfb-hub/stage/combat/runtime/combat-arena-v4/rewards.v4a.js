import {activatePowerup} from './powerups.v5a.js';
import { clone as cloneRig } from '../vendor/addons/utils/SkeletonUtils.js';

export const PICKUP = {height:.24, radius:.27, halfHeight:.15, hop:.6, life:45};
export const EFFECTS = {heal:{amount:20,color:0x5fbf3a,glyph:'+',cue:'pickup.heal'},damage:{amount:10,color:0xe84b3c,glyph:'!',cue:'pickup.hurt'},stun:{color:0xe9c14a,glyph:'★',cue:'pickup.stun'},waterbomb:{color:0x45b4ad,glyph:'≈',cue:'pickup.splash'},smokebomb:{color:0xac82dc,glyph:'★',cue:'pickup.smoke'},coin:{color:0xfbd55a,glyph:'',cue:'pickup.coin'}};
export function canCollect(player,pos,radius=PICKUP.radius){
  // Player pos is the sole. An item below the airborne sole can be jumped over.
  return Math.hypot(player.pos.x-pos.x,player.pos.z-pos.z)<radius+(player.radius||.25)*.45
    && pos.y+PICKUP.halfHeight>player.pos.y+.035 && pos.y-PICKUP.halfHeight<player.pos.y+(player.hoehe||1.2)*.7;
}
export function applyPickup(gf,kind,chill,at=gf.pc.pos){
  if(kind==='waterbomb' || kind==='smokebomb')return activatePowerup(gf,kind,at);
  const pc=gf.pc;
  if(kind==='coin'){gf.coins=(gf.coins||0)+1;gf.zaehler.pops++;return {text:'+1 Pop',kind};}
  if(kind==='heal'){const old=gf.hp;gf.hp=Math.min(100,gf.hp+20);return {text:gf.hp===old?'HP voll':`+${Math.round(gf.hp-old)} HP · Heiltrank`,kind};}
  if(kind==='damage'){const old=gf.hp;gf.hp=Math.max(chill?35:gf.roundPhase==='cleared'?1:0,gf.hp-10);pc.treffer?.();return {text:`−${Math.round(old-gf.hp)} HP`,kind};}
  if(kind==='stun'){
    if((pc.stunImmune||0)>0)return {text:'Noch geschützt',kind,immune:true};
    pc.stunRemaining=chill?1:2.5;pc.stunImmune=pc.stunRemaining+1.5;
    gf.cancelShot();gf.input.reset?.();return {text:chill?'Uups! · 1 s':'Uups! · 2,5 s',kind};
  }
}

export class Rewards {
  constructor(gf,{skull,coin,props={},smoke=[],chill=()=>true,reduced=false}={}){
    this.gf=gf;this.T=gf.THREE;this.skull=skull;this.coin=coin;this.props=props;this.smoke=smoke;
    this.chill=chill;this.reduced=reduced;this.deaths=[];this.pulses=[];this.feedback=[];this.icons=new Map();
    this.stats={skulls:0,bounces:0,coinsDropped:0,picked:{heal:0,damage:0,stun:0,coin:0,waterbomb:0,smokebomb:0}};
  }
  static async load(gf,options){
    const loader=gf.loader,tl=new gf.THREE.TextureLoader();
    const [skull,coin,potion,waterbomb,smokebomb,...smoke]=await Promise.all([
      loader.loadAsync(new URL('./assets/4a/Skull.gltf',document.baseURI).href),
      loader.loadAsync(new URL('./assets/4a/Coin.glb',document.baseURI).href),
      ...['healing-potion','water-bomb','smoke-bomb'].map(id=>loader.loadAsync(new URL(`./assets/5a/${id}/model.gltf`,document.baseURI).href)),
      ...Array.from({length:16},(_,i)=>tl.loadAsync(new URL(`./assets/4a/smoke/${String(i+1).padStart(2,'0')}.png`,document.baseURI).href))
    ]);
    smoke.forEach(t=>t.colorSpace=gf.THREE.SRGBColorSpace);
    return new Rewards(gf,{...options,skull:skull.scene,coin:coin.scene,props:{heal:potion.scene,waterbomb:waterbomb.scene,smokebomb:smokebomb.scene},smoke});
  }
  model(template,size){
    const T=this.T,root=new T.Group(),asset=cloneRig(template);root.add(asset);asset.updateMatrixWorld(true);
    const box=new T.Box3().setFromObject(asset),s=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
    const scale=size/Math.max(s.x,s.y,s.z);asset.scale.multiplyScalar(scale);asset.position.addScaledVector(center,-scale);
    asset.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;
      o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();
      for(const m of [].concat(o.material)){m.transparent=true;m.roughness=.65;}}});
    root.userData.restY=s.y*scale*.5+.015;
    return root;
  }
  fade(root,alpha){root.traverse(o=>{if(o.isMesh||o.isSprite)for(const m of [].concat(o.material)){m.opacity=alpha;m.depthWrite=alpha>.8;}});}
  release(root){this.gf.gruppe.remove(root);root.traverse(o=>{if(o.isMesh||o.isSprite)for(const m of [].concat(o.material||[]))m.dispose();});}
  icon(kind){
    const T=this.T;
    if(!this.icons.has(kind)){
      const cv=document.createElement('canvas');cv.width=cv.height=64;const ctx=cv.getContext('2d');
      ctx.fillStyle='#'+EFFECTS[kind].color.toString(16).padStart(6,'0');ctx.font='bold 44px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.strokeStyle='#f3ead3';ctx.lineWidth=4;ctx.strokeText(EFFECTS[kind].glyph,32,34);ctx.fillText(EFFECTS[kind].glyph,32,34);
      const tex=new T.CanvasTexture(cv);tex.colorSpace=T.SRGBColorSpace;this.icons.set(kind,tex);
    }
    const icon=new T.Sprite(new T.SpriteMaterial({map:this.icons.get(kind),depthWrite:false,toneMapped:false}));icon.scale.set(.17,.17,1);return icon;
  }
  beginDeath(m,color){
    const T=this.T,pos=m.pos.clone(),smoke=new T.Sprite(new T.SpriteMaterial({map:this.smoke[0],transparent:true,depthWrite:false,toneMapped:false}));
    smoke.position.copy(pos);smoke.position.y+=m.hoehe*.5;smoke.scale.setScalar(m.hoehe*1.9);smoke.visible=false;this.gf.gruppe.add(smoke);
    this.deaths.push({mob:m,pos,age:0,smoke,color,swapped:false,skull:null,bounce:0,vy:0,fade:0,squash:0});
    this.stats.skulls++;
  }
  pendingDeaths(){return this.deaths.length>0 || this.pulses.length>0;}
  spawn(pos,kind,angle=0,offset=0){
    const gf=this.gf,T=this.T,template=this.props[kind];
    const asset=kind==='coin'?this.model(this.coin,.28):template?this.model(template,.30):gf._wuerfel(EFFECTS[kind].color,.30);
    if(kind==='waterbomb' && template)asset.traverse(o=>{if(o.isMesh)for(const m of [].concat(o.material)){m.color.setHex(m.name==='Black'?0x45b4ad:m.name==='White'?0xf3ead3:0xb8361f);m.metalness=0;}});
    // Geometry and glyph share an unscaled, centered world-space root.
    const grp=new T.Group();grp.add(asset);asset.updateMatrixWorld(true);
    const bounds=new T.Box3().setFromObject(asset),size=bounds.getSize(new T.Vector3());
    asset.scale.multiplyScalar((kind==='coin'?.28:.30)/Math.max(size.x,size.y,size.z));
    asset.updateMatrixWorld(true);asset.position.sub(new T.Box3().setFromObject(asset).getCenter(new T.Vector3()));
    if(kind!=='coin' && !template){
      // Dice templates share materials; each fading pickup owns its material instance.
      grp.traverse(o=>{if(o.isMesh){o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();for(const m of [].concat(o.material))m.transparent=true;}});
    }
    grp.position.copy(pos);grp.position.y+=.45;gf.gruppe.add(grp);
    const target=pos.clone();target.x+=Math.cos(angle)*offset;target.z+=Math.sin(angle)*offset;
    const limit=gf.field.contain(target,.3);target.x+=limit.push.x;target.z+=limit.push.z;
    const p={grp,kind,t:0,leben:PICKUP.life,start:grp.position.clone(),target,phase:gf.rng()*6.28,base:grp.scale.clone()};
    if(kind!=='coin'){p.icon=this.icon(kind);p.icon.position.y=.29;grp.add(p.icon);gf.zaehler.wuerfel++;}
    else this.stats.coinsDropped++;
    gf.pickups.push(p);return p;
  }
  drop(d){
    const kind=d.color===0x5fbf3a?'heal':d.color===0xb8361f?'waterbomb':'smokebomb';
    const angle=this.gf.rng()*Math.PI*2;
    this.spawn(d.pos,kind,angle,.55);
    const n=1+Math.floor(this.gf.rng()*3);
    for(let i=0;i<n;i++)this.spawn(d.pos,'coin',angle+(i+1)*Math.PI*2/(n+1),.65+this.gf.rng()*.55);
  }
  pulse(pos,index){
    const T=this.T,geom=new T.RingGeometry(.94,1,48),mat=new T.MeshBasicMaterial({color:0xf3ead3,transparent:true,opacity:.8,side:T.DoubleSide,depthWrite:false,toneMapped:false});
    const ring=new T.Mesh(geom,mat);ring.rotation.x=-Math.PI/2;ring.position.copy(pos);ring.position.y=this.gf.field.floorY()+.04;this.gf.gruppe.add(ring);
    this.pulses.push({ring,pos:pos.clone(),age:0,duration:.34,radius:[1.45,1.7,1.82][index],next:0});
    this.gf.onSkullBounce?.(pos,index);
    this.gf._cue('abzug',{sfx:'skull.bounce',at:pos});this.stats.bounces++;
  }
  collect(p){
    const result=applyPickup(this.gf,p.kind,this.chill(),p.grp.position);this.stats.picked[p.kind]++;
    this.gf.gesammelt=(this.gf.gesammelt||0)+1;
    this.gf._cue('abzug',{sfx:EFFECTS[p.kind].cue,at:p.grp.position});
    this.gf.onPickup?.(p,result);
    const f={kind:p.kind,t:0,pos:p.grp.position.clone()};
    if(p.kind==='smokebomb' && this.smoke.length){
      f.cloud=new this.T.Sprite(new this.T.SpriteMaterial({map:this.smoke[0],transparent:true,depthWrite:false,toneMapped:false,opacity:.7}));
      f.cloud.position.copy(f.pos);f.cloud.position.y+=.5;f.cloud.scale.setScalar(this.reduced?1:2.4);this.gf.gruppe.add(f.cloud);
    }
    this.feedback.push(f);
    if(this.feedback.length>12){const old=this.feedback.shift();if(old.cloud)this.release(old.cloud);}
  }
  update(dt){
    const gf=this.gf,T=this.T,floor=gf.field.floorY();
    for(let i=this.deaths.length-1;i>=0;i--){
      const d=this.deaths[i];d.age+=dt;
      d.smoke.visible=d.age>.06 && d.age<.8;
      if(d.smoke.visible){d.smoke.material.map=this.smoke[Math.min(15,Math.floor((d.age-.06)/.74*16))];d.smoke.material.opacity=1;}
      if(!d.swapped && d.age>=.20){
        d.swapped=true;d.mob.root.visible=false;gf.mb.entfernen(d.mob);
        const at=(gf.deaths||[]).indexOf(d.mob);if(at>=0)gf.deaths.splice(at,1);
        d.skull=this.model(this.skull,Math.min(.65,d.mob.hoehe*.65));d.skull.position.copy(d.pos);d.skull.position.y+=Math.max(.7,d.mob.hoehe*.75);
        d.skull.rotation.y=d.mob._deathRotation?.y||0;gf.gruppe.add(d.skull);this.drop(d);
      }
      if(d.skull && d.bounce<3){
        // Substeps preserve bounce count and height even when rendering slows down.
        const steps=Math.max(1,Math.ceil(dt/.016));
        for(let k=0;k<steps && d.bounce<3;k++){
          const h=dt/steps;d.vy-=12*h;d.skull.position.y+=d.vy*h;
          if(d.skull.position.y<=floor+d.skull.userData.restY){d.skull.position.y=floor+d.skull.userData.restY;this.pulse(d.pos,d.bounce);d.bounce++;d.vy=[2.6,1.5,0][d.bounce-1];d.squash=.12;}
        }
        d.squash=Math.max(0,d.squash-dt);const q=Math.sin(d.squash/.12*Math.PI)*.2;
        d.skull.scale.set(1+q,1-q,1+q);d.skull.rotation.z=Math.sin(d.age*7)*.12;
      }else if(d.skull){d.fade+=dt;this.fade(d.skull,Math.max(0,1-d.fade/.55));}
      if(d.fade>=.55){this.release(d.skull);this.release(d.smoke);this.deaths.splice(i,1);}
    }
    for(let i=this.pulses.length-1;i>=0;i--){
      const p=this.pulses[i];p.age+=dt;const q=Math.min(1,p.age/p.duration),r=p.radius*(1-(1-q)**2);
      p.ring.scale.setScalar(Math.max(.01,r));p.ring.material.opacity=(1-q)*.65;
      // Seven increasingly wide erasures; irregular overlapping lobes reveal paper rather than paint.
      if(q>=p.next){p.next+=1/6;gf.onReveal?.(p.pos,r);}
      if(q===1){gf.gruppe.remove(p.ring);p.ring.geometry.dispose();p.ring.material.dispose();this.pulses.splice(i,1);}
    }
    for(let i=gf.pickups.length-1;i>=0;i--){
      const p=gf.pickups[i];p.t+=dt;p.leben-=dt;
      const height=floor+PICKUP.height+Math.sin(p.t*2.4+p.phase)*.035;
      if(p.t<PICKUP.hop){const q=p.t/PICKUP.hop;p.grp.position.lerpVectors(p.start,p.target,q);p.grp.position.y=p.start.y*(1-q)+height*q+Math.sin(q*Math.PI)*.6;}
      else {p.grp.position.copy(p.target);p.grp.position.y=height;}
      p.grp.rotation.y+=dt*(p.kind==='coin'?2.2:1.3);
      if(p.t>=PICKUP.hop && canCollect(gf.pc,p.grp.position)){
        this.collect(p);this.release(p.grp);gf.pickups.splice(i,1);continue;
      }
      if(p.leben<2)this.fade(p.grp,Math.max(0,p.leben/2));
      if(p.leben<=0){this.release(p.grp);gf.pickups.splice(i,1);}
    }
    for(let i=this.feedback.length-1;i>=0;i--){
      const f=this.feedback[i];f.t+=dt;
      if(f.cloud){f.cloud.material.map=this.smoke[Math.min(this.smoke.length-1,Math.floor(f.t/.75*this.smoke.length))];f.cloud.material.opacity=(1-Math.min(1,f.t/.75))*.7;}
      if(f.t>=.75){if(f.cloud)this.release(f.cloud);this.feedback.splice(i,1);}
    }
  }
  clear(){
    for(const d of this.deaths){if(d.skull)this.release(d.skull);this.release(d.smoke);if(!d.mob.weg)this.gf.mb.entfernen(d.mob);}
    for(const p of this.pulses){this.gf.gruppe.remove(p.ring);p.ring.geometry.dispose();p.ring.material.dispose();}
    for(const p of this.gf.pickups)this.release(p.grp);
    for(const f of this.feedback)if(f.cloud)this.release(f.cloud);
    this.deaths=[];this.pulses=[];this.feedback=[];this.gf.pickups.length=0;this.gf.deaths=[];
    this.gf.pc.stunRemaining=0;this.gf.pc.stunImmune=0;
  }
}
