import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildElasticShell, buildElasticRoof, openFootprint, centroid } from './elastic-grotesque-clay.v2.pinned.mjs';

const BUILD='KFB-THREE-GEO-P0B-20261001';
const DONOR_URL='https://unpkg.com/lm-three-geo-play@2.2.0/dist/three-geo-play.js';
const DONOR_COMMIT='78a6b822261929a54f731dd08a972cf7b0a11500';
const ELASTIC_PIN='0c59e92d9d8688f5a88cd309ae8891dcd174c2fc';
const ELASTIC_BLOB='75c3d794b9341a7074038594b467f91d153486c6';
const ORIGIN={lat:50.949425,lon:6.917500};
const state={build:BUILD,donor:{version:'2.2.0',commit:DONOR_COMMIT},three:'0.160.0',elastic:{pin:ELASTIC_PIN,blob:ELASTIC_BLOB},ready:false,fatal:null,view:'source',stream:null,city:null,adapter:null,tiles:null,sourceErrors:0};

document.body.innerHTML='<style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#171713;color:#eee7d6;font:11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}canvas{width:100%;height:100%;display:block}.p{position:fixed;z-index:4;background:#211f1adb;border:1px solid #5e594b;padding:10px;backdrop-filter:blur(8px)}#top{left:10px;top:10px;max-width:760px}#diag{right:10px;top:10px;width:260px}.row{display:flex;gap:5px;flex-wrap:wrap}button{font:inherit;color:#eee7d6;background:#302d25;border:1px solid #6c6552;padding:6px 8px;margin-top:7px;cursor:pointer}button.on{background:#d1a26b;color:#20150d;font-weight:800}.muted{color:#aca38f}.g{display:grid;grid-template-columns:1fr auto;gap:2px 8px}.g b{text-align:right}.labels{position:fixed;left:0;right:0;bottom:16px;z-index:4;display:grid;grid-template-columns:repeat(4,1fr);pointer-events:none}.labels div{text-align:center}.labels b{display:inline-block;background:#171713d9;border:1px solid #625c4b;padding:5px 8px}.hide{opacity:.18}.bad{color:#ffb0a0}#fatal{display:none;inset:0;place-items:center;background:#2b1713;z-index:9;font:700 15px system-ui;white-space:pre-wrap;text-align:center;padding:30px}#fatal.on{display:grid}@media(max-width:780px){#diag{top:auto;bottom:66px;width:220px}.labels{font-size:9px}}</style><canvas id="c"></canvas><div class="p" id="top"><b>THREE-GEO-PLAY · P0B · SHARED BUILDING ADAPTER</b><div class="muted">real streamed feature + real City Lab feature · exact Elastic V2 pin</div><div class="row"><button id="source" class="on">SOURCE ISOLATION</button><button id="adapted">ADAPTED PAIR</button><button id="all">ALL FOUR</button></div><div id="facts" class="muted">loading sources…</div></div><div class="p" id="diag"><div class="g"><span>READY</span><b id="rdy">no</b><span>STREAM SOURCE</span><b id="sid">—</b><span>CITY SOURCE</span><b id="cid">—</b><span>HEIGHT Δ</span><b id="height">—</b><span>CENTER Δ</span><b id="center">—</b><span>TILES R/L/F</span><b id="tiles">—</b><span>ADAPTER</span><b>Elastic V2</b></div></div><div class="labels"><div id="l0"><b>STREAM · SOURCE</b></div><div id="l1"><b>STREAM · ADAPTED</b></div><div id="l2"><b>CITY LAB · SOURCE</b></div><div id="l3"><b>CITY LAB · ADAPTED</b></div></div><div class="p" id="fatal"></div>';

const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.setSize(innerWidth,innerHeight,false);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=false;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xb8c7bf);
scene.fog=new THREE.Fog(0xb8c7bf,180,420);
scene.add(new THREE.HemisphereLight(0xfff2d7,0x48525b,2.4));
const sun=new THREE.DirectionalLight(0xffddb5,2.5);sun.position.set(-80,130,90);scene.add(sun);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.2,650);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.49;
camera.position.set(0,62,125);controls.target.set(0,10,0);controls.update();

