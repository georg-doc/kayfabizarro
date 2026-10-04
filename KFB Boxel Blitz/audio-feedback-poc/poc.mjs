import * as THREE from 'three';
const PIN='d78fa862262184aa0ed172ed42e10db6e3705c71',A='media/3D_Assets/Audio/';
const raw=p=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+PIN+'/'+p.split('/').map(encodeURIComponent).join('/');
const ASSETS={
 pickup:A+'Retro/coin.wav',
 powerup:A+'Retro/power_up.wav',
 powerdown:A+'Retro/power_down.wav',
 jump:A+'Retro/jump.wav',
 upJingle:A+'kenney_music-jingles/Audio/Pizzicato jingles/jingles_PIZZI00.ogg',
 downJingle:A+'kenney_music-jingles/Audio/Steel jingles/jingles_STEEL05.ogg'
};
const ladder=(family,step)=>A+'Match Three/match_'+family+'_'+step+(step===10?'_MAX':'')+'.wav';
const canvas=document.getElementById('gl'),readout=document.getElementById('readout');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x171811,1);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,5.4,9.4);camera.lookAt(0,0,0);scene.add(new THREE.HemisphereLight(0xf3f1d8,0x312f24,2.4));const sun=new THREE.DirectionalLight(0xffe6a7,3);sun.position.set(-4,8,6);scene.add(sun);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(18,12),new THREE.MeshStandardMaterial({color:0x31362a,roughness:.92}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.05;scene.add(floor);
const TYPES=[
 {id:'pickup',label:'PICKUP',color:0xd8bb4a},
 {id:'powerup',label:'POWER UP',color:0x9dcc62},
 {id:'powerdown',label:'POWER DOWN',color:0xd86c5a},
 {id:'checkpoint',label:'CHECKPOINT',color:0x67c8d2},
 {id:'cascade',label:'CASCADE',color:0x9a78cf},
 {id:'random',label:'RANDOM',color:0xe7e3d3}
];
const cubes=[],bursts=[],ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
for(let i=0;i<TYPES.length;i++){
 const row=i<3?0:1,col=i%3,x=(col-1)*2.7,z=(row-.5)*2.8,t=TYPES[i];
 const mat=new THREE.MeshStandardMaterial({color:t.color,roughness:.55,metalness:.08,emissive:t.color,emissiveIntensity:.06});
 const cube=new THREE.Mesh(new THREE.BoxGeometry(1.65,1.65,1.65),mat);cube.position.set(x,0,z);cube.rotation.y=(i%3-1)*.13;cube.userData={...t,baseY:0,hit:0};scene.add(cube);cubes.push(cube);
}
let ctx=null,master=null,buffers=new Map(),checkpointStep=0,cascadeStep=0,lastEvent='none',events=0;
async function startAudio(){if(!ctx){ctx=new AudioContext({latencyHint:'interactive'});master=ctx.createGain();master.gain.value=.88;const comp=ctx.createDynamicsCompressor();comp.threshold.value=-10;comp.ratio.value=3;master.connect(comp).connect(ctx.destination)}await ctx.resume()}
async function get(file){if(buffers.has(file))return buffers.get(file);const r=await fetch(raw(file),{cache:'force-cache'});if(!r.ok)throw Error('HTTP '+r.status);const b=await ctx.decodeAudioData(await r.arrayBuffer());buffers.set(file,b);return b}
async function play(file,gain=.72,rate=1,delay=0){
 const b=await get(file),s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=b;s.playbackRate.value=rate;g.gain.value=gain;s.connect(g).connect(master);s.start(ctx.currentTime+delay);s.onended=()=>{try{s.disconnect();g.disconnect()}catch{}};return true;
}
function burst(cube,color,count=18){
 const origin=cube.position.clone();for(let i=0;i<count;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.055,8,6),new THREE.MeshBasicMaterial({color}));m.position.copy(origin);const a=Math.random()*Math.PI*2,u=.9+Math.random()*2.1;m.userData.v=new THREE.Vector3(Math.cos(a)*u,.8+Math.random()*2.5,Math.sin(a)*u);m.userData.life=.55+Math.random()*.35;scene.add(m);bursts.push(m)}
}
function announce(name,detail=''){lastEvent=name;events++;readout.textContent=name+(detail?' · '+detail:'')+' · events '+events}
async function trigger(cube,type){
 await startAudio();cube.userData.hit=1;burst(cube,cube.material.color, type==='powerup'?28:18);
 if(type==='random')type=TYPES[Math.floor(Math.random()*5)].id;
 if(type==='pickup'){await play(ASSETS.pickup,.75,1.02);announce('PICKUP','coin + gold burst')}
 if(type==='powerup'){play(ASSETS.powerup,.92,1);play(ASSETS.upJingle,.44,1,.035);announce('POWER UP','two-layer accent')}
 if(type==='powerdown'){play(ASSETS.powerdown,.88,.98);play(ASSETS.downJingle,.42,1,.025);announce('POWER DOWN','negative steel closure')}
 if(type==='checkpoint'){checkpointStep=checkpointStep%10+1;await play(ladder('xylophone',checkpointStep),.78,1);announce('CHECKPOINT','ladder '+checkpointStep+'/10')}
 if(type==='cascade'){cascadeStep=cascadeStep%10+1;await play(ladder('synth',cascadeStep),.86,1);announce('CASCADE','synth '+cascadeStep+'/10')}
}
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
canvas.addEventListener('pointerdown',async e=>{
 pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(cubes,false)[0];if(hit)try{await trigger(hit.object,hit.object.userData.id)}catch(err){readout.textContent='Audio error · '+err.message;console.error(err)}
});
let last=performance.now();
function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;
 for(const c of cubes){c.userData.hit=Math.max(0,c.userData.hit-dt*3.4);const h=c.userData.hit;const sx=1+h*.28,sy=1-h*.22;c.scale.lerp(new THREE.Vector3(sx,sy,sx),.35);c.position.y=c.userData.baseY+Math.sin((1-h)*Math.PI)*h*.26;c.rotation.y+=dt*.16}
 for(let i=bursts.length-1;i>=0;i--){const p=bursts[i];p.userData.life-=dt;p.userData.v.y-=5.8*dt;p.position.addScaledVector(p.userData.v,dt);p.material.opacity=Math.max(0,p.userData.life*1.4);p.material.transparent=true;if(p.userData.life<=0){scene.remove(p);p.geometry.dispose();p.material.dispose();bursts.splice(i,1)}}
 renderer.render(scene,camera);requestAnimationFrame(frame)
}requestAnimationFrame(frame);
window.__KFB_BOXEL_AUDIO_POC__=Object.freeze({trigger:(type)=>{const c=cubes.find(x=>x.userData.id===type)||cubes[0];return trigger(c,type)},snapshot:()=>({checkpointStep,cascadeStep,lastEvent,events,buffers:buffers.size,context:ctx?.state||'not-started',pin:PIN})});
