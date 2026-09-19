export function sampleLivingToyState(opts={}){
  const time=Number(opts.time||0),bpm=Math.max(30,Math.min(240,Number(opts.bpm||112))),intensity=Math.max(0,Math.min(1,Number(opts.intensity??.65)));
  const mode=opts.mode||'idle',externalBeat=opts.beat;
  const phase=time*bpm/60*Math.PI*2;
  const syntheticBeat=mode==='disco'?Math.pow(Math.max(0,Math.sin(phase)),10):0;
  const beat=Math.max(0,Math.min(1,externalBeat==null?syntheticBeat:Number(externalBeat)));
  const idle=.5+.5*Math.sin(time*.85);
  const impact=Math.max(0,Math.min(1,Number(opts.impact||0)));
  const direction=Number(opts.direction||1)>=0?1:-1;
  const pulse=(.008+.012*intensity)*idle+(.018+.052*intensity)*beat+.07*impact;
  const sy=1+pulse,sxz=1/Math.sqrt(Math.max(.7,sy));
  return {
    scale:{x:sxz,y:sy,z:sxz},
    tiltZ:direction*impact*(.025+.055*intensity)+Math.sin(time*.43)*.006*intensity,
    swayY:Math.sin(time*.31)*.008*intensity,
    offsetX:direction*impact*(.18+.42*intensity),
    accent:Math.max(.05,Math.min(1,.08+beat*.72+impact*.95)),
    secondaryWobble:Math.sin(time*1.7)*(.01+.018*intensity)+direction*impact*.045,
    beat,syntheticBeat,idle,impact
  };
}

export function createLivingToyReactor(THREE,view,opts={}){
  let mode=opts.mode||'idle',bpm=Number(opts.bpm||112),intensity=Number(opts.intensity??.65);
  let impact=0,impactVelocity=0,direction=1,lastTime=0,externalBeat=null;
  const baseAccent=[];
  for(const zone of ['accent','glazing']){
    for(const mat of view.materialsByZone.get(zone)||[]){
      if(!mat.emissive)continue;
      baseAccent.push({mat,color:mat.color.clone(),baseIntensity:mat.emissiveIntensity||0});
      mat.emissive.copy(mat.color).multiplyScalar(.08);
      mat.emissiveIntensity=.15;
    }
  }
  function triggerImpact(strength=1,dir=1){
    impact=Math.max(impact,Math.max(0,Math.min(1,Number(strength)||0)));
    impactVelocity=Math.max(impactVelocity,.9+impact*.7);direction=Number(dir)>=0?1:-1;
  }
  function setSignal(signal={}){
    if(signal.mode)mode=signal.mode;
    if(signal.bpm!=null)bpm=signal.bpm;
    if(signal.intensity!=null)intensity=signal.intensity;
    if(signal.beat!=null)externalBeat=Math.max(0,Math.min(1,Number(signal.beat)));
    if(signal.impact!=null&&signal.impact>0)triggerImpact(signal.impact,signal.direction??direction);
  }
  function update(time){
    const dt=Math.max(0,Math.min(.05,time-lastTime||0));lastTime=time;
    if(impact>0||impactVelocity>0){
      impactVelocity-=dt*(3.2+impact*1.8);
      impact=Math.max(0,impact-dt*(1.7+impactVelocity*.35));
      if(impact===0)impactVelocity=0;
    }
    const s=sampleLivingToyState({time,bpm,intensity,mode,beat:externalBeat,impact,direction});
    externalBeat=null;
    view.body.scale.set(s.scale.x,s.scale.y,s.scale.z);
    view.body.rotation.z=s.tiltZ;view.body.rotation.y=s.swayY;view.body.position.x=s.offsetX;
    const soft=view.groups.get('secondarySoft');
    if(soft){soft.rotation.z=s.secondaryWobble;soft.rotation.y=-s.secondaryWobble*.55;}
    for(const {mat} of baseAccent){mat.emissive.copy(mat.color).multiplyScalar(.12+.42*s.accent);mat.emissiveIntensity=.25+.95*s.accent;}
    view.root.userData.kfbLivingToy={mode,bpm,intensity,state:s,owner:'presentation-preview',audioOwner:'external',physicsOwner:'external'};
    return s;
  }
  function reset(){
    mode='idle';impact=impactVelocity=0;externalBeat=null;
    view.body.scale.set(1,1,1);view.body.rotation.set(0,0,0);view.body.position.set(0,0,0);
    const soft=view.groups.get('secondarySoft');if(soft)soft.rotation.set(0,0,0);
  }
  return {
    update,triggerImpact,setSignal,reset,
    setMode:v=>{mode=v||'idle';},
    setBpm:v=>{bpm=Math.max(30,Math.min(240,Number(v)||112));},
    setIntensity:v=>{intensity=Math.max(0,Math.min(1,Number(v)||0));},
    get state(){return {mode,bpm,intensity,impact,direction};}
  };
}
