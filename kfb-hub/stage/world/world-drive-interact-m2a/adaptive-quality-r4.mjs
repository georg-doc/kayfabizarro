const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export function mountAdaptiveQualityR4({app,mobility}){
  if(!app?.renderer||!mobility?.report)throw Error('R4 quality needs the existing renderer and mobility owners');

  const renderer=app.renderer;
  const deviceRatio=Math.max(.5,Number(globalThis.devicePixelRatio)||1);
  const narrow=()=>innerWidth<=620;
  // R6: the previous 0.60/0.65 movement profile met the synthetic frame gate,
  // but visibly rasterised roads, kerbs and shadows during actual exploration.
  // Keep the adaptive budget, with a floor that remains reviewable in motion.
  const ratioFor=state=>Math.min(deviceRatio,state==='moving'?(narrow()?.72:.80):(narrow()?.82:.95));
  const movingKeys=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight','Space','KeyQ','KeyR','KeyB']);
  const held=new Set();
  let state='moving',ratio=0,lastMotionAt=performance.now(),lastChangeAt=0,override=null,changes=0;

  function mobilityMoving(){
    const report=mobility.report();
    if(held.size)return true;
    if(report.mode==='drive')return Math.abs(report.drive?.speedKmh||0)>.6;
    if(report.mode==='flight')return Math.abs(report.flight?.speed||0)>.15;
    return Math.abs(report.ground?.speed||0)>.05;
  }
  function apply(next,reason){
    const wanted=override??ratioFor(next);
    if(next===state&&Math.abs(wanted-ratio)<.005)return;
    state=next;ratio=wanted;lastChangeAt=performance.now();changes++;
    renderer.setPixelRatio(ratio);
    document.body.dataset.m2aQuality=state;
    dispatchEvent(new CustomEvent('kfb-world-quality',{detail:{state,ratio,reason}}));
  }
  function update(reason='sample'){
    const now=performance.now(),moving=mobilityMoving();
    if(moving){lastMotionAt=now;apply('moving',reason);return report()}
    if(state==='moving'&&now-lastMotionAt>=1400&&now-lastChangeAt>=850)apply('stable',reason);
    else if(state==='stable')apply('stable',reason);
    return report();
  }
  const down=event=>{if(movingKeys.has(event.code)){held.add(event.code);lastMotionAt=performance.now();apply('moving','input')}};
  const up=event=>{held.delete(event.code);lastMotionAt=performance.now()};
  addEventListener('keydown',down,{capture:true});addEventListener('keyup',up,{capture:true});
  addEventListener('blur',()=>{held.clear();lastMotionAt=performance.now()});
  const resized=()=>apply(state,'viewport');addEventListener('resize',resized,{passive:true});
  const timer=setInterval(()=>update(),160);
  function setOverride(value){override=value==null?null:clamp(Number(value)||.6,.5,1);apply(state,'override');return report()}
  function report(){return {schema:'kfb.world-adaptive-quality-r4/1',profile:'ADAPTIVE_RESOLUTION_CLAY_DISTANCE_R4_R6_READABILITY_FLOOR',state,pixelRatio:+ratio.toFixed(2),movingRatio:+ratioFor('moving').toFixed(2),stableRatio:+ratioFor('stable').toFixed(2),idleDelayMs:1400,narrow:narrow(),cssUiNativeResolution:true,changes,override}}
  function dispose(){clearInterval(timer);removeEventListener('keydown',down,{capture:true});removeEventListener('keyup',up,{capture:true});removeEventListener('resize',resized)}
  apply('moving','mount');
  return {update,report,setOverride,dispose,get state(){return state}};
}
