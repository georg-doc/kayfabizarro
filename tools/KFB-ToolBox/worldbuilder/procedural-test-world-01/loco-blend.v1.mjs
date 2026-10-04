// Consumer of the pinned Motion #344 contract; no clip choices or retiming here.
export function sampleLoco(anchors, speed, phase, idleClock) {
  speed=Math.min(Math.abs(speed),anchors.at(-1).speed);
  let hi=anchors.findIndex(a=>a.speed>=speed);if(hi<0)hi=anchors.length-1;
  const lo=Math.max(0,hi-1),span=anchors[hi].speed-anchors[lo].speed;
  const t=span?(speed-anchors[lo].speed)/span:0;
  const rows=(lo===hi?[[anchors[lo],1]]:[[anchors[lo],1-t],[anchors[hi],t]])
    .filter(([,w])=>w>1e-8).map(([a,weight])=>({...a,weight,time:a.role==='idle'?idleClock%a.cycleT:((phase+a.leftFootDownPhase)%1+1)%1*a.cycleT}));
  const gait=rows.filter(a=>a.role!=='idle'),weight=gait.reduce((s,a)=>s+a.weight,0);
  return {rows,phaseRate:weight?gait.reduce((s,a)=>s+a.weight/a.cycleT,0)/weight:0};
}
