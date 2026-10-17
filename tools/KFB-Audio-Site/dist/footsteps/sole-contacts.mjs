// Contact truth comes from the SAME skinned vertices that are rendered, not ankle height.
export function makeSoles(THREE,actor){
 const soles={l:[],r:[]},v=new THREE.Vector3();
 actor.traverse(mesh=>{if(!mesh.isSkinnedMesh)return;const g=mesh.geometry,ix=g.attributes.skinIndex,w=g.attributes.skinWeight;
  for(let i=0;i<g.attributes.position.count;i++){
   for(const foot of ['l','r']){let weight=0;for(const method of ['getX','getY','getZ','getW']){const bone=mesh.skeleton.bones[ix[method](i)];if(bone&&new RegExp('^(foot|toes)\\.?'+foot+'$','i').test(bone.name))weight+=w[method](i);}if(weight>.65)soles[foot].push({mesh,index:i});}
  }
 });
 if(!soles.l.length||!soles.r.length)throw Error('Actual skinned foot vertices missing');
 return {counts:{l:soles.l.length,r:soles.r.length},height(foot){let y=Infinity;actor.updateMatrixWorld(true);for(const {mesh,index} of soles[foot]){mesh.getVertexPosition(index,v);mesh.localToWorld(v);y=Math.min(y,v.y);}return y;}};
}
export function measureSoleContacts(THREE,{mixer,clip,actor,soles}){
 const action=mixer.clipAction(clip);action.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
 const frames=Math.ceil(clip.duration*240),curves={l:[],r:[]},points=[],candidates={};
 for(let i=0;i<frames;i++){action.time=i/frames*clip.duration;mixer.update(0);actor.updateMatrixWorld(true);for(const foot of ['l','r'])curves[foot].push(soles.height(foot));}
 for(const foot of ['l','r']){
  const ys=curves[foot],min=Math.min(...ys),max=Math.max(...ys);if(max-min<.01)throw Error('No genuine sole lift: '+foot);
  const threshold=min+.002,intervals=[];
  for(let i=0;i<frames;i++)if(ys[i]<=threshold&&ys[(i+frames-1)%frames]>threshold){let span=0;while(span<frames&&ys[(i+span)%frames]<=threshold)span++;intervals.push({i,span});}
  if(!intervals.length)throw Error('No sole contact window');
  // Longest near-floor support window, not brief toe/heel grazes.
  candidates[foot]=intervals.map(item=>({foot,phase:item.i/frames,soleY:ys[item.i],floorY:min,lift:max-min,supportSeconds:item.span/frames*clip.duration}));
 }
 let best=null;
 for(const l of candidates.l)for(const r of candidates.r){const gap=(r.phase-l.phase+1)%1,cost=Math.abs(gap-.5)*100-l.supportSeconds-r.supportSeconds;if(!best||cost<best.cost)best={l,r,cost};}
 points.push(best.l,best.r);action.stop();return {clip:clip.name,duration:clip.duration,frames,entries:points.sort((a,b)=>a.phase-b.phase),soleVertices:soles.counts,curves,contactBasis:'skinned sole vertices / 2mm support-window entry'};
}
