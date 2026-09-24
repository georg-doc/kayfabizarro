import * as THREE from 'three';

const SOURCE_PIN='9b3c57ec09af8a9601a7221a84ee9a6de1e287f5';
const ROOT='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+SOURCE_PIN+'/media/3D_Assets/Textures/';
export const CURTAIN_TEXTURES={
  velour_velvet:{label:'Velour Velvet',base:'velour_velvet'},
  rough_linen:{label:'Rough Linen',base:'rough_linen'},
  hessian_230:{label:'Hessian 230',base:'hessian_230'},
  crepe_satin:{label:'Crepe Satin',base:'crepe_satin'}
};
const clamp=THREE.MathUtils.clamp, lerp=THREE.MathUtils.lerp;
const tmp=new THREE.Vector3();

class Panel{
  constructor(side,w,h,top,half,nx=34,ny=40){
    Object.assign(this,{side,w,h,top,half,nx,ny});
    this.count=(nx+1)*(ny+1); this.p=[]; this.prev=[]; this.rest=[]; this.fixed=new Uint8Array(this.count); this.springs=[]; this.hooks=[]; this.rings=[];
    for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){
      const i=this.id(x,y),u=x/nx,v=y/ny;
      const px=side==='left'?-half+w*u:w*u;
      const py=top-h*v;
      const pz=Math.sin(u*Math.PI*16+(side==='left'?0:1.15))*.2*(.62+.38*Math.sin(Math.PI*u));
      const q=new THREE.Vector3(px,py,pz); this.p[i]=q.clone(); this.prev[i]=q.clone(); this.rest[i]=q.clone();
      if(y===0&&(x===0||x===nx||x%2===0)){this.fixed[i]=1;this.hooks.push(i)}
    }
    const dx=w/nx,dy=h/ny,diag=Math.hypot(dx,dy);
    const add=(a,b,r,k)=>this.springs.push({a,b,r,k});
    for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){
      const i=this.id(x,y);
      if(x<nx)add(i,this.id(x+1,y),dx,1);
      if(y<ny)add(i,this.id(x,y+1),dy,1);
      if(x<nx&&y<ny)add(i,this.id(x+1,y+1),diag,.82);
      if(x>0&&y<ny)add(i,this.id(x-1,y+1),diag,.82);
      if(x+2<=nx)add(i,this.id(x+2,y),dx*2,.32);
      if(y+2<=ny)add(i,this.id(x,y+2),dy*2,.3);
    }
    const pos=new Float32Array(this.count*3),uv=new Float32Array(this.count*2),idx=[];
    for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){
      const i=this.id(x,y),q=this.p[i]; pos.set([q.x,q.y,q.z],i*3); uv.set([x/nx,1-y/ny],i*2);
      if(x<nx&&y<ny){
        const a=i,b=this.id(x+1,y),c=this.id(x+1,y+1),d=this.id(x,y+1);
        if((x+y)%2===0){idx.push(a,b,d,b,c,d)}else{idx.push(a,b,c,a,c,d)}
      }
    }
    this.geometry=new THREE.BufferGeometry();
    this.geometry.setAttribute('position',new THREE.BufferAttribute(pos,3));
    this.geometry.setAttribute('normal',new THREE.BufferAttribute(new Float32Array(this.count*3),3));
    this.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    this.geometry.setAttribute('uv1',new THREE.BufferAttribute(uv.slice(),2));
    this.geometry.setIndex(idx);
    this._t1=new THREE.Vector3(); this._t2=new THREE.Vector3(); this._nrm=new THREE.Vector3();
    this.updateAnalyticNormals();
  }
  updateAnalyticNormals(){
    // donor technique: normal = cross(tangent,bitangent) from live neighbor positions,
    // not BufferGeometry.computeVertexNormals() — decouples shading from triangle winding
    // (the source of the diagonal-banding artifact) and removes texture-normal-map shimmer
    // from any residual per-vertex normal noise under motion.
    const n=this.geometry.getAttribute('normal'),t1=this._t1,t2=this._t2,nrm=this._nrm;
    for(let y=0;y<=this.ny;y++)for(let x=0;x<=this.nx;x++){
      const i=this.id(x,y),xr=Math.min(x+1,this.nx),xl=Math.max(x-1,0),yb=Math.min(y+1,this.ny),yt=Math.max(y-1,0);
      const right=this.p[this.id(xr,y)],left=this.p[this.id(xl,y)],bottom=this.p[this.id(x,yb)],top=this.p[this.id(x,yt)];
      t1.subVectors(right,left); t2.subVectors(bottom,top); nrm.crossVectors(t1,t2);
      if(nrm.lengthSq()<1e-10)nrm.set(0,0,1); else nrm.normalize();
      n.setXYZ(i,nrm.x,nrm.y,nrm.z);
    }
    n.needsUpdate=true;
  }
  id(x,y){return y*(this.nx+1)+x}
  target(i,open){
    const x=i%(this.nx+1),u=x/this.nx;
    const closed=this.side==='left'?-this.half+this.w*u:this.w*u;
    const gathered=this.side==='left'?-this.half+1.28*u:this.half-1.28*(1-u);
    return tmp.set(lerp(closed,gathered,open),this.top,this.rest[i].z*.42);
  }
  bulgeCurve(u,v){
    const cx=this.side==='left'?-this.half+1.05*u:this.half-1.05*(1-u);
    const cy=this.top-this.h*v+Math.sin((1-v)*1.55)*.4;
    return [cx,cy];
  }
  bulgeInfluence(v){
    const top=clamp(v/.35,0,1),bottom=v<=.62?1:Math.max(0,1-(v-.62)/.38);
    return top*bottom;
  }
  step(dt,t,wind,open,tieAmt){
    const dt2=dt*dt;
    for(let y=0;y<=this.ny;y++)for(let x=0;x<=this.nx;x++){
      const i=this.id(x,y),q=this.p[i];
      if(this.fixed[i]){q.lerp(this.target(i,Math.max(open,tieAmt*.55)),.88);this.prev[i].copy(q);continue}
      const old=this.prev[i],vx=(q.x-old.x)*.986,vy=(q.y-old.y)*.986,vz=(q.z-old.z)*.978; old.copy(q);
      const v=y/this.ny,u=x/this.nx,phase=q.x*1.8+q.y*.72+t*.86+(this.side==='left'?0.4:1.7),gust=Math.sin(phase)*.64+Math.sin(phase*.43+t*.27)*.36;
      q.x+=vx+gust*wind*.0005; q.y+=vy-9.8*(1+.8*Math.max(0,(v-.7)/.3))*dt2*.27; q.z+=vz+gust*wind*dt2*.82;
      if(tieAmt>.001){
        const influence=this.bulgeInfluence(v);
        if(influence>0){
          const [cx,cy]=this.bulgeCurve(u,v),pull=influence*tieAmt*.05;
          q.x+=(cx-q.x)*pull; q.y+=(cy-q.y)*pull;
        }
      }
    }
    for(let it=0;it<5;it++){
      for(const s of this.springs){
        const a=this.p[s.a],b=this.p[s.b],d=tmp.subVectors(b,a),len=Math.max(d.length(),1e-6),m=.5*s.k*(len-s.r)/len;
        if(!this.fixed[s.a])a.addScaledVector(d,m); if(!this.fixed[s.b])b.addScaledVector(d,-m);
      }
      for(const i of this.hooks){this.p[i].lerp(this.target(i,Math.max(open,tieAmt*.55)),.97);this.prev[i].copy(this.p[i])}
    }
    const a=this.geometry.getAttribute('position');
    for(let i=0;i<this.count;i++)a.setXYZ(i,this.p[i].x,this.p[i].y,this.p[i].z);
    a.needsUpdate=true; this.updateAnalyticNormals();
  }
  impulse(x,y,strength=1.5,radius=1){
    let n=0,r2=radius*radius;
    for(let i=0;i<this.count;i++){if(this.fixed[i])continue;const q=this.p[i],dx=q.x-x,dy=q.y-y,d2=dx*dx+dy*dy;if(d2>=r2)continue;const f=1-Math.sqrt(d2)/radius;q.z+=strength*f*.08;this.prev[i].z-=strength*f*.12;n++}return n;
  }
  reset(){for(let i=0;i<this.count;i++){this.p[i].copy(this.rest[i]);this.prev[i].copy(this.rest[i])}}
}

