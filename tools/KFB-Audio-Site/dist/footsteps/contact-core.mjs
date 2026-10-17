// DOM/audio-free contact seam. The caller supplies authoritative support and animation phase.
export function entries(profile,{duration=0,minStanceSeconds=.07}={}){
  const n=profile.frames,out=[];
  for(const foot of ['l','r']){
    const iv=profile.contacts[`foot.${foot}`].planted;
    if(iv.length===1&&iv[0][0]===1&&iv[0][1]===n)continue;
    for(const [start,end] of iv){if(start===1&&iv.at(-1)[1]===n)continue;
      const wraps=end===n&&iv[0][0]===1;
      const span=end-start+(wraps?iv[0][1]-1:0);
      // Height-threshold grazing is not a stable plant. Preserve raw intervals, qualify >=70ms.
      if(duration&&span/(n-1)*duration<minStanceSeconds)continue;
      out.push({foot,phase:(start-1)/(n-1)});}
  }
  return out.sort((a,b)=>a.phase-b.phase);
}
export function crossings(points,from,to){
  if(to<=from||to-from>2)return []; // suspended/background frame: never replay a backlog
  const out=[];for(let cycle=Math.floor(from)-1;cycle<=Math.floor(to);cycle++)for(const p of points){const at=cycle+p.phase;if(at>from+1e-9&&at<=to+1e-9)out.push({...p,at,key:`${cycle}:${p.foot}:${p.phase}`});}
  return out.sort((a,b)=>a.at-b.at);
}
export class ContactTimeline{
  constructor(){this.reset();}
  reset(){this.previous=null;this.owner=null;this.last=new Map();this.grounded=true;this.landTime=-Infinity;this.cues=[];this.suppressed=0;}
  support(grounded,time,surface){const landed=!this.grounded&&grounded;this.grounded=grounded;if(landed){this.landTime=time;return this.accept({kind:'land',foot:'both',time,surface,key:`land:${time}`});}return null;}
  accept(cue){const key=cue.kind==='land'?'land':cue.foot;if(cue.time-(this.last.get(key)??-Infinity)<.12){this.suppressed++;return null;}this.last.set(key,cue.time);this.cues.push(cue);if(this.cues.length>3000)this.cues.shift();return cue;}
  advance({owner,phase,duration,time,points,moving,surfaceAt}){
    if(this.owner!==owner||!moving||!this.grounded){this.owner=owner;this.previous=phase;return [];}
    const previous=this.previous;this.previous=phase;if(previous==null)return [];
    return crossings(points,previous,phase).flatMap(p=>{const at=time-(phase-p.at)*duration;if(at-this.landTime<.16)return [];const c=this.accept({kind:'footstep',foot:p.foot,time:at,phase:p.phase,surface:surfaceAt(p.foot),key:`${owner}:${p.key}`});return c?[c]:[];});
  }
  packet(){return {schema:'kfb.performance/1',sfx:this.cues.map(c=>({at:c.time,type:c.kind,surface:c.surface,foot:c.foot})),vfx:[],lights:[]};}
}
export function chooseIndex(count,previous,random=Math.random){if(count<2)return 0;const pick=Math.floor(random()*(count-1));return pick>=previous?pick+1:pick;}