const pads=[-54,-18,18,54];
const display={native:null,streamAdapt:null,cityRaw:null,cityAdapt:null};
const matRawStream=new THREE.MeshStandardMaterial({color:0xe4e1d7,roughness:.86,metalness:0,flatShading:true});
const matRawCity=new THREE.MeshStandardMaterial({color:0x8ea9b0,roughness:.88,metalness:0,flatShading:true});
const matAdapt=new THREE.MeshStandardMaterial({color:0xd7a16d,roughness:.82,metalness:0,flatShading:true,side:THREE.DoubleSide});
const matRoof=new THREE.MeshStandardMaterial({color:0xa86f53,roughness:.86,metalness:0,flatShading:true,side:THREE.DoubleSide});

function fatal(error){state.fatal=String(error&&(error.stack||error.message||error));const e=document.getElementById('fatal');e.textContent='P0B runtime failed\n\n'+state.fatal;e.classList.add('on');}
addEventListener('error',function(e){fatal(e.error||e.message);});
addEventListener('unhandledrejection',function(e){fatal(e.reason);});

function polyArea(poly){const p=openFootprint(poly);let a=0;for(let i=0,j=p.length-1;i<p.length;j=i++)a+=p[j].x*p[i].z-p[i].x*p[j].z;return Math.abs(a)*.5;}
function bounds(poly){const p=openFootprint(poly),xs=p.map(function(q){return q.x;}),zs=p.map(function(q){return q.z;});return {minX:Math.min.apply(null,xs),maxX:Math.max.apply(null,xs),minZ:Math.min.apply(null,zs),maxZ:Math.max.apply(null,zs)};}
function centerOfBounds(b){return {x:(b.minX+b.maxX)/2,z:(b.minZ+b.maxZ)/2};}
function d2(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
function heightOf(props){const v=Number(props.render_height!=null?props.render_height:props.height);return Number.isFinite(v)&&v>0?v:10;}
function minHeightOf(props){const v=Number(props.render_min_height!=null?props.render_min_height:props.min_height);return Number.isFinite(v)&&v>0?v:0;}

function cityRawMesh(b){
  const p=openFootprint(b.footprint);
  const s=new THREE.Shape();
  p.forEach(function(q,i){if(i)s.lineTo(q.x,-q.z);else s.moveTo(q.x,-q.z);});
  const g=new THREE.ExtrudeGeometry(s,{depth:b.heightM,bevelEnabled:false,steps:1});
  g.rotateX(-Math.PI/2);g.computeVertexNormals();
  const m=new THREE.Mesh(g,matRawCity);m.userData.sourceId=b.id;return m;
}
function elasticGroup(b){
  const shell=buildElasticShell(b,{x:20,z:18},{verticalSteps:12});
  const roof=buildElasticRoof(b,shell);
  const g=new THREE.Group();
  const body=new THREE.Mesh(shell.geometry,matAdapt),cap=new THREE.Mesh(roof,matRoof);
  body.userData.role='shared-elastic-shell';cap.userData.role='shared-elastic-roof';
  g.add(body,cap);
  const srcC=centroid(b.footprint),baseC=centroid(shell.baseRing);
  return {group:g,shell:shell,metrics:{heightDelta:Math.abs(shell.params.h-b.heightM),centerDelta:d2(srcC,shell.params.c),baseCenterDelta:d2(srcC,baseC),vertices:shell.geometry.getAttribute('position').count}};
}
function shiftTo(group,sourceCenter,x){
  group.position.set(x-sourceCenter.x,0,-sourceCenter.z);
}
function addPad(x){
  const g=new THREE.GridHelper(26,13,0x665f4c,0x665f4c);g.position.set(x,-.02,0);scene.add(g);
}
pads.forEach(addPad);

async function settle(geo,limitMs){
  const start=performance.now();
  while(performance.now()-start<limitMs){
    const s=geo.getTileStats();
    if(s.total>0&&s.loading===0&&s.rebuilding===0)return s;
    await new Promise(function(resolve){setTimeout(resolve,120);});
  }
  throw new Error('tiles did not settle: '+JSON.stringify(geo.getTileStats()));
}
function chooseCity(city){
  const candidates=city.features.buildings.filter(function(b){
    const p=openFootprint(b.footprint),a=polyArea(b.footprint);
    return p.length===4&&a>65&&a<600&&b.heightM>=6&&b.heightM<=28;
  }).map(function(b){return {b:b,c:centroid(b.footprint),a:polyArea(b.footprint)};});
  candidates.sort(function(a,b){return Math.hypot(a.c.x,a.c.z)-Math.hypot(b.c.x,b.c.z);});
  if(!candidates.length)throw new Error('no simple City Lab building candidate');
  return candidates[0].b;
}
function chooseStream(geo){
  const candidates=[];
  geo.getTiles().forEach(function(tile){
    tile.getFeatures('building').forEach(function(f){
      if(f.type!=='polygon'||f.geometry.length!==1)return;
      const flat=f.geometry[0];if(flat.length<8||flat.length>12)return;
      const donor=[];
      for(let i=0;i<flat.length;i+=2){
        const v=new THREE.Vector3(flat[i],0,flat[i+1]);
        tile.object3D.localToWorld(v);
        donor.push({x:v.x,z:v.z});
      }
      const p=openFootprint(donor),a=polyArea(p),h=heightOf(f.properties);
      if(p.length<4||p.length>5||a<65||a>650||h<6||h>28)return;
      const c=centroid(p);
      candidates.push({tile:tile,feature:f,donor:donor,c:c,area:a,height:h,minHeight:minHeightOf(f.properties),distance:Math.hypot(c.x,c.z)});
    });
  });
  candidates.sort(function(a,b){return a.distance-b.distance;});
  if(!candidates.length)throw new Error('no simple streamed building candidate');
  return candidates[0];
}
function isolateNative(geo,selected){
  const style=geo.getMapStyle().clone();
  ['backgroundLayer','waterLayer','waterwayLayer','landUseLayer','landCoverLayer','transportationLayer','shadowLayer'].forEach(function(k){if(style[k])style[k].isVisible=false;});
  style.buildingLayer.isVisible=true;
  style.buildingLayer.featureStyle=function(info){return info.key===selected.feature.key?null:{visible:false};};
  geo.setMapStyle(style);
}
function layout(view,streamDonorCenter,streamCityCenter,cityCenter){
  state.view=view;
  const native=geo.getMapGroup();
  const labels=[document.getElementById('l0'),document.getElementById('l1'),document.getElementById('l2'),document.getElementById('l3')];
  labels.forEach(function(x){x.classList.remove('hide');});
  if(view==='source'){
    native.visible=true;display.streamAdapt.visible=false;display.cityRaw.visible=true;display.cityAdapt.visible=false;
    native.position.set(-24-streamDonorCenter.x,0,-streamDonorCenter.z);
    shiftTo(display.cityRaw,cityCenter,24);
    labels[1].classList.add('hide');labels[3].classList.add('hide');
    camera.position.set(0,48,92);controls.target.set(0,9,0);
  }else if(view==='adapted'){
    native.visible=false;display.streamAdapt.visible=true;display.cityRaw.visible=false;display.cityAdapt.visible=true;
    shiftTo(display.streamAdapt,streamCityCenter,-24);shiftTo(display.cityAdapt,cityCenter,24);
    labels[0].classList.add('hide');labels[2].classList.add('hide');
    camera.position.set(0,48,92);controls.target.set(0,9,0);
  }else{
    native.visible=true;display.streamAdapt.visible=true;display.cityRaw.visible=true;display.cityAdapt.visible=true;
    native.position.set(pads[0]-streamDonorCenter.x,0,-streamDonorCenter.z);
    shiftTo(display.streamAdapt,streamCityCenter,pads[1]);shiftTo(display.cityRaw,cityCenter,pads[2]);shiftTo(display.cityAdapt,cityCenter,pads[3]);
    camera.position.set(0,55,130);controls.target.set(0,9,0);
  }
  controls.update();
  ['source','adapted','all'].forEach(function(id){document.getElementById(id).classList.toggle('on',id===view);});
}

let geo=null,freezeGeo=false,streamDonorCenter=null,streamCityCenter=null,cityCenter=null;
window.__KFB_THREE_GEO_P0B__=Object.freeze({
  snapshot:function(){return JSON.parse(JSON.stringify(state));},
  setView:function(v){if(state.ready)layout(v,streamDonorCenter,streamCityCenter,cityCenter);}
});

async function boot(){
  const cityUrl=new URL('../../data/ehrenfeld-v0/normalized.json',import.meta.url);
  const city=await fetch(cityUrl,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('City Lab normalized '+r.status);return r.json();});
  const cityB=chooseCity(city);
  cityCenter=centroid(cityB.footprint);
  state.city={id:cityB.id,heightM:cityB.heightM,points:openFootprint(cityB.footprint).length,areaM2:polyArea(cityB.footprint),source:'ehrenfeld-v0 normalized.json'};

  const donor=await import(DONOR_URL);
  geo=new donor.ThreeGeoPlay(scene,camera,renderer,{tileUrl:'https://tiles.openfreemap.org/planet',originLatLon:ORIGIN,zoomLevel:14,unitsPerMeter:1,renderDistance:1,followUpdateInterval:120});
  geo.addEventListener('sourceerror',function(){state.sourceErrors+=1;});
  geo.start();
  await settle(geo,30000);
  const selected=chooseStream(geo);
  streamDonorCenter=selected.c;
  const cityFoot=selected.donor.map(function(p){return {x:p.x,z:-p.z};});
  const streamB={id:'stream:'+selected.feature.key,footprint:cityFoot,heightM:selected.height,minHeightM:selected.minHeight,roof:{type:'flat',heightM:.35}};
  streamCityCenter=centroid(streamB.footprint);
  state.stream={key:selected.feature.key,sourceLayer:selected.feature.sourceLayer,heightM:selected.height,points:openFootprint(selected.donor).length,areaM2:polyArea(selected.donor),seam:'x same / z flipped',properties:selected.feature.properties};

  isolateNative(geo,selected);
  await settle(geo,30000);
  freezeGeo=true;
  state.tiles=geo.getTileStats();

  display.cityRaw=new THREE.Group();display.cityRaw.add(cityRawMesh(cityB));scene.add(display.cityRaw);
  const streamAdapt=elasticGroup(streamB),cityAdapt=elasticGroup(cityB);
  display.streamAdapt=streamAdapt.group;display.cityAdapt=cityAdapt.group;scene.add(display.streamAdapt,display.cityAdapt);

  state.adapter={
    name:'Elastic Grotesque Clay V2',
    pin:ELASTIC_PIN,
    blob:ELASTIC_BLOB,
    sameFunctionPath:true,
    stream:{heightDelta:streamAdapt.metrics.heightDelta,centerDelta:streamAdapt.metrics.centerDelta,baseCenterDelta:streamAdapt.metrics.baseCenterDelta,vertices:streamAdapt.metrics.vertices},
    city:{heightDelta:cityAdapt.metrics.heightDelta,centerDelta:cityAdapt.metrics.centerDelta,baseCenterDelta:cityAdapt.metrics.baseCenterDelta,vertices:cityAdapt.metrics.vertices}
  };

  state.ready=true;
  document.getElementById('rdy').textContent='yes';
  document.getElementById('sid').textContent=String(state.stream.key).split('/').slice(-2).join('/');
  document.getElementById('cid').textContent=state.city.id;
  document.getElementById('height').textContent=Math.max(state.adapter.stream.heightDelta,state.adapter.city.heightDelta).toFixed(4)+'m';
  document.getElementById('center').textContent=Math.max(state.adapter.stream.centerDelta,state.adapter.city.centerDelta).toFixed(4)+'m';
  document.getElementById('tiles').textContent=(state.tiles.ready||0)+'/'+(state.tiles.loading||0)+'/'+(state.tiles.failed||0);
  document.getElementById('facts').textContent='stream '+state.stream.points+' pts / '+state.stream.heightM.toFixed(1)+'m · city '+state.city.points+' pts / '+state.city.heightM.toFixed(1)+'m · same Elastic V2 shell+roof functions';
  layout('source',streamDonorCenter,streamCityCenter,cityCenter);
}
document.getElementById('source').onclick=function(){layout('source',streamDonorCenter,streamCityCenter,cityCenter);};
document.getElementById('adapted').onclick=function(){layout('adapted',streamDonorCenter,streamCityCenter,cityCenter);};
document.getElementById('all').onclick=function(){layout('all',streamDonorCenter,streamCityCenter,cityCenter);};
addEventListener('resize',function(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);});
renderer.setAnimationLoop(function(){controls.update();if(geo&&!freezeGeo)geo.onFrameUpdate();renderer.render(scene,camera);});
boot().catch(fatal);