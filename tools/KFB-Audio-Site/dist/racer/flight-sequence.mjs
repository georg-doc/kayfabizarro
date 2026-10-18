// Synthetic Audio-owned audition only. Actual World physics/event ownership is external.
// Driven ONLY by the injected AudioContext.currentTime and the existing host tick.
export const FLIGHT_PHASES=['Start','Beschleunigen','Banking','Steigen','Luftbremse','Einschlag','Kaskade','Ausklang'];
export function flightFrame(elapsed,profile='jetpack'){
 const t=Math.max(0,elapsed);let speedKmh=0,throttle=.2,bank=0,vertical=0,airbrake=0,phase=0;
 if(t<3){throttle=.2+.2*t/3;speedKmh=t*3;}
 else if(t<9){phase=1;throttle=.9;speedKmh=9+(t-3)*16;}
 else if(t<14){phase=2;throttle=.8;speedKmh=105;bank=Math.sin((t-9)/5*Math.PI*2)*.85;}
 else if(t<18){phase=3;throttle=.9;vertical=.75;speedKmh=105-(t-14)*8.75;}
 else if(t<21){phase=4;throttle=.1;airbrake=.9;speedKmh=70-(t-18)*13.33;vertical=-.2;}
 else{phase=t<21.3?5:t<26?6:7;throttle=0;speedKmh=0;}
 return {phase:FLIGHT_PHASES[phase],phaseIndex:phase,telemetry:{mode:profile,speedKmh,throttle,bank,vertical,airbrake,brake:airbrake,geared:false,engineOn:t<21}};
}
export function createFlightSequence({audioContext:ctx,racer,combat,onPhase=()=>{}}={}){
 if(!ctx||!racer||!combat)throw Error('Inject existing context, Racer and Combat consumers');
 let running=false,startedAt=0,profile='jetpack',material='wood',index=0,run=0,phase=-1,late=0;const log=[];
 const cues=[{at:1,kind:'boost'},{at:21,kind:'impact',root:'crash'},{at:21.16,kind:'fracture',root:'crash'},{at:21.6,kind:'contact',root:'crash'},{at:22,kind:'contact',root:'crash'},{at:22.2,kind:'impact',root:'secondary',material:'stone'},{at:22.4,kind:'fracture',root:'secondary',material:'stone'},{at:22.7,kind:'contact',root:'crash'},{at:23.1,kind:'contact',root:'secondary',material:'stone'},{at:23.65,kind:'contact',root:'crash'},{at:24.2,kind:'contact',root:'secondary',material:'stone'},{at:25.1,kind:'settle',root:'crash'},{at:25.7,kind:'settle',root:'secondary',material:'stone'}];
 function start(options={}){if(!['prop','jet','jetpack','turbine','antigrav'].includes(options.profile||'jetpack')||!['wood','stone','crystal'].includes(options.material||'wood'))throw Error('Invalid flight audition');profile=options.profile||'jetpack';material=options.material||'wood';running=true;startedAt=ctx.currentTime;index=0;phase=-1;late=0;run++;log.length=0;racer.control('manual');tick();return snapshot();}
 function stop(){running=false;index=cues.length;racer.stop();combat.stop();return snapshot();}
 function tick(){if(!running)return;const elapsed=ctx.currentTime-startedAt;if(elapsed>=30){stop();log.push({type:'complete',at:ctx.currentTime,elapsed});return;}const frame=flightFrame(elapsed,profile);racer.setTelemetry(frame.telemetry);if(frame.phaseIndex!==phase){phase=frame.phaseIndex;onPhase({...frame,at:ctx.currentTime,elapsed});log.push({type:'phase',phase:frame.phase,at:ctx.currentTime,elapsed});}
  while(index<cues.length&&cues[index].at<=elapsed){const c=cues[index],key='flight-'+run+'-'+startedAt+'-'+index;index++;if(elapsed-c.at>.15){late++;log.push({type:'late-dropped',key,at:ctx.currentTime});continue;}
   if(c.kind==='boost')racer.emit({type:'boost'});else combat.emit({type:'destruction',id:key,cascadeId:'flight-'+run+'-'+startedAt+'-'+c.root,phase:c.kind,explosive:c.kind==='impact',material:c.material||material,position:{x:c.root==='secondary'?5:0,y:0,z:-6},energy:c.kind==='impact'?.8:c.kind==='fracture'?.6:.4});log.push({type:'cue',key,kind:c.kind,plannedAt:startedAt+c.at,dispatchedAt:ctx.currentTime,synthetic:true});
  }
 }
 function snapshot(){const elapsed=running?Math.min(30,ctx.currentTime-startedAt):log.some(e=>e.type==='complete')?30:0;return {schema:'kfb.flight-crash-audition/1',running,profile,material,elapsed,phase:FLIGHT_PHASES[Math.max(0,phase)],dispatched:index,late,clock:'injected AudioContext.currentTime / existing host tick',worldIntegration:false,log:log.slice()};}
 return {start,stop,tick,snapshot};
}
