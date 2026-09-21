import {clayLidGeometry} from './clay-lid.v1.mjs';
import {POSES,valueFor} from './poses.v1.mjs';

export const CLUSTER_SCHEMA='kfb.eye-cluster/0.1-candidate';
const DEG=Math.PI/180;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export const PRESETS=Object.freeze({
  'pair-frontal':[
    {id:'eye-0',role:'primary',position:[-.34,.08,.74],eulerDeg:[0,0,0],size:1,shape:[1,1,1]},
    {id:'eye-1',role:'primary',position:[ .34,.08,.74],eulerDeg:[0,0,0],size:1,shape:[1,1,1]},
  ],
  'pair-asymmetric':[
    {id:'eye-0',role:'primary',position:[-.35,.10,.72],eulerDeg:[0,-7,-8],size:.86,shape:[.92,1.12,.90]},
    {id:'eye-1',role:'primary',position:[ .37,.05,.72],eulerDeg:[4,9,9],size:1.26,shape:[1.05,.94,.96]},
  ],
  'pair-frog-side':[
    {id:'eye-0',role:'primary',position:[-.78,.12,.24],eulerDeg:[0,-76,-4],size:1.08,shape:[1,1.02,.95]},
    {id:'eye-1',role:'primary',position:[ .78,.12,.24],eulerDeg:[0, 76, 4],size:1.08,shape:[1,1.02,.95]},
  ],
  'single-eye':[
    {id:'eye-0',role:'primary',position:[0,.08,.79],eulerDeg:[0,0,0],size:1.36,shape:[1.12,1,.92]},
  ],
  'three-eye':[
    {id:'eye-0',role:'primary',position:[-.34,-.02,.75],eulerDeg:[0,-4,-5],size:.96,shape:[1,1,1]},
    {id:'eye-1',role:'primary',position:[ .34,-.02,.75],eulerDeg:[0, 4, 5],size:1.10,shape:[1,1,1]},
    {id:'eye-2',role:'secondary',position:[0,.48,.60],eulerDeg:[-10,0,0],size:.62,shape:[.95,1.12,.90]},
  ],
  'four-eye':[
    {id:'eye-0',role:'primary',position:[-.36,.18,.72],eulerDeg:[0,-5,-5],size:.96,shape:[1,1,1]},
    {id:'eye-1',role:'primary',position:[ .36,.18,.72],eulerDeg:[0, 5, 5],size:1.06,shape:[1,1,1]},
    {id:'eye-2',role:'secondary',position:[-.34,-.30,.68],eulerDeg:[8,-7,-2],size:.61,shape:[1.05,.92,.90]},
    {id:'eye-3',role:'secondary',position:[ .34,-.30,.68],eulerDeg:[8, 7, 2],size:.70,shape:[.95,1.04,.92]},
  ]
});

function cloneSlot(s,i){
  return {
    id:s.id??'eye-'+i,role:s.role??(i<2?'primary':'secondary'),enabled:s.enabled!==false,
    position:[...(s.position??[0,0,.72])],
    eulerDeg:[...(s.eulerDeg??[0,0,0])],
    size:Number.isFinite(s.size)?s.size:1,
    shape:[...(s.shape??[1,1,1])],
    lidMode:s.lidMode??'clay',
    lidThickness:s.lidThickness??.13,
    lidCurve:s.lidCurve??0,
    lidUpper:s.lidUpper??0,
    lidLower:s.lidLower??0,
    slant:s.slant??0,
    gaze:[...(s.gaze??[0,0])],
    materialOverride:s.materialOverride??null
  };
}

export class EyeCluster{
  constructor(THREE,parent,{radius=.29,faceColor='#d69a78'}={}){
    this.THREE=THREE;this.parent=parent;this.radius=radius;this.faceColor=faceColor;
    this.root=new THREE.Group();this.root.name='KFB Eye Cluster';parent.add(this.root);
    this.slots=[];this.actors=[];this.selected=0;this.scope='all';this.debug='natural';this.emanata='none';
    this.setPreset('pair-frontal');
  }

  dispose(){
    for(const a of this.actors)this._disposeActor(a);
    this.actors=[];this.root.removeFromParent();
  }

