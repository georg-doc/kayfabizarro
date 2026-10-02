import {createPlanarTinySampler} from './tiny-surface-noise.mjs';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

function hexMix(THREE,a,b,t){
  return new THREE.Color(a).lerp(new THREE.Color(b),clamp(t));
}

export function createTinySurfaceTerrain(THREE,grounding,opts={}){
  const size=Number(opts.size||720);
  const spacing=Math.max(4,Number(opts.spacing||8));
  const rowStep=spacing*Math.sqrt(3)/2;
  const rows=Math.ceil(size/rowStep)+1,cols=Math.ceil(size/spacing)+2;
  const seed=Number(opts.seed||1842);
  const heightGain=Number(opts.heightGain||22);
  const sampler=createPlanarTinySampler(seed,{metresPerDomain:Number(opts.metresPerDomain||165)});
  const verts=[],colors=[],indices=[];
  const low=opts.lowColor||'#557d49',mid=opts.midColor||'#738d50',high=opts.highColor||'#958456',rock=opts.rockColor||'#7b7466';

  function sampleHeight(x,z){
    const broad=sampler(x,z,0);
    const detail=sampler(x+61,z-37,1);
    const raw=(broad*.78+detail*.22)*heightGain;
    const support=grounding?.weightAt?.(x,z)?.weight||0;
    // City/support zones softly erase macro relief without introducing a visible pad mesh.
    return raw*Math.pow(1-support,2.15);
  }

  for(let r=0;r<rows;r++){
    const z=-size/2+r*rowStep;
    const off=(r&1)?spacing*.5:0;
    for(let c=0;c<cols;c++){
      const x=-size/2+c*spacing+off;
      const y=sampleHeight(x,z);
      verts.push(x,y,z);
      const patch=sampler(x-93,z+117,2)*.5+.5;
      const elev=clamp((y+heightGain*.45)/(heightGain*.9));
      let col=hexMix(THREE,low,mid,clamp(.2+patch*.65));
      if(elev>.55)col.lerp(new THREE.Color(high),(elev-.55)/.45);
      if(Math.abs(y)>heightGain*.58)col.lerp(new THREE.Color(rock),.25);
      colors.push(col.r,col.g,col.b);
    }
  }

  const at=(r,c)=>r*cols+c;
  for(let r=0;r<rows-1;r++){
    for(let c=0;c<cols-1;c++){
      const a=at(r,c),b=at(r,c+1),d=at(r+1,c),e=at(r+1,c+1);
      if((r&1)===0){
        indices.push(a,d,b,b,d,e);
      }else{
        indices.push(a,d,e,a,e,b);
      }
    }
  }

  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geo.setIndex(indices);
  geo.computeVertexNormals();geo.computeBoundingSphere();
  const mat=new THREE.MeshPhongMaterial({vertexColors:true,flatShading:true,shininess:8});
  const mesh=new THREE.Mesh(geo,mat);mesh.name='tiny-surface-terrain-v2';mesh.receiveShadow=true;
  mesh.userData={
    source:'TinySkies/Travel simplex recurrence',
    surface:'staggered triangular lattice',
    visibleGroundBase:false,
    grounding:grounding?.contract||null
  };

  return {
    mesh,geometry:geo,material:mat,
    heightAt:sampleHeight,
    stats:{rows,cols,vertices:verts.length/3,triangles:indices.length/3,spacing,seed},
    dispose(){geo.dispose();mat.dispose();}
  };
}