export class KFBTheatreCurtain{
  constructor(o={}){
    this.o=Object.assign({texture:'velour_velvet',tint:'#8c3f37',wind:.62,width:8.8,height:5.55,top:2.78,openDuration:2.5,tieDuration:2.2},o);
    this.panels=[];this.meshes=[];this.open=0;this.goal=0;this.tieAmt=0;this.tieGoal=0;this.tieState='untied';this.state='closed-rest';this.time=0;this.acc=0;this.stepDt=1/120;this.last=performance.now();this.stats={impulses:0,backend:'CPU Verlet · WebGL fallback'};
  }
  async mount(el){
    this.el=el; const r=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});this.renderer=r;
    r.setPixelRatio(Math.min(devicePixelRatio||1,2));r.shadowMap.enabled=true;r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.02;r.domElement.style.cssText='width:100%;height:100%;display:block;touch-action:none';el.appendChild(r.domElement);
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x15110f);
    this.camera=new THREE.PerspectiveCamera(38,1,.1,50);this.camera.position.set(0,.05,10.8);this.camera.lookAt(0,0,0);
    this.scene.add(new THREE.HemisphereLight(0xe8d0bf,0x211814,1.15));
    const key=new THREE.SpotLight(0xffd2b0,130,26,Math.PI*.36,.4,1.4);key.position.set(-3.5,5.8,6.6);key.target.position.set(-.6,.2,0);key.castShadow=true;this.scene.add(key,key.target);
    const fill=new THREE.PointLight(0xb75243,55,16,1.8);fill.position.set(4.2,1.5,4.5);this.scene.add(fill);
    const front=new THREE.PointLight(0xfff1e0,38,18,1.7);front.position.set(0,1.8,7.2);this.scene.add(front);
    await this.setMaterial(this.o.texture);
    const half=this.o.width/2,base=[half+.06,this.o.height,this.o.top,half];
    this.panels=[new Panel('left',...base),new Panel('right',...base)];
    for(const p of this.panels){const m=new THREE.Mesh(p.geometry,this.material);m.castShadow=true;m.receiveShadow=true;m.frustumCulled=false;this.meshes.push(m);this.scene.add(m)}
    this.makeRail(); this.resize(); this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(el);
    r.domElement.addEventListener('pointerdown',e=>this.pointer(e));this.running=true;this.last=performance.now();this.raf=requestAnimationFrame(t=>this.frame(t));return this;
  }
  async setMaterial(id){
    const e=CURTAIN_TEXTURES[id]||CURTAIN_TEXTURES.velour_velvet,b=e.base,root=ROOT+b+'/',loader=new THREE.TextureLoader(),load=u=>new Promise(ok=>loader.load(u,ok,undefined,()=>ok(null)));
    const maps=await Promise.all([load(root+b+'_diffuse.jpg'),load(root+b+'_normal.jpg'),load(root+b+'_roughness.jpg'),load(root+b+'_ao.jpg')]);
    const maxAniso=this.renderer?this.renderer.capabilities.getMaxAnisotropy():1;
    maps.forEach((t,i)=>{if(!t)return;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2.55,2.1);t.anisotropy=maxAniso;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;if(i===0)t.colorSpace=THREE.SRGBColorSpace});
    const mat=new THREE.MeshPhysicalMaterial({color:this.o.tint,map:maps[0],aoMap:maps[3],roughness:.92,metalness:0,sheen:.55,sheenColor:new THREE.Color('#d88c75'),sheenRoughness:.75,side:THREE.DoubleSide});
    if(this.material)this.material.dispose();this.material=mat;this.texture=id;for(const m of this.meshes)m.material=mat;return id;
  }
  makeRail(){
    this.rail=new THREE.Group();const rm=new THREE.MeshStandardMaterial({color:0x352923,roughness:.36,metalness:.72}),hm=new THREE.MeshStandardMaterial({color:0x80634a,roughness:.42,metalness:.64});
    const bar=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,this.o.width+.72,20),rm);bar.rotation.z=Math.PI/2;bar.position.set(0,this.o.top+.18,.02);bar.castShadow=true;this.rail.add(bar);
    for(const p of this.panels)for(const i of p.hooks.filter((_,k)=>k%2===0)){const m=new THREE.Mesh(new THREE.TorusGeometry(.075,.018,8,18),hm);m.rotation.y=Math.PI/2;this.rail.add(m);p.rings.push({m,i})}
    this.scene.add(this.rail);this.syncRings();
  }
  syncRings(){const t=Math.max(this.open,this.tieAmt*.55);for(const p of this.panels)for(const r of p.rings){const q=p.target(r.i,t);r.m.position.set(q.x,this.o.top+.075,q.z*.18+.02)}}
  setState(s){if(s==='open'){this.goal=1;this.state='opening'}else if(s==='close'||s==='idle'){this.goal=0;this.state=this.open>.02?'closing':'closed-wind'}else if(s==='impact')this.impulse({x:0,y:-.2,strength:2.1,radius:1.25});else if(s==='reset')this.reset();else if(s==='tie')this.tieGoal=1;else if(s==='untie')this.tieGoal=0;return this.state}
  setWind(v){this.o.wind=clamp(Number(v)||0,0,2.5)}
  impulse(o={}){const a=Object.assign({x:0,y:-.25,strength:1.5,radius:1.05},o);let n=0;for(const p of this.panels)n+=p.impulse(a.x,a.y,a.strength,a.radius);this.stats.impulses++;return n}
  pointer(e){const rect=this.renderer.domElement.getBoundingClientRect(),n=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster(),pt=new THREE.Vector3();ray.setFromCamera(n,this.camera);if(ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),0),pt))this.impulse({x:pt.x,y:pt.y})}
  advanceState(dt){
    const d=Math.sign(this.goal-this.open);
    if(Math.abs(this.goal-this.open)>.001){
      this.open=clamp(this.open+d*dt/this.o.openDuration,0,1);
      this.state=d>0?'opening':'closing';
    }else{
      this.open=this.goal;
      this.state=this.open>.98?'open-rest':'closed-wind';
    }
    const td=Math.sign(this.tieGoal-this.tieAmt);
    if(Math.abs(this.tieGoal-this.tieAmt)>.001){
      this.tieAmt=clamp(this.tieAmt+td*dt/this.o.tieDuration,0,1);
      this.tieState=td>0?'tying':'untying';
    }else{
      this.tieAmt=this.tieGoal;
      this.tieState=this.tieAmt>.98?'tied-rest':'untied';
    }
  }
  stepPhysics(dt){
    this.time+=dt;
    for(const p of this.panels)p.step(dt,this.time,this.o.wind,this.open,this.tieAmt);
    this.syncRings();
  }
  update(dt){this.advanceState(dt);this.stepPhysics(dt)}
  frame(now){
    if(!this.running)return;
    const wallDt=Math.min(.5,Math.max(0,(now-this.last)/1000));
    this.last=now;
    this.advanceState(wallDt);
    this.acc=Math.min(this.acc+Math.min(.05,wallDt),.12);
    let n=0;
    while(this.acc>=this.stepDt&&n++<12){this.stepPhysics(this.stepDt);this.acc-=this.stepDt}
    this.renderer.render(this.scene,this.camera);
    this.raf=requestAnimationFrame(t=>this.frame(t));
  }
  resize(){const w=Math.max(2,this.el.clientWidth),h=Math.max(2,this.el.clientHeight);this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.position.z=w/h<1.2?13.2:10.8;this.camera.updateProjectionMatrix()}
  reset(){this.open=this.goal=0;this.tieAmt=this.tieGoal=0;this.tieState='untied';this.state='closed-rest';for(const p of this.panels)p.reset();this.syncRings()}
  snapshot(){return{ready:!!this.renderer&&this.panels.length===2,backend:this.stats.backend,state:this.state,openProgress:+this.open.toFixed(4),tieState:this.tieState,tieProgress:+this.tieAmt.toFixed(4),texture:this.texture,panelCount:this.panels.length,hooks:this.panels.reduce((n,p)=>n+p.rings.length,0),wind:this.o.wind,impulses:this.stats.impulses,sourcePin:SOURCE_PIN,api:['mount','update','setState','impulse','reset','dispose']}}
  dispose(){this.running=false;cancelAnimationFrame(this.raf);this.ro&&this.ro.disconnect();for(const p of this.panels)p.geometry.dispose();if(this.material)this.material.dispose();this.renderer&&this.renderer.dispose();this.renderer&&this.renderer.domElement.remove()}
}
export async function mountKFBTheatreCurtain(el,o={}){const c=new KFBTheatreCurtain(o);await c.mount(el);return c}
