import * as THREE from 'three';
import {clamp} from './sources.mjs';
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
function mesh(g,m){return new THREE.Mesh(g,m)}
const matte=c=>new THREE.MeshStandardMaterial({color:c,roughness:.7,metalness:.15});
function box(parent,w,h,d,x,y,z,material){const m=mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);parent.add(m);return m}
function textPlane(text,width,height,{font='600 48px system-ui',ink='#f4ecd3',bg=null}={}){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.max(96,Math.round(1024*height/width));
  const ctx=canvas.getContext('2d');let previous='';
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false});
  const plane=mesh(new THREE.PlaneGeometry(width,height),material);
  function set(value){if(value===previous)return;previous=value;ctx.clearRect(0,0,1024,canvas.height);if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,1024,canvas.height)}let px=canvas.height*.68;const weight=font.match(/[1-9]00/)?.[0]||'600';ctx.font=weight+' '+px+'px system-ui';const measured=ctx.measureText(value).width;if(measured>960){px*=960/measured;ctx.font=weight+' '+px+'px system-ui'}ctx.fillStyle=ink;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(value,512,canvas.height*.53,970);texture.needsUpdate=true}
  set(text);return {plane,set};
}
function lightScene(scene){scene.add(new THREE.HemisphereLight('#ede7cb','#494a38',2.4));const sun=new THREE.DirectionalLight('#fff4d6',3.0);sun.position.set(-4,8,6);scene.add(sun)}
export function createPitPresentation(){
  const scene=new THREE.Scene();scene.background=new THREE.Color('#171910');scene.fog=new THREE.Fog('#171910',20,58);lightScene(scene);
  const camera=new THREE.PerspectiveCamera(40,1,.1,100),turn=new THREE.Group();scene.add(turn);
  const floor=matte('#393d2b'),edge=matte('#a39762'),dark=matte('#24271e'),cream=matte('#d4c99e');
  box(scene,80,.2,80,0,-.20,0,floor);
  const stand=mesh(new THREE.CylinderGeometry(5.6,5.9,.18,80),dark);stand.position.y=-.1;scene.add(stand);
  const rim=mesh(new THREE.TorusGeometry(5.65,.026,5,100),edge);rim.rotation.x=-Math.PI/2;rim.position.y=.012;scene.add(rim);
  for(let i=-4;i<5;i++)box(scene,.7,.015,.12,i,0,4.25,cream);
  // Overlay set, not a claim that a functional pit lane exists on the Flow Loop.
  for(const x of [-8,8]){box(scene,.25,5.3,.25,x,2.65,-6,dark);box(scene,.35,.16,11,x,5.25,-1,cream)}
  for(const x of [-5,-3.1,3.1,5])box(scene,1.4,2.2,1,x,1.1,-8,dark);
  const sign=textPlane('KFB / BOX STOP',9.0,1.8,{font:'650 70px system-ui',ink:'#b7b187'});sign.plane.position.set(0,3.0,-8);scene.add(sign.plane);
  let current=null,dragAngle=0,size=5;
  return {scene,camera,
    mount(vehicle){turn.clear();turn.add(vehicle.root);current=vehicle;size=Math.max(4.1,...vehicle.info().dimensions);dragAngle=0;turn.rotation.y=0},
    rotate(delta){dragAngle+=delta;turn.rotation.y=dragAngle},
    release(){if(current)current.root.removeFromParent();current=null},
    draw(renderer,draw,rect){if(!rect||rect.width<1||rect.height<1)return;const aspect=rect.width/rect.height;camera.aspect=aspect;camera.updateProjectionMatrix();
      const distance=Math.max(9,size*1.7)/Math.min(1,aspect*1.2);camera.position.set(distance*.64,distance*.40,distance*.80);camera.lookAt(0,Math.max(.7,current?current.info().dimensions[1]*.47:size*.15),0);
      renderer.setViewport(rect.left,innerHeight-rect.bottom,rect.width,rect.height);renderer.setScissor(rect.left,innerHeight-rect.bottom,rect.width,rect.height);renderer.setScissorTest(true);draw(scene,camera);renderer.setScissorTest(false);renderer.setViewport(0,0,innerWidth,innerHeight)
    }
  };
}
function digitGeometry(parent,digit,material){
  const segs={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgecd',7:'abc',8:'abcdefg',9:'abfgcd'};
  const data={a:[0,1.5,1.6,.32],g:[0,0,1.6,.32],d:[0,-1.5,1.6,.32],f:[-.88,.77,.32,1.15],b:[.88,.77,.32,1.15],e:[-.88,-.77,.32,1.15],c:[.88,-.77,.32,1.15]};
  for(const key of segs[digit]){const [x,y,w,h]=data[key];box(parent,w,h,.45,x,y,0,material)}
}
export function createInstruments(){
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,50);lightScene(scene);
  const root=new THREE.Group();scene.add(root);const gauge=new THREE.Group(),radio=new THREE.Group();root.add(gauge,radio);
  const dark=matte('#24271d'),light=matte('#d6bd68'),panel=matte('#151810');
  const dial=mesh(new THREE.CylinderGeometry(.76,.76,.16,60),dark);dial.rotation.x=Math.PI/2;gauge.add(dial);
  const rim=mesh(new THREE.TorusGeometry(.75,.035,8,60),light);rim.position.z=.095;gauge.add(rim);
  for(let i=0;i<31;i++){const a=(-.75+i/30*1.5)*Math.PI,m=box(gauge,.018,i%5===0?.14:.06,.02,Math.sin(a)*.64,Math.cos(a)*.64,.12,light);m.rotation.z=-a}
  const needle=new THREE.Group();gauge.add(needle);box(needle,.035,.49,.025,0,.23,.16,light);
  const speed=textPlane('0',.90,.38,{font:'700 150px system-ui'});speed.plane.position.set(0,-.18,.18);gauge.add(speed.plane);
  const unit=textPlane('KM/H · PROXY',1.07,.25,{font:'500 64px system-ui',ink:'#c4c3a8'});unit.plane.position.set(0,-.42,.18);gauge.add(unit.plane);
  box(radio,3.1,1.05,.29,0,0,0,dark);box(radio,2.30,.34,.035,-.19,.11,.17,panel);
  const top=textPlane('KFB / RADIO',1.9,.20,{font:'600 56px system-ui',ink:'#c1ae66'});top.plane.position.set(-.35,.37,.18);radio.add(top.plane);
  const title=textPlane('VAN METRONOME',2.3,.25,{font:'600 60px system-ui',ink:'#e2dab5'});title.plane.position.set(-.19,.13,.2);radio.add(title.plane);
  for(let i=0;i<3;i++){const knob=mesh(new THREE.CylinderGeometry(.085,.085,.08,20),light);knob.rotation.x=Math.PI/2;knob.position.set(1.19,.26-i*.24,.20);radio.add(knob)}
  const countdown=new THREE.Group();root.add(countdown);countdown.visible=false;let shown='',gpos=0,gvel=0,rpos=0,rvel=0,reduced=false;
  function counter(value,phase){
    if(value!==shown){for(const child of countdown.children){child.traverse(n=>{if(n.isMesh){n.geometry.dispose();if(n.material.map){n.material.map.dispose();n.material.dispose()}}})}countdown.clear();shown=value;
      if(/[123]/.test(value))digitGeometry(countdown,value,light);
      else if(value==='GO'){const words=textPlane('GO',4.1,2.0,{font:'900 220px system-ui',ink:'#f2dc81'});countdown.add(words.plane)}
    }
    countdown.visible=!!value;const s=reduced?1:(1+.15*Math.exp(-phase*9)*Math.cos(phase*16));countdown.scale.setScalar(s);countdown.rotation.y=reduced?0:.15*Math.exp(-phase*7);countdown.position.y=reduced?0:.12*Math.exp(-phase*8)
  }
  return {scene,camera,counter,setTitle(value){title.set(value.slice(0,32))},setReduced(v){reduced=!!v},
    update(dt,t,interacting=false){const h=Math.min(.04,dt),goal=reduced||interacting?0:clamp(-(t.lateralAccelerationProxy||0)/800+(t.longitudinalAcceleration||0)/700,-.1,.1);
      gvel+=((goal-gpos)*85-gvel*15)*h;gpos+=gvel*h;rvel+=((-goal-rpos)*65-rvel*13)*h;rpos+=rvel*h;
      gauge.rotation.z=gpos;radio.rotation.z=rpos;radio.rotation.y=reduced?0:-.045;radio.rotation.x=reduced?0:.065;
      speed.set(String(Math.round(Math.abs(t.speed||0)*7.2)));needle.rotation.z=-(-.75+clamp(Math.abs(t.speed||0)/48.5,0,1)*1.5)*Math.PI;
    },
    draw(renderer,draw){const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.position.set(0,0,12);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
      const vh=2*12*Math.tan(35*Math.PI/360),vw=vh*w/h,px=vh/h;
      const mobile=w<850;gauge.scale.setScalar((mobile?88:120)*px/1.6);radio.scale.setScalar((mobile?195:260)*px/3.1);
      gauge.position.set(-vw/2+(mobile?61:87)*px,-vh/2+(mobile?168:104)*px,0);
      radio.position.set(vw/2-(mobile?111:154)*px,-vh/2+(mobile?163:99)*px,0);
      countdown.position.z=1;
      const auto=renderer.autoClear;renderer.autoClear=false;renderer.clearDepth();draw(scene,camera);renderer.autoClear=auto;
    },snapshot(){return {gaugeAngle:gpos,radioAngle:rpos,countdown:shown,reduced}}};
}
