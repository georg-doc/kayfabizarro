const percentile=(values,p)=>{
  if(!values.length)return null;
  const sorted=values.slice().sort((a,b)=>a-b);
  return sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*p))];
};

function sceneFacts(app){
  let objects=0,meshes=0,skinned=0,casters=0;
  const materials=new Set(),geometries=new Set();
  app.scene.traverse(node=>{
    objects++;
    if(!node.isMesh)return;
    meshes++;
    if(node.isSkinnedMesh)skinned++;
    if(node.castShadow)casters++;
    if(node.geometry)geometries.add(node.geometry);
    for(const material of [].concat(node.material||[]))if(material)materials.add(material);
  });
  return {objects,meshes,skinned,casters,materials:materials.size,geometries:geometries.size};
}

export function mountPerfProbe({app,mobility,bootStartedAt,sampleMs=8000}){
  const out=document.createElement('output');
  out.id='m2a-perf-output';
  out.hidden=true;
  document.body.append(out);
  const frames=[];
  let previous=performance.now(),raf=0,complete=false;
  const started=previous;
  const sample=now=>{
    frames.push(now-previous);previous=now;
    if(now-started<sampleMs)raf=requestAnimationFrame(sample);
    else finish();
  };
  const snapshot=()=>{
    const render=app.renderer.info.render,memory=app.renderer.info.memory;
    const report=mobility.report();
    return {
      schema:'kfb.world-m2a-perf/1',complete,
      bootToControlMs:+(started-bootStartedAt).toFixed(1),
      sampleMs:+(performance.now()-started).toFixed(1),
      frame:{count:frames.length,medianMs:percentile(frames,.5),p95Ms:percentile(frames,.95),p99Ms:percentile(frames,.99),long50:frames.filter(v=>v>50).length,long100:frames.filter(v=>v>100).length},
      renderer:{pixelRatio:app.renderer.getPixelRatio(),calls:render.calls,triangles:render.triangles,lines:render.lines,points:render.points,textures:memory.textures,geometries:memory.geometries},
      scene:sceneFacts(app),
      mobility:{mode:report.mode,ground:report.ground,drive:report.drive,flight:report.flight}
    };
  };
  const write=()=>{out.textContent=JSON.stringify(snapshot());};
  function finish(){if(complete)return;complete=true;write();document.body.dataset.m2aPerfReady='true'}
  raf=requestAnimationFrame(sample);
  const interval=setInterval(()=>{write();if(complete)clearInterval(interval)},250);
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);clearInterval(interval)},{once:true});
  write();
  return {snapshot,finish};
}

