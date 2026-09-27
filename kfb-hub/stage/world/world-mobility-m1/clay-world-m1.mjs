import {mountClayBound} from './runtime/worldbuilder/presentation/claybound-presentation.v1.js';

function claySurface(source,color,key){
  const m=source.clone();m.map=source.map;m.color.set(color);m.roughness=.98;m.metalness=0;m.name=(source.name||key)+':ClayWorld-M1';
  m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat c0w=sin(position.x*.105)*sin(position.z*.087)+.45*sin((position.x+position.z)*.19);\ntransformed+=normal*c0w*.018;');};
  m.customProgramCacheKey=()=>`clay-world-m1:${key}`;m.needsUpdate=true;return m;
}
export async function mountClayWorld(app){
  const top=document.querySelector('#top');
  if(top&&!top.querySelector(':scope > .col:last-child')){const host=document.createElement('div');host.className='col';host.hidden=true;top.appendChild(host)}
  const base=mountClayBound(app),terrain=app.terrain,city=app.world.city,far=app.scene.getObjectByName('far-ground');
  if(!terrain||!city?.plate)throw Error('Clay C0 needs World r2 terrain and city plate');
  const originals={terrain:terrain.material,plate:city.plate.material,far:far?.material||null};
  const clay={terrain:claySurface(originals.terrain,0xf2dfbd,'terrain'),plate:claySurface(originals.plate,0xf4dfc8,'osm-ground'),far:originals.far?claySurface(originals.far,0x8fae68,'far-ground'):null};
  const setBase=base.setMode.bind(base);let mode='original';
  function setMode(next){mode=next==='clay'?'clay':'original';const on=mode==='clay';setBase(on?'claybound':'original');terrain.material=on?clay.terrain:originals.terrain;city.plate.material=on?clay.plate:originals.plate;if(far&&clay.far)far.material=on?clay.far:originals.far;document.body.dataset.m1Look=mode;return report()}
  const heights=(city.support?.records||[]).map(r=>{const p=city.blocks.geometry.attributes.position;let lo=Infinity,hi=-Infinity;for(let i=r.walls[0];i<r.walls[0]+r.walls[1];i++){lo=Math.min(lo,p.getY(i));hi=Math.max(hi,p.getY(i))}return hi-lo}).filter(Number.isFinite);
  function report(){return {schema:'kfb.clay-world-m1/1',mode,world:app.world.id,buildingCount:heights.length,buildingHeightM:heights.length?[+Math.min(...heights).toFixed(2),+Math.max(...heights).toFixed(2)]:[],surfaces:['terrain','OSM ground map','building walls','roofs'],reversible:true,collisionOwner:'World r2 ground/contact',visualSurfaceAmplitudeM:.018}}
  setMode(new URLSearchParams(location.search).get('look')==='clay'?'clay':'original');
  return {setMode,report,get mode(){return mode}};
}
