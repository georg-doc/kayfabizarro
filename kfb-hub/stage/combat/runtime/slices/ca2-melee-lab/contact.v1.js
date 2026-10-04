const EPS=1e-9;
const clamp01=(x)=>Math.max(0,Math.min(1,x));
const v=(p)=>({x:+p.x||0,y:+p.y||0,z:+p.z||0});
const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const mul=(a,s)=>({x:a.x*s,y:a.y*s,z:a.z*s});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const len2=(a)=>dot(a,a);
const lerp=(a,b,t)=>add(mul(a,1-t),mul(b,t));
const dist=(a,b)=>Math.sqrt(len2(sub(a,b)));

export function closestSegmentSegment(a0,a1,b0,b1){
  a0=v(a0);a1=v(a1);b0=v(b0);b1=v(b1);
  const d1=sub(a1,a0),d2=sub(b1,b0),r=sub(a0,b0);
  const a=len2(d1),e=len2(d2),f=dot(d2,r);
  let s=0,t=0;
  if(a<=EPS&&e<=EPS){
    const pointA=a0,pointB=b0;
    return {s,t,pointA,pointB,distance:dist(pointA,pointB)};
  }
  if(a<=EPS){
    s=0;t=clamp01(f/e);
  }else{
    const c=dot(d1,r);
    if(e<=EPS){
      t=0;s=clamp01(-c/a);
    }else{
      const b=dot(d1,d2),denom=a*e-b*b;
      s=Math.abs(denom)>EPS?clamp01((b*f-c*e)/denom):0;
      t=(b*s+f)/e;
      if(t<0){t=0;s=clamp01(-c/a);}
      else if(t>1){t=1;s=clamp01((b-c)/a);}
    }
  }
  const pointA=add(a0,mul(d1,s)),pointB=add(b0,mul(d2,t));
  return {s,t,pointA,pointB,distance:dist(pointA,pointB)};
}

export function sweptSegmentVsCapsule(previous,current,hurt,options={}){
  const steps=Math.max(1,Math.floor(options.steps||12));
  const weaponRadius=Math.max(0,+options.weaponRadius||0);
  const hurtRadius=Math.max(0,+options.hurtRadius||0);
  const threshold=weaponRadius+hurtRadius;
  let best=null;
  for(let i=0;i<=steps;i++){
    const alpha=i/steps;
    const root=lerp(previous.root,current.root,alpha);
    const tip=lerp(previous.tip,current.tip,alpha);
    const q=closestSegmentSegment(root,tip,hurt.a,hurt.b);
    const row={...q,alpha,root,tip,threshold,penetration:threshold-q.distance,
      contactPoint:mul(add(q.pointA,q.pointB),0.5)};
    if(!best||row.distance<best.distance)best=row;
    if(row.distance<=threshold+EPS)return {hit:true,...row};
  }
  return {hit:false,...best};
}

export function insideActiveWindow(normalized,window){
  if(!Array.isArray(window)||window.length!==2)return false;
  return normalized>=window[0]-EPS&&normalized<=window[1]+EPS;
}

export class AttackLedger{
  constructor(attackId){this.attackId=String(attackId);this.targets=new Set();}
  consumed(targetId){return this.targets.has(String(targetId));}
  confirm(targetId,contact,extra={}){
    const key=String(targetId);
    if(this.targets.has(key))return null;
    this.targets.add(key);
    return {type:'melee.hit',attackId:this.attackId,targetId:key,contact,...extra};
  }
}

export function motionEnvelope(samples,threshold=0.35){
  if(!Array.isArray(samples)||samples.length<3)throw new Error('motionEnvelope needs >=3 samples');
  const speeds=[];
  for(let i=1;i<samples.length;i++){
    const dt=Math.max(EPS,samples[i].time-samples[i-1].time);
    speeds.push(dist(samples[i].tip,samples[i-1].tip)/dt);
  }
  let peak=0;
  for(let i=1;i<speeds.length;i++)if(speeds[i]>speeds[peak])peak=i;
  const cut=speeds[peak]*Math.max(0,Math.min(1,threshold));
  let lo=peak,hi=peak;
  while(lo>0&&speeds[lo-1]>=cut)lo--;
  while(hi+1<speeds.length&&speeds[hi+1]>=cut)hi++;
  const duration=samples[samples.length-1].time-samples[0].time||1;
  const t0=samples[0].time;
  return {
    peakSpeed:speeds[peak],
    activeStart:(samples[lo].time-t0)/duration,
    peak:(samples[peak+1].time-t0)/duration,
    activeEnd:(samples[Math.min(samples.length-1,hi+1)].time-t0)/duration
  };
}
