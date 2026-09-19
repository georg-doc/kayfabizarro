const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>t*t*(3-2*t);
const remap=(v,a,b)=>clamp((v-a)/(b-a));

export const INTEGRATED_DOM_POSITION=Object.freeze({x:-150,z:165});

export function terrainHeightAt(x,z){
  const radial=Math.hypot(x,z);
  const urban=smooth(remap(radial,210,360));
  const domDist=Math.hypot(x-INTEGRATED_DOM_POSITION.x,z-INTEGRATED_DOM_POSITION.z);
  const domPad=smooth(remap(domDist,52,92));
  const mask=Math.min(urban,domPad);
  const broad=Math.sin(x*.0107+1.2)*Math.cos(z*.0093-.7);
  const detail=Math.sin((x+z)*.021)*.45+Math.cos((x-z)*.017)*.32;
  return (broad*13+detail*5)*mask;
}

function colorForHeight(THREE,x,z,y){
  const warm=.5+.5*Math.sin(x*.018+z*.011);
  const elevation=clamp((y+18)/36);
  const low=new THREE.Color('#5c8a49');
  const mid=new THREE.Color(warm>.58?'#89933d':'#6d9851');
  const high=new THREE.Color('#9b8a5a');
  const c=low.clone().lerp(mid,clamp(elevation*1.15));
  if(elevation>.63)c.lerp(high,(elevation-.63)/.37);
  return c;
}

export function createTerrainHost(THREE,materialSystem,opts={}){
  const size=Number(opts.size||900),segments=Math.max(16,Number(opts.segments||96)|0);
  const geo=new THREE.PlaneGeometry(size,size,segments,segments);
  geo.rotateX(-Math.PI/2);
  const pos=geo.attributes.position,colors=new Float32Array(pos.count*3);
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),z=pos.getZ(i),y=terrainHeightAt(x,z)-.18;
    pos.setY(i,y);
    const c=colorForHeight(THREE,x,z,y);
    colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
  }
  geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  geo.computeVertexNormals();
  const mat=new THREE.MeshPhongMaterial({vertexColors:true,flatShading:true,shininess:4});
  const mesh=new THREE.Mesh(geo,mat);
  mesh.name='tinyskies-like-terrain-host';
  mesh.receiveShadow=true;
  mesh.userData={
    role:'TERRAIN_HOST',
    donor:'TinySkies source-backed visual grammar',
    grounding:'urban and landmark pads flatten to y=0'
  };
  return {
    mesh,
    heightAt:terrainHeightAt,
    domPosition:{...INTEGRATED_DOM_POSITION},
    dispose(){geo.dispose();mat.dispose();}
  };
}