  _disposeActor(a){
    a.group.removeFromParent();
    a.group.traverse(o=>{
      if(!o.isMesh)return;
      o.geometry?.dispose?.();
      if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());
      else o.material?.dispose?.();
    });
  }

  setPreset(name){
    const p=PRESETS[name]||PRESETS['pair-frontal'];
    this.slots=p.map(cloneSlot);this.selected=Math.min(this.selected,this.slots.length-1);
    this.rebuild();return this.report();
  }

  setCount(n){
    n=clamp(Math.round(n),1,4);
    while(this.slots.length<n){
      const i=this.slots.length,base=this.slots[Math.max(0,i-1)]||PRESETS['pair-frontal'][0];
      const s=cloneSlot(base,i);s.id='eye-'+i;s.role=i<2?'primary':'secondary';
      s.position=[(i%2?1:-1)*(.34+(i>1?.03:0)),i>1?-.30:.10,.70-(i>1?.04:0)];
      s.size=i>1?.68:1;this.slots.push(s);
    }
    while(this.slots.length>n)this.slots.pop();
    this.selected=Math.min(this.selected,n-1);this.rebuild();return this.report();
  }

  slot(i=this.selected){return this.slots[i]||null;}

  updateSlot(i,patch){
    const s=this.slots[i];if(!s)return null;
    if(patch.position)s.position=[...patch.position];
    if(patch.eulerDeg)s.eulerDeg=[...patch.eulerDeg];
    if(patch.shape)s.shape=[...patch.shape];
    for(const k of ['enabled','size','lidMode','lidThickness','lidCurve','lidUpper','lidLower','slant','materialOverride'])if(k in patch)s[k]=patch[k];
    if(patch.gaze)s.gaze=[...patch.gaze];
    this.rebuild();return this.report();
  }

  addEye(){return this.setCount(this.slots.length+1);}
  removeEye(){return this.setCount(this.slots.length-1);}

  selectedIndices(scope=this.scope){
    if(scope==='selected')return [this.selected];
    if(scope==='primary')return this.slots.map((s,i)=>s.role==='primary'?i:-1).filter(i=>i>=0);
    return this.slots.map((_,i)=>i);
  }

  applyPose(name,scope=this.scope){
    const p=POSES[name]||POSES.neutral;
    const ids=this.selectedIndices(scope);
    ids.forEach((i,k)=>{
      const s=this.slots[i];
      s.lidUpper=valueFor(p.upper,k);
      s.lidLower=valueFor(p.lower,k);
      s.slant=valueFor(p.slant,k);
      s.gaze=[...p.gaze];
    });
    this.rebuild();return p;
  }

  blink(scope=this.scope){
    const ids=this.selectedIndices(scope);
    const restore=ids.map(i=>[i,this.slots[i].lidUpper,this.slots[i].lidLower]);
    ids.forEach(i=>{this.slots[i].lidUpper=.96;this.slots[i].lidLower=.96;});
    this.rebuild();
    setTimeout(()=>{
      for(const [i,u,l] of restore){
        if(this.slots[i]){this.slots[i].lidUpper=u;this.slots[i].lidLower=l;}
      }
      this.rebuild();
    },150);
  }

  setDebug(mode){this.debug=mode;this.rebuild();}
  setEmanata(type){this.emanata=type;this.rebuild();}

  _materials(slot,index){
    const T=this.THREE;
    const face=slot.materialOverride||this.faceColor;
    const sclera=new T.MeshPhysicalMaterial({color:'#eeece4',roughness:.68,metalness:0,clearcoat:.26,clearcoatRoughness:.24});
    const pupil=new T.MeshPhysicalMaterial({color:'#11100f',roughness:.36,metalness:0,clearcoat:.55,clearcoatRoughness:.08});
    const lidColor=this.debug==='zones'?(index%2?'#71a67a':'#df7358'):face;
    const lid=new T.MeshStandardMaterial({color:lidColor,roughness:.88,metalness:0});
    const brow=new T.MeshStandardMaterial({color:this.debug==='zones'?'#7a58a1':'#302622',roughness:.92,metalness:0});
    return {sclera,pupil,lid,brow};
  }

  _actor(slot,index){
    const T=this.THREE,R=this.radius,m=this._materials(slot,index);
    const group=new T.Group();group.name=slot.id;group.userData.kfbEyeSlot=slot.id;
    group.position.set(...slot.position);
    group.rotation.set(slot.eulerDeg[0]*DEG,slot.eulerDeg[1]*DEG,slot.eulerDeg[2]*DEG,'XYZ');
    group.scale.set(slot.size*slot.shape[0],slot.size*slot.shape[1],slot.size*slot.shape[2]);
    group.visible=slot.enabled!==false;

    const sclera=new T.Mesh(new T.SphereGeometry(R,32,24),m.sclera);
    sclera.castShadow=true;sclera.receiveShadow=true;group.add(sclera);

    const pupilPivot=new T.Group();group.add(pupilPivot);
    pupilPivot.rotation.y=-slot.gaze[0]*.28;pupilPivot.rotation.x=slot.gaze[1]*.24;
    const pupil=new T.Mesh(new T.SphereGeometry(R*.38,24,16),m.pupil);
    pupil.scale.z=.38;pupil.position.z=R*.89;pupilPivot.add(pupil);

    const catchMat=new T.MeshBasicMaterial({color:'#fffdf5',toneMapped:false});
    const catchlight=new T.Mesh(new T.SphereGeometry(R*.075,12,8),catchMat);
    catchlight.position.set(-R*.11,R*.11,R*.355);pupil.add(catchlight);

    const lids=new T.Group();lids.rotation.z=-slot.slant*.85;group.add(lids);
    let upGeo,loGeo;
    if(slot.lidMode==='clay'){
      upGeo=clayLidGeometry(T,{radius:R,upper:true,thickness:slot.lidThickness,curve:slot.lidCurve});
      loGeo=clayLidGeometry(T,{radius:R,upper:false,thickness:slot.lidThickness,curve:slot.lidCurve});
    }else{
      upGeo=new T.SphereGeometry(R*1.01,40,22,0,Math.PI*2,0,Math.PI*.56);
      loGeo=new T.SphereGeometry(R*1.01,40,22,0,Math.PI*2,Math.PI*.44,Math.PI*.56);
    }
    const up=new T.Mesh(upGeo,m.lid),lo=new T.Mesh(loGeo,m.lid);lids.add(up,lo);
    up.rotation.x=-(1.30-clamp(slot.lidUpper,-.25,1)*1.18);
    lo.rotation.x= (1.30-clamp(slot.lidLower,-.25,1)*1.18);
    up.castShadow=lo.castShadow=true;

    let brow=null;
    if(slot.role==='primary'){
      brow=new T.Mesh(new T.CapsuleGeometry(R*.065,R*.50,6,14),m.brow);
      brow.position.set(0,R*1.48,R*.18);
      brow.rotation.z=(index%2?-1:1)*.16;
      group.add(brow);
    }
    return {group,sclera,pupil,pupilPivot,lids,up,lo,brow};
  }

  _addEmanata(){
    if(this.emanata==='none'||!this.actors.length)return;
    const T=this.THREE,target=this.actors[this.selected]||this.actors[0];
    if(!target)return;
    const g=new T.Group();g.name='Emanata';this.root.add(g);
    if(this.emanata==='sweat'){
      const m=new T.MeshStandardMaterial({color:'#75c9e8',roughness:.38,transparent:true,opacity:.92});
      const drop=new T.Mesh(new T.SphereGeometry(this.radius*.18,16,12),m);
      drop.scale.set(.7,1.5,.55);
      drop.position.copy(target.group.position).add(new T.Vector3(this.radius*.9,this.radius*.9,this.radius*.55));
      g.add(drop);
    }
    if(this.emanata==='soot'){
      const m=new T.MeshStandardMaterial({color:'#161310',roughness:.95});
      [[-.3,.55],[0,.75],[.25,.58],[.48,.72]].forEach(([x,y],i)=>{
        const d=new T.Mesh(new T.SphereGeometry(this.radius*(.06+i*.008),10,8),m);
        d.position.copy(target.group.position).add(new T.Vector3(x*this.radius,y*this.radius,this.radius*.45));
        g.add(d);
      });
    }
  }

  rebuild(){
    for(const a of this.actors)this._disposeActor(a);
    this.actors=[];this.root.clear();
    this.slots.forEach((s,i)=>{
      const a=this._actor(s,i);this.actors.push(a);this.root.add(a.group);
    });
    this._addEmanata();
    return this.report();
  }

  report(){
    return {
      schema:CLUSTER_SCHEMA,
      count:this.slots.length,
      selected:this.selected,
      scope:this.scope,
      debug:this.debug,
      emanata:this.emanata,
      eyes:this.slots.map((s,i)=>({
        id:s.id,role:s.role,enabled:s.enabled!==false,
        position:[...s.position],
        eulerDeg:[...s.eulerDeg],
        quaternion:this.actors[i]?.group.quaternion.toArray()??[0,0,0,1],
        size:s.size,
        shape:[...s.shape],
        lidMode:s.lidMode,
        lidUpper:s.lidUpper,
        lidLower:s.lidLower,
        slant:s.slant,
        gaze:[...s.gaze]
      }))
    };
  }

  export(){return JSON.parse(JSON.stringify(this.report()));}
}
