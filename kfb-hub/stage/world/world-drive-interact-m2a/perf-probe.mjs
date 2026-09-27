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

export function mountPerfProbe({app,mobility,quality,bootStartedAt,sampleMs=8000}){
  const out=document.createElement('output');
  out.id='m2a-perf-output';
  out.hidden=true;
  document.body.append(out);
  const frames=[];
  const params=new URLSearchParams(location.search);
  const scenario=params.get('scenario')||'idle',diagnostic=params.get('diagnostic')||'none';
  if(diagnostic==='no-shadows')app.renderer.shadowMap.enabled=false;
  if(diagnostic==='no-city'&&app.world.city?.group)app.world.city.group.visible=false;
  if(diagnostic==='low-res')(quality?.setOverride?quality.setOverride(.6):app.renderer.setPixelRatio(.6));
  const key=(type,code)=>dispatchEvent(new KeyboardEvent(type,{code,bubbles:true,cancelable:true}));
  const cleanup=[];
  if(scenario==='walk'){
    key('keydown','KeyW');cleanup.push(()=>key('keyup','KeyW'));
  }else if(scenario==='drive-offroad'){
    mobility.interact({source:'R1 performance probe'});
    key('keydown','KeyW');key('keydown','KeyD');
    cleanup.push(()=>key('keyup','KeyW'),()=>key('keyup','KeyD'));
    setTimeout(()=>key('keyup','KeyD'),1800);
  }
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
    const phase=window.__m2aRuntimePerf;
    const phaseAvg=phase?Object.fromEntries(Object.entries(phase.total).map(([key,value])=>[key,+(value/Math.max(1,phase.frames)).toFixed(3)])):null;
    return {
      schema:'kfb.world-m2a-perf/1',complete,scenario,diagnostic,
      bootToControlMs:+(started-bootStartedAt).toFixed(1),
      sampleMs:+(performance.now()-started).toFixed(1),
      frame:{count:frames.length,medianMs:percentile(frames,.5),p95Ms:percentile(frames,.95),p99Ms:percentile(frames,.99),long50:frames.filter(v=>v>50).length,long100:frames.filter(v=>v>100).length},
      renderer:{pixelRatio:app.renderer.getPixelRatio(),calls:render.calls,triangles:render.triangles,lines:render.lines,points:render.points,textures:memory.textures,geometries:memory.geometries},
      phaseAvgMs:phaseAvg,quality:quality?.report?.()||null,
      scene:sceneFacts(app),
      mobility:{mode:report.mode,ground:report.ground,drive:report.drive,flight:report.flight}
    };
  };
  const write=()=>{out.textContent=JSON.stringify(snapshot());};
  function finish(){if(complete)return;cleanup.forEach(fn=>fn());complete=true;write();document.body.dataset.m2aPerfReady='true'}
  raf=requestAnimationFrame(sample);
  const interval=setInterval(()=>{write();if(complete)clearInterval(interval)},250);
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);clearInterval(interval)},{once:true});
  write();
  return {snapshot,finish};
}
