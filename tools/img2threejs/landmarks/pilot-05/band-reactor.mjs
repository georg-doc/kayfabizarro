export function sampleBandVibe(opts={}){
  const time=Number(opts.time||0),bpm=Math.max(30,Math.min(240,Number(opts.bpm||112))),intensity=Math.max(0,Math.min(1,Number(opts.intensity??.65)));
  const mode=opts.mode||'idle',impact=Math.max(0,Math.min(1,Number(opts.impact||0))),direction=Number(opts.direction||1)>=0?1:-1;
  const phase=time*bpm/60*Math.PI*2;
  const beat=mode==='disco'?Math.pow(Math.max(0,Math.sin(phase)),10):0;
  const idle=.5+.5*Math.sin(time*.85);
  const breathe=(.006+.010*intensity)*idle+(.012+.035*intensity)*beat;
  return {
    rootScaleY:1+breathe,
    rootScaleXZ:1/Math.sqrt(1+breathe),
    rootTiltZ:Math.max(-.065,Math.min(.065,direction*impact*(.02+.04*intensity)+Math.sin(time*.43)*.004*intensity)),
    rootOffsetX:direction*impact*(.12+.30*intensity),
    beat,idle,impact,
    bands:{
      lower:1+beat*.006*intensity,
      clock:1+beat*.026*intensity,
      belfry:1+Math.pow(Math.max(0,Math.sin(phase-.35)),10)*.018*intensity,
      tent:1+Math.pow(Math.max(0,Math.sin(phase-.7)),10)*.030*intensity
    },
    accent:Math.max(.05,Math.min(1,.08+beat*.72+impact*.95))
  };
}

export function createBandVibeReactor(THREE,view,opts={}){
  let mode=opts.mode||'idle',bpm=Number(opts.bpm||112),intensity=Number(opts.intensity??.65),impact=0,direction=1,lastTime=0;
  function triggerImpact(strength=1,dir=1){impact=Math.max(impact,Math.max(0,Math.min(1,Number(strength)||0)));direction=Number(dir)>=0?1:-1;}
  function update(time){
    const dt=Math.max(0,Math.min(.05,time-lastTime||0));lastTime=time;impact=Math.max(0,impact-dt*1.8);
    const s=sampleBandVibe({time,bpm,intensity,mode,impact,direction});
    view.root.scale.set(s.rootScaleXZ,s.rootScaleY,s.rootScaleXZ);view.root.rotation.z=s.rootTiltZ;view.root.position.x=s.rootOffsetX;
    for(const [id,group] of view.bandGroups){const k=s.bands[id]||1;group.scale.set(k,1+(k-1)*.65,k);}
    for(const zone of ['accent','glazing'])for(const mat of view.materialsByZone.get(zone)||[]){
      mat.emissive.copy(mat.color).multiplyScalar(.10+.35*s.accent);mat.emissiveIntensity=.25+.9*s.accent;
    }
    view.root.userData.kfbLivingToy={owner:'presentation-preview',audioOwner:'external',physicsOwner:'external',mode,bpm,intensity,state:s};
    return s;
  }
  function reset(){
    view.root.scale.set(1,1,1);view.root.rotation.set(0,0,0);view.root.position.set(0,0,0);
    for(const group of view.bandGroups.values())group.scale.set(1,1,1);
    impact=0;
  }
  return {
    update,reset,triggerImpact,
    setMode:v=>{mode=v||'idle';},
    setBpm:v=>{bpm=Math.max(30,Math.min(240,Number(v)||112));},
    setIntensity:v=>{intensity=Math.max(0,Math.min(1,Number(v)||0));},
    get state(){return {mode,bpm,intensity,impact,direction};}
  };
}
